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

    console.log(`[SILENT] Starting silent phase, duration: ${VIRUS_TIMING.silentInfection}ms`);
    const startTime = Date.now();

    // Play subtle eerie sound
    playEerieSound();

    // Use requestAnimationFrame for accurate timing
    let rafId: number;
    const checkTimer = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= VIRUS_TIMING.silentInfection) {
        console.log(`[SILENT] Ending silent phase, actual duration: ${elapsed}ms`);
        setStage("sprites");
      } else {
        rafId = requestAnimationFrame(checkTimer);
      }
    };
    rafId = requestAnimationFrame(checkTimer);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [stage, playEerieSound]);

  // Sprite spawning phase with dynamic intervals
  useEffect(() => {
    if (stage !== "sprites") return;

    const startTime = Date.now();
    const spawnDuration = VIRUS_TIMING.virusSpawnDuration;
    const minInterval = VIRUS_TIMING.virusMinInterval;
    
    console.log(`[VIRUS] Starting spawn phase - Duration: ${spawnDuration}ms, MinInterval: ${minInterval}ms`);
    
    // New spawn schedule per user requirements:
    // After notification pressed:
    // - Wait 4s, spawn 1st virus
    // - Wait 4s, spawn 2nd virus
    // - Wait 2s, spawn 3rd virus
    // - Wait 2s, spawn 4th virus
    // - Then 4 viruses at 1s intervals (4s total)
    // - Then 4 viruses at 0.25s intervals (1s total)
    // - Then 4 viruses at 0.125s intervals (0.5s total)
    // - Rest at minInterval until spawnDuration
    
    let spawnCount = 0;
    const spawnQueue: Array<{ delay: number; virusNumber: number }> = [];
    
    // Build the spawn schedule
    let cumulativeTime = 0;
    
    // 1st virus at 4s
    cumulativeTime += 4000;
    spawnQueue.push({ delay: cumulativeTime, virusNumber: 1 });
    
    // 2nd virus at 8s (4s after 1st)
    cumulativeTime += 4000;
    spawnQueue.push({ delay: cumulativeTime, virusNumber: 2 });
    
    // 3rd virus at 10s (2s after 2nd)
    cumulativeTime += 2000;
    spawnQueue.push({ delay: cumulativeTime, virusNumber: 3 });
    
    // 4th virus at 12s (2s after 3rd)
    cumulativeTime += 2000;
    spawnQueue.push({ delay: cumulativeTime, virusNumber: 4 });
    
    // 4 viruses at 1s intervals (12s-16s)
    for (let i = 0; i < 4; i++) {
      cumulativeTime += 1000;
      if (cumulativeTime <= spawnDuration) {
        spawnQueue.push({ delay: cumulativeTime, virusNumber: 5 + i });
      }
    }
    
    // 4 viruses at 0.25s intervals (16s-17s)
    for (let i = 0; i < 4; i++) {
      cumulativeTime += 250;
      if (cumulativeTime <= spawnDuration) {
        spawnQueue.push({ delay: cumulativeTime, virusNumber: 9 + i });
      }
    }
    
    // 4 viruses at 0.125s intervals (17s-17.5s)
    for (let i = 0; i < 4; i++) {
      cumulativeTime += 125;
      if (cumulativeTime <= spawnDuration) {
        spawnQueue.push({ delay: cumulativeTime, virusNumber: 13 + i });
      }
    }
    
    // Rest at minInterval until spawnDuration
    let virusNumber = 17;
    while (cumulativeTime < spawnDuration) {
      cumulativeTime += minInterval;
      if (cumulativeTime <= spawnDuration) {
        spawnQueue.push({ delay: cumulativeTime, virusNumber });
        virusNumber++;
      }
    }
    
    console.log(`[VIRUS] Scheduled ${spawnQueue.length} viruses over ${spawnDuration}ms`);
    
    // Schedule all spawns
    const timeouts: NodeJS.Timeout[] = [];
    
    spawnQueue.forEach(({ delay, virusNumber }) => {
      const timeout = setTimeout(() => {
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

        // Play spawn sound
        playSpawnSound();
        
        const actualTime = Date.now() - startTime;
        console.log(`[VIRUS] Spawned virus #${virusNumber} at ${actualTime}ms (scheduled: ${delay}ms)`);
      }, delay);
      
      timeouts.push(timeout);
    });
    
    // Transition to glitch phase after spawn duration
    const finalTimeout = setTimeout(() => {
      const actualDuration = Date.now() - startTime;
      console.log(`[VIRUS] Spawned ${spawnCount} viruses total in ${actualDuration}ms, transitioning to glitch phase`);
      setStage("glitch");
    }, spawnDuration);
    
    timeouts.push(finalTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
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

    // Use requestAnimationFrame for accurate glitch phase timing
    let rafId: number;
    const checkGlitchTimer = () => {
      const elapsed = Date.now() - glitchStartTime;
      if (elapsed >= VIRUS_TIMING.glitchDuration) {
        const actualDuration = Date.now() - glitchStartTime;
        console.log(`[GLITCH] Ending glitch phase, actual duration: ${actualDuration}ms (expected: ${VIRUS_TIMING.glitchDuration}ms)`);
        
        if (glitchIntervalRef.current) {
          clearInterval(glitchIntervalRef.current);
        }
        const desktop = document.querySelector("[data-desktop-root]") as HTMLElement;
        removeGlitchFromElement(desktop);
        setGlitchActive(false);
        setStage("bsod");
      } else {
        rafId = requestAnimationFrame(checkGlitchTimer);
      }
    };
    rafId = requestAnimationFrame(checkGlitchTimer);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
      }
    };
  }, [stage, playGlitchSound]); // Removed openWindow to prevent re-runs when windows open

  // Stop virus AudioContext when BSOD appears
  useEffect(() => {
    if (stage === "bsod") {
      // Suspend the virus AudioContext to stop eerie sounds
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.suspend().catch((error) => {
          console.error('Failed to suspend virus AudioContext:', error);
        });
      }
    }
  }, [stage]);

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
