import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  OverlayView,
} from "@react-google-maps/api";
import { Apartment } from "../types";
import { Building, Pin } from "lucide-react";
import { COLORS } from "@/lib/constants";

// Define the map styles for the Google Map
const customMapStyles: google.maps.MapTypeStyle[] = [
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
      {
        color: "#f49f53",
      },
    ],
  },
  {
    featureType: "landscape",
    stylers: [
      {
        color: "#f9ddc5",
      },
      {
        lightness: -7,
      },
    ],
  },
  {
    featureType: "road",
    stylers: [
      {
        color: "#813033",
      },
      {
        lightness: 43,
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        color: "#645c20",
      },
      {
        lightness: 38,
      },
    ],
  },
  {
    featureType: "water",
    stylers: [
      {
        color: "#1994bf",
      },
      {
        saturation: -69,
      },
      {
        gamma: 0.99,
      },
      {
        lightness: 43,
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#f19f53",
      },
      {
        weight: 1.3,
      },
      {
        visibility: "on",
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "simplified",
      },
    ],
  },
  {
    featureType: "poi.park",
    stylers: [
      {
        color: "#645c20",
      },
      {
        lightness: 39,
      },
    ],
  },
  {
    featureType: "poi.school",
    stylers: [
      {
        color: "#a95521",
      },
      {
        lightness: 35,
      },
    ],
  },
  {
    featureType: "poi.medical",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#813033",
      },
      {
        lightness: 38,
      },
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "simplified",
      },
    ],
  },
  {
    featureType: "poi.sports_complex",
    stylers: [
      {
        color: "#9e5916",
      },
      {
        lightness: 32,
      },
    ],
  },
  {
    featureType: "poi.government",
    stylers: [
      {
        color: "#9e5916",
      },
      {
        lightness: 46,
      },
    ],
  },
  {
    featureType: "transit.station",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit.line",
    stylers: [
      {
        color: "#813033",
      },
      {
        lightness: 22,
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        lightness: 38,
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#f19f53",
      },
      {
        lightness: -10,
      },
    ],
  },
];

// Map container style
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "10px",
};

// Default map center (will be updated with user's location)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.006, // New York coordinates as default
};

// Map options
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  styles: customMapStyles,
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
  selectedApartmentId,
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

  const mapsKey = "AIzaSyDAGlko3aGJd4-ZvYy20QydYWrl_QwRNBo";

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    mapIds: ["ebe32cd9465194d6"],
    googleMapsApiKey: mapsKey,
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

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    // Map loaded callback
  }, []);

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
    <div className="h-full w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={13}
        onClick={handleMapClick}
        onLoad={onMapLoad}
        options={mapOptions}
      >
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
        {apartments.map((apartment) => (
          <OverlayView
            key={apartment.id}
            position={{
              lat: parseFloat(apartment.latitude),
              lng: parseFloat(apartment.longitude),
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="relative">
              {/* Hover Info Popup - Always render but conditionally show */}
              <div
                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white shadow-lg rounded-md p-3 min-w-[200px] z-10 
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
        {selectedApartment && (
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
