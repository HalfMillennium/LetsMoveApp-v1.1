import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Favorite, Apartment } from "../types";
import { useToast } from "@/hooks/use-toast";

// Default user ID (in a real app, this would come from auth)
const DEFAULT_USER_ID = 1;

interface FavoritesContextType {
  favorites: Favorite[];
  isLoading: boolean;
  error: Error | null;
  addFavorite: (apartmentId: number) => Promise<void>;
  removeFavorite: (favoriteId: number) => Promise<void>;
  isFavorite: (apartmentId: number) => boolean;
}

const DEFAULT_FAVORITES: FavoritesContextType = {
  favorites: [],
  isLoading: false,
  error: null,
  addFavorite: async (apartmentId: number) => {},
  removeFavorite: async (favoriteId: number) => {},
  isFavorite: (apartmentId: number) => false,
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  DEFAULT_FAVORITES,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // Fetch favorites
  const {
    data: favorites = [],
    isLoading,
    error,
  } = useQuery<Favorite[]>({
    queryKey: ["/api/favorites", { userId: DEFAULT_USER_ID }],
    queryFn: async () => {
      const response = await fetch(`/api/favorites?userId=${DEFAULT_USER_ID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }
      return response.json();
    },
  });

  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async (apartmentId: number) => {
      return apiRequest("/api/favorites", "POST", {
        userId: DEFAULT_USER_ID,
        apartmentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Added to favorites",
        description: "The apartment has been added to your favorites.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not add to favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (favoriteId: number) => {
      return apiRequest(`/api/favorites/${favoriteId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from favorites",
        description: "The apartment has been removed from your favorites.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not remove from favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Check if an apartment is favorited
  const isFavorite = (apartmentId: number): boolean => {
    return favorites.some((fav) => fav.apartmentId === apartmentId);
  };

  // Add a favorite
  const addFavorite = async (apartmentId: number): Promise<void> => {
    await addFavoriteMutation.mutateAsync(apartmentId);
  };

  // Remove a favorite
  const removeFavorite = async (favoriteId: number): Promise<void> => {
    await removeFavoriteMutation.mutateAsync(favoriteId);
  };

  const contextValue: FavoritesContextType = {
    favorites,
    isLoading,
    error: error as Error | null,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
