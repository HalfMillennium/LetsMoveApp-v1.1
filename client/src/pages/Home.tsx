import { useRef } from "react";
import { useLocation } from "wouter";
import MapBackground from "../components/MapBackground";
import SearchBar from "../components/SearchBar";
import {Navigation} from "../components/Navigation";

const Home = () => {
  const [, navigate] = useLocation();
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    if (query) {
      navigate(`/listings?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/listings");
    }
  };

  return (
    <>
      <MapBackground>
        <div className="container mx-auto px-4 pt-16 pb-4 flex flex-col items-center">
          <div className="w-full max-w-2xl text-center">
            <h2 className="text-[#1A4A4A] text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Hyper-local apartment search
            </h2>

            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="w-full max-w-2xl">
            <Navigation />
          </div>
        </div>
      </MapBackground>
    </>
  );
};

export default Home;
