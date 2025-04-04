import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronRight } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar = ({ 
  placeholder = "Search nearby", 
  onSearch 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [, navigate] = useLocation();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Navigate to listings page with search query
      navigate(`/listings?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative w-full mt-6 mb-8">
      <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md">
        <input 
          type="text" 
          placeholder={placeholder} 
          className="w-full py-4 px-6 outline-none text-[#1A4A4A]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          className="bg-[#E9927E] text-white px-8 py-4 rounded-full"
          onClick={handleSearch}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
