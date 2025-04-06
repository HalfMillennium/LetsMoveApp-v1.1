import { Loader } from '@googlemaps/js-api-loader';

// Type definitions for Google Maps responses
interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress?: string;
}

// Create a loader with the API key
const createLoader = () => {
  return new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    version: 'weekly',
    libraries: ['places', 'geometry']
  });
};

/**
 * Gets the user's current location using browser's Geolocation API
 * @returns A promise that resolves to the user's location coordinates
 */
export const getUserLocation = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting user location:", error);
    return null;
  }
};

/**
 * Geocodes an address into coordinates using Google Maps Geocoding API
 * @param address The address to geocode
 * @returns A promise that resolves to the coordinates of the address
 */
export const geocodeAddress = async (
  address: string
): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const loader = createLoader();
    await loader.load();
    
    const geocoder = new google.maps.Geocoder();
    
    const result = await new Promise<google.maps.GeocoderResult[] | null>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          resolve(results);
        } else {
          reject(new Error(`Geocoding failed due to: ${status}`));
        }
      });
    });

    if (result && result.length > 0) {
      const location = result[0].geometry.location;
      return {
        latitude: location.lat(),
        longitude: location.lng(),
      };
    }

    return null;
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
};

/**
 * Calculates the distance between two points using Google Maps Distance Matrix API
 * @param origin The origin coordinates
 * @param destination The destination coordinates
 * @param mode The travel mode
 * @returns A promise that resolves to the distance in meters and travel time in seconds
 */
export const calculateDistance = async (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
  mode: google.maps.TravelMode = google.maps.TravelMode.WALKING
): Promise<{ distance: number; duration: number } | null> => {
  try {
    const loader = createLoader();
    await loader.load();
    
    const service = new google.maps.DistanceMatrixService();
    
    const result = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [new google.maps.LatLng(origin.latitude, origin.longitude)],
          destinations: [new google.maps.LatLng(destination.latitude, destination.longitude)],
          travelMode: mode,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
        },
        (response, status) => {
          if (status === google.maps.DistanceMatrixStatus.OK && response) {
            resolve(response);
          } else {
            reject(new Error(`Distance calculation failed due to: ${status}`));
          }
        }
      );
    });

    if (
      result &&
      result.rows.length > 0 &&
      result.rows[0].elements.length > 0 &&
      result.rows[0].elements[0].status === 'OK'
    ) {
      const element = result.rows[0].elements[0];
      
      return {
        distance: element.distance.value, // meters
        duration: element.duration.value, // seconds
      };
    }

    return null;
  } catch (error) {
    console.error("Error calculating distance:", error);
    return null;
  }
};