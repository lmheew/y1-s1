// Figures for the Physics sheets: original line drawings (nothing is copied from the textbook or the course sheets),
// drawn as inline SVG that takes the page's colours, so they follow light and dark mode. Lines are ink; the subject
// colour (--green, a blue on the Physics pages) marks motion and the answer plots; forces are red (--warn) and
// accelerations amber. Text uses the page font, and variables use KaTeX's math italic, like the typeset formulas.
//
// A figure is referred to by its id: `fig: 'd1-41'` under a problem's stem, or `[[fig:d1-41a]]` as a block of its own
// in a solution. FIGS[id] gives { svg, cap, w }: the drawing, its caption ('' for none) and its natural width in px.
import { esc } from '../shared/build-lib.mjs';

const r1 = (n) => Math.round(n * 10) / 10;
const P = (x, y) => `${r1(x)},${r1(y)}`;
const rad = (d) => (d * Math.PI) / 180;
// a point at distance r from (cx, cy) in direction `deg`, measured counterclockwise from +x (SVG y grows downwards)
const at = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))];
const cls = (base, extra) => (extra ? `${base} ${extra}` : base);

const line = (x1, y1, x2, y2, c = '') => `<line class="${cls('ln', c)}" x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}"/>`;
const path = (d, c = '') => `<path class="${cls('ln', c)}" d="${d}"/>`;
const poly = (pts, c = '') => `<polyline class="${cls('ln', c)}" points="${pts.map(([x, y]) => P(x, y)).join(' ')}"/>`;
const shape = (pts, c = 'body') => `<polygon class="${c}" points="${pts.map(([x, y]) => P(x, y)).join(' ')}"/>`;
const circ = (cx, cy, r, c = 'ln') => `<circle class="${c}" cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}"/>`;
const dot = (cx, cy, c = 'pt') => circ(cx, cy, 3.6, c);

// an arrow from (x1, y1) to (x2, y2); kind: ink, frc (force), vel (velocity), acc (acceleration), soft
function arrow(x1, y1, x2, y2, kind = 'ink', { head = 9, wide = 4.2, c = '' } = {}) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const bx = x2 - ux * head, by = y2 - uy * head;
  const k = kind === 'ink' ? '' : kind;
  return line(x1, y1, bx + ux * 1.5, by + uy * 1.5, [k, c].filter(Boolean).join(' '))
    + `<polygon class="ah${k ? ' ' + k : ''}" points="${P(x2, y2)} ${P(bx - uy * wide, by + ux * wide)} ${P(bx + uy * wide, by - ux * wide)}"/>`;
}
const arrowAt = (x, y, len, deg, kind, o) => { const [x2, y2] = at(x, y, len, deg); return arrow(x, y, x2, y2, kind, o); };
// a double-headed dimension arrow with its label at the middle
function dim(x1, y1, x2, y2, label, { dx = 0, dy = 0, anchor = 'middle' } = {}) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return arrow(mx, my, x1, y1, 'soft', { head: 7, wide: 3.4, c: 'thin' }) + arrow(mx, my, x2, y2, 'soft', { head: 7, wide: 3.4, c: 'thin' })
    + T(mx + dx, my + dy, label, { anchor });
}
// an angle arc at (cx, cy) from direction a1 to a2 (degrees, counterclockwise from +x), with an optional label
function arc(cx, cy, r, a1, a2, label = '', { lr = r + 11, c = 'thin', dy = 4 } = {}) {
  const [xa, ya] = at(cx, cy, r, a1), [xb, yb] = at(cx, cy, r, a2);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0, sweep = a2 > a1 ? 0 : 1;
  const [lx, ly] = at(cx, cy, lr, (a1 + a2) / 2);
  return path(`M${P(xa, ya)}A${r1(r)},${r1(r)} 0 ${large} ${sweep} ${P(xb, yb)}`, c) + (label ? T(lx, ly + dy, label) : '');
}

// Text. `{v_0}` is a variable in math italic with an upright subscript, `{F}` a variable, `{=F}` a bold vector letter;
// everything else is plain text. Options: anchor (start, middle, end), c (extra classes: ts small, tb bold, frc, vel, acc).
function T(x, y, s, { anchor = 'middle', c = '' } = {}) {
  let out = '';
  for (const part of String(s).split(/(\{[^{}]+\})/)) {
    if (!part) continue;
    const m = part.match(/^\{(=?)([^_{}]+)(?:_([^{}]+))?\}$/);
    if (!m) { out += esc(part); continue; }
    out += `<tspan class="${m[1] ? 'vb' : 'm'}">${esc(m[2])}</tspan>`;
    if (m[3]) out += `<tspan class="sb" dy="4">${esc(m[3])}</tspan><tspan dy="-4">​</tspan>`;
  }
  return `<text class="${cls('t', c)}" x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor}">${out}</text>`;
}

// ground (or a table top) from x1 to x2 at height y, hatched below
function ground(x1, x2, y, { step = 9, depth = 7, up = false } = {}) {
  let h = '';
  for (let x = x1 + 4; x < x2; x += step) h += up ? line(x, y, x - depth, y - depth, 'thin soft') : line(x, y, x - depth, y + depth, 'thin soft');
  return line(x1, y, x2, y) + h;
}
// hatching under a sloped line from (x1, y1) to (x2, y2), on the side away from the objects resting on it
function slopeHatch(x1, y1, x2, y2, { step = 10, depth = 7 } = {}) {
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
  let h = '';
  const nx = -uy, ny = ux; // the side below the surface
  for (let s = 8; s < L - 2; s += step) {
    const px = x1 + ux * s, py = y1 + uy * s;
    h += line(px, py, px + depth * (0.75 * nx - 0.65 * ux), py + depth * (0.75 * ny - 0.65 * uy), 'thin soft');
  }
  return line(x1, y1, x2, y2) + h;
}
// a rectangle centred at (cx, cy), w by h, turned by deg (counterclockwise), with a label
function box(cx, cy, w, h, label = '', deg = 0, c = 'body') {
  const pts = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([x, y]) => {
    const a = rad(deg);
    return [cx + x * Math.cos(a) + y * Math.sin(a), cy - x * Math.sin(a) + y * Math.cos(a)];
  });
  return shape(pts, c) + (label ? T(cx, cy + 5, label) : '');
}
// a zigzag spring from (x1, y) to (x2, y)
function spring(x1, x2, y, { coils = 7, amp = 8 } = {}) {
  const pts = [[x1, y], [x1 + 6, y]];
  const span = x2 - x1 - 12;
  for (let i = 0; i < coils * 2; i++) pts.push([x1 + 6 + (span * (i + 0.5)) / (coils * 2), y + (i % 2 ? amp : -amp)]);
  pts.push([x2 - 6, y], [x2, y]);
  return poly(pts);
}
const vspring = (x, y1, y2, { coils = 6, amp = 8 } = {}) => {
  const pts = [[x, y1], [x, y1 + 5]];
  const span = y2 - y1 - 10;
  for (let i = 0; i < coils * 2; i++) pts.push([x + (i % 2 ? amp : -amp), y1 + 5 + (span * (i + 0.5)) / (coils * 2)]);
  pts.push([x, y2 - 5], [x, y2]);
  return poly(pts);
};
const pulley = (cx, cy, r = 11) => circ(cx, cy, r, 'body') + circ(cx, cy, 2.2, 'pt');

// ---------- graphs ----------
// A plot with dotted grid lines at each tick. lines: [{ pts: [[x, y], ...], c }] in data units; c: 'given' (thick
// ink), 'ans' (thick, subject colour), 'ln', 'dash'... dots: [[x, y]]; notes: [{ x, y, s, dx, dy, anchor, c }].
function plot({ w = 300, h = 210, xr = [0, 6], yr = [0, 5], xt = 1, yt = 1, xlab = '{t} [s]', ylab = '{a} [m/s²]',
  lines = [], dots = [], notes = [], grid = true, xnums = true, ynums = true, L = 40, R = 40, Tm = 26, B = 30 }) {
  const px = (x) => L + ((x - xr[0]) * (w - L - R)) / (xr[1] - xr[0]);
  const py = (y) => h - B - ((y - yr[0]) * (h - B - Tm)) / (yr[1] - yr[0]);
  let s = '';
  const ticks = (a, b, st) => { const out = []; for (let v = Math.ceil(a / st) * st; v <= b + 1e-9; v += st) out.push(r1(v * 1000) / 1000); return out; };
  const xs = ticks(xr[0], xr[1], xt), ys = ticks(yr[0], yr[1], yt);
  if (grid) {
    for (const x of xs) if (x !== 0) s += line(px(x), py(yr[0]), px(x), py(yr[1]), 'grid');
    for (const y of ys) if (y !== 0) s += line(px(xr[0]), py(y), px(xr[1]), py(y), 'grid');
  }
  const y0 = py(0), x0 = px(0);
  s += arrow(px(xr[0]) - (xr[0] === 0 ? 8 : 0), y0, px(xr[1]) + 18, y0, 'ink', { head: 8, wide: 3.8 });
  s += arrow(x0, py(yr[0]) + (yr[0] === 0 ? 8 : 0), x0, py(yr[1]) - 16, 'ink', { head: 8, wide: 3.8 });
  if (xnums) for (const x of xs) if (x !== 0) s += T(px(x), y0 + 16, String(x).replace('-', '−'), { c: 'ts' });
  if (ynums) for (const y of ys) if (y !== 0) s += T(x0 - 7, py(y) + 4, String(y).replace('-', '−'), { anchor: 'end', c: 'ts' });
  s += T(x0 - 7, y0 + 16, 'O', { anchor: 'end', c: 'ts' });
  s += T(px(xr[1]) + 20, y0 - 8, xlab, { anchor: 'end' });
  s += T(x0 + 8, py(yr[1]) - 8, ylab, { anchor: 'start' });
  for (const ln of lines) s += poly(ln.pts.map(([x, y]) => [px(x), py(y)]), ln.c || 'given');
  for (const [x, y, c] of dots) s += dot(px(x), py(y), c || 'pt');
  for (const n of notes) s += T(px(n.x) + (n.dx || 0), py(n.y) + (n.dy || 0), n.s, { anchor: n.anchor || 'middle', c: n.c || 'ts' });
  return { s, px, py };
}

