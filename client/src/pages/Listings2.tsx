import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import {
  Heart,
  Search,
  Sliders,
  Map as MapIcon,
  MapPin,
  Globe,
  Menu,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Home,
  Flower2,
  Train,
  Dog,
  Building2,
  Waves,
  Star
} from "lucide-react";
import { Apartment, FilterSettings, ActiveFilters } from "../types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleMapComponent } from "../components/GoogleMap";
import { useGeolocation } from "../lib/useGeolocation";
import { PRICE_RANGES, BEDROOM_OPTIONS } from "../lib/constants";
import FilterChips from "../components/FilterChips";
import { exampleApartments } from "../lib/utils";
import ApartmentDetailsDrawer from "../components/ApartmentDetailsDrawer";

const Listings2 = () => {
  const [location] = useLocation();
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterSettings>({});
  const [selectedApartmentId, setSelectedApartmentId] = useState<
    number | undefined
  >();
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState<boolean>(false);
  const [searchParams] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      q: urlParams.get("q") || "",
      type: urlParams.get("type") || "",
    };
  });
  const [activeCategory, setActiveCategory] =
    useState<string>("All Apartments");
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

  // Handle apartment selection from map or list
  const handleApartmentSelect = (apartmentId: number) => {
    setSelectedApartmentId(apartmentId);
    setIsDetailsDrawerOpen(true);
  };
  
  // Find the selected apartment
  const selectedApartment = apartments.find(apt => apt.id === selectedApartmentId);
  
  // Handle drawer close
  const handleCloseDetailsDrawer = () => {
    setIsDetailsDrawerOpen(false);
  };

  // Toggle map expansion
  const toggleMapExpansion = () => {
    setMapExpanded(!mapExpanded);
  };

  const [activeListingFilters, setActiveListingFilters] =
    useState<ActiveFilters>({});

  // Custom apartment collections
  const apartmentCollections = [
    { name: "All Apartments", icon: <Home className="h-4 w-4" /> },
    { name: "Close to Parks", icon: <Flower2 className="h-4 w-4" /> },
    { name: "Close to Subway", icon: <Train className="h-4 w-4" /> },
    { name: "Pet Friendly", icon: <Dog className="h-4 w-4" /> },
    { name: "New Construction", icon: <Building2 className="h-4 w-4" /> },
    { name: "Waterfront View", icon: <Waves className="h-4 w-4" /> },
    { name: "Luxury Units", icon: <Star className="h-4 w-4" /> },
  ];

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const updateActiveFilters = (activeFilters: ActiveFilters) => {
    setActiveListingFilters(activeFilters);
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
    <>
      <div className={`flex flex-col min-h-screen bg-white w-full transition-all duration-300 ${isDetailsDrawerOpen ? 'md:ml-[50%] lg:ml-[50%]' : ''}`}>
        {/* Custom Apartment Collections Tabs */}
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-6 py-4 flex items-center overflow-x-auto scrollbar-hide">
            {apartmentCollections.map((collection) => (
              <button
                key={collection.name}
                className={`flex flex-col items-center px-4 py-2 whitespace-nowrap mr-6 transition-all ${
                  activeCategory === collection.name
                    ? "border-b-2 border-gray-800 text-gray-800"
                    : "text-gray-500 hover:text-gray-800 hover:border-b-2 hover:border-gray-300"
                }`}
                onClick={() => handleCategoryChange(collection.name)}
              >
                <div className="flex items-center mb-1">{collection.icon}</div>
                <span className="text-sm">{collection.name}</span>
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
          <div className="flex flex-1 items-end justify-between">
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">{apartments.length} listings available</p>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                {activeCategory}
              </h1>
            </div>
            <FilterChips
              onFilterChange={handleFilterChange}
              updateActiveFilters={updateActiveFilters}
            />
          </div>

          {/* Main Grid with Map Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Apartment Listings */}
            <div className={`${mapExpanded ? "hidden lg:block" : ""}`}>
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
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {apartment.title}
                        </h3>
                        <div className="flex items-center text-sm">
                          <span className="mr-1">★</span>
                          <span>{formatRating(getListingRating(index))}</span>
                          <span className="ml-1 text-gray-500">
                            ({getListingReviews(index)})
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {apartment.bedrooms} bed • {apartment.bathrooms} bath • {apartment.squareFeet} sq ft
                      </p>
                      <p className="text-gray-900 font-medium">
                        ${apartment.price}/month
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map View */}
            <div
              className={`lg:sticky lg:top-20 h-[70vh] rounded-lg overflow-hidden shadow-md border border-gray-200 
                ${mapExpanded ? "col-span-2" : ""}`}
            >
              <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMapExpansion}
                  className="text-gray-700 hover:bg-gray-100"
                >
                  {mapExpanded ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
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
      
      {/* Apartment Details Drawer */}
      <ApartmentDetailsDrawer
        apartment={selectedApartment}
        isOpen={isDetailsDrawerOpen}
        onClose={handleCloseDetailsDrawer}
        onAddToFavorites={(id) => {
          toast({
            title: "Added to favorites",
            description: "Apartment has been added to your favorites list",
          });
        }}
        onAddToSearchParty={(id) => {
          toast({
            title: "Added to Search Party",
            description: "Apartment has been added to your active search party",
          });
        }}
      />
    </>
  );
};

export default Listings2;
