// Builds the Math section (CLA1 review) of the study site. All math is pre-rendered with KaTeX,
// which is vendored in src/vendor/katex, so the build needs no network and no npm install.
//
// The section has one page per exam: math/ is the picker, math/derivatives/ holds the notes for Calculus midterm 1
// (the content modules in this folder) and math/integrals/ those for Calculus midterm 2 (src/math/integrals/). The
// styles, scripts and math fonts every exam page uses are shared files in math/assets/, so a device downloads them
// once and each exam page carries only its own notes.
//
//   node src/math/build.mjs site               writes math/index.html (the picker), the exam pages and math/assets/,
//                                              and each page's locked.json (math/<exam>/locked.json) when
//                                              SITE_PASSWORD is set
//   node src/math/build.mjs artifact <out>     writes one self-contained page with the in-class sheets in plain view
//   node src/math/build.mjs open               decrypts src/math/private.sealed.json into src/math/private/
//   node src/math/build.mjs seal               encrypts src/math/private/ into src/math/private.sealed.json
//   node src/math/build.mjs rekey              changes the password (SITE_PASSWORD = current, NEW_SITE_PASSWORD = new)
//
// The in-class quiz sheets and the past exam papers are private. Their source (src/math/private/, git-ignored) is kept
// in the repository only encrypted, and the site gets them only as each exam page's locked.json, opened in the browser
// with the password: a page's in-class sheets (`quizFile`) and past papers (`pastFile`), from src/math/private/. Every
// locked file uses the same password and salt, so one unlock opens every page.
// Without SITE_PASSWORD the build keeps the current locked files as they are.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { units, habits, practice } from './content.mjs';
import { tags, formulas, exactValues, BADGE, TAB_ICONS, UI_ICONS, UNIT_ICONS, EXAM_ICONS } from './extras.mjs';
import { followups } from './followups.mjs';
import { subjectSwitch } from '../shared/icons.mjs';
import { mocks } from './exams.mjs';
import * as INT from './integrals/content.mjs';
import * as INTX from './integrals/extras.mjs';
import * as INTF from './integrals/followups.mjs';
import { mocks as INT_MOCKS } from './integrals/exams.mjs';
import { SITE_URL, fmtDate, esc, tex, inline, items, blocks, withPts, texPlain, plain, entry, toggle, solToggle, lazyTab, sessionSetup, practiceButtons, nightTools, nightLink, partsList, answerBox, MARU,
  band, ring, addedAttr, meta, timerHTML, unlockForm, katexCSS, FONT_LINKS, indexScript, readAll, KATEX_TWEAK, hash, writeIfChanged,
  THEME_EARLY, HEAD_COMMON, ogTags, ITER, b64, unb64, normalize, readJSON, deriveKey, sealBox, openBox, PICKER_CSS, PICKER_JS, SB_EDGE, SB_FOOT, KATEX_DIR } from '../shared/build-lib.mjs';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, '..', '..');
const MATH = path.join(ROOT, 'math');
// the shared files of every exam page; each page's locked sheets are in math/<exam>/locked.json (lockedFile)
const ASSETS = path.join(MATH, 'assets');
const lockedFile = (P) => path.join(MATH, P.id, 'locked.json');
const SEALED = path.join(SRC, 'private.sealed.json');
const PRIVATE = path.join(SRC, 'private');
const rel = (p) => path.relative(ROOT, p);
// site.json (repository root): exam dates and the "What's new" list, shared with the home page
const SITE = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.json'), 'utf8'));
const fail = (msg) => { console.error('error: ' + msg); process.exit(1); };
const newestOf = (dates) => dates.filter(Boolean).sort().pop() || '';
// "Last updated" of an exam page: the newest date in What's new that links to the page (site.json) or on anything
// in it (`added`, past papers included). The picker's is the newest of all of them.
const mathNews = SITE.news.filter((n) => n.subject === 'math' || n.subject === 'all');
const pageUpdated = (P) => newestOf([
  ...mathNews.filter((n) => (n.link || '').startsWith(`math/${P.id}/`)).map((n) => n.date),
  ...P.units.map((u) => u.added), ...Object.values(P.practice).flat().map((p) => p.added),
  ...P.formulas.map((g) => g.added), ...P.mocks.map((m) => m.added),
]) || '2026-10-01';

// ---------- the exams, for the picker (math/) ----------
// One card per exam, in course order. `exam` is its name in site.json (for the date), and `page` is its folder under
// math/ once its notes exist; until then the card says when they will appear. Each exam page is an entry in PAGES
// below, with its own content modules and storage keys.
const EXAMS = [
  { id: 'derivatives', page: 'derivatives', exam: 'Calculus midterm 1', kicker: 'Calculus midterm 1', title: 'Derivatives',
    text: 'Limits and continuity, derivative rules, extrema, series and Taylor polynomials, plus an introduction to differential equations.' },
  { id: 'integrals', page: 'integrals', exam: 'Calculus midterm 2 (integrals)', kicker: 'Calculus midterm 2', title: 'Integrals',
    text: 'Riemann sums and definite integrals, primitive functions, integration by parts and substitution, applications, polar curves and improper integrals. Notes are added after each class.' },
  { id: 'linear-algebra', page: 'linear-algebra', exam: 'Linear Algebra midterm', kicker: 'Linear Algebra', title: 'Linear algebra',
    text: 'Past Linear Algebra exams with worked answers: the AY2024 Christmas exam, and the AY2022 and AY2023 finals with the AY2023 retake. Notes follow once the Linear Algebra classes start.' },
  { id: 'calculus-final', page: 'calculus-final', exam: 'Calculus final', kicker: 'Calculus final', title: 'Derivatives, integrals and series',
    text: 'The Calculus part of the AY2022 and AY2023 finals, with worked answers and their MATLAB problems. Notes for the final follow after the midterms.' },
];

// A practice problem's id (the key for its saved mark): its own `id` when it was moved from another unit, else unit number.n
const probId = (u, p, pi) => p.id || `${u.id.slice(1)}.${pi + 1}`;
// a lesson's label: its day numbers ("Day 1 & 2"), or its dates ("2 & 3 Nov") when the schedule gives no day numbers
const dayOf = (u) => u.days || u.dates;
// "Day 10 & 11" -> "10–11" (or "2 & 3 Nov" -> "2–3") for the small practice rings
const dayShort = (u) => (u.days ? u.days.replace(/^Day /, '').replace(' & ', '–') : u.dates.replace(/^(\d+) & (\d+).*$/, '$1–$2'));
// the span of an exam's lessons for its card and Formulas tab: "Days 1–12", or from the dates, "2–20 Nov" (also while
// only some lessons have day numbers yet, as on Calculus midterm 2)
function spanOf(units) {
  const dayNums = units.flatMap((u) => ((u.days || '').match(/\d+/g) || []).map(Number));
  if (dayNums.length && units.every((u) => u.days)) return `Days ${Math.min(...dayNums)}–${Math.max(...dayNums)}`;
  const ends = (s) => { const n = s.match(/\d+/g).map(Number); return { lo: n[0], hi: n[n.length - 1], mon: s.match(/[A-Z][a-z]{2}/)[0] }; };
  const a = ends(units[0].dates), b = ends(units[units.length - 1].dates);
  return a.mon === b.mon ? `${a.lo}–${b.hi} ${b.mon}` : `${a.lo} ${a.mon} – ${b.hi} ${b.mon}`;
}
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
const graphHTML = (added) => ([kind, title, note]) => `
  <figure class="explore" id="gx-${kind}" data-graph="${kind}" data-added="${added}">
    <figcaption class="gx-title"><span class="kicker">Explore</span>${esc(title)}</figcaption>
    <div class="gx-stage"><p class="gx-wait">Loading the graph…</p></div>
    <p class="gx-note">${inline(note, false)}</p>
  </figure>`;
// a part of a page whose content comes with later classes
const soon = (text) => `<p class="soon-box">${UI_ICONS.calendar}<span>${esc(text)}</span></p>`;

