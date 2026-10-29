// Back-to-top button for every page: hidden near the top, shown once the page has been scrolled about half a
// screen down (at least 300 px). A tap scrolls smoothly back to the top (at once with reduced motion) and moves
// keyboard focus up there too. The floating calculator keeps the bottom of the right edge clear for it.
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
  let queued = false;
  const update = () => { queued = false; btn.classList.toggle('show', window.scrollY > threshold()); };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    const top = document.querySelector('.brand');
    if (top) top.focus({ preventScroll: true });
  });
  update();
})();
