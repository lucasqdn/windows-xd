# Project Research Summary

**Project:** windows-xd
**Domain:** Browser-based OS Recreation (Windows 98 Desktop Environment)
**Researched:** January 31, 2026
**Confidence:** HIGH

## Executive Summary

windows-xd is a Next.js 16/React 19 browser-based recreation of the Windows 98 desktop environment with modern twists: real-time multiplayer chat and LLM-powered Clippy assistant. This domain requires building three core systems: (1) a window management system for draggable, resizable windows with z-index orchestration, (2) authentic Windows 98 UI recreation using Tailwind CSS with pixel-perfect beveled styling, and (3) real-time infrastructure for WebSocket chat and LLM integration.

The recommended approach is to build in phases starting with the foundational window management system, then layer applications (Notepad, Paint, Explorer) on top, and finally add multiplayer features (chat, Clippy). The stack is already well-chosen: Next.js 16 provides the framework, react-rnd handles window drag/resize, Zustand manages window state, fabric.js powers Paint, Socket.io enables real-time chat, and the new @google/genai SDK (not the deprecated @google/generative-ai) integrates with Gemini API.

The primary risks are window z-index/focus management drift, memory leaks from window accumulation, canvas performance degradation in Paint, and WebSocket reconnection failures. These are all preventable with proper architecture from the start: centralized window state with selectors, true component unmounting (not display: none), RAF-based canvas rendering, and exponential backoff reconnection logic. The window management system is the critical path—everything depends on getting it right in Phase 1.

## Key Findings

### Recommended Stack

The project already has the correct core stack (Next.js 16, React 19, TypeScript 5, Tailwind 4). Research identified the optimal libraries for key features:

