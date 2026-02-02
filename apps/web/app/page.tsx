"use client";

import { useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { HeadsUpDisplay } from "@/components/HeadsUpDisplay";
import { NeonPin } from "@/components/NeonPin";
import { midnightTheme } from "@/config/mapStyles";

// SPRINT 1: Hardcoded Data
const HARDCODED_PINS = [
  { id: 1, name: "Quezon Hall", type: "academic", desc: "hiii", icon: "Q", pos: { lat: 14.655114156443288, lng: 121.06492168770944 } },
  { id: 2, name: "Area 2", type: "food", desc: "heyyy", icon: "A", pos: { lat: 14.659680383534933, lng: 121.06807840570266 } },
];

export default function Home() {
  const [selectedPinId, setSelectedPinId] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // find full pin object
  const selectedPin = HARDCODED_PINS.find(p => p.id === selectedPinId);

  const handlePinClick = (id: number) => {
    if (selectedPinId === id) {
      // toggle lock if clicking same pin
      setIsLocked(!isLocked);
    } else {
      // select new pin
      setSelectedPinId(id);
      setIsLocked(false);
    }
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}>
      <main style={{ width: "100vw", height: "100vh", position: "relative" }}>
        
        {/*MAP LAYER */}
        <Map
          defaultCenter={{ lat: 14.6549, lng: 121.0645 }}
          defaultZoom={19}
          minZoom={17}
          mapId="default"
          disableDefaultUI={true}
          styles={midnightTheme}
          style={{ width: "100%", height: "100%" }}
        >
          {HARDCODED_PINS.map(pin => (
            <NeonPin 
              key={pin.id}
              position={pin.pos}
              type={pin.type as any}
              icon={pin.icon}
              isSelected={selectedPinId === pin.id}
              isLocked={selectedPinId === pin.id && isLocked}
              onClick={() => handlePinClick(pin.id)}
            />
          ))}
        </Map>

        {/* UI LAYER */}
        <HeadsUpDisplay 
          selectedPin={selectedPin} 
          isLocked={isLocked}
          onLockClick={() => setIsLocked(!isLocked)}
        />
        
      </main>
    </APIProvider>
  );
}