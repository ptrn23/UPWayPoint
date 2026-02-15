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
      <div className="nav-row">
        <button onClick={onMenuClick} className="icon-button menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className="search-wrapper">
          <input 
            type="text"
            placeholder="Search Waypoints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          
          <div className="search-icon-right">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <circle cx="11" cy="11" r="8"></circle>
               <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        <button className="icon-button profile-btn">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
           </svg>
        </button>
      </div>

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
                borderColor: isActive ? chipColor : 'rgba(255,255,255,0.1)',
                color: isActive ? '#000' : chipColor,
                backgroundColor: isActive ? chipColor : 'rgba(3, 3, 4, 0.6)',
                boxShadow: isActive ? `0 0 15px ${chipColor}` : 'none'
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
          gap: 12px;
          pointer-events: none;
        }

        .nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          pointer-events: auto;
        }

        .icon-button {
          width: 48px;
          height: 48px;
          background: rgba(3, 3, 4, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .profile-btn {
          display: flex; /* Shown by default */
        }

        /* MOBILE HIDE PROFILE */
        @media (max-width: 768px) {
          .profile-btn {
            display: none;
          }
          .nav-row {
            max-width: 500px;
          }
        }

        .search-wrapper {
          flex: 1;
          position: relative;
          max-width: 500px;
        }

        .search-input {
          width: 100%;
          height: 48px;
          background: rgba(3, 3, 4, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 0 44px 0 16px;
          color: white;
          font-family: inherit;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--neon-green, #00FF99);
          box-shadow: 0 0 15px rgba(0, 255, 153, 0.2);
        }

        .search-icon-right {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }

        .filter-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          max-width: 500px;
          margin: 0 auto;
          width: 100%;
          pointer-events: auto;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .filter-chip {
          padding: 6px 16px;
          border: 1px solid;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
        }
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
    default: return "#ccc";
  }
};