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
import { Doom } from "./apps/Doom";
import { TaskManager } from "./apps/TaskManager";
import { MediaPlayer } from "./apps/MediaPlayer";
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
    id: "task-manager",
    icon: "/computer_taskmgr-0.png",
    label: "Task Manager",
    component: TaskManager,
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
    icon: "/chatroom.png",
    label: "Chat Room",
    component: ChatRoom,
  },
  {
    id: "pinball",
    icon: "/pinball-icon.png",
    label: "3D Pinball",
    component: SpaceCadetPinball,
  },
  {
    id: "doom",
    icon: "/doom-icon.png",
    label: "DOOM",
    component: Doom,
  },
  {
    id: "media-player",
    icon: "/media_player-0.png",
    label: "Windows Media Player",
    component: MediaPlayer,
  },
];

function DesktopContent() {
  const { windows, openWindow, focusWindow, selectMultipleIcons, clearSelection, theme, iconOrder, moveIcon } = useWindowManager();
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
  const [showClippy, setShowClippy] = useState(false);
  const [showVirusNotification, setShowVirusNotification] = useState(false);
  const [virusActive, setVirusActive] = useState(false);
  const [isDragSelecting, setIsDragSelecting] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
  const [currentIconOrder, setCurrentIconOrder] = useState<string[]>([]);
  const [draggedIconId, setDraggedIconId] = useState<string | null>(null);

  // Initialize icon order
  useEffect(() => {
    if (currentIconOrder.length === 0 && desktopIcons.length > 0) {
      setCurrentIconOrder(desktopIcons.map(icon => icon.id));
    }
  }, [currentIconOrder.length]);

  // Sync with context iconOrder when it changes
  useEffect(() => {
    if (iconOrder.length > 0) {
      setCurrentIconOrder(iconOrder);
    }
  }, [iconOrder]);

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
      // If window exists, focus and restore it instead of opening a new one
      focusWindow(existingWindow.id);
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

  // Calculate grid position for an icon based on its index
  const getGridPosition = (index: number) => {
    const ICON_WIDTH = 90;
    const ICON_HEIGHT = 90;
    const PADDING = 8;
    const TASKBAR_HEIGHT = 40;
    const MAX_ROWS = Math.floor((window.innerHeight - TASKBAR_HEIGHT - PADDING * 2) / ICON_HEIGHT);
    
    const col = Math.floor(index / MAX_ROWS);
    const row = index % MAX_ROWS;
    
    return {
      x: PADDING + (col * ICON_WIDTH),
      y: PADDING + (row * ICON_HEIGHT),
    };
  };

  const handleIconDragStart = (iconId: string) => {
    setDraggedIconId(iconId);
  };

  const handleIconDragMove = (mouseX: number, mouseY: number) => {
    if (!draggedIconId) return;

    // Calculate which grid position we're over
    const ICON_WIDTH = 90;
    const ICON_HEIGHT = 90;
    const PADDING = 8;
    const TASKBAR_HEIGHT = 40;
    const MAX_ROWS = Math.floor((window.innerHeight - TASKBAR_HEIGHT - PADDING * 2) / ICON_HEIGHT);
    
    const col = Math.floor((mouseX - PADDING) / ICON_WIDTH);
    const row = Math.floor((mouseY - PADDING) / ICON_HEIGHT);
    
    // Clamp values
    const clampedCol = Math.max(0, col);
    const clampedRow = Math.max(0, Math.min(row, MAX_ROWS - 1));
    
    const targetIndex = clampedRow + (clampedCol * MAX_ROWS);
    
    const currentIndex = currentIconOrder.indexOf(draggedIconId);
    if (currentIndex === -1 || currentIndex === targetIndex) return;
    
    // Only reorder if target index is within bounds
    if (targetIndex >= 0 && targetIndex < currentIconOrder.length) {
      const newOrder = [...currentIconOrder];
      newOrder.splice(currentIndex, 1);
      newOrder.splice(targetIndex, 0, draggedIconId);
      setCurrentIconOrder(newOrder);
    }
  };

  const handleIconDragEnd = () => {
    if (draggedIconId) {
      const finalIndex = currentIconOrder.indexOf(draggedIconId);
      if (finalIndex !== -1) {
        moveIcon(draggedIconId, finalIndex);
      }
      setDraggedIconId(null);
    }
  };

  // Get ordered icons
  const orderedIcons = currentIconOrder.length > 0
    ? currentIconOrder.map(id => desktopIcons.find(icon => icon.id === id)).filter(Boolean) as DesktopIconData[]
    : desktopIcons;

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
        src="/windows-xd-background.png"
        alt="Desktop Background"
        fill
        className="object-cover"
        priority
      />
      {/* Desktop Icons */}
      <div 
        className="absolute top-0 left-0 z-10"
        style={{
          width: '100vw',
          height: 'calc(100vh - 40px)',
        }}
      >
        {orderedIcons.map((icon, index) => {
          const gridPosition = getGridPosition(index);

          return (
            <DesktopIcon
              key={icon.id}
              id={icon.id}
              icon={icon.icon}
              label={icon.label}
              onDoubleClick={() => handleIconDoubleClick(icon)}
              index={index}
              onDragStart={handleIconDragStart}
              onDragMove={handleIconDragMove}
              onDragEnd={handleIconDragEnd}
              gridPosition={gridPosition}
            />
          );
        })}
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
