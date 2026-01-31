# Architecture Research

**Domain:** Browser-based OS/Desktop Environment (Windows 98 recreation)
**Researched:** 2026-01-31
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js App Router                       │
│                    (Server & Client Components)                  │
├─────────────────────────────────────────────────────────────────┤
│  Desktop Layer (Client Component)                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Desktop     │  │   Taskbar    │  │  Start Menu  │           │
│  │  Icons       │  │   Component  │  │  Component   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
├─────────────────────────────────────────────────────────────────┤
│  Window Management Layer (State + Rendering)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              WindowManager (Context/Store)                │   │
│  │  - Window Registry (id → window metadata)                 │   │
│  │  - Z-index Stack (focus order)                            │   │
│  │  - Window State (position, size, minimized, maximized)    │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Window 1 │  │ Window 2 │  │ Window 3 │  │ Window N │        │
│  │ (Notepad)│  │  (Paint) │  │ (Chat)   │  │ (Explorer)│       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
├─────────────────────────────────────────────────────────────────┤
│  Application Layer (Window Contents)                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Individual Apps (Notepad, Paint, Explorer, Chat)         │   │
│  │  - Each app is a React component                          │   │
│  │  - Apps receive window context via props/context          │   │
│  │  - Apps manage their own internal state                   │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  Services Layer (Real-time, AI, Virtual Filesystem)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  WebSocket   │  │     LLM      │  │   Virtual    │          │
│  │  Manager     │  │   Service    │  │  Filesystem  │          │
│  │  (Chat)      │  │   (Clippy)   │  │  (BrowserFS) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **WindowManager** | Maintains registry of all windows, manages z-index, handles window lifecycle (open/close/minimize/maximize/restore) | React Context + useReducer or Zustand store |
| **Window** | Renders window chrome (titlebar, borders), handles drag/resize, manages internal state (position, size, focus) | Controlled component that reads from & dispatches to WindowManager |
| **Desktop** | Renders desktop background, desktop icons, handles icon double-click to launch apps | Client Component with grid layout |
| **Taskbar** | Displays Start button, clock, active window buttons, handles minimize/restore from taskbar | Client Component that subscribes to WindowManager state |
| **StartMenu** | Renders hierarchical menu, launches applications | Client Component with nested menu state |
| **Applications** | Self-contained app logic (Notepad text editing, Paint canvas, etc.) | React components with internal state, receive window API via context |
| **WebSocketManager** | Manages WebSocket connection, handles reconnection, broadcasts messages | Client-side service, likely in a custom hook or context |
| **LLMService** | Sends prompts to Gemini API, streams responses, manages context | Server Action or API Route for security (API key protection) |
| **VirtualFilesystem** | Provides file/folder structure for Explorer, manages in-memory files | BrowserFS or custom implementation with localStorage |

## Recommended Project Structure

```
app/
├── (desktop)/              # Route group for desktop environment
│   ├── page.tsx            # Main desktop page (Client Component wrapper)
│   └── layout.tsx          # Desktop layout (if needed)
├── api/                    # API routes
│   ├── clippy/            
│   │   └── route.ts        # Gemini API proxy (Server-side for API key)
│   └── ws/                 
│       └── route.ts        # WebSocket upgrade handler (if using Next.js)
├── components/            
│   ├── desktop/           
│   │   ├── Desktop.tsx     # Desktop component with icons
│   │   ├── DesktopIcon.tsx # Individual desktop icon
│   │   ├── Taskbar.tsx     # Taskbar with Start button & window list
│   │   ├── StartMenu.tsx   # Start menu with nested items
│   │   └── Clock.tsx       # Taskbar clock
│   ├── window/            
│   │   ├── Window.tsx      # Window chrome (titlebar, borders, drag/resize)
│   │   ├── WindowManager.tsx # Window manager provider
│   │   └── WindowContent.tsx # Wrapper for app content
│   └── apps/              
│       ├── Notepad.tsx     # Notepad application
│       ├── Paint.tsx       # Paint application
│       ├── Explorer.tsx    # File Explorer application
│       ├── Chat.tsx        # Chat application
│       └── Clippy.tsx      # Clippy assistant
├── lib/                   
│   ├── window-manager.ts   # Window management logic/store
│   ├── websocket.ts        # WebSocket client wrapper
│   ├── filesystem.ts       # Virtual filesystem (BrowserFS setup)
│   └── llm.ts              # LLM client utilities
├── hooks/                 
│   ├── useWindowManager.ts # Hook to access window manager
│   ├── useWebSocket.ts     # Hook for WebSocket connection
│   └── useFilesystem.ts    # Hook for filesystem access
├── types/                 
│   ├── window.ts           # Window-related types
│   ├── app.ts              # Application types
│   └── chat.ts             # Chat message types
└── globals.css             # Windows 98 styling
```

