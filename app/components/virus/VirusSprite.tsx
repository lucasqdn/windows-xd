"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

// Butterfly animation frames (using -png.png files)
const BUTTERFLY_FRAMES = ["100-png", "70-png", "40-png", "10-png"];
const FRAME_DURATION = 100; // milliseconds per frame

export function VirusSpriteComponent({ sprite, onUpdate }: VirusSpriteProps) {
  const rafRef = useRef<number | undefined>(undefined);
  const posRef = useRef({ x: sprite.x, y: sprite.y, rotation: sprite.rotation });
  const velRef = useRef({ vx: sprite.vx, vy: sprite.vy });
  const lastUpdateRef = useRef<number>(0);
  const directionTimerRef = useRef<number>(0);
  
  // Generate random message for BonziBuddy on mount
  const [randomMessage] = useState(() => 
    sprite.message || BONZI_MESSAGES[Math.floor(Math.random() * BONZI_MESSAGES.length)]
  );

  // Butterfly animation frame state
  const [butterflyFrame, setButterflyFrame] = useState(0);
  
  // Butterfly rotation angle (based on movement direction)
  const [butterflyAngle, setButterflyAngle] = useState(0);

  // Animate butterfly frames
  useEffect(() => {
    if (sprite.type !== "butterfly") return;

    const interval = setInterval(() => {
      setButterflyFrame((prev) => (prev + 1) % BUTTERFLY_FRAMES.length);
    }, FRAME_DURATION);

    return () => clearInterval(interval);
  }, [sprite.type]);

  // Movement animation
  useEffect(() => {
    const isBonzi = sprite.type === "bonzibuddy";
    const targetFPS = isBonzi ? 30 : 60;
    const frameTime = 1000 / targetFPS;
    
    // Initialize timers
    lastUpdateRef.current = Date.now();
    directionTimerRef.current = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;
      
      // Only update at target framerate
      if (deltaTime >= frameTime) {
        lastUpdateRef.current = now;
        
        // Update position
        posRef.current.x += velRef.current.vx;
        posRef.current.y += velRef.current.vy;
        
        // For butterfly, calculate rotation based on velocity direction
        if (sprite.type === "butterfly") {
          // Calculate angle from velocity - add 90 degrees to make butterfly face forward
          // (image is oriented vertically, so we need to rotate it to face the direction of travel)
          const angle = Math.atan2(velRef.current.vy, velRef.current.vx) * (180 / Math.PI) + 90;
          setButterflyAngle(angle);
          
          // Random direction changes with varied patterns (1-4 seconds)
          if (now - directionTimerRef.current > 1000 + Math.random() * 3000) {
            directionTimerRef.current = now;
            
            // More varied movement patterns
            const movementType = Math.random();
            
            if (movementType < 0.4) {
              // Completely random direction (40% chance)
              const newAngle = Math.random() * Math.PI * 2;
              const speed = 2 + Math.random() * 3; // Varied speeds: 2-5
              velRef.current.vx = Math.cos(newAngle) * speed;
              velRef.current.vy = Math.sin(newAngle) * speed;
            } else if (movementType < 0.6) {
              // Slight angle change - curve (20% chance)
              const currentAngle = Math.atan2(velRef.current.vy, velRef.current.vx);
              const angleChange = (Math.random() - 0.5) * Math.PI * 0.5; // ±45 degrees
              const newAngle = currentAngle + angleChange;
              const speed = Math.sqrt(velRef.current.vx ** 2 + velRef.current.vy ** 2);
              velRef.current.vx = Math.cos(newAngle) * speed;
              velRef.current.vy = Math.sin(newAngle) * speed;
            } else if (movementType < 0.8) {
              // Sharp turn (20% chance)
              const currentAngle = Math.atan2(velRef.current.vy, velRef.current.vx);
              const turnDirection = Math.random() > 0.5 ? 1 : -1;
              const newAngle = currentAngle + (Math.PI * 0.5 * turnDirection); // 90 degree turn
              const speed = 2 + Math.random() * 2;
              velRef.current.vx = Math.cos(newAngle) * speed;
              velRef.current.vy = Math.sin(newAngle) * speed;
            } else {
              // Reverse direction (20% chance)
              const speed = 2 + Math.random() * 2;
              velRef.current.vx = -velRef.current.vx * (speed / Math.sqrt(velRef.current.vx ** 2 + velRef.current.vy ** 2));
              velRef.current.vy = -velRef.current.vy * (speed / Math.sqrt(velRef.current.vx ** 2 + velRef.current.vy ** 2));
            }
          }
        } else {
          // Bonzi keeps rotation
          posRef.current.rotation += sprite.rotationSpeed;
        }

        // Bounce off edges
        const maxX = window.innerWidth - 150;
        const maxY = window.innerHeight - 150;
        
        if (posRef.current.x <= 0 || posRef.current.x >= maxX) {
          velRef.current.vx *= -1;
          posRef.current.x = Math.max(0, Math.min(maxX, posRef.current.x));
        }
        
        if (posRef.current.y <= 0 || posRef.current.y >= maxY) {
          velRef.current.vy *= -1;
          posRef.current.y = Math.max(0, Math.min(maxY, posRef.current.y));
        }

        // Update parent
        onUpdate(
          sprite.id,
          posRef.current.x,
          posRef.current.y,
          posRef.current.rotation
        );
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [sprite.id, sprite.type, sprite.rotationSpeed, onUpdate]);

  if (sprite.type === "butterfly") {
    const currentFrame = BUTTERFLY_FRAMES[butterflyFrame];
    
    return (
      <div
        className="fixed pointer-events-none z-[9998] select-none"
        style={{
          left: `${sprite.x}px`,
          top: `${sprite.y}px`,
          transform: `rotate(${butterflyAngle}deg)`,
        }}
      >
        {/* Container centered on the position point */}
        <div 
          className="relative" 
          style={{ 
            width: "120px",
            height: "80px",
            // Center the container on the x,y position
            transform: "translate(-50%, -50%)",
          }}
        >
          <Image
            src={`/virus/butterfly/${currentFrame}.png`}
            alt="Butterfly Virus"
            fill
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  // BonziBuddy - using the actual asset with 30fps movement
  return (
    <div
      className="fixed pointer-events-none z-[9998] select-none"
      style={{
        left: `${sprite.x}px`,
        top: `${sprite.y}px`,
        transform: `rotate(${sprite.rotation}deg)`,
      }}
    >
      <div className="relative">
        {/* BonziBuddy Image */}
        <div className="relative w-32 h-32">
          <Image
            src="/virus/bonzi/Bonzi_1.webp"
            alt="BonziBuddy"
            fill
            className="object-contain"
            style={{
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Speech Bubble - positioned above and centered */}
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border-2 border-black rounded-lg p-3 w-48 shadow-lg z-10"
          style={{
            animation: "bonzi-speech 0.3s ease-out",
          }}
        >
          <p className="text-xs text-black font-sans leading-relaxed">{randomMessage}</p>
          {/* Speech bubble tail pointing down */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid black",
            }}
          />
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[2px] w-0 h-0"
            style={{
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: "7px solid white",
            }}
          />
        </div>
      </div>
    </div>
  );
}
