// The final's Practice tab: problems for each chapter in three tiers. Foundation: definitions and one-step
// calculations. Application: a few steps, a little harder. Advanced: several steps, closest to an exam problem.
//
// practice[chapter id] is a list of problems in tier order. A problem's id, the key for its saved mark, is
// "<chapter no>.<position>" (16.7 is the seventh problem of Chapter 16), so append new problems and never reorder.
// A problem: tier ('f', 'a' or 'x'), topic, stem, fig (a figure id or a list), parts (labelled (a), (b) …), answer (one
// per part, or one when there are no parts) and sol (one step per block). The markup is the midterm's
// (../practice.mjs). Every answer is checked in verify.py.
import { FINAL_ADDED } from './content.mjs';

const R = String.raw;
export const PRACTICE_ADDED = FINAL_ADDED;
export const TIERS = [
  ['f', 'Foundation', 'Definitions and one-step calculations'],
  ['a', 'Application', 'A few steps, a little harder'],
  ['x', 'Advanced', 'Several steps, closest to an exam problem'],
];

export const practice = {
  // ===================================================================================================================
  c15: [
    { tier: 'f', topic: 'Reading an SHM equation',
      stem: R`A block moves as $x(t)=(0.050\text{ m})\cos\left(4\pi t+\frac{\pi}{3}\right)$, with $t$ in seconds.`,
      parts: [R`Give the amplitude, the angular frequency and the phase constant.`, R`Find the frequency and the period.`, R`Where is the block at $t=0$?`, R`Find its greatest speed.`],
      answer: [R`$x_m=0.050$ m, $\omega=4\pi$ rad/s, $\phi=\frac{\pi}{3}$ rad`, R`$f=2.0$ Hz, $T=0.50$ s`, R`$x=0.025$ m`, R`$0.2\pi\approx0.63$ m/s`],
      sol: R`**(a)** Compare with $x=x_m\cos(\omega t+\phi)$: $x_m=0.050$ m, $\omega=4\pi$ rad/s and $\phi=\frac{\pi}{3}$ rad.

**(b)** $f=\frac{\omega}{2\pi}=\frac{4\pi}{2\pi}=2.0$ Hz and $T=\frac{1}{f}=0.50$ s.

**(c)** $x(0)=0.050\cos\frac{\pi}{3}=0.050\times\frac{1}{2}=0.025$ m.

**(d)** $v_m=\omega x_m=4\pi\times0.050=0.2\pi\approx0.63$ m/s.` },
    { tier: 'f', topic: 'Period of a block on a spring',
      stem: R`A $0.20$ kg block oscillates on a spring with $k=80$ N/m.`,
      parts: [R`Find the angular frequency.`, R`Find the period.`, R`The block is replaced by one four times heavier. Find the new period.`],
      answer: [R`$20$ rad/s`, R`$\frac{\pi}{10}\approx0.31$ s`, R`$\frac{\pi}{5}\approx0.63$ s`],
      sol: R`**(a)** $\omega=\sqrt{\frac{k}{m}}=\sqrt{\frac{80}{0.20}}=\sqrt{400}=20$ rad/s.

**(b)** $T=\frac{2\pi}{\omega}=\frac{2\pi}{20}=\frac{\pi}{10}\approx0.31$ s.

**(c)** $T\propto\sqrt m$: four times the mass doubles the period, $\frac{\pi}{5}\approx0.63$ s.` },
    { tier: 'f', topic: 'Energy of an oscillator',
      stem: R`A $1.0$ kg block on a spring with $k=400$ N/m oscillates on a frictionless floor with an amplitude of $0.050$ m.`,
      parts: [R`Find the mechanical energy.`, R`Find the greatest speed.`, R`Find the potential and kinetic energies at $x=0.025$ m.`],
      answer: [R`$0.50$ J`, R`$1.0$ m/s`, R`$U=0.125$ J and $K=0.375$ J`],
      sol: R`**(a)** $E=\frac{1}{2}kx_m^2=\frac{1}{2}(400)(0.050)^2=200\times0.0025=0.50$ J.

**(b)** All kinetic at $x=0$: $\frac{1}{2}(1.0)v_m^2=0.50$, so $v_m=1.0$ m/s.

**(c)** $U=\frac{1}{2}(400)(0.025)^2=200\times6.25\times10^{-4}=0.125$ J, a quarter of $E$ since $x=\frac{x_m}{2}$. Then $K=0.50-0.125=0.375$ J.` },
    { tier: 'f', topic: 'The simple pendulum',
      stem: R`Take $g=9.8\ \text{m/s}^2$ and small swings.`,
      parts: [R`Find the period of a simple pendulum $0.392$ m long.`, R`How long must a pendulum be to have twice that period?`, R`What happens to the period of (a) if the bob's mass is tripled?`],
      answer: [R`$0.4\pi\approx1.3$ s`, R`$1.568\approx1.6$ m`, R`Nothing: it stays $0.4\pi$ s`],
      sol: R`**(a)** $\frac{L}{g}=\frac{0.392}{9.8}=0.040\ \text{s}^2$, so $T=2\pi\sqrt{0.040}=2\pi(0.20)=0.4\pi\approx1.3$ s.

**(b)** $T\propto\sqrt L$, so twice the period takes four times the length: $4\times0.392=1.568\approx1.6$ m.

**(c)** The mass doesn't appear in $T=2\pi\sqrt{\frac{L}{g}}$: the period is unchanged.` },
    { tier: 'f', topic: 'Damping and resonance',
      stem: R`A $0.50$ kg block oscillates on a spring with a damping constant of $0.10$ kg/s. Use $e^{-2}\approx0.14$.`,
      parts: [R`How long does the amplitude take to fall to $\frac{1}{e}$ of its first value?`, R`What fraction of the energy is left then?`, R`A swing has a period of $2.5$ s. How often should it be pushed to build up a large amplitude?`],
      answer: [R`$10$ s`, R`$e^{-2}\approx0.14$`, R`Once per swing: $0.40$ times a second`],
      sol: R`**(a)** The amplitude goes as $e^{-bt/2m}$; it is $\frac{1}{e}$ when $\frac{bt}{2m}=1$: $t=\frac{2m}{b}=\frac{1.0}{0.10}=10$ s.

**(b)** The energy goes as the amplitude squared: $\left(\frac{1}{e}\right)^2=e^{-2}\approx0.14$.

**(c)** Resonance: drive at the natural frequency, $f=\frac{1}{2.5}=0.40$ Hz, one push per swing.` },
    { tier: 'a', topic: 'Amplitude and phase from the start',
      stem: R`A block on a spring oscillates with $\omega=10$ rad/s. At $t=0$ it is at $x=0.10$ m, moving toward $-x$ at $\sqrt3$ m/s.`,
      parts: [R`Find the amplitude.`, R`Find the phase constant.`, R`Write $x(t)$.`, R`When does the block first reach $x=-x_m$?`],
      answer: [R`$0.20$ m`, R`$\frac{\pi}{3}$ rad`, R`$x=0.20\cos\left(10t+\frac{\pi}{3}\right)$ m`, R`$t=\frac{\pi}{15}\approx0.21$ s`],
      sol: R`**(a)** $x_m=\sqrt{x_0^2+\left(\frac{v_0}{\omega}\right)^2}=\sqrt{0.010+\frac{3}{100}}=\sqrt{0.040}=0.20$ m. (From $E$: $\frac{1}{2}kx_m^2=\frac{1}{2}kx_0^2+\frac{1}{2}mv_0^2$ with $\frac{m}{k}=\frac{1}{\omega^2}$.)

**(b)** $x(0)=x_m\cos\phi$ gives $\cos\phi=\frac{0.10}{0.20}=\frac{1}{2}$; $v(0)=-\omega x_m\sin\phi<0$ needs $\sin\phi>0$. So $\phi=\frac{\pi}{3}$.

**(c)** $x(t)=0.20\cos\left(10t+\frac{\pi}{3}\right)$ m.

**(d)** $x=-x_m$ when $10t+\frac{\pi}{3}=\pi$: $t=\frac{2\pi/3}{10}=\frac{\pi}{15}\approx0.21$ s.` },
    { tier: 'a', topic: 'Speed and acceleration at a point',
      stem: R`An oscillator has $\omega=4.0$ rad/s and an amplitude of $0.25$ m.`,
      parts: [R`Find its speed at $x=0.15$ m.`, R`Find its acceleration there.`, R`What fraction of its energy is kinetic there?`],
      answer: [R`$0.80$ m/s`, R`$-2.4\ \text{m/s}^2$`, R`$0.64$`],
      sol: R`**(a)** $v=\omega\sqrt{x_m^2-x^2}=4.0\sqrt{0.0625-0.0225}=4.0\sqrt{0.040}=4.0\times0.20=0.80$ m/s.

**(b)** $a=-\omega^2x=-16\times0.15=-2.4\ \text{m/s}^2$, pointing back toward the centre.

**(c)** $\frac{U}{E}=\frac{x^2}{x_m^2}=\left(\frac{0.15}{0.25}\right)^2=0.36$, so $\frac{K}{E}=1-0.36=0.64$.` },
    { tier: 'a', topic: 'A hanging spring',
      stem: R`A $0.50$ kg block hangs from a spring with $k=49$ N/m. It is pulled $0.040$ m below its rest position and released. Take $g=9.8\ \text{m/s}^2$.`,
      parts: [R`How far is the spring stretched when the block hangs at rest?`, R`Find the period of the oscillation.`, R`Find the greatest speed.`],
      answer: [R`$0.10$ m`, R`$\frac{\sqrt2\,\pi}{7}\approx0.63$ s`, R`$0.28\sqrt2\approx0.40$ m/s`],
      sol: R`**(a)** At rest the spring holds the weight: $k\Delta y=mg$, so $\Delta y=\frac{(0.50)(9.8)}{49}=0.10$ m.

**(b)** Gravity only moves the centre of the oscillation, so $\omega=\sqrt{\frac{k}{m}}=\sqrt{98}=7\sqrt2$ rad/s and $T=\frac{2\pi}{7\sqrt2}=\frac{\sqrt2\,\pi}{7}\approx0.63$ s.

**(c)** The amplitude is $0.040$ m, measured from the rest position: $v_m=\omega x_m=7\sqrt2\times0.040=0.28\sqrt2\approx0.40$ m/s.` },
    { tier: 'a', topic: 'A hoop as a pendulum',
      stem: R`A thin hoop of mass $0.20$ kg and radius $0.49$ m hangs on a nail through its rim and swings in its own plane. Take $g=9.8\ \text{m/s}^2$; about its centre a hoop has $I=mR^2$.`,
      parts: [R`Find its rotational inertia about the nail.`, R`Find the period of small swings.`, R`How long is a simple pendulum with the same period?`],
      answer: [R`$2mR^2\approx0.096\ \text{kg}\cdot\text{m}^2$`, R`$2\pi\sqrt{0.10}\approx2.0$ s`, R`$0.98$ m`],
      sol: R`**(a)** Parallel axes, with the nail a distance $R$ from the centre: $I=mR^2+mR^2=2mR^2=2(0.20)(0.49)^2\approx0.096\ \text{kg}\cdot\text{m}^2$.

**(b)** The centre of mass is $h=R$ below the nail: $T=2\pi\sqrt{\frac{2mR^2}{mgR}}=2\pi\sqrt{\frac{2R}{g}}=2\pi\sqrt{\frac{0.98}{9.8}}=2\pi\sqrt{0.10}\approx2.0$ s.

**(c)** $2\pi\sqrt{\frac{L}{g}}=2\pi\sqrt{\frac{2R}{g}}$ when $L=2R=0.98$ m.` },
    { tier: 'a', topic: 'Measuring rotational inertia',
      stem: R`An object with rotational inertia $0.010\ \text{kg}\cdot\text{m}^2$ swings on a torsion wire with a period of $1.0$ s. A second object on the same wire swings with a period of $3.0$ s. Module 15-3 (not on the class schedule).`,
      parts: [R`Find the wire's torsion constant.`, R`Find the second object's rotational inertia.`],
      answer: [R`$0.04\pi^2\approx0.39\ \text{N}\cdot\text{m/rad}$`, R`$0.090\ \text{kg}\cdot\text{m}^2$`],
      sol: R`**(a)** $T=2\pi\sqrt{\frac{I}{\kappa}}$ gives $\kappa=\frac{4\pi^2I}{T^2}=4\pi^2(0.010)=0.04\pi^2\approx0.39\ \text{N}\cdot\text{m/rad}$.

**(b)** On the same wire $I\propto T^2$: $I_2=0.010\times3.0^2=0.090\ \text{kg}\cdot\text{m}^2$.` },
    { tier: 'a', topic: 'Energy lost to damping',
      stem: R`A $0.20$ kg block on a spring with $k=20$ N/m starts oscillating with an amplitude of $0.10$ m. The damping constant is $0.040$ kg/s. Use $e^{-1}\approx0.37$.`,
      parts: [R`Find the starting energy.`, R`Find the energy after $5.0$ s.`, R`About how many oscillations is that?`],
      answer: [R`$0.10$ J`, R`About $0.037$ J`, R`About $8$`],
      sol: R`**(a)** $E_0=\frac{1}{2}kx_m^2=\frac{1}{2}(20)(0.10)^2=0.10$ J.

**(b)** $E=E_0e^{-bt/m}=0.10\,e^{-(0.040)(5.0)/0.20}=0.10\,e^{-1}\approx0.037$ J.

**(c)** $\omega\approx\sqrt{\frac{20}{0.20}}=10$ rad/s, so $T\approx\frac{2\pi}{10}\approx0.63$ s, and $\frac{5.0}{0.63}\approx8$ oscillations.` },
    { tier: 'x', topic: 'Two springs on one block',
      stem: R`A $0.50$ kg block on a frictionless floor sits between two springs, $k_1=30$ N/m on its left and $k_2=20$ N/m on its right, both fixed to walls and unstretched when the block is at rest.`,
      parts: [R`The block is pushed a distance $x$ to the right. Find the net force on it, and the single spring constant that would do the same.`, R`Find the period.`, R`Instead, the two springs are joined end to end with the block at the free end. Find the period.`],
      answer: [R`$-(k_1+k_2)x$, so $k=50$ N/m`, R`$\frac{\pi}{5}\approx0.63$ s`, R`$\frac{\pi}{\sqrt6}\approx1.3$ s`],
      sol: R`**(a)** The left spring is stretched by $x$ and pulls left, $-k_1x$; the right one is compressed by $x$ and pushes left, $-k_2x$. Together $-(k_1+k_2)x=-50x$: $k=50$ N/m.

**(b)** $\omega=\sqrt{\frac{50}{0.50}}=10$ rad/s and $T=\frac{2\pi}{10}=\frac{\pi}{5}\approx0.63$ s.

**(c)** End to end, the same force stretches each spring: $x=\frac{F}{k_1}+\frac{F}{k_2}$, so $\frac{1}{k}=\frac{1}{30}+\frac{1}{20}=\frac{1}{12}$ and $k=12$ N/m. Then $T=2\pi\sqrt{\frac{0.50}{12}}=2\pi\sqrt{\frac{1}{24}}=\frac{\pi}{\sqrt6}\approx1.3$ s.` },
    { tier: 'x', topic: 'Putty on an oscillating block',
      stem: R`A $2.0$ kg block on a spring with $k=200$ N/m oscillates on a frictionless floor with an amplitude of $0.10$ m. As it passes $x=0$, a $2.0$ kg lump of putty dropped from above sticks to it.`,
      parts: [R`Find the block's speed just before.`, R`Find the speed just after.`, R`Find the new amplitude.`, R`Find the new period.`],
      answer: [R`$1.0$ m/s`, R`$0.50$ m/s`, R`$0.05\sqrt2\approx0.071$ m`, R`$\frac{\sqrt2\,\pi}{5}\approx0.89$ s`],
      sol: R`**(a)** $\omega=\sqrt{\frac{200}{2.0}}=10$ rad/s and $v=\omega x_m=10\times0.10=1.0$ m/s at $x=0$.

**(b)** The putty brings no horizontal momentum: $(2.0)(1.0)=(4.0)v'$, so $v'=0.50$ m/s.

**(c)** Now $\omega'=\sqrt{\frac{200}{4.0}}=\sqrt{50}=5\sqrt2$ rad/s, and $v'$ is the new greatest speed: $x_m'=\frac{v'}{\omega'}=\frac{0.50}{5\sqrt2}=\frac{0.10}{\sqrt2}=0.05\sqrt2\approx0.071$ m. **Check** $\frac{1}{2}k(x_m')^2=0.50$ J, half the first $1.0$ J: the sticking lost the rest.

**(d)** $T'=\frac{2\pi}{5\sqrt2}=\frac{\sqrt2\,\pi}{5}\approx0.89$ s.` },
    { tier: 'x', topic: 'A car on a bumpy road',
      stem: R`A car rests on its springs. When a $100$ kg passenger gets in, it sinks $2.0$ cm. The car with the passenger has a mass of $1000$ kg. Take $g=9.8\ \text{m/s}^2$ and ignore the shock absorbers.`,
      parts: [R`Find the spring constant of the suspension.`, R`Find the natural angular frequency of the loaded car.`, R`The road has bumps every $4.0$ m. At what speed does the car bounce worst?`],
      answer: [R`$4.9\times10^4$ N/m`, R`$7.0$ rad/s`, R`$\frac{14}{\pi}\approx4.5$ m/s`],
      sol: R`**(a)** The extra weight is held by the extra compression: $k=\frac{mg}{\Delta y}=\frac{(100)(9.8)}{0.020}=4.9\times10^4$ N/m.

**(b)** $\omega=\sqrt{\frac{4.9\times10^4}{1000}}=\sqrt{49}=7.0$ rad/s.

**(c)** Resonance: the bumps must come at $f=\frac{\omega}{2\pi}=\frac{7.0}{2\pi}$ per second. One bump each $4.0$ m means $v=(4.0)f=\frac{28}{2\pi}=\frac{14}{\pi}\approx4.5$ m/s.` },
  ],

  // ===================================================================================================================
  c16: [
    { tier: 'f', topic: 'Reading a wave',
      stem: R`A wave on a string is $y=0.040\sin(\pi x-4\pi t)$, with $x$ and $y$ in metres and $t$ in seconds.`,
      parts: [R`Give its amplitude, angular wave number and angular frequency.`, R`Find its wavelength and frequency.`, R`Find its speed and direction.`],
      answer: [R`$y_m=0.040$ m, $k=\pi$ rad/m, $\omega=4\pi$ rad/s`, R`$\lambda=2.0$ m, $f=2.0$ Hz`, R`$4.0$ m/s toward $+x$`],
      sol: R`**(a)** Compare with $y_m\sin(kx-\omega t)$: $y_m=0.040$ m, $k=\pi$ rad/m and $\omega=4\pi$ rad/s.

**(b)** $\lambda=\frac{2\pi}{k}=2.0$ m and $f=\frac{\omega}{2\pi}=2.0$ Hz.

**(c)** $v=\lambda f=4.0$ m/s (or $\frac{\omega}{k}$), toward $+x$ because of the minus sign.` },
    { tier: 'f', topic: 'Speed on a string',
      stem: R`A string with a linear density of $0.010$ kg/m is stretched with a tension of $25$ N.`,
      parts: [R`Find the wave speed.`, R`Find the wavelength of a $200$ Hz wave on it.`, R`Find the wave speed if the tension is doubled.`],
      answer: [R`$50$ m/s`, R`$0.25$ m`, R`$50\sqrt2\approx71$ m/s`],
      sol: R`**(a)** $v=\sqrt{\frac{\tau}{\mu}}=\sqrt{\frac{25}{0.010}}=\sqrt{2500}=50$ m/s.

**(b)** $\lambda=\frac{v}{f}=\frac{50}{200}=0.25$ m.

**(c)** $v\propto\sqrt\tau$: $\sqrt2\times50\approx71$ m/s.` },
    { tier: 'f', topic: 'Power carried by a wave',
      stem: R`A wave with an amplitude of $2.0$ cm and an angular frequency of $100$ rad/s runs along a string with $\mu=0.010$ kg/m and $v=50$ m/s.`,
      parts: [R`Find the average power.`, R`Find it for an amplitude of $1.0$ cm.`],
      answer: [R`$1.0$ W`, R`$0.25$ W`],
      sol: R`**(a)** $P_\text{avg}=\frac{1}{2}\mu v\omega^2y_m^2=\frac{1}{2}(0.010)(50)(100)^2(0.020)^2=\frac{1}{2}(0.50)(10^4)(4.0\times10^{-4})=1.0$ W.

**(b)** Half the amplitude, a quarter of the power: $0.25$ W.` },
    { tier: 'f', topic: 'Two waves together',
      stem: R`Two waves, each with an amplitude of $3.0$ mm, travel the same way along a string with the same frequency.`,
      parts: [R`Find the resultant amplitude when they are in phase.`, R`Find it for a phase difference of $\pi$ rad.`, R`Find it for a phase difference of $\frac{\pi}{2}$ rad.`],
      answer: [R`$6.0$ mm`, R`$0$`, R`$3\sqrt2\approx4.2$ mm`],
      sol: R`**(a)** $2y_m\cos0=6.0$ mm.

**(b)** $2y_m\cos\frac{\pi}{2}=0$: they cancel.

**(c)** $2(3.0)\cos\frac{\pi}{4}=6.0\times\frac{\sqrt2}{2}=3\sqrt2\approx4.2$ mm.` },
    { tier: 'f', topic: 'Harmonics of a string',
      stem: R`A string $1.0$ m long is fixed at both ends; waves travel along it at $200$ m/s.`,
      parts: [R`Find its three lowest resonant frequencies.`, R`Find the wavelength of the second harmonic.`, R`How many nodes does the second harmonic have, counting the ends?`],
      answer: [R`$100$ Hz, $200$ Hz and $300$ Hz`, R`$1.0$ m`, R`$3$`],
      sol: R`**(a)** $f_n=\frac{nv}{2L}=n\times\frac{200}{2.0}=100n$ Hz: $100$, $200$ and $300$ Hz.

**(b)** $\lambda_2=\frac{2L}{2}=1.0$ m: two loops fill the string.

**(c)** Two loops: both ends and one in the middle, $3$ nodes.` },
    { tier: 'a', topic: 'Writing a wave',
      stem: R`A wave travels toward $-x$ with an amplitude of $5.0$ mm, a wavelength of $0.40$ m and a speed of $20$ m/s. At $x=0$ and $t=0$, its displacement is zero and increasing.`,
      parts: [R`Find $k$ and $\omega$.`, R`Write $y(x,t)$.`, R`Find the greatest transverse speed of the string.`],
      answer: [R`$k=5\pi$ rad/m, $\omega=100\pi$ rad/s`, R`$y=0.0050\sin(5\pi x+100\pi t)$ m`, R`$0.5\pi\approx1.6$ m/s`],
      sol: R`**(a)** $k=\frac{2\pi}{0.40}=5\pi$ rad/m; $f=\frac{v}{\lambda}=\frac{20}{0.40}=50$ Hz, so $\omega=2\pi f=100\pi$ rad/s.

**(b)** Toward $-x$ the phase is $kx+\omega t$; a sine is zero and rising at $0$: $y=0.0050\sin(5\pi x+100\pi t)$ m.

**(c)** $u_\text{max}=\omega y_m=100\pi\times0.0050=0.5\pi\approx1.6$ m/s.` },
    { tier: 'a', topic: 'An element of the string',
      stem: R`A wave on a string is $y=0.020\sin(2.0x-8.0t)$, in metres and seconds. Look at the element at $x=0$.`,
      parts: [R`Find its transverse velocity at $t=0$.`, R`Find its displacement, velocity and acceleration at $t=\frac{\pi}{16}$ s.`],
      answer: [R`$-0.16$ m/s`, R`$y=-0.020$ m, $u=0$, $a_y=1.28\ \text{m/s}^2$`],
      sol: R`**(a)** $u=\frac{\partial y}{\partial t}=-\omega y_m\cos(kx-\omega t)=-(8.0)(0.020)\cos0=-0.16$ m/s.

**(b)** At $t=\frac{\pi}{16}$ s the phase is $-8.0\times\frac{\pi}{16}=-\frac{\pi}{2}$: $y=0.020\sin\left(-\frac{\pi}{2}\right)=-0.020$ m, a lowest point, so $u=0$. There $a_y=-\omega^2y=-(64)(-0.020)=1.28\ \text{m/s}^2$, upward.` },
    { tier: 'a', topic: 'From one string to another',
      stem: R`A $120$ Hz wave passes from a string with $\mu_1=1.0$ g/m into one with $\mu_2=4.0$ g/m. Both carry a tension of $3.6$ N.`,
      parts: [R`Find the wave speed in each string.`, R`Find the frequency in each.`, R`Find the wavelength in each.`],
      answer: [R`$60$ m/s and $30$ m/s`, R`$120$ Hz in both`, R`$0.50$ m and $0.25$ m`],
      sol: R`**(a)** $v_1=\sqrt{\frac{3.6}{1.0\times10^{-3}}}=\sqrt{3600}=60$ m/s and $v_2=\sqrt{\frac{3.6}{4.0\times10^{-3}}}=\sqrt{900}=30$ m/s.

**(b)** The joint moves up and down as often as the wave arriving at it: $120$ Hz in both.

**(c)** $\lambda_1=\frac{60}{120}=0.50$ m and $\lambda_2=\frac{30}{120}=0.25$ m.` },
    { tier: 'a', topic: 'Shifted waves',
      stem: R`Two identical waves, of amplitude $4.0$ mm and wavelength $0.60$ m, travel together along a string, one shifted $0.10$ m behind the other.`,
      parts: [R`Find the phase difference.`, R`Find the resultant amplitude.`, R`What is the smallest shift that would make them cancel?`],
      answer: [R`$\frac{\pi}{3}$ rad`, R`$4\sqrt3\approx6.9$ mm`, R`$0.30$ m`],
      sol: R`**(a)** $\phi=2\pi\frac{\Delta x}{\lambda}=2\pi\times\frac{0.10}{0.60}=\frac{\pi}{3}$ rad.

**(b)** $2y_m\cos\frac{\phi}{2}=8.0\cos\frac{\pi}{6}=8.0\times\frac{\sqrt3}{2}=4\sqrt3\approx6.9$ mm.

**(c)** They cancel for $\phi=\pi$, half a wavelength: $0.30$ m.` },
    { tier: 'a', topic: 'Phasors of unequal waves',
      stem: R`Two waves with the same frequency and direction have amplitudes of $5.0$ mm and $12$ mm.`,
      parts: [R`Find the resultant amplitude for a phase difference of $\frac{\pi}{2}$ rad.`, R`Find it for $\pi$ rad.`, R`Find it for $\frac{2\pi}{3}$ rad.`],
      answer: [R`$13$ mm`, R`$7.0$ mm`, R`$\sqrt{109}\approx10$ mm`],
      sol: R`**(a)** Phasors at right angles: $\sqrt{5.0^2+12^2}=\sqrt{169}=13$ mm.

**(b)** Opposite: $12-5.0=7.0$ mm.

**(c)** $(y_m')^2=25+144+2(5.0)(12)\cos\frac{2\pi}{3}=169-60=109$, so $y_m'=\sqrt{109}\approx10$ mm.` },
    { tier: 'a', topic: 'Reading a standing wave',
      stem: R`A standing wave on a string is $y'=0.040\sin(5\pi x)\cos(40\pi t)$, in metres and seconds.`,
      parts: [R`Find the amplitude and the speed of the two travelling waves that make it.`, R`Where are the nodes?`, R`Where are the antinodes?`, R`Find the greatest transverse speed at an antinode.`],
      answer: [R`$0.020$ m and $8.0$ m/s`, R`$x=0,\ 0.20,\ 0.40,\dots$ m`, R`$x=0.10,\ 0.30,\ 0.50,\dots$ m`, R`$1.6\pi\approx5.0$ m/s`],
      sol: R`**(a)** $y'=[2y_m\sin kx]\cos\omega t$ with $2y_m=0.040$ m: $y_m=0.020$ m. $v=\frac{\omega}{k}=\frac{40\pi}{5\pi}=8.0$ m/s.

**(b)** $\sin(5\pi x)=0$ at $5\pi x=n\pi$: $x=0,\ 0.20,\ 0.40,\dots$ m, half a wavelength ($\lambda=0.40$ m) apart.

**(c)** Halfway between: $x=0.10,\ 0.30,\ 0.50,\dots$ m.

**(d)** At an antinode $y'=0.040\cos(40\pi t)$, so $u_\text{max}=40\pi\times0.040=1.6\pi\approx5.0$ m/s.` },
    { tier: 'x', topic: 'Tuning a guitar string',
      stem: R`A guitar string vibrates over a length of $0.50$ m and has a linear density of $2.0$ g/m.`,
      parts: [R`What tension makes its fundamental $220$ Hz?`, R`A finger presses the string at its middle. What is the new fundamental?`, R`With the whole string free again, what is the third harmonic?`],
      answer: [R`$96.8\approx97$ N`, R`$440$ Hz`, R`$660$ Hz`],
      sol: R`**(a)** $f_1=\frac{v}{2L}$ needs $v=2Lf_1=2(0.50)(220)=220$ m/s, so $\tau=\mu v^2=(2.0\times10^{-3})(220)^2=96.8\approx97$ N.

**(b)** Half the length, same speed: twice the frequency, $440$ Hz.

**(c)** $f_3=3f_1=660$ Hz.` },
    { tier: 'x', topic: 'A hanging mass sets the harmonic',
      stem: R`A string runs from a $70$ Hz vibrator over a pulley $1.2$ m away, with a block hanging from its end to give the tension. The string has a linear density of $2.0$ g/m. Take $g=9.8\ \text{m/s}^2$.`,
      parts: [R`What wavelength gives a standing wave with $4$ loops?`, R`What wave speed does that need?`, R`What mass must hang from the string?`, R`What mass gives $3$ loops instead?`],
      answer: [R`$0.60$ m`, R`$42$ m/s`, R`$0.36$ kg`, R`$0.64$ kg`],
      sol: R`**(a)** Four half wavelengths fill $1.2$ m: $\lambda=\frac{2L}{4}=0.60$ m.

**(b)** $v=\lambda f=0.60\times70=42$ m/s.

**(c)** $\tau=\mu v^2=(2.0\times10^{-3})(42)^2=3.528$ N, held up by the block: $m=\frac{3.528}{9.8}=0.36$ kg.

**(d)** Three loops: $\lambda=0.80$ m and $v=56$ m/s, so $\tau=(2.0\times10^{-3})(56)^2=6.272$ N and $m=\frac{6.272}{9.8}=0.64$ kg. Fewer loops need a heavier block.` },
    { tier: 'x', topic: 'Sending power down a string',
      stem: R`A string with $\mu=5.0$ g/m is stretched to a tension of $50$ N. A $50$ Hz wave is to carry an average power of $1.0$ W.`,
      parts: [R`Find the wave speed.`, R`What amplitude is needed?`, R`The tension is made four times larger. What amplitude carries the same power at the same frequency?`],
      answer: [R`$100$ m/s`, R`$\frac{1}{50\pi}\text{ m}\approx6.4$ mm`, R`$\frac{1}{50\sqrt2\,\pi}\text{ m}\approx4.5$ mm`],
      sol: R`**(a)** $v=\sqrt{\frac{50}{5.0\times10^{-3}}}=\sqrt{10^4}=100$ m/s.

**(b)** $\omega=2\pi(50)=100\pi$ rad/s. $1.0=\frac{1}{2}(5.0\times10^{-3})(100)(100\pi)^2y_m^2=2500\pi^2y_m^2$, so $y_m=\frac{1}{50\pi}$ m $\approx6.4$ mm.

**(c)** Four times the tension doubles $v$, and $P\propto vy_m^2$. The same power needs $y_m^2$ halved: $y_m=\frac{1}{50\pi\sqrt2}$ m $\approx4.5$ mm.` },
  ],

  // ===================================================================================================================
  c17: [
    { tier: 'f', topic: 'Speed, frequency and wavelength',
      stem: R`Take the speed of sound in air as $343$ m/s.`,
      parts: [R`Find the wavelength of a $686$ Hz tone.`, R`Find the frequency of sound with a wavelength of $1.0$ cm.`, R`How long does sound take to cross $100$ m?`],
      answer: [R`$0.50$ m`, R`$34.3$ kHz (ultrasound)`, R`About $0.29$ s`],
      sol: R`**(a)** $\lambda=\frac{v}{f}=\frac{343}{686}=0.50$ m.

**(b)** $f=\frac{v}{\lambda}=\frac{343}{0.010}=34\,300$ Hz $=34.3$ kHz, too high to hear.

**(c)** $t=\frac{100}{343}\approx0.29$ s.` },
    { tier: 'f', topic: 'Speed from the bulk modulus',
      stem: R`Use $v=\sqrt{B/\rho}$.`,
      parts: [R`A liquid has $B=1.0\times10^9$ Pa and $\rho=1.0\times10^3\ \text{kg/m}^3$. Find the speed of sound in it.`, R`A metal has $B=9.0\times10^{10}$ Pa and $\rho=1.0\times10^4\ \text{kg/m}^3$. Find the speed of sound in it.`, R`For one frequency, how many times longer is the wavelength in the metal than in the liquid?`],
      answer: [R`$1.0\times10^3$ m/s`, R`$3.0\times10^3$ m/s`, R`$3.0$ times`],
      sol: R`**(a)** $v=\sqrt{\frac{1.0\times10^9}{1.0\times10^3}}=\sqrt{10^6}=1.0\times10^3$ m/s.

**(b)** $v=\sqrt{\frac{9.0\times10^{10}}{1.0\times10^4}}=\sqrt{9.0\times10^6}=3.0\times10^3$ m/s.

**(c)** $\lambda=\frac{v}{f}$ with the same $f$: $\frac{3000}{1000}=3.0$ times.` },
    { tier: 'f', topic: 'Path difference',
      stem: R`Two loudspeakers driven in phase emit sound of wavelength $0.40$ m.`,
      parts: [R`What kind of interference is there at a point where the path difference is $0.20$ m?`, R`Where it is $0.80$ m?`, R`Find the phase difference where it is $0.10$ m.`],
      answer: [R`Fully destructive`, R`Fully constructive`, R`$\frac{\pi}{2}$ rad (intermediate)`],
      sol: R`**(a)** $\frac{0.20}{0.40}=0.5$ wavelength: fully destructive.

**(b)** $\frac{0.80}{0.40}=2$ wavelengths: fully constructive.

**(c)** $\phi=\frac{\Delta L}{\lambda}2\pi=\frac{0.10}{0.40}2\pi=\frac{\pi}{2}$ rad: intermediate.` },
    { tier: 'f', topic: 'Decibels',
      stem: R`Use $I_0=10^{-12}\ \text{W/m}^2$.`,
      parts: [R`Find the sound level of an intensity of $10^{-5}\ \text{W/m}^2$.`, R`Find the intensity of a $90$ dB sound.`, R`By what factor does the intensity grow when the level rises by $20$ dB?`],
      answer: [R`$70$ dB`, R`$10^{-3}\ \text{W/m}^2$`, R`$100$`],
      sol: R`**(a)** $\beta=10\log\frac{10^{-5}}{10^{-12}}=10\log10^7=70$ dB.

**(b)** $10\log\frac{I}{I_0}=90$ gives $\frac{I}{I_0}=10^9$: $I=10^{-3}\ \text{W/m}^2$.

**(c)** $20=10\log\frac{I_2}{I_1}$ gives $\frac{I_2}{I_1}=10^2=100$.` },
    { tier: 'f', topic: 'Beats',
      stem: R`Two tuning forks of $256$ Hz and $260$ Hz sound together.`,
      parts: [R`Find the beat frequency and the pitch heard.`, R`A little wax on one fork lowers its frequency, and the beats get faster. Which fork has the wax?`],
      answer: [R`$4$ beats per second, at $258$ Hz`, R`The $256$ Hz one`],
      sol: R`**(a)** $f_\text{beat}=260-256=4$ Hz, at $\frac{256+260}{2}=258$ Hz.

**(b)** Lowering the $256$ Hz fork moves it away from $260$ Hz and speeds up the beats; lowering the $260$ Hz fork would bring it closer and slow them. So the wax is on the $256$ Hz fork.` },
    { tier: 'a', topic: 'Pressure, displacement and intensity',
      stem: R`A sound wave in air has an angular frequency of $1000$ rad/s and a pressure amplitude of $2.04$ Pa. Take $v=340$ m/s, $\rho=1.20\ \text{kg/m}^3$ and $\log5\approx0.70$.`,
      parts: [R`Find its displacement amplitude.`, R`Find its intensity.`, R`Find its sound level.`],
      answer: [R`$5.0\ \mu$m`, R`$5.1\times10^{-3}\ \text{W/m}^2$`, R`About $97$ dB`],
      sol: R`**(a)** $s_m=\frac{\Delta p_m}{v\rho\omega}=\frac{2.04}{(340)(1.20)(1000)}=\frac{2.04}{4.08\times10^5}=5.0\times10^{-6}$ m.

**(b)** $I=\frac{1}{2}\rho v\omega^2s_m^2=\frac{1}{2}(1.20)(340)(10^6)(2.5\times10^{-11})=5.1\times10^{-3}\ \text{W/m}^2$.

**(c)** $\beta=10\log\frac{5.1\times10^{-3}}{10^{-12}}=10\left(9+\log5.1\right)\approx10(9+0.71)\approx97$ dB.` },
    { tier: 'a', topic: 'A siren and distance',
      stem: R`A siren, sounding evenly in all directions, gives a sound level of $100$ dB at $10$ m.`,
      parts: [R`Find the intensity at $10$ m.`, R`Find the siren's power.`, R`Find the sound level at $100$ m.`, R`At what distance is the level $60$ dB?`],
      answer: [R`$10^{-2}\ \text{W/m}^2$`, R`$4\pi\approx13$ W`, R`$80$ dB`, R`$1.0$ km`],
      sol: R`**(a)** $\frac{I}{I_0}=10^{10}$: $I=10^{-2}\ \text{W/m}^2$.

**(b)** $P=I\cdot4\pi r^2=(10^{-2})(4\pi)(100)=4\pi\approx13$ W.

**(c)** Ten times as far, a hundredth of the intensity: $20$ dB less, $80$ dB.

**(d)** $40$ dB less is $10^{-4}$ of the intensity, so $r$ is $100$ times larger: $1.0\times10^3$ m.` },
    { tier: 'a', topic: 'Pipes',
      stem: R`A pipe closed at one end has a fundamental of $170$ Hz. Take $v=340$ m/s.`,
      parts: [R`How long is it?`, R`Find its next two resonant frequencies.`, R`The closed end is opened. Find the new fundamental.`],
      answer: [R`$0.50$ m`, R`$510$ Hz and $850$ Hz`, R`$340$ Hz`],
      sol: R`**(a)** $f_1=\frac{v}{4L}$, so $L=\frac{340}{4(170)}=0.50$ m.

**(b)** Odd harmonics only: $3f_1=510$ Hz and $5f_1=850$ Hz.

**(c)** Open at both ends: $f_1=\frac{v}{2L}=\frac{340}{1.0}=340$ Hz.` },
    { tier: 'a', topic: 'Quiet spots between two speakers',
      stem: R`Two speakers $3.0$ m apart face each other and are driven in phase at a wavelength of $1.0$ m. A listener walks along the line between them.`,
      parts: [R`What does the listener hear at the midpoint?`, R`Where are the quiet spots nearest the midpoint?`, R`How many quiet spots are there between the speakers?`],
      answer: [R`Fully constructive interference: loud`, R`$1.25$ m and $1.75$ m from one speaker`, R`$6$`],
      sol: R`**(a)** At the midpoint the paths are equal: $\Delta L=0$, fully constructive.

**(b)** At a distance $x$ from one speaker, $\Delta L=|(3.0-x)-x|=|3.0-2x|$. The quiet spots need $\Delta L=0.5,\ 1.5,\ 2.5$ m; the nearest the middle, $|3.0-2x|=0.5$, gives $x=1.25$ m and $1.75$ m.

**(c)** $|3.0-2x|$ runs from $0$ to $3.0$ m, passing $0.5$, $1.5$ and $2.5$ m on each side of the middle: $6$ quiet spots.` },
    { tier: 'a', topic: 'A passing train',
      stem: R`A train's whistle emits $500$ Hz. The train moves at $20$ m/s past a listener standing by the track. Take $v=340$ m/s.`,
      parts: [R`What does the listener hear as the train approaches?`, R`As it moves away?`, R`By how much does the pitch drop as it passes?`],
      answer: [R`$531.25$ Hz`, R`$472$ Hz`, R`About $59$ Hz`],
      sol: R`**(a)** Source toward: $f'=500\times\frac{340}{340-20}=500\times\frac{17}{16}=531.25$ Hz.

**(b)** Away: $f'=500\times\frac{340}{360}=500\times\frac{17}{18}\approx472$ Hz.

**(c)** $531.25-472.2\approx59$ Hz.` },
    { tier: 'a', topic: 'A moving listener',
      stem: R`A siren at rest emits $400$ Hz. A car drives past it at $34$ m/s. Take $v=340$ m/s.`,
      parts: [R`What does the driver hear while approaching?`, R`While moving away?`],
      answer: [R`$440$ Hz`, R`$360$ Hz`],
      sol: R`**(a)** Detector toward: $f'=400\times\frac{340+34}{340}=400\times1.1=440$ Hz.

**(b)** Away: $f'=400\times\frac{340-34}{340}=400\times0.9=360$ Hz.` },
    { tier: 'a', topic: 'Mach cones',
      stem: R`Take $v=340$ m/s.`,
      parts: [R`A jet's Mach cone has a half-angle of $30^\circ$. Find the jet's speed.`, R`At what Mach number is the half-angle $60^\circ$?`],
      answer: [R`$680$ m/s (Mach $2$)`, R`$\frac{2}{\sqrt3}\approx1.15$`],
      sol: R`**(a)** $\sin\theta=\frac{v}{v_S}$: $v_S=\frac{340}{\sin30^\circ}=\frac{340}{0.5}=680$ m/s.

**(b)** $\frac{v_S}{v}=\frac{1}{\sin60^\circ}=\frac{2}{\sqrt3}\approx1.15$.` },
    { tier: 'x', topic: 'The echo of a horn',
      stem: R`A car moves at $20$ m/s straight toward a wall and sounds a $640$ Hz horn. Take $v=340$ m/s.`,
      parts: [R`What frequency reaches the wall?`, R`What frequency does the driver hear in the echo?`, R`What beat frequency does the driver hear between the horn and its echo?`],
      answer: [R`$680$ Hz`, R`$720$ Hz`, R`$80$ Hz`],
      sol: R`**(a)** The car is a source moving toward the wall: $f_1=640\times\frac{340}{340-20}=640\times\frac{17}{16}=680$ Hz.

**(b)** The wall sends back $680$ Hz from rest, and the driver is a detector moving toward it: $f_2=680\times\frac{340+20}{340}=680\times\frac{18}{17}=720$ Hz.

**(c)** $720-640=80$ Hz.` },
    { tier: 'x', topic: 'Measuring the speed of sound',
      stem: R`A $500$ Hz tuning fork is held over a tube, closed at the bottom by water, whose air column can be changed. The sound is loudest at air-column lengths of $0.17$ m and $0.51$ m (ignore end corrections).`,
      parts: [R`Find the wavelength.`, R`Find the speed of sound.`, R`At what length is the next loud spot?`],
      answer: [R`$0.68$ m`, R`$340$ m/s`, R`$0.85$ m`],
      sol: R`**(a)** A tube closed at one end resonates at $L=\frac{\lambda}{4},\frac{3\lambda}{4},\dots$, so neighbouring lengths differ by $\frac{\lambda}{2}$: $\lambda=2(0.51-0.17)=0.68$ m. **Check** $\frac{\lambda}{4}=0.17$ m.

**(b)** $v=\lambda f=0.68\times500=340$ m/s.

**(c)** $\frac{5\lambda}{4}=0.85$ m.` },
  ],

  // ===================================================================================================================
  c18: [
    { tier: 'f', topic: 'Temperature scales',
      stem: R`Convert each temperature.`,
      parts: [R`$25\ ^\circ$C to kelvins and to degrees Fahrenheit.`, R`$-40\ ^\circ$F to degrees Celsius.`, R`$0$ K to degrees Fahrenheit.`],
      answer: [R`$298.15$ K and $77\ ^\circ$F`, R`$-40\ ^\circ$C`, R`$-459.67\ ^\circ$F`],
      sol: R`**(a)** $25+273.15=298.15$ K and $\frac{9}{5}(25)+32=77\ ^\circ$F.

**(b)** $T_C=\frac{5}{9}(-40-32)=-40\ ^\circ$C: the two scales meet there.

**(c)** $0$ K $=-273.15\ ^\circ$C, so $T_F=\frac{9}{5}(-273.15)+32=-459.67\ ^\circ$F.` },
    { tier: 'f', topic: 'A rod grows',
      stem: R`An aluminium rod $2.0$ m long ($\alpha=2.3\times10^{-5}\ \text{K}^{-1}$) warms by $50$ K.`,
      parts: [R`How much longer does it get?`],
      answer: [R`$2.3$ mm`],
      sol: R`$\Delta L=L\alpha\Delta T=(2.0)(2.3\times10^{-5})(50)=2.3\times10^{-3}$ m $=2.3$ mm.` },
    { tier: 'f', topic: 'Heat to warm',
      stem: R`Copper has $c=386\ \text{J/(kg}\cdot\text{K)}$ and water $c=4186\ \text{J/(kg}\cdot\text{K)}$.`,
      parts: [R`How much heat warms $0.50$ kg of copper from $20\ ^\circ$C to $120\ ^\circ$C?`, R`How much warms $0.50$ kg of water by the same amount?`],
      answer: [R`$1.9\times10^4$ J`, R`$2.1\times10^5$ J`],
      sol: R`**(a)** $Q=cm\Delta T=(386)(0.50)(100)=19\,300\approx1.9\times10^4$ J.

**(b)** $Q=(4186)(0.50)(100)=209\,300\approx2.1\times10^5$ J, more than ten times as much: water takes a lot of heat.` },
    { tier: 'f', topic: 'Changes of phase',
      stem: R`For water $L_F=333$ kJ/kg and $L_V=2256$ kJ/kg.`,
      parts: [R`How much heat melts $2.0$ kg of ice at $0\ ^\circ$C?`, R`How much boils away $0.10$ kg of water at $100\ ^\circ$C?`],
      answer: [R`$6.7\times10^5$ J`, R`$2.3\times10^5$ J`],
      sol: R`**(a)** $Q=L_Fm=(333\times10^3)(2.0)=6.66\times10^5\approx6.7\times10^5$ J.

**(b)** $Q=L_Vm=(2256\times10^3)(0.10)=2.256\times10^5\approx2.3\times10^5$ J. The temperature stays the same in both.` },
    { tier: 'f', topic: 'Signs in the first law',
      stem: R`Find the change in a gas's internal energy in each case.`,
      parts: [R`It takes in $500$ J of heat and does $200$ J of work.`, R`It is compressed, $300$ J of work being done on it, while it gives out $100$ J of heat.`, R`It expands adiabatically, doing $150$ J of work.`],
      answer: [R`$+300$ J`, R`$+200$ J`, R`$-150$ J`],
      sol: R`**(a)** $\Delta E_\text{int}=Q-W=500-200=300$ J.

**(b)** $Q=-100$ J and $W=-300$ J (work done on the gas is negative work by it): $\Delta E_\text{int}=-100-(-300)=200$ J.

**(c)** $Q=0$: $\Delta E_\text{int}=-W=-150$ J; the gas cools.` },
    { tier: 'a', topic: 'A gas thermometer',
      stem: R`A constant-volume gas thermometer reads $60.0$ kPa at the triple point of water. Treat its gas as ideal.`,
      parts: [R`It reads $66.0$ kPa in a room. Find the room's temperature in kelvins and degrees Celsius.`, R`What does it read at $546.32$ K?`],
      answer: [R`$300.48\approx300$ K, about $27.3\ ^\circ$C`, R`$120$ kPa`],
      sol: R`**(a)** $T=(273.16\text{ K})\frac{66.0}{60.0}=273.16\times1.1=300.476\approx300$ K, and $300.48-273.15\approx27.3\ ^\circ$C.

**(b)** Twice $273.16$ K: twice the pressure, $120$ kPa.` },
    { tier: 'a', topic: 'An overflowing flask',
      stem: R`A steel flask ($\alpha=1.2\times10^{-5}\ \text{K}^{-1}$) holding $200\ \text{cm}^3$ is filled to the brim with mercury ($\beta=1.8\times10^{-4}\ \text{K}^{-1}$) at $20\ ^\circ$C, then warmed to $70\ ^\circ$C.`,
      parts: [R`How much does the mercury expand?`, R`How much does the flask's volume grow?`, R`How much mercury spills?`],
      answer: [R`$1.8\ \text{cm}^3$`, R`$0.36\ \text{cm}^3$`, R`$1.44\approx1.4\ \text{cm}^3$`],
      sol: R`**(a)** $\Delta V=V\beta\Delta T=(200)(1.8\times10^{-4})(50)=1.8\ \text{cm}^3$.

**(b)** The inside of the flask grows like steel, with $\beta=3\alpha=3.6\times10^{-5}\ \text{K}^{-1}$: $(200)(3.6\times10^{-5})(50)=0.36\ \text{cm}^3$.

**(c)** $1.8-0.36=1.44\approx1.4\ \text{cm}^3$.` },
    { tier: 'a', topic: 'Ice in warm water',
      stem: R`$400$ g of water at $60\ ^\circ$C and $100$ g of ice at $0\ ^\circ$C are mixed in an insulated cup. Take $c=1.0\ \text{cal/(g}\cdot\text{K)}$ for water and $L_F=80$ cal/g.`,
      parts: [R`How much heat melts all the ice?`, R`How much heat would the warm water give out cooling to $0\ ^\circ$C? Does all the ice melt?`, R`Find the final temperature.`],
      answer: [R`$8.0\times10^3$ cal`, R`$2.4\times10^4$ cal; yes`, R`$32\ ^\circ$C`],
      sol: R`**(a)** $Q=L_Fm=(80)(100)=8.0\times10^3$ cal.

**(b)** $(1.0)(400)(60)=2.4\times10^4$ cal, more than enough: all the ice melts.

**(c)** $\sum Q=0$: $8000+(1.0)(100)(T-0)+(1.0)(400)(T-60)=0$, so $500T=24\,000-8000=16\,000$ and $T=32\ ^\circ$C.` },
    { tier: 'a', topic: 'Work round a cycle',
      stem: R`A gas expands from $2.0$ L to $6.0$ L while its pressure falls steadily (a straight line on a $p$-$V$ diagram) from $4.0\times10^5$ Pa to $2.0\times10^5$ Pa. It is then compressed at $2.0\times10^5$ Pa back to $2.0$ L, and warmed at that volume back to its start.`,
      parts: [R`Find the work done by the gas in the expansion.`, R`Find the work done by the gas in the compression.`, R`Find the net work per cycle.`, R`Find the net heat per cycle.`],
      answer: [R`$1200$ J`, R`$-800$ J`, R`$400$ J`, R`$400$ J`],
      sol: R`**(a)** The area under the straight line, a trapezoid: $W=\frac{4.0+2.0}{2}\times10^5\times(4.0\times10^{-3})=1200$ J.

**(b)** $W=p\Delta V=(2.0\times10^5)(-4.0\times10^{-3})=-800$ J.

**(c)** The last step keeps the volume fixed: no work. Net $1200-800=400$ J, the area of the triangle.

**(d)** Round a cycle $\Delta E_\text{int}=0$, so $Q=W=400$ J.` },
    { tier: 'a', topic: 'The first law at constant pressure',
      stem: R`A gas at a constant $1.5\times10^5$ Pa expands from $1.0$ L to $3.0$ L while it takes in $750$ J of heat.`,
      parts: [R`Find the work done by the gas.`, R`Find the change in its internal energy.`],
      answer: [R`$300$ J`, R`$+450$ J`],
      sol: R`**(a)** $W=p\Delta V=(1.5\times10^5)(2.0\times10^{-3})=300$ J.

**(b)** $\Delta E_\text{int}=Q-W=750-300=450$ J.` },
    { tier: 'a', topic: 'Heat through a wall',
      stem: R`A brick wall has an area of $4.0\ \text{m}^2$, a thickness of $0.20$ m and $k=0.80\ \text{W/(m}\cdot\text{K)}$. It is $25$ K warmer inside than out. Module 18-6 (not on the class schedule).`,
      parts: [R`Find the rate of heat flow through it.`, R`A layer of insulation $0.050$ m thick with $k=0.040\ \text{W/(m}\cdot\text{K)}$ is added. Find the new rate.`, R`How much heat passes through the bare wall in a day?`],
      answer: [R`$400$ W`, R`About $67$ W`, R`About $3.5\times10^7$ J`],
      sol: R`**(a)** $P=kA\frac{\Delta T}{L}=(0.80)(4.0)\frac{25}{0.20}=400$ W.

**(b)** Resistances add: $\frac{L_1}{k_1}+\frac{L_2}{k_2}=\frac{0.20}{0.80}+\frac{0.050}{0.040}=0.25+1.25=1.5\ \text{m}^2\cdot\text{K/W}$, so $P=\frac{(4.0)(25)}{1.5}\approx67$ W.

**(c)** $400\times86\,400\approx3.5\times10^7$ J.` },
    { tier: 'x', topic: 'Radiation',
      stem: R`Take $\sigma=5.67\times10^{-8}\ \text{W/(m}^2\cdot\text{K}^4\text{)}$ and treat each surface as a blackbody. Module 18-6 (not on the class schedule).`,
      parts: [R`How much power does $1.0\ \text{m}^2$ of surface radiate at $300$ K?`, R`What is its net loss in surroundings also at $300$ K?`, R`How much does it radiate at $600$ K?`],
      answer: [R`About $459$ W`, R`$0$`, R`About $7.3\times10^3$ W`],
      sol: R`**(a)** $P=\sigma AT^4=(5.67\times10^{-8})(1.0)(300)^4=(5.67\times10^{-8})(8.1\times10^9)\approx459$ W.

**(b)** It absorbs as much as it emits: $P_\text{net}=\sigma A(T_\text{env}^4-T^4)=0$.

**(c)** Twice the temperature, $2^4=16$ times the power: $16\times459\approx7.3\times10^3$ W.` },
    { tier: 'x', topic: 'Heat bookkeeping round a cycle',
      stem: R`A gas goes round a cycle. A to B: it expands at a constant $2.0\times10^5$ Pa from $1.0$ L to $4.0$ L, taking in $1500$ J of heat. B to C: at constant volume it gives out $900$ J of heat. C to A: it returns to A, with $450$ J of work done on it.`,
      parts: [R`Find the work done by the gas from A to B.`, R`Find its change in internal energy from A to B.`, R`Find the heat from C to A.`, R`Find the net work per cycle.`],
      answer: [R`$600$ J`, R`$+900$ J`, R`$-450$ J (given out)`, R`$150$ J`],
      sol: R`**(a)** $W_{AB}=p\Delta V=(2.0\times10^5)(3.0\times10^{-3})=600$ J.

**(b)** $\Delta E_{AB}=Q-W=1500-600=900$ J.

**(c)** B to C: $W=0$, so $\Delta E_{BC}=-900$ J. Round the cycle the changes add to zero, so $\Delta E_{CA}=0$ and $Q_{CA}=\Delta E_{CA}+W_{CA}=0+(-450)=-450$ J.

**(d)** $W=600+0-450=150$ J. **Check** the net heat: $1500-900-450=150$ J.` },
  ],

  // ===================================================================================================================
  c19: [
    { tier: 'f', topic: 'Moles and molecules',
      stem: R`Oxygen gas, $\text{O}_2$, has $M=32$ g/mol. Use $N_A=6.02\times10^{23}\ \text{mol}^{-1}$.`,
      parts: [R`How many moles are in $64$ g of it?`, R`How many molecules?`, R`Find the mass of one molecule.`],
      answer: [R`$2.0$ mol`, R`$1.2\times10^{24}$`, R`$5.3\times10^{-26}$ kg`],
      sol: R`**(a)** $n=\frac{64}{32}=2.0$ mol.

**(b)** $N=nN_A=2.0\times6.02\times10^{23}\approx1.2\times10^{24}$.

**(c)** $m=\frac{M}{N_A}=\frac{0.032}{6.02\times10^{23}}\approx5.3\times10^{-26}$ kg.` },
    { tier: 'f', topic: 'The ideal gas law',
      stem: R`Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$.`,
      parts: [R`Find the pressure of $2.0$ mol of an ideal gas at $300$ K in $50$ L.`, R`Find the volume of $1.0$ mol at $1.0\times10^5$ Pa and $273$ K.`, R`A gas in a closed rigid tank is warmed from $300$ K to $450$ K. By what factor does its pressure grow?`],
      answer: [R`$1.0\times10^5$ Pa`, R`$22.7$ L`, R`$1.5$`],
      sol: R`**(a)** $p=\frac{nRT}{V}=\frac{(2.0)(8.31)(300)}{0.050}=\frac{4986}{0.050}\approx1.0\times10^5$ Pa.

**(b)** $V=\frac{nRT}{p}=\frac{(1.0)(8.31)(273)}{1.0\times10^5}\approx2.27\times10^{-2}\ \text{m}^3=22.7$ L.

**(c)** Fixed $V$ and $n$: $p\propto T$, so $\frac{450}{300}=1.5$.` },
    { tier: 'f', topic: 'rms speed',
      stem: R`Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$. Helium has $M=4.0$ g/mol and neon $M=20$ g/mol.`,
      parts: [R`Find the rms speed of helium atoms at $300$ K.`, R`Find it at $1200$ K.`, R`At one temperature, how many times faster (rms) are helium atoms than neon atoms?`],
      answer: [R`About $1.4\times10^3$ m/s`, R`About $2.7\times10^3$ m/s`, R`$\sqrt5\approx2.2$ times`],
      sol: R`**(a)** $v_\text{rms}=\sqrt{\frac{3(8.31)(300)}{0.0040}}=\sqrt{1.87\times10^6}\approx1.4\times10^3$ m/s.

**(b)** Four times the temperature, twice the speed: about $2.7\times10^3$ m/s.

**(c)** $\sqrt{\frac{20}{4.0}}=\sqrt5\approx2.2$ times.` },
    { tier: 'f', topic: 'Kinetic energy and temperature',
      stem: R`Use $k=1.38\times10^{-23}$ J/K.`,
      parts: [R`Find the average translational kinetic energy of a molecule at $400$ K.`, R`At what temperature is it $1.0\times10^{-20}$ J?`, R`At one temperature, which has the larger average kinetic energy, a helium atom or an oxygen molecule?`],
      answer: [R`$8.3\times10^{-21}$ J`, R`About $483$ K`, R`Neither: they are equal`],
      sol: R`**(a)** $K_\text{avg}=\frac{3}{2}kT=\frac{3}{2}(1.38\times10^{-23})(400)=8.28\times10^{-21}\approx8.3\times10^{-21}$ J.

**(b)** $T=\frac{2K_\text{avg}}{3k}=\frac{2.0\times10^{-20}}{4.14\times10^{-23}}\approx483$ K.

**(c)** $\frac{3}{2}kT$ depends only on $T$: the same. The helium atom moves faster, but it is lighter.` },
    { tier: 'f', topic: 'Specific heats of gases',
      stem: R`Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$ and treat each gas as ideal.`,
      parts: [R`Find $C_V$, $C_p$ and $\gamma$ for helium (monatomic).`, R`For oxygen (diatomic).`, R`For methane (polyatomic).`],
      answer: [R`$12.5$, $20.8\ \text{J/(mol}\cdot\text{K)}$; $\frac{5}{3}\approx1.67$`, R`$20.8$, $29.1\ \text{J/(mol}\cdot\text{K)}$; $1.40$`, R`$24.9$, $33.2\ \text{J/(mol}\cdot\text{K)}$; $\frac{4}{3}\approx1.33$`],
      sol: R`**(a)** $f=3$: $C_V=\frac{3}{2}R\approx12.5$, $C_p=C_V+R=\frac{5}{2}R\approx20.8$, $\gamma=\frac{5}{3}$.

**(b)** $f=5$: $C_V=\frac{5}{2}R\approx20.8$, $C_p=\frac{7}{2}R\approx29.1$, $\gamma=\frac{7}{5}=1.40$.

**(c)** $f=6$: $C_V=3R\approx24.9$, $C_p=4R\approx33.2$, $\gamma=\frac{4}{3}$.` },
    { tier: 'a', topic: 'Squeezing at constant temperature',
      stem: R`$0.50$ mol of an ideal gas at $300$ K is slowly compressed at constant temperature from $20$ L to $5.0$ L. Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$ and $\ln4\approx1.39$.`,
      parts: [R`Find the work done by the gas.`, R`Find the heat it takes in.`, R`Find its final pressure.`],
      answer: [R`About $-1.7\times10^3$ J`, R`About $-1.7\times10^3$ J (given out)`, R`About $2.5\times10^5$ Pa`],
      sol: R`**(a)** $W=nRT\ln\frac{V_f}{V_i}=(0.50)(8.31)(300)\ln\frac{1}{4}=-1246.5\times1.39\approx-1.7\times10^3$ J: work is done on the gas.

**(b)** Constant $T$ means $\Delta E_\text{int}=0$, so $Q=W\approx-1.7\times10^3$ J: the gas gives that much heat away.

**(c)** $p_i=\frac{(0.50)(8.31)(300)}{0.020}\approx6.2\times10^4$ Pa, and a quarter of the volume means four times the pressure: about $2.5\times10^5$ Pa.` },
    { tier: 'a', topic: 'Warming helium at constant pressure',
      stem: R`$3.0$ mol of helium (monatomic) is warmed at constant pressure from $300$ K to $350$ K. Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$.`,
      parts: [R`How much heat does it take?`, R`Find the change in internal energy.`, R`Find the work done by the gas.`],
      answer: [R`About $3.1\times10^3$ J`, R`About $1.9\times10^3$ J`, R`About $1.2\times10^3$ J`],
      sol: R`**(a)** $Q=nC_p\Delta T=(3.0)\left(\tfrac{5}{2}\times8.31\right)(50)\approx3116\approx3.1\times10^3$ J.

**(b)** $\Delta E_\text{int}=nC_V\Delta T=(3.0)\left(\tfrac{3}{2}\times8.31\right)(50)\approx1870\approx1.9\times10^3$ J.

**(c)** $W=nR\Delta T=(3.0)(8.31)(50)\approx1246\approx1.2\times10^3$ J. **Check** $1870+1246=3116$.` },
    { tier: 'a', topic: 'Mean free path and pressure',
      stem: R`In a gas at room temperature and $1.0\times10^5$ Pa, the mean free path is $1.0\times10^{-7}$ m. Keep the temperature fixed.`,
      parts: [R`Find the mean free path at $1.0$ Pa.`, R`Find it in a vacuum chamber at $1.0\times10^{-4}$ Pa.`],
      answer: [R`$1.0\times10^{-2}$ m`, R`$1.0\times10^2$ m`],
      sol: R`**(a)** $\lambda\propto\frac{V}{N}=\frac{kT}{p}$, so at fixed $T$, $\lambda\propto\frac{1}{p}$: $10^5$ times lower pressure, $10^5$ times longer, $1.0\times10^{-2}$ m.

**(b)** $10^9$ times lower than at the start: $1.0\times10^2$ m, longer than the chamber, so the molecules mostly hit the walls.` },
    { tier: 'a', topic: 'The three speeds',
      stem: R`Nitrogen molecules at $300$ K have an rms speed of $517$ m/s.`,
      parts: [R`Find their most probable speed.`, R`Find their average speed.`],
      answer: [R`About $422$ m/s`, R`About $476$ m/s`],
      sol: R`**(a)** $\frac{v_P}{v_\text{rms}}=\sqrt{\frac{2}{3}}$: $v_P=517\times0.816\approx422$ m/s.

**(b)** $\frac{v_\text{avg}}{v_\text{rms}}=\sqrt{\frac{8}{3\pi}}\approx0.921$: $v_\text{avg}\approx476$ m/s.` },
    { tier: 'a', topic: 'A diatomic gas warmed two ways',
      stem: R`$2.0$ mol of nitrogen (diatomic) is warmed by $20$ K. Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$.`,
      parts: [R`How much heat does it take at constant volume?`, R`At constant pressure?`, R`How much work does it do at constant pressure?`],
      answer: [R`About $831$ J`, R`About $1.16\times10^3$ J`, R`About $332$ J`],
      sol: R`**(a)** $Q=nC_V\Delta T=(2.0)\left(\tfrac{5}{2}\times8.31\right)(20)=831$ J.

**(b)** $Q=nC_p\Delta T=(2.0)\left(\tfrac{7}{2}\times8.31\right)(20)\approx1163\approx1.16\times10^3$ J.

**(c)** $W=nR\Delta T=(2.0)(8.31)(20)\approx332$ J, the difference.` },
    { tier: 'a', topic: 'A diesel engine’s squeeze',
      stem: R`Air ($\gamma=1.4$) at $300$ K and $1.0\times10^5$ Pa is squeezed quickly (adiabatically) to $\frac{1}{32}$ of its volume. Treat it as $1.0$ mol of a diatomic ideal gas; $R=8.31\ \text{J/(mol}\cdot\text{K)}$. Module 19-9 (not on the class schedule).`,
      parts: [R`Find its final temperature.`, R`Find its final pressure.`, R`How much work is done on it?`],
      answer: [R`$1200$ K`, R`$1.28\times10^7$ Pa`, R`About $1.9\times10^4$ J`],
      sol: R`**(a)** $TV^{\gamma-1}$ stays the same: $T_f=300\times32^{0.4}=300\times2^{2}=1200$ K, since $32^{0.4}=(2^5)^{0.4}=2^2$.

**(b)** $pV^\gamma$ stays the same: $p_f=(1.0\times10^5)\times32^{1.4}=(1.0\times10^5)\times2^7=1.28\times10^7$ Pa.

**(c)** $Q=0$, so the work done on it all becomes internal energy: $nC_V\Delta T=(1.0)\left(\tfrac{5}{2}\times8.31\right)(900)\approx1.9\times10^4$ J. That heat is what ignites the fuel.` },
    { tier: 'x', topic: 'A three-step cycle',
      stem: R`$1.0$ mol of a monatomic ideal gas is warmed at constant pressure from $300$ K to $600$ K (A to B), cooled at constant volume back to $300$ K (B to C), and compressed at $300$ K back to A (C to A). Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$ and $\ln2\approx0.693$.`,
      parts: [R`Find the heat taken in and the work done from A to B.`, R`Find the heat from B to C.`, R`Find the work done by the gas from C to A.`, R`Find the net work per cycle and the efficiency (net work over heat taken in).`],
      answer: [R`$Q\approx6.2\times10^3$ J, $W\approx2.5\times10^3$ J`, R`About $-3.7\times10^3$ J`, R`About $-1.7\times10^3$ J`, R`About $765$ J, an efficiency of about $0.12$`],
      sol: R`**(a)** $Q_{AB}=nC_p\Delta T=\tfrac{5}{2}(8.31)(300)\approx6232$ J and $W_{AB}=nR\Delta T=(8.31)(300)=2493$ J.

**(b)** $Q_{BC}=nC_V\Delta T=\tfrac{3}{2}(8.31)(-300)\approx-3740$ J, with no work.

**(c)** At constant $p$ the volume doubled from A to B, so $V_C=2V_A$: $W_{CA}=nRT\ln\frac{V_A}{V_C}=-2493\ln2\approx-1728$ J.

**(d)** $W=2493+0-1728\approx765$ J. Heat comes in only from A to B, so the efficiency is $\frac{765}{6232}\approx0.12$.` },
    { tier: 'x', topic: 'Pressure from molecules',
      stem: R`A container of $1.0$ L holds $1.2$ g of nitrogen ($M=28$ g/mol) whose molecules have an rms speed of $500$ m/s. Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$.`,
      parts: [R`Find the pressure.`, R`Find the temperature.`, R`Check the answer with the ideal gas law.`],
      answer: [R`$1.0\times10^5$ Pa`, R`About $281$ K`, R`$pV\approx100$ J and $nRT\approx100$ J`],
      sol: R`**(a)** $p=\frac{nMv_\text{rms}^2}{3V}$, and $nM$ is the gas's mass: $p=\frac{(1.2\times10^{-3})(500)^2}{3(1.0\times10^{-3})}=1.0\times10^5$ Pa.

**(b)** $v_\text{rms}^2=\frac{3RT}{M}$ gives $T=\frac{Mv_\text{rms}^2}{3R}=\frac{(0.028)(2.5\times10^5)}{24.93}\approx281$ K.

**(c)** $n=\frac{1.2}{28}\approx0.0429$ mol: $nRT\approx(0.0429)(8.31)(281)\approx100$ J, and $pV=(1.0\times10^5)(1.0\times10^{-3})=100$ J.` },
    { tier: 'x', topic: 'Free versus isothermal expansion',
      stem: R`$1.0$ mol of an ideal gas at $300$ K goes from $10$ L to $30$ L. Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$ and $\ln3\approx1.10$.`,
      parts: [R`It rushes into a vacuum (free expansion). Find $Q$, $W$ and the change in temperature.`, R`Instead it expands slowly at $300$ K. Find the work done.`, R`Find the final pressure in each case.`],
      answer: [R`$Q=0$, $W=0$, no change in temperature`, R`About $2.7\times10^3$ J`, R`About $8.3\times10^4$ Pa both times`],
      sol: R`**(a)** Nothing pushes back and nothing heats it: $Q=W=0$, so $\Delta E_\text{int}=0$ and an ideal gas keeps $T=300$ K.

**(b)** $W=nRT\ln\frac{V_f}{V_i}=(8.31)(300)\ln3\approx2493\times1.10\approx2.7\times10^3$ J.

**(c)** Both end at $300$ K and $30$ L: $p=\frac{(1.0)(8.31)(300)}{0.030}\approx8.3\times10^4$ Pa. The end state is the same; the path isn't.` },
  ],

  // ===================================================================================================================
  c20: [
    { tier: 'f', topic: 'Entropy of a change of phase',
      stem: R`For water $L_F=333$ kJ/kg and $L_V=2256$ kJ/kg.`,
      parts: [R`Find the change in entropy of $2.0$ kg of ice melting at $273$ K.`, R`Find it for $0.50$ kg of water boiling at $373$ K.`],
      answer: [R`About $2.4\times10^3$ J/K`, R`About $3.0\times10^3$ J/K`],
      sol: R`**(a)** At a fixed temperature $\Delta S=\frac{Q}{T}=\frac{(333\times10^3)(2.0)}{273}\approx2.4\times10^3$ J/K.

**(b)** $\Delta S=\frac{(2256\times10^3)(0.50)}{373}\approx3.0\times10^3$ J/K.` },
    { tier: 'f', topic: 'Efficiency of an engine',
      stem: R`An engine takes in $2000$ J of heat and does $500$ J of work each cycle.`,
      parts: [R`Find its efficiency.`, R`How much heat does it give out each cycle?`],
      answer: [R`$0.25$`, R`$1500$ J`],
      sol: R`**(a)** $\varepsilon=\frac{|W|}{|Q_H|}=\frac{500}{2000}=0.25$.

**(b)** $|Q_L|=|Q_H|-|W|=1500$ J.` },
    { tier: 'f', topic: 'Carnot efficiency',
      stem: R`Find the efficiency of a Carnot engine in each case.`,
      parts: [R`Between $800$ K and $400$ K.`, R`Between $500\ ^\circ$C and $25\ ^\circ$C.`],
      answer: [R`$0.50$`, R`$1-\frac{298}{773}\approx0.61$`],
      sol: R`**(a)** $\varepsilon_C=1-\frac{400}{800}=0.50$.

**(b)** In kelvins: $773$ K and $298$ K, so $\varepsilon_C=1-\frac{298}{773}\approx0.61$. With degrees Celsius it would wrongly come out $0.95$.` },
    { tier: 'f', topic: 'A refrigerator',
      stem: R`Module 20-3 (not on the class schedule).`,
      parts: [R`A refrigerator with $K=3.0$ removes $600$ J from its inside. How much work does it need, and how much heat goes to the kitchen?`, R`Find the coefficient of performance of a Carnot refrigerator between $250$ K and $300$ K.`],
      answer: [R`$200$ J of work; $800$ J to the kitchen`, R`$5.0$`],
      sol: R`**(a)** $|W|=\frac{|Q_L|}{K}=\frac{600}{3.0}=200$ J, and $|Q_H|=600+200=800$ J.

**(b)** $K_C=\frac{T_L}{T_H-T_L}=\frac{250}{50}=5.0$.` },
    { tier: 'f', topic: 'Counting microstates',
      stem: R`Six identical molecules move about in a box with two halves.`,
      parts: [R`Find the multiplicity of three in each half.`, R`Find the multiplicity of all six in one half.`, R`How many microstates are there in all? What is the chance of finding all six in the left half?`],
      answer: [R`$20$`, R`$1$`, R`$64$; $\frac{1}{64}$`],
      sol: R`**(a)** $W=\frac{6!}{3!\,3!}=\frac{720}{36}=20$.

**(b)** $W=\frac{6!}{6!\,0!}=1$.

**(c)** $2^6=64$ microstates, so $\frac{1}{64}$.` },
    { tier: 'a', topic: 'Entropy of an isothermal expansion',
      stem: R`$2.0$ mol of an ideal gas expands slowly at $400$ K. Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$, $\ln2\approx0.693$ and $\ln3\approx1.10$.`,
      parts: [R`Find its change in entropy when its volume doubles.`, R`How much heat does it take in?`, R`Find the change in entropy for three times the volume.`],
      answer: [R`About $11.5$ J/K`, R`About $4.6\times10^3$ J`, R`About $18.3$ J/K`],
      sol: R`**(a)** $\Delta S=nR\ln\frac{V_f}{V_i}=(2.0)(8.31)(0.693)\approx11.5$ J/K.

**(b)** $Q=T\Delta S=400\times11.5\approx4.6\times10^3$ J.

**(c)** $\Delta S=(2.0)(8.31)(1.10)\approx18.3$ J/K.` },
    { tier: 'a', topic: 'Entropy of warming water',
      stem: R`$1.0$ kg of water ($c=4186\ \text{J/(kg}\cdot\text{K)}$) is warmed slowly from $273$ K to $373$ K. Use $\ln\frac{373}{273}\approx0.312$.`,
      parts: [R`Find its change in entropy.`, R`Find the heat it takes in, and compare $\frac{Q}{T}$ at the two ends.`],
      answer: [R`About $1.3\times10^3$ J/K`, R`About $4.2\times10^5$ J; $\frac{Q}{T}$ lies between about $1.1\times10^3$ and $1.5\times10^3$ J/K`],
      sol: R`**(a)** $\Delta S=\int\frac{mc\,dT}{T}=mc\ln\frac{T_f}{T_i}=(4186)(0.312)\approx1.3\times10^3$ J/K.

**(b)** $Q=mc\Delta T=(4186)(100)\approx4.2\times10^5$ J. Divided by $373$ K it is about $1.1\times10^3$ J/K, by $273$ K about $1.5\times10^3$ J/K: the true value lies between, because $T$ changes along the way.` },
    { tier: 'a', topic: 'Heat from hot to cold',
      stem: R`$1200$ J of heat flows from a reservoir at $400$ K to one at $300$ K.`,
      parts: [R`Find the change in entropy of the hot reservoir.`, R`Of the cold one.`, R`Of the two together.`],
      answer: [R`$-3.0$ J/K`, R`$+4.0$ J/K`, R`$+1.0$ J/K`],
      sol: R`**(a)** $\Delta S_H=-\frac{1200}{400}=-3.0$ J/K.

**(b)** $\Delta S_L=+\frac{1200}{300}=+4.0$ J/K.

**(c)** $+1.0$ J/K: positive, as the second law requires of an irreversible process.` },
    { tier: 'a', topic: 'A Carnot engine in numbers',
      stem: R`A Carnot engine works between $600$ K and $400$ K and does $500$ J of work each cycle.`,
      parts: [R`Find its efficiency.`, R`Find the heats it takes in and gives out each cycle.`, R`Find the change in entropy per cycle of the hot reservoir, of the cold one, and of the gas.`],
      answer: [R`$\frac{1}{3}$`, R`$1500$ J in and $1000$ J out`, R`$-2.5$ J/K, $+2.5$ J/K and $0$`],
      sol: R`**(a)** $\varepsilon_C=1-\frac{400}{600}=\frac{1}{3}$.

**(b)** $|Q_H|=\frac{|W|}{\varepsilon}=1500$ J and $|Q_L|=1500-500=1000$ J.

**(c)** $-\frac{1500}{600}=-2.5$ J/K and $+\frac{1000}{400}=+2.5$ J/K: the total is zero, a reversible engine. The gas returns to its start, so its own change is $0$.` },
    { tier: 'a', topic: 'Mixing hot and cold water',
      stem: R`$1.0$ kg of water at $360$ K is mixed with $1.0$ kg at $300$ K in an insulated container ($c=4186\ \text{J/(kg}\cdot\text{K)}$). Use $\ln1.1\approx0.0953$ and $\ln\frac{12}{11}\approx0.0870$.`,
      parts: [R`Find the final temperature.`, R`Find the change in entropy of each part.`, R`Find the total change in entropy.`],
      answer: [R`$330$ K`, R`About $-364$ J/K and $+399$ J/K`, R`About $+35$ J/K`],
      sol: R`**(a)** Equal masses of the same water: $T=\frac{360+300}{2}=330$ K.

**(b)** Hot: $mc\ln\frac{330}{360}=4186\ln\frac{11}{12}\approx-4186(0.0870)\approx-364$ J/K. Cold: $4186\ln\frac{330}{300}=4186\ln1.1\approx+399$ J/K.

**(c)** $399-364\approx+35$ J/K: mixing is irreversible.` },
    { tier: 'x', topic: 'An engine that can’t exist',
      stem: R`An inventor claims an engine working between $500$ K and $300$ K that takes in $1000$ J of heat and does $450$ J of work each cycle.`,
      parts: [R`Compare its efficiency with a Carnot engine's.`, R`Find the change in entropy of the two reservoirs per cycle if it worked.`, R`What is the most work any engine could do from that $1000$ J?`],
      answer: [R`$0.45$, more than the Carnot $0.40$`, R`About $-0.17$ J/K: impossible`, R`$400$ J`],
      sol: R`**(a)** $\varepsilon=\frac{450}{1000}=0.45$, but $\varepsilon_C=1-\frac{300}{500}=0.40$.

**(b)** The hot reservoir loses $\frac{1000}{500}=2.0$ J/K, the cold one gains $\frac{1000-450}{300}\approx1.83$ J/K: a total of about $-0.17$ J/K, a decrease, which the second law forbids.

**(c)** A Carnot engine: $0.40\times1000=400$ J.` },
    { tier: 'x', topic: 'Entropy, two ways',
      stem: R`$1.0$ mol of an ideal gas doubles its volume by a free expansion. Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$, $k=1.38\times10^{-23}$ J/K, $N_A=6.02\times10^{23}\ \text{mol}^{-1}$ and $\ln2\approx0.693$.`,
      parts: [R`Find its change in entropy from thermodynamics.`, R`Each molecule now has twice the room, so the number of microstates grows $2^{N_A}$ times. Find the change in entropy from $S=k\ln W$.`, R`What is the chance that all the molecules go back into the first half by themselves?`],
      answer: [R`$R\ln2\approx5.76$ J/K`, R`$N_Ak\ln2\approx5.76$ J/K, the same`, R`$2^{-N_A}$: never, in practice`],
      sol: R`**(a)** Along a reversible isothermal path between the same states: $\Delta S=nR\ln2=8.31\times0.693\approx5.76$ J/K.

**(b)** $\Delta S=k\ln2^{N_A}=N_Ak\ln2=(6.02\times10^{23})(1.38\times10^{-23})(0.693)\approx5.76$ J/K, since $N_Ak=R$.

**(c)** Each molecule has a chance of $\frac{1}{2}$, so all of them: $\left(\frac{1}{2}\right)^{N_A}$, a number with about $1.8\times10^{23}$ zeros after the decimal point.` },
    { tier: 'x', topic: 'A freezer',
      stem: R`A Carnot freezer keeps its inside at $255$ K in a kitchen at $300$ K. Module 20-3 (not on the class schedule).`,
      parts: [R`Find its coefficient of performance.`, R`How much work does it need to remove $1.7\times10^6$ J from its inside?`, R`How much heat goes into the kitchen?`],
      answer: [R`$\frac{17}{3}\approx5.7$`, R`$3.0\times10^5$ J`, R`$2.0\times10^6$ J`],
      sol: R`**(a)** $K_C=\frac{255}{300-255}=\frac{255}{45}=\frac{17}{3}\approx5.7$.

**(b)** $|W|=\frac{|Q_L|}{K}=\frac{1.7\times10^6\times3}{17}=3.0\times10^5$ J.

**(c)** $|Q_H|=1.7\times10^6+0.3\times10^6=2.0\times10^6$ J.` },
  ],
};
