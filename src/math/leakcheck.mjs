// Safety net for the public site: fails if a formula or sentence that exists only in the private in-class sheets or
// past midterms appears on a public Math page (the exam pages, math/<exam>/index.html, and the picker, math/index.html).
// Wording the public follow-ups share on purpose ("Compute the limits of the following") is not counted. Needs the
// private sources: run `node src/math/build.mjs open` first.
//   node src/math/leakcheck.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, '..', '..');
const inclass = path.join(SRC, 'private', 'inclass.mjs');
if (!fs.existsSync(inclass)) { console.error('error: src/math/private/inclass.mjs is missing; run `node src/math/build.mjs open` first.'); process.exit(1); }
const { quizzes } = await import(pathToFileURL(inclass).href);
const pastFile = path.join(SRC, 'private', 'past.mjs');
const past = fs.existsSync(pastFile) ? (await import(pathToFileURL(pastFile).href)).past : [];
// every private question, in-class or past paper
const privateQs = [...quizzes.flatMap((q) => q.qs), ...past.flatMap((p) => p.qs)];
const MATH = path.join(ROOT, 'math');
const exams = fs.readdirSync(MATH, { withFileTypes: true }).filter((d) => d.isDirectory() && fs.existsSync(path.join(MATH, d.name, 'index.html')))
  .map((d) => path.join('math', d.name, 'index.html'));
if (!exams.length) { console.error('error: found no exam pages (math/<exam>/index.html); update leakcheck.mjs to match the site'); process.exit(1); }
let pub = '', index = '';
for (const f of [path.join('math', 'index.html'), ...exams]) {
  const page = fs.readFileSync(path.join(ROOT, f), 'utf8');
  // tabs built on first open travel as text (<script id="lazy-…">): include them so they are checked too
  const lazy = [...page.matchAll(/<script type="text\/x-lazy-html" id="lazy-\w+">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (exams.includes(f) && !lazy.length) { console.error(`error: found no lazy tabs in ${f}; update leakcheck.mjs to match the page`); process.exit(1); }
  pub += page.replace(/<script type="application\/json" id="search-index">[\s\S]*?<\/script>/, '') + lazy.join('\n') + '\n';
  index += (page.match(/<script type="application\/json" id="search-index">([\s\S]*?)<\/script>/) || [, '[]'])[1];
}
const shared = ['content.mjs', 'followups.mjs', 'extras.mjs'].map((f) => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let leaks = 0, checked = 0;
for (const x of privateQs) {
  const src = [x.stem, ...x.parts, ...x.answer, x.sol].join('\n');
  const maths = [...src.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]*)\$/g)].map((m) => (m[1] || m[2]).trim()).filter((t) => t.length >= 10);
  const words = src.split(/\$\$[\s\S]*?\$\$|\$[^$]*\$/).map((s) => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').replace(/^[\s.,:;]+/, '').trim())
    .filter((s) => s.length >= 30);
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
const ids = (pub.match(/id="(rq\d+|p\d{4})-q\d+"/g) || []).length + (index.match(/"id":"(rq\d+|p\d{4})-q\d+"/g) || []).length;
console.log(`checked ${checked} private formulas and sentences (in-class sheets and ${past.length} past midterms) against ${exams.length + 1} pages: ${leaks} in public; private question ids: ${ids}`);
process.exit(leaks || ids ? 1 : 0);
