"use client";

import { useState, useEffect } from "react";
import {
  NOTIFICATION_VARIANTS,
  type NotificationVariant,
} from "@/app/lib/virus/types";

type VirusNotificationProps = {
  onRun: () => void;
  onCancel: () => void;
};

export function VirusNotification({ onRun, onCancel }: VirusNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Pick a random variant on mount
  const [variant] = useState<NotificationVariant>(() => {
    return NOTIFICATION_VARIANTS[
      Math.floor(Math.random() * NOTIFICATION_VARIANTS.length)
    ];
  });

  useEffect(() => {
    // Play notification sound
    const audio = new Audio('/sounds/notify_sound.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {
      // Ignore audio errors (autoplay policy)
    });
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleRun = () => {
    setIsVisible(false);
    setTimeout(onRun, 300); // Wait for fade out animation
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(onCancel, 300); // Wait for fade out animation
  };

  return (
    <div
      className={`fixed bottom-8 right-8 w-[400px] bg-[#c0c0c0] border-2 shadow-lg z-[9999] transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{
        borderStyle: "solid",
        borderTopColor: "#ffffff",
        borderLeftColor: "#ffffff",
        borderRightColor: "#808080",
        borderBottomColor: "#808080",
      }}
    >
      {/* Title Bar */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1">
        <span className="text-white text-sm font-bold">🔔 {variant.title}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Icon */}
          <div className="text-4xl flex-shrink-0">⚠️</div>

          {/* Message */}
          <div className="flex-1 space-y-3">
            <p className="text-sm">{variant.message}</p>

            <div className="bg-white border border-[#808080] p-2">
              <p className="text-sm font-mono text-center">
                &quot;{variant.fileName}&quot;
              </p>
            </div>

            {variant.features.length > 0 && (
              <div>
                <p className="text-sm mb-1">This software promises to:</p>
                <ul className="text-xs space-y-1 pl-4">
                  {variant.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-sm">Would you like to run it now?</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleRun}
            className="px-6 py-1 bg-[#c0c0c0] border-2 hover:bg-[#d0d0d0] active:border-inset"
            style={{
              borderStyle: "solid",
              borderTopColor: "#ffffff",
              borderLeftColor: "#ffffff",
              borderRightColor: "#808080",
              borderBottomColor: "#808080",
            }}
          >
            Run
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-1 bg-[#c0c0c0] border-2 hover:bg-[#d0d0d0] active:border-inset"
            style={{
              borderStyle: "solid",
              borderTopColor: "#ffffff",
              borderLeftColor: "#ffffff",
              borderRightColor: "#808080",
              borderBottomColor: "#808080",
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Small disclaimer at bottom */}
      <div className="text-[10px] text-gray-600 text-center pb-2 px-2">
        (This is a harmless browser simulation - reload to exit anytime)
      </div>
    </div>
  );
}
