const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Statik dosyaları sunmak için (index.html ana dizindeyse)
app.use(express.static(__dirname));

// WebSocket bağlantı yönetimi
wss.on('connection', (ws) => {
  console.log('Yeni bir istemci bağlandı.');

  ws.on('message', (message) => {
    // Gelen mesajı bağlı tüm istemcilere yayınla (broadcast)
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('İstemci bağlantısı kesildi.');
  });
});

// Railway'in atadığı dinamik portu kullan
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Sestoses v3.0 sunucusu ${PORT} portunda başarıyla çalışıyor.`);
});
