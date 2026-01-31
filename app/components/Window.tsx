"use client";

import { Rnd } from "react-rnd";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";
import type { ReactNode } from "react";

type WindowProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function Window({ id, title, children }: WindowProps) {
  const { windows, focusWindow, closeWindow, minimizeWindow, maximizeWindow, updateWindowPosition, updateWindowSize } = useWindowManager();
  
  const windowState = windows.find(w => w.id === id);
  
  if (!windowState || windowState.isMinimized) {
    return null;
  }

  const isActive = windowState.zIndex === Math.max(...windows.map(w => w.zIndex));

  const handleMinimize = () => {
    minimizeWindow(id);
  };

  const handleMaximize = () => {
    maximizeWindow(id);
  };

  const handleClose = () => {
    closeWindow(id);
  };

  return (
    <Rnd
      size={{ 
        width: windowState.isMaximized ? window.innerWidth : windowState.size.width, 
        height: windowState.isMaximized ? window.innerHeight - 30 : windowState.size.height 
      }}
      position={{ 
        x: windowState.isMaximized ? 0 : windowState.position.x, 
        y: windowState.isMaximized ? 0 : windowState.position.y 
      }}
      onDragStop={(e, d) => {
        updateWindowPosition(id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateWindowSize(id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height) });
        updateWindowPosition(id, { x: position.x, y: position.y });
      }}
      minWidth={200}
      minHeight={150}
      bounds="parent"
      dragHandleClassName="window-title-bar"
      style={{ zIndex: windowState.zIndex }}
      onMouseDown={() => focusWindow(id)}
      disableDragging={windowState.isMaximized}
      enableResizing={!windowState.isMaximized}
    >
      <div className="win98-window h-full flex flex-col">
        {/* Title Bar */}
        <div
          className={`window-title-bar flex items-center justify-between px-1 py-0.5 cursor-move ${
            isActive ? "win98-titlebar-active" : "win98-titlebar-inactive"
          }`}
        >
          <div className="flex items-center gap-1 flex-1 overflow-hidden">
            <span className="text-xs truncate">{title}</span>
          </div>
          <div className="flex gap-0.5">
            <button
              className="win98-button w-4 h-4 text-[8px] leading-none p-0 flex items-center justify-center"
              onClick={handleMinimize}
              aria-label="Minimize"
            >
              _
            </button>
            <button
              className="win98-button w-4 h-4 text-[8px] leading-none p-0 flex items-center justify-center"
              onClick={handleMaximize}
              aria-label="Maximize"
            >
              □
            </button>
            <button
              className="win98-button w-4 h-4 text-[8px] leading-none p-0 flex items-center justify-center"
              onClick={handleClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Window Content */}
        <div className="flex-1 overflow-auto bg-white p-2">
          {children}
        </div>
      </div>
    </Rnd>
  );
}
