"use client";

import { useState, useEffect, useCallback } from "react";
import en from "../locales/en.json";
import fil from "../locales/fil.json";
import taglish from "../locales/taglish.json";

export const locales = {
  en: { name: "ENGLISH", data: en },
  fil: { name: "FILIPINO", data: fil },
  taglish: { name: "TAGLISH", data: taglish },
} as const;

export type LanguageKey = keyof typeof locales;
const languageKeys = Object.keys(locales) as LanguageKey[];

export function useLanguage() {
  const [currentLang, setCurrentLangState] = useState<LanguageKey>(() => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem("upwaypoint_language") as LanguageKey;
    return languageKeys.includes(stored) ? stored : "en";
  });

  const setLanguage = useCallback((lang: LanguageKey) => {
    setCurrentLangState(lang);
    localStorage.setItem("upwaypoint_language", lang);
    window.dispatchEvent(new Event("upwaypoint_language_changed"));
  }, []);

  const cycleLanguage = useCallback(() => {
    const currentIndex = languageKeys.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % languageKeys.length;
    const nextLang = languageKeys[nextIndex] || "en";
    setLanguage(nextLang);
  }, [currentLang, setLanguage]);

  const t = useCallback(
    (key: keyof typeof en) => {
      const wordInCurrentLang = locales[currentLang].data[key];
      return wordInCurrentLang || locales.en.data[key] || key;
    },
    [currentLang],
  );

  useEffect(() => {
    const handleGlobalChange = () => {
      const stored = localStorage.getItem("upwaypoint_language") as LanguageKey;
      if (stored && languageKeys.includes(stored)) {
        setCurrentLangState(stored);
      }
    };
    window.addEventListener("upwaypoint_language_changed", handleGlobalChange);
    return () =>
      window.removeEventListener(
        "upwaypoint_language_changed",
        handleGlobalChange,
      );
  }, []);

  return { currentLang, langName: locales[currentLang].name, cycleLanguage, t };
}