// ---------- the figures ----------
const svg = (w, h, label, body) => `<svg class="pfig" viewBox="0 0 ${w} ${h}" style="max-width:${w}px" role="img" aria-label="${esc(label)}">${body}</svg>`;
const F = {};
const def = (id, w, h, label, cap, body) => { F[id] = { svg: svg(w, h, label, body), cap, w }; };

// ===== shared shapes used by several sheets =====
// a block on a table, a string over a pulley at the edge, and a hanging block
function tablePulley({ left = 'S', leftSub = '{M}', right = 'H', rightSub = '{m}', note = 'Frictionless surface', motion = true } = {}) {
  let s = '';
  s += line(20, 90, 272, 90) + line(272, 90, 272, 196);
  for (let x = 26; x < 272; x += 10) s += line(x, 90, x - 7, 97, 'thin soft');
  s += box(118, 70, 60, 40, '');
  s += T(118, 66, left, { c: 'tb' }) + T(118, 82, leftSub, { c: 'ts' });
  s += line(148, 70, 284, 70, 'str');
  s += pulley(284, 81) + line(284, 81, 272, 94, 'thin');
  s += line(295, 81, 295, 150, 'str');
  s += box(295, 170, 34, 40, '');
  s += T(295, 166, right, { c: 'tb' }) + T(295, 182, rightSub, { c: 'ts' });
  if (note) s += T(28, 114, note, { anchor: 'start', c: 'ts' });
  if (motion) s += arrow(98, 36, 146, 36, 'acc') + T(160, 40, '{a}', { anchor: 'start', c: 'acc' }) + arrow(328, 150, 328, 196, 'acc') + T(334, 182, '{a}', { anchor: 'start', c: 'acc' });
  return s;
}

// ===== Exercise Day 1 =====
{
  const g = plot({ w: 300, h: 220, xr: [0, 6], yr: [0, 5], ylab: '{a} [m/s²]', lines: [
    { pts: [[0, 1], [2, 1]] }, { pts: [[2, 4], [4, 4]] }, { pts: [[4, 0], [6, 0]] }] });
  def('d1-41', 300, 220, 'Graph of acceleration a in metres per second squared against time t in seconds: a = 1 from 0 to 2 s, a = 4 from 2 to 4 s, a = 0 from 4 to 6 s', 'Figure 4-1', g.s);
}
{
  const g = plot({ w: 300, h: 220, xr: [0, 6], yr: [0, 5], ylab: '{v} [m/s]', lines: [{ pts: [[0, 5], [2, 1], [4, 1], [6, 2]] }] });
  def('d1-42', 300, 220, 'Graph of velocity v in metres per second against time t in seconds: a straight line from 5 at t = 0 down to 1 at t = 2 s, level at 1 until 4 s, then a straight line up to 2 at 6 s', 'Figure 4-2', g.s);
}
{
  const g = plot({ w: 300, h: 240, xr: [0, 6], yr: [0, 10], yt: 2, ylab: '{v} [m/s]', lines: [{ pts: [[0, 0], [2, 2], [4, 10], [6, 10]], c: 'ans' }],
    dots: [[2, 2], [4, 10], [6, 10]], notes: [{ x: 2, y: 2, s: '(2, 2)', dx: 8, dy: 4, anchor: 'start' }, { x: 4, y: 10, s: '(4, 10)', dx: 0, dy: -9 }] });
  def('d1-41a', 300, 240, 'Answer: velocity against time, straight segments from (0, 0) to (2, 2), then to (4, 10), then level at 10 m/s until 6 s', 'Answer to 4-1: the v–t plot', g.s);
}
{
  const g = plot({ w: 300, h: 230, xr: [0, 6], yr: [-2, 1], yt: 0.5, ylab: '{a} [m/s²]', lines: [
    { pts: [[0, -2], [2, -2]], c: 'ans' }, { pts: [[2, 0], [4, 0]], c: 'ans' }, { pts: [[4, 0.5], [6, 0.5]], c: 'ans' }] });
  def('d1-42a', 300, 230, 'Answer: acceleration against time, −2 from 0 to 2 s, 0 from 2 to 4 s, 0.5 from 4 to 6 s', 'Answer to 4-2: the a–t plot', g.s);
}
{ // the three pulls of Problem 5, seen from above, for 5-1 (Charles at 135°) with 5-2's direction dashed
  const cx = 150, cy = 108;
  let s = circ(cx, cy, 13, 'body');
  s += arrowAt(cx + 13, cy, 92, 0, 'frc') + T(cx + 112, cy + 5, '{F_B}', { anchor: 'start', c: 'frc' });
  const [ax, ay] = at(cx, cy, 13, -150); s += arrowAt(ax, ay, 100, -150, 'frc');
  const [alx, aly] = at(cx, cy, 128, -150); s += T(alx - 4, aly + 14, '√2 {F}', { c: 'frc' });
  const [c1x, c1y] = at(cx, cy, 13, 135); s += arrowAt(c1x, c1y, 72, 135, 'frc');
  const [l1x, l1y] = at(cx, cy, 98, 135); s += T(l1x, l1y, '{F} (5-1)', { c: 'frc' });
  const [c2x, c2y] = at(cx, cy, 13, 45); s += arrowAt(c2x, c2y, 72, 45, 'soft', { c: 'dash' });
  const [l2x, l2y] = at(cx, cy, 100, 45); s += T(l2x + 4, l2y, '{F} (5-2)', { c: 'ts' });
  s += line(cx - 120, cy, cx - 16, cy, 'thin dot') + arc(cx, cy, 34, -180, -150, '30°', { lr: 50 });
  def('d1-5', 300, 210, 'Top view of the tire with the three pulls: Betty along +x, Alex √2F at 150° clockwise from it, Charles F at 135° (5-1) or 45° (5-2)', 'The pulls, seen from above', s);
}
{ // Problem 6: a ball thrown at a target (d, h)
  const O = [40, 196], sx = 2.1, sy = 2.1, d = 100, hgt = 52;
  const X = (x) => O[0] + x * sx, Y = (y) => O[1] - y * sy;
  let s = arrow(O[0] - 10, O[1], 290, O[1], 'ink', { head: 8 }) + arrow(O[0], O[1] + 10, O[0], 20, 'ink', { head: 8 });
  s += T(286, O[1] + 18, '{x}', { anchor: 'end' }) + T(O[0] - 10, 30, '{y}', { anchor: 'end' }) + T(O[0] - 8, O[1] + 16, 'O', { anchor: 'end', c: 'ts' });
  const th = 58, t2 = Math.tan(rad(th));
  const k = (d * t2 - hgt) / (d * d); // y = x tanθ − k x² passes through (d, h)
  const pts = []; for (let x = 0; x <= d + 1e-9; x += 2.5) pts.push([X(x), Y(x * t2 - k * x * x)]);
  s += poly(pts, 'vel dash');
  s += line(X(d), Y(hgt), X(d), O[1], 'thin dot') + line(O[0], Y(hgt), X(d), Y(hgt), 'thin dot');
  s += circ(X(d), Y(hgt), 7, 'ln') + circ(X(d), Y(hgt), 2.6, 'pt');
  s += T(X(d) + 12, Y(hgt) - 8, '({d}, {h})', { anchor: 'start' });
  s += T(X(d), O[1] + 17, '{d}', { c: 'ts' }) + T(O[0] - 9, Y(hgt) + 4, '{h}', { anchor: 'end', c: 'ts' });
  s += arrowAt(O[0], O[1], 58, th, 'vel') + T(O[0] + 30, O[1] - 64, '{v_0}', { c: 'vel' }) + arc(O[0], O[1], 26, 0, th, '{θ_0}', { lr: 40 });
  def('d1-6', 300, 220, 'A ball thrown from the origin at speed v0 and angle θ0 follows a curved path to a small target at (d, h)', 'Sketch', s);
}
{ // Problem 7: launch at 60° from O, landing at P
  const O = [40, 150];
  let s = ground(20, 300, O[1]) + arrow(O[0], O[1] + 12, O[0], 18, 'ink', { head: 8 }) + T(O[0] - 8, 28, '{y}', { anchor: 'end' });
  const R = 200, H = R * Math.tan(rad(60)) / 4 * 0.62;
  const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([O[0] + u * R, O[1] - 4 * H * u * (1 - u)]); }
  s += poly(pts, 'vel');
  s += arrowAt(O[0], O[1], 46, 60, 'vel', { head: 8 }) + T(O[0] + 30, O[1] - 46, '{v_0}', { anchor: 'start', c: 'vel' }) + arc(O[0], O[1], 22, 0, 60, '{θ_0}', { lr: 36 });
  s += circ(O[0], O[1], 5, 'body') + T(O[0] - 8, O[1] + 18, 'O', { anchor: 'end' });
  s += dot(O[0] + R, O[1]) + T(O[0] + R + 2, O[1] - 10, 'P');
  def('d1-7', 320, 175, 'A projectile launched from the origin O at angle θ0 above the ground lands at point P at the same height', 'Figure 7', s);
}

