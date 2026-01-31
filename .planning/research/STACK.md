# Stack Research

**Domain:** Windows 98 desktop recreation with real-time chat and LLM integration  
**Researched:** January 31, 2026  
**Confidence:** HIGH

## Recommended Stack

### Core Technologies (Already in place)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.1.6 | Framework | Already in project - App Router provides SSR/SSG, API routes for WebSocket server |
| React | 19.2.3 | UI Library | Already in project - Latest stable, full support for concurrent features |
| TypeScript | 5.x | Type safety | Already in project - Essential for large component hierarchies like window management |
| Tailwind CSS | 4.x | Styling | Already in project - Utility-first approach ideal for Windows 98 UI recreation |

### Window Management

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-rnd | 10.5.2 | Drag + resize | **PRIMARY CHOICE** - Combines react-draggable + re-resizable, handles both drag and resize in one component |
| react-draggable | 4.5.0 | Drag only | Alternative if you only need dragging without resize |
| zustand | 5.0.10 | State management | Lightweight state manager for window z-index, minimize/maximize states, window registry |

**Rationale for react-rnd:**
- Handles both dragging AND resizing in a single component
- 4.3k stars, actively maintained
- Built on top of react-draggable and re-resizable (best of both worlds)
- Supports bounds checking (keep windows in viewport)
- Grid snapping for precise positioning
- Lock aspect ratio support
- TypeScript definitions included
- Works with React 19

### Canvas Drawing (Paint App)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| fabric.js | 7.1.0 | Canvas manipulation | **PRIMARY CHOICE** - Industry standard for canvas apps, handles shapes, brushes, selection, undo/redo |
| perfect-freehand | 1.2.2 | Smooth drawing | Optional enhancement for natural-looking freehand strokes |

**Rationale for fabric.js:**
- Mature library (used by Canva, Figma-like tools)
- Object-based canvas manipulation (not raw pixel manipulation)
- Built-in support for shapes, text, brushes, selection
- Layer management
- Undo/redo history
- Export to PNG/SVG/JSON
- Touch-friendly for mobile
- Active maintenance

**What NOT to use:**
- Konva/react-konva - Overkill for Paint app, designed for complex animations/games
- Raw Canvas API - Too low-level, would need to rebuild everything fabric provides

### Real-time WebSocket Chat

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| socket.io | 4.8.3 | Server (Node.js) | **PRIMARY CHOICE** - Auto-reconnection, rooms, broadcasting, fallback to polling |
| socket.io-client | 4.8.3 | Client (Browser) | Client counterpart to socket.io server |
| ws | 8.19.0 | Raw WebSocket server | Alternative if you need minimal overhead, no extra features |

**Rationale for Socket.IO:**
- Auto-reconnection handling (critical for chat)
- Rooms and namespaces (multiple chatrooms if needed)
- Broadcasting to all clients or specific groups
- Fallback to long-polling if WebSocket unavailable
- Works seamlessly with Next.js API routes (Node.js)
- 61k stars, battle-tested
- Built-in heartbeat/timeout detection

**Next.js Integration:**
- Create custom server in `server.js` or use API route with `res.socket.server`
- Example: `/pages/api/socket.ts` can initialize Socket.IO server
- Socket.IO server runs alongside Next.js app

**What NOT to use:**
- Native WebSocket API - No reconnection, no rooms, too low-level for multiplayer chat
- Firebase Realtime DB - Overkill, adds billing, not needed for ephemeral chat

### LLM Integration (Gemini API)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @google/genai | 1.39.0 | **NEW** Google Gen AI SDK | **PRIMARY CHOICE** - Unified SDK for Gemini 2.0+, supports Gemini + Vertex AI |
| @google/generative-ai | 0.24.1 | **DEPRECATED** Old SDK | **DO NOT USE** - End of life Nov 30, 2025 |

**IMPORTANT - SDK Migration:**
The `@google/generative-ai` package you may find in documentation is **deprecated**. Google released a new unified SDK `@google/genai` in December 2024 for Gemini 2.0+.

**Rationale for @google/genai:**
- Official Google SDK (not a wrapper)
- Supports Gemini 2.0 Flash/Pro models
- Streaming responses for real-time Clippy
- Function calling for context-aware actions
- Works in both Node.js (API routes) and browser (with API key)
- TypeScript support built-in
- Active development by Google

**Implementation approach:**
```typescript
// In Next.js API route (/app/api/clippy/route.ts)
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  const { prompt, context } = await req.json();
  
  const response = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: `You are Clippy, a helpful Windows 98 assistant. Context: ${context}\n\nUser: ${prompt}`,
  });
  
  // Stream response back to client
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        controller.enqueue(chunk.text);
      }
      controller.close();
    },
  });
  
  return new Response(stream);
}
```

**What NOT to use:**
- OpenAI/Anthropic - Project constraint requires Gemini
- @google/generative-ai - Deprecated, no Gemini 2.0 features
- LangChain - Overkill for single LLM integration, adds complexity

### Windows 98 UI & Fonts

| Resource | Version/Source | Purpose | Notes |
|----------|----------------|---------|-------|
| MS Sans Serif | Web-safe fallback | Primary system font | Use font-family: 'MS Sans Serif', 'Microsoft Sans Serif', sans-serif |
| Tahoma | Web-safe | Secondary UI font | Used in Windows 98 SE/ME |
| w95.css | N/A | CSS framework | **OPTIONAL** - Pre-built Windows 98 components, can extract patterns |
| Custom CSS | N/A | Manual recreation | **RECOMMENDED** - More control over pixel-perfect accuracy |

**Font Strategy:**
1. **Primary approach:** Use web-safe fonts with Tailwind
```css
@layer base {
  .win98-font {
    font-family: 'MS Sans Serif', 'Microsoft Sans Serif', Tahoma, sans-serif;
    -webkit-font-smoothing: none; /* Disable anti-aliasing for authentic look */
    -moz-osx-font-smoothing: grayscale;
  }
}
```

2. **Optional:** Host MS Sans Serif via @font-face (legally gray area, use web-safe fallback first)
   - Some open-source recreations exist (e.g., "W95FA" font)
   - Test web-safe fonts first before adding custom fonts

**Windows 98 UI Recreation with Tailwind:**
```typescript
// Example: Window title bar
const Win98TitleBar = () => (
  <div className="
    bg-gradient-to-r from-[#000080] to-[#1084d0]
    text-white font-bold text-sm
    px-1 py-0.5
    flex items-center justify-between
    cursor-move
  ">
    <span>My Computer</span>
    <div className="flex gap-0.5">
      {/* Minimize, Maximize, Close buttons */}
    </div>
  </div>
);

// Example: Window border (raised bevel effect)
const Win98Window = () => (
  <div className="
    border-2
    border-t-white border-l-white
    border-r-gray-800 border-b-gray-800
    bg-gray-200
    shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)]
  ">
    {/* Content */}
  </div>
);
```

