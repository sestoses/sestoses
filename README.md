# Sestoses SaaS Engine

Production-ready Fleet & Radio Management System.

- Domain: sestoses.com.tr
- Current service: Node.js / Express / WebSocket
- Stack: Node.js / Express / WebSocket

## Kurulum

```bash
npm install
npm start
```

Sunucu varsayılan olarak `http://localhost:3000` adresinde başlar. Platform tarafından `PORT` ortam değişkeni sağlanırsa bu port kullanılır.

## Özellikler

- `index.html` dosyasını Express ile statik olarak sunar.
- WebSocket istemcilerinden gelen mesajları bağlı tüm istemcilere yayınlar.
- `0.0.0.0` üzerinde dinleyerek konteyner ve bulut ortamlarıyla uyumlu çalışır.

## Sağlık ve test

Ana sayfa için HTTP `200` yanıtı ve WebSocket yayınını birlikte test etmek için:

```bash
node test-local.js
```

## Proje dosyaları

- `server.js`: HTTP ve WebSocket sunucusu
- `index.html`: istemci arayüzü
- `package.json`: bağımlılıklar ve çalıştırma komutları
