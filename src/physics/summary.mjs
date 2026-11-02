// The Summary tab: for every module of Chapters 1–8 (titles in content.mjs), its key ideas in a few short points and
// one worked example, then a "Watch out" list for each chapter and exam-day habits at the end. The examples are
// original, solved step by step (one step per paragraph or list item of `sol`), and checked numerically in
// verify_summary.py. Markup as in quizzes.mjs; in `ideas`, key formulas stand full size on their own line as $$…$$.
const R = String.raw;
export const SUMMARY_ADDED = '2026-11-02';
const T37 = R`Use $\sin37^\circ\approx0.60$ and $\cos37^\circ\approx0.80$.`;

export const summary = {
  // ===================================================================================================================
  c1: { mods: [
    { no: '1-1',
      ideas: R`
- **SI units.** Mechanics needs three base quantities: length in metres (m), mass in kilograms (kg) and time in seconds (s). Every other unit is built from them, such as $1\text{ N}=1\text{ kg}\cdot\text{m/s}^2$.
- **Prefixes.** $\text{k}=10^3$, $\text{M}=10^6$, $\text{G}=10^9$; $\text{c}=10^{-2}$, $\text{m}=10^{-3}$, $\mu=10^{-6}$, $\text{n}=10^{-9}$.
- **Changing units.** Multiply by conversion factors equal to $1$, so the unit you don't want cancels. For areas and volumes, square or cube the factor.
- **Significant figures.** A sum or difference keeps the fewest decimal places; a product or quotient keeps the fewest significant figures.`,
      ex: {
        stem: R`Give each answer in SI units, with the right number of significant figures.`,
        parts: [
          R`A car moves at $72.0$ km/h. Express its speed in m/s.`,
          R`A sticker has an area of $3.0\text{ cm}^2$. Express it in $\text{m}^2$.`,
          R`Add $4.2$ m and $0.135$ m.`,
          R`Multiply $2.50$ m by $0.0040$ m.`,
        ],
        answer: [R`$20.0$ m/s`, R`$3.0\times10^{-4}\text{ m}^2$`, R`$4.3$ m`, R`$0.010\text{ m}^2$`],
        sol: R`**(a)** $72.0\ \frac{\text{km}}{\text{h}}\times\frac{1000\text{ m}}{1\text{ km}}\times\frac{1\text{ h}}{3600\text{ s}}=\frac{72\,000}{3600}\ \frac{\text{m}}{\text{s}}=20.0$ m/s.

**(b)** $1\text{ cm}=10^{-2}$ m, so $1\text{ cm}^2=(10^{-2}\text{ m})^2=10^{-4}\text{ m}^2$ and $3.0\text{ cm}^2=3.0\times10^{-4}\text{ m}^2$.

**(c)** $4.2+0.135=4.335$ m, but $4.2$ is only known to the tenths, so the sum is $4.3$ m.

**(d)** $2.50\times0.0040=0.0100\text{ m}^2$. $0.0040$ has two significant figures (leading zeros don't count), so the product is $0.010\text{ m}^2$.`,
      } },
    { no: '1-2',
      ideas: R`
- **The second** is defined by an atomic clock: $9\,192\,631\,770$ oscillations of the light from a cesium-133 atom.
- **The metre** is defined by the speed of light, exactly $c=299\,792\,458$ m/s: one metre is the distance light travels in $\frac{1}{299\,792\,458}$ s.
- **Time units** convert like any other: $1\text{ day}=24\times3600\text{ s}=86\,400$ s.`,
      ex: {
        stem: R`Use $c\approx3.00\times10^8$ m/s.`,
        parts: [R`How many seconds are there in one day?`, R`How far does light travel in $1.00$ ns?`, R`About how many days is $1.00\times10^6$ s?`],
        answer: [R`$86\,400$ s`, R`$0.300$ m ($30.0$ cm)`, R`About $11.6$ days`],
        sol: R`**(a)** $1\text{ day}\times\frac{24\text{ h}}{1\text{ day}}\times\frac{3600\text{ s}}{1\text{ h}}=86\,400$ s.

**(b)** $d=ct=(3.00\times10^8\text{ m/s})(1.00\times10^{-9}\text{ s})=0.300$ m, about the length of a ruler.

**(c)** $\frac{1.00\times10^6\text{ s}}{86\,400\text{ s/day}}\approx11.6$ days.`,
      } },
    { no: '1-3',
      ideas: R`
- **The kilogram** is the SI unit of mass. Atoms are weighed in atomic mass units, $1\text{ u}=1.66\times10^{-27}$ kg; a carbon-12 atom is exactly $12$ u.
- **Density** is mass per unit volume, in $\text{kg/m}^3$:
$$\rho=\frac{m}{V}$$
and $1\text{ g/cm}^3=10^3\text{ kg/m}^3$.`,
      ex: {
        stem: R`An aluminium cube is $2.00$ cm on each side and has a mass of $21.6$ g.`,
        parts: [
          R`Find its volume in $\text{m}^3$.`,
          R`Find its density in $\text{kg/m}^3$, to the right number of significant figures.`,
          R`Give the same density in $\text{g/cm}^3$.`,
          R`The cube is melted and drawn into a wire with a cross-section of $1.00\text{ mm}^2$. How long is the wire?`,
        ],
        answer: [R`$8.00\times10^{-6}\text{ m}^3$`, R`$2.70\times10^3\text{ kg/m}^3$`, R`$2.70\text{ g/cm}^3$`, R`$8.00$ m`],
        sol: R`**(a)** $V=(2.00\text{ cm})^3=8.00\text{ cm}^3$, and $1\text{ cm}^3=(10^{-2}\text{ m})^3=10^{-6}\text{ m}^3$, so $V=8.00\times10^{-6}\text{ m}^3$.

**(b)** $m=21.6\text{ g}=21.6\times10^{-3}$ kg, so $\rho=\frac{m}{V}=\frac{21.6\times10^{-3}}{8.00\times10^{-6}}=2.70\times10^3\text{ kg/m}^3$. Both measurements have three significant figures, so the quotient keeps three.

**(c)** $\rho=\frac{21.6\text{ g}}{8.00\text{ cm}^3}=2.70\text{ g/cm}^3$. **Check** $1\text{ g/cm}^3=\frac{10^{-3}\text{ kg}}{10^{-6}\text{ m}^3}=10^3\text{ kg/m}^3$.

**(d)** Melting keeps the volume: $8.00\text{ cm}^3=8.00\times10^3\text{ mm}^3$, since $1\text{ cm}^3=(10\text{ mm})^3$. Then $L=\frac{V}{A}=\frac{8.00\times10^3\text{ mm}^3}{1.00\text{ mm}^2}=8.00\times10^3\text{ mm}=8.00$ m.`,
      } },
  ], watch: R`
- Converting $\text{cm}^2$ or $\text{cm}^3$ with the length factor alone: $1\text{ m}^2=10^4\text{ cm}^2$, not $10^2$.
- Rounding in the middle of a calculation. Keep extra digits and round only the final answer.` },

  // ===================================================================================================================
  c2: { mods: [
    { no: '2-1',
      ideas: R`
- **Displacement** $\Delta x=x_2-x_1$ has a sign; the distance is the total length of the path.
- **Average velocity** is displacement over time, the slope of the secant on the $x$–$t$ graph:
$$v_\text{avg}=\frac{\Delta x}{\Delta t}$$
- **Average speed** is the total distance over the time, so it is never negative.`,
      ex: {
        stem: R`A car drives $60$ km east in $1.0$ h, then $30$ km west in $0.50$ h. Take east as $+x$.`,
        parts: [R`Find the displacement and the total distance.`, R`Find the average velocity.`, R`Find the average speed.`],
        answer: [R`$+30$ km ($30$ km east); $\ 90$ km`, R`$+20$ km/h ($20$ km/h east)`, R`$60$ km/h`],
        sol: R`**(a)** $\Delta x=+60-30=+30$ km. The distance adds the legs without signs: $60+30=90$ km.

**(b)** The trip takes $1.5$ h in all: $v_\text{avg}=\frac{+30\text{ km}}{1.5\text{ h}}=+20$ km/h.

**(c)** $s_\text{avg}=\frac{90\text{ km}}{1.5\text{ h}}=60$ km/h. It is larger than $|v_\text{avg}|$ because the car turned back.`,
      } },
    { no: '2-2',
      ideas: R`
- **Instantaneous velocity** is the derivative of position, the slope of the tangent on the $x$–$t$ graph:
$$v=\frac{dx}{dt}$$
- **Speed** is its size, $|v|$. The particle is momentarily at rest where $v=0$.`,
      ex: {
        stem: R`A particle moves along the $x$-axis with $x(t)=5+12t-2t^3$ ($x$ in metres, $t$ in seconds).`,
        parts: [R`Find $v(t)$.`, R`Find the velocity at $t=1.0$ s and the speed at $t=2.0$ s.`, R`When is the particle momentarily at rest?`],
        answer: [R`$v=12-6t^2$ (m/s)`, R`$6.0$ m/s; $\ 12$ m/s`, R`At $t=\sqrt{2}\approx1.4$ s`],
        sol: R`**(a)** Differentiate term by term: $v=\frac{dx}{dt}=0+12-6t^2$.

**(b)** $v(1)=12-6=6.0$ m/s. $v(2)=12-24=-12$ m/s, so the speed is $|v|=12$ m/s, moving in the $-x$ direction.

**(c)** $12-6t^2=0$ gives $t^2=2$, so $t=\sqrt{2}$ s. The negative root is before the motion starts.`,
      } },
    { no: '2-3',
      ideas: R`
- **Acceleration** is the derivative of velocity:
$$a=\frac{dv}{dt}=\frac{d^2x}{dt^2},\qquad a_\text{avg}=\frac{\Delta v}{\Delta t}$$
- **Speeding up or slowing down:** the same sign for $v$ and $a$ means speeding up, opposite signs mean slowing down. A negative $a$ alone doesn't mean slowing down.`,
      ex: {
        stem: R`A particle moves with $x(t)=5+12t-2t^3$ (SI units), so its velocity is $v(t)=12-6t^2$.`,
        parts: [R`Find $a(t)$.`, R`Find the average acceleration from $t=0$ to $t=2.0$ s.`, R`At $t=1.0$ s and at $t=2.0$ s, is the particle speeding up or slowing down?`],
        answer: [R`$a=-12t$ (m/s²)`, R`$-12\text{ m/s}^2$`, R`Slowing down at $1.0$ s; speeding up at $2.0$ s`],
        sol: R`**(a)** $a=\frac{dv}{dt}=-12t$.

**(b)** $a_\text{avg}=\frac{v(2)-v(0)}{2-0}=\frac{-12-12}{2}=-12\text{ m/s}^2$. It equals $a(1)$, the value at the middle of the interval, because $a$ changes linearly.

**(c)** At $t=1$: $v=6$ m/s and $a=-12\text{ m/s}^2$, opposite signs, so it is slowing down. At $t=2$: $v=-12$ m/s and $a=-24\text{ m/s}^2$, the same sign, so it is speeding up in the $-x$ direction.`,
      } },
    { no: '2-4',
      ideas: R`
- **Five equations** hold for constant acceleration, each without one of $x-x_0$, $v$, $v_0$, $a$ and $t$:
$$\begin{aligned}v&=v_0+at\\x-x_0&=v_0t+\tfrac{1}{2}at^2\\v^2&=v_0^2+2a(x-x_0)\\x-x_0&=\tfrac{1}{2}(v_0+v)t\\x-x_0&=vt-\tfrac{1}{2}at^2\end{aligned}$$
- **Choosing one:** list what you know and what you want, then use the equation without the quantity that is neither.`,
      ex: {
        stem: R`A car moving at $20$ m/s brakes with constant deceleration and stops in $40$ m.`,
        parts: [R`Find its acceleration.`, R`How long does it take to stop?`, R`How far does it travel in the first $2.0$ s of braking?`],
        answer: [R`$-5.0\text{ m/s}^2$`, R`$4.0$ s`, R`$30$ m`],
        sol: R`**(a)** No time is given or asked, so use $v^2=v_0^2+2a(x-x_0)$: $0=20^2+2a(40)$, so $a=-\frac{400}{80}=-5.0\text{ m/s}^2$.

**(b)** $v=v_0+at$: $0=20-5.0t$, so $t=4.0$ s.

**(c)** $x-x_0=v_0t+\frac{1}{2}at^2=20(2.0)-\frac{1}{2}(5.0)(2.0)^2=40-10=30$ m: three quarters of the stopping distance in the first half of the time.`,
      } },
    { no: '2-5',
      ideas: R`
- **Free fall** is constant acceleration with $a=-g$ ($y$ up, $g=9.8\text{ m/s}^2$), the same for every mass when air is ignored.
- **At the top** $v=0$, but the acceleration is still $-g$. The way down mirrors the way up: the same time, and the same speed at each height.`,
      ex: {
        stem: R`A ball is thrown straight up from the ground at $19.6$ m/s. Take $y$ upward, $g=9.8\text{ m/s}^2$, and ignore air.`,
        parts: [R`How long does it take to reach the top, and how high does it go?`, R`Find its velocity and height at $t=3.0$ s.`, R`When does it land, and with what velocity?`],
        answer: [R`$2.0$ s; $\ 19.6$ m`, R`$v=-9.8$ m/s (falling); $\ y=14.7$ m`, R`At $t=4.0$ s, with $v=-19.6$ m/s`],
        sol: R`**Set up** The acceleration is $a=-g$ throughout, so the constant-acceleration equations apply with $v_0=19.6$ m/s.

**(a)** At the top $v=0$: $0=19.6-9.8t$, so $t=2.0$ s. With $v^2=v_0^2-2gy$ and $v=0$: $y_\text{max}=\frac{v_0^2}{2g}=\frac{19.6^2}{19.6}=19.6$ m.

**(b)** $v=19.6-9.8(3.0)=-9.8$ m/s: already on the way down. $y=19.6(3.0)-\frac{1}{2}(9.8)(3.0)^2=58.8-44.1=14.7$ m.

**(c)** $y=0$: $t(19.6-4.9t)=0$, so $t=4.0$ s, twice the time up. Then $v=19.6-9.8(4.0)=-19.6$ m/s: the launch speed, pointing down.`,
      } },
    { no: '2-6',
      ideas: R`
- **Slopes and areas:** the slope of the $x$–$t$ graph is $v$ and the slope of the $v$–$t$ graph is $a$. Going back, areas add up:
$$v_1-v_0=\int_{t_0}^{t_1}a\,dt,\qquad x_1-x_0=\int_{t_0}^{t_1}v\,dt$$
- **Signed areas:** area below the time axis counts as negative.`,
      ex: {
        stem: R`An object starts from rest at $x=0$. Its acceleration is shown in the graph: $2.0\text{ m/s}^2$ from $0$ to $3.0$ s, zero from $3.0$ to $5.0$ s, and $-3.0\text{ m/s}^2$ from $5.0$ to $7.0$ s.`,
        fig: 's2-6',
        parts: [R`Find the velocity at $t=3.0$, $5.0$ and $7.0$ s, and sketch the $v$–$t$ graph.`, R`Find the position at $t=7.0$ s.`],
        answer: [R`$6.0$, $6.0$ and $0$ m/s: up a straight line to $6.0$ m/s, level, then down to $0$`, R`$x=27$ m`],
        sol: R`**(a)** Each area under the $a$–$t$ graph is a change in velocity: $2.0\times3.0=+6.0$ m/s, then $0$, then $-3.0\times2.0=-6.0$ m/s. So $v=6.0$ m/s at $3.0$ s, still $6.0$ m/s at $5.0$ s, and $0$ at $7.0$ s.

[[fig:s2-6a]]

**(b)** The area under the $v$–$t$ graph is the displacement: $\frac{1}{2}(3.0)(6.0)+(2.0)(6.0)+\frac{1}{2}(2.0)(6.0)=9+12+6=27$ m.`,
      } },
  ], watch: R`
- Using the constant-acceleration equations when $a$ changes with time. Differentiate or integrate instead.
- A double minus: writing $g=-9.8\text{ m/s}^2$ and then $a=-g$. Keep $g$ positive.
- Displacement and distance differ once the object turns around: split the motion where $v=0$.` },

  // ===================================================================================================================
  c3: { mods: [
    { no: '3-1',
      ideas: R`
- **Components:** a vector of magnitude $a$ at angle $\theta$, counterclockwise from $+x$, has
$$a_x=a\cos\theta,\qquad a_y=a\sin\theta$$
- **Back again:** $a=\sqrt{a_x^2+a_y^2}$ and $\tan\theta=\frac{a_y}{a_x}$. When $a_x<0$, add $180^\circ$ to what $\tan^{-1}$ gives.`,
      ex: {
        stem: T37,
        parts: [
          R`A displacement $\vec{d}$ is $10$ m long, at $37^\circ$ counterclockwise from the $+x$-axis. Find its components.`,
          R`A vector $\vec{a}$ has $a_x=-3.0$ m and $a_y=4.0$ m. Find its magnitude and direction.`,
        ],
        answer: [R`$d_x=8.0$ m; $\ d_y=6.0$ m`, R`$5.0$ m, at $127^\circ$ from $+x$`],
        sol: R`**(a)** $d_x=10\cos37^\circ=8.0$ m and $d_y=10\sin37^\circ=6.0$ m.

**(b)** $a=\sqrt{(-3.0)^2+4.0^2}=5.0$ m. $\tan\theta=\frac{4.0}{-3.0}$, and $\tan^{-1}$ alone gives $-53^\circ$. But $a_x<0$ and $a_y>0$ put the vector in the second quadrant, so $\theta=-53^\circ+180^\circ=127^\circ$.`,
      } },
    { no: '3-2',
      ideas: R`
- **Unit-vector notation:** $\vec{a}=a_x\hat{i}+a_y\hat{j}+a_z\hat{k}$, where $\hat{i}$, $\hat{j}$ and $\hat{k}$ have length $1$ along the axes.
- **Adding by components:** add or subtract the $x$, $y$ and $z$ parts separately. A number multiplies every component.`,
      ex: {
        stem: R`Take $\vec{d}=8.0\hat{i}+6.0\hat{j}$ and $\vec{e}=-2.0\hat{i}+2.0\hat{j}$, both in metres.`,
        parts: [R`Find $\vec{s}=\vec{d}+\vec{e}$, its magnitude and its direction.`, R`Find $\vec{d}-2\vec{e}$.`],
        answer: [R`$\vec{s}=6.0\hat{i}+8.0\hat{j}$ (m): $10$ m at $53^\circ$ from $+x$`, R`$12\hat{i}+2.0\hat{j}$ (m)`],
        sol: R`**(a)** $s_x=8.0-2.0=6.0$ m and $s_y=6.0+2.0=8.0$ m. Then $s=\sqrt{6.0^2+8.0^2}=10$ m, and $\tan\theta=\frac{8.0}{6.0}$ with $s_x>0$, so $\theta=53^\circ$.

**(b)** $2\vec{e}=-4.0\hat{i}+4.0\hat{j}$, so $\vec{d}-2\vec{e}=(8.0+4.0)\hat{i}+(6.0-4.0)\hat{j}=12\hat{i}+2.0\hat{j}$ m.`,
      } },
    { no: '3-3',
      ideas: R`
- **Dot product,** a scalar:
$$\vec{a}\cdot\vec{b}=ab\cos\phi=a_xb_x+a_yb_y+a_zb_z$$
It is zero for perpendicular vectors and gives the angle between two vectors.
- **Cross product,** a vector perpendicular to both by the right-hand rule: $|\vec{a}\times\vec{b}|=ab\sin\phi$ and $\vec{b}\times\vec{a}=-\vec{a}\times\vec{b}$. In components, expand the determinant with $\hat{i}$, $\hat{j}$, $\hat{k}$ in the top row.`,
      ex: {
        stem: R`Take $\vec{a}=\hat{i}+\hat{j}$ and $\vec{b}=\hat{j}+\hat{k}$.`,
        parts: [R`Find $\vec{a}\cdot\vec{b}$.`, R`Find the angle between $\vec{a}$ and $\vec{b}$.`, R`Find $\vec{a}\times\vec{b}$.`, R`Check that $|\vec{a}\times\vec{b}|=ab\sin\phi$.`],
        answer: [R`$1$`, R`$60^\circ$`, R`$\hat{i}-\hat{j}+\hat{k}$`, R`Both are $\sqrt{3}$`],
        sol: R`**(a)** $\vec{a}\cdot\vec{b}=(1)(0)+(1)(1)+(0)(1)=1$.

**(b)** $a=b=\sqrt{2}$, so $\cos\phi=\frac{\vec{a}\cdot\vec{b}}{ab}=\frac{1}{2}$ and $\phi=60^\circ$.

**(c)** Component by component:
- $\hat{i}$: $a_yb_z-a_zb_y=(1)(1)-(0)(1)=1$
- $\hat{j}$: $a_zb_x-a_xb_z=(0)(0)-(1)(1)=-1$
- $\hat{k}$: $a_xb_y-a_yb_x=(1)(1)-(1)(0)=1$

**(d)** $|\vec{a}\times\vec{b}|=\sqrt{1+1+1}=\sqrt{3}$, and $ab\sin\phi=\sqrt{2}\cdot\sqrt{2}\cdot\sin60^\circ=2\cdot\frac{\sqrt{3}}{2}=\sqrt{3}$.`,
      } },
  ], watch: R`
- The angle from $\tan\theta=\frac{a_y}{a_x}$ is off by $180^\circ$ when $a_x<0$: check the vector's quadrant.
- The middle ($\hat{j}$) term of the determinant takes a minus sign.
- $\vec{a}\times\vec{b}$ and $\vec{b}\times\vec{a}$ point in opposite directions.` },

  // ===================================================================================================================
  c4: { mods: [
    { no: '4-1',
      ideas: R`
- **The position vector** $\vec{r}=x\hat{i}+y\hat{j}+z\hat{k}$ points from the origin to the particle.
- **Displacement** $\Delta\vec{r}=\vec{r}_2-\vec{r}_1$: subtract each component.`,
      ex: {
        stem: R`A particle moves from $\vec{r}_1=2.0\hat{i}+3.0\hat{j}$ to $\vec{r}_2=5.0\hat{i}-1.0\hat{j}$, in metres.`,
        parts: [R`Find its displacement.`, R`Find the size and direction of the displacement.`],
        answer: [R`$\Delta\vec{r}=3.0\hat{i}-4.0\hat{j}$ (m)`, R`$5.0$ m, at $53^\circ$ below the $+x$-axis`],
        sol: R`**(a)** $\Delta\vec{r}=(5.0-2.0)\hat{i}+(-1.0-3.0)\hat{j}=3.0\hat{i}-4.0\hat{j}$ m.

**(b)** $|\Delta\vec{r}|=\sqrt{3.0^2+4.0^2}=5.0$ m. $\tan\theta=\frac{-4.0}{3.0}$ with $\Delta x>0$, so $\theta=-53^\circ$: $53^\circ$ below the $+x$-axis.`,
      } },
    { no: '4-2',
      ideas: R`
- **Velocity** is the derivative of the position vector, one component at a time, and is always tangent to the path:
$$\vec{v}=\frac{d\vec{r}}{dt}=\frac{dx}{dt}\hat{i}+\frac{dy}{dt}\hat{j}+\frac{dz}{dt}\hat{k}$$
- **Average velocity** $\vec{v}_\text{avg}=\frac{\Delta\vec{r}}{\Delta t}$ points along the displacement.`,
      ex: {
        stem: R`A particle moves in the $xy$-plane with $\vec{r}(t)=3t\,\hat{i}+(4t-t^2)\,\hat{j}$ (in metres, $t$ in seconds).`,
        parts: [R`Find $\vec{v}(t)$.`, R`Find the velocity and the speed at $t=2.0$ s.`, R`Find the average velocity from $t=0$ to $t=2.0$ s.`],
        answer: [R`$\vec{v}=3\hat{i}+(4-2t)\hat{j}$ (m/s)`, R`$3.0\hat{i}$ m/s; $\ 3.0$ m/s`, R`$3.0\hat{i}+2.0\hat{j}$ (m/s)`],
        sol: R`**(a)** Differentiate each component: $v_x=\frac{d}{dt}(3t)=3$ and $v_y=\frac{d}{dt}(4t-t^2)=4-2t$.

**(b)** $\vec{v}(2)=3\hat{i}+0\hat{j}$: $3.0$ m/s along $+x$. Here $y$ is largest, so the path is momentarily level, and the velocity, tangent to it, is horizontal.

**(c)** $\vec{r}(0)=\vec{0}$ and $\vec{r}(2)=6\hat{i}+4\hat{j}$, so $\vec{v}_\text{avg}=\frac{6\hat{i}+4\hat{j}}{2.0}=3.0\hat{i}+2.0\hat{j}$ m/s.`,
      } },
    { no: '4-3',
      ideas: R`
- **Acceleration** is the derivative of the velocity vector:
$$\vec{a}=\frac{d\vec{v}}{dt}=\frac{dv_x}{dt}\hat{i}+\frac{dv_y}{dt}\hat{j}+\frac{dv_z}{dt}\hat{k}$$
- **Speeding up or slowing down:** look at $\vec{v}\cdot\vec{a}$. Positive means speeding up, negative slowing down, and zero means only the direction is turning at that moment.`,
      ex: {
        stem: R`A particle has velocity $\vec{v}(t)=3\hat{i}+(4-2t)\hat{j}$, in m/s.`,
        parts: [R`Find its acceleration.`, R`Find the average acceleration from $t=0$ to $t=2.0$ s.`, R`At $t=1.0$ s, is it speeding up or slowing down?`],
        answer: [R`$\vec{a}=-2\hat{j}\text{ m/s}^2$, constant`, R`$-2.0\hat{j}\text{ m/s}^2$`, R`Slowing down`],
        sol: R`**(a)** $a_x=\frac{d}{dt}(3)=0$ and $a_y=\frac{d}{dt}(4-2t)=-2$: $\vec{a}=-2\hat{j}\text{ m/s}^2$ at every moment.

**(b)** $\vec{a}_\text{avg}=\frac{\vec{v}(2)-\vec{v}(0)}{2.0}=\frac{3\hat{i}-(3\hat{i}+4\hat{j})}{2.0}=-2.0\hat{j}\text{ m/s}^2$, the same as $\vec{a}$ because it is constant.

**(c)** $\vec{v}(1)=3\hat{i}+2\hat{j}$ and $\vec{v}\cdot\vec{a}=(3)(0)+(2)(-2)=-4<0$: part of the acceleration opposes the velocity, so the speed is decreasing. **Check** The speed is $\sqrt{13}\approx3.6$ m/s at $t=1$ and $3.0$ m/s at $t=2$.`,
      } },
    { no: '4-4',
      ideas: R`
- **Two motions at once:** horizontally a constant velocity $v_0\cos\theta_0$, vertically free fall starting at $v_0\sin\theta_0$. The time $t$ links them:
$$\begin{gathered}x-x_0=(v_0\cos\theta_0)\,t\\y-y_0=(v_0\sin\theta_0)\,t-\tfrac{1}{2}gt^2\end{gathered}$$
- **The range** on level ground is $R=\frac{v_0^2}{g}\sin2\theta_0$, largest at $45^\circ$. At the top $v_y=0$, but $v_x$ is unchanged.`,
      ex: {
        stem: R`A ball is kicked from level ground at $19.6$ m/s, $30^\circ$ above the horizontal. Take $g=9.8\text{ m/s}^2$ and ignore air.`,
        parts: [R`Find the horizontal and vertical components of the launch velocity.`, R`When is the ball highest, and how high is it?`, R`Find the time of flight and the range.`, R`Find the velocity just before it lands.`],
        answer: [R`$v_{0x}=9.8\sqrt{3}\approx17$ m/s; $\ v_{0y}=9.8$ m/s`, R`At $t=1.0$ s, $4.9$ m high`, R`$2.0$ s; $\ 19.6\sqrt{3}\approx34$ m`, R`$19.6$ m/s at $30^\circ$ below the horizontal`],
        sol: R`**(a)** $v_{0x}=19.6\cos30^\circ=19.6\cdot\frac{\sqrt{3}}{2}=9.8\sqrt{3}$ m/s and $v_{0y}=19.6\sin30^\circ=9.8$ m/s.

**(b)** At the top $v_y=0$: $9.8-9.8t=0$, so $t=1.0$ s. The height is $\frac{v_{0y}^2}{2g}=\frac{9.8^2}{2(9.8)}=4.9$ m.

**(c)** On level ground the way down takes as long as the way up: $2.0$ s in all. The horizontal velocity never changes, so $R=9.8\sqrt{3}\times2.0=19.6\sqrt{3}$ m. **Check** $R=\frac{v_0^2}{g}\sin60^\circ=\frac{19.6^2}{9.8}\cdot\frac{\sqrt{3}}{2}=19.6\sqrt{3}$ m.

**(d)** $v_x=9.8\sqrt{3}$ m/s as before, and $v_y=9.8-9.8(2.0)=-9.8$ m/s. The speed is $19.6$ m/s again, now $30^\circ$ below the horizontal: the flight is symmetric.`,
      } },
    { no: '4-5',
      ideas: R`
- **Constant speed, turning direction:** the velocity changes, so there is an acceleration, and it points to the centre:
$$a=\frac{v^2}{r},\qquad T=\frac{2\pi r}{v}$$
- **Twice the speed** gives four times the acceleration.`,
      ex: {
        stem: R`A car drives around a circular track of radius $50$ m at a constant $10$ m/s.`,
        parts: [R`Find its acceleration.`, R`How long does one lap take?`, R`What would the acceleration be at $20$ m/s?`],
        answer: [R`$2.0\text{ m/s}^2$, toward the centre`, R`$10\pi\approx31$ s`, R`$8.0\text{ m/s}^2$`],
        sol: R`**(a)** $a=\frac{v^2}{r}=\frac{10^2}{50}=2.0\text{ m/s}^2$, pointing to the centre of the track.

**(b)** One lap is $2\pi r$ long: $T=\frac{2\pi(50)}{10}=10\pi$ s.

**(c)** $a$ grows with $v^2$: $\frac{20^2}{50}=8.0\text{ m/s}^2$, four times as much.`,
      } },
    { no: '4-6',
      ideas: R`
- **Velocities add, with the subscripts chaining:** the velocity of $P$ relative to $A$ is
$$v_{PA}=v_{PB}+v_{BA}$$
and reversing the order flips the sign, $v_{AB}=-v_{BA}$.
- **Accelerations agree** in frames that move at constant velocity relative to each other: $a_{PA}=a_{PB}$.`,
      ex: {
        stem: R`A train moves east at $20$ m/s. A passenger walks toward the back of the train at $1.5$ m/s relative to the train. Take east as positive.`,
        parts: [R`Find the passenger's velocity relative to the ground.`, R`A car on a road beside the track moves east at $25$ m/s. Find the passenger's velocity relative to the car.`],
        answer: [R`$+18.5$ m/s (east)`, R`$-6.5$ m/s ($6.5$ m/s west)`],
        sol: R`**(a)** $v_{PG}=v_{PT}+v_{TG}=-1.5+20=+18.5$ m/s.

**(b)** $v_{PC}=v_{PG}+v_{GC}$, with $v_{GC}=-v_{CG}=-25$ m/s: $v_{PC}=18.5-25=-6.5$ m/s. Seen from the faster car, the passenger moves backward.`,
      } },
    { no: '4-7',
      ideas: R`
- **The same rule with vectors:** $\vec{v}_{PA}=\vec{v}_{PB}+\vec{v}_{BA}$. Add by components, or with a right-angle triangle when the two parts are perpendicular.
- **River crossings:** the boat's velocity over the ground is its velocity through the water plus the water's velocity.`,
      ex: {
        stem: R`A river $80$ m wide flows at $3.0$ m/s. A boat moves at $4.0$ m/s relative to the water, heading straight across.`,
        parts: [
          R`Find the boat's velocity relative to the ground.`,
          R`How long does the crossing take, and how far downstream does the boat land?`,
          R`A faster boat moves at $5.0$ m/s relative to the water. Which way must it head to land straight across, and how long does that take?`,
        ],
        answer: [R`$5.0$ m/s, at $37^\circ$ downstream from straight across`, R`$20$ s; $\ 60$ m`, R`$37^\circ$ upstream from straight across; $\ 20$ s`],
        sol: R`**(a)** $\vec{v}_{BG}=\vec{v}_{BW}+\vec{v}_{WG}$: $4.0$ m/s across plus $3.0$ m/s downstream, at right angles. $|\vec{v}_{BG}|=\sqrt{4.0^2+3.0^2}=5.0$ m/s, at $\tan^{-1}\frac{3.0}{4.0}=37^\circ$ from straight across.

**(b)** Only the across part carries the boat over: $t=\frac{80}{4.0}=20$ s. Meanwhile the current carries it $3.0\times20=60$ m downstream.

**(c)** Its upstream part must cancel the current: $5.0\sin\alpha=3.0$, so $\sin\alpha=0.60$ and $\alpha=37^\circ$ upstream. The across part is $5.0\cos37^\circ=4.0$ m/s, so the crossing again takes $20$ s.`,
      } },
  ], watch: R`
- The range formula only holds when the projectile lands at its launch height.
- At the top of the path $v_y=0$, but $v_x$ is not zero, and the acceleration is still $g$ downward.
- "Constant speed" in a circle still means an acceleration, $\frac{v^2}{r}$ toward the centre.` },

  // ===================================================================================================================
  c5: { mods: [
    { no: '5-1',
      ideas: R`
- **First law:** with no net force, a body keeps its velocity; at rest, it stays at rest.
- **Second law,** for each axis separately:
$$\vec{F}_\text{net}=m\vec{a}$$
Forces add as vectors, and $1\text{ N}=1\text{ kg}\cdot\text{m/s}^2$.`,
      ex: {
        stem: R`Two horizontal forces act on a $2.0$ kg puck on frictionless ice: $6.0$ N along $+x$ and $8.0$ N along $+y$.`,
        parts: [R`Find the net force.`, R`Find the puck's acceleration.`, R`What third force would let the puck move at a constant velocity?`],
        answer: [R`$6.0\hat{i}+8.0\hat{j}$ N: $10$ N at $53^\circ$ from $+x$`, R`$5.0\text{ m/s}^2$, at $53^\circ$ from $+x$`, R`$-6.0\hat{i}-8.0\hat{j}$ N`],
        sol: R`**(a)** $\vec{F}_\text{net}=6.0\hat{i}+8.0\hat{j}$ N, of size $\sqrt{6.0^2+8.0^2}=10$ N at $\tan^{-1}\frac{8.0}{6.0}=53^\circ$.

**(b)** $\vec{a}=\frac{\vec{F}_\text{net}}{m}=3.0\hat{i}+4.0\hat{j}\text{ m/s}^2$: $5.0\text{ m/s}^2$, in the direction of the net force.

**(c)** Constant velocity needs zero net force, by the first law: $\vec{F}_3=-\vec{F}_\text{net}=-6.0\hat{i}-8.0\hat{j}$ N.`,
      } },
    { no: '5-2',
      ideas: R`
- **The gravitational force** $F_g=mg$ points down; the **weight** $W=mg$ is its size.
- **The normal force** is perpendicular to the surface and only as large as needed. It equals $mg$ only on a level surface with no other vertical forces and no vertical acceleration.
- **Tension:** a massless string pulls along itself with the same $T$ at both ends, also over a massless, frictionless pulley.`,
      ex: {
        stem: R`A $60$ kg student stands on a bathroom scale in an elevator. The scale reads the normal force on the student. Take $g=9.8\text{ m/s}^2$.`,
        parts: [
          R`The elevator accelerates upward at $2.0\text{ m/s}^2$. What does the scale read?`,
          R`It moves down at a constant $3.0$ m/s. What does it read?`,
          R`It moves down while slowing at $2.0\text{ m/s}^2$. What does it read?`,
          R`The cable breaks and the elevator falls freely. What does it read?`,
        ],
        answer: [R`$708$ N`, R`$588$ N`, R`$708$ N`, R`$0$`],
        sol: R`**Set up** Take up as positive. The forces on the student are $F_N$ up and $mg$ down, so $F_N-mg=ma$, that is $F_N=m(g+a)$.

**(a)** $F_N=60(9.8+2.0)=708$ N, more than the weight, $588$ N.

**(b)** Constant velocity means $a=0$: $F_N=mg=588$ N. The speed itself doesn't matter.

**(c)** Moving down but slowing, the acceleration points up: $a=+2.0\text{ m/s}^2$ and the reading is $708$ N, as in (a).

**(d)** In free fall $a=-g$, so $F_N=m(g-g)=0$: the scale reads zero.`,
      } },
    { no: '5-3',
      ideas: R`
- **Method:** draw a free-body diagram for each body, choose axes (along and across a slope), write $F_\text{net}=ma$ for each axis, then solve. Bodies tied by a string share the size of their acceleration.
- **On an incline,** gravity splits into $mg\sin\theta$ down the slope and $mg\cos\theta$ into it; the normal force balances the second part.
- **Third law:** $\vec{F}_{BC}=-\vec{F}_{CB}$, two forces on two different bodies.`,
      ex: {
        stem: R`A $5.0$ kg box is pulled up a frictionless ramp at $30^\circ$ by a cord parallel to the ramp, with a tension of $40$ N. Take $g=9.8\text{ m/s}^2$.`,
        parts: [R`Write Newton's second law along the ramp and perpendicular to it.`, R`Find the normal force.`, R`Find the box's acceleration.`, R`What tension would move the box at a constant velocity?`],
        answer: [R`Along: $T-mg\sin30^\circ=ma$; $\ $ across: $F_N-mg\cos30^\circ=0$`, R`$24.5\sqrt{3}\approx42$ N`, R`$3.1\text{ m/s}^2$, up the ramp`, R`$24.5$ N`],
        sol: R`**(a)** Take $+x$ up the ramp and $+y$ out of it. The tension acts along $+x$; gravity has $mg\sin30^\circ$ down the ramp and $mg\cos30^\circ$ into it; the normal force points out of the ramp.

**(b)** Nothing moves across the ramp: $F_N=mg\cos30^\circ=49\cdot\frac{\sqrt{3}}{2}=24.5\sqrt{3}\approx42$ N.

**(c)** $a=\frac{T-mg\sin30^\circ}{m}=\frac{40-24.5}{5.0}=3.1\text{ m/s}^2$, up the ramp.

**(d)** Constant velocity means $a=0$: $T=mg\sin30^\circ=24.5$ N.`,
      } },
  ], watch: R`
- A third-law pair acts on two different bodies, so the two forces never appear in the same free-body diagram.
- $F_N\ne mg$ on an incline, with an angled push or pull, or in an accelerating elevator.
- Forgetting the last step, $a=\frac{F_\text{net}}{m}$.` },

  // ===================================================================================================================
  c6: { mods: [
    { no: '6-1',
      ideas: R`
- **Static friction** holds a body still and is only as large as needed, up to $f_{s,\max}=\mu_sF_N$, which it reaches just as sliding starts.
- **Kinetic friction** acts once the body slides: $f_k=\mu_kF_N$, against the motion, usually smaller since $\mu_k<\mu_s$.
- Friction depends on the normal force, so find $F_N$ first.`,
      ex: {
        stem: R`A $5.0$ kg crate is placed on a ramp at $37^\circ$, with $\mu_s=0.50$ and $\mu_k=0.25$. Take $g=9.8\text{ m/s}^2$. ${T37}`,
        parts: [R`Does the crate stay at rest?`, R`Find its acceleration down the ramp.`, R`What force, pushing up along the ramp, lets it slide down at a constant speed?`, R`What force up along the ramp starts it moving up the ramp?`],
        answer: [R`No: holding it needs $29.4$ N of friction, but static friction gives at most $19.6$ N`, R`$3.92\text{ m/s}^2$`, R`$19.6$ N`, R`$49$ N`],
        sol: R`**Set up** $mg=49$ N. Along the ramp gravity pulls down with $mg\sin37^\circ=29.4$ N; into the ramp it presses with $mg\cos37^\circ=39.2$ N, so $F_N=39.2$ N.

**(a)** Holding the crate would take $29.4$ N of static friction, but the most it can give is $\mu_sF_N=0.50(39.2)=19.6$ N. The crate slides.

**(b)** Sliding, the friction is kinetic, $\mu_kF_N=9.8$ N up the ramp: $a=\frac{29.4-9.8}{5.0}=3.92\text{ m/s}^2$. In symbols, $a=g(\sin\theta-\mu_k\cos\theta)$.

**(c)** At constant velocity the forces balance: $F+9.8=29.4$, so $F=19.6$ N.

**(d)** To start it up the ramp, the push must beat gravity's pull and the most static friction can give, which now points down the ramp: $F=29.4+19.6=49$ N.`,
      } },
    { no: '6-2',
      ideas: R`
- **Air drag** grows with the square of the speed:
$$D=\frac{1}{2}C\rho Av^2$$
- **Terminal speed:** a falling body speeds up until drag balances its weight, $D=F_g$:
$$v_t=\sqrt{\frac{2F_g}{C\rho A}}$$`,
      ex: {
        stem: R`An $80$ kg skydiver falls belly-down with $\frac{1}{2}C\rho A=0.25$ kg/m. Take $g=9.8\text{ m/s}^2$.`,
        parts: [R`Find her terminal speed.`, R`Find the drag force and her acceleration when she falls at $28$ m/s.`, R`She tucks in, halving her area $A$. Find the new terminal speed.`],
        answer: [R`$56$ m/s`, R`$196$ N; $\ 7.35\text{ m/s}^2$ downward`, R`$56\sqrt{2}\approx79$ m/s`],
        sol: R`**(a)** At terminal speed drag balances the weight: $0.25v_t^2=mg=784$ N, so $v_t^2=3136$ and $v_t=56$ m/s.

**(b)** $D=0.25(28)^2=196$ N, a quarter of her weight, since the speed is half of $v_t$. Then $a=\frac{mg-D}{m}=\frac{784-196}{80}=7.35\text{ m/s}^2$ downward.

**(c)** $v_t$ is proportional to $\frac{1}{\sqrt{A}}$, so halving $A$ multiplies $v_t$ by $\sqrt{2}$: $56\sqrt{2}\approx79$ m/s.`,
      } },
    { no: '6-3',
      ideas: R`
- **A net force toward the centre** keeps a body moving on a circle:
$$F_\text{net}=\frac{mv^2}{R}$$
It is not a new force: friction, tension, the normal force or gravity, or a mix, provides it.
- **Write $F=ma$ along the radius,** toward the centre as positive: at the top of a hill $mg-F_N=\frac{mv^2}{R}$, at the bottom of a dip $F_N-mg=\frac{mv^2}{R}$.`,
      ex: {
        stem: R`A $1000$ kg car drives at $7.0$ m/s over the top of a hill and through the bottom of a dip, both circular arcs of radius $20$ m. Take $g=9.8\text{ m/s}^2$.`,
        parts: [R`Find the normal force on the car at the top of the hill.`, R`Find the normal force at the bottom of the dip.`, R`What is the greatest speed at which the car stays on the road at the top of the hill?`, R`At what speed would the normal force at the bottom of the dip be twice the car's weight?`],
        answer: [R`$7350$ N`, R`$12\,250$ N`, R`$14$ m/s`, R`$14$ m/s`],
        sol: R`**Set up** In both places the net force points to the centre of the arc, with size $\frac{mv^2}{R}=\frac{1000(7.0)^2}{20}=2450$ N. The weight is $mg=9800$ N.

**(a)** At the top the centre is below the car: $mg-F_N=\frac{mv^2}{R}$, so $F_N=9800-2450=7350$ N. The car feels lighter.

**(b)** At the bottom the centre is above: $F_N-mg=\frac{mv^2}{R}$, so $F_N=9800+2450=12\,250$ N.

**(c)** The car leaves the road when $F_N$ would reach zero: $mg=\frac{mv^2}{R}$, so $v=\sqrt{gR}=\sqrt{9.8\times20}=14$ m/s.

**(d)** $F_N=2mg$ means $\frac{mv^2}{R}=mg$, the same condition: $v=\sqrt{gR}=14$ m/s.`,
      } },
  ], watch: R`
- Writing $f_s=\mu_sF_N$ when the body isn't about to slip. Find the friction that is needed instead.
- Adding a "centrifugal force" to a free-body diagram. Only real forces go in, and their sum points to the centre.
- Using $F_N=mg$ on a hill or in a dip: $F_N<mg$ at the top of a hill, $F_N>mg$ at the bottom of a dip.` },

  // ===================================================================================================================
  c7: { mods: [
    { no: '7-1',
      ideas: R`
- **Kinetic energy** is the energy of motion, a scalar measured in joules ($1\text{ J}=1\text{ kg}\cdot\text{m}^2/\text{s}^2$):
$$K=\frac{1}{2}mv^2$$
- Twice the speed means four times the kinetic energy.`,
      ex: {
        stem: R`Find each kinetic energy or speed.`,
        parts: [R`A $1000$ kg car moves at $20$ m/s. Find its kinetic energy.`, R`The same car moves at $40$ m/s. Find its kinetic energy.`, R`A $0.50$ kg ball has $9.0$ J of kinetic energy. How fast is it moving?`],
        answer: [R`$2.0\times10^5$ J`, R`$8.0\times10^5$ J`, R`$6.0$ m/s`],
        sol: R`**(a)** $K=\frac{1}{2}(1000)(20)^2=2.0\times10^5$ J.

**(b)** $K=\frac{1}{2}(1000)(40)^2=8.0\times10^5$ J: twice the speed, four times the energy.

**(c)** $v=\sqrt{\frac{2K}{m}}=\sqrt{\frac{2(9.0)}{0.50}}=\sqrt{36}=6.0$ m/s.`,
      } },
    { no: '7-2',
      ideas: R`
- **Work** by a constant force is the part of the force along the motion times the distance:
$$W=Fd\cos\phi=\vec{F}\cdot\vec{d}$$
It is positive when the force helps the motion, negative when it opposes it, and zero when the force is perpendicular.
- **Work–kinetic energy theorem:** the net work changes the kinetic energy, $\Delta K=K_f-K_i=W_\text{net}$.`,
      ex: {
        stem: R`A $2.0$ kg crate starts from rest and is pulled $10$ m across a level floor by an $18$ N force at $37^\circ$ above the horizontal. The coefficient of kinetic friction is $0.50$. Take $g=9.8\text{ m/s}^2$. ${T37}`,
        parts: [R`Find the normal force and the friction force.`, R`Find the work done by the pull, by friction, by gravity and by the normal force.`, R`Use the work–kinetic energy theorem to find the final speed.`],
        answer: [R`$F_N=8.8$ N; $\ f_k=4.4$ N`, R`$144$ J; $\ -44$ J; $\ 0$; $\ 0$`, R`$10$ m/s`],
        sol: R`**(a)** Vertically, $F_N+18\sin37^\circ=mg$, so $F_N=19.6-10.8=8.8$ N, and $f_k=\mu_kF_N=0.50(8.8)=4.4$ N.

**(b)** Pull: $W=Fd\cos\phi=18(10)(0.80)=144$ J. Friction points against the motion: $W_f=-4.4(10)=-44$ J. Gravity and the normal force are perpendicular to the motion, so each does $0$.

**(c)** $W_\text{net}=144-44=100$ J $=\frac{1}{2}(2.0)v^2$, so $v^2=100$ and $v=10$ m/s.`,
      } },
    { no: '7-3',
      ideas: R`
- **Work by gravity** over a displacement $d$ is $W_g=mgd\cos\phi$: negative going up, positive coming down.
- **Lifting or lowering:** $\Delta K=W_a+W_g$. If the object is at rest before and after, $W_a=-W_g$.`,
      ex: {
        stem: R`A $5.0$ kg box is moved vertically. Take $g=9.8\text{ m/s}^2$.`,
        parts: [
          R`It is lifted $2.5$ m at a constant speed. Find the work done by gravity and by the lifting force.`,
          R`It is dropped from $2.5$ m. Find the work done by gravity during the fall, and the speed at the floor.`,
          R`A cable lifts it $2.5$ m from rest, and it ends up moving upward at $3.0$ m/s. Find the work done by the cable.`,
        ],
        answer: [R`$W_g=-122.5$ J; $\ W_a=+122.5$ J`, R`$+122.5$ J; $\ 7.0$ m/s`, R`$145$ J`],
        sol: R`**(a)** Going up, gravity points against the motion: $W_g=mgd\cos180^\circ=-5.0(9.8)(2.5)=-122.5$ J. The speed doesn't change, so $W_a=-W_g=+122.5$ J.

**(b)** Coming down, gravity points along the motion: $W_g=+122.5$ J $=\Delta K$, so $\frac{1}{2}(5.0)v^2=122.5$, $v^2=49$ and $v=7.0$ m/s.

**(c)** $\Delta K=W_a+W_g$: $\frac{1}{2}(5.0)(3.0)^2=W_a-122.5$, so $W_a=22.5+122.5=145$ J.`,
      } },
    { no: '7-4',
      ideas: R`
- **Hooke's law:** a spring pulls back toward its relaxed length, $F_x=-kx$, with $x$ measured from the relaxed length.
- **Work by a spring:**
$$W_s=\frac{1}{2}kx_i^2-\frac{1}{2}kx_f^2$$
positive when it moves back toward its relaxed length.`,
      ex: {
        stem: R`A spring has $k=400$ N/m. Lengths are measured from its relaxed length.`,
        parts: [R`What force holds it stretched by $5.0$ cm?`, R`It is stretched further, from $5.0$ cm to $15$ cm. Find the work done by the spring.`, R`Find the work done by the hand, if the spring is at rest at both ends.`, R`The spring returns from $15$ cm to $5.0$ cm. Find the work it does.`],
        answer: [R`$20$ N`, R`$-4.0$ J`, R`$+4.0$ J`, R`$+4.0$ J`],
        sol: R`**(a)** $|F|=kx=400(0.050)=20$ N.

**(b)** $W_s=\frac{1}{2}k\left(x_i^2-x_f^2\right)=200\left(0.050^2-0.15^2\right)=200(0.0025-0.0225)=-4.0$ J: the spring pulls against the stretch.

**(c)** At rest before and after, so $W_a=-W_s=+4.0$ J.

**(d)** Now $x_i=0.15$ m and $x_f=0.050$ m: $W_s=200(0.0225-0.0025)=+4.0$ J.`,
      } },
    { no: '7-5',
      ideas: R`
- **A variable force** does work
$$W=\int_{x_i}^{x_f}F(x)\,dx$$
the area under the $F$–$x$ graph, counted negative below the axis.
- The work–kinetic energy theorem still holds: $\Delta K=W$.`,
      ex: {
        stem: R`A force $F(x)=12-4x$ (in newtons, with $x$ in metres) acts along the $x$-axis on a $2.0$ kg object that starts from rest at $x=0$. No other force does work.`,
        parts: [R`Find the work done from $x=0$ to $x=2.0$ m.`, R`Find the speed at $x=2.0$ m.`, R`Where is the object fastest, and how fast is it there?`, R`Where does it stop?`],
        answer: [R`$16$ J`, R`$4.0$ m/s`, R`At $x=3.0$ m, $3\sqrt{2}\approx4.2$ m/s`, R`At $x=6.0$ m`],
        sol: R`**(a)** $W=\int_0^2(12-4x)\,dx=\left[12x-2x^2\right]_0^2=24-8=16$ J: the trapezoid under the line.

**(b)** $\frac{1}{2}(2.0)v^2=16$, so $v=4.0$ m/s.

**(c)** It speeds up while $F>0$ and slows down after, so it is fastest where $F=0$: $x=3.0$ m. There $W=36-18=18$ J, so $v^2=18$ and $v=3\sqrt{2}$ m/s.

**(d)** $K=W=12x-2x^2=2x(6-x)$ is zero again at $x=6.0$ m: the negative area beyond $x=3$ m cancels the positive area before it.`,
      } },
    { no: '7-6',
      ideas: R`
- **Power** is the rate of doing work:
$$P_\text{avg}=\frac{W}{\Delta t},\qquad P=\frac{dW}{dt}=Fv\cos\phi$$
in watts, $1\text{ W}=1\text{ J/s}$. Also $1\text{ hp}=746$ W, and $1\text{ kW}\cdot\text{h}=3.6\times10^6$ J is an energy.`,
      ex: {
        stem: R`A $1200$ kg car speeds up from rest to $20$ m/s in $8.0$ s on a level road, with constant acceleration. Ignore friction and air during this part.`,
        parts: [R`How much work does the net force do?`, R`Find the average power.`, R`Find the power delivered at the end of the $8.0$ s.`, R`The car then cruises at $20$ m/s against a drag force of $500$ N. What power must the engine deliver?`],
        answer: [R`$2.4\times10^5$ J`, R`$3.0\times10^4$ W ($30$ kW)`, R`$6.0\times10^4$ W ($60$ kW)`, R`$1.0\times10^4$ W ($10$ kW)`],
        sol: R`**(a)** Work–kinetic energy theorem: $W=\Delta K=\frac{1}{2}(1200)(20)^2-0=2.4\times10^5$ J.

**(b)** $P_\text{avg}=\frac{W}{\Delta t}=\frac{2.4\times10^5}{8.0}=3.0\times10^4$ W.

**(c)** $a=\frac{20}{8.0}=2.5\text{ m/s}^2$, so the net force is $F=ma=3000$ N. At $20$ m/s, $P=Fv=3000\times20=6.0\times10^4$ W: twice the average, because the speed rose steadily from zero.

**(d)** At a constant speed the engine's force balances the drag, $500$ N: $P=Fv=500\times20=1.0\times10^4$ W.`,
      } },
  ], watch: R`
- $\phi$ is the angle between the force and the displacement, which is not always the angle given in the problem.
- A force perpendicular to the motion, such as the normal force or a centripetal force, does no work.
- The sign of spring work: positive when the spring moves back toward its relaxed length, negative when it is stretched or compressed further.` },

  // ===================================================================================================================
  c8: { mods: [
    { no: '8-1',
      ideas: R`
- **Potential energy** stores the work of a conservative force: $\Delta U=-W$. Gravity: $U=mgy$. A spring: $U=\frac{1}{2}kx^2$.
- **Only changes matter,** so choose where $U=0$ (the floor, the relaxed spring) to suit the problem.`,
      ex: {
        stem: R`Take $g=9.8\text{ m/s}^2$.`,
        parts: [
          R`A $2.0$ kg book is lifted from the floor to a shelf $1.5$ m higher. Find the change in its gravitational potential energy.`,
          R`Taking $U=0$ at the shelf instead, what is the book's potential energy on the floor?`,
          R`A spring with $k=800$ N/m is compressed by $5.0$ cm. Find its elastic potential energy.`,
          R`Find the change in elastic potential energy when the compression goes from $5.0$ cm to $10$ cm.`,
        ],
        answer: [R`$+29.4$ J`, R`$-29.4$ J`, R`$1.0$ J`, R`$+3.0$ J`],
        sol: R`**(a)** $\Delta U=mg\,\Delta y=2.0(9.8)(1.5)=29.4$ J. Gravity did $-29.4$ J of work.

**(b)** The floor is $1.5$ m below the shelf: $U=mgy=2.0(9.8)(-1.5)=-29.4$ J. The change between the two places is still $29.4$ J.

**(c)** $U=\frac{1}{2}kx^2=\frac{1}{2}(800)(0.050)^2=1.0$ J.

**(d)** $\frac{1}{2}(800)(0.10)^2=4.0$ J, so $\Delta U=4.0-1.0=+3.0$ J: twice the compression stores four times the energy.`,
      } },
    { no: '8-2',
      ideas: R`
- **Mechanical energy** $E_\text{mec}=K+U$ stays constant when only conservative forces (gravity, springs) do work:
$$K_2+U_2=K_1+U_1$$
- It links speeds and positions without the path or the time.`,
      ex: {
        stem: R`A $0.20$ kg block is pressed against a spring ($k=980$ N/m), compressing it by $0.10$ m on a frictionless level track. Released, it leaves the spring and slides up a frictionless ramp. Take $g=9.8\text{ m/s}^2$.`,
        parts: [R`Find the block's speed as it leaves the spring.`, R`How high up the ramp does it go?`, R`Find its speed at half that height.`, R`It slides back down into the spring. How far does it compress it?`],
        answer: [R`$7.0$ m/s`, R`$2.5$ m`, R`$\frac{7.0}{\sqrt{2}}\approx4.9$ m/s`, R`$0.10$ m`],
        sol: R`**Set up** Nothing removes energy, so $K+U_\text{spring}+U_\text{grav}$ stays constant. At the start it is all elastic: $\frac{1}{2}kx^2=\frac{1}{2}(980)(0.10)^2=4.9$ J.

**(a)** $\frac{1}{2}mv^2=4.9$ J, so $v^2=\frac{2(4.9)}{0.20}=49$ and $v=7.0$ m/s.

**(b)** At the highest point it is all gravitational: $mgh=4.9$ J, so $h=\frac{4.9}{0.20(9.8)}=2.5$ m.

**(c)** At $h=1.25$ m half the energy is gravitational and half kinetic: $\frac{1}{2}mv^2=2.45$ J, so $v^2=24.5$ and $v=\frac{7.0}{\sqrt{2}}\approx4.9$ m/s.

**(d)** Coming back, all $4.9$ J become elastic energy again, so it compresses the spring by $0.10$ m: nothing has been lost.`,
      } },
    { no: '8-3',
      ideas: R`
- **Force from the curve:** $F(x)=-\frac{dU}{dx}$, minus the slope.
- **Where the particle can go:** $K=E_\text{mec}-U\ge0$, so it stays where $U\le E_\text{mec}$ and turns around where $U=E_\text{mec}$.
- **Equilibrium** is where the slope is zero: a minimum of $U$ is stable, a maximum unstable.`,
      ex: {
        stem: R`A particle moving along the $x$-axis has potential energy $U(x)=x^2-4x+5$ ($U$ in joules, $x$ in metres) and mechanical energy $E_\text{mec}=5$ J.`,
        parts: [R`Find the force $F(x)$ on the particle.`, R`Where is the equilibrium point, and is it stable or unstable?`, R`Find the turning points.`, R`Where is the particle fastest, and what is its kinetic energy there?`],
        answer: [R`$F(x)=4-2x$ (N)`, R`At $x=2$ m, stable`, R`$x=0$ and $x=4$ m`, R`At $x=2$ m, with $K=4$ J`],
        sol: R`**(a)** $F(x)=-\frac{dU}{dx}=-(2x-4)=4-2x$.

**(b)** Equilibrium is where $F=0$: $x=2$ m. There $U=4-8+5=1$ J, the minimum of an upward parabola, so it is stable: the force points back toward $x=2$ from both sides.

**(c)** It turns around where $U=E_\text{mec}$: $x^2-4x+5=5$, so $x(x-4)=0$, at $x=0$ and $x=4$ m. It moves back and forth between them.

**(d)** $K=E_\text{mec}-U$ is largest where $U$ is smallest, at $x=2$ m: $K=5-1=4$ J.`,
      } },
    { no: '8-4',
      ideas: R`
- **External work** changes a system's energy. Without friction, $W=\Delta K+\Delta U$; with friction,
$$W=\Delta E_\text{mec}+\Delta E_\text{th},\qquad \Delta E_\text{th}=f_kd$$
- Kinetic friction turns mechanical energy into thermal energy of the surfaces.`,
      ex: {
        stem: R`A worker pushes a $4.0$ kg block from rest across a level floor with a steady horizontal $19.6$ N force for $5.0$ m, then lets go. The coefficient of kinetic friction is $0.25$; take $g=9.8\text{ m/s}^2$.`,
        parts: [R`Find the work done by the worker.`, R`Find the thermal energy produced during the push.`, R`Find the block's kinetic energy when the worker lets go.`, R`How much farther does it slide?`],
        answer: [R`$98$ J`, R`$49$ J`, R`$49$ J`, R`$5.0$ m`],
        sol: R`**Set up** The friction force is $f_k=\mu_kmg=0.25(4.0)(9.8)=9.8$ N, against the motion.

**(a)** $W=Fd=19.6(5.0)=98$ J.

**(b)** $\Delta E_\text{th}=f_kd=9.8(5.0)=49$ J.

**(c)** On a level floor $W=\Delta K+\Delta E_\text{th}$, so $\Delta K=98-49=49$ J.

**(d)** Now friction turns those $49$ J into thermal energy: $9.8\,d'=49$, so $d'=5.0$ m.`,
      } },
    { no: '8-5',
      ideas: R`
- **Energy is conserved:** it is never created or destroyed. For an isolated system,
$$\Delta E_\text{mec}+\Delta E_\text{th}+\Delta E_\text{int}=0$$
so mechanical energy lost to friction or drag shows up as thermal energy.
- **Power** is the energy transferred per unit time: $P_\text{avg}=\frac{\Delta E}{\Delta t}$.`,
      ex: {
        stem: R`A $0.50$ kg ball is dropped from a height of $20$ m and hits the ground at $18$ m/s. Take $g=9.8\text{ m/s}^2$.`,
        parts: [R`How much mechanical energy is lost to the air?`, R`Find the average drag force during the fall.`, R`How fast would it land with no air?`],
        answer: [R`$17$ J`, R`$0.85$ N`, R`$14\sqrt{2}\approx20$ m/s`],
        sol: R`**(a)** At the top $E_\text{mec}=mgh=0.50(9.8)(20)=98$ J; at the bottom $\frac{1}{2}(0.50)(18)^2=81$ J. The difference, $17$ J, became thermal energy of the ball and the air.

**(b)** $\Delta E_\text{th}=\bar{D}\,d$, so $\bar{D}=\frac{17}{20}=0.85$ N.

**(c)** With nothing lost, $\frac{1}{2}mv^2=mgh$: $v=\sqrt{2(9.8)(20)}=\sqrt{392}=14\sqrt{2}\approx20$ m/s.`,
      } },
  ], watch: R`
- Energy gives speeds and heights, not directions or times.
- Leaving out a form of energy: count kinetic, gravitational and elastic energy at both points.
- With friction, mechanical energy is not conserved, but total energy is: add $\Delta E_\text{th}$.` },
};

export const habits = R`
- **Sketch first.** Draw the situation and a free-body diagram, and choose a positive direction (up the slope, toward the centre) before writing any equation.
- **Symbols, then numbers.** Solve in symbols and put the numbers in at the end; the mass often cancels.
- **No calculator.** Keep exact forms such as $\sqrt{3}$ and $\pi$, use the special angles ($\sin37^\circ\approx0.6$, $\cos37^\circ\approx0.8$), and round only the final answer.
- **Units and signs.** Write units on every number and check the unit of the answer. Keep $g=9.8\text{ m/s}^2$ positive and put the direction in the sign.
- **Check a special case.** Setting $\theta=0$, $\mu=0$ or one mass to zero should give a result you already know.`;