### Structure Rationale

- **`app/(desktop)/page.tsx`:** Single-page desktop environment lives on root route, leveraging Client Components for interactivity
- **`components/` organized by domain:** Desktop chrome, window management, and applications are logically separated
- **`lib/` for services:** Pure TypeScript modules for business logic (WebSocket, filesystem, window state management)
- **`hooks/` for React integration:** Custom hooks provide React-friendly APIs to lib/ services
- **`api/` for server-side logic:** Gemini API calls happen server-side to protect API keys; WebSocket upgrade handler if using Next.js built-in WebSockets (or separate WebSocket server)

## Architectural Patterns

### Pattern 1: Centralized Window State with React Context

**What:** All window state (position, size, z-index, minimized/maximized status) lives in a single WindowManager context/store. Individual Window components are "controlled components" that read state and dispatch actions.

**When to use:** For complex multi-window systems where windows need to interact (e.g., focus changes, z-index management, taskbar integration).

**Trade-offs:** 
- ✅ Single source of truth makes state management predictable
- ✅ Easy to implement features like "minimize all" or "bring to front"
- ✅ Taskbar and windows stay in sync automatically
- ⚠️ Requires careful optimization (React.memo, useCallback) to avoid re-rendering all windows on every state change

**Example:**
```typescript
// lib/window-manager.ts
type WindowState = {
  id: string;
  title: string;
  icon: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  content: React.ComponentType;
};

type WindowManagerState = {
  windows: Record<string, WindowState>;
  focusedWindowId: string | null;
  nextZIndex: number;
};

type WindowAction =
  | { type: 'OPEN_WINDOW'; payload: Omit<WindowState, 'id' | 'zIndex'> }
  | { type: 'CLOSE_WINDOW'; payload: { id: string } }
  | { type: 'FOCUS_WINDOW'; payload: { id: string } }
  | { type: 'MINIMIZE_WINDOW'; payload: { id: string } }
  | { type: 'MAXIMIZE_WINDOW'; payload: { id: string } }
  | { type: 'MOVE_WINDOW'; payload: { id: string; position: { x: number; y: number } } }
  | { type: 'RESIZE_WINDOW'; payload: { id: string; size: { width: number; height: number } } };

// Use useReducer or Zustand
const WindowManagerContext = createContext<{
  state: WindowManagerState;
  dispatch: (action: WindowAction) => void;
} | null>(null);

// components/window/WindowManager.tsx
export function WindowManager({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(windowManagerReducer, initialState);
  
  return (
    <WindowManagerContext.Provider value={{ state, dispatch }}>
      {children}
    </WindowManagerContext.Provider>
  );
}

// hooks/useWindowManager.ts
export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) throw new Error('useWindowManager must be used within WindowManager');
  return context;
}
```

### Pattern 2: Window Drag & Resize with React DnD or Native Events

**What:** Windows can be dragged by the titlebar and resized by edges/corners. Two approaches: (1) Use react-dnd or similar library, (2) Use native pointer events with useRef.

**When to use:** 
- **React DnD:** If you need complex drag-and-drop interactions beyond windows (e.g., dragging files between windows)
- **Native Events:** For simpler use case with better performance and less bundle size

**Trade-offs:**
- React DnD: ➕ Handles complex drag interactions well, ➖ Adds bundle size, ➖ Can be overkill for simple window dragging
- Native Events: ➕ Lightweight, ➕ Full control, ➖ Need to handle edge cases manually (e.g., drag outside viewport)

**Example (Native Events):**
```typescript
// components/window/Window.tsx
export function Window({ id, title, children }: WindowProps) {
  const { state, dispatch } = useWindowManager();
  const window = state.windows[id];
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, windowX: 0, windowY: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.target !== dragRef.current) return;
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      windowX: window.position.x,
      windowY: window.position.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;
    dispatch({
      type: 'MOVE_WINDOW',
      payload: {
        id,
        position: {
          x: dragStartPos.current.windowX + deltaX,
          y: dragStartPos.current.windowY + deltaY,
        },
      },
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className="window"
      style={{
        position: 'absolute',
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      }}
      onClick={() => dispatch({ type: 'FOCUS_WINDOW', payload: { id } })}
    >
      <div
        ref={dragRef}
        className="window-titlebar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {title}
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
}
```

### Pattern 3: WebSocket Connection as Singleton Service

**What:** WebSocket connection is created once and shared across all components that need it. Use a custom hook (useWebSocket) to subscribe to messages.

**When to use:** For real-time features like chat, presence, live updates.

**Trade-offs:**
- ✅ Single connection = efficient, no multiple connections
- ✅ Automatic reconnection logic centralized
- ⚠️ Need to handle connection state carefully (connecting, connected, disconnected)
- ⚠️ Message routing logic can get complex if multiple components need different message types

**Example:**
```typescript
// lib/websocket.ts
class WebSocketManager {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(url: string) {
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const listeners = this.listeners.get(message.type);
      listeners?.forEach((callback) => callback(message.data));
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnect(url);
    };
  }

  private reconnect(url: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }
    this.reconnectAttempts++;
    setTimeout(() => this.connect(url), 1000 * this.reconnectAttempts);
  }

  subscribe(eventType: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
    
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  send(type: string, data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }
}

export const wsManager = new WebSocketManager();

// hooks/useWebSocket.ts
export function useWebSocket(eventType: string, callback: (data: unknown) => void) {
  useEffect(() => {
    return wsManager.subscribe(eventType, callback);
  }, [eventType, callback]);
}

// Usage in Chat component
function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  useWebSocket('chat-message', (data) => {
    setMessages((prev) => [...prev, data as ChatMessage]);
  });

  const sendMessage = (text: string) => {
    wsManager.send('chat-message', { text, timestamp: Date.now() });
  };

  return (/* chat UI */);
}
```

### Pattern 4: Server Actions for LLM Integration (API Key Protection)

**What:** Gemini API calls happen server-side via Next.js Server Actions or API Routes. This keeps the API key secure and allows streaming responses.

**When to use:** Always, for any API that requires authentication or secrets.

**Trade-offs:**
- ✅ API keys never exposed to client
- ✅ Can use Server Components for initial render
- ✅ Supports streaming responses (for Clippy typing effect)
- ⚠️ Adds server latency (but necessary for security)

**Example:**
```typescript
// app/api/clippy/route.ts (API Route approach)
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  const { prompt, context } = await request.json();
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: 'You are Clippy, a helpful Windows 98 assistant...',
  });
  
  return Response.json({ text: result.response.text() });
}

// Or with Server Action (for streaming)
// app/actions/clippy.ts
'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function askClippy(prompt: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const result = await model.generateContentStream(prompt);
  
  // Stream response back to client
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(chunk.text());
      }
      controller.close();
    },
  });
  
  return new Response(stream);
}
```

### Pattern 5: Application Registry Pattern

**What:** Centralized registry of available applications with metadata (name, icon, component). Desktop icons and Start menu items reference this registry.

**When to use:** When you have multiple launchable applications and want to avoid hardcoding app lists everywhere.

**Trade-offs:**
- ✅ Single source of truth for available apps
- ✅ Easy to add/remove apps
- ✅ Desktop and Start menu stay in sync
- ⚠️ Need to lazy-load app components to avoid loading all apps at once

