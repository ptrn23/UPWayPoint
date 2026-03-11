"use client";

import {
	APIProvider,
	Map as GoogleMap,
	AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { HeadsUpDisplay } from "@/components/HeadsUpDisplay";
import { NeonPin } from "@/components/NeonPin";
import { useWaypointState } from "@/hooks/useWaypointState";
import { TopBar, type FilterType } from "@/components/TopBar";
import { AddPinModal } from "@/components/AddPinModal";
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

export default function Home() {
	const { data: pins } = trpc.pin.getAll.useQuery();

	const {
		mode,
		selectedPin,
		selectPin,
		clearSelection,
		expandDetails,
		toggleMenu,
		toggleLock,
	} = useWaypointState();
	const [activeFilter, setActiveFilter] = useState<FilterType>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [isAddingPin, setIsAddingPin] = useState(false);

	const [pendingPinCoords, setPendingPinCoords] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const cursorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isAddingPin) return;
		const handleMouseMove = (e: MouseEvent) => {
			if (cursorRef.current) {
				cursorRef.current.style.transform = `translate(${e.clientX - 24}px, ${e.clientY - 24}px)`;
			}
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [isAddingPin]);

	const mockUserLocation = { lat: 14.6549, lng: 121.0645 };
	const mockHeading = 45;

	return (
		<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}>
			<main style={{ width: "100vw", height: "100vh", position: "relative" }}>
				{/* MAP LAYER */}
				<GoogleMap
					defaultCenter={{ lat: 14.6549, lng: 121.0645 }}
					defaultZoom={19}
					minZoom={17}
					mapId={process.env.NEXT_PUBLIC_MAP_ID || "71238adec955b8c6d66f595a"}
					gestureHandling={"greedy"}
					disableDefaultUI={true}
					onClick={(e) => {
						if (isAddingPin) {
							const lat = e.detail.latLng?.lat;
							const lng = e.detail.latLng?.lng;

							if (lat && lng) {
								setPendingPinCoords({ lat, lng });
								setIsAddingPin(false);
							}
						} else {
							clearSelection();
						}
					}}
					restriction={{
						latLngBounds: {
							north: 14.663668,
							south: 14.645343,
							east: 121.075583,
							west: 121.05536,
						},
						strictBounds: false,
					}}
				>
					{pins
						?.map((p) => {
							return { ...p, type: "academic" };
						})
						.map((pinData) => {
							const matchesCategory =
								activeFilter === "all" || pinData.type === activeFilter;
							const matchesSearch =
								pinData.title
									.toLowerCase()
									.includes(searchQuery.toLowerCase()) ||
								pinData.description
									?.toLowerCase()
									.includes(searchQuery.toLowerCase());

							const isVisible = matchesCategory && matchesSearch ? true : false;

							return (
								<AdvancedMarker
									key={pinData.id}
									position={{ lat: pinData.latitude, lng: pinData.longitude }}
									zIndex={isVisible ? 10 : 0}
								>
									<NeonPin
										pin={pinData}
										isSelected={selectedPin?.id === pinData.id}
										isLocked={
											mode === "LOCKED" && selectedPin?.id === pinData.id
										}
										isVisible={isVisible}
										onClick={() => selectPin(pinData)}
									/>
								</AdvancedMarker>
							);
						})}
				</GoogleMap>

				{/* TOP BAR */}
				<TopBar
					onMenuClick={toggleMenu}
					activeFilter={activeFilter}
					onFilterChange={setActiveFilter}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
				/>

				{/* TARGETING CROSSHAIR (Only visible when armed) */}
				{isAddingPin && (
					<div
						ref={cursorRef}
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							width: "48px",
							height: "48px",
							pointerEvents: "none", // Critical: Allows clicks to pass through to the map
							zIndex: 100,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "var(--neon-blue, #00E5FF)",
							filter: "drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))",
							transition: "opacity 0.2s ease",
						}}
					>
						{/* Tactical Crosshair SVG */}
						<svg
							width="48"
							height="48"
							viewBox="0 0 48 48"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
						>
							<circle cx="24" cy="24" r="10" strokeDasharray="4 4" />
							<line x1="24" y1="2" x2="24" y2="10" />
							<line x1="24" y1="38" x2="24" y2="46" />
							<line x1="2" y1="24" x2="10" y2="24" />
							<line x1="38" y1="24" x2="46" y2="24" />
							<circle cx="24" cy="24" r="2" fill="currentColor" />
						</svg>
					</div>
				)}

				{/* UI LAYER */}
				<HeadsUpDisplay
					selectedPin={selectedPin}
					isLocked={mode === "LOCKED"}
					onLockClick={toggleLock}
					onClearSelection={clearSelection}
					onAddPinClick={() => {
						clearSelection();
						setIsAddingPin(true);
					}}
				/>

				{pendingPinCoords && (
					<AddPinModal
						coords={pendingPinCoords}
						onCancel={() => setPendingPinCoords(null)}
						onSave={(newPin) => {
							// HANDLE NEW PIN WITH INVALIDATE
							// setPins((prev) => [...prev, newPin]);
							selectPin(newPin);
							setPendingPinCoords(null);
						}}
					/>
				)}
			</main>
		</APIProvider>
	);
}
