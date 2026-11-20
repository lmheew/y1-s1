// Content for the Calculus midterm 2 page (math/integrals/, the integral part of CLA1). Units follow the course
// schedule (integral part): one unit per lesson pair, in schedule order. The schedule slide gives dates, not day
// numbers, so every unit carries `dates` ("2 & 3 Nov"); a lesson gets `days` and `quiz` once a quiz sheet shows them
// (Quiz 06 is "Day16 & Day17", so 5 & 6 Nov are Days 16 and 17 and 2 & 3 Nov, the two classes before, Days 14 and 15;
// Quiz 07 is "Day18 & Day19", so 9 & 10 Nov are Days 18 and 19; Quiz 08 is "Day20 & Day21", 12 & 13 Nov; Quiz 09
// follows as "Day22 & Day23", 16 & 17 Nov; Quiz 10 is "Day24 & Day25", 19 & 20 Nov. A taught lesson without a sheet
// yet goes by its dates, and so does its formula groups' label, which the night-before sheet matches). The 9 Nov
// class finished the primitive-functions lesson (inverse trigonometric functions) before substitution, so that part
// sits in u2.
// A lesson still to come has `upcoming: true` and shows as a greyed-out Summary tile; `starred` marks the lessons with
// an in-class quiz (the schedule's *).
// Markup: $inline$, $$display$$, **bold**, "- " list items (continuation lines join the item),
// blank line = new block. Every answer here is checked in verify.py (this folder).
const R = String.raw;
const NOV2 = '2026-11-02';
const NOV3 = '2026-11-03';
const NOV6 = '2026-11-06';
const NOV9 = '2026-11-09';
const NOV10 = '2026-11-10';
const NOV13 = '2026-11-13';
const NOV17 = '2026-11-17';
const NOV19 = '2026-11-19';
const NOV20 = '2026-11-20';

