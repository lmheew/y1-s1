// The Practice tab: problems for each chapter in three tiers. Foundation: definitions and one-step calculations.
// Application: a few steps, a little harder. Advanced: exam-style problems of the kinds the exercise days ask, with new
// set-ups and numbers (never copied from the class sheets). The heavier chapters get a few more.
//
// practice[chapter id] is a list of problems in tier order. A problem's id, the key for its saved mark, is
// "<chapter no>.<position>" (2.7 is the seventh problem of Chapter 2), so append new problems and never reorder.
// A problem: tier ('f', 'a' or 'x'), topic, stem, fig (a figure id or a list), parts (labelled (a), (b) …), answer (one
// per part, or one when there are no parts) and sol (one step per block). The markup is the practice sets'.
// Every answer is checked in verify_practice.py.
const R = String.raw;
export const PRACTICE_ADDED = '2026-11-03';
export const TIERS = [
  ['f', 'Foundation', 'Definitions and one-step calculations'],
  ['a', 'Application', 'A few steps, a little harder'],
  ['x', 'Advanced', 'Exam-style, like the exercise days'],
];

export const practice = {
  // ===================================================================================================================
  c1: [
    { tier: 'f', topic: 'SI base quantities and units',
      stem: R`Mechanics, in Chapters 1–8, is built on three SI base quantities.`,
      parts: [R`Name the three base quantities and their SI units.`, R`Which of these are SI base units: newton, kilogram, joule, second, watt, metre?`,
        R`Write the newton and the joule in base units.`],
      answer: [R`Length in metres (m), mass in kilograms (kg) and time in seconds (s)`, R`The kilogram, the second and the metre`,
        R`$1\ \text{N}=1\ \text{kg}\cdot\text{m/s}^2$ and $1\ \text{J}=1\ \text{kg}\cdot\text{m}^2/\text{s}^2$`],
      sol: R`**(a)** Every unit in mechanics is made of these three. Electric current, temperature, amount of substance and luminous intensity complete the seven SI base quantities, but they come later in physics.

**(b)** The newton, the joule and the watt are derived units: named after people, but made of kilograms, metres and seconds.

**(c)** From $F=ma$, a newton is $\text{kg}\times\text{m/s}^2$. From $W=Fd$, a joule is a newton times a metre: $\text{kg}\cdot\text{m}^2/\text{s}^2$.` },
    { tier: 'f', topic: 'Prefixes and scientific notation',
      stem: R`Write each quantity in SI base units, in scientific notation.`,
      parts: [R`$3.5$ km`, R`$250$ mg`, R`$72\ \mu$s`, R`$0.45$ nm`],
      answer: [R`$3.5\times10^{3}$ m`, R`$2.5\times10^{-4}$ kg`, R`$7.2\times10^{-5}$ s`, R`$4.5\times10^{-10}$ m`],
      sol: R`**(a)** k means $10^3$: $3.5\times10^3$ m.

**(b)** m means $10^{-3}$, and the base unit of mass is the kilogram, $10^3$ g: $250\times10^{-3}\ \text{g}=0.250$ g $=2.5\times10^{-4}$ kg.

**(c)** $\mu$ means $10^{-6}$: $72\times10^{-6}$ s $=7.2\times10^{-5}$ s.

**(d)** n means $10^{-9}$: $0.45\times10^{-9}$ m $=4.5\times10^{-10}$ m. One digit before the decimal point each time.` },
    { tier: 'f', topic: 'Counting significant figures',
      stem: R`How many significant figures does each number have?`,
      parts: [R`$0.00340$`, R`$2.050$`, R`$6.02\times10^{23}$`, R`$1.0080$`],
      answer: [R`$3$`, R`$4$`, R`$3$`, R`$5$`],
      sol: R`**Rules** Leading zeros only place the decimal point, so they don't count. Zeros between digits count, and so do zeros at the end after a decimal point: someone measured them.

**(a)** $3$, $4$ and the final $0$: three.

**(b)** All four digits: the middle zero and the final zero both count.

**(c)** Only the number in front of the power of ten counts: three.

**(d)** All five digits.` },
    { tier: 'f', topic: 'Sums and products',
      stem: R`Work out each result with the right number of significant figures.`,
      parts: [R`$12.47+0.0381$`, R`$5.2\times0.0413$`, R`$8.10\div2.7$`, R`$100.0-0.256$`],
      answer: [R`$12.51$`, R`$0.21$`, R`$3.0$`, R`$99.7$`],
      sol: R`**(a)** A sum keeps the fewest decimal places. $12.47$ has two, so $12.5081$ becomes $12.51$.

**(b)** A product keeps the fewest significant figures. $5.2$ has two, so $0.21476$ becomes $0.21$.

**(c)** $2.7$ has two significant figures, so the quotient $3$ is written $3.0$.

**(d)** $100.0$ has one decimal place, so $99.744$ becomes $99.7$.` },
    { tier: 'f', topic: 'Converting speeds',
      parts: [R`A car moves at $90$ km/h. Find its speed in m/s.`, R`A cyclist moves at $5.0$ m/s. Find her speed in km/h.`,
        R`A snail crawls at $1.2$ mm/s. How far does it go in an hour, in metres?`],
      answer: [R`$25$ m/s`, R`$18$ km/h`, R`$4.3$ m`],
      sol: R`**(a)** $1$ km/h $=\frac{1000\ \text{m}}{3600\ \text{s}}=\frac{1}{3.6}$ m/s, so $90$ km/h $=\frac{90}{3.6}=25$ m/s.

**(b)** The other way, multiply by $3.6$: $5.0\times3.6=18$ km/h.

**(c)** $1.2\times10^{-3}\ \text{m/s}\times3600\ \text{s}=4.32$ m, which is $4.3$ m to two significant figures.` },
    { tier: 'a', topic: 'Area, volume and density',
      parts: [R`Write $2.5\ \text{m}^2$ in $\text{cm}^2$.`, R`Write $1.2$ L in $\text{m}^3$.`, R`Write $7.9\ \text{g/cm}^3$ in $\text{kg/m}^3$.`,
        R`Find the mass of $1.2$ L of oil of density $0.80\ \text{g/cm}^3$.`],
      answer: [R`$2.5\times10^{4}\ \text{cm}^2$`, R`$1.2\times10^{-3}\ \text{m}^3$`, R`$7.9\times10^{3}\ \text{kg/m}^3$`, R`$0.96$ kg`],
      sol: R`**(a)** $1\ \text{m}=10^2$ cm, so $1\ \text{m}^2=(10^2\ \text{cm})^2=10^4\ \text{cm}^2$. Square the factor along with the unit.

**(b)** $1\ \text{L}=10^3\ \text{cm}^3=10^3\times(10^{-2}\ \text{m})^3=10^{-3}\ \text{m}^3$.

**(c)** $1\ \text{g/cm}^3=\frac{10^{-3}\ \text{kg}}{10^{-6}\ \text{m}^3}=10^3\ \text{kg/m}^3$.

**(d)** $1.2\ \text{L}=1200\ \text{cm}^3$, and $m=\rho V=0.80\times1200=960$ g $=0.96$ kg.` },
    { tier: 'a', topic: 'A year and a light-year',
      parts: [R`How many seconds are there in a year of $365$ days? Give three significant figures.`,
        R`The light-year is the distance light travels in a year. Find it in metres, with $c=3.00\times10^{8}$ m/s.`,
        R`Light from the Sun travels $1.50\times10^{11}$ m to Earth. How long does it take?`],
      answer: [R`$3.15\times10^{7}$ s`, R`$9.46\times10^{15}$ m`, R`$5.00\times10^{2}$ s, about $8.3$ minutes`],
      sol: R`**(a)** $365\times24\times3600=31\,536\,000$ s, which is $3.15\times10^7$ s.

**(b)** $d=ct=(3.00\times10^8)(3.1536\times10^7)=9.46\times10^{15}$ m.

**(c)** $t=\frac{d}{c}=\frac{1.50\times10^{11}}{3.00\times10^{8}}=500$ s, and $\frac{500}{60}\approx8.3$ min.` },
    { tier: 'a', topic: 'Mass from density',
      stem: R`A gold bar measures $2.0$ cm by $5.0$ cm by $10.0$ cm. The density of gold is $19.3\ \text{g/cm}^3$.`,
      parts: [R`Find its volume in $\text{cm}^3$ and in $\text{m}^3$.`, R`Find its mass in kg, with the right number of significant figures.`,
        R`Write the density of gold in $\text{kg/m}^3$.`],
      answer: [R`$1.0\times10^{2}\ \text{cm}^3=1.0\times10^{-4}\ \text{m}^3$`, R`$1.9$ kg`, R`$1.93\times10^{4}\ \text{kg/m}^3$`],
      sol: R`**(a)** $V=2.0\times5.0\times10.0=100\ \text{cm}^3$. Two of the lengths have two significant figures, so write $1.0\times10^2\ \text{cm}^3$. With $1\ \text{cm}^3=10^{-6}\ \text{m}^3$: $1.0\times10^{-4}\ \text{m}^3$.

**(b)** $m=\rho V=19.3\times100=1930$ g. The volume limits it to two significant figures: $1.9$ kg.

**(c)** $1\ \text{g/cm}^3=10^3\ \text{kg/m}^3$, so $19.3\ \text{g/cm}^3=1.93\times10^4\ \text{kg/m}^3$.` },
    { tier: 'x', topic: 'A formula from units',
      stem: R`The speed $v$ of a wave on a stretched string depends only on the tension $T$ (a force) and the mass per unit length $\mu$ (in kg/m). Suppose $v=C\,T^{a}\mu^{b}$, where $C$ is a number without units.`,
      parts: [R`Write the units of $v$, $T$ and $\mu$ in kg, m and s.`, R`Find $a$ and $b$.`,
        R`The tension is made four times larger. By what factor does the speed change?`],
      answer: [R`$v$: m/s; $T$: $\text{kg}\cdot\text{m/s}^2$; $\mu$: kg/m`, R`$a=\frac{1}{2}$, $b=-\frac{1}{2}$, so $v=C\sqrt{\frac{T}{\mu}}$`, R`It doubles`],
      sol: R`**(a)** A force is mass times acceleration, $\text{kg}\cdot\text{m}\cdot\text{s}^{-2}$, and $\mu$ is $\text{kg}\cdot\text{m}^{-1}$.

**(b)** Units of $T^a\mu^b$: $\text{kg}^{a+b}\,\text{m}^{a-b}\,\text{s}^{-2a}$. They must be $\text{m}^1\text{s}^{-1}$:
- seconds: $-2a=-1$, so $a=\frac{1}{2}$
- kilograms: $a+b=0$, so $b=-\frac{1}{2}$
- metres: $a-b=1$, which checks.

**(c)** $v\propto\sqrt{T}$, so four times the tension gives $\sqrt{4}=2$ times the speed.` },
    { tier: 'x', topic: 'Significant figures in a measurement',
      stem: R`A rectangular plate is measured with a ruler: $12.5$ cm long and $3.20$ cm wide.`,
      parts: [R`Find the perimeter.`, R`Find the area.`, R`Write the area in $\text{m}^2$.`, R`Find the ratio of length to width.`],
      answer: [R`$31.4$ cm`, R`$40.0\ \text{cm}^2$`, R`$4.00\times10^{-3}\ \text{m}^2$`, R`$3.91$`],
      sol: R`**(a)** First the sum: $12.5+3.20=15.70$, kept to one decimal place because of $12.5$: $15.7$ cm. Doubling is exact: $31.4$ cm.

**(b)** $12.5\times3.20=40.000$. Both have three significant figures: $40.0\ \text{cm}^2$. The zero after the point shows the precision.

**(c)** $1\ \text{cm}^2=10^{-4}\ \text{m}^2$: $40.0\times10^{-4}=4.00\times10^{-3}\ \text{m}^2$.

**(d)** $\frac{12.5}{3.20}=3.90625$, so $3.91$ to three significant figures.` },
    { tier: 'x', topic: 'Counting molecules',
      stem: R`A water molecule has a mass of about $18$ u, where $1\ \text{u}=1.66\times10^{-27}$ kg.`,
      parts: [R`Find the mass of one molecule in kg.`, R`How many molecules are there in $1.0$ L of water, which has a mass of $1.0$ kg?`,
        R`How many moles is that, with $N_A=6.02\times10^{23}$ per mole?`],
      answer: [R`$3.0\times10^{-26}$ kg`, R`$3.3\times10^{25}$`, R`About $56$ mol`],
      sol: R`**(a)** $18\times1.66\times10^{-27}=29.88\times10^{-27}\approx3.0\times10^{-26}$ kg, to two significant figures like $18$.

**(b)** $N=\frac{M_\text{sample}}{m_\text{molecule}}=\frac{1.0}{2.988\times10^{-26}}\approx3.3\times10^{25}$.

**(c)** $\frac{3.35\times10^{25}}{6.02\times10^{23}}\approx56$ mol. **Check** $18$ u per molecule means $18$ g per mole, and $\frac{1000\ \text{g}}{18\ \text{g}}\approx56$.` },
  ],
  // ===================================================================================================================
  c2: [
    { tier: 'f', topic: 'Displacement, distance and averages',
      stem: R`A runner goes $120$ m east in $20$ s, then $40$ m west in $10$ s. Take east as $+x$.`,
      parts: [R`Find the displacement.`, R`Find the distance travelled.`, R`Find the average velocity.`, R`Find the average speed.`],
      answer: [R`$+80$ m ($80$ m east)`, R`$160$ m`, R`$\frac{8}{3}\approx2.7$ m/s east`, R`$\frac{16}{3}\approx5.3$ m/s`],
      sol: R`**(a)** $\Delta x=120-40=80$ m. Only the start and the end matter.

**(b)** Distance adds the lengths of both legs, whatever their direction: $120+40=160$ m.

**(c)** $v_\text{avg}=\frac{\Delta x}{\Delta t}=\frac{80}{30}=\frac{8}{3}$ m/s.

**(d)** $s_\text{avg}=\frac{160}{30}=\frac{16}{3}$ m/s. Average speed is larger whenever the motion turns back.` },
    { tier: 'f', topic: 'Velocity and acceleration from x(t)',
      stem: R`A particle moves along the $x$-axis with $x=3t^2-2t+1$, where $x$ is in metres and $t$ in seconds.`,
      parts: [R`Find $v(t)$.`, R`Find the velocity at $t=2.0$ s.`, R`Find $a(t)$.`, R`When is the particle momentarily at rest, and where is it then?`],
      answer: [R`$v=6t-2$`, R`$10$ m/s`, R`$a=6$ m/s², constant`, R`At $t=\frac{1}{3}$ s, at $x=\frac{2}{3}$ m`],
      sol: R`**(a)** $v=\frac{dx}{dt}=6t-2$.

**(b)** $v(2)=12-2=10$ m/s.

**(c)** $a=\frac{dv}{dt}=6$ m/s². A quadratic $x(t)$ always means constant acceleration.

**(d)** $6t-2=0$ at $t=\frac{1}{3}$ s, where $x=3\cdot\frac{1}{9}-\frac{2}{3}+1=\frac{2}{3}$ m.` },
    { tier: 'f', topic: 'Constant acceleration',
      stem: R`A car moving at $4.0$ m/s speeds up with a constant acceleration of $2.0$ m/s² for $5.0$ s.`,
      parts: [R`Find its final speed.`, R`How far does it go in that time?`, R`Find its average velocity.`],
      answer: [R`$14$ m/s`, R`$45$ m`, R`$9.0$ m/s`],
      sol: R`**(a)** $v=v_0+at=4.0+2.0\times5.0=14$ m/s.

**(b)** $x-x_0=v_0t+\frac{1}{2}at^2=20+25=45$ m.

**(c)** $\frac{45}{5.0}=9.0$ m/s. **Check** With constant acceleration it is also the mean of the end speeds: $\frac{4+14}{2}=9$.` },
    { tier: 'f', topic: 'Free fall',
      stem: R`A stone is dropped from rest from a bridge and hits the water $3.0$ s later. Take $g=9.8$ m/s² and ignore air.`,
      parts: [R`Find its speed as it hits the water.`, R`How high is the bridge?`, R`How far does it fall during the last second?`],
      answer: [R`$29.4$ m/s`, R`$44.1$ m`, R`$24.5$ m`],
      sol: R`**(a)** $v=gt=9.8\times3.0=29.4$ m/s.

**(b)** $h=\frac{1}{2}gt^2=4.9\times9=44.1$ m.

**(c)** In the first $2.0$ s it falls $4.9\times4=19.6$ m, so in the last second $44.1-19.6=24.5$ m. It covers more ground each second as it speeds up.` },
    { tier: 'f', topic: 'Speeding up or slowing down',
      stem: R`A car moving in the $+x$ direction slows from $20$ m/s to $5.0$ m/s in $3.0$ s.`,
      parts: [R`Find its average acceleration.`, R`Is the car speeding up or slowing down? Explain with the signs of $v$ and $a$.`,
        R`If the acceleration stayed the same, when would the car stop, counting from the start?`],
      answer: [R`$-5.0$ m/s²`, R`Slowing down: $v>0$ and $a<0$ have opposite signs`, R`$4.0$ s after the start`],
      sol: R`**(a)** $a_\text{avg}=\frac{\Delta v}{\Delta t}=\frac{5.0-20}{3.0}=-5.0$ m/s².

**(b)** An object slows down when its velocity and acceleration have opposite signs, and speeds up when they have the same sign. A negative acceleration alone doesn't mean slowing down.

**(c)** $0=20-5.0t$ gives $t=4.0$ s.` },
    { tier: 'a', topic: 'Reaction time and braking',
      stem: R`A driver moving at $24$ m/s sees a hazard. She reacts after $0.75$ s, then brakes with a constant deceleration of $6.0$ m/s².`,
      parts: [R`How far does the car go before she brakes?`, R`Find the braking distance.`, R`Find the total stopping distance and the total time.`],
      answer: [R`$18$ m`, R`$48$ m`, R`$66$ m, in $4.75$ s`],
      sol: R`**(a)** During the reaction time the speed is constant: $24\times0.75=18$ m.

**(b)** With no time given, use $v^2=v_0^2+2a(x-x_0)$: $0=24^2-2(6.0)d$, so $d=\frac{576}{12}=48$ m.

**(c)** $18+48=66$ m. Braking takes $\frac{24}{6.0}=4.0$ s, so the total time is $4.75$ s.` },
    { tier: 'a', topic: 'Thrown up from a roof',
      stem: R`A ball is thrown straight up at $9.8$ m/s from the edge of a roof $14.7$ m above the ground. It misses the roof on the way down. Take $g=9.8$ m/s².`,
      parts: [R`When does it reach the top, and how high above the ground is it then?`, R`When does it hit the ground?`, R`Find its velocity just before it hits the ground.`],
      answer: [R`At $1.0$ s, $19.6$ m above the ground`, R`At $3.0$ s`, R`$-19.6$ m/s ($19.6$ m/s downward)`],
      sol: R`**(a)** At the top $v=0$: $t=\frac{v_0}{g}=1.0$ s. It rises $\frac{v_0^2}{2g}=\frac{9.8^2}{19.6}=4.9$ m above the roof: $19.6$ m above the ground.

**(b)** With the ground as $y=0$: $14.7+9.8t-4.9t^2=0$. Divide by $4.9$: $t^2-2t-3=0$, so $(t-3)(t+1)=0$ and $t=3.0$ s.

**(c)** $v=9.8-9.8\times3.0=-19.6$ m/s. **Check** From the top it falls $19.6$ m from rest: $\sqrt{2(9.8)(19.6)}=19.6$ m/s.` },
    { tier: 'a', topic: 'A position given by a sine',
      stem: R`A particle moves along the $x$-axis with $x=4\sin\left(\frac{\pi t}{2}\right)$, in metres and seconds.`,
      parts: [R`Find $v(t)$ and $a(t)$.`, R`When is it first at rest after $t=0$, and where?`, R`Find $v$ and $a$ at $t=\frac{2}{3}$ s.`, R`Show that $a=-\frac{\pi^2}{4}x$.`],
      answer: [R`$v=2\pi\cos\left(\frac{\pi t}{2}\right)$, $a=-\pi^2\sin\left(\frac{\pi t}{2}\right)$`, R`At $t=1$ s, at $x=4$ m`,
        R`$v=\pi\approx3.1$ m/s, $a=-\frac{\sqrt{3}}{2}\pi^2\approx-8.5$ m/s²`, R`$a=-\pi^2\cdot\frac{x}{4}$`],
      sol: R`**(a)** Chain rule: the derivative of $\sin(kt)$ is $k\cos(kt)$, with $k=\frac{\pi}{2}$. So $v=4\cdot\frac{\pi}{2}\cos\frac{\pi t}{2}=2\pi\cos\frac{\pi t}{2}$. Again: the derivative of $\cos(kt)$ is $-k\sin(kt)$, so $a=-2\pi\cdot\frac{\pi}{2}\sin\frac{\pi t}{2}=-\pi^2\sin\frac{\pi t}{2}$.

**(b)** $v=0$ when $\cos\frac{\pi t}{2}=0$, first at $\frac{\pi t}{2}=\frac{\pi}{2}$: $t=1$ s, where $x=4\sin\frac{\pi}{2}=4$ m, the far end of the swing.

**(c)** $\frac{\pi t}{2}=\frac{\pi}{3}$: $v=2\pi\cos\frac{\pi}{3}=\pi$ m/s and $a=-\pi^2\sin\frac{\pi}{3}=-\frac{\sqrt{3}}{2}\pi^2$ m/s².

**(d)** $\sin\frac{\pi t}{2}=\frac{x}{4}$, so $a=-\pi^2\cdot\frac{x}{4}$. The acceleration always points back toward $x=0$.` },
    { tier: 'a', topic: 'Reading a v–t graph', fig: 'p2-9',
      stem: R`Figure P2-9 is the $v$–$t$ graph of a car on a straight road.`,
      parts: [R`Find the acceleration during each part of the trip.`, R`Find the displacement over the $14$ s.`, R`Find the average velocity.`,
        R`When has the car covered half of the distance?`],
      answer: [R`$2.0$ m/s² ($0$–$4$ s), $0$ ($4$–$10$ s), $-2.0$ m/s² ($10$–$14$ s)`, R`$80$ m`, R`$\frac{40}{7}\approx5.7$ m/s`, R`At $t=7.0$ s`],
      sol: R`**(a)** Acceleration is the slope: $\frac{8}{4}=2.0$, then $0$, then $\frac{0-8}{4}=-2.0$ m/s².

**(b)** Displacement is the area under the graph: $\frac{1}{2}(4)(8)+6(8)+\frac{1}{2}(4)(8)=16+48+16=80$ m.

**(c)** $\frac{80}{14}=\frac{40}{7}$ m/s.

**(d)** Half is $40$ m. By $t=4$ s the car has gone $16$ m; the other $24$ m at $8$ m/s take $3.0$ s more: $t=7.0$ s.` },
    { tier: 'x', topic: 'Catching up',
      stem: R`Car A waits at a traffic light. The moment it turns green, A starts with a constant acceleration of $2.0$ m/s², and at that instant car B passes it at a constant $12$ m/s.`,
      parts: [R`When does A catch up with B?`, R`How far from the light is that?`, R`Find A's speed then.`, R`Find the greatest distance between the cars before A catches up, and when it happens.`],
      answer: [R`$12$ s after the light turns green`, R`$144$ m`, R`$24$ m/s`, R`$36$ m, at $t=6.0$ s`],
      sol: R`**Positions** From the light, $x_A=\frac{1}{2}(2.0)t^2=t^2$ and $x_B=12t$.

**(a)** $t^2=12t$ gives $t=0$ (the start) or $t=12$ s.

**(b)** $x=12\times12=144$ m.

**(c)** $v_A=at=24$ m/s, twice B's speed: A's average speed from rest equals B's constant speed.

**(d)** The gap is $12t-t^2$. It grows while B is faster and shrinks once A is faster, so it is greatest when the speeds are equal: $2t=12$, $t=6.0$ s. Then the gap is $72-36=36$ m.` },
    { tier: 'x', topic: 'From acceleration to position by integration',
      stem: R`An object starts from rest at $x=0$ at $t=0$, with an acceleration that grows in time: $a=6t$ (in m/s², with $t$ in s).`,
      parts: [R`From $\frac{dv}{dt}=a$, find $v(t)$, using the starting condition.`, R`From $\frac{dx}{dt}=v$, find $x(t)$.`,
        R`Where is the object when its speed is $12$ m/s?`, R`Why can't $v^2=v_0^2+2a(x-x_0)$ be used here?`],
      answer: [R`$v=3t^2$`, R`$x=t^3$`, R`At $x=8.0$ m (at $t=2.0$ s)`, R`It needs a constant acceleration, and here $a$ changes`],
      sol: R`**(a)** $v=\int6t\,dt=3t^2+C$. At $t=0$, $v=0$, so $C=0$.

**(b)** $x=\int3t^2\,dt=t^3+C'$, and $x(0)=0$ gives $C'=0$.

**(c)** $3t^2=12$ gives $t=2.0$ s, so $x=8.0$ m.

**(d)** The five equations come from a constant $a$. Here $a$ goes from $0$ to $12$ m/s² in the first $2$ s; trying the formula with $a=12$ would give $x=\frac{144}{24}=6$ m, which is wrong. Integrate instead.` },
    { tier: 'x', topic: 'From a v–t graph to a and x', fig: 'p2-12',
      stem: R`Figure P2-12 is the $v$–$t$ graph of an object moving along the $x$-axis. At $t=0$ it is at $x=2.0$ m.`,
      parts: [R`Draw the $a$–$t$ graph.`, R`When does the object turn around?`, R`Find the displacement and the distance travelled from $t=0$ to $t=8$ s.`, R`Where is the object at $t=8$ s?`],
      answer: [R`$a=2.0$ m/s² for $0<t<4$ s, $0$ for $4<t<6$ s, $-2.0$ m/s² for $6<t<8$ s`, R`At $t=2.0$ s`, R`Displacement $12$ m; distance $20$ m`, R`$x=14$ m`],
      sol: R`**(a)** The slope of each straight piece: $\frac{4-(-4)}{4}=2.0$, then $0$, then $\frac{0-4}{2}=-2.0$ m/s².

[[fig:p2-12a]]

**(b)** The velocity changes sign at $t=2.0$ s: before it the object moves in $-x$, after it in $+x$.

**(c)** Areas, with signs: $0$–$2$ s: $\frac{1}{2}(2)(-4)=-4$ m; $2$–$4$ s: $+4$ m; $4$–$6$ s: $8$ m; $6$–$8$ s: $\frac{1}{2}(2)(4)=4$ m. Displacement $-4+4+8+4=12$ m. Distance adds the sizes: $4+4+8+4=20$ m.

**(d)** $x=2.0+12=14$ m.` },
    { tier: 'x', topic: 'A rocket that runs out of fuel',
      stem: R`A small rocket rises straight up from the ground with a constant acceleration of $4.9$ m/s² for $4.0$ s. Then its engine stops and it moves in free fall. Take $g=9.8$ m/s² and ignore air.`,
      parts: [R`Find its height and speed when the engine stops.`, R`Find its greatest height.`, R`How long after launch does it hit the ground?`, R`How fast is it going then?`],
      answer: [R`$39.2$ m, $19.6$ m/s`, R`$58.8$ m`, R`$6+2\sqrt{3}\approx9.5$ s`, R`$19.6\sqrt{3}\approx34$ m/s`],
      sol: R`**(a)** $v=at=4.9\times4.0=19.6$ m/s and $h=\frac{1}{2}at^2=\frac{1}{2}(4.9)(16)=39.2$ m.

**(b)** It keeps rising, slowed by gravity, for $\frac{19.6}{9.8}=2.0$ s and another $\frac{19.6^2}{2(9.8)}=19.6$ m: $58.8$ m in all.

**(c)** From the top it falls $58.8$ m from rest: $t=\sqrt{\frac{2(58.8)}{9.8}}=\sqrt{12}=2\sqrt{3}$ s. Total: $4+2+2\sqrt{3}=6+2\sqrt{3}$ s.

**(d)** $v=\sqrt{2(9.8)(58.8)}=\sqrt{3\times19.6^2}=19.6\sqrt{3}$ m/s.` },
  ],
  // ===================================================================================================================
  c3: [
    { tier: 'f', topic: 'Components and polar form',
      parts: [R`Find the components of a displacement of $20$ m at $30^\circ$ counterclockwise from the $+x$-axis.`,
        R`Find the magnitude and direction of $\vec{b}=-5\hat{i}+12\hat{j}$ (in m).`,
        R`A $10$ N force points $37^\circ$ below the $-x$-axis. Find its components.`],
      answer: [R`$(10\sqrt{3},\,10)\approx(17.3,\,10)$ m`, R`$13$ m, at $180^\circ-\tan^{-1}\frac{12}{5}\approx113^\circ$ from $+x$`, R`$(-8.0,\,-6.0)$ N`],
      sol: R`**(a)** $a_x=20\cos30^\circ=10\sqrt{3}$ and $a_y=20\sin30^\circ=10$.

**(b)** $|\vec{b}|=\sqrt{25+144}=13$ m. $\tan^{-1}\frac{12}{-5}$ gives an angle in the fourth quadrant, but $\vec{b}$ points left and up, into the second: add $180^\circ$.

**(c)** It points at $180^\circ+37^\circ$ from $+x$: $F_x=-10\cos37^\circ=-8.0$ and $F_y=-10\sin37^\circ=-6.0$ N, using $\cos37^\circ\approx0.80$ and $\sin37^\circ\approx0.60$.` },
    { tier: 'f', topic: 'Adding and scaling vectors',
      stem: R`$\vec{a}=3\hat{i}-2\hat{j}+\hat{k}$ and $\vec{b}=-\hat{i}+4\hat{j}+2\hat{k}$.`,
      parts: [R`Find $\vec{a}+\vec{b}$.`, R`Find $2\vec{a}-\vec{b}$.`, R`Find $|\vec{a}+\vec{b}|$.`, R`Find $\vec{c}$ such that $\vec{a}+\vec{b}+\vec{c}=\vec{0}$.`],
      answer: [R`$2\hat{i}+2\hat{j}+3\hat{k}$`, R`$7\hat{i}-8\hat{j}$`, R`$\sqrt{17}$`, R`$\vec{c}=-2\hat{i}-2\hat{j}-3\hat{k}$`],
      sol: R`**(a)** Add component by component: $(3-1)\hat{i}+(-2+4)\hat{j}+(1+2)\hat{k}$.

**(b)** $2\vec{a}=6\hat{i}-4\hat{j}+2\hat{k}$, and subtracting $\vec{b}$: $(6+1)\hat{i}+(-4-4)\hat{j}+(2-2)\hat{k}$.

**(c)** $\sqrt{2^2+2^2+3^2}=\sqrt{17}$.

**(d)** $\vec{c}=-(\vec{a}+\vec{b})$: the same length, pointing the opposite way.` },
    { tier: 'f', topic: 'The dot product',
      stem: R`$\vec{a}=2\hat{i}+3\hat{j}-\hat{k}$ and $\vec{b}=\hat{i}-\hat{j}+4\hat{k}$.`,
      parts: [R`Find $\vec{a}\cdot\vec{b}$.`, R`Find $|\vec{a}|$ and $|\vec{b}|$.`, R`Find $\cos\phi$ for the angle $\phi$ between them. Is $\phi$ acute or obtuse?`],
      answer: [R`$-5$`, R`$\sqrt{14}$ and $3\sqrt{2}$`, R`$\cos\phi=-\frac{5}{6\sqrt{7}}\approx-0.31$: obtuse`],
      sol: R`**(a)** Multiply matching components and add: $2-3-4=-5$.

**(b)** $\sqrt{4+9+1}=\sqrt{14}$ and $\sqrt{1+1+16}=\sqrt{18}=3\sqrt{2}$.

**(c)** $\cos\phi=\frac{\vec{a}\cdot\vec{b}}{ab}=\frac{-5}{\sqrt{14}\cdot3\sqrt{2}}=\frac{-5}{3\sqrt{28}}=-\frac{5}{6\sqrt{7}}$. A negative dot product always means an obtuse angle.` },
    { tier: 'f', topic: 'Cross products of simple vectors',
      parts: [R`Find $\hat{i}\times\hat{j}$, $\hat{j}\times\hat{i}$ and $\hat{k}\times\hat{k}$.`, R`Find $(2\hat{i})\times(3\hat{j})$.`, R`Find $(\hat{i}+\hat{j})\times(\hat{i}-\hat{j})$.`,
        R`What is the angle between $\hat{i}+\hat{j}$ and $\hat{i}-\hat{j}$?`],
      answer: [R`$\hat{k}$, $-\hat{k}$ and $\vec{0}$`, R`$6\hat{k}$`, R`$-2\hat{k}$`, R`$90^\circ$`],
      sol: R`**(a)** Cyclic order $i\to j\to k$ gives $+$; reversing it gives $-$. A vector crossed with itself is zero, since $\sin0=0$.

**(b)** Numbers come out front: $6\,(\hat{i}\times\hat{j})=6\hat{k}$.

**(c)** Expand: $\hat{i}\times\hat{i}-\hat{i}\times\hat{j}+\hat{j}\times\hat{i}-\hat{j}\times\hat{j}=0-\hat{k}-\hat{k}-0=-2\hat{k}$.

**(d)** $(\hat{i}+\hat{j})\cdot(\hat{i}-\hat{j})=1-1=0$: perpendicular. **Check** $|\vec{a}\times\vec{b}|=ab\sin\phi=\sqrt{2}\sqrt{2}\cdot1=2$.` },
    { tier: 'f', topic: 'Scalars, vectors and unit vectors',
      parts: [R`Which of these are vectors: displacement, speed, force, work, kinetic energy, acceleration, mass?`,
        R`Find the unit vector along $\vec{r}=6\hat{i}-2\hat{j}+3\hat{k}$.`, R`Find the vector of length $14$ in the direction of $\vec{r}$.`],
      answer: [R`Displacement, force and acceleration`, R`$\hat{r}=\frac{1}{7}(6\hat{i}-2\hat{j}+3\hat{k})$`, R`$12\hat{i}-4\hat{j}+6\hat{k}$`],
      sol: R`**(a)** A vector needs a direction. Speed is the size of velocity; work and kinetic energy are numbers, and mass has no direction.

**(b)** $|\vec{r}|=\sqrt{36+4+9}=7$, so divide each component by $7$.

**(c)** $14\hat{r}=2\vec{r}$.` },
    { tier: 'a', topic: 'Angle, projection and area',
      stem: R`$\vec{a}=2\hat{i}+2\hat{j}+\hat{k}$ and $\vec{b}=4\hat{i}+3\hat{k}$.`,
      parts: [R`Find $\vec{a}\cdot\vec{b}$ and $\cos\phi$.`, R`Find the component of $\vec{a}$ along $\vec{b}$.`, R`Find $\vec{a}\times\vec{b}$.`,
        R`Find the area of the triangle with sides $\vec{a}$ and $\vec{b}$.`],
      answer: [R`$11$, $\cos\phi=\frac{11}{15}$`, R`$\frac{11}{5}=2.2$`, R`$6\hat{i}-2\hat{j}-8\hat{k}$`, R`$\sqrt{26}\approx5.1$`],
      sol: R`**(a)** $\vec{a}\cdot\vec{b}=8+0+3=11$. With $a=3$ and $b=5$: $\cos\phi=\frac{11}{15}$.

**(b)** $a\cos\phi=\frac{\vec{a}\cdot\vec{b}}{b}=\frac{11}{5}$.

**(c)** Component by component:
- $\hat{i}$: $a_yb_z-a_zb_y=6-0=6$
- $\hat{j}$: $a_zb_x-a_xb_z=4-6=-2$
- $\hat{k}$: $a_xb_y-a_yb_x=0-8=-8$

**(d)** $|\vec{a}\times\vec{b}|=\sqrt{36+4+64}=\sqrt{104}=2\sqrt{26}$ is the parallelogram; the triangle is half: $\sqrt{26}$. **Check** $ab\sin\phi=15\sqrt{1-\frac{121}{225}}=\sqrt{104}$.` },
    { tier: 'a', topic: 'A walk in three legs',
      stem: R`A hiker walks $10$ km at $37^\circ$ north of east, then $5.0$ km south, then $6.0$ km west. Take $x$ east and $y$ north.`,
      parts: [R`Write each leg in unit-vector notation.`, R`Find the total displacement.`, R`Find its magnitude and direction.`],
      answer: [R`$8.0\hat{i}+6.0\hat{j}$, $-5.0\hat{j}$ and $-6.0\hat{i}$ (km)`, R`$2.0\hat{i}+1.0\hat{j}$ km`, R`$\sqrt{5}\approx2.2$ km, at $\tan^{-1}\frac{1}{2}\approx27^\circ$ north of east`],
      sol: R`**(a)** $10\cos37^\circ=8.0$ and $10\sin37^\circ=6.0$.

**(b)** $(8.0-6.0)\hat{i}+(6.0-5.0)\hat{j}$.

**(c)** $\sqrt{4+1}=\sqrt{5}$ km, pointing into the first quadrant: $\tan\theta=\frac{1}{2}$.` },
    { tier: 'a', topic: 'Solving for two vectors',
      stem: R`Two vectors satisfy $\vec{a}+\vec{b}=5\hat{i}+\hat{j}$ and $\vec{a}-\vec{b}=\hat{i}-3\hat{j}$.`,
      parts: [R`Find $\vec{a}$ and $\vec{b}$.`, R`Find $\vec{a}\cdot\vec{b}$.`, R`Find $\vec{a}\times\vec{b}$.`, R`Find the angle between them.`],
      answer: [R`$\vec{a}=3\hat{i}-\hat{j}$, $\vec{b}=2\hat{i}+2\hat{j}$`, R`$4$`, R`$8\hat{k}$`, R`$\cos\phi=\frac{1}{\sqrt{5}}$, $\phi\approx63^\circ$`],
      sol: R`**(a)** Add the equations: $2\vec{a}=6\hat{i}-2\hat{j}$. Subtract them: $2\vec{b}=4\hat{i}+4\hat{j}$.

**(b)** $6-2=4$.

**(c)** Both lie in the $xy$-plane, so only $\hat{k}$ survives: $a_xb_y-a_yb_x=6+2=8$.

**(d)** $a=\sqrt{10}$, $b=2\sqrt{2}$: $\cos\phi=\frac{4}{\sqrt{10}\cdot2\sqrt{2}}=\frac{1}{\sqrt{5}}$. **Check** $\sin\phi=\frac{8}{4\sqrt{5}}=\frac{2}{\sqrt{5}}$, and $\frac{1}{5}+\frac{4}{5}=1$.` },
    { tier: 'x', topic: 'Magnetic force on a moving proton',
      stem: R`A proton (charge $+e$) moves with velocity $\vec{v}=3\hat{i}+2\hat{j}-\hat{k}$ through a magnetic field $\vec{B}=\hat{i}-\hat{j}+2\hat{k}$, both in suitable units. The magnetic force on it is $\vec{F}=e\,\vec{v}\times\vec{B}$.`,
      parts: [R`Find $\vec{v}\cdot\vec{B}$.`, R`Find $\vec{v}\times\vec{B}$.`, R`Write $\vec{F}$ in unit-vector notation.`, R`Find $|\vec{F}|$.`,
        R`Show that $\vec{F}$ is perpendicular to both $\vec{v}$ and $\vec{B}$. What power does this force deliver?`],
      answer: [R`$-1$`, R`$3\hat{i}-7\hat{j}-5\hat{k}$`, R`$\vec{F}=e\,(3\hat{i}-7\hat{j}-5\hat{k})$`, R`$\sqrt{83}\,e$`,
        R`$\vec{F}\cdot\vec{v}=e(9-14+5)=0$ and $\vec{F}\cdot\vec{B}=e(3+7-10)=0$; power $0$`],
      sol: R`**(a)** $3-2-2=-1$.

**(b)** Component by component:
- $\hat{i}$: $v_yB_z-v_zB_y=4-1=3$
- $\hat{j}$: $v_zB_x-v_xB_z=-1-6=-7$
- $\hat{k}$: $v_xB_y-v_yB_x=-3-2=-5$

**(c)** The charge is $+e$, so the signs stay: $\vec{F}=3e\,\hat{i}-7e\,\hat{j}-5e\,\hat{k}$. For an electron every sign would flip.

**(d)** $e\sqrt{9+49+25}=\sqrt{83}\,e$.

**(e)** A cross product is perpendicular to both of its vectors. The power is $\vec{F}\cdot\vec{v}=0$, so a magnetic force never changes the proton's speed.` },
    { tier: 'x', topic: 'A triangle in space',
      stem: R`The points $P(1,0,2)$, $Q(3,1,2)$ and $R(1,2,4)$ (in m) form a triangle.`,
      parts: [R`Find $\overrightarrow{PQ}$ and $\overrightarrow{PR}$.`, R`Find $\overrightarrow{PQ}\times\overrightarrow{PR}$.`, R`Find the area of the triangle.`,
        R`Find a unit vector perpendicular to the triangle.`, R`Find the cosine of the angle at $P$.`],
      answer: [R`$2\hat{i}+\hat{j}$ and $2\hat{j}+2\hat{k}$`, R`$2\hat{i}-4\hat{j}+4\hat{k}$`, R`$3\ \text{m}^2$`, R`$\pm\frac{1}{3}(\hat{i}-2\hat{j}+2\hat{k})$`, R`$\frac{1}{\sqrt{10}}$`],
      sol: R`**(a)** End minus start: $(3-1,\,1-0,\,2-2)$ and $(1-1,\,2-0,\,4-2)$.

**(b)** $\hat{i}$: $1\cdot2-0\cdot2=2$; $\hat{j}$: $0\cdot0-2\cdot2=-4$; $\hat{k}$: $2\cdot2-1\cdot0=4$.

**(c)** The parallelogram has area $\sqrt{4+16+16}=6$; the triangle is half of it.

**(d)** The cross product is perpendicular to both sides: divide it by its length $6$.

**(e)** $\cos\phi=\frac{\overrightarrow{PQ}\cdot\overrightarrow{PR}}{|\overrightarrow{PQ}||\overrightarrow{PR}|}=\frac{2}{\sqrt{5}\cdot2\sqrt{2}}=\frac{1}{\sqrt{10}}$.` },
    { tier: 'x', topic: 'Sizes of sums and differences',
      stem: R`Vectors $\vec{a}$ and $\vec{b}$ have the same magnitude $A$, and the angle between them is $\phi$.`,
      parts: [R`Write $|\vec{a}+\vec{b}|^2$ in terms of $A$ and $\phi$.`, R`For which $\phi$ is $|\vec{a}+\vec{b}|=A$?`, R`For which $\phi$ is $|\vec{a}-\vec{b}|=A$?`,
        R`When is $|\vec{a}+\vec{b}|=|\vec{a}-\vec{b}|$?`],
      answer: [R`$2A^2(1+\cos\phi)$`, R`$\phi=120^\circ$`, R`$\phi=60^\circ$`, R`When $\phi=90^\circ$`],
      sol: R`**(a)** $(\vec{a}+\vec{b})\cdot(\vec{a}+\vec{b})=a^2+b^2+2\vec{a}\cdot\vec{b}=2A^2+2A^2\cos\phi$.

**(b)** $2A^2(1+\cos\phi)=A^2$ gives $\cos\phi=-\frac{1}{2}$.

**(c)** The same way, $|\vec{a}-\vec{b}|^2=2A^2(1-\cos\phi)=A^2$ gives $\cos\phi=\frac{1}{2}$.

**(d)** Equal when $\vec{a}\cdot\vec{b}=0$: the two diagonals of a parallelogram are equal only for a rectangle.` },
    { tier: 'x', topic: 'Angles in a cube',
      stem: R`A cube of side $1$ has one corner at the origin and edges along the $x$-, $y$- and $z$-axes.`,
      parts: [R`Find the angle between the body diagonal from the origin and the edge along $x$.`,
        R`Find the angle between that body diagonal and the one from $(1,0,0)$ to $(0,1,1)$.`, R`Find the angle between the body diagonal from the origin and the face diagonal $\hat{i}+\hat{j}$.`],
      answer: [R`$\cos\phi=\frac{1}{\sqrt{3}}$ ($\approx55^\circ$)`, R`$\cos\phi=\frac{1}{3}$ ($\approx71^\circ$)`, R`$\cos\phi=\frac{\sqrt{6}}{3}$ ($\approx35^\circ$)`],
      sol: R`**(a)** The diagonal is $\hat{i}+\hat{j}+\hat{k}$, of length $\sqrt{3}$: $\cos\phi=\frac{(\hat{i}+\hat{j}+\hat{k})\cdot\hat{i}}{\sqrt{3}}=\frac{1}{\sqrt{3}}$.

**(b)** The second diagonal is $-\hat{i}+\hat{j}+\hat{k}$: $\cos\phi=\frac{-1+1+1}{\sqrt{3}\sqrt{3}}=\frac{1}{3}$.

**(c)** $\cos\phi=\frac{1+1+0}{\sqrt{3}\sqrt{2}}=\frac{2}{\sqrt{6}}=\frac{\sqrt{6}}{3}$.` },
  ],
  // ===================================================================================================================
  c4: [
    { tier: 'f', topic: 'Displacement and average velocity in 2D',
      stem: R`A particle is at $\vec{r}_1=-2\hat{i}+5\hat{j}$ (m) at $t=1.0$ s and at $\vec{r}_2=4\hat{i}-3\hat{j}$ (m) at $t=3.0$ s.`,
      parts: [R`Find the displacement.`, R`Find its magnitude.`, R`Find the average velocity and its magnitude.`],
      answer: [R`$6\hat{i}-8\hat{j}$ m`, R`$10$ m`, R`$3\hat{i}-4\hat{j}$ m/s, $5.0$ m/s`],
      sol: R`**(a)** $\Delta\vec{r}=\vec{r}_2-\vec{r}_1=(4+2)\hat{i}+(-3-5)\hat{j}$.

**(b)** $\sqrt{36+64}=10$ m.

**(c)** Divide by $\Delta t=2.0$ s: $3\hat{i}-4\hat{j}$ m/s, of size $5.0$ m/s.` },
    { tier: 'f', topic: 'Velocity and acceleration from r(t)',
      stem: R`A particle moves in a plane with $\vec{r}=2t^2\,\hat{i}+(5t-t^2)\,\hat{j}$, in metres and seconds.`,
      parts: [R`Find $\vec{v}(t)$.`, R`Find $\vec{a}(t)$.`, R`Find the velocity and the speed at $t=2.0$ s.`, R`When does the particle move parallel to the $x$-axis?`],
      answer: [R`$\vec{v}=4t\,\hat{i}+(5-2t)\,\hat{j}$`, R`$\vec{a}=4\hat{i}-2\hat{j}$, constant`, R`$8\hat{i}+\hat{j}$ m/s; $\sqrt{65}\approx8.1$ m/s`, R`At $t=2.5$ s`],
      sol: R`**(a)** Differentiate each component.

**(b)** Differentiate again: $4$ and $-2$, with no $t$ left.

**(c)** $\vec{v}(2)=8\hat{i}+1\hat{j}$, so the speed is $\sqrt{64+1}$.

**(d)** Parallel to the $x$-axis means $v_y=0$: $5-2t=0$.` },
    { tier: 'f', topic: 'Launched horizontally',
      stem: R`A ball leaves the edge of a cliff $19.6$ m high moving horizontally at $14.7$ m/s. Take $g=9.8$ m/s² and ignore air.`,
      parts: [R`How long does it take to reach the ground?`, R`How far from the foot of the cliff does it land?`, R`Find the speed and the direction of its velocity at landing.`],
      answer: [R`$2.0$ s`, R`$29.4$ m`, R`$24.5$ m/s, at $53^\circ$ below the horizontal`],
      sol: R`**(a)** Vertically it simply falls from rest: $19.6=\frac{1}{2}(9.8)t^2$, so $t=2.0$ s.

**(b)** Horizontally the speed never changes: $14.7\times2.0=29.4$ m.

**(c)** $v_x=14.7$ and $v_y=-9.8\times2.0=-19.6$ m/s. These are $4.9\times(3,\,-4)$, so the speed is $4.9\times5=24.5$ m/s, and $\tan\theta=\frac{19.6}{14.7}=\frac{4}{3}$: $53^\circ$ below the horizontal.` },
    { tier: 'f', topic: 'A turning wheel',
      stem: R`A wheel of radius $0.40$ m turns steadily at $2.0$ revolutions per second.`,
      parts: [R`Find the period.`, R`Find the speed of a point on the rim.`, R`Find its centripetal acceleration.`],
      answer: [R`$0.50$ s`, R`$1.6\pi\approx5.0$ m/s`, R`$6.4\pi^2\approx63$ m/s²`],
      sol: R`**(a)** $T=\frac{1}{2.0}=0.50$ s per revolution.

**(b)** $v=\frac{2\pi r}{T}=\frac{2\pi(0.40)}{0.50}=1.6\pi$ m/s.

**(c)** $a=\frac{v^2}{r}=\frac{2.56\pi^2}{0.40}=6.4\pi^2$ m/s², pointing to the centre: more than six times $g$.` },
    { tier: 'f', topic: 'Relative velocity on a straight track',
      stem: R`Train A moves east at $72$ km/h, and train B moves west at $54$ km/h on the next track.`,
      parts: [R`Write both speeds in m/s.`, R`Find the velocity of B relative to A.`, R`Train B is $140$ m long. How long does it take to pass a passenger sitting at a window of A?`],
      answer: [R`$20$ m/s and $15$ m/s`, R`$35$ m/s west`, R`$4.0$ s`],
      sol: R`**(a)** Divide by $3.6$.

**(b)** With east as $+x$: $v_{BA}=v_{BG}-v_{AG}=-15-20=-35$ m/s.

**(c)** The passenger sees B's whole length go by at $35$ m/s: $\frac{140}{35}=4.0$ s.` },
    { tier: 'a', topic: 'A projectile on level ground',
      stem: R`A ball is kicked from level ground at $24.5$ m/s, $53^\circ$ above the horizontal. Use $\sin53^\circ\approx0.80$, $\cos53^\circ\approx0.60$ and $g=9.8$ m/s².`,
      parts: [R`Find the components of the launch velocity.`, R`Find the time of flight and the range.`, R`Find the greatest height.`, R`Find the velocity and the speed at $t=3.0$ s.`],
      answer: [R`$v_{0x}=14.7$ m/s, $v_{0y}=19.6$ m/s`, R`$4.0$ s and $58.8$ m`, R`$19.6$ m`, R`$14.7\hat{i}-9.8\hat{j}$ m/s; $4.9\sqrt{13}\approx18$ m/s`],
      sol: R`**(a)** $24.5\times0.60=14.7$ and $24.5\times0.80=19.6$.

**(b)** It is back at $y=0$ when $19.6t-4.9t^2=0$: $t=4.0$ s. Range $14.7\times4.0=58.8$ m.

**(c)** The top is halfway, at $t=2.0$ s: $\frac{v_{0y}^2}{2g}=\frac{19.6^2}{19.6}=19.6$ m.

**(d)** $v_y=19.6-9.8\times3.0=-9.8$ m/s: on its way down. Speed $\sqrt{14.7^2+9.8^2}=4.9\sqrt{9+4}$.` },
    { tier: 'a', topic: 'Rain seen from a bicycle',
      stem: R`Rain falls straight down at $8.0$ m/s. A cyclist rides east at $6.0$ m/s. Take $x$ east and $y$ up.`,
      parts: [R`Find the velocity of the rain relative to the cyclist.`, R`Find its speed, and its angle from the vertical.`, R`Which way should the cyclist tilt an umbrella?`],
      answer: [R`$-6.0\hat{i}-8.0\hat{j}$ m/s`, R`$10$ m/s, at $37^\circ$ from the vertical`, R`Forward (east) by $37^\circ$`],
      sol: R`**(a)** $\vec{v}_{\text{rain, cyclist}}=\vec{v}_{\text{rain, ground}}-\vec{v}_{\text{cyclist, ground}}=-8.0\hat{j}-6.0\hat{i}$.

**(b)** $\sqrt{36+64}=10$ m/s; $\tan\theta=\frac{6.0}{8.0}=\frac{3}{4}$, so $37^\circ$.

**(c)** To the cyclist the rain comes from ahead, slanting back toward her: tilt the top of the umbrella forward, into it.` },
    { tier: 'a', topic: 'Velocity and acceleration on a circle',
      stem: R`A particle moves counterclockwise at a constant $4.0$ m/s around a circle of radius $2.0$ m centred at the origin. At one moment it is at $(\sqrt{2},\,\sqrt{2})$ m.`,
      parts: [R`At what angle $\theta$ from the $+x$-axis is it?`, R`Find its velocity vector.`, R`Find its acceleration vector and the size of the acceleration.`, R`How long does one revolution take?`],
      answer: [R`$45^\circ$`, R`$-2\sqrt{2}\,\hat{i}+2\sqrt{2}\,\hat{j}$ m/s`, R`$-4\sqrt{2}\,\hat{i}-4\sqrt{2}\,\hat{j}$ m/s², of size $8.0$ m/s²`, R`$\pi\approx3.1$ s`],
      sol: R`**(a)** $\tan\theta=\frac{\sqrt{2}}{\sqrt{2}}=1$ in the first quadrant.

**(b)** The velocity is tangent, $90^\circ$ ahead of the radius: $\vec{v}=v(-\sin\theta,\,\cos\theta)=4.0\left(-\frac{\sqrt{2}}{2},\,\frac{\sqrt{2}}{2}\right)$.

**(c)** It points to the centre with size $\frac{v^2}{r}=\frac{16}{2.0}=8.0$: $\vec{a}=-8.0(\cos45^\circ,\,\sin45^\circ)$.

**(d)** $T=\frac{2\pi r}{v}=\frac{4\pi}{4.0}=\pi$ s.` },
    { tier: 'a', topic: 'An acceleration that changes in 2D',
      stem: R`A particle starts at the origin with $\vec{v}_0=\hat{i}-3\hat{j}$ (m/s) and has acceleration $\vec{a}=2t\,\hat{i}+6\,\hat{j}$ (m/s²).`,
      parts: [R`Find $\vec{v}(t)$.`, R`Find $\vec{r}(t)$.`, R`When does the particle move parallel to the $x$-axis, and where is it then?`],
      answer: [R`$\vec{v}=(1+t^2)\,\hat{i}+(6t-3)\,\hat{j}$`, R`$\vec{r}=\left(t+\frac{t^3}{3}\right)\hat{i}+(3t^2-3t)\,\hat{j}$`, R`At $t=0.5$ s, at $\left(\frac{13}{24},\,-\frac{3}{4}\right)$ m`],
      sol: R`**(a)** Integrate each component and add the starting velocity: $v_x=1+t^2$, $v_y=-3+6t$.

**(b)** Integrate again, starting from $\vec{0}$.

**(c)** $v_y=0$ at $t=0.5$ s. Then $x=0.5+\frac{0.125}{3}=\frac{13}{24}$ m and $y=0.75-1.5=-0.75$ m.` },
    { tier: 'x', topic: 'Two angles to the same spot',
      stem: R`A ball is launched from the ground at $14$ m/s and must land on a target at the same height, $10\sqrt{3}$ m away. Take $g=9.8$ m/s² and ignore air.`,
      parts: [R`Show that $\sin2\theta_0=\frac{gR}{v_0^2}$, and find both launch angles.`, R`Find the time of flight for each.`, R`Find the greatest height for each.`],
      answer: [R`$\sin2\theta_0=\frac{\sqrt{3}}{2}$: $\theta_0=30^\circ$ or $60^\circ$`, R`$\frac{10}{7}\approx1.4$ s and $\frac{10\sqrt{3}}{7}\approx2.5$ s`, R`$2.5$ m and $7.5$ m`],
      sol: R`**(a)** It lands at $t=\frac{2v_0\sin\theta_0}{g}$, having gone $R=v_0\cos\theta_0\cdot t=\frac{v_0^2\cdot2\sin\theta_0\cos\theta_0}{g}=\frac{v_0^2\sin2\theta_0}{g}$. Here $\frac{gR}{v_0^2}=\frac{9.8\times10\sqrt{3}}{196}=\frac{\sqrt{3}}{2}$, so $2\theta_0=60^\circ$ or $120^\circ$.

**(b)** $\frac{2(14)\sin30^\circ}{9.8}=\frac{10}{7}$ s and $\frac{2(14)\sin60^\circ}{9.8}=\frac{10\sqrt{3}}{7}$ s.

**(c)** $\frac{(v_0\sin\theta_0)^2}{2g}$: $\frac{7^2}{19.6}=2.5$ m and $\frac{(7\sqrt{3})^2}{19.6}=7.5$ m. The low shot gets there sooner.` },
    { tier: 'x', topic: 'Down a staircase', fig: 'p4-11',
      stem: R`A ball rolls off the top landing of a staircase moving horizontally at $1.4$ m/s. Each step is $0.25$ m high and $0.20$ m deep (Figure P4-11). Take $g=9.8$ m/s².`,
      parts: [R`Measuring $x$ out from the edge and $y$ down from the landing, find the path $y(x)$.`, R`Which step does the ball land on first?`, R`Where on that step does it land, and when?`],
      answer: [R`$y=2.5x^2$ (in m)`, R`The third step`, R`$\sqrt{0.3}\approx0.55$ m out from the edge, after $\sqrt{\frac{1.5}{9.8}}\approx0.39$ s`],
      sol: R`**(a)** $x=1.4t$ and $y=4.9t^2$. Eliminate $t$: $y=4.9\frac{x^2}{1.96}=2.5x^2$.

**(b)** Step $n$ has its top $0.25n$ below the landing and its outer edge at $x=0.20n$. The ball passes that edge at depth $2.5(0.20n)^2=0.1n^2$. It clears step $n$ while $0.1n^2<0.25n$, that is for $n<2.5$: it clears steps 1 and 2 and lands on step 3.

**(c)** Step 3 is $0.75$ m down: $2.5x^2=0.75$ gives $x=\sqrt{0.3}\approx0.55$ m, which is between $0.40$ and $0.60$ m, on step 3. Time: $t=\sqrt{\frac{2(0.75)}{9.8}}$.` },
    { tier: 'x', topic: 'A target released as the ball is launched', fig: 'p4-12',
      stem: R`A target hangs $30$ m above the ground at a horizontal distance of $40$ m (Figure P4-12). A ball is launched from the ground straight at the target, at speed $v_0$, and the target is released from rest at the same instant. Take $g=9.8$ m/s² and ignore air.`,
      parts: [R`Find $\sin\theta_0$ and $\cos\theta_0$ for the launch direction.`, R`Show that the ball and the target meet, and find when, in terms of $v_0$.`,
        R`For $v_0=25$ m/s, when and at what height do they meet?`, R`What is the smallest $v_0$ for which they meet before the target hits the ground?`],
      answer: [R`$\sin\theta_0=\frac{3}{5}$, $\cos\theta_0=\frac{4}{5}$`, R`At $t=\frac{50}{v_0}$ (in s, with $v_0$ in m/s)`, R`At $2.0$ s, $10.4$ m above the ground`, R`$\frac{35}{\sqrt{3}}\approx20$ m/s`],
      sol: R`**(a)** The line of aim runs from $(0,0)$ to $(40,30)$, of length $50$ m.

**(b)** Without gravity the ball would reach the target's starting point at $t=\frac{50}{v_0}$. With gravity both fall the same $\frac{1}{2}gt^2$ below where they would be, so at that moment they are at the same place.

**(c)** $t=\frac{50}{25}=2.0$ s. Both are $\frac{1}{2}(9.8)(4)=19.6$ m below the target's start: $30-19.6=10.4$ m.

**(d)** The target lands when $\frac{1}{2}gt^2=30$, at $t^2=\frac{60}{9.8}$. The meeting comes first if $\frac{2500}{v_0^2}<\frac{60}{9.8}$, that is $v_0^2>\frac{1225}{3}$.` },
    { tier: 'x', topic: 'A headwind on a projectile',
      stem: R`A ball is launched from level ground at speed $v_0$, $45^\circ$ above the horizontal. A steady headwind gives it a constant horizontal acceleration $\frac{g}{4}$ against its motion. Take $x$ horizontal (the direction of the launch) and $y$ up.`,
      parts: [R`Write the acceleration vector.`, R`Find the time of flight.`, R`Find the range, and compare it with the range without wind.`, R`Find the horizontal velocity at landing.`],
      answer: [R`$\vec{a}=-\frac{g}{4}\hat{i}-g\,\hat{j}$`, R`$T=\frac{\sqrt{2}\,v_0}{g}$, the same as without wind`, R`$R=\frac{3v_0^2}{4g}$, three quarters of $\frac{v_0^2}{g}$`, R`$v_x=\frac{\sqrt{2}}{4}v_0$, half its starting value`],
      sol: R`**(a)** Gravity down, the wind backward.

**(b)** The vertical motion doesn't feel the wind: $v_0\sin45^\circ\,t-\frac{1}{2}gt^2=0$ gives $T=\frac{2v_0\sin45^\circ}{g}=\frac{\sqrt{2}v_0}{g}$.

**(c)** $x=\frac{v_0}{\sqrt{2}}T-\frac{1}{2}\cdot\frac{g}{4}T^2=\frac{v_0^2}{g}-\frac{g}{8}\cdot\frac{2v_0^2}{g^2}=\frac{v_0^2}{g}-\frac{v_0^2}{4g}$.

**(d)** $v_x=\frac{v_0}{\sqrt{2}}-\frac{g}{4}\cdot\frac{\sqrt{2}v_0}{g}=\frac{\sqrt{2}}{2}v_0-\frac{\sqrt{2}}{4}v_0$.` },
    { tier: 'x', topic: 'Flying across a wind',
      stem: R`A plane must fly due north over the ground. Its speed relative to the air is $200$ km/h, and the wind blows toward the east at $120$ km/h.`,
      parts: [R`In which direction must the plane point?`, R`Find its speed over the ground.`, R`How long does it take to fly $400$ km north?`, R`If it pointed due north instead, where would it be after $1.0$ h?`],
      answer: [R`$37^\circ$ west of north`, R`$160$ km/h`, R`$2.5$ h`, R`$200$ km north and $120$ km east of the start, $40\sqrt{34}\approx233$ km away`],
      sol: R`**(a)** $\vec{v}_{PG}=\vec{v}_{PA}+\vec{v}_{AG}$. The plane's eastward part must cancel the wind: $200\sin\alpha=120$, so $\sin\alpha=\frac{3}{5}$, pointing west of north.

**(b)** The northward part is what is left: $200\cos\alpha=160$ km/h.

**(c)** $\frac{400}{160}=2.5$ h.

**(d)** The velocities just add: $200$ km/h north and $120$ km/h east for an hour; $\sqrt{200^2+120^2}=40\sqrt{25+9}$.` },
  ],
  // ===================================================================================================================
  c5: [
    { tier: 'f', topic: 'Net force and acceleration',
      stem: R`Two forces act on a $2.0$ kg body: $\vec{F}_1=3\hat{i}+4\hat{j}$ N and $\vec{F}_2=-\hat{i}+2\hat{j}$ N.`,
      parts: [R`Find the net force.`, R`Find the acceleration and its size.`, R`What third force would make the body move at constant velocity?`],
      answer: [R`$2\hat{i}+6\hat{j}$ N`, R`$\hat{i}+3\hat{j}$ m/s², $\sqrt{10}\approx3.2$ m/s²`, R`$-2\hat{i}-6\hat{j}$ N`],
      sol: R`**(a)** Add the forces as vectors: $(3-1)\hat{i}+(4+2)\hat{j}$.

**(b)** $\vec{a}=\frac{\vec{F}_\text{net}}{m}$, component by component; $\sqrt{1+9}=\sqrt{10}$.

**(c)** Constant velocity needs $\vec{F}_\text{net}=\vec{0}$: the third force cancels the other two.` },
    { tier: 'f', topic: 'Mass and weight',
      stem: R`An astronaut has a mass of $60$ kg. On the Moon the free-fall acceleration is $1.6$ m/s²; on Earth it is $9.8$ m/s².`,
      parts: [R`Find her weight on Earth.`, R`Find her mass and her weight on the Moon.`, R`What horizontal force gives her an acceleration of $2.0$ m/s² on smooth ice, on Earth and on the Moon?`],
      answer: [R`$588$ N`, R`$60$ kg and $96$ N`, R`$120$ N in both places`],
      sol: R`**(a)** $W=mg=60\times9.8=588$ N.

**(b)** Mass is the amount of matter and doesn't change: $60$ kg. Weight does: $60\times1.6=96$ N.

**(c)** $F=ma=60\times2.0=120$ N. Horizontally only the mass matters, so pushing her is just as hard on the Moon.` },
    { tier: 'f', topic: 'The cable of an elevator',
      stem: R`A $1200$ kg elevator hangs from a cable. Take $g=9.8$ m/s² and up as positive.`,
      parts: [R`Find the tension when the elevator is at rest.`, R`Find it when the elevator moves up and speeds up at $1.2$ m/s².`, R`Find it when the elevator moves up and slows down at $1.2$ m/s².`,
        R`If the cable broke, what would the acceleration be?`],
      answer: [R`$1.18\times10^{4}$ N ($11\,760$ N)`, R`$1.32\times10^{4}$ N`, R`$1.03\times10^{4}$ N ($10\,320$ N)`, R`$g$ downward: free fall`],
      sol: R`**Set up** $T-mg=ma$, so $T=m(g+a)$.

**(a)** $a=0$: $T=1200\times9.8=11\,760$ N.

**(b)** $a=+1.2$: $T=1200\times11.0=13\,200$ N.

**(c)** Slowing down on the way up means the acceleration points down: $a=-1.2$, so $T=1200\times8.6=10\,320$ N.

**(d)** With $T=0$ only gravity acts: $a=-g$.` },
    { tier: 'f', topic: 'Action and reaction',
      stem: R`A $1.5$ kg book rests on a table. Take $g=9.8$ m/s².`,
      parts: [R`Name the forces on the book and give their sizes.`, R`Name the third-law partner of each.`,
        R`The weight and the normal force are equal and opposite. Why are they not a third-law pair?`],
      answer: [R`Gravity, $14.7$ N down (from Earth); the normal force, $14.7$ N up (from the table)`,
        R`The book pulls Earth up with $14.7$ N; the book pushes the table down with $14.7$ N`,
        R`Both act on the same body, the book; the two forces of a third-law pair act on two different bodies`],
      sol: R`**(a)** The book doesn't accelerate, so the two forces balance: $N=mg=14.7$ N.

**(b)** Swap the roles: if A pushes or pulls B, B pushes or pulls A just as hard, the opposite way. Each pair is one kind of force: gravity with gravity, contact with contact.

**(c)** They are equal here only because the book is in equilibrium. In an accelerating elevator they would differ; a third-law pair never does.` },
    { tier: 'f', topic: 'Down a frictionless ramp',
      stem: R`A $2.0$ kg block slides from rest down a frictionless ramp at $30^\circ$. Take $g=9.8$ m/s².`,
      parts: [R`Find its acceleration.`, R`Find the normal force on it.`, R`How long does it take to slide $9.8$ m?`, R`How fast is it going then?`],
      answer: [R`$4.9$ m/s²`, R`$9.8\sqrt{3}\approx17$ N`, R`$2.0$ s`, R`$9.8$ m/s`],
      sol: R`**(a)** Only gravity's part along the ramp drives it: $a=g\sin30^\circ=4.9$ m/s².

**(b)** Perpendicular to the ramp nothing moves: $N=mg\cos30^\circ=19.6\cdot\frac{\sqrt{3}}{2}$.

**(c)** $9.8=\frac{1}{2}(4.9)t^2$ gives $t^2=4$.

**(d)** $v=at=9.8$ m/s.` },
    { tier: 'a', topic: 'A train of three blocks',
      stem: R`Blocks of $1.0$, $2.0$ and $3.0$ kg are tied in a row by light strings on a frictionless floor. A horizontal force of $12$ N pulls the $3.0$ kg block, at the front.`,
      parts: [R`Find the acceleration.`, R`Find the tension in the string between the $3.0$ and $2.0$ kg blocks.`, R`Find the tension between the $2.0$ and $1.0$ kg blocks.`,
        R`If the same force pulled the $1.0$ kg block the other way instead, find both tensions.`],
      answer: [R`$2.0$ m/s²`, R`$6.0$ N`, R`$2.0$ N`, R`$10$ N between $1.0$ and $2.0$ kg, $6.0$ N between $2.0$ and $3.0$ kg`],
      sol: R`**(a)** The whole train: $a=\frac{12}{6.0}=2.0$ m/s².

**(b)** That string pulls the $2.0$ and $1.0$ kg blocks behind it: $T=3.0\times2.0=6.0$ N.

**(c)** It pulls only the last block: $T=1.0\times2.0=2.0$ N.

**(d)** Now $5.0$ kg follows the first string and $3.0$ kg the second: $10$ N and $6.0$ N. A string's tension is set by what it has to pull.` },
    { tier: 'a', topic: 'Pulling at an angle',
      stem: R`A $10$ kg box on a frictionless floor is pulled with $50$ N at $37^\circ$ above the horizontal. Use $\sin37^\circ\approx0.60$, $\cos37^\circ\approx0.80$ and $g=9.8$ m/s².`,
      parts: [R`Find the acceleration.`, R`Find the normal force.`, R`What is the largest pull at this angle before the box leaves the floor?`],
      answer: [R`$4.0$ m/s²`, R`$68$ N`, R`$\frac{490}{3}\approx163$ N`],
      sol: R`**(a)** Only the horizontal part, $50\times0.80=40$ N, speeds it up: $a=\frac{40}{10}$.

**(b)** Vertically: $N+50\times0.60-98=0$, so $N=68$ N. Pulling upward lightens the load on the floor.

**(c)** It lifts off when $N$ reaches $0$: $0.60F=98$.` },
    { tier: 'a', topic: 'A picture on a wire',
      stem: R`A $1.2$ kg picture hangs from a wire over a nail. Each half of the wire makes the same angle $\theta$ with the horizontal.`,
      parts: [R`Find the tension when $\theta=37^\circ$.`, R`Find it when $\theta=30^\circ$.`, R`What happens to the tension as the wire is made nearly horizontal?`],
      answer: [R`$9.8$ N`, R`$11.76\approx12$ N`, R`It grows without limit`],
      sol: R`**Balance at the nail** The horizontal parts of the two halves cancel; the vertical parts hold the weight: $2T\sin\theta=mg$, so $T=\frac{mg}{2\sin\theta}$.

**(a)** $T=\frac{11.76}{2\times0.60}=9.8$ N.

**(b)** $T=\frac{11.76}{2\times0.5}=11.76$ N.

**(c)** As $\theta\to0$, $\sin\theta\to0$ and $T\to\infty$: a perfectly straight wire could never hold the picture.` },
    { tier: 'a', topic: 'Force from x(t)',
      stem: R`A $2.0$ kg particle moves along the $x$-axis with $x=4t^3-3t^2+2$, in metres and seconds.`,
      parts: [R`Find the net force $F(t)$.`, R`When is the net force zero?`, R`Find the net force at $t=2.0$ s.`, R`Find the average net force from $t=0$ to $t=2.0$ s.`],
      answer: [R`$F=48t-12$ N`, R`At $t=0.25$ s`, R`$84$ N`, R`$36$ N`],
      sol: R`**(a)** $v=12t^2-6t$ and $a=24t-6$, so $F=ma=48t-12$.

**(b)** $48t=12$.

**(c)** $96-12=84$ N.

**(d)** $m\frac{\Delta v}{\Delta t}=2.0\cdot\frac{(48-12)-0}{2.0}=36$ N, which is also the average of $F$ over the interval because $F$ is linear in $t$.` },
    { tier: 'x', topic: 'Two blocks on a table and one hanging', fig: 'p5-10',
      stem: R`Blocks A (mass $M_A$) and B (mass $M_B$) sit on a frictionless table, tied together by a light string. A second string runs from B over a light, frictionless pulley at the edge of the table to block C (mass $m$), which hangs (Figure P5-10).`,
      parts: [R`Write Newton's second law for each block.`, R`Find the acceleration.`, R`Find the tension in each string.`, R`Evaluate for $M_A=2.0$ kg, $M_B=3.0$ kg, $m=5.0$ kg and $g=9.8$ m/s².`],
      answer: [R`A: $T_1=M_Aa$; B: $T_2-T_1=M_Ba$; C: $mg-T_2=ma$`, R`$a=\frac{mg}{M_A+M_B+m}$`,
        R`$T_1=\frac{M_Amg}{M_A+M_B+m}$, $T_2=\frac{(M_A+M_B)mg}{M_A+M_B+m}$`, R`$a=4.9$ m/s², $T_1=9.8$ N, $T_2=24.5$ N`],
      sol: R`**Directions** The strings don't stretch, so all three blocks share one size of acceleration: A and B toward the pulley, C down.

**(a)** A feels only $T_1$; B feels $T_2$ forward and $T_1$ back; C feels gravity down and $T_2$ up.

**(b)** Add the three equations: the tensions cancel, leaving $mg=(M_A+M_B+m)a$.

**(c)** $T_1=M_Aa$, and $T_2=(M_A+M_B)a$: each string pulls everything behind it.

**(d)** $a=\frac{49}{10}=4.9$ m/s², $T_1=2.0\times4.9$, $T_2=5.0\times4.9$. **Check** $mg-T_2=49-24.5=24.5=ma$.` },
    { tier: 'x', topic: 'A double slope', fig: 'p5-11',
      stem: R`Two blocks of equal mass $m$ sit on the two faces of a frictionless double slope, at $30^\circ$ and $60^\circ$ to the horizontal. A light string joins them over a light, frictionless pulley at the peak (Figure P5-11).`,
      parts: [R`Which way do the blocks move?`, R`Find the acceleration.`, R`Find the tension.`, R`What mass on the $30^\circ$ face would keep both blocks at rest?`],
      answer: [R`The block on the $60^\circ$ face slides down`, R`$a=\frac{\sqrt{3}-1}{4}g\approx1.8$ m/s²`, R`$T=\frac{\sqrt{3}+1}{4}mg$`, R`$\sqrt{3}\,m$`],
      sol: R`**Along each face** Gravity pulls each block down its face with $mg\sin\theta$: $\frac{\sqrt{3}}{2}mg$ on the steep face, $\frac{1}{2}mg$ on the other.

**(a)** The steep side pulls harder, so its block goes down and the other goes up.

**(b)** Take the direction of motion as positive and add the two equations, $mg\sin60^\circ-T=ma$ and $T-mg\sin30^\circ=ma$: $a=\frac{g(\sin60^\circ-\sin30^\circ)}{2}=\frac{(\sqrt{3}-1)g}{4}$.

**(c)** $T=m(g\sin30^\circ+a)=mg\left(\frac{1}{2}+\frac{\sqrt{3}-1}{4}\right)=\frac{\sqrt{3}+1}{4}mg$.

**(d)** Balance needs $m'g\sin30^\circ=mg\sin60^\circ$, so $m'=\sqrt{3}m$.` },
    { tier: 'x', topic: 'A pendulum in an accelerating car', fig: 'p5-12',
      stem: R`A small ball of mass $m$ hangs on a string from the ceiling of a car that accelerates forward at $a$. Seen from the road, the string hangs at a steady angle $\theta$ from the vertical (Figure P5-12).`,
      parts: [R`Write Newton's second law for the ball, horizontally and vertically.`, R`Find $\tan\theta$. Which way does the string lean?`, R`Find the tension.`,
        R`For $\theta=37^\circ$ and $m=0.20$ kg, find $a$ and $T$ (use $\tan37^\circ\approx0.75$, $\cos37^\circ\approx0.80$, $g=9.8$ m/s²).`],
      answer: [R`$T\sin\theta=ma$; $T\cos\theta-mg=0$`, R`$\tan\theta=\frac{a}{g}$; it leans backward`, R`$T=m\sqrt{g^2+a^2}$`, R`$a=7.35$ m/s², $T=2.45$ N`],
      sol: R`**(a)** The ball moves with the car, so it has the car's acceleration $a$ forward and none vertically. Only gravity and the tension act on it.

**(b)** Divide the two equations. The string's horizontal pull must point forward to speed the ball up, so the string slants back from the ceiling: this is how an accelerometer works.

**(c)** Square and add: $T^2=m^2(a^2+g^2)$.

**(d)** $a=g\tan37^\circ=0.75\times9.8$, and $T=\frac{mg}{\cos37^\circ}=\frac{1.96}{0.80}$.` },
    { tier: 'x', topic: 'A rope with mass',
      stem: R`A uniform rope of mass $1.0$ kg and length $2.0$ m pulls a $4.0$ kg block across a frictionless floor. A horizontal force of $15$ N acts on the front end of the rope.`,
      parts: [R`Find the acceleration.`, R`Find the tension where the rope meets the block.`, R`Find the tension at the middle of the rope.`,
        R`Find the tension at a distance $x$ from the front end. Why can we usually take the tension to be the same all along a string?`],
      answer: [R`$3.0$ m/s²`, R`$12$ N`, R`$13.5$ N`, R`$T=15-1.5x$ (N, with $x$ in m); with a massless string the change $1.5x$ vanishes`],
      sol: R`**(a)** Rope and block move together: $a=\frac{15}{5.0}$.

**(b)** That point pulls just the block: $T=4.0\times3.0$.

**(c)** It pulls the block and the back half of the rope, $0.50$ kg: $T=4.5\times3.0$.

**(d)** Behind the point lie the block and $0.50(2.0-x)$ kg of rope: $T=(4.0+1.0-0.50x)\times3.0$. The tension drops along the rope because each piece has to be accelerated too; as the rope's mass goes to zero, $T$ becomes the same everywhere.` },
  ],
  // ===================================================================================================================
  c6: [
    { tier: 'f', topic: 'Static or kinetic friction?',
      stem: R`A $10$ kg crate rests on a level floor, with $\mu_s=0.60$ and $\mu_k=0.40$. Take $g=9.8$ m/s².`,
      parts: [R`Find the largest static friction the floor can give.`, R`A worker pushes horizontally with $50$ N. Does the crate move? Find the friction.`,
        R`She pushes with $79.2$ N. Find the friction and the acceleration.`],
      answer: [R`$58.8$ N`, R`No; static friction of $50$ N`, R`It slides: $39.2$ N, and $a=4.0$ m/s²`],
      sol: R`**(a)** $\mu_sN=0.60\times98=58.8$ N.

**(b)** $50<58.8$, so static friction just matches the push. It is only as large as needed.

**(c)** $79.2>58.8$: it slides, and kinetic friction is $\mu_kN=39.2$ N. Then $a=\frac{79.2-39.2}{10}=4.0$ m/s².` },
    { tier: 'f', topic: 'Sliding to a stop',
      stem: R`A puck slides at $6.0$ m/s onto rough ice with $\mu_k=0.25$. Take $g=9.8$ m/s².`,
      parts: [R`Find its deceleration.`, R`How far does it slide?`, R`How long does it take to stop?`],
      answer: [R`$2.45$ m/s²`, R`$\frac{360}{49}\approx7.3$ m`, R`$\frac{120}{49}\approx2.4$ s`],
      sol: R`**(a)** Friction is the only horizontal force: $ma=\mu_kmg$, so $a=0.25\times9.8$. The mass cancels.

**(b)** $0=6.0^2-2(2.45)d$, so $d=\frac{36}{4.9}$.

**(c)** $t=\frac{6.0}{2.45}$.` },
    { tier: 'f', topic: 'When does a block start to slide?',
      stem: R`A block sits on a board that is slowly tilted. It starts to slide when the board reaches $37^\circ$, and once moving it slides with $\mu_k=0.50$. Use $\sin37^\circ\approx0.60$, $\cos37^\circ\approx0.80$.`,
      parts: [R`Find $\mu_s$.`, R`Find its acceleration as it slides down at $37^\circ$.`, R`For a $2.0$ kg block, find the friction force just before it starts to slide.`],
      answer: [R`$\mu_s=\tan37^\circ\approx0.75$`, R`$1.96$ m/s²`, R`$11.76\approx12$ N`],
      sol: R`**(a)** Just before slipping, friction is at its largest and balances gravity along the board: $\mu_smg\cos\theta=mg\sin\theta$.

**(b)** $a=g(\sin\theta-\mu_k\cos\theta)=9.8(0.60-0.40)$.

**(c)** $mg\sin37^\circ=19.6\times0.60$.` },
    { tier: 'f', topic: 'A ball on a string, in a horizontal circle',
      stem: R`A $0.50$ kg ball on a $1.0$ m string moves in a horizontal circle on a frictionless table at $4.0$ m/s.`,
      parts: [R`Find the tension.`, R`Find the period.`, R`The string breaks at $18$ N. Find the greatest speed.`],
      answer: [R`$8.0$ N`, R`$\frac{\pi}{2}\approx1.6$ s`, R`$6.0$ m/s`],
      sol: R`**(a)** The tension is the centripetal force: $T=\frac{mv^2}{r}=\frac{0.50\times16}{1.0}$.

**(b)** $\frac{2\pi r}{v}=\frac{2\pi}{4.0}$.

**(c)** $\frac{0.50v^2}{1.0}=18$ gives $v^2=36$.` },
    { tier: 'f', topic: 'Terminal speed',
      stem: R`A $49$ kg skydiver falls with a drag force $D=\frac{1}{2}C\rho Av^2$, where $\frac{1}{2}C\rho A=0.20$ kg/m. Take $g=9.8$ m/s².`,
      parts: [R`Find her terminal speed.`, R`At half that speed, find the drag and her acceleration.`, R`She pulls in her arms and legs, halving $A$. Find the new terminal speed.`],
      answer: [R`$49$ m/s`, R`About $120$ N, and $7.35$ m/s² ($\frac{3}{4}g$)`, R`$49\sqrt{2}\approx69$ m/s`],
      sol: R`**(a)** At terminal speed drag balances the weight: $0.20v_t^2=49\times9.8$, so $v_t^2=2401$.

**(b)** Drag goes as $v^2$, so at half the speed it is a quarter of the weight: $\frac{480.2}{4}\approx120$ N. Then $a=\frac{mg-D}{m}=\frac{3}{4}g$.

**(c)** $v_t=\sqrt{\frac{2mg}{C\rho A}}$, so halving $A$ multiplies $v_t$ by $\sqrt{2}$.` },
    { tier: 'a', topic: 'A crate on a rough ramp',
      stem: R`A $5.0$ kg crate is on a ramp at $37^\circ$, with $\mu_k=0.25$. A force parallel to the ramp moves it. Use $\sin37^\circ\approx0.60$, $\cos37^\circ\approx0.80$ and $g=9.8$ m/s².`,
      parts: [R`What force pushes it up the ramp at constant speed?`, R`With no push, the crate slides down. Find its acceleration.`,
        R`What force, pointing up the ramp, lets it slide down at constant speed?`],
      answer: [R`$39.2$ N`, R`$3.92$ m/s²`, R`$19.6$ N`],
      sol: R`**Forces** Along the ramp gravity gives $mg\sin37^\circ=29.4$ N down; kinetic friction is $\mu_kmg\cos37^\circ=9.8$ N, against the motion.

**(a)** Going up, friction points down the ramp too: $F=29.4+9.8$.

**(b)** Going down, friction points up: $a=\frac{29.4-9.8}{5.0}$.

**(c)** Balance down the ramp: $F+9.8=29.4$. The same speed, opposite motion, a different force: friction always opposes the sliding.` },
    { tier: 'a', topic: 'The Rotor',
      stem: R`In a fairground Rotor, riders stand against the wall of a cylinder of radius $4.0$ m. It spins up, and then the floor drops away. The coefficient of static friction between clothes and wall is $0.40$. Take $g=9.8$ m/s².`,
      parts: [R`What force pushes a rider toward the centre, and how big is it?`, R`Find the slowest speed at which riders don't slide down.`, R`Find the period at that speed.`, R`Does it depend on the rider's mass?`],
      answer: [R`The wall's normal force, $N=\frac{mv^2}{R}$`, R`$7\sqrt{2}\approx9.9$ m/s`, R`$\frac{4\sqrt{2}\,\pi}{7}\approx2.5$ s`, R`No`],
      sol: R`**(a)** The wall pushes inward; that push is the centripetal force.

**(b)** Friction holds the rider up and can be at most $\mu_sN$: $\mu_s\frac{mv^2}{R}\ge mg$, so $v^2\ge\frac{gR}{\mu_s}=\frac{9.8\times4.0}{0.40}=98$.

**(c)** $T=\frac{2\pi R}{v}=\frac{8\pi}{7\sqrt{2}}$.

**(d)** $m$ cancels in (b): one Rotor speed holds everyone.` },
    { tier: 'a', topic: 'A ball whirled in a vertical circle',
      stem: R`A $0.50$ kg ball on a $2.5$ m string is whirled in a vertical circle. Take $g=9.8$ m/s².`,
      parts: [R`At the top it moves at $7.0$ m/s. Find the tension.`, R`Find the slowest speed at the top for which the string stays taut.`, R`At the bottom it moves at $7\sqrt{3}$ m/s. Find the tension.`],
      answer: [R`$4.9$ N`, R`$\frac{7\sqrt{2}}{2}\approx4.9$ m/s`, R`$34.3$ N`],
      sol: R`**(a)** At the top both forces point down, toward the centre: $T+mg=\frac{mv^2}{R}$, so $T=0.50\left(\frac{49}{2.5}-9.8\right)=0.50\times9.8$.

**(b)** Slack means $T=0$: gravity alone supplies the centripetal force, $v^2=gR=24.5$.

**(c)** At the bottom the tension points up, toward the centre, and gravity down: $T=m\left(\frac{v^2}{R}+g\right)=0.50\left(\frac{147}{2.5}+9.8\right)=0.50\times68.6$.` },
    { tier: 'a', topic: 'Two stacked blocks',
      stem: R`A $1.0$ kg block sits on a $4.0$ kg block, which lies on a frictionless floor. The coefficient of static friction between the blocks is $0.40$. Take $g=9.8$ m/s².`,
      parts: [R`What is the largest horizontal force on the lower block for which the blocks move together?`, R`What is the largest horizontal force on the upper block for which they move together?`,
        R`A $10$ N force pulls the lower block. Find the friction force on the upper block.`],
      answer: [R`$19.6$ N`, R`$4.9$ N`, R`$2.0$ N, forward`],
      sol: R`**(a)** Only friction moves the upper block, so its acceleration is at most $\mu_sg=3.92$ m/s². Both blocks: $F=5.0\times3.92$.

**(b)** Now friction drags the lower block, at most $\mu_smg=3.92$ N: its acceleration is at most $\frac{3.92}{4.0}=0.98$ m/s², and $F=5.0\times0.98$.

**(c)** $a=\frac{10}{5.0}=2.0$ m/s², below the limit of (a), so they move together; the upper block needs $1.0\times2.0$ N, which static friction supplies.` },
    { tier: 'x', topic: 'Holding a block against a wall', fig: 'p6-10',
      stem: R`A $2.0$ kg block is held against a rough vertical wall ($\mu_s=0.50$) by a push $F$ at angle $\theta$ above the horizontal, into the wall (Figure P6-10). Take $g=9.8$ m/s².`,
      parts: [R`With a horizontal push ($\theta=0$), find the smallest $F$ that holds the block.`, R`At angle $\theta$, find the normal force and the smallest $F$ that holds the block.`,
        R`Evaluate that for $\theta=37^\circ$ ($\sin\approx0.60$, $\cos\approx0.80$).`, R`At $37^\circ$, what is the largest push before the block starts to slide up?`],
      answer: [R`$39.2$ N`, R`$N=F\cos\theta$; $F_\text{min}=\frac{mg}{\sin\theta+\mu_s\cos\theta}$`, R`$19.6$ N`, R`$98$ N`],
      sol: R`**(a)** $N=F$, and friction must hold the weight: $\mu_sF\ge mg$, so $F\ge\frac{19.6}{0.50}$.

**(b)** Horizontally $N=F\cos\theta$. Vertically the push helps: $F\sin\theta+f=mg$, with friction $f$ up and at most $\mu_sF\cos\theta$. So $F(\sin\theta+\mu_s\cos\theta)\ge mg$.

**(c)** $\frac{19.6}{0.60+0.40}=19.6$ N: half the horizontal push.

**(d)** Push hard and the block wants to rise; friction then points down: $F\sin\theta=mg+\mu_sF\cos\theta$, so $F=\frac{19.6}{0.60-0.40}$.` },
    { tier: 'x', topic: 'A banked curve with friction',
      stem: R`A curve of radius $40$ m is banked at $37^\circ$, and the coefficient of static friction between tires and road is $0.50$. Use $\sin37^\circ\approx0.60$, $\cos37^\circ\approx0.80$ and $g=9.8$ m/s².`,
      parts: [R`At what speed does the car need no friction?`, R`Find the greatest speed at which the car can take the curve.`, R`Find the smallest speed.`],
      answer: [R`$7\sqrt{6}\approx17$ m/s`, R`$28$ m/s`, R`$\frac{28}{\sqrt{11}}\approx8.4$ m/s`],
      sol: R`**(a)** With the normal force alone: $N\cos\theta=mg$ and $N\sin\theta=\frac{mv^2}{R}$, so $v^2=gR\tan\theta=9.8\times40\times0.75=294$.

**(b)** Faster, the car tends to slide outward and up, so friction points down the bank:
- vertical: $N\cos\theta-f\sin\theta=mg$
- toward the centre: $N\sin\theta+f\cos\theta=\frac{mv^2}{R}$

With $f=\mu_sN$: $v^2=gR\frac{\sin\theta+\mu_s\cos\theta}{\cos\theta-\mu_s\sin\theta}=gR\frac{1.0}{0.50}=784$.

**(c)** Slower, friction points up the bank: $v^2=gR\frac{\sin\theta-\mu_s\cos\theta}{\cos\theta+\mu_s\sin\theta}=gR\frac{0.20}{1.10}=\frac{784}{11}$.` },
    { tier: 'x', topic: 'A rough table and a hanging block',
      stem: R`A $4.0$ kg block on a rough table ($\mu_s=0.50$, $\mu_k=0.25$) is tied by a light string over a light, frictionless pulley at the edge to a hanging block of mass $m$. Take $g=9.8$ m/s².`,
      parts: [R`What is the smallest $m$ that starts the blocks moving?`, R`With $m=3.0$ kg, find the acceleration.`, R`Find the tension.`, R`With $m=1.5$ kg, find the friction force on the table block.`],
      answer: [R`$2.0$ kg`, R`$2.8$ m/s²`, R`$21$ N`, R`$14.7$ N (static friction; nothing moves)`],
      sol: R`**(a)** At rest the tension is $mg$, and static friction can hold up to $\mu_sMg$: motion starts once $m>\mu_sM=2.0$ kg.

**(b)** The table block ($M=4.0$ kg) slides against kinetic friction $f_k=0.25\times4.0\times9.8=9.8$ N: $T-f_k=Ma$. Hanging block: $mg-T=ma$. Add them: $a=\frac{mg-f_k}{M+m}=\frac{29.4-9.8}{7.0}$.

**(c)** $T=m(g-a)=3.0\times7.0$.

**(d)** $1.5<2.0$, so nothing moves and friction just balances the tension: $1.5\times9.8$.` },
    { tier: 'x', topic: 'The best angle to pull a sled',
      stem: R`A $10$ kg sled is pulled at constant velocity across snow ($\mu_k=0.75$) by a rope at angle $\theta$ above the horizontal. Take $g=9.8$ m/s².`,
      parts: [R`Find the pull $F$ as a function of $\theta$.`, R`For which angle is $F$ smallest?`, R`Find that smallest pull, and compare it with a horizontal pull.`],
      answer: [R`$F=\frac{\mu_kmg}{\cos\theta+\mu_k\sin\theta}$`, R`$\tan\theta=\mu_k$: $\theta\approx37^\circ$`, R`$58.8$ N, against $73.5$ N horizontally`],
      sol: R`**(a)** Vertically $N=mg-F\sin\theta$. Horizontally $F\cos\theta=\mu_kN=\mu_k(mg-F\sin\theta)$. Solve for $F$.

**(b)** $F$ is smallest where $\cos\theta+\mu_k\sin\theta$ is largest: its derivative $-\sin\theta+\mu_k\cos\theta$ is zero when $\tan\theta=\mu_k=0.75$.

**(c)** With $\cos\theta=0.80$ and $\sin\theta=0.60$: $F=\frac{0.75\times98}{0.80+0.45}=\frac{73.5}{1.25}$. Pulling a little upward lifts some weight off the snow and cuts the friction.` },
  ],
  // ===================================================================================================================
  c7: [
    { tier: 'f', topic: 'Kinetic energy',
      parts: [R`Find the kinetic energy of a $1500$ kg car at $20$ m/s.`, R`Find it at $40$ m/s.`, R`A $0.10$ kg ball has $5.0$ J of kinetic energy. How fast is it moving?`],
      answer: [R`$3.0\times10^{5}$ J`, R`$1.2\times10^{6}$ J, four times as much`, R`$10$ m/s`],
      sol: R`**(a)** $K=\frac{1}{2}mv^2=\frac{1}{2}(1500)(400)$.

**(b)** Kinetic energy goes as $v^2$: twice the speed, four times the energy, and four times the braking distance.

**(c)** $v=\sqrt{\frac{2K}{m}}=\sqrt{\frac{10}{0.10}}$.` },
    { tier: 'f', topic: 'Work by a force at an angle',
      stem: R`A suitcase is pulled $20$ m along a level floor by a $50$ N force at $60^\circ$ above the horizontal.`,
      parts: [R`Find the work done by the pull.`, R`Find the work done by gravity and by the normal force.`, R`A friction force of $15$ N also acts. Find its work and the net work.`],
      answer: [R`$500$ J`, R`$0$ and $0$`, R`$-300$ J; net work $200$ J`],
      sol: R`**(a)** $W=Fd\cos\phi=50\times20\times\cos60^\circ$.

**(b)** Both are perpendicular to the motion, so $\cos90^\circ=0$.

**(c)** Friction points against the motion, $\phi=180^\circ$: $-15\times20$. Net: $500-300$, which is the suitcase's gain in kinetic energy.` },
    { tier: 'f', topic: 'Lifting and lowering',
      stem: R`A $3.0$ kg box is lifted $2.0$ m at constant speed, then lowered back at constant speed. Take $g=9.8$ m/s².`,
      parts: [R`Find the work done by the hand while lifting.`, R`Find the work done by gravity while lifting.`, R`Find the work done by the hand and by gravity while lowering.`,
        R`Find the total work done by gravity over the round trip.`],
      answer: [R`$+58.8$ J`, R`$-58.8$ J`, R`Hand $-58.8$ J; gravity $+58.8$ J`, R`$0$`],
      sol: R`**(a)** At constant speed the hand's force equals the weight, $29.4$ N, along the motion: $29.4\times2.0$.

**(b)** Gravity points opposite to the motion.

**(c)** Now the motion is down: the hand's upward force does negative work and gravity positive.

**(d)** $-58.8+58.8=0$: gravity's work depends only on the change in height.` },
    { tier: 'f', topic: 'Work by a spring',
      stem: R`A spring has a spring constant of $200$ N/m.`,
      parts: [R`Find the force it exerts when stretched $0.10$ m.`, R`Find the work done by a hand that slowly stretches it from $0$ to $0.10$ m.`,
        R`Find the work done by the hand stretching it further, from $0.10$ m to $0.20$ m.`, R`Find the work done by the spring in (c).`],
      answer: [R`$20$ N`, R`$1.0$ J`, R`$3.0$ J`, R`$-3.0$ J`],
      sol: R`**(a)** $|F|=kx=200\times0.10$.

**(b)** $W=\frac{1}{2}kx^2=\frac{1}{2}(200)(0.01)$: the area of the triangle under the force–stretch line.

**(c)** $\frac{1}{2}k(x_f^2-x_i^2)=100(0.04-0.01)$. The second $10$ cm takes three times the work of the first.

**(d)** The spring pulls back against the stretch: the opposite of the hand's work.` },
    { tier: 'f', topic: 'Climbing stairs',
      stem: R`A $50$ kg student climbs stairs $6.0$ m high in $12$ s. Take $g=9.8$ m/s².`,
      parts: [R`Find the work done against gravity.`, R`Find the average power.`, R`Find the average power if she runs up in $6.0$ s.`],
      answer: [R`$2940$ J ($\approx2.9$ kJ)`, R`$245$ W`, R`$490$ W`],
      sol: R`**(a)** $mgh=50\times9.8\times6.0$.

**(b)** $P_\text{avg}=\frac{W}{\Delta t}=\frac{2940}{12}$.

**(c)** The same work in half the time takes twice the power.` },
    { tier: 'a', topic: 'Work and kinetic energy with friction',
      stem: R`A $2.0$ kg block starts from rest on a rough floor ($\mu_k=0.25$) and is pushed by a horizontal $9.8$ N force for $10$ m. Take $g=9.8$ m/s².`,
      parts: [R`Find the work done by the push.`, R`Find the work done by friction.`, R`Find the block's speed after $10$ m.`, R`Then the push stops. How much farther does the block slide?`],
      answer: [R`$98$ J`, R`$-49$ J`, R`$7.0$ m/s`, R`$10$ m`],
      sol: R`**(a)** $9.8\times10$.

**(b)** $f_k=\mu_kmg=4.9$ N against the motion: $-4.9\times10$.

**(c)** $K=98-49=49$ J, so $v=\sqrt{\frac{2\times49}{2.0}}$.

**(d)** Friction alone now removes the $49$ J: $4.9d=49$.` },
    { tier: 'a', topic: 'Work from an F–x graph', fig: 'p7-7',
      stem: R`Figure P7-7 shows the force $F(x)$ along the $x$-axis on a $4.0$ kg block that starts from rest at $x=0$ on a frictionless floor.`,
      parts: [R`Find the work done from $x=0$ to $x=6$ m.`, R`Find the block's speed at $x=6$ m.`, R`Find its speed at $x=2.0$ m.`],
      answer: [R`$50$ J`, R`$5.0$ m/s`, R`$\sqrt{10}\approx3.2$ m/s`],
      sol: R`**(a)** Work is the area under the graph: a rectangle and a triangle, $4(10)+\frac{1}{2}(2)(10)=40+10$.

**(b)** All of it becomes kinetic energy: $\frac{1}{2}(4.0)v^2=50$.

**(c)** The first $2.0$ m of the rectangle: $20$ J, so $v^2=10$. The block keeps speeding up until $x=6$ m, even while the force shrinks.` },
    { tier: 'a', topic: 'A block runs into a spring',
      stem: R`A $0.50$ kg block slides at $2.0$ m/s on a frictionless floor into a spring with $k=200$ N/m.`,
      parts: [R`Find the greatest compression.`, R`Find the block's speed when the compression is $0.06$ m.`, R`Find the work done by the spring from first contact to the greatest compression.`],
      answer: [R`$0.10$ m`, R`$1.6$ m/s`, R`$-1.0$ J`],
      sol: R`**(a)** The spring's work takes away all $1.0$ J of kinetic energy: $\frac{1}{2}(200)x^2=1.0$, so $x^2=0.01$.

**(b)** $\frac{1}{2}mv^2=1.0-\frac{1}{2}(200)(0.06)^2=1.0-0.36=0.64$ J, so $v^2=2.56$.

**(c)** $W_s=-\frac{1}{2}kx^2=-1.0$ J, equal to the change in kinetic energy.` },
    { tier: 'a', topic: 'Power on a slope',
      stem: R`A $1000$ kg car climbs a slope with $\sin\theta=0.10$ at a steady $20$ m/s, against $500$ N of air drag and rolling resistance. Take $g=9.8$ m/s².`,
      parts: [R`Find the driving force from the road.`, R`Find the power delivered.`, R`Find the power needed at the same speed on a level road.`],
      answer: [R`$1480$ N`, R`$29.6$ kW ($\approx3.0\times10^4$ W)`, R`$10$ kW`],
      sol: R`**(a)** At steady speed the forces along the slope balance: $F=mg\sin\theta+500=980+500$.

**(b)** $P=Fv=1480\times20$.

**(c)** Only the $500$ N remains: $500\times20$.` },
    { tier: 'x', topic: 'Work by a variable force',
      stem: R`A force $F(x)=12-3x^2$ (in N, with $x$ in m) acts along the $x$-axis on a $2.0$ kg object that starts from rest at $x=0$. No other force does work.`,
      parts: [R`Find the work done from $x=0$ to $x=1$ m, and the speed there.`, R`Where is the object fastest, and how fast is it going?`, R`Where does it come to rest again?`,
        R`Find the power delivered by the force at $x=1$ m.`],
      answer: [R`$11$ J; $\sqrt{11}\approx3.3$ m/s`, R`At $x=2.0$ m, at $4.0$ m/s`, R`At $x=2\sqrt{3}\approx3.5$ m`, R`$9\sqrt{11}\approx30$ W`],
      sol: R`**Work** $W(x)=\int_0^x(12-3x'^2)\,dx'=12x-x^3$.

**(a)** $W(1)=11$ J $=\frac{1}{2}(2.0)v^2$.

**(b)** The speed grows while $F>0$ and falls once $F<0$, so it is greatest where $F=0$: $x=2$ m. $W(2)=24-8=16$ J, so $v^2=16$.

**(c)** $W(x)=0$ again: $x(12-x^2)=0$, so $x=\sqrt{12}$.

**(d)** $P=Fv=(12-3)\sqrt{11}$.` },
    { tier: 'x', topic: 'Work along a path in a plane',
      stem: R`A force $\vec{F}=2x\,\hat{i}+3\,\hat{j}$ (in N, with $x$ in m) acts on a $0.50$ kg particle as it moves from $(1,2)$ m to $(3,-1)$ m. Its speed at the start is $4.0$ m/s, and no other force does work.`,
      parts: [R`Find the work done by the force.`, R`Find the speed at the end.`, R`Would the work be different along another path between the same points?`],
      answer: [R`$-1.0$ J`, R`$2\sqrt{3}\approx3.5$ m/s`, R`No`],
      sol: R`**(a)** $W=\int_1^32x\,dx+\int_2^{-1}3\,dy=(9-1)+3(-1-2)=8-9$.

**(b)** $K_f=\frac{1}{2}(0.50)(16)-1.0=3.0$ J, so $v^2=\frac{2\times3.0}{0.50}=12$.

**(c)** Each component depends only on its own coordinate, so the two integrals depend only on the end points.` },
    { tier: 'x', topic: 'A winch on a rough ramp',
      stem: R`A winch pulls a $50$ kg crate up a ramp at $37^\circ$ at a steady $0.50$ m/s, with the rope parallel to the ramp. The coefficient of kinetic friction is $0.25$. Use $\sin37^\circ\approx0.60$, $\cos37^\circ\approx0.80$ and $g=9.8$ m/s².`,
      parts: [R`Find the tension in the rope.`, R`Find the power the winch delivers.`, R`In $10$ s, find the work done by the rope, the gain in gravitational potential energy and the thermal energy produced.`],
      answer: [R`$392$ N`, R`$196$ W`, R`$1960$ J, $1470$ J and $490$ J`],
      sol: R`**(a)** Steady speed: $T=mg\sin37^\circ+\mu_kmg\cos37^\circ=294+98$.

**(b)** $P=Tv=392\times0.50$.

**(c)** The crate moves $5.0$ m, rising $5.0\sin37^\circ=3.0$ m. Rope: $392\times5.0$. Potential energy: $50\times9.8\times3.0$. Friction: $98\times5.0$. **Check** $1470+490=1960$: the kinetic energy doesn't change.` },
    { tier: 'x', topic: 'A car with constant power',
      stem: R`An $800$ kg car starts from rest, and its engine delivers a constant power of $36$ kW. Ignore friction and air.`,
      parts: [R`Use the work–kinetic energy theorem to find $v(t)$.`, R`Find the speed after $10$ s.`, R`How far does the car go in those $10$ s?`, R`Find its acceleration at $t=10$ s.`],
      answer: [R`$v=\sqrt{\frac{2Pt}{m}}=\sqrt{90t}$ (m/s)`, R`$30$ m/s`, R`$200$ m`, R`$1.5$ m/s²`],
      sol: R`**(a)** Constant power means the work done by time $t$ is $Pt$, and all of it becomes kinetic energy: $Pt=\frac{1}{2}mv^2$. Here $\frac{2P}{m}=90$.

**(b)** $\sqrt{900}$.

**(c)** $x=\int_0^{10}\sqrt{90t}\,dt=\sqrt{90}\cdot\frac{2}{3}t^{3/2}\Big|_0^{10}=\frac{2}{3}\sqrt{90}\cdot10\sqrt{10}=\frac{2}{3}\cdot30\cdot10$.

**(d)** $P=Fv$, so $F=\frac{36\,000}{30}=1200$ N and $a=\frac{1200}{800}$. The acceleration falls as the car speeds up.` },
  ],
  // ===================================================================================================================
  c8: [
    { tier: 'f', topic: 'Gravitational potential energy',
      stem: R`A $0.50$ kg ball falls from rest from a balcony $10$ m above the ground. Take $g=9.8$ m/s² and ignore air.`,
      parts: [R`Find the change in its gravitational potential energy from the balcony to the ground.`, R`Find its speed at the ground.`,
        R`Find its potential energy at the balcony with $U=0$ at the ground, and with $U=0$ at the balcony.`],
      answer: [R`$-49$ J`, R`$14$ m/s`, R`$49$ J and $0$; the change is the same either way`],
      sol: R`**(a)** $\Delta U=mg\,\Delta y=0.50\times9.8\times(-10)$.

**(b)** The $49$ J lost becomes kinetic energy: $\frac{1}{2}(0.50)v^2=49$, so $v^2=196$.

**(c)** Only changes in $U$ matter, so we may choose where $U=0$.` },
    { tier: 'f', topic: 'Elastic potential energy',
      stem: R`A spring with $k=500$ N/m is compressed by $4.0$ cm.`,
      parts: [R`Find the stored energy.`, R`It launches a $0.20$ kg ball along a level, frictionless track. Find the ball's speed.`, R`Find the speed if the spring were compressed twice as far.`],
      answer: [R`$0.40$ J`, R`$2.0$ m/s`, R`$4.0$ m/s`],
      sol: R`**(a)** $U=\frac{1}{2}kx^2=\frac{1}{2}(500)(0.040)^2$.

**(b)** $\frac{1}{2}(0.20)v^2=0.40$, so $v^2=4$.

**(c)** Twice the compression stores four times the energy, which gives twice the speed: $v\propto x$.` },
    { tier: 'f', topic: 'Down a frictionless slide',
      stem: R`A child slides from rest down a frictionless slide whose top is $10$ m above the bottom. Take $g=9.8$ m/s².`,
      parts: [R`Find the speed at the bottom.`, R`Find the speed $2.5$ m above the bottom.`, R`Does the shape of the slide matter?`],
      answer: [R`$14$ m/s`, R`$7\sqrt{3}\approx12$ m/s`, R`No: only the drop in height does`],
      sol: R`**(a)** $\frac{1}{2}mv^2=mgh$, so $v^2=2(9.8)(10)=196$.

**(b)** It has dropped $7.5$ m: $v^2=2(9.8)(7.5)=147=49\times3$.

**(c)** The normal force does no work, so the energy depends only on the height. The shape changes how long it takes, not the speed.` },
    { tier: 'f', topic: 'Force and equilibrium from U(x)',
      stem: R`A particle moves along the $x$-axis with potential energy $U(x)=3x^2-2x^3$ (in J, with $x$ in m).`,
      parts: [R`Find the force $F(x)$.`, R`Find the equilibrium points.`, R`Is each one stable or unstable?`],
      answer: [R`$F=-6x+6x^2$`, R`$x=0$ and $x=1$ m`, R`$x=0$ stable (a minimum of $U$); $x=1$ m unstable (a maximum)`],
      sol: R`**(a)** $F=-\frac{dU}{dx}=-(6x-6x^2)$.

**(b)** $F=0$: $6x(x-1)=0$.

**(c)** $\frac{d^2U}{dx^2}=6-12x$ is $+6$ at $x=0$ (a valley) and $-6$ at $x=1$ (a hilltop). Pushed slightly away from a valley, the force pulls the particle back.` },
    { tier: 'f', topic: 'Friction makes thermal energy',
      stem: R`A block slides $4.0$ m across a rough floor, where the kinetic friction force is $5.0$ N. It started with $30$ J of kinetic energy, and no other horizontal force acts.`,
      parts: [R`Find the thermal energy produced.`, R`Find the kinetic energy at the end.`, R`How much farther does the block slide before it stops?`],
      answer: [R`$20$ J`, R`$10$ J`, R`$2.0$ m`],
      sol: R`**(a)** $\Delta E_\text{th}=f_kd=5.0\times4.0$.

**(b)** $30-20$: the energy isn't lost, it warms the block and the floor.

**(c)** $5.0\,d=10$.` },
    { tier: 'a', topic: 'A spring launcher and a ramp',
      stem: R`A spring ($k=490$ N/m) compressed by $0.20$ m launches a $0.20$ kg ball along a frictionless floor and up a frictionless ramp. Take $g=9.8$ m/s².`,
      parts: [R`Find the energy stored in the spring.`, R`Find the ball's speed as it leaves the spring.`, R`How high up the ramp does it go?`],
      answer: [R`$9.8$ J`, R`$7\sqrt{2}\approx9.9$ m/s`, R`$5.0$ m`],
      sol: R`**(a)** $\frac{1}{2}(490)(0.04)$.

**(b)** $\frac{1}{2}(0.20)v^2=9.8$, so $v^2=98$.

**(c)** At the top all of it is gravitational: $0.20\times9.8\times h=9.8$.` },
    { tier: 'a', topic: 'A pendulum released at 60°',
      stem: R`A $0.30$ kg bob on a $2.5$ m string is released from rest with the string at $60^\circ$ from the vertical. Take $g=9.8$ m/s².`,
      parts: [R`How far does the bob drop to the lowest point?`, R`Find its speed at the lowest point.`, R`Find the tension at the lowest point.`],
      answer: [R`$1.25$ m`, R`$\frac{7\sqrt{2}}{2}\approx4.9$ m/s`, R`$2mg=5.88$ N`],
      sol: R`**(a)** $L-L\cos60^\circ=\frac{L}{2}$.

**(b)** $v^2=2gh=2(9.8)(1.25)=24.5$. The tension does no work: it is always perpendicular to the motion.

**(c)** At the bottom $T-mg=\frac{mv^2}{L}=\frac{m(gL)}{L}=mg$, so $T=2mg$.` },
    { tier: 'a', topic: 'Sliding down a rough slope',
      stem: R`A $2.0$ kg block slides from rest down a slope at $37^\circ$, starting $7.5$ m above the bottom ($12.5$ m along the slope). The coefficient of kinetic friction is $0.25$. Use $\cos37^\circ\approx0.80$ and $g=9.8$ m/s².`,
      parts: [R`Find the work done by gravity.`, R`Find the thermal energy produced.`, R`Find the speed at the bottom.`],
      answer: [R`$147$ J`, R`$49$ J`, R`$7\sqrt{2}\approx9.9$ m/s`],
      sol: R`**(a)** $mgh=2.0\times9.8\times7.5$.

**(b)** $f_k=\mu_kmg\cos37^\circ=0.25\times19.6\times0.80=3.92$ N, over $12.5$ m.

**(c)** $\frac{1}{2}(2.0)v^2=147-49=98$, so $v^2=98$.` },
    { tier: 'a', topic: 'Reading a potential-energy curve', fig: 'p8-9',
      stem: R`Figure P8-9 shows $U(x)$ for a $2.0$ kg particle moving along the $x$-axis. Its mechanical energy is $4.0$ J.`,
      parts: [R`Find the turning points.`, R`Find the greatest speed, and where the particle has it.`, R`Find the force on the particle at $x=1$ m, $3$ m and $5$ m.`],
      answer: [R`$x=\frac{2}{3}$ m and $x=5.0$ m`, R`$2.0$ m/s, anywhere from $x=2$ to $4$ m`, R`$+3.0$ N, $0$ and $-4.0$ N`],
      sol: R`**(a)** Turning points are where $U=E$. On the first slope $U=6-3x=4$ gives $x=\frac{2}{3}$; on the last one $U=4(x-4)=4$ gives $x=5$.

**(b)** $K=E-U$ is largest where $U=0$: $\frac{1}{2}(2.0)v^2=4.0$.

**(c)** $F=-\frac{dU}{dx}$: the slope there is $-3$, then $0$, then $+4$. The force always points downhill on the curve.` },
    { tier: 'x', topic: 'A bungee jump',
      stem: R`A $50$ kg jumper steps off a bridge on a bungee cord of unstretched length $15$ m and spring constant $245$ N/m. Ignore air, treat the cord as a spring once it is taut, and take $g=9.8$ m/s².`,
      parts: [R`Write the energy equation for the lowest point, with $x$ the cord's stretch there.`, R`Find the greatest stretch, and how far below the bridge the jumper goes.`,
        R`Where is the jumper fastest?`, R`Find the greatest speed.`],
      answer: [R`$mg(15+x)=\frac{1}{2}kx^2$`, R`$10$ m; $25$ m below the bridge`, R`At a stretch of $2.0$ m, $17$ m below the bridge`, R`$5.6\sqrt{10}\approx18$ m/s`],
      sol: R`**(a)** At the top and at the bottom the jumper is at rest: the drop in gravitational energy all goes into the cord.

**(b)** $490(15+x)=122.5x^2$. Divide by $122.5$: $x^2-4x-60=0$, so $(x-10)(x+6)=0$.

**(c)** She speeds up while gravity beats the cord: fastest where $kx=mg$, so $x=\frac{490}{245}$.

**(d)** $\frac{1}{2}(50)v^2=490\times17-\frac{1}{2}(245)(4)=8330-490=7840$, so $v^2=313.6$ and $v=\sqrt{313.6}=5.6\sqrt{10}$.` },
    { tier: 'x', topic: 'Tension around a vertical circle',
      stem: R`A ball of mass $m$ on a string of length $L=2.0$ m moves in a vertical circle. Its speed at the bottom is $v_b$. Let $\theta$ be the angle of the string from the downward vertical. Take $g=9.8$ m/s².`,
      parts: [R`Find $v^2$ at angle $\theta$.`, R`Find the tension $T(\theta)$.`, R`Find the smallest $v_b$ for which the string stays taut at the top.`,
        R`With that $v_b$, find the tension at the bottom and at $\theta=90^\circ$.`],
      answer: [R`$v^2=v_b^2-2gL(1-\cos\theta)$`, R`$T=\frac{mv_b^2}{L}-2mg+3mg\cos\theta$`, R`$v_b=\sqrt{5gL}=7\sqrt{2}\approx9.9$ m/s`, R`$6mg$ and $3mg$`],
      sol: R`**(a)** At angle $\theta$ the ball is $L(1-\cos\theta)$ above the bottom; the tension does no work.

**(b)** Toward the centre: $T-mg\cos\theta=\frac{mv^2}{L}$. Put in (a): $T=\frac{mv_b^2}{L}-2mg(1-\cos\theta)+mg\cos\theta$.

**(c)** At the top, $\theta=180^\circ$: $T=\frac{mv_b^2}{L}-5mg\ge0$, so $v_b^2\ge5gL=98$.

**(d)** $\frac{mv_b^2}{L}=5mg$: at the bottom $T=5mg-2mg+3mg$; at the side $T=5mg-2mg$.` },
    { tier: 'x', topic: 'A roller coaster with friction',
      stem: R`A $500$ kg roller-coaster car starts from rest at A, $20$ m above the bottom of a dip at B. The track from A to B is $50$ m long. Take $g=9.8$ m/s².`,
      parts: [R`Find the speed at B if there were no friction.`, R`The measured speed at B is $14$ m/s. How much mechanical energy was lost?`, R`Find the average friction force along the track.`,
        R`After B the track climbs a hill. Can the car reach a point $12$ m above B?`],
      answer: [R`$14\sqrt{2}\approx20$ m/s`, R`$4.9\times10^{4}$ J`, R`$980$ N`, R`No`],
      sol: R`**(a)** $v^2=2gh=2(9.8)(20)=392=2\times14^2$.

**(b)** At A: $mgh=500\times9.8\times20=98\,000$ J. At B: $\frac{1}{2}mv^2=\frac{1}{2}(500)(196)=49\,000$ J. Half the energy went into heat.

**(c)** The thermal energy is $\bar{f}d$: $\bar{f}=\frac{49\,000}{50}$.

**(d)** Climbing $12$ m needs $mg\times12=58\,800$ J of kinetic energy at B, and the car has only $49\,000$ J, before any more friction.` },
    { tier: 'x', topic: 'A potential with a minimum',
      stem: R`A particle moves along the $x$-axis ($x>0$) with potential energy $U(x)=\frac{A}{x^2}-\frac{B}{x}$, where $A$ and $B$ are positive constants.`,
      parts: [R`Find the force $F(x)$.`, R`Find the equilibrium position.`, R`Is it stable?`, R`Find $U$ there, and the energy needed to free a particle resting there (to move it far away).`],
      answer: [R`$F=\frac{2A}{x^3}-\frac{B}{x^2}$`, R`$x_0=\frac{2A}{B}$`, R`Yes: $U$ has a minimum there`, R`$U(x_0)=-\frac{B^2}{4A}$; it needs $\frac{B^2}{4A}$`],
      sol: R`**(a)** $F=-\frac{dU}{dx}=-\left(-\frac{2A}{x^3}+\frac{B}{x^2}\right)$.

**(b)** $F=0$: $\frac{2A}{x^3}=\frac{B}{x^2}$.

**(c)** For $x<x_0$ the force is positive (outward) and for $x>x_0$ negative (inward): it always pushes back toward $x_0$.

**(d)** $U(x_0)=\frac{AB^2}{4A^2}-\frac{B^2}{2A}=-\frac{B^2}{4A}$. Far away $U\to0$, so it takes $\frac{B^2}{4A}$, the depth of the well. This is the shape of the energy between two atoms in a molecule.` },
    { tier: 'x', topic: 'Down a slope into a spring', fig: 'p8-14',
      stem: R`A $2.0$ kg block slides from rest down a frictionless slope at $30^\circ$. After $1.8$ m it meets a spring with $k=980$ N/m lying along the slope (Figure P8-14). Take $g=9.8$ m/s².`,
      parts: [R`Find the block's speed just before it reaches the spring.`, R`Find the greatest compression.`, R`Where is the block's speed greatest?`, R`Does the block come back to where it started?`],
      answer: [R`$4.2$ m/s`, R`$0.20$ m`, R`After $1.0$ cm of compression, where $kx=mg\sin30^\circ$`, R`Yes: with no friction the energy is all returned`],
      sol: R`**(a)** It drops $1.8\sin30^\circ=0.90$ m: $v^2=2(9.8)(0.90)=17.64$.

**(b)** From the start to the lowest point, with compression $x$: $mg(1.8+x)\sin30^\circ=\frac{1}{2}kx^2$, so $9.8(1.8+x)=490x^2$. With $x=0.20$: both sides are $19.6$.

**(c)** Gravity along the slope, $9.8$ N, keeps speeding the block up until the spring pushes back as hard: $980x=9.8$.

**(d)** The spring gives back the energy it stored, and the block climbs back to its starting height.` },
  ],
};
