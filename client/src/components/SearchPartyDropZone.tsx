import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { X, UserCircle2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useSearchParty } from '../context/SearchPartyContext';
import { SearchParty, Apartment } from '../types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SearchPartyDropZoneProps {
  onAddToParty: (apartmentId: number) => void;
  onClose: () => void;
  currentSearchParty: SearchParty | null;
}

const SearchPartyDropZone: React.FC<SearchPartyDropZoneProps> = ({
  onAddToParty,
  onClose,
  currentSearchParty
}) => {
  const { searchParties } = useSearchParty();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!currentSearchParty) return null;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Get the current listings for display (up to 3)
  const recentListings = currentSearchParty.listings || [];
  const displayListings = recentListings.slice(0, isExpanded ? 3 : 1);

  return (
    <div className="fixed right-8 top-24 z-50 w-64 rounded-xl overflow-hidden transition-all duration-300 shadow-lg">
      <div className="glass-card border border-white/40 backdrop-blur-md">
        {/* Header */}
        <div className="bg-white/30 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={toggleExpanded} className="text-gray-600 hover:text-gray-800">
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <h3 className="font-semibold text-sm text-gray-800">
              {currentSearchParty.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100/50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Dropzone Area */}
        {isExpanded && (
          <div className="p-4 min-h-[120px] flex flex-col items-center justify-center transition-colors bg-white/10">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">Drag apartments here to add to this search party</p>
              <div className="flex -space-x-2 justify-center">
                {currentSearchParty.members && currentSearchParty.members.slice(0, 3).map((member, index) => (
                  <div key={index} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                    {member.user?.profileImage ? (
                      <img 
                        src={member.user.profileImage} 
                        alt={member.user?.username || 'Member'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle2 className="w-full h-full text-gray-400" />
                    )}
                  </div>
                ))}
                {(!currentSearchParty.members || currentSearchParty.members.length === 0) && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                    <UserCircle2 className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Listings */}
        {isExpanded && displayListings.length > 0 && (
          <div className="p-3 bg-white/20 border-t border-white/20">
            <h4 className="text-xs font-medium text-gray-600 mb-2">Recent Listings</h4>
            <div className="space-y-2">
              {displayListings.map((listing, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-white/30 rounded-md">
                  {listing.apartment?.images && listing.apartment.images[0] && (
                    <img
                      src={listing.apartment.images[0]}
                      alt={listing.apartment?.title || 'Apartment'}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">
                      {listing.apartment?.title || 'Apartment'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {listing.apartment?.location || 'Location'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-white/30 border-t border-white/20">
          <Button
            variant="default"
            size="sm"
            className="w-full bg-[#E9927E] hover:bg-[#E9927E]/90 text-white text-xs"
            onClick={() => setIsDialogOpen(true)}
          >
            View All Listings
          </Button>
        </div>
      </div>

      {/* Dialog to view all search party listings */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card bg-white/80 backdrop-blur-md border border-white/40 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentSearchParty.name} - Listings</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-3 p-1">
            {recentListings.length > 0 ? (
              recentListings.map((listing, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/40 rounded-lg">
                  {listing.apartment?.images && listing.apartment.images[0] && (
                    <img
                      src={listing.apartment.images[0]}
                      alt={listing.apartment?.title || 'Apartment'}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800">
                      {listing.apartment?.title || 'Apartment'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {listing.apartment?.bedrooms} bed • {listing.apartment?.bathrooms} bath • ${listing.apartment?.price}/mo
                    </p>
                    {listing.notes && (
                      <p className="text-xs text-gray-600 mt-1 italic">
                        "{listing.notes}"
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Added by {listing.addedById === 1 ? 'you' : 'a member'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No listings added yet</p>
                <p className="text-sm mt-1">Drag and drop apartments to add them</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchPartyDropZone;