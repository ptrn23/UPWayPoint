"use client";

import { APIProvider, Map as GoogleMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import { HeadsUpDisplay } from "@/components/HeadsUpDisplay";
import { NeonPin } from "@/components/NeonPin";
import { useWaypointState } from "@/hooks/useWaypointState";
import { TopBar, FilterType } from "@/components/TopBar"; 
import { useState } from "react"
import { Pin } from "@/types/waypoint";

// SPRINT 1: Hardcoded Data
const HARDCODED_PINS: Pin[] = [
  {
    id: "1",
    title: "Alumni Engineers Hall",
    type: "academic",
    description: "Home to the College of Engineering, featuring computer labs and the engineering library.",
    icon: "A",
    position: { lat: 14.64867, lng: 121.06849 },
  },
  {
    id: "2",
    title: "CS Library",
    type: "academic",
    description: "Quiet, air-conditioned library with extensive science and math resources.",
    icon: "C",
    position: { lat: 14.64921, lng: 121.06895 },
  },
  {
    id: "3",
    title: "Melchor Hall",
    type: "academic",
    description: "College of Arts and Letters building with classrooms and faculty offices.",
    icon: "M",
    position: { lat: 14.65658, lng: 121.06946 },
  },
  {
    id: "4",
    title: "Sunken Garden",
    type: "social",
    description: "Iconic oval-shaped garden, perfect for picnics, studying, and sunset viewing.",
    icon: "S",
    position: { lat: 14.65485, lng: 121.06999 },
  },
  {
    id: "5",
    title: "Enriquez Shakes",
    type: "food",
    description: "Fruit shake stall near College of Science offering fresh shakes and fruits.",
    icon: "E",
    position: { lat: 14.65991, lng: 121.06612 },
  },
  {
    id: "6",
    title: "7-Eleven",
    type: "utility",
    description: "24-hour convenience store near the shopping center, great for late-night snacks.",
    icon: "7",
    position: { lat: 14.65822, lng: 121.06461 },
  },
  {
    id: "7",
    title: "Palma Hall CR",
    type: "utility",
    description: "Clean restroom on the first floor of Palma Hall, accessible during office hours.",
    icon: "P",
    position: { lat: 14.65349, lng: 121.06908 },
  },
  {
    id: "8",
    title: "Accenture Hall",
    type: "utility",
    description: "Business administration building with reliable WiFi and air-conditioned study spaces.",
    icon: "A",
    position: { lat: 14.64842, lng: 121.06855 },
  },
  {
    id: "9",
    title: "Quezon Hall",
    type: "academic",
    description: "The administrative seat of the university, known for its iconic columns and Oblation statue.",
    icon: "Q",
    position: { lat: 14.655114156443288, lng: 121.06492168770944 },
  },
  {
    id: "10",
    title: "Area 2",
    type: "food",
    description: "A popular food street offering affordable meals, snacks, and lutong bahay.",
    icon: "A",
    position: { lat: 14.659680383534933, lng: 121.06807840570266 },
  },
];

export default function Home() {
  const { mode, selectedPin, selectPin, clearSelection, expandDetails, toggleMenu, toggleLock } = useWaypointState();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}>
      <main style={{ width: "100vw", height: "100vh", position: "relative" }}>
        {/* TOP BAR */}
        <TopBar 
          onMenuClick={toggleMenu}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        {/* MAP LAYER */}
        <GoogleMap
          defaultCenter={{ lat: 14.6549, lng: 121.0645 }}
          defaultZoom={19}
          minZoom={17}
          mapId={process.env.NEXT_PUBLIC_MAP_ID || '71238adec955b8c6d66f595a'} 
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          onClick={() => clearSelection()}
          restriction={{
            latLngBounds: {
              north: 14.663668,
              south: 14.645343,
              east: 121.075583,
              west: 121.055360,
            },
            strictBounds: false
          }}
        >
          {HARDCODED_PINS.map((pinData) => (
            <AdvancedMarker
              key={pinData.id}
              position={pinData.position}
            >
                {/* PASS THE FULL OBJECT */}
                <NeonPin 
                  pin={pinData} 
                  isSelected={selectedPin?.id === pinData.id}
                  isLocked={mode === "LOCKED" && selectedPin?.id === pinData.id}
                  onClick={() => selectPin(pinData)}
                />
            </AdvancedMarker>
          ))}
        </GoogleMap>

        {/* UI LAYER */}
        <HeadsUpDisplay
            selectedPin={selectedPin}
            isLocked={mode === "LOCKED"} 
            onLockClick={toggleLock}
        />
        
      </main>
    </APIProvider>
  );
}
