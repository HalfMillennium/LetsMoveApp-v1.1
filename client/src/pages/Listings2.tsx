import { useState, useEffect, useRef } from "react";
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
  ListPlus,
  Home,
  Flower2,
  Train,
  Dog,
  Building2,
  Waves,
  Star,
  GalleryVerticalEnd,
  ChevronDown,
  GripVertical,
  Users,
  Filter,
} from "lucide-react";
import {
  Apartment,
  FilterSettings,
  ActiveFilters,
  SearchParty,
} from "../types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleMapComponent } from "../components/GoogleMap";
import { useGeolocation } from "../lib/useGeolocation";
import { PRICE_RANGES, BEDROOM_OPTIONS } from "../lib/constants";
import FilterChips from "../components/FilterChips";
import { exampleApartments } from "../lib/utils";
import ApartmentDetailsDrawer from "../components/ApartmentDetailsDrawer";
import CreateCollectionModal from "../components/CreateCollectionModal";
import AllCollectionsModal from "../components/AllCollectionsModal";
import AddToSearchPartyModal from "../components/AddToSearchPartyModal";
import SearchPartyDropZone from "../components/SearchPartyDropZone";
import CollectionsPopover from "../components/CollectionsPopover";
import { useSearchParty } from "../context/SearchPartyContext";

