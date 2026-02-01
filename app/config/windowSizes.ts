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
  | "default";

/**
 * Window size configurations for each application
 * Format: { width: pixels, height: pixels }
 * Width = horizontal dimension, Height = vertical dimension
 *
 * Sizes account for:
 * - Title bar: ~20px height
 * - Window borders: 4px total (2px each side)
 * - Content padding: 8px (p-2 in Window.tsx)
 * - Status bars, toolbars, and other chrome
 */
export const WINDOW_SIZES: Record<AppId, WindowSize> = {
  // Pinball needs to be TALL to show the vertical pinball table
  // The classic Space Cadet table is vertical (portrait orientation)
  // Increased height significantly to show full table without scrolling
  pinball: {
    width: 650, // Width for the table + scoreboard
    height: 750, // Tall enough for vertical table (was 480, now much taller)
  },

  // Internet Explorer needs ample space for modern web browsing
  // Larger size prevents cramped iframe display
  "internet-explorer": {
    width: 1000, // Wide for modern websites (was 800)
    height: 700, // Tall for scrolling content (was 600)
  },

  // Notepad text editor - generous size for comfortable editing
  notepad: {
    width: 700, // Wide enough for ~80 characters (was 600)
    height: 500, // Tall for multiple paragraphs (was 400)
  },

  // Paint needs space for 600x400 canvas PLUS toolbar + status bar
  // Canvas is 600x400, need extra for chrome:
  // - Toolbar: ~40px, Status bar: ~20px, Title: ~20px, Padding: 16px
  // Total vertical: 400 + 40 + 20 + 20 + 16 = 496, rounded to 520 for comfort
  // Horizontal: 600 + borders + padding = 620
  paint: {
    width: 650, // Canvas 600 + padding/borders (was 600)
    height: 550, // Canvas 400 + toolbars + chrome (was 400)
  },

  // Chat room needs space for messages + user list sidebar
  chatroom: {
    width: 700, // Wide for chat + 150px user list (was 600)
    height: 550, // Tall for message history (was 400)
  },

  // Solitaire card game - already well-sized for full 7-column layout
  solitaire: {
    width: 940, // Fits all 7 columns comfortably
    height: 600, // Tall for card stacks (was 560)
  },

  // Minesweeper game - starts with beginner size, auto-resizes on difficulty change
  // Slightly larger to prevent clipping on beginner board
  minesweeper: {
    width: 250, // Beginner board + small buffer (was 220)
    height: 350, // Menu + board + status (was 320)
  },

  // DOOM - Classic FPS game needs good size for gameplay
  // 800x600 provides classic 4:3 aspect ratio with room for controls
  doom: {
    width: 800,
    height: 600,
  },

  // File Explorer (My Computer, Recycle Bin) - room for file listings
  "my-computer": {
    width: 700, // Wide for file details (was 600)
    height: 500, // Tall for multiple files (was 400)
  },

  "recycle-bin": {
    width: 700, // Wide for file details (was 600)
    height: 500, // Tall for multiple files (was 400)
  },

  // Default fallback size for any unlisted apps - generous sizing
  default: {
    width: 700, // Comfortable default width (was 600)
    height: 500, // Comfortable default height (was 400)
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
