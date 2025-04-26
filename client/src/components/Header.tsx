import { Link, useLocation } from "wouter";
import { Menu, Search, CircleUserRound } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import appLogo from "../assets/letsmove_logo_black.png";

interface HeaderProps {
  darkMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ darkMode = false }) => {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const isActive = (path: string) => location === path;
  
  // Add scroll event listener to apply styles based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic styles based on dark mode and scroll state
  const headerClasses = darkMode 
    ? `sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
        ? "bg-[#2E1249]/40 backdrop-blur-md" 
        : "bg-gradient-to-b from-[#2E1249]/70 to-transparent"
      }`
    : `sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
        ? "bg-white/80 backdrop-blur-md shadow-sm" 
        : "bg-white"
      }`;
  
  const textColor = darkMode ? "text-white" : "text-[#1A4A4A]";
  const iconColor = darkMode ? "#FFFFFF" : "#1A4A4A";
  const hoverBgClass = darkMode 
    ? "hover:bg-white/10" 
    : "hover:bg-[#C9DAD0]/20";
  const activeTextClass = darkMode 
    ? "text-[#E9927E]" 
    : "text-[#E9927E]";
  
  const logoSrc = darkMode 
    ? appLogo // You may want to replace this with a white logo if available
    : appLogo;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <img src={logoSrc} className="h-8 cursor-pointer" />
        </Link>
        
        {!isMobile && (
          <div className="flex items-center space-x-12 text-sm px-8 rounded-full">
            <Link href="/" className="flex flex-1 w-full cursor-pointer">
              <span
                className={`w-full ${textColor} font-medium ${
                  isActive("/") ? activeTextClass : ""
                }`}
              >
                Events
              </span>
            </Link>
            <Link
              href="/listings"
              className="flex flex-1 w-full cursor-pointer"
            >
              <span
                className={`w-full ${textColor} font-medium ${
                  isActive("/listings") ? activeTextClass : ""
                }`}
              >
                Calendars
              </span>
            </Link>
            <Link
              href="/search-party"
              className="flex flex-grow w-full cursor-pointer"
            >
              <span
                className={`w-full ${textColor} font-medium ${
                  isActive("/search-party") ? activeTextClass : ""
                }`}
              >
                Discover
              </span>
            </Link>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <button
            className={`${textColor} p-2 rounded-full ${hoverBgClass}`}
            onClick={() => setLocation("/listings")}
          >
            <Search className="h-5 w-5" />
          </button>

          <button className="">
            <Link
              href="/profile"
              className={`flex flex-1 w-full ${textColor} p-2 rounded-full ${hoverBgClass}`}
            >
              <CircleUserRound color={iconColor} className="h-5 w-5" />
            </Link>
          </button>

          {/* Mobile: Sheet/Drawer Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <button className={`${textColor} p-2 rounded-full ${hoverBgClass} md:hidden`}>
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent>
                <div className="mt-8 flex flex-col space-y-4">
                  <Link href="/">
                    <span
                      className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${
                        isActive("/") ? "bg-[#C9DAD0]/20" : ""
                      }`}
                    >
                      Events
                    </span>
                  </Link>
                  <Link href="/listings">
                    <span
                      className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${
                        isActive("/listings") ? "bg-[#C9DAD0]/20" : ""
                      }`}
                    >
                      Calendars
                    </span>
                  </Link>
                  <Link href="/search-party">
                    <span
                      className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${
                        isActive("/search-party") ? "bg-[#C9DAD0]/20" : ""
                      }`}
                    >
                      Discover
                    </span>
                  </Link>
                  <Link href="/favorites">
                    <span
                      className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${
                        isActive("/favorites") ? "bg-[#C9DAD0]/20" : ""
                      }`}
                    >
                      Favorites
                    </span>
                  </Link>
                  <Link href="/profile">
                    <span
                      className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${
                        isActive("/profile") ? "bg-[#C9DAD0]/20" : ""
                      }`}
                    >
                      Profile
                    </span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