const Listings2 = () => {
  const [location] = useLocation();
  const { toast } = useToast();
  const { searchParties } = useSearchParty();
  const [filters, setFilters] = useState<FilterSettings>({});
  const [selectedApartmentId, setSelectedApartmentId] = useState<
    number | undefined
  >();
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] =
    useState<boolean>(false);
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

  // Search party states
  const [showSearchPartyOverlay, setShowSearchPartyOverlay] =
    useState<boolean>(false);
  const [activeSearchParty, setActiveSearchParty] =
    useState<SearchParty | null>(null);
  const [addToPartyModalOpen, setAddToPartyModalOpen] =
    useState<boolean>(false);
  const [apartmentToAdd, setApartmentToAdd] = useState<Apartment | undefined>();

  // Initialize active search party if any exist
  useEffect(() => {
    if (searchParties && searchParties.length > 0 && !activeSearchParty) {
      setActiveSearchParty(searchParties[0]);
    }
  }, [searchParties, activeSearchParty]);

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
  const selectedApartment = apartments.find(
    (apt) => apt.id === selectedApartmentId,
  );

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

  // State for collections management
  const [createCollectionModalOpen, setCreateCollectionModalOpen] =
    useState(false);
  const [allCollectionsModalOpen, setAllCollectionsModalOpen] = useState(false);

  // Default built-in collections
  const defaultCollections = [
    { name: "All Apartments", icon: <Home className="h-4 w-4" /> },
    { name: "Close to Parks", icon: <Flower2 className="h-4 w-4" /> },
    { name: "Close to Subway", icon: <Train className="h-4 w-4" /> },
    { name: "Pet Friendly", icon: <Dog className="h-4 w-4" /> },
    { name: "New Construction", icon: <Building2 className="h-4 w-4" /> },
  ];

  // User-created collections saved in state
  const [userCollections, setUserCollections] = useState<
    Array<{ name: string; icon: React.ReactNode }>
  >([]);

  // All collections combined
  const apartmentCollections = [...defaultCollections, ...userCollections];

  // Collection modification handlers
  const handleAddCollection = () => {
    setCreateCollectionModalOpen(true);
  };

  const handleCreateCollection = (name: string, iconIndex: number) => {
    const collectionIcons = [
      <Home className="h-4 w-4" />,
      <Building2 className="h-4 w-4" />,
      <MapIcon className="h-4 w-4" />,
      <MapPin className="h-4 w-4" />,
      <Flower2 className="h-4 w-4" />,
      <Star className="h-4 w-4" />,
      <Train className="h-4 w-4" />,
      <Dog className="h-4 w-4" />,
      <Globe className="h-4 w-4" />,
    ];

    const newCollection = {
      name,
      icon: collectionIcons[iconIndex],
    };

    setUserCollections([...userCollections, newCollection]);

    toast({
      title: "Collection created",
      description: `Your "${name}" collection has been created`,
    });
  };

  const handleOpenAllCollectionsModal = () => {
    setAllCollectionsModalOpen(true);
  };

  // Helper to check if collections might overflow
  const mightCollectionsOverflow = apartmentCollections.length > 5;

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

  // Animation refs
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listingsContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const apartmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const collectionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset apartment refs whenever apartments change
  useEffect(() => {
    apartmentRefs.current = apartmentRefs.current.slice(0, apartments.length);
  }, [apartments]);
  
  // Apply animations when component mounts using CSS transitions
  useEffect(() => {
    // Animate header elements
    setTimeout(() => {
      if (headerRef.current) {
        headerRef.current.style.opacity = '1';
        headerRef.current.style.transform = 'translateY(0)';
      }
    }, 100);

    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.transform = 'translateY(0)';
      }
    }, 300);
    
    // Animate map
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.style.opacity = '1';
      }
    }, 400);
    
    // Animate collection tabs with stagger effect
    const tabButtons = collectionRefs.current.filter(Boolean) as HTMLButtonElement[];
    tabButtons.forEach((button, index) => {
      setTimeout(() => {
        if (button) {
          button.style.opacity = '1';
          button.style.transform = 'translateY(0)';
        }
      }, 300 + (index * 40));
    });
    
    // Animate apartment cards with stagger effect
    const cards = apartmentRefs.current.filter(Boolean) as HTMLDivElement[];
    cards.forEach((card, index) => {
      setTimeout(() => {
        if (card) {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }
      }, 500 + (index * 70));
    });
  }, [apartments, isLoading]);
  
  // Handle adding apartment to search party
  const handleAddToSearchParty = (apartment: Apartment) => {
    setApartmentToAdd(apartment);
    setAddToPartyModalOpen(true);
    setShowSearchPartyOverlay(true);

    toast({
      title: "Adding to search party",
      description: "Preparing to add apartment to search party",
    });
  };

  return (
    <>
      <div
        className={`flex flex-col min-h-screen bg-white w-full transition-all duration-300 ${isDetailsDrawerOpen ? "md:ml-[33.333%] lg:ml-[33.333%]" : ""}`}
      >
        {/* Responsive Collection Navigation */}
        <div ref={headerRef} className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm opacity-0 transform -translate-y-4 transition-all duration-500">
          {/* Mobile Collections Popover - Only visible on small screens */}
          <div className="md:hidden container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CollectionsPopover
                collections={apartmentCollections}
                activeCategory={activeCategory}
                onSelectCollection={handleCategoryChange}
                onAddCollection={handleAddCollection}
              />
              <Button
                variant="outline"
                size="sm"
                className="rounded-full flex items-center gap-2 border-gray-200 bg-white/90 hover:bg-white"
                onClick={handleAddCollection}
              >
                <ListPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Collections Tabs - Only visible on medium screens and up */}
          <div className="hidden md:block">
            <div className="container mx-auto px-6 py-4 flex items-center overflow-x-auto scrollbar-hide">
              {apartmentCollections.map((collection, idx) => (
                <button
                  key={collection.name}
                  ref={el => collectionRefs.current[idx] = el}
                  className={`flex flex-col items-center px-4 py-2 whitespace-nowrap mr-4 transition-all opacity-0 transform -translate-y-4 duration-500 ${
                    activeCategory === collection.name
                      ? "border-b-2 border-gray-800 text-gray-800"
                      : "text-gray-500 hover:text-gray-800 hover:border-b-2 hover:border-gray-300"
                  }`}
                  onClick={() => handleCategoryChange(collection.name)}
                >
                  <div className="flex items-center mb-1">
                    {collection.icon}
                  </div>
                  <span className="text-sm">{collection.name}</span>
                </button>
              ))}

              {/* View All Button - Only shows when collections might overflow */}
              {mightCollectionsOverflow && (
                <button
                  className="flex items-center ml-2 px-4 py-2 border border-gray-200 rounded-full text-gray-700 whitespace-nowrap hover:bg-gray-50 gap-2"
                  onClick={handleOpenAllCollectionsModal}
                >
                  <GalleryVerticalEnd className="h-4 w-4" />
                  <span className="text-sm font-medium mr-1">View All</span>
                </button>
              )}

              <button
                className="flex items-center ml-auto px-4 py-2 font-medium rounded-full text-gray-700 whitespace-nowrap items-center gap-2 bg-primary text-white"
                onClick={handleAddCollection}
              >
                <div className="flex items-center">
                  <ListPlus className="h-4 w-4" />
                </div>
                <span className="flex text-sm">New Collection</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-6">
          <div className="flex flex-1 flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex flex-col flex-1">
              <p className="text-sm text-gray-600">
                {apartments.length} listings available
              </p>
              <h1 ref={titleRef} className="text-2xl font-semibold text-gray-900 mb-4 opacity-0 transform translate-y-4 transition-all duration-700">
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
                      ref={el => apartmentRefs.current[index] = el}
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
                              description:
                                "Apartment has been added to your favorites",
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
                        {apartment.bedrooms} bed • {apartment.bathrooms} bath •{" "}
                        {apartment.squareFeet} sq ft
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
            <div ref={mapRef} className="lg:sticky lg:top-20 h-[70vh] rounded-lg overflow-hidden shadow-md border border-gray-200 opacity-0 transition-opacity duration-700">
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

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={createCollectionModalOpen}
        onClose={() => setCreateCollectionModalOpen(false)}
        onCreateCollection={handleCreateCollection}
      />

      {/* All Collections Modal */}
      <AllCollectionsModal
        isOpen={allCollectionsModalOpen}
        onClose={() => setAllCollectionsModalOpen(false)}
        collections={apartmentCollections}
        onSelectCollection={handleCategoryChange}
        onAddCollection={handleAddCollection}
      />

      {/* Search Party Floating Overlay */}
      {showSearchPartyOverlay && activeSearchParty && (
        <SearchPartyDropZone
          onAddToParty={(apartmentId) => {
            const apartment = apartments.find((a) => a.id === apartmentId);
            if (apartment) {
              setApartmentToAdd(apartment);
              setAddToPartyModalOpen(true);
            }
          }}
          onClose={() => setShowSearchPartyOverlay(false)}
          currentSearchParty={activeSearchParty}
        />
      )}

      {/* Add to Search Party Modal */}
      <AddToSearchPartyModal
        apartment={apartmentToAdd}
        isOpen={addToPartyModalOpen}
        onClose={() => {
          setAddToPartyModalOpen(false);
          setApartmentToAdd(undefined);
        }}
      />

      {/* Select Search Party Toggle Button */}
      {!showSearchPartyOverlay && searchParties && searchParties.length > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <Button
            className="bg-[#E9927E] hover:bg-[#E9927E]/90 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
            onClick={() => setShowSearchPartyOverlay(true)}
          >
            <Users size={18} />
            <span className="font-medium">Search Party</span>
          </Button>
        </div>
      )}
    </>
  );
};

export default Listings2;