**CSS Techniques for Windows 98 Style:**
- **3D Bevels:** Use border tricks with light/dark colors
  - Top/Left: Light (#fff, #dfdfdf)
  - Bottom/Right: Dark (#808080, #000)
- **Buttons:** Raised when normal, inverted borders when pressed
- **Backgrounds:** Solid colors (#c0c0c0 for gray, #000080 for title bars)
- **No border-radius:** Everything is square
- **Font rendering:** Disable anti-aliasing where possible

**What NOT to use:**
- w95.css library directly - Adds unnecessary CSS weight, harder to customize with Tailwind
- Custom font files without fallback - Poor UX if fonts fail to load
- Modern UI libraries (MUI, Chakra) - Won't achieve authentic Windows 98 look

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.1 | Conditional classes | Combining Tailwind classes dynamically |
| nanoid | 5.0.9 | Unique IDs | Generate window IDs, chat message IDs |
| date-fns | 4.1.0 | Date formatting | Timestamp formatting in chat |

## Installation

```bash
# Window management
npm install react-rnd zustand

# Canvas drawing
npm install fabric

# Optional: smooth drawing enhancement
npm install perfect-freehand

# WebSocket chat
npm install socket.io socket.io-client

# LLM integration (NEW SDK)
npm install @google/genai

# Supporting utilities
npm install clsx nanoid date-fns

# Dev dependencies (if not present)
npm install -D @types/fabric @types/node
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Window management | react-rnd | react-draggable + re-resizable | react-rnd combines both, simpler API |
| Window management | react-rnd | dnd-kit | dnd-kit is for drag-and-drop lists, not window dragging |
| Canvas | fabric.js | Konva + react-konva | Konva is for animations/games, overkill for Paint |
| Canvas | fabric.js | Excalidraw libraries | Too opinionated for Windows 98 Paint aesthetic |
| WebSocket | socket.io | ws (raw) | socket.io adds critical features (reconnection, rooms) |
| WebSocket | socket.io | Pusher/Ably | External services add cost, not needed for self-hosted |
| LLM | @google/genai | @google/generative-ai | Old SDK is deprecated, no Gemini 2.0 features |
| LLM | @google/genai | LangChain | Too complex for single LLM, adds unnecessary abstraction |
| State | zustand | Redux Toolkit | Zustand is simpler, no boilerplate for window management |
| State | zustand | Context API | Context causes re-renders, zustand is more performant |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| jQuery | Not idiomatic in React, ref manipulation anti-pattern | React state + react-rnd |
| @google/generative-ai | Deprecated (EOL Nov 2025), no Gemini 2.0 support | @google/genai (new SDK) |
| Vanilla WebSocket API | No reconnection, no rooms, too much manual work | socket.io |
| Raw Canvas API | Too low-level, need to implement shapes/undo/redo | fabric.js |
| CSS-in-JS (styled-components, emotion) | Already using Tailwind, mixing paradigms is messy | Tailwind utility classes |
| w95.css directly | Not composable with Tailwind, hard to customize | Custom Tailwind classes using W95 patterns |
| Local fonts without fallbacks | Breaks if font fails, licensing issues with MS fonts | Web-safe fonts (MS Sans Serif, Tahoma) |

## Architecture Notes

### Window Management System
- **Store:** Use zustand for global window state (positions, z-indexes, minimized)
- **Components:** Each window is a `<Rnd>` component with shared base styles
- **Z-index:** Increment global z-index counter on window focus, store in zustand
- **Taskbar:** Subscribe to zustand store to show/hide minimized windows

### Paint App Canvas
- **Library:** fabric.js canvas instance
- **Tools:** Pencil, eraser, shapes (rectangle, ellipse, line), fill bucket, text
- **Undo/Redo:** Use fabric's built-in history or custom stack
- **Save:** Export canvas to PNG via `canvas.toDataURL()`

### Real-time Chat
- **Architecture:** Socket.IO server in Next.js API route
- **Events:** `message`, `user_joined`, `user_left`, `typing`
- **Persistence:** Ephemeral (in-memory), no database needed
- **UI:** Chat window component, auto-scroll to bottom on new message

### LLM Clippy
- **Architecture:** API route proxies requests to Gemini API (keeps API key secret)
- **Context:** Pass window state (open apps, active window) to Gemini for awareness
- **Streaming:** Use `generateContentStream` for real-time response
- **UI:** Speech bubble component, typewriter effect for text

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| react-rnd@10.5.2 | React 19.x | Uses ref forwarding, works with React 19 |
| fabric.js@7.1.0 | All browsers | No React version dependency |
| socket.io@4.8.3 | socket.io-client@4.8.3 | Must use matching major versions |
| @google/genai@1.39.0 | Node.js 20+ | Released Jan 2026, includes latest Gemini 2.0 features |
| zustand@5.0.10 | React 19.x | No dependency on React internals |

## Sources

**Verified (HIGH confidence):**
- npm registry (versions checked Jan 31, 2026)
- GitHub README files:
  - https://github.com/bokuweb/react-rnd (react-rnd v10.5.2)
  - https://github.com/react-grid-layout/react-draggable (react-draggable v4.5.0)
  - https://github.com/googleapis/js-genai (@google/genai v1.39.0 - new unified SDK)
  - https://github.com/google-gemini/deprecated-generative-ai-js (old SDK deprecated notice)
- Socket.IO official docs (v4.8.3 stable)
- Fabric.js official repo (v7.1.0 latest)

**Context (MEDIUM confidence):**
- Windows 98 UI recreation patterns (web-safe fonts, CSS bevels) - common practice in retro UI projects
- Next.js + Socket.IO integration patterns - documented in Socket.IO guides

**Note:** Gemini SDK migration is critical - many online tutorials still reference the old `@google/generative-ai` package. Always use `@google/genai` for new projects.

---
*Stack research for: Windows 98 desktop recreation with real-time chat and LLM integration*  
*Researched: January 31, 2026*
