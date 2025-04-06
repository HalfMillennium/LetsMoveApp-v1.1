import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Apartment } from "../types";

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

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
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

  // Load Google Maps API
  console.log("Google Maps API Key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
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
      <div className="h-full flex items-center justify-center flex-col p-4">
        <p className="text-lg font-semibold text-red-500 mb-2">Error loading Google Maps</p>
        <p className="text-sm text-center">{loadError.message}</p>
        <p className="text-xs mt-2">API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? "Set" : "Not set"}</p>
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
          <Marker
            position={userLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            title="Your location"
          />
        )}

        {/* Apartment markers */}
        {apartments.map((apartment) => (
          <Marker
            key={apartment.id}
            position={{
              lat: parseFloat(apartment.latitude),
              lng: parseFloat(apartment.longitude),
            }}
            onClick={() => handleMarkerClick(apartment)}
            animation={
              selectedApartmentId === apartment.id
                ? google.maps.Animation.BOUNCE
                : undefined
            }
          />
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

export default GoogleMapComponent;
