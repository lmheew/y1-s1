// v2 additions: search tags, formula sheet, exact-values table, and original icons.
const R = String.raw;

// keyword tags per practice problem id, used by search
export const tags = {
  '1.1': 'evaluate function value plug in zero factor dot multiply',
  '1.2': 'inverse trig arcsin arccos arctan range exact value',
  '1.3': 'one-sided limit left right continuity removable discontinuity infinite limit factor',
  '1.4': 'piecewise continuity find k',
  '1.5': 'limit conjugate special limit sin x over x exponential',
  '2.1': 'power rule derivative polynomial e^x ln',
  '2.2': 'product rule derivative',
  '2.3': 'chain rule composite function f(g(x)) square root log',
  '2.4': 'chain rule log trig cos squared double angle',
  '2.5': 'limit definition derivative tangent line',
  '3.1': 'reciprocal trig sec csc quotient rule chain rule',
  '3.2': 'inverse function derivative of inverse arctan exponential',
  '3.3': 'implicit differentiation vertical tangent double root curve',
  '3.4': 'implicit differentiation tangent line circle e^y',
  '3.5': 'parametric second derivative dy/dx d2y/dx2 slope',
  '4.1': 'critical points second derivative test concavity relative maximum minimum extrema',
  '4.2': 'absolute maximum minimum closed interval log ln extrema',
  '4.3': 'absolute value absolute maximum minimum corner extrema',
  '4.4': 'inflection point concavity concave up down',
  '4.5': 'critical point non-differentiable vertical tangent cusp first derivative test',
  '5.1': 'geometric series partial sum general term convergence divergence',
  '5.2': 'sequence limit ratio test divergence test convergence',
  '5.3': "newton's method newton approximation root x2",
  '5.4': 'linear approximation tangent line estimate concave',
  '5.5': 'taylor series coefficients maclaurin double angle',
  '6.1': 'differential equation integrate antiderivative initial condition constant ln exponential',
  '6.2': "differential equation y' = λy exponential growth decay initial value problem constant",
  '6.3': 'second order differential equation characteristic equation general solution discriminant repeated root complex roots cos sin',
  '6.4': 'second order differential equation initial conditions characteristic equation particular solution',
  '6.5': 'characteristic equation roots work backwards build the equation from its solutions',
};

