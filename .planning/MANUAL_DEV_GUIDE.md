# Developer Guide: windows-xd (Manual/Non-GSD)

This document helps developers work on windows-xd without using the GSD framework—whether you're using OpenCode for assistance, other AI coding agents, or coding manually.

## Project Overview

**What we're building:** A pixel-perfect Windows 98 recreation in Next.js 16 with real-time multiplayer chat and LLM-powered Clippy assistant.

**Tech stack:**

- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript 5 (strict mode)
- Tailwind CSS 4
- WebSockets (Socket.IO v4.8.3) for real-time chat
- Gemini API (@google/genai v1.39.0) for LLM Clippy

**Core libraries:**

- react-rnd v10.5.2 (window dragging/resizing)
- zustand (window state management)
- fabric.js v7.1.0 (Paint canvas)
- Socket.IO v4.8.3 (real-time chat)

## Essential Reading

Before coding, read these files:

1. **`AGENTS.md`** — Code style guidelines (MUST follow)
   - File naming conventions
   - Import order
   - TypeScript patterns
   - Tailwind class ordering
   - Component structure

2. **`.planning/PROJECT.md`** — Project goals and constraints
   - Core value proposition
   - What's in/out of scope
   - Key constraints

3. **`.planning/REQUIREMENTS.md`** — All requirements with IDs
   - v1 requirements (41 total)
   - v2 requirements (deferred features)
   - Success criteria

4. **`.planning/ROADMAP.md`** — Phase structure
   - 6 phases with dependencies
   - What each phase delivers

5. **`.planning/research/`** — Technical research
   - `STACK.md` — Library choices and versions
   - `ARCHITECTURE.md` — System design patterns
   - `PITFALLS.md` — Common mistakes to avoid
   - `FEATURES.md` — Feature complexity ratings

## Development Setup

### Initial Setup

```bash
# Clone and install
git clone <repo-url>
cd windows-xd
npm install

# Run development server
npm run dev
# Visit http://localhost:3000

# Run linting
npm run lint

# Build for production
npm run build
```

### Code Style (Critical)

Follow `AGENTS.md` strictly:

**File naming:**

- Components: `PascalCase.tsx` (e.g., `WindowManager.tsx`)
- Utilities: `camelCase.ts` (e.g., `windowHelpers.ts`)
- Pages: `lowercase.tsx` (e.g., `page.tsx`, `layout.tsx`)

**Import order:**

```typescript
// 1. External packages
import { useState } from "react";
import Image from "next/image";

// 2. Next.js modules
import type { Metadata } from "next";

// 3. Local modules
import { WindowManager } from "@/app/contexts/WindowManager";

// 4. Types
import type { WindowState } from "@/app/types";

// 5. Styles
import "./styles.css";
```

**Naming conventions:**

- Components: `PascalCase` — `function WindowManager()`
- Functions: `camelCase` — `const openWindow = ()`
- Constants: `UPPER_SNAKE_CASE` — `const MAX_Z_INDEX = 9999`
- Types: `PascalCase` — `type WindowState = {}`

**TypeScript:**

- Strict mode enabled (no `any`)
- Explicit return types for functions
- Use `type` over `interface`
- Props type for components:

  ```typescript
  type ButtonProps = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };

  export default function Button({ label, onClick, disabled }: ButtonProps) {
    return <button onClick={onClick} disabled={disabled}>{label}</button>;
  }
  ```

**Tailwind CSS class order:**

```tsx
<div className="
  flex               {/* Layout */}
  min-h-screen       {/* Spacing */}
  text-lg            {/* Typography */}
  bg-white           {/* Colors */}
  hover:bg-gray-100  {/* Effects */}
  dark:bg-black      {/* Dark mode */}
">
```

## Phase-by-Phase Implementation Guide

### Phase 1: Desktop Shell & Window System (FOUNDATION - START HERE)

**Goal:** Build the foundational window management system that all apps will use.

**Priority:** HIGHEST — Everything depends on this

#### Requirements

- WIN-01 to WIN-07: Window drag, resize, minimize, maximize, close, focus, z-index
- DESK-01 to DESK-06: Desktop background, icons, taskbar, Start button, system tray
- MENU-01 to MENU-04: Start menu with Programs submenu
- STYLE-01 to STYLE-04: Windows 98 styling (3D bevels, fonts, colors)

#### Key Files to Create

**1. Window Management Context** (`app/contexts/WindowManagerContext.tsx`)

