import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import appLogo from "../assets/letsmove_logo_black.png";

const Header = () => {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 bg-[#FFF5E6] shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <img src={appLogo} className="h-8 cursor-pointer" />
        </Link>

        <div className="flex items-center space-x-3">
          <button
            className="text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20"
            onClick={() => setLocation("/listings")}
          >
            <Search className="h-6 w-6" />
          </button>

          {/* Mobile: Sheet/Drawer Menu */}
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20 md:hidden">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent>
                <div className="mt-8 flex flex-col space-y-4">
                  <Link href="/">
                    <span className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${isActive('/') ? 'bg-[#C9DAD0]/20' : ''}`}>
                      Home
                    </span>
                  </Link>
                  <Link href="/listings">
                    <span className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${isActive('/listings') ? 'bg-[#C9DAD0]/20' : ''}`}>
                      Apartments
                    </span>
                  </Link>
                  <Link href="/search-party">
                    <span className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${isActive('/search-party') ? 'bg-[#C9DAD0]/20' : ''}`}>
                      Search Parties
                    </span>
                  </Link>
                  <Link href="/favorites">
                    <span className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${isActive('/favorites') ? 'bg-[#C9DAD0]/20' : ''}`}>
                      Favorites
                    </span>
                  </Link>
                  <Link href="/profile">
                    <span className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${isActive('/profile') ? 'bg-[#C9DAD0]/20' : ''}`}>
                      Profile
                    </span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            /* Desktop: Dropdown Menu */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20">
                  <Menu className="h-6 w-6 mr-1" />
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem asChild>
                  <Link href="/" className="w-full cursor-pointer">
                    <span className={`w-full text-[#1A4A4A] font-medium ${isActive('/') ? 'text-[#E9927E]' : ''}`}>
                      Home
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/listings" className="w-full cursor-pointer">
                    <span className={`w-full text-[#1A4A4A] font-medium ${isActive('/listings') ? 'text-[#E9927E]' : ''}`}>
                      Apartments
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/search-party" className="w-full cursor-pointer">
                    <span className={`w-full text-[#1A4A4A] font-medium ${isActive('/search-party') ? 'text-[#E9927E]' : ''}`}>
                      Search Parties
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="w-full cursor-pointer">
                    <span className={`w-full text-[#1A4A4A] font-medium ${isActive('/favorites') ? 'text-[#E9927E]' : ''}`}>
                      Favorites
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full cursor-pointer">
                    <span className={`w-full text-[#1A4A4A] font-medium ${isActive('/profile') ? 'text-[#E9927E]' : ''}`}>
                      Profile
                    </span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
