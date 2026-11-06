// Content for the Calculus midterm 2 page (math/integrals/, the integral part of CLA1). Units follow the course
// schedule (integral part): one unit per lesson pair, in schedule order. The schedule slide gives dates, not day
// numbers, so every unit carries `dates` ("2 & 3 Nov"); a lesson gets `days` and `quiz` once a quiz sheet shows them
// (Quiz 06 is "Day16 & Day17", so 5 & 6 Nov are Days 16 and 17 and 2 & 3 Nov, the two classes before, Days 14 and 15).
// A lesson still to come has `upcoming: true` and shows as a greyed-out Summary tile; `starred` marks the lessons with
// an in-class quiz (the schedule's *).
// Markup: $inline$, $$display$$, **bold**, "- " list items (continuation lines join the item),
// blank line = new block. Every answer here is checked in verify.py (this folder).
const R = String.raw;
const NOV2 = '2026-11-02';
const NOV3 = '2026-11-03';
const NOV6 = '2026-11-06';

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
    id: 'u2', quiz: 'Quiz 06', days: 'Day 16 & 17', dates: '5 & 6 Nov', starred: true, added: NOV6,
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
- **Area with a primitive:** find the zeros of $f$ inside $[a,b]$, work out each piece with $F$, and add the pieces as positive numbers. Without the split, the parts below the axis are subtracted.`,
    watch: R`
- The minus sign belongs to sine: $\int\sin x\,dx=-\cos x+C$, because $(\cos x)'=-\sin x$.
- Divide by the number inside, never multiply: $\int\cos3x\,dx=\frac{1}{3}\sin3x+C$ and $\int e^{-x}\,dx=-e^{-x}+C$.
- $\int\frac{1}{x}\,dx=\ln|x|+C$, since the power rule would divide by $0$. And $\int\frac{1}{2x+1}\,dx=\frac{1}{2}\ln|2x+1|+C$, not $\ln|2x+1|+C$.
- With the variable in the exponent, $\int2^x\,dx=\frac{2^x}{\ln2}+C$, not $\frac{2^{x+1}}{x+1}$. And $\int\frac{1}{3^x}\,dx$ is not $\ln|3^x|$: rewrite it as $3^{-x}$ first.
- $\tan^{-1}x$ is $\arctan x$, an angle: $\tan^{-1}1=\frac{\pi}{4}$, while $\frac{1}{\tan1}$ is a different number.
- In $F(b)-F(a)$, work out $F(a)$ on its own line, then subtract all of it: $\mathord{\Big[-\cos x\Big]_0^{\pi}}=-\cos\pi-(-\cos0)=2$. With a negative limit, $-(-2)=+2$.
- An area question needs the zeros of $f$ first: $\mathord{\int_{-1}^{1}x\,dx}=0$, but the area between $y=x$ and the axis on $[-1,1]$ is $1$.
- Check every primitive by differentiating it back to $f$.`,
  },
  { id: 'u3', dates: '9 & 10 Nov', title: 'Integral by parts and integral by substitution', starred: true, upcoming: true },
  { id: 'u4', dates: '12 & 13 Nov', title: 'Application of integration: area, average, etc.', starred: true, upcoming: true },
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
  ],
};
