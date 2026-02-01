# V3 Roadmap: Games & Virus Simulation

## Overview

V3 adds three major features to windows-xd:
1. **Classic Windows 98 Minesweeper** - Authentic recreation with timer and flag counter
2. **Windows 98 Pinball** - "Space Cadet" style pinball with physics and sounds
3. **Virus Simulation** - Cosmetic "infection" sequence for hackathon demo effect

**Target**: Hackathon demo (public)
**Safety**: All features are purely cosmetic browser-based simulations with no filesystem/OS access

---

## Phase Overview

| Phase | Feature | Complexity | Duration Estimate | Status |
|-------|---------|------------|-------------------|--------|
| Phase 7 | Minesweeper | Medium | 4-6 hours | 🟢 Available |
| Phase 8 | Pinball | High | 8-12 hours | 🟢 Available |
| Phase 9 | Virus Simulation | High | 6-10 hours | 🟢 Available |

**Total Estimated Time**: 18-28 hours

---

## Phase 7: Minesweeper 💣

### Goal
Users can play classic Windows 98 Minesweeper with authentic look and feel.

### Dependencies
- Phase 1 (Desktop Shell) ✅

### Requirements

**MINE-01**: Game Board
- Classic Windows 98 3D inset border styling
- Three difficulty levels:
  - Beginner: 9×9 grid, 10 mines
  - Intermediate: 16×16 grid, 40 mines
  - Expert: 30×16 grid, 99 mines
- First-click guarantee (never mine on first reveal)

**MINE-02**: Game Mechanics
- Left-click to reveal cells
- Right-click to flag/unflag cells
- Middle-click or left+right click to chord (reveal neighbors if flags match number)
- Flood-fill reveal for empty cells
- Number displays (1-8) with authentic Windows 98 colors

**MINE-03**: UI Elements
- Smiley face button (happy → worried on click → dead/sunglasses on result)
- Mine counter (displays remaining mines = total - flags placed)
- Timer (starts on first click, stops on win/lose)
- Menu bar (Game → New, Beginner, Intermediate, Expert, Exit)

**MINE-04**: Win/Lose Conditions
- **Win**: All non-mine cells revealed
- **Lose**: Mine clicked reveals all mines
- Show winning time and ask for name (high scores)
- Auto-flag remaining cells on win

### Success Criteria
1. ✅ User can select difficulty and start new game
2. ✅ User can reveal cells, flag mines, and chord
3. ✅ Timer and mine counter update correctly
4. ✅ Win/lose detection works with proper animations
5. ✅ Smiley face changes expression based on game state
6. ✅ High scores persist in localStorage

### Technical Implementation

**Files to Create:**
- `app/components/apps/Minesweeper.tsx` - Main game component
- `app/lib/minesweeper.ts` - Game logic (grid generation, reveal, flood-fill)
- `app/styles/minesweeper.css` - Windows 98 styling
- `app/hooks/useMinesweeperGame.ts` - Game state management

**Key Features:**
- Pure function game logic (testable)
- Canvas or DOM-based grid (DOM recommended for accessibility)
- Keyboard support (arrow keys + space/f)
- Touch support for mobile demos

**Assets Needed:**
- Smiley face sprites (3 states: happy, worried, dead/sunglasses)
- Mine icon
- Flag icon
- Number colors (1=blue, 2=green, 3=red, 4=dark blue, 5=dark red, 6=cyan, 7=black, 8=gray)

---

## Phase 8: Pinball 🎯

### Goal
Users can play a Windows 98 "Space Cadet" style pinball game with physics, scoring, and sounds.

### Dependencies
- Phase 1 (Desktop Shell) ✅

### Requirements

**PINBALL-01**: Game Table
- Isometric/top-down pinball table view
- Authentic Windows 98 Pinball visual style
- Fixed table with defined physics boundaries
- Plunger mechanism at bottom-right

**PINBALL-02**: Physics & Controls
- Ball physics (gravity, bounce, friction)
- Two flippers (left/right) controlled by keyboard
  - Left flipper: Z or Left Arrow
  - Right flipper: / or Right Arrow
  - Plunger: Spacebar (hold and release)
- Ball-flipper collision with realistic bounce
- Ball-bumper collision with score multipliers
- Ball drains at bottom (lose ball)

