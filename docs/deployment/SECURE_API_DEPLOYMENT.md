# 🔒 Secure API Key Deployment Guide

## ✅ Good News: Your Setup is Already Secure!

Your API keys are **correctly implemented** and are **NOT exposed** to the browser. Here's why:

---

## 🛡️ How Your Security Works

### **1. API Routes are Server-Side Only**

Your API keys are only used in:
- `app/api/clippy/route.ts` (Gemini for Clippy)
- `app/api/paint/generate-image/route.ts` (Gemini for Paint AI)
- `app/api/ai/vision/route.ts` (OpenAI for vision features)

These files are **Next.js API routes** which run **on the server**, not in the browser.

### **2. Environment Variables are Server-Side**

```typescript
// ✅ SECURE: Only runs on the server
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
```

- `process.env.GEMINI_API_KEY` is only accessible on the server
- The browser NEVER sees this value
- Only `NEXT_PUBLIC_*` variables are exposed to the browser

### **3. Client-Side Code is Safe**

Your components (Clippy.tsx, Paint, etc.) only make HTTP requests to your API:

```typescript
// ✅ SECURE: Client only calls API endpoint
const response = await fetch("/api/clippy", {
  method: "POST",
  body: JSON.stringify({ prompt: "help me" })
});
```

The API key stays on the server!

---

## 🚀 Deploying to Vercel with API Keys

You need to add your API keys to Vercel so they work in production:

### **Step 1: Get Your API Keys**

#### **Gemini API Key (for Clippy):**
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

#### **OpenAI API Key (for Paint AI):**
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-...`)

### **Step 2: Add to Vercel Environment Variables**

1. **Go to:** https://vercel.com
2. **Click your windows-xd project**
3. **Go to:** Settings → Environment Variables
4. **Add these variables:**

```
Name:  GEMINI_API_KEY
Value: AIza... (your actual key)
Environments: ✅ Production ✅ Preview ✅ Development

Name:  OPENAI_API_KEY  
Value: sk-... (your actual key)
Environments: ✅ Production ✅ Preview ✅ Development
```

5. **Click Save** for each

### **Step 3: Redeploy**

After adding the keys:
- Push a commit, or
- Manually redeploy in Vercel

---

## 🧪 Testing Locally

Create a `.env.local` file (already git-ignored):

```bash
# Copy the example file
cp .env.example .env.local
```

Then edit `.env.local` and add your actual keys:

```env
# PartyKit Configuration
NEXT_PUBLIC_PARTYKIT_HOST=windows-xd-chat.lucasqdn.partykit.dev

# AI API Keys
GEMINI_API_KEY=AIza...your_actual_gemini_key
OPENAI_API_KEY=sk-...your_actual_openai_key
```

**Run locally:**
```bash
npm run dev
```

Test Clippy - should respond with AI!

---

## 🔍 Verify API Keys are NOT Exposed

### **Test 1: Check Browser Network Tab**

1. Open your site
2. Press F12 → Network tab
3. Use Clippy to ask a question
4. Look at the request to `/api/clippy`
5. ✅ You should see the prompt, but **NO API key**

### **Test 2: Check Page Source**

1. Right-click page → View Source
2. Search for "GEMINI_API_KEY" or your actual key
3. ✅ Should find **NOTHING**

### **Test 3: Check Environment Variables in Browser Console**

```javascript
console.log(process.env.GEMINI_API_KEY) // undefined
```

✅ Should be `undefined` in browser!

---

## 📊 What Gets Exposed vs. Hidden

| Variable | Exposed to Browser? | Why? |
|----------|-------------------|------|
| `NEXT_PUBLIC_PARTYKIT_HOST` | ✅ Yes | Starts with `NEXT_PUBLIC_` - needed for client |
| `GEMINI_API_KEY` | ❌ No | Server-only, used in API routes |
| `OPENAI_API_KEY` | ❌ No | Server-only, used in API routes |

**Rule:** Only variables starting with `NEXT_PUBLIC_` are exposed to the browser.

---

## 🛡️ Additional Security Best Practices

### **1. Rate Limiting (Already Implemented!)**

Your Clippy API already has rate limiting:

```typescript
// ✅ Already in your code!
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // 1 minute
```

This prevents abuse of your API keys.

### **2. Never Commit API Keys**

Your `.gitignore` already includes:
```gitignore
.env.local
.env
```

✅ API keys will never be committed to Git!

### **3. Rotate Keys if Exposed**

If you accidentally expose a key:
1. **Immediately revoke it** in the API provider dashboard
2. **Generate a new key**
3. **Update Vercel environment variables**

---

## 💰 Cost Management

### **Free Tiers:**

**Gemini API (Google):**
- ✅ Free tier: 15 requests/minute
- ✅ 1,500 requests/day
- Perfect for personal projects

**OpenAI API:**
- ⚠️ Pay-as-you-go (starts at $0.002 per 1K tokens)
- Monitor usage: https://platform.openai.com/usage
- Set spending limits in settings

### **Monitor Your Usage:**

**Gemini:**
https://aistudio.google.com/app/apikey → Check quota

**OpenAI:**
https://platform.openai.com/usage → View usage

---

## 🎯 Quick Deployment Checklist

- [ ] Get Gemini API key from Google AI Studio
- [ ] Get OpenAI API key from OpenAI Platform
- [ ] Add `GEMINI_API_KEY` to Vercel environment variables
- [ ] Add `OPENAI_API_KEY` to Vercel environment variables
- [ ] Check all 3 environment boxes (Production, Preview, Development)
- [ ] Redeploy Vercel site
- [ ] Test Clippy on deployed site
- [ ] Check browser devtools - NO keys should be visible

---

## 🐛 Troubleshooting

### **Issue: Clippy not responding with AI**

**Check 1: Are keys set in Vercel?**
- Go to Vercel → Settings → Environment Variables
- Verify `GEMINI_API_KEY` is set

**Check 2: Did you redeploy?**
- Environment variables only apply to NEW deployments
- Push a commit or manually redeploy

**Check 3: Check server logs**
- Vercel → Deployments → Latest → Functions
- Look for errors related to API keys

### **Issue: "API key not configured" message**

This message appears when:
- `.env.local` doesn't exist locally, or
- Vercel environment variable not set in production

**Solution:**
- Locally: Create `.env.local` with your keys
- Production: Add keys to Vercel

### **Issue: Rate limit exceeded**

Your API has a 10 requests/minute limit per IP.

**Solution:**
- Wait 1 minute
- Or increase `RATE_LIMIT` in `app/api/clippy/route.ts`

---

## 📚 Summary

**Your Current Setup:**
- ✅ API keys are server-side only
- ✅ No keys exposed to browser
- ✅ Rate limiting implemented
- ✅ `.env.local` git-ignored
- ✅ Proper Next.js API routes

**To Deploy:**
1. Get API keys from Google AI Studio and OpenAI
2. Add them to Vercel environment variables
3. Redeploy
4. Test Clippy - it should work with AI!

**Everything is secure by design!** 🔒
