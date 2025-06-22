import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";
import ApartmentCard from "../components/ApartmentCard";
import { useSearchParty } from "../context/SearchPartyContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Share, Home, ArrowRight } from "lucide-react";

const Favorites = () => {
  const { favorites, isLoading } = useFavorites();
  const { searchParties } = useSearchParty();

  console.log("🔍 Favorites Page: Rendering with data:", {
    favorites,
    isLoading,
    favoritesCount: favorites.length
  });

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-[#FFF9F2] via-white to-[#FFF5E6] w-full"
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Favorites
            </h1>
            <p className="text-gray-600">Save and share apartments you love</p>
          </motion.div>
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                onClick={() => (window.location.href = "/listings")}
                className="mt-4 sm:mt-0 rounded-full bg-orange-400 hover:bg-orange-500 text-white font-medium px-6 py-2.5"
              >
                <Home className="mr-2 h-4 w-4" />
                Browse More
              </Button>
            </motion.div>
          )}
        </motion.div>

        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg overflow-hidden"
                  >
                    <Skeleton className="w-full h-48" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : favorites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 text-center"
          >
            <div className="max-w-md mx-auto">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Heart className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No Favorites Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start saving apartments you love and they'll appear here. Browse
                our listings to find your perfect place.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <Button
                  onClick={() => (window.location.href = "/listings")}
                  className="bg-orange-400 hover:bg-orange-500 text-white rounded-full px-6 py-2.5 font-medium"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Browse Apartments
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Favorites Grid */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Saved Apartments ({favorites.length})
                </h2>
                <div className="flex items-center text-sm text-gray-600">
                  <Heart className="h-4 w-4 mr-1 text-red-500" />
                  <span>Your favorites</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                  <ApartmentCard
                    key={favorite.id}
                    apartment={favorite.apartment!}
                  />
                ))}
              </div>
            </div>

            {/* Share with Search Parties */}
            {searchParties.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Share with Search Parties
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Collaborate with your search party members
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Share className="h-4 w-4 mr-1 text-blue-500" />
                    <span>Collaboration</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {searchParties.map((party) => (
                    <Button
                      key={party.id}
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50 text-gray-700 rounded-full p-3 h-auto flex items-center justify-between"
                      onClick={() =>
                        (window.location.href = `/search-party/${party.id}`)
                      }
                    >
                      <span className="font-medium">{party.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Favorites;
