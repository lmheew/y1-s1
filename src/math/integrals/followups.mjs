// Follow-up quizzes for the Calculus midterm 2 page: two per in-class quiz. A = same skills, new numbers.
// B = targets the usual slips. Same structure and point values as the in-class sheet (10 pt each).
// Checked in verify.py (this folder).
const R = String.raw;
const NOV6 = '2026-11-06';

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
$$S_N=\sum_{k=1}^{N}\left(\frac{4k^2}{N^2}+1\right)\frac{2}{N}=\frac{8}{N^3}\sum_{k=1}^{N}k^2+\frac{2}{N}\sum_{k=1}^{N}1$$

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
};
