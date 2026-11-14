// Engineering Physics 1: the chapters of the midterm, the exam picker's cards and the icons. The quiz sheets are in
// quizzes.mjs (the practice sets, public) and private/exercises.mjs (the exercise days from class, locked).
// Chapters follow Fundamentals of Physics (Halliday, Resnick, Walker), the course textbook; the midterm covers 1–8.

// `keys` are extra search words for each chapter; `modules` are the book's modules, [number, title], used by the
// Summary (summary.mjs) and the Formulas tab (formulas.mjs)
export const chapters = [
  { id: 'c1', no: 1, title: 'Measurement', mods: 'Modules 1-1 to 1-3', keys: 'units SI base quantities significant figures conversion',
    modules: [['1-1', 'Measuring things, including lengths'], ['1-2', 'Time'], ['1-3', 'Mass']] },
  { id: 'c2', no: 2, title: 'Motion along a straight line', mods: 'Modules 2-1 to 2-6', keys: 'velocity acceleration free fall kinematics graphs constant acceleration',
    modules: [['2-1', 'Position, displacement and average velocity'], ['2-2', 'Instantaneous velocity and speed'], ['2-3', 'Acceleration'], ['2-4', 'Constant acceleration'], ['2-5', 'Free-fall acceleration'], ['2-6', 'Graphical integration']] },
  { id: 'c3', no: 3, title: 'Vectors', mods: 'Modules 3-1 to 3-3', keys: 'components unit vector dot product cross product scalar',
    modules: [['3-1', 'Vectors and their components'], ['3-2', 'Unit vectors, adding vectors by components'], ['3-3', 'Multiplying vectors']] },
  { id: 'c4', no: 4, title: 'Motion in two and three dimensions', mods: 'Modules 4-1 to 4-7', keys: 'projectile uniform circular motion relative motion',
    modules: [['4-1', 'Position and displacement'], ['4-2', 'Average and instantaneous velocity'], ['4-3', 'Average and instantaneous acceleration'], ['4-4', 'Projectile motion'], ['4-5', 'Uniform circular motion'], ['4-6', 'Relative motion in one dimension'], ['4-7', 'Relative motion in two dimensions']] },
  { id: 'c5', no: 5, title: 'Force and motion I', mods: 'Modules 5-1 to 5-3', keys: "Newton's laws free-body diagram tension normal force pulley",
    modules: [['5-1', 'Newton’s first and second laws'], ['5-2', 'Some particular forces'], ['5-3', 'Applying Newton’s laws']] },
  { id: 'c6', no: 6, title: 'Force and motion II', mods: 'Modules 6-1 to 6-3', keys: 'friction static kinetic drag terminal speed circular motion banked curve',
    modules: [['6-1', 'Friction'], ['6-2', 'The drag force and terminal speed'], ['6-3', 'Uniform circular motion']] },
  { id: 'c7', no: 7, title: 'Kinetic energy and work', mods: 'Modules 7-1 to 7-6', keys: 'work-energy theorem spring force power variable force',
    modules: [['7-1', 'Kinetic energy'], ['7-2', 'Work and kinetic energy'], ['7-3', 'Work done by the gravitational force'], ['7-4', 'Work done by a spring force'], ['7-5', 'Work done by a general variable force'], ['7-6', 'Power']] },
  { id: 'c8', no: 8, title: 'Potential energy and conservation of energy', mods: 'Modules 8-1 to 8-5', keys: 'mechanical energy conservation potential energy curve',
    modules: [['8-1', 'Potential energy'], ['8-2', 'Conservation of mechanical energy'], ['8-3', 'Reading a potential energy curve'], ['8-4', 'Work done on a system by an external force'], ['8-5', 'Conservation of energy']] },
];

// the exam picker's cards (physics/), in course order. `exam` is its name in site.json (for the date and the page)
export const EXAMS = [
  { id: 'midterm', page: 'midterm', exam: 'Physics midterm', kicker: 'Midterm', title: 'Chapters 1–8',
    text: 'Measurement, motion in one and two dimensions, vectors, Newton’s laws, friction and circular motion, work and energy.' },
  { id: 'final', page: 'final', exam: 'Physics final', kicker: 'Final', title: 'Chapters 15–20',
    text: 'Oscillations, waves and sound, temperature and heat, the kinetic theory of gases, and entropy.' },
];

// ---------- original icons (no university marks) ----------
// the badge: a pendulum, drawn with the Math badge's classes so it takes the page's colours (physics.css)
export const BADGE = '<svg class="badge" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" class="b-bg"/><path d="M8.5 6.5h15" class="b-curve b-ceil"/><path d="M16 6.5L21.2 19.2" class="b-curve b-string"/><path d="M9 20.5Q16 27 23 20.5" class="b-tan b-arc"/><circle cx="21.9" cy="21" r="3.3" class="b-dot"/></svg>';

const big = (body) => `<svg viewBox="0 0 48 48" aria-hidden="true" class="tile-ic">${body}</svg>`;
export const CH_ICONS = {
  c1: big('<rect x="5" y="17" width="38" height="14" rx="2"/><path d="M11 17v6M17 17v8M23 17v6M29 17v8M35 17v6" class="lime-stroke"/>'),
  c2: big('<path d="M5 33h38"/><circle cx="13" cy="33" r="3.2" class="lime-fill"/><path d="M20 24h18M33 19l5 5-5 5"/>'),
  c3: big('<path d="M9 39L35 13M27 13h8v8"/><path d="M9 39h24M29 35l4 4-4 4" class="lime-stroke"/>'),
  c4: big('<path d="M5 40h38"/><path d="M8 40Q24 2 40 40" class="lime-stroke"/><circle cx="24" cy="21" r="3.2" class="lime-fill"/>'),
  c5: big('<path d="M5 38h38"/><rect x="9" y="21" width="17" height="17" rx="1"/><path d="M26 29.5h14M36 25.5l4 4-4 4" class="lime-stroke"/>'),
  c6: big('<circle cx="21" cy="26" r="13"/><circle cx="34" cy="26" r="3.2" class="lime-fill"/><path d="M34 22V8M30 12l4-4 4 4" class="lime-stroke"/><path d="M21 26h9" stroke-dasharray="2 3"/>'),
  c7: big('<path d="M5 38h38"/><rect x="7" y="25" width="13" height="13" rx="1"/><path d="M14 18h22M32 14l4 4-4 4" class="lime-stroke"/><rect x="31" y="25" width="13" height="13" rx="1" stroke-dasharray="2.5 2.5"/>'),
  habits: big('<rect x="10" y="6" width="28" height="36" rx="3"/><path d="M15.5 16l3 3 6-6M15.5 28l3 3 6-6" class="lime-stroke"/><path d="M28 16h5M28 28h5"/>'),
  c8: big('<path d="M4 40C13 40 15 11 24 11S35 40 44 40"/><circle cx="14.5" cy="22" r="3.2" class="lime-fill"/><path d="M19 30l5 6" class="lime-stroke"/>'),
  // the final's chapters (src/physics/final): a block on a spring, a wave, a speaker, a thermometer, a gas in a box, an engine
  c15: big('<path d="M10 5h28"/><path d="M24 5v4l-7 2.5 14 5-14 5 14 5-7 2.5v3"/><rect x="15" y="32" width="18" height="11" rx="1.5" class="lime-fill"/>'),
  c16: big('<path d="M4 24C9 10 15 10 20 24S31 38 36 24" class="lime-stroke"/><path d="M36 24c2-5 4-8 6-9"/><path d="M8 40h32M36 36l4 4-4 4"/>'),
  c17: big('<path d="M7 19h7l10-8v26l-10-8H7z"/><path d="M30 18a8 8 0 0 1 0 12M35 13a15 15 0 0 1 0 22" class="lime-stroke"/>'),
  c18: big('<path d="M20 31V9a4 4 0 0 1 8 0v22a8 8 0 1 1-8 0z"/><circle cx="24" cy="37" r="4.2" class="lime-fill"/><path d="M24 33V17" class="lime-stroke"/><path d="M31 13h5M31 19h5M31 25h5"/>'),
  c19: big('<rect x="6" y="8" width="36" height="32" rx="2"/><circle cx="16" cy="19" r="3" class="lime-fill"/><circle cx="31" cy="30" r="3" class="lime-fill"/><circle cx="32" cy="15" r="3" class="lime-fill"/><path d="M19 17l6-4M28 31l-8 3M34 18l4 5" class="lime-stroke"/>'),
  c20: big('<rect x="9" y="4" width="30" height="8" rx="2"/><rect x="9" y="36" width="30" height="8" rx="2"/><circle cx="24" cy="24" r="6"/><path d="M24 12v6M24 30v6" class="lime-stroke"/><path d="M30 24h11M37 20l4 4-4 4" class="lime-stroke"/>'),
};
export const EXAM_ICONS = {
  midterm: big('<path d="M5 40h38"/><path d="M8 40Q24 2 40 40" class="lime-stroke"/><circle cx="24" cy="21" r="3.2" class="lime-fill"/><path d="M8 40l7-12"/>'),
  final: big('<path d="M4 40C13 40 15 11 24 11S35 40 44 40"/><circle cx="14.5" cy="22" r="3.2" class="lime-fill"/>'),
};
