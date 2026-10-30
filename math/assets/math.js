/* Built by src/math/build.mjs from src/math/page.js, src/math/graphs.js, src/shared/totop.js and src/shared/calculator.js. Don't edit it here: change the sources and build again. */
(() => {
  const KEY = 'cla1-midterm-review';
  const VIEWS = ['summary', 'practice', 'formulas', 'quizzes', 'exams'];
  const FILTERS = ['all', 'review', 'unmarked'];
  const THEMES = ['system', 'light', 'dark'];
  const st = { tab: 'summary', marks: {}, filter: 'all', theme: 'system', seg: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') {
      if (VIEWS.includes(saved.tab)) st.tab = saved.tab;
      if (saved.marks && typeof saved.marks === 'object') st.marks = saved.marks;
      if (FILTERS.includes(saved.filter)) st.filter = saved.filter;
      if (THEMES.includes(saved.theme)) st.theme = saved.theme;
      if (saved.seg && typeof saved.seg === 'object') st.seg = saved.seg;
    }
  } catch (e) { /* storage unavailable: start fresh */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
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
  themeBtn.addEventListener('click', () => { st.theme = THEMES[(THEMES.indexOf(st.theme) + 1) % THEMES.length]; save(); applyTheme(); });
  applyTheme();

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
      box.innerHTML = src.textContent;
      src.remove();
    }
    const scope = box || panels[view];
    markNew(scope);
    if (VIEW_INIT[view]) VIEW_INIT[view](scope);
    buildToc(view);
  }

  // ----- side menu on wide screens (page.css shows it from 1100 px): the sections of the open tab, the one being
  // read highlighted. Built from the page itself when the tab is built; narrower screens never show it. -----
  const TOC_SECTIONS = { summary: '.unit, .habits', practice: '.punit', formulas: '.fgroup', quizzes: '.qgroup', exams: '#ex-upcoming, .mockgroup' };
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
    const t = tocOf[st.tab];
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
  function show(view) {
    if (!VIEWS.includes(view)) view = 'summary';
    materialize(view);
    markSeen(view);
    st.tab = view; save();
    tabs.forEach((t) => { const on = t.dataset.view === view; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    VIEWS.forEach((v) => { panels[v].hidden = v !== view; });
    paintToc();
  }
  function setHash(view) { try { if (location.hash !== '#' + view) location.hash = view; } catch (e) { /* ignore */ } }
  tabs.forEach((t) => t.addEventListener('click', () => { show(t.dataset.view); window.scrollTo({ top: 0 }); setHash(t.dataset.view); }));
  $('.tabbar-row').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    next.focus(); next.click();
  });
  $('.brand').addEventListener('click', (e) => { e.preventDefault(); show('summary'); window.scrollTo({ top: 0 }); setHash('summary'); });
  window.addEventListener('hashchange', () => {
    const h = location.hash.slice(1);
    if (VIEWS.includes(h) && h !== st.tab) { show(h); window.scrollTo({ top: 0 }); }
  });

  // Scroll so an element's top meets the anchor line under the bars. Graphs are drawn as they come near, which can
  // move what's below them while the page glides, so once it settles the position is checked and set again (unless
  // the reader has started scrolling themselves).
  function jumpTo(el) {
    let tries = 0, cancelled = false;
    const stop = () => { cancelled = true; };
    ['wheel', 'touchstart', 'keydown'].forEach((t) => window.addEventListener(t, stop, { once: true, passive: true }));
    document.dispatchEvent(new CustomEvent('buildgraphs', { detail: el })); // graphs.js draws the ones above it first
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
  // kept per device in localStorage (study-seen; the home page reads "math" from it for its Math card, and keeps
  // "news" there itself), and the copy taken when the visit started is kept in sessionStorage (study-seen-start).
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
    if (d && !(seen['math:' + view] >= d)) { seen['math:' + view] = d; saveSeen(); }
  }
  function markNew(scope) {
    const panel = scope.closest ? scope.closest('.view') : null;
    const key = 'math:' + (panel ? panel.id.replace(/^view-/, '') : 'summary');
    $$('[data-added]', scope).forEach((el) => {
      if (!unseen(el.dataset.added, key, start)) return;
      el.classList.add('is-new');
      const lead = $('.test-hint', el); // the Test me bar: the label leads its hint
      if (lead) { if (!$('.new-pill', lead)) lead.insertAdjacentHTML('afterbegin', '<span class="new-pill lead">New</span> '); return; }
      const head = $('.prob-head, .unit-head h2, .fgroup > h2, .sheet-title, .gx-title', el);
      if (head && !$('.new-pill', head)) head.insertAdjacentHTML('beforeend', ' <span class="new-pill">New</span>');
    });
  }
  tabs.forEach((t) => t.classList.toggle('has-new', unseen(t.dataset.newest, 'math:' + t.dataset.view, seen)));
  // for the home page's Math card: the newest date on this page when it was last opened
  // (the build also puts the page's latest What's new date on the tab bar, for updates that add no new item)
  const newestHere = [...tabs.map((t) => t.dataset.newest || ''), ($('.tabbar') || {}).dataset ? $('.tabbar').dataset.updated || '' : ''].sort().pop();
  if (newestHere && !(seen.math >= newestHere)) { seen.math = newestHere; saveSeen(); }
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
    if (d && d.matches && d.matches('details.sol') && d.open) stepper(d);
  }, true);

  // ----- search -----
  let index = [];
  try { index = JSON.parse($('#search-index').textContent); } catch (e) { index = []; }
  const sheet = $('#search'), input = $('#search-input'), results = $('#search-results');
  const SUGGEST = ['chain rule', 'vertical tangent', 'Taylor', "Newton's method", 'inflection', 'mock'];
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
    if (!hits.length) { results.append(el('p', 's-empty', 'No matches for "' + input.value.trim() + '". Try a shorter word, like "limit" or "series".')); return; }
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
    const LKEY = 'cla1-unlock-key';
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
  const SKEY = 'cla1-mock-scores';
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

  // ----- offline: a service worker keeps a copy of the site (on GitHub Pages; not inside claude.ai). It sits at the
  // site's root, next to the manifest, however deep this page is. -----
  const manifest = $('link[rel="manifest"]');
  if (manifest && 'serviceWorker' in navigator && /\.github\.io$|^localhost$/.test(location.hostname)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(new URL('sw.js', manifest.href).href, { scope: new URL('./', manifest.href).href }).catch(() => { /* ignore */ });
    });
  }

  // first view: from the address (#exams…) or where this browser left off
  const fromHash = location.hash.slice(1);
  show(VIEWS.includes(fromHash) ? fromHash : st.tab);
})();

