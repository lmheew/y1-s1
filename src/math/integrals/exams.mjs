// The Exams tab of Calculus midterm 2: mock midterms. Mocks 1–3 (ids im5–im7, added 20 Nov at the user's request)
// follow the layout of the AY2025 midterm of the integral part, last year's paper, which is in the in-class quizzes'
// style: Q.1 four definite integrals of f(x) on an interval D; Q.2 an arctan form (a square in the bottom) and a √x form;
// Q.3 two integrals by parts (a power of x times a trig function, and e^(ax) times a trig function, by parts twice);
// Q.4 a volume of revolution; Q.5 a parametric curve, its length and the area under it; Q.6 a function defined by an
// improper integral: its first value, the relation that parts gives, and its general value. 60 minutes and 100 points
// (estimated like the paper's: 16, 16, 18, 14, 18, 18). They replaced three mocks in the AY2022–AY2024 layout (im1–im3);
// the new ids keep marks saved for those from showing on these. Mock 4 (im4, 19 Nov) follows the in-class quizzes
// (six questions of 10 points, 60 in all). A mock may carry its own note above it (`focus`).
// Same markup as content.mjs; `pts` gives the points of each part, `labels` the paper-style labels ('' for a question
// that is one question). No function of a past paper or an in-class sheet is reused (leakcheck.mjs). Every answer is
// checked in verify.py.
const R = String.raw;
const NOV19 = '2026-11-19';
const NOV20 = '2026-11-20';
const FOCUS25 = 'In the layout of the AY2025 midterm of the integral part: six questions, from definite integrals on an interval to a function defined by an improper integral. Work on paper, without notes or a calculator. When the time is up, open each answer and tick the parts you got right.';
const Q1 = R`Compute each definite integral of $f(x)$ on the interval $D$.`;
const Q2 = R`Compute each definite integral.`;
const Q3 = R`Compute each definite integral by parts.`;
const VOL = (a, b) => R`Find the volume of the solid formed when the graph of $f(x)$ is revolved about the $x$-axis, for ` + `$${a}\\le x\\le${b}$.`;
const CURVE = (dom, xy) => R`A curve is given by the following parameterization, with the parameter $t$ in ` + dom + '.\n$$\\begin{cases}' + xy + '\\end{cases}$$';
const LENGTH = R`Find the length of the curve.`;

