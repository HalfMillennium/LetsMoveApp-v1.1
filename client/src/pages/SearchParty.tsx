import { useState } from "react";
import { useSearchParty } from "../context/SearchPartyContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MessageCircle, Calendar, ExternalLink, Users, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { exampleApartments } from "../lib/utils";
import { Apartment } from "../types";
import ApartmentDetailsModal from "@/components/ApartmentDetailsModal";
import SearchPartyChatDrawer from "@/components/SearchPartyChatDrawer";

const SearchParty = () => {
  const { searchParties, isLoading, createSearchParty } = useSearchParty();
  const { toast } = useToast();
  const [newPartyName, setNewPartyName] = useState("");
  const [invites, setInvites] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // State for apartment details modal
  const [selectedApartment, setSelectedApartment] = useState<Apartment | undefined>(undefined);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  // State for chat drawer
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [activeSearchParty, setActiveSearchParty] = useState<typeof searchParties[0] | null>(null);
  
  // Handle apartment selection for details modal
  const handleApartmentSelect = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setDetailsModalOpen(true);
  };
  
  // Handle chat drawer opening
  const handleOpenChat = (searchParty: typeof searchParties[0]) => {
    setActiveSearchParty(searchParty);
    setChatDrawerOpen(true);
  };

  const handleCreateParty = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPartyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your search party",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSearchParty(newPartyName);
      setNewPartyName("");
      setInvites("");
      setCreateDialogOpen(false);

      toast({
        title: "Success!",
        description: "Your search party has been created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create search party. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mock user profile images for demonstration
  const mockUserImages = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
  ];

  return (
    <section className="py-8 bg-[#FFF9F2] flex flex-1">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1A4A4A]">
              Your Search Parties
            </h2>
            <p className="text-[#1A4A4A]/70 mt-2">
              View your active search parties and their listings.
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-[#E9927E] hover:bg-[#E9927E]/90">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card bg-white/60 backdrop-blur-md border border-white/40">
              <DialogHeader>
                <DialogTitle>Create a Search Party</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateParty} className="space-y-4 mt-4">
                <div>
                  <label
                    htmlFor="party-name"
                    className="block text-[#1A4A4A] text-sm mb-2"
                  >
                    Search Party Name
                  </label>
                  <Input
                    id="party-name"
                    value={newPartyName}
                    onChange={(e) => setNewPartyName(e.target.value)}
                    className="w-full px-4 py-2 bg-white/50 border border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30 rounded-lg"
                    placeholder="e.g., NYC Summer 2025 Hunt"
                  />
                </div>

                <div>
                  <label
                    htmlFor="invites"
                    className="block text-[#1A4A4A] text-sm mb-2"
                  >
                    Invite Members (Email or Phone)
                  </label>
                  <Textarea
                    id="invites"
                    value={invites}
                    onChange={(e) => setInvites(e.target.value)}
                    className="w-full px-4 py-2 bg-white/50 border border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30 rounded-lg"
                    placeholder="Enter email addresses or phone numbers separated by commas"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#E9927E] text-white py-3 rounded-full font-medium hover:bg-[#E9927E]/90 transition-colors"
                >
                  Create Search Party
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : searchParties.length > 0 ? (
          <div className="space-y-6">
            {searchParties.map((searchParty) => {
              // Show 3 sample apartments per search party
              const listings = searchParty.listings || [];
              const listingCount =
                listings.length || Math.floor(Math.random() * 10) + 1;

              // Mock data for days ago
              const daysAgo = Math.floor(Math.random() * 7) + 1;

              return (
                <div
                  key={searchParty.id}
                  className="glass-card rounded-xl overflow-hidden border border-white/40"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-[#1A4A4A]">
                          {searchParty.name}
                        </h2>
                        <div className="text-sm text-gray-600 mt-1">
                          {listingCount} listings • Updated {daysAgo} days ago
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-500 text-blue-500 hover:bg-blue-50 rounded-full"
                          onClick={() => handleOpenChat(searchParty)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#1A4A4A] hover:bg-white/80 text-[#1A4A4A] rounded-full"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>

                    {/* Members section */}
                    <div className="flex items-center mb-5">
                      <div className="flex -space-x-2 mr-3">
                        {mockUserImages.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Member ${idx + 1}`}
                            className="w-8 h-8 rounded-full border-2 border-white/90 object-cover shadow-sm"
                          />
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-gray-600 hover:bg-gray-100/50 rounded-full px-3"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Manage Members
                      </Button>
                    </div>

                    {/* Recently Added Section */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Recently Added
                      </h3>
                    </div>

                    {/* Listings grid with taller cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {listings.length > 0
                        ? listings.slice(0, 3).map((listing, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleApartmentSelect(listing.apartment!)}
                            >
                              <div className="relative">
                                <img
                                  src={
                                    listing.apartment?.images[0] ||
                                    `https://source.unsplash.com/random/300x200/?apartment,${idx}`
                                  }
                                  alt="Apartment"
                                  className="w-full h-40 object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                  ${listing.apartment?.price || (1500 + idx * 300)}/mo
                                </div>
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium text-gray-800 mb-1 line-clamp-1">
                                  {listing.apartment?.title || `Apartment ${idx + 1}`}
                                </h4>
                                <div className="flex items-center text-gray-600 text-sm mb-1">
                                  <span className="font-medium">
                                    {listing.apartment?.bedrooms || (idx % 3) + 1} bed, {listing.apartment?.bathrooms || 1} bath
                                  </span>
                                  <span className="mx-1">•</span>
                                  <span>
                                    {listing.apartment?.squareFeet || 800 + (idx * 100)} sq ft
                                  </span>
                                </div>
                                <div className="text-gray-500 text-sm line-clamp-1">
                                  {listing.apartment?.location ||
                                    (idx === 0
                                      ? "New York, NY"
                                      : idx === 1
                                      ? "Brooklyn, NY"
                                      : "Jersey City, NJ")}
                                </div>
                                {listing.notes && (
                                  <div className="mt-2 text-xs text-gray-600 italic line-clamp-2 bg-gray-50 p-2 rounded">
                                    "{listing.notes}"
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        : // Use example apartments from the listings page
                          [0, 3, 5].map((idx) => {
                            const apartment = exampleApartments[idx];
                            return (
                              <div
                                key={idx}
                                className="rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleApartmentSelect(apartment)}
                              >
                                <div className="relative">
                                  <img
                                    src={apartment.images[0]}
                                    alt={apartment.title}
                                    className="w-full h-40 object-cover"
                                  />
                                  <div className="absolute top-2 right-2 bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                    ${apartment.price}/mo
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h4 className="font-medium text-gray-800 mb-1 line-clamp-1">
                                    {apartment.title}
                                  </h4>
                                  <div className="flex items-center text-gray-600 text-sm mb-1">
                                    <span className="font-medium">
                                      {apartment.bedrooms} bed, {apartment.bathrooms} bath
                                    </span>
                                    <span className="mx-1">•</span>
                                    <span>
                                      {apartment.squareFeet || 800 + (idx * 100)} sq ft
                                    </span>
                                  </div>
                                  <div className="text-gray-500 text-sm line-clamp-1">
                                    {apartment.location}
                                  </div>
                                  <div className="mt-2 bg-gray-50 py-1 px-2 text-xs text-gray-500 rounded flex justify-between items-center">
                                    <span>Added 2 days ago</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                    
                    {/* View all listings button */}
                    {(listings.length > 3 || listingCount > 3) && (
                      <div className="mt-4 text-center">
                        <Button 
                          variant="ghost" 
                          className="text-[#E9927E] hover:bg-[#E9927E]/10"
                        >
                          View all {listingCount} listings
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-6 border border-white/40">
            <h3 className="text-xl font-semibold text-[#1A4A4A] mb-4">
              No Search Parties Yet
            </h3>
            <p className="text-[#1A4A4A] mb-6">
              You don't have any search parties. Create one to start
              collaborating with friends and roommates on your apartment hunt.
            </p>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-[#E9927E] hover:bg-[#E9927E]/90 text-white rounded-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Search Party
            </Button>
          </div>
        )}
      </div>

      {/* Apartment Details Modal */}
      <ApartmentDetailsModal
        apartment={selectedApartment}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onAddToFavorites={(id) => {
          toast({
            title: "Added to Favorites",
            description: "This apartment has been added to your favorites.",
          });
        }}
      />

      {/* Search Party Chat Drawer */}
      <SearchPartyChatDrawer
        isOpen={chatDrawerOpen}
        onClose={() => setChatDrawerOpen(false)}
        searchParty={activeSearchParty}
      />
    </section>
  );
};

export default SearchParty;
