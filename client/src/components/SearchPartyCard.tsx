import { Link } from "wouter";
import { SearchParty } from "../types";
import { Button } from "@/components/ui/button";

interface SearchPartyCardProps {
  searchParty: SearchParty;
  currentUser?: any;
}

const SearchPartyCard = ({ searchParty }: SearchPartyCardProps) => {

  // Mock data for shared favorites
  const sharedListings = searchParty.listings || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#1A4A4A]">
          {searchParty.name}
        </h3>
        <span className="bg-[#C9DAD0]/30 text-[#1A4A4A] text-xs px-3 py-1 rounded-full">
          {searchParty.members?.length || 1} members
        </span>
      </div>

      <div className="flex -space-x-2 mb-4">
        {(searchParty.members?.slice(0, 3) || []).map((member, index) => (
          <img
            key={index}
            src={
              member.user?.profileImage ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            }
            alt={`Member ${index + 1}`}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        ))}
      </div>

      {sharedListings.length > 0 && (
        <div className="mb-4">
          <h4 className="text-[#1A4A4A] font-medium mb-2">
            Shared Favorites ({sharedListings.length})
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {sharedListings.slice(0, 2).map((listing, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden h-24"
              >
                <img
                  src={
                    listing.apartment?.images[0] ||
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
                  }
                  alt="Apartment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs">
                    ${listing.apartment?.price} · {listing.apartment?.bedrooms}
                    bd
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Link href={`/search-party/${searchParty.id}`}>
          <Button className="bg-[#1A4A4A] text-white hover:bg-[#1A4A4A]/90">
            View all shared listings
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SearchPartyCard;
