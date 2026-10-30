// Offline copy of the study site. Pages and data (HTML, JSON): network first, so changes show as soon as you're
// online, with the saved copy when the network is down or slow. Files named with a version (math.css?v=…,
// locked.json?v=…): saved copy first, since a new version comes with a new name. Images and fonts: saved copy first.
// Bump CACHE when the list below changes; old caches are deleted on activate.
const CACHE = 'study-notes-v3';
const FONTS = 'study-notes-fonts';
const KATEX = ['AMS-Regular', 'Main-Bold', 'Main-BoldItalic', 'Main-Italic', 'Main-Regular', 'Math-BoldItalic', 'Math-Italic',
  'Size1-Regular', 'Size2-Regular', 'Size3-Regular', 'Size4-Regular'].map((f) => `./math/assets/fonts/KaTeX_${f}.woff2`);
const CORE = ['./', './math/', './math/derivatives/', './site.json', './manifest.webmanifest', './favicon.svg', './apple-touch-icon.png',
  './icon-192.png',
  './src/shared/totop.css', './src/shared/totop.js', // the home page and the exam picker link these; exam pages have them in math.js
  './math/assets/math.css', './math/assets/math.js', ...KATEX]; // what every exam page shares (the pages ask for them by version)
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
  const fromNet = fetch(req).then(async (res) => {
    if (res && res.ok) await cache.put(req, res.clone());
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
// a file named with its version (?v=…): the saved copy is that exact file. Only the newest version of each is kept,
// beside the plain copy saved at install, which stands in offline when a page asks for a version not saved yet.
async function versioned(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const url = new URL(req.url);
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      for (const k of await cache.keys()) {
        const u = new URL(k.url);
        if (u.pathname === url.pathname && u.search && u.search !== url.search) await cache.delete(k);
      }
      await cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    const saved = await cache.matchAll(req, { ignoreSearch: true });
    if (saved.length) return saved[saved.length - 1];
    throw err;
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
    if (url.searchParams.has('v')) e.respondWith(versioned(req));
    else if (/\.(png|svg|jpg|webp|woff2?)$/.test(url.pathname)) e.respondWith(cacheFirst(req));
    else e.respondWith(networkFirst(req));
  } else if (/^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(cacheFirst(req, FONTS));
  }
});
