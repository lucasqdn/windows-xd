# 🎯 Complete Vercel Setup - YOUR SPECIFIC VALUES

## ✅ Your PartyKit Server is Deployed!

**Your chat server URL:** `windows-xd-chat.lucasqdn.partykit.dev`

---

## 📋 Environment Variables You Need to Set

You need to add **3 environment variables** to Vercel for full functionality:

| Variable | Purpose | Value Type |
|----------|---------|-----------|
| `NEXT_PUBLIC_PARTYKIT_HOST` | Chat server | Public (starts with NEXT_PUBLIC_) |
| `GEMINI_API_KEY` | Clippy AI | Private (server-side only) |
| `OPENAI_API_KEY` | Paint AI vision | Private (server-side only) |

---

## 🔑 Step 1: Get Your API Keys

### **Gemini API Key (for Clippy):**
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

### **OpenAI API Key (for Paint AI):**
1. Go to: https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Give it a name (e.g., "windows-xd")
5. Copy the key (starts with `sk-...`)
   
⚠️ **Save these keys somewhere safe! You'll need them in the next step.**

---

## 🌐 Step 2: Add Variables to Vercel Dashboard

1. **Open:** https://vercel.com

2. **Click on your `windows-xd` project**

3. **Go to:** Settings tab → Environment Variables (left sidebar)

4. **Click "Add New"** and add each variable below:

### **Variable 1: PartyKit Host (for Chat)**

```
Name:  NEXT_PUBLIC_PARTYKIT_HOST

Value: windows-xd-chat.lucasqdn.partykit.dev
```

⚠️ **CRITICAL:** Do NOT include `https://` in the value!

**Environments:** ✅ Production ✅ Preview ✅ Development

**Click "Save"**

---

### **Variable 2: Gemini API Key (for Clippy AI)**

```
Name:  GEMINI_API_KEY

Value: AIza... (paste your actual Gemini key)
```

🔒 **This is server-side only and will NOT be exposed to browsers**

**Environments:** ✅ Production ✅ Preview ✅ Development

**Click "Save"**

---

### **Variable 3: OpenAI API Key (for Paint AI)**

```
Name:  OPENAI_API_KEY

Value: sk-... (paste your actual OpenAI key)
```

🔒 **This is server-side only and will NOT be exposed to browsers**

**Environments:** ✅ Production ✅ Preview ✅ Development

**Click "Save"**

---

## 🚀 Step 3: Redeploy Your Site

After adding all environment variables:

**Option A: Automatic (Recommended)**
- Vercel may automatically trigger a redeploy
- Check the "Deployments" tab

**Option B: Manual**
1. Go to **Deployments** tab
2. Click **three dots (⋮)** on latest deployment
3. Click **"Redeploy"**

---

## ✅ Step 4: Verify Everything Works

### **1. Check Chat Connection**

1. Open your deployed site
2. Press **F12** (browser console)
3. Look for:
   ```
   [useChat] Connected to chat server at: windows-xd-chat.lucasqdn.partykit.dev
   ```
4. Open chatroom → should show "Connected" + username
5. Test with another browser → messages should sync!

### **2. Check Clippy AI**

1. Click on Clippy
2. Ask: "write me a poem about coding"
3. Clippy should respond with AI-generated content
4. ❌ If you see: "someone forgot to configure my brain" → API key not set

### **3. Check Paint AI** (if you use it)

1. Open Paint
2. Try the AI image generation feature
3. Should work with your Gemini key

---

## 🐛 Troubleshooting

### **Issue: Chat shows "Disconnected"**

**Check browser console (F12):**

❌ **If you see:**
```
[useChat] NEXT_PUBLIC_PARTYKIT_HOST not set!
```
→ **Solution:** `NEXT_PUBLIC_PARTYKIT_HOST` not set in Vercel. Go back to Step 2.

---

### **Issue: Clippy gives generic responses**

**If Clippy says:** "someone forgot to configure my brain"

→ **Solution:** `GEMINI_API_KEY` not set in Vercel. Go back to Step 2.

**Check Vercel logs:**
1. Vercel → Deployments → Latest deployment
2. Click "Functions" tab
3. Look for errors related to Gemini

---

### **Issue: Environment variables not working**

**Did you redeploy?**
- Environment variables only apply to NEW deployments
- You must redeploy after adding them

**Are all 3 environments checked?**
- Make sure Production, Preview, AND Development are all selected

---

## 🧪 Test Locally First (Recommended)

Before deploying, test locally:

1. **Create `.env.local`** in your project root:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** and add your actual keys:
   ```env
   NEXT_PUBLIC_PARTYKIT_HOST=windows-xd-chat.lucasqdn.partykit.dev
   GEMINI_API_KEY=AIza...your_actual_key
   OPENAI_API_KEY=sk-...your_actual_key
   ```

3. **Run locally:**
   ```bash
   npm run dev
   ```

4. **Test Clippy** - should respond with AI!

---

## 🎯 Quick Checklist

After completing all steps, verify:

- [ ] All 3 environment variables added to Vercel
- [ ] All variables have all 3 environments checked
- [ ] Site redeployed after adding variables
- [ ] Browser console shows: "Connected to chat server"
- [ ] Chatroom shows "Connected" status
- [ ] Clippy responds with AI-generated content
- [ ] No API keys visible in browser (check View Source)

---

## 🔒 Security Notes

✅ **Your API keys are SECURE:**
- Only `NEXT_PUBLIC_*` variables are exposed to the browser
- `GEMINI_API_KEY` and `OPENAI_API_KEY` are server-side only
- Keys are only used in API routes (`/app/api/*`)
- Rate limiting is implemented (10 req/min)

See `SECURE_API_DEPLOYMENT.md` for detailed security info.

---

## 💰 Cost Monitoring

**Gemini (Google):**
- Free tier: 15 requests/minute, 1,500/day
- Monitor: https://aistudio.google.com/app/apikey

**OpenAI:**
- Pay-as-you-go: ~$0.002 per 1K tokens
- Monitor: https://platform.openai.com/usage
- Set spending limits in account settings

---

## 📞 Next Steps

Once all variables are set and redeployed:

1. **Test your deployed site**
2. **Check browser console** for connection messages
3. **Try Clippy AI** - should work perfectly!
4. **Share with friends** - chat should sync between users!

**Let me know if you run into any issues!** The debug logging will show exactly what's wrong. 🚀
