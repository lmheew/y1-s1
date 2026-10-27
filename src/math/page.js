(() => {
  const KEY = 'cla1-midterm-review';
  const VIEWS = ['summary', 'practice', 'formulas', 'quizzes'];
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

  // ----- views -----
  const tabs = $$('.tab');
  const panels = Object.fromEntries(VIEWS.map((v) => [v, document.getElementById('view-' + v)]));
  function show(view) {
    if (!VIEWS.includes(view)) view = 'summary';
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
  const fromHash = location.hash.slice(1);
  show(VIEWS.includes(fromHash) ? fromHash : st.tab);

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

  // ----- marks, progress rings, filter -----
  const probs = $$('.prob');
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
  probs.forEach(paint);
  counts();
  applyFilter();

  document.addEventListener('click', (e) => {
    const b = e.target.closest('.mbtn');
    if (!b) return;
    const card = b.closest('.prob');
    const id = card.dataset.id;
    if (st.marks[id] === b.dataset.mark) delete st.marks[id];
    else st.marks[id] = b.dataset.mark;
    save(); paint(card); counts();
  });
  $$('.filters .chip').forEach((c) => c.addEventListener('click', () => { st.filter = c.dataset.filter; save(); applyFilter(); }));

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

  // ----- quiz sheet switcher: In-class / Follow-up A / Follow-up B -----
  function selectSeg(group, idx) {
    idx = String(idx);
    $$('.seg-btn', group).forEach((b) => { const on = b.dataset.seg === idx; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    $$('.sheet', group).forEach((s) => { s.hidden = s.dataset.seg !== idx; });
    st.seg[group.id] = idx; save();
  }
  $$('.qgroup').forEach((g) => {
    const saved = st.seg[g.id];
    if (saved && $('.seg-btn[data-seg="' + saved + '"]', g)) selectSeg(g, saved);
    $$('.seg-btn', g).forEach((b) => b.addEventListener('click', () => selectSeg(g, b.dataset.seg)));
  });

  // ----- quiz timers (bindTimers also runs on in-class sheets once they are unlocked) -----
  const fmt = (ms) => { const s = Math.floor(ms / 1000); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  function bindTimers(scope) {
    $$('[data-timer]', scope).forEach((t) => {
      if (t.dataset.bound) return;
      t.dataset.bound = '1';
      let start = 0, acc = 0, iv = null;
      const out = $('.time', t), go = $('.t-go', t), label = $('.t-go span', t), rst = $('.t-reset', t);
      const tick = () => { out.textContent = fmt(acc + Date.now() - start); };
      go.addEventListener('click', () => {
        if (iv) { acc += Date.now() - start; clearInterval(iv); iv = null; label.textContent = 'Resume'; }
        else { start = Date.now(); iv = setInterval(tick, 250); tick(); label.textContent = 'Pause'; }
        rst.hidden = false;
        t.classList.toggle('running', Boolean(iv));
      });
      rst.addEventListener('click', () => {
        clearInterval(iv); iv = null; acc = 0;
        out.textContent = '00:00'; label.textContent = 'Start timer'; rst.hidden = true; t.classList.remove('running');
      });
    });
  }
  bindTimers(document);

  // ----- search -----
  let index = [];
  try { index = JSON.parse($('#search-index').textContent); } catch (e) { index = []; }
  const sheet = $('#search'), input = $('#search-input'), results = $('#search-results');
  const SUGGEST = ['chain rule', 'vertical tangent', 'Taylor', "Newton's method", 'inflection', 'arcsin'];
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
      results.append(el('p', 's-hint', 'Search every note, practice problem, formula and quiz. Try one of these:'));
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
  const lockForms = $$('form.unlock');
  const mainEl = $('main');
  const lockSrc = mainEl ? mainEl.dataset.locked : '';
  if (lockForms.length && lockSrc) {
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
    let unlocked = false;
    function apply(data) {
      if (unlocked) return;
      unlocked = true;
      Object.keys(data.sheets).forEach((id) => {
        const old = document.getElementById(id);
        if (!old) return;
        const t = document.createElement('template');
        t.innerHTML = data.sheets[id];
        const fresh = t.content.firstElementChild;
        fresh.hidden = old.hidden;
        old.replaceWith(fresh);
        bindTimers(fresh);
      });
      index.push(...data.index);
      document.body.classList.add('unlocked');
      const row = $('#lockrow');
      if (row) row.hidden = false;
    }

    lockForms.forEach((form) => {
      const input = $('input[name="password"]', form), go = $('.u-go', form), show = $('.u-show', form);
      show.addEventListener('click', () => {
        const reveal = input.type === 'password';
        input.type = reveal ? 'text' : 'password';
        show.textContent = reveal ? 'Hide' : 'Show';
        show.setAttribute('aria-pressed', String(reveal));
        input.focus();
      });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (go.disabled || unlocked) return;
        if (!normalize(input.value)) { say(form, 'Enter the password first.', true); input.focus(); return; }
        if (!supported) { say(form, "This browser can't open the locked sheets. Try a recent Chrome, Safari or Firefox.", true); return; }
        const sheetId = form.closest('.sheet').id;
        go.disabled = true; go.textContent = 'Unlocking…'; say(form, '');
        let data = null, key = null;
        try {
          const b = await getBox();
          key = await keyFromPassword(input.value, b);
          try { data = await openWith(key, b); } catch (err) { say(form, "That password didn't work. Check it and try again.", true); }
        } catch (err) {
          say(form, "Couldn't load the locked sheets. Check your connection and try again.", true);
        }
        go.disabled = false; go.textContent = 'Unlock';
        if (!data) { input.focus(); input.select(); return; }
        try { keepKey(tob64(await crypto.subtle.exportKey('raw', key)), $('input[name="remember"]', form).checked); } catch (err) { /* stays open until reload */ }
        apply(data);
        const title = $('#' + sheetId + ' .sheet-title');
        if (title) { title.tabIndex = -1; title.focus({ preventScroll: true }); }
      });
    });

    // reopen with a key saved by "Remember on this device" (or earlier in this tab)
    const raw = supported ? storedKey() : null;
    if (raw) {
      lockForms.forEach((f) => say(f, 'Opening…'));
      getBox()
        .then((b) => crypto.subtle.importKey('raw', unb64(raw), { name: 'AES-GCM' }, true, ['decrypt'])
          .then((k) => openWith(k, b))
          .then(apply, () => forgetKey()))
        .catch(() => { /* offline: keep the key, show the form */ })
        .then(() => { if (!unlocked) lockForms.forEach((f) => say(f, '')); });
    }
    const again = $('#lock-again');
    if (again) again.addEventListener('click', () => { forgetKey(); location.reload(); });
  }
})();