**Example:**
```typescript
// lib/app-registry.ts
import { lazy } from 'react';

export type AppDefinition = {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType;
  defaultSize: { width: number; height: number };
};

export const APP_REGISTRY: Record<string, AppDefinition> = {
  notepad: {
    id: 'notepad',
    name: 'Notepad',
    icon: '/icons/notepad.png',
    component: lazy(() => import('@/components/apps/Notepad')),
    defaultSize: { width: 600, height: 400 },
  },
  paint: {
    id: 'paint',
    name: 'Paint',
    icon: '/icons/paint.png',
    component: lazy(() => import('@/components/apps/Paint')),
    defaultSize: { width: 800, height: 600 },
  },
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    icon: '/icons/explorer.png',
    component: lazy(() => import('@/components/apps/Explorer')),
    defaultSize: { width: 700, height: 500 },
  },
  chat: {
    id: 'chat',
    name: 'Chat Room',
    icon: '/icons/chat.png',
    component: lazy(() => import('@/components/apps/Chat')),
    defaultSize: { width: 500, height: 600 },
  },
};

// components/desktop/Desktop.tsx
function Desktop() {
  const { dispatch } = useWindowManager();
  
  const desktopApps = ['notepad', 'paint', 'explorer', 'chat'];
  
  const launchApp = (appId: string) => {
    const app = APP_REGISTRY[appId];
    dispatch({
      type: 'OPEN_WINDOW',
      payload: {
        title: app.name,
        icon: app.icon,
        content: app.component,
        size: app.defaultSize,
        position: { x: 100, y: 100 }, // Or calculate to avoid overlap
      },
    });
  };
  
  return (
    <div className="desktop">
      {desktopApps.map((appId) => (
        <DesktopIcon
          key={appId}
          icon={APP_REGISTRY[appId].icon}
          label={APP_REGISTRY[appId].name}
          onDoubleClick={() => launchApp(appId)}
        />
      ))}
    </div>
  );
}
```

## Data Flow

### Window Lifecycle Flow

```
User Action (Double-click desktop icon)
    ↓
launchApp(appId)
    ↓
dispatch({ type: 'OPEN_WINDOW', payload: { appId, ... } })
    ↓
WindowManager reducer
  - Generate unique window ID
  - Add to windows registry
  - Set as focused window
  - Increment nextZIndex
    ↓
Window component renders
  - Reads position, size, zIndex from state
  - Renders window chrome (titlebar, borders)
  - Renders app component inside window content area
    ↓
User interacts with window (drag, resize, close)
    ↓
Window dispatches actions (MOVE_WINDOW, RESIZE_WINDOW, CLOSE_WINDOW)
    ↓
WindowManager updates state
    ↓
Window re-renders with new position/size
```

### Real-time Chat Flow

```
User opens Chat app
    ↓
Chat component mounts
    ↓
useWebSocket('chat-message', handleMessage) subscribes
    ↓
WebSocketManager connects to server (if not already connected)
    ↓
Server assigns unique user ID and fun username
    ↓
User types message and clicks Send
    ↓
wsManager.send('chat-message', { text, userId })
    ↓
WebSocket server broadcasts to all connected clients
    ↓
All clients receive message via WebSocket
    ↓
useWebSocket callback fires
    ↓
Chat component updates messages state
    ↓
New message appears in all clients' chat windows
```

### LLM (Clippy) Interaction Flow

```
User idles for 30 seconds OR clicks "Get Help"
    ↓
Clippy component detects trigger
    ↓
Gather context (current app, recent actions)
    ↓
Call Server Action: askClippy(prompt, context)
    ↓
Server Action
  - Constructs prompt with context
  - Calls Gemini API (server-side, API key protected)
  - Streams response back to client
    ↓
Client receives streaming response
    ↓
Clippy component displays text with typing animation
    ↓
User can dismiss or ask follow-up question
```

### Virtual Filesystem Access Flow

