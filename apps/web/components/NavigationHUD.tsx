"use client";

import { clsxm } from "@repo/ui/clsxm";

interface NavigationHUDProps {
  distanceMeters: number;
  durationSeconds: number;
  isLoading?: boolean;
  error?: string | null;
  onCancel: () => void;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

export function NavigationHUD({
  distanceMeters,
  durationSeconds,
  isLoading,
  error,
  onCancel,
}: NavigationHUDProps) {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[20] pointer-events-auto">
      <div
        className={clsxm(
          "flex flex-col items-center gap-2 px-6 py-4 rounded-2xl",
          "bg-[var(--bg-panel)] backdrop-blur-[20px] border border-[var(--border-color)]",
          "shadow-[0_8px_32px_var(--shadow-color)]",
          "transition-all duration-300 ease-out",
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
            <span className="font-chakra text-[14px] text-primary">
              Calculating route...
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2">
            <span className="font-nunito text-[13px] text-red-500">
              {error}
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 rounded-lg bg-transparent border border-border-color text-secondary font-chakra text-[12px] font-bold cursor-pointer transition-colors hover:bg-panel-hover"
            >
              DISMISS
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-6">
              {/* Distance */}
              <div className="flex flex-col items-center">
                <span className="font-cubao-wide text-[10px] uppercase tracking-[0.15em] text-secondary">
                  Distance
                </span>
                <span className="font-chakra text-[22px] font-black text-neon-blue">
                  {formatDistance(distanceMeters)}
                </span>
              </div>

              {/* Divider */}
              <div className="w-[1px] h-10 bg-border-color" />

              {/* Duration */}
              <div className="flex flex-col items-center">
                <span className="font-cubao-wide text-[10px] uppercase tracking-[0.15em] text-secondary">
                  Walking Time
                </span>
                <span className="font-chakra text-[22px] font-black text-neon-blue">
                  {formatDuration(durationSeconds)}
                </span>
              </div>
            </div>

            {/* Walking indicator */}
            <div className="flex items-center gap-2 mt-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neon-blue"
              >
                <circle cx="12" cy="5" r="2" />
                <path d="m9 20 3-6 3 6" />
                <path d="m6 8 6 2 6-2" />
                <path d="M12 10v4" />
              </svg>
              <span className="font-cubao text-[11px] text-secondary">
                Follow the blue route on map
              </span>
            </div>

            {/* Cancel button */}
            <button
              type="button"
              onClick={onCancel}
              className="mt-2 px-4 py-1.5 rounded-lg bg-transparent border border-border-color text-secondary font-chakra text-[11px] font-bold cursor-pointer transition-colors hover:bg-panel-hover hover:text-primary"
            >
              END NAVIGATION
            </button>
          </>
        )}
      </div>
    </div>
  );
}