// ===== Exercise Day 2 =====
{ // 1.1: average and instantaneous velocity on an x–t plot
  const xf = (t) => 0.7 + 0.12 * t * t, dxf = (t) => 0.24 * t;
  const g = plot({ w: 300, h: 220, xr: [0, 6], yr: [0, 5], xnums: false, ynums: false, grid: false, ylab: '{x}', xlab: '{t}',
    lines: [{ pts: Array.from({ length: 56 }, (_, i) => { const t = 0.3 + i * 0.1; return [t, xf(t)]; }), c: 'given' }] });
  const t1 = 1.2, t2 = 5, m = (xf(t2) - xf(t1)) / (t2 - t1), mt = dxf(t1);
  let s = g.s;
  s += poly([[g.px(t1 - 0.9), g.py(xf(t1) - 0.9 * m)], [g.px(t2 + 0.5), g.py(xf(t2) + 0.5 * m)]], 'vel');
  s += poly([[g.px(0.2), g.py(xf(t1) - (t1 - 0.2) * mt)], [g.px(4.6), g.py(xf(t1) + (4.6 - t1) * mt)]], 'acc dash');
  s += dot(g.px(t1), g.py(xf(t1))) + dot(g.px(t2), g.py(xf(t2)));
  s += T(g.px(t1) + 2, g.py(xf(t1)) + 22, '({t_1}, {x_1})', { c: 'ts' }) + T(g.px(t2) - 8, g.py(xf(t2)) + 4, '({t_2}, {x_2})', { anchor: 'end', c: 'ts' });
  s += T(g.px(1.0), g.py(4.4), 'secant: slope = {v_avg}', { anchor: 'start', c: 'ts vel-t' });
  s += T(g.px(5.9), g.py(0.95), 'tangent: slope = {v}({t_1})', { anchor: 'end', c: 'ts acc-t' });
  def('d2-11', 300, 220, 'A curved position–time graph. The secant through two points has the average velocity as its slope; the dashed tangent at the first point has the instantaneous velocity there as its slope', 'Secant and tangent on an x–t plot', s);
}
def('d2-12', 360, 205, 'Block S of mass M on a horizontal frictionless table, tied by a string over a pulley at the table edge to block H of mass m hanging below', 'Figure for Problem 1.2', tablePulley());
{ // 1.4: the vector r to the point (x, y)
  const O = [50, 160], X = 230, Y = 52;
  let s = arrow(O[0] - 12, O[1], 300, O[1], 'ink', { head: 8 }) + arrow(O[0], O[1] + 12, O[0], 24, 'ink', { head: 8 });
  s += T(296, O[1] + 18, '{x}', { anchor: 'end' }) + T(O[0] - 10, 34, '{y}', { anchor: 'end' });
  s += line(X, Y, X, O[1], 'thin dot') + line(O[0], Y, X, Y, 'thin dot');
  s += arrow(O[0], O[1], X, Y, 'vel') + dot(X, Y);
  s += T(X, O[1] + 18, '{x}', { c: 'ts' }) + T(O[0] - 9, Y + 4, '{y}', { anchor: 'end', c: 'ts' });
  s += T(X + 10, Y - 10, '{=r} = [{x}  {y}]', { anchor: 'start', c: 'vel-t' });
  def('d2-14', 330, 185, 'The vector r from the origin to the point with coordinates x and y', 'Figure for Problem 1.4', s);
}
{ // 1-5: a block pushed by a horizontal force
  let s = ground(30, 300, 140) + box(130, 115, 64, 50, '{m}') + arrow(162, 115, 232, 115, 'frc') + T(240, 120, '{F}', { anchor: 'start', c: 'frc' });
  def('d2-15', 320, 160, 'A block of mass m on a floor, pushed to the right by a horizontal force F', 'Figure 1-5', s);
}
{ // 6: uniform circular motion, the particle at angle θ
  const C = [150, 150], r = 95, th = 52;
  const [px, py] = at(C[0], C[1], r, th);
  let s = arrow(30, C[1], 280, C[1], 'ink', { head: 8 }) + arrow(C[0], 262, C[0], 22, 'ink', { head: 8 });
  s += T(276, C[1] + 18, '{x}', { anchor: 'end' }) + T(C[0] - 9, 32, '{y}', { anchor: 'end' });
  s += circ(C[0], C[1], r, 'ln soft-c');
  s += line(C[0], C[1], px, py, 'vel-l') + T((C[0] + px) / 2 - 10, (C[1] + py) / 2 - 2, '{r}', { anchor: 'end' });
  s += line(px, py, px, C[1], 'thin dot') + T(px + 6, (py + C[1]) / 2 + 12, '{y_p}', { anchor: 'start', c: 'ts' });
  s += T((C[0] + px) / 2, C[1] + 17, '{x_p}', { c: 'ts' });
  s += arc(C[0], C[1], 24, 0, th, '{θ}', { lr: 36 });
  s += arrowAt(px, py, 66, th + 90, 'vel') + T(px - 52, py - 52, '{=v}', { c: 'vel-t' });
  s += line(px, py, px, py - 64, 'thin dot') + arc(px, py, 30, 90, 90 + th, '{θ}', { lr: 42, dy: 2 });
  s += dot(px, py) + T(px + 10, py - 4, '{p}', { anchor: 'start' });
  def('d2-6', 300, 275, 'A circle of radius r centred at the origin. The particle p sits at angle θ from the x-axis, at coordinates xp and yp, and its velocity v is tangent to the circle, at angle θ from the vertical', 'Figure 6', s);
}
{ // 7: a banked curve, in cross-section
  const A = [40, 175], th = 22, Lr = 240;
  const [Bx, By] = at(A[0], A[1], Lr, th);
  let s = slopeHatch(A[0], A[1], Bx, By) + line(A[0], A[1], Bx + 10, A[1], 'thin dot') + arc(A[0], A[1], 40, 0, th, '{θ}', { lr: 54 });
  const [cx, cy] = at(A[0], A[1], 150, th);
  const [nx, ny] = at(cx, cy, 15, th + 90);
  s += box(nx, ny, 58, 26, '{M}', th);
  s += arrow(118, 70, 40, 70, 'acc') + T(80, 60, 'to the centre ({R})', { c: 'ts' });
  s += T(nx + 18, ny - 30, 'speed {v}, into the page', { anchor: 'start', c: 'ts' });
  def('d2-7', 330, 200, 'Cross-section of a banked track at angle θ, with a car of mass M on it; the centre of the circular track, radius R, is to the left', 'Figure 7 (cross-section)', s);
}
{ // 7-2: free-body diagram of the car, drawn as a point on the banked surface
  const C = [150, 140], th = 24;
  let s = line(...at(C[0], C[1], 120, 180 + th), ...at(C[0], C[1], 110, th), 'thin soft') + dot(C[0], C[1]);
  s += arrowAt(C[0], C[1], 104, 90 + th, 'frc') + (() => { const [x, y] = at(C[0], C[1], 116, 90 + th); return T(x - 2, y, '{N}', { anchor: 'end', c: 'frc' }); })();
  s += arrowAt(C[0], C[1], 86, 270, 'frc') + T(C[0] + 10, C[1] + 82, '{M}{g}', { anchor: 'start', c: 'frc' });
  s += line(C[0], C[1], C[0], C[1] - 112, 'thin dot') + arc(C[0], C[1], 50, 90, 90 + th, '{θ}', { lr: 62 });
  const [nx, ny] = at(C[0], C[1], 104, 90 + th);
  s += arrow(C[0], C[1], nx, C[1], 'soft', { c: 'thin dash', head: 7, wide: 3.4 }) + arrow(C[0], C[1], C[0], ny, 'soft', { c: 'thin dash', head: 7, wide: 3.4 });
  s += T(C[0] + 8, ny + 12, '{N} cos {θ}', { anchor: 'start', c: 'ts' }) + T(nx - 6, C[1] + 5, '{N} sin {θ}', { anchor: 'end', c: 'ts' });
  s += arrow(78, 246, 30, 246, 'acc', { head: 7 }) + T(84, 250, 'toward the centre', { anchor: 'start', c: 'ts' }) + T(258, 112, 'track', { c: 'ts' });
  def('d2-72', 300, 262, 'Free-body diagram of the car: the normal force N tilted by θ from the vertical toward the centre, and the weight Mg straight down', 'Answer to 7-2: free-body diagram', s);
}
{ // 8: the hemispherical mound
  const O = [160, 200], R = 130, th = 26, th1 = 48;
  let s = ground(10, 310, O[1]) + path(`M${P(O[0] - R, O[1])}A${R},${R} 0 0 1 ${P(O[0] + R, O[1])}`);
  s += dot(O[0], O[1]) + T(O[0], O[1] + 17, 'O', { c: 'ts' });
  const [ax, ay] = at(O[0], O[1], R, 90), [bx, by] = at(O[0], O[1], R, 90 - th), [cx, cy] = at(O[0], O[1], R, 90 - th1);
  s += line(O[0], O[1], ax, ay, 'thin dot') + line(O[0], O[1], bx, by, 'thin dot') + line(O[0], O[1], cx, cy, 'thin dot');
  const ball = (x, y, deg) => { const [qx, qy] = at(x, y, 7, deg); return circ(qx, qy, 7, 'body'); };
  s += ball(ax, ay, 90) + ball(bx, by, 90 - th) + ball(cx, cy, 90 - th1);
  s += T(ax - 14, ay - 4, 'A', { anchor: 'end' }) + T(bx + 6, by - 14, 'B', { anchor: 'start' });
  s += arrow(ax - 6, ay - 26, ax + 34, ay - 26, 'vel', { head: 7 }) + T(ax + 40, ay - 22, '{v_0}', { anchor: 'start', c: 'vel-t' });
  s += arc(O[0], O[1], 46, 90, 90 - th, '{θ}', { lr: 58 }) + arc(O[0], O[1], 78, 90, 90 - th1, '', {}) + (() => { const [lx, ly] = at(O[0], O[1], 96, 33); return T(lx, ly + 6, '{θ_1}', { anchor: 'start' }); })();
  s += T(O[0] - 60, O[1] - 18, '{R}', { c: 'ts' }) + line(O[0] - R, O[1] - 6, O[0], O[1] - 6, 'thin dot');
  def('d2-8', 320, 222, 'A hemispherical mound of radius R centred at O. The ball starts at the top A with speed v0, passes B at angle θ from the vertical, and leaves the surface at angle θ1', 'Figure 8', s);
}
{ // 8-2: free-body diagram at B
  const O = [96, 220], R = 150, th = 34;
  let s = path(`M${P(...at(O[0], O[1], R, 90 + 6))}A${R},${R} 0 0 1 ${P(...at(O[0], O[1], R, 90 - th - 20))}`, 'soft-c');
  const [bx, by] = at(O[0], O[1], R + 8, 90 - th);
  s += line(O[0], O[1], bx, by, 'thin dot') + dot(O[0], O[1]) + T(O[0] - 6, O[1] + 4, 'O', { anchor: 'end', c: 'ts' });
  s += arc(O[0], O[1], 40, 90, 90 - th, '{θ}', { lr: 52 }) + line(O[0], O[1], O[0], O[1] - 70, 'thin dot');
  s += circ(bx, by, 8, 'body');
  s += arrowAt(bx, by, 64, 90 - th, 'frc') + (() => { const [lx, ly] = at(bx, by, 74, 90 - th); return T(lx + 4, ly + 2, '{N}', { anchor: 'start', c: 'frc' }); })();
  s += arrowAt(bx, by, 86, 270, 'frc') + T(bx + 8, by + 84, '{m}{g}', { anchor: 'start', c: 'frc' });
  const [tx, ty] = at(bx, by, 86 * Math.cos(rad(th)), 270 - th);
  s += arrow(bx, by, tx, ty, 'soft', { c: 'thin dash', head: 7, wide: 3.4 });
  const [mx, my] = at((bx + tx) / 2, (by + ty) / 2, 12, 180 - th);
  s += T(mx - 4, my + 16, '{m}{g} cos {θ}', { anchor: 'end', c: 'ts' });
  def('d2-82', 320, 262, 'Free-body diagram of the ball at B: the normal force N along the radius, pointing away from the centre O, and the weight mg straight down; mg cos θ is the part of the weight toward the centre', 'Answer to 8-2: free-body diagram at B', s);
}
{ // 9: the house, p1 on the roof edge and p2 at the origin
  const O = [44, 196], H = 120;
  let s = ground(14, 330, O[1]);
  s += arrow(O[0], O[1] + 10, O[0], 40, 'ink', { head: 8 }) + T(O[0] - 9, 50, '{y}', { anchor: 'end' }) + T(326, O[1] - 8, '{x}', { anchor: 'end' });
  s += `<rect class="house" x="${O[0] + H}" y="${O[1] - H}" width="120" height="${H}"/>`;
  s += line(O[0] + H, O[1] - H, O[0] + H, O[1], 'wall');
  s += `<rect class="body" x="${O[0] + H + 22}" y="${O[1] - H + 22}" width="22" height="22"/><rect class="body" x="${O[0] + H + 78}" y="${O[1] - H + 22}" width="22" height="22"/><rect class="body" x="${O[0] + H + 50}" y="${O[1] - 52}" width="22" height="52"/>`;
  s += circ(O[0] + H, O[1] - H, 6, 'body p1') + T(O[0] + H - 4, O[1] - H - 12, 'p1', { anchor: 'middle', c: 'tb' });
  s += circ(O[0], O[1], 6, 'body') + T(O[0] - 10, O[1] + 18, 'O', { anchor: 'end', c: 'ts' }) + T(O[0] + 10, O[1] - 8, 'p2', { anchor: 'start', c: 'tb ts' });
  s += arrowAt(O[0], O[1], 64, 60, 'vel') + T(O[0] + 40, O[1] - 66, '{v_0}', { anchor: 'start', c: 'vel-t' });
  s += dim(O[0] + 8, O[1] + 16, O[0] + H, O[1] + 16, '{H}', { dy: 16 });
  s += dim(O[0] + H - 12, O[1] - H, O[0] + H - 12, O[1] - 2, '{H}', { dx: -10, anchor: 'end' });
  def('d2-9', 340, 238, 'The origin O is on the ground a distance H from the house. Particle p1 sits on the edge of the roof at height H, above the near wall (red). Particle p2 is thrown from O with speed v0', 'Figure 9', s);
}
{ // 4-4: forces on the block climbing the slope, the push tilted by φ from the slope's normal
  const A = [30, 205], th = 28, Lr = 280;
  const [Bx, By] = at(A[0], A[1], Lr, th);
  let s = slopeHatch(A[0], A[1], Bx, By) + line(A[0], A[1], A[0] + 120, A[1], 'thin dot') + arc(A[0], A[1], 46, 0, th, '{θ}', { lr: 60 });
  const [cx0, cy0] = at(A[0], A[1], 150, th);
  const [cx, cy] = at(cx0, cy0, 17, th + 90);
  s += box(cx, cy, 44, 34, '', th) + dot(cx, cy);
  const phi = 38, inward = th - 90;
  const dirP = inward + phi; // the push points this way
  const [tx, ty] = at(cx, cy, 92, dirP + 180);
  s += arrow(tx, ty, ...at(cx, cy, 20, dirP + 180), 'frc') + T(tx - 6, ty - 6, '{P}', { anchor: 'end', c: 'frc' });
  const [nx, ny] = at(cx, cy, 96, th + 90);
  s += line(cx, cy, nx, ny, 'thin dot');
  s += arc(cx, cy, 58, th + 90, dirP + 180, '{φ}', { lr: 70, dy: 4 });
  s += arrowAt(cx, cy, 62, th, 'acc') + (() => { const [lx, ly] = at(...at(cx, cy, 66, th), 16, th + 90); return T(lx, ly, 'up the slope', { anchor: 'start', c: 'ts acc-t' }); })();
  s += arrowAt(cx, cy, 64, 270, 'frc') + T(cx + 6, cy + 66, '{m}{g}', { anchor: 'start', c: 'frc' });
  def('d2-44', 330, 230, 'A block on a slope rising to the right at angle θ. The push P is tilted by φ from the slope’s normal toward up the slope; the weight mg acts straight down', 'The push of 4-4, tilted by φ', s);
}

