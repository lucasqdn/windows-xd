"use client";

import { useEffect, useRef } from "react";
import { useSoundEffects } from "@/app/hooks/useSoundEffects";
import { VIRUS_TIMING } from "@/app/lib/virus/types";

type BSODScreenProps = {
  onComplete: () => void;
};

export function BSODScreen({ onComplete }: BSODScreenProps) {
  const { stopAllSounds, playAudioFile } = useSoundEffects();
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    console.log(`[BSOD] Starting BSOD screen, duration: ${VIRUS_TIMING.bsodDuration}ms`);
    const bsodStartTime = Date.now();
    
    // Only play sound once using ref guard
    if (!hasPlayedSound.current) {
      // Stop all sounds immediately
      stopAllSounds();

      // Play shutdown sound once
      const audio = playAudioFile('/sounds/shutdown.mp3', 0.6);
      audio.loop = false; // Ensure it doesn't loop
      
      hasPlayedSound.current = true;
    }

    // Auto-advance to ransomware after configured duration
    const timer = setTimeout(() => {
      const actualDuration = Date.now() - bsodStartTime;
      console.log(`[BSOD] Ending BSOD screen, actual duration: ${actualDuration}ms (expected: ${VIRUS_TIMING.bsodDuration}ms)`);
      onComplete();
    }, VIRUS_TIMING.bsodDuration);

    return () => clearTimeout(timer);
  }, [onComplete, stopAllSounds, playAudioFile]);

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-[#0000AA] text-white p-16 overflow-auto"
      style={{ 
        fontFamily: "'Courier New', 'Lucida Console', monospace",
        fontSize: "16px",
        lineHeight: "1.4"
      }}
    >
      {/* Windows 98 BSOD Recreation */}
      <div className="max-w-4xl">
        {/* Title */}
        <div className="text-center mb-6 font-bold">
          Windows
        </div>

        {/* Main Error Message */}
        <div className="mb-6">
          A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +
          00010E36. The current application will be terminated.
        </div>

        {/* Instruction Lines */}
        <div className="mb-6">
          * Press any key to terminate the current application.
        </div>
        <div className="mb-6">
          * Press CTRL+ALT+DEL again to restart your computer. You will
          <br />
          &nbsp;&nbsp;lose any unsaved information in all applications.
        </div>

        {/* Status Line */}
        <div className="mb-8">
          Press any key to continue _
        </div>

        {/* Technical Details Section */}
        <div className="border-t border-white pt-4 mt-8 text-sm opacity-90">
          <div>Stack dump:</div>
          <div className="font-mono mt-2">
            0028:C0011E36 00000000 00000000 00000000 00000000
          </div>
          <div className="font-mono">
            0028:C0011E46 00000000 00000000 00000000 00000000
          </div>
          <div className="font-mono">
            0028:C0011E56 00000000 00000000 00000000 00000000
          </div>
        </div>
      </div>
    </div>
  );
}
