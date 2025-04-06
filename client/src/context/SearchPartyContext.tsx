import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { 
  SearchParty, 
  SearchPartyListing,
  Apartment
} from '../types';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_USER_ID = 1; // Mock user ID for demo purposes

interface SearchPartyContextType {
  searchParties: SearchParty[];
  isLoading: boolean;
  error: Error | null;
  createSearchParty: (name: string) => Promise<SearchParty>;
  addListingToParty: (searchPartyId: number, apartmentId: number, notes?: string) => Promise<SearchPartyListing>;
  getSearchPartyListings: (searchPartyId: number) => Promise<SearchPartyListing[]>;
}

const SearchPartyContext = createContext<SearchPartyContextType | undefined>(undefined);

export const SearchPartyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  // Fetch user's search parties
  const { 
    data: searchParties = [], 
    isLoading 
  } = useQuery<SearchParty[]>({ 
    queryKey: ['/api/search-parties', DEFAULT_USER_ID],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/search-parties?userId=${DEFAULT_USER_ID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search parties');
        }
        return response.json();
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        }
        return [];
      }
    }
  });

  // Create a new search party
  const createSearchPartyMutation = useMutation({
    mutationFn: async (name: string) => {
      const searchParty = {
        name,
        createdById: DEFAULT_USER_ID
      };
      
      const response = await apiRequest('/api/search-parties', 'POST', searchParty);
      return response.json() as Promise<SearchParty>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/search-parties', DEFAULT_USER_ID] });
      toast({
        title: 'Success',
        description: 'Search party created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create search party',
        variant: 'destructive',
      });
      setError(error as Error);
    }
  });

  // Add a listing to a search party
  const addListingMutation = useMutation({
    mutationFn: async ({ 
      searchPartyId, 
      apartmentId, 
      notes = '' 
    }: { 
      searchPartyId: number; 
      apartmentId: number; 
      notes?: string 
    }) => {
      const listing = {
        searchPartyId,
        apartmentId,
        addedById: DEFAULT_USER_ID,
        notes
      };
      
      const response = await apiRequest(`/api/search-parties/${searchPartyId}/listings`, 'POST', listing);
      return response.json() as Promise<SearchPartyListing>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/search-parties', DEFAULT_USER_ID] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/search-parties', variables.searchPartyId, 'listings'] 
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add listing to search party',
        variant: 'destructive',
      });
      setError(error as Error);
    }
  });

  // Function to create a search party
  const createSearchParty = async (name: string): Promise<SearchParty> => {
    return createSearchPartyMutation.mutateAsync(name);
  };

  // Function to add a listing to a search party
  const addListingToParty = async (
    searchPartyId: number, 
    apartmentId: number, 
    notes?: string
  ): Promise<SearchPartyListing> => {
    return addListingMutation.mutateAsync({ searchPartyId, apartmentId, notes });
  };

  // Function to get listings for a specific search party
  const getSearchPartyListings = async (searchPartyId: number): Promise<SearchPartyListing[]> => {
    try {
      const response = await fetch(`/api/search-parties/${searchPartyId}/listings`);
      if (!response.ok) {
        throw new Error('Failed to fetch search party listings');
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
    throw new Error('useSearchParty must be used within a SearchPartyProvider');
  }
  return context;
};