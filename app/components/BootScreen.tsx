"use client";

import { useState, useEffect } from "react";

type BootScreenProps = {
  onComplete: () => void;
};

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"bios" | "logo" | "loading">("bios");

  useEffect(() => {
    // BIOS stage (0.5s)
    const biosTimeout = setTimeout(() => {
      setStage("logo");
    }, 500);

    // Logo stage (1.5s)
    const logoTimeout = setTimeout(() => {
      setStage("loading");
    }, 2000);

    // Loading progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => {
      clearTimeout(biosTimeout);
      clearTimeout(logoTimeout);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[10001] flex items-center justify-center">
      {stage === "bios" && (
        <div className="text-white font-mono text-sm space-y-1">
          <p>Windows XD BIOS v1.0</p>
          <p>Copyright (C) 2026, Windows XD Team</p>
          <p>Memory Test: 64MB OK</p>
          <p className="animate-pulse">Loading...</p>
        </div>
      )}

      {stage === "logo" && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl">🪟</div>
          <div className="text-white text-2xl font-bold">Windows XD</div>
          <div className="text-gray-400 text-sm">Starting up...</div>
        </div>
      )}

      {stage === "loading" && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-6xl mb-4">🪟</div>
          <div className="text-white text-2xl font-bold mb-2">Windows XD</div>
          
          {/* Progress bar */}
          <div className="w-64 bg-gray-700 border-2 border-gray-600 p-1">
            <div
              className="h-4 bg-blue-600 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-gray-400 text-sm">
            {progress < 100 ? "Loading system..." : "Ready!"}
          </div>
        </div>
      )}
    </div>
  );
}
