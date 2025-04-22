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
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Sliders, DollarSign, Bed, Map, PawPrint, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSettings, ActiveFilters, SearchParty } from "../types";
import { PRICE_RANGES, BEDROOM_OPTIONS, DISTANCE_OPTIONS } from "../lib/constants";
import { Switch } from "@/components/ui/switch";

interface MobileFilterPopoverProps {
  activeFilters: ActiveFilters;
  onFilterChange: (filterType: string, value: string) => void;
  clearAllFilters: () => void;
  onPetFriendlyToggle: () => void;
  activeSearchParty?: SearchParty | null;
  filterBySearchParty: boolean;
  onSearchPartyFilterToggle: (enabled: boolean) => void;
}

const MobileFilterPopover: React.FC<MobileFilterPopoverProps> = ({
  activeFilters,
  onFilterChange,
  clearAllFilters,
  onPetFriendlyToggle,
  activeSearchParty,
  filterBySearchParty,
  onSearchPartyFilterToggle,
}) => {
  // Count active filters (excluding search party)
  const activeFilterCount = Object.keys(activeFilters).length;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-full bg-white border border-gray-200 shadow-sm relative"
        >
          <Sliders className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#E9927E] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandList className="max-h-[300px]">
            <CommandGroup heading="Price Range">
              {PRICE_RANGES.map((range) => (
                <CommandItem
                  key={range.label}
                  value={range.label}
                  onSelect={() => onFilterChange("price", range.label)}
                  className="flex items-center gap-2 py-2"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>{range.label}</span>
                  </div>
                  {activeFilters.price?.label === range.label && (
                    <div className="h-2 w-2 rounded-full bg-[#E9927E]" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup heading="Bedrooms">
              {BEDROOM_OPTIONS.map((option) => (
                <CommandItem
                  key={option.label}
                  value={option.label}
                  onSelect={() => onFilterChange("bedrooms", option.label)}
                  className="flex items-center gap-2 py-2"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Bed className="h-4 w-4 text-gray-500" />
                    <span>{option.label}</span>
                  </div>
                  {activeFilters.bedrooms === option.value && (
                    <div className="h-2 w-2 rounded-full bg-[#E9927E]" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup heading="Distance">
              {DISTANCE_OPTIONS.map((option) => (
                <CommandItem
                  key={option.label}
                  value={option.label}
                  onSelect={() => onFilterChange("distance", option.label)}
                  className="flex items-center gap-2 py-2"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Map className="h-4 w-4 text-gray-500" />
                    <span>{option.label}</span>
                  </div>
                  {activeFilters.distance === option.value && (
                    <div className="h-2 w-2 rounded-full bg-[#E9927E]" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup>
              <CommandItem
                onSelect={onPetFriendlyToggle}
                className="flex items-center gap-2 py-3"
              >
                <div className="flex items-center gap-2 flex-1">
                  <PawPrint className="h-4 w-4 text-gray-500" />
                  <span>Pet Friendly</span>
                </div>
                <Switch 
                  checked={!!activeFilters.petFriendly} 
                  onCheckedChange={() => onPetFriendlyToggle()}
                  className="data-[state=checked]:bg-[#E9927E]"
                />
              </CommandItem>
            </CommandGroup>
            
            {/* Search Party Filter */}
            {activeSearchParty && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Search Party">
                  <CommandItem
                    className="flex items-center gap-2 py-3"
                    onSelect={() => onSearchPartyFilterToggle(!filterBySearchParty)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Users className="h-4 w-4 text-[#A259FF]" />
                      <div className="flex flex-col">
                        <span className="text-sm">Filter by {activeSearchParty.name}</span>
                        <span className="text-xs text-gray-500">Show only apartments in this search party</span>
                      </div>
                    </div>
                    <Switch 
                      checked={filterBySearchParty} 
                      onCheckedChange={onSearchPartyFilterToggle}
                      className="data-[state=checked]:bg-[#A259FF]"
                    />
                  </CommandItem>
                </CommandGroup>
              </>
            )}
            
            {activeFilterCount > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearAllFilters}
                    className="flex items-center gap-2 py-2"
                  >
                    <div className="flex items-center gap-2 flex-1 text-red-500">
                      <Trash2 className="h-4 w-4" />
                      <span>Clear all filters</span>
                    </div>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MobileFilterPopover;