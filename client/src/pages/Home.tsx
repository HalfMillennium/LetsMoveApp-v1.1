import { useLocation } from "wouter";
import MapBackground from "../components/MapBackground";
import SearchBar from "../components/SearchBar";
import { Navigation } from "../components/Navigation";
import { useRef, useEffect } from "react";

const Home = () => {
  const [, navigate] = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    if (query) {
      navigate(`/listings?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/listings");
    }
  };

  // Simple manual animation function with CSS transitions
  useEffect(() => {
    // Set initial styles with delay
    setTimeout(() => {
      if (headingRef.current) {
        headingRef.current.style.opacity = '1';
        headingRef.current.style.transform = 'translateY(0)';
      }
    }, 300);
    
    setTimeout(() => {
      if (searchBarRef.current) {
        searchBarRef.current.style.opacity = '1';
        searchBarRef.current.style.transform = 'translateY(0)';
      }
    }, 800);
    
    setTimeout(() => {
      if (navigationRef.current) {
        navigationRef.current.style.opacity = '1';
      }
    }, 1200);
  }, []);

  return (
    <MapBackground variant="cityscape">
      <div className="container mx-auto px-4 py-16 md:py-28 flex flex-col items-center">
        {/* Card Container */}
        <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#8A3F4B]/30">
          {/* Header with blurred background */}
          <div className="relative w-full bg-[#46243C]/80 backdrop-blur-md p-6 border-b border-[#8A3F4B]/40">
            <h1 
              ref={headingRef}
              className="text-[#F2D7B6] text-clamp-4xl font-bold font-primary opacity-0 transform -translate-y-4 transition-all duration-700 text-center"
            >
              Find Your Place
            </h1>
          </div>
          
          {/* Main Content */}
          <div className="w-full bg-[#1E101C]/90 backdrop-blur-sm p-8 text-center">
            <h2 className="text-[#FFEFD4] text-clamp-3xl font-medium mb-8 leading-clamp-normal font-primary">
              Together in the city
            </h2>

            {/* Search Bar (Dark Mode) */}
            <div ref={searchBarRef} className="mb-8 opacity-0 transform translate-y-4 transition-all duration-700">
              <SearchBar onSearch={handleSearch} darkMode={true} />
            </div>

            {/* Navigation Buttons */}
            <div ref={navigationRef} className="w-full max-w-xl mx-auto mb-6 opacity-0 transition-opacity duration-700">
              <Navigation darkMode={true} />
            </div>
            
            {/* Call to Action Button */}
            <button 
              onClick={() => navigate("/listings")}
              className="mt-6 px-8 py-3 bg-[#C25B55] hover:bg-[#D46A60] text-white font-medium rounded-full transition-colors duration-300 flex items-center justify-center mx-auto"
            >
              <span className="mr-2">+</span> Explore Listings
            </button>
          </div>
        </div>
      </div>
    </MapBackground>
  );
};

export default Home;
