"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/lib/ThemeContext";
import { useSession } from "@/lib/auth-client";
import { JEEPNEY_ROUTES, ZONE_CATEGORIES } from "@/data/map-layers";

export type FilterType = "all" | "academic" | "food" | "social" | "utility";

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
}

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
}: TopBarProps) {
	const router = useRouter();
	const { data: sessionData } = useSession();
	const [isTransitMenuOpen, setIsTransitMenuOpen] = useState(false);
	const [isZoneMenuOpen, setIsZoneMenuOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();

	const handleProfileClick = () => {
		if (sessionData?.user) {
			router.push("/dashboard");
		} else {
			router.push("/sign-in");
		}
	};

	const filters: FilterType[] = [
		"all",
		"academic",
		"food",
		"social",
		"utility",
	];

	return (
		<div className="ui-layer">
			{/* === LEFT ZONE === */}
            <div className="zone-left">
                <button type="button" onClick={onMenuClick} className="icon-button">
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

                <div className="transit-system-container">
                    <button 
                        type="button" 
                        className={`icon-button transit-btn ${isTransitMenuOpen ? 'active' : ''}`}
                        title="Toggle Transit Routes"
                        onClick={() => setIsTransitMenuOpen(!isTransitMenuOpen)}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                        <div className="extruded-menu">
                            {JEEPNEY_ROUTES.map((route) => {
                                const isActive = activeRoutes.includes(route.id);
                                const initial = route.name.replace("UP ", "").charAt(0).toUpperCase();

                                return (
                                    <button
                                        key={route.id}
                                        type="button"
                                        onClick={() => onToggleRoute(route.id)}
                                        className="route-node"
                                        title={route.name}
                                        style={{
                                            backgroundColor: isActive ? `${route.color}20` : 'rgba(255, 255, 255, 0.05)',
                                            color: isActive ? route.color : '#aaa',
                                            borderColor: isActive ? route.color : 'transparent',
                                            boxShadow: isActive ? `0 0 10px ${route.color}40` : 'none',
                                        }}
                                    >
                                        {initial}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

				<div className="transit-system-container">
                    <button 
                        type="button" 
                        className={`icon-button transit-btn ${isZoneMenuOpen ? 'active' : ''}`}
                        title="Toggle Zone Layers"
                        onClick={() => {
                            setIsZoneMenuOpen(!isZoneMenuOpen);
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                        </svg>
                    </button>

                    {isZoneMenuOpen && (
                        <div className="extruded-menu">
                            {ZONE_CATEGORIES.map((category) => {
                                const isActive = activeZoneCategories.includes(category.id);

                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => onToggleZoneCategory(category.id)}
                                        className="route-node"
                                        title={category.label}
                                        style={{
                                            backgroundColor: isActive ? `${category.color}20` : 'rgba(255, 255, 255, 0.05)',
                                            color: isActive ? category.color : '#aaa',
                                            borderColor: isActive ? category.color : 'transparent',
                                            boxShadow: isActive ? `0 0 10px ${category.color}40` : 'none',
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
			<div className="zone-center">
				<div className="search-block">
					<input
						type="text"
						placeholder="Search..."
						value={searchQuery || ""}
						onChange={(e) => onSearchChange(e.target.value)}
						className="search-input"
					/>
					<div className="search-icon-right">
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

				<div className="filter-row no-scrollbar">
					{filters.map((filter) => {
						const color = getFilterColor(filter);
						const isActive = activeFilter === filter;
						return (
							<button
								type="button"
								key={filter}
								onClick={() => onFilterChange(filter)}
								className={`filter-chip ${isActive ? "active" : ""}`}
								style={{
									borderColor: isActive ? color : "var(--border-color)",
									color: isActive ? "var(--bg-base)" : color,
									backgroundColor: isActive ? color : "var(--bg-panel)",
									transform: isActive ? "scale(1.1)" : "scale(1)",
								}}
							>
								{filter.toUpperCase()}
							</button>
						);
					})}
				</div>
			</div>

			{/* === RIGHT ZONE (Full Height Tool Stack) === */}
			<div className="zone-right">
				{/* Top Group */}
				<div className="tool-group">
					<button
						type="button"
						className="icon-button profile-btn"
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
									? "var(--neon-green, #00FF99)"
									: "currentColor"
							}
							strokeWidth="2.5"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
					</button>
					<button onClick={toggleTheme} className="icon-button theme-toggle">
						{theme === "dark" ? (
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
							</svg>
						) : (
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
				<div className="tool-group bottom-align">
					<button type="button" className="icon-button gps-btn">
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

					<div className="zoom-stack">
						<button type="button" className="control-button zoom-in">
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
						<div className="divider"></div>
						<button type="button" className="control-button zoom-out">
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

export const getFilterColor = (type: string) => {
	switch (type) {
		case "academic":
			return "#ff4d4d";
		case "food":
			return "#00ffa3";
		case "social":
			return "#ff007a";
		case "transit":
			return "#f4ff4d";
		case "utility":
			return "#00d1ff";
		default:
			return "#ffffff";
	}
};
