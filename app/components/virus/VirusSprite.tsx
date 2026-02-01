"use client";

import { useEffect, useRef } from "react";
import type { VirusSprite } from "@/app/lib/virus/types";

type VirusSpriteProps = {
  sprite: VirusSprite;
  onUpdate: (id: string, x: number, y: number, rotation: number) => void;
};

export function VirusSpriteComponent({ sprite, onUpdate }: VirusSpriteProps) {
  const rafRef = useRef<number | undefined>(undefined);
  const posRef = useRef({ x: sprite.x, y: sprite.y, rotation: sprite.rotation });
  const velRef = useRef({ vx: sprite.vx, vy: sprite.vy });

  useEffect(() => {
    const animate = () => {
      // Update position
      posRef.current.x += velRef.current.vx;
      posRef.current.y += velRef.current.vy;
      posRef.current.rotation += sprite.rotationSpeed;

      // Bounce off edges
      if (posRef.current.x <= 0 || posRef.current.x >= window.innerWidth - 60) {
        velRef.current.vx *= -1;
        posRef.current.x = Math.max(
          0,
          Math.min(window.innerWidth - 60, posRef.current.x)
        );
      }
      if (posRef.current.y <= 0 || posRef.current.y >= window.innerHeight - 60) {
        velRef.current.vy *= -1;
        posRef.current.y = Math.max(
          0,
          Math.min(window.innerHeight - 60, posRef.current.y)
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

  const emoji = sprite.type === "butterfly" ? "🦋" : "🦍";
  const filter = sprite.type === "gorilla" ? "hue-rotate(270deg)" : "none";

  return (
    <div
      className="fixed pointer-events-none z-[9998] text-5xl select-none transition-transform"
      style={{
        left: `${sprite.x}px`,
        top: `${sprite.y}px`,
        transform: `rotate(${sprite.rotation}deg)`,
        filter,
      }}
    >
      {emoji}
    </div>
  );
}
