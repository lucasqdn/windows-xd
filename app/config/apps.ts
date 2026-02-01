// Central configuration for all available applications
// Only apps listed here will appear in the Start Menu and Desktop

export type AppConfig = {
  id: string;
  label: string;
  icon: string;
  showInStartMenu?: boolean; // Default true
  showOnDesktop?: boolean; // Default false
};

export const AVAILABLE_APPS: AppConfig[] = [
  // Only applications that exist in app/components/apps/
  {
    id: "my-computer",
    label: "My Computer",
    icon: "/computer_explorer-2.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
  {
    id: "recycle-bin",
    label: "Recycle Bin",
    icon: "/recycle_bin_empty-2.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
  {
    id: "internet-explorer",
    label: "Internet Explorer",
    icon: "/msie2-2.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
  {
    id: "task-manager",
    label: "Task Manager",
    icon: "/computer_taskmgr-0.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
  {
    id: "notepad",
    label: "Notepad",
    icon: "/notepad-4.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
  {
    id: "paint",
    label: "Paint",
    icon: "/paint_old-0.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
  {
    id: "minesweeper",
    label: "Minesweeper",
    icon: "/game_mine_1-0.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
  {
    id: "solitaire",
    label: "Solitaire",
    icon: "/solitaire-32x32.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
  {
    id: "chatroom",
    label: "Chat Room",
    icon: "/chatroom.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
  {
    id: "pinball",
    label: "3D Pinball",
    icon: "/pinball-icon.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
  {
    id: "doom",
    label: "DOOM",
    icon: "/doom-icon.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
  {
    id: "media-player",
    label: "Windows Media Player",
    icon: "/media_player-0.png",
    showInStartMenu: true,
    showOnDesktop: true,
  },
];

// Get apps to show in Start Menu Programs list
export function getStartMenuApps(): AppConfig[] {
  return AVAILABLE_APPS.filter(app => app.showInStartMenu !== false);
}

// Get apps to show on Desktop
export function getDesktopApps(): AppConfig[] {
  return AVAILABLE_APPS.filter(app => app.showOnDesktop === true);
}
