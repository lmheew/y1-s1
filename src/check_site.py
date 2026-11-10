"""Browser check of the built site (needs Python Playwright with Chromium; no internet needed).

    python3 src/check_site.py                  # layout, tabs, search, locked panels
    SITE_PASSWORD='...' python3 src/check_site.py   # also unlocks, remembers and locks again
    python3 src/check_site.py --shots DIR      # also saves screenshots to DIR

Serves the repository root on localhost (WebCrypto needs a secure context, and localhost is one) and fails
on console errors, sideways scrolling, or anything below that doesn't behave."""
import functools, http.server, json, os, re, sys, threading
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


class Server(http.server.ThreadingHTTPServer):
    # a browser that leaves a page mid-download is not an error
    def handle_error(self, request, client_address):
        if not isinstance(sys.exc_info()[1], (BrokenPipeError, ConnectionResetError)):
            super().handle_error(request, client_address)


server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f'http://localhost:{server.server_address[1]}'


def overflow(page):
    # cards, questions, formula rows and Summary modules skip drawing while away from the screen and clip what
    # overflows them (content-visibility in page.css): measure with that off, so too-wide content anywhere shows
    return page.evaluate("""() => { const s = document.createElement('style');
      s.textContent = '.prob, .rq, .frow, .smod { content-visibility: visible !important; }';
      document.head.append(s);
      const w = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      s.remove(); return w; }""")


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
        # the Math card opens the exam picker: one card per exam, the ones without notes yet marked coming soon
        page.wait_for_selector('.exams')
        check(f'{label}: exam picker has the Calculus midterm 1 and 2 cards and one coming soon',
              page.locator('a.exam[href="derivatives/"]').count() == 1 and page.locator('a.exam[href="integrals/"]').count() == 1
              and page.locator('.exam.soon .e-soon').count() == 1)
        check(f'{label}: exam picker has no sideways scroll', overflow(page) <= 0, overflow(page))
        check(f'{label}: exam picker links home', page.locator('.foot-links a[href="../"]').count() == 1)
        shot(page, f'{label}-picker')
        page.click('a.exam[href="derivatives/"]')
        page.wait_for_selector('#view-summary')
        page.wait_for_load_state('load')  # the page is large: its script must be running before the tabs are clicked
        for view in ['summary', 'practice', 'formulas', 'quizzes']:
            page.click(f'#tab-{view}')
            check(f'{label}: {view} tab shows', page.locator(f'#view-{view}').is_visible())
            check(f'{label}: {view} has no sideways scroll', overflow(page) <= 0, overflow(page))
            shot(page, f'{label}-{view}')
        # one button style: the main actions share one green, and the two app bar buttons look the same
        looks = page.evaluate("""(() => {
          const bg = (s) => { const e = document.querySelector(s); return e && getComputedStyle(e).backgroundColor; };
          const main = ['#ss-open', '#view-quizzes .t-go', '#view-quizzes .u-go'].map(bg);
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
        check(f'{label}: footer links to all exams and home', page.locator('.foot-links a[href="../"]').count() == 1 and page.locator('.foot-links a[href="../../"]').count() == 1)
        ft = page.locator('.site-foot time').get_attribute('datetime') or ''
        # each exam page counts the What's new entries that link to it
        page_news = lambda pre: [n['date'] for n in json.load(open(os.path.join(ROOT, 'site.json')))['news']
                                 if n.get('subject') in ('math', 'all') and (n.get('link') or '').startswith(pre)]
        check(f'{label}: footer says when the page was last updated', ft == page.locator('.tabbar').get_attribute('data-updated') and ft >= max(page_news('math/derivatives/')), ft)

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
        vw = page.evaluate('document.documentElement.clientWidth')
        # at rest the button is a slim tab: only 22 of its 44 px are on screen, so taps go to the middle of what shows
        on_screen = lambda b: (min(max(b['x'] + b['width'] / 2, 11), vw - 11), b['y'] + b['height'] / 2)
        box = fab.bounding_box()
        check(f'{label}: at rest the calculator is a slim tab on the left edge, its icon whole', -24 <= box['x'] <= -20
              and page.evaluate("(() => { const r = document.querySelector('.calc-fab svg').getBoundingClientRect(); return r.left >= 0 && r.right <= 23; })()"), box)
        fx, fy = on_screen(box)
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
        check(f'{label}: open, it is the round button again, fully on screen', fab.bounding_box()['x'] >= 0)
        for act, v in [('digit', '1'), ('op', '/'), ('digit', '3'), ('op', '*'), ('digit', '3'), ('eq', '')]:
            page.locator(f'.calc-keys [data-act="{act}"]' + (f'[data-v="{v}"]' if v else '')).click()
        check(f'{label}: 1 ÷ 3 × 3 = 1', page.locator('.calc-value').inner_text() == '1', page.locator('.calc-value').inner_text())
        page.evaluate('scrollBy(0, 400)')
        page.wait_for_timeout(400)
        check(f'{label}: an open calculator keeps its button while the page scrolls down', away() and not fab_tucked() and page.locator('.calc-panel').is_visible())
        page.locator('.calc-x[data-act="close"]').click()
        page.wait_for_timeout(400)
        check(f'{label}: closing the calculator brings the floating buttons back', not away() and not fab_tucked())
        page.mouse.move(fx, fy)
        page.mouse.down()
        for i in range(1, 13):
            page.mouse.move(fx + (vw * 0.65 - fx) * i / 12, fy - 120 * i / 12)
            page.wait_for_timeout(20)
        page.wait_for_timeout(150)
        page.mouse.up()
        page.wait_for_timeout(500)
        box = fab.bounding_box()
        # at rest a slim tab: 22 of its 44 px show
        check(f'{label}: dragged past the middle, it sticks to the right side as a slim tab', abs(box['x'] - (vw - 22)) <= 2, box)

        # back-to-top: hidden at the top, shown after scrolling down, a tap goes smoothly back up; the calculator
        # parked in the bottom-right corner stays above it
        page.evaluate('scrollTo(0, 0)')
        page.wait_for_timeout(300)
        check(f'{label}: back-to-top is hidden at the top', not totop_on())
        vh = page.evaluate('innerHeight')
        fx, fy = on_screen(box)
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
        page.mouse.click(*on_screen(c))
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
            check(f'{label}: the past midterms open with the same password', past.locator('.sheet.lock').count() == 0 and past.locator('.sheet.mock').count() == 3)
            p26 = past.locator('#p2026')
            check(f'{label}: past midterm AY2026 has six questions and 100 points', p26.locator('.rq').count() == 6 and '100 pt' in p26.locator('.sheet-sub').inner_text())
            p1 = past.locator('#p2022')
            check(f'{label}: past midterm AY2022 has four questions, a 60-minute countdown and 100 points',
                  p1.locator('.rq').count() == 4 and p1.locator('.time').inner_text() == '60:00' and '100 pt' in p1.locator('.sheet-sub').inner_text())
            check(f'{label}: an opened past midterm has the Print buttons and the new question heads',
                  p1.locator('.print-btn').count() == 2 and p1.locator('.rq-head').count() == 4)
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
            fresh.goto(BASE + '/math/derivatives/#quizzes')
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

        # ---- Calculus midterm 2 (integrals), in a fresh browser: picker → its page, with the lessons taught so far,
        # the rest of the schedule greyed out, and its own store for practice marks ----
        ctx = browser.new_context(viewport=vp)
        ctx.route(re.compile(r'^https?://(?!localhost[:/])'), lambda r: r.fulfill(status=200, body='', content_type='text/css'))
        page = ctx.new_page()
        errors = []
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(BASE + '/math/')
        page.click('a.exam[href="integrals/"]')
        page.wait_for_selector('#view-summary .unit')
        page.wait_for_load_state('load')
        check(f'{label}: Calculus midterm 2 opens on Summary', page.locator('#view-summary').is_visible()
              and page.locator('.brand small').inner_text() == 'Midterm 2 · Integrals')
        tiles = page.locator('#view-summary .tile')
        check(f'{label}: midterm 2 tiles follow the schedule: six lessons, three still to come, then the habits',
              tiles.count() == 7 and page.locator('#view-summary .tile.upcoming').count() == 3
              and page.locator('#view-summary .tile.upcoming .tile-soon').count() == 3 and page.locator('#view-summary .unit').count() == 3,
              tiles.all_inner_texts()[:2])
        check(f'{label}: midterm 2 lessons show their days and dates', '2 & 3 nov' in page.locator('#su-u1 .unit-head .kicker').inner_text().lower()
              and 'day 14 & 15' in page.locator('#su-u1 .unit-head .kicker').inner_text().lower()
              and 'riemann sum' in page.locator('#su-u1 h2').inner_text().lower()
              and 'quiz 06' in page.locator('#su-u2 .unit-head .kicker').inner_text().lower()
              and 'primitive functions' in page.locator('#su-u2 h2').inner_text().lower()
              and 'day 18 & 19' in page.locator('#su-u3 .unit-head .kicker').inner_text().lower()
              and 'quiz 07' in page.locator('#su-u3 .unit-head .kicker').inner_text().lower())
        check(f'{label}: midterm 2 has its Shortcuts boxes after Watch out, marked as not from the lectures',
              page.locator('#su-u2 .tricks li').count() == 3 and page.locator('#su-u3 .tricks li').count() == 6 and page.locator('#su-u1 .tricks').count() == 0
              and 'not from the lectures' in page.locator('#su-u3 .tricks-note').inner_text()
              and page.evaluate("document.querySelector('#su-u3 .watch').compareDocumentPosition(document.querySelector('#su-u3 .tricks')) & 4") > 0)
        check(f'{label}: midterm 2 lessons still to come go by their dates', page.locator('#view-summary .tile.upcoming .tile-k').first.inner_text().lower() == '12 & 13 nov',
              page.locator('#view-summary .tile.upcoming .tile-k').first.inner_text())
        check(f'{label}: midterm 2 Summary has no sideways scroll', overflow(page) <= 0, overflow(page))
        page.locator('#gx-riemann').scroll_into_view_if_needed()
        page.wait_for_selector('#gx-riemann rect.gx-rect')
        g = page.locator('#gx-riemann')
        check(f'{label}: the Riemann graph starts with four right-end rectangles, sum 3.75', g.locator('rect.gx-rect').count() == 4
              and 'S₄ = 3.75' in g.locator('.gx-read').inner_text())
        g.locator('[data-kind="left"]').click()
        check(f'{label}: the Riemann graph switches to left ends (1.75)', 'Left ends' in g.locator('.gx-read').inner_text()
              and '1.75' in g.locator('.gx-read').inner_text() and g.locator('[data-kind="left"]').get_attribute('aria-pressed') == 'true')
        g.locator('input[type=range]').fill('10')
        check(f'{label}: the Riemann graph follows n', g.locator('rect.gx-rect').count() == 10 and 'n = 10' in g.locator('.gx-read').inner_text())
        # the row centres its items, so on one line they share a middle (a wrapped chip would sit a whole line lower)
        mids = g.evaluate("(f) => [...f.querySelectorAll('.gx-ctl.choices > *')].map((e) => { const r = e.getBoundingClientRect(); return (r.top + r.bottom) / 2; })")
        check(f'{label}: the height choices sit on one line', len(mids) == 4 and max(mids) - min(mids) < 4, mids)
        shot(page, f'{label}-integrals-summary')
        page.click('#tab-practice')
        page.wait_for_selector('#view-practice .prob')
        check(f'{label}: midterm 2 Practice has 8 + 11 + 15 problems, the 2 & 3 Nov ones keeping their ids',
              page.locator('#pu1 .prob').count() == 8 and page.locator('#pu2 .prob').count() == 11 and page.locator('#pu3 .prob').count() == 15
              and page.locator('#prob-1-12').count() == 1 and page.locator('#prob-1-4').count() == 0 and page.locator('#prob-2-10').count() == 1
              and page.locator('#prob-3-13').count() == 1)
        card = page.locator('#prob-1-1')
        card.locator('details.sol > summary').click()
        card.locator('.mbtn[data-mark="got"]').click()
        stores = page.evaluate("""(() => { const r = (k) => { try { return JSON.parse(localStorage.getItem(k) || '{}') || {}; } catch (e) { return {}; } };
          return { mine: (r('cla1-integrals-review').marks || {})['1.1'] || '', mt1: (r('cla1-midterm-review').marks || {})['1.1'] || '' }; })()""")
        check(f'{label}: midterm 2 keeps its marks in its own store', stores['mine'] == 'got' and stores['mt1'] == '', stores)
        check(f'{label}: midterm 2 Practice has no sideways scroll', overflow(page) <= 0, overflow(page))
        page.click('#tab-formulas')
        page.wait_for_selector('#view-formulas .frow')
        check(f'{label}: midterm 2 Formulas has the Riemann-sum sheet, the primitive-function, substitution and by-parts sheets and the exact values',
              page.locator('#fg-g1 .frow').count() == 12 and page.locator('#fg-g2 .frow').count() == 11 and page.locator('#fg-g2b .frow').count() == 14
              and page.locator('#fg-g2c .frow').count() == 6 and page.locator('#fg-g3 .frow').count() == 13 and page.locator('#fg-g3b .frow').count() == 5
              and page.locator('#fg-gs .frow').count() == 7
              and page.locator('#fg-exact').count() == 1)
        check(f'{label}: midterm 2 Formulas has no sideways scroll', overflow(page) <= 0, overflow(page))
        page.click('#tab-quizzes')
        page.wait_for_selector('#qg07')
        check(f'{label}: midterm 2 Quizzes has Quizzes 06 and 07: each a locked sheet and two open follow-ups',
              page.locator('#view-quizzes .qgroup').count() == 2 and page.locator('#qg06 .seg-btn').count() == 3 and page.locator('#qg07 .seg-btn').count() == 3
              and page.locator('#rq06.lock form.unlock').count() == 1 and page.locator('#rq06a .rq').count() == 3 and page.locator('#rq06b').count() == 1
              and page.locator('#rq07.lock form.unlock').count() == 1 and page.locator('#rq07a .rq').count() == 2 and page.locator('#rq07b .rq').count() == 2
              and 'day 16 & 17' in page.locator('#qg06 .kicker').inner_text().lower() and 'day 18 & 19' in page.locator('#qg07 .kicker').inner_text().lower())
        check(f'{label}: midterm 2 Quizzes has no sideways scroll', overflow(page) <= 0, overflow(page))
        if PASSWORD:
            form = page.locator('#rq06 form.unlock')
            form.locator('input[name="password"]').fill(PASSWORD)
            form.locator('.u-go').click()
            page.wait_for_selector('body.unlocked', timeout=20000)
            check(f'{label}: the password opens Quizzes 06 and 07 on midterm 2', page.locator('#rq06 .rq').count() == 3 and page.locator('#rq07 .rq').count() == 2
                  and page.locator('.sheet.lock').count() == 0)
            hits = search(page, 'Quiz 07')
            check(f'{label}: midterm 2 search finds Quiz 07 after unlocking', any(t.startswith('Quiz 07 · Q.') for t in hits), hits[:4])
            shot(page, f'{label}-integrals-quiz06')
        page.click('#tab-exams')
        page.wait_for_selector('#view-exams .up-item')
        check(f'{label}: midterm 2 Exams lists the five Math exams, mocks to come', page.locator('#view-exams .up-item').count() == 5
              and page.locator('#mocks .soon-box').count() == 1)
        hits = search(page, 'riemann')
        check(f'{label}: midterm 2 search finds the lesson and its practice', any(t.startswith('Practice · Day 14 & 15') for t in hits)
              and any('Riemann sum and definite integrals' in t for t in hits), hits[:4])
        hits = search(page, 'cover-up')
        check(f'{label}: midterm 2 search finds the shortcuts', any(t.startswith('Shortcut — The cover-up method') for t in hits), hits[:4])
        ft = page.locator('.site-foot time').get_attribute('datetime') or ''
        check(f'{label}: midterm 2 footer says when it was last updated', ft == page.locator('.tabbar').get_attribute('data-updated')
              and ft >= max(page_news('math/integrals/')), ft)
        check(f'{label}: midterm 2 footer links to all exams and home, and its app bar to Physics',
              page.locator('.foot-links a[href="../"]').count() == 1 and page.locator('a.subj-btn[href="../../physics/"]').count() == 1)
        check(f'{label}: midterm 2 has no console errors', not errors, errors[:3])
        ctx.close()

        # ---- Physics, in a fresh browser: home card → exam picker → the midterm page, which opens on Quizzes ----
        ctx = browser.new_context(viewport=vp)
        ctx.route(re.compile(r'^https?://(?!localhost[:/])'), lambda r: r.fulfill(status=200, body='', content_type='text/css'))
        page = ctx.new_page()
        errors = []
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(BASE + '/')
        check(f'{label}: home has the Physics card', page.locator('a.subject[href="physics/"]').count() == 1)
        page.click('a.subject[href="physics/"]')
        page.wait_for_selector('.exams')
        check(f'{label}: Physics picker has the midterm card and the final coming soon',
              page.locator('a.exam[href="midterm/"]').count() == 1 and page.locator('.exam.soon .e-soon').count() == 1)
        check(f'{label}: Physics picker has no sideways scroll', overflow(page) <= 0, overflow(page))
        check(f'{label}: Physics picker switches to Math, and Math to Physics', page.locator('a.subj-btn[href="../math/"]').count() == 1)
        shot(page, f'{label}-physics-picker')
        page.click('a.exam[href="midterm/"]')
        page.wait_for_selector('#view-summary .wex')
        page.wait_for_load_state('load')  # the page is large: count its parts once it has arrived in full
        check(f'{label}: Physics opens on Summary', page.locator('#view-summary').is_visible() and page.locator('#tab-summary').get_attribute('aria-selected') == 'true')
        check(f'{label}: Physics Summary has Chapters 1–8, 36 modules, each with a worked example',
              page.locator('#view-summary section.unit').count() == 8 and page.locator('#view-summary .smod').count() == 36
              and page.locator('#view-summary .smod .wex').count() == 36 and page.locator('#view-summary .tile').count() == 9,
              (page.locator('#view-summary .smod').count(), page.locator('#view-summary .wex').count(), page.locator('#view-summary .tile').count()))
        check(f'{label}: Physics Summary has no sideways scroll', overflow(page) <= 0, overflow(page))
        shot(page, f'{label}-physics-summary')
        wex = page.locator('#su-c2-x26')
        wex.scroll_into_view_if_needed()
        wex.locator('details.sol > summary').click()
        check(f'{label}: a worked example opens step by step', wex.locator('.step-next').count() == 1)
        wex.locator('.step-all').click()
        check(f'{label}: all its steps and figures show', wex.locator('.steps .step-hidden').count() == 0 and wex.locator('svg.pfig').count() == 2)
        check(f'{label}: an open worked example has no sideways scroll', overflow(page) <= 0, overflow(page))
        shot(page, f'{label}-physics-example')
        page.click('#tab-formulas')
        page.wait_for_selector('#view-formulas .frow')
        check(f'{label}: Physics Formulas has the values to know and Chapters 1–8',
              page.locator('#view-formulas .fgroup').count() == 9 and page.locator('#fg-values .exact').count() >= 1
              and page.locator('#view-formulas .frow').count() == 186 and page.locator('#view-formulas .wex').count() == 0,
              (page.locator('#view-formulas .fgroup').count(), page.locator('#view-formulas .frow').count()))
        check(f'{label}: Physics Formulas has no sideways scroll', overflow(page) <= 0, overflow(page))
        page.click('#test-btn')
        hidden = page.evaluate("getComputedStyle(document.querySelector('#fg-c4 .frow .fmath > .katex')).visibility")
        check(f'{label}: Physics Test me hides formulas and their notes', hidden == 'hidden'
              and page.evaluate("getComputedStyle(document.querySelector('#view-formulas .frow .fnote')).visibility") == 'hidden')
        page.locator('#fg-c4 .frow').first.click()
        check(f'{label}: tapping a Physics formula shows it', page.evaluate("getComputedStyle(document.querySelector('#fg-c4 .frow .fmath > .katex')).visibility") == 'visible')
        page.click('#test-btn')
        shot(page, f'{label}-physics-formulas')
        page.click('#tab-quizzes')
        page.wait_for_selector('#view-quizzes .psheet')
        check(f'{label}: Physics quizzes have no sideways scroll', overflow(page) <= 0, overflow(page))
        shot(page, f'{label}-physics-quizzes')
        check(f'{label}: Physics is drawn in its blue', page.evaluate("getComputedStyle(document.querySelector('#view-quizzes .t-go')).backgroundColor") == 'rgb(31, 75, 143)')
        check(f'{label}: three practice sets, each Problem 0 and ten problems',
              page.locator('#sets .psheet').count() == 3 and all(page.locator(f'#{s} .prq').count() == 11 for s in ('pa', 'pb', 'pc')))
        plocks = page.locator('#ex .sheet.lock').count()
        check(f'{label}: both exercise days are locked', plocks == 2 and page.locator('#ex .prq').count() == 0, plocks)
        sets = page.locator('#sets')
        sets.locator('.seg-btn[data-seg="1"]').click()
        check(f'{label}: the switcher opens Practice Set B', page.locator('#pb').is_visible() and not page.locator('#pa').is_visible())
        sets.locator('.seg-btn[data-seg="0"]').click()
        a4 = page.locator('#pa-p4')
        a4.locator('details.sol > summary').click()
        check(f'{label}: an answer opens step by step', a4.locator('.step-next').count() == 1 and a4.locator('.answer li').count() == 5)
        a4.locator('.step-all').click()
        check(f'{label}: a list in a solution is a list, one step per item', a4.locator('.steps > ul > li').count() == 3, a4.locator('.steps > ul > li').count())
        check(f'{label}: figures are drawn', a4.locator('svg.pfig').count() >= 3)
        check(f'{label}: an open answer has no sideways scroll', overflow(page) <= 0, overflow(page))
        shot(page, f'{label}-physics-answer')
        # Practice: each chapter in three tiers, with marks, rings and the filter
        page.click('#tab-practice')
        page.wait_for_selector('#view-practice .prob')
        check(f'{label}: Physics Practice has Chapters 1–8 in three tiers, 103 problems',
              page.locator('#view-practice .punit').count() == 8 and page.locator('#view-practice .prob').count() == 103
              and page.locator('#pc1 .ptier').count() == 3 and page.locator('#view-practice .uring').count() == 8,
              (page.locator('#view-practice .punit').count(), page.locator('#view-practice .prob').count()))
        check(f'{label}: Physics Practice has no sideways scroll', overflow(page) <= 0, overflow(page))
        card = page.locator('#prob-4-11')
        card.scroll_into_view_if_needed()
        card.locator('details.sol > summary').click()
        check(f'{label}: a Physics practice answer opens step by step, with its figure', card.locator('.step-next').count() == 1 and card.locator('svg.pfig').count() == 1)
        card.locator('.step-all').click()
        card.locator('.mbtn[data-mark="got"]').click()
        check(f'{label}: marking a Physics problem counts it', page.locator('#ring-all-text').inner_text() == '1/103'
              and page.locator('.uring[data-unit="pc4"] .uring-count').inner_text() == '1/14', page.locator('#ring-all-text').inner_text())
        shot(page, f'{label}-physics-practice')
        page.locator('.filters .chip[data-filter="unmarked"]').click()
        check(f'{label}: the Not marked filter hides it', not card.is_visible() and page.locator('#view-practice .prob:visible').count() == 102)
        page.locator('.filters .chip[data-filter="all"]').click()
        card.locator('.mbtn[data-mark="got"]').click()
        check(f'{label}: unmarking it counts it out again', page.locator('#ring-all-text').inner_text() == '0/103')
        # Exams: the mock midterms, switched, timed and marked
        page.click('#tab-exams')
        page.wait_for_selector('#view-exams .sheet.mock')
        check(f'{label}: Physics Exams has three mock midterms of six problems, 60 pt each',
              page.locator('#mocks .sheet.mock').count() == 3 and all(page.locator(f'#{m} .rq').count() == 6 for m in ('pm1', 'pm2', 'pm3'))
              and page.locator('#pm1').get_attribute('data-total') == '60' and page.locator('#pm1 .timer').count() == 1)
        page.locator('#mocks .seg-btn[data-seg="1"]').click()
        check(f'{label}: the switcher opens Mock 2', page.locator('#pm2').is_visible() and not page.locator('#pm1').is_visible())
        q = page.locator('#pm2-p3')
        q.scroll_into_view_if_needed()
        q.locator('details.sol > summary').click()
        q.locator('.step-all').click()
        q.locator('.mk').first.click()
        check(f'{label}: ticking a part scores the mock', page.locator('#pm2 .score-val').inner_text() == '3'
              and '3/60' in page.locator('#mocks .seg-btn[data-seg="1"] .seg-score').inner_text())
        check(f'{label}: a mock answer draws its figures', q.locator('svg.pfig').count() == 2)
        check(f'{label}: Physics Exams has no sideways scroll', overflow(page) <= 0, overflow(page))
        shot(page, f'{label}-physics-mock')
        q.locator('.mk').first.click()
        check(f'{label}: no Physics tab has a placeholder left', page.locator('.soon-box').count() == 0)
        check(f'{label}: Physics Exams lists the midterm on 13 Nov', 'Physics midterm' in page.locator('#view-exams .up-list').inner_text()
              and page.locator('#view-exams .up-item[data-date="2026-11-13"]').count() == 1)
        check(f'{label}: Physics search finds the practice sets', any(t.startswith('Practice Set') for t in search(page, 'friction')))
        check(f'{label}: Physics search has nothing from the locked sheets', not search(page, 'Lorentz') and not search(page, 'automobile tire'))
        check(f'{label}: Physics footer links to all exams and home', page.locator('.foot-links a[href="../"]').count() == 1 and page.locator('.foot-links a[href="../../"]').count() == 1)
        check(f'{label}: Physics app bar switches to Math', page.locator('a.subj-btn[href="../../math/"]').count() == 1)
        # the floating calculator takes the Physics blue too, in light and in dark mode
        page.click('#tab-quizzes')
        page.evaluate('scrollTo(0, 0)')
        page.wait_for_timeout(400)
        page.click('.calc-fab')
        page.click('.calc-fab')
        page.wait_for_selector('.calc-panel')
        page.wait_for_timeout(300)
        keys = lambda: page.evaluate("['.calc-key.eq', '.calc-key:not(.num):not(.eq)'].map((s) => getComputedStyle(document.querySelector(s)).backgroundColor)")
        light = keys()
        page.emulate_media(color_scheme='dark')
        page.wait_for_timeout(300)
        dark = keys()
        page.emulate_media(color_scheme='light')
        check(f'{label}: the Physics calculator is blue, in light and dark', light == ['rgb(31, 75, 143)', 'rgb(236, 241, 249)']
              and dark == ['rgb(111, 155, 224)', 'rgb(26, 34, 48)'], (light, dark))
        page.click('.calc-fab')
        page.wait_for_selector('.calc-panel', state='hidden')
        if PASSWORD:
            page.click('#tab-quizzes')
            ex = page.locator('#ex')
            form = ex.locator('form.unlock').first
            form.locator('input[name="password"]').fill('not-the-password')
            form.locator('.u-go').click()
            page.wait_for_function("document.querySelector('#ex .u-msg').textContent.includes('didn')", timeout=20000)
            check(f'{label}: Physics refuses a wrong password', ex.locator('.sheet.lock').count() == 2)
            form.locator('input[name="password"]').fill(PASSWORD)
            if label == 'phone':
                form.locator('input[name="remember"]').check()
            form.locator('.u-go').click()
            page.wait_for_selector('body.unlocked', timeout=20000)
            check(f'{label}: the in-class password opens both exercise days', ex.locator('.sheet.lock').count() == 0
                  and page.locator('#ex1 .prq').count() == 8 and page.locator('#ex2 .prq').count() == 14)
            ex.locator('.seg-btn[data-seg="1"]').click()
            check(f'{label}: the switcher opens Exercise Day 2', page.locator('#ex2').is_visible())
            check(f'{label}: unlocked Physics has no sideways scroll', overflow(page) <= 0, overflow(page))
            shot(page, f'{label}-physics-unlocked')
            check(f'{label}: Physics search finds the exercise days after unlocking', any(t.startswith('Exercise Day') for t in search(page, 'Lorentz')))
            if label == 'phone':
                other = ctx.new_page()
                other.goto(BASE + '/math/derivatives/#quizzes')
                other.wait_for_selector('body.unlocked', timeout=20000)
                check(f'{label}: one remembered password opens Math too', other.locator('.sheet.lock').count() == 0)
                other.click('#lock-again')
                other.wait_for_selector('.sheet.lock')
                other.close()
        check(f'{label}: Physics has no console errors', not errors, errors[:3])
        ctx.close()
    browser.close()
server.shutdown()
print(f'\n{len(fails)} failed' if fails else '\nall browser checks passed')
sys.exit(1 if fails else 0)
