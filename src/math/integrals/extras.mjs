// The Calculus midterm 2 page's search tags, formula sheet, interactive graphs and lesson icons (original drawings).
const R = String.raw;
const NOV2 = '2026-11-02';
const NOV6 = '2026-11-06';
const NOV9 = '2026-11-09';
const NOV10 = '2026-11-10';

// keyword tags per practice problem id, used by search
export const tags = {
  '1.1': 'riemann sum estimate n = 4 left right midpoint endpoints rectangles',
  '1.2': 'riemann sum line linear right endpoints limit trapezoid sum of k',
  '1.3': 'riemann sum two partial sums squares sum of k',
  '1.7': 'signed area negative below axis riemann sum actual area triangle',
  '1.8': 'limit as definite integral recognize riemann sum read a b',
  '1.9': 'class example x^2 + x - 2 riemann sum three sums signed area area of region split at zero',
  '1.11': 'properties joining intervals additivity swap limits reverse sign linearity constant zero width',
  '1.12': 'negative integral signed area area of region split at zero x^2 - 4 primitive',
  '2.1': 'primitive function antiderivative ambiguity integration constant +C condition check by differentiating',
  '2.2': 'indefinite integral power rule square root 1/x^2 negative exponent ln split fraction',
  '2.3': 'indefinite integral sin cos e^x minus sign divide by a tan 1/cos^2',
  '2.4': 'exponential any base 2^x b^x ln b b^(ax) 1/5^x negative exponent',
  '2.5': 'logarithm ln 1/(ax+b) absolute value partial fractions derivative of the bottom',
  '2.6': 'simplify first factor difference of squares e^(2x) expand divide',
  '2.7': 'definite integral F(b) - F(a) fundamental theorem primitive sin e^(2x) ln',
  '2.8': 'swap limits exchange initial final points arctan tan^-1 1/(1+x^2)',
  '2.9': 'area with a primitive split at zero signed area F(b) - F(a)',
  '2.10': 'inverse trigonometric functions arcsin sin^-1 arccos 1/sqrt(1-x^2) values range negative angle',
  '3.1': 'substitution definite integral change the limits u-axis e^(2x) sqrt(1+e^(2x)) class example',
  '3.2': 'exercise substitution ln x / x log rule split the fraction arctan (x+1)/(x^2+1)',
  '3.3': 'rational form partial fractions denominator factors roots log 1/(x^2+3x+2)',
  '3.4': 'denominator does not factor make a square factor out the constant arctan 1/(x^2+2x+5)',
  '3.5': 'square root sqrt(ax+b) t = sqrt(x-1) rational form perfect square',
  '3.6': 'trigonometric rational form u = tan(x/2) (1+sin x)/(1+cos x) class example',
  '3.7': 'exercise log and arctan 2x/(x^2+2x+2) make a square numerator derivative',
  '3.8': 'exercise 1/(x sqrt(x+1)) t = sqrt(x+1) partial fractions rationalize',
  '3.9': 'exercise 1/(1+cos x) u = tan(x/2) change the limits',
  '3.10': 'integration by parts product of functions x sin x ln x class examples',
  '3.11': 'integration by parts ln(x^2+1) times 1 divide first arctan exercise',
  '3.12': 'integration by parts twice two rounds x^2 e^(2x) exercise',
  '3.13': 'which method choose substitution by parts partial fractions arctan log rule square root',
  '2.11': 'shortcut trick odd even function symmetric interval half circle known shape area',
  '3.14': 'shortcut trick guess and adjust derivative on top numerator cover-up partial fractions',
  '3.15': "shortcut trick DI table tabular integration by parts repeated King's rule a - x",
};

