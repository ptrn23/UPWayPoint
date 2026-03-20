"use client";

import { useEffect, useRef } from "react";
import { useMap, useApiIsLoaded } from "@vis.gl/react-google-maps";

interface PolylineProps {
  path: { lat: number; lng: number }[];
  color?: string;
  weight?: number;
}

export function Polyline({ path, color = "#FFD700", weight = 5 }: PolylineProps) {
  const map = useMap();
  const isLoaded = useApiIsLoaded();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !isLoaded) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path,
        strokeColor: color,
        strokeWeight: weight,
        strokeOpacity: 0.8,
        map,
      });
    } else {
      polylineRef.current.setOptions({
        path,
        strokeColor: color,
        strokeWeight: weight,
        map,
      });
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, isLoaded, path, color, weight]);

  return null;
}