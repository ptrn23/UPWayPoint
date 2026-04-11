"use client";

import { useEffect, useRef } from "react";
import { useMap, useApiIsLoaded } from "@vis.gl/react-google-maps";

interface DirectionsRendererProps {
  path: { lat: number; lng: number }[];
  color?: string;
  weight?: number;
  visible?: boolean;
}

export function DirectionsRenderer({
  path,
  color = "#00b0ff",
  weight = 5,
  visible = true,
}: DirectionsRendererProps) {
  const map = useMap();
  const isLoaded = useApiIsLoaded();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !isLoaded || !window.google || !visible || path.length === 0) {
      // Clean up polyline if it exists
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      return;
    }

    if (!polylineRef.current) {
      polylineRef.current = new window.google.maps.Polyline({
        path,
        strokeColor: color,
        strokeWeight: weight,
        strokeOpacity: 0.9,
        geodesic: true,
        map,
      });
    } else {
      polylineRef.current.setOptions({
        path,
        strokeColor: color,
        strokeWeight: weight,
      });
    }
  }, [map, isLoaded, path, color, weight, visible]);

  // Cleanup on unmount or when visibility changes
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, []);

  return null;
}
