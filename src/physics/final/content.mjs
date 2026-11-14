// Engineering Physics 1, the final: the chapters after the midterm, with each module's class on the course schedule.
// Chapters follow Fundamentals of Physics (Halliday, Resnick, Walker), the course textbook: the final page covers
// Chapters 15–20, every module of the book, also the four the class schedule leaves out (15-3, 18-6, 19-9 and 20-3),
// which the page marks "Not on the class schedule".
//
// `modules` are [number, title, class]: class is [the class number on the schedule, its date] or null when the
// schedule doesn't list the module. Two modules taught in one class share it (16-2 and 16-3 on 27 Nov). The schedule
// teaches 16-7 (4 Dec) before 16-6 (7 Dec); the page keeps the book's order and shows each module's own date.
// `dates` is the chapter's span on the schedule; `keys` are extra search words.
export const FINAL_ADDED = '2026-11-14';

export const chapters = [
  { id: 'c15', no: 15, title: 'Oscillations', mods: 'Modules 15-1 to 15-6', dates: '16–23 Nov',
    keys: 'simple harmonic motion SHM spring period frequency amplitude phase pendulum damping resonance oscillator',
    modules: [['15-1', 'Simple harmonic motion', [30, '2026-11-16']], ['15-2', 'Energy in simple harmonic motion', [31, '2026-11-17']],
      ['15-3', 'An angular simple harmonic oscillator', null], ['15-4', 'Pendulums, circular motion', [32, '2026-11-19']],
      ['15-5', 'Damped simple harmonic motion', [33, '2026-11-20']], ['15-6', 'Forced oscillations and resonance', [34, '2026-11-23']]] },
  { id: 'c16', no: 16, title: 'Waves I', mods: 'Modules 16-1 to 16-7', dates: '26 Nov – 7 Dec',
    keys: 'transverse wave string wavelength wave number wave speed tension power interference phasor standing wave node antinode harmonic',
    modules: [['16-1', 'Transverse waves', [36, '2026-11-26']], ['16-2', 'Wave speed on a stretched string', [37, '2026-11-27']],
      ['16-3', 'Energy and power of a wave traveling along a string', [37, '2026-11-27']], ['16-4', 'The wave equation', [38, '2026-11-30']],
      ['16-5', 'Interference of waves', [40, '2026-12-03']], ['16-6', 'Phasors', [42, '2026-12-07']], ['16-7', 'Standing waves and resonance', [41, '2026-12-04']]] },
  { id: 'c17', no: 17, title: 'Waves II', mods: 'Modules 17-1 to 17-8', dates: '8–14 Dec',
    keys: 'sound speed of sound bulk modulus pressure intensity decibel sound level pipe harmonic beats Doppler shock wave Mach cone',
    modules: [['17-1', 'Speed of sound', [43, '2026-12-08']], ['17-2', 'Traveling sound waves', [43, '2026-12-08']], ['17-3', 'Interference', [44, '2026-12-10']],
      ['17-4', 'Intensity and sound level', [44, '2026-12-10']], ['17-5', 'Sources of musical sound', [45, '2026-12-11']], ['17-6', 'Beats', [45, '2026-12-11']],
      ['17-7', 'The Doppler effect', [46, '2026-12-14']], ['17-8', 'Supersonic speeds, shock waves', [46, '2026-12-14']]] },
  { id: 'c18', no: 18, title: 'Temperature, heat and the first law of thermodynamics', mods: 'Modules 18-1 to 18-6', dates: '17–21 Dec',
    keys: 'temperature kelvin celsius fahrenheit thermal expansion heat specific heat latent heat first law work internal energy conduction radiation',
    modules: [['18-1', 'Temperature', [48, '2026-12-17']], ['18-2', 'The Celsius and Fahrenheit scales', [48, '2026-12-17']], ['18-3', 'Thermal expansion', [48, '2026-12-17']],
      ['18-4', 'Absorption of heat', [49, '2026-12-18']], ['18-5', 'The first law of thermodynamics', [50, '2026-12-21']], ['18-6', 'Heat transfer mechanisms', null]] },
  { id: 'c19', no: 19, title: 'The kinetic theory of gases', mods: 'Modules 19-1 to 19-9', dates: '22 Dec – 5 Jan',
    keys: 'ideal gas mole Avogadro pV = nRT rms speed kinetic energy mean free path Maxwell molar specific heat degrees of freedom adiabatic',
    modules: [['19-1', 'Avogadro’s number', [51, '2026-12-22']], ['19-2', 'Ideal gases', [51, '2026-12-22']], ['19-3', 'Pressure, temperature and rms speed', [52, '2026-12-24']],
      ['19-4', 'Translational kinetic energy', [52, '2026-12-24']], ['19-5', 'Mean free path', [53, '2026-12-25']], ['19-6', 'The distribution of molecular speeds', [53, '2026-12-25']],
      ['19-7', 'The molar specific heats of an ideal gas', [54, '2027-01-04']], ['19-8', 'Degrees of freedom and molar specific heats', [55, '2027-01-05']],
      ['19-9', 'The adiabatic expansion of an ideal gas', null]] },
  { id: 'c20', no: 20, title: 'Entropy and the second law of thermodynamics', mods: 'Modules 20-1 to 20-4', dates: '8–15 Jan',
    keys: 'entropy second law reversible irreversible heat engine efficiency Carnot refrigerator coefficient of performance microstate multiplicity',
    modules: [['20-1', 'Entropy', [57, '2027-01-08']], ['20-2', 'Entropy in the real world: engines', [58, '2027-01-12']], ['20-3', 'Refrigerators and real engines', null],
      ['20-4', 'A statistical view of entropy', [59, '2027-01-15']]] },
];

// the exercise days the schedule lists after the midterm (shown in the empty Quizzes tab until their sheets arrive)
export const EX_DAYS = [[47, '2026-12-15'], [60, '2027-01-18']];
