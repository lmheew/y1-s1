// Checks the answer boxes' reader (src/math/answers.js): how typing is read, which forms count as right, the near-miss
// hints, and every key of Calculus midterm 2's mocks against its own numbers (integrals worked out here by quadrature).
//   node src/math/answers_test.js
// The past papers' keys are checked in src/math/private/verify_keys.js (it needs the private folder open).
const A = require('./answers.js');

let fails = 0, count = 0;
const pass = (ok, what) => { count++; if (!ok) { fails++; console.log('FAIL  ' + what); } };

// ---------- quadrature (adaptive Simpson) ----------
function int(f, a, b, eps = 1e-12) {
  const c = (a + b) / 2, fa = f(a), fb = f(b), fc = f(c);
  return rec(f, a, b, fa, fb, fc, ((b - a) / 6) * (fa + 4 * fc + fb), eps, 48);
}
function rec(f, a, b, fa, fb, fc, S, eps, depth) {
  const c = (a + b) / 2, d = (a + c) / 2, e = (c + b) / 2, fd = f(d), fe = f(e);
  const L = ((c - a) / 6) * (fa + 4 * fd + fc), R = ((b - c) / 6) * (fc + 4 * fe + fb);
  if (depth <= 0 || Math.abs(L + R - S) <= 15 * eps) return L + R + (L + R - S) / 15;
  return rec(f, a, c, fa, fc, fd, L, eps / 2, depth - 1) + rec(f, c, b, fc, fb, fe, R, eps / 2, depth - 1);
}
const D = (f, t, h = 1e-5) => (f(t + h) - f(t - h)) / (2 * h);
const close = (u, k, tol = 1e-7) => Math.abs(u - k) <= tol * Math.max(1, Math.abs(k));
const { PI, E, sqrt, log, sin, cos, exp, atan } = Math;

