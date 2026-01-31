"use client";

import { useEffect, useState, useCallback } from "react";

type UseIdleDetectionReturn = {
  isIdle: boolean;
  resetIdle: () => void;
};

export function useIdleDetection(
  timeoutMs: number = 30000
): UseIdleDetectionReturn {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(() => Date.now());

  const resetIdle = useCallback(() => {
    setLastActivity(Date.now());
    setIsIdle(false);
  }, []);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

    const handleActivity = () => {
      resetIdle();
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Check idle status every second
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > timeoutMs) {
        setIsIdle(true);
      }
    }, 1000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity, timeoutMs, resetIdle]);

  return { isIdle, resetIdle };
}
