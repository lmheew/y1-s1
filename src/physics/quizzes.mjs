// The Quizzes tab's practice sets: new problems in the format of the two exercise days from class (a warm-up,
// Problem 0, then longer problems with parts 1-1, 1-2 …), across Chapters 1–8. They are original problems, not taken
// from the class sheets or from any earlier practice package. Checked numerically in verify_sets.py.
//
// A problem: no (its number, "0", "1.2"), topic (the tag beside it, with the chapters), stem, fig (a figure id from
// figures.mjs, or a list of them), parts, labels (to override "no-1", "no-2" …), answer (one per part, or one when
// there are no parts) and sol (the worked steps: one step per paragraph or list item; [[fig:id]] as a paragraph of its
// own puts a figure there). Markup as in src/math (see CLAUDE.md): $…$, $$…$$, **bold**, "- " lists.
const R = String.raw;
const FOCUS = R`New problems in the format of the exercise days: a warm-up (Problem 0), then longer problems across Chapters 1–8. Work on paper without notes or a calculator, then open each answer.`;
const WARMUP = 'Warm-up: definitions, significant figures, vectors · Ch. 1–3';

export const sets = [
  // =====================================================================================================================
  {
    id: 'pa', seg: 'Set A', title: 'Practice Set A', sub: 'New problems · Chapters 1–8', added: '2026-11-01', focus: FOCUS,
    problems: [
      {
        no: '0', topic: WARMUP,
        parts: [
          R`A runner is at $x=-3$ m at $t=1$ s and at $x=9$ m at $t=5$ s. Find her average velocity.`,
          R`Write the instantaneous velocity $v$ as a limit, and say what it is on an $x$–$t$ graph.`,
          R`A car's velocity changes from $4$ m/s at $t=2$ s to $-6$ m/s at $t=7$ s. Find its average acceleration.`,
          R`Write the instantaneous acceleration $a$ in terms of the position $x$.`,
          R`$4.27+0.0315$: give the result to the correct precision.`,
          R`$4.27\times0.0315$: give the result to the correct number of significant figures.`,
          R`Find the unit vector of $\vec{a}=3\hat{i}-4\hat{j}$.`,
          R`Give the SI units of the three base quantities of mechanics.`,
          R`A particle's position is $x=3+8t-t^3$ (SI units). Find its velocity.`,
          R`For the same particle, find its acceleration, and the time when it is momentarily at rest.`,
          R`Is the work $W=\vec{F}\cdot\vec{d}$ a scalar or a vector?`,
          R`$\vec{A}$ and $\vec{B}$ both lie in the $xy$-plane. Is $\vec{A}\times\vec{B}$ a scalar or a vector, and along which axis does it point?`,
        ],
        answer: [
          R`$3$ m/s`, R`$v=\lim_{\Delta t\to0}\frac{\Delta x}{\Delta t}=\frac{dx}{dt}$: the slope of the tangent`, R`$-2$ m/s²`, R`$a=\frac{d^2x}{dt^2}$`,
          R`$4.30$`, R`$0.135$`, R`$\hat{a}=\frac{3}{5}\hat{i}-\frac{4}{5}\hat{j}$`, R`Metre (m), kilogram (kg), second (s)`,
          R`$v=8-3t^2$`, R`$a=-6t$; at rest at $t=\frac{2\sqrt{6}}{3}$ s`, R`A scalar`, R`A vector along the $z$-axis`,
        ],
        sol: R`**0-1** $v_\text{avg}=\frac{\Delta x}{\Delta t}=\frac{9-(-3)}{5-1}=\frac{12}{4}=3$ m/s, in the $+x$ direction.

**0-2** $v=\lim_{\Delta t\to0}\frac{\Delta x}{\Delta t}=\frac{dx}{dt}$: the slope of the tangent to the $x$–$t$ graph at that instant.

**0-3** $a_\text{avg}=\frac{-6-4}{7-2}=\frac{-10}{5}=-2$ m/s². The car slowed, stopped and reversed; the average can't tell you when.

**0-4** $a=\frac{dv}{dt}=\frac{d^2x}{dt^2}$.

**0-5** $4.27+0.0315=4.3015$. $4.27$ is known to $0.01$, so the sum is $4.30$. Keep the last zero: it says the hundredths are known.

**0-6** $4.27\times0.0315=0.134505$. Both numbers have three significant figures, so the product is $0.135$.

**0-7** $|\vec{a}|=\sqrt{3^2+4^2}=5$, so $\hat{a}=\frac{3}{5}\hat{i}-\frac{4}{5}\hat{j}$.

**0-8** Length in metres (m), mass in kilograms (kg) and time in seconds (s).

**0-9** $v=\frac{dx}{dt}=8-3t^2$.

**0-10** $a=\frac{dv}{dt}=-6t$. At rest when $8-3t^2=0$: $t=\sqrt{\frac{8}{3}}=\frac{2\sqrt{6}}{3}\approx1.6$ s.

**0-11** A scalar: a dot product is a number. Work can be negative, but it has no direction.

**0-12** A vector, perpendicular to both $\vec{A}$ and $\vec{B}$ and so to the $xy$-plane: along the $z$-axis, $+\hat{k}$ or $-\hat{k}$ by the right-hand rule.`,
      },
      {
        no: '1', topic: 'Vector algebra in components · Ch. 3',
        stem: R`Two vectors are given by $\vec{P}=p_x\hat{i}+p_y\hat{j}+p_z\hat{k}$ and $\vec{Q}=q_x\hat{i}+q_y\hat{j}+q_z\hat{k}$.`,
        parts: [
          R`Find $\vec{P}-2\vec{Q}$.`,
          R`Find $\vec{P}\cdot\vec{Q}$, and use it to write $\cos\phi$, where $\phi$ is the angle between $\vec{P}$ and $\vec{Q}$.`,
          R`Find $\vec{Q}\times\vec{P}$ (note the order).`,
          R`Find $\vec{P}\times\vec{P}$.`,
          R`Find the unit vector in the direction of $\vec{Q}$.`,
          R`Write $|\vec{P}+\vec{Q}|^2$ in terms of $|\vec{P}|$, $|\vec{Q}|$ and $\vec{P}\cdot\vec{Q}$.`,
        ],
        answer: [
          R`$(p_x-2q_x)\hat{i}+(p_y-2q_y)\hat{j}+(p_z-2q_z)\hat{k}$`,
          R`$\vec{P}\cdot\vec{Q}=p_xq_x+p_yq_y+p_zq_z$ and $\cos\phi=\frac{p_xq_x+p_yq_y+p_zq_z}{\sqrt{p_x^2+p_y^2+p_z^2}\,\sqrt{q_x^2+q_y^2+q_z^2}}$`,
          R`$(q_yp_z-q_zp_y)\hat{i}+(q_zp_x-q_xp_z)\hat{j}+(q_xp_y-q_yp_x)\hat{k}$, which is $-\vec{P}\times\vec{Q}$`,
          R`$\vec{0}$`,
          R`$\hat{Q}=\frac{q_x\hat{i}+q_y\hat{j}+q_z\hat{k}}{\sqrt{q_x^2+q_y^2+q_z^2}}$`,
          R`$|\vec{P}+\vec{Q}|^2=|\vec{P}|^2+|\vec{Q}|^2+2\,\vec{P}\cdot\vec{Q}$`,
        ],
        sol: R`**1-1** Component by component: the $\hat{i}$ part is $p_x-2q_x$, and the same for $\hat{j}$ and $\hat{k}$.

**1-2** Multiply matching components and add. Since also $\vec{P}\cdot\vec{Q}=|\vec{P}||\vec{Q}|\cos\phi$, dividing by the two lengths gives $\cos\phi$.

**1-3** The determinant with the rows swapped:
$$\vec{Q}\times\vec{P}=\begin{vmatrix}\hat{i}&\hat{j}&\hat{k}\\q_x&q_y&q_z\\p_x&p_y&p_z\end{vmatrix}$$
Swapping two rows flips the sign, so $\vec{Q}\times\vec{P}=-\vec{P}\times\vec{Q}$: the order matters.

**1-4** Every component has the form $p_yp_z-p_zp_y=0$. A vector is parallel to itself, and $\sin0=0$.

**1-5** Divide $\vec{Q}$ by its length.

**1-6** $|\vec{P}+\vec{Q}|^2=(\vec{P}+\vec{Q})\cdot(\vec{P}+\vec{Q})=\vec{P}\cdot\vec{P}+2\,\vec{P}\cdot\vec{Q}+\vec{Q}\cdot\vec{Q}$. If $\vec{P}\perp\vec{Q}$, this is Pythagoras.`,
      },
      {
        no: '2', topic: 'Dot and cross products, magnetic force · Ch. 3',
        stem: R`Two vectors are given by $\vec{X}=2\hat{i}-\hat{j}+\hat{k}$ and $\vec{Y}=\hat{i}+3\hat{j}-2\hat{k}$.`,
        parts: [
          R`Find the dot product $\vec{X}\cdot\vec{Y}$.`,
          R`Is the angle between $\vec{X}$ and $\vec{Y}$ smaller or larger than $90^\circ$? Explain without finding the angle.`,
          R`Find the cross product $\vec{X}\times\vec{Y}$.`,
          R`The magnetic force on a proton (charge $+e$) is $\vec{F}=e\,\vec{v}\times\vec{B}$. Take $\vec{v}=\vec{X}$ and $\vec{B}=\vec{Y}$. Write $\vec{F}$ in unit-vector notation and find its magnitude.`,
          R`Show that $\vec{F}$ is perpendicular to $\vec{v}$.`,
        ],
        answer: [
          R`$-3$`, R`Larger: the dot product is negative, so $\cos\phi<0$`, R`$-\hat{i}+5\hat{j}+7\hat{k}$`,
          R`$\vec{F}=-e\,\hat{i}+5e\,\hat{j}+7e\,\hat{k}$; $\ |\vec{F}|=5\sqrt{3}\,e$`, R`$\vec{F}\cdot\vec{v}=e(-2-5+7)=0$`,
        ],
        sol: R`**2-1** $(2)(1)+(-1)(3)+(1)(-2)=2-3-2=-3$.

**2-2** $\vec{X}\cdot\vec{Y}=|\vec{X}||\vec{Y}|\cos\phi$ and the lengths are positive, so the dot product has the sign of $\cos\phi$. Negative means $\phi>90^\circ$.

**2-3** Component by component:
- $\hat{i}$: $X_yY_z-X_zY_y=(-1)(-2)-(1)(3)=-1$
- $\hat{j}$: $X_zY_x-X_xY_z=(1)(1)-(2)(-2)=5$
- $\hat{k}$: $X_xY_y-X_yY_x=(2)(3)-(-1)(1)=7$

**2-4** A positive charge keeps the sign: $\vec{F}=e(-\hat{i}+5\hat{j}+7\hat{k})$. Its magnitude is $e\sqrt{1+25+49}=e\sqrt{75}=5\sqrt{3}\,e$.

**2-5** $\vec{F}\cdot\vec{v}=e\left[(-1)(2)+(5)(-1)+(7)(1)\right]=0$. A magnetic force is always perpendicular to the velocity, so it does no work.`,
      },
      {
        no: '3', topic: 'Motion from a position function · Ch. 2',
        stem: R`A particle moves along the $x$-axis with $x(t)=2t^3-9t^2+12t$, where $x$ is in metres and $t$ in seconds.`,
        parts: [
          R`Find $v(t)$ and $a(t)$.`,
          R`At what times is the particle momentarily at rest?`,
          R`Find the displacement and the distance travelled from $t=0$ to $t=3$ s.`,
          R`Find the average velocity and the average speed over the same interval.`,
          R`During $0<t<3$ s, when is the particle speeding up?`,
        ],
        answer: [
          R`$v=6t^2-18t+12$ m/s; $\ a=12t-18$ m/s²`, R`$t=1$ s and $t=2$ s`, R`Displacement $9$ m; distance $11$ m`,
          R`Average velocity $3$ m/s; average speed $\frac{11}{3}$ m/s`, R`For $1<t<1.5$ s and for $2<t<3$ s`,
        ],
        sol: R`**3-1** Differentiate: $v=6t^2-18t+12$, then $a=12t-18$.

**3-2** $v=6(t^2-3t+2)=6(t-1)(t-2)$, zero at $t=1$ and $t=2$ s.

**3-3** $x(0)=0$, $x(1)=5$, $x(2)=4$ and $x(3)=9$ m. The displacement is $x(3)-x(0)=9$ m. The particle turns around at $t=1$ and $t=2$, so add the legs: $5+1+5=11$ m.

**3-4** $v_\text{avg}=\frac{9}{3}=3$ m/s and $s_\text{avg}=\frac{11}{3}\approx3.7$ m/s. They differ because the particle went backwards for a while.

**3-5** It speeds up when $v$ and $a$ have the same sign. $a<0$ before $t=1.5$ s and $a>0$ after; $v>0$ before $1$ s, $v<0$ from $1$ to $2$ s, and $v>0$ after $2$ s. The signs match for $1<t<1.5$ (both negative) and $2<t<3$ (both positive).`,
      },
      {
        no: '4', topic: 'Motion graphs: a–t and v–t · Ch. 2', fig: ['a-41', 'a-44'],
        stem: R`The $a$–$t$ plot of an object is shown in Figure A4-1. At $t=0$ the object has $v=-2$ m/s and $x=0$.`,
        parts: [
          R`Draw the $v$–$t$ plot for $0\le t\le8$ s, and give $v$ at $t=8$ s.`,
          R`At what times is the object at rest?`,
          R`Find the displacement from $t=0$ to $t=8$ s.`,
          R`Figure A4-2 is the $v$–$t$ plot of a second object. Draw its $a$–$t$ plot.`,
          R`Find the distance the second object travels from $t=0$ to $t=6$ s.`,
        ],
        answer: [
          R`Straight segments through $(0,\,-2)$, $(2,\,4)$, $(5,\,4)$ and $(8,\,-2)$, in s and m/s; $\ v(8)=-2$ m/s`,
          R`$t=\frac{2}{3}$ s and $t=7$ s`, R`$17$ m`, R`$a=2$ m/s² for $0<t<3$ s, $0$ for $3<t<4$ s, $-3$ m/s² for $4<t<6$ s`, R`$21$ m`,
        ],
        sol: R`**4-1** The area under the $a$–$t$ plot is the change in $v$, and each constant $a$ gives a straight segment.
- $0$ to $2$ s: $+3\times2=+6$, so $v$ goes from $-2$ to $4$ m/s.
- $2$ to $5$ s: $a=0$, so $v$ stays at $4$ m/s.
- $5$ to $8$ s: $-2\times3=-6$, so $v$ goes from $4$ back to $-2$ m/s.

[[fig:a-41a]]

**4-2** On the first segment $v=-2+3t=0$ at $t=\frac{2}{3}$ s. On the last, $v=4-2(t-5)=0$ at $t=7$ s.

**4-3** The displacement is the signed area under the $v$–$t$ plot: $\frac{-2+4}{2}\cdot2+4\cdot3+\frac{4+(-2)}{2}\cdot3=2+12+3=17$ m.

**4-4** The slopes of Figure A4-2: $\frac{6}{3}=2$, then $0$, then $\frac{0-6}{2}=-3$ m/s².

[[fig:a-44a]]

**4-5** $v\ge0$ throughout, so the distance is the whole area: $\frac{1}{2}\cdot3\cdot6+6\cdot1+\frac{1}{2}\cdot2\cdot6=9+6+6=21$ m.`,
      },
      {
        no: '5', topic: 'Equilibrium of a hanging lamp · Ch. 5', fig: 'a-5',
        stem: R`A lamp of weight $W$ hangs from a knot. String 1 holds the knot at $30^\circ$ to the ceiling and string 2 at $60^\circ$ to the ceiling, on the other side (Figure A5).`,
        parts: [
          R`Write the equilibrium conditions for the knot in the horizontal and vertical directions.`,
          R`Find the tensions $T_1$ and $T_2$ in terms of $W$.`,
          R`Each string breaks if its tension exceeds $T_\text{max}$. What is the heaviest lamp the strings can hold?`,
        ],
        answer: [
          R`Horizontal: $T_2\cos60^\circ-T_1\cos30^\circ=0$; vertical: $T_1\sin30^\circ+T_2\sin60^\circ-W=0$`,
          R`$T_1=\frac{W}{2}$, $\ T_2=\frac{\sqrt{3}}{2}W$`,
          R`$W_\text{max}=\frac{2}{\sqrt{3}}T_\text{max}=\frac{2\sqrt{3}}{3}T_\text{max}$`,
        ],
        sol: R`**5-1** Three forces act on the knot: $T_1$ up and to the left, $T_2$ up and to the right, and $W$ down through the lamp's string. In equilibrium they add to zero in each direction.

**5-2** The horizontal equation gives $T_2=T_1\frac{\cos30^\circ}{\cos60^\circ}=\sqrt{3}\,T_1$. Into the vertical one: $\frac{1}{2}T_1+\sqrt{3}T_1\cdot\frac{\sqrt{3}}{2}=2T_1=W$. So $T_1=\frac{W}{2}$ and $T_2=\frac{\sqrt{3}}{2}W$.

**5-3** The steeper string, string 2, carries more, so it reaches $T_\text{max}$ first: $\frac{\sqrt{3}}{2}W=T_\text{max}$.`,
      },
      {
        no: '6', topic: 'A projectile from a cliff · Ch. 4', fig: 'a-6',
        stem: R`A ball is thrown from the edge of a cliff of height $h$ with speed $v_0=2\sqrt{gh}$ at $30^\circ$ above the horizontal (Figure A6). Take the origin at the foot of the cliff, $x$ horizontal and $y$ vertically up, and ignore air.`,
        parts: [
          R`Write $x(t)$ and $y(t)$.`,
          R`Find when the ball is highest, and its maximum height above the ground.`,
          R`Find the time of flight.`,
          R`Find where the ball lands.`,
          R`Find the speed at landing.`,
        ],
        answer: [
          R`$x=\sqrt{3gh}\,t$; $\ y=h+\sqrt{gh}\,t-\frac{1}{2}gt^2$`, R`At $t=\sqrt{\frac{h}{g}}$, height $\frac{3h}{2}$`,
          R`$t=(1+\sqrt{3})\sqrt{\frac{h}{g}}$`, R`$x=(3+\sqrt{3})\,h$`, R`$\sqrt{6gh}$`,
        ],
        sol: R`**6-1** $v_{0x}=2\sqrt{gh}\cos30^\circ=\sqrt{3gh}$ and $v_{0y}=2\sqrt{gh}\sin30^\circ=\sqrt{gh}$. The ball starts at height $h$.

**6-2** The top is where $v_y=\sqrt{gh}-gt=0$: $t=\frac{\sqrt{gh}}{g}=\sqrt{\frac{h}{g}}$. Then $y=h+\frac{v_{0y}^2}{2g}=h+\frac{h}{2}=\frac{3h}{2}$.

**6-3** Set $y=0$: $\frac{1}{2}gt^2-\sqrt{gh}\,t-h=0$. The quadratic formula gives $t=\frac{\sqrt{gh}+\sqrt{gh+2gh}}{g}=(1+\sqrt{3})\sqrt{\frac{h}{g}}$; the negative root is before the throw.

**6-4** $x=\sqrt{3gh}\cdot(1+\sqrt{3})\sqrt{\frac{h}{g}}=\sqrt{3}(1+\sqrt{3})\,h=(3+\sqrt{3})\,h$.

**6-5** Energy is the quickest route: $v^2=v_0^2+2gh=4gh+2gh=6gh$. **Check** with components: $v_x=\sqrt{3gh}$ and $v_y=\sqrt{gh}-gt=-\sqrt{3gh}$, so $v^2=3gh+3gh$.`,
      },
      {
        no: '7', topic: 'A block on a slope and a hanging block · Ch. 5–6', fig: 'a-7',
        stem: R`Block A (mass $M$) sits on a slope at angle $\theta$. A string from A runs up the slope, over a massless, frictionless pulley at the top, to block B (mass $m$), which hangs vertically (Figure A7).`,
        parts: [
          R`The slope is frictionless and B moves down. Write Newton's second law for A and for B.`,
          R`Find the acceleration and the tension.`,
          R`With $\theta=30^\circ$ and $M=m$, find the acceleration.`,
          R`With $\theta=30^\circ$, what condition on $m$ and $M$ makes B move down from rest?`,
          R`Now the slope is rough, with coefficient of kinetic friction $\mu_k$, and A slides up the slope. Find the acceleration.`,
        ],
        answer: [
          R`A, up the slope: $T-Mg\sin\theta=Ma$; B, downward: $mg-T=ma$`,
          R`$a=\frac{m-M\sin\theta}{M+m}g$; $\ T=\frac{Mm(1+\sin\theta)}{M+m}g$`,
          R`$a=\frac{g}{4}$`, R`$m>\frac{M}{2}$`, R`$a=\frac{m-M(\sin\theta+\mu_k\cos\theta)}{M+m}g$`,
        ],
        sol: R`**7-1** Take A's motion up the slope and B's motion down as positive; they share one $a$. Along the slope A feels the tension up and $Mg\sin\theta$ down; B feels $mg$ down and the tension up.

**7-2** Add the equations: $mg-Mg\sin\theta=(M+m)a$. Then $T=mg-ma=mg\left[1-\frac{m-M\sin\theta}{M+m}\right]=\frac{Mm(1+\sin\theta)}{M+m}g$.

**7-3** $\sin30^\circ=\frac{1}{2}$: $a=\frac{m-m/2}{2m}g=\frac{g}{4}$.

**7-4** From rest, B moves down when its weight beats A's pull down the slope: $mg>Mg\sin30^\circ$, so $m>\frac{M}{2}$.

**7-5** A presses on the slope with $N=Mg\cos\theta$, and kinetic friction $\mu_kMg\cos\theta$ points down the slope, against A's motion. A: $T-Mg\sin\theta-\mu_kMg\cos\theta=Ma$. Adding B's equation gives the answer.`,
      },
      {
        no: '8', topic: 'The conical pendulum · Ch. 6–7', fig: 'a-8',
        stem: R`A small ball of mass $m$ on a string of length $L$ moves in a horizontal circle at constant speed, with the string at angle $\theta$ from the vertical: a conical pendulum (Figure A8).`,
        parts: [
          R`Write Newton's second law for the ball in the vertical direction and toward the centre of the circle.`,
          R`Find the tension in the string.`,
          R`Find the speed of the ball.`,
          R`Find the time for one revolution.`,
          R`What power does the tension deliver to the ball?`,
        ],
        answer: [
          R`Vertical: $T\cos\theta-mg=0$; toward the centre: $T\sin\theta=\frac{mv^2}{r}$, with $r=L\sin\theta$`,
          R`$T=\frac{mg}{\cos\theta}$`, R`$v=\sqrt{gL\sin\theta\tan\theta}$`, R`$2\pi\sqrt{\frac{L\cos\theta}{g}}$`, R`Zero`,
        ],
        sol: R`**8-1** Two forces act: the weight $mg$ down and the tension $T$ along the string. The ball doesn't move vertically, and the horizontal part of $T$ keeps it on the circle of radius $r=L\sin\theta$.

**8-2** From the vertical equation, $T=\frac{mg}{\cos\theta}$: more than $mg$, and growing as the circle widens.

**8-3** Divide the two equations: $\tan\theta=\frac{v^2}{rg}$, so $v^2=gr\tan\theta=gL\sin\theta\tan\theta$.

**8-4** One lap is $2\pi r$: $\frac{2\pi r}{v}=\frac{2\pi L\sin\theta}{\sqrt{gL\sin\theta\tan\theta}}=2\pi\sqrt{\frac{L\sin\theta}{g\tan\theta}}=2\pi\sqrt{\frac{L\cos\theta}{g}}$.

**8-5** The velocity is along the circle and the string is perpendicular to it, so $P=\vec{T}\cdot\vec{v}=0$, and the speed stays constant.`,
      },
      {
        no: '9', topic: 'A spring, a rough strip and a ramp · Ch. 7–8', fig: 'a-9',
        stem: R`A block of mass $m$ is pushed against a spring of spring constant $k$, compressing it by $d$, and released on a horizontal floor (Figure A9). The floor is frictionless except for a rough strip of length $L$ with coefficient of kinetic friction $\mu_k$. After the strip, the block slides up a frictionless ramp.`,
        parts: [
          R`Find the block's speed when it leaves the spring.`,
          R`Find the work done by friction on the block as it crosses the strip.`,
          R`Find the block's speed after the strip.`,
          R`Find the greatest height the block reaches on the ramp.`,
          R`What is the smallest compression $d$ that gets the block across the strip?`,
        ],
        answer: [
          R`$v_1=d\sqrt{\frac{k}{m}}$`, R`$W_f=-\mu_kmgL$`, R`$v_2=\sqrt{\frac{kd^2}{m}-2\mu_kgL}$`, R`$h=\frac{kd^2}{2mg}-\mu_kL$`,
          R`$d_\text{min}=\sqrt{\frac{2\mu_kmgL}{k}}$`,
        ],
        sol: R`**9-1** The spring's elastic energy becomes kinetic energy: $\frac{1}{2}kd^2=\frac{1}{2}mv_1^2$.

**9-2** Friction $\mu_kmg$ acts against the motion over the distance $L$: $W_f=-\mu_kmgL$. The normal force and gravity do no work on the level strip.

**9-3** Work–energy theorem: $\frac{1}{2}mv_2^2=\frac{1}{2}mv_1^2-\mu_kmgL$, so $v_2^2=\frac{kd^2}{m}-2\mu_kgL$.

**9-4** On the frictionless ramp, kinetic energy becomes potential energy: $mgh=\frac{1}{2}mv_2^2$, so $h=\frac{v_2^2}{2g}=\frac{kd^2}{2mg}-\mu_kL$.

**9-5** It just gets across when $v_2=0$ at the end of the strip: $\frac{1}{2}kd^2=\mu_kmgL$.`,
      },
      {
        no: '10', topic: 'Work by a variable force, and power · Ch. 7', fig: 'a-10',
        stem: R`A force $F(x)=3+4x-3x^2$ (in newtons, with $x$ in metres) acts along the $x$-axis on a $2.0$ kg object, which starts from rest at $x=0$. No other force does work (Figure A10).`,
        parts: [
          R`Find the work done by the force from $x=0$ to $x=2$ m.`,
          R`Find the object's speed at $x=2$ m.`,
          R`Find the power delivered by the force at $x=1$ m.`,
          R`Where does the object come to rest again?`,
        ],
        answer: [R`$6$ J`, R`$\sqrt{6}$ m/s, about $2.4$ m/s`, R`$8$ W`, R`At $x=3$ m`],
        sol: R`**10-1** For a force that changes with position, the work is the area under the $F$–$x$ plot: $W=\int_0^2(3+4x-3x^2)\,dx=\left[3x+2x^2-x^3\right]_0^2=6+8-8=6$ J.

**10-2** Work–energy theorem from rest: $\frac{1}{2}(2.0)v^2=6$, so $v^2=6$ and $v=\sqrt{6}$ m/s.

**10-3** At $x=1$: $F=3+4-3=4$ N. The work so far is $3+2-1=4$ J, so $\frac{1}{2}(2.0)v^2=4$ and $v=2$ m/s. Then $P=Fv=4\times2=8$ W.

**10-4** The kinetic energy is the work done so far, $W(x)=3x+2x^2-x^3=x(3-x)(1+x)$, which is zero again at $x=3$ m. Past $x\approx1.9$ m the force points backwards, and by $x=3$ m it has taken back all the energy it gave.`,
      },
    ],
  },
  // =====================================================================================================================
  {
    id: 'pb', seg: 'Set B', title: 'Practice Set B', sub: 'New problems · Chapters 1–8', added: '2026-11-01', focus: FOCUS,
    problems: [
      {
        no: '0', topic: WARMUP,
        parts: [
          R`Give the definition of the average speed $s_\text{avg}$, and say how it differs from the average velocity.`,
          R`A ball's position is $x(t)$. Write its velocity at the instant $t_1$ as a limit.`,
          R`A particle's velocity is $v=3t^2-2$ (m/s). Find its average acceleration from $t=1$ s to $t=3$ s.`,
          R`For the particle in 0-3, find the instantaneous acceleration at $t=2$ s.`,
          R`$12.4+3.256$: give the result to the correct precision.`,
          R`$12.4\times3.256$: give the result to the correct number of significant figures.`,
          R`Find the unit vector of $\vec{r}=(2,\,-1,\,2)$.`,
          R`Write the newton, the unit of force, in SI base units.`,
          R`A particle's position is $x=2+5t^2-t^3$ (SI units). Find its velocity.`,
          R`For the same particle, find its acceleration, and the time when the acceleration is zero.`,
          R`Find $\hat{i}\cdot\hat{i}$ and $\hat{i}\cdot\hat{j}$.`,
          R`Find $\hat{i}\times\hat{j}$ and $\hat{j}\times\hat{i}$.`,
        ],
        answer: [
          R`$s_\text{avg}=\frac{\text{total distance}}{\Delta t}$; it counts the whole path, while the average velocity uses only the displacement`,
          R`$v(t_1)=\lim_{\Delta t\to0}\frac{x(t_1+\Delta t)-x(t_1)}{\Delta t}$`, R`$12$ m/s²`, R`$12$ m/s²`, R`$15.7$`, R`$40.4$`,
          R`$\left(\frac{2}{3},\,-\frac{1}{3},\,\frac{2}{3}\right)$`, R`$1\text{ N}=1\text{ kg}\cdot\text{m/s}^2$`, R`$v=10t-3t^2$`,
          R`$a=10-6t$; zero at $t=\frac{5}{3}$ s`, R`$1$ and $0$`, R`$\hat{k}$ and $-\hat{k}$`,
        ],
        sol: R`**0-1** Average speed divides the total path length by the time, so it is never negative. Walk $5$ m and come back: the average velocity is $0$, the average speed isn't.

**0-2** The derivative at $t_1$: the limit of the average velocity over a shrinking interval.

**0-3** $v(1)=1$ and $v(3)=25$ m/s, so $a_\text{avg}=\frac{25-1}{3-1}=12$ m/s².

**0-4** $a=\frac{dv}{dt}=6t$, so $a(2)=12$ m/s². It equals the average of 0-3 because $a$ grows linearly and $t=2$ is the middle of the interval.

**0-5** $12.4+3.256=15.656$. $12.4$ is known to $0.1$, so the sum is $15.7$.

**0-6** $12.4\times3.256=40.3744$. $12.4$ has three significant figures, so the product is $40.4$.

**0-7** $|\vec{r}|=\sqrt{4+1+4}=3$; divide each component by $3$.

**0-8** From $F=ma$: kilograms times metres per second squared. A newton is built from mass, length and time.

**0-9** $v=\frac{dx}{dt}=10t-3t^2$.

**0-10** $a=\frac{dv}{dt}=10-6t$, zero at $t=\frac{5}{3}$ s, where the velocity is largest.

**0-11** $\hat{i}\cdot\hat{i}=1\cdot1\cdot\cos0=1$ and $\hat{i}\cdot\hat{j}=1\cdot1\cdot\cos90^\circ=0$.

**0-12** $\hat{i}\times\hat{j}=\hat{k}$ by the right-hand rule, and swapping the order flips the sign.`,
      },
      {
        no: '1', topic: 'Vectors from magnitudes and angles · Ch. 3', fig: 'b-1',
        stem: R`In the $xy$-plane, $\vec{a}$ has magnitude $4$ at $30^\circ$ counterclockwise from the $+x$-axis, and $\vec{b}$ has magnitude $3$ at $120^\circ$ (Figure B1).`,
        parts: [
          R`Write $\vec{a}$ and $\vec{b}$ in unit-vector notation.`,
          R`Find $\vec{a}+\vec{b}$.`,
          R`Find $\vec{a}\cdot\vec{b}$ in two ways: from the components, and from the magnitudes and the angle between the vectors.`,
          R`Find $\vec{a}\times\vec{b}$.`,
          R`Find $|\vec{a}+\vec{b}|$.`,
        ],
        answer: [
          R`$\vec{a}=2\sqrt{3}\,\hat{i}+2\hat{j}$; $\ \vec{b}=-\frac{3}{2}\hat{i}+\frac{3\sqrt{3}}{2}\hat{j}$`,
          R`$\left(2\sqrt{3}-\frac{3}{2}\right)\hat{i}+\left(2+\frac{3\sqrt{3}}{2}\right)\hat{j}$`, R`$0$ both ways`, R`$12\hat{k}$`, R`$5$`,
        ],
        sol: R`**1-1** $\vec{a}=4(\cos30^\circ,\,\sin30^\circ)=(2\sqrt{3},\,2)$ and $\vec{b}=3(\cos120^\circ,\,\sin120^\circ)=\left(-\frac{3}{2},\,\frac{3\sqrt{3}}{2}\right)$.

**1-2** Add the components.

**1-3** Components: $2\sqrt{3}\cdot\left(-\frac{3}{2}\right)+2\cdot\frac{3\sqrt{3}}{2}=-3\sqrt{3}+3\sqrt{3}=0$. Angles: the vectors are $120^\circ-30^\circ=90^\circ$ apart, and $4\cdot3\cos90^\circ=0$. Perpendicular vectors have a zero dot product.

**1-4** Both lie in the $xy$-plane, so only the $\hat{k}$ part survives: $a_xb_y-a_yb_x=2\sqrt{3}\cdot\frac{3\sqrt{3}}{2}-2\cdot\left(-\frac{3}{2}\right)=9+3=12$. Also $|\vec{a}||\vec{b}|\sin90^\circ=12$, and $\vec{b}$ is counterclockwise from $\vec{a}$, so the product points along $+\hat{k}$.

**1-5** The vectors are perpendicular, so Pythagoras: $\sqrt{4^2+3^2}=5$.`,
      },
      {
        no: '2', topic: 'Three pulls in equilibrium · Ch. 5', fig: 'b-2',
        stem: R`Three horizontal pulls act on a ring, which stays at rest (Figure B2). Pull A has an unknown magnitude $F_A$ along the $+x$-axis. Pull B has magnitude $2F$ at $150^\circ$ counterclockwise from the $+x$-axis. Pull C has magnitude $\sqrt{2}F$ in an unknown direction.`,
        parts: [
          R`Write the equilibrium conditions in the $x$- and $y$-directions, with pull C at angle $\varphi$ from the $+x$-axis.`,
          R`Find the two possible directions of pull C.`,
          R`Find $F_A$ for each of them.`,
        ],
        answer: [
          R`$x$: $F_A+2F\cos150^\circ+\sqrt{2}F\cos\varphi=0$; $\ y$: $2F\sin150^\circ+\sqrt{2}F\sin\varphi=0$`,
          R`$\varphi=225^\circ$ or $\varphi=315^\circ$: $45^\circ$ below the $-x$- or the $+x$-axis`,
          R`$F_A=(\sqrt{3}+1)F$ for $225^\circ$; $\ F_A=(\sqrt{3}-1)F$ for $315^\circ$`,
        ],
        sol: R`**2-1** The pulls add to zero in each direction.

**2-2** The $y$ condition: $2F\cdot\frac{1}{2}+\sqrt{2}F\sin\varphi=0$, so $\sin\varphi=-\frac{1}{\sqrt{2}}$: $\varphi=225^\circ$ or $315^\circ$. Pull C must cancel B's upward part, so it points down either way.

**2-3** The $x$ condition: $F_A=-2F\cos150^\circ-\sqrt{2}F\cos\varphi=\sqrt{3}F-\sqrt{2}F\cos\varphi$.
- $\varphi=225^\circ$: $\cos\varphi=-\frac{1}{\sqrt{2}}$, so $F_A=\sqrt{3}F+F$.
- $\varphi=315^\circ$: $\cos\varphi=\frac{1}{\sqrt{2}}$, so $F_A=\sqrt{3}F-F$. Here C helps A against B, so A needs less.`,
      },
      {
        no: '3', topic: 'Deriving the equations; a ball thrown up · Ch. 2',
        stem: R`An object moves along the $x$-axis with constant acceleration $a$.`,
        parts: [
          R`Its velocity is $v_0$ at $t=0$. From $\frac{dv}{dt}=a$, find $v(t)$.`,
          R`Its position is $x_1$ at $t=t_1$. From $\frac{dx}{dt}=v(t)$, find $x(t)$.`,
          R`Use the chain rule, $a=v\frac{dv}{dx}$, to derive $v^2=v_0^2+2a(x-x_0)$, where $x_0$ is the position at $t=0$.`,
          R`A ball is thrown straight up with speed $v_0$. Find its maximum height above the launch point and the time it takes to come back.`,
          R`The ball passes a point at height $h$, below its maximum, twice. Find the time between the two passes.`,
        ],
        answer: [
          R`$v=v_0+at$`, R`$x=x_1+v_0(t-t_1)+\frac{1}{2}a(t^2-t_1^2)$`, R`$\frac{1}{2}(v^2-v_0^2)=a(x-x_0)$`,
          R`Height $\frac{v_0^2}{2g}$; back after $\frac{2v_0}{g}$`, R`$\frac{2}{g}\sqrt{v_0^2-2gh}$`,
        ],
        sol: R`**3-1** Integrate: $v=at+C$, and $v(0)=v_0$ gives $C=v_0$.

**3-2** Integrate $v_0+at$: $x=v_0t+\frac{1}{2}at^2+C$. At $t=t_1$, $x=x_1$: $C=x_1-v_0t_1-\frac{1}{2}at_1^2$. So $x=x_1+v_0(t-t_1)+\frac{1}{2}a(t^2-t_1^2)$. **Check** $t=t_1$ gives $x_1$.

**3-3** $a=\frac{dv}{dt}=\frac{dv}{dx}\frac{dx}{dt}=v\frac{dv}{dx}$, so $a\,dx=v\,dv$. Integrate from $(x_0,v_0)$ to $(x,v)$: $a(x-x_0)=\frac{1}{2}v^2-\frac{1}{2}v_0^2$.

**3-4** With $a=-g$: at the top $v=0$, so $0=v_0^2-2gH$ and $H=\frac{v_0^2}{2g}$. Back at the start $y=v_0t-\frac{1}{2}gt^2=0$, so $t=\frac{2v_0}{g}$.

**3-5** $h=v_0t-\frac{1}{2}gt^2$ gives $gt^2-2v_0t+2h=0$, so $t=\frac{v_0\pm\sqrt{v_0^2-2gh}}{g}$. The two roots are $\frac{2}{g}\sqrt{v_0^2-2gh}$ apart.`,
      },
      {
        no: '4', topic: 'Acceleration that changes with time · Ch. 2',
        stem: R`An object moves along the $x$-axis with acceleration $a(t)=6t-4$ (m/s²). At $t=0$ it has $v=1$ m/s and $x=2$ m.`,
        parts: [
          R`Find $v(t)$.`,
          R`Find $x(t)$.`,
          R`When is the object at rest?`,
          R`Find the displacement and the distance travelled from $t=0$ to $t=2$ s.`,
          R`Why can't the constant-acceleration equations be used here?`,
        ],
        answer: [
          R`$v=3t^2-4t+1$`, R`$x=t^3-2t^2+t+2$`, R`$t=\frac{1}{3}$ s and $t=1$ s`,
          R`Displacement $2$ m; distance $\frac{62}{27}$ m, about $2.3$ m`, R`The acceleration changes with time`,
        ],
        sol: R`**4-1** $v=\int(6t-4)\,dt=3t^2-4t+C$, and $v(0)=1$ gives $C=1$.

**4-2** $x=\int(3t^2-4t+1)\,dt=t^3-2t^2+t+C$, and $x(0)=2$ gives $C=2$.

**4-3** $3t^2-4t+1=(3t-1)(t-1)=0$.

**4-4** $x(0)=2$, $x\left(\frac{1}{3}\right)=2+\frac{4}{27}$, $x(1)=2$ and $x(2)=4$ m. The displacement is $4-2=2$ m. The object turns at $t=\frac{1}{3}$ and $t=1$, so the distance is $\frac{4}{27}+\frac{4}{27}+2=\frac{62}{27}$ m.

**4-5** Those equations assume a constant $a$. Here it changes, so integrate instead.`,
      },
      {
        no: '5', topic: 'Pushing at an angle, with friction · Ch. 6', fig: 'b-5',
        stem: R`A box of mass $m$ rests on a rough floor with coefficients of friction $\mu_s$ (static) and $\mu_k$ (kinetic). A force of magnitude $F$ pushes on it at angle $\theta$ below the horizontal (Figure B5).`,
        parts: [
          R`Find the normal force on the box.`,
          R`The box doesn't move. Find the frictional force.`,
          R`Find the smallest $F$ that starts the box moving.`,
          R`With the force kept at that value, find the acceleration once the box moves.`,
          R`If the same force pulled at $\theta$ above the horizontal instead, what would the normal force be? Which way is easier to start the box?`,
        ],
        answer: [
          R`$N=mg+F\sin\theta$`, R`$f_s=F\cos\theta$`, R`$F=\frac{\mu_smg}{\cos\theta-\mu_s\sin\theta}$`,
          R`$a=\frac{F\cos\theta-\mu_k(mg+F\sin\theta)}{m}$`, R`$N=mg-F\sin\theta$; pulling is easier, since less normal force means less friction`,
        ],
        sol: R`**5-1** Vertically: $N-mg-F\sin\theta=0$. Pushing down presses the box into the floor.

**5-2** Static friction balances the horizontal push exactly, $f_s=F\cos\theta$, as long as that is below $\mu_sN$.

**5-3** The box starts when the push reaches the most static friction can give: $F\cos\theta=\mu_s(mg+F\sin\theta)$. Solve for $F$. If $\mu_s\tan\theta\ge1$, no push at this angle can start it.

**5-4** Moving, the friction is kinetic: $ma=F\cos\theta-\mu_kN=F\cos\theta-\mu_k(mg+F\sin\theta)$.

**5-5** Pulling up lifts part of the weight: $N=mg-F\sin\theta$. Less normal force means less friction, and the starting force becomes $\frac{\mu_smg}{\cos\theta+\mu_s\sin\theta}$, smaller than before.`,
      },
      {
        no: '6', topic: 'Two blocks in contact · Ch. 5–6', fig: 'b-6',
        stem: R`Blocks 1 and 2, with masses $m_1$ and $m_2$, sit side by side on a frictionless floor. A horizontal force $F$ pushes block 1, which pushes block 2 (Figure B6).`,
        parts: [
          R`Find the acceleration of the blocks.`,
          R`Find the contact force between the blocks.`,
          R`If $F$ pushed block 2 from the other side instead, what would the contact force be?`,
          R`Now both blocks slide with coefficient of kinetic friction $\mu_k$, and $F$ pushes block 1. Find the acceleration and the contact force.`,
        ],
        answer: [
          R`$a=\frac{F}{m_1+m_2}$`, R`$P=\frac{m_2}{m_1+m_2}F$`, R`$P=\frac{m_1}{m_1+m_2}F$`,
          R`$a=\frac{F}{m_1+m_2}-\mu_kg$; $\ P=\frac{m_2}{m_1+m_2}F$, the same as without friction`,
        ],
        sol: R`**6-1** The blocks move together, so treat them as one body of mass $m_1+m_2$: $F=(m_1+m_2)a$.

**6-2** Only the contact force $P$ pushes block 2: $P=m_2a=\frac{m_2F}{m_1+m_2}$.

**6-3** Now the contact force pushes block 1, so $P=m_1a$. The block pushed by the other one needs a force for its own mass.

**6-4** Together: $F-\mu_k(m_1+m_2)g=(m_1+m_2)a$. Block 2: $P-\mu_km_2g=m_2a$, so $P=m_2(a+\mu_kg)=\frac{m_2F}{m_1+m_2}$. Friction slows both blocks in proportion to their masses, so the force between them doesn't change.`,
      },
      {
        no: '7', topic: 'A ball kicked toward a wall · Ch. 4', fig: 'b-7',
        stem: R`A ball is kicked from the ground at speed $v_0$ and $45^\circ$ above the horizontal, toward a vertical wall at horizontal distance $d$ (Figure B7). Ignore air.`,
        parts: [
          R`When does the ball reach the wall?`,
          R`At what height does it hit the wall?`,
          R`For what $v_0$ does it hit the wall exactly at the top of its path, and how high is that?`,
          R`The wall has height $h$, with $h<d$. Find the smallest $v_0$ for which the ball clears it.`,
        ],
        answer: [R`$t=\frac{\sqrt{2}\,d}{v_0}$`, R`$y=d-\frac{gd^2}{v_0^2}$`, R`$v_0=\sqrt{2gd}$, at height $\frac{d}{2}$`, R`$v_0=d\sqrt{\frac{g}{d-h}}$`],
        sol: R`**7-1** $v_{0x}=v_0\cos45^\circ=\frac{v_0}{\sqrt{2}}$, so $t=\frac{d}{v_{0x}}=\frac{\sqrt{2}\,d}{v_0}$.

**7-2** $y=v_{0y}t-\frac{1}{2}gt^2$ with $v_{0y}=\frac{v_0}{\sqrt{2}}$: $y=d-\frac{1}{2}g\cdot\frac{2d^2}{v_0^2}=d-\frac{gd^2}{v_0^2}$.

**7-3** The top of a $45^\circ$ path is halfway along its range $\frac{v_0^2}{g}$, so $\frac{v_0^2}{2g}=d$ and $v_0=\sqrt{2gd}$. The height there is $d-\frac{gd^2}{2gd}=\frac{d}{2}$.

**7-4** The ball clears the wall when $d-\frac{gd^2}{v_0^2}\ge h$, that is when $v_0^2\ge\frac{gd^2}{d-h}$.`,
      },
      {
        no: '8', topic: 'Flat and banked curves · Ch. 6',
        stem: R`A car of mass $M$ drives at constant speed $v$ around a circular curve of radius $R$.`,
        parts: [
          R`On a flat road, static friction keeps the car on the curve. How large must the friction force be?`,
          R`If the coefficient of static friction is $\mu_s$, find the greatest safe speed on the flat road.`,
          R`The curve is now banked at angle $\theta$ and is frictionless. Find the normal force.`,
          R`At what speed can the car take the banked curve with no friction at all?`,
          R`Explain why the normal force on the banked curve is larger than $Mg$.`,
        ],
        answer: [
          R`$f_s=\frac{Mv^2}{R}$`, R`$v_\text{max}=\sqrt{\mu_sgR}$`, R`$N=\frac{Mg}{\cos\theta}$`, R`$v=\sqrt{gR\tan\theta}$`,
          R`Its vertical part alone must equal $Mg$, and it has a horizontal part too: $N=\frac{Mg}{\cos\theta}>Mg$`,
        ],
        sol: R`**8-1** Friction is the only horizontal force, so it is the centripetal force: $f_s=\frac{Mv^2}{R}$, pointing to the centre.

**8-2** Static friction can give at most $\mu_sMg$: $\frac{Mv^2}{R}\le\mu_sMg$. The mass cancels.

**8-3** No vertical motion: $N\cos\theta=Mg$.

**8-4** The horizontal part of $N$ supplies the centripetal force: $N\sin\theta=\frac{Mv^2}{R}$. Divide by the vertical equation: $\tan\theta=\frac{v^2}{gR}$.

**8-5** $\cos\theta<1$ for any bank. Faster than $\sqrt{gR\tan\theta}$ the car needs friction pointing down the slope; slower, up the slope.`,
      },
      {
        no: '9', topic: 'Loop-the-loop · Ch. 6, 8', fig: 'b-9',
        stem: R`A small block of mass $m$ starts from rest at height $h$ and slides without friction down a track, then around a vertical loop of radius $R$ whose bottom is at ground level (Figure B9).`,
        parts: [
          R`Find the block's speed at the bottom of the loop.`,
          R`Find its speed at the top of the loop.`,
          R`Find the normal force from the track at the top.`,
          R`Find the smallest $h$ for which the block stays on the track all the way round.`,
          R`With that $h$, find the normal force at the bottom of the loop.`,
        ],
        answer: [R`$\sqrt{2gh}$`, R`$\sqrt{2g(h-2R)}$`, R`$N=mg\left(\frac{2h}{R}-5\right)$, pointing down`, R`$h_\text{min}=\frac{5R}{2}$`, R`$6mg$`],
        sol: R`**9-1** Energy from the start: $mgh=\frac{1}{2}mv^2$.

**9-2** The top is $2R$ high: $mgh=\frac{1}{2}mv_\text{top}^2+mg(2R)$.

**9-3** At the top both the weight and the normal force point down, toward the centre: $N+mg=\frac{mv_\text{top}^2}{R}=\frac{2mg(h-2R)}{R}$. So $N=mg\left(\frac{2h}{R}-4-1\right)$.

**9-4** The block stays on while $N\ge0$: $\frac{2h}{R}\ge5$.

**9-5** At the bottom $v^2=2gh=5gR$. The normal force points up, toward the centre: $N-mg=\frac{m\cdot5gR}{R}$, so $N=6mg$.`,
      },
      {
        no: '10', topic: 'A block and a spring · Ch. 7–8', fig: 'b-10',
        stem: R`A block of mass $m$ slides at speed $v_0$ on a frictionless floor into a spring of spring constant $k$ fixed to a wall (Figure B10).`,
        parts: [
          R`Find the maximum compression of the spring.`,
          R`Find the work done by the spring on the block from first contact to maximum compression.`,
          R`At what compression is the block's speed half of $v_0$?`,
          R`At that moment, at what rate is the spring doing work on the block?`,
        ],
        answer: [
          R`$x_\text{max}=v_0\sqrt{\frac{m}{k}}$`, R`$W=-\frac{1}{2}mv_0^2$`, R`$x=\frac{\sqrt{3}}{2}v_0\sqrt{\frac{m}{k}}$`,
          R`$P=-\frac{\sqrt{3}}{4}v_0^2\sqrt{km}$: the spring takes energy at the rate $\frac{\sqrt{3}}{4}v_0^2\sqrt{km}$`,
        ],
        sol: R`**10-1** All the kinetic energy goes into the spring: $\frac{1}{2}kx_\text{max}^2=\frac{1}{2}mv_0^2$.

**10-2** Work–energy theorem: the block goes from $\frac{1}{2}mv_0^2$ to $0$, so the spring's work is $-\frac{1}{2}mv_0^2$. **Check** $W=-\int_0^{x_\text{max}}kx\,dx=-\frac{1}{2}kx_\text{max}^2$.

**10-3** $\frac{1}{2}kx^2=\frac{1}{2}mv_0^2-\frac{1}{2}m\left(\frac{v_0}{2}\right)^2=\frac{3}{8}mv_0^2$, so $x^2=\frac{3mv_0^2}{4k}$.

**10-4** Power is force times velocity. The spring pushes back with $kx$ while the block moves forward at $\frac{v_0}{2}$: $P=-kx\cdot\frac{v_0}{2}=-k\cdot\frac{\sqrt{3}}{2}v_0\sqrt{\frac{m}{k}}\cdot\frac{v_0}{2}=-\frac{\sqrt{3}}{4}v_0^2\sqrt{km}$.`,
      },
    ],
  },
  // =====================================================================================================================
  {
    id: 'pc', seg: 'Set C', title: 'Practice Set C', sub: 'New problems · Chapters 1–8', added: '2026-11-01', focus: FOCUS,
    problems: [
      {
        no: '0', topic: WARMUP,
        parts: [
          R`An elevator is at height $12$ m at $t=2$ s and at $30$ m at $t=8$ s. Find its average velocity.`,
          R`On a position–time graph, what gives the instantaneous velocity, and what gives the average velocity?`,
          R`A bicycle's velocity is $8$ m/s at $t=0$ and $2$ m/s at $t=3$ s. Find its average acceleration.`,
          R`Write the velocity $v(t)$ in terms of the acceleration $a(t)$ and the velocity $v_0$ at $t=0$.`,
          R`$0.0450+2.3$: give the result to the correct precision.`,
          R`$0.0450\times2.3$: give the result to the correct number of significant figures.`,
          R`Find the unit vector of $\vec{r}=(r\cos\theta,\,r\sin\theta)$, where $r>0$.`,
          R`Write the joule, the unit of work and energy, in SI base units.`,
          R`A particle's position is $x=4+6t^2-t^4$ (SI units). Find its velocity.`,
          R`For the same particle, find its acceleration, and when the acceleration is zero ($t>0$).`,
          R`Two non-zero vectors have $\vec{A}\cdot\vec{B}=0$. What does that tell you?`,
          R`Two non-zero vectors have $\vec{A}\times\vec{B}=\vec{0}$. What does that tell you?`,
        ],
        answer: [
          R`$3$ m/s, upward`, R`Instantaneous: the slope of the tangent; average: the slope of the secant between two points`, R`$-2$ m/s²`,
          R`$v(t)=v_0+\int_0^t a\,dt'$, the area under the $a$–$t$ plot`, R`$2.3$`, R`$0.10$`, R`$(\cos\theta,\,\sin\theta)$`,
          R`$1\text{ J}=1\text{ N}\cdot\text{m}=1\text{ kg}\cdot\text{m}^2/\text{s}^2$`, R`$v=12t-4t^3$`, R`$a=12-12t^2$; zero at $t=1$ s`,
          R`They are perpendicular`, R`They are parallel or antiparallel`,
        ],
        sol: R`**0-1** $\frac{30-12}{8-2}=\frac{18}{6}=3$ m/s, upward.

**0-2** The tangent at one instant gives $\frac{dx}{dt}$; the secant through two points gives $\frac{\Delta x}{\Delta t}$ over that interval.

**0-3** $\frac{2-8}{3-0}=-2$ m/s²: the bicycle is slowing down.

**0-4** Integrate $a=\frac{dv}{dt}$ from $0$ to $t$.

**0-5** $0.0450+2.3=2.3450$. $2.3$ is known only to $0.1$, so the sum is $2.3$.

**0-6** $0.0450\times2.3=0.1035$. $2.3$ has two significant figures, so the product is $0.10$.

**0-7** $|\vec{r}|=\sqrt{r^2\cos^2\theta+r^2\sin^2\theta}=r$; divide by it.

**0-8** Work is force times distance: $\text{kg}\cdot\text{m/s}^2\times\text{m}$. Mass, length and time again.

**0-9** $v=\frac{dx}{dt}=12t-4t^3$.

**0-10** $a=\frac{dv}{dt}=12-12t^2$, zero at $t=1$ s for $t>0$.

**0-11** $|\vec{A}||\vec{B}|\cos\phi=0$ with both lengths non-zero means $\cos\phi=0$: $\phi=90^\circ$.

**0-12** $|\vec{A}\times\vec{B}|=|\vec{A}||\vec{B}|\sin\phi=0$ means $\phi=0$ or $180^\circ$.`,
      },
      {
        no: '1', topic: 'Projection, cross product and area · Ch. 3',
        stem: R`Two vectors are given by $\vec{A}=3\hat{i}+4\hat{j}$ and $\vec{B}=2\hat{i}-\hat{j}+2\hat{k}$.`,
        parts: [
          R`Find $|\vec{A}|$ and $|\vec{B}|$.`,
          R`Find $\vec{A}\cdot\vec{B}$.`,
          R`Find the component of $\vec{A}$ along the direction of $\vec{B}$.`,
          R`Find $\vec{A}\times\vec{B}$.`,
          R`Find the area of the parallelogram with sides $\vec{A}$ and $\vec{B}$.`,
        ],
        answer: [R`$5$ and $3$`, R`$2$`, R`$\frac{2}{3}$`, R`$8\hat{i}-6\hat{j}-11\hat{k}$`, R`$\sqrt{221}$`],
        sol: R`**1-1** $|\vec{A}|=\sqrt{9+16}=5$ and $|\vec{B}|=\sqrt{4+1+4}=3$.

**1-2** $(3)(2)+(4)(-1)+(0)(2)=6-4=2$.

**1-3** Project onto the unit vector $\hat{B}$: $\vec{A}\cdot\hat{B}=\frac{\vec{A}\cdot\vec{B}}{|\vec{B}|}=\frac{2}{3}$.

**1-4** With $A_z=0$:
- $\hat{i}$: $A_yB_z-A_zB_y=(4)(2)-0=8$
- $\hat{j}$: $A_zB_x-A_xB_z=0-(3)(2)=-6$
- $\hat{k}$: $A_xB_y-A_yB_x=(3)(-1)-(4)(2)=-11$

**1-5** The area is $|\vec{A}\times\vec{B}|=\sqrt{64+36+121}=\sqrt{221}$. **Check** $|\vec{A}|^2|\vec{B}|^2-(\vec{A}\cdot\vec{B})^2=225-4=221$.`,
      },
      {
        no: '2', topic: 'A puck with constant acceleration · Ch. 4',
        stem: R`A puck on ice starts at the origin with velocity $\vec{v}_0=4\hat{i}+2\hat{j}$ (m/s), and a steady wind gives it a constant acceleration $\vec{a}=-2\hat{i}+\hat{j}$ (m/s²). The $x$- and $y$-axes lie on the ice.`,
        parts: [
          R`Write $\vec{r}(t)$.`,
          R`Write $\vec{v}(t)$.`,
          R`When does the puck reach its largest $x$, and where is it then?`,
          R`Find its speed at that moment.`,
          R`At what time is the velocity perpendicular to the acceleration? What is special about the speed then?`,
        ],
        answer: [
          R`$\vec{r}=(4t-t^2)\,\hat{i}+\left(2t+\frac{1}{2}t^2\right)\hat{j}$ (m)`, R`$\vec{v}=(4-2t)\,\hat{i}+(2+t)\,\hat{j}$ (m/s)`,
          R`At $t=2$ s, at $(4,\,6)$ m`, R`$4$ m/s`, R`At $t=\frac{6}{5}$ s; the speed is smallest then, $\frac{8}{\sqrt{5}}\approx3.6$ m/s`,
        ],
        sol: R`**2-1** Each component moves with constant acceleration: $x=4t+\frac{1}{2}(-2)t^2$ and $y=2t+\frac{1}{2}(1)t^2$.

**2-2** Differentiate, or use $\vec{v}=\vec{v}_0+\vec{a}t$.

**2-3** $x$ is largest when $v_x=4-2t=0$, at $t=2$ s: $x=8-4=4$ m and $y=4+2=6$ m.

**2-4** At $t=2$ s, $\vec{v}=0\,\hat{i}+4\hat{j}$, so the speed is $4$ m/s.

**2-5** $\vec{v}\cdot\vec{a}=-2(4-2t)+(2+t)=5t-6=0$ at $t=\frac{6}{5}$ s. Before then part of the acceleration opposes the velocity and the puck slows; after, it speeds up. So the speed is smallest there: $\vec{v}=1.6\,\hat{i}+3.2\,\hat{j}$, and $|\vec{v}|=\frac{8}{\sqrt{5}}$ m/s.`,
      },
      {
        no: '3', topic: 'Two balls meeting in the air · Ch. 2', fig: 'c-3',
        stem: R`Ball 1 is dropped from rest from the top of a tower of height $H$. At the same instant, ball 2 is thrown straight up from the ground directly below, with speed $v_0$ (Figure C3). Take $y$ upward from the ground and ignore air.`,
        parts: [
          R`Write $y_1(t)$ and $y_2(t)$.`,
          R`When do the balls meet?`,
          R`At what height do they meet?`,
          R`What is the smallest $v_0$ for which they meet before ball 1 reaches the ground?`,
          R`If $v_0=\sqrt{gH}$, is ball 2 moving up or down when they meet?`,
        ],
        answer: [
          R`$y_1=H-\frac{1}{2}gt^2$; $\ y_2=v_0t-\frac{1}{2}gt^2$`, R`$t=\frac{H}{v_0}$`, R`$y=H-\frac{gH^2}{2v_0^2}$`, R`$v_0=\sqrt{\frac{gH}{2}}$`,
          R`Neither: it is at its highest point, momentarily at rest, at height $\frac{H}{2}$`,
        ],
        sol: R`**3-1** Both fall with acceleration $-g$; ball 1 starts at $H$ from rest, ball 2 at $0$ with $v_0$.

**3-2** $y_1=y_2$: the $-\frac{1}{2}gt^2$ terms cancel, leaving $H=v_0t$. Gravity pulls both down by the same amount, so it is as if both moved at constant velocity.

**3-3** $y_1\left(\frac{H}{v_0}\right)=H-\frac{1}{2}g\frac{H^2}{v_0^2}$.

**3-4** The meeting height must be at least $0$: $H\ge\frac{gH^2}{2v_0^2}$, so $v_0^2\ge\frac{gH}{2}$.

**3-5** They meet at $t=\frac{H}{\sqrt{gH}}=\sqrt{\frac{H}{g}}$. Ball 2's velocity then is $v_0-gt=\sqrt{gH}-\sqrt{gH}=0$: the top of its flight, at height $H-\frac{H}{2}=\frac{H}{2}$.`,
      },
      {
        no: '4', topic: 'The Atwood machine; static friction · Ch. 5–6', fig: ['c-4', 'c-44'],
        stem: R`Two blocks of masses $m_1$ and $m_2$, with $m_1>m_2$, hang on either side of a massless, frictionless pulley (an Atwood machine, Figure C4).`,
        parts: [
          R`Write Newton's second law for each block.`,
          R`Find the acceleration and the tension.`,
          R`Starting from rest, how far does $m_1$ fall in time $t$?`,
          R`A block of mass $M$ on a rough table is tied over a pulley at the edge to a hanging block of mass $m$ (Figure C4-4), and nothing moves. Find the friction force on $M$, and the smallest coefficient of static friction $\mu_s$ for which this is possible.`,
        ],
        answer: [
          R`$m_1$, downward: $m_1g-T=m_1a$; $\ m_2$, upward: $T-m_2g=m_2a$`,
          R`$a=\frac{m_1-m_2}{m_1+m_2}g$; $\ T=\frac{2m_1m_2}{m_1+m_2}g$`,
          R`$\frac{1}{2}at^2=\frac{(m_1-m_2)gt^2}{2(m_1+m_2)}$`,
          R`$f_s=mg$, pointing away from the pulley; $\ \mu_s\ge\frac{m}{M}$`,
        ],
        sol: R`**4-1** The heavier block goes down and the lighter one up, with the same $a$; the string has one tension $T$.

**4-2** Add the equations: $(m_1-m_2)g=(m_1+m_2)a$. Then $T=m_2(g+a)=m_2g\cdot\frac{2m_1}{m_1+m_2}$. **Check** $m_2g<T<m_1g$.

**4-3** Constant acceleration from rest: $d=\frac{1}{2}at^2$.

**4-4** At rest, the hanging block is in equilibrium, so the tension is $mg$. On $M$, static friction balances it: $f_s=mg$, away from the pulley. Static friction can give at most $\mu_sMg$, so $mg\le\mu_sMg$, that is $\mu_s\ge\frac{m}{M}$.`,
      },
      {
        no: '5', topic: 'Held on a slope by a horizontal force · Ch. 5–6', fig: 'c-5',
        stem: R`A block of mass $m$ on a slope at angle $\theta$ is held at rest by a horizontal force $F$ that pushes it toward the slope (Figure C5).`,
        parts: [
          R`The slope is frictionless. Find $F$.`,
          R`Find the normal force in that case.`,
          R`Now the slope is rough, with coefficient of static friction $\mu_s$. Find the smallest horizontal $F$ that stops the block sliding down.`,
          R`Find the largest horizontal $F$ before the block starts to slide up.`,
        ],
        answer: [
          R`$F=mg\tan\theta$`, R`$N=\frac{mg}{\cos\theta}$`, R`$F_\text{min}=\frac{mg(\sin\theta-\mu_s\cos\theta)}{\cos\theta+\mu_s\sin\theta}$`,
          R`$F_\text{max}=\frac{mg(\sin\theta+\mu_s\cos\theta)}{\cos\theta-\mu_s\sin\theta}$, if $\mu_s\tan\theta<1$`,
        ],
        sol: R`**Axes** Along the slope (up positive) and perpendicular to it. The horizontal $F$ has $F\cos\theta$ up the slope and $F\sin\theta$ into the slope; gravity has $mg\sin\theta$ down the slope and $mg\cos\theta$ into it.

**5-1** Along the slope: $F\cos\theta=mg\sin\theta$.

**5-2** Perpendicular: $N=mg\cos\theta+F\sin\theta=mg\cos\theta+mg\frac{\sin^2\theta}{\cos\theta}=\frac{mg}{\cos\theta}$.

**5-3** About to slide down, static friction $\mu_sN$ helps $F$ up the slope: $F\cos\theta+\mu_s(mg\cos\theta+F\sin\theta)=mg\sin\theta$.

**5-4** About to slide up, friction points down the slope: $F\cos\theta=mg\sin\theta+\mu_s(mg\cos\theta+F\sin\theta)$. If $\mu_s\tan\theta\ge1$, no horizontal push can move the block up.`,
      },
      {
        no: '6', topic: 'A projectile in 3D, with a side wind · Ch. 4, 7',
        stem: R`Take $x$ horizontal, $y$ vertically up and $z$ horizontal, a right-handed system. A ball of mass $m$ is launched from the origin, on the ground, with velocity $(v_0,\,v_0,\,0)$. While it flies, a steady side wind pushes it with a constant force $(0,\,0,\,0.1mg)$. Ignore any other effect of the air.`,
        parts: [
          R`Find the acceleration vector.`,
          R`Find the time of flight.`,
          R`Find the landing point $(x,\,z)$.`,
          R`Find the velocity at landing.`,
          R`Find the speed at landing, and check it with the work–energy theorem.`,
        ],
        answer: [
          R`$\vec{a}=(0,\,-g,\,0.1g)$`, R`$t=\frac{2v_0}{g}$`, R`$\left(\frac{2v_0^2}{g},\,\frac{v_0^2}{5g}\right)$`, R`$(v_0,\,-v_0,\,0.2v_0)$`,
          R`$\frac{\sqrt{51}}{5}v_0\approx1.43v_0$`,
        ],
        sol: R`**6-1** Net force: gravity $(0,-mg,0)$ plus the wind $(0,0,0.1mg)$. Divide by $m$.

**6-2** The vertical motion ignores the wind: $y=v_0t-\frac{1}{2}gt^2=0$ at $t=\frac{2v_0}{g}$.

**6-3** $x=v_0t=\frac{2v_0^2}{g}$. Sideways the ball starts from rest: $z=\frac{1}{2}(0.1g)t^2=0.05g\cdot\frac{4v_0^2}{g^2}=\frac{v_0^2}{5g}$.

**6-4** $v_x=v_0$, $v_y=v_0-gt=-v_0$ and $v_z=0.1g\cdot\frac{2v_0}{g}=0.2v_0$.

**6-5** $|\vec{v}|=v_0\sqrt{1+1+0.04}=v_0\sqrt{2.04}=\frac{\sqrt{51}}{5}v_0$. **Check** Gravity does no net work, since the ball lands at its launch height; the wind does $0.1mg\cdot\frac{v_0^2}{5g}=0.02mv_0^2$. The kinetic energy grows by $\frac{1}{2}m(2.04-2)v_0^2=0.02mv_0^2$.`,
      },
      {
        no: '7', topic: 'Over a hill; a vertical circle · Ch. 6, 8',
        stem: R`A car of mass $M$ drives at constant speed $v$ over the top of a hill whose top is a circular arc of radius $R$.`,
        parts: [
          R`Write Newton's second law for the car at the top of the hill.`,
          R`Find the normal force.`,
          R`Find the greatest speed at which the car stays on the road at the top.`,
          R`A ball of mass $m$ on a string of length $L$ moves in a vertical circle. Find its smallest speed at the top for which the string stays taut.`,
          R`With that speed at the top, find the tension when the string is horizontal.`,
        ],
        answer: [R`Toward the centre (down): $Mg-N=\frac{Mv^2}{R}$`, R`$N=M\left(g-\frac{v^2}{R}\right)$`, R`$v_\text{max}=\sqrt{gR}$`, R`$v_\text{top}=\sqrt{gL}$`, R`$T=3mg$`],
        sol: R`**7-1** At the top the centre of the arc is straight below. The weight points down, toward it, and the normal force up; their difference is the centripetal force.

**7-2** Solve for $N$. The car feels lighter going over the top.

**7-3** It leaves the road when $N$ would be negative: $g-\frac{v^2}{R}\ge0$.

**7-4** At the top, $T+mg=\frac{mv^2}{L}$, and the string stays taut while $T\ge0$: $v^2\ge gL$.

**7-5** Energy from the top down to the side, $L$ lower: $v^2=gL+2gL=3gL$. With the string horizontal, gravity acts along the path, so only the tension points to the centre: $T=\frac{mv^2}{L}=3mg$.`,
      },
      {
        no: '8', topic: 'A pendulum released from horizontal · Ch. 6, 8', fig: 'c-8',
        stem: R`A small ball of mass $m$ hangs on a string of length $L$. It is pulled aside until the string is horizontal and released from rest (Figure C8).`,
        parts: [
          R`Find the speed at the lowest point.`,
          R`Find the tension at the lowest point.`,
          R`When the string makes angle $\theta$ below the horizontal, find the speed and the tension.`,
          R`The string breaks if its tension reaches $2mg$. At what angle does it break?`,
        ],
        answer: [R`$\sqrt{2gL}$`, R`$3mg$`, R`$v=\sqrt{2gL\sin\theta}$; $\ T=3mg\sin\theta$`, R`At $\sin\theta=\frac{2}{3}$, about $42^\circ$ below the horizontal`],
        sol: R`**8-1** The ball drops $L$: $\frac{1}{2}mv^2=mgL$.

**8-2** At the bottom the tension points up, to the centre: $T-mg=\frac{mv^2}{L}=2mg$.

**8-3** At angle $\theta$ the ball has dropped $L\sin\theta$, so $v^2=2gL\sin\theta$. Toward the pivot, the tension and the part of the weight along the string, $mg\sin\theta$, give the centripetal force: $T-mg\sin\theta=\frac{mv^2}{L}=2mg\sin\theta$.

**8-4** $3mg\sin\theta=2mg$ gives $\sin\theta=\frac{2}{3}$. **Check** at the bottom, $\theta=90^\circ$ gives $3mg$, as in 8-2.`,
      },
      {
        no: '9', topic: 'Work on a rough slope · Ch. 7', fig: 'c-9',
        stem: R`A block of mass $m$ starts from rest and slides a distance $d$ down a rough slope at angle $\theta$, with coefficient of kinetic friction $\mu_k$ (Figure C9).`,
        parts: [
          R`Find the work done by gravity.`,
          R`Find the work done by the normal force.`,
          R`Find the work done by friction.`,
          R`Use the work–energy theorem to find the speed after the distance $d$.`,
          R`Find the average power delivered by gravity over this slide.`,
        ],
        answer: [
          R`$W_g=mgd\sin\theta$`, R`$0$`, R`$W_f=-\mu_kmgd\cos\theta$`, R`$v=\sqrt{2gd(\sin\theta-\mu_k\cos\theta)}$`,
          R`$\bar{P}=\frac{1}{2}mg\sin\theta\,\sqrt{2gd(\sin\theta-\mu_k\cos\theta)}$`,
        ],
        sol: R`**9-1** Gravity's part along the slope, $mg\sin\theta$, acts along the motion for the distance $d$. Equivalently, the block drops a height $d\sin\theta$.

**9-2** The normal force is perpendicular to the motion.

**9-3** Friction $\mu_kN=\mu_kmg\cos\theta$ acts against the motion.

**9-4** $\frac{1}{2}mv^2=W_g+W_N+W_f=mgd(\sin\theta-\mu_k\cos\theta)$.

**9-5** Average power is work over time. The acceleration is constant, so the average speed is half the final speed: $\bar{P}=mg\sin\theta\cdot\frac{v}{2}$.`,
      },
      {
        no: '10', topic: 'A vertical spring launcher · Ch. 8', fig: 'c-10',
        stem: R`A vertical spring of spring constant $k$ is compressed by $d$ and launches a ball of mass $m$ straight up from rest (Figure C10). The ball leaves the spring where the spring reaches its natural length. Measure heights from the ball's starting point, and ignore air.`,
        parts: [
          R`Find the ball's speed when it leaves the spring.`,
          R`Find the greatest height the ball reaches.`,
          R`At what height is the ball fastest?`,
          R`Find that greatest speed.`,
        ],
        answer: [
          R`$v=\sqrt{\frac{kd^2}{m}-2gd}$`, R`$y_\text{max}=\frac{kd^2}{2mg}$`, R`At $y=d-\frac{mg}{k}$, where the spring force equals the weight`,
          R`$v_\text{max}=\left(d-\frac{mg}{k}\right)\sqrt{\frac{k}{m}}$`,
        ],
        sol: R`**10-1** The spring energy becomes kinetic energy and height $d$: $\frac{1}{2}kd^2=\frac{1}{2}mv^2+mgd$.

**10-2** At the top all of it is gravitational: $\frac{1}{2}kd^2=mgy_\text{max}$.

**10-3** The ball speeds up while the spring pushes harder than gravity pulls, and slows after that. The change comes where $kx=mg$, with the spring still compressed by $x=\frac{mg}{k}$, at height $d-\frac{mg}{k}$.

**10-4** Energy there: $\frac{1}{2}kd^2=\frac{1}{2}mv^2+mg\left(d-\frac{mg}{k}\right)+\frac{1}{2}k\left(\frac{mg}{k}\right)^2$. Simplifying gives $v^2=\frac{k}{m}\left(d-\frac{mg}{k}\right)^2$.`,
      },
    ],
  },
];
