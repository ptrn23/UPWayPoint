"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface TargetLineProps {
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
    color?: string;
}

export function TargetLine({ start, end, color = "#FF0055" }: TargetLineProps) {
    const map = useMap();
    const polylineRef = useRef<google.maps.Polyline | null>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        if (!map || !window.google) return;
        
        const lineSymbol = {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            scale: 3,
            strokeColor: color,
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
            offset = (offset + 0.5) % 15;

            const icons = polyline.get("icons");
            if (icons && icons.length > 0) {
                icons[0].offset = `${offset}px`;
                polyline.set("icons", icons);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationRef.current);
            if (polylineRef.current) {
                polylineRef.current.setMap(null);
            }
        };
    }, [map, start, end, color]);

    return null;
}