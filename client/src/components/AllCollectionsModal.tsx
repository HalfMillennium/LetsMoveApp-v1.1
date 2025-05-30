import React from "react";
import { X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            All Collections
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-3 gap-4">
            <div
              className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors h-[100px]"
              onClick={onAddCollection}
            >
              <PlusCircle className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Add Collection</span>
            </div>

            {collections.map((collection) => (
              <div
                key={collection.id}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all h-[100px]"
                onClick={() => {
                  onSelectCollection(collection.id);
                  onClose();
                }}
              >
                <div className="h-8 w-8 flex items-center justify-center mb-2">
                  {collection.icon}
                </div>
                <span className="text-sm font-medium text-center line-clamp-1">
                  {collection.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllCollectionsModal;
