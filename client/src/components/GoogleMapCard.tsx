import React, { useRef, useEffect } from "react";

export const GoogleMapCard: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDAGlko3aGJd4-ZvYy20QydYWrl_QwRNBo`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeMap();
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  const initializeMap = () => {
    if (window.google && mapRef.current) {
      // Coordinates for Brooklyn, NY
      const brooklyn = { lat: 40.6782, lng: -73.9442 };

      // Initialize the map centered on Brooklyn
      const map = new window.google.maps.Map(mapRef.current, {
        center: brooklyn,
        zoom: 12,
      });

      // Add a marker for Brooklyn
      new window.google.maps.Marker({
        position: brooklyn,
        map,
        title: "Brooklyn, NY",
      });
    }
  };

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default Map;
