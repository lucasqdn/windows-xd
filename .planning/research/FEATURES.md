# Feature Research

**Domain:** Windows 98 Desktop Recreation (Browser-based)
**Researched:** January 31, 2026
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Desktop with icons | Core metaphor of Windows 98 | LOW | Teal (#008080) background, grid-aligned icons |
| Taskbar with Start button | Primary navigation interface | MEDIUM | Includes clock, system tray, window buttons |
| Start menu | How users launch programs | MEDIUM | Hierarchical menus (Programs submenu), Shut Down |
| Window management (drag/resize) | Core windowing system | HIGH | Must support drag, resize, minimize, maximize, close, z-index |
| Window chrome (title bar, borders) | Visual identity of Windows 98 | MEDIUM | 3D bevel styling, system icons, window buttons |
| Classic 3D beveled UI | Signature Windows 98 aesthetic | MEDIUM | White top/left borders, dark bottom/right borders |
| Authentic fonts (MS Sans Serif) | Breaks immersion if wrong | LOW | Must use actual Windows fonts, not modern alternatives |
| Double-click to open | Standard desktop interaction | LOW | Icons require double-click, not single click |
| Minimize animation | Visual feedback for state changes | MEDIUM | Animates window to taskbar button |
| Focus management | Only one window active at a time | MEDIUM | Blue title bar when focused, gray when unfocused |
| Mouse cursor change | Visual feedback on hover | LOW | Pointer on buttons, resize cursors on edges |
| Notepad | Expected basic text editor | LOW | Simple text editing, no persistence needed for v1 |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| LLM-powered Clippy | Modern AI twist on nostalgic character | HIGH | Contextual help, idle detection, personality |
| Real-time multiplayer chatroom | Social dimension missing from other recreations | HIGH | Yahoo-style retro chat, WebSocket-based |
| Visible online user list | Creates sense of community | LOW | Shows who else is experiencing nostalgia |
| Auto-generated fun usernames | No auth friction, adds personality | LOW | CoolUser42, RetroFan88 style names |
| Chat history (session-scoped) | Better UX than starting from blank | MEDIUM | New users see recent messages, returning users see full session |
| Paint application | Creative tool, nostalgia multiplier | HIGH | Core tools: pencil, line, rectangle, fill, color picker |
| File Explorer | Exploration experience | MEDIUM | Read-only browsing of predefined folders |
| Pixel-perfect accuracy | Most recreations are "inspired by", not authentic | MEDIUM | Exact colors, fonts, spacing from Windows 98 |
| Theme loading (.theme files) | 98.js has this; powerful nostalgia feature | COMPLEX | Runtime theme switching, but defer to v2 |
| Clippy summoned on idle | Proactive AI assistance | LOW | Appears when user seems stuck (idle detection) |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Data persistence across sessions | "Why can't I save my work?" | Adds complexity (database, auth), breaks ephemeral vibe | Ephemeral sessions are feature not bug — matches retro chatroom vibe |
| Multiple chatrooms | "I want private conversations" | Splits community, adds UI complexity | Single public room creates shared experience (v1) |
| Draggable desktop icons | "Real Windows 98 had this" | Complex collision detection, state management | Double-click to launch is sufficient for v1 |
| Full Windows 98 game suite | "Where's Minesweeper?" | Each game is significant effort | Core desktop + 1-2 apps proves concept (defer games to v2) |
| Full Paint feature set | "I want text tool and spray paint" | Paint is already complex enough | Core drawing tools sufficient to prove concept |
| File creation in File Explorer | "I want to make folders" | Requires virtual filesystem, persistence | Read-only browsing sufficient for exploration |
| Authentication system | "I want my own identity" | Adds friction, requires infrastructure | Auto-generated usernames are fun and frictionless |
| Modern UI conveniences | "Add dark mode / mobile responsive" | Breaks authentic Windows 98 aesthetic | Authenticity over modernization is the point |

## Feature Dependencies

```
Desktop Environment (Core Layer)
    ├──requires──> Window Management System
    │                  ├──requires──> Drag & Resize Logic
    │                  ├──requires──> Z-index Management
    │                  └──requires──> Focus Management
    │
    ├──requires──> Taskbar
    │                  ├──requires──> Start Menu
    │                  ├──requires──> Window Buttons (minimize targets)
    │                  └──requires──> System Tray (clock)
    │
    └──requires──> Desktop Icons
                       └──requires──> Double-click Detection

Applications (App Layer) — all depend on Window Management System
    ├─> Notepad (simplest app, good first implementation)
    ├─> File Explorer (depends on virtual filesystem data structure)
    ├─> Paint (most complex app, depends on canvas API)
    └─> Chatroom (depends on WebSocket connection)

Multiplayer Features (Enhancement Layer)
    ├─> Chatroom Window
    │       ├──requires──> WebSocket connection
    │       ├──requires──> Username generator
    │       └──requires──> Message history state
    │
    └─> Clippy
            ├──requires──> Gemini API integration
            ├──requires──> Idle detection logic
            └──enhances──> all applications (contextual help)
```

### Dependency Notes

- **Window Management System is foundational** — Nothing works without it
- **Notepad before Paint** — Simplest app to validate window system
- **File Explorer requires data structure** — Need to define folder tree first
- **Chatroom requires WebSocket infra** — Can develop UI first, connect later
- **Clippy can be added last** — Enhances but doesn't block core features
- **Paint is most complex** — Canvas drawing, tool state, color picker

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [x] Desktop with teal background and grid of icons
- [x] Taskbar with Start button, clock, and minimize targets
- [x] Start menu with Programs submenu and Shut Down
- [x] Window management (drag, resize, minimize, maximize, close, z-index)
- [x] Classic 3D bevel styling throughout
- [x] Authentic Windows 98 fonts (MS Sans Serif)
- [x] Notepad with text editing (no save/load)
- [x] File Explorer with read-only folder browsing
- [x] Paint with core tools (pencil, line, rectangle, fill, color picker)
- [x] Real-time chatroom with WebSocket
- [x] Auto-generated usernames
- [x] Online user list
- [x] Chat history (session-scoped)
- [x] LLM-powered Clippy with Gemini API
- [x] Clippy appears on idle detection or manual summon

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] Theme loading (.theme/.themepack files) — 98.js has this working
- [ ] More desktop icons (My Computer, Recycle Bin, Network Neighborhood)
- [ ] Screensaver activation after idle period
- [ ] Sound effects (startup sound, error beep, etc.)
- [ ] More Start menu items (Settings, Find, Run)
- [ ] System properties dialog
- [ ] About Windows dialog
- [ ] Help system (basic CHM-style help viewer)

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Classic games (Minesweeper, Solitaire, FreeCell)
- [ ] 3D Pipes screensaver
- [ ] Full Paint feature set (text tool, spray paint, stamps)
- [ ] Internet Explorer with iframe for web browsing
- [ ] Winamp music player
- [ ] Calculator
- [ ] Multiple chatrooms or private messaging
- [ ] Room-based multiplayer games
- [ ] Data persistence (requires auth + database)
- [ ] Mobile responsive version (breaks authenticity)
- [ ] Custom user-uploaded themes

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Desktop + Taskbar + Start | HIGH | MEDIUM | P1 |
| Window Management System | HIGH | HIGH | P1 |
| Authentic Visual Styling | HIGH | MEDIUM | P1 |
| Notepad | MEDIUM | LOW | P1 |
| File Explorer | MEDIUM | MEDIUM | P1 |
| Chatroom (basic) | HIGH | MEDIUM | P1 |
| Auto-generated usernames | MEDIUM | LOW | P1 |
| Paint (core tools) | MEDIUM | HIGH | P1 |
| Clippy (basic AI) | HIGH | MEDIUM | P1 |
| Idle detection for Clippy | MEDIUM | LOW | P1 |
| Theme loading | HIGH | HIGH | P2 |
| Sound effects | MEDIUM | LOW | P2 |
| Games (Minesweeper, etc.) | HIGH | HIGH | P2 |
| Screensaver | LOW | MEDIUM | P3 |
| More system dialogs | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for launch (in scope for initial milestone)
- P2: Should have, add when possible (v1.x enhancements)
- P3: Nice to have, future consideration (v2+)