export const units = [
  {
    id: 'u1', quiz: null, days: 'Day 14 & 15', dates: '2 & 3 Nov', added: NOV3,
    title: 'Riemann sum and definite integrals',
    intro: R`The schedule also lists a review of Calculus midterm 1 for these two classes. That paper, with worked answers, is under Past midterms on the Calculus midterm 1 page.`,
    ideas: R`
- **The idea:** to find the area under $y=f(x)$ from $x=a$ to $x=b$, cut it into $n$ thin strips, treat each strip as a rectangle, add up the rectangles, and let $n\to\infty$.
- **Strip width and sample points:** every strip has the same width
$$\Delta x=\frac{b-a}{n}$$
Strip $k$ (for $k=1,2,\dots,n$) gets its height $f(x_k)$ at one point $x_k$ of the strip:
$$\begin{aligned}\text{right end: }x_k&=a+k\,\Delta x\\[2pt]\text{left end: }x_k&=a+(k-1)\,\Delta x\\[2pt]\text{midpoint: }x_k&=a+\left(k-\tfrac{1}{2}\right)\Delta x\end{aligned}$$
The slides write $N$ for the number of strips: it is the same as $n$ here.
- **Riemann sum and definite integral:**
$$\begin{gathered}S_n=\sum_{k=1}^{n}f(x_k)\,\Delta x\\[6pt]\int_a^b f(x)\,dx=\lim_{n\to\infty}S_n\end{gathered}$$
Here $a$ is the lower limit and $b$ the upper limit. Left ends, right ends and midpoints all give the same limit.
- **Partial sums:**
$$\begin{aligned}\sum_{k=1}^{n}1&=n\\[2pt]\sum_{k=1}^{n}k&=\frac{n(n+1)}{2}\\[2pt]\sum_{k=1}^{n}k^2&=\frac{n(n+1)(2n+1)}{6}\\[2pt]\sum_{k=1}^{n}k^3&=\frac{n^2(n+1)^2}{4}\end{aligned}$$
A constant comes out of the sum: $\sum c\,a_k=c\sum a_k$.
- **Five steps:** find $\Delta x$, write $x_k$, work out $f(x_k)$, add up with the partial sums (constants out first), then let $n\to\infty$. When $a\ne0$, expand $f(a+k\Delta x)$ and split it into separate sums.
- **The class example, $x^2$ from $0$ to $L$** (right ends, $x_k=\frac{kL}{n}$):
$$\begin{aligned}S_n&=\frac{L^3}{n^3}\sum_{k=1}^{n}k^2\\[4pt]&=\frac{L^3}{6}\cdot\frac{(n+1)(2n+1)}{n^2}\\[4pt]&\to\frac{L^3}{6}\cdot2=\frac{L^3}{3}\end{aligned}$$
- **Signed area:** where $f<0$, the terms $f(x_k)\Delta x$ are negative, so the integral is the area above the $x$-axis minus the area below it. For the actual area, split at the zeros of $f$ and add the parts as positive numbers.
- **The class example, $x^2+x-2$ on $[0,2]$:** $f=(x+2)(x-1)$ is negative on $[0,1)$ and positive on $(1,2]$. With right ends,
$$S_n=\frac{2}{3}+\frac{6}{n}+\frac{4}{3n^2}\to\frac{2}{3}$$
The integral $\frac{2}{3}$ is $\frac{11}{6}$ above the axis minus $\frac{7}{6}$ below it, but the area of the region is $\frac{11}{6}+\frac{7}{6}=3$. Practice works it out step by step.
- **The shortcut:** with a primitive $F$ of $f$ (that is, $F'=f$), the integral is $F(b)-F(a)$. The next lesson uses it for every integral; the Riemann sum stays the definition.`,
    watch: R`
- $\Delta x=\frac{b-a}{n}$. It is $\frac{1}{n}$ only when the interval has length $1$.
- When $a\ne0$, keep the $a$ in $x_k=a+k\Delta x$, and expand before you split the sum.
- A constant is added $n$ times: $\sum_{k=1}^{n}3=3n$, not $3$. In the class example the $-2$ gives $-4$ in $S_n$, not $-\frac{4}{n}$.
- "Compute the Riemann sum" asks for $S_n$ as a formula in $n$. Write it out before you take the limit, and don't replace it with $F(b)-F(a)$.
- An integral is a signed area: $\mathord{\int_0^2(x-1)\,dx}=0$, yet the region between the line and the axis has area $1$.`,
  },
  {
    id: 'u2', quiz: 'Quiz 06', days: 'Day 16 & 17', dates: '5 & 6 Nov', starred: true, added: NOV9,
    title: 'Primitive functions (indefinite integrals)',
    ideas: R`
- **The limit of the Riemann sum:** on an interval $[a,b]$ with $N$ strips and right ends, the general form is
$$S_N=\sum_{k=1}^{N}f\!\left(a+\frac{k(b-a)}{N}\right)\frac{b-a}{N}$$
and $\int_a^b f(x)\,dx=\lim_{N\to\infty}S_N$. On $[0,1]$ it is $S_N=\frac{1}{N}\sum_{k=1}^{N}f\!\left(\frac{k}{N}\right)$: put $x=\frac{k}{N}$ into $f$, then use the partial sums.
- **Exchange of initial and final points:** running from $b$ back to $a$ makes every $\Delta x$ negative, so the integral changes sign. An interval of width $0$ gives $0$:
$$\begin{aligned}\int_b^a f(x)\,dx&=-\int_a^b f(x)\,dx\\[2pt]\int_a^a f(x)\,dx&=0\end{aligned}$$
Joining intervals adds the integrals, $\int_a^b f\,dx+\int_b^c f\,dx=\int_a^c f\,dx$, and the integral of a sum splits into the integrals of its terms, with constants coming out.
- **Primitive function:** $F$ is a primitive function (an antiderivative) of $f$ when $F'(x)=f(x)$. For example $\frac{x^3}{3}$ is a primitive of $x^2$, because $\left(\frac{x^3}{3}\right)'=x^2$.
- **Ambiguity in the primitive function:** if $F$ is a primitive of $f$, so is $F+C$ for every constant $C$, because a constant has derivative $0$. On an interval, any two primitives of the same $f$ differ only by a constant, so one condition, such as $F(1)=4$, picks one of them.
- **Indefinite integral:** the whole family of primitives is written
$$\int f(x)\,dx=F(x)+C$$
where $C$ is the integration constant. Like the derivative, it splits over sums and lets constants out:
$$\int(\alpha f+\beta g)\,dx=\alpha\int f\,dx+\beta\int g\,dx$$
- **Definite integral from a primitive:** any primitive $F$ of $f$ gives
$$\int_a^b f(x)\,dx=\Big[F(x)\Big]_a^b=F(b)-F(a)$$
The $C$ cancels, so leave it out here. This replaces the limit of $S_N$ whenever a primitive is known.
- **Fundamental primitive functions:** each one is a derivative rule read backwards ($b>0$, $b\ne1$):
$$\begin{aligned}\int x^n\,dx&=\frac{x^{n+1}}{n+1}+C\quad(n\ne-1)\\[2pt]\int\frac{1}{x}\,dx&=\ln|x|+C\\[2pt]\int e^x\,dx&=e^x+C\\[2pt]\int b^x\,dx&=\frac{b^x}{\ln b}+C\\[2pt]\int\sin x\,dx&=-\cos x+C\\[2pt]\int\cos x\,dx&=\sin x+C\\[2pt]\int\frac{1}{\cos^2x}\,dx&=\tan x+C\\[2pt]\int\frac{1}{1+x^2}\,dx&=\arctan x+C\end{aligned}$$
Check any of them by differentiating the right-hand side.
- **A number inside: divide by it.** The chain rule multiplies by $a$, so the primitive divides by $a$ ($a\ne0$):
$$\begin{aligned}\int e^{ax}\,dx&=\frac{1}{a}e^{ax}+C\\[2pt]\int b^{ax}\,dx&=\frac{b^{ax}}{a\ln b}+C\\[2pt]\int\sin ax\,dx&=-\frac{1}{a}\cos ax+C\\[2pt]\int\cos ax\,dx&=\frac{1}{a}\sin ax+C\end{aligned}$$
- **Logarithms:** $\int\frac{1}{x}\,dx=\ln|x|+C$ covers the one power the power rule can't ($n=-1$), and the absolute value makes it work for $x<0$ too. With $ax+b$ inside,
$$\int\frac{1}{ax+b}\,dx=\frac{1}{a}\ln|ax+b|+C$$
- **Rewrite first:** turn roots and fractions into powers, $\sqrt{x}=x^{1/2}$ and $\frac{1}{x^2}=x^{-2}$, and a power in the denominator into a negative exponent: $\frac{1}{3^x}=3^{-x}$, so $\int\frac{1}{3^x}\,dx=-\frac{3^{-x}}{\ln3}+C$. Split a fraction over its denominator, or factor it, before you integrate.
- **arctan:** $\arctan x$, also written $\tan^{-1}x$, is the angle between $-\frac{\pi}{2}$ and $\frac{\pi}{2}$ whose tan is $x$. The $-1$ means the inverse function, not $\frac{1}{\tan x}$. From the exact values,
$$\begin{gathered}\arctan0=0,\quad\arctan\tfrac{1}{\sqrt3}=\tfrac{\pi}{6}\\[2pt]\arctan1=\tfrac{\pi}{4},\quad\arctan\sqrt3=\tfrac{\pi}{3}\end{gathered}$$
and $\arctan(-x)=-\arctan x$.
- **Inverse trigonometric functions** (from the 9 Nov class): $\arcsin x$ $(=\sin^{-1}x)$ is the angle between $-\frac{\pi}{2}$ and $\frac{\pi}{2}$ whose sine is $x$, and $\arccos x$ $(=\cos^{-1}x)$ the angle between $0$ and $\pi$ whose cosine is $x$; both need $-1\le x\le1$. Their derivatives, with arctan's:
$$\begin{aligned}(\arcsin x)'&=\frac{1}{\sqrt{1-x^2}}\\[2pt](\arccos x)'&=-\frac{1}{\sqrt{1-x^2}}\\[2pt](\arctan x)'&=\frac{1}{1+x^2}\end{aligned}$$
For arcsin: $y=\arcsin x$ means $\sin y=x$, so $\cos y\cdot y'=1$ and $y'=\frac{1}{\cos y}=\frac{1}{\sqrt{1-x^2}}$, since $\cos y\ge0$ there. Read backwards:
$$\int\frac{1}{\sqrt{1-x^2}}\,dx=\arcsin x+C$$
From the exact values, $\arcsin\frac{1}{2}=\frac{\pi}{6}$, $\arcsin\frac{\sqrt2}{2}=\frac{\pi}{4}$, $\arcsin\frac{\sqrt3}{2}=\frac{\pi}{3}$ and $\arcsin1=\frac{\pi}{2}$, and $\arcsin(-x)=-\arcsin x$.
- **Area with a primitive:** find the zeros of $f$ inside $[a,b]$, work out each piece with $F$, and add the pieces as positive numbers. Without the split, the parts below the axis are subtracted.`,
    watch: R`
- The minus sign belongs to sine: $\int\sin x\,dx=-\cos x+C$, because $(\cos x)'=-\sin x$.
- Divide by the number inside, never multiply: $\int\cos3x\,dx=\frac{1}{3}\sin3x+C$ and $\int e^{-x}\,dx=-e^{-x}+C$.
- $\int\frac{1}{x}\,dx=\ln|x|+C$, since the power rule would divide by $0$. And $\int\frac{1}{2x+1}\,dx=\frac{1}{2}\ln|2x+1|+C$, not $\ln|2x+1|+C$.
- With the variable in the exponent, $\int2^x\,dx=\frac{2^x}{\ln2}+C$, not $\frac{2^{x+1}}{x+1}$. And $\int\frac{1}{3^x}\,dx$ is not $\ln|3^x|$: rewrite it as $3^{-x}$ first.
- $\tan^{-1}x$ is $\arctan x$, an angle: $\tan^{-1}1=\frac{\pi}{4}$, while $\frac{1}{\tan1}$ is a different number.
- A root in the denominator means arcsin, no root means arctan: $\int\frac{dx}{\sqrt{1-x^2}}=\arcsin x+C$, but $\int\frac{dx}{1+x^2}=\arctan x+C$. And $\arcsin x$ exists only for $-1\le x\le1$.
- In $F(b)-F(a)$, work out $F(a)$ on its own line, then subtract all of it: $\mathord{\Big[-\cos x\Big]_0^{\pi}}=-\cos\pi-(-\cos0)=2$. With a negative limit, $-(-2)=+2$.
- An area question needs the zeros of $f$ first: $\mathord{\int_{-1}^{1}x\,dx}=0$, but the area between $y=x$ and the axis on $[-1,1]$ is $1$.
- Check every primitive by differentiating it back to $f$.`,
    tricksAdded: NOV10,
    tricks: R`
- **Rebuild the inverse trig values:** draw the two special triangles. The $45^\circ$ one, with sides $1$, $1$, $\sqrt2$, gives $\tan\frac{\pi}{4}=1$, so $\arctan1=\frac{\pi}{4}$. The $30$-$60$-$90$ one, with sides $1$, $\sqrt3$, $2$, gives $\tan\frac{\pi}{6}=\frac{1}{\sqrt3}$ and $\tan\frac{\pi}{3}=\sqrt3$, and for arcsin $\sin\frac{\pi}{6}=\frac{1}{2}$ and $\sin\frac{\pi}{3}=\frac{\sqrt3}{2}$.
- **Odd functions on $[-a,a]$ give $0$:** if $f(-x)=-f(x)$, the parts left and right of $0$ cancel; if $f(-x)=f(x)$, they are equal:
$$\begin{gathered}f\text{ odd}:\ \int_{-a}^{a}f(x)\,dx=0\\[4pt]f\text{ even}:\ \int_{-a}^{a}f(x)\,dx=2\int_0^af(x)\,dx\end{gathered}$$
Odd times even is odd, and odd times odd is even. So $\int_{-1}^{1}\frac{\sin x}{1+x^2}\,dx=0$, although $\frac{\sin x}{1+x^2}$ has no primitive in the table.
- **Known shapes:** $y=\sqrt{r^2-x^2}$ is the top half of a circle of radius $r$, so its integral is half the circle's area:
$$\begin{gathered}\int_{-r}^{r}\sqrt{r^2-x^2}\,dx=\frac{\pi r^2}{2}\\[4pt]\int_0^1\sqrt{1-x^2}\,dx=\frac{\pi}{4}\end{gathered}$$`,
  },
  {
    id: 'u3', quiz: 'Quiz 07', days: 'Day 18 & 19', dates: '9 & 10 Nov', starred: true, added: NOV10,
    title: 'Integral by parts and integral by substitution',
    ideas: R`
- **Integration by substitution:** the chain rule read backwards. If $F'=f$, then $\big(F(g(x))\big)'=f(g(x))\,g'(x)$, so
$$\int f(g(x))\,g'(x)\,dx=F(g(x))+C$$
Look for an inner function $g(x)$ whose derivative also stands in the integral; a missing constant factor is fine.
- **Four steps:** let $u=g(x)$; find $du=g'(x)\,dx$; rewrite the whole integral in $u$, with no $x$ left; integrate in $u$ and put $u=g(x)$ back. For $\int xe^{x^2}dx$: $u=x^2$ and $du=2x\,dx$, so $x\,dx=\frac{du}{2}$ and the result is $\frac{1}{2}e^{x^2}+C$.
- **The log rule:** with $u=f(x)$, a numerator that is the derivative of the denominator gives a log:
$$\int\frac{f'(x)}{f(x)}\,dx=\ln|f(x)|+C$$
For example $\int\frac{2x}{x^2+1}\,dx=\ln(x^2+1)+C$. And with $u=\ln x$, $du=\frac{dx}{x}$: $\int\frac{\ln x}{x}\,dx=\int u\,du=\frac{(\ln x)^2}{2}+C$.
- **Calculation of definite integral:** after the substitution the primitive is a function of $u$, so the range of integration moves to the $u$-axis as well: $a\le x\le b$ becomes $h(a)\le u\le h(b)$.
$$\int_a^b f(h(x))\,h'(x)\,dx=\int_{h(a)}^{h(b)}f(u)\,du$$
The class example uses $u=h(x)=e^{2x}$, so $e^{2x}\,dx=\frac{du}{2}$, and $x:0\to1$ becomes $u:1\to e^2$:
$$\begin{aligned}\int_0^1e^{2x}\sqrt{1+e^{2x}}\,dx&=\left[\frac{(1+u)^{3/2}}{3}\right]_1^{e^2}\\[4pt]&=\frac{(1+e^2)^{3/2}-(\sqrt2)^3}{3}\end{aligned}$$
Either change the limits, or put $x$ back and use the old ones; never mix the two.
- **Rational forms whose denominator factors:** split into partial fractions, and each piece gives a log:
$$\begin{aligned}\frac{1}{x^2+3x+2}&=\frac{1}{(x+1)(x+2)}\\[4pt]&=\frac{1}{x+1}-\frac{1}{x+2}\end{aligned}$$
so $\int\frac{dx}{x^2+3x+2}=\ln\left|\frac{x+1}{x+2}\right|+C$. To find $A$ and $B$ in $\frac{A}{x+1}+\frac{B}{x+2}$, write $1=A(x+2)+B(x+1)$ and put in the roots $x=-1$ and $x=-2$.
- **A denominator that does not factor:** first make a quadratic term, then factor out the constant, then substitute:
$$\begin{aligned}\frac{1}{x^2+2x+5}&=\frac{1}{(x+1)^2+4}\\[4pt]&=\frac{1}{4}\cdot\frac{1}{\left(\frac{x+1}{2}\right)^2+1}\end{aligned}$$
With $u=\frac{x+1}{2}$ and $dx=2\,du$, $\int\frac{dx}{x^2+2x+5}=\frac{1}{2}\arctan\frac{x+1}{2}+C$. The same steps give
$$\int\frac{dx}{(x+p)^2+a^2}=\frac{1}{a}\arctan\frac{x+p}{a}+C$$
- **Which case:** for $x^2+bx+c$, the sign of $\Delta=b^2-4c$ decides. $\Delta>0$: it factors, so partial fractions and logs. $\Delta<0$: make a square, so arctan. $\Delta=0$: it is already a square $\left(x+\frac{b}{2}\right)^2$, and $\int\frac{dx}{(x+p)^2}=-\frac{1}{x+p}+C$. A numerator with $x$ is first written as a multiple of the denominator's derivative plus a constant: $\frac{2x}{x^2+2x+2}=\frac{2x+2}{x^2+2x+2}-\frac{2}{(x+1)^2+1}$, a log plus an arctan.
- **Rational forms of $x$ and $\sqrt{ax+b}$:** put $t=\sqrt{ax+b}$, so $x=\frac{t^2-b}{a}$ and $dx=\frac{2t}{a}\,dt$, and the integrand becomes a rational function of $t$. In the class example $t=\sqrt{x-1}$ gives $x=t^2+1$, $dx=2t\,dt$ and $x+2\sqrt{x-1}=(t+1)^2$:
$$\begin{aligned}&\int\frac{dx}{x+2\sqrt{x-1}}\\[4pt]&=\int\frac{2t}{(t+1)^2}\,dt\\[4pt]&=2\ln(t+1)+\frac{2}{t+1}+C\end{aligned}$$
- **Rational forms of trigonometric functions:** $u=\tan\frac{x}{2}$ works in general. From $u^2=\frac{\sin^2(x/2)}{\cos^2(x/2)}=\frac{1-\cos x}{1+\cos x}$,
$$\begin{gathered}\cos x=\frac{1-u^2}{1+u^2},\qquad\sin x=\frac{2u}{1+u^2}\\[4pt]dx=\frac{2}{1+u^2}\,du\end{gathered}$$
since $\left(\frac{du}{dx}\right)^{-1}=2\cos^2\frac{x}{2}=1+\cos x=\frac{2}{1+u^2}$. The class example:
$$\begin{aligned}&\int\frac{1+\sin x}{1+\cos x}\,dx=\int\left(1+\frac{2u}{1+u^2}\right)du\\[4pt]&=\tan\frac{x}{2}+\ln\left(1+\tan^2\frac{x}{2}\right)+C\end{aligned}$$
For the limits, $\tan\frac{x}{2}=\frac{\sin x}{1+\cos x}$ also works for angles that are not in the table.
- **Integration by parts (product of functions):** from $(fg)'=f'g+fg'$,
$$\int f\,g'\,dx=f\,g-\int f'\,g\,dx$$
Differentiate the factor that gets simpler ($f$: a polynomial or a logarithm) and integrate the one you can ($g'$: $e^{ax}$, $\sin x$, $\cos x$, or $1$). The class examples: $\int x\sin x\,dx=-x\cos x+\sin x+C$, and with $g'=1$, $\int\ln x\,dx=x\ln x-x+C$.
- **Definite integrals by parts:**
$$\int_a^b f\,g'\,dx=\Big[f\,g\Big]_a^b-\int_a^b f'\,g\,dx$$
A square of $x$ needs two rounds: the class exercise $\int_0^2x^2e^{2x}\,dx=\frac{5e^4-1}{4}$. A log on its own takes $g'=1$: in $\int_0^1\ln(x^2+1)\,dx$ the leftover $\frac{2x^2}{x^2+1}=2-\frac{2}{x^2+1}$ brings in arctan, and the value is $\ln2-2+\frac{\pi}{2}$.`,
    watch: R`
- $du$ comes from differentiating, and it always carries $dx$: $u=1+e^{2x}$ gives $du=2e^{2x}\,dx$ (the $1$ becomes $0$, not $x$), and $u=\ln x$ gives $du=\frac{1}{x}\,dx$.
- A $u$ in the denominator becomes $\frac{1}{u}$, and the constant from $du$ stays: with $u=x^2+1$, $\frac{x}{x^2+1}\,dx=\frac{1}{2}\cdot\frac{du}{u}$, not $u\,du$.
- New variable, new limits: $\int_1^2\frac{\ln x}{x}\,dx=\int_0^{\ln2}u\,du$. If an $x$ is left after substituting, choose another $u$.
- Check $\Delta$ before you reach for arctan: $x^2-4x+4=(x-2)^2$, so $\int\frac{dx}{x^2-4x+4}=-\frac{1}{x-2}+C$, with no arctan.
- When you factor out the constant, $dx$ changes too: in $\frac{1}{4}\cdot\frac{1}{u^2+1}$ with $dx=2\,du$ the factor in front becomes $\frac{1}{2}$, not $\frac{1}{4}$.
- With $u=\tan\frac{x}{2}$, change $dx$ as well: $dx=\frac{2\,du}{1+u^2}$.
- By parts, keep the minus sign before $\int f'g\,dx$, and integrate $g'$ with care: $g'=\sin x$ gives $g=-\cos x$, and $g'=e^{2x}$ gives $g=\frac{e^{2x}}{2}$.
- Choose the factors the right way round: in $\int xe^x\,dx$ differentiate $x$. Taking $g'=x$ instead leaves $\int\frac{x^2}{2}e^x\,dx$, which is harder.`,
    tricksAdded: NOV10,
    tricks: R`
- **Guess and adjust:** guess the answer from the outer function, differentiate it, then fix the constant. For the class example, guess $(1+e^{2x})^{3/2}$: its derivative is $\frac{3}{2}(1+e^{2x})^{1/2}\cdot2e^{2x}=3e^{2x}\sqrt{1+e^{2x}}$, three times too big, so $\int e^{2x}\sqrt{1+e^{2x}}\,dx=\frac{1}{3}(1+e^{2x})^{3/2}+C$. It is also a quick check after any substitution.
- **Make the derivative appear:** write the numerator as $k\cdot(\text{denominator})'+r$. The first part gives a log and the rest an arctan. With $x+3=\frac{1}{2}(2x+2)+2$:
$$\begin{aligned}&\int\frac{x+3}{x^2+2x+5}\,dx\\[4pt]&=\frac{1}{2}\ln(x^2+2x+5)\\[4pt]&\quad+\arctan\frac{x+1}{2}+C\end{aligned}$$
- **The cover-up method:** to find $A$ over $x-\alpha$, cover the factor $x-\alpha$ in the original fraction and put $x=\alpha$ into what is left. For $\frac{x+5}{(x-1)(x+2)}$: $x=1$ gives $A=\frac{6}{3}=2$, and $x=-2$ gives $\mathord{B=\frac{3}{-3}=-1}$, so it is $\frac{2}{x-1}-\frac{1}{x+2}$. It works for separate linear factors only. On a quiz, also write the line $x+5=A(x+2)+B(x-1)$.
- **Which factor to differentiate:** in integration by parts, differentiate whichever comes first in this list and integrate the other: logarithm, inverse trig, polynomial, trig, exponential.
- **The DI table:** integration by parts several times over, set out as a table. Differentiate the polynomial down to $0$ in column D, integrate the other factor once per row in column I, give the rows the signs $+,-,+,\dots$, then multiply each D by the I one row below and add:
$$\begin{array}{c|c|c}&D&I\\\hline+&x^2&e^x\\-&2x&e^x\\+&2&e^x\\&0&e^x\end{array}$$
So $\int x^2e^x\,dx=x^2e^x-2xe^x+2e^x+C=e^x(x^2-2x+2)+C$. With $\ln x$ the D column never reaches $0$: stop at the first row whose D times I you can integrate, and add that integral with the row's sign.
- **The King's rule:** replacing $x$ by $a-x$ (the substitution $u=a-x$) gives
$$\int_0^af(x)\,dx=\int_0^af(a-x)\,dx$$
For $I=\int_0^{\pi/2}\frac{\sin x}{\sin x+\cos x}\,dx$ it gives the same integral with $\cos x$ on top. Adding the two, $2I=\int_0^{\pi/2}dx=\frac{\pi}{2}$, so $I=\frac{\pi}{4}$.`,
  },
  {
    id: 'u4', quiz: 'Quiz 08', days: 'Day 20 & 21', dates: '12 & 13 Nov', starred: true, added: NOV13,
    title: 'Application of integration: area, average, etc.',
    ideas: R`
- **Area between two curves:** if $f(x)\ge g(x)$ on $[a,b]$, the region between the two graphs has area
$$A=\int_a^b\big(f(x)-g(x)\big)\,dx$$
Solve $f(x)=g(x)$ to find where the curves cross, which gives $a$ and $b$, and check which curve is on top. With $g=0$ this is the area under $f$. Where the curves change places, split there, as for the area between a curve and the $x$-axis.
- **Volume from slices:** cut a solid across the $x$-axis into thin slices. If the slice at $x$ has area $S(x)$, a slice of thickness $\Delta x$ has volume about $S(x)\,\Delta x$, and adding them up gives
$$V=\int_a^b S(x)\,dx$$
For a cylinder of radius $r$ and height $h$, every slice is the same circle, $S(x)=\pi r^2$, so $V=\pi r^2h$. For a cone with its tip at $x=0$, the radius grows in proportion to $x$, as $\frac{rx}{h}$:
$$V=\int_0^h\pi\frac{r^2x^2}{h^2}\,dx=\frac{1}{3}\pi r^2h$$
a third of the cylinder. For a sphere of radius $r$, the slice at $x$ (with $-r\le x\le r$) is a circle of radius $\sqrt{r^2-x^2}$:
$$V=\int_{-r}^{r}\pi(r^2-x^2)\,dx=\frac{4}{3}\pi r^3$$
- **Solid of revolution:** turning the graph of $y=f(x)$, $a\le x\le b$, around the $x$-axis makes every slice a circle of radius $|f(x)|$, so $S(x)=\pi f(x)^2$ and
$$V=\pi\int_a^b f(x)^2\,dx$$
Square $f$ first, then integrate. The class exercise: $f(x)=\frac{1}{\cos x}$ on $\left[\frac{\pi}{6},\frac{\pi}{3}\right]$ has $f^2=\frac{1}{\cos^2x}$, whose primitive is $\tan x$, so $V=\pi\left(\sqrt3-\frac{\sqrt3}{3}\right)=\frac{2\sqrt3}{3}\pi$. And $f(x)=\sqrt{x}\,e^{-x^2/2}$ on $\left[0,\frac{1}{2}\right]$ has $f^2=xe^{-x^2}$; with $u=-x^2$ the volume is $\frac{\pi}{2}\left(1-e^{-1/4}\right)$.
- **Solid of revolution with a hole:** turning the region between $y=f(x)$ and $y=g(x)$, with $f\ge g\ge0$, around the $x$-axis makes every slice a ring: a disc of radius $f(x)$ with a hole of radius $g(x)$. So
$$V=\pi\int_a^b\big(f(x)^2-g(x)^2\big)\,dx$$
For the region between $y=x$ and $y=x^2$ on $[0,1]$: $\pi\int_0^1(x^2-x^4)\,dx=\frac{2\pi}{15}$.
- **Two types of averages.** The average of $y=f(x)$ in $a\le x\le b$ is the height of the rectangle on $[a,b]$ whose area $A$ is that of the region under the curve:
$$\bar f=\frac{1}{b-a}\int_a^b f(x)\,dx$$
For example, $\sin x$ on $[0,\pi]$ has the average $\frac{2}{\pi}$. The average of $x$ with the probability $\frac{f(x)}{P}$, where $P=\int_a^b f(x)\,dx$ so that $p(x)=\frac{f(x)}{P}$ has area $1$, counts each $x$ with the weight $f(x)$:
$$\bar x=\frac{\int_a^b x\,f(x)\,dx}{\int_a^b f(x)\,dx}$$
For $f(x)=x^2$ on $[0,1]$: $\bar x=\frac{1/4}{1/3}=\frac{3}{4}$, right of the middle, because the larger values of $x$ carry more weight.
- **Length of a curve:** on a smooth plane curve ($f'$ is continuous, so there are no corners) short pieces are nearly straight. On a straight line $y=cx+d$, a step $\Delta x$ rises $c\,\Delta x$, so by Pythagoras
$$\begin{gathered}(\Delta\ell)^2=(\Delta x)^2(1+c^2)\\[2pt]\Delta\ell=\Delta x\sqrt{1+c^2}\end{gathered}$$
On a curve the slope at $x_k$ is $f'(x_k)$. Adding up the pieces and letting $N\to\infty$ turns the sum into an integral:
$$\begin{aligned}\ell&=\lim_{N\to\infty}\sum_{k=1}^{N}\sqrt{1+f'(x_k)^2}\,\Delta x\\[4pt]&=\int_a^b\sqrt{1+f'(x)^2}\,dx\end{aligned}$$
Here $f'(x)^2$ is the square of the first derivative. Simplify $1+f'(x)^2$ before taking the root: for $y=\frac{2}{3}x^{3/2}$ it is $1+x$, and often it is a perfect square.
- **Length of a circular arc:** the upper half of the circle of radius $r$ is $y=\sqrt{r^2-x^2}$. Its slope is $f'=-\frac{x}{\sqrt{r^2-x^2}}$, so $1+f'^2=\frac{r^2}{r^2-x^2}$ and, with $u=\frac{x}{r}$,
$$\int\frac{r}{\sqrt{r^2-x^2}}\,dx=r\arcsin\frac{x}{r}+C$$
From $x=0$ to $x=r$ this gives $r\cdot\frac{\pi}{2}$, a quarter of $2\pi r$. An arc of angle $\theta$ (in radians) has length $r\theta$.
- **Primitive functions of $\cos^nx$ and $\sin^nx$ (integration by parts):** write $C_n=\int\cos^nx\,dx$. Split off one factor, $\cos^nx=\cos^{n-1}x\cdot\cos x$, and integrate by parts with $f=\cos^{n-1}x$ and $g'=\cos x$:
$$\begin{aligned}C_n&=\cos^{n-1}x\sin x\\[2pt]&\quad+(n-1)\int\cos^{n-2}x\sin^2x\,dx\end{aligned}$$
With $\sin^2x=1-\cos^2x$, the last integral is $C_{n-2}-C_n$, so $C_n$ appears on both sides. Moving it to the left gives $nC_n=\cos^{n-1}x\sin x+(n-1)C_{n-2}$:
$$C_n=\frac{1}{n}\cos^{n-1}x\sin x+\frac{n-1}{n}C_{n-2}$$
The same steps for $S_n=\int\sin^nx\,dx$ give
$$S_n=-\frac{1}{n}\sin^{n-1}x\cos x+\frac{n-1}{n}S_{n-2}$$
Each step lowers the power by $2$, down to $C_0=x$, $C_1=\sin x$ or $S_1=-\cos x$. For $n=2$ the half-angle formulas give the same: $\sin^2x=\frac{1-\cos2x}{2}$ and $\cos^2x=\frac{1+\cos2x}{2}$.
- **On $\left[0,\frac{\pi}{2}\right]$:** the first term is $0$ at both ends, so the cosine and sine integrals follow the same rule from the same start, and are equal:
$$I_n=\int_0^{\pi/2}\cos^nx\,dx=\int_0^{\pi/2}\sin^nx\,dx$$
$$I_n=\frac{n-1}{n}I_{n-2},\qquad I_0=\frac{\pi}{2},\quad I_1=1$$
For example $I_2=\frac{1}{2}\cdot\frac{\pi}{2}=\frac{\pi}{4}$, $I_4=\frac{3}{4}\cdot\frac{1}{2}\cdot\frac{\pi}{2}=\frac{3\pi}{16}$ and $I_5=\frac{4}{5}\cdot\frac{2}{3}=\frac{8}{15}$.
- **Products of sines and cosines** (asked on Quiz 08): turn the product into a sum first,
$$\begin{aligned}\sin mx\sin nx&=\tfrac{1}{2}\cos(m-n)x\\&\quad-\tfrac{1}{2}\cos(m+n)x\\[6pt]\cos mx\cos nx&=\tfrac{1}{2}\cos(m-n)x\\&\quad+\tfrac{1}{2}\cos(m+n)x\end{aligned}$$
With $|m|\ne|n|$, neither $m-n$ nor $m+n$ is $0$, so each term integrates to a sine. For whole numbers $m$ and $n$, $\int_0^{\pi}\sin mx\sin nx\,dx=0$, because $\sin k\pi=0$. On another interval, work it out: on $\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$ the result is not always $0$.`,
    watch: R`
- Square $f$ before you integrate: $V=\pi\int f(x)^2\,dx$, not $\pi\left(\int f\,dx\right)^2$. Expand the square completely: $(1+\sin x)^2=1+2\sin x+\sin^2x$, with the middle term.
- With a hole, square each radius on its own: $\pi\int\big(f^2-g^2\big)\,dx$, not $\pi\int(f-g)^2\,dx$.
- After a substitution, move the limits too: with $u=-x^2$, $x=\frac{1}{2}$ gives $u=-\frac{1}{4}$, not $\frac{1}{2}$. And $du=-2x\,dx$ keeps its minus sign, which flips the limits back.
- $\int e^u\,du=e^u+C$: once everything is in $u$, there is nothing to divide by. Dividing by the number inside works only for a linear inside, like $\int e^{3x}\,dx=\frac{e^{3x}}{3}+C$.
- A volume, a length and an area are positive. A negative answer usually means the limits went in the wrong order: it is $F(\text{upper})-F(\text{lower})$.
- In $\sqrt{1+f'(x)^2}$ the first derivative is squared: $f'(x)^2=\big(f'(x)\big)^2$, not $f''(x)$.
- $\left(\frac{\ln x}{4}\right)'=\frac{1}{4x}$, but $\left(\ln\frac{x}{4}\right)'=\frac{1}{x}$, since $\ln\frac{x}{4}=\ln x-\ln4$.
- The average value divides by the width $b-a$; the average of $x$ divides by $\int f\,dx$. Don't leave out the bottom integral.
- In the reduction formula, $\sin^2x=1-\cos^2x$ gives $+(n-1)C_{n-2}$ and $-(n-1)C_n$. Keep these signs when you move $C_n$ to the left; with them the other way round, the $C_n$ terms don't add up to $nC_n$.
- On $\left[0,\frac{\pi}{2}\right]$ an even power ends with $I_0=\frac{\pi}{2}$ and an odd one with $I_1=1$: $I_3=\frac{2}{3}$, with no $\pi$.
- $\int\sin mx\sin nx\,dx=0$ needs whole numbers and an interval such as $[0,\pi]$. On $\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$, $\int\cos x\cos2x\,dx=\frac{2}{3}$.`,
    tricksAdded: NOV13,
    tricks: R`
- **The reduction formula in one line:** on $\left[0,\frac{\pi}{2}\right]$, multiply the fractions $\frac{n-1}{n}$, $\frac{n-3}{n-2}$, … down to $\frac{1}{2}$ (then times $\frac{\pi}{2}$) or to $\frac{2}{3}$ (then stop):
$$\begin{gathered}I_6=\frac{5\cdot3\cdot1}{6\cdot4\cdot2}\cdot\frac{\pi}{2}=\frac{5\pi}{32}\\[4pt]I_7=\frac{6\cdot4\cdot2}{7\cdot5\cdot3}=\frac{16}{35}\end{gathered}$$
- **$\sin^2$ and $\cos^2$ without a formula:** on $\left[0,\frac{\pi}{2}\right]$ they have the same integral and add up to $1$, so each gives half of $\frac{\pi}{2}$, that is $\frac{\pi}{4}$. On $[0,\pi]$ each gives $\frac{\pi}{2}$.
- **Spot the perfect square in a length:** if $f'=A-B$ with $AB=\frac{1}{4}$, then $1+f'^2=A^2+2AB+B^2=(A+B)^2$, so the root is $A+B$ (when it is positive). For example $f'=x-\frac{1}{4x}$ gives $\sqrt{1+f'^2}=x+\frac{1}{4x}$.
- **Check an average:** it must lie between the smallest and the largest value of $f$ on the interval, and $\bar x$ must lie in $[a,b]$. $\frac{2}{\pi}\approx0.64$ for $\sin x$ on $[0,\pi]$ passes.`,
  },
  {
    id: 'u5', quiz: 'Quiz 09', days: 'Day 22 & 23', dates: '16 & 17 Nov', starred: true, added: NOV17,
    title: 'Parametric and polar curves',
    ideas: R`
- **Parametrization:** a representation of a variable with another variable. A curve is written as $x=x(t)$, $y=y(t)$, and as $t$ runs over its range, the point $(x(t),y(t))$ traces the curve. The class example: $y=\sqrt x$ on $1\le x\le4$, with $x=t^2$ $(1\le t\le2)$, gives $y=\sqrt{t^2}=t$, so
$$\begin{cases}x=t^2\\y=t\end{cases}\qquad(1\le t\le2)$$
is the equivalent curve. One curve has many parametrizations ($x=t$, $y=\sqrt t$ draws the same one), and eliminating $t$ gives the equation back: $x=\cos t$, $y=\sin t$ is the circle $x^2+y^2=1$.
- **Polar coordinates:** a point is given by its distance $r$ from the origin and the angle $\theta$ from the positive $x$-axis, instead of the Cartesian $(x,y)$:
$$\begin{gathered}x=r\cos\theta,\quad y=r\sin\theta\\[2pt]r=\sqrt{x^2+y^2},\quad\tan\theta=\frac{y}{x}\end{gathered}$$
A curve $r=r(\theta)$ is the parametric curve $x=r(\theta)\cos\theta$, $y=r(\theta)\sin\theta$, with $\theta$ as the parameter. For example $(1,1)$ is $r=\sqrt2$, $\theta=\frac{\pi}{4}$, and $r=2$ is the circle $x^2+y^2=4$.
- **The class example: an arc with $x=\cos\theta$.** The arc $y=g(x)=\sqrt{1-x^2}$, $-\frac{1}{\sqrt2}\le x\le\frac{1}{\sqrt2}$, becomes $x=\cos\theta$, $y=\sin\theta$. Then $\frac{dx}{d\theta}=-\sin\theta$ and $g'(x)=-\frac{\cos\theta}{\sin\theta}$, and the integrand of the length is transformed to a constant (with $y=\sin\theta>0$):
$$\begin{aligned}&\sqrt{1+g'(x(\theta))^2}\cdot\frac{dx}{d\theta}\\[4pt]&=\sqrt{1+\frac{\cos^2\theta}{\sin^2\theta}}\cdot(-\sin\theta)\\[4pt]&=-\frac{\sqrt{\sin^2\theta+\cos^2\theta}}{\sin\theta}\cdot\sin\theta=-1\end{aligned}$$
- **The conversion of the region of integral:** put each end into $x=\cos\theta$. $x=-\frac{1}{\sqrt2}$ gives $\theta=\frac{3\pi}{4}$ and $x=\frac{1}{\sqrt2}$ gives $\theta=\frac{\pi}{4}$ (with $0\le\theta\le\pi$ on the upper half). The order follows $x$, so the limits come out reversed, and the minus sign turns them back:
$$\ell=\int_{3\pi/4}^{\pi/4}(-1)\,d\theta=\int_{\pi/4}^{3\pi/4}1\,d\theta=\frac{\pi}{2}$$
an arc of angle $\frac{\pi}{2}$ on a circle of radius $1$.
- **Length of a parametric curve:** in general, with $x=x(\theta)$ and $y=y(\theta)$, the slope is $\frac{dy}{dx}=\frac{dy/d\theta}{dx/d\theta}$ (Day 5 & 6) and $dx=\frac{dx}{d\theta}\,d\theta$, so
$$\begin{aligned}\ell&=\int_a^b\sqrt{1+\frac{(dy/d\theta)^2}{(dx/d\theta)^2}}\cdot\frac{dx}{d\theta}\,d\theta\\[4pt]&=\int_a^b\sqrt{\left(\frac{dx}{d\theta}\right)^2+\left(\frac{dy}{d\theta}\right)^2}\,d\theta\end{aligned}$$
The latter has nothing to divide by, so it can be applied even if $\frac{dx}{d\theta}=0$: at a vertical tangent, around a whole circle, or on a curve that is not a function $y=g(x)$. With $a<b$ it is always positive. For the arc above, $\sin^2\theta+\cos^2\theta=1$ gives $\ell=\int_{\pi/4}^{3\pi/4}d\theta=\frac{\pi}{2}$ at once.
- **A general curve in $(r,\theta)$:** with $x=r\cos\theta$ and $y=r\sin\theta$, the sum of squares of the derivatives is
$$\left(\frac{dx}{d\theta}\right)^2+\left(\frac{dy}{d\theta}\right)^2=r^2+\left(\frac{dr}{d\theta}\right)^2$$
because the terms $\pm2rr'\sin\theta\cos\theta$ cancel and $\sin^2\theta+\cos^2\theta=1$. So
$$\ell=\int_a^b\sqrt{r^2+\left(\frac{dr}{d\theta}\right)^2}\,d\theta$$
A circle $r=a$ has $\frac{dr}{d\theta}=0$ and gives $\int_0^{2\pi}a\,d\theta=2\pi a$.
- **The length element is always positive.** For the cardioid $r=1+\cos\theta$, $r^2+r'^2=2+2\cos\theta=4\cos^2\frac{\theta}{2}$, so $\ell=2\int\sqrt{\cos^2\frac{\theta}{2}}\,d\theta$, and $\sqrt{\cos^2\frac{\theta}{2}}=\left|\cos\frac{\theta}{2}\right|$, not $\cos\frac{\theta}{2}$. On $0\le\theta\le2\pi$, $\cos\frac{\theta}{2}$ changes sign at $\pi$:
$$\begin{aligned}\ell&=2\int_0^{\pi}\cos\frac{\theta}{2}\,d\theta-2\int_{\pi}^{2\pi}\cos\frac{\theta}{2}\,d\theta\\[4pt]&=4+4=8\end{aligned}$$
Without the absolute value the "length" would come out as $0$.
- **The 16 Nov exercises:** the length of $y=\frac{1}{2}x^2$ $(0\le x\le1)$, using the relation
$$\int\frac{dx}{\sqrt{x^2+a^2}}=\ln\left|x+\sqrt{x^2+a^2}\right|+C$$
and integration by parts for $\sqrt{x^2+1}=1\cdot\sqrt{x^2+1}$: the integral comes back, as with $\cos^nx$, and $\ell=\frac{\sqrt2}{2}+\frac{1}{2}\ln\left(1+\sqrt2\right)$. For $r=2\theta$ $(0\le\theta\le1)$, $\sqrt{4\theta^2+4}=2\sqrt{\theta^2+1}$ leads to the same integral, and $\ell=\sqrt2+\ln\left(1+\sqrt2\right)$. Practice works both out step by step.
- **The conversion of summation:** with $x=x(t)$, each strip's width is $\Delta x=\frac{\Delta x}{\Delta t}\,\Delta t$:
$$\begin{aligned}&\sum_{k=1}^{N}f(x_k)\,\Delta x\\[2pt]&\to\sum_{k=1}^{N}f(x(t_k))\cdot\frac{\Delta x}{\Delta t}\cdot\Delta t\end{aligned}$$
The additional factor $\frac{\Delta x}{\Delta t}$ tends to $\frac{dx}{dt}$, so in general the transformation leads to
$$\begin{aligned}&\int f(x)\,dx=F(x)\\[2pt]&\to\int f(x(t))\cdot\frac{dx}{dt}\,dt=G(t)\end{aligned}$$
the substitution rule again. For the class curve $x=3t^2$, $y=3t-t^3$, the factor is $\frac{dx}{dt}=6t$.
- **Area with a parameter:** the area between a curve and the $x$-axis is $\int y\,dx$, so
$$A=\int_{t_a}^{t_b}y(t)\,\frac{dx}{dt}\,dt$$
Convert the region of integral first. The class curve meets the $x$-axis where $y=t(3-t^2)=0$, at $t=0$ and $t=\sqrt3$ ($x=0$ and $x=9$). Exercise (3): $A=\int_0^{\sqrt3}(3t-t^3)\cdot6t\,dt=\frac{36\sqrt3}{5}$.
- **Length with a parameter:** for the same curve,
$$\begin{aligned}\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2&=36t^2+9(1-t^2)^2\\[2pt]&=9(1+t^2)^2\end{aligned}$$
a perfect square, so the root is $3(1+t^2)$. Exercise (4), the length within $0\le x\le12$: $x=3t^2=12$ gives $t=2$, and $\ell=\int_0^2 3(1+t^2)\,dt=14$.`,
    watch: R`
- $\frac{dr}{d\theta}=0$ only when $r$ is a constant. For $r=2\theta$, $\frac{dr}{d\theta}=2$.
- Square the first derivatives: $\left(\frac{dx}{dt}\right)^2$ is the square of $\frac{dx}{dt}$, not $\frac{d^2x}{dt^2}$.
- $\sqrt{a^2}=|a|$: split the integral where the inside changes sign. $2\int_0^{2\pi}\cos\frac{\theta}{2}\,d\theta=0$ can't be the length of the cardioid.
- Convert the region of integral with the variable: put each end of $x$ into $x=x(t)$ and solve for $t$. With $x=\cos\theta$ the limits come out reversed, and the minus sign of $\frac{dx}{d\theta}$ turns them back.
- In an area, $dx$ becomes $\frac{dx}{dt}\,dt$: don't drop the factor. With $x=\ln t$ the factor is $\frac{1}{t}$, and $x\ge0$ means $t\ge1$.
- "Meets the $x$-axis" means $y=0$, not $x=0$.
- In Exercise (1), the first part of integration by parts, $\Big[x\sqrt{1+x^2}\Big]_0^1=\sqrt2$, is a number, not an integral, and what is left is $\int\frac{x\cdot x}{\sqrt{1+x^2}}\,dx$, with both factors of $x$.
- The relation from class has a root in the denominator: $\int\frac{dx}{\sqrt{x^2+a^2}}$ is a logarithm, but $\int\frac{dx}{x^2+a^2}=\frac{1}{a}\arctan\frac{x}{a}+C$.`,
    tricksAdded: NOV17,
    tricks: R`
- **A ready-made primitive:** the by-parts steps of Exercise (1) work for any $a>0$ and give
$$\begin{aligned}&\int\sqrt{x^2+a^2}\,dx=\frac{1}{2}x\sqrt{x^2+a^2}\\[2pt]&\quad+\frac{a^2}{2}\ln\left|x+\sqrt{x^2+a^2}\right|+C\end{aligned}$$
Use it to check an answer; on a quiz, still show the by-parts steps.
- **Spot the perfect square:** $(A-B)^2+4AB=(A+B)^2$, and the sum of squares of a length is often built that way. The class curve has $9(1-t^2)^2+36t^2=9(1+t^2)^2$, with $A=t^2$ and $B=1$ inside.
- **Halve a symmetric curve:** the cardioid $r=1+\cos\theta$ is symmetric about the $x$-axis, so its length is twice the top half, $2\cdot2\int_0^{\pi}\cos\frac{\theta}{2}\,d\theta=8$, with no absolute value to split.
- **Speed:** with $t$ as time, $\sqrt{x'(t)^2+y'(t)^2}$ is the speed of the moving point, so the length is the distance travelled, as in physics.`,
  },
  {
    // 19 Nov: improper integrals (slides 10–26) and L'Hôpital's rule; the 20 Nov class (orthogonal functions) is not in yet
    id: 'u6', quiz: 'Quiz 10', days: 'Day 24 & 25', dates: '19 & 20 Nov', starred: true, added: NOV20,
    title: 'Improper integrals and orthogonal functions',
    intro: R`Two parts: improper integrals, with L'Hôpital's rule for the limits they lead to (19 Nov), and orthogonal functions, with the Fourier basis and Fourier series (20 Nov).`,
    ideas: R`
- **Improper integrals:** $F(b)-F(a)$ needs a finite interval and an $f$ that stays finite on it. An integral is improper when a limit is $\infty$ or $-\infty$, or when $f$ diverges (goes to $\pm\infty$) at a point of the interval. It is calculated as a limit of ordinary integrals: integrate up to a movable end $w$, then let $w$ go to the problem point:
$$\int_a^{\infty}f(x)\,dx=\lim_{w\to\infty}\int_a^{w}f(x)\,dx$$
In the same way, $\int_{-\infty}^{b}f\,dx=\lim_{w\to-\infty}\int_w^{b}f\,dx$.
- **Converge or diverge:** if the limit is a finite number, the improper integral converges, and that number is its value. If the limit is $\pm\infty$, or there is none, it diverges and has no value.
- **Power functions:** the primitive functions for $f(x)=x^n$ are
$$F(x)=\begin{cases}\dfrac{1}{n+1}x^{n+1}&(n\ne-1)\\[8pt]\ln x&(n=-1)\end{cases}$$
so the improper integral on $[1,\infty)$ is characterized by the power $n$:
$$\begin{aligned}&\text{converge: }\lim_{x\to\infty}x^{n+1}=0\ \ (n<-1)\\[4pt]&\text{diverge: }\lim_{x\to\infty}\ln x=\infty\ \ (n=-1)\\[4pt]&\text{diverge: }\lim_{x\to\infty}x^{n+1}=\infty\ \ (-1<n)\end{aligned}$$
For $n<-1$ the value is $-\frac{1}{n+1}$, so $\int_1^{\infty}\frac{dx}{x^2}=1$. The borderline is $\frac{1}{x}$: it tends to $0$, yet $\int_1^{\infty}\frac{dx}{x}=\lim_{w\to\infty}\ln w=\infty$.
- **Class exercise (1):** with $\int\frac{dx}{1+x^2}=\arctan x$ and $\arctan w\to\frac{\pi}{2}$ as $w\to\infty$,
$$\int_0^{\infty}\frac{dx}{1+x^2}=\lim_{w\to\infty}\arctan w=\frac{\pi}{2}$$
and since $e^{w}\to0$ as $w\to-\infty$,
$$\int_{-\infty}^{0}e^x\,dx=\lim_{w\to-\infty}\left(1-e^{w}\right)=1$$
- **Divergence of $f(x)$ at an open boundary:** $f(x)=\frac{1}{\sqrt{1-x}}$ diverges at $x=1$ and cannot be defined there, so the integral from $x=0$ to $1$ is improper: $x$ runs over $[0,1)$, open at $1$. Integrate up to $w<1$ and let $w\to1$:
$$\begin{aligned}\int_0^1\frac{dx}{\sqrt{1-x}}&=\lim_{w\to1}\Big[-2\sqrt{1-x}\Big]_0^{w}\\[4pt]&=\lim_{w\to1}\left(2-2\sqrt{1-w}\right)=2\end{aligned}$$
The graph shoots up at $x=1$, yet the area under it is finite. The primitive has a minus sign because the inside, $1-x$, has the derivative $-1$.
- **Class exercise (2):** $\tan x$ diverges at $x=\frac{\pi}{2}$, so the integral is calculated as
$$\int_0^{\pi/2}\tan x\,dx=\lim_{w\to\pi/2}\int_0^{w}\tan x\,dx$$
The integral from $0$ to $w$, with the substitution $u=\cos x$:
$$\begin{aligned}\int_0^{w}\tan x\,dx&=\int_0^{w}\left\{-\frac{(\cos x)'}{\cos x}\right\}dx\\[4pt]&=\Big[-\ln|\cos x|\Big]_0^{w}\\[4pt]&=-\ln|\cos w|\end{aligned}$$
since $\ln|\cos0|=0$. As $w\to\frac{\pi}{2}$, $\cos w\to0$, so $-\ln|\cos w|\to\infty$: the integral diverges.
- **Class exercise (3):** with $\int xe^{-x^2}dx=-\frac{1}{2}e^{-x^2}+C$ (substitute $u=-x^2$),
$$\begin{aligned}\int_{-\infty}^{1}xe^{-x^2}dx&=\lim_{w\to-\infty}\Big[-\tfrac{1}{2}e^{-x^2}\Big]_w^{1}\\[4pt]&=-\frac{1}{2e}\end{aligned}$$
and $\ln x$ diverges (to $-\infty$) at $x=0$. With $\int\ln x\,dx=x\ln x-x$ (by parts) and $w\ln w\to0$,
$$\int_0^1\ln x\,dx=\lim_{w\to+0}\Big[x\ln x-x\Big]_w^{1}=-1$$
- **A domain containing discontinuous points:** in $I=\int_{-1}^{1}\frac{dx}{\sqrt{|x|}}$, the integrand $\frac{1}{\sqrt{|x|}}$ is discontinuous at $x=0$, inside the interval. Separate the domain into $[-1,0)$ and $(0,1]$; each part is improper at its open end, $0$:
$$\begin{aligned}I&=\int_{-1}^{0}\frac{dx}{\sqrt{-x}}+\int_0^{1}\frac{dx}{\sqrt x}\\[4pt]&=2+2=4\end{aligned}$$
The integral converges only if every part does: if one part diverges, so does $I$.
- **L'Hôpital's rule:** for a limit of the form $\frac{0}{0}$ or $\frac{\infty}{\infty}$,
$$\lim\frac{f(x)}{g(x)}=\lim\frac{f'(x)}{g'(x)}$$
with the top and the bottom differentiated separately, not by the quotient rule. If the new limit has the same form, use the rule again. The limits at the end of an improper integral often need it: $\frac{w}{e^w}$ is $\frac{\infty}{\infty}$, and $\lim_{w\to\infty}\frac{w}{e^w}=\lim_{w\to\infty}\frac{1}{e^w}=0$. A product $0\cdot\infty$ is first written as a fraction, as in Exercise (3):
$$\begin{aligned}\lim_{w\to+0}w\ln w&=\lim_{w\to+0}\frac{\ln w}{1/w}\\[4pt]&=\lim_{w\to+0}\frac{1/w}{-1/w^2}\\[4pt]&=\lim_{w\to+0}(-w)=0\end{aligned}$$
- **Inner product of functions:** on $[-\pi,\pi]$, two functions are multiplied and integrated, as the dot product of two vectors multiplies their components and adds:
$$\langle f|g\rangle=\int_{-\pi}^{\pi}f(x)\,g(x)\,dx$$
The inner product of $f$ with itself, $\int_{-\pi}^{\pi}f^2\,dx$, is positive for every $f$ other than $0$, like the square of a vector's length.
- **Orthogonal functions:** $f$ and $g$ are orthogonal when $\langle f|g\rangle=0$, as two vectors are perpendicular when their dot product is $0$.
- **The Fourier basis:** $S_m=\sin(mx)$ and $C_n=\cos(nx)$, for $m,n=1,2,3,\dots$, together with the constant $1$. On $[-\pi,\pi]$, any two different ones are orthogonal, and each sine or cosine has the inner product $\pi$ with itself ($\langle1|1\rangle=2\pi$):
$$\begin{gathered}\langle S_m|C_n\rangle=0\\[6pt]\langle S_m|S_n\rangle=\langle C_m|C_n\rangle=\begin{cases}0&(m\ne n)\\\pi&(m=n)\end{cases}\end{gathered}$$
Each one comes from product to sum, such as
$$\begin{aligned}&\sin mx\sin nx\\[2pt]&=\frac{1}{2}\{\cos(m-n)x-\cos(m+n)x\}\end{aligned}$$
and the integral of $\cos kx$ over $[-\pi,\pi]$ is $0$ for every whole number $k\ne0$, since $\sin k\pi=0$. For $m=n$, $\sin^2mx=\frac{1-\cos2mx}{2}$ gives $\langle S_m|S_m\rangle=\frac{2\pi}{2}=\pi$.
- **Class exercise (4):** check the orthogonality of $S_m$ and $C_n$ by the inner product. For $m\ne n$, product to sum gives
$$\begin{aligned}&\sin(mx)\cos(nx)\\[2pt]&=\frac{1}{2}\{\sin(m+n)x+\sin(m-n)x\}\end{aligned}$$
whose primitive is a sum of cosines, $-\frac{\cos(m+n)x}{2(m+n)}-\frac{\cos(m-n)x}{2(m-n)}$. Since $\cos$ is even, it takes the same value at $\pi$ and $-\pi$, so $\langle S_m|C_n\rangle=0$. For $m=n$, $\sin(mx)\cos(mx)=\frac{1}{2}\sin2mx$, whose integral over $[-\pi,\pi]$ is $0$ too. Every sine is orthogonal to every cosine.
- **Fourier series:** a function on $[-\pi,\pi]$ is written in the Fourier basis, as a vector is written with its components:
$$f(x)=\sum_{m=1}^{\infty}\{a_m\cos(mx)+b_m\sin(mx)\}$$
plus a constant term, the average of $f$ over $[-\pi,\pi]$, when $f$ has one.
- **The coefficients from inner products:** take the inner product of both sides with $C_m$. By orthogonality every term gives $0$ except $a_m\langle C_m|C_m\rangle=\pi a_m$, so $a_m=\frac{1}{\pi}\langle f|C_m\rangle$; with $S_m$ in the same way:
$$\begin{aligned}a_m&=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cos(mx)\,dx\\[4pt]b_m&=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin(mx)\,dx\end{aligned}$$
It is the way a vector's component along a basis vector comes from a dot product.
- **Reading coefficients off:** when $f$ is already made of sines and cosines, expand it with the addition formulas and read the coefficients off; every other coefficient is $0$. For example,
$$\sin\left(x+\frac{\pi}{4}\right)=\frac{\sqrt2}{2}\sin x+\frac{\sqrt2}{2}\cos x$$
so $a_1=b_1=\frac{\sqrt2}{2}$ and $a_m=b_m=0$ for $m\ge2$. The integrals for $a_m$ and $b_m$ give the same numbers.`,
    watch: R`
- Don't put $\infty$, or the point where $f$ diverges, into the primitive. Replace it with $w$, and take the limit as the last step.
- Look inside the interval before you use $F(b)-F(a)$. $\int_{-1}^{1}\frac{dx}{x^2}$ is not $\Big[-\frac{1}{x}\Big]_{-1}^{1}=-2$ (a positive function can't give a negative integral): $\frac{1}{x^2}$ diverges at $0$, and $\int_0^{1}\frac{dx}{x^2}=\infty$, so the integral diverges.
- $f(x)\to0$ is not enough: $\frac{1}{x}\to0$, yet $\int_1^{\infty}\frac{dx}{x}=\infty$.
- In $\int\frac{dx}{\sqrt{1-x}}=-2\sqrt{1-x}+C$, the power rule divides by the new exponent $\frac{1}{2}$ (so it multiplies by $2$), and the inside, $1-x$, brings the minus sign. Check a primitive by differentiating it.
- Every part of a split integral must converge on its own. One part that diverges makes the whole integral diverge, even if the other part is finite.
- L'Hôpital's rule is only for $\frac{0}{0}$ and $\frac{\infty}{\infty}$: $\lim_{x\to0}\frac{x+1}{x+2}=\frac{1}{2}$, not $\frac{1}{1}$. Check the form again before each use.
- A function is never orthogonal to itself: $\langle S_m|S_m\rangle=\langle C_m|C_m\rangle=\pi$, not $0$. Only two different members of the basis are orthogonal.
- Orthogonality depends on the interval. The integrals vanish on $[-\pi,\pi]$, but not on every interval: $\int_{-\pi/2}^{\pi/2}\sin x\sin2x\,dx=\frac{4}{3}$.
- $a_m$ goes with $\cos(mx)$ and $b_m$ with $\sin(mx)$. Divide by $\pi$, which is $\langle C_m|C_m\rangle$, not by $2\pi$.
- Mind the signs in the addition formulas: $\cos(A+B)=\cos A\cos B-\sin A\sin B$ and $\sin(A-B)=\sin A\cos B-\cos A\sin B$. A minus sign stays with its coefficient.
- A term that isn't in $f$ has the coefficient $0$. If $f$ has only $\cos x$ and $\sin x$, then $a_2=b_2=0$: that is an answer, not a mistake.`,
    tricksAdded: NOV20,
    tricks: R`
- **The power test:** near the problem point, compare $f$ with a power. At $\infty$, $\int_1^{\infty}\frac{dx}{x^p}$ converges only for $p>1$. Near a finite point $c$ where $f$ diverges, $\frac{1}{|x-c|^p}$ gives a finite integral only for $p<1$. And $p=1$ diverges both ways. $\frac{1}{\sqrt{1-x}}$ has $p=\frac{1}{2}<1$ at $x=1$, so it converges, while $\tan x$ behaves like $\frac{1}{\pi/2-x}$ near $\frac{\pi}{2}$, with $p=1$, so it diverges.
- **Limits worth knowing:** $e^{w}$ grows faster than every power, and every power faster than $\ln w$: for $p>0$, $\lim_{w\to\infty}w^pe^{-w}=0$, $\lim_{w\to\infty}\frac{\ln w}{w^p}=0$ and $\lim_{w\to+0}w^p\ln w=0$. Each one is L'Hôpital's rule, used once or a few times; on a quiz, still show the steps.
- **Symmetry:** an even integrand on $[-a,a]$ gives twice one half, $\int_{-1}^{1}\frac{dx}{\sqrt{|x|}}=2\int_0^1\frac{dx}{\sqrt x}=4$. Both halves must still converge: $\int_{-1}^{1}\frac{dx}{x^2}$ diverges, symmetric or not.
- **Odd and even:** $\sin(mx)$ is odd and $\cos(nx)$ is even, so $\sin(mx)\cos(nx)$ is odd and $\langle S_m|C_n\rangle=0$ at once: an odd function integrates to $0$ over $[-\pi,\pi]$. In the same way, an odd $f$, such as $x$ or $x^3$, has only sines (every $a_m=0$), and an even $f$, such as $x^2$, has only cosines (every $b_m=0$).`,
  },
];

