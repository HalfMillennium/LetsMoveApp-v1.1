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
  Bath,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
      {/* Glass overlay with blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 top-[63px]"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed top-[63px] bottom-0 left-0 z-40 flex flex-col w-full md:w-2/3 lg:w-2/5 backdrop-blur-xl bg-white/80 border-r border-white/20 shadow-2xl transform transition-all duration-500 ease-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Glass header */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-white/70 p-6 border-b border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {apartment.title}
              </h2>
              <p className="text-gray-600">{apartment.address}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-white/50 backdrop-blur-sm transition-all duration-200 border border-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Image with Glass Elements */}
          <div className="relative overflow-hidden group m-4">
            <div className="w-full rounded-3xl overflow-hidden">
              <img
                src={apartment.images[0]}
                alt={apartment.title}
                className="w-full h-[320px] object-cover transition duration-700 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Save Button - Top Right */}
            <div className="absolute top-4 right-4">
              <Button
                variant="outline"
                size="sm"
                className="backdrop-blur-md bg-white/80 hover:bg-white/90 rounded-full shadow-lg border-white/20 transition-all duration-200 px-4"
                onClick={() => onAddToFavorites?.(apartment.id)}
              >
                <Heart className="h-4 w-4 text-rose-500 mr-2" />
                Save
              </Button>
            </div>

            {/* Image pagination dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === 0 ? "bg-white w-6" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Glass Card Content */}
          <div className="px-6 space-y-6">
            {/* Price and Basic Info Card */}
            <div className="backdrop-blur-md bg-white/60 rounded-3xl p-6 border border-white/20 shadow-lg">
              <div className="flex flex-col space-y-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${apartment.price}
                  </span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-3 backdrop-blur-sm bg-white/40 rounded-2xl border border-white/20">
                    <Home className="h-5 w-5 text-gray-600 mb-1" />
                    <span className="text-sm font-medium">{apartment.bedrooms} bed</span>
                  </div>
                  <div className="flex flex-col items-center p-3 backdrop-blur-sm bg-white/40 rounded-2xl border border-white/20">
                    <Bath className="h-5 w-5 text-gray-600 mb-1" />
                    <span className="text-sm font-medium">{apartment.bathrooms} bath</span>
                  </div>
                  <div className="flex flex-col items-center p-3 backdrop-blur-sm bg-white/40 rounded-2xl border border-white/20">
                    <MapPin className="h-5 w-5 text-gray-600 mb-1" />
                    <span className="text-sm font-medium">{apartment.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* People Interested Card */}
            <div className="backdrop-blur-md bg-white/60 rounded-3xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                People interested in this listing
              </h3>
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{
                        backgroundColor: ["#10B981", "#F59E0B", "#8B5CF6"][index - 1],
                      }}
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                    +8
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  This apartment is in 3 search parties
                </span>
              </div>
              
              <Button
                className="w-full rounded-2xl backdrop-blur-sm bg-gray-900/90 hover:bg-gray-900 text-white border-0 shadow-lg"
                onClick={() => onAddToSearchParty?.(apartment.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Search Party
              </Button>
            </div>

            {/* Description Card */}
            <div className="backdrop-blur-md bg-white/60 rounded-3xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                About this apartment
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {apartment.description ||
                  `This beautiful ${apartment.bedrooms}-bedroom, ${apartment.bathrooms}-bathroom apartment features modern amenities and a spacious layout${
                    apartment.squareFeet ? ` with ${apartment.squareFeet} square feet of living space` : ""
                  }. Located in ${apartment.location} with easy access to transportation, shopping, and dining.`}
              </p>
            </div>

            {/* Amenities Card */}
            <div className="backdrop-blur-md bg-white/60 rounded-3xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What this place offers
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {apartment.amenities && apartment.amenities.length > 0 ? (
                  apartment.amenities.slice(0, 6).map((amenity, index) => (
                    <div key={index} className="flex items-center p-3 backdrop-blur-sm bg-white/40 rounded-2xl border border-white/20">
                      <CheckCircle2 className="h-5 w-5 mr-3 text-green-600" />
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center p-3 backdrop-blur-sm bg-white/40 rounded-2xl border border-white/20">
                      <Wifi className="h-5 w-5 mr-3 text-blue-600" />
                      <span className="font-medium">High-speed WiFi</span>
                    </div>
                    <div className="flex items-center p-3 backdrop-blur-sm bg-white/40 rounded-2xl border border-white/20">
                      <DollarSign className="h-5 w-5 mr-3 text-green-600" />
                      <span className="font-medium">Utilities included</span>
                    </div>
                    <div className="flex items-center p-3 backdrop-blur-sm bg-white/40 rounded-2xl border border-white/20">
                      <BadgeCheck className="h-5 w-5 mr-3 text-purple-600" />
                      <span className="font-medium">Modern appliances</span>
                    </div>
                    <div className="flex items-center p-3 backdrop-blur-sm bg-white/40 rounded-2xl border border-white/20">
                      <Map className="h-5 w-5 mr-3 text-orange-600" />
                      <span className="font-medium">Close to transit</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Location Card */}
            <div className="backdrop-blur-md bg-white/60 rounded-3xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
              <div className="h-[220px] rounded-2xl overflow-hidden mb-4">
                <img
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${apartment.latitude},${apartment.longitude}&zoom=14&size=600x300&markers=color:red%7C${apartment.latitude},${apartment.longitude}`}
                  alt="Location map"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center p-3 backdrop-blur-sm bg-white/40 rounded-2xl border border-white/20">
                <MapPin className="h-5 w-5 mr-3 text-red-600" />
                <span className="font-medium">{apartment.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Glass Footer */}
        <div className="sticky bottom-0 backdrop-blur-md bg-white/80 border-t border-white/20 p-6 m-4 rounded-3xl shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">${apartment.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              <span className="text-sm text-gray-500">Best price in area</span>
            </div>
            <Button 
              size="lg" 
              className="px-8 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApartmentDetailsDrawer;
