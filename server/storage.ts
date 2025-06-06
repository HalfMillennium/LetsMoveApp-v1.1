import { 
  users, type User, type InsertUser,
  apartments, type Apartment, type InsertApartment,
  favorites, type Favorite, type InsertFavorite,
  searchParties, type SearchParty, type InsertSearchParty,
  searchPartyMembers, type SearchPartyMember, type InsertSearchPartyMember,
  searchPartyListings, type SearchPartyListing, type InsertSearchPartyListing
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Apartment methods
  getApartments(): Promise<Apartment[]>;
  getApartment(id: number): Promise<Apartment | undefined>;

  // Favorites methods
  getFavoritesByUserId(userId: number): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(id: number): Promise<boolean>;

  // Search Party methods
  getSearchPartiesByUserId(userId: number): Promise<SearchParty[]>;
  createSearchParty(searchParty: InsertSearchParty): Promise<SearchParty>;
  addSearchPartyMember(member: InsertSearchPartyMember): Promise<SearchPartyMember>;
  addSearchPartyListing(listing: InsertSearchPartyListing): Promise<SearchPartyListing>;
  getSearchPartyListings(searchPartyId: number): Promise<SearchPartyListing[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getApartments(): Promise<Apartment[]> {
    return await db.select().from(apartments);
  }

  async getApartment(id: number): Promise<Apartment | undefined> {
    const [apartment] = await db.select().from(apartments).where(eq(apartments.id, id));
    return apartment || undefined;
  }

  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values(insertFavorite)
      .returning();
    return favorite;
  }

  async removeFavorite(id: number): Promise<boolean> {
    const result = await db.delete(favorites).where(eq(favorites.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getSearchPartiesByUserId(userId: number): Promise<SearchParty[]> {
    // Get search parties where user is creator or member
    const createdParties = await db
      .select()
      .from(searchParties)
      .where(eq(searchParties.createdById, userId));

    const memberParties = await db
      .select({
        id: searchParties.id,
        name: searchParties.name,
        createdById: searchParties.createdById,
        createdAt: searchParties.createdAt
      })
      .from(searchParties)
      .innerJoin(searchPartyMembers, eq(searchParties.id, searchPartyMembers.searchPartyId))
      .where(eq(searchPartyMembers.userId, userId));

    // Combine and deduplicate
    const allParties = [...createdParties, ...memberParties];
    return Array.from(new Map(allParties.map(party => [party.id, party])).values());
  }

  async createSearchParty(insertSearchParty: InsertSearchParty): Promise<SearchParty> {
    const [searchParty] = await db
      .insert(searchParties)
      .values(insertSearchParty)
      .returning();
    return searchParty;
  }

  async addSearchPartyMember(insertMember: InsertSearchPartyMember): Promise<SearchPartyMember> {
    const [member] = await db
      .insert(searchPartyMembers)
      .values(insertMember)
      .returning();
    return member;
  }

  async addSearchPartyListing(insertListing: InsertSearchPartyListing): Promise<SearchPartyListing> {
    const [listing] = await db
      .insert(searchPartyListings)
      .values(insertListing)
      .returning();
    return listing;
  }

  async getSearchPartyListings(searchPartyId: number): Promise<SearchPartyListing[]> {
    return await db
      .select()
      .from(searchPartyListings)
      .where(eq(searchPartyListings.searchPartyId, searchPartyId));
  }
}

export const storage = new DatabaseStorage();