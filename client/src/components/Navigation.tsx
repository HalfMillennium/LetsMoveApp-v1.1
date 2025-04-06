import { Link, useLocation } from "wouter";

export const Navigation = () => {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="w-full z-10">
      <ul className="flex justify-between text-[#1A4A4A] text-lg">
        <li>
          <Link 
            href="/favorites"
            className={`bg-[#FFF5E6] rounded-full py-4 px-6 text-sm font-medium ${isActive("/favorites") ? "text-[#E9927E]" : ""}`}
          >
            Favorites
          </Link>
        </li>
        <li>
          <Link 
            href="/search-party"
            className={`bg-[#FFF5E6] rounded-full py-4 px-6 text-sm font-medium ${isActive("/search-party") ? "text-[#E9927E]" : ""}`}
          >
            Messages
          </Link>
        </li>
        <li>
          <Link 
            href="/profile"
            className={`bg-[#FFF5E6] rounded-full py-4 px-6 text-sm font-medium ${isActive("/profile") ? "text-[#E9927E]" : ""}`}
          >
            Account
          </Link>
        </li>
      </ul>
    </nav>
  );
};