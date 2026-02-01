/**
 * Windows 98 Theme System
 * 
 * Authentic color schemes from Windows 98, allowing users to customize
 * the appearance of the entire desktop environment instantly.
 */

export type ThemeName = 
  | 'windows-standard'
  | 'high-contrast-black'
  | 'brick'
  | 'rainy-day'
  | 'desert'
  | 'eggplant';

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    titleBarActiveStart: string;
    titleBarActiveEnd: string;
    titleBarInactive: string;
    windowBg: string;
    buttonFace: string;
    buttonHighlight: string;
    buttonShadow: string;
    buttonDarkShadow: string;
    desktopBg: string;
    textPrimary: string;
    textInverse: string;
  };
}

/**
 * All 6 authentic Windows 98 color schemes
 */
export const themes: Record<ThemeName, Theme> = {
  'windows-standard': {
    name: 'windows-standard',
    displayName: 'Windows Standard',
    colors: {
      titleBarActiveStart: '#000080',  // Navy blue
      titleBarActiveEnd: '#1084d0',    // Light blue
      titleBarInactive: '#808080',     // Gray
      windowBg: '#c0c0c0',             // Gray
      buttonFace: '#c0c0c0',
      buttonHighlight: '#ffffff',
      buttonShadow: '#808080',
      buttonDarkShadow: '#000000',
      desktopBg: '#008080',            // Teal
      textPrimary: '#000000',
      textInverse: '#ffffff',
    },
  },

  'high-contrast-black': {
    name: 'high-contrast-black',
    displayName: 'High Contrast Black',
    colors: {
      titleBarActiveStart: '#000000',
      titleBarActiveEnd: '#000000',
      titleBarInactive: '#808080',
      windowBg: '#000000',
      buttonFace: '#000000',
      buttonHighlight: '#ffffff',
      buttonShadow: '#808080',
      buttonDarkShadow: '#ffffff',
      desktopBg: '#000000',
      textPrimary: '#ffff00',          // Yellow text on black
      textInverse: '#000000',
    },
  },

  'brick': {
    name: 'brick',
    displayName: 'Brick',
    colors: {
      titleBarActiveStart: '#800000',  // Maroon
      titleBarActiveEnd: '#ff6347',    // Tomato
      titleBarInactive: '#a0806a',
      windowBg: '#c0a090',
      buttonFace: '#c0a090',
      buttonHighlight: '#ffffff',
      buttonShadow: '#806050',
      buttonDarkShadow: '#402010',
      desktopBg: '#a05040',
      textPrimary: '#000000',
      textInverse: '#ffffff',
    },
  },

  'rainy-day': {
    name: 'rainy-day',
    displayName: 'Rainy Day',
    colors: {
      titleBarActiveStart: '#000080',
      titleBarActiveEnd: '#4169e1',    // Royal blue
      titleBarInactive: '#6495ed',
      windowBg: '#b0c4de',             // Light steel blue
      buttonFace: '#b0c4de',
      buttonHighlight: '#ffffff',
      buttonShadow: '#6495ed',
      buttonDarkShadow: '#000080',
      desktopBg: '#4682b4',            // Steel blue
      textPrimary: '#000000',
      textInverse: '#ffffff',
    },
  },

  'desert': {
    name: 'desert',
    displayName: 'Desert',
    colors: {
      titleBarActiveStart: '#8b4513',  // Saddle brown
      titleBarActiveEnd: '#daa520',    // Goldenrod
      titleBarInactive: '#d2b48c',
      windowBg: '#f5deb3',             // Wheat
      buttonFace: '#f5deb3',
      buttonHighlight: '#ffffff',
      buttonShadow: '#d2b48c',
      buttonDarkShadow: '#8b4513',
      desktopBg: '#daa520',
      textPrimary: '#000000',
      textInverse: '#ffffff',
    },
  },

  'eggplant': {
    name: 'eggplant',
    displayName: 'Eggplant',
    colors: {
      titleBarActiveStart: '#4b0082',  // Indigo
      titleBarActiveEnd: '#9370db',    // Medium purple
      titleBarInactive: '#9370db',
      windowBg: '#dda0dd',             // Plum
      buttonFace: '#dda0dd',
      buttonHighlight: '#ffffff',
      buttonShadow: '#9370db',
      buttonDarkShadow: '#4b0082',
      desktopBg: '#8b008b',            // Dark magenta
      textPrimary: '#000000',
      textInverse: '#ffffff',
    },
  },
};

/**
 * Default theme on first load
 */
export const defaultTheme: ThemeName = 'windows-standard';
