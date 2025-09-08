# 🚀 WAGMI Crypto Investment Manager - Quick Start

## ✅ One-Click Setup & Run

### For macOS/Linux:
```bash
chmod +x setup-and-run.sh
./setup-and-run.sh
```

### For Windows:
```cmd
setup-and-run.bat
```

## 🎯 What This Does:

1. **Creates `.env.local`** - All required environment variables
2. **Installs Dependencies** - npm install if needed
3. **Cleans Port 3000** - Kills any existing processes
4. **Tests Build** - Ensures everything compiles
5. **Starts Server** - Runs `npm run dev`

## 🌐 Access Your App:

Once running, open your browser and go to:
**http://localhost:3000**

## 🎨 What You'll See:

- **🚀 WAGMI** - Large branding
- **Crypto Investment Manager** - Subtitle
- **✅ Server is working!** - Success message
- **Phase 2 Complete** - Development status

## 🛑 Stop the Server:

Press `Ctrl+C` in the terminal

## 🔧 Manual Setup (if scripts don't work):

1. Create `.env.local`:
```env
NEXTAUTH_SECRET=wagmi-crypto-manager-super-secret-key-2025
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

2. Install dependencies:
```bash
npm install
```

3. Start server:
```bash
npm run dev
```

## 🆘 Troubleshooting:

- **Port 3000 in use**: Try `npm run dev -- -p 3001`
- **Build errors**: Check Node.js version (need 18+)
- **Permission errors**: Run `chmod +x setup-and-run.sh`

## 📱 Next Steps:

Once the server is running, you can:
- Build investor dashboard
- Build manager dashboard  
- Add portfolio components
- Implement authentication

---

**Built with Next.js 14 + TypeScript + Tailwind CSS**
