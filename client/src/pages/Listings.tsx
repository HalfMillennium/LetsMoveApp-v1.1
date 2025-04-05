import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ApartmentCard from "../components/ApartmentCard";
import FilterChips from "../components/FilterChips";
import { Apartment, FilterSettings } from "../types";
import { Plus, MapPin, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { exampleApartments } from "../lib/utils";
import InteractiveMap from "../components/InteractiveMap2";
import RadarMap from "../components/RadarMap";
import { useGeolocation } from "../lib/useGeolocation";
import { initializeRadar } from "../lib/radarService";

const Listings = () => {
  const [location] = useLocation();
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterSettings>({});
  const [selectedApartmentId, setSelectedApartmentId] = useState<number | undefined>();
  const [viewMode, setViewMode] = useState<'split' | 'list'>('split');
  const [useRadarMap, setUseRadarMap] = useState<boolean>(true);
  const [searchParams] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      q: urlParams.get("q") || "",
      type: urlParams.get("type") || "",
    };
  });
  
  // Initialize Radar SDK when component mounts
  useEffect(() => {
    initializeRadar();
  }, []);

  // Fetch apartments with applied filters
  const {
    data: apartments = [],
    isLoading,
    refetch,
  } = useQuery<Apartment[]>({
    queryKey: ["/api/apartments", filters],
    queryFn: async () => {
      /*
      // Build query string from filters
      const params = new URLSearchParams();

      if (filters.minPrice)
        params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice)
        params.append("maxPrice", filters.maxPrice.toString());
      if (filters.bedrooms)
        params.append("bedrooms", filters.bedrooms.toString());
      if (filters.maxDistance)
        params.append("maxDistance", filters.maxDistance.toString());
      if (filters.petFriendly) params.append("petFriendly", "true");

      const response = await fetch(`/api/apartments?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch apartments");
      }
      return response.json();*/
      return exampleApartments;
    },
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterSettings) => {
    setFilters(newFilters);
    refetch();
  };

  // Handle load more
  const handleLoadMore = () => {
    toast({
      title: "Loading more listings",
      description: "Fetching additional apartments in this area.",
    });

    // In a real app, we would fetch more apartments
    // For now, just show a notification
  };

  // Handle apartment selection from map
  const handleApartmentSelect = (apartmentId: number) => {
    setSelectedApartmentId(apartmentId);
    
    // Scroll the selected apartment into view if in split mode
    if (viewMode === 'split') {
      const element = document.getElementById(`apartment-${apartmentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Toggle between split view and list view
  const toggleViewMode = () => {
    setViewMode(viewMode === 'split' ? 'list' : 'split');
  };

  return (
    <section className="flex-grow py-8 bg-[#FFF9F2]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1A4A4A]">
            {searchParams.q
              ? `Search Results for "${searchParams.q}"`
              : searchParams.type
                ? `${searchParams.type.charAt(0).toUpperCase() + searchParams.type.slice(1)}`
                : "Nearby Apartments"}
          </h2>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleViewMode}
              className="flex items-center gap-1 text-[#1A4A4A] hover:bg-[#C9DAD0]/20"
            >
              {viewMode === 'split' ? (
                <>
                  <List className="h-4 w-4" />
                  <span className="hidden md:inline">List View</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  <span className="hidden md:inline">Map View</span>
                </>
              )}
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-[#1A4A4A]">Filters</span>
              <button className="text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20">
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <FilterChips onFilterChange={handleFilterChange} />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                <Skeleton className="w-full h-64" />
                <div className="p-4">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : apartments.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold text-[#1A4A4A] mb-2">
              No apartments found
            </h3>
            <p className="text-[#1A4A4A]/70">
              Try adjusting your filters or search for a different area.
            </p>
          </div>
        ) : (
          <div className={`${viewMode === 'split' ? 'lg:grid lg:grid-cols-2 gap-6' : ''}`}>
            {/* Interactive Map - takes up half the screen in split view, hidden in list view */}
            {viewMode === 'split' && (
              <div className="lg:sticky lg:top-24 h-[70vh] lg:h-[calc(100vh-12rem)] mb-6 lg:mb-0">
                {useRadarMap ? (
                  <RadarMap
                    apartments={apartments.map(apt => ({
                      ...apt,
                      description: apt.description || null,
                      amenities: apt.amenities || null,
                      distance: apt.distance || null,
                      squareFeet: apt.squareFeet || null,
                      createdById: apt.createdById || null
                    }))}
                    onApartmentSelect={handleApartmentSelect}
                    selectedApartmentId={selectedApartmentId}
                  />
                ) : (
                  <InteractiveMap 
                    apartments={apartments} 
                    onApartmentSelect={handleApartmentSelect}
                    selectedApartmentId={selectedApartmentId}
                  />
                )}
                
                {/* Map Toggle Button */}
                <div className="absolute bottom-4 right-4 z-10">
                  <Button
                    variant="secondary"
                    className="text-xs bg-white shadow-md hover:bg-gray-100 text-[#1A4A4A]"
                    onClick={() => setUseRadarMap(!useRadarMap)}
                  >
                    {useRadarMap ? 'Use SVG Map' : 'Use Radar Map'}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Apartment Listings - takes up half the screen in split view, full width in list view */}
            <div className={`${viewMode === 'split' ? '' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
              {apartments.map((apartment) => (
                <div 
                  key={apartment.id}
                  id={`apartment-${apartment.id}`}
                  className={`mb-6 ${selectedApartmentId === apartment.id ? 'ring-2 ring-[#E9927E] rounded-lg' : ''}`}
                  onClick={() => setSelectedApartmentId(apartment.id)}
                >
                  <ApartmentCard apartment={apartment} />
                </div>
              ))}
              
              {apartments.length > 0 && (
                <div className={`mt-6 flex justify-center ${viewMode === 'split' ? 'col-span-1' : 'col-span-full'}`}>
                  <Button
                    onClick={handleLoadMore}
                    className="bg-[#E9927E] text-white px-6 py-3 rounded-full shadow-md hover:bg-[#E9927E]/90 transition-colors"
                  >
                    Load more listings
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Listings;
