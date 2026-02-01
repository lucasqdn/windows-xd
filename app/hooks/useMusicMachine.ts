"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

type Sentiment = "happy" | "sad" | "error" | "nostalgic";

export function useMusicMachine() {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const synthRef = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    // Initialize synth
    synthRef.current = new Tone.Synth({
      oscillator: {
        type: "square", // 8-bit style
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.3,
      },
    }).toDestination();

    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const initAudio = async () => {
    if (!isAudioReady) {
      await Tone.start();
      setIsAudioReady(true);
    }
  };

  const playSentiment = async (sentiment: Sentiment) => {
    // Ensure audio context is started (requires user interaction)
    await initAudio();

    const synth = synthRef.current;
    if (!synth) return;

    const now = Tone.now();

    switch (sentiment) {
      case "happy":
        // Fast, major-scale melody (8-bit style)
        const happyNotes = ["C5", "E5", "G5", "C6", "G5", "E5", "C5"];
        const happyDurations = [0.15, 0.15, 0.15, 0.3, 0.15, 0.15, 0.3];
        
        happyNotes.forEach((note, i) => {
          const time = happyDurations.slice(0, i).reduce((a, b) => a + b, 0);
          synth.triggerAttackRelease(note, happyDurations[i], now + time);
        });
        break;

      case "sad":
      case "error":
        // Slow, minor-scale melody
        const sadNotes = ["A4", "F4", "D4", "C4"];
        const sadDurations = [0.5, 0.5, 0.5, 1.0];
        
        sadNotes.forEach((note, i) => {
          const time = sadDurations.slice(0, i).reduce((a, b) => a + b, 0);
          synth.triggerAttackRelease(note, sadDurations[i], now + time);
        });
        break;

      case "nostalgic":
        // Windows 98 startup sound approximation
        // Original: 4-note ascending melody
        const nostalgicNotes = ["D4", "A4", "D5", "A5"];
        const nostalgicDurations = [0.4, 0.4, 0.4, 0.8];
        
        nostalgicNotes.forEach((note, i) => {
          const time = nostalgicDurations.slice(0, i).reduce((a, b) => a + b, 0);
          synth.triggerAttackRelease(note, nostalgicDurations[i], now + time);
        });
        break;
    }
  };

  return {
    playSentiment,
    initAudio,
    isAudioReady,
  };
}
