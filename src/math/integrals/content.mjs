// Content for the Calculus midterm 2 page (math/integrals/, the integral part of CLA1). Units follow the course
// schedule (integral part): one unit per lesson pair, in schedule order. The schedule slide gives dates, not day
// numbers, so units carry `dates` ("2 & 3 Nov") and no `days`. A lesson still to come has `upcoming: true` and shows
// as a greyed-out Summary tile; `starred` marks the lessons with an in-class quiz (the schedule's *).
// Markup: $inline$, $$display$$, **bold**, "- " list items (continuation lines join the item),
// blank line = new block. Every answer here is checked in verify.py (this folder).
const R = String.raw;
const NOV2 = '2026-11-02';

export const units = [
  {
    id: 'u1', quiz: null, dates: '2 & 3 Nov', added: NOV2,
    title: 'Riemann sum and definite integrals',
    intro: R`This class also went over Calculus midterm 1. That paper, with worked answers, is under Past midterms on the Calculus midterm 1 page.`,
    ideas: R`
- **The idea:** to find the area under $y=f(x)$ from $x=a$ to $x=b$, cut it into $n$ thin strips, treat each strip as a rectangle, add up the rectangles, and let $n\to\infty$.
- **Strip width and sample points:** every strip has the same width
$$\Delta x=\frac{b-a}{n}$$
Strip $k$ (for $k=1,2,\dots,n$) runs from $a+(k-1)\Delta x$ to $a+k\Delta x$. Its height is $f(x_k)$ at one point $x_k$ of the strip:
$$\begin{aligned}\text{right end: }x_k&=a+k\,\Delta x\\[2pt]\text{left end: }x_k&=a+(k-1)\,\Delta x\\[2pt]\text{midpoint: }x_k&=a+\left(k-\tfrac{1}{2}\right)\Delta x\end{aligned}$$
- **Riemann sum and definite integral:**
$$\begin{gathered}S_n=\sum_{k=1}^{n}f(x_k)\,\Delta x\\[6pt]\int_a^b f(x)\,dx=\lim_{n\to\infty}S_n\end{gathered}$$
The sign $\int$ is a stretched S for "sum", and $dx$ comes from $\Delta x$. Left ends, right ends and midpoints all give the same limit.
- **Partial sums:** the sum for $x^2$ needs the partial sum of $k^2$, and the one for $x^3$ that of $k^3$:
$$\begin{aligned}\sum_{k=1}^{n}1&=n\\[2pt]\sum_{k=1}^{n}k&=\frac{n(n+1)}{2}\\[2pt]\sum_{k=1}^{n}k^2&=\frac{n(n+1)(2n+1)}{6}\\[2pt]\sum_{k=1}^{n}k^3&=\frac{n^2(n+1)^2}{4}\end{aligned}$$
A constant comes out of the sum: $\sum c\,a_k=c\sum a_k$. With left ends, $\sum_{k=1}^{n}(k-1)^2=0^2+1^2+\dots+(n-1)^2$, so replace $n$ by $n-1$ in the formula.
- **Five steps:** find $\Delta x$, write $x_k$, work out $f(x_k)$, add up with the partial sums (constants out first), then let $n\to\infty$. When $a\ne0$, expand $f(a+k\Delta x)$ and split it into separate sums.
- **Upper and lower sums:** when $f$ is increasing, right ends give the upper sum and left ends the lower sum:
$$\text{lower sum}<\text{area}<\text{upper sum}$$
Both tend to the same number as $n\to\infty$, and that number is the area. For a decreasing $f$ it is the other way round.
- **The class example, $x^2$ from $0$ to $L$** (right ends, $x_k=\frac{kL}{n}$):
$$\begin{aligned}S_n&=\frac{L^3}{n^3}\sum_{k=1}^{n}k^2\\[4pt]&=\frac{L^3}{6}\cdot\frac{(n+1)(2n+1)}{n^2}\\[4pt]&\to\frac{L^3}{6}\cdot2=\frac{L^3}{3}\end{aligned}$$
That is one third of the $L\times L^2$ box around the region. The exercise, $x^3$ from $0$ to $L$, gives $S_n=\frac{L^4}{4}\left(1+\frac{1}{n}\right)^2\to\frac{L^4}{4}$. The pattern:
$$\int_0^L x^m\,dx=\frac{L^{m+1}}{m+1}$$
- **Quick limits:** as $n\to\infty$ only the highest power of $n$ counts, so $\frac{(n+1)(2n+1)}{n^2}\to2$ and $\frac{n+1}{n}\to1$. Write $S_n$ out in full first: the limit is the last step.
- **Signed area:** where $f<0$, the terms $f(x_k)\Delta x$ are negative, so the integral is the area above the $x$-axis minus the area below it. For the actual area, split at the zeros of $f$ and add the parts as positive numbers.
- **With an antiderivative:** if $F'=f$, then
$$\int_a^b f(x)\,dx=F(b)-F(a)$$
Primitive functions are the next lesson. Already now this checks a Riemann-sum answer: $F(x)=\frac{x^3}{3}$ gives $\frac{L^3}{3}$ at once.`,
    watch: R`
- $\Delta x=\frac{b-a}{n}$. It is $\frac{1}{n}$ only when the interval has length $1$.
- When $a\ne0$, keep the $a$ in $x_k=a+k\Delta x$, and expand before you split the sum.
- A constant is added $n$ times: $\sum_{k=1}^{n}3=3n$, not $3$.
- Left ends use $k-1$: $\sum_{k=1}^{n}(k-1)=\frac{(n-1)n}{2}$.
- "Compute the Riemann sum" asks for $S_n$ as a formula in $n$. Write it out before you take the limit.
- An integral is a signed area: $\mathord{\int_0^2(x-1)\,dx}=0$, yet the region between the line and the axis has area $1$.`,
  },
  { id: 'u2', dates: '5 & 6 Nov', title: 'Primitive functions (indefinite integrals)', starred: true, upcoming: true },
  { id: 'u3', dates: '9 & 10 Nov', title: 'Integral by parts and integral by substitution', starred: true, upcoming: true },
  { id: 'u4', dates: '12 & 13 Nov', title: 'Application of integration: area, average, etc.', starred: true, upcoming: true },
  { id: 'u5', dates: '16 & 17 Nov', title: 'Parametric and polar curves', starred: true, upcoming: true },
  { id: 'u6', dates: '19 & 20 Nov', title: 'Improper integrals and orthogonal functions', starred: true, upcoming: true },
];

