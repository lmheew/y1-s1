// Follow-up quizzes: two per in-class quiz. A = same skills, new numbers. B = targets the usual slips.
// Same structure and point values as the in-class sheet (10 pt each). Checked in verify_followups.py.
const R = String.raw;

export const followups = {
  '01': [
    { focus: 'Each question mirrors Quiz 01 with new numbers.', qs: [
      { label: 'Q.1', pts: '1pt×4', stem: R`Compute the value of each function at the position $P$.`,
        parts: [R`$f(x)=4x^2-3x+1$;  $P:\ x=-2$`, R`$f(\theta)=\cos(\theta)\cdot\sin(3\theta)$;  $P:\ \theta=\frac{\pi}{2}$`,
                R`$f(x)=5e^{1-x^2}$;  $P:\ x=-1$`, R`$f(x)=(x-1)\cdot\ln(x+e)$;  $P:\ x=0$`],
        answer: [R`(1) $23$`, R`(2) $0$`, R`(3) $5$`, R`(4) $-1$`],
        sol: R`
- (1) $4\cdot4+6+1=23$
- (2) $\cos\frac{\pi}{2}\cdot\sin\frac{3\pi}{2}=0\cdot(-1)=0$. Spot the zero factor first.
- (3) $1-x^2=0$, so $5e^0=5$
- (4) $(0-1)\cdot\ln(0+e)=(-1)\cdot 1=-1$` },
      { label: 'Q.2', pts: '', stem: R`$$f(x)=\frac{x+1}{(x^2-1)};\quad c=-1$$`,
        parts: [R`Compute the limits of the function at $x=c$ from the left and right. (2pt×2)`, R`Check the continuity of the above function at $x=c$. (2pt×1)`],
        answer: [R`(1) left $-\frac{1}{2}$, right $-\frac{1}{2}$`, R`(2) not continuous at $x=-1$ (removable discontinuity)`],
        sol: R`
For $x\ne\pm1$: $f(x)=\frac{x+1}{(x-1)(x+1)}=\frac{1}{x-1}\to\frac{1}{-2}=-\frac{1}{2}$ from both sides.

But $f(-1)=\frac{0}{0}$ is undefined, so $f$ is not continuous at $x=-1$. The limit exists, so it's a removable discontinuity.` },
    ]},
    { focus: 'Targets the usual slips: reading · versus +, spotting a zero factor, and limits that differ on each side.', qs: [
      { label: 'Q.1', pts: '1pt×4', stem: R`Compute the value of each function at the position $P$.`,
        parts: [R`$f(x)=(x^2-4)\cdot(x+3)$;  $P:\ x=2$`, R`$f(\theta)=\sin(2\theta)+\cos(\theta)\cdot\sin(\theta)$;  $P:\ \theta=\frac{\pi}{4}$`,
                R`$f(x)=e^{x^2-1}\cdot\ln(x^2)$;  $P:\ x=-1$`, R`$f(x)=\arcsin\left(\frac{x}{2}\right)+\arccos\left(\frac{x}{2}\right)$;  $P:\ x=1$`],
        answer: [R`(1) $0$`, R`(2) $\frac{3}{2}$`, R`(3) $0$`, R`(4) $\frac{\pi}{2}$`],
        sol: R`
- (1) $(4-4)\cdot(2+3)=0\cdot5=0$
- (2) $\sin\frac{\pi}{2}+\cos\frac{\pi}{4}\cdot\sin\frac{\pi}{4}=1+\frac{\sqrt2}{2}\cdot\frac{\sqrt2}{2}=1+\frac{1}{2}=\frac{3}{2}$. Only the second term is a product.
- (3) $e^0\cdot\ln 1=1\cdot 0=0$
- (4) $\arcsin\frac{1}{2}+\arccos\frac{1}{2}=\frac{\pi}{6}+\frac{\pi}{3}=\frac{\pi}{2}$` },
      { label: 'Q.2', pts: '', stem: R`$$f(x)=\frac{x^2-2x}{|x-2|};\quad c=2$$`,
        parts: [R`Compute the limits of the function at $x=c$ from the left and right. (2pt×2)`, R`Check the continuity of the above function at $x=c$. (2pt×1)`],
        answer: [R`(1) left $-2$, right $2$`, R`(2) not continuous: the one-sided limits differ (a jump), and $f(2)$ is undefined`],
        sol: R`
$x^2-2x=x(x-2)$.

- Right of $2$: $|x-2|=x-2$, so $f(x)=x\to2$.
- Left of $2$: $|x-2|=-(x-2)$, so $f(x)=-x\to-2$.
- The two sides differ, so $\lim_{x\to2}f(x)$ doesn't exist. That's a jump discontinuity, unlike the removable one on Quiz 01.` },
    ]},
  ],
  '02': [
    { focus: 'Each question mirrors Quiz 02 with new numbers.', qs: [
      { label: 'Q.1', pts: '1pt×2', stem: R`Compute the derivative of $f(x)$ at $P$, where $e$ can be used in the answer.`,
        parts: [R`$f(x)=x^3-2x^2+x$;  $P:\ x=2$`, R`$f(x)=x^3+2e^x$;  $P:\ x=0$`],
        answer: [R`(1) $5$`, R`(2) $2$`],
        sol: R`
- (1) $f'(x)=3x^2-4x+1$, so $f'(2)=12-8+1=5$.
- (2) $f'(x)=3x^2+2e^x$, so $f'(0)=0+2=2$.` },
      { label: 'Q.2', pts: '2pt×2', stem: R`Compute the derivative of the function with respect to the variable at $P$.`,
        parts: [R`$f(\theta)=e^{\theta}\cdot\sin(\theta)$;  $P:\ \theta=\frac{\pi}{2}$`, R`$f(t)=t\cdot\ln(t)$;  $P:\ t=e$`],
        answer: [R`(1) $e^{\pi/2}$`, R`(2) $2$`],
        sol: R`
- (1) $f'(\theta)=e^{\theta}\sin\theta+e^{\theta}\cos\theta$. At $\frac{\pi}{2}$: $e^{\pi/2}(1+0)=e^{\pi/2}$.
- (2) $f'(t)=\ln t+t\cdot\frac{1}{t}=\ln t+1$. At $e$: $1+1=2$.` },
      { label: 'Q.3', pts: '2pt×2', stem: R`Compute the derivative of the composite function $f(g(x))$ of the following functions at $P$.`,
        parts: [R`$f(x)=\sqrt{4+x}$, $g(x)=\sin(x)$;  $P:\ x=0$`, R`$f(x)=e^x$, $g(x)=\frac{1}{x}$;  $P:\ x=1$`],
        answer: [R`(1) $\frac{1}{4}$`, R`(2) $-e$`],
        sol: R`
- (1) $\sqrt{4+\sin x}$ has derivative $\frac{\cos x}{2\sqrt{4+\sin x}}$. At $0$: $\frac{1}{2\cdot2}=\frac{1}{4}$.
- (2) $e^{1/x}$ has derivative $e^{1/x}\cdot\left(-\frac{1}{x^2}\right)$. At $1$: $-e$.` },
    ]},
    { focus: 'Targets the usual slips: powers versus exponentials, both terms of the product rule, and the inner derivative.', qs: [
      { label: 'Q.1', pts: '1pt×2', stem: R`Compute the derivative of $f(x)$ at $P$, where $e$ can be used in the answer.`,
        parts: [R`$f(x)=x^{-2}+2\sqrt{x}$;  $P:\ x=1$`, R`$f(x)=2^x+x^2$;  $P:\ x=0$`],
        answer: [R`(1) $-1$`, R`(2) $\ln 2$`],
        sol: R`
- (1) $f'(x)=-2x^{-3}+x^{-1/2}$, so $f'(1)=-2+1=-1$.
- (2) $(2^x)'=2^x\ln 2$, not $x\cdot2^{x-1}$. So $f'(x)=2^x\ln2+2x$ and $f'(0)=\ln 2$.` },
      { label: 'Q.2', pts: '2pt×2', stem: R`Compute the derivative of the function with respect to the variable at $P$.`,
        parts: [R`$f(\theta)=\theta\cdot\cos(\theta)$;  $P:\ \theta=\pi$`, R`$f(t)=e^{t}\cdot\ln(t)$;  $P:\ t=1$`],
        answer: [R`(1) $-1$`, R`(2) $e$`],
        sol: R`
- (1) $f'(\theta)=\cos\theta-\theta\sin\theta$. At $\pi$: $-1-\pi\cdot0=-1$.
- (2) $f'(t)=e^t\ln t+\frac{e^t}{t}$. At $1$: $0+e=e$. Writing only one of the two terms loses the point.` },
      { label: 'Q.3', pts: '2pt×2', stem: R`Compute the derivative of the composite function $f(g(x))$ of the following functions at $P$.`,
        parts: [R`$f(x)=x^3$, $g(x)=\sin(x)+\cos(x)$;  $P:\ x=0$`, R`$f(x)=\ln(x)$, $g(x)=\cos(x)$;  $P:\ x=\frac{\pi}{3}$`],
        answer: [R`(1) $3$`, R`(2) $-\sqrt3$`],
        sol: R`
- (1) $(\sin x+\cos x)^3$ has derivative $3(\sin x+\cos x)^2(\cos x-\sin x)$. At $0$: $3\cdot1\cdot1=3$.
- (2) $\ln(\cos x)$ has derivative $\frac{-\sin x}{\cos x}=-\tan x$. At $\frac{\pi}{3}$: $-\sqrt3$. Keep the minus from $(\cos x)'$.` },
    ]},
  ],
  '03': [
    { focus: 'Each question mirrors Quiz 03 with new numbers.', qs: [
      { label: 'Q.1', pts: '2pt×2', stem: R`Compute the derivative at the point $P$.`,
        parts: [R`$f(x)=\dfrac{1}{\tan(x)}$;  $P:\ x=\frac{\pi}{6}$`, R`$f^{-1}(y)$;  $P:\ y=0$, in the case of $y=f(x)=\ln(2x-1)$`],
        answer: [R`(1) $-4$`, R`(2) $\frac{1}{2}$`],
        sol: R`
- (1) $f'(x)=-\csc^2x=-\frac{1}{\sin^2x}$, and $\sin^2\frac{\pi}{6}=\frac{1}{4}$, so $f'=-4$.
- (2) $\ln(2a-1)=0$ gives $2a-1=1$, so $a=1$. $f'(x)=\frac{2}{2x-1}$, so $f'(1)=2$ and $(f^{-1})'(0)=\frac{1}{2}$. Check: $f^{-1}(y)=\frac{e^y+1}{2}$ has derivative $\frac{e^y}{2}$, which is $\frac{1}{2}$ at $y=0$.` },
      { label: 'Q.2', pts: '', stem: R`Consider the curve represented by the following equation,
$$C:\ y^3+2xy^2+x+y+1=0$$`,
        parts: [R`Find two points on the curve $C$ with $x=-1$. (1pt×2)`, R`Compute the derivatives at the above points. (1pt×2)`],
        answer: [R`(1) $(-1,0)$ and $(-1,1)$`, R`(2) $-1$ at $(-1,0)$. At $(-1,1)$ the tangent is vertical, so $\frac{dy}{dx}$ doesn't exist.`],
        sol: R`
- (1) $y^3-2y^2-1+y+1=y^3-2y^2+y=y(y-1)^2=0$, so $y=0$ or $y=1$.
- (2) Differentiating gives
$$y'=-\frac{2y^2+1}{3y^2+4xy+1}$$
At $(-1,0)$: $-\frac{1}{1}=-1$. At $(-1,1)$: the top is $3$ and the bottom is $3-4+1=0$, so the tangent is vertical.` },
      { label: 'Q.3', pts: '', stem: R`Consider the following parameterization with $t$: $x=\ln(t)$, $y=t\sin(2t)$.`,
        parts: [R`Compute the slope of the curve, $\frac{dy}{dx}$, at $t=\frac{\pi}{4}$. (1pt)`, R`Compute the second-order derivative, $\frac{d^2y}{dx^2}$, at $t=\frac{\pi}{2}$. (1pt)`],
        answer: [R`(1) $\frac{\pi}{4}$`, R`(2) $-\frac{3\pi^2}{2}$`],
        sol: R`
- (1) $\frac{dy}{dt}=\sin2t+2t\cos2t$, so $\frac{dy}{dx}=t\sin2t+2t^2\cos2t$. At $\frac{\pi}{4}$: $\frac{\pi}{4}\cdot1+0=\frac{\pi}{4}$.
- (2) $\frac{d}{dt}\left(t\sin2t+2t^2\cos2t\right)=\sin2t+6t\cos2t-4t^2\sin2t$. Multiplying by $t$ gives $t\sin2t+6t^2\cos2t-4t^3\sin2t$. At $\frac{\pi}{2}$: $0+6\cdot\frac{\pi^2}{4}\cdot(-1)-0=-\frac{3\pi^2}{2}$.` },
    ]},
    { focus: 'Targets the usual slips: signs at negative angles, using f′(a) not f′(b), horizontal versus vertical tangents, and the second-derivative trap.', qs: [
      { label: 'Q.1', pts: '2pt×2', stem: R`Compute the derivative at the point $P$.`,
        parts: [R`$f(x)=\dfrac{1}{\cos^2(x)}$;  $P:\ x=-\frac{\pi}{4}$`, R`$(f^{-1})'(3)$, in the case of $f(x)=x^5+x^3+x$`],
        answer: [R`(1) $-4$`, R`(2) $\frac{1}{9}$`],
        sol: R`
- (1) $f=(\cos x)^{-2}$, so $f'=-2(\cos x)^{-3}\cdot(-\sin x)=\frac{2\sin x}{\cos^3x}$. At $-\frac{\pi}{4}$: $\sin=-\frac{\sqrt2}{2}$ and $\cos^3=\frac{\sqrt2}{4}$, so $f'=-4$.
- (2) $f(a)=3$ gives $a=1$. $f'(x)=5x^4+3x^2+1$, so $f'(1)=9$ and the answer is $\frac{1}{9}$. Using $f'(3)$ instead is the classic slip.` },
      { label: 'Q.2', pts: '', stem: R`Consider the curve $C:\ y^2+xy+x^3=7$.`,
        parts: [R`Find two points on the curve $C$ with $x=1$. (1pt×2)`, R`Compute the derivatives at the above points. (1pt×2)`],
        answer: [R`(1) $(1,2)$ and $(1,-3)$`, R`(2) $-1$ at $(1,2)$, and $0$ at $(1,-3)$ (a horizontal tangent)`],
        sol: R`
- (1) $y^2+y+1=7$, so $y^2+y-6=(y+3)(y-2)=0$.
- (2) $2yy'+y+xy'+3x^2=0$, so $y'=-\frac{y+3x^2}{2y+x}$. At $(1,2)$: $-\frac{5}{5}=-1$. At $(1,-3)$: $-\frac{0}{-5}=0$, a horizontal tangent. A zero on top means horizontal; a zero on the bottom means vertical.` },
      { label: 'Q.3', pts: '', stem: R`Consider the parameterization $x=t^2$, $y=t^3-3t$.`,
        parts: [R`Compute the slope of the curve, $\frac{dy}{dx}$, at $t=2$. (1pt)`, R`Compute the second-order derivative, $\frac{d^2y}{dx^2}$, at $t=1$. (1pt)`],
        answer: [R`(1) $\frac{9}{4}$`, R`(2) $\frac{3}{2}$`],
        sol: R`
- (1) $\frac{dy}{dx}=\frac{3t^2-3}{2t}$. At $2$: $\frac{9}{4}$.
- (2) $\frac{dy}{dx}=\frac{3}{2}\left(t-\frac{1}{t}\right)$, so $\frac{d}{dt}\left(\frac{dy}{dx}\right)=\frac{3}{2}\left(1+\frac{1}{t^2}\right)$. Dividing by $\frac{dx}{dt}=2t$ gives $\frac{3(t^2+1)}{4t^3}$, which is $\frac{3}{2}$ at $t=1$. The trap $\frac{d^2y/dt^2}{d^2x/dt^2}=\frac{6t}{2}$ would give $3$.` },
    ]},
  ],
  '04': [
    { focus: 'Each question mirrors Quiz 04 with new numbers.', qs: [
      { label: 'Q.1', pts: '', stem: R`Consider a function $f(x)=2x^3+3x^2-12x+1$.`,
        parts: [R`Find the two critical points of $f(x)$. (1pt×2)`, R`Determine the concavity using the second derivative test at each point. (1pt×2)`,
                R`Give the values of the relative maximum and minimum. (1pt×2)`],
        answer: [R`(1) $x=-2$ and $x=1$`, R`(2) $f''(-2)=-18<0$: concave down. $f''(1)=18>0$: concave up.`, R`(3) relative max $21$ (at $x=-2$), relative min $-6$ (at $x=1$)`],
        sol: R`
- (1) $f'(x)=6x^2+6x-12=6(x+2)(x-1)$.
- (2) $f''(x)=12x+6$, so $f''(-2)=-18$ and $f''(1)=18$.
- (3) $f(-2)=-16+12+24+1=21$ and $f(1)=2+3-12+1=-6$.` },
      { label: 'Q.2', pts: '2pt×2', stem: R`Find the absolute maximum and minimum of $f(x)$ in the domain $D$.
$$\begin{gathered}f(x)=\log(x^2+2x+3)\\ D:\ -2\le x\le 1\end{gathered}$$`,
        parts: [],
        answer: [R`absolute max $\ln 6$ at $x=1$; absolute min $\ln 2$ at $x=-1$`],
        sol: R`
$f'(x)=\frac{2x+2}{x^2+2x+3}$. The bottom is $(x+1)^2+2>0$, so the only critical point is $x=-1$.

- Inside values: $3$ at $x=-2$, $2$ at $x=-1$, $6$ at $x=1$.
- Since $\ln$ is increasing, the max is $\ln 6$ and the min is $\ln 2$.` },
    ]},
    { focus: 'Targets the usual slips: missing roots, critical points that aren’t extrema, and a maximum at an endpoint.', qs: [
      { label: 'Q.1', pts: '', stem: R`Consider a function $f(x)=x^4-2x^2+3$.`,
        parts: [R`Find all the critical points of $f(x)$. (2pt)`, R`Determine the concavity using the second derivative test at each point. (2pt)`,
                R`Give the values of the relative maximum and minimum. (2pt)`],
        answer: [R`(1) $x=-1$, $x=0$ and $x=1$`, R`(2) $f''(\pm1)=8>0$: concave up. $f''(0)=-4<0$: concave down.`, R`(3) relative max $3$ (at $x=0$), relative min $2$ (at $x=\pm1$)`],
        sol: R`
- (1) $f'(x)=4x^3-4x=4x(x-1)(x+1)$. There are three critical points; don't drop $x=-1$.
- (2) $f''(x)=12x^2-4$, so $f''(\pm1)=8$ and $f''(0)=-4$.
- (3) $f(0)=3$ and $f(\pm1)=1-2+3=2$. The $y$-values come from $f$, not from $f'$ or $f''$.` },
      { label: 'Q.2', pts: '2pt×2', stem: R`Find the absolute maximum and minimum of $f(x)$ in the domain $D$.
$$\begin{gathered}f(x)=x^4-4x^3\\ D:\ -1\le x\le 4\end{gathered}$$`,
        parts: [],
        answer: [R`absolute max $5$ at $x=-1$; absolute min $-27$ at $x=3$`],
        sol: R`
$f'(x)=4x^3-12x^2=4x^2(x-3)$, so the critical points are $x=0$ and $x=3$.

- Values: $f(-1)=1+4=5$, $f(0)=0$, $f(3)=81-108=-27$, $f(4)=256-256=0$.
- The max is at an endpoint, so always check $a$ and $b$.
- $x=0$ is not an extremum: $4x^2\ge0$, so $f'$ doesn't change sign there, and $f''(0)=0$ gives no conclusion.` },
    ]},
  ],
  '05': [
    { focus: 'Each question mirrors Quiz 05 with new numbers.', qs: [
      { label: 'Q.1', pts: '2pt: general term, 2pt: infinite series', stem: R`Give the general term of the partial sum and the infinite series of the sequence $a_n=2\left(\frac{1}{4}\right)^n$, where the initial term of summation is $n=0$.`,
        parts: [],
        answer: [R`$s_N=\frac{8}{3}\left[1-\left(\frac{1}{4}\right)^{N+1}\right]$; the infinite series is $\frac{8}{3}$`],
        sol: R`
$s_N=2\cdot\frac{1-(1/4)^{N+1}}{1-1/4}=\frac{8}{3}\left[1-\left(\frac{1}{4}\right)^{N+1}\right]$. Since $\left(\frac{1}{4}\right)^{N+1}\to0$, the series equals $\frac{8}{3}$.` },
      { label: 'Q.2', pts: '3pt', stem: R`Apply Newton's method to $f(x)$ and compute the second approximation, $x_2$, of the root of $f(x)$ in the domain $D$, where the initial position is $x_1=1$.
$$\begin{gathered}f(x)=x^5+3x-3\\ D:\ 0\le x\le 1\end{gathered}$$`,
        parts: [],
        answer: [R`$x_2=\frac{7}{8}$`],
        sol: R`
$f(1)=1+3-3=1$ and $f'(x)=5x^4+3$, so $f'(1)=8$. $x_2=1-\frac{1}{8}=\frac{7}{8}$.` },
      { label: 'Q.3', pts: '3pt', stem: R`Compute the coefficients of Taylor series up to that for $x^3$ about $x=\frac{\pi}{6}$.
$$f(x)=\cos^2(x)-\sin^2(x)$$`,
        parts: [],
        answer: [R`$\frac{1}{2},\ -\sqrt3,\ -1,\ \frac{2\sqrt3}{3}$`],
        sol: R`
$f=\cos 2x$, and $2\cdot\frac{\pi}{6}=\frac{\pi}{3}$.

- $f\to\frac{1}{2}$ and $f'=-2\sin2x\to-\sqrt3$.
- $f''=-4\cos2x\to-2$, so $c_2=-1$.
- $f'''=8\sin2x\to4\sqrt3$, so $c_3=\frac{4\sqrt3}{6}=\frac{2\sqrt3}{3}$.` },
    ]},
    { focus: 'Targets the usual slips: where the sum starts, a negative ratio, the sign in Newton’s step, and dividing by k!.', qs: [
      { label: 'Q.1', pts: '2pt: general term, 2pt: infinite series', stem: R`Give the general term of the partial sum and the infinite series of the sequence $a_n=\left(-\frac{1}{2}\right)^n$, where the initial term of summation is $n=1$.`,
        parts: [],
        answer: [R`$s_N=-\frac{1}{3}\left[1-\left(-\frac{1}{2}\right)^N\right]$; the infinite series is $-\frac{1}{3}$`],
        sol: R`
The first term is $a_1=-\frac{1}{2}$ (not $1$), and the ratio is $-\frac{1}{2}$.

$$\begin{aligned}s_N&=-\frac{1}{2}\cdot\frac{1-(-1/2)^N}{1-(-1/2)}\\[4pt]&=-\frac{1}{3}\left[1-\left(-\frac{1}{2}\right)^N\right]\end{aligned}$$

Since $\left|-\frac{1}{2}\right|<1$, the series equals $-\frac{1}{3}$. Check: $s_2=-\frac{1}{2}+\frac{1}{4}=-\frac{1}{4}$, and the formula gives $-\frac{1}{3}\cdot\frac{3}{4}=-\frac{1}{4}$.` },
      { label: 'Q.2', pts: '3pt', stem: R`Apply Newton's method to $f(x)$ and compute the second approximation, $x_2$, of the root of $f(x)$ in the domain $D$, where the initial position is $x_1=1$.
$$\begin{gathered}f(x)=2x^3+x-4\\ D:\ 1\le x\le 2\end{gathered}$$`,
        parts: [],
        answer: [R`$x_2=\frac{8}{7}$`],
        sol: R`
$f(1)=2+1-4=-1$ and $f'(x)=6x^2+1$, so $f'(1)=7$. $x_2=1-\frac{-1}{7}=1+\frac{1}{7}=\frac{8}{7}$. Minus a negative is a plus.` },
      { label: 'Q.3', pts: '3pt', stem: R`Compute the coefficients of Taylor series up to that for $x^3$ about $x=\frac{\pi}{4}$.
$$f(x)=2\cos^2(x)-1$$`,
        parts: [],
        answer: [R`$0,\ -2,\ 0,\ \frac{4}{3}$`],
        sol: R`
Simplify first: $2\cos^2x-1=\cos 2x$, and $2\cdot\frac{\pi}{4}=\frac{\pi}{2}$.

- $f\to\cos\frac{\pi}{2}=0$ and $f'=-2\sin2x\to-2$.
- $f''=-4\cos2x\to0$, so $c_2=0$.
- $f'''=8\sin2x\to8$, so $c_3=\frac{8}{3!}=\frac{4}{3}$. Forgetting the $3!$ would give $8$.` },
    ]},
  ],
};
