import { useState, useEffect, useRef } from "react";
import { Apartment } from "../types";
import { useGeolocation } from "../lib/useGeolocation";
import { mapBgImage } from "../assets/map_bg.ts";
import { Button } from "@/components/ui/button";
import {
  Home,
  MapPin,
  Navigation,
  Plus,
  Minus,
  CornerUpLeft,
} from "lucide-react";

interface InteractiveMapProps {
  apartments: Apartment[];
  onApartmentSelect?: (apartmentId: number) => void;
  selectedApartmentId?: number;
}

const InteractiveMap = ({
  apartments,
  onApartmentSelect,
  selectedApartmentId,
}: InteractiveMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { coordinates, loading, error } = useGeolocation();
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<{ x: number; y: number }>({
    x: 400,
    y: 300,
  }); // Center of our SVG viewBox
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [hoveredApartmentId, setHoveredApartmentId] = useState<number | null>(
    null,
  );

  // Convert lat/long to x,y coordinates in our SVG coordinate system
  const convertLatLongToXY = (
    lat: string,
    long: string,
  ): { x: number; y: number } => {
    // This is a simplified conversion - in a real map app, you'd use proper projection
    // For our example, we'll map it to our 800x600 SVG viewport
    const latNum = parseFloat(lat);
    const longNum = parseFloat(long);

    // Baseline our example data around a central point - using a simple linear mapping
    // These values would need to be adjusted based on your data's geographic spread
    const x = ((longNum + 74) * 200) % 800; // Simple mapping to keep pins on the map
    const y = ((40.8 - latNum) * 1000) % 600; // Simple mapping to keep pins on the map

    return { x, y };
  };

  // Center map on user's location when available
  useEffect(() => {
    if (coordinates) {
      const userPosition = convertLatLongToXY(
        coordinates.latitude.toString(),
        coordinates.longitude.toString(),
      );
      setCenter(userPosition);
    }
  }, [coordinates]);

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = (x - dragStart.x) / zoom;
    const deltaY = (y - dragStart.y) / zoom;

    setCenter({
      x: center.x - deltaX,
      y: center.y - deltaY,
    });

    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.2, 0.5));
  };

  // Reset view to initial position
  const handleResetView = () => {
    setZoom(1);
    setCenter({ x: 400, y: 300 });
  };

  // Calculate viewBox based on center and zoom
  const viewBoxWidth = 800 / zoom;
  const viewBoxHeight = 600 / zoom;
  const viewBoxX = center.x - viewBoxWidth / 2;
  const viewBoxY = center.y - viewBoxHeight / 2;
  const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#FFF5E6] rounded-lg shadow-md"
      ref={mapContainerRef}
    >
      {/* Map Controls */}
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
          <CornerUpLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E9927E] mx-auto"></div>
            <p className="mt-2 text-[#1A4A4A]">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
          <div className="text-center p-4 max-w-md">
            <div className="text-red-800 p-3 rounded-lg mb-3">
              <p>{error}</p>
            </div>
            <p className="text-[#1A4A4A]">
              Unable to access your location. The map will display example
              locations instead.
            </p>
          </div>
        </div>
      )}

      {/* User Location Marker */}
      {coordinates && (
        <g
          transform={`translate(${
            convertLatLongToXY(
              coordinates.latitude.toString(),
              coordinates.longitude.toString(),
            ).x
          }, ${
            convertLatLongToXY(
              coordinates.latitude.toString(),
              coordinates.longitude.toString(),
            ).y
          })`}
          className="animate-pulse"
        >
          <circle r="10" fill="#1A4A4A" opacity="0.3" />
          <circle r="5" fill="#1A4A4A" />
        </g>
      )}

      {/* Apartment Markers */}
      {apartments.map((apt) => {
        const { x, y } = convertLatLongToXY(apt.latitude, apt.longitude);
        const isSelected = apt.id === selectedApartmentId;
        const isHovered = apt.id === hoveredApartmentId;
        const size = isSelected || isHovered ? 1.3 : 1;

        return (
          <g
            key={apt.id}
            transform={`translate(${x}, ${y}) scale(${size})`}
            className={`transition-transform duration-200 cursor-pointer ${isSelected ? "drop-shadow-lg" : ""}`}
            onClick={() => onApartmentSelect && onApartmentSelect(apt.id)}
            onMouseEnter={() => setHoveredApartmentId(apt.id)}
            onMouseLeave={() => setHoveredApartmentId(null)}
          >
            <circle
              r="18"
              fill={isSelected ? "#E9927E" : "#ff8c69"}
              opacity={isSelected ? "1" : "0.7"}
              className="transition-all duration-200"
            />
            <Home
              className="w-6 h-6 -translate-x-3 -translate-y-3"
              stroke="#FFF"
              strokeWidth={2}
            />

            {/* Price Label */}
            {(isSelected || isHovered) && (
              <g transform="translate(0, -30)">
                <rect
                  x="-30"
                  y="-12"
                  width="60"
                  height="24"
                  rx="4"
                  fill="white"
                  className="drop-shadow-md"
                />
                <text
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="#1A4A4A"
                  fontWeight="bold"
                  fontSize="10"
                >
                  ${apt.price}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Mobile Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md text-xs md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#1A4A4A]"></div>
            <span>You</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#ff8c69]"></div>
            <span>Apartments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
