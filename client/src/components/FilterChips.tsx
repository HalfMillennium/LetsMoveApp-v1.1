import { useState } from 'react';
import { PRICE_RANGES, BEDROOM_OPTIONS, DISTANCE_OPTIONS } from '../lib/constants';

interface FilterChipsProps {
  onFilterChange: (filters: any) => void;
}

const FilterChips = ({ onFilterChange }: FilterChipsProps) => {
  const [activeFilters, setActiveFilters] = useState<{
    price?: { min: number, max: number | null },
    bedrooms?: number,
    distance?: number,
    petFriendly?: boolean
  }>({});

  const handleFilterClick = (filterType: string, value: any) => {
    const newFilters = { ...activeFilters };
    
    // Toggle filter on/off
    if (newFilters[filterType as keyof typeof newFilters] === value) {
      delete newFilters[filterType as keyof typeof newFilters];
    } else {
      newFilters[filterType as keyof typeof newFilters] = value;
    }
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const isActive = (filterType: string, value: any): boolean => {
    return activeFilters[filterType as keyof typeof activeFilters] === value;
  };
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* Price filters */}
      {PRICE_RANGES.map((range, index) => (
        <button
          key={`price-${index}`}
          className={`px-4 py-2 rounded-full text-sm border ${
            isActive('price', range) 
              ? 'bg-[#E9927E] text-white border-[#E9927E]' 
              : 'bg-white text-[#1A4A4A] border-[#C9DAD0] hover:bg-[#C9DAD0]/10'
          }`}
          onClick={() => handleFilterClick('price', range)}
        >
          {range.label}
        </button>
      ))}
      
      {/* Bedroom filters */}
      {BEDROOM_OPTIONS.map((option, index) => (
        <button
          key={`bedroom-${index}`}
          className={`px-4 py-2 rounded-full text-sm border ${
            isActive('bedrooms', option.value) 
              ? 'bg-[#E9927E] text-white border-[#E9927E]' 
              : 'bg-white text-[#1A4A4A] border-[#C9DAD0] hover:bg-[#C9DAD0]/10'
          }`}
          onClick={() => handleFilterClick('bedrooms', option.value)}
        >
          {option.label}
        </button>
      ))}
      
      {/* Distance filters */}
      {DISTANCE_OPTIONS.map((option, index) => (
        <button
          key={`distance-${index}`}
          className={`px-4 py-2 rounded-full text-sm border ${
            isActive('distance', option.value) 
              ? 'bg-[#E9927E] text-white border-[#E9927E]' 
              : 'bg-white text-[#1A4A4A] border-[#C9DAD0] hover:bg-[#C9DAD0]/10'
          }`}
          onClick={() => handleFilterClick('distance', option.value)}
        >
          {option.label}
        </button>
      ))}
      
      {/* Pet friendly filter */}
      <button
        className={`px-4 py-2 rounded-full text-sm border ${
          isActive('petFriendly', true) 
            ? 'bg-[#E9927E] text-white border-[#E9927E]' 
            : 'bg-white text-[#1A4A4A] border-[#C9DAD0] hover:bg-[#C9DAD0]/10'
        }`}
        onClick={() => handleFilterClick('petFriendly', true)}
      >
        Pet friendly
      </button>
    </div>
  );
};

export default FilterChips;
