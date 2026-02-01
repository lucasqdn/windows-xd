# V3 Phase Summaries

## Quick Overview

**V3 Goals**: Add games and dramatic virus simulation for hackathon demo
**Total Time**: 18-28 hours (5-8 days)
**Safety**: All features are browser-only simulations, no real harm
**Assets**: Using emoji/CSS placeholders initially

---

## Phase 7: Minesweeper 💣

**Estimated Time**: 4-6 hours (1-2 days)

### What You're Building
A pixel-perfect recreation of classic Windows 98 Minesweeper with all authentic features.

### Key Features
- **3 Difficulty Levels**:
  - Beginner: 9×9 grid, 10 mines
  - Intermediate: 16×16 grid, 40 mines
  - Expert: 30×16 grid, 99 mines
  
- **Core Gameplay**:
  - Left-click to reveal cells
  - Right-click to flag/unflag suspected mines
  - Chord (reveal neighbors when flags match number)
  - Flood-fill automatic reveal for empty cells
  
- **Windows 98 UI**:
  - Smiley face button (changes expression: happy → worried → dead/sunglasses)
  - Mine counter (shows remaining unflagged mines)
  - Timer (starts on first click)
  - 3D inset borders and authentic colors
  - Menu bar (Game → New, difficulties, Exit)
  
- **Features**:
  - First-click guarantee (never hit mine on first reveal)
  - High scores saved in localStorage
  - Win animation and name entry
  - Keyboard support (arrow keys + space/f)

### Files to Create
- `app/components/apps/Minesweeper.tsx` - Main component
- `app/lib/minesweeper.ts` - Pure game logic
- `app/hooks/useMinesweeperGame.ts` - State management
- `app/styles/minesweeper.css` - Windows 98 styling

### Success = 
User can play complete games on all difficulties with authentic Windows 98 feel.

---

## Phase 8: Pinball 🎯

**Estimated Time**: 8-12 hours (2-3 days)

### What You're Building
A Windows 98 "Space Cadet" inspired pinball game with realistic physics and scoring.

### Key Features
- **Physics-Based Gameplay**:
  - Realistic ball physics (gravity, bounce, friction, spin)
  - Two flippers controlled by keyboard
    - Left: Z or Left Arrow
    - Right: / or Right Arrow
  - Plunger to launch ball (hold Spacebar, release)
  - Ball drains at bottom (lose ball)
  
- **Table Elements**:
  - Bumpers (bounce ball, award points)
  - Targets (hit for points)
  - Lanes and gates (multipliers)
  - Rollover lanes (light up sequences)
  
- **Scoring System**:
  - Bumpers: 500-1500 points
  - Targets: 300-1000 points
  - Bonus multipliers for combos
  - Extra ball rewards at milestones
  
- **Game Flow**:
  - 3 balls per game
  - Ball save (5 seconds after launch)
  - Tilt detection (excessive nudging loses ball)
  - High score persistence
  
- **Audio & Effects**:
  - Flipper clack sounds
  - Bumper ding/boing sounds
  - Score tally beeps
  - Background music (mutable)
  - Particle effects on hits
  
- **UI**:
  - Large score display (top-left)
  - High score display
  - Ball indicator (3 → 2 → 1)
  - Pause button
  - Help overlay with controls

### Files to Create
- `app/components/apps/Pinball.tsx` - Main component
- `app/lib/pinball/physics.ts` - Physics engine
- `app/lib/pinball/table.ts` - Table layout
- `app/lib/pinball/scoring.ts` - Score calculation
- `app/hooks/usePinballGame.ts` - Game loop
- `app/styles/pinball.css` - Styling

### Technical Notes
- Canvas-based rendering (60 FPS)
- Custom physics engine (circle-polygon collisions)
- Web Audio API for sounds
- RequestAnimationFrame game loop
- Touch support for mobile demos

### Success = 
User can play complete games with responsive controls, realistic ball physics, and satisfying scoring.

---

## Phase 9: Virus Simulation 🦠

**Estimated Time**: 6-10 hours (1.5-2 days)

### What You're Building
A dramatic, purely cosmetic "virus infection" sequence that simulates malware for hackathon wow-factor. **NO ACTUAL HARM - 100% SAFE.**

### The Complete Sequence (53+ seconds)

#### Stage 1: Silent Infection (T=0 to T=10s)
- User clicks "DO NOT OPEN" or "virus.exe" desktop icon
- Warning dialog appears: "This is a simulation. Continue?"
- After confirmation, nothing visible happens for 10 seconds
- Optional: subtle audio (faint glitching)

#### Stage 2: Spawn Phase (T=10s to T=30s)
- Viruses appear one-by-one every 5 seconds:
  - 🦋 Butterflies (emoji with CSS animations)
  - 🦍 Purple gorillas (emoji with purple CSS filter)
  - Total: 4-6 viruses spawned
- Viruses float/wiggle randomly across the screen
- Positioned over open windows

#### Stage 3: Glitch Phase (T=30s to T=38s)
- Windows start shaking (CSS transform animations)
- Random window movements (slight position shifts)
- Color distortions (hue-rotate, invert, contrast filters)
- Screen static overlay (CSS-generated noise)
- Audio: glitch/static sounds intensify
- Effects increase in intensity over 8 seconds

#### Stage 4: Shutdown Simulation (T=38s to T=45s)
- "Windows is shutting down..." message appears (T=38s)
- Windows 98 style shutdown screen
- Fade to black (2 seconds, T=40-42s)
- Complete blackscreen (3 seconds, T=42-45s)
- Shutdown sound plays

#### Stage 5: Ransomware Screen (T=45s+)
**Windows 98 styled ransomware UI - MAXIMUM REALISM**

