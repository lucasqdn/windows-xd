# Unified Roadmap: windows-xd

**Last Updated**: 2026-01-31

## Project Status

**V1 Complete**: Core Windows 98 desktop experience (Phases 1-6) ✅  
**V2 In Progress**: Games, Polish, Advanced Features (Phases 7-15)

---

## Quick Overview

| Phase | Feature | Status | Priority | Estimated Time |
|-------|---------|--------|----------|----------------|
| 1-6 | V1 Core Desktop | ✅ COMPLETE | - | DONE |
| 7 | Minesweeper | 🟢 Ready | High | 4-6 hours |
| 8 | Pinball | 🟢 Ready | High | 8-12 hours |
| 9 | Virus Notification | 🟢 Ready | High | 6-10 hours |
| 10 | Polish & Animations | 🟢 Ready | Medium | 5-7 days |
| 11 | Advanced Paint Tools | 🟢 Ready | Medium | 7-10 days |
| 12 | Enhanced Chatroom | 🟢 Ready | Medium | 5-7 days |
| 13 | Solitaire | 🟢 Ready | Low | 5-7 days |
| 14 | Clippy Enhancements | 🟢 Ready | Low | 7-10 days |
| 15 | System Features | 🟢 Ready | Low | 5-7 days |
| 16 | Internet Explorer | 🟢 Ready | Low | 7-10 days |

**Legend**: 🟢 Ready to start | 🔵 In Progress | ✅ Complete

---

## V1 - Core Desktop (Complete) ✅

All 6 phases complete:
1. ✅ Desktop Shell & Window System
2. ✅ Notepad Application (basic)
3. ✅ Paint Application (basic)
4. ✅ File Explorer (basic)
5. ✅ Real-time Chatroom (on chatroom branch)
6. ✅ LLM-Powered Clippy

See `PROGRESS.md` for detailed V1 status.

---

## V2 - Games & Enhancements

### 🎮 Priority 1: Games (Hackathon Focus)

#### Phase 7: Minesweeper 💣
**Time**: 4-6 hours | **Priority**: High

Classic Windows 98 Minesweeper with authentic styling.

**Features**:
- 3 difficulties: Beginner (9×9, 10 mines), Intermediate (16×16, 40 mines), Expert (30×16, 99 mines)
- Windows 98 UI: smiley face button, mine counter, timer
- Gameplay: left-click reveal, right-click flag, chord (reveal neighbors)
- Flood-fill for empty cells
- First-click guarantee (never mine on first click)
- High scores in localStorage

**Files to Create**:
- `app/components/apps/Minesweeper.tsx`
- `app/lib/minesweeper.ts` (game logic)
- `app/hooks/useMinesweeperGame.ts`
- `app/styles/minesweeper.css`

---

#### Phase 8: Pinball 🎯
**Time**: 8-12 hours | **Priority**: High

Windows 98 "Space Cadet" inspired pinball game.

