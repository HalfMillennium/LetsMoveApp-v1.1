import { useState } from "react";
import {
  PRICE_RANGES,
  BEDROOM_OPTIONS,
  DISTANCE_OPTIONS,
} from "../lib/constants";
import { DollarSign, Bed, Map, PawPrint } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterSettings, ActiveFilters } from "../types";

interface FilterChipsProps {
  onFilterChange: (filters: FilterSettings) => void;
  updateActiveFilters: (filters: ActiveFilters) => void;
}

const FilterChips = ({
  onFilterChange,
  updateActiveFilters,
}: FilterChipsProps) => {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const handleFilterChange = (filterType: string, value: any) => {
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
      <div style={{scrollbarWidth: 'none'}} className="flex flex-1 overflow-auto md:overflow-hidden gap-3 items-center mb-4">
        {/* Price Range Dropdown */}
        <div className="relative">
          <Select
            value={getCurrentValue("price") || undefined}
            onValueChange={(value) => handleFilterChange("price", value)}
          >
            <SelectTrigger className="w-[160px] bg-white border-[#C9DAD0]">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#1A4A4A]" />
                <SelectValue placeholder="Price range" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Price Range</SelectLabel>
                {PRICE_RANGES.map((range, index) => (
                  <SelectItem key={`price-${index}`} value={range.label}>
                    {range.label}
                  </SelectItem>
                ))}
                {activeFilters.price && (
                  <SelectItem value="clear">Clear selection</SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms Dropdown */}
        <div className="relative">
          <Select
            value={getCurrentValue("bedrooms") || undefined}
            onValueChange={(value) => handleFilterChange("bedrooms", value)}
          >
            <SelectTrigger className="w-[160px] bg-white border-[#C9DAD0]">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-[#1A4A4A]" />
                <SelectValue placeholder="Bedrooms" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bedrooms</SelectLabel>
                {BEDROOM_OPTIONS.map((option, index) => (
                  <SelectItem key={`bedroom-${index}`} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
                {activeFilters.bedrooms !== undefined && (
                  <SelectItem value="clear">Clear selection</SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Distance Dropdown */}
        <div className="relative">
          <Select
            value={getCurrentValue("distance") || undefined}
            onValueChange={(value) => handleFilterChange("distance", value)}
          >
            <SelectTrigger className="w-[160px] bg-white border-[#C9DAD0]">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-[#1A4A4A]" />
                <SelectValue placeholder="Distance" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Distance</SelectLabel>
                {DISTANCE_OPTIONS.map((option, index) => (
                  <SelectItem key={`distance-${index}`} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
                {activeFilters.distance && (
                  <SelectItem value="clear">Clear selection</SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
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
      </div>
    </div>
  );
};

export default FilterChips;
