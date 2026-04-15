"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface UserLocation {
  lat: number;
  lng: number;
  heading?: number;
  accuracy?: number;
}

interface UseUserLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface UseUserLocationReturn {
  location: UserLocation | null;
  error: string | null;
  isLoading: boolean;
  isPermissionDenied: boolean;
  refreshLocation: () => void;
}

export function useUserLocation(
  options: UseUserLocationOptions = {},
): UseUserLocationReturn {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 5000,
  } = options;

  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  
  const watchIdRef = useRef<number | null>(null);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      heading: position.coords.heading ?? undefined,
      accuracy: position.coords.accuracy,
    });
    setError(null);
    setIsLoading(false);
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError("Location permission denied");
        setIsPermissionDenied(true);
        break;
      case err.POSITION_UNAVAILABLE:
        setError("Location information unavailable");
        break;
      case err.TIMEOUT:
        setError("Location request timed out");
        break;
      default:
        setError("Unknown location error");
    }
    setIsLoading(false);
  }, []);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by browser");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Use getCurrentPosition for initial fetch
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      },
    );
  }, [enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  const refreshLocation = useCallback(() => {
    // Clear any existing watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    getLocation();

    // Set up continuous watching for updates
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy,
          timeout,
          maximumAge: 2000, // More frequent updates for navigation
        },
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [getLocation, handleSuccess, handleError, enableHighAccuracy, timeout, maximumAge]);

  return {
    location,
    error,
    isLoading,
    isPermissionDenied,
    refreshLocation,
  };
}
