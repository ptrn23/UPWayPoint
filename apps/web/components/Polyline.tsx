"use client";

import { useEffect, useRef } from "react";
import { useMap, useApiIsLoaded } from "@vis.gl/react-google-maps";

interface PolylineProps {
  path: { lat: number; lng: number }[];
  color?: string;
  weight?: number;
  animateDirection?: "forward" | "reverse" | "none";
  speed?: number;
}

export function Polyline({ 
  path, 
  color = "#FFD700", 
  weight = 5, 
  animateDirection = "forward",
  speed = 0.8
}: PolylineProps) {
  const map = useMap();
  const isLoaded = useApiIsLoaded();
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!map || !isLoaded || !window.google) return;

    const baseOpacity = 0.4;
    const clusterSpacing = 120;
    const tailLength = 4;
    const chevronSpacing = 8;
    
    const icons = [];
    if (animateDirection !== "none") {
      for (let i = 0; i < tailLength; i++) {
        const opacity = (i + 1) / tailLength; 

        const chevronShape = {
          path: animateDirection === "reverse" 
            ? window.google.maps.SymbolPath.BACKWARD_OPEN_ARROW 
            : window.google.maps.SymbolPath.FORWARD_OPEN_ARROW,
          scale: 2.5,
          strokeColor: color,
          strokeWeight: 4,
          strokeOpacity: opacity,
        };

        icons.push({
          icon: chevronShape,
          offset: "0px",
          repeat: `${clusterSpacing}px`,
        });
      }
    }

    if (!polylineRef.current) {
      polylineRef.current = new window.google.maps.Polyline({
        path,
        strokeColor: color,
        strokeWeight: weight,
        strokeOpacity: baseOpacity, 
        icons: icons,
        map,
      });
    } else {
      polylineRef.current.setOptions({
        path,
        strokeColor: color,
        strokeWeight: weight,
        strokeOpacity: baseOpacity,
        icons: icons,
        map,
      });
    }

    let offsetStep = 0;

    const animateLoop = () => {
      if (!polylineRef.current || animateDirection === "none") return;

      if (animateDirection === "forward") {
         offsetStep = (offsetStep + speed) % clusterSpacing;
      } else {
         offsetStep = (offsetStep - speed) % clusterSpacing;
         if (offsetStep < 0) offsetStep += clusterSpacing; 
      }

      const currentIcons = polylineRef.current.get("icons");
      if (currentIcons && currentIcons.length === tailLength) {
         for (let i = 0; i < tailLength; i++) {
            
            const relativeOffset = animateDirection === "forward" 
                ? i * chevronSpacing 
                : (tailLength - 1 - i) * chevronSpacing;

            currentIcons[i].offset = `${(offsetStep + relativeOffset) % clusterSpacing}px`;
         }
         polylineRef.current.set("icons", currentIcons);
      }

      animationRef.current = requestAnimationFrame(animateLoop);
    };

    if (animateDirection !== "none") {
        cancelAnimationFrame(animationRef.current); 
        animationRef.current = requestAnimationFrame(animateLoop);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, isLoaded, path, color, weight, animateDirection, speed]);

  return null;
}