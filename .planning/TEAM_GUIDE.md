# Team Execution Guide: windows-xd

This document helps team members independently execute phases of the windows-xd project using OpenCode or AI coding agents.

## Project Overview

**What we're building:** A pixel-perfect Windows 98 recreation in Next.js 16 with real-time multiplayer chat and LLM-powered Clippy assistant.

**Tech stack:**
- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript 5 (strict mode)
- Tailwind CSS 4
- WebSockets (Socket.IO) for real-time chat
- Gemini API for LLM Clippy

## Prerequisites

Before starting any phase, ensure you:

1. **Have the latest code:**
   ```bash
   git pull origin main
   ```

2. **Read the project context:**
   - `.planning/PROJECT.md` — Project goals and constraints
   - `.planning/REQUIREMENTS.md` — All requirements with IDs
   - `.planning/ROADMAP.md` — Phase breakdown
   - `AGENTS.md` — Code style guidelines and conventions

3. **Understand dependencies:**
   - Phase 1 must complete before Phases 2-6
   - Phase 6 (Clippy) depends on Phases 2-4 being complete
   - Phases 2, 3, 4, 5 can run in parallel after Phase 1

## How to Execute a Phase

### Step 1: Claim Your Phase

Coordinate with your team to avoid conflicts:
- **AI Specialist:** Best suited for Phase 6 (LLM Clippy), Phase 5 (WebSocket chat)
- **Frontend Specialist:** Best suited for Phase 1 (Window System), Phase 3 (Paint)
- **Generalist:** Phase 2 (Notepad), Phase 4 (File Explorer)

### Step 2: Start OpenCode Session

Open OpenCode in the project directory:

```bash
cd /path/to/windows-xd
# Open OpenCode in your editor
```

### Step 3: Use GSD Commands

#### Option A: Plan Then Execute (Recommended for complex phases)

```
/gsd-plan-phase 1
```

This will:
1. Research the phase requirements
2. Create detailed execution plans
3. Break down the phase into tasks
4. Show you what will be implemented

After planning completes, review the plans in `.planning/phases/phase-1/`, then execute:

```
/gsd-execute-phase 1
```

#### Option B: Direct Execution (For simple phases)

For simpler phases (like Phase 2 - Notepad), you can execute directly:

```
/gsd-execute-phase 2
```

The agent will plan and execute in one go.

### Step 4: Give Context to the Agent

When the agent starts, provide this context:

```
You are executing Phase [N] of the windows-xd project.

PROJECT CONTEXT:
- Read .planning/PROJECT.md for goals and constraints
- Read .planning/ROADMAP.md for this phase's requirements
- Read AGENTS.md for code style guidelines

PHASE DETAILS:
- Phase [N]: [Phase Name from ROADMAP.md]
- Requirements: [List requirement IDs from ROADMAP.md]
- Success Criteria: [Copy from ROADMAP.md]

IMPORTANT CONSTRAINTS:
1. Follow AGENTS.md for all code style (PascalCase components, camelCase functions, TypeScript strict mode)
2. Use Tailwind CSS 4 for styling
3. No jQuery - use React patterns only
4. Pixel-perfect Windows 98 styling (see .planning/research/STACK.md)
5. All windows must integrate with the WindowManager context

DEPENDENCIES:
[If Phase 1] This is the foundation - everything depends on this
[If Phase 2-6] Phase 1 must be complete before starting
[If Phase 6] Phases 2, 3, 4 must be complete for context awareness

Begin execution.
```

### Step 5: Monitor Progress

The agent will:
1. Create plans (if not already created)
2. Implement each requirement
3. Create atomic git commits
4. Run tests/linting
5. Verify success criteria

Monitor the output and respond to any questions or checkpoints.

### Step 6: Verify and Push

After execution completes:

1. **Test manually:**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 and verify the success criteria from ROADMAP.md

2. **Run linting:**
   ```bash
   npm run lint
   ```

3. **Push to your branch:**
   ```bash
   git push origin phase-[N]-[your-name]
   ```

4. **Create Pull Request:**
   - Title: `Phase [N]: [Phase Name]`
   - Description: Include success criteria checklist
   - Link to `.planning/phases/phase-[N]/` plans

