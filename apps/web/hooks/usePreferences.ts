import { useState, useEffect } from "react";

export function useAnimationPreference() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    const storedPreference = localStorage.getItem("upwaypoint_animations");
    if (storedPreference !== null) {
      setAnimationsEnabled(storedPreference === "true");
    } else {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setAnimationsEnabled(!prefersReducedMotion);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("upwaypoint_animations", String(animationsEnabled));
    
    if (!animationsEnabled) {
      document.body.classList.add("reduce-motion");
    } else {
      document.body.classList.remove("reduce-motion");
    }
  }, [animationsEnabled]);

  return { animationsEnabled, setAnimationsEnabled };
}