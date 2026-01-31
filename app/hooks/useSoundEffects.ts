"use client";

import { useEffect } from "react";

// Sound effect URLs (we'll use data URIs for simple beeps or reference public URLs)
const SOUNDS = {
  startup: "https://www.winhistory.de/more/winstart/ogg/win98.ogg",
  click: null, // Can add click sound later
  error: null,  // Can add error sound later
  minimize: null,
  maximize: null,
};

export function useSoundEffects() {
  useEffect(() => {
    // Play startup sound on mount
    const playStartupSound = () => {
      if (SOUNDS.startup) {
        const audio = new Audio(SOUNDS.startup);
        audio.volume = 0.3; // Lower volume
        audio.play().catch((e) => {
          console.log("Autoplay prevented:", e);
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(playStartupSound, 500);

    return () => clearTimeout(timeout);
  }, []);

  const playSound = (soundType: keyof typeof SOUNDS) => {
    const soundUrl = SOUNDS[soundType];
    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("Sound play failed:", e));
    }
  };

  return { playSound };
}
