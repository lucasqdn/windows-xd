"use client";

import { WindowManagerProvider, useWindowManager } from "@/app/contexts/WindowManagerContext";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

// Placeholder components for apps
function NotepadContent() {
  return (
    <div className="h-full flex flex-col">
      <textarea
        className="flex-1 w-full p-2 font-mono text-sm border-0 outline-none resize-none"
        placeholder="Type here..."
      />
    </div>
  );
}

function PaintContent() {
  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      <p>Paint application (Phase 4)</p>
    </div>
  );
}

function ExplorerContent() {
  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      <p>File Explorer (Phase 3)</p>
    </div>
  );
}

function ChatRoomContent() {
  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      <p>Chat Room (Phase 5)</p>
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
  { id: "my-computer", icon: "💻", label: "My Computer", component: ExplorerContent },
  { id: "recycle-bin", icon: "🗑️", label: "Recycle Bin", component: ExplorerContent },
  { id: "notepad", icon: "📝", label: "Notepad", component: NotepadContent },
  { id: "paint", icon: "🎨", label: "Paint", component: PaintContent },
  { id: "chatroom", icon: "💬", label: "Chat Room", component: ChatRoomContent },
];

function DesktopContent() {
  const { windows, openWindow } = useWindowManager();

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

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#008080" }}
    >
      {/* Desktop Icons */}
      <div className="absolute top-2 left-2 flex flex-col gap-2">
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