export const habits = R`
- Write $\Delta x$ and $x_k$ first, then $f(x_k)$. Most mistakes happen in these two lines.
- Take constants out of every sum before you use a partial-sum formula, and remember $\sum_{k=1}^{n}c=cn$.
- Give $S_n$ as a formula in $n$, then take the limit.
- Check a primitive by differentiating it: $(-\cos x)'=\sin x$.
- In a definite integral, leave out the $C$, and work out $F(b)$ and $F(a)$ on separate lines before you subtract.
- When $f$ changes sign, find its zeros first: the integral and the area of the region are different answers.
- Before integrating a fraction, ask two things: is the top the derivative of the bottom, and does the bottom factor ($\Delta$)?
- After a substitution, write the new limits at once, on the line with $du$.
- For a volume, write $V=\pi\int_a^b f(x)^2\,dx$ first, then expand $f(x)^2$ completely before you integrate.
- For a length, simplify $1+f'(x)^2$ (look for a perfect square) before you take the root.
- For a parametric or polar length, write the two derivatives first, square and add them, then look for a perfect square, $\sin^2+\cos^2=1$ or a half-angle formula.
- Before any definite integral, check both ends and the inside of the interval for $\infty$ or a point where $f$ diverges. If there is one, replace it with $w$, integrate, and take the limit last; end with "converges" and the value, or "diverges".
- For a Fourier coefficient, expand $f$ first with the addition formulas or product to sum. If it is already a sum of sines and cosines, read $a_m$ (with $\cos$) and $b_m$ (with $\sin$) off; every other coefficient is $0$.
- Keep answers exact: $\frac{16}{3}$, $\frac{\pi}{4}$ or $\frac{e^2-1}{2}$, not decimals.`;

