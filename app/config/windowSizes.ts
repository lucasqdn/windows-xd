/**
 * Centralized Window Size Configuration
 *
 * This file defines the default window sizes for all applications.
 * All window creation should reference this config to ensure consistency.
 */

export type WindowSize = {
  width: number;
  height: number;
};

export type AppId =
  | "pinball"
  | "internet-explorer"
  | "notepad"
  | "paint"
  | "chatroom"
  | "solitaire"
  | "minesweeper"
  | "doom"
  | "my-computer"
  | "recycle-bin"
  | "task-manager"
  | "default";

/**
 * Window size configurations for each application
 * Format: { width: pixels, height: pixels }
 * Width = horizontal dimension, Height = vertical dimension
 * Sizes inspired by 98.js.org - generous defaults that show full app content
 */
export const WINDOW_SIZES: Record<AppId, WindowSize> = {
  // Pinball needs to be TALL to show the vertical pinball table
  // The classic Space Cadet table is vertical (portrait orientation)
  // Increased height significantly to show full table without scrolling
  pinball: {
    width: 600,   // Optimal width for pinball table
    height: 700,  // Tall vertical table
  },

  // Internet Explorer needs ample space for web browsing
  "internet-explorer": {
    width: 1024,  // Wide enough for most websites
    height: 768,  // Standard 4:3 aspect ratio
  },

  // Notepad is a simple text editor - comfortable size for editing
  notepad: {
    width: 800,   // Wide enough for ~100 characters
    height: 600,  // Tall enough for substantial text
  },

  // Paint needs space for 600x400 canvas + toolbars
  paint: {
    width: 800,   // Canvas + toolbars + comfortable margin
    height: 600,  // Canvas + menu + status bars
  },

  // Chat room needs space for messages + user list sidebar
  // Chat room needs space for messages + user list sidebar
  chatroom: {
    width: 800,   // Wide for chat + 150px user list
    height: 600,  // Tall for message history
  },

  // Solitaire card game - classic Windows Solitaire size
  solitaire: {
    width: 940,   // Fits all 7 columns comfortably
    height: 640,  // Tall for card stacks and movements
  },

  // Minesweeper game - starts with beginner size, auto-resizes on difficulty change
  // Slightly larger to prevent clipping on beginner board
  minesweeper: {
    width: 250,   // Beginner board + small buffer
    height: 350,  // Menu + board + status
  },

  // Doom - classic FPS game with full viewport
  doom: {
    width: 1024,  // Wide for immersive first-person view
    height: 768,  // Tall for full gameplay experience
  },

  // File Explorer (My Computer, Recycle Bin) - room for file listings
  // File Explorer (My Computer, Recycle Bin) - room for file listings
  "my-computer": {
    width: 800,   // Wide for detailed file view
    height: 600,  // Tall for multiple files and folders
  },

  "recycle-bin": {
    width: 800,   // Wide for detailed file view
    height: 600,  // Tall for multiple items
  },

  // Task Manager - system monitoring and task management
  "task-manager": {
    width: 500,   // Compact width for task list
    height: 400,  // Enough for processes and stats
  },

  // Default fallback size for any unlisted apps - generous sizing
  // Default fallback size for any unlisted apps - generous sizing
  default: {
    width: 800,   // Comfortable default width
    height: 600,  // Comfortable default height
  },
};

/**
 * Get window size for a specific app
 * Falls back to default size if app ID not found
 */
export function getWindowSize(appId: string): WindowSize {
  const size = WINDOW_SIZES[appId as AppId];
  if (!size) {
    console.warn(
      `[WindowConfig] No size defined for "${appId}", using default`,
    );
    return WINDOW_SIZES.default;
  }
  return size;
}

/**
 * Set a custom window size for an app (useful for testing)
 */
export function setWindowSize(appId: AppId, size: WindowSize): void {
  WINDOW_SIZES[appId] = size;
  console.log(
    `[WindowConfig] Updated ${appId} size to ${size.width}×${size.height}`,
  );
}
