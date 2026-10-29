// Content for the CLA1 midterm review page. Units follow the course schedule (derivative part): one unit per
// lesson, with the schedule's day numbers, dates and names. Unit ids are stable keys, not positions.
// Markup: $inline$, $$display$$, **bold**, "- " list items (continuation lines join the item),
// blank line = new block. Every answer here is checked in verify.py.
const R = String.raw;

export const units = [
  {
    id: 'u1', quiz: 'Quiz 01', days: 'Day 1 & 2', dates: '8 & 9 Oct',
    title: 'Continuous functions',
    ideas: R`
- **Plug in carefully.** "·" means multiply, so look for a zero factor first: $\ln 1=0$, $\sin 0=0$, $\cos\frac{\pi}{2}=0$, while $e^0=1$.
- **Inverse trig ranges:** $\arcsin$ lands in $[-\frac{\pi}{2},\frac{\pi}{2}]$, $\arccos$ in $[0,\pi]$, $\arctan$ in $(-\frac{\pi}{2},\frac{\pi}{2})$.
- **Limits:** plug in first. A $\frac{0}{0}$ result means simplify (factor and cancel, or use the conjugate), then plug in. The limit exists only when the left and right limits agree.
- **Limit laws:** if $f\to L$ and $g\to M$ (numbers), then
$$\begin{gathered}f\pm g\to L\pm M,\qquad fg\to LM\\[4pt]\frac{f}{g}\to\frac{L}{M}\quad(M\ne0)\end{gathered}$$
- **Special limits:**
$$\begin{aligned}\lim_{x\to0}\frac{\sin x}{x}&=1\\[4pt]\lim_{x\to0}\frac{1-\cos x}{x}&=0\\[4pt]\lim_{x\to0}\frac{e^x-1}{x}&=1\end{aligned}$$
- **Continuity at $a$:** $f(a)$ is defined, $\lim_{x\to a}f(x)$ exists, and the two are equal. A break is removable (a hole), a jump, or infinite.`,
    watch: R`
- Reading "·" as "+" is an easy slip. Rewrite products with × before you plug in.
- $\frac{0}{0}$ is never the answer. It tells you to simplify first.`,
  },
  {
    id: 'u2', quiz: 'Quiz 02', days: 'Day 3 & 4', dates: '12 & 13 Oct',
    title: 'Derivatives of functions and chain rule',
    ideas: R`
- **Definition:**
$$f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$$
Tangent line at $x_0$:
$$y=f(x_0)+f'(x_0)(x-x_0)$$
- **Rules:**
$$\begin{aligned}(x^n)'&=nx^{n-1}\\[2pt](fg)'&=f'g+fg'\\[2pt]\left(\frac{f}{g}\right)'&=\frac{f'g-fg'}{g^2}\end{aligned}$$
- **Basic derivatives:**
$$\begin{aligned}(\sin x)'&=\cos x&\quad(\cos x)'&=-\sin x\\[2pt](\tan x)'&=\sec^2x&\quad(e^x)'&=e^x\\[2pt](a^x)'&=a^x\ln a&\quad(\ln x)'&=\frac{1}{x}\end{aligned}$$
- **Chain rule:**
$$\big(f(g(x))\big)'=f'(g(x))\cdot g'(x)$$
You only need the base formulas: each "u-version" is the base formula times $u'$. Example:
$$\big(\ln(\cos x)\big)'=\frac{-\sin x}{\cos x}=-\tan x$$
- **Higher-order derivatives:** $f''=(f')'$ and $f'''=(f'')'$.`,
    watch: R`
- The product rule always has two terms: $(x^2\cdot x^3)'=2x\cdot x^3+x^2\cdot 3x^2=5x^4$.
- In the tangent formula the slope is $f'(x_0)$. Don't use $x_0$ itself as the slope.
- Carry the minus from $(\cos x)'=-\sin x$ all the way to the end.
- $(2^x)'=2^x\ln 2$, not $x\cdot 2^{x-1}$.`,
  },
  {
    id: 'u3', quiz: 'Quiz 03', days: 'Day 5 & 6', dates: '15 & 16 Oct',
    title: 'Implicit differentiation and parametric curve',
    ideas: R`
- **Implicit differentiation:** differentiate both sides with respect to $x$ and attach $y'$ to every $y$-term: $(y^3)'=3y^2y'$, $(\sin y)'=\cos y\cdot y'$, $(xy)'=y+xy'$. Then collect the $y'$ terms and factor.
- **Tangent lines:** put both $x_0$ and $y_0$ into $y'$, then use $y-y_0=m(x-x_0)$. On a circle $x^2+y^2=r^2$, $y'=-\dfrac{x}{y}$ and the tangent is perpendicular to the radius.
- **Vertical tangent:** if $y'=\dfrac{N}{D}$ has $D=0$ but $N\ne0$ at a point, $\frac{dy}{dx}$ doesn't exist and the tangent is vertical. A double root when you plug in $x$ is the warning sign.
- **Inverse functions:** if $f(a)=b$, then
$$(f^{-1})'(b)=\frac{1}{f'(a)}$$
Solve $f(a)=b$ first.
- **Inverse trig:**
$$\begin{aligned}(\arcsin x)'&=\frac{1}{\sqrt{1-x^2}}\\[4pt](\arccos x)'&=-\frac{1}{\sqrt{1-x^2}}\\[4pt](\arctan x)'&=\frac{1}{1+x^2}\end{aligned}$$
- **Reciprocal trig:** $(\cot x)'=-\csc^2x$, $(\sec x)'=\sec x\tan x$, $(\csc x)'=-\csc x\cot x$.
- **Parametric curves:** slope and second derivative:
$$\begin{gathered}\frac{dy}{dx}=\frac{dy/dt}{dx/dt}\\[6pt]\frac{d^2y}{dx^2}=\frac{\frac{d}{dt}\!\left(\frac{dy}{dx}\right)}{dx/dt}\end{gathered}$$`,
    watch: R`
- Every $y$-term gets a $y'$: $\sin y=x$ gives $\cos y\cdot y'=1$, not $\cos y=0$. And $\frac{dx}{dx}=1$.
- Signs at negative points: on $x^2+y^2=10$ at $(1,-3)$, $y'=-\dfrac{1}{-3}=+\dfrac{1}{3}$.
- In the inverse formula use $f'(a)$, not $f'(b)$.
- The second derivative is not a ratio of second derivatives:
$$\frac{d^2y}{dx^2}\ne\frac{d^2y/dt^2}{d^2x/dt^2}$$`,
  },
  {
    id: 'u4', quiz: 'Quiz 04', days: 'Day 7 & 8', dates: '19 & 20 Oct',
    title: 'Maximum and minimum problem',
    ideas: R`
- **Critical points:** numbers $c$ in the domain where $f'(c)=0$ or $f'(c)$ doesn't exist.
- **First derivative test:** $f'$ goes $+\to-$: relative max. $-\to+$: relative min. No sign change: neither.
- **Second derivative test** (when $f'(c)=0$): $f''(c)<0$ means concave down, a relative max. $f''(c)>0$ means concave up, a relative min. $f''(c)=0$ gives no conclusion.
- **Closed interval method:** evaluate $f$ at the critical points inside $[a,b]$ and at both endpoints. The largest value is the absolute max, the smallest the absolute min.
- **Inflection points:** where $f''$ changes sign. Report the point $(c,f(c))$.
- **Logs:** $\ln$ is increasing, so compare the insides. On Quiz 04, $\log$ means $\ln$.`,
    watch: R`
- $x^2=1$ has two roots, $x=\pm1$.
- $|x^2-2x|$ is never negative. Plug into the original absolute value, not into one piece of it.
- Critical points come from $f'=0$, not $f=0$.
- The $y$-coordinate is always $f(c)$, never $f'(c)$ or $f''(c)$.
- $f''(c)=0$ alone doesn't make an inflection point: $x^4$ has none at $0$.`,
  },
  // Day 9 has no quiz of its own; Quiz 05 (Days 10 & 11) also asks about it.
  {
    id: 'u7', quiz: null, days: 'Day 9', dates: '22 Oct', added: '2026-10-29',
    title: 'Infinite series',
    ideas: R`
- **Sequence limits:** divide every term by the highest power of $n$, or by the biggest base. $r^n\to0$ when $|r|<1$.
- **Partial sums:** $s_N=\sum_{n=0}^{N}a_n$, and the infinite series is $\lim_{N\to\infty}s_N$.
- **Geometric:** the partial sum, and the infinite sum when $|r|<1$:
$$\begin{aligned}\sum_{n=0}^{N}r^n&=\frac{1-r^{N+1}}{1-r}\\[4pt]\sum_{n=0}^{\infty}r^n&=\frac{1}{1-r}\end{aligned}$$
When $|r|\ge1$ it diverges.
- **Tests:** if $a_n\not\to0$, the series diverges. Ratio test:
$$r=\lim_{n\to\infty}\left|\frac{a_{n+1}}{a_n}\right|$$
$r<1$ converges, $r>1$ diverges, $r=1$ says nothing.
- **Typical series:** $\sum\dfrac{1}{n^p}$ converges only when $p>1$, so the harmonic series $\sum\dfrac{1}{n}$ diverges. Telescoping:
$$\sum_{n=1}^{\infty}\frac{1}{n(n+1)}=1$$
- **Power series:** $\sum c_nx^n$ converges for $|x|<R$. Find the radius $R$ with the ratio test, then check $x=\pm R$ separately.`,
    watch: R`
- Divide every term, constants included. $\left(\dfrac{2}{3}\right)^n$ shrinks to $0$.
- Check where the sum starts. From $n=0$ the first term is $1$, and the exponent in $s_N$ is $N+1$.
- $a_n\to0$ alone doesn't make a series converge: $\dfrac{1}{n}\to0$, but $\sum\dfrac{1}{n}$ diverges.`,
  },
  {
    id: 'u5', quiz: 'Quiz 05', days: 'Day 10 & 11', dates: '26 & 27 Oct',
    title: "Newton's method and Taylor series",
    ideas: R`
- **Newton's method:**
$$x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$$
Each $x_n$ is an approximation of the root, not the root.
- **When it's guaranteed on $[a,b]$:** $f(a)$ and $f(b)$ have opposite signs, and $f'$ and $f''$ don't change sign. Start at the endpoint where $f(x_1)\,f''(x_1)>0$.
- **Linear approximation:** $f(x)\approx f(a)+f'(a)(x-a)$. Concave down means the estimate is too big; concave up, too small.
- **Taylor coefficients:**
$$c_k=\frac{f^{(k)}(a)}{k!}$$
Simplify first: $\cos^2x-\sin^2x=\cos 2x$ and $\sin x\cos x=\frac{1}{2}\sin 2x$.
- **Taylor polynomial:**
$$p_n(x)=\sum_{k=0}^{n}c_k(x-a)^k$$
With $a=0$ it's called a Maclaurin polynomial.`,
    watch: R`
- Watch the signs in $x-\dfrac{f}{f'}$ when $f$ is negative, and the decimals: $\frac{1}{10}=0.1$.
- Divide by $k!$: $c_2=\dfrac{f''(a)}{2}$ and $c_3=\dfrac{f'''(a)}{6}$.`,
  },
  // A lesson that no quiz or exam covers: quiz is null, so it has no Quizzes entry and stays out of the mocks.
  {
    id: 'u6', quiz: null, days: 'Day 12', dates: '29 Oct', note: 'Not on the midterm', added: '2026-10-29',
    title: 'Introduction to differential equation',
    intro: R`An introduction only. It isn't on the midterm, and differential equations are covered in full in a later semester.`,
    ideas: R`
- **What it is:** an equation linking an unknown function $y(x)$ with its derivatives, like $y'=2y$. Solving it means finding every function that makes it true. The **order** is the highest derivative: $y'=2y$ is first order, and $y''+y=0$ is second order.
- **Checking a solution:** differentiate the given $y$ and substitute it into both sides. For $y=Ce^{2x}$, $y'=2Ce^{2x}=2y$, so it solves $y'=2y$ for every $C$.
- **Ambiguity of the solution:** the equation alone doesn't fix one function, because constants disappear when you differentiate. $y'=2x$ is solved by $y=x^2+C$ for any $C$. The general solution has as many free constants as the order.
- **Initial conditions:** a value such as $y(0)=3$ picks one curve from the family. Solve first and keep $C$, then substitute the condition, solve for $C$ and write the function. You need one condition per constant, usually $y(0)$ and $y'(0)$ for second order.
- **$y'=f(x)$:** integrate, $y=\int f(x)\,dx+C$. With $f'(x)=\dfrac{1}{x}$ and $f(1)=0$, $f(x)=\ln x$. With $f'(x)=e^x$ and $f(0)=e$, $f(x)=e^x+e-1$.
- **$y'=\lambda y$:** since $(e^{\lambda x})'=\lambda e^{\lambda x}$, the general solution is $y=Ce^{\lambda x}$, and $C=y(0)$. Here $C$ multiplies instead of being added. It grows for $\lambda>0$ and decays for $\lambda<0$.
- **Why only $Ce^{\lambda x}$:** dividing by $y$ gives $(\ln|y|)'=\lambda$, so $\ln|y|=\lambda x+c$ and $y=\pm e^{c}e^{\lambda x}$. Together with $y=0$, that is $Ce^{\lambda x}$ for any real $C$.
- **Second order, $y''+ay'+by=0$:** try $y=e^{\lambda x}$. Then $(\lambda^2+a\lambda+b)e^{\lambda x}=0$, and since $e^{\lambda x}\ne0$, the **characteristic equation** $\lambda^2+a\lambda+b=0$ must hold. If $y_1$ and $y_2$ are solutions, so is $C_1y_1+C_2y_2$.
- **Three cases,** by the sign of $\Delta=a^2-4b$, writing complex roots as $\lambda=\alpha\pm\beta i$:
$$\begin{aligned}\Delta>0&:\ y=C_1e^{\lambda_1x}+C_2e^{\lambda_2x}\\ \Delta=0&:\ y=(C_1+C_2x)e^{\lambda x}\\ \Delta<0&:\ y=e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)\end{aligned}$$
For $\Delta=0$, $xe^{\lambda x}$ is a second solution because $2\lambda+a=0$. For $\Delta<0$, Euler's formula $e^{i\theta}=\cos\theta+i\sin\theta$ turns the complex exponentials into $\cos$ and $\sin$.`,
    watch: R`
- Solve the equation first, then use the condition, and end with the function itself, not just "$C=\dots$".
- The given value goes on the right: $f(0)=e$ means $1+C=e$, so $C=e-1$, not $-1$.
- $C$ is the starting value only when the condition is at $x=0$. For $y=Ce^{-2x}$ with $y(1)=5$, $Ce^{-2}=5$ gives $C=5e^{2}$, not $e^{-2}$.
- A condition on $y'$ goes into the formula for $y'$, so differentiate the general solution first.
- With a repeated root, $C_1e^{\lambda x}+C_2e^{\lambda x}$ is really one constant. The second solution is $xe^{\lambda x}$.`,
  },
];

