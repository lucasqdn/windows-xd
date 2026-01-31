"use client";

import { WindowManagerProvider, useWindowManager } from "@/app/contexts/WindowManagerContext";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";
import { Notepad } from "./apps/Notepad";
import { Paint } from "./apps/Paint";
import { FileExplorer } from "./apps/FileExplorer";
import { ContextMenu, useContextMenu, type ContextMenuItem } from "./ContextMenu";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { useSoundEffects } from "@/app/hooks/useSoundEffects";
import Image from "next/image";

// Placeholder for Chat Room
function ChatRoomContent({ id }: { id: string }) {
  return (
    <div className="h-full flex items-center justify-center text-gray-500 bg-white">
      <p>Chat Room (Phase 5 - Coming Soon)</p>
    </div>
  );
}

type DesktopIconData = {
  id: string;
  icon: string;
  label: string;
  component: React.ComponentType<{ id: string }>;
};

const desktopIcons: DesktopIconData[] = [
  { id: "my-computer", icon: "/computer_explorer-2.png", label: "My Computer", component: FileExplorer },
  { id: "recycle-bin", icon: "/recycle_bin_empty-2.png", label: "Recycle Bin", component: FileExplorer },
  { id: "notepad", icon: "/directory_closed-3.png", label: "Notepad", component: Notepad },
  { id: "paint", icon: "/directory_closed-3.png", label: "Paint", component: Paint },
  { id: "chatroom", icon: "/directory_closed-3.png", label: "Chat Room", component: ChatRoomContent },
];

function DesktopContent() {
  const { windows, openWindow } = useWindowManager();
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
  
  // Initialize keyboard shortcuts and sound effects
  useKeyboardShortcuts();
  useSoundEffects();

  const handleIconDoubleClick = (iconData: DesktopIconData) => {
    // Check if window is already open
    const existingWindow = windows.find(w => w.title === iconData.label);
    if (!existingWindow) {
      openWindow({
        title: iconData.label,
        component: iconData.component,
        isMinimized: false,
        isMaximized: false,
        position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
        size: { width: 600, height: 400 },
        icon: iconData.icon,
      });
    }
  };

  const handleProgramLaunch = (programId: string) => {
    const iconData = desktopIcons.find(icon => icon.id === programId);
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
          { label: "Text Document", onClick: () => handleProgramLaunch("notepad") },
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
