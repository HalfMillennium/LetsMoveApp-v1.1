import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Heart, Search, Sliders, Map as MapIcon, MapPin, Globe, Menu, ChevronLeft, ChevronRight, Wifi, Coffee, Theater, Dumbbell, UtensilsCrossed, Binoculars, CircleUserRound } from "lucide-react";
import { Apartment, FilterSettings } from "../types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleMapComponent } from "../components/GoogleMap";
import { useGeolocation } from "../lib/useGeolocation";
import { PRICE_RANGES, BEDROOM_OPTIONS } from '../lib/constants';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { exampleApartments } from "../lib/utils";
import appLogo from "../assets/letsmove_logo_black.png";

const Listings2 = () => {
  const [location] = useLocation();
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterSettings>({});
  const [selectedApartmentId, setSelectedApartmentId] = useState<number | undefined>();
  const [searchParams] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      q: urlParams.get("q") || "",
      type: urlParams.get("type") || "",
    };
  });
  const [activeCategory, setActiveCategory] = useState<string>("Art and culture");
  const [mapExpanded, setMapExpanded] = useState<boolean>(false);

  // Used to show number of experiences/listings
  const totalListings = 235;

  // Fetch apartments with applied filters
  const {
    data: apartments = [],
    isLoading,
    refetch,
  } = useQuery<Apartment[]>({
    queryKey: ["/api/apartments", filters],
    queryFn: async () => {
      // In a real app, we would fetch from the API with filters
      // For now, use the example data
      return exampleApartments;
    },
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterSettings) => {
    setFilters(newFilters);
    refetch();
  };

  // Handle apartment selection from map
  const handleApartmentSelect = (apartmentId: number) => {
    setSelectedApartmentId(apartmentId);
  };

  // Toggle map expansion
  const toggleMapExpansion = () => {
    setMapExpanded(!mapExpanded);
  };

  // Category filtering
  const categories = [
    { name: "Art and culture", icon: <UtensilsCrossed className="h-4 w-4" /> },
    { name: "Entertainment", icon: <Theater className="h-4 w-4" /> },
    { name: "Food and drink", icon: <Coffee className="h-4 w-4" /> },
    { name: "Sports", icon: <Dumbbell className="h-4 w-4" /> },
    { name: "Tours", icon: <MapPin className="h-4 w-4" /> },
    { name: "Sightseeing", icon: <Binoculars className="h-4 w-4" /> },
    { name: "Wellness", icon: <Wifi className="h-4 w-4" /> },
  ];

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Handle rating and price display for each listing
  const formatRating = (rating: number) => rating.toFixed(1);
  
  // These would come from the actual data in a real app
  const getListingRating = (index: number) => {
    const ratings = [4.93, 4.97, 4.97, 4.85, 4.92, 4.78, 4.88];
    return ratings[index % ratings.length];
  };
  
  const getListingReviews = (index: number) => {
    const reviews = [407, 700, 385, 562, 238, 645, 389];
    return reviews[index % reviews.length];
  };
  
  const getListingDuration = (index: number) => {
    const durations = [2, 6, 3, 4, 1, 5, 2];
    return durations[index % durations.length];
  };
  
  const getListingPrice = (index: number) => {
    const prices = [30, 39, 44, 55, 28, 42, 36];
    return prices[index % prices.length];
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFF5E6] shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/">
            <img src={appLogo} className="h-8 cursor-pointer" />
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <button
              className="text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20"
            >
              <Search className="h-6 w-6" />
            </button>

            <button>
              <Link
                href="/profile"
                className="flex flex-1 w-full text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20"
              >
                <CircleUserRound color="#1A4A4A" className="h-6 w-6" />
              </Link>
            </button>

            <button className="text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20 md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`flex flex-col items-center px-4 py-2 whitespace-nowrap mr-6 transition-all ${
                activeCategory === category.name
                  ? "border-b-2 border-gray-800 text-gray-800"
                  : "text-gray-500 hover:text-gray-800 hover:border-b-2 hover:border-gray-300"
              }`}
              onClick={() => handleCategoryChange(category.name)}
            >
              <div className="flex items-center mb-1">
                {category.icon}
              </div>
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
          <button
            className="flex items-center ml-4 px-4 py-2 border border-gray-300 rounded-full text-gray-700 whitespace-nowrap"
          >
            <Sliders className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">{totalListings} experiences</p>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">{activeCategory}</h1>
        </div>

        {/* Main Grid with Map Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Apartment Listings */}
          <div className={`${mapExpanded ? 'hidden lg:block' : ''}`}>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {apartments.map((apartment, index) => (
                  <div 
                    key={apartment.id} 
                    className="space-y-2 group cursor-pointer"
                    onClick={() => handleApartmentSelect(apartment.id)}
                  >
                    <div className="relative overflow-hidden rounded-lg h-48">
                      <img 
                        src={apartment.images[0]} 
                        alt={apartment.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white">
                        <Heart className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{apartment.title}</h3>
                      <div className="flex items-center text-sm">
                        <span className="mr-1">★</span>
                        <span>{formatRating(getListingRating(index))}</span>
                        <span className="ml-1 text-gray-500">({getListingReviews(index)})</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">{getListingDuration(index)} hours</p>
                    <p className="text-gray-900 font-medium">From ${getListingPrice(index)} / person</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map View */}
          <div 
            className={`lg:sticky lg:top-20 h-[70vh] rounded-lg overflow-hidden shadow-md border border-gray-200 
              ${mapExpanded ? 'col-span-2' : ''}`}
          >
            <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMapExpansion}
                className="text-gray-700 hover:bg-gray-100"
              >
                {mapExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
            <GoogleMapComponent
              apartments={apartments}
              onApartmentSelect={handleApartmentSelect}
              selectedApartmentId={selectedApartmentId}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Listings2;