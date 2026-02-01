"use client";

import { Rnd } from "react-rnd";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";
import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";

type WindowProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function Window({ id, title, children }: WindowProps) {
  const { windows, focusWindow, closeWindow, minimizeWindow, maximizeWindow, updateWindowPosition, updateWindowSize } = useWindowManager();
  
  const windowState = windows.find(w => w.id === id);
  
  // Track animation and interaction states
  const [animationClass, setAnimationClass] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const prevMaximizedRef = useRef<boolean>(false);
  
  if (!windowState || (windowState.isMinimized && windowState.animationState !== 'minimizing')) {
    return null;
  }

  // Handle maximize animation
  useEffect(() => {
    if (windowState.isMaximized && !prevMaximizedRef.current) {
      // Window was just maximized
      setAnimationClass('window-maximizing');
      const timer = setTimeout(() => setAnimationClass(''), 200);
      return () => clearTimeout(timer);
    }
    prevMaximizedRef.current = windowState.isMaximized;
  }, [windowState.isMaximized]);

  // Log window dimensions for debugging
  console.log(`[Window] Rendering "${title}" - width: ${windowState.size.width}, height: ${windowState.size.height}`);

  const isActive = windowState.zIndex === Math.max(...windows.map(w => w.zIndex));
  
  // Determine base animation class from window state
  const getBaseAnimationClass = () => {
    switch (windowState.animationState) {
      case 'opening':
        return 'window-opening';
      case 'minimizing':
        return 'window-minimizing';
      case 'restoring':
        return 'window-restoring';
      default:
        return '';
    }
  };

  // Combine all window classes
  const windowClasses = [
    'win98-window h-full flex flex-col',
    getBaseAnimationClass(),
    animationClass,
    isDragging && 'window-dragging',
    isResizing && 'window-resizing',
  ].filter(Boolean).join(' ');

  const handleMinimize = () => {
    minimizeWindow(id);
  };

  const handleMaximize = () => {
    console.log('Maximize clicked, current state:', windowState.isMaximized);
    maximizeWindow(id);
  };

  const handleClose = () => {
    closeWindow(id);
  };

  console.log('Window render - ID:', id, 'isMaximized:', windowState.isMaximized);

  // For maximized windows, render differently without Rnd
  if (windowState.isMaximized) {
    return (
      <div
        className="fixed inset-0"
        style={{ 
          zIndex: windowState.zIndex,
          bottom: '40px',
        }}
        onMouseDown={() => focusWindow(id)}
        data-window-id={id}
      >
        <div className="win98-window w-full h-full flex flex-col">
          {/* Title Bar */}
          <div
            className={`window-title-bar flex items-center justify-between px-1 py-0.5 cursor-default ${
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
                aria-label="Restore"
              >
                ❐
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
          <div className="flex-1 bg-white w-full">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Rnd
      size={{ 
        width: windowState.size.width, 
        height: windowState.size.height 
      }}
      position={{ 
        x: windowState.position.x, 
        y: windowState.position.y 
      }}
      onDragStart={() => setIsDragging(true)}
      onDragStop={(e, d) => {
        setIsDragging(false);
        updateWindowPosition(id, { x: d.x, y: d.y });
      }}
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={(e, direction, ref, delta, position) => {
        setIsResizing(false);
        updateWindowSize(id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height) });
        updateWindowPosition(id, { x: position.x, y: position.y });
      }}
      minWidth={200}
      minHeight={150}
      bounds="parent"
      dragHandleClassName="window-title-bar"
      style={{ zIndex: windowState.zIndex }}
      onMouseDown={() => focusWindow(id)}
      disableDragging={false}
      enableResizing={true}
    >
      <div 
        className={windowClasses}
        data-window-id={id}
      >
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
        <div className="flex-1 overflow-hidden bg-white">
          <div className="h-full overflow-auto p-2">
            {children}
          </div>
        </div>
      </div>
    </Rnd>
  );
}