export const habits = R`
- Write $\Delta x$ and $x_k$ first, then $f(x_k)$. Most mistakes happen in these two lines.
- Take constants out of every sum before you use a partial-sum formula, and remember $\sum_{k=1}^{n}c=cn$.
- Give $S_n$ as a formula in $n$, then take the limit. If you know an antiderivative, check the value with $F(b)-F(a)$.
- Keep answers exact: $\frac{16}{3}$, not $5.33$.`;

// ---------------- Practice ----------------
// ids are unit number.n (1.1, 1.2 …), kept in this page's own store, so they never meet Calculus midterm 1's marks
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
    { src: 'x² from 1 to 2', added: NOV2,
      stem: R`Compute $\displaystyle\int_1^2 x^2\,dx$ as the limit of the Riemann sum with right endpoints.`,
      parts: [R`Find $S_n$.`, R`Let $n\to\infty$.`],
      hint: R`$x_k=1+\frac{k}{n}$. Expand $\left(1+\frac{k}{n}\right)^2$ before you add.`,
      answer: [R`(1) $S_n=1+\frac{n+1}{n}+\frac{(n+1)(2n+1)}{6n^2}$`, R`(2) $\frac{7}{3}$`],
      sol: R`
$\Delta x=\frac{2-1}{n}=\frac{1}{n}$ and $x_k=1+\frac{k}{n}$. Expand the square:
$$f(x_k)=1+\frac{2k}{n}+\frac{k^2}{n^2}$$

**(1)** Multiply by $\frac{1}{n}$ and split into three sums:
$$\begin{aligned}S_n&=\frac{1}{n}\sum_{k=1}^{n}1+\frac{2}{n^2}\sum_{k=1}^{n}k\\&\quad+\frac{1}{n^3}\sum_{k=1}^{n}k^2\\&=1+\frac{n+1}{n}+\frac{(n+1)(2n+1)}{6n^2}\end{aligned}$$

**(2)** $1+1+\frac{2}{6}=\frac{7}{3}$. Check: $F(x)=\frac{x^3}{3}$ gives $\frac{8}{3}-\frac{1}{3}=\frac{7}{3}$.` },
    { src: 'A decreasing function', added: NOV2,
      stem: R`Let $f(x)=4-x^2$ on $[0,2]$.`,
      parts: [R`Find the right-endpoint sum $S_n$.`, R`Find $\displaystyle\int_0^2(4-x^2)\,dx$.`, R`Is $S_n$ above or below the area? Why?`],
      hint: R`$f$ is decreasing on $[0,2]$, so the right end is the lowest point of each strip.`,
      answer: [R`(1) $S_n=8-\frac{4(n+1)(2n+1)}{3n^2}$`, R`(2) $\frac{16}{3}$`, R`(3) below the area: a lower sum`],
      sol: R`
$\Delta x=\frac{2}{n}$ and $x_k=\frac{2k}{n}$, so $f(x_k)=4-\frac{4k^2}{n^2}$.

**(1)** Multiply by $\frac{2}{n}$ and split:
$$\begin{aligned}S_n&=\frac{8}{n}\sum_{k=1}^{n}1-\frac{8}{n^3}\sum_{k=1}^{n}k^2\\&=8-\frac{8}{n^3}\cdot\frac{n(n+1)(2n+1)}{6}\\&=8-\frac{4(n+1)(2n+1)}{3n^2}\end{aligned}$$

**(2)** The fraction tends to $\frac{4\cdot2}{3}=\frac{8}{3}$, so the integral is $8-\frac{8}{3}=\frac{16}{3}$.

**(3)** Below. $f$ is decreasing, so the right end is the lowest point of each strip and every rectangle fits under the curve: $S_n$ is a lower sum. Indeed $(n+1)(2n+1)>2n^2$, so $S_n<\frac{16}{3}$ for every $n$.` },
    { src: 'Cubes, with left endpoints', added: NOV2,
      stem: R`Compute $\displaystyle\int_0^2 x^3\,dx$ as the limit of the Riemann sum with left endpoints. Use $\displaystyle\sum_{k=1}^{n}k^3=\frac{n^2(n+1)^2}{4}$.`,
      parts: [R`Find $S_n$.`, R`Let $n\to\infty$.`],
      hint: R`Left endpoints: $x_k=\frac{2(k-1)}{n}$. The sum of $(k-1)^3$ runs over $0,1,\dots,n-1$.`,
      answer: [R`(1) $S_n=4\left(1-\frac{1}{n}\right)^2$`, R`(2) $4$`],
      sol: R`
$\Delta x=\frac{2}{n}$ and $x_k=\frac{2(k-1)}{n}$, so each rectangle is
$$f(x_k)\,\Delta x=\frac{8(k-1)^3}{n^3}\cdot\frac{2}{n}=\frac{16(k-1)^3}{n^4}$$

The sum of $(k-1)^3$ is $0^3+1^3+\dots+(n-1)^3$, so replace $n$ by $n-1$ in the formula: it equals $\frac{(n-1)^2n^2}{4}$.

**(1)** $S_n=\frac{16}{n^4}\cdot\frac{(n-1)^2n^2}{4}=\frac{4(n-1)^2}{n^2}=4\left(1-\frac{1}{n}\right)^2$

**(2)** $\frac{1}{n}\to0$, so the integral is $4$: that is $\frac{L^4}{4}$ with $L=2$. Since $x^3$ is increasing, left sums are lower sums, and indeed $S_n<4$ for every $n$.` },
    { src: 'Signed area', added: NOV2,
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
    { src: 'From a limit to an integral', added: NOV2,
      stem: R`Each limit is a Riemann sum with right endpoints. Write it as a definite integral and find its value.`,
      parts: [R`$\displaystyle\lim_{n\to\infty}\sum_{k=1}^{n}\left(\frac{k}{n}\right)^3\frac{1}{n}$`, R`$\displaystyle\lim_{n\to\infty}\sum_{k=1}^{n}\left(1+\frac{2k}{n}\right)^2\frac{2}{n}$`],
      hint: R`Find $\Delta x=\frac{b-a}{n}$ first, then read $a$ from $x_k=a+k\Delta x$.`,
      answer: [R`(1) $\displaystyle\int_0^1 x^3\,dx=\frac{1}{4}$`, R`(2) $\displaystyle\int_1^3 x^2\,dx=\frac{26}{3}$`],
      sol: R`
**(1)** $\Delta x=\frac{1}{n}$ and $x_k=\frac{k}{n}$, so $a=0$, $b=1$ and $f(x)=x^3$. With $\int_0^L x^3\,dx=\frac{L^4}{4}$ and $L=1$, the value is $\frac{1}{4}$.

**(2)** $\Delta x=\frac{2}{n}$, so $b-a=2$. The sample point $x_k=1+\frac{2k}{n}$ starts from $a=1$, so $b=3$ and $f(x)=x^2$.

The area under $x^2$ from $1$ to $3$ is the area from $0$ to $3$ minus the area from $0$ to $1$: $\frac{27}{3}-\frac{1}{3}=\frac{26}{3}$.

Reading (2) as $\int_0^2(1+x)^2\,dx$, with $x_k=\frac{2k}{n}$, is also right and gives the same value.` },
  ],
};
