# Roadmap v2: windows-xd

## Overview

This is the v2 roadmap for windows-xd, building on the completed v1 foundation. v1 delivers the core Windows 98 desktop experience with basic apps and multiplayer chat. v2 adds polish, games, advanced features, and system-level enhancements to create a richer, more complete Windows 98 recreation.

**v1 Completion Required:** All v1 phases (1-6) must be complete and shipped before starting v2.

## v2 Philosophy

v2 focuses on:
1. **Polish** — Animations, sounds, themes that enhance the retro feel
2. **Games** — Classic Windows games (Minesweeper, Solitaire, Pinball)
3. **Chat Enhancements** — User list, message history, typing indicators
4. **Paint Enhancements** — Color pickers, selection tools, text tool
5. **System Features** — Control Panel, context menus, functional Shut Down
6. **Clippy Personality** — Animations, conversation history, personality modes

## v2 Phases

- [ ] **Phase 7: Polish & Animations** - UI animations and sound effects
- [ ] **Phase 8: Advanced Paint Tools** - Color pickers, selection, text
- [ ] **Phase 9: Enhanced Chatroom** - User list, history, typing indicators
- [ ] **Phase 10: Classic Games** - Minesweeper and Solitaire
- [ ] **Phase 11: Clippy Enhancements** - Animations and personality
- [ ] **Phase 12: System Features** - Control Panel and context menus

## Phase Details

### Phase 7: Polish & Animations
**Goal**: Add smooth animations and sound effects to create a more polished retro experience

**Depends on**: v1 complete (Phases 1-6)

**Requirements**: WIN-08, DESK-07, MENU-05, STYLE-05

**v2 Requirements**:
- [ ] **WIN-08**: Smooth animations during minimize/maximize transitions
- [ ] **DESK-07**: Sound effects on UI actions (clicks, opens, closes)
- [ ] **MENU-05**: Animated menu expansion when opening Start menu
- [ ] **STYLE-05**: Theme loading system to switch color schemes

**Success Criteria**:
1. Windows smoothly animate when minimizing to taskbar (scale down effect)
2. Windows smoothly animate when maximizing to fullscreen (scale up effect)
3. Sound effects play on: window open, close, minimize, maximize, error, startup
4. Start menu smoothly slides/fades in when opened
5. User can select from 3+ Windows 98 themes (High Contrast, Brick, Rainy Day)
6. Theme changes apply instantly to all UI elements

**Complexity**: Medium (CSS animations, audio API, theme system architecture)

**Estimated effort**: 5-7 days

---

### Phase 8: Advanced Paint Tools
**Goal**: Expand Paint with color selection, text, and copy/paste capabilities

**Depends on**: Phase 3 (Paint basics) complete

**Requirements**: PAINT-08, PAINT-09, PAINT-10, PAINT-11, PAINT-12

**v2 Requirements**:
- [ ] **PAINT-08**: Color picker for choosing custom colors
- [ ] **PAINT-09**: Color palette for quick color selection
- [ ] **PAINT-10**: Text tool for adding text to canvas
- [ ] **PAINT-11**: Selection tools (rectangle select, lasso)
- [ ] **PAINT-12**: Copy/paste functionality

**Success Criteria**:
1. User can open color picker dialog to select custom RGB colors
2. Color palette displays 28 standard Windows 98 colors for quick selection
3. User can select text tool, click canvas, and type text with chosen font/color
4. User can select rectangular areas with selection tool
5. User can cut/copy selection and paste elsewhere on canvas
6. Selection shows marching ants animation (classic Windows style)

**Complexity**: Medium-High (fabric.js custom tools, clipboard API)

**Estimated effort**: 7-10 days

---

### Phase 9: Enhanced Chatroom
**Goal**: Add user presence, message history, and typing indicators to chatroom

**Depends on**: Phase 5 (Chatroom basics) complete

**Requirements**: CHAT-05, CHAT-06, CHAT-07, CHAT-08

**v2 Requirements**:
- [ ] **CHAT-05**: Online user list showing all connected users
- [ ] **CHAT-06**: Message history (recent for new users, full session for returning users)
- [ ] **CHAT-07**: Typing indicators showing when users are typing
- [ ] **CHAT-08**: User avatars or profile pictures

