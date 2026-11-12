"""Browser check of the study features (needs Python Playwright with Chromium; no internet needed).

    python3 src/check_features.py            # Exams tab, countdowns, mock timer and scoring, step-by-step solutions,
    python3 src/check_features.py --shots DIR    Formulas Test me, graphs, New labels, deferred tabs, home page, the exam
                                                 picker and old addresses, shared files, offline

Countdowns are tested on a temporary copy of the site with exam dates filled in. Some checks expect the current
content (three mocks, seven graphs, seven exams (five Math, two Physics) and six news entries in site.json, three
Physics practice sets of eleven problems); update them when that changes."""
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
phys = [x for x in data['exams'] if x['subject'] == 'physics']
phys[0].update(date=str(today + datetime.timedelta(days=10)), time=None)  # the Physics midterm; the final stays undated
for x in phys[1:]:
    x.update(date=None, time=None)
json.dump(data, open(os.path.join(SITE, 'site.json'), 'w'), indent=2)
subprocess.run(['node', 'src/math/build.mjs', 'site'], cwd=SITE, check=True, capture_output=True)
subprocess.run(['node', 'src/physics/build.mjs', 'site'], cwd=SITE, check=True, capture_output=True)


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
# Cards, questions, formula rows and Summary modules skip drawing while away from the screen, and clip what overflows
# them (content-visibility in page.css). Sideways scroll is measured with that off, so too-wide content anywhere shows.
WIDE_JS = """() => { const s = document.createElement('style');
  s.textContent = '.prob, .rq, .frow, .smod { content-visibility: visible !important; }';
  document.head.append(s);
  const w = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  s.remove(); return w; }"""
