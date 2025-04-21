import { useState } from "react";
import {
  PRICE_RANGES,
  BEDROOM_OPTIONS,
  DISTANCE_OPTIONS,
} from "../lib/constants";
import { DollarSign, Bed, Map, PawPrint, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSettings, ActiveFilters } from "../types";
import { OriginDropdown } from "@/components/ui/origin_dropdown";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useSearchParty } from "../context/SearchPartyContext";

interface FilterChipsProps {
  onFilterChange: (filters: FilterSettings) => void;
  updateActiveFilters: (filters: ActiveFilters) => void;
  activeSearchParty?: { id: number; name: string } | null;
  onSearchPartyFilterToggle?: (enabled: boolean) => void;
}

const FilterChips = ({
  onFilterChange,
  updateActiveFilters,
  activeSearchParty,
  onSearchPartyFilterToggle,
}: FilterChipsProps) => {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [filterBySearchParty, setFilterBySearchParty] = useState(false);

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...activeFilters };

    if (value === "clear") {
      delete newFilters[filterType as keyof typeof newFilters];
    } else {
      if (filterType === "price") {
        const selectedRange = PRICE_RANGES.find(
          (range) => range.label === value,
        );
        if (selectedRange) {
          newFilters.price = selectedRange;
        }
      } else if (filterType === "bedrooms") {
        const selectedOption = BEDROOM_OPTIONS.find(
          (option) => option.label === value,
        );
        if (selectedOption) {
          newFilters.bedrooms = selectedOption.value;
        }
      } else if (filterType === "distance") {
        const selectedOption = DISTANCE_OPTIONS.find(
          (option) => option.label === value,
        );
        if (selectedOption) {
          newFilters.distance = selectedOption.value;
        }
      } else if (filterType === "petFriendly") {
        newFilters.petFriendly = value === "yes";
      }
    }

    setActiveFilters(newFilters);
    updateActiveFilters(newFilters);

    // Convert to FilterSettings format
    const filterSettings: FilterSettings = {};
    if (newFilters.price) {
      filterSettings.minPrice = newFilters.price.min;
      filterSettings.maxPrice = newFilters.price.max || undefined;
    }
    if (newFilters.bedrooms !== undefined) {
      filterSettings.bedrooms = newFilters.bedrooms;
    }
    if (newFilters.distance) {
      filterSettings.maxDistance = newFilters.distance;
    }
    if (newFilters.petFriendly) {
      filterSettings.petFriendly = true;
    }

    onFilterChange(filterSettings);
  };

  const togglePetFriendly = () => {
    const newFilters = { ...activeFilters };
    if (newFilters.petFriendly) {
      delete newFilters.petFriendly;
    } else {
      newFilters.petFriendly = true;
    }
    setActiveFilters(newFilters);
    updateActiveFilters(newFilters);

    // Convert to FilterSettings format
    const filterSettings: FilterSettings = {};
    if (newFilters.price) {
      filterSettings.minPrice = newFilters.price.min;
      filterSettings.maxPrice = newFilters.price.max || undefined;
    }
    if (newFilters.bedrooms !== undefined) {
      filterSettings.bedrooms = newFilters.bedrooms;
    }
    if (newFilters.distance) {
      filterSettings.maxDistance = newFilters.distance;
    }
    if (newFilters.petFriendly) {
      filterSettings.petFriendly = true;
    }

    onFilterChange(filterSettings);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    updateActiveFilters({});
    onFilterChange({});
  };
  
  const handleSearchPartyToggle = (checked: boolean) => {
    setFilterBySearchParty(checked);
    if (onSearchPartyFilterToggle) {
      onSearchPartyFilterToggle(checked);
    }
  };

  // Helper to get the current selected value for each dropdown
  const getCurrentValue = (filterType: string): string => {
    if (filterType === "price" && activeFilters.price) {
      return (
        PRICE_RANGES.find(
          (r) =>
            r.min === activeFilters.price?.min &&
            r.max === activeFilters.price?.max,
        )?.label || ""
      );
    } else if (
      filterType === "bedrooms" &&
      activeFilters.bedrooms !== undefined
    ) {
      return (
        BEDROOM_OPTIONS.find((o) => o.value === activeFilters.bedrooms)
          ?.label || ""
      );
    } else if (filterType === "distance" && activeFilters.distance) {
      return (
        DISTANCE_OPTIONS.find((o) => o.value === activeFilters.distance)
          ?.label || ""
      );
    }
    return "";
  };

  // Get searchParties data
  const { searchParties } = useSearchParty();

  return (
    <div className="flex w-full md:w-auto">
      <div className="w-full flex flex-wrap gap-3 items-center mb-3">
        {/* Consolidated filter bar with all filters in one container */}
        <div className="flex items-center bg-gray-100/70 backdrop-blur-sm rounded-full p-1 flex-grow mr-2">
          <div className="flex gap-1 px-2 divide-x divide-gray-200">
            {/* Price Range Dropdown */}
            <div className="pl-1 pr-2">
              <OriginDropdown
                options={PRICE_RANGES.map(range => ({ label: range.label, value: range.label }))}
                onSelect={(value) => handleFilterChange("price", value)}
                value={getCurrentValue("price")}
                placeholder="Price"
                icon={<DollarSign className="h-4 w-4 text-[#1A4A4A]" />}
                label=""
                showClearOption={!!activeFilters.price}
                minimal={true}
              />
            </div>

            {/* Bedrooms Dropdown */}
            <div className="pl-2 pr-2">
              <OriginDropdown
                options={BEDROOM_OPTIONS.map(option => ({ label: option.label, value: option.label }))}
                onSelect={(value) => handleFilterChange("bedrooms", value)}
                value={getCurrentValue("bedrooms")}
                placeholder="Beds"
                icon={<Bed className="h-4 w-4 text-[#1A4A4A]" />}
                label=""
                showClearOption={activeFilters.bedrooms !== undefined}
                minimal={true}
              />
            </div>

            {/* Distance Dropdown */}
            <div className="pl-2 pr-2">
              <OriginDropdown
                options={DISTANCE_OPTIONS.map(option => ({ label: option.label, value: option.label }))}
                onSelect={(value) => handleFilterChange("distance", value)}
                value={getCurrentValue("distance")}
                placeholder="Distance"
                icon={<Map className="h-4 w-4 text-[#1A4A4A]" />}
                label=""
                showClearOption={!!activeFilters.distance}
                minimal={true}
              />
            </div>

            {/* Pet Friendly Button */}
            <div className="pl-2">
              <Button
                variant={activeFilters.petFriendly ? "default" : "outline"}
                size="sm"
                className={`
                  flex items-center gap-1 rounded-full py-1 h-8
                  ${
                    activeFilters.petFriendly
                      ? "bg-[#E9927E] hover:bg-[#E9927E]/90 text-white"
                      : "border-[#C9DAD0] text-[#1A4A4A] hover:bg-[#C9DAD0]/10"
                  }
                `}
                onClick={togglePetFriendly}
              >
                <PawPrint className="h-3.5 w-3.5" />
                <span className="text-sm">Pets</span>
              </Button>
            </div>
          </div>
          
          {/* Clear All Filters (shown only when filters are active) */}
          {Object.keys(activeFilters).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[#1A4A4A] ml-1 h-8 text-xs"
              onClick={clearAllFilters}
            >
              Clear
            </Button>
          )}
        </div>
        
        {/* Search Party Filter Toggle with Selection functionality */}
        {activeSearchParty && (
          <div className="ml-auto">
            <div className="flex items-center rounded-full border border-[#A259FF] overflow-hidden">
              {/* Filter toggle side */}
              <Button
                variant={filterBySearchParty ? "default" : "ghost"}
                onClick={() => handleSearchPartyToggle(!filterBySearchParty)}
                className={`
                  flex items-center gap-2 px-3 py-2 h-10 transition-all duration-300
                  ${filterBySearchParty 
                    ? "bg-gradient-to-r from-[#7B4AFF] to-[#A259FF] text-white shadow-sm rounded-full" 
                    : "text-[#7B4AFF] hover:bg-[#A259FF]/10 rounded-l-full"}
                `}
              >
                <UsersRound className="h-4 w-4" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs opacity-90">Filter by</span>
                  <span className="font-medium text-sm truncate max-w-[85px]">
                    {activeSearchParty.name}
                  </span>
                </div>
                <div className={`w-3 h-3 rounded-full transition-all ${
                  filterBySearchParty ? "bg-white" : "bg-[#A259FF]/40"
                }`}/>
              </Button>
              
              {/* Switch Search Party Dropdown Button */}
              <Select
                value={activeSearchParty?.id.toString()}
                onValueChange={(value) => {
                  const searchPartyId = parseInt(value, 10);
                  // Dispatch an event to switch search parties
                  window.dispatchEvent(new CustomEvent('switch-search-party', {
                    detail: { searchPartyId }
                  }));
                }}
              >
                <SelectTrigger 
                  className={`
                    border-none h-10 px-3 rounded-r-full focus:ring-0 
                    ${!filterBySearchParty ? "border-l border-[#A259FF]/30" : ""}
                    ${filterBySearchParty ? "bg-gradient-to-r from-[#A259FF] to-[#9370FF] text-white" : "text-[#7B4AFF]"}
                  `}
                >
                  <SelectValue placeholder="Switch" />
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
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterChips;
