// Offline copy of the study site. Pages and data (HTML, JSON): network first, so changes show as soon as you're
// online, with the saved copy when the network is down or slow. Files named with a version (math.css?v=…,
// locked.json?v=…): saved copy first, since a new version comes with a new name. Images and fonts: saved copy first.
// Whatever comes from the network goes to the page as soon as it starts to arrive; the copy is saved alongside (the
// worker stays up for that, waitUntil), so the page never waits for a whole file to be saved first.
// Bump CACHE when the list below changes, or when every page changes at once (a new look), so a device swaps its
// whole saved copy in one go; old caches are deleted on activate.
const CACHE = 'study-notes-v9';
const FONTS = 'study-notes-fonts';
const KATEX = ['AMS-Regular', 'Main-Bold', 'Main-BoldItalic', 'Main-Italic', 'Main-Regular', 'Math-BoldItalic', 'Math-Italic',
  'Size1-Regular', 'Size2-Regular', 'Size3-Regular', 'Size4-Regular'].map((f) => `./math/assets/fonts/KaTeX_${f}.woff2`);
const CORE = ['./', './math/', './math/derivatives/', './math/integrals/', './physics/', './physics/midterm/', './physics/final/', './site.json', './manifest.webmanifest',
  './apple-touch-icon.png', './icon-192.png', './favicon.png', './logo.png', // the app icon, the home page's tab icon and logo
  './favicon-math.svg', './favicon-physics.svg', // each subject's tab icon: its badge
  './src/shared/totop.css', './src/shared/totop.js', // the home page and the exam pickers link these; exam pages have them in their script
  './math/assets/math.css', './math/assets/math.js', // what every Math exam page shares (the pages ask for them by version)
  './physics/assets/physics.css', './physics/assets/physics.js', ...KATEX]; // the same for Physics, which uses Math's KaTeX fonts
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
// Each way of answering gives [the answer for the page, the saving of a copy]. The copy is taken (res.clone()) before
// the answer goes to the page, which then reads it while it arrives.
// Pages and data: the saved copy stands in when the network is down, or sends nothing back within TIMEOUT.
function networkFirst(req) {
  const net = fetch(req);
  const saving = net.then((res) => {
    if (!res || !res.ok) return undefined;
    const copy = res.clone();
    return caches.open(CACHE).then((c) => c.put(req, copy));
  }).catch(() => { /* offline, or the copy couldn't be saved */ });
  const answer = withTimeout(net, TIMEOUT).catch(async () => {
    const cache = await caches.open(CACHE);
    const hit = (await cache.match(req)) || (await cache.match(req, { ignoreSearch: true }));
    if (hit) return hit;
    if (req.mode === 'navigate') {
      const home = await cache.match('./');
      if (home) return home;
    }
    return net; // nothing saved: wait for the network after all
  });
  return [answer, saving];
}
// a file named with its version (?v=…): the saved copy is that exact file. Only the newest version of each is kept,
// beside the plain copy saved at install, which stands in offline when a page asks for a version not saved yet.
function versioned(req) {
  const hit = caches.open(CACHE).then((c) => c.match(req));
  const net = hit.then((h) => (h ? null : fetch(req)));
  const saving = net.then((res) => {
    if (!res || !res.ok) return undefined;
    const copy = res.clone();
    return caches.open(CACHE).then(async (cache) => {
      const url = new URL(req.url);
      for (const k of await cache.keys()) {
        const u = new URL(k.url);
        if (u.pathname === url.pathname && u.search && u.search !== url.search) await cache.delete(k);
      }
      await cache.put(req, copy);
    });
  }).catch(() => { /* offline, or the copy couldn't be saved */ });
  const answer = Promise.all([hit, net]).then(([h, res]) => h || res).catch(async (err) => {
    const saved = await (await caches.open(CACHE)).matchAll(req, { ignoreSearch: true });
    if (saved.length) return saved[saved.length - 1];
    throw err;
  });
  return [answer, saving];
}
function cacheFirst(req, name = CACHE) {
  const hit = caches.open(name).then((c) => c.match(req));
  const net = hit.then((h) => (h ? null : fetch(req)));
  const saving = net.then((res) => {
    if (!res || !(res.ok || res.type === 'opaque')) return undefined;
    const copy = res.clone();
    return caches.open(name).then((c) => c.put(req, copy));
  }).catch(() => { /* offline, or the copy couldn't be saved */ });
  return [Promise.all([hit, net]).then(([h, res]) => h || res), saving];
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  let way = null;
  if (url.origin === self.location.origin) {
    if (url.searchParams.has('v')) way = versioned(req);
    else if (/\.(png|svg|jpg|webp|woff2?)$/.test(url.pathname)) way = cacheFirst(req);
    else way = networkFirst(req);
  } else if (/^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    way = cacheFirst(req, FONTS);
  }
  if (!way) return;
  const [answer, saving] = way;
  e.respondWith(answer);
  e.waitUntil(saving);
});
