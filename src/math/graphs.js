// Interactive graphs in the Summary tab: plain SVG, each drawn the first time it scrolls into view.
// secant (u2), implicit (u3), concavity (u4), newton and taylor (u5), family and second (u6).
// The build places <figure data-graph="…">.
(() => {
  const figs = Array.from(document.querySelectorAll('figure.explore[data-graph]'));
  if (!figs.length) return;
  const NS = 'http://www.w3.org/2000/svg';
  const W = 320, H = 210, PAD = 6;
  let clipN = 0;
  const fix = (v, d = 2) => (Math.abs(v) < 5e-13 ? 0 : v).toFixed(d).replace('-', '−');
  const tick = (v) => String(Math.round(v * 10) / 10).replace('-', '−');
  const sub = (k) => String(k).split('').map((c) => '₀₁₂₃₄₅₆₇₈₉'[c]).join('');
  const sup = (k) => String(k).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');

  function plot(stage, box) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'gx-svg');
    svg.setAttribute('aria-hidden', 'true');
    stage.replaceChildren(svg);
    const sx = (x) => PAD + ((x - box.x0) / (box.x1 - box.x0)) * (W - 2 * PAD);
    const sy = (y) => H - PAD - ((y - box.y0) / (box.y1 - box.y0)) * (H - 2 * PAD);
    const ux = (px) => box.x0 + ((px - PAD) / (W - 2 * PAD)) * (box.x1 - box.x0);
    const uy = (py) => box.y0 + ((H - PAD - py) / (H - 2 * PAD)) * (box.y1 - box.y0);
    const el = (tag, attrs, parent) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      (parent || svg).append(n);
      return n;
    };
    const id = 'gx-clip-' + (++clipN);
    el('rect', { x: PAD, y: PAD, width: W - 2 * PAD, height: H - 2 * PAD }, el('clipPath', { id }, el('defs', {})));
    const base = el('g', { 'clip-path': `url(#${id})` });
    const dyn = el('g', { 'clip-path': `url(#${id})` });
    const top = el('g', {});
    const api = {
      sx, sy, ux, uy, svg,
      grid(stepX, stepY, labels = true) {
        for (let x = Math.ceil(box.x0 / stepX) * stepX; x <= box.x1; x += stepX) {
          el('line', { x1: sx(x), y1: PAD, x2: sx(x), y2: H - PAD, class: Math.abs(x) < 1e-9 ? 'gx-axis' : 'gx-grid' }, base);
          if (labels && Math.abs(x) > 1e-9) el('text', { x: sx(x), y: Math.min(H - PAD - 2, Math.max(PAD + 9, sy(0) + 11)), class: 'gx-tick', 'text-anchor': 'middle' }, base).textContent = tick(x);
        }
        for (let y = Math.ceil(box.y0 / stepY) * stepY; y <= box.y1; y += stepY) {
          el('line', { x1: PAD, y1: sy(y), x2: W - PAD, y2: sy(y), class: Math.abs(y) < 1e-9 ? 'gx-axis' : 'gx-grid' }, base);
          if (labels && Math.abs(y) > 1e-9) el('text', { x: Math.min(W - PAD - 2, Math.max(PAD + 2, sx(0) - 4)), y: sy(y) + 3, class: 'gx-tick', 'text-anchor': 'end' }, base).textContent = tick(y);
        }
      },
      // y = f(x), sampled; breaks the path where f leaves the box far or isn't finite
      curve(f, cls, from = box.x0, to = box.x1, layer = base) {
        let d = '', pen = false;
        const n = 240;
        for (let i = 0; i <= n; i++) {
          const x = from + ((to - from) * i) / n, y = f(x);
          if (!Number.isFinite(y) || y > box.y1 + 50 || y < box.y0 - 50) { pen = false; continue; }
          d += `${pen ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`;
          pen = true;
        }
        return el('path', { d, class: cls }, layer);
      },
      // the same, in the layer that clear() empties (for curves that change)
      liveCurve(f, cls, from, to) { return api.curve(f, cls, from, to, dyn); },
      clear() { dyn.replaceChildren(); top.replaceChildren(); },
      line(x1, y1, x2, y2, cls) { return el('line', { x1: sx(x1), y1: sy(y1), x2: sx(x2), y2: sy(y2), class: cls }, dyn); },
      // the line through (x0, y0) with slope m (vertical when m is not finite)
      through(x0, y0, m, cls) {
        if (!Number.isFinite(m)) return el('line', { x1: sx(x0), y1: PAD, x2: sx(x0), y2: H - PAD, class: cls }, dyn);
        const span = (box.x1 - box.x0) * 3;
        return api.line(x0 - span, y0 - m * span, x0 + span, y0 + m * span, cls);
      },
      dot(x, y, cls = 'gx-dot', r = 4.5) { return el('circle', { cx: sx(x), cy: sy(y), r, class: cls }, top); },
      label(x, y, text, cls = 'gx-label', dx = 6, dy = -6, anchor = 'start') {
        const t = el('text', { x: sx(x) + dx, y: sy(y) + dy, class: cls, 'text-anchor': anchor }, top);
        t.textContent = text;
        return t;
      },
      fixedDot(x, y, cls, r) { return el('circle', { cx: sx(x), cy: sy(y), r: r || 4, class: cls }, base); },
      fixedLabel(x, y, text, dx = 6, dy = -6, anchor = 'start') {
        const t = el('text', { x: sx(x) + dx, y: sy(y) + dy, class: 'gx-label soft', 'text-anchor': anchor }, base);
        t.textContent = text;
        return t;
      },
    };
    return api;
  }
  // box with equal scales on both axes (for the circle), centred on (cx, cy) with half-height h
  function squareBox(cx, cy, h) {
    const w = (h * (W - 2 * PAD)) / (H - 2 * PAD);
    return { x0: cx - w, x1: cx + w, y0: cy - h, y1: cy + h };
  }
  function slider(fig, label, min, max, step, value, onInput) {
    const row = document.createElement('label');
    row.className = 'gx-ctl';
    row.innerHTML = `<span class="gx-ctl-name">${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output></output>`;
    fig.querySelector('.gx-stage').after(row);
    const input = row.querySelector('input'), out = row.querySelector('output');
    const run = () => { out.textContent = onInput(Number(input.value)); };
    input.addEventListener('input', run);
    run();
    return input;
  }
  function readout(fig) {
    const p = document.createElement('p');
    p.className = 'gx-read';
    p.setAttribute('aria-live', 'polite');
    fig.querySelector('.gx-note').before(p);
    return p;
  }

  const WIDGETS = {
    // f(x) = x², secant through x = 1 and x = 1 + h; its slope 2 + h tends to f'(1) = 2
    secant(fig) {
      const g = plot(fig.querySelector('.gx-stage'), { x0: -1.2, x1: 3.4, y0: -1.2, y1: 9.5 });
      g.grid(1, 2);
      g.curve((x) => x * x, 'gx-curve');
      const read = readout(fig);
      slider(fig, 'h', 0.02, 2, 0.01, 1.5, (h) => {
        g.clear();
        const q = 1 + h;
        g.through(1, 1, 2, 'gx-tan');
        g.through(1, 1, 2 + h, 'gx-sec');
        g.dot(1, 1, 'gx-dot solid');
        g.dot(q, q * q);
        g.label(1, 1, 'P', 'gx-label', -14, -6);
        g.label(q, q * q, 'Q', 'gx-label', 7, 4);
        read.innerHTML = `Secant slope <b>${fix(2 + h)}</b> · tangent slope <b>2</b>`;
        return fix(h);
      });
    },
    // the circle x² + y² = 25: tangent at the point, slope −x/y, vertical where y = 0
    implicit(fig) {
      const g = plot(fig.querySelector('.gx-stage'), squareBox(0, 0, 6.6));
      g.grid(2, 2);
      g.curve((x) => Math.sqrt(25 - x * x), 'gx-curve', -5, 5);
      g.curve((x) => -Math.sqrt(25 - x * x), 'gx-curve', -5, 5);
      const read = readout(fig);
      const input = slider(fig, 'angle', 0, 360, 1, 53, (deg) => {
        const t = (deg * Math.PI) / 180;
        let x = 5 * Math.cos(t), y = 5 * Math.sin(t);
        if (Math.abs(x) < 1e-9) x = 0;
        if (Math.abs(y) < 1e-9) y = 0;
        g.clear();
        g.line(0, 0, x, y, 'gx-radius');
        const m = y === 0 ? Infinity : -x / y;
        g.through(x, y, m, 'gx-tan');
        g.dot(0, 0, 'gx-dot small', 2.5);
        g.dot(x, y, 'gx-dot solid');
        read.innerHTML = `Point (${fix(x)}, ${fix(y)}) · ` + (y === 0 ? '<b>vertical tangent</b>: y′ is undefined' : `slope y′ = −x/y = <b>${fix(m)}</b>`);
        return `${deg}°`;
      });
      // drag the point itself
      const svg = g.svg;
      const move = (e) => {
        const r = svg.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) * W, py = ((e.clientY - r.top) / r.height) * H;
        let deg = Math.round((Math.atan2(g.uy(py), g.ux(px)) * 180) / Math.PI);
        if (deg < 0) deg += 360;
        input.value = deg;
        input.dispatchEvent(new Event('input'));
      };
      svg.addEventListener('pointerdown', (e) => { svg.setPointerCapture(e.pointerId); move(e); });
      svg.addEventListener('pointermove', (e) => { if (svg.hasPointerCapture(e.pointerId)) move(e); });
      svg.classList.add('draggable');
    },
    // f(x) = x³ − 3x: increasing/decreasing from f', concave up/down from f''
    concavity(fig) {
      const f = (x) => x ** 3 - 3 * x, fp = (x) => 3 * x * x - 3, fpp = (x) => 6 * x;
      const g = plot(fig.querySelector('.gx-stage'), { x0: -2.7, x1: 2.7, y0: -4.2, y1: 4.2 });
      g.grid(1, 2);
      g.curve(f, 'gx-curve down', -2.7, 0);
      g.curve(f, 'gx-curve up', 0, 2.7);
      g.fixedDot(-1, 2, 'gx-mark');
      g.fixedDot(1, -2, 'gx-mark');
      g.fixedDot(0, 0, 'gx-mark infl');
      g.fixedLabel(-1, 2, 'max', 0, -9, 'middle');
      g.fixedLabel(1, -2, 'min', 0, 17, 'middle');
      g.fixedLabel(0, 0, 'inflection', -7, 14, 'end');
      const read = readout(fig);
      slider(fig, 'x', -2.4, 2.4, 0.01, -1.6, (x) => {
        g.clear();
        g.through(x, f(x), fp(x), 'gx-tan');
        g.dot(x, f(x), 'gx-dot solid');
        const s1 = fp(x), s2 = fpp(x);
        const inc = Math.abs(s1) < 0.005 ? 'f′ = 0: a critical point' : s1 > 0 ? `f′ = ${fix(s1)} > 0: <b>increasing</b>` : `f′ = ${fix(s1)} < 0: <b>decreasing</b>`;
        const cc = Math.abs(s2) < 0.005 ? 'f″ = 0' : s2 > 0 ? `f″ = ${fix(s2)} > 0: <b>concave up</b>` : `f″ = ${fix(s2)} < 0: <b>concave down</b>`;
        read.innerHTML = `${inc} · ${cc}`;
        return fix(x);
      });
    },
    // f(x) = x² − 2 from x₁ = 2: tangent at xₙ meets the axis at xₙ₊₁
    newton(fig) {
      const f = (x) => x * x - 2, fp = (x) => 2 * x;
      const g = plot(fig.querySelector('.gx-stage'), { x0: -0.4, x1: 2.6, y0: -2.6, y1: 4.8 });
      g.grid(0.5, 1);
      g.curve(f, 'gx-curve');
      g.fixedDot(Math.SQRT2, 0, 'gx-mark infl', 3.5);
      g.fixedLabel(Math.SQRT2, 0, '√2', -7, -7, 'end');
      const read = readout(fig);
      const xs = [2];
      for (let i = 0; i < 5; i++) xs.push(xs[i] - f(xs[i]) / fp(xs[i]));
      let n = 0;
      const ctl = document.createElement('div');
      ctl.className = 'gx-ctl buttons';
      ctl.innerHTML = '<button type="button" class="pill gx-next">Next step</button><button type="button" class="linkbtn gx-reset">Start over</button>';
      fig.querySelector('.gx-stage').after(ctl);
      function draw() {
        g.clear();
        for (let i = 0; i <= n && i < xs.length - 1; i++) {
          const a = xs[i];
          const active = i === n;
          g.line(a, 0, a, f(a), active ? 'gx-guide' : 'gx-guide old');
          if (i < n) g.line(a, f(a), xs[i + 1], 0, 'gx-sec old');
          else g.through(a, f(a), fp(a), 'gx-tan');
          g.dot(a, 0, active ? 'gx-dot solid' : 'gx-dot small', active ? 4.5 : 3);
        }
        const list = xs.slice(0, n + 1).map((v, i) => `x${sub(i + 1)} = ${i === 0 ? '2' : v.toFixed(7).replace(/0+$/, '')}`);
        read.innerHTML = list.join(' · ') + (n ? ` <span class="gx-soft">(√2 = 1.4142136)</span>` : '');
        ctl.querySelector('.gx-next').disabled = n >= 4;
      }
      ctl.querySelector('.gx-next').addEventListener('click', () => { if (n < 4) { n++; draw(); } });
      ctl.querySelector('.gx-reset').addEventListener('click', () => { n = 0; draw(); });
      draw();
    },
    // Taylor polynomials of sin x about 0
    taylor(fig) {
      const g = plot(fig.querySelector('.gx-stage'), { x0: -7.2, x1: 7.2, y0: -2.6, y1: 2.6 });
      g.grid(Math.PI, 1, false);
      for (const [x, t] of [[-2 * Math.PI, '−2π'], [-Math.PI, '−π'], [Math.PI, 'π'], [2 * Math.PI, '2π']]) g.fixedLabel(x, -2.6, t, 0, -5, 'middle');
      g.curve(Math.sin, 'gx-curve');
      const read = readout(fig);
      const fact = (k) => (k < 2 ? 1 : k * fact(k - 1));
      const sign = (k) => (((k - 1) / 2) % 2 ? -1 : 1); // sin x = x − x³/3! + x⁵/5! − …
      slider(fig, 'degree', 1, 11, 2, 3, (deg) => {
        g.clear();
        g.liveCurve((x) => { let s = 0; for (let k = 1; k <= deg; k += 2) s += (sign(k) * x ** k) / fact(k); return s; }, 'gx-approx', -7.2, 7.2);
        const terms = [];
        for (let k = 1; k <= deg; k += 2) terms.push(`${terms.length ? (sign(k) < 0 ? ' − ' : ' + ') : ''}${k === 1 ? 'x' : `x${sup(k)}/${k}!`}`);
        read.innerHTML = `P${sub(deg)}(x) = ${terms.join('')}`;
        return String(deg);
      });
    },
    // y′ = λy: the family y = Ce^(λx); the initial condition y(0) = y₀ picks the curve with C = y₀
    family(fig) {
      const g = plot(fig.querySelector('.gx-stage'), { x0: -2.2, x1: 2.2, y0: -4.4, y1: 4.4 });
      g.grid(1, 1);
      const read = readout(fig);
      let lam = 0.8, y0 = 1.5;
      const draw = () => {
        g.clear();
        for (let k = -6; k <= 6; k++) {
          const C = k / 2;
          if (Math.abs(C - y0) > 1e-9) g.liveCurve((x) => C * Math.exp(lam * x), 'gx-family');
        }
        g.liveCurve((x) => y0 * Math.exp(lam * x), 'gx-curve');
        g.dot(0, y0, 'gx-dot solid');
        g.label(0, y0, `(0, ${fix(y0)})`, 'gx-label', 7, y0 >= 0 ? 14 : -7);
        const ex = Math.abs(lam) < 0.005 ? '' : `e<sup>${fix(lam, 1)}x</sup>`;
        const lhs = Math.abs(lam) < 0.005 ? 'y′ = 0' : `y′ = ${fix(lam, 1)}y`;
        read.innerHTML = `${lhs} with y(0) = ${fix(y0)} gives <b>y = ${fix(y0)}${ex}</b>`;
      };
      // each slider is placed right under the graph, so the last one made sits on top
      slider(fig, 'λ', -1.5, 1.5, 0.1, lam, (v) => { lam = v; draw(); return fix(v, 1); });
      slider(fig, 'y(0)', -3, 3, 0.25, y0, (v) => { y0 = v; draw(); return fix(v); });
    },
    // y″ + ay′ + by = 0 from y(0) = 1, y′(0) = 0: the sign of Δ = a² − 4b decides the shape
    second(fig) {
      const g = plot(fig.querySelector('.gx-stage'), { x0: -1.6, x1: 12.5, y0: -1.3, y1: 1.3 });
      g.grid(2, 0.5);
      const read = readout(fig);
      const sg = (v) => (v < 0 ? ' − ' : ' + ') + fix(Math.abs(v));
      const ex = (r) => (Math.abs(r) < 0.005 ? '' : `e<sup>${fix(r)}x</sup>`);
      let a = 0.5, b = 1;
      const draw = () => {
        g.clear();
        let D = a * a - 4 * b;
        if (Math.abs(D) < 1e-9) D = 0;
        let f, env = null, roots, kind, gen;
        if (D > 0) {
          const s = Math.sqrt(D), r1 = (-a + s) / 2, r2 = (-a - s) / 2;
          const c1 = -r2 / (r1 - r2), c2 = r1 / (r1 - r2);
          f = (x) => c1 * Math.exp(r1 * x) + c2 * Math.exp(r2 * x);
          roots = `λ = ${fix(r1)}, ${fix(r2)}`;
          kind = 'Δ &gt; 0: two real roots, no oscillation';
          gen = `y = C₁${ex(r1)} + C₂${ex(r2)}`;
        } else if (D === 0) {
          const r = -a / 2;
          f = (x) => (1 - r * x) * Math.exp(r * x);
          roots = `λ = ${fix(r)} (repeated)`;
          kind = 'Δ = 0: one repeated root';
          gen = `y = (C₁ + C₂x)${ex(r)}`;
        } else {
          const al = -a / 2, be = Math.sqrt(-D) / 2, c2 = -al / be, A = Math.sqrt(1 + c2 * c2);
          f = (x) => Math.exp(al * x) * (Math.cos(be * x) + c2 * Math.sin(be * x));
          if (Math.abs(al) >= 0.005) env = (x) => A * Math.exp(al * x);
          roots = `λ = ${fix(al)} ± ${fix(be)}i`;
          kind = 'Δ &lt; 0: complex roots, it oscillates';
          gen = `y = ${ex(al)}${ex(al) ? '(' : ''}C₁cos ${fix(be)}x + C₂sin ${fix(be)}x${ex(al) ? ')' : ''}`;
        }
        if (env) { g.liveCurve(env, 'gx-env', 0, 12.5); g.liveCurve((x) => -env(x), 'gx-env', 0, 12.5); }
        g.liveCurve(f, 'gx-curve', 0, 12.5);
        g.dot(0, 1, 'gx-dot solid');
        read.innerHTML = `λ²${sg(a)}λ${sg(b)} = 0, Δ = ${fix(D)}<br>${roots}<br><b>${kind}</b><br>${gen}`;
      };
      slider(fig, 'b', 0.25, 4, 0.05, b, (v) => { b = v; draw(); return fix(v); });
      slider(fig, 'a', 0, 4, 0.05, a, (v) => { a = v; draw(); return fix(v); });
    },
  };
  function build(fig) {
    if (fig.dataset.drawn) return;
    fig.dataset.drawn = '1';
    try { WIDGETS[fig.dataset.graph](fig); } catch (e) { fig.querySelector('.gx-stage').textContent = ''; }
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); build(en.target); } });
    }, { rootMargin: '300px 0px' });
    figs.forEach((f) => io.observe(f));
    // before a jump to a section further down (page.js sends "buildgraphs" with it), draw every graph above it, so
    // the page doesn't grow under the glide and the jump lands on the section
    document.addEventListener('buildgraphs', (e) => {
      const target = e.detail;
      if (!target || !target.compareDocumentPosition) return;
      figs.forEach((f) => { if (!f.dataset.drawn && (f.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)) { io.unobserve(f); build(f); } });
    });
  } else {
    window.addEventListener('load', () => figs.forEach(build));
  }
})();
