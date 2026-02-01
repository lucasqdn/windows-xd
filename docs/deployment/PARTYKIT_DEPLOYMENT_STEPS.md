# 🎯 PartyKit Deployment - Complete Guide

## What is PartyKit?

PartyKit is a **hosting service for real-time multiplayer apps**. It runs your WebSocket server in the cloud, so users can connect from anywhere. It's free for small projects!

---

## Step-by-Step Deployment

### 1️⃣ Login to PartyKit

**Open your terminal** in the project directory and run:

```bash
npx partykit login
```

**What happens:**
- Browser opens automatically
- You'll see a login page
- Sign in with:
  - GitHub (recommended)
  - Google
  - Email

**First time?** It will create a free account for you.

**After login:** Close the browser tab, return to terminal.

---

### 2️⃣ Deploy Your Chat Server

**Run this command:**

```bash
npm run deploy:party
```

**You'll see output like:**

```
▲ Deploying project windows-xd-chat
  ✓ Building...
  ✓ Uploading...
  ✓ Deployed!

🎉 Successfully deployed windows-xd-chat

  URL: https://windows-xd-chat.yourusername.partykit.dev
  
  Dashboard: https://partykit.io/dashboard/windows-xd-chat
```

**📝 IMPORTANT:** Copy the URL! You need it for the next step.

**Example URL:** `windows-xd-chat.yourusername.partykit.dev`
- Note: Username will be YOUR GitHub/Google username

---

### 3️⃣ Configure Vercel Environment Variable

Now you need to tell your Vercel deployment where to find your PartyKit server.

#### **Go to Vercel Dashboard:**

1. Open: https://vercel.com
2. Click on your **windows-xd** project
3. Click the **Settings** tab (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New** button

#### **Enter the variable:**

```
Name:  NEXT_PUBLIC_PARTYKIT_HOST

Value: windows-xd-chat.yourusername.partykit.dev
```

⚠️ **CRITICAL:** 
- Do NOT include `https://` in the value
- ✅ Correct: `windows-xd-chat.yourusername.partykit.dev`
- ❌ Wrong: `https://windows-xd-chat.yourusername.partykit.dev`

#### **Select environments:**

Check ALL three boxes:
- ✅ Production
- ✅ Preview
- ✅ Development

#### **Save:**

Click the **Save** button.

---

### 4️⃣ Redeploy Your Site

You need to trigger a new deployment so Vercel picks up the environment variable.

**Option A: Push a commit (triggers auto-deploy)**

```bash
git add -A
git commit -m "fix: correct background image typo and add chat debugging"
git push
```

**Option B: Manual redeploy in Vercel**

1. Go to your project in Vercel
2. Click **Deployments** tab
3. Click the **three dots** (⋮) on the latest deployment
4. Click **Redeploy**

---

### 5️⃣ Verify It Works

#### **Open your deployed site:**

Go to your Vercel URL (e.g., `https://windows-xd.vercel.app`)

#### **Open Browser Console:**

Press **F12** (Windows/Linux) or **Cmd+Option+I** (Mac)

#### **Look for these messages:**

✅ **SUCCESS - You'll see:**
```
[useChat] PartyKit Host: windows-xd-chat.yourusername.partykit.dev
[useChat] Connected to chat server at: windows-xd-chat.yourusername.partykit.dev
```

❌ **PROBLEM - If you see:**
```
[useChat] NEXT_PUBLIC_PARTYKIT_HOST not set! Using localhost:1999
```
→ **Solution:** Go back to Step 3, you forgot to set the environment variable.

#### **Test the chat:**

1. Open the chatroom window
2. Should show:
   - **Status:** Connected ✓
   - **Username:** Something like "CoolGamer42"
3. Open the same site in another browser/device
4. Send messages - they should appear on both!

---

## 🎉 Success!

If you see "Connected" and messages sync between browsers, you're done!

---

## 🐛 Troubleshooting

### Problem: `npx partykit login` doesn't open browser

**Solution:**
```bash
# Try manually opening the login page
npx partykit login --open
```

Or visit: https://www.partykit.io/login

---

### Problem: Deployment fails with "unauthorized"

**Solution:**
```bash
# Logout and login again
npx partykit logout
npx partykit login
```

---

### Problem: Chat still shows "Disconnected" after everything

**Check these:**

1. **Did you deploy PartyKit?**
   ```bash
   npx partykit list
   ```
   Should show: `windows-xd-chat`

2. **Is environment variable set correctly?**
   - Go to Vercel → Settings → Environment Variables
   - Look for `NEXT_PUBLIC_PARTYKIT_HOST`
   - Value should be hostname only (no `https://`)

3. **Did you redeploy Vercel?**
   - Environment variables only apply to NEW deployments
   - Push a commit or manually redeploy

4. **Check browser console:**
   - Press F12
   - Look for connection messages
   - Share any errors you see

---

### Problem: "Too many requests" or rate limited

PartyKit free tier limits:
- ✅ 100 concurrent connections
- ✅ Unlimited messages
- ✅ Unlimited deployments

If you hit limits, wait a few minutes or upgrade at https://partykit.io/pricing

---

## 📊 Useful Commands

```bash
# List your PartyKit projects
npx partykit list

# View real-time logs
npx partykit tail windows-xd-chat

# Check deployment status
npx partykit status windows-xd-chat

# Deploy again (updates your server)
npm run deploy:party

# Logout
npx partykit logout
```

---

## 💰 Cost

**PartyKit Free Tier:**
- ✅ 100 concurrent connections
- ✅ Unlimited messages
- ✅ Perfect for personal projects

**When to upgrade:**
- If you expect 100+ simultaneous users
- See: https://partykit.io/pricing

---

## 🎯 Quick Checklist

After following all steps, you should have:

- [ ] Logged into PartyKit
- [ ] Deployed chat server: `npm run deploy:party`
- [ ] Copied PartyKit URL (hostname only)
- [ ] Added `NEXT_PUBLIC_PARTYKIT_HOST` to Vercel
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed Vercel (push commit or manual redeploy)
- [ ] Opened deployed site
- [ ] Checked browser console (F12)
- [ ] Saw "Connected to chat server" message
- [ ] Opened chatroom - shows "Connected" status
- [ ] Tested with second browser - messages sync!

---

## 🆘 Still Having Issues?

Check the browser console (F12) and share:
1. Any error messages you see
2. What the `[useChat]` logs show
3. Output from `npx partykit list`

The debug logging will tell us exactly what's wrong!
