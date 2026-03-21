"use client";

import { useEffect, useRef } from "react";
import { useMap, useApiIsLoaded } from "@vis.gl/react-google-maps";

interface PolygonProps {
  paths: { lat: number; lng: number }[];
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  zIndex?: number;
}

export function Polygon({
  paths,
  fillColor = "#00FF99",
  fillOpacity = 0.15,
  strokeColor = "#00FF99",
  strokeOpacity = 0.8,
  strokeWeight = 2,
  zIndex = 1
}: PolygonProps) {
  const map = useMap();
  const isLoaded = useApiIsLoaded();
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map || !isLoaded || !window.google) return;

    if (!polygonRef.current) {
      polygonRef.current = new window.google.maps.Polygon({
        paths,
        fillColor,
        fillOpacity,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        zIndex,
        map,
      });
    } else {
      polygonRef.current.setOptions({
        paths,
        fillColor,
        fillOpacity,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        zIndex,
        map,
      });
    }

    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [map, isLoaded, paths, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight, zIndex]);

  return null;
}