// Formula sheet. Each row: [name, TeX]. Checked in verify_formulas.py.
export const formulas = [
  { id: 'g1', title: 'Continuous functions', quiz: 'Day 1 & 2 · Quiz 01', rows: [
    ['Special limit', R`\lim_{x\to0}\frac{\sin x}{x}=1`],
    ['Special limit', R`\lim_{x\to0}\frac{1-\cos x}{x}=0`],
    ['Special limit', R`\lim_{x\to0}\frac{1-\cos x}{x^2}=\frac{1}{2}`],
    ['Special limit', R`\lim_{x\to0}\frac{e^x-1}{x}=1`],
    ['Special limit', R`\lim_{x\to0}\frac{\ln(1+x)}{x}=1`],
    ['Napier’s constant', R`\lim_{n\to\infty}\left(1+\frac{1}{n}\right)^n=e`],
    ['Conjugate trick', R`\frac{\sqrt{x}-\sqrt{a}}{x-a}=\frac{1}{\sqrt{x}+\sqrt{a}}`],
    ['Continuity at a', R`\lim_{x\to a}f(x)=f(a)`],
    ['Range of arcsin', R`\arcsin:[-1,1]\to\left[-\tfrac{\pi}{2},\tfrac{\pi}{2}\right]`],
    ['Range of arccos', R`\arccos:[-1,1]\to[0,\pi]`],
    ['Range of arctan', R`\arctan:\mathbb{R}\to\left(-\tfrac{\pi}{2},\tfrac{\pi}{2}\right)`],
  ]},
  { id: 'g2', title: 'Derivatives of functions and chain rule', quiz: 'Day 3 & 4 · Quiz 02', rows: [
    ['Definition', R`f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}`],
    ['Tangent line at a', R`y=f(a)+f'(a)(x-a)`],
    ['Power rule', R`(x^n)'=nx^{n-1}`],
    ['Product rule', R`(fg)'=f'g+fg'`],
    ['Quotient rule', R`\left(\frac{f}{g}\right)'=\frac{f'g-fg'}{g^2}`],
    ['Chain rule', R`\big(f(g(x))\big)'=f'(g(x))\,g'(x)`],
    ['Exponentials', R`(e^x)'=e^x,\quad (a^x)'=a^x\ln a`],
    ['Logarithms', R`(\ln x)'=\frac{1}{x},\quad (\log_a x)'=\frac{1}{x\ln a}`],
    ['Sine and cosine', R`(\sin x)'=\cos x,\quad (\cos x)'=-\sin x`],
    ['Tangent', R`(\tan x)'=\sec^2x=\frac{1}{\cos^2x}`],
    ['Cotangent', R`(\cot x)'=-\csc^2x=-\frac{1}{\sin^2x}`],
    ['Secant and cosecant', R`(\sec x)'=\sec x\tan x,\quad (\csc x)'=-\csc x\cot x`],
  ]},
  { id: 'g3', title: 'Implicit differentiation and parametric curve', quiz: 'Day 5 & 6 · Quiz 03', rows: [
    ['A y-term', R`\frac{d}{dx}\,g(y)=g'(y)\,y'`],
    ['Product with y', R`(xy)'=y+xy'`],
    ['Circle tangent slope', R`x^2+y^2=r^2\ \Rightarrow\ y'=-\frac{x}{y}`],
    ['Inverse function', R`(f^{-1})'(b)=\frac{1}{f'(a)},\quad f(a)=b`],
    ['arcsin', R`(\arcsin x)'=\frac{1}{\sqrt{1-x^2}}`],
    ['arccos', R`(\arccos x)'=-\frac{1}{\sqrt{1-x^2}}`],
    ['arctan', R`(\arctan x)'=\frac{1}{1+x^2}`],
    ['Parametric slope', R`\frac{dy}{dx}=\frac{dy/dt}{dx/dt}`],
    ['Parametric second derivative', R`\frac{d^2y}{dx^2}=\frac{\frac{d}{dt}\!\left(\frac{dy}{dx}\right)}{dx/dt}`],
  ]},
  { id: 'g4', title: 'Maximum and minimum problem', quiz: 'Day 7 & 8 · Quiz 04', rows: [
    ['Critical point', R`f'(c)=0\ \text{ or }\ f'(c)\ \text{undefined}`],
    ['Second derivative test', R`f'(c)=0:\ \ f''(c)<0\Rightarrow\text{max},\ \ f''(c)>0\Rightarrow\text{min}`],
    ['Concavity', R`f''>0:\ \text{up}\ (\cup),\qquad f''<0:\ \text{down}\ (\cap)`],
    ['Inflection point', R`f''\ \text{changes sign at}\ c\ \Rightarrow\ \big(c,\,f(c)\big)`],
    ['Closed interval', R`\max/\min\ \text{of}\ f\big(\text{critical points in }[a,b]\big),\ f(a),\ f(b)`],
  ]},
  { id: 'g5s', title: 'Infinite series', quiz: 'Day 9', rows: [
    ['Sum of n', R`\sum_{n=1}^{N}n=\frac{N(N+1)}{2}`],
    ['Sum of squares', R`\sum_{n=1}^{N}n^2=\frac{N(N+1)(2N+1)}{6}`],
    ['Sum of cubes', R`\sum_{n=1}^{N}n^3=\left[\frac{N(N+1)}{2}\right]^2`],
    ['Geometric partial sum', R`\sum_{n=0}^{N}r^n=\frac{1-r^{N+1}}{1-r}\quad(r\ne1)`],
    ['Geometric series', R`\sum_{n=0}^{\infty}r^n=\frac{1}{1-r}\quad(|r|<1)`],
    ['Divergence test', R`a_n\not\to0\ \Rightarrow\ \sum a_n\ \text{diverges}`],
    ['Ratio test', R`r=\lim_{n\to\infty}\left|\frac{a_{n+1}}{a_n}\right|:\ \ r<1\ \text{conv.},\ r>1\ \text{div.}`],
    ['p-series', R`\sum\frac{1}{n^p}\ \text{converges}\iff p>1`],
    ['Telescoping', R`\sum_{n=1}^{\infty}\frac{1}{n(n+1)}=\sum_{n=1}^{\infty}\left(\frac{1}{n}-\frac{1}{n+1}\right)=1`],
  ]},
  { id: 'g5', title: "Newton's method and Taylor series", quiz: 'Day 10 & 11 · Quiz 05', rows: [
    ["Newton's method", R`x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}`],
    ['Linear approximation', R`f(x)\approx f(a)+f'(a)(x-a)`],
    ['Taylor coefficient', R`c_k=\frac{f^{(k)}(a)}{k!}`],
    ['e to the x', R`e^x=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots`],
    ['sin x', R`\sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots`],
    ['cos x', R`\cos x=1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots`],
    ['ln(1 + x)', R`\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots`],
    ['1 / (1 − x)', R`\frac{1}{1-x}=1+x+x^2+\cdots\quad(|x|<1)`],
  ]},
  { id: 'g6', title: 'Trig without a calculator', quiz: 'All quizzes', rows: [
    ['Pythagorean identity', R`\sin^2x+\cos^2x=1`],
    ['With tangent', R`1+\tan^2x=\sec^2x`],
    ['Double angle (sin)', R`\sin 2x=2\sin x\cos x`],
    ['Double angle (cos)', R`\cos 2x=\cos^2x-\sin^2x=1-2\sin^2x`],
    ['Odd and even', R`\sin(-x)=-\sin x,\quad \cos(-x)=\cos x`],
  ]},
  { id: 'g7', title: 'Introduction to differential equation', quiz: 'Day 12 · not on the midterm', added: '2026-10-29', rows: [
    ['Order and constants', R`\text{order } n\ \Rightarrow\ n\ \text{constants},\ n\ \text{conditions}`],
    ['y′ = f(x)', R`y=\int f(x)\,dx+C`],
    ['y′ = λy', R`y=Ce^{\lambda x},\quad C=y(0)`],
    ['Characteristic equation', R`y''+ay'+by=0\ \Rightarrow\ \lambda^2+a\lambda+b=0`],
    ['Δ > 0, real roots λ₁ ≠ λ₂', R`y=C_1e^{\lambda_1x}+C_2e^{\lambda_2x}`],
    ['Δ = 0, repeated root λ', R`y=(C_1+C_2x)e^{\lambda x}`],
    ['Δ < 0, roots α ± βi', R`y=e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)`],
    ["Euler's formula", R`e^{i\theta}=\cos\theta+i\sin\theta`],
  ]},
];

