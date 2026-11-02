// Builds the Physics section (Engineering Physics 1) of the study site, the way src/math/build.mjs builds Math. All
// math is pre-rendered with KaTeX (vendored), so the build needs no network and no npm install.
//
//   node src/physics/build.mjs site     writes physics/index.html (the exam picker), physics/midterm/index.html and
//                                       physics/assets/, and physics/midterm/locked.json when SITE_PASSWORD is set
//   node src/physics/build.mjs open     decrypts src/physics/private.sealed.json into src/physics/private/
//   node src/physics/build.mjs seal     encrypts src/physics/private/ into src/physics/private.sealed.json
//   node src/physics/build.mjs rekey    re-encrypts with NEW_SITE_PASSWORD; run it right after Math's `rekey`
//
// The exercise sheets from class are private, like Math's in-class quizzes: their source (src/physics/private/,
// git-ignored) is in the repository only encrypted, and the site gets them as physics/midterm/locked.json, opened in
// the browser with the password. Physics uses Math's password and Math's salt, so the key a device remembers for one
// subject opens the other too. Without SITE_PASSWORD the build keeps the current locked.json as it is.
//
// The pages run on the shared page script and style (src/math/page.js and page.css, with the calculator and the
// back-to-top button) in Physics colours (physics.css). They use the KaTeX fonts in math/assets/fonts.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { fmtDate, esc, tex, inline, items, blocks, plain, entry, toggle, band, addedAttr, meta, timerHTML, unlockForm, katexCSS, FONT_LINKS,
  indexScript, readAll, KATEX_TWEAK, hash, writeIfChanged, THEME_EARLY, HEAD_COMMON, ogTags, unb64, normalize, readJSON, deriveKey,
  sealBox, openBox, PICKER_CSS, PICKER_JS } from '../shared/build-lib.mjs';
import { TAB_ICONS, UI_ICONS, subjectSwitch } from '../shared/icons.mjs';
import { chapters, EXAMS, BADGE, CH_ICONS, EXAM_ICONS } from './content.mjs';
import { sets } from './quizzes.mjs';
import { summary, habits, SUMMARY_ADDED } from './summary.mjs';
import { fgroups, constants, trig, FORMULAS_ADDED } from './formulas.mjs';
import { figHTML } from './figures.mjs';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, '..', '..');
const PHYS = path.join(ROOT, 'physics');
const PAGE_DIR = path.join(PHYS, 'midterm');
const ASSETS = path.join(PHYS, 'assets');
const LOCKED = path.join(PAGE_DIR, 'locked.json');
const SEALED = path.join(SRC, 'private.sealed.json');
const PRIVATE = path.join(SRC, 'private');
const MATH_LOCKED = path.join(ROOT, 'math', 'derivatives', 'locked.json'); // the salt both subjects use
const MATH_FONTS = path.join(ROOT, 'math', 'assets', 'fonts');
const rel = (p) => path.relative(ROOT, p);
const fail = (msg) => { console.error('error: ' + msg); process.exit(1); };
const SITE = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.json'), 'utf8'));
// "Last updated": the newest What's new date for Physics (site.json) or `added` date on this page
const LAST_UPDATED = [...SITE.news.filter((n) => n.subject === 'physics' || n.subject === 'all').map((n) => n.date), ...sets.map((s) => s.added),
  SUMMARY_ADDED, FORMULAS_ADDED]
  .filter(Boolean).sort().pop() || '2026-11-01';
// the page's settings for page.js (see the top of src/math/page.js)
const PAGE_CONF = { store: 'ep1-midterm-review', seen: 'physics', home: 'summary', scores: 'ep1-mock-scores',
  suggest: ['projectile', 'friction', 'cross product', 'work', 'terminal speed', 'potential energy'], tryWords: '"friction" or "vector"' };

// ---------- markup ----------
// plain text for search: Greek letters and vector marks the shared texPlain doesn't know
const GREEK = { mu: 'μ', varphi: 'φ', phi: 'φ', Delta: 'Δ', omega: 'ω', tau: 'τ', alpha: 'α', beta: 'β', lambda: 'λ' };
const greek = (s) => s.replace(/\\(mu|varphi|phi|Delta|omega|tau|alpha|beta|lambda)(?![a-zA-Z])/g, (_, g) => GREEK[g])
  .replace(/\\hat\s*\{?([ijk])\}?/g, '$1̂').replace(/\\vec\s*\{([^{}]*)\}/g, '$1').replace(/\\vec\s*([A-Za-z])/g, '$1');
const plainP = (s) => plain(greek(s));
// The blocks of a stem or a solution. A paragraph followed by "- " lines in the same block is split there, so the
// lines become a list under it (and, in a solution, one step each); a block that is only [[fig:id]] is that figure.
const splitLists = (src) => src.trim().split(/\n\s*\n/).flatMap((b) => {
  const out = [];
  let cur = [];
  for (const ln of b.split('\n')) {
    if (ln.trimStart().startsWith('- ') && cur.length && !cur[0].trimStart().startsWith('- ')) { out.push(cur.join('\n')); cur = []; }
    cur.push(ln);
  }
  if (cur.length) out.push(cur.join('\n'));
  return out;
});
const blocksF = (src) => splitLists(src).map((b) => {
  const m = b.trim().match(/^\[\[fig:([\w-]+)\]\]$/);
  return m ? figHTML(m[1]) : blocks(b);
}).join('');
const figsHTML = (fig) => {
  const ids = fig ? [].concat(fig) : [];
  return ids.length > 1 ? `<div class="pfig-row">${ids.map(figHTML).join('')}</div>` : ids.map(figHTML).join('');
};
const soon = (text) => `<p class="soon-box">${UI_ICONS.calendar}<span>${esc(text)}</span></p>`;
const printTools = `<div class="sheet-tools"><button type="button" class="linkbtn print-btn" data-print="paper">${UI_ICONS.print}<span>Print paper</span></button><button type="button" class="linkbtn print-btn" data-print="key">${UI_ICONS.print}<span>Print with answers</span></button></div>`;