**Features**:
- Ball physics: gravity, bounce, friction, spin
- Controls: Left flipper (Z/←), Right flipper (//→), Plunger (Space)
- Table elements: bumpers (500-1500 pts), targets, lanes, gates
- Game flow: 3 balls, ball save, tilt detection, extra ball rewards
- Audio: flipper clacks, bumper dings, score beeps, background music
- UI: score, high score, balls remaining, pause button
- 60 FPS canvas rendering

**Files to Create**:
- `app/components/apps/Pinball.tsx`
- `app/lib/pinball/physics.ts`
- `app/lib/pinball/table.ts`
- `app/lib/pinball/scoring.ts`
- `app/hooks/usePinballGame.ts`
- `app/styles/pinball.css`

---

#### Phase 9: Virus Notification Prank 🦠
**Time**: 6-10 hours | **Priority**: High

**NEW APPROACH**: Hilarious notification-based infection simulator.

**Trigger Mechanism**:
After ~40 seconds of browsing the desktop, a Windows 98 notification appears in the system tray (bottom-right):

```
┌─────────────────────────────────────────┐
│  🔔 Windows Update                      │
├─────────────────────────────────────────┤
│                                         │
│  New software has been automatically    │
│  installed on your computer:            │
│                                         │
│     "Definitely_Not_A_Virus.exe"       │
│                                         │
│  This software promises to:             │
│  • Make your computer 1000x faster     │
│  • Delete all your problems            │
│  • Definitely NOT steal your data      │
│                                         │
│  Would you like to run it now?         │
│                                         │
│  [ Run ] [ Cancel ]                     │
└─────────────────────────────────────────┘
```

**Hilarious Variations** (randomized):
1. **Option 1**: "You've won a FREE iPad! Click Run to claim your prize!"
2. **Option 2**: "URGENT: Your computer has 374 viruses. Run cleaner now?"
3. **Option 3**: "Hot singles in your area want to meet you. Run now?"
4. **Option 4**: "Congratulations! You're the 1,000,000th visitor. Run to claim $$$!"
5. **Option 5**: "Definitely_Not_A_Virus.exe wants your permission to run. Trust me, I'm legit!"

**User Actions**:
- **Click "Cancel"**: Notification closes, comes back in 30 seconds with different message
- **Click "Run"**: Virus simulation starts immediately

**Infection Sequence** (after clicking "Run"):
1. **Stage 1** (0-10s): Silent infection, subtle audio
2. **Stage 2** (10-30s): 🦋 Butterflies and 🦍 purple gorillas spawn (one every 5s)
3. **Stage 3** (30-38s): Windows glitch (shake, color distortions, static)
4. **Stage 4** (38-45s): Shutdown simulation ("Windows is shutting down...")
5. **Stage 5** (45s+): Windows 98 styled ransomware UI with countdown, file list, Bitcoin address

**Safety**:
- ✅ Purely cosmetic browser simulation
- ✅ NO filesystem/network/OS access
- ✅ User can reload page anytime to escape
- ✅ Clear disclaimer in notification

**Files to Create**:
- `app/components/system/VirusNotification.tsx` (notification popup)
- `app/components/virus/VirusSimulation.tsx` (main controller)
- `app/lib/virus/sequencer.ts` (stage timing)
- `app/lib/virus/effects.ts` (visual glitch effects)
- `app/components/virus/VirusSprite.tsx` (butterfly/gorilla sprites)
- `app/components/virus/RansomwareScreen.tsx` (final Windows 98 ransomware UI)
- `app/components/virus/ShutdownScreen.tsx` (shutdown animation)
- `app/styles/virus.css`

**Timing Config**:
```typescript
const VIRUS_TIMING = {
  notificationDelay: 40000, // 40s after page load
  silentInfection: 10000,   // 10s silent
  virusSpawnInterval: 5000, // 5s per virus
  glitchDuration: 8000,     // 8s glitch phase
  shutdownDuration: 7000,   // 7s shutdown
};
```

---

### 🎨 Priority 2: Polish & UX

#### Phase 10: Polish & Animations
**Time**: 5-7 days | **Priority**: Medium

Add smooth animations and sound effects.

**Features**:
- Smooth minimize/maximize window animations (scale effects)
- Sound effects: window open, close, minimize, maximize, error, startup
- Animated Start menu expansion (slide/fade)
- Theme system: High Contrast, Brick, Rainy Day (3+ themes)
- Instant theme switching

**Files**:
- `app/styles/animations.css`
- `app/lib/themes.ts`
- `app/hooks/useTheme.ts`
- `app/components/ThemeSwitcher.tsx`

---

#### Phase 11: Advanced Paint Tools
**Time**: 7-10 days | **Priority**: Medium

Expand Paint with advanced features.

**Features**:
- Custom color picker dialog (RGB sliders)
- 28-color Windows 98 palette
- Text tool with font selection
- Selection tools (rectangle select, lasso)
- Copy/paste with clipboard
- Marching ants animation on selections
- Undo/redo system
- Shape tools (rectangle, circle, line)

**Files**:
- Update `app/components/apps/Paint.tsx`
- `app/lib/paint/tools.ts`
- `app/components/paint/ColorPicker.tsx`
- `app/components/paint/TextTool.tsx`

---

#### Phase 12: Enhanced Chatroom
**Time**: 5-7 days | **Priority**: Medium

Add presence and history features to chat.

**Features**:
- Message history (last 50 messages for new users)
- Full session history for returning users
- Typing indicators ("User is typing...")
- User avatars (randomly assigned Windows 98 user icons)
- Real-time user list updates

**Files**:
- Update `server.ts` (add history, typing events)
- Update `app/components/apps/ChatRoom.tsx`
- `app/lib/chat/history.ts`

---

### 🃏 Priority 3: Additional Games & Features

#### Phase 13: Solitaire
**Time**: 5-7 days | **Priority**: Low

Classic Klondike Solitaire.

**Features**:
- Drag-and-drop cards between piles
- Double-click auto-move to foundation
- Deck cycling (draw 1 or draw 3 modes)
- Win animation (cascading cards)
- Undo functionality
- Timer and score tracking

**Files**:
- `app/components/apps/Solitaire.tsx`
- `app/lib/solitaire.ts` (game logic)
- `app/styles/solitaire.css`

---

#### Phase 14: Clippy Enhancements
**Time**: 7-10 days | **Priority**: Low

Add personality and animations to Clippy.

**Features**:
- Animated paperclip sprite (appearing, speaking, idle, looking around)
- Context-specific suggestions ("I see you're drawing...", "Writing a document?")
- Conversation history scrollback
- Personality modes: Helpful, Snarky, Minimal (user selectable)
- Right-click menu to change personality

**Files**:
- Update `app/components/Clippy.tsx`
- `app/components/clippy/Animation.tsx`
- `app/lib/clippy/personalities.ts`

---

#### Phase 15: System Features
**Time**: 5-7 days | **Priority**: Low

Add system-level features.

**Features**:
- Control Panel (Display, Sound, Mouse settings)
- Theme changes via Control Panel
- Functional "It's now safe to turn off your computer" screen
- Right-click desktop context menus (Refresh, Properties, New Folder)
- Right-click window title bar menus (Restore, Move, Size, Close)
- Window icons in title bars and taskbar

**Files**:
- `app/components/apps/ControlPanel.tsx`
- `app/components/system/ContextMenu.tsx` (update existing)
- `app/components/system/ShutdownScreen.tsx`

---

## Implementation Strategy

### For Hackathon (Quick Win):
1. **Phase 7** - Minesweeper (1-2 days)
2. **Phase 9** - Virus Notification (1.5-2 days)
3. **Phase 8** - Pinball (2-3 days)
4. **Demo Ready** - 5-7 days total

### Full V2 (Long Term):
**Week 1-2**: Phases 7, 8, 9 (Games + Virus)  
**Week 3-4**: Phases 10, 11, 12 (Polish + Advanced Features)  
**Week 5-6**: Phases 13, 14, 15 (Additional Content)

---

#### Phase 16: Internet Explorer
**Time**: 7-10 days | **Priority**: Low

Classic Internet Explorer 5 browser window with functional web browsing.

**Features**:
- Authentic IE5 UI: Address bar, navigation buttons (Back, Forward, Stop, Refresh, Home)
- Toolbar: File, Edit, View, Favorites, Tools, Help menus
- Status bar with loading progress and security indicator
- Favorites/Bookmarks system (localStorage)
- History tracking (session-based)
- Iframe-based content rendering
- Classic IE blue "e" icon
- "This page cannot be displayed" error page
- Loading spinner animation
- Multiple tabs (optional enhancement)

**Restrictions**:
- Same-origin policy (can only load external sites that allow iframes)
- Pre-configured "safe" sites list (Wikipedia, Archive.org, etc.)
- Warning dialog for external navigation
- No actual browser engine (uses iframe + restrictions)

**Files to Create**:
- `app/components/apps/InternetExplorer.tsx`
- `app/lib/browser/navigation.ts`
- `app/lib/browser/favorites.ts`
- `app/components/browser/AddressBar.tsx`
- `app/components/browser/FavoritesMenu.tsx`
- `app/styles/internet-explorer.css`

---

## Deferred Features (Future V3)

These are intentionally out of scope:
- User accounts and authentication
- Cloud save/sync
- Multiplayer games
- Multiple chatrooms
- Private messaging
- Mobile responsive design
- Winamp music player
- Screen savers

---

## Success Metrics

**Hackathon Demo**:
- ✅ All 3 priority games work (Minesweeper, Pinball, Virus)
- ✅ No crashes during 5-minute demo
- ✅ Virus notification gets laughs
- ✅ "Wow factor" achieved

**Full V2**:
- ✅ Animations smooth (60fps)
- ✅ Users play games (high engagement)
- ✅ Chat shows sustained activity
- ✅ "Feels just like Windows 98" feedback

---

## Asset Strategy

**Using Placeholders Initially**:
- 🦋 Emoji butterflies with CSS animations
- 🦍 Emoji gorillas with purple CSS filter
- CSS-generated glitch/static effects
- Web Audio API for sounds (synthesized)
- Pure CSS for all Windows 98 UI elements

**Can swap with real assets later** (optional).

---

## Quick Commands

```bash
# Start development
npm run dev

# Run tests
npm test

# Check current phase status
cat .planning/PROGRESS.md

# View detailed requirements
cat .planning/REQUIREMENTS.md
```

---

**Ready to build!** Start with Phase 7 (Minesweeper) or Phase 9 (Virus Notification) for maximum hackathon impact. 🚀
