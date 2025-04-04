import { useState } from 'react';
import { Link } from 'wouter';
import { SearchParty } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useSearchParty } from '../context/SearchPartyContext';

interface SearchPartyCardProps {
  searchParty: SearchParty;
}

const SearchPartyCard = ({ searchParty }: SearchPartyCardProps) => {
  const [email, setEmail] = useState('');
  const { addMemberToParty } = useSearchParty();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  // Mock data for shared favorites
  const sharedListings = searchParty.listings || [];
  
  const handleInvite = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would send an invitation to this email
    // For now, just show a success message
    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${email}`,
    });
    
    setEmail('');
    setOpen(false);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#1A4A4A]">{searchParty.name}</h3>
        <span className="bg-[#C9DAD0]/30 text-[#1A4A4A] text-xs px-3 py-1 rounded-full">
          {searchParty.members?.length || 1} members
        </span>
      </div>
      
      <div className="flex -space-x-2 mb-4">
        {(searchParty.members?.slice(0, 3) || []).map((member, index) => (
          <img 
            key={index}
            src={member.user?.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"} 
            alt={`Member ${index + 1}`}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        ))}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="w-10 h-10 rounded-full bg-[#C9DAD0]/20 border-2 border-white flex items-center justify-center text-[#1A4A4A] text-xs font-bold">
              +
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite to "{searchParty.name}"</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleInvite}>Send Invitation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {sharedListings.length > 0 && (
        <div className="mb-4">
          <h4 className="text-[#1A4A4A] font-medium mb-2">
            Shared Favorites ({sharedListings.length})
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {sharedListings.slice(0, 2).map((listing, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden h-24">
                <img 
                  src={listing.apartment?.images[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"}
                  alt="Apartment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs">
                    ${listing.apartment?.price} · {listing.apartment?.bedrooms}bd
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
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-[#E9927E] text-[#E9927E] hover:bg-[#E9927E]/10">
              Invite friends
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite to "{searchParty.name}"</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleInvite}>Send Invitation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SearchPartyCard;
