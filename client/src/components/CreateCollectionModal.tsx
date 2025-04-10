import React, { useState } from "react";
import { Check, X, Plus, Home, Building, Map, MapPin, Trees, Sparkles, Briefcase, Utensils, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const COLLECTION_ICONS = [
  { icon: <Home className="h-6 w-6" />, name: "Home" },
  { icon: <Building className="h-6 w-6" />, name: "Building" },
  { icon: <Map className="h-6 w-6" />, name: "Map" },
  { icon: <MapPin className="h-6 w-6" />, name: "Location" },
  { icon: <Trees className="h-6 w-6" />, name: "Nature" },
  { icon: <Sparkles className="h-6 w-6" />, name: "Featured" },
  { icon: <Briefcase className="h-6 w-6" />, name: "Work" },
  { icon: <Utensils className="h-6 w-6" />, name: "Dining" },
  { icon: <ShoppingBag className="h-6 w-6" />, name: "Shopping" },
];

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCollection: (name: string, iconIndex: number) => void;
}

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onCreateCollection,
}) => {
  const [collectionName, setCollectionName] = useState("");
  const [selectedIconIndex, setSelectedIconIndex] = useState<number | null>(null);

  const handleCreate = () => {
    if (collectionName.trim() && selectedIconIndex !== null) {
      onCreateCollection(collectionName.trim(), selectedIconIndex);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setCollectionName("");
    setSelectedIconIndex(null);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Name your collection and choose an icon to represent it.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Collection Name
            </label>
            <Input
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="e.g., Dream Apartments"
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Choose an Icon
            </label>
            <div className="grid grid-cols-3 gap-3">
              {COLLECTION_ICONS.map((iconObj, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center transition-all ${
                    selectedIconIndex === index
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                  }`}
                  onClick={() => setSelectedIconIndex(index)}
                >
                  <div className="relative">
                    {iconObj.icon}
                    {selectedIconIndex === index && (
                      <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs mt-1">{iconObj.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!collectionName.trim() || selectedIconIndex === null}
          >
            Create Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollectionModal;