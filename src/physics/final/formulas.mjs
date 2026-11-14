// The final's Formulas tab: the formulas of Chapters 15–20 of Fundamentals of Physics (Halliday, Resnick, Walker),
// module by module, each marked by importance, then helpful extras that the book doesn't print as formulas. Every row is
// checked numerically in verify.py, most of them by evaluating this TeX, so a new row needs a check there too (the
// script fails on a row without one).
//
// The shape is the midterm's (../formulas.mjs): a group is a chapter (`id` matches content.mjs); `mods` follow the
// book's modules; a row is [name, TeX, stars, note]: stars 3 (core, used all the time), 2 (key result) or 1
// (supporting); `extra` rows are [name, TeX, note]. TeX is drawn full size (\displaystyle).
import { FINAL_ADDED } from './content.mjs';
export { trig } from '../formulas.mjs';

const R = String.raw;
export const FORMULAS_ADDED = FINAL_ADDED;

// the values to know for Chapters 15–20, without a calculator
export const constants = [
  ['Gas constant', R`R=8.31\ \text{J/(mol}\cdot\text{K)}`, 3],
  ['Boltzmann constant', R`k=1.38\times10^{-23}\ \text{J/K}`, 3, R`$k=\frac{R}{N_A}$: the gas constant per molecule.`],
  ['Avogadro’s number', R`N_A=6.02\times10^{23}\ \text{mol}^{-1}`, 3],
  ['Absolute zero', R`0\ \text{K}=-273.15\ ^\circ\text{C}`, 3],
  ['Logarithms', R`\log2\approx0.30,\quad\log3\approx0.48,\quad\ln2\approx0.69,\quad\ln3\approx1.10`, 3, R`Decibels use $\log$, base $10$; damping and entropy use $\ln$.`],
  ['Exponentials', R`e\approx2.72,\quad e^{-1}\approx0.37,\quad e^{-2}\approx0.14`, 2],
  ['Speed of sound in air', R`v=343\ \text{m/s}`, 2, R`At $20\ ^\circ$C; problems often round it to $340$ m/s.`],
  ['Reference intensity', R`I_0=10^{-12}\ \text{W/m}^2`, 2, 'The faintest sound a person can hear: 0 dB.'],
  ['Atmospheric pressure', R`1\ \text{atm}=1.01\times10^5\ \text{Pa}`, 2],
  ['Water', R`c=4186\ \text{J/(kg}\cdot\text{K)},\quad L_F=333\ \text{kJ/kg},\quad L_V=2256\ \text{kJ/kg}`, 2, 'Its specific heat, and its heats of melting and of boiling.'],
  ['Calorie', R`1\ \text{cal}=4.186\ \text{J}`, 1],
  ['Stefan–Boltzmann constant', R`\sigma=5.67\times10^{-8}\ \text{W/(m}^2\cdot\text{K}^4\text{)}`, 1],
  ['Free-fall acceleration', R`g=9.8\ \text{m/s}^2`, 1],
];

export const fgroups = [
  // ===================================================================================================================
  { id: 'c15', mods: [
    { no: '15-1', rows: [
      ['Frequency', R`f=\frac{1}{T}`, 3, 'Oscillations per second, in hertz; T is the period.'],
      ['Displacement', R`x(t)=x_m\cos(\omega t+\phi)`, 3, R`Amplitude $x_m$, angular frequency $\omega$, phase constant $\phi$ (radians).`],
      ['Angular frequency', R`\omega=\frac{2\pi}{T}=2\pi f`, 3],
      ['Velocity', R`v(t)=-\omega x_m\sin(\omega t+\phi)`, 2],
      ['Acceleration', R`a(t)=-\omega^2x_m\cos(\omega t+\phi)`, 2],
      ['The mark of SHM', R`a=-\omega^2x`, 3, 'The acceleration is proportional to the displacement and opposite to it.'],
      ['Greatest speed and acceleration', R`v_m=\omega x_m,\quad a_m=\omega^2x_m`, 2, 'The speed at the centre, the acceleration at the turning points.'],
      ['Restoring force', R`F=-kx`, 3, 'Hooke’s law: the linear oscillator.'],
      ['Block on a spring', R`\omega=\sqrt{\frac{k}{m}},\quad T=2\pi\sqrt{\frac{m}{k}}`, 3, 'The period doesn’t depend on the amplitude.'],
    ]},
    { no: '15-2', rows: [
      ['Potential energy', R`U=\tfrac{1}{2}kx^2`, 3],
      ['Kinetic energy', R`K=\tfrac{1}{2}mv^2`, 3],
      ['Mechanical energy', R`E=\tfrac{1}{2}kx_m^2=\tfrac{1}{2}mv_m^2`, 3, 'Constant without friction.'],
      ['Speed at a position', R`v=\omega\sqrt{x_m^2-x^2}`, 2],
    ]},
    { no: '15-3', rows: [
      ['Restoring torque', R`\tau=-\kappa\theta`, 3, R`$\kappa$: the torsion constant of the wire, in N·m/rad.`],
      ['Angular displacement', R`\theta=\theta_m\cos(\omega t+\phi)`, 2],
      ['Torsion pendulum', R`T=2\pi\sqrt{\frac{I}{\kappa}}`, 3],
    ]},
    { no: '15-4', rows: [
      ['Simple pendulum', R`T=2\pi\sqrt{\frac{L}{g}}`, 3, 'Small angles; the mass doesn’t matter.'],
      ['Physical pendulum', R`T=2\pi\sqrt{\frac{I}{mgh}}`, 3, R`$h$: from the pivot to the centre of mass.`],
      ['Small angles', R`\sin\theta\approx\theta`, 2, R`$\theta$ in radians; within $1\%$ up to about $14^\circ$.`],
      ['Pendulum’s restoring torque', R`\tau=-mgL\sin\theta\approx-mgL\theta`, 1],
      ['SHM and circular motion', R`x=x_m\cos(\omega t+\phi),\quad v_\text{ref}=\omega x_m`, 1, R`A point going round a circle of radius $x_m$ at angular speed $\omega$, at speed $v_\text{ref}$: its shadow on a diameter moves in SHM.`],
    ]},
    { no: '15-5', rows: [
      ['Damping force', R`F_d=-bv`, 2, R`$b$: the damping constant, in kg/s.`],
      ['Damped oscillation', R`x(t)=x_me^{-bt/(2m)}\cos(\omega' t+\phi)`, 3],
      ['Damped angular frequency', R`\omega'=\sqrt{\frac{k}{m}-\frac{b^2}{4m^2}}`, 2, R`Almost $\omega$ when $b$ is small.`],
      ['Energy of a damped oscillator', R`E(t)\approx\tfrac{1}{2}kx_m^2e^{-bt/m}`, 2, 'For light damping: twice as fast a decay as the amplitude’s.'],
    ]},
    { no: '15-6', rows: [
      ['Resonance', R`\omega_d=\omega`, 3, 'The amplitude is largest when the driving angular frequency matches the natural one (about, with damping).'],
      ['Driven oscillation', R`x(t)=x_m\cos(\omega_dt+\phi)`, 2, 'Once settled, the oscillator moves at the driving frequency.'],
    ]},
  ], extra: [
    ['Greatest speed from k and m', R`v_m=x_m\sqrt{\frac{k}{m}}`, R`$\omega x_m$ with $\omega=\sqrt{k/m}$.`],
    ['Share of the energy', R`\frac{U}{E}=\frac{x^2}{x_m^2}`, R`At $x=\frac{x_m}{2}$ only a quarter is potential.`],
    ['Halving times with damping', R`t_\text{amp}=\frac{2m}{b}\ln2,\quad t_E=\frac{m}{b}\ln2`, 'The time for the amplitude, and for the energy, to fall to half.'],
    ['Pendulum length for a period', R`L=\frac{gT^2}{4\pi^2}`, R`A $2.0$ s pendulum is about $1$ m long.`],
    ['Hanging spring', R`\Delta y=\frac{mg}{k}`, R`The stretch at equilibrium; the block oscillates about that point with the same $T=2\pi\sqrt{m/k}$.`],
    ['Springs side by side and end to end', R`k_\text{par}=k_1+k_2,\quad \frac{1}{k_\text{ser}}=\frac{1}{k_1}+\frac{1}{k_2}`],
  ] },

  // ===================================================================================================================
  { id: 'c16', mods: [
    { no: '16-1', rows: [
      ['Sinusoidal wave', R`y(x,t)=y_m\sin(kx-\omega t)`, 3, R`Toward $+x$; with $kx+\omega t$, toward $-x$.`],
      ['Angular wave number', R`k=\frac{2\pi}{\lambda}`, 3, 'In rad/m.'],
      ['Angular frequency', R`\omega=\frac{2\pi}{T}=2\pi f`, 3],
      ['Wave speed', R`v=\frac{\omega}{k}=\frac{\lambda}{T}=\lambda f`, 3],
      ['Transverse velocity', R`u=-\omega y_m\cos(kx-\omega t)`, 2, R`An element's velocity across the string, $u=\frac{\partial y}{\partial t}$; up to $\omega y_m$. It isn't the wave speed.`],
    ]},
    { no: '16-2', rows: [
      ['Wave speed on a string', R`v=\sqrt{\frac{\tau}{\mu}}`, 3, R`$\tau$: the tension. The string sets $v$; the source sets $f$.`],
      ['Linear density', R`\mu=\frac{m}{L}`, 3, 'Mass per length, in kg/m.'],
    ]},
    { no: '16-3', rows: [
      ['Average power', R`P_\text{avg}=\tfrac{1}{2}\mu v\omega^2y_m^2`, 3, 'Twice the amplitude or twice the frequency: four times the power.'],
    ]},
    { no: '16-4', rows: [
      ['The wave equation', R`\frac{\partial^2y}{\partial x^2}=\frac{1}{v^2}\frac{\partial^2y}{\partial t^2}`, 3],
      ['Any travelling shape', R`y=h(kx\pm\omega t),\quad v=\frac{\omega}{k}`, 2, 'Any shape moving without changing solves the wave equation.'],
    ]},
    { no: '16-5', rows: [
      ['Superposition', R`y'(x,t)=y_1(x,t)+y_2(x,t)`, 3, 'Overlapping waves add, and pass through each other unchanged.'],
      ['Two equal waves', R`y'=\left[2y_m\cos\tfrac{\phi}{2}\right]\sin\left(kx-\omega t+\tfrac{\phi}{2}\right)`, 3, 'Same amplitude, frequency and direction, phase difference φ.'],
      ['Resultant amplitude', R`y_m'=2y_m\left|\cos\tfrac{\phi}{2}\right|`, 2, R`$2y_m$ for $\phi=0$ (fully constructive), $0$ for $\phi=\pi$ (fully destructive).`],
      ['Phase from a shift', R`\phi=2\pi\frac{\Delta x}{\lambda}`, 2, R`A shift of one wavelength is $2\pi$ rad.`],
    ]},
    { no: '16-6', rows: [
      ['Adding phasors', R`(y_m')^2=y_{m1}^2+y_{m2}^2+2y_{m1}y_{m2}\cos\phi`, 3, 'Two waves of the same frequency and direction, any amplitudes: the law of cosines.'],
      ['Phase of the resultant', R`\tan\beta=\frac{y_{m2}\sin\phi}{y_{m1}+y_{m2}\cos\phi}`, 1, R`Measured from the first wave's phasor.`],
    ]},
    { no: '16-7', rows: [
      ['Standing wave', R`y'=\left[2y_m\sin kx\right]\cos\omega t`, 3, 'Two equal waves running opposite ways.'],
      ['Nodes', R`x=n\frac{\lambda}{2},\quad n=0,1,2,\dots`, 2, 'Neighbouring nodes are half a wavelength apart.'],
      ['Antinodes', R`x=\left(n+\tfrac{1}{2}\right)\frac{\lambda}{2},\quad n=0,1,2,\dots`, 2],
      ['String fixed at both ends', R`f=\frac{nv}{2L},\quad n=1,2,3,\dots`, 3, R`The $n$th harmonic; $n=1$ is the fundamental.`],
      ['Resonant wavelengths', R`\lambda=\frac{2L}{n}`, 2],
    ]},
  ], extra: [
    ['Fundamental from the tension', R`f_1=\frac{1}{2L}\sqrt{\frac{\tau}{\mu}}`, R`Four times the tension doubles the frequency.`],
    ['Wavelength from the string', R`\lambda=\frac{1}{f}\sqrt{\frac{\tau}{\mu}}`],
    ['Power ratio', R`\frac{P_2}{P_1}=\left(\frac{y_{m2}}{y_{m1}}\right)^2\left(\frac{\omega_2}{\omega_1}\right)^2`, 'The same string.'],
    ['Greatest transverse speed', R`u_\text{max}=\omega y_m`],
  ] },

  // ===================================================================================================================
  { id: 'c17', mods: [
    { no: '17-1', rows: [
      ['Speed of sound', R`v=\sqrt{\frac{B}{\rho}}`, 3, R`$B$: the bulk modulus; $\rho$: the density.`],
      ['Bulk modulus', R`B=-\frac{\Delta p}{\Delta V/V}`, 2, 'In pascals: how hard the medium is to squeeze.'],
      ['Wavelength', R`\lambda=\frac{v}{f}`, 3],
    ]},
    { no: '17-2', rows: [
      ['Displacement wave', R`s(x,t)=s_m\cos(kx-\omega t)`, 2, 'Elements move along the direction of travel.'],
      ['Pressure wave', R`\Delta p(x,t)=\Delta p_m\sin(kx-\omega t)`, 2, 'A quarter cycle from the displacement.'],
      ['Pressure amplitude', R`\Delta p_m=v\rho\omega s_m`, 3],
    ]},
    { no: '17-3', rows: [
      ['Phase from path difference', R`\phi=\frac{\Delta L}{\lambda}2\pi`, 3],
      ['Fully constructive', R`\Delta L=m\lambda,\quad m=0,1,2,\dots`, 3],
      ['Fully destructive', R`\Delta L=\left(m+\tfrac{1}{2}\right)\lambda,\quad m=0,1,2,\dots`, 3],
    ]},
    { no: '17-4', rows: [
      ['Intensity', R`I=\frac{P}{A}`, 3, 'Power per area, in W/m².'],
      ['Intensity of a sound wave', R`I=\tfrac{1}{2}\rho v\omega^2s_m^2`, 2],
      ['Point source', R`I=\frac{P_s}{4\pi r^2}`, 3, 'Twice as far, a quarter of the intensity.'],
      ['Sound level', R`\beta=(10\ \text{dB})\log\frac{I}{I_0}`, 3, R`$I_0=10^{-12}\ \text{W/m}^2$.`],
      ['Change of level', R`\beta_2-\beta_1=(10\ \text{dB})\log\frac{I_2}{I_1}`, 2, R`Ten times the intensity adds $10$ dB; twice adds about $3$ dB.`],
    ]},
    { no: '17-5', rows: [
      ['Pipe open at both ends', R`f=\frac{nv}{2L},\quad n=1,2,3,\dots`, 3],
      ['Pipe closed at one end', R`f=\frac{nv}{4L},\quad n=1,3,5,\dots`, 3, 'Odd harmonics only.'],
      ['Wavelengths in pipes', R`\lambda_\text{open}=\frac{2L}{n},\quad \lambda_\text{closed}=\frac{4L}{n}`, 2],
    ]},
    { no: '17-6', rows: [
      ['Beat frequency', R`f_\text{beat}=f_1-f_2`, 3, 'The larger minus the smaller.'],
      ['Pitch heard', R`f=\frac{f_1+f_2}{2}`, 2],
    ]},
    { no: '17-7', rows: [
      ['Doppler effect', R`f'=f\,\frac{v\pm v_D}{v\mp v_S}`, 3, R`Toward each other: the upper signs, $f'$ goes up. Away: the lower signs. Speeds relative to the air.`],
      ['Moving source', R`f'=f\,\frac{v}{v\mp v_S}`, 2, 'Minus for a source coming toward the detector.'],
      ['Moving detector', R`f'=f\,\frac{v\pm v_D}{v}`, 2, 'Plus for a detector going toward the source.'],
    ]},
    { no: '17-8', rows: [
      ['Mach cone', R`\sin\theta=\frac{v}{v_S}`, 3, R`The cone's half-angle, for $v_S>v$.`],
      ['Mach number', R`\text{Mach number}=\frac{v_S}{v}`, 1],
    ]},
  ], extra: [
    ['Level and distance', R`\beta_2-\beta_1=-(20\ \text{dB})\log\frac{r_2}{r_1}`, 'A point source: 6 dB less each time the distance doubles.'],
    ['Two equal sources', R`\Delta\beta=(10\ \text{dB})\log2\approx3\ \text{dB}`],
    ['Where a boom is heard', R`d=\frac{h}{\tan\theta}`, R`A jet flying level at height $h$ is a distance $d$ further on when its boom reaches someone it passed over.`],
  ] },

  // ===================================================================================================================
  { id: 'c18', mods: [
    { no: '18-1', rows: [
      ['Triple point of water', R`T_3=273.16\ \text{K}`, 2, 'The fixed point of the Kelvin scale.'],
      ['Gas thermometer', R`T=(273.16\ \text{K})\frac{p}{p_3}`, 2, 'Constant volume; in the limit of little gas.'],
    ]},
    { no: '18-2', rows: [
      ['Celsius', R`T_C=T-273.15^\circ`, 3],
      ['Fahrenheit', R`T_F=\tfrac{9}{5}T_C+32^\circ`, 3],
      ['Sizes of degrees', R`1\ ^\circ\text{C}=1\ \text{K}=1.8\ ^\circ\text{F}`, 2, 'For temperature differences.'],
    ]},
    { no: '18-3', rows: [
      ['Linear expansion', R`\Delta L=L\alpha\,\Delta T`, 3],
      ['Volume expansion', R`\Delta V=V\beta\,\Delta T`, 2],
      ['Solids', R`\beta=3\alpha`, 2],
    ]},
    { no: '18-4', rows: [
      ['Heat and temperature change', R`Q=cm\,\Delta T`, 3, R`$c$: the specific heat.`],
      ['Heat capacity', R`Q=C\,\Delta T,\quad C=cm`, 1],
      ['Change of phase', R`Q=Lm`, 3, 'At a fixed temperature; L is the heat of transformation.'],
    ]},
    { no: '18-5', rows: [
      ['Work done by a gas', R`W=\int_{V_i}^{V_f}p\,dV`, 3, 'The area under the path on a p-V diagram; it depends on the path.'],
      ['First law of thermodynamics', R`\Delta E_\text{int}=Q-W`, 3, R`$Q$ added to the gas, $W$ done by it.`],
      ['Constant pressure', R`W=p\,\Delta V`, 3],
      ['Adiabatic', R`Q=0,\quad\Delta E_\text{int}=-W`, 2],
      ['Constant volume', R`W=0,\quad\Delta E_\text{int}=Q`, 2],
      ['Closed cycle', R`\Delta E_\text{int}=0,\quad Q=W`, 2],
      ['Free expansion', R`Q=W=0,\quad\Delta E_\text{int}=0`, 1],
    ]},
    { no: '18-6', rows: [
      ['Conduction', R`P_\text{cond}=kA\frac{T_H-T_C}{L}`, 3, R`$k$: the thermal conductivity.`],
      ['Thermal resistance', R`R=\frac{L}{k}`, 2],
      ['Two slabs in series', R`P_\text{cond}=\frac{A(T_H-T_C)}{L_1/k_1+L_2/k_2}`, 2],
      ['Radiation', R`P_\text{rad}=\sigma\varepsilon AT^4`, 3, R`$T$ in kelvins; $\varepsilon$: the emissivity, $1$ for a blackbody.`],
      ['Net radiation', R`P_\text{net}=\sigma\varepsilon A(T_\text{env}^4-T^4)`, 2, 'Absorbed from the surroundings minus emitted.'],
    ]},
  ], extra: [
    ['Mixing water', R`T_f=\frac{m_1T_1+m_2T_2}{m_1+m_2}`, 'Two amounts of the same liquid, no heat lost or changes of phase.'],
    ['Area expansion', R`\Delta A=2\alpha A\,\Delta T`],
    ['Degrees Fahrenheit in a change', R`\Delta T_F=1.8\,\Delta T_C`],
  ] },

  // ===================================================================================================================
  { id: 'c19', mods: [
    { no: '19-1', rows: [
      ['Moles', R`n=\frac{N}{N_A}=\frac{M_\text{sam}}{M}`, 3, R`$M$: the molar mass, in kg/mol.`],
      ['Molar mass', R`M=mN_A`, 2, R`$m$: the mass of one molecule.`],
    ]},
    { no: '19-2', rows: [
      ['Ideal gas law', R`pV=nRT`, 3, 'T in kelvins.'],
      ['In molecules', R`pV=NkT`, 3],
      ['Boltzmann constant', R`k=\frac{R}{N_A}`, 2],
      ['Fixed amount of gas', R`\frac{p_1V_1}{T_1}=\frac{p_2V_2}{T_2}`, 2],
      ['Isothermal work', R`W=nRT\ln\frac{V_f}{V_i}`, 3],
      ['Work at constant pressure', R`W=p\,\Delta V=nR\,\Delta T`, 2],
    ]},
    { no: '19-3', rows: [
      ['Pressure from molecules', R`p=\frac{nMv_\text{rms}^2}{3V}`, 2],
      ['rms speed', R`v_\text{rms}=\sqrt{\frac{3RT}{M}}`, 3],
    ]},
    { no: '19-4', rows: [
      ['Average translational kinetic energy', R`K_\text{avg}=\tfrac{3}{2}kT`, 3, 'Per molecule; the same for every gas at one temperature.'],
      ['Total for n moles', R`K_\text{tot}=\tfrac{3}{2}nRT`, 2],
    ]},
    { no: '19-5', rows: [
      ['Mean free path', R`\lambda=\frac{1}{\sqrt{2}\,\pi d^2\,N/V}`, 3, R`$d$: the molecular diameter; $\frac{N}{V}$: molecules per volume.`],
      ['Collision rate', R`\text{rate}=\frac{v_\text{avg}}{\lambda}`, 1],
    ]},
    { no: '19-6', rows: [
      ['Maxwell’s speed distribution', R`P(v)=4\pi\left(\frac{M}{2\pi RT}\right)^{3/2}v^2e^{-Mv^2/(2RT)}`, 2, 'The area under it is 1.'],
      ['Most probable speed', R`v_P=\sqrt{\frac{2RT}{M}}`, 3],
      ['Average speed', R`v_\text{avg}=\sqrt{\frac{8RT}{\pi M}}`, 3],
      ['In order', R`v_P<v_\text{avg}<v_\text{rms}`, 2],
    ]},
    { no: '19-7', rows: [
      ['Internal energy, monatomic', R`E_\text{int}=\tfrac{3}{2}nRT`, 3],
      ['Constant volume', R`Q=nC_V\,\Delta T`, 3],
      ['Monatomic gas', R`C_V=\tfrac{3}{2}R`, 3, R`About $12.5$ J/(mol·K).`],
      ['Any process', R`\Delta E_\text{int}=nC_V\,\Delta T`, 3, 'For any ideal gas: it depends only on the temperature change.'],
      ['Constant pressure', R`Q=nC_p\,\Delta T`, 3],
      ['The two molar specific heats', R`C_p=C_V+R`, 3],
    ]},
    { no: '19-8', rows: [
      ['Equipartition', R`E_\text{int}=\tfrac{f}{2}nRT`, 2, R`$f$ degrees of freedom, each with $\frac{1}{2}kT$ per molecule.`],
      ['Molar specific heat', R`C_V=\tfrac{f}{2}R`, 3, R`$f=3$ monatomic, $5$ diatomic, $6$ polyatomic.`],
      ['Ratio of specific heats', R`\gamma=\frac{C_p}{C_V}`, 2],
      ['Values of γ', R`\gamma_\text{mono}=\tfrac{5}{3},\quad\gamma_\text{di}=\tfrac{7}{5},\quad\gamma_\text{poly}=\tfrac{4}{3}`, 1],
    ]},
    { no: '19-9', rows: [
      ['Adiabatic process', R`pV^\gamma=\text{constant}`, 3, R`Slow, with $Q=0$.`],
      ['Temperature and volume', R`TV^{\gamma-1}=\text{constant}`, 2],
      ['Adiabatic work', R`W=\frac{p_iV_i-p_fV_f}{\gamma-1}`, 2],
      ['Free expansion', R`T_i=T_f,\quad p_iV_i=p_fV_f`, 1, 'An ideal gas rushing into a vacuum keeps its temperature.'],
    ]},
  ], extra: [
    ['Ratio of rms speeds', R`\frac{v_1}{v_2}=\sqrt{\frac{M_2}{M_1}}`, 'Two gases at the same temperature.'],
    ['Adiabatic temperature change', R`\frac{T_f}{T_i}=\left(\frac{V_i}{V_f}\right)^{\gamma-1}`],
    ['Work from the temperature drop', R`W=nC_V(T_i-T_f)`, 'In an adiabatic process.'],
  ] },

  // ===================================================================================================================
  { id: 'c20', mods: [
    { no: '20-1', rows: [
      ['Change in entropy', R`\Delta S=\int_i^f\frac{dQ}{T}`, 3, 'Along a reversible path between the two states.'],
      ['At constant temperature', R`\Delta S=\frac{Q}{T}`, 3],
      ['Ideal gas', R`\Delta S=nR\ln\frac{V_f}{V_i}+nC_V\ln\frac{T_f}{T_i}`, 2, 'By any process between the two states.'],
      ['Warming a body', R`\Delta S=mc\ln\frac{T_f}{T_i}`, 2],
      ['Second law', R`\Delta S\ge0`, 3, 'In a closed system: greater for irreversible processes, zero for reversible ones.'],
    ]},
    { no: '20-2', rows: [
      ['Energy over a cycle', R`|W|=|Q_H|-|Q_L|`, 3],
      ['Efficiency', R`\varepsilon=\frac{|W|}{|Q_H|}`, 3],
      ['Carnot cycle', R`\frac{|Q_H|}{T_H}=\frac{|Q_L|}{T_L}`, 2],
      ['Carnot efficiency', R`\varepsilon_C=1-\frac{T_L}{T_H}`, 3, 'The best any engine between these temperatures can do.'],
    ]},
    { no: '20-3', rows: [
      ['Refrigerator', R`|Q_H|=|Q_L|+|W|`, 2],
      ['Coefficient of performance', R`K=\frac{|Q_L|}{|W|}`, 3],
      ['Carnot refrigerator', R`K_C=\frac{T_L}{T_H-T_L}`, 3],
    ]},
    { no: '20-4', rows: [
      ['Multiplicity', R`W=\frac{N!}{n_1!\,n_2!}`, 3, R`$N$ molecules, $n_1$ in one half of a box and $n_2$ in the other.`],
      ['Boltzmann’s entropy equation', R`S=k\ln W`, 3],
      ['All microstates', R`\sum W=2^N`, 1, 'Each molecule in either half.'],
      ['Stirling’s approximation', R`\ln N!\approx N\ln N-N`, 1, 'For large N.'],
    ]},
  ], extra: [
    ['Heat flowing from hot to cold', R`\Delta S=|Q|\left(\frac{1}{T_L}-\frac{1}{T_H}\right)`, 'The entropy of the two reservoirs together: positive.'],
    ['Free expansion', R`\Delta S=nR\ln\frac{V_f}{V_i}`, 'Although Q = 0.'],
    ['Engine and refrigerator', R`K_C=\frac{1}{\varepsilon_C}-1`, 'Carnot ones between the same temperatures.'],
  ] },
];
