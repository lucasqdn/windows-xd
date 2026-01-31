# windows-xd

## What This Is

A pixel-perfect recreation of Windows 98 in the browser, built with modern Next.js 16. Users can open and interact with classic applications (Notepad, Paint, File Explorer) in draggable windows, get help from an LLM-powered Clippy assistant, and chat with other visitors in a retro Yahoo-style chatroom. It's nostalgic computing meets modern multiplayer web.

## Core Value

Users can run functional Windows 98 programs in authentic-looking windows while chatting with other people experiencing the same nostalgia.

## Requirements

### Validated

- ✓ Next.js 16.1.6 with App Router — existing
- ✓ TypeScript 5 in strict mode — existing
- ✓ Tailwind CSS 4 configured — existing
- ✓ Geist Sans and Geist Mono fonts loaded — existing

### Active

- [ ] Windows 98 desktop with teal background (#008080)
- [ ] Authentic Windows fonts (MS Sans Serif style)
- [ ] Classic 3D bevel styling (white top/left, dark bottom/right borders)
- [ ] Full window management system (open, close, minimize, maximize, resize, drag, z-index/focus)
- [ ] Taskbar with Start button and window buttons
- [ ] Desktop icons that launch programs on double-click
- [ ] Start menu with Programs submenu and Shut Down (classic layout)
- [ ] Notepad application with text editing
- [ ] Paint application with core drawing tools (pencil, line, rectangle, fill, color picker)
- [ ] File Explorer with read-only browsing of predefined folder structure
- [ ] LLM-powered Clippy using Gemini API
- [ ] Clippy appears when user seems stuck (idle detection) or user can manually summon
- [ ] Yahoo-style chatroom accessible via desktop icon or Start menu
- [ ] Single public chatroom with all active users
- [ ] WebSocket-based real-time messaging
- [ ] Auto-generated fun usernames (CoolUser42, RetroFan88)
- [ ] Visible online user list in chatroom
- [ ] New users see recent chat history, returning users see their full session history
- [ ] Chat messages and sessions ephemeral (reset on page refresh)
- [ ] No data persistence across sessions

### Out of Scope

- Authentication system — ephemeral sessions only
- Multiple chatrooms — single public room for v1
- Private 1-on-1 messaging — public chat only
- Draggable desktop icons — clickable only
- Games (Minesweeper, Solitaire) — defer to v2
- File creation/editing in File Explorer — read-only browsing
- Server-side data storage — everything client-side or in-memory
- Text tools in Paint — core drawing only
- Notepad save/load — no persistence

## Context

**Inspiration:** This project is inspired by https://github.com/vidhi-mody/Windows-98 (jQuery/Vanilla JS implementation). We're translating that behavior into React state management and Next.js architecture, not using the original DOM manipulation code.

**Visual Fidelity:** Exact replica of Windows 98 aesthetic — pixel-perfect colors, fonts, spacing, and UI elements. Not a modern interpretation; authentic retro.

**Technical Environment:**
- Next.js 16 App Router (React 19.2.3)
- TypeScript 5 strict mode
- Tailwind CSS 4 with custom Windows 98 styling
- WebSockets for real-time chat
- Gemini API for LLM-powered Clippy

**User Experience:**
- Desktop-style interface familiar to anyone who used Windows 98
- Multi-window multitasking with draggable, resizable windows
- Social element through public chatroom adds multiplayer dimension
- Clippy provides contextual AI assistance with retro charm

## Constraints

- **Tech Stack**: Must use Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 (per AGENTS.md)
- **No jQuery**: Translate jQuery/DOM manipulation from reference repo to React patterns
- **Visual Accuracy**: Pixel-perfect Windows 98 recreation — exact colors, fonts, UI elements
- **Authentic Fonts**: Use actual Windows 98 fonts (MS Sans Serif) not modern alternatives
- **LLM Provider**: Gemini API for Clippy (not OpenAI or Anthropic)
- **Real-time**: WebSockets required for chat (not polling or SSE)
- **Ephemeral**: No data persistence — everything resets on refresh
- **Single Page**: Desktop environment lives on one route (/)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Gemini API for Clippy | User preference for Gemini over OpenAI/Claude | — Pending |
| WebSockets for chat | Real-time multiplayer requires instant message delivery | — Pending |
| No data persistence | Simpler architecture, ephemeral sessions match retro chatroom vibe | — Pending |
| Exact Windows 98 replica | Authenticity over modernization preserves nostalgia | — Pending |
| Single public chatroom | Simpler v1, focus on core multiplayer experience | — Pending |
| Read-only File Explorer | Reduces complexity, sufficient for exploration experience | — Pending |
| Core Paint tools only | Full Paint is complex, core tools prove the concept | — Pending |
| Auto-generated usernames | No auth needed, fun names add personality | — Pending |

---
*Last updated: 2025-01-31 after initialization*
