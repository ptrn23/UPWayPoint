"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useAnimationPreference } from "../hooks/usePreferences";

interface TargetLineProps {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  color?: string;
}

export function TargetLine({
  start,
  end,
  color = "--neon-blue",
}: TargetLineProps) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const animationRef = useRef<number>(0);

  const { animationsEnabled } = useAnimationPreference();

  useEffect(() => {
    if (!map || !window.google) return;

    const element = document.documentElement;
    const styles = getComputedStyle(element);
    const hexCode = styles.getPropertyValue(color).trim() || "#00e5ff";

    const lineSymbol = {
      path: "M 0,-1 0,1",
      strokeOpacity: 1,
      scale: 3,
      strokeColor: hexCode,
    };

    const polyline = new window.google.maps.Polyline({
      path: [start, end],
      strokeOpacity: 0,
      icons: [
        {
          icon: lineSymbol,
          offset: "0px",
          repeat: "15px",
        },
      ],
      map: map,
    });

    polylineRef.current = polyline;

    let offset = 0;
    const animate = () => {
      if (!animationsEnabled) return;

      offset = (offset + 0.5) % 15;

      const icons = polyline.get("icons");
      if (icons && icons.length > 0) {
        icons[0].offset = `${offset}px`;
        polyline.set("icons", icons);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (animationsEnabled) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, start, end, color, animationsEnabled]);

  return null;
}