```typescript
type WindowState = {
  id: string;
  title: string;
  component: React.ComponentType;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
};

type WindowManagerContextType = {
  windows: WindowState[];
  openWindow: (window: Omit<WindowState, "id" | "isOpen" | "zIndex">) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
};
```

**2. Desktop Component** (`app/components/Desktop.tsx`)

- Teal background (#008080)
- Renders desktop icons
- Handles desktop clicks (close Start menu)
- Container for all windows

**3. Window Component** (`app/components/Window.tsx`)

- Reusable window chrome (title bar, borders, buttons)
- Uses react-rnd for drag/resize
- Integrates with WindowManager context
- Windows 98 styling (3D bevels)

**4. Taskbar Component** (`app/components/Taskbar.tsx`)

- Fixed at bottom
- Start button (left)
- Window buttons (middle)
- System tray with clock (right)

**5. Start Menu Component** (`app/components/StartMenu.tsx`)

- Opens on Start button click
- Programs submenu
- Shut Down option
- Classic Windows 98 layout

**6. Desktop Icons** (`app/components/DesktopIcon.tsx`)

- My Computer, Recycle Bin, etc.
- Double-click to open (use double-click detection)
- Windows 98 icon styling

#### Critical Implementation Details

**Z-index Management (CRITICAL - See PITFALLS.md)**

```typescript
// WRONG: Incrementing z-index infinitely
const focusWindow = (id: string) => {
  setWindows(
    windows.map((w) => (w.id === id ? { ...w, zIndex: w.zIndex + 1 } : w)),
  );
};

// RIGHT: Reorder all z-indexes
const focusWindow = (id: string) => {
  const sorted = [...windows].sort((a, b) => a.zIndex - b.zIndex);
  setWindows(
    sorted.map((w, i) => ({
      ...w,
      zIndex: w.id === id ? sorted.length : i,
    })),
  );
};
```

**Window Dragging Performance**

- Use react-rnd's `onDragStop` instead of `onDrag` to reduce re-renders
- Throttle position updates if using `onDrag`

**Memory Leak Prevention**

```typescript
// Clean up event listeners in Window component
useEffect(() => {
  const handleClick = () => focusWindow(id);
  window.addEventListener("click", handleClick);

  return () => window.removeEventListener("click", handleClick);
}, [id]);
```

**Windows 98 Styling**

Tailwind config for 3D bevels (`globals.css`):

```css
/* 3D raised bevel (buttons, windows) */
.win98-raised {
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
  box-shadow:
    inset -1px -1px 0 #000000,
    inset 1px 1px 0 #dfdfdf;
}

/* 3D inset bevel (pressed buttons, text inputs) */
.win98-inset {
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  box-shadow:
    inset 1px 1px 0 #000000,
    inset -1px -1px 0 #dfdfdf;
}

/* Window title bar (active) */
.win98-titlebar-active {
  background: linear-gradient(to right, #000080, #1084d0);
  color: #ffffff;
}

/* Window title bar (inactive) */
.win98-titlebar-inactive {
  background: linear-gradient(to right, #808080, #b5b5b5);
  color: #c0c0c0;
}
```

**Authentic Windows 98 Fonts**

Add to `app/layout.tsx`:

```typescript
import localFont from 'next/font/local';

const msSansSerif = localFont({
  src: '../public/fonts/ms-sans-serif.woff2',
  variable: '--font-ms-sans-serif',
});

// In layout body:
<body className={`${msSansSerif.variable} font-sans`}>
```

Download MS Sans Serif from: https://github.com/slavfox/Chuột-Chéo/tree/main/fonts

#### Installation

```bash
npm install react-rnd zustand
```

#### Testing Phase 1

Before moving to Phase 2, verify:

- [ ] Desktop shows teal background with icons
- [ ] Taskbar fixed at bottom with Start button
- [ ] Start menu opens/closes properly
- [ ] Can drag empty window by title bar
- [ ] Can resize empty window from corners/edges
- [ ] Minimize/maximize/close buttons work
- [ ] Clicking window brings to front
- [ ] Multiple windows have correct z-index layering
- [ ] All UI has 3D bevel styling
- [ ] Fonts look authentic (MS Sans Serif)

**No memory leaks:**

```bash
# Open Chrome DevTools → Memory tab → Take heap snapshot
# Open 10 windows, close them all, take another snapshot
# Compare — memory should return to baseline
```

---

### Phase 2: Notepad Application (SIMPLEST APP)

**Goal:** Create a simple text editor to validate the window system works correctly.

**Depends on:** Phase 1 complete

#### Requirements

- NOTE-01: Text editing
- NOTE-02: File menu (New, Open, Save, Exit)
- NOTE-03: Edit menu (Cut, Copy, Paste, Undo)

#### Key Files to Create

**1. Notepad Component** (`app/components/apps/Notepad.tsx`)

```typescript
export default function Notepad() {
  const [text, setText] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleNew = () => setText('');
  const handleCut = () => {
    navigator.clipboard.writeText(text);
    setText('');
  };
  const handleCopy = () => navigator.clipboard.writeText(text);
  const handlePaste = async () => {
    const clipText = await navigator.clipboard.readText();
    setText(text + clipText);
  };
  const handleUndo = () => {
    if (history.length > 0) {
      setText(history[history.length - 1]);
      setHistory(history.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <MenuBar menus={[
        {
          label: 'File',
          items: [
            { label: 'New', onClick: handleNew, shortcut: 'Ctrl+N' },
            { label: 'Open', onClick: () => {}, shortcut: 'Ctrl+O' },
            { label: 'Save', onClick: () => {}, shortcut: 'Ctrl+S' },
            { type: 'separator' },
            { label: 'Exit', onClick: () => closeWindow(id) }
          ]
        },
        {
          label: 'Edit',
          items: [
            { label: 'Undo', onClick: handleUndo, shortcut: 'Ctrl+Z' },
            { type: 'separator' },
            { label: 'Cut', onClick: handleCut, shortcut: 'Ctrl+X' },
            { label: 'Copy', onClick: handleCopy, shortcut: 'Ctrl+C' },
            { label: 'Paste', onClick: handlePaste, shortcut: 'Ctrl+V' }
          ]
        }
      ]} />
      <textarea
        value={text}
        onChange={(e) => {
          setHistory([...history, text]);
          setText(e.target.value);
        }}
        className="flex-1 p-2 font-mono resize-none outline-none"
      />
    </div>
  );
}
```

**2. Menu Bar Component** (`app/components/apps/MenuBar.tsx`)

- Reusable menu bar for apps
- Dropdown menus on click
- Keyboard shortcuts display
- Windows 98 styling

**3. Register Notepad in Desktop**

```typescript
// In Desktop.tsx or page.tsx
const handleIconDoubleClick = (appName: string) => {
  if (appName === "Notepad") {
    openWindow({
      title: "Untitled - Notepad",
      component: Notepad,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100, y: 100 },
      size: { width: 600, height: 400 },
    });
  }
};
```

#### Testing Phase 2

- [ ] Can launch Notepad from desktop icon or Start menu
- [ ] Can type and edit text
- [ ] Menus appear on click
- [ ] Cut/Copy/Paste work
- [ ] Undo works (basic)
- [ ] Window behaves like Phase 1 windows (drag, resize, etc.)

---

### Phase 3: Paint Application (COMPLEX)

**Goal:** Create a canvas-based drawing app with multiple tools.

**Depends on:** Phase 1 complete

#### Requirements

- PAINT-01 to PAINT-07: Canvas, pencil, line, rectangle, fill, palette, undo/redo

#### Key Files to Create

**1. Paint Component** (`app/components/apps/Paint.tsx`)

- Container for canvas and palettes
- Tool state management
- Color state management

**2. Canvas Component** (`app/components/apps/paint/Canvas.tsx`)

```typescript
import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff'
    });

    fabricRef.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
```

**3. Tool Palette** (`app/components/apps/paint/ToolPalette.tsx`)

- Grid of tool icons
- Selected tool highlight
- Windows 98 button styling

**4. Tool Implementations** (`app/lib/paintTools.ts`)

```typescript
export const tools = {
  pencil: (canvas: fabric.Canvas) => {
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 1;
  },

  line: (canvas: fabric.Canvas) => {
    canvas.isDrawingMode = false;
    let line: fabric.Line;
    let isDrawing = false;

    canvas.on("mouse:down", (e) => {
      isDrawing = true;
      const pointer = canvas.getPointer(e.e);
      line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: canvas.freeDrawingBrush.color,
        strokeWidth: 2,
      });
      canvas.add(line);
    });

    canvas.on("mouse:move", (e) => {
      if (!isDrawing) return;
      const pointer = canvas.getPointer(e.e);
      line.set({ x2: pointer.x, y2: pointer.y });
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      isDrawing = false;
    });
  },

  rectangle: (canvas: fabric.Canvas) => {
    // Similar to line but with fabric.Rect
  },

  fill: (canvas: fabric.Canvas, color: string) => {
    // Flood fill algorithm (complex - see fabric.js docs)
  },
};
```

**5. Undo/Redo**

```typescript
const [history, setHistory] = useState<string[]>([]);
const [historyStep, setHistoryStep] = useState(-1);

const saveState = (canvas: fabric.Canvas) => {
  const json = JSON.stringify(canvas.toJSON());
  setHistory([...history.slice(0, historyStep + 1), json]);
  setHistoryStep(historyStep + 1);
};

const undo = (canvas: fabric.Canvas) => {
  if (historyStep > 0) {
    setHistoryStep(historyStep - 1);
    canvas.loadFromJSON(history[historyStep - 1], () => {
      canvas.renderAll();
    });
  }
};
```

#### Installation

```bash
npm install fabric
npm install --save-dev @types/fabric
```

#### Performance Considerations

- Debounce canvas state saves (don't save on every mouse move)
- Limit history to 50 states
- Use `canvas.renderOnAddRemove = false` during bulk operations

#### Testing Phase 3

- [ ] Can launch Paint
- [ ] Canvas renders white background
- [ ] Tool palette shows all tools
- [ ] Pencil tool draws freehand
- [ ] Line tool draws straight lines
- [ ] Rectangle tool draws rectangles
- [ ] Fill tool fills areas
- [ ] Undo/redo works
- [ ] No lag during drawing (60fps)

---

### Phase 4: File Explorer (MODERATE)

**Goal:** Browse a virtual read-only filesystem.

**Depends on:** Phase 1 complete

#### Requirements

- FILE-01: Folder tree
- FILE-02: Double-click navigation
- FILE-03: Back/forward buttons

#### Key Files to Create

**1. File Explorer Component** (`app/components/apps/FileExplorer.tsx`)

- Split view: folder tree (left) + file list (right)
- Back/forward navigation state
- Address bar

**2. Virtual Filesystem** (`app/lib/virtualFilesystem.ts`)

```typescript
export type FileSystemNode = {
  name: string;
  type: "file" | "folder";
  children?: FileSystemNode[];
  icon?: string;
};

export const virtualFS: FileSystemNode = {
  name: "My Computer",
  type: "folder",
  children: [
    {
      name: "C:",
      type: "folder",
      children: [
        {
          name: "Program Files",
          type: "folder",
          children: [
            { name: "Internet Explorer", type: "folder", children: [] },
            { name: "Windows Media Player", type: "folder", children: [] },
          ],
        },
        {
          name: "Windows",
          type: "folder",
          children: [
            { name: "System32", type: "folder", children: [] },
            { name: "Fonts", type: "folder", children: [] },
          ],
        },
        {
          name: "My Documents",
          type: "folder",
          children: [
            { name: "readme.txt", type: "file" },
            { name: "picture.bmp", type: "file" },
          ],
        },
      ],
    },
    {
      name: "D:",
      type: "folder",
      children: [],
    },
  ],
};
```

**3. Folder Tree Component** (`app/components/apps/explorer/FolderTree.tsx`)

- Recursive tree rendering
- Expand/collapse arrows
- Selected folder highlight

**4. Navigation State**

```typescript
const [history, setHistory] = useState<string[]>(["/My Computer"]);
const [currentIndex, setCurrentIndex] = useState(0);

const navigate = (path: string) => {
  const newHistory = [...history.slice(0, currentIndex + 1), path];
  setHistory(newHistory);
  setCurrentIndex(newHistory.length - 1);
};

const goBack = () => {
  if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
};

const goForward = () => {
  if (currentIndex < history.length - 1) setCurrentIndex(currentIndex + 1);
};
```

#### Testing Phase 4

- [ ] Can launch File Explorer (My Computer)
- [ ] Folder tree displays hierarchy
- [ ] Can expand/collapse folders
- [ ] Double-clicking folder navigates to it
- [ ] Back button returns to previous folder
- [ ] Forward button advances if back was pressed
- [ ] Address bar shows current path

---

### Phase 5: Real-time Chatroom (WEBSOCKET COMPLEXITY)

**Goal:** Real-time multiplayer chat with auto-generated usernames.

**Depends on:** Phase 1 complete

#### Requirements

- CHAT-01: Yahoo-style retro UI
- CHAT-02: Real-time messaging (WebSocket)
- CHAT-03: Auto-generated usernames
- CHAT-04: Join/leave notifications

#### Key Files to Create

**1. Custom Next.js Server** (`server.ts`)

```typescript
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    const username = generateUsername();
    socket.data.username = username;

    io.emit("user-joined", { username });

    socket.on("message", (msg: string) => {
      io.emit("message", {
        username: socket.data.username,
        text: msg,
        timestamp: Date.now(),
      });
    });

    socket.on("disconnect", () => {
      io.emit("user-left", { username: socket.data.username });
    });
  });

  server.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});

function generateUsername(): string {
  const adjectives = ["Cool", "Retro", "Super", "Epic", "Mega", "Rad"];
  const nouns = ["User", "Gamer", "Fan", "Dude", "Legend", "Pro"];
  const num = Math.floor(Math.random() * 100);
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${num}`;
}
```

Update `package.json`:

```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "next build",
    "start": "NODE_ENV=production tsx server.ts"
  }
}
```

**2. Chat Client Hook** (`app/hooks/useChat.ts`)

```typescript
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Message = {
  username: string;
  text: string;
  timestamp: number;
};