// One problem of a sheet: "Problem 3" with its topic, the stem and figures, the parts labelled like the sheet (3-1,
// 3-2; `labels` overrides them), and the answer box with the worked steps (one step per block of `sol`).
function problemHTML(sh, p, index, searchExtra) {
  const no = p.no;
  const id = `${sh.id}-p${no.replace('.', '-')}`;
  const labels = p.labels || p.parts.map((_, i) => `${no}-${i + 1}`);
  if (labels.length !== p.parts.length) throw new Error(`${id}: ${labels.length} labels for ${p.parts.length} parts`);
  if (p.answer.length !== Math.max(1, p.parts.length)) throw new Error(`${id}: ${p.answer.length} answers for ${p.parts.length} parts`);
  index.push(entry('Quizzes', 'quizzes', id, `${sh.title} · Problem ${no} — ${p.topic}`, plainP([p.stem || '', ...p.parts].join(' ')),
    plainP(p.answer.join(' ')) + ' ' + searchExtra));
  const long = labels.some((l) => l.length > 4);
  const parts = p.parts.length
    ? `<ol class="parts${long ? ' long' : ''}">${p.parts.map((t, i) => `<li><span class="pn">${esc(labels[i])}</span><span class="pt">${inline(t)}</span></li>`).join('')}</ol>` : '';
  const ans = `<div class="answer"><span class="lbl">Answer</span><ul>${p.answer.map((a, i) => (p.parts.length
    ? `<li><b class="al">${esc(labels[i])}</b><span>${inline(a)}</span></li>` : `<li class="solo">${inline(a)}</li>`)).join('')}</ul></div>`;
  return `
    <div class="rq prq" id="${id}">
      <div class="rq-head"><b class="ql">Problem ${esc(no)}</b><span class="qtopic-wrap"><span class="qtopic">${esc(p.topic)}</span></span></div>
      ${p.stem ? `<div class="stem">${blocksF(p.stem)}</div>` : ''}${figsHTML(p.fig)}${parts}
      <div class="reveal">${toggle('sol', 'Show answer', 'Hide answer', ans + `<div class="steps">${blocksF(p.sol)}</div>`)}</div>
    </div>`;
}
function sheetHTML(sh, seg, visible, index, searchExtra) {
  return `
  <article class="sheet psheet" id="${sh.id}" data-seg="${seg}"${visible ? '' : ' hidden'}${addedAttr(sh)}>
    <header class="sheet-head">
      <div><h3 class="sheet-title">${esc(sh.title)}</h3><p class="sheet-sub">${meta([...sh.sub.split(' · '), `${sh.problems.length} problems`])}</p></div>
      ${timerHTML(0)}
    </header>
    ${sh.focus ? `<p class="focus">${inline(sh.focus)}</p>` : ''}
    ${printTools}
    ${sh.problems.map((p) => problemHTML(sh, p, index, searchExtra)).join('')}
  </article>`;
}
// ---------- Summary: each module's key ideas and its worked example ----------
// A worked example: the problem, its parts (a), (b) …, and the answer with the worked steps (one step per block).
function exampleHTML(c, no, title, ex, index) {
  const id = `su-${c.id}-x${no.replace('-', '')}`;
  const labels = ex.parts.map((_, i) => `(${String.fromCharCode(97 + i)})`);
  if (ex.answer.length !== Math.max(1, ex.parts.length)) throw new Error(`${id}: ${ex.answer.length} answers for ${ex.parts.length} parts`);
  index.push(entry('Summary', 'summary', id, `Worked example ${no} — ${title}`, plainP([ex.stem || '', ...ex.parts].join(' ')),
    'example worked ' + plainP(ex.answer.join(' ')) + ' ' + c.keys));
  const parts = ex.parts.length
    ? `<ol class="parts">${ex.parts.map((t, i) => `<li><span class="pn">${labels[i]}</span><span class="pt">${inline(t)}</span></li>`).join('')}</ol>` : '';
  const ans = `<div class="answer"><span class="lbl">Answer</span><ul>${ex.answer.map((a, i) => (ex.parts.length
    ? `<li><b class="al">${labels[i]}</b><span>${inline(a)}</span></li>` : `<li class="solo">${inline(a)}</li>`)).join('')}</ul></div>`;
  return `
    <article class="wex prq" id="${id}">
      <div class="rq-head"><b class="ql">Worked example</b><span class="qtopic-wrap"><span class="qtopic">${esc(no)}</span></span></div>
      ${ex.stem ? `<div class="stem">${blocksF(ex.stem)}</div>` : ''}${figsHTML(ex.fig)}${parts}
      <div class="reveal">${toggle('sol', 'Show solution', 'Hide solution', ans + `<div class="steps">${blocksF(ex.sol)}</div>`)}</div>
    </article>`;
}
// a bold label at the start of a point, as plain text for search
const pointLabel = (it) => (it.match(/^\*\*(.+?)\*\*/) || [, ''])[1].replace(/[:.]$/, '').replace(/\$[^$]*\$/g, (m) => plainP(m));
function moduleHTML(c, [no, title], index) {
  const m = summary[c.id].mods.find((x) => x.no === no);
  if (!m) throw new Error(`summary.mjs has no module ${no}`);
  const ideas = items(m.ideas).map((it, i) => {
    const id = `su-${c.id}-${no.replace('-', '')}-k${i + 1}`;
    index.push(entry('Summary', 'summary', id, `${pointLabel(it) || 'Key idea'} — ${no} ${title}`, plainP(it.replace(/^\*\*.+?\*\*\s*/, '')), c.keys));
    return `<li id="${id}">${inline(it, false)}</li>`;
  }).join('');
  return `
  <div class="smod" id="su-${c.id}-m${no.replace('-', '')}">
    <h3 class="smod-h"><span class="mod-no">${esc(no)}</span>${esc(title)}</h3>
    <ul class="ideas">${ideas}</ul>
    ${exampleHTML(c, no, title, m.ex, index)}
  </div>`;
}

