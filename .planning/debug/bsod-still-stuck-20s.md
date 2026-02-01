---
status: investigating
trigger: "BSOD still stuck for 20 seconds instead of 5-10 seconds, even after requestAnimationFrame fix"
created: 2026-02-01T01:10:00Z
updated: 2026-02-01T01:10:00Z
---

## Current Focus

hypothesis: There might be another delay happening - could be glitch phase, ransomware timing, or audio
test: Check all timings in the virus sequence chain
expecting: Will find additional delay somewhere in the chain
next_action: Check glitch phase duration and ransomware screen initialization

## Symptoms

expected: BSOD should last 5 seconds (VIRUS_TIMING.bsodDuration = 5000ms)
actual: BSOD stays on screen for ~20 seconds
errors: None visible
reproduction: Trigger virus, wait through sequence, observe BSOD duration
started: User reported still happening after requestAnimationFrame fix

## Eliminated

- setTimeout throttling (fixed with requestAnimationFrame)

## Evidence

## Resolution

root_cause: 
fix: 
verification: 
files_changed: []
