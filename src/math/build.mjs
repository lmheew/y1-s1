// Builds the Math section (CLA1 review) of the study site. All math is pre-rendered with KaTeX,
// which is vendored in src/vendor/katex, so the build needs no network and no npm install.
//
//   node src/math/build.mjs site               writes math/index.html, and math/locked.json when SITE_PASSWORD is set
//   node src/math/build.mjs artifact <out>     writes one self-contained page with the in-class sheets in plain view
//   node src/math/build.mjs open               decrypts src/math/private.sealed.json into src/math/private/
//   node src/math/build.mjs seal               encrypts src/math/private/ into src/math/private.sealed.json
//   node src/math/build.mjs rekey              changes the password (SITE_PASSWORD = current, NEW_SITE_PASSWORD = new)
//
// The in-class quiz sheets are private. Their source (src/math/private/, git-ignored) is kept in the repository only
// encrypted, and the site gets them only as math/locked.json, opened in the browser with the password.
// Without SITE_PASSWORD the build keeps the current math/locked.json as it is.
import { createRequire } from 'module';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath, pathToFileURL } from 'url';
import { units, habits, practice } from './content.mjs';
import { tags, formulas, exactValues, BADGE, TAB_ICONS, UI_ICONS, UNIT_ICONS } from './extras.mjs';
import { followups } from './followups.mjs';
import { mocks } from './exams.mjs';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, '..', '..');
const LOCKED = path.join(ROOT, 'math', 'locked.json');
const SEALED = path.join(SRC, 'private.sealed.json');
const PRIVATE = path.join(SRC, 'private');
const KATEX_DIR = process.env.KATEX_DIR || path.join(ROOT, 'src', 'vendor', 'katex');
const require = createRequire(import.meta.url);
const katex = require(path.join(KATEX_DIR, 'katex.min.js'));
const rel = (p) => path.relative(ROOT, p);
// site.json (repository root): exam dates and the "What's new" list, shared with the home page
const SITE = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.json'), 'utf8'));
const fail = (msg) => { console.error('error: ' + msg); process.exit(1); };

// ---------- markup ----------
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tex = (t, display) => katex.renderToString(t, { displayMode: display, throwOnError: true, output: 'htmlAndMathml', strict: 'ignore' });
function inline(src) {
  const store = [];
  let s = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => { store.push({ html: tex(t.trim(), true), short: false }); return `\u0001${store.length - 1}\u0002`; });
  s = s.replace(/\$([^$]+?)\$/g, (_, t) => { store.push({ html: tex(t, false), short: t.length <= 16 }); return `\u0001${store.length - 1}\u0002`; });
  if (s.includes('$')) throw new Error('Unbalanced $ in: ' + src);
  s = esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\((\d+pt[^()]*)\)/g, '<span class="pts">($1)</span>');
  s = s.replace(/\u0001(\d+)\u0002([.,;:)]+)/g, (m, i, p) => (store[+i].short ? `<span class="nw">\u0001${i}\u0002${p}</span>` : m));
  return s.replace(/\u0001(\d+)\u0002/g, (_, i) => store[+i].html);
}
function items(src) {
  const out = [];
  for (const l of src.trim().split('\n')) {
    if (l.trim().startsWith('- ')) out.push(l.trim().slice(2));
    else if (out.length) out[out.length - 1] += '\n' + l;
  }
  return out;
}
function blocks(src) {
  return src.trim().split(/\n\s*\n/).map((b) => {
    if (b.trim().startsWith('- ')) return '<ul>' + items(b).map((i) => `<li>${inline(i)}</li>`).join('') + '</ul>';
    return `<p>${inline(b)}</p>`;
  }).join('');
}
const withPts = (stem, pts) => {
  if (!pts) return stem;
  const i = stem.indexOf('$$');
  return i === -1 ? `${stem} (${pts})` : `${stem.slice(0, i).trimEnd()} (${pts})\n${stem.slice(i)}`;
};

// ---------- plain text for search ----------
const SYM = [['\\mathbb{R}', 'ℝ'], ['\\not\\to', '↛'], ['\\cdots', '⋯'], ['\\ldots', '…'], ['\\cdot', '·'], ['\\times', '×'], ['\\pi', 'π'],
  ['\\theta', 'θ'], ['\\infty', '∞'], ['\\Rightarrow', '⇒'], ['\\iff', '⇔'], ['\\to', '→'], ['\\le', '≤'], ['\\ge', '≥'], ['\\ne', '≠'],
  ['\\pm', '±'], ['\\cup', '∪'], ['\\cap', '∩'], ['\\approx', '≈'], ['\\sum', 'Σ']];
