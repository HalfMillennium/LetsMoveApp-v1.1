import { useLocation, Link } from 'wouter';
import { Home, Search, Heart, Users, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNavBar = () => {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location === path;
  
  // Only render on mobile devices
  if (!isMobile) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-40">
      <nav className="flex justify-around items-center py-3">
        <Link href="/" className="flex flex-col items-center text-[#1A4A4A]">
          <Home className={`h-6 w-6 ${isActive('/') ? 'text-[#E9927E]' : ''}`} />
          <span className={`text-xs mt-1 ${isActive('/') ? 'text-[#E9927E]' : ''}`}>
            Home
          </span>
        </Link>
        
        <Link href="/listings" className="flex flex-col items-center text-[#1A4A4A]">
          <Search className={`h-6 w-6 ${isActive('/listings') ? 'text-[#E9927E]' : ''}`} />
          <span className={`text-xs mt-1 ${isActive('/listings') ? 'text-[#E9927E]' : ''}`}>
            Search
          </span>
        </Link>
        
        <Link href="/favorites" className="flex flex-col items-center text-[#1A4A4A]">
          <Heart className={`h-6 w-6 ${isActive('/favorites') ? 'text-[#E9927E]' : ''}`} />
          <span className={`text-xs mt-1 ${isActive('/favorites') ? 'text-[#E9927E]' : ''}`}>
            Favorites
          </span>
        </Link>
        
        <Link href="/search-party" className="flex flex-col items-center text-[#1A4A4A]">
          <Users className={`h-6 w-6 ${isActive('/search-party') ? 'text-[#E9927E]' : ''}`} />
          <span className={`text-xs mt-1 ${isActive('/search-party') ? 'text-[#E9927E]' : ''}`}>
            Parties
          </span>
        </Link>
        
        <Link href="/profile" className="flex flex-col items-center text-[#1A4A4A]">
          <User className={`h-6 w-6 ${isActive('/profile') ? 'text-[#E9927E]' : ''}`} />
          <span className={`text-xs mt-1 ${isActive('/profile') ? 'text-[#E9927E]' : ''}`}>
            Profile
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default MobileNavBar;
