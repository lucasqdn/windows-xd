"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  VIRUS_TIMING,
  type VirusStage,
  type VirusSprite,
} from "@/app/lib/virus/types";
import { VirusSpriteComponent } from "./VirusSprite";
import { ShutdownScreen } from "./ShutdownScreen";
import { RansomwareScreen } from "./RansomwareScreen";
import { 
  applyGlitchToElement, 
  removeGlitchFromElement,
  teleportWindows,
  teleportDesktopIcons,
  createPhantomWindows,
  applyScreenTear
} from "@/app/lib/virus/effects";

export function VirusSimulation() {
  const [stage, setStage] = useState<VirusStage>("silent");
  const [sprites, setSprites] = useState<VirusSprite[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Audio functions (Web Audio API)
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playEerieSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 200;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 2);
    } catch {
      // Ignore audio errors
    }
  }, [getAudioContext]);

  const playSpawnSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "square";
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch {
      // Ignore audio errors
    }
  }, [getAudioContext]);

  const playGlitchSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = Math.random() * 1000 + 100;
      oscillator.type = "sawtooth";
      gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio errors
    }
  }, [getAudioContext]);

  // Silent infection phase
  useEffect(() => {
    if (stage !== "silent") return;

    // Play subtle eerie sound
    playEerieSound();

    const timer = setTimeout(() => {
      setStage("sprites");
    }, VIRUS_TIMING.silentInfection);

    return () => clearTimeout(timer);
  }, [stage, playEerieSound]);

  // Sprite spawning phase
  useEffect(() => {
    if (stage !== "sprites") return;

    let spawnCount = 0;
    const interval = setInterval(() => {
      if (spawnCount >= VIRUS_TIMING.virusSpawnCount) {
        clearInterval(interval);
        setTimeout(() => setStage("glitch"), 2000);
        return;
      }

      // Spawn new sprite
      const newSprite: VirusSprite = {
        id: `sprite-${Date.now()}-${Math.random()}`,
        type: Math.random() > 0.5 ? "butterfly" : "bonzibuddy",
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 100),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        scale: 0.8 + Math.random() * 0.4,
      };

      setSprites((prev) => [...prev, newSprite]);
      spawnCount++;

      // Play spawn sound
      playSpawnSound();
    }, VIRUS_TIMING.virusSpawnInterval);

    return () => clearInterval(interval);
  }, [stage, playSpawnSound]);

  // Glitch phase
  useEffect(() => {
    if (stage !== "glitch") return;

    setGlitchActive(true);

    // Apply glitches to desktop at random intervals
    glitchIntervalRef.current = setInterval(() => {
      const desktop = document.querySelector("[data-desktop-root]") as HTMLElement;
      if (desktop) {
        applyGlitchToElement(desktop, {
          shake: Math.random() > 0.3,
          colorShift: Math.random() > 0.5,
          static: Math.random() > 0.7,
          invert: Math.random() > 0.8,
        });
      }

      // Serious glitch effects
      const glitchType = Math.random();
      
      if (glitchType < 0.3) {
        // Teleport windows
        teleportWindows();
      } else if (glitchType < 0.5) {
        // Teleport desktop icons
        teleportDesktopIcons();
      } else if (glitchType < 0.7) {
        // Create phantom windows
        createPhantomWindows();
      } else if (glitchType < 0.85) {
        // Screen tear
        applyScreenTear();
      }

      // Play glitch sound
      playGlitchSound();
    }, 150); // Faster glitches

    const timer = setTimeout(() => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
      }
      const desktop = document.querySelector("[data-desktop-root]") as HTMLElement;
      removeGlitchFromElement(desktop);
      setGlitchActive(false);
      setStage("shutdown");
    }, VIRUS_TIMING.glitchDuration);

    return () => {
      clearTimeout(timer);
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
      }
    };
  }, [stage, playGlitchSound]);

  const handleSpriteUpdate = useCallback(
    (id: string, x: number, y: number, rotation: number) => {
      setSprites((prev) =>
        prev.map((sprite) =>
          sprite.id === id ? { ...sprite, x, y, rotation } : sprite
        )
      );
    },
    []
  );

  const handleShutdownComplete = () => {
    setStage("ransomware");
  };

  return (
    <>
      {/* Virus Sprites */}
      {sprites.map((sprite) => (
        <VirusSpriteComponent
          key={sprite.id}
          sprite={sprite}
          onUpdate={handleSpriteUpdate}
        />
      ))}

      {/* Shutdown Screen */}
      {stage === "shutdown" && (
        <ShutdownScreen onComplete={handleShutdownComplete} />
      )}

      {/* Ransomware Screen */}
      {stage === "ransomware" && <RansomwareScreen />}

      {/* Glitch Overlay */}
      {glitchActive && (
        <div
          className="fixed inset-0 pointer-events-none z-[9997]"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            )`,
            animation: "glitch-scanlines 0.1s infinite",
          }}
        />
      )}
    </>
  );
}
