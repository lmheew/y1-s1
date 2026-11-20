// Follow-up quizzes for the Calculus midterm 2 page: two per in-class quiz. A = same skills, new numbers.
// B = targets the usual slips. Same structure and point values as the in-class sheet (10 pt each).
// Checked in verify.py (this folder).
const R = String.raw;
const NOV6 = '2026-11-06';
const NOV10 = '2026-11-10';
const NOV13 = '2026-11-13';
const NOV17 = '2026-11-17';
const NOV20 = '2026-11-20';

export const followups = {
  '06': [
    { added: NOV6, focus: 'Each question mirrors Quiz 06 with new numbers.', qs: [
      { label: 'Q.1', pts: '1pt', stem: R`Give the general form of the Riemann sum $S_N$ of $f(x)$ on the interval $I$ (right endpoints, $N$ strips) as a formula in $N$, and its limit.`,
        parts: [R`$f(x)=3x^2-2x+2$;  $I:\ [0,1]$`],
        answer: [R`(1) $S_N=\frac{4N^2+N+1}{2N^2}$, which tends to $2$`],
        sol: R`
$\Delta x=\frac{1}{N}$ and $x_k=\frac{k}{N}$, so
$$S_N=\sum_{k=1}^{N}\left(\frac{3k^2}{N^2}-\frac{2k}{N}+2\right)\frac{1}{N}$$

Take the constants out and use the partial sums:
$$S_N=\frac{3}{N^3}\cdot\frac{N(N+1)(2N+1)}{6}-\frac{2}{N^2}\cdot\frac{N(N+1)}{2}+2$$

Over the common denominator $2N^2$:
$$S_N=\frac{(N+1)(2N+1)-2N(N+1)+4N^2}{2N^2}=\frac{4N^2+N+1}{2N^2}$$

As $N\to\infty$, $S_N\to\frac{4}{2}=2$. Check: $\int_0^1(3x^2-2x+2)\,dx=1-1+2=2$.` },
      { label: 'Q.2', pts: '2pt×4', stem: R`Compute the definite integrals of $f(x)$ over the interval $I$.`,
        parts: [R`$f(x)=x^3-3x^2+2$;  $I:\ -1\le x\le2$`, R`$f(x)=\cos3x$;  $I:\ 0\le x\le\frac{\pi}{6}$`,
                R`$f(x)=e^{-2x}$;  $I:\ 0\le x\le1$`, R`$f(x)=\frac{1}{1+x^2}$;  $I:\ 0\le x\le\sqrt3$`],
        answer: [R`(1) $\frac{3}{4}$`, R`(2) $\frac{1}{3}$`, R`(3) $\frac{1-e^{-2}}{2}$`, R`(4) $\frac{\pi}{3}$`],
        sol: R`
**(1)** $F(x)=\frac{x^4}{4}-x^3+2x$. $F(2)=4-8+4=0$ and $F(-1)=\frac{1}{4}+1-2=-\frac{3}{4}$, so the integral is $0-\left(-\frac{3}{4}\right)=\frac{3}{4}$.

**(2)** $F(x)=\frac{\sin3x}{3}$. $F\left(\frac{\pi}{6}\right)=\frac{1}{3}\sin\frac{\pi}{2}=\frac{1}{3}$ and $F(0)=0$, so the integral is $\frac{1}{3}$.

**(3)** $F(x)=-\frac{e^{-2x}}{2}$. $F(1)-F(0)=-\frac{e^{-2}}{2}+\frac{1}{2}=\frac{1-e^{-2}}{2}$.

**(4)** $F(x)=\arctan x$. $\arctan\sqrt3-\arctan0=\frac{\pi}{3}-0=\frac{\pi}{3}$.` },
      { label: 'Q.3', pts: '1pt', stem: R`Compute the area enclosed by $f(x)$ and the $x$-axis on the interval $I$, using integration.
$$f(x)=x^2-3x+2;\quad I:\ [0,3]$$`,
        parts: [],
        answer: [R`$\frac{11}{6}$`],
        sol: R`
$f(x)=(x-1)(x-2)$: positive on $[0,1)$, negative on $(1,2)$, positive on $(2,3]$. Use $F(x)=\frac{x^3}{3}-\frac{3x^2}{2}+2x$:
$$\begin{aligned}F(0)&=0,\quad F(1)=\frac{5}{6}\\F(2)&=\frac{2}{3},\quad F(3)=\frac{3}{2}\end{aligned}$$

The three pieces are $\frac{5}{6}$, $\frac{2}{3}-\frac{5}{6}=-\frac{1}{6}$ and $\frac{3}{2}-\frac{2}{3}=\frac{5}{6}$.

The area adds them as positive numbers: $\frac{5}{6}+\frac{1}{6}+\frac{5}{6}=\frac{11}{6}$. The integral alone would give $\frac{3}{2}$.` },
    ]},
    { added: NOV6, focus: 'Targets the usual slips: Δx on an interval longer than 1, signs at a negative limit, the minus of ∫ sin x, dividing by the number inside, arctan of a negative number, and splitting an area at its zeros.', qs: [
      { label: 'Q.1', pts: '1pt', stem: R`Give the general form of the Riemann sum $S_N$ of $f(x)$ on the interval $I$ (right endpoints, $N$ strips) as a formula in $N$, and its limit.`,
        parts: [R`$f(x)=x^2+1$;  $I:\ [0,2]$`],
        answer: [R`(1) $S_N=\frac{14N^2+12N+4}{3N^2}$, which tends to $\frac{14}{3}$`],
        sol: R`
The interval has length $2$, so $\Delta x=\frac{2}{N}$ (not $\frac{1}{N}$) and $x_k=\frac{2k}{N}$:
$$\begin{aligned}S_N&=\sum_{k=1}^{N}\left(\frac{4k^2}{N^2}+1\right)\frac{2}{N}\\[4pt]&=\frac{8}{N^3}\sum_{k=1}^{N}k^2+\frac{2}{N}\sum_{k=1}^{N}1\end{aligned}$$

The constant is added $N$ times, so the last term is $2$:
$$S_N=\frac{4(N+1)(2N+1)}{3N^2}+2=\frac{14N^2+12N+4}{3N^2}$$

As $N\to\infty$, $S_N\to\frac{14}{3}$. Check: $\int_0^2(x^2+1)\,dx=\frac{8}{3}+2=\frac{14}{3}$.` },
      { label: 'Q.2', pts: '2pt×4', stem: R`Compute the definite integrals of $f(x)$ over the interval $I$.`,
        parts: [R`$f(x)=2x^3-x^2+3$;  $I:\ -2\le x\le1$`, R`$f(x)=\sin3x$;  $I:\ 0\le x\le\frac{\pi}{3}$`,
                R`$f(x)=e^{-x}$;  $I:\ -1\le x\le0$`, R`$f(x)=\frac{1}{1+x^2}$;  $I:\ -\sqrt3\le x\le1$`],
        answer: [R`(1) $-\frac{3}{2}$`, R`(2) $\frac{2}{3}$`, R`(3) $e-1$`, R`(4) $\frac{7\pi}{12}$`],
        sol: R`
**(1)** $F(x)=\frac{x^4}{2}-\frac{x^3}{3}+3x$. Work out $F(-2)$ on its own line: $\frac{16}{2}-\frac{-8}{3}+3\cdot(-2)=8+\frac{8}{3}-6=\frac{14}{3}$. And $F(1)=\frac{1}{2}-\frac{1}{3}+3=\frac{19}{6}$. The integral is $\frac{19}{6}-\frac{14}{3}=-\frac{3}{2}$.

**(2)** $F(x)=-\frac{\cos3x}{3}$. $F\left(\frac{\pi}{3}\right)=-\frac{\cos\pi}{3}=\frac{1}{3}$ and $F(0)=-\frac{1}{3}$, so the integral is $\frac{1}{3}-\left(-\frac{1}{3}\right)=\frac{2}{3}$.

**(3)** $a=-1$, so $F(x)=-e^{-x}$. $F(0)=-1$ and $F(-1)=-e$, so the integral is $-1-(-e)=e-1$.

**(4)** $\arctan1-\arctan(-\sqrt3)=\frac{\pi}{4}-\left(-\frac{\pi}{3}\right)=\frac{7\pi}{12}$.` },
      { label: 'Q.3', pts: '1pt', stem: R`Compute the area enclosed by $f(x)$ and the $x$-axis on the interval $I$, using integration.
$$f(x)=x^2-1;\quad I:\ [-2,0]$$`,
        parts: [],
        answer: [R`$2$`],
        sol: R`
$f(x)=(x-1)(x+1)$ is $0$ at $x=-1$: positive on $[-2,-1)$ and negative on $(-1,0]$. Use $F(x)=\frac{x^3}{3}-x$:
$$\begin{aligned}F(-2)&=-\frac{8}{3}+2=-\frac{2}{3}\\F(-1)&=-\frac{1}{3}+1=\frac{2}{3}\\F(0)&=0\end{aligned}$$

The pieces are $F(-1)-F(-2)=\frac{4}{3}$ and $F(0)-F(-1)=-\frac{2}{3}$.

The area is $\frac{4}{3}+\frac{2}{3}=2$. The integral alone, $F(0)-F(-2)=\frac{2}{3}$, is not the area.` },
    ]},
  ],
  '07': [
    { added: NOV10, focus: 'Each question mirrors Quiz 07 with new numbers.', qs: [
      { label: 'Q.1', pts: '2pt×4', stem: R`Compute the definite integrals over the interval $D$.`,
        parts: [R`$f(x)=\frac{x+2}{x^2+4x+4}$;  $D:\ [0,2]$`, R`$f(x)=\cos^2(x)\cdot\sin(x)$;  $D:\ [0,\pi/2]$`,
                R`$f(x)=x\cdot e^{3x-1}$;  $D:\ [1/3,1]$`, R`$f(x)=\frac{1}{x^2-4x+5}$;  $D:\ [1,3]$`],
        answer: [R`(1) $\ln2$`, R`(2) $\frac{1}{3}$`, R`(3) $\frac{2e^2}{9}$`, R`(4) $\frac{\pi}{2}$`],
        sol: R`
**(1)** $x^2+4x+4=(x+2)^2$, so $f(x)=\frac{1}{x+2}$ and $\Big[\ln(x+2)\Big]_0^2=\ln4-\ln2=\ln2$.

**(2)** $u=\cos x$ and $du=-\sin x\,dx$. The limits: $x=0$ gives $u=1$, and $x=\frac{\pi}{2}$ gives $u=0$. So $\int_1^0u^2(-du)=\int_0^1u^2\,du=\frac{1}{3}$.

**(3)** By parts with $f=x$ and $g'=e^{3x-1}$, so $g=\frac{e^{3x-1}}{3}$: $F(x)=\frac{x}{3}e^{3x-1}-\frac{e^{3x-1}}{9}=\frac{e^{3x-1}}{9}(3x-1)$. Then $F(1)=\frac{2e^2}{9}$ and $F\left(\frac{1}{3}\right)=0$.

**(4)** $x^2-4x+5=(x-2)^2+1$. With $u=x-2$ the limits are $-1$ and $1$: $\arctan1-\arctan(-1)=\frac{\pi}{4}+\frac{\pi}{4}=\frac{\pi}{2}$.` },
      { label: 'Q.2', pts: '2pt', stem: R`Compute the following definite integral.
$$\int_{\pi/3}^{\pi/2}\frac{1}{1+\cos(x)}\,dx$$`,
        parts: [],
        answer: [R`$1-\frac{\sqrt3}{3}=\frac{3-\sqrt3}{3}$`],
        sol: R`
With $u=\tan\frac{x}{2}$, $\frac{dx}{1+\cos x}=du$, so the primitive is $\tan\frac{x}{2}$.

$\Big[\tan\frac{x}{2}\Big]_{\pi/3}^{\pi/2}=\tan\frac{\pi}{4}-\tan\frac{\pi}{6}=1-\frac{\sqrt3}{3}$.` },
    ]},
    { added: NOV10, focus: 'Targets the usual slips: a perfect square in the denominator, the sign of du and the flipped limits with u = cos x, a negative number inside the exponential, factoring out a constant before arctan, and tan of an angle that is not in the table.', qs: [
      { label: 'Q.1', pts: '2pt×4', stem: R`Compute the definite integrals over the interval $D$.`,
        parts: [R`$f(x)=\frac{2x-2}{x^2-2x+1}$;  $D:\ [2,3]$`, R`$f(x)=\frac{\sin(x)}{\cos^3(x)}$;  $D:\ [0,\pi/3]$`,
                R`$f(x)=x\cdot e^{1-2x}$;  $D:\ [0,1/2]$`, R`$f(x)=\frac{1}{x^2+2x+4}$;  $D:\ [-1,2]$`],
        answer: [R`(1) $2\ln2$`, R`(2) $\frac{3}{2}$`, R`(3) $\frac{e-2}{4}$`, R`(4) $\frac{\pi}{3\sqrt3}=\frac{\sqrt3\,\pi}{9}$`],
        sol: R`
**(1)** $x^2-2x+1=(x-1)^2$, a perfect square, so this is not an arctan: $f(x)=\frac{2(x-1)}{(x-1)^2}=\frac{2}{x-1}$ and $\Big[2\ln(x-1)\Big]_2^3=2\ln2$. The top is also the derivative of the bottom, and $\Big[\ln(x^2-2x+1)\Big]_2^3=\ln4$ gives the same.

**(2)** $u=\cos x$ and $du=-\sin x\,dx$. The limits: $x=0$ gives $u=1$, and $x=\frac{\pi}{3}$ gives $u=\frac{1}{2}$. So $\int_1^{1/2}u^{-3}(-du)=\int_{1/2}^1u^{-3}\,du=\left[-\frac{1}{2u^2}\right]_{1/2}^1=-\frac{1}{2}+2=\frac{3}{2}$.

**(3)** By parts with $f=x$ and $g'=e^{1-2x}$. The number inside is $-2$, so $g=-\frac{e^{1-2x}}{2}$: $F(x)=-\frac{x}{2}e^{1-2x}-\frac{e^{1-2x}}{4}=-\frac{e^{1-2x}}{4}(2x+1)$. Then $F\left(\frac{1}{2}\right)=-\frac{1}{2}$ and $F(0)=-\frac{e}{4}$, so the integral is $\frac{e}{4}-\frac{1}{2}=\frac{e-2}{4}$.

**(4)** $x^2+2x+4=(x+1)^2+3=3\left[\left(\frac{x+1}{\sqrt3}\right)^2+1\right]$. With $u=\frac{x+1}{\sqrt3}$, $dx=\sqrt3\,du$, and the limits are $0$ and $\sqrt3$: $\frac{\sqrt3}{3}\Big[\arctan u\Big]_0^{\sqrt3}=\frac{1}{\sqrt3}\cdot\frac{\pi}{3}=\frac{\pi}{3\sqrt3}$.` },
      { label: 'Q.2', pts: '2pt', stem: R`Compute the following definite integral.
$$\int_0^{\pi/4}\frac{1}{1+\cos(x)}\,dx$$`,
        parts: [],
        answer: [R`$\sqrt2-1$`],
        sol: R`
The primitive is $\tan\frac{x}{2}$ (with $u=\tan\frac{x}{2}$), so the integral is $\tan\frac{\pi}{8}-\tan0=\tan\frac{\pi}{8}$.

$\frac{\pi}{8}$ is not in the table, but $\tan\frac{x}{2}=\frac{\sin x}{1+\cos x}$ with $x=\frac{\pi}{4}$ gives $\frac{\sqrt2/2}{1+\sqrt2/2}=\frac{\sqrt2}{2+\sqrt2}=\sqrt2-1$.` },
    ]},
  ],
  '08': [
    { added: NOV13, focus: 'Each question mirrors Quiz 08 with new numbers.', qs: [
      { label: 'Q.1', pts: '4pt', stem: R`Compute the volume of the solid of revolution generated by $f(x)$ within the interval $D$.
$$f(x)=2+\sin x;\quad D:\ 0\le x\le\pi$$`,
        parts: [],
        answer: [R`$\frac{9\pi^2}{2}+8\pi$`],
        sol: R`
$V=\pi\int_0^{\pi}f(x)^2\,dx$, and $f(x)^2=4+4\sin x+\sin^2x$. Term by term on $[0,\pi]$:
$$\begin{aligned}\int_0^{\pi}4\,dx&=4\pi\\\int_0^{\pi}4\sin x\,dx&=4\Big[-\cos x\Big]_0^{\pi}=8\end{aligned}$$

With $\sin^2x=\frac{1-\cos2x}{2}$: $\int_0^{\pi}\sin^2x\,dx=\Big[\frac{x}{2}-\frac{\sin2x}{4}\Big]_0^{\pi}=\frac{\pi}{2}$.

So $V=\pi\left(4\pi+8+\frac{\pi}{2}\right)=\frac{9\pi^2}{2}+8\pi$.` },
      { label: 'Q.2', pts: '4pt', stem: R`Compute the length of the curve in the interval $D$.
$$f(x)=\frac{2}{3}\left(\sqrt{x+1}\right)^3;\quad D:\ 0\le x\le2$$`,
        parts: [],
        answer: [R`$\frac{16-4\sqrt2}{3}$`],
        sol: R`
$f(x)=\frac{2}{3}(x+1)^{3/2}$, so $f'(x)=(x+1)^{1/2}$ and $1+f'(x)^2=x+2$.

$$\ell=\int_0^2\sqrt{x+2}\,dx=\frac{2}{3}\Big[(x+2)^{3/2}\Big]_0^2=\frac{2}{3}\left(8-2\sqrt2\right)$$

which is $\frac{16-4\sqrt2}{3}$, since $2^{3/2}=2\sqrt2$.` },
      { label: 'Q.3', pts: '2pt', stem: R`Compute the following integral for whole numbers $m$ and $n$ with $|n|\ne|m|$.
$$\int_0^{\pi}\cos(mx)\cdot\cos(nx)\,dx$$`,
        parts: [],
        answer: [R`$0$`],
        sol: R`
Product to sum: $\cos mx\cos nx=\frac{1}{2}\big(\cos(m-n)x+\cos(m+n)x\big)$. Since $|m|\ne|n|$, neither $m-n$ nor $m+n$ is $0$:
$$\begin{aligned}&\int_0^{\pi}\cos mx\cos nx\,dx\\[4pt]&=\frac{1}{2}\left[\frac{\sin(m-n)x}{m-n}+\frac{\sin(m+n)x}{m+n}\right]_0^{\pi}\end{aligned}$$

Every $\sin k\pi$ with a whole number $k$ is $0$, and so is $\sin0$, so the integral is $0$.` },
    ]},
    { added: NOV13, focus: 'Targets the usual slips: the middle term when squaring f, the square of the first derivative under the root, the derivative of ln x over a number, a perfect square, and products of sines on an interval that is not [0, π].', qs: [
      { label: 'Q.1', pts: '4pt', stem: R`Compute the volume of the solid of revolution generated by $f(x)$ within the interval $D$.
$$f(x)=\sin x+\cos x;\quad D:\ 0\le x\le\frac{\pi}{2}$$`,
        parts: [],
        answer: [R`$\frac{\pi^2}{2}+\pi$`],
        sol: R`
Square with the middle term: $f(x)^2=\sin^2x+2\sin x\cos x+\cos^2x=1+\sin2x$.

$$V=\pi\int_0^{\pi/2}(1+\sin2x)\,dx=\pi\Big[x-\frac{\cos2x}{2}\Big]_0^{\pi/2}$$

which is $\pi\left(\frac{\pi}{2}+\frac{1}{2}+\frac{1}{2}\right)=\frac{\pi^2}{2}+\pi$. Squaring term by term, $\sin^2x+\cos^2x=1$, would leave out the $2\sin x\cos x$ and give only $\frac{\pi^2}{2}$.` },
      { label: 'Q.2', pts: '4pt', stem: R`Compute the length of the curve in the interval $D$.
$$f(x)=\frac{x^2}{4}-\frac{\ln x}{2};\quad D:\ 1\le x\le e$$`,
        parts: [],
        answer: [R`$\frac{e^2+1}{4}$`],
        sol: R`
$f'(x)=\frac{x}{2}-\frac{1}{2x}$: the $\frac{1}{2}$ stays outside the logarithm. Square the first derivative:
$$f'(x)^2=\frac{x^2}{4}-\frac{1}{2}+\frac{1}{4x^2}$$

Adding $1$ flips the middle term: $1+f'(x)^2=\frac{x^2}{4}+\frac{1}{2}+\frac{1}{4x^2}=\left(\frac{x}{2}+\frac{1}{2x}\right)^2$. So
$$\begin{aligned}\ell&=\int_1^e\left(\frac{x}{2}+\frac{1}{2x}\right)dx=\left[\frac{x^2}{4}+\frac{\ln x}{2}\right]_1^e\\[4pt]&=\frac{e^2}{4}+\frac{1}{2}-\frac{1}{4}=\frac{e^2+1}{4}\end{aligned}$$` },
      { label: 'Q.3', pts: '2pt', stem: R`Compute the following integral for whole numbers $m$ and $n$ with $|n|\ne|m|$, then give its value for $m=1$ and $n=2$.
$$\int_{-\pi/2}^{\pi/2}\sin(mx)\cdot\sin(nx)\,dx$$`,
        parts: [],
        answer: [R`$\frac{\sin\frac{(m-n)\pi}{2}}{m-n}-\frac{\sin\frac{(m+n)\pi}{2}}{m+n}$; for $m=1$ and $n=2$ it is $\frac{4}{3}$`],
        sol: R`
Product to sum: $\sin mx\sin nx=\frac{1}{2}\big(\cos(m-n)x-\cos(m+n)x\big)$, with $m-n\ne0$ and $m+n\ne0$.

Each $\sin kx$ is odd, so $\Big[\frac{\sin kx}{k}\Big]_{-\pi/2}^{\pi/2}=\frac{2}{k}\sin\frac{k\pi}{2}$, and
$$\begin{aligned}&\int_{-\pi/2}^{\pi/2}\sin mx\sin nx\,dx\\[4pt]&=\frac{\sin\frac{(m-n)\pi}{2}}{m-n}-\frac{\sin\frac{(m+n)\pi}{2}}{m+n}\end{aligned}$$

For $m=1$ and $n=2$: $\frac{\sin(-\pi/2)}{-1}-\frac{\sin(3\pi/2)}{3}=1+\frac{1}{3}=\frac{4}{3}$. The interval is not $[0,\pi]$, so the answer need not be $0$.` },
    ]},
  ],
  '09': [
    { added: NOV17, focus: 'Each question mirrors Quiz 09 with new numbers.', qs: [
      { label: 'Q.1', pts: '', stem: R`Consider the curve defined by,
$$r(\theta)=3\theta^2-3,$$
in the polar coordinate.`,
        parts: [R`Give $x$ and $y$ as the functions of $\theta$. (1pt×2)`, R`Compute the curve length within the domain $0\le\theta\le\pi$. (3pt)`],
        answer: [R`(1) $x=(3\theta^2-3)\cos\theta$, $y=(3\theta^2-3)\sin\theta$`, R`(2) $\pi^3+3\pi$`],
        sol: R`
**(1)** $x=r\cos\theta=(3\theta^2-3)\cos\theta$ and $y=r\sin\theta=(3\theta^2-3)\sin\theta$.

**(2)** $\frac{dr}{d\theta}=6\theta$, so
$$\begin{aligned}r^2+\left(\frac{dr}{d\theta}\right)^2&=9(\theta^2-1)^2+36\theta^2\\[2pt]&=9(\theta^4+2\theta^2+1)=9(\theta^2+1)^2\end{aligned}$$

The root is $3(\theta^2+1)$:
$$\ell=\int_0^{\pi}(3\theta^2+3)\,d\theta=\Big[\theta^3+3\theta\Big]_0^{\pi}=\pi^3+3\pi$$` },
      { label: 'Q.2', pts: '', stem: R`Consider the following parameterized curve,
$$\begin{cases}x=\ln(t)\\y=-t^3+2t^2+3t\end{cases}$$
within the region $x\ge0$.`,
        parts: [R`Find the interval of $x$ to give $y\ge0$. (2pt)`, R`Compute the area enclosed by the curve with $y\ge0$, the $x$ axis, and the $y$ axis. (3pt)`],
        answer: [R`(1) $0\le x\le\ln3$`, R`(2) $\frac{16}{3}$`],
        sol: R`
**(1)** $x=\ln t\ge0$ means $t\ge1$. Factor: $y=-t(t^2-2t-3)=-t(t-3)(t+1)$, which for $t\ge1$ is $\ge0$ exactly when $t\le3$. So $1\le t\le3$, that is $0\le x\le\ln3$.

**(2)** $\frac{dx}{dt}=\frac{1}{t}$, so
$$\begin{aligned}A&=\int_1^3(-t^2+2t+3)\,dt=\Big[-\frac{t^3}{3}+t^2+3t\Big]_1^3\\[4pt]&=9-\frac{11}{3}=\frac{16}{3}\end{aligned}$$` },
    ]},
    { added: NOV17, focus: 'Targets the usual slips: the square root of a square, which needs an absolute value and a split, the derivative of r, turning x ≥ 0 into t ≥ 1 for x = ln t, and the factor 1/t in dx.', qs: [
      { label: 'Q.1', pts: '', stem: R`Consider the curve defined by,
$$r(\theta)=2+2\cos\theta,$$
in the polar coordinate.`,
        parts: [R`Give $x$ and $y$ as the functions of $\theta$. (1pt×2)`, R`Compute the curve length within the domain $0\le\theta\le2\pi$. (3pt)`],
        answer: [R`(1) $x=(2+2\cos\theta)\cos\theta$, $y=(2+2\cos\theta)\sin\theta$`, R`(2) $16$`],
        sol: R`
**(1)** $x=(2+2\cos\theta)\cos\theta$ and $y=(2+2\cos\theta)\sin\theta$.

**(2)** $\frac{dr}{d\theta}=-2\sin\theta$, so $r^2+\left(\frac{dr}{d\theta}\right)^2=4(1+\cos\theta)^2+4\sin^2\theta=8+8\cos\theta=16\cos^2\frac{\theta}{2}$.

The root is $4\left|\cos\frac{\theta}{2}\right|$, not $4\cos\frac{\theta}{2}$: $\cos\frac{\theta}{2}<0$ for $\pi<\theta<2\pi$. Split at $\pi$:
$$\begin{aligned}\ell&=4\int_0^{\pi}\cos\frac{\theta}{2}\,d\theta-4\int_{\pi}^{2\pi}\cos\frac{\theta}{2}\,d\theta\\[4pt]&=4\cdot2-4\cdot(-2)=16\end{aligned}$$

Without the absolute value the integral is $8\Big[\sin\frac{\theta}{2}\Big]_0^{2\pi}=0$, which can't be a length.` },
      { label: 'Q.2', pts: '', stem: R`Consider the following parameterized curve,
$$\begin{cases}x=\ln(t)\\y=4t-t^3\end{cases}$$
within the region $x\ge0$.`,
        parts: [R`Find the interval of $x$ to give $y\ge0$. (2pt)`, R`Compute the area enclosed by the curve with $y\ge0$, the $x$ axis, and the $y$ axis. (3pt)`],
        answer: [R`(1) $0\le x\le\ln2$`, R`(2) $\frac{5}{3}$`],
        sol: R`
**(1)** $x\ge0$ means $\ln t\ge0$, so $t\ge1$, not $t\ge0$. $y=t(4-t^2)=t(2-t)(2+t)$, which for $t\ge1$ is $\ge0$ exactly when $t\le2$. So $1\le t\le2$, that is $0\le x\le\ln2$.

**(2)** $dx=\frac{dx}{dt}\,dt=\frac{1}{t}\,dt$, so the $t$-limits are $1$ and $2$ and one $t$ cancels:
$$A=\int_1^2(4-t^2)\,dt=\Big[4t-\frac{t^3}{3}\Big]_1^2=\frac{16}{3}-\frac{11}{3}=\frac{5}{3}$$

Dropping the factor $\frac{1}{t}$ would give $\int_1^2(4t-t^3)\,dt=\frac{9}{4}$, and integrating from $0$ to $\ln2$ in $t$ would mix the two variables.` },
    ]},
  ],
  '10': [
    { added: NOV20, focus: 'Each question mirrors Quiz 10 with new numbers.', qs: [
      { label: 'Q.1', pts: '3pt×2', stem: R`Evaluate the convergence of the improper integrals. Then, give the value if it converges.`,
        parts: [R`$\displaystyle\int_0^4\frac{x}{2-\sqrt x}\,dx$`, R`$\displaystyle\int_0^{\infty}x^2e^{-x^3}\,dx$`],
        answer: [R`(1) diverges`, R`(2) converges to $\frac{1}{3}$`],
        sol: R`
**(1)** The bottom, $2-\sqrt x$, is $0$ at $x=4$, the upper end, so integrate up to $w<4$ and let $w\to4$. With $t=\sqrt x$: $x=t^2$, $dx=2t\,dt$, and the limits move to $t=0$ and $t=s=\sqrt w$:
$$\int_0^{w}\frac{x}{2-\sqrt x}\,dx=\int_0^{s}\frac{2t^3}{2-t}\,dt$$

Divide: $t^3=(t-2)(t^2+2t+4)+8$, so
$$\frac{2t^3}{2-t}=-2\left(t^2+2t+4\right)+\frac{16}{2-t}$$

A primitive of $\frac{16}{2-t}$ is $-16\ln(2-t)$, with the minus sign from the inside:
$$\begin{aligned}\int_0^{s}\frac{2t^3}{2-t}\,dt&=-2\left(\frac{s^3}{3}+s^2+4s\right)\\[4pt]&\quad-16\ln(2-s)+16\ln2\end{aligned}$$

As $s\to2$, everything but $-16\ln(2-s)$ stays finite, and $-16\ln(2-s)\to+\infty$: the integral diverges.

**(2)** With $u=x^3$, $du=3x^2\,dx$: $\int x^2e^{-x^3}dx=-\frac{1}{3}e^{-x^3}+C$. So
$$\int_0^{w}x^2e^{-x^3}dx=\frac{1}{3}-\frac{1}{3}e^{-w^3}$$
which tends to $\frac{1}{3}$ as $w\to\infty$: it converges to $\frac{1}{3}$.` },
      { label: 'Q.2', pts: '', stem: R`Consider the following Fourier series in the domain of $-\pi\le x\le\pi$,
$$\begin{aligned}&\sin\left(2x+\frac{\pi}{6}\right)\\[4pt]&=\sum_{m=1}^{\infty}\{a_m\cos(mx)+b_m\sin(mx)\}.\end{aligned}$$
Find the coefficients $a_2$ and $b_2$. (2pt×2)`,
        parts: [],
        answer: [R`$a_2=\frac{1}{2}$ and $b_2=\frac{\sqrt3}{2}$`],
        sol: R`
The addition formula $\sin(A+B)=\sin A\cos B+\cos A\sin B$, with $\cos\frac{\pi}{6}=\frac{\sqrt3}{2}$ and $\sin\frac{\pi}{6}=\frac{1}{2}$:
$$\sin\left(2x+\frac{\pi}{6}\right)=\frac{\sqrt3}{2}\sin2x+\frac{1}{2}\cos2x$$

This is already a Fourier series, with $m=2$ only: $a_2=\frac{1}{2}$ goes with $\cos2x$, and $b_2=\frac{\sqrt3}{2}$ with $\sin2x$. Every other coefficient is $0$.

The inner products agree: since $\langle S_2|C_2\rangle=0$, $a_2=\frac{1}{\pi}\langle f|C_2\rangle=\frac{1}{\pi}\cdot\frac{1}{2}\langle C_2|C_2\rangle=\frac{1}{2}$.` },
    ]},
    { added: NOV20, focus: 'Targets the usual slips: the minus sign that an inside a − x brings, a point inside the interval where f diverges, which coefficient goes with cos and which with sin, the signs in the addition formulas, and a coefficient that is 0.', qs: [
      { label: 'Q.1', pts: '3pt×2', stem: R`Evaluate the convergence of the improper integrals. Then, give the value if it converges.`,
        parts: [R`$\displaystyle\int_0^2\frac{dx}{\sqrt[3]{2-x}}$`, R`$\displaystyle\int_0^3\frac{dx}{(x-1)^2}$`],
        answer: [R`(1) converges to $\frac{3}{2}\sqrt[3]{4}$`, R`(2) diverges`],
        sol: R`
**(1)** $\frac{1}{\sqrt[3]{2-x}}$ diverges at $x=2$, the upper end, so integrate up to $w<2$. The power rule divides by the new exponent $\frac{2}{3}$, and the inside, $2-x$, brings a minus sign:
$$\int\frac{dx}{\sqrt[3]{2-x}}=-\frac{3}{2}(2-x)^{2/3}+C$$

So
$$\begin{aligned}\int_0^{w}\frac{dx}{\sqrt[3]{2-x}}&=\frac{3}{2}\cdot2^{2/3}-\frac{3}{2}(2-w)^{2/3}\\[4pt]&\to\frac{3}{2}\sqrt[3]{4}\end{aligned}$$
as $w\to2$: it converges. Without the minus sign the answer would come out negative, which a positive integrand can't give.

**(2)** $\frac{1}{(x-1)^2}$ diverges at $x=1$, inside $[0,3]$, so split there: $\int_0^1$ and $\int_1^3$ must both converge. For the first, with $w<1$:
$$\begin{aligned}\int_0^{w}\frac{dx}{(x-1)^2}&=\Big[-\frac{1}{x-1}\Big]_0^{w}\\[4pt]&=-\frac{1}{w-1}-1\end{aligned}$$
As $w\to1$ from below, $w-1\to-0$, so $-\frac{1}{w-1}\to+\infty$: this part diverges, and so does the whole integral.

Without the split, $\Big[-\frac{1}{x-1}\Big]_0^3=-\frac{1}{2}-1=-\frac{3}{2}$: a negative number from a positive integrand, which can't be right.` },
      { label: 'Q.2', pts: '', stem: R`Consider the following Fourier series in the domain of $-\pi\le x\le\pi$,
$$\begin{aligned}&\sin\left(x-\frac{\pi}{3}\right)\\[4pt]&=\sum_{m=1}^{\infty}\{a_m\cos(mx)+b_m\sin(mx)\}.\end{aligned}$$
Find the coefficients $a_1$ and $b_2$. (2pt×2)`,
        parts: [],
        answer: [R`$a_1=-\frac{\sqrt3}{2}$ and $b_2=0$`],
        sol: R`
$\sin(A-B)=\sin A\cos B-\cos A\sin B$ has a minus sign. With $\cos\frac{\pi}{3}=\frac{1}{2}$ and $\sin\frac{\pi}{3}=\frac{\sqrt3}{2}$:
$$\sin\left(x-\frac{\pi}{3}\right)=\frac{1}{2}\sin x-\frac{\sqrt3}{2}\cos x$$

$a_1$ is the coefficient of $\cos x$, minus sign included: $a_1=-\frac{\sqrt3}{2}$. The other one, $b_1=\frac{1}{2}$, goes with $\sin x$.

There is no $\sin2x$ term, so $b_2=0$. The integral agrees: $\langle S_1|S_2\rangle=\langle C_1|S_2\rangle=0$, so $b_2=\frac{1}{\pi}\int_{-\pi}^{\pi}\sin\left(x-\frac{\pi}{3}\right)\sin2x\,dx=0$.` },
    ]},
  ],
};