// ===== Exercise Day 3 =====
// A review sheet: its problems are Days 1 and 2's under new numbers. Day 1's figures keep their numbers there; Day 2's
// are the same drawings, captioned with the numbers the Day 3 sheet gives them.
const again = (id, from, cap) => { if (!F[from]) throw new Error(`unknown figure "${from}"`); F[id] = { ...F[from], cap }; };
again('d3-82', 'd2-12', 'Figure for Problem 8.2');
again('d3-84', 'd2-14', 'Figure for Problem 8.4');
again('d3-114', 'd2-44', 'The push of 11-4, tilted by φ');
again('d3-13', 'd2-7', 'Figure 13 (cross-section)');
again('d3-132', 'd2-72', 'Answer to 13-2: free-body diagram');
again('d3-14', 'd2-15', 'Figure 14');
again('d3-15', 'd2-6', 'Figure 15');
again('d3-16', 'd2-8', 'Figure 16');
again('d3-162', 'd2-82', 'Answer to 16-2: free-body diagram at B');
again('d3-17', 'd2-9', 'Figure 17');

// ===== Practice Set A =====
{
  const g = plot({ w: 300, h: 230, xr: [0, 8], yr: [-2, 3], ylab: '{a} [m/s²]', lines: [
    { pts: [[0, 3], [2, 3]] }, { pts: [[2, 0], [5, 0]] }, { pts: [[5, -2], [8, -2]] }] });
  def('a-41', 300, 230, 'Graph of acceleration against time: 3 m/s² from 0 to 2 s, 0 from 2 to 5 s, −2 m/s² from 5 to 8 s', 'Figure A4-1', g.s);
}
{
  const g = plot({ w: 300, h: 240, xr: [0, 8], yr: [-2, 4], ylab: '{v} [m/s]', lines: [{ pts: [[0, -2], [2, 4], [5, 4], [8, -2]], c: 'ans' }],
    dots: [[0, -2], [2, 4], [5, 4], [8, -2], [2 / 3, 0], [7, 0]] });
  def('a-41a', 300, 240, 'Answer: velocity against time, straight segments from (0, −2) to (2, 4), level to (5, 4), then down to (8, −2); it crosses zero at t = 2/3 s and t = 7 s', 'Answer to A4-1: the v–t plot', g.s);
}
{
  const g = plot({ w: 300, h: 220, xr: [0, 7], yr: [0, 6], ylab: '{v} [m/s]', lines: [{ pts: [[0, 0], [3, 6], [4, 6], [6, 0]] }] });
  def('a-44', 300, 220, 'Graph of velocity against time: a straight line from 0 up to 6 m/s at t = 3 s, level until 4 s, then a straight line down to 0 at 6 s', 'Figure A4-2', g.s);
}
{
  const g = plot({ w: 300, h: 230, xr: [0, 6], yr: [-3, 2], ylab: '{a} [m/s²]', lines: [
    { pts: [[0, 2], [3, 2]], c: 'ans' }, { pts: [[3, 0], [4, 0]], c: 'ans' }, { pts: [[4, -3], [6, -3]], c: 'ans' }] });
  def('a-44a', 300, 230, 'Answer: acceleration against time, 2 from 0 to 3 s, 0 from 3 to 4 s, −3 from 4 to 6 s', 'Answer to A4-4: the a–t plot', g.s);
}
{ // A5: a lamp hanging from two strings
  const K = [150, 120];
  let s = ground(20, 290, 40, { up: true });
  const [l1x] = [K[0] - 80 / Math.tan(rad(30))], [r1x] = [K[0] + 80 / Math.tan(rad(60))];
  s += line(l1x, 40, K[0], K[1], 'str') + line(r1x, 40, K[0], K[1], 'str') + line(K[0], K[1], K[0], 160, 'str');
  s += arc(l1x, 40, 30, -30, 0, '30°', { lr: 44, dy: 10 }) + arc(r1x, 40, 30, 180, 240, '60°', { lr: 44, dy: 10 });
  s += T((l1x + K[0]) / 2 - 6, (40 + K[1]) / 2 + 18, 'string 1', { anchor: 'end', c: 'ts' }) + T((r1x + K[0]) / 2 + 8, (40 + K[1]) / 2 + 16, 'string 2', { anchor: 'start', c: 'ts' });
  s += dot(K[0], K[1]) + path(`M${K[0] - 20},178 Q${K[0]},150 ${K[0] + 20},178 Z`, 'body-ln') + T(K[0] + 28, 176, '{W}', { anchor: 'start' });
  def('a-5', 300, 195, 'A lamp of weight W hangs from a knot held by string 1 at 30° to the ceiling on the left and string 2 at 60° to the ceiling on the right', 'Figure A5', s);
}
{ // A6: thrown from a cliff
  const O = [44, 210], h = 52, sx = 1.0;
  let s = ground(14, 330, O[1]) + `<rect class="house" x="14" y="${O[1] - h}" width="${O[0] - 14}" height="${h}"/>`;
  s += dim(O[0] + 10, O[1] - h, O[0] + 10, O[1], '{h}', { dx: 8, anchor: 'start' });
  const v0x = Math.sqrt(3), v0y = 1; // in units of √(gh); time in √(h/g); distances in h
  const tf = 1 + Math.sqrt(3), scale = h; const pts = [];
  for (let i = 0; i <= 50; i++) { const t = (tf * i) / 50; pts.push([O[0] + v0x * t * scale * sx, O[1] - h - (v0y * t - 0.5 * t * t) * scale]); }
  s += poly(pts, 'vel dash');
  s += arrowAt(O[0], O[1] - h, 54, 30, 'vel') + T(O[0] + 40, O[1] - h - 36, '{v_0}', { anchor: 'start', c: 'vel-t' }) + arc(O[0], O[1] - h, 26, 0, 30, '', { c: 'thin' }) + T(O[0] + 50, O[1] - h - 4, '30°', { anchor: 'start', c: 'ts' });
  s += line(O[0], O[1] - h, O[0] + 60, O[1] - h, 'thin dot');
  s += T(O[0] - 4, O[1] + 18, 'O', { anchor: 'end', c: 'ts' }) + T(326, O[1] - 8, '{x}', { anchor: 'end' });
  def('a-6', 340, 230, 'A ball thrown at 30° above the horizontal from the top edge of a cliff of height h, landing on the ground below; the origin O is at the foot of the cliff', 'Figure A6', s);
}
{ // A7: incline with a pulley at the top and a hanging block
  const A = [24, 200], th = 30, Lr = 230;
  const [Bx, By] = at(A[0], A[1], Lr, th);
  let s = slopeHatch(A[0], A[1], Bx, By) + line(A[0], A[1], Bx, A[1]) + line(Bx, By, Bx, A[1]) + arc(A[0], A[1], 40, 0, th, '{θ}', { lr: 54 });
  const [cx0, cy0] = at(A[0], A[1], 120, th), [cx, cy] = at(cx0, cy0, 15, th + 90);
  s += box(cx, cy, 46, 30, '', th) + T(cx, cy + 5, 'A');
  const pr = 13, [qx, qy] = at(Bx, By, 15, th + 90 - 40);
  s += pulley(qx, qy, pr) + line(Bx, By, qx, qy, 'thin');
  const [sx0, sy0] = at(cx, cy, 23, th);
  const [tx, ty] = at(qx, qy, pr, th + 90);
  s += line(sx0, sy0, tx, ty, 'str');
  s += line(qx + pr, qy, qx + pr, 122, 'str') + box(qx + pr, 141, 26, 38, 'B');
  s += T(cx - 8, cy - 26, '{M}', { c: 'ts' }) + T(qx + pr + 20, 145, '{m}', { anchor: 'start', c: 'ts' });
  def('a-7', 300, 215, 'Block A of mass M on a slope at angle θ, tied by a string running up the slope over a pulley at the top to block B of mass m hanging beside the slope', 'Figure A7', s);
}
{ // A8: conical pendulum
  const Pv = [150, 30], L = 150, th = 34;
  const [bx, by] = at(Pv[0], Pv[1], L, 270 + th);
  let s = ground(100, 200, Pv[1], { up: true }) + line(Pv[0], Pv[1], bx, by, 'str') + line(Pv[0], Pv[1], Pv[0], by + 10, 'thin dot');
  s += `<ellipse class="ln vel dash" cx="${Pv[0]}" cy="${r1(by)}" rx="${r1(bx - Pv[0])}" ry="16"/>`;
  s += circ(bx, by, 9, 'body') + line(Pv[0], by, bx - 9, by, 'thin dot') + T((Pv[0] + bx) / 2, by + 30, '{r}', { c: 'ts' });
  s += arc(Pv[0], Pv[1], 40, 270, 270 + th, '{θ}', { lr: 52, dy: 8 }) + T((Pv[0] + bx) / 2 + 12, (Pv[1] + by) / 2 - 4, '{L}', { anchor: 'start' });
  s += T(bx + 16, by + 4, '{m}', { anchor: 'start' });
  def('a-8', 300, 230, 'A conical pendulum: a ball of mass m on a string of length L, at angle θ from the vertical, moving in a horizontal circle of radius r', 'Figure A8', s);
}
{ // A9: spring, rough strip, ramp
  const y = 150;
  let s = line(20, 60, 20, y) + ground(20, 236, y);
  for (let yy = 66; yy < y; yy += 10) s += line(20, yy, 13, yy + 7, 'thin soft');
  s += spring(20, 78, y - 18, { coils: 6, amp: 9 }) + box(98, y - 18, 40, 36, '{m}');
  s += `<rect class="strip" x="132" y="${y - 3}" width="70" height="6"/>` + dim(132, y + 16, 202, y + 16, '{L}', { dy: 16 }) + T(167, y - 12, 'rough ({μ_k})', { c: 'ts' });
  s += path(`M236,${y} Q290,${y} 310,${y - 70}`) + T(304, y - 70, 'frictionless', { anchor: 'end', c: 'ts' });
  s += T(48, y + 20, 'spring ({k})', { c: 'ts' });
  def('a-9', 320, 192, 'A block of mass m pressed against a spring of constant k on a floor; ahead of it a rough strip of length L, then a frictionless ramp curving upward', 'Figure A9', s);
}
{
  const xs = Array.from({ length: 61 }, (_, i) => i * 0.05);
  // the x numbers are placed by hand: the curve crosses the axis just before x = 2, so that one sits left of its tick
  const g = plot({ w: 300, h: 290, xr: [0, 3], yr: [-12, 6], xt: 1, yt: 3, xlab: '{x} [m]', ylab: '{F} [N]', xnums: false,
    lines: [{ pts: xs.map((x) => [x, 3 + 4 * x - 3 * x * x]), c: 'given' }],
    notes: [{ x: 1, y: 0, s: '1', dy: 16 }, { x: 2, y: 0, s: '2', dx: -11, dy: 16 }, { x: 3, y: 0, s: '3', dy: 16 }] });
  def('a-10', 300, 290, 'Graph of the force F = 3 + 4x − 3x² newtons against x from 0 to 3 metres: 3 N at x = 0, a top of about 4.3 N near x = 0.7, zero near x = 1.9 and −12 N at x = 3', 'Figure A10: the force against position', g.s);
}

