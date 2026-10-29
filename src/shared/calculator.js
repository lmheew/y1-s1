// Floating calculator for the subject pages. A small ghost button sticks to a side of the screen: drag it anywhere
// and it snaps back to the nearest side. Tap it once to wake it, tap again to open a standard calculator laid out
// like the one in Windows (memory, no history). The engine comes from the "Tally Calculator" artifact, changed to
// exact fractions so results match Windows (1 ÷ 3 × 3 = 1, 0.1 + 0.2 = 0.3) and formatted by Windows' display rules.
// In Node, the file exports the engine for src/shared/calculator_test.js instead of building any UI.
(() => {
  'use strict';

  // ---------- exact numbers: reduced fractions of BigInts ----------
  const ZERO = { n: 0n, d: 1n };
  const ONE = { n: 1n, d: 1n };
  const HUNDRED = { n: 100n, d: 1n };
  const abs = (v) => (v < 0n ? -v : v);
  const pow10 = (k) => 10n ** BigInt(k);
  const len = (v) => abs(v).toString().length;
  function gcd(a, b) {
    while (b) { const t = a % b; a = b; b = t; }
    return a;
  }
  function frac(n, d = 1n) {
    if (d < 0n) { n = -n; d = -d; }
    if (n === 0n) return ZERO;
    const g = gcd(abs(n), d);
    return g === 1n ? { n, d } : { n: n / g, d: d / g };
  }
  const isZero = (a) => a.n === 0n;
  const neg = (a) => (a.n === 0n ? a : { n: -a.n, d: a.d });
  const add = (a, b) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
  const sub = (a, b) => frac(a.n * b.d - b.n * a.d, a.d * b.d);
  const mul = (a, b) => frac(a.n * b.n, a.d * b.d);
  const div = (a, b) => frac(a.n * b.d, a.d * b.n); // callers rule out b = 0
  // a typed entry such as "12.", "-0.50" or "7"
  function parse(s) {
    const m = /^(-?)(\d*)(?:\.(\d*))?$/.exec(s);
    if (!m) return ZERO;
    const f = m[3] || '';
    return frac(BigInt(m[1] + (m[2] || '0') + f), pow10(f.length));
  }
  // floor(log10 |a|) for a ≠ 0
  function lg(a) {
    const n = abs(a.n);
    let k = len(n) - len(a.d);
    if (k >= 0 ? n < a.d * pow10(k) : n * pow10(-k) < a.d) k--;
    return k;
  }
  // |a| rounded half-up to `count` significant digits: [digits without trailing zeros, floor(log10) after rounding]
  function sig(a, count) {
    let e = lg(a);
    const s = count - 1 - e;
    let num = abs(a.n), den = a.d;
    if (s >= 0) num *= pow10(s); else den *= pow10(-s);
    let m = (2n * num + den) / (2n * den);
    if (m === pow10(count)) { m = pow10(count - 1); e++; }
    return [m.toString().replace(/0+$/, '') || '0', e];
  }
  // keep fractions small: past a 60-digit denominator, round to 40 significant digits (far beyond what is shown)
  const LIMIT = pow10(60);
  function tidy(a) {
    if (a.d <= LIMIT || isZero(a)) return a;
    const [D, e] = sig(a, 40);
    const k = e + 1 - D.length;
    const n = BigInt(D) * (k > 0 ? pow10(k) : 1n);
    return frac(a.n < 0n ? -n : n, k < 0 ? pow10(-k) : 1n);
  }
  function isqrt(v) {
    if (v < 2n) return v;
    let x = 1n << BigInt(Math.ceil(v.toString(2).length / 2));
    for (;;) {
      const y = (x + v / x) >> 1n;
      if (y >= x) return x;
      x = y;
    }
  }
  // exact for perfect squares (√(9/4) = 3/2); otherwise 36 significant digits
  function sqrt(a) {
    if (isZero(a)) return a;
    const nd = a.n * a.d;
    const k = Math.max(0, Math.ceil((72 - len(nd)) / 2));
    return tidy(frac(isqrt(nd * pow10(2 * k)), a.d * pow10(k)));
  }
  // Windows' standard-mode display: 16 significant digits; at most 16 decimals, giving up digits for up to two
  // zeros after the point, then scientific; scientific above 16 integer digits ("1.e+16").
  const PREC = 16;
  function fmt(a) {
    if (isZero(a)) return '0';
    let [D, e] = sig(a, PREC);
    let left = e + 1;
    let sci = left > PREC;
    if (!sci && D.length - left > PREC) {
      if (left >= -2) {
        [D, e] = sig(a, PREC + left);
        left = e + 1;
        sci = left > PREC;
      } else sci = true;
    }
    const minus = a.n < 0n ? '−' : '';
    if (sci) return `${minus}${D[0]}.${D.slice(1)}e${e < 0 ? '−' : '+'}${Math.abs(e)}`;
    let out;
    if (left <= 0) out = '0.' + '0'.repeat(-left) + D;
    else if (D.length <= left) out = D + '0'.repeat(left - D.length);
    else out = D.slice(0, left) + '.' + D.slice(left);
    const dot = out.indexOf('.');
    const int = dot < 0 ? out : out.slice(0, dot);
    return minus + int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dot < 0 ? '' : out.slice(dot));
  }
  // results past 1e9999 overflow, as in Windows; results below 1e-9999 count as zero
  function checked(r) {
    if (isZero(r)) return r;
    const e = lg(r);
    if (e > 9999) throw new Error('Overflow');
    return e < -9999 ? ZERO : tidy(r);
  }
  const store = (a) => `${a.n}/${a.d}`;
  function unstore(s) {
    const m = /^(-?\d+)\/(\d+)$/.exec(String(s));
    return m && m[2] !== '0' && m[1].length < 400 && m[2].length < 400 ? frac(BigInt(m[1]), BigInt(m[2])) : null;
  }
  const Q = { ZERO, ONE, frac, parse, add, sub, mul, div, neg, sqrt, isZero, fmt, store, unstore };

  // ---------- engine (no DOM) ----------
  const SYM = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const MAX_DIGITS = 16;
  const S = {
    raw: '0', val: ZERO, editable: true, entered: true, acc: null, op: null, unary: null,
    justEq: false, exprEq: '', lastOp: null, lastB: null, error: null, errExpr: '', mem: [],
  };
  function reset() {
    Object.assign(S, { raw: '0', val: ZERO, editable: true, entered: true, acc: null, op: null, unary: null,
      justEq: false, exprEq: '', lastOp: null, lastB: null, error: null, errExpr: '' });
  }
  function fmtEntry(s) {
    const negative = s[0] === '-';
    const t = negative ? s.slice(1) : s;
    const d = t.indexOf('.');
    const i = d < 0 ? t : t.slice(0, d);
    return (negative ? '−' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d < 0 ? '' : t.slice(d));
  }
  const cur = () => (S.editable ? parse(S.raw) : S.val);
  const prefix = () => (S.op ? `${fmt(S.acc)} ${SYM[S.op]} ` : '');
  function fail(msg, expr) {
    Object.assign(S, { error: msg, errExpr: expr, op: null, acc: null, unary: null,
      justEq: false, lastOp: null, lastB: null, editable: false });
  }
  function compute(a, op, b) {
    let r;
    if (op === '+') r = add(a, b);
    else if (op === '-') r = sub(a, b);
    else if (op === '*') r = mul(a, b);
    else {
      if (isZero(b)) throw new Error(isZero(a) ? 'Result is undefined' : 'Cannot divide by zero');
      r = div(a, b);
    }
    return checked(r);
  }
  // freeze a typed entry into a value (used before memory keys act on it)
  function settle() {
    const x = cur();
    Object.assign(S, { val: x, editable: false });
    return x;
  }

  const A = {
    digit(d) {
      if (S.error) reset();
      S.justEq = false;
      if (!S.editable) { Object.assign(S, { raw: d, editable: true, entered: true, unary: null }); return; }
      if (S.raw === '0') S.raw = d;
      else if (S.raw === '-0') S.raw = '-' + d;
      // like Windows, a leading "0." doesn't count toward the 16 digits
      else if (S.raw.replace(/^-?0(?=\.)/, '').replace(/\D/g, '').length < MAX_DIGITS) S.raw += d;
    },
    dot() {
      if (S.error) reset();
      S.justEq = false;
      if (!S.editable) { Object.assign(S, { raw: '0.', editable: true, entered: true, unary: null }); return; }
      if (!S.raw.includes('.')) S.raw += '.';
    },
    op(o) {
      if (S.error) return;
      const x = cur();
      if (S.op && S.entered) {
        const expr = `${fmt(S.acc)} ${SYM[S.op]} ${S.unary ?? fmt(x)} ${SYM[o]}`;
        try { S.acc = compute(S.acc, S.op, x); } catch (e) { fail(e.message, expr); return; }
      } else if (!S.op) {
        S.acc = x;
      }
      Object.assign(S, { op: o, val: S.acc, editable: false, entered: false, unary: null, justEq: false });
    },
    eq() {
      if (S.error) { reset(); return; }
      const x = cur();
      let a, o, b, aT, bT;
      if (S.op) {
        a = S.acc; o = S.op; b = x; aT = fmt(a); bT = S.unary ?? fmt(b);
        S.lastOp = o; S.lastB = b;
      } else if (S.lastOp) {
        a = x; o = S.lastOp; b = S.lastB; aT = S.justEq ? fmt(a) : (S.unary ?? fmt(a)); bT = fmt(b);
      } else {
        Object.assign(S, { val: x, exprEq: `${S.unary ?? fmt(x)} =`, justEq: true, editable: false, entered: true, unary: null });
        return;
      }
      const expr = `${aT} ${SYM[o]} ${bT} =`;
      let r;
      try { r = compute(a, o, b); } catch (e) { fail(e.message, expr); return; }
      Object.assign(S, { val: r, op: null, acc: null, unary: null, editable: false, entered: true, justEq: true, exprEq: expr });
    },
    unary(kind) {
      if (S.error) return;
      const x = cur();
      const inner = S.justEq ? fmt(x) : (S.unary ?? fmt(x));
      let r, label;
      if (kind === 'inv') {
        label = `1/(${inner})`;
        if (isZero(x)) { fail('Cannot divide by zero', prefix() + label); return; }
        r = div(ONE, x);
      } else if (kind === 'sqr') {
        label = `sqr(${inner})`;
        r = mul(x, x);
      } else {
        label = `√(${inner})`;
        if (x.n < 0n) { fail('Invalid input', prefix() + label); return; }
        r = sqrt(x);
      }
      try { r = checked(r); } catch (e) { fail(e.message, prefix() + label); return; }
      Object.assign(S, { val: r, unary: label, editable: false, entered: true, justEq: false });
    },
    pct() {
      if (S.error) return;
      const x = cur();
      const r = checked((S.op === '+' || S.op === '-') ? div(mul(S.acc, x), HUNDRED) : div(x, HUNDRED));
      Object.assign(S, { val: r, unary: fmt(r), editable: false, entered: true, justEq: false });
    },
    neg() {
      if (S.error) return;
      if (S.editable) {
        if (S.raw !== '0') S.raw = S.raw[0] === '-' ? S.raw.slice(1) : '-' + S.raw;
        return;
      }
      const x = cur();
      const inner = S.justEq ? fmt(x) : (S.unary ?? fmt(x));
      Object.assign(S, { val: neg(x), unary: `negate(${inner})`, entered: true, justEq: false });
    },
    ce() {
      if (S.error || S.justEq) { reset(); return; }
      Object.assign(S, { raw: '0', editable: true, entered: true, unary: null });
    },
    c() { reset(); },
    back() {
      if (S.error) { reset(); return; }
      if (S.justEq) { S.justEq = false; S.exprEq = ''; return; }
      if (!S.editable) return;
      S.raw = S.raw.slice(0, -1);
      if (S.raw === '' || S.raw === '-') S.raw = '0';
    },
    recall(v) {
      if (!v) return;
      if (S.error) reset();
      if (S.justEq) { S.justEq = false; S.exprEq = ''; }
      Object.assign(S, { val: v, editable: false, entered: true, unary: null });
    },
    ms() { if (S.error) return; S.mem.unshift(settle()); if (S.mem.length > 50) S.mem.length = 50; },
    mr() { if (S.mem.length) A.recall(S.mem[0]); },
    mplus() { if (S.error) return; const x = settle(); if (!S.mem.length) S.mem.unshift(x); else A.memAdjust(0, 1); },
    mminus() { if (S.error) return; const x = settle(); if (!S.mem.length) S.mem.unshift(neg(x)); else A.memAdjust(0, -1); },
    mc() { S.mem = []; },
    memAdjust(i, sign) {
      if (S.error || i >= S.mem.length) return;
      const x = settle();
      try { S.mem[i] = checked(sign > 0 ? add(S.mem[i], x) : sub(S.mem[i], x)); } catch (e) { /* overflow: leave it */ }
    },
  };
  const displayText = () => (S.error ? S.error : (S.editable ? fmtEntry(S.raw) : fmt(S.val)));
  function exprText() {
    if (S.error) return S.errExpr;
    if (S.justEq) return S.exprEq;
    const head = S.op ? `${fmt(S.acc)} ${SYM[S.op]}` : '';
    return head + (S.unary ? (head ? ' ' : '') + S.unary : '');
  }
  const isBlank = () => !S.error && !S.op && !S.justEq && !S.unary && S.editable && S.raw === '0';

  if (typeof document === 'undefined') {
    module.exports = { Q, S, A, reset, displayText, exprText };
    return;
  }

  // ---------- UI: set up once the page has loaded, so it never slows the page's own start ----------
  function initUI() {
    const MEM_KEY = 'study-calc-memory';
    const POS_KEY = 'study-calc-position';
    const SIZE = 44;
    const ARM_MS = 4000;
    const $ = (sel, el = document) => el.querySelector(sel);
    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi));
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const saved = JSON.parse(localStorage.getItem(MEM_KEY) || 'null');
      if (Array.isArray(saved)) S.mem = saved.map(unstore).filter(Boolean).slice(0, 50);
    } catch (e) { /* storage unavailable */ }
    const saveMem = () => { try { localStorage.setItem(MEM_KEY, JSON.stringify(S.mem.map(store))); } catch (e) { /* ignore */ } };

    const svg = (body, cls) => `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${body}</svg>`;
    const ICON_CALC = '<rect x="5" y="2.5" width="14" height="19" rx="2.6"/><rect x="8" y="5.5" width="8" height="3.6" rx=".9"/>'
      + '<g class="dots"><circle cx="9" cy="12.6" r="1"/><circle cx="12" cy="12.6" r="1"/><circle cx="15" cy="12.6" r="1"/>'
      + '<circle cx="9" cy="15.7" r="1"/><circle cx="12" cy="15.7" r="1"/><circle cx="15" cy="15.7" r="1"/>'
      + '<circle cx="9" cy="18.8" r="1"/><circle cx="12" cy="18.8" r="1"/><circle cx="15" cy="18.8" r="1"/></g>';
    const ICON_X = '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>';

    // the ghost button and its hint
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'calc-fab no-anim';
    fab.setAttribute('aria-label', 'Calculator');
    fab.setAttribute('aria-haspopup', 'dialog');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-controls', 'calc-panel');
    fab.title = 'Calculator: tap twice to open, drag to move';
    fab.innerHTML = svg(ICON_CALC, 'i-calc') + svg(ICON_X, 'i-close');
    const tip = document.createElement('div');
    tip.className = 'calc-tip';
    tip.setAttribute('role', 'status');
    const probe = document.createElement('div');
    probe.className = 'calc-probe';
    document.body.append(fab, tip, probe);

    function insets() {
      const cs = getComputedStyle(probe);
      return { t: parseFloat(cs.paddingTop) || 0, r: parseFloat(cs.paddingRight) || 0, b: parseFloat(cs.paddingBottom) || 0, l: parseFloat(cs.paddingLeft) || 0 };
    }
    const vw = () => document.documentElement.clientWidth || window.innerWidth;
    const vh = () => window.innerHeight;
    // where the button may rest: clear of the app bar and the tab bar (bottom on phones, top on wide screens);
    // on the right edge it also stays above the back-to-top button in the bottom-right corner
    function band(side) {
      const ins = insets();
      const wide = window.matchMedia('(min-width: 860px)').matches;
      let top, bottom;
      if (wide) {
        top = 120 + ins.t;
        bottom = vh() - 24 - ins.b - SIZE;
      } else {
        const bar = $('.appbar'), tabs = $('.tabbar');
        top = (bar ? bar.getBoundingClientRect().bottom : ins.t) + 12;
        bottom = (tabs ? tabs.getBoundingClientRect().top : vh() - ins.b) - 14 - SIZE;
      }
      if (side === 'right' && $('.totop')) bottom -= 58;
      return { left: 10 + ins.l, right: vw() - 10 - ins.r - SIZE, top, bottom: Math.max(top, bottom) };
    }

    let pos = { side: 'left', y: 1 }; // y: 0 = top of the band, 1 = bottom (the default: bottom left)
    try {
      const p = JSON.parse(localStorage.getItem(POS_KEY) || 'null');
      if (p && (p.side === 'left' || p.side === 'right') && p.y >= 0 && p.y <= 1) pos = { side: p.side, y: p.y };
    } catch (e) { /* storage unavailable */ }
    const savePos = () => { try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch (e) { /* ignore */ } };

    let x = 0, y = 0, dragging = false;
    function draw() {
      fab.style.transform = `translate3d(${x}px, ${y}px, 0)${dragging ? ' scale(1.08)' : ''}`;
      placeTip();
    }
    function place(animate) {
      const b = band(pos.side);
      x = pos.side === 'left' ? b.left : b.right;
      y = b.top + pos.y * (b.bottom - b.top);
      fab.dataset.side = pos.side; // which edge it tucks into while the page scrolls down (calculator.css)
      fab.classList.toggle('no-anim', !animate || reduced);
      draw();
    }

    // hint next to the button ("Tap again to open")
    let tipTimer = 0;
    function showTip(text, ms) {
      tip.textContent = text;
      tip.classList.add('show');
      placeTip();
      clearTimeout(tipTimer);
      if (ms) tipTimer = setTimeout(hideTip, ms);
    }
    function hideTip() { clearTimeout(tipTimer); tip.classList.remove('show'); }
    function placeTip() {
      if (!tip.classList.contains('show')) return;
      const w = tip.offsetWidth, h = tip.offsetHeight;
      const tx = pos.side === 'left' ? x + SIZE + 10 : x - 10 - w;
      tip.style.transform = `translate3d(${clamp(tx, 8, vw() - 8 - w)}px, ${y + (SIZE - h) / 2}px, 0)`;
    }

    // first tap arms (more opaque), a second tap on the button opens; a tap elsewhere or 4 s of nothing cancels
    let armed = false, armTimer = 0, off = false;
    function arm(kind) {
      armed = true;
      fab.classList.add('armed');
      showTip(kind === 'mouse' ? 'Click again to open' : 'Tap again to open');
      clearTimeout(armTimer);
      armTimer = setTimeout(disarm, ARM_MS);
    }
    function disarm() {
      if (!armed) return;
      armed = false;
      fab.classList.remove('armed');
      clearTimeout(armTimer);
      hideTip();
    }
    function tap(kind) {
      if (off) { showTip('Off while a quiz timer runs', 2200); return; }
      if (isOpen) { closePanel(); return; }
      if (armed) { disarm(); openPanel(); return; }
      arm(kind);
    }

    // drag anywhere; on release it glides to the nearest side (a quick flick throws it across, like chat heads)
    let pid = null, sx = 0, sy = 0, ox = 0, oy = 0, moved = false, trail = [];
    fab.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || pid !== null) return;
      pid = e.pointerId;
      try { fab.setPointerCapture(pid); } catch (err) { /* ignore */ }
      sx = e.clientX; sy = e.clientY; ox = x; oy = y; moved = false;
      trail = [[e.clientX, e.timeStamp]];
    });
    fab.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pid) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved) {
        if (Math.hypot(dx, dy) < (e.pointerType === 'mouse' ? 4 : 8)) return;
        moved = true;
        dragging = true;
        disarm();
        hideTip();
        fab.classList.add('dragging', 'no-anim');
      }
      const ins = insets();
      x = clamp(ox + dx, ins.l, vw() - ins.r - SIZE);
      y = clamp(oy + dy, ins.t, vh() - ins.b - SIZE);
      trail.push([e.clientX, e.timeStamp]);
      if (trail.length > 6) trail.shift();
      draw();
    });
    function release(e, cancelled) {
      if (e.pointerId !== pid) return;
      pid = null;
      if (!moved) { if (!cancelled) tap(e.pointerType); return; }
      dragging = false;
      fab.classList.remove('dragging');
      const [x0, t0] = trail[0], [x1, t1] = trail[trail.length - 1];
      const speed = t1 - t0 > 0 && e.timeStamp - t1 < 80 ? (x1 - x0) / (t1 - t0) : 0;
      pos.side = x + SIZE / 2 + speed * 160 < vw() / 2 ? 'left' : 'right';
      const b = band(pos.side);
      pos.y = b.bottom > b.top ? clamp((y - b.top) / (b.bottom - b.top), 0, 1) : 1;
      savePos();
      place(true);
      showFabs();
    }
    // just used (moved, or the window closed): keep the floating buttons out until the page next scrolls down,
    // rather than tucking this one away at once (totop.js listens)
    const showFabs = () => document.dispatchEvent(new Event('fabshow'));
    fab.addEventListener('pointerup', (e) => release(e, false));
    fab.addEventListener('pointercancel', (e) => release(e, true));
    fab.addEventListener('click', (e) => { if (e.detail === 0) { if (off) tap('key'); else if (isOpen) closePanel(); else openPanel(); } });
    fab.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerdown', (e) => {
      if (armed && !fab.contains(e.target)) disarm();
      active = Boolean(panel && !panel.hidden && panel.contains(e.target)) || (isOpen && fab.contains(e.target));
    }, true);

    // ---------- the calculator window ----------
    const KEY_ROWS = [
      ['pct', '', '%', 'Percent'], ['ce', '', 'CE', 'Clear entry'], ['c', '', 'C', 'Clear'],
      ['back', '', svg('<path d="M8.5 5H20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8.5L3 12z"/><path d="M11.5 9.5l5 5M16.5 9.5l-5 5"/>'), 'Backspace'],
      ['inv', '', '<span><sup>1</sup>&frasl;<i>x</i></span>', 'Reciprocal'], ['sqr', '', '<span><i>x</i><sup>2</sup></span>', 'Square'],
      ['sqrt', '', '<span><sup>2</sup>&radic;<i>x</i></span>', 'Square root'], ['op', '/', '&divide;', 'Divide by'],
      ['digit', '7'], ['digit', '8'], ['digit', '9'], ['op', '*', '&times;', 'Multiply by'],
      ['digit', '4'], ['digit', '5'], ['digit', '6'], ['op', '-', '&minus;', 'Minus'],
      ['digit', '1'], ['digit', '2'], ['digit', '3'], ['op', '+', '+', 'Plus'],
      ['neg', '', '<span><sup>+</sup>&frasl;<sub>&minus;</sub></span>', 'Positive negative'], ['digit', '0'],
      ['dot', '', '.', 'Decimal point'], ['eq', '', '=', 'Equals'],
    ];
    const ERR_OFF = new Set(['pct', 'inv', 'sqr', 'sqrt', 'op', 'neg']);
    function keyHTML([act, v, label, aria]) {
      const num = act === 'digit' || act === 'neg' || act === 'dot';
      const cls = 'calc-key' + (num ? ' num' : '') + (act === 'eq' ? ' eq' : '');
      return `<button type="button" class="${cls}" data-act="${act}"${v ? ` data-v="${v}"` : ''}${ERR_OFF.has(act) ? ' data-err-off' : ''}`
        + `${aria ? ` aria-label="${aria}"` : ''}>${label || v}</button>`;
    }
    const PANEL_HTML = `
      <div class="calc-head">
        <span class="calc-title">${svg(ICON_CALC)}Calculator</span>
        <button type="button" class="calc-x" data-act="close" aria-label="Close calculator">${svg(ICON_X)}</button>
      </div>
      <div class="calc-screen" aria-live="polite" aria-atomic="true">
        <div class="calc-expr"><span>&nbsp;</span></div>
        <div class="calc-value">0</div>
      </div>
      <div class="calc-body">
        <div class="calc-mem" role="group" aria-label="Memory">
          <button type="button" data-act="mc" data-needs-mem aria-label="Clear all memory">MC</button>
          <button type="button" data-act="mr" data-needs-mem aria-label="Memory recall">MR</button>
          <button type="button" data-act="mplus" data-err-off aria-label="Memory add">M+</button>
          <button type="button" data-act="mminus" data-err-off aria-label="Memory subtract">M&minus;</button>
          <button type="button" data-act="ms" data-err-off aria-label="Memory store">MS</button>
          <button type="button" data-act="mlist" data-needs-mem aria-label="Show memory" aria-expanded="false">M${svg('<path d="M7 10l5 5 5-5"/>')}</button>
        </div>
        <div class="calc-keys">${KEY_ROWS.map(keyHTML).join('')}</div>
        <section class="calc-drawer" aria-label="Memory">
          <p class="calc-drawer-title">Memory</p>
          <div class="calc-list-wrap"><ul class="calc-list"></ul><p class="calc-empty" hidden>There's nothing saved in memory.</p></div>
          <div class="calc-drawer-foot"><button type="button" class="calc-x" data-act="clear-mem" aria-label="Clear all memory" title="Clear all memory">${svg('<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>')}</button></div>
        </section>
      </div>`;

    let panel = null, valueEl, exprEl, drawer, listEl, emptyEl, mlistBtn;
    let isOpen = false, active = false, drawerOpen = false, panelAt = null;
    function el(tag, cls, text) {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined) n.textContent = text;
      return n;
    }
    function fit() {
      if (!valueEl) return;
      valueEl.style.fontSize = '';
      let size = parseFloat(getComputedStyle(valueEl).fontSize);
      while (valueEl.scrollWidth > valueEl.clientWidth && size > 14) {
        size -= 2;
        valueEl.style.fontSize = size + 'px';
      }
    }
    function renderDrawer() {
      listEl.hidden = !S.mem.length;
      emptyEl.hidden = S.mem.length > 0;
      $('[data-act="clear-mem"]', panel).hidden = !S.mem.length;
      if (!drawerOpen) return;
      listEl.replaceChildren(...S.mem.map((m, i) => {
        const li = el('li', 'calc-m-item');
        const v = el('button', 'calc-m-val', fmt(m));
        v.type = 'button';
        v.dataset.act = 'm-recall';
        v.dataset.i = i;
        v.setAttribute('aria-label', 'Recall ' + fmt(m));
        const acts = el('div', 'calc-m-acts');
        [['m-clear', 'MC', 'Clear this memory'], ['m-add', 'M+', 'Add to this memory'], ['m-sub', 'M−', 'Subtract from this memory']].forEach(([act, label, aria]) => {
          const b = el('button', 'calc-m-act', label);
          b.type = 'button';
          b.dataset.act = act;
          b.dataset.i = i;
          b.setAttribute('aria-label', aria);
          if (act !== 'm-clear' && S.error) b.disabled = true;
          acts.append(b);
        });
        li.append(v, acts);
        return li;
      }));
    }
    function setDrawer(open) {
      drawerOpen = open;
      drawer.classList.toggle('open', open);
      mlistBtn.setAttribute('aria-expanded', String(open));
      renderDrawer();
    }
    function render() {
      panel.classList.toggle('is-error', Boolean(S.error));
      valueEl.textContent = displayText();
      exprEl.textContent = exprText() || ' ';
      panel.querySelectorAll('[data-err-off]').forEach((b) => { b.disabled = Boolean(S.error); });
      const noMem = !S.mem.length || Boolean(S.error);
      panel.querySelectorAll('[data-needs-mem]').forEach((b) => { b.disabled = noMem; });
      fit();
      renderDrawer();
      saveMem();
    }

    function build() {
      panel = document.createElement('div');
      panel.className = 'calc-panel';
      panel.id = 'calc-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Calculator');
      panel.tabIndex = -1;
      panel.hidden = true;
      panel.innerHTML = PANEL_HTML;
      document.body.append(panel);
      valueEl = $('.calc-value', panel);
      exprEl = $('.calc-expr span', panel);
      drawer = $('.calc-drawer', panel);
      listEl = $('.calc-list', panel);
      emptyEl = $('.calc-empty', panel);
      mlistBtn = $('[data-act="mlist"]', panel);

      // mouse clicks don't leave focus on a key, so Enter keeps meaning "equals"
      panel.addEventListener('mousedown', (e) => { if (e.target.closest('.calc-key, .calc-mem button')) e.preventDefault(); });
      panel.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b || b.disabled) return;
        const act = b.dataset.act, v = b.dataset.v, i = Number(b.dataset.i);
        switch (act) {
          case 'close': closePanel(); return;
          case 'digit': A.digit(v); break;
          case 'dot': A.dot(); break;
          case 'op': A.op(v); break;
          case 'eq': A.eq(); break;
          case 'pct': A.pct(); break;
          case 'ce': A.ce(); break;
          case 'c': A.c(); break;
          case 'back': A.back(); break;
          case 'inv': case 'sqr': case 'sqrt': A.unary(act); break;
          case 'neg': A.neg(); break;
          case 'mc': A.mc(); break;
          case 'mr': A.mr(); break;
          case 'mplus': A.mplus(); break;
          case 'mminus': A.mminus(); break;
          case 'ms': A.ms(); break;
          case 'mlist': setDrawer(!drawerOpen); break;
          case 'clear-mem': S.mem = []; break;
          case 'm-recall': A.recall(S.mem[i]); setDrawer(false); break;
          case 'm-clear': S.mem.splice(i, 1); break;
          case 'm-add': A.memAdjust(i, 1); break;
          case 'm-sub': A.memAdjust(i, -1); break;
          default: return;
        }
        render();
      });
      $('.calc-screen', panel).addEventListener('click', () => { if (drawerOpen) setDrawer(false); });

      // move the window by its title bar
      const head = $('.calc-head', panel);
      let hp = null, hx = 0, hy = 0, px0 = 0, py0 = 0;
      head.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || e.target.closest('button')) return;
        hp = e.pointerId;
        try { head.setPointerCapture(hp); } catch (err) { /* ignore */ }
        hx = e.clientX; hy = e.clientY;
        const r = panel.getBoundingClientRect();
        px0 = r.left; py0 = r.top;
        head.classList.add('grabbing');
      });
      head.addEventListener('pointermove', (e) => {
        if (e.pointerId !== hp) return;
        panelAt = { x: px0 + e.clientX - hx, y: py0 + e.clientY - hy };
        positionPanel();
      });
      const drop = (e) => { if (e.pointerId === hp) { hp = null; head.classList.remove('grabbing'); } };
      head.addEventListener('pointerup', drop);
      head.addEventListener('pointercancel', drop);
    }

    function positionPanel() {
      const ins = insets();
      const w = panel.offsetWidth, h = panel.offsetHeight;
      const fitX = (v) => clamp(v, 8 + ins.l, vw() - 8 - ins.r - w);
      const fitY = (v) => clamp(v, 8 + ins.t, vh() - 8 - ins.b - h);
      let px, py;
      if (panelAt) {
        px = fitX(panelAt.x); py = fitY(panelAt.y);
        panelAt = { x: px, y: py };
      } else {
        // above the button when it sits low (below it when high), on its side; if that would cover the button
        // (a short screen, such as a phone on its side), open beside it instead, so the button stays tappable
        const left = pos.side === 'left', below = y + SIZE / 2 < vh() / 2;
        const options = [
          [left ? x : x + SIZE - w, below ? y + SIZE + 10 : y - 10 - h, `${left ? 'left' : 'right'} ${below ? 'top' : 'bottom'}`],
          [left ? x + SIZE + 10 : x - 10 - w, y + SIZE / 2 - h / 2, `${left ? 'left' : 'right'} center`],
        ].map(([ox, oy, origin]) => [fitX(ox), fitY(oy), origin]);
        const clear = ([ax, ay]) => ax >= x + SIZE + 4 || ax + w <= x - 4 || ay >= y + SIZE + 4 || ay + h <= y - 4;
        const [ax, ay, origin] = options.find(clear) || options[0];
        px = ax; py = ay;
        panel.style.transformOrigin = origin;
      }
      panel.style.left = px + 'px';
      panel.style.top = py + 'px';
    }
    function openPanel() {
      if (off) return;
      if (!panel) build();
      disarm();
      panel.hidden = false;
      isOpen = true;
      active = true;
      fab.classList.add('open');
      fab.setAttribute('aria-expanded', 'true');
      render();
      positionPanel();
      if (!reduced) { panel.classList.remove('pop'); void panel.offsetWidth; panel.classList.add('pop'); }
      panel.focus({ preventScroll: true });
    }
    function closePanel() {
      if (!panel || !isOpen) return;
      const hadFocus = panel.contains(document.activeElement);
      setDrawer(false);
      panel.hidden = true;
      isOpen = false;
      active = false;
      fab.classList.remove('open');
      fab.setAttribute('aria-expanded', 'false');
      if (hadFocus) fab.focus({ preventScroll: true });
      showFabs();
    }

    // keyboard, while the calculator is open and was the last thing used
    const KEYS = {
      '.': '[data-act="dot"]', ',': '[data-act="dot"]',
      '+': '[data-act="op"][data-v="+"]', '-': '[data-act="op"][data-v="-"]',
      '*': '[data-act="op"][data-v="*"]', '/': '[data-act="op"][data-v="/"]',
      Enter: '[data-act="eq"]', '=': '[data-act="eq"]',
      Backspace: '[data-act="back"]', Delete: '[data-act="ce"]',
      '%': '[data-act="pct"]', r: '[data-act="inv"]', R: '[data-act="inv"]',
      '@': '[data-act="sqrt"]', q: '[data-act="sqr"]', Q: '[data-act="sqr"]', F9: '[data-act="neg"]',
    };
    window.addEventListener('keydown', (e) => {
      if (!isOpen || !active || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
      const search = document.getElementById('search');
      if (search && !search.hidden) return;
      const k = e.key;
      if (k === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (drawerOpen) setDrawer(false);
        else if (isBlank()) closePanel();
        else { A.c(); render(); }
        return;
      }
      if ((k === 'Enter' || k === ' ') && t && t.tagName === 'BUTTON') return;
      const sel = /^[0-9]$/.test(k) ? `[data-act="digit"][data-v="${k}"]` : KEYS[k];
      if (!sel) return;
      e.preventDefault();
      e.stopPropagation(); // "/" divides here instead of opening the page search
      const btn = $('.calc-keys ' + sel, panel);
      if (!btn || btn.disabled) return;
      btn.click();
      btn.classList.add('pressed');
      clearTimeout(btn._t);
      btn._t = setTimeout(() => btn.classList.remove('pressed'), 110);
    }, true);

    // calculator-free like the real quizzes: off while any quiz timer runs (page.js sends "quiztimer")
    function syncTimers() {
      off = Boolean(document.querySelector('.timer.running'));
      fab.classList.toggle('off', off);
      fab.setAttribute('aria-disabled', String(off));
      if (off) { disarm(); closePanel(); }
    }
    document.addEventListener('quiztimer', syncTimers);

    window.addEventListener('resize', () => {
      place(false);
      if (isOpen) { positionPanel(); fit(); }
    });
    place(false);
    fab.getBoundingClientRect(); // settle it at its spot now, or turning the glide on next frame flies it in from the corner
    requestAnimationFrame(() => fab.classList.remove('no-anim'));
    syncTimers();
  }
  const whenIdle = (fn) => (window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 1000 }) : setTimeout(fn, 200));
  if (document.readyState === 'complete') whenIdle(initUI);
  else window.addEventListener('load', () => whenIdle(initUI), { once: true });
})();
