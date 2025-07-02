import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParty } from "../context/SearchPartyContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  MessageCircle,
  Calendar,
  Users,
  ArrowRight,
  MapPin,
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
      setCreateDialogOpen(false);

      toast({
        title: "Success!",
        description: "Your search party has been created.",
      });
    } catch (error) {
      console.error("Error creating search party:", error);
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
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-50 w-full"
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Search Parties
            </h1>
            <p className="text-gray-500 text-sm">
              Collaborate with friends to find the perfect place
            </p>
          </motion.div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0 bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-xl text-sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Party
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="e.g., NYC Summer 2025 Hunt"
                  />
                </div>


                <Button
                  type="submit"
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Create Search Party
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {isLoading ? (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
              </div>
            </div>
          </div>
        ) : searchParties.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-8"
          >
            {searchParties.map((searchParty, index) => {
              // Show 3 sample apartments per search party
              const listings = searchParty.listings || [];
              const listingCount =
                listings.length || Math.floor(Math.random() * 10) + 1;

              // Mock data for days ago
              const daysAgo = Math.floor(Math.random() * 7) + 1;

              return (
                <motion.div
                  key={searchParty.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors duration-200"
                >
                  {/* Header Section */}
                  <div className="px-6 py-5 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                          {searchParty.name}
                        </h2>
                        <div className="text-gray-500 text-sm">
                          {listingCount} listings • Updated {daysAgo} days ago
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 sm:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs"
                          onClick={() => handleOpenChat(searchParty)}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Members section */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="flex -space-x-1 mr-3">
                          {mockUserImages.slice(0, 3).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Member ${idx + 1}`}
                              className="w-6 h-6 rounded-full border border-white object-cover"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {mockUserImages.length} members
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl px-2 py-1"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    </div>

                    {/* Recently Added Section */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Recent Listings
                      </h3>
                    </div>

                    {/* Listings grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {listings.length > 0
                        ? listings.slice(0, 3).map((listing, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
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
                                  className="w-full h-32 object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-white text-gray-900 text-xs font-medium px-2 py-1 rounded-xl">
                                  $
                                  {listing.apartment?.price || 1500 + idx * 300}
                                  /mo
                                </div>
                              </div>
                              <div className="p-3 bg-white">
                                <h4 className="font-medium text-gray-900 mb-1 text-sm line-clamp-1">
                                  {listing.apartment?.title ||
                                    `Apartment ${idx + 1}`}
                                </h4>
                                <div className="text-gray-500 text-xs mb-1">
                                  {listing.apartment?.bedrooms ||
                                    (idx % 3) + 1}{" "}
                                  bed • {listing.apartment?.bathrooms || 1}{" "}
                                  bath
                                </div>
                                <div className="flex items-center text-gray-400 text-xs">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="truncate">
                                    {listing.apartment?.location ||
                                      (idx === 0
                                        ? "New York, NY"
                                        : idx === 1
                                          ? "Brooklyn, NY"
                                          : "Jersey City, NJ")}
                                  </span>
                                </div>
                                {listing.notes && (
                                  <div className="mt-2 text-xs text-gray-500 italic line-clamp-2 bg-gray-50 p-2 rounded-xl">
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
                                className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                                onClick={() => handleApartmentSelect(apartment)}
                              >
                                <div className="relative">
                                  <img
                                    src={apartment.images[0]}
                                    alt={apartment.title}
                                    className="w-full h-32 object-cover"
                                  />
                                  <div className="absolute top-2 right-2 bg-white text-gray-900 text-xs font-medium px-2 py-1 rounded-xl">
                                    ${apartment.price}/mo
                                  </div>
                                </div>
                                <div className="p-3 bg-white">
                                  <h4 className="font-medium text-gray-900 mb-1 text-sm line-clamp-1">
                                    {apartment.title}
                                  </h4>
                                  <div className="text-gray-500 text-xs mb-1">
                                    {apartment.bedrooms} bed •{" "}
                                    {apartment.bathrooms} bath
                                  </div>
                                  <div className="flex items-center text-gray-400 text-xs">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span className="truncate">
                                      {apartment.location}
                                    </span>
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
                        className="text-gray-700 border-gray-300 hover:bg-gray-50 rounded-xl px-6 py-2"
                      >
                        View All {listingCount} Listings
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Users className="h-8 w-8 text-white" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-xl font-bold text-gray-900 mb-3"
              >
                No Search Parties Yet
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="text-gray-600 mb-6"
              >
                Create your first search party to start collaborating with
                friends and family on finding the perfect apartment.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-orange-400 hover:bg-orange-500 text-white rounded-xl px-6 py-2.5 font-medium"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Search Party
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Apartment Details Modal */}
      <ApartmentDetailsModal
        apartment={selectedApartment}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onAddToFavorites={() => {
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
    </motion.section>
  );
};

export default SearchParty;
