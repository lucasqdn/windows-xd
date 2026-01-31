'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

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
};

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

export function WindowManagerProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const openWindow = useCallback((window: Omit<WindowState, 'id' | 'isOpen' | 'zIndex'>): string => {
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newWindow: WindowState = {
      ...window,
      id,
      isOpen: true,
      zIndex: windows.length
    };
    setWindows(prev => [...prev, newWindow]);
    return id;
  }, [windows.length]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: true } : w
    ));
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
        zIndex: w.id === id ? sorted.length : i,
        isMinimized: w.id === id ? false : w.isMinimized
      }));
    });
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
      updateWindowSize
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
