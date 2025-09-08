#!/bin/bash

# WAGMI Crypto Investment Manager - Complete Setup & Run Script
echo "🚀 WAGMI Crypto Investment Manager - Complete Setup"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

echo "✅ Found package.json - we're in the right directory"

# Create .env.local file
echo "📝 Creating .env.local file..."
cat > .env.local << 'EOF'
# Google Sheets Configuration
GOOGLE_SHEETS_ENDPOINT=https://script.google.com/macros/s/AKfycbyR5aSLuZhoFL0X-igNyVdifZDzbdi29EhGzcpFRLBaZe3bDgK1QVOiWCZO3hfRSFla/exec
COINGECKO_API_KEY=CG-QgGwi5RiGpRpircAtdTcYTvk

# NextAuth Configuration
NEXTAUTH_SECRET=wagmi-crypto-manager-super-secret-key-2025
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (placeholder - will work without these for now)
GOOGLE_CLIENT_ID=placeholder-google-client-id
GOOGLE_CLIENT_SECRET=placeholder-google-client-secret

# Sentry (optional)
SENTRY_DSN=

# Development
NODE_ENV=development
EOF
echo "✅ Created .env.local file"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Kill any existing processes on port 3000
echo "🧹 Cleaning up any existing processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Test the build first
echo "🔨 Testing build..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - but continuing anyway"
fi

# Start the development server
echo ""
echo "🌟 Starting development server on http://localhost:3000"
echo "📱 Open your browser and go to: http://localhost:3000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server
npm run dev
