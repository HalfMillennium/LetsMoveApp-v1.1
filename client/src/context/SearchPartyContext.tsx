
import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { apiRequest } from "../lib/queryClient";
import {
  SearchParty,
  SearchPartyListing,
  SearchPartyMember,
  SearchPartyContextType,
  User,
  InvitationRequest,
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
          const response = await apiRequest("/api/users/sync", "POST", {
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
        const response = await apiRequest("/api/search-parties", "GET");
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
    mutationFn: async ({ name, invitations }: { name: string; invitations?: InvitationRequest[] }) => {
      const response = await apiRequest("POST", "/api/search-parties", {
        name,
        invitations,
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

  // Invite users to search party
  const inviteToSearchPartyMutation = useMutation({
    mutationFn: async ({
      searchPartyId,
      invitations,
    }: {
      searchPartyId: number;
      invitations: InvitationRequest[];
    }) => {
      const response = await apiRequest(
        "POST",
        `/api/search-parties/${searchPartyId}/invite`,
        { invitations },
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/search-parties"],
      });
      toast({
        title: "Success",
        description: "Invitations sent successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send invitations",
        variant: "destructive",
      });
      setError(error as Error);
    },
  });

  // Remove member from search party
  const removeMemberMutation = useMutation({
    mutationFn: async ({
      searchPartyId,
      userId,
    }: {
      searchPartyId: number;
      userId: number;
    }) => {
      const response = await apiRequest(
        "DELETE",
        `/api/search-parties/${searchPartyId}/members/${userId}`,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/search-parties"],
      });
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
      setError(error as Error);
    },
  });

  // Accept invitation
  const acceptInvitationMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await apiRequest(
        "POST",
        `/api/invitations/${token}/accept`,
      );
      return response.json() as Promise<SearchPartyMember>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/search-parties"],
      });
      toast({
        title: "Success",
        description: "Successfully joined the search party",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to accept invitation",
        variant: "destructive",
      });
      setError(error as Error);
    },
  });

  // Function to create a search party
  const createSearchParty = async (name: string, invitations?: InvitationRequest[]): Promise<SearchParty> => {
    return createSearchPartyMutation.mutateAsync({ name, invitations });
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

  // Function to invite users to search party
  const inviteToSearchParty = async (
    searchPartyId: number,
    invitations: InvitationRequest[],
  ): Promise<any> => {
    return inviteToSearchPartyMutation.mutateAsync({
      searchPartyId,
      invitations,
    });
  };

  // Function to remove member from search party
  const removeMemberFromSearchParty = async (
    searchPartyId: number,
    userId: number,
  ): Promise<void> => {
    await removeMemberMutation.mutateAsync({
      searchPartyId,
      userId,
    });
  };

  // Function to accept invitation
  const acceptInvitation = async (token: string): Promise<SearchPartyMember> => {
    return acceptInvitationMutation.mutateAsync(token);
  };

  // Function to get invitation details
  const getInvitationDetails = async (token: string): Promise<any> => {
    try {
      const response = await fetch(`/api/invitations/${token}`);
      if (!response.ok) {
        throw new Error("Failed to fetch invitation details");
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
      throw error;
    }
  };

  return (
    <SearchPartyContext.Provider
      value={{
        searchParties,
        currentUser,
        isLoading,
        error,
        createSearchParty,
        addListingToParty,
        getSearchPartyListings,
        inviteToSearchParty,
        removeMemberFromSearchParty,
        acceptInvitation,
        getInvitationDetails,
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
