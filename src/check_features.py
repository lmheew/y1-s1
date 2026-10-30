"""Browser check of the study features (needs Python Playwright with Chromium; no internet needed).

    python3 src/check_features.py            # Exams tab, countdowns, mock timer and scoring, step-by-step solutions,
    python3 src/check_features.py --shots DIR    Formulas Test me, graphs, New labels, deferred tabs, home page, the exam
                                                 picker and old addresses, shared files, offline

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


class Server(http.server.ThreadingHTTPServer):
    # a browser that leaves a page mid-download (the picker forwarding an old address, say) is not an error
    def handle_error(self, request, client_address):
        if not isinstance(sys.exc_info()[1], (BrokenPipeError, ConnectionResetError)):
            super().handle_error(request, client_address)


def serve(directory):
    srv = Server(('127.0.0.1', 0), functools.partial(Q, directory=directory))
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
        days = sorted({n['date'] for n in json.load(open(os.path.join(REPO, 'site.json')))['news'][:6]})
        check(f'{label}: home shows What\'s new grouped by day, one New label per day', pg.locator('#news .n-items li').count() == 6
              and pg.locator('#news .n-day').count() == len(days) and pg.locator('#news .new-pill').count() == len(days), days)
        newest = max(n['date'] for n in json.load(open(os.path.join(REPO, 'site.json')))['news'])
        check(f'{label}: home footer says when the site was last updated', pg.locator('#updated').is_visible()
              and pg.locator('#updated time').get_attribute('datetime') == newest)
        check(f'{label}: Math card has a New label', pg.locator('#card-math .new-pill').count() == 1)
        check(f'{label}: home exams skip the course name while there is one course, and dates and the link stay whole',
              'Linear Algebra 1 ·' not in pg.locator('#up-list').inner_text()
              and pg.evaluate("[...document.querySelectorAll('#up-list .up-when .nw, .up-more a')].every((e) => e.getClientRects().length === 1)"))
        if label == 'phone':
            # link previews: both pages name a 1200 x 630 image that is in the repository, by its address on the live site
            for url in ['/', '/math/', '/math/derivatives/']:
                pg.goto(BASE + url)
                og = pg.evaluate("Object.fromEntries([...document.querySelectorAll('meta[property^=\"og:\"], meta[name=\"twitter:card\"]')].map((m) => [m.getAttribute('property') || m.getAttribute('name'), m.content]))")
                img = og.get('og:image', '')
                local = os.path.join(REPO, img.replace('https://lmheew.github.io/y1-s1/', '')) if img.startswith('https://lmheew.github.io/y1-s1/') else ''
                size = None
                if local and os.path.exists(local):
                    with open(local, 'rb') as fh:
                        head = fh.read(24)
                    size = (int.from_bytes(head[16:20], 'big'), int.from_bytes(head[20:24], 'big'))
                check(f'link preview for {url}: title, description, card and a 1200 x 630 image', all(og.get(k) for k in ['og:title', 'og:description', 'og:url'])
                      and og.get('twitter:card') == 'summary_large_image' and size == (1200, 630), (og.get('og:title'), img, size))
            pg.goto(BASE + '/')
            pg.wait_for_selector('#news li')
        check(f'{label}: home offline card is there', pg.locator('#offline').is_visible())
        check(f'{label}: home has no sideways scroll', overflow(pg) <= 0)
        shot('home', True)

        # ---- the exam picker (math/): a card per exam; old addresses of the one Math page go on to Calculus midterm 1 ----
        pg.goto(BASE + '/math/')
        pg.wait_for_selector('.exams')
        cards = pg.locator('.exam')
        check(f'{label}: picker: three exams in course order, only Calculus midterm 1 opens', cards.count() == 3
              and [cards.nth(i).get_attribute('id') for i in range(3)] == ['exam-derivatives', 'exam-integrals', 'exam-linear-algebra']
              and pg.locator('a.exam').count() == 1 and pg.locator('a.exam .pill').count() == 1 and pg.locator('.exam.soon .e-soon').count() == 2)
        # (its New label is checked below, on a device that hasn't opened anything yet)
        check(f'{label}: picker: Calculus midterm 1 has its date and what it holds', 'Fri 30 Oct' in cards.nth(0).inner_text()
              and 'past midterms' in cards.nth(0).locator('.e-stats').inner_text())
        check(f'{label}: picker: an undated exam says so', 'Date to be announced' in cards.nth(2).inner_text())
        check(f'{label}: picker: no sideways scroll', overflow(pg) <= 0, overflow(pg))
        shot('picker', True)

        # ---- math page: deferred tabs, shared files ----
        pg.goto(BASE + '/math/derivatives/')
        pg.wait_for_selector('.calc-fab')
        files = pg.evaluate("""() => ({ css: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.getAttribute('href')),
          js: [...document.querySelectorAll('script[src]')].map((s) => s.getAttribute('src')), styles: document.querySelectorAll('style').length,
          fonts: [...document.fonts].filter((f) => f.status === 'loaded' && /^KaTeX/.test(f.family)).length })""")
        import hashlib
        ver = lambda f: hashlib.sha256(open(os.path.join(REPO, 'math', 'assets', f), 'rb').read()).hexdigest()[:10]
        check(f'{label}: the page uses the shared files, named by their version, and nothing inline', f'../assets/math.css?v={ver("math.css")}' in files['css']
              and files['js'] == [f'../assets/math.js?v={ver("math.js")}'] and files['styles'] == 0 and 'data:font' not in open(os.path.join(REPO, 'math', 'derivatives', 'index.html')).read(), files)
        check(f'{label}: math fonts load from the shared files', files['fonts'] >= 2, files)
        check(f'{label}: heavy tabs wait as text until opened', pg.locator('#lazy-exams').count() == 1 and pg.locator('#view-exams .sheet').count() == 0)
        check(f'{label}: Exams tab shows a New dot', pg.evaluate("document.getElementById('tab-exams').classList.contains('has-new')"))
        check(f'{label}: Summary graphs carry New labels', pg.locator('#view-summary .gx-title .new-pill').count() == 7)
        tiles = pg.locator('.tiles .tile')
        check(f'{label}: Summary tiles follow the schedule: day, lesson name, then a small quiz line', tiles.count() == 8
              and 'continuous functions' in tiles.nth(0).inner_text().lower() and tiles.nth(0).locator('.tile-q').inner_text() == 'Quiz 01'
              and 'infinite series' in tiles.nth(4).inner_text().lower() and tiles.nth(4).locator('.tile-q').count() == 0, tiles.all_inner_texts()[:5])

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
        check(f'{label}: past midterms are locked: three password panels (AY2022, AY2023, AY2026), no questions', pg.locator('#past .sheet.lock').count() == 3
              and pg.locator('#past .rq').count() == 0 and pg.locator('#past .seg-btn').count() == 3)
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
        check(f'{label}: public search shows nothing from the locked past midterms', not any(h.startswith('Midterm AY20') for h in hits), hits[:5])
        pg.locator('#search-results .s-hit', has_text='Mock Midterm 2').first.click()
        pg.wait_for_timeout(700)
        check(f'{label}: a search hit opens the right mock', pg.locator('#m2').is_visible() and pg.locator('#view-exams').is_visible())

        # ---- every tab, no sideways scroll, no console errors ----
        for v in ['summary', 'practice', 'formulas', 'quizzes', 'exams']:
            pg.click(f'#tab-{v}')
            check(f'{label}: {v}: no sideways scroll', overflow(pg) <= 0, overflow(pg))
        check(f'{label}: no console errors', not errors, errors[:3])
        ctx.close()

    # ---- old addresses: links to the one Math page (math/#exams…) open that tab of Calculus midterm 1 ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844})
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    for old in ['#exams', '#formulas', '#quizzes']:
        pg.goto(BASE + '/math/' + old)
        pg.wait_for_selector('.calc-fab')
        check(f'old address: math/{old} opens that tab of Calculus midterm 1', pg.url.endswith('/math/derivatives/' + old)
              and pg.locator('#view-' + old[1:]).is_visible(), pg.url)
    pg.go_back()
    pg.wait_for_timeout(300)
    check('old address: Back skips the forwarding step (no loop through the picker)', pg.url.endswith('/math/derivatives/#formulas'), pg.url)
    ctx.close()

    # ---- New labels only for what this device hasn't seen: a tab's dot goes when it opens, its labels at the next
    # visit (a new browser tab here: same localStorage, fresh sessionStorage) ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844})
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    dots = lambda page: page.evaluate("Array.from(document.querySelectorAll('.tab.has-new')).map((t) => t.dataset.view)")
    pg.goto(BASE + '/')
    pg.wait_for_selector('#news .n-day')
    check('new: first visit: the Math card and each day in What\'s new are New', pg.locator('#card-math .new-pill').count() == 1 and pg.locator('#news .new-pill').count() == pg.locator('#news .n-day').count())
    pg.goto(BASE + '/math/')
    pg.wait_for_selector('.exams')
    check('new: first visit: the picker marks Calculus midterm 1 New', pg.locator('#exam-derivatives .new-pill').count() == 1)
    pg.goto(BASE + '/math/derivatives/')
    pg.wait_for_selector('.calc-fab')
    check('new: first visit: every tab with new things has a dot but the open one', dots(pg) == ['practice', 'formulas', 'exams'], dots(pg))
    pg.click('#tab-exams')
    check('new: opening a tab clears its dot, and its New labels stay for this visit', 'exams' not in dots(pg) and pg.locator('#m1 .sheet-title .new-pill').count() == 1, dots(pg))
    pg.reload()
    pg.wait_for_selector('#m1')
    check('new: after a reload the dot stays gone and the labels stay', 'exams' not in dots(pg) and pg.locator('#m1 .sheet-title .new-pill').count() == 1, dots(pg))
    pg2 = ctx.new_page()
    pg2.goto(BASE + '/math/derivatives/#exams')
    pg2.wait_for_selector('#m1')
    check('new: next visit: tabs not opened yet keep their dots', dots(pg2) == ['practice', 'formulas'], dots(pg2))
    check('new: next visit: no New labels in the tabs already opened', pg2.locator('#m1 .new-pill').count() == 0
          and pg2.locator('#view-summary .new-pill').count() == 0, (pg2.locator('#m1 .new-pill').count(), pg2.locator('#view-summary .new-pill').count()))
    pg2.goto(BASE + '/')
    pg2.wait_for_selector('#news .n-day')
    check('new: next visit: the home page has no New labels', pg2.locator('.new-pill').count() == 0, pg2.locator('.new-pill').count())
    pg2.goto(BASE + '/math/')
    pg2.wait_for_selector('.exams')
    check('new: once Calculus midterm 1 has been opened, the picker drops its New label', pg2.locator('.new-pill').count() == 0)
    # the picker follows the theme picked on an exam page, before its first paint
    pg2.evaluate("localStorage.setItem('cla1-midterm-review', JSON.stringify({ theme: 'dark' }))")
    pg2.reload()
    pg2.wait_for_selector('.exams')
    check('theme: the picker follows the theme picked on an exam page', pg2.evaluate("document.documentElement.dataset.theme") == 'dark'
          and pg2.evaluate("getComputedStyle(document.body).backgroundColor") == 'rgb(14, 19, 16)')
    pg2.goto(BASE + '/math/derivatives/')
    pg2.wait_for_selector('.calc-fab')
    pg2.click('#theme-btn')
    check('theme: on an exam page the saved choice is set early, and "system" still follows the device', pg2.evaluate("document.documentElement.hasAttribute('data-theme')") is False
          and pg2.locator('#theme-btn').get_attribute('data-mode') == 'system')
    ctx.close()

    # ---- page not found: GitHub Pages serves 404.html at any missing address under /y1-s1/, so its links are absolute ----
    MOUNT = tempfile.mkdtemp(prefix='check-404-')
    os.symlink(REPO, os.path.join(MOUNT, 'y1-s1'))
    srv4, BASE4 = serve(MOUNT)
    ctx = b.new_context(viewport={'width': 390, 'height': 844})
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.goto(BASE4 + '/y1-s1/404.html')
    links = pg.locator('a').evaluate_all("(as) => as.map((a) => a.getAttribute('href'))")
    check('404: says the page was not found and links home and to the Math page', 'Page not found' in pg.locator('h1').inner_text()
          and '/y1-s1/' in links and '/y1-s1/math/' in links and overflow(pg) <= 0, links)
    pg.locator('a.go.main').click()
    pg.wait_for_selector('#news li')
    check('404: its home link opens the home page from any address', pg.url.endswith('/y1-s1/'))
    ctx.close()
    srv4.shutdown()

    # ---- side menu: from 1100 px only; lists the open tab's sections, follows the reading, jumps on a tap ----
    for w, h in [(1280, 900), (1024, 1366)]:
        ctx = b.new_context(viewport={'width': w, 'height': h})
        ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
        pg = ctx.new_page()
        pg.goto(BASE + '/math/derivatives/#summary')
        pg.wait_for_selector('.calc-fab')
        toc = pg.locator('#view-summary .toc')
        if w < 1100:
            check(f'side menu: hidden at {w} px (an upright iPad or a phone)', toc.count() == 1 and not toc.is_visible())
            ctx.close()
            continue
        check('side menu: shown on a wide screen with every lesson and the exam-day habits', toc.is_visible() and toc.locator('a').count() == 8)
        pg.evaluate("document.getElementById('su-u3').scrollIntoView()")
        pg.wait_for_timeout(300)
        cur = pg.locator('#view-summary .toc a[aria-current="true"]')
        check('side menu: highlights the lesson being read', cur.count() == 1 and 'Day 5 & 6' in cur.inner_text(), cur.all_inner_texts())
        toc.locator('a', has_text='Infinite series').click()
        pg.wait_for_timeout(1500)
        top = pg.evaluate("document.getElementById('su-u7').getBoundingClientRect().top")
        check('side menu: a tap jumps to that section', abs(top - 72) < 30, top)
        pg.click('#tab-exams')
        pg.wait_for_timeout(400)
        etoc = pg.locator('#view-exams .toc')
        check('side menu: Exams lists each mock and past paper', etoc.locator('.toc-paper').count() == 6)
        etoc.locator('.toc-paper', has_text='Mock 2').click()
        pg.wait_for_timeout(500)
        check('side menu: tapping a paper opens it', pg.locator('#m2').is_visible() and not pg.locator('#m1').is_visible()
              and 'sel' in (etoc.locator('.toc-paper', has_text='Mock 2').get_attribute('class') or ''))
        check('side menu: no sideways scroll', overflow(pg) <= 0)
        pg.evaluate("localStorage.clear()")
        ctx.close()

    # ---- printing a mock: the paper (questions only, room to write) or with answers; the marks go after printing ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, color_scheme='dark')
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.add_init_script("window.print = () => { window.__printed = (window.__printed || []).concat(document.documentElement.dataset.print); };")
    pg.goto(BASE + '/math/derivatives/#exams')
    pg.wait_for_selector('#m1 .print-btn')
    shown = lambda sel: pg.evaluate(f"[...document.querySelectorAll('{sel}')].filter((e) => getComputedStyle(e).display !== 'none' && e.getClientRects().length).length")
    pg.locator('#m1 .print-btn[data-print="paper"]').click()
    pg.emulate_media(media='print')
    check('print: Print paper prints the sheet on its own', pg.evaluate('window.__printed') == ['paper'] and shown('.appbar, .tabbar, #m2, #m3, .band') == 0 and shown('#m1 .rq') == 6)
    check('print: the paper has no answers, timer or buttons, and has a score line', shown('#m1 .reveal, #m1 .timer, #m1 .sheet-tools') == 0 and shown('#m1 .print-score') == 1)
    check('print: dark ink on white even in dark mode', pg.evaluate("getComputedStyle(document.body).color") == 'rgb(17, 17, 17)')
    pg.emulate_media(media='screen')
    pg.evaluate("window.dispatchEvent(new Event('afterprint'))")
    pg.mouse.click(5, 300)
    check('print: the marks go once the page is used again', pg.evaluate("!document.documentElement.dataset.print && !document.querySelector('.printing, .print-path')"))
    pg.locator('#m1 .print-btn[data-print="key"]').click()
    pg.emulate_media(media='print')
    check('print: Print with answers opens every answer, with all its steps', pg.locator('#m1 details.sol[open]').count() == 6
          and shown('#m1 .answer') == 6 and shown('#m1 .step-hidden') == pg.locator('#m1 .step-hidden').count() and shown('#m1 summary, #m1 .mkrow') == 0)
    pg.emulate_media(media='screen')
    pg.evaluate("window.dispatchEvent(new Event('afterprint'))")
    pg.mouse.click(5, 300)
    check('print: afterwards the answers close again', pg.locator('#m1 details.sol[open]').count() == 0)
    ctx.close()

    # ---- a narrow phone with every answer and every sheet open: full-size math never pushes the page sideways ----
    ctx = b.new_context(viewport={'width': 360, 'height': 800})
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.goto(BASE + '/math/derivatives/')
    pg.wait_for_selector('.calc-fab')
    wide = {}
    for v in ['summary', 'practice', 'formulas', 'quizzes', 'exams']:
        pg.click(f'#tab-{v}')
        pg.wait_for_timeout(200)
        wide[v] = pg.evaluate("""() => {
          document.querySelectorAll('details').forEach((d) => { d.open = true; });
          document.querySelectorAll('.sheet[hidden], .steps [hidden]').forEach((e) => { e.hidden = false; });
          return document.documentElement.scrollWidth - document.documentElement.clientWidth;
        }""")
    check('narrow phone: no sideways scroll with every answer open', all(x <= 0 for x in wide.values()), wide)
    check('summary: key formulas sit full size on their own line', pg.locator('#su-u2 .ideas .katex-display').count() >= 6
          and pg.locator('#su-u5 .ideas .katex-display').count() >= 3)
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
    pg.goto(BASE2 + '/math/')
    pg.wait_for_selector('.exams')
    lefts = pg.locator('.exam .e-left').all_inner_texts()
    check('countdown: the picker counts down to each exam: in 3 days, Tomorrow, Done', lefts == ['in 3 days', 'Tomorrow', 'Done']
          and pg.locator('.e-when.soon').count() == 2 and pg.locator('.e-when.past').count() == 1, lefts)
    pg.screenshot(path=f'{SHOTS}/picker-countdowns.png', full_page=True)
    pg.goto(BASE2 + '/math/derivatives/#exams')
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
    pg.goto(BASE + '/math/derivatives/#exams')
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
    saved = pg.evaluate("""async () => {
      const want = ['./', './math/', './math/derivatives/', 'site.json', 'src/shared/totop.css', 'src/shared/totop.js', 'math/assets/math.css',
        'math/assets/math.js', 'math/assets/fonts/KaTeX_Main-Regular.woff2'].map((u) => new URL(u, location.href).href);
      for (const name of await caches.keys()) {
        const c = await caches.open(name);
        if ((await Promise.all(want.map((u) => c.match(u)))).every(Boolean)) return true;
      }
      return false;
    }""")
    check('offline: pages and the shared files are saved on the first visit', saved)
    pg.reload()  # now controlled by the service worker
    pg.wait_for_timeout(800)
    controlled = pg.evaluate("Boolean(navigator.serviceWorker.controller)")
    check('offline: the service worker takes over', controlled)
    ctx.set_offline(True)
    # Calculus midterm 1 was never opened online here: its page, style, script and fonts come from what the first visit saved
    pg.goto(BASE + '/math/derivatives/#exams')
    pg.wait_for_selector('#m1 .rq')
    pg.wait_for_timeout(300)
    check('offline: Calculus midterm 1 opens with no network, styled, with its script and math fonts', pg.locator('#m1 .rq').count() == 6
          and pg.evaluate("getComputedStyle(document.querySelector('.appbar')).position") == 'sticky'
          and pg.evaluate("document.fonts.check('16px KaTeX_Main')") and pg.locator('.calc-fab').count() == 1)
    pg.goto(BASE + '/math/')
    pg.wait_for_selector('.exams')
    check('offline: the exam picker opens with no network', pg.locator('.exam').count() == 3)
    pg.goto(BASE + '/')
    pg.wait_for_selector('#news li', timeout=5000)
    check('offline: the home page opens with its exam list and news', pg.locator('#up-list .up-item').count() == 5)
    check('offline: the home page keeps its back-to-top button', pg.evaluate("(() => { const b = document.querySelector('.totop'); return Boolean(b) && getComputedStyle(b).position === 'fixed'; })()"))
    ctx.set_offline(False)
    ctx.close()
    b.close()
srv.shutdown()
srv2.shutdown()
shutil.rmtree(SITE if '--shots' in sys.argv else SCRATCH, ignore_errors=True)
print(f'\n{len(fails)} failed' if fails else '\nall feature checks passed')
sys.exit(1 if fails else 0)