// ---------- 1. reading ----------
// [typed, value expected at the point] with N = 3, n = 4, x = 0.7, θ = 0.4
const AT = { vars: { N: 3, n: 4, x: 0.7, θ: 0.4 }, fns: {} };
const KEYVARS = { vars: { N: 'real 1 9', n: 'int 0 7', x: 'real 0 1', θ: 'real 0 1' } };
const READS = [
  ['5/2N', 5 / 6], ['1/2 N', 1.5], ['3/5(e^pi-1)', (3 / 5) * (exp(PI) - 1)], ['2/3ln2', (2 / 3) * log(2)], ['2/3 ln 2', (2 / 3) * log(2)],
  ['π/3√3', PI / (3 * sqrt(3))], ['pi/(3sqrt3)', PI / (3 * sqrt(3))], ['pi/3sqrt3', PI / (3 * sqrt(3))], ['3/2√5', 3 / (2 * sqrt(5))], ['sqrt 2x', sqrt(1.4)], ['1/(2N)^2', 1 / 36], ['1/2N^2', 1 / 18],
  ['2+5/2N+1/2N^2', 2 + 5 / 6 + 1 / 18], ['2 + 5/(2N) + 1/(2N²)', 2 + 5 / 6 + 1 / 18],
  ['n!/2^(n+1)', 24 / 32], ['(-1)^n n!', 24], ['(-1)^nn!', 24], ['e^2x', E * E * 0.7], ['e^(2x)', exp(1.4)], ['e^-x', exp(-0.7)],
  ['sin^2 x', sin(0.7) ** 2], ['tan^-1 x', atan(0.7)], ['arctan x', atan(0.7)], ['atan(x)', atan(0.7)], ['sin x cos x', sin(0.7) * cos(0.7)],
  ['sinxcosx', sin(0.7) * cos(0.7)], ['sin 2x', sin(1.4)], ['ln x/x', log(0.7) / 0.7], ['ln(x)/x', log(0.7) / 0.7],
  ['sqrt3/5', sqrt(3) / 5], ['√3/5', sqrt(3) / 5], ['3sqrt5/2', 1.5 * sqrt(5)], ['3√5/2', 1.5 * sqrt(5)], ['8/ln3', 8 / log(3)], ['8/ln 3', 8 / log(3)],
  ['1/2 ln 5', log(5) / 2], ['1/2ln5', log(5) / 2], ['ln5/2', log(5) / 2], ['1/(2ln2)', 1 / (2 * log(2))], ['x²+1', 1.49], ['x^2+1', 1.49],
  ['（３／５）（ｅ＾π−1）', (3 / 5) * (exp(PI) - 1)], ['−3/2', -1.5], ['-3/2', -1.5], ['e^-pi', exp(-PI)], ['(1+e^-π)/2', (1 + exp(-PI)) / 2],
  ['|x-1|', 0.3], ['π(e^2+1)/4', (PI * (E * E + 1)) / 4], ['pi(e²+1)/4', (PI * (E * E + 1)) / 4], ['17pi/6', (17 * PI) / 6], ['3/8+ln2', 0.375 + log(2)],
  ['e^(2θ)cosθ', exp(0.8) * cos(0.4)], ['e^(2theta) cos(theta)', exp(0.8) * cos(0.4)], ['pi^2/32-1/4', (PI * PI) / 32 - 0.25],
  ['2·3', 6], ['2×3', 6], ['2 3', 6], ['In 3', log(3)], ['ln|x|', log(0.7)], ['x = 2N', 6], ['F = 1/2', 0.5], ['0 ≤ t ≤ 2', 2],
  ['sec x', 1 / cos(0.7)], ['cos^2 x - sin^2 x', cos(1.4)], ['2^(n+1)', 32], ['2^n+1', 17], ['e', E], ['pi', PI], ['PI/4', PI / 4],
];
for (const [t, want] of READS) {
  const r = A.read(t, KEYVARS);
  const got = r.tree ? A.evaluate(r.tree, AT) : NaN;
  pass(close(got, want, 1e-12), `reads “${t}” as ${want} (got ${r.err || got})`);
}
const BAD = [['2+', 'missing'], ['(2+3', 'bracket'], ['2+3)', ')'], ['sin', 'needs'], ['2#3', 'read'], ['', null], ['1,5', 'point'], ['|x', '|'], ['√', '√']];
for (const [t, part] of BAD) {
  const r = A.read(t, KEYVARS);
  pass(part === null ? r.empty === true : Boolean(r.err) && r.err.includes(part), `“${t}” isn't read (${r.err || (r.empty ? 'empty' : 'read')})`);
}
// letters: an answer that is a number has none; a key with one letter takes any one letter in its place
pass(/no x/.test(A.read('2x', {}).err || ''), 'a number answer refuses a letter');
pass(A.check('e^(2t) cos t', { v: 'e^(2θ)*cos(θ)', vars: { θ: 'real -1 1.5' } }).state === 'right', 't is read as θ');
pass(A.check('2+5/(2n)+1/(2n^2)', { v: '2+5/(2*N)+1/(2*N^2)', vars: { N: 'real 1 12' } }).state === 'right', 'n is read as N');
pass(/Use n/.test(A.check('a+b', { v: 'n', vars: { n: 'int 0 7' } }).msg || ''), 'two unknown letters are refused');
pass(/read as/.test(A.render('t^2', { v: 'θ^2', vars: { θ: 'real 0 1' } }).html), 'the preview says when a letter is read as another');
pass(A.render('5/2N', KEYVARS).html.includes('class="fr"'), 'the preview stacks a fraction');

