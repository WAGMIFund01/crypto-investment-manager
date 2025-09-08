// Simple test to verify the server is working
const http = require('http');

console.log('🧪 Testing WAGMI Server...');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`✅ Server responded with status: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('🎉 SUCCESS: WAGMI server is working!');
    console.log('🌐 Open http://localhost:3000 in your browser');
  } else {
    console.log('⚠️  Server responded but with unexpected status');
  }
  
  process.exit(0);
});

req.on('error', (err) => {
  console.log('❌ Server is not responding');
  console.log('💡 Make sure to run: npm run dev');
  process.exit(1);
});

req.on('timeout', () => {
  console.log('⏰ Server test timed out');
  console.log('💡 Make sure to run: npm run dev');
  process.exit(1);
});

req.end();
