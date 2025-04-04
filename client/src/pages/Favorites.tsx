import { useFavorites } from '../context/FavoritesContext';
import ApartmentCard from '../components/ApartmentCard';
import { useSearchParty } from '../context/SearchPartyContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Favorites = () => {
  const { favorites, isLoading } = useFavorites();
  const { searchParties } = useSearchParty();
  
  return (
    <div className="py-8 bg-[#FFF9F2]">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1A4A4A]">Your Favorites</h2>
          <p className="text-[#1A4A4A]/70 mt-2">
            Save your favorite apartments and share them with your search party
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-64" />
                <div className="p-4">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-[#1A4A4A] mb-3">No Favorites Yet</h3>
            <p className="text-[#1A4A4A]/70 mb-4">
              Start saving apartments you love and they'll appear here.
            </p>
            <Button 
              onClick={() => window.location.href = '/listings'}
              className="bg-[#E9927E] text-white hover:bg-[#E9927E]/90"
            >
              Browse Apartments
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <ApartmentCard 
                key={favorite.id} 
                apartment={favorite.apartment!} 
              />
            ))}
          </div>
        )}
        
        {searchParties.length > 0 && favorites.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#1A4A4A] mb-3">
              Share with Search Party
            </h3>
            <p className="text-[#1A4A4A]/70 mb-4">
              Share your favorites with your search party members to collaborate on finding the perfect apartment.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchParties.map((party) => (
                <Button 
                  key={party.id}
                  variant="outline"
                  className="border-[#C9DAD0] hover:bg-[#C9DAD0]/10"
                  onClick={() => window.location.href = `/search-party/${party.id}`}
                >
                  {party.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