// ---------- the exam pages ----------
// Each exam page has its own content and its own keys in browser storage, which page.js reads from <body data-page>
// (Calculus midterm 1 keeps page.js's defaults): store (practice marks, the open tab), seen (its key in study-seen, for
// New labels and its card on the picker; the home page finds it from a What's new entry's link) and scores (mock scores).
// lede: the band texts that differ between pages; soon: what a tab says while its content is still to come.
// quizFile and pastFile: its in-class sheets and past papers in src/math/private/ (locked); pastText: how the Exams tab
// names the past papers (the section's heading, the note on the password panels, the note above each paper; a paper's
// own `focus` replaces that note).
const PAST_FOCUS = 'A real midterm paper, retyped. The paper gives no time limit or points, so the timer and the points here are estimates. Work on paper, without notes or a calculator, then open each answer and tick the parts you got right.';
const DERIVATIVES = {
  id: 'derivatives', name: 'Calculus midterm 1', short: 'Midterm 1 · Derivatives',
  units, habits, practice, tags, formulas, followups, mocks, icons: UNIT_ICONS, graphs: GRAPHS, graphsAdded: GRAPHS_ADDED,
  testbarAdded: TESTBAR_ADDED, seen: 'math', conf: null, quizFile: 'inclass.mjs', pastFile: 'past.mjs',
  pastText: { kicker: 'Real midterm papers', title: 'Past midterms', noun: 'past midterms', focus: PAST_FOCUS,
    lock: 'The past midterms are locked. The mock exams above are open to everyone.' },
  title: 'CLA1 Midterm 1 Review',
  description: 'Review for Calculus midterm 1 (derivatives) in Calculus &amp; Linear Algebra 1: key ideas, practice problems with worked solutions, formulas, quizzes and mock midterms.',
  og: {
    title: 'CLA1 Review · Calculus midterm 1 (derivatives)',
    description: 'Unofficial review notes for Calculus midterm 1: key ideas, practice problems with worked solutions, formulas, quizzes and mock midterms.',
    url: 'math/derivatives/', image: 'og-math-derivatives.png',
    alt: 'CLA1 Review, Calculus midterm 1, derivatives: summary, practice, formulas, quizzes and exams',
  },
  lede: {
    summary: 'One section per lesson in the course schedule: the key ideas, and the common mistakes to avoid.',
    practice: (total) => `${total} practice problems, most in the same format as the quizzes. Try each one on paper, open the answer, then mark how it went.`,
  },
};
const INTEGRALS = {
  id: 'integrals', name: 'Calculus midterm 2', short: 'Midterm 2 · Integrals',
  units: INT.units, habits: INT.habits, practice: INT.practice, tags: INTX.tags, formulas: INTX.formulas, followups: INTF.followups, mocks: INT_MOCKS,
  // what the mocks cover, for their sheets and the band (Calculus midterm 1's say which quizzes): the lessons so far
  mockSpan: '2–19 Nov',
  icons: INTX.UNIT_ICONS, graphs: INTX.GRAPHS, graphsAdded: INTX.GRAPHS_ADDED, testbarAdded: '', seen: 'math-integrals',
  quizFile: 'inclass-integrals.mjs', pastFile: 'past-integrals.mjs',
  pastText: { kicker: 'Real midterm papers', title: 'Past midterms', noun: 'past midterms', focus: PAST_FOCUS,
    lock: 'The past midterms are locked with the same password as the in-class sheets.' },
  conf: { store: 'cla1-integrals-review', seen: 'math-integrals', home: 'summary', scores: 'cla1-integrals-mock-scores',
    suggest: ['substitution', 'by parts', 'partial fractions', 'arctan', 'primitive', 'Riemann sum'], tryWords: '"substitution" or "by parts"' },
  title: 'CLA1 Midterm 2 Review',
  description: 'Review for Calculus midterm 2 (integrals) in Calculus &amp; Linear Algebra 1: key ideas, practice problems with worked solutions, formulas, quizzes and mock midterms, added after each class.',
  og: {
    title: 'CLA1 Review · Calculus midterm 2 (integrals)',
    description: 'Unofficial review notes for Calculus midterm 2: key ideas, practice problems with worked solutions, formulas, quizzes and mock midterms, added after each class.',
    url: 'math/integrals/', image: 'og-math-integrals.png',
    alt: 'CLA1 Review, Calculus midterm 2, integrals: summary, practice, formulas, quizzes, and mock and past midterms',
  },
  lede: {
    summary: 'One section per lesson in the course schedule, added after each class: the key ideas, and the common mistakes to avoid. Lessons still to come are greyed out.',
    practice: (total) => `${total} practice problems with worked solutions. Try each one on paper, open the answer, then mark how it went.`,
    formulas: 'Every formula from the lessons so far on one page, plus the exact trig values you need without a calculator.',
    quizzes: 'From 5 &amp; 6 Nov, each lesson pair has an in-class quiz. Its sheet (password needed) and two open follow-ups are added here after the class.',
    exams: (n, lock) => `Upcoming exams with a countdown${n ? `, and ${n} past midterms of the integral part${lock ? ' <span class="nw">(password needed)</span>' : ''}` : ''}. Mock midterms for Calculus midterm 2 follow once more lessons are covered.`,
  },
  soon: {
    quizzes: 'The first in-class quiz on integrals is on 5 & 6 Nov.',
    mocks: 'Mock midterms with a timer and self-scoring are coming as the lessons are covered.',
  },
};
// Pages that hold only past exams so far (examsOnly): no lessons, practice, formulas or quizzes yet, so those tabs say
// what is coming (`later`: kicker, heading and the note, which may hold links) and the page opens on Exams.
const MIDTERM_LINKS = 'the <a href="../derivatives/">Calculus midterm 1</a> and <a href="../integrals/">midterm 2</a> pages';
const CALCULUS_FINAL = {
  id: 'calculus-final', name: 'Calculus final', short: 'Calculus final', examsOnly: true,
  units: [], habits: '', practice: {}, tags: {}, formulas: [], followups: {}, mocks: [], icons: { habits: '' }, graphs: {}, graphsAdded: '',
  testbarAdded: '', seen: 'math-calculus-final', quizFile: null, pastFile: 'past-calculus-final.mjs',
  pastText: { kicker: 'Real final papers', title: 'Past finals', noun: 'past finals', one: 'past final', focus: PAST_FOCUS,
    lock: 'The past finals are locked with the same password as the in-class sheets.' },
  conf: { store: 'cla1-calculus-final-review', seen: 'math-calculus-final', home: 'exams', scores: 'cla1-calculus-final-scores',
    suggest: ['Taylor', 'MATLAB', 'by parts', 'volume', 'implicit', 'container'], tryWords: '"Taylor" or "volume"' },
  title: 'CLA1 Calculus Final Review',
  description: 'Past Calculus finals of Calculus &amp; Linear Algebra 1 (the Calculus part), with worked answers.',
  og: {
    title: 'CLA1 Review · Calculus final',
    description: 'Unofficial review notes for the Calculus final: past finals with worked answers, including the MATLAB parts.',
    url: 'math/calculus-final/', image: 'og-math-calculus-final.png',
    alt: 'CLA1 Review, Calculus final: past finals with worked answers, notes to follow',
  },
  lede: {
    summary: 'Notes for the final come after the midterms. Until then, every lesson is on the Calculus midterm 1 and 2 pages.',
    practice: () => 'Practice problems for the final come later. Until then, Practice on the Calculus midterm 1 and 2 pages covers every lesson.',
    formulas: 'The formulas are on the Calculus midterm 1 and 2 pages for now.',
    quizzes: 'The in-class quizzes are on the Calculus midterm 1 and 2 pages.',
    exams: (n, lock) => `Upcoming exams with a countdown, and ${n} past finals${lock ? ' <span class="nw">(password needed)</span>' : ''}: their Calculus part, MATLAB problems included. Start the timer, work on paper, then open the answers and mark your paper.`,
  },
  later: {
    summary: ['Notes for the final', 'On the midterm pages for now', `Every lesson so far, with its key ideas and common mistakes, is on ${MIDTERM_LINKS}. Notes for the final follow after the midterms.`],
    practice: ['Practice', 'On the midterm pages for now', `Practice problems with worked solutions for every lesson are on ${MIDTERM_LINKS}.`],
    formulas: ['Formulas', 'On the midterm pages for now', `Each lesson's formulas, and the exact trig values, are on ${MIDTERM_LINKS}.`],
    quizzes: ['In-class quizzes', 'On the midterm pages', `The in-class quizzes and their follow-ups are on ${MIDTERM_LINKS}.`],
    night: ['The night before', 'Comes with the notes', `Until the final has notes of its own, use the night-before sheets of ${MIDTERM_LINKS}.`],
  },
};
const LINEAR_ALGEBRA = {
  id: 'linear-algebra', name: 'Linear Algebra', short: 'Linear Algebra', examsOnly: true,
  units: [], habits: '', practice: {}, tags: {}, formulas: [], followups: {}, mocks: [], icons: { habits: '' }, graphs: {}, graphsAdded: '',
  testbarAdded: '', seen: 'math-linear-algebra', quizFile: null, pastFile: 'past-linear-algebra.mjs',
  // two groups: the exam before the winter break (this year's Linear Algebra midterm) and the finals
  pastText: [
    { id: 'past', group: 'midterm', kicker: 'Before the winter break', title: 'Past midterms', noun: 'past midterms', one: 'past midterm', focus: PAST_FOCUS,
      lock: 'The past exams are locked with the same password as the in-class sheets.' },
    { id: 'past-finals', group: 'final', kicker: 'Real final papers', title: 'Past finals', noun: 'past finals', one: 'past final', focus: PAST_FOCUS,
      lock: 'The past exams are locked with the same password as the in-class sheets.' },
  ],
  conf: { store: 'cla1-linear-algebra-review', seen: 'math-linear-algebra', home: 'exams', scores: 'cla1-linear-algebra-scores',
    suggest: ['determinant', 'inverse', 'Hermitian', 'row echelon', 'LDU', 'rank'], tryWords: '"determinant" or "rank"' },
  title: 'CLA1 Linear Algebra Review',
  description: 'Past Linear Algebra exams of Calculus &amp; Linear Algebra 1, with worked answers. Notes follow once the classes start.',
  og: {
    title: 'CLA1 Review · Linear Algebra',
    description: 'Unofficial review notes for Linear Algebra: past exams with worked answers, notes to follow.',
    url: 'math/linear-algebra/', image: 'og-math-linear-algebra.png',
    alt: 'CLA1 Review, Linear Algebra: past exams with worked answers, notes to follow',
  },
  lede: {
    summary: 'Notes for each Linear Algebra lesson are added here once the classes start.',
    practice: () => 'Practice problems with worked solutions come with the Linear Algebra lessons.',
    formulas: 'The formulas come with the Linear Algebra lessons.',
    quizzes: 'The in-class quizzes of Linear Algebra are added here after each class.',
    exams: (n, lock) => `Upcoming exams with a countdown, and ${n} past exams${lock ? ' <span class="nw">(password needed)</span>' : ''}: the one before the winter break, and the finals. Start the timer, work on paper, then open the answers and mark your paper.`,
  },
  later: {
    summary: ['Linear Algebra', 'Notes after the first class', 'Each lesson gets its key ideas and common mistakes here, after its class.'],
    practice: ['Practice', 'Comes with the lessons', 'Practice problems with worked solutions follow each Linear Algebra lesson.'],
    formulas: ['Formulas', 'Comes with the lessons', 'Each lesson’s formulas are added here after its class.'],
    quizzes: ['In-class quizzes', 'Coming with the lessons', 'Each in-class quiz, with two open follow-ups, is added here after its class.'],
    night: ['The night before', 'Comes with the notes', 'The night-before sheet follows once the lessons have notes.'],
  },
};
const PAGES = [DERIVATIVES, INTEGRALS, LINEAR_ALGEBRA, CALCULUS_FINAL];
for (const P of PAGES) P.updated = pageUpdated(P);
// the picker's "Last updated": the newest of every Math page and of Math's What's new (read once the pages are built,
// since a page's past papers move its date too)
const pickerUpdated = () => newestOf([...mathNews.map((n) => n.date), ...PAGES.map((P) => P.updated)]);

