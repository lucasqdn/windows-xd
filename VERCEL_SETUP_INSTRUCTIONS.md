# 🎯 Vercel Setup - YOUR SPECIFIC VALUES

## ✅ Your PartyKit Server is Deployed!

**Your chat server URL:** `windows-xd-chat.lucasqdn.partykit.dev`

---

## 📋 Set Up Vercel Environment Variable

### **Option 1: Via Vercel Dashboard (Recommended)**

1. **Open this URL:** https://vercel.com

2. **Find your windows-xd project** and click on it

3. **Click the "Settings" tab** (top navigation)

4. **Click "Environment Variables"** (left sidebar)

5. **Click "Add New" button**

6. **Enter EXACTLY these values:**

```
Name:  NEXT_PUBLIC_PARTYKIT_HOST

Value: windows-xd-chat.lucasqdn.partykit.dev
```

⚠️ **IMPORTANT:** 
- Copy-paste the value to avoid typos
- Do NOT include `https://` in the value
- ✅ Correct: `windows-xd-chat.lucasqdn.partykit.dev`
- ❌ Wrong: `https://windows-xd-chat.lucasqdn.partykit.dev`

7. **Select ALL environments:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

8. **Click "Save"**

---

### **Option 2: Via Vercel CLI (If you have it installed)**

If you have Vercel CLI installed, you can run:

```bash
vercel env add NEXT_PUBLIC_PARTYKIT_HOST production
```

When prompted, enter: `windows-xd-chat.lucasqdn.partykit.dev`

Then do the same for preview and development:
```bash
vercel env add NEXT_PUBLIC_PARTYKIT_HOST preview
vercel env add NEXT_PUBLIC_PARTYKIT_HOST development
```

---

## 🚀 After Setting the Environment Variable

### **Trigger a Redeploy:**

**Option A: Push the code changes**
```bash
git add -A
git commit -m "fix: correct background image typo and configure PartyKit"
git push
```

**Option B: Manual redeploy in Vercel**
1. Go to your project in Vercel
2. Click "Deployments" tab
3. Click the three dots (⋮) on latest deployment
4. Click "Redeploy"

---

## ✅ Verification

After redeployment:

1. **Open your deployed site** (e.g., https://windows-xd.vercel.app)

2. **Press F12** to open browser console

3. **Look for this message:**
   ```
   [useChat] PartyKit Host: windows-xd-chat.lucasqdn.partykit.dev
   [useChat] Connected to chat server at: windows-xd-chat.lucasqdn.partykit.dev
   ```

4. **Open the chatroom window**
   - Should show: "Connected" ✓
   - Should show a username like "CoolGamer42"

5. **Test with another browser/device**
   - Messages should sync between them!

---

## 📞 Let Me Know

Once you've set the environment variable in Vercel, let me know and we can test it together!