```
User opens File Explorer
    ↓
Explorer component mounts
    ↓
useFilesystem() hook initializes BrowserFS
    ↓
BrowserFS mounts virtual filesystem (in-memory or localStorage)
    ↓
Explorer reads root directory
    ↓
Display folders and files in tree view
    ↓
User clicks on file
    ↓
Explorer reads file contents from BrowserFS
    ↓
Display file contents (or open in appropriate app)
    ↓
Files persist in localStorage across sessions (optional)
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-100 users** | Single Next.js server handles everything. WebSocket connections managed in-memory. No external dependencies needed. |
| **100-10K users** | Move WebSocket server to separate service (e.g., Socket.io server on different port). Use Redis for WebSocket pub/sub to support multiple server instances. Keep Next.js for SSR/API routes. |
| **10K+ users** | Add CDN for static assets. Implement chat room sharding (users assigned to rooms based on hash). Consider edge functions for Clippy API route to reduce latency. Database for chat history (optional, if adding persistence). |

### Scaling Priorities

1. **First bottleneck:** WebSocket connection limits on single server (typically 10K-65K concurrent connections depending on server). **Solution:** Separate WebSocket server + Redis pub/sub for horizontal scaling.

2. **Second bottleneck:** Gemini API rate limits/costs. **Solution:** Implement request queuing, caching for common queries, or fallback to simpler responses when rate limited.

## Anti-Patterns

### Anti-Pattern 1: DOM Manipulation Instead of React State

**What people do:** Use jQuery or vanilla JS to manipulate window positions/sizes directly in the DOM (like the reference vidhi-mody/Windows-98 repo).

**Why it's wrong:** 
- Bypasses React's reconciliation, causing state/UI desync
- Makes it impossible to implement features that depend on state (e.g., "restore all windows", undo/redo)
- Harder to test, debug, and reason about

**Do this instead:** 
- Store window position/size in React state (WindowManager context)
- Use controlled components where position/size are props derived from state
- Dispatch actions to update state, let React re-render

### Anti-Pattern 2: Storing WebSocket Connection in Component State

**What people do:** Create new WebSocket connection in each component that needs real-time data, or store WebSocket in component state.

**Why it's wrong:**
- Multiple connections to same server (inefficient, can hit connection limits)
- Hard to share data between components
- Connection gets destroyed when component unmounts

**Do this instead:**
- Create WebSocket as singleton service outside React component tree
- Use custom hook (useWebSocket) to subscribe to messages
- Handle reconnection logic in the service, not in components

### Anti-Pattern 3: Putting API Keys in Client-Side Code

**What people do:** Include Gemini API key directly in client-side code to call LLM from browser.

**Why it's wrong:**
- API key is visible in browser DevTools and source code
- Anyone can steal key and use your quota
- Cannot implement rate limiting or usage tracking

**Do this instead:**
- Always call LLM APIs from server (Next.js API Route or Server Action)
- Store API key in environment variable (`.env.local`, never committed to Git)
- Client sends request to your API route, which proxies to LLM provider

### Anti-Pattern 4: Re-rendering All Windows on Every State Change

**What people do:** Store all window state in single object, any change causes all Window components to re-render.

**Why it's wrong:**
- Performance degrades as number of windows increases
- Typing in one window causes lag in all other windows
- Animations become janky

**Do this instead:**
- Use React.memo() on Window component
- Use selectors or granular context subscriptions (e.g., Zustand selectors)
- Only re-render window that changed
- Example: `const window = useWindowManager((state) => state.windows[id])`

### Anti-Pattern 5: Loading All App Components at Initial Page Load

**What people do:** Import all application components (Notepad, Paint, Explorer, etc.) at the top level, even if user never opens them.

**Why it's wrong:**
- Increases initial bundle size and load time
- User pays the cost of downloading code they might never use
- Paint component (with canvas logic) can be 50-100KB alone

**Do this instead:**
- Use React.lazy() for application components
- Load apps on-demand when window is opened
- Show loading spinner while app component loads
- Example in Application Registry pattern above

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Gemini API** | Next.js API Route or Server Action | Keep API key server-side. Use streaming for typing effect. Implement retry logic for rate limits. |
| **WebSocket Server** | Native WebSocket or Socket.io | Can be built into Next.js (custom server) or separate Node.js server. Use Socket.io if you need rooms, broadcast helpers. |
| **BrowserFS** | Client-side library initialized on mount | Provides Node.js-like fs API in browser. Use IndexedDB backend for persistence or in-memory for ephemeral. |
| **Windows 98 Icons** | Static assets or icon font | Use PNG sprites or web font for authentic Windows 98 icons. See win98icons.alexmeub.com or React95 icons package. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **WindowManager ↔ Window** | Context + dispatch actions | Window is controlled component, all state lives in WindowManager |
| **WindowManager ↔ Taskbar** | Context subscription | Taskbar reads window list from context, dispatches focus/minimize/close actions |
| **App Component ↔ Window** | Props or Context | Apps receive window-specific API (e.g., setTitle, close) via context or props |
| **Chat App ↔ WebSocket** | Custom hook (useWebSocket) | Chat subscribes to 'chat-message' events, sends messages via wsManager.send() |
| **Clippy ↔ LLM Service** | fetch() to API route | Clippy sends prompt to /api/clippy, receives streaming response |
| **Explorer ↔ Filesystem** | Custom hook (useFilesystem) | Explorer uses filesystem API (readdir, readFile) exposed by hook |

## Next.js 16 Specific Considerations

### Client vs Server Components

**Desktop Environment = Client Component**  
The entire desktop (WindowManager, Desktop, Taskbar, Windows) must be Client Components because:
- Requires interactivity (drag, click, keyboard)
- Uses React state and effects (useReducer, useEffect)
- Uses browser APIs (WebSocket, localStorage, canvas)

**Clippy API = Server Component/Action**  
The Gemini API integration must be server-side because:
- Protects API key from client exposure
- Can use Server Actions for streaming
- No CORS issues

**Recommended approach:**
```typescript
// app/page.tsx (Server Component by default)
export default function Home() {
  return <DesktopEnvironment />; // Delegates to Client Component
}

