"use client";

import { useEffect } from "react";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";
import { TaskManager } from "@/app/components/apps/TaskManager";
import { getWindowSize } from "@/app/config/windowSizes";

export function useKeyboardShortcuts() {
  const { windows, closeWindow, minimizeWindow, focusWindow, openWindow } = useWindowManager();

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

      // Ctrl + Alt + Delete OR Ctrl + Shift + Esc - Open Task Manager
      if ((e.ctrlKey && e.altKey && e.key === "Delete") || 
          (e.ctrlKey && e.shiftKey && e.key === "Escape")) {
        e.preventDefault();
        
        // Check if Task Manager is already open
        const taskManagerWindow = windows.find(w => w.title === "Task Manager");
        if (taskManagerWindow) {
          focusWindow(taskManagerWindow.id);
        } else {
          openWindow({
            title: "Task Manager",
            component: TaskManager,
            isMinimized: false,
            isMaximized: false,
            position: { x: 200, y: 150 },
            size: getWindowSize("task-manager"),
            icon: "/computer_taskmgr-0.png",
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [windows, closeWindow, minimizeWindow, focusWindow, openWindow]);
}