**PINBALL-03**: Scoring Elements
- Bumpers (500-1500 points)
- Targets (300-1000 points)
- Lanes and gates (bonus multipliers)
- Rollover lanes (light sequences)
- Score display in HUD
- High score persistence (localStorage)

**PINBALL-04**: Game Flow
- 3 balls per game
- Launch ball with plunger
- Ball save for first 5 seconds after launch
- Tilt detection (excessive nudging = ball lost)
- Extra ball rewards at certain scores

**PINBALL-05**: Audio & Visual Effects
- Flipper sounds (mechanical clack)
- Bumper hit sounds (ding/boing)
- Score tally sounds
- Background music (looping, can mute)
- Particle effects for bumper hits

**PINBALL-06**: UI Elements
- Score display (large, top-left)
- High score display
- Ball indicator (balls remaining)
- Pause button
- Help/Instructions overlay

### Success Criteria
1. ✅ User can launch ball and control flippers
2. ✅ Ball physics feel responsive and realistic
3. ✅ Scoring works for all table elements
4. ✅ Sounds play on interactions
5. ✅ Game tracks 3 balls and ends properly
6. ✅ High score persists across sessions

### Technical Implementation

**Files to Create:**
- `app/components/apps/Pinball.tsx` - Main game component
- `app/lib/pinball/physics.ts` - Physics engine (ball, collisions)
- `app/lib/pinball/table.ts` - Table definition (bumpers, flippers, etc.)
- `app/lib/pinball/scoring.ts` - Score calculation
- `app/hooks/usePinballGame.ts` - Game state and loop
- `app/styles/pinball.css` - Styling

**Key Features:**
- Canvas-based rendering (HTML5 Canvas or WebGL)
- 60 FPS physics loop (requestAnimationFrame)
- Matter.js or custom physics engine (recommend custom for control)
- Web Audio API for sounds
- Keyboard and touch controls

**Assets Needed:**
- Pinball table background image
- Flipper sprites
- Ball sprite
- Bumper sprites (animated)
- Sound effects (flipper, bumper, launch, drain, etc.)
- Background music (optional)

**Physics Notes:**
- Use simple circle-polygon collision detection
- Elastic collisions with adjustable restitution
- Angular velocity for ball spin
- Gravity constant and friction coefficients

---

## Phase 9: Virus Simulation 🦠

### Goal
Create a dramatic, purely cosmetic "virus infection" sequence for hackathon demo wow-factor.

### Dependencies
- Phase 1 (Desktop Shell) ✅

### ⚠️ CRITICAL SAFETY REQUIREMENTS

**THIS IS A COSMETIC BROWSER SIMULATION ONLY:**
- ❌ NO filesystem access (no file reads, writes, deletes, encryption)
- ❌ NO actual OS shutdown commands
- ❌ NO network requests (no data exfiltration, no C&C communication)
- ❌ NO localStorage clearing without explicit user action
- ✅ ALL effects contained within the browser window
- ✅ User can reload page at any time to escape
- ✅ Clear disclaimer before launching: "This is a simulation for demonstration purposes"

**For Hackathon Demo:**
- Must have visible warning before launch
- Must be obviously a demo/simulation to judges and audience
- Recommended: Add watermark "SIMULATION" during sequence

### Requirements

**VIRUS-01**: Infection Trigger
- Desktop icon labeled "DO NOT OPEN" or "virus.exe"
- Clicking icon shows confirmation dialog:
  - "Warning: This will start a simulated virus infection. This is a harmless demo. Continue?"
  - [Cancel] [Launch Simulation]

**VIRUS-02**: Stage 1 - Silent Infection (10 seconds)
- Nothing visible happens
- Optional: subtle audio cue (faint glitching sound)
- Status indicator hidden from user (internal state tracking)

**VIRUS-03**: Stage 2 - Spawn Phase (5 seconds per virus)
- Butterflies appear one by one across the screen
- Purple gorilla virus icons appear one by one
- Spawn timing: 1 virus every 5 seconds
- Number of viruses: 4-6 total (mix of butterflies and gorillas)
- Viruses appear randomly positioned over windows
- Viruses use CSS animations (floating, wiggling)

**VIRUS-04**: Stage 3 - Glitch Phase (starts 5 seconds after all spawned)
- Windows start shaking (CSS transform animations)
- Random window movements (slight position shifts)
- Color glitches (CSS filters: hue-rotate, invert, contrast)
- Screen static overlay (animated PNG or CSS noise)
- Increasing intensity over 5 seconds
- Audio: glitch/static sounds

