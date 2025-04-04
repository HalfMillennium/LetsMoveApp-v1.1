import { useState, useEffect } from "react";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        error: "Geolocation is not supported by your browser",
        loading: false
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          error: null,
          loading: false
        });
      },
      (error) => {
        setState({
          coordinates: null,
          error: `Geolocation error: ${error.message}`,
          loading: false
        });
      }
    );
  }, []);

  return state;
}
