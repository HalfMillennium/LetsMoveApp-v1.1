import { useEffect, useRef, useState } from "react";
import { Apartment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { MapPin, Minus, Plus } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getUserLocation, initializeRadar } from "@/lib/radarService";
import { COLORS, DEFAULT_COORDINATES } from "@/lib/constants";

interface RadarMapProps {
  apartments: Apartment[];
  onApartmentSelect?: (apartmentId: number) => void;
  selectedApartmentId?: number;
}

const RadarMap: React.FC<RadarMapProps> = ({
  apartments,
  onApartmentSelect,
  selectedApartmentId,
}) => {
  // Refs for DOM elements
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const apartmentMarkersRef = useRef<Map<number, any>>(new Map());

  // State for tracking user location and map status
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize Radar and map when component mounts
  useEffect(() => {
    // Initialize Radar SDK
    initializeRadar();

    // Get user's location
    const setupUserLocation = async () => {
      try {
        setIsLoading(true);
        const location = await getUserLocation();

        if (location) {
          setUserLocation(location);
        } else {
          // Fallback to default location if user location can't be determined
          setUserLocation(DEFAULT_COORDINATES);
          setError(
            "Unable to get your precise location. Showing default area instead.",
          );
        }
      } catch (err) {
        console.error("Error getting user location:", err);
        setError(
          "Unable to access your location. Showing default area instead.",
        );
        setUserLocation(DEFAULT_COORDINATES);
      } finally {
        setIsLoading(false);
      }
    };

    setupUserLocation();
  }, []);

  // Initialize map when user location is set
  useEffect(() => {
    if (!userLocation || !mapContainerRef.current || mapInitialized) return;

    try {
      // Create map instance using MapLibre directly
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              attribution: "© OpenStreetMap Contributors",
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 13,
      });

      mapRef.current = map;

      // Add user marker when map loads
      map.on("load", () => {
        // Create user marker element
        const userMarkerEl = document.createElement("div");
        userMarkerEl.className = "user-location-marker";
        userMarkerEl.style.width = "20px";
        userMarkerEl.style.height = "20px";
        userMarkerEl.style.borderRadius = "50%";
        userMarkerEl.style.backgroundColor = COLORS.teal;
        userMarkerEl.style.border = "3px solid white";
        userMarkerEl.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";

        // Add user location marker
        const userMarker = new maplibregl.Marker({
          element: userMarkerEl,
          anchor: "center",
        })
          .setLngLat([userLocation.longitude, userLocation.latitude])
          .addTo(map);

        userMarkerRef.current = userMarker;

        setMapInitialized(true);
      });

      // Clean up on unmount
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to initialize map. Please try refreshing the page.");
    }
  }, [userLocation, mapInitialized]);

  // Add apartment markers when map is initialized and apartments change
  useEffect(() => {
    if (!mapInitialized || !mapRef.current || !apartments.length) return;

    // Remove existing markers
    apartmentMarkersRef.current.forEach((marker) => marker.remove());
    apartmentMarkersRef.current.clear();

    // Add new markers for each apartment
    apartments.forEach((apt) => {
      try {
        // Create marker element
        const markerEl = document.createElement("div");
        markerEl.className = `apartment-marker ${apt.id === selectedApartmentId ? "selected" : ""}`;
        markerEl.style.width = "40px";
        markerEl.style.height = "40px";
        markerEl.style.borderRadius = "50%";
        markerEl.style.backgroundColor =
          apt.id === selectedApartmentId ? COLORS.coral : "#FF8C69";
        markerEl.style.display = "flex";
        markerEl.style.alignItems = "center";
        markerEl.style.justifyContent = "center";
        markerEl.style.cursor = "pointer";
        markerEl.style.transition = "all 0.2s ease";
        markerEl.style.boxShadow =
          apt.id === selectedApartmentId
            ? "0 4px 8px rgba(0, 0, 0, 0.2)"
            : "0 2px 4px rgba(0, 0, 0, 0.1)";
        markerEl.style.transform =
          apt.id === selectedApartmentId ? "scale(1.1)" : "scale(1)";

        // Add home icon
        const iconEl = document.createElement("div");
        iconEl.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';
        markerEl.appendChild(iconEl);

        // Add price badge for selected or hovered markers
        if (apt.id === selectedApartmentId) {
          const priceEl = document.createElement("div");
          priceEl.className = "price-badge";
          priceEl.textContent = `$${apt.price}`;
          priceEl.style.position = "absolute";
          priceEl.style.top = "-30px";
          priceEl.style.left = "50%";
          priceEl.style.transform = "translateX(-50%)";
          priceEl.style.backgroundColor = "white";
          priceEl.style.padding = "4px 8px";
          priceEl.style.borderRadius = "4px";
          priceEl.style.fontWeight = "bold";
          priceEl.style.color = COLORS.teal;
          priceEl.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          markerEl.appendChild(priceEl);
        }

        // Create and add marker to map using MapLibre
        const marker = new maplibregl.Marker({
          element: markerEl,
          anchor: "center",
        })
          .setLngLat([
            parseFloat(apt.longitude as string),
            parseFloat(apt.latitude as string),
          ])
          .addTo(mapRef.current);

        // Add click handler
        markerEl.addEventListener("click", () => {
          if (onApartmentSelect) {
            onApartmentSelect(apt.id);
          }
        });

        // Store reference to marker
        apartmentMarkersRef.current.set(apt.id, marker);
      } catch (err) {
        console.error(`Error adding marker for apartment ${apt.id}:`, err);
      }
    });
  }, [apartments, mapInitialized, selectedApartmentId, onApartmentSelect]);

  // Update marker styles when selected apartment changes
  useEffect(() => {
    if (!mapInitialized || !mapRef.current) return;

    apartmentMarkersRef.current.forEach((marker, aptId) => {
      const element = marker.getElement();
      if (element) {
        if (aptId === selectedApartmentId) {
          element.style.backgroundColor = COLORS.coral;
          element.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          element.style.transform = "scale(1.1)";

          // Add price badge if not already present
          if (!element.querySelector(".price-badge")) {
            const priceEl = document.createElement("div");
            priceEl.className = "price-badge";
            const apartment = apartments.find((apt) => apt.id === aptId);
            priceEl.textContent = `$${apartment?.price || ""}`;
            priceEl.style.position = "absolute";
            priceEl.style.top = "-30px";
            priceEl.style.left = "50%";
            priceEl.style.transform = "translateX(-50%)";
            priceEl.style.backgroundColor = "white";
            priceEl.style.padding = "4px 8px";
            priceEl.style.borderRadius = "4px";
            priceEl.style.fontWeight = "bold";
            priceEl.style.color = COLORS.teal;
            priceEl.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
            element.appendChild(priceEl);
          }

          // Pan map to selected apartment
          mapRef.current.panTo([
            parseFloat(
              apartments.find((apt) => apt.id === aptId)?.longitude || "0",
            ),
            parseFloat(
              apartments.find((apt) => apt.id === aptId)?.latitude || "0",
            ),
          ]);
        } else {
          element.style.backgroundColor = "#FF8C69";
          element.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          element.style.transform = "scale(1)";

          // Remove price badge if present
          const priceBadge = element.querySelector(".price-badge");
          if (priceBadge) {
            element.removeChild(priceBadge);
          }
        }
      }
    });
  }, [selectedApartmentId, apartments, mapInitialized]);

  // Zoom controls
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  // Reset map view to user location
  const handleResetView = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 13,
      });
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg shadow-md">
      {/* Map container */}
      <div ref={mapContainerRef} className="h-full w-full bg-[#FFF5E6]" />

      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          onClick={handleZoomIn}
          size="icon"
          variant="secondary"
          className="bg-white shadow-md hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleZoomOut}
          size="icon"
          variant="secondary"
          className="bg-white shadow-md hover:bg-gray-100"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleResetView}
          size="icon"
          variant="secondary"
          className="bg-white shadow-md hover:bg-gray-100"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E9927E] mx-auto"></div>
            <p className="mt-2 text-[#1A4A4A]">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md text-sm z-20 max-w-xs">
          <p className="text-amber-600">{error}</p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md text-xs z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#1A4A4A]"></div>
            <span>You</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#FF8C69]"></div>
            <span>Apartments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarMap;
