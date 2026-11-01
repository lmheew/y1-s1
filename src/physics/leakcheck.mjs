// Safety net for the public site, like src/math/leakcheck.mjs: fails if a formula, sentence, figure or problem id that
// exists only in the private exercise-day sheets appears on a public Physics page (physics/index.html and the exam
// pages, physics/<exam>/index.html, with their lazy tabs and search index). Wording the public practice sets share on
// purpose is not counted. Needs the private sources: run `node src/physics/build.mjs open` first.
//   node src/physics/leakcheck.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { FIGS } from './figures.mjs';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, '..', '..');
const file = path.join(SRC, 'private', 'exercises.mjs');
if (!fs.existsSync(file)) { console.error('error: src/physics/private/exercises.mjs is missing; run `node src/physics/build.mjs open` first.'); process.exit(1); }
const { exercises } = await import(pathToFileURL(file).href);
const PHYS = path.join(ROOT, 'physics');
const exams = fs.readdirSync(PHYS, { withFileTypes: true }).filter((d) => d.isDirectory() && fs.existsSync(path.join(PHYS, d.name, 'index.html')))
  .map((d) => path.join('physics', d.name, 'index.html'));
if (!exams.length) { console.error('error: found no exam pages (physics/<exam>/index.html); update leakcheck.mjs to match the site'); process.exit(1); }
let pub = '', index = '';
for (const f of [path.join('physics', 'index.html'), ...exams]) {
  const page = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const lazy = [...page.matchAll(/<script type="text\/x-lazy-html" id="lazy-\w+">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (exams.includes(f) && !lazy.length) { console.error(`error: found no lazy tabs in ${f}; update leakcheck.mjs to match the page`); process.exit(1); }
  pub += page.replace(/<script type="application\/json" id="search-index">[\s\S]*?<\/script>/, '') + lazy.join('\n') + '\n';
  index += (page.match(/<script type="application\/json" id="search-index">([\s\S]*?)<\/script>/) || [, '[]'])[1];
}
const shared = ['quizzes.mjs', 'content.mjs', 'build.mjs'].map((f) => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let leaks = 0, checked = 0;
const probs = exercises.flatMap((x) => x.problems);
const figIds = new Set();
for (const p of probs) {
  const src = [p.stem || '', ...p.parts, ...p.answer, p.sol].join('\n');
  for (const id of [].concat(p.fig || [], [...src.matchAll(/\[\[fig:([\w-]+)\]\]/g)].map((m) => m[1]))) figIds.add(id);
  const maths = [...src.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]*)\$/g)].map((m) => (m[1] || m[2]).trim()).filter((t) => t.length >= 10);
  // the text between formulas, sentence by sentence, so a copy of part of a problem is caught too
  const words = src.replace(/\[\[fig:[\w-]+\]\]/g, '').split(/\$\$[\s\S]*?\$\$|\$[^$]*\$/)
    .flatMap((s) => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').split(/(?<=[.?!])\s+/))
    .map((s) => s.replace(/^[\s.,:;]+/, '').trim()).filter((s) => s.length >= 30);
  for (const t of maths) {
    if (shared.includes(t)) continue;
    checked++;
    if (pub.includes('encoding="application/x-tex">' + esc(t))) { leaks++; console.log('formula in the public page:', t); }
  }
  for (const t of words) {
    if (shared.includes(t)) continue;
    checked++;
    if (pub.includes(esc(t))) { leaks++; console.log('text in the public page:', t); }
  }
}
// the sheets' figures: their drawings may only travel in the locked file
for (const id of figIds) {
  checked++;
  if (FIGS[id] && pub.includes(FIGS[id].svg)) { leaks++; console.log('figure in the public page:', id); }
}
const ids = (pub.match(/id="ex\d+-p[\w-]+"/g) || []).length + (index.match(/"id":"ex\d+-p[\w-]+"/g) || []).length;
console.log(`checked ${checked} private formulas, sentences and figures (${exercises.length} exercise days) against ${exams.length + 1} pages: ${leaks} in public; private problem ids: ${ids}`);
process.exit(leaks || ids ? 1 : 0);
