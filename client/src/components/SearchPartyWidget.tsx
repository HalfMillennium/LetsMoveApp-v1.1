import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useSearchParty } from '../context/SearchPartyContext';
import { SearchParty, Apartment, Member, SearchPartyListing } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  X, 
  Home, 
  User
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchPartyWidgetProps {
  apartments: Apartment[];
  onFilterBySearchParty: (searchPartyId: number | null) => void;
}

const SearchPartyWidget: React.FC<SearchPartyWidgetProps> = ({ 
  apartments,
  onFilterBySearchParty
}) => {
  const { searchParties, addListingToParty, getSearchPartyListings } = useSearchParty();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSearchPartyId, setSelectedSearchPartyId] = useState<number | null>(null);
  const [searchPartyListings, setSearchPartyListings] = useState<SearchPartyListing[]>([]);
  const [selectedSearchParty, setSelectedSearchParty] = useState<SearchParty | null>(null);

  useEffect(() => {
    if (selectedSearchPartyId) {
      fetchSearchPartyListings(selectedSearchPartyId);
      const party = searchParties.find(p => p.id === selectedSearchPartyId);
      if (party) {
        setSelectedSearchParty(party);
      }
    } else {
      setSearchPartyListings([]);
      setSelectedSearchParty(null);
    }
  }, [selectedSearchPartyId, searchParties]);

  const fetchSearchPartyListings = async (searchPartyId: number) => {
    try {
      const listings = await getSearchPartyListings(searchPartyId);
      setSearchPartyListings(listings);
    } catch (error) {
      console.error("Error fetching search party listings:", error);
      toast({
        title: "Error",
        description: "Could not fetch search party listings",
        variant: "destructive"
      });
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSearchPartyChange = (value: string) => {
    const partyId = value === 'all' ? null : parseInt(value, 10);
    setSelectedSearchPartyId(partyId);
    onFilterBySearchParty(partyId);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside the droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (destination.droppableId === 'searchPartyDropArea' && selectedSearchPartyId) {
      // Add the apartment to the search party
      const apartmentId = parseInt(draggableId.replace('apartment-', ''), 10);
      
      // Check if the apartment is already in the search party
      const alreadyExists = searchPartyListings.some(listing => 
        listing.apartmentId === apartmentId
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
          variant: "destructive"
        });
      }
    }
  };

  if (searchParties.length === 0) {
    return null; // Don't render the widget if there are no search parties
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden transition-all duration-300 border border-[#C9DAD0]">
      {/* Header - always visible */}
      <div 
        className="flex items-center justify-between p-4 bg-gradient-to-r from-[#E9927E] to-[#C9DAD0] cursor-pointer"
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
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>

      {/* Content - visible when expanded */}
      {isExpanded && (
        <div className="p-4">
          <div className="mb-4">
            <Select
              value={selectedSearchPartyId ? selectedSearchPartyId.toString() : 'all'}
              onValueChange={handleSearchPartyChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a search party" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Apartments</SelectItem>
                {searchParties.map(party => (
                  <SelectItem key={party.id} value={party.id.toString()}>
                    {party.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSearchParty && (
            <div className="mb-4">
              <h4 className="font-medium text-[#1A4A4A] mb-2">{selectedSearchParty.name}</h4>
              
              {/* Members */}
              <div className="flex items-center mb-3 overflow-x-auto">
                <span className="text-xs text-[#1A4A4A] mr-2">Members:</span>
                <div className="flex -space-x-2">
                  {selectedSearchParty.members?.map((member, index) => (
                    <Avatar key={index} className="w-6 h-6 border-2 border-white">
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
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="searchPartyDropArea">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-3 mb-3 border-2 border-dashed rounded-lg min-h-[100px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-[#C9DAD0]/20 border-[#E9927E]' : 'border-[#C9DAD0]/50'
                      }`}
                    >
                      <div className="flex items-center justify-center h-full">
                        {searchPartyListings.length === 0 ? (
                          <div className="text-center p-4">
                            <Home className="h-8 w-8 text-[#C9DAD0] mx-auto mb-2" />
                            <p className="text-sm text-[#1A4A4A]">
                              Drag apartments here to add them to this search party
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                            {searchPartyListings.map((listing, index) => (
                              <div 
                                key={listing.id}
                                className="bg-[#FFF9F2] p-2 rounded-md text-sm flex items-start"
                              >
                                <div className="mr-2 flex-shrink-0">
                                  <Badge variant="outline" className="bg-[#E9927E]/10 text-[#E9927E] text-xs">
                                    ${listing.apartment?.price}
                                  </Badge>
                                </div>
                                <div className="flex-grow">
                                  <p className="text-xs font-medium text-[#1A4A4A] truncate">
                                    {listing.apartment?.title || 'Apartment'}
                                  </p>
                                  <p className="text-xs text-[#1A4A4A]/70 truncate">
                                    {listing.apartment?.location || 'Location'}
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
                            ))}
                          </div>
                        )}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <p className="text-xs text-[#1A4A4A]/70 italic">
                Drag an apartment from the listings below to add it to this search party
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPartyWidget;