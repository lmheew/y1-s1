// Checks every cell of the exact-values table exactly as it will be rendered.
import { exactValues } from './extras.mjs';

const atom = (a) => {
  a = a.trim();
  let m;
  if (a === '\\pi') return Math.PI;
  if ((m = a.match(/^(\d+)\\pi$/))) return Number(m[1]) * Math.PI;
  if ((m = a.match(/^\\sqrt\{(\d+)\}$/))) return Math.sqrt(Number(m[1]));
  if (/^\d+$/.test(a)) return Number(a);
  throw new Error('cannot evaluate ' + a);
};
const ev = (t) => {
  t = t.trim();
  let sign = 1;
  if (t.startsWith('-')) { sign = -1; t = t.slice(1).trim(); }
  const m = t.match(/^\\frac\{(.+?)\}\{(.+)\}$/);
  return sign * (m ? atom(m[1]) / atom(m[2]) : atom(t));
};
const fns = { '\\cos x': Math.cos, '\\sin x': Math.sin, '\\tan x': Math.tan };
let fails = 0, passes = 0;
exactValues.angles.forEach(([t, deg], i) => {
  const x = ev(t);
  if (Math.abs(x * 180 / Math.PI - parseFloat(deg)) > 1e-9) { fails++; console.log('FAIL degree label', t, deg); } else passes++;
  for (const [name, vals] of exactValues.rows) {
    const v = vals[i];
    if (v === null) {
      const ok = name === '\\tan x' && Math.abs(Math.cos(x)) < 1e-12;
      ok ? passes++ : (fails++, console.log('FAIL undefined cell', name, t));
      continue;
    }
    const want = fns[name](x), got = ev(v);
    if (Math.abs(want - got) < 1e-12) passes++; else { fails++; console.log('FAIL', name, t, 'table', got, 'true', want); }
  }
});
console.log(fails ? `FAILED ${fails}` : `ALL EXACT-VALUE CHECKS PASSED (${passes})`);
process.exit(fails ? 1 : 0);
