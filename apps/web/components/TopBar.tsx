"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";
import { useSession } from "@/lib/auth-client";
import { useMap } from "@vis.gl/react-google-maps";
import { JEEPNEY_ROUTES, ZONE_CATEGORIES } from "@/data/map-layers";
import {
	PIN_CATEGORIES,
	type FilterType,
	getPinColor,
} from "@/data/pin-categories";

interface TopBarProps {
	onMenuClick: () => void;
	activeFilter: FilterType;
	onFilterChange: (filter: FilterType) => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	activeRoutes?: string[];
	onToggleRoute?: (routeId: string) => void;
	activeZoneCategories?: string[];
	onToggleZoneCategory?: (categoryId: string) => void;
	userLocation?: { lat: number; lng: number };
	hideControls?: boolean;
}

export type { FilterType };

export function TopBar({
	onMenuClick,
	activeFilter,
	onFilterChange,
	searchQuery,
	onSearchChange,
	activeRoutes = [],
	onToggleRoute = () => {},
	activeZoneCategories = [],
	onToggleZoneCategory = () => {},
	userLocation = { lat: 14.6549, lng: 121.0645 },
	hideControls = false,
}: TopBarProps) {
	const router = useRouter();
	const { data: sessionData } = useSession();
	const [isTransitMenuOpen, setIsTransitMenuOpen] = useState(false);
	const [isZoneMenuOpen, setIsZoneMenuOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();

	const map = useMap();

	const handleCenterMap = () => {
		if (map && userLocation) {
			map.panTo(userLocation);
			map.setZoom(19);
		}
	};

	const handleZoomIn = () => {
		if (map) {
			const currentZoom = map.getZoom() || 19;
			map.setZoom(currentZoom + 1);
		}
	};

	const handleZoomOut = () => {
		if (map) {
			const currentZoom = map.getZoom() || 19;
			map.setZoom(currentZoom - 1);
		}
	};

	const handleProfileClick = () => {
		if (sessionData?.user) {
			router.push("/dashboard");
		} else {
			router.push("/sign-in");
		}
	};

	const filters: FilterType[] = [
		"all",
		...PIN_CATEGORIES.map((c) => c.id as FilterType),
	];

	return (
		<div className="absolute inset-0 pointer-events-none flex justify-between p-2 z-[100] overflow-hidden">
			{/* === LEFT ZONE === */}
			<div
                className="absolute left-2 z-20 pointer-events-auto bottom-6 top-auto flex flex-col-reverse gap-2 md:top-2 md:bottom-auto md:flex-col"
                style={{
                    opacity: hideControls ? 0 : 1,
                    pointerEvents: hideControls ? "none" : "auto",
                    transition: "opacity 0.3s ease",
                }}
            >
				<button type="button" onClick={onMenuClick} className="w-11 h-11 bg-panel backdrop-blur-md border border-border-color rounded-[14px] flex justify-center items-center text-primary cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-[0_4px_12px_var(--border-color)] hover:bg-panel-hover hover:scale-105 active:scale-95 shrink-0">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="3" y1="12" x2="21" y2="12"></line>
						<line x1="3" y1="6" x2="21" y2="6"></line>
						<line x1="3" y1="18" x2="21" y2="18"></line>
					</svg>
				</button>

				<div className="relative flex items-center">
					<button
						type="button"
						className={`w-11 h-11 bg-panel backdrop-blur-md border border-border-color rounded-[14px] flex justify-center items-center text-primary cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-[0_4px_12px_var(--border-color)] hover:bg-panel-hover hover:scale-105 active:scale-95 shrink-0 ${isTransitMenuOpen ? "!bg-neon-blue/15 !text-neon-blue !border-neon-blue" : ""}`}
						title="Toggle Transit Routes"
						onClick={() => setIsTransitMenuOpen(!isTransitMenuOpen)}
					>
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="4" y="3" width="16" height="16" rx="2" ry="2"></rect>
							<path d="M4 11h16"></path>
							<path d="M8 15h.01"></path>
							<path d="M16 15h.01"></path>
							<path d="M6 19v2"></path>
							<path d="M18 19v2"></path>
						</svg>
					</button>

					{/* Extruding Route Nodes */}
					{isTransitMenuOpen && (
						<div className="absolute left-full ml-3 flex gap-2 bg-panel backdrop-blur-md border border-border-color rounded-full p-1.5 animate-extrude">
							{JEEPNEY_ROUTES.map((route) => {
								const isActive = activeRoutes.includes(route.id);
								const initial = route.name
									.replace("UP ", "")
									.charAt(0)
									.toUpperCase();

								return (
									<button
										key={route.id}
										type="button"
										onClick={() => onToggleRoute(route.id)}
										className="w-8 h-8 rounded-full flex items-center justify-center font-chakra font-bold text-[14px] cursor-pointer border border-transparent transition-all duration-200 hover:scale-110 hover:!bg-panel-hover hover:!text-primary"
										title={route.name}
										style={{
											backgroundColor: isActive
												? `${route.color}20`
												: "var(--bg-panel-hover)",
											color: isActive ? route.color : "var(--text-secondary)",
											borderColor: isActive ? route.color : "transparent",
											boxShadow: isActive
												? `0 0 10px ${route.color}40`
												: "none",
										}}
									>
										{initial}
									</button>
								);
							})}
						</div>
					)}
				</div>

				<div className="relative flex items-center">
					<button
						type="button"
						className={`w-11 h-11 bg-panel backdrop-blur-md border border-border-color rounded-[14px] flex justify-center items-center text-primary cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-[0_4px_12px_var(--border-color)] hover:bg-panel-hover hover:scale-105 active:scale-95 shrink-0 ${isZoneMenuOpen ? "!bg-neon-blue/15 !text-neon-blue !border-neon-blue" : ""}`}
						title="Toggle Zone Layers"
						onClick={() => {
							setIsZoneMenuOpen(!isZoneMenuOpen);
						}}
					>
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
						</svg>
					</button>

					{isZoneMenuOpen && (
						<div className="absolute left-full ml-3 flex gap-2 bg-panel backdrop-blur-md border border-border-color rounded-full p-1.5 animate-extrude">
							{ZONE_CATEGORIES.map((category) => {
								const isActive = activeZoneCategories.includes(category.id);

								return (
									<button
										key={category.id}
										type="button"
										onClick={() => onToggleZoneCategory(category.id)}
										className="w-8 h-8 rounded-full flex items-center justify-center font-chakra font-bold text-[14px] cursor-pointer border border-transparent transition-all duration-200 hover:scale-110 hover:!bg-panel-hover hover:!text-primary"
										title={category.label}
										style={{
											backgroundColor: isActive
												? `${category.color}20`
												: "var(--bg-panel-hover)",
											color: isActive ? category.color : "var(--text-secondary)",
											borderColor: isActive ? category.color : "transparent",
											boxShadow: isActive
												? `0 0 10px ${category.color}40`
												: "none",
										}}
									>
										{category.initial}
									</button>
								);
							})}
						</div>
					)}
				</div>
			</div>

		{/* === CENTER ZONE (Search + Filters) === */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-max max-w-[calc(100vw-120px)] flex flex-col items-stretch gap-2 pointer-events-none z-10">
                
                <div className="relative w-full mx-auto pointer-events-auto flex items-center transition-transform duration-200 focus-within:scale-105">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery || ""}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-11 bg-panel backdrop-blur-md border border-border-color rounded-[14px] px-3.5 pr-10 text-primary text-[13px] font-bold font-chakra focus:outline-none focus:border-white/30"
                    />
					<div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none z-10">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
					</div>
				</div>

				<div className="flex justify-center gap-2 w-full overflow-x-auto py-1 pointer-events-auto no-scrollbar">
					{filters.map((filter) => {
						const color = getPinColor(filter);
						const isActive = activeFilter === filter;
						return (
							<button
								type="button"
								key={filter}
								onClick={() => onFilterChange(filter)}
								className={`px-3.5 py-1.5 border rounded-full text-[10px] font-black whitespace-nowrap cursor-pointer font-chakra transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
									isActive ? "scale-100" : "scale-100"
								}`}
								style={{
									borderColor: isActive ? color : "var(--border-color)",
									color: isActive ? "var(--bg-base)" : color,
									backgroundColor: isActive ? color : "var(--bg-panel)",
								}}
							>
								{filter.toUpperCase()}
							</button>
						);
					})}
				</div>
			</div>

			{/* === RIGHT ZONE (Full Height Tool Stack) === */}
			<div className="absolute top-2 right-2 bottom-6 flex flex-col justify-between w-11 z-20 pointer-events-auto">
                {/* Top Group */}
                <div className="flex flex-col gap-2">
					<button
						type="button"
						className="w-11 h-11 bg-panel backdrop-blur-md border border-border-color rounded-[14px] flex justify-center items-center text-primary cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-[0_4px_12px_var(--border-color)] hover:bg-panel-hover hover:scale-105 active:scale-95 shrink-0 profile-btn hidden md:flex"
						onClick={handleProfileClick}
						title={sessionData?.user ? "Access Dashboard" : "System Login"}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke={
								sessionData?.user
									? "var(--status-success)"
									: "currentColor"
							}
							strokeWidth="2.5"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
					</button>
					<button
						type="button"
						onClick={toggleTheme}
						className="w-11 h-11 bg-panel backdrop-blur-md border border-border-color rounded-[14px] flex justify-center items-center text-primary cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-[0_4px_12px_var(--border-color)] hover:bg-panel-hover hover:scale-105 active:scale-95 shrink-0 theme-toggle hidden md:flex"
					>
						{theme === "dark" ? (
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="var(--theme-moon)"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
							</svg>
						) : (
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="var(--theme-sun)"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="5"></circle>
								<line x1="12" y1="1" x2="12" y2="3"></line>
								<line x1="12" y1="21" x2="12" y2="23"></line>
								<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
								<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
								<line x1="1" y1="12" x2="3" y2="12"></line>
								<line x1="21" y1="12" x2="23" y2="12"></line>
								<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
								<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
							</svg>
						)}
					</button>
				</div>

				{/* Bottom Group */}
				<div
					className="flex flex-col gap-2 mt-auto"
					style={{
						opacity: hideControls ? 0 : 1,
						pointerEvents: hideControls ? "none" : "auto",
						transition: "opacity 0.3s ease",
					}}
				>
					<button
						type="button"
						className="w-11 h-11 bg-panel backdrop-blur-md border border-border-color rounded-[14px] flex justify-center items-center text-primary cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-[0_4px_12px_var(--border-color)] hover:bg-panel-hover hover:scale-105 active:scale-95 shrink-0 gps-btn"
						onClick={handleCenterMap}
						title="Center on Current Location"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						>
							<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
						</svg>
					</button>

					<div className="flex flex-col bg-panel backdrop-blur-md border border-border-color rounded-xl overflow-hidden">
						<button
							type="button"
							className="w-11 h-11 bg-transparent border-none text-primary cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-panel-hover active:bg-border-color"
							onClick={handleZoomIn}
							title="Zoom In"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
							>
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
						</button>
						<div className="h-[1px] bg-border-color w-4/5 mx-auto"></div>
						<button
							type="button"
							className="w-11 h-11 bg-transparent border-none text-primary cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-panel-hover active:bg-border-color"
							onClick={handleZoomOut}
							title="Zoom Out"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
							>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
