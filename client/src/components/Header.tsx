import { Link, useLocation } from "wouter";
import { Menu, Search, CircleUserRound, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import appLogo from "../assets/letsmove_logo_black.png";

const Header = () => {
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 border-b border backdrop-blur-lg border-b backdrop-opacity-20 bg-white w-full">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <img src={appLogo} className="h-8 cursor-pointer" />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={
                        user?.fullName || user?.emailAddresses[0]?.emailAddress
                      }
                    />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.firstName?.charAt(0) ||
                        user?.emailAddresses[0]?.emailAddress?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="flex flex-col gap-1 w-56 rounded-2xl p-4"
                align="end"
                forceMount
              >
                <div className="flex items-center justify-start gap-4 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.fullName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg" asChild>
                  <Link href="/profile" className="w-full cursor-pointer">
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg"
                  onSelect={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button className="rounded-full" variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button className="rounded-full" asChild>
                <Link href="/sign-up">Sign Up</Link>
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
