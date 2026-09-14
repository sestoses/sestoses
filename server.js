const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cron = require('node-cron');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Statik dosyaları sunmak için (index.html vb.)
app.use(express.static(path.join(__dirname)));

// WebSocket bağlantı yönetimi
wss.on('connection', (ws) => {
    console.log('Yeni bir kullanıcı bağlandı.');

    ws.on('message', (message) => {
        console.log(`Gelen mesaj: ${message}`);
        // Gelen mesajları diğer kullanıcılara iletme (varsa PTT/Intercom mantığı)
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Kullanıcı bağlantısı kesildi.');
    });
});

// ==========================================
// ABONELİK HATIRLATICI OTOMASYONU (15, 7, 3, 1 Gün)
// ==========================================
// Her gün saat 09:00'da çalışır: '0 9 * * *'
cron.schedule('0 9 * * *', () => {
    console.log('[CRON] Günlük abonelik kontrolü çalıştırıldı...');
    checkSubscriptions();
});

function checkSubscriptions() {
    // Örnek Veritabanı / Durak Başkanları Listesi
    // Gerçek sistemde burayı kendi veritabanınızdan çekeceksiniz.
    const stationHeads = [
        { id: 1, name: 'Durak Başkanı Ahmet', expiryDate: '2026-09-29', phone: '5551112233' }, // Yaklaşık 15 gün kala
        { id: 2, name: 'Durak Başkanı Mehmet', expiryDate: '2026-09-21', phone: '5554445566' }, // Yaklaşık 7 gün kala
        { id: 3, name: 'Durak Başkanı Ali', expiryDate: '2026-09-17', phone: '5557889900' },    // Yaklaşık 3 gün kala
        { id: 4, name: 'Durak Başkanı Mustafa', expiryDate: '2026-09-15', phone: '5559998877' }  // Son gün (1 gün kala)
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    stationHeads.forEach(head => {
        const expiry = new Date(head.expiryDate);
        expiry.setHours(0, 0, 0, 0);

        // Kalan gün hesaplama
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Belirlenen kritik eşikler: 15, 7, 3 ve 1 gün kala
        if ([15, 7, 3, 1].includes(diffDays)) {
            sendNotification(head, diffDays);
        }
    });
}

function sendNotification(head, daysLeft) {
    console.log(`[BİLDİRİM GÖNDERİLDİ] Sayın ${head.name}, aboneliğinizin bitmesine ${daysLeft} gün kaldı!`);
    // Buraya SMS, E-posta veya Push Notification API entegrasyonunuzu (örn: Twilio, NetGSM vb.) ekleyebilirsiniz.
}

// Sunucuyu başlat (Railway uyumlu PORT yapılandırması)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
