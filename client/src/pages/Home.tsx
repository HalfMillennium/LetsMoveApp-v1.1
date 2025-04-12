import { useLocation } from "wouter";
import MapBackground from "../components/MapBackground";
import SearchBar from "../components/SearchBar";
import { Navigation } from "../components/Navigation";
import HomeFooter from "../components/HomeFooter";

const Home = () => {
  const [, navigate] = useLocation();

  const handleSearch = (query: string) => {
    if (query) {
      navigate(`/listings?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/listings");
    }
  };

  const footer = <HomeFooter />;

  return (
    <MapBackground variant="cityscape" footer={footer}>
      <div className="container mx-auto px-4 py-16 md:py-28 flex flex-col items-center">
        {/* Main Content */}
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-[#FFEFD4] text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Hyper-local<br />apartment search
          </h1>
          
          {/* Search Bar (Dark Mode) */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} darkMode={true} />
          </div>
          
          {/* Navigation Buttons */}
          <div className="w-full max-w-xl mx-auto mb-16">
            <Navigation darkMode={true} />
          </div>
        </div>
      </div>
    </MapBackground>
  );
};

export default Home;
