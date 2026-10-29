"""Browser check of the built site (needs Python Playwright with Chromium; no internet needed).

    python3 src/check_site.py                  # layout, tabs, search, locked panels
    SITE_PASSWORD='...' python3 src/check_site.py   # also unlocks, remembers and locks again
    python3 src/check_site.py --shots DIR      # also saves screenshots to DIR

Serves the repository root on localhost (WebCrypto needs a secure context, and localhost is one) and fails
on console errors, sideways scrolling, or anything below that doesn't behave."""
import functools, http.server, os, re, sys, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASSWORD = os.environ.get('SITE_PASSWORD', '')
SHOTS = sys.argv[sys.argv.index('--shots') + 1] if '--shots' in sys.argv else ''
fails = []


def check(name, ok, detail=''):
    print(('PASS  ' if ok else 'FAIL  ') + name + (f'  ({detail})' if detail and not ok else ''))
    if not ok:
        fails.append(name)


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f'http://localhost:{server.server_address[1]}'


def overflow(page):
    return page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')


def shot(page, name):
    if SHOTS:
        os.makedirs(SHOTS, exist_ok=True)
        page.screenshot(path=os.path.join(SHOTS, name + '.png'), full_page=False)


def search(page, q):
    page.click('#search-btn')
    page.fill('#search-input', q)
    titles = page.locator('#search-results .s-t').all_inner_texts()
    page.click('#search-close')
    return titles


