
import React from "react";
import { Apartment } from "@/types";
import { Heart, Map as MapIcon, Users } from "lucide-react";
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
      className="space-y-2 group cursor-pointer relative opacity-0 transform translate-y-4 scale-95 transition-all duration-700"
      onClick={() => handleApartmentSelect(apartment.id)}
    >
      <div className="relative overflow-hidden rounded-lg h-48">
        <img
          src={apartment.images[0]}
          alt={apartment.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white"
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
        <button
          className="absolute top-3 left-3 p-2 rounded-full bg-white/90 hover:bg-white cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToSearchParty(apartment);
          }}
        >
          <Users className="h-4 w-4 text-gray-700" />
        </button>
      </div>
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900 line-clamp-1 font-primary text-clamp-base">
          {apartment.title}
        </h3>
        <div className="flex items-center text-clamp-sm font-secondary">
          <span className="mr-1">★</span>
          <span>{formatRating(getListingRating(index))}</span>
          <span className="ml-1 text-gray-500">
            ({getListingReviews(index)})
          </span>
        </div>
      </div>
      <p className="text-gray-500 text-clamp-sm font-secondary leading-clamp-sm">
        {apartment.bedrooms} bed • {apartment.bathrooms} bath •{" "}
        {apartment.squareFeet} sq ft
      </p>
      <p className="text-gray-900 font-medium font-primary text-clamp-base">
        ${apartment.price}/month
      </p>
    </div>
  );
};
