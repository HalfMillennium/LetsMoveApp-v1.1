import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { SearchParty, SearchPartyListing } from "../types";
import { useToast } from "@/hooks/use-toast";

// Default user ID (in a real app, this would come from auth)
const DEFAULT_USER_ID = 1;

interface SearchPartyContextType {
  searchParties: SearchParty[];
  isLoading: boolean;
  error: Error | null;
  createSearchParty: (name: string) => Promise<void>;
  addMemberToParty: (
    searchPartyId: number,
    userId: number,
    role?: string,
  ) => Promise<void>;
  addListingToParty: (
    searchPartyId: number,
    apartmentId: number,
    notes?: string,
  ) => Promise<void>;
  getSearchPartyListings: (
    searchPartyId: number,
  ) => Promise<SearchPartyListing[]>;
}

const exampleSearchPartyContext: SearchPartyContextType = {
  searchParties: [
    {
      id: 1,
      createdById: 1,
      name: "Roommate Hunt NYC",
      members: [{ userId: 101, role: "admin" }],
      createdAt: new Date().toISOString(),
    },
  ],
  isLoading: false,
  error: null,
  createSearchParty: async (name: string) => {
    console.log(`Creating search party with name: ${name}`);
    // Simulate async operation
    return;
  },
  addMemberToParty: async (
    searchPartyId: number,
    userId: number,
    role?: string,
  ) => {
    console.log(
      `Adding user ${userId} with role ${role ?? "member"} to party ${searchPartyId}`,
    );
    return;
  },
  addListingToParty: async (
    searchPartyId: number,
    apartmentId: number,
    notes?: string,
  ) => {
    console.log(
      `Adding apartment ${apartmentId} to party ${searchPartyId} with notes: ${notes}`,
    );
    return;
  },
  getSearchPartyListings: async (
    searchPartyId: number,
  ): Promise<SearchPartyListing[]> => {
    console.log(`Fetching listings for party ${searchPartyId}`);
    // Simulate fetching listings and include required properties
    return [
      {
        id: 201,
        apartmentId: 301,
        searchPartyId, // Adding the missing property
        addedById: 101, // Renaming and adding the missing property
        notes: "Great light, but small kitchen.",
        addedAt: new Date().toISOString(),
      },
    ];
  },
};

const SearchPartyContext = createContext<SearchPartyContextType | undefined>(
  exampleSearchPartyContext,
);

export function SearchPartyProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // Fetch search parties
  const {
    data: searchParties = [],
    isLoading,
    error,
  } = useQuery<SearchParty[]>({
    queryKey: ["/api/search-parties", { userId: DEFAULT_USER_ID }],
    queryFn: async () => {
      const response = await fetch(
        `/api/search-parties?userId=${DEFAULT_USER_ID}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search parties");
      }
      return response.json();
    },
  });

  // Create search party mutation
  const createSearchPartyMutation = useMutation({
    mutationFn: async (name: string) => {
      return apiRequest("POST", "/api/search-parties", {
        name,
        createdById: DEFAULT_USER_ID,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/search-parties"] });
      toast({
        title: "Search Party Created",
        description: "Your new search party has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not create search party. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add member to search party mutation
  const addMemberMutation = useMutation({
    mutationFn: async ({
      searchPartyId,
      userId,
      role,
    }: {
      searchPartyId: number;
      userId: number;
      role?: string;
    }) => {
      return apiRequest(
        "POST",
        `/api/search-parties/${searchPartyId}/members`,
        {
          userId,
          role: role || "member",
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/search-parties"] });
      toast({
        title: "Member Added",
        description: "The member has been added to the search party.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not add member. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add listing to search party mutation
  const addListingMutation = useMutation({
    mutationFn: async ({
      searchPartyId,
      apartmentId,
      notes,
    }: {
      searchPartyId: number;
      apartmentId: number;
      notes?: string;
    }) => {
      return apiRequest(
        "POST",
        `/api/search-parties/${searchPartyId}/listings`,
        {
          apartmentId,
          addedById: DEFAULT_USER_ID,
          notes,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/search-parties"] });
      toast({
        title: "Listing Added",
        description: "The apartment has been added to the search party.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not add listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create a search party
  const createSearchParty = async (name: string): Promise<void> => {
    await createSearchPartyMutation.mutateAsync(name);
  };

  // Add a member to a search party
  const addMemberToParty = async (
    searchPartyId: number,
    userId: number,
    role?: string,
  ): Promise<void> => {
    await addMemberMutation.mutateAsync({ searchPartyId, userId, role });
  };

  // Add a listing to a search party
  const addListingToParty = async (
    searchPartyId: number,
    apartmentId: number,
    notes?: string,
  ): Promise<void> => {
    await addListingMutation.mutateAsync({ searchPartyId, apartmentId, notes });
  };

  // Get listings for a specific search party
  const getSearchPartyListings = async (
    searchPartyId: number,
  ): Promise<SearchPartyListing[]> => {
    const response = await fetch(
      `/api/search-parties/${searchPartyId}/listings`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch search party listings");
    }
    return response.json();
  };

  const contextValue: SearchPartyContextType = {
    searchParties,
    isLoading,
    error: error as Error | null,
    createSearchParty,
    addMemberToParty,
    addListingToParty,
    getSearchPartyListings,
  };

  return (
    <SearchPartyContext.Provider value={contextValue}>
      {children}
    </SearchPartyContext.Provider>
  );
}

export function useSearchParty() {
  const context = useContext(SearchPartyContext);
  if (context === undefined) {
    throw new Error("useSearchParty must be used within a SearchPartyProvider");
  }
  return context;
}
