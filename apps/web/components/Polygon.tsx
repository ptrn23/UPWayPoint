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
  isPulsating?: boolean;
}

export function Polygon({
  paths,
  fillColor = "#00FF99",
  fillOpacity = 0.15, 
  strokeColor = "#00FF99",
  strokeOpacity = 0.8,
  strokeWeight = 2,
  zIndex = 1,
  isPulsating = true
}: PolygonProps) {
  const map = useMap();
  const isLoaded = useApiIsLoaded();
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const animationRef = useRef<number>(0);

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
        strokeColor,
        strokeOpacity,
        strokeWeight,
        zIndex,
        map, 
      });
    }

    const animatePulse = () => {
      if (!polygonRef.current || !isPulsating) return;

      const time = Date.now();
      const speed = 800;
      const sineValue = Math.sin(time / speed);
      const variance = 0.10; 
      const currentOpacity = fillOpacity + (sineValue * variance);
      const clampedOpacity = Math.max(0.05, Math.min(0.4, currentOpacity));

      polygonRef.current.setOptions({
        fillOpacity: fillOpacity,
        strokeOpacity: 0.6 + (sineValue * 0.3) 
      });

      animationRef.current = requestAnimationFrame(animatePulse);
    };

    if (isPulsating) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(animatePulse);
    } else {
      polygonRef.current.setOptions({ fillOpacity, strokeOpacity });
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [map, isLoaded, paths, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight, zIndex, isPulsating]);

  return null;
}