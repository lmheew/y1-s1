// Content for the Calculus midterm 2 page (math/integrals/, the integral part of CLA1). Units follow the course
// schedule (integral part): one unit per lesson pair, in schedule order. The schedule slide gives dates, not day
// numbers, so every unit carries `dates` ("2 & 3 Nov"); a lesson gets `days` and `quiz` once a quiz sheet shows them
// (Quiz 06 is "Day16 & Day17", so 5 & 6 Nov are Days 16 and 17 and 2 & 3 Nov, the two classes before, Days 14 and 15;
// Quiz 07 is "Day18 & Day19", so 9 & 10 Nov are Days 18 and 19; Quiz 08 is "Day20 & Day21", 12 & 13 Nov). The 9 Nov
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
$$\begin{aligned}\int\frac{dx}{x+2\sqrt{x-1}}&=\int\frac{2t}{(t+1)^2}\,dt\\[4pt]&=2\ln(t+1)+\frac{2}{t+1}+C\end{aligned}$$
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
$$\begin{aligned}\int\frac{x+3}{x^2+2x+5}\,dx&=\frac{1}{2}\ln(x^2+2x+5)\\[4pt]&\quad+\arctan\frac{x+1}{2}+C\end{aligned}$$
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
  { id: 'u5', dates: '16 & 17 Nov', title: 'Parametric and polar curves', starred: true, upcoming: true },
  { id: 'u6', dates: '19 & 20 Nov', title: 'Improper integrals and orthogonal functions', starred: true, upcoming: true },
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
$$\begin{aligned}\int f(x)\,dx&=\frac{1}{4}\int\frac{2\,du}{u^2+1}=\frac{1}{2}\arctan u+C\\[4pt]&=\frac{1}{2}\arctan\frac{x+1}{2}+C\end{aligned}$$

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
$$\int\frac{1+2u+u^2}{2}\cdot\frac{2\,du}{1+u^2}=\int\left(1+\frac{2u}{1+u^2}\right)du$$

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
$$\begin{aligned}\int x\sin x\,dx&=-x\cos x-\int(-\cos x)\,dx\\[4pt]&=-x\cos x+\sin x+C\end{aligned}$$

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
$$\int xe^{2x}\,dx=\frac{x}{2}e^{2x}-\int\frac{e^{2x}}{2}\,dx=\frac{x}{2}e^{2x}-\frac{e^{2x}}{4}$$

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
      parts: [R`$\displaystyle\int x^3e^x\,dx$`, R`$\displaystyle\int x^2\sin x\,dx$`, R`$\displaystyle\int_0^{\pi/2}\frac{\sqrt{\sin x}}{\sqrt{\sin x}+\sqrt{\cos x}}\,dx$`],
      hint: R`(1) and (2): differentiate the polynomial down to $0$, and mind the signs of the I column for $\sin x$. (3) Replace $x$ by $\frac{\pi}{2}-x$ and add the two integrals.`,
      answer: [R`(1) $e^x(x^3-3x^2+6x-6)+C$`, R`(2) $-x^2\cos x+2x\sin x+2\cos x+C$`, R`(3) $\frac{\pi}{4}$`],
      sol: R`
**(1)** D: $x^3$, $3x^2$, $6x$, $6$, $0$. I: $e^x$ on every row. With the signs $+,-,+,-$: $x^3e^x-3x^2e^x+6xe^x-6e^x+C=e^x(x^3-3x^2+6x-6)+C$.

**(2)** D: $x^2$, $2x$, $2$, $0$. I: $\sin x$, $-\cos x$, $-\sin x$, $\cos x$. With the signs $+,-,+$: $x^2(-\cos x)-2x(-\sin x)+2\cos x+C=-x^2\cos x+2x\sin x+2\cos x+C$.

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
$$A=\int_0^{\pi/4}(\cos x-\sin x)\,dx=\Big[\sin x+\cos x\Big]_0^{\pi/4}$$
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
$$V=\pi\int_{-2}^{2}(4-x^2)\,dx=\pi\left(16-\frac{16}{3}\right)=\frac{32\pi}{3}$$
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
$$\begin{aligned}V&=\pi\int_0^{-1/4}e^u\left(-\frac{du}{2}\right)=\frac{\pi}{2}\int_{-1/4}^{0}e^u\,du\\[4pt]&=\frac{\pi}{2}\left(1-e^{-1/4}\right)\end{aligned}$$
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
$$\begin{aligned}\ell&=\int_0^{4/3}\sqrt{1+\tfrac{9x}{4}}\,dx=\frac{8}{27}\Big[\left(1+\tfrac{9x}{4}\right)^{3/2}\Big]_0^{4/3}\\[4pt]&=\frac{8}{27}(8-1)=\frac{56}{27}\end{aligned}$$

**(3)** $f'=\frac{e^x-e^{-x}}{2}$, and
$$1+f'^2=\frac{e^{2x}+2+e^{-2x}}{4}=\left(\frac{e^x+e^{-x}}{2}\right)^2$$
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
$$\int_0^1\frac{2\,dx}{\sqrt{4-x^2}}=2\int_0^{1/2}\frac{du}{\sqrt{1-u^2}}=2\arcsin\frac{1}{2}=\frac{\pi}{3}$$
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
};
