import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  OverlayView,
  DrawingManager,
} from "@react-google-maps/api";
import { Apartment } from "../types";
import { Building, Pin, Edit3, X, Map as MapIcon } from "lucide-react";
import { COLORS, MAP_STYLES, MapStyleTypes } from "@/lib/constants";
import { Button } from "@/components/ui/button";

// Map container style
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: 10,
};

// Default map center (will be updated with user's location)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.006, // New York coordinates as default
};

// Map options
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  styles: MAP_STYLES[MapStyleTypes.NEUTRAL],
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: true,
  rotateControl: false,
  fullscreenControl: true,
};

interface GoogleMapComponentProps {
  apartments: Apartment[];
  onApartmentSelect?: (apartmentId: number) => void;
  selectedApartmentId?: number;
}

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  apartments,
  onApartmentSelect,
  selectedApartmentId: _selectedApartmentId,
}) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null,
  );
  const [hoveredApartment, setHoveredApartment] = useState<Apartment | null>(
    null,
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawnRegion, setDrawnRegion] = useState<google.maps.Polygon | null>(
    null,
  );
  const [showBoroughs, setShowBoroughs] = useState(false);
  const [showNeighborhoods, setShowNeighborhoods] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const boroughLayerRef = useRef<google.maps.Data | null>(null);
  const neighborhoodLayerRef = useRef<google.maps.Data | null>(null);

  const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  // Load Google Maps API with drawing and geometry libraries
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    mapIds: ["ebe32cd9465194d6"],
    googleMapsApiKey: mapsKey,
    libraries: ["drawing", "geometry"],
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newUserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newUserLocation);
          setMapCenter(newUserLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Handle apartment marker click
  const handleMarkerClick = useCallback(
    (apartment: Apartment) => {
      setSelectedApartment(apartment);
      if (onApartmentSelect) {
        onApartmentSelect(apartment.id);
      }
    },
    [onApartmentSelect],
  );

  // Close InfoWindow when clicking on map
  const handleMapClick = useCallback(() => {
    setSelectedApartment(null);
  }, []);

  // Load GeoJSON data for NYC boroughs and neighborhoods
  const loadGeoJSONData = useCallback(async (map: google.maps.Map) => {
    try {
      // Create data layers
      const boroughLayer = new google.maps.Data();
      const neighborhoodLayer = new google.maps.Data();
      
      boroughLayerRef.current = boroughLayer;
      neighborhoodLayerRef.current = neighborhoodLayer;

      // Set styles for boroughs (thicker lines)
      boroughLayer.setStyle({
        strokeColor: '#1A4A4A',
        strokeWeight: 3,
        strokeOpacity: 0.8,
        fillColor: '#E9927E',
        fillOpacity: 0.1,
      });

      // Set styles for neighborhoods (thinner lines)
      neighborhoodLayer.setStyle({
        strokeColor: '#E9927E',
        strokeWeight: 1.5,
        strokeOpacity: 0.6,
        fillColor: '#C9DAD0',
        fillOpacity: 0.05,
      });

      // Load NYC Boroughs GeoJSON
      // Using NYC Open Data API
      const boroughResponse = await fetch('https://data.cityofnewyork.us/api/geospatial/tqmj-j8zm?method=export&format=GeoJSON');
      if (boroughResponse.ok) {
        const boroughData = await boroughResponse.json();
        boroughLayer.addGeoJson(boroughData);
      }

      // Load NYC Neighborhoods GeoJSON  
      const neighborhoodResponse = await fetch('https://data.cityofnewyork.us/api/geospatial/xyye-rtrs?method=export&format=GeoJSON');
      if (neighborhoodResponse.ok) {
        const neighborhoodData = await neighborhoodResponse.json();
        neighborhoodLayer.addGeoJson(neighborhoodData);
      }

      // Add info window for borough/neighborhood names
      const infoWindow = new google.maps.InfoWindow();
      
      const addClickListener = (layer: google.maps.Data, nameProperty: string) => {
        layer.addListener('click', (event: google.maps.Data.MouseEvent) => {
          const feature = event.feature;
          const name = feature.getProperty(nameProperty) || feature.getProperty('name') || 'Unknown';
          
          infoWindow.setContent(`<div style="padding: 8px; font-weight: bold;">${name}</div>`);
          infoWindow.setPosition(event.latLng);
          infoWindow.open(map);
        });
      };

      addClickListener(boroughLayer, 'boro_name');
      addClickListener(neighborhoodLayer, 'ntaname');

    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
    }
  }, []);

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    loadGeoJSONData(map);
  }, [loadGeoJSONData]);

  // Handle drawing mode toggle
  const toggleDrawingMode = useCallback(() => {
    setIsDrawingMode(!isDrawingMode);
    // Clear existing drawn region when toggling drawing mode
    if (!isDrawingMode && drawnRegion) {
      drawnRegion.setMap(null);
      setDrawnRegion(null);
    }
  }, [isDrawingMode, drawnRegion]);

  // Handle polygon completion
  const onPolygonComplete = useCallback(
    (polygon: google.maps.Polygon) => {
      // Remove any existing drawn region
      if (drawnRegion) {
        drawnRegion.setMap(null);
      }

      // Make the polygon editable to show vertex circles
      polygon.setEditable(true);

      setDrawnRegion(polygon);
      setIsDrawingMode(false);

      // Get polygon coordinates
      const path = polygon.getPath();
      const coordinates: { lat: number; lng: number }[] = [];

      for (let i = 0; i < path.getLength(); i++) {
        const latLng = path.getAt(i);
        coordinates.push({
          lat: latLng.lat(),
          lng: latLng.lng(),
        });
      }

      // Calculate bounds and area
      const bounds = new google.maps.LatLngBounds();
      coordinates.forEach((coord) => bounds.extend(coord));

      const regionData = {
        coordinates,
        bounds: {
          north: bounds.getNorthEast().lat(),
          south: bounds.getSouthWest().lat(),
          east: bounds.getNorthEast().lng(),
          west: bounds.getSouthWest().lng(),
        },
        center: {
          lat: bounds.getCenter().lat(),
          lng: bounds.getCenter().lng(),
        },
        area: google.maps.geometry.spherical.computeArea(path),
      };

      console.log("Region drawn by user:", regionData);
      console.log("Polygon coordinates:", coordinates);
      console.log("Region bounds:", regionData.bounds);
      console.log("Region center:", regionData.center);
      console.log("Region area (square meters):", regionData.area);

      // Listen for path changes if user edits the polygon
      path.addListener("set_at", () => {
        console.log("Polygon vertex moved");
        // Could recalculate and log updated region data here
      });

      path.addListener("insert_at", () => {
        console.log("Polygon vertex added");
        // Could recalculate and log updated region data here
      });

      path.addListener("remove_at", () => {
        console.log("Polygon vertex removed");
        // Could recalculate and log updated region data here
      });
    },
    [drawnRegion],
  );

  // Clear drawn region
  const clearDrawnRegion = useCallback(() => {
    if (drawnRegion) {
      drawnRegion.setMap(null);
      setDrawnRegion(null);
      console.log("Drawn region cleared");
    }
  }, [drawnRegion]);

  // Toggle borough outlines
  const toggleBoroughs = useCallback(() => {
    if (boroughLayerRef.current && mapRef.current) {
      if (showBoroughs) {
        boroughLayerRef.current.setMap(null);
      } else {
        boroughLayerRef.current.setMap(mapRef.current);
      }
      setShowBoroughs(!showBoroughs);
    }
  }, [showBoroughs]);

  // Toggle neighborhood outlines
  const toggleNeighborhoods = useCallback(() => {
    if (neighborhoodLayerRef.current && mapRef.current) {
      if (showNeighborhoods) {
        neighborhoodLayerRef.current.setMap(null);
      } else {
        neighborhoodLayerRef.current.setMap(mapRef.current);
      }
      setShowNeighborhoods(!showNeighborhoods);
    }
  }, [showNeighborhoods]);

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center">
        Error loading maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        Loading maps...
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {/* Drawing Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          onClick={toggleDrawingMode}
          variant={isDrawingMode ? "default" : "outline"}
          size="sm"
          className="bg-white shadow-md hover:bg-gray-100 flex items-center gap-2 rounded-xl"
        >
          <Edit3 className="h-4 w-4" />
          {isDrawingMode ? "Stop Drawing" : "Draw Region"}
        </Button>

        {drawnRegion && (
          <Button
            onClick={clearDrawnRegion}
            variant="outline"
            size="sm"
            className="bg-white shadow-md hover:bg-gray-100 flex items-center gap-2 rounded-xl"
          >
            <X className="h-4 w-4" />
            Clear Region
          </Button>
        )}
      </div>

      {/* Borough and Neighborhood Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          onClick={toggleBoroughs}
          variant={showBoroughs ? "default" : "outline"}
          size="sm"
          className="bg-white shadow-md hover:bg-gray-100 flex items-center gap-2 rounded-xl"
        >
          <Building className="h-4 w-4" />
          {showBoroughs ? "Hide Boroughs" : "Show Boroughs"}
        </Button>

        <Button
          onClick={toggleNeighborhoods}
          variant={showNeighborhoods ? "default" : "outline"}
          size="sm"
          className="bg-white shadow-md hover:bg-gray-100 flex items-center gap-2 rounded-xl"
        >
          <MapIcon className="h-4 w-4" />
          {showNeighborhoods ? "Hide Neighborhoods" : "Show Neighborhoods"}
        </Button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={13}
        onClick={handleMapClick}
        onLoad={onMapLoad}
        options={mapOptions}
      >
        {/* Drawing Manager */}
        {isDrawingMode && (
          <DrawingManager
            onPolygonComplete={onPolygonComplete}
            options={{
              drawingControl: false,
              drawingMode: google.maps.drawing.OverlayType.POLYGON,
              polygonOptions: {
                fillColor: "#E9927E",
                fillOpacity: 0.3,
                strokeColor: "#E9927E",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                clickable: false,
                editable: true,
                zIndex: 1,
              },
            }}
          />
        )}
        {/* User's location marker */}
        {userLocation && (
          <OverlayView
            position={userLocation}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="flex items-center justify-center w-8 h-8 bg-[#212121] rounded-full shadow-md cursor-pointer border border-gray-200">
              <Pin size={16} color={COLORS.coral} strokeWidth={2} />
            </div>
          </OverlayView>
        )}

        {/* Apartment markers */}
        {apartments
          .filter((apartment) => apartment.latitude && apartment.longitude)
          .map((apartment) => (
          <OverlayView
            key={apartment.id}
            position={{
              lat: parseFloat(apartment.latitude!),
              lng: parseFloat(apartment.longitude!),
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="relative">
              {/* Hover Info Popup - Always render but conditionally show */}
              <div
                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white shadow-lg rounded-lg p-3 min-w-[200px] z-10 
                  transition-opacity duration-150 ${hoveredApartment && hoveredApartment.id === apartment.id ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <div className="p-1">
                  <h3 className="font-semibold text-sm truncate">
                    {apartment.title}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">
                    {apartment.address}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm font-medium text-primary">
                      ${apartment.price.toLocaleString()}/mo
                    </p>
                    <span className="text-xs">
                      {apartment.bedrooms} BD | {apartment.bathrooms} BA
                    </span>
                  </div>
                </div>
                {/* Triangle pointer */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-4 h-4 rotate-45 bg-white"></div>
              </div>

              {/* Marker Icon */}
              <div
                onClick={() => handleMarkerClick(apartment)}
                onMouseEnter={() => setHoveredApartment(apartment)}
                onMouseLeave={() => setHoveredApartment(null)}
                style={{
                  transform:
                    hoveredApartment?.id === apartment.id
                      ? "scale(1.1)"
                      : "scale(1)",
                  transition:
                    "transform 0.15s ease, background-color 0.15s ease",
                }}
                className={`flex items-center justify-center w-8 h-8 ${hoveredApartment?.id === apartment.id ? "bg-primary" : "bg-white"} rounded-full shadow-md cursor-pointer border border-gray-200`}
              >
                <Building
                  size={16}
                  color={
                    hoveredApartment?.id === apartment.id
                      ? "#FFFFFF"
                      : COLORS.coral
                  }
                  strokeWidth={2}
                />
              </div>
            </div>
          </OverlayView>
        ))}

        {/* Info window for selected apartment */}
        {selectedApartment && selectedApartment.latitude && selectedApartment.longitude && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedApartment.latitude),
              lng: parseFloat(selectedApartment.longitude),
            }}
            onCloseClick={() => setSelectedApartment(null)}
          >
            <div className="p-2">
              <h3 className="font-bold text-lg">{selectedApartment.title}</h3>
              <p className="text-sm">{selectedApartment.address}</p>
              <p className="text-sm font-semibold mt-1">
                ${selectedApartment.price}/month
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};
