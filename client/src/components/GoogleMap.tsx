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
const mapOptions = {
  disableDefaultUI: false,
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
            <div
              onClick={() => handleMarkerClick(apartment)}
              className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md cursor-pointer border border-gray-200"
            >
              <Building size={16} color={COLORS.coral} strokeWidth={2} />
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
