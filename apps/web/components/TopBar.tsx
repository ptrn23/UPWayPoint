"use client";

import { useState } from "react";

export type FilterType = "all" | "academic" | "food" | "social" | "utility";

interface TopBarProps {
  onMenuClick: () => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TopBar({ onMenuClick, activeFilter, onFilterChange }: TopBarProps) {
  const [search, setSearch] = useState("");
  const filters: FilterType[] = ["all", "academic", "food", "social", "utility"];

  return (
    <>
      <div className="ui-layer">
        
        {/* === LEFT ZONE === */}
        <div className="zone-left">
          <button onClick={onMenuClick} className="icon-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* === CENTER ZONE (Search + Filters) === */}
        <div className="zone-center">
          <div className="search-block">
             <input 
                type="text"
                placeholder="Search Waypoints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <div className="search-icon-right">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                  key={filter}
                  onClick={() => onFilterChange(filter)}
                  className={`filter-chip ${isActive ? 'active' : ''}`}
                  style={{
                    borderColor: isActive ? color : 'rgba(255,255,255,0.15)',
                    color: isActive ? '#000' : color,
                    backgroundColor: isActive ? color : 'rgba(10, 10, 12, 0.9)',
                    // The Bouncy Scale Animation
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
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
              <button className="icon-button profile-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                     <circle cx="12" cy="7" r="4"></circle>
                  </svg>
              </button>
              <button className="icon-button theme-toggle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                     <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
              </button>
           </div>

           {/* Bottom Group */}
           <div className="tool-group bottom-align">
              <button className="icon-button gps-btn">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                 </svg>
              </button>
              
              <div className="zoom-stack">
                <button className="control-button zoom-in">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                   </svg>
                </button>
                <div className="divider"></div>
                <button className="control-button zoom-out">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                   </svg>
                </button>
             </div>
           </div>
        </div>
      </div>
    </>
  );
}

export const getFilterColor = (type: string) => {
  switch (type) {
    case "academic": return "#ff4d4d";
    case "food": return "#00ffa3";
    case "social": return "#ff007a";
    case "transit": return "#f4ff4d";
    case "utility": return "#00d1ff";
    default: return "#ffffff";
  }
};