const par = (a) => (/^[\w.√π]+$/.test(a.trim()) ? a.trim() : '(' + a.trim() + ')');
function texPlain(t) {
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
const plain = (src) => src.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (_, a, b) => ' ' + texPlain(a || b) + ' ').replace(/\*\*/g, '').replace(/^- /gm, '')
  .replace(/\s+/g, ' ').replace(/\s+([.,;:)])/g, '$1').replace(/\(\s+/g, '(').trim();
const clip = (s, n = 150) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
const entry = (s, v, id, t, p, extra = '') => ({ s, v, id, t, p: clip(p), k: (t + ' ' + p + ' ' + extra).toLowerCase() });

// ---------- pieces ----------
const toggle = (cls, open, close, body) =>
  `<details class="${cls}"><summary><span class="when-closed">${open}</span><span class="when-open">${close}</span>${UI_ICONS.chevron}</summary><div class="${cls}-body">${body}</div></details>`;
const partsList = (parts, labels) => parts.length
  ? `<ol class="parts">${parts.map((p, i) => `<li><span class="pn">(${labels ? labels[i] : i + 1})</span><span class="pt">${inline(p)}</span></li>`).join('')}</ol>` : '';
const answerBox = (answer) => `<div class="answer"><span class="lbl">Answer</span><ul>${answer.map((a) => `<li>${inline(a)}</li>`).join('')}</ul></div>`;
const MARU = `<svg class="maru" viewBox="0 0 64 40" preserveAspectRatio="none" aria-hidden="true"><path pathLength="100" d="M52 7C41 1 15 2 7 14C1 24 13 36 33 35C50 34 61 25 58 14C56 8 49 4 41 4"/></svg>`;
const band = (en, jp, lede) => `<div class="band"><div class="wrap"><h1 class="band-title"><span class="en">${en}</span><span class="jp" lang="ja">${jp}</span></h1><p class="band-lede">${lede}</p></div></div>`;
const ring = (r, id, cls) => {
  const c = (2 * Math.PI * r).toFixed(2);
  const size = 2 * r + 8;
  return `<svg ${id ? `id="${id}" ` : ''}class="ring ${cls}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${r}"/><circle class="ring-val" data-c="${c}" cx="${size / 2}" cy="${size / 2}" r="${r}" style="stroke-dasharray:${c};stroke-dashoffset:${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
};
// A practice problem's id (the key for its saved mark): its own `id` when it was moved from another unit, else unit number.n
const probId = (u, p, pi) => p.id || `${u.id.slice(1)}.${pi + 1}`;
// "Day 10 & 11" -> "10–11" for the small practice rings
const dayShort = (u) => u.days.replace(/^Day /, '').replace(' & ', '–');
// anything with `added: 'YYYY-MM-DD'` gets a "New" label on the page for two weeks (page.js decides, at view time)
const addedAttr = (o) => (o && o.added ? ` data-added="${esc(o.added)}"` : '');
// interactive graphs (graphs.js draws them when they scroll into view), placed after a unit's key ideas
const GRAPHS = {
  u2: [['secant', 'Secant to tangent', String.raw`Drag $h$ toward $0$. The secant slope $\frac{f(1+h)-f(1)}{h}$ of $f(x)=x^2$ approaches the tangent slope $f'(1)=2$.`]],
  u3: [['implicit', 'Tangent to a circle', String.raw`Move the point around $x^2+y^2=25$. The slope is $y'=-\frac{x}{y}$, and where $y=0$ the tangent is vertical.`]],
  u4: [['concavity', 'Slope and concavity', String.raw`Slide along $f(x)=x^3-3x$. The sign of $f'$ tells increasing or decreasing; the sign of $f''$ tells concave up or down.`]],
  u5: [['newton', "Newton's method", String.raw`Each step follows the tangent at $x_n$ down to the $x$-axis: $x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$, here for $f(x)=x^2-2$ from $x_1=2$.`],
    ['taylor', 'Taylor polynomials', String.raw`Raise the degree: the Taylor polynomial of $\sin x$ about $0$ follows the curve over a wider and wider range.`]],
  u6: [['family', 'One condition picks one curve', String.raw`The equation $y'=\lambda y$ alone gives the whole family $y=Ce^{\lambda x}$, one curve for each $C$. The condition $y(0)=y_0$ picks one of them, with $C=y_0$.`],
    ['second', 'Second order: three cases', String.raw`Solutions of $y''+ay'+by=0$ starting at $y(0)=1$ with $y'(0)=0$. The sign of $\Delta=a^2-4b$ decides the shape, and only $\Delta<0$ oscillates.`]],
};
const GRAPHS_ADDED = '2026-10-29';
const TESTBAR_ADDED = '2026-10-29';
const graphHTML = ([kind, title, note]) => `
  <figure class="explore" id="gx-${kind}" data-graph="${kind}" data-added="${GRAPHS_ADDED}">
    <figcaption class="gx-title"><span class="kicker">Explore</span>${esc(title)}</figcaption>
    <div class="gx-stage"><p class="gx-wait">Loading the graph…</p></div>
    <p class="gx-note">${inline(note)}</p>
  </figure>`;

// ---------- the page ----------
// quizzes: the in-class sheets (from src/math/private/inclass.mjs) or null when they aren't available.
// past: the past midterm papers (src/math/private/past.mjs) or null.
// locked: true for the public site, where in-class sheets and past papers become password panels and their HTML goes to `sheets`.
// lockedNos / lockedPast: what is locked when `quizzes` / `past` are null (taken from math/locked.json).
function render({ quizzes, past, locked, lockedNos, lockedPast = [] }) {
  const INDEX = [];
  const PRIV = [];

  // Summary
  const tilesHTML = units.map((u) => `<button type="button" class="tile" data-goto="summary" data-target="su-${u.id}">${UNIT_ICONS[u.id]}<span class="tile-k">${esc(u.days)}</span><span class="tile-t">${esc(u.title)}</span>${u.quiz ? `<span class="tile-q">${u.quiz}</span>` : ''}</button>`).join('')
    + `<button type="button" class="tile" data-goto="summary" data-target="su-habits">${UNIT_ICONS.habits}<span class="tile-k">Before the exam</span><span class="tile-t">Exam-day habits</span></button>`;
  const summaryHTML = units.map((u) => {
    const ideas = items(u.ideas).map((it, i) => {
      const id = `su-${u.id}-k${i + 1}`;
      const label = (it.match(/^\*\*(.+?)\*\*/) || [, ''])[1].replace(/[:.]$/, '').replace(/\$[^$]*\$/g, (m) => texPlain(m.slice(1, -1)));
      INDEX.push(entry('Summary', 'summary', id, `${label || 'Key idea'} — ${u.title}`, plain(it.replace(/^\*\*.+?\*\*\s*/, '')), u.quiz || u.days));
      return `<li id="${id}">${inline(it)}</li>`;
    }).join('');
    const watch = items(u.watch).map((it, i) => {
      const id = `su-${u.id}-w${i + 1}`;
      INDEX.push(entry('Summary', 'summary', id, `Watch out — ${u.title}`, plain(it), 'mistake slip ' + (u.quiz || u.days)));
      return `<li id="${id}">${inline(it)}</li>`;
    }).join('');
    return `
<section class="unit" id="su-${u.id}"${addedAttr(u)}>
  <header class="unit-head">${UNIT_ICONS[u.id]}<div><p class="kicker">${[u.days, u.dates, u.quiz, u.note].filter(Boolean).map(esc).join(' · ')}</p><h2>${esc(u.title)}</h2></div></header>
  ${u.intro ? `<p class="unit-note">${inline(u.intro)}</p>` : ''}
  <ul class="ideas">${ideas}</ul>
  ${(GRAPHS[u.id] || []).map(graphHTML).join('')}
  <div class="watch"><h3>Watch out</h3><ul>${watch}</ul></div>
</section>`;
  }).join('') + `
<section class="habits" id="su-habits"><h2 class="deco">Exam-day habits</h2><ul>${items(habits).map((it, i) => {
    const id = `su-habits-${i + 1}`;
    INDEX.push(entry('Summary', 'summary', id, 'Exam-day habit', plain(it), 'exam habit tip'));
    return `<li id="${id}">${inline(it)}</li>`;
  }).join('')}</ul></section>`;

  // Practice
  let total = 0;
  const ids = new Set();
  const practiceHTML = units.map((u) => {
    const probs = practice[u.id];
    const cards = probs.map((p, pi) => {
      total++;
      const id = probId(u, p, pi);
      if (ids.has(id)) throw new Error(`two practice problems share the id ${id}`);
      ids.add(id);
      const elId = `prob-${id.replace('.', '-')}`;
      INDEX.push(entry('Practice', 'practice', elId, `Practice · ${u.days} · Q.${pi + 1} — ${p.src}`, plain([p.stem, ...p.parts].join(' ')),
        [tags[id] || '', plain(p.hint || ''), plain(p.answer.join(' ')), u.title].join(' ')));
      const hint = p.hint ? toggle('hint', 'Hint', 'Hide hint', blocks(p.hint)) : '';
      const sol = toggle('sol', 'Show answer', 'Hide answer', answerBox(p.answer) + `<div class="steps">${blocks(p.sol)}</div>
      <div class="markrow"><span>How did it go?</span>
        <button type="button" class="mbtn" data-mark="got" aria-pressed="false"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5"/></svg>Got it</button>
        <button type="button" class="mbtn" data-mark="review" aria-pressed="false"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2v12M4 3h8l-2 3 2 3H4"/></svg>Review again</button>
      </div>`);
      return `
  <article class="prob" id="${elId}" data-id="${id}" data-state="none"${addedAttr(p)}>
    <header class="prob-head"><span class="qno">${MARU}Q.${pi + 1}</span><span class="src">${esc(p.src)}</span><span class="state-tag" aria-live="polite"></span></header>
    <div class="stem">${blocks(p.stem)}</div>
    ${partsList(p.parts)}
    <div class="reveal">${hint}${sol}</div>
  </article>`;
    }).join('');
    return `
<section class="punit" id="p${u.id}">
  <header class="punit-head"><div><p class="kicker">${[u.days, u.quiz ? `like ${u.quiz}` : '', (u.note || '').toLowerCase()].filter(Boolean).map(esc).join(' · ')}</p><h2>${esc(u.title)}</h2></div><span class="ucount">0/${probs.length}</span></header>
  <div class="probs">${cards}</div>
</section>`;
  }).join('');
  const unitRings = units.map((u) => `<button type="button" class="uring" data-goto="practice" data-target="p${u.id}" data-unit="p${u.id}" aria-label="Practice for ${esc(u.days)}: ${esc(u.title)}">${ring(17, '', 'ring-sm')}<span class="uring-no${dayShort(u).length > 3 ? ' long' : ''}">${dayShort(u)}</span><span class="uring-count">0/${practice[u.id].length}</span></button>`).join('');

  // Formulas
  const formulasHTML = formulas.map((g) => `
<section class="fgroup" id="fg-${g.id}"${addedAttr(g)}>
  <h2><span class="kicker">${g.quiz}</span>${esc(g.title)}</h2>
  <div class="frows">${g.rows.map(([name, t], i) => {
    const id = `f-${g.id}-${i + 1}`;
    INDEX.push(entry('Formulas', 'formulas', id, `${name} — ${g.title}`, texPlain(t), 'formula ' + g.quiz));
    return `<div class="frow" id="${id}"><span class="fname">${esc(name)}</span><div class="fmath">${tex('\\displaystyle ' + t, false)}</div></div>`;
  }).join('')}</div>
</section>`).join('');
  INDEX.push(entry('Formulas', 'formulas', 'fg-exact', 'Exact trig values — cos, sin, tan',
    'cos, sin and tan from 0 to π (0° to 180°): 0, π/6, π/4, π/3, π/2, 2π/3, 3π/4, 5π/6, π', 'unit circle special angles table degrees 30 45 60 90 120 135 150 180'));
  const EV = exactValues;
  const evCell = (v) => (v === null ? '<td class="na"><span class="sr">undefined</span></td>' : `<td>${tex('\\displaystyle ' + v, false)}</td>`);
  const evAngle = ([t, d]) => `${tex('\\displaystyle ' + t, false)}<span class="deg">${d}</span>`;
  // wide screens: the slide's layout (angles across); phones: the same table turned so angles run down
  const exactWide = `<table class="exact exact-wide"><thead><tr><th scope="col"><span class="sr">Function</span></th>${EV.angles.map((a) => `<th scope="col">${evAngle(a)}</th>`).join('')}</tr></thead>
  <tbody>${EV.rows.map(([f, vals]) => `<tr><th scope="row">${tex(f, false)}</th>${vals.map(evCell).join('')}</tr>`).join('')}</tbody></table>`;
  const exactTall = `<table class="exact exact-tall"><thead><tr><th scope="col">${tex('x', false)}</th>${EV.rows.map(([f]) => `<th scope="col">${tex(f, false)}</th>`).join('')}</tr></thead>
  <tbody>${EV.angles.map((a, i) => `<tr><th scope="row">${evAngle(a)}</th>${EV.rows.map(([, vals]) => evCell(vals[i])).join('')}</tr>`).join('')}</tbody></table>`;
  const exactHTML = `
<section class="fgroup" id="fg-exact">
  <h2><span class="kicker">No calculator</span>Exact values</h2>
  <div class="table-wrap">${exactWide}${exactTall}</div>
  <p class="exact-note">${inline(String.raw`A slash means undefined: $\tan\frac{\pi}{2}$ doesn't exist because $\cos\frac{\pi}{2}=0$. The forms $\frac{1}{\sqrt{2}}=\frac{\sqrt{2}}{2}$ and $\frac{1}{\sqrt{3}}=\frac{\sqrt{3}}{3}$ are equal, so either is fine in an answer.`)}</p>
</section>`;

  // Quizzes: per quiz, the in-class sheet (or its password panel) plus Follow-up A and B behind a switcher
  const sheets = {};
  // limit in seconds: 0 counts up (quizzes); otherwise it counts down and then shows the overtime (mock exams)
  const timerHTML = (limit) => `<div class="timer" data-timer${limit ? ` data-limit="${limit}"` : ''}><span class="time" aria-live="off">${limit ? `${String(Math.floor(limit / 60)).padStart(2, '0')}:00` : '00:00'}</span><button type="button" class="t-go">${UI_ICONS.timer}<span>Start timer</span></button><button type="button" class="t-reset" hidden>Reset</button></div>`;
  function sheetHTML(sheetId, seg, visible, title, sub, focus, qs, searchLabel, searchExtra, index) {
    return `
  <article class="sheet" id="${sheetId}" data-seg="${seg}"${visible ? '' : ' hidden'}>
    <header class="sheet-head">
      <div><h3 class="sheet-title">${title}</h3><p class="sheet-sub">${sub}</p></div>
      ${timerHTML(0)}
    </header>
    ${focus ? `<p class="focus">${esc(focus)}</p>` : ''}
    ${qs.map((x, i) => {
      const id = `${sheetId}-q${i + 1}`;
      index.push(entry('Quizzes', 'quizzes', id, `${searchLabel} · ${x.label}`, plain([x.stem, ...x.parts].join(' ')), plain(x.answer.join(' ')) + ' ' + searchExtra));
      return `
    <div class="rq" id="${id}">
      <div class="stem">${blocks(withPts(x.stem, x.pts)).replace(/^<p>/, `<p><b class="ql">${x.label}</b> `)}</div>
      ${partsList(x.parts)}
      <div class="reveal">${toggle('sol', 'Show answer', 'Hide answer', answerBox(x.answer) + `<div class="steps">${blocks(x.sol)}</div>`)}</div>
    </div>`;
    }).join('')}
  </article>`;
  }
  const unlockForm = (key, text) => `
    <form class="unlock" novalidate>
      <div class="u-head"><span class="u-icon">${UI_ICONS.lock}</span><div><p class="u-title">Password needed</p><p class="u-text">${text}</p></div></div>
      <div class="u-row">
        <div class="u-field"><label class="sr" for="pw-${key}">Password</label><input id="pw-${key}" name="password" type="password" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Password"><button type="button" class="u-show" aria-pressed="false" aria-controls="pw-${key}">Show</button></div>
        <button type="submit" class="u-go">Unlock</button>
      </div>
      <p class="u-msg" role="status" aria-live="polite"></p>
      <label class="u-remember"><input type="checkbox" name="remember"><span>Remember on this device</span></label>
    </form>`;
  const lockHTML = (no, days) => `
  <article class="sheet lock" id="rq${no}" data-seg="0">
    <header class="sheet-head"><div><h3 class="sheet-title">In-class Quiz ${no}</h3><p class="sheet-sub">${esc(days)} · 10 pt</p></div></header>
    ${unlockForm(no, 'The in-class sheets are locked. Follow-up A and B are open to everyone.')}
  </article>`;
  const nos = [...new Set([...Object.keys(followups), ...(quizzes ? quizzes.map((q) => q.no) : lockedNos)])].sort();
  const quizzesHTML = nos.map((no) => {
    const u = units.find((x) => x.quiz === `Quiz ${no}`) || { title: `Quiz ${no}`, days: '' };
    const q = quizzes && quizzes.find((x) => x.no === no);
    const hasInClass = Boolean(q) || (!quizzes && lockedNos.includes(no));
    const [fa, fb] = followups[no] || [];
    const kinds = [];
    if (hasInClass) kinds.push(['0', '', 'In-class']);
    if (fa) kinds.push(['1', 'a', 'Follow-up A']);
    if (fb) kinds.push(['2', 'b', 'Follow-up B']);
    const first = kinds[0][0];
    let group = '';
    if (q) {
      const html = sheetHTML(`rq${no}`, '0', true, `In-class Quiz ${no}`, `${q.days} · 10 pt`, '', q.qs, `Quiz ${no}`, 'real quiz test in-class', locked ? PRIV : INDEX);
      if (locked) { sheets[`rq${no}`] = html.trim(); group += lockHTML(no, q.days); } else group += html;
    } else if (hasInClass) group += lockHTML(no, u.days);
    if (fa) group += sheetHTML(`rq${no}a`, '1', first === '1', `Follow-up Quiz ${no}-A`, 'Same skills, new numbers · 10 pt', '', fa.qs, `Quiz ${no} Follow-up A`, 'follow-up remedial extra quiz', INDEX);
    if (fb) group += sheetHTML(`rq${no}b`, '2', first === '2', `Follow-up Quiz ${no}-B`, 'Targets common mistakes · 10 pt', fb.focus.replace(/^Targets the usual slips: /, 'Watch for '), fb.qs, `Quiz ${no} Follow-up B`, 'follow-up remedial extra quiz slips', INDEX);
    const lockMark = hasInClass && locked ? `<span class="seg-lock">${UI_ICONS.lock}</span>` : '';
    return `
<section class="qgroup" id="qg${no}">
  <header class="qg-head"><p class="kicker">Quiz ${no}${u.days ? ' · ' + esc(u.days) : ''}</p><h2>${esc(u.title)}</h2></header>
  <div class="seg" role="tablist" aria-label="Quiz ${no} sheets">${kinds.map(([seg, s, label]) =>
    `<button type="button" class="seg-btn" role="tab" data-seg="${seg}" aria-controls="rq${no}${s}" aria-selected="${seg === first}">${label}${seg === '0' ? lockMark : ''}</button>`).join('')}</div>
  ${group}
</section>`;
  }).join('');
  const quizJump = nos.map((no) => `<button type="button" class="chip" data-goto="quizzes" data-target="qg${no}">Quiz ${no}</button>`).join('');
  const quizUnits = units.filter((u) => u.quiz);
  const qnum = (u) => u.quiz.replace(/^Quiz /, '');
  const span = quizUnits.length > 1 ? `Quizzes ${qnum(quizUnits[0])}–${qnum(quizUnits[quizUnits.length - 1])}` : quizUnits[0].quiz;
  const dayNums = units.flatMap((u) => (u.days.match(/\d+/g) || []).map(Number));
  const daySpan = `Days ${Math.min(...dayNums)}–${Math.max(...dayNums)}`;
  const hasLocks = locked && nos.some((no) => (quizzes ? quizzes.some((q) => q.no === no) : lockedNos.includes(no)));

  // Exams: upcoming exams (dates from site.json; page.js shows the countdown) and the mock midterms
  const upcoming = SITE.exams.filter((x) => x.subject === 'math');
  const upcomingHTML = upcoming.map((x, i) => `
      <li class="up-item" data-date="${esc(x.date || '')}" data-time="${esc(x.time || '')}">
        <span class="up-cal" aria-hidden="true">${UI_ICONS.calendar}</span>
        <span class="up-main"><b class="up-name">${esc(x.name)}</b><span class="up-when">${x.date ? '' : 'Date to be announced'}</span></span>
        <span class="up-left" aria-live="off"></span>
      </li>`).join('');
  const MOCK_FOCUS = 'Work on paper, without notes or a calculator. When the time is up, open each answer and tick the parts you got right.';
  const PAST_FOCUS = "A real midterm from an earlier year, retyped. The paper gives no time limit or points, so the timer and the points here are estimates. Work on paper, without notes or a calculator, then open each answer and tick the parts you got right.";
  const totalPts = (m) => m.qs.reduce((t, q) => t + q.pts.reduce((a, b) => a + b, 0), 0);
  function examSheet(m, seg, visible, about, focus, searchExtra, index) {
    const points = totalPts(m);
    const qsHTML = m.qs.map((x, qi) => {
      const id = `${m.id}-q${qi + 1}`;
      const qpts = x.pts.reduce((a, b) => a + b, 0);
      const lab = (pi) => (x.labels ? x.labels[pi] : String(pi + 1));
      index.push(entry('Exams', 'exams', id, `${m.title} · ${x.label} — ${x.topic}`, plain([x.stem, ...x.parts].join(' ')), plain(x.answer.join(' ')) + ' ' + searchExtra));
      const marks = x.pts.map((p, pi) => `<button type="button" class="mk" data-k="${qi + 1}.${pi + 1}" data-pts="${p}" aria-pressed="false">(${lab(pi)}) ${p} pt</button>`).join('');
      return `
    <div class="rq" id="${id}">
      <div class="stem"><p><b class="ql">${x.label}</b> <span class="qtopic">${esc(x.topic)}</span> ${inline(x.stem)} <span class="pts">(${qpts} pt)</span></p></div>
      ${partsList(x.parts.map((t, pi) => `${t} (${x.pts[pi]}pt)`), x.labels)}
      <div class="reveal">${toggle('sol', 'Show answer', 'Hide answer', answerBox(x.answer) + `<div class="steps">${blocks(x.sol)}</div>
      <div class="mkrow"><span>Tick what you got right:</span>${marks}</div>`)}</div>
    </div>`;
    }).join('');
    return `
  <article class="sheet mock" id="${m.id}" data-seg="${seg}" data-mock="${m.id}" data-total="${points}"${visible ? '' : ' hidden'}${addedAttr(m)}>
    <header class="sheet-head">
      <div><h3 class="sheet-title">${esc(m.title)}</h3><p class="sheet-sub">${about ? esc(about) + ' · ' : ''}${m.minutes} min · ${points} pt</p></div>
      ${timerHTML(m.minutes * 60)}
    </header>
    <p class="focus">${focus}</p>
    ${qsHTML}
    <div class="scorebar"><span class="score"><b class="score-val">0</b> / ${points} pt</span><span class="score-note">from the parts you ticked</span><button type="button" class="linkbtn mk-clear">Clear ticks</button></div>
  </article>`;
  }
  const mockSheets = mocks.map((m, mi) => examSheet(m, mi, mi === 0, span, MOCK_FOCUS, 'mock midterm exam practice test', INDEX)).join('');
  // past midterms: locked like the in-class sheets (the panel shows only the title until the password opens it)
  const pastMeta = (p) => ({ id: p.id, seg: p.seg, title: p.title, sub: p.sub, minutes: p.minutes, points: totalPts(p), added: p.added || '' });
  const pastList = past ? past.map(pastMeta) : lockedPast;
  const pastLock = locked && pastList.length > 0;
  const pastLockHTML = (p, seg) => `
  <article class="sheet lock" id="${p.id}" data-seg="${seg}"${seg ? ' hidden' : ''}${addedAttr(p)}>
    <header class="sheet-head"><div><h3 class="sheet-title">${esc(p.title)}</h3><p class="sheet-sub">${esc(p.sub)} · ${p.minutes} min · ${p.points} pt</p></div></header>
    ${unlockForm(p.id, 'The past midterms are locked. The mock exams above are open to everyone.')}
  </article>`;
  let pastSheets = '';
  pastList.forEach((p, pi) => {
    const full = past && past.find((x) => x.id === p.id);
    if (full) {
      const html = examSheet(full, pi, pi === 0, full.sub, PAST_FOCUS, 'past midterm exam previous year real paper', locked ? PRIV : INDEX);
      if (locked) { sheets[p.id] = html.trim(); pastSheets += pastLockHTML(p, pi); } else pastSheets += html;
    } else pastSheets += pastLockHTML(p, pi);
  });
  const pastHTML = pastList.length ? `
    <section class="qgroup mockgroup" id="past">
      <header class="qg-head"><p class="kicker">Real papers from earlier years</p><h2>Past midterms</h2></header>
      <div class="seg" role="tablist" aria-label="Past midterms">${pastList.map((p, pi) =>
    `<button type="button" class="seg-btn" role="tab" data-seg="${pi}" aria-controls="${p.id}" aria-selected="${pi === 0}">${esc(p.seg)}${pastLock ? `<span class="seg-lock">${UI_ICONS.lock}</span>` : ''}<span class="seg-score"></span></button>`).join('')}</div>
      ${pastSheets}
    </section>` : '';
  const examsHTML = `
    <section class="exam-up" id="ex-upcoming">
      <h2 class="sec-title">Upcoming exams</h2>
      <ul class="up-list">${upcomingHTML}</ul>
    </section>
    <section class="qgroup mockgroup" id="mocks">
      <header class="qg-head"><p class="kicker">Practice under exam conditions</p><h2>Mock midterms</h2></header>
      <div class="seg" role="tablist" aria-label="Mock midterms">${mocks.map((m, mi) =>
    `<button type="button" class="seg-btn" role="tab" data-seg="${mi}" aria-controls="${m.id}" aria-selected="${mi === 0}">Mock ${mi + 1}<span class="seg-score"></span></button>`).join('')}</div>
      ${mockSheets}
    </section>${pastHTML}`;

  const TABS = [['summary', 'Summary'], ['practice', 'Practice'], ['formulas', 'Formulas'], ['quizzes', 'Quizzes'], ['exams', 'Exams']];
  // The newest `added` date in each tab, so the tab can show a dot before its content is built
  const newest = (dates) => dates.filter(Boolean).sort().pop() || '';
  const NEWEST = {
    summary: newest([...units.map((u) => u.added), Object.keys(GRAPHS).length ? GRAPHS_ADDED : '']),
    practice: newest(Object.values(practice).flat().map((p) => p.added)),
    formulas: newest([...formulas.map((g) => g.added), TESTBAR_ADDED]),
    quizzes: newest(Object.values(followups).flat().map((f) => f.added)),
    exams: newest([...mocks.map((m) => m.added), ...pastList.map((p) => p.added)]),
  };
  // Summary is built with the page. The other tabs travel as JSON text and are built the first time they open
  // (page.js), so the browser only lays out what is being read; that keeps the first load fast as content grows.
  const LAZY = {
    practice: `
      <div class="overview">
        <div class="ov-main">
          <div class="ring-big-wrap">${ring(38, 'ring-all', 'ring-lg')}<span class="ring-center"><b id="ring-all-text">0/${total}</b><small>got it</small></span></div>
          <div class="ov-side">
            <ul class="legend"><li><i class="k-got"></i><b id="ov-got">0</b> got it</li><li><i class="k-rev"></i><b id="ov-rev">0</b> to review</li><li><i class="k-un"></i><b id="ov-un">${total}</b> not marked</li></ul>
            <button type="button" class="pill" id="random-btn">${UI_ICONS.shuffle}<span>Random problem</span>${UI_ICONS.arrow}</button>
          </div>
        </div>
        <div class="urings" aria-label="Jump to a unit">${unitRings}</div>
      </div>
      <div class="filters" role="group" aria-label="Show">
        <button type="button" class="chip" data-filter="all" aria-pressed="true">All</button>
        <button type="button" class="chip" data-filter="review" aria-pressed="false">To review</button>
        <button type="button" class="chip" data-filter="unmarked" aria-pressed="false">Not marked</button>
      </div>
      <p class="empty-note" id="empty-note" hidden></p>
      ${practiceHTML}
      <div class="reset-row"><button type="button" class="linkbtn" id="reset">Clear all marks</button><span>Marks are saved in this browser only.</span></div>`,
    formulas: `
      <div class="testbar" data-added="${TESTBAR_ADDED}">
        <button type="button" class="pill" id="test-btn" aria-pressed="false">${UI_ICONS.eye}<span>Test me</span></button>
        <p class="test-hint">Hides every formula and exact value. Say it to yourself, then tap to check.</p>
        <button type="button" class="linkbtn" id="test-reset" hidden>Hide all again</button>
      </div>
      ${exactHTML}${formulasHTML}`,
    quizzes: `<nav class="qjump" aria-label="Jump to a quiz">${quizJump}</nav>${quizzesHTML}
      ${hasLocks ? '<div class="reset-row lockrow" id="lockrow" hidden><button type="button" class="linkbtn" id="lock-again">Lock again</button><span>The in-class sheets are open in this browser.</span></div>' : ''}`,
    exams: examsHTML,
  };
  const lazyBox = (v) => `<div class="wrap content" data-lazy="${v}"><p class="lazy-wait">Loading…</p></div>`;
  // raw HTML inside a non-JS <script> is kept as plain text by the browser: no parsing, no escaping needed
  const lazyScripts = Object.entries(LAZY).map(([v, html]) => {
    if (/<\/script|<!--/i.test(html)) throw new Error(`the ${v} tab contains "</script" or "<!--", which can't travel inside a script element`);
    return `<script type="text/x-lazy-html" id="lazy-${v}">${html.trim()}</script>`;
  }).join('\n');
  const body = `
<header class="appbar"><div class="wrap appbar-row">
  <a class="brand" href="#summary" aria-label="CLA1 Review, go to Summary">${BADGE}<span class="brand-text"><b>CLA1 Review</b><small>Calculus &amp; Linear Algebra 1</small></span></a>
  <div class="appbar-actions">
    <button type="button" class="icon-btn" id="theme-btn" data-mode="system" aria-label="Theme: system. Tap to change."><span class="t-system">${UI_ICONS.system}</span><span class="t-light">${UI_ICONS.light}</span><span class="t-dark">${UI_ICONS.dark}</span></button>
    <button type="button" class="search-btn" id="search-btn" aria-label="Search everything">${UI_ICONS.search}</button>
  </div>
</div></header>

<nav class="tabbar" aria-label="Sections"><div class="tabbar-row" role="tablist">
  ${TABS.map(([v, l]) => `<button type="button" class="tab" role="tab" id="tab-${v}" data-view="${v}" aria-controls="view-${v}" aria-selected="${v === 'summary'}"${NEWEST[v] ? ` data-newest="${NEWEST[v]}"` : ''}>${TAB_ICONS[v]}<span>${l}</span></button>`).join('')}
</div></nav>

<main%MAIN_ATTRS%>
  <section id="view-summary" class="view" role="tabpanel" aria-labelledby="tab-summary">
    ${band('Summary', 'まとめ', 'One section per lesson in the course schedule: the key ideas, and the common mistakes to avoid.')}
    <div class="wrap content">
      <nav class="tiles" aria-label="Units">${tilesHTML}</nav>
      ${summaryHTML}
    </div>
  </section>

  <section id="view-practice" class="view" role="tabpanel" aria-labelledby="tab-practice" hidden>
    ${band('Practice', '練習問題', `${total} practice problems, most in the same format as the quizzes. Try each one on paper, open the answer, then mark how it went.`)}
    ${lazyBox('practice')}
  </section>

  <section id="view-formulas" class="view" role="tabpanel" aria-labelledby="tab-formulas" hidden>
    ${band('Formulas', '公式集', `Every formula from ${daySpan} on one page, plus the exact trig values you need without a calculator.`)}
    ${lazyBox('formulas')}
  </section>

  <section id="view-quizzes" class="view" role="tabpanel" aria-labelledby="tab-quizzes" hidden>
    ${band('Quizzes', '小テスト', hasLocks
    ? 'Each quiz has the in-class sheet (password needed) and two open follow-ups: A uses the same skills with new numbers, and B targets common mistakes. Start the timer and work without notes.'
    : 'Each quiz has the in-class sheet and two follow-ups: A uses the same skills with new numbers, and B targets common mistakes. Start the timer and work without notes.')}
    ${lazyBox('quizzes')}
  </section>

  <section id="view-exams" class="view" role="tabpanel" aria-labelledby="tab-exams" hidden>
    ${band('Exams', '試験', `Upcoming exams with a countdown, ${mocks.length} mock exams for Calculus midterm 1 covering ${span}${pastList.length ? `, and ${pastList.length} past midterms${pastLock ? ' (password needed)' : ''}` : ''}. Start the timer, work on paper, then open the answers and mark your paper.`)}
    ${lazyBox('exams')}
  </section>
</main>
${lazyScripts}
`;
  return { body, INDEX, PRIV, sheets, total, hasLocks: hasLocks || pastLock, nos, pastList };
}
// ---------- KaTeX CSS with embedded fonts, plus its license ----------
function katexCSS() {
  const KEEP = /KaTeX_(AMS|Main|Math|Size[1-4])-/;
  let kcss = fs.readFileSync(path.join(KATEX_DIR, 'katex.min.css'), 'utf8');
  kcss = kcss.replace(/@font-face\{[^}]*\}/g, (blk) => {
    const m = blk.match(/url\(fonts\/(KaTeX_[A-Za-z0-9-]+)\.woff2\)/);
    if (!m || !KEEP.test(m[1] + '-')) return '';
    const data = fs.readFileSync(path.join(KATEX_DIR, 'fonts', m[1] + '.woff2')).toString('base64');
    return blk.replace(/src:[^;}]+/, `src:url(data:font/woff2;base64,${data}) format("woff2")`);
  });
  const license = fs.readFileSync(path.join(KATEX_DIR, 'LICENSE.txt'), 'utf8').trim().replace(/\*\//g, '* /');
  return `/* KaTeX 0.16.11 stylesheet and fonts (https://katex.org)\n\n${license}\n*/\n${kcss}`;
}

