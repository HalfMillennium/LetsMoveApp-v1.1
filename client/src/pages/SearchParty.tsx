import { useState } from "react";
import { useSearchParty } from "../context/SearchPartyContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { exampleApartments } from "../lib/utils";

const SearchParty = () => {
  const { searchParties, isLoading, createSearchParty } = useSearchParty();
  const { toast } = useToast();
  const [newPartyName, setNewPartyName] = useState("");
  const [invites, setInvites] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
    <section className="py-8 bg-gradient-to-br from-[#FFF9F2] to-[#FFE8D0] flex flex-1">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#1A4A4A]">
              Your Search Parties
            </h1>
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
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold text-[#1A4A4A]">
                          {searchParty.name}
                        </h2>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/50 border-white/40 hover:bg-white/80 text-[#1A4A4A]"
                        >
                          View Listings
                        </Button>
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        {listingCount} listings • Updated {daysAgo} days ago
                      </div>

                      {/* Members circle avatars */}
                      <div className="flex -space-x-2 mb-4">
                        {mockUserImages.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Member ${idx + 1}`}
                            className="w-10 h-10 rounded-full border-2 border-white/90 object-cover shadow-sm"
                          />
                        ))}
                      </div>

                      {/* Listings grid */}
                      <div className="grid grid-cols-3 gap-3">
                        {listings.length > 0
                          ? listings.slice(0, 3).map((listing, idx) => (
                              <div
                                key={idx}
                                className="rounded-lg overflow-hidden shadow-sm"
                              >
                                <div className="relative">
                                  <img
                                    src={
                                      listing.apartment?.images[0] ||
                                      `https://source.unsplash.com/random/300x200/?apartment,${idx}`
                                    }
                                    alt="Apartment"
                                    className="w-full h-24 object-cover"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 backdrop-blur-sm">
                                    <div className="text-white text-xs font-medium">
                                      {listing.apartment?.bedrooms ||
                                        (idx % 3) + 1}{" "}
                                      Bed, {listing.apartment?.bathrooms || 1}{" "}
                                      Bath
                                    </div>
                                    <div className="text-white text-xs">
                                      {listing.apartment?.location ||
                                        (idx === 0
                                          ? "New York, NY"
                                          : idx === 1
                                            ? "Brooklyn, NY"
                                            : "Jersey City, NJ")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          : // Use example apartments from the listings page
                            [0, 3, 5].map((idx) => {
                              const apartment = exampleApartments[idx];
                              return (
                                <div
                                  key={idx}
                                  className="rounded-lg overflow-hidden shadow-sm"
                                >
                                  <div className="relative">
                                    <img
                                      src={apartment.images[0]}
                                      alt={apartment.title}
                                      className="w-full h-24 object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 backdrop-blur-sm">
                                      <div className="text-white text-xs font-medium">
                                        {apartment.bedrooms} Bed,{" "}
                                        {apartment.bathrooms} Bath
                                      </div>
                                      <div className="text-white text-xs">
                                        {apartment.location}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                      </div>
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
      </div>
    </section>
  );
};

export default SearchParty;
