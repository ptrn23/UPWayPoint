"use client";

interface MapCursorProps {
  heading?: number;
}

export function MapCursor({ heading = 0 }: MapCursorProps) {
  return (
    <div className="relative w-6 h-6 flex items-center justify-center pointer-events-none">
      {/* PULSE RINGS */}
      <div className="absolute w-full h-full bg-transparent border-[1.5px] border-neon-blue rounded-full opacity-0 z-[1] animate-[radarPing_2.5s_cubic-bezier(0.215,0.61,0.355,1)_infinite] [animation-delay:0s]"></div>
      <div className="absolute w-full h-full bg-transparent border-[1.5px] border-neon-blue rounded-full opacity-0 z-[1] animate-[radarPing_2.5s_cubic-bezier(0.215,0.61,0.355,1)_infinite] [animation-delay:1.25s]"></div>

      {/* CURSOR ARROW */}
      <div
        className="relative z-10 drop-shadow-[0_0_8px_var(--neon-blue)] transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
        style={{ transform: `rotate(${heading}deg)` }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--neon-blue)"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <polygon
            points="12 2 22 22 12 17 2 22"
            fill="color-mix(in oklab, white 20%, var(--neon-blue))"
          ></polygon>
        </svg>
      </div>
    </div>
  );
}