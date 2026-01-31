# Pitfalls Research

**Domain:** Browser-based OS/Desktop Recreation
**Project:** windows-xd (Windows 98 recreation)
**Researched:** January 31, 2026
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Window Z-Index/Focus Management Drift

**What goes wrong:**
Window z-index values and focus state become desynchronized, causing visual stacking order to mismatch logical focus order. Users click on a visually "top" window but focus goes to a hidden window behind it. Z-index values accumulate indefinitely (z-index: 999999) without bounds.

**Why it happens:**
- Maintaining z-index in component state separate from window manager state
- Incrementing z-index on every focus without cleanup
- Not treating focus as single source of truth
- CSS z-index and React state getting out of sync during rapid interactions
- Missing focus events during drag operations

**How to avoid:**
- **Single source of truth:** Window manager maintains ordered array of window IDs, z-index derived from array position
- **Bounded z-index:** Use position in stack (0-N), not incrementing counter
- **Synchronous updates:** Focus change immediately reorders window stack before render
- **Focus follows mouse during drag:** Track which window is under cursor during drag operations
- **Event capture:** Use React's event system correctly (onMouseDown with capture phase)

**Warning signs:**
- Windows appearing "stuck" behind others despite being clicked
- Z-index values in DevTools exceeding 1000
- Focus indicator (title bar highlight) not matching visual top window
- Rapid clicking causing visual glitches or wrong window activation
- Console errors about setState during unmount (indicates timing issues)

**Phase to address:**
Phase 1 (Window System Foundation) — must be architected correctly from the start

---

### Pitfall 2: Memory Leaks from Window State Accumulation

**What goes wrong:**
Closed windows remain in state/memory. Event listeners persist after window unmount. Window content (especially canvas data) never garbage collected. Application slows down progressively as users open/close windows.

**Why it happens:**
- Adding windows to state array but never removing them (just hiding with display: none)
- Registering global event listeners (document.addEventListener) without cleanup
- Storing large data (canvas ImageData) in window state instead of refs
- Circular references between window manager and window components
- React DevTools showing growing component tree despite windows being "closed"

**How to avoid:**
- **True removal:** Remove window from state array on close, don't just hide
- **useEffect cleanup:** Return cleanup functions that remove all listeners
- **Ref-based storage:** Store canvas data, large objects in refs, not state
- **Weak references:** Use WeakMap for window metadata keyed by window ID
- **Unmount verification:** Test that components fully unmount using React DevTools Profiler
- **Heap snapshots:** Take before/after snapshots in Chrome DevTools to verify cleanup

**Warning signs:**
- Memory usage (Chrome Task Manager) grows continuously, never drops
- Performance degrades after opening/closing 10+ windows
- React DevTools showing more components than visible windows
- Event listeners count increasing (getEventListeners(document) in console)
- Lag when opening new windows after extended use

**Phase to address:**
Phase 1 (Window System Foundation) — cleanup must be built into window lifecycle

---

### Pitfall 3: Canvas Performance Degradation (Paint/Bitmap Editors)

**What goes wrong:**
Canvas-based tools (MS Paint recreation) feel sluggish. Drawing lags behind mouse movement. App becomes unresponsive during canvas operations. Large canvases (>2000x2000px) freeze the browser.

**Why it happens:**
- Re-rendering entire canvas on every mouse move
- Not using requestAnimationFrame for draw operations
- Storing full canvas history in state for undo (causes re-renders)
- Using React state for cursor position during drag (too many renders)
- Performing expensive calculations (flood fill, blur) on main thread
- Copying entire canvas with getImageData on every stroke

**How to avoid:**
- **RAF batching:** Queue draw operations, execute in requestAnimationFrame
- **Ref-based drawing:** Store canvas context in ref, draw without triggering renders
- **Offscreen canvas:** Use OffscreenCanvas for thumbnails/previews
- **Web Worker:** Move expensive operations (filters, flood fill) to worker threads
- **Dirty rectangles:** Only redraw changed regions, not entire canvas
- **Command pattern for undo:** Store commands (line drawn from X to Y), not full canvas snapshots
- **Throttle mouse events:** Sample mousemove at 60fps max, ignore excess events

**Warning signs:**
- Visible lag between mouse movement and line appearing
- Browser "Page Unresponsive" warnings during canvas operations
- Frame rate drops in Performance monitor during drawing
- Canvas operations blocking window dragging/resizing
- Memory spikes when using undo repeatedly

**Phase to address:**
Phase 2/3 (Application Implementation) — before implementing Paint or any canvas-heavy apps

---

### Pitfall 4: WebSocket Reconnection Logic Failures

**What goes wrong:**
Chat disconnects permanently after network hiccup. Reconnection attempts spam server (exponential retry without backoff cap). Users miss messages sent during reconnection. Multiple WebSocket connections open simultaneously.

**Why it happens:**
- No exponential backoff on reconnection attempts
- Not closing old socket before opening new one
- Missing connection state machine (connecting/connected/disconnecting/disconnected)
- Not handling server-side disconnect vs. client network failure differently
- Assuming message order/delivery without acknowledgment system
- Opening new socket on every component re-render

**How to avoid:**
- **State machine:** Explicit connection states, prevent invalid transitions
- **Exponential backoff:** 1s, 2s, 4s, 8s, cap at 30s, reset on successful connection
- **Singleton connection:** Single WebSocket instance, shared via context/ref, not re-created
- **Heartbeat/ping-pong:** Detect stale connections before OS does (send ping every 30s)
- **Message queue:** Queue outgoing messages during disconnect, replay on reconnect
- **Sequence numbers:** Track message order, detect gaps, request missing messages
- **Connection ref:** Store socket in ref, check if exists before creating new

**Warning signs:**
- Multiple WebSocket connections in Network tab for same client
- "WebSocket is already in CLOSING or CLOSED state" errors
- Reconnection attempts with no delay between them
- Messages duplicated or out of order
- Connection working on localhost but failing on deployed app (timeout differences)

**Phase to address:**
Phase 3 (Real-time Features) — before implementing chat/multi-user features

---

### Pitfall 5: LLM API Rate Limiting Without Graceful Degradation

**What goes wrong:**
LLM features (Clippy assistant) fail silently after rate limit hit. Users spam retry button, making rate limit worse. No indication of wait time. Features become permanently unavailable until page refresh.

**Why it happens:**
- No retry logic with exponential backoff for rate limits
- Not parsing rate limit headers (X-RateLimit-Remaining, Retry-After)
- Sending every keystroke to API instead of debouncing/batching
- No client-side request queue with rate limiting
- Missing fallback UI when API unavailable
- Not differentiating between rate limit (retry) vs. auth error (don't retry)

**How to avoid:**
- **Parse rate limit headers:** Extract Retry-After, show countdown to user
- **Client-side queue:** Limit to N requests per minute before hitting server
- **Exponential backoff:** 5s, 10s, 20s, 40s for 429 errors specifically
- **Request deduplication:** Debounce user input (500ms), don't send identical requests
- **Graceful degradation:** Show cached/previous responses or "assistant unavailable" UI
- **Status differentiation:** Retry on 429/502/503, don't retry on 401/403
- **Circuit breaker:** Stop attempting requests after 3 consecutive failures, require user action

**Warning signs:**
- 429 Too Many Requests errors in Network tab
- Rapid-fire API requests on every keystroke
- Feature "stops working" intermittently
- No user feedback when requests fail
- API costs spiking unexpectedly

**Phase to address:**
Phase 3/4 (LLM Integration) — before connecting to external LLM APIs

---

### Pitfall 6: Font Loading Flash of Unstyled Text (FOUT)

**What goes wrong:**
Windows 98 system fonts (MS Sans Serif, Tahoma) flash from fallback fonts on load, breaking pixel-perfect appearance. Fonts load at different times causing layout shifts. Custom fonts fail to load on some browsers/networks, leaving site unusable.

**Why it happens:**
- Not preloading critical fonts
- Using font-display: swap instead of font-display: block for system UI fonts
- Loading fonts from CDN without fallback self-hosting
- Missing @font-face definitions for all required weights/styles
- Not testing on slow connections (3G throttling)
- Assuming Next.js font optimization handles everything

**How to avoid:**
- **Preload critical fonts:** <link rel="preload" as="font"> in layout head for system fonts
- **font-display: block:** For UI fonts (0-100ms blank, ensures no FOUT)
- **font-display: swap:** Only for content fonts, never for UI chrome
- **Self-host fonts:** Don't rely on external CDNs for critical fonts
- **Subset fonts:** Only include Latin characters if targeting Latin languages
- **Test font loading:** Network throttling to Fast 3G, verify no layout shift
- **next/font:** Use next/font/local for self-hosted fonts, gets automatic optimization

**Warning signs:**
- Visible text reflow after page load
- Buttons/menus changing size after 1-2 seconds
- Fonts looking different on refresh vs. cached load
- DevTools showing font CORS errors
- Lighthouse reporting layout shift (CLS score)

**Phase to address:**
Phase 1 (Foundation) — fonts must be configured correctly from the start

---

### Pitfall 7: Absolute Positioning Chaos with Nested Windows

**What goes wrong:**
Windows positioned relative to viewport scroll into wrong positions. Nested elements (dialog boxes inside windows) positioned incorrectly. Windows "jump" when scrolling or resizing viewport. Drag/drop calculations break near viewport edges.

**Why it happens:**
- Using position: absolute without proper positioning context
- Calculating positions using window.innerWidth instead of container bounds
- Not accounting for scroll offset (scrollX/scrollY)
- Missing position: relative on window container
- Using getBoundingClientRect() without subtracting parent offset
- Transform/translate causing new stacking contexts unexpectedly

**How to avoid:**
- **Positioning context:** Window container must be position: relative
- **Constrain to container:** Calculate positions relative to container, not viewport
- **Account for scroll:** Use element.getBoundingClientRect() not element.offsetTop
- **Clamp boundaries:** Prevent windows from escaping container bounds
- **Transform awareness:** Be careful with transform creating new stacking context
- **Fixed vs absolute:** Use position: fixed for desktop container, absolute for windows within

**Warning signs:**
- Windows appearing outside visible area
- Drag calculations "drifting" as you drag further
- Windows positioned incorrectly after browser resize
- Nested dialogs appearing in wrong location
- Console warnings about "cannot read offsetParent of null"

**Phase to address:**
Phase 1 (Window System Foundation) — positioning must be correct from the start

---

### Pitfall 8: Drag/Resize Performance Killing Main Thread

**What goes wrong:**
Window dragging feels janky, doesn't keep up with mouse. Browser freezes during resize. Other windows lag when dragging one window. Frame rate drops below 30fps during drag operations.

**Why it happens:**
- Updating state on every mousemove event (can fire 100+ times/second)
- Triggering re-renders of all windows when one window moves
- Performing layout calculations on every frame
- Not using transform for movement (causes layout recalc instead of composite)
- Synchronous state updates during drag blocking main thread
- Not throttling/debouncing resize operations

**How to avoid:**
- **CSS transform for dragging:** Move window with transform: translate(), not top/left
- **Batch updates:** Use requestAnimationFrame to batch position updates
- **Refs for intermediate states:** Store drag offset in ref, only update state on dragEnd
- **Will-change hint:** `will-change: transform` on windows to hint compositor
- **Throttle resize:** Only update window size every 16ms (60fps), ignore excess events
- **Memo/PureComponent:** Prevent sibling windows from re-rendering during drag
- **Passive event listeners:** { passive: true } for mousemove during drag

**Warning signs:**
- Chrome DevTools Performance showing long tasks (>50ms) during drag
- Frame rate counter showing <60fps during window operations
- Mouse cursor moving ahead of window during drag
- Scrolling laggy while dragging
- CPU usage spiking during simple drag operations

**Phase to address:**
Phase 1 (Window System Foundation) — performance must be good from the start

---

### Pitfall 9: Cross-Browser CSS Inconsistencies for Retro Styling

**What goes wrong:**
Pixel-perfect borders/insets render differently on Safari vs Chrome. Windows 98 beveled edges look wrong on Firefox. Non-standard scrollbar styling breaks on non-Chromium browsers. Layout shifts between browsers.

**Why it happens:**
- Using -webkit-specific CSS without fallbacks
- Assuming all browsers support same scrollbar styling (they don't)
- Not testing on Safari (different rendering engine than Chrome)
- Using non-standard box-shadow for inset/outset effects
- Missing vendor prefixes for critical styles
- Assuming subpixel rendering works identically

**How to avoid:**
- **Test matrix:** Chrome, Firefox, Safari minimum (covers Blink, Gecko, WebKit)
- **Scrollbar strategy:** Use standard styles for Firefox/Safari, enhanced for Chrome
- **Border images:** Use border-image for complex bevels, not multiple box-shadows
- **Feature detection:** Use @supports for progressive enhancement
- **Fallback styles:** Always provide standard property before vendor prefix
- **Visual regression testing:** Automated screenshots across browsers

**Warning signs:**
- "Looks perfect on Chrome" but reports of issues on other browsers
- Scrollbars appearing totally different on Firefox
- Border rendering 1px off on Safari
- Layout breaking on iOS Safari specifically
- CSS not working on browser you didn't test

**Phase to address:**
Phase 1 (Foundation) — CSS architecture must be cross-browser from the start

---

### Pitfall 10: State Management Scaling Issues with Many Windows

**What goes wrong:**
App slows down with 5+ windows open. Re-rendering entire desktop on every window interaction. State updates causing unrelated components to re-render. Props drilling through 4+ levels.

**Why it happens:**
- All window state in single monolithic object at top level
- Not using proper state management (context + reducer) for window system
- Passing all state to all windows instead of subscriptions
- No memoization of expensive computations
- Missing React.memo on window components
- Updating global state for local concerns (mouse position during drag)

**How to avoid:**
- **Zustand/Jotai for window manager:** Lightweight state management with selectors
- **Selector pattern:** Windows subscribe only to their own state slice
- **Local state for local concerns:** Mouse tracking, temporary UI state in component
- **Memo extensively:** React.memo on Window component, useMemo for window lists
- **Derived state:** Compute active window from window order, don't store separately
- **Immutable updates:** Use immer or similar to prevent accidental mutations

**Warning signs:**
- React DevTools Profiler showing all components render on every interaction
- Noticeable delay when clicking between windows
- Performance degrading proportionally with window count
- Deep component trees (6+ levels) in React DevTools
- Re-renders with identical props (indicates missing memo)

**Phase to address:**
Phase 1 (Window System Foundation) — state architecture must scale from the start

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Single global z-index counter (++zIndex) | Simple to implement | Z-index grows unbounded, hits browser limits | Never — use position-based indexing |
| Store canvas as base64 in state | Easy undo/redo | Memory leaks, re-render performance death | Never — use command pattern |
| WebSocket reconnect on component mount | Works for demo | Multiple connections, race conditions | Never — use singleton pattern |
| position: fixed for individual windows | Avoids stacking context issues | Breaks with scroll, hard to constrain | Never — use absolute within container |
| setTimeout for drag throttling | Quick to implement | Inconsistent frame rate, can queue up | Never — use requestAnimationFrame |
| Display: none for closed windows | No unmounting complexity | Memory leaks, growing DOM | Only for minimize (restore in <1s) |
| Inline event handlers in JSX | Convenient, less code | Creates new function every render | Only for top-level desktop handlers |
| CSS transitions for window movement | Smooth animation | Blocks rapid updates, feels sluggish | Only for minimize/maximize animations |
| Local storage for window state | Persists across sessions | Sync issues, grows unbounded | Only with size limits and expiration |
| Generic "any" types for window data | Skip TypeScript errors | Loses type safety, runtime errors | Never — define proper Window types |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| LLM APIs (OpenAI) | Sending API key from client | Proxy through Next.js API route, never expose key |
| WebSocket chat | Using ws:// in production (unencrypted) | Always wss:// for production, handle mixed content |
| File uploads (if implemented) | Reading entire file into memory | Use streams, process chunks, limit file size |
| Image loading (backgrounds, icons) | Not optimizing images, loading full-res | Use next/image, provide multiple sizes, lazy load |
| External fonts | Loading from Google Fonts CDN | Self-host fonts, reduces CORS issues and latency |
| Browser APIs (clipboard) | Assuming permissions always granted | Check permissions, provide fallback for denied access |
| Local storage | Storing sensitive data unencrypted | Never store credentials, use encryption for PII |
| WebRTC (if peer-to-peer chat) | No TURN server fallback | Corporate firewalls block P2P, need TURN server |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Re-rendering desktop on every window update | Sluggish UI, lag when dragging | Memo, selectors, local state for drag | 3+ windows with active animations |
| Storing entire canvas in state | Memory grows, app crashes | Use refs and command pattern for undo | Canvas >1000x1000px or >10 operations |
| Polling WebSocket status every 100ms | High CPU, battery drain | Event-driven only, no polling | Always bad, just less noticeable initially |
| Loading all icons as separate requests | Slow initial load, many requests | Sprite sheet or inline SVG, lazy load rare icons | >20 unique icons |
| Unthrottled mousemove handlers | Frame drops during drag | RAF batching, passive listeners | As soon as dragging is implemented |
| CSS animations for 60fps movement | Janky, drops frames | CSS transform + will-change, or canvas | Moving >1 window simultaneously |
| Synchronous rendering for window list | Blocks main thread | Virtualization for 10+ windows (unlikely needed) | >15 windows open (rare) |
| Keeping all message history in memory | Memory grows, scrolling slows | Limit to last 100 messages, paginate older | >500 messages in one session |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Eval() for app script execution | Arbitrary code execution, XSS | Never use eval, use safe parsers or sandboxed iframes |
| Allowing file:// URLs in image sources | Local file disclosure | Whitelist allowed protocols (https:, data:) |
| No rate limiting on LLM API proxy | Cost explosion, DoS | Rate limit by IP/session, queue requests |
| Trusting WebSocket messages | Injection, privilege escalation | Validate/sanitize all incoming messages |
| Storing window content in URLs | Data leaks via referer, history | Use session storage, not URL params |
| XSS in chat messages | Script injection, session hijacking | Sanitize HTML, use DOMPurify, CSP headers |
| CORS misconfiguration on API routes | Unauthorized access | Explicit origin whitelist, not "*" |
| No authentication on WebSocket | Anyone can connect, spam chat | Require auth token, validate on connection |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Windows open off-screen | User thinks app is broken, can't find window | Constrain to viewport, cascade new windows |
| No visual feedback during drag | Feels broken, unresponsive | Cursor change, window outline, immediate feedback |
| Drag starts on first mousemove | Accidental drags when clicking | Require minimum 5px movement before drag starts |
| Can't cancel drag with Escape | Users stuck in drag mode | Listen for Escape key, reset drag state |
| No double-click to maximize | Expected behavior missing | Implement double-click on title bar |
| Missing keyboard shortcuts | Not accessible, power users frustrated | Alt+F4 close, Alt+Space menu, Tab switching |
| Windows completely overlappable | Users lose windows behind others | Taskbar shows all windows, click to bring to front |
| No indication of focused window | Users confused which window is active | Highlight title bar of focused window |
| Start menu closes on first click | Interrupts navigation flow | Keep open for submenu navigation, close on outside click |
| Loading states blocking entire app | One slow operation freezes everything | Per-window loading, app remains responsive |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Window dragging:** Often missing boundary constraints — verify can't drag off-screen
- [ ] **Window resizing:** Often missing minimum size — verify can't resize to 0x0
- [ ] **Z-index management:** Often works until 10+ windows — verify with 20 windows opened/closed
- [ ] **Canvas drawing:** Often smooth on desktop only — verify on trackpad, touch, slow CPU
- [ ] **WebSocket chat:** Often works on localhost — verify behind corporate proxy/firewall
- [ ] **LLM integration:** Often works with small prompts — verify with rate limiting, long responses, errors
- [ ] **Font loading:** Often fine on fast WiFi — verify on 3G, with cache disabled
- [ ] **Memory management:** Often fine for 5 minutes — verify after 30 minutes of heavy use
- [ ] **Cross-browser:** Often tested on Chrome only — verify on Firefox, Safari (especially iOS)
- [ ] **Keyboard navigation:** Often mouse-only — verify Tab, Enter, Escape, arrow keys work
- [ ] **Error states:** Often missing error UI — verify network failures, API errors show user-friendly messages
- [ ] **Mobile responsive:** Often assumes desktop — verify behavior on tablet/mobile (even if not primary target)

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Z-index drift | LOW | Add z-index reset function, call on focus change; normalize existing values |
| Memory leaks | MEDIUM | Add cleanup to useEffect returns; audit with Chrome DevTools heap snapshots; add dev-mode leak detector |
| Canvas performance | MEDIUM | Refactor to RAF pattern; move calculations to web worker; switch to command pattern undo |
| WebSocket issues | LOW | Add state machine wrapper around raw WebSocket; add reconnection logic; add message queue |
| LLM rate limiting | LOW | Add request queue; parse rate limit headers; add UI for waiting/retry |
| Font loading FOUT | LOW | Add preload links; switch to font-display: block; subset fonts to reduce load time |
| Positioning chaos | HIGH | Refactor positioning context; create PositionContext provider; rewrite drag/resize logic |
| Drag performance | MEDIUM | Switch to CSS transform; add RAF batching; move state to refs during drag |
| Cross-browser CSS | MEDIUM | Add browser test suite; create fallback styles; use feature detection |
| State management | HIGH | Migrate to Zustand/Jotai; refactor to selector pattern; add memoization extensively |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Z-index/focus drift | Phase 1: Window System | Manual test: open 10 windows, click each, verify focus matches visuals |
| Memory leaks | Phase 1: Window System | Heap snapshot test: open/close 50 windows, verify memory returns to baseline |
| Canvas performance | Phase 2/3: Apps | Performance test: draw for 60 seconds, verify 60fps maintained |
| WebSocket reconnection | Phase 3: Real-time | Network test: disconnect WiFi during session, verify automatic reconnection |
| LLM rate limiting | Phase 3/4: LLM | Load test: send 100 requests rapidly, verify queue + backoff |
| Font loading FOUT | Phase 1: Foundation | Network throttle test: 3G simulation, verify no text reflow |
| Positioning chaos | Phase 1: Window System | Boundary test: drag to all viewport edges, verify constraints |
| Drag performance | Phase 1: Window System | Performance test: drag window continuously, verify 60fps in DevTools |
| Cross-browser CSS | Phase 1: Foundation | Browser matrix: Chrome/Firefox/Safari, verify visual consistency |
| State management scaling | Phase 1: Window System | Performance test: 10 windows open, verify updates don't trigger full re-render |

## Sources

**Domain expertise** (HIGH confidence):
- Browser-based OS recreation patterns from Windows 93, Windows 96, EmuOS
- Window management patterns from Winbox.js, React-Grid-Layout documentation
- Canvas performance patterns from Mozilla Canvas API performance guide
- WebSocket reconnection patterns from Socket.io reconnection logic documentation
- React performance patterns from React documentation (useMemo, React.memo)

**Known issues** (HIGH confidence):
- Z-index stacking context issues documented in MDN Web Docs
- Memory leak patterns documented in React documentation
- Canvas performance bottlenecks documented in HTML5 Canvas performance guide
- WebSocket connection management in WebSocket API MDN documentation

**Testing patterns** (HIGH confidence):
- Chrome DevTools Performance monitoring documentation
- React DevTools Profiler documentation
- Cross-browser testing patterns from web.dev

---
*Pitfalls research for: windows-xd (Windows 98 browser recreation)*
*Researched: January 31, 2026*
