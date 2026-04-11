"use client";

import { useEffect, useRef } from "react";
import { useMap, useApiIsLoaded } from "@vis.gl/react-google-maps";
import { useAnimationPreference } from "../hooks/usePreferences";

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
  fillColor = "--neon-green",
  fillOpacity = 0.05,
  strokeColor = "--neon-green",
  strokeOpacity = 0.8,
  strokeWeight = 2,
  zIndex = 1,
  isPulsating = true,
}: PolygonProps) {
  const map = useMap();
  const isLoaded = useApiIsLoaded();
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const animationRef = useRef<number>(0);
  const { animationsEnabled } = useAnimationPreference();

  useEffect(() => {
    if (!map || !isLoaded || !window.google) return;

    const styles = getComputedStyle(document.documentElement);
    const resolvedFill =
      styles
        .getPropertyValue(fillColor.replace("var(", "").replace(")", ""))
        .trim() || fillColor;
    const resolvedStroke =
      styles
        .getPropertyValue(strokeColor.replace("var(", "").replace(")", ""))
        .trim() || strokeColor;

    if (!polygonRef.current) {
      polygonRef.current = new window.google.maps.Polygon({
        paths,
        fillColor: resolvedFill,
        fillOpacity,
        strokeColor: resolvedStroke,
        strokeOpacity,
        strokeWeight,
        zIndex,
        map,
      });
    } else {
      polygonRef.current.setOptions({
        paths,
        fillColor: resolvedFill,
        strokeColor: resolvedStroke,
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

      polygonRef.current.setOptions({
        fillOpacity: fillOpacity,
        strokeOpacity: 0.6 + sineValue * 0.3,
      });

      if (animationsEnabled) {
        animationRef.current = requestAnimationFrame(animatePulse);
      } else {
        polygonRef.current.setOptions({ fillOpacity, strokeOpacity });
      }
    };

    cancelAnimationFrame(animationRef.current);

    if (isPulsating && animationsEnabled) {
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
  }, [
    map,
    isLoaded,
    paths,
    fillColor,
    fillOpacity,
    strokeColor,
    strokeOpacity,
    strokeWeight,
    zIndex,
    isPulsating,
    animationsEnabled,
  ]);

  return null;
}
