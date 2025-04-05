import { useState } from "react";
import { useSearchParty } from "../context/SearchPartyContext";
import SearchPartyCard from "../components/SearchPartyCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const SearchParty = () => {
  const { searchParties, isLoading, createSearchParty } = useSearchParty();
  const { toast } = useToast();
  const [newPartyName, setNewPartyName] = useState("");
  const [invites, setInvites] = useState("");

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

  return (
    <section className="py-10 bg-[#FFF5E6] flex flex-1">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1A4A4A] mb-6">
            Your Search Party
          </h2>

          {isLoading ? (
            <div className="mb-8">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : searchParties.length > 0 ? (
            searchParties.map((searchParty) => (
              <SearchPartyCard key={searchParty.id} searchParty={searchParty} />
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-[#1A4A4A] mb-4">
                No Search Parties Yet
              </h3>
              <p className="text-[#1A4A4A] mb-6">
                You don't have any search parties. Create one to start
                collaborating with friends and roommates.
              </p>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#1A4A4A] mb-4">
              Create a Search Party
            </h3>
            <p className="text-[#1A4A4A] mb-6">
              Invite friends and roommates to collaborate on your apartment
              hunt. Share and save listings together.
            </p>

            <form onSubmit={handleCreateParty} className="mb-4">
              <div className="mb-4">
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
                  className="w-full px-4 py-2 border border-[#C9DAD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9927E]"
                  placeholder="e.g., NYC Summer 2023 Hunt"
                />
              </div>

              <div className="mb-6">
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
                  className="w-full px-4 py-2 border border-[#C9DAD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9927E]"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchParty;
