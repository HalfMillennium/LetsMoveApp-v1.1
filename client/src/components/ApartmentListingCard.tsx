import React from "react";
import { Apartment } from "@/types";
import { Heart, Map as MapIcon, Users, Bed, Bath, Square, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApartmentListingCardProps {
  apartment: Apartment;
  apartmentRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  index: number;
  handleApartmentSelect: (id: number) => void;
  handleAddToSearchParty: (apartment: Apartment) => void;
}

const formatRating = (rating: number) => rating.toFixed(1);

const getListingRating = (index: number) => {
  const ratings = [4.93, 4.97, 4.97, 4.85, 4.92, 4.78, 4.88];
  return ratings[index % ratings.length];
};

const getListingReviews = (index: number) => {
  const reviews = [407, 700, 385, 562, 238, 645, 389];
  return reviews[index % reviews.length];
};

export const ApartmentListingCard: React.FC<ApartmentListingCardProps> = ({
  apartment,
  apartmentRefs,
  index,
  handleApartmentSelect,
  handleAddToSearchParty,
}) => {
  const { toast } = useToast();
  return (
    <div
      key={apartment.id}
      ref={(el) => (apartmentRefs.current[index] = el)}
      className="group cursor-pointer relative opacity-0 transform translate-y-4 scale-95 transition-all duration-700"
      onClick={() => handleApartmentSelect(apartment.id)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl h-52 mb-3">
        <img
          src={apartment.images[0]}
          alt={apartment.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        
        {/* Play button overlay - for video/virtual tours */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/80 rounded-full p-2 opacity-90 hover:opacity-100 transition-opacity hover:scale-105 cursor-pointer">
            <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center">
              <Play className="h-4 w-4 fill-white ml-0.5" />
            </div>
          </div>
        </div>
        
        {/* Favorite Button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            // Handle favorite toggle
            toast({
              title: "Added to favorites",
              description: "Apartment has been added to your favorites",
            });
          }}
        >
          <Heart className="h-4 w-4 text-gray-700" />
        </button>
        
        {/* Search Party Button */}
        <button
          className="absolute top-3 left-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToSearchParty(apartment);
          }}
        >
          <Users className="h-4 w-4 text-gray-700" />
        </button>
      </div>
      
      {/* Main Text Content */}
      <div className="space-y-1">
        {/* Title and Address */}
        <div>
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
            {apartment.title}
          </h3>
          <p className="text-gray-500 text-sm">
            {apartment.address.split(',')[0]}, {apartment.location}
          </p>
        </div>
        
        {/* Price */}
        <p className="text-primary font-medium text-xl">
          ${apartment.price.toLocaleString()}
        </p>
        
        {/* Features */}
        <div className="flex items-center space-x-5 pt-2">
          <div className="flex items-center text-gray-700">
            <Bed className="h-4 w-4 mr-1.5 text-gray-500" />
            <span className="text-sm">{apartment.bedrooms}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Bath className="h-4 w-4 mr-1.5 text-gray-500" />
            <span className="text-sm">{apartment.bathrooms}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Square className="h-4 w-4 mr-1.5 text-gray-500" />
            <span className="text-sm">{apartment.squareFeet} ft²</span>
          </div>
        </div>
      </div>
    </div>
  );
};