**Success Criteria**:
1. Chat window displays online user list with usernames and count
2. New users see last 50 messages on joining
3. Returning users (same session/tab) see their full conversation history
4. "User is typing..." indicator shows when someone is actively typing
5. Each user has a randomly assigned retro avatar icon (from Windows 98 user icons)
6. User list updates in real-time when users join/leave

**Complexity**: Medium (WebSocket state synchronization, local storage for history)

**Estimated effort**: 5-7 days

---

### Phase 10: Classic Games
**Goal**: Implement Minesweeper and Solitaire for authentic Windows 98 gaming experience

**Depends on**: Phase 1 (Window system) complete

**Requirements**: GAME-01, GAME-02

**v2 Requirements**:
- [ ] **GAME-01**: Minesweeper with classic gameplay
- [ ] **GAME-02**: Solitaire card game

**Success Criteria**:

**Minesweeper**:
1. User can launch Minesweeper from Start → Programs → Games
2. User can select difficulty (Beginner 8x8, Intermediate 16x16, Expert 30x16)
3. Left-click reveals cells, right-click flags mines
4. Game tracks time and mine count
5. Smiley face button resets game
6. Win condition: all non-mine cells revealed
7. Lose condition: click on mine (shows all mines)

**Solitaire**:
1. User can launch Solitaire from Start → Programs → Games
2. Cards dealt in classic Klondike layout
3. Drag-and-drop cards between piles following Solitaire rules
4. Double-click card to auto-move to foundation
5. Deck cycles through remaining cards
6. Win animation plays when all cards moved to foundation
7. Game menu includes New Game, Undo, Options (Draw 1/Draw 3)

**Complexity**: High (game logic, drag-drop, animations)

**Estimated effort**: 10-14 days (5-7 per game)

---

### Phase 11: Clippy Enhancements
**Goal**: Add personality, animations, and conversation history to Clippy

**Depends on**: Phase 6 (Basic Clippy) complete

**Requirements**: CLIP-05, CLIP-06, CLIP-07, CLIP-08

**v2 Requirements**:
- [ ] **CLIP-05**: Animated Clippy character with classic paperclip animations
- [ ] **CLIP-06**: Context-specific help suggestions (e.g., "I see you're writing a letter...")
- [ ] **CLIP-07**: Conversation history within session
- [ ] **CLIP-08**: Clippy personality modes (helpful, snarky, minimal)

**Success Criteria**:
1. Clippy displays animated paperclip character (sprite sheet or CSS animations)
2. Clippy animates when appearing, speaking, and idle (eyebrow raise, looking around)
3. Clippy detects context: "I see you're drawing" (Paint), "Writing a document?" (Notepad)
4. Conversation history persists in session—user can scroll up to see previous exchanges
5. User can switch Clippy personality via Right-click → Personality
6. Helpful mode: encouraging, positive suggestions
7. Snarky mode: playful teasing, jokes
8. Minimal mode: concise, no-nonsense responses

**Complexity**: Medium-High (animation sprites, prompt engineering for personalities)

**Estimated effort**: 7-10 days

---

### Phase 12: System Features
**Goal**: Add system-level features like Control Panel, context menus, and functional Shut Down

**Depends on**: Phase 1 (Desktop shell) complete

**Requirements**: SYS-01, SYS-02, SYS-03, STYLE-06

**v2 Requirements**:
- [ ] **SYS-01**: Control Panel with system settings
- [ ] **SYS-02**: Actual functional Shut Down screen
- [ ] **SYS-03**: Right-click context menus on desktop and in windows
- [ ] **STYLE-06**: Window chrome includes proper window icon display

**Success Criteria**:
1. User can open Control Panel from Start → Settings
2. Control Panel shows categories: Display, Sound, Mouse
3. Display settings allow theme changes (links to Phase 7)
4. Right-click desktop shows context menu (Refresh, Properties, New Folder)
5. Right-click window title bar shows context menu (Restore, Move, Size, Close)
6. Shut Down from Start menu shows "It's now safe to turn off your computer" screen
7. Each window displays proper application icon in title bar and taskbar

**Complexity**: Medium (context menu system, settings UI)

**Estimated effort**: 5-7 days

---

## Optional Phase 13: 3D Pinball (High Complexity)

**Note**: This is optional due to high complexity. Consider only if team has bandwidth.

**Requirement**: GAME-03

**v2 Requirements**:
- [ ] **GAME-03**: 3D Pinball Space Cadet

**Success Criteria**:
1. User can launch 3D Pinball from Start → Programs → Games
2. Pinball table renders with flippers, bumpers, ramps
3. Spacebar activates flippers
4. Ball physics (gravity, collisions, rebounds) feel realistic
5. Score tracks points from targets and bumpers
6. Missions activate based on gameplay (deploy ball, launch ramp, etc.)
7. High score table persists across sessions

**Complexity**: VERY HIGH (physics engine, 3D rendering or sprite-based simulation)

**Estimated effort**: 20-30 days

**Recommendation**: Defer to v3 or consider as separate bonus feature.

---

## v2 Progress Tracking

| Phase | Status | Requirements | Estimated Effort |
|-------|--------|--------------|------------------|
| 7. Polish & Animations | Not started | 4 | 5-7 days |
| 8. Advanced Paint Tools | Not started | 5 | 7-10 days |
| 9. Enhanced Chatroom | Not started | 4 | 5-7 days |
| 10. Classic Games | Not started | 2 | 10-14 days |
| 11. Clippy Enhancements | Not started | 4 | 7-10 days |
| 12. System Features | Not started | 4 | 5-7 days |
| 13. 3D Pinball (optional) | Not started | 1 | 20-30 days (optional) |

**Total estimated effort (excluding Phase 13):** 39-55 days

## v2 Execution Strategy

### Parallel Workstreams

After v1 ships, v2 phases can be parallelized by team:

**Stream A: Visual Polish & UX**
- Phase 7 (Animations & Sound)
- Phase 12 (System Features)

**Stream B: Applications & Tools**
- Phase 8 (Advanced Paint)
- Phase 10 (Games)

**Stream C: Social & AI**
- Phase 9 (Enhanced Chat)
- Phase 11 (Clippy Enhancements)

Each stream is independent and can be worked on simultaneously.

### Recommended Order (If Sequential)

If working sequentially:
1. **Phase 7** (Polish) — Improves feel of entire v1 product
2. **Phase 9** (Chat) — Enhances core multiplayer differentiator
3. **Phase 11** (Clippy) — Enhances core AI differentiator
4. **Phase 10** (Games) — High user engagement
5. **Phase 8** (Paint) — Advanced features for creators
6. **Phase 12** (System) — Nice-to-have completeness

## Deferred to v3 or Future Versions

These features are intentionally out of scope for v2:

### Persistence & Accounts
- User accounts with login
- Cloud save for Notepad/Paint
- Cross-device sync
- Profile customization

**Rationale**: Breaks ephemeral session design, adds backend complexity

### Multiplayer Games
- Multiplayer Minesweeper
- Multiplayer Solitaire
- Competitive leaderboards

**Rationale**: v2 games are single-player nostalgic experiences first

### Advanced Networking
- Multiple chatrooms
- Private messaging
- Video/audio chat
- File sharing

**Rationale**: Scope creep; single public room sufficient

### Mobile Support
- Touch controls
- Responsive mobile layout
- PWA features

**Rationale**: Desktop-only maintains authenticity

### Browser Enhancements
- Internet Explorer window
- Web browsing within the OS
- Bookmarks and history

**Rationale**: High complexity, questionable value

## v2 Success Metrics

v2 is successful when:

1. **Polish metrics**
   - Animations smooth (60fps)
   - Sound effects enhance experience (not annoying)
   - Themes switchable without bugs

2. **Engagement metrics**
   - Users play games (session time increases)
   - Chat shows sustained activity (messages per hour)
   - Clippy interactions increase with personality modes

3. **Completeness metrics**
   - Windows 98 feature parity (80%+ of iconic features)
   - No critical UX gaps
   - "Wow, this feels just like Windows 98" feedback

## Next Steps After v2

After v2 ships:
1. Gather user feedback
2. Identify pain points
3. Consider v3 scope:
   - More games?
   - Internet Explorer browser?
   - Network Neighborhood (LAN simulation)?
   - Winamp-style music player?
   - Screen savers?

---

**Remember**: v2 is about depth, not breadth. We're making the existing features richer, not adding fundamentally new capabilities. The goal is "Windows 98, but better than you remember it."

---
*v2 Roadmap created: 2025-01-31*
*Dependent on: v1 completion (Phases 1-6)*