// Interactive graphs in the Summary tab: plain SVG, each drawn the first time it scrolls into view.
// secant (u2), implicit (u3), concavity (u4), newton and taylor (u5), family and second (u6).
// The build places <figure data-graph="…">.
(() => {
  const figs = Array.from(document.querySelectorAll('figure.explore[data-graph]'));
  if (!figs.length) return;
  const NS = 'http://www.w3.org/2000/svg';
  const W = 320, H = 210, PAD = 6;
  let clipN = 0;
  const fix = (v, d = 2) => (Math.abs(v) < 5e-13 ? 0 : v).toFixed(d).replace('-', '−');
  const tick = (v) => String(Math.round(v * 10) / 10).replace('-', '−');
  const sub = (k) => String(k).split('').map((c) => '₀₁₂₃₄₅₆₇₈₉'[c]).join('');
  const sup = (k) => String(k).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');

  function plot(stage, box) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'gx-svg');
    svg.setAttribute('aria-hidden', 'true');
    stage.replaceChildren(svg);
    const sx = (x) => PAD + ((x - box.x0) / (box.x1 - box.x0)) * (W - 2 * PAD);
    const sy = (y) => H - PAD - ((y - box.y0) / (box.y1 - box.y0)) * (H - 2 * PAD);
    const ux = (px) => box.x0 + ((px - PAD) / (W - 2 * PAD)) * (box.x1 - box.x0);
    const uy = (py) => box.y0 + ((H - PAD - py) / (H - 2 * PAD)) * (box.y1 - box.y0);
    const el = (tag, attrs, parent) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      (parent || svg).append(n);
      return n;
    };
    const id = 'gx-clip-' + (++clipN);
    el('rect', { x: PAD, y: PAD, width: W - 2 * PAD, height: H - 2 * PAD }, el('clipPath', { id }, el('defs', {})));
    const base = el('g', { 'clip-path': `url(#${id})` });
    const dyn = el('g', { 'clip-path': `url(#${id})` });
    const top = el('g', {});
    const api = {
      sx, sy, ux, uy, svg,
      grid(stepX, stepY, labels = true) {
        for (let x = Math.ceil(box.x0 / stepX) * stepX; x <= box.x1; x += stepX) {
          el('line', { x1: sx(x), y1: PAD, x2: sx(x), y2: H - PAD, class: Math.abs(x) < 1e-9 ? 'gx-axis' : 'gx-grid' }, base);
          if (labels && Math.abs(x) > 1e-9) el('text', { x: sx(x), y: Math.min(H - PAD - 2, Math.max(PAD + 9, sy(0) + 11)), class: 'gx-tick', 'text-anchor': 'middle' }, base).textContent = tick(x);
        }
        for (let y = Math.ceil(box.y0 / stepY) * stepY; y <= box.y1; y += stepY) {
          el('line', { x1: PAD, y1: sy(y), x2: W - PAD, y2: sy(y), class: Math.abs(y) < 1e-9 ? 'gx-axis' : 'gx-grid' }, base);
          if (labels && Math.abs(y) > 1e-9) el('text', { x: Math.min(W - PAD - 2, Math.max(PAD + 2, sx(0) - 4)), y: sy(y) + 3, class: 'gx-tick', 'text-anchor': 'end' }, base).textContent = tick(y);
        }
      },
      // y = f(x), sampled; breaks the path where f leaves the box far or isn't finite
      curve(f, cls, from = box.x0, to = box.x1, layer = base) {
        let d = '', pen = false;
        const n = 240;
        for (let i = 0; i <= n; i++) {
          const x = from + ((to - from) * i) / n, y = f(x);
          if (!Number.isFinite(y) || y > box.y1 + 50 || y < box.y0 - 50) { pen = false; continue; }
          d += `${pen ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`;
          pen = true;
        }
        return el('path', { d, class: cls }, layer);
      },
      // the same, in the layer that clear() empties (for curves that change)
      liveCurve(f, cls, from, to) { return api.curve(f, cls, from, to, dyn); },
      clear() { dyn.replaceChildren(); top.replaceChildren(); },
      line(x1, y1, x2, y2, cls) { return el('line', { x1: sx(x1), y1: sy(y1), x2: sx(x2), y2: sy(y2), class: cls }, dyn); },
      // the line through (x0, y0) with slope m (vertical when m is not finite)
      through(x0, y0, m, cls) {
        if (!Number.isFinite(m)) return el('line', { x1: sx(x0), y1: PAD, x2: sx(x0), y2: H - PAD, class: cls }, dyn);
        const span = (box.x1 - box.x0) * 3;
        return api.line(x0 - span, y0 - m * span, x0 + span, y0 + m * span, cls);
      },
      dot(x, y, cls = 'gx-dot', r = 4.5) { return el('circle', { cx: sx(x), cy: sy(y), r, class: cls }, top); },
      label(x, y, text, cls = 'gx-label', dx = 6, dy = -6, anchor = 'start') {
        const t = el('text', { x: sx(x) + dx, y: sy(y) + dy, class: cls, 'text-anchor': anchor }, top);
        t.textContent = text;
        return t;
      },
      fixedDot(x, y, cls, r) { return el('circle', { cx: sx(x), cy: sy(y), r: r || 4, class: cls }, base); },
      fixedLabel(x, y, text, dx = 6, dy = -6, anchor = 'start') {
        const t = el('text', { x: sx(x) + dx, y: sy(y) + dy, class: 'gx-label soft', 'text-anchor': anchor }, base);
        t.textContent = text;
        return t;
      },
    };
    return api;
  }
  // box with equal scales on both axes (for the circle), centred on (cx, cy) with half-height h
  function squareBox(cx, cy, h) {
    const w = (h * (W - 2 * PAD)) / (H - 2 * PAD);
    return { x0: cx - w, x1: cx + w, y0: cy - h, y1: cy + h };
  }
  function slider(fig, label, min, max, step, value, onInput) {
    const row = document.createElement('label');
    row.className = 'gx-ctl';
    row.innerHTML = `<span class="gx-ctl-name">${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output></output>`;
    fig.querySelector('.gx-stage').after(row);
    const input = row.querySelector('input'), out = row.querySelector('output');
    const run = () => { out.textContent = onInput(Number(input.value)); };
    input.addEventListener('input', run);
    run();
    return input;
  }
  function readout(fig) {
    const p = document.createElement('p');
    p.className = 'gx-read';
    p.setAttribute('aria-live', 'polite');
    fig.querySelector('.gx-note').before(p);
    return p;
  }

  const WIDGETS = {
    // f(x) = x², secant through x = 1 and x = 1 + h; its slope 2 + h tends to f'(1) = 2
    secant(fig) {
      const g = plot(fig.querySelector('.gx-stage'), { x0: -1.2, x1: 3.4, y0: -1.2, y1: 9.5 });
      g.grid(1, 2);
      g.curve((x) => x * x, 'gx-curve');
      const read = readout(fig);
      slider(fig, 'h', 0.02, 2, 0.01, 1.5, (h) => {
        g.clear();
        const q = 1 + h;
        g.through(1, 1, 2, 'gx-tan');
        g.through(1, 1, 2 + h, 'gx-sec');
        g.dot(1, 1, 'gx-dot solid');
        g.dot(q, q * q);
        g.label(1, 1, 'P', 'gx-label', -14, -6);
        g.label(q, q * q, 'Q', 'gx-label', 7, 4);
        read.innerHTML = `Secant slope <b>${fix(2 + h)}</b> · tangent slope <b>2</b>`;
        return fix(h);
      });
    },
    // the circle x² + y² = 25: tangent at the point, slope −x/y, vertical where y = 0
    implicit(fig) {
      const g = plot(fig.querySelector('.gx-stage'), squareBox(0, 0, 6.6));
      g.grid(2, 2);
      g.curve((x) => Math.sqrt(25 - x * x), 'gx-curve', -5, 5);
      g.curve((x) => -Math.sqrt(25 - x * x), 'gx-curve', -5, 5);
      const read = readout(fig);
      const input = slider(fig, 'angle', 0, 360, 1, 53, (deg) => {
        const t = (deg * Math.PI) / 180;
        let x = 5 * Math.cos(t), y = 5 * Math.sin(t);
        if (Math.abs(x) < 1e-9) x = 0;
        if (Math.abs(y) < 1e-9) y = 0;
        g.clear();
        g.line(0, 0, x, y, 'gx-radius');
        const m = y === 0 ? Infinity : -x / y;
        g.through(x, y, m, 'gx-tan');
        g.dot(0, 0, 'gx-dot small', 2.5);
        g.dot(x, y, 'gx-dot solid');
        read.innerHTML = `Point (${fix(x)}, ${fix(y)}) · ` + (y === 0 ? '<b>vertical tangent</b>: y′ is undefined' : `slope y′ = −x/y = <b>${fix(m)}</b>`);
        return `${deg}°`;
      });
      // drag the point itself
      const svg = g.svg;
      const move = (e) => {
        const r = svg.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) * W, py = ((e.clientY - r.top) / r.height) * H;
        let deg = Math.round((Math.atan2(g.uy(py), g.ux(px)) * 180) / Math.PI);
        if (deg < 0) deg += 360;
        input.value = deg;
        input.dispatchEvent(new Event('input'));
      };
      svg.addEventListener('pointerdown', (e) => { svg.setPointerCapture(e.pointerId); move(e); });
      svg.addEventListener('pointermove', (e) => { if (svg.hasPointerCapture(e.pointerId)) move(e); });
      svg.classList.add('draggable');
    },
    // f(x) = x³ − 3x: increasing/decreasing from f', concave up/down from f''
    concavity(fig) {
      const f = (x) => x ** 3 - 3 * x, fp = (x) => 3 * x * x - 3, fpp = (x) => 6 * x;
      const g = plot(fig.querySelector('.gx-stage'), { x0: -2.7, x1: 2.7, y0: -4.2, y1: 4.2 });
      g.grid(1, 2);
      g.curve(f, 'gx-curve down', -2.7, 0);
      g.curve(f, 'gx-curve up', 0, 2.7);
      g.fixedDot(-1, 2, 'gx-mark');
      g.fixedDot(1, -2, 'gx-mark');
      g.fixedDot(0, 0, 'gx-mark infl');
      g.fixedLabel(-1, 2, 'max', 0, -9, 'middle');
      g.fixedLabel(1, -2, 'min', 0, 17, 'middle');
      g.fixedLabel(0, 0, 'inflection', -7, 14, 'end');
      const read = readout(fig);
      slider(fig, 'x', -2.4, 2.4, 0.01, -1.6, (x) => {
        g.clear();
        g.through(x, f(x), fp(x), 'gx-tan');
        g.dot(x, f(x), 'gx-dot solid');
        const s1 = fp(x), s2 = fpp(x);
        const inc = Math.abs(s1) < 0.005 ? 'f′ = 0: a critical point' : s1 > 0 ? `f′ = ${fix(s1)} > 0: <b>increasing</b>` : `f′ = ${fix(s1)} < 0: <b>decreasing</b>`;
        const cc = Math.abs(s2) < 0.005 ? 'f″ = 0' : s2 > 0 ? `f″ = ${fix(s2)} > 0: <b>concave up</b>` : `f″ = ${fix(s2)} < 0: <b>concave down</b>`;
        read.innerHTML = `${inc} · ${cc}`;
        return fix(x);
      });
    },
    // f(x) = x² − 2 from x₁ = 2: tangent at xₙ meets the axis at xₙ₊₁
    newton(fig) {
      const f = (x) => x * x - 2, fp = (x) => 2 * x;
      const g = plot(fig.querySelector('.gx-stage'), { x0: -0.4, x1: 2.6, y0: -2.6, y1: 4.8 });
      g.grid(0.5, 1);
      g.curve(f, 'gx-curve');
      g.fixedDot(Math.SQRT2, 0, 'gx-mark infl', 3.5);
      g.fixedLabel(Math.SQRT2, 0, '√2', -7, -7, 'end');
      const read = readout(fig);
      const xs = [2];
      for (let i = 0; i < 5; i++) xs.push(xs[i] - f(xs[i]) / fp(xs[i]));
      let n = 0;
      const ctl = document.createElement('div');
      ctl.className = 'gx-ctl buttons';
      ctl.innerHTML = '<button type="button" class="pill gx-next">Next step</button><button type="button" class="linkbtn gx-reset">Start over</button>';
      fig.querySelector('.gx-stage').after(ctl);
      function draw() {
        g.clear();
        for (let i = 0; i <= n && i < xs.length - 1; i++) {
          const a = xs[i];
          const active = i === n;
          g.line(a, 0, a, f(a), active ? 'gx-guide' : 'gx-guide old');
          if (i < n) g.line(a, f(a), xs[i + 1], 0, 'gx-sec old');
          else g.through(a, f(a), fp(a), 'gx-tan');
          g.dot(a, 0, active ? 'gx-dot solid' : 'gx-dot small', active ? 4.5 : 3);
        }
        const list = xs.slice(0, n + 1).map((v, i) => `x${sub(i + 1)} = ${i === 0 ? '2' : v.toFixed(7).replace(/0+$/, '')}`);
        read.innerHTML = list.join(' · ') + (n ? ` <span class="gx-soft">(√2 = 1.4142136)</span>` : '');
        ctl.querySelector('.gx-next').disabled = n >= 4;
      }
      ctl.querySelector('.gx-next').addEventListener('click', () => { if (n < 4) { n++; draw(); } });
      ctl.querySelector('.gx-reset').addEventListener('click', () => { n = 0; draw(); });
      draw();
    },
    // Taylor polynomials of sin x about 0
    taylor(fig) {
      const g = plot(fig.querySelector('.gx-stage'), { x0: -7.2, x1: 7.2, y0: -2.6, y1: 2.6 });
      g.grid(Math.PI, 1, false);
      for (const [x, t] of [[-2 * Math.PI, '−2π'], [-Math.PI, '−π'], [Math.PI, 'π'], [2 * Math.PI, '2π']]) g.fixedLabel(x, -2.6, t, 0, -5, 'middle');
      g.curve(Math.sin, 'gx-curve');
      const read = readout(fig);
      const fact = (k) => (k < 2 ? 1 : k * fact(k - 1));
      const sign = (k) => (((k - 1) / 2) % 2 ? -1 : 1); // sin x = x − x³/3! + x⁵/5! − …
      slider(fig, 'degree', 1, 11, 2, 3, (deg) => {
        g.clear();
        g.liveCurve((x) => { let s = 0; for (let k = 1; k <= deg; k += 2) s += (sign(k) * x ** k) / fact(k); return s; }, 'gx-approx', -7.2, 7.2);
        const terms = [];
        for (let k = 1; k <= deg; k += 2) terms.push(`${terms.length ? (sign(k) < 0 ? ' − ' : ' + ') : ''}${k === 1 ? 'x' : `x${sup(k)}/${k}!`}`);
        read.innerHTML = `P${sub(deg)}(x) = ${terms.join('')}`;
        return String(deg);
      });
    },
    // y′ = λy: the family y = Ce^(λx); the initial condition y(0) = y₀ picks the curve with C = y₀
    family(fig) {
      const g = plot(fig.querySelector('.gx-stage'), { x0: -2.2, x1: 2.2, y0: -4.4, y1: 4.4 });
      g.grid(1, 1);
      const read = readout(fig);
      let lam = 0.8, y0 = 1.5;
      const draw = () => {
        g.clear();
        for (let k = -6; k <= 6; k++) {
          const C = k / 2;
          if (Math.abs(C - y0) > 1e-9) g.liveCurve((x) => C * Math.exp(lam * x), 'gx-family');
        }
        g.liveCurve((x) => y0 * Math.exp(lam * x), 'gx-curve');
        g.dot(0, y0, 'gx-dot solid');
        g.label(0, y0, `(0, ${fix(y0)})`, 'gx-label', 7, y0 >= 0 ? 14 : -7);
        const ex = Math.abs(lam) < 0.005 ? '' : `e<sup>${fix(lam, 1)}x</sup>`;
        const lhs = Math.abs(lam) < 0.005 ? 'y′ = 0' : `y′ = ${fix(lam, 1)}y`;
        read.innerHTML = `${lhs} with y(0) = ${fix(y0)} gives <b>y = ${fix(y0)}${ex}</b>`;
      };
      // each slider is placed right under the graph, so the last one made sits on top
      slider(fig, 'λ', -1.5, 1.5, 0.1, lam, (v) => { lam = v; draw(); return fix(v, 1); });
      slider(fig, 'y(0)', -3, 3, 0.25, y0, (v) => { y0 = v; draw(); return fix(v); });
    },
    // y″ + ay′ + by = 0 from y(0) = 1, y′(0) = 0: the sign of Δ = a² − 4b decides the shape
    second(fig) {
      const g = plot(fig.querySelector('.gx-stage'), { x0: -1.6, x1: 12.5, y0: -1.3, y1: 1.3 });
      g.grid(2, 0.5);
      const read = readout(fig);
      const sg = (v) => (v < 0 ? ' − ' : ' + ') + fix(Math.abs(v));
      const ex = (r) => (Math.abs(r) < 0.005 ? '' : `e<sup>${fix(r)}x</sup>`);
      let a = 0.5, b = 1;
      const draw = () => {
        g.clear();
        let D = a * a - 4 * b;
        if (Math.abs(D) < 1e-9) D = 0;
        let f, env = null, roots, kind, gen;
        if (D > 0) {
          const s = Math.sqrt(D), r1 = (-a + s) / 2, r2 = (-a - s) / 2;
          const c1 = -r2 / (r1 - r2), c2 = r1 / (r1 - r2);
          f = (x) => c1 * Math.exp(r1 * x) + c2 * Math.exp(r2 * x);
          roots = `λ = ${fix(r1)}, ${fix(r2)}`;
          kind = 'Δ &gt; 0: two real roots, no oscillation';
          gen = `y = C₁${ex(r1)} + C₂${ex(r2)}`;
        } else if (D === 0) {
          const r = -a / 2;
          f = (x) => (1 - r * x) * Math.exp(r * x);
          roots = `λ = ${fix(r)} (repeated)`;
          kind = 'Δ = 0: one repeated root';
          gen = `y = (C₁ + C₂x)${ex(r)}`;
        } else {
          const al = -a / 2, be = Math.sqrt(-D) / 2, c2 = -al / be, A = Math.sqrt(1 + c2 * c2);
          f = (x) => Math.exp(al * x) * (Math.cos(be * x) + c2 * Math.sin(be * x));
          if (Math.abs(al) >= 0.005) env = (x) => A * Math.exp(al * x);
          roots = `λ = ${fix(al)} ± ${fix(be)}i`;
          kind = 'Δ &lt; 0: complex roots, it oscillates';
          gen = `y = ${ex(al)}${ex(al) ? '(' : ''}C₁cos ${fix(be)}x + C₂sin ${fix(be)}x${ex(al) ? ')' : ''}`;
        }
        if (env) { g.liveCurve(env, 'gx-env', 0, 12.5); g.liveCurve((x) => -env(x), 'gx-env', 0, 12.5); }
        g.liveCurve(f, 'gx-curve', 0, 12.5);
        g.dot(0, 1, 'gx-dot solid');
        read.innerHTML = `λ²${sg(a)}λ${sg(b)} = 0, Δ = ${fix(D)}<br>${roots}<br><b>${kind}</b><br>${gen}`;
      };
      slider(fig, 'b', 0.25, 4, 0.05, b, (v) => { b = v; draw(); return fix(v); });
      slider(fig, 'a', 0, 4, 0.05, a, (v) => { a = v; draw(); return fix(v); });
    },
  };
  function build(fig) {
    if (fig.dataset.drawn) return;
    fig.dataset.drawn = '1';
    try { WIDGETS[fig.dataset.graph](fig); } catch (e) { fig.querySelector('.gx-stage').textContent = ''; }
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); build(en.target); } });
    }, { rootMargin: '300px 0px' });
    figs.forEach((f) => io.observe(f));
    // before a jump to a section further down (page.js sends "buildgraphs" with it), draw every graph above it, so
    // the page doesn't grow under the glide and the jump lands on the section
    document.addEventListener('buildgraphs', (e) => {
      const target = e.detail;
      if (!target || !target.compareDocumentPosition) return;
      figs.forEach((f) => { if (!f.dataset.drawn && (f.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)) { io.unobserve(f); build(f); } });
    });
  } else {
    window.addEventListener('load', () => figs.forEach(build));
  }
})();

