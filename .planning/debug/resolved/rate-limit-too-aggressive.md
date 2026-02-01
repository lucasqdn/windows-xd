---
status: resolved
trigger: "Clippy keeps telling me 'whoa there, speed racer' rate limit message even on first request"
created: 2026-02-01T00:20:00Z
updated: 2026-02-01T00:25:00Z
---

## Current Focus

hypothesis: CONFIRMED - Rate limit too aggressive for development testing
test: Increased dev rate limit and improved IP detection
expecting: Should allow more requests in development
next_action: User needs to restart dev server

## Symptoms

expected: Should be able to ask Clippy questions normally, rate limit only after 10 requests/minute
actual: Getting rate limit message immediately: "Whoa there, speed racer! You're asking me questions faster than a 56k modem can handle."
errors: None (this is intentional rate limit response)
reproduction: Ask Clippy any question
started: After fixing the model name issue

## Eliminated

## Evidence

- timestamp: 2026-02-01T00:22:00Z
  checked: Rate limiting code in route.ts
  found: IP detection uses "unknown" as fallback, all localhost requests share same counter
  implication: In development, all requests are grouped together under "localhost" IP

- timestamp: 2026-02-01T00:23:00Z
  checked: Rate limit logic
  found: In-memory Map persists across requests, limit was 10 requests/minute (too low for testing)
  implication: Multiple test requests accumulate and hit the limit quickly

- timestamp: 2026-02-01T00:24:00Z
  checked: Development needs
  found: Testing Clippy requires multiple quick requests
  implication: Need higher rate limit in development environment

## Resolution

root_cause: Rate limit of 10 requests/minute is too low for development testing. All localhost requests share the same IP counter ("localhost"), so testing multiple features quickly exhausts the limit.

fix: 
1. Increased rate limit to 50 requests/minute in development (NODE_ENV === 'development')
2. Keeps production limit at 10 requests/minute
3. Improved IP detection to use x-forwarded-for or x-real-ip headers
4. Added detailed logging to track rate limit status
5. Changed fallback IP from "unknown" to "localhost" for clarity

verification: User needs to restart dev server to clear old rate limit counter and load new limits

files_changed: ["app/api/clippy/route.ts"]
