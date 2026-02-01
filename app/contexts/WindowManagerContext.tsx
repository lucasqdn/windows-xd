'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useTheme } from '@/app/hooks/useTheme';
import type { ThemeName } from '@/app/lib/themes';

export type WindowState = {
  id: string;
  title: string;
  component: React.ComponentType<{ id: string }>;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  icon?: string;
  animationState?: 'opening' | 'minimizing' | 'restoring' | 'none';
};

type WindowManagerContextType = {
  windows: WindowState[];
  openWindow: (window: Omit<WindowState, 'id' | 'isOpen' | 'zIndex'>) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  theme: {
    currentTheme: ThemeName;
    setTheme: (themeName: ThemeName) => void;
    availableThemes: Array<{ name: ThemeName; displayName: string }>;
  };
};

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

export function WindowManagerProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const theme = useTheme();

  const openWindow = useCallback((window: Omit<WindowState, 'id' | 'isOpen' | 'zIndex' | 'animationState'>): string => {
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`[WindowManager] Opening window "${window.title}" with size:`, window.size);
    
    const newWindow: WindowState = {
      ...window,
      id,
      isOpen: true,
      zIndex: 100 + windows.length,
      animationState: 'opening'
    };
    setWindows(prev => [...prev, newWindow]);
    
    // Clear animation state after animation completes
    setTimeout(() => {
      setWindows(prev => prev.map(w =>
        w.id === id ? { ...w, animationState: 'none' } : w
      ));
    }, 150);
    
    return id;
  }, [windows.length]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, animationState: 'minimizing' } : w
    ));
    
    // Wait for animation to complete before actually minimizing
    setTimeout(() => {
      setWindows(prev => prev.map(w =>
        w.id === id ? { ...w, isMinimized: true, animationState: 'none' } : w
      ));
    }, 200);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  // CRITICAL: Proper z-index management to prevent infinite growth
  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
      return sorted.map((w, i) => ({
        ...w,
        zIndex: w.id === id ? 100 + sorted.length : 100 + i,
        isMinimized: w.id === id ? false : w.isMinimized,
        animationState: w.id === id && w.isMinimized ? 'restoring' : w.animationState
      }));
    });
    
    // Clear restoring animation after it completes
    setTimeout(() => {
      setWindows(prev => prev.map(w =>
        w.id === id ? { ...w, animationState: 'none' } : w
      ));
    }, 200);
  }, []);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, position } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, size } : w
    ));
  }, []);

  return (
    <WindowManagerContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      theme
    }}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (context === undefined) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
}