// ===== Summary: the worked example of Module 2-6 =====
{
  const g = plot({ w: 300, h: 230, xr: [0, 7], yr: [-3, 2], ylab: '{a} [m/s²]', lines: [
    { pts: [[0, 2], [3, 2]] }, { pts: [[3, 0], [5, 0]] }, { pts: [[5, -3], [7, -3]] }] });
  def('s2-6', 300, 230, 'Graph of acceleration against time: 2 m/s² from 0 to 3 s, 0 from 3 to 5 s, −3 m/s² from 5 to 7 s', 'The a–t graph', g.s);
}
{
  const g = plot({ w: 300, h: 230, xr: [0, 7], yr: [0, 6], yt: 2, ylab: '{v} [m/s]', lines: [{ pts: [[0, 0], [3, 6], [5, 6], [7, 0]], c: 'ans' }],
    dots: [[3, 6], [5, 6], [7, 0]], notes: [{ x: 3, y: 6, s: '(3, 6)', dy: -9 }, { x: 5, y: 6, s: '(5, 6)', dy: -9 }] });
  def('s2-6a', 300, 230, 'Answer: velocity against time, a straight line from 0 up to 6 m/s at 3 s, level until 5 s, then a straight line down to 0 at 7 s', 'The v–t graph: its area is the displacement', g.s);
}

