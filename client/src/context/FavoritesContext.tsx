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
import { Favorite, Apartment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/clerk-react";


// Extended favorite type with apartment data
interface FavoriteWithApartment extends Favorite {
  apartment: Apartment;
}

interface FavoritesContextType {
  favorites: FavoriteWithApartment[];
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
  addFavorite: async (_apartmentId: number) => {},
  removeFavorite: async (_favoriteId: number) => {},
  isFavorite: (_apartmentId: number) => false,
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  DEFAULT_FAVORITES,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { getToken } = useAuth();

  console.log("🔍 FavoritesProvider: Initializing");

  // Fetch favorites
  const {
    data: favorites = [],
    isLoading,
    error,
  } = useQuery<FavoriteWithApartment[]>({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      console.log("🔍 FavoritesProvider: Fetching favorites from API");
      const response = await apiRequest("GET", "/api/favorites", undefined, getToken);
      const data = await response.json();
      console.log("🔍 FavoritesProvider: Received favorites data:", data);
      return data;
    },
  });

  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async (apartmentId: number) => {
      console.log("🔍 FavoritesProvider: Adding favorite for apartment ID:", apartmentId);
      const response = await apiRequest("POST", "/api/favorites", {
        apartmentId,
      }, getToken);
      console.log("🔍 FavoritesProvider: Add favorite response:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("🔍 FavoritesProvider: Add favorite successful:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Added to favorites",
        description: "The apartment has been added to your favorites.",
      });
    },
    onError: (error) => {
      console.error("🔍 FavoritesProvider: Add favorite failed:", error);
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
      console.log("🔍 FavoritesProvider: Removing favorite with ID:", favoriteId);
      const response = await apiRequest("DELETE", `/api/favorites/${favoriteId}`, undefined, getToken);
      console.log("🔍 FavoritesProvider: Remove favorite response:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("🔍 FavoritesProvider: Remove favorite successful:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from favorites",
        description: "The apartment has been removed from your favorites.",
      });
    },
    onError: (error) => {
      console.error("🔍 FavoritesProvider: Remove favorite failed:", error);
      toast({
        title: "Error",
        description: "Could not remove from favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Check if an apartment is favorited
  const isFavorite = (apartmentId: number): boolean => {
    const result = favorites.some((fav) => fav.apartmentId === apartmentId);
    console.log(`🔍 FavoritesProvider: Checking if apartment ${apartmentId} is favorite:`, result);
    console.log(`🔍 FavoritesProvider: Current favorites:`, favorites.map(f => ({ id: f.id, apartmentId: f.apartmentId })));
    return result;
  };

  // Add a favorite
  const addFavorite = async (apartmentId: number): Promise<void> => {
    console.log("🔍 FavoritesProvider: addFavorite called with apartmentId:", apartmentId);
    await addFavoriteMutation.mutateAsync(apartmentId);
  };

  // Remove a favorite
  const removeFavorite = async (favoriteId: number): Promise<void> => {
    console.log("🔍 FavoritesProvider: removeFavorite called with favoriteId:", favoriteId);
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
