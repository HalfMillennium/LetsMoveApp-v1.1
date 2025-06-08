import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { GalleryVerticalEnd, ListPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCollection } from "../types";

interface CollectionsPopoverProps {
  collections: ListingCollection[];
  activeCollection: ListingCollection;
  onSelectCollection: (name: string) => void;
  onAddCollection: () => void;
}

const CollectionsPopover = ({
  collections,
  activeCollection,
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
          <span className="hidden sm:inline-block">
            {activeCollection.title}
          </span>
          <span className="sm:hidden">Collections</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command className="rounded-2xl p-2">
          <CommandInput placeholder="Search collections..." />
          <CommandList className="rounded-2xl">
            <CommandEmpty>No collections found.</CommandEmpty>
            <CommandGroup heading="Your Collections">
              {collections.map((collection) => (
                <CommandItem
                  key={collection.id}
                  value={collection.title}
                  onSelect={() => onSelectCollection(collection.id)}
                  className="flex items-center gap-2 py-3 rounded-xl"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {collection.icon}
                    <span>{collection.title}</span>
                  </div>
                  {activeCollection.id === collection.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))}
              <div className="border-t">
                <CommandItem
                  value="new-collection"
                  onSelect={onAddCollection}
                  className="flex items-center gap-2 py-3 text-primary rounded-xl"
                >
                  <ListPlus className="h-4 w-4" />
                  <span>Create New Collection</span>
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CollectionsPopover;