// ===== Practice Set B =====
{ // B1: two vectors in the plane
  const O = [110, 170], sc = 30;
  let s = arrow(20, O[1], 290, O[1], 'ink', { head: 8 }) + arrow(O[0], 200, O[0], 22, 'ink', { head: 8 });
  s += T(286, O[1] + 18, '{x}', { anchor: 'end' }) + T(O[0] - 9, 32, '{y}', { anchor: 'end' });
  s += arrowAt(O[0], O[1], 4 * sc, 30, 'vel') + (() => { const [x, y] = at(O[0], O[1], 4 * sc + 10, 30); return T(x + 2, y + 2, '{=a}', { anchor: 'start', c: 'vel-t' }); })();
  s += arrowAt(O[0], O[1], 3 * sc, 120, 'acc') + (() => { const [x, y] = at(O[0], O[1], 3 * sc + 12, 120); return T(x - 2, y, '{=b}', { anchor: 'end', c: 'acc-t' }); })();
  s += arc(O[0], O[1], 30, 0, 30, '30°', { lr: 44 }) + arc(O[0], O[1], 20, 0, 120, '', {}) + T(O[0] - 30, O[1] - 12, '120°', { anchor: 'end', c: 'ts' });
  def('b-1', 300, 210, 'Vector a of magnitude 4 at 30° from the +x axis and vector b of magnitude 3 at 120°', 'Figure B1', s);
}
{ // B2: three pulls on a ring
  const C = [150, 110];
  let s = circ(C[0], C[1], 11, 'body');
  s += arrowAt(C[0] + 11, C[1], 92, 0, 'frc') + T(C[0] + 112, C[1] + 5, '{F_A}', { anchor: 'start', c: 'frc' });
  const [bx, by] = at(C[0], C[1], 11, 150); s += arrowAt(bx, by, 96, 150, 'frc');
  const [lbx, lby] = at(C[0], C[1], 118, 150); s += T(lbx, lby - 4, '2{F}', { c: 'frc' });
  for (const a of [225, 315]) { const [x, y] = at(C[0], C[1], 11, a); s += arrowAt(x, y, 62, a, 'soft', { c: 'dash' }); }
  s += T(C[0], C[1] + 82, '√2 {F}, direction unknown', { c: 'ts' });
  s += line(C[0], C[1], C[0] - 110, C[1], 'thin dot') + arc(C[0], C[1], 36, 150, 180, '30°', { lr: 52 });
  def('b-2', 300, 205, 'Three horizontal pulls on a ring: F_A along +x, 2F at 150°, and √2F in one of two possible directions', 'Figure B2 (seen from above)', s);
}
{ // B5: pushing down at an angle
  let s = ground(20, 300, 160) + box(150, 134, 70, 52, '{m}');
  const E = [114, 122], [ax, ay] = at(E[0], E[1], 86, 180 - 30);
  s += arrow(ax, ay, E[0], E[1], 'frc') + T(ax - 4, ay - 6, '{F}', { anchor: 'end', c: 'frc' });
  s += line(E[0], E[1], 34, E[1], 'thin dot') + arc(E[0], E[1], 40, 180, 180 - 30, '{θ}', { lr: 54, dy: -2 });
  def('b-5', 320, 180, 'A box of mass m on a rough floor, pushed by a force F directed at angle θ below the horizontal', 'Figure B5', s);
}
{ // B6: two blocks in contact
  let s = ground(20, 300, 150) + box(130, 122, 64, 56, '{m_1}') + box(196, 130, 68, 40, '{m_2}');
  s += arrow(40, 122, 96, 122, 'frc') + T(36, 126, '{F}', { anchor: 'end', c: 'frc' });
  s += T(160, 176, 'frictionless floor', { c: 'ts' });
  def('b-6', 300, 188, 'Block 1 of mass m1 and block 2 of mass m2 side by side on a floor; a horizontal force F pushes block 1 into block 2', 'Figure B6', s);
}
{ // B7: kicked toward a wall
  const O = [40, 190], d = 200, sc = 1;
  let s = ground(14, 300, O[1]) + `<rect class="house" x="${O[0] + d}" y="${O[1] - 90}" width="14" height="90"/>`;
  const pts = []; for (let i = 0; i <= 50; i++) { const x = (i / 50) * d; pts.push([O[0] + x, O[1] - (x - x * x / (d * 1.45)) * 0.86]); }
  s += poly(pts, 'vel dash') + arrowAt(O[0], O[1], 50, 45, 'vel') + T(O[0] + 36, O[1] - 44, '{v_0}', { anchor: 'start', c: 'vel-t' });
  s += arc(O[0], O[1], 24, 0, 45, '', {}) + T(O[0] + 30, O[1] - 6, '45°', { anchor: 'start', c: 'ts' }) + circ(O[0], O[1], 5, 'body');
  s += dim(O[0], O[1] + 16, O[0] + d, O[1] + 16, '{d}', { dy: 16 }) + dim(O[0] + d + 26, O[1] - 90, O[0] + d + 26, O[1], '{h}', { dx: 8, anchor: 'start' });
  def('b-7', 300, 230, 'A ball kicked from the ground at 45° with speed v0 toward a wall of height h at horizontal distance d', 'Figure B7', s);
}
{ // B9: loop-the-loop
  const y0 = 210, R = 56, cx = 220;
  let s = ground(10, 320, y0);
  s += path(`M30,${y0 - 150} C70,${y0 - 150} 90,${y0} 150,${y0} L${cx},${y0}`);
  s += circ(cx, y0 - R, R, 'ln');
  s += circ(36, y0 - 158, 7, 'body') + dim(18, y0 - 150, 18, y0, '{h}', { dx: 8, anchor: 'start' });
  s += line(cx, y0 - R, cx + R, y0 - R, 'thin dot') + T(cx + R / 2, y0 - R - 6, '{R}', { c: 'ts' }) + dot(cx, y0 - R, 'pt');
  s += T(cx, y0 - 2 * R - 10, 'top', { c: 'ts' }) + T(cx + 4, y0 + 24, 'bottom', { c: 'ts' });
  def('b-9', 330, 232, 'A frictionless track from height h down into a vertical loop of radius R; the bottom of the loop is at ground level', 'Figure B9', s);
}
{ // B10: a block runs into a spring
  const y = 140;
  let s = line(280, 50, 280, y) + ground(20, 280, y);
  for (let yy = 56; yy < y; yy += 10) s += line(280, yy, 287, yy + 7, 'thin soft');
  s += spring(196, 280, y - 18, { coils: 7, amp: 9 }) + box(90, y - 18, 44, 36, '{m}');
  s += arrow(118, y - 46, 168, y - 46, 'vel') + T(174, y - 42, '{v_0}', { anchor: 'start', c: 'vel-t' }) + T(238, y + 18, 'spring ({k})', { c: 'ts' });
  def('b-10', 300, 162, 'A block of mass m slides at speed v0 on a frictionless floor toward a spring of constant k fixed to a wall', 'Figure B10', s);
}

// ===== Practice Set C =====
{ // C3: tower and two balls
  const g0 = 210, H = 150;
  let s = ground(20, 300, g0) + `<rect class="house" x="96" y="${g0 - H}" width="36" height="${H}"/>`;
  s += circ(150, g0 - H - 2, 7, 'body') + T(162, g0 - H + 2, 'ball 1, dropped', { anchor: 'start', c: 'ts' });
  s += circ(150, g0 - 8, 7, 'body') + arrow(150, g0 - 18, 150, g0 - 66, 'vel') + T(160, g0 - 46, '{v_0}, ball 2', { anchor: 'start', c: 'vel-t' });
  s += dim(80, g0 - H, 80, g0, '{H}', { dx: -8, anchor: 'end' });
  def('c-3', 300, 230, 'Ball 1 is dropped from the top of a tower of height H while ball 2 is thrown straight up from the ground below it with speed v0', 'Figure C3', s);
}
{ // C4: Atwood machine
  const cx = 150;
  let s = ground(110, 190, 26, { up: true }) + line(cx, 26, cx, 52, 'thin') + pulley(cx, 64, 18);
  s += line(cx - 18, 64, cx - 18, 150, 'str') + line(cx + 18, 64, cx + 18, 116, 'str');
  s += box(cx - 18, 172, 38, 44, '{m_1}') + box(cx + 18, 136, 32, 40, '{m_2}');
  def('c-4', 300, 210, 'An Atwood machine: masses m1 and m2 hang on either side of a pulley', 'Figure C4', s);
}
def('c-44', 360, 205, 'Block of mass M on a rough horizontal table, tied by a string over a pulley at the edge to a hanging block of mass m', 'Figure C4-4', tablePulley({ left: '', leftSub: '{M}', right: '', rightSub: '{m}', note: 'Rough surface ({μ_s})', motion: false }));
{ // C5: held on a slope by a horizontal force
  const A = [30, 200], th = 30, Lr = 260;
  const [Bx, By] = at(A[0], A[1], Lr, th);
  let s = slopeHatch(A[0], A[1], Bx, By) + line(A[0], A[1], Bx, A[1]) + arc(A[0], A[1], 44, 0, th, '{θ}', { lr: 58 });
  const [cx0, cy0] = at(A[0], A[1], 150, th), [cx, cy] = at(cx0, cy0, 17, th + 90);
  s += box(cx, cy, 44, 34, '{m}', th);
  s += arrow(cx - 96, cy, cx - 24, cy, 'frc') + T(cx - 100, cy + 5, '{F}', { anchor: 'end', c: 'frc' });
  def('c-5', 300, 215, 'A block of mass m on a slope at angle θ, held by a horizontal force F pushing it toward the slope', 'Figure C5', s);
}
{ // C8: pendulum released from horizontal
  const Pv = [70, 50], L = 170;
  let s = ground(40, 100, Pv[1], { up: true }) + line(Pv[0], Pv[1], Pv[0] + L, Pv[1], 'str dash') + circ(Pv[0] + L, Pv[1], 8, 'body');
  s += path(`M${Pv[0] + L},${Pv[1]} A${L},${L} 0 0 1 ${Pv[0]},${Pv[1] + L}`, 'vel dash');
  const [bx, by] = at(Pv[0], Pv[1], L, -38);
  s += line(Pv[0], Pv[1], bx, by, 'str') + circ(bx, by, 8, 'body') + arc(Pv[0], Pv[1], 40, 0, -38, '{θ}', { lr: 54 });
  s += circ(Pv[0], Pv[1] + L, 8, 'body ghost') + T(Pv[0] + L / 2, Pv[1] - 8, '{L}', { c: 'ts' });
  def('c-8', 300, 240, 'A pendulum of length L released from rest with the string horizontal; at angle θ below the horizontal the ball is part way down its arc', 'Figure C8', s);
}
{ // C9: sliding down a rough slope
  const A = [20, 190], th = 30, Lr = 270;
  const [Bx, By] = at(A[0], A[1], Lr, th);
  let s = slopeHatch(A[0], A[1], Bx, By) + line(A[0], A[1], Bx, A[1]) + arc(A[0], A[1], 44, 0, th, '{θ}', { lr: 58 });
  const [c1x, c1y] = at(...at(A[0], A[1], 220, th), 15, th + 90), [c2x, c2y] = at(...at(A[0], A[1], 90, th), 15, th + 90);
  s += box(c1x, c1y, 40, 30, '{m}', th) + box(c2x, c2y, 40, 30, '', th, 'body ghost');
  const [d1x, d1y] = at(...at(A[0], A[1], 220, th), 42, th + 90), [d2x, d2y] = at(...at(A[0], A[1], 90, th), 42, th + 90);
  s += dim(d1x, d1y, d2x, d2y, '{d}', { dy: -10 });
  s += T(150, 182, 'rough ({μ_k})', { c: 'ts' });
  def('c-9', 300, 205, 'A block of mass m slides a distance d down a rough slope at angle θ, starting from rest', 'Figure C9', s);
}
{ // C10: vertical spring launcher
  const x = 150, g0 = 220;
  let s = ground(90, 210, g0) + vspring(x, g0 - 70, g0, { coils: 5, amp: 10 });
  s += line(x - 24, g0 - 70, x + 24, g0 - 70) + circ(x, g0 - 80, 10, 'body') + T(x + 18, g0 - 76, '{m}', { anchor: 'start' });
  s += line(x + 40, g0 - 70, x + 40, g0 - 16, 'thin dot') + T(x + 46, g0 - 40, 'compressed by {d}', { anchor: 'start', c: 'ts' });
  s += arrow(x, g0 - 98, x, g0 - 160, 'vel') + T(x - 10, g0 - 140, 'up', { anchor: 'end', c: 'ts' });
  def('c-10', 300, 235, 'A ball of mass m resting on a vertical spring compressed by d, about to be launched straight up', 'Figure C10', s);
}

