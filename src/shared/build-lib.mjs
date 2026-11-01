// Helpers shared by the subject builds (src/math/build.mjs, src/physics/build.mjs): markup with pre-rendered KaTeX
// math, plain text for search, page pieces (answers, timers, password panels), the head of every page, the KaTeX
// stylesheet, the exam pickers' style and script, and the encryption of the locked sheets (page.js opens them in the
// browser; both sides must stay in step). KaTeX is vendored in src/vendor/katex, so no network or npm install is needed.
import { createRequire } from 'module';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { UI_ICONS } from './icons.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const KATEX_DIR = process.env.KATEX_DIR || path.join(ROOT, 'src', 'vendor', 'katex');
const require = createRequire(import.meta.url);
const katex = require(path.join(KATEX_DIR, 'katex.min.js'));
// the live site, for the link preview (Open Graph) that apps show when the page is shared; the image is drawn by src/og.py
export const SITE_URL = 'https://lmheew.github.io/y1-s1/';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtDate = (d) => { const [y, m, day] = d.split('-').map(Number); return `${day} ${MONTHS[m - 1]} ${y}`; };

// ---------- markup ----------
export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const tex = (t, display) => katex.renderToString(t, { displayMode: display, throwOnError: true, output: 'htmlAndMathml', strict: 'ignore' });
// big: fractions in inline math are drawn full size (\displaystyle), as in problems, answers and solutions; the
// Summary's running text passes false and keeps its small fractions such as π/2, with its key formulas on their own lines
export function inline(src, big = true) {
  const store = [];
  let s = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => { store.push({ html: tex(t.trim(), true), short: false }); return `\u0001${store.length - 1}\u0002`; });
  // a . or , right after longer math goes inside it, so the mark can't start a line by itself (the math may wrap)
  s = s.replace(/\$([^$]+?)\$([.,])?/g, (_, t, p) => {
    const short = t.length <= 16, glue = Boolean(p) && !short;
    const full = big && /\\frac/.test(t) && !/\\displaystyle/.test(t) ? '\\displaystyle ' : '';
    store.push({ html: tex(full + t + (glue ? p : ''), false), short });
    return `\u0001${store.length - 1}\u0002` + (p && !glue ? p : '');
  });
  if (s.includes('$')) throw new Error('Unbalanced $ in: ' + src);
  s = esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\((\d+pt[^()]*)\)/g, '<span class="pts">($1)</span>');
  s = s.replace(/\u0001(\d+)\u0002([.,;:)]+)/g, (m, i, p) => (store[+i].short ? `<span class="nw">\u0001${i}\u0002${p}</span>` : m));
  return s.replace(/\u0001(\d+)\u0002/g, (_, i) => store[+i].html);
}
export function items(src) {
  const out = [];
  for (const l of src.trim().split('\n')) {
    if (l.trim().startsWith('- ')) out.push(l.trim().slice(2));
    else if (out.length) out[out.length - 1] += '\n' + l;
  }
  return out;
}
export function blocks(src, big = true) {
  return src.trim().split(/\n\s*\n/).map((b) => {
    if (b.trim().startsWith('- ')) return '<ul>' + items(b).map((i) => `<li>${inline(i, big)}</li>`).join('') + '</ul>';
    return `<p>${inline(b, big)}</p>`;
  }).join('');
}
export const withPts = (stem, pts) => {
  if (!pts) return stem;
  const i = stem.indexOf('$$');
  return i === -1 ? `${stem} (${pts})` : `${stem.slice(0, i).trimEnd()} (${pts})\n${stem.slice(i)}`;
};

// ---------- plain text for search ----------
const SYM = [['\\mathbb{R}', 'ℝ'], ['\\not\\to', '↛'], ['\\cdots', '⋯'], ['\\ldots', '…'], ['\\cdot', '·'], ['\\times', '×'], ['\\pi', 'π'],
  ['\\theta', 'θ'], ['\\infty', '∞'], ['\\Rightarrow', '⇒'], ['\\iff', '⇔'], ['\\to', '→'], ['\\le', '≤'], ['\\ge', '≥'], ['\\ne', '≠'],
  ['\\pm', '±'], ['\\cup', '∪'], ['\\cap', '∩'], ['\\approx', '≈'], ['\\sum', 'Σ']];