// app/components/DesktopEnvironment.tsx
'use client';

export function DesktopEnvironment() {
  return (
    <WindowManager>
      <Desktop />
      <Taskbar />
      <WindowRenderer />
    </WindowManager>
  );
}
```

### WebSocket in Next.js App Router

**Challenge:** Next.js 16 App Router doesn't have built-in WebSocket support like Pages Router had with API routes.

**Solutions:**
1. **Custom Server (Recommended for this project):**
   ```typescript
   // server.ts
   import { createServer } from 'http';
   import { parse } from 'url';
   import next from 'next';
   import { WebSocketServer } from 'ws';

   const dev = process.env.NODE_ENV !== 'production';
   const app = next({ dev });
   const handle = app.getRequestHandler();

   app.prepare().then(() => {
     const server = createServer((req, res) => {
       const parsedUrl = parse(req.url!, true);
       handle(req, res, parsedUrl);
     });

     const wss = new WebSocketServer({ server, path: '/api/ws' });
     
     wss.on('connection', (ws) => {
       // WebSocket logic here
     });

     server.listen(3000, () => {
       console.log('> Ready on http://localhost:3000');
     });
   });
   ```

2. **Separate WebSocket Server:**
   - Run WebSocket server on different port (e.g., 3001)
   - Client connects to ws://localhost:3001
   - Easier to scale later (can move to different host)

3. **Third-party Service:**
   - Use Pusher, Ably, or Socket.io hosted service
   - No infrastructure management
   - Costs money at scale

**Recommendation:** Start with custom server (#1) for simplicity, move to separate server (#2) if you need to scale.

## Build Order and Dependencies

### Phase 1: Desktop Shell (Foundation)
**Build order:**
1. Basic page layout with Windows 98 styling (teal background, fonts)
2. Desktop component with static background
3. Taskbar with Start button and clock (no functionality yet)
4. Start menu (static menu items, close on click outside)

**Why first:** Establishes visual foundation and basic layout. No complex state yet.

**Dependencies:** None (only Tailwind CSS for styling)

---

### Phase 2: Window Management System (Core)
**Build order:**
1. WindowManager context with reducer (add/remove/focus windows)
2. Window component (titlebar, borders, basic rendering)
3. Window dragging (pointer events on titlebar)
4. Window focus (z-index management, bring to front on click)
5. Window buttons (close, minimize, maximize)
6. Window resizing (edge/corner dragging)

**Why second:** Core functionality that everything else depends on. Apps can't exist without windows.

**Dependencies:** Phase 1 complete (desktop to render windows on)

---

### Phase 3: Application System (Content)
**Build order:**
1. Application registry (define available apps with metadata)
2. Desktop icons (double-click to launch app)
3. Launch app from Start menu
4. Simple Notepad app (textarea, word wrap, font controls)
5. Basic Paint app (canvas, pencil tool, color picker)
6. Read-only File Explorer (BrowserFS setup, tree view)

**Why third:** With window system in place, we can build app content. Start with simple apps (Notepad) before complex ones (Paint).

**Dependencies:** Phase 2 complete (window system to render apps in)

---

### Phase 4: Real-time Chat (Multiplayer)
**Build order:**
1. WebSocket server setup (custom Next.js server or separate server)
2. WebSocketManager client service (connection, reconnection)
3. Chat app UI (message list, input, send button)
4. Username generation (auto-assign fun names)
5. Online user list
6. Message history (recent messages on join)

**Why fourth:** Adds multiplayer dimension. Depends on window system but is independent from other apps.

**Dependencies:** Phase 2 complete (window system), Phase 3 optional (but recommended for testing)

---

### Phase 5: LLM Integration (Clippy)
**Build order:**
1. Gemini API route/Server Action (prompt → response)
2. Clippy UI component (speech bubble, animation)
3. Idle detection (track user inactivity)
4. Context gathering (detect current window, app state)
5. Manual trigger (help button or desktop icon)
6. Streaming response (typing animation)

**Why fifth:** Most complex feature, depends on understanding app state. Build last to allow iteration on earlier systems.

**Dependencies:** Phase 2 complete (window system), Phase 3 complete (apps to provide context)

---

### Dependency Graph

```
Phase 1 (Desktop Shell)
    ↓
