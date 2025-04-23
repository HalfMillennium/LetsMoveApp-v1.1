import { useState } from "react";
import {
  PRICE_RANGES,
  BEDROOM_OPTIONS,
  DISTANCE_OPTIONS,
} from "../lib/constants";
import {
  DollarSign,
  Bed,
  Map,
  PawPrint,
  UsersRound,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSettings, ActiveFilters } from "../types";
import { OriginDropdown } from "@/components/ui/origin_dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParty } from "../context/SearchPartyContext";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileFilterPopover from "./MobileFilterPopover";

interface FilterChipsProps {
  onFilterChange: (filters: FilterSettings) => void;
  updateActiveFilters: (filters: ActiveFilters) => void;
  activeSearchParty?: {
    id: number;
    name: string;
    createdById?: number;
    createdAt?: string;
  } | null;
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

  const isMobile = useIsMobile();

  return (
    <div className="flex w-full md:w-auto">
      <div className="w-full flex flex-wrap gap-3 items-center mb-3">
        {/* Mobile version of filters */}
        {isMobile ? (
          <div className="flex w-full justify-between">
            <MobileFilterPopover
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              clearAllFilters={clearAllFilters}
              onPetFriendlyToggle={togglePetFriendly}
              activeSearchParty={activeSearchParty}
              filterBySearchParty={filterBySearchParty}
              onSearchPartyFilterToggle={handleSearchPartyToggle}
            />
          </div>
        ) : (
          /* Desktop/Tablet version of filters */
          <div className="flex items-center shadow-md backdrop-blur-sm rounded-full p-2 flex-grow mr-2 transition-all duration-300 ease-in-out">
            <div className="flex gap-4 px-2 divide-x divide-gray-200 transition-all duration-300 ease-in-out">
              {/* Price Range Dropdown */}
              <div className="w-full">
                <OriginDropdown
                  options={PRICE_RANGES.map((range) => ({
                    label: range.label,
                    value: range.label,
                  }))}
                  className="rounded-lg"
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
              <div className="pl-4">
                <OriginDropdown
                  options={BEDROOM_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.label,
                  }))}
                  className="rounded-lg"
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
              <div className="pl-4">
                <OriginDropdown
                  options={DISTANCE_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.label,
                  }))}
                  className="rounded-lg"
                  onSelect={(value) => handleFilterChange("distance", value)}
                  value={getCurrentValue("distance")}
                  placeholder="Distance"
                  icon={<Map className="h-4 w-4 text-[#1A4A4A]" />}
                  label=""
                  showClearOption={!!activeFilters.distance}
                  minimal={true}
                />
              </div>
            </div>

            {/* Clear All Filters (shown only when filters are active) */}
            <div className="relative overflow-hidden transition-all duration-300 ease-in-out">
              <div
                className={`
                  ${
                    Object.keys(activeFilters).length > 0
                      ? "opacity-100 max-w-[80px] animate-fadeIn"
                      : "opacity-0 max-w-0 animate-fadeOut"
                  }
                  transition-all duration-300 transform ease-in-out
                `}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#1A4A4A] ml-1 h-8 text-xs rounded-full items-center whitespace-nowrap"
                  onClick={clearAllFilters}
                >
                  <div className="flex items-center gap-1.5 w-full justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-md">
                        <Trash2 size={8} />
                      </span>
                      <span className="truncate mt-0.5">Clear</span>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search Party Filter Toggle with Selection functionality */}
        {activeSearchParty && !isMobile && (
          <div className="ml-auto">
            <div className="flex items-center rounded-full overflow-visible">
              {/* Filter toggle side */}
              <Button
                variant={filterBySearchParty ? "default" : "ghost"}
                onClick={() => handleSearchPartyToggle(!filterBySearchParty)}
                className={`
                  flex items-center gap-2 p-6 h-10 transition-all duration-300
                  ${
                    filterBySearchParty
                      ? "bg-primary text-white shadow-md rounded-full"
                      : "text-primary hover:bg-primary/20 rounded-full"
                  }
                `}
              >
                <UsersRound className="h-4 w-4" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs opacity-90">
                    {filterBySearchParty ? "Filtering" : "Filter"} by
                  </span>
                  <span className="font-medium text-sm truncate">
                    {activeSearchParty.name}
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    filterBySearchParty ? "bg-white" : "bg-primary/40"
                  }`}
                />
              </Button>

              {/* Switch Search Party Dropdown Button as OriginDropdown */}
              <div className="border-l border-primary/30 pl-4 ml-2">
                <OriginDropdown
                  options={searchParties.map((party) => ({
                    label: party.name,
                    value: party.id.toString(),
                  }))}
                  className="rounded-lg"
                  onSelect={(value) => {
                    const searchPartyId = parseInt(value, 10);
                    // Dispatch an event to switch search parties
                    window.dispatchEvent(
                      new CustomEvent("switch-search-party", {
                        detail: { searchPartyId },
                      }),
                    );
                  }}
                  value={activeSearchParty.name}
                  placeholder="Switch party"
                  icon={<UsersRound className="h-4 w-4 text-black" />}
                  label=""
                  minimal={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Search Party Controls */}
        {activeSearchParty && isMobile && (
          <div className="ml-auto flex items-center gap-2">
            {/* Toggle Button */}
            <Button
              variant={filterBySearchParty ? "default" : "outline"}
              size="sm"
              onClick={() => handleSearchPartyToggle(!filterBySearchParty)}
              className={`
                flex items-center gap-1.5 h-9 px-3 transition-all duration-300 rounded-full
                ${filterBySearchParty ? "bg-primary text-white" : "border-primary/40 text-primary"}
              `}
            >
              <UsersRound className="h-3.5 w-3.5" />
              <span className="text-xs font-medium truncate max-w-[80px]">
                {activeSearchParty.name}
              </span>
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  filterBySearchParty ? "bg-white" : "bg-primary/40"
                }`}
              />
            </Button>

            {/* Mobile OriginDropdown for Search Party selection */}
            <div className="relative">
              <OriginDropdown
                options={searchParties.map((party) => ({
                  label: party.name,
                  value: party.id.toString(),
                }))}
                onSelect={(value) => {
                  const searchPartyId = parseInt(value, 10);
                  window.dispatchEvent(
                    new CustomEvent("switch-search-party", {
                      detail: { searchPartyId },
                    }),
                  );
                }}
                value={activeSearchParty.name}
                placeholder="Switch"
                icon={<UsersRound className="h-3.5 w-3.5 text-primary" />}
                minimal={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterChips;
