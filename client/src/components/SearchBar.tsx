import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  darkMode?: boolean;
}

const SearchBar = ({ 
  placeholder = "Search city or neighborhood", 
  onSearch,
  darkMode = false
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
    <div className="relative w-full max-w-xl mx-auto mt-6 mb-8">
      <div 
        className={`flex items-center overflow-hidden rounded-xl shadow-lg ${
          darkMode ? 'bg-[#0E2C3F]/80 text-white border border-[#374a5b]/50' : 'bg-white text-[#1A4A4A]'
        }`}
      >
        <input 
          type="text" 
          placeholder={placeholder} 
          className={`w-full py-4 px-6 outline-none ${
            darkMode ? 'bg-transparent text-white placeholder-white/60' : 'text-[#1A4A4A]'
          }`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          className="bg-transparent px-4"
          onClick={handleSearch}
          aria-label="Search"
        >
          <Search className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-[#1A4A4A]'}`} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
