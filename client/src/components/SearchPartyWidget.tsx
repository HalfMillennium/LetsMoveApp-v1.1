import React, { useState, useEffect } from "react";
import { Droppable, DropResult } from "react-beautiful-dnd";
import { useSearchParty } from "../context/SearchPartyContext";
import { SearchParty, Apartment, SearchPartyListing } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  Plus,
  User,
} from "lucide-react";

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
  const [selectedSearchPartyId, setSelectedSearchPartyId] = useState<
    number | null
  >(null);
  const [searchPartyListings, setSearchPartyListings] = useState<
    SearchPartyListing[]
  >([]);
  const [selectedSearchParty, setSelectedSearchParty] =
    useState<SearchParty | null>(searchParties[0] || null);

  useEffect(() => {
    // Select the first search party by default if available
    if (searchParties.length > 0 && !selectedSearchParty) {
      setSelectedSearchParty(searchParties[0]);
      setSelectedSearchPartyId(searchParties[0].id);
    }
  }, [searchParties]);

  useEffect(() => {
    if (selectedSearchPartyId) {
      fetchSearchPartyListings(selectedSearchPartyId);
    }
  }, [selectedSearchPartyId]);

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

  const handleAddToParty = () => {
    toast({
      title: "Add to Search Party",
      description: "Drag an apartment to add it to this search party",
    });
  };

  // Handle drag and drop
  const handleDragEnd = async (result: DropResult) => {
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
    <div className="bg-white rounded-3xl p-5 shadow-md h-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-[#1A4A4A] mr-2" />
          <h2 className="text-lg font-bold text-[#1A4A4A]">Search Parties</h2>
        </div>
      </div>
      
      {/* Search party members */}
      <div className="flex justify-center mb-6">
        <div className="flex -space-x-2">
          {selectedSearchParty?.members?.slice(0, 3).map((member, index) => (
            <Avatar
              key={index}
              className="w-12 h-12 border-2 border-white"
            >
              <AvatarImage
                src={member.user?.profileImage || "https://placekitten.com/100/100"}
                alt={member.user?.fullName || `Member ${index + 1}`}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
      
      {/* Drop area button */}
      <Droppable droppableId="searchPartyDropArea">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`mb-4 ${
              snapshot.isDraggingOver
                ? "bg-[#C9DAD0]/20 border-[#E9927E]"
                : ""
            }`}
            data-search-party-id={selectedSearchPartyId}
          >
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center h-12 bg-white border border-gray-200 rounded-full hover:bg-gray-50"
              onClick={handleAddToParty}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>Add to Search Party</span>
            </Button>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default SearchPartyWidget;
