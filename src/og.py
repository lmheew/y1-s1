"""Draws the link-preview images (Open Graph, 1200 x 630) that LINE, Discord and other apps show when a page's link
is shared: og-home.png for the home page and og-math.png for the Math page, both in the repository root.

    python3 src/og.py

Needs Python Playwright with Chromium, Pillow, and the Noto Sans CJK JP (or Noto Sans JP) font. Run it again when a
card's text should change (a new subject, say); the pages point at the images in their <head>. Unofficial notes:
the cards use the site's own badge, never the KUAS logo."""
import io, os
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BADGE = ('<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#3D8A4D"/>'
         '<path d="M6 24Q16 -6 26 24" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/>'
         '<path d="M5.5 21L16.5 4.5" fill="none" stroke="#9CC34C" stroke-width="2.2" stroke-linecap="round"/>'
         '<circle cx="11" cy="12.75" r="2.4" fill="#9CC34C"/></svg>')

# a faint graph in the corner, the badge's idea drawn large: the bump y = 300 - 250 exp(-((x - 250) / 95)^2) (SVG y grows
# downwards), its true tangent line at x = 185 and that point, over a light grid
import math
f = lambda x: 300 - 250 * math.exp(-((x - 250) / 95) ** 2)
df = lambda x: 250 * math.exp(-((x - 250) / 95) ** 2) * 2 * ((x - 250) / 95) / 95
X0 = 185
CURVE = ' '.join(f'{x:.1f},{f(x):.1f}' for x in [20 + i * 390 / 80 for i in range(81)])
T = lambda x: f(X0) + df(X0) * (x - X0)
GRAPH = ('<svg class="graph" viewBox="0 0 420 330" aria-hidden="true">'
         + ''.join(f'<path d="M{x} 0V330" class="grid"/>' for x in range(0, 421, 42))
         + ''.join(f'<path d="M0 {y}H420" class="grid"/>' for y in range(0, 331, 42))
         + f'<polyline points="{CURVE}" class="curve"/>'
         + f'<path d="M{X0 - 70} {T(X0 - 70):.1f} L {X0 + 62} {T(X0 + 62):.1f}" class="tangent"/>'
         + f'<circle cx="{X0}" cy="{f(X0):.1f}" r="11" class="dot"/></svg>')

CSS = """
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; }
body { position: relative; overflow: hidden; background: #FFFFFF; color: #17201A;
  font-family: "Noto Sans CJK JP", "Noto Sans JP", "Hiragino Sans", sans-serif; }
.band { position: absolute; inset: 0 0 auto 0; height: 470px; background: #DEE6DD; border-bottom: 10px solid #3D8A4D; }
.graph { position: absolute; right: 40px; top: 70px; width: 420px; height: 330px; }
.grid { stroke: #C9D6C8; stroke-width: 1.5; }
.curve { fill: none; stroke: #3D8A4D; stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; opacity: .55; }
.tangent { stroke: #9CC34C; stroke-width: 7; stroke-linecap: round; }
.dot { fill: #9CC34C; }
.main { position: absolute; left: 72px; top: 64px; width: 720px; }
.brand { display: flex; align-items: center; gap: 24px; }
.brand svg { width: 104px; height: 104px; flex: none; }
.title { font-size: 76px; font-weight: 900; line-height: 1.05; letter-spacing: .005em; }
.kicker { margin-top: 8px; font-size: 30px; font-weight: 700; color: #2F7340; }
.lede { margin-top: 34px; font-size: 32px; line-height: 1.45; color: #3B463E; text-wrap: balance; }
.pills { position: absolute; left: 72px; top: 382px; display: flex; gap: 14px; }
.pill { padding: 8px 22px; border-radius: 999px; background: #FFFFFF; color: #2F7340; font-size: 24px; font-weight: 700;
  box-shadow: inset 0 0 0 2.5px #3D8A4D; }
.pill.on { background: #377E46; color: #FFFFFF; box-shadow: none; }
.pill.soon { color: #1F4B8F; box-shadow: inset 0 0 0 2.5px #1F4B8F; background: #FFFFFF; }
.foot { position: absolute; left: 72px; right: 72px; bottom: 50px; display: flex; justify-content: space-between; align-items: baseline;
  font-size: 26px; color: #545C55; }
.foot b { color: #2F7340; font-weight: 700; }
"""

CARDS = {
    'og-math.png': dict(
        title='CLA1 Review', kicker='Calculus &amp; Linear Algebra 1',
        lede='Key ideas, worked solutions, formulas, quizzes and mock midterms.',
        pills='<span class="pill on">Summary</span><span class="pill">Practice</span><span class="pill">Formulas</span>'
              '<span class="pill">Quizzes</span><span class="pill">Exams</span>'),
    'og-home.png': dict(
        title='Study Notes', kicker='Year 1 · Semester 1',
        lede='Notes, worked solutions and mock exams for first-year engineering courses.',
        pills='<span class="pill on">Calculus &amp; Linear Algebra 1</span><span class="pill soon">Engineering Physics 1 · soon</span>'),
}


def page(c):
    return (f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>'
            f'<div class="band"></div>{GRAPH}'
            f'<div class="main"><div class="brand">{BADGE}<div><div class="title">{c["title"]}</div><div class="kicker">{c["kicker"]}</div></div></div>'
            f'<p class="lede">{c["lede"]}</p></div>'
            f'<div class="pills">{c["pills"]}</div>'
            f'<div class="foot"><span><b>Unofficial study notes</b> · works offline</span><span>lmheew.github.io/y1-s1</span></div>'
            '</body></html>')


with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
    for name, card in CARDS.items():
        pg.set_content(page(card))
        pg.wait_for_timeout(200)
        png = pg.screenshot(type='png')
        img = Image.open(io.BytesIO(png)).convert('RGB')
        # flat colours: a 128-colour palette keeps the text crisp at a fraction of the size
        img = img.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        out = os.path.join(ROOT, name)
        img.save(out, optimize=True)
        print('wrote', name, f'{os.path.getsize(out) // 1024} KB')
    b.close()
