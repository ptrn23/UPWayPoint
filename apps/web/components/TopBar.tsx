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
      <div className="top-bar-container">
        <div className="nav-row">
          <button onClick={onMenuClick} className="icon-button menu-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <circle cx="11" cy="11" r="8"></circle>
                 <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          <div className="top-right-stack">
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
                  borderColor: isActive ? chipColor : 'rgba(255,255,255,0.12)',
                  color: isActive ? '#000' : chipColor,
                  backgroundColor: isActive ? chipColor : 'rgba(10, 10, 12, 0.8)',
                }}
              >
                {filter.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="bottom-right-controls">
         <button className="control-button gps-btn">
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

      <style jsx>{`
        .top-bar-container {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 100; padding: 8px;
          display: flex; flex-direction: column; gap: 10px;
          pointer-events: none;
        }

        .nav-row {
          display: flex; align-items: flex-start; justify-content: center;
          position: relative; width: 100%; pointer-events: auto;
        }

        .icon-button, .control-button {
          background: rgba(10, 10, 12, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.1s;
        }

        .icon-button { width: 44px; height: 44px; border-radius: 10px; }
        .control-button { width: 48px; height: 48px; border-radius: 12px; }

        .menu-btn { position: absolute; left: 4px; }
        
        .top-right-stack {
          position: absolute; right: 4px;
          display: flex; flex-direction: column; gap: 8px;
        }

        @media (max-width: 768px) {
          .profile-btn { display: none; }
        }

        .search-wrapper { width: 100%; max-width: 280px; position: relative; }
        .search-input {
          width: 100%; height: 44px;
          background: rgba(10, 10, 12, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0 40px 0 14px;
          color: white; font-family: inherit; font-size: 13px; font-weight: 500;
        }

        .search-icon-right { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #aaa; }

        .filter-row {
          display: flex; gap: 6px; overflow-x: auto; width: 100%;
          pointer-events: auto; padding: 0 4px;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        .filter-chip {
          padding: 6px 14px; border: 1px solid; border-radius: 18px;
          font-size: 10px; font-weight: 900; white-space: nowrap;
        }

        /* BOTTOM RIGHT CONTROLS */
        .bottom-right-controls {
          position: absolute; bottom: 24px; right: 12px;
          display: flex; flex-direction: column; gap: 12px;
          z-index: 100; pointer-events: auto;
        }

        .zoom-stack {
          display: flex; flex-direction: column;
          background: rgba(10, 10, 12, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .zoom-stack .control-button { border: none; border-radius: 0; }
        .divider { height: 1px; background: rgba(255, 255, 255, 0.1); width: 80%; margin: 0 auto; }
        
        .control-button:active { transform: scale(0.92); background: rgba(255, 255, 255, 0.1); }
      `}</style>
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