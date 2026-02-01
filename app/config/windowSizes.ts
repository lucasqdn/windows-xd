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
  | "my-computer"
  | "recycle-bin"
  | "default";

/**
 * Window size configurations for each application
 * Format: { width: pixels, height: pixels }
 * Width = horizontal dimension, Height = vertical dimension
 */
export const WINDOW_SIZES: Record<AppId, WindowSize> = {
  // Pinball needs to be TALL to show the vertical pinball table
  // The classic Space Cadet table is vertical (portrait orientation)
  pinball: {
    width: 1000, // Width for the table + scoreboard
    height: 480, // Height for vertical table view
  },

  // Internet Explorer needs more space for web browsing
  "internet-explorer": {
    width: 800,
    height: 600,
  },

  // Notepad is a simple text editor
  notepad: {
    width: 600,
    height: 400,
  },

  // Paint needs decent space for canvas
  paint: {
    width: 600,
    height: 400,
  },

  // Chat room works well in a medium window
  chatroom: {
    width: 600,
    height: 400,
  },

  // Solitaire card game
  solitaire: {
    width: 940,
    height: 560,
  },

  // File Explorer (My Computer, Recycle Bin)
  "my-computer": {
    width: 600,
    height: 400,
  },

  "recycle-bin": {
    width: 600,
    height: 400,
  },

  // Default fallback size for any unlisted apps
  default: {
    width: 600,
    height: 400,
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
