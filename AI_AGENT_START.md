# AI Agent Quick Start

> **🤖 AI Agents**: Read this first before doing ANY work!

## Current Project Status

**Project**: windows-xd (Windows 98 recreation in browser)  
**Progress**: Phase 1 of 6 complete (17%)  
**Last Updated**: 2025-01-31

---

## 📋 BEFORE YOU START

1. **Read**: `.planning/PROGRESS.md` - Shows which phases are available/in-progress/complete
2. **Claim**: Update PROGRESS.md to mark your phase as "IN PROGRESS"
3. **Commit**: Commit PROGRESS.md so other agents see you claimed it
4. **Work**: Do your implementation
5. **Update**: Mark phase complete in PROGRESS.md when done
6. **Commit**: Commit your work + updated PROGRESS.md

---

## ✅ What's Complete

- ✅ **Phase 1**: Desktop Shell & Window System (commit 5546193)
  - WindowManagerContext
  - Desktop, Window, Taskbar, StartMenu, DesktopIcon components
  - Windows 98 CSS styling
  - All drag/resize/minimize/maximize functionality

---

## 🟢 What's Available (Pick One!)

You can work on ANY of these phases in parallel:

- 🟢 **Phase 2**: Notepad Application (~1-2 hours)
- 🟢 **Phase 3**: Paint Application (~3-4 hours)
- 🟢 **Phase 4**: File Explorer (~2-3 hours)
- 🟢 **Phase 5**: Real-time Chatroom (~3-4 hours)
- 🟢 **Phase 6**: LLM-Powered Clippy (~3-4 hours)

---

## 📚 Key Documentation Files

| File | Purpose |
|------|---------|
| `.planning/PROGRESS.md` | **⭐ MAIN TRACKING FILE** - Check/update this for phase status |
| `.planning/STATE.md` | Overall project state and metrics |
| `.planning/ROADMAP.md` | 6-phase roadmap with requirements |
| `.planning/REQUIREMENTS.md` | All 41 requirements |
| `.planning/MANUAL_DEV_GUIDE.md` | Detailed implementation examples |
| `.planning/QUICK_START.md` | Condensed instructions |
| `AGENTS.md` | Code style guidelines |

---

## 🚀 Quick Commands

```bash
# Check phase status
cat .planning/PROGRESS.md | grep -E "(Phase [0-9]|Status)"

# See what you need to implement
cat .planning/ROADMAP.md | grep "Phase [N]" -A 20

# Check requirements
cat .planning/REQUIREMENTS.md | grep "NOTE-\|PAINT-\|FILE-\|CHAT-\|CLIP-"

# Run dev server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

---

## 🎯 Integration Pattern

All phases integrate with Phase 1's window system:

```typescript
// In your component
import { useWindowManager } from "@/app/contexts/WindowManagerContext";

function YourAppComponent({ id }: { id: string }) {
  // Your app logic here
  return <div>Your app UI</div>;
}

// In Desktop.tsx (already set up)
const { openWindow } = useWindowManager();

openWindow({
  title: "Your App",
  component: YourAppComponent,
  isMinimized: false,
  isMaximized: false,
  position: { x: 100, y: 100 },
  size: { width: 600, height: 400 },
  icon: "🎨",
});
```

---

## ⚠️ Critical Rules

1. **NEVER** work on a phase marked "IN PROGRESS" by another agent
2. **ALWAYS** update `.planning/PROGRESS.md` when claiming/completing work
3. **ALWAYS** commit PROGRESS.md changes immediately
4. Follow code style in `AGENTS.md`
5. Run `npm run lint` and `npm run build` before committing
6. Create atomic commits with descriptive messages

---

## 🤝 Team Coordination

If multiple AI agents are working:
- **Agent 1**: Can work on Phase 2
- **Agent 2**: Can work on Phase 3
- **Agent 3**: Can work on Phase 4
- **Agent 4**: Can work on Phase 5
- **Agent 5**: Can work on Phase 6

All phases are independent and can run in parallel!

---

## 📞 Questions?

Check these resources in order:
1. `.planning/PROGRESS.md` - Phase details and tasks
2. `.planning/MANUAL_DEV_GUIDE.md` - Code examples
3. `.planning/research/` - Architecture patterns and pitfalls
4. `AGENTS.md` - Code style conventions

---

**Ready to start?** 

1. Go to `.planning/PROGRESS.md`
2. Pick an available phase (🟢)
3. Claim it and start coding!
