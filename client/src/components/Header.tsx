import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FFF5E6] shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-[#E9927E] text-3xl font-semibold cursor-pointer">
            letsmove
          </h1>
        </Link>
        
        <div className="flex items-center space-x-3">
          <button 
            className="text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20"
            onClick={() => setLocation('/listings')}
          >
            <Search className="h-6 w-6" />
          </button>
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <div className="mt-8 flex flex-col space-y-4">
                <Link href="/">
                  <span className="text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg">
                    Home
                  </span>
                </Link>
                <Link href="/listings">
                  <span className="text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg">
                    Apartments
                  </span>
                </Link>
                <Link href="/search-party">
                  <span className="text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg">
                    Search Parties
                  </span>
                </Link>
                <Link href="/favorites">
                  <span className="text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg">
                    Favorites
                  </span>
                </Link>
                <Link href="/profile">
                  <span className="text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg">
                    Profile
                  </span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
