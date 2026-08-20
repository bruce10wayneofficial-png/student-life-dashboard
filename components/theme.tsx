"use client";

import { useEffect, useState } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedSettings = localStorage.getItem(
      "student-life-settings"
    );

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);

        setDarkMode(settings.darkMode === true);
      } catch {
        console.log("Could not load theme settings.");
      }
    }

    setLoaded(true);
  }, []);

  // Apply theme to the entire application
  useEffect(() => {
    if (!loaded) return;

    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );
  }, [darkMode, loaded]);

  // Listen for settings changes
  useEffect(() => {
    function handleStorageChange() {
      const savedSettings = localStorage.getItem(
        "student-life-settings"
      );

      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);

          setDarkMode(settings.darkMode === true);
        } catch {
          console.log("Could not update theme settings.");
        }
      }
    }

    window.addEventListener(
      "student-settings-changed",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "student-settings-changed",
        handleStorageChange
      );
    };
  }, []);

  return <>{children}</>;
}