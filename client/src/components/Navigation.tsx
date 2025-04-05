import { Link, useLocation } from "wouter";

const Navigation = () => {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="w-full z-10">
      <ul className="flex justify-between text-[#1A4A4A] text-lg">
        <li>
          <Link 
            href="/favorites"
            className={`py-2 px-4 font-medium ${isActive("/favorites") ? "text-[#E9927E]" : ""}`}
          >
            Favorites
          </Link>
        </li>
        <li>
          <Link 
            href="/search-party"
            className={`py-2 px-4 font-medium ${isActive("/search-party") ? "text-[#E9927E]" : ""}`}
          >
            Messages
          </Link>
        </li>
        <li>
          <Link 
            href="/profile"
            className={`py-2 px-4 font-medium ${isActive("/profile") ? "text-[#E9927E]" : ""}`}
          >
            Account
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