export const habits = R`
- Rewrite every "·" as × before plugging in, and look for a zero factor.
- Solve equations completely: $x^2=1$ gives $\pm1$, and a cubic can hide a double root.
- After differentiating, check every term: two terms for a product, a $y'$ on every $y$-term, the inner derivative for a chain.
- Keep answers exact. Without a calculator, $\frac{\sqrt2}{2}$, $\ln\frac{7}{8}$ and $2+e$ are finished answers.`;

// ---------------- Practice ----------------
export const practice = {
  u1: [
    { src: 'Like Quiz 01 Q.1',
      stem: R`Compute the value of each function at $P$.`,
      parts: [R`$f(x)=2x^3-x^2+5$;  $P:\ x=-1$`, R`$f(\theta)=\cos(\theta)\cdot\sin(2\theta)$;  $P:\ \theta=\frac{\pi}{4}$`,
              R`$f(x)=3e^{x^2-3}$;  $P:\ x=-\sqrt3$`, R`$f(x)=(x-2)\cdot\ln(x^2+1)$;  $P:\ x=0$`],
      hint: R`Rewrite every "·" as ×. One of these has a factor equal to $0$.`,
      answer: [R`(1) $2$`, R`(2) $\frac{\sqrt2}{2}$`, R`(3) $3$`, R`(4) $0$`],
      sol: R`
- (1) $2(-1)^3-(-1)^2+5=-2-1+5=2$
- (2) $\cos\frac{\pi}{4}\cdot\sin\frac{\pi}{2}=\frac{\sqrt2}{2}\cdot 1=\frac{\sqrt2}{2}$
- (3) $x^2-3=3-3=0$, so $f=3e^0=3$
- (4) $(0-2)\cdot\ln 1=(-2)\cdot 0=0$` },
    { src: 'Inverse trig values',
      stem: R`Give the exact value.`,
      parts: [R`$\arcsin\left(-\frac{1}{2}\right)$`, R`$\arccos\left(-\frac{\sqrt2}{2}\right)$`, R`$\arctan\sqrt3-\arctan 1$`],
      hint: R`The answer must land in the range: $[-\frac{\pi}{2},\frac{\pi}{2}]$ for arcsin, $[0,\pi]$ for arccos.`,
      answer: [R`(1) $-\frac{\pi}{6}$`, R`(2) $\frac{3\pi}{4}$`, R`(3) $\frac{\pi}{12}$`],
      sol: R`
- (1) $\sin\left(-\frac{\pi}{6}\right)=-\frac{1}{2}$, and $-\frac{\pi}{6}$ is in arcsin's range.
- (2) $\cos\frac{3\pi}{4}=-\frac{\sqrt2}{2}$, and $\frac{3\pi}{4}$ is in $[0,\pi]$. The tempting $-\frac{\pi}{4}$ is outside arccos's range.
- (3) $\frac{\pi}{3}-\frac{\pi}{4}=\frac{\pi}{12}$` },
    { src: 'Like Quiz 01 Q.2',
      stem: R`Let $f(x)=\dfrac{x+3}{x^2-9}$.`,
      parts: [R`Compute the limits at $x=-3$ from the left and right.`, R`Check the continuity of $f$ at $x=-3$.`,
              R`Compute the limits at $x=3$ from the left and right.`],
      hint: R`Factor $x^2-9=(x-3)(x+3)$ and cancel before you plug in.`,
      answer: [R`(1) both $-\frac{1}{6}$`, R`(2) not continuous: $f(-3)$ is undefined (removable discontinuity)`,
               R`(3) $-\infty$ from the left, $+\infty$ from the right`],
      sol: R`
For $x\ne\pm3$: $f(x)=\frac{x+3}{(x-3)(x+3)}=\frac{1}{x-3}$.

- (1) $\frac{1}{-3-3}=-\frac{1}{6}$ from both sides, so the limit is $-\frac{1}{6}$.
- (2) $f(-3)=\frac{0}{0}$ is undefined, so the first condition fails. The limit exists, so this is a removable discontinuity (a hole).
- (3) Just left of $3$, $x-3$ is a tiny negative number, so $\frac{1}{x-3}\to-\infty$. Just right, it is tiny and positive, so $\frac{1}{x-3}\to+\infty$. This is an infinite discontinuity.` },
    { src: 'Continuity of a piecewise function',
      stem: R`Find $k$ so that $f$ is continuous at $x=2$.
$$f(x)=\begin{cases}kx+3, & x<2\\ x^2-k, & x\ge 2\end{cases}$$`,
      parts: [],
      hint: R`The limit from the left must equal $f(2)$.`,
      answer: [R`$k=\frac{1}{3}$`],
      sol: R`
Left limit: $2k+3$. Right limit and $f(2)$: $4-k$.

Set them equal: $2k+3=4-k$, so $3k=1$ and $k=\frac{1}{3}$. Check: both sides give $\frac{11}{3}$.` },
    { src: 'Limits and special limits',
      stem: R`Compute each limit.`,
      parts: [R`$\displaystyle\lim_{x\to4}\frac{\sqrt{x}-2}{x-4}$`, R`$\displaystyle\lim_{x\to0}\frac{\sin 5x}{x}$`, R`$\displaystyle\lim_{x\to0}\frac{e^{2x}-1}{x}$`],
      hint: R`(1) is $\frac{0}{0}$: factor $x-4=(\sqrt{x}-2)(\sqrt{x}+2)$. For (2) and (3), make a special limit appear.`,
      answer: [R`(1) $\frac{1}{4}$`, R`(2) $5$`, R`(3) $2$`],
      sol: R`
- (1) $\frac{\sqrt{x}-2}{(\sqrt{x}-2)(\sqrt{x}+2)}=\frac{1}{\sqrt{x}+2}\to\frac{1}{4}$
- (2) $\frac{\sin 5x}{x}=5\cdot\frac{\sin 5x}{5x}\to 5\cdot 1=5$
- (3) $\frac{e^{2x}-1}{x}=2\cdot\frac{e^{2x}-1}{2x}\to 2\cdot 1=2$` },
  ],
  u2: [
    { src: 'Like Quiz 02 Q.1',
      stem: R`Compute the derivative of $f(x)$ at $P$.`,
      parts: [R`$f(x)=x^5-3x^3+x$;  $P:\ x=-1$`, R`$f(x)=e^x+\ln x$;  $P:\ x=1$`],
      hint: R`Even powers of $-1$ are $+1$; odd powers are $-1$.`,
      answer: [R`(1) $-3$`, R`(2) $e+1$`],
      sol: R`
- (1) $f'(x)=5x^4-9x^2+1$, so $f'(-1)=5-9+1=-3$.
- (2) $f'(x)=e^x+\frac{1}{x}$, so $f'(1)=e+1$.` },
    { src: 'Like Quiz 02 Q.2',
      stem: R`Compute the derivative with respect to the variable at $P$.`,
      parts: [R`$f(\theta)=\theta^2\cdot\cos(\theta)$;  $P:\ \theta=\pi$`, R`$f(t)=t^3\cdot\ln(t)$;  $P:\ t=e$`],
      hint: R`$(uv)'=u'v+uv'$: two terms every time. And $\ln e=1$.`,
      answer: [R`(1) $-2\pi$`, R`(2) $4e^2$`],
      sol: R`
- (1) $f'(\theta)=2\theta\cos\theta-\theta^2\sin\theta$. At $\pi$: $2\pi(-1)-\pi^2\cdot 0=-2\pi$.
- (2) $f'(t)=3t^2\ln t+t^3\cdot\frac{1}{t}=3t^2\ln t+t^2$. At $e$: $3e^2+e^2=4e^2$.` },
    { src: 'Like Quiz 02 Q.3',
      stem: R`Compute the derivative of the composite function $f(g(x))$ at $P$.`,
      parts: [R`$f(x)=\sqrt{3+x}$, $g(x)=\cos(x)$;  $P:\ x=\frac{\pi}{2}$`, R`$f(x)=\ln(x)$, $g(x)=x^2+3$;  $P:\ x=1$`],
      hint: R`Write out $f(g(x))$ first, then take (outer derivative) × (inner derivative).`,
      answer: [R`(1) $-\frac{\sqrt3}{6}$`, R`(2) $\frac{1}{2}$`],
      sol: R`
- (1) $f(g(x))=\sqrt{3+\cos x}$, so the derivative is $\frac{-\sin x}{2\sqrt{3+\cos x}}$. At $\frac{\pi}{2}$: $\frac{-1}{2\sqrt3}=-\frac{\sqrt3}{6}$.
- (2) $f(g(x))=\ln(x^2+3)$, so the derivative is $\frac{2x}{x^2+3}$. At $1$: $\frac{2}{4}=\frac{1}{2}$.` },
    { src: 'Chain rule with log and trig',
      stem: R`Find $y'$ at the given point.`,
      parts: [R`$y=\ln(\sin x)$;  $x=\frac{\pi}{4}$`, R`$y=\cos^2(2x)$;  $x=\frac{\pi}{8}$`],
      hint: R`(2) has three layers: the square, the cosine, and $2x$.`,
      answer: [R`(1) $1$`, R`(2) $-2$`],
      sol: R`
- (1) $y'=\frac{\cos x}{\sin x}=\cot x$, and $\cot\frac{\pi}{4}=1$.
- (2) $y'=2\cos(2x)\cdot(-\sin 2x)\cdot 2=-4\sin 2x\cos 2x=-2\sin 4x$. At $\frac{\pi}{8}$: $-2\sin\frac{\pi}{2}=-2$.` },
    { src: 'Definition and tangent line',
      stem: R`Definition and tangent line.`,
      parts: [R`Use the limit definition to find $f'(x)$ for $f(x)=x^2-3x$.`, R`Find the tangent line to $y=x^3-2x$ at $x=1$.`],
      hint: R`(2) You need a point and a slope: $y(1)$ and $y'(1)$.`,
      answer: [R`(1) $f'(x)=2x-3$`, R`(2) $y=x-2$`],
      sol: R`
- (1) Expand and cancel before letting $h\to0$:
$$\begin{aligned}&\frac{(x+h)^2-3(x+h)-x^2+3x}{h}\\=\;&\frac{2xh+h^2-3h}{h}=2x+h-3\\\to\;&2x-3\end{aligned}$$
- (2) $y(1)=1-2=-1$ and $y'=3x^2-2$, so $y'(1)=1$. Tangent: $y=1\cdot(x-1)+(-1)=x-2$.` },
  ],
  u3: [
    { src: 'Like Quiz 03 Q.1(1)',
      stem: R`Compute the derivative at the point $P$.`,
      parts: [R`$f(x)=\dfrac{1}{\cos(x)}$;  $P:\ x=\frac{\pi}{3}$`, R`$f(x)=\dfrac{1}{\sin(x)}$;  $P:\ x=-\frac{\pi}{6}$`],
      hint: R`$\frac{1}{\cos x}=(\cos x)^{-1}$: use the chain rule, or recognise $\sec x$ and $\csc x$.`,
      answer: [R`(1) $2\sqrt3$`, R`(2) $-2\sqrt3$`],
      sol: R`
- (1) $f'(x)=-(\cos x)^{-2}\cdot(-\sin x)=\frac{\sin x}{\cos^2x}$. At $\frac{\pi}{3}$: $\frac{\sqrt3/2}{1/4}=2\sqrt3$.
- (2) $f'(x)=-\frac{\cos x}{\sin^2x}$. At $-\frac{\pi}{6}$: $\sin^2\left(-\frac{\pi}{6}\right)=\frac{1}{4}$ (squaring removes the minus) and $\cos\left(-\frac{\pi}{6}\right)=\frac{\sqrt3}{2}$, so $f'=-\frac{\sqrt3/2}{1/4}=-2\sqrt3$.` },
    { src: 'Like Quiz 03 Q.1(2)',
      stem: R`Inverse functions.`,
      parts: [R`$y=f(x)=e^{3x-6}$. Compute the derivative of $f^{-1}(y)$ at $y=1$.`, R`$f(x)=x^5+3x-2$. Find $(f^{-1})'(2)$.`,
              R`Find $\frac{d}{dx}\arctan(2x)$ at $x=\frac{1}{2}$.`],
      hint: R`First solve $f(a)=b$ for $a$. Then $(f^{-1})'(b)=\frac{1}{f'(a)}$.`,
      answer: [R`(1) $\frac{1}{3}$`, R`(2) $\frac{1}{8}$`, R`(3) $1$`],
      sol: R`
- (1) $e^{3a-6}=1$ gives $a=2$. $f'(x)=3e^{3x-6}$, so $f'(2)=3$ and the answer is $\frac{1}{3}$. Check: $f^{-1}(y)=\frac{\ln y+6}{3}$ has derivative $\frac{1}{3y}$, which is $\frac{1}{3}$ at $y=1$.
- (2) $a^5+3a-2=2$ gives $a=1$. $f'(x)=5x^4+3$, so $f'(1)=8$ and the answer is $\frac{1}{8}$. Using $f'(2)=83$ is the classic slip.
- (3) $\frac{2}{1+(2x)^2}$ at $x=\frac{1}{2}$ is $\frac{2}{2}=1$.` },
    { src: 'Like Quiz 03 Q.2',
      stem: R`Consider the curve $C:\ y^3+6xy^2+8x^2y+x+y+1=0$.`,
      parts: [R`Find two points on $C$ with $x=-1$.`, R`Compute $\frac{dy}{dx}$ at those points.`],
      hint: R`At $x=-1$ the constants cancel, so you can factor out $y$.`,
      answer: [R`(1) $(-1,0)$ and $(-1,3)$`, R`(2) $-\frac{1}{9}$ at $(-1,0)$. At $(-1,3)$ the tangent is vertical, so $\frac{dy}{dx}$ doesn't exist.`],
      sol: R`
- (1) $y^3-6y^2+8y-1+y+1=y^3-6y^2+9y=y(y-3)^2=0$, so $y=0$ or $y=3$.
- (2) Differentiate: $3y^2y'+6y^2+12xyy'+16xy+8x^2y'+1+y'=0$, so
$$y'=-\frac{6y^2+16xy+1}{3y^2+12xy+8x^2+1}$$
At $(-1,0)$: $-\frac{1}{9}$. At $(-1,3)$: the top is $54-48+1=7$ and the bottom is $27-36+8+1=0$, so the tangent is vertical. The double root $y=3$ warned you.` },
    { src: 'Tangent lines on implicit curves',
      stem: R`Tangent lines on implicit curves.`,
      parts: [R`Find the tangent line to $x^2+y^2=20$ at $(2,-4)$.`, R`Find $\frac{dy}{dx}$ for $e^y+xy=e$ at $(0,1)$.`],
      hint: R`Put both coordinates into $y'$. Watch the sign of $y=-4$.`,
      answer: [R`(1) $y=\frac{1}{2}x-5$ (or $x-2y=10$)`, R`(2) $-\frac{1}{e}$`],
      sol: R`
- (1) $2x+2yy'=0$, so $y'=-\frac{x}{y}=-\frac{2}{-4}=\frac{1}{2}$. Then $y+4=\frac{1}{2}(x-2)$, which gives $y=\frac{1}{2}x-5$. Check: the radius has slope $-2$, and $\frac{1}{2}\cdot(-2)=-1$, so they're perpendicular.
- (2) $e^yy'+y+xy'=0$, so $y'=-\frac{y}{e^y+x}$. At $(0,1)$: $-\frac{1}{e}$.` },
    { src: 'Like Quiz 03 Q.3',
      stem: R`Consider the parameterization $x=\ln(t)$, $y=t\cos(t)$.`,
      parts: [R`Compute the slope $\frac{dy}{dx}$ at $t=\pi$.`, R`Compute $\frac{d^2y}{dx^2}$ at $t=\frac{\pi}{2}$.`],
      hint: R`$\frac{dx}{dt}=\frac{1}{t}$, so dividing by it is the same as multiplying by $t$.`,
      answer: [R`(1) $-\pi$`, R`(2) $-\frac{3\pi^2}{4}$`],
      sol: R`
- (1) $\frac{dy}{dt}=\cos t-t\sin t$, so $\frac{dy}{dx}=t(\cos t-t\sin t)=t\cos t-t^2\sin t$. At $\pi$: $-\pi-0=-\pi$.
- (2) $\frac{d}{dt}\left(\frac{dy}{dx}\right)=\cos t-t\sin t-2t\sin t-t^2\cos t=\cos t-3t\sin t-t^2\cos t$. Dividing by $\frac{1}{t}$:
$$\frac{d^2y}{dx^2}=t\cos t-3t^2\sin t-t^3\cos t$$
At $\frac{\pi}{2}$: $0-3\cdot\frac{\pi^2}{4}\cdot 1-0=-\frac{3\pi^2}{4}$.` },
  ],
  u4: [
    { src: 'Like Quiz 04 Q.1',
      stem: R`Consider $f(x)=x^3-3x^2-9x+5$.`,
      parts: [R`Find the two critical points of $f(x)$.`, R`Determine the concavity using the second derivative test at each point.`,
              R`Give the values of the relative maximum and minimum.`],
      hint: R`Factor $f'(x)$ completely before solving.`,
      answer: [R`(1) $x=-1$ and $x=3$`, R`(2) $f''(-1)=-12<0$: concave down. $f''(3)=12>0$: concave up.`, R`(3) relative max $10$, relative min $-22$`],
      sol: R`
- (1) $f'(x)=3x^2-6x-9=3(x-3)(x+1)$, so $x=-1$ and $x=3$.
- (2) $f''(x)=6x-6$. $f''(-1)=-12<0$: concave down, so a relative max. $f''(3)=12>0$: concave up, so a relative min.
- (3) $f(-1)=-1-3+9+5=10$ and $f(3)=27-27-27+5=-22$.` },
    { src: 'Like Quiz 04 Q.2',
      stem: R`Find the absolute maximum and minimum of $f(x)$ in the domain $D$.
$$\begin{gathered}f(x)=\ln(x^2-2x+2)\\ D:\ 0\le x\le 3\end{gathered}$$`,
      parts: [],
      hint: R`$\ln$ is increasing, so the largest inside value gives the largest $f$.`,
      answer: [R`absolute max $\ln 5$ at $x=3$; absolute min $0$ at $x=1$`],
      sol: R`
$f'(x)=\frac{2x-2}{x^2-2x+2}$. The bottom is $(x-1)^2+1>0$, so the only critical point is $x=1$.

- Candidates: $f(0)=\ln 2$, $f(1)=\ln 1=0$, $f(3)=\ln 5$.
- Since $1<2<5$, the max is $\ln 5$ and the min is $0$.` },
    { src: 'Absolute value on an interval',
      stem: R`Find the absolute maximum and minimum of $h(x)=|x^2-4x|$ on $[-1,3]$.`,
      parts: [],
      hint: R`Check where the inside is $0$ (corners), where the inside's derivative is $0$, and both endpoints. Every value of $h$ is at least $0$.`,
      answer: [R`absolute max $5$ at $x=-1$; absolute min $0$ at $x=0$`],
      sol: R`
The inside $u=x^2-4x$ is $0$ at $x=0$ and $x=4$ (only $0$ is in the interval), and $u'=2x-4=0$ at $x=2$.

- $h(-1)=|1+4|=5$, $h(0)=0$, $h(2)=|4-8|=4$, $h(3)=|9-12|=3$.
- Max $5$, min $0$. A negative "minimum" would mean you plugged into one piece instead of the absolute value.` },
    { src: 'Inflection points',
      stem: R`Inflection points.`,
      parts: [R`Find the inflection points of $f(x)=x^4-6x^2+1$ and where $f$ is concave up or down.`, R`Does $g(x)=x^4+x$ have an inflection point at $x=0$?`],
      hint: R`Solve $f''=0$, then check that $f''$ actually changes sign.`,
      answer: [R`(1) $(-1,-4)$ and $(1,-4)$. Concave up on $(-\infty,-1)$ and $(1,\infty)$, concave down on $(-1,1)$.`, R`(2) No`],
      sol: R`
- (1) $f''(x)=12x^2-12=12(x-1)(x+1)$, zero at $x=\pm1$ (both roots). The sign goes $+,-,+$, so both are inflection points. The $y$-coordinates come from $f$: $f(\pm1)=1-6+1=-4$.
- (2) $g''(x)=12x^2\ge0$ never changes sign, so there's no inflection point, even though $g''(0)=0$.` },
    { src: 'Non-differentiable points',
      stem: R`Let $f(x)=x^{1/3}(x-4)$.`,
      parts: [R`Find all critical points.`, R`Classify each one.`],
      hint: R`Write $f=x^{4/3}-4x^{1/3}$, differentiate, and factor out $x^{-2/3}$.`,
      answer: [R`(1) $x=0$ ($f'$ undefined) and $x=1$ ($f'=0$)`, R`(2) $x=1$: relative min, $f(1)=-3$. $x=0$: neither.`],
      sol: R`
$$f'(x)=\tfrac{4}{3}x^{1/3}-\tfrac{4}{3}x^{-2/3}=\frac{4(x-1)}{3x^{2/3}}$$

- $x^{2/3}>0$ for $x\ne0$, so $f'$ has the sign of $x-1$: negative on both sides of $0$, positive after $1$.
- So $x=0$ is not an extremum (vertical tangent, no sign change), and $x=1$ is a relative min with $f(1)=1\cdot(-3)=-3$.
- The second derivative test can't be used at $0$, because $f'(0)$ doesn't exist.` },
  ],
  u5: [
    { id: '5.3', src: 'Like Quiz 05 Q.2',
      stem: R`Apply Newton's method and compute the second approximation $x_2$, with initial position $x_1=1$.`,
      parts: [R`$f(x)=3x^5-x^2+x-2$;  $D:\ 0\le x\le 1$`, R`$f(x)=x^4+x-3$;  $D:\ 1\le x\le 2$`],
      hint: R`$x_2=x_1-\frac{f(x_1)}{f'(x_1)}$. In (2), $f(1)$ is negative.`,
      answer: [R`(1) $x_2=\frac{13}{14}$`, R`(2) $x_2=\frac{6}{5}=1.2$`],
      sol: R`
- (1) $f(1)=3-1+1-2=1$ and $f'(x)=15x^4-2x+1$, so $f'(1)=14$. $x_2=1-\frac{1}{14}=\frac{13}{14}$.
- (2) $f(1)=1+1-3=-1$ and $f'(x)=4x^3+1$, so $f'(1)=5$. $x_2=1-\frac{-1}{5}=1+\frac{1}{5}=\frac{6}{5}$.` },
    { id: '5.4', src: 'Linear approximation',
      stem: R`Use a local linear approximation to estimate $\sqrt{9.06}$. Is the estimate too big or too small?`,
      parts: [],
      hint: R`Use $a=9$, where $\sqrt{9}=3$ is exact.`,
      answer: [R`$\sqrt{9.06}\approx 3.01$, which is too big`],
      sol: R`
- $f(x)=\sqrt{x}$: $f(9)=3$, $f'(x)=\frac{1}{2\sqrt{x}}$, so $f'(9)=\frac{1}{6}$.
- $L(9.06)=3+\frac{1}{6}(0.06)=3+0.01=3.01$.
- $f''(x)=-\frac{1}{4}x^{-3/2}<0$, so the graph is concave down and the tangent sits above it: the estimate is too big. The true value is $3.00998\ldots$` },
    { id: '5.5', src: 'Like Quiz 05 Q.3',
      stem: R`Compute the coefficients of the Taylor series up to $(x-a)^3$.`,
      parts: [R`$f(x)=2\sin(x)\cos(x)$ about $x=\frac{\pi}{12}$`, R`$f(x)=\frac{1}{x}$ about $x=1$`],
      hint: R`(1) Rewrite $2\sin x\cos x=\sin 2x$ first, and note $2\cdot\frac{\pi}{12}=\frac{\pi}{6}$.`,
      answer: [R`(1) $\frac{1}{2},\ \sqrt3,\ -1,\ -\frac{2\sqrt3}{3}$`, R`(2) $1,\ -1,\ 1,\ -1$`],
      sol: R`
- (1) With $f=\sin 2x$: $f\left(\frac{\pi}{12}\right)=\sin\frac{\pi}{6}=\frac{1}{2}$. $f'=2\cos 2x\to\sqrt3$. $f''=-4\sin 2x\to-2$, so $c_2=\frac{-2}{2!}=-1$. $f'''=-8\cos 2x\to-4\sqrt3$, so $c_3=\frac{-4\sqrt3}{3!}=-\frac{2\sqrt3}{3}$.
- (2) $f=x^{-1}\to1$. $f'=-x^{-2}\to-1$. $f''=2x^{-3}\to2$, so $c_2=1$. $f'''=-6x^{-4}\to-6$, so $c_3=-1$.` },
  ],
  u7: [
    { id: '5.1', src: 'Like Quiz 05 Q.1',
      stem: R`Give the general term of the partial sum and the infinite series, with the sum starting at $n=0$.`,
      parts: [R`$a_n=\left(\frac{2}{3}\right)^n$`, R`$a_n=2\left(\frac{3}{2}\right)^n$`],
      hint: R`$\sum_{n=0}^{N}r^n=\frac{1-r^{N+1}}{1-r}$. There are $N+1$ terms.`,
      answer: [R`(1) $s_N=3\left[1-\left(\frac{2}{3}\right)^{N+1}\right]$; the series converges to $3$`, R`(2) $s_N=4\left[\left(\frac{3}{2}\right)^{N+1}-1\right]$; the series diverges to $\infty$`],
      sol: R`
- (1) $s_N=\frac{1-(2/3)^{N+1}}{1-2/3}=3\left[1-\left(\frac{2}{3}\right)^{N+1}\right]$. Since $\left(\frac{2}{3}\right)^{N+1}\to0$, the series equals $3$.
- (2) $s_N=2\cdot\frac{(3/2)^{N+1}-1}{3/2-1}=4\left[\left(\frac{3}{2}\right)^{N+1}-1\right]\to\infty$, because $\frac{3}{2}>1$.` },
    { id: '5.2', src: 'Sequence limits and convergence tests',
      stem: R`Limits and convergence tests.`,
      parts: [R`$\displaystyle\lim_{n\to\infty}\frac{4n^2-n}{3-2n^2}$`, R`$\displaystyle\lim_{n\to\infty}\frac{3^{n+1}+2^n}{3^n-1}$`,
              R`Does $\displaystyle\sum_{n=1}^{\infty}\frac{n}{3^n}$ converge?`, R`Does $\displaystyle\sum_{n=1}^{\infty}\frac{2n+1}{n+5}$ converge?`],
      hint: R`(1) Divide by $n^2$, (2) by $3^n$. (3) Ratio test. (4) Look at the terms first.`,
      answer: [R`(1) $-2$`, R`(2) $3$`, R`(3) Yes: the ratio test gives $\frac{1}{3}<1$`, R`(4) No: the terms go to $2\ne0$`],
      sol: R`
- (1) $\frac{4-1/n}{3/n^2-2}\to\frac{4}{-2}=-2$
- (2) $\frac{3+(2/3)^n}{1-(1/3)^n}\to\frac{3+0}{1-0}=3$
- (3) $\frac{a_{n+1}}{a_n}=\frac{n+1}{3^{n+1}}\cdot\frac{3^n}{n}=\frac{n+1}{3n}\to\frac{1}{3}<1$, so it converges.
- (4) $\frac{2n+1}{n+5}\to2\ne0$, so it diverges by the divergence test.` },
  ],
  u6: [
    { src: 'Integrate, then use the condition', added: '2026-10-29',
      stem: R`Find $f(x)$.`,
      parts: [R`$f'(x)=\frac{1}{x}$;  $f(1)=0$`, R`$f'(x)=e^x$;  $f(0)=e$`],
      hint: R`Integrate first and keep the $+C$. Then substitute the condition and solve for $C$.`,
      answer: [R`(1) $f(x)=\ln x$`, R`(2) $f(x)=e^x+e-1$`],
      sol: R`
- (1) $f(x)=\ln x+C$. In general it's $\ln|x|$, but the condition is at $x=1>0$. Then $f(1)=\ln 1+C=C=0$, so $f(x)=\ln x$.
- (2) $f(x)=e^x+C$. Then $f(0)=e^0+C=1+C$, which must equal $e$, so $C=e-1$ and $f(x)=e^x+e-1$. Check: $f(0)=1+e-1=e$.` },
    { src: "First order: y' = λy", added: '2026-10-29',
      stem: R`Solve each initial value problem.`,
      parts: [R`$y'=-3y$;  $y(0)=4$`, R`$y'=2y$;  $y(1)=e$`],
      hint: R`$y'=\lambda y$ has the general solution $y=Ce^{\lambda x}$. When the condition isn't at $x=0$, $C$ isn't the given value.`,
      answer: [R`(1) $y=4e^{-3x}$`, R`(2) $y=e^{2x-1}$`],
      sol: R`
- (1) $y=Ce^{-3x}$, and $y(0)=C=4$, so $y=4e^{-3x}$.
- (2) $y=Ce^{2x}$, and $y(1)=Ce^2=e$, so $C=\frac{e}{e^2}=e^{-1}$. Then $y=e^{-1}e^{2x}=e^{2x-1}$. Check: $y(1)=e^{1}=e$.` },
    { src: 'General solution, second order', added: '2026-10-29',
      stem: R`Find the general solution.`,
      parts: [R`$y''-5y'+6y=0$`, R`$y''+6y'+9y=0$`, R`$y''+4y=0$`, R`$y''-2y'+5y=0$`],
      hint: R`Write the characteristic equation $\lambda^2+a\lambda+b=0$ and check the sign of $\Delta=a^2-4b$ first.`,
      answer: [R`(1) $y=C_1e^{2x}+C_2e^{3x}$`, R`(2) $y=(C_1+C_2x)e^{-3x}$`, R`(3) $y=C_1\cos 2x+C_2\sin 2x$`, R`(4) $y=e^{x}(C_1\cos 2x+C_2\sin 2x)$`],
      sol: R`
- (1) $\lambda^2-5\lambda+6=(\lambda-2)(\lambda-3)=0$ gives two real roots, $2$ and $3$.
- (2) $\lambda^2+6\lambda+9=(\lambda+3)^2=0$ gives the repeated root $-3$, so the second solution is $xe^{-3x}$.
- (3) $\lambda^2+4=0$ gives $\lambda=\pm2i$, so $\alpha=0$ and $\beta=2$.
- (4) $\lambda^2-2\lambda+5=0$ has $\Delta=4-20=-16$, so $\lambda=\frac{2\pm4i}{2}=1\pm2i$. Then $\alpha=1$ and $\beta=2$.` },
    { src: 'Second order with initial conditions', added: '2026-10-29',
      stem: R`Solve with the initial conditions.`,
      parts: [R`$y''-y'-2y=0$;  $y(0)=3$, $y'(0)=0$`, R`$y''-4y'+4y=0$;  $y(0)=1$, $y'(0)=5$`, R`$y''+9y=0$;  $y(0)=2$, $y'(0)=3$`],
      hint: R`Find the general solution, then differentiate it before you use the condition on $y'(0)$.`,
      answer: [R`(1) $y=e^{2x}+2e^{-x}$`, R`(2) $y=(1+3x)e^{2x}$`, R`(3) $y=2\cos 3x+\sin 3x$`],
      sol: R`
- (1) $\lambda^2-\lambda-2=(\lambda-2)(\lambda+1)$, so $y=C_1e^{2x}+C_2e^{-x}$ and $y'=2C_1e^{2x}-C_2e^{-x}$. The conditions give $C_1+C_2=3$ and $2C_1-C_2=0$, so $C_1=1$ and $C_2=2$.
- (2) $(\lambda-2)^2=0$, so $y=(C_1+C_2x)e^{2x}$ and $y'=C_2e^{2x}+2(C_1+C_2x)e^{2x}$. Then $y(0)=C_1=1$, and $y'(0)=C_2+2C_1=5$ gives $C_2=3$.
- (3) $\lambda=\pm3i$, so $y=C_1\cos 3x+C_2\sin 3x$ and $y'=-3C_1\sin 3x+3C_2\cos 3x$. Then $y(0)=C_1=2$, and $y'(0)=3C_2=3$ gives $C_2=1$.` },
    { src: 'Build the equation from its solutions', added: '2026-10-29',
      stem: R`Find $a$ and $b$ so that $y''+ay'+by=0$ has these solutions.`,
      parts: [R`both $e^{2x}$ and $e^{-3x}$`, R`the general solution $y=(C_1+C_2x)e^{-x}$`, R`the general solution $y=C_1\cos 3x+C_2\sin 3x$`],
      hint: R`Work backwards: the solutions give the roots $\lambda$, and the roots give $\lambda^2+a\lambda+b=0$.`,
      answer: [R`(1) $a=1$, $b=-6$`, R`(2) $a=2$, $b=1$`, R`(3) $a=0$, $b=9$`],
      sol: R`
- (1) The roots are $2$ and $-3$, and $(\lambda-2)(\lambda+3)=\lambda^2+\lambda-6$.
- (2) $-1$ is a repeated root, and $(\lambda+1)^2=\lambda^2+2\lambda+1$.
- (3) The roots are $\pm3i$, and $(\lambda-3i)(\lambda+3i)=\lambda^2+9$.` },
  ],
};
