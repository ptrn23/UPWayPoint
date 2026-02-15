import { useState, useCallback } from "react";
import { Pin } from "@/types/waypoint";

export type AppMode = 
  | "IDLE"      // Scanning map
  | "SELECTED"  // Pin clicked (Simple HUD)
  | "LOCKED"    // Double-clicked (Tracking Line)
  | "EXPANDED"  // "View More" clicked (Full details)
  | "MENU";     // Sidebar open

export function useWaypointState() {
  const [mode, setMode] = useState<AppMode>("IDLE");
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  // select a pin
  const selectPin = useCallback((pin: Pin) => {
    // if we click the SAME pin that is already selected...
    if (selectedPin?.id === pin.id) {
        // ...toggle lock mode
        setMode((prev) => (prev === "LOCKED" ? "SELECTED" : "LOCKED"));
    } else {
        // ...otherwise, just select the new one
        setSelectedPin(pin);
        setMode("SELECTED");
    }
  }, [selectedPin]);

  // clear/reset
  const clearSelection = useCallback(() => {
    if (mode === "LOCKED") {
        // if locked, downgrade to selected first (optional safety)
        setMode("SELECTED");
    } else {
        // otherwise, fully reset
        setMode("IDLE");
        setSelectedPin(null);
    }
  }, [mode]);

  // lock
  const toggleLock = useCallback(() => {
    if (!selectedPin) return; // can't lock if nothing is selected

    setMode((prev) => {
      // if we are locked, unlock. if we are selected, lock.
      return prev === "LOCKED" ? "SELECTED" : "LOCKED";
    });
  }, [selectedPin]);

  // open full details
  const expandDetails = useCallback(() => {
    if (selectedPin) setMode("EXPANDED");
  }, [selectedPin]);

  // toggle menu
  const toggleMenu = useCallback(() => {
    setMode((prev) => (prev === "MENU" ? "IDLE" : "MENU"));
  }, []);

  return {
    mode,
    selectedPin,
    selectPin,
    clearSelection,
    expandDetails,
    toggleMenu,
    toggleLock
  };
}