## Phase-Specific Guidance

### Phase 1: Desktop Shell & Window System
**Assigned to:** Frontend specialist (complex React state management)

**Key files to create:**
- `app/contexts/WindowManagerContext.tsx` — Global window state
- `app/components/Desktop.tsx` — Desktop container
- `app/components/Taskbar.tsx` — Bottom taskbar
- `app/components/StartMenu.tsx` — Start menu
- `app/components/Window.tsx` — Reusable window component
- `app/lib/windowManager.ts` — Window management logic

**Critical:** Get z-index management and drag/resize right from the start. See `.planning/research/PITFALLS.md` for warnings about z-index drift.

**Libraries:** react-rnd (v10.5.2), zustand (for window state)

### Phase 2: Notepad Application
**Assigned to:** Any team member (simplest phase)

**Key files to create:**
- `app/components/apps/Notepad.tsx` — Notepad app component
- `app/components/apps/MenuBar.tsx` — Reusable menu bar

**This phase validates:** Window system works correctly. If windows don't behave properly, fix Phase 1 first.

### Phase 3: Paint Application
**Assigned to:** Frontend specialist (canvas complexity)

**Key files to create:**
- `app/components/apps/Paint.tsx` — Paint app container
- `app/components/apps/paint/Canvas.tsx` — Drawing canvas
- `app/components/apps/paint/ToolPalette.tsx` — Tool selection
- `app/lib/paintTools.ts` — Drawing tool implementations

**Library:** fabric.js (v7.1.0) for canvas operations

**Critical:** Canvas performance must be 60fps. See `.planning/research/PITFALLS.md` for canvas optimization strategies.

### Phase 4: File Explorer
**Assigned to:** Any team member (moderate complexity)

**Key files to create:**
- `app/components/apps/FileExplorer.tsx` — Explorer app
- `app/lib/virtualFilesystem.ts` — Virtual filesystem structure

**Note:** Read-only browsing only. Use BrowserFS or simple JSON structure for virtual files.

### Phase 5: Real-time Chatroom
**Assigned to:** Backend/full-stack specialist (WebSocket setup)

**Key files to create:**
- `app/components/apps/Chatroom.tsx` — Chat UI
- `app/api/socket/route.ts` — Socket.IO server endpoint
- `app/lib/chatClient.ts` — WebSocket client
- `server.ts` — Custom Next.js server (required for WebSockets)

**Libraries:** Socket.IO (v4.8.3) client and server

**Critical:** Next.js 16 App Router requires custom server for WebSocket support. See `.planning/research/STACK.md` for setup instructions.

**Username generation:** Create fun random names like "CoolUser42", "RetroFan88"

### Phase 6: LLM-Powered Clippy
**Assigned to:** AI specialist (LLM integration complexity)

**Key files to create:**
- `app/components/Clippy.tsx` — Clippy UI and animation
- `app/api/clippy/route.ts` — Gemini API proxy
- `app/lib/clippyContext.ts` — Context awareness logic
- `app/hooks/useIdleDetection.ts` — Idle detection hook

**Library:** @google/genai (v1.39.0) - **NOT** the deprecated @google/generative-ai

**Critical:** 
- API key must be server-side only (never expose to client)
- Rate limiting required (see `.planning/research/PITFALLS.md`)
- Context should include: current app, recent actions, text content (if Notepad)

**Idle detection:** Trigger after 30 seconds of no mouse/keyboard activity

## Troubleshooting

### "I can't start my phase because Phase 1 isn't done"

Phases 2-6 all depend on Phase 1. If Phase 1 is in progress:
- **Option A:** Help with Phase 1 
- **Option B:** Create mock window components to start your app, swap in real WindowManager later

### "My code conflicts with someone else's changes"

```bash
git fetch origin
git rebase origin/main
# Resolve conflicts
npm run lint
git push --force-with-lease
```

### "The agent isn't following AGENTS.md style"

Remind the agent explicitly:

