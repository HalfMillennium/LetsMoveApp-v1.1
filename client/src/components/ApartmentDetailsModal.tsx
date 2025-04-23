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
  CheckCircle2,
  BadgeCheck,
  MapPin,
  Bath,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Apartment } from "../types";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ApartmentDetailsModalProps {
  apartment: Apartment | undefined;
  isOpen: boolean;
  onClose: () => void;
  onAddToFavorites?: (apartmentId: number) => void;
}

export const ApartmentDetailsModal: React.FC<ApartmentDetailsModalProps> = ({
  apartment,
  isOpen,
  onClose,
  onAddToFavorites,
}) => {
  if (!apartment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Content */}
        <div className="overflow-y-auto">
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
                <Heart className="h-4 w-4 text-rose-500" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 hover:bg-white rounded-full shadow-sm transition-all"
              >
                <Share2 className="h-4 w-4 text-blue-500" />
                Share
              </Button>
            </div>

            {/* Image pagination dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === 0 ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main apartment details */}
          <div className="p-6 space-y-6 w-full">
            {/* Basic info and price - responsive layout */}
            <div className="flex flex-col md:flex-row md:gap-4 md:justify-between items-start">
              {/* Left column - Title and interest */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {apartment.title}
                  </h1>
                  <p className="text-gray-600">{apartment.address}</p>
                </div>

                {/* Price info */}
                <div className="flex flex-col">
                  <div className="flex items-center mb-2 gap-1">
                    <span className="text-2xl font-semibold text-gray-900">
                      ${apartment.price}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
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
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2">
                About this apartment
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {apartment.description ||
                  `This beautiful ${apartment.bedrooms}-bedroom, ${
                    apartment.bathrooms
                  }-bathroom apartment 
                  features modern amenities and a spacious layout${
                    apartment.squareFeet
                      ? ` with ${apartment.squareFeet} square feet of living space`
                      : ""
                  }. 
                  Located in ${
                    apartment.location
                  } with easy access to transportation, shopping, and dining.`}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-3">
                What this place offers
              </h3>
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
      </DialogContent>
    </Dialog>
  );
};

export default ApartmentDetailsModal;
