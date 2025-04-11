import React, { useState } from "react";
import { Apartment } from "../types";
import { useSearchParty } from "../context/SearchPartyContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddToSearchPartyModalProps {
  apartment: Apartment | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const AddToSearchPartyModal: React.FC<AddToSearchPartyModalProps> = ({
  apartment,
  isOpen,
  onClose,
}) => {
  const { searchParties, addListingToParty } = useSearchParty();
  const { toast } = useToast();
  const [selectedPartyId, setSelectedPartyId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apartment || !selectedPartyId) {
      toast({
        title: "Error",
        description: "Please select a search party",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addListingToParty(
        parseInt(selectedPartyId),
        apartment.id,
        notes
      );
      
      toast({
        title: "Success",
        description: "Apartment added to search party",
      });
      
      // Reset form and close modal
      setSelectedPartyId("");
      setNotes("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add apartment to search party",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!apartment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card bg-white/80 backdrop-blur-md border border-white/40 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Search Party</DialogTitle>
          <DialogDescription>
            Add this apartment to a search party and share it with friends or roommates.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={apartment.images[0]} 
                  alt={apartment.title} 
                  className="h-14 w-14 rounded-md object-cover" 
                />
                <div>
                  <h3 className="font-medium text-sm">{apartment.title}</h3>
                  <p className="text-xs text-gray-500">
                    {apartment.bedrooms} bed • {apartment.bathrooms} bath • ${apartment.price}/mo
                  </p>
                </div>
              </div>
              
              <label htmlFor="search-party" className="text-sm font-medium">
                Search Party
              </label>
              <Select
                value={selectedPartyId}
                onValueChange={setSelectedPartyId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a search party" />
                </SelectTrigger>
                <SelectContent>
                  {searchParties.map((party) => (
                    <SelectItem key={party.id} value={party.id.toString()}>
                      {party.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this apartment..."
                className="bg-white/50 border border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-white/60 border-white/40"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedPartyId}
              className="bg-[#E9927E] hover:bg-[#E9927E]/90 text-white"
            >
              {isSubmitting ? "Adding..." : "Add to Search Party"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToSearchPartyModal;