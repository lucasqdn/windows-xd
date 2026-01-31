# Quick Start Guide: windows-xd

**TL;DR:** We're building Windows 98 in Next.js with 3 people. This is your cheat sheet.

---

## 📋 Phase Assignment (Work in This Order)

### Phase 1: Window System (MUST BE DONE FIRST)
**Assigned to:** Frontend lead  
**Time:** 1-2 weeks  
**Why first:** Everything else depends on this  

### After Phase 1 is done, work in parallel:

**Person 1 (AI Specialist):**
- Phase 5: Chatroom (WebSocket) — 3-5 days
- Phase 6: Clippy (Gemini AI) — 5-7 days

**Person 2 (Generalist):**
- Phase 2: Notepad — 1-2 days
- Phase 4: File Explorer — 2-3 days

**Person 3 (Frontend Lead):**
- Phase 3: Paint (fabric.js canvas) — 5-7 days

---

## 🚀 For YOU (Coordinating the project)

### Step 1: Share the repo
```bash
# Your teammates clone:
git clone <repo-url>
cd windows-xd
npm install
```

### Step 2: Tell them to read these files FIRST
1. `AGENTS.md` — Code style rules (REQUIRED)
2. `.planning/PROJECT.md` — What we're building
3. `.planning/ROADMAP.md` — Phase details
4. `.planning/MANUAL_DEV_GUIDE.md` — Implementation guide

### Step 3: Assign phases
Send each person their phase assignment:

**To AI Specialist:**
```
Your phases: 5 (Chatroom) and 6 (Clippy)

Wait until Phase 1 is complete, then start Phase 5.

Read:
- .planning/MANUAL_DEV_GUIDE.md → Phase 5 section (line ~800)
- .planning/MANUAL_DEV_GUIDE.md → Phase 6 section (line ~1000)

Key tasks:
- Phase 5: Set up custom Next.js server with Socket.IO
- Phase 6: Integrate Gemini API with rate limiting

Start with Phase 5 when Phase 1 merges.
```

**To Generalist:**
```
Your phases: 2 (Notepad) and 4 (File Explorer)

Wait until Phase 1 is complete, then start Phase 2.

Read:
- .planning/MANUAL_DEV_GUIDE.md → Phase 2 section (line ~450)
- .planning/MANUAL_DEV_GUIDE.md → Phase 4 section (line ~700)

Key tasks:
- Phase 2: Simple text editor with menus
- Phase 4: Virtual filesystem browser

Start with Phase 2 when Phase 1 merges.
```

**To Frontend Lead (or yourself):**
```
Your phases: 1 (Window System) and 3 (Paint)

Phase 1 is CRITICAL. Take your time.

Read:
- .planning/MANUAL_DEV_GUIDE.md → Phase 1 section (line ~150)
- .planning/MANUAL_DEV_GUIDE.md → Phase 3 section (line ~550)

Key tasks:
- Phase 1: WindowManager context, Desktop, Taskbar, Window component
- Phase 3: Canvas drawing with fabric.js

Start Phase 1 immediately. Phase 3 after Phase 1 merges.
```

---

## 💬 For YOUR TEAMMATES (Copy-paste instructions)

### Option A: Using AI Agent (OpenCode/Cursor/Copilot)

**Tell them to copy-paste this into their AI:**

```
I'm working on windows-xd (Windows 98 recreation in Next.js).

REQUIRED READING:
1. Read AGENTS.md for code style rules
2. Read .planning/PROJECT.md for project goals
3. Read .planning/REQUIREMENTS.md for my phase requirements
4. Read .planning/MANUAL_DEV_GUIDE.md for my phase implementation guide

MY PHASE: [Phase Number] - [Phase Name]

CONSTRAINTS:
- Follow AGENTS.md strictly (PascalCase components, camelCase functions, TypeScript strict mode)
- Use Tailwind CSS 4 for styling
- Windows 98 pixel-perfect styling (3D bevels, MS Sans Serif fonts, teal background)
- No jQuery — React patterns only

WHAT TO BUILD:
[See .planning/MANUAL_DEV_GUIDE.md Phase [N] section]

Let's start with [first component from the guide].
```

Then work through the phase step-by-step with the AI.

---

### Option B: Using GSD Framework (Automated)

**Tell them to run this in OpenCode:**

```bash
# Plan the phase (creates detailed tasks)
/gsd-plan-phase [N]

# Review the plan in .planning/phases/phase-[N]/

# Execute the phase (AI does everything)
/gsd-execute-phase [N]
```

