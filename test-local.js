const http = require('http');
const WebSocket = require('ws');

function request(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port: 3000, path }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

(async () => {
  const page = await request('/');
  if (page.status !== 200) throw new Error(`HTTP test failed: ${page.status}`);

  const a = new WebSocket('ws://127.0.0.1:3000');
  const b = new WebSocket('ws://127.0.0.1:3000');
  await Promise.all([
    new Promise((resolve, reject) => { a.once('open', resolve); a.once('error', reject); }),
    new Promise((resolve, reject) => { b.once('open', resolve); b.once('error', reject); })
  ]);

  const received = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('WebSocket broadcast timed out')), 3000);
    b.once('message', (message) => { clearTimeout(timer); resolve(message.toString()); });
  });
  a.send('github-connector-test');
  const message = await received;
  if (message !== 'github-connector-test') throw new Error(`Unexpected message: ${message}`);
  a.close();
  b.close();
  console.log(JSON.stringify({ httpStatus: page.status, websocketBroadcast: true }));
})().catch((error) => { console.error(error.message); process.exit(1); });