**Core technologies:**
- **react-rnd (10.5.2)**: Window drag & resize — combines react-draggable + re-resizable in one component, supports bounds checking and grid snapping
- **Zustand (5.0.10)**: Window state management — lightweight, selector-based subscriptions prevent unnecessary re-renders
- **fabric.js (7.1.0)**: Canvas drawing for Paint — industry standard (used by Canva), handles shapes/brushes/undo/redo
- **Socket.io (4.8.3)**: WebSocket chat — auto-reconnection, rooms, broadcasting, fallback to long-polling
- **@google/genai (1.39.0)**: LLM integration — NEW unified SDK for Gemini 2.0+ (NOT the deprecated @google/generative-ai which EOL'd Nov 2025)

**Critical discovery:** The widely-documented `@google/generative-ai` package is deprecated. Always use `@google/genai` for new projects.

### Expected Features

From competitor analysis (98.js, Windows 95 Electron) and user expectations:

**Must have (table stakes):**
- Desktop with icons and teal background — core Windows 98 metaphor
- Taskbar with Start button, clock, window buttons — primary navigation
- Window management (drag/resize/minimize/maximize/close) — core windowing system
- Classic 3D beveled UI with authentic fonts (MS Sans Serif) — visual identity
- Notepad with text editing — expected basic app
- Focus management and z-index control — only one window active at a time

**Should have (competitive differentiators):**
- LLM-powered Clippy with contextual help — modern AI twist on nostalgic character
- Real-time multiplayer chatroom — social dimension missing from other recreations
- Auto-generated fun usernames (no auth friction) — removes barrier to entry
- Paint with core tools (pencil, line, rectangle, fill, color picker) — creative tool and nostalgia multiplier
- File Explorer with read-only browsing — exploration experience
- Pixel-perfect accuracy — most recreations are "inspired by," not authentic

**Defer (v2+):**
- Classic games (Minesweeper, Solitaire) — significant effort per game
- Theme loading (.theme files) — powerful but complex feature
- Data persistence across sessions — adds auth/database complexity
- Full Paint feature set (text tool, spray paint) — core tools prove concept first
- Multiple chatrooms — splits community, adds UI complexity

### Architecture Approach

The architecture follows standard patterns for browser-based OS environments with React: centralized window state management (WindowManager context/store), controlled window components that read from state and dispatch actions, singleton WebSocket service for real-time features, and server-side LLM API proxy to protect API keys. The key insight is treating windows as controlled components with all state in a central manager, similar to how forms work in React.

**Major components:**
1. **WindowManager** — maintains registry of windows, manages z-index stack, handles window lifecycle (open/close/minimize/maximize); implemented with React Context + useReducer or Zustand store
2. **Window** — renders window chrome (titlebar, borders), handles drag/resize via react-rnd, dispatches actions to WindowManager; must be React.memo'd to prevent re-renders
3. **Application Registry** — centralized registry of launchable apps (Notepad, Paint, Explorer, Chat) with metadata (name, icon, component, default size); uses React.lazy() for code splitting
4. **WebSocketManager** — singleton service managing WebSocket connection, handles reconnection with exponential backoff, provides pub/sub interface for components
5. **Desktop Shell** — renders desktop background, desktop icons, taskbar, Start menu, clock; subscribes to WindowManager for window buttons in taskbar

**Critical pattern:** Use selectors/subscriptions (Zustand selectors or granular context) to prevent re-rendering all windows when one window changes. Store window state globally but allow components to subscribe only to their slice.

### Critical Pitfalls

From domain expertise and known issues in similar projects:

1. **Window Z-index/Focus Management Drift** — Z-index values and focus state become desynchronized, causing visual stacking order to mismatch logical focus order. Users click visually "top" window but focus goes to hidden window. **Prevent:** Use ordered array of window IDs with z-index derived from position (0-N), not incrementing counter. Single source of truth for focus. Address in Phase 1.

2. **Memory Leaks from Window Accumulation** — Closed windows remain in state/memory, event listeners persist after unmount, canvas data never garbage collected. App slows down progressively. **Prevent:** Remove window from state on close (not display: none), return cleanup functions from useEffect, store canvas data in refs not state, verify unmounting with React DevTools. Address in Phase 1.

3. **Canvas Performance Degradation (Paint)** — Drawing lags behind mouse, app freezes during operations, large canvases crash browser. **Prevent:** Use requestAnimationFrame for draw operations, store canvas context in ref (not state), use command pattern for undo (not full canvas snapshots), throttle mousemove events to 60fps max. Address in Phase 2/3.

4. **WebSocket Reconnection Logic Failures** — Chat disconnects permanently after network hiccup, reconnection spams server, users miss messages during reconnect. **Prevent:** Implement state machine (connecting/connected/disconnecting/disconnected), exponential backoff (1s, 2s, 4s, cap at 30s), singleton connection, heartbeat/ping-pong to detect stale connections. Address in Phase 3.

5. **Drag/Resize Performance Killing Main Thread** — Window dragging feels janky, browser freezes during resize, frame rate drops below 30fps. **Prevent:** Use CSS transform for movement (not top/left), batch updates with RAF, store drag offset in ref (only update state on dragEnd), add will-change: transform hint, use React.memo on windows. Address in Phase 1.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Desktop Shell & Window System (Foundation)
**Rationale:** Window management is the critical path—all features depend on it. Must architect correctly from the start to avoid performance issues and memory leaks. Desktop shell establishes visual identity and basic layout. This is the foundational layer.

**Delivers:** 
- Desktop with teal background and icon grid
- Taskbar with Start button, clock, window buttons (minimize targets)
- Start menu with hierarchical items
- Complete window management system (drag, resize, minimize, maximize, close, z-index, focus)
- Window chrome with authentic 3D beveled styling
- Authentic font loading (MS Sans Serif) without FOUT

**Addresses from FEATURES.md:** All table stakes features (desktop, taskbar, Start menu, window management, classic UI, fonts)

**Avoids from PITFALLS.md:** 
- Z-index/focus drift (use position-based indexing)
- Memory leaks (true unmounting, cleanup functions)
- Drag performance (CSS transform, RAF, refs)
- Font loading FOUT (preload, font-display: block)
- Positioning chaos (proper positioning context)

**Stack from STACK.md:** react-rnd, Zustand, Tailwind CSS, web-safe fonts with fallbacks

**Research needed:** No — window management patterns are well-documented in React ecosystem

### Phase 2: Core Applications (Content)
**Rationale:** With window system working, add application content to validate the system. Start with simplest app (Notepad) to prove concept, then more complex apps (Paint, Explorer). Applications are independent and can be built in parallel once window system is stable.

**Delivers:**
- Application registry with lazy loading
- Desktop icons that launch apps
- Notepad with text editing (no save/load)
- File Explorer with read-only folder browsing (BrowserFS)
- Paint with core drawing tools (pencil, line, rectangle, fill, color picker)

**Addresses from FEATURES.md:** 
- Must-have: Notepad (table stakes)
- Should-have: Paint (creative tool), File Explorer (exploration)

**Avoids from PITFALLS.md:**
- Canvas performance (RAF, refs, command pattern for undo)
- State management scaling (lazy load apps, memo components)
- Loading all apps at page load (React.lazy)

**Stack from STACK.md:** fabric.js for Paint, BrowserFS for Explorer filesystem, nanoid for IDs

**Research needed:** Moderate — Paint implementation with fabric.js may need specific research on tool implementation patterns

### Phase 3: Real-time Chat (Multiplayer Foundation)
**Rationale:** Chat is the first multiplayer feature and establishes WebSocket infrastructure that Clippy will use. Independent of other applications so can proceed once window system is solid. Adds social dimension that differentiates from competitors.

**Delivers:**
- WebSocket server setup (custom Next.js server or separate server)
- WebSocketManager singleton service with reconnection logic
- Chat application window with message list and input
- Auto-generated fun usernames (CoolUser42 style)
- Online user list showing active participants
- Session-scoped message history (recent messages on join)

**Addresses from FEATURES.md:**
- Should-have: Real-time chatroom, online user list, auto-generated usernames (all differentiators)

**Avoids from PITFALLS.md:**
- WebSocket reconnection failures (state machine, exponential backoff, heartbeat)
- Multiple connections (singleton pattern)
- Security mistakes (validate/sanitize messages, rate limiting)

**Stack from STACK.md:** Socket.io (server + client), date-fns for timestamps

**Research needed:** Moderate — WebSocket integration with Next.js 16 App Router requires custom server setup

### Phase 4: LLM-Powered Clippy (AI Enhancement)
**Rationale:** Most complex feature, depends on understanding application state for context. Build last to allow iteration on earlier systems. Adds modern AI twist that's the key differentiator alongside chat.

**Delivers:**
- Gemini API integration via Next.js API route (API key protection)
- Clippy UI component with speech bubble and animations
- Idle detection to trigger proactive help
- Context gathering (current window, app state, recent actions)
- Manual trigger (Help button or desktop icon)
- Streaming response with typing animation

**Addresses from FEATURES.md:**
- Should-have: LLM-powered Clippy, idle detection (both differentiators)

**Avoids from PITFALLS.md:**
- LLM rate limiting (parse headers, queue requests, exponential backoff)
- API key exposure (server-side only, never client)
- No graceful degradation (show cached responses or "unavailable" UI)

**Stack from STACK.md:** @google/genai (NEW SDK, not deprecated one)

**Research needed:** High — Gemini API integration patterns, prompt engineering for contextual help, streaming response handling

### Phase Ordering Rationale

- **Sequential dependency:** Phase 1 → Phase 2 → Phase 3 → Phase 4 is the critical path
  - Phase 2 depends on Phase 1 (windows need window system)
  - Phase 4 depends on Phase 2 (Clippy needs app context)
  - Phase 3 is independent after Phase 1 (chat doesn't need apps)

- **Risk mitigation:** Front-load architectural risks in Phase 1 (window management, z-index, memory, performance) before building features on top

- **Parallelization opportunity:** After Phase 1, Phase 2 (Applications) and Phase 3 (Chat) can proceed in parallel if multiple developers available

- **Complexity progression:** Start simple (window chrome), add medium complexity (apps with internal state), finish with complex (real-time + AI integration)

- **Value delivery:** Each phase delivers usable increment
  - Phase 1: Desktop environment you can interact with
  - Phase 2: Apps you can use (draw in Paint, edit text in Notepad)
  - Phase 3: Social dimension (chat with others)
  - Phase 4: AI enhancement (get help from Clippy)

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Paint application):** Canvas drawing patterns with fabric.js, tool implementation, undo/redo systems — canvas APIs have many gotchas
- **Phase 3 (WebSocket setup):** Next.js 16 App Router doesn't have built-in WebSocket support — need custom server or separate server patterns
- **Phase 4 (Clippy/LLM):** Prompt engineering for contextual help, streaming response handling, error recovery for rate limits — LLM integration is complex

Phases with standard patterns (minimal research needed):
- **Phase 1 (Window system):** Well-documented patterns in React ecosystem (react-rnd, Zustand), mostly implementation work
- **Phase 2 (Notepad, Explorer):** Standard form/tree components, straightforward implementation

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified library versions exist on npm (Jan 31, 2026), GitHub repos confirmed, official docs reviewed. Critical Gemini SDK migration identified. |
| Features | HIGH | Based on competitor analysis (98.js with 1.4k stars, Windows 95 Electron with 23.9k stars), user expectations clear from existing projects. MVP scope well-defined. |
| Architecture | HIGH | Standard patterns for React-based window management systems, documented in React95, os-gui projects. Next.js + WebSocket integration patterns established. |
| Pitfalls | HIGH | Based on known issues in similar projects (vidhi-mody/Windows-98, os-gui), React performance documentation, Canvas API guides, WebSocket best practices. All pitfalls have documented solutions. |

**Overall confidence:** HIGH

The domain (browser-based OS recreation) has established patterns from multiple prior projects. The stack choices are well-supported by active libraries. The main risks (window management, canvas performance, WebSocket reconnection) have well-documented prevention strategies. The unknown territory is primarily in the LLM integration (newer technology) and WebSocket + Next.js 16 integration (custom server required).

### Gaps to Address

Areas where research was incomplete or needs validation during implementation:

- **Gemini API prompt engineering:** Research identified the correct SDK and basic integration pattern, but optimal prompt structure for contextual help (passing window state, action history) needs experimentation during Phase 4 planning. Test with actual window state payloads to determine optimal context format.

- **WebSocket scaling:** Research covers single-server setup, but if user count exceeds 10K concurrent connections, will need Redis pub/sub for horizontal scaling. Defer architecture for this until usage data available.

- **BrowserFS configuration:** Research identified BrowserFS as the solution for virtual filesystem, but specific configuration (IndexedDB vs localStorage backend, folder structure definition) needs detailed planning during Phase 2 for Explorer. Review BrowserFS docs for optimal setup.

- **Cross-browser testing matrix:** Research identified Safari/Firefox differences for scrollbar styling and border rendering, but pixel-perfect testing needed during Phase 1 implementation. Allocate time for visual regression testing across browsers.

- **Mobile/tablet experience:** Research deferred mobile responsiveness (breaks authenticity), but need to decide if tablet landscape mode should work. Test during Phase 1 to determine minimum supported viewport size.

## Sources

### Primary (HIGH confidence)
- npm registry versions (verified Jan 31, 2026): react-rnd@10.5.2, zustand@5.0.10, fabric@7.1.0, socket.io@4.8.3, @google/genai@1.39.0
- Official documentation: Next.js 16 (App Router), React 19, Gemini API, Socket.io 4.x, fabric.js 7.x
- GitHub repositories: bokuweb/react-rnd, googleapis/js-genai (new SDK), google-gemini/deprecated-generative-ai-js (deprecation notice)

### Secondary (MEDIUM confidence)
- Competitor projects: 98.js (1j01/98 - 1.4k stars), Windows 95 Electron (felixrieseberg/windows95 - 23.9k stars), os-gui library (1j01/os-gui - 232 stars)
- Reference implementation: vidhi-mody/Windows-98 (jQuery approach, studied for feature set)
- Domain patterns: React95 library components, BrowserFS integration patterns

### Tertiary (LOW confidence)
- Windows 98 UI recreation patterns (web-safe fonts, CSS bevels) — common practice in retro UI projects, but not officially documented
- Optimal prompt engineering for Clippy — new use case, needs experimentation
- WebSocket + Next.js 16 integration — community patterns, official support for custom server

---
*Research completed: January 31, 2026*
*Ready for roadmap: yes*
