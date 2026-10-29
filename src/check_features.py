"""Browser check of the study features (needs Python Playwright with Chromium; no internet needed).

    python3 src/check_features.py            # Exams tab, countdowns, mock timer and scoring, step-by-step solutions,
    python3 src/check_features.py --shots DIR    Formulas Test me, graphs, New labels, deferred tabs, home page, offline

Countdowns are tested on a temporary copy of the site with exam dates filled in. Some checks expect the current
content (three mocks, seven graphs, five exams and six news entries in site.json); update them when that changes."""
import datetime, functools, http.server, json, os, re, shutil, subprocess, sys, tempfile, threading
from playwright.sync_api import sync_playwright

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRATCH = tempfile.mkdtemp(prefix='check-features-')
SHOTS = sys.argv[sys.argv.index('--shots') + 1] if '--shots' in sys.argv else os.path.join(SCRATCH, 'shots')
os.makedirs(SHOTS, exist_ok=True)
fails = []


def check(name, ok, detail=''):
    print(('PASS  ' if ok else 'FAIL  ') + name + (f'  ({detail})' if detail != '' and not ok else ''))
    if not ok:
        fails.append(name)


# a copy of the site with exam dates filled in, to see the countdowns (today in Japan time)
SITE = os.path.join(SCRATCH, 'site-with-dates')
shutil.rmtree(SITE, ignore_errors=True)
shutil.copytree(REPO, SITE, ignore=shutil.ignore_patterns('.git', 'private'))
today = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=9)).date()
data = json.load(open(os.path.join(SITE, 'site.json')))
data['exams'][0].update(date=str(today + datetime.timedelta(days=3)), time='10:40')
data['exams'][1].update(date=str(today + datetime.timedelta(days=1)))
data['exams'][2].update(date=str(today - datetime.timedelta(days=2)))
json.dump(data, open(os.path.join(SITE, 'site.json'), 'w'), indent=2)
subprocess.run(['node', 'src/math/build.mjs', 'site'], cwd=SITE, check=True, capture_output=True)


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def serve(directory):
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=directory))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f'http://localhost:{srv.server_address[1]}'


srv, BASE = serve(REPO)
srv2, BASE2 = serve(SITE)
STUB = re.compile(r'^https?://(?!localhost[:/])')
overflow = lambda pg: pg.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')

