"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type BootupScreenProps = {
  onBootComplete: () => void;
};

export function BootupScreen({ onBootComplete }: BootupScreenProps) {
  const [showCommandScreen, setShowCommandScreen] = useState(true);
  const [commandLines, setCommandLines] = useState<string[]>([]);
  const [showLogo, setShowLogo] = useState(false);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    // Command lines to display
    const commands = [
      "Microsoft Windows XD",
      "   (C)Copyright Microsoft Corp 1975-2026.",
      "",
      "Starting Windows XD...",
      "Loading system files...",
      "Initializing devices...",
    ];

    // Display command lines one by one
    commands.forEach((cmd, index) => {
      setTimeout(() => {
        setCommandLines((prev) => [...prev, cmd]);
      }, index * 200);
    });

    // Hide command screen and show logo after 2 seconds
    const logoTimer = setTimeout(() => {
      setShowCommandScreen(false);
      setShowLogo(true);
    }, 2000);

    // Start fading out the logo after it's been shown
    const fadeTimer = setTimeout(() => {
      setLogoOpacity(0);
    }, 4500);

    // Show just the background after logo fades
    const backgroundTimer = setTimeout(() => {
      setShowBackground(true);
    }, 5000);

    // Complete boot and transition to desktop
    const bootTimer = setTimeout(() => {
      onBootComplete();
    }, 5800);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(fadeTimer);
      clearTimeout(backgroundTimer);
      clearTimeout(bootTimer);
    };
  }, [onBootComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Black screen with command lines */}
      {showCommandScreen && (
        <div className="fixed inset-0 p-8 font-mono text-white text-sm">
          {commandLines.map((line, index) => (
            <div key={index} className="mb-1">
              {line}
            </div>
          ))}
          <div className="mt-2 animate-pulse">_</div>
        </div>
      )}

      {/* Logo with built-in background - shows after command screen */}
      {showLogo && (
        <div
          className="fixed inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: logoOpacity }}
        >
          <Image
            src="/windows-xd logo.png"
            alt="Windows 98 Startup"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Background only - shows after logo fades */}
      {showBackground && (
        <div className="fixed inset-0 animate-fade-in">
          <Image
            src="/windows-xd backgroud.png"
            alt="Windows 98 Background"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
    </div>
  );
}
