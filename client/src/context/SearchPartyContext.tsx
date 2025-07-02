
import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { apiRequest } from "../lib/queryClient";
import {
  SearchParty,
  SearchPartyListing,
  SearchPartyContextType,
  User,
} from "../types";
import { useToast } from "@/hooks/use-toast";

const SearchPartyContext = createContext<SearchPartyContextType | undefined>(
  undefined,
);

export const SearchPartyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user: clerkUser, isLoaded } = useUser();
  const [error, setError] = useState<Error | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Sync user with backend when Clerk user is loaded
  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && clerkUser) {
        try {
          const response = await apiRequest("POST", "/api/users/sync", {
            email: clerkUser.primaryEmailAddress?.emailAddress,
            fullName: clerkUser.fullName,
            profileImage: clerkUser.imageUrl,
            phoneNumber: clerkUser.primaryPhoneNumber?.phoneNumber,
          });
          const userData = await response.json();
          setCurrentUser(userData);
        } catch (error) {
          console.error("Error syncing user:", error);
          setError(error as Error);
        }
      }
    };

    syncUser();
  }, [isLoaded, clerkUser]);

  // Fetch user's search parties
  const { data: searchParties = [], isLoading } = useQuery<SearchParty[]>({
    queryKey: ["/api/search-parties"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/search-parties");
        if (!response.ok) {
          throw new Error("Failed to fetch search parties");
        }
        return response.json();
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        }
        return [];
      }
    },
    enabled: !!currentUser, // Only fetch when user is synced
  });

  // Create a new search party
  const createSearchPartyMutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const response = await apiRequest("POST", "/api/search-parties", {
        name,
      });
      return response.json() as Promise<SearchParty>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/search-parties"],
      });
      toast({
        title: "Success",
        description: "Search party created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create search party",
        variant: "destructive",
      });
      setError(error as Error);
    },
  });

  // Add a listing to a search party
  const addListingMutation = useMutation({
    mutationFn: async ({
      searchPartyId,
      apartmentId,
      notes = "",
    }: {
      searchPartyId: number;
      apartmentId: number;
      notes?: string;
    }) => {
      const response = await apiRequest(
        "POST",
        `/api/search-parties/${searchPartyId}/listings`,
        {
          apartmentId,
          notes,
        },
      );
      return response.json() as Promise<SearchPartyListing>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/search-parties"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/search-parties", variables.searchPartyId, "listings"],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add listing to search party",
        variant: "destructive",
      });
      setError(error as Error);
    },
  });




  // Function to create a search party
  const createSearchParty = async (name: string): Promise<SearchParty> => {
    return createSearchPartyMutation.mutateAsync({ name });
  };

  // Function to add a listing to a search party
  const addListingToParty = async (
    searchPartyId: number,
    apartmentId: number,
    notes?: string,
  ): Promise<SearchPartyListing> => {
    return addListingMutation.mutateAsync({
      searchPartyId,
      apartmentId,
      notes,
    });
  };

  // Function to get listings for a specific search party
  const getSearchPartyListings = async (
    searchPartyId: number,
  ): Promise<SearchPartyListing[]> => {
    try {
      const response = await apiRequest(
        `/api/search-parties/${searchPartyId}/listings`,
        "GET",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search party listings");
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
      return [];
    }
  };





  return (
    <SearchPartyContext.Provider
      value={{
        searchParties,
        isLoading,
        error,
        createSearchParty,
        addListingToParty,
        getSearchPartyListings
      }}
    >
      {children}
    </SearchPartyContext.Provider>
  );
};

export const useSearchParty = (): SearchPartyContextType => {
  const context = useContext(SearchPartyContext);
  if (context === undefined) {
    throw new Error("useSearchParty must be used within a SearchPartyProvider");
  }
  return context;
};
