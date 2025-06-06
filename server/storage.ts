import { 
  users, type User, type InsertUser,
  apartments, type Apartment, type InsertApartment,
  favorites, type Favorite, type InsertFavorite,
  searchParties, type SearchParty, type InsertSearchParty,
  searchPartyMembers, type SearchPartyMember, type InsertSearchPartyMember,
  searchPartyListings, type SearchPartyListing, type InsertSearchPartyListing
} from "@shared/schema";
import {
  exampleUsers,
  exampleApartments,
  exampleFavorites,
  exampleSearchParties,
  exampleSearchPartyMembers,
  exampleSearchPartyListings,
  generateMoreApartments
} from "../client/src/lib/mockData.simple";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private apartments: Map<number, Apartment>;
  private favorites: Map<number, Favorite>;
  private searchParties: Map<number, SearchParty>;
  private searchPartyMembers: Map<number, SearchPartyMember>;
  private searchPartyListings: Map<number, SearchPartyListing>;

  private userIdCounter: number;
  private favoriteIdCounter: number;
  private searchPartyIdCounter: number;
  private memberIdCounter: number;
  private listingIdCounter: number;

  constructor() {
    this.users = new Map();
    this.apartments = new Map();
    this.favorites = new Map();
    this.searchParties = new Map();
    this.searchPartyMembers = new Map();
    this.searchPartyListings = new Map();

    // Set ID counters to be greater than our example data
    this.userIdCounter = exampleUsers.length + 1;
    this.favoriteIdCounter = exampleFavorites.length + 1;
    this.searchPartyIdCounter = exampleSearchParties.length + 1;
    this.memberIdCounter = exampleSearchPartyMembers.length + 1;
    this.listingIdCounter = exampleSearchPartyListings.length + 1;

    // Initialize with example data

    // Add users
    exampleUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    // Add apartments
    exampleApartments.forEach(apt => {
      this.apartments.set(apt.id, apt);
    });

    // Add favorites
    exampleFavorites.forEach(favorite => {
      this.favorites.set(favorite.id, favorite);
    });

    // Add search parties
    exampleSearchParties.forEach(party => {
      this.searchParties.set(party.id, party);
    });

    // Add search party members
    exampleSearchPartyMembers.forEach(member => {
      this.searchPartyMembers.set(member.id, member);
    });

    // Add search party listings
    exampleSearchPartyListings.forEach(listing => {
      // Add apartment details to the listing
      const apartment = this.apartments.get(listing.apartmentId);
      const enrichedListing = {
        ...listing,
        apartment
      } as SearchPartyListing;
      this.searchPartyListings.set(listing.id, enrichedListing);
    });
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      fullName: insertUser.fullName || null,
      profileImage: insertUser.profileImage || null
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Apartment Methods
  async getApartments(): Promise<Apartment[]> {
    return Array.from(this.apartments.values());
  }

  async getApartment(id: number): Promise<Apartment | undefined> {
    return this.apartments.get(id);
  }

  // Favorites Methods
  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      favorite => favorite.userId === userId
    );
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteIdCounter++;
    const favorite: Favorite = { ...insertFavorite, id };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(id: number): Promise<boolean> {
    if (!this.favorites.has(id)) {
      return false;
    }
    this.favorites.delete(id);
    return true;
  }

  // Search Party Methods
  async getSearchPartiesByUserId(userId: number): Promise<SearchParty[]> {
    // Get all search parties where the user is either the creator or a member
    const createdParties = Array.from(this.searchParties.values()).filter(
      party => party.createdById === userId
    );

    // Get search party IDs where user is a member
    const memberPartyIds = Array.from(this.searchPartyMembers.values())
      .filter(member => member.userId === userId)
      .map(member => member.searchPartyId);

    // Get those search parties
    const memberParties = Array.from(this.searchParties.values()).filter(
      party => memberPartyIds.includes(party.id)
    );

    // Combine both arrays and remove duplicates
    const allParties = [...createdParties, ...memberParties];
    return Array.from(new Map(allParties.map(party => [party.id, party])).values());
  }

  async createSearchParty(insertSearchParty: InsertSearchParty): Promise<SearchParty> {
    const id = this.searchPartyIdCounter++;
    const now = new Date();
    const searchParty: SearchParty = { 
      ...insertSearchParty, 
      id, 
      createdAt: now 
    };
    this.searchParties.set(id, searchParty);
    return searchParty;
  }

  async addSearchPartyMember(insertMember: InsertSearchPartyMember): Promise<SearchPartyMember> {
    const id = this.memberIdCounter++;
    const member: SearchPartyMember = { 
      ...insertMember, 
      id,
      role: insertMember.role || null
    };
    this.searchPartyMembers.set(id, member);
    return member;
  }

  async addSearchPartyListing(insertListing: InsertSearchPartyListing): Promise<SearchPartyListing> {
    const id = this.listingIdCounter++;
    const now = new Date();
    const listing: SearchPartyListing = { 
      ...insertListing, 
      id, 
      addedAt: now,
      notes: insertListing.notes || null
    };
    this.searchPartyListings.set(id, listing);
    return listing;
  }

  async getSearchPartyListings(searchPartyId: number): Promise<SearchPartyListing[]> {
    return Array.from(this.searchPartyListings.values())
      .filter(listing => listing.searchPartyId === searchPartyId)
      .map(listing => {
        // Add apartment details to the listing
        const apartment = this.apartments.get(listing.apartmentId);
        return {
          ...listing,
          apartment
        };
      });
  }
}

export const storage = new MemStorage();