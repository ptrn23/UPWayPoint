"use client";

import { useState, useEffect, useCallback } from "react";

export function useAnimationPreference() {
  const [animationsEnabled, setAnimationsEnabledState] = useState(() => {
    if (typeof window === "undefined") return true;

    const storedPreference = localStorage.getItem("upwaypoint_animations");
    if (storedPreference !== null) {
      return storedPreference === "true";
    }
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const setAnimationsEnabled = useCallback((newValue: boolean) => {
    setAnimationsEnabledState(newValue);
    localStorage.setItem("upwaypoint_animations", String(newValue));
    window.dispatchEvent(new Event("upwaypoint_animations_changed"));
  }, []);

  useEffect(() => {
    const handleGlobalChange = () => {
      const stored = localStorage.getItem("upwaypoint_animations");
      if (stored !== null) {
        setAnimationsEnabledState(stored === "true");
      }
    };

    window.addEventListener(
      "upwaypoint_animations_changed",
      handleGlobalChange,
    );

    if (!animationsEnabled) {
      document.body.classList.add("reduce-motion");
    } else {
      document.body.classList.remove("reduce-motion");
    }

    return () => {
      window.removeEventListener(
        "upwaypoint_animations_changed",
        handleGlobalChange,
      );
    };
  }, [animationsEnabled]);

  return { animationsEnabled, setAnimationsEnabled };
}
