import { ReactNode } from "react";
import { PriceRange } from "../lib/constants";

// Raw API response structure from Supabase
export interface RawApartmentResponse {
  beds: Array<{ innerText: string }>;
  boro: Array<{ innerText: string }>;
  sqft: Array<{ innerText: string }>;
  baths: Array<{ innerText: string }>;
  price: Array<{ innerText: string }>;
  general: Array<{
    address: string;
    listingUrl: {
      name: string;
      value: string;
    };
  }>;
  listedBy: Array<{ innerText: string }>;
  imageUrls: Array<{
    src: {
      name: string;
      value: string;
    };
  }>;
  leaseTerm: Array<any>;
  netEffective: Array<any>;
}

// Normalized apartment interface for use throughout the app
export interface Apartment {
  id: number;
  title?: string;
  description?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  location: string;
  address: string;
  latitude?: string;
  longitude?: string;
  images: string[];
  amenities?: string[];
  isAvailable: boolean;
  createdById?: number;
  distance?: string;
  listingUrl?: string;
  listedBy?: string;
  leaseTerm?: string;
  netEffective?: string;
}

export interface ListingCollection {
  id: string;
  title: string;
  createdBy?: string;
  icon: ReactNode;
}

export interface ActiveFilters {
  price?: PriceRange;
  bedrooms?: number;
  distance?: number;
  petFriendly?: boolean;
}

export interface Favorite {
  id: number;
  userId: number;
  apartmentId: number;
  apartment?: Apartment;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  profileImage?: string;
}

export interface SearchParty {
  id: number;
  name: string;
  createdById: number;
  createdAt?: string;
  userRole?: string;
  members?: SearchPartyMember[];
  listings?: SearchPartyListing[];
}



export interface Member {
  userId: number;
  role: string;
  user?: User;
}

export interface SearchPartyListing {
  id: number;
  searchPartyId: number;
  addedById: number;
  addedAt: string;
  notes?: string;
  apartment?: Apartment;
  addedBy?: User;
}

export interface FilterSettings {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  maxDistance?: number;
  petFriendly?: boolean;
  amenities?: string[];
}

export interface SearchPartyContextType {
  searchParties: SearchParty[];
  isLoading: boolean;
  error: Error | null;
  createSearchParty: (name: string) => Promise<SearchParty>;
  addListingToParty: (
    searchPartyId: number,
    apartmentId: number,
    notes?: string,
  ) => Promise<SearchPartyListing>;
  getSearchPartyListings: (
    searchPartyId: number,
  ) => Promise<SearchPartyListing[]>;
}

export interface SearchPartyMember {
    userId: number;
    role: string;
    user?: User;
}