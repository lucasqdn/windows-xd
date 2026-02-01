"use client";

import { useEffect, useRef, useState } from "react";
import type { VirusSprite } from "@/app/lib/virus/types";

type VirusSpriteProps = {
  sprite: VirusSprite;
  onUpdate: (id: string, x: number, y: number, rotation: number) => void;
};

const BONZI_MESSAGES = [
  "Hey there! I'm your friendly desktop buddy!",
  "Let me help you browse the internet!",
  "Click me for fun jokes!",
  "I won't slow down your computer!",
  "Want to see something cool?",
  "Your computer needs me!",
];

export function VirusSpriteComponent({ sprite, onUpdate }: VirusSpriteProps) {
  const rafRef = useRef<number | undefined>(undefined);
  const posRef = useRef({ x: sprite.x, y: sprite.y, rotation: sprite.rotation });
  const velRef = useRef({ vx: sprite.vx, vy: sprite.vy });
  
  // Generate random message for BonziBuddy on mount
  const [randomMessage] = useState(() => 
    sprite.message || BONZI_MESSAGES[Math.floor(Math.random() * BONZI_MESSAGES.length)]
  );

  useEffect(() => {
    const animate = () => {
      // Update position
      posRef.current.x += velRef.current.vx;
      posRef.current.y += velRef.current.vy;
      posRef.current.rotation += sprite.rotationSpeed;

      // Bounce off edges
      if (posRef.current.x <= 0 || posRef.current.x >= window.innerWidth - 100) {
        velRef.current.vx *= -1;
        posRef.current.x = Math.max(
          0,
          Math.min(window.innerWidth - 100, posRef.current.x)
        );
      }
      if (posRef.current.y <= 0 || posRef.current.y >= window.innerHeight - 100) {
        velRef.current.vy *= -1;
        posRef.current.y = Math.max(
          0,
          Math.min(window.innerHeight - 100, posRef.current.y)
        );
      }

      // Update parent
      onUpdate(
        sprite.id,
        posRef.current.x,
        posRef.current.y,
        posRef.current.rotation
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [sprite.id, sprite.rotationSpeed, onUpdate]);

  if (sprite.type === "butterfly") {
    // CSS-based butterfly that looks like the actual desktop butterfly virus
    return (
      <div
        className="fixed pointer-events-none z-[9998] select-none"
        style={{
          left: `${sprite.x}px`,
          top: `${sprite.y}px`,
          transform: `rotate(${sprite.rotation}deg)`,
        }}
      >
        <div className="relative w-16 h-12">
          {/* Left Wing */}
          <div
            className="absolute top-0 left-0 w-8 h-10 rounded-full animate-butterfly-flap"
            style={{
              background: "linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #8b2e5d 100%)",
              boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.3)",
              transformOrigin: "right center",
              animation: "butterfly-left-wing 0.2s ease-in-out infinite alternate",
            }}
          >
            {/* Wing patterns */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-yellow-300 opacity-60" />
            <div className="absolute top-5 left-3 w-2 h-2 rounded-full bg-white opacity-40" />
          </div>

          {/* Right Wing */}
          <div
            className="absolute top-0 right-0 w-8 h-10 rounded-full"
            style={{
              background: "linear-gradient(225deg, #ff6b9d 0%, #c44569 50%, #8b2e5d 100%)",
              boxShadow: "inset 2px -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.3)",
              transformOrigin: "left center",
              animation: "butterfly-right-wing 0.2s ease-in-out infinite alternate",
            }}
          >
            {/* Wing patterns */}
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-yellow-300 opacity-60" />
            <div className="absolute top-5 right-3 w-2 h-2 rounded-full bg-white opacity-40" />
          </div>

          {/* Body */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-12"
            style={{
              background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
              borderRadius: "50%",
              boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          />

          {/* Antennae */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2"
            style={{
              width: "1px",
              height: "8px",
              background: "#2c3e50",
              transform: "rotate(-20deg)",
              transformOrigin: "bottom",
            }}
          />
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2"
            style={{
              width: "1px",
              height: "8px",
              background: "#2c3e50",
              transform: "rotate(20deg)",
              transformOrigin: "bottom",
            }}
          />
        </div>
      </div>
    );
  }

  // BonziBuddy - purple gorilla assistant
  return (
    <div
      className="fixed pointer-events-none z-[9998] select-none"
      style={{
        left: `${sprite.x}px`,
        top: `${sprite.y}px`,
      }}
    >
      <div className="relative">
        {/* BonziBuddy character */}
        <div className="relative w-24 h-28">
          {/* Head */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full"
            style={{
              background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 50%, #6c3483 100%)",
              boxShadow: "inset -3px -3px 6px rgba(0,0,0,0.3), 2px 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {/* Eyes */}
            <div className="absolute top-6 left-4 w-4 h-5 bg-white rounded-full">
              <div className="absolute top-1 left-1 w-2 h-3 bg-black rounded-full animate-bonzi-blink" />
            </div>
            <div className="absolute top-6 right-4 w-4 h-5 bg-white rounded-full">
              <div className="absolute top-1 right-1 w-2 h-3 bg-black rounded-full animate-bonzi-blink" />
            </div>

            {/* Nose */}
            <div
              className="absolute top-10 left-1/2 -translate-x-1/2 w-5 h-4 rounded-full"
              style={{
                background: "#7d3c98",
                boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.3)",
              }}
            />

            {/* Mouth */}
            <div
              className="absolute top-13 left-1/2 -translate-x-1/2 w-8 h-3 rounded-b-full"
              style={{
                background: "#5b2c6f",
                border: "1px solid #4a235a",
              }}
            />

            {/* Ears */}
            <div
              className="absolute -left-2 top-4 w-6 h-8 rounded-full"
              style={{
                background: "linear-gradient(135deg, #9b59b6 0%, #7d3c98 100%)",
                boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.3)",
              }}
            />
            <div
              className="absolute -right-2 top-4 w-6 h-8 rounded-full"
              style={{
                background: "linear-gradient(225deg, #9b59b6 0%, #7d3c98 100%)",
                boxShadow: "inset 2px -2px 4px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* Body */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-12 rounded-t-full"
            style={{
              background: "linear-gradient(180deg, #8e44ad 0%, #6c3483 100%)",
              boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.3), 2px 2px 6px rgba(0,0,0,0.3)",
            }}
          />
        </div>

        {/* Speech Bubble */}
        <div
          className="absolute -top-12 left-full ml-2 bg-white border-2 border-black rounded-lg p-2 w-48 shadow-lg"
          style={{
            animation: "bonzi-speech 0.3s ease-out",
          }}
        >
          <p className="text-xs text-black font-sans">{randomMessage}</p>
          {/* Speech bubble tail */}
          <div
            className="absolute left-0 top-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderRight: "8px solid black",
            }}
          />
          <div
            className="absolute left-0 top-1/2 -translate-x-1/2 translate-x-[2px] w-0 h-0"
            style={{
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderRight: "7px solid white",
            }}
          />
        </div>
      </div>
    </div>
  );
}