**Visual Style**:
- Classic Windows 98 dialog box (gray #C0C0C0)
- Blue title bar: "⚠️ WINDOWS SECURITY ALERT - CRITICAL ERROR"
- Blinking red critical icon in title bar
- MS Sans Serif font (Windows 98 system font)
- 3D raised borders on buttons
- Windows 98 style list boxes

**Message Content** (extremely realistic):
```
╔════════════════════════════════════════════╗
║  YOUR FILES HAVE BEEN ENCRYPTED            ║
║                                            ║
║  All data encrypted with RSA-2048 + AES    ║
║                                            ║
║  • Documents, photos - LOCKED              ║
║  • Databases, spreadsheets - LOCKED        ║
║  • System files - LOCKED                   ║
║                                            ║
║  Payment Required:                         ║
║  Amount: 0.5 BTC (~$45,000 USD)           ║
║  Address: 1BvBMSEYstWetqTFn5Au4m4GFg7...  ║
║                                            ║
║  ⏱️ Time Remaining: 47:59:43              ║
║                                            ║
║  After 48 hours, decryption key deleted    ║
║  FOREVER. No recovery possible.            ║
║                                            ║
║  WARNING: DO NOT:                          ║
║  ✗ Shut down (files corrupted)            ║
║  ✗ Remove hard drive (data destroyed)     ║
║  ✗ Run antivirus (triggers deletion)      ║
║  ✗ Contact authorities (we will know)     ║
║                                            ║
║  Files encrypted: 24,847 (43.7 GB)         ║
║  PC ID: 7F4A-89B2-C3D1-5E6A                ║
╚════════════════════════════════════════════╝
```

**Interactive Elements**:
- Countdown timer ticking down realistically (47:59:59 → 47:59:58...)
- Encrypted file list showing fake Windows paths:
  ```
  C:\My Documents\Tax_Returns_2024.xls
  C:\My Documents\Photos\Wedding\IMG001.jpg
  C:\Desktop\Passwords.txt
  ... (237 more files)
  ```
- Windows 98 buttons:
  - [View Encrypted Files]
  - [How To Pay?]
  - [Contact Support (24/7)]
  - [Pay Now]
- Buttons show fake loading states when clicked (non-functional)
- System beep sound on appearance (Windows 98 critical alert)

### Recovery
- **User can reload page at ANY TIME to escape**
- Optional: Auto-recovery after 30 seconds with "SIMULATION COMPLETE" message
- Optional: Hidden key combo (Ctrl+Shift+R) to exit early

### Safety Guarantees (CRITICAL)
- ✅ **NO filesystem access** (no file reads, writes, deletes, encryption)
- ✅ **NO actual OS shutdown** (browser overlay only)
- ✅ **NO network requests** (no data sent anywhere)
- ✅ **NO localStorage clearing** without permission
- ✅ **ALL effects contained in browser window**
- ✅ **Clear "SIMULATION" warning before launch**
- ✅ **User can reload to escape at any time**

### Files to Create
- `app/components/apps/VirusSimulation.tsx` - Main controller
- `app/lib/virus/sequencer.ts` - Stage timing state machine
- `app/lib/virus/effects.ts` - Visual effects
- `app/components/virus/VirusSprite.tsx` - Emoji virus sprites
- `app/components/virus/RansomwareScreen.tsx` - Win98 ransomware UI
- `app/components/virus/ShutdownScreen.tsx` - Shutdown animation
- `app/styles/virus.css` - Glitch and Windows 98 styling
- `.planning/VIRUS_SIMULATION_SAFETY.md` - Safety documentation

### Assets (All Placeholders)
- 🦋 Butterfly emoji with CSS float animation
- 🦍 Gorilla emoji with CSS purple filter + wiggle animation
- CSS-generated static/noise overlay
- Web Audio API for all sounds (synthesized)
- Pure CSS for Windows 98 UI (no images needed)

### Success = 
Convincing, dramatic sequence that looks realistic but is 100% safe and reversible.

---

## Summary Comparison

| Phase | Complexity | Time | Type | Wow Factor |
|-------|------------|------|------|------------|
| **Phase 7** | Medium | 4-6h | Game | ⭐⭐⭐ Classic fun |
| **Phase 8** | High | 8-12h | Game | ⭐⭐⭐⭐ Impressive physics |
| **Phase 9** | High | 6-10h | Effect | ⭐⭐⭐⭐⭐ MAXIMUM IMPACT |

---

## Implementation Strategy

**For Hackathon Success**:
1. **Week 1**: Phase 7 (Minesweeper) - Quick win, validates game integration
2. **Week 1-2**: Phase 8 (Pinball) - Most time-intensive, start early
3. **Week 2**: Phase 9 (Virus) - Final dramatic touch before demo

**Demo Order**:
1. Show Minesweeper (30 seconds) - "Classic games work"
2. Show Pinball (45 seconds) - "Physics and effects work"
3. **Show Virus simulation (1-2 minutes)** - "SHOCKING finale"
4. Explain: "All browser-based, completely safe!"

**Judges will remember**: The ransomware simulation. Make it the centerpiece.

---

## Asset Status

✅ **All placeholders ready for implementation**:
- Emoji sprites (🦋 🦍)
- CSS animations
- Web Audio API sounds
- Pure CSS Windows 98 UI

🎨 **Optional real assets** (can add later):
- Custom butterfly/gorilla GIFs
- Sound effect files (WAV/MP3)
- Pinball table artwork

---

## Ready to Build? 🚀

Your v3 roadmap is complete and updated with maximum realism for the virus simulation while maintaining 100% safety.

**Next steps**:
1. Choose which phase to start with (recommend: Phase 7 Minesweeper)
2. Create `v3` branch
3. Start implementation

**Want me to start building Phase 7 now?**
