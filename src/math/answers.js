// Typed answers (the answer boxes of the mocks and past papers): read a typed formula, show how it was read, and check
// it against the part's key by numbers, so any equivalent exact form counts. page.js puts the boxes to work, and
// build.mjs writes each box's key into data-key. Tested in src/math/answers_test.mjs.
//   A key: { v: the answer in this same notation, or 'diverges'; vars: { n: 'int 0 7', N: 'real 1 12' }, the letters it
//   uses and the values to try; fns: ['F'], functions it leaves unknown, as in a relation F(n) = n F(n − 1); pc: true
//   for a primitive, which may differ by a constant }.
// How typing is read: a product written without a space binds first after "/", so 5/2N is 5/(2N) and π/3√3 is
// π/(3√3), while a space, a bracket or a function ends the bottom: 1/2 N, 3/5(e^π − 1) and 2/3 ln 2 are (1/2)N,
// (3/5)(e^π − 1) and (2/3) ln 2. A function takes what follows it without a space: sin 2x is sin(2x), sin x cos x is
// sin(x) cos(x), ln 3/2 is ln(3)/2. Only what comes after the last "=" counts, so F(n) = … can be typed whole.
(function () {
  'use strict';

  // ---------- characters ----------
  const SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+', 'ⁿ': 'n', 'ˣ': 'x' };
  function normalize(s) {
    return String(s)
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿˣ]+/g, (m) => '^(' + Array.from(m, (c) => SUP[c]).join('') + ')')
      .normalize('NFKC') // full-width letters, digits and signs from a Japanese keyboard
      .replace(/[−–—‒﹣ー]/g, '-')
      .replace(/[×·•∙⋅✕・]/g, '*')
      .replace(/÷/g, '/')
      .replace(/[[{]/g, '(').replace(/[\]}]/g, ')')
      .replace(/\s+/g, ' ')
      .replace(/[\s.,;。、]+$/, '')
      .trim();
  }

  // ---------- names ----------
  const FN = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    sec: (x) => 1 / Math.cos(x), csc: (x) => 1 / Math.sin(x), cot: (x) => 1 / Math.tan(x),
    arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    ln: Math.log, log: Math.log, exp: Math.exp, sqrt: Math.sqrt, abs: Math.abs,
  };
  // what a run of letters may hold (longest first): functions, their other names, constants and words
  const WORDS = {
    divergent: 'div', infinity: 'inf', diverges: 'div', diverge: 'div', arcsin: 'arcsin', arccos: 'arccos', arctan: 'arctan',
    theta: 'θ', gamma: 'Γ', sqrt: 'sqrt', sinh: 'sinh', cosh: 'cosh', tanh: 'tanh', asin: 'arcsin', acos: 'arccos', atan: 'arctan',
    sin: 'sin', cos: 'cos', tan: 'tan', sec: 'sec', csc: 'csc', cot: 'cot', exp: 'exp', abs: 'abs', log: 'log', dne: 'div',
    div: 'div', inf: 'inf', ln: 'ln', pi: 'pi',
  };
  const WORD_LIST = Object.keys(WORDS).sort((a, b) => b.length - a.length);

  const fail = (msg) => { const e = new Error(msg); e.answer = true; throw e; };

  // ---------- tokens: { t, v, sp } where sp says a space came before ----------
  function tokenize(text, key) {
    const fns = (key && key.fns) || [];
    const toks = [];
    let i = 0, sp = false;
    const push = (t, v, extra) => { toks.push(Object.assign({ t, v, sp }, extra)); sp = false; };
    while (i < text.length) {
      const c = text[i];
      if (c === ' ') { sp = true; i++; continue; }
      const num = /^(\d+\.?\d*|\.\d+)/.exec(text.slice(i));
      if (num) { push('num', Number(num[1]), { s: num[1] }); i += num[1].length; continue; }
      if (c === '(') { push('lp', c); i++; continue; }
      if (c === ')') { push('rp', c); i++; continue; }
      if (c === '|') { push('bar', c); i++; continue; }
      if ('+-*/^!'.includes(c)) { push('op', c); i++; continue; }
      if (c === '√') { push('sqrt', 'sqrt'); i++; continue; }
      if (c === 'π') { push('const', 'pi'); i++; continue; }
      if (c === '∞') { push('const', 'inf'); i++; continue; }
      if (c === ',') fail('Use a point for decimals, not a comma.');
      if (/[A-Za-zα-ωΑ-Ω]/.test(c)) {
        let j = i;
        while (j < text.length && /[A-Za-zα-ωΑ-Ω]/.test(text[j])) j++;
        letters(text.slice(i, j), fns, push);
        i = j;
        continue;
      }
      fail(`Can't read “${c}”.`);
    }
    return toks;
  }
  // split a run of letters into names and single letters: sinx is sin x, xe is x e, pin is π n
  function letters(run, fns, push) {
    let i = 0;
    while (i < run.length) {
      const rest = run.slice(i);
      if (rest.startsWith('In') && !/^Inf/i.test(rest)) { push('fn', 'ln'); i += 2; continue; } // ln typed with a capital I
      const low = rest.toLowerCase();
      const w = WORD_LIST.find((x) => low.startsWith(x));
      if (w) {
        const v = WORDS[w];
        if (v === 'div') push('word', 'diverges');
        else if (v === 'inf' || v === 'pi') push('const', v);
        else if (v === 'θ') push('var', 'θ');
        else if (v === 'Γ') { if (!fns.includes('Γ')) fail('There is no Γ in this answer.'); push('ufn', 'Γ'); }
        else if (v === 'sqrt') push('sqrt', 'sqrt', { word: true }); // sqrt 3 works like √3, and 3sqrt3 like 3√3
        else push('fn', v);
        i += w.length;
        continue;
      }
      const c = run[i];
      const f = fns.find((x) => x.toUpperCase() === c.toUpperCase());
      if (c === 'Γ') { if (!fns.includes('Γ')) fail('There is no Γ in this answer.'); push('ufn', 'Γ'); }
      else if (f) push('ufn', f);
      else if (c === 'e') push('const', 'e');
      else push('var', c);
      i++;
    }
  }

  // ---------- reading: a tree of { k, … } ----------
  function parse(text, key) {
    const toks = tokenize(text, key);
    if (!toks.length) fail('Nothing to read.');
    if (toks.length === 1 && toks[0].t === 'word') return { k: 'word', v: 'diverges' };
    if (toks.some((t) => t.t === 'word')) fail('Type just “diverges”, or a value.');
    let i = 0, absDepth = 0;
    const peek = () => toks[i];
    const next = () => toks[i++];
    const isOp = (t, v) => Boolean(t) && t.t === 'op' && t.v === v;
    const atomStart = (t) => Boolean(t) && (t.t === 'num' || t.t === 'const' || t.t === 'var' || t.t === 'fn' || t.t === 'ufn'
      || t.t === 'sqrt' || t.t === 'lp' || (t.t === 'bar' && absDepth === 0));
    const closeParen = () => { if (!peek() || peek().t !== 'rp') fail('A bracket isn\'t closed.'); next(); };

    function sum() {
      let n = prod();
      while (isOp(peek(), '+') || isOp(peek(), '-')) {
        const o = next().v;
        n = { k: o === '+' ? 'add' : 'sub', a: n, b: prod() };
      }
      return n;
    }
    function prod() {
      let n = unary(false);
      for (;;) {
        const t = peek();
        if (isOp(t, '*')) { next(); n = { k: 'mul', a: n, b: unary(false), how: 'dot' }; }
        else if (isOp(t, '/')) { next(); n = { k: 'div', a: n, b: unary(true) }; }
        else if (atomStart(t)) n = { k: 'mul', a: n, b: unary(false), how: t.sp ? 'sp' : 'tight' };
        else break;
      }
      return n;
    }
    // bottom: after "/", the product without spaces of numbers, constants, letters and roots (5/2N, π/3√3)
    function unary(bottom) {
      if (isOp(peek(), '-')) { next(); return { k: 'neg', a: unary(bottom) }; }
      if (isOp(peek(), '+')) { next(); return unary(bottom); }
      let n = power();
      const more = (t) => atomStart(t) && !t.sp && (!bottom || t.t === 'num' || t.t === 'const' || t.t === 'var' || t.t === 'sqrt');
      while (more(peek())) n = { k: 'mul', a: n, b: power(), how: 'tight' };
      return n;
    }
    function power() {
      const b = postfix();
      if (isOp(peek(), '^')) { next(); return { k: 'pow', a: b, b: expo() }; }
      return b;
    }
    function expo() {
      if (isOp(peek(), '-')) { next(); return { k: 'neg', a: expo() }; }
      if (isOp(peek(), '+')) { next(); return expo(); }
      if (!atomStart(peek())) fail('Something is missing after ^.');
      const p = postfix();
      if (isOp(peek(), '^')) { next(); return { k: 'pow', a: p, b: expo() }; }
      return p;
    }
    function postfix() {
      let n = atom();
      while (isOp(peek(), '!')) { next(); n = { k: 'fact', a: n }; }
      return n;
    }
    function atom() {
      const t = next();
      if (!t) fail('Something is missing at the end.');
      switch (t.t) {
        case 'num': return { k: 'num', v: t.v, s: t.s };
        case 'const': return { k: 'const', v: t.v };
        case 'var': return { k: 'var', v: t.v };
        case 'lp': { if (peek() && peek().t === 'rp') fail('There is an empty bracket.'); const n = sum(); closeParen(); return { k: 'paren', a: n }; }
        case 'bar': {
          if (absDepth > 0) fail('Something is missing before |.');
          absDepth++;
          const n = sum();
          absDepth--;
          if (!peek() || peek().t !== 'bar') fail('An absolute value | isn\'t closed.');
          next();
          return { k: 'abs', a: n };
        }
        case 'sqrt': {
          if (!atomStart(peek())) fail('√ needs something under it.');
          if (t.word) return call('sqrt'); // sqrt 2x is √(2x), as sin 2x is sin(2x)
          return { k: 'fn', f: 'sqrt', a: peek().t === 'lp' ? atom() : power() };
        }
        case 'fn': return call(t.v);
        case 'ufn': {
          if (!peek() || peek().t !== 'lp') fail(`Write ${t.v}( … ) with its bracket.`);
          next();
          const n = sum();
          closeParen();
          return { k: 'ufn', f: t.v, a: n };
        }
        case 'rp': return fail('There is a ) without its (.');
        default: return fail(`Something is missing before ${t.v === '*' ? '×' : t.v}.`);
      }
      return null;
    }
    function call(f) {
      let p = null;
      if (isOp(peek(), '^')) { next(); p = expo(); } // sin^2 x, tan^-1 x
      let a;
      if (peek() && peek().t === 'lp') a = atom();
      else {
        if (!atomStart(peek()) && !isOp(peek(), '-')) fail(`${f} needs something after it.`);
        a = arg();
      }
      if (p && p.k === 'neg' && p.a.k === 'num' && p.a.v === 1 && /^(sin|cos|tan)$/.test(f)) { f = 'arc' + f; p = null; }
      const n = { k: 'fn', f, a };
      return p ? { k: 'pow', a: n, b: p } : n;
    }
    // what a function takes without a bracket: the product that follows without a space, up to another function
    function arg() {
      if (isOp(peek(), '-')) { next(); return { k: 'neg', a: arg() }; }
      let n = power();
      while (atomStart(peek()) && !peek().sp && peek().t !== 'fn' && peek().t !== 'lp') n = { k: 'mul', a: n, b: power(), how: 'tight' };
      return n;
    }

    const tree = sum();
    if (i < toks.length) {
      const t = peek();
      if (t.t === 'rp') fail('There is a ) without its (.');
      fail(`Can't read what comes after ${t.t === 'op' ? '“' + t.v + '”' : 'that'}.`);
    }
    return tree;
  }

  // the letters an answer uses; a key with one letter takes any one letter in its place (t for θ, x for N)
  function lettersOf(n, out = new Set()) {
    if (!n || typeof n !== 'object') return out;
    if (n.k === 'var') out.add(n.v);
    ['a', 'b'].forEach((p) => lettersOf(n[p], out));
    return out;
  }
  function rename(n, from, to) {
    if (!n || typeof n !== 'object') return n;
    if (n.k === 'var' && n.v === from) return Object.assign({}, n, { v: to, was: from });
    const m = Object.assign({}, n);
    if (n.a) m.a = rename(n.a, from, to);
    if (n.b) m.b = rename(n.b, from, to);
    return m;
  }
  // read a typed answer for a key: { tree } or { err }; only what follows the last "=" (or ≤) counts
  function read(text, key) {
    key = key || {};
    const s = normalize(String(text).split(/[=≤≥<>]/).pop());
    if (!s) return { empty: true };
    // "diverges", "it diverges", "divergent", "does not converge", "DNE"
    if (/(^|[^a-z])(diverg[a-z]*|dne)([^a-z]|$)|not converge|n't converge/i.test(s)) return { tree: { k: 'word', v: 'diverges' } };
    try {
      let tree = parse(s, key);
      const vars = Object.keys(key.vars || {});
      const used = Array.from(lettersOf(tree)).filter((v) => !vars.includes(v) && !(key.pc && v === 'C'));
      if (used.length) {
        if (vars.length === 1 && used.length === 1) tree = rename(tree, used[0], vars[0]);
        else if (vars.length) fail(`Use ${vars.join(' and ')}, not ${used.join(', ')}.`);
        else fail(`The answer is a number: there is no ${used[0]} in it.`);
      }
      return { tree };
    } catch (e) {
      if (!e.answer) throw e;
      return { err: e.message };
    }
  }

  // ---------- numbers ----------
  const LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function gamma(x) {
    if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
    x -= 1;
    let a = LANCZOS[0];
    const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += LANCZOS[i] / (x + i);
    return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
  }
  function factorial(x) {
    if (Number.isInteger(x)) {
      if (x < 0) return NaN;
      let f = 1;
      for (let i = 2; i <= x; i++) f *= i;
      return f;
    }
    return gamma(x + 1);
  }
  function evaluate(n, env) {
    const ev = (m) => evaluate(m, env);
    switch (n.k) {
      case 'num': return n.v;
      case 'const': return n.v === 'pi' ? Math.PI : n.v === 'e' ? Math.E : Infinity;
      case 'var': return n.v === 'C' && !(n.v in env.vars) ? 0 : env.vars[n.v];
      case 'paren': return ev(n.a);
      case 'add': return ev(n.a) + ev(n.b);
      case 'sub': return ev(n.a) - ev(n.b);
      case 'mul': return ev(n.a) * ev(n.b);
      case 'div': return ev(n.a) / ev(n.b);
      case 'neg': return -ev(n.a);
      case 'pow': return Math.pow(ev(n.a), ev(n.b));
      case 'fact': return factorial(ev(n.a));
      case 'abs': return Math.abs(ev(n.a));
      case 'fn': return FN[n.f](ev(n.a));
      case 'ufn': return env.fns[n.f](ev(n.a));
      case 'word': return Infinity;
      default: return NaN;
    }
  }
  // the same random values every time for the same key
  function rng(seedText) {
    let h = 1779033703;
    for (const c of String(seedText)) h = Math.imul(h ^ c.charCodeAt(0), 3432918353), h = (h << 13) | (h >>> 19);
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  }
  // the values to try: 'int 0 7' (whole numbers) or 'real 1 12'
  function sampler(spec, rand) {
    const [kind, lo, hi] = String(spec || 'real 0.3 2.7').split(/\s+/);
    const a = Number(lo), b = Number(hi);
    if (kind === 'int') return () => a + Math.floor(rand() * (b - a + 1));
    return () => a + rand() * (b - a);
  }
  function points(key, count) {
    const rand = rng(key.v + '|' + JSON.stringify(key.vars || {}));
    const vars = key.vars || {};
    const pick = Object.fromEntries(Object.entries(vars).map(([v, spec]) => [v, sampler(spec, rand)]));
    const out = [];
    const n = Object.keys(vars).length || (key.fns && key.fns.length) ? count : 1;
    for (let i = 0; i < n; i++) {
      const env = { vars: {}, fns: {} };
      for (const v of Object.keys(vars)) env.vars[v] = pick[v]();
      // an unknown function, as in F(n) = n F(n − 1): a random smooth function, the same for the key and the answer
      for (const f of key.fns || []) {
        const A = 0.6 + rand(), B = 0.15 + 0.4 * rand(), C = rand() - 0.5, D = 0.3 + rand();
        env.fns[f] = (z) => A * Math.exp(B * z) + C * z * z + D;
      }
      out.push(env);
    }
    return out;
  }

  // ---------- checking ----------
  const near = (u, k, tol) => Math.abs(u - k) <= tol * Math.max(1, Math.abs(k));
  const hasDecimal = (n) => Boolean(n) && typeof n === 'object' && ((n.k === 'num' && n.s.includes('.')) || hasDecimal(n.a) || hasDecimal(n.b));
  const keyTrees = new Map();
  function keyTree(key) {
    const id = JSON.stringify([key.v, key.vars || {}, key.fns || []]);
    if (!keyTrees.has(id)) {
      const r = read(key.v, key);
      if (!r.tree) throw new Error(`The key “${key.v}” can't be read: ${r.err || 'empty'}`);
      keyTrees.set(id, r.tree);
    }
    return keyTrees.get(id);
  }
  // { state: 'empty' | 'unread' | 'right' | 'wrong', msg, hint }
  function check(text, key) {
    const r = read(text, key);
    if (r.empty) return { state: 'empty' };
    if (r.err) return { state: 'unread', msg: r.err };
    const isDiv = r.tree.k === 'word';
    if (key.v === 'diverges') {
      if (isDiv) return { state: 'right' };
      const vals = points(key, 1).map((env) => evaluate(r.tree, env));
      return vals.every((v) => v === Infinity || v === -Infinity) ? { state: 'right' } : { state: 'wrong', hint: 'Check whether it converges.' };
    }
    if (isDiv) return { state: 'wrong', hint: 'Check whether it converges.' };
    const kt = keyTree(key);
    const envs = points(key, 9);
    const pairs = [];
    for (const env of envs) {
      const k = evaluate(kt, env);
      if (!Number.isFinite(k)) continue;
      pairs.push([evaluate(r.tree, env), k]);
    }
    if (!pairs.length) throw new Error(`The key “${key.v}” has no finite value`);
    const dec = hasDecimal(r.tree);
    const tol = dec ? 1e-12 : 1e-9;
    if (key.pc) {
      const d0 = pairs[0][0] - pairs[0][1];
      if (pairs.every(([u, k]) => Number.isFinite(u) && Math.abs(u - k - d0) <= tol * Math.max(1, Math.abs(k)))) return { state: 'right' };
    } else if (pairs.every(([u, k]) => Number.isFinite(u) && near(u, k, tol))) return { state: 'right' };
    return { state: 'wrong', hint: hintFor(pairs, dec, Object.keys(key.vars || {}).length > 0) };
  }
  // a near miss: the same answer up to a sign, a factor or a constant
  function hintFor(pairs, dec, hasVars) {
    const ok = pairs.filter(([u, k]) => Number.isFinite(u) && Math.abs(k) > 1e-12);
    if (!ok.length) return '';
    const all = (f) => ok.every(([u, k]) => f(u, k));
    if (dec && all((u, k) => near(u, k, 2e-3))) return 'Close: give the exact value, without decimals.';
    if (all((u, k) => near(u, -k, 1e-9))) return 'Check the sign.';
    if (all((u, k) => near(u, 2 * k, 1e-9)) || all((u, k) => near(u, k / 2, 1e-9))) return 'Off by a factor of 2.';
    if (all((u, k) => near(u, Math.PI * k, 1e-9)) || all((u, k) => near(u, k / Math.PI, 1e-9))) return 'Check the factor π.';
    if (hasVars && ok.length > 2) {
      const r0 = ok[0][0] / ok[0][1], d0 = ok[0][0] - ok[0][1];
      if (all((u, k) => near(u / k, r0, 1e-9))) return 'Off by a constant factor.';
      if (all((u, k) => near(u - k, d0, 1e-9 * Math.max(1, Math.abs(k))))) return 'Off by a constant.';
    }
    return '';
  }

  // ---------- how it was read, as HTML (fractions stacked, so 1/(2N)^2 shows its bottom) ----------
  const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const unwrap = (n) => (n && n.k === 'paren' ? unwrap(n.a) : n);
  const FN_NAME = { sqrt: '√', abs: 'abs' };
  function html(n) {
    switch (n.k) {
      case 'num': return n.s;
      case 'const': return n.v === 'pi' ? 'π' : n.v === 'e' ? '<i>e</i>' : '∞';
      case 'var': return `<i>${escHTML(n.v)}</i>`;
      case 'word': return 'diverges';
      case 'paren': return `(${html(n.a)})`;
      case 'add': return `${html(n.a)} + ${html(n.b)}`;
      case 'sub': return `${html(n.a)} − ${html(n.b)}`;
      case 'neg': return `−${/^(add|sub)$/.test(n.a.k) ? `(${html(n.a)})` : html(n.a)}`;
      case 'mul': {
        const a = html(n.a), b = html(n.b);
        const l = unwrap(n.b);
        const dot = n.how === 'dot' || l.k === 'num' || (l.k === 'neg') || /^(add|sub)$/.test(n.a.k) || /^(add|sub)$/.test(n.b.k);
        const wrap = (m, s) => (/^(add|sub)$/.test(m.k) ? `(${s})` : s);
        return wrap(n.a, a) + (dot ? '·' : n.how === 'sp' ? ' ' : '') + wrap(n.b, b);
      }
      case 'div': return `<span class="fr"><span>${html(unwrap(n.a))}</span><span>${html(unwrap(n.b))}</span></span>`;
      case 'pow': {
        const base = /^(add|sub|mul|div|neg|pow|fact)$/.test(n.a.k) ? `(${html(n.a)})` : html(n.a);
        return `${base}<sup>${html(unwrap(n.b))}</sup>`;
      }
      case 'fact': return `${/^(num|const|var|paren)$/.test(n.a.k) ? html(n.a) : `(${html(n.a)})`}!`;
      case 'abs': return `|${html(n.a)}|`;
      case 'fn':
        if (n.f === 'sqrt') return `<span class="sq">√<span>${html(unwrap(n.a))}</span></span>`;
        return `<span class="fn">${FN_NAME[n.f] || n.f}</span>(${html(unwrap(n.a))})`;
      case 'ufn': return `${n.f === 'Γ' ? 'Γ' : `<i>${escHTML(n.f)}</i>`}(${html(unwrap(n.a))})`;
      default: return '';
    }
  }
  // the preview of a typed answer: { html } (empty for an empty box) or { err }
  function render(text, key) {
    const r = read(text, key);
    if (r.empty) return { html: '' };
    if (r.err) return { err: r.err };
    let note = '';
    const was = [];
    (function walk(n) { if (!n || typeof n !== 'object') return; if (n.was && !was.includes(n.was)) was.push(n.was); walk(n.a); walk(n.b); })(r.tree);
    if (was.length) note = ` <span class="ent-as">(${escHTML(was[0])} read as ${escHTML(Object.keys(key.vars)[0])})</span>`;
    return { html: html(r.tree) + note };
  }

  const api = { normalize, read, check, render, evaluate, points };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.MathAnswer = api;
})();
