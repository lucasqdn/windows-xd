import type { WindowState } from "@/app/contexts/WindowManagerContext";

export function collectContext(windows: WindowState[]): string {
  if (windows.length === 0) {
    return "User is on the desktop with no applications open.";
  }

  // Find the active window (highest z-index, not minimized)
  const activeWindow = windows
    .filter((w) => !w.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0];

  if (!activeWindow) {
    return "User has windows open but all are minimized.";
  }

  const contextMap: Record<string, string> = {
    Notepad:
      "User is writing in Notepad. They might need help with text editing, formatting, or saving their work.",
    Paint:
      "User is drawing in Paint. They might need help with drawing tools, colors, or creating artwork.",
    "File Explorer":
      "User is browsing files in File Explorer. They might need help navigating folders or finding files.",
    "My Computer":
      "User is browsing their computer in File Explorer. They might need help navigating folders or understanding the file system.",
    "Chat Room":
      "User is in the Chat Room. They might need help with chatting or understanding how to communicate with others.",
    "Recycle Bin":
      "User is looking at the Recycle Bin. They might need help restoring or permanently deleting files.",
  };

  const context =
    contextMap[activeWindow.title] ||
    `User is using ${activeWindow.title}. They might need help with this application.`;

  // Add info about other open windows
  const otherWindows = windows.filter(
    (w) => w.id !== activeWindow.id && !w.isMinimized
  );
  if (otherWindows.length > 0) {
    const otherApps = otherWindows.map((w) => w.title).join(", ");
    return `${context} They also have ${otherApps} open in the background.`;
  }

  return context;
}
