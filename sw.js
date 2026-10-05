// SmartBrick · service worker: permite abrir la app sin señal con la última versión descargada.
// Siempre intenta la red primero (para recibir datos nuevos); si no hay red, usa la copia guardada.
const CACHE = 'smartbrick-v1';
const BASE = ['./', 'index.html', 'app.js', 'config.js', 'manifest.webmanifest', 'data/users.json',
  'img/logo.png', 'img/favicon.png', 'img/icon-192.png', 'img/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('smartbrick-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return; // asistente y fuentes van directo a internet
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const red = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r; });
    const guardada = await cache.match(req, { ignoreSearch: true }) ||
      (req.mode === 'navigate' ? await cache.match('index.html') : undefined);
    if (!guardada) return red;
    // con señal lenta, a los 4 s se muestra la copia guardada (la red sigue actualizando en segundo plano)
    const espera = new Promise(res => setTimeout(() => res(guardada), 4000));
    try { return await Promise.race([red, espera]); } catch (_) { return guardada; }
  })());
});
