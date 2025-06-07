import { useState } from "react";
import { useSearchParty } from "../context/SearchPartyContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  MessageCircle,
  Calendar,
  ExternalLink,
  Users,
  ArrowRight,
} from "lucide-react";
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
  const [invitations, setInvitations] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // State for apartment details modal
  const [selectedApartment, setSelectedApartment] = useState<
    Apartment | undefined
  >(undefined);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // State for chat drawer
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [activeSearchParty, setActiveSearchParty] = useState<
    (typeof searchParties)[0] | null
  >(null);

  // Handle apartment selection for details modal
  const handleApartmentSelect = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setDetailsModalOpen(true);
  };

  // Handle chat drawer opening
  const handleOpenChat = (searchParty: (typeof searchParties)[0]) => {
    setActiveSearchParty(searchParty);
    setChatDrawerOpen(true);
  };

  const parseInvitations = (invitationText: string) => {
    if (!invitationText.trim()) return [];

    return invitationText
      .split(/[,\n]/)
      .map((contact) => contact.trim())
      .filter((contact) => contact.length > 0)
      .map((contact) => {
        // Simple email detection
        const isEmail = contact.includes("@") && contact.includes(".");
        return {
          contactInfo: contact,
          contactType: isEmail ? ("email" as const) : ("phone" as const),
        };
      });
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
      const parsedInvitations = parseInvitations(invitations);
      await createSearchParty(newPartyName);

      setNewPartyName("");
      setInvitations("");
      setCreateDialogOpen(false);

      toast({
        title: "Success!",
        description: `Your search party has been created${parsedInvitations.length > 0 ? " and invitations have been sent" : ""}.`,
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
    <section className="min-h-screen bg-gradient-to-br from-[#FFF9F2] via-white to-[#FFF5E6] w-full">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Parties
            </h1>
            <p className="text-gray-600">
              Collaborate with friends to find the perfect place
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0 rounded-full bg-orange-400 hover:bg-orange-500 text-white font-medium px-6 py-2.5">
                <Plus className="mr-2 h-4 w-4" />
                Create New Party
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Create a Search Party
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateParty} className="space-y-6 mt-4">
                <div>
                  <label
                    htmlFor="party-name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Search Party Name
                  </label>
                  <Input
                    id="party-name"
                    value={newPartyName}
                    onChange={(e) => setNewPartyName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="e.g., NYC Summer 2025 Hunt"
                  />
                </div>

                <div>
                  <label
                    htmlFor="invites"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Invite Members (Email or Phone)
                  </label>
                  <Textarea
                    id="invites"
                    value={invitations}
                    onChange={(e) => setInvitations(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="Enter email addresses or phone numbers separated by commas or new lines"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-full font-medium transition-colors"
                >
                  Create Search Party
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-4 w-32 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-48 rounded-lg" />
              </div>
            </div>
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
                  className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-orange-400 to-pink-500 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="text-white">
                        <h2 className="text-xl font-bold mb-1">
                          {searchParty.name}
                        </h2>
                        <div className="text-orange-100 text-sm">
                          {listingCount} listings • Updated {daysAgo} days ago
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 sm:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full"
                          onClick={() => handleOpenChat(searchParty)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Members section */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="flex -space-x-2 mr-3">
                          {mockUserImages.slice(0, 4).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Member ${idx + 1}`}
                              className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {mockUserImages.length} members
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm text-gray-600 hover:bg-gray-100 rounded-full px-3 py-1"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </div>

                    {/* Recently Added Section */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Listings
                      </h3>
                    </div>

                    {/* Listings grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {listings.length > 0
                        ? listings.slice(0, 3).map((listing, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
                              onClick={() =>
                                handleApartmentSelect(listing.apartment!)
                              }
                            >
                              <div className="relative">
                                <img
                                  src={
                                    listing.apartment?.images[0] ||
                                    `https://source.unsplash.com/random/300x200/?apartment,${idx}`
                                  }
                                  alt="Apartment"
                                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute top-3 right-3 bg-white/95 text-gray-900 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                                  $
                                  {listing.apartment?.price || 1500 + idx * 300}
                                  /mo
                                </div>
                              </div>
                              <div className="p-4 bg-white">
                                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                                  {listing.apartment?.title ||
                                    `Apartment ${idx + 1}`}
                                </h4>
                                <div className="flex items-center text-gray-600 text-sm mb-2">
                                  <span className="font-medium">
                                    {listing.apartment?.bedrooms ||
                                      (idx % 3) + 1}{" "}
                                    bed • {listing.apartment?.bathrooms || 1}{" "}
                                    bath
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span>
                                    {listing.apartment?.squareFeet ||
                                      800 + idx * 100}{" "}
                                    sq ft
                                  </span>
                                </div>
                                <div className="text-gray-500 text-sm mb-3 line-clamp-1">
                                  {listing.apartment?.location ||
                                    (idx === 0
                                      ? "New York, NY"
                                      : idx === 1
                                        ? "Brooklyn, NY"
                                        : "Jersey City, NJ")}
                                </div>
                                {listing.notes && (
                                  <div className="mt-3 text-xs text-gray-600 italic line-clamp-2 bg-gray-50 p-3 rounded-lg">
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
                                className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => handleApartmentSelect(apartment)}
                              >
                                <div className="relative">
                                  <img
                                    src={apartment.images[0]}
                                    alt={apartment.title}
                                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                                  />
                                  <div className="absolute top-3 right-3 bg-white/95 text-gray-900 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                                    ${apartment.price}/mo
                                  </div>
                                </div>
                                <div className="p-4 bg-white">
                                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                                    {apartment.title}
                                  </h4>
                                  <div className="flex items-center text-gray-600 text-sm mb-2">
                                    <span className="font-medium">
                                      {apartment.bedrooms} bed •{" "}
                                      {apartment.bathrooms} bath
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>
                                      {apartment.squareFeet || 800 + idx * 100}{" "}
                                      sq ft
                                    </span>
                                  </div>
                                  <div className="text-gray-500 text-sm mb-3 line-clamp-1">
                                    {apartment.location}
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 py-2 px-3 rounded-lg">
                                    <span>Added 2 days ago</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                    </div>

                    {/* View All button */}
                    <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        className="text-gray-700 border-gray-300 hover:bg-gray-50 rounded-full px-6 py-2"
                      >
                        View All {listingCount} Listings
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No Search Parties Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first search party to start collaborating with
                friends and family on finding the perfect apartment.
              </p>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-orange-400 hover:bg-orange-500 text-white rounded-full px-6 py-2.5 font-medium"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Search Party
              </Button>
            </div>
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
