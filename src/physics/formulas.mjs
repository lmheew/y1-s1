// The Formulas tab: the formulas of Chapters 1–8 of Fundamentals of Physics (Halliday, Resnick, Walker), module by
// module, each marked by importance, then helpful extras that the book doesn't print as formulas (results of common
// setups and shortcuts). Every row is checked numerically in verify_formulas.py, most of them by evaluating this TeX,
// so a new row needs a check there too (the script fails on a row without one).
//
// A group is a chapter (`id` matches content.mjs). `mods` follow the book's modules (titles in content.mjs); a row is
// [name, TeX, stars, note]: stars 3 (core, used all the time), 2 (key result) or 1 (supporting); the note is optional
// markup ($…$ allowed). `extra` rows are [name, TeX, note]. TeX is drawn full size (\displaystyle).
const R = String.raw;
export const FORMULAS_ADDED = '2026-11-02';

// the special angles, for a calculator-free exam (37° and 53°: the 3-4-5 triangle, as exam papers give them)
export const trig = {
  angles: [[R`0^\circ`, '0'], [R`30^\circ`, 'π/6'], [R`37^\circ`, '3-4-5'], [R`45^\circ`, 'π/4'], [R`53^\circ`, '3-4-5'], [R`60^\circ`, 'π/3'], [R`90^\circ`, 'π/2']],
  rows: [
    [R`\sin`, ['0', R`\frac{1}{2}`, R`\approx0.6`, R`\frac{\sqrt{2}}{2}`, R`\approx0.8`, R`\frac{\sqrt{3}}{2}`, '1']],
    [R`\cos`, ['1', R`\frac{\sqrt{3}}{2}`, R`\approx0.8`, R`\frac{\sqrt{2}}{2}`, R`\approx0.6`, R`\frac{1}{2}`, '0']],
    [R`\tan`, ['0', R`\frac{\sqrt{3}}{3}`, R`\approx\frac{3}{4}`, '1', R`\approx\frac{4}{3}`, R`\sqrt{3}`, null]],
  ],
};

// constants used in every chapter
export const constants = [
  ['Free-fall acceleration', R`g=9.8\ \text{m/s}^2`, 3, R`Near Earth’s surface. It is a positive number; the direction goes in the sign of $a$.`],
  ['Speed of light', R`c=299\,792\,458\ \text{m/s}`, 1, 'Exact: it defines the metre.'],
  ['Atomic mass unit', R`1\ \text{u}=1.66\times10^{-27}\ \text{kg}`, 1],
  ['Speed units', R`1\ \text{m/s}=3.6\ \text{km/h}`, 'x', R`Divide a speed in km/h by $3.6$ to get m/s.`],
];

