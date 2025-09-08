#!/bin/bash

# WAGMI Crypto Investment Manager - Development Server Startup Script
echo "🚀 Starting WAGMI Crypto Investment Manager..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Creating a basic one..."
    cat > .env.local << EOF
# Google Sheets Configuration
GOOGLE_SHEETS_ENDPOINT=https://script.google.com/macros/s/AKfycbyR5aSLuZhoFL0X-igNyVdifZDzbdi29EhGzcpFRLBaZe3bDgK1QVOiWCZO3hfRSFla/exec
COINGECKO_API_KEY=CG-QgGwi5RiGpRpircAtdTcYTvk

# NextAuth Configuration
NEXTAUTH_SECRET=wagmi-crypto-manager-super-secret-key-2025
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (placeholder)
GOOGLE_CLIENT_ID=placeholder-google-client-id
GOOGLE_CLIENT_SECRET=placeholder-google-client-secret

# Development
NODE_ENV=development
EOF
    echo "✅ Created .env.local file"
fi

# Kill any existing processes on port 3000
echo "🧹 Cleaning up any existing processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start the development server
echo "🌟 Starting development server on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
