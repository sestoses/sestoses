const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Sunucu hatasi: index.html bulunamadi');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content, 'utf-8');
        }
    });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Yeni bir istemci bağlandı.');
    ws.on('message', (message) => {
        console.log('Gelen mesaj:', message.toString());
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda başarıyla çalışıyor`);
});
