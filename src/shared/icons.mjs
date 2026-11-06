// Small line icons shared by every subject page: the tab bar (TAB_ICONS) and buttons and labels (UI_ICONS).
// Original drawings, 24 x 24, stroked with the text colour.
export const ic = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true" class="ic">${body}</svg>`;
export const TAB_ICONS = {
  summary: ic('<path d="M3.5 5.5c0-.8.7-1.5 1.5-1.5h6.2v15.5H5a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M20.5 5.5c0-.8-.7-1.5-1.5-1.5h-6.2v15.5H19a1.5 1.5 0 0 0 1.5-1.5z"/><path d="M6.5 8.5h2.2M15.3 8.5h2.2M15.3 12h2.2"/>'),
  practice: ic('<rect x="4" y="3" width="12.5" height="18" rx="2"/><path d="M7.5 8h5.5M7.5 11.5h5.5M7.5 15h3"/><path d="M14.2 19.8l6.1-6.1 1.6 1.6-6.1 6.1h-1.6z"/>'),
  formulas: ic('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M15.5 8H8.8l3.6 4-3.6 4h6.7"/>'),
  quizzes: ic('<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="M8.5 10.5l1.6 1.6 3.4-3.4M8.5 16.2h7"/>'),
  exams: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M8.5 14.5l2.2 2.2 4.8-4.8"/>'),
};
export const UI_ICONS = {
  search: ic('<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/>'),
  close: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
  system: ic('<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" class="fill"/>'),
  light: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>'),
  dark: ic('<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>'),
  arrow: ic('<path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>'),
  chevron: ic('<path d="M9 5.5l6.5 6.5L9 18.5"/>'),
  shuffle: ic('<path d="M3.5 7h3.2c2.3 0 3.6 1 4.8 3l1 1.7c1.2 2 2.5 3.3 4.8 3.3h3.2M3.5 17h3.2c1.4 0 2.4-.5 3.3-1.4M14.2 8.4C15 7.5 16 7 17.3 7h3.2M18 4.5L20.5 7 18 9.5M18 12.5l2.5 2.5-2.5 2.5"/>'),
  timer: ic('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4.2l2.6 1.6M9.5 2.5h5"/>'),
  lock: ic('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5"/>'),
  eye: ic('<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'),
  calendar: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'),
  print: ic('<path d="M7 8.5V3.5h10v5"/><rect x="3.5" y="8.5" width="17" height="8.5" rx="2"/><path d="M7 14h10v6.5H7z"/>'),
  night: ic('<path d="M18.5 14.8A7.5 7.5 0 0 1 9.2 5.5a7.5 7.5 0 1 0 9.3 9.3z"/><path d="M17.5 3v3.5M15.75 4.75h3.5"/>'),
  cards: ic('<rect x="7" y="3.5" width="12.5" height="16" rx="2"/><path d="M4.5 7.5v11a2 2 0 0 0 2 2h9"/><path d="M10.5 8.5h5.5M10.5 12h5.5"/>'),
};

// Each subject's badge in its own colours (the home page's cards use the same drawings), for the button in the app bar
// that switches between the subjects: on a Math page it shows Physics, and the other way round.
export const SUBJECT_ICONS = {
  math: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#3D8A4D"/><path d="M6 24Q16 -6 26 24" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/><path d="M5.5 21L16.5 4.5" fill="none" stroke="#9CC34C" stroke-width="2.2" stroke-linecap="round"/><circle cx="11" cy="12.75" r="2.4" fill="#9CC34C"/></svg>',
  physics: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#1F4B8F"/><path d="M8.5 6.5h15" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/><path d="M16 6.5L21.2 19.2" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/><path d="M9 20.5Q16 27 23 20.5" fill="none" stroke="#8FB4EC" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1.6 2.6"/><circle cx="21.9" cy="21" r="3.3" fill="#8FB4EC"/></svg>',
};
const SUBJECT_NAMES = { math: 'Math (CLA1)', physics: 'Physics (EP1)' };
export const subjectSwitch = (to, href) => `<a class="icon-btn subj-btn" href="${href}" aria-label="Switch to ${SUBJECT_NAMES[to]}" title="Switch to ${SUBJECT_NAMES[to]}">${SUBJECT_ICONS[to]}</a>`;
