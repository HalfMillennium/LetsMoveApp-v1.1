import { Link, useLocation } from "wouter";

interface NavigationProps {
  darkMode?: boolean;
  buttonStyle?: "ghost" | "pill";
}

export const Navigation = ({
  darkMode = false,
  buttonStyle = "pill",
}: NavigationProps) => {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  // Define styles based on props
  const pillStyle = darkMode
    ? "bg-[#FFF9F2] text-[#0D2436] hover:bg-opacity-90 rounded-full py-3 px-8 text-sm font-medium transition-colors"
    : "bg-[#FFF9F2] rounded-full py-3 px-8 text-sm font-medium";

  const ghostStyle = darkMode
    ? "text-white hover:text-[#F9A775] py-2 text-sm font-medium transition-colors"
    : "text-[#1A4A4A] hover:text-[#E9927E] py-2 text-sm font-medium";

  const baseStyle = buttonStyle === "pill" ? pillStyle : ghostStyle;

  return (
    <nav className="w-full z-10">
      <ul className="flex justify-between gap-2">
        <li className="flex-1">
          <Link
            href="/favorites"
            className={`flex justify-center items-center w-full ${baseStyle} ${isActive("/favorites") ? "text-[#E9927E]" : ""}`}
          >
            Favorites
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href="/search-party"
            className={`flex justify-center items-center w-full ${baseStyle} ${isActive("/search-party") ? "text-[#E9927E]" : ""}`}
          >
            Messages
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href="/profile"
            className={`flex justify-center items-center w-full ${baseStyle} ${isActive("/profile") ? "text-[#E9927E]" : ""}`}
          >
            Account
          </Link>
        </li>
      </ul>
    </nav>
  );
};
