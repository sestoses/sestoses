const http = require('http');
const { Server } = require('ws');

// Railway'in dinamik portunu destekler
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('PTT Sunucusu Aktif!\n');
});

const wss = new Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Sesi diğer tüm kullanıcılara ilet
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) { 
        client.send(message);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda dinlemede.`);
});
