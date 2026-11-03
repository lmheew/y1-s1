"""Draws the link-preview images (Open Graph, 1200 x 630) that LINE, Discord and other apps show when a page's link
is shared, all in the repository root: og-home.png for the home page, og-math.png for the Math exam picker (math/),
og-math-derivatives.png for the Calculus midterm 1 page (math/derivatives/), og-math-integrals.png for the Calculus
midterm 2 page (math/integrals/, with a Riemann sum in place of the tangent), og-physics.png for the Physics exam picker
(physics/) and og-physics-midterm.png for the Physics midterm page (physics/midterm/). Physics cards are drawn in the
Physics blue, with its pendulum badge and a projectile in place of the curve and its tangent.

    python3 src/og.py                  # all of them
    python3 src/og.py og-math.png      # only the ones named

Needs Python Playwright with Chromium, Pillow, and the Noto Sans CJK JP (or Noto Sans JP) font. Run it again when a
card's text should change (a new subject, say); the pages point at the images in their <head>. Unofficial notes:
the cards use the site's own badge, never the KUAS logo."""
import io, os, sys
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BADGE = ('<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#3D8A4D"/>'
         '<path d="M6 24Q16 -6 26 24" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/>'
         '<path d="M5.5 21L16.5 4.5" fill="none" stroke="#9CC34C" stroke-width="2.2" stroke-linecap="round"/>'
         '<circle cx="11" cy="12.75" r="2.4" fill="#9CC34C"/></svg>')
# the Physics badge: a pendulum (as in src/shared/icons.mjs)
BADGE_PHYS = ('<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#1F4B8F"/>'
              '<path d="M8.5 6.5h15" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>'
              '<path d="M16 6.5L21.2 19.2" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>'
              '<path d="M9 20.5Q16 27 23 20.5" fill="none" stroke="#8FB4EC" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1.6 2.6"/>'
              '<circle cx="21.9" cy="21" r="3.3" fill="#8FB4EC"/></svg>')

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

# Calculus midterm 2: the same bump, with the rectangles of a Riemann sum (right ends) under it, over the grid
RECTS = ''.join(f'<rect x="{x0}" y="{f(x0 + 40):.1f}" width="40" height="{300 - f(x0 + 40):.1f}" class="strip"/>' for x0 in range(60, 380, 40))
GRAPH_INT = ('<svg class="graph" viewBox="0 0 420 330" aria-hidden="true">'
             + ''.join(f'<path d="M{x} 0V330" class="grid"/>' for x in range(0, 421, 42))
             + ''.join(f'<path d="M0 {y}H420" class="grid"/>' for y in range(0, 331, 42))
             + RECTS + '<path d="M20 300H410" class="baseline"/>'
             + f'<polyline points="{CURVE}" class="curve"/></svg>')

# Physics: a projectile's parabola from the ground, its launch velocity and the ball part way along, over the grid
PX = lambda t: 40 + 340 * t
PY = lambda t: 300 - 4 * 235 * t * (1 - t)
PATH = ' '.join(f'{PX(i / 80):.1f},{PY(i / 80):.1f}' for i in range(81))
TB = 0.3  # where the ball is drawn
# the launch velocity, along the path's tangent at the start: direction (dx/dt, dy/dt) at t = 0, with a two-stroke head
_dx, _dy = 340, -4 * 235
_n = math.hypot(_dx, _dy)
_ux, _uy = _dx / _n, _dy / _n
_tip = (PX(0) + 120 * _ux, PY(0) + 120 * _uy)
_wing = lambda a: (_tip[0] - 20 * (_ux * math.cos(a) - _uy * math.sin(a)), _tip[1] - 20 * (_ux * math.sin(a) + _uy * math.cos(a)))
ARROW = (f'<path d="M{PX(0):.1f} {PY(0):.1f}L{_tip[0]:.1f} {_tip[1]:.1f}" class="tangent"/>'
         f'<path d="M{_wing(0.5)[0]:.1f} {_wing(0.5)[1]:.1f}L{_tip[0]:.1f} {_tip[1]:.1f}L{_wing(-0.5)[0]:.1f} {_wing(-0.5)[1]:.1f}" class="tangent head"/>')
