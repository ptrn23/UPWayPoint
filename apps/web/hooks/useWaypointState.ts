import { useState, useCallback } from "react";

import type { PinRouterOutputs } from "@repo/api";
type Pin = PinRouterOutputs["getById"];

export type AppMode =
  | "IDLE" // Scanning map
  | "SELECTED" // Pin clicked (Simple HUD)
  | "LOCKED" // Double-clicked (Tracking Line)
  | "EXPANDED" // "View More" clicked (Full details)
  | "MENU"; // Sidebar open

export function useWaypointState() {
  const [mode, setMode] = useState<AppMode>("IDLE");
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

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

  return {
    mode,
    selectedPinId,
    selectPin,
    clearSelection,
    expandDetails,
    toggleMenu,
    toggleLock,
  };
}
