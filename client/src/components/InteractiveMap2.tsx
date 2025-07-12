import { useState, useEffect, useRef } from "react";
import { Apartment } from "../types";
import { useGeolocation } from "../lib/useGeolocation";
import { Button } from "@/components/ui/button";
import { Plus, Minus, CornerUpLeft, Building2 } from "lucide-react";

interface InteractiveMapProps {
  apartments: Apartment[];
  onApartmentSelect?: (apartmentId: number) => void;
  selectedApartmentId?: number;
}

// Map background color constants
const BG_COLOR = "#fae8d2";
const STREET_COLOR = "#f0d5b8";
const PARK_COLOR = "#c9e4d1";
const HOUSE_COLOR = "#ff8c69";
const HOUSE_WINDOW_COLOR = "#ffdab9";

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
    // For our example, we'll just distribute apartments evenly across the map
    const latNum = parseFloat(lat);
    const longNum = parseFloat(long);

    // Generate more predictable coordinates based on apartment id or location
    // This ensures pins are visible and spread across the map
    // We'll map the whole SVG viewport (800x600)
    if (lat === "40.7128" && long === "-74.0060") {
      return { x: 200, y: 150 }; // Downtown loft
    } else if (lat === "40.7357" && long === "-74.1724") {
      return { x: 400, y: 250 }; // Suburban home
    } else if (lat === "40.7488" && long === "-73.9857") {
      return { x: 600, y: 350 }; // Luxury apartment
    }

    // Default fallback if coordinates don't match known points
    const x = (((longNum + 75) * 150) % 750) + 50;
    const y = (((41 - latNum) * 800) % 550) + 50;

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
    setZoom((prevZoom) => Math.min(prevZoom + 0.2, 5));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.2, 0.2));
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

      {/* Map SVG */}
      <svg
        viewBox={viewBox}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background */}
        <rect width="100%" height="100%" fill={BG_COLOR} />

        <defs>
          <pattern
            id="map-pattern"
            x="0"
            y="0"
            width="800"
            height="600"
            patternUnits="userSpaceOnUse"
          >
            {/* Grid lines */}
            <g stroke={STREET_COLOR} strokeWidth="2">
              {/* Horizontal */}
              {Array.from({ length: 13 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
              ))}
              {/* Vertical */}
              {Array.from({ length: 17 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" />
              ))}
            </g>

            {/* Repeating square park blocks — safely inside boundaries */}
            <g>
              <rect
                x="100"
                y="100"
                width="80"
                height="80"
                rx="10"
                ry="10"
                fill={PARK_COLOR}
              />
              <rect
                x="300"
                y="300"
                width="80"
                height="80"
                rx="10"
                ry="10"
                fill={PARK_COLOR}
              />
              <rect
                x="500"
                y="100"
                width="80"
                height="80"
                rx="10"
                ry="10"
                fill={PARK_COLOR}
              />
              <rect
                x="100"
                y="400"
                width="80"
                height="80"
                rx="10"
                ry="10"
                fill={PARK_COLOR}
              />
            </g>

            {/* Generic house shapes aligned with grid */}
            <g>
              {[
                { x: 200, y: 120 },
                { x: 400, y: 360 },
                { x: 600, y: 200 },
              ].map((pos, idx) => (
                <g
                  key={`house-${idx}`}
                  transform={`translate(${pos.x}, ${pos.y})`}
                >
                  <path
                    d="M5,25 Q0,30 0,35 L0,55 Q0,60 5,60 L45,60 Q50,60 50,55 L50,35 Q50,30 45,25 L27,5 Q25,3 23,5 L5,25 Z"
                    fill={HOUSE_COLOR}
                  />
                  <rect
                    x="20"
                    y="45"
                    width="10"
                    height="15"
                    fill={HOUSE_WINDOW_COLOR}
                  />
                  <rect
                    x="10"
                    y="25"
                    width="8"
                    height="8"
                    fill={HOUSE_WINDOW_COLOR}
                  />
                </g>
              ))}
            </g>
          </pattern>
        </defs>

        {/* Repeating tiled background */}
        <rect
          x="-4000"
          y="-3000"
          width="8000"
          height="6000"
          fill="url(#map-pattern)"
        />

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

        {/* Apartment markers */}
        {apartments
          .filter((apt) => apt.latitude && apt.longitude)
          .map((apt) => {
          const { x, y } = convertLatLongToXY(apt.latitude!, apt.longitude!);
          const isSelected = apt.id === selectedApartmentId;
          const isHovered = apt.id === hoveredApartmentId;

          return (
            <g
              key={`apt-${apt.id}`}
              transform={`translate(${x}, ${y}) scale(${isSelected || isHovered ? 1.2 : 1})`}
              onClick={() => onApartmentSelect && onApartmentSelect(apt.id)}
              onMouseEnter={() => setHoveredApartmentId(apt.id)}
              onMouseLeave={() => setHoveredApartmentId(null)}
              style={{
                transition: "transform 0.2s ease",
                cursor: "pointer",
              }}
            >
              {/* Marker background */}
              <circle
                r="24"
                fill={isSelected ? "#E9927E" : "#ff8c69"}
                opacity={isSelected ? 1 : 0.9}
                style={{
                  filter: isSelected
                    ? "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    : "none",
                }}
              />

              {/* Home icon */}
              <g transform="translate(-12, -12)">
                <rect x="0" y="0" width="24" height="24" fill="none" />
                <Building2 color="#212121" />
              </g>

              {/* Price Label */}
              {(isSelected || isHovered) && (
                <g transform="translate(0, -40)">
                  <rect
                    x="-35"
                    y="-15"
                    width="70"
                    height="30"
                    rx="5"
                    fill="white"
                    style={{
                      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                    }}
                  />
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1A4A4A"
                    fontWeight="bold"
                    fontSize="14px"
                  >
                    ${apt.price}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

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
