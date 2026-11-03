// The Calculus midterm 2 page's search tags, formula sheet, interactive graphs and lesson icons (original drawings).
const R = String.raw;
const NOV2 = '2026-11-02';
const NOV3 = '2026-11-03';

// keyword tags per practice problem id, used by search
export const tags = {
  '1.1': 'riemann sum estimate n = 4 left right midpoint endpoints rectangles',
  '1.2': 'riemann sum line linear right endpoints limit trapezoid sum of k',
  '1.3': 'riemann sum two partial sums squares sum of k',
  '1.4': 'riemann sum a ≠ 0 expand square right endpoints',
  '1.5': 'riemann sum decreasing upper sum lower sum right endpoints',
  '1.6': 'riemann sum cubes left endpoints sum of cubes shift',
  '1.7': 'signed area negative below axis riemann sum actual area triangle',
  '1.8': 'limit as definite integral recognize riemann sum read a b',
  '1.9': 'class example x^2 + x - 2 riemann sum three sums signed area area of region split at zero',
  '1.10': 'any interval a b subtract integral from 0 powers x^m trapezoid split constants linearity',
  '1.11': 'properties joining intervals additivity swap limits reverse sign linearity constant zero width',
  '1.12': 'negative integral signed area area of region split at zero x^2 - 4',
};

// Formula sheet. Each row: [name, TeX]. Checked in verify.py (this folder).
export const formulas = [
  { id: 'g1', title: 'Riemann sum and definite integrals', quiz: '2 & 3 Nov', added: NOV2, rows: [
    ['Strip width', R`\Delta x=\frac{b-a}{n}`],
    ['Right endpoint', R`x_k=a+k\,\Delta x`],
    ['Left endpoint', R`x_k=a+(k-1)\,\Delta x`],
    ['Midpoint', R`x_k=a+\left(k-\tfrac{1}{2}\right)\Delta x`],
    ['Riemann sum', R`S_n=\sum_{k=1}^{n}f(x_k)\,\Delta x`],
    ['Definite integral', R`\int_a^b f(x)\,dx=\lim_{n\to\infty}\sum_{k=1}^{n}f(x_k)\,\Delta x`],
    ['Sum of a constant', R`\sum_{k=1}^{n}c=cn`],
    ['Constant factor', R`\sum_{k=1}^{n}c\,a_k=c\sum_{k=1}^{n}a_k`],
    ['Sum of k', R`\sum_{k=1}^{n}k=\frac{n(n+1)}{2}`],
    ['Sum of squares', R`\sum_{k=1}^{n}k^2=\frac{n(n+1)(2n+1)}{6}`],
    ['Sum of cubes', R`\sum_{k=1}^{n}k^3=\frac{n^2(n+1)^2}{4}`],
    ['Left ends: n becomes n − 1', R`\sum_{k=1}^{n}(k-1)^2=\frac{(n-1)n(2n-1)}{6}`],
    ['Increasing f', R`\text{left sum}<\int_a^b f(x)\,dx<\text{right sum}`],
    ['Powers from 0 to L', R`\int_0^L x^m\,dx=\frac{L^{m+1}}{m+1}`],
    ['Quick way: xᵐ on [0, L]', R`S_n=\left(\frac{L}{n}\right)^{m+1}\sum_{k=1}^{n}k^m`],
    ['Leading term (n large)', R`\sum_{k=1}^{n}k^m\approx\frac{n^{m+1}}{m+1}`],
    ['Signed area', R`\int_a^b f(x)\,dx=A_{\text{above}}-A_{\text{below}}`],
    ['With an antiderivative', R`F'=f\ \Rightarrow\ \int_a^b f(x)\,dx=F(b)-F(a)`],
  ]},
  { id: 'g1b', title: 'Definite integrals on any interval', quiz: '2 & 3 Nov', added: NOV3, rows: [
    ['Any interval [a, b]', R`\int_a^b f\,dx=\int_0^b f\,dx-\int_0^a f\,dx`],
    ['Powers on [a, b]', R`\int_a^b x^m\,dx=\frac{b^{m+1}-a^{m+1}}{m+1}`],
    ['Zero width', R`\int_a^a f\,dx=0`],
    ['Swapping the limits', R`\int_b^a f\,dx=-\int_a^b f\,dx`],
    ['Joining intervals', R`\int_a^b f\,dx+\int_b^c f\,dx=\int_a^c f\,dx`],
    ['Sums and constants', R`\int_a^b(\alpha f+\beta g)\,dx=\alpha\int_a^b f\,dx+\beta\int_a^b g\,dx`],
    ['A constant function', R`\int_a^b c\,dx=c\,(b-a)`],
    ['Comparison (a ≤ b)', R`f\le g\ \Rightarrow\ \int_a^b f\,dx\le\int_a^b g\,dx`],
    ['Name of the variable', R`\int_a^b f(x)\,dx=\int_a^b f(t)\,dt`],
  ]},
];