## Competitor Feature Analysis

Comparison with major Windows 98 recreation projects:

| Feature | 98.js (1j01) | Windows 95 (Electron) | v86 (emulator) | windows-xd (this project) |
|---------|--------------|----------------------|----------------|--------------------------|
| **Core Desktop** |
| Desktop icons | ✓ | ✓ | ✓ (full OS) | ✓ |
| Taskbar | ✓ | ✓ | ✓ (full OS) | ✓ |
| Start menu | ✓ | ✓ | ✓ (full OS) | ✓ |
| Window management | ✓ | ✓ | ✓ (full OS) | ✓ |
| **Applications** |
| Notepad | ✓ | ✓ | ✓ (full OS) | ✓ |
| Paint | ✓ (separate repo) | ✗ | ✓ (full OS) | ✓ |
| File Explorer | ✓ | ✓ | ✓ (full OS) | ✓ |
| Calculator | ✓ | ✗ | ✓ (full OS) | ✗ (defer to v2) |
| Minesweeper | ✓ | ✗ | ✓ (full OS) | ✗ (defer to v2) |
| Solitaire | ✓ | ✗ | ✓ (full OS) | ✗ (defer to v2) |
| **Special Features** |
| Theme loading | ✓ (.theme/.themepack) | ✗ | ✗ | ✗ (defer to v1.x) |
| Sound effects | ✓ | ✗ | ✓ (full OS) | ✗ (defer to v1.x) |
| Screensaver | ✓ (3D Pipes) | ✗ | ✓ (full OS) | ✗ (defer to v1.x) |
| Virtual filesystem | ✓ (BrowserFS) | ✓ (emulator) | ✓ (full OS) | ✓ (read-only) |
| **Differentiators** |
| LLM-powered assistant | ✗ | ✗ | ✗ | ✓ (Clippy with Gemini) |
| Real-time multiplayer | ✗ | ✗ | ✗ | ✓ (chatroom) |
| Online user list | ✗ | ✗ | ✗ | ✓ |
| Auto-generated usernames | ✗ | ✗ | ✗ | ✓ |
| **Technical Approach** |
| Implementation | Vanilla JS + jQuery | Electron + v86 emulator | x86 emulator | Next.js 16 + React 19 |
| Runs real Windows? | ✗ (recreation) | ✓ (full emulation) | ✓ (full emulation) | ✗ (recreation) |
| Browser-based | ✓ | ✗ (desktop app) | ✓ | ✓ |

