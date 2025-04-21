import {
  SearchParty,
  SearchPartyListing,
  SearchPartyContextType,
} from "../types";
import { exampleApartments } from "../lib/utils";

export const exampleSearchPartyContext: SearchPartyContextType = {
  // Initialize with two example search parties.
  searchParties: [
    {
      id: 1,
      name: "Apartment Hunters",
      createdById: 1,
      createdAt: new Date().toISOString(),
      members: [], // You can add Member objects if needed.
      listings: [
        {
          id: 1,
          searchPartyId: 1,
          addedById: 1,
          apartment: exampleApartments[0],
          addedAt: new Date().toISOString(),
          notes: "Close to public transit and parks",
        },
        {
          id: 2,
          searchPartyId: 1,
          addedById: 2,
          apartment: exampleApartments[1],
          addedAt: new Date().toISOString(),
          notes: "Spacious layout with modern amenities",
        },
      ],
    },
    {
      id: 2,
      name: "Luxury Living",
      createdById: 2,
      createdAt: new Date().toISOString(),
      members: [],
      listings: [
        {
          id: 3,
          searchPartyId: 2,
          addedById: 2,
          apartment: exampleApartments[4],
          addedAt: new Date().toISOString(),
          notes: "High-end finishes and breathtaking views",
        },
      ],
    },
  ],
  isLoading: false,
  error: null,

  // Creates a new search party with a unique id and current timestamp.
  createSearchParty: async (name: string) => {
    const newId =
      exampleSearchPartyContext.searchParties.reduce(
        (max, party) => Math.max(max, party.id),
        0,
      ) + 1;
    const newParty: SearchParty = {
      id: newId,
      name,
      createdById: 1, // Assume current user id is 1 for this example.
      createdAt: new Date().toISOString(),
      members: [],
      listings: [],
    };
    exampleSearchPartyContext.searchParties.push(newParty);
    return newParty;
  },

  // Adds a new listing to an existing search party.
  addListingToParty: async (
    searchPartyId: number,
    apartmentId: number,
    notes?: string,
  ) => {
    const party = exampleSearchPartyContext.searchParties.find(
      (p) => p.id === searchPartyId,
    );
    if (!party) {
      throw new Error(`Search party with id ${searchPartyId} not found.`);
    }

    // Determine the next listing id within this party.
    const newListingId =
      (party.listings?.reduce((max, listing) => Math.max(max, listing.id), 0) ||
        0) + 1;
    const apartment = exampleApartments.find((apt) => apt.id === apartmentId);

    const newListing: SearchPartyListing = {
      id: newListingId,
      searchPartyId,
      addedById: 1, // Assume current user id is 1.
      addedAt: new Date().toISOString(),
      notes,
      apartment,
    };

    if (!party.listings) {
      party.listings = [];
    }
    party.listings.push(newListing);
    return newListing;
  },

  // Retrieves all listings for the specified search party.
  getSearchPartyListings: async (searchPartyId: number) => {
    const party = exampleSearchPartyContext.searchParties.find(
      (p) => p.id === searchPartyId,
    );
    if (!party) {
      throw new Error(`Search party with id ${searchPartyId} not found.`);
    }
    return party.listings || [];
  },
};