// Formula sheet. Each row: [name, TeX]. Checked in verify.py (this folder).
export const formulas = [
  { id: 'g1', title: 'Riemann sum and definite integrals', quiz: 'Day 14 & 15', added: NOV2, rows: [
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
    ['Signed area', R`\int_a^b f(x)\,dx=A_{\text{above}}-A_{\text{below}}`],
  ]},
  { id: 'g2', title: 'Primitive functions and definite integrals', quiz: 'Day 16 & 17 · Quiz 06', added: NOV6, rows: [
    ['General form on [a, b]', R`S_N=\sum_{k=1}^{N}f\!\left(a+\frac{k(b-a)}{N}\right)\frac{b-a}{N}`],
    ['Primitive function', R`F'(x)=f(x)`],
    ['Indefinite integral', R`\int f(x)\,dx=F(x)+C`],
    ['Two primitives of f', R`F'=G'=f\ \Rightarrow\ G=F+C`],
    ['Sums and constants', R`\int(\alpha f+\beta g)\,dx=\alpha\int f\,dx+\beta\int g\,dx`],
    ['With a primitive', R`\int_a^b f(x)\,dx=\Big[F(x)\Big]_a^b=F(b)-F(a)`],
    ['Swapping the limits', R`\int_b^a f\,dx=-\int_a^b f\,dx`],
    ['Zero width', R`\int_a^a f\,dx=0`],
    ['Joining intervals', R`\int_a^b f\,dx+\int_b^c f\,dx=\int_a^c f\,dx`],
    ['A constant function', R`\int_a^b c\,dx=c\,(b-a)`],
    ['Area of the region', R`A=\int_a^b|f(x)|\,dx`],
  ]},
  { id: 'g2b', title: 'Fundamental primitive functions', quiz: 'Day 16 & 17 · Quiz 06', added: NOV6, rows: [
    ['Powers (n ≠ −1)', R`\int x^n\,dx=\frac{x^{n+1}}{n+1}+C`],
    ['1/x', R`\int\frac{1}{x}\,dx=\ln|x|+C`],
    ['eˣ', R`\int e^x\,dx=e^x+C`],
    ['eᵃˣ', R`\int e^{ax}\,dx=\frac{1}{a}e^{ax}+C`],
    ['Any base: bˣ', R`\int b^x\,dx=\frac{b^x}{\ln b}+C`],
    ['bᵃˣ', R`\int b^{ax}\,dx=\frac{b^{ax}}{a\ln b}+C`],
    ['Sine', R`\int\sin x\,dx=-\cos x+C`],
    ['Cosine', R`\int\cos x\,dx=\sin x+C`],
    ['sin ax', R`\int\sin ax\,dx=-\frac{1}{a}\cos ax+C`],
    ['cos ax', R`\int\cos ax\,dx=\frac{1}{a}\sin ax+C`],
    ['1/cos² x', R`\int\frac{1}{\cos^2x}\,dx=\tan x+C`],
    ['1/(ax + b)', R`\int\frac{1}{ax+b}\,dx=\frac{1}{a}\ln|ax+b|+C`],
    ['1/(1 + x²)', R`\int\frac{1}{1+x^2}\,dx=\arctan x+C`],
    ['Values of arctan', R`\begin{gathered}\arctan0=0,\quad\arctan\tfrac{1}{\sqrt3}=\tfrac{\pi}{6}\\\arctan1=\tfrac{\pi}{4},\quad\arctan\sqrt3=\tfrac{\pi}{3}\end{gathered}`],
  ]},
  // taught on 9 Nov, the end of the primitive-functions lesson: labelled with its lesson, so the night-before sheet finds it
  { id: 'g2c', title: 'Inverse trigonometric functions', quiz: 'Day 16 & 17 · Quiz 06', added: NOV9, rows: [
    ['Derivative of arcsin', R`(\arcsin x)'=\frac{1}{\sqrt{1-x^2}}`],
    ['Derivative of arccos', R`(\arccos x)'=-\frac{1}{\sqrt{1-x^2}}`],
    ['Derivative of arctan', R`(\arctan x)'=\frac{1}{1+x^2}`],
    ['1/√(1 − x²)', R`\int\frac{1}{\sqrt{1-x^2}}\,dx=\arcsin x+C`],
    ['Ranges', R`-\tfrac{\pi}{2}\le\arcsin x\le\tfrac{\pi}{2},\quad0\le\arccos x\le\pi`],
    ['Values of arcsin', R`\begin{gathered}\arcsin\tfrac{1}{2}=\tfrac{\pi}{6},\quad\arcsin\tfrac{\sqrt2}{2}=\tfrac{\pi}{4}\\\arcsin\tfrac{\sqrt3}{2}=\tfrac{\pi}{3},\quad\arcsin1=\tfrac{\pi}{2}\end{gathered}`],
  ]},
  { id: 'g3', title: 'Integration by substitution', quiz: 'Day 18 & 19 · Quiz 07', added: NOV9, rows: [
    ['Substitution', R`\int f(g(x))\,g'(x)\,dx=F(g(x))+C`],
    ['u and du', R`u=g(x)\ \Rightarrow\ du=g'(x)\,dx`],
    ['New limits', R`\int_a^b f(h(x))\,h'(x)\,dx=\int_{h(a)}^{h(b)}f(u)\,du`],
    ['Log rule', R`\int\frac{f'(x)}{f(x)}\,dx=\ln|f(x)|+C`],
    ['Linear inside', R`\int f(ax+b)\,dx=\frac{1}{a}F(ax+b)+C`],
    ['Partial fractions (class example)', R`\frac{1}{x^2+3x+2}=\frac{1}{x+1}-\frac{1}{x+2}`],
    ['Making a square', R`x^2+bx+c=\left(x+\tfrac{b}{2}\right)^2+c-\tfrac{b^2}{4}`],
    ['Arctan form', R`\int\frac{dx}{(x+p)^2+a^2}=\frac{1}{a}\arctan\frac{x+p}{a}+C`],
    ['A perfect square', R`\int\frac{dx}{(x+p)^2}=-\frac{1}{x+p}+C`],
    ['√(ax + b)', R`t=\sqrt{ax+b}\ \Rightarrow\ x=\frac{t^2-b}{a},\ dx=\frac{2t}{a}\,dt`],
    ['u = tan(x/2): cos and sin', R`\cos x=\frac{1-u^2}{1+u^2},\quad\sin x=\frac{2u}{1+u^2}`],
    ['u = tan(x/2): dx', R`dx=\frac{2}{1+u^2}\,du`],
    ['tan(x/2) from sin and cos', R`\tan\frac{x}{2}=\frac{\sin x}{1+\cos x}`],
  ]},
  { id: 'g3b', title: 'Integration by parts', quiz: 'Day 18 & 19 · Quiz 07', added: NOV10, rows: [
    ['Where it comes from', R`(fg)'=f'g+fg'`],
    ['By parts', R`\int f\,g'\,dx=f\,g-\int f'\,g\,dx`],
    ['By parts, with limits', R`\int_a^b f\,g'\,dx=\Big[f\,g\Big]_a^b-\int_a^b f'\,g\,dx`],
    ['x sin x', R`\int x\sin x\,dx=-x\cos x+\sin x+C`],
    ['ln x', R`\int\ln x\,dx=x\ln x-x+C`],
  ]},
  // extras from outside the lectures, added at the user's request; its label matches no lesson, so the night-before
  // sheet lists it with the values to know
  { id: 'gs', title: 'Shortcuts', quiz: 'Extra · not from the lectures', added: NOV10, rows: [
    ['Odd function on [−a, a]', R`f(-x)=-f(x)\ \Rightarrow\ \int_{-a}^{a}f(x)\,dx=0`],
    ['Even function on [−a, a]', R`f(-x)=f(x)\ \Rightarrow\ \int_{-a}^{a}f\,dx=2\int_0^{a}f\,dx`],
    ['Half a circle', R`\int_{-r}^{r}\sqrt{r^2-x^2}\,dx=\frac{\pi r^2}{2}`],
    ['Make the derivative appear', R`\frac{px+q}{x^2+bx+c}=\frac{p}{2}\cdot\frac{2x+b}{x^2+bx+c}+\frac{q-\frac{pb}{2}}{x^2+bx+c}`],
    ['Cover-up', R`A=\Big[(x-\alpha)\,f(x)\Big]_{x=\alpha}`],
    ['DI table: x²eˣ', R`\int x^2e^x\,dx=e^x(x^2-2x+2)+C`],
    ["King's rule", R`\int_0^{a}f(x)\,dx=\int_0^{a}f(a-x)\,dx`],
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
