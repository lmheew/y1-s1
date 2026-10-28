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

  // ----- theme: system follows the device (or the host's choice); light/dark override it -----
  const hostTheme = root.getAttribute('data-theme');
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
  }
  function show(view) {
    if (!VIEWS.includes(view)) view = 'summary';
    materialize(view);
    st.tab = view; save();
    tabs.forEach((t) => { const on = t.dataset.view === view; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    VIEWS.forEach((v) => { panels[v].hidden = v !== view; });
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
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
      setTimeout(() => el.classList.remove('flash'), 1900);
    });
    setHash(view);
  }
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-goto]');
    if (g) goTo(g.dataset.goto, g.dataset.target);
  });

  // ----- "New" labels: anything added in the last 14 days; tabs carry the newest date of what they hold -----
  const fresh = (date) => {
    if (!date) return false;
    const t = new Date(date + 'T00:00:00+09:00').getTime();
    return Date.now() - t < 14 * DAY && Date.now() >= t - DAY;
  };
  function markNew(scope) {
    $$('[data-added]', scope).forEach((el) => {
      if (!fresh(el.dataset.added)) return;
      el.classList.add('is-new');
      const lead = $('.test-hint', el); // the Test me bar: the label leads its hint
      if (lead) { if (!$('.new-pill', lead)) lead.insertAdjacentHTML('afterbegin', '<span class="new-pill lead">New</span> '); return; }
      const head = $('.prob-head, .unit-head h2, .fgroup > h2, .sheet-title, .gx-title', el);
      if (head && !$('.new-pill', head)) head.insertAdjacentHTML('beforeend', ' <span class="new-pill">New</span>');
    });
  }
  tabs.forEach((t) => t.classList.toggle('has-new', fresh(t.dataset.newest)));
  markNew(panels.summary);
  built.summary = true;

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

  // ----- in-class sheets: on the public site they arrive encrypted (locked.json) and open with the password -----
  // Key: PBKDF2-SHA256 over the normalized password; content: AES-GCM over gzip'd JSON. Must match build.mjs.
  // A key remembered on this device opens them at load; they're put in place once the Quizzes tab is built.
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
    let unlocked = false, opened = null, placed = false;
    // swap the password panels for the sheets (needs the Quizzes tab built)
    function place() {
      if (!opened || placed || !built.quizzes) return;
      placed = true;
      Object.keys(opened.sheets).forEach((id) => {
        const old = document.getElementById(id);
        if (!old) return;
        const t = document.createElement('template');
        t.innerHTML = opened.sheets[id];
        const fresh = t.content.firstElementChild;
        fresh.hidden = old.hidden;
        old.replaceWith(fresh);
        bindTimers(fresh);
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
  VIEW_INIT.exams = (scope) => {
    bindSegs(scope);
    bindTimers(scope);
    countdown();
    setInterval(countdown, 60000);
    $$('.sheet.mock', scope).forEach((sh) => {
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
    });
  };

  // ----- offline: a service worker keeps a copy of the site (on GitHub Pages; not inside claude.ai) -----
  if ('serviceWorker' in navigator && /\.github\.io$|^localhost$/.test(location.hostname)) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => { /* ignore */ }); });
  }

  // first view: from the address (#exams…) or where this browser left off
  const fromHash = location.hash.slice(1);
  show(VIEWS.includes(fromHash) ? fromHash : st.tab);
})();
