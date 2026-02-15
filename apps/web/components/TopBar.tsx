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
    <div className="top-bar-container">
      {/* NAVIGATION ROW */}
      <div className="nav-row">
        
        {/* LEFTMOST: Menu */}
        <button onClick={onMenuClick} className="icon-button menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* CENTERED: Search Bar */}
        <div className="search-wrapper">
          <input 
            type="text"
            placeholder="Search Waypoints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="search-icon-right">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <circle cx="11" cy="11" r="8"></circle>
               <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* RIGHTMOST: Profile (Hidden on Mobile) */}
        <button className="icon-button profile-btn">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
           </svg>
        </button>
      </div>

      {/* FILTER ROW */}
      <div className="filter-row no-scrollbar">
        {filters.map((filter) => {
          const chipColor = getFilterColor(filter);
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`filter-chip ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? chipColor : 'rgba(255,255,255,0.15)',
                color: isActive ? '#000' : chipColor,
                backgroundColor: isActive ? chipColor : 'rgba(3, 3, 4, 0.7)',
                boxShadow: 'none' // Removed glow
              }}
            >
              {filter.toUpperCase()}
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .top-bar-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          pointer-events: none;
        }

        .nav-row {
          display: flex;
          align-items: center;
          justify-content: center; /* Centers the search bar */
          position: relative; /* Allows buttons to pin to edges */
          width: 100%;
          height: 48px;
          pointer-events: auto;
        }

        .icon-button {
          position: absolute; /* Pins buttons to the far corners */
          width: 48px;
          height: 48px;
          background: rgba(3, 3, 4, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .menu-btn { left: 0; }
        .profile-btn { right: 0; }

        @media (max-width: 768px) {
          .profile-btn { display: none; }
        }

        .search-wrapper {
          width: 100%;
          max-width: 400px; /* Adjust this for your preferred bar width */
          position: relative;
          margin: 0 60px; /* Prevents bar from overlapping corner buttons */
        }

        .search-input {
          width: 100%;
          height: 48px;
          background: rgba(3, 3, 4, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          padding: 0 48px 0 18px; /* Padding-right for the icon */
          color: white;
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--neon-green, #00FF99);
        }

        .search-icon-right {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
          pointer-events: none;
        }

        .filter-row {
          display: flex;
          justify-content: center;
          gap: 8px;
          overflow-x: auto;
          width: 100%;
          pointer-events: auto;
          padding-bottom: 4px;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .filter-chip {
          padding: 8px 16px;
          border: 1px solid;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800; /* Bold/Boldest font back */
          letter-spacing: 0.05em;
          white-space: nowrap;
          cursor: pointer;
          transition: transform 0.1s;
          font-family: 'Inter', system-ui, sans-serif; /* Clean, bold system font */
        }

        .filter-chip:active { transform: scale(0.95); }
      `}</style>
    </div>
  );
}

export const getFilterColor = (type: string) => {
  switch (type) {
    case "academic": return "var(--neon-maroon, #ff0000)";
    case "food": return "var(--neon-green, #00ff00)";
    case "social": return "var(--neon-pink, #ff00ff)";
    case "transit": return "var(--neon-yellow, #ffff00)";
    case "utility": return "var(--neon-blue, #0000ff)";
    default: return "#ffffff";
  }
};