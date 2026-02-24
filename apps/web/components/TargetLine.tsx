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

    useEffect(() => {
        if (!map || !window.google) return;

        const lineSymbol = {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            scale: 3,
            strokeColor: color,
        };

        polylineRef.current = new window.google.maps.Polyline({
            path: [start, end],
            strokeOpacity: 0,
            icons: [
                {
                    icon: lineSymbol,
                    offset: "0",
                    repeat: "15px",
                },
            ],
            map: map,
        });

        return () => {
            if (polylineRef.current) {
                polylineRef.current.setMap(null);
            }
        };
    }, [map, start, end, color]);

    return null;
}