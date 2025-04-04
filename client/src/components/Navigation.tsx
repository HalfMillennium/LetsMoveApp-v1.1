import { Link, useLocation } from 'wouter';

const Navigation = () => {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav className="w-full">
      <ul className="flex justify-between text-[#1A4A4A] text-lg">
        <li>
          <Link href="/favorites">
            <a className={`py-2 px-4 font-medium ${isActive('/favorites') ? 'text-[#E9927E]' : ''}`}>
              Favorites
            </a>
          </Link>
        </li>
        <li>
          <Link href="/search-party">
            <a className={`py-2 px-4 font-medium ${isActive('/search-party') ? 'text-[#E9927E]' : ''}`}>
              Messages
            </a>
          </Link>
        </li>
        <li>
          <Link href="/profile">
            <a className={`py-2 px-4 font-medium ${isActive('/profile') ? 'text-[#E9927E]' : ''}`}>
              Account
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
