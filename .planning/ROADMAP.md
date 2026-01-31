# Roadmap: windows-xd

## Overview

This roadmap delivers a pixel-perfect Windows 98 desktop environment in the browser with multiplayer chat and AI assistance. We start by building the foundational window management system and desktop shell (Phase 1), then layer applications one by one to validate the system (Phases 2-4), add real-time multiplayer chat infrastructure (Phase 5), and finish with LLM-powered Clippy as the differentiating AI enhancement (Phase 6).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Desktop Shell & Window System** - Foundation layer with complete window management ✅ (2025-01-31)
- [ ] **Phase 2: Notepad Application** - Simplest app to validate window system
- [ ] **Phase 3: Paint Application** - Canvas-based drawing with core tools
- [ ] **Phase 4: File Explorer** - Read-only virtual filesystem browsing
- [ ] **Phase 5: Real-time Chatroom** - WebSocket multiplayer chat infrastructure
- [ ] **Phase 6: LLM-Powered Clippy** - Context-aware AI assistant with Gemini API

## Phase Details

### Phase 1: Desktop Shell & Window System ✅ COMPLETE
**Goal**: Users can interact with an authentic Windows 98 desktop environment with fully functional window management

**Status**: ✅ Complete (2025-01-31, commit 5546193)

**Depends on**: Nothing (first phase)

**Requirements**: WIN-01, WIN-02, WIN-03, WIN-04, WIN-05, WIN-06, WIN-07, DESK-01, DESK-02, DESK-03, DESK-04, DESK-05, DESK-06, MENU-01, MENU-02, MENU-03, MENU-04, STYLE-01, STYLE-02, STYLE-03, STYLE-04

**Success Criteria** (what must be TRUE):
  1. ✅ User sees teal desktop background with clickable icons and taskbar at bottom
  2. ✅ User can click Start button to open hierarchical Start menu with Programs submenu
  3. ✅ User can drag any window by title bar and resize from edges/corners
  4. ✅ User can minimize window to taskbar, maximize to fullscreen, and close via X button
  5. ✅ Clicking any window brings it to front with proper z-index layering
  6. ✅ All UI elements display pixel-perfect Windows 98 styling (3D bevels, authentic fonts, proper spacing)

**Implementation Summary:**
- WindowManagerContext with sorted z-index reordering (prevents drift)
- Desktop component with teal (#008080) background
- Window component with react-rnd for drag/resize
- Taskbar with Start button, window buttons, system tray clock
- StartMenu with Windows 98 styling
- DesktopIcon with double-click detection
- Comprehensive Windows 98 CSS (3D bevels, gradients, buttons)
- Dependencies: react-rnd v10.5.2, zustand v5.0.10

**Files Created:**
- app/contexts/WindowManagerContext.tsx
- app/components/Desktop.tsx
- app/components/Window.tsx
- app/components/Taskbar.tsx
- app/components/StartMenu.tsx
- app/components/DesktopIcon.tsx

**Files Modified:**
- app/globals.css (added Windows 98 styling)
- app/page.tsx (render Desktop component)
- package.json (added dependencies)

### Phase 2: Notepad Application
**Goal**: Users can open Notepad from desktop/Start menu and edit text in a fully functional window

**Depends on**: Phase 1

**Requirements**: NOTE-01, NOTE-02, NOTE-03

**Success Criteria** (what must be TRUE):
  1. User can launch Notepad from desktop icon or Start menu Programs
  2. User can type and edit text with cursor positioning and selection
  3. Notepad displays File and Edit menus with proper menu items (New, Open, Save, Exit, Cut, Copy, Paste, Undo)

**Plans**: TBD

Plans:
- [ ] 02-01: TBD during planning

### Phase 3: Paint Application
**Goal**: Users can draw and create artwork using Paint's core drawing tools

**Depends on**: Phase 1

**Requirements**: PAINT-01, PAINT-02, PAINT-03, PAINT-04, PAINT-05, PAINT-06, PAINT-07

**Success Criteria** (what must be TRUE):
  1. User can launch Paint and see blank canvas drawing area
  2. User can select tools from tool palette and draw with pencil/brush, lines, rectangles
  3. User can fill enclosed areas with fill tool
  4. User can undo and redo drawing actions to recover from mistakes

**Plans**: TBD

Plans:
- [ ] 03-01: TBD during planning
- [ ] 03-02: TBD during planning

### Phase 4: File Explorer
**Goal**: Users can browse a read-only virtual filesystem with folder navigation

**Depends on**: Phase 1

**Requirements**: FILE-01, FILE-02, FILE-03

**Success Criteria** (what must be TRUE):
  1. User can launch File Explorer (My Computer) from desktop icon
  2. User can navigate folder tree and double-click folders to expand/browse
  3. User can use back/forward navigation buttons to move through browsing history

**Plans**: TBD

Plans:
- [ ] 04-01: TBD during planning

### Phase 5: Real-time Chatroom
**Goal**: Users can chat with other connected visitors in real-time with auto-generated usernames

**Depends on**: Phase 1

**Requirements**: CHAT-01, CHAT-02, CHAT-03, CHAT-04

**Success Criteria** (what must be TRUE):
  1. User can open chatroom window with retro Yahoo-style interface
  2. Messages appear instantly for all connected users without refresh
  3. User receives auto-generated fun username (CoolUser42 style) on connection
  4. User sees join/leave notifications when others connect or disconnect

**Plans**: TBD

Plans:
- [ ] 05-01: TBD during planning
- [ ] 05-02: TBD during planning

### Phase 6: LLM-Powered Clippy
**Goal**: Users can get context-aware AI assistance from Clippy based on current application and activity

**Depends on**: Phases 1, 2, 3, 4 (needs application context)

**Requirements**: CLIP-01, CLIP-02, CLIP-03, CLIP-04

**Success Criteria** (what must be TRUE):
  1. Clippy appears automatically when user is idle for 30+ seconds
  2. User can manually summon Clippy anytime via Help menu or desktop icon
  3. Clippy provides context-aware help based on current active window/application
  4. Clippy responds using Gemini API with relevant suggestions and assistance

**Plans**: TBD

Plans:
- [ ] 06-01: TBD during planning
- [ ] 06-02: TBD during planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Desktop Shell & Window System | 0/TBD | Not started | - |
| 2. Notepad Application | 0/TBD | Not started | - |
| 3. Paint Application | 0/TBD | Not started | - |
| 4. File Explorer | 0/TBD | Not started | - |
| 5. Real-time Chatroom | 0/TBD | Not started | - |
| 6. LLM-Powered Clippy | 0/TBD | Not started | - |

---
*Roadmap created: 2025-01-31*
*Last updated: 2025-01-31*