function foot(site) {
  return `
<footer class="site-foot"><div class="wrap">
  <p class="deco cheer">Good luck on the midterm!</p>
  ${site ? '<p class="foot-links"><a href="../">← All subjects</a></p>' : ''}
  <p class="fine">Study notes for Calculus &amp; Linear Algebra 1. Not an official Kyoto University of Advanced Science page. Every answer was checked numerically before publishing.</p>
  <p class="fine">Math typeset with KaTeX (${site ? '<a href="../src/vendor/katex/LICENSE.txt">MIT License</a>' : 'MIT License'}).</p>
</div></footer>

<div class="search-sheet" id="search" role="dialog" aria-modal="true" aria-label="Search" hidden>
  <div class="search-bar"><div class="wrap search-row">
    <label class="search-field">${UI_ICONS.search}<input id="search-input" type="search" placeholder="Search problems, formulas, notes" autocomplete="off" enterkeyhint="search"></label>
    <button type="button" class="icon-btn" id="search-close" aria-label="Close search">${UI_ICONS.close}</button>
  </div></div>
  <div class="wrap search-results" id="search-results"></div>
</div>`;
}

const FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap">`;
const indexScript = (index) => `<script type="application/json" id="search-index">${JSON.stringify(index).replace(/</g, '\\u003c')}</script>`;
// page.css/page.js are this subject's; the floating calculator and the back-to-top button in src/shared are common to every subject page
const SHARED = path.join(ROOT, 'src', 'shared');
const assets = () => ({
  css: [path.join(SRC, 'page.css'), path.join(SHARED, 'calculator.css'), path.join(SHARED, 'totop.css')].map((f) => fs.readFileSync(f, 'utf8')).join('\n'),
  js: [path.join(SRC, 'page.js'), path.join(SRC, 'graphs.js'), path.join(SHARED, 'totop.js'), path.join(SHARED, 'calculator.js')].map((f) => fs.readFileSync(f, 'utf8')).join('\n'),
  kcss: katexCSS(),
});
const KATEX_TWEAK = '<style>.katex{font-size:1.07em}.katex-display{margin:.5em 0;overflow-x:auto;overflow-y:hidden;padding:2px 0}</style>';

