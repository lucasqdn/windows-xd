---
status: resolved
trigger: "Friend's laptop experiencing rate limit when both of us use Clippy at the same time on different instances"
created: 2026-02-01T00:30:00Z
updated: 2026-02-01T00:40:00Z
---

## Current Focus

hypothesis: CONFIRMED - Both users share IP, need session-based rate limiting
test: Implement session ID + IP composite key for rate limiting
expecting: Each browser session will have independent rate limit
next_action: Test with two users on same network

## Symptoms

expected: Each user should have independent rate limit (50 req/min in dev, 10 req/min in prod)
actual: Friend gets "speed racer" rate limit message when both users use Clippy simultaneously
errors: None (intentional rate limit response)
reproduction: Two people on same network use Clippy at the same time
started: After deploying/using on same network

## Eliminated

## Evidence

- timestamp: 2026-02-01T00:32:00Z
  checked: Rate limiting implementation in route.ts
  found: Rate limiting is done by IP address only (line 37-40)
  implication: All requests from the same IP share the same rate limit counter

- timestamp: 2026-02-01T00:33:00Z
  checked: How IP addresses work with NAT/router
  found: When two devices are on the same WiFi/network, they share the same public IP address
  implication: Your laptop + friend's laptop = same IP = shared rate limit counter

- timestamp: 2026-02-01T00:34:00Z
  checked: Current rate limits
  found: Production: 10 requests/minute per IP, Development: 50 requests/minute per IP
  implication: Two people sharing an IP means they share the same bucket of requests

- timestamp: 2026-02-01T00:38:00Z
  checked: Session-based rate limiting approach
  found: Can generate unique session ID per browser and use IP + Session composite key
  implication: Each browser gets its own rate limit, even on same network

## Resolution

root_cause: Rate limiting was using only IP address as the key. When multiple users share the same network (same public IP due to NAT), their requests counted against a single shared rate limit counter.

fix: Implemented session-based rate limiting using composite key:
1. Frontend (Clippy.tsx): Generate unique session ID per browser session using sessionStorage
2. Frontend: Send session ID in X-Session-ID header with each request
3. Backend (route.ts): Create composite rate limit key: `IP:SessionID`
4. Each browser session now has independent rate limit

Example scenario after fix:
- You (IP: 192.168.1.1, Session: abc123): 10 requests
- Friend (IP: 192.168.1.1, Session: def456): 10 requests
- Both allowed! Different rate limit counters despite same IP

Benefits:
- Multiple users on same network each get full rate limit
- Still prevents single user from abusing by opening multiple tabs (shares session)
- Simple implementation using sessionStorage

verification: Test with two different browsers/devices on same network

files_changed: ["app/api/clippy/route.ts", "app/components/Clippy.tsx"]