const par = (a) => (/^[\w.√π]+$/.test(a.trim()) ? a.trim() : '(' + a.trim() + ')');
export function texPlain(t) {
  let s = t.replace(/\\\\(\[[^\]]*\])?/g, '; ').replace(/\\(left|right|bigg|Bigg|big|Big|displaystyle|limits)(?![a-zA-Z])/g, '')
    .replace(/\\[!,;:]/g, ' ').replace(/\\ /g, ' ').replace(/\\q?quad/g, ' ').replace(/\\text\{([^{}]*)\}/g, '$1')
    .replace(/\\begin\{[a-z]*\}|\\end\{[a-z]*\}/g, ' ').replace(/&/g, ' ')
    .replace(/\\sum_\{([^{}]*)\}\^\{([^{}]*)\}/g, 'Σ($1 to $2) ');
  for (let i = 0; i < 5; i++) s = s.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, a, b) => `${par(a)}/${par(b)}`);
  s = s.replace(/\\sqrt\{([^{}]*)\}/g, (_, a) => '√' + par(a)).replace(/\\sqrt(\w)/g, '√$1');
  for (const [k, v] of SYM) s = s.split(k).join(v);
  s = s.replace(/\\(arcsin|arccos|arctan|sin|cos|tan|cot|sec|csc|ln|log|lim|max|min)/g, '$1');
  s = s.replace(/\^\{([^{}]*)\}/g, '^($1)').replace(/_\{([^{}]*)\}/g, '_$1').replace(/\^2(?!\d)/g, '²').replace(/\^3(?!\d)/g, '³');
  return s.replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '').replace(/\s*([→≤≥≠±·×=])\s*/g, ' $1 ').replace(/\s+/g, ' ').trim();
}
export const plain = (src) => src.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (_, a, b) => ' ' + texPlain(a || b) + ' ').replace(/\*\*/g, '').replace(/^- /gm, '')
  .replace(/\s+/g, ' ').replace(/\s+([.,;:)])/g, '$1').replace(/\(\s+/g, '(').trim();
export const clip = (s, n = 150) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
export const entry = (s, v, id, t, p, extra = '') => ({ s, v, id, t, p: clip(p), k: (t + ' ' + p + ' ' + extra).toLowerCase() });

// ---------- pieces ----------
export const toggle = (cls, open, close, body) =>
  `<details class="${cls}"><summary><span class="when-closed">${open}</span><span class="when-open">${close}</span>${UI_ICONS.chevron}</summary><div class="${cls}-body">${body}</div></details>`;
export const partsList = (parts, labels) => parts.length
  ? `<ol class="parts">${parts.map((p, i) => `<li><span class="pn">(${labels ? labels[i] : i + 1})</span><span class="pt">${inline(p)}</span></li>`).join('')}</ol>` : '';
export const answerBox = (answer) => `<div class="answer"><span class="lbl">Answer</span><ul>${answer.map((a) => `<li>${inline(a)}</li>`).join('')}</ul></div>`;
export const MARU = `<svg class="maru" viewBox="0 0 64 40" preserveAspectRatio="none" aria-hidden="true"><path pathLength="100" d="M52 7C41 1 15 2 7 14C1 24 13 36 33 35C50 34 61 25 58 14C56 8 49 4 41 4"/></svg>`;
export const band = (en, jp, lede) => `<div class="band"><div class="wrap"><h1 class="band-title"><span class="en">${en}</span><span class="jp" lang="ja">${jp}</span></h1><p class="band-lede">${lede}</p></div></div>`;
export const ring = (r, id, cls) => {
  const c = (2 * Math.PI * r).toFixed(2);
  const size = 2 * r + 8;
  return `<svg ${id ? `id="${id}" ` : ''}class="ring ${cls}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${r}"/><circle class="ring-val" data-c="${c}" cx="${size / 2}" cy="${size / 2}" r="${r}" style="stroke-dasharray:${c};stroke-dashoffset:${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
};

// anything with `added: 'YYYY-MM-DD'` gets a "New" label on the page for two weeks (page.js decides, at view time)
export const addedAttr = (o) => (o && o.added ? ` data-added="${esc(o.added)}"` : '');
// a " · " line of short facts ("Day 1 & 2 · 8 & 9 Oct · Quiz 01", "60 min · 60 pt"): it may wrap between them, never inside one
export const meta = (parts) => parts.filter(Boolean).map((t) => (t.length <= 24 ? `<span class="nw">${esc(t)}</span>` : esc(t))).join(' · ');

// limit in seconds: 0 counts up (quizzes); otherwise it counts down and then shows the overtime (mock exams)
export const timerHTML = (limit) => `<div class="timer" data-timer${limit ? ` data-limit="${limit}"` : ''}><span class="time" aria-live="off">${limit ? `${String(Math.floor(limit / 60)).padStart(2, '0')}:00` : '00:00'}</span><button type="button" class="t-go">${UI_ICONS.timer}<span>Start timer</span></button><button type="button" class="t-reset" hidden>Reset</button></div>`;

export const unlockForm = (key, text) => `
    <form class="unlock" novalidate>
      <div class="u-head"><span class="u-icon">${UI_ICONS.lock}</span><div><p class="u-title">Password needed</p><p class="u-text">${text}</p></div></div>
      <div class="u-row">
        <div class="u-field"><label class="sr" for="pw-${key}">Password</label><input id="pw-${key}" name="password" type="password" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Password"><button type="button" class="u-show" aria-pressed="false" aria-controls="pw-${key}">Show</button></div>
        <button type="submit" class="u-go">Unlock</button>
      </div>
      <p class="u-msg" role="status" aria-live="polite"></p>
      <label class="u-remember"><input type="checkbox" name="remember"><span>Remember on this device</span></label>
    </form>`;

// ---------- KaTeX CSS with the fonts it needs, plus its license ----------
// fontUrl(name) gives each font's address (the site's shared files); without it the fonts are embedded (the artifact)
const KATEX_FONTS = /KaTeX_(AMS|Main|Math|Size[1-4])-/;
export function katexCSS(fontUrl) {
  let kcss = fs.readFileSync(path.join(KATEX_DIR, 'katex.min.css'), 'utf8');
  kcss = kcss.replace(/@font-face\{[^}]*\}/g, (blk) => {
    const m = blk.match(/url\(fonts\/(KaTeX_[A-Za-z0-9-]+)\.woff2\)/);
    if (!m || !KATEX_FONTS.test(m[1] + '-')) return '';
    const src = fontUrl ? fontUrl(m[1]) : `data:font/woff2;base64,${fs.readFileSync(path.join(KATEX_DIR, 'fonts', m[1] + '.woff2')).toString('base64')}`;
    return blk.replace(/src:[^;}]+/, `src:url(${src}) format("woff2")`);
  });
  const license = fs.readFileSync(path.join(KATEX_DIR, 'LICENSE.txt'), 'utf8').trim().replace(/\*\//g, '* /');
  return `/* KaTeX 0.16.11 stylesheet and fonts (https://katex.org)\n\n${license}\n*/\n${kcss}`;
}

export const FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap">`;
export const indexScript = (index) => `<script type="application/json" id="search-index">${JSON.stringify(index).replace(/</g, '\\u003c')}</script>`;

export const readAll = (files) => files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
export const KATEX_TWEAK = '.katex{font-size:1.07em}.katex-display{margin:.5em 0;overflow-x:auto;overflow-y:hidden;padding:2px 0}';

export const hash = (data) => crypto.createHash('sha256').update(data).digest('hex').slice(0, 10);
export const writeIfChanged = (file, data) => {
  const buf = Buffer.from(data);
  if (fs.existsSync(file) && fs.readFileSync(file).equals(buf)) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buf);
};

// the theme picked on any page (light or dark), set before the first paint; page.js takes over from there
export const THEME_EARLY = `<script>try{var t=(JSON.parse(localStorage.getItem('cla1-midterm-review')||'null')||{}).theme;if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);document.documentElement.setAttribute('data-theme-early','')}}catch(e){}</script>`;
export const HEAD_COMMON = (up, dark = '#151C17') => `<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${dark}" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${up}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${up}apple-touch-icon.png">
<link rel="manifest" href="${up}manifest.webmanifest">`;
// a link preview (Open Graph): what LINE, Discord and others show when the page is shared; src/og.py draws the image
export const ogTags = ({ title, description, url, image, alt }) => `<meta property="og:type" content="website">
<meta property="og:site_name" content="Study Notes">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${SITE_URL}${url}">
<meta property="og:image" content="${SITE_URL}${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${alt}">
<meta name="twitter:card" content="summary_large_image">`;

// ---------- encryption (the browser side is in page.js; both must stay in step) ----------
const subtle = globalThis.crypto.subtle;
export const ITER = 600000;
export const b64 = (buf) => Buffer.from(buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf).toString('base64');
export const unb64 = (s) => new Uint8Array(Buffer.from(s, 'base64'));
export const normalize = (pw) => pw.toLowerCase().replace(/[\s-]+/g, '');   // so "ABCDE-fghjk" and "abcdefghjk" both work
export const readJSON = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
export async function deriveKey(pw, salt, iter) {
  const base = await subtle.importKey('raw', new TextEncoder().encode(normalize(pw)), 'PBKDF2', false, ['deriveKey']);
  return subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
export async function sealBox(ring, obj, extra = {}) {
  const iv = crypto.randomBytes(12);
  const ct = await subtle.encrypt({ name: 'AES-GCM', iv }, ring.key, zlib.gzipSync(Buffer.from(JSON.stringify(obj), 'utf8'), { level: 9 }));
  return { v: 1, ...extra, kdf: 'PBKDF2-SHA256', iter: ring.iter, salt: b64(ring.salt), iv: b64(iv), zip: 'gzip', ct: b64(ct) };
}
export async function openBox(key, box) {
  const pt = await subtle.decrypt({ name: 'AES-GCM', iv: unb64(box.iv) }, key, unb64(box.ct));
  return JSON.parse(zlib.gunzipSync(Buffer.from(pt)).toString('utf8'));
}

export const PICKER_CSS = `
/* the exam picker: one card per exam, like the home page's subject cards; there is no tab bar on this page */
body.picker { padding-bottom: 0; --totop-bottom: calc(20px + env(safe-area-inset-bottom, 0px)); }
.picker .wrap { max-width: 760px; } /* no side menu here, so wide screens keep the home page's width */
.picker .site-foot .wrap { padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px)); }
.exams { display: grid; gap: 14px; }
.exam { display: grid; grid-template-columns: auto minmax(0, 1fr); align-content: start; gap: 4px 14px; padding: 16px;
  border: 1.5px solid var(--green); border-radius: 4px; background: var(--surface); color: var(--ink); text-decoration: none; }
.exam.soon { border-style: dashed; }
.exam .tile-ic { grid-row: span 2; width: 52px; height: 52px; }
.exam.soon .tile-ic { opacity: .55; }
.e-head { display: grid; align-content: center; min-width: 0; }
.e-head .kicker { display: block; }
.e-title { margin-top: 2px; font-size: 21px; font-weight: 700; line-height: 1.3; text-wrap: balance; }
.e-text, .e-stats, .e-foot { grid-column: 2; }
.e-text { font-size: 14.5px; color: var(--ink-soft); }
.e-stats { font-size: 13px; font-weight: 700; color: var(--green-text); }
.e-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 12px; margin-top: 8px; }
.e-when { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; font-size: 13.5px; color: var(--ink-soft); }
.e-when .ic { width: 18px; height: 18px; color: var(--green-text); }
.e-left { font-weight: 700; color: var(--green-text); font-variant-numeric: tabular-nums; }
.e-left:empty { display: none; }
.e-when.soon .e-left { color: var(--amber); }
.e-when.past .e-left { color: var(--ink-soft); }
.e-soon { display: inline-block; padding: 5px 12px; border: 1.5px solid var(--green); border-radius: 999px; color: var(--green-text);
  font-size: 13px; font-weight: 700; line-height: 1.2; }
@media (hover: hover) { a.exam:hover { background: var(--tint); } a.exam:hover .pill { background: var(--bar-active); } }
@media (min-width: 640px) { .exam { padding: 18px 20px; } }`;
export const PICKER_JS = `(() => {
  const DAY = 86400000;
  // countdowns in Japan time, like the Exams tab
  const today = new Date(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' }) + 'T00:00:00+09:00').getTime();
  document.querySelectorAll('.e-when[data-date]').forEach((el) => {
    const days = Math.round((new Date(el.dataset.date + 'T00:00:00+09:00').getTime() - today) / DAY);
    el.querySelector('.e-left').textContent = days < 0 ? 'Done' : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : 'in ' + days + ' days';
    el.classList.toggle('soon', days >= 0 && days <= 7);
    el.classList.toggle('past', days < 0);
  });
  // New: an exam page updated in the last 14 days that this device hasn't opened since (study-seen, kept by the exam pages)
  let seen = {};
  try { seen = JSON.parse(localStorage.getItem('study-seen') || 'null') || {}; } catch (e) { /* storage unavailable */ }
  const fresh = (d) => { const t = new Date(d + 'T00:00:00+09:00').getTime(); return Date.now() - t < 14 * DAY && Date.now() >= t - DAY; };
  document.querySelectorAll('.exam[data-updated]').forEach((card) => {
    const d = card.dataset.updated;
    if (fresh(d) && !(seen[card.dataset.seen] >= d)) card.querySelector('.e-title').insertAdjacentHTML('beforeend', ' <span class="new-pill">New</span>');
  });
  // offline: the site's service worker, as on every page
  if ('serviceWorker' in navigator && /\\.github\\.io$|^localhost$/.test(location.hostname)) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => { /* ignore */ }); });
  }
})();`;
