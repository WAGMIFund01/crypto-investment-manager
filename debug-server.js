#!/usr/bin/env node

// Simple debug script to test the server
const { spawn } = require('child_process');
const path = require('path');

console.log('🔍 WAGMI Debug Script');
console.log('==================');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
console.log('📁 Current directory:', process.cwd());
console.log('📄 Package.json exists:', require('fs').existsSync(packageJsonPath));

// Check Node.js version
console.log('🟢 Node.js version:', process.version);

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
console.log('🔐 .env.local exists:', require('fs').existsSync(envPath));

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
console.log('📦 node_modules exists:', require('fs').existsSync(nodeModulesPath));

// Check port 3000
const net = require('net');
const server = net.createServer();
server.listen(3000, () => {
  console.log('✅ Port 3000 is available');
  server.close();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('❌ Port 3000 is already in use');
  } else {
    console.log('❌ Port 3000 error:', err.message);
  }
});

console.log('\n🚀 Starting development server...');
console.log('Press Ctrl+C to stop\n');

// Start the dev server
const child = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
});

child.on('close', (code) => {
  console.log(`\n📊 Server exited with code ${code}`);
});