**VIRUS-05**: Stage 4 - Shutdown Simulation (8 seconds after glitch starts)
- "Windows is shutting down..." overlay appears
- Fade to black screen (2 seconds)
- Complete blackout (3 seconds of black screen)
- No user interaction during this phase

**VIRUS-06**: Stage 5 - Ransomware UI
- Red/black themed fullscreen overlay
- Authentic-looking ransomware message:
  ```
  YOUR FILES HAVE BEEN ENCRYPTED!
  
  All your important files have been encrypted with military-grade
  encryption. Your photos, documents, databases are no longer accessible.
  
  There is only one way to recover your files:
  Pay 0.5 BTC ($45,000) to the following address:
  [fake Bitcoin address]
  
  You have 48 hours before the decryption key is destroyed forever.
  
  DO NOT attempt recovery - this will corrupt your files permanently.
  DO NOT contact authorities - we are monitoring your system.
  
  [Contact Us] [FAQ] [Pay Now]
  ```
- Fake countdown timer (48:00:00 → 47:59:59...)
- Skull/lock icon imagery
- Flashing red borders

**VIRUS-07**: Recovery/Reset
- User can reload page to reset (works at any time)
- Optional: Hidden key combo (Ctrl+Shift+R) shows "Simulation Complete" message
- Optional: Auto-recovery after 30 seconds with "SIMULATION COMPLETE - Thank you for watching" message

### Success Criteria
1. ✅ Clicking virus icon starts sequence with warning
2. ✅ 10-second silent delay works
3. ✅ Viruses spawn at correct intervals (5s each)
4. ✅ Windows glitch realistically without breaking functionality
5. ✅ Shutdown simulation looks convincing
6. ✅ Ransomware UI is impressive and realistic
7. ✅ User can escape by reloading at any time
8. ✅ No actual harm done to system or files

### Technical Implementation

**Files to Create:**
- `app/components/apps/VirusSimulation.tsx` - Main simulation controller
- `app/lib/virus/sequencer.ts` - Stage timing and progression
- `app/lib/virus/effects.ts` - Visual effects (glitch, shake, etc.)
- `app/components/virus/VirusSprite.tsx` - Butterfly/gorilla animated sprites
- `app/components/virus/RansomwareScreen.tsx` - Final ransomware UI
- `app/styles/virus.css` - Glitch and ransomware styling
- `public/assets/virus/` - Sprite images and sounds

**Key Features:**
- State machine for stage progression
- Timer-based stage transitions
- CSS animation overlays (non-blocking)
- Fullscreen API for blackout (with fallback)
- Audio cues (Web Audio API)
- localStorage for tracking if user has seen warning

**Stage Timing Breakdown:**
```
T=0s:     User clicks icon
T=0s:     Warning dialog shown
T=0s:     User confirms → Start Stage 1
T=0-10s:  Stage 1 (silent)
T=10s:    First virus spawns
T=15s:    Second virus spawns
T=20s:    Third virus spawns
T=25s:    Fourth virus spawns
T=30s:    (5s after last spawn) Glitch phase starts
T=35s:    Glitch intensifies
T=38s:    (8s after glitch) Shutdown message appears
T=40s:    Fade to black begins
T=42s:    Complete black screen
T=45s:    Ransomware UI appears
T=45s+:   Stays until user reloads
```

**Assets Needed:**
- Butterfly sprite (animated GIF or sprite sheet) - will use placeholder
- Purple gorilla sprite (animated GIF or sprite sheet) - will use placeholder
- Static/glitch overlay images
- Skull/lock icons for ransomware screen
- Sound effects:
  - Ambient glitch sound
  - Static/interference
  - Shutdown sound
  - Ominous tone for ransomware

**CSS Effects:**
```css
/* Window shake */
@keyframes shake {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-5px, 5px); }
  50% { transform: translate(5px, -5px); }
  75% { transform: translate(-5px, -5px); }
}

/* Color glitch */
.glitch-effect {
  animation: glitch 0.3s infinite;
  filter: hue-rotate(90deg) contrast(1.5);
}

/* Screen static */
.static-overlay {
  background-image: url('/assets/virus/static.gif');
  opacity: 0.3;
  mix-blend-mode: overlay;
}
```

