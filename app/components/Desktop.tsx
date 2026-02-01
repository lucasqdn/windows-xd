"use client";

import { useState } from "react";
import {
  WindowManagerProvider,
  useWindowManager,
} from "@/app/contexts/WindowManagerContext";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";
import { Notepad } from "./apps/Notepad";
import { Paint } from "./apps/Paint";
import { FileExplorer } from "./apps/FileExplorer";
import ChatRoom from "./apps/ChatRoom";
import { InternetExplorer } from "./apps/InternetExplorer";
import { SpaceCadetPinball } from "./apps/SpaceCadetPinball";
import Minesweeper from "./apps/Minesweeper";
import { Solitaire } from "./apps/Solitaire";
import {
  ContextMenu,
  useContextMenu,
  type ContextMenuItem,
} from "./ContextMenu";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { useSoundEffects } from "@/app/hooks/useSoundEffects";
import { getWindowSize } from "@/app/config/windowSizes";
import Image from "next/image";
import { Clippy } from "./Clippy";

type DesktopIconData = {
  id: string;
  icon: string;
  label: string;
  component: React.ComponentType<{ id: string }>;
};

const desktopIcons: DesktopIconData[] = [
  {
    id: "my-computer",
    icon: "/computer_explorer-2.png",
    label: "My Computer",
    component: FileExplorer,
  },
  {
    id: "recycle-bin",
    icon: "/recycle_bin_empty-2.png",
    label: "Recycle Bin",
    component: FileExplorer,
  },
  {
    id: "internet-explorer",
    icon: "/msie2-2.png",
    label: "Internet Explorer",
    component: InternetExplorer,
  },
  {
    id: "notepad",
    icon: "/notepad-4.png",
    label: "Notepad",
    component: Notepad,
  },
  { id: "paint", icon: "/paint_old-0.png", label: "Paint", component: Paint },
  {
    id: "minesweeper",
    icon: "/game_mine_1-0.png",
    label: "Minesweeper",
    component: Minesweeper,
  },
  {
    id: "solitaire",
    icon: "/solitaire-32x32.png",
    label: "Solitaire",
    component: Solitaire,
  },
  {
    id: "chatroom",
    icon: "/globe.svg",
    label: "Chat Room",
    component: ChatRoom,
  },
  {
    id: "pinball",
    icon: "/pinball-icon.png",
    label: "3D Pinball",
    component: SpaceCadetPinball,
  },
];

function DesktopContent() {
  const { windows, openWindow } = useWindowManager();
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
  const [showClippy, setShowClippy] = useState(false);

  // Initialize keyboard shortcuts and sound effects
  useKeyboardShortcuts();
  useSoundEffects();

  const handleIconDoubleClick = (iconData: DesktopIconData) => {
    // Check if window is already open
    const existingWindow = windows.find((w) => w.title === iconData.label);
    if (existingWindow) {
      // If window exists, just focus it instead of opening a new one
      return;
    }

    // Get window size from centralized config
    const windowSize = getWindowSize(iconData.id);

    console.log(`[Desktop] Opening ${iconData.label} with size:`, windowSize);

    openWindow({
      title: iconData.label,
      component: iconData.component,
      isMinimized: false,
      isMaximized: false,
      position: {
        x: 100 + windows.length * 30,
        y: 100 + windows.length * 30,
      },
      size: windowSize,
      icon: iconData.icon,
    });
  };

  const handleProgramLaunch = (programId: string) => {
    if (programId === "clippy") {
      setShowClippy(true);
      return;
    }
    
    const iconData = desktopIcons.find((icon) => icon.id === programId);
    if (iconData) {
      handleIconDoubleClick(iconData);
    }
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    const menuItems: ContextMenuItem[] = [
      {
        label: "Arrange Icons",
        icon: "📋",
        submenu: [
          { label: "By Name", onClick: () => console.log("Arrange by name") },
          { label: "By Type", onClick: () => console.log("Arrange by type") },
          { label: "By Size", onClick: () => console.log("Arrange by size") },
          { label: "Auto Arrange", onClick: () => console.log("Auto arrange") },
        ],
      },
      { divider: true },
      {
        label: "Refresh",
        icon: "🔄",
        onClick: () => window.location.reload(),
      },
      { divider: true },
      {
        label: "Paste",
        icon: "📋",
        disabled: true,
      },
      { divider: true },
      {
        label: "New",
        icon: "📄",
        submenu: [
          { label: "Folder", onClick: () => console.log("New folder") },
          {
            label: "Text Document",
            onClick: () => handleProgramLaunch("notepad"),
          },
        ],
      },
      { divider: true },
      {
        label: "Properties",
        icon: "⚙️",
        onClick: () => console.log("Desktop properties"),
      },
    ];

    showContextMenu(e, menuItems);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Desktop Background */}
      <Image
        src="/windows-xd backgroud.png"
        alt="Desktop Background"
        fill
        className="object-cover"
        priority
      />
      {/* Desktop Icons */}
      <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            icon={icon.icon}
            label={icon.label}
            onDoubleClick={() => handleIconDoubleClick(icon)}
          />
        ))}
      </div>

      {/* Windows */}
      {windows.map((window) => (
        <Window key={window.id} id={window.id} title={window.title}>
          <window.component id={window.id} />
        </Window>
      ))}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={hideContextMenu}
        />
      )}

      {/* Taskbar */}
      <Taskbar onProgramLaunch={handleProgramLaunch} />

      {/* Clippy */}
      <Clippy manualTrigger={showClippy} onClose={() => setShowClippy(false)} />
    </div>
  );
}

export function Desktop() {
  return (
    <WindowManagerProvider>
      <DesktopContent />
    </WindowManagerProvider>
  );
}
