# Quick Start Guide

**windows-xd** - A Windows 98 recreation in the browser with games, chat, and AI assistant.

---

## 🚀 Setup (First Time)

```bash
# Clone and setup
git clone <repo-url>
cd windows-xd
./setup.sh  # Automated setup (Mac/Linux)

# Or manually:
npm ci
cp .env.example .env.local
```

**Node.js Required**: v22.14.0+ (see `.nvmrc`)

---

## 🎮 Development

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Build for production
npm run lint     # Run linter
```

**Note**: This project uses a custom Next.js + Socket.IO server.

---

## 📁 Project Status

**V1 Complete** ✅ - Core desktop, apps, chat, Clippy (Phases 1-6)  
**V2 Ready** 🟢 - Games, polish, enhancements (Phases 7-15)

See `.planning/ROADMAP.md` for full roadmap.  
See `.planning/PROGRESS.md` for detailed status.

---

## 🎯 Hackathon Priority (5-7 days)

1. **Phase 7**: Minesweeper (1-2 days)
2. **Phase 9**: Virus Notification (1.5-2 days) 
3. **Phase 8**: Pinball (2-3 days)

---

## 📖 Key Files

| File | Purpose |
|------|---------|
| `ROADMAP.md` | Unified V1+V2 roadmap, all phases |
| `PROGRESS.md` | Phase completion tracker |
| `REQUIREMENTS.md` | Detailed feature requirements |
| `PROJECT.md` | Project overview and architecture |
| `STATE.md` | Current implementation state |

---

## 🔧 Important Notes

**Dependencies**:
- Always use `npm ci` (not `npm install`) after pulling
- `package-lock.json` locks exact versions

**Branching**:
- `main` - Production-ready code
- `chatroom` - Phase 5 (awaiting merge)
- Feature branches for new phases

**Safety**:
- Virus simulation is purely cosmetic (no filesystem/OS access)
- User can reload page anytime to escape

---

## 🎬 Demo Flow (3-5 minutes)

1. **Show desktop** (30s) - Window management, Start menu
2. **Open Minesweeper** (30s) - Classic gameplay
3. **Open Pinball** (45s) - Physics and scoring
4. **Virus notification appears** (90-120s) - Click "Run" → dramatic sequence
5. **Explain** (30s) - "All browser-based, completely safe!"

---

## ❓ Need Help?

- Check `ROADMAP.md` for phase details
- Check `PROGRESS.md` for what's implemented
- Check `REQUIREMENTS.md` for feature specs
- Check `AGENTS.md` for code style guidelines

---

**Ready to build!** 🚀
