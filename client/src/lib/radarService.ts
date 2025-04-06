import Radar from "radar-sdk-js";

// Type definitions for Radar SDK responses
interface RadarLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface RadarTrackResponse {
  location?: RadarLocation;
  user?: any;
}

interface RadarGeocodeAddress {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  city: string;
  state: string;
  postalCode: string;
}

interface RadarGeocodeResponse {
  addresses?: RadarGeocodeAddress[];
}

interface RadarDistanceRoute {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
}

interface RadarDistanceResponse {
  routes?: {
    [key: string]: RadarDistanceRoute;
  };
}

/**
 * Initializes the Radar SDK with the publishable API key
 */
export const initializeRadar = (): void => {
  // Try to get the key from environment variables or use a default test key
  // This is just for development purposes
  const publishableKey =
    import.meta.env.VITE_RADAR_PUBLISHABLE_KEY ||
    "prj_test_pk_9492eb028e1e258e6bd15925c268301fe1d4f537";
  Radar.startTrackingVerified()
  try {
    Radar.initialize(publishableKey);
    console.log("Radar SDK initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Radar SDK:", error);
  }
};

/**
 * Gets the user's current location using Radar
 * @returns A promise that resolves to the user's location coordinates
 */
export const getUserLocation = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  try {
    // First try to get location via browser's Geolocation API as a fallback
    const browserLocation = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5050,
            maximumAge: 0,
          });
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      },
    ).catch(() => null);

    // If browser geolocation succeeded, return those coordinates
    if (browserLocation) {
      return {
        latitude: browserLocation.coords.latitude,
        longitude: browserLocation.coords.longitude,
      };
    }

    // Otherwise try Radar's tracking
    const result = (await Radar.trackOnce()) as RadarTrackResponse;

    if (result.location) {
      return {
        latitude: result.location.latitude,
        longitude: result.location.longitude,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting user location:", error);
    return null;
  }
};

/**
 * Geocodes an address into coordinates using Radar
 * @param address The address to geocode
 * @returns A promise that resolves to the coordinates of the address
 */
export const geocodeAddress = async (
  address: string,
): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    // Radar's forward geocoding method (search)
    // Using 'as any' here because the type definitions are incomplete
    const result = await (Radar as any).searchPlaces({
      query: address,
      limit: 1,
    });

    if (result && result.places && result.places.length > 0) {
      const firstPlace = result.places[0];

      return {
        latitude: firstPlace.location.latitude,
        longitude: firstPlace.location.longitude,
      };
    }

    return null;
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
};

/**
 * Calculates the distance between two points
 * @param origin The origin coordinates
 * @param destination The destination coordinates
 * @returns A promise that resolves to the distance in meters and travel time in seconds
 */
export const calculateDistance = async (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
  mode: "foot" | "car" | "bike" | "transit" = "foot",
): Promise<{ distance: number; duration: number } | null> => {
  try {
    // Use Radar's distance endpoint with 'as any' due to incomplete type definitions
    const result = await (Radar as any).distance({
      origin: `${origin.latitude},${origin.longitude}`,
      destination: `${destination.latitude},${destination.longitude}`,
      modes: [mode],
      units: "imperial",
    });

    // Access the route data carefully since the types aren't matching
    if (result && result.routes && result.routes[mode]) {
      const route = result.routes[mode];

      return {
        distance: route.distance.value,
        duration: route.duration.value,
      };
    }

    return null;
  } catch (error) {
    console.error("Error calculating distance:", error);
    return null;
  }
};