Phase 2 (Window Management) ← Everything depends on this
    ↓
    ├─→ Phase 3 (Applications)
    │       ↓
    │   Phase 5 (Clippy) ← Needs apps for context
    │
    └─→ Phase 4 (Chat) ← Independent of apps
```

### Critical Path

**Minimum Viable Product:** Phase 1 → Phase 2 → Phase 3 (Notepad only)

**Full Feature Set:** All phases in order above

### Parallel Development Opportunities

After Phase 2 is complete:
- **Phase 3 (Apps)** and **Phase 4 (Chat)** can be built in parallel by different developers
- **Phase 5 (Clippy)** should wait for Phase 3 to be mostly complete

## Sources

**HIGH Confidence:**
- Next.js 16 App Router documentation (official)
- React 19 documentation (official)
- WebSocket API (MDN, W3C spec)
- Gemini API documentation (official)

**MEDIUM Confidence:**
- React95 library patterns (GitHub, popular library but not official guidance)
- os-gui window management patterns (GitHub, well-maintained but jQuery-based)
- BrowserFS integration patterns (GitHub, library documentation)

**Reference Projects Analyzed:**
- vidhi-mody/Windows-98 (jQuery implementation) - studied for feature set and visual design
- 1j01/os-gui (jQuery-based windowing) - studied for window management patterns
- React95/React95 (React components) - studied for React component patterns
- 98.js.org (production web desktop) - studied for complete system architecture

**Key Insights:**
1. Traditional OS GUIs (vidhi-mody, os-gui) use imperative DOM manipulation, must translate to React declarative patterns
2. React95 provides UI components but not full window management - need to build custom
3. WebSocket management as singleton service is standard pattern across many real-time apps
4. Server-side LLM integration is required for API key protection (verified in Next.js and Gemini docs)
5. BrowserFS provides Node.js-like filesystem API in browser (official documentation confirms approach)

---
*Architecture research for: Browser-based OS/Desktop Environment (Windows 98)*
*Researched: 2026-01-31*