// ---------- encryption (the browser side is in page.js; both must stay in step) ----------
const subtle = globalThis.crypto.subtle;
const ITER = 600000;
const b64 = (buf) => Buffer.from(buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf).toString('base64');
const unb64 = (s) => new Uint8Array(Buffer.from(s, 'base64'));
const normalize = (pw) => pw.toLowerCase().replace(/[\s-]+/g, '');   // so "ABCDE-fghjk" and "abcdefghjk" both work
const readJSON = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
async function deriveKey(pw, salt, iter) {
  const base = await subtle.importKey('raw', new TextEncoder().encode(normalize(pw)), 'PBKDF2', false, ['deriveKey']);
  return subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function sealBox(ring, obj, extra = {}) {
  const iv = crypto.randomBytes(12);
  const ct = await subtle.encrypt({ name: 'AES-GCM', iv }, ring.key, zlib.gzipSync(Buffer.from(JSON.stringify(obj), 'utf8'), { level: 9 }));
  return { v: 1, ...extra, kdf: 'PBKDF2-SHA256', iter: ring.iter, salt: b64(ring.salt), iv: b64(iv), zip: 'gzip', ct: b64(ct) };
}
async function openBox(key, box) {
  const pt = await subtle.decrypt({ name: 'AES-GCM', iv: unb64(box.iv) }, key, unb64(box.ct));
  return JSON.parse(zlib.gunzipSync(Buffer.from(pt)).toString('utf8'));
}
// The key for SITE_PASSWORD. Reuses the salt of the current files, so browsers that chose "Remember on this device"
// stay unlocked after a rebuild, and refuses a password that doesn't open them: a typo here would lock everyone out.
async function keyring(pw, { fresh = false } = {}) {
  if (!pw || !normalize(pw)) fail('set SITE_PASSWORD (the password for the in-class sheets).');
  const current = [readJSON(LOCKED), readJSON(SEALED)].filter(Boolean);
  if (current.length && !fresh) {
    const ring = { salt: unb64(current[0].salt), iter: current[0].iter };
    ring.key = await deriveKey(pw, ring.salt, ring.iter);
    for (const box of current) {
      const key = box.salt === current[0].salt && box.iter === ring.iter ? ring.key : await deriveKey(pw, unb64(box.salt), box.iter);
      try { await openBox(key, box); } catch { fail('that password does not open the current locked files. Check it for typos (to change the password, use `rekey`).'); }
    }
    return ring;
  }
  const ring = { salt: crypto.randomBytes(16), iter: ITER };
  ring.key = await deriveKey(pw, ring.salt, ring.iter);
  return ring;
}
function readPrivateDir() {
  if (!fs.existsSync(PRIVATE)) return null;
  const files = {};
  for (const f of fs.readdirSync(PRIVATE).sort()) {
    const p = path.join(PRIVATE, f);
    if (fs.statSync(p).isFile()) files[f] = fs.readFileSync(p, 'utf8');
  }
  return Object.keys(files).length ? files : null;
}
async function sealedFiles(ring) {
  const box = readJSON(SEALED);
  return box ? (await openBox(ring.key, box)).files : null;
}
async function syncSeal(ring) {
  const local = readPrivateDir();
  if (!local) return false;
  if (JSON.stringify(await sealedFiles(ring)) === JSON.stringify(local)) return false;
  fs.writeFileSync(SEALED, JSON.stringify(await sealBox(ring, { files: local })) + '\n');
  console.log('sealed src/math/private/ into', rel(SEALED));
  return true;
}
// a private module: from src/math/private/ when it's open, else from the sealed copy (needs the password)
async function loadPrivate(ring, file, name) {
  const local = path.join(PRIVATE, file);
  if (fs.existsSync(local)) return (await import(pathToFileURL(local).href + '?t=' + Date.now()))[name];
  if (!ring) return null;
  const files = await sealedFiles(ring);
  if (!files || !files[file]) return null;
  return (await import('data:text/javascript;base64,' + Buffer.from(files[file]).toString('base64')))[name];
}
const loadQuizzes = (ring) => loadPrivate(ring, 'inclass.mjs', 'quizzes');
const loadPast = (ring) => loadPrivate(ring, 'past.mjs', 'past');

// ---------- commands ----------
const PASSWORD = process.env.SITE_PASSWORD || '';

async function buildSite(pw = PASSWORD, { afterRekey = false } = {}) {
  const ring = pw ? await keyring(pw) : null;
  if (ring) await syncSeal(ring);
  else if (!afterRekey && readPrivateDir()) console.warn('note: src/math/private/ exists but SITE_PASSWORD is not set, so the locked in-class sheets were not rebuilt.');
  const quizzes = ring ? await loadQuizzes(ring) : null;
  const past = ring ? await loadPast(ring) : null;
  let box = readJSON(LOCKED);
  const r = render({ quizzes, past, locked: true, lockedNos: box ? box.quizzes : [], lockedPast: (box && box.past) || [] });
  if (quizzes) {
    const payload = { sheets: r.sheets, index: r.PRIV };
    let same = false;
    if (box) { try { same = JSON.stringify(await openBox(ring.key, box)) === JSON.stringify(payload) && JSON.stringify(box.past || []) === JSON.stringify(r.pastList); } catch { same = false; } }
    if (!same) {
      // `past` (titles, minutes, points) stays readable, so a build without the password can still draw the panels
      box = await sealBox(ring, payload, { quizzes: quizzes.map((q) => q.no), past: r.pastList });
      fs.mkdirSync(path.dirname(LOCKED), { recursive: true });
      fs.writeFileSync(LOCKED, JSON.stringify(box) + '\n');
      console.log('wrote', rel(LOCKED), (fs.statSync(LOCKED).size / 1024).toFixed(0) + ' KB · in-class entries:', r.PRIV.length);
    }
  }
  const lockedSrc = r.hasLocks && box
    ? 'locked.json?v=' + crypto.createHash('sha256').update(fs.readFileSync(LOCKED)).digest('hex').slice(0, 10) : '';
  if (r.hasLocks && !lockedSrc) fail('in-class sheets are listed but math/locked.json is missing; build with SITE_PASSWORD.');
  const { css, js, kcss } = assets();
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>CLA1 Midterm Review</title>
<meta name="description" content="Midterm review for Calculus &amp; Linear Algebra 1: key ideas, practice problems with worked solutions, formulas and quizzes.">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#151C17" media="(prefers-color-scheme: dark)">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">
<link rel="manifest" href="../manifest.webmanifest">
${FONT_LINKS}
<style>${css}</style>
<style>${kcss}</style>
${KATEX_TWEAK}
</head>
<body>
${r.body.replace('%MAIN_ATTRS%', lockedSrc ? ` data-locked="${lockedSrc}"` : '')}
${foot(true)}
${indexScript(r.INDEX)}
<script>${js}</script>
</body>
</html>
`;
  const out = path.join(ROOT, 'math', 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log('wrote', rel(out), (html.length / 1024).toFixed(0) + ' KB · problems:', r.total, '· public index entries:', r.INDEX.length,
    '· quizzes:', r.nos.join(' '), r.hasLocks ? '(in-class sheets locked)' : '');
}

async function buildArtifact(out) {
  if (!out) fail('usage: node src/math/build.mjs artifact <out.html>');
  const ring = PASSWORD ? await keyring(PASSWORD) : null;
  const quizzes = await loadQuizzes(ring);
  if (!quizzes) fail('the in-class sheets are needed: run `open` first, or set SITE_PASSWORD.');
  const past = await loadPast(ring);
  const r = render({ quizzes, past, locked: false, lockedNos: [] });
  const { css, js, kcss } = assets();
  // claude.ai artifact: the host supplies the document skeleton, so the page starts at <title>
  const html = `<title>CLA1 Midterm Review</title>
<meta name="claude:viewport-fit-sides" content="cover">
${FONT_LINKS}
<style>${css}</style>
<style>${kcss}</style>
${KATEX_TWEAK}
${r.body.replace('%MAIN_ATTRS%', '')}
${foot(false)}
${indexScript(r.INDEX)}
<script>${js}</script>
`;
  fs.writeFileSync(out, html);
  console.log('wrote', out, (html.length / 1024).toFixed(0) + ' KB · problems:', r.total, '· index entries:', r.INDEX.length);
}

async function openPrivate() {
  const ring = await keyring(PASSWORD);
  const files = await sealedFiles(ring);
  if (!files) fail(`nothing to open: ${rel(SEALED)} is missing.`);
  fs.mkdirSync(PRIVATE, { recursive: true });
  for (const [f, text] of Object.entries(files)) {
    const p = path.join(PRIVATE, f);
    if (fs.existsSync(p) && fs.readFileSync(p, 'utf8') !== text) fail(`src/math/private/${f} has changes that are not sealed yet; run \`seal\` or move the file away first.`);
    fs.writeFileSync(p, text);
  }
  console.log('opened', Object.keys(files).join(', '), 'into src/math/private/ (git-ignored; never commit it)');
}

