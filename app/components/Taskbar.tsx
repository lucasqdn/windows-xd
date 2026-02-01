"use client";

import { useState, useEffect } from "react";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";
import { StartMenu } from "./StartMenu";

type TaskbarProps = {
  onProgramLaunch: (program: string) => void;
};

export function Taskbar({ onProgramLaunch }: TaskbarProps) {
  const { windows, focusWindow, minimizeWindow } = useWindowManager();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  const handleTaskbarButtonClick = (windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (window?.isMinimized) {
      focusWindow(windowId);
    } else {
      minimizeWindow(windowId);
    }
  };

  return (
    <>
      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        onProgramClick={onProgramLaunch}
      />
      
      <div className="taskbar">
        <button
          className="win98-button flex items-center gap-1 px-2 font-bold"
          onClick={() => setStartMenuOpen(!startMenuOpen)}
        >
          <span className="text-sm">🪟</span>
          <span>Start</span>
        </button>
        
        {/* Window buttons */}
        <div className="flex gap-1 flex-1 overflow-x-auto">
          {windows.filter(w => w.isOpen).map((window) => (
            <button
              key={window.id}
              className={`taskbar-button ${!window.isMinimized && window.zIndex === Math.max(...windows.map(w => w.zIndex)) ? "active" : ""} ${window.isFlashing ? "flashing" : ""}`}
              onClick={() => handleTaskbarButtonClick(window.id)}
            >
              {window.icon && <span className="mr-1">{window.icon}</span>}
              {window.title}
            </button>
          ))}
        </div>
        
        {/* System tray */}
        <div className="system-tray">
          <span>{formatTime(time)}</span>
        </div>
      </div>
    </>
  );
}
