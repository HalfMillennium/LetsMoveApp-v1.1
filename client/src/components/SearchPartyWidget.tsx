import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useSearchParty } from "../context/SearchPartyContext";
import { SearchParty, Apartment, Member, SearchPartyListing } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Home,
  User,
  PartyPopper,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchPartyWidgetProps {
  apartments: Apartment[];
  onFilterBySearchParty: (searchPartyId: number | null) => void;
  onDragEnd?: (result: DropResult) => void;
}

const SearchPartyWidget: React.FC<SearchPartyWidgetProps> = ({
  apartments,
  onFilterBySearchParty,
  onDragEnd: parentOnDragEnd,
}) => {
  const { searchParties, addListingToParty, getSearchPartyListings } =
    useSearchParty();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSearchPartyId, setSelectedSearchPartyId] = useState<
    number | null
  >(null);
  const [searchPartyListings, setSearchPartyListings] = useState<
    SearchPartyListing[]
  >([]);
  const [selectedSearchParty, setSelectedSearchParty] =
    useState<SearchParty | null>(null);
  const [filterByParty, setFilterByParty] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSearchPartyId && filterByParty) {
      fetchSearchPartyListings(selectedSearchPartyId);
      const party = searchParties.find((p) => p.id === selectedSearchPartyId);
      if (party) {
        setSelectedSearchParty(party);
      }
    } else {
      setSearchPartyListings([]);
      setSelectedSearchParty(null);
    }
  }, [selectedSearchPartyId, searchParties]);

  // Close the overlay when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isExpanded &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const fetchSearchPartyListings = async (searchPartyId: number) => {
    try {
      const listings = await getSearchPartyListings(searchPartyId);
      setSearchPartyListings(listings);
    } catch (error) {
      console.error("Error fetching search party listings:", error);
      toast({
        title: "Error",
        description: "Could not fetch search party listings",
        variant: "destructive",
      });
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const toggleFilterBySearchParty = () => {
    if (filterByParty) {
      setFilterByParty(false);
      onFilterBySearchParty(null);
      return;
    }
    setFilterByParty(true);
    onFilterBySearchParty(selectedSearchPartyId);
  };

  const handleSearchPartyChange = (value: string) => {
    const partyId = value === "all" ? null : parseInt(value, 10);
    setSelectedSearchPartyId(partyId);
    if (filterByParty) {
      onFilterBySearchParty(partyId);
    }
  };

  // Use parentOnDragEnd prop if provided, otherwise use our own implementation
  const handleLocalDrag = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If the parent component has provided its own onDragEnd handler, use that instead
    if (parentOnDragEnd) {
      parentOnDragEnd(result);
      return;
    }

    // Otherwise use our own implementation
    // If dropped outside the droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (
      destination.droppableId === "searchPartyDropArea" &&
      selectedSearchPartyId
    ) {
      // Add the apartment to the search party
      const apartmentId = parseInt(draggableId.replace("apartment-", ""), 10);

      // Check if the apartment is already in the search party
      const alreadyExists = searchPartyListings.some(
        (listing) => listing.apartmentId === apartmentId
      );

      if (alreadyExists) {
        toast({
          title: "Already added",
          description: "This apartment is already in this search party",
        });
        return;
      }

      try {
        await addListingToParty(selectedSearchPartyId, apartmentId);
        // Refresh the listings
        fetchSearchPartyListings(selectedSearchPartyId);

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
    }
  };

  return (
    <div className="relative inline-block">
      {/* Header Button - Always visible */}
      <div
        className="flex items-center justify-between p-4 bg-gradient-to-r from-[#E9927E] to-[#C9DAD0] cursor-pointer rounded-lg shadow-md"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <Users className="h-5 w-5 text-white mr-2" />
          <h3 className="font-bold text-white">Search Parties</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 text-white hover:bg-white/20"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Overlay Content - Positioned absolutely */}
      {isExpanded && (
        <div 
          ref={overlayRef}
          className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-[#C9DAD0] max-w-3xl w-screen overflow-auto max-h-[80vh] transition-all duration-200 ease-in-out"
        >
          <div className="p-4">
            <div className="flex flex-1 items-center justify-between gap-4">
              <Select
                value={
                  selectedSearchPartyId ? selectedSearchPartyId.toString() : "all"
                }
                onValueChange={handleSearchPartyChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a search party" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Apartments</SelectItem>
                  {searchParties.map((party) => (
                    <SelectItem key={party.id} value={party.id.toString()}>
                      {party.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!filterByParty && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex flex-1 text-[#1A4A4A] border-[#C9DAD0] text-white items-center gap-2"
                  onClick={toggleFilterBySearchParty}
                >
                  <PartyPopper />
                  <span>Filter By Search Party</span>
                </Button>
              )}
              {filterByParty && (
                <Button
                  variant="dark"
                  size="sm"
                  className="bg-black flex flex-1 text-[#1A4A4A] border-[#C9DAD0] text-white"
                  onClick={toggleFilterBySearchParty}
                >
                  See All Apartments
                </Button>
              )}
            </div>

            {selectedSearchParty && (
              <div className="pt-4 flex flex-1 flex-col gap-2">
                <h4 className="font-medium text-[#1A4A4A]">
                  {selectedSearchParty.name}
                </h4>

                {/* Members */}
                <div className="flex items-center mb-3 overflow-x-auto">
                  <span className="text-xs text-[#1A4A4A] mr-2">Members:</span>
                  <div className="flex -space-x-2">
                    {selectedSearchParty.members?.map((member, index) => (
                      <Avatar
                        key={index}
                        className="w-6 h-6 border-2 border-white"
                      >
                        <AvatarImage
                          src={member.user?.profileImage || ""}
                          alt={member.user?.fullName || `Member ${index + 1}`}
                        />
                        <AvatarFallback>
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs border-[#C9DAD0] text-[#1A4A4A]"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Drag and drop area for search party listings */}
                <Droppable droppableId="searchPartyDropArea">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-3 mb-3 border-2 border-dashed rounded-lg min-h-[150px] transition-colors ${
                        snapshot.isDraggingOver
                          ? "bg-[#C9DAD0]/20 border-[#E9927E]"
                          : "border-[#C9DAD0]/50"
                      }`}
                      data-search-party-id={selectedSearchPartyId} // Pass the ID as data attribute
                    >
                      <div className="flex items-center justify-center h-full">
                        {searchPartyListings.length === 0 ? (
                          <div className="text-center p-4">
                            <Home className="h-8 w-8 text-[#C9DAD0] mx-auto mb-2" />
                            <p className="text-sm text-[#1A4A4A]">
                              Drag apartments here to add them to this search
                              party
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {searchPartyListings.map((listing, index) => {
                              // Find the associated apartment for better display
                              const apartment = apartments.find(a => a.id === listing.apartmentId);
                              
                              return (
                                <div
                                  key={listing.id}
                                  className="bg-[#FFF9F2] rounded-md overflow-hidden shadow-sm border border-[#C9DAD0]/30"
                                >
                                  {apartment?.images && apartment.images.length > 0 && (
                                    <div className="h-24 bg-gray-200 overflow-hidden">
                                      <img 
                                        src={apartment.images[0]} 
                                        alt={apartment.title} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="p-2">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <Badge
                                          variant="outline"
                                          className="bg-[#E9927E]/10 text-[#E9927E] text-xs mb-1"
                                        >
                                          ${apartment?.price || listing.apartment?.price}
                                        </Badge>
                                        <h5 className="text-xs font-medium text-[#1A4A4A] line-clamp-1">
                                          {apartment?.title || listing.apartment?.title || "Apartment"}
                                        </h5>
                                        <p className="text-xs text-[#1A4A4A]/70 line-clamp-1">
                                          {apartment?.address || listing.apartment?.address || "Address"}
                                        </p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 h-6 w-6 ml-1"
                                      >
                                        <X className="h-3 w-3 text-[#1A4A4A]/70" />
                                      </Button>
                                    </div>
                                    {listing.notes && (
                                      <p className="text-xs italic text-[#1A4A4A]/60 mt-1 line-clamp-1">
                                        Note: {listing.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <p className="text-xs text-[#1A4A4A]/70 italic">
                  Drag an apartment from the listings below to add it to this
                  search party
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPartyWidget;
