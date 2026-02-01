"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  VIRUS_TIMING,
  type VirusStage,
  type VirusSprite,
} from "@/app/lib/virus/types";
import { VirusSpriteComponent } from "./VirusSprite";
import { BSODScreen } from "./BSODScreen";
import { RansomwareScreen } from "./RansomwareScreen";
import { 
  applyGlitchToElement, 
  removeGlitchFromElement,
  teleportWindows,
  teleportDesktopIcons,
  createPhantomWindows,
  applyScreenTear
} from "@/app/lib/virus/effects";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";
import { Notepad } from "@/app/components/apps/Notepad";
import { Paint } from "@/app/components/apps/Paint";

export function VirusSimulation() {
  const [stage, setStage] = useState<VirusStage>("silent");
  const [sprites, setSprites] = useState<VirusSprite[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { openWindow } = useWindowManager();

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
      const audio = new Audio('/sounds/error_sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio errors
      });
    } catch {
      // Ignore audio errors
    }
  }, []);

  const playGlitchSound = useCallback(() => {
    try {
      // Randomly decide: pause (40%), play once (40%), or ring multiple times (20%)
      const behavior = Math.random();
      
      if (behavior < 0.4) {
        // 40% chance: pause (no sound)
        return;
      } else if (behavior < 0.8) {
        // 40% chance: play once
        const audio = new Audio('/sounds/error_sound.mp3');
        audio.volume = 0.2;
        audio.play().catch(() => {
          // Ignore audio errors
        });
      } else {
        // 20% chance: ring multiple times (2-4 times)
        const ringCount = Math.floor(Math.random() * 3) + 2; // 2-4 rings
        const ringInterval = 300; // 300ms between rings
        
        for (let i = 0; i < ringCount; i++) {
          setTimeout(() => {
            const audio = new Audio('/sounds/error_sound.mp3');
            audio.volume = 0.2;
            audio.play().catch(() => {
              // Ignore audio errors
            });
          }, i * ringInterval);
        }
      }
    } catch {
      // Ignore audio errors
    }
  }, []);

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

  // Sprite spawning phase with grouped intervals (30s total)
  useEffect(() => {
    if (stage !== "sprites") return;

    const startTime = Date.now();
    const spawnDuration = VIRUS_TIMING.virusSpawnDuration; // 30 seconds
    const minInterval = VIRUS_TIMING.virusMinInterval; // 0.125s
    
    // Grouped spawn intervals:
    // 1st at 0s, 2nd at 8s, 3rd at 12s, 4th at 14s
    // Then 5 at 1s intervals, 5 at 0.5s, 5 at 0.25s, rest at 0.125s
    const spawnSchedule = [
      { delay: 0, count: 1 },      // 1st virus immediately
      { delay: 8000, count: 1 },   // 2nd after 8s
      { delay: 4000, count: 1 },   // 3rd after 4s more (total 12s)
      { delay: 2000, count: 1 },   // 4th after 2s more (total 14s)
      { delay: 1000, count: 5 },   // 5 viruses at 1s intervals
      { delay: 500, count: 5 },    // 5 viruses at 0.5s intervals
      { delay: 250, count: 5 },    // 5 viruses at 0.25s intervals
      { delay: minInterval, count: Infinity } // Rest at 0.125s until time limit
    ];
    
    let scheduleIndex = 0;
    let groupCount = 0;
    let spawnCount = 0;
    
    const scheduleNextSpawn = () => {
      const elapsed = Date.now() - startTime;
      
      // Check if we've exceeded 30 seconds
      if (elapsed >= spawnDuration) {
        console.log(`Spawned ${spawnCount} viruses in ${elapsed}ms`);
        setStage("glitch"); // Immediately transition to glitch phase (removed 2s delay)
        return;
      }
      
      // Determine sprite type (80% butterfly, 20% bonzi)
      const spriteType: "butterfly" | "bonzibuddy" = Math.random() > 0.2 ? "butterfly" : "bonzibuddy";
      
      // Spawn new sprite with varied initial velocities
      const speedVariation = 1 + Math.random() * 3; // 1-4 speed range
      const angle = Math.random() * Math.PI * 2;
      
      const newSprite: VirusSprite = {
        id: `sprite-${Date.now()}-${Math.random()}`,
        type: spriteType,
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 100),
        vx: Math.cos(angle) * speedVariation,
        vy: Math.sin(angle) * speedVariation,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        scale: 0.8 + Math.random() * 0.4,
      };

      setSprites((prev) => [...prev, newSprite]);
      spawnCount++;
      groupCount++;

      // Play spawn sound
      playSpawnSound();
      
      // Get current schedule
      const currentSchedule = spawnSchedule[scheduleIndex];
      
      // Check if we should move to next interval group
      if (groupCount >= currentSchedule.count && scheduleIndex < spawnSchedule.length - 1) {
        scheduleIndex++;
        groupCount = 0;
      }
      
      // Get next delay
      const nextDelay = spawnSchedule[scheduleIndex].delay;
      
      // Make sure next spawn doesn't exceed 30 seconds
      const nextSpawnTime = elapsed + nextDelay;
      if (nextSpawnTime > spawnDuration) {
        // Schedule final spawn at exactly 30 seconds
        const remainingTime = spawnDuration - elapsed;
        if (remainingTime > 0) {
          setTimeout(scheduleNextSpawn, remainingTime);
        } else {
          scheduleNextSpawn(); // Call immediately to finish
        }
      } else {
        // Schedule next spawn with current delay
        setTimeout(scheduleNextSpawn, nextDelay);
      }
    };
    
    // Start the first spawn immediately
    scheduleNextSpawn();

    return () => {
      // Cleanup is handled by the setTimeout chain
    };
  }, [stage, playSpawnSound]);

  // Glitch phase
  useEffect(() => {
    if (stage !== "glitch") return;

    setGlitchActive(true);
    const glitchStartTime = Date.now();
    console.log(`[GLITCH] Starting glitch phase at ${glitchStartTime}, duration: ${VIRUS_TIMING.glitchDuration}ms`);

    // Define available apps to randomly open
    const availableApps = [
      { title: "Notepad", component: Notepad, icon: "/notepad-0.png", size: { width: 640, height: 480 } },
      { title: "Paint", component: Paint, icon: "/paint_old-0.png", size: { width: 680, height: 540 } },
    ];

    // Apply glitches to desktop at random intervals
    glitchIntervalRef.current = setInterval(() => {
      const desktop = document.querySelector("[data-desktop-root]") as HTMLElement;
      if (desktop) {
        applyGlitchToElement(desktop, {
          shake: Math.random() > 0.2, // Increased from 0.3 to 0.2 (80% chance)
          colorShift: Math.random() > 0.3, // Increased from 0.5 to 0.3 (70% chance)
          static: Math.random() > 0.5, // Increased from 0.7 to 0.5 (50% chance)
          invert: Math.random() > 0.7, // Increased from 0.8 to 0.7 (30% chance)
        });
      }

      // Serious glitch effects - increased probabilities and added more chaos
      const glitchType = Math.random();
      
      if (glitchType < 0.35) {
        // Teleport windows (increased from 0.3)
        teleportWindows();
      } else if (glitchType < 0.65) {
        // Teleport desktop icons (increased from 0.5)
        teleportDesktopIcons();
      } else if (glitchType < 0.85) {
        // Create phantom windows (increased from 0.7)
        createPhantomWindows();
      } else {
        // Screen tear (increased probability)
        applyScreenTear();
      }

      // Randomly open apps during glitch (15% chance per interval)
      if (Math.random() < 0.15) {
        const randomApp = availableApps[Math.floor(Math.random() * availableApps.length)];
        const randomX = Math.random() * (window.innerWidth - randomApp.size.width);
        const randomY = Math.random() * (window.innerHeight - randomApp.size.height);
        
        openWindow({
          title: randomApp.title,
          component: randomApp.component,
          icon: randomApp.icon,
          position: { x: randomX, y: randomY },
          size: randomApp.size,
          isMinimized: false,
          isMaximized: false,
          animationState: 'opening',
        });
      }

      // Play glitch sound
      playGlitchSound();
    }, 100); // Optimized interval - 100ms for better performance while keeping chaos

    const timer = setTimeout(() => {
      const glitchEndTime = Date.now();
      const actualDuration = glitchEndTime - glitchStartTime;
      console.log(`[GLITCH] Ending glitch phase at ${glitchEndTime}, actual duration: ${actualDuration}ms (expected: ${VIRUS_TIMING.glitchDuration}ms)`);
      
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
      }
      const desktop = document.querySelector("[data-desktop-root]") as HTMLElement;
      removeGlitchFromElement(desktop);
      setGlitchActive(false);
      setStage("bsod");
    }, VIRUS_TIMING.glitchDuration);

    return () => {
      clearTimeout(timer);
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
      }
    };
  }, [stage, playGlitchSound]); // Removed openWindow to prevent re-runs when windows open

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

  const handleBSODComplete = () => {
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

      {/* BSOD Screen */}
      {stage === "bsod" && (
        <BSODScreen onComplete={handleBSODComplete} />
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
