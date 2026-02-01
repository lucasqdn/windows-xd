# 🚀 DEPLOYMENT CHECKLIST - Quick Fix Guide

## ✅ Issues Fixed in This Update

### 1. Background Image Typo ✓
**Fixed:** Corrected filename from `windows-xd backgroud.png` → `windows-xd-background.png`
**Added:** `unoptimized` prop to both logo and background images

### 2. Chat Connection Debugging ✓
**Added:** Better error logging to help diagnose connection issues
**Status:** Chat will now show exactly what's wrong in browser console

---

## 🔴 CRITICAL: You Must Complete These Steps

### Step 1: Deploy PartyKit Server

**Open a terminal and run:**

```bash
# Login to PartyKit (creates free account if you don't have one)
npx partykit login

# Deploy your chat server
npm run deploy:party
```

**You will get output like:**
```
✓ Deployed to https://windows-xd-chat.YOUR_USERNAME.partykit.dev
```

**📝 COPY THIS URL!** You need it for the next step.

---

### Step 2: Set Vercel Environment Variable

1. **Go to:** https://vercel.com/[your-username]/[your-project]/settings/environment-variables

2. **Click "Add New"**

3. **Enter:**
   - **Name:** `NEXT_PUBLIC_PARTYKIT_HOST`
   - **Value:** `windows-xd-chat.YOUR_USERNAME.partykit.dev`
     - ⚠️ **IMPORTANT:** Do NOT include `https://` - just the hostname!
     - ✓ Correct: `windows-xd-chat.username.partykit.dev`
     - ✗ Wrong: `https://windows-xd-chat.username.partykit.dev`
   
4. **Select all environments:** Production, Preview, Development (check all boxes)

5. **Click "Save"**

---

### Step 3: Deploy to Vercel

**Push your changes:**

```bash
git add -A
git commit -m "fix: correct background image typo and add chat debugging"
git push
```

Or manually redeploy from Vercel dashboard.

---

### Step 4: Verify Everything Works

1. **Open your deployed site** in browser

2. **Open browser console** (Press F12)

3. **Look for these log messages:**
   ```
   [useChat] PartyKit Host: windows-xd-chat.YOUR_USERNAME.partykit.dev
   [useChat] Connected to chat server at: windows-xd-chat.YOUR_USERNAME.partykit.dev
   ```

4. **Check the bootup sequence:**
   - Windows XD logo should appear (not black screen)
   - Background should transition properly
   - Desktop should load

5. **Open chatroom window:**
   - Status should show "Connected"
   - You should see a username assigned (e.g., "CoolGamer42")
   - Open site in another browser/device - messages should sync!

---

## 🐛 Troubleshooting

### If background image is still black:

1. **Hard refresh:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Check console** for 404 errors on image files
3. **Verify files exist:**
   - `public/windows-xd logo.png` ✓
   - `public/windows-xd-background.png` ✓

### If chat shows "Disconnected":

**Open browser console (F12) and look for:**

**❌ If you see:**
```
[useChat] NEXT_PUBLIC_PARTYKIT_HOST not set! Using localhost:1999
[useChat] Connection error
```
**→ Solution:** You forgot Step 2! Set the environment variable in Vercel.

**❌ If you see:**
```
[useChat] PartyKit Host: localhost:1999
```
**→ Solution:** Environment variable not set. Complete Step 2.

**❌ If you see:**
```
[useChat] Failed to connect to: windows-xd-chat.YOUR_USERNAME.partykit.dev
```
**→ Solution:** PartyKit server not deployed. Complete Step 1.

**✅ If you see:**
```
[useChat] Connected to chat server at: windows-xd-chat.YOUR_USERNAME.partykit.dev
```
**→ Success!** Everything is working.

---

## 📋 Quick Reference Commands

```bash
# Deploy PartyKit
npm run deploy:party

# Check PartyKit deployments
npx partykit list

# View PartyKit logs (real-time)
npx partykit tail windows-xd-chat

# Build locally to test
npm run build

# Run dev environment (needs two terminals)
npm run dev        # Terminal 1
npm run dev:party  # Terminal 2
```

---

## ⚠️ Common Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| Including `https://` in env var | Chat won't connect | Remove `https://` prefix |
| Not redeploying after env var | Old build still running | Redeploy or wait for auto-deploy |
| Forgot to deploy PartyKit | No server to connect to | Run `npm run deploy:party` |
| Testing without browser console | Can't see what's wrong | Always check F12 console |

---

## ✅ Success Criteria

- [ ] Background image loads during bootup (not black)
- [ ] Logo appears and fades properly
- [ ] Desktop loads after bootup sequence
- [ ] Chat shows "Connected" status
- [ ] Chat shows username (e.g., "HappyNinja23")
- [ ] Messages sync between multiple browsers/devices
- [ ] Browser console shows: `[useChat] Connected to chat server`

---

**Need more help?** See `CHAT_DEPLOYMENT.md` for detailed explanations.
