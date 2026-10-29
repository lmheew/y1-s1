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
