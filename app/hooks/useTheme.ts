/**
 * Theme Management Hook
 * 
 * Provides theme state management with:
 * - Instant theme switching via CSS custom properties
 * - localStorage persistence across browser sessions
 * - SSR-safe initialization
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { themes, defaultTheme, type ThemeName, type Theme } from '@/app/lib/themes';

/**
 * Hook for managing Windows 98 color themes
 * 
 * @returns {object} Theme state and functions
 * - currentTheme: Active theme name
 * - setTheme: Function to change theme
 * - availableThemes: Array of all theme objects
 */
export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(defaultTheme);
  
  /**
   * Apply theme colors to CSS custom properties
   */
  const applyThemeColors = useCallback((theme: Theme) => {
    // Only run in browser (SSR-safe)
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    const colorMap: Record<string, string> = {
      'titleBarActiveStart': '--title-bar-active-start',
      'titleBarActiveEnd': '--title-bar-active-end',
      'titleBarInactive': '--title-bar-inactive',
      'windowBg': '--window-bg',
      'buttonFace': '--button-face',
      'buttonHighlight': '--button-highlight',
      'buttonShadow': '--button-shadow',
      'buttonDarkShadow': '--button-dark-shadow',
      'desktopBg': '--desktop-bg',
      'textPrimary': '--text-primary',
      'textInverse': '--text-inverse',
    };
    
    // Apply each color as a CSS custom property
    Object.entries(colorMap).forEach(([key, cssVar]) => {
      const color = theme.colors[key as keyof typeof theme.colors];
      root.style.setProperty(cssVar, color);
    });
  }, []);
  
  /**
   * Load theme from localStorage on mount
   */
  useEffect(() => {
    // Only run in browser (SSR-safe)
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('windows-xd-theme') as ThemeName | null;
      if (stored && themes[stored]) {
        setCurrentTheme(stored);
        applyThemeColors(themes[stored]);
      }
    } catch (error) {
      // Handle localStorage errors gracefully (private browsing, quota exceeded)
      console.warn('Failed to load theme from localStorage:', error);
    }
  }, [applyThemeColors]);
  
  /**
   * Change the active theme
   */
  const setTheme = useCallback((themeName: ThemeName) => {
    const theme = themes[themeName];
    if (!theme) {
      console.warn(`Theme "${themeName}" not found`);
      return;
    }
    
    // Update state
    setCurrentTheme(themeName);
    
    // Apply CSS variables instantly
    applyThemeColors(theme);
    
    // Persist to localStorage
    try {
      localStorage.setItem('windows-xd-theme', themeName);
    } catch (error) {
      // Handle localStorage errors gracefully
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [applyThemeColors]);
  
  return {
    currentTheme,
    setTheme,
    availableThemes: Object.values(themes),
  };
}