// Back-to-top button for every page: hidden near the top, shown once the page has been scrolled about half a
// screen down (at least 300 px). A tap scrolls smoothly back to the top (at once with reduced motion) and moves
// keyboard focus up there too. The floating calculator keeps the bottom of the right edge clear for it.
//
// This file also sets the scroll direction for both floating buttons (this one and the calculator's): while the
// page scrolls down they tuck into the screen edge, so they don't sit on the text being read, and they come back
// on the way up, near the top and at the end of the page. It puts the class "fab-away" on <html>, and
// totop.css and calculator.css hide the buttons with it.
(() => {
  if (typeof document === 'undefined') return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'totop';
  btn.setAttribute('aria-label', 'Back to top');
  btn.title = 'Back to top';
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5.5M5.5 12L12 5.5l6.5 6.5"/></svg>';
  document.body.append(btn);
  // without its stylesheet (offline before the files were saved, say) it would sit unstyled at the end of the page
  if (getComputedStyle(btn).position !== 'fixed') { btn.remove(); return; }
  const reduced = () => Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const threshold = () => Math.max(300, window.innerHeight * 0.5);

  // scroll direction: the buttons react after 24 px of travel one way, so small nudges don't make them flicker
  const root = document.documentElement;
  const TRAVEL = 24, TOP = 80, END = 8;
  let lastY = Math.max(0, window.scrollY), travel = 0, away = false;
  const setAway = (v) => { if (v !== away) { away = v; root.classList.toggle('fab-away', v); } };
  function direction() {
    const y = Math.max(0, window.scrollY);
    const end = Math.max(0, root.scrollHeight - window.innerHeight);
    const dy = y - lastY;
    lastY = y;
    if (y < TOP || y >= end - END) { travel = 0; setAway(false); return; }
    if (dy > 0) travel = Math.max(0, travel) + dy;
    else if (dy < 0) travel = Math.min(0, travel) + dy;
    if (travel > TRAVEL) setAway(true);
    else if (travel < -TRAVEL) setAway(false);
  }

  // the calculator sends "fabshow" after it has been used, so the buttons stay out until the next scroll down
  document.addEventListener('fabshow', () => { travel = 0; setAway(false); });

  let queued = false;
  const update = () => { queued = false; direction(); btn.classList.toggle('show', window.scrollY > threshold()); };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    const top = document.querySelector('.brand');
    if (top) top.focus({ preventScroll: true });
  });
  update();
})();

