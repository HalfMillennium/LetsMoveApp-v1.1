import { Link, useLocation } from "wouter";
import { Menu, Search, CircleUserRound, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import appLogo from "../assets/searchparty_logo.png";
import { useState, useEffect } from "react";

const Header = () => {
  const [location, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsSignedIn(true);
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    setIsSignedIn(false);
    setLocation('/');
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 border-b border backdrop-blur-lg border-b backdrop-opacity-20 bg-white w-full">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <img src={appLogo} className="h-10 cursor-pointer" />
        </Link>
        {!isMobile && (
          <div className="flex items-center space-x-12 text-sm">
            <Link href="/" className="flex flex-1 w-full cursor-pointer">
              <span
                className={`w-full text-[#1A4A4A] font-medium ${
                  isActive("/") ? "text-[#E9927E]" : ""
                }`}
              >
                Home
              </span>
            </Link>
            <Link
              href="/listings"
              className="flex flex-1 w-full cursor-pointer"
            >
              <span
                className={`w-full text-[#1A4A4A] font-medium ${
                  isActive("/listings") ? "text-[#E9927E]" : ""
                }`}
              >
                Apartments
              </span>
            </Link>
            <Link
              href="/search-party"
              className="flex flex-grow w-full cursor-pointer"
            >
              <span
                className={`w-full text-[#1A4A4A] font-medium ${
                  isActive("/search-party") ? "text-[#E9927E]" : ""
                }`}
              >
                Search Parties
              </span>
            </Link>
            <Link
              href="/favorites"
              className="flex flex-1 w-full cursor-pointer"
            >
              <span
                className={`w-full text-[#1A4A4A] font-medium ${
                  isActive("/favorites") ? "text-[#E9927E]" : ""
                }`}
              >
                Favorites
              </span>
            </Link>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <button
            className="text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20"
            onClick={() => setLocation("/listings")}
          >
            <Search className="h-6 w-6" />
          </button>

          {isSignedIn ? (
            <div className="flex items-center space-x-2">
              <Link
                href="/profile"
                className="flex items-center text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20"
              >
                <CircleUserRound color="#1A4A4A" className="h-6 w-6" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-[#1A4A4A] hover:bg-[#C9DAD0]/20"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/sign-in")}
                className="text-[#1A4A4A] hover:bg-[#C9DAD0]/20"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => setLocation("/sign-up")}
                className="bg-[#E9927E] hover:bg-[#E9927E]/90 text-white"
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile: Sheet/Drawer Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-[#1A4A4A] p-2 rounded-full hover:bg-[#C9DAD0]/20 md:hidden">
                  <Menu className="h-6 w-6" />
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
                      Home
                    </span>
                  </Link>
                  <Link href="/listings">
                    <span
                      className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${
                        isActive("/listings") ? "bg-[#C9DAD0]/20" : ""
                      }`}
                    >
                      Apartments
                    </span>
                  </Link>
                  <Link href="/search-party">
                    <span
                      className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${
                        isActive("/search-party") ? "bg-[#C9DAD0]/20" : ""
                      }`}
                    >
                      Search Parties
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
                  {isSignedIn ? (
                    <>
                      <Link href="/profile">
                        <span
                          className={`text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg ${
                            isActive("/profile") ? "bg-[#C9DAD0]/20" : ""
                          }`}
                        >
                          Profile
                        </span>
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg w-full text-left"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => setLocation("/sign-in")}
                        className="text-[#1A4A4A] font-medium text-lg block p-2 hover:bg-[#C9DAD0]/20 rounded-lg w-full text-left"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setLocation("/sign-up")}
                        className="bg-[#E9927E] text-white font-medium text-lg block p-2 rounded-lg w-full text-left"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
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
