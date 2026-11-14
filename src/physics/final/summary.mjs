// The final's Summary tab: for every module of Chapters 15–20 (titles and class dates in content.mjs), its key ideas
// in a few short points and one worked example, then a "Watch out" list for each chapter and exam-day habits at the end.
// The examples are original, solved step by step (one step per paragraph or list item of `sol`), and checked numerically
// in verify.py. Markup as in ../quizzes.mjs; in `ideas`, key formulas stand full size on their own line as $$…$$.
import { FINAL_ADDED } from './content.mjs';

const R = String.raw;
export const SUMMARY_ADDED = FINAL_ADDED;

export const summary = {
  // ===================================================================================================================
  c15: { mods: [
    { no: '15-1',
      ideas: R`
- **Period and frequency.** One oscillation takes the period $T$; the frequency $f=\frac{1}{T}$ counts oscillations per second, in hertz ($1\text{ Hz}=1\text{ s}^{-1}$).
- **Simple harmonic motion (SHM)** is a displacement that goes as a cosine, with amplitude $x_m$, angular frequency $\omega$ (rad/s) and phase constant $\phi$:
$$x(t)=x_m\cos(\omega t+\phi),\qquad \omega=\frac{2\pi}{T}=2\pi f$$
- **Velocity and acceleration** come from differentiating: $v=-\omega x_m\sin(\omega t+\phi)$ and $a=-\omega^2x_m\cos(\omega t+\phi)$, so
$$a=-\omega^2x$$
- **Where the extremes are.** The speed is largest, $\omega x_m$, at $x=0$; the acceleration is largest, $\omega^2x_m$, at the turning points $x=\pm x_m$.
- **The force law.** A restoring force proportional to the displacement, $F=-kx$, gives SHM. For a block on a spring
$$\omega=\sqrt{\frac{k}{m}},\qquad T=2\pi\sqrt{\frac{m}{k}}$$
The period doesn't depend on the amplitude.`,
      ex: {
        stem: R`A $0.50$ kg block on a frictionless floor is fixed to a spring with $k=50$ N/m. It is pulled $0.20$ m from equilibrium and released from rest at $t=0$.`,
        fig: 'f15-spring',
        parts: [
          R`Find the angular frequency, the period and the frequency.`,
          R`Write $x(t)$.`,
          R`Find the greatest speed and the greatest acceleration.`,
          R`How fast is the block moving as it passes $x=0.12$ m?`,
        ],
        answer: [R`$\omega=10$ rad/s, $T=\frac{\pi}{5}\approx0.63$ s, $f=\frac{5}{\pi}\approx1.6$ Hz`, R`$x(t)=0.20\cos(10t)$ m, with $t$ in seconds`,
          R`$v_m=2.0$ m/s and $a_m=20\ \text{m/s}^2$`, R`$1.6$ m/s`],
        sol: R`**(a)** $\omega=\sqrt{\frac{k}{m}}=\sqrt{\frac{50}{0.50}}=\sqrt{100}=10$ rad/s. Then $T=\frac{2\pi}{\omega}=\frac{2\pi}{10}=\frac{\pi}{5}\approx0.63$ s and $f=\frac{1}{T}=\frac{5}{\pi}\approx1.6$ Hz.

**(b)** At $t=0$ the block is at rest at $x=+0.20$ m, a turning point, so $x_m=0.20$ m and $\cos\phi=1$: $\phi=0$. Then $x(t)=0.20\cos(10t)$ m.

**(c)** $v_m=\omega x_m=10\times0.20=2.0$ m/s, as it passes $x=0$, and $a_m=\omega^2x_m=100\times0.20=20\ \text{m/s}^2$, at the turning points.

**(d)** At $x=0.12$ m, $\cos(10t)=\frac{0.12}{0.20}=0.6$, so $|\sin(10t)|=0.8$ (the 3-4-5 triangle). The speed is $\omega x_m|\sin(10t)|=2.0\times0.8=1.6$ m/s.`,
      } },
    { no: '15-2',
      ideas: R`
- **Two kinds of energy:** the spring's potential energy and the block's kinetic energy,
$$U=\tfrac{1}{2}kx^2,\qquad K=\tfrac{1}{2}mv^2$$
- **Mechanical energy is conserved** without friction. It is all potential at the turning points and all kinetic at $x=0$:
$$E=U+K=\tfrac{1}{2}kx_m^2=\tfrac{1}{2}mv_m^2$$
- **Speed at any position.** From $\frac{1}{2}mv^2=\frac{1}{2}k(x_m^2-x^2)$:
$$v=\omega\sqrt{x_m^2-x^2}$$
- **How the energy is shared.** At $x=\frac{x_m}{2}$ only a quarter of it is potential; $U=K$ at $x=\pm\frac{x_m}{\sqrt2}$.`,
      ex: {
        stem: R`A $2.0$ kg block on a spring with $k=200$ N/m oscillates on a frictionless floor with an amplitude of $0.10$ m.`,
        parts: [
          R`Find the mechanical energy.`,
          R`Find the greatest speed.`,
          R`Find the potential energy, the kinetic energy and the speed at $x=0.060$ m.`,
          R`Where is the kinetic energy equal to the potential energy?`,
        ],
        answer: [R`$1.0$ J`, R`$1.0$ m/s`, R`$U=0.36$ J, $K=0.64$ J, $v=0.80$ m/s`, R`$x=\pm\frac{0.10}{\sqrt2}\approx\pm0.071$ m`],
        sol: R`**(a)** $E=\frac{1}{2}kx_m^2=\frac{1}{2}(200)(0.10)^2=1.0$ J.

**(b)** It is all kinetic at $x=0$: $\frac{1}{2}(2.0)v_m^2=1.0$, so $v_m=1.0$ m/s. **Check** $\omega=\sqrt{\frac{200}{2.0}}=10$ rad/s and $\omega x_m=1.0$ m/s.

**(c)** $U=\frac{1}{2}(200)(0.060)^2=100\times0.0036=0.36$ J, so $K=1.0-0.36=0.64$ J and $v=\sqrt{\frac{2K}{m}}=\sqrt{0.64}=0.80$ m/s.

**(d)** $U=K$ means $U=\frac{E}{2}$: $\frac{1}{2}kx^2=\frac{1}{2}\cdot\frac{1}{2}kx_m^2$, so $x=\pm\frac{x_m}{\sqrt2}=\pm\frac{0.10}{\sqrt2}=\pm0.05\sqrt2\approx\pm0.071$ m.`,
      } },
    { no: '15-3',
      ideas: R`
- **A torsion pendulum** is a disk hung on a wire. Twisted by an angle $\theta$, the wire twists back with a torque proportional to the angle ($\kappa$, the torsion constant, in N·m/rad):
$$\tau=-\kappa\theta$$
- **Angular SHM.** It is a block on a spring with $m\to I$ and $k\to\kappa$: $\theta=\theta_m\cos(\omega t+\phi)$ with
$$\omega=\sqrt{\frac{\kappa}{I}},\qquad T=2\pi\sqrt{\frac{I}{\kappa}}$$
- **Measuring rotational inertia.** On the same wire $T\propto\sqrt{I}$, so $\frac{I_2}{I_1}=\left(\frac{T_2}{T_1}\right)^2$.`,
      ex: {
        stem: R`A disk with rotational inertia $0.020\ \text{kg}\cdot\text{m}^2$ hangs from a wire with torsion constant $\kappa=0.50\ \text{N}\cdot\text{m/rad}$. It is twisted by $0.20$ rad and released.`,
        parts: [
          R`Find the angular frequency and the period.`,
          R`Find the disk's greatest angular speed.`,
          R`Another object on the same wire swings with twice the period. Find its rotational inertia.`,
        ],
        answer: [R`$\omega=5.0$ rad/s, $T=\frac{2\pi}{5}\approx1.3$ s`, R`$1.0$ rad/s`, R`$0.080\ \text{kg}\cdot\text{m}^2$`],
        sol: R`**(a)** $\omega=\sqrt{\frac{\kappa}{I}}=\sqrt{\frac{0.50}{0.020}}=\sqrt{25}=5.0$ rad/s and $T=\frac{2\pi}{\omega}=\frac{2\pi}{5}\approx1.3$ s.

**(b)** As for a spring, the greatest rate of change is $\omega$ times the amplitude: $\left|\frac{d\theta}{dt}\right|_\text{max}=\omega\theta_m=5.0\times0.20=1.0$ rad/s. Two different quantities: $\omega$ is how fast the oscillation repeats, $\frac{d\theta}{dt}$ how fast the disk turns.

**(c)** $T\propto\sqrt{I}$, so twice the period takes $2^2=4$ times the inertia: $4\times0.020=0.080\ \text{kg}\cdot\text{m}^2$.`,
      } },
    { no: '15-4',
      ideas: R`
- **The simple pendulum.** A small bob on a string of length $L$. The restoring torque is $-mgL\sin\theta\approx-mgL\theta$ for small angles ($\theta$ in radians), which is SHM with
$$T=2\pi\sqrt{\frac{L}{g}}$$
Neither the mass nor a small amplitude changes the period.
- **The physical pendulum.** A rigid body swinging about a pivot a distance $h$ from its centre of mass:
$$T=2\pi\sqrt{\frac{I}{mgh}}$$
A simple pendulum has $I=mL^2$ and $h=L$, which gives the formula above.
- **SHM and circular motion.** A point going round a circle of radius $x_m$ at a steady angular speed $\omega$ has $x=x_m\cos(\omega t+\phi)$: its shadow on a diameter moves in SHM.`,
      ex: {
        stem: R`Take $g=9.8\ \text{m/s}^2$ and small swings.`,
        fig: 'f15-pendulum',
        parts: [
          R`Find the period of a simple pendulum $2.45$ m long.`,
          R`What length gives a period of $2.0$ s?`,
          R`A uniform rod $1.2$ m long swings about one end, with $I=\frac{1}{3}mL^2$. Find its period.`,
        ],
        answer: [R`$\pi\approx3.1$ s`, R`$\frac{9.8}{\pi^2}\approx0.99$ m`, R`$\frac{4\pi}{7}\approx1.8$ s`],
        sol: R`**(a)** $T=2\pi\sqrt{\frac{2.45}{9.8}}=2\pi\sqrt{0.25}=2\pi(0.5)=\pi\approx3.1$ s.

**(b)** Square the formula: $T^2=4\pi^2\frac{L}{g}$, so $L=\frac{gT^2}{4\pi^2}=\frac{9.8\times4.0}{4\pi^2}=\frac{9.8}{\pi^2}\approx0.99$ m, since $\pi^2\approx9.87$.

**(c)** The centre of mass is at $h=\frac{L}{2}$, so $T=2\pi\sqrt{\frac{I}{mgh}}=2\pi\sqrt{\frac{2L}{3g}}=2\pi\sqrt{\frac{2.4}{29.4}}=2\pi\sqrt{\frac{4}{49}}=\frac{4\pi}{7}\approx1.8$ s. The mass cancels.`,
      } },
    { no: '15-5',
      ideas: R`
- **Damping.** A drag force proportional to the velocity, $F_d=-bv$ ($b$, the damping constant, in kg/s), makes the oscillation die away:
$$x(t)=x_me^{-bt/2m}\cos(\omega' t+\phi)$$
- **The damped angular frequency** $\omega'=\sqrt{\frac{k}{m}-\frac{b^2}{4m^2}}$ is almost $\omega$ when the damping is small.
- **Energy.** The amplitude falls as $e^{-bt/2m}$, so the energy, which goes as the amplitude squared, falls twice as fast:
$$E(t)\approx\tfrac{1}{2}kx_m^2e^{-bt/m}$$
- **Halving times.** The amplitude halves in $\frac{2m}{b}\ln2$, the energy in $\frac{m}{b}\ln2$.`,
      ex: {
        stem: R`A $0.25$ kg block on a spring with $k=100$ N/m oscillates with a damping constant of $0.050$ kg/s. Use $\ln2\approx0.69$ and $e^{-2}\approx0.14$.`,
        parts: [
          R`Find the angular frequency without damping and with it.`,
          R`How long does the amplitude take to fall to half?`,
          R`How long does the energy take to fall to half?`,
          R`What fraction of the energy is left after $10$ s?`,
        ],
        answer: [R`$\omega=20$ rad/s; $\omega'=\sqrt{400-0.01}\approx20$ rad/s`, R`$10\ln2\approx6.9$ s`, R`$5\ln2\approx3.5$ s`, R`$e^{-2}\approx0.14$`],
        sol: R`**(a)** $\omega=\sqrt{\frac{100}{0.25}}=\sqrt{400}=20$ rad/s. With $\frac{b}{2m}=\frac{0.050}{0.50}=0.10\ \text{s}^{-1}$, $\omega'=\sqrt{400-0.10^2}=\sqrt{400-0.01}\approx20$ rad/s: light damping hardly changes the frequency.

**(b)** $e^{-bt/2m}=\frac{1}{2}$ gives $\frac{bt}{2m}=\ln2$, so $t=\frac{2m}{b}\ln2=\frac{0.50}{0.050}\ln2=10\ln2\approx6.9$ s.

**(c)** The energy goes as $e^{-bt/m}$: $t=\frac{m}{b}\ln2=5\ln2\approx3.5$ s, half as long.

**(d)** $\frac{E}{E_0}=e^{-bt/m}=e^{-(0.050)(10)/0.25}=e^{-2}\approx0.14$.`,
      } },
    { no: '15-6',
      ideas: R`
- **Free and driven.** Left alone, an oscillator swings at its natural angular frequency $\omega=\sqrt{\frac{k}{m}}$. Pushed by a periodic force at $\omega_d$, it settles into oscillating at $\omega_d$.
- **Resonance.** The amplitude is largest when the drive matches the natural frequency:
$$\omega_d\approx\omega$$
- **Damping** lowers the resonance peak and widens it; with little damping the peak is tall and narrow.
- **Everyday resonance:** pushing a swing once per swing, or an earthquake shaking a building at its natural frequency.`,
      ex: {
        stem: R`A $0.40$ kg block on a spring with $k=160$ N/m, lightly damped, is driven by a force $F_m\cos\omega_dt$.`,
        parts: [
          R`At what driving angular frequency is the amplitude largest? Give the frequency in hertz too.`,
          R`The drive is set to $2.0$ Hz. At what frequency does the block oscillate once it has settled?`,
          R`What mass, on the same spring, would resonate at $2.0$ Hz?`,
        ],
        answer: [R`$\omega_d=20$ rad/s, $f=\frac{10}{\pi}\approx3.2$ Hz`, R`$2.0$ Hz, the driving frequency`, R`$\frac{10}{\pi^2}\approx1.0$ kg`],
        sol: R`**(a)** At the natural angular frequency: $\omega=\sqrt{\frac{160}{0.40}}=\sqrt{400}=20$ rad/s, which is $f=\frac{20}{2\pi}=\frac{10}{\pi}\approx3.2$ Hz.

**(b)** A driven oscillator follows the drive: $2.0$ Hz. Since $2.0$ Hz is away from $3.2$ Hz, the amplitude is smaller than at resonance.

**(c)** The natural angular frequency must be $2\pi(2.0)=4\pi$ rad/s, so $m=\frac{k}{\omega^2}=\frac{160}{16\pi^2}=\frac{10}{\pi^2}\approx1.0$ kg.`,
      } },
  ], watch: R`
- Using degrees in $\omega t+\phi$: the phase is in radians, and so is $\theta$ in $\sin\theta\approx\theta$.
- Mixing up $\omega$ (rad/s) and $f$ (Hz): $\omega=2\pi f$.
- Putting the greatest speed at the turning points: it is at the centre, where the acceleration is zero.
- The spring's period depends on the mass; the simple pendulum's doesn't. Neither depends on the amplitude.
- With damping the amplitude goes as $e^{-bt/2m}$, but the energy as $e^{-bt/m}$.` },

  // ===================================================================================================================
  c16: { mods: [
    { no: '16-1',
      ideas: R`
- **Transverse and longitudinal.** In a transverse wave (on a string) each element moves perpendicular to the wave's travel; in a longitudinal wave (sound) it moves along it.
- **A sinusoidal wave** travelling toward $+x$:
$$y(x,t)=y_m\sin(kx-\omega t)$$
With $kx+\omega t$ it travels toward $-x$.
- **Wave number and angular frequency:** $k=\frac{2\pi}{\lambda}$ (rad/m) and $\omega=\frac{2\pi}{T}=2\pi f$. A crest moves one wavelength each period:
$$v=\frac{\omega}{k}=\frac{\lambda}{T}=\lambda f$$
- **An element's own velocity** $u=\frac{\partial y}{\partial t}=-\omega y_m\cos(kx-\omega t)$ is across the string, up to $\omega y_m$. It is not the wave speed $v$.`,
      ex: {
        stem: R`A wave on a string is $y=0.020\sin(4.0\pi x-20\pi t)$, with $x$ and $y$ in metres and $t$ in seconds.`,
        fig: 'f16-snap',
        parts: [
          R`Find the amplitude and the wavelength.`,
          R`Find the frequency and the period.`,
          R`Find the wave speed and the direction of travel.`,
          R`Find the greatest transverse speed of an element of the string.`,
        ],
        answer: [R`$y_m=2.0$ cm, $\lambda=0.50$ m`, R`$f=10$ Hz, $T=0.10$ s`, R`$5.0$ m/s, toward $+x$`, R`$0.4\pi\approx1.3$ m/s`],
        sol: R`**(a)** $y_m=0.020$ m $=2.0$ cm, and $k=4.0\pi$ rad/m gives $\lambda=\frac{2\pi}{k}=\frac{2\pi}{4.0\pi}=0.50$ m.

**(b)** $\omega=20\pi$ rad/s, so $f=\frac{\omega}{2\pi}=10$ Hz and $T=\frac{1}{f}=0.10$ s.

**(c)** $v=\frac{\omega}{k}=\frac{20\pi}{4.0\pi}=5.0$ m/s (or $\lambda f=0.50\times10$). The phase is $kx-\omega t$, so the wave travels toward $+x$.

**(d)** $u_\text{max}=\omega y_m=20\pi\times0.020=0.4\pi\approx1.3$ m/s, about a quarter of the wave speed here.`,
      } },
    { no: '16-2',
      ideas: R`
- **Speed on a string.** It is set by the tension $\tau$ and the linear density $\mu=\frac{m}{L}$ (kg/m):
$$v=\sqrt{\frac{\tau}{\mu}}$$
- **The string sets the speed; the source sets the frequency.** On one string a higher frequency means a shorter wavelength, $\lambda=\frac{v}{f}$, at the same speed.
- **Into another string** the frequency stays the same, while the speed and the wavelength change together.`,
      ex: {
        stem: R`A string $2.0$ m long with a mass of $10$ g is stretched with a tension of $50$ N.`,
        parts: [
          R`Find its linear density.`,
          R`Find the wave speed.`,
          R`Find the wavelength of a $250$ Hz wave on it.`,
          R`What tension would double the wave speed?`,
        ],
        answer: [R`$5.0\times10^{-3}$ kg/m`, R`$100$ m/s`, R`$0.40$ m`, R`$200$ N`],
        sol: R`**(a)** $\mu=\frac{m}{L}=\frac{0.010\text{ kg}}{2.0\text{ m}}=5.0\times10^{-3}$ kg/m.

**(b)** $v=\sqrt{\frac{\tau}{\mu}}=\sqrt{\frac{50}{5.0\times10^{-3}}}=\sqrt{10^4}=100$ m/s.

**(c)** $\lambda=\frac{v}{f}=\frac{100}{250}=0.40$ m.

**(d)** $v\propto\sqrt{\tau}$, so twice the speed takes four times the tension: $4\times50=200$ N.`,
      } },
    { no: '16-3',
      ideas: R`
- **Energy on the move.** Each element has kinetic energy (it moves up and down) and elastic potential energy (it is stretched). Both are largest as it passes $y=0$ and zero at $y=\pm y_m$.
- **Average power** carried by a sinusoidal wave on a string:
$$P_\text{avg}=\tfrac{1}{2}\mu v\omega^2y_m^2$$
- **Scaling.** The power goes as the square of the amplitude and as the square of the frequency: doubling either makes it four times larger.`,
      ex: {
        stem: R`A sinusoidal wave runs along a string with $\mu=5.0\times10^{-3}$ kg/m and $v=100$ m/s. Its amplitude is $1.0$ cm and its angular frequency $200$ rad/s.`,
        parts: [
          R`Find the average power it carries.`,
          R`Find the power if the amplitude is doubled.`,
          R`Find the power if, instead, the frequency is halved.`,
        ],
        answer: [R`$1.0$ W`, R`$4.0$ W`, R`$0.25$ W`],
        sol: R`**(a)** $P_\text{avg}=\frac{1}{2}\mu v\omega^2y_m^2=\frac{1}{2}(5.0\times10^{-3})(100)(200)^2(0.010)^2=\frac{1}{2}(0.50)(4.0\times10^4)(1.0\times10^{-4})=1.0$ W.

**(b)** $P\propto y_m^2$: $2^2\times1.0=4.0$ W.

**(c)** $P\propto\omega^2$: $\left(\frac{1}{2}\right)^2\times1.0=0.25$ W. The speed stays $100$ m/s, since it depends only on the string.`,
      } },
    { no: '16-4',
      ideas: R`
- **The wave equation.** Newton's second law for a short piece of string gives
$$\frac{\partial^2y}{\partial x^2}=\frac{1}{v^2}\frac{\partial^2y}{\partial t^2}$$
with $v=\sqrt{\frac{\tau}{\mu}}$.
- **Every travelling shape solves it.** Any $y=h(kx\pm\omega t)$, a shape moving without changing, satisfies it with $v=\frac{\omega}{k}$.
- **Reading off the speed:** take both second derivatives of a solution; their ratio is $v^2$.`,
      ex: {
        stem: R`Use the wave equation.`,
        parts: [
          R`Show that $y=0.030\sin(2.0x-8.0t)$ solves it, and find $v$.`,
          R`Does $y=0.10\sin(2.0x)\cos(6.0t)$ solve it? If so, with what $v$?`,
          R`A rope has a linear density of $0.25$ kg/m. What tension lets the wave in (a) travel along it?`,
        ],
        answer: [R`It does, with $v=4.0$ m/s`, R`Yes, with $v=3.0$ m/s (a standing wave)`, R`$4.0$ N`],
        sol: R`**(a)** $\frac{\partial^2y}{\partial x^2}=-(2.0)^2y=-4.0y$ and $\frac{\partial^2y}{\partial t^2}=-(8.0)^2y=-64y$. The equation holds with $\frac{1}{v^2}=\frac{4.0}{64}$, so $v=4.0$ m/s, which is $\frac{\omega}{k}=\frac{8.0}{2.0}$.

**(b)** $\frac{\partial^2y}{\partial x^2}=-4.0y$ and $\frac{\partial^2y}{\partial t^2}=-36y$, so it does, with $v^2=\frac{36}{4.0}=9.0$: $v=3.0$ m/s. It is a standing wave (Module 16-7), the sum of two waves running opposite ways at $3.0$ m/s.

**(c)** $v=\sqrt{\frac{\tau}{\mu}}$ gives $\tau=\mu v^2=0.25\times4.0^2=4.0$ N.`,
      } },
    { no: '16-5',
      ideas: R`
- **Superposition.** Overlapping waves add, $y'=y_1+y_2$, and each passes through the other unchanged.
- **Two equal waves** (same amplitude $y_m$, frequency and direction) with a phase difference $\phi$ make one wave:
$$y'=\left[2y_m\cos\tfrac{\phi}{2}\right]\sin\left(kx-\omega t+\tfrac{\phi}{2}\right)$$
- **Fully constructive** for $\phi=0,2\pi,\dots$ (amplitude $2y_m$); **fully destructive** for $\phi=\pi,3\pi,\dots$ (amplitude $0$).
- **Phase and wavelength.** A shift of one wavelength is $2\pi$ rad: half a wavelength is $\pi$, a quarter $\frac{\pi}{2}$.`,
      ex: {
        stem: R`Two waves of amplitude $4.0$ mm, with the same frequency and direction, travel along a string together.`,
        parts: [
          R`Find the amplitude of the resultant wave when they are in phase.`,
          R`Find it when the phase difference is $\pi$ rad.`,
          R`Find it when the phase difference is $\frac{2\pi}{3}$ rad.`,
          R`What phase difference between $0$ and $\pi$ gives an amplitude of $4\sqrt3$ mm? What fraction of a wavelength is that?`,
        ],
        answer: [R`$8.0$ mm`, R`$0$`, R`$4.0$ mm`, R`$\frac{\pi}{3}$ rad, a sixth of a wavelength`],
        sol: R`**(a)** $2y_m\cos0=2(4.0)=8.0$ mm: fully constructive.

**(b)** $\cos\frac{\pi}{2}=0$: the waves cancel, fully destructive.

**(c)** $2(4.0)\cos\frac{\pi}{3}=8.0\times\frac{1}{2}=4.0$ mm.

**(d)** $8.0\cos\frac{\phi}{2}=4\sqrt3$ gives $\cos\frac{\phi}{2}=\frac{\sqrt3}{2}$, so $\frac{\phi}{2}=\frac{\pi}{6}$ and $\phi=\frac{\pi}{3}$. As a fraction of $2\pi$, that is $\frac{1}{6}$ of a wavelength.`,
      } },
    { no: '16-6',
      ideas: R`
- **A phasor** is an arrow of length $y_m$ turning at angular speed $\omega$; its projection on the vertical axis is an element's displacement $y_m\sin\omega t$.
- **Adding waves** of the same frequency and direction, even with different amplitudes: add their phasors head to tail like vectors, the second turned by the phase difference $\phi$.
- **The resultant amplitude** follows from the law of cosines,
$$(y_m')^2=y_{m1}^2+y_{m2}^2+2y_{m1}y_{m2}\cos\phi$$
and its phase $\beta$ is the direction of the summed arrow.`,
      ex: {
        stem: R`Two waves with the same frequency and direction travel along a string, with amplitudes $3.0$ mm and $4.0$ mm.`,
        parts: [
          R`The phase difference is $\frac{\pi}{2}$ rad. Find the resultant amplitude and its phase relative to the first wave.`,
          R`Find the resultant amplitude for phase differences of $0$ and $\pi$ rad.`,
          R`Find it for a phase difference of $\frac{\pi}{3}$ rad.`,
        ],
        answer: [R`$5.0$ mm, $\beta\approx53^\circ$ (about $0.93$ rad) ahead of the first wave`, R`$7.0$ mm and $1.0$ mm`, R`$\sqrt{37}\approx6.1$ mm`],
        sol: R`**(a)** The phasors are at right angles: $y_m'=\sqrt{3.0^2+4.0^2}=5.0$ mm, a 3-4-5 triangle. $\tan\beta=\frac{4.0}{3.0}$, so $\beta\approx53^\circ$.

**(b)** In line: $3.0+4.0=7.0$ mm. Opposite: $4.0-3.0=1.0$ mm, in phase with the larger wave.

**(c)** $(y_m')^2=3.0^2+4.0^2+2(3.0)(4.0)\cos\frac{\pi}{3}=25+12=37$, so $y_m'=\sqrt{37}\approx6.1$ mm.`,
      } },
    { no: '16-7',
      ideas: R`
- **A standing wave.** Two equal waves running in opposite directions add to
$$y'=\left[2y_m\sin kx\right]\cos\omega t$$
Every element oscillates in place, with an amplitude that depends on $x$.
- **Nodes** (which never move) are at $x=0,\frac{\lambda}{2},\lambda,\dots$; **antinodes** (amplitude $2y_m$) lie halfway between. Neighbouring nodes are $\frac{\lambda}{2}$ apart.
- **A string fixed at both ends** resonates when a whole number of half wavelengths fits, $L=n\frac{\lambda}{2}$:
$$f_n=\frac{nv}{2L},\qquad n=1,2,3,\dots$$
The $n$th harmonic has $n$ loops; $n=1$ is the fundamental.`,
      ex: {
        stem: R`A string $0.80$ m long, fixed at both ends, has a tension of $72$ N and a linear density of $5.0$ g/m.`,
        fig: 'f16-standing',
        parts: [
          R`Find the wave speed and the fundamental frequency.`,
          R`Find the wavelength and frequency of the third harmonic, shown in the figure.`,
          R`How many nodes does the third harmonic have, counting the ends?`,
          R`What tension makes the fundamental $150$ Hz?`,
        ],
        answer: [R`$120$ m/s and $75$ Hz`, R`$\frac{8}{15}\approx0.53$ m and $225$ Hz`, R`$4$`, R`$288$ N`],
        sol: R`**(a)** $v=\sqrt{\frac{72}{5.0\times10^{-3}}}=\sqrt{14\,400}=120$ m/s and $f_1=\frac{v}{2L}=\frac{120}{1.6}=75$ Hz.

**(b)** Three loops fill the string: $\lambda_3=\frac{2L}{3}=\frac{1.6}{3}=\frac{8}{15}\approx0.53$ m and $f_3=3f_1=225$ Hz.

**(c)** Three loops take $3+1=4$ nodes: the two ends and two in between.

**(d)** $f_1=\frac{v}{2L}$ must double, so $v$ doubles and the tension is four times larger: $4\times72=288$ N.`,
      } },
  ], watch: R`
- Mixing up the wave speed $v=\lambda f$, along the string, with an element's transverse speed $u$, across it.
- On one string, a new frequency changes the wavelength, not the speed.
- Forgetting the $2\pi$: $k=\frac{2\pi}{\lambda}$ and $\omega=2\pi f$.
- Neighbouring nodes are half a wavelength apart, not a whole one.
- The sign in $kx\pm\omega t$ gives the direction: minus travels toward $+x$.` },

  // ===================================================================================================================
  c17: { mods: [
    { no: '17-1',
      ideas: R`
- **Sound is longitudinal:** elements of the medium oscillate along the direction the wave travels, squeezing and stretching it.
- **The speed** depends on the medium's stiffness, its bulk modulus $B$, and on its density $\rho$:
$$v=\sqrt{\frac{B}{\rho}},\qquad B=-\frac{\Delta p}{\Delta V/V}$$
- **Typical speeds:** about $343$ m/s in air at $20\ ^\circ$C, about $1500$ m/s in water, several km/s in solids.
- **As on a string**, the medium sets $v$ and the source sets $f$, so $\lambda=\frac{v}{f}$.`,
      ex: {
        stem: R`Take the bulk modulus of water as $2.25\times10^9$ Pa, its density as $1000\ \text{kg/m}^3$, and the speed of sound in air as $343$ m/s.`,
        parts: [
          R`Find the speed of sound in water.`,
          R`Find the wavelength of a $3.00$ kHz tone in water and in air.`,
          R`Thunder arrives $3.0$ s after a lightning flash. How far away is the storm?`,
        ],
        answer: [R`$1.5\times10^3$ m/s`, R`$0.500$ m in water, $0.114$ m in air`, R`About $1.0$ km`],
        sol: R`**(a)** $v=\sqrt{\frac{B}{\rho}}=\sqrt{\frac{2.25\times10^9}{1000}}=\sqrt{2.25\times10^6}=1.5\times10^3$ m/s.

**(b)** In water $\lambda=\frac{1500}{3000}=0.500$ m; in air $\lambda=\frac{343}{3000}\approx0.114$ m. Same frequency, different wavelengths.

**(c)** The light arrives almost at once, so $d\approx vt=343\times3.0\approx1.0\times10^3$ m, about $1$ km.`,
      } },
    { no: '17-2',
      ideas: R`
- **The displacement wave.** An element at $x$ moves back and forth along $x$:
$$s(x,t)=s_m\cos(kx-\omega t)$$
- **The pressure wave.** The pressure varies about its normal value by
$$\begin{gathered}\Delta p(x,t)=\Delta p_m\sin(kx-\omega t)\\\Delta p_m=v\rho\omega s_m\end{gathered}$$
- **A quarter cycle apart.** Where the displacement is largest the pressure change is zero, and the other way round.
- **Tiny changes:** even a very loud sound has a $\Delta p_m$ of only tens of pascals, against $1.01\times10^5$ Pa of air pressure.`,
      ex: {
        stem: R`A sound wave in air has an angular frequency of $1000$ rad/s and a displacement amplitude of $1.0\times10^{-5}$ m. Take $v=340$ m/s and $\rho=1.20\ \text{kg/m}^3$.`,
        parts: [
          R`Find the pressure amplitude.`,
          R`Find it if the displacement amplitude doubles.`,
          R`What is the pressure change at an element whose displacement is at its maximum?`,
          R`Find the wavelength.`,
        ],
        answer: [R`$4.08\approx4.1$ Pa`, R`$8.2$ Pa`, R`$0$`, R`$0.68\pi\approx2.1$ m`],
        sol: R`**(a)** $\Delta p_m=v\rho\omega s_m=(340)(1.20)(1000)(1.0\times10^{-5})=4.08\approx4.1$ Pa.

**(b)** $\Delta p_m\propto s_m$: $2\times4.08\approx8.2$ Pa.

**(c)** Zero: $s=s_m$ where $\cos(kx-\omega t)=1$, and there $\sin(kx-\omega t)=0$, so $\Delta p=0$.

**(d)** $\lambda=\frac{2\pi}{k}=\frac{2\pi v}{\omega}=\frac{2\pi(340)}{1000}=0.68\pi\approx2.1$ m.`,
      } },
    { no: '17-3',
      ideas: R`
- **Two sources in phase** with the same wavelength: at a point, the waves arrive with a path length difference $\Delta L$, which gives a phase difference
$$\phi=\frac{\Delta L}{\lambda}2\pi$$
- **Fully constructive** when $\Delta L=0,\lambda,2\lambda,\dots$, a whole number of wavelengths.
- **Fully destructive** when $\Delta L=\frac{\lambda}{2},\frac{3\lambda}{2},\dots$, a whole number and a half.
- **In between**, the interference is intermediate.`,
      ex: {
        stem: R`Two loudspeakers driven in phase emit a $686$ Hz tone; take $v=343$ m/s. A listener stands $3.0$ m from one and $4.0$ m from the other.`,
        parts: [
          R`Find the wavelength.`,
          R`What kind of interference does the listener hear?`,
          R`The listener moves to a point where the path difference is $1.25$ m. What now?`,
          R`What is the lowest frequency that gives fully destructive interference at a path difference of $1.0$ m?`,
        ],
        answer: [R`$0.50$ m`, R`Fully constructive ($\Delta L=2\lambda$)`, R`Fully destructive ($\Delta L=2.5\lambda$)`, R`$171.5\approx172$ Hz`],
        sol: R`**(a)** $\lambda=\frac{v}{f}=\frac{343}{686}=0.50$ m.

**(b)** $\Delta L=4.0-3.0=1.0$ m $=2.0\lambda$, a whole number of wavelengths: fully constructive ($\phi=4\pi$).

**(c)** $\frac{1.25}{0.50}=2.5$ wavelengths, half a wavelength over a whole number: fully destructive.

**(d)** The smallest destructive path difference is $\frac{\lambda}{2}$: $\frac{\lambda}{2}=1.0$ m gives $\lambda=2.0$ m and $f=\frac{343}{2.0}=171.5\approx172$ Hz.`,
      } },
    { no: '17-4',
      ideas: R`
- **Intensity** is power per area, $I=\frac{P}{A}$, in $\text{W/m}^2$; for a sound wave $I=\frac{1}{2}\rho v\omega^2s_m^2$.
- **A point source** spreading evenly in all directions:
$$I=\frac{P_s}{4\pi r^2}$$
Twice as far, a quarter of the intensity.
- **Sound level** in decibels, with the reference intensity $I_0=10^{-12}\ \text{W/m}^2$:
$$\beta=(10\ \text{dB})\log\frac{I}{I_0}$$
- **Rules of thumb:** ten times the intensity adds $10$ dB, a hundred times adds $20$ dB, and twice adds about $3$ dB ($\log2\approx0.30$).`,
      ex: {
        stem: R`A small source emits sound evenly in all directions with a power of $4\pi\times10^{-2}$ W. Ignore absorption by the air.`,
        parts: [
          R`Find the intensity and the sound level $10$ m away.`,
          R`Find the sound level $100$ m away.`,
          R`Two such sources sit side by side. Find the sound level $10$ m away.`,
          R`How far from one source is the sound level $40$ dB?`,
        ],
        answer: [R`$1.0\times10^{-4}\ \text{W/m}^2$ and $80$ dB`, R`$60$ dB`, R`About $83$ dB`, R`$1.0$ km`],
        sol: R`**(a)** $I=\frac{4\pi\times10^{-2}}{4\pi(10)^2}=1.0\times10^{-4}\ \text{W/m}^2$, so $\beta=10\log\frac{10^{-4}}{10^{-12}}=10\log10^8=80$ dB.

**(b)** Ten times as far, a hundredth of the intensity: $1.0\times10^{-6}\ \text{W/m}^2$ and $\beta=60$ dB, $20$ dB less.

**(c)** Twice the intensity: $\beta=80+10\log2\approx80+3.0=83$ dB, not $160$ dB.

**(d)** $40$ dB means $I=10^{-8}\ \text{W/m}^2$: $r^2=\frac{4\pi\times10^{-2}}{4\pi\times10^{-8}}=10^6\ \text{m}^2$, so $r=1.0\times10^3$ m.`,
      } },
    { no: '17-5',
      ideas: R`
- **Standing sound waves in a pipe.** An open end is (nearly) a displacement antinode; a closed end is a node.
- **Open at both ends:** $L=n\frac{\lambda}{2}$, so
$$f=\frac{nv}{2L},\qquad n=1,2,3,\dots$$
- **Closed at one end:** $L=n\frac{\lambda}{4}$ with odd $n$ only,
$$f=\frac{nv}{4L},\qquad n=1,3,5,\dots$$
Its fundamental is half that of an open pipe of the same length.
- **Strings** follow $f_n=\frac{nv}{2L}$ (Module 16-7). The mix of harmonics gives each instrument its own sound.`,
      ex: {
        stem: R`A pipe is $0.50$ m long. Take $v=340$ m/s.`,
        parts: [
          R`Find its two lowest resonant frequencies when it is open at both ends.`,
          R`Find them when it is closed at one end.`,
          R`How long is a pipe, closed at one end, whose fundamental is $85$ Hz?`,
        ],
        answer: [R`$340$ Hz and $680$ Hz`, R`$170$ Hz and $510$ Hz`, R`$1.0$ m`],
        sol: R`**(a)** $f_1=\frac{v}{2L}=\frac{340}{1.0}=340$ Hz, then $f_2=2f_1=680$ Hz.

**(b)** $f_1=\frac{v}{4L}=\frac{340}{2.0}=170$ Hz. The even harmonics are missing, so the next is $n=3$: $510$ Hz.

**(c)** $L=\frac{v}{4f}=\frac{340}{4(85)}=1.0$ m.`,
      } },
    { no: '17-6',
      ideas: R`
- **Two nearly equal frequencies** heard together: the sound swells and fades as the waves drift in and out of step.
- **The beat frequency** is their difference, the larger minus the smaller:
$$f_\text{beat}=f_1-f_2$$
The pitch heard is the average, $\frac{f_1+f_2}{2}$.
- **Tuning:** the beats slow down and vanish as the two frequencies come together.`,
      ex: {
        stem: R`A $440$ Hz tuning fork and a guitar string sound together with $3$ beats per second.`,
        parts: [
          R`What can the string's frequency be?`,
          R`Tightening the string a little makes the beats faster. Which frequency was it?`,
          R`What pitch is heard while the beats sound?`,
          R`By roughly what percentage must the tension change to remove the beats?`,
        ],
        answer: [R`$437$ Hz or $443$ Hz`, R`$443$ Hz`, R`$441.5$ Hz`, R`It must fall by about $1.35\%$`],
        sol: R`**(a)** $|f-440|=3$, so $f=437$ Hz or $443$ Hz.

**(b)** Tightening raises the string's frequency. From $437$ Hz that would move it toward $440$ Hz and slow the beats; they got faster, so the string was at $443$ Hz.

**(c)** The average, $\frac{440+443}{2}=441.5$ Hz, swelling $3$ times a second.

**(d)** $f_1=\frac{v}{2L}$ and $v=\sqrt{\frac{\tau}{\mu}}$, so $f\propto\sqrt\tau$ and $\frac{\Delta\tau}{\tau}\approx2\frac{\Delta f}{f}=2\times\frac{3}{443}\approx1.35\%$, a decrease.`,
      } },
    { no: '17-7',
      ideas: R`
- **Motion changes the frequency heard.** A source or a detector moving through the air changes the frequency detected, $f'$, from the emitted $f$:
$$f'=f\,\frac{v\pm v_D}{v\mp v_S}$$
with $v$ the speed of sound in the air.
- **The sign rule.** Motion toward the other raises the frequency, motion away lowers it: choose the signs that do that. The detector's speed $v_D$ goes on top, the source's $v_S$ below.
- **Not symmetric.** A moving source and a moving detector, at the same speed, give slightly different shifts.`,
      ex: {
        stem: R`A siren emits $990$ Hz. Take $v=340$ m/s in still air.`,
        parts: [
          R`The siren moves at $34$ m/s straight toward a listener at rest. What frequency is heard?`,
          R`What is heard once it moves away at $34$ m/s?`,
          R`The siren is at rest and the listener moves toward it at $34$ m/s. What is heard?`,
          R`And when the listener moves away at $34$ m/s?`,
        ],
        answer: [R`$1100$ Hz`, R`$900$ Hz`, R`$1089$ Hz`, R`$891$ Hz`],
        sol: R`**(a)** The source moves toward: minus below. $f'=990\times\frac{340}{340-34}=990\times\frac{340}{306}=990\times\frac{10}{9}=1100$ Hz.

**(b)** Away: $f'=990\times\frac{340}{340+34}=990\times\frac{10}{11}=900$ Hz.

**(c)** The detector moves toward: plus on top. $f'=990\times\frac{340+34}{340}=990\times1.1=1089$ Hz.

**(d)** $f'=990\times\frac{340-34}{340}=990\times0.9=891$ Hz. Compare (a): the same speed gives a different shift when it is the detector that moves.`,
      } },
    { no: '17-8',
      ideas: R`
- **Faster than sound** ($v_S>v$), the wavefronts pile up into a cone, the **Mach cone**, with half-angle $\theta$:
$$\sin\theta=\frac{v}{v_S}$$
- **The Mach number** is $\frac{v_S}{v}$.
- **A sonic boom** is the cone's surface sweeping past a listener: a sudden jump in pressure.`,
      ex: {
        stem: R`A jet flies level at Mach $2.0$, $5.0$ km above the ground. Take $v=340$ m/s.`,
        parts: [
          R`Find its speed.`,
          R`Find the half-angle of its Mach cone.`,
          R`How far past an observer on the ground (measured along the ground) is the jet when the observer hears the boom?`,
          R`How long after the jet passed overhead is that?`,
        ],
        answer: [R`$680$ m/s`, R`$30^\circ$`, R`$5.0\sqrt3\approx8.7$ km`, R`About $13$ s`],
        sol: R`**(a)** $v_S=2.0\times340=680$ m/s.

**(b)** $\sin\theta=\frac{v}{v_S}=\frac{1}{2.0}$, so $\theta=30^\circ$.

**(c)** The cone trails the jet. Its edge reaches the observer when the jet is a distance $d$ further on, with $\tan\theta=\frac{h}{d}$: $d=\frac{5.0\text{ km}}{\tan30^\circ}=5.0\sqrt3\approx8.7$ km.

**(d)** $t=\frac{d}{v_S}=\frac{8660\text{ m}}{680\text{ m/s}}\approx13$ s.`,
      } },
  ], watch: R`
- Doppler signs: decide first whether the frequency goes up (toward) or down (away), then pick the signs.
- The $v$ in the Doppler formula is the speed of sound, and every speed is measured relative to the air.
- Decibels don't add: two equal sources give $3$ dB more, not twice the level.
- A pipe closed at one end has only the odd harmonics.
- A path difference of $\frac{\lambda}{2}$ cancels; one of $\lambda$ reinforces.
- The intensity falls as $\frac{1}{r^2}$, the amplitude only as $\frac{1}{r}$.` },

  // ===================================================================================================================
  c18: { mods: [
    { no: '18-1',
      ideas: R`
- **Temperature is an SI base quantity**, measured in kelvins (K). Nothing is colder than absolute zero, $0$ K.
- **The zeroth law.** If bodies A and B are each in thermal equilibrium with a third body T, they are in thermal equilibrium with each other. That is why a thermometer works.
- **The fixed point.** The triple point of water, where ice, liquid water and vapour coexist, is $T_3=273.16$ K.
- **The constant-volume gas thermometer** reads the pressure of a gas held at a fixed volume:
$$T=(273.16\ \text{K})\lim_{\text{gas}\to0}\frac{p}{p_3}$$`,
      ex: {
        stem: R`A constant-volume gas thermometer reads $50.0$ kPa at the triple point of water. Treat its gas as ideal.`,
        parts: [
          R`In a liquid it reads $75.0$ kPa. Find the liquid's temperature.`,
          R`What would it read at $0$ K?`,
          R`What does it read at $546.32$ K?`,
        ],
        answer: [R`$409.74\approx410$ K`, R`$0$`, R`$100$ kPa`],
        sol: R`**(a)** $T=(273.16\text{ K})\frac{75.0}{50.0}=273.16\times1.5=409.74\approx410$ K.

**(b)** The pressure is proportional to $T$, so it would fall to zero at absolute zero.

**(c)** $546.32=2\times273.16$: twice the temperature, twice the pressure, $100$ kPa.`,
      } },
    { no: '18-2',
      ideas: R`
- **Celsius** is the Kelvin scale shifted: $T_C=T-273.15^\circ$. A change of $1\ ^\circ$C equals a change of $1$ K.
- **Fahrenheit** has smaller degrees:
$$T_F=\tfrac{9}{5}T_C+32^\circ$$
A change of $1\ ^\circ$C is a change of $1.8\ ^\circ$F.
- **Fixed points:** water freezes at $0\ ^\circ$C $=32\ ^\circ$F and boils at $100\ ^\circ$C $=212\ ^\circ$F; $-40\ ^\circ$C is also $-40\ ^\circ$F.`,
      ex: {
        stem: R`Convert between the temperature scales.`,
        parts: [
          R`Give a body temperature of $98.6\ ^\circ$F in degrees Celsius and in kelvins.`,
          R`A temperature rises by $25\ ^\circ$C. How large is the rise in kelvins and in Fahrenheit degrees?`,
          R`At what temperature do a Celsius and a Fahrenheit thermometer show the same number?`,
        ],
        answer: [R`$37.0\ ^\circ$C and $310.15$ K`, R`$25$ K and $45\ ^\circ$F`, R`$-40^\circ$`],
        sol: R`**(a)** $T_C=\frac{5}{9}(98.6-32)=\frac{5}{9}(66.6)=37.0\ ^\circ$C, and $T=37.0+273.15=310.15$ K.

**(b)** Kelvins and Celsius degrees are the same size: $25$ K. Fahrenheit degrees are $\frac{5}{9}$ as big: $1.8\times25=45\ ^\circ$F.

**(c)** $T=\frac{9}{5}T+32$ gives $-\frac{4}{5}T=32$, so $T=-40$: $-40\ ^\circ$C is $-40\ ^\circ$F.`,
      } },
    { no: '18-3',
      ideas: R`
- **Linear expansion.** A rod of length $L$ warmed by $\Delta T$ grows by
$$\Delta L=L\alpha\,\Delta T$$
with $\alpha$, the coefficient of linear expansion, in $\text{K}^{-1}$ (the same as per $^\circ$C).
- **Volume expansion:** $\Delta V=V\beta\,\Delta T$, with $\beta=3\alpha$ for a solid.
- **A hole expands too**, as if it were filled with the material around it.
- **Water is odd:** between $0\ ^\circ$C and $4\ ^\circ$C it shrinks as it warms, so it is densest at $4\ ^\circ$C.`,
      ex: {
        stem: R`Steel has $\alpha=1.2\times10^{-5}\ \text{K}^{-1}$ and aluminium $\alpha=2.3\times10^{-5}\ \text{K}^{-1}$.`,
        parts: [
          R`A steel rail $20$ m long warms by $40$ K. How much longer does it get?`,
          R`An aluminium cube with a volume of $1.0$ L warms by $100$ K. How much does its volume grow?`,
          R`A steel plate has a hole $2.000$ cm across. Find the hole's diameter after the plate warms by $100$ K.`,
        ],
        answer: [R`$9.6$ mm`, R`$6.9\ \text{cm}^3$`, R`$2.0024$ cm`],
        sol: R`**(a)** $\Delta L=L\alpha\Delta T=(20)(1.2\times10^{-5})(40)=9.6\times10^{-3}$ m $=9.6$ mm.

**(b)** $\beta=3\alpha=6.9\times10^{-5}\ \text{K}^{-1}$, so $\Delta V=(1.0\times10^{-3})(6.9\times10^{-5})(100)=6.9\times10^{-6}\ \text{m}^3=6.9\ \text{cm}^3$.

**(c)** The hole grows like steel: $\Delta d=(2.000)(1.2\times10^{-5})(100)=0.0024$ cm, so $d=2.0024$ cm.`,
      } },
    { no: '18-4',
      ideas: R`
- **Heat** $Q$ is energy that flows because of a temperature difference: into a system ($Q>0$) or out of it ($Q<0$). $1\text{ cal}=4.186$ J.
- **Warming without a change of phase:**
$$Q=cm\,\Delta T$$
with the specific heat $c$; water has $c=4186\ \text{J/(kg}\cdot\text{K)}$, which is $1\ \text{cal/(g}\cdot\text{K)}$.
- **A change of phase** happens at a fixed temperature and takes the heat of transformation $L$:
$$Q=Lm$$
For water $L_F=333$ kJ/kg (melting) and $L_V=2256$ kJ/kg (boiling).
- **Mixing** in an insulated container: the heats add up to zero, $\sum Q=0$.`,
      ex: {
        stem: R`Use $c=4186\ \text{J/(kg}\cdot\text{K)}$ for water, $L_F=333$ kJ/kg and $L_V=2256$ kJ/kg.`,
        parts: [
          R`How much heat warms $2.0$ kg of water from $20\ ^\circ$C to $100\ ^\circ$C?`,
          R`How much more boils it all away at $100\ ^\circ$C?`,
          R`$0.20$ kg of water at $80\ ^\circ$C is mixed with $0.30$ kg at $20\ ^\circ$C in an insulated cup. Find the final temperature.`,
          R`How much heat melts $0.50$ kg of ice at $0\ ^\circ$C?`,
        ],
        answer: [R`$6.7\times10^5$ J`, R`$4.5\times10^6$ J`, R`$44\ ^\circ$C`, R`$1.7\times10^5$ J`],
        sol: R`**(a)** $Q=cm\Delta T=(4186)(2.0)(80)=669\,760\approx6.7\times10^5$ J.

**(b)** $Q=L_Vm=(2256\times10^3)(2.0)\approx4.5\times10^6$ J, almost seven times as much as the warming.

**(c)** $\sum Q=0$: $(0.20)c(T-80)+(0.30)c(T-20)=0$. The $c$ cancels: $0.50T=16+6.0$, so $T=44\ ^\circ$C.

**(d)** $Q=L_Fm=(333\times10^3)(0.50)\approx1.7\times10^5$ J.`,
      } },
    { no: '18-5',
      ideas: R`
- **Work done by a gas** as its volume changes is the area under its path on a $p$-$V$ diagram:
$$W=\int_{V_i}^{V_f}p\,dV$$
It depends on the path, and so does the heat.
- **The first law.** The internal energy changes by the heat added minus the work the gas does:
$$\Delta E_\text{int}=Q-W$$
- **Special processes:** adiabatic ($Q=0$), $\Delta E_\text{int}=-W$; constant volume ($W=0$), $\Delta E_\text{int}=Q$; a closed cycle ($\Delta E_\text{int}=0$), $Q=W$; free expansion ($Q=W=0$), $\Delta E_\text{int}=0$.
- **At constant pressure** $W=p\,\Delta V$.`,
      ex: {
        stem: R`A gas is taken round the cycle ABCDA in the figure: A at $1.0$ L and $3.0\times10^5$ Pa, B at $3.0$ L and the same pressure, C at $3.0$ L and $1.0\times10^5$ Pa, and D at $1.0$ L and $1.0\times10^5$ Pa.`,
        fig: 'f18-cycle',
        parts: [
          R`Find the work done by the gas from A to B.`,
          R`Find the work done by the gas from C to D.`,
          R`Find the net work per cycle.`,
          R`Find the net heat per cycle.`,
        ],
        answer: [R`$600$ J`, R`$-200$ J`, R`$400$ J`, R`$400$ J, taken in`],
        sol: R`**(a)** At constant pressure, with $1\text{ L}=10^{-3}\ \text{m}^3$: $W=p\Delta V=(3.0\times10^5)(2.0\times10^{-3})=600$ J.

**(b)** $W=(1.0\times10^5)(1.0-3.0)\times10^{-3}=-200$ J: the gas is compressed, so work is done on it.

**(c)** B to C and D to A keep the volume fixed and do no work. The net is $600-200=400$ J, the area of the rectangle, $(2.0\times10^5)(2.0\times10^{-3})$.

**(d)** Round a cycle $\Delta E_\text{int}=0$, so $Q=W=400$ J: the gas takes in $400$ J more heat than it gives out.`,
      } },
    { no: '18-6',
      ideas: R`
- **Conduction** through a slab of area $A$, thickness $L$ and thermal conductivity $k$, between temperatures $T_H$ and $T_C$:
$$P_\text{cond}=kA\frac{T_H-T_C}{L}$$
Its thermal resistance is $R=\frac{L}{k}$; slabs in series add their resistances.
- **Convection:** a moving fluid carries the energy, like warm air rising from a heater.
- **Radiation:** every body emits electromagnetic waves. With the Stefan–Boltzmann constant $\sigma=5.67\times10^{-8}\ \text{W/(m}^2\text{}\cdot\text{K}^4\text{)}$ and the emissivity $\varepsilon$ ($1$ for a blackbody):
$$P_\text{rad}=\sigma\varepsilon AT^4$$
with $T$ in kelvins. Twice the temperature gives sixteen times the power.`,
      ex: {
        stem: R`A window pane has an area of $1.0\ \text{m}^2$, a thickness of $5.0$ mm and $k=1.0\ \text{W/(m}\cdot\text{K)}$. It is $20\ ^\circ$C inside and $0\ ^\circ$C outside.`,
        parts: [
          R`Find the rate of heat flow by conduction.`,
          R`Find it for glass twice as thick.`,
          R`How much power does a blackbody with an area of $1.0\ \text{m}^2$ radiate at $1000$ K? And at $2000$ K?`,
        ],
        answer: [R`$4.0\times10^3$ W`, R`$2.0\times10^3$ W`, R`$5.67\times10^4$ W; sixteen times as much, $9.1\times10^5$ W`],
        sol: R`**(a)** $P=kA\frac{\Delta T}{L}=(1.0)(1.0)\frac{20}{5.0\times10^{-3}}=4.0\times10^3$ W. (A real window has thin layers of still air on both faces, which slow this down a lot.)

**(b)** $P\propto\frac{1}{L}$: half as much, $2.0\times10^3$ W.

**(c)** $P=\sigma AT^4=(5.67\times10^{-8})(1.0)(1000)^4=5.67\times10^4$ W. At $2000$ K it is $2^4=16$ times as much, $9.1\times10^5$ W.`,
      } },
  ], watch: R`
- Using $^\circ$C where kelvins are needed: ratios, $pV=nRT$ and $T^4$. A temperature difference is the same in both.
- The sign of $W$: positive when the gas expands and does work.
- $Q$ and $W$ depend on the path; $\Delta E_\text{int}$ doesn't.
- During melting or boiling the temperature stays fixed: use $Q=Lm$, not $cm\Delta T$.
- Mixing: write each $Q=cm(T_f-T_i)$ with its own sign and set the sum to zero.` },

  // ===================================================================================================================
  c19: { mods: [
    { no: '19-1',
      ideas: R`
- **The mole.** One mole holds Avogadro's number of particles:
$$N_A=6.02\times10^{23}\ \text{mol}^{-1}$$
- **Counting moles** from the number of molecules $N$, or from the sample's mass $M_\text{sam}$ and the molar mass $M$:
$$n=\frac{N}{N_A}=\frac{M_\text{sam}}{M}$$
- **Molar mass and one molecule:** $M=mN_A$, with $m$ the mass of one molecule. Water has $M=18$ g/mol.`,
      ex: {
        stem: R`Use $N_A=6.02\times10^{23}\ \text{mol}^{-1}$. Water has $M=18$ g/mol and nitrogen gas, $\text{N}_2$, has $M=28$ g/mol.`,
        parts: [
          R`How many molecules are in $36$ g of water?`,
          R`Find the mass of one water molecule.`,
          R`How many moles are in $1.0$ kg of nitrogen gas?`,
        ],
        answer: [R`$1.2\times10^{24}$`, R`$3.0\times10^{-26}$ kg`, R`About $36$ mol`],
        sol: R`**(a)** $n=\frac{36}{18}=2.0$ mol, so $N=nN_A=2.0\times6.02\times10^{23}\approx1.2\times10^{24}$.

**(b)** $m=\frac{M}{N_A}=\frac{0.018\text{ kg/mol}}{6.02\times10^{23}\ \text{mol}^{-1}}\approx3.0\times10^{-26}$ kg.

**(c)** $n=\frac{1000\text{ g}}{28\text{ g/mol}}\approx36$ mol.`,
      } },
    { no: '19-2',
      ideas: R`
- **The ideal gas law**, with $T$ in kelvins:
$$pV=nRT=NkT$$
with $R=8.31\ \text{J/(mol}\cdot\text{K)}$ and Boltzmann's constant $k=\frac{R}{N_A}=1.38\times10^{-23}$ J/K.
- **A fixed amount of gas:** $\frac{p_1V_1}{T_1}=\frac{p_2V_2}{T_2}$.
- **Work done by an ideal gas.** At constant temperature (isothermal)
$$W=nRT\ln\frac{V_f}{V_i}$$
at constant volume $W=0$, and at constant pressure $W=p\,\Delta V=nR\,\Delta T$.`,
      ex: {
        stem: R`$2.0$ mol of an ideal gas at $300$ K expands at constant temperature from $10$ L to $20$ L. Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$ and $\ln2\approx0.693$.`,
        parts: [
          R`Find the initial pressure.`,
          R`Find the final pressure.`,
          R`Find the work done by the gas.`,
          R`How much heat does the gas take in?`,
        ],
        answer: [R`$5.0\times10^5$ Pa`, R`$2.5\times10^5$ Pa`, R`$3.5\times10^3$ J`, R`$3.5\times10^3$ J`],
        sol: R`**(a)** $p=\frac{nRT}{V}=\frac{(2.0)(8.31)(300)}{10\times10^{-3}}=\frac{4986}{0.010}\approx5.0\times10^5$ Pa.

**(b)** At constant $T$, $pV$ stays the same: twice the volume, half the pressure, $2.5\times10^5$ Pa.

**(c)** $W=nRT\ln\frac{V_f}{V_i}=4986\ln2\approx4986\times0.693\approx3.5\times10^3$ J.

**(d)** The temperature doesn't change, so neither does the ideal gas's internal energy: $Q=W\approx3.5\times10^3$ J.`,
      } },
    { no: '19-3',
      ideas: R`
- **Pressure from collisions.** Molecules bouncing off the walls give
$$p=\frac{nMv_\text{rms}^2}{3V}$$
- **The rms speed** (root mean square) of the molecules, with $M$ in kg/mol:
$$v_\text{rms}=\sqrt{\frac{3RT}{M}}$$
- **At one temperature**, lighter molecules move faster, $v_\text{rms}\propto\frac{1}{\sqrt M}$; for one gas, $v_\text{rms}\propto\sqrt T$.`,
      ex: {
        stem: R`Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$. Hydrogen ($\text{H}_2$) has $M=2.0$ g/mol, oxygen ($\text{O}_2$) $M=32$ g/mol and nitrogen ($\text{N}_2$) $M=28$ g/mol.`,
        parts: [
          R`Find the rms speed of nitrogen molecules at $300$ K.`,
          R`At the same temperature, how many times faster (in rms speed) are hydrogen molecules than oxygen ones?`,
          R`Oxygen has an rms speed of $483$ m/s at $300$ K. Find it at $1200$ K.`,
          R`At what temperature does oxygen have the rms speed hydrogen has at $300$ K?`,
        ],
        answer: [R`About $517$ m/s`, R`$4$ times`, R`$966$ m/s`, R`$4800$ K`],
        sol: R`**(a)** $v_\text{rms}=\sqrt{\frac{3(8.31)(300)}{0.028}}=\sqrt{\frac{7479}{0.028}}=\sqrt{2.67\times10^5}\approx517$ m/s.

**(b)** $\frac{v_\text{H}}{v_\text{O}}=\sqrt{\frac{M_\text{O}}{M_\text{H}}}=\sqrt{\frac{32}{2.0}}=\sqrt{16}=4$.

**(c)** Four times the temperature, twice the speed: $2\times483=966$ m/s.

**(d)** $v_\text{rms}^2\propto\frac{T}{M}$ must match: $\frac{T}{32}=\frac{300}{2.0}$, so $T=4800$ K.`,
      } },
    { no: '19-4',
      ideas: R`
- **The average translational kinetic energy per molecule** depends only on the temperature, the same for every gas:
$$K_\text{avg}=\tfrac{3}{2}kT$$
- **For $n$ moles**, the total translational kinetic energy is $\frac{3}{2}nRT$.
- **Temperature measures motion:** doubling $T$ in kelvins doubles $K_\text{avg}$.`,
      ex: {
        stem: R`Use $k=1.38\times10^{-23}$ J/K and $R=8.31\ \text{J/(mol}\cdot\text{K)}$.`,
        parts: [
          R`Find the average translational kinetic energy of a molecule at $300$ K.`,
          R`At what temperature is it twice as large?`,
          R`Find the total translational kinetic energy of $2.0$ mol of gas at $300$ K.`,
        ],
        answer: [R`$6.2\times10^{-21}$ J`, R`$600$ K`, R`$7.5\times10^3$ J`],
        sol: R`**(a)** $K_\text{avg}=\frac{3}{2}(1.38\times10^{-23})(300)=6.21\times10^{-21}\approx6.2\times10^{-21}$ J.

**(b)** $K_\text{avg}\propto T$: $600$ K, which is $327\ ^\circ$C. Doubling $27\ ^\circ$C to $54\ ^\circ$C would be wrong.

**(c)** $\frac{3}{2}nRT=\frac{3}{2}(2.0)(8.31)(300)=7479\approx7.5\times10^3$ J.`,
      } },
    { no: '19-5',
      ideas: R`
- **The mean free path** $\lambda$ is the average distance a molecule travels between collisions. For molecules of diameter $d$, with $\frac{N}{V}$ of them per volume:
$$\lambda=\frac{1}{\sqrt2\,\pi d^2\,N/V}$$
- **Bigger or more crowded molecules** collide more often: $\lambda$ shrinks as $d^2$ grows and as the gas gets denser.
- **The collision rate** is the average speed divided by $\lambda$.`,
      ex: {
        stem: R`Air molecules have a diameter of about $3.0\times10^{-10}$ m, and air near room conditions has about $2.5\times10^{25}$ molecules per cubic metre.`,
        parts: [
          R`Find the mean free path.`,
          R`Find it in air half as dense.`,
          R`How many collisions per second does a molecule moving at $500$ m/s have, with the mean free path of (a)?`,
        ],
        answer: [R`About $1.0\times10^{-7}$ m`, R`$2.0\times10^{-7}$ m`, R`About $5\times10^9$`],
        sol: R`**(a)** $\lambda=\frac{1}{\sqrt2\,\pi(3.0\times10^{-10})^2(2.5\times10^{25})}=\frac{1}{\sqrt2\,\pi(2.25\times10^6)}\approx\frac{1}{1.0\times10^7}=1.0\times10^{-7}$ m, about $300$ molecular diameters.

**(b)** $\lambda\propto\frac{V}{N}$: twice as long, $2.0\times10^{-7}$ m.

**(c)** $\frac{500}{1.0\times10^{-7}}=5\times10^9$ collisions per second.`,
      } },
    { no: '19-6',
      ideas: R`
- **Maxwell's distribution.** The fraction of molecules with speeds between $v$ and $v+dv$ is $P(v)\,dv$, with
$$P(v)=4\pi\left(\frac{M}{2\pi RT}\right)^{3/2}v^2e^{-Mv^2/2RT}$$
The area under the curve is $1$.
- **Three typical speeds**, always in the order $v_P<v_\text{avg}<v_\text{rms}$:
$$\begin{gathered}v_P=\sqrt{\frac{2RT}{M}},\quad v_\text{avg}=\sqrt{\frac{8RT}{\pi M}}\\v_\text{rms}=\sqrt{\frac{3RT}{M}}\end{gathered}$$
- **A hotter gas:** the curve spreads toward higher speeds and its peak drops, keeping the area $1$.`,
      ex: {
        stem: R`The molecules of a gas have an rms speed of $500$ m/s.`,
        parts: [
          R`Find the ratio $v_P:v_\text{avg}:v_\text{rms}$.`,
          R`Find $v_P$ and $v_\text{avg}$.`,
          R`Find $v_P$ when the absolute temperature is four times larger.`,
        ],
        answer: [R`$\sqrt2:\sqrt{8/\pi}:\sqrt3\approx1.41:1.60:1.73$`, R`$v_P\approx408$ m/s and $v_\text{avg}\approx461$ m/s`, R`About $816$ m/s`],
        sol: R`**(a)** All three are $\sqrt{\frac{RT}{M}}$ times a number: $\sqrt2$, $\sqrt{\frac{8}{\pi}}$ and $\sqrt3$, about $1.41$, $1.60$ and $1.73$.

**(b)** $v_P=500\sqrt{\frac{2}{3}}\approx500\times0.816\approx408$ m/s and $v_\text{avg}=500\sqrt{\frac{8}{3\pi}}\approx500\times0.921\approx461$ m/s.

**(c)** Every speed goes as $\sqrt T$: twice as large, $2\times408\approx816$ m/s.`,
      } },
    { no: '19-7',
      ideas: R`
- **Internal energy.** A monatomic ideal gas holds its energy only as the translational kinetic energy of its molecules: $E_\text{int}=\frac{3}{2}nRT$.
- **At constant volume** all the heat goes into internal energy:
$$\begin{gathered}Q=nC_V\Delta T\\C_V=\tfrac{3}{2}R\approx12.5\ \text{J/(mol}\cdot\text{K)}\ \text{(monatomic)}\end{gathered}$$
- **For any ideal gas, by any process:** $\Delta E_\text{int}=nC_V\,\Delta T$.
- **At constant pressure** the gas also does work, $nR\Delta T$, so it needs more heat:
$$Q=nC_p\Delta T,\qquad C_p=C_V+R$$`,
      ex: {
        stem: R`$2.0$ mol of a monatomic ideal gas is heated from $300$ K to $400$ K. Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$.`,
        parts: [
          R`How much heat does it take at constant volume?`,
          R`How much at constant pressure?`,
          R`How much work does the gas do at constant pressure?`,
          R`Find the change in internal energy in each case.`,
        ],
        answer: [R`$2.5\times10^3$ J`, R`$4.2\times10^3$ J`, R`$1.7\times10^3$ J`, R`$2.5\times10^3$ J both times`],
        sol: R`**(a)** $Q=nC_V\Delta T=(2.0)\left(\tfrac{3}{2}\times8.31\right)(100)=2493\approx2.5\times10^3$ J.

**(b)** $C_p=C_V+R=\frac{5}{2}R$: $Q=(2.0)\left(\tfrac{5}{2}\times8.31\right)(100)=4155\approx4.2\times10^3$ J.

**(c)** $W=p\Delta V=nR\Delta T=(2.0)(8.31)(100)=1662\approx1.7\times10^3$ J. **Check** $4155-1662=2493$.

**(d)** $\Delta E_\text{int}=nC_V\Delta T=2493\approx2.5\times10^3$ J both times: it depends only on $\Delta T$.`,
      } },
    { no: '19-8',
      ideas: R`
- **Equipartition.** Every degree of freedom (a way for a molecule to store energy) holds on average $\frac{1}{2}kT$ per molecule, or $\frac{1}{2}RT$ per mole.
- **Counting them:** a monatomic molecule has $3$ (moving along $x$, $y$ and $z$); a diatomic one $5$ (two rotations more); a polyatomic one $6$ (three rotations). So
$$C_V=\tfrac{f}{2}R:\qquad \tfrac{3}{2}R,\quad\tfrac{5}{2}R,\quad3R$$
- **The ratio** $\gamma=\frac{C_p}{C_V}$ is $\frac{5}{3}$, $\frac{7}{5}$ and $\frac{4}{3}$.
- **Temperature matters:** at low temperatures rotation freezes out, at high ones vibration adds more (a quantum effect).`,
      ex: {
        stem: R`Treat nitrogen gas, $\text{N}_2$, as a diatomic ideal gas. Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$.`,
        parts: [
          R`Find $C_V$ and $C_p$.`,
          R`Find $\gamma$.`,
          R`How much heat warms $1.0$ mol of it by $10$ K at constant pressure?`,
          R`What fraction of that heat goes into internal energy?`,
        ],
        answer: [R`$C_V=\frac{5}{2}R\approx20.8$ and $C_p=\frac{7}{2}R\approx29.1\ \text{J/(mol}\cdot\text{K)}$`, R`$1.4$`, R`$291$ J`, R`$\frac{5}{7}\approx0.71$`],
        sol: R`**(a)** Five degrees of freedom: $C_V=\frac{5}{2}R\approx20.8$ and $C_p=C_V+R=\frac{7}{2}R\approx29.1\ \text{J/(mol}\cdot\text{K)}$.

**(b)** $\gamma=\frac{C_p}{C_V}=\frac{7}{5}=1.4$.

**(c)** $Q=nC_p\Delta T=(1.0)\left(\tfrac{7}{2}\times8.31\right)(10)\approx291$ J.

**(d)** $\Delta E_\text{int}=nC_V\Delta T$, so the fraction is $\frac{C_V}{C_p}=\frac{5}{7}\approx0.71$. The rest is the work the gas does as it expands.`,
      } },
    { no: '19-9',
      ideas: R`
- **Adiabatic** means no heat flows, $Q=0$, as in a fast or well-insulated process. For a slow (quasi-static) one,
$$pV^\gamma=\text{constant},\qquad TV^{\gamma-1}=\text{constant}$$
- **The work** comes out of the internal energy, $W=-\Delta E_\text{int}=nC_V(T_i-T_f)$: an expanding gas cools, and a compressed one heats up (the diesel engine).
- **Free expansion** into a vacuum is different: $Q=W=0$, so an ideal gas keeps its temperature, and $pV^\gamma$ doesn't apply.`,
      ex: {
        stem: R`$1.0$ mol of a monatomic ideal gas ($\gamma=\frac{5}{3}$) at $400$ K expands slowly and adiabatically to $8$ times its volume. Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$.`,
        parts: [
          R`Find the final temperature.`,
          R`By what factor does the pressure fall?`,
          R`Find the work done by the gas.`,
        ],
        answer: [R`$100$ K`, R`To $\frac{1}{32}$ of its first value`, R`$3.7\times10^3$ J`],
        sol: R`**(a)** $TV^{\gamma-1}$ stays the same, with $\gamma-1=\frac{2}{3}$: $T_f=T_i\,8^{-2/3}=\frac{400}{4}=100$ K.

**(b)** $pV^\gamma$ stays the same: $\frac{p_f}{p_i}=8^{-5/3}=\frac{1}{2^5}=\frac{1}{32}$.

**(c)** $Q=0$, so $W=-\Delta E_\text{int}=nC_V(T_i-T_f)=(1.0)\left(\tfrac{3}{2}\times8.31\right)(300)\approx3.7\times10^3$ J.`,
      } },
  ], watch: R`
- Temperatures in kelvins, molar masses in kg/mol: $28$ g/mol is $0.028$ kg/mol.
- $R$ is per mole, $k$ per molecule: $pV=nRT=NkT$.
- $C_V$ belongs to constant volume; at constant pressure use $C_p=C_V+R$.
- Adiabatic isn't isothermal: $pV^\gamma$, not $pV$, stays the same.
- A free expansion has $Q=0$ but isn't the slow adiabatic process: its temperature doesn't change.` },

  // ===================================================================================================================
  c20: { mods: [
    { no: '20-1',
      ideas: R`
- **One-way processes.** Heat flows from hot to cold, and a gas spreads through a box; these irreversible processes never run backward by themselves. Entropy $S$ tells their direction.
- **The change in entropy** between two states, along any reversible path between them:
$$\Delta S=\int_i^f\frac{dQ}{T}$$
At a constant temperature, $\Delta S=\frac{Q}{T}$. Entropy is a state function: $\Delta S$ depends only on the two states.
- **The second law.** In a closed system, entropy increases in an irreversible process and stays the same in a reversible one; it never decreases: $\Delta S\ge0$.
- **An ideal gas**, from $(V_i,T_i)$ to $(V_f,T_f)$ by any process:
$$\Delta S=nR\ln\frac{V_f}{V_i}+nC_V\ln\frac{T_f}{T_i}$$`,
      ex: {
        stem: R`Use $R=8.31\ \text{J/(mol}\cdot\text{K)}$, $\ln2\approx0.693$, and $L_F=333$ kJ/kg for ice.`,
        parts: [
          R`$1.0$ mol of an ideal gas doubles its volume at a constant $300$ K. Find its change in entropy.`,
          R`The same gas doubles its volume by a free expansion into a vacuum. Find its change in entropy.`,
          R`Find the change in entropy of $1.0$ kg of ice as it melts at $273$ K.`,
        ],
        answer: [R`$R\ln2\approx5.76$ J/K`, R`The same, $5.76$ J/K`, R`$1.22\times10^3$ J/K`],
        sol: R`**(a)** At constant $T$, $\Delta E_\text{int}=0$, so $Q=W=nRT\ln2$ and $\Delta S=\frac{Q}{T}=nR\ln2=8.31\times0.693\approx5.76$ J/K.

**(b)** Entropy is a state function and the end states are those of (a), so $\Delta S=5.76$ J/K, although $Q=0$. Find it along the reversible path of (a), never as $\frac{Q}{T}$ of the free expansion itself.

**(c)** Melting is at a fixed $T$: $\Delta S=\frac{Q}{T}=\frac{L_Fm}{T}=\frac{333\times10^3}{273}\approx1.22\times10^3$ J/K.`,
      } },
    { no: '20-2',
      ideas: R`
- **A heat engine** takes heat $|Q_H|$ from a hot reservoir, does work $|W|$, and gives heat $|Q_L|$ to a cold one. Over a cycle
$$|W|=|Q_H|-|Q_L|$$
- **Efficiency** is what you get over what you pay for:
$$\varepsilon=\frac{|W|}{|Q_H|}$$
- **The Carnot engine**, the ideal reversible engine, has $\frac{|Q_H|}{T_H}=\frac{|Q_L|}{T_L}$ and
$$\varepsilon_C=1-\frac{T_L}{T_H}$$
No engine working between the same two temperatures does better.
- **No perfect engine:** $\varepsilon<1$; some heat must always go to the cold reservoir (the second law).`,
      ex: {
        stem: R`A Carnot engine works between $600$ K and $300$ K and takes in $1200$ J of heat each cycle.`,
        fig: 'f20-engine',
        parts: [
          R`Find its efficiency.`,
          R`Find the work it does each cycle.`,
          R`How much heat goes to the cold reservoir each cycle?`,
          R`An inventor claims an engine between the same reservoirs that does $700$ J of work from $1200$ J of heat. Can it work?`,
        ],
        answer: [R`$0.50$`, R`$600$ J`, R`$600$ J`, R`No: its efficiency, about $0.58$, would beat the Carnot engine's $0.50$`],
        sol: R`**(a)** $\varepsilon_C=1-\frac{T_L}{T_H}=1-\frac{300}{600}=0.50$.

**(b)** $|W|=\varepsilon|Q_H|=0.50\times1200=600$ J.

**(c)** $|Q_L|=|Q_H|-|W|=1200-600=600$ J. **Check** $\frac{1200}{600}=\frac{600}{300}$.

**(d)** $\frac{700}{1200}\approx0.58$, more than the Carnot efficiency between these temperatures: impossible.`,
      } },
    { no: '20-3',
      ideas: R`
- **A refrigerator** uses work $|W|$ to move heat $|Q_L|$ from a cold reservoir to a hot one, which receives
$$|Q_H|=|Q_L|+|W|$$
- **The coefficient of performance**, what you get over what you pay for:
$$K=\frac{|Q_L|}{|W|},\qquad K_C=\frac{T_L}{T_H-T_L}\ \text{(Carnot)}$$
- **No perfect refrigerator:** heat never flows from cold to hot without work. Real engines and refrigerators do worse than Carnot ones.`,
      ex: {
        stem: R`A Carnot refrigerator keeps its inside at $270$ K in a room at $300$ K.`,
        parts: [
          R`Find its coefficient of performance.`,
          R`How much work does it need to remove $900$ J of heat from the inside?`,
          R`How much heat does the room receive then?`,
        ],
        answer: [R`$9.0$`, R`$100$ J`, R`$1000$ J`],
        sol: R`**(a)** $K_C=\frac{T_L}{T_H-T_L}=\frac{270}{300-270}=\frac{270}{30}=9.0$.

**(b)** $|W|=\frac{|Q_L|}{K}=\frac{900}{9.0}=100$ J.

**(c)** $|Q_H|=|Q_L|+|W|=900+100=1000$ J: the room gets more heat than was taken from inside.`,
      } },
    { no: '20-4',
      ideas: R`
- **Configurations and microstates.** With $N$ molecules in a box with two halves, a configuration says how many are in each half; a microstate says which ones. A configuration with $n_1$ on one side and $n_2$ on the other has the multiplicity
$$W=\frac{N!}{n_1!\,n_2!}$$
- **Equally likely microstates.** Every microstate is as likely as any other, so the configuration with the largest $W$, the even split, is the most probable. For large $N$ nearly all microstates are close to it.
- **Boltzmann's entropy equation:**
$$S=k\ln W$$`,
      ex: {
        stem: R`Four identical molecules move about in a box with two halves. Use $k=1.38\times10^{-23}$ J/K and $\ln6\approx1.79$.`,
        parts: [
          R`Find the multiplicity of the configuration with two molecules in each half.`,
          R`How many microstates are there in all? What is the chance of finding all four in the left half?`,
          R`Find the difference in entropy between the two-two configuration and the four-zero one.`,
        ],
        answer: [R`$6$`, R`$16$; $\frac{1}{16}$`, R`$k\ln6\approx2.5\times10^{-23}$ J/K`],
        sol: R`**(a)** $W=\frac{4!}{2!\,2!}=\frac{24}{4}=6$.

**(b)** Each molecule can be in either half, so there are $2^4=16$ microstates: the multiplicities $1+4+6+4+1$. All four in the left half is just one of them: $\frac{1}{16}$.

**(c)** $S=k\ln W$, with $W=1$ for four-zero, so $\Delta S=k\ln6-k\ln1=(1.38\times10^{-23})(1.79)\approx2.5\times10^{-23}$ J/K.`,
      } },
  ], watch: R`
- $\Delta S=\frac{Q}{T}$ holds for a reversible process at constant $T$. For anything else, choose a reversible path between the same two states.
- Kelvins in $\varepsilon_C=1-\frac{T_L}{T_H}$ and in $K_C$, never $^\circ$C.
- Efficiency is $\frac{|W|}{|Q_H|}$, not $\frac{|W|}{|Q_L|}$.
- A system's entropy can fall if its surroundings' rises more; the total for a closed system never decreases.
- A free expansion has $Q=0$ but $\Delta S>0$.` },
};

export const habits = R`
- **Kelvins.** Turn temperatures into kelvins for ratios, $pV=nRT$, $T^4$, entropy and efficiency; a temperature difference can stay in $^\circ$C.
- **Radians.** Phases in SHM and waves, $\omega t+\phi$ and $kx-\omega t$, are in radians.
- **Read the wave first.** From $y=y_m\sin(kx-\omega t)$ write down $y_m$, $k$ and $\omega$, then $\lambda=\frac{2\pi}{k}$, $f=\frac{\omega}{2\pi}$ and $v=\frac{\omega}{k}$.
- **Signs before numbers.** Heat into the gas is positive, and so is work by an expanding gas; for a Doppler shift, decide up or down first.
- **No calculator.** Keep $\pi$, $\sqrt2$ and $\ln2$ as they are, use $\log2\approx0.30$ and $\ln2\approx0.69$, and round only the final answer.
- **Check a special case.** No damping, a source at rest, equal temperatures: the answer should turn into one you already know.`;