// ---------- Formulas: one row per formula, with its importance or an Extra tag ----------
const STARS = { 3: ['★★★', 'Core, used all the time'], 2: ['★★', 'Key result'], 1: ['★', 'Supporting'] };
function formulaRow(id, [name, t, s, note], where, keys, index) {
  if (s !== 'x' && !STARS[s]) throw new Error(`${id}: importance must be 1, 2, 3 or 'x', not ${s}`);
  index.push(entry('Formulas', 'formulas', id, `${name} — ${where}`, plainP('$' + t + '$') + (note ? ' · ' + plainP(note) : ''),
    'formula ' + (s === 'x' ? 'extra ' : '') + keys));
  const tag = s === 'x' ? '<span class="xtag">Extra</span>'
    : `<span class="stars" title="${STARS[s][1]}"><span class="sr">${STARS[s][1]}</span><span aria-hidden="true">${STARS[s][0]}</span></span>`;
  return `<div class="frow${s === 'x' ? ' fx' : ''}" id="${id}"><span class="fname">${esc(name)} ${tag}</span><div class="fmath">${tex('\\displaystyle ' + t, false)}</div>${note ? `<p class="fnote">${inline(note, false)}</p>` : ''}</div>`;
}

// what the page shows of a locked sheet: its title and a password panel (also kept readable in locked.json)
const sheetMeta = (sh) => ({ id: sh.id, seg: sh.seg, title: sh.title, sub: sh.sub, n: sh.problems.length, added: sh.added || '' });
const lockPanel = (x, seg, visible) => `
  <article class="sheet lock" id="${x.id}" data-seg="${seg}"${visible ? '' : ' hidden'}${addedAttr(x)}>
    <header class="sheet-head"><div><h3 class="sheet-title">${esc(x.title)}</h3><p class="sheet-sub">${meta([...x.sub.split(' · '), `${x.n} problems`])}</p></div></header>
    ${unlockForm(x.id, 'The exercise sheets from class are locked, with the same password as Math’s in-class sheets. The practice sets are open to everyone.')}
  </article>`;

