// The Exams tab of Calculus midterm 2: mock midterms in the format of the past midterms of the integral part
// (AY2022–AY2024: [1] six integrals to calculate, then problems on motion and on area and volume), over the lessons
// of 2–19 Nov: [1] covers primitives, substitution, partial fractions and arctan forms, parts, definite integrals and
// an improper integral; [2] motion (or, in Mock 2, a Riemann sum); [3] area, volume, length or average; [4] a
// parametric or polar curve, or an improper integral with L'Hôpital's rule. 60 minutes and 100 points each.
// Same markup as content.mjs; `pts` gives the points of each part, `labels` the paper-style labels ((a), (b) …).
// No function of a past paper or an in-class sheet is reused (leakcheck.mjs). Every answer is checked in verify.py.
const R = String.raw;
const NOV19 = '2026-11-19';
const CALC = R`Calculate the integrals.`;

export const mocks = [
  {
    id: 'im1', title: 'Mock Midterm 1', minutes: 60, added: NOV19,
    qs: [
      {
        topic: 'Integrals', label: '[1]', stem: CALC, pts: [8, 8, 8, 8, 8, 8],
        parts: [
          R`$\displaystyle\int\left(4x^3-\frac{3}{\sqrt x}+\frac{2}{x}\right)dx$`,
          R`$\displaystyle\int\frac{e^x}{e^x+3}\,dx$`,
          R`$\displaystyle\int\frac{x+5}{x^2+x-2}\,dx$`,
          R`$\displaystyle\int x\cos2x\,dx$`,
          R`$\displaystyle\int_0^{\pi/4}\frac{\tan x}{\cos^2x}\,dx$`,
          R`$\displaystyle\int_0^{\infty}\frac{dx}{x^2+4}$`,
        ],
        answer: [R`(1) $x^4-6\sqrt x+2\ln|x|+C$`, R`(2) $\ln\left(e^x+3\right)+C$`, R`(3) $2\ln|x-1|-\ln|x+2|+C$`,
          R`(4) $\frac{x}{2}\sin2x+\frac{1}{4}\cos2x+C$`, R`(5) $\frac{1}{2}$`, R`(6) $\frac{\pi}{4}$`],
        sol: R`**(1)** Term by term. $\frac{3}{\sqrt x}=3x^{-1/2}$, and the power rule divides by the new exponent $\frac{1}{2}$: $\int3x^{-1/2}\,dx=6\sqrt x$. So the primitive is $x^4-6\sqrt x+2\ln|x|+C$.

**(2)** The top is the derivative of the bottom: $(e^x+3)'=e^x$. So $\int\frac{f'}{f}\,dx=\ln|f|$ gives $\ln\left(e^x+3\right)+C$, with no absolute value needed, since $e^x+3>0$.

**(3)** The bottom factors: $x^2+x-2=(x-1)(x+2)$. Write $\frac{x+5}{(x-1)(x+2)}=\frac{A}{x-1}+\frac{B}{x+2}$, so $x+5=A(x+2)+B(x-1)$. At $x=1$: $6=3A$, so $A=2$; at $x=-2$: $3=-3B$, so $B=-1$.

So the integral is $\int\left(\frac{2}{x-1}-\frac{1}{x+2}\right)dx=2\ln|x-1|-\ln|x+2|+C$.

**(4)** By parts, differentiating $x$: $f=x$, $g'=\cos2x$, so $f'=1$ and $g=\frac{1}{2}\sin2x$:
$$\begin{aligned}&\int x\cos2x\,dx\\[4pt]&=\frac{x}{2}\sin2x-\int\frac{1}{2}\sin2x\,dx\\[4pt]&=\frac{x}{2}\sin2x+\frac{1}{4}\cos2x+C\end{aligned}$$

**(5)** Substitute $u=\tan x$: $du=\frac{dx}{\cos^2x}$, and the limits move to $u=\tan0=0$ and $u=\tan\frac{\pi}{4}=1$. So the integral is $\int_0^1u\,du=\Big[\frac{u^2}{2}\Big]_0^1=\frac{1}{2}$.

**(6)** The upper limit is infinite, so integrate up to $w$ first. With $\int\frac{dx}{x^2+a^2}=\frac{1}{a}\arctan\frac{x}{a}$ and $a=2$:
$$\int_0^{w}\frac{dx}{x^2+4}=\frac{1}{2}\arctan\frac{w}{2}$$

As $w\to\infty$, $\arctan\frac{w}{2}\to\frac{\pi}{2}$, so the integral converges to $\frac{1}{2}\cdot\frac{\pi}{2}=\frac{\pi}{4}$.`,
      },
      {
        topic: 'Velocity and distance', label: '[2]', labels: ['a', 'b'], pts: [6, 12],
        stem: R`A point moves along a straight line, the $s$-axis, with velocity $v(t)=6t-3t^2$ m/s, and it starts at $s(0)=2$ m.`,
        parts: [R`Find its position $s(t)$.`, R`Find its displacement and the distance it travels during $0\le t\le3$ [s].`],
        answer: [R`(a) $s(t)=3t^2-t^3+2$ m`, R`(b) displacement $0$ m, distance $8$ m`],
        sol: R`**(a)** The position is a primitive of the velocity: $s(t)=3t^2-t^3+C$. Then $s(0)=C=2$, so $s(t)=3t^2-t^3+2$.

**(b)** The displacement is the integral of $v$: $s(3)-s(0)=(27-27+2)-2=0$. The point ends where it started.

For the distance, find where it turns: $v=3t(2-t)$ is positive for $0<t<2$ and negative for $2<t\le3$. So split at $t=2$ and add both parts as positive numbers.

With $F(t)=3t^2-t^3$: $\int_0^2v\,dt=F(2)-F(0)=4$ and $\int_2^3v\,dt=F(3)-F(2)=0-4=-4$. The distance is $4+4=8$ m: the integral alone, $0$, is the displacement, not the distance.`,
      },
      {
        topic: 'Area and volume', label: '[3]', labels: ['a', 'b'], pts: [8, 12],
        stem: R`The region $R$ lies between the curves $y=\sqrt x$ and $y=\frac{x}{2}$.`,
        parts: [R`Find where the curves meet, and the area of $R$.`, R`Find the volume of the solid generated when $R$ is revolved about the $x$-axis.`],
        answer: [R`(a) at $x=0$ and $x=4$; the area is $\frac{4}{3}$`, R`(b) $\frac{8\pi}{3}$`],
        sol: R`**(a)** $\sqrt x=\frac{x}{2}$ gives $x=\frac{x^2}{4}$, that is $x(x-4)=0$: they meet at $x=0$ and $x=4$. In between, $\sqrt x$ is on top (at $x=1$, $1>\frac{1}{2}$), so
$$\begin{aligned}A&=\int_0^4\left(\sqrt x-\frac{x}{2}\right)dx\\[4pt]&=\Big[\frac{2}{3}x^{3/2}-\frac{x^2}{4}\Big]_0^4\\[4pt]&=\frac{16}{3}-4=\frac{4}{3}\end{aligned}$$

**(b)** The solid has a hole: each slice is a ring with outer radius $\sqrt x$ and inner radius $\frac{x}{2}$, so
$$\begin{aligned}V&=\pi\int_0^4\left(x-\frac{x^2}{4}\right)dx\\[4pt]&=\pi\Big[\frac{x^2}{2}-\frac{x^3}{12}\Big]_0^4\\[4pt]&=\pi\left(8-\frac{16}{3}\right)=\frac{8\pi}{3}\end{aligned}$$
Square each radius before subtracting: $\pi\int(\sqrt x-\frac{x}{2})^2\,dx$ is a different, wrong number.`,
      },
      {
        topic: 'Parametric curve', label: '[4]', labels: ['a', 'b', 'c'], pts: [4, 6, 4],
        stem: R`A curve is given by $x=t^2$, $y=\frac{2}{3}t^3$, with $t\ge0$.`,
        parts: [R`Find $\frac{dy}{dx}$ at $t=1$.`, R`Find the length of the curve for $0\le t\le\sqrt3$.`, R`Find the area between the curve, the $x$-axis and the line $x=3$.`],
        answer: [R`(a) $1$`, R`(b) $\frac{14}{3}$`, R`(c) $\frac{12\sqrt3}{5}$`],
        sol: R`**(a)** $\frac{dx}{dt}=2t$ and $\frac{dy}{dt}=2t^2$, so $\frac{dy}{dx}=\frac{2t^2}{2t}=t$, which is $1$ at $t=1$.

**(b)** $\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2=4t^2+4t^4=4t^2(1+t^2)$, and its root is $2t\sqrt{1+t^2}$ (with $t\ge0$). Substitute $u=1+t^2$, $du=2t\,dt$, with the limits $u=1$ and $u=4$:
$$\ell=\int_0^{\sqrt3}2t\sqrt{1+t^2}\,dt=\int_1^4\sqrt u\,du=\frac{2}{3}(8-1)=\frac{14}{3}$$

**(c)** Convert the region of integral first: $x=t^2=3$ gives $t=\sqrt3$, and $x=0$ gives $t=0$. Then $dx=2t\,dt$:
$$\begin{aligned}A&=\int_0^{\sqrt3}\frac{2}{3}t^3\cdot2t\,dt=\frac{4}{3}\Big[\frac{t^5}{5}\Big]_0^{\sqrt3}\\[4pt]&=\frac{4}{15}\cdot9\sqrt3=\frac{12\sqrt3}{5}\end{aligned}$$
since $\left(\sqrt3\right)^5=9\sqrt3$.`,
      },
    ],
  },
  {
    id: 'im2', title: 'Mock Midterm 2', minutes: 60, added: NOV19,
    qs: [
      {
        topic: 'Integrals', label: '[1]', stem: CALC, pts: [8, 8, 8, 8, 8, 8],
        parts: [
          R`$\displaystyle\int\left(2^x+\frac{1}{1+x^2}\right)dx$`,
          R`$\displaystyle\int\cos x\sqrt{1+\sin x}\,dx$`,
          R`$\displaystyle\int\frac{dx}{x^2+6x+13}$`,
          R`$\displaystyle\int x^2\ln x\,dx$`,
          R`$\displaystyle\int_0^{\sqrt3}\frac{x^3}{\sqrt{x^2+1}}\,dx$`,
          R`$\displaystyle\int_1^{\infty}\frac{dx}{2x+1}$`,
        ],
        answer: [R`(1) $\frac{2^x}{\ln2}+\arctan x+C$`, R`(2) $\frac{2}{3}(1+\sin x)^{3/2}+C$`, R`(3) $\frac{1}{2}\arctan\frac{x+3}{2}+C$`,
          R`(4) $\frac{x^3}{3}\ln x-\frac{x^3}{9}+C$`, R`(5) $\frac{4}{3}$`, R`(6) it diverges`],
        sol: R`**(1)** $\int b^x\,dx=\frac{b^x}{\ln b}$, so $\int2^x\,dx=\frac{2^x}{\ln2}$, and $\int\frac{dx}{1+x^2}=\arctan x$.

**(2)** Substitute $u=1+\sin x$: $du=\cos x\,dx$, so the integral is $\int\sqrt u\,du=\frac{2}{3}u^{3/2}+C=\frac{2}{3}(1+\sin x)^{3/2}+C$.

**(3)** The bottom doesn't factor, since $\Delta=36-52<0$. So make a square: $x^2+6x+13=(x+3)^2+4$. With $u=x+3$ and $a=2$:
$$\int\frac{dx}{(x+3)^2+2^2}=\frac{1}{2}\arctan\frac{x+3}{2}+C$$

**(4)** By parts, differentiating $\ln x$: $f=\ln x$ and $g'=x^2$, so $f'=\frac{1}{x}$ and $g=\frac{x^3}{3}$:
$$\begin{aligned}\int x^2\ln x\,dx&=\frac{x^3}{3}\ln x-\int\frac{x^3}{3}\cdot\frac{1}{x}\,dx\\[4pt]&=\frac{x^3}{3}\ln x-\frac{x^3}{9}+C\end{aligned}$$

**(5)** Substitute $u=x^2+1$: $du=2x\,dx$ and $x^2=u-1$, and the limits move to $u=1$ and $u=4$:
$$\begin{aligned}&\int_0^{\sqrt3}\frac{x^2\cdot x\,dx}{\sqrt{x^2+1}}\\[4pt]&=\frac{1}{2}\int_1^4\frac{u-1}{\sqrt u}\,du\\[4pt]&=\frac{1}{2}\int_1^4\left(u^{1/2}-u^{-1/2}\right)du\end{aligned}$$

That is $\Big[\frac{1}{3}u^{3/2}-u^{1/2}\Big]_1^4=\left(\frac{8}{3}-2\right)-\left(\frac{1}{3}-1\right)=\frac{2}{3}+\frac{2}{3}=\frac{4}{3}$.

**(6)** Integrate up to $w$: $\int_1^{w}\frac{dx}{2x+1}=\frac{1}{2}\ln(2w+1)-\frac{1}{2}\ln3$. As $w\to\infty$, $\ln(2w+1)\to\infty$, so the integral diverges: like $\frac{1}{x}$, the integrand shrinks too slowly.`,
      },
      {
        topic: 'Riemann sum', label: '[2]', labels: ['a', 'b'], pts: [10, 6],
        stem: R`Let $f(x)=3x^2+2$ on $[0,2]$, cut into $n$ strips of equal width.`,
        parts: [R`Write the Riemann sum $S_n$ with right endpoints, and simplify it to a formula in $n$.`, R`Find $\displaystyle\lim_{n\to\infty}S_n$, and check it with a primitive.`],
        answer: [R`(a) $S_n=12+\frac{12}{n}+\frac{4}{n^2}$`, R`(b) $12$`],
        sol: R`**(a)** $\Delta x=\frac{2-0}{n}=\frac{2}{n}$ and $x_k=\frac{2k}{n}$, so $f(x_k)=3\cdot\frac{4k^2}{n^2}+2=\frac{12k^2}{n^2}+2$.

Take the constants out of the sums, and remember $\sum_{k=1}^{n}2=2n$:
$$\begin{aligned}S_n&=\sum_{k=1}^{n}\left(\frac{12k^2}{n^2}+2\right)\frac{2}{n}\\[4pt]&=\frac{24}{n^3}\sum_{k=1}^{n}k^2+\frac{4}{n}\cdot n\end{aligned}$$

With $\sum_{k=1}^{n}k^2=\frac{n(n+1)(2n+1)}{6}$:
$$\begin{aligned}S_n&=\frac{4(n+1)(2n+1)}{n^2}+4\\[4pt]&=\frac{8n^2+12n+4}{n^2}+4=12+\frac{12}{n}+\frac{4}{n^2}\end{aligned}$$
Check with $n=1$: one strip of width $2$ and height $f(2)=14$ gives $28=12+12+4$.

**(b)** $\frac{12}{n}\to0$ and $\frac{4}{n^2}\to0$, so $S_n\to12$. With the primitive $x^3+2x$: $\int_0^2(3x^2+2)\,dx=8+4=12$.`,
      },
      {
        topic: 'Length and average', label: '[3]', labels: ['a', 'b'], pts: [10, 8],
        stem: '',
        parts: [R`Find the length of the curve $y=\frac{1}{3}\left(x^2+2\right)^{3/2}$ on $[0,3]$.`, R`Find the average value of $f(x)=x\cos x$ on $\left[0,\frac{\pi}{2}\right]$.`],
        answer: [R`(a) $12$`, R`(b) $1-\frac{2}{\pi}$`],
        sol: R`**(a)** Chain rule: $y'=\frac{1}{3}\cdot\frac{3}{2}\left(x^2+2\right)^{1/2}\cdot2x=x\sqrt{x^2+2}$. Under the root of the length:
$$1+y'^2=1+x^4+2x^2=\left(x^2+1\right)^2$$
a perfect square.

So $\ell=\int_0^3\left(x^2+1\right)dx=\Big[\frac{x^3}{3}+x\Big]_0^3=9+3=12$.

**(b)** By parts, differentiating $x$: $\int x\cos x\,dx=x\sin x-\int\sin x\,dx=x\sin x+\cos x$. So
$$\begin{aligned}\int_0^{\pi/2}x\cos x\,dx&=\left(\frac{\pi}{2}+0\right)-(0+1)\\[4pt]&=\frac{\pi}{2}-1\end{aligned}$$

The average divides by the length of the interval, $\frac{\pi}{2}$: $\bar f=\frac{2}{\pi}\left(\frac{\pi}{2}-1\right)=1-\frac{2}{\pi}$.`,
      },
      {
        topic: 'Polar curve', label: '[4]', labels: ['a', 'b', 'c'], pts: [4, 6, 8],
        stem: R`The curve $r=\sin^3\frac{\theta}{3}$ in polar coordinates, for $0\le\theta\le3\pi$.`,
        parts: [R`Write $x$ and $y$ as functions of $\theta$.`, R`Show that $r^2+\left(\frac{dr}{d\theta}\right)^2=\sin^4\frac{\theta}{3}$.`, R`Find the length of the curve.`],
        answer: [R`(a) $x=\sin^3\frac{\theta}{3}\cos\theta$, $y=\sin^3\frac{\theta}{3}\sin\theta$`, R`(b) $\sin^6\frac{\theta}{3}+\sin^4\frac{\theta}{3}\cos^2\frac{\theta}{3}=\sin^4\frac{\theta}{3}$`, R`(c) $\frac{3\pi}{2}$`],
        sol: R`**(a)** $x=r\cos\theta$ and $y=r\sin\theta$, with $r=\sin^3\frac{\theta}{3}$.

**(b)** Chain rule, with the inner derivative $\frac{1}{3}$: $\frac{dr}{d\theta}=3\sin^2\frac{\theta}{3}\cdot\cos\frac{\theta}{3}\cdot\frac{1}{3}=\sin^2\frac{\theta}{3}\cos\frac{\theta}{3}$. Then
$$\begin{aligned}r^2+r'^2&=\sin^6\frac{\theta}{3}+\sin^4\frac{\theta}{3}\cos^2\frac{\theta}{3}\\[4pt]&=\sin^4\frac{\theta}{3}\left(\sin^2\frac{\theta}{3}+\cos^2\frac{\theta}{3}\right)=\sin^4\frac{\theta}{3}\end{aligned}$$

**(c)** The root is $\sin^2\frac{\theta}{3}$, which is never negative, so no absolute value is needed. With the power-reducing formula $\sin^2u=\frac{1-\cos2u}{2}$:
$$\begin{aligned}\ell&=\int_0^{3\pi}\frac{1-\cos\frac{2\theta}{3}}{2}\,d\theta\\[4pt]&=\Big[\frac{\theta}{2}-\frac{3}{4}\sin\frac{2\theta}{3}\Big]_0^{3\pi}=\frac{3\pi}{2}\end{aligned}$$
since $\sin2\pi=0$.`,
      },
    ],
  },
  {
    id: 'im3', title: 'Mock Midterm 3', minutes: 60, added: NOV19,
    qs: [
      {
        topic: 'Integrals', label: '[1]', stem: CALC, pts: [8, 8, 8, 8, 8, 8],
        parts: [
          R`$\displaystyle\int\frac{\left(\sqrt x+1\right)^2}{x}\,dx$`,
          R`$\displaystyle\int\frac{\sin(\ln x)}{x}\,dx$`,
          R`$\displaystyle\int\frac{2x-3}{x^2+4}\,dx$`,
          R`$\displaystyle\int\arctan x\,dx$`,
          R`$\displaystyle\int_0^{\pi/2}\sin3x\cos x\,dx$`,
          R`$\displaystyle\int_0^{\pi/2}\frac{\cos x}{\sqrt{\sin x}}\,dx$`,
        ],
        answer: [R`(1) $x+4\sqrt x+\ln x+C$`, R`(2) $-\cos(\ln x)+C$`, R`(3) $\ln\left(x^2+4\right)-\frac{3}{2}\arctan\frac{x}{2}+C$`,
          R`(4) $x\arctan x-\frac{1}{2}\ln\left(1+x^2\right)+C$`, R`(5) $\frac{1}{2}$`, R`(6) $2$`],
        sol: R`**(1)** Expand first: $\frac{x+2\sqrt x+1}{x}=1+2x^{-1/2}+\frac{1}{x}$. So the primitive is $x+4\sqrt x+\ln x+C$, with $\ln x$ rather than $\ln|x|$ because $\sqrt x$ needs $x>0$.

**(2)** Substitute $u=\ln x$: $du=\frac{dx}{x}$, so the integral is $\int\sin u\,du=-\cos u+C=-\cos(\ln x)+C$.

**(3)** Split the fraction. The first part has the derivative of the bottom on top, and the second is an arctan form with $a=2$:
$$\begin{aligned}&\int\frac{2x}{x^2+4}\,dx-3\int\frac{dx}{x^2+4}\\[4pt]&=\ln\left(x^2+4\right)\\&\quad-\frac{3}{2}\arctan\frac{x}{2}+C\end{aligned}$$

**(4)** By parts with $\arctan x=1\cdot\arctan x$: $f=\arctan x$, $g'=1$, so $f'=\frac{1}{1+x^2}$ and $g=x$:
$$\begin{aligned}\int\arctan x\,dx&=x\arctan x\\&\quad-\int\frac{x}{1+x^2}\,dx\end{aligned}$$
and the last integral is $\frac{1}{2}\ln\left(1+x^2\right)$.

**(5)** Product to sum: $\sin3x\cos x=\frac{1}{2}(\sin4x+\sin2x)$. So the integral is
$$\begin{aligned}&\frac{1}{2}\Big[-\frac{\cos4x}{4}-\frac{\cos2x}{2}\Big]_0^{\pi/2}\\[4pt]&=\frac{1}{2}\left(\frac{1}{4}+\frac{3}{4}\right)=\frac{1}{2}\end{aligned}$$
At $\frac{\pi}{2}$, $\cos2\pi=1$ and $\cos\pi=-1$, giving $-\frac{1}{4}+\frac{1}{2}=\frac{1}{4}$; at $0$ the bracket is $-\frac{1}{4}-\frac{1}{2}=-\frac{3}{4}$.

**(6)** $\sqrt{\sin x}\to0$ as $x\to0$, so the integrand diverges at $x=0$: an open boundary. Substitute $u=\sin x$, $du=\cos x\,dx$, and integrate from $w>0$:
$$\begin{aligned}\int_w^{\pi/2}\frac{\cos x}{\sqrt{\sin x}}\,dx&=\Big[2\sqrt{\sin x}\Big]_w^{\pi/2}\\[4pt]&=2-2\sqrt{\sin w}\end{aligned}$$
As $w\to0$, $\sin w\to0$, so the integral converges to $2$.`,
      },
      {
        topic: 'Velocity and distance', label: '[2]', labels: ['a', 'b', 'c'], pts: [8, 4, 6],
        stem: R`A point moves along the $s$-axis with acceleration $a(t)=6t-4$ m/s$^2$. At $t=0$ its velocity is $1$ m/s and its position is $0$ m.`,
        parts: [R`Find its velocity $v(t)$ and position $s(t)$.`, R`When is it at rest?`, R`Find the distance it travels during $0\le t\le1$ [s].`],
        answer: [R`(a) $v(t)=3t^2-4t+1$, $s(t)=t^3-2t^2+t$`, R`(b) at $t=\frac{1}{3}$ s and $t=1$ s`, R`(c) $\frac{8}{27}$ m`],
        sol: R`**(a)** $v$ is a primitive of $a$: $v(t)=3t^2-4t+C_1$, and $v(0)=C_1=1$. Then $s$ is a primitive of $v$: $s(t)=t^3-2t^2+t+C_2$, and $s(0)=C_2=0$.

**(b)** At rest means $v=0$: $3t^2-4t+1=(3t-1)(t-1)=0$, so $t=\frac{1}{3}$ and $t=1$.

**(c)** $v>0$ before $t=\frac{1}{3}$ and $v<0$ between $\frac{1}{3}$ and $1$, so the point turns at $t=\frac{1}{3}$. Use the positions: $s(0)=0$, $s\left(\frac{1}{3}\right)=\frac{1}{27}-\frac{2}{9}+\frac{1}{3}=\frac{4}{27}$ and $s(1)=0$.

It goes $\frac{4}{27}$ m forward and $\frac{4}{27}$ m back: the distance is $\frac{8}{27}$ m, while the displacement is $0$.`,
      },
      {
        topic: 'Area and volume', label: '[3]', labels: ['a', 'b'], pts: [8, 12],
        stem: R`The region $R$ lies between $y=x$ and $y=x^3$, for $0\le x\le1$.`,
        parts: [R`Find the area of $R$.`, R`Find the volume of the solid generated when $R$ is revolved about the $x$-axis.`],
        answer: [R`(a) $\frac{1}{4}$`, R`(b) $\frac{4\pi}{21}$`],
        sol: R`**(a)** On $[0,1]$, $x\ge x^3$ (at $x=\frac{1}{2}$, $\frac{1}{2}>\frac{1}{8}$), so $A=\int_0^1\left(x-x^3\right)dx=\frac{1}{2}-\frac{1}{4}=\frac{1}{4}$.

**(b)** A ring at each $x$, with outer radius $x$ and inner radius $x^3$:
$$\begin{aligned}V&=\pi\int_0^1\left(x^2-x^6\right)dx\\[4pt]&=\pi\left(\frac{1}{3}-\frac{1}{7}\right)=\frac{4\pi}{21}\end{aligned}$$`,
      },
      {
        topic: "Improper integral and L'Hôpital", label: '[4]', labels: ['a', 'b'], pts: [4, 10],
        stem: '',
        parts: [R`Find $\displaystyle\lim_{w\to\infty}w^2e^{-w}$.`, R`Evaluate $\displaystyle\int_0^{\infty}x^2e^{-x}\,dx$.`],
        answer: [R`(a) $0$`, R`(b) $2$`],
        sol: R`**(a)** $w^2e^{-w}=\frac{w^2}{e^w}$ is $\frac{\infty}{\infty}$. L'Hôpital's rule gives $\frac{2w}{e^w}$, again $\frac{\infty}{\infty}$, and once more $\frac{2}{e^w}\to0$. So the limit is $0$.

**(b)** By parts twice, each time differentiating the power of $x$:
$$\begin{aligned}\int x^2e^{-x}\,dx&=-x^2e^{-x}+2\int xe^{-x}\,dx\\[4pt]&=-\left(x^2+2x+2\right)e^{-x}+C\end{aligned}$$
using $\int xe^{-x}\,dx=-(x+1)e^{-x}$.

The upper limit is infinite, so integrate up to $w$: $\int_0^{w}x^2e^{-x}\,dx=2-\left(w^2+2w+2\right)e^{-w}$. By (a) and its steps, $w^2e^{-w}$, $we^{-w}$ and $e^{-w}$ all tend to $0$, so the integral converges to $2$.`,
      },
    ],
  },
];
