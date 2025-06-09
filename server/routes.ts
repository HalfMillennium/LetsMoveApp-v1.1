import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";
import { InsertUser } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Add Clerk authentication middleware
  app.use(clerkMiddleware());

  // Helper function to get or create user
  async function getOrCreateUser(clerkId: string) {
    let user = await storage.getUserByClerkId(clerkId);
    if (!user) {
      // Create a basic user profile from Clerk data
      const newUser: InsertUser = {
        clerkId,
        email: "", // Will be updated when user syncs
        fullName: "User", // Default name
        profileImage: null,
        phoneNumber: null,
      };
      user = await storage.createUser(newUser);
    }
    return user;
  }

  const endpoint = "https://production-sfo.browserless.io/chromium/bql";
  const token = process.env.VITE_BROWSERLESS_API_KEY || "";

  async function fetchBrowserQL(url: string) {
    const response = await fetch(`${endpoint}?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation ExtractHtml($url: String!) {
          goto(url: $url, waitUntil: networkIdle) {
            status
          }
          images: mapSelector(selector: "[class^='MediaCarousel_mediaCarouselImageWrapper_']") {
            imageContainer: innerHTML
          }
          price: querySelector(selector: "[class*='PriceInfo_price__']") {
            text: innerText
          }
          specs: mapSelector(selector: "[class^='PropertyDetails_item__']") {
            item: innerText
          }
          about: querySelector(selector: "[class^='ListingDescription_shortDescription__']") {
            descriptionHtml: innerHTML # Contains the <p> elements
          }
          featuresEmbed: querySelector(selector: "[class^='Lists_listsWrapper__']") {
            featuresHtml: innerHTML
          }
          listedBy: querySelector(selector: "[class*='styled__AgentText']") {
            agentInfo: innerText
          }
        }`,
        variables: {
          url,
        },
      }),
    });

    const data = await response.json();
    console.log(data);
    return data;
  }

  // API Routes - all prefixed with /api

  // Apartments endpoints
  app.get("/api/apartments", async (req, res) => {
    try {
      // Get optional filter parameters
      const { minPrice, maxPrice, bedrooms, maxDistance, petFriendly } =
        req.query;
      const apartments = await storage.getApartments();

      // Apply filters if provided
      let filteredApartments = apartments;

      if (minPrice) {
        filteredApartments = filteredApartments.filter(
          (apt) => apt.price >= Number(minPrice),
        );
      }

      if (maxPrice) {
        filteredApartments = filteredApartments.filter(
          (apt) => apt.price <= Number(maxPrice),
        );
      }

      if (bedrooms) {
        filteredApartments = filteredApartments.filter(
          (apt) => apt.bedrooms >= Number(bedrooms),
        );
      }

      if (maxDistance) {
        filteredApartments = filteredApartments.filter((apt) => {
          // Parse the distance as a number, removing "miles" or any text
          const distance = parseFloat(apt.distance || "0");
          return distance <= Number(maxDistance);
        });
      }

      if (petFriendly === "true") {
        filteredApartments = filteredApartments.filter((apt) =>
          apt.amenities?.includes("Pet friendly"),
        );
      }

      res.json(filteredApartments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching apartments" });
    }
  });

  app.get("/api/apartments/:id", async (req, res) => {
    try {
      const apartment = await storage.getApartment(Number(req.params.id));
      if (!apartment) {
        return res.status(404).json({ message: "Apartment not found" });
      }
      res.json(apartment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching apartment" });
    }
  });

  // Favorites endpoints
  app.get("/api/favorites", async (req, res) => {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
      }

      const favorites = await storage.getFavoritesByUserId(Number(userId));
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const { userId, apartmentId } = req.body;

      if (!userId || !apartmentId) {
        return res
          .status(400)
          .json({ message: "UserId and apartmentId are required" });
      }

      const favorite = await storage.addFavorite({
        userId: Number(userId),
        apartmentId: Number(apartmentId),
      });

      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ message: "Error adding favorite" });
    }
  });

  app.delete("/api/favorites/:id", async (req, res) => {
    try {
      const result = await storage.removeFavorite(Number(req.params.id));
      if (!result) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing favorite" });
    }
  });

  // Search Party endpoints
  app.get("/api/search-parties", requireAuth(), async (req, res) => {
    try {
      const { userId: clerkId } = getAuth(req);

      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await getOrCreateUser(clerkId);
      console.log("user id", user.id);
      const searchParties = await storage.getSearchPartiesByUserId(user.id);
      res.json(searchParties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching search parties" });
    }
  });

  app.post("/api/search-parties", requireAuth(), async (req, res) => {
    try {
      const { userId: clerkId } = getAuth(req);
      const { name, invitations } = req.body;

      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const user = await getOrCreateUser(clerkId);

      // Create search party
      const searchParty = await storage.createSearchParty({
        name,
        createdById: user.id,
      });

      // Create invitations if provided
      if (invitations && Array.isArray(invitations)) {
        for (const invitation of invitations) {
          const { contactInfo, contactType } = invitation;

          // Check if contact is already a user
          const existingUser = await storage.findUserByContact(contactInfo);

          if (existingUser) {
            // Add existing user directly to the search party
            await storage.addSearchPartyMember({
              searchPartyId: searchParty.id,
              userId: existingUser.id,
              role: "member",
            });
          } else {
            // Create invitation for new user
            await storage.createSearchPartyInvitation({
              searchPartyId: searchParty.id,
              invitedBy: user.id,
              contactInfo,
              contactType,
            });
          }
        }
      }

      res.status(201).json(searchParty);
    } catch (error) {
      console.error("Error creating search party:", error);
      res.status(500).json({ message: "Error creating search party" });
    }
  });

  // Send invitations to a search party
  app.post(
    "/api/search-parties/:id/invite",
    requireAuth(),
    async (req, res) => {
      try {
        const { userId: clerkId } = getAuth(req);
        const { invitations } = req.body;
        const searchPartyId = Number(req.params.id);

        if (!clerkId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await storage.getUserByClerkId(clerkId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Verify user is a member of the search party
        const member = await storage.getSearchPartyMember(
          searchPartyId,
          user.id,
        );
        if (!member) {
          return res
            .status(403)
            .json({ message: "You are not a member of this search party" });
        }

        const results = [];

        for (const invitation of invitations) {
          const { contactInfo, contactType } = invitation;

          // Check if contact is already a user
          const existingUser = await storage.findUserByContact(contactInfo);

          if (existingUser) {
            // Check if user is already a member
            const existingMember = await storage.getSearchPartyMember(
              searchPartyId,
              existingUser.id,
            );
            if (!existingMember) {
              const newMember = await storage.addSearchPartyMember({
                searchPartyId,
                userId: existingUser.id,
                role: "member",
              });
              results.push({
                type: "member_added",
                user: existingUser,
                member: newMember,
              });
            } else {
              results.push({ type: "already_member", user: existingUser });
            }
          } else {
            // Create invitation for new user
            const newInvitation = await storage.createSearchPartyInvitation({
              searchPartyId,
              invitedBy: user.id,
              contactInfo,
              contactType,
            });
            results.push({
              type: "invitation_sent",
              invitation: newInvitation,
            });
          }
        }

        res.status(201).json({ results });
      } catch (error) {
        console.error("Error sending invitations:", error);
        res.status(500).json({ message: "Error sending invitations" });
      }
    },
  );

  // Accept invitation
  app.post(
    "/api/invitations/:token/accept",
    requireAuth(),
    async (req, res) => {
      try {
        const { userId: clerkId } = getAuth(req);
        const { token } = req.params;

        if (!clerkId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await storage.getUserByClerkId(clerkId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const member = await storage.acceptSearchPartyInvitation(
          token,
          user.id,
        );
        res.json(member);
      } catch (error) {
        console.error("Error accepting invitation:", error);
        res
          .status(400)
          .json({ message: error.message || "Error accepting invitation" });
      }
    },
  );

  // Get invitation details
  app.get("/api/invitations/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const invitation = await storage.getSearchPartyInvitation(token);

      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }

      if (
        invitation.status !== "pending" ||
        invitation.expiresAt < new Date()
      ) {
        return res
          .status(400)
          .json({ message: "Invitation is invalid or expired" });
      }

      // Get search party details
      const searchParty = await storage.getSearchParty(
        invitation.searchPartyId,
      );

      res.json({
        invitation: {
          id: invitation.id,
          searchPartyId: invitation.searchPartyId,
          contactInfo: invitation.contactInfo,
          contactType: invitation.contactType,
          expiresAt: invitation.expiresAt,
        },
        searchParty: {
          id: searchParty?.id,
          name: searchParty?.name,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching invitation" });
    }
  });

  app.post(
    "/api/search-parties/:id/members",
    requireAuth(),
    async (req, res) => {
      try {
        const { userId: clerkId } = getAuth(req);
        const { userId, role } = req.body;
        const searchPartyId = Number(req.params.id);

        if (!clerkId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        if (!userId || !searchPartyId) {
          return res
            .status(400)
            .json({ message: "UserId and searchPartyId are required" });
        }

        const member = await storage.addSearchPartyMember({
          searchPartyId,
          userId: Number(userId),
          role: role || "member",
        });

        res.status(201).json(member);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error adding member to search party" });
      }
    },
  );

  // Remove member from search party (only owner can remove)
  app.delete(
    "/api/search-parties/:id/members/:userId",
    requireAuth(),
    async (req, res) => {
      try {
        const { userId: clerkId } = getAuth(req);
        const searchPartyId = Number(req.params.id);
        const userIdToRemove = Number(req.params.userId);

        if (!clerkId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const currentUser = await storage.getUserByClerkId(clerkId);
        if (!currentUser) {
          return res.status(404).json({ message: "User not found" });
        }

        const success = await storage.removeSearchPartyMember(
          searchPartyId,
          userIdToRemove,
          currentUser.id,
        );

        if (success) {
          res.status(204).send();
        } else {
          res.status(404).json({ message: "Member not found" });
        }
      } catch (error) {
        console.error("Error removing member:", error);
        res
          .status(403)
          .json({ message: error.message || "Error removing member" });
      }
    },
  );

  app.post("/api/search-parties/:id/listings", async (req, res) => {
    try {
      const { apartmentId, addedById, notes } = req.body;
      const searchPartyId = Number(req.params.id);

      if (!apartmentId || !addedById || !searchPartyId) {
        return res.status(400).json({
          message: "ApartmentId, addedById and searchPartyId are required",
        });
      }

      const listing = await storage.addSearchPartyListing({
        searchPartyId,
        apartmentId: Number(apartmentId),
        addedById: Number(addedById),
        notes,
      });

      res.status(201).json(listing);
    } catch (error) {
      res.status(500).json({ message: "Error adding listing to search party" });
    }
  });

  app.get("/api/search-parties/:id/listings", async (req, res) => {
    try {
      const searchPartyId = Number(req.params.id);

      const listings = await storage.getSearchPartyListings(searchPartyId);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching search party listings" });
    }
  });

  // User endpoints
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Sync Clerk user with local database
  app.post("/api/users/sync", requireAuth(), async (req, res) => {
    try {
      const { userId: clerkId } = getAuth(req);
      const { email, fullName, profileImage, phoneNumber } = req.body;

      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if user already exists
      let user = await storage.getUserByClerkId(clerkId);

      if (!user) {
        // Create new user
        const newUser: InsertUser = {
          clerkId,
          email,
          fullName,
          profileImage,
          phoneNumber,
        };
        user = await storage.createUser(newUser);
      } else {
        // Update sign-in time
        user = await storage.updateUserSignIn(clerkId);
      }

      res.json(user);
    } catch (error) {
      console.error("Error syncing user:", error);
      res.status(500).json({ message: "Error syncing user" });
    }
  });

  // Get current user
  app.get("/api/users/me", requireAuth(), async (req, res) => {
    try {
      const { userId: clerkId } = getAuth(req);

      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUserByClerkId(clerkId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  // Update user preferences
  app.patch("/api/users/preferences", requireAuth(), async (req, res) => {
    try {
      const { userId: clerkId } = getAuth(req);
      
      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updates = req.body;
      const user = await storage.updateUser(clerkId, updates);
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error updating user preferences" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const { username, password, email, fullName, profileImage } = req.body;

      if (!username || !password || !email) {
        return res
          .status(400)
          .json({ message: "Username, password and email are required" });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        username,
        password,
        email,
        fullName,
        profileImage,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  // API endpoint
  app.get("/listing-details", async (req, res) => {
    if (!!!req.query.url || typeof req.query.url !== "string") {
      res.status(400).json({ error: "Invalid listing url" });
    }
    const url = req.query.url as string;
    try {
      const listingData = await fetchBrowserQL(url);
      res.json(listingData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return httpServer;
}
