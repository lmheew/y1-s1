// The Exams tab: three mock midterms covering Quizzes 01-05, 60 minutes and 60 points each, six questions of
// 10 points (one per topic). Same markup as content.mjs. `pts` gives the points of each part, in order.
// Every answer is checked numerically in verify_mocks.py. `added` (YYYY-MM-DD) shows a "New" label for two weeks.
const R = String.raw;

export const mocks = [
  {
    id: 'm1', title: 'Mock Midterm 1', minutes: 60, added: '2026-10-29',
    qs: [
      {
        topic: 'Limits and continuity', label: 'Q.1', stem: R`Answer each part.`, pts: [2, 2, 2, 4],
        parts: [
          R`$\displaystyle\lim_{x\to2}\frac{x^2+x-6}{x^2-4}$`,
          R`$\displaystyle\lim_{x\to0}\frac{\sin 4x}{3x}$`,
          R`The exact value of $\arccos\left(-\frac{1}{2}\right)+\arcsin\left(\frac{\sqrt3}{2}\right)$`,
          R`The value of $a$ that makes $f$ continuous at $x=1$, where $f(x)=ax^2+1$ for $x<1$ and $f(x)=3x-a$ for $x\ge1$`,
        ],
        answer: [R`(1) $\frac{5}{4}$`, R`(2) $\frac{4}{3}$`, R`(3) $\pi$`, R`(4) $a=1$`],
        sol: R`**(1)** Plugging in gives $\frac{0}{0}$, so factor and cancel: $\frac{(x+3)(x-2)}{(x+2)(x-2)}=\frac{x+3}{x+2}\to\frac{5}{4}$.

**(2)** Make the special limit appear: $\frac{\sin 4x}{3x}=\frac{4}{3}\cdot\frac{\sin 4x}{4x}\to\frac{4}{3}\cdot1=\frac{4}{3}$.

**(3)** $\arccos$ lands in $[0,\pi]$, so $\arccos\left(-\frac{1}{2}\right)=\frac{2\pi}{3}$. Also $\arcsin\frac{\sqrt3}{2}=\frac{\pi}{3}$. The sum is $\pi$.

**(4)** The left limit is $a+1$; the right limit and the value are $f(1)=3-a$. Continuity needs $a+1=3-a$, so $a=1$.`,
      },
      {
        topic: 'Derivative rules', label: 'Q.2', stem: R`Compute each derivative.`, pts: [2, 3, 3, 2],
        parts: [
          R`$f'(1)$ for $f(x)=x^4-2x^2+3x$`,
          R`$f'(1)$ for $f(x)=\dfrac{x^2}{x+1}$`,
          R`$f'(\pi)$ for $f(x)=e^{\sin x}$`,
          R`The tangent line to $y=\ln x$ at $x=e$`,
        ],
        answer: [R`(1) $3$`, R`(2) $\frac{3}{4}$`, R`(3) $-1$`, R`(4) $y=\frac{x}{e}$`],
        sol: R`**(1)** $f'(x)=4x^3-4x+3$, so $f'(1)=4-4+3=3$.

**(2)** Quotient rule: $f'(x)=\frac{2x(x+1)-x^2}{(x+1)^2}=\frac{x^2+2x}{(x+1)^2}$, so $f'(1)=\frac{3}{4}$.

**(3)** Chain rule: $f'(x)=e^{\sin x}\cdot\cos x$, so $f'(\pi)=e^{0}\cdot(-1)=-1$.

**(4)** At $x=e$: $y=\ln e=1$ and $y'=\frac{1}{e}$. The tangent is $y=1+\frac{1}{e}(x-e)=\frac{x}{e}$.`,
      },
      {
        topic: 'Implicit, inverse and parametric', label: 'Q.3', stem: R`Answer each part.`, pts: [3, 3, 2, 2],
        parts: [
          R`For the curve $x^2+xy+y^2=7$, find $\frac{dy}{dx}$ at $(1,2)$.`,
          R`Let $f(x)=x^3+2x+1$. Find $(f^{-1})'(4)$.`,
          R`For $x=t^3+t$, $y=t^2$, find $\frac{dy}{dx}$ at $t=1$.`,
          R`For the same curve, find $\frac{d^2y}{dx^2}$ at $t=1$.`,
        ],
        answer: [R`(1) $-\frac{4}{5}$`, R`(2) $\frac{1}{5}$`, R`(3) $\frac{1}{2}$`, R`(4) $-\frac{1}{16}$`],
        sol: R`**(1)** Differentiate both sides: $2x+y+xy'+2yy'=0$, so $y'=-\frac{2x+y}{x+2y}$. At $(1,2)$: $y'=-\frac{4}{5}$.

**(2)** First solve $f(a)=4$: $a^3+2a+1=4$ gives $a=1$. Then $f'(x)=3x^2+2$, so $f'(1)=5$ and $(f^{-1})'(4)=\frac{1}{5}$.

**(3)** At $t=1$: $\frac{dx}{dt}=3t^2+1=4$ and $\frac{dy}{dt}=2t=2$, so $\frac{dy}{dx}=\frac{2}{4}=\frac{1}{2}$.

**(4)** $\frac{dy}{dx}=\frac{2t}{3t^2+1}$ and $\frac{d}{dt}\left(\frac{2t}{3t^2+1}\right)=\frac{2-6t^2}{(3t^2+1)^2}$, which is $-\frac{4}{16}=-\frac{1}{4}$ at $t=1$. Divide by $\frac{dx}{dt}=4$: $\frac{d^2y}{dx^2}=-\frac{1}{16}$.`,
      },
      {
        topic: 'Extrema and concavity', label: 'Q.4', stem: R`Consider $f(x)=x^3-6x^2+9x+1$.`, pts: [2, 3, 2, 3],
        parts: [
          R`Find the critical points.`,
          R`Use the second derivative test to find the relative maximum and minimum values.`,
          R`Find the inflection point.`,
          R`Find the absolute maximum and minimum on $0\le x\le4$.`,
        ],
        answer: [R`(1) $x=1$ and $x=3$`, R`(2) relative max $5$ (at $x=1$), relative min $1$ (at $x=3$)`, R`(3) $(2,3)$`,
          R`(4) absolute max $5$ (at $x=1$ and $x=4$), absolute min $1$ (at $x=0$ and $x=3$)`],
        sol: R`**(1)** $f'(x)=3x^2-12x+9=3(x-1)(x-3)$, so $x=1$ and $x=3$.

**(2)** $f''(x)=6x-12$. $f''(1)=-6<0$: concave down, relative max $f(1)=5$. $f''(3)=6>0$: concave up, relative min $f(3)=1$.

**(3)** $f''(x)=6x-12$ changes sign at $x=2$, and $f(2)=3$. The inflection point is $(2,3)$.

**(4)** Compare the critical points and the endpoints: $f(0)=1$, $f(1)=5$, $f(3)=1$, $f(4)=5$. The absolute max is $5$, reached twice, and the absolute min is $1$, also reached twice.`,
      },
      {
        topic: "Series and Newton's method", label: 'Q.5', stem: R`Answer each part.`, pts: [2, 3, 2, 3],
        parts: [
          R`$\displaystyle\lim_{n\to\infty}\frac{5n^3-2n}{2n^3+n^2+1}$`,
          R`For $a_n=3\left(\frac{1}{2}\right)^n$, with the sum starting at $n=0$: give the general term of the partial sum $s_N$ and the sum of the infinite series.`,
          R`Does $\displaystyle\sum_{n=1}^{\infty}\frac{2^n}{n!}$ converge?`,
          R`For $f(x)=x^3+x-1$, apply Newton's method from $x_1=1$ and compute $x_2$.`,
        ],
        answer: [R`(1) $\frac{5}{2}$`, R`(2) $s_N=6\left[1-\left(\frac{1}{2}\right)^{N+1}\right]$; the series converges to $6$`, R`(3) Yes: the ratio test gives $0<1$`, R`(4) $x_2=\frac{3}{4}$`],
        sol: R`**(1)** Divide every term by $n^3$: $\frac{5-2/n^2}{2+1/n+1/n^3}\to\frac{5}{2}$.

**(2)** It's geometric with first term $3$ and ratio $r=\frac{1}{2}$: $s_N=3\cdot\frac{1-(1/2)^{N+1}}{1-1/2}=6\left[1-\left(\frac{1}{2}\right)^{N+1}\right]$, which tends to $6$.

**(3)** Ratio test: $\frac{a_{n+1}}{a_n}=\frac{2^{n+1}}{(n+1)!}\cdot\frac{n!}{2^n}=\frac{2}{n+1}\to0<1$, so the series converges.

**(4)** $f(1)=1$, and $f'(x)=3x^2+1$ gives $f'(1)=4$. So $x_2=1-\frac{1}{4}=\frac{3}{4}$.`,
      },
      {
        topic: 'Linear approximation and Taylor', label: 'Q.6', stem: R`Answer each part.`, pts: [3, 2, 5],
        parts: [
          R`Use a local linear approximation to estimate $\sqrt[3]{8.12}$.`,
          R`Is the estimate in (1) too big or too small? Explain why.`,
          R`Compute the coefficients of the Taylor series of $f(x)=\cos^2x-\sin^2x$ about $x=\frac{\pi}{3}$, up to $\left(x-\frac{\pi}{3}\right)^3$.`,
        ],
        answer: [R`(1) $\sqrt[3]{8.12}\approx2.01$`, R`(2) too big: $f''<0$, so the curve is concave down`, R`(3) $-\frac{1}{2},\ -\sqrt3,\ 1,\ \frac{2\sqrt3}{3}$`],
        sol: R`**(1)** Use $f(x)=x^{1/3}$ at $a=8$: $f(8)=2$, and $f'(x)=\frac{1}{3}x^{-2/3}$ gives $f'(8)=\frac{1}{12}$. So $\sqrt[3]{8.12}\approx2+\frac{1}{12}\cdot0.12=2.01$.

**(2)** $f''(x)=-\frac{2}{9}x^{-5/3}<0$, so $f$ is concave down and the tangent line lies above the curve. The estimate is too big.

**(3)** Simplify first: $f(x)=\cos 2x$. Then $f'=-2\sin 2x$, $f''=-4\cos 2x$ and $f'''=8\sin 2x$. At $x=\frac{\pi}{3}$, where $2x=\frac{2\pi}{3}$: $f=-\frac{1}{2}$, $f'=-\sqrt3$, $f''=2$, $f'''=4\sqrt3$.

Divide each by $k!$: $c_0=-\frac{1}{2}$, $c_1=-\sqrt3$, $c_2=\frac{2}{2!}=1$, $c_3=\frac{4\sqrt3}{3!}=\frac{2\sqrt3}{3}$.`,
      },
    ],
  },
  {
    id: 'm2', title: 'Mock Midterm 2', minutes: 60, added: '2026-10-29',
    qs: [
      {
        topic: 'Limits and continuity', label: 'Q.1', stem: R`Answer each part.`, pts: [2, 2, 3, 3],
        parts: [
          R`The value of $f(x)=(x+1)\cdot\ln(x^2)+e^{x+1}$ at $x=-1$`,
          R`The exact value of $\arctan(-1)+\arccos 0$`,
          R`$\displaystyle\lim_{x\to1}\frac{\sqrt{x+3}-2}{x-1}$`,
          R`Let $f(x)=\dfrac{x^2-x-2}{x-2}$ for $x\ne2$, and $f(2)=4$. Is $f$ continuous at $x=2$? If not, what kind of discontinuity is it?`,
        ],
        answer: [R`(1) $1$`, R`(2) $\frac{\pi}{4}$`, R`(3) $\frac{1}{4}$`, R`(4) not continuous: the limit is $3$ but $f(2)=4$ (a removable discontinuity)`],
        sol: R`**(1)** The first term has the factor $x+1=0$, so it is $0$. The second is $e^{0}=1$. So $f(-1)=1$.

**(2)** $\arctan(-1)=-\frac{\pi}{4}$ and $\arccos 0=\frac{\pi}{2}$, so the sum is $\frac{\pi}{4}$.

**(3)** Multiply by the conjugate: $\frac{(x+3)-4}{(x-1)(\sqrt{x+3}+2)}=\frac{1}{\sqrt{x+3}+2}\to\frac{1}{4}$.

**(4)** For $x\ne2$, $\frac{(x-2)(x+1)}{x-2}=x+1\to3$ from both sides. The limit exists but isn't $f(2)=4$, so $f$ isn't continuous there. Redefining $f(2)=3$ would fix it: the discontinuity is removable.`,
      },
      {
        topic: 'Derivative rules', label: 'Q.2', stem: R`Compute each derivative.`, pts: [2, 3, 3, 2],
        parts: [
          R`$f'(1)$ for $f(x)=3x^4-\dfrac{2}{x}$`,
          R`$f'(0)$ for $f(x)=x\cdot e^{2x}$`,
          R`$f'\left(\frac{\pi}{12}\right)$ for $f(x)=\sin^2(3x)$`,
          R`Use the limit definition to find $f'(x)$ for $f(x)=\dfrac{1}{x}$.`,
        ],
        answer: [R`(1) $14$`, R`(2) $1$`, R`(3) $3$`, R`(4) $f'(x)=-\frac{1}{x^2}$`],
        sol: R`**(1)** $f'(x)=12x^3+\frac{2}{x^2}$, so $f'(1)=14$.

**(2)** Product rule: $f'(x)=e^{2x}+x\cdot2e^{2x}$, so $f'(0)=1$.

**(3)** Chain rule twice: $f'(x)=2\sin 3x\cdot\cos 3x\cdot3=3\sin 6x$. At $x=\frac{\pi}{12}$: $3\sin\frac{\pi}{2}=3$.

**(4)** $\frac{f(x+h)-f(x)}{h}=\frac{1}{h}\left(\frac{1}{x+h}-\frac{1}{x}\right)=\frac{-h}{h\,x(x+h)}=-\frac{1}{x(x+h)}$. As $h\to0$ this tends to $-\frac{1}{x^2}$.`,
      },
      {
        topic: 'Implicit, inverse and parametric', label: 'Q.3', stem: R`Answer each part.`, pts: [3, 2, 2, 3],
        parts: [
          R`Find the tangent line to $x^3+y^3=9xy$ at $(2,4)$.`,
          R`Find $\frac{d}{dx}\arcsin(x^2)$ at $x=\frac{1}{2}$.`,
          R`Let $f(x)=e^{2x}+x$. Find $(f^{-1})'(1)$.`,
          R`For $x=\cos t$, $y=\sin 2t$, find $\frac{dy}{dx}$ at $t=\frac{\pi}{6}$.`,
        ],
        answer: [R`(1) $y=\frac{4}{5}x+\frac{12}{5}$`, R`(2) $\frac{4\sqrt{15}}{15}$`, R`(3) $\frac{1}{3}$`, R`(4) $-2$`],
        sol: R`**(1)** Differentiate: $3x^2+3y^2y'=9y+9xy'$, so $y'=\frac{3y-x^2}{y^2-3x}$. At $(2,4)$: $y'=\frac{12-4}{16-6}=\frac{4}{5}$. The tangent is $y-4=\frac{4}{5}(x-2)$, that is $y=\frac{4}{5}x+\frac{12}{5}$.

**(2)** Chain rule: $\frac{d}{dx}\arcsin(x^2)=\frac{2x}{\sqrt{1-x^4}}$. At $x=\frac{1}{2}$: $\frac{1}{\sqrt{15/16}}=\frac{4}{\sqrt{15}}=\frac{4\sqrt{15}}{15}$.

**(3)** First solve $f(a)=1$: $a=0$ works, since $e^0+0=1$. Then $f'(x)=2e^{2x}+1$ gives $f'(0)=3$, so $(f^{-1})'(1)=\frac{1}{3}$.

**(4)** At $t=\frac{\pi}{6}$: $\frac{dx}{dt}=-\sin t=-\frac{1}{2}$ and $\frac{dy}{dt}=2\cos 2t=1$. So $\frac{dy}{dx}=\frac{1}{-1/2}=-2$.`,
      },
      {
        topic: 'Extrema and concavity', label: 'Q.4', stem: R`Consider $f(x)=x^4-4x^3$.`, pts: [2, 3, 2, 3],
        parts: [
          R`Find the critical points.`,
          R`Classify each critical point with the first derivative test.`,
          R`Find the inflection points.`,
          R`Find the absolute maximum and minimum on $-1\le x\le4$.`,
        ],
        answer: [R`(1) $x=0$ and $x=3$`, R`(2) $x=0$: neither. $x=3$: relative min $f(3)=-27$.`, R`(3) $(0,0)$ and $(2,-16)$`,
          R`(4) absolute max $5$ at $x=-1$, absolute min $-27$ at $x=3$`],
        sol: R`**(1)** $f'(x)=4x^3-12x^2=4x^2(x-3)$, so $x=0$ and $x=3$.

**(2)** $4x^2\ge0$, so the sign of $f'$ is the sign of $x-3$: negative on both sides of $0$ (no sign change: neither), and $-\to+$ at $x=3$: a relative min, $f(3)=81-108=-27$.

**(3)** $f''(x)=12x^2-24x=12x(x-2)$ changes sign at $x=0$ and $x=2$. With $f(0)=0$ and $f(2)=16-32=-16$, the points are $(0,0)$ and $(2,-16)$.

**(4)** Compare $f(-1)=1+4=5$, $f(0)=0$, $f(3)=-27$ and $f(4)=256-256=0$. The absolute max is $5$ at $x=-1$ and the absolute min is $-27$ at $x=3$.`,
      },
      {
        topic: "Series and Newton's method", label: 'Q.5', stem: R`Answer each part.`, pts: [2, 3, 2, 3],
        parts: [
          R`$\displaystyle\lim_{n\to\infty}\frac{2^{n+2}-5^n}{5^n+3}$`,
          R`For $a_n=\left(-\frac{1}{3}\right)^n$, with the sum starting at $n=0$: give the general term of the partial sum $s_N$ and the sum of the infinite series.`,
          R`Does $\displaystyle\sum_{n=1}^{\infty}\frac{n+1}{2n+5}$ converge?`,
          R`For $f(x)=x^2-5$, apply Newton's method from $x_1=2$ and compute $x_2$.`,
        ],
        answer: [R`(1) $-1$`, R`(2) $s_N=\frac{3}{4}\left[1-\left(-\frac{1}{3}\right)^{N+1}\right]$; the series converges to $\frac{3}{4}$`, R`(3) No: the terms go to $\frac{1}{2}\ne0$`, R`(4) $x_2=\frac{9}{4}$`],
        sol: R`**(1)** Divide by the biggest base, $5^n$: $\frac{4\left(\frac{2}{5}\right)^n-1}{1+3/5^n}\to\frac{0-1}{1+0}=-1$.

**(2)** Geometric with $r=-\frac{1}{3}$: $s_N=\frac{1-(-1/3)^{N+1}}{1+1/3}=\frac{3}{4}\left[1-\left(-\frac{1}{3}\right)^{N+1}\right]$. Since $\left|-\frac{1}{3}\right|<1$, it tends to $\frac{3}{4}$.

**(3)** The terms $\frac{n+1}{2n+5}\to\frac{1}{2}\ne0$, so the series diverges.

**(4)** $f(2)=-1$ and $f'(x)=2x$ gives $f'(2)=4$. So $x_2=2-\frac{-1}{4}=\frac{9}{4}$.`,
      },
      {
        topic: 'Linear approximation and Taylor', label: 'Q.6', stem: R`Answer each part.`, pts: [3, 2, 5],
        parts: [
          R`Use a local linear approximation to estimate $\ln(1.04)$.`,
          R`Is the estimate in (1) too big or too small? Explain why.`,
          R`Compute the coefficients of the Taylor series of $f(x)=\sqrt{x}$ about $x=4$, up to $(x-4)^3$.`,
        ],
        answer: [R`(1) $\ln(1.04)\approx0.04$`, R`(2) too big: $f''<0$, so the curve is concave down`, R`(3) $2,\ \frac{1}{4},\ -\frac{1}{64},\ \frac{1}{512}$`],
        sol: R`**(1)** Use $f(x)=\ln x$ at $a=1$: $f(1)=0$ and $f'(1)=1$. So $\ln(1.04)\approx0+1\cdot0.04=0.04$.

**(2)** $f''(x)=-\frac{1}{x^2}<0$: concave down, so the tangent line lies above the curve and the estimate is too big.

**(3)** $f=x^{1/2}$, $f'=\frac{1}{2}x^{-1/2}$, $f''=-\frac{1}{4}x^{-3/2}$, $f'''=\frac{3}{8}x^{-5/2}$. At $x=4$: $f=2$, $f'=\frac{1}{4}$, $f''=-\frac{1}{32}$, $f'''=\frac{3}{256}$.

Divide each by $k!$: $c_0=2$, $c_1=\frac{1}{4}$, $c_2=-\frac{1}{64}$, $c_3=\frac{3}{256\cdot6}=\frac{1}{512}$.`,
      },
    ],
  },
  {
    id: 'm3', title: 'Mock Midterm 3', minutes: 60, added: '2026-10-29',
    qs: [
      {
        topic: 'Limits and continuity', label: 'Q.1', stem: R`Answer each part. In (3) and (4), $f(x)=\dfrac{x-2}{x^2-5x+6}$.`, pts: [2, 2, 3, 3],
        parts: [
          R`The value of $f(\theta)=\sin(2\theta)\cdot\cos(\theta)+1$ at $\theta=\frac{\pi}{6}$`,
          R`$\displaystyle\lim_{x\to0}\frac{e^{3x}-1}{\sin 2x}$`,
          R`Compute the limits of $f$ at $x=3$ from the left and right.`,
          R`Is $f$ continuous at $x=2$? Classify the discontinuity.`,
        ],
        answer: [R`(1) $\frac{7}{4}$`, R`(2) $\frac{3}{2}$`, R`(3) $-\infty$ from the left, $+\infty$ from the right`,
          R`(4) not continuous: $f(2)$ is undefined, but both one-sided limits are $-1$ (a removable discontinuity)`],
        sol: R`**(1)** At $\theta=\frac{\pi}{6}$: $\sin\frac{\pi}{3}=\frac{\sqrt3}{2}$ and $\cos\frac{\pi}{6}=\frac{\sqrt3}{2}$, so $f=\frac{\sqrt3}{2}\cdot\frac{\sqrt3}{2}+1=\frac{3}{4}+1=\frac{7}{4}$.

**(2)** Split into special limits: $\frac{e^{3x}-1}{3x}\cdot\frac{2x}{\sin 2x}\cdot\frac{3}{2}\to1\cdot1\cdot\frac{3}{2}=\frac{3}{2}$.

**(3)** Factor: $x^2-5x+6=(x-2)(x-3)$, so $f(x)=\frac{1}{x-3}$ for $x\ne2$. As $x\to3^-$, $x-3\to0^-$ and $f\to-\infty$; as $x\to3^+$, $f\to+\infty$.

**(4)** At $x=2$, $f$ gives $\frac{0}{0}$: undefined, so not continuous. But $\frac{1}{x-3}\to-1$ from both sides, so the limit exists: the discontinuity is removable.`,
      },
      {
        topic: 'Derivative rules', label: 'Q.2', stem: R`Compute each derivative.`, pts: [2, 3, 3, 2],
        parts: [
          R`$f'(1)$ for $f(x)=\sqrt{x}+\dfrac{1}{x^2}$`,
          R`$f'(e)$ for $f(x)=\dfrac{\ln x}{x}$`,
          R`$f'\left(\frac{\pi}{8}\right)$ for $f(x)=\tan(2x)$`,
          R`$f''(0)$ for $f(x)=x^2e^x$`,
        ],
        answer: [R`(1) $-\frac{3}{2}$`, R`(2) $0$`, R`(3) $4$`, R`(4) $2$`],
        sol: R`**(1)** $f'(x)=\frac{1}{2\sqrt{x}}-\frac{2}{x^3}$, so $f'(1)=\frac{1}{2}-2=-\frac{3}{2}$.

**(2)** Quotient rule: $f'(x)=\frac{\frac{1}{x}\cdot x-\ln x}{x^2}=\frac{1-\ln x}{x^2}$. At $x=e$, $1-\ln e=0$, so $f'(e)=0$.

**(3)** Chain rule: $f'(x)=\sec^2(2x)\cdot2$. At $x=\frac{\pi}{8}$: $\sec^2\frac{\pi}{4}=\frac{1}{(\sqrt2/2)^2}=2$, so $f'=4$.

**(4)** $f'(x)=2xe^x+x^2e^x$ and $f''(x)=2e^x+2xe^x+2xe^x+x^2e^x=e^x(x^2+4x+2)$. So $f''(0)=2$.`,
      },
      {
        topic: 'Implicit, inverse and parametric', label: 'Q.3', stem: R`Answer each part.`, pts: [3, 3, 2, 2],
        parts: [
          R`For $x^2y+y^3=10$, find $\frac{dy}{dx}$ at $(3,1)$.`,
          R`For the curve $x^2+y^2-4y=0$, find the points where the tangent line is vertical.`,
          R`Find $\frac{d}{dx}\arctan\left(\sqrt{x}\right)$ at $x=1$.`,
          R`For $x=e^t$, $y=t^2$, find $\frac{dy}{dx}$ at $t=1$.`,
        ],
        answer: [R`(1) $-\frac{1}{2}$`, R`(2) $(2,2)$ and $(-2,2)$`, R`(3) $\frac{1}{4}$`, R`(4) $\frac{2}{e}$`],
        sol: R`**(1)** Differentiate: $2xy+x^2y'+3y^2y'=0$, so $y'=-\frac{2xy}{x^2+3y^2}$. At $(3,1)$: $y'=-\frac{6}{12}=-\frac{1}{2}$.

**(2)** Differentiate: $2x+2yy'-4y'=0$, so $y'=\frac{x}{2-y}$. The tangent is vertical where $2-y=0$ but $x\ne0$. Putting $y=2$ into the curve: $x^2+4-8=0$, so $x=\pm2$.

**(3)** Chain rule: $\frac{1}{1+x}\cdot\frac{1}{2\sqrt{x}}$. At $x=1$: $\frac{1}{2}\cdot\frac{1}{2}=\frac{1}{4}$.

**(4)** $\frac{dx}{dt}=e^t$ and $\frac{dy}{dt}=2t$, so $\frac{dy}{dx}=\frac{2t}{e^t}$, which is $\frac{2}{e}$ at $t=1$.`,
      },
      {
        topic: 'Extrema and concavity', label: 'Q.4', stem: R`Consider $f(x)=\dfrac{x}{x^2+1}$.`, pts: [3, 3, 4],
        parts: [
          R`Find the critical points.`,
          R`Classify each one and give the relative maximum and minimum values.`,
          R`Find the absolute maximum and minimum on $0\le x\le3$.`,
        ],
        answer: [R`(1) $x=-1$ and $x=1$`, R`(2) $x=-1$: relative min $-\frac{1}{2}$. $x=1$: relative max $\frac{1}{2}$.`, R`(3) absolute max $\frac{1}{2}$ at $x=1$, absolute min $0$ at $x=0$`],
        sol: R`**(1)** Quotient rule: $f'(x)=\frac{(x^2+1)-x\cdot2x}{(x^2+1)^2}=\frac{1-x^2}{(x^2+1)^2}$, which is $0$ at $x=\pm1$.

**(2)** The denominator is positive, so $f'$ has the sign of $1-x^2$: negative, then positive, then negative. At $x=-1$ it goes $-\to+$: relative min $f(-1)=-\frac{1}{2}$. At $x=1$ it goes $+\to-$: relative max $f(1)=\frac{1}{2}$.

**(3)** Only $x=1$ lies inside. Compare $f(0)=0$, $f(1)=\frac{1}{2}$ and $f(3)=\frac{3}{10}$: the absolute max is $\frac{1}{2}$ and the absolute min is $0$.`,
      },
      {
        topic: "Series and Newton's method", label: 'Q.5', stem: R`Answer each part.`, pts: [2, 3, 2, 3],
        parts: [
          R`$\displaystyle\lim_{n\to\infty}\frac{(n+1)^2}{3n^2-n}$`,
          R`For $a_n=\dfrac{2}{5^n}$, with the sum starting at $n=0$: give the general term of the partial sum $s_N$ and the sum of the infinite series.`,
          R`Does $\displaystyle\sum_{n=1}^{\infty}\frac{n^2}{2^n}$ converge?`,
          R`For $f(x)=x^4-2$, apply Newton's method from $x_1=1$ and compute $x_2$.`,
        ],
        answer: [R`(1) $\frac{1}{3}$`, R`(2) $s_N=\frac{5}{2}\left[1-\left(\frac{1}{5}\right)^{N+1}\right]$; the series converges to $\frac{5}{2}$`, R`(3) Yes: the ratio test gives $\frac{1}{2}<1$`, R`(4) $x_2=\frac{5}{4}$`],
        sol: R`**(1)** Expand and divide by $n^2$: $\frac{n^2+2n+1}{3n^2-n}=\frac{1+2/n+1/n^2}{3-1/n}\to\frac{1}{3}$.

**(2)** Geometric with first term $2$ and $r=\frac{1}{5}$: $s_N=2\cdot\frac{1-(1/5)^{N+1}}{1-1/5}=\frac{5}{2}\left[1-\left(\frac{1}{5}\right)^{N+1}\right]$, which tends to $\frac{5}{2}$.

**(3)** Ratio test: $\frac{a_{n+1}}{a_n}=\frac{(n+1)^2}{2^{n+1}}\cdot\frac{2^n}{n^2}=\frac{1}{2}\left(1+\frac{1}{n}\right)^2\to\frac{1}{2}<1$, so it converges.

**(4)** $f(1)=-1$ and $f'(x)=4x^3$ gives $f'(1)=4$. So $x_2=1-\frac{-1}{4}=\frac{5}{4}$.`,
      },
      {
        topic: 'Linear approximation and Taylor', label: 'Q.6', stem: R`Answer each part.`, pts: [3, 2, 5],
        parts: [
          R`Use a local linear approximation to estimate $\dfrac{1}{0.98}$.`,
          R`Is the estimate in (1) too big or too small? Explain why.`,
          R`Compute the coefficients of the Taylor series of $f(x)=\ln x$ about $x=2$, up to $(x-2)^3$.`,
        ],
        answer: [R`(1) $\frac{1}{0.98}\approx1.02$`, R`(2) too small: $f''>0$, so the curve is concave up`, R`(3) $\ln 2,\ \frac{1}{2},\ -\frac{1}{8},\ \frac{1}{24}$`],
        sol: R`**(1)** Use $f(x)=\frac{1}{x}$ at $a=1$: $f(1)=1$ and $f'(x)=-\frac{1}{x^2}$ gives $f'(1)=-1$. So $\frac{1}{0.98}\approx1+(-1)(0.98-1)=1.02$.

**(2)** $f''(x)=\frac{2}{x^3}>0$ near $x=1$: concave up, so the tangent line lies below the curve and the estimate is too small.

**(3)** $f=\ln x$, $f'=\frac{1}{x}$, $f''=-\frac{1}{x^2}$, $f'''=\frac{2}{x^3}$. At $x=2$: $\ln 2$, $\frac{1}{2}$, $-\frac{1}{4}$, $\frac{1}{4}$.

Divide each by $k!$: $c_0=\ln 2$, $c_1=\frac{1}{2}$, $c_2=-\frac{1}{8}$, $c_3=\frac{1}{4\cdot6}=\frac{1}{24}$.`,
      },
    ],
  },
];
