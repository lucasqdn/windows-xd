# windows-xd

A pixel-perfect recreation of Windows 98 on the web with modern features including real-time multiplayer chat and an AI-powered Clippy assistant.

## Features

- 🖥️ **Authentic Windows 98 UI**: Pixel-perfect recreation with functional window management
- 💬 **Real-time Chat**: Multiplayer chatroom powered by PartyKit WebSocket
- 🤖 **AI Clippy**: LLM-powered assistant using Google Gemini
- 🎨 **Draggable Windows**: Fully functional window system with minimize, maximize, close
- ⚡ **Built with Next.js 16**: Modern React framework with App Router

## Quick Setup (Recommended)

### Prerequisites
- **Node.js**: v22.14.0 or later ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For cloning the repository

### Automated Setup

Run the setup script to automatically install all dependencies:

```bash
# Clone the repository
git clone <your-repo-url>
cd windows-xd

# Run the automated setup script
./setup.sh
```

The script will:
- ✅ Check your Node.js version
- ✅ Install all npm dependencies using `npm ci` (ensures exact versions)
- ✅ Create `.env.local` from template
- ✅ Verify everything is ready to run

### Manual Setup

If you prefer to set up manually:

```bash
# 1. Use the correct Node.js version (if using nvm)
nvm use

# 2. Install dependencies (use 'npm ci' to ensure exact versions)
npm ci

# 3. Create environment file
cp .env.example .env.local

# 4. (Optional) Add your Gemini API key to .env.local for Clippy feature
# Get your key from: https://aistudio.google.com/app/apikey
```

## Running the Project

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploying to Production

For production deployment instructions, see the [deployment documentation](./docs/deployment/VERCEL_SETUP_INSTRUCTIONS.md).

Key deployment guides:
- **[Vercel Setup](./docs/deployment/VERCEL_SETUP_INSTRUCTIONS.md)** - Complete deployment guide
- **[API Key Safety](./docs/deployment/API_KEY_SAFETY_EXPLAINED.md)** - Security best practices
- **[PartyKit Deployment](./docs/deployment/PARTYKIT_DEPLOYMENT_STEPS.md)** - WebSocket server setup

### Production Build

```bash
npm run build    # Build for production
npm start        # Start production server
```

### Linting

```bash
npm run lint     # Run ESLint
```

## Important: Keeping Dependencies in Sync

**This project uses `package-lock.json` to lock dependency versions.**

### For New Team Members

**Always use `npm ci` instead of `npm install`** when setting up the project:

```bash
npm ci           # ✅ Installs exact versions from package-lock.json
npm install      # ❌ May install different versions
```

### When Adding New Dependencies

```bash
# Install and save to package.json
npm install <package-name>

# Commit BOTH files
git add package.json package-lock.json
git commit -m "feat: add <package-name> dependency"
```

### After Pulling Latest Changes

If someone added new dependencies:

```bash
git pull
npm ci           # Reinstall from updated package-lock.json
```

> **Pro Tip**: The `setup.sh` script automatically uses `npm ci` to ensure consistency.

## Project Structure

```
windows-xd/
├── app/
│   ├── components/       # React components
│   │   ├── apps/         # Application windows (Notepad, Paint, Chat, etc.)
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── party/                # PartyKit WebSocket server
├── docs/                 # Documentation
│   ├── deployment/       # Deployment guides
│   └── development/      # Development docs
├── .planning/            # Project planning and documentation
├── .nvmrc                # Node.js version lock
├── setup.sh              # Automated setup script
└── package.json          # Dependencies and scripts
```

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Real-time**: PartyKit (WebSocket)
- **AI**: Google Gemini API
- **Window Management**: react-rnd

## Development Workflow

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed development guidelines.

## Troubleshooting

### "Module not found" errors

```bash
# Reinstall dependencies with exact versions
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use

```bash
# Kill the process using port 3000
lsof -i :3000
kill -9 <PID>
```

### TypeScript errors

```bash
# Check for type errors
npx tsc --noEmit
```

## License

[Your License Here]

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.
