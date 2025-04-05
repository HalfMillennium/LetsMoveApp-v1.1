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
  CornerUpLeft
} from "lucide-react";

interface InteractiveMapProps {
  apartments: Apartment[];
  onApartmentSelect?: (apartmentId: number) => void;
  selectedApartmentId?: number;
}

const InteractiveMap = ({ 
  apartments, 
  onApartmentSelect,
  selectedApartmentId 
}: InteractiveMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { coordinates, loading, error } = useGeolocation();
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<{ x: number, y: number }>({ x: 400, y: 300 }); // Center of our SVG viewBox
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [hoveredApartmentId, setHoveredApartmentId] = useState<number | null>(null);

  // Convert lat/long to x,y coordinates in our SVG coordinate system
  const convertLatLongToXY = (lat: string, long: string): { x: number, y: number } => {
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
        coordinates.longitude.toString()
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
        y: e.clientY - rect.top 
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
      y: center.y - deltaY
    });
    
    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.2, 0.5));
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
            <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-3">
              <p>{error}</p>
            </div>
            <p className="text-[#1A4A4A]">Unable to access your location. The map will display example locations instead.</p>
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
        {/* Background Map */}
        <image
          href="data:image/svg+xml;base64,PHN2ZyBzdHlsZT0ib3BhY2l0eTogMC41OyIgdmlld0JveD0iMCAwIDgwMCA2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwhLS1CYWNrZ3JvdW5kIHdpdGggY3JlYW0vYmVpZ2UgY29sb3ItLT4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmFlOGQyIi8+CjwhLS1HcmlkIHBhdHRlcm4gZm9yIHN0cmVldHMtLT4KICA8ZyBpZD0ic3RyZWV0LWdyaWQiIHN0cm9rZT0iI2YwZDViOCIgc3Ryb2tlLXdpZHRoPSI0Ij4KPCEtLUhvcml6b250YWwgc3RyZWV0cy0tPgogICAgPGxpbmUgeDE9IjAiIHkxPSI1MCIgeDI9IjgwMCIgeTI9IjUwIi8+CiAgICA8bGluZSB4MT0iMCIgeTE9IjE1MCIgeDI9IjgwMCIgeTI9IjE1MCIvPgogICAgPGxpbmUgeDE9IjAiIHkxPSIyNTAiIHgyPSI4MDAiIHkyPSIyNTAiLz4KICAgIDxsaW5lIHgxPSIwIiB5MT0iMzUwIiB4Mj0iODAwIiB5Mj0iMzUwIi8+CiAgICA8bGluZSB4MT0iMCIgeTE9IjQ1MCIgeDI9IjgwMCIgeTI9IjQ1MCIvPgogICAgPGxpbmUgeDE9IjAiIHkxPSI1NTAiIHgyPSI4MDAiIHkyPSI1NTAiLz4KPCEtLVZlcnRpY2FsIHN0cmVldHMtLT4KICAgIDxsaW5lIHgxPSI1MCIgeTE9IjAiIHgyPSI1MCIgeTI9IjYwMCIvPgogICAgPGxpbmUgeDE9IjE1MCIgeTE9IjAiIHgyPSIxNTAiIHkyPSI2MDAiLz4KICAgIDxsaW5lIHgxPSIyNTAiIHkxPSIwIiB4Mj0iMjUwIiB5Mj0iNjAwIi8+CiAgICA8bGluZSB4MT0iMzUwIiB5MT0iMCIgeDI9IjM1MCIgeTI9IjYwMCIvPgogICAgPGxpbmUgeDE9IjQ1MCIgeTE9IjAiIHgyPSI0NTAiIHkyPSI2MDAiLz4KICAgIDxsaW5lIHgxPSI1NTAiIHkxPSIwIiB4Mj0iNTUwIiB5Mj0iNjAwIi8+CiAgICA8bGluZSB4MT0iNjUwIiB5MT0iMCIgeDI9IjY1MCIgeTI9IjYwMCIvPgogICAgPGxpbmUgeDE9Ijc1MCIgeTE9IjAiIHgyPSI3NTAiIHkyPSI2MDAiLz4KICA8L2c+CjwhLS1DdXJ2ZWQgcm9hZHMtLT4KICA8cGF0aCBkPSJNIDAsMTAwIFEgMTAwLDEwMCAxMDAsMjAwIEwgMTAwLDYwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjBkNWI4IiBzdHJva2Utd2lkdGg9IjQiLz4KICA8cGF0aCBkPSJNIDI4MCw2MDAgUSAyODAsNTAwIDM1MCw1MDAgTCA4MDAsNTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmMGQ1YjgiIHN0cm9rZS13aWR0aD0iNCIvPgo8IS0tR3JlZW4gc3BhY2VzIChwYXJrcyktLT4KICA8cmVjdCB4PSIxNzAiIHk9IjcwIiB3aWR0aD0iNjAiIGhlaWdodD0iMTAwIiByeD0iMTAiIHJ5PSIxMCIgZmlsbD0iI2M5ZTRkMSIvPgogIDxyZWN0IHg9IjY3MCIgeT0iNzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMCIgcnk9IjEwIiBmaWxsPSIjYzllNGQxIi8+CiAgPHJlY3QgeD0iMzcwIiB5PSIyNzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMCIgcnk9IjEwIiBmaWxsPSIjYzllNGQxIi8+CiAgPHJlY3QgeD0iNTcwIiB5PSIzNzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMCIgcnk9IjEwIiBmaWxsPSIjYzllNGQxIi8+CiAgPHJlY3QgeD0iNzIwIiB5PSIzNzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMCIgcnk9IjEwIiBmaWxsPSIjYzllNGQxIi8+CiAgPHJlY3QgeD0iMjcwIiB5PSI0NzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMCIgcnk9IjEwIiBmaWxsPSIjYzllNGQxIi8+CiAgPHJlY3QgeD0iNzAiIHk9IjM3MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwMCIgcng9IjEwIiByeT0iMTAiIGZpbGw9IiNjOWU0ZDEiLz4KPCEtLUhvdXNlcy0tPgo8IS0tSG91c2UgMS0tPgogIDxnIGNsYXNzPSJob3VzZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwLCA4MCkiPgogICAgPHBhdGggZD0iCiAgICAgICAgICAgICAgICAgICAgICAgIE01LDI1IAogICAgICAgICAgICAgICAgICAgICAgICBRMCwzMCAwLDM1IAogICAgICAgICAgICAgICAgICAgICAgICBMMCw1NSAKICAgICAgICAgICAgICAgICAgICAgICAgUTAsNjAgNSw2MCAKICAgICAgICAgICAgICAgICAgICAgICAgTDQ1LDYwIAogICAgICAgICAgICAgICAgICAgICAgICBRNTAsNjAgNTAsNTUgCiAgICAgICAgICAgICAgICAgICAgICAgIEw1MCwzNSAKICAgICAgICAgICAgICAgICAgICAgICAgUTUwLDMwIDQ1LDI1IAogICAgICAgICAgICAgICAgICAgICAgICBMMjcsNSAKICAgICAgICAgICAgICAgICAgICAgICAgUTI1LDMgMjMsNSAKICAgICAgICAgICAgICAgICAgICAgICAgTDUsMjUgCiAgICAgICAgICAgICAgICAgICAgICAgIFoiIGZpbGw9IiNmZjhjNjkiLz4KICAgIDxyZWN0IHg9IjIwIiB5PSI0NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjZmZkYWI5Ii8+CiAgICA8cmVjdCB4PSIxMCIgeT0iMjUiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmRhYjkiLz4KICA8L2c+CjwhLS1Ib3VzZSAyLS0+CiAgPGcgY2xhc3M9ImhvdXNlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyODAsIDcwKSI+CiAgICA8cGF0aCBkPSIKICAgICAgICAgICAgICAgICAgICAgICAgTTUsMjUgCiAgICAgICAgICAgICAgICAgICAgICAgIFEwLDMwIDAsMzUgCiAgICAgICAgICAgICAgICAgICAgICAgIEwwLDU1IAogICAgICAgICAgICAgICAgICAgICAgICBRMCw2MCA1LDYwIAogICAgICAgICAgICAgICAgICAgICAgICBMNDUsNjAgCiAgICAgICAgICAgICAgICAgICAgICAgIFE1MCw2MCA1MCw1NSAKICAgICAgICAgICAgICAgICAgICAgICAgTDUwLDM1IAogICAgICAgICAgICAgICAgICAgICAgICBRNTAsMzAgNDUsMjUgCiAgICAgICAgICAgICAgICAgICAgICAgIEwyNyw1IAogICAgICAgICAgICAgICAgICAgICAgICBRMjUsMyAyMyw1IAogICAgICAgICAgICAgICAgICAgICAgICBMNSwyNSAKICAgICAgICAgICAgICAgICAgICAgICAgWiIgZmlsbD0iI2ZmOGM2OSIvPgogICAgPHJlY3QgeD0iMjAiIHk9IjQ1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTUiIGZpbGw9IiNmZmRhYjkiLz4KICAgIDxyZWN0IHg9IjEwIiB5PSIyNSIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iI2ZmZGFiOSIvPgogIDwvZz4KPCEtLUhvdXNlIDMtLT4KICA8ZyBjbGFzcz0iaG91c2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4MCwgMTMwKSI+CiAgICA8cGF0aCBkPSIKICAgICAgICAgICAgICAgICAgICAgICAgTTUsMjUgCiAgICAgICAgICAgICAgICAgICAgICAgIFEwLDMwIDAsMzUgCiAgICAgICAgICAgICAgICAgICAgICAgIEwwLDU1IAogICAgICAgICAgICAgICAgICAgICAgICBRMCw2MCA1LDYwIAogICAgICAgICAgICAgICAgICAgICAgICBMNDUsNjAgCiAgICAgICAgICAgICAgICAgICAgICAgIFE1MCw2MCA1MCw1NSAKICAgICAgICAgICAgICAgICAgICAgICAgTDUwLDM1IAogICAgICAgICAgICAgICAgICAgICAgICBRNTAsMzAgNDUsMjUgCiAgICAgICAgICAgICAgICAgICAgICAgIEwyNyw1IAogICAgICAgICAgICAgICAgICAgICAgICBRMjUsMyAyMyw1IAogICAgICAgICAgICAgICAgICAgICAgICBMNSwyNSAKICAgICAgICAgICAgICAgICAgICAgICAgWiIgZmlsbD0iI2ZmOGM2OSIvPgogICAgPHJlY3QgeD0iMjAiIHk9IjQ1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTUiIGZpbGw9IiNmZmRhYjkiLz4KICAgIDxyZWN0IHg9IjEwIiB5PSIyNSIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iI2ZmZGFiOSIvPgogICAgPHJlY3QgeD0iMzIiIHk9IjI1IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZkYWI5Ii8+CiAgPC9nPgo8IS0tSG91c2UgNC0tPgogIDxnIGNsYXNzPSJob3VzZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzgwLCAxNzApIj4KICAgIDxwYXRoIGQ9IgogICAgICAgICAgICAgICAgICAgICAgICBNNSwyNSAKICAgICAgICAgICAgICAgICAgICAgICAgUTAsMzAgMCwzNSAKICAgICAgICAgICAgICAgICAgICAgICAgTDAsNTUgCiAgICAgICAgICAgICAgICAgICAgICAgIFEwLDYwIDUsNjAgCiAgICAgICAgICAgICAgICAgICAgICAgIEw0NSw2MCAKICAgICAgICAgICAgICAgICAgICAgICAgUTUwLDYwIDUwLDU1IAogICAgICAgICAgICAgICAgICAgICAgICBMNTAsMzUgCiAgICAgICAgICAgICAgICAgICAgICAgIFE1MCwzMCA0NSwyNSAKICAgICAgICAgICAgICAgICAgICAgICAgTDI3LDUgCiAgICAgICAgICAgICAgICAgICAgICAgIFEyNSwzIDIzLDUgCiAgICAgICAgICAgICAgICAgICAgICAgIEw1LDI1IAogICAgICAgICAgICAgICAgICAgICAgICBaIiBmaWxsPSIjZmY4YzY5Ii8+CiAgICA8cmVjdCB4PSIyMCIgeT0iNDUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxNSIgZmlsbD0iI2ZmZGFiOSIvPgogICAgPHJlY3QgeD0iMTAiIHk9IjI1IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZkYWI5Ii8+CiAgPC9nPgo8IS0tSG91c2UgNS0tPgogIDxnIGNsYXNzPSJob3VzZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTgwLCAyMDApIj4KICAgIDxwYXRoIGQ9IgogICAgICAgICAgICAgICAgICAgICAgICBNNSwyNSAKICAgICAgICAgICAgICAgICAgICAgICAgUTAsMzAgMCwzNSAKICAgICAgICAgICAgICAgICAgICAgICAgTDAsNTUgCiAgICAgICAgICAgICAgICAgICAgICAgIFEwLDYwIDUsNjAgCiAgICAgICAgICAgICAgICAgICAgICAgIEw0NSw2MCAKICAgICAgICAgICAgICAgICAgICAgICAgUTUwLDYwIDUwLDU1IAogICAgICAgICAgICAgICAgICAgICAgICBMNTAsMzUgCiAgICAgICAgICAgICAgICAgICAgICAgIFE1MCwzMCA0NSwyNSAKICAgICAgICAgICAgICAgICAgICAgICAgTDI3LDUgCiAgICAgICAgICAgICAgICAgICAgICAgIFEyNSwzIDIzLDUgCiAgICAgICAgICAgICAgICAgICAgICAgIEw1LDI1IAogICAgICAgICAgICAgICAgICAgICAgICBaIiBmaWxsPSIjZmY4YzY5Ii8+CiAgICA8cmVjdCB4PSIyMCIgeT0iNDUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxNSIgZmlsbD0iI2ZmZGFiOSIvPgogICAgPHJlY3QgeD0iMTAiIHk9IjI1IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZkYWI5Ii8+CiAgPC9nPgo8IS0tSG91c2UgNi0tPgogIDxnIGNsYXNzPSJob3VzZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjgwLCAyNzApIj4KICAgIDxwYXRoIGQ9IgogICAgICAgICAgICAgICAgICAgICAgICBNNSwyNSAKICAgICAgICAgICAgICAgICAgICAgICAgUTAsMzAgMCwzNSAKICAgICAgICAgICAgICAgICAgICAgICAgTDAsNTUgCiAgICAgICAgICAgICAgICAgICAgICAgIFEwLDYwIDUsNjAgCiAgICAgICAgICAgICAgICAgICAgICAgIEw0NSw2MCAKICAgICAgICAgICAgICAgICAgICAgICAgUTUwLDYwIDUwLDU1IAogICAgICAgICAgICAgICAgICAgICAgICBMNTAsMzUgCiAgICAgICAgICAgICAgICAgICAgICAgIFE1MCwzMCA0NSwyNSAKICAgICAgICAgICAgICAgICAgICAgICAgTDI3LDUgCiAgICAgICAgICAgICAgICAgICAgICAgIFEyNSwzIDIzLDUgCiAgICAgICAgICAgICAgICAgICAgICAgIEw1LDI1IAogICAgICAgICAgICAgICAgICAgICAgICBaIiBmaWxsPSIjZmY4YzY5Ii8+CiAgICA8cmVjdCB4PSIyMCIgeT0iNDUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxNSIgZmlsbD0iI2ZmZGFiOSIvPgogICAgPHJlY3QgeD0iMTAiIHk9IjI1IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZkYWI5Ii8+CiAgPC9nPgo8IS0tSG91c2UgNy0tPgogIDxnIGNsYXNzPSJob3VzZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjcwLCAyNTApIj4KICAgIDxwYXRoIGQ9IgogICAgICAgICAgICAgICAgICAgICAgICBNNSwyNSAKICAgICAgICAgICAgICAgICAgICAgICAgUTAsMzAgMCwzNSAKICAgICAgICAgICAgICAgICAgICAgICAgTDAsNTUgCiAgICAgICAgICAgICAgICAgICAgICAgIFEwLDYwIDUsNjAgCiAgICAgICAgICAgICAgICAgICAgICAgIEw0NSw2MCAKICAgICAgICAgICAgICAgICAgICAgICAgUTUwLDYwIDUwLDU1IAogICAgICAgICAgICAgICAgICAgICAgICBMNTAsMzUgCiAgICAgICAgICAgICAgICAgICAgICAgIFE1MCwzMCA0NSwyNSAKICAgICAgICAgICAgICAgICAgICAgICAgTDI3LDUgCiAgICAgICAgICAgICAgICAgICAgICAgIFEyNSwzIDIzLDUgCiAgICAgICAgICAgICAgICAgICAgICAgIEw1LDI1IAogICAgICAgICAgICAgICAgICAgICAgICBaIiBmaWxsPSIjZmY4YzY5Ii8+CiAgICA8cmVjdCB4PSIyMCIgeT0iNDUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxNSIgZmlsbD0iI2ZmZGFiOSIvPgogICAgPHJlY3QgeD0iMTAiIHk9IjI1IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZkYWI5Ii8+CiAgICA8cmVjdCB4PSIzMiIgeT0iMjUiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmRhYjkiLz4KICA8L2c+CjwhLS1Ib3VzZSA4LS0+CiAgPGcgY2xhc3M9ImhvdXNlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzAsIDM0MCkiPgogICAgPHBhdGggZD0iCiAgICAgICAgICAgICAgICAgICAgICAgIE01LDI1IAogICAgICAgICAgICAgICAgICAgICAgICBRMCwzMCAwLDM1IAogICAgICAgICAgICAgICAgICAgICAgICBMMCw1NSAKICAgICAgICAgICAgICAgICAgICAgICAgUTAsNjAgNSw2MCAKICAgICAgICAgICAgICAgICAgICAgICAgTDQ1LDYwIAogICAgICAgICAgICAgICAgICAgICAgICBRNTAsNjAgNTAsNTUgCiAgICAgICAgICAgICAgICAgICAgICAgIEw1MCwzNSAKICAgICAgICAgICAgICAgICAgICAgICAgUTUwLDMwIDQ1LDI1IAogICAgICAgICAgICAgICAgICAgICAgICBMMjcsNSAKICAgICAgICAgICAgICAgICAgICAgICAgUTI1LDMgMjMsNSAKICAgICAgICAgICAgICAgICAgICAgICAgTDUsMjUgCiAgICAgICAgICAgICAgICAgICAgICAgIFoiIGZpbGw9IiNmZjhjNjkiLz4KICAgIDxyZWN0IHg9IjIwIiB5PSI0NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjZmZkYWI5Ii8+CiAgICA8cmVjdCB4PSIxMCIgeT0iMjUiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmRhYjkiLz4KICA8L2c+CjwhLS1Ib3VzZSA5LS0+CiAgPGcgY2xhc3M9ImhvdXNlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MDAsIDQwMCkiPgogICAgPHBhdGggZD0iCiAgICAgICAgICAgICAgICAgICAgICAgIE01LDI1IAogICAgICAgICAgICAgICAgICAgICAgICBRMCwzMCAwLDM1IAogICAgICAgICAgICAgICAgICAgICAgICBMMCw1NSAKICAgICAgICAgICAgICAgICAgICAgICAgUTAsNjAgNSw2MCAKICAgICAgICAgICAgICAgICAgICAgICAgTDQ1LDYwIAogICAgICAgICAgICAgICAgICAgICAgICBRNTAsNjAgNTAsNTUgCiAgICAgICAgICAgICAgICAgICAgICAgIEw1MCwzNSAKICAgICAgICAgICAgICAgICAgICAgICAgUTUwLDMwIDQ1LDI1IAogICAgICAgICAgICAgICAgICAgICAgICBMMjcsNSAKICAgICAgICAgICAgICAgICAgICAgICAgUTI1LDMgMjMsNSAKICAgICAgICAgICAgICAgICAgICAgICAgTDUsMjUgCiAgICAgICAgICAgICAgICAgICAgICAgIFoiIGZpbGw9IiNmZjhjNjkiLz4KICAgIDxyZWN0IHg9IjIwIiB5PSI0NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjZmZkYWI5Ii8+CiAgICA8cmVjdCB4PSIxMCIgeT0iMjUiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmRhYjkiLz4KICA8L2c+Cjwvc3ZnPgo="
          x="0"
          y="0"
          width="800"
          height="600"
        />

        {/* User Location Marker */}
        {coordinates && (
          <g 
            transform={`translate(${convertLatLongToXY(
              coordinates.latitude.toString(),
              coordinates.longitude.toString()
            ).x}, ${convertLatLongToXY(
              coordinates.latitude.toString(),
              coordinates.longitude.toString()
            ).y})`}
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
              className={`transition-transform duration-200 cursor-pointer ${isSelected ? 'drop-shadow-lg' : ''}`}
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
              <Home className="w-6 h-6 -translate-x-3 -translate-y-3" stroke="#FFF" strokeWidth={2} />
              
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