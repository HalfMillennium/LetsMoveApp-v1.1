import React from "react";
import { 
  X, 
  Heart, 
  Share2, 
  Map, 
  Home, 
  Ruler, 
  Wifi, 
  DollarSign, 
  Building, 
  Plus, 
  CheckCircle2,
  BadgeCheck,
  MapPin,
  Bath
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Apartment } from "../types";

interface ApartmentDetailsDrawerProps {
  apartment: Apartment | undefined;
  isOpen: boolean;
  onClose: () => void;
  onAddToFavorites?: (apartmentId: number) => void;
  onAddToSearchParty?: (apartmentId: number) => void;
}

export const ApartmentDetailsDrawer: React.FC<ApartmentDetailsDrawerProps> = ({
  apartment,
  isOpen,
  onClose,
  onAddToFavorites,
  onAddToSearchParty,
}) => {
  if (!apartment) return null;

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-full md:w-1/3 lg:w-1/3 bg-white border-r shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold truncate">{apartment.title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <X className="h-3 w-3 mr-1" /> Click to close
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Images */}
          <div className="relative overflow-hidden group">
            <div className="w-full">
              <img
                src={apartment.images[0]}
                alt={apartment.title}
                className="w-full h-[280px] object-cover transition duration-700 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-50"></div>
            </div>
            <div className="absolute right-4 bottom-4 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 hover:bg-white rounded-full shadow-sm transition-all"
                onClick={() => onAddToFavorites?.(apartment.id)}
              >
                <Heart className="h-4 w-4 mr-2 text-rose-500" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 hover:bg-white rounded-full shadow-sm transition-all"
              >
                <Share2 className="h-4 w-4 mr-2 text-blue-500" />
                Share
              </Button>
            </div>
            
            {/* Image pagination dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {[0, 1, 2, 3].map((index) => (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>

          {/* Main apartment details */}
          <div className="p-6 space-y-6 w-full">
            {/* Basic info and price - responsive layout */}
            <div className="flex flex-col md:flex-row md:gap-4 md:justify-between">
              {/* Left column - Title and interest */}
              <div className="md:flex-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {apartment.title}
                </h1>
                <p className="text-gray-600">
                  {apartment.address}
                </p>
                <div className="flex items-center mt-2">
                  <Badge>{apartment.isAvailable ? "Available Now" : "Coming Soon"}</Badge>
                </div>
                
                {/* People who saved this listing */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">People interested in this listing</h3>
                  <div className="flex -space-x-2 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div 
                        key={index} 
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                        style={{
                          backgroundColor: ['#FFA07A', '#98FB98', '#87CEFA', '#FFD700', '#FF69B4'][index % 5],
                          zIndex: 10 - index
                        }}
                      >
                        <span className="sr-only">User {index}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium text-gray-500">
                      +8
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This apartment is in 3 search parties
                  </p>
                </div>
              </div>
              
              {/* Right column - Price and details (only visible on md+ screens) */}
              <div className="hidden md:block md:w-[220px] md:flex-none">
                <div className="bg-gray-50 p-4 rounded-lg h-full">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold text-gray-900">${apartment.price}</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 mb-4">
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{apartment.bedrooms} bed</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{apartment.bathrooms} bath</span>
                        </div>
                        {apartment.squareFeet && (
                          <div className="flex items-center">
                            <Ruler className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{apartment.squareFeet} sq ft</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{apartment.location}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => onAddToSearchParty?.(apartment.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Search Party
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Price and details - Mobile only */}
            <div className="md:hidden w-full">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">${apartment.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{apartment.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{apartment.bathrooms} bath</span>
                    </div>
                    {apartment.squareFeet && (
                      <div className="flex items-center">
                        <Ruler className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{apartment.squareFeet} sq ft</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{apartment.location}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => onAddToSearchParty?.(apartment.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Search Party
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2">About this apartment</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {apartment.description || 
                  `This beautiful ${apartment.bedrooms}-bedroom, ${apartment.bathrooms}-bathroom apartment 
                  features modern amenities and a spacious layout${apartment.squareFeet ? ` with ${apartment.squareFeet} square feet of living space` : ''}. 
                  Located in ${apartment.location} with easy access to transportation, shopping, and dining.`}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-3">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {apartment.amenities && apartment.amenities.length > 0 ? (
                  apartment.amenities.slice(0, 4).map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-3 text-gray-500" />
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 mr-3 text-gray-500" />
                      <span>High-speed WiFi</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-3 text-gray-500" />
                      <span>Utilities included</span>
                    </div>
                    <div className="flex items-center">
                      <BadgeCheck className="h-4 w-4 mr-3 text-gray-500" />
                      <span>Modern appliances</span>
                    </div>
                    <div className="flex items-center">
                      <Map className="h-4 w-4 mr-3 text-gray-500" />
                      <span>Close to transit</span>
                    </div>
                  </>
                )}
              </div>
              {apartment.amenities && apartment.amenities.length > 4 && (
                <Button variant="outline" className="w-full mt-4">
                  Show all amenities
                </Button>
              )}
            </div>

            <Separator />

            {/* Location */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-3">Location</h3>
              <div className="h-[200px] bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${apartment.latitude},${apartment.longitude}&zoom=14&size=600x300&markers=color:red%7C${apartment.latitude},${apartment.longitude}`} 
                  alt="Location map"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="mt-2 text-gray-700">
                {apartment.address} • {apartment.location}
              </p>
            </div>
          </div>
        </div>

        {/* Fixed footer for mobile */}
        <div className="md:hidden sticky bottom-0 border-t bg-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-semibold">${apartment.price}</span>
              <span className="text-gray-500">/month</span>
            </div>
            <Button size="sm" className="px-6">Apply Now</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApartmentDetailsDrawer;