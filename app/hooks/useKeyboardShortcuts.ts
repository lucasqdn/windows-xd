"use client";

import { useEffect } from "react";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";

export function useKeyboardShortcuts() {
  const { windows, closeWindow, minimizeWindow, focusWindow } = useWindowManager();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Tab - Cycle through open windows
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        const openWindows = windows.filter(w => !w.isMinimized);
        if (openWindows.length > 0) {
          const currentIndex = openWindows.findIndex(
            w => w.zIndex === Math.max(...windows.map(win => win.zIndex))
          );
          const nextIndex = (currentIndex + 1) % openWindows.length;
          focusWindow(openWindows[nextIndex].id);
        }
      }

      // Alt + F4 - Close active window
      if (e.altKey && e.key === "F4") {
        e.preventDefault();
        const activeWindow = windows.find(
          w => w.zIndex === Math.max(...windows.map(win => win.zIndex))
        );
        if (activeWindow) {
          closeWindow(activeWindow.id);
        }
      }

      // Win + D (Meta/Cmd + D) - Minimize all windows
      if ((e.metaKey || e.key === "Meta") && e.key === "d") {
        e.preventDefault();
        windows.forEach(w => {
          if (!w.isMinimized) {
            minimizeWindow(w.id);
          }
        });
      }

      // Escape - Close active window (alternative)
      if (e.key === "Escape") {
        const activeWindow = windows.find(
          w => w.zIndex === Math.max(...windows.map(win => win.zIndex))
        );
        if (activeWindow) {
          closeWindow(activeWindow.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [windows, closeWindow, minimizeWindow, focusWindow]);
}