// ---------- 2. what counts as right ----------
const RIGHT = [
  [{ v: '2/3*ln(2)' }, ['2/3 ln 2', '(2/3)ln2', '2ln2/3', '1/3 ln 4', 'ln4/3', '(1/3)ln(4)', 'ln(4)/3', '2/3*ln(2)', 'ln(2^(2/3))', '0.666666666666666666666667 ln 2']],
  [{ v: 'pi/(3*sqrt(3))' }, ['π/(3√3)', 'pi/3sqrt3', 'π√3/9', 'sqrt(3)pi/9', '√3π/9', 'pi/sqrt27', 'π/√(27)']],
  [{ v: '(2*e^pi+1)/5' }, ['(2e^π+1)/5', '2/5 e^pi + 1/5', '0.4e^π+0.2', '(1+2e^pi)/5']],
  [{ v: '1/2' }, ['1/2', '0.5', '.5', '2/4', 'F(0) = 1/2']],
  [{ v: '-1' }, ['-1', '−1', 'L(1) = -1']],
  [{ v: '3*sqrt(5)/2' }, ['3√5/2', '3/2 √5', '(3/2)sqrt5', 'sqrt(45)/2', '√(45/4)', '3sqrt5/2']],
  [{ v: '2+5/(2*N)+1/(2*N^2)', vars: { N: 'real 1 12' } }, ['2+5/2N+1/2N^2', '(4N^2+5N+1)/(2N^2)', '(N+1)(4N+1)/(2N^2)', 'S_N = 2 + 5/(2N) + 1/(2N²)']],
  [{ v: 'n/2*F(n-1)', vars: { n: 'int 1 7' }, fns: ['F'] }, ['n/2 F(n-1)', 'nF(n-1)/2', 'F(n) = n/2·F(n−1)', '(n/2)F(n-1)', '0.5nF(n-1)']],
  [{ v: '-n*L(n-1)', vars: { n: 'int 1 7' }, fns: ['L'] }, ['-nL(n-1)', '−n L(n−1)', 'L(n) = -n*L(n-1)', '(-n)L(n-1)']],
  [{ v: 'n!/2^(n+1)', vars: { n: 'int 0 7' } }, ['n!/2^(n+1)', 'n!/(2·2^n)', 'n! 2^(-n-1)', 'n!/2^n/2', '(1/2)^(n+1) n!']],
  [{ v: '(-1)^n*n!', vars: { n: 'int 0 7' } }, ['(-1)^n n!', '(−1)ⁿn!', '(-1)^n*n!']],
  [{ v: 's*Γ(s)', vars: { s: 'real 0.5 4' }, fns: ['Γ'] }, ['sΓ(s)', 's Gamma(s)', 'Γ(s+1) = sΓ(s)', 's*gamma(s)']],
  [{ v: '(n-1)!', vars: { n: 'int 1 8' } }, ['(n-1)!', 'Γ(n) = (n−1)!', '(n - 1)!']],
  [{ v: 'diverges' }, ['diverges', 'it diverges', 'Diverges.', 'divergent', 'does not converge', 'DNE', '∞', 'infinity', 'inf']],
  [{ v: 'e^(2*θ)*sin(θ)', vars: { θ: 'real -1 1.5' } }, ['e^(2θ)sinθ', 'e^(2theta) sin theta', 'y = e^{2θ} sin(θ)', 'sinθ e^(2θ)']],
  [{ v: 'x^3/3+C', vars: { x: 'real -2 2' }, pc: true }, ['x^3/3', 'x³/3 + C', '(x^3+1)/3']],
];
for (const [key, forms] of RIGHT) for (const t of forms) {
  const r = A.check(t, key);
  pass(r.state === 'right', `“${t}” is right for ${key.v} (${r.state}${r.msg ? ': ' + r.msg : ''}${r.hint ? ': ' + r.hint : ''})`);
}
const WRONG = [
  [{ v: '2+5/(2*N)+1/(2*N^2)', vars: { N: 'real 1 12' } }, '2 + 5/2N + 1/(2N)^2', ''], // the example from the request: 1/(4N²)
  [{ v: '2/3*ln(2)' }, '-2/3 ln 2', 'sign'], [{ v: '2/3*ln(2)' }, '4/3 ln 2', 'factor of 2'], [{ v: '2/3*ln(2)' }, '1/3 ln 2', 'factor of 2'],
  [{ v: 'pi*log(4/3)' }, 'ln(4/3)', 'π'], [{ v: 'pi/12' }, '0.2618', 'exact'], [{ v: '4' }, 'diverges', 'converges'],
  [{ v: 'diverges' }, '2', 'converges'], [{ v: 'n/2*F(n-1)', vars: { n: 'int 1 7' }, fns: ['F'] }, 'n/2 F(n)', ''],
  [{ v: 'n/2*F(n-1)', vars: { n: 'int 1 7' }, fns: ['F'] }, 'n!/2^(n+1)', ''], [{ v: 'n!/2^(n+1)', vars: { n: 'int 0 7' } }, 'n!/2^n+1', ''],
  [{ v: 'e^(2*θ)*cos(θ)', vars: { θ: 'real -1 1.5' } }, 'e^(2θ)sinθ', ''], [{ v: '(n-1)!', vars: { n: 'int 1 8' } }, 'n!', ''],
  [{ v: '2+5/(2*N)+1/(2*N^2)', vars: { N: 'real 1 12' } }, '4+10/(2N)+2/(2N^2)', 'factor of 2'],
  [{ v: '(2*e^pi+1)/5' }, '(2e^π-1)/5', ''], [{ v: 'x^3/3+C', vars: { x: 'real -2 2' }, pc: true }, 'x^3', ''],
  [{ v: '1/3' }, '0.333333333', 'exact'],
  [{ v: '3*sqrt(5)/2' }, '3/2√5', ''], // read as 3/(2√5), as π/3√3 is π/(3√3): the preview shows it
];
for (const [key, t, hint] of WRONG) {
  const r = A.check(t, key);
  pass(r.state === 'wrong' && (hint ? (r.hint || '').includes(hint) : true), `“${t}” is wrong for ${key.v}${hint ? ` with a hint about ${hint}` : ''} (${r.state}: ${r.hint || r.msg || ''})`);
}
pass(A.check('', { v: '1' }).state === 'empty', 'an empty box is empty');
pass(A.check('2+', { v: '1' }).state === 'unread', 'an unreadable box says so');

// ---------- 3. every key of the mocks, against its own numbers ----------
const F = (n) => int((x) => x ** n * exp(-2 * x), 0, 40); // Mock 1: F(n) = ∫₀^∞ xⁿe^(−2x) dx
const L = (n) => int((u) => (-u) ** n * exp(-u), 0, 60); // Mock 2: L(n) = ∫₀¹ (ln x)ⁿ dx, with x = e^(−u)
const K = (n) => int((u) => u ** n * exp(-u), 0, 60); // Mock 3: K(n) = ∫₁^∞ (ln x)ⁿ/x² dx, with x = e^u
const len = (x, y, a, b) => int((t) => Math.hypot(D(x, t), D(y, t)), a, b, 1e-11);
const under = (x, y, a, b) => int((t) => y(t) * D(x, t), a, b, 1e-11); // ∫ y dx along the curve
const N_ = [0, 1, 2, 3, 4, 5, 6].map((n) => ({ vars: { n }, fns: {} }));
const N1 = [1, 2, 3, 4, 5, 6].map((n) => ({ vars: { n }, fns: {} }));
const fn = (want, envs) => ({ want, envs });
const REF = {
  im5: [
    [() => int((x) => x * x - 6 * x + 5, 0, 3), () => int((x) => cos(2 * x), 0, PI / 4), () => int((x) => 3 ** x, 0, 2), () => int((x) => 1 / (3 * x + 1), 0, 1)],
    [() => int((x) => 1 / (x * x - 2 * x + 10), 1, 4), () => int((x) => (x - 4) / (x + 2 * sqrt(x)), 1, 16)],
    [() => int((x) => x * x * cos(x), 0, PI), () => int((x) => exp(2 * x) * sin(x), 0, PI / 2)],
    [() => PI * int((x) => x * exp(2 * x), 0, 1)],
    [() => len((t) => t + sin(t) * cos(t), (t) => sin(t) ** 2, 0, PI), () => under((t) => t + sin(t) * cos(t), (t) => sin(t) ** 2, 0, PI)],
    [() => F(0), fn((e) => F(e.vars.n), N1.map((e) => ({ vars: e.vars, fns: { F } }))), fn((e) => F(e.vars.n), N_)],
  ],
  im6: [
    [() => int((x) => 2 * x ** 3 - 3 * x * x, -1, 2), () => int((x) => sin(x / 2), 0, PI), () => int((x) => 4 ** x, 0, 0.5), () => int((x) => 2 / (4 * x - 1), 1, 4)],
    [() => int((x) => 1 / (x * x + 4 * x + 8), -2, 0), () => int((x) => 1 / (x + sqrt(x)), 1, 4)],
    [() => int((x) => x * log(x) ** 2, 1, E), () => int((x) => exp(x) * sin(x) * cos(x), 0, PI)],
    [() => PI * int((x) => 1 / (x * x + x), 1, 2)],
    [() => len((t) => cos(t) ** 3, (t) => sin(t) ** 3, 0, PI / 2), () => -under((t) => cos(t) ** 3, (t) => sin(t) ** 3, 0, PI / 2)],
    [() => L(1), fn((e) => L(e.vars.n), N1.map((e) => ({ vars: e.vars, fns: { L } }))), fn((e) => L(e.vars.n), N_)],
  ],
  im7: [
    [() => int((x) => 4 * x ** 3 - 6 * x + 2, -1, 1), () => int((x) => sin(PI * x), 0, 1), () => int((x) => 5 ** x, 0, 1), () => int((x) => 1 / (2 * x + 3), -1, 3)],
    [() => int((x) => 1 / (x * x + x + 1), 0, 1), () => int((u) => (u / (1 + u)) * 2 * u, 0, 1)], // x = u²
    [() => int((x) => x * x * cos(2 * x), 0, PI / 4), () => int((x) => exp(-x) * sin(x), 0, PI)],
    [() => PI * int((x) => x / (x * x + 1) ** 2, 0, 1)],
    [() => len((t) => 2 * t * t, (t) => t - (4 / 3) * t ** 3, 0, sqrt(3) / 2), () => under((t) => 2 * t * t, (t) => t - (4 / 3) * t ** 3, 0, sqrt(3) / 2)],
    [() => K(0), fn((e) => K(e.vars.n), N1.map((e) => ({ vars: e.vars, fns: { K } }))), fn((e) => K(e.vars.n), N_)],
  ],
  im4: [
    [[fn((e) => { const n = e.vars.N; let s = 0; for (let k = 1; k <= n; k++) s += (3 * (k / n) ** 2 + 2 * (k / n)) / n; return s; },
      [1, 2, 3, 5, 8, 13].map((N) => ({ vars: { N }, fns: {} }))), () => int((x) => 3 * x * x + 2 * x, 0, 1)],
    () => int((x) => exp(2 * x), 0, log(2)), () => int((x) => Math.abs(x * x - 2 * x), 0, 3, 1e-11)],
    [() => int((x) => (x * x) / (x ** 3 + 1), 0, 1), () => int((x) => sin(x) / cos(x) ** 3, 0, PI / 4), () => int((x) => 1 / (x * x - 1), 2, 3), () => int((x) => 1 / (x * x - 2 * x + 5), 1, 3)],
    [() => int((x) => x * atan(x), 0, 1), () => int((x) => 1 / (2 + cos(x)), 0, PI / 2)],
    [() => PI * int((x) => (1 + sqrt(x)) ** 2, 0, 1), () => int((x) => Math.hypot(1, x / 4 - 1 / x), 1, 2), () => int((x) => sin(4 * x) * sin(x), 0, PI)],
    [[fn((e) => exp(2 * e.vars.θ) * cos(e.vars.θ), [-0.5, 0.1, 0.7, 1.3].map((θ) => ({ vars: { θ }, fns: {} }))),
      fn((e) => exp(2 * e.vars.θ) * sin(e.vars.θ), [-0.5, 0.1, 0.7, 1.3].map((θ) => ({ vars: { θ }, fns: {} })))],
    () => int((th) => Math.hypot(exp(2 * th), 2 * exp(2 * th)), 0, log(2)),
    // y = 4t − t³ ≥ 0 for t ≥ 0 up to its root, and x = t² there
    [() => bisect((t) => 4 * t - t ** 3, 1, 3), () => bisect((t) => 4 * t - t ** 3, 1, 3) ** 2],
    () => under((t) => t * t, (t) => 4 * t - t ** 3, 0, 2)],
    [() => (exp(2e-7) - 1) / sin(1e-7), () => int((u) => 2, 0, 2), () => 'diverges'], // ∫₀⁴ dx/√(4 − x) with x = 4 − u²
  ],
};
function bisect(f, a, b) { for (let i = 0; i < 200; i++) { const c = (a + b) / 2; if (f(a) * f(c) <= 0) b = c; else a = c; } return (a + b) / 2; }
// the ∫₁^w ln x/x dx of Mock 4's Q.6 (3) passes every bound: (ln w)²/2
pass(int((x) => log(x) / x, 1, exp(12), 1e-9) > 70, 'Mock 4 Q.6 (3) grows past any bound');

