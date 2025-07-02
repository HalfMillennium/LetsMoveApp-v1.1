import React, { useState, useMemo } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ListingCollection } from "../types";

interface AllCollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: ListingCollection[];
  onSelectCollection: (name: string) => void;
  onAddCollection: () => void;
}

export const AllCollectionsModal: React.FC<AllCollectionsModalProps> = ({
  isOpen,
  onClose,
  collections,
  onSelectCollection,
  onAddCollection,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter collections based on search term
  const filteredCollections = useMemo(() => {
    if (!searchTerm.trim()) return collections;
    return collections.filter(collection =>
      collection.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collections, searchTerm]);

  // Reset search when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl font-semibold">
            All Collections
          </DialogTitle>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-2xl border-gray-200 focus:border-gray-300"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Add Collection Button */}
            <div
              className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 h-[120px]"
              onClick={onAddCollection}
            >
              <div className="h-10 w-10 flex items-center justify-center mb-3 bg-gray-100 rounded-[10px]">
                <PlusCircle className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Add Collection</span>
            </div>

            {/* Collections Grid */}
            {filteredCollections.map((collection) => (
              <div
                key={collection.id}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-2xl cursor-pointer hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 h-[120px] group"
                onClick={() => {
                  onSelectCollection(collection.id);
                  onClose();
                }}
              >
                <div className="h-10 w-10 flex items-center justify-center mb-3 bg-primary/10 rounded-[10px] group-hover:bg-primary/20 transition-colors">
                  <div className="text-primary">
                    {collection.icon}
                  </div>
                </div>
                <span className="text-sm font-medium text-center line-clamp-2 text-gray-900">
                  {collection.title}
                </span>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {searchTerm.trim() && filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <div className="h-16 w-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
              <p className="text-gray-500 mb-6">
                No collections match "{searchTerm}". Try a different search term.
              </p>
              <Button 
                onClick={onAddCollection}
                className="rounded-[10px]"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Collection
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!searchTerm.trim() && collections.length === 0 && (
            <div className="text-center py-12">
              <div className="h-16 w-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <PlusCircle className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first collection to organize your favorite listings.
              </p>
              <Button 
                onClick={onAddCollection}
                className="rounded-[10px]"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Collection
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllCollectionsModal;