with sync_playwright() as p:
    browser = p.chromium.launch()
    for label, vp in [('phone', {'width': 390, 'height': 844}), ('desktop', {'width': 1280, 'height': 900})]:
        ctx = browser.new_context(viewport=vp)
        # outside requests (web fonts) get an empty answer, so a sandbox without internet doesn't log errors
        ctx.route(re.compile(r'^https?://(?!localhost[:/])'), lambda r: r.fulfill(status=200, body='', content_type='text/css'))
        # notes what animates on the calculator button just after it is added (it should appear in place, not glide in)
        ctx.add_init_script("""document.addEventListener('DOMContentLoaded', () => { window.__fabAnim = null;
          new MutationObserver((ms, mo) => { const f = document.querySelector('.calc-fab'); if (!f) return; mo.disconnect();
            setTimeout(() => { window.__fabAnim = f.getAnimations().map((a) => a.transitionProperty || a.animationName || ''); }, 120); })
          .observe(document.body, { childList: true }); });""")
        page = ctx.new_page()
        errors = []
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(str(e)))

        page.goto(BASE + '/')
        check(f'{label}: home has the Math card', page.locator('a.subject[href="math/"]').count() == 1)
        check(f'{label}: home has no sideways scroll', overflow(page) <= 0, overflow(page))
        shot(page, f'{label}-home')
        totop_on = lambda: page.evaluate("Boolean(document.querySelector('.totop.show'))")
        page.wait_for_selector('.totop', state='attached')
        check(f'{label}: home: back-to-top is hidden at the top', not totop_on())
        page.evaluate('scrollTo(0, document.documentElement.scrollHeight)')
        page.wait_for_timeout(300)
        far = page.evaluate('scrollY > Math.max(300, innerHeight * 0.5)')
        check(f'{label}: home: back-to-top ' + ('shows once scrolled down' if far else 'stays hidden on a short page'), totop_on() == far)
        page.evaluate('scrollTo(0, 0)')
        page.click('a.subject[href="math/"]')
        page.wait_for_selector('#view-summary')
        for view in ['summary', 'practice', 'formulas', 'quizzes']:
            page.click(f'#tab-{view}')
            check(f'{label}: {view} tab shows', page.locator(f'#view-{view}').is_visible())
            check(f'{label}: {view} has no sideways scroll', overflow(page) <= 0, overflow(page))
            shot(page, f'{label}-{view}')
        # one button style: the main actions share one green, and the two app bar buttons look the same
        looks = page.evaluate("""(() => {
          const bg = (s) => { const e = document.querySelector(s); return e && getComputedStyle(e).backgroundColor; };
          const main = ['#random-btn', '#view-quizzes .t-go', '#view-quizzes .u-go'].map(bg);
          const bar = ['#theme-btn', '#search-btn'].map((s) => { const c = getComputedStyle(document.querySelector(s)); return [c.backgroundColor, c.borderTopWidth, c.width].join(' '); });
          return { main, bar };
        })()""")
        check(f'{label}: the main buttons share one green, and the app bar buttons match',
              all(c and c == looks['main'][0] for c in looks['main']) and looks['bar'][0] == looks['bar'][1], looks)
        locks = page.locator('.sheet.lock').count()
        check(f'{label}: in-class sheets are locked ({locks})', locks >= 1)
        in_class = [t for t in search(page, 'quiz') if t.startswith('Quiz ') and 'Follow-up' not in t]
        check(f'{label}: public search has no in-class questions', not in_class, in_class[:3])
        check(f'{label}: public search finds follow-ups', any('Follow-up' in t for t in search(page, 'follow-up')))
        page.click('#tab-quizzes')
        first = page.locator('.qgroup').first
        first.locator('.seg-btn[data-seg="1"]').click()
        check(f'{label}: switcher opens Follow-up A', first.locator('.sheet[data-seg="1"]').is_visible())
        first.locator('.seg-btn[data-seg="0"]').click()
        check(f'{label}: footer links home', page.locator('.foot-links a[href="../"]').count() == 1)

        # floating calculator: first tap wakes it, a tap elsewhere cancels, two taps open it, a drag snaps to a side
        page.click('#tab-summary')
        page.wait_for_selector('.calc-fab')
        page.wait_for_function('Array.isArray(window.__fabAnim)', timeout=8000)
        check(f'{label}: calculator button appears in place, without gliding in from a corner', not any('transform' in a for a in page.evaluate('window.__fabAnim')), page.evaluate('window.__fabAnim'))
        page.wait_for_timeout(400)
        fab = page.locator('.calc-fab')
        is_armed = lambda: page.evaluate("document.querySelector('.calc-fab').classList.contains('armed')")
        # the floating buttons tuck into the screen edge while the page scrolls down (class fab-away on <html>)
        away = lambda: page.evaluate("document.documentElement.classList.contains('fab-away')")
        fab_tucked = lambda: page.evaluate("""(() => { const f = document.querySelector('.calc-fab'), r = f.getBoundingClientRect();
          return getComputedStyle(f).opacity === '0' && (r.right <= 0 || r.left >= document.documentElement.clientWidth); })()""")
        totop_tucked = lambda: page.evaluate("getComputedStyle(document.querySelector('.totop')).visibility === 'hidden'")
        box = fab.bounding_box()
        fx, fy = box['x'] + box['width'] / 2, box['y'] + box['height'] / 2
        page.mouse.click(fx, fy)
        check(f'{label}: calculator button wakes on the first tap', is_armed() and page.locator('.calc-tip.show').count() == 1)
        # a tap on plain text (the band's description): a tile there would scroll the page down, which tucks the
        # button away before the next taps
        lede = page.locator('#view-summary .band-lede').bounding_box()
        page.mouse.click(lede['x'] + 20, lede['y'] + lede['height'] / 2)
        check(f'{label}: a tap elsewhere cancels it', not is_armed() and page.locator('.calc-panel').count() == 0)
        page.mouse.click(fx, fy)
        page.mouse.click(fx, fy)
        page.wait_for_timeout(300)
        check(f'{label}: two taps open the calculator', page.locator('.calc-panel').is_visible())
        for act, v in [('digit', '1'), ('op', '/'), ('digit', '3'), ('op', '*'), ('digit', '3'), ('eq', '')]:
            page.locator(f'.calc-keys [data-act="{act}"]' + (f'[data-v="{v}"]' if v else '')).click()
        check(f'{label}: 1 ÷ 3 × 3 = 1', page.locator('.calc-value').inner_text() == '1', page.locator('.calc-value').inner_text())
        page.evaluate('scrollBy(0, 400)')
        page.wait_for_timeout(400)
        check(f'{label}: an open calculator keeps its button while the page scrolls down', away() and not fab_tucked() and page.locator('.calc-panel').is_visible())
        page.locator('.calc-x[data-act="close"]').click()
        page.wait_for_timeout(400)
        check(f'{label}: closing the calculator brings the floating buttons back', not away() and not fab_tucked())
        vw = page.evaluate('document.documentElement.clientWidth')
        page.mouse.move(fx, fy)
        page.mouse.down()
        for i in range(1, 13):
            page.mouse.move(fx + (vw * 0.65 - fx) * i / 12, fy - 120 * i / 12)
            page.wait_for_timeout(20)
        page.wait_for_timeout(150)
        page.mouse.up()
        page.wait_for_timeout(500)
        box = fab.bounding_box()
        check(f'{label}: dragged past the middle, it sticks to the right side', abs(box['x'] + box['width'] - (vw - 10)) <= 2, box)

        # back-to-top: hidden at the top, shown after scrolling down, a tap goes smoothly back up; the calculator
        # parked in the bottom-right corner stays above it
        page.evaluate('scrollTo(0, 0)')
        page.wait_for_timeout(300)
        check(f'{label}: back-to-top is hidden at the top', not totop_on())
        vh = page.evaluate('innerHeight')
        fx, fy = box['x'] + box['width'] / 2, box['y'] + box['height'] / 2
        page.mouse.move(fx, fy)
        page.mouse.down()
        for i in range(1, 13):
            page.mouse.move(fx + (vw - 20 - fx) * i / 12, fy + (vh - 10 - fy) * i / 12)
            page.wait_for_timeout(20)
        page.wait_for_timeout(150)
        page.mouse.up()
        page.wait_for_timeout(500)
        page.evaluate('scrollTo(0, 2000)')
        page.wait_for_timeout(400)
        check(f'{label}: back-to-top shows after scrolling down', totop_on())
        # while the page scrolls down, both floating buttons tuck into the edge, off the text; scrolling up brings
        # them back, and so does the end of the page; a woken calculator stays put
        check(f'{label}: scrolling down tucks both floating buttons away', away() and fab_tucked() and totop_tucked())
        page.evaluate('scrollBy(0, -60)')
        page.wait_for_timeout(400)
        check(f'{label}: scrolling up brings them back', not away() and not fab_tucked() and not totop_tucked() and totop_on())
        t, c = page.locator('.totop').bounding_box(), fab.bounding_box()
        check(f'{label}: calculator parked bottom right sits above back-to-top', c['y'] + c['height'] <= t['y'] and abs(t['width'] - 44) < 1, (c, t))
        page.mouse.click(c['x'] + c['width'] / 2, c['y'] + c['height'] / 2)
        page.evaluate('scrollBy(0, 400)')
        page.wait_for_timeout(400)
        check(f'{label}: a woken calculator stays while the page scrolls down', away() and is_armed() and not fab_tucked() and totop_tucked())
        page.evaluate("document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))")
        page.wait_for_timeout(400)
        check(f'{label}: once it goes back to sleep, it tucks away too', not is_armed() and fab_tucked())
        page.evaluate('scrollTo(0, document.documentElement.scrollHeight)')
        page.wait_for_timeout(400)
        check(f'{label}: at the end of the page both buttons are back', not away() and not fab_tucked() and not totop_tucked())
        start = page.evaluate('scrollY')  # graphs drawn on the way can move it a little (scroll anchoring)
        page.locator('.totop').click()
        between = page.evaluate("""(start) => new Promise((done) => {
          let n = 0, frames = 0;
          const tick = () => { frames++; if (scrollY > 0 && scrollY < start) n++; if (scrollY === 0 || frames > 600) done(n); else requestAnimationFrame(tick); };
          requestAnimationFrame(tick);
        })""", start)
        page.wait_for_timeout(300)
        check(f'{label}: back-to-top scrolls smoothly to the top, then hides', between >= 3 and page.evaluate('scrollY') == 0 and not totop_on(), (start, between))
        page.evaluate("localStorage.removeItem('study-calc-position'); localStorage.removeItem('study-calc-memory')")
        page.click('#tab-quizzes')

        if PASSWORD:
            form = first.locator('form.unlock')
            form.locator('input[name="password"]').fill('not-the-password')
            form.locator('.u-go').click()
            page.wait_for_function("document.querySelector('.qgroup .u-msg').textContent.includes('didn')", timeout=20000)
            check(f'{label}: wrong password is refused', page.locator('.sheet.lock').count() == locks)
            shot(page, f'{label}-wrong-password')
            form.locator('input[name="password"]').fill(PASSWORD.upper() if label == 'desktop' else PASSWORD)
            if label == 'phone':
                form.locator('input[name="remember"]').check()
            form.locator('.u-go').click()
            page.wait_for_selector('body.unlocked', timeout=20000)
            check(f'{label}: right password opens every in-class sheet', page.locator('.sheet.lock').count() == 0)
            check(f'{label}: in-class sheet shows questions', first.locator('.sheet[data-seg="0"] .rq').count() >= 1)
            check(f'{label}: unlocked page has no sideways scroll', overflow(page) <= 0, overflow(page))
            shot(page, f'{label}-unlocked')
            timer = first.locator('.sheet[data-seg="0"] [data-timer]')
            timer.locator('.t-go').click()
            page.wait_for_timeout(1300)
            check(f'{label}: timer runs on an unlocked sheet', timer.locator('.time').inner_text() != '00:00')
            hits = search(page, 'Quiz 01')
            check(f'{label}: search finds in-class questions after unlocking', any(t.startswith('Quiz 01 · Q.') for t in hits), hits[:4])
            # the same password opens the past midterms in the Exams tab, and they work like the mocks
            page.click('#tab-exams')
            page.wait_for_selector('#past')
            past = page.locator('#past')
            check(f'{label}: the past midterms open with the same password', past.locator('.sheet.lock').count() == 0 and past.locator('.sheet.mock').count() == 2)
            p1 = past.locator('#p2022')
            check(f'{label}: past midterm AY2022 has four questions, a 60-minute countdown and 100 points',
                  p1.locator('.rq').count() == 4 and p1.locator('.time').inner_text() == '60:00' and '100 pt' in p1.locator('.sheet-sub').inner_text())
            q1 = p1.locator('.rq').first
            q1.locator('details.sol > summary').click()
            q1.locator('.mk').first.click()
            check(f'{label}: ticking a part scores the past midterm', p1.locator('.score-val').inner_text() == '4' and '4/100' in past.locator('.seg-btn[data-seg="0"]').inner_text())
            p1.locator('.mk-clear').click()
            past.locator('.seg-btn[data-seg="1"]').click()
            check(f'{label}: the switcher opens AY2023', past.locator('#p2023').is_visible() and past.locator('#p2023 .rq').count() == 4)
            check(f'{label}: past midterms have no sideways scroll', overflow(page) <= 0, overflow(page))
            shot(page, f'{label}-past-midterm')
            hits = search(page, 'past midterm')
            check(f'{label}: search finds past midterm questions after unlocking', any(t.startswith('Midterm AY20') for t in hits), hits[:4])
            page.reload()
            page.wait_for_selector('body.unlocked', timeout=20000)
            check(f'{label}: stays open after a reload', page.locator('.sheet.lock').count() == 0)
            fresh = ctx.new_page()
            fresh.goto(BASE + '/math/#quizzes')
            if label == 'phone':
                fresh.wait_for_selector('body.unlocked', timeout=20000)
                check(f'{label}: "Remember on this device" opens it in a new tab', fresh.locator('.sheet.lock').count() == 0)
                fresh.click('#lock-again')
                fresh.wait_for_selector('.sheet.lock')
                check(f'{label}: "Lock again" locks it', fresh.locator('.sheet.lock').count() == locks and not fresh.evaluate("localStorage.getItem('cla1-unlock-key')"))
            else:
                fresh.wait_for_timeout(1500)
                check(f'{label}: without "Remember", a new tab stays locked', fresh.locator('.sheet.lock').count() == locks)
            fresh.close()
        check(f'{label}: no console errors', not errors, errors[:3])
        ctx.close()
    browser.close()
server.shutdown()
print(f'\n{len(fails)} failed' if fails else '\nall browser checks passed')
sys.exit(1 if fails else 0)