// Floating calculator for the subject pages. A small ghost button sticks to a side of the screen: drag it anywhere
// and it snaps back to the nearest side. Tap it once to wake it, tap again to open a standard calculator laid out
// like the one in Windows (memory, no history). The engine comes from the "Tally Calculator" artifact, changed to
// exact fractions so results match Windows (1 ÷ 3 × 3 = 1, 0.1 + 0.2 = 0.3) and formatted by Windows' display rules.
// In Node, the file exports the engine for src/shared/calculator_test.js instead of building any UI.
(() => {
  'use strict';

  // ---------- exact numbers: reduced fractions of BigInts ----------
  const ZERO = { n: 0n, d: 1n };
  const ONE = { n: 1n, d: 1n };
  const HUNDRED = { n: 100n, d: 1n };
  const abs = (v) => (v < 0n ? -v : v);
  const pow10 = (k) => 10n ** BigInt(k);
  const len = (v) => abs(v).toString().length;
  function gcd(a, b) {
    while (b) { const t = a % b; a = b; b = t; }
    return a;
  }
  function frac(n, d = 1n) {
    if (d < 0n) { n = -n; d = -d; }
    if (n === 0n) return ZERO;
    const g = gcd(abs(n), d);
    return g === 1n ? { n, d } : { n: n / g, d: d / g };
  }
  const isZero = (a) => a.n === 0n;
  const neg = (a) => (a.n === 0n ? a : { n: -a.n, d: a.d });
  const add = (a, b) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
  const sub = (a, b) => frac(a.n * b.d - b.n * a.d, a.d * b.d);
  const mul = (a, b) => frac(a.n * b.n, a.d * b.d);
  const div = (a, b) => frac(a.n * b.d, a.d * b.n); // callers rule out b = 0
  // a typed entry such as "12.", "-0.50" or "7"
  function parse(s) {
    const m = /^(-?)(\d*)(?:\.(\d*))?$/.exec(s);
    if (!m) return ZERO;
    const f = m[3] || '';
    return frac(BigInt(m[1] + (m[2] || '0') + f), pow10(f.length));
  }
  // floor(log10 |a|) for a ≠ 0
  function lg(a) {
    const n = abs(a.n);
    let k = len(n) - len(a.d);
    if (k >= 0 ? n < a.d * pow10(k) : n * pow10(-k) < a.d) k--;
    return k;
  }
  // |a| rounded half-up to `count` significant digits: [digits without trailing zeros, floor(log10) after rounding]
  function sig(a, count) {
    let e = lg(a);
    const s = count - 1 - e;
    let num = abs(a.n), den = a.d;
    if (s >= 0) num *= pow10(s); else den *= pow10(-s);
    let m = (2n * num + den) / (2n * den);
    if (m === pow10(count)) { m = pow10(count - 1); e++; }
    return [m.toString().replace(/0+$/, '') || '0', e];
  }
  // keep fractions small: past a 60-digit denominator, round to 40 significant digits (far beyond what is shown)
  const LIMIT = pow10(60);
  function tidy(a) {
    if (a.d <= LIMIT || isZero(a)) return a;
    const [D, e] = sig(a, 40);
    const k = e + 1 - D.length;
    const n = BigInt(D) * (k > 0 ? pow10(k) : 1n);
    return frac(a.n < 0n ? -n : n, k < 0 ? pow10(-k) : 1n);
  }
  function isqrt(v) {
    if (v < 2n) return v;
    let x = 1n << BigInt(Math.ceil(v.toString(2).length / 2));
    for (;;) {
      const y = (x + v / x) >> 1n;
      if (y >= x) return x;
      x = y;
    }
  }
  // exact for perfect squares (√(9/4) = 3/2); otherwise 36 significant digits
  function sqrt(a) {
    if (isZero(a)) return a;
    const nd = a.n * a.d;
    const k = Math.max(0, Math.ceil((72 - len(nd)) / 2));
    return tidy(frac(isqrt(nd * pow10(2 * k)), a.d * pow10(k)));
  }
  // Windows' standard-mode display: 16 significant digits; at most 16 decimals, giving up digits for up to two
  // zeros after the point, then scientific; scientific above 16 integer digits ("1.e+16").
  const PREC = 16;
  function fmt(a) {
    if (isZero(a)) return '0';
    let [D, e] = sig(a, PREC);
    let left = e + 1;
    let sci = left > PREC;
    if (!sci && D.length - left > PREC) {
      if (left >= -2) {
        [D, e] = sig(a, PREC + left);
        left = e + 1;
        sci = left > PREC;
      } else sci = true;
    }
    const minus = a.n < 0n ? '−' : '';
    if (sci) return `${minus}${D[0]}.${D.slice(1)}e${e < 0 ? '−' : '+'}${Math.abs(e)}`;
    let out;
    if (left <= 0) out = '0.' + '0'.repeat(-left) + D;
    else if (D.length <= left) out = D + '0'.repeat(left - D.length);
    else out = D.slice(0, left) + '.' + D.slice(left);
    const dot = out.indexOf('.');
    const int = dot < 0 ? out : out.slice(0, dot);
    return minus + int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dot < 0 ? '' : out.slice(dot));
  }
  // results past 1e9999 overflow, as in Windows; results below 1e-9999 count as zero
  function checked(r) {
    if (isZero(r)) return r;
    const e = lg(r);
    if (e > 9999) throw new Error('Overflow');
    return e < -9999 ? ZERO : tidy(r);
  }
  const store = (a) => `${a.n}/${a.d}`;
  function unstore(s) {
    const m = /^(-?\d+)\/(\d+)$/.exec(String(s));
    return m && m[2] !== '0' && m[1].length < 400 && m[2].length < 400 ? frac(BigInt(m[1]), BigInt(m[2])) : null;
  }
  const Q = { ZERO, ONE, frac, parse, add, sub, mul, div, neg, sqrt, isZero, fmt, store, unstore };

  // ---------- engine (no DOM) ----------
  const SYM = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const MAX_DIGITS = 16;
  const S = {
    raw: '0', val: ZERO, editable: true, entered: true, acc: null, op: null, unary: null,
    justEq: false, exprEq: '', lastOp: null, lastB: null, error: null, errExpr: '', mem: [],
  };
  function reset() {
    Object.assign(S, { raw: '0', val: ZERO, editable: true, entered: true, acc: null, op: null, unary: null,
      justEq: false, exprEq: '', lastOp: null, lastB: null, error: null, errExpr: '' });
  }
  function fmtEntry(s) {
    const negative = s[0] === '-';
    const t = negative ? s.slice(1) : s;
    const d = t.indexOf('.');
    const i = d < 0 ? t : t.slice(0, d);
    return (negative ? '−' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d < 0 ? '' : t.slice(d));
  }
  const cur = () => (S.editable ? parse(S.raw) : S.val);
  const prefix = () => (S.op ? `${fmt(S.acc)} ${SYM[S.op]} ` : '');
  function fail(msg, expr) {
    Object.assign(S, { error: msg, errExpr: expr, op: null, acc: null, unary: null,
      justEq: false, lastOp: null, lastB: null, editable: false });
  }
  function compute(a, op, b) {
    let r;
    if (op === '+') r = add(a, b);
    else if (op === '-') r = sub(a, b);
    else if (op === '*') r = mul(a, b);
    else {
      if (isZero(b)) throw new Error(isZero(a) ? 'Result is undefined' : 'Cannot divide by zero');
      r = div(a, b);
    }
    return checked(r);
  }
  // freeze a typed entry into a value (used before memory keys act on it)
  function settle() {
    const x = cur();
    Object.assign(S, { val: x, editable: false });
    return x;
  }

  const A = {
    digit(d) {
      if (S.error) reset();
      S.justEq = false;
      if (!S.editable) { Object.assign(S, { raw: d, editable: true, entered: true, unary: null }); return; }
      if (S.raw === '0') S.raw = d;
      else if (S.raw === '-0') S.raw = '-' + d;
      // like Windows, a leading "0." doesn't count toward the 16 digits
      else if (S.raw.replace(/^-?0(?=\.)/, '').replace(/\D/g, '').length < MAX_DIGITS) S.raw += d;
    },
    dot() {
      if (S.error) reset();
      S.justEq = false;
      if (!S.editable) { Object.assign(S, { raw: '0.', editable: true, entered: true, unary: null }); return; }
      if (!S.raw.includes('.')) S.raw += '.';
    },
    op(o) {
      if (S.error) return;
      const x = cur();
      if (S.op && S.entered) {
        const expr = `${fmt(S.acc)} ${SYM[S.op]} ${S.unary ?? fmt(x)} ${SYM[o]}`;
        try { S.acc = compute(S.acc, S.op, x); } catch (e) { fail(e.message, expr); return; }
      } else if (!S.op) {
        S.acc = x;
      }
      Object.assign(S, { op: o, val: S.acc, editable: false, entered: false, unary: null, justEq: false });
    },
    eq() {
      if (S.error) { reset(); return; }
      const x = cur();
      let a, o, b, aT, bT;
      if (S.op) {
        a = S.acc; o = S.op; b = x; aT = fmt(a); bT = S.unary ?? fmt(b);
        S.lastOp = o; S.lastB = b;
      } else if (S.lastOp) {
        a = x; o = S.lastOp; b = S.lastB; aT = S.justEq ? fmt(a) : (S.unary ?? fmt(a)); bT = fmt(b);
      } else {
        Object.assign(S, { val: x, exprEq: `${S.unary ?? fmt(x)} =`, justEq: true, editable: false, entered: true, unary: null });
        return;
      }
      const expr = `${aT} ${SYM[o]} ${bT} =`;
      let r;
      try { r = compute(a, o, b); } catch (e) { fail(e.message, expr); return; }
      Object.assign(S, { val: r, op: null, acc: null, unary: null, editable: false, entered: true, justEq: true, exprEq: expr });
    },
    unary(kind) {
      if (S.error) return;
      const x = cur();
      const inner = S.justEq ? fmt(x) : (S.unary ?? fmt(x));
      let r, label;
      if (kind === 'inv') {
        label = `1/(${inner})`;
        if (isZero(x)) { fail('Cannot divide by zero', prefix() + label); return; }
        r = div(ONE, x);
      } else if (kind === 'sqr') {
        label = `sqr(${inner})`;
        r = mul(x, x);
      } else {
        label = `√(${inner})`;
        if (x.n < 0n) { fail('Invalid input', prefix() + label); return; }
        r = sqrt(x);
      }
      try { r = checked(r); } catch (e) { fail(e.message, prefix() + label); return; }
      Object.assign(S, { val: r, unary: label, editable: false, entered: true, justEq: false });
    },
    pct() {
      if (S.error) return;
      const x = cur();
      const r = checked((S.op === '+' || S.op === '-') ? div(mul(S.acc, x), HUNDRED) : div(x, HUNDRED));
      Object.assign(S, { val: r, unary: fmt(r), editable: false, entered: true, justEq: false });
    },
    neg() {
      if (S.error) return;
      if (S.editable) {
        if (S.raw !== '0') S.raw = S.raw[0] === '-' ? S.raw.slice(1) : '-' + S.raw;
        return;
      }
      const x = cur();
      const inner = S.justEq ? fmt(x) : (S.unary ?? fmt(x));
      Object.assign(S, { val: neg(x), unary: `negate(${inner})`, entered: true, justEq: false });
    },
    ce() {
      if (S.error || S.justEq) { reset(); return; }
      Object.assign(S, { raw: '0', editable: true, entered: true, unary: null });
    },
    c() { reset(); },
    back() {
      if (S.error) { reset(); return; }
      if (S.justEq) { S.justEq = false; S.exprEq = ''; return; }
      if (!S.editable) return;
      S.raw = S.raw.slice(0, -1);
      if (S.raw === '' || S.raw === '-') S.raw = '0';
    },
    recall(v) {
      if (!v) return;
      if (S.error) reset();
      if (S.justEq) { S.justEq = false; S.exprEq = ''; }
      Object.assign(S, { val: v, editable: false, entered: true, unary: null });
    },
    ms() { if (S.error) return; S.mem.unshift(settle()); if (S.mem.length > 50) S.mem.length = 50; },
    mr() { if (S.mem.length) A.recall(S.mem[0]); },
    mplus() { if (S.error) return; const x = settle(); if (!S.mem.length) S.mem.unshift(x); else A.memAdjust(0, 1); },
    mminus() { if (S.error) return; const x = settle(); if (!S.mem.length) S.mem.unshift(neg(x)); else A.memAdjust(0, -1); },
    mc() { S.mem = []; },
    memAdjust(i, sign) {
      if (S.error || i >= S.mem.length) return;
      const x = settle();
      try { S.mem[i] = checked(sign > 0 ? add(S.mem[i], x) : sub(S.mem[i], x)); } catch (e) { /* overflow: leave it */ }
    },
  };
  const displayText = () => (S.error ? S.error : (S.editable ? fmtEntry(S.raw) : fmt(S.val)));
  function exprText() {
    if (S.error) return S.errExpr;
    if (S.justEq) return S.exprEq;
    const head = S.op ? `${fmt(S.acc)} ${SYM[S.op]}` : '';
    return head + (S.unary ? (head ? ' ' : '') + S.unary : '');
  }
  const isBlank = () => !S.error && !S.op && !S.justEq && !S.unary && S.editable && S.raw === '0';

  if (typeof document === 'undefined') {
    module.exports = { Q, S, A, reset, displayText, exprText };
    return;
  }

  // ---------- UI: set up once the page has loaded, so it never slows the page's own start ----------
  function initUI() {
    const MEM_KEY = 'study-calc-memory';
    const POS_KEY = 'study-calc-position';
    const SIZE = 44;
    const ARM_MS = 4000;
    const $ = (sel, el = document) => el.querySelector(sel);
    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi));
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const saved = JSON.parse(localStorage.getItem(MEM_KEY) || 'null');
      if (Array.isArray(saved)) S.mem = saved.map(unstore).filter(Boolean).slice(0, 50);
    } catch (e) { /* storage unavailable */ }
    const saveMem = () => { try { localStorage.setItem(MEM_KEY, JSON.stringify(S.mem.map(store))); } catch (e) { /* ignore */ } };

    const svg = (body, cls) => `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${body}</svg>`;
    const ICON_CALC = '<rect x="5" y="2.5" width="14" height="19" rx="2.6"/><rect x="8" y="5.5" width="8" height="3.6" rx=".9"/>'
      + '<g class="dots"><circle cx="9" cy="12.6" r="1"/><circle cx="12" cy="12.6" r="1"/><circle cx="15" cy="12.6" r="1"/>'
      + '<circle cx="9" cy="15.7" r="1"/><circle cx="12" cy="15.7" r="1"/><circle cx="15" cy="15.7" r="1"/>'
      + '<circle cx="9" cy="18.8" r="1"/><circle cx="12" cy="18.8" r="1"/><circle cx="15" cy="18.8" r="1"/></g>';
    const ICON_X = '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>';

    // the ghost button and its hint
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'calc-fab no-anim';
    fab.setAttribute('aria-label', 'Calculator');
    fab.setAttribute('aria-haspopup', 'dialog');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-controls', 'calc-panel');
    fab.title = 'Calculator: tap twice to open, drag to move';
    fab.innerHTML = svg(ICON_CALC, 'i-calc') + svg(ICON_X, 'i-close');
    const tip = document.createElement('div');
    tip.className = 'calc-tip';
    tip.setAttribute('role', 'status');
    const probe = document.createElement('div');
    probe.className = 'calc-probe';
    document.body.append(fab, tip, probe);

    function insets() {
      const cs = getComputedStyle(probe);
      return { t: parseFloat(cs.paddingTop) || 0, r: parseFloat(cs.paddingRight) || 0, b: parseFloat(cs.paddingBottom) || 0, l: parseFloat(cs.paddingLeft) || 0 };
    }
    const vw = () => document.documentElement.clientWidth || window.innerWidth;
    const vh = () => window.innerHeight;
    // where the button may rest: clear of the app bar and the tab bar (bottom on phones, top on wide screens);
    // on the right edge it also stays above the back-to-top button in the bottom-right corner
    function band(side) {
      const ins = insets();
      const wide = window.matchMedia('(min-width: 860px)').matches;
      let top, bottom;
      if (wide) {
        top = 120 + ins.t;
        bottom = vh() - 24 - ins.b - SIZE;
      } else {
        const bar = $('.appbar'), tabs = $('.tabbar');
        top = (bar ? bar.getBoundingClientRect().bottom : ins.t) + 12;
        bottom = (tabs ? tabs.getBoundingClientRect().top : vh() - ins.b) - 14 - SIZE;
      }
      if (side === 'right' && $('.totop')) bottom -= 58;
      return { left: 10 + ins.l, right: vw() - 10 - ins.r - SIZE, top, bottom: Math.max(top, bottom) };
    }

    let pos = { side: 'left', y: 1 }; // y: 0 = top of the band, 1 = bottom (the default: bottom left)
    try {
      const p = JSON.parse(localStorage.getItem(POS_KEY) || 'null');
      if (p && (p.side === 'left' || p.side === 'right') && p.y >= 0 && p.y <= 1) pos = { side: p.side, y: p.y };
    } catch (e) { /* storage unavailable */ }
    const savePos = () => { try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch (e) { /* ignore */ } };

    let x = 0, y = 0, dragging = false;
    function draw() {
      fab.style.transform = `translate3d(${x}px, ${y}px, 0)${dragging ? ' scale(1.08)' : ''}`;
      placeTip();
    }
    function place(animate) {
      const b = band(pos.side);
      x = pos.side === 'left' ? b.left : b.right;
      y = b.top + pos.y * (b.bottom - b.top);
      fab.dataset.side = pos.side; // which edge it tucks into while the page scrolls down (calculator.css)
      fab.classList.toggle('no-anim', !animate || reduced);
      draw();
    }

    // hint next to the button ("Tap again to open")
    let tipTimer = 0;
    function showTip(text, ms) {
      tip.textContent = text;
      tip.classList.add('show');
      placeTip();
      clearTimeout(tipTimer);
      if (ms) tipTimer = setTimeout(hideTip, ms);
    }
    function hideTip() { clearTimeout(tipTimer); tip.classList.remove('show'); }
    function placeTip() {
      if (!tip.classList.contains('show')) return;
      const w = tip.offsetWidth, h = tip.offsetHeight;
      const tx = pos.side === 'left' ? x + SIZE + 10 : x - 10 - w;
      tip.style.transform = `translate3d(${clamp(tx, 8, vw() - 8 - w)}px, ${y + (SIZE - h) / 2}px, 0)`;
    }

    // first tap arms (more opaque), a second tap on the button opens; a tap elsewhere or 4 s of nothing cancels
    let armed = false, armTimer = 0, off = false;
    function arm(kind) {
      armed = true;
      fab.classList.add('armed');
      showTip(kind === 'mouse' ? 'Click again to open' : 'Tap again to open');
      clearTimeout(armTimer);
      armTimer = setTimeout(disarm, ARM_MS);
    }
    function disarm() {
      if (!armed) return;
      armed = false;
      fab.classList.remove('armed');
      clearTimeout(armTimer);
      hideTip();
    }
    function tap(kind) {
      if (off) { showTip('Off while a quiz timer runs', 2200); return; }
      if (isOpen) { closePanel(); return; }
      if (armed) { disarm(); openPanel(); return; }
      arm(kind);
    }

    // drag anywhere; on release it glides to the nearest side (a quick flick throws it across, like chat heads)
    let pid = null, sx = 0, sy = 0, ox = 0, oy = 0, moved = false, trail = [];
    fab.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || pid !== null) return;
      pid = e.pointerId;
      try { fab.setPointerCapture(pid); } catch (err) { /* ignore */ }
      sx = e.clientX; sy = e.clientY; ox = x; oy = y; moved = false;
      trail = [[e.clientX, e.timeStamp]];
    });
    fab.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pid) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved) {
        if (Math.hypot(dx, dy) < (e.pointerType === 'mouse' ? 4 : 8)) return;
        moved = true;
        dragging = true;
        disarm();
        hideTip();
        fab.classList.add('dragging', 'no-anim');
      }
      const ins = insets();
      x = clamp(ox + dx, ins.l, vw() - ins.r - SIZE);
      y = clamp(oy + dy, ins.t, vh() - ins.b - SIZE);
      trail.push([e.clientX, e.timeStamp]);
      if (trail.length > 6) trail.shift();
      draw();
    });
    function release(e, cancelled) {
      if (e.pointerId !== pid) return;
      pid = null;
      if (!moved) { if (!cancelled) tap(e.pointerType); return; }
      dragging = false;
      fab.classList.remove('dragging');
      const [x0, t0] = trail[0], [x1, t1] = trail[trail.length - 1];
      const speed = t1 - t0 > 0 && e.timeStamp - t1 < 80 ? (x1 - x0) / (t1 - t0) : 0;
      pos.side = x + SIZE / 2 + speed * 160 < vw() / 2 ? 'left' : 'right';
      const b = band(pos.side);
      pos.y = b.bottom > b.top ? clamp((y - b.top) / (b.bottom - b.top), 0, 1) : 1;
      savePos();
      place(true);
      showFabs();
    }
    // just used (moved, or the window closed): keep the floating buttons out until the page next scrolls down,
    // rather than tucking this one away at once (totop.js listens)
    const showFabs = () => document.dispatchEvent(new Event('fabshow'));
    fab.addEventListener('pointerup', (e) => release(e, false));
    fab.addEventListener('pointercancel', (e) => release(e, true));
    fab.addEventListener('click', (e) => { if (e.detail === 0) { if (off) tap('key'); else if (isOpen) closePanel(); else openPanel(); } });
    fab.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerdown', (e) => {
      if (armed && !fab.contains(e.target)) disarm();
      active = Boolean(panel && !panel.hidden && panel.contains(e.target)) || (isOpen && fab.contains(e.target));
    }, true);

    // ---------- the calculator window ----------
    const KEY_ROWS = [
      ['pct', '', '%', 'Percent'], ['ce', '', 'CE', 'Clear entry'], ['c', '', 'C', 'Clear'],
      ['back', '', svg('<path d="M8.5 5H20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8.5L3 12z"/><path d="M11.5 9.5l5 5M16.5 9.5l-5 5"/>'), 'Backspace'],
      ['inv', '', '<span><sup>1</sup>&frasl;<i>x</i></span>', 'Reciprocal'], ['sqr', '', '<span><i>x</i><sup>2</sup></span>', 'Square'],
      ['sqrt', '', '<span><sup>2</sup>&radic;<i>x</i></span>', 'Square root'], ['op', '/', '&divide;', 'Divide by'],
      ['digit', '7'], ['digit', '8'], ['digit', '9'], ['op', '*', '&times;', 'Multiply by'],
      ['digit', '4'], ['digit', '5'], ['digit', '6'], ['op', '-', '&minus;', 'Minus'],
      ['digit', '1'], ['digit', '2'], ['digit', '3'], ['op', '+', '+', 'Plus'],
      ['neg', '', '<span><sup>+</sup>&frasl;<sub>&minus;</sub></span>', 'Positive negative'], ['digit', '0'],
      ['dot', '', '.', 'Decimal point'], ['eq', '', '=', 'Equals'],
    ];
    const ERR_OFF = new Set(['pct', 'inv', 'sqr', 'sqrt', 'op', 'neg']);
    function keyHTML([act, v, label, aria]) {
      const num = act === 'digit' || act === 'neg' || act === 'dot';
      const cls = 'calc-key' + (num ? ' num' : '') + (act === 'eq' ? ' eq' : '');
      return `<button type="button" class="${cls}" data-act="${act}"${v ? ` data-v="${v}"` : ''}${ERR_OFF.has(act) ? ' data-err-off' : ''}`
        + `${aria ? ` aria-label="${aria}"` : ''}>${label || v}</button>`;
    }
    const PANEL_HTML = `
      <div class="calc-head">
        <span class="calc-title">${svg(ICON_CALC)}Calculator</span>
        <button type="button" class="calc-x" data-act="close" aria-label="Close calculator">${svg(ICON_X)}</button>
      </div>
      <div class="calc-screen" aria-live="polite" aria-atomic="true">
        <div class="calc-expr"><span>&nbsp;</span></div>
        <div class="calc-value">0</div>
      </div>
      <div class="calc-body">
        <div class="calc-mem" role="group" aria-label="Memory">
          <button type="button" data-act="mc" data-needs-mem aria-label="Clear all memory">MC</button>
          <button type="button" data-act="mr" data-needs-mem aria-label="Memory recall">MR</button>
          <button type="button" data-act="mplus" data-err-off aria-label="Memory add">M+</button>
          <button type="button" data-act="mminus" data-err-off aria-label="Memory subtract">M&minus;</button>
          <button type="button" data-act="ms" data-err-off aria-label="Memory store">MS</button>
          <button type="button" data-act="mlist" data-needs-mem aria-label="Show memory" aria-expanded="false">M${svg('<path d="M7 10l5 5 5-5"/>')}</button>
        </div>
        <div class="calc-keys">${KEY_ROWS.map(keyHTML).join('')}</div>
        <section class="calc-drawer" aria-label="Memory">
          <p class="calc-drawer-title">Memory</p>
          <div class="calc-list-wrap"><ul class="calc-list"></ul><p class="calc-empty" hidden>There's nothing saved in memory.</p></div>
          <div class="calc-drawer-foot"><button type="button" class="calc-x" data-act="clear-mem" aria-label="Clear all memory" title="Clear all memory">${svg('<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>')}</button></div>
        </section>
      </div>`;

    let panel = null, valueEl, exprEl, drawer, listEl, emptyEl, mlistBtn;
    let isOpen = false, active = false, drawerOpen = false, panelAt = null;
    function el(tag, cls, text) {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined) n.textContent = text;
      return n;
    }
    function fit() {
      if (!valueEl) return;
      valueEl.style.fontSize = '';
      let size = parseFloat(getComputedStyle(valueEl).fontSize);
      while (valueEl.scrollWidth > valueEl.clientWidth && size > 14) {
        size -= 2;
        valueEl.style.fontSize = size + 'px';
      }
    }
    function renderDrawer() {
      listEl.hidden = !S.mem.length;
      emptyEl.hidden = S.mem.length > 0;
      $('[data-act="clear-mem"]', panel).hidden = !S.mem.length;
      if (!drawerOpen) return;
      listEl.replaceChildren(...S.mem.map((m, i) => {
        const li = el('li', 'calc-m-item');
        const v = el('button', 'calc-m-val', fmt(m));
        v.type = 'button';
        v.dataset.act = 'm-recall';
        v.dataset.i = i;
        v.setAttribute('aria-label', 'Recall ' + fmt(m));
        const acts = el('div', 'calc-m-acts');
        [['m-clear', 'MC', 'Clear this memory'], ['m-add', 'M+', 'Add to this memory'], ['m-sub', 'M−', 'Subtract from this memory']].forEach(([act, label, aria]) => {
          const b = el('button', 'calc-m-act', label);
          b.type = 'button';
          b.dataset.act = act;
          b.dataset.i = i;
          b.setAttribute('aria-label', aria);
          if (act !== 'm-clear' && S.error) b.disabled = true;
          acts.append(b);
        });
        li.append(v, acts);
        return li;
      }));
    }
    function setDrawer(open) {
      drawerOpen = open;
      drawer.classList.toggle('open', open);
      mlistBtn.setAttribute('aria-expanded', String(open));
      renderDrawer();
    }
    function render() {
      panel.classList.toggle('is-error', Boolean(S.error));
      valueEl.textContent = displayText();
      exprEl.textContent = exprText() || ' ';
      panel.querySelectorAll('[data-err-off]').forEach((b) => { b.disabled = Boolean(S.error); });
      const noMem = !S.mem.length || Boolean(S.error);
      panel.querySelectorAll('[data-needs-mem]').forEach((b) => { b.disabled = noMem; });
      fit();
      renderDrawer();
      saveMem();
    }

    function build() {
      panel = document.createElement('div');
      panel.className = 'calc-panel';
      panel.id = 'calc-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Calculator');
      panel.tabIndex = -1;
      panel.hidden = true;
      panel.innerHTML = PANEL_HTML;
      document.body.append(panel);
      valueEl = $('.calc-value', panel);
      exprEl = $('.calc-expr span', panel);
      drawer = $('.calc-drawer', panel);
      listEl = $('.calc-list', panel);
      emptyEl = $('.calc-empty', panel);
      mlistBtn = $('[data-act="mlist"]', panel);

      // mouse clicks don't leave focus on a key, so Enter keeps meaning "equals"
      panel.addEventListener('mousedown', (e) => { if (e.target.closest('.calc-key, .calc-mem button')) e.preventDefault(); });
      panel.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b || b.disabled) return;
        const act = b.dataset.act, v = b.dataset.v, i = Number(b.dataset.i);
        switch (act) {
          case 'close': closePanel(); return;
          case 'digit': A.digit(v); break;
          case 'dot': A.dot(); break;
          case 'op': A.op(v); break;
          case 'eq': A.eq(); break;
          case 'pct': A.pct(); break;
          case 'ce': A.ce(); break;
          case 'c': A.c(); break;
          case 'back': A.back(); break;
          case 'inv': case 'sqr': case 'sqrt': A.unary(act); break;
          case 'neg': A.neg(); break;
          case 'mc': A.mc(); break;
          case 'mr': A.mr(); break;
          case 'mplus': A.mplus(); break;
          case 'mminus': A.mminus(); break;
          case 'ms': A.ms(); break;
          case 'mlist': setDrawer(!drawerOpen); break;
          case 'clear-mem': S.mem = []; break;
          case 'm-recall': A.recall(S.mem[i]); setDrawer(false); break;
          case 'm-clear': S.mem.splice(i, 1); break;
          case 'm-add': A.memAdjust(i, 1); break;
          case 'm-sub': A.memAdjust(i, -1); break;
          default: return;
        }
        render();
      });
      $('.calc-screen', panel).addEventListener('click', () => { if (drawerOpen) setDrawer(false); });

      // move the window by its title bar
      const head = $('.calc-head', panel);
      let hp = null, hx = 0, hy = 0, px0 = 0, py0 = 0;
      head.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || e.target.closest('button')) return;
        hp = e.pointerId;
        try { head.setPointerCapture(hp); } catch (err) { /* ignore */ }
        hx = e.clientX; hy = e.clientY;
        const r = panel.getBoundingClientRect();
        px0 = r.left; py0 = r.top;
        head.classList.add('grabbing');
      });
      head.addEventListener('pointermove', (e) => {
        if (e.pointerId !== hp) return;
        panelAt = { x: px0 + e.clientX - hx, y: py0 + e.clientY - hy };
        positionPanel();
      });
      const drop = (e) => { if (e.pointerId === hp) { hp = null; head.classList.remove('grabbing'); } };
      head.addEventListener('pointerup', drop);
      head.addEventListener('pointercancel', drop);
    }

    function positionPanel() {
      const ins = insets();
      const w = panel.offsetWidth, h = panel.offsetHeight;
      const fitX = (v) => clamp(v, 8 + ins.l, vw() - 8 - ins.r - w);
      const fitY = (v) => clamp(v, 8 + ins.t, vh() - 8 - ins.b - h);
      let px, py;
      if (panelAt) {
        px = fitX(panelAt.x); py = fitY(panelAt.y);
        panelAt = { x: px, y: py };
      } else {
        // above the button when it sits low (below it when high), on its side; if that would cover the button
        // (a short screen, such as a phone on its side), open beside it instead, so the button stays tappable
        const left = pos.side === 'left', below = y + SIZE / 2 < vh() / 2;
        const options = [
          [left ? x : x + SIZE - w, below ? y + SIZE + 10 : y - 10 - h, `${left ? 'left' : 'right'} ${below ? 'top' : 'bottom'}`],
          [left ? x + SIZE + 10 : x - 10 - w, y + SIZE / 2 - h / 2, `${left ? 'left' : 'right'} center`],
        ].map(([ox, oy, origin]) => [fitX(ox), fitY(oy), origin]);
        const clear = ([ax, ay]) => ax >= x + SIZE + 4 || ax + w <= x - 4 || ay >= y + SIZE + 4 || ay + h <= y - 4;
        const [ax, ay, origin] = options.find(clear) || options[0];
        px = ax; py = ay;
        panel.style.transformOrigin = origin;
      }
      panel.style.left = px + 'px';
      panel.style.top = py + 'px';
    }
    function openPanel() {
      if (off) return;
      if (!panel) build();
      disarm();
      panel.hidden = false;
      isOpen = true;
      active = true;
      fab.classList.add('open');
      fab.setAttribute('aria-expanded', 'true');
      render();
      positionPanel();
      if (!reduced) { panel.classList.remove('pop'); void panel.offsetWidth; panel.classList.add('pop'); }
      panel.focus({ preventScroll: true });
    }
    function closePanel() {
      if (!panel || !isOpen) return;
      const hadFocus = panel.contains(document.activeElement);
      setDrawer(false);
      panel.hidden = true;
      isOpen = false;
      active = false;
      fab.classList.remove('open');
      fab.setAttribute('aria-expanded', 'false');
      if (hadFocus) fab.focus({ preventScroll: true });
      showFabs();
    }

    // keyboard, while the calculator is open and was the last thing used
    const KEYS = {
      '.': '[data-act="dot"]', ',': '[data-act="dot"]',
      '+': '[data-act="op"][data-v="+"]', '-': '[data-act="op"][data-v="-"]',
      '*': '[data-act="op"][data-v="*"]', '/': '[data-act="op"][data-v="/"]',
      Enter: '[data-act="eq"]', '=': '[data-act="eq"]',
      Backspace: '[data-act="back"]', Delete: '[data-act="ce"]',
      '%': '[data-act="pct"]', r: '[data-act="inv"]', R: '[data-act="inv"]',
      '@': '[data-act="sqrt"]', q: '[data-act="sqr"]', Q: '[data-act="sqr"]', F9: '[data-act="neg"]',
    };
    window.addEventListener('keydown', (e) => {
      if (!isOpen || !active || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
      const search = document.getElementById('search');
      if (search && !search.hidden) return;
      const k = e.key;
      if (k === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (drawerOpen) setDrawer(false);
        else if (isBlank()) closePanel();
        else { A.c(); render(); }
        return;
      }
      if ((k === 'Enter' || k === ' ') && t && t.tagName === 'BUTTON') return;
      const sel = /^[0-9]$/.test(k) ? `[data-act="digit"][data-v="${k}"]` : KEYS[k];
      if (!sel) return;
      e.preventDefault();
      e.stopPropagation(); // "/" divides here instead of opening the page search
      const btn = $('.calc-keys ' + sel, panel);
      if (!btn || btn.disabled) return;
      btn.click();
      btn.classList.add('pressed');
      clearTimeout(btn._t);
      btn._t = setTimeout(() => btn.classList.remove('pressed'), 110);
    }, true);

    // calculator-free like the real quizzes: off while any quiz timer runs (page.js sends "quiztimer")
    function syncTimers() {
      off = Boolean(document.querySelector('.timer.running'));
      fab.classList.toggle('off', off);
      fab.setAttribute('aria-disabled', String(off));
      if (off) { disarm(); closePanel(); }
    }
    document.addEventListener('quiztimer', syncTimers);

    window.addEventListener('resize', () => {
      place(false);
      if (isOpen) { positionPanel(); fit(); }
    });
    place(false);
    fab.getBoundingClientRect(); // settle it at its spot now, or turning the glide on next frame flies it in from the corner
    requestAnimationFrame(() => fab.classList.remove('no-anim'));
    syncTimers();
  }
  const whenIdle = (fn) => (window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 1000 }) : setTimeout(fn, 200));
  if (document.readyState === 'complete') whenIdle(initUI);
  else window.addEventListener('load', () => whenIdle(initUI), { once: true });
})();