The AI will:
1. Read all context
2. Create components
3. Make commits
4. Run tests
5. Ask for approval at checkpoints

---

## 🎯 Phase-Specific Quick Instructions

### Phase 1: Window System (Frontend Lead)

**What to build:**
```
1. app/contexts/WindowManagerContext.tsx — Global window state
2. app/components/Desktop.tsx — Teal background, renders icons
3. app/components/Window.tsx — Draggable window with react-rnd
4. app/components/Taskbar.tsx — Bottom bar with Start button
5. app/components/StartMenu.tsx — Classic Windows menu
6. app/components/DesktopIcon.tsx — Clickable icons
7. app/globals.css — Add Windows 98 3D bevel CSS
```

**Key libraries:**
```bash
npm install react-rnd zustand
```

**Critical code pattern (Z-index management):**
```typescript
// app/contexts/WindowManagerContext.tsx
const focusWindow = (id: string) => {
  const sorted = [...windows].sort((a, b) => a.zIndex - b.zIndex);
  setWindows(sorted.map((w, i) => ({
    ...w,
    zIndex: w.id === id ? sorted.length : i
  })));
};
```

**Test before moving on:**
- [ ] Can drag windows
- [ ] Can resize windows
- [ ] Windows come to front when clicked
- [ ] Minimize/maximize/close work
- [ ] Start menu opens

---

### Phase 2: Notepad (Generalist)

**What to build:**
```
1. app/components/apps/Notepad.tsx — Text editor
2. app/components/apps/MenuBar.tsx — Reusable menu bar
3. Register in Desktop.tsx to launch on icon click
```

**Key code:**
```typescript
// Notepad.tsx
const [text, setText] = useState('');
const handleCopy = () => navigator.clipboard.writeText(text);
// ... etc
```

**Test:**
- [ ] Can type text
- [ ] Cut/copy/paste work
- [ ] Menus show properly

---

### Phase 3: Paint (Frontend Lead)

**What to build:**
```
1. app/components/apps/Paint.tsx — Container
2. app/components/apps/paint/Canvas.tsx — fabric.js canvas
3. app/components/apps/paint/ToolPalette.tsx — Tool buttons
4. app/lib/paintTools.ts — Drawing functions
```

**Key libraries:**
```bash
npm install fabric
```

**Key code:**
```typescript
import { fabric } from 'fabric';

useEffect(() => {
  const canvas = new fabric.Canvas(canvasRef.current, {
    width: 800,
    height: 600
  });
  return () => canvas.dispose();
}, []);
```

**Test:**
- [ ] Can draw with pencil
- [ ] Can draw lines/rectangles
- [ ] Undo/redo works
- [ ] No lag (60fps)

---

### Phase 4: File Explorer (Generalist)

**What to build:**
```
1. app/components/apps/FileExplorer.tsx — Main component
2. app/lib/virtualFilesystem.ts — Mock file tree
3. app/components/apps/explorer/FolderTree.tsx — Tree view
```

**Key code:**
```typescript
// virtualFilesystem.ts
export const virtualFS = {
  name: 'My Computer',
  type: 'folder',
  children: [
    { name: 'C:', type: 'folder', children: [...] }
  ]
};
```

**Test:**
- [ ] Folder tree shows
- [ ] Can expand/collapse folders
- [ ] Back/forward buttons work

---

### Phase 5: Chatroom (AI Specialist)

**What to build:**
```
1. server.ts — Custom Next.js server with Socket.IO
2. app/components/apps/Chatroom.tsx — Chat UI
3. app/hooks/useChat.ts — WebSocket hook
4. Update package.json scripts
```

**Key libraries:**
```bash
npm install socket.io socket.io-client
npm install --save-dev tsx
```

**Critical setup:**
```javascript
// server.ts
import { Server } from 'socket.io';
const io = new Server(server);

io.on('connection', (socket) => {
  const username = `CoolUser${Math.floor(Math.random() * 100)}`;
  socket.on('message', (msg) => {
    io.emit('message', { username, text: msg });
  });
});
```

**package.json:**
```json
{
  "scripts": {
    "dev": "tsx server.ts"
  }
}
```

**Test:**
- [ ] Server starts
- [ ] Messages send instantly
- [ ] Open 2 browser windows — both see messages

---

### Phase 6: Clippy (AI Specialist)

**What to build:**
```
1. app/api/clippy/route.ts — Gemini API proxy
2. app/components/Clippy.tsx — Clippy UI
3. app/hooks/useIdleDetection.ts — Idle timer
4. app/lib/clippyContext.ts — Context collector
5. .env.local — API key (NEVER commit this)
```

