import React from "react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { GalleryVerticalEnd, ListPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Collection = {
  name: string;
  icon: React.ReactNode;
};

interface CollectionsPopoverProps {
  collections: Collection[];
  activeCategory: string;
  onSelectCollection: (name: string) => void;
  onAddCollection: () => void;
}

const CollectionsPopover = ({
  collections,
  activeCategory,
  onSelectCollection,
  onAddCollection,
}: CollectionsPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 rounded-full bg-white border border-gray-200 shadow-sm"
        >
          <GalleryVerticalEnd className="h-4 w-4" />
          <span className="hidden sm:inline-block">{activeCategory}</span>
          <span className="sm:hidden">Collections</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search collections..." />
          <CommandList>
            <CommandEmpty>No collections found.</CommandEmpty>
            <CommandGroup heading="Your Collections">
              {collections.map((collection) => (
                <CommandItem
                  key={collection.name}
                  value={collection.name}
                  onSelect={() => onSelectCollection(collection.name)}
                  className="flex items-center gap-2 py-3"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {collection.icon}
                    <span>{collection.name}</span>
                  </div>
                  {activeCategory === collection.name && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))}
              <CommandItem
                value="new-collection"
                onSelect={onAddCollection}
                className="flex items-center gap-2 py-3 border-t text-primary"
              >
                <ListPlus className="h-4 w-4" />
                <span>Create New Collection</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CollectionsPopover;