// ---------------- Practice ----------------
// ids are unit number.n (1.1, 1.2 …), kept in this page's own store, so they never meet Calculus midterm 1's marks.
// Four 2 & 3 Nov problems were removed when that lesson was shortened (6 Nov), so the ones after them keep their
// old ids in `id`: append new problems and never renumber.
export const practice = {
  u1: [
    { src: 'Estimate with n = 4', added: NOV2,
      stem: R`Estimate $\displaystyle\int_0^2 x^2\,dx$ with $n=4$ strips.`,
      parts: [R`Left endpoints`, R`Right endpoints`, R`Midpoints`],
      hint: R`$\Delta x=\frac{1}{2}$. List the points $0,\frac{1}{2},1,\frac{3}{2},2$ and their squares first.`,
      answer: [R`(1) $\frac{7}{4}$`, R`(2) $\frac{15}{4}$`, R`(3) $\frac{21}{8}$`],
      sol: R`
$\Delta x=\frac{2-0}{4}=\frac{1}{2}$. The points are $0,\frac{1}{2},1,\frac{3}{2},2$, where $x^2=0,\frac{1}{4},1,\frac{9}{4},4$.

**(1)** Left endpoints use every point but the last:
$$\frac{1}{2}\left(0+\frac{1}{4}+1+\frac{9}{4}\right)=\frac{1}{2}\cdot\frac{7}{2}=\frac{7}{4}$$

**(2)** Right endpoints use every point but the first:
$$\frac{1}{2}\left(\frac{1}{4}+1+\frac{9}{4}+4\right)=\frac{1}{2}\cdot\frac{15}{2}=\frac{15}{4}$$

**(3)** The midpoints are $\frac{1}{4},\frac{3}{4},\frac{5}{4},\frac{7}{4}$:
$$\frac{1}{2}\cdot\frac{1+9+25+49}{16}=\frac{1}{2}\cdot\frac{84}{16}=\frac{21}{8}$$

The exact area is $\frac{8}{3}\approx2.67$. Since $x^2$ is increasing, the left sum ($1.75$) is too small and the right sum ($3.75$) too large. The midpoint sum ($2.625$) is the closest.` },
    { src: 'A line, with a ≠ 0', added: NOV2,
      stem: R`Compute $\displaystyle\int_1^3(2x+1)\,dx$ as the limit of the Riemann sum with right endpoints.`,
      parts: [R`Find $S_n$ as a formula in $n$.`, R`Let $n\to\infty$.`],
      hint: R`$\Delta x=\frac{2}{n}$ and $x_k=1+\frac{2k}{n}$. Split the sum into a constant part and a part with $k$.`,
      answer: [R`(1) $S_n=10+\frac{4}{n}$`, R`(2) $10$`],
      sol: R`
$\Delta x=\frac{3-1}{n}=\frac{2}{n}$ and $x_k=1+\frac{2k}{n}$, so $f(x_k)=2\left(1+\frac{2k}{n}\right)+1=3+\frac{4k}{n}$.

**(1)** Multiply by $\Delta x$ and split the sum:
$$\begin{aligned}S_n&=\sum_{k=1}^{n}\left(3+\frac{4k}{n}\right)\frac{2}{n}\\&=\frac{6}{n}\sum_{k=1}^{n}1+\frac{8}{n^2}\sum_{k=1}^{n}k\end{aligned}$$

With $\sum 1=n$ and $\sum k=\frac{n(n+1)}{2}$:
$$S_n=6+\frac{4(n+1)}{n}=10+\frac{4}{n}$$

**(2)** $\frac{4}{n}\to0$, so the integral is $10$. Check: the region is a trapezoid with heights $f(1)=3$ and $f(3)=7$ and width $2$, so its area is $\frac{3+7}{2}\cdot2=10$.` },
    { src: 'Two partial sums at once', added: NOV2,
      stem: R`Compute $\displaystyle\int_0^1(x^2+x)\,dx$ as the limit of the Riemann sum with right endpoints.`,
      parts: [R`Find $S_n$.`, R`Let $n\to\infty$.`],
      hint: R`With $\Delta x=\frac{1}{n}$ and $x_k=\frac{k}{n}$, the sum splits into a part with $\sum k^2$ and a part with $\sum k$.`,
      answer: [R`(1) $S_n=\frac{(n+1)(2n+1)}{6n^2}+\frac{n+1}{2n}$`, R`(2) $\frac{5}{6}$`],
      sol: R`
$\Delta x=\frac{1}{n}$ and $x_k=\frac{k}{n}$, so $f(x_k)=\frac{k^2}{n^2}+\frac{k}{n}$.

**(1)** Multiply by $\frac{1}{n}$ and split:
$$\begin{aligned}S_n&=\frac{1}{n^3}\sum_{k=1}^{n}k^2+\frac{1}{n^2}\sum_{k=1}^{n}k\\&=\frac{(n+1)(2n+1)}{6n^2}+\frac{n+1}{2n}\end{aligned}$$

**(2)** Keep the highest powers of $n$: $\frac{2n^2}{6n^2}+\frac{n}{2n}=\frac{1}{3}+\frac{1}{2}=\frac{5}{6}$. Check: $F(x)=\frac{x^3}{3}+\frac{x^2}{2}$ gives $F(1)-F(0)=\frac{5}{6}$.` },
    { id: '1.7', src: 'Signed area', added: NOV2,
      stem: R`Let $f(x)=x-1$ on $[0,3]$.`,
      parts: [R`Use right endpoints to find $S_n$ and $\displaystyle\int_0^3(x-1)\,dx$.`, R`Find the area of the region between $y=x-1$ and the $x$-axis for $0\le x\le3$.`],
      hint: R`The line crosses the $x$-axis at $x=1$, so part of the region lies below the axis.`,
      answer: [R`(1) $S_n=\frac{3}{2}+\frac{9}{2n}$, and the integral is $\frac{3}{2}$`, R`(2) $\frac{5}{2}$`],
      sol: R`
**(1)** $\Delta x=\frac{3}{n}$ and $x_k=\frac{3k}{n}$, so $f(x_k)=\frac{3k}{n}-1$.

Multiply by $\frac{3}{n}$ and split:
$$\begin{aligned}S_n&=\frac{9}{n^2}\sum_{k=1}^{n}k-\frac{3}{n}\sum_{k=1}^{n}1\\&=\frac{9(n+1)}{2n}-3=\frac{3}{2}+\frac{9}{2n}\end{aligned}$$
So the integral is $\frac{3}{2}$.

**(2)** Split at $x=1$. From $0$ to $1$ the region is a triangle below the axis, with area $\frac{1}{2}\cdot1\cdot1=\frac{1}{2}$. From $1$ to $3$ it is a triangle above the axis, with area $\frac{1}{2}\cdot2\cdot2=2$.

The integral counts the lower part as negative: $2-\frac{1}{2}=\frac{3}{2}$. The area adds both parts as positive numbers: $2+\frac{1}{2}=\frac{5}{2}$.` },
    { id: '1.8', src: 'From a limit to an integral', added: NOV2,
      stem: R`Each limit is a Riemann sum with right endpoints. Write it as a definite integral and find its value.`,
      parts: [R`$\displaystyle\lim_{n\to\infty}\sum_{k=1}^{n}\left(\frac{k}{n}\right)^3\frac{1}{n}$`, R`$\displaystyle\lim_{n\to\infty}\sum_{k=1}^{n}\left(1+\frac{2k}{n}\right)^2\frac{2}{n}$`],
      hint: R`Find $\Delta x=\frac{b-a}{n}$ first, then read $a$ from $x_k=a+k\Delta x$.`,
      answer: [R`(1) $\displaystyle\int_0^1 x^3\,dx=\frac{1}{4}$`, R`(2) $\displaystyle\int_1^3 x^2\,dx=\frac{26}{3}$`],
      sol: R`
**(1)** $\Delta x=\frac{1}{n}$ and $x_k=\frac{k}{n}$, so $a=0$, $b=1$ and $f(x)=x^3$. With the primitive $\frac{x^4}{4}$, the value is $\frac{1}{4}-0=\frac{1}{4}$.

**(2)** $\Delta x=\frac{2}{n}$, so $b-a=2$. The sample point $x_k=1+\frac{2k}{n}$ starts from $a=1$, so $b=3$ and $f(x)=x^2$.

With the primitive $\frac{x^3}{3}$: $\frac{27}{3}-\frac{1}{3}=\frac{26}{3}$.

Reading (2) as $\int_0^2(1+x)^2\,dx$, with $x_k=\frac{2k}{n}$, is also right and gives the same value.` },
    { id: '1.9', src: 'Class example: x² + x − 2', added: NOV3,
      stem: R`Let $f(x)=x^2+x-2$ on $D=[0,2]$.`,
      parts: [R`Find the right-endpoint Riemann sum $S_n$.`, R`Find $\displaystyle\int_0^2 f(x)\,dx$.`,
              R`Find the area of the region between $y=f(x)$ and the $x$-axis for $0\le x\le2$.`],
      hint: R`$f(x)=(x+2)(x-1)$, so the curve crosses the axis at $x=1$. For (3), split there.`,
      answer: [R`(1) $S_n=\frac{2}{3}+\frac{6}{n}+\frac{4}{3n^2}$`, R`(2) $\frac{2}{3}$`, R`(3) $3$`],
      sol: R`
$\Delta x=\frac{2}{n}$ and $x_k=\frac{2k}{n}$, so $f(x_k)=\frac{4k^2}{n^2}+\frac{2k}{n}-2$.

**(1)** Multiply by $\frac{2}{n}$ and split into three sums:
$$\begin{aligned}S_n&=\frac{8}{n^3}\sum_{k=1}^{n}k^2+\frac{4}{n^2}\sum_{k=1}^{n}k\\&\quad-\frac{4}{n}\sum_{k=1}^{n}1\end{aligned}$$

The last sum is $n$, so that term is $-4$. With the partial sums:
$$\begin{aligned}S_n&=\frac{4(n+1)(2n+1)}{3n^2}+\frac{2(n+1)}{n}-4\\&=\frac{2}{3}+\frac{6}{n}+\frac{4}{3n^2}\end{aligned}$$

**(2)** $\frac{6}{n}$ and $\frac{4}{3n^2}$ tend to $0$, so the integral is $\frac{2}{3}$. Check: $F(x)=\frac{x^3}{3}+\frac{x^2}{2}-2x$ gives $F(2)-F(0)=\frac{8}{3}+2-4=\frac{2}{3}$.

**(3)** $f$ is negative on $[0,1)$ and positive on $(1,2]$. With the same $F$: $F(1)=\frac{1}{3}+\frac{1}{2}-2=-\frac{7}{6}$, so $\int_0^1 f\,dx=-\frac{7}{6}$ and $\int_1^2 f\,dx=\frac{2}{3}+\frac{7}{6}=\frac{11}{6}$.

The area adds both parts as positive numbers: $\frac{7}{6}+\frac{11}{6}=3$. The integral subtracts the part below the axis: $\frac{11}{6}-\frac{7}{6}=\frac{2}{3}$.` },
    { id: '1.11', src: 'Properties of the integral', added: NOV3,
      stem: R`Suppose $\displaystyle\int_0^2 f\,dx=5$, $\displaystyle\int_0^5 f\,dx=2$ and $\displaystyle\int_0^2 g\,dx=-1$. Find:`,
      parts: [R`$\displaystyle\int_2^5 f\,dx$`, R`$\displaystyle\int_5^2 f\,dx$`, R`$\displaystyle\int_0^2(3f-2g)\,dx$`, R`$\displaystyle\int_2^2 f\,dx$`],
      hint: R`$\int_0^2+\int_2^5=\int_0^5$, and swapping the limits changes the sign.`,
      answer: [R`(1) $-3$`, R`(2) $3$`, R`(3) $17$`, R`(4) $0$`],
      sol: R`
**(1)** Joining the intervals: $\int_0^2 f\,dx+\int_2^5 f\,dx=\int_0^5 f\,dx$, so $\int_2^5 f\,dx=2-5=-3$.

**(2)** Swapping the limits changes the sign: $\int_5^2 f\,dx=-(-3)=3$.

**(3)** Split the sum and take the constants out: $3\cdot5-2\cdot(-1)=15+2=17$.

**(4)** An interval of width $0$ gives $0$.` },
    { id: '1.12', src: 'An integral below zero', added: NOV3,
      stem: R`Let $f(x)=x^2-4$ on $[0,3]$.`,
      parts: [R`Where on $[0,3]$ is $f$ negative?`, R`Find $\displaystyle\int_0^3 f(x)\,dx$.`,
              R`Find the area of the region between $y=f(x)$ and the $x$-axis for $0\le x\le3$.`],
      hint: R`$x^2-4=(x-2)(x+2)$. The primitive $F(x)=\frac{x^3}{3}-4x$ gives every piece; for (3), split at the zero.`,
      answer: [R`(1) on $[0,2)$`, R`(2) $-3$`, R`(3) $\frac{23}{3}$`],
      sol: R`
**(1)** $f(x)=(x-2)(x+2)$ is $0$ at $x=2$, negative before it and positive after it.

**(2)** With $F(x)=\frac{x^3}{3}-4x$: $F(3)-F(0)=9-12=-3$. The integral is negative because more of the region lies below the axis than above it.

**(3)** Below the axis: $F(2)-F(0)=\frac{8}{3}-8=-\frac{16}{3}$, so that part has area $\frac{16}{3}$. Above it: $F(3)-F(2)=-3-\left(-\frac{16}{3}\right)=\frac{7}{3}$.

The area is $\frac{16}{3}+\frac{7}{3}=\frac{23}{3}$, while the integral is $\frac{7}{3}-\frac{16}{3}=-3$.` },
  ],
  u2: [
    { src: 'Ambiguity in the primitive', added: NOV6,
      stem: R`Let $f(x)=6x^2-2$.`,
      parts: [R`Check that $F(x)=2x^3-2x$ and $G(x)=2x^3-2x+7$ are both primitives of $f$.`, R`Find the primitive $H$ of $f$ with $H(1)=5$.`,
              R`Is $2x^3$ a primitive of $f$?`],
      hint: R`Differentiate. Every primitive is $2x^3-2x+C$, and the condition fixes $C$.`,
      answer: [R`(1) $F'(x)=G'(x)=6x^2-2$`, R`(2) $H(x)=2x^3-2x+5$`, R`(3) no: $(2x^3)'=6x^2$`],
      sol: R`
**(1)** $F'(x)=6x^2-2$, and the $+7$ in $G$ has derivative $0$, so $G'(x)=6x^2-2$ as well. Both are primitives of $f$.

**(2)** Every primitive is $2x^3-2x+C$. At $x=1$: $2-2+C=5$, so $C=5$ and $H(x)=2x^3-2x+5$.

**(3)** No. $(2x^3)'=6x^2$, which misses the $-2$: a primitive must give back all of $f$.` },
    { src: 'Powers and 1/x', added: NOV6,
      stem: R`Find the indefinite integrals.`,
      parts: [R`$\displaystyle\int(4x^3-6x^2+5)\,dx$`, R`$\displaystyle\int\left(\sqrt{x}+\frac{1}{x^2}\right)dx$`, R`$\displaystyle\int\frac{x^2+3}{x}\,dx$`],
      hint: R`Write $\sqrt{x}=x^{1/2}$ and $\frac{1}{x^2}=x^{-2}$. In (3), split the fraction first.`,
      answer: [R`(1) $x^4-2x^3+5x+C$`, R`(2) $\frac{2}{3}x^{3/2}-\frac{1}{x}+C$`, R`(3) $\frac{x^2}{2}+3\ln|x|+C$`],
      sol: R`
**(1)** Term by term: $4\cdot\frac{x^4}{4}-6\cdot\frac{x^3}{3}+5x+C=x^4-2x^3+5x+C$.

**(2)** $\int x^{1/2}\,dx=\frac{x^{3/2}}{3/2}=\frac{2}{3}x^{3/2}$ and $\int x^{-2}\,dx=\frac{x^{-1}}{-1}=-\frac{1}{x}$, so the answer is $\frac{2}{3}x^{3/2}-\frac{1}{x}+C$.

**(3)** $\frac{x^2+3}{x}=x+\frac{3}{x}$, so the answer is $\frac{x^2}{2}+3\ln|x|+C$.` },
    { src: 'Sine, cosine and e', added: NOV6,
      stem: R`Find the indefinite integrals.`,
      parts: [R`$\displaystyle\int(3\cos x+2\sin x)\,dx$`, R`$\displaystyle\int e^{-4x}\,dx$`, R`$\displaystyle\int\sin\frac{x}{2}\,dx$`, R`$\displaystyle\int\left(e^x+\frac{1}{\cos^2x}\right)dx$`],
      hint: R`$\int\sin x\,dx=-\cos x+C$. With a number inside, divide by it: in (3) it is $\frac{1}{2}$.`,
      answer: [R`(1) $3\sin x-2\cos x+C$`, R`(2) $-\frac{1}{4}e^{-4x}+C$`, R`(3) $-2\cos\frac{x}{2}+C$`, R`(4) $e^x+\tan x+C$`],
      sol: R`
**(1)** $3\sin x+2(-\cos x)+C=3\sin x-2\cos x+C$. Check: $(3\sin x-2\cos x)'=3\cos x+2\sin x$.

**(2)** Here $a=-4$: $\frac{1}{-4}e^{-4x}+C=-\frac{1}{4}e^{-4x}+C$.

**(3)** Here $a=\frac{1}{2}$, and dividing by $\frac{1}{2}$ doubles: $-\frac{1}{1/2}\cos\frac{x}{2}+C=-2\cos\frac{x}{2}+C$. Check: $\left(-2\cos\frac{x}{2}\right)'=2\sin\frac{x}{2}\cdot\frac{1}{2}=\sin\frac{x}{2}$.

**(4)** $e^x+\tan x+C$, since $(\tan x)'=\frac{1}{\cos^2x}$.` },
    { src: 'Exponentials with any base', added: NOV6,
      stem: R`Find the indefinite integrals.`,
      parts: [R`$\displaystyle\int 2^x\,dx$`, R`$\displaystyle\int 3^{2x}\,dx$`, R`$\displaystyle\int\frac{1}{5^x}\,dx$`],
      hint: R`$(b^x)'=b^x\ln b$, so the primitive divides by $\ln b$. In (3), write $\frac{1}{5^x}=5^{-x}$.`,
      answer: [R`(1) $\frac{2^x}{\ln2}+C$`, R`(2) $\frac{3^{2x}}{2\ln3}+C$`, R`(3) $-\frac{1}{5^x\ln5}+C$`],
      sol: R`
**(1)** $\int b^x\,dx=\frac{b^x}{\ln b}+C$ with $b=2$: $\frac{2^x}{\ln2}+C$.

**(2)** With $a=2$, divide by $a\ln b=2\ln3$: $\frac{3^{2x}}{2\ln3}+C$. Check: $\left(\frac{3^{2x}}{2\ln3}\right)'=\frac{3^{2x}\cdot2\ln3}{2\ln3}=3^{2x}$.

**(3)** $\frac{1}{5^x}=5^{-x}$, so $a=-1$: $\frac{5^{-x}}{-\ln5}+C=-\frac{1}{5^x\ln5}+C$. It is not $\ln|5^x|$: the rule for $\ln$ needs the variable itself in the denominator.` },
    { src: 'Logarithms: 1/(ax + b)', added: NOV6,
      stem: R`Find the indefinite integrals.`,
      parts: [R`$\displaystyle\int\frac{1}{3x+2}\,dx$`, R`$\displaystyle\int\frac{4}{1-2x}\,dx$`, R`$\displaystyle\int\frac{2x+1}{x^2+x-2}\,dx$`],
      hint: R`$\int\frac{1}{ax+b}\,dx=\frac{1}{a}\ln|ax+b|+C$. In (3), $x^2+x-2=(x-1)(x+2)$: split the fraction into two.`,
      answer: [R`(1) $\frac{1}{3}\ln|3x+2|+C$`, R`(2) $-2\ln|1-2x|+C$`, R`(3) $\ln|x^2+x-2|+C$`],
      sol: R`
**(1)** $a=3$: $\frac{1}{3}\ln|3x+2|+C$.

**(2)** $a=-2$: $4\cdot\frac{1}{-2}\ln|1-2x|+C=-2\ln|1-2x|+C$. Check: $(-2\ln|1-2x|)'=-2\cdot\frac{-2}{1-2x}=\frac{4}{1-2x}$.

**(3)** Write $\frac{2x+1}{(x-1)(x+2)}=\frac{A}{x-1}+\frac{B}{x+2}$, so $2x+1=A(x+2)+B(x-1)$. At $x=1$: $3=3A$, so $A=1$. At $x=-2$: $-3=-3B$, so $B=1$.

Then $\int\left(\frac{1}{x-1}+\frac{1}{x+2}\right)dx=\ln|x-1|+\ln|x+2|+C=\ln|x^2+x-2|+C$.

The top, $2x+1$, is the derivative of the bottom, which is why the answer is $\ln$ of the bottom.` },
    { src: 'Simplify first', added: NOV6,
      stem: R`Simplify each function, then find the indefinite integral.`,
      parts: [R`$\displaystyle\int\frac{1-e^{2x}}{1+e^x}\,dx$`, R`$\displaystyle\int\frac{(x+1)^2}{x}\,dx$`, R`$\displaystyle\int\frac{2^x+4^x}{2^x}\,dx$`],
      hint: R`(1) $1-e^{2x}=(1-e^x)(1+e^x)$. (2) Expand the top and divide each term by $x$. (3) $4^x=2^x\cdot2^x$.`,
      answer: [R`(1) $x-e^x+C$`, R`(2) $\frac{x^2}{2}+2x+\ln|x|+C$`, R`(3) $x+\frac{2^x}{\ln2}+C$`],
      sol: R`
**(1)** $1-e^{2x}=1^2-(e^x)^2=(1-e^x)(1+e^x)$, so the fraction is $1-e^x$ and the answer is $x-e^x+C$.

**(2)** $\frac{x^2+2x+1}{x}=x+2+\frac{1}{x}$, so the answer is $\frac{x^2}{2}+2x+\ln|x|+C$.

**(3)** $\frac{2^x+4^x}{2^x}=1+2^x$, so the answer is $x+\frac{2^x}{\ln2}+C$.` },
    { src: 'Definite integrals with F(b) − F(a)', added: NOV6,
      stem: R`Compute the definite integrals.`,
      parts: [R`$\displaystyle\int_1^2(3x^2-2x)\,dx$`, R`$\displaystyle\int_0^{\pi}\sin x\,dx$`, R`$\displaystyle\int_0^1 e^{2x}\,dx$`, R`$\displaystyle\int_1^{e}\frac{1}{x}\,dx$`],
      hint: R`Find a primitive, then work out $F(b)$ and $F(a)$ on separate lines. Leave out the $C$.`,
      answer: [R`(1) $4$`, R`(2) $2$`, R`(3) $\frac{e^2-1}{2}$`, R`(4) $1$`],
      sol: R`
**(1)** $F(x)=x^3-x^2$. $F(2)=8-4=4$ and $F(1)=1-1=0$, so the integral is $4$.

**(2)** $F(x)=-\cos x$. $F(\pi)=-\cos\pi=1$ and $F(0)=-\cos0=-1$, so the integral is $1-(-1)=2$.

**(3)** $F(x)=\frac{e^{2x}}{2}$. $F(1)-F(0)=\frac{e^2}{2}-\frac{1}{2}=\frac{e^2-1}{2}$.

**(4)** $F(x)=\ln x$ (here $x>0$). $\ln e-\ln1=1-0=1$.` },
    { src: 'Swapped limits and arctan', added: NOV6,
      stem: R`Compute the definite integrals.`,
      parts: [R`$\displaystyle\int_{\pi/2}^{0}\cos x\,dx$`, R`$\displaystyle\int_{-1}^{1}\frac{1}{1+x^2}\,dx$`, R`$\displaystyle\int_0^{\sqrt3}\frac{1}{1+x^2}\,dx$`],
      hint: R`(1) The upper limit is $0$: still $F(\text{upper})-F(\text{lower})$. (2) and (3): the primitive is $\arctan x$, and $\arctan(-1)=-\frac{\pi}{4}$.`,
      answer: [R`(1) $-1$`, R`(2) $\frac{\pi}{2}$`, R`(3) $\frac{\pi}{3}$`],
      sol: R`
**(1)** $F(x)=\sin x$: $F(0)-F\left(\frac{\pi}{2}\right)=0-1=-1$. It is minus $\int_0^{\pi/2}\cos x\,dx=1$, as swapping the limits says.

**(2)** $\arctan1-\arctan(-1)=\frac{\pi}{4}-\left(-\frac{\pi}{4}\right)=\frac{\pi}{2}$.

**(3)** $\tan\frac{\pi}{3}=\sqrt3$, so $\arctan\sqrt3-\arctan0=\frac{\pi}{3}$.` },
    { src: 'Area with a primitive', added: NOV6,
      stem: R`Let $f(x)=x^2-x-2$ on $[0,3]$.`,
      parts: [R`Find $\displaystyle\int_0^3 f(x)\,dx$.`, R`Find the area of the region between $y=f(x)$ and the $x$-axis for $0\le x\le3$.`],
      hint: R`$f(x)=(x-2)(x+1)$, so on $[0,3]$ it changes sign at $x=2$. Use $F(x)=\frac{x^3}{3}-\frac{x^2}{2}-2x$.`,
      answer: [R`(1) $-\frac{3}{2}$`, R`(2) $\frac{31}{6}$`],
      sol: R`
$F(x)=\frac{x^3}{3}-\frac{x^2}{2}-2x$. Work out each value on its own line:
$$\begin{aligned}F(0)&=0\\F(2)&=\frac{8}{3}-2-4=-\frac{10}{3}\\F(3)&=9-\frac{9}{2}-6=-\frac{3}{2}\end{aligned}$$

**(1)** $F(3)-F(0)=-\frac{3}{2}$.

**(2)** $f<0$ on $[0,2)$ and $f>0$ on $(2,3]$. Below the axis: $F(2)-F(0)=-\frac{10}{3}$, an area of $\frac{10}{3}$. Above it: $F(3)-F(2)=-\frac{3}{2}+\frac{10}{3}=\frac{11}{6}$.

The area is $\frac{10}{3}+\frac{11}{6}=\frac{31}{6}$, while the integral is $\frac{11}{6}-\frac{10}{3}=-\frac{3}{2}$.` },
    { src: 'Inverse trigonometric functions', added: NOV9,
      stem: R`Find the values and the definite integrals.`,
      parts: [R`$\arcsin\frac{\sqrt2}{2}$ and $\arcsin\left(-\frac{1}{2}\right)$`, R`$\displaystyle\int_0^{1/2}\frac{1}{\sqrt{1-x^2}}\,dx$`, R`$\displaystyle\int_{-1/2}^{\sqrt3/2}\frac{1}{\sqrt{1-x^2}}\,dx$`],
      hint: R`$\arcsin x$ is the angle between $-\frac{\pi}{2}$ and $\frac{\pi}{2}$ whose sine is $x$, and $\int\frac{dx}{\sqrt{1-x^2}}=\arcsin x+C$.`,
      answer: [R`(1) $\frac{\pi}{4}$ and $-\frac{\pi}{6}$`, R`(2) $\frac{\pi}{6}$`, R`(3) $\frac{\pi}{2}$`],
      sol: R`
**(1)** $\sin\frac{\pi}{4}=\frac{\sqrt2}{2}$, so $\arcsin\frac{\sqrt2}{2}=\frac{\pi}{4}$. And $\sin\left(-\frac{\pi}{6}\right)=-\frac{1}{2}$, so $\arcsin\left(-\frac{1}{2}\right)=-\frac{\pi}{6}$: arcsin of a negative number is a negative angle.

**(2)** $\Big[\arcsin x\Big]_0^{1/2}=\arcsin\frac{1}{2}-\arcsin0=\frac{\pi}{6}$.

**(3)** $\arcsin\frac{\sqrt3}{2}-\arcsin\left(-\frac{1}{2}\right)=\frac{\pi}{3}+\frac{\pi}{6}=\frac{\pi}{2}$.` },
    { src: 'Shortcut: symmetry and shapes', added: NOV10,
      stem: R`Use symmetry or a known shape; no primitive is needed.`,
      parts: [R`$\displaystyle\int_{-1}^{1}\frac{\sin x}{1+x^2}\,dx$`, R`$\displaystyle\int_{-1}^{1}(x^3+3x^2)\,dx$`, R`$\displaystyle\int_{-2}^{2}\sqrt{4-x^2}\,dx$`],
      hint: R`Is the function odd or even? And $y=\sqrt{4-x^2}$ is the top half of a circle.`,
      answer: [R`(1) $0$`, R`(2) $2$`, R`(3) $2\pi$`],
      sol: R`
**(1)** $\sin x$ is odd and $1+x^2$ is even, so $\frac{\sin x}{1+x^2}$ is odd, and its integral over $[-1,1]$ is $0$.

**(2)** Split: $x^3$ is odd, so it gives $0$; $3x^2$ is even, so it gives $2\int_0^13x^2\,dx=2\Big[x^3\Big]_0^1=2$.

**(3)** $y=\sqrt{4-x^2}$ is the top half of a circle of radius $2$, so the integral is $\frac{\pi\cdot2^2}{2}=2\pi$.` },
  ],
  u3: [
    { src: 'Class example: limits on the u-axis', added: NOV9,
      stem: R`Compute $\displaystyle\int_0^1e^{2x}\sqrt{1+e^{2x}}\,dx$ by substitution.`,
      parts: [],
      hint: R`Take $u=e^{2x}$, as in class: then $e^{2x}\,dx=\frac{du}{2}$, and the limits move to the $u$-axis.`,
      answer: [R`$\frac{(1+e^2)^{3/2}-2\sqrt2}{3}$`],
      sol: R`
$u=e^{2x}$ gives $du=2e^{2x}\,dx$, so $e^{2x}\,dx=\frac{du}{2}$. The limits: $x=0$ gives $u=1$, and $x=1$ gives $u=e^2$.
$$\int_0^1e^{2x}\sqrt{1+e^{2x}}\,dx=\frac{1}{2}\int_1^{e^2}\sqrt{1+u}\,du$$

A primitive of $\sqrt{1+u}=(1+u)^{1/2}$ is $\frac{2}{3}(1+u)^{3/2}$, so the integral is
$$\left[\frac{(1+u)^{3/2}}{3}\right]_1^{e^2}=\frac{(1+e^2)^{3/2}-2^{3/2}}{3}$$
and $2^{3/2}=(\sqrt2)^3=2\sqrt2$.

Taking $u=1+e^{2x}$ instead gives the limits $2$ and $1+e^2$, and the same value.` },
    { src: 'Exercise (1): two substitutions', added: NOV9,
      stem: R`Compute the definite integrals.`,
      parts: [R`$\displaystyle\int_1^2\frac{\ln x}{x}\,dx$`, R`$\displaystyle\int_0^1\frac{x+1}{x^2+1}\,dx$`],
      hint: R`(1) $u=\ln x$. (2) Split the fraction into $\frac{x}{x^2+1}+\frac{1}{x^2+1}$.`,
      answer: [R`(1) $\frac{(\ln2)^2}{2}$`, R`(2) $\frac{\ln2}{2}+\frac{\pi}{4}$`],
      sol: R`
**(1)** $u=\ln x$ gives $du=\frac{1}{x}\,dx$, and the limits become $\ln1=0$ and $\ln2$:
$$\begin{aligned}\int_1^2\frac{\ln x}{x}\,dx&=\int_0^{\ln2}u\,du\\[4pt]&=\left[\frac{u^2}{2}\right]_0^{\ln2}=\frac{(\ln2)^2}{2}\end{aligned}$$
Here $(\ln2)^2$ is the square of $\ln2$, not $\ln(2^2)$.

**(2)** Split: $\frac{x+1}{x^2+1}=\frac{x}{x^2+1}+\frac{1}{x^2+1}$.

For the first part, $u=x^2+1$ gives $x\,dx=\frac{du}{2}$ and the limits $1$ and $2$: $\frac{1}{2}\int_1^2\frac{du}{u}=\frac{1}{2}\Big[\ln u\Big]_1^2=\frac{\ln2}{2}$.

The second part is $\Big[\arctan x\Big]_0^1=\frac{\pi}{4}$, so the integral is $\frac{\ln2}{2}+\frac{\pi}{4}$.` },
    { src: 'Class example: a denominator that factors', added: NOV9,
      stem: R`Let $f(x)=\dfrac{1}{x^2+3x+2}$.`,
      parts: [R`Split $f(x)$ into partial fractions.`, R`Find $\displaystyle\int f(x)\,dx$.`, R`Compute $\displaystyle\int_0^1 f(x)\,dx$.`],
      hint: R`$x^2+3x+2=(x+1)(x+2)$. Write $1=A(x+2)+B(x+1)$ and put in $x=-1$ and $x=-2$.`,
      answer: [R`(1) $\frac{1}{x+1}-\frac{1}{x+2}$`, R`(2) $\ln\left|\frac{x+1}{x+2}\right|+C$`, R`(3) $\ln\frac{4}{3}$`],
      sol: R`
**(1)** $\frac{1}{(x+1)(x+2)}=\frac{A}{x+1}+\frac{B}{x+2}$ means $1=A(x+2)+B(x+1)$. At $x=-1$: $1=A$. At $x=-2$: $1=-B$, so $B=-1$.

**(2)** $\ln|x+1|-\ln|x+2|+C=\ln\left|\frac{x+1}{x+2}\right|+C$. Check: $\frac{1}{x+1}-\frac{1}{x+2}=\frac{(x+2)-(x+1)}{(x+1)(x+2)}=f(x)$.

**(3)** $\Big[\ln\frac{x+1}{x+2}\Big]_0^1=\ln\frac{2}{3}-\ln\frac{1}{2}=\ln\frac{4}{3}$.` },
    { src: 'Class example: a denominator that does not factor', added: NOV9,
      stem: R`Let $f(x)=\dfrac{1}{x^2+2x+5}$.`,
      parts: [R`Find $\displaystyle\int f(x)\,dx$.`, R`Compute $\displaystyle\int_{-1}^{1} f(x)\,dx$.`],
      hint: R`Make a quadratic term, $(x+1)^2+4$, factor out the $4$, and put $u=\frac{x+1}{2}$.`,
      answer: [R`(1) $\frac{1}{2}\arctan\frac{x+1}{2}+C$`, R`(2) $\frac{\pi}{8}$`],
      sol: R`
**(1)** $x^2+2x+5=(x+1)^2+4$. Factor out the $4$:
$$f(x)=\frac{1}{4}\cdot\frac{1}{\left(\frac{x+1}{2}\right)^2+1}$$

With $u=\frac{x+1}{2}$, $\frac{du}{dx}=\frac{1}{2}$, so $dx=2\,du$:
$$\begin{aligned}\int f(x)\,dx&=\frac{1}{4}\int\frac{2\,du}{u^2+1}\\[4pt]&=\frac{1}{2}\arctan u+C\\[4pt]&=\frac{1}{2}\arctan\frac{x+1}{2}+C\end{aligned}$$

**(2)** $x=-1$ gives $u=0$ and $x=1$ gives $u=1$: $\frac{1}{2}\left(\arctan1-\arctan0\right)=\frac{1}{2}\cdot\frac{\pi}{4}=\frac{\pi}{8}$.` },
    { src: 'Class example: x and √(x − 1)', added: NOV9,
      stem: R`Find $\displaystyle\int\frac{1}{x+2\sqrt{x-1}}\,dx$.`,
      parts: [],
      hint: R`Put $t=\sqrt{x-1}$. Then $x=t^2+1$, $dx=2t\,dt$, and the denominator is a perfect square.`,
      answer: [R`$2\ln\left(\sqrt{x-1}+1\right)+\frac{2}{\sqrt{x-1}+1}+C$`],
      sol: R`
$t=\sqrt{x-1}$ gives $t^2=x-1$, so $x=t^2+1$ and $dx=2t\,dt$.

The denominator is $x+2\sqrt{x-1}=t^2+1+2t=(t+1)^2$, so the integral is $\displaystyle\int\frac{2t}{(t+1)^2}\,dt$.

Write $t=(t+1)-1$: $\frac{2t}{(t+1)^2}=\frac{2}{t+1}-\frac{2}{(t+1)^2}$, whose primitive is $2\ln(t+1)+\frac{2}{t+1}$ (here $t+1>0$).

Put $t=\sqrt{x-1}$ back: $2\ln\left(\sqrt{x-1}+1\right)+\frac{2}{\sqrt{x-1}+1}+C$.` },
    { src: 'Class example: u = tan(x/2)', added: NOV9,
      stem: R`Find $\displaystyle\int\frac{1+\sin x}{1+\cos x}\,dx$ with $u=\tan\frac{x}{2}$.`,
      parts: [],
      hint: R`$\sin x=\frac{2u}{1+u^2}$, $\cos x=\frac{1-u^2}{1+u^2}$ and $dx=\frac{2\,du}{1+u^2}$.`,
      answer: [R`$\tan\frac{x}{2}+\ln\left(1+\tan^2\frac{x}{2}\right)+C$`],
      sol: R`
$1+\sin x=\frac{1+2u+u^2}{1+u^2}$ and $1+\cos x=\frac{2}{1+u^2}$, so $\frac{1+\sin x}{1+\cos x}=\frac{1+2u+u^2}{2}$.

With $dx=\frac{2\,du}{1+u^2}$:
$$\begin{aligned}&\int\frac{1+2u+u^2}{2}\cdot\frac{2\,du}{1+u^2}\\[4pt]&=\int\left(1+\frac{2u}{1+u^2}\right)du\end{aligned}$$

$2u$ is the derivative of $1+u^2$, so the primitive is $u+\ln(1+u^2)+C$.

With $u=\tan\frac{x}{2}$: $\tan\frac{x}{2}+\ln\left(1+\tan^2\frac{x}{2}\right)+C$.` },
    { src: 'Exercise (2)(1): a log and an arctan', added: NOV9,
      stem: R`Let $f(x)=\dfrac{2x}{x^2+2x+2}$ and $D=[-1,0]$.`,
      parts: [R`Find the primitive function of $f$.`, R`Compute $\displaystyle\int_D f(x)\,dx$.`],
      hint: R`Make a square, $(x+1)^2+1$, and put $u=x+1$, so the top $2x$ becomes $2u-2$.`,
      answer: [R`(1) $\ln(x^2+2x+2)-2\arctan(x+1)+C$`, R`(2) $\ln2-\frac{\pi}{2}$`],
      sol: R`
**(1)** $x^2+2x+2=(x+1)^2+1$. With $u=x+1$: $x=u-1$ and $dx=du$, so
$$\begin{aligned}\int f(x)\,dx&=\int\frac{2u-2}{u^2+1}\,du\\[4pt]&=\int\frac{2u}{u^2+1}\,du-2\int\frac{du}{u^2+1}\end{aligned}$$

$2u$ is the derivative of $u^2+1$, so this is $\ln(u^2+1)-2\arctan u+C$, that is $F(x)=\ln(x^2+2x+2)-2\arctan(x+1)+C$. No absolute value is needed, because $x^2+2x+2>0$.

**(2)** $F(0)=\ln2-2\arctan1=\ln2-\frac{\pi}{2}$ and $F(-1)=\ln1-2\arctan0=0$, so the integral is $\ln2-\frac{\pi}{2}$. It is negative because $f<0$ on $[-1,0)$.` },
    { src: 'Exercise (2)(2): x and √(x + 1)', added: NOV9,
      stem: R`Let $f(x)=\dfrac{1}{x\sqrt{x+1}}$ and $D=[1,3]$.`,
      parts: [R`Find the primitive function of $f$.`, R`Compute $\displaystyle\int_D f(x)\,dx$.`],
      hint: R`Put $t=\sqrt{x+1}$, so $x=t^2-1$ and $dx=2t\,dt$. Then split $\frac{2}{t^2-1}$ into partial fractions.`,
      answer: [R`(1) $\ln\left|\frac{\sqrt{x+1}-1}{\sqrt{x+1}+1}\right|+C$`, R`(2) $\ln\frac{3+2\sqrt2}{3}$`],
      sol: R`
**(1)** $t=\sqrt{x+1}$ gives $x=t^2-1$ and $dx=2t\,dt$, so
$$\frac{dx}{x\sqrt{x+1}}=\frac{2t\,dt}{(t^2-1)\,t}=\frac{2\,dt}{t^2-1}$$

Partial fractions: $\frac{2}{(t-1)(t+1)}=\frac{1}{t-1}-\frac{1}{t+1}$, so the primitive is $\ln|t-1|-\ln|t+1|=\ln\left|\frac{t-1}{t+1}\right|$, with $t=\sqrt{x+1}$.

**(2)** The limits: $x=1$ gives $t=\sqrt2$, and $x=3$ gives $t=2$.
$$\left[\ln\frac{t-1}{t+1}\right]_{\sqrt2}^{2}=\ln\frac{1}{3}-\ln\frac{\sqrt2-1}{\sqrt2+1}$$

Since $\frac{\sqrt2+1}{\sqrt2-1}=(\sqrt2+1)^2=3+2\sqrt2$, the integral is $\ln\frac{3+2\sqrt2}{3}$, which is also $2\ln(\sqrt2+1)-\ln3$.` },
    { src: 'Exercise (2)(3): u = tan(x/2) with limits', added: NOV9,
      stem: R`Let $f(x)=\dfrac{1}{1+\cos x}$ and $D=\left[0,\frac{\pi}{2}\right]$.`,
      parts: [R`Find the primitive function of $f$.`, R`Compute $\displaystyle\int_D f(x)\,dx$.`],
      hint: R`With $u=\tan\frac{x}{2}$, $1+\cos x=\frac{2}{1+u^2}$ and $dx=\frac{2\,du}{1+u^2}$.`,
      answer: [R`(1) $\tan\frac{x}{2}+C$`, R`(2) $1$`],
      sol: R`
**(1)** $\frac{dx}{1+\cos x}=\frac{1+u^2}{2}\cdot\frac{2\,du}{1+u^2}=du$, so the primitive is $u+C=\tan\frac{x}{2}+C$.

**(2)** The limits: $x=0$ gives $u=0$, and $x=\frac{\pi}{2}$ gives $u=\tan\frac{\pi}{4}=1$. The integral is $\int_0^1du=1$.` },
    { src: 'Class examples: integration by parts', added: NOV10,
      stem: R`Find the indefinite integrals by parts.`,
      parts: [R`$\displaystyle\int x\sin x\,dx$`, R`$\displaystyle\int\ln x\,dx$`],
      hint: R`(1) Differentiate $x$ and integrate $\sin x$. (2) Write $\ln x=1\cdot\ln x$: differentiate $\ln x$ and integrate $1$.`,
      answer: [R`(1) $-x\cos x+\sin x+C$`, R`(2) $x\ln x-x+C$`],
      sol: R`
**(1)** $f=x$ and $g'=\sin x$, so $f'=1$ and $g=-\cos x$:
$$\begin{aligned}&\int x\sin x\,dx\\[4pt]&=-x\cos x-\int(-\cos x)\,dx\\[4pt]&=-x\cos x+\sin x+C\end{aligned}$$

**(2)** $f=\ln x$ and $g'=1$, so $f'=\frac{1}{x}$ and $g=x$:
$$\begin{aligned}\int\ln x\,dx&=x\ln x-\int x\cdot\frac{1}{x}\,dx\\[4pt]&=x\ln x-x+C\end{aligned}$$

Check: $(x\ln x-x)'=\ln x+1-1=\ln x$.` },
    { src: 'Exercise: ln(x² + 1) by parts', added: NOV10,
      stem: R`Let $f(x)=\ln(x^2+1)$ and $D=[0,1]$.`,
      parts: [R`Find the primitive function of $f$.`, R`Compute $\displaystyle\int_D f(x)\,dx$.`],
      hint: R`Take $g'=1$ and differentiate $\ln(x^2+1)$. The fraction left over has the same degree on top and bottom: divide first.`,
      answer: [R`(1) $x\ln(x^2+1)-2x+2\arctan x+C$`, R`(2) $\ln2-2+\frac{\pi}{2}$`],
      sol: R`
**(1)** $f=\ln(x^2+1)$ and $g'=1$, so $f'=\frac{2x}{x^2+1}$ and $g=x$:
$$\begin{aligned}\int\ln(x^2+1)\,dx&=x\ln(x^2+1)\\[4pt]&\quad-\int\frac{2x^2}{x^2+1}\,dx\end{aligned}$$

Divide: $\frac{2x^2}{x^2+1}=2-\frac{2}{x^2+1}$, whose primitive is $2x-2\arctan x$. So $F(x)=x\ln(x^2+1)-2x+2\arctan x+C$.

**(2)** $F(1)=\ln2-2+2\cdot\frac{\pi}{4}=\ln2-2+\frac{\pi}{2}$ and $F(0)=0$, so the integral is $\ln2-2+\frac{\pi}{2}$.` },
    { src: 'Exercise: x²e^(2x), by parts twice', added: NOV10,
      stem: R`Let $f(x)=x^2e^{2x}$ and $D=[0,2]$.`,
      parts: [R`Find the primitive function of $f$.`, R`Compute $\displaystyle\int_D f(x)\,dx$.`],
      hint: R`Differentiate $x^2$ and integrate $e^{2x}$, whose primitive is $\frac{e^{2x}}{2}$. The leftover $\int xe^{2x}\,dx$ needs a second round.`,
      answer: [R`(1) $\frac{e^{2x}}{4}(2x^2-2x+1)+C$`, R`(2) $\frac{5e^4-1}{4}$`],
      sol: R`
**(1)** $f=x^2$ and $g'=e^{2x}$, so $f'=2x$ and $g=\frac{e^{2x}}{2}$:
$$\int x^2e^{2x}\,dx=\frac{x^2}{2}e^{2x}-\int xe^{2x}\,dx$$

Second round, with $f=x$ and $g'=e^{2x}$:
$$\begin{aligned}\int xe^{2x}\,dx&=\frac{x}{2}e^{2x}-\int\frac{e^{2x}}{2}\,dx\\[4pt]&=\frac{x}{2}e^{2x}-\frac{e^{2x}}{4}\end{aligned}$$

So $F(x)=\frac{x^2}{2}e^{2x}-\frac{x}{2}e^{2x}+\frac{e^{2x}}{4}+C=\frac{e^{2x}}{4}(2x^2-2x+1)+C$.

**(2)** $F(2)=\frac{e^4}{4}(8-4+1)=\frac{5e^4}{4}$ and $F(0)=\frac{1}{4}$, so the integral is $\frac{5e^4-1}{4}$.` },
    { src: 'Which method?', added: NOV10,
      stem: R`Name the method for each integral, then find it.`,
      parts: [R`$\displaystyle\int xe^{x^2}\,dx$`, R`$\displaystyle\int xe^{x}\,dx$`, R`$\displaystyle\int\frac{1}{x^2-1}\,dx$`, R`$\displaystyle\int\frac{1}{x^2+4x+5}\,dx$`,
              R`$\displaystyle\int\frac{\cos x}{1+\sin x}\,dx$`, R`$\displaystyle\int x\sqrt{x+1}\,dx$`],
      hint: R`Is the derivative of an inner function there? Is it a polynomial times $e^x$? For a fraction, look at the top and at $\Delta$ of the bottom.`,
      answer: [R`(1) substitution $u=x^2$: $\frac{1}{2}e^{x^2}+C$`, R`(2) by parts: $(x-1)e^x+C$`, R`(3) partial fractions: $\frac{1}{2}\ln\left|\frac{x-1}{x+1}\right|+C$`,
               R`(4) a square, then arctan: $\mathord{\arctan(x+2)+C}$`, R`(5) the log rule: $\ln(1+\sin x)+C$`, R`(6) $t=\sqrt{x+1}$: $\mathord{\frac{2}{5}(x+1)^{5/2}-\frac{2}{3}(x+1)^{3/2}+C}$`],
      sol: R`
**(1)** $u=x^2$ and $du=2x\,dx$: $\frac{1}{2}\int e^u\,du=\frac{1}{2}e^{x^2}+C$.

**(2)** No inner derivative here, but a polynomial times $e^x$. By parts with $f=x$ and $g'=e^x$: $xe^x-\int e^x\,dx=(x-1)e^x+C$.

**(3)** $\Delta=4>0$, so it factors: $x^2-1=(x-1)(x+1)$ and $\frac{1}{x^2-1}=\frac{1}{2}\left(\frac{1}{x-1}-\frac{1}{x+1}\right)$. The result is $\frac{1}{2}\ln\left|\frac{x-1}{x+1}\right|+C$.

**(4)** $\Delta=16-20<0$, so make a square: $x^2+4x+5=(x+2)^2+1$, and $u=x+2$ gives $\arctan(x+2)+C$.

**(5)** The top is the derivative of the bottom: $\ln(1+\sin x)+C$, with no absolute value since $1+\sin x\ge0$.

**(6)** $t=\sqrt{x+1}$: $x=t^2-1$ and $dx=2t\,dt$, so $\int(t^2-1)\,t\cdot2t\,dt=\int(2t^4-2t^2)\,dt=\frac{2}{5}t^5-\frac{2}{3}t^3+C$, with $t=\sqrt{x+1}$.` },
    { src: 'Shortcuts: guess, derivative on top, cover-up', added: NOV10,
      stem: R`Find the indefinite integrals with the shortcuts.`,
      parts: [R`$\displaystyle\int x^2(x^3+1)^4\,dx$ (guess and adjust)`, R`$\displaystyle\int\frac{x+2}{x^2+2x+2}\,dx$ (make the derivative appear)`, R`$\displaystyle\int\frac{3x+1}{(x+1)(x-3)}\,dx$ (cover-up)`],
      hint: R`(1) Guess $(x^3+1)^5$. (2) The derivative of the bottom is $2x+2$. (3) Put $x=-1$ and $x=3$ into what is left after covering each factor.`,
      answer: [R`(1) $\frac{(x^3+1)^5}{15}+C$`, R`(2) $\frac{1}{2}\ln(x^2+2x+2)+\arctan(x+1)+C$`, R`(3) $\frac{1}{2}\ln|x+1|+\frac{5}{2}\ln|x-3|+C$`],
      sol: R`
**(1)** The derivative of $(x^3+1)^5$ is $5(x^3+1)^4\cdot3x^2=15x^2(x^3+1)^4$, fifteen times too big, so the answer is $\frac{(x^3+1)^5}{15}+C$.

**(2)** $x+2=\frac{1}{2}(2x+2)+1$, so the integrand is $\frac{1}{2}\cdot\frac{2x+2}{x^2+2x+2}+\frac{1}{(x+1)^2+1}$, and the answer is $\frac{1}{2}\ln(x^2+2x+2)+\arctan(x+1)+C$.

**(3)** Cover $x+1$ and put $x=-1$: $\frac{-3+1}{-1-3}=\frac{1}{2}$. Cover $x-3$ and put $x=3$: $\frac{9+1}{3+1}=\frac{5}{2}$. So the integrand is $\frac{1/2}{x+1}+\frac{5/2}{x-3}$, and the answer is $\frac{1}{2}\ln|x+1|+\frac{5}{2}\ln|x-3|+C$.` },
    { src: 'Shortcuts: the DI table and the King’s rule', added: NOV10,
      stem: R`Use the DI table for (1) and (2), and the King's rule for (3).`,
      parts: [R`$\displaystyle\int x^3e^x\,dx$`, R`$\displaystyle\int x^2\sin2x\,dx$`, R`$\displaystyle\int_0^{\pi/2}\frac{\sqrt{\sin x}}{\sqrt{\sin x}+\sqrt{\cos x}}\,dx$`],
      hint: R`(1) and (2): differentiate the polynomial down to $0$, and mind the signs and the factors $\frac{1}{2}$ in the I column for $\sin2x$. (3) Replace $x$ by $\frac{\pi}{2}-x$ and add the two integrals.`,
      answer: [R`(1) $e^x(x^3-3x^2+6x-6)+C$`, R`(2) $-\frac{x^2}{2}\cos2x+\frac{x}{2}\sin2x+\frac{1}{4}\cos2x+C$`, R`(3) $\frac{\pi}{4}$`],
      sol: R`
**(1)** D: $x^3$, $3x^2$, $6x$, $6$, $0$. I: $e^x$ on every row. With the signs $+,-,+,-$: $x^3e^x-3x^2e^x+6xe^x-6e^x+C=e^x(x^3-3x^2+6x-6)+C$.

**(2)** D: $x^2$, $2x$, $2$, $0$. I: $\sin2x$, $-\frac{\cos2x}{2}$, $-\frac{\sin2x}{4}$, $\frac{\cos2x}{8}$. With the signs $+,-,+$:
$$\begin{aligned}&x^2\left(-\frac{\cos2x}{2}\right)-2x\left(-\frac{\sin2x}{4}\right)\\[4pt]&\quad+2\cdot\frac{\cos2x}{8}\\[4pt]&=-\frac{x^2}{2}\cos2x+\frac{x}{2}\sin2x\\[4pt]&\quad+\frac{1}{4}\cos2x+C\end{aligned}$$

**(3)** With $x\to\frac{\pi}{2}-x$, $\sin x$ and $\cos x$ swap, so the same integral $I$ has $\sqrt{\cos x}$ on top. Adding the two, the tops make the bottom: $2I=\int_0^{\pi/2}dx=\frac{\pi}{2}$, so $I=\frac{\pi}{4}$.` },
  ],
  u4: [
    { src: 'Area between two curves', added: NOV13,
      stem: R`Find the area of the region between the two curves.`,
      parts: [R`$y=2x$ and $y=x^2$`, R`$y=\cos x$ and $y=\sin x$ for $0\le x\le\frac{\pi}{4}$`],
      hint: R`Solve $f(x)=g(x)$ for the limits, check which curve is on top, then integrate top minus bottom.`,
      answer: [R`(1) $\frac{4}{3}$`, R`(2) $\sqrt2-1$`],
      sol: R`
**(1)** The curves meet where $x^2=2x$, at $x=0$ and $x=2$. Between them $2x\ge x^2$ (at $x=1$: $2>1$), so
$$\begin{aligned}A&=\int_0^2(2x-x^2)\,dx=\left[x^2-\frac{x^3}{3}\right]_0^2\\[4pt]&=4-\frac{8}{3}=\frac{4}{3}\end{aligned}$$

**(2)** On $\left[0,\frac{\pi}{4}\right]$, $\cos x\ge\sin x$; they meet at $x=\frac{\pi}{4}$. So
$$\begin{aligned}A&=\int_0^{\pi/4}(\cos x-\sin x)\,dx\\[4pt]&=\Big[\sin x+\cos x\Big]_0^{\pi/4}\end{aligned}$$
which is $\left(\frac{\sqrt2}{2}+\frac{\sqrt2}{2}\right)-(0+1)=\sqrt2-1$.` },
    { src: 'Volumes from slices', added: NOV13,
      stem: R`Find each volume as $\displaystyle\int S(x)\,dx$, where $S(x)$ is the area of the slice at $x$.`,
      parts: [R`A cone of radius $3$ and height $4$`, R`A sphere of radius $2$`, R`A solid on $0\le x\le2$ whose slice at $x$ is a square of side $x$`],
      hint: R`(1) With the tip at $x=0$, the radius at $x$ is $\frac{3x}{4}$. (2) The slice at $x$ is a circle of radius $\sqrt{4-x^2}$. (3) $S(x)=x^2$.`,
      answer: [R`(1) $12\pi$`, R`(2) $\frac{32\pi}{3}$`, R`(3) $\frac{8}{3}$`],
      sol: R`
**(1)** With the tip at $x=0$, the slice at $x$ is a circle of radius $\frac{3x}{4}$:
$$V=\int_0^4\pi\frac{9x^2}{16}\,dx=\frac{9\pi}{16}\cdot\frac{64}{3}=12\pi$$
the same as $\frac{1}{3}\pi r^2h=\frac{1}{3}\pi\cdot9\cdot4$.

**(2)** The slice at $x$, for $-2\le x\le2$, is a circle of radius $\sqrt{4-x^2}$:
$$\begin{aligned}V&=\pi\int_{-2}^{2}(4-x^2)\,dx\\[4pt]&=\pi\left(16-\frac{16}{3}\right)=\frac{32\pi}{3}\end{aligned}$$
Check: $\frac{4}{3}\pi\cdot2^3=\frac{32\pi}{3}$.

**(3)** $S(x)=x^2$, so $V=\int_0^2x^2\,dx=\frac{8}{3}$. The solid is a pyramid with a $2\times2$ base and height $2$, and $\frac{1}{3}\cdot4\cdot2=\frac{8}{3}$ as well.` },
    { src: 'Class exercise (1): solids of revolution', added: NOV13,
      stem: R`Calculate the volume of the solid of revolution generated by $f(x)$ within $D$.`,
      parts: [R`$f(x)=\frac{1}{\cos x}$;  $D:\ \left[\frac{\pi}{6},\frac{\pi}{3}\right]$`, R`$f(x)=\sqrt{x}\,e^{-x^2/2}$;  $D:\ \left[0,\frac{1}{2}\right]$`],
      hint: R`Square $f$ first. (1) $\frac{1}{\cos^2x}$ has the primitive $\tan x$. (2) $f(x)^2=xe^{-x^2}$: put $u=-x^2$ and move the limits to $u$.`,
      answer: [R`(1) $\frac{2\sqrt3}{3}\pi$`, R`(2) $\frac{\pi}{2}\left(1-e^{-1/4}\right)$`],
      sol: R`
**(1)** $f(x)^2=\frac{1}{\cos^2x}$, whose primitive is $\tan x$:
$$\begin{aligned}V&=\pi\Big[\tan x\Big]_{\pi/6}^{\pi/3}\\[4pt]&=\pi\left(\sqrt3-\frac{\sqrt3}{3}\right)=\frac{2\sqrt3}{3}\pi\end{aligned}$$
Upper limit minus lower limit: the other order gives a negative number, which can't be a volume.

**(2)** $f(x)^2=xe^{-x^2}$. With $u=-x^2$: $du=-2x\,dx$, so $x\,dx=-\frac{du}{2}$. The limits: $x=0$ gives $u=0$, and $x=\frac{1}{2}$ gives $u=-\frac{1}{4}$.
$$\begin{aligned}V&=\pi\int_0^{-1/4}e^u\left(-\frac{du}{2}\right)\\[4pt]&=\frac{\pi}{2}\int_{-1/4}^{0}e^u\,du=\frac{\pi}{2}\left(1-e^{-1/4}\right)\end{aligned}$$
Once everything is in $u$, $\int e^u\,du=e^u$, with nothing to divide by.` },
    { src: 'Solids of revolution with a hole', added: NOV13,
      stem: R`Turn each region around the $x$-axis and find the volume of the solid.`,
      parts: [R`The region between $y=x$ and $y=x^2$`, R`The region between $y=2$ and $y=x^2+1$`],
      hint: R`Find where the curves meet. The upper curve is the outer radius and the lower one the inner radius; square each radius on its own.`,
      answer: [R`(1) $\frac{2\pi}{15}$`, R`(2) $\frac{64\pi}{15}$`],
      sol: R`
**(1)** The curves meet at $x=0$ and $x=1$, with $x\ge x^2$ between them. Outer radius $x$, inner radius $x^2$:
$$\begin{aligned}V&=\pi\int_0^1(x^2-x^4)\,dx\\[4pt]&=\pi\left(\frac{1}{3}-\frac{1}{5}\right)=\frac{2\pi}{15}\end{aligned}$$

**(2)** $x^2+1=2$ at $x=\pm1$, and $2\ge x^2+1$ between. Outer radius $2$, inner radius $x^2+1$:
$$\begin{aligned}V&=\pi\int_{-1}^{1}\big(4-(x^2+1)^2\big)\,dx\\[4pt]&=\pi\int_{-1}^{1}(3-2x^2-x^4)\,dx\end{aligned}$$
which is $\pi\left(6-\frac{4}{3}-\frac{2}{5}\right)=\frac{64\pi}{15}$.

Squaring the difference instead, $\pi\int_{-1}^{1}\big(2-(x^2+1)\big)^2\,dx=\frac{16\pi}{15}$, gives the volume of a different solid.` },
    { src: 'Two types of averages', added: NOV13,
      stem: R`Find the averages.`,
      parts: [R`The average of $f(x)=\sin x$ in $0\le x\le\pi$`, R`The average of $f(x)=x^2$ in $0\le x\le3$`,
              R`The average of $x$ with the probability $\frac{f(x)}{P}$, for $f(x)=x^2$ in $0\le x\le1$`, R`The average of $x$ with the probability $\frac{f(x)}{P}$, for $f(x)=e^{-x}$ in $0\le x\le1$`],
      hint: R`(1) and (2): divide the integral by the width $b-a$. (3) and (4): $\bar x=\frac{\int x\,f(x)\,dx}{\int f(x)\,dx}$; in (4), $\int xe^{-x}\,dx$ needs integration by parts.`,
      answer: [R`(1) $\frac{2}{\pi}$`, R`(2) $3$`, R`(3) $\frac{3}{4}$`, R`(4) $\frac{e-2}{e-1}$`],
      sol: R`
**(1)** $\frac{1}{\pi}\int_0^{\pi}\sin x\,dx=\frac{1}{\pi}\Big[-\cos x\Big]_0^{\pi}=\frac{2}{\pi}$, about $0.64$: between the smallest value $0$ and the largest $1$.

**(2)** $\frac{1}{3}\int_0^3x^2\,dx=\frac{1}{3}\cdot9=3$. The curve reaches the height $3$ at $x=\sqrt3$.

**(3)** $P=\int_0^1x^2\,dx=\frac{1}{3}$ and $\int_0^1x\cdot x^2\,dx=\frac{1}{4}$, so $\bar x=\frac{1/4}{1/3}=\frac{3}{4}$. The weight $x^2$ grows with $x$, so the average lies right of the middle.

**(4)** $P=\int_0^1e^{-x}\,dx=1-e^{-1}$. By parts, $\int xe^{-x}\,dx=-xe^{-x}-e^{-x}+C$, so $\int_0^1xe^{-x}\,dx=-2e^{-1}-(-1)=1-2e^{-1}$.

Then $\bar x=\frac{1-2e^{-1}}{1-e^{-1}}=\frac{e-2}{e-1}$ (multiply the top and the bottom by $e$), about $0.42$: left of the middle, since $e^{-x}$ gives the small values of $x$ more weight.` },
    { src: 'Length of a curve', added: NOV13,
      stem: R`Find the length of each curve.`,
      parts: [R`$y=\frac{2}{3}x^{3/2}$ on $[0,3]$`, R`$y=x^{3/2}$ on $\left[0,\frac{4}{3}\right]$`, R`$y=\frac{e^x+e^{-x}}{2}$ on $[0,1]$`],
      hint: R`Find $f'$, square it, add $1$ and simplify before you take the root. In (3), $1+f'(x)^2$ is a perfect square.`,
      answer: [R`(1) $\frac{14}{3}$`, R`(2) $\frac{56}{27}$`, R`(3) $\frac{e-e^{-1}}{2}$`],
      sol: R`
**(1)** $f'=\sqrt x$, so $1+f'^2=1+x$:
$$\begin{aligned}\ell&=\int_0^3\sqrt{1+x}\,dx=\frac{2}{3}\Big[(1+x)^{3/2}\Big]_0^3\\[4pt]&=\frac{2}{3}(8-1)=\frac{14}{3}\end{aligned}$$

**(2)** $f'=\frac{3}{2}\sqrt x$, so $1+f'^2=1+\frac{9x}{4}$. Divide by the number inside, $\frac{9}{4}$:
$$\begin{aligned}\ell&=\int_0^{4/3}\sqrt{1+\tfrac{9x}{4}}\,dx\\[4pt]&=\frac{8}{27}\Big[\left(1+\tfrac{9x}{4}\right)^{3/2}\Big]_0^{4/3}\\[4pt]&=\frac{8}{27}(8-1)=\frac{56}{27}\end{aligned}$$

**(3)** $f'=\frac{e^x-e^{-x}}{2}$, and
$$\begin{aligned}1+f'^2&=\frac{e^{2x}+2+e^{-2x}}{4}\\[4pt]&=\left(\frac{e^x+e^{-x}}{2}\right)^2\end{aligned}$$
so $\ell=\int_0^1\frac{e^x+e^{-x}}{2}\,dx=\Big[\frac{e^x-e^{-x}}{2}\Big]_0^1=\frac{e-e^{-1}}{2}$.` },
    { src: 'Length: a perfect square under the root', added: NOV13,
      stem: R`Find the length of each curve. In both, $1+f'(x)^2$ is a perfect square.`,
      parts: [R`$y=\frac{x^2}{2}-\frac{\ln x}{4}$ on $[1,e]$`, R`$y=\frac{x^3}{6}+\frac{1}{2x}$ on $[1,2]$`],
      hint: R`(1) $f'=x-\frac{1}{4x}$. (2) $f'=\frac{x^2}{2}-\frac{1}{2x^2}$. In both, the middle term of $f'^2$ is $-\frac{1}{2}$, and adding $1$ turns it into $+\frac{1}{2}$.`,
      answer: [R`(1) $\frac{2e^2-1}{4}$`, R`(2) $\frac{17}{12}$`],
      sol: R`
**(1)** $f'=x-\frac{1}{4x}$, so $f'^2=x^2-\frac{1}{2}+\frac{1}{16x^2}$ and
$$1+f'^2=x^2+\frac{1}{2}+\frac{1}{16x^2}=\left(x+\frac{1}{4x}\right)^2$$

Then
$$\begin{aligned}\ell&=\int_1^e\left(x+\frac{1}{4x}\right)dx=\left[\frac{x^2}{2}+\frac{\ln x}{4}\right]_1^e\\[4pt]&=\frac{e^2}{2}+\frac{1}{4}-\frac{1}{2}=\frac{2e^2-1}{4}\end{aligned}$$

**(2)** $f'=\frac{x^2}{2}-\frac{1}{2x^2}$, so $1+f'^2=\frac{x^4}{4}+\frac{1}{2}+\frac{1}{4x^4}=\left(\frac{x^2}{2}+\frac{1}{2x^2}\right)^2$ and
$$\ell=\int_1^2\left(\frac{x^2}{2}+\frac{1}{2x^2}\right)dx=\left[\frac{x^3}{6}-\frac{1}{2x}\right]_1^2$$
which is $\left(\frac{4}{3}-\frac{1}{4}\right)-\left(\frac{1}{6}-\frac{1}{2}\right)=\frac{17}{12}$.` },
    { src: 'Length of a circular arc', added: NOV13,
      stem: R`Use the length formula on the circle $y=\sqrt{r^2-x^2}$.`,
      parts: [R`Show that $\sqrt{1+f'(x)^2}=\frac{r}{\sqrt{r^2-x^2}}$.`, R`Find the length of the arc of $y=\sqrt{4-x^2}$ from $x=0$ to $x=1$.`, R`Find the length of the quarter circle from $x=0$ to $x=r$.`],
      hint: R`$f'(x)=-\frac{x}{\sqrt{r^2-x^2}}$. For the integral, put $u=\frac{x}{r}$: it becomes $\int\frac{r\,du}{\sqrt{1-u^2}}$.`,
      answer: [R`(1) $1+f'(x)^2=\frac{r^2}{r^2-x^2}$`, R`(2) $\frac{\pi}{3}$`, R`(3) $\frac{\pi r}{2}$`],
      sol: R`
**(1)** $f'(x)=\frac{-2x}{2\sqrt{r^2-x^2}}=-\frac{x}{\sqrt{r^2-x^2}}$, so $1+f'(x)^2=\frac{r^2-x^2+x^2}{r^2-x^2}=\frac{r^2}{r^2-x^2}$, whose root is $\frac{r}{\sqrt{r^2-x^2}}$.

**(2)** Here $r=2$. With $u=\frac{x}{2}$ and $dx=2\,du$, the limits become $0$ and $\frac{1}{2}$:
$$\begin{aligned}\int_0^1\frac{2\,dx}{\sqrt{4-x^2}}&=2\int_0^{1/2}\frac{du}{\sqrt{1-u^2}}\\[4pt]&=2\arcsin\frac{1}{2}=\frac{\pi}{3}\end{aligned}$$
It is $r\theta$ with $r=2$ and $\theta=\frac{\pi}{6}$, the angle between the radii to $(0,2)$ and $(1,\sqrt3)$.

**(3)** $r\Big[\arcsin\frac{x}{r}\Big]_0^r=r\cdot\frac{\pi}{2}=\frac{\pi r}{2}$, a quarter of $2\pi r$.` },
    { src: 'Powers of cos and sin: the reduction formula', added: NOV13,
      stem: R`Use $C_n=\frac{1}{n}\cos^{n-1}x\sin x+\frac{n-1}{n}C_{n-2}$ and the matching formula for $\sin^nx$.`,
      parts: [R`$\displaystyle\int\cos^2x\,dx$`, R`$\displaystyle\int\sin^3x\,dx$`, R`$\displaystyle\int_0^{\pi/2}\cos^4x\,dx$`, R`$\displaystyle\int_0^{\pi/2}\sin^5x\,dx$`],
      hint: R`Lower the power by $2$ until you reach $C_0=x$ or $S_1=-\cos x$. On $\left[0,\frac{\pi}{2}\right]$, $I_n=\frac{n-1}{n}I_{n-2}$ with $I_0=\frac{\pi}{2}$ and $I_1=1$.`,
      answer: [R`(1) $\frac{1}{2}\sin x\cos x+\frac{x}{2}+C$`, R`(2) $-\frac{1}{3}\sin^2x\cos x-\frac{2}{3}\cos x+C$`, R`(3) $\frac{3\pi}{16}$`, R`(4) $\frac{8}{15}$`],
      sol: R`
**(1)** $n=2$: $C_2=\frac{1}{2}\cos x\sin x+\frac{1}{2}C_0$, and $C_0=\int1\,dx=x$. So $\int\cos^2x\,dx=\frac{1}{2}\sin x\cos x+\frac{x}{2}+C$. The half-angle formula, $\cos^2x=\frac{1+\cos2x}{2}$, gives $\frac{x}{2}+\frac{\sin2x}{4}+C$, the same, because $\sin2x=2\sin x\cos x$.

**(2)** $n=3$: $S_3=-\frac{1}{3}\sin^2x\cos x+\frac{2}{3}S_1$, and $S_1=-\cos x$. So $\int\sin^3x\,dx=-\frac{1}{3}\sin^2x\cos x-\frac{2}{3}\cos x+C$.

**(3)** $I_4=\frac{3}{4}I_2=\frac{3}{4}\cdot\frac{1}{2}I_0=\frac{3}{4}\cdot\frac{1}{2}\cdot\frac{\pi}{2}=\frac{3\pi}{16}$.

**(4)** $I_5=\frac{4}{5}I_3=\frac{4}{5}\cdot\frac{2}{3}I_1=\frac{8}{15}$. An odd power ends at $I_1=1$, so there is no $\pi$.` },
    { src: 'Products of sines and cosines', added: NOV13,
      stem: R`Compute the integrals. Turn each product into a sum first.`,
      parts: [R`$\displaystyle\int_0^{\pi}\sin2x\sin3x\,dx$`, R`$\displaystyle\int_0^{\pi}\sin^22x\,dx$`, R`$\displaystyle\int_{-\pi/2}^{\pi/2}\cos2x\cos3x\,dx$`],
      hint: R`$\sin A\sin B=\frac{1}{2}\big(\cos(A-B)-\cos(A+B)\big)$ and $\cos A\cos B=\frac{1}{2}\big(\cos(A-B)+\cos(A+B)\big)$. In (2) the two factors are the same: use $\sin^2\theta=\frac{1-\cos2\theta}{2}$.`,
      answer: [R`(1) $0$`, R`(2) $\frac{\pi}{2}$`, R`(3) $\frac{6}{5}$`],
      sol: R`
**(1)** $\sin2x\sin3x=\frac{1}{2}(\cos x-\cos5x)$, so the integral is $\frac{1}{2}\Big[\sin x-\frac{\sin5x}{5}\Big]_0^{\pi}=0$, since $\sin k\pi=0$.

**(2)** $\sin^22x=\frac{1-\cos4x}{2}$, so the integral is $\Big[\frac{x}{2}-\frac{\sin4x}{8}\Big]_0^{\pi}=\frac{\pi}{2}$. With $m=n$ the product is a square, and its integral is not $0$.

**(3)** $\cos2x\cos3x=\frac{1}{2}(\cos x+\cos5x)$, so the integral is $\frac{1}{2}\Big[\sin x+\frac{\sin5x}{5}\Big]_{-\pi/2}^{\pi/2}$. Both sines are odd, so this is $\sin\frac{\pi}{2}+\frac{1}{5}\sin\frac{5\pi}{2}=1+\frac{1}{5}=\frac{6}{5}$: not $0$ on this interval.` },
    { src: 'Shortcut: the reduction formula in one line', added: NOV13,
      stem: R`Use the shortcuts; no reduction steps are needed.`,
      parts: [R`$\displaystyle\int_0^{\pi/2}\sin^6x\,dx$`, R`$\displaystyle\int_0^{\pi/2}\cos^7x\,dx$`, R`$\displaystyle\int_0^{\pi}\sin^2x\,dx$`],
      hint: R`Multiply $\frac{n-1}{n}\cdot\frac{n-3}{n-2}\cdots$; an even power ends with $\frac{1}{2}\cdot\frac{\pi}{2}$, an odd one with $\frac{2}{3}$. For (3), $\sin^2x$ and $\cos^2x$ add up to $1$.`,
      answer: [R`(1) $\frac{5\pi}{32}$`, R`(2) $\frac{16}{35}$`, R`(3) $\frac{\pi}{2}$`],
      sol: R`
**(1)** An even power: $\frac{5\cdot3\cdot1}{6\cdot4\cdot2}\cdot\frac{\pi}{2}=\frac{15}{48}\cdot\frac{\pi}{2}=\frac{5\pi}{32}$.

**(2)** An odd power: $\frac{6\cdot4\cdot2}{7\cdot5\cdot3}=\frac{48}{105}=\frac{16}{35}$.

**(3)** On $\left[0,\frac{\pi}{2}\right]$, $\sin^2x$ and $\cos^2x$ have the same integral and add up to $1$, so each gives $\frac{\pi}{4}$. Since $\sin(\pi-x)=\sin x$, the half from $\frac{\pi}{2}$ to $\pi$ gives the same again: $\frac{\pi}{4}+\frac{\pi}{4}=\frac{\pi}{2}$.` },
  ],
  u5: [
    { src: 'Class example: parametrization', added: NOV17,
      stem: R`Describe the curves with a parameter, or without one.`,
      parts: [R`Write $y=\sqrt x$, $1\le x\le4$, with $x=t^2$: find $y$ and the range of $t$.`, R`Check that both forms give the same area under the curve: $\displaystyle\int_1^4\sqrt x\,dx$ and $\displaystyle\int y\,\frac{dx}{dt}\,dt$.`,
              R`Eliminate $t$ from $x=2\cos t$, $y=2\sin t$.`],
      hint: R`(1) $\sqrt{t^2}=t$ for $t>0$; put $x=1$ and $x=4$ into $x=t^2$. (2) $dx=2t\,dt$. (3) $\cos^2t+\sin^2t=1$.`,
      answer: [R`(1) $y=t$, with $1\le t\le2$`, R`(2) both give $\frac{14}{3}$`, R`(3) $x^2+y^2=4$, the circle of radius $2$`],
      sol: R`
**(1)** $y=\sqrt{t^2}=t$, since $t>0$ here. $x=1$ gives $t=1$, and $x=4$ gives $t=2$.

**(2)** Directly: $\int_1^4\sqrt x\,dx=\frac{2}{3}\Big[x^{3/2}\Big]_1^4=\frac{2}{3}(8-1)=\frac{14}{3}$. With $t$: $\frac{dx}{dt}=2t$, so $\int_1^2t\cdot2t\,dt=\frac{2}{3}\Big[t^3\Big]_1^2=\frac{14}{3}$.

**(3)** $\cos t=\frac{x}{2}$ and $\sin t=\frac{y}{2}$, so $\cos^2t+\sin^2t=1$ gives $\frac{x^2}{4}+\frac{y^2}{4}=1$, that is $x^2+y^2=4$.` },
    { src: 'Polar and Cartesian coordinates', added: NOV17,
      stem: R`Convert between polar and Cartesian coordinates.`,
      parts: [R`The point $(x,y)=(1,1)$ in polar coordinates`, R`The point $r=2$, $\theta=\frac{2\pi}{3}$ in Cartesian coordinates`, R`The curve $r=2\cos\theta$ as an equation in $x$ and $y$`],
      hint: R`$x=r\cos\theta$, $y=r\sin\theta$ and $r^2=x^2+y^2$. In (3), multiply both sides by $r$ first.`,
      answer: [R`(1) $r=\sqrt2$, $\theta=\frac{\pi}{4}$`, R`(2) $\left(-1,\sqrt3\right)$`, R`(3) $(x-1)^2+y^2=1$`],
      sol: R`
**(1)** $r=\sqrt{1+1}=\sqrt2$, and $\tan\theta=1$ with the point in the first quadrant, so $\theta=\frac{\pi}{4}$.

**(2)** $x=2\cos\frac{2\pi}{3}=-1$ and $y=2\sin\frac{2\pi}{3}=\sqrt3$.

**(3)** Multiply by $r$: $r^2=2r\cos\theta$, that is $x^2+y^2=2x$. Completing the square, $(x-1)^2+y^2=1$: the circle of radius $1$ about $(1,0)$.` },
    { src: 'Class exercise (1): y = ½x² by parts', added: NOV17,
      stem: R`Give the line length of $y=\frac{1}{2}x^2$ $(0\le x\le1)$ using the relation $\displaystyle\int\frac{dx}{\sqrt{x^2+a^2}}=\ln\left|x+\sqrt{x^2+a^2}\right|+C$ and integration by parts for $\sqrt{x^2+1}=1\cdot\sqrt{x^2+1}$.`,
      parts: [],
      hint: R`$\ell=\int_0^1\sqrt{1+x^2}\,dx$. By parts, the same integral comes back: write $x^2=(1+x^2)-1$, then solve for $\ell$.`,
      answer: [R`$\frac{\sqrt2}{2}+\frac{1}{2}\ln\left(1+\sqrt2\right)$`],
      sol: R`
$y'=x$, so $\ell=\int_0^1\sqrt{1+x^2}\,dx$.

By parts with $f=\sqrt{1+x^2}$ and $g'=1$: $f'=\frac{x}{\sqrt{1+x^2}}$ and $g=x$, so
$$\ell=\Big[x\sqrt{1+x^2}\Big]_0^1-\int_0^1\frac{x^2}{\sqrt{1+x^2}}\,dx$$
and the first part is the number $\sqrt2$.

Write $x^2=(1+x^2)-1$, so $\frac{x^2}{\sqrt{1+x^2}}=\sqrt{1+x^2}-\frac{1}{\sqrt{1+x^2}}$. The first piece integrates to $\ell$ again, and the relation with $a=1$ gives the second:
$$\begin{aligned}&\int_0^1\frac{dx}{\sqrt{1+x^2}}\\[4pt]&=\Big[\ln\left(x+\sqrt{x^2+1}\right)\Big]_0^1\\[4pt]&=\ln\left(1+\sqrt2\right)\end{aligned}$$

So $\ell=\sqrt2-\ell+\ln\left(1+\sqrt2\right)$. Move $\ell$ to the left: $2\ell=\sqrt2+\ln\left(1+\sqrt2\right)$, and $\ell=\frac{\sqrt2}{2}+\frac{1}{2}\ln\left(1+\sqrt2\right)$, about $1.15$.` },
    { src: 'Class example: an arc with x = cos θ', added: NOV17,
      stem: R`The arc $y=g(x)=\sqrt{1-x^2}$, $-\frac{1}{\sqrt2}\le x\le\frac{1}{\sqrt2}$, is parametrized by $x=\cos\theta$, $y=\sin\theta$.`,
      parts: [R`Convert the region of integral to $\theta$.`, R`Show that $\sqrt{1+g'(x)^2}\cdot\frac{dx}{d\theta}=-1$.`, R`Find the length of the arc.`],
      hint: R`Take $0\le\theta\le\pi$, since $y=\sin\theta>0$. $\frac{dx}{d\theta}=-\sin\theta$, and $g'(x)=-\frac{x}{\sqrt{1-x^2}}=-\frac{\cos\theta}{\sin\theta}$.`,
      answer: [R`(1) $\theta$ runs from $\frac{3\pi}{4}$ to $\frac{\pi}{4}$`, R`(2) $-1$`, R`(3) $\frac{\pi}{2}$`],
      sol: R`
**(1)** $\cos\theta=-\frac{1}{\sqrt2}$ gives $\theta=\frac{3\pi}{4}$, and $\cos\theta=\frac{1}{\sqrt2}$ gives $\theta=\frac{\pi}{4}$. As $x$ goes from left to right, $\theta$ goes from $\frac{3\pi}{4}$ down to $\frac{\pi}{4}$.

**(2)** $\sqrt{1+\frac{\cos^2\theta}{\sin^2\theta}}=\frac{1}{\sin\theta}$ (with $\sin\theta>0$), and times $\frac{dx}{d\theta}=-\sin\theta$ that is $-1$.

**(3)** $\ell=\int_{3\pi/4}^{\pi/4}(-1)\,d\theta=\int_{\pi/4}^{3\pi/4}d\theta=\frac{\pi}{2}$. The general formula gives it at once: $\sqrt{\sin^2\theta+\cos^2\theta}=1$ on $\left[\frac{\pi}{4},\frac{3\pi}{4}\right]$.` },
    { src: 'Class exercise (2): r = 2θ', added: NOV17,
      stem: R`Give the line length of the curve $r=2\theta$ $(0\le\theta\le1)$.`,
      parts: [],
      hint: R`$\frac{dr}{d\theta}=2$, since $r$ changes with $\theta$. Take the $4$ out of the root and compare with Exercise (1).`,
      answer: [R`$\sqrt2+\ln\left(1+\sqrt2\right)$`],
      sol: R`
$r=2\theta$ changes with $\theta$, so $\frac{dr}{d\theta}=2$, not $0$:
$$\ell=\int_0^1\sqrt{4\theta^2+4}\,d\theta=2\int_0^1\sqrt{\theta^2+1}\,d\theta$$

The integral is Exercise (1)'s, with $\theta$ for $x$: $\frac{\sqrt2}{2}+\frac{1}{2}\ln\left(1+\sqrt2\right)$. So $\ell=\sqrt2+\ln\left(1+\sqrt2\right)$, about $2.30$: a little more than $2$, the straight distance from the origin to the end point, where $r=2$.` },
    { src: 'Class example: the cardioid r = 1 + cos θ', added: NOV17,
      stem: R`Find the length of the cardioid $r=1+\cos\theta$, $0\le\theta\le2\pi$.`,
      parts: [R`Show that $r^2+\left(\frac{dr}{d\theta}\right)^2=4\cos^2\frac{\theta}{2}$.`, R`Find the length.`],
      hint: R`$\frac{dr}{d\theta}=-\sin\theta$ and $1+\cos\theta=2\cos^2\frac{\theta}{2}$. Then $\sqrt{\cos^2\frac{\theta}{2}}=\left|\cos\frac{\theta}{2}\right|$: split where $\cos\frac{\theta}{2}$ changes sign.`,
      answer: [R`(1) $2+2\cos\theta=4\cos^2\frac{\theta}{2}$`, R`(2) $8$`],
      sol: R`
**(1)** $(1+\cos\theta)^2+\sin^2\theta=1+2\cos\theta+\cos^2\theta+\sin^2\theta=2+2\cos\theta$, and $2+2\cos\theta=4\cos^2\frac{\theta}{2}$.

**(2)** The root is $2\left|\cos\frac{\theta}{2}\right|$. On $[0,\pi]$, $\cos\frac{\theta}{2}\ge0$, and on $[\pi,2\pi]$ it is $\le0$. With $\int\cos\frac{\theta}{2}\,d\theta=2\sin\frac{\theta}{2}$:
$$\begin{aligned}\ell&=2\int_0^{\pi}\cos\frac{\theta}{2}\,d\theta-2\int_{\pi}^{2\pi}\cos\frac{\theta}{2}\,d\theta\\[4pt]&=2\cdot2-2\cdot(-2)=8\end{aligned}$$

Without the absolute value, $2\int_0^{2\pi}\cos\frac{\theta}{2}\,d\theta=4\Big[\sin\frac{\theta}{2}\Big]_0^{2\pi}=0$, which can't be a length.` },
    { src: 'Class exercises (3) and (4): x = 3t², y = 3t − t³', added: NOV17,
      stem: R`The parameterized curve $x=3t^2$, $y=3t-t^3$, with $t\ge0$.`,
      parts: [R`Find where the curve meets the $x$-axis, in $t$ and in $x$.`, R`Give the area enclosed by the curve and the $x$-axis.`, R`Give the line length within $0\le x\le12$.`, R`Give the length of the arch above the $x$-axis.`],
      hint: R`The $x$-axis is $y=0$. Area: $\int y\,\frac{dx}{dt}\,dt$ with $\frac{dx}{dt}=6t$. Length: $\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2$ is a perfect square, and $x=12$ means $t=2$.`,
      answer: [R`(1) $t=0$ and $t=\sqrt3$, that is $x=0$ and $x=9$`, R`(2) $\frac{36\sqrt3}{5}$`, R`(3) $14$`, R`(4) $6\sqrt3$`],
      sol: R`
**(1)** $y=t(3-t^2)=0$ at $t=0$ and $t=\sqrt3$ (with $t\ge0$), where $x=0$ and $x=9$.

**(2)** $\frac{dx}{dt}=6t$, so
$$\begin{aligned}A&=\int_0^{\sqrt3}(3t-t^3)\cdot6t\,dt\\[4pt]&=\int_0^{\sqrt3}(18t^2-6t^4)\,dt\\[4pt]&=\Big[6t^3-\frac{6}{5}t^5\Big]_0^{\sqrt3}\\[4pt]&=18\sqrt3-\frac{54\sqrt3}{5}=\frac{36\sqrt3}{5}\end{aligned}$$

**(3)** $\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2=36t^2+9(1-t^2)^2=9(1+t^2)^2$, so the root is $3(1+t^2)$. $x=3t^2=12$ gives $t=2$:
$$\ell=\int_0^2(3+3t^2)\,dt=\Big[3t+t^3\Big]_0^2=14$$

**(4)** Over the arch, $0\le t\le\sqrt3$: $\Big[3t+t^3\Big]_0^{\sqrt3}=3\sqrt3+3\sqrt3=6\sqrt3$.` },
    { src: 'A parametric curve: slope, area and length', added: NOV17,
      stem: R`The curve $x=t^2$, $y=t-\frac{t^3}{3}$, with $t\ge0$.`,
      parts: [R`Find the slope $\frac{dy}{dx}$ at $t=2$.`, R`Find where the curve meets the $x$-axis, in $t$ and in $x$.`, R`Find the area between the arch and the $x$-axis.`, R`Find the length of the arch.`],
      hint: R`$\frac{dy}{dx}=\frac{dy/dt}{dx/dt}$, with $\frac{dx}{dt}=2t$ and $\frac{dy}{dt}=1-t^2$. For (4), $\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2$ is a perfect square.`,
      answer: [R`(1) $-\frac{3}{4}$`, R`(2) $t=0$ and $t=\sqrt3$, that is $x=0$ and $x=3$`, R`(3) $\frac{4\sqrt3}{5}$`, R`(4) $2\sqrt3$`],
      sol: R`
**(1)** $\frac{dy}{dx}=\frac{1-t^2}{2t}$, which at $t=2$ is $\frac{1-4}{4}=-\frac{3}{4}$.

**(2)** $y=t\left(1-\frac{t^2}{3}\right)=0$ at $t=0$ and $t=\sqrt3$ (with $t\ge0$), where $x=0$ and $x=3$.

**(3)** $A=\int_0^{\sqrt3}\left(t-\frac{t^3}{3}\right)\cdot2t\,dt=\Big[\frac{2t^3}{3}-\frac{2t^5}{15}\Big]_0^{\sqrt3}=2\sqrt3-\frac{6\sqrt3}{5}=\frac{4\sqrt3}{5}$.

**(4)** $4t^2+(1-t^2)^2=1+2t^2+t^4=(1+t^2)^2$, so $\ell=\int_0^{\sqrt3}(1+t^2)\,dt=\sqrt3+\sqrt3=2\sqrt3$.` },
    { src: 'Lengths in polar coordinates', added: NOV17,
      stem: R`Find the length of each curve.`,
      parts: [R`$r=e^{\theta}$, $0\le\theta\le1$`, R`$r=\theta^2$, $0\le\theta\le\sqrt5$`, R`$r=1-\cos\theta$, $0\le\theta\le2\pi$`],
      hint: R`$\ell=\int\sqrt{r^2+r'^2}\,d\theta$. (2) Factor out $\theta^2$ and substitute $u=\theta^2+4$. (3) $1-\cos\theta=2\sin^2\frac{\theta}{2}$.`,
      answer: [R`(1) $\sqrt2\,(e-1)$`, R`(2) $\frac{19}{3}$`, R`(3) $8$`],
      sol: R`
**(1)** $r'=e^{\theta}$, so $r^2+r'^2=2e^{2\theta}$ and the root is $\sqrt2\,e^{\theta}$: $\ell=\sqrt2\Big[e^{\theta}\Big]_0^1=\sqrt2\,(e-1)$.

**(2)** $r'=2\theta$, so $r^2+r'^2=\theta^4+4\theta^2=\theta^2(\theta^2+4)$, and the root is $\theta\sqrt{\theta^2+4}$ (here $\theta\ge0$). With $u=\theta^2+4$, $du=2\theta\,d\theta$, the limits become $4$ and $9$:
$$\begin{aligned}\ell&=\frac{1}{2}\int_4^9\sqrt u\,du=\frac{1}{3}\Big[u^{3/2}\Big]_4^9\\[4pt]&=\frac{27-8}{3}=\frac{19}{3}\end{aligned}$$

**(3)** $r'=\sin\theta$, so $r^2+r'^2=1-2\cos\theta+\cos^2\theta+\sin^2\theta=2-2\cos\theta=4\sin^2\frac{\theta}{2}$. On $[0,2\pi]$, $\frac{\theta}{2}$ stays in $[0,\pi]$, where $\sin\frac{\theta}{2}\ge0$, so no split is needed: $\ell=\int_0^{2\pi}2\sin\frac{\theta}{2}\,d\theta=\Big[-4\cos\frac{\theta}{2}\Big]_0^{2\pi}=8$.` },
    { src: 'Shortcut: a ready-made primitive and symmetry', added: NOV17,
      stem: R`Use the shortcuts of this lesson.`,
      parts: [R`$\displaystyle\int_0^2\sqrt{x^2+4}\,dx$, with the ready-made primitive`, R`The length of $y=\frac{x^2}{4}$ on $[0,2]$`, R`The length of the cardioid $r=1+\cos\theta$, from its top half`],
      hint: R`(1) $a=2$. (2) $\sqrt{1+\frac{x^2}{4}}=\frac{1}{2}\sqrt{x^2+4}$. (3) The top half is $0\le\theta\le\pi$, where $\cos\frac{\theta}{2}\ge0$.`,
      answer: [R`(1) $2\sqrt2+2\ln\left(1+\sqrt2\right)$`, R`(2) $\sqrt2+\ln\left(1+\sqrt2\right)$`, R`(3) $8$`],
      sol: R`
**(1)** With $a=2$, the primitive is $\frac{1}{2}\left(x\sqrt{x^2+4}+4\ln\left(x+\sqrt{x^2+4}\right)\right)$. At $x=2$ it is $\frac{1}{2}\left(4\sqrt2+4\ln\left(2+2\sqrt2\right)\right)$ and at $x=0$ it is $2\ln2$, so the integral is $2\sqrt2+2\ln\frac{2+2\sqrt2}{2}=2\sqrt2+2\ln\left(1+\sqrt2\right)$.

**(2)** $y'=\frac{x}{2}$, so $\sqrt{1+\frac{x^2}{4}}=\frac{1}{2}\sqrt{x^2+4}$, and the length is half of (1): $\sqrt2+\ln\left(1+\sqrt2\right)$, the same as Exercise (2).

**(3)** The cardioid is symmetric about the $x$-axis, so take twice the top half: $2\cdot2\int_0^{\pi}\cos\frac{\theta}{2}\,d\theta=2\cdot4=8$.` },
  ],
  u6: [
    { src: 'Class exercise (1)', added: NOV19,
      stem: R`Evaluate the following improper integrals.`,
      parts: [R`$\displaystyle\int_0^{\infty}\frac{dx}{1+x^2}$`, R`$\displaystyle\int_{-\infty}^{0}e^x\,dx$`],
      hint: R`Replace the infinite limit with $w$, integrate as usual, then let $w\to\infty$ in (1) and $w\to-\infty$ in (2). $\arctan w\to\frac{\pi}{2}$ as $w\to\infty$, and $e^{w}\to0$ as $w\to-\infty$.`,
      answer: [R`(1) $\frac{\pi}{2}$`, R`(2) $1$`],
      sol: R`
**(1)** The upper limit is infinite, so integrate from $0$ to $w$ first:
$$\int_0^{w}\frac{dx}{1+x^2}=\Big[\arctan x\Big]_0^{w}=\arctan w$$

As $w\to\infty$, $\arctan w\to\frac{\pi}{2}$: the angle whose tangent grows without bound tends to a right angle. So the integral converges to $\frac{\pi}{2}$.

**(2)** The lower limit is $-\infty$, so integrate from $w$ to $0$:
$$\int_w^{0}e^x\,dx=\Big[e^x\Big]_w^{0}=1-e^{w}$$

As $w\to-\infty$, $e^{w}=\frac{1}{e^{|w|}}\to0$, so the integral converges to $1$.` },
    { src: 'Power functions on [1, ∞)', added: NOV19,
      stem: R`Decide whether each improper integral converges, and give its value when it does.`,
      parts: [R`$\displaystyle\int_1^{\infty}\frac{dx}{x^3}$`, R`$\displaystyle\int_1^{\infty}\frac{dx}{\sqrt x}$`, R`$\displaystyle\int_1^{\infty}\frac{dx}{x}$`, R`$\displaystyle\int_1^{\infty}\frac{dx}{x\sqrt x}$`],
      hint: R`Write each integrand as $x^n$ and look at $\lim_{w\to\infty}w^{n+1}$: it is $0$ only for $n<-1$. For $n=-1$ the primitive is $\ln x$.`,
      answer: [R`(1) converges to $\frac{1}{2}$`, R`(2) diverges`, R`(3) diverges`, R`(4) converges to $2$`],
      sol: R`
**(1)** $n=-3<-1$: $\int_1^{w}x^{-3}\,dx=\Big[-\frac{1}{2x^2}\Big]_1^{w}=\frac{1}{2}-\frac{1}{2w^2}$, which tends to $\frac{1}{2}$.

**(2)** $n=-\frac{1}{2}>-1$: $\int_1^{w}x^{-1/2}\,dx=\Big[2\sqrt x\Big]_1^{w}=2\sqrt w-2$, which grows without bound, so the integral diverges.

**(3)** $n=-1$: $\int_1^{w}\frac{dx}{x}=\ln w\to\infty$, so it diverges, although $\frac{1}{x}\to0$.

**(4)** $\frac{1}{x\sqrt x}=x^{-3/2}$, and $n=-\frac{3}{2}<-1$: $\int_1^{w}x^{-3/2}\,dx=\Big[-\frac{2}{\sqrt x}\Big]_1^{w}=2-\frac{2}{\sqrt w}$, which tends to $2$.` },
    { src: 'Class example: f diverges at an open boundary', added: NOV19,
      stem: R`$f(x)=\frac{1}{\sqrt{1-x}}$ diverges at $x=1$ and cannot be defined there.`,
      parts: [R`Find a primitive function of $f$.`, R`Evaluate $\displaystyle I=\int_0^1\frac{dx}{\sqrt{1-x}}$, with $x\in[0,1)$.`],
      hint: R`Write $f=(1-x)^{-1/2}$ and substitute $u=1-x$, $du=-dx$. The power rule divides by the new exponent $\frac{1}{2}$. Then integrate up to $w<1$ and let $w\to1$.`,
      answer: [R`(1) $-2\sqrt{1-x}+C$`, R`(2) $2$`],
      sol: R`
**(1)** With $u=1-x$, $dx=-du$:
$$\begin{aligned}\int(1-x)^{-1/2}\,dx&=-\int u^{-1/2}\,du\\[4pt]&=-2u^{1/2}+C\end{aligned}$$
so a primitive is $-2\sqrt{1-x}$. Check: $\left(-2\sqrt{1-x}\right)'=-2\cdot\frac{1}{2\sqrt{1-x}}\cdot(-1)=\frac{1}{\sqrt{1-x}}$.

**(2)** $f$ cannot be defined at $x=1$, so integrate up to $w<1$:
$$\begin{aligned}\int_0^{w}\frac{dx}{\sqrt{1-x}}&=\Big[-2\sqrt{1-x}\Big]_0^{w}\\[4pt]&=2-2\sqrt{1-w}\end{aligned}$$

As $w\to1$, $\sqrt{1-w}\to0$, so $I=2$: the integral converges.` },
    { src: 'Class exercise (2): tan x on [0, π/2)', added: NOV19,
      stem: R`Evaluate the improper integral $\displaystyle\int_0^{\pi/2}\tan x\,dx$.`,
      parts: [R`Find $\displaystyle\int_0^{w}\tan x\,dx$ for $0<w<\frac{\pi}{2}$, with the substitution $u=\cos x$.`, R`Let $w\to\frac{\pi}{2}$: does the integral converge?`],
      hint: R`$\tan x=\frac{\sin x}{\cos x}=-\frac{(\cos x)'}{\cos x}$, and $\int\frac{f'}{f}\,dx=\ln|f|+C$. What does $\cos w$ tend to?`,
      answer: [R`(1) $-\ln|\cos w|$`, R`(2) it diverges: $-\ln|\cos w|\to\infty$`],
      sol: R`
**(1)** $\tan x=\frac{\sin x}{\cos x}=-\frac{(\cos x)'}{\cos x}$, so with $u=\cos x$ a primitive is $-\ln|\cos x|$:
$$\begin{aligned}\int_0^{w}\tan x\,dx&=\Big[-\ln|\cos x|\Big]_0^{w}\\[4pt]&=-\ln|\cos w|+\ln1\end{aligned}$$
and $\ln1=0$.

**(2)** As $w\to\frac{\pi}{2}$, $\cos w\to0$ (from above), so $\ln|\cos w|\to-\infty$ and $-\ln|\cos w|\to\infty$. The integral diverges: the area under $\tan x$ from $0$ to $\frac{\pi}{2}$ is infinite.` },
    { src: 'Class exercise (3)', added: NOV19,
      stem: R`Evaluate the following improper integrals.`,
      parts: [R`$\displaystyle\int_{-\infty}^{1}xe^{-x^2}\,dx$`, R`$\displaystyle\int_0^{1}\ln x\,dx$`],
      hint: R`(1) Substitute $u=-x^2$, so $x\,dx=-\frac{1}{2}\,du$. (2) $\ln x\to-\infty$ at $x=0$. Integrate by parts with $\ln x=1\cdot\ln x$, and use $w\ln w\to0$ (L'Hôpital's rule).`,
      answer: [R`(1) $-\frac{1}{2e}$`, R`(2) $-1$`],
      sol: R`
**(1)** With $u=-x^2$, $du=-2x\,dx$: $\int xe^{-x^2}\,dx=-\frac{1}{2}\int e^u\,du=-\frac{1}{2}e^{-x^2}+C$.

The lower limit is $-\infty$, so integrate from $w$:
$$\int_w^{1}xe^{-x^2}\,dx=-\frac{1}{2e}+\frac{1}{2}e^{-w^2}$$
As $w\to-\infty$, $w^2\to\infty$ and $e^{-w^2}\to0$, so the integral is $-\frac{1}{2e}$. It is negative because $xe^{-x^2}<0$ for $x<0$, and that part outweighs the part from $0$ to $1$.

**(2)** By parts with $f=\ln x$ and $g'=1$: $\int\ln x\,dx=x\ln x-\int x\cdot\frac{1}{x}\,dx=x\ln x-x+C$.

$\ln x$ diverges at $x=0$, so integrate from $w>0$:
$$\int_w^{1}\ln x\,dx=(0-1)-(w\ln w-w)$$

$w\ln w=\frac{\ln w}{1/w}$ is $\frac{-\infty}{\infty}$, and by L'Hôpital's rule it has the same limit as $\frac{1/w}{-1/w^2}=-w$, which is $0$. So the integral is $-1-0=-1$: negative, since $\ln x<0$ on $(0,1)$.` },
    { src: 'Class example: a discontinuous point inside', added: NOV19,
      stem: R`Consider the improper integral $\displaystyle I=\int_{-1}^{1}\frac{dx}{\sqrt{|x|}}$.`,
      parts: [R`Where is the integrand discontinuous, and how is the domain separated?`, R`Evaluate $I$.`],
      hint: R`On $(0,1]$, $|x|=x$; on $[-1,0)$, $|x|=-x$. Each part is improper at its open end, $0$.`,
      answer: [R`(1) at $x=0$: separate into $[-1,0)$ and $(0,1]$`, R`(2) $4$`],
      sol: R`
**(1)** $\frac{1}{\sqrt{|x|}}\to\infty$ as $x\to0$, so it is discontinuous at $x=0$, inside the interval. Separate the domain into $[-1,0)$ and $(0,1]$:
$$I=\int_{-1}^{0}\frac{dx}{\sqrt{-x}}+\int_0^{1}\frac{dx}{\sqrt x}$$

**(2)** The right part, from $w>0$:
$$\int_w^{1}x^{-1/2}\,dx=\Big[2\sqrt x\Big]_w^{1}=2-2\sqrt w\to2$$

The left part, up to $w<0$, with the primitive $-2\sqrt{-x}$ (the inside, $-x$, brings a minus sign):
$$\begin{aligned}\int_{-1}^{w}\frac{dx}{\sqrt{-x}}&=\Big[-2\sqrt{-x}\Big]_{-1}^{w}\\[4pt]&=2-2\sqrt{-w}\to2\end{aligned}$$

Both parts converge, so $I=2+2=4$. The graph is symmetric about the $y$-axis, so the two parts are equal.` },
    { src: 'Splitting at a point inside', added: NOV19,
      stem: R`Each integrand diverges at $x=0$, inside the interval. Separate the domain there and decide whether the integral converges.`,
      parts: [R`$\displaystyle\int_{-1}^{1}\frac{dx}{x^2}$`, R`$\displaystyle\int_{-1}^{8}\frac{dx}{\sqrt[3]{x}}$`],
      hint: R`(1) Look at $\int_w^{1}\frac{dx}{x^2}$ as $w\to+0$ before anything else. (2) $\frac{1}{\sqrt[3]{x}}=x^{-1/3}$ has the primitive $\frac{3}{2}x^{2/3}$, and $\sqrt[3]{x}$ is defined for negative $x$ too: $\sqrt[3]{-1}=-1$.`,
      answer: [R`(1) diverges (it is not $-2$)`, R`(2) converges to $\frac{9}{2}$`],
      sol: R`
**(1)** The right part: $\int_w^{1}\frac{dx}{x^2}=\Big[-\frac{1}{x}\Big]_w^{1}=\frac{1}{w}-1$, which grows without bound as $w\to+0$. One part diverges, so the whole integral diverges.

Putting in the ends instead gives $\Big[-\frac{1}{x}\Big]_{-1}^{1}=-1-1=-2$, a negative number for a positive function: the sign that a point inside was skipped.

**(2)** The right part: $\int_w^{8}x^{-1/3}\,dx=\Big[\frac{3}{2}x^{2/3}\Big]_w^{8}=6-\frac{3}{2}w^{2/3}$, which tends to $6$ as $w\to+0$.

The left part, up to $w<0$: $\int_{-1}^{w}x^{-1/3}\,dx=\Big[\frac{3}{2}x^{2/3}\Big]_{-1}^{w}=\frac{3}{2}w^{2/3}-\frac{3}{2}$, which tends to $-\frac{3}{2}$ as $w\to0$, since $(-1)^{2/3}=\left(\sqrt[3]{-1}\right)^2=1$.

Both parts converge, so the integral is $6-\frac{3}{2}=\frac{9}{2}$.` },
    { src: "L'Hôpital's rule", added: NOV19,
      stem: R`Compute the limits with L'Hôpital's rule. Check the form first.`,
      parts: [R`$\displaystyle\lim_{x\to0}\frac{e^x-1}{x}$`, R`$\displaystyle\lim_{x\to0}\frac{1-\cos x}{x^2}$`, R`$\displaystyle\lim_{x\to\infty}\frac{x^2}{e^x}$`, R`$\displaystyle\lim_{x\to+0}x^2\ln x$`],
      hint: R`(2) and (3) need the rule twice. (4) is $0\cdot(-\infty)$: write it as $\frac{\ln x}{x^{-2}}$ first.`,
      answer: [R`(1) $1$`, R`(2) $\frac{1}{2}$`, R`(3) $0$`, R`(4) $0$`],
      sol: R`
**(1)** The form is $\frac{0}{0}$: $\lim_{x\to0}\frac{e^x}{1}=1$.

**(2)** The form is $\frac{0}{0}$: $\lim_{x\to0}\frac{\sin x}{2x}$, again $\frac{0}{0}$, so once more: $\lim_{x\to0}\frac{\cos x}{2}=\frac{1}{2}$.

**(3)** The form is $\frac{\infty}{\infty}$: $\lim_{x\to\infty}\frac{2x}{e^x}$, again $\frac{\infty}{\infty}$, so once more: $\lim_{x\to\infty}\frac{2}{e^x}=0$.

**(4)** $x^2\ln x=\frac{\ln x}{x^{-2}}$, which is $\frac{-\infty}{\infty}$: $\lim_{x\to+0}\frac{1/x}{-2x^{-3}}=\lim_{x\to+0}\left(-\frac{x^2}{2}\right)=0$.` },
    { src: 'By parts, then a limit', added: NOV19,
      stem: R`Evaluate the improper integrals. Each needs integration by parts, then L'Hôpital's rule for the limit.`,
      parts: [R`$\displaystyle\int_0^{\infty}xe^{-x}\,dx$`, R`$\displaystyle\int_1^{\infty}\frac{\ln x}{x^2}\,dx$`],
      hint: R`(1) Differentiate $x$: a primitive is $-(x+1)e^{-x}$. (2) Differentiate $\ln x$ and integrate $x^{-2}$: a primitive is $-\frac{\ln x+1}{x}$. Then use $\frac{w}{e^w}\to0$ and $\frac{\ln w}{w}\to0$.`,
      answer: [R`(1) $1$`, R`(2) $1$`],
      sol: R`
**(1)** By parts with $f=x$ and $g'=e^{-x}$: $\int xe^{-x}\,dx=-xe^{-x}+\int e^{-x}\,dx=-(x+1)e^{-x}+C$. So
$$\int_0^{w}xe^{-x}\,dx=1-\frac{w+1}{e^{w}}$$

$\frac{w+1}{e^w}$ is $\frac{\infty}{\infty}$, and L'Hôpital's rule gives $\frac{1}{e^w}\to0$. So the integral is $1$.

**(2)** By parts with $f=\ln x$ and $g'=x^{-2}$, so $g=-\frac{1}{x}$: $\int\frac{\ln x}{x^2}\,dx=-\frac{\ln x}{x}+\int\frac{dx}{x^2}=-\frac{\ln x+1}{x}+C$. So
$$\int_1^{w}\frac{\ln x}{x^2}\,dx=1-\frac{\ln w+1}{w}$$

$\frac{\ln w+1}{w}$ is $\frac{\infty}{\infty}$, and L'Hôpital's rule gives $\frac{1/w}{1}\to0$. So the integral is $1$.` },
    { src: 'Converge or diverge?', added: NOV19,
      stem: R`Evaluate each improper integral, or show that it diverges.`,
      parts: [R`$\displaystyle\int_0^{\infty}e^{-2x}\,dx$`, R`$\displaystyle\int_2^{\infty}\frac{dx}{x\ln x}$`, R`$\displaystyle\int_0^{2}\frac{dx}{\sqrt{4-x^2}}$`, R`$\displaystyle\int_1^{\infty}\frac{dx}{x(x+1)}$`],
      hint: R`(2) Substitute $u=\ln x$. (3) The integrand diverges at $x=2$; a primitive is $\arcsin\frac{x}{2}$. (4) Partial fractions: $\frac{1}{x(x+1)}=\frac{1}{x}-\frac{1}{x+1}$.`,
      answer: [R`(1) $\frac{1}{2}$`, R`(2) diverges`, R`(3) $\frac{\pi}{2}$`, R`(4) $\ln2$`],
      sol: R`
**(1)** $\int_0^{w}e^{-2x}\,dx=\Big[-\frac{1}{2}e^{-2x}\Big]_0^{w}=\frac{1}{2}-\frac{1}{2}e^{-2w}$, which tends to $\frac{1}{2}$.

**(2)** With $u=\ln x$, $du=\frac{dx}{x}$: $\int\frac{dx}{x\ln x}=\ln|\ln x|+C$. So $\int_2^{w}\frac{dx}{x\ln x}=\ln(\ln w)-\ln(\ln2)$, which grows without bound: the integral diverges, very slowly.

**(3)** $\int_0^{w}\frac{dx}{\sqrt{4-x^2}}=\Big[\arcsin\frac{x}{2}\Big]_0^{w}=\arcsin\frac{w}{2}$, and as $w\to2$ this tends to $\arcsin1=\frac{\pi}{2}$. The integrand shoots up at $x=2$, but the integral converges.

**(4)** $\int_1^{w}\left(\frac{1}{x}-\frac{1}{x+1}\right)dx=\Big[\ln\frac{x}{x+1}\Big]_1^{w}=\ln\frac{w}{w+1}-\ln\frac{1}{2}$. As $w\to\infty$, $\frac{w}{w+1}\to1$ and $\ln1=0$, so the integral is $\ln2$. Each fraction alone would give a divergent integral; their difference doesn't.` },
    { src: 'Shortcut: the power test', added: NOV19,
      stem: R`Without integrating, decide whether each improper integral converges: compare the integrand with a power near the problem point.`,
      parts: [R`$\displaystyle\int_1^{\infty}\frac{dx}{x^2+1}$`, R`$\displaystyle\int_0^{1}\frac{dx}{\sqrt{x+x^2}}$`, R`$\displaystyle\int_0^{\pi/2}\frac{dx}{\cos x}$`, R`$\displaystyle\int_0^{1}\frac{dx}{(1-x)^{3/2}}$`],
      hint: R`At $\infty$, a power $\frac{1}{x^p}$ needs $p>1$; near a finite point $c$, $\frac{1}{|x-c|^p}$ needs $p<1$. Near $\frac{\pi}{2}$, $\cos x=\sin\left(\frac{\pi}{2}-x\right)$ is about $\frac{\pi}{2}-x$.`,
      answer: [R`(1) converges`, R`(2) converges`, R`(3) diverges`, R`(4) diverges`],
      sol: R`
**(1)** For large $x$, $\frac{1}{x^2+1}$ is about $\frac{1}{x^2}$, and $p=2>1$: it converges. (Its value is $\lim_{w\to\infty}\arctan w-\arctan1=\frac{\pi}{4}$.)

**(2)** The problem point is $x=0$, where $x+x^2$ is about $x$, so the integrand is about $\frac{1}{\sqrt x}$, with $p=\frac{1}{2}<1$: it converges.

**(3)** The problem point is $\frac{\pi}{2}$, where $\cos x$ is about $\frac{\pi}{2}-x$, so the integrand is about $\frac{1}{\pi/2-x}$, with $p=1$: it diverges. Indeed $\int_0^{w}\frac{dx}{\cos x}=\ln\left(\frac{1}{\cos w}+\tan w\right)$, which grows without bound as $w\to\frac{\pi}{2}$.

**(4)** At $x=1$, $p=\frac{3}{2}\ge1$: it diverges. Indeed $\int_0^{w}(1-x)^{-3/2}\,dx=\frac{2}{\sqrt{1-w}}-2$, which grows without bound as $w\to1$.` },
    { src: 'Class exercise (4)', added: NOV20,
      stem: R`Check the orthogonality of $S_m=\sin(mx)$ and $C_n=\cos(nx)$, for whole numbers $m,n\ge1$, by computing the inner product $\displaystyle\langle S_m|C_n\rangle=\int_{-\pi}^{\pi}\sin(mx)\cos(nx)\,dx$.`,
      parts: [R`$m\ne n$`, R`$m=n$`],
      hint: R`Product to sum: $\sin A\cos B=\frac{1}{2}\{\sin(A+B)+\sin(A-B)\}$. A primitive of $\sin kx$ is $-\frac{\cos kx}{k}$, and $\cos$ takes the same value at $\pi$ and $-\pi$.`,
      answer: [R`(1) $0$`, R`(2) $0$`],
      sol: R`
**(1)** Product to sum, with $m+n\ne0$ and $m-n\ne0$:
$$\begin{aligned}&\sin(mx)\cos(nx)\\[2pt]&=\frac{1}{2}\{\sin(m+n)x+\sin(m-n)x\}\end{aligned}$$

A primitive is $-\frac{\cos(m+n)x}{2(m+n)}-\frac{\cos(m-n)x}{2(m-n)}$. Since $\cos$ is even, $\cos(-k\pi)=\cos k\pi$: the primitive takes the same value at $\pi$ and at $-\pi$, so $\langle S_m|C_n\rangle=0$.

**(2)** For $m=n$, $\sin(mx)\cos(mx)=\frac{1}{2}\sin2mx$, and
$$\begin{aligned}\int_{-\pi}^{\pi}\frac{1}{2}\sin2mx\,dx&=\Big[-\frac{\cos2mx}{4m}\Big]_{-\pi}^{\pi}\\[4pt]&=0\end{aligned}$$

So $\langle S_m|C_n\rangle=0$ for every $m$ and $n$: every sine is orthogonal to every cosine on $[-\pi,\pi]$.` },
    { src: 'Sines with sines, cosines with cosines', added: NOV20,
      stem: R`Compute the inner products on $[-\pi,\pi]$, with $S_m=\sin(mx)$ and $C_n=\cos(nx)$.`,
      parts: [R`$\langle S_2|S_3\rangle$`, R`$\langle C_1|C_4\rangle$`, R`$\langle S_3|S_3\rangle$`, R`$\langle C_2|C_2\rangle$`],
      hint: R`Product to sum: $\sin A\sin B=\frac{1}{2}\{\cos(A-B)-\cos(A+B)\}$ and $\cos A\cos B=\frac{1}{2}\{\cos(A-B)+\cos(A+B)\}$. For a square, use $\sin^2x=\frac{1-\cos2x}{2}$ and $\cos^2x=\frac{1+\cos2x}{2}$.`,
      answer: [R`(1) $0$`, R`(2) $0$`, R`(3) $\pi$`, R`(4) $\pi$`],
      sol: R`
**(1)** $\sin2x\sin3x=\frac{1}{2}(\cos x-\cos5x)$, and the integral of $\cos kx$ over $[-\pi,\pi]$ is $\Big[\frac{\sin kx}{k}\Big]_{-\pi}^{\pi}=0$ for every whole number $k\ne0$. So $\langle S_2|S_3\rangle=0$.

**(2)** $\cos x\cos4x=\frac{1}{2}(\cos3x+\cos5x)$, so $\langle C_1|C_4\rangle=0$ in the same way.

**(3)** $\sin^23x=\frac{1-\cos6x}{2}$, so
$$\begin{aligned}\langle S_3|S_3\rangle&=\int_{-\pi}^{\pi}\frac{1-\cos6x}{2}\,dx\\[4pt]&=\frac{2\pi}{2}-0=\pi\end{aligned}$$

**(4)** $\cos^22x=\frac{1+\cos4x}{2}$, so $\langle C_2|C_2\rangle=\frac{2\pi}{2}+0=\pi$. A function's inner product with itself is never $0$.` },
    { src: 'Reading off Fourier coefficients', added: NOV20,
      stem: R`Each function on $[-\pi,\pi]$ is written as a Fourier series,
$$f(x)=\sum_{m=1}^{\infty}\{a_m\cos(mx)+b_m\sin(mx)\}.$$
Find the coefficients asked for.`,
      parts: [R`$f(x)=\cos\left(3x-\frac{\pi}{6}\right)$: $a_3$ and $b_3$`, R`The same $f$: $a_1$ and $b_2$`, R`$f(x)=\sin3x\cos x$: $b_2$ and $b_4$`],
      hint: R`Expand with $\cos(A-B)=\cos A\cos B+\sin A\sin B$, or turn the product into a sum. Then match each term with $a_m\cos(mx)$ or $b_m\sin(mx)$; a term that isn't there has the coefficient $0$.`,
      answer: [R`(1) $a_3=\frac{\sqrt3}{2}$, $b_3=\frac{1}{2}$`, R`(2) $a_1=0$, $b_2=0$`, R`(3) $b_2=b_4=\frac{1}{2}$`],
      sol: R`
**(1)** With $\cos\frac{\pi}{6}=\frac{\sqrt3}{2}$ and $\sin\frac{\pi}{6}=\frac{1}{2}$:
$$\begin{aligned}&\cos\left(3x-\frac{\pi}{6}\right)\\[4pt]&=\cos3x\cos\frac{\pi}{6}+\sin3x\sin\frac{\pi}{6}\\[4pt]&=\frac{\sqrt3}{2}\cos3x+\frac{1}{2}\sin3x\end{aligned}$$
So $a_3=\frac{\sqrt3}{2}$ (with $\cos3x$) and $b_3=\frac{1}{2}$ (with $\sin3x$).

**(2)** Only $m=3$ appears, so every other coefficient is $0$: $a_1=0$ and $b_2=0$.

**(3)** Product to sum: $\sin3x\cos x=\frac{1}{2}(\sin4x+\sin2x)$, so $b_2=b_4=\frac{1}{2}$, and every other coefficient, every $a_m$ included, is $0$. The integral gives the same: $b_2=\frac{1}{\pi}\int_{-\pi}^{\pi}\sin3x\cos x\sin2x\,dx=\frac{1}{\pi}\cdot\frac{\pi}{2}=\frac{1}{2}$.` },
    { src: 'Fourier coefficients of f(x) = x', added: NOV20,
      stem: R`Find the Fourier coefficients of $f(x)=x$ on $[-\pi,\pi]$.`,
      parts: [R`$a_m$`, R`$b_m$`, R`The first three terms of the series`],
      hint: R`Integrate $x\cos(mx)$ and $x\sin(mx)$ by parts, differentiating $x$. Use $\sin(\pm m\pi)=0$ and $\cos(\pm m\pi)=(-1)^m$.`,
      answer: [R`(1) $a_m=0$`, R`(2) $b_m=\frac{2(-1)^{m+1}}{m}$`, R`(3) $2\sin x-\sin2x+\frac{2}{3}\sin3x$`],
      sol: R`
**(1)** By parts, differentiating $x$, a primitive of $x\cos(mx)$ is $\frac{x\sin(mx)}{m}+\frac{\cos(mx)}{m^2}$. At $x=\pm\pi$, $\sin(\pm m\pi)=0$ and $\cos(\pm m\pi)$ is the same number, so the primitive takes the same value at both ends and $a_m=0$.

**(2)** In the same way, a primitive of $x\sin(mx)$ is $-\frac{x\cos(mx)}{m}+\frac{\sin(mx)}{m^2}$. With $\cos(\pm m\pi)=(-1)^m$:
$$\begin{aligned}&\int_{-\pi}^{\pi}x\sin(mx)\,dx\\[4pt]&=-\frac{\pi(-1)^m}{m}-\frac{\pi(-1)^m}{m}=\frac{2\pi(-1)^{m+1}}{m}\end{aligned}$$
so $b_m=\frac{1}{\pi}\cdot\frac{2\pi(-1)^{m+1}}{m}=\frac{2(-1)^{m+1}}{m}$.

**(3)** $b_1=2$, $b_2=-1$ and $b_3=\frac{2}{3}$:
$$x=2\sin x-\sin2x+\frac{2}{3}\sin3x-\cdots$$` },
    { src: 'Shortcut: odd and even', added: NOV20,
      stem: R`Without integrating, decide which Fourier coefficients of each function on $[-\pi,\pi]$ are $0$.`,
      parts: [R`$f(x)=x^3$`, R`$f(x)=x^2$`, R`$f(x)=x\sin x$`],
      hint: R`An odd function times an even one is odd, and an odd function integrates to $0$ over $[-\pi,\pi]$. $\cos(mx)$ is even and $\sin(mx)$ is odd.`,
      answer: [R`(1) every $a_m=0$: only sines`, R`(2) every $b_m=0$: only cosines, with a constant term`, R`(3) every $b_m=0$: only cosines, with a constant term`],
      sol: R`
**(1)** $x^3$ is odd, so $x^3\cos(mx)$ is odd (odd times even) and $a_m=\frac{1}{\pi}\int_{-\pi}^{\pi}x^3\cos(mx)\,dx=0$. Only the sines remain.

**(2)** $x^2$ is even, so $x^2\sin(mx)$ is odd (even times odd) and every $b_m=0$. Only cosines remain, with a constant term, the average $\frac{1}{2\pi}\int_{-\pi}^{\pi}x^2\,dx=\frac{\pi^2}{3}$.

**(3)** $x\sin x$ is odd times odd, so even, and every $b_m=0$ in the same way; its average is $\frac{1}{2\pi}\int_{-\pi}^{\pi}x\sin x\,dx=1$. The same reasoning gives Exercise (4) at once: $\sin(mx)\cos(nx)$ is odd, so $\langle S_m|C_n\rangle=0$.` },
  ],
};
