# Chat Deployment Guide

## PartyKit Setup

This project uses PartyKit for real-time chat functionality. PartyKit provides WebSocket support that works with Vercel's serverless architecture.

## Local Development

1. **Start Next.js dev server:**
   ```bash
   npm run dev
   ```

2. **Start PartyKit dev server (in a separate terminal):**
   ```bash
   npm run dev:party
   ```

   The chat will connect to `localhost:1999` automatically in development.

## Production Deployment

### Step 1: Deploy PartyKit Server

1. **Install PartyKit CLI globally (if not already installed):**
   ```bash
   npm install -g partykit
   ```

2. **Login to PartyKit:**
   ```bash
   npx partykit login
   ```

3. **Deploy your PartyKit server:**
   ```bash
   npm run deploy:party
   ```

   This will deploy your chat server and give you a URL like:
   ```
   https://windows-xd-chat.YOUR_USERNAME.partykit.dev
   ```

   **Save this URL - you'll need it for Vercel!**

### Step 2: Configure Vercel Environment Variable

1. Go to your Vercel project settings
2. Navigate to **Settings → Environment Variables**
3. Add a new environment variable:
   - **Name:** `NEXT_PUBLIC_PARTYKIT_HOST`
   - **Value:** `windows-xd-chat.YOUR_USERNAME.partykit.dev` (WITHOUT https://)
   - **Environments:** Production, Preview, Development (check all)

4. Redeploy your Vercel site to apply the environment variable

### Step 3: Verify Deployment

1. Open your deployed site on Vercel
2. Open the chatroom window
3. Open the same site in another browser/device
4. You should see each other's messages!

## Troubleshooting

### Chat not connecting in production

1. Check browser console (F12) for errors
2. Verify `NEXT_PUBLIC_PARTYKIT_HOST` is set in Vercel
3. Ensure PartyKit server is deployed: `npx partykit list`
4. Check PartyKit logs: `npx partykit tail windows-xd-chat`

### Background image not loading

The background image now uses `unoptimized` prop to bypass Vercel's image optimization. If still showing black:
- Check browser console for 404 errors
- Verify `public/windows-xd-background.png` exists
- Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

## Old Socket.IO Server (No Longer Used)

The `server.ts` file is no longer needed and can be removed. The app now uses:
- **Local:** PartyKit dev server on localhost:1999
- **Production:** PartyKit hosted server

## Cost

PartyKit offers a **free tier** that includes:
- Up to 100 concurrent connections
- Unlimited messages
- Perfect for small projects and demos

For larger scale, check [PartyKit pricing](https://partykit.io/pricing).