// interactive graphs (src/math/graphs.js draws them), placed after a unit's key ideas: [kind, title, note]
export const GRAPHS = {
  u1: [['riemann', 'Rectangles under a curve', R`Rectangles under $y=x^2$ from $0$ to $2$. Since $x^2$ is increasing, right ends overshoot and left ends fall short, and every choice tends to the area $\frac{8}{3}$ as $n$ grows.`]],
};
export const GRAPHS_ADDED = NOV2;

// ---------- lesson icons (original drawings, no university marks) ----------
const big = (body) => `<svg viewBox="0 0 48 48" aria-hidden="true" class="tile-ic">${body}</svg>`;
export const UNIT_ICONS = {
  // rectangles under a curve
  u1: big('<path d="M8 8v32h32"/><rect x="12" y="33" width="6.5" height="7"/><rect x="18.5" y="27" width="6.5" height="13"/><rect x="25" y="19" width="6.5" height="21"/><rect x="31.5" y="10" width="6.5" height="30" class="lime-fill-soft"/><path d="M10 39C21 37 31 27 40 8" class="lime-stroke"/>'),
  // a family of antiderivatives F + C, one curve picked out
  u2: big('<path d="M8 8v32h32"/><path d="M12 36c9-1 14-9 27-12"/><path d="M12 29c9-1 14-9 27-12" class="lime-stroke"/><path d="M12 22c9-1 14-9 27-12"/>'),
  // an integral sign with a swap: parts and substitution
  u3: big('<path d="M25 7c-3.5-1.4-6.5.6-6.5 4.5v25c0 3.9-3 5.9-6.5 4.5"/><path d="M28 19h11M35.5 15.5L39 19l-3.5 3.5" class="lime-stroke"/><path d="M39 29H28M31.5 25.5L28 29l3.5 3.5" class="lime-stroke"/>'),
  // the area between two curves, with its average height
  u4: big('<path d="M10 33Q24 4 38 21V33Q24 25 10 37z" class="lime-fill" fill-opacity=".55"/><path d="M8 8v32h32"/><path d="M10 33Q24 4 38 21"/><path d="M10 37Q24 25 38 33"/><path d="M12 25h25" stroke-dasharray="3 3"/>'),
  // a polar curve around the pole
  u5: big('<path d="M6 24h36M24 6v36"/><path d="M24 24C24 13 37 11 37 24S24 35 24 24C24 13 11 11 11 24S24 35 24 24" class="lime-stroke"/><circle cx="24" cy="24" r="2.4" class="lime-fill"/>'),
  // an area that runs on to infinity under a falling curve
  u6: big('<path d="M13 40V11Q16 31 42 37V40z" class="lime-fill" fill-opacity=".55"/><path d="M8 8v32h34"/><path d="M13 9Q16 31 42 37"/><path d="M13 11V40"/>'),
  habits: big('<rect x="9" y="7" width="30" height="35" rx="3"/><path d="M15 17l3 3 5-5" class="lime-stroke"/><path d="M27 18h6M15 28h18M15 35h12"/>'),
};