// ---------- the midterm page ----------
// exercises: the exercise days (src/physics/private/exercises.mjs), or null when they aren't available, in which case
// exList (from locked.json) says what to draw password panels for. locked: true for the site.
function render({ exercises, locked, exList }) {
  const INDEX = [], PRIV = [], sheets = {};

  // Summary: a tile per chapter; for each chapter, every module's key ideas and worked example, then "Watch out"
  const tilesHTML = chapters.map((c) => `<button type="button" class="tile" data-goto="summary" data-target="su-${c.id}">${CH_ICONS[c.id]}<span class="tile-k">Chapter ${c.no}</span><span class="tile-t">${esc(c.title)}</span></button>`).join('')
    + `<button type="button" class="tile" data-goto="summary" data-target="su-habits">${CH_ICONS.habits}<span class="tile-k">Before the exam</span><span class="tile-t">Exam-day habits</span></button>`;
  const summaryHTML = chapters.map((c) => {
    const s = summary[c.id];
    if (!s) throw new Error(`summary.mjs has no chapter ${c.id}`);
    const stray = s.mods.filter((m) => !c.modules.some(([no]) => no === m.no));
    if (stray.length) throw new Error(`summary.mjs: ${stray.map((m) => m.no).join(', ')} not among the modules of chapter ${c.no} (content.mjs)`);
    const watch = items(s.watch).map((it, i) => {
      const id = `su-${c.id}-w${i + 1}`;
      INDEX.push(entry('Summary', 'summary', id, `Watch out — Chapter ${c.no}, ${c.title}`, plainP(it), 'mistake slip ' + c.keys));
      return `<li id="${id}">${inline(it, false)}</li>`;
    }).join('');
    return `
<section class="unit" id="su-${c.id}" data-added="${SUMMARY_ADDED}">
  <header class="unit-head">${CH_ICONS[c.id]}<div><p class="kicker">${meta([`Chapter ${c.no}`, c.mods])}</p><h2>${esc(c.title)}</h2></div></header>
  ${c.modules.map((mod) => moduleHTML(c, mod, INDEX)).join('')}
  <div class="watch"><h3>Watch out</h3><ul>${watch}</ul></div>
</section>`;
  }).join('') + `
<section class="habits" id="su-habits"><h2 class="deco">Exam-day habits</h2><ul>${items(habits).map((it, i) => {
    const id = `su-habits-${i + 1}`;
    INDEX.push(entry('Summary', 'summary', id, 'Exam-day habit', plainP(it), 'exam habit tip'));
    return `<li id="${id}">${inline(it, false)}</li>`;
  }).join('')}</ul></section>`;

  // Practice: a heading per chapter for now
  const practiceHTML = chapters.map((c) => `
<section class="punit" id="p${c.id}">
  <header class="punit-head"><div><p class="kicker">Chapter ${c.no}</p><h2>${esc(c.title)}</h2></div></header>
  ${soon('Practice problems with worked solutions are coming soon.')}
</section>`).join('');

  // Formulas: the values to know (special angles, constants), then each chapter by module, then its extras
  const evCell = (v) => (v === null ? '<td class="na"><span class="sr">undefined</span></td>' : `<td>${tex('\\displaystyle ' + v, false)}</td>`);
  const evAngle = ([t, d]) => `${tex(t, false)}<span class="deg">${esc(d)}</span>`;
  const trigWide = `<table class="exact exact-wide"><thead><tr><th scope="col"><span class="sr">Function</span></th>${trig.angles.map((a) => `<th scope="col">${evAngle(a)}</th>`).join('')}</tr></thead>
  <tbody>${trig.rows.map(([f, vals]) => `<tr><th scope="row">${tex(f, false)}</th>${vals.map(evCell).join('')}</tr>`).join('')}</tbody></table>`;
  const trigTall = `<table class="exact exact-tall"><thead><tr><th scope="col">${tex('\\theta', false)}</th>${trig.rows.map(([f]) => `<th scope="col">${tex(f + '\\theta', false)}</th>`).join('')}</tr></thead>
  <tbody>${trig.angles.map((a, i) => `<tr><th scope="row">${evAngle(a)}</th>${trig.rows.map(([, vals]) => evCell(vals[i])).join('')}</tr>`).join('')}</tbody></table>`;
  INDEX.push(entry('Formulas', 'formulas', 'fg-values', 'Special angles — sin, cos, tan', 'sin, cos and tan of 0°, 30°, 37°, 45°, 53°, 60° and 90°; 37° and 53° from the 3-4-5 triangle',
    'trig table no calculator exact values 3-4-5 triangle sin37 cos37'));
  let nFormulas = 0;
  const valuesHTML = `
<section class="fgroup" id="fg-values" data-added="${FORMULAS_ADDED}">
  <h2><span class="kicker">No calculator</span>Values to know</h2>
  <h3 class="fmod"><span class="mod-no">Angles</span>Special angles</h3>
  <div class="table-wrap">${trigWide}${trigTall}</div>
  <p class="exact-note">${inline(String.raw`$37^\circ$ and $53^\circ$ are the angles of the 3-4-5 right triangle: $\sin37^\circ\approx\frac{3}{5}$ and $\cos37^\circ\approx\frac{4}{5}$, to within half a percent. A slash means undefined: $\tan90^\circ$ doesn't exist.`, false)}</p>
  <h3 class="fmod"><span class="mod-no">Constants</span>Constants and units</h3>
  <div class="frows">${constants.map((r, i) => { nFormulas++; return formulaRow(`f-v-${i + 1}`, r, 'Values to know', 'constant unit', INDEX); }).join('')}</div>
</section>`;
  const formulasHTML = valuesHTML + chapters.map((c) => {
    const g = fgroups.find((x) => x.id === c.id);
    if (!g) throw new Error(`formulas.mjs has no chapter ${c.id}`);
    const stray = g.mods.filter((m) => !c.modules.some(([no]) => no === m.no));
    if (stray.length) throw new Error(`formulas.mjs: ${stray.map((m) => m.no).join(', ')} not among the modules of chapter ${c.no} (content.mjs)`);
    let n = 0;
    const row = (r, where) => { nFormulas++; return formulaRow(`f-${c.id}-${++n}`, r, where, c.keys, INDEX); };
    const mods = c.modules.map(([no, title]) => {
      const m = g.mods.find((x) => x.no === no);
      if (!m) throw new Error(`formulas.mjs has no module ${no}`);
      return `<h3 class="fmod"><span class="mod-no">${esc(no)}</span>${esc(title)}</h3><div class="frows">${m.rows.map((r) => row(r, `${no} ${title}`)).join('')}</div>`;
    }).join('');
    const extra = g.extra.length ? `<h3 class="fmod fmod-x"><span class="mod-no">Extra</span>Helpful results not printed in the book</h3><div class="frows">${g.extra.map(([name, t, note]) => row([name, t, 'x', note], `Chapter ${c.no}, extra`)).join('')}</div>` : '';
    return `
<section class="fgroup" id="fg-${c.id}" data-added="${FORMULAS_ADDED}">
  <h2><span class="kicker">${meta([`Chapter ${c.no}`, c.mods])}</span>${esc(c.title)}</h2>
  ${mods}${extra}
</section>`;
  }).join('');

  // Quizzes: the exercise days from class (locked on the site) and the practice sets, each group behind a switcher
  const list = exercises ? exercises.map(sheetMeta) : exList;
  let exSheets = '';
  list.forEach((x, i) => {
    const full = exercises && exercises.find((e) => e.id === x.id);
    if (full) {
      const html = sheetHTML(full, String(i), i === 0, locked ? PRIV : INDEX, 'exercise day in-class class sheet real');
      if (locked) { sheets[x.id] = html.trim(); exSheets += lockPanel(x, String(i), i === 0); } else exSheets += html;
    } else exSheets += lockPanel(x, String(i), i === 0);
  });
  const lockMark = locked && list.length ? `<span class="seg-lock">${UI_ICONS.lock}</span>` : '';
  const segBtns = (items, mark) => items.map((x, i) => `<button type="button" class="seg-btn" role="tab" data-seg="${i}" aria-controls="${x.id}" aria-selected="${i === 0}">${esc(x.seg)}${mark}</button>`).join('');
  const setSheets = sets.map((sh, i) => sheetHTML(sh, String(i), i === 0, INDEX, 'practice set new problems')).join('');
  const quizzesHTML = `
<nav class="qjump" aria-label="Jump to a group"><button type="button" class="chip" data-goto="quizzes" data-target="ex">Exercise days</button><button type="button" class="chip" data-goto="quizzes" data-target="sets">Practice sets</button></nav>
<section class="qgroup mockgroup" id="ex">
  <header class="qg-head"><p class="kicker">From class, retyped with worked answers</p><h2>Exercise days</h2></header>
  <div class="seg" role="tablist" aria-label="Exercise days">${segBtns(list, lockMark)}</div>
  ${exSheets}
</section>
<section class="qgroup mockgroup" id="sets">
  <header class="qg-head"><p class="kicker">The same format, new problems</p><h2>Practice sets</h2></header>
  <div class="seg" role="tablist" aria-label="Practice sets">${segBtns(sets, '')}</div>
  ${setSheets}
</section>
${locked && list.length ? '<div class="reset-row lockrow" id="lockrow" hidden><button type="button" class="linkbtn" id="lock-again">Lock again</button><span>The exercise sheets are open in this browser.</span></div>' : ''}`;

  // Exams: upcoming exams (site.json; page.js counts down) and the mock midterms to come
  const upcomingHTML = SITE.exams.filter((x) => x.subject === 'physics').map((x) => `
      <li class="up-item" data-date="${esc(x.date || '')}" data-time="${esc(x.time || '')}">
        <span class="up-cal" aria-hidden="true">${UI_ICONS.calendar}</span>
        <span class="up-main"><b class="up-name">${esc(x.name)}</b><span class="up-when">${x.date ? '' : 'Date to be announced'}</span></span>
        <span class="up-left" aria-live="off"></span>
      </li>`).join('');
  const examsHTML = `
    <section class="exam-up" id="ex-upcoming">
      <h2 class="sec-title">Upcoming exams</h2>
      <ul class="up-list">${upcomingHTML}</ul>
    </section>
    <section class="qgroup mockgroup" id="mocks">
      <header class="qg-head"><p class="kicker">Practice under exam conditions</p><h2>Mock midterms</h2></header>
      ${soon('Mock midterms in the exam’s format, six questions in 60 minutes, are coming soon.')}
    </section>`;

  const TABS = [['summary', 'Summary'], ['practice', 'Practice'], ['formulas', 'Formulas'], ['quizzes', 'Quizzes'], ['exams', 'Exams']];
  const newest = (dates) => dates.filter(Boolean).sort().pop() || '';
  const NEWEST = { summary: SUMMARY_ADDED, formulas: FORMULAS_ADDED, quizzes: newest([...sets.map((s) => s.added), ...list.map((x) => x.added)]) };
  const formulasTab = `
<div class="testbar">
  <button type="button" class="pill" id="test-btn" aria-pressed="false">${UI_ICONS.eye}<span>Test me</span></button>
  <p class="test-hint">Hides every formula and value. Say it to yourself, then tap to check.</p>
  <button type="button" class="linkbtn" id="test-reset" hidden>Hide all again</button>
</div>
<p class="flegend"><span class="nw"><span class="stars" aria-hidden="true">★★★</span> core, used all the time</span> · <span class="nw"><span class="stars" aria-hidden="true">★★</span> key result</span> · <span class="nw"><span class="stars" aria-hidden="true">★</span> supporting</span> · <span class="nw"><span class="xtag">Extra</span> not printed in the book</span></p>
${formulasHTML}`;
  const LAZY = { practice: practiceHTML, formulas: formulasTab, quizzes: quizzesHTML, exams: examsHTML };
  const lazyBox = (v) => `<div class="wrap content" data-lazy="${v}"><p class="lazy-wait">Loading…</p></div>`;
  const lazyScripts = Object.entries(LAZY).map(([v, html]) => {
    if (/<\/script|<!--/i.test(html)) throw new Error(`the ${v} tab contains "</script" or "<!--", which can't travel inside a script element`);
    return `<script type="text/x-lazy-html" id="lazy-${v}">${html.trim()}</script>`;
  }).join('\n');
  const nSets = sets.length, nEx = list.length;
  const body = `
<header class="appbar"><div class="wrap appbar-row">
  <a class="brand" href="#summary" aria-label="EP1 Review, Physics midterm, go to Summary">${BADGE}<span class="brand-text"><b>EP1 Review</b><small>Midterm · Chapters 1–8</small></span></a>
  <div class="appbar-actions">
    ${subjectSwitch('math', '../../math/')}
    <button type="button" class="icon-btn" id="theme-btn" data-mode="system" aria-label="Theme: system. Tap to change."><span class="t-system">${UI_ICONS.system}</span><span class="t-light">${UI_ICONS.light}</span><span class="t-dark">${UI_ICONS.dark}</span></button>
    <button type="button" class="icon-btn" id="search-btn" aria-label="Search everything">${UI_ICONS.search}</button>
  </div>
</div></header>

<nav class="tabbar" aria-label="Sections" data-updated="${LAST_UPDATED}"><div class="tabbar-row" role="tablist">
  ${TABS.map(([v, l]) => `<button type="button" class="tab" role="tab" id="tab-${v}" data-view="${v}" aria-controls="view-${v}" aria-selected="${v === PAGE_CONF.home}"${NEWEST[v] ? ` data-newest="${NEWEST[v]}"` : ''}>${TAB_ICONS[v]}<span>${l}</span></button>`).join('')}
</div></nav>

<main%MAIN_ATTRS%>
  <section id="view-summary" class="view" role="tabpanel" aria-labelledby="tab-summary">
    ${band('Summary', 'まとめ', 'Every module of <span class="nw">Chapters 1–8</span> in a few short points, each with a worked example that opens one step at a time, and the common mistakes of each chapter.')}
    <div class="wrap content">
      <nav class="tiles" aria-label="Chapters">${tilesHTML}</nav>
      ${summaryHTML}
    </div>
  </section>

  <section id="view-practice" class="view" role="tabpanel" aria-labelledby="tab-practice" hidden>
    ${band('Practice', '練習問題', 'Practice problems for each chapter, with worked solutions you can mark as you go. Coming soon.')}
    ${lazyBox('practice')}
  </section>

  <section id="view-formulas" class="view" role="tabpanel" aria-labelledby="tab-formulas" hidden>
    ${band('Formulas', '公式集', 'The formulas of <span class="nw">Chapters 1–8</span>, module by module and marked by importance, with helpful extras the book doesn’t print and the values to know without a calculator.')}
    ${lazyBox('formulas')}
  </section>

  <section id="view-quizzes" class="view" role="tabpanel" aria-labelledby="tab-quizzes" hidden>
    ${band('Quizzes', '小テスト', `The ${nEx === 2 ? 'two' : nEx} exercise-day sheets from class${locked && nEx ? ' <span class="nw">(password needed)</span>' : ''} and ${nSets === 3 ? 'three' : nSets} practice sets in the same format, each with worked answers that open one step at a time. Start the timer and work on paper, without notes or a calculator.`)}
    ${lazyBox('quizzes')}
  </section>

  <section id="view-exams" class="view" role="tabpanel" aria-labelledby="tab-exams" hidden>
    ${band('Exams', '試験', 'Upcoming exams with a countdown. The midterm has six questions in 60 minutes; mock midterms in that format are coming soon.')}
    ${lazyBox('exams')}
  </section>
</main>
${lazyScripts}
`;
  return { body, INDEX, PRIV, sheets, exList: list, hasLocks: locked && list.length > 0, nSets, nEx, nFormulas };
}

function foot() {
  return `
<footer class="site-foot"><div class="wrap">
  <p class="deco cheer">Good luck in your studies!</p>
  <p class="foot-links"><a href="../">← All exams</a> <a href="../../">All subjects</a></p>
  <p class="fine">Study notes for Engineering Physics 1. Not an official Kyoto University of Advanced Science page. Every answer was checked numerically before publishing.</p>
  <p class="fine">Last updated <time datetime="${LAST_UPDATED}">${fmtDate(LAST_UPDATED)}</time>.</p>
  <p class="fine">Math typeset with KaTeX (<a href="../../src/vendor/katex/LICENSE.txt">MIT License</a>).</p>
</div></footer>

<div class="search-sheet" id="search" role="dialog" aria-modal="true" aria-label="Search" hidden>
  <div class="search-bar"><div class="wrap search-row">
    <label class="search-field">${UI_ICONS.search}<input id="search-input" type="search" placeholder="Search problems, topics, chapters" autocomplete="off" enterkeyhint="search"></label>
    <button type="button" class="icon-btn" id="search-close" aria-label="Close search">${UI_ICONS.close}</button>
  </div></div>
  <div class="wrap search-results" id="search-results"></div>
</div>`;
}

// ---------- shared files: one stylesheet and one script for every Physics page, named with ?v=<hash> ----------
const MATH_SRC = path.join(ROOT, 'src', 'math'), SHARED = path.join(ROOT, 'src', 'shared');
const CSS_FILES = [path.join(MATH_SRC, 'page.css'), path.join(SHARED, 'calculator.css'), path.join(SHARED, 'totop.css'), path.join(SRC, 'physics.css')];
const JS_FILES = [path.join(MATH_SRC, 'page.js'), path.join(SHARED, 'totop.js'), path.join(SHARED, 'calculator.js')];
function writeAssets() {
  const fonts = [];
  // the KaTeX fonts are Math's shared copies, so a device that has visited Math already has them
  const kcss = katexCSS((name) => { fonts.push(name); return `../../math/assets/fonts/${name}.woff2`; });
  for (const f of fonts) if (!fs.existsSync(path.join(MATH_FONTS, f + '.woff2'))) fail(`math/assets/fonts/${f}.woff2 is missing: build Math first (node src/math/build.mjs site).`);
  const note = (from) => `/* Built by src/physics/build.mjs from ${from}. Don't edit it here: change the sources and build again. */\n`;
  const css = note('src/math/page.css, src/shared/calculator.css, src/shared/totop.css, src/physics/physics.css and KaTeX') + readAll(CSS_FILES) + '\n' + kcss + '\n' + KATEX_TWEAK + '\n';
  const js = note('src/math/page.js, src/shared/totop.js and src/shared/calculator.js') + readAll(JS_FILES) + '\n';
  writeIfChanged(path.join(ASSETS, 'physics.css'), css);
  writeIfChanged(path.join(ASSETS, 'physics.js'), js);
  return { css: `physics.css?v=${hash(css)}`, js: `physics.js?v=${hash(js)}`, fonts };
}

