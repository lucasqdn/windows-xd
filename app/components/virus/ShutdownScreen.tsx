"use client";

import { useState, useEffect } from "react";

type ShutdownScreenProps = {
  onComplete: () => void;
};

export function ShutdownScreen({ onComplete }: ShutdownScreenProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Windows is shutting down...");

  useEffect(() => {
    const messages = [
      "Windows is shutting down...",
      "Saving your settings...",
      "Closing applications...",
      "Preparing to turn off your computer...",
    ];

    let currentMessageIndex = 0;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += 2;
      setProgress(Math.min(currentProgress, 100));

      // Change message every 25%
      const newMessageIndex = Math.floor(currentProgress / 25);
      if (newMessageIndex !== currentMessageIndex && newMessageIndex < messages.length) {
        currentMessageIndex = newMessageIndex;
        setMessage(messages[currentMessageIndex]);
      }

      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(onComplete, 500);
      }
    }, 70); // 7000ms / 100 steps = 70ms per step

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#008080] flex items-center justify-center z-[9999]">
      <div
        className="bg-[#c0c0c0] border-2 p-8 w-[500px]"
        style={{
          borderStyle: "solid",
          borderTopColor: "#ffffff",
          borderLeftColor: "#ffffff",
          borderRightColor: "#808080",
          borderBottomColor: "#808080",
        }}
      >
        {/* Windows Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-6xl">🪟</div>
        </div>

        {/* Message */}
        <p className="text-center text-xl font-bold mb-6">{message}</p>

        {/* Progress Bar */}
        <div
          className="h-6 border-2 bg-white relative overflow-hidden"
          style={{
            borderStyle: "solid",
            borderTopColor: "#808080",
            borderLeftColor: "#808080",
            borderRightColor: "#ffffff",
            borderBottomColor: "#ffffff",
          }}
        >
          <div
            className="absolute inset-y-0 left-0 bg-[#000080] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <p className="text-center mt-4 text-sm text-gray-700">{progress}%</p>

        {/* Warning Message */}
        <div className="mt-6 text-center text-xs text-gray-600">
          <p>Please wait while Windows shuts down.</p>
          <p className="mt-1">Do not turn off your computer.</p>
        </div>
      </div>
    </div>
  );
}
