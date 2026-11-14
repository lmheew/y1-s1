(() => {
  // Settings of this page: a subject page other than Math (Physics) sets them as JSON in <body data-page>, and Math
  // uses the defaults. store: where the page keeps its state; seen: its key in study-seen (for New labels and the
  // home page's card); home: the tab it opens on the first time; scores: where mock scores are kept; suggest and
  // tryWords: the search sheet's suggestions and its hint when nothing matches.
  const CONF = (() => { try { return JSON.parse(document.body.dataset.page || '{}') || {}; } catch (e) { return {}; } })();
  const KEY = CONF.store || 'cla1-midterm-review';
  // the theme is site-wide: it lives in the Math page's store, which the home page and every page's head read
  const THEME_KEY = 'cla1-midterm-review';
  const SUBJ = CONF.seen || 'math';
  // the five tabs, and the night-before sheet: a view without a tab, opened from Exams, Formulas and the home page
  const VIEWS = ['summary', 'practice', 'formulas', 'quizzes', 'exams', 'night'].filter((v) => document.getElementById('view-' + v));
  const HOME = VIEWS.includes(CONF.home) ? CONF.home : 'summary';
  const FILTERS = ['all', 'review', 'unmarked'];
  const THEMES = ['system', 'light', 'dark'];
  const st = { tab: HOME, marks: {}, filter: 'all', theme: 'system', seg: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') {
      if (VIEWS.includes(saved.tab) && saved.tab !== 'night') st.tab = saved.tab;
      if (saved.marks && typeof saved.marks === 'object') st.marks = saved.marks;
      if (FILTERS.includes(saved.filter)) st.filter = saved.filter;
      if (THEMES.includes(saved.theme)) st.theme = saved.theme;
      if (saved.seg && typeof saved.seg === 'object') st.seg = saved.seg;
    }
  } catch (e) { /* storage unavailable: start fresh */ }
  if (KEY !== THEME_KEY) {
    try { const t = (JSON.parse(localStorage.getItem(THEME_KEY) || 'null') || {}).theme; st.theme = THEMES.includes(t) ? t : 'system'; } catch (e) { /* ignore */ }
  }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };
  // a page with its own store also writes the theme into the site-wide one
  const saveTheme = () => {
    if (KEY === THEME_KEY) return;
    try {
      const o = JSON.parse(localStorage.getItem(THEME_KEY) || 'null') || {};
      o.theme = st.theme;
      localStorage.setItem(THEME_KEY, JSON.stringify(o));
    } catch (e) { /* ignore */ }
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  // this page's address from the site's root (where the manifest is), such as "physics/midterm/"
  const PATH = (() => {
    const m = document.querySelector('link[rel="manifest"]');
    if (!m) return '';
    const base = new URL('./', m.href).pathname;
    return location.pathname.startsWith(base) ? decodeURI(location.pathname.slice(base.length)).replace(/index\.html$/, '') : '';
  })();
  const root = document.documentElement;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DAY = 86400000;

  // ----- theme: system follows the device (or the host's choice); light/dark override it. On the site a script in
  // the page's head has already set the saved light/dark choice (data-theme-early), so that one isn't a host's. -----
  const hostTheme = root.hasAttribute('data-theme-early') ? null : root.getAttribute('data-theme');
  const themeBtn = $('#theme-btn');
  const THEME_LABEL = { system: 'Theme: matches your device. Tap for light.', light: 'Theme: light. Tap for dark.', dark: 'Theme: dark. Tap to match your device.' };
  function applyTheme() {
    if (st.theme === 'system') {
      if (hostTheme) root.setAttribute('data-theme', hostTheme); else root.removeAttribute('data-theme');
    } else root.setAttribute('data-theme', st.theme);
    themeBtn.dataset.mode = st.theme;
    themeBtn.setAttribute('aria-label', THEME_LABEL[st.theme]);
    themeBtn.title = THEME_LABEL[st.theme];
  }
  themeBtn.addEventListener('click', () => { st.theme = THEMES[(THEMES.indexOf(st.theme) + 1) % THEMES.length]; save(); saveTheme(); applyTheme(); });
  applyTheme();

  // ----- phones: a band's intro shows one line (page.css) until it is tapped -----
  document.addEventListener('click', (e) => {
    const p = e.target.closest && e.target.closest('.band-lede');
    if (p && window.matchMedia('(max-width: 639px)').matches) p.classList.add('open');
  });

  // ----- views. Every tab but Summary arrives as text (<script id="lazy-<view>">) and is built the first time it opens;
  // VIEW_INIT then switches on that tab's features. -----
  const tabs = $$('.tab');
  const panels = Object.fromEntries(VIEWS.map((v) => [v, document.getElementById('view-' + v)]));
  const VIEW_INIT = {};
  const built = {};
  function materialize(view) {
    if (built[view]) return;
    built[view] = true;
    const box = $('[data-lazy]', panels[view]);
    const src = document.getElementById('lazy-' + view);
    if (box && src) {
      // the solutions inside travel as scripts of their own, with their end tags written <\/script> (build-lib lazyTab);
      // '<\/script>' is written so too, since this file is also inlined in a <script> (the private copy)
      box.innerHTML = src.textContent.replace(/<\\\/script>/g, '<\/script>');
      src.remove();
    }
    const scope = box || panels[view];
    markNew(scope);
    if (VIEW_INIT[view]) VIEW_INIT[view](scope);
    buildToc(view);
  }

  // ----- side menu on wide screens (page.css shows it from 1100 px): the sections of the open tab, the one being
  // read highlighted. Built from the page itself when the tab is built; narrower screens never show it. -----
  const TOC_SECTIONS = { summary: '.unit, .habits', practice: '.punit', formulas: '.fgroup', quizzes: '.qgroup', exams: '#ex-upcoming, .mockgroup', night: '.nsec' };
  const tocOf = {};
  function buildToc(view) {
    const box = $('.content', panels[view]);
    if (!box || tocOf[view]) return;
    const secs = $$(TOC_SECTIONS[view], box).filter((sec) => sec.id && $('h2', sec));
    if (secs.length < 2) return;
    const label = (sec) => {
      const h = $('h2', sec).cloneNode(true);
      $$('.kicker, .new-pill', h).forEach((x) => x.remove());
      const k = $('.kicker', sec);
      const day = k ? ($('.nw', k) || k).textContent.split(' · ')[0].trim() : '';
      return { day: sec.classList.contains('habits') ? 'Before the exam' : day, title: h.textContent.trim() };
    };
    const nav = document.createElement('nav');
    nav.className = 'toc';
    nav.setAttribute('aria-label', 'On this page');
    nav.innerHTML = '<div class="toc-inner"><p class="toc-h">On this page</p><ol>' + secs.map((sec) => {
      const l = label(sec);
      const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      // Exams: each mock and past paper too, as a switch to that paper
      const papers = sec.classList.contains('mockgroup') ? $$('.seg-btn', sec).map((b) => {
        const c = b.cloneNode(true);
        $$('.seg-score, .seg-lock', c).forEach((x) => x.remove());
        return `<li><button type="button" class="toc-paper" data-group="${sec.id}" data-seg="${b.dataset.seg}">${esc(c.textContent.trim())}</button></li>`;
      }).join('') : '';
      return `<li><a href="#${sec.id}" data-toc="${sec.id}">${l.day ? `<span class="toc-k">${esc(l.day)}</span>` : ''}<span class="toc-t">${esc(l.title)}</span></a>${papers ? `<ol class="toc-papers">${papers}</ol>` : ''}</li>`;
    }).join('') + '</ol></div>';
    nav.addEventListener('click', (e) => {
      const paper = e.target.closest('.toc-paper');
      if (paper) {
        const group = document.getElementById(paper.dataset.group);
        const btn = group && $(`.seg-btn[data-seg="${paper.dataset.seg}"]`, group);
        if (btn) { btn.click(); jumpTo(group); paintToc(); }
        return;
      }
      const a = e.target.closest('a[data-toc]');
      const el = a && document.getElementById(a.dataset.toc);
      if (!el) return;
      e.preventDefault();
      jumpTo(el);
    });
    box.prepend(nav);
    box.classList.add('has-toc');
    tocOf[view] = { nav, links: $$('a[data-toc]', nav), secs };
    paintToc();
  }
  const wide = window.matchMedia('(min-width: 1100px)');
  function paintToc() {
    const t = tocOf[current];
    if (!t || !wide.matches) return;
    const line = (parseFloat(getComputedStyle(root).getPropertyValue('--anchor-top')) || 72) + 12;
    let on = -1;
    t.secs.forEach((sec, i) => {
      const shown = sec.offsetParent !== null;
      t.links[i].parentElement.hidden = !shown; // a Practice filter can hide a whole unit
      if (shown && sec.getBoundingClientRect().top <= line) on = i;
    });
    if (window.innerHeight + window.scrollY >= root.scrollHeight - 4) on = t.secs.reduce((last, sec, i) => (sec.offsetParent !== null ? i : last), on);
    t.links.forEach((a, i) => { if (i === Math.max(on, 0)) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    $$('.toc-paper', t.nav).forEach((b) => {
      const s = $(`#${b.dataset.group} .seg-btn[data-seg="${b.dataset.seg}"]`);
      b.classList.toggle('sel', Boolean(s) && s.getAttribute('aria-selected') === 'true');
    });
  }
  let tocQueued = false;
  window.addEventListener('scroll', () => { if (!tocQueued) { tocQueued = true; requestAnimationFrame(() => { tocQueued = false; paintToc(); }); } }, { passive: true });
  window.addEventListener('resize', paintToc);
  // current: the view on screen; st.tab: the tab to open next time (never the night-before sheet)
  let current = '', before = '';
  const tabRow = $('.tabbar-row');
  function show(view) {
    if (!VIEWS.includes(view)) view = HOME;
    if (current && current !== view && current !== 'night') before = current; // where the night-before sheet's Back goes
    current = view;
    materialize(view);
    markSeen(view);
    if (view !== 'night') { st.tab = view; save(); }
    tabs.forEach((t) => { const on = t.dataset.view === view; t.setAttribute('aria-selected', String(on)); t.tabIndex = on || (view === 'night' && t.dataset.view === HOME) ? 0 : -1; });
    // the tab bar's filled pill slides to the open tab (page.css), and goes while a view without a tab is open
    const at = tabs.findIndex((t) => t.dataset.view === view);
    tabRow.style.setProperty('--tab-i', String(Math.max(at, 0)));
    tabRow.classList.toggle('no-tab', at < 0);
    VIEWS.forEach((v) => { panels[v].hidden = v !== view; });
    paintToc();
    drawAll(view);
    remember({ tab: view, at: '', label: '' });
  }
  // A view opened by hand (a tab, the brand, Back, the night-before link) fades in, its title rising into place
  // (.view-in in page.css). Jumps made from code (search hits, tiles, "Pick up where you left off") show their
  // target at once, since they scroll to a spot in the view right away.
  VIEWS.forEach((v) => panels[v].addEventListener('animationend', (e) => { if (e.target === panels[v]) panels[v].classList.remove('view-in'); }));
  function openView(view) {
    const from = current;
    show(view);
    window.scrollTo({ top: 0 });
    const p = panels[current];
    if (reduced || from === current) return;
    p.classList.remove('view-in');
    void p.offsetWidth; // so the animation starts again if it was still running
    p.classList.add('view-in');
  }

  // ----- long tabs: Practice cards, questions, formula rows and Physics Summary modules away from the screen skip
  // layout at first (content-visibility: auto in page.css), so a tab with a hundred of them shows at once. Right after,
  // they are drawn for good (.drawn), from the top, while the page is idle (about 10 ms at a time, so scrolling and
  // taps stay smooth), and the page is whole a moment later. A card the browser draws itself as it comes near takes
  // its real height then, and scroll anchoring doesn't make up for that, so scrolling back up past such cards would
  // jump: a jump draws everything above its target first (drawAbove), and a scroll past cards not drawn yet draws
  // them at once. -----
  const CV = ['.prob', '.rq', '.frow', '.smod'].map((s) => s + ':not(.drawn)').join(', ');
  const drawing = {};
  const whenIdle = window.requestIdleCallback ? (f) => requestIdleCallback(f, { timeout: 400 }) : (f) => setTimeout(() => f(null), 40);
  function drawAll(view) {
    const panel = panels[view];
    if (drawing[view] || !$(CV, panel)) return;
    drawing[view] = true;
    const step = (idle) => {
      if (panel.hidden) { drawing[view] = false; return; } // carries on when the tab is shown again
      const t0 = performance.now(), budget = idle && !idle.didTimeout ? Math.min(10, idle.timeRemaining()) : 8;
      let el;
      while ((el = $(CV, panel))) {
        el.classList.add('drawn');
        void el.offsetHeight; // lay it out now, so the time it takes counts
        if (performance.now() - t0 >= budget) break;
      }
      if ($(CV, panel)) whenIdle(step); else drawing[view] = false;
    };
    requestAnimationFrame(() => whenIdle(step)); // after the tab's first paint
  }
  // a scroll past cards not drawn yet (a fling, or the browser putting back a scroll position) draws them at once
  window.addEventListener('scroll', () => {
    const panel = panels[current];
    if (!panel || !drawing[current]) return;
    const todo = [];
    for (const c of $$(CV, panel)) { if (c.getBoundingClientRect().top >= innerHeight) break; todo.push(c); }
    todo.forEach((c) => c.classList.add('drawn'));
  }, { passive: true });
  function drawAbove(el) {
    const panel = VIEWS.map((v) => panels[v]).find((p) => p.contains(el));
    if (!panel) return;
    $$(CV, panel).forEach((c) => {
      if (c === el || c.compareDocumentPosition(el) & (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_POSITION_CONTAINED_BY)) c.classList.add('drawn');
    });
  }
  function setHash(view) { try { if (location.hash !== '#' + view) location.hash = view; } catch (e) { /* ignore */ } }
  tabs.forEach((t) => t.addEventListener('click', () => { openView(t.dataset.view); setHash(t.dataset.view); }));
  $('.tabbar-row').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    next.focus(); next.click();
  });
  $('.brand').addEventListener('click', (e) => { e.preventDefault(); openView(HOME); setHash(HOME); });
  window.addEventListener('hashchange', () => {
    const h = location.hash.slice(1);
    if (VIEWS.includes(h) && h !== current) openView(h);
  });

  // Scroll so an element's top meets the anchor line under the bars. Graphs are drawn as they come near, which can
  // move what's below them while the page glides, so once it settles the position is checked and set again (unless
  // the reader has started scrolling themselves).
  function jumpTo(el) {
    let tries = 0, cancelled = false;
    const stop = () => { cancelled = true; };
    ['wheel', 'touchstart', 'keydown'].forEach((t) => window.addEventListener(t, stop, { once: true, passive: true }));
    document.dispatchEvent(new CustomEvent('buildgraphs', { detail: el })); // graphs.js draws the ones above it first
    drawAbove(el); // and so do the long tabs' cards, so their heights are real
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    const settle = () => {
      if (cancelled) return;
      const off = el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
      const atEnd = window.innerHeight + window.scrollY >= root.scrollHeight - 2;
      if (Math.abs(off) > 6 && !(atEnd && off > 0) && tries++ < 3) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        setTimeout(settle, 250);
      } else ['wheel', 'touchstart', 'keydown'].forEach((t) => window.removeEventListener(t, stop));
    };
    setTimeout(settle, reduced ? 60 : 900);
  }

  // jump to an element in a view and flash it
  function goTo(view, id) {
    show(view);
    const el = document.getElementById(id);
    if (!el) return;
    if (panels.practice && panels.practice.classList.contains('in-session') && panels.practice.contains(el)) ssExit(); // a search hit leaves the session
    const sh = el.closest('.sheet[data-seg]');
    if (sh && sh.hidden) selectSeg(sh.closest('.qgroup'), sh.dataset.seg);
    const pu = el.closest('.punit');
    if ((el.classList.contains('prob') && el.hidden) || (pu && pu.hidden)) { st.filter = 'all'; save(); applyFilter(); }
    const det = el.closest('details');
    if (det) det.open = true;
    requestAnimationFrame(() => {
      jumpTo(el);
      el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
      setTimeout(() => el.classList.remove('flash'), 1900);
    });
    setHash(view);
  }
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-goto]');
    if (g) goTo(g.dataset.goto, g.dataset.target);
  });

  // ----- "New" labels and tab dots: anything added in the last 14 days that this device hasn't looked at yet.
  // Tabs carry the newest date of what they hold. A tab's dot goes as soon as the tab is opened; the New labels
  // inside it stay for the rest of that visit and are gone from the next one. The newest date seen in each tab is
  // kept per device in localStorage (study-seen, as "<subject>:<tab>"; the home page reads "math" or "physics" from it
  // for that subject's card, and keeps "news" there itself), and the copy taken when the visit started is kept in
  // sessionStorage (study-seen-start).
  const fresh = (date) => {
    if (!date) return false;
    const t = new Date(date + 'T00:00:00+09:00').getTime();
    return Date.now() - t < 14 * DAY && Date.now() >= t - DAY;
  };
  const SEEN_KEY = 'study-seen', START_KEY = 'study-seen-start';
  const storage = (kind) => { try { return window[kind] || null; } catch (e) { return null; } };
  const readSeen = (store, key) => {
    try { const v = JSON.parse((store && store.getItem(key)) || 'null'); return v && typeof v === 'object' ? v : null; } catch (e) { return null; }
  };
  const seen = readSeen(storage('localStorage'), SEEN_KEY) || {};
  let start = readSeen(storage('sessionStorage'), START_KEY);
  if (!start) {
    start = { ...seen };
    try { storage('sessionStorage').setItem(START_KEY, JSON.stringify(start)); } catch (e) { /* ignore */ }
  }
  const saveSeen = () => { try { storage('localStorage').setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) { /* ignore */ } };
  const unseen = (date, key, base) => fresh(date) && !(base[key] >= date);
  function markSeen(view) {
    const t = tabs.find((x) => x.dataset.view === view);
    if (!t) return;
    t.classList.remove('has-new');
    const d = t.dataset.newest;
    if (d && !(seen[SUBJ + ':' + view] >= d)) { seen[SUBJ + ':' + view] = d; saveSeen(); }
  }
  function markNew(scope) {
    const panel = scope.closest ? scope.closest('.view') : null;
    const key = SUBJ + ':' + (panel ? panel.id.replace(/^view-/, '') : 'summary');
    $$('[data-added]', scope).forEach((el) => {
      if (!unseen(el.dataset.added, key, start)) return;
      el.classList.add('is-new');
      const lead = $('.test-hint', el); // the Test me bar: the label leads its hint
      if (lead) { if (!$('.new-pill', lead)) lead.insertAdjacentHTML('afterbegin', '<span class="new-pill lead">New</span> '); return; }
      const head = $('.punit-head h2, .prob-head, .unit-head h2, .fgroup > h2, .sheet-title, .gx-title, .tricks > h3', el);
      if (head && !$('.new-pill', head)) head.insertAdjacentHTML('beforeend', ' <span class="new-pill">New</span>');
    });
  }
  tabs.forEach((t) => t.classList.toggle('has-new', unseen(t.dataset.newest, SUBJ + ':' + t.dataset.view, seen)));
  // for the home page's card of this subject: the newest date on this page when it was last opened
  // (the build also puts the page's latest What's new date on the tab bar, for updates that add no new item)
  const newestHere = [...tabs.map((t) => t.dataset.newest || ''), ($('.tabbar') || {}).dataset ? $('.tabbar').dataset.updated || '' : ''].sort().pop();
  if (newestHere && !(seen[SUBJ] >= newestHere)) { seen[SUBJ] = newestHere; saveSeen(); }
  markNew(panels.summary);
  built.summary = true;
  buildToc('summary');

  // ----- Practice: marks, progress rings, filter -----
  let probs = [];
  function paint(card) {
    const m = st.marks[card.dataset.id] || '';
    card.dataset.state = m || 'none';
    $$('.mbtn', card).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mark === m)));
    const tag = $('.state-tag', card);
    tag.textContent = m === 'got' ? 'Got it' : m === 'review' ? 'Review' : '';
    tag.className = 'state-tag' + (m ? ' ' + m : '');
  }
  function setRing(svg, frac) {
    const c = $('.ring-val', svg);
    c.style.strokeDashoffset = String(Number(c.dataset.c) * (1 - frac));
  }
  function counts() {
    if (!probs.length) return;
    let got = 0, rev = 0;
    $$('.punit').forEach((u) => {
      const cards = $$('.prob', u);
      let g = 0;
      cards.forEach((c) => { const m = st.marks[c.dataset.id]; if (m === 'got') g++; else if (m === 'review') rev++; });
      got += g;
      $('.ucount', u).textContent = g + '/' + cards.length;
      const mini = $('.uring[data-unit="' + u.id + '"]');
      if (mini) { setRing($('svg', mini), g / cards.length); $('.uring-count', mini).textContent = g + '/' + cards.length; }
    });
    const total = probs.length;
    setRing($('#ring-all'), got / total);
    $('#ring-all-text').textContent = got + '/' + total;
    $('#ov-got').textContent = got;
    $('#ov-rev').textContent = rev;
    $('#ov-un').textContent = total - got - rev;
    remember({ got, rev, total });
  }
  function applyFilter() {
    if (!probs.length) return;
    $$('.filters .chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === st.filter)));
    probs.forEach((card) => {
      const m = st.marks[card.dataset.id];
      card.hidden = st.filter === 'review' ? m !== 'review' : st.filter === 'unmarked' ? Boolean(m) : false;
    });
    $$('.punit').forEach((u) => { u.hidden = $$('.prob', u).every((c) => c.hidden); });
    const note = $('#empty-note');
    note.hidden = probs.some((c) => !c.hidden);
    note.textContent = st.filter === 'review'
      ? 'Nothing is marked "Review again" yet. Open an answer and mark how it went.'
      : 'Every problem has a mark. Switch to All to go through them again.';
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.mbtn');
    if (!b) return;
    const card = b.closest('.prob');
    const id = card.dataset.id;
    if (st.marks[id] === b.dataset.mark) delete st.marks[id];
    else st.marks[id] = b.dataset.mark;
    save(); paint(card); counts();
  });
  VIEW_INIT.practice = (scope) => {
    probs = $$('.prob', scope);
    if (!probs.length) return; // a page whose problems are still to come
    ssSetup(scope);
    probs.forEach(paint);
    counts();
    applyFilter();
    $$('.filters .chip', scope).forEach((c) => c.addEventListener('click', () => { st.filter = c.dataset.filter; save(); applyFilter(); }));
    let lastPick = null;
    $('#random-btn').addEventListener('click', () => {
      let pool = probs.filter((c) => st.marks[c.dataset.id] !== 'got');
      if (!pool.length) pool = probs.slice();
      if (pool.length > 1) pool = pool.filter((c) => c !== lastPick);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      lastPick = pick;
      goTo('practice', pick.id);
    });
    const reset = $('#reset');
    let armTimer = null;
    reset.addEventListener('click', () => {
      if (!reset.classList.contains('armed')) {
        reset.classList.add('armed');
        reset.textContent = 'Tap again to clear every mark';
        armTimer = setTimeout(() => { reset.classList.remove('armed'); reset.textContent = 'Clear all marks'; }, 4000);
        return;
      }
      clearTimeout(armTimer);
      st.marks = {}; save();
      probs.forEach(paint); counts(); applyFilter();
      reset.classList.remove('armed');
      reset.textContent = 'Marks cleared';
      setTimeout(() => { reset.textContent = 'Clear all marks'; }, 2000);
    });
  };

  // ----- sheet switchers (quizzes: In-class / Follow-up A / B; exams: Mock 1 / 2 / 3) -----
  function selectSeg(group, idx) {
    idx = String(idx);
    $$('.seg-btn', group).forEach((b) => { const on = b.dataset.seg === idx; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    $$('.sheet', group).forEach((s) => { s.hidden = s.dataset.seg !== idx; });
    st.seg[group.id] = idx; save();
  }
  function bindSegs(scope) {
    $$('.qgroup', scope).forEach((g) => {
      const saved = st.seg[g.id];
      if (saved && $('.seg-btn[data-seg="' + saved + '"]', g)) selectSeg(g, saved);
      $$('.seg-btn', g).forEach((b) => b.addEventListener('click', () => selectSeg(g, b.dataset.seg)));
    });
  }

  // ----- timers: count up; with data-limit (seconds, the mock exams) count down, then show the overtime as +mm:ss -----
  const fmt = (ms) => { const s = Math.floor(ms / 1000); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  function bindTimers(scope) {
    $$('[data-timer]', scope).forEach((t) => {
      if (t.dataset.bound) return;
      t.dataset.bound = '1';
      let start = 0, acc = 0, iv = null;
      const limit = Number(t.dataset.limit || 0) * 1000;
      const out = $('.time', t), go = $('.t-go', t), label = $('.t-go span', t), rst = $('.t-reset', t);
      const display = (ms) => {
        if (!limit) { out.textContent = fmt(ms); return; }
        const left = limit - ms;
        out.textContent = left > 0 ? fmt(left + 999) : '+' + fmt(-left);
        t.classList.toggle('over', left <= 0);
        if (left <= 0 && !t.dataset.rang) { t.dataset.rang = '1'; label.textContent = "Time's up"; }
      };
      const tick = () => display(acc + Date.now() - start);
      go.addEventListener('click', () => {
        if (iv) { acc += Date.now() - start; clearInterval(iv); iv = null; label.textContent = 'Resume'; }
        else { start = Date.now(); iv = setInterval(tick, 250); tick(); label.textContent = t.classList.contains('over') ? "Time's up" : 'Pause'; }
        rst.hidden = false;
        t.classList.toggle('running', Boolean(iv));
        document.dispatchEvent(new Event('quiztimer')); // the floating calculator turns off while a timer runs
      });
      rst.addEventListener('click', () => {
        clearInterval(iv); iv = null; acc = 0; delete t.dataset.rang;
        t.classList.remove('running', 'over');
        display(0); label.textContent = 'Start timer'; rst.hidden = true;
        document.dispatchEvent(new Event('quiztimer'));
      });
    });
  }

  // ----- Print: a mock or past midterm on its own, as a paper to write on or with its answers (see the print
  // part of page.css). The marks stay until the page is used again after printing, since some browsers (iPhone)
  // report the end of printing while their print sheet still shows. -----
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.print-btn');
    const sheet = btn && btn.closest('.sheet');
    if (sheet) printSheet(sheet, btn.dataset.print);
  });
  function printSheet(sheet, kind) {
    const path = [];
    for (let el = sheet.parentElement; el && el !== document.body; el = el.parentElement) { el.classList.add('print-path'); path.push(el); }
    sheet.classList.add('printing');
    root.dataset.print = kind;
    const opened = kind === 'key' ? $$('details', sheet).filter((d) => !d.open) : [];
    if (kind === 'key') $$('details.sol', sheet).forEach(fillSol); // before print(), which doesn't wait for 'toggle'
    opened.forEach((d) => { d.open = true; });
    const cleanup = () => {
      path.forEach((el) => el.classList.remove('print-path'));
      sheet.classList.remove('printing');
      delete root.dataset.print;
      opened.forEach((d) => { d.open = false; });
    };
    window.addEventListener('afterprint', () => {
      const later = () => { document.removeEventListener('pointerdown', later, true); document.removeEventListener('keydown', later, true); cleanup(); };
      document.addEventListener('pointerdown', later, true);
      document.addEventListener('keydown', later, true);
    }, { once: true });
    window.print();
  }

  // ----- a solution's answer and steps travel as text (<script class="lazy-sol">, build-lib solToggle) and are built
  // the first time it opens: on the click that opens it, so they are there in the frame it opens, else on 'toggle'
  // (opened from code). Mark buttons sit after the text and are built with the tab. -----
  function fillSol(det) {
    const src = $('.sol-body > script.lazy-sol', det);
    if (!src || src.parentElement.parentElement !== det) return;
    const t = document.createElement('template');
    t.innerHTML = src.textContent;
    src.replaceWith(t.content);
  }
  document.addEventListener('click', (e) => {
    const s = e.target.closest && e.target.closest('summary');
    if (s && s.parentElement.matches('details.sol') && !s.parentElement.open) fillSol(s.parentElement);
  }, true);

  // ----- solutions open one step at a time (the answer itself shows at once) -----
  function stepper(det) {
    if (det.dataset.stepped) return;
    det.dataset.stepped = '1';
    const box = $('.steps', det);
    if (!box) return;
    const steps = [];
    Array.from(box.children).forEach((c) => { if (c.tagName === 'UL' || c.tagName === 'OL') steps.push(...c.children); else steps.push(c); });
    if (steps.length < 2) return;
    let shown = 1;
    const bar = document.createElement('div');
    bar.className = 'stepbar';
    bar.innerHTML = '<button type="button" class="pill step-next"><span>Next step</span></button><button type="button" class="linkbtn step-all">Show all steps</button><span class="step-count" aria-live="polite"></span>';
    box.after(bar);
    const paintSteps = () => {
      steps.forEach((s, i) => { s.classList.toggle('step-hidden', i >= shown); });
      $('.step-count', bar).textContent = `Step ${shown} of ${steps.length}`;
      if (shown >= steps.length) bar.remove();
    };
    $('.step-next', bar).addEventListener('click', () => { shown++; paintSteps(); const s = steps[shown - 1]; if (s) s.classList.add('step-in'); });
    $('.step-all', bar).addEventListener('click', () => { shown = steps.length; paintSteps(); });
    paintSteps();
  }
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    if (d && d.matches && d.matches('details.sol') && d.open) { fillSol(d); stepper(d); }
  }, true);

  // ----- search -----
  let index = [];
  try { index = JSON.parse($('#search-index').textContent); } catch (e) { index = []; }
  const sheet = $('#search'), input = $('#search-input'), results = $('#search-results');
  const SUGGEST = Array.isArray(CONF.suggest) ? CONF.suggest : ['chain rule', 'vertical tangent', 'Taylor', "Newton's method", 'inflection', 'mock'];
  let lastFocus = null;
  function openSearch() {
    lastFocus = document.activeElement;
    sheet.hidden = false;
    document.body.classList.add('noscroll');
    render();
    input.focus();
  }
  function closeSearch() {
    sheet.hidden = true;
    document.body.classList.remove('noscroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function render() {
    const q = input.value.trim().toLowerCase();
    results.textContent = '';
    if (!q) {
      results.append(el('p', 's-hint', 'Search every note, practice problem, formula, quiz and mock exam. Try one of these:'));
      const row = el('div', 's-suggest');
      SUGGEST.forEach((s) => {
        const b = el('button', 'chip', s); b.type = 'button';
        b.addEventListener('click', () => { input.value = s; render(); input.focus(); });
        row.append(b);
      });
      results.append(row);
      return;
    }
    const words = q.split(/\s+/).filter(Boolean);
    const hits = index.filter((e) => words.every((w) => e.k.includes(w)));
    if (!hits.length) { results.append(el('p', 's-empty', 'No matches for "' + input.value.trim() + '". Try a shorter word, like ' + (CONF.tryWords || '"limit" or "series"') + '.')); return; }
    const groups = new Map();
    hits.forEach((h) => { if (!groups.has(h.s)) groups.set(h.s, []); groups.get(h.s).push(h); });
    groups.forEach((list, sec) => {
      results.append(el('p', 's-sec', sec + ' · ' + list.length));
      list.slice(0, 25).forEach((h) => {
        const b = el('button', 's-hit'); b.type = 'button';
        b.append(el('span', 's-t', h.t), el('span', 's-p', h.p));
        b.addEventListener('click', () => { closeSearch(); goTo(h.v, h.id); });
        results.append(b);
      });
    });
  }
  $('#search-btn').addEventListener('click', openSearch);
  $('#search-close').addEventListener('click', closeSearch);
  input.addEventListener('input', render);
  sheet.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && sheet.hidden && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });

  // ----- in-class sheets and past midterms: on the public site they arrive encrypted (locked.json) and open with the password -----
  // Key: PBKDF2-SHA256 over the normalized password; content: AES-GCM over gzip'd JSON. Must match build.mjs.
  // A key remembered on this device opens them at load; each is put in place once its tab (Quizzes, Exams) is built.
  const mainEl = $('main');
  const lockSrc = mainEl ? mainEl.dataset.locked : '';
  let unlockQuizzes = () => {};
  if (lockSrc) {
    const LKEY = 'cla1-unlock-key'; // shared with Physics: its locked files use the same password and salt, so one unlock opens both
    const normalize = (pw) => pw.toLowerCase().replace(/[\s-]+/g, '');
    const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
    const tob64 = (buf) => { let s = ''; new Uint8Array(buf).forEach((b) => { s += String.fromCharCode(b); }); return btoa(s); };
    const supported = Boolean(window.crypto && window.crypto.subtle && window.DecompressionStream && window.fetch);
    const storedKey = () => { try { return localStorage.getItem(LKEY) || sessionStorage.getItem(LKEY); } catch (e) { return null; } };
    const keepKey = (raw, remember) => {
      try { sessionStorage.setItem(LKEY, raw); } catch (e) { /* ignore */ }
      if (remember) { try { localStorage.setItem(LKEY, raw); } catch (e) { /* ignore */ } }
    };
    const forgetKey = () => {
      try { localStorage.removeItem(LKEY); } catch (e) { /* ignore */ }
      try { sessionStorage.removeItem(LKEY); } catch (e) { /* ignore */ }
    };
    let box = null;
    const getBox = () => (box ? Promise.resolve(box) : fetch(lockSrc).then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then((j) => { box = j; return j; }));
    async function keyFromPassword(pw, b) {
      const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(normalize(pw)), 'PBKDF2', false, ['deriveKey']);
      return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: unb64(b.salt), iterations: b.iter, hash: 'SHA-256' },
        base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
    }
    async function openWith(key, b) {
      const zipped = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(b.iv) }, key, unb64(b.ct));
      const text = await new Response(new Blob([zipped]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
      return JSON.parse(text);
    }
    const say = (form, text, err) => { const m = $('.u-msg', form); m.textContent = text; m.classList.toggle('err', Boolean(err)); };
    let unlocked = false, opened = null;
    // swap each password panel that is on the page for its sheet (tabs are built on first open, so this runs again then)
    function place() {
      if (!opened) return;
      Object.keys(opened.sheets).forEach((id) => {
        const old = document.getElementById(id);
        if (!old || !old.classList.contains('lock')) return;
        const t = document.createElement('template');
        t.innerHTML = opened.sheets[id];
        const fresh = t.content.firstElementChild;
        fresh.hidden = old.hidden;
        old.replaceWith(fresh);
        markNew(fresh.parentNode);
        bindTimers(fresh);
        if (fresh.classList.contains('mock')) bindMock(fresh);
      });
      const row = $('#lockrow');
      if (row) row.hidden = false;
      drawAll(current);
    }
    function apply(data) {
      if (unlocked) return;
      unlocked = true;
      opened = data;
      index.push(...data.index);
      document.body.classList.add('unlocked');
      place();
    }
    function bindForms(scope) {
      $$('form.unlock', scope).forEach((form) => {
        const pw = $('input[name="password"]', form), go = $('.u-go', form), reveal = $('.u-show', form);
        reveal.addEventListener('click', () => {
          const showing = pw.type === 'password';
          pw.type = showing ? 'text' : 'password';
          reveal.textContent = showing ? 'Hide' : 'Show';
          reveal.setAttribute('aria-pressed', String(showing));
          pw.focus();
        });
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          if (go.disabled || unlocked) return;
          if (!normalize(pw.value)) { say(form, 'Enter the password first.', true); pw.focus(); return; }
          if (!supported) { say(form, "This browser can't open the locked sheets. Try a recent Chrome, Safari or Firefox.", true); return; }
          const sheetId = form.closest('.sheet').id;
          go.disabled = true; go.textContent = 'Unlocking…'; say(form, '');
          let data = null, key = null;
          try {
            const b = await getBox();
            key = await keyFromPassword(pw.value, b);
            try { data = await openWith(key, b); } catch (err) { say(form, "That password didn't work. Check it and try again.", true); }
          } catch (err) {
            say(form, "Couldn't load the locked sheets. Check your connection and try again.", true);
          }
          go.disabled = false; go.textContent = 'Unlock';
          if (!data) { pw.focus(); pw.select(); return; }
          try { keepKey(tob64(await crypto.subtle.exportKey('raw', key)), $('input[name="remember"]', form).checked); } catch (err) { /* stays open until reload */ }
          apply(data);
          const title = $('#' + sheetId + ' .sheet-title');
          if (title) { title.tabIndex = -1; title.focus({ preventScroll: true }); }
        });
      });
      const again = $('#lock-again', scope);
      if (again) again.addEventListener('click', () => { forgetKey(); location.reload(); });
    }
    let reopening = false;
    unlockQuizzes = (scope) => {
      if (opened) { place(); bindForms(scope); return; }
      bindForms(scope);
      if (reopening) $$('form.unlock', scope).forEach((f) => say(f, 'Opening…'));
    };
    // reopen with a key saved by "Remember on this device" (or earlier in this tab)
    const raw = supported ? storedKey() : null;
    if (raw) {
      reopening = true;
      getBox()
        .then((b) => crypto.subtle.importKey('raw', unb64(raw), { name: 'AES-GCM' }, true, ['decrypt'])
          .then((k) => openWith(k, b))
          .then(apply, () => forgetKey()))
        .catch(() => { /* offline: keep the key, show the form */ })
        .then(() => { reopening = false; if (!unlocked) $$('form.unlock').forEach((f) => say(f, '')); });
    }
  }
  VIEW_INIT.quizzes = (scope) => {
    bindSegs(scope);
    bindTimers(scope);
    unlockQuizzes(scope);
  };

  // ----- Formulas: "Test me" hides every formula and exact value until tapped -----
  VIEW_INIT.formulas = (scope) => {
    const testBtn = $('#test-btn'), testReset = $('#test-reset');
    if (!testBtn) return;
    const fview = panels.formulas;
    const cards = () => $$('.frow, .exact td:not(.na)', scope);
    const setTest = (on) => {
      fview.classList.toggle('testing', on);
      testBtn.setAttribute('aria-pressed', String(on));
      $('span', testBtn).textContent = on ? 'Show everything' : 'Test me';
      testReset.hidden = !on;
      cards().forEach((c) => {
        c.classList.remove('shown');
        if (on) { c.tabIndex = 0; c.setAttribute('role', 'button'); c.setAttribute('aria-label', 'Hidden: tap to show'); }
        else { c.removeAttribute('tabindex'); c.removeAttribute('role'); c.removeAttribute('aria-label'); }
      });
    };
    testBtn.addEventListener('click', () => setTest(!fview.classList.contains('testing')));
    testReset.addEventListener('click', () => setTest(true));
    const reveal = (c) => { c.classList.add('shown'); c.removeAttribute('aria-label'); };
    scope.addEventListener('click', (e) => {
      if (!fview.classList.contains('testing')) return;
      const c = e.target.closest('.frow, .exact td:not(.na)');
      if (c) reveal(c);
    });
    scope.addEventListener('keydown', (e) => {
      if (!fview.classList.contains('testing') || (e.key !== 'Enter' && e.key !== ' ')) return;
      const c = e.target.closest('.frow, .exact td:not(.na)');
      if (c) { e.preventDefault(); reveal(c); }
    });
  };

  // ----- Exams: countdown to each exam date (Japan time), and mock exams you mark yourself -----
  function countdown() {
    const now = Date.now();
    const today = new Date(new Date(now).toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' }) + 'T00:00:00+09:00').getTime();
    $$('.up-item[data-date]').forEach((li) => {
      const date = li.dataset.date, time = li.dataset.time;
      if (!date) return;
      const at = new Date(`${date}T${time || '00:00'}:00+09:00`).getTime();
      $('.up-when', li).textContent = new Date(`${date}T12:00:00+09:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Tokyo' }) + (time ? ' · ' + time : '');
      const days = Math.round((new Date(`${date}T00:00:00+09:00`).getTime() - today) / DAY);
      li.classList.toggle('past', days < 0 || Boolean(time && at < now - 3 * 3600000));
      li.classList.toggle('soon', days >= 0 && days <= 7);
      $('.up-left', li).textContent = days < 0 ? 'Done' : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `in ${days} days`;
      li.dataset.order = days < 0 ? 1e6 - days : days;
    });
    // soonest first, then exams without a date, then the ones already done
    $$('.up-list').forEach((ul) => {
      const items = $$('.up-item', ul);
      const key = (li) => (li.dataset.order !== undefined ? Number(li.dataset.order) : 5e5);
      items.slice().sort((a, b) => key(a) - key(b)).forEach((li) => ul.append(li));
    });
  }
  const SKEY = CONF.scores || 'cla1-mock-scores';
  let scores = {};
  try { scores = JSON.parse(localStorage.getItem(SKEY) || '{}') || {}; } catch (e) { scores = {}; }
  const saveScores = () => { try { localStorage.setItem(SKEY, JSON.stringify(scores)); } catch (e) { /* ignore */ } };
  // a mock or past midterm you mark yourself: ticks add up to a score, kept in this browser
  function bindMock(sh) {
    if (sh.dataset.bound) return;
    sh.dataset.bound = '1';
    const id = sh.dataset.mock, total = Number(sh.dataset.total);
    const ticks = new Set(Array.isArray(scores[id]) ? scores[id] : []);
    const segScore = $(`.seg-btn[aria-controls="${sh.id}"] .seg-score`);
    const paintScore = () => {
      let pts = 0;
      $$('.mk', sh).forEach((b) => {
        const on = ticks.has(b.dataset.k);
        b.setAttribute('aria-pressed', String(on));
        if (on) pts += Number(b.dataset.pts);
      });
      $('.score-val', sh).textContent = pts;
      if (segScore) segScore.textContent = ticks.size ? ` · ${pts}/${total}` : '';
    };
    sh.addEventListener('click', (e) => {
      const b = e.target.closest('.mk');
      if (b) {
        if (ticks.has(b.dataset.k)) ticks.delete(b.dataset.k); else ticks.add(b.dataset.k);
        scores[id] = Array.from(ticks); saveScores(); paintScore();
        return;
      }
      if (e.target.closest('.mk-clear')) { ticks.clear(); delete scores[id]; saveScores(); paintScore(); }
    });
    paintScore();
  }
  VIEW_INIT.exams = (scope) => {
    bindSegs(scope);
    bindTimers(scope);
    countdown();
    setInterval(countdown, 60000);
    $$('.sheet.mock', scope).forEach(bindMock);
    unlockQuizzes(scope); // the past midterms are locked like the in-class sheets
  };

  // ----- for the home page: where this page was left (the view, and the card or section at the top of the screen)
  // and its Practice progress, in study-pages (localStorage), keyed by the page's address from the site's root.
  // The home page's "Pick up where you left off" opens the page with study-resume (sessionStorage) set to that spot. -----
  function remember(extra) {
    if (!PATH || !CONF.name) return;
    try {
      const all = JSON.parse(localStorage.getItem('study-pages') || 'null') || {};
      all[PATH] = Object.assign(all[PATH] || {}, { name: CONF.name, t: Date.now() }, extra);
      localStorage.setItem('study-pages', JSON.stringify(all));
    } catch (e) { /* ignore */ }
  }
  const PLACES = '.prob, .rq, .wex, .smod, .unit, .habits, .fgroup, .nsec, .sheet, .punit, .qgroup, .mockgroup, #ex-upcoming';
  const clean = (el) => {
    if (!el) return '';
    const c = el.cloneNode(true);
    $$('.new-pill, .sr, .kicker, .state-tag, .seg-score, svg', c).forEach((n) => n.remove());
    return c.textContent.replace(/\s+/g, ' ').trim();
  };
  const dayOf = (sec) => { const k = sec && $('.kicker', sec); return k ? ($('.nw', k) || k).textContent.split(' · ')[0].trim() : ''; };
  function placeLabel(el) {
    if (el.matches('.prob')) return [dayOf(el.closest('.punit')), clean($('.qno', el))].filter(Boolean).join(' · ');
    if (el.matches('.rq')) return [clean($('.sheet-title', el.closest('.sheet') || el)), clean($('.ql', el))].filter(Boolean).join(' · ');
    if (el.matches('.wex, .smod')) return clean($('.smod-h', el.closest('.smod') || el)) || 'Worked example';
    if (el.matches('.sheet')) return clean($('.sheet-title', el));
    if (el.matches('.habits')) return 'Exam-day habits';
    return [dayOf(el), clean($('h2', el))].filter(Boolean).join(' · ');
  }
  let placeTimer = 0;
  window.addEventListener('scroll', () => {
    clearTimeout(placeTimer);
    placeTimer = setTimeout(() => {
      const line = (parseFloat(getComputedStyle(root).getPropertyValue('--anchor-top')) || 72) + 24;
      const hit = document.elementFromPoint(Math.min(innerWidth / 2, 420), line);
      const spot = hit && hit.closest(PLACES);
      const ok = spot && spot.id && panels[current] && panels[current].contains(spot);
      remember({ tab: current, at: ok ? spot.id : '', label: ok ? placeLabel(spot) : '' });
    }, 600);
  }, { passive: true });

  // ----- the night-before sheet: Print, and Back to the tab it was opened from -----
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-night-print]')) { window.print(); return; }
    if (e.target.closest('[data-night-back]')) { const v = before || HOME; openView(v); setHash(v); }
  });

  // ----- Practice session: one problem at a time. Its setup picks which problems (not marked yet, to review, all), from
  // which chapters or lessons and, on Physics, which levels, and how many, in a shuffled order. The bar on top counts
  // through them (Skip, or Next once the problem is marked); the end shows how it went, with the ones to review ready
  // to go again. The cards are the Practice tab's own, so marks, answers and steps work as everywhere. -----
  const ss = { on: false, queue: [], i: 0 };
  const ssPrefs = Object.assign({ pool: 'unmarked', n: '10', off: [] }, st.ss || {});
  function ssChoice(k) { const b = $(`.ss-chips[data-k="${k}"] .chip[aria-pressed="true"]`); return b ? b.dataset.v : ''; }
  function ssPool() {
    const pool = ssChoice('pool');
    const on = (k) => $$(`.ss-chips[data-k="${k}"] .chip[aria-pressed="true"]`).map((b) => b.dataset.v);
    const units = on('units'), tiers = on('tiers'), byTier = Boolean($('.ss-chips[data-k="tiers"]'));
    return probs.filter((c) => {
      const m = st.marks[c.dataset.id];
      if ((pool === 'unmarked' && m) || (pool === 'review' && m !== 'review')) return false;
      if (!units.includes(c.closest('.punit').id)) return false;
      const tier = c.closest('.ptier');
      return !byTier || Boolean(tier && tiers.some((t) => tier.classList.contains('ptier-' + t)));
    });
  }
  function ssCount() {
    const go = $('#ss-go');
    if (!go) return;
    const n = ssPool().length, want = ssChoice('n');
    const take = want === 'all' ? n : Math.min(n, Number(want));
    go.disabled = !take;
    $('span', go).textContent = take ? `Start · ${take} problem${take === 1 ? '' : 's'}` : 'No problems match';
  }
  function ssBar() {
    let bar = $('#sbar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'sbar';
      bar.className = 'sbar';
      bar.innerHTML = '<div class="sbar-row"><span class="s-count" aria-live="polite"></span><button type="button" class="linkbtn s-end">End</button><button type="button" class="pill s-next">Skip</button></div><div class="s-track"><i></i></div>';
      $('[data-lazy="practice"]').prepend(bar);
    }
    return bar;
  }
  function ssShow() {
    const card = ss.queue[ss.i];
    $$('.prob.s-cur, .punit.s-unit').forEach((x) => x.classList.remove('s-cur', 's-unit'));
    card.hidden = false;
    card.classList.add('s-cur');
    card.closest('.punit').classList.add('s-unit');
    const det = $('details.sol', card);
    if (det && det.open) det.open = false;
    const bar = ssBar();
    // where the problem is from: its chapter or lesson, and its level on Physics
    const tier = card.closest('.ptier');
    const where = [dayOf(card.closest('.punit')), tier ? clean($('.tier-tag', tier)) : ''].filter(Boolean).join(' · ');
    $('.s-count', bar).innerHTML = `Problem <b>${ss.i + 1}</b> of ${ss.queue.length}<small class="s-where">${where.replace(/</g, '&lt;')}</small>`;
    $('.s-track i', bar).style.width = `${(100 * ss.i) / ss.queue.length}%`;
    ssNextLabel();
    window.scrollTo({ top: 0 });
    card.tabIndex = -1;
    card.focus({ preventScroll: true });
  }
  function ssNextLabel() {
    const card = ss.queue[ss.i], b = $('#sbar .s-next');
    if (!card || !b) return;
    b.textContent = st.marks[card.dataset.id] ? (ss.i === ss.queue.length - 1 ? 'Finish' : 'Next') : 'Skip';
  }
  function ssStart(list) {
    if (!list.length) return;
    ss.on = true;
    ss.queue = list;
    ss.i = 0;
    ss.done = new Set();
    $('#sdone') && $('#sdone').remove();
    panels.practice.classList.add('in-session');
    ssShow();
  }
  function ssFinish() {
    const seen = ss.queue.slice(0, Math.min(ss.i + 1, ss.queue.length));
    const got = seen.filter((c) => st.marks[c.dataset.id] === 'got').length;
    const again = seen.filter((c) => st.marks[c.dataset.id] === 'review');
    const skipped = seen.length - got - again.length;
    $$('.prob.s-cur, .punit.s-unit').forEach((x) => x.classList.remove('s-cur', 's-unit'));
    $('#sbar') && $('#sbar').remove();
    const box = document.createElement('div');
    box.id = 'sdone';
    box.className = 'sdone';
    box.innerHTML = `<h3>Session done</h3><p>${seen.length} problem${seen.length === 1 ? '' : 's'}: <b>${got}</b> got it, <b>${again.length}</b> to review again${skipped ? `, <b>${skipped}</b> skipped` : ''}.</p>
      <div class="sdone-btns">${again.length ? `<button type="button" class="pill s-again">Go again with the ${again.length} to review</button>` : ''}<button type="button" class="linkbtn s-new">New session</button><button type="button" class="linkbtn s-exit">Back to all problems</button></div>`;
    $('[data-lazy="practice"]').prepend(box);
    ss.again = again;
    ss.on = false;
    window.scrollTo({ top: 0 });
  }
  function ssExit() {
    ss.on = false;
    panels.practice.classList.remove('in-session');
    $$('.prob.s-cur, .punit.s-unit').forEach((x) => x.classList.remove('s-cur', 's-unit'));
    $('#sdone') && $('#sdone').remove();
    $('#sbar') && $('#sbar').remove();
    applyFilter();
    counts();
  }
  function ssSetup(scope) {
    const box = $('#ssetup', scope);
    if (!box) return;
    // the last choices come back (st.ss); a chapter or level switched off stays off
    $$('.ss-chips', box).forEach((g) => {
      const k = g.dataset.k, multi = g.hasAttribute('data-multi');
      $$('.chip', g).forEach((b) => b.setAttribute('aria-pressed', String(multi ? !ssPrefs.off.includes(b.dataset.v) : b.dataset.v === ssPrefs[k])));
      if (!multi && !$('.chip[aria-pressed="true"]', g)) $('.chip', g).setAttribute('aria-pressed', 'true');
      g.addEventListener('click', (e) => {
        const b = e.target.closest('.chip');
        if (!b) return;
        if (multi) b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
        else $$('.chip', g).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        ssPrefs.pool = ssChoice('pool');
        ssPrefs.n = ssChoice('n');
        ssPrefs.off = $$('.ss-chips[data-multi] .chip[aria-pressed="false"]', box).map((x) => x.dataset.v);
        st.ss = ssPrefs; save();
        ssCount();
      });
    });
    $('#ss-open', scope).addEventListener('click', () => {
      box.hidden = !box.hidden;
      $('#ss-open', scope).setAttribute('aria-expanded', String(!box.hidden));
      if (!box.hidden) { ssCount(); box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' }); }
    });
    $('#ss-go', box).addEventListener('click', () => {
      const list = ssPool();
      for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
      const want = ssChoice('n');
      box.hidden = true;
      $('#ss-open', scope).setAttribute('aria-expanded', 'false');
      ssStart(want === 'all' ? list : list.slice(0, Number(want)));
    });
    scope.addEventListener('click', (e) => {
      if (e.target.closest('#sbar .s-next')) { if (ss.i >= ss.queue.length - 1) ssFinish(); else { ss.i++; ssShow(); } return; }
      if (e.target.closest('#sbar .s-end')) { ssFinish(); return; }
      if (e.target.closest('.s-again')) { ssStart(ss.again.slice()); return; }
      if (e.target.closest('.s-new')) { ssExit(); box.hidden = false; $('#ss-open', scope).setAttribute('aria-expanded', 'true'); ssCount(); box.scrollIntoView({ block: 'nearest' }); return; }
      if (e.target.closest('.s-exit')) { ssExit(); window.scrollTo({ top: 0 }); return; }
      if (ss.on && e.target.closest('.prob.s-cur .mbtn')) setTimeout(ssNextLabel); // after the mark itself is saved
    });
    ssCount();
  }

  // ----- offline: a service worker keeps a copy of the site (on GitHub Pages; not inside claude.ai). It sits at the
  // site's root, next to the manifest, however deep this page is. -----
  const manifest = $('link[rel="manifest"]');
  if (manifest && 'serviceWorker' in navigator && /\.github\.io$|^localhost$/.test(location.hostname)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(new URL('sw.js', manifest.href).href, { scope: new URL('./', manifest.href).href }).catch(() => { /* ignore */ });
    });
  }

  // first view: from the address (#exams…) or where this browser left off; the tab bar's pill starts under that tab
  // and glides from the next tap on (.live in page.css)
  const fromHash = location.hash.slice(1);
  show(VIEWS.includes(fromHash) ? fromHash : st.tab);
  requestAnimationFrame(() => requestAnimationFrame(() => $('.tabbar').classList.add('live')));
  try {
    const r = JSON.parse(sessionStorage.getItem('study-resume') || 'null');
    sessionStorage.removeItem('study-resume');
    if (r && r.path === PATH && r.at && document.getElementById(r.at)) goTo(current, r.at);
  } catch (e) { /* ignore */ }
})();