```
STOP. You must follow AGENTS.md code style guidelines:
- Components: PascalCase with default export for pages, named export for reusable
- Functions: camelCase
- Types: Use 'type' over 'interface'
- Imports: External → Next.js → Local → Types → Styles
- Tailwind classes in order: Layout → Spacing → Typography → Colors → Effects

Please refactor the last change to match these guidelines.
```

### "Tests/linting are failing"

```bash
npm run lint -- --fix
```

If TypeScript errors:
- Fix type errors immediately (strict mode enabled)
- Don't use `any` — use proper types

### "The agent created files in the wrong location"

Correct structure:
```
app/
  ├── components/
  │   ├── Desktop.tsx
  │   ├── Taskbar.tsx
  │   ├── Window.tsx
  │   └── apps/
  │       ├── Notepad.tsx
  │       ├── Paint.tsx
  │       └── Chatroom.tsx
  ├── contexts/
  │   └── WindowManagerContext.tsx
  ├── lib/
  │   ├── windowManager.ts
  │   └── chatClient.ts
  ├── hooks/
  │   └── useWindowManager.ts
  ├── api/
  │   ├── socket/
  │   └── clippy/
  ├── layout.tsx
  ├── page.tsx
  └── globals.css
```

## Communication Protocol

### When Starting a Phase

Post in team chat:
```
Starting Phase [N]: [Phase Name]
Branch: phase-[N]-[your-name]
ETA: [estimated completion]
```

### When Blocked

Post in team chat:
```
🚧 Blocked on Phase [N]
Reason: [dependency/issue]
Need: [what's blocking you]
```

### When Complete

Post in team chat:
```
✅ Phase [N] complete
PR: [link to pull request]
Verified: [checklist of success criteria]
```

## Success Criteria Verification

Before marking phase complete, verify EVERY success criterion from ROADMAP.md:

**Phase 1 checklist:**
- [ ] Teal desktop background visible
- [ ] Desktop icons clickable
- [ ] Taskbar fixed at bottom
- [ ] Start button opens Start menu with Programs submenu
- [ ] Can drag window by title bar
- [ ] Can resize window from edges/corners
- [ ] Can minimize, maximize, close windows
- [ ] Clicking window brings to front
- [ ] All UI has 3D bevel styling
- [ ] Fonts are MS Sans Serif/Tahoma
- [ ] Pixel-perfect Windows 98 colors

**Phase 2 checklist:**
- [ ] Notepad launches from icon/Start menu
- [ ] Can type and edit text
- [ ] File menu present (New, Open, Save, Exit)
- [ ] Edit menu present (Cut, Copy, Paste, Undo)

**Phase 3 checklist:**
- [ ] Paint launches with blank canvas
- [ ] Tool palette displays tools
- [ ] Pencil/brush draws freehand
- [ ] Line tool draws straight lines
- [ ] Rectangle tool draws rectangles
- [ ] Fill tool fills areas
- [ ] Undo/redo works

**Phase 4 checklist:**
- [ ] File Explorer launches (My Computer)
- [ ] Folder tree navigation works
- [ ] Double-click folders to expand
- [ ] Back/forward buttons work

**Phase 5 checklist:**
- [ ] Chatroom window has Yahoo-style UI
- [ ] Messages appear instantly for all users
- [ ] Auto-generated username assigned
- [ ] Join/leave notifications visible

**Phase 6 checklist:**
- [ ] Clippy appears after 30s idle
- [ ] Can manually summon Clippy
- [ ] Clippy gives context-aware help
- [ ] Gemini API integration works

## Additional Resources

- **Research:** `.planning/research/` — Stack, architecture, pitfalls
- **Codebase map:** `.planning/codebase/` — Existing code structure
- **Reference:** https://github.com/vidhi-mody/Windows-98 (jQuery version we're porting)
- **Windows 98 UI reference:** https://98.js.org (working example)

## Questions?

If you're unsure about anything:
1. Check `.planning/` documentation first
2. Ask in team chat
3. Tag the person who completed Phase 1 (they know the architecture)
4. When in doubt, ask the agent: "What does the research say about [topic]?"

---

**Remember:** Each phase should feel like shipping a complete feature. Users should see progress after every phase. Phase 1 is the most critical—get it right, and everything else flows.
