import { Link } from "wouter";
import { Mail } from "lucide-react";

const HomeFooter = () => {
  return (
    <div className="container mx-auto px-4 bg-[#0D2436]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
        {/* Logo and Tagline */}
        <div className="md:col-span-1">
          <h3 className="text-[#F9A775] text-2xl font-bold mb-4">letsmove</h3>
          <p className="text-sm text-gray-300 mb-6">
            Find your ideal apartment with personalized, hyper-local search
            results.
          </p>
        </div>

        {/* Explore Links */}
        <div className="md:col-span-1">
          <h4 className="text-white font-medium mb-4">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/listings"
                className="text-gray-300 hover:text-[#F9A775] text-sm"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                href="/neighborhoods"
                className="text-gray-300 hover:text-[#F9A775] text-sm"
              >
                Neighborhoods
              </Link>
            </li>
            <li>
              <Link
                href="/buildings"
                className="text-gray-300 hover:text-[#F9A775] text-sm"
              >
                Buildings
              </Link>
            </li>
            <li>
              <Link
                href="/points"
                className="text-gray-300 hover:text-[#F9A775] text-sm"
              >
                Search Points
              </Link>
            </li>
          </ul>
        </div>

        {/* About Links */}
        <div className="md:col-span-1">
          <h4 className="text-white font-medium mb-4">About</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/story"
                className="text-gray-300 hover:text-[#F9A775] text-sm"
              >
                Our Story
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-gray-300 hover:text-[#F9A775] text-sm"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/help"
                className="text-gray-300 hover:text-[#F9A775] text-sm"
              >
                Help & Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Stay Updated */}
        <div className="md:col-span-1">
          <h4 className="text-white font-medium mb-4">Stay Updated</h4>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 bg-[#1A3347] text-white rounded-l-md border-r-0 border border-[#2D4255] focus:outline-none focus:border-[#F9A775] text-sm w-full"
            />
            <button
              className="bg-[#F9A775] text-[#0D2436] rounded-r-md px-3 flex items-center justify-center"
              aria-label="Subscribe"
            >
              <Mail size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2D4255] mt-10 pt-6 text-xs text-gray-400">
        <p>© {new Date().getFullYear()} letsmove. All rights reserved.</p>
      </div>
    </div>
  );
};

export default HomeFooter;
