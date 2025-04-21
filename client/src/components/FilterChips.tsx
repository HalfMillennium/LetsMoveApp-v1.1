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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

  return (
    <div className="flex w-full md:w-auto">
      <div
        style={{ scrollbarWidth: "none" }}
        className="flex flex-1 overflow-auto md:overflow-hidden gap-3 items-center mb-4 sm:p-2"
      >
        {/* Price Range Dropdown */}
        <div className="relative">
          <OriginDropdown
            options={PRICE_RANGES.map(range => ({ label: range.label, value: range.label }))}
            onSelect={(value) => handleFilterChange("price", value)}
            value={getCurrentValue("price")}
            placeholder="Price range"
            icon={<DollarSign className="h-4 w-4 text-[#1A4A4A]" />}
            label="Price Range"
            showClearOption={!!activeFilters.price}
          />
        </div>

        {/* Bedrooms Dropdown */}
        <div className="relative">
          <OriginDropdown
            options={BEDROOM_OPTIONS.map(option => ({ label: option.label, value: option.label }))}
            onSelect={(value) => handleFilterChange("bedrooms", value)}
            value={getCurrentValue("bedrooms")}
            placeholder="Bedrooms"
            icon={<Bed className="h-4 w-4 text-[#1A4A4A]" />}
            label="Bedrooms"
            showClearOption={activeFilters.bedrooms !== undefined}
          />
        </div>

        {/* Distance Dropdown */}
        <div className="relative">
          <OriginDropdown
            options={DISTANCE_OPTIONS.map(option => ({ label: option.label, value: option.label }))}
            onSelect={(value) => handleFilterChange("distance", value)}
            value={getCurrentValue("distance")}
            placeholder="Distance"
            icon={<Map className="h-4 w-4 text-[#1A4A4A]" />}
            label="Distance"
            showClearOption={!!activeFilters.distance}
          />
        </div>

        {/* Pet Friendly Button */}
        <Button
          variant={activeFilters.petFriendly ? "default" : "outline"}
          size="sm"
          className={`
            flex items-center gap-2 rounded-full h-10
            ${
              activeFilters.petFriendly
                ? "bg-[#E9927E] hover:bg-[#E9927E]/90 text-white"
                : "border-[#C9DAD0] text-[#1A4A4A] hover:bg-[#C9DAD0]/10"
            }
          `}
          onClick={togglePetFriendly}
        >
          <PawPrint className="h-4 w-4" />
          <span>Pet friendly</span>
        </Button>

        {/* Clear All Filters (shown only when filters are active) */}
        {Object.keys(activeFilters).length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-[#1A4A4A]"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        )}
        
        {/* Search Party Filter Toggle with Add To Search Party functionality */}
        {activeSearchParty && (
          <div className="ml-auto">
            <div className="flex items-center rounded-full border border-[#A259FF] overflow-hidden">
              {/* Filter toggle side */}
              <Button
                variant={filterBySearchParty ? "default" : "ghost"}
                onClick={() => handleSearchPartyToggle(!filterBySearchParty)}
                className={`
                  flex items-center gap-2 px-4 py-2 h-10 rounded-l-full border-r border-[#A259FF]/30 transition-all duration-300
                  ${filterBySearchParty 
                    ? "bg-gradient-to-r from-[#7B4AFF] to-[#A259FF] text-white shadow-sm" 
                    : "text-[#7B4AFF] hover:bg-[#A259FF]/10"}
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
              
              {/* Add To Search Party side */}
              <Button
                variant="ghost"
                onClick={() => {
                  // Open add to search party modal or functionality
                  window.dispatchEvent(new CustomEvent('open-search-party-modal', {
                    detail: { searchPartyId: activeSearchParty.id }
                  }));
                }}
                className="flex items-center gap-2 px-4 py-2 h-10 rounded-r-full text-[#7B4AFF] hover:bg-[#A259FF]/10"
              >
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs opacity-90">Add to</span>
                  <span className="font-medium text-sm truncate max-w-[85px]">
                    Search Party
                  </span>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#A259FF]/10 flex items-center justify-center">
                  <span className="text-[#7B4AFF] text-xs font-bold">+</span>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterChips;
