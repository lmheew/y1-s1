// The mock midterms in the Exams tab: the real paper has six questions in 60 minutes, and these follow the kinds of
// problems the two exercise days set (a warm-up, vector products, motion along a line, a projectile, friction on a
// slope or a pulley, circular motion and energy), with new set-ups and numbers. Never copied from the class sheets.
//
// A mock: id (the key for saved ticks), seg (the switcher label), title, minutes and qs, six problems. A problem: no,
// topic, stem, fig, parts (labelled "no-1", "no-2" …), pts (one per part; the paper gives no points, so these are
// estimates: 10 per problem), answer (one per part) and sol (one step per block). Checked in verify_mocks.py.
const R = String.raw;
export const MOCKS_ADDED = '2026-11-03';
const G = R`Take $g=9.8$ m/s² and ignore air.`;
const T37 = R`Use $\sin37^\circ\approx0.60$ and $\cos37^\circ\approx0.80$.`;

export const mocks = [
  // ===================================================================================================================
  { id: 'pm1', seg: 'Mock 1', title: 'Mock midterm 1', minutes: 60, qs: [
    { no: '1', topic: 'Warm-up · Ch. 1–3', pts: [2, 2, 2, 2, 2],
      parts: [R`A particle's position vector is $\vec{r}(t)$. Write its velocity in mathematical form.`, R`$3.40\times0.0250$: give the result with the right number of significant figures.`,
        R`$12.6+0.347$: give the result with the right number of significant figures.`, R`A particle's position is $x=5-4t+3t^3$. Find its velocity and acceleration.`,
        R`Find the unit vector of $\vec{A}=2\hat{i}-\hat{j}+2\hat{k}$.`],
      answer: [R`$\vec{v}=\frac{d\vec{r}}{dt}=\frac{dx}{dt}\hat{i}+\frac{dy}{dt}\hat{j}+\frac{dz}{dt}\hat{k}$`, R`$0.0850$`, R`$12.9$`,
        R`$v=-4+9t^2$, $a=18t$`, R`$\hat{A}=\frac{1}{3}(2\hat{i}-\hat{j}+2\hat{k})$`],
      sol: R`**1-1** The derivative of the position vector, component by component. It is tangent to the path.

**1-2** $0.085$ exactly, but both factors have three significant figures, so write $0.0850$.

**1-3** $12.947$; $12.6$ is known only to one decimal place, so $12.9$.

**1-4** $v=\frac{dx}{dt}=-4+9t^2$ and $a=\frac{dv}{dt}=18t$.

**1-5** $|\vec{A}|=\sqrt{4+1+4}=3$; divide each component by $3$.` },
    { no: '2', topic: 'Vector products, magnetic force · Ch. 3', pts: [2, 3, 2, 2, 1],
      stem: R`Two vectors are $\vec{A}=2\hat{i}-\hat{j}+3\hat{k}$ and $\vec{B}=\hat{i}+4\hat{j}-2\hat{k}$.`,
      parts: [R`Find $\vec{A}\cdot\vec{B}$.`, R`Find $\vec{A}\times\vec{B}$.`, R`Find $\cos\phi$, where $\phi$ is the angle between $\vec{A}$ and $\vec{B}$.`,
        R`A particle of charge $q$ moves with velocity $\vec{v}=\vec{A}$ through a magnetic field $\vec{B}$ (in suitable units), and feels the force $\vec{F}=q\,\vec{v}\times\vec{B}$. Find $\vec{F}$ and $|\vec{F}|$.`,
        R`Show that $\vec{F}$ is perpendicular to $\vec{v}$.`],
      answer: [R`$-8$`, R`$-10\hat{i}+7\hat{j}+9\hat{k}$`, R`$\cos\phi=-\frac{8}{7\sqrt{6}}\approx-0.47$`, R`$\vec{F}=q(-10\hat{i}+7\hat{j}+9\hat{k})$, $|\vec{F}|=\sqrt{230}\,q$`,
        R`$\vec{F}\cdot\vec{v}=q(-20-7+27)=0$`],
      sol: R`**2-1** $(2)(1)+(-1)(4)+(3)(-2)=2-4-6$.

**2-2** Component by component:
- $\hat{i}$: $A_yB_z-A_zB_y=(-1)(-2)-(3)(4)=-10$
- $\hat{j}$: $A_zB_x-A_xB_z=(3)(1)-(2)(-2)=7$
- $\hat{k}$: $A_xB_y-A_yB_x=(2)(4)-(-1)(1)=9$

**2-3** $|\vec{A}|=\sqrt{14}$ and $|\vec{B}|=\sqrt{21}$, so $\cos\phi=\frac{-8}{\sqrt{294}}=\frac{-8}{7\sqrt{6}}$: an obtuse angle.

**2-4** $\vec{F}=q(\vec{A}\times\vec{B})$, with size $q\sqrt{100+49+81}$.

**2-5** A cross product is perpendicular to both of its vectors: $(2)(-10)+(-1)(7)+(3)(9)=0$. So the magnetic force does no work.` },
    { no: '3', topic: 'From velocity to position · Ch. 2', pts: [2, 2, 3, 2, 1],
      stem: R`An object moves along the $x$-axis with velocity $v(t)=6-2t$ (in m/s, with $t$ in s), and $x=0$ at $t=0$.`,
      parts: [R`Find $a(t)$ and $x(t)$.`, R`When and where does the object turn around?`, R`Find the displacement and the distance travelled from $t=0$ to $t=5.0$ s.`,
        R`Find the average velocity and the average speed over the same interval.`, R`Check $v(5)$ with $v^2=v_0^2+2a(x-x_0)$.`],
      answer: [R`$a=-2$ m/s²; $x=6t-t^2$`, R`At $t=3.0$ s, at $x=9.0$ m`, R`Displacement $5.0$ m; distance $13$ m`, R`$1.0$ m/s and $2.6$ m/s`,
        R`$v^2=36+2(-2)(5)=16$, so $|v|=4$: $v(5)=-4$ m/s`],
      sol: R`**3-1** $a=\frac{dv}{dt}=-2$. $x=\int(6-2t)\,dt=6t-t^2+C$, and $x(0)=0$ gives $C=0$.

**3-2** $v=0$ at $t=3.0$ s, where $x=18-9=9.0$ m.

**3-3** $x(5)=30-25=5.0$ m. It went out $9.0$ m and came back $4.0$ m: $13$ m in all.

**3-4** $\frac{5.0}{5.0}$ and $\frac{13}{5.0}$.

**3-5** At $t=5$ s the object is at $x=5$ m, moving in $-x$. The equation gives the size of $v$; the sign comes from the motion.` },
    { no: '4', topic: 'Hitting a target · Ch. 4', pts: [2, 3, 2, 3],
      stem: R`A ball is launched from the origin at $45^\circ$ above the horizontal and must hit a small target at $(d,\,h)=(20\text{ m},\,10\text{ m})$. Take $x$ horizontal and $y$ up. ${G}`,
      parts: [R`Write $x(t)$ and $y(t)$ in terms of the launch speed $v_0$.`, R`Find $v_0$ in terms of $d$, $h$ and $g$, and evaluate it.`, R`When does the ball reach the target?`,
        R`Find the ball's velocity as it hits the target. Is it rising or falling?`],
      answer: [R`$x=\frac{v_0}{\sqrt{2}}t$, $y=\frac{v_0}{\sqrt{2}}t-\frac{1}{2}gt^2$`, R`$v_0=d\sqrt{\frac{g}{d-h}}=14\sqrt{2}\approx20$ m/s`, R`At $t=\frac{10}{7}\approx1.4$ s`,
        R`$14$ m/s, horizontal: it hits at the top of its path`],
      sol: R`**4-1** $\cos45^\circ=\sin45^\circ=\frac{1}{\sqrt{2}}$, no horizontal acceleration, and $-g$ vertically.

**4-2** At $x=d$, $t=\frac{\sqrt{2}d}{v_0}$. Then $y=d-\frac{gd^2}{v_0^2}=h$, so $v_0^2=\frac{gd^2}{d-h}=\frac{9.8\times400}{10}=392$.

**4-3** $t=\frac{\sqrt{2}\times20}{14\sqrt{2}}=\frac{20}{14}$.

**4-4** $v_x=\frac{v_0}{\sqrt{2}}=14$ m/s and $v_y=14-9.8\times\frac{10}{7}=0$. With $h=\frac{d}{2}$ at $45^\circ$ the target sits exactly at the top of the arc.` },
    { no: '5', topic: 'Up and down a rough slope · Ch. 5–6', pts: [2, 2, 2, 2, 2],
      stem: R`A block is pushed so that it starts up a rough slope at $37^\circ$ with speed $5.6$ m/s. The coefficients of friction are $\mu_s=0.50$ and $\mu_k=0.25$. ${T37} ${G}`,
      parts: [R`Name the forces on the block while it slides up, and find the normal force in terms of the mass $m$.`, R`Find the deceleration while it slides up.`,
        R`How far up the slope does it go, and how long does that take?`, R`Does the block stay at its highest point? Explain.`, R`Find its speed when it is back at its starting point.`],
      answer: [R`Gravity, the normal force and kinetic friction (down the slope); $N=mg\cos37^\circ=0.80\,mg$`, R`$7.84$ m/s²`, R`$2.0$ m, in $\frac{5}{7}\approx0.71$ s`,
        R`No: $\tan37^\circ=0.75>\mu_s=0.50$, so static friction can't hold it`, R`$2.8\sqrt{2}\approx4.0$ m/s`],
      sol: R`**5-1** Perpendicular to the slope nothing moves, so the normal force balances that part of gravity. Friction points against the sliding, down the slope.

**5-2** Both gravity's part and friction point down the slope: $a=g(\sin37^\circ+\mu_k\cos37^\circ)=9.8(0.60+0.20)$.

**5-3** $0=5.6^2-2(7.84)d$, so $d=\frac{31.36}{15.68}=2.0$ m; $t=\frac{5.6}{7.84}=\frac{5}{7}$ s.

**5-4** At rest, static friction would have to hold $mg\sin37^\circ$, but it can give at most $\mu_smg\cos37^\circ$: $0.60>0.40$.

**5-5** Coming down, friction points up the slope: $a=9.8(0.60-0.20)=3.92$ m/s². Over $2.0$ m: $v^2=2(3.92)(2.0)=15.68$, so $v=\sqrt{15.68}=2.8\sqrt{2}$ m/s.` },
    { no: '6', topic: 'Circular motion and power · Ch. 4, 7', pts: [2, 3, 2, 1, 2],
      stem: R`A particle travels round a circle of radius $R$ about the origin, counterclockwise, at a steady rate. Its position is $\vec{r}(t)=R\cos(\omega t)\,\hat{i}+R\sin(\omega t)\,\hat{j}$, where $\omega$ is constant.`,
      parts: [R`Find $\vec{v}(t)$ and the speed.`, R`Find $\vec{a}(t)$, and show that $\vec{a}=-\omega^2\vec{r}$.`, R`Write the size of the acceleration in terms of the speed $v$ and $R$.`,
        R`What power does the net force deliver?`, R`For $R=0.50$ m and a period of $\pi$ s, find the speed and the size of the acceleration.`],
      answer: [R`$\vec{v}=R\omega(-\sin\omega t\,\hat{i}+\cos\omega t\,\hat{j})$; speed $R\omega$`, R`$\vec{a}=-R\omega^2(\cos\omega t\,\hat{i}+\sin\omega t\,\hat{j})=-\omega^2\vec{r}$`,
        R`$a=\frac{v^2}{R}$`, R`$P=0$`, R`$1.0$ m/s and $2.0$ m/s²`],
      sol: R`**6-1** Differentiate each component with the chain rule. The speed is $R\omega\sqrt{\sin^2+\cos^2}=R\omega$.

**6-2** Differentiate again: $\frac{d}{dt}(-R\omega\sin\omega t)=-R\omega^2\cos\omega t$ and $\frac{d}{dt}(R\omega\cos\omega t)=-R\omega^2\sin\omega t$. That is $-\omega^2$ times $\vec{r}$: it points to the centre.

**6-3** $|\vec{a}|=R\omega^2=\frac{(R\omega)^2}{R}$.

**6-4** The net force is $m\vec{a}$, so the power is $m\,\vec{a}\cdot\vec{v}=mR^2\omega^3(\cos\omega t\sin\omega t-\sin\omega t\cos\omega t)=0$: the speed never changes.

**6-5** $\omega=\frac{2\pi}{T}=2$ rad/s, so $v=0.50\times2$ and $a=0.50\times4$.` },
  ] },
  // ===================================================================================================================
  { id: 'pm2', seg: 'Mock 2', title: 'Mock midterm 2', minutes: 60, qs: [
    { no: '1', topic: 'Warm-up · Ch. 1–3', pts: [2, 2, 2, 2, 2],
      parts: [R`Write the newton and the joule in SI base units.`, R`$4.52-0.0315$: give the result with the right number of significant figures.`,
        R`$6.0\div0.250$: give the result with the right number of significant figures.`, R`A particle's position is $x=2t^2-6t+7$. Find $v(t)$ and $a$, and when the particle is at rest.`,
        R`Which of these are vectors: velocity, speed, work, force, displacement, kinetic energy?`],
      answer: [R`$1\ \text{N}=1\ \text{kg}\cdot\text{m/s}^2$, $1\ \text{J}=1\ \text{kg}\cdot\text{m}^2/\text{s}^2$`, R`$4.49$`, R`$24$`, R`$v=4t-6$, $a=4$ m/s², at rest at $t=1.5$ s`,
        R`Velocity, force and displacement`],
      sol: R`**1-1** $F=ma$ gives $\text{kg}\cdot\text{m/s}^2$; a joule is a newton times a metre.

**1-2** $4.4885$, kept to two decimal places like $4.52$: $4.49$.

**1-3** $24$; $6.0$ has two significant figures, and so does $24$.

**1-4** $v=\frac{dx}{dt}=4t-6$ and $a=\frac{dv}{dt}=4$. $v=0$ at $t=1.5$ s.

**1-5** Speed, work and kinetic energy are numbers with no direction.` },
    { no: '2', topic: 'Magnetic force on an electron · Ch. 3', pts: [2, 3, 2, 2, 1],
      stem: R`An electron moves with velocity $\vec{v}=\hat{i}+2\hat{j}+2\hat{k}$ through a magnetic field $\vec{B}=2\hat{i}-2\hat{j}+\hat{k}$, both in suitable units. A charge $q$ feels the magnetic force $\vec{F}=q\,\vec{v}\times\vec{B}$, and for the electron $q=-e$.`,
      parts: [R`Find $\vec{v}\cdot\vec{B}$ and the angle between $\vec{v}$ and $\vec{B}$.`, R`Find $\vec{v}\times\vec{B}$.`, R`Write $\vec{F}$ in unit-vector notation.`,
        R`Find $|\vec{F}|$ in two ways.`, R`Find the unit vector in the direction of $\vec{F}$.`],
      answer: [R`$0$, so $90^\circ$`, R`$6\hat{i}+3\hat{j}-6\hat{k}$`, R`$\vec{F}=e(-6\hat{i}-3\hat{j}+6\hat{k})$`, R`$9e$, from the components and from $e|\vec{v}||\vec{B}|\sin90^\circ=e\cdot3\cdot3$`,
        R`$\frac{1}{3}(-2\hat{i}-\hat{j}+2\hat{k})$`],
      sol: R`**2-1** $2-4+2=0$: the velocity is perpendicular to the field.

**2-2** Component by component:
- $\hat{i}$: $v_yB_z-v_zB_y=(2)(1)-(2)(-2)=6$
- $\hat{j}$: $v_zB_x-v_xB_z=(2)(2)-(1)(1)=3$
- $\hat{k}$: $v_xB_y-v_yB_x=(1)(-2)-(2)(2)=-6$

**2-3** The electron's charge is negative: every sign flips.

**2-4** $e\sqrt{36+9+36}=9e$. Also $|\vec{v}|=|\vec{B}|=3$ and $\sin90^\circ=1$.

**2-5** Divide $\vec{F}$ by $9e$.` },
    { no: '3', topic: 'From an a–t graph to v–t · Ch. 2', fig: 'm2-3', pts: [3, 2, 3, 2],
      stem: R`Figure M2-3 is the $a$–$t$ graph of an object moving along the $x$-axis. At $t=0$ its velocity is $4.0$ m/s and $x=0$.`,
      parts: [R`Draw the $v$–$t$ graph, and give $v$ at $t=3$, $5$ and $8$ s.`, R`When is the object at rest?`, R`Find the displacement from $t=0$ to $t=8$ s.`, R`Find the distance travelled.`],
      answer: [R`Straight lines from $(0,\,4)$ to $(3,\,-2)$ to $(5,\,6)$, then level: $v=-2$, $6$ and $6$ m/s`, R`At $t=2.0$ s and $t=3.5$ s`, R`$25$ m`, R`$28$ m`],
      sol: R`**3-1** Each change in $v$ is the area under the $a$–$t$ graph: $-2\times3=-6$ by $3$ s, then $+4\times2=+8$ by $5$ s, then nothing.

[[fig:m2-3a]]

**3-2** $v=4-2t=0$ at $t=2$ s; then $v=-2+4(t-3)=0$ at $t=3.5$ s.

**3-3** Areas under the $v$–$t$ graph, with signs: $\frac{1}{2}(2)(4)=4$; $-\frac{1}{2}(1)(2)=-1$; $-\frac{1}{2}(0.5)(2)=-0.5$; $\frac{1}{2}(1.5)(6)=4.5$; $3\times6=18$. In all, $25$ m.

**3-4** Add the sizes: $4+1+0.5+4.5+18=28$ m.` },
    { no: '4', topic: 'Motion in 3D with a wind · Ch. 4', pts: [2, 2, 3, 3],
      stem: R`Take $x$ horizontal, $y$ vertically up and $z$ horizontal, a right-handed system, with the origin at the foot of a tower of height $19.6$ m. A ball of mass $m$ is thrown from the top of the tower with velocity $(9.8,\,0,\,0)$ m/s. While it flies, a steady wind pushes it with the constant force $(-0.25mg,\,0,\,0.50mg)$. Take $g=9.8$ m/s².`,
      parts: [R`Find the acceleration vector.`, R`Find the time of flight.`, R`Find the landing point $(x,\,z)$.`, R`Find the velocity and the speed at landing.`],
      answer: [R`$\vec{a}=(-2.45,\,-9.8,\,4.9)$ m/s², that is $\left(-\frac{g}{4},\,-g,\,\frac{g}{2}\right)$`, R`$2.0$ s`, R`$(14.7,\,9.8)$ m`, R`$(4.9,\,-19.6,\,9.8)$ m/s; $4.9\sqrt{21}\approx22$ m/s`],
      sol: R`**4-1** Gravity $(0,-mg,0)$ plus the wind, divided by $m$.

**4-2** The wind has no vertical part, so the fall is the usual one: $19.6=4.9t^2$.

**4-3** $x=9.8(2)-\frac{1}{2}(2.45)(4)=19.6-4.9$ and $z=\frac{1}{2}(4.9)(4)$.

**4-4** $v_x=9.8-2.45(2)$, $v_y=-9.8(2)$, $v_z=4.9(2)$. That is $4.9\times(1,-4,2)$, of length $4.9\sqrt{1+16+4}$.` },
    { no: '5', topic: 'Two blocks pulled at an angle · Ch. 5–6', fig: 'm2-5', pts: [3, 3, 2, 2],
      stem: R`Blocks 1 and 2, each of mass $2.0$ kg, are joined by a light horizontal string on a rough floor with $\mu_k=0.25$. A force of $20$ N pulls block 2 at $37^\circ$ above the horizontal, and block 2 pulls block 1 (Figure M2-5). ${T37} Take $g=9.8$ m/s².`,
      parts: [R`Find the normal force on each block.`, R`Find the acceleration.`, R`Find the tension in the string.`, R`What is the largest pull at $37^\circ$ before block 2 leaves the floor?`],
      answer: [R`$N_1=19.6$ N, $N_2=7.6$ N`, R`$2.3$ m/s²`, R`$9.5$ N`, R`$\frac{98}{3}\approx33$ N`],
      sol: R`**5-1** Block 1: $N_1=mg$. Block 2: the pull lifts it with $20\times0.60=12$ N, so $N_2=19.6-12$.

**5-2** Friction on both is $\mu_k(N_1+N_2)=0.25\times27.2=6.8$ N. The pull's horizontal part is $20\times0.80=16$ N. For both blocks: $16-6.8=4.0a$.

**5-3** Block 1 alone: $T-\mu_kN_1=ma$, so $T=4.9+2.0\times2.3$.

**5-4** $N_2=0$ when $0.60F=19.6$.` },
    { no: '6', topic: 'A banked curve · Ch. 6', pts: [3, 2, 2, 1, 2],
      stem: R`A car of mass $M$ takes a curve of radius $20$ m at a constant $14$ m/s. The road is banked at angle $\theta$ and is frictionless. Take $g=9.8$ m/s².`,
      parts: [R`Draw a free-body diagram, and write Newton's second law vertically and toward the centre.`, R`Find $\theta$.`, R`Find the normal force.`,
        R`What happens to a car that takes this curve slower than $14$ m/s?`, R`How long does one lap take?`],
      answer: [R`Weight $Mg$ down; normal force $N$ perpendicular to the road. $N\cos\theta=Mg$; $N\sin\theta=\frac{Mv^2}{R}$`, R`$\theta=45^\circ$`, R`$N=\sqrt{2}\,Mg$`,
        R`It slides down the bank, toward the centre`, R`$\frac{20\pi}{7}\approx9.0$ s`],
      sol: R`**6-1** Without friction only two forces act. The normal force tilts toward the centre by $\theta$; its horizontal part turns the car.

**6-2** Divide: $\tan\theta=\frac{v^2}{gR}=\frac{196}{196}=1$.

**6-3** $N=\frac{Mg}{\cos45^\circ}$.

**6-4** Slower, it needs less centripetal force than $N\sin\theta$ supplies, and with no friction to hold it, it slips inward and down.

**6-5** $\frac{2\pi R}{v}=\frac{40\pi}{14}$.` },
  ] },
  // ===================================================================================================================
  { id: 'pm3', seg: 'Mock 3', title: 'Mock midterm 3', minutes: 60, qs: [
    { no: '1', topic: 'Warm-up · Ch. 1–3', pts: [2, 2, 2, 2, 2],
      parts: [R`Write the acceleration of a particle in terms of its position $x(t)$.`, R`$2.0\times3.14159$: give the result with the right number of significant figures.`,
        R`$0.0450+1.2$: give the result with the right number of significant figures.`, R`A particle's position is $x=3\sin2t$ (in m, with $t$ in s). Find $v(t)$ and $a(t)$.`,
        R`What is $\vec{A}\times\vec{B}$ when $\vec{A}$ and $\vec{B}$ are parallel? What is $\vec{A}\cdot\vec{B}$ when they are perpendicular?`],
      answer: [R`$a=\frac{d^2x}{dt^2}$`, R`$6.3$`, R`$1.2$`, R`$v=6\cos2t$, $a=-12\sin2t$`, R`The zero vector; $0$`],
      sol: R`**1-1** Differentiate twice: $v=\frac{dx}{dt}$, then $a=\frac{dv}{dt}$.

**1-2** $6.28318$; $2.0$ has two significant figures.

**1-3** $1.245$; $1.2$ has one decimal place.

**1-4** The chain rule gives a factor $2$ each time: $\frac{d}{dt}\sin2t=2\cos2t$ and $\frac{d}{dt}\cos2t=-2\sin2t$.

**1-5** $|\vec{A}\times\vec{B}|=AB\sin\phi$ is $0$ for $\phi=0$ or $180^\circ$; $\vec{A}\cdot\vec{B}=AB\cos\phi$ is $0$ for $\phi=90^\circ$.` },
    { no: '2', topic: 'Vectors with letters · Ch. 3', pts: [2, 2, 2, 2, 2],
      stem: R`$\vec{A}=a\hat{i}+b\hat{j}$ and $\vec{B}=-b\hat{i}+a\hat{j}$, where $a$ and $b$ are positive constants.`,
      parts: [R`Find $\vec{A}\cdot\vec{B}$. What does it tell you?`, R`Find $\vec{A}\times\vec{B}$.`, R`Find $|\vec{A}+\vec{B}|$.`, R`Find the angle between $\vec{A}+\vec{B}$ and $\vec{A}$.`,
        R`Find the unit vector along $\vec{A}+\vec{B}$.`],
      answer: [R`$0$: the vectors are perpendicular`, R`$(a^2+b^2)\,\hat{k}$`, R`$\sqrt{2(a^2+b^2)}$`, R`$45^\circ$`, R`$\frac{(a-b)\hat{i}+(a+b)\hat{j}}{\sqrt{2(a^2+b^2)}}$`],
      sol: R`**2-1** $-ab+ba=0$. $\vec{B}$ is $\vec{A}$ turned $90^\circ$ counterclockwise, with the same length.

**2-2** Only $\hat{k}$ survives in the plane: $A_xB_y-A_yB_x=a^2-(-b^2)$. Positive, as $\vec{B}$ is $90^\circ$ counterclockwise from $\vec{A}$.

**2-3** $\vec{A}+\vec{B}=(a-b)\hat{i}+(a+b)\hat{j}$, and $(a-b)^2+(a+b)^2=2(a^2+b^2)$.

**2-4** $(\vec{A}+\vec{B})\cdot\vec{A}=A^2+0=a^2+b^2$, and $|\vec{A}+\vec{B}||\vec{A}|=\sqrt{2}(a^2+b^2)$, so $\cos\phi=\frac{1}{\sqrt{2}}$: the diagonal of a square.

**2-5** Divide $\vec{A}+\vec{B}$ by its length.` },
    { no: '3', topic: 'Average and instantaneous velocity · Ch. 2', pts: [2, 3, 3, 2],
      stem: R`A particle moves along the $x$-axis with $x(t)=t^3-3t$ (in m, with $t$ in s).`,
      parts: [R`Find the average velocity from $t=0$ to $t=2$ s.`, R`Find $v(t)$, and the moment between $0$ and $2$ s when the instantaneous velocity equals the average velocity.`,
        R`Find the distance travelled from $t=0$ to $t=2$ s.`, R`Find the average speed over that interval, and say why it differs from the average velocity.`],
      answer: [R`$1.0$ m/s`, R`$v=3t^2-3$; at $t=\frac{2}{\sqrt{3}}\approx1.2$ s`, R`$6.0$ m`, R`$3.0$ m/s; the particle turns around at $t=1$ s`],
      sol: R`**3-1** $\frac{x(2)-x(0)}{2}=\frac{2-0}{2}$: the slope of the secant of the $x$–$t$ graph.

**3-2** $v=\frac{dx}{dt}=3t^2-3=1$ gives $t^2=\frac{4}{3}$. There the tangent is parallel to the secant.

**3-3** $v<0$ until $t=1$ s: it goes from $0$ to $x(1)=-2$ m, then to $x(2)=2$ m. Distance $2+4$.

**3-4** $\frac{6.0}{2}$. Average velocity uses only the end points, so the trip out and back partly cancels.` },
    { no: '4', topic: 'A projectile on a slope · Ch. 4', fig: 'm3-4', pts: [2, 3, 3, 2],
      stem: R`A ball is launched from the bottom of a slope that rises at $37^\circ$, with speed $14$ m/s at $53^\circ$ above the horizontal (Figure M3-4). Take $x$ horizontal and $y$ up, and use $\sin53^\circ=\cos37^\circ\approx0.80$ and $\cos53^\circ=\sin37^\circ\approx0.60$. ${G}`,
      parts: [R`Write $x(t)$ and $y(t)$.`, R`The slope is the line $y=x\tan37^\circ$. When does the ball land on it?`, R`Where does it land, and how far is that along the slope?`,
        R`Find the velocity just before it lands. Is the ball still rising?`],
      answer: [R`$x=8.4t$, $y=11.2t-4.9t^2$`, R`At $t=1.0$ s`, R`At $(8.4,\,6.3)$ m, $10.5$ m along the slope`, R`$8.4\hat{i}+1.4\hat{j}$ m/s: yes, still rising`],
      sol: R`**4-1** $v_{0x}=14\times0.60$ and $v_{0y}=14\times0.80$.

**4-2** $11.2t-4.9t^2=0.75\times8.4t=6.3t$, so $4.9t=4.9$.

**4-3** $x=8.4$ and $y=11.2-4.9=6.3$ m. Along the slope: $\sqrt{8.4^2+6.3^2}=2.1\sqrt{16+9}$.

**4-4** $v_y=11.2-9.8=1.4$ m/s $>0$. The slope is steep enough to catch the ball before its highest point.` },
    { no: '5', topic: 'Holding a block on a slope · Ch. 5–6', pts: [2, 2, 2, 2, 2],
      stem: R`A $5.0$ kg block is on a slope at $37^\circ$, with $\mu_s=0.50$. A force $F$ parallel to the slope, pointing up the slope, acts on it. ${T37} Take $g=9.8$ m/s².`,
      parts: [R`Find the normal force.`, R`With $F=0$, does the block stay at rest?`, R`Find the smallest $F$ that holds the block.`, R`Find the largest $F$ before the block starts to slide up.`,
        R`With $F=30$ N, find the friction force, its size and direction.`],
      answer: [R`$39.2$ N`, R`No: gravity pulls $29.4$ N down the slope, but static friction can give at most $19.6$ N`, R`$9.8$ N`, R`$49$ N`, R`$0.6$ N, down the slope`],
      sol: R`**5-1** $mg\cos37^\circ=49\times0.80$.

**5-2** $mg\sin37^\circ=29.4$ N against $\mu_sN=19.6$ N.

**5-3** About to slide down, friction points up at its largest: $F+19.6=29.4$.

**5-4** About to slide up, friction points down at its largest: $F=29.4+19.6$.

**5-5** $30>29.4$, so without friction the block would move up; static friction pushes down just enough: $30-29.4$. Between $9.8$ and $49$ N it holds, with whatever friction is needed.` },
    { no: '6', topic: 'Leaving a smooth dome · Ch. 6, 8', fig: 'm3-6', pts: [2, 2, 2, 2, 2],
      stem: R`A small block of mass $m$ slides on the outside of a smooth hemispherical dome of radius $R$. It starts at the top with speed $v_0=\frac{1}{2}\sqrt{gR}$. Let $\varphi$ be the angle between the vertical and the line from the centre to the block (Figure M3-6).`,
      parts: [R`Use energy conservation to find $v^2$ at angle $\varphi$.`, R`Write Newton's second law toward the centre.`, R`Find the normal force $N(\varphi)$.`,
        R`At what angle does the block leave the dome?`, R`Find its speed as it leaves.`],
      answer: [R`$v^2=\frac{gR}{4}+2gR(1-\cos\varphi)$`, R`$mg\cos\varphi-N=\frac{mv^2}{R}$`, R`$N=mg\left(3\cos\varphi-\frac{9}{4}\right)$`, R`$\cos\varphi_1=\frac{3}{4}$`,
        R`$v=\frac{\sqrt{3gR}}{2}$`],
      sol: R`**6-1** The block drops $R(1-\cos\varphi)$, and the normal force does no work: $\frac{1}{2}mv^2=\frac{1}{2}mv_0^2+mgR(1-\cos\varphi)$.

**6-2** Toward the centre, gravity gives $mg\cos\varphi$ and the dome pushes outward with $N$.

**6-3** $N=mg\cos\varphi-\frac{m}{R}\left[\frac{gR}{4}+2gR-2gR\cos\varphi\right]=mg\left(3\cos\varphi-\frac{9}{4}\right)$.

**6-4** It leaves when $N$ reaches $0$.

**6-5** There $v^2=gR\cos\varphi_1$, from 6-2 with $N=0$. **Check** with 6-1: $\frac{gR}{4}+2gR\cdot\frac{1}{4}=\frac{3}{4}gR$.` },
  ] },
];
