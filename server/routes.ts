import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";
import { InsertUser } from "../shared/schema";
import { supabase } from "./supabaseClient";
import { transformRawApartmentResponse, type RawApartmentResponse } from "./apartmentTransform";

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
    } catch {
      res.status(500).json({ message: "Error fetching apartments" });
    }
  });

  // Favorites endpoints
  app.get("/api/favorites", requireAuth(), async (req, res) => {
    try {
      const { userId: clerkId } = getAuth(req);
      console.log("🔍 API: GET /api/favorites - clerkId:", clerkId);

      if (!clerkId) {
        console.log("🔍 API: GET /api/favorites - No clerkId, unauthorized");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await getOrCreateUser(clerkId);
      console.log("🔍 API: GET /api/favorites - user:", user);
      
      const favorites = await storage.getFavoritesByUserId(user.id);
      console.log("🔍 API: GET /api/favorites - favorites from storage:", favorites);
      
      res.json(favorites);
    } catch (error) {
      console.error("🔍 API: Error fetching favorites:", error);
      res.status(500).json({ message: "Error fetching favorites" });
    }
  });

  app.post("/api/favorites", requireAuth(), async (req, res) => {
    try {
      const { userId: clerkId } = getAuth(req);
      const { apartmentId } = req.body;
      console.log("🔍 API: POST /api/favorites - clerkId:", clerkId, "apartmentId:", apartmentId);

      if (!clerkId) {
        console.log("🔍 API: POST /api/favorites - No clerkId, unauthorized");
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!apartmentId) {
        console.log("🔍 API: POST /api/favorites - No apartmentId provided");
        return res.status(400).json({ message: "ApartmentId is required" });
      }

      const user = await getOrCreateUser(clerkId);
      console.log("🔍 API: POST /api/favorites - user:", user);
      
      const favorite = await storage.addFavorite({
        userId: user.id,
        apartmentId: Number(apartmentId),
      });
      console.log("🔍 API: POST /api/favorites - created favorite:", favorite);

      res.status(201).json(favorite);
    } catch (error) {
      console.error("🔍 API: Error adding favorite:", error);
      res.status(500).json({ message: "Error adding favorite" });
    }
  });

  app.delete("/api/favorites/:id", requireAuth(), async (req, res) => {
    try {
      const { userId: clerkId } = getAuth(req);
      const favoriteId = req.params.id;
      console.log("🔍 API: DELETE /api/favorites/:id - clerkId:", clerkId, "favoriteId:", favoriteId);

      if (!clerkId) {
        console.log("🔍 API: DELETE /api/favorites/:id - No clerkId, unauthorized");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await storage.removeFavorite(Number(favoriteId));
      console.log("🔍 API: DELETE /api/favorites/:id - storage result:", result);
      
      if (!result) {
        console.log("🔍 API: DELETE /api/favorites/:id - Favorite not found");
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      console.log("🔍 API: DELETE /api/favorites/:id - Successfully removed favorite");
      res.status(204).send();
    } catch (error) {
      console.error("🔍 API: Error removing favorite:", error);
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
    } catch {
      res.status(500).json({ message: "Error fetching search parties" });
    }
  });

  app.post("/api/search-parties", requireAuth(), async (req, res) => {
    try {
      const { userId: clerkId } = getAuth(req);
      const { name } = req.body;

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

      res.status(201).json(searchParty);
    } catch (error) {
      console.error("Error creating search party:", error);
      res.status(500).json({ message: "Error creating search party" });
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
      } catch {
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
          .json({ message: error || "Error removing member" });
      }
    },
  );

  app.post("/api/search-parties/:id/listings", requireAuth(), async (req, res) => {
    try {
      const { userId: clerkId } = getAuth(req);
      const { apartmentId, notes } = req.body;
      const searchPartyId = Number(req.params.id);

      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!apartmentId || !searchPartyId) {
        return res.status(400).json({
          message: "ApartmentId and searchPartyId are required",
        });
      }

      const user = await storage.getUserByClerkId(clerkId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify user is a member of the search party
      const member = await storage.getSearchPartyMember(searchPartyId, user.id);
      if (!member) {
        return res.status(403).json({ message: "You are not a member of this search party" });
      }

      const listing = await storage.addSearchPartyListing({
        searchPartyId,
        apartmentId: Number(apartmentId),
        addedById: user.id,
        notes,
      });

      res.status(201).json(listing);
    } catch (error) {
      console.error("Error adding listing to search party:", error);
      res.status(500).json({ message: "Error adding listing to search party" });
    }
  });

  app.get("/api/search-parties/:id/listings", async (req, res) => {
    try {
      const searchPartyId = Number(req.params.id);

      const listings = await storage.getSearchPartyListings(searchPartyId);
      res.json(listings);
    } catch {
      res.status(500).json({ message: "Error fetching search party listings" });
    }
  });

  // User endpoints
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch {
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
    } catch {
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
    } catch {
      res.status(500).json({ message: "Error updating user preferences" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const { username, password, email, fullName, profileImage, clerkId } = req.body;

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
        clerkId,
        username,
        email,
        fullName,
        profileImage,
      });

      res.status(201).json(user);
    } catch {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch {
      res.status(500).json({ message: "Error fetching user by id" });
    }
  });

  // Supabase apartments endpoint  
  app.get("/api/listings", async (req, res, next) => {
    try {
      console.log("🔍 Fetching apartments from Supabase...");
      
      // Fetch from Supabase listings table
      const { data, error } = await supabase
        .from('listings')
        .select();

      if (error) {
        console.error('🔴 Supabase error:', error);
        return res.status(500).json({ 
          error: "Error fetching from Supabase", 
          details: error.message 
        });
      }

      console.log(`🔍 Retrieved ${data?.length || 0} records from Supabase`);

      if (!data || data.length === 0) {
        console.log('🔍 No data found, returning empty array');
        return res.json([]);
      }

      // Extract and transform apartment listings from nested data
      const allApartments: any[] = [];
      let apartmentIdCounter = 1000; // Start with high IDs to avoid conflicts

      data.forEach((record: any) => {
        if (record.data && record.data.data && record.data.data.listings) {
          const listings = record.data.data.listings;
          console.log(`🔍 Found ${listings.length} apartments in record ${record.id}`);
          
          listings.forEach((listing: RawApartmentResponse) => {
            try {
              const transformedApartment = transformRawApartmentResponse(listing, apartmentIdCounter++);
              allApartments.push(transformedApartment);
            } catch (transformError) {
              console.error('🔴 Error transforming apartment:', transformError);
            }
          });
        }
      });

      console.log(`✅ Successfully transformed ${allApartments.length} total apartments`);
      return res.json(allApartments);
      
    } catch (error) {
      console.error("🔴 Unexpected error in Supabase apartments endpoint:", error);
      console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack trace');
      return res.status(500).json({ 
        error: "Error fetching apartments from Supabase",
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // API endpoint
  app.get("/listing-details", async (req, res) => {
    if (!req.query.url || typeof req.query.url !== "string") {
      res.status(400).json({ error: "Invalid listing url" });
      return;
    }
    const url = req.query.url as string;
    try {
      /*const listingData = await fetchListingDetails(url);
      res.json(listingData);*/
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/active-listings", async (req, res) => {
    const { lat: _lat, long: _long } = req.query;
    if (!_lat || !_long) {
      res.status(400).json({ error: "Invalid lat/long" });
      return;
    }
    try {
      /*const listingData = await fetchListingsFromStorage();
      res.json(listingData);*/
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return httpServer;
}
