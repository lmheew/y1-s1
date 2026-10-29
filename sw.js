// Offline copy of the study site. Pages and data (HTML, JSON): network first, so changes show as soon as you're
// online, with the saved copy when the network is down or slow. Images and fonts: saved copy first.
// Bump CACHE when the list below changes; old caches are deleted on activate.
const CACHE = 'study-notes-v2';
const FONTS = 'study-notes-fonts';
const CORE = ['./', './math/', './site.json', './manifest.webmanifest', './favicon.svg', './apple-touch-icon.png', './icon-192.png',
  './src/shared/totop.css', './src/shared/totop.js']; // the home page links these two; subject pages have them built in
const TIMEOUT = 3500;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== FONTS).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then((v) => { clearTimeout(t); resolve(v); }, (err) => { clearTimeout(t); reject(err); });
  });
}
async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  const url = new URL(req.url);
  const fromNet = fetch(req).then(async (res) => {
    if (res && res.ok) {
      // versioned files (locked.json?v=…): keep only the newest copy
      if (url.search) {
        for (const k of await cache.keys()) { const u = new URL(k.url); if (u.pathname === url.pathname && u.search !== url.search) cache.delete(k); }
      }
      await cache.put(req, res.clone());
    }
    return res;
  });
  fromNet.catch(() => { /* offline: handled below */ });
  try {
    return await withTimeout(fromNet, TIMEOUT);
  } catch (err) {
    const hit = (await cache.match(req)) || (await cache.match(req, { ignoreSearch: true }));
    if (hit) return hit;
    if (req.mode === 'navigate') {
      const home = await cache.match('./');
      if (home) return home;
    }
    return fromNet; // nothing saved: wait for the network after all
  }
}
async function cacheFirst(req, name = CACHE) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (/\.(png|svg|jpg|webp|woff2?)$/.test(url.pathname)) e.respondWith(cacheFirst(req));
    else e.respondWith(networkFirst(req));
  } else if (/^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(cacheFirst(req, FONTS));
  }
});