### Key Insights from Competitors

**98.js strengths:**
- Most complete browser-based recreation (1.4k stars)
- Includes many apps (Notepad, Paint, Calculator, games)
- Theme loading is killer feature
- Help system with CHM viewer
- Virtual filesystem with BrowserFS

**98.js gaps (our opportunities):**
- No multiplayer/social features
- No AI assistant
- No modern twist (purely nostalgic)

**Windows 95 Electron strengths:**
- Runs actual Windows 95 (full emulation via v86)
- Includes all original software
- Desktop app with native performance

**Windows 95 Electron gaps:**
- Desktop app, not web
- No social features
- Large download (full OS image)

**v86 strengths:**
- Runs many operating systems (not just Windows)
- Most authentic (actual OS emulation)
- Active development

**v86 gaps:**
- Heavy/slow (full x86 emulation)
- No social features
- Primarily for preservation, not entertainment

**Our competitive advantage:**
- **Only recreation with multiplayer** — chatroom creates shared nostalgic experience
- **LLM-powered Clippy** — modern AI twist on beloved character
- **Next.js/React architecture** — easier to extend than vanilla JS
- **Focused scope** — core experience with key apps, not everything

## Implementation Complexity Notes

### Simple (1-2 days)
- Desktop background and icon grid
- Taskbar layout
- Start menu structure
- System tray clock
- Notepad text editor
- Username generator
- Basic Clippy dialog

### Medium (3-5 days)
- Window drag & resize logic
- Window minimize/maximize/restore
- Z-index and focus management
- Start menu interactions (hover, click, submenus)
- File Explorer folder tree rendering
- Chatroom UI and message display
- WebSocket connection setup
- Idle detection for Clippy

### Complex (1-2 weeks)
- Full window management system (all behaviors coordinated)
- Paint application (canvas, tools, color picker, drawing state)
- Gemini API integration for Clippy (prompt engineering, streaming)
- Chat history management (session-scoped, new vs returning users)
- Theme loading system (parse .theme files, apply CSS)
- 3D bevel CSS rendering (pixel-perfect)
- Authentic font loading and fallbacks

## Sources

**Competitor Analysis:**
- 98.js: https://github.com/1j01/98 (1.4k stars, MIT license pending)
  - Demo: https://98.js.org
  - Includes: Notepad, Paint, Sound Recorder, Calculator, Explorer, Games
  - Features: Theme loading, Help system, Virtual filesystem, Screensavers
  
- OS-GUI library: https://github.com/1j01/os-gui (232 stars, MIT license)
  - Powers 98.js windowing system
  - Provides: MenuBar, $Window, button styles, scrollbars, theme parsing
  
- Windows 95 Electron: https://github.com/felixrieseberg/windows95 (23.9k stars)
  - Full Windows 95 emulation via v86
  - Desktop app (macOS, Windows, Linux)
  - Includes all original software
  
- v86: https://copy.sh/v86/ (emulator for multiple OSes)
  - Powers Windows 95 Electron
  - Supports Windows 98, DOS, Linux, BSD, and more

**Reference Implementation:**
- Windows-98 jQuery: https://github.com/vidhi-mody/Windows-98
  - Original inspiration for windows-xd project
  - jQuery/vanilla JS approach

**User Expectations from Windows 98:**
- Observed from 98.js feature set and community engagement
- HIGH confidence for table stakes (desktop, taskbar, windows, classic apps)
- MEDIUM confidence for nice-to-have features (themes, screensavers, games)

---
*Feature research for: Windows 98 Desktop Recreation*
*Researched: January 31, 2026*
