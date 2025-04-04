import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Basic user model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  profileImage: text("profile_image")
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
  role: text("role").default("member")
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
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertApartmentSchema = createInsertSchema(apartments).omit({ id: true });
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true });
export const insertSearchPartySchema = createInsertSchema(searchParties).omit({ id: true, createdAt: true });
export const insertSearchPartyMemberSchema = createInsertSchema(searchPartyMembers).omit({ id: true });
export const insertSearchPartyListingSchema = createInsertSchema(searchPartyListings).omit({ id: true, addedAt: true });
export const insertFilterSettingsSchema = createInsertSchema(filterSettings).omit({ id: true });

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertApartment = z.infer<typeof insertApartmentSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertSearchParty = z.infer<typeof insertSearchPartySchema>;
export type InsertSearchPartyMember = z.infer<typeof insertSearchPartyMemberSchema>;
export type InsertSearchPartyListing = z.infer<typeof insertSearchPartyListingSchema>;
export type InsertFilterSettings = z.infer<typeof insertFilterSettingsSchema>;

export type User = typeof users.$inferSelect;
export type Apartment = typeof apartments.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type SearchParty = typeof searchParties.$inferSelect;
export type SearchPartyMember = typeof searchPartyMembers.$inferSelect;
export type SearchPartyListing = typeof searchPartyListings.$inferSelect;
export type FilterSetting = typeof filterSettings.$inferSelect;
