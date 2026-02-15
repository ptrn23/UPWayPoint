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
    <div className="absolute top-4 left-0 right-0 z-10 px-4 flex flex-col gap-3 pointer-events-none">
      
      {/* search and menu */}
      <div className="flex gap-3 pointer-events-auto max-w-md mx-auto w-full">
        
        {/* menu button */}
        <button 
          onClick={onMenuClick}
          className="bg-black/80 backdrop-blur-md border border-white/20 text-white p-3 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          {/* hamburger icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* search bar */}
        <div className="flex-1 relative">
           <input 
             type="text"
             placeholder="Search location..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full h-full bg-black/80 backdrop-blur-md border border-white/20 rounded-xl px-4 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--neon-green)] focus:shadow-[0_0_15px_rgba(0,255,153,0.3)] transition-all shadow-lg"
           />
           {/* search icon */}
           <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
             </svg>
           </div>
        </div>
      </div>

      {/* filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 pointer-events-auto max-w-md mx-auto w-full no-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all shadow-lg
              ${activeFilter === filter 
                ? "bg-[var(--neon-blue)] border-[var(--neon-blue)] text-black shadow-[0_0_10px_var(--neon-blue)]" 
                : "bg-black/60 border-white/20 text-white hover:bg-white/10"}
            `}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}