export function useChat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("user-joined", ({ username: joinedUser }) => {
      setMessages((prev) => [
        ...prev,
        {
          username: "System",
          text: `${joinedUser} joined the chat`,
          timestamp: Date.now(),
        },
      ]);
      if (!username) setUsername(joinedUser);
    });

    newSocket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on("user-left", ({ username: leftUser }) => {
      setMessages((prev) => [
        ...prev,
        {
          username: "System",
          text: `${leftUser} left the chat`,
          timestamp: Date.now(),
        },
      ]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (text: string) => {
    socket?.emit("message", text);
  };

  return { messages, username, sendMessage };
}
```

**3. Chatroom Component** (`app/components/apps/Chatroom.tsx`)

```typescript
'use client';

export default function Chatroom() {
  const { messages, username, sendMessage } = useChat();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      <div className="flex-1 overflow-y-auto p-2 bg-white border-2 border-[#808080]">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            <span className="font-bold text-blue-600">{msg.username}:</span>{' '}
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-2 py-1 border-2 border-[#808080]"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="px-4 py-1 win98-raised">
          Send
        </button>
      </div>
    </div>
  );
}
```

#### Installation

```bash
npm install socket.io socket.io-client
npm install --save-dev tsx @types/node
```

#### Testing Phase 5

- [ ] Custom server starts on `npm run dev`
- [ ] Can launch Chatroom window
- [ ] Assigned auto-generated username (visible in UI)
- [ ] Messages send instantly
- [ ] Open in 2 browser windows — messages sync
- [ ] Join/leave notifications appear
- [ ] WebSocket reconnects if connection drops

---

### Phase 6: LLM-Powered Clippy (AI COMPLEXITY)

**Goal:** Context-aware AI assistant using Gemini API.

**Depends on:** Phases 1, 2, 3, 4 complete (needs app context)

#### Requirements

- CLIP-01: Context-aware help
- CLIP-02: Idle detection
- CLIP-03: Manual summon
- CLIP-04: Gemini API integration

#### Key Files to Create

**1. Environment Variables** (`.env.local`)

```bash
GEMINI_API_KEY=your_api_key_here
```

Add to `.gitignore`:

```
.env.local
```

**2. Gemini API Route** (`app/api/clippy/route.ts`)

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { context, prompt } = await request.json();

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const systemPrompt = `You are Clippy, the helpful Microsoft Office assistant from Windows 98. 
You are cheerful, slightly enthusiastic, and always eager to help.

Current context:
${JSON.stringify(context)}

Provide brief, helpful assistance (2-3 sentences max). Stay in character as Clippy.`;

  const result = await model.generateContent([systemPrompt, prompt]);
  const response = result.response.text();

  return Response.json({ response });
}
```

**3. Idle Detection Hook** (`app/hooks/useIdleDetection.ts`)

```typescript
import { useEffect, useState } from "react";

export function useIdleDetection(timeoutMs: number = 30000) {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const resetTimer = () => {
      setLastActivity(Date.now());
      setIsIdle(false);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > timeoutMs) {
        setIsIdle(true);
      }
    }, 1000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearInterval(interval);
    };
  }, [lastActivity, timeoutMs]);

  return { isIdle, resetIdle: () => setLastActivity(Date.now()) };
}
```

**4. Context Collection** (`app/lib/clippyContext.ts`)

```typescript
export function collectContext(windows: WindowState[]): string {
  const activeWindow = windows.find(
    (w) =>
      !w.isMinimized && w.zIndex === Math.max(...windows.map((w) => w.zIndex)),
  );

  if (!activeWindow) return "User is on desktop";

  const context: Record<string, string> = {
    Notepad: "User is writing in Notepad",
    Paint: "User is drawing in Paint",
    "File Explorer": "User is browsing files",
    Chatroom: "User is in the chatroom",
  };

  return context[activeWindow.title] || `User is using ${activeWindow.title}`;
}
```

**5. Clippy Component** (`app/components/Clippy.tsx`)

```typescript
'use client';

export default function Clippy() {
  const { isIdle } = useIdleDetection(30000);
  const { windows } = useWindowManager();
  const [isVisible, setIsVisible] = useState(false);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isIdle && !isVisible) {
      setIsVisible(true);
      askClippy('User seems idle');
    }
  }, [isIdle]);

  const askClippy = async (prompt: string) => {
    setIsLoading(true);
    const context = collectContext(windows);

    const res = await fetch('/api/clippy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, prompt })
    });

    const data = await res.json();
    setResponse(data.response);
    setIsLoading(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 w-64 bg-[#ffffcc] border-2 border-black p-4 shadow-lg">
      <div className="flex items-start gap-2">
        <div className="text-4xl">📎</div>
        <div className="flex-1">
          {isLoading ? (
            <p className="text-sm">Thinking...</p>
          ) : (
            <p className="text-sm">{response || "Hi! It looks like you might need help. What can I do for you?"}</p>
          )}
        </div>
        <button onClick={() => setIsVisible(false)} className="text-xs">✕</button>
      </div>
    </div>
  );
}
```

**6. Manual Summon** (Add to Desktop or Menu)

```typescript
<button onClick={() => setClippyVisible(true)}>
  Help / Clippy
</button>
```

#### Installation

```bash
npm install @google/generative-ai
```

**IMPORTANT:** Use `@google/generative-ai` (NOT `@google/genai`). The SDK name changed.

#### Rate Limiting (CRITICAL)

```typescript
// Add to API route
const RATE_LIMIT = 10; // requests per minute
const requests = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = requests.get(ip) || [];
  const recentRequests = userRequests.filter((time) => now - time < 60000);

  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }

  requests.set(ip, [...recentRequests, now]);
  return true;
}
```

#### Testing Phase 6

- [ ] Clippy appears after 30s of no activity
- [ ] Can manually summon Clippy
- [ ] Gemini API returns responses (not errors)
- [ ] Context changes based on active window
- [ ] Rate limiting prevents spam
- [ ] API key never exposed to client

---

## Working with AI Coding Agents (OpenCode, Cursor, Copilot, etc.)

### General Prompting Strategy

**Start with context:**

```
I'm working on windows-xd, a Windows 98 recreation in Next.js 16.

Current task: [Phase N - Component Name]

Project constraints:
- Follow AGENTS.md code style (read this file)
- Use TypeScript strict mode
- Windows 98 pixel-perfect styling
- No jQuery, use React patterns

Please read:
- .planning/REQUIREMENTS.md (requirements [REQ-IDs])
- .planning/research/STACK.md (library versions)
- .planning/research/ARCHITECTURE.md (design patterns)

[Then your specific request]
```

**Be specific:**

```
// BAD
"Create the window component"

// GOOD
"Create app/components/Window.tsx that:
1. Accepts WindowState props from context
2. Uses react-rnd for drag/resize
3. Has title bar with icon, title, and min/max/close buttons
4. Applies win98-raised CSS class for 3D bevel
5. Calls focusWindow(id) from context on click
6. Follows AGENTS.md naming conventions"
```

**Request verification:**

```
After implementing, verify:
1. Does this follow AGENTS.md style?
2. Are there TypeScript errors? (run tsc --noEmit)
3. Are there linting errors? (run npm run lint)
4. Does this match Windows 98 styling?
5. Are there performance issues? (check React DevTools)
```

### Handling AI Mistakes

**Style violations:**

```
This doesn't follow AGENTS.md. Please refactor:
- Use camelCase for function names (not snake_case)
- Import order should be: external → Next.js → local → types → styles
- Use 'type' not 'interface' for WindowProps
```

**Wrong architecture:**

```
This component should not manage its own state.
Window state lives in WindowManagerContext.
Please refactor to use useWindowManager() hook instead.
```

**Performance issues:**

```
This re-renders on every mouse move (60fps).
Use react-rnd's onDragStop instead of onDrag.
Throttle updates if you must use onDrag.
```

---

## Common Issues & Solutions

### Issue: "react-rnd windows get stuck"

**Solution:** Ensure bounds are set correctly

```typescript
<Rnd
  bounds="parent"  // Constrain to parent element
  enableResizing={{
    bottom: true,
    right: true,
    bottomRight: true
  }}
/>
```

### Issue: "Z-index keeps growing infinitely"

**Solution:** Reorder all windows on focus (see Phase 1 z-index code above)

### Issue: "Canvas drawing is laggy"

**Solution:**

- Disable render on add: `canvas.renderOnAddRemove = false`
- Batch operations
- Use `requestAnimationFrame` for smooth updates

### Issue: "WebSocket disconnects on page navigation"

**Solution:** WebSocket in Phase 5 lives in the desktop component, not per-window

### Issue: "Gemini API rate limits hit"

**Solution:** Implement rate limiting in API route (see Phase 6 code above)

### Issue: "TypeScript strict mode errors"

**Solution:**

- Don't use `any`
- Add proper types: `const windows: WindowState[] = []`
- Use type guards for nullable values:
  ```typescript
  if (window) {
    // TypeScript knows window is not null here
  }
  ```

### Issue: "Desktop icons don't double-click"

**Solution:** Implement double-click detection:

```typescript
const [lastClick, setLastClick] = useState(0);

const handleClick = () => {
  const now = Date.now();
  if (now - lastClick < 300) {
    // Double click
    openApp();
  }
  setLastClick(now);
};
```

---

## Git Workflow

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/phase-1-window-system

# Make atomic commits as you work
git add app/components/Window.tsx
git commit -m "feat: add Window component with drag/resize"

git add app/contexts/WindowManagerContext.tsx
git commit -m "feat: add WindowManager context for global state"

# Push when ready
git push origin feature/phase-1-window-system
```

### Commit Message Format

Follow Conventional Commits:

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code restructure
- `style:` — CSS/styling changes
- `docs:` — Documentation
- `test:` — Tests
- `chore:` — Build/config changes

```bash
# Good commit messages
git commit -m "feat(window): add minimize/maximize buttons"
git commit -m "fix(taskbar): correct z-index layering"
git commit -m "style(desktop): apply Windows 98 teal background"
```

### Pull Request Checklist

Before creating PR:

- [ ] Code follows AGENTS.md style
- [ ] No TypeScript errors (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Tested manually in browser
- [ ] All requirements for phase completed
- [ ] Git commits are atomic and well-named

---

## Performance Monitoring

### Check Performance

```bash
# 1. Open Chrome DevTools
# 2. Performance tab → Record
# 3. Perform actions (drag window, draw in Paint)
# 4. Stop recording
# 5. Check for:
#    - 60fps (green line should stay above 60)
#    - No long tasks (yellow/red bars)
#    - No memory leaks (sawtooth pattern in memory)
```

### React DevTools Profiler

```bash
# 1. Install React DevTools extension
# 2. Open Profiler tab
# 3. Start profiling
# 4. Perform actions
# 5. Stop profiling
# 6. Check which components re-render unnecessarily
```

---

## Testing Checklist (Before Declaring Phase Complete)

### Phase 1: Desktop Shell & Window System

- [ ] Desktop background is teal (#008080)
- [ ] Icons render (My Computer, Recycle Bin, Notepad, Paint, etc.)
- [ ] Taskbar fixed at bottom
- [ ] Start button opens Start menu
- [ ] Start menu has Programs submenu
- [ ] Can create empty test window
- [ ] Can drag window by title bar (smooth, no lag)
- [ ] Can resize window from edges/corners
- [ ] Min button minimizes to taskbar
- [ ] Max button maximizes to fullscreen
- [ ] Close button removes window
- [ ] Clicking window brings to front
- [ ] Multiple windows maintain correct z-index
- [ ] All UI has 3D bevel styling
- [ ] Fonts are MS Sans Serif (or look authentic)
- [ ] System tray shows clock with current time
- [ ] Window buttons appear in taskbar for open windows
- [ ] No console errors
- [ ] No memory leaks (check DevTools Memory tab)

### Phase 2: Notepad

- [ ] Notepad launches from icon double-click
- [ ] Notepad launches from Start → Programs
- [ ] Can type text
- [ ] Can select text
- [ ] File menu has New, Open, Save, Exit
- [ ] Edit menu has Cut, Copy, Paste, Undo
- [ ] Cut removes text and copies to clipboard
- [ ] Copy copies text to clipboard
- [ ] Paste inserts clipboard text
- [ ] Undo reverts last change
- [ ] Menu bar looks Windows 98 authentic
- [ ] Textarea has no outline on focus

### Phase 3: Paint

- [ ] Paint launches from icon/Start menu
- [ ] Canvas displays white background
- [ ] Tool palette shows tools (pencil, line, rectangle, fill, etc.)
- [ ] Clicking tool selects it (visual highlight)
- [ ] Pencil draws freehand (follows mouse)
- [ ] Line draws straight line from start to end point
- [ ] Rectangle draws rectangle
- [ ] Fill tool fills enclosed area with color
- [ ] Undo reverses last action
- [ ] Redo re-applies undone action
- [ ] Drawing is smooth (60fps, no lag)
- [ ] No canvas memory issues (can draw for 5+ minutes)

### Phase 4: File Explorer

- [ ] Explorer launches (My Computer)
- [ ] Folder tree shows hierarchy
- [ ] Can expand folder (shows children)
- [ ] Can collapse folder (hides children)
- [ ] Double-clicking folder navigates to it
- [ ] Back button goes to previous folder
- [ ] Forward button advances (after going back)
- [ ] Back button disabled when at start of history
- [ ] Forward button disabled when at end of history
- [ ] Address bar shows current path

### Phase 5: Chatroom

- [ ] Chatroom launches from icon/Start menu
- [ ] User assigned auto-generated username (visible in UI)
- [ ] Can type message
- [ ] Pressing Enter sends message
- [ ] Clicking Send button sends message
- [ ] Message appears instantly in chat
- [ ] Open in 2nd browser window — messages sync in real-time
- [ ] Join notification appears when new user connects
- [ ] Leave notification appears when user disconnects
- [ ] Chat window has Yahoo/retro styling
- [ ] WebSocket reconnects if connection drops

### Phase 6: Clippy

- [ ] Clippy appears after 30s of idle (no mouse/keyboard)
- [ ] Can manually summon Clippy (Help button/icon)
- [ ] Clippy window has yellow background (#ffffcc)
- [ ] Clippy shows paperclip icon (📎 or image)
- [ ] Gemini API returns response (not error)
- [ ] Response appears in Clippy window
- [ ] Context changes based on active window (Notepad vs Paint vs Desktop)
- [ ] Can close Clippy (X button)
- [ ] Rate limiting prevents spam (max 10 requests/min)
- [ ] API key never visible in browser (check Network tab)
- [ ] No CORS errors

---

## Team Coordination

### Claim Your Work

Before starting, announce in team chat:

```
Working on: Phase [N] - [Name]
Branch: feature/phase-[N]-[name]
ETA: [date]
```

### Avoid Conflicts

- **Never work on Phase 2+ until Phase 1 is merged**
- Phases 2, 3, 4, 5 can be parallel (after Phase 1)
- Phase 6 needs 2, 3, 4 complete (for context)

### Communication

- Daily standup (async in chat)
- Block someone? Post: "🚧 Blocked on Phase N"
- Complete? Post: "✅ Phase N complete, PR: [link]"

---

## Resources

- **AGENTS.md** — Code style (READ THIS FIRST)
- **`.planning/`** — All planning documents
- **`.planning/research/STACK.md`** — Library versions and rationale
- **`.planning/research/ARCHITECTURE.md`** — System design patterns
- **`.planning/research/PITFALLS.md`** — Common mistakes
- **Reference:** https://github.com/vidhi-mody/Windows-98 (original jQuery version)
- **Working example:** https://98.js.org
- **react-rnd docs:** https://github.com/bokuweb/react-rnd
- **fabric.js docs:** http://fabricjs.com/docs/
- **Socket.IO docs:** https://socket.io/docs/
- **Gemini API docs:** https://ai.google.dev/docs

---

## Questions?

1. Check `.planning/` docs first
2. Ask in team chat
3. Reference `PITFALLS.md` for known issues
4. Tag teammate who did Phase 1 (they know the architecture)

---

**Remember:** Phase 1 is critical. Get it right, everything else flows. Take your time on the window management system — it's the foundation for the entire project.
