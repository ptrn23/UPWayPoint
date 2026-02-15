"use client";

import { HeadsUpDisplay } from "@/components/HeadsUpDisplay";
import { NeonPin } from "@/components/NeonPin";
import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { useState } from "react";

// SPRINT 1: Hardcoded Data
const HARDCODED_PINS = [
	{
		id: 1,
		name: "Alumni Engineers Hall",
		type: "academic",
		desc: "Home to the College of Engineering, featuring computer labs and the engineering library.",
		icon: "A",
		pos: { lat: 14.64867, lng: 121.06849 },
	},
	{
		id: 2,
		name: "CS Library",
		type: "academic",
		desc: "Quiet, air-conditioned library with extensive science and math resources.",
		icon: "C",
		pos: { lat: 14.64921, lng: 121.06895 },
	},
	{
		id: 3,
		name: "Melchor Hall",
		type: "academic",
		desc: "College of Arts and Letters building with classrooms and faculty offices.",
		icon: "M",
		pos: { lat: 14.65658, lng: 121.06946 },
	},
	{
		id: 4,
		name: "Sunken Garden",
		type: "social",
		desc: "Iconic oval-shaped garden, perfect for picnics, studying, and sunset viewing.",
		icon: "S",
		pos: { lat: 14.65485, lng: 121.06999 },
	},
	{
		id: 5,
		name: "Enriquez Shakes",
		type: "food",
		desc: "Fruit shake stall near College of Science offering fresh shakes and fruits.",
		icon: "E",
		pos: { lat: 14.65991, lng: 121.06612 },
	},
	{
		id: 6,
		name: "7-Eleven",
		type: "utility",
		desc: "24-hour convenience store near the shopping center, great for late-night snacks.",
		icon: "7",
		pos: { lat: 14.65822, lng: 121.06461 },
	},
	{
		id: 7,
		name: "Palma Hall CR",
		type: "utility",
		desc: "Clean restroom on the first floor of Palma Hall, accessible during office hours.",
		icon: "P",
		pos: { lat: 14.65349, lng: 121.06908 },
	},
	{
		id: 8,
		name: "Accenture Hall",
		type: "utility",
		desc: "Business administration building with reliable WiFi and air-conditioned study spaces.",
		icon: "A",
		pos: { lat: 14.64842, lng: 121.06855 },
	},
	{
		id: 9,
		name: "Quezon Hall",
		type: "academic",
		desc: "hiii",
		icon: "Q",
		pos: { lat: 14.655114156443288, lng: 121.06492168770944 },
	},
	{
		id: 10,
		name: "Area 2",
		type: "food",
		desc: "heyyy",
		icon: "A",
		pos: { lat: 14.659680383534933, lng: 121.06807840570266 },
	},
];

export default function Home() {
	const [selectedPinId, setSelectedPinId] = useState<number | null>(null);
	const [isLocked, setIsLocked] = useState(false);

	// find full pin object
	const selectedPin = HARDCODED_PINS.find((p) => p.id === selectedPinId);

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
          mapId='71238adec955b8c6d66f595a'
          disableDefaultUI={true}
          restriction={{
            latLngBounds: {
              north: 14.663668030362242,
              south: 14.645343854083508,
              east: 121.0755837087427,
              west: 121.05536053150871,
            },
            strictBounds: false
          }}
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