overflow = lambda pg: pg.evaluate(WIDE_JS)

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
        # Next up: the soonest exam with a date, then the others with a date; the rest under Other exams
        exams_all = json.load(open(os.path.join(REPO, 'site.json')))['exams']
        check(f'{label}: home shows all 7 exams: the next one, the others coming, then the rest, dates to be announced',
              pg.locator('#next-exam').count() == 1 and 1 + pg.locator('#up-list .up-item').count() + pg.locator('#later-list .up-item').count() == len(exams_all) == 7
              and 'Date to be announced' in pg.locator('#later-list').inner_text())
        days = sorted({n['date'] for n in json.load(open(os.path.join(REPO, 'site.json')))['news'][:6]})
        check(f'{label}: home shows What\'s new grouped by day, one New label per day', pg.locator('#news .n-items li').count() == 6
              and pg.locator('#news .n-day').count() == len(days) and pg.locator('#news .new-pill').count() == len(days), days)
        newest = max(n['date'] for n in json.load(open(os.path.join(REPO, 'site.json')))['news'])
        check(f'{label}: home footer says when the site was last updated', pg.locator('#updated').is_visible()
              and pg.locator('#updated time').get_attribute('datetime') == newest)
        check(f'{label}: Math and Physics cards have a New label', pg.locator('#card-math .new-pill').count() == 1 and pg.locator('#card-physics .new-pill').count() == 1)
        lists = pg.locator('#up-list').inner_text() + pg.locator('#later-list').inner_text()
        check(f'{label}: home exams name their course now that there are two, and dates stay whole',
              'Linear Algebra 1 ·' in lists and 'Engineering Physics 1' in lists + pg.locator('#next-exam').inner_text()
              and pg.evaluate("[...document.querySelectorAll('#up-list .up-when .nw, #later-list .up-when .nw')].every((e) => e.getClientRects().length === 1)"))
        check(f'{label}: the Physics midterm links to its page', pg.locator('#next-exam a[href="physics/midterm/"], #up-list a[href="physics/midterm/#exams"]').count() == 1)
        check(f'{label}: the next exam links to its page, its Practice and its night-before sheet, and Practice has not started here yet',
              pg.locator('#next-exam .nx-btns a').count() == 3 and pg.locator('#next-exam a[href$="#night"]').count() == 1
              and 'not started yet' in pg.locator('#next-exam').inner_text() and pg.locator('#resume').is_hidden())
        check(f'{label}: What\'s new shows a headline per entry, its text a tap away', pg.locator('#news details').count() == 6
              and pg.locator('#news details[open]').count() == 0 and not pg.locator('#news .n-text').first.is_visible())
        pg.locator('#news details summary').first.click()
        check(f'{label}: a tapped headline opens its note and link', pg.locator('#news .n-text').first.is_visible() and pg.locator('#news .n-open').first.is_visible())
        if label == 'phone':
            # link previews: both pages name a 1200 x 630 image that is in the repository, by its address on the live site
            for url in ['/', '/math/', '/math/derivatives/', '/physics/', '/physics/midterm/']:
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
            # icons: every page gives the Home Screen the app icon; the browser tab shows the subject's badge on its
            # pages and the app icon on the home page (all made by src/app_icon.py)
            def png_size(name):
                with open(os.path.join(REPO, name), 'rb') as fh:
                    head = fh.read(24)
                return '%dx%d' % (int.from_bytes(head[16:20], 'big'), int.from_bytes(head[20:24], 'big'))
            tabs = {'/': 'favicon.png', '/math/': 'favicon-math.svg', '/math/derivatives/': 'favicon-math.svg', '/math/integrals/': 'favicon-math.svg',
                    '/physics/': 'favicon-physics.svg', '/physics/midterm/': 'favicon-physics.svg'}
            for url, want in tabs.items():
                pg.goto(BASE + url)
                got = pg.evaluate("['icon', 'apple-touch-icon'].map((r) => new URL(document.querySelector(`link[rel=\"${r}\"]`).getAttribute('href'), location.href).pathname)")
                check(f'icons for {url}: the tab shows {want}, the Home Screen gets the app icon',
                      got == ['/' + want, '/apple-touch-icon.png'] and os.path.exists(os.path.join(REPO, want)), got)
            man = json.load(open(os.path.join(REPO, 'manifest.webmanifest')))
            named = [(i['src'], i['sizes']) for i in man['icons']] + [(i['src'], i['sizes']) for s in man['shortcuts'] for i in s['icons']]
            named += [('apple-touch-icon.png', '180x180'), ('favicon.png', '64x64'), ('logo.png', '108x108')]
            wrong = [(src, want) for src, want in named if not os.path.exists(os.path.join(REPO, src)) or png_size(src) != want]
            check('app icon files are there, at the sizes the manifest and the pages give', not wrong, wrong)
            badge = lambda s: 'icon-physics-192.png' if s['url'].startswith('physics/') else 'icon-math-192.png'
            check("the manifest's shortcuts show their subject's badge, not the app icon",
                  all(i['src'] == badge(s) for s in man['shortcuts'] for i in s['icons']) and any(s['url'].startswith('physics/') for s in man['shortcuts']))
            pg.goto(BASE + '/')
            pg.wait_for_selector('#news li')
            pg.wait_for_function("document.querySelector('.brand img').complete")
            logo = pg.evaluate("(() => { const i = document.querySelector('.brand img'); return [i.naturalWidth, Math.round(i.getBoundingClientRect().width)]; })()")
            check('home: the logo is the app icon, drawn 36 px wide', logo == [108, 36], logo)
        check(f'{label}: home offline card is there', pg.locator('#offline').is_visible())
        check(f'{label}: home has no sideways scroll', overflow(pg) <= 0)
        shot('home', True)

        # ---- the exam picker (math/): a card per exam; old addresses of the one Math page go on to Calculus midterm 1 ----
        pg.goto(BASE + '/math/')
        pg.wait_for_selector('.exams')
        cards = pg.locator('.exam')
        check(f'{label}: picker: three exams in course order, Calculus midterms 1 and 2 open', cards.count() == 3
              and [cards.nth(i).get_attribute('id') for i in range(3)] == ['exam-derivatives', 'exam-integrals', 'exam-linear-algebra']
              and pg.locator('a.exam').count() == 2 and pg.locator('a.exam .pill').count() == 2 and pg.locator('.exam.soon .e-soon').count() == 1)
        # (their New labels are checked below, on a device that hasn't opened anything yet)
        check(f'{label}: picker: Calculus midterm 1 has its date and what it holds', 'Fri 30 Oct' in cards.nth(0).inner_text()
              and 'past midterms' in cards.nth(0).locator('.e-stats').inner_text())
        check(f'{label}: picker: Calculus midterm 2 has its date, its lesson span and the lessons so far', 'Mon 23 Nov' in cards.nth(1).inner_text()
              and '2–20 nov' in cards.nth(1).locator('.kicker').inner_text().lower() and 'of 6 lessons' in cards.nth(1).locator('.e-stats').inner_text())
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

        # ---- answers are built when they open; steps ----
        pg.click('#tab-practice')
        n_probs = pg.locator('#view-practice .prob').count()
        check(f'{label}: answers wait as text until opened (one per problem), with their mark buttons built',
              pg.locator('#view-practice .answer, #view-practice .steps').count() == 0
              and pg.locator('#view-practice details.sol > .sol-body > script.lazy-sol').count() == n_probs
              and pg.locator('#view-practice .sol-body > .markrow .mbtn').count() == 2 * n_probs,
              (n_probs, pg.locator('#view-practice script.lazy-sol').count(), pg.locator('#view-practice .answer').count()))
        card = pg.locator('#prob-4-1')
        card.locator('details.sol > summary').click()
        pg.wait_for_timeout(150)
        check(f'{label}: opening an answer builds that one only, above its mark buttons',
              card.locator('script.lazy-sol').count() == 0 and pg.locator('#view-practice .answer').count() == 1
              and pg.evaluate("[...document.querySelector('#prob-4-1 .sol-body').children].map((c) => c.className).join(' ')") == 'answer steps stepbar markrow',
              pg.evaluate("[...document.querySelector('#prob-4-1 .sol-body').children].map((c) => c.className).join(' ')"))
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
    # visit (a new browser tab here: same localStorage, fresh sessionStorage). Labels last 14 days, so the pages see a
    # fixed moment, noon on 11 Nov 2026, when every item counted below was new (Calculus midterm 1's lessons are from
    # 29 Oct); the rest of the browser keeps the real time ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844})
    ctx.clock.set_fixed_time(datetime.datetime(2026, 11, 11, 12, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=9))))
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    dots = lambda page: page.evaluate("Array.from(document.querySelectorAll('.tab.has-new')).map((t) => t.dataset.view)")
    pg.goto(BASE + '/')
    pg.wait_for_selector('#news .n-day')
    check('new: first visit: the Math card and each day in What\'s new are New', pg.locator('#card-math .new-pill').count() == 1 and pg.locator('#news .new-pill').count() == pg.locator('#news .n-day').count())
    pg.goto(BASE + '/math/')
    pg.wait_for_selector('.exams')
    check('new: first visit: the picker marks Calculus midterms 1 and 2 New', pg.locator('#exam-derivatives .new-pill').count() == 1
          and pg.locator('#exam-integrals .new-pill').count() == 1)
    pg.goto(BASE + '/math/derivatives/')
    pg.wait_for_selector('.calc-fab')
    check('new: first visit: every tab with new things has a dot but the open one', dots(pg) == ['practice', 'formulas', 'exams'], dots(pg))
    check('new: first visit: Summary graphs carry New labels', pg.locator('#view-summary .gx-title .new-pill').count() == 7,
          pg.locator('#view-summary .gx-title .new-pill').count())
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
    # Calculus midterm 2 keeps its own keys in study-seen ("math-integrals:<tab>"): its dots and Calculus midterm 1's don't mix
    pg2.goto(BASE + '/math/integrals/')
    pg2.wait_for_selector('#view-summary .unit')
    check('new: Calculus midterm 2 has its own tab dots', dots(pg2) == ['practice', 'formulas', 'quizzes'], dots(pg2))
    check('new: Calculus midterm 2 marks its new lessons and graph', pg2.locator('#su-u3 .unit-head .new-pill').count() == 1
          and pg2.locator('#su-u2 .unit-head .new-pill').count() == 1
          and pg2.locator('#su-u1 .unit-head .new-pill').count() == 1
          and pg2.locator('#gx-riemann .new-pill').count() == 1, pg2.locator('#su-u1 .new-pill').count())
    pg2.click('#tab-practice')
    pg2.goto(BASE + '/math/derivatives/')
    pg2.wait_for_selector('.calc-fab')
    check("new: opening midterm 2's Practice leaves midterm 1's dot alone", 'practice' in dots(pg2), dots(pg2))
    pg2.goto(BASE + '/')
    pg2.wait_for_selector('#news .n-day')
    check('new: next visit: only the subject not opened yet (Physics) keeps its New label on the home page',
          pg2.locator('.new-pill').count() == 1 and pg2.locator('#card-physics .new-pill').count() == 1, pg2.locator('.new-pill').count())
    pg2.goto(BASE + '/physics/midterm/')
    pg2.wait_for_selector('#view-summary .wex')
    pg2.goto(BASE + '/')
    pg2.wait_for_selector('#news .n-day')
    check('new: once Physics has been opened too, the home page has no New labels', pg2.locator('.new-pill').count() == 0, pg2.locator('.new-pill').count())
    pg2.goto(BASE + '/physics/')
    pg2.wait_for_selector('.exams')
    check('new: once the Physics midterm has been opened, its picker drops its New label', pg2.locator('.new-pill').count() == 0)
    pg2.goto(BASE + '/math/')
    pg2.wait_for_selector('.exams')
    check('new: once Calculus midterms 1 and 2 have been opened, the picker drops their New labels', pg2.locator('.new-pill').count() == 0)
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
    pg.wait_for_function("document.querySelector('.brand img').complete")
    check('404: its tab icon and logo are the app icon', pg.evaluate("document.querySelector('link[rel=icon]').getAttribute('href')") == '/y1-s1/favicon.png'
          and pg.evaluate("document.querySelector('.brand img').naturalWidth") == 108)
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

    # ---- long tabs show before all of it is drawn (content-visibility in page.css, drawAll in page.js) ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.goto(BASE + '/physics/midterm/#summary')
    pg.wait_for_selector('#view-summary .smod')
    UNDRAWN = "document.querySelectorAll('#view-{0} :is(.prob, .rq, .frow, .smod):not(.drawn)').length"
    pg.wait_for_function(UNDRAWN.format('summary') + ' === 0', timeout=15000)  # the Summary is drawn after the page loads
    first = pg.evaluate("""() => { document.getElementById('tab-practice').click();
      const c = document.querySelector('#prob-8-14');
      return [document.querySelectorAll('#view-practice .prob:not(.drawn)').length, getComputedStyle(c).contentVisibility]; }""")
    check('speed: a long tab shows before its cards are drawn (they skip layout at first)', first == [103, 'auto'], first)
    pg.wait_for_function(UNDRAWN.format('practice') + ' === 0', timeout=15000)
    check('speed: a moment later every card is drawn for good',
          pg.evaluate("getComputedStyle(document.querySelector('#prob-8-14')).contentVisibility") == 'visible')
    for v in ['formulas', 'quizzes', 'exams']:
        pg.click(f'#tab-{v}')
        pg.wait_for_function(UNDRAWN.format(v) + ' === 0', timeout=15000)
    check('speed: formula rows, quiz and exam questions and Summary modules are drawn too',
          all(pg.evaluate(UNDRAWN.format(v)) == 0 for v in ['summary', 'formulas', 'quizzes', 'exams']))
    pg.evaluate("document.querySelector('#prob-8-14').classList.remove('drawn')")
    pg.emulate_media(media='print')
    check('speed: printing draws a card that is not drawn yet', pg.evaluate("getComputedStyle(document.querySelector('#prob-8-14')).contentVisibility") == 'visible')
    pg.emulate_media(media='screen')
    ctx.close()
    # jumps far down land on their target; a fling to the end right after a tab opens, then back up, never jumps
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.goto(BASE + '/physics/midterm/#summary')
    pg.wait_for_selector('#view-summary .smod')
    landed = lambda sel: pg.evaluate(f"""() => {{ const e = document.querySelector('{sel}');
      return Math.round(e.getBoundingClientRect().top - parseFloat(getComputedStyle(e).scrollMarginTop)); }}""")
    pg.click('#search-btn')
    pg.fill('#search-input', 'roller coaster friction')
    pg.locator('#search-results .s-hit', has_text='Chapter 8 · Q.12').first.click()
    pg.wait_for_timeout(1800)
    check('speed: a search hit far down Practice lands on its card', abs(landed('#prob-8-12')) <= 8, landed('#prob-8-12'))
    li, label, no = pg.evaluate("""() => { const m = [...document.querySelectorAll('#view-summary .smod')].at(-1);
      const li = m.querySelector('.ideas li'), b = li.querySelector('b, strong');
      return [li.id, b ? b.textContent.replace(/[:.,]+$/, '') : '', m.querySelector('.mod-no').textContent]; }""")
    pg.click('#search-btn')
    pg.fill('#search-input', f'{label} {no}')
    pg.locator('#search-results .s-hit', has_text=f'— {no}').first.click()
    pg.wait_for_timeout(1800)
    check('speed: a search hit in the last Summary module lands on its key idea', abs(landed('#' + li)) <= 8, (li, label, landed('#' + li)))
    FLING = """async (tab) => {
      const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
      document.getElementById('tab-' + tab).click(); await frame();
      scrollTo(0, document.documentElement.scrollHeight); await frame(); await frame();
      const jumps = []; let n = 0;
      while (scrollY > 0 && n++ < 500) {
        const probe = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
        const before = probe.getBoundingClientRect().top, y0 = scrollY;
        scrollBy(0, -250); await frame(); await frame();
        const off = Math.round((probe.getBoundingClientRect().top - before) - (y0 - scrollY));
        if (Math.abs(off) > 2) jumps.push(off);
      }
      return jumps;
    }"""
    for v in ['formulas', 'practice']:
        pg.goto(BASE + '/physics/midterm/#summary')
        pg.wait_for_selector('#view-summary .smod')
        jumps = pg.evaluate(FLING, v)
        check(f'speed: {v}: a fling to the end right after it opens, then back up, never jumps', not jumps, jumps[:5])
    ctx.close()
    ctx = b.new_context(viewport={'width': 1280, 'height': 900})
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.goto(BASE + '/physics/midterm/#practice')
    pg.wait_for_selector('#view-practice .toc')
    pg.locator('#view-practice .toc a', has_text='Potential energy').click()
    pg.wait_for_timeout(1800)
    top = pg.evaluate("document.getElementById('pc8').getBoundingClientRect().top - parseFloat(getComputedStyle(document.getElementById('pc8')).scrollMarginTop)")
    check('speed: the side menu jumps to the last Practice chapter', abs(top) <= 8, top)
    ctx.close()

    # ---- practice sessions: one problem at a time, picked by chapter or lesson (and level on Physics) ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    errors = []
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(BASE + '/physics/midterm/#practice')
    pg.wait_for_selector('#prob-1-1')
    check('session: the setup is closed until asked for', pg.locator('#ssetup').is_hidden() and pg.locator('#ss-open').get_attribute('aria-expanded') == 'false')
    pg.click('#ss-open')
    check('session: the setup opens with every chapter and level on, 10 of the problems not marked yet',
          pg.locator('#ssetup').is_visible() and pg.locator('#ssetup .ss-chips[data-k="units"] .chip[aria-pressed="true"]').count() == 8
          and pg.locator('#ssetup .ss-chips[data-k="tiers"] .chip[aria-pressed="true"]').count() == 3 and pg.locator('#ss-go').inner_text() == 'Start · 10 problems')
    for v in ['1', '2', '3', '5', '6', '7', '8']:
        pg.click(f'#ssetup .ss-chips[data-k="units"] .chip[data-v="pc{v}"]')
    pg.click('#ssetup .ss-chips[data-k="tiers"] .chip[data-v="f"]')
    pg.click('#ssetup .ss-chips[data-k="n"] .chip[data-v="all"]')
    check('session: Chapter 4 without Foundation is its 9 Application and Advanced problems', pg.locator('#ss-go').inner_text() == 'Start · 9 problems', pg.locator('#ss-go').inner_text())
    pg.click('#ss-go')
    shown = lambda: pg.evaluate("[...document.querySelectorAll('#view-practice .prob')].filter((c) => c.offsetParent).map((c) => c.id)")
    cur = shown()
    check('session: one problem at a time, from Chapter 4, not Foundation, with the band and the list out of the way',
          len(cur) == 1 and cur[0].startswith('prob-4-') and not pg.locator('#view-practice .overview').is_visible()
          and not pg.locator('#view-practice .band').is_visible() and not pg.evaluate(f"document.getElementById('{cur[0]}').closest('.ptier').classList.contains('ptier-f')"), cur)
    check('session: the bar counts the problems and says where this one is from', 'Problem 1 of 9' in pg.locator('#sbar .s-count').inner_text()
          and 'Chapter 4' in pg.locator('#sbar .s-where').inner_text() and pg.locator('#sbar .s-next').inner_text() == 'Skip')
    card = pg.locator('.prob.s-cur')
    card.locator('details.sol > summary').click()
    card.locator('.mbtn[data-mark="review"]').click()
    pg.wait_for_timeout(100)
    check('session: once marked, Skip becomes Next', pg.locator('#sbar .s-next').inner_text() == 'Next')
    pg.click('#sbar .s-next')
    check('session: Next shows the next problem, its answer closed', 'Problem 2 of 9' in pg.locator('#sbar .s-count').inner_text()
          and shown() != cur and pg.locator('.prob.s-cur details.sol[open]').count() == 0)
    card = pg.locator('.prob.s-cur')
    card.locator('details.sol > summary').click()
    card.locator('.mbtn[data-mark="got"]').click()
    pg.click('#sbar .s-end')
    check('session: End shows how it went', pg.locator('#sdone').is_visible() and '2 problems' in pg.locator('#sdone').inner_text()
          and '1 got it' in pg.locator('#sdone').inner_text().replace('\n', ' ') and pg.locator('#sbar').count() == 0, pg.locator('#sdone').inner_text())
    pg.click('#sdone .s-again')
    check('session: the ones to review can go again', 'Problem 1 of 1' in pg.locator('#sbar .s-count').inner_text() and shown() == cur, shown())
    check('session: no sideways scroll in a session', overflow(pg) <= 0, overflow(pg))
    pg.click('#sbar .s-end')
    pg.click('#sdone .s-exit')
    check('session: back to all problems, marks kept', pg.locator('#view-practice.in-session').count() == 0 and len(shown()) == 103
          and pg.locator('#ring-all-text').inner_text() == '1/103' and pg.locator('#ov-rev').inner_text() == '1')
    pg.goto(BASE + '/math/derivatives/#practice')
    pg.wait_for_selector('#prob-1-1')
    pg.click('#ss-open')
    check('session: Math picks by lesson, without levels', pg.locator('#ssetup .ss-chips[data-k="units"] .chip').count() == pg.locator('#view-practice .punit').count()
          and pg.locator('#ssetup .ss-chips[data-k="tiers"]').count() == 0 and pg.locator('#ss-go').inner_text() == 'Start · 10 problems')
    pg.click('#ss-go')
    check('session: a Math session runs the same way', len(shown()) == 1 and 'Problem 1 of 10' in pg.locator('#sbar .s-count').inner_text()
          and pg.locator('#sbar .s-where').inner_text().startswith('Day '))
    check('session: no page errors', not errors, errors[:3])
    ctx.close()

    # ---- the night-before sheet: from Exams, Formulas and the home page; prints without its buttons ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.goto(BASE + '/physics/midterm/#exams')
    pg.wait_for_selector('#view-exams .night-link')
    pg.click('#view-exams .night-link')
    pg.wait_for_selector('#view-night .nsec')
    check('night: the Physics sheet has the habits, Chapters 1–8 and the values to know, with no tab of its own',
          pg.locator('#view-night').is_visible() and pg.locator('#view-night .nsec').count() == 10 and pg.locator('.tab').count() == 5
          and pg.locator('.tab[aria-selected="true"]').count() == 0 and pg.url.endswith('#night'))
    phys_core = pg.locator('#view-night .nrow').count()
    check('night: only the core (★★★) formulas, with each chapter\'s Watch out list', 40 <= phys_core <= 90 and pg.locator('#view-night .watch').count() == 8, phys_core)
    pg.click('#view-night [data-night-back]')
    check('night: Back goes to the tab it came from', pg.locator('#view-exams').is_visible() and pg.locator('#tab-exams[aria-selected="true"]').count() == 1)
    pg.goto(BASE + '/physics/midterm/#night')
    pg.wait_for_selector('#view-night .nsec')
    pg.emulate_media(media='print')
    check('night: it prints without its buttons and the bars', pg.locator('#view-night .night-tools').is_hidden() and pg.locator('.tabbar').is_hidden())
    pg.emulate_media(media='screen')
    pg.reload()
    pg.wait_for_selector('#view-night .nsec')
    pg.goto(BASE + '/physics/midterm/')
    pg.wait_for_selector('#view-exams .up-item')
    check('night: it is never the tab a page opens on next time: the last tab (Exams) opens', pg.locator('#view-night').is_hidden() and pg.locator('#view-exams').is_visible())
    for page, n in [('math/derivatives', 8), ('math/integrals', 5)]:
        pg.goto(BASE + f'/{page}/#formulas')
        pg.wait_for_selector('#view-formulas .night-link')
        pg.click('#view-formulas .night-link')
        pg.wait_for_selector('#view-night .nsec')
        check(f'night: {page}: the habits, each lesson on the midterm and the values to know', pg.locator('#view-night .nsec').count() == n
              and pg.locator('#view-night .nrow').count() > 20 and overflow(pg) <= 0, (pg.locator('#view-night .nsec').count(), pg.locator('#view-night .nrow').count()))
    ctx.close()

    # ---- phones: a slimmer band, its intro one line until tapped; the calculator a slim tab on its edge at rest ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.goto(BASE + '/physics/midterm/#summary')
    pg.wait_for_selector('.calc-fab')
    pg.wait_for_timeout(500)
    band_h = pg.evaluate("Math.round(document.querySelector('#view-summary .band').getBoundingClientRect().height)")
    lede = pg.locator('#view-summary .band-lede')
    line = pg.evaluate("parseFloat(getComputedStyle(document.querySelector('#view-summary .band-lede')).lineHeight)")
    check('phone: the band is slim and its intro one line', band_h <= 130 and lede.bounding_box()['height'] <= line + 1, (band_h, lede.bounding_box()['height'], line))
    lede.click()
    check('phone: a tap shows the whole intro', lede.bounding_box()['height'] > line * 1.5)
    fab = pg.evaluate("(() => { const r = document.querySelector('.calc-fab').getBoundingClientRect(), i = document.querySelector('.calc-fab svg').getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(i.left), Math.round(i.right)]; })()")
    check('phone: at rest the calculator is a 22 px tab on the left edge with its icon whole', fab[0] < 0 and fab[1] == 22 and fab[2] >= 0 and fab[3] <= 22, fab)
    ctx.close()

    # ---- the home page: progress and "Pick up where you left off" from the exam pages ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
    ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg = ctx.new_page()
    pg.goto(BASE + '/physics/midterm/#practice')
    pg.wait_for_selector('#prob-1-1')
    for pid, mark in [('1-1', 'got'), ('1-2', 'got'), ('2-1', 'review')]:
        c = pg.locator(f'#prob-{pid}')
        c.locator('details.sol > summary').click()
        c.locator(f'.mbtn[data-mark="{mark}"]').click()
    pg.evaluate("document.getElementById('prob-4-7').scrollIntoView()")
    pg.wait_for_timeout(1000)
    pg.goto(BASE + '/')
    pg.wait_for_selector('#news li')
    phys = pg.locator('#next-exam.physics, #up-list .up-item.physics')
    check('home: the Physics midterm shows its Practice progress', '2 of 103 got it' in phys.inner_text() and '1 to review' in phys.inner_text(), phys.inner_text())
    check('home: "Pick up where you left off" names the page, tab and problem', pg.locator('#resume').is_visible()
          and pg.locator('#resume-where').inner_text().startswith('Physics midterm · Practice · Chapter 4 · Q.7'), pg.locator('#resume-where').inner_text())
    pg.click('#resume')
    pg.wait_for_timeout(1800)
    top = pg.evaluate("Math.round(document.getElementById('prob-4-7').getBoundingClientRect().top - parseFloat(getComputedStyle(document.getElementById('prob-4-7')).scrollMarginTop))")
    check('home: it opens that page at that problem', pg.url.endswith('/physics/midterm/#practice') and abs(top) <= 8, (pg.url, top))
    ctx.close()

    # ---- search results write formulas the way they look: Δx, v₀, x², lim(h → 0) ----
    idx = lambda page: json.loads(re.search(r'<script type="application/json" id="search-index">(.*?)</script>', open(os.path.join(REPO, page), encoding='utf-8').read(), re.S).group(1))
    phys_p = ' '.join(e['p'] for e in idx('physics/midterm/index.html'))
    math_p = ' '.join(e['p'] for e in idx('math/derivatives/index.html'))
    check('search: Physics results show Δx, v₀ and x², not TeX', all(t in phys_p for t in ['Δx', 'v₀', 'x²', 'μ']) and '\\' not in phys_p and '^(2)' not in phys_p)
    check('search: Math results show lim(h → 0) and xⁿ⁻¹', 'lim(h → 0)' in math_p and 'xⁿ⁻¹' in math_p and '\\' not in math_p)

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
    # the same two printouts for a Physics practice set
    pg.goto(BASE + '/physics/midterm/#quizzes')
    pg.wait_for_selector('#pa .print-btn')
    pg.evaluate('window.__printed = []')
    pg.locator('#pa .print-btn[data-print="paper"]').click()
    pg.emulate_media(media='print')
    check('print: a Physics practice set prints on its own', pg.evaluate('window.__printed') == ['paper']
          and shown('.appbar, .tabbar, #pb, #pc, #ex, .band') == 0 and shown('#pa .prq') == 11 and shown('#pa svg.pfig') >= 8)
    check('print: the Physics paper has no answers, timer or buttons', shown('#pa .reveal, #pa .timer, #pa .sheet-tools') == 0)
    pg.emulate_media(media='screen')
    pg.evaluate("window.dispatchEvent(new Event('afterprint'))")
    pg.mouse.click(5, 300)
    pg.locator('#pa .print-btn[data-print="key"]').click()
    pg.emulate_media(media='print')
    check('print: a Physics set with answers opens every answer, with all its steps', pg.locator('#pa details.sol[open]').count() == 11
          and shown('#pa .answer') == 11 and shown('#pa .step-hidden') == pg.locator('#pa .step-hidden').count() and shown('#pa summary') == 0)
    pg.emulate_media(media='screen')
    pg.evaluate("window.dispatchEvent(new Event('afterprint'))")
    pg.mouse.click(5, 300)
    check('print: afterwards the Physics answers close again', pg.locator('#pa details.sol[open]').count() == 0)
    # and a Physics mock midterm, with its score line
    pg.goto(BASE + '/physics/midterm/#exams')
    pg.wait_for_selector('#pm1 .print-btn')
    pg.evaluate('window.__printed = []')
    pg.locator('#pm1 .print-btn[data-print="paper"]').click()
    pg.emulate_media(media='print')
    check('print: a Physics mock prints on its own, with a score line and no answers', pg.evaluate('window.__printed') == ['paper']
          and shown('.appbar, .tabbar, #pm2, #pm3, #ex-upcoming, .band') == 0 and shown('#pm1 .rq') == 6
          and shown('#pm1 .print-score') == 1 and shown('#pm1 .reveal, #pm1 .timer, #pm1 .scorebar') == 0)
    pg.emulate_media(media='screen')
    pg.evaluate("window.dispatchEvent(new Event('afterprint'))")
    pg.mouse.click(5, 300)
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
        pg.evaluate("document.querySelectorAll('details').forEach((d) => { d.open = true; })")
        pg.wait_for_timeout(300)  # answers opened from code are built on 'toggle'
        pg.evaluate("""() => {
          document.querySelectorAll('.sheet[hidden], .steps [hidden]').forEach((e) => { e.hidden = false; });
          document.querySelectorAll('.step-hidden').forEach((e) => e.classList.remove('step-hidden'));
        }""")
        wide[v] = overflow(pg)
    check('narrow phone: every answer is built once opened', pg.locator('script.lazy-sol').count() == 0
          and pg.locator('details.sol').count() == pg.locator('details.sol .answer').count(), pg.locator('script.lazy-sol').count())
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
    hero = pg.locator('#next-exam').inner_text()
    texts = pg.locator('#up-list .up-item').all_inner_texts()
    check('countdown: the next exam is the soonest (Tomorrow), then in 3 days and in 10 days', 'Tomorrow' in hero and 'Calculus midterm 2' in hero
          and 'in 3 days' in texts[0] and 'in 10 days' in texts[1], (hero, texts))
    check('countdown: time shown with the date', '10:40' in texts[0], texts[0])
    check('countdown: past exam says Done, under Other exams', 'Done' in pg.locator('#later-list').inner_text())
    check('countdown: exams within a week are highlighted', pg.locator('#next-exam.soon').count() == 1 and pg.locator('#up-list .up-item.soon').count() == 1)
    pg.screenshot(path=f'{SHOTS}/home-countdowns.png', full_page=True)
    pg.goto(BASE2 + '/math/')
    pg.wait_for_selector('.exams')
    lefts = pg.locator('.exam .e-left').all_inner_texts()
    check('countdown: the picker counts down to each exam: in 3 days, Tomorrow, Done', lefts == ['in 3 days', 'Tomorrow', 'Done']
          and pg.locator('.e-when.soon').count() == 2 and pg.locator('.e-when.past').count() == 1, lefts)
    pg.screenshot(path=f'{SHOTS}/picker-countdowns.png', full_page=True)
    pg.goto(BASE2 + '/physics/')
    pg.wait_for_selector('.exams')
    lefts = pg.locator('.exam .e-left').all_inner_texts()
    check('countdown: the Physics picker counts down to the midterm', lefts[0] == 'in 10 days' and 'Date to be announced' in pg.locator('#exam-final').inner_text(), lefts)
    pg.goto(BASE2 + '/physics/midterm/#exams')
    pg.wait_for_selector('#view-exams .up-item')
    pg.wait_for_timeout(200)
    lefts = pg.locator('#view-exams .up-left').all_inner_texts()
    check('countdown: the Physics Exams tab lists its two exams, the midterm first', lefts == ['in 10 days', ''], lefts)
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
      const want = ['./', './math/', './math/derivatives/', './math/integrals/', './physics/', './physics/midterm/', 'site.json', 'src/shared/totop.css',
        'src/shared/totop.js', 'math/assets/math.css', 'math/assets/math.js', 'physics/assets/physics.css', 'physics/assets/physics.js',
        'math/assets/fonts/KaTeX_Main-Regular.woff2'].map((u) => new URL(u, location.href).href);
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
    # Calculus midterm 2 was never opened online here either
    pg.goto(BASE + '/math/integrals/')
    pg.wait_for_selector('#view-summary .unit')
    check('offline: Calculus midterm 2 opens with no network, styled', pg.locator('#su-u1 .ideas li').count() >= 8
          and pg.evaluate("getComputedStyle(document.querySelector('.appbar')).position") == 'sticky')
    # the Physics midterm was never opened online either
    pg.goto(BASE + '/physics/midterm/')
    pg.wait_for_selector('#view-summary .wex')
    pg.wait_for_timeout(300)
    check('offline: the Physics midterm opens with no network, styled, with its script and math fonts', pg.locator('#view-summary .wex').count() == 36
          and pg.evaluate("getComputedStyle(document.querySelector('.appbar')).position") == 'sticky'
          and pg.evaluate("document.fonts.check('16px KaTeX_Main')") and pg.locator('.calc-fab').count() == 1)
    pg.click('#tab-quizzes')
    pg.wait_for_selector('#pa .prq')
    check('offline: its Quizzes tab builds too', pg.locator('#sets .prq').count() == 33)
    pg.goto(BASE + '/physics/')
    pg.wait_for_selector('.exams')
    check('offline: the Physics picker opens with no network', pg.locator('.exam').count() == 2)
    pg.goto(BASE + '/')
    pg.wait_for_selector('#news li', timeout=5000)
    check('offline: the home page opens with its exam list and news', pg.locator('#next-exam').count() == 1
          and 1 + pg.locator('#up-list .up-item').count() + pg.locator('#later-list .up-item').count() == 7)
    check('offline: the home page keeps its back-to-top button', pg.evaluate("(() => { const b = document.querySelector('.totop'); return Boolean(b) && getComputedStyle(b).position === 'fixed'; })()"))
    ctx.set_offline(False)
    ctx.close()

    # The status-bar strip: iOS and iPadOS 26+ blur the page under the Home Screen app's status bar unless a fixed,
    # full-width box more than 10 px tall sits at the top edge. Every page starts with one (.sb-edge) that paints nothing
    # and has the colour of the bar at the top: the app bar's, or on wide exam pages the tab bar's once that has stuck.
    EDGE = """(() => { const e = document.body.firstElementChild, c = getComputedStyle(e), r = e.getBoundingClientRect();
      return { cls: e.className, pos: c.position, top: r.top, w: r.width, vw: document.documentElement.clientWidth, h: r.height,
        z: c.zIndex, pe: c.pointerEvents, bg: c.backgroundColor, clip: c.backgroundClip || c.webkitBackgroundClip }; })()"""
    bg_of = "s => getComputedStyle(document.querySelector(s)).backgroundColor"
    for label, vp in (('iPad', {'width': 1180, 'height': 820}), ('phone', {'width': 390, 'height': 844})):
        ctx = b.new_context(viewport=vp)
        ctx.route(STUB, lambda r: r.fulfill(status=200, body='', content_type='text/css'))
        pg = ctx.new_page()
        for path in ('/', '/404.html', '/math/', '/physics/', '/math/derivatives/', '/math/integrals/', '/physics/midterm/'):
            pg.goto(BASE + path)
            pg.wait_for_load_state('load')
            e = pg.evaluate(EDGE)
            check(f'{label} {path}: starts with the status-bar strip: fixed, full width, 12 px, topmost, tap-through, a colour that paints nothing',
                  e['cls'] == 'sb-edge' and e['pos'] == 'fixed' and e['top'] == 0 and abs(e['w'] - e['vw']) < 1 and e['h'] == 12
                  and e['z'] == '2147483647' and e['pe'] == 'none' and e['bg'].startswith('rgb(') and e['clip'] == 'text', e)
            if path.count('/') == 3:  # an exam page
                pg.evaluate("window.scrollTo(0, 300)")
                pg.wait_for_timeout(250)
                area = {'x': 0, 'y': 0, 'width': vp['width'], 'height': 30}
                shown = pg.screenshot(clip=area, animations='disabled')
                pg.evaluate("document.querySelector('.sb-edge').style.display = 'none'")
                gone = pg.screenshot(clip=area, animations='disabled')
                pg.evaluate("document.querySelector('.sb-edge').style.display = ''")
                check(f'{label} {path}: the strip changes nothing on screen', shown == gone)
                pg.evaluate("window.scrollTo(0, 900)")
                pg.wait_for_timeout(250)
                bar = '.tabbar' if label == 'iPad' else '.appbar'
                check(f'{label} {path}: scrolled, the strip has the colour of the bar at the top ({bar[1:]})', pg.evaluate(EDGE)['bg'] == pg.evaluate(bg_of, bar))
                pg.evaluate("window.scrollTo(0, 0)")
                pg.wait_for_timeout(250)
                check(f'{label} {path}: at the top it has the app bar colour', pg.evaluate(EDGE)['bg'] == pg.evaluate(bg_of, '.appbar'))
        ctx.close()
    b.close()
srv.shutdown()
srv2.shutdown()
shutil.rmtree(SITE if '--shots' in sys.argv else SCRATCH, ignore_errors=True)
print(f'\n{len(fails)} failed' if fails else '\nall feature checks passed')
sys.exit(1 if fails else 0)
