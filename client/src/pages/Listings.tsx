import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import ApartmentCard from "../components/ApartmentCard";
import DraggableApartmentCard from "../components/DraggableApartmentCard";
import FilterChips from "../components/FilterChips";
import SearchPartyWidget from "../components/SearchPartyWidget";
import { Apartment, FilterSettings, SearchPartyListing } from "../types";
import { Plus, MapPin, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { exampleApartments } from "../lib/utils";
import { GoogleMapComponent } from "../components/GoogleMap";
import { useGeolocation } from "../lib/useGeolocation";
import { useSearchParty } from "../context/SearchPartyContext";

const Listings = () => {
  const [location] = useLocation();
  const { toast } = useToast();
  const searchPartyContext = useSearchParty();
  const [filters, setFilters] = useState<FilterSettings>({});
  const [selectedApartmentId, setSelectedApartmentId] = useState<
    number | undefined
  >();
  const [viewMode, setViewMode] = useState<"split" | "list">("split");
  const [searchParams] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      q: urlParams.get("q") || "",
      type: urlParams.get("type") || "",
    };
  });
  const [selectedSearchPartyId, setSelectedSearchPartyId] = useState<
    number | null
  >(null);
  const [searchPartyListings, setSearchPartyListings] = useState<
    SearchPartyListing[]
  >([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);

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

  // Filter apartments based on the selected search party
  useEffect(() => {
    if (selectedSearchPartyId === null) {
      setFilteredApartments(apartments);
      return;
    }

    const fetchSearchPartyListings = async () => {
      try {
        const listings = await searchPartyContext.getSearchPartyListings(
          selectedSearchPartyId,
        );
        setSearchPartyListings(listings);

        // Filter apartments to only show those in the search party
        const apartmentIds = listings.map((listing) => listing.apartmentId);
        const filtered = apartments.filter((apartment) =>
          apartmentIds.includes(apartment.id),
        );

        setFilteredApartments(filtered);
      } catch (error) {
        console.error("Error fetching search party listings:", error);
        toast({
          title: "Error",
          description: "Could not fetch search party listings",
          variant: "destructive",
        });
      }
    };

    fetchSearchPartyListings();
  }, [selectedSearchPartyId, apartments, searchPartyContext]);

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
    if (viewMode === "split") {
      const element = document.getElementById(`apartment-${apartmentId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Toggle between split view and list view
  const toggleViewMode = () => {
    setViewMode(viewMode === "split" ? "list" : "split");
  };

  // Filter apartments by search party
  const handleFilterBySearchParty = (searchPartyId: number | null) => {
    setSelectedSearchPartyId(searchPartyId);
  };

  // Handle drag end for react-beautiful-dnd
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside the droppable area or no valid destination
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle drop in search party drop area
    if (
      destination.droppableId === "searchPartyDropArea" &&
      selectedSearchPartyId
    ) {
      const apartmentId = parseInt(draggableId.replace("apartment-", ""), 10);

      addApartmentToSearchParty(selectedSearchPartyId, apartmentId);
    }
  };

  // Function to add apartment to search party
  const addApartmentToSearchParty = async (
    searchPartyId: number,
    apartmentId: number,
  ) => {
    try {
      // Check if apartment is already in the party (fetch current listings first)
      const currentListings =
        await searchPartyContext.getSearchPartyListings(searchPartyId);

      // Check if the apartment is already in the search party
      const alreadyExists = currentListings.some(
        (listing) => listing.apartmentId === apartmentId,
      );

      if (alreadyExists) {
        toast({
          title: "Already added",
          description: "This apartment is already in this search party",
        });
        return;
      }

      // Add the apartment to the search party
      await searchPartyContext.addListingToParty(searchPartyId, apartmentId);

      toast({
        title: "Apartment added",
        description: "Successfully added to your search party",
      });
    } catch (error) {
      console.error("Error adding listing to search party:", error);
      toast({
        title: "Error",
        description: "Could not add listing to search party",
        variant: "destructive",
      });
    }
  };

  const displayedApartments = selectedSearchPartyId
    ? filteredApartments
    : apartments;

  return (
    <section className="flex-grow py-8 bg-[#FFF9F2]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1A4A4A]">
            {searchParams.q
              ? `Search Results for "${searchParams.q}"`
              : searchParams.type
                ? `${
                    searchParams.type.charAt(0).toUpperCase() +
                    searchParams.type.slice(1)
                  }`
                : "Nearby Apartments"}
          </h2>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleViewMode}
              className="flex items-center gap-2 text-[#1A4A4A] hover:bg-[#C9DAD0]/20"
            >
              {viewMode === "split" ? (
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
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FilterChips onFilterChange={handleFilterChange} />
          <SearchPartyWidget
            apartments={apartments}
            onFilterBySearchParty={handleFilterBySearchParty}
          />
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div
            className={`${
              viewMode === "split" ? "lg:grid lg:grid-cols-2 gap-6" : ""
            }`}
          >
            {/* Google Map - takes up half the screen in split view, hidden in list view */}
            {viewMode === "split" && (
              <div className="lg:sticky lg:top-24 h-[70vh] lg:h-[calc(100vh-12rem)] mb-6 lg:mb-0 relative rounded-lg overflow-hidden shadow-md">
                <GoogleMapComponent
                  apartments={displayedApartments}
                  onApartmentSelect={handleApartmentSelect}
                  selectedApartmentId={selectedApartmentId}
                />
              </div>
            )}
            {/* Apartment Listings - takes up half the screen in split view, full width in list view */}
            <div className="w-full flex flex-col flex-1 gap-6">
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
              ) : displayedApartments.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-xl font-semibold text-[#1A4A4A] mb-2">
                    No apartments found
                  </h3>
                  <p className="text-[#1A4A4A]/70">
                    {selectedSearchPartyId
                      ? "This search party doesn't have any apartments yet"
                      : "Try adjusting your filters or search for a different area"}
                  </p>
                </div>
              ) : (
                <Droppable droppableId="apartmentList">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`grid grid-cols-2 gap-6 ${
                        viewMode === "split"
                          ? ""
                          : "md:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      {displayedApartments.map((apartment, index) => (
                        <DraggableApartmentCard
                          key={apartment.id}
                          apartment={apartment}
                          index={index}
                          isSelected={selectedApartmentId === apartment.id}
                          onClick={() => setSelectedApartmentId(apartment.id)}
                        />
                      ))}
                      {provided.placeholder}

                      {displayedApartments.length > 0 && (
                        <div
                          className={`mt-6 flex justify-center ${
                            viewMode === "split"
                              ? "col-span-1"
                              : "col-span-full"
                          }`}
                        >
                          <Button
                            onClick={handleLoadMore}
                            className="bg-[#E9927E] text-white px-6 py-3 rounded-full shadow-md hover:bg-[#E9927E]/90 transition-colors"
                          >
                            Load more listings
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          </div>
        </DragDropContext>
      </div>
    </section>
  );
};

export default Listings;
