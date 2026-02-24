"use client";

interface MapCursorProps {
  heading?: number;
}

export function MapCursor({ heading = 0 }: MapCursorProps) {
  return (
        <div className="map-cursor-container">
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>

            <div className="cursor-arrow" style={{ transform: `rotate(${heading}deg)` }}>
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
          position: relative;
          z-index: 10;
          filter: drop-shadow(0 0 8px var(--neon-blue, #00E5FF));
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          background: transparent;
          border: 1.5px solid var(--neon-blue, #00E5FF);
          border-radius: 50%;
          opacity: 0; /* Hidden until animation starts */
          animation: radarPing 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          z-index: 1;
        }
        
        .pulse-ring.delay-1 { animation-delay: 0s; }
        .pulse-ring.delay-2 { animation-delay: 1.25s; }

        @keyframes radarPing {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(4.5);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
}