GRAPH_PHYS = ('<svg class="graph" viewBox="0 0 420 330" aria-hidden="true">'
              + ''.join(f'<path d="M{x} 0V330" class="grid"/>' for x in range(0, 421, 42))
              + ''.join(f'<path d="M0 {y}H420" class="grid"/>' for y in range(0, 331, 42))
              + '<path d="M10 300H410" class="ground"/>'
              + f'<polyline points="{PATH}" class="curve"/>'
              + ARROW
              + f'<circle cx="{PX(TB):.1f}" cy="{PY(TB):.1f}" r="13" class="dot"/></svg>')

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
.pill.later { color: #545C55; box-shadow: none; border: 2.5px dashed #3D8A4D; padding: 5.5px 19.5px; }
.ground { stroke: #9AA9C0; stroke-width: 4; stroke-linecap: round; }
.strip { fill: #9CC34C; fill-opacity: .5; stroke: #3D8A4D; stroke-width: 3; }
.baseline { stroke: #7E9A7F; stroke-width: 4; stroke-linecap: round; }
.head { fill: none; stroke-linejoin: round; }
/* Physics: the same card in the Physics blue */
body.phys .band { background: #DCE4F0; border-bottom-color: #1F4B8F; }
body.phys .grid { stroke: #C5D0E0; }
body.phys .curve { stroke: #1F4B8F; }
body.phys .tangent { stroke: #4F7EC2; }
body.phys .dot { fill: #8FB4EC; }
body.phys .kicker, body.phys .foot b { color: #1C437F; }
body.phys .pill { color: #1C437F; box-shadow: inset 0 0 0 2.5px #1F4B8F; }
body.phys .pill.on { background: #1F4B8F; color: #FFFFFF; box-shadow: none; }
body.phys .pill.later { color: #525B69; box-shadow: none; border-color: #1F4B8F; }
.foot { position: absolute; left: 72px; right: 72px; bottom: 50px; display: flex; justify-content: space-between; align-items: baseline;
  font-size: 26px; color: #545C55; }
.foot b { color: #2F7340; font-weight: 700; }
"""

CARDS = {
    'og-math.png': dict(
        title='CLA1 Review', kicker='Calculus &amp; Linear Algebra 1',
        lede='Review notes for each exam, with worked solutions and mock midterms.',
        pills='<span class="pill on">Midterm 1 · Derivatives</span><span class="pill on">Midterm 2 · Integrals</span>'
              '<span class="pill later">Linear Algebra · soon</span>'),
    'og-math-integrals.png': dict(
        graph='int', title='CLA1 Review', kicker='Calculus midterm 2 · Integrals',
        lede='Key ideas, worked solutions and formulas, added after each class.',
        pills='<span class="pill on">Summary</span><span class="pill">Practice</span><span class="pill">Formulas</span>'
              '<span class="pill later">Quizzes · soon</span><span class="pill later">Mocks · soon</span>'),
    'og-math-derivatives.png': dict(
        title='CLA1 Review', kicker='Calculus midterm 1 · Derivatives',
        lede='Key ideas, worked solutions, formulas, quizzes and mock midterms.',
        pills='<span class="pill on">Summary</span><span class="pill">Practice</span><span class="pill">Formulas</span>'
              '<span class="pill">Quizzes</span><span class="pill">Exams</span>'),
    'og-home.png': dict(
        title='Study Notes', kicker='Year 1 · Semester 1',
        lede='Notes, worked solutions and mock exams for first-year engineering courses.',
        pills='<span class="pill on">Calculus &amp; Linear Algebra 1</span><span class="pill soon">Engineering Physics 1</span>'),
    'og-physics.png': dict(
        phys=True, title='EP1 Review', kicker='Engineering Physics 1',
        lede='Review notes for each exam: summaries, practice problems, formulas and mock midterms.',
        pills='<span class="pill on">Midterm · Chapters 1–8</span><span class="pill later">Final · later</span>'),
    'og-physics-midterm.png': dict(
        phys=True, title='EP1 Review', kicker='Physics midterm · Chapters 1–8',
        lede='Summaries, practice problems, formulas, quizzes and mock midterms.',
        pills='<span class="pill on">Summary</span><span class="pill">Practice</span><span class="pill">Formulas</span>'
              '<span class="pill">Quizzes</span><span class="pill">Exams</span>'),
}


def page(c):
    phys = c.get('phys')
    return (f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body{" class=phys" if phys else ""}>'
            f'<div class="band"></div>{GRAPH_PHYS if phys else GRAPH_INT if c.get("graph") == "int" else GRAPH}'
            f'<div class="main"><div class="brand">{BADGE_PHYS if phys else BADGE}<div><div class="title">{c["title"]}</div><div class="kicker">{c["kicker"]}</div></div></div>'
            f'<p class="lede">{c["lede"]}</p></div>'
            f'<div class="pills">{c["pills"]}</div>'
            f'<div class="foot"><span><b>Unofficial study notes</b> · works offline</span><span>lmheew.github.io/y1-s1</span></div>'
            '</body></html>')


with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
    for name, card in CARDS.items():
        if sys.argv[1:] and name not in sys.argv[1:]:
            continue
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
