export interface Apartment {
  id: number;
  title: string;
  description?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  location: string;
  address: string;
  latitude: string;
  longitude: string;
  images: string[];
  amenities?: string[];
  isAvailable: boolean;
  createdById?: number;
  distance?: string;
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
  createdAt: string;
  members?: SearchPartyMember[];
  listings?: SearchPartyListing[];
}

export interface SearchPartyMember {
  id: number;
  searchPartyId: number;
  userId: number;
  role: string;
  user?: User;
}

export interface SearchPartyListing {
  id: number;
  searchPartyId: number;
  apartmentId: number;
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
