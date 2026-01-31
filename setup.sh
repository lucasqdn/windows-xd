#!/bin/bash

# windows-xd Setup Script
# This script automates the setup process for new developers

set -e  # Exit on error

echo "🚀 windows-xd Setup Script"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 22.14.0 or later from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="22.14.0"

echo "📦 Detected Node.js version: v$NODE_VERSION"

# Check if nvm is available
if command -v nvm &> /dev/null; then
    echo "✅ nvm detected. Using Node.js version from .nvmrc..."
    nvm use
else
    echo "⚠️  nvm not detected. Using system Node.js."
fi

echo ""

# Check if package-lock.json exists
if [ ! -f "package-lock.json" ]; then
    echo "⚠️  Warning: package-lock.json not found. This might cause version mismatches."
fi

# Install dependencies
echo "📦 Installing dependencies..."
echo "This may take a few minutes..."
echo ""

if command -v npm &> /dev/null; then
    npm ci 2>/dev/null || npm install
else
    echo "❌ npm is not available!"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example"
    else
        echo "GEMINI_API_KEY=your_api_key_here" > .env.local
        echo "✅ Created .env.local with placeholder"
    fi
    echo "⚠️  Please update .env.local with your actual API keys!"
    echo ""
fi

# Success message
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Update .env.local with your API keys (if needed)"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For more information, see README.md"
echo ""
