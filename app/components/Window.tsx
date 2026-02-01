"use client";

import { Rnd } from "react-rnd";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";
import { useSoundEffects } from "@/app/hooks/useSoundEffects";
import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";

type WindowProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function Window({ id, title, children }: WindowProps) {
  const { windows, focusWindow, closeWindow, minimizeWindow, maximizeWindow, updateWindowPosition, updateWindowSize } = useWindowManager();
  const { playSound } = useSoundEffects();
  
  const windowState = windows.find(w => w.id === id);
  
  // Track animation and interaction states
  const [animationClass, setAnimationClass] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const prevMaximizedRef = useRef<boolean>(false);
  const prevStateRef = useRef<'normal' | 'minimized' | 'maximized'>('normal');
  const hasPlayedOpenSound = useRef(false);

  // Play window open sound on mount
  useEffect(() => {
    if (!hasPlayedOpenSound.current && windowState) {
      playSound('windowOpen');
      hasPlayedOpenSound.current = true;
    }
  }, [playSound, windowState]);

  // Play sounds on window state changes
  useEffect(() => {
    if (!windowState) return;
    
    const currentState = windowState.isMinimized ? 'minimized' : windowState.isMaximized ? 'maximized' : 'normal';
    const prevState = prevStateRef.current;

    if (currentState !== prevState) {
      if (currentState === 'minimized' && prevState !== 'minimized') {
        playSound('windowMinimize');
      } else if (currentState === 'maximized' && prevState !== 'maximized') {
        playSound('windowMaximize');
      } else if (currentState === 'normal' && prevState === 'minimized') {
        playSound('windowRestore');
      }
      
      prevStateRef.current = currentState;
    }
  }, [windowState, playSound]);

  // Handle maximize animation
  useEffect(() => {
    if (!windowState) return;
    
    if (windowState.isMaximized && !prevMaximizedRef.current) {
      // Window was just maximized
      setAnimationClass('window-maximizing');
      const timer = setTimeout(() => setAnimationClass(''), 200);
      return () => clearTimeout(timer);
    }
    prevMaximizedRef.current = windowState.isMaximized;
  }, [windowState]);
  
  // Early return AFTER all hooks have been called
  if (!windowState || (windowState.isMinimized && windowState.animationState !== 'minimizing')) {
    return null;
  }

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

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeWindow(id);
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Maximize clicked, current state:', windowState.isMaximized);
    maximizeWindow(id);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('windowClose');
    closeWindow(id);
  };

  const handleTitleBarDoubleClick = () => {
    if (windowState.isMaximized) {
      maximizeWindow(id); // Toggle off (restore)
    } else if (!windowState.isMinimized) {
      maximizeWindow(id); // Toggle on (maximize)
    }
    // If minimized, do nothing (can't double-click minimized window)
  };

  console.log('Window render - ID:', id, 'isMaximized:', windowState.isMaximized);

  // Calculate full screen dimensions
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight - 40 : 1040; // Subtract taskbar height

  // Always use Rnd but adjust behavior for maximized state
  return (
    <Rnd
      size={windowState.isMaximized 
        ? { width: screenWidth, height: screenHeight }
        : { width: windowState.size.width, height: windowState.size.height }
      }
      position={windowState.isMaximized 
        ? { x: 0, y: 0 }
        : { x: windowState.position.x, y: windowState.position.y }
      }
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
      bounds="window"
      dragHandleClassName="window-title-bar"
      style={{ zIndex: windowState.zIndex }}
      onMouseDown={() => focusWindow(id)}
      disableDragging={windowState.isMaximized}
      enableResizing={windowState.isMaximized ? false : {
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
    >
      <div 
        className={windowClasses}
        data-window-id={id}
      >
        <div className="win98-window w-full h-full flex flex-col">
          {/* Title Bar */}
          <div
            className={`window-title-bar flex items-center justify-between px-1 py-0.5 ${windowState.isMaximized ? 'cursor-default' : 'cursor-move'} select-none ${
              isActive ? "win98-titlebar-active" : "win98-titlebar-inactive"
            }`}
            onDoubleClick={handleTitleBarDoubleClick}
          >
            <div className="flex items-center gap-1 flex-1 overflow-hidden">
              <span className="text-xs truncate">{title}</span>
            </div>
            <div className="flex gap-0.5">
              <button
                className="win98-button-xs"
                onClick={handleMinimize}
                aria-label="Minimize"
              >
                _
              </button>
              <button
                className="win98-button-xs"
                onClick={handleMaximize}
                aria-label={windowState.isMaximized ? "Restore" : "Maximize"}
              >
                {windowState.isMaximized ? '❐' : '□'}
              </button>
              <button
                className="win98-button-xs"
                onClick={handleClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
          {/* Window Content */}
          <div className="flex-1 overflow-hidden" style={{ background: 'var(--window-bg)' }}>
            <div className="h-full overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Rnd>
  );
}