export const mocks = [
  {
    id: 'im5', title: 'Mock Midterm 1', minutes: 60, added: NOV20, focus: FOCUS25,
    qs: [
      {
        topic: 'Definite integrals', label: 'Q.1', stem: Q1,
        parts: [R`$f(x)=x^2-6x+5$;  $D:\ [0,3]$`, R`$f(x)=\cos(2x)$;  $D:\ [0,\pi/4]$`, R`$f(x)=3^x$;  $D:\ [0,2]$`, R`$f(x)=\frac{1}{3x+1}$;  $D:\ [0,1]$`],
        pts: [4, 4, 4, 4],
        answer: [R`(1) $-3$`, R`(2) $\frac{1}{2}$`, R`(3) $\frac{8}{\ln3}$`, R`(4) $\frac{1}{3}\ln4=\frac{2}{3}\ln2$`],
        sol: R`**(1)** $\Big[\frac{x^3}{3}-3x^2+5x\Big]_0^3=9-27+15=-3$. It is negative because $f=(x-1)(x-5)<0$ on most of $[0,3]$: an integral, not an area.

**(2)** Divide by the $2$ inside: $\Big[\frac{\sin2x}{2}\Big]_0^{\pi/4}=\frac{1}{2}-0=\frac{1}{2}$.

**(3)** $\int3^x\,dx=\frac{3^x}{\ln3}$, so the integral is $\frac{9-1}{\ln3}=\frac{8}{\ln3}$.

**(4)** Divide by the $3$ inside: $\Big[\frac{1}{3}\ln|3x+1|\Big]_0^1=\frac{1}{3}\ln4=\frac{2}{3}\ln2$.`,
      },
      {
        topic: 'Arctan and √x forms', label: 'Q.2', stem: Q2,
        parts: [R`$\displaystyle\int_1^4\frac{dx}{x^2-2x+10}$`, R`$\displaystyle\int_1^{16}\frac{x-4}{x+2\sqrt x}\,dx$`],
        pts: [8, 8],
        answer: [R`(1) $\frac{\pi}{12}$`, R`(2) $3$`],
        sol: R`**(1)** $\Delta=4-40<0$, so make a square: $x^2-2x+10=(x-1)^2+9$. With $u=x-1$ (limits $0$ and $3$) and $a=3$:
$$\begin{aligned}\int_0^3\frac{du}{u^2+9}&=\frac{1}{3}\Big[\arctan\frac{u}{3}\Big]_0^3\\[4pt]&=\frac{1}{3}\cdot\frac{\pi}{4}=\frac{\pi}{12}\end{aligned}$$

**(2)** Factor: $x-4=(\sqrt x-2)(\sqrt x+2)$ and $x+2\sqrt x=\sqrt x(\sqrt x+2)$, so the integrand is $\frac{\sqrt x-2}{\sqrt x}=1-\frac{2}{\sqrt x}$:
$$\begin{aligned}\int_1^{16}\left(1-2x^{-1/2}\right)dx&=\Big[x-4\sqrt x\Big]_1^{16}\\[4pt]&=0-(-3)=3\end{aligned}$$`,
      },
      {
        topic: 'Integration by parts', label: 'Q.3', stem: Q3,
        parts: [R`$\displaystyle\int_0^{\pi}x^2\cos x\,dx$`, R`$\displaystyle\int_0^{\pi/2}e^{2x}\sin x\,dx$`],
        pts: [9, 9],
        answer: [R`(1) $-2\pi$`, R`(2) $\frac{2e^{\pi}+1}{5}$`],
        sol: R`**(1)** By parts twice, differentiating the power of $x$ each time:
$$\begin{aligned}&\int x^2\cos x\,dx\\[4pt]&=x^2\sin x-\int2x\sin x\,dx\\[4pt]&=x^2\sin x+2x\cos x-2\sin x\end{aligned}$$
At $\pi$: $0-2\pi-0=-2\pi$. At $0$: $0$. So the integral is $-2\pi$.

**(2)** Call the indefinite integral $J$. By parts twice, integrating $e^{2x}$ each time:
$$\begin{aligned}J&=\frac{e^{2x}}{2}\sin x-\frac{1}{2}\int e^{2x}\cos x\,dx\\[4pt]&=\frac{e^{2x}}{2}\sin x-\frac{e^{2x}}{4}\cos x-\frac{1}{4}J\end{aligned}$$

So $\frac{5}{4}J=\frac{e^{2x}}{4}(2\sin x-\cos x)$, that is $J=\frac{e^{2x}(2\sin x-\cos x)}{5}$. At $\frac{\pi}{2}$: $\frac{2e^{\pi}}{5}$; at $0$: $-\frac{1}{5}$. The integral is $\frac{2e^{\pi}+1}{5}$.`,
      },
      {
        topic: 'Volume of revolution', label: 'Q.4', stem: VOL(0, 1),
        labels: [''],
        parts: [R`$f(x)=\sqrt{x}\,e^{x}$`],
        pts: [14],
        answer: [R`$\frac{\pi\left(e^2+1\right)}{4}$`],
        sol: R`$f(x)^2=xe^{2x}$, so $V=\pi\int_0^1xe^{2x}\,dx$.

By parts, differentiating $x$: $\int xe^{2x}\,dx=\frac{x}{2}e^{2x}-\int\frac{1}{2}e^{2x}\,dx=e^{2x}\left(\frac{x}{2}-\frac{1}{4}\right)$. So
$$V=\pi\left(\frac{e^2}{4}+\frac{1}{4}\right)=\frac{\pi\left(e^2+1\right)}{4}$$`,
      },
      {
        topic: 'A parametric curve', label: 'Q.5', stem: CURVE(R`$0\le t\le\pi$`, R`x=t+\sin t\cos t\\y=\sin^2t`),
        parts: [LENGTH, R`Find the area enclosed by the curve and the $x$-axis.`],
        pts: [9, 9],
        answer: [R`(1) $4$`, R`(2) $\frac{\pi}{4}$`],
        sol: R`**(1)** $\frac{dx}{dt}=1+\cos^2t-\sin^2t=2\cos^2t$ and $\frac{dy}{dt}=2\sin t\cos t$, so
$$\begin{aligned}&\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2\\[4pt]&=4\cos^4t+4\sin^2t\cos^2t=4\cos^2t\end{aligned}$$

The root is $2|\cos t|$, not $2\cos t$: $\cos t<0$ for $\frac{\pi}{2}<t\le\pi$. Split at $\frac{\pi}{2}$:
$$\begin{aligned}\ell&=\int_0^{\pi/2}2\cos t\,dt\\[4pt]&\quad-\int_{\pi/2}^{\pi}2\cos t\,dt=2+2=4\end{aligned}$$
Without the absolute value the integral is $0$, which can't be a length.

**(2)** $y=\sin^2t\ge0$, with $y=0$ at $t=0$ and $t=\pi$ (where $x=0$ and $x=\pi$), and $x$ increases, since $\frac{dx}{dt}=2\cos^2t\ge0$. With $2\sin t\cos t=\sin2t$:
$$\begin{aligned}A&=\int_0^{\pi}\sin^2t\cdot2\cos^2t\,dt\\[4pt]&=\frac{1}{2}\int_0^{\pi}\sin^22t\,dt=\frac{1}{2}\cdot\frac{\pi}{2}=\frac{\pi}{4}\end{aligned}$$`,
      },
      {
        topic: 'A function from an improper integral', label: 'Q.6',
        stem: R`A function of the whole number $n\ge0$ is defined by an improper integral.
$$F(n)=\int_0^{\infty}x^ne^{-2x}\,dx$$`,
        parts: [R`Compute $F(0)$.`, R`Give the relation between $F(n)$ and $F(n-1)$ for $n\ge1$.`, R`Compute $F(n)$ for a whole number $n\ge0$.`],
        pts: [6, 6, 6],
        answer: [R`(1) $F(0)=\frac{1}{2}$`, R`(2) $F(n)=\frac{n}{2}\,F(n-1)$`, R`(3) $F(n)=\frac{n!}{2^{n+1}}$`],
        sol: R`**(1)** $F(0)=\int_0^{\infty}e^{-2x}\,dx=\lim_{w\to\infty}\Big[-\frac{1}{2}e^{-2x}\Big]_0^{w}=\lim_{w\to\infty}\frac{1-e^{-2w}}{2}=\frac{1}{2}$.

**(2)** By parts, with $f=x^n$ and $g'=e^{-2x}$, so $f'=nx^{n-1}$ and $g=-\frac{1}{2}e^{-2x}$:
$$\begin{aligned}F(n)&=\Big[-\frac{1}{2}x^ne^{-2x}\Big]_0^{\infty}\\[4pt]&\quad+\frac{n}{2}\int_0^{\infty}x^{n-1}e^{-2x}\,dx\end{aligned}$$

The bracket is $0$: at $0$ since $n\ge1$, and at $\infty$ since $\frac{w^n}{e^{2w}}\to0$ (L'Hôpital's rule, $n$ times). So $F(n)=\frac{n}{2}F(n-1)$.

**(3)** Use (2) again and again, then (1):
$$F(n)=\frac{n}{2}\cdot\frac{n-1}{2}\cdots\frac{1}{2}\,F(0)=\frac{n!}{2^{n+1}}$$
This holds for $n=0$ too, with $0!=1$.`,
      },
    ],
  },
  {
    id: 'im6', title: 'Mock Midterm 2', minutes: 60, added: NOV20, focus: FOCUS25,
    qs: [
      {
        topic: 'Definite integrals', label: 'Q.1', stem: Q1,
        parts: [R`$f(x)=2x^3-3x^2$;  $D:\ [-1,2]$`, R`$f(x)=\sin\left(\frac{x}{2}\right)$;  $D:\ [0,\pi]$`, R`$f(x)=4^x$;  $D:\ [0,1/2]$`, R`$f(x)=\frac{2}{4x-1}$;  $D:\ [1,4]$`],
        pts: [4, 4, 4, 4],
        answer: [R`(1) $-\frac{3}{2}$`, R`(2) $2$`, R`(3) $\frac{1}{2\ln2}$`, R`(4) $\frac{1}{2}\ln5$`],
        sol: R`**(1)** $\Big[\frac{x^4}{2}-x^3\Big]_{-1}^{2}=(8-8)-\left(\frac{1}{2}+1\right)=-\frac{3}{2}$. Mind the signs at $-1$: $\frac{(-1)^4}{2}=\frac{1}{2}$ and $-(-1)^3=+1$.

**(2)** The inside is $\frac{x}{2}$, so multiply by $2$: $\Big[-2\cos\frac{x}{2}\Big]_0^{\pi}=-2\cos\frac{\pi}{2}+2\cos0=2$.

**(3)** $\int4^x\,dx=\frac{4^x}{\ln4}$, so the integral is $\frac{4^{1/2}-4^0}{\ln4}=\frac{2-1}{2\ln2}=\frac{1}{2\ln2}$.

**(4)** Divide by the $4$ inside: $\int\frac{2\,dx}{4x-1}=\frac{1}{2}\ln|4x-1|$, so the integral is $\frac{1}{2}(\ln15-\ln3)=\frac{1}{2}\ln5$.`,
      },
      {
        topic: 'Arctan and √x forms', label: 'Q.2', stem: Q2,
        parts: [R`$\displaystyle\int_{-2}^{0}\frac{dx}{x^2+4x+8}$`, R`$\displaystyle\int_1^4\frac{dx}{x+\sqrt x}$`],
        pts: [8, 8],
        answer: [R`(1) $\frac{\pi}{8}$`, R`(2) $2\ln\frac{3}{2}$`],
        sol: R`**(1)** $\Delta=16-32<0$, so make a square: $x^2+4x+8=(x+2)^2+4$. With $u=x+2$ (limits $0$ and $2$) and $a=2$:
$$\begin{aligned}\int_0^2\frac{du}{u^2+4}&=\frac{1}{2}\Big[\arctan\frac{u}{2}\Big]_0^2\\[4pt]&=\frac{1}{2}\cdot\frac{\pi}{4}=\frac{\pi}{8}\end{aligned}$$

**(2)** With $t=\sqrt x$: $x=t^2$, $dx=2t\,dt$, and the limits move to $1$ and $2$. The bottom is $t^2+t=t(t+1)$, so
$$\int_1^2\frac{2t\,dt}{t(t+1)}=2\Big[\ln(t+1)\Big]_1^2=2\ln\frac{3}{2}$$`,
      },
      {
        topic: 'Integration by parts', label: 'Q.3', stem: Q3,
        parts: [R`$\displaystyle\int_1^{e}x(\ln x)^2\,dx$`, R`$\displaystyle\int_0^{\pi}e^x\sin x\cos x\,dx$`],
        pts: [9, 9],
        answer: [R`(1) $\frac{e^2-1}{4}$`, R`(2) $\frac{1-e^{\pi}}{5}$`],
        sol: R`**(1)** Differentiate $(\ln x)^2$ and integrate $x$; then parts once more for $\int x\ln x\,dx=\frac{x^2}{2}\ln x-\frac{x^2}{4}$:
$$\begin{aligned}&\int x(\ln x)^2dx\\[4pt]&=\frac{x^2}{2}(\ln x)^2-\int x\ln x\,dx\\[4pt]&=\frac{x^2}{2}(\ln x)^2-\frac{x^2}{2}\ln x+\frac{x^2}{4}\end{aligned}$$

At $e$: $\frac{e^2}{2}-\frac{e^2}{2}+\frac{e^2}{4}=\frac{e^2}{4}$. At $1$: $\frac{1}{4}$. So the integral is $\frac{e^2-1}{4}$.

**(2)** First $\sin x\cos x=\frac{1}{2}\sin2x$. For $J=\int e^x\sin2x\,dx$, by parts twice, integrating $e^x$: $J=e^x\sin2x-2e^x\cos2x-4J$, so
$$J=\frac{e^x(\sin2x-2\cos2x)}{5}$$

From $0$ to $\pi$, $J$ gives $\frac{-2e^{\pi}+2}{5}$, and half of it is $\frac{1-e^{\pi}}{5}$. It is negative: on $\left(\frac{\pi}{2},\pi\right)$, where $e^x$ is largest, $\sin x\cos x<0$.`,
      },
      {
        topic: 'Volume of revolution', label: 'Q.4', stem: VOL(1, 2),
        labels: [''],
        parts: [R`$f(x)=\dfrac{1}{\sqrt{x^2+x}}$`],
        pts: [14],
        answer: [R`$\pi\ln\frac{4}{3}$`],
        sol: R`$f(x)^2=\frac{1}{x^2+x}=\frac{1}{x(x+1)}$, and by partial fractions $\frac{1}{x(x+1)}=\frac{1}{x}-\frac{1}{x+1}$.

So
$$\begin{aligned}V&=\pi\Big[\ln\frac{x}{x+1}\Big]_1^2=\pi\left(\ln\frac{2}{3}-\ln\frac{1}{2}\right)\\[4pt]&=\pi\ln\frac{4}{3}\end{aligned}$$`,
      },
      {
        topic: 'A parametric curve', label: 'Q.5', stem: CURVE(R`$0\le t\le\frac{\pi}{2}$`, R`x=\cos^3t\\y=\sin^3t`),
        parts: [LENGTH, R`Find the area enclosed by the curve and the two axes.`],
        pts: [9, 9],
        answer: [R`(1) $\frac{3}{2}$`, R`(2) $\frac{3\pi}{32}$`],
        sol: R`**(1)** $\frac{dx}{dt}=-3\cos^2t\sin t$ and $\frac{dy}{dt}=3\sin^2t\cos t$, so
$$\begin{aligned}&\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2\\[4pt]&=9\sin^2t\cos^2t\left(\cos^2t+\sin^2t\right)\\[4pt]&=9\sin^2t\cos^2t\end{aligned}$$

On $\left[0,\frac{\pi}{2}\right]$, $\sin t\cos t\ge0$, so the root is $3\sin t\cos t$:
$$\begin{aligned}\ell&=\int_0^{\pi/2}3\sin t\cos t\,dt\\[4pt]&=\frac{3}{2}\Big[\sin^2t\Big]_0^{\pi/2}=\frac{3}{2}\end{aligned}$$

**(2)** The region lies under the curve, from $x=0$ to $x=1$. As $t$ goes from $0$ to $\frac{\pi}{2}$, $x$ goes from $1$ down to $0$, so in $t$ the limits run from $\frac{\pi}{2}$ to $0$:
$$\begin{aligned}A&=\int_{\pi/2}^{0}\sin^3t\left(-3\cos^2t\sin t\right)dt\\[4pt]&=3\int_0^{\pi/2}\sin^4t\cos^2t\,dt\end{aligned}$$

With $\cos^2t=1-\sin^2t$ and the reduction formula $I_n=\frac{n-1}{n}I_{n-2}$ on $\left[0,\frac{\pi}{2}\right]$: $I_4=\frac{3}{4}\cdot\frac{1}{2}\cdot\frac{\pi}{2}=\frac{3\pi}{16}$ and $I_6=\frac{5}{6}I_4=\frac{5\pi}{32}$. So
$$A=3\left(I_4-I_6\right)=3\left(\frac{3\pi}{16}-\frac{5\pi}{32}\right)=\frac{3\pi}{32}$$`,
      },
      {
        topic: 'A function from an improper integral', label: 'Q.6',
        stem: R`A function of the whole number $n\ge0$ is defined by the following integral, improper at $x=0$ when $n\ge1$.
$$L(n)=\int_0^{1}(\ln x)^n\,dx$$`,
        parts: [R`Compute $L(1)$.`, R`Give the relation between $L(n)$ and $L(n-1)$ for $n\ge1$.`, R`Compute $L(n)$ for a whole number $n\ge0$.`],
        pts: [6, 6, 6],
        answer: [R`(1) $L(1)=-1$`, R`(2) $L(n)=-n\,L(n-1)$`, R`(3) $L(n)=(-1)^n\,n!$`],
        sol: R`**(1)** $\ln x$ diverges at $0$, so integrate from $w>0$. By parts, $\int\ln x\,dx=x\ln x-x$:
$$\begin{aligned}L(1)&=\lim_{w\to+0}\Big[x\ln x-x\Big]_w^{1}\\[4pt]&=-1-\lim_{w\to+0}\left(w\ln w-w\right)=-1\end{aligned}$$
since $w\ln w\to0$ (L'Hôpital's rule).

**(2)** By parts, with $f=(\ln x)^n$ and $g'=1$, so $f'=\frac{n(\ln x)^{n-1}}{x}$ and $g=x$:
$$\begin{aligned}\int_w^1(\ln x)^n\,dx&=\Big[x(\ln x)^n\Big]_w^1\\[4pt]&\quad-n\int_w^1(\ln x)^{n-1}\,dx\end{aligned}$$

The bracket is $0-w(\ln w)^n$, which tends to $0$ as $w\to+0$ (L'Hôpital's rule, $n$ times). So $L(n)=-n\,L(n-1)$.

**(3)** $L(0)=\int_0^1dx=1$, and each step multiplies by $-n$:
$$\begin{aligned}L(n)&=(-n)\bigl(-(n-1)\bigr)\cdots(-1)\,L(0)\\[4pt]&=(-1)^n\,n!\end{aligned}$$
For example, $L(2)=2$ and $L(3)=-6$.`,
      },
    ],
  },
  {
    id: 'im7', title: 'Mock Midterm 3', minutes: 60, added: NOV20, focus: FOCUS25,
    qs: [
      {
        topic: 'Definite integrals', label: 'Q.1', stem: Q1,
        parts: [R`$f(x)=4x^3-6x+2$;  $D:\ [-1,1]$`, R`$f(x)=\sin(\pi x)$;  $D:\ [0,1]$`, R`$f(x)=5^x$;  $D:\ [0,1]$`, R`$f(x)=\frac{1}{2x+3}$;  $D:\ [-1,3]$`],
        pts: [4, 4, 4, 4],
        answer: [R`(1) $4$`, R`(2) $\frac{2}{\pi}$`, R`(3) $\frac{4}{\ln5}$`, R`(4) $\ln3$`],
        sol: R`**(1)** $\Big[x^4-3x^2+2x\Big]_{-1}^{1}=(1-3+2)-(1-3-2)=0-(-4)=4$.

**(2)** Divide by the $\pi$ inside: $\Big[-\frac{\cos\pi x}{\pi}\Big]_0^1=\frac{1}{\pi}+\frac{1}{\pi}=\frac{2}{\pi}$.

**(3)** $\int5^x\,dx=\frac{5^x}{\ln5}$, so the integral is $\frac{5-1}{\ln5}=\frac{4}{\ln5}$.

**(4)** Divide by the $2$ inside: $\Big[\frac{1}{2}\ln|2x+3|\Big]_{-1}^{3}=\frac{1}{2}(\ln9-\ln1)=\ln3$.`,
      },
      {
        topic: 'Arctan and √x forms', label: 'Q.2', stem: Q2,
        parts: [R`$\displaystyle\int_0^1\frac{dx}{x^2+x+1}$`, R`$\displaystyle\int_0^1\frac{\sqrt x}{1+\sqrt x}\,dx$`],
        pts: [8, 8],
        answer: [R`(1) $\frac{\pi}{3\sqrt3}=\frac{\sqrt3\,\pi}{9}$`, R`(2) $2\ln2-1$`],
        sol: R`**(1)** $\Delta=1-4<0$, so make a square: $x^2+x+1=\left(x+\frac{1}{2}\right)^2+\frac{3}{4}$. With $u=x+\frac{1}{2}$ (limits $\frac{1}{2}$ and $\frac{3}{2}$) and $a=\frac{\sqrt3}{2}$:
$$\begin{aligned}\int_{1/2}^{3/2}\frac{du}{u^2+\frac{3}{4}}&=\frac{2}{\sqrt3}\Big[\arctan\frac{2u}{\sqrt3}\Big]_{1/2}^{3/2}\\[4pt]&=\frac{2}{\sqrt3}\left(\frac{\pi}{3}-\frac{\pi}{6}\right)=\frac{\pi}{3\sqrt3}\end{aligned}$$
using $\arctan\sqrt3=\frac{\pi}{3}$ and $\arctan\frac{1}{\sqrt3}=\frac{\pi}{6}$.

**(2)** With $t=\sqrt x$: $dx=2t\,dt$, and the limits stay $0$ and $1$:
$$\int_0^1\frac{t}{1+t}\cdot2t\,dt=2\int_0^1\frac{t^2}{t+1}\,dt$$

Divide: $\frac{t^2}{t+1}=t-1+\frac{1}{t+1}$, so the integral is $2\left(\frac{1}{2}-1+\ln2\right)=2\ln2-1$.`,
      },
      {
        topic: 'Integration by parts', label: 'Q.3', stem: Q3,
        parts: [R`$\displaystyle\int_0^{\pi/4}x^2\cos2x\,dx$`, R`$\displaystyle\int_0^{\pi}e^{-x}\sin x\,dx$`],
        pts: [9, 9],
        answer: [R`(1) $\frac{\pi^2}{32}-\frac{1}{4}$`, R`(2) $\frac{1+e^{-\pi}}{2}$`],
        sol: R`**(1)** By parts twice, differentiating the power of $x$ and integrating $\cos2x$ (divide by $2$ each time):
$$\begin{aligned}&\int x^2\cos2x\,dx\\[4pt]&=\frac{x^2}{2}\sin2x-\int x\sin2x\,dx\\[4pt]&=\frac{x^2}{2}\sin2x+\frac{x}{2}\cos2x-\frac{1}{4}\sin2x\end{aligned}$$
At $\frac{\pi}{4}$: $\frac{\pi^2}{32}+0-\frac{1}{4}$. At $0$: $0$. So the integral is $\frac{\pi^2}{32}-\frac{1}{4}$.

**(2)** Call the indefinite integral $J$. By parts twice, integrating $e^{-x}$ each time: $J=-e^{-x}\sin x+\int e^{-x}\cos x\,dx=-e^{-x}\sin x-e^{-x}\cos x-J$, so
$$J=-\frac{e^{-x}(\sin x+\cos x)}{2}$$

At $\pi$: $\frac{e^{-\pi}}{2}$; at $0$: $-\frac{1}{2}$. The integral is $\frac{1+e^{-\pi}}{2}$.`,
      },
      {
        topic: 'Volume of revolution', label: 'Q.4', stem: VOL(0, 1),
        labels: [''],
        parts: [R`$f(x)=\dfrac{\sqrt x}{x^2+1}$`],
        pts: [14],
        answer: [R`$\frac{\pi}{4}$`],
        sol: R`$f(x)^2=\frac{x}{\left(x^2+1\right)^2}$. With $u=x^2+1$, $du=2x\,dx$, and the limits move to $1$ and $2$:
$$\begin{aligned}V&=\pi\int_1^2\frac{du}{2u^2}=\frac{\pi}{2}\Big[-\frac{1}{u}\Big]_1^2\\[4pt]&=\frac{\pi}{2}\cdot\frac{1}{2}=\frac{\pi}{4}\end{aligned}$$`,
      },
      {
        topic: 'A parametric curve', label: 'Q.5', stem: CURVE(R`$0\le t\le\frac{\sqrt3}{2}$`, R`x=2t^2\\y=t-\frac{4}{3}t^3`),
        parts: [LENGTH, R`Find the area enclosed by the curve and the $x$-axis.`],
        pts: [9, 9],
        answer: [R`(1) $\sqrt3$`, R`(2) $\frac{\sqrt3}{5}$`],
        sol: R`**(1)** $\frac{dx}{dt}=4t$ and $\frac{dy}{dt}=1-4t^2$, so the sum of squares is a perfect square:
$$\begin{aligned}&16t^2+\left(1-4t^2\right)^2\\[4pt]&=1+8t^2+16t^4=\left(1+4t^2\right)^2\end{aligned}$$

So, with $\left(\frac{\sqrt3}{2}\right)^3=\frac{3\sqrt3}{8}$:
$$\begin{aligned}\ell&=\int_0^{\sqrt3/2}\left(1+4t^2\right)dt\\[4pt]&=\frac{\sqrt3}{2}+\frac{4}{3}\cdot\frac{3\sqrt3}{8}=\sqrt3\end{aligned}$$

**(2)** $y=t\left(1-\frac{4}{3}t^2\right)\ge0$ on the domain, with $y=0$ at $t=0$ and $t=\frac{\sqrt3}{2}$ (where $x=0$ and $x=\frac{3}{2}$), and $x$ increases. So
$$\begin{aligned}A&=\int_0^{\sqrt3/2}\left(t-\frac{4}{3}t^3\right)4t\,dt\\[4pt]&=\Big[\frac{4t^3}{3}-\frac{16t^5}{15}\Big]_0^{\sqrt3/2}\\[4pt]&=\frac{\sqrt3}{2}-\frac{3\sqrt3}{10}=\frac{\sqrt3}{5}\end{aligned}$$`,
      },
      {
        topic: 'A function from an improper integral', label: 'Q.6',
        stem: R`A function of the whole number $n\ge0$ is defined by an improper integral.
$$K(n)=\int_1^{\infty}\frac{(\ln x)^n}{x^2}\,dx$$`,
        parts: [R`Compute $K(0)$.`, R`Give the relation between $K(n)$ and $K(n-1)$ for $n\ge1$.`, R`Compute $K(n)$ for a whole number $n\ge0$.`],
        pts: [6, 6, 6],
        answer: [R`(1) $K(0)=1$`, R`(2) $K(n)=n\,K(n-1)$`, R`(3) $K(n)=n!$`],
        sol: R`**(1)** $K(0)=\int_1^{\infty}\frac{dx}{x^2}=\lim_{w\to\infty}\Big[-\frac{1}{x}\Big]_1^{w}=\lim_{w\to\infty}\left(1-\frac{1}{w}\right)=1$.

**(2)** By parts, with $f=(\ln x)^n$ and $g'=\frac{1}{x^2}$, so $f'=\frac{n(\ln x)^{n-1}}{x}$ and $g=-\frac{1}{x}$:
$$\begin{aligned}K(n)&=\Big[-\frac{(\ln x)^n}{x}\Big]_1^{\infty}\\[4pt]&\quad+n\int_1^{\infty}\frac{(\ln x)^{n-1}}{x^2}\,dx\end{aligned}$$

The bracket is $0$: at $1$, $\ln1=0$; at $\infty$, $\frac{(\ln w)^n}{w}\to0$ (L'Hôpital's rule, $n$ times). So $K(n)=n\,K(n-1)$.

**(3)** Use (2) again and again, then (1): $K(n)=n(n-1)\cdots1\cdot K(0)=n!$.`,
      },
    ],
  },
  {
    id: 'im4', title: 'Mock Midterm 4 (quiz style)', minutes: 60, added: NOV19,
    focus: 'Six questions in the style of the in-class quizzes, 10 points each, like this year’s Calculus midterm 1. Work on paper, without notes or a calculator. When the time is up, open each answer and tick the parts you got right.',
    qs: [
      {
        topic: 'Riemann sums and definite integrals', label: 'Q.1', stem: R`Answer each part.`, pts: [4, 2, 4],
        parts: [
          R`For $f(x)=3x^2+2x$ on $[0,1]$, cut into $N$ strips with right endpoints, write the Riemann sum $S_N$ in general form, simplify it, and find $\displaystyle\lim_{N\to\infty}S_N$.`,
          R`$\displaystyle\int_0^{\ln2}e^{2x}\,dx$`,
          R`The area between $y=x^2-2x$ and the $x$-axis on $[0,3]$`,
        ],
        answer: [R`(1) $S_N=2+\frac{5}{2N}+\frac{1}{2N^2}\to2$`, R`(2) $\frac{3}{2}$`, R`(3) $\frac{8}{3}$`],
        sol: R`**(1)** $\Delta x=\frac{1}{N}$ and $x_k=\frac{k}{N}$, so $f(x_k)=\frac{3k^2}{N^2}+\frac{2k}{N}$. Take the constants out of the sums:
$$\begin{aligned}S_N&=\sum_{k=1}^{N}\left(\frac{3k^2}{N^2}+\frac{2k}{N}\right)\frac{1}{N}\\[4pt]&=\frac{3}{N^3}\sum_{k=1}^{N}k^2+\frac{2}{N^2}\sum_{k=1}^{N}k\end{aligned}$$

With the partial sums:
$$\begin{aligned}S_N&=\frac{(N+1)(2N+1)}{2N^2}+\frac{N+1}{N}\\[4pt]&=2+\frac{5}{2N}+\frac{1}{2N^2}\end{aligned}$$
which tends to $2$. Check: $\int_0^1\left(3x^2+2x\right)dx=1+1=2$.

**(2)** $\Big[\frac{1}{2}e^{2x}\Big]_0^{\ln2}=\frac{1}{2}(4-1)=\frac{3}{2}$, since $e^{2\ln2}=\left(e^{\ln2}\right)^2=4$.

**(3)** $f=x(x-2)$ is negative on $(0,2)$ and positive on $(2,3]$, so split at $2$. With $F=\frac{x^3}{3}-x^2$: $F(0)=0$, $F(2)=-\frac{4}{3}$ and $F(3)=0$.

So $\int_0^2f\,dx=-\frac{4}{3}$ and $\int_2^3f\,dx=\frac{4}{3}$, and the area is $\frac{4}{3}+\frac{4}{3}=\frac{8}{3}$. The integral over $[0,3]$ alone is $0$, which is not the area.`,
      },
      {
        topic: 'Substitution and rational forms', label: 'Q.2', stem: Q2, pts: [2, 2, 3, 3],
        parts: [
          R`$\displaystyle\int_0^1\frac{x^2}{x^3+1}\,dx$`,
          R`$\displaystyle\int_0^{\pi/4}\frac{\sin x}{\cos^3x}\,dx$`,
          R`$\displaystyle\int_2^3\frac{dx}{x^2-1}$`,
          R`$\displaystyle\int_1^3\frac{dx}{x^2-2x+5}$`,
        ],
        answer: [R`(1) $\frac{1}{3}\ln2$`, R`(2) $\frac{1}{2}$`, R`(3) $\frac{1}{2}\ln\frac{3}{2}$`, R`(4) $\frac{\pi}{8}$`],
        sol: R`**(1)** $u=x^3+1$, $du=3x^2\,dx$, and the limits move to $u=1$ and $u=2$: $\frac{1}{3}\int_1^2\frac{du}{u}=\frac{1}{3}\ln2$.

**(2)** $u=\cos x$, $du=-\sin x\,dx$, and the limits move to $u=1$ and $u=\frac{\sqrt2}{2}$:
$$\begin{aligned}-\int_1^{\sqrt2/2}u^{-3}\,du&=\Big[\frac{1}{2u^2}\Big]_1^{\sqrt2/2}\\[4pt]&=1-\frac{1}{2}=\frac{1}{2}\end{aligned}$$

**(3)** The bottom factors: $\frac{1}{(x-1)(x+1)}=\frac{1}{2}\left(\frac{1}{x-1}-\frac{1}{x+1}\right)$ (cover-up at $x=1$ and $x=-1$). So the integral is
$$\begin{aligned}\frac{1}{2}\Big[\ln\frac{x-1}{x+1}\Big]_2^3&=\frac{1}{2}\left(\ln\frac{1}{2}-\ln\frac{1}{3}\right)\\[4pt]&=\frac{1}{2}\ln\frac{3}{2}\end{aligned}$$

**(4)** The bottom doesn't factor, since $\Delta=4-20<0$. Make a square: $x^2-2x+5=(x-1)^2+4$. With $a=2$:
$$\frac{1}{2}\Big[\arctan\frac{x-1}{2}\Big]_1^3=\frac{1}{2}\left(\frac{\pi}{4}-0\right)=\frac{\pi}{8}$$`,
      },
      {
        topic: 'By parts and u = tan(x/2)', label: 'Q.3', stem: Q2, pts: [5, 5],
        parts: [
          R`$\displaystyle\int_0^1x\arctan x\,dx$`,
          R`$\displaystyle\int_0^{\pi/2}\frac{dx}{2+\cos x}$, with $u=\tan\frac{x}{2}$`,
        ],
        answer: [R`(1) $\frac{\pi}{4}-\frac{1}{2}$`, R`(2) $\frac{\pi}{3\sqrt3}=\frac{\sqrt3\,\pi}{9}$`],
        sol: R`**(1)** By parts, differentiating $\arctan x$: $f=\arctan x$ and $g'=x$, so $f'=\frac{1}{1+x^2}$ and $g=\frac{x^2}{2}$:
$$\begin{aligned}\int_0^1x\arctan x\,dx&=\Big[\frac{x^2}{2}\arctan x\Big]_0^1\\[4pt]&\quad-\frac{1}{2}\int_0^1\frac{x^2}{1+x^2}\,dx\end{aligned}$$

The first part is $\frac{1}{2}\cdot\frac{\pi}{4}=\frac{\pi}{8}$. For the second, $\frac{x^2}{1+x^2}=1-\frac{1}{1+x^2}$, so its integral is $1-\frac{\pi}{4}$. The answer is $\frac{\pi}{8}-\frac{1}{2}\left(1-\frac{\pi}{4}\right)=\frac{\pi}{4}-\frac{1}{2}$.

**(2)** With $u=\tan\frac{x}{2}$: $\cos x=\frac{1-u^2}{1+u^2}$ and $dx=\frac{2\,du}{1+u^2}$, and the limits move to $u=0$ and $u=\tan\frac{\pi}{4}=1$. Then $2+\cos x=\frac{3+u^2}{1+u^2}$, so the integrand becomes $\frac{2\,du}{u^2+3}$.

With $a=\sqrt3$:
$$\begin{aligned}\int_0^1\frac{2\,du}{u^2+3}&=\frac{2}{\sqrt3}\Big[\arctan\frac{u}{\sqrt3}\Big]_0^1\\[4pt]&=\frac{2}{\sqrt3}\cdot\frac{\pi}{6}=\frac{\pi}{3\sqrt3}\end{aligned}$$
using $\arctan\frac{1}{\sqrt3}=\frac{\pi}{6}$.`,
      },
      {
        topic: 'Volume, length and products of sines', label: 'Q.4', stem: R`Answer each part.`, pts: [4, 4, 2],
        parts: [
          R`The volume of the solid generated when $y=1+\sqrt x$, $0\le x\le1$, is revolved about the $x$-axis`,
          R`The length of the curve $y=\frac{x^2}{8}-\ln x$ on $[1,2]$`,
          R`$\displaystyle\int_0^{\pi}\sin4x\sin x\,dx$`,
        ],
        answer: [R`(1) $\frac{17\pi}{6}$`, R`(2) $\frac{3}{8}+\ln2$`, R`(3) $0$`],
        sol: R`**(1)** Expand the square completely, middle term included:
$$\begin{aligned}V&=\pi\int_0^1\left(1+2\sqrt x+x\right)dx\\[4pt]&=\pi\left(1+\frac{4}{3}+\frac{1}{2}\right)=\frac{17\pi}{6}\end{aligned}$$

**(2)** $y'=\frac{x}{4}-\frac{1}{x}$, so $1+y'^2=\frac{x^2}{16}+\frac{1}{2}+\frac{1}{x^2}=\left(\frac{x}{4}+\frac{1}{x}\right)^2$, a perfect square. Then
$$\begin{aligned}\ell&=\int_1^2\left(\frac{x}{4}+\frac{1}{x}\right)dx=\Big[\frac{x^2}{8}+\ln x\Big]_1^2\\[4pt]&=\frac{3}{8}+\ln2\end{aligned}$$

**(3)** Product to sum: $\sin4x\sin x=\frac{1}{2}(\cos3x-\cos5x)$, so the integral is $\frac{1}{2}\Big[\frac{\sin3x}{3}-\frac{\sin5x}{5}\Big]_0^{\pi}=0$, because $\sin k\pi=0$ for every whole $k$.`,
      },
      {
        topic: 'Parametric and polar curves', label: 'Q.5',
        stem: R`Two curves: $C_1$ is $r=e^{2\theta}$ in polar coordinates, and $C_2$ is $x=t^2$, $y=4t-t^3$ with $t\ge0$.`, pts: [2, 3, 2, 3],
        parts: [
          R`Write $x$ and $y$ of $C_1$ as functions of $\theta$.`,
          R`Find the length of $C_1$ for $0\le\theta\le\ln2$.`,
          R`Find the range of $t$ where $C_2$ lies on or above the $x$-axis, and the range of $x$ it covers there.`,
          R`Find the area between $C_2$ and the $x$-axis.`,
        ],
        answer: [R`(1) $x=e^{2\theta}\cos\theta$, $y=e^{2\theta}\sin\theta$`, R`(2) $\frac{3\sqrt5}{2}$`, R`(3) $0\le t\le2$, so $0\le x\le4$`, R`(4) $\frac{128}{15}$`],
        sol: R`**(1)** $x=r\cos\theta=e^{2\theta}\cos\theta$ and $y=r\sin\theta=e^{2\theta}\sin\theta$.

**(2)** $r'=2e^{2\theta}$, so $r^2+r'^2=5e^{4\theta}$ and the root is $\sqrt5\,e^{2\theta}$:
$$\ell=\sqrt5\int_0^{\ln2}e^{2\theta}\,d\theta=\frac{\sqrt5}{2}(4-1)=\frac{3\sqrt5}{2}$$

**(3)** $y=t\left(4-t^2\right)=t(2-t)(2+t)$, which is $\ge0$ for $0\le t\le2$ (with $t\ge0$). There $x=t^2$ runs from $0$ to $4$.

**(4)** $\frac{dx}{dt}=2t$, so
$$\begin{aligned}A&=\int_0^2\left(4t-t^3\right)2t\,dt=\Big[\frac{8t^3}{3}-\frac{2t^5}{5}\Big]_0^2\\[4pt]&=\frac{64}{3}-\frac{64}{5}=\frac{128}{15}\end{aligned}$$`,
      },
      {
        topic: "Improper integrals and L'Hôpital", label: 'Q.6', stem: R`Answer each part.`, pts: [3, 3, 4],
        parts: [
          R`$\displaystyle\lim_{x\to0}\frac{e^{2x}-1}{\sin x}$`,
          R`$\displaystyle\int_0^4\frac{dx}{\sqrt{4-x}}$`,
          R`Does $\displaystyle\int_1^{\infty}\frac{\ln x}{x}\,dx$ converge? If so, find its value.`,
        ],
        answer: [R`(1) $2$`, R`(2) $4$`, R`(3) it diverges`],
        sol: R`**(1)** The form is $\frac{0}{0}$, so L'Hôpital's rule applies: $\lim_{x\to0}\frac{2e^{2x}}{\cos x}=\frac{2}{1}=2$.

**(2)** The integrand diverges at $x=4$, an open boundary, so integrate up to $w<4$. A primitive is $-2\sqrt{4-x}$ (the inside brings the minus sign):
$$\int_0^{w}\frac{dx}{\sqrt{4-x}}=4-2\sqrt{4-w}$$
As $w\to4$ this tends to $4$: the integral converges.

**(3)** With $u=\ln x$, $du=\frac{dx}{x}$: $\int\frac{\ln x}{x}\,dx=\frac{(\ln x)^2}{2}$. So $\int_1^{w}\frac{\ln x}{x}\,dx=\frac{(\ln w)^2}{2}$, which grows without bound: the integral diverges, even though $\frac{\ln x}{x}\to0$.`,
      },
    ],
  },
];