### Safety Documentation

**File to Create:**
- `.planning/VIRUS_SIMULATION_SAFETY.md` - Detailed safety documentation

**Must Include:**
- List of all effects (visual only)
- Confirmation of no FS/network access
- Code review checklist
- Disclaimer text for UI
- Instructions for disabling feature

---

## Implementation Order & Dependencies

```
Phase 1 (Desktop) ✅
    │
    ├─→ Phase 7 (Minesweeper) [Independent]
    ├─→ Phase 8 (Pinball)      [Independent]
    └─→ Phase 9 (Virus)        [Independent]
```

**Recommended Order:**
1. **Phase 7** first - Simplest, good warmup, tests game integration
2. **Phase 8** second - More complex, builds on game patterns
3. **Phase 9** last - Most complex, needs careful implementation and testing

**Parallel Development:**
- All 3 phases can be developed on separate branches simultaneously
- Suggested branches: `v3-minesweeper`, `v3-pinball`, `v3-virus`
- Merge to `v3` branch for integration testing
- Final merge to `main` after hackathon-ready

---

## Testing & QA

### Per-Phase Testing

**Minesweeper:**
- Test all 3 difficulties
- Test edge cases (corner reveals, chord mistakes)
- Test timer accuracy
- Test high score persistence
- Cross-browser testing

**Pinball:**
- Test ball physics (no clipping through objects)
- Test flipper timing and responsiveness
- Test scoring accuracy
- Test audio playback
- Performance test (60 FPS maintained)

**Virus Simulation:**
- Test stage timing accuracy
- Test effects don't break underlying desktop
- Test recovery/reload works
- Test on different screen sizes
- **CRITICAL**: Security audit - verify no FS/network access

### Integration Testing

**Test Matrix:**
- Can Minesweeper run while Pinball is open?
- Does Virus simulation affect open game windows?
- Do games persist state when minimized?
- Touch controls work on mobile?

### Hackathon Demo Checklist

- [ ] All 3 features work in Chrome (primary demo browser)
- [ ] Features work in Firefox and Safari
- [ ] Mobile responsive (games scale properly)
- [ ] Audio works (with fallback for autoplay restrictions)
- [ ] Virus simulation has clear warnings
- [ ] Load times under 3 seconds
- [ ] No console errors
- [ ] README updated with v3 features
- [ ] Demo script prepared (show minesweeper → pinball → virus in sequence)

---

## Asset Requirements Summary

### Minesweeper
- ✅ Can use CSS/Unicode for most elements
- Optional: Custom number fonts

### Pinball
- ⚠️ Needs placeholder table background
- ⚠️ Needs placeholder sound effects
- Can use CSS for most UI elements

### Virus Simulation
- ⚠️ **Needs placeholder sprites:**
  - Butterfly (animated)
  - Purple gorilla (animated)
- ⚠️ Needs placeholder sounds
- Can use CSS for glitch effects

**Placeholder Strategy:**
- Use emoji/Unicode initially (🦋 for butterfly, 🦍 for gorilla)
- Use CSS animations for movement
- Use Web Audio API to generate sounds programmatically
- Swap with real assets before hackathon if available

---

## Timeline Estimate

**Aggressive (hackathon crunch):**
- Phase 7: 1 day
- Phase 8: 2 days
- Phase 9: 1.5 days
- Testing/polish: 0.5 days
- **Total: 5 days**

**Comfortable:**
- Phase 7: 2 days
- Phase 8: 3 days
- Phase 9: 2 days
- Testing/polish: 1 day
- **Total: 8 days**

---

## Success Metrics

**For Hackathon:**
1. ✅ All 3 features fully functional
2. ✅ No crashes or console errors during demo
3. ✅ Virus simulation "wow factor" achieved
4. ✅ Games are playable and fun
5. ✅ Demo flows smoothly (3-5 minute presentation)
6. ✅ Code is clean enough for judges to review
7. ✅ Safety documentation present and clear

---

## Next Steps

1. **Create detailed PLAN.md files** for each phase (3 files)
2. **Set up v3 branch** and phase sub-branches
3. **Create asset directories** and README for placeholders
4. **Write safety documentation** for virus simulation
5. **Begin Phase 7** (Minesweeper) implementation

**Ready to proceed?** Should I create the detailed implementation plans now?
