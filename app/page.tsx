"use client";

import { useState, useEffect } from "react";
import { Desktop } from "@/app/components/Desktop";
import { BootupScreen } from "@/app/components/BootupScreen";

export default function Home() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    if (!hasInteracted) {
      const handleInteraction = () => {
        setHasInteracted(true);
      };

      // Listen for any key press or mouse click
      window.addEventListener("keydown", handleInteraction);
      window.addEventListener("click", handleInteraction);
      window.addEventListener("touchstart", handleInteraction);

      return () => {
        window.removeEventListener("keydown", handleInteraction);
        window.removeEventListener("click", handleInteraction);
        window.removeEventListener("touchstart", handleInteraction);
      };
    }
  }, [hasInteracted]);

  // Show black screen with prompt until user interacts
  if (!hasInteracted) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center cursor-pointer">
        <div className="text-center animate-pulse">
          <p className="text-white text-xl mb-4 font-mono">
            Press any key or click to start
          </p>
          <p className="text-gray-400 text-sm font-mono">
            Windows XD is loading...
          </p>
        </div>
      </div>
    );
  }

  // Show boot screen after interaction
  if (!bootComplete) {
    return <BootupScreen onBootComplete={() => setBootComplete(true)} />;
  }

  // Show desktop after boot complete
  return <Desktop />;
}
