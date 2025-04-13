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
        {/* Main Content */}
        <div className="w-full max-w-3xl text-center">
          <h1 
            ref={headingRef}
            className="text-[#FFEFD4] text-5xl md:text-7xl font-bold mb-8 leading-tight opacity-0 transform -translate-y-4 transition-all duration-700"
          >
            Find your place—
            <br />
            together in the city
          </h1>

          {/* Search Bar (Dark Mode) */}
          <div ref={searchBarRef} className="mb-8 opacity-0 transform translate-y-4 transition-all duration-700">
            <SearchBar onSearch={handleSearch} darkMode={true} />
          </div>

          {/* Navigation Buttons */}
          <div ref={navigationRef} className="w-full max-w-xl mx-auto mb-16 opacity-0 transition-opacity duration-700">
            <Navigation darkMode={true} />
          </div>
        </div>
      </div>
    </MapBackground>
  );
};

export default Home;