// exact values table, laid out like the course slide (Review of Functions): 0 to π, rows cos, sin, tan.
// null = undefined (tan at π/2). Checked in verify_exact.mjs.
export const exactValues = {
  angles: [[R`0`, '0°'], [R`\frac{\pi}{6}`, '30°'], [R`\frac{\pi}{4}`, '45°'], [R`\frac{\pi}{3}`, '60°'], [R`\frac{\pi}{2}`, '90°'],
           [R`\frac{2\pi}{3}`, '120°'], [R`\frac{3\pi}{4}`, '135°'], [R`\frac{5\pi}{6}`, '150°'], [R`\pi`, '180°']],
  rows: [
    [R`\cos x`, [R`1`, R`\frac{\sqrt{3}}{2}`, R`\frac{1}{\sqrt{2}}`, R`\frac{1}{2}`, R`0`, R`-\frac{1}{2}`, R`-\frac{1}{\sqrt{2}}`, R`-\frac{\sqrt{3}}{2}`, R`-1`]],
    [R`\sin x`, [R`0`, R`\frac{1}{2}`, R`\frac{1}{\sqrt{2}}`, R`\frac{\sqrt{3}}{2}`, R`1`, R`\frac{\sqrt{3}}{2}`, R`\frac{1}{\sqrt{2}}`, R`\frac{1}{2}`, R`0`]],
    [R`\tan x`, [R`0`, R`\frac{1}{\sqrt{3}}`, R`1`, R`\sqrt{3}`, null, R`-\sqrt{3}`, R`-1`, R`-\frac{1}{\sqrt{3}}`, R`0`]],
  ],
};

// ---------- original icons (no university marks) ----------
// site badge: a curve with a tangent line touching it
export const BADGE = `<svg class="badge" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" class="b-bg"/><path d="M6 24Q16 -6 26 24" class="b-curve"/><path d="M5.5 21L16.5 4.5" class="b-tan"/><circle cx="11" cy="12.75" r="2.4" class="b-dot"/></svg>`;