// ---------- the page ----------
// P: the exam page (DERIVATIVES, INTEGRALS).
// quizzes: the in-class sheets (from src/math/private/inclass.mjs) or null when they aren't available.
// past: the past midterm papers (src/math/private/past.mjs) or null.
// locked: true for the public site, where in-class sheets and past papers become password panels and their HTML goes to `sheets`.
// lockedNos / lockedPast: what is locked when `quizzes` / `past` are null (taken from math/locked.json).
function render(P, { quizzes, past, locked, lockedNos = [], lockedPast = [] }) {
  const INDEX = [];
  const PRIV = [];
  const { units, habits, practice, tags, formulas, followups, mocks } = P;
  const UNIT_ICONS = P.icons;
  // the lessons taught so far; the rest of the schedule shows as greyed-out tiles
  const ready = units.filter((u) => !u.upcoming);
  // what a tab of an exams-only page says instead: [kicker, heading, note (HTML, may hold links)]
  const laterGroup = (id, [kicker, title, html]) => `
    <section class="qgroup" id="${id}">
      <header class="qg-head"><p class="kicker">${esc(kicker)}</p><h2>${esc(title)}</h2></header>
      <p class="soon-box">${UI_ICONS.calendar}<span>${html}</span></p>
    </section>`;

  // Summary
  const tileQ = (u) => u.quiz || (u.starred ? 'In-class quiz' : '');
  const tileInner = (u) => `${UNIT_ICONS[u.id]}<span class="tile-k">${esc(dayOf(u))}</span><span class="tile-t">${esc(u.title)}</span>${tileQ(u) ? `<span class="tile-q">${tileQ(u)}</span>` : ''}`;
  const tilesHTML = units.map((u) => (u.upcoming
    ? `<div class="tile upcoming">${tileInner(u)}<span class="tile-soon">Notes after class</span></div>`
    : `<button type="button" class="tile" data-goto="summary" data-target="su-${u.id}">${tileInner(u)}</button>`)).join('')
    + `<button type="button" class="tile" data-goto="summary" data-target="su-habits">${UNIT_ICONS.habits}<span class="tile-k">Before the exam</span><span class="tile-t">Exam-day habits</span></button>`;
  const summaryHTML = ready.map((u) => {
    const ideas = items(u.ideas).map((it, i) => {
      const id = `su-${u.id}-k${i + 1}`;
      const label = (it.match(/^\*\*(.+?)\*\*/) || [, ''])[1].replace(/[:.]$/, '').replace(/\$[^$]*\$/g, (m) => texPlain(m.slice(1, -1)));
      INDEX.push(entry('Summary', 'summary', id, `${label || 'Key idea'} — ${u.title}`, plain(it.replace(/^\*\*.+?\*\*\s*/, '')), u.quiz || dayOf(u)));
      return `<li id="${id}">${inline(it, false)}</li>`;
    }).join('');
    const watch = items(u.watch).map((it, i) => {
      const id = `su-${u.id}-w${i + 1}`;
      INDEX.push(entry('Summary', 'summary', id, `Watch out — ${u.title}`, plain(it), 'mistake slip ' + (u.quiz || dayOf(u))));
      return `<li id="${id}">${inline(it, false)}</li>`;
    }).join('');
    // Shortcuts: extra tricks that weren't taught in class (a unit's `tricks`, added at the user's request), kept apart
    // from the lecture's key ideas in a box of their own, after Watch out. `tricksAdded` gives the box its New label.
    const tricks = (u.tricks ? items(u.tricks) : []).map((it, i) => {
      const id = `su-${u.id}-t${i + 1}`;
      const label = (it.match(/^\*\*(.+?)\*\*/) || [, ''])[1].replace(/[:.]$/, '').replace(/\$[^$]*\$/g, (m) => texPlain(m.slice(1, -1)));
      INDEX.push(entry('Summary', 'summary', id, `Shortcut — ${label || u.title}`, plain(it.replace(/^\*\*.+?\*\*\s*/, '')), 'shortcut trick tip extra ' + (u.quiz || dayOf(u))));
      return `<li id="${id}">${inline(it, false)}</li>`;
    }).join('');
    const tricksHTML = tricks ? `
  <div class="tricks"${u.tricksAdded ? ` data-added="${esc(u.tricksAdded)}"` : ''}><h3>Shortcuts</h3><p class="tricks-note">Extra tricks, not from the lectures. On a quiz, still write the usual working.</p><ul>${tricks}</ul></div>` : '';
    return `
<section class="unit" id="su-${u.id}"${addedAttr(u)}>
  <header class="unit-head">${UNIT_ICONS[u.id]}<div><p class="kicker">${meta([u.days, u.dates, u.quiz, u.note])}</p><h2>${esc(u.title)}</h2></div></header>
  ${u.intro ? `<p class="unit-note">${inline(u.intro, false)}</p>` : ''}
  <ul class="ideas">${ideas}</ul>
  ${(P.graphs[u.id] || []).map(graphHTML(P.graphsAdded)).join('')}
  <div class="watch"><h3>Watch out</h3><ul>${watch}</ul></div>${tricksHTML}
</section>`;
  }).join('') + `
<section class="habits" id="su-habits"><h2 class="deco">Exam-day habits</h2><ul>${items(habits).map((it, i) => {
    const id = `su-habits-${i + 1}`;
    INDEX.push(entry('Summary', 'summary', id, 'Exam-day habit', plain(it), 'exam habit tip'));
    return `<li id="${id}">${inline(it, false)}</li>`;
  }).join('')}</ul></section>`;

  // Practice
  let total = 0;
  const ids = new Set();
  const practiceHTML = ready.map((u) => {
    const probs = practice[u.id] || [];
    const cards = probs.map((p, pi) => {
      total++;
      const id = probId(u, p, pi);
      if (ids.has(id)) throw new Error(`two practice problems share the id ${id}`);
      ids.add(id);
      const elId = `prob-${id.replace('.', '-')}`;
      INDEX.push(entry('Practice', 'practice', elId, `Practice · ${dayOf(u)} · Q.${pi + 1} — ${p.src}`, plain([p.stem, ...p.parts].join(' ')),
        [tags[id] || '', plain(p.hint || ''), plain(p.answer.join(' ')), u.title].join(' ')));
      const hint = p.hint ? toggle('hint', 'Hint', 'Hide hint', blocks(p.hint)) : '';
      const sol = solToggle('Show answer', 'Hide answer', answerBox(p.answer) + `<div class="steps">${blocks(p.sol)}</div>`, `
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
  <header class="punit-head"><div><p class="kicker">${meta([dayOf(u), u.quiz ? `like ${u.quiz}` : '', (u.note || '').toLowerCase()])}</p><h2>${esc(u.title)}</h2></div><span class="ucount">0/${probs.length}</span></header>
  <div class="probs">${cards}</div>
</section>`;
  }).join('');
  const unitRings = ready.map((u) => `<button type="button" class="uring" data-goto="practice" data-target="p${u.id}" data-unit="p${u.id}" aria-label="Practice for ${esc(dayOf(u))}: ${esc(u.title)}">${ring(17, '', 'ring-sm')}<span class="uring-no${dayShort(u).length > 3 ? ' long' : ''}">${dayShort(u)}</span><span class="uring-count">0/${(practice[u.id] || []).length}</span></button>`).join('');

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
  if (!P.examsOnly) INDEX.push(entry('Formulas', 'formulas', 'fg-exact', 'Exact trig values — cos, sin, tan',
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
  <p class="exact-note">${inline(String.raw`A slash means undefined: $\tan\frac{\pi}{2}$ doesn't exist because $\cos\frac{\pi}{2}=0$. The forms $\frac{1}{\sqrt{2}}=\frac{\sqrt{2}}{2}$ and $\frac{1}{\sqrt{3}}=\frac{\sqrt{3}}{3}$ are equal, so either is fine in an answer.`, false)}</p>
</section>`;

  // Quizzes: per quiz, the in-class sheet (or its password panel) plus Follow-up A and B behind a switcher
  const sheets = {};
  function sheetHTML(sheetId, seg, visible, title, sub, focus, qs, searchLabel, searchExtra, index) {
    return `
  <article class="sheet" id="${sheetId}" data-seg="${seg}"${visible ? '' : ' hidden'}>
    <header class="sheet-head">
      <div><h3 class="sheet-title">${title}</h3><p class="sheet-sub">${meta(sub.split(' · '))}</p></div>
      ${timerHTML(0)}
    </header>
    ${focus ? `<p class="focus">${esc(focus)}</p>` : ''}
    ${qs.map((x, i) => {
      const id = `${sheetId}-q${i + 1}`;
      // a quiz handed out on more than one sheet: `sheet` names each question's sheet, with a heading where one starts
      const part = x.sheet && (i === 0 || qs[i - 1].sheet !== x.sheet) ? `
    <p class="sheet-part">Sheet ${esc(x.sheet)}</p>` : '';
      index.push(entry('Quizzes', 'quizzes', id, `${searchLabel}${x.sheet ? ` · Sheet ${x.sheet}` : ''} · ${x.label}`, plain([x.stem, ...x.parts].join(' ')), plain(x.answer.join(' ')) + ' ' + searchExtra));
      return `${part}
    <div class="rq" id="${id}">
      <div class="stem">${blocks(withPts(x.stem, x.pts)).replace(/^<p>/, `<p><b class="ql">${x.label}</b> `)}</div>
      ${partsList(x.parts)}
      <div class="reveal">${solToggle('Show answer', 'Hide answer', answerBox(x.answer) + `<div class="steps">${blocks(x.sol)}</div>`)}</div>
    </div>`;
    }).join('')}
  </article>`;
  }
  const lockHTML = (no, days) => `
  <article class="sheet lock" id="rq${no}" data-seg="0">
    <header class="sheet-head"><div><h3 class="sheet-title">In-class Quiz ${no}</h3><p class="sheet-sub">${meta([days, '10 pt'])}</p></div></header>
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
    // the schedule's day label ("Day 1 & 2"), so a build with or without the password draws the same card
    const days = u.days || (q && q.days) || '';
    if (q) {
      const html = sheetHTML(`rq${no}`, '0', true, `In-class Quiz ${no}`, `${days} · 10 pt`, '', q.qs, `Quiz ${no}`, 'real quiz test in-class', locked ? PRIV : INDEX);
      if (locked) { sheets[`rq${no}`] = html.trim(); group += lockHTML(no, days); } else group += html;
    } else if (hasInClass) group += lockHTML(no, days);
    if (fa) group += sheetHTML(`rq${no}a`, '1', first === '1', `Follow-up Quiz ${no}-A`, 'Same skills, new numbers · 10 pt', '', fa.qs, `Quiz ${no} Follow-up A`, 'follow-up remedial extra quiz', INDEX);
    if (fb) group += sheetHTML(`rq${no}b`, '2', first === '2', `Follow-up Quiz ${no}-B`, 'Targets common mistakes · 10 pt', fb.focus.replace(/^Targets the usual slips: /, 'Watch for '), fb.qs, `Quiz ${no} Follow-up B`, 'follow-up remedial extra quiz slips', INDEX);
    const lockMark = hasInClass && locked ? `<span class="seg-lock">${UI_ICONS.lock}</span>` : '';
    return `
<section class="qgroup" id="qg${no}">
  <header class="qg-head"><p class="kicker">${meta([`Quiz ${no}`, u.days])}</p><h2>${esc(u.title)}</h2></header>
  <div class="seg" role="tablist" aria-label="Quiz ${no} sheets">${kinds.map(([seg, s, label]) =>
    `<button type="button" class="seg-btn" role="tab" data-seg="${seg}" aria-controls="rq${no}${s}" aria-selected="${seg === first}">${label}${seg === '0' ? lockMark : ''}</button>`).join('')}</div>
  ${group}
</section>`;
  }).join('');
  const quizJump = nos.map((no) => `<button type="button" class="chip" data-goto="quizzes" data-target="qg${no}">Quiz ${no}</button>`).join('');
  const quizUnits = units.filter((u) => u.quiz);
  const qnum = (u) => u.quiz.replace(/^Quiz /, '');
  const span = P.mockSpan || (quizUnits.length > 1 ? `Quizzes ${qnum(quizUnits[0])}–${qnum(quizUnits[quizUnits.length - 1])}` : quizUnits.length ? quizUnits[0].quiz : '');
  const daySpan = units.length ? spanOf(units) : '';
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
  // the past papers, in one switcher per group: P.pastText, or a list of groups, each taking the papers of its `group`
  const GROUPS = Array.isArray(P.pastText) ? P.pastText : [{ id: 'past', ...P.pastText }];
  const PT = GROUPS[0];
  const totalPts = (m) => m.qs.reduce((t, q) => t + q.pts.reduce((a, b) => a + b, 0), 0);
  function examSheet(m, seg, visible, about, focus, searchExtra, index) {
    const points = totalPts(m);
    const qsHTML = m.qs.map((x, qi) => {
      const id = `${m.id}-q${qi + 1}`;
      const qpts = x.pts.reduce((a, b) => a + b, 0);
      const lab = (pi) => (x.labels ? x.labels[pi] : String(pi + 1));
      if (x.labels && x.labels.length !== x.parts.length) throw new Error(`${id}: ${x.labels.length} labels for ${x.parts.length} parts`);
      if (x.pts.length !== x.parts.length || x.answer.length !== x.parts.length) throw new Error(`${id}: parts, pts and answers don't match`);
      index.push(entry('Exams', 'exams', id, `${m.title} · ${x.label} — ${x.topic}`, plain([x.stem, ...x.parts].join(' ')), plain(x.answer.join(' ')) + ' ' + searchExtra));
      // a question that is one question has the label '' (no "(1)")
      const marks = x.pts.map((p, pi) => `<button type="button" class="mk" data-k="${qi + 1}.${pi + 1}" data-pts="${p}" aria-pressed="false">${lab(pi) ? `(${lab(pi)}) ` : ''}${p} pt</button>`).join('');
      return `
    <div class="rq" id="${id}">
      <div class="rq-head"><b class="ql">${x.label}</b><span class="qtopic-wrap"><span class="qtopic">${esc(x.topic)}</span></span><span class="pts">${qpts} pt</span></div>
      ${x.stem ? `<div class="stem"><p>${inline(x.stem)}</p></div>` : ''}
      ${partsList(x.parts.map((t, pi) => `${t} (${x.pts[pi]}pt)`), x.labels)}
      <div class="reveal">${solToggle('Show answer', 'Hide answer', answerBox(x.answer) + `<div class="steps">${blocks(x.sol)}</div>`, `
      <div class="mkrow"><span>Tick what you got right:</span>${marks}</div>`)}</div>
    </div>`;
    }).join('');
    return `
  <article class="sheet mock" id="${m.id}" data-seg="${seg}" data-mock="${m.id}" data-total="${points}"${visible ? '' : ' hidden'}${addedAttr(m)}>
    <header class="sheet-head">
      <div><h3 class="sheet-title">${esc(m.title)}</h3><p class="sheet-sub">${meta([about, `${m.minutes} min`, `${points} pt`])}</p></div>
      ${timerHTML(m.minutes * 60)}
    </header>
    <p class="print-only print-score">Score: <span class="blank"></span> / ${points} pt</p>
    <p class="focus">${focus}</p>
    <div class="sheet-tools"><button type="button" class="linkbtn print-btn" data-print="paper">${UI_ICONS.print}<span>Print paper</span></button><button type="button" class="linkbtn print-btn" data-print="key">${UI_ICONS.print}<span>Print with answers</span></button></div>
    ${qsHTML}
    <div class="scorebar"><span class="score"><b class="score-val">0</b> / ${points} pt</span><span class="score-note">from the parts you ticked</span><button type="button" class="linkbtn mk-clear">Clear ticks</button></div>
  </article>`;
  }
  // a mock may carry its own note above it (`focus`), such as a mock in the in-class quizzes' style
  const mockSheets = mocks.map((m, mi) => examSheet(m, mi, mi === 0, span, esc(m.focus || MOCK_FOCUS), 'mock midterm exam practice test', INDEX)).join('');
  // past papers: locked like the in-class sheets (the panel shows only the title until the password opens it)
  const pastMeta = (p) => ({ id: p.id, ...(p.group ? { group: p.group } : {}), seg: p.seg, title: p.title, sub: p.sub, minutes: p.minutes, points: totalPts(p), added: p.added || '' });
  const pastList = past ? past.map(pastMeta) : lockedPast;
  const pastLock = locked && pastList.length > 0;
  const inGroup = (G) => (p) => !G.group || p.group === G.group;
  for (const p of pastList) if (!GROUPS.some((G) => inGroup(G)(p))) throw new Error(`${P.name}: the past paper ${p.id} is in no group of pastText`);
  const pastHTML = GROUPS.map((G) => {
    const list = pastList.filter(inGroup(G));
    if (!list.length) return '';
    const lockHTML = (p, seg) => `
  <article class="sheet lock" id="${p.id}" data-seg="${seg}"${seg ? ' hidden' : ''}${addedAttr(p)}>
    <header class="sheet-head"><div><h3 class="sheet-title">${esc(p.title)}</h3><p class="sheet-sub">${meta([p.sub, `${p.minutes} min`, `${p.points} pt`])}</p></div></header>
    ${unlockForm(p.id, G.lock)}
  </article>`;
    let sheetsHTML = '';
    list.forEach((p, pi) => {
      const full = past && past.find((x) => x.id === p.id);
      if (full) {
        const html = examSheet(full, pi, pi === 0, full.sub, esc(full.focus || G.focus), 'past midterm final exam previous year real paper', locked ? PRIV : INDEX);
        if (locked) { sheets[p.id] = html.trim(); sheetsHTML += lockHTML(p, pi); } else sheetsHTML += html;
      } else sheetsHTML += lockHTML(p, pi);
    });
    return `
    <section class="qgroup mockgroup" id="${G.id}">
      <header class="qg-head"><p class="kicker">${esc(G.kicker)}</p><h2>${esc(G.title)}</h2></header>
      <div class="seg" role="tablist" aria-label="${esc(G.title)}">${list.map((p, pi) =>
    `<button type="button" class="seg-btn" role="tab" data-seg="${pi}" aria-controls="${p.id}" aria-selected="${pi === 0}">${esc(p.seg)}${pastLock ? `<span class="seg-lock">${UI_ICONS.lock}</span>` : ''}<span class="seg-score"></span></button>`).join('')}</div>
      ${sheetsHTML}
    </section>`;
  }).join('');
  // an exam page without mocks yet says they are coming
  const mocksInner = mocks.length ? `<div class="seg" role="tablist" aria-label="Mock midterms">${mocks.map((m, mi) =>
    `<button type="button" class="seg-btn" role="tab" data-seg="${mi}" aria-controls="${m.id}" aria-selected="${mi === 0}">Mock ${mi + 1}<span class="seg-score"></span></button>`).join('')}</div>
      ${mockSheets}` : P.soon && P.soon.mocks ? soon(P.soon.mocks) : '';
  // an exams-only page has no mocks section and no night-before link (yet)
  const examsHTML = `
    <section class="exam-up" id="ex-upcoming">
      <h2 class="sec-title">Upcoming exams</h2>
      <ul class="up-list">${upcomingHTML}</ul>
      ${P.examsOnly ? '' : nightLink('Every formula, the common mistakes and the exam-day habits on one page')}
    </section>${mocksInner ? `
    <section class="qgroup mockgroup" id="mocks">
      <header class="qg-head"><p class="kicker">Practice under exam conditions</p><h2>Mock midterms</h2></header>
      ${mocksInner}
    </section>` : ''}${pastHTML}`;
  // Quizzes: a jump row and one group per quiz, or, before the first quiz, when it is
  const quizzesTab = nos.length ? `<nav class="qjump" aria-label="Jump to a quiz">${quizJump}</nav>${quizzesHTML}
      ${hasLocks ? '<div class="reset-row lockrow" id="lockrow" hidden><button type="button" class="linkbtn" id="lock-again">Lock again</button><span>The in-class sheets are open in this browser.</span></div>' : ''}` : P.examsOnly ? laterGroup('qg-soon', P.later.quizzes) : `
    <section class="qgroup" id="qg-soon">
      <header class="qg-head"><p class="kicker">In-class quizzes</p><h2>Coming with the next lesson</h2></header>
      ${soon(P.soon.quizzes)}
    </section>`;

  const TABS = [['summary', 'Summary'], ['practice', 'Practice'], ['formulas', 'Formulas'], ['quizzes', 'Quizzes'], ['exams', 'Exams']];
  // The newest `added` date in each tab, so the tab can show a dot before its content is built
  const newest = (dates) => dates.filter(Boolean).sort().pop() || '';
  const NEWEST = {
    summary: newest([...units.map((u) => u.added), Object.keys(P.graphs).length ? P.graphsAdded : '']),
    practice: newest(Object.values(practice).flat().map((p) => p.added)),
    formulas: newest([...formulas.map((g) => g.added), P.testbarAdded]),
    quizzes: newest(Object.values(followups).flat().map((f) => f.added)),
    exams: newest([...mocks.map((m) => m.added), ...pastList.map((p) => p.added)]),
  };
  // Summary is built with the page. The other tabs travel as JSON text and are built the first time they open
  // (page.js), so the browser only lays out what is being read; that keeps the first load fast as content grows.
  // The night before: the exam-day habits, then for each lesson on the midterm its formulas (matched by the group's
  // day label) and its "Watch out" list, then the values to know (the exact trig values, and the formula groups of no
  // single lesson). A view without a tab (#night); it prints as it is. No search entries: it repeats Summary and Formulas.
  const onExam = ready.filter((u) => !u.note);
  // a group's label starts with its lesson's days, or with its dates while no quiz sheet has given it day numbers
  const lessonOf = (g) => onExam.find((u) => g.quiz.split(' · ')[0] === dayOf(u));
  const nrow = ([name, t]) => `<div class="nrow"><span class="nname">${esc(name)}</span><div class="nmath">${tex('\\displaystyle ' + t, false)}</div></div>`;
  const nlist = (src) => items(src).map((it) => `<li>${inline(it, false)}</li>`).join('');
  const loose = formulas.filter((g) => !lessonOf(g) && !/not on the midterm/i.test(g.quiz));
  const nightHTML = `
${nightTools}
<section class="nsec" id="nt-habits"><h2><span class="kicker">On the day</span>Exam-day habits</h2><ul class="nhabits">${nlist(habits)}</ul></section>
${onExam.map((u) => `<section class="nsec" id="nt-${u.id}"><h2><span class="kicker">${esc(dayOf(u))}</span>${esc(u.title)}</h2>
  <div class="nrows">${formulas.filter((g) => lessonOf(g) === u).flatMap((g) => g.rows).map(nrow).join('')}</div>
  <div class="watch"><h3>Watch out</h3><ul>${nlist(u.watch)}</ul></div></section>`).join('\n')}
<section class="nsec" id="nt-values"><h2><span class="kicker">No calculator</span>Values to know</h2>
  <div class="table-wrap">${exactWide}${exactTall}</div>
  ${loose.map((g) => `<h3 class="fmod">${esc(g.title)}</h3><div class="nrows">${g.rows.map(nrow).join('')}</div>`).join('')}</section>`;
  const LAZY = {
    night: P.examsOnly ? `${nightTools}${laterGroup('nt-soon', P.later.night)}` : nightHTML,
    practice: P.examsOnly ? laterGroup('pu-soon', P.later.practice) : `
      <div class="overview">
        <div class="ov-main">
          <div class="ring-big-wrap">${ring(38, 'ring-all', 'ring-lg')}<span class="ring-center"><b id="ring-all-text">0/${total}</b><small>got it</small></span></div>
          <div class="ov-side">
            <ul class="legend"><li><i class="k-got"></i><b id="ov-got">0</b> got it</li><li><i class="k-rev"></i><b id="ov-rev">0</b> to review</li><li><i class="k-un"></i><b id="ov-un">${total}</b> not marked</li></ul>
            ${practiceButtons}
          </div>
        </div>
        <div class="urings" aria-label="Jump to a unit">${unitRings}</div>
      </div>
      ${sessionSetup(ready.filter((u) => (practice[u.id] || []).length).map((u) => [`p${u.id}`, dayShort(u), `${dayOf(u)}: ${u.title}`]), 'Lessons', null)}
      <div class="filters" role="group" aria-label="Show">
        <button type="button" class="chip" data-filter="all" aria-pressed="true">All</button>
        <button type="button" class="chip" data-filter="review" aria-pressed="false">To review</button>
        <button type="button" class="chip" data-filter="unmarked" aria-pressed="false">Not marked</button>
      </div>
      <p class="empty-note" id="empty-note" hidden></p>
      ${practiceHTML}
      <div class="reset-row"><button type="button" class="linkbtn" id="reset">Clear all marks</button><span>Marks are saved in this browser only.</span></div>`,
    formulas: P.examsOnly ? laterGroup('fg-soon', P.later.formulas) : `
      <div class="testbar"${P.testbarAdded ? ` data-added="${P.testbarAdded}"` : ''}>
        <button type="button" class="pill" id="test-btn" aria-pressed="false">${UI_ICONS.eye}<span>Test me</span></button>
        <p class="test-hint">Hides every formula and exact value. Say it to yourself, then tap to check.</p>
        <button type="button" class="linkbtn" id="test-reset" hidden>Hide all again</button>
      </div>
      ${nightLink('The formulas with each lesson’s common mistakes, to read the night before')}
      ${exactHTML}${formulasHTML}`,
    quizzes: quizzesTab,
    exams: examsHTML,
  };
  const lazyBox = (v) => `<div class="wrap content" data-lazy="${v}"><p class="lazy-wait">Loading…</p></div>`;
  // raw HTML inside a non-JS <script> is kept as plain text by the browser and built when the tab first opens
  const lazyScripts = Object.entries(LAZY).map(([v, html]) => lazyTab(v, html)).join('\n');
  const body = `
<header class="appbar"><div class="wrap appbar-row">
  <a class="brand" href="#summary" aria-label="CLA1 Review, ${P.name}, go to Summary">${BADGE}<span class="brand-text"><b>CLA1 Review</b><small>${P.short}</small></span></a>
  <div class="appbar-actions">
    ${subjectSwitch('physics', '../../physics/')}
    <button type="button" class="icon-btn" id="theme-btn" data-mode="system" aria-label="Theme: system. Tap to change."><span class="t-system">${UI_ICONS.system}</span><span class="t-light">${UI_ICONS.light}</span><span class="t-dark">${UI_ICONS.dark}</span></button>
    <button type="button" class="icon-btn" id="search-btn" aria-label="Search everything">${UI_ICONS.search}</button>
  </div>
</div></header>

${SB_FOOT}
<nav class="tabbar" aria-label="Sections" data-updated="${P.updated}"><div class="tabbar-row" role="tablist">
  ${TABS.map(([v, l]) => `<button type="button" class="tab" role="tab" id="tab-${v}" data-view="${v}" aria-controls="view-${v}" aria-selected="${v === 'summary'}"${NEWEST[v] ? ` data-newest="${NEWEST[v]}"` : ''}>${TAB_ICONS[v]}<span>${l}</span></button>`).join('')}
</div></nav>

<main%MAIN_ATTRS%>
  <section id="view-summary" class="view" role="tabpanel" aria-labelledby="tab-summary">
    ${band('Summary', 'まとめ', P.lede.summary)}
    <div class="wrap content">
      ${P.examsOnly ? laterGroup('su-soon', P.later.summary) : `<nav class="tiles" aria-label="Units">${tilesHTML}</nav>
      ${summaryHTML}`}
    </div>
  </section>

  <section id="view-practice" class="view" role="tabpanel" aria-labelledby="tab-practice" hidden>
    ${band('Practice', '練習問題', P.lede.practice(total))}
    ${lazyBox('practice')}
  </section>

  <section id="view-formulas" class="view" role="tabpanel" aria-labelledby="tab-formulas" hidden>
    ${band('Formulas', '公式集', P.lede.formulas || `Every formula from <span class="nw">${daySpan}</span> on one page, plus the exact trig values you need without a calculator.`)}
    ${lazyBox('formulas')}
  </section>

  <section id="view-quizzes" class="view" role="tabpanel" aria-labelledby="tab-quizzes" hidden>
    ${band('Quizzes', '小テスト', !nos.length ? P.lede.quizzes : hasLocks
    ? 'Each quiz has the in-class sheet (password needed) and two open follow-ups: A uses the same skills with new numbers, and B targets common mistakes. Start the timer and work without notes.'
    : 'Each quiz has the in-class sheet and two follow-ups: A uses the same skills with new numbers, and B targets common mistakes. Start the timer and work without notes.')}
    ${lazyBox('quizzes')}
  </section>

  <section id="view-exams" class="view" role="tabpanel" aria-labelledby="tab-exams" hidden>
    ${band('Exams', '試験', !mocks.length ? (typeof P.lede.exams === 'function' ? P.lede.exams(pastList.length, pastLock) : P.lede.exams) : `Upcoming exams with a countdown, ${mocks.length} mock exams for ${P.name} covering <span class="nw">${span}</span>${pastList.length ? `, and ${pastList.length} ${PT.noun}${pastLock ? ' <span class="nw">(password needed)</span>' : ''}` : ''}. Start the timer, work on paper, then open the answers and mark your paper.`)}
    ${lazyBox('exams')}
  </section>

  <section id="view-night" class="view night" aria-label="Night-before sheet" hidden>
    ${band('Night before', '直前チェック', P.examsOnly ? `The night-before sheet for ${P.name} comes with its notes.` : `One page for the night before ${P.name}: the exam-day habits, then each lesson’s formulas and common mistakes, and the values to know without a calculator. Read it once more, or print it.`)}
    ${lazyBox('night')}
  </section>
</main>
${lazyScripts}
`;
  return { body, INDEX, PRIV, sheets, total, hasLocks: hasLocks || pastLock, nos, pastList, daySpan };
}

// site: the footer of a page at math/<exam>/ (links up to the picker and the home page); the artifact has none.
// updated: the page's "Last updated" date.
function foot(site, updated) {
  return `
<footer class="site-foot"><div class="wrap">
  <p class="deco cheer">Good luck in your studies!</p>
  ${site ? '<p class="foot-links"><a href="../">← All exams</a> <a href="../../">All subjects</a></p>' : ''}
  <p class="fine">Study notes for Calculus &amp; Linear Algebra 1. Not an official Kyoto University of Advanced Science page. Every answer was checked numerically before publishing.</p>
  <p class="fine">Last updated <time datetime="${updated}">${fmtDate(updated)}</time>.</p>
  <p class="fine">Math typeset with KaTeX (${site ? '<a href="../../src/vendor/katex/LICENSE.txt">MIT License</a>' : 'MIT License'}).</p>
</div></footer>

<div class="search-sheet" id="search" role="dialog" aria-modal="true" aria-label="Search" hidden>
  <div class="search-bar"><div class="wrap search-row">
    <label class="search-field">${UI_ICONS.search}<input id="search-input" type="search" placeholder="Search problems, formulas, notes" autocomplete="off" enterkeyhint="search"></label>
    <button type="button" class="icon-btn" id="search-close" aria-label="Close search">${UI_ICONS.close}</button>
  </div></div>
  <div class="wrap search-results" id="search-results"></div>
</div>`;
}

// page.css/page.js are the Math pages'; the floating calculator and the back-to-top button in src/shared are common to every subject page
const SHARED = path.join(ROOT, 'src', 'shared');
const CSS_FILES = [path.join(SRC, 'page.css'), path.join(SHARED, 'calculator.css'), path.join(SHARED, 'totop.css'), path.join(SHARED, 'looks.css')];
const JS_FILES = [path.join(SRC, 'page.js'), path.join(SRC, 'graphs.js'), path.join(SHARED, 'totop.js'), path.join(SHARED, 'calculator.js')];
// the artifact: everything inside the page
const inlineAssets = () => ({ css: readAll(CSS_FILES), js: readAll(JS_FILES), kcss: katexCSS() });
// the site: one stylesheet, one script and the KaTeX fonts in math/assets/, shared by every exam page. Pages name the
// stylesheet and script with ?v=<hash of the file>, so browsers and the service worker keep a copy until it changes.
function writeAssets() {
  const fonts = [];
  const kcss = katexCSS((name) => { fonts.push(name); return `fonts/${name}.woff2`; });
  const note = (from) => `/* Built by src/math/build.mjs from ${from}. Don't edit it here: change the sources and build again. */\n`;
  const css = note('src/math/page.css, src/shared/calculator.css, src/shared/totop.css, src/shared/looks.css and KaTeX') + readAll(CSS_FILES) + '\n' + kcss + '\n' + KATEX_TWEAK + '\n';
  const js = note('src/math/page.js, src/math/graphs.js, src/shared/totop.js and src/shared/calculator.js') + readAll(JS_FILES) + '\n';
  writeIfChanged(path.join(ASSETS, 'math.css'), css);
  writeIfChanged(path.join(ASSETS, 'math.js'), js);
  const dir = path.join(ASSETS, 'fonts');
  for (const f of fonts) writeIfChanged(path.join(dir, f + '.woff2'), fs.readFileSync(path.join(KATEX_DIR, 'fonts', f + '.woff2')));
  for (const f of fs.readdirSync(dir)) if (!fonts.includes(f.replace(/\.woff2$/, ''))) fs.rmSync(path.join(dir, f));
  return { css: `math.css?v=${hash(css)}`, js: `math.js?v=${hash(js)}`, fonts };
}

// The key for SITE_PASSWORD. Reuses the salt of the current files, so browsers that chose "Remember on this device"
// stay unlocked after a rebuild, and refuses a password that doesn't open them: a typo here would lock everyone out.
async function keyring(pw, { fresh = false } = {}) {
  if (!pw || !normalize(pw)) fail('set SITE_PASSWORD (the password for the in-class sheets).');
  const current = [...PAGES.map((P) => readJSON(lockedFile(P))), readJSON(SEALED)].filter(Boolean);
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
const loadQuizzes = (ring) => loadPrivate(ring, DERIVATIVES.quizFile, 'quizzes');
const loadPast = (ring) => loadPrivate(ring, DERIVATIVES.pastFile, 'past');

// An exam page's locked file: its in-class sheets and past papers, sealed with the ring and rewritten only when they
// change. `quizzes` null (no password): the current file stays as it is ([] on a page without in-class sheets).
// Returns the box the page links to.
async function sealLocked(ring, file, box, quizzes, r) {
  if (!quizzes) return box;
  if (!r.hasLocks) return box; // nothing to lock on this page (yet)
  const payload = { sheets: r.sheets, index: r.PRIV };
  let same = false;
  if (box) { try { same = JSON.stringify(await openBox(ring.key, box)) === JSON.stringify(payload) && JSON.stringify(box.past || []) === JSON.stringify(r.pastList); } catch { same = false; } }
  if (same) return box;
  // `quizzes` and `past` (titles, minutes, points) stay readable, so a build without the password can still draw the panels
  const next = await sealBox(ring, payload, { quizzes: quizzes.map((q) => q.no), past: r.pastList });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(next) + '\n');
  console.log('wrote', rel(file), (fs.statSync(file).size / 1024).toFixed(0) + ' KB · in-class entries:', r.PRIV.length);
  return next;
}
// the page's data-locked address: its locked file with the file's version, or '' when it has nothing locked
function lockedAddress(P, r, box, file) {
  const src = r.hasLocks && box ? 'locked.json?v=' + hash(fs.readFileSync(file)) : '';
  if (r.hasLocks && !src) fail(`${P.name} lists locked sheets but ${rel(file)} is missing; build with SITE_PASSWORD.`);
  return src;
}

// ---------- commands ----------
const PASSWORD = process.env.SITE_PASSWORD || '';

async function buildSite(pw = PASSWORD, { afterRekey = false } = {}) {
  const ring = pw ? await keyring(pw) : null;
  if (ring) await syncSeal(ring);
  else if (!afterRekey && readPrivateDir()) console.warn('note: src/math/private/ exists but SITE_PASSWORD is not set, so the locked in-class sheets were not rebuilt.');
  const a = writeAssets();
  const built = {};
  // each exam page with its own in-class sheets and past papers (src/math/private/) and its own locked file
  for (const P of PAGES) {
    const file = lockedFile(P);
    const quizzes = !ring ? null : P.quizFile ? await loadPrivate(ring, P.quizFile, 'quizzes') : [];
    const past = ring && P.pastFile ? await loadPrivate(ring, P.pastFile, 'past') : null;
    let box = readJSON(file);
    // "Last updated" counts the page's past papers too (their dates stay readable in the locked file)
    P.updated = newestOf([pageUpdated(P), ...(past || (box && box.past) || []).map((p) => p.added)]);
    const r = render(P, { quizzes, past, locked: true, lockedNos: box ? box.quizzes : [], lockedPast: (box && box.past) || [] });
    box = await sealLocked(ring, file, box, quizzes, r);
    writePage(P, r, a, lockedAddress(P, r, box, file));
    built[P.id] = r;
  }
  const picker = pickerHTML(a, built);
  writeIfChanged(path.join(MATH, 'index.html'), picker);
  console.log('wrote', rel(path.join(MATH, 'index.html')), (picker.length / 1024).toFixed(0) + ' KB · exams:', EXAMS.map((x) => x.id + (x.page ? '' : ' (soon)')).join(', '),
    '· shared files:', a.css, a.js, `and ${a.fonts.length} fonts in`, rel(ASSETS));
}

// one exam page at math/<P.id>/index.html. a: the shared files; lockedSrc: its locked file with version, or ''
function writePage(P, r, a, lockedSrc) {
  // the two fonts nearly every formula uses start loading with the page
  const PRELOAD = ['KaTeX_Main-Regular', 'KaTeX_Math-Italic'];
  if (!PRELOAD.every((f) => a.fonts.includes(f))) fail('a preloaded KaTeX font is not among the shared fonts');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${P.title}</title>
<meta name="description" content="${P.description}">
${ogTags(P.og)}
${HEAD_COMMON('../../')}
${THEME_EARLY}
${FONT_LINKS}
${PRELOAD.map((f) => `<link rel="preload" href="../assets/fonts/${f}.woff2" as="font" type="font/woff2" crossorigin>`).join('\n')}
<link rel="preload" href="../assets/${a.js}" as="script">
<link rel="stylesheet" href="../assets/${a.css}">
</head>
<body data-page="${esc(JSON.stringify({ name: P.name, ...(P.conf || {}) }))}">
${SB_EDGE}
${r.body.replace('%MAIN_ATTRS%', lockedSrc ? ` data-locked="${lockedSrc}"` : '')}
${foot(true, P.updated)}
${indexScript(r.INDEX)}
<script src="../assets/${a.js}"></script>
</body>
</html>
`;
  const out = path.join(MATH, P.id, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  writeIfChanged(out, html);
  console.log('wrote', rel(out), (html.length / 1024).toFixed(0) + ' KB · problems:', r.total, '· public index entries:', r.INDEX.length,
    '· quizzes:', r.nos.join(' ') || 'none yet', r.hasLocks ? '(in-class sheets locked)' : '');
}

// the facts under an exam's card on the picker
function statsOf(P, r) {
  // an exams-only page: how many past papers of each group
  if (P.examsOnly) return (Array.isArray(P.pastText) ? P.pastText : [P.pastText]).map((G) => {
    const n = r.pastList.filter((p) => !G.group || p.group === G.group).length;
    return n ? `${n} ${n === 1 ? G.one || G.noun : G.noun}` : '';
  });
  const ready = P.units.filter((u) => !u.upcoming).length, all = P.units.length;
  // every lesson has notes: say so, and still list only the parts it has (no "0 mocks")
  if (ready === all) return [`${all} lessons`, `${r.total} practice problems`, r.nos.length ? `${r.nos.length} quizzes` : '',
    P.mocks.length ? `${P.mocks.length} mocks` : '', r.pastList.length ? `${r.pastList.length} past midterms` : ''];
  // an exam still being taught: the lessons so far, and only the parts it already has
  return [`${ready} of ${all} lessons`, `${r.total} practice problems`, r.nos.length ? `${r.nos.length} quizzes` : '',
    P.mocks.length ? `${P.mocks.length} mocks` : '', r.pastList.length ? `${r.pastList.length} past midterms` : ''];
}

// ---------- the exam picker (math/index.html) ----------
// Old addresses were the one Math page (math/#exams, math/#prob-1-1…): the picker has no anchors of its own, so any
// address with a # goes on to the derivative part, where those sections now live.
// built: each exam page's render() result, by page id
function pickerHTML(a, built) {
  const cards = EXAMS.map((x) => {
    const ex = SITE.exams.find((e) => e.name === x.exam);
    if (!ex) fail(`site.json has no exam named "${x.exam}" (the picker's ${x.id} card)`);
    // the home page links an exam to its page through site.json, so the two must agree
    const page = x.page ? `math/${x.page}/` : null;
    if ((ex.page || null) !== page) fail(`site.json: "${x.exam}" needs "page": ${JSON.stringify(page)}, like the picker's card`);
    const day = ex.date ? new Date(`${ex.date}T12:00:00+09:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Tokyo' }) + (ex.time ? ' · ' + ex.time : '') : 'Date to be announced';
    const when = `<span class="e-when"${ex.date ? ` data-date="${esc(ex.date)}"` : ''}>${UI_ICONS.calendar}<span class="nw">${esc(day)}</span><span class="e-left" aria-live="off"></span></span>`;
    const P = x.page && PAGES.find((p) => p.id === x.page);
    const r = x.page && built[x.page];
    if (x.page && !(P && r)) fail(`the picker's ${x.id} card opens math/${x.page}/, but no exam page was built there`);
    const stats = x.page ? `<p class="e-stats">${meta(statsOf(P, r))}</p>` : '';
    const inner = `${EXAM_ICONS[x.id]}<span class="e-head"><span class="kicker">${meta([x.kicker, x.page ? r.daySpan : ''])}</span><span class="e-title">${esc(x.title)}</span></span>
      <p class="e-text">${esc(x.text)}</p>${stats}
      <span class="e-foot">${when}${x.page ? `<span class="pill">Open${UI_ICONS.arrow}</span>` : '<span class="e-soon">Coming soon</span>'}</span>`;
    // data-seen: the exam page's key in study-seen, for the New label
    return x.page
      ? `<a class="exam" id="exam-${x.id}" href="${x.page}/" data-updated="${P.updated}" data-seen="${P.seen}">${inner}</a>`
      : `<div class="exam soon" id="exam-${x.id}">${inner}</div>`;
  }).join('\n    ');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>if (location.hash.length > 1) location.replace('derivatives/' + location.hash);</script>
<title>CLA1 Review</title>
<meta name="description" content="Review notes for each exam of Calculus &amp; Linear Algebra 1: key ideas, practice problems with worked solutions, formulas, quizzes, mock midterms and past exams.">
${ogTags({
    title: 'CLA1 Review · Calculus &amp; Linear Algebra 1',
    description: 'Unofficial review notes for each exam: key ideas, practice problems with worked solutions, formulas, quizzes, mock midterms and past exams.',
    url: 'math/', image: 'og-math.png',
    alt: 'CLA1 Review, Calculus and Linear Algebra 1: Calculus midterm 1 (derivatives) and midterm 2 (integrals), Linear Algebra and the Calculus final',
  })}
${HEAD_COMMON('../')}
${THEME_EARLY}
${FONT_LINKS}
<link rel="stylesheet" href="assets/${a.css}">
<style>${PICKER_CSS}
</style>
<script src="../src/shared/totop.js" defer></script>
</head>
<body class="picker">
${SB_EDGE}
<header class="appbar"><div class="wrap appbar-row">
  <a class="brand" href="./" aria-label="CLA1 Review, all exams">${BADGE}<span class="brand-text"><b>CLA1 Review</b><small>Calculus &amp; Linear Algebra 1</small></span></a>
  <div class="appbar-actions">${subjectSwitch('physics', '../physics/')}</div>
</div></header>
<main>
  ${band('Exams', '試験', 'One page of notes for each exam: key ideas, practice problems with worked solutions, formulas, quizzes, mock midterms and past exams.')}
  <div class="wrap content">
    <nav class="exams" aria-label="Exams">
    ${cards}
    </nav>
  </div>
</main>
<footer class="site-foot"><div class="wrap">
  <p class="foot-links"><a href="../">← All subjects</a></p>
  <p class="fine">Study notes for Calculus &amp; Linear Algebra 1. Not an official Kyoto University of Advanced Science page.</p>
  <p class="fine">Last updated <time datetime="${pickerUpdated()}">${fmtDate(pickerUpdated())}</time>.</p>
</div></footer>
<script>${PICKER_JS}</script>
</body>
</html>
`;
}

async function buildArtifact(out) {
  if (!out) fail('usage: node src/math/build.mjs artifact <out.html>');
  const ring = PASSWORD ? await keyring(PASSWORD) : null;
  const quizzes = await loadQuizzes(ring);
  if (!quizzes) fail('the in-class sheets are needed: run `open` first, or set SITE_PASSWORD.');
  const past = await loadPast(ring);
  const r = render(DERIVATIVES, { quizzes, past, locked: false, lockedNos: [] });
  const { css, js, kcss } = inlineAssets();
  if (/<\/script|<!--/i.test(js)) fail('a script contains "</script" or "<!--", which would end the inline <script> early; write it "<\\/script".');
  // claude.ai artifact: the host supplies the document skeleton, so the page starts at <title>
  const html = `<title>CLA1 Midterm Review</title>
<meta name="claude:viewport-fit-sides" content="cover">
${FONT_LINKS}
<style>${css}</style>
<style>${kcss}</style>
<style>${KATEX_TWEAK}</style>
${r.body.replace('%MAIN_ATTRS%', '')}
${foot(false, DERIVATIVES.updated)}
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
  const sealedBox = readJSON(SEALED);
  const lockedFiles = PAGES.map((P) => ({ file: lockedFile(P), box: readJSON(lockedFile(P)) })).filter((x) => x.box);
  for (const x of lockedFiles) x.data = await openBox(old.key, x.box);
  const sealedData = sealedBox && await openBox(old.key, sealedBox);
  const ring = await keyring(next, { fresh: true });
  for (const x of lockedFiles) fs.writeFileSync(x.file, JSON.stringify(await sealBox(ring, x.data, { quizzes: x.box.quizzes, past: x.box.past || [] })) + '\n');
  if (sealedData) fs.writeFileSync(SEALED, JSON.stringify(await sealBox(ring, sealedData)) + '\n');
  console.log('re-encrypted with the new password. Devices that chose "Remember" will ask for it once.');
  await buildSite('', { afterRekey: true });
}

const [cmd, arg] = process.argv.slice(2);
const COMMANDS = { site: () => buildSite(), artifact: () => buildArtifact(arg), open: openPrivate, seal: sealPrivate, rekey };
if (!COMMANDS[cmd]) fail('usage: node src/math/build.mjs site | artifact <out.html> | open | seal | rekey');
await COMMANDS[cmd]();
