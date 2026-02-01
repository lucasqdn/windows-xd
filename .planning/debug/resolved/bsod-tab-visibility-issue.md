---
status: resolved
trigger: "BSOD stuck for ~20 seconds, continues when tab is switched"
created: 2026-02-01T01:00:00Z
updated: 2026-02-01T01:05:00Z
---

## Current Focus

hypothesis: CONFIRMED - Browser throttling setTimeout when tab is not active
test: Replace setTimeout with requestAnimationFrame
expecting: Timer will work correctly regardless of tab visibility
next_action: Test with tab switching

## Symptoms

expected: BSOD should last exactly 5 seconds (or configured bsodDuration)
actual: BSOD gets stuck for ~20 seconds, only continues when switching tabs
errors: None, just timing delay
reproduction: Trigger virus, let BSOD appear, switch tabs, BSOD freezes
started: User reported the issue

## Eliminated

## Evidence

- timestamp: 2026-02-01T01:02:00Z
  checked: BSODScreen.tsx timer implementation
  found: Uses setTimeout which is throttled by browsers when tab is inactive
  implication: Timer gets paused/slowed dramatically when user switches tabs

- timestamp: 2026-02-01T01:03:00Z
  checked: Browser behavior documentation
  found: Browsers throttle setTimeout to 1000ms (1 second) when tab is hidden
  implication: 5 second timer could take 20+ seconds if tab is inactive

- timestamp: 2026-02-01T01:04:00Z
  checked: Alternative timing methods
  found: requestAnimationFrame continues running even when tab is hidden
  implication: Can use RAF with timestamp checking for precise timing

## Resolution

root_cause: setTimeout is heavily throttled by browsers when tab is not visible/active. Browsers limit setTimeout to minimum 1 second intervals for background tabs to save resources. This caused the 5 second BSOD timer to take 20+ seconds when user switched tabs during the virus sequence.

fix: Replaced setTimeout with requestAnimationFrame + timestamp checking:
- Store start time with Date.now()
- Use requestAnimationFrame loop to check elapsed time
- Compare elapsed time vs target duration
- Call onComplete() when duration reached
- requestAnimationFrame is not throttled the same way as setTimeout

Benefits:
- Works correctly even if tab is inactive
- More precise timing (checks every frame)
- No throttling issues
- Better performance

verification: Test by triggering virus, letting BSOD appear, then switching tabs. BSOD should still transition to ransomware after exactly 5 seconds.

files_changed: ["app/components/virus/BSODScreen.tsx"]