// ---------- encryption: Math's password and salt ----------
// The key for SITE_PASSWORD, from the salt of Math's locked file. It must open Math's files (one password for the whole
// site) and, unless checkPhysics is false, the current Physics files (each with the salt it was made with).
async function keyring(pw, { checkPhysics = true } = {}) {
  if (!pw || !normalize(pw)) fail('set SITE_PASSWORD (the password for the locked sheets; Math and Physics share it).');
  const ref = readJSON(MATH_LOCKED);
  if (!ref) fail(`${rel(MATH_LOCKED)} is missing: Physics takes its salt from Math's locked file.`);
  const ring = { salt: unb64(ref.salt), iter: ref.iter, saltB64: ref.salt };
  ring.key = await deriveKey(pw, ring.salt, ring.iter);
  for (const f of checkPhysics ? [MATH_LOCKED, LOCKED, SEALED] : [MATH_LOCKED]) {
    const box = readJSON(f);
    if (!box) continue;
    const key = box.salt === ref.salt && box.iter === ref.iter ? ring.key : await deriveKey(pw, unb64(box.salt), box.iter);
    try { await openBox(key, box); } catch { fail(`that password does not open ${rel(f)}. Check it for typos (to change the password, see CLAUDE.md).`); }
  }
  return ring;
}
const sameSalt = (box, ring) => box && box.salt === ring.saltB64 && box.iter === ring.iter;
function readPrivateDir() {
  if (!fs.existsSync(PRIVATE)) return null;
  const files = {};
  for (const f of fs.readdirSync(PRIVATE).sort()) {
    const p = path.join(PRIVATE, f);
    if (fs.statSync(p).isFile()) files[f] = fs.readFileSync(p, 'utf8');
  }
  return Object.keys(files).length ? files : null;
}
async function sealedFiles(pw) {
  const box = readJSON(SEALED);
  return box ? (await openBox(await deriveKey(pw, unb64(box.salt), box.iter), box)).files : null;
}
async function syncSeal(ring, pw) {
  const local = readPrivateDir();
  if (!local) return false;
  const box = readJSON(SEALED);
  if (sameSalt(box, ring) && JSON.stringify(await sealedFiles(pw)) === JSON.stringify(local)) return false;
  fs.writeFileSync(SEALED, JSON.stringify(await sealBox(ring, { files: local })) + '\n');
  console.log('sealed src/physics/private/ into', rel(SEALED));
  return true;
}
// a private module: from src/physics/private/ when it's open, else from the sealed copy (needs the password)
async function loadPrivate(pw, file, name) {
  const local = path.join(PRIVATE, file);
  if (fs.existsSync(local)) return (await import(pathToFileURL(local).href + '?t=' + Date.now()))[name];
  if (!pw) return null;
  const files = await sealedFiles(pw);
  if (!files || !files[file]) return null;
  return (await import('data:text/javascript;base64,' + Buffer.from(files[file]).toString('base64')))[name];
}