// ===== Practice tab =====
{
  const g = plot({ w: 320, h: 220, xr: [0, 15], yr: [0, 10], xt: 2, yt: 2, ylab: '{v} [m/s]', lines: [{ pts: [[0, 0], [4, 8], [10, 8], [14, 0]] }] });
  def('p2-9', 320, 220, 'Graph of velocity against time: a straight line from 0 at t = 0 up to 8 m/s at 4 s, level at 8 m/s until 10 s, then a straight line down to 0 at 14 s', 'Figure P2-9', g.s);
}
{
  const g = plot({ w: 300, h: 230, xr: [0, 8.8], yr: [-5, 5], yt: 2, ylab: '{v} [m/s]', lines: [{ pts: [[0, -4], [4, 4], [6, 4], [8, 0]] }] });
  def('p2-12', 300, 230, 'Graph of velocity against time: a straight line from −4 m/s at t = 0 up to 4 m/s at 4 s, level at 4 m/s until 6 s, then a straight line down to 0 at 8 s', 'Figure P2-12', g.s);
}
{
  const g = plot({ w: 300, h: 220, xr: [0, 8], yr: [-3, 3], yt: 1, ylab: '{a} [m/s²]', lines: [
    { pts: [[0, 2], [4, 2]], c: 'ans' }, { pts: [[4, 0], [6, 0]], c: 'ans' }, { pts: [[6, -2], [8, -2]], c: 'ans' }] });
  def('p2-12a', 300, 220, 'Answer: acceleration against time, 2 from 0 to 4 s, 0 from 4 to 6 s, −2 from 6 to 8 s', 'Answer to (a): the a–t graph', g.s);
}
{ // P4-11: a ball rolling off a staircase (1 m = 220 px; steps 0.20 m deep, 0.25 m high)
  const E = [90, 40], k = 220, dx = 0.20 * k, dy = 0.25 * k;
  const pts = [[16, E[1]], E];
  for (let n = 1; n <= 4; n++) pts.push([E[0] + dx * (n - 1), E[1] + dy * n], [E[0] + dx * n, E[1] + dy * n]);
  let s = shape([...pts, [E[0] + dx * 4, 286], [16, 286]], 'house');
  for (let n = 1; n <= 4; n++) s += T(E[0] + dx * (n - 0.5), E[1] + dy * n + 16, String(n), { c: 'ts' });
  const path_ = [];
  for (let i = 0; i <= 40; i++) { const x = (Math.sqrt(0.3) * i) / 40; path_.push([E[0] + k * x, E[1] + k * 2.5 * x * x]); }
  s += poly(path_, 'vel dash') + circ(E[0], E[1] - 7, 7, 'body') + arrow(E[0] + 9, E[1] - 7, E[0] + 56, E[1] - 7, 'vel') + T(E[0] + 62, E[1] - 3, '1.4 m/s', { anchor: 'start', c: 'vel-t' });
  s += dim(E[0] + dx * 3, E[1] + dy * 4 - 12, E[0] + dx * 4, E[1] + dy * 4 - 12, '') + T(E[0] + dx * 3.5, E[1] + dy * 4 - 20, '0.20 m', { c: 'ts' });
  s += dim(E[0] - 10, E[1], E[0] - 10, E[1] + dy, '') + T(E[0] - 16, E[1] + dy / 2 + 4, '0.25 m', { anchor: 'end', c: 'ts' });
  def('p4-11', 320, 290, 'A ball rolls horizontally at 1.4 m/s off the top landing of a staircase whose steps are 0.20 m deep and 0.25 m high; the steps below are numbered 1 to 4, and the dashed path lands on step 3', 'Figure P4-11', s);
}
{ // P4-12: a ball aimed at a target that is released at launch (1 m = 5 px)
  const O = [36, 206], k = 5, Tg = [O[0] + 40 * k, O[1] - 30 * k];
  let s = ground(16, 300, O[1]);
  s += line(O[0], O[1], Tg[0], Tg[1], 'thin dash') + line(Tg[0], Tg[1] - 40, Tg[0], Tg[1] - 8, 'str') + line(Tg[0] - 16, Tg[1] - 40, Tg[0] + 16, Tg[1] - 40);
  s += circ(Tg[0], Tg[1], 8, 'body') + T(Tg[0] + 14, Tg[1] + 4, 'target', { anchor: 'start', c: 'ts' });
  s += arrow(Tg[0] + 30, Tg[1] + 8, Tg[0] + 30, Tg[1] + 50, 'acc') + T(Tg[0] + 36, Tg[1] + 36, 'released', { anchor: 'start', c: 'ts' });
  s += arrowAt(O[0], O[1], 60, Math.atan2(3, 4) * 180 / Math.PI, 'vel') + T(O[0] + 30, O[1] - 46, '{v_0}', { anchor: 'end', c: 'vel-t' }) + arc(O[0], O[1], 34, 0, 36.87, '{θ_0}', { lr: 50 });
  s += dim(O[0], O[1] + 14, Tg[0], O[1] + 14, '40 m', { dy: 16 }) + dim(Tg[0], Tg[1] + 12, Tg[0], O[1], '30 m', { dx: -8, anchor: 'end' });
  s += T(O[0] - 4, O[1] + 18, 'O', { anchor: 'end', c: 'ts' });
  def('p4-12', 320, 240, 'A target hangs 30 m above the ground at a horizontal distance of 40 m from the launch point O; the ball is launched along the dashed line straight at the target, which is released at the same moment', 'Figure P4-12', s);
}
{ // P5-10: two blocks on a frictionless table and a hanging block
  let s = line(20, 90, 300, 90) + line(300, 90, 300, 196);
  for (let x = 26; x < 300; x += 10) s += line(x, 90, x - 7, 97, 'thin soft');
  s += box(70, 72, 50, 36, '') + T(70, 70, 'A', { c: 'tb' }) + T(70, 84, '{M_A}', { c: 'ts' });
  s += line(95, 72, 137, 72, 'str');
  s += box(165, 72, 56, 36, '') + T(165, 70, 'B', { c: 'tb' }) + T(165, 84, '{M_B}', { c: 'ts' });
  s += line(193, 72, 312, 72, 'str') + pulley(312, 83) + line(312, 83, 300, 96, 'thin');
  s += line(323, 83, 323, 150, 'str') + box(323, 170, 34, 40, '') + T(323, 166, 'C', { c: 'tb' }) + T(323, 182, '{m}', { c: 'ts' });
  s += T(28, 114, 'Frictionless table', { anchor: 'start', c: 'ts' });
  def('p5-10', 360, 210, 'Blocks A (mass M_A) and B (mass M_B) on a frictionless table, tied together; a string from B runs over a pulley at the edge to block C of mass m, which hangs', 'Figure P5-10', s);
}
{ // P5-11: two equal blocks on a double slope (30° and 60°), joined over a pulley at the peak
  const L = [20, 200], Rt = [300, 200], P0 = [230, 200 - 70 * Math.sqrt(3)];
  let s = shape([L, P0, Rt], 'house');
  s += arc(L[0], L[1], 40, 0, 30, '30°', { lr: 56 }) + arc(Rt[0], Rt[1], 30, 120, 180, '60°', { lr: 46 });
  const pc = [P0[0], P0[1] - 13];
  s += pulley(pc[0], pc[1], 11) + line(pc[0], pc[1], P0[0], P0[1], 'thin');
  const [l0x, l0y] = at(L[0], L[1], 140, 30), [lc, lcy] = at(l0x, l0y, 14, 120);
  const [r0x, r0y] = at(Rt[0], Rt[1], 70, 120), [rc, rcy] = at(r0x, r0y, 14, 30);
  s += box(lc, lcy, 40, 28, '{m}', 30) + box(rc, rcy, 40, 28, '{m}', -60);
  s += line(...at(lc, lcy, 20, 30), ...at(pc[0], pc[1], 11, 120), 'str') + line(...at(rc, rcy, 20, 120), ...at(pc[0], pc[1], 11, 30), 'str');
  def('p5-11', 320, 215, 'A double slope with faces at 30° (left) and 60° (right); a block of mass m sits on each face, joined by a string over a pulley at the peak', 'Figure P5-11', s);
}
{ // P5-12: a pendulum hanging in an accelerating car
  let s = `<rect class="house" x="40" y="58" width="220" height="112" rx="10"/>` + circ(92, 178, 16, 'body') + circ(208, 178, 16, 'body') + ground(20, 290, 194);
  const pv = [170, 58], Ls = 82, th = 37;
  const [bx, by] = at(pv[0], pv[1], Ls, -90 - th);
  s += line(pv[0], pv[1], pv[0], pv[1] + 92, 'thin dot') + line(pv[0], pv[1], bx, by, 'str') + circ(bx, by, 8, 'body') + arc(pv[0], pv[1], 34, -90 - th, -90, '{θ}', { lr: 48 });
  s += arrow(198, 34, 262, 34, 'acc') + T(268, 38, '{a}', { anchor: 'start', c: 'acc' });
  def('p5-12', 300, 205, 'A car accelerating to the right with acceleration a; a ball hangs on a string from its ceiling, and the string leans back at angle θ from the vertical', 'Figure P5-12', s);
}
{ // P6-10: a block held against a rough wall by a push at θ above the horizontal
  const W = 220;
  let s = line(W, 16, W, 204);
  for (let y = 22; y < 204; y += 10) s += line(W, y, W + 7, y + 7, 'thin soft');
  s += box(W - 25, 112, 50, 44, '{m}');
  const end = [W - 52, 118], th = 37, Lf = 86;
  const st = [end[0] - Lf * Math.cos(rad(th)), end[1] + Lf * Math.sin(rad(th))];
  s += arrow(st[0], st[1], end[0], end[1], 'frc') + T(st[0] + 18, st[1] - 24, '{F}', { anchor: 'end', c: 'frc' });
  s += line(st[0], st[1], st[0] + 54, st[1], 'thin dot') + arc(st[0], st[1], 36, 0, th, '{θ}', { lr: 50 });
  s += T(W + 12, 214, 'rough wall ({μ_s})', { anchor: 'end', c: 'ts' });
  def('p6-10', 300, 222, 'A block of mass m held against a rough vertical wall on the right by a push F that points into the wall at angle θ above the horizontal', 'Figure P6-10', s);
}
{
  const g = plot({ w: 300, h: 220, xr: [0, 7], yr: [0, 12], xt: 1, yt: 2, xlab: '{x} [m]', ylab: '{F} [N]', lines: [{ pts: [[0, 10], [4, 10], [6, 0], [7, 0]] }] });
  def('p7-7', 300, 220, 'Graph of force against position: F = 10 N from x = 0 to 4 m, then a straight line down to 0 at x = 6 m, and 0 beyond', 'Figure P7-7', g.s);
}
{
  const g = plot({ w: 300, h: 230, xr: [0, 7], yr: [0, 9], xt: 1, yt: 2, xlab: '{x} [m]', ylab: '{U} [J]', lines: [{ pts: [[0, 6], [2, 0], [4, 0], [6, 8]] }, { pts: [[0, 4], [6.6, 4]], c: 'dash soft' }],
    notes: [{ x: 3, y: 4, s: '{E} = 4.0 J', dy: -8 }] });
  def('p8-9', 300, 230, 'Graph of potential energy against position: U falls in a straight line from 6 J at x = 0 to 0 at x = 2 m, stays 0 until 4 m, then rises in a straight line to 8 J at 6 m; a dashed line marks E = 4.0 J', 'Figure P8-9', g.s);
}
{ // P8-14: a block above a spring on a frictionless slope
  const A = [26, 200], th = 30, Lr = 270;
  const [Bx, By] = at(A[0], A[1], Lr, th);
  let s = slopeHatch(A[0], A[1], Bx, By) + line(A[0], A[1], Bx, A[1]) + arc(A[0], A[1], 46, 0, th, '30°', { lr: 62 });
  const [w1x, w1y] = at(A[0], A[1], 10, th), [w2x, w2y] = at(w1x, w1y, 28, th + 90);
  s += line(w1x, w1y, w2x, w2y);
  const [sx0, sy0] = at(A[0], A[1], 10, th);
  s += `<g transform="rotate(${-th} ${r1(sx0)} ${r1(sy0)})">${spring(sx0, sx0 + 74, sy0 - 13, { coils: 6, amp: 7 })}</g>`;
  const [ex, ey] = at(...at(A[0], A[1], 46, th), 30, th + 90);
  s += T(ex, ey, '{k}', { c: 'ts' });
  const [bx0, by0] = at(A[0], A[1], 220, th), [bcx, bcy] = at(bx0, by0, 15, th + 90);
  s += box(bcx, bcy, 40, 30, '{m}', th);
  const [d1x, d1y] = at(...at(A[0], A[1], 84, th), 40, th + 90), [d2x, d2y] = at(...at(A[0], A[1], 200, th), 40, th + 90);
  s += dim(d1x, d1y, d2x, d2y, '1.8 m', { dy: -10 });
  def('p8-14', 300, 215, 'A block of mass m at rest on a frictionless slope at 30°, 1.8 m above the free end of a spring of spring constant k that lies along the slope near its foot', 'Figure P8-14', s);
}

