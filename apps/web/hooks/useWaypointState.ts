import { useState, useCallback } from "react";

export type AppMode =
  | "IDLE" // Scanning map
  | "SELECTED" // Pin clicked (Simple HUD)
  | "LOCKED" // Double-clicked (Tracking Line)
  | "EXPANDED" // "View More" clicked (Full details)
  | "NAVIGATING" // Navigation mode active (route displayed)
  | "MENU"; // Sidebar open

export function useWaypointState() {
  const [mode, setMode] = useState<AppMode>("IDLE");
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [navigationPinId, setNavigationPinId] = useState<string | null>(null);

  // select a pin
  const selectPin = useCallback(
    (pinId: string) => {
      // if we click the SAME pin that is already selected...
      if (selectedPinId === pinId) {
        // ...toggle lock mode
        setMode((prev) => (prev === "LOCKED" ? "SELECTED" : "LOCKED"));
      } else {
        // ...otherwise, just select the new one
        setSelectedPinId(pinId);
        setMode("SELECTED");
      }
    },
    [selectedPinId],
  );

  // clear/reset
  const clearSelection = useCallback(() => {
    if (mode === "LOCKED") {
      // if locked, downgrade to selected first (optional safety)
      setMode("SELECTED");
    } else {
      // otherwise, fully reset
      setMode("IDLE");
      setSelectedPinId(null);
      setNavigationPinId(null);
    }
  }, [mode]);

  // lock
  const toggleLock = useCallback(() => {
    if (!selectedPinId) return; // can't lock if nothing is selected

    setMode((prev) => {
      // if we are locked, unlock. if we are selected, lock.
      return prev === "LOCKED" ? "SELECTED" : "LOCKED";
    });
  }, [selectedPinId]);

  // open full details
  const expandDetails = useCallback(() => {
    if (selectedPinId) setMode("EXPANDED");
  }, [selectedPinId]);

  // toggle menu
  const toggleMenu = useCallback(() => {
    setMode((prev) => (prev === "MENU" ? "IDLE" : "MENU"));
  }, []);

  // start navigation to a pin
  const startNavigation = useCallback(
    (pinId: string) => {
      setNavigationPinId(pinId);
      setMode("NAVIGATING");
    },
    [],
  );

  // stop navigation
  const stopNavigation = useCallback(() => {
    setNavigationPinId(null);
    // Don't fully reset - stay in selected mode with the pin still selected
    if (selectedPinId) {
      setMode("SELECTED");
    } else {
      setMode("IDLE");
    }
  }, [selectedPinId]);

  return {
    mode,
    selectedPinId,
    navigationPinId,
    selectPin,
    clearSelection,
    expandDetails,
    toggleMenu,
    toggleLock,
    startNavigation,
    stopNavigation,
  };
}
