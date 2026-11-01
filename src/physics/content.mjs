// Engineering Physics 1: the chapters of the midterm, the exam picker's cards and the icons. The quiz sheets are in
// quizzes.mjs (the practice sets, public) and private/exercises.mjs (the exercise days from class, locked).
// Chapters follow Fundamentals of Physics (Halliday, Resnick, Walker), the course textbook; the midterm covers 1–8.

// `keys` are extra search words for each chapter
export const chapters = [
  { id: 'c1', no: 1, title: 'Measurement', mods: 'Modules 1-1 to 1-3', keys: 'units SI base quantities significant figures conversion' },
  { id: 'c2', no: 2, title: 'Motion along a straight line', mods: 'Modules 2-1 to 2-6', keys: 'velocity acceleration free fall kinematics graphs constant acceleration' },
  { id: 'c3', no: 3, title: 'Vectors', mods: 'Modules 3-1 to 3-3', keys: 'components unit vector dot product cross product scalar' },
  { id: 'c4', no: 4, title: 'Motion in two and three dimensions', mods: 'Modules 4-1 to 4-7', keys: 'projectile uniform circular motion relative motion' },
  { id: 'c5', no: 5, title: 'Force and motion I', mods: 'Modules 5-1 to 5-3', keys: "Newton's laws free-body diagram tension normal force pulley" },
  { id: 'c6', no: 6, title: 'Force and motion II', mods: 'Modules 6-1 to 6-3', keys: 'friction static kinetic drag terminal speed circular motion banked curve' },
  { id: 'c7', no: 7, title: 'Kinetic energy and work', mods: 'Modules 7-1 to 7-6', keys: 'work-energy theorem spring force power variable force' },
  { id: 'c8', no: 8, title: 'Potential energy and conservation of energy', mods: 'Modules 8-1 to 8-5', keys: 'mechanical energy conservation potential energy curve' },
];

// the exam picker's cards (physics/), in course order. `exam` is its name in site.json (for the date and the page)
export const EXAMS = [
  { id: 'midterm', page: 'midterm', exam: 'Physics midterm', kicker: 'Midterm', title: 'Chapters 1–8',
    text: 'Measurement, motion in one and two dimensions, vectors, Newton’s laws, friction and circular motion, work and energy.' },
  { id: 'final', exam: 'Physics final', kicker: 'Final', title: 'Final exam', text: 'Notes will appear here later in the course.' },
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
  c8: big('<path d="M4 40C13 40 15 11 24 11S35 40 44 40"/><circle cx="14.5" cy="22" r="3.2" class="lime-fill"/><path d="M19 30l5 6" class="lime-stroke"/>'),
};
export const EXAM_ICONS = {
  midterm: big('<path d="M5 40h38"/><path d="M8 40Q24 2 40 40" class="lime-stroke"/><circle cx="24" cy="21" r="3.2" class="lime-fill"/><path d="M8 40l7-12"/>'),
  final: big('<path d="M4 40C13 40 15 11 24 11S35 40 44 40"/><circle cx="14.5" cy="22" r="3.2" class="lime-fill"/>'),
};