// ---------- commands ----------
const PASSWORD = process.env.SITE_PASSWORD || '';

async function buildSite(pw = PASSWORD) {
  const ring = pw ? await keyring(pw) : null;
  if (ring) await syncSeal(ring, pw);
  else if (readPrivateDir()) console.warn('note: src/physics/private/ exists but SITE_PASSWORD is not set, so the locked exercise sheets were not rebuilt.');
  const exercises = ring ? await loadPrivate(pw, 'exercises.mjs', 'exercises') : null;
  if (ring && !exercises) fail('the exercise sheets are missing: src/physics/private/exercises.mjs (or the sealed copy).');
  let box = readJSON(LOCKED);
  const r = render({ exercises, locked: true, exList: box ? box.ex : [] });
  if (exercises) {
    const payload = { sheets: r.sheets, index: r.PRIV };
    let same = false;
    if (sameSalt(box, ring)) { try { same = JSON.stringify(await openBox(ring.key, box)) === JSON.stringify(payload) && JSON.stringify(box.ex) === JSON.stringify(r.exList); } catch { same = false; } }
    if (!same) {
      // `ex` (titles and sizes) stays readable, so a build without the password can still draw the panels
      box = await sealBox(ring, payload, { ex: r.exList });
      fs.mkdirSync(PAGE_DIR, { recursive: true });
      fs.writeFileSync(LOCKED, JSON.stringify(box) + '\n');
      console.log('wrote', rel(LOCKED), (fs.statSync(LOCKED).size / 1024).toFixed(0) + ' KB · private search entries:', r.PRIV.length);
    }
  }
  if (r.hasLocks && !box) fail(`exercise sheets are listed but ${rel(LOCKED)} is missing; build with SITE_PASSWORD.`);
  const lockedSrc = r.hasLocks ? 'locked.json?v=' + hash(fs.readFileSync(LOCKED)) : '';
  const a = writeAssets();
  const PRELOAD = ['KaTeX_Main-Regular', 'KaTeX_Math-Italic'];
  if (!PRELOAD.every((f) => a.fonts.includes(f))) fail('a preloaded KaTeX font is not among the fonts');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>EP1 Midterm Review</title>
<meta name="description" content="Review for the Engineering Physics 1 midterm (Chapters 1–8): a summary of every module with worked examples, the formulas, the exercise-day sheets with worked answers and practice sets in the same format.">
${ogTags({
    title: 'EP1 Review · Physics midterm (Chapters 1–8)',
    description: 'Unofficial review notes for the Engineering Physics 1 midterm: module summaries with worked examples, formulas, exercise sheets and practice sets.',
    url: 'physics/midterm/', image: 'og-physics-midterm.png',
    alt: 'EP1 Review, Engineering Physics 1 midterm, Chapters 1 to 8: summary, formulas, quizzes and exams',
  })}
${HEAD_COMMON('../../', '#131A25')}
${THEME_EARLY}
${FONT_LINKS}
${PRELOAD.map((f) => `<link rel="preload" href="../../math/assets/fonts/${f}.woff2" as="font" type="font/woff2" crossorigin>`).join('\n')}
<link rel="preload" href="../assets/${a.js}" as="script">
<link rel="stylesheet" href="../assets/${a.css}">
</head>
<body data-page="${esc(JSON.stringify(PAGE_CONF))}">
${r.body.replace('%MAIN_ATTRS%', lockedSrc ? ` data-locked="${lockedSrc}"` : '')}
${foot()}
${indexScript(r.INDEX)}
<script src="../assets/${a.js}"></script>
</body>
</html>
`;
  writeIfChanged(path.join(PAGE_DIR, 'index.html'), html);
  console.log('wrote', rel(path.join(PAGE_DIR, 'index.html')), (html.length / 1024).toFixed(0) + ' KB · public index entries:', r.INDEX.length,
    '· exercise days:', r.nEx, r.hasLocks ? '(locked)' : '', '· practice sets:', r.nSets);
  const picker = pickerHTML(a, r);
  writeIfChanged(path.join(PHYS, 'index.html'), picker);
  console.log('wrote', rel(path.join(PHYS, 'index.html')), (picker.length / 1024).toFixed(0) + ' KB · exams:', EXAMS.map((x) => x.id + (x.page ? '' : ' (soon)')).join(', '),
    '· shared files:', a.css, a.js);
}

// ---------- the exam picker (physics/index.html), like Math's ----------
function pickerHTML(a, r) {
  const cards = EXAMS.map((x) => {
    const ex = SITE.exams.find((e) => e.name === x.exam);
    if (!ex) fail(`site.json has no exam named "${x.exam}" (the picker's ${x.id} card)`);
    const page = x.page ? `physics/${x.page}/` : null;
    if ((ex.page || null) !== page) fail(`site.json: "${x.exam}" needs "page": ${JSON.stringify(page)}, like the picker's card`);
    const day = ex.date ? new Date(`${ex.date}T12:00:00+09:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Tokyo' }) + (ex.time ? ' · ' + ex.time : '') : 'Date to be announced';
    const when = `<span class="e-when"${ex.date ? ` data-date="${esc(ex.date)}"` : ''}>${UI_ICONS.calendar}<span class="nw">${esc(day)}</span><span class="e-left" aria-live="off"></span></span>`;
    const stats = x.page ? `<p class="e-stats">${meta([`${chapters.length} chapter summaries`, `${r.nFormulas} formulas`, `${r.nEx} exercise days`, `${r.nSets} practice sets`])}</p>` : '';
    const inner = `${EXAM_ICONS[x.id]}<span class="e-head"><span class="kicker">${esc(x.kicker)}</span><span class="e-title">${esc(x.title)}</span></span>
      <p class="e-text">${esc(x.text)}</p>${stats}
      <span class="e-foot">${when}${x.page ? `<span class="pill">Open${UI_ICONS.arrow}</span>` : '<span class="e-soon">Coming soon</span>'}</span>`;
    return x.page
      ? `<a class="exam" id="exam-${x.id}" href="${x.page}/" data-updated="${LAST_UPDATED}" data-seen="physics">${inner}</a>`
      : `<div class="exam soon" id="exam-${x.id}">${inner}</div>`;
  }).join('\n    ');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>EP1 Review</title>
<meta name="description" content="Review notes for each exam of Engineering Physics 1: module summaries with worked examples, formulas, exercise sheets and practice sets.">
${ogTags({
    title: 'EP1 Review · Engineering Physics 1',
    description: 'Unofficial review notes for each exam: module summaries with worked examples, formulas and quiz sheets with worked answers.',
    url: 'physics/', image: 'og-physics.png',
    alt: 'EP1 Review, Engineering Physics 1: the midterm (Chapters 1 to 8), with the final coming later',
  })}
${HEAD_COMMON('../', '#131A25')}
${THEME_EARLY}
${FONT_LINKS}
<link rel="stylesheet" href="assets/${a.css}">
<style>${PICKER_CSS}
</style>
<script src="../src/shared/totop.js" defer></script>
</head>
<body class="picker">
<header class="appbar"><div class="wrap appbar-row">
  <a class="brand" href="./" aria-label="EP1 Review, all exams">${BADGE}<span class="brand-text"><b>EP1 Review</b><small>Engineering Physics 1</small></span></a>
  <div class="appbar-actions">${subjectSwitch('math', '../math/')}</div>
</div></header>
<main>
  ${band('Exams', '試験', 'One page of notes for each exam. The midterm page has a summary of every module with worked examples, the formulas, and quiz sheets with worked answers; practice problems follow.')}
  <div class="wrap content">
    <nav class="exams" aria-label="Exams">
    ${cards}
    </nav>
  </div>
</main>
<footer class="site-foot"><div class="wrap">
  <p class="foot-links"><a href="../">← All subjects</a></p>
  <p class="fine">Study notes for Engineering Physics 1. Not an official Kyoto University of Advanced Science page.</p>
  <p class="fine">Last updated <time datetime="${LAST_UPDATED}">${fmtDate(LAST_UPDATED)}</time>.</p>
</div></footer>
<script>${PICKER_JS}</script>
</body>
</html>
`;
}

async function openPrivate() {
  await keyring(PASSWORD);
  const files = await sealedFiles(PASSWORD);
  if (!files) fail(`nothing to open: ${rel(SEALED)} is missing.`);
  fs.mkdirSync(PRIVATE, { recursive: true });
  for (const [f, text] of Object.entries(files)) {
    const p = path.join(PRIVATE, f);
    if (fs.existsSync(p) && fs.readFileSync(p, 'utf8') !== text) fail(`src/physics/private/${f} has changes that are not sealed yet; run \`seal\` or move the file away first.`);
    fs.writeFileSync(p, text);
  }
  console.log('opened', Object.keys(files).join(', '), 'into src/physics/private/ (git-ignored; never commit it)');
}
async function sealPrivate() {
  if (!readPrivateDir()) fail('nothing to seal: src/physics/private/ is empty or missing (run `open` first).');
  const ring = await keyring(PASSWORD);
  if (!(await syncSeal(ring, PASSWORD))) console.log('src/physics/private/ already matches', rel(SEALED));
}
// after Math's `rekey`: SITE_PASSWORD (old) opens the Physics files; NEW_SITE_PASSWORD (new) already opens Math's
async function rekey() {
  const next = process.env.NEW_SITE_PASSWORD || '';
  if (!normalize(next)) fail('set NEW_SITE_PASSWORD as well.');
  if (!normalize(PASSWORD)) fail('set SITE_PASSWORD (the old password) as well.');
  const ring = await keyring(next, { checkPhysics: false });
  for (const f of [LOCKED, SEALED]) {
    const box = readJSON(f);
    if (!box) continue;
    let data;
    try { data = await openBox(await deriveKey(PASSWORD, unb64(box.salt), box.iter), box); } catch { fail(`the old password does not open ${rel(f)}.`); }
    const extra = f === LOCKED ? { ex: box.ex } : {};
    fs.writeFileSync(f, JSON.stringify(await sealBox(ring, data, extra)) + '\n');
  }
  console.log('re-encrypted the Physics files with the new password.');
  await buildSite('');
}

const [cmd] = process.argv.slice(2);
const COMMANDS = { site: () => buildSite(), open: openPrivate, seal: sealPrivate, rekey };
if (!COMMANDS[cmd]) fail('usage: node src/physics/build.mjs site | open | seal | rekey');
await COMMANDS[cmd]();
