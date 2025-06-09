import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Basic user model with Clerk integration
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(), // Clerk user ID
  username: text("username"),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  profileImage: text("profile_image"),
  phoneNumber: text("phone_number"),
  location: text("location"),
  bio: text("bio"),
  // Housing preferences
  minBedrooms: integer("min_bedrooms"),
  minBathrooms: integer("min_bathrooms"),
  maxPrice: integer("max_price"),
  petFriendly: boolean("pet_friendly"),
  parking: boolean("parking"),
  furnished: boolean("furnished"),
  laundry: boolean("laundry"),
  // Notification preferences
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  searchAlerts: boolean("search_alerts").default(true),
  // Other preferences
  neighborhoodPreferences: text("neighborhood_preferences").array(),
  createdAt: timestamp("created_at").defaultNow(),
  lastSignInAt: timestamp("last_sign_in_at")
});

// Apartment listings
export const apartments = pgTable("apartments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  squareFeet: integer("square_feet"),
  location: text("location").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  images: text("images").array().notNull(),
  amenities: text("amenities").array(),
  isAvailable: boolean("is_available").default(true),
  createdById: integer("created_by_id").references(() => users.id),
  distance: text("distance")
});

// Favorites (saved apartments)
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  apartmentId: integer("apartment_id").references(() => apartments.id).notNull()
});

// Search parties for collaborative apartment hunting
export const searchParties = pgTable("search_parties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdById: integer("created_by_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Members of search parties
export const searchPartyMembers = pgTable("search_party_members", {
  id: serial("id").primaryKey(),
  searchPartyId: integer("search_party_id").references(() => searchParties.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").default("member"), // "owner" or "member"
  joinedAt: timestamp("joined_at").defaultNow()
});

// Search party invitations
export const searchPartyInvitations = pgTable("search_party_invitations", {
  id: serial("id").primaryKey(),
  searchPartyId: integer("search_party_id").references(() => searchParties.id).notNull(),
  invitedBy: integer("invited_by").references(() => users.id).notNull(),
  contactInfo: text("contact_info").notNull(), // email or phone
  contactType: text("contact_type").notNull(), // "email" or "phone"
  invitationToken: text("invitation_token").notNull().unique(),
  status: text("status").default("pending"), // "pending", "accepted", "declined", "expired"
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  acceptedAt: timestamp("accepted_at")
});

// Shared apartments within search parties
export const searchPartyListings = pgTable("search_party_listings", {
  id: serial("id").primaryKey(),
  searchPartyId: integer("search_party_id").references(() => searchParties.id).notNull(),
  apartmentId: integer("apartment_id").references(() => apartments.id).notNull(),
  addedById: integer("added_by_id").references(() => users.id).notNull(),
  addedAt: timestamp("added_at").defaultNow(),
  notes: text("notes")
});

// Filter preferences
export const filterSettings = pgTable("filter_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  minPrice: integer("min_price"),
  maxPrice: integer("max_price"),
  bedrooms: integer("bedrooms"),
  maxDistance: integer("max_distance"),
  petFriendly: boolean("pet_friendly"),
  amenities: text("amenities").array()
});

// Create schemas for inserting data
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, lastSignInAt: true });
export const insertApartmentSchema = createInsertSchema(apartments).omit({ id: true });
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true });
export const insertSearchPartySchema = createInsertSchema(searchParties).omit({ id: true, createdAt: true });
export const insertSearchPartyMemberSchema = createInsertSchema(searchPartyMembers).omit({ id: true, joinedAt: true });
export const insertSearchPartyInvitationSchema = createInsertSchema(searchPartyInvitations).omit({ id: true, createdAt: true, acceptedAt: true });
export const insertSearchPartyListingSchema = createInsertSchema(searchPartyListings).omit({ id: true, addedAt: true });
export const insertFilterSettingsSchema = createInsertSchema(filterSettings).omit({ id: true });

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertApartment = z.infer<typeof insertApartmentSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertSearchParty = z.infer<typeof insertSearchPartySchema>;
export type InsertSearchPartyMember = z.infer<typeof insertSearchPartyMemberSchema>;
export type InsertSearchPartyInvitation = z.infer<typeof insertSearchPartyInvitationSchema>;
export type InsertSearchPartyListing = z.infer<typeof insertSearchPartyListingSchema>;
export type InsertFilterSettings = z.infer<typeof insertFilterSettingsSchema>;

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  createdApartments: many(apartments),
  favorites: many(favorites),
  createdSearchParties: many(searchParties),
  searchPartyMemberships: many(searchPartyMembers),
  sentInvitations: many(searchPartyInvitations, { relationName: "invitedBy" }),
  addedListings: many(searchPartyListings),
  filterSettings: many(filterSettings)
}));

export const apartmentsRelations = relations(apartments, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [apartments.createdById],
    references: [users.id]
  }),
  favorites: many(favorites),
  searchPartyListings: many(searchPartyListings)
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id]
  }),
  apartment: one(apartments, {
    fields: [favorites.apartmentId],
    references: [apartments.id]
  })
}));

export const searchPartiesRelations = relations(searchParties, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [searchParties.createdById],
    references: [users.id]
  }),
  members: many(searchPartyMembers),
  invitations: many(searchPartyInvitations),
  listings: many(searchPartyListings)
}));

export const searchPartyMembersRelations = relations(searchPartyMembers, ({ one }) => ({
  searchParty: one(searchParties, {
    fields: [searchPartyMembers.searchPartyId],
    references: [searchParties.id]
  }),
  user: one(users, {
    fields: [searchPartyMembers.userId],
    references: [users.id]
  })
}));

export const searchPartyInvitationsRelations = relations(searchPartyInvitations, ({ one }) => ({
  searchParty: one(searchParties, {
    fields: [searchPartyInvitations.searchPartyId],
    references: [searchParties.id]
  }),
  invitedByUser: one(users, {
    fields: [searchPartyInvitations.invitedBy],
    references: [users.id],
    relationName: "invitedBy"
  })
}));

export const searchPartyListingsRelations = relations(searchPartyListings, ({ one }) => ({
  searchParty: one(searchParties, {
    fields: [searchPartyListings.searchPartyId],
    references: [searchParties.id]
  }),
  apartment: one(apartments, {
    fields: [searchPartyListings.apartmentId],
    references: [apartments.id]
  }),
  addedBy: one(users, {
    fields: [searchPartyListings.addedById],
    references: [users.id]
  })
}));

export const filterSettingsRelations = relations(filterSettings, ({ one }) => ({
  user: one(users, {
    fields: [filterSettings.userId],
    references: [users.id]
  })
}));

export type User = typeof users.$inferSelect;
export type Apartment = typeof apartments.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type SearchParty = typeof searchParties.$inferSelect;
export type SearchPartyMember = typeof searchPartyMembers.$inferSelect;
export type SearchPartyInvitation = typeof searchPartyInvitations.$inferSelect;
export type SearchPartyListing = typeof searchPartyListings.$inferSelect;
export type FilterSetting = typeof filterSettings.$inferSelect;
