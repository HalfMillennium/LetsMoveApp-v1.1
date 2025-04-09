import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Heart, Search, Sliders, Map as MapIcon, MapPin, Globe, Menu, ChevronLeft, ChevronRight, Wifi, Coffee, Theater, Dumbbell, UtensilsCrossed, Binoculars } from "lucide-react";
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
      <header className="border-b border-gray-200 py-4 px-6 sticky top-0 z-10 bg-white">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-[#ff385c] fill-current">
              <path d="M12.0002 0.839996C12.0002 0.839996 14.6842 0.0379963 18.16 2.522C21.6358 5.006 22.5918 8.73 21.8238 13.104C21.0558 17.478 17.2998 22.4 12.0002 22.4C6.7006 22.4 2.94463 17.478 2.17663 13.104C1.40863 8.73 2.36463 5.006 5.84043 2.522C9.31623 0.0379963 12.0002 0.839996 12.0002 0.839996ZM12.0002 1.91999C11.296 1.91999 7.45343 2.01051 4.85903 5.39999C2.26463 8.78947 2.56224 12.5387 3.44064 15.44C4.31903 18.3413 7.82382 21.32 12.0002 21.32C16.1766 21.32 19.6814 18.3413 20.5598 15.44C21.4382 12.5387 21.7358 8.78947 19.1414 5.39999C16.547 2.01051 12.7044 1.91999 12.0002 1.91999Z" />
              <path d="M16.8918 11.8321C16.8918 11.3119 16.4765 10.8917 15.9649 10.8917C15.4533 10.8917 15.038 11.3119 15.038 11.8321C15.038 12.3523 15.4533 12.7724 15.9649 12.7724C16.4765 12.7724 16.8918 12.3523 16.8918 11.8321Z" />
              <path d="M12.0003 10.1724C11.4887 10.1724 11.0734 10.5926 11.0734 11.1128C11.0734 11.633 11.4887 12.0532 12.0003 12.0532C12.5119 12.0532 12.9272 11.633 12.9272 11.1128C12.9272 10.5926 12.5119 10.1724 12.0003 10.1724Z" />
              <path d="M8.03565 11.8321C8.03565 11.3119 7.62036 10.8917 7.10878 10.8917C6.5972 10.8917 6.18192 11.3119 6.18192 11.8321C6.18192 12.3523 6.5972 12.7724 7.10878 12.7724C7.62036 12.7724 8.03565 12.3523 8.03565 11.8321Z" />
            </svg>
            <span className="text-[#ff385c] font-bold text-xl ml-1">letsmove</span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-shadow">
            <button className="text-sm font-medium px-3 border-r border-gray-300">
              Beyoglu TR
            </button>
            <button className="text-sm font-medium px-3 border-r border-gray-300">
              Anytime
            </button>
            <button className="text-sm font-medium px-3">
              1 guest
            </button>
            <div className="bg-[#ff385c] rounded-full p-2 ml-2">
              <Search className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="text-gray-700 rounded-full hover:bg-gray-100 mr-2 hidden md:flex"
            >
              Airbnb your home
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-700 rounded-full p-2 hover:bg-gray-100 mr-2"
            >
              <Globe className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 rounded-full border border-gray-300 p-1 pl-3 shadow-sm hover:shadow-md">
                  <Menu className="h-4 w-4" />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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