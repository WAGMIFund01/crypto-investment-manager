@echo off
echo 🚀 WAGMI Crypto Investment Manager - Complete Setup
echo ==================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo ✅ Found package.json - we're in the right directory

REM Create .env.local file
echo 📝 Creating .env.local file...
(
echo # Google Sheets Configuration
echo GOOGLE_SHEETS_ENDPOINT=https://script.google.com/macros/s/AKfycbyR5aSLuZhoFL0X-igNyVdifZDzbdi29EhGzcpFRLBaZe3bDgK1QVOiWCZO3hfRSFla/exec
echo COINGECKO_API_KEY=CG-QgGwi5RiGpRpircAtdTcYTvk
echo.
echo # NextAuth Configuration
echo NEXTAUTH_SECRET=wagmi-crypto-manager-super-secret-key-2025
echo NEXTAUTH_URL=http://localhost:3000
echo.
echo # Google OAuth ^(placeholder - will work without these for now^)
echo GOOGLE_CLIENT_ID=placeholder-google-client-id
echo GOOGLE_CLIENT_SECRET=placeholder-google-client-secret
echo.
echo # Sentry ^(optional^)
echo SENTRY_DSN=
echo.
echo # Development
echo NODE_ENV=development
) > .env.local
echo ✅ Created .env.local file

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

REM Kill any existing processes on port 3000
echo 🧹 Cleaning up any existing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /f /pid %%a 2>nul

REM Test the build first
echo 🔨 Testing build...
npm run build
if %errorlevel% equ 0 (
    echo ✅ Build successful
) else (
    echo ❌ Build failed - but continuing anyway
)

REM Start the development server
echo.
echo 🌟 Starting development server on http://localhost:3000
echo 📱 Open your browser and go to: http://localhost:3000
echo 🛑 Press Ctrl+C to stop the server
echo.

REM Start the server
npm run dev
