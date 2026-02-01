"use client";

import { useState, useEffect, useCallback } from "react";
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
import { VirusNotification } from "./system/VirusNotification";
import { VirusSimulation } from "./virus/VirusSimulation";
import { VIRUS_TIMING } from "@/app/lib/virus/types";

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
  const { windows, openWindow, selectMultipleIcons, clearSelection } = useWindowManager();
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
  const [showClippy, setShowClippy] = useState(false);
  const [showVirusNotification, setShowVirusNotification] = useState(false);
  const [virusActive, setVirusActive] = useState(false);
  const [isDragSelecting, setIsDragSelecting] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });

  // Initialize keyboard shortcuts and sound effects
  useKeyboardShortcuts();
  useSoundEffects();

  // Virus notification timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVirusNotification(true);
    }, VIRUS_TIMING.notificationDelay);

    return () => clearTimeout(timer);
  }, []);

  const handleVirusRun = () => {
    setShowVirusNotification(false);
    setVirusActive(true);
  };

  const handleVirusCancel = () => {
    setShowVirusNotification(false);
    // Show notification again after delay
    setTimeout(() => {
      setShowVirusNotification(true);
    }, VIRUS_TIMING.notificationRepeatDelay);
  };

  // Drag-select rectangle logic
  const updateSelectionInRectangle = useCallback(() => {
    const rect = {
      left: Math.min(dragStart.x, dragCurrent.x),
      top: Math.min(dragStart.y, dragCurrent.y),
      right: Math.max(dragStart.x, dragCurrent.x),
      bottom: Math.max(dragStart.y, dragCurrent.y),
    };
    
    const iconsInRect = desktopIcons.filter(icon => {
      const iconEl = document.getElementById(`desktop-icon-${icon.id}`);
      if (!iconEl) return false;
      
      const iconBounds = iconEl.getBoundingClientRect();
      return !(
        iconBounds.right < rect.left ||
        iconBounds.left > rect.right ||
        iconBounds.bottom < rect.top ||
        iconBounds.top > rect.bottom
      );
    });
    
    selectMultipleIcons(iconsInRect.map(i => i.id));
  }, [dragStart, dragCurrent, selectMultipleIcons]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag-select if clicking desktop itself (not icon)
    if (e.target === e.currentTarget && e.button === 0) {
      setIsDragSelecting(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragCurrent({ x: e.clientX, y: e.clientY });
      
      // Clear existing selection if not holding Ctrl
      if (!e.ctrlKey && !e.metaKey) {
        clearSelection();
      }
    }
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    // Clear selection when clicking empty desktop
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  useEffect(() => {
    if (!isDragSelecting) return;

    const handleMouseMove = (e: MouseEvent) => {
      setDragCurrent({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragSelecting(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragSelecting]);

  useEffect(() => {
    if (isDragSelecting) {
      updateSelectionInRectangle();
    }
  }, [isDragSelecting, dragCurrent, updateSelectionInRectangle]);

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
    const { theme } = useWindowManager();
    
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
        label: "Appearance",
        submenu: theme.availableThemes.map((t) => ({
          label: t.displayName,
          radioSelected: theme.currentTheme === t.name,
          onClick: () => theme.setTheme(t.name),
        })),
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
      onMouseDown={handleMouseDown}
      onClick={handleDesktopClick}
      data-desktop-root
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

      {/* Virus Notification */}
      {showVirusNotification && (
        <VirusNotification onRun={handleVirusRun} onCancel={handleVirusCancel} />
      )}

      {/* Virus Simulation */}
      {virusActive && <VirusSimulation />}

      {/* Drag-select rectangle */}
      {isDragSelecting && (
        <div
          className="selection-rectangle"
          style={{
            position: 'fixed',
            left: Math.min(dragStart.x, dragCurrent.x),
            top: Math.min(dragStart.y, dragCurrent.y),
            width: Math.abs(dragCurrent.x - dragStart.x),
            height: Math.abs(dragCurrent.y - dragStart.y),
            border: '1px solid var(--title-bar-active-start)',
            background: 'rgba(0, 0, 128, 0.1)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
      )}
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
