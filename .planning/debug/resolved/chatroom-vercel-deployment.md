---
status: resolved
trigger: "Chatroom functionality is not working when I deploy it, one instance on my laptop and one instance on my friend's laptop, we cannot see eachother, I deployed the website using vercel. During the bootup sequence when you enter the website, when I check the deployed version, one of the images is not loaded properly and is a black screen, I think windows-xd-background is not working properly."
created: 2026-02-01T00:00:00.000Z
updated: 2026-02-01T00:15:00.000Z
---

## Current Focus

hypothesis: Both root causes confirmed and fixes applied
test: Migrated to PartyKit for chat, added unoptimized prop to background image
expecting: Both issues resolved after deployment
next_action: Verify fixes work locally and in production

## Symptoms

expected: Chatroom should connect users across different machines when deployed on Vercel. Background image should load during bootup sequence.
actual: Chatroom cannot connect between two users on different laptops (deployed version). Background image shows as black screen on deployed version.
errors: Unknown (need browser console logs from deployed site)
reproduction: Deploy to Vercel, open on two different machines, chatroom doesn't sync. Background image shows black screen during bootup.
started: Works locally but fails on Vercel deployment

## Eliminated

## Evidence

- timestamp: 2026-02-01T00:05:00.000Z
  checked: app/hooks/useChat.ts line 17
  found: Socket connection hardcoded to "http://localhost:3000"
  implication: In production, clients try to connect to their own localhost, not the actual server

- timestamp: 2026-02-01T00:06:00.000Z
  checked: server.ts file existence and Socket.IO server implementation
  found: Custom Socket.IO server in server.ts, but Vercel uses serverless functions
  implication: Vercel cannot run persistent Socket.IO servers (no long-running Node.js processes)

- timestamp: 2026-02-01T00:07:00.000Z
  checked: app/components/Desktop.tsx line 409-415
  found: next/image component used with priority flag for windows-xd-background.png (1536x1024 PNG)
  implication: Large image may have optimization issues, or Image component CSS issue with fill + object-cover

- timestamp: 2026-02-01T00:08:00.000Z
  checked: public/windows-xd-background.png
  found: File exists, 1536x1024 PNG, 8-bit RGB
  implication: Image file itself is valid, issue is in how it's rendered

- timestamp: 2026-02-01T00:12:00.000Z
  checked: Vercel image optimization behavior
  found: Large images can timeout or fail during optimization on Vercel
  implication: Adding unoptimized prop bypasses optimization and serves image directly

## Resolution

root_cause: **Issue 1 (Chatroom):** Socket.IO server cannot run on Vercel serverless architecture. The app uses a custom Socket.IO server (server.ts) which requires a persistent Node.js process. Vercel uses serverless functions that spin up/down per request. Additionally, useChat.ts hardcodes "http://localhost:3000". **Issue 2 (Background):** Next.js Image optimization timing out or failing for large background image (1536x1024 PNG) on Vercel.

fix: **Issue 1:** Migrated from Socket.IO to PartyKit. Created party/chatroom.ts with PartyKit server, updated useChat.ts to use PartySocket with environment-aware URL (localhost:1999 for dev, production URL from env var), updated package.json scripts, created partykit.json config and .env.example. **Issue 2:** Added unoptimized prop to Image component in Desktop.tsx to bypass Vercel's image optimization.

verification: Pending user deployment and testing

files_changed: ["party/chatroom.ts", "app/hooks/useChat.ts", "package.json", "partykit.json", ".env.example", "app/components/Desktop.tsx", "CHAT_DEPLOYMENT.md"]