const ic = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true" class="ic">${body}</svg>`;
export const TAB_ICONS = {
  summary: ic('<path d="M3.5 5.5c0-.8.7-1.5 1.5-1.5h6.2v15.5H5a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M20.5 5.5c0-.8-.7-1.5-1.5-1.5h-6.2v15.5H19a1.5 1.5 0 0 0 1.5-1.5z"/><path d="M6.5 8.5h2.2M15.3 8.5h2.2M15.3 12h2.2"/>'),
  practice: ic('<rect x="4" y="3" width="12.5" height="18" rx="2"/><path d="M7.5 8h5.5M7.5 11.5h5.5M7.5 15h3"/><path d="M14.2 19.8l6.1-6.1 1.6 1.6-6.1 6.1h-1.6z"/>'),
  formulas: ic('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M15.5 8H8.8l3.6 4-3.6 4h6.7"/>'),
  quizzes: ic('<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="M8.5 10.5l1.6 1.6 3.4-3.4M8.5 16.2h7"/>'),
  exams: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M8.5 14.5l2.2 2.2 4.8-4.8"/>'),
};
export const UI_ICONS = {
  search: ic('<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/>'),
  close: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
  system: ic('<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" class="fill"/>'),
  light: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>'),
  dark: ic('<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>'),
  arrow: ic('<path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>'),
  chevron: ic('<path d="M9 5.5l6.5 6.5L9 18.5"/>'),
  shuffle: ic('<path d="M3.5 7h3.2c2.3 0 3.6 1 4.8 3l1 1.7c1.2 2 2.5 3.3 4.8 3.3h3.2M3.5 17h3.2c1.4 0 2.4-.5 3.3-1.4M14.2 8.4C15 7.5 16 7 17.3 7h3.2M18 4.5L20.5 7 18 9.5M18 12.5l2.5 2.5-2.5 2.5"/>'),
  timer: ic('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4.2l2.6 1.6M9.5 2.5h5"/>'),
  lock: ic('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5"/>'),
  eye: ic('<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'),
  calendar: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'),
};

const big = (body) => `<svg viewBox="0 0 48 48" aria-hidden="true" class="tile-ic">${body}</svg>`;
export const UNIT_ICONS = {
  u1: big('<path d="M8 8v32h32"/><path d="M12 35c6-1 9-7 13-11.5"/><path d="M30.5 18.5C33.5 15.5 36.5 13.5 41 12.5"/><circle cx="27.8" cy="21" r="2.6" class="lime-stroke"/>'),
  u2: big('<path d="M7 38c9-1 15-20 34-26"/><path d="M9 33.5L38 17" class="lime-stroke"/><circle cx="20.5" cy="27" r="2.6" class="lime-fill"/>'),
  u3: big('<circle cx="21" cy="26" r="12"/><path d="M21.5 8.5l17 17" class="lime-stroke"/><circle cx="29.5" cy="17.5" r="2.6" class="lime-fill"/>'),
  u4: big('<path d="M5 31c6 0 7-16 13-16s7 19 13 19 7-16 13-16"/><circle cx="18" cy="15" r="2.6" class="lime-fill"/><circle cx="31" cy="34" r="2.6" class="lime-fill"/>'),
  u7: big('<rect x="7" y="12" width="6" height="28" rx="1" class="lime-fill-soft"/><rect x="16" y="20" width="6" height="20" rx="1"/><rect x="25" y="26" width="6" height="14" rx="1"/><rect x="34" y="31" width="6" height="9" rx="1"/>'),
  u5: big('<path d="M5 36h38"/><path d="M8 44C20 41 31 32 41 9"/><path d="M38 15.5L28 36" class="lime-stroke"/><circle cx="38" cy="15.5" r="2.6" class="lime-fill"/><circle cx="28" cy="36" r="2.6" class="lime-fill"/>'),
  u6: big('<path d="M10 7v34"/><path d="M10 40c12 0 20-4 28-19"/><path d="M10 31c12 0 20-4 28-19" class="lime-stroke"/><path d="M10 22c9 0 15-3 21-12"/><circle cx="10" cy="31" r="2.8" class="lime-fill"/>'),
  habits: big('<rect x="9" y="7" width="30" height="35" rx="3"/><path d="M15 17l3 3 5-5" class="lime-stroke"/><path d="M27 18h6M15 28h18M15 35h12"/>'),
};