async function sealPrivate() {
  if (!readPrivateDir()) fail('nothing to seal: src/math/private/ is empty or missing (run `open` first).');
  const ring = await keyring(PASSWORD);
  if (!(await syncSeal(ring))) console.log('src/math/private/ already matches', rel(SEALED));
}

async function rekey() {
  const next = process.env.NEW_SITE_PASSWORD || '';
  if (!normalize(next)) fail('set NEW_SITE_PASSWORD as well.');
  const old = await keyring(PASSWORD);
  const lockedBox = readJSON(LOCKED), sealedBox = readJSON(SEALED);
  const lockedData = lockedBox && await openBox(old.key, lockedBox);
  const sealedData = sealedBox && await openBox(old.key, sealedBox);
  const ring = await keyring(next, { fresh: true });
  if (lockedData) fs.writeFileSync(LOCKED, JSON.stringify(await sealBox(ring, lockedData, { quizzes: lockedBox.quizzes, past: lockedBox.past || [] })) + '\n');
  if (sealedData) fs.writeFileSync(SEALED, JSON.stringify(await sealBox(ring, sealedData)) + '\n');
  console.log('re-encrypted with the new password. Devices that chose "Remember" will ask for it once.');
  await buildSite('', { afterRekey: true });
}

const [cmd, arg] = process.argv.slice(2);
const COMMANDS = { site: () => buildSite(), artifact: () => buildArtifact(arg), open: openPrivate, seal: sealPrivate, rekey };
if (!COMMANDS[cmd]) fail('usage: node src/math/build.mjs site | artifact <out.html> | open | seal | rekey');
await COMMANDS[cmd]();
