// Primero intenta traer lo mas nuevo de internet; sin conexion usa lo guardado.
// Asi las actualizaciones llegan solas y el juego sigue funcionando sin internet.
const VERSION = 'milvidas-13';
const ARCHIVOS = ['./', 'index.html', 'estilo.css', 'app.js', 'manifest.webmanifest', 'icono-192.png', 'icono-512.png', 'icono-mask.png', 'kalam-latin-700-normal.woff2', 'nunito-latin-400-normal.woff2', 'nunito-latin-700-normal.woff2', 'nunito-latin-800-normal.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSION).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copia = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copia)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
