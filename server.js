const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Statik dosyaları sunma (index.html ana dizinde olmalı)
app.use(express.static(path.join(__dirname)));

// WebSocket Bağlantı Yönetimi
wss.on('connection', (ws) => {
    console.log('Yeni bir kullanıcı bağlandı.');

    ws.on('message', (message) => {
        // Gelen ses veya JSON (Durak/SOS) verisini bağlı diğer tüm kullanıcılara yayınla (broadcast)
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Kullanıcı bağlantısı koptu.');
    });
});

// Railway'in atadığı dinamik portu kullan
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda başarıyla çalışıyor.`);
});