// ===== Mock midterms =====
{
  const g = plot({ w: 300, h: 240, xr: [0, 8], yr: [-3, 5], yt: 1, ylab: '{a} [m/s²]', lines: [
    { pts: [[0, -2], [3, -2]] }, { pts: [[3, 4], [5, 4]] }, { pts: [[5, 0], [8, 0]] }] });
  def('m2-3', 300, 240, 'Graph of acceleration against time: −2 m/s² from 0 to 3 s, 4 m/s² from 3 to 5 s, 0 from 5 to 8 s', 'Figure M2-3', g.s);
}
{
  const g = plot({ w: 300, h: 250, xr: [0, 8], yr: [-3, 7], yt: 2, ylab: '{v} [m/s]', lines: [{ pts: [[0, 4], [3, -2], [5, 6], [8, 6]], c: 'ans' }],
    dots: [[2, 0], [3.5, 0]], notes: [{ x: 3, y: -2, s: '(3, −2)', dx: 8, dy: 12, anchor: 'start' }, { x: 5, y: 6, s: '(5, 6)', dy: -9 }] });
  def('m2-3a', 300, 250, 'Answer: velocity against time, straight lines from (0, 4) to (3, −2) to (5, 6), then level at 6 m/s until 8 s; it crosses zero at 2 s and 3.5 s', 'Answer to 3-1: the v–t graph', g.s);
}
{ // M2-5: two blocks on a rough floor, block 2 pulled at 37°
  let s = ground(16, 304, 150);
  s += box(70, 130, 56, 40, '1') + line(98, 130, 152, 130, 'str') + box(180, 130, 56, 40, '2');
  const [fx, fy] = at(208, 118, 74, 37);
  s += arrow(208, 118, fx, fy, 'frc') + T(fx + 6, fy + 4, '20 N', { anchor: 'start', c: 'frc' });
  s += line(208, 118, 262, 118, 'thin dot') + arc(208, 118, 32, 0, 37, '37°', { lr: 46 });
  s += T(160, 176, 'rough floor ({μ_k} = 0.25)', { c: 'ts' });
  def('m2-5', 320, 190, 'Blocks 1 and 2, each 2.0 kg, joined by a string on a rough floor; a 20 N force pulls block 2 at 37° above the horizontal', 'Figure M2-5', s);
}
{ // M3-4: a projectile launched up a slope (1 m = 25 px)
  const O = [30, 205], k = 25;
  const top = [O[0] + 262, O[1] - 262 * 0.75];
  let s = slopeHatch(O[0], O[1], top[0], top[1]) + line(O[0], O[1], top[0], O[1]);
  const pts = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push([O[0] + k * 8.4 * t, O[1] - k * (11.2 * t - 4.9 * t * t)]); }
  s += poly(pts, 'vel dash') + circ(O[0] + k * 8.4, O[1] - k * 6.3, 5, 'pt');
  s += arrowAt(O[0], O[1], 62, 53.13, 'vel') + T(O[0] + 24, O[1] - 64, '14 m/s', { anchor: 'end', c: 'vel-t' });
  s += arc(O[0], O[1], 70, 0, 36.87, '37°', { lr: 86 }) + arc(O[0], O[1], 44, 0, 53.13) + T(...at(O[0], O[1], 50, 66), '53°', { anchor: 'end', c: 'ts' });
  s += T(O[0] - 4, O[1] + 18, 'O', { anchor: 'end', c: 'ts' });
  def('m3-4', 310, 225, 'A ball launched from O at the foot of a slope that rises at 37°, with speed 14 m/s at 53° above the horizontal; the dashed path lands on the slope', 'Figure M3-4', s);
}
{ // M3-6: a block on a smooth dome
  const C = [150, 196], Rd = 112;
  let s = ground(20, 280, C[1]) + path(`M${C[0] - Rd},${C[1]} A${Rd},${Rd} 0 0 1 ${C[0] + Rd},${C[1]}`, 'body-ln');
  s += dot(C[0], C[1]) + line(C[0], C[1], C[0], C[1] - Rd - 34, 'thin dot');
  const [bx, by] = at(C[0], C[1], Rd + 9, 90 - 36);
  s += line(C[0], C[1], ...at(C[0], C[1], Rd, 90 - 36), 'thin') + box(bx, by, 18, 18, '', -36) + arc(C[0], C[1], 34, 54, 90, '{φ}', { lr: 46 });
  s += box(C[0], C[1] - Rd - 9, 18, 18, '', 0, 'body ghost') + arrow(C[0] + 12, C[1] - Rd - 9, C[0] + 52, C[1] - Rd - 9, 'vel') + T(C[0] + 58, C[1] - Rd - 5, '{v_0}', { anchor: 'start', c: 'vel-t' });
  s += T(C[0] - 52, C[1] - 46, '{R}', { c: 'ts' }) + line(C[0], C[1], ...at(C[0], C[1], Rd, 150), 'thin dash');
  def('m3-6', 300, 210, 'A smooth hemispherical dome of radius R; a block starts at the top with speed v0 and is shown further down, where the line from the centre to it makes angle φ with the vertical', 'Figure M3-6', s);
}

export const FIGS = F;
export const figHTML = (id) => {
  const f = F[id];
  if (!f) throw new Error(`unknown figure "${id}"`);
  return `<figure class="pfig-wrap">${f.svg}${f.cap ? `<figcaption class="pfig-cap">${esc(f.cap)}</figcaption>` : ''}</figure>`;
};
