"use client";

export function MapCursor() {
  return (
    <div className="map-cursor-container">
      <div className="cursor-arrow">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="var(--neon-blue, #00E5FF)" 
          strokeWidth="2" 
          strokeLinejoin="round"
        >
          <polygon 
            points="12 2 22 22 12 17 2 22" 
            fill="rgba(0, 229, 255, 0.4)"
          ></polygon>
        </svg>
      </div>

      <style jsx>{`
        .map-cursor-container {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        
        .cursor-arrow {
          filter: drop-shadow(0 0 8px var(--neon-blue, #00E5FF));
        }
      `}</style>
    </div>
  );
}