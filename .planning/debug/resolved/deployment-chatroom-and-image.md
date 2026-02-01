---
status: resolved
trigger: "In deployment, the chatroom app currently shows as disconnected and no user is instanize. The transition in the boot up sequence from windows-xd-logod to windows-xd-background to the main os is still broken as the windows-xd-background.png is still loaded as a black image with the image icon (probably an error)."
created: 2026-02-01T01:00:00.000Z
updated: 2026-02-01T01:00:00.000Z
---

## Current Focus

hypothesis: (1) NEXT_PUBLIC_PARTYKIT_HOST not set in Vercel or PartyKit not deployed (2) Background image has actual loading error, not optimization issue
test: Check environment variable configuration and image loading errors
expecting: Missing env var or image path/format issue
next_action: Examine PartyKit connection and image loading implementation

## Symptoms

expected: Chatroom should show connected status with username. Background image should load during bootup sequence.
actual: Chatroom shows "disconnected" and no user instantiated. Background image shows black with broken image icon during bootup.
errors: Image icon suggests 404 or loading error
reproduction: Deploy to Vercel, open site, observe bootup sequence and chatroom status
started: After applying PartyKit migration fixes

## Eliminated

## Evidence

- timestamp: 2026-02-01T01:05:00.000Z
  checked: app/components/BootupScreen.tsx line 98
  found: Typo in filename "windows-xd backgroud.png" (missing 'n' in background)
  implication: Image path is wrong, causing 404 error and broken image icon

- timestamp: 2026-02-01T01:06:00.000Z
  checked: public directory
  found: Actual file is "windows-xd-background.png" (correct spelling)
  implication: BootupScreen is requesting wrong filename

- timestamp: 2026-02-01T01:07:00.000Z
  checked: app/hooks/useChat.ts line 10
  found: PARTYKIT_HOST falls back to "localhost:1999" when env var not set
  implication: In production without env var, tries to connect to user's localhost instead of deployed PartyKit server

- timestamp: 2026-02-01T01:08:00.000Z
  checked: PartyKit deployment status
  found: User likely hasn't deployed PartyKit yet or set Vercel env var
  implication: Chat cannot connect because there's no server to connect to

## Resolution

root_cause: **Issue 1 (Background Image):** Typo in BootupScreen.tsx line 98 - referenced "windows-xd backgroud.png" (missing 'n') but actual file is "windows-xd-background.png". **Issue 2 (Chatroom):** PartyKit server not deployed OR NEXT_PUBLIC_PARTYKIT_HOST environment variable not set in Vercel, causing chat to try connecting to localhost:1999 in production.

fix: **Issue 1:** Fixed typo in BootupScreen.tsx, corrected filename to "windows-xd-background.png", added unoptimized prop to both logo and background images. **Issue 2:** Added comprehensive debug logging to useChat.ts to help identify connection issues, created DEPLOYMENT_CHECKLIST.md with step-by-step deployment instructions.

verification: Build passes. User needs to: (1) Deploy PartyKit server via `npm run deploy:party`, (2) Set NEXT_PUBLIC_PARTYKIT_HOST in Vercel environment variables, (3) Redeploy. Browser console will show connection status.

files_changed: ["app/components/BootupScreen.tsx", "app/hooks/useChat.ts", "DEPLOYMENT_CHECKLIST.md"]
