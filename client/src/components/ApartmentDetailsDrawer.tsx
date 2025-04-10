import { useState, useEffect } from "react";
import { X, Heart, Share2, MapPin, Building, Home, Users, Calendar, DollarSign, Ship } from "lucide-react";
import { Apartment } from "../types";

import { cn } from "@/lib/utils";

interface ApartmentDetailsDrawerProps {
  apartment: Apartment | null;
  onClose: () => void;
  isOpen: boolean;
}

// Mock interested users data
const mockInterestedUsers = [
  { id: 1, name: "Alex Kim", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Jordan Smith", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Taylor Jones", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Morgan Lee", avatar: "https://i.pravatar.cc/150?img=4" }
];

// Mock listing sources
const listingSources = [
  "StreetEasy",
  "Zillow",
  "RentHop",
  "Apartments.com",
  "Trulia"
];

const ApartmentDetailsDrawer = ({ apartment, onClose, isOpen }: ApartmentDetailsDrawerProps) => {
  const [listingSource, setListingSource] = useState("");
  
  useEffect(() => {
    // Randomly select a listing source for the apartment
    if (apartment) {
      const randomIndex = Math.floor(Math.random() * listingSources.length);
      setListingSource(listingSources[randomIndex]);
    }
  }, [apartment]);

  if (!apartment) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 z-50 transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto transition-transform duration-500 ease-in-out transform",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-800 p-1 rounded-md mr-2">
              <Building size={18} />
            </div>
            <h2 className="text-lg font-semibold">Apartment Details</h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Gallery */}
          <div className="mb-6 overflow-hidden rounded-lg">
            <img 
              src={apartment.images[0]} 
              alt={apartment.title}
              className="w-full h-64 object-cover"
            />
            <div className="flex mt-2 overflow-x-auto space-x-2 pb-2">
              {apartment.images.slice(1).map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  alt={`${apartment.title} ${index + 2}`}
                  className="h-20 w-32 object-cover rounded-lg flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Title and actions */}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{apartment.title}</h1>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Heart size={18} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Price and basic info */}
          <div className="mb-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">${apartment.price}/month</div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin size={16} className="mr-2" />
              <span>{apartment.location}</span>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <Home size={14} className="mr-1" />
                <span>{apartment.bedrooms} bed</span>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <Ship size={14} className="mr-1" />
                <span>{apartment.bathrooms} bath</span>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                {apartment.squareFeet} sq ft
              </div>
            </div>
          </div>

          {/* Listing source */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Listed on</div>
            <div className="font-semibold">{listingSource}</div>
            <div className="text-xs text-gray-500 mt-1">Updated {Math.floor(Math.random() * 7) + 1} days ago</div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">
              {apartment.description || `This beautiful ${apartment.bedrooms}-bedroom, ${apartment.bathrooms}-bathroom apartment offers ${apartment.squareFeet} square feet of living space in a prime location. With modern amenities and incredible natural light, this is a perfect place to call home.`}
            </p>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Apartment Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Central AC", "Dishwasher", "Hardwood Floors", "Laundry in Building", "Pet Friendly", "Elevator", "Doorman", "Gym"].map((amenity, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interested users */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Interested Users</h3>
            <div className="flex flex-wrap -space-x-3">
              {mockInterestedUsers.map(user => (
                <div key={user.id} className="relative">
                  <img 
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                    title={user.name}
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ml-1 border-2 border-white">
                <span className="text-xs font-medium">+3</span>
              </div>
            </div>
          </div>

          {/* Key details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Key Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-2 text-gray-600 mt-0.5" />
                <div>
                  <div className="font-medium">Available</div>
                  <div className="text-sm text-gray-600">Immediately</div>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-5 h-5 mr-2 text-gray-600 mt-0.5" />
                <div>
                  <div className="font-medium">Neighborhood</div>
                  <div className="text-sm text-gray-600">{apartment.neighborhood || "Midtown"}</div>
                </div>
              </div>
              <div className="flex items-start">
                <DollarSign className="w-5 h-5 mr-2 text-gray-600 mt-0.5" />
                <div>
                  <div className="font-medium">Broker Fee</div>
                  <div className="text-sm text-gray-600">No Fee</div>
                </div>
              </div>
              <div className="flex items-start">
                <Building className="w-5 h-5 mr-2 text-gray-600 mt-0.5" />
                <div>
                  <div className="font-medium">Building</div>
                  <div className="text-sm text-gray-600">High-rise</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mb-4">
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Schedule a Viewing
            </button>
            <button className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Contact Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetailsDrawer;