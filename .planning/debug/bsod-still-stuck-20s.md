---
status: verifying
trigger: "BSOD still stuck for 20 seconds instead of 5-10 seconds, even after requestAnimationFrame fix"
created: 2026-02-01T01:10:00Z
updated: 2026-02-01T01:45:00Z
---

## Current Focus

hypothesis: Multiple setTimeout calls being throttled (silent phase, glitch phase)
test: Convert all phase timers to requestAnimationFrame
expecting: All phases should complete in their configured durations
next_action: Test with fresh browser session and check console logs

## Symptoms

expected: BSOD should last 5 seconds (VIRUS_TIMING.bsodDuration = 5000ms)
actual: BSOD stays on screen for ~20 seconds
errors: None visible
reproduction: Trigger virus, wait through sequence, observe BSOD duration
started: User reported still happening after requestAnimationFrame fix

## Eliminated

- hypothesis: Only BSOD timer was being throttled
  evidence: Fixed BSOD with RAF but issue persists
  timestamp: 2026-02-01T01:20:00Z

## Evidence

- timestamp: 2026-02-01T01:15:00Z
  checked: All setTimeout usage in VirusSimulation.tsx
  found: Silent phase (line ~116), Glitch phase (line ~318), Sprite spawning (lines 206, 240) all use setTimeout
  implication: Any of these could be getting throttled when tab is inactive

- timestamp: 2026-02-01T01:25:00Z
  checked: Virus sequence timeline
  found: Silent(3s) → Sprites(20s) → Glitch(8s) → BSOD(5s) → Ransomware
  implication: User's 20s delay could be the 8s glitch phase getting throttled to ~20s

- timestamp: 2026-02-01T01:40:00Z
  checked: Console logging in all phases
  found: Each phase logs "Starting..." and "Ending..." with actual duration
  implication: Logs will reveal which phase is actually stuck

## Resolution

root_cause: Multiple setTimeout calls throughout virus sequence were being throttled by browser when tab inactive. Likely the glitch phase (8s) was stretching to ~20s, making user think BSOD was stuck.
fix: Converted silent phase and glitch phase setTimeout to requestAnimationFrame with timestamp checking
verification: Needs user testing with console logs
files_changed: ["app/components/virus/VirusSimulation.tsx"]
