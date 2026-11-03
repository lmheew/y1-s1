// Content for the Calculus midterm 2 page (math/integrals/, the integral part of CLA1). Units follow the course
// schedule (integral part): one unit per lesson pair, in schedule order. The schedule slide gives dates, not day
// numbers, so units carry `dates` ("2 & 3 Nov") and no `days`. A lesson still to come has `upcoming: true` and shows
// as a greyed-out Summary tile; `starred` marks the lessons with an in-class quiz (the schedule's *).
// Markup: $inline$, $$display$$, **bold**, "- " list items (continuation lines join the item),
// blank line = new block. Every answer here is checked in verify.py (this folder).
const R = String.raw;
const NOV2 = '2026-11-02';
const NOV3 = '2026-11-03';

export const units = [
  {
    id: 'u1', quiz: null, dates: '2 & 3 Nov', added: NOV3,
    title: 'Riemann sum and definite integrals',
    intro: R`The schedule also lists a review of Calculus midterm 1 for these two classes. That paper, with worked answers, is under Past midterms on the Calculus midterm 1 page.`,
    ideas: R`
- **The idea:** to find the area under $y=f(x)$ from $x=a$ to $x=b$, cut it into $n$ thin strips, treat each strip as a rectangle, add up the rectangles, and let $n\to\infty$.
- **Strip width and sample points:** every strip has the same width
$$\Delta x=\frac{b-a}{n}$$
Strip $k$ (for $k=1,2,\dots,n$) runs from $a+(k-1)\Delta x$ to $a+k\Delta x$. Its height is $f(x_k)$ at one point $x_k$ of the strip:
$$\begin{aligned}\text{right end: }x_k&=a+k\,\Delta x\\[2pt]\text{left end: }x_k&=a+(k-1)\,\Delta x\\[2pt]\text{midpoint: }x_k&=a+\left(k-\tfrac{1}{2}\right)\Delta x\end{aligned}$$
So $x_k$ says where strip $k$ is, and $f(x_k)$ how tall it is. The slides write $N$ for the number of strips: it is the same as $n$ here.
- **Riemann sum and definite integral:**
$$\begin{gathered}S_n=\sum_{k=1}^{n}f(x_k)\,\Delta x\\[6pt]\int_a^b f(x)\,dx=\lim_{n\to\infty}S_n\end{gathered}$$
The sign $\int$ is a stretched S for "sum", and $dx$ comes from $\Delta x$. Here $a$ is the lower limit and $b$ the upper limit. The result is a number, so the letter for the variable doesn't matter: $\int_0^2x^2\,dx=\int_0^2t^2\,dt$.
- **The general definition:** the strips may have different widths $\Delta x_k$, with any point $\xi_k$ in strip $k$, as long as even the widest strip shrinks to $0$:
$$\int_a^b f(x)\,dx=\lim_{\max\Delta x_k\to0}\sum_{k=1}^{n}f(\xi_k)\,\Delta x_k$$
For a continuous $f$ every choice gives the same limit ($f$ is integrable). So equal strips and an endpoint, as in the five steps below, are always allowed.
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
- **Quick way:** for $x^m$ on $[0,L]$ the first four steps collapse into one line:
$$S_n=\left(\frac{L}{n}\right)^{m+1}\sum_{k=1}^{n}k^m$$
As $n\to\infty$ only the highest power of $n$ counts: $\sum k\approx\frac{n^2}{2}$, $\sum k^2\approx\frac{n^3}{3}$, $\sum k^3\approx\frac{n^4}{4}$, and $\frac{(n+1)(2n+1)}{n^2}\to2$. Write $S_n$ out in full first: the limit is the last step.
- **Signed area:** where $f<0$, the terms $f(x_k)\Delta x$ are negative, so the integral is the area above the $x$-axis minus the area below it. For the actual area, split at the zeros of $f$ and add the parts as positive numbers.
- **The class example, $x^2+x-2$ on $[0,2]$:** $f=(x+2)(x-1)$ is negative on $[0,1)$ and positive on $(1,2]$. With right ends,
$$S_n=\frac{2}{3}+\frac{6}{n}+\frac{4}{3n^2}\to\frac{2}{3}$$
The integral $\frac{2}{3}$ is $\frac{11}{6}$ above the axis (from $1$ to $2$) minus $\frac{7}{6}$ below it (from $0$ to $1$), but the area of the region is $\frac{11}{6}+\frac{7}{6}=3$. Practice works it out step by step.
- **Any interval $[a,b]$:** joining two intervals adds their integrals, so
$$\int_a^b f(x)\,dx=\int_0^b f(x)\,dx-\int_0^a f(x)\,dx$$
With the results on $[0,L]$:
$$\int_a^b x^m\,dx=\frac{b^{m+1}-a^{m+1}}{m+1}$$
For example $\int_1^2x^2\,dx=\frac{8-1}{3}=\frac{7}{3}$.
- **Properties:** for any order of $a$, $b$ and $c$,
$$\begin{aligned}\int_a^a f\,dx&=0\\[2pt]\int_b^a f\,dx&=-\int_a^b f\,dx\\[2pt]\int_a^b f\,dx+\int_b^c f\,dx&=\int_a^c f\,dx\\[2pt]\int_a^b c\,dx&=c\,(b-a)\end{aligned}$$
Sums split and constants come out:
$$\int_a^b(\alpha f+\beta g)\,dx=\alpha\int_a^b f\,dx+\beta\int_a^b g\,dx$$
And with $a\le b$: if $f\le g$ on $[a,b]$, then $\int_a^b f\,dx\le\int_a^b g\,dx$.
- **Definite integral and antiderivative:** $\int_a^b f(x)\,dx$ is a number, defined by Riemann sums. An antiderivative $F$, with $F'=f$, is a function. They meet in
$$\int_a^b f(x)\,dx=F(b)-F(a)$$
because the area $A(L)$ from $0$ to $L$ has $A'(L)=f(L)$: for $f(x)=x^2$, $A(L)=\frac{L^3}{3}$ and $A'(L)=L^2$. Primitive functions are the next lesson.
- **No formula for $F$:** every elementary function can be differentiated by the rules, but some have no antiderivative made of elementary functions, such as $\frac{\sin x}{x}$ and $e^{-x^2}$. Their integrals still exist, because a continuous function is integrable. For example $\int_0^1\frac{\sin x}{x}\,dx\approx0.946$ (with the value $1$ at $x=0$), from a Riemann sum or from its Taylor series integrated term by term. That is why the Riemann sum is the definition, and $F(b)-F(a)$ the shortcut when $F$ is known.`,
    watch: R`
- $\Delta x=\frac{b-a}{n}$. It is $\frac{1}{n}$ only when the interval has length $1$.
- When $a\ne0$, keep the $a$ in $x_k=a+k\Delta x$, and expand before you split the sum.
- A constant is added $n$ times: $\sum_{k=1}^{n}3=3n$, not $3$. In the class example the $-2$ gives $-4$ in $S_n$, not $-\frac{4}{n}$.
- Left ends use $k-1$: $\sum_{k=1}^{n}(k-1)=\frac{(n-1)n}{2}$.
- "Compute the Riemann sum" asks for $S_n$ as a formula in $n$. Write it out before you take the limit, and don't replace it with $F(b)-F(a)$.
- An integral is a signed area: $\mathord{\int_0^2(x-1)\,dx}=0$, yet the region between the line and the axis has area $1$.
- On $[a,b]$, subtract the part from $0$ to $a$: $\int_1^2x^2\,dx=\frac{8}{3}-\frac{1}{3}$, not $\frac{8}{3}$.
- Swapping the limits changes the sign: $\int_2^0x\,dx=-2$.`,
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
- When $f$ changes sign, find its zeros first: the integral and the area of the region are different answers.
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
    { src: 'Class example: x² + x − 2', added: NOV3,
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
    { src: 'Any interval [a, b]', added: NOV3,
      stem: R`Use $\displaystyle\int_a^b f\,dx=\int_0^b f\,dx-\int_0^a f\,dx$ and $\displaystyle\int_0^L x^m\,dx=\frac{L^{m+1}}{m+1}$ to compute:`,
      parts: [R`$\displaystyle\int_2^4 x\,dx$`, R`$\displaystyle\int_1^2 x^3\,dx$`, R`$\displaystyle\int_1^3(3x^2-2x+1)\,dx$`],
      hint: R`For (3), split the integral into three and take the constants out first.`,
      answer: [R`(1) $6$`, R`(2) $\frac{15}{4}$`, R`(3) $20$`],
      sol: R`
**(1)** $\frac{4^2}{2}-\frac{2^2}{2}=8-2=6$. Check: the region is a trapezoid with heights $2$ and $4$ and width $2$, so its area is $\frac{2+4}{2}\cdot2=6$.

**(2)** $\frac{2^4}{4}-\frac{1^4}{4}=4-\frac{1}{4}=\frac{15}{4}$

**(3)** Split and take the constants out:
$$3\int_1^3x^2\,dx-2\int_1^3x\,dx+\int_1^3 1\,dx$$

The three parts are $3\cdot\frac{27-1}{3}=26$, $2\cdot\frac{9-1}{2}=8$ and $3-1=2$, so the integral is $26-8+2=20$.` },
    { src: 'Properties of the integral', added: NOV3,
      stem: R`Suppose $\displaystyle\int_0^2 f\,dx=5$, $\displaystyle\int_0^5 f\,dx=2$ and $\displaystyle\int_0^2 g\,dx=-1$. Find:`,
      parts: [R`$\displaystyle\int_2^5 f\,dx$`, R`$\displaystyle\int_5^2 f\,dx$`, R`$\displaystyle\int_0^2(3f-2g)\,dx$`, R`$\displaystyle\int_2^2 f\,dx$`],
      hint: R`$\int_0^2+\int_2^5=\int_0^5$, and swapping the limits changes the sign.`,
      answer: [R`(1) $-3$`, R`(2) $3$`, R`(3) $17$`, R`(4) $0$`],
      sol: R`
**(1)** Joining the intervals: $\int_0^2 f\,dx+\int_2^5 f\,dx=\int_0^5 f\,dx$, so $\int_2^5 f\,dx=2-5=-3$.

**(2)** Swapping the limits changes the sign: $\int_5^2 f\,dx=-(-3)=3$.

**(3)** Split the sum and take the constants out: $3\cdot5-2\cdot(-1)=15+2=17$.

**(4)** An interval of width $0$ gives $0$.` },
    { src: 'An integral below zero', added: NOV3,
      stem: R`Let $f(x)=x^2-4$ on $[0,3]$.`,
      parts: [R`Where on $[0,3]$ is $f$ negative?`, R`Find $\displaystyle\int_0^3 f(x)\,dx$.`,
              R`Find the area of the region between $y=f(x)$ and the $x$-axis for $0\le x\le3$.`],
      hint: R`$x^2-4=(x-2)(x+2)$. For (3), split at the zero, and use $\int_2^3=\int_0^3-\int_0^2$.`,
      answer: [R`(1) on $[0,2)$`, R`(2) $-3$`, R`(3) $\frac{23}{3}$`],
      sol: R`
**(1)** $f(x)=(x-2)(x+2)$ is $0$ at $x=2$, negative before it and positive after it.

**(2)** $\frac{3^3}{3}-4\cdot3=9-12=-3$. The integral is negative because more of the region lies below the axis than above it.

**(3)** Below the axis: $\int_0^2 f\,dx=\frac{8}{3}-8=-\frac{16}{3}$, so that part has area $\frac{16}{3}$. Above it: $\int_2^3 f\,dx=-3-\left(-\frac{16}{3}\right)=\frac{7}{3}$.

The area is $\frac{16}{3}+\frac{7}{3}=\frac{23}{3}$, while the integral is $\frac{7}{3}-\frac{16}{3}=-3$.` },
  ],
};
