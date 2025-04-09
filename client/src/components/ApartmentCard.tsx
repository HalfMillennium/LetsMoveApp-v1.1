import { Heart, MapPin } from "lucide-react";
import { Apartment } from "../types";
import { useFavorites } from "../context/FavoritesContext";
import { useSearchParty } from "../context/SearchPartyContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ApartmentCardProps {
  apartment: Apartment;
}

const ApartmentCard = ({ apartment }: ApartmentCardProps) => {
  const { addFavorite, removeFavorite, isFavorite, favorites } = useFavorites();
  const { searchParties, addListingToParty } = useSearchParty();
  const { toast } = useToast();

  const isFavorited = isFavorite(apartment.id);

  const handleFavoriteToggle = async () => {
    if (isFavorited) {
      const favorite = favorites.find((f) => f.apartmentId === apartment.id);
      if (favorite) {
        await removeFavorite(favorite.id);
      }
    } else {
      await addFavorite(apartment.id);
    }
  };

  const handleAddToSearchParty = async (searchPartyId: number) => {
    try {
      await addListingToParty(searchPartyId, apartment.id);
      toast({
        title: "Added to search party",
        description: "This apartment has been added to your search party.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add to search party. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col flex-1">
        <img
          src={apartment.images[0]}
          alt={`${apartment.title}`}
          className="w-full h-64 object-cover"
        />
        <button
          className={`absolute top-3 right-3 ${isFavorited ? "bg-[#E9927E]" : "bg-white"} p-2 rounded-full ${isFavorited ? "text-white" : "text-[#E9927E]"} hover:bg-[#FFF5E6]`}
          onClick={handleFavoriteToggle}
        >
          <Heart className="h-5 w-5" fill={isFavorited ? "white" : "none"} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-[#1A4A4A]">
            ${apartment.price}/month
          </h3>
          <div className="flex items-center text-[#1A4A4A]">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{apartment.distance}</span>
          </div>
        </div>
        <p className="text-[#1A4A4A] mb-2">
          {apartment.bedrooms} bed · {apartment.bathrooms} bath ·{" "}
          {apartment.squareFeet} sq ft
        </p>
        <p className="text-[#1A4A4A] text-sm mb-3">{apartment.location}</p>

        <div className="flex flex-col flex-1">
          <div className="flex-grow gap-2 mb-3">
            {apartment.amenities?.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="bg-[#C9DAD0]/20 text-[#1A4A4A] text-xs px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          Add to Search Party
        </Button>
        {/** 
                {searchParties.length > 0 && (
          <div className="flex flex-col h-full mt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  Add to Search Party
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {searchParties.map((party) => (
                  <DropdownMenuItem
                    key={party.id}
                    onClick={() => handleAddToSearchParty(party.id)}
                  >
                    {party.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}*/}
      </div>
    </div>
  );
};

export default ApartmentCard;