with sync_playwright() as p:
    b = p.chromium.launch()
    for label, opts in [('phone', dict(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True, device_scale_factor=2)),
                        ('desktop', dict(viewport={'width': 1280, 'height': 900}))]:
        ctx = b.new_context(**opts)
        ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
        pg = ctx.new_page()
        errors = []
        pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        pg.on('pageerror', lambda e: errors.append(str(e)))
        shot = lambda name, full=False: pg.screenshot(path=f'{SHOTS}/{label}-{name}.png', full_page=full)

        # ---- home page ----
        pg.goto(BASE + '/')
        pg.wait_for_selector('#news li')
        check(f'{label}: home lists 5 upcoming exams, dates to be announced', pg.locator('#up-list .up-item').count() == 5 and 'Date to be announced' in pg.locator('#up-list').inner_text())
        check(f'{label}: home shows What\'s new with New labels', pg.locator('#news li').count() == 6 and pg.locator('#news .new-pill').count() == 6)
        check(f'{label}: Math card has a New label', pg.locator('#card-math .new-pill').count() == 1)
        check(f'{label}: home offline card is there', pg.locator('#offline').is_visible())
        check(f'{label}: home has no sideways scroll', overflow(pg) <= 0)
        shot('home', True)

        # ---- math page: deferred tabs ----
        pg.goto(BASE + '/math/')
        pg.wait_for_selector('.calc-fab')
        check(f'{label}: heavy tabs wait as text until opened', pg.locator('#lazy-exams').count() == 1 and pg.locator('#view-exams .sheet').count() == 0)
        check(f'{label}: Exams tab shows a New dot', pg.evaluate("document.getElementById('tab-exams').classList.contains('has-new')"))
        check(f'{label}: Summary graphs carry New labels', pg.locator('#view-summary .gx-title .new-pill').count() == 7)

        # ---- graphs ----
        for kind in ['secant', 'implicit', 'concavity', 'newton', 'taylor', 'family', 'second']:
            fig = pg.locator(f'#gx-{kind}')
            fig.scroll_into_view_if_needed()
            pg.wait_for_timeout(250)
            check(f'{label}: graph "{kind}" is drawn when scrolled to', fig.locator('svg.gx-svg path').count() >= 1)
        fig = pg.locator('#gx-secant')
        fig.scroll_into_view_if_needed()
        fig.locator('input[type=range]').fill('0.02')
        check(f'{label}: secant slope approaches 2 as h → 0', '2.02' in fig.locator('.gx-read').inner_text(), fig.locator('.gx-read').inner_text())
        if label == 'phone':
            shot('graph-secant')
        fig = pg.locator('#gx-implicit')
        fig.scroll_into_view_if_needed()
        fig.locator('input[type=range]').fill('0')
        check(f'{label}: circle tangent turns vertical at y = 0', 'vertical' in fig.locator('.gx-read').inner_text())
        fig.locator('input[type=range]').fill('53')
        fig = pg.locator('#gx-concavity')
        fig.scroll_into_view_if_needed()
        fig.locator('input[type=range]').fill('1.5')
        rd = fig.locator('.gx-read').inner_text()
        check(f'{label}: concavity readout at x = 1.5 (increasing, concave up)', 'increasing' in rd and 'concave up' in rd, rd)
        if label == 'phone':
            shot('graph-concavity')
        fig = pg.locator('#gx-newton')
        fig.scroll_into_view_if_needed()
        for _ in range(3):
            fig.locator('.gx-next').click()
        rd = fig.locator('.gx-read').inner_text()
        check(f'{label}: Newton steps 2 → 1.5 → 1.4166667 → 1.4142157', all(v in rd for v in ['1.5', '1.4166667', '1.4142157']), rd)
        if label == 'phone':
            shot('graph-newton')
        fig = pg.locator('#gx-taylor')
        fig.scroll_into_view_if_needed()
        fig.locator('input[type=range]').fill('7')
        rd = fig.locator('.gx-read').inner_text()
        check(f'{label}: Taylor P₇ readout', rd.startswith('P₇(x) = x − x³/3! + x⁵/5! − x⁷/7!'), rd)
        if label == 'phone':
            shot('graph-taylor')
        # Day 12 (not on the midterm): its unit is marked, and its two graphs respond
        check(f'{label}: Day 12 unit says it is not on the midterm', 'not on the midterm' in pg.locator('#su-u6 .unit-head .kicker').inner_text().lower() and pg.locator('#su-u6 .unit-note').count() == 1)
        fig = pg.locator('#gx-family')
        fig.scroll_into_view_if_needed()
        fig.locator('input[type=range]').nth(0).fill('2')
        fig.locator('input[type=range]').nth(1).fill('-1')
        rd = fig.locator('.gx-read').inner_text()
        check(f'{label}: family readout picks C = y(0)', 'y(0) = 2.00' in rd and 'y = 2.00e' in rd and '−1.0x' in rd, rd)
        if label == 'phone':
            shot('graph-family')
        fig = pg.locator('#gx-second')
        fig.scroll_into_view_if_needed()
        a_in, b_in = fig.locator('input[type=range]').nth(0), fig.locator('input[type=range]').nth(1)
        b_in.fill('1')
        for a_val, want in (('2', 'one repeated root'), ('3', 'two real roots'), ('0.5', 'complex roots'), ('0', 'cos 1.00x')):
            a_in.fill(a_val)
            rd = fig.locator('.gx-read').inner_text()
            check(f'{label}: second-order graph with a = {a_val}, b = 1 shows "{want}"', want in rd, rd)
        a_in.fill('0.5')
        if label == 'phone':
            shot('graph-second')

        # ---- steps ----
        pg.click('#tab-practice')
        card = pg.locator('#prob-4-1')
        card.locator('details.sol > summary').click()
        pg.wait_for_timeout(150)
        vis = lambda: card.locator('.steps > *:not(.step-hidden), .steps li:not(.step-hidden)').count()
        steps_total = card.locator('.steps > p, .steps li').count()
        check(f'{label}: solution starts with one step and a Next step button', card.locator('.stepbar').count() == 1 and card.locator('.steps .step-hidden').count() == steps_total - 1, (steps_total, card.locator('.steps .step-hidden').count()))
        check(f'{label}: the answer itself shows right away', card.locator('.answer').is_visible())
        card.locator('.step-next').click()
        check(f'{label}: Next step reveals one more', card.locator('.steps .step-hidden').count() == steps_total - 2)
        if label == 'phone':
            card.scroll_into_view_if_needed()
            shot('steps')
        card.locator('.step-all').click()
        check(f'{label}: Show all steps reveals the rest and hides the bar', card.locator('.steps .step-hidden').count() == 0 and card.locator('.stepbar').count() == 0)

        # ---- Formulas: Test me ----
        pg.click('#tab-formulas')
        pg.click('#test-btn')
        row = pg.locator('.frow').first
        hidden = pg.evaluate("getComputedStyle(document.querySelector('.frow .fmath > .katex')).visibility")
        check(f'{label}: Test me hides the formulas', hidden == 'hidden' and pg.evaluate("document.getElementById('view-formulas').classList.contains('testing')"))
        if label == 'phone':
            shot('test-me')
        row.click()
        check(f'{label}: tapping a formula shows it', pg.evaluate("getComputedStyle(document.querySelector('.frow .fmath > .katex')).visibility") == 'visible')
        cell = pg.locator('.exact:visible td:not(.na)').nth(3)
        cell.click()
        check(f'{label}: exact-value cells hide and reveal too', 'shown' in cell.get_attribute('class') and pg.locator('.exact:visible td:not(.na):not(.shown)').count() > 10)
        pg.click('#test-reset')
        check(f'{label}: Hide all again covers everything again', pg.locator('#view-formulas .shown').count() == 0)
        pg.click('#test-btn')
        check(f'{label}: Show everything leaves Test me', not pg.evaluate("document.getElementById('view-formulas').classList.contains('testing')"))

        # ---- Exams tab ----
        pg.click('#tab-exams')
        check(f'{label}: Exams builds on first open', pg.locator('#lazy-exams').count() == 0 and pg.locator('#view-exams .sheet.mock').count() == 3)
        check(f'{label}: upcoming list has the five exams', pg.locator('#view-exams .up-item').count() == 5)
        check(f'{label}: mock 1 has six questions and 60 points', pg.locator('#m1 .rq').count() == 6 and '60 pt' in pg.locator('#m1 .sheet-sub').inner_text())
        check(f'{label}: mock sheets show New labels', pg.locator('#m1 .sheet-title .new-pill').count() == 1)
        check(f'{label}: mock timer starts at 60:00', pg.locator('#m1 .time').inner_text() == '60:00')
        pg.locator('#m1 .t-go').click()
        pg.wait_for_timeout(1300)
        t1 = pg.locator('#m1 .time').inner_text()
        check(f'{label}: the mock timer counts down', t1 in ('59:59', '59:58'), t1)
        off = pg.evaluate("document.querySelector('.calc-fab').classList.contains('off')")
        check(f'{label}: calculator is off during the mock exam', off)
        pg.locator('#m1 .t-reset').click()
        check(f'{label}: reset puts it back to 60:00', pg.locator('#m1 .time').inner_text() == '60:00')
        q = pg.locator('#m1-q1')
        q.locator('details.sol > summary').click()
        q.locator('.mk[data-k="1.1"]').click()
        q.locator('.mk[data-k="1.4"]').click()
        check(f'{label}: ticking parts adds their points (2 + 4)', pg.locator('#m1 .score-val').inner_text() == '6')
        check(f'{label}: the Mock 1 button shows the score', '6/60' in pg.locator('.seg-btn[aria-controls="m1"]').inner_text())
        if label == 'phone':
            q.scroll_into_view_if_needed()
            shot('mock-marking')
        pg.locator('.seg-btn[aria-controls="m3"]').click()
        check(f'{label}: switching to Mock 3', pg.locator('#m3').is_visible() and not pg.locator('#m1').is_visible())
        check(f'{label}: Exams tab has no sideways scroll', overflow(pg) <= 0)
        pg.reload()
        pg.wait_for_selector('.calc-fab')
        pg.click('#tab-exams')
        pg.locator('.seg-btn[aria-controls="m1"]').click()
        check(f'{label}: scores are kept after a reload', pg.locator('#m1 .score-val').inner_text() == '6')
        pg.locator('#m1 .mk-clear').click()
        check(f'{label}: Clear ticks resets the score', pg.locator('#m1 .score-val').inner_text() == '0')
        if label == 'phone':
            pg.evaluate('scrollTo(0,0)')
            shot('exams')

        # ---- search into a mock exam ----
        pg.click('#tab-summary')
        pg.click('#search-btn')
        pg.fill('#search-input', 'mock taylor')
        hits = pg.locator('#search-results .s-t').all_inner_texts()
        check(f'{label}: search finds mock exam questions', any(h.startswith('Mock Midterm') for h in hits), hits[:3])
        pg.locator('#search-results .s-hit', has_text='Mock Midterm 2').first.click()
        pg.wait_for_timeout(700)
        check(f'{label}: a search hit opens the right mock', pg.locator('#m2').is_visible() and pg.locator('#view-exams').is_visible())

        # ---- every tab, no sideways scroll, no console errors ----
        for v in ['summary', 'practice', 'formulas', 'quizzes', 'exams']:
            pg.click(f'#tab-{v}')
            check(f'{label}: {v}: no sideways scroll', overflow(pg) <= 0, overflow(pg))
        check(f'{label}: no console errors', not errors, errors[:3])
        ctx.close()

    # ---- countdowns with real dates (copy of the site) ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.goto(BASE2 + '/')
    pg.wait_for_selector('#up-list a.up-item')
    texts = pg.locator('#up-list .up-item').all_inner_texts()
    check('countdown: sorted soonest first: Tomorrow, then in 3 days', 'Tomorrow' in texts[0] and 'in 3 days' in texts[1], texts)
    check('countdown: time shown with the date', '10:40' in texts[1], texts[1])
    check('countdown: past exam says Done', any('Done' in t for t in texts))
    check('countdown: an exam within a week is highlighted', pg.locator('#up-list .up-item.soon').count() == 2)
    pg.screenshot(path=f'{SHOTS}/home-countdowns.png', full_page=True)
    pg.goto(BASE2 + '/math/#exams')
    pg.wait_for_selector('#view-exams .up-item')
    pg.wait_for_timeout(200)
    lefts = pg.locator('#view-exams .up-left').all_inner_texts()
    check('countdown: Exams tab sorts them the same way: soonest first, undated, then done', lefts == ['Tomorrow', 'in 3 days', '', '', 'Done'], lefts)
    pg.screenshot(path=f'{SHOTS}/exams-countdowns.png')
    ctx.close()

    # ---- dark mode look ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, color_scheme='dark', device_scale_factor=2)
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.goto(BASE + '/math/#exams')
    pg.wait_for_selector('#m1')
    pg.screenshot(path=f'{SHOTS}/dark-exams.png')
    pg.click('#tab-summary')
    pg.locator('#gx-concavity').scroll_into_view_if_needed()
    pg.wait_for_timeout(300)
    pg.screenshot(path=f'{SHOTS}/dark-graph.png')
    ctx.close()

    # ---- offline: load once, then the network goes away ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844})
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.goto(BASE + '/')
    pg.wait_for_function("navigator.serviceWorker && navigator.serviceWorker.controller !== undefined")
    pg.evaluate("navigator.serviceWorker.ready")
    pg.wait_for_timeout(1500)
    pg.reload()  # now controlled by the service worker
    pg.wait_for_timeout(800)
    controlled = pg.evaluate("Boolean(navigator.serviceWorker.controller)")
    check('offline: the service worker takes over', controlled)
    pg.goto(BASE + '/math/')
    pg.wait_for_selector('.calc-fab')
    ctx.set_offline(True)
    pg.goto(BASE + '/math/#exams')
    ok_math = pg.locator('#view-exams').count() == 1
    pg.wait_for_timeout(300)
    check('offline: the Math page opens with no network', ok_math and pg.locator('#m1 .rq').count() == 6)
    pg.goto(BASE + '/')
    pg.wait_for_selector('#news li', timeout=5000)
    check('offline: the home page opens with its exam list and news', pg.locator('#up-list .up-item').count() == 5)
    ctx.set_offline(False)
    ctx.close()
    b.close()
srv.shutdown()
srv2.shutdown()
shutil.rmtree(SITE if '--shots' in sys.argv else SCRATCH, ignore_errors=True)
print(f'\n{len(fails)} failed' if fails else '\nall feature checks passed')
sys.exit(1 if fails else 0)