const boxes = (c) => (c == null ? [] : (Array.isArray(c) ? c : [c]).map((b) => (typeof b === 'string' ? { v: b } : b)));
(async () => {
  const { mocks } = await import('./integrals/exams.mjs');
  for (const m of mocks) {
    const ref = REF[m.id];
    pass(Boolean(ref), `${m.id} has reference numbers here`);
    if (!ref) continue;
    m.qs.forEach((q, qi) => {
      pass(Array.isArray(q.check) && q.check.length === q.parts.length, `${m.id} ${q.label} has a key for each part`);
      (q.check || []).forEach((c, pi) => {
        const bs = boxes(c);
        const rs = Array.isArray(ref[qi][pi]) ? ref[qi][pi] : [ref[qi][pi]];
        pass(bs.length === rs.length, `${m.id} ${q.label} (${pi + 1}): ${bs.length} boxes, ${rs.length} references`);
        bs.forEach((key, bi) => {
          const what = `${m.id} ${q.label} (${pi + 1})${bs.length > 1 ? '.' + (bi + 1) : ''} key ${key.v}`;
          const r = rs[bi];
          if (key.v === 'diverges') { pass(r && r() === 'diverges', what + ' diverges'); return; }
          const tree = A.read(key.v, key).tree;
          if (!tree) { pass(false, what + ' reads'); return; }
          pass(Boolean(A.render(key.v, key).html), what + ' has a preview');
          if (typeof r === 'function') {
            const got = A.evaluate(tree, { vars: {}, fns: {} }), want = r();
            pass(close(got, want, 2e-7), `${what} = ${got}, by quadrature ${want}`);
            pass(A.check(String(want.toPrecision(17)), key).state !== 'unread', what + ': a decimal is read');
            return;
          }
          for (const env of r.envs) {
            const got = A.evaluate(tree, env), want = r.want(env);
            pass(close(got, want, 2e-7), `${what} at ${JSON.stringify(env.vars)} = ${got}, by quadrature ${want}`);
          }
          pass(A.check(key.v, key).state === 'right', what + ' is right for itself');
        });
      });
    });
  }
  console.log(`${count - fails}/${count} passed`);
  if (fails) process.exit(1);
})();