export const fgroups = [
  // ===================================================================================================================
  { id: 'c1', mods: [
    { no: '1-1', rows: [
      ['SI base units of mechanics', R`\text{length: m},\quad\text{mass: kg},\quad\text{time: s}`, 3, 'Every other unit in Chapters 1–8 is made of these three.'],
      ['Large prefixes', R`\text{k}=10^{3},\quad\text{M}=10^{6},\quad\text{G}=10^{9},\quad\text{T}=10^{12}`, 2],
      ['Small prefixes', R`\text{c}=10^{-2},\ \ \text{m}=10^{-3},\ \ \mu=10^{-6},\ \ \text{n}=10^{-9},\ \ \text{p}=10^{-12}`, 2],
      ['Scientific notation', R`a\times10^{n},\quad 1\le|a|<10`, 1, 'One digit before the decimal point, times a power of ten.'],
      ['Conversion factor', R`\frac{1\ \text{min}}{60\ \text{s}}=1=\frac{60\ \text{s}}{1\ \text{min}}`, 3, R`Multiply by factors equal to $1$ so the unwanted unit cancels: chain-link conversion.`],
      ['Sums and differences', R`\text{keep the fewest decimal places}`, 2, 'The result is only as precise as the least precise number.'],
      ['Products and quotients', R`\text{keep the fewest significant figures}`, 2, 'Leading zeros don’t count as significant figures; trailing zeros after a decimal point do.'],
      ['The metre', R`1\ \text{m}=\text{the distance light travels in}\ \frac{1}{299\,792\,458}\ \text{s}`, 1],
    ]},
    { no: '1-2', rows: [
      ['The second', R`1\ \text{s}=9\,192\,631\,770\ \text{oscillations of a cesium-133 clock}`, 1],
    ]},
    { no: '1-3', rows: [
      ['Atomic mass unit', R`1\ \text{u}=1.660\,538\,86\times10^{-27}\ \text{kg}`, 1, R`A carbon-12 atom is exactly $12$ u.`],
      ['Density', R`\rho=\frac{m}{V}`, 3, R`Mass per unit volume, in $\text{kg/m}^3$.`],
    ]},
  ], extra: [
    ['Area and volume units', R`1\ \text{m}^2=10^{4}\ \text{cm}^2,\quad 1\ \text{m}^3=10^{6}\ \text{cm}^3=10^{3}\ \text{L}`, R`Square or cube the length factor: $1\text{ cm}^3=(10^{-2}\text{ m})^3$.`],
    ['Density units', R`1\ \text{g/cm}^3=10^{3}\ \text{kg/m}^3`, R`Water is about $1$ g/cm³.`],
    ['Atoms in a sample', R`N=\frac{M_\text{sample}}{m_\text{atom}}`],
    ['Units of a result', R`[F]=\text{kg}\cdot\text{m/s}^2,\quad [E]=\text{kg}\cdot\text{m}^2/\text{s}^2,\quad [P]=\text{kg}\cdot\text{m}^2/\text{s}^3`, 'Both sides of an equation must have the same units: a quick check.'],
  ]},
  // ===================================================================================================================
  { id: 'c2', mods: [
    { no: '2-1', rows: [
      ['Displacement', R`\Delta x=x_2-x_1`, 3, R`It has a sign: $+$ or $-$ gives the direction.`],
      ['Average velocity', R`v_\text{avg}=\frac{\Delta x}{\Delta t}=\frac{x_2-x_1}{t_2-t_1}`, 3, R`The slope of the secant on the $x$–$t$ graph.`],
      ['Average speed', R`s_\text{avg}=\frac{\text{total distance}}{\Delta t}`, 2, 'Never negative.'],
    ]},
    { no: '2-2', rows: [
      ['Velocity', R`v=\lim_{\Delta t\to0}\frac{\Delta x}{\Delta t}=\frac{dx}{dt}`, 3, R`The slope of the tangent on the $x$–$t$ graph.`],
      ['Speed', R`\text{speed}=|v|`, 2],
    ]},
    { no: '2-3', rows: [
      ['Average acceleration', R`a_\text{avg}=\frac{\Delta v}{\Delta t}=\frac{v_2-v_1}{t_2-t_1}`, 2],
      ['Acceleration', R`a=\frac{dv}{dt}=\frac{d^2x}{dt^2}`, 3, R`The slope of the $v$–$t$ graph.`],
    ]},
    { no: '2-4', rows: [
      ['Velocity (no x − x₀)', R`v=v_0+at`, 3, R`Eq. 2-11. The five equations hold only when $a$ is constant.`],
      ['Position (no v)', R`x-x_0=v_0t+\frac{1}{2}at^2`, 3, 'Eq. 2-15.'],
      ['No time', R`v^2=v_0^2+2a(x-x_0)`, 3, 'Eq. 2-16.'],
      ['No acceleration', R`x-x_0=\frac{1}{2}(v_0+v)\,t`, 2, 'Eq. 2-17.'],
      ['No v₀', R`x-x_0=vt-\frac{1}{2}at^2`, 2, 'Eq. 2-18.'],
      ['Average velocity', R`v_\text{avg}=\frac{1}{2}(v_0+v)`, 2, 'For constant acceleration only.'],
    ]},
    { no: '2-5', rows: [
      ['Free fall', R`a=-g,\quad g=9.8\ \text{m/s}^2`, 3, R`With $y$ up. Mass doesn’t matter, and air is ignored.`],
      ['Velocity', R`v=v_0-gt`, 3],
      ['Height', R`y-y_0=v_0t-\frac{1}{2}gt^2`, 3],
      ['No time', R`v^2=v_0^2-2g(y-y_0)`, 3],
    ]},
    { no: '2-6', rows: [
      ['Velocity from acceleration', R`v_1-v_0=\int_{t_0}^{t_1}a\,dt`, 2, R`The area under the $a$–$t$ graph.`],
      ['Position from velocity', R`x_1-x_0=\int_{t_0}^{t_1}v\,dt`, 2, R`The area under the $v$–$t$ graph.`],
    ]},
  ], extra: [
    ['Speeding up or slowing down', R`va>0:\ \text{speeding up},\qquad va<0:\ \text{slowing down}`],
    ['Thrown up: time to the top', R`t_\text{top}=\frac{v_0}{g}`],
    ['Thrown up: greatest height', R`H=\frac{v_0^2}{2g}`],
    ['Thrown up: back down', R`t=\frac{2v_0}{g},\quad v=-v_0`, 'Back at the launch height, with the launch speed pointing down.'],
    ['Dropped from a height h', R`t=\sqrt{\frac{2h}{g}},\quad v=\sqrt{2gh}`],
    ['Stopping distance', R`d=\frac{v_0^2}{2a}`, R`$a$ is the size of the deceleration.`],
    ['Velocity at mid-time', R`v\left(\tfrac{t_1+t_2}{2}\right)=v_\text{avg}`, 'Constant acceleration: the average over an interval is the velocity at its middle moment.'],
  ]},
  // ===================================================================================================================
  { id: 'c3', mods: [
    { no: '3-1', rows: [
      ['Components', R`a_x=a\cos\theta,\quad a_y=a\sin\theta`, 3, R`$\theta$ is measured counterclockwise from the $+x$-axis.`],
      ['Magnitude and angle', R`a=\sqrt{a_x^2+a_y^2},\quad \tan\theta=\frac{a_y}{a_x}`, 3],
      ['Order of addition', R`\vec{a}+\vec{b}=\vec{b}+\vec{a}`, 1],
      ['Grouping', R`(\vec{a}+\vec{b})+\vec{c}=\vec{a}+(\vec{b}+\vec{c})`, 1],
      ['Subtraction', R`\vec{b}-\vec{a}=\vec{b}+(-\vec{a})`, 1],
    ]},
    { no: '3-2', rows: [
      ['Unit-vector notation', R`\vec{a}=a_x\hat{i}+a_y\hat{j}+a_z\hat{k}`, 3],
      ['Adding by components', R`\vec{r}=\vec{a}+\vec{b}:\quad r_x=a_x+b_x,\ \ r_y=a_y+b_y,\ \ r_z=a_z+b_z`, 3],
    ]},
    { no: '3-3', rows: [
      ['Scalar times vector', R`s\vec{a}=sa_x\hat{i}+sa_y\hat{j}+sa_z\hat{k}`, 1, R`Length times $|s|$; the direction flips when $s<0$.`],
      ['Dot product', R`\vec{a}\cdot\vec{b}=ab\cos\phi`, 3, R`A scalar; $\phi$ is the angle between the vectors.`],
      ['Dot product by components', R`\vec{a}\cdot\vec{b}=a_xb_x+a_yb_y+a_zb_z`, 3],
      ['Order of a dot product', R`\vec{a}\cdot\vec{b}=\vec{b}\cdot\vec{a}`, 1],
      ['Unit vectors, dot', R`\hat{i}\cdot\hat{i}=\hat{j}\cdot\hat{j}=\hat{k}\cdot\hat{k}=1,\quad \hat{i}\cdot\hat{j}=\hat{j}\cdot\hat{k}=\hat{k}\cdot\hat{i}=0`, 2],
      ['Cross product, size', R`|\vec{a}\times\vec{b}|=ab\sin\phi`, 3, 'A vector perpendicular to both, by the right-hand rule.'],
      ['Order of a cross product', R`\vec{b}\times\vec{a}=-(\vec{a}\times\vec{b})`, 2],
      ['Cross product by components', R`\begin{aligned}\vec{a}\times\vec{b}=\ &(a_yb_z-b_ya_z)\,\hat{i}\\&+(a_zb_x-b_za_x)\,\hat{j}\\&+(a_xb_y-b_xa_y)\,\hat{k}\end{aligned}`, 3],
      ['Cross product as a determinant', R`\vec{a}\times\vec{b}=\begin{vmatrix}\hat{i}&\hat{j}&\hat{k}\\a_x&a_y&a_z\\b_x&b_y&b_z\end{vmatrix}`, 3, R`Expand along the top row; the $\hat{j}$ term takes a minus sign.`],
      ['Unit vectors, cross', R`\hat{i}\times\hat{j}=\hat{k},\quad \hat{j}\times\hat{k}=\hat{i},\quad \hat{k}\times\hat{i}=\hat{j}`, 2, R`And $\hat{i}\times\hat{i}=\vec{0}$; the reverse order gives the minus.`],
    ]},
  ], extra: [
    ['Unit vector along a', R`\hat{a}=\frac{\vec{a}}{|\vec{a}|}`],
    ['Magnitude in 3D', R`|\vec{a}|=\sqrt{a_x^2+a_y^2+a_z^2}`],
    ['Angle between two vectors', R`\cos\phi=\frac{\vec{a}\cdot\vec{b}}{ab}`],
    ['Component of a along b', R`a_b=\vec{a}\cdot\hat{b}=\frac{\vec{a}\cdot\vec{b}}{b}`],
    ['Size of a sum', R`|\vec{a}+\vec{b}|^2=a^2+b^2+2ab\cos\phi`, 'The law of cosines in vector form.'],
    ['Areas', R`\text{parallelogram}=|\vec{a}\times\vec{b}|,\quad\text{triangle}=\frac{1}{2}|\vec{a}\times\vec{b}|`],
    ['Perpendicular or parallel', R`\vec{a}\cdot\vec{b}=0\iff\vec{a}\perp\vec{b},\qquad \vec{a}\times\vec{b}=\vec{0}\iff\vec{a}\parallel\vec{b}`, 'For non-zero vectors.'],
    ['Angle in the right quadrant', R`a_x<0:\quad \theta=\tan^{-1}\frac{a_y}{a_x}+180^\circ`, R`$\tan^{-1}$ only returns angles between $-90^\circ$ and $90^\circ$.`],
  ]},
  // ===================================================================================================================
  { id: 'c4', mods: [
    { no: '4-1', rows: [
      ['Position vector', R`\vec{r}=x\hat{i}+y\hat{j}+z\hat{k}`, 3],
      ['Displacement', R`\Delta\vec{r}=\vec{r}_2-\vec{r}_1=\Delta x\,\hat{i}+\Delta y\,\hat{j}+\Delta z\,\hat{k}`, 2],
    ]},
    { no: '4-2', rows: [
      ['Average velocity', R`\vec{v}_\text{avg}=\frac{\Delta\vec{r}}{\Delta t}`, 2],
      ['Velocity', R`\vec{v}=\frac{d\vec{r}}{dt}=v_x\hat{i}+v_y\hat{j}+v_z\hat{k}`, 3, 'Always tangent to the path.'],
      ['Velocity components', R`v_x=\frac{dx}{dt},\quad v_y=\frac{dy}{dt},\quad v_z=\frac{dz}{dt}`, 2],
    ]},
    { no: '4-3', rows: [
      ['Average acceleration', R`\vec{a}_\text{avg}=\frac{\Delta\vec{v}}{\Delta t}`, 2],
      ['Acceleration', R`\vec{a}=\frac{d\vec{v}}{dt}=a_x\hat{i}+a_y\hat{j}+a_z\hat{k}`, 3],
      ['Acceleration components', R`a_x=\frac{dv_x}{dt},\quad a_y=\frac{dv_y}{dt},\quad a_z=\frac{dv_z}{dt}`, 2],
    ]},
    { no: '4-4', rows: [
      ['Launch components', R`v_{0x}=v_0\cos\theta_0,\quad v_{0y}=v_0\sin\theta_0`, 3],
      ['Horizontal motion', R`x-x_0=(v_0\cos\theta_0)\,t`, 3, R`No horizontal acceleration: $v_x$ never changes.`],
      ['Vertical motion', R`y-y_0=(v_0\sin\theta_0)\,t-\frac{1}{2}gt^2`, 3],
      ['Vertical velocity', R`v_y=v_0\sin\theta_0-gt`, 3],
      ['Vertical velocity, no time', R`v_y^2=(v_0\sin\theta_0)^2-2g(y-y_0)`, 2],
      ['Path (trajectory)', R`y=(\tan\theta_0)\,x-\frac{gx^2}{2(v_0\cos\theta_0)^2}`, 2, 'Launched from the origin: a parabola.'],
      ['Horizontal range', R`R=\frac{v_0^2}{g}\sin2\theta_0`, 3, R`Only when it lands at the launch height; largest at $\theta_0=45^\circ$.`],
    ]},
    { no: '4-5', rows: [
      ['Centripetal acceleration', R`a=\frac{v^2}{r}`, 3, 'Points to the centre of the circle.'],
      ['Period', R`T=\frac{2\pi r}{v}`, 3, 'The time for one revolution.'],
    ]},
    { no: '4-6', rows: [
      ['Positions', R`x_{PA}=x_{PB}+x_{BA}`, 2, R`Particle $P$ seen from frames $A$ and $B$.`],
      ['Velocities', R`v_{PA}=v_{PB}+v_{BA}`, 3],
      ['Accelerations', R`a_{PA}=a_{PB}`, 2, R`When $B$ moves at constant velocity relative to $A$.`],
    ]},
    { no: '4-7', rows: [
      ['Position vectors', R`\vec{r}_{PA}=\vec{r}_{PB}+\vec{r}_{BA}`, 2],
      ['Velocity vectors', R`\vec{v}_{PA}=\vec{v}_{PB}+\vec{v}_{BA}`, 3],
      ['Acceleration vectors', R`\vec{a}_{PA}=\vec{a}_{PB}`, 2, 'Frames moving at constant velocity agree on accelerations.'],
    ]},
  ], extra: [
    ['Projectile: time to the top', R`t_\text{top}=\frac{v_0\sin\theta_0}{g}`],
    ['Projectile: greatest height', R`H=\frac{(v_0\sin\theta_0)^2}{2g}`, 'Above the launch point.'],
    ['Projectile: time of flight', R`T=\frac{2v_0\sin\theta_0}{g}`, 'Landing at the launch height.'],
    ['Same range', R`R(\theta_0)=R(90^\circ-\theta_0)`, 'Complementary launch angles land at the same spot.'],
    ['Angular speed', R`\omega=\frac{v}{r}=\frac{2\pi}{T},\quad a=\omega^2r`],
    ['Frequency', R`f=\frac{1}{T}`, 'Revolutions per second, in hertz.'],
    ['Circular motion in components', R`\vec{v}=v(-\sin\theta,\ \cos\theta),\quad \vec{a}=-\frac{v^2}{r}(\cos\theta,\ \sin\theta)`, R`Counterclockwise, at angle $\theta$ from $+x$.`],
    ['Heading straight across a river', R`t=\frac{w}{v_\text{boat}},\quad \text{drift}=v_\text{river}\,t`, R`$w$ is the width; the boat’s speed is relative to the water.`],
  ]},
  // ===================================================================================================================
  { id: 'c5', mods: [
    { no: '5-1', rows: [
      ['First law', R`\vec{F}_\text{net}=\vec{0}\ \Rightarrow\ \vec{v}\ \text{constant}`, 2, 'Holds in an inertial frame.'],
      ['Second law', R`\vec{F}_\text{net}=m\vec{a}`, 3],
      ['Second law by components', R`F_{\text{net},x}=ma_x,\quad F_{\text{net},y}=ma_y,\quad F_{\text{net},z}=ma_z`, 3],
      ['The newton', R`1\ \text{N}=1\ \text{kg}\cdot\text{m/s}^2`, 2],
    ]},
    { no: '5-2', rows: [
      ['Gravitational force', R`F_g=mg`, 3, 'Points straight down.'],
      ['Weight', R`W=mg`, 3, 'Measured from the ground, which is not accelerating.'],
      ['Normal force on a level floor', R`F_N=mg`, 2, 'Only with no other vertical forces and no vertical acceleration.'],
      ['Normal force, accelerating', R`F_N-mg=ma_y`, 2, 'The block on a floor accelerating vertically; up is positive.'],
    ]},
    { no: '5-3', rows: [
      ['Third law', R`\vec{F}_{BC}=-\vec{F}_{CB}`, 3, 'The two forces of a pair act on different bodies.'],
      ['Gravity on an incline', R`F_{g,\parallel}=mg\sin\theta,\quad F_{g,\perp}=mg\cos\theta`, 3, 'Along the slope and into it.'],
      ['Tension', R`T\ \text{is the same along a massless string}`, 2, 'Also over a massless, frictionless pulley.'],
    ]},
  ], extra: [
    ['Equilibrium', R`\sum F_x=0,\quad \sum F_y=0`],
    ['Frictionless incline', R`a=g\sin\theta,\quad F_N=mg\cos\theta`],
    ['Table and hanging block', R`a=\frac{m}{M+m}g,\quad T=\frac{Mm}{M+m}g`, R`Frictionless table; $M$ on it, $m$ hanging.`],
    ['Atwood machine', R`a=\frac{m_1-m_2}{m_1+m_2}g,\quad T=\frac{2m_1m_2}{m_1+m_2}g`, R`Two blocks over one pulley, $m_1>m_2$.`],
    ['Two blocks pushed together', R`a=\frac{F}{m_1+m_2},\quad F_\text{contact}=\frac{m_2}{m_1+m_2}F`, R`$F$ pushes block 1, which pushes block 2.`],
    ['Scale in an elevator', R`F_N=m(g+a)`, R`$a$ up is positive. Free fall ($a=-g$) reads zero.`],
    ['Pulling up at an angle', R`F_N=mg-F\sin\theta`, R`Pushing down at $\theta$ gives $mg+F\sin\theta$.`],
  ]},
  // ===================================================================================================================
  { id: 'c6', mods: [
    { no: '6-1', rows: [
      ['Static friction', R`f_s\le f_{s,\max}=\mu_sF_N`, 3, R`Only as large as needed; it reaches $\mu_sF_N$ when sliding is about to start.`],
      ['Kinetic friction', R`f_k=\mu_kF_N`, 3, R`Against the sliding; usually $\mu_k<\mu_s$.`],
    ]},
    { no: '6-2', rows: [
      ['Drag force', R`D=\frac{1}{2}C\rho Av^2`, 2, R`$C$ drag coefficient, $\rho$ air density, $A$ cross-sectional area.`],
      ['Terminal speed', R`v_t=\sqrt{\frac{2F_g}{C\rho A}}`, 2, 'When drag balances the weight.'],
    ]},
    { no: '6-3', rows: [
      ['Centripetal acceleration', R`a=\frac{v^2}{R}`, 3],
      ['Centripetal force', R`F=\frac{mv^2}{R}`, 3, 'The net force toward the centre, supplied by real forces.'],
    ]},
  ], extra: [
    ['Sliding down a rough incline', R`a=g(\sin\theta-\mu_k\cos\theta)`],
    ['About to slip on an incline', R`\tan\theta=\mu_s`, 'The steepest angle at which a block can rest.'],
    ['Sliding to a stop', R`a=-\mu_kg,\quad d=\frac{v_0^2}{2\mu_kg}`, 'On a level floor.'],
    ['Flat curve, top speed', R`v_{\max}=\sqrt{\mu_sgR}`],
    ['Banked curve, no friction', R`\tan\theta=\frac{v^2}{gR}`],
    ['Top of a hill', R`F_N=m\left(g-\frac{v^2}{R}\right)`, R`Contact is lost above $v=\sqrt{gR}$.`],
    ['Bottom of a dip', R`F_N=m\left(g+\frac{v^2}{R}\right)`],
    ['Vertical loop, top', R`v_\text{top}\ge\sqrt{gR}`, 'For the track, or a string, to stay pressed or taut.'],
    ['Conical pendulum', R`\tan\theta=\frac{v^2}{gr},\quad T_\text{period}=2\pi\sqrt{\frac{L\cos\theta}{g}}`, R`$r=L\sin\theta$; tension $\frac{mg}{\cos\theta}$.`],
  ]},
  // ===================================================================================================================
  { id: 'c7', mods: [
    { no: '7-1', rows: [
      ['Kinetic energy', R`K=\frac{1}{2}mv^2`, 3],
      ['The joule', R`1\ \text{J}=1\ \text{kg}\cdot\text{m}^2/\text{s}^2=1\ \text{N}\cdot\text{m}`, 2],
      ['Electron-volt', R`1\ \text{eV}=1.602\times10^{-19}\ \text{J}`, 1],
    ]},
    { no: '7-2', rows: [
      ['Work by a constant force', R`W=Fd\cos\phi=\vec{F}\cdot\vec{d}`, 3, R`$\phi$ is the angle between the force and the displacement.`],
      ['Net work', R`W_\text{net}=W_1+W_2+\cdots`, 2, 'The same as the work done by the net force.'],
      ['Work–kinetic energy theorem', R`\Delta K=K_f-K_i=W`, 3],
      ['Final kinetic energy', R`K_f=K_i+W`, 2],
    ]},
    { no: '7-3', rows: [
      ['Work by gravity', R`W_g=mgd\cos\phi`, 3, R`Negative going up ($\phi=180^\circ$), positive coming down.`],
      ['Lifting or lowering', R`\Delta K=W_a+W_g`, 2, R`$W_a$: work by the applied force.`],
      ['At rest before and after', R`W_a=-W_g`, 2],
    ]},
    { no: '7-4', rows: [
      ['Hooke’s law', R`\vec{F}_s=-k\vec{d},\quad F_x=-kx`, 3, R`$x$ is measured from the relaxed length; $k$ in N/m.`],
      ['Work by a spring', R`W_s=\frac{1}{2}kx_i^2-\frac{1}{2}kx_f^2`, 3],
      ['From the relaxed length', R`W_s=-\frac{1}{2}kx^2`, 2, R`When $x_i=0$.`],
      ['Applied force on a spring', R`W_a=-W_s`, 1, 'When the block is at rest before and after.'],
    ]},
    { no: '7-5', rows: [
      ['Work in one dimension', R`W=\int_{x_i}^{x_f}F(x)\,dx`, 3, R`The area under the $F$–$x$ graph.`],
      ['Work in three dimensions', R`W=\int_{x_i}^{x_f}F_x\,dx+\int_{y_i}^{y_f}F_y\,dy+\int_{z_i}^{z_f}F_z\,dz`, 2, R`When each component depends only on its own coordinate ($F_x$ on $x$, and so on).`],
    ]},
    { no: '7-6', rows: [
      ['Average power', R`P_\text{avg}=\frac{W}{\Delta t}`, 3],
      ['Instantaneous power', R`P=\frac{dW}{dt}`, 2],
      ['Power from force and velocity', R`P=Fv\cos\phi=\vec{F}\cdot\vec{v}`, 3],
      ['Units of power and energy', R`1\ \text{W}=1\ \text{J/s},\quad 1\ \text{hp}=746\ \text{W},\quad 1\ \text{kW}\cdot\text{h}=3.60\times10^{6}\ \text{J}`, 1],
    ]},
  ], extra: [
    ['Work by kinetic friction', R`W_f=-f_kd=-\mu_kF_Nd`],
    ['Work by the normal force', R`W_N=0`, 'Whenever it is perpendicular to the motion, like any centripetal force.'],
    ['Speed from work', R`v_f=\sqrt{v_i^2+\frac{2W_\text{net}}{m}}`],
    ['Power at constant velocity', R`P=Fv`, R`Lifting at a steady speed: $P=mgv$.`],
    ['Constant net force from rest', R`P_\text{end}=2P_\text{avg}`, 'The speed grows steadily, so the average speed is half the final one.'],
    ['Kinetic energy and speed', R`v\to2v\ \Rightarrow\ K\to4K`, 'Kinetic energy grows with the square of the speed.'],
  ]},
  // ===================================================================================================================
  { id: 'c8', mods: [
    { no: '8-1', rows: [
      ['Change in potential energy', R`\Delta U=-W`, 3, 'For a conservative force (gravity, a spring).'],
      ['From a force', R`\Delta U=-\int_{x_i}^{x_f}F(x)\,dx`, 2],
      ['Gravitational potential energy', R`\Delta U=mg\,\Delta y,\quad U(y)=mgy`, 3, R`$U=0$ at $y=0$: choose where.`],
      ['Elastic potential energy', R`U(x)=\frac{1}{2}kx^2`, 3, R`$U=0$ at the relaxed length.`],
      ['Conservative force', R`W_\text{closed path}=0`, 1, 'So its work doesn’t depend on the path, only on the end points.'],
    ]},
    { no: '8-2', rows: [
      ['Mechanical energy', R`E_\text{mec}=K+U`, 3],
      ['Conservation', R`K_2+U_2=K_1+U_1`, 3, 'When only conservative forces do work (an isolated system).'],
      ['Conservation as changes', R`\Delta E_\text{mec}=\Delta K+\Delta U=0`, 2],
    ]},
    { no: '8-3', rows: [
      ['Force from the curve', R`F(x)=-\frac{dU(x)}{dx}`, 3, R`Minus the slope of $U(x)$.`],
      ['Kinetic energy from the curve', R`K(x)=E_\text{mec}-U(x)`, 2, R`The particle can only be where $U\le E_\text{mec}$.`],
      ['Turning point', R`U(x)=E_\text{mec}\quad(K=0)`, 2],
      ['Equilibrium', R`\frac{dU}{dx}=0`, 2, R`At a minimum of $U$ stable, at a maximum unstable, on a flat stretch neutral.`],
    ]},
    { no: '8-4', rows: [
      ['No friction', R`W=\Delta E_\text{mec}=\Delta K+\Delta U`, 3],
      ['With friction', R`W=\Delta E_\text{mec}+\Delta E_\text{th}`, 3],
      ['Thermal energy', R`\Delta E_\text{th}=f_kd`, 3, R`Made by kinetic friction over a sliding distance $d$.`],
    ]},
    { no: '8-5', rows: [
      ['Work on a system', R`W=\Delta E=\Delta E_\text{mec}+\Delta E_\text{th}+\Delta E_\text{int}`, 2],
      ['Isolated system', R`\Delta E_\text{mec}+\Delta E_\text{th}+\Delta E_\text{int}=0`, 3, 'The total energy of an isolated system can’t change.'],
      ['Isolated system, end state', R`E_{\text{mec},2}=E_{\text{mec},1}-\Delta E_\text{th}-\Delta E_\text{int}`, 2],
      ['Power as energy transfer', R`P_\text{avg}=\frac{\Delta E}{\Delta t},\quad P=\frac{dE}{dt}`, 2],
    ]},
  ], extra: [
    ['Speed after a drop', R`v=\sqrt{v_0^2+2gh}`, R`Down a height $h$ by any frictionless path.`],
    ['Height reached', R`h=\frac{v^2}{2g}`, 'Up any frictionless slope, until it stops.'],
    ['Spring launch', R`v=x\sqrt{\frac{k}{m}}`, 'All the elastic energy becomes kinetic energy (level, no friction).'],
    ['Greatest compression', R`x_{\max}=v\sqrt{\frac{m}{k}}`],
    ['Pendulum from horizontal', R`v_\text{bottom}=\sqrt{2gL},\quad T_\text{bottom}=3mg`],
    ['Loop from rest', R`h_{\min}=\frac{5}{2}R`, 'The lowest start height that keeps a block on a frictionless loop.'],
    ['Sliding with friction', R`\frac{1}{2}mv_f^2=\frac{1}{2}mv_i^2-f_kd`, 'On a level floor.'],
  ]},
];