**Key libraries:**
```bash
npm install @google/generative-ai
```

**Critical setup:**
```typescript
// app/api/clippy/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { context, prompt } = await request.json();
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent([context, prompt]);
  return Response.json({ response: result.response.text() });
}
```

**.env.local:**
```
GEMINI_API_KEY=your_key_here
```

**Test:**
- [ ] Clippy appears after 30s idle
- [ ] Gemini responds (not errors)
- [ ] API key never visible in browser

---

## ✅ Testing Checklist (Before Creating PR)

Each person runs these before saying "I'm done":

```bash
# 1. Lint check
npm run lint

# 2. Build check
npm run build

# 3. Manual test
npm run dev
# Visit http://localhost:3000
# Test your phase requirements

# 4. Check the phase checklist in MANUAL_DEV_GUIDE.md
```

---

## 🔄 Git Workflow

**Create branch:**
```bash
git checkout -b feature/phase-[N]-[your-name]
```

**Make commits:**
```bash
git add [files]
git commit -m "feat(phase-N): description"
```

**Push and PR:**
```bash
git push origin feature/phase-[N]-[your-name]
# Then create Pull Request on GitHub
```

---

## 💡 Common Issues

### "AI isn't following AGENTS.md style"
Tell the AI:
```
STOP. You violated AGENTS.md rules:
- Components must be PascalCase
- Functions must be camelCase  
- Use 'type' not 'interface'
- Import order: external → Next.js → local → types → styles

Please refactor.
```

### "TypeScript errors"
```bash
# See what's wrong:
npm run build

# Fix strict mode errors:
# - No 'any' types
# - Add proper types: const x: string = ""
# - Check for null: if (window) { ... }
```

### "Phase 1 isn't done yet, what do I do?"
**Wait.** Phase 1 is the foundation. You can:
- Read the docs
- Set up your dev environment
- Study the MANUAL_DEV_GUIDE.md for your phase
- Review Windows 98 screenshots for styling reference

### "I'm stuck"
1. Check `.planning/MANUAL_DEV_GUIDE.md` for your phase
2. Check `.planning/research/PITFALLS.md` for known issues
3. Ask in team chat
4. Ask the AI: "What does the research say about [topic]?"

---

## 📞 Team Communication

**Format for status updates:**

**Starting:**
```
🚀 Starting Phase [N]: [Name]
Branch: feature/phase-[N]-[name]
ETA: [date]
```

**Blocked:**
```
🚧 Blocked on Phase [N]
Reason: [why]
Need: [what would unblock]
```

**Complete:**
```
✅ Phase [N] complete
PR: [link]
All tests passed ✓
```

---

## 🎮 After v1 Ships

Once all 6 phases are done, we move to v2:
- Polish & animations
- More Paint tools
- Enhanced chat (user list, history)
- Games (Minesweeper, Solitaire)
- Clippy personality modes

See `.planning/ROADMAP_V2.md` for details.

---

## 🔗 Quick Links

- **Code style:** `AGENTS.md`
- **What we're building:** `.planning/PROJECT.md`
- **All requirements:** `.planning/REQUIREMENTS.md`
- **Phase details:** `.planning/ROADMAP.md`
- **How to build each phase:** `.planning/MANUAL_DEV_GUIDE.md`
- **v2 features:** `.planning/ROADMAP_V2.md`
- **Tech research:** `.planning/research/STACK.md`
- **Architecture patterns:** `.planning/research/ARCHITECTURE.md`
- **Common mistakes:** `.planning/research/PITFALLS.md`

---

## 📦 Complete Command Reference

```bash
# Setup
git clone <repo>
cd windows-xd
npm install

# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Check code style

# Git workflow
git checkout -b feature/phase-N-name
git add .
git commit -m "feat: description"
git push origin feature/phase-N-name

# GSD Framework (optional)
/gsd-plan-phase N    # Plan phase
/gsd-execute-phase N # Execute phase
```

---

## 🎯 Success Criteria

**v1 is done when:**
- [ ] All 6 phases complete
- [ ] Can open Notepad, Paint, File Explorer, Chatroom
- [ ] Clippy responds with AI help
- [ ] Looks pixel-perfect Windows 98
- [ ] No console errors
- [ ] No performance issues

**Ship it! 🚀**

---

**Questions?** Check the detailed guides in `.planning/` or ask in team chat.
