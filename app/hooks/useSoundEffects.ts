"use client";

import { useCallback, useEffect } from "react";
import { soundManager, type SoundType } from "@/app/lib/sounds";

/**
 * Hook for playing sound effects using the Web Audio API SoundManager
 * Provides playSound, setVolume, and setMuted functions
 */
export function useSoundEffects() {
  useEffect(() => {
    // Play startup sound on mount (using windowOpen as startup sound)
    const timeout = setTimeout(() => {
      soundManager.playSound("windowOpen");
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const playSound = useCallback((type: SoundType) => {
    soundManager.playSound(type);
  }, []);

  const setVolume = useCallback((volume: number) => {
    soundManager.setVolume(volume);
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    soundManager.setMuted(muted);
  }, []);

  const stopAllSounds = useCallback(() => {
    soundManager.stopAllSounds();
  }, []);

  const playAudioFile = useCallback((url: string, volume?: number) => {
    return soundManager.playAudioFile(url, volume);
  }, []);

  return { playSound, setVolume, setMuted, stopAllSounds, playAudioFile };
}
