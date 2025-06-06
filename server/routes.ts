import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

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
  app.get("/api/search-parties", async (req, res) => {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
      }

      const searchParties = await storage.getSearchPartiesByUserId(
        Number(userId),
      );
      res.json(searchParties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching search parties" });
    }
  });

  app.post("/api/search-parties", async (req, res) => {
    try {
      const { name, createdById } = req.body;

      if (!name || !createdById) {
        return res
          .status(400)
          .json({ message: "Name and createdById are required" });
      }

      const searchParty = await storage.createSearchParty({
        name,
        createdById: Number(createdById),
      });

      res.status(201).json(searchParty);
    } catch (error) {
      res.status(500).json({ message: "Error creating search party" });
    }
  });

  app.post("/api/search-parties/:id/members", async (req, res) => {
    try {
      const { userId, role } = req.body;
      const searchPartyId = Number(req.params.id);

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
      res.status(500).json({ message: "Error adding member to search party" });
    }
  });

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
      // Get all users from storage
      const users = await storage.getAllUsers();

      // Remove passwords from response
      const usersWithoutPasswords = users.map((user) => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
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
