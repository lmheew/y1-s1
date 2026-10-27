"""Numeric checks for every follow-up quiz answer."""
import math, sys
from math import sin, cos, tan, exp, log, sqrt, pi, asin, acos

fails = []
def check(name, got, want, tol=1e-6):
    ok = abs(got - want) <= tol * max(1.0, abs(want))
    print(f"{'PASS' if ok else 'FAIL'}  {name}: {got:.10g} vs {want:.10g}")
    if not ok: fails.append(name)
def check_true(name, cond, detail=""):
    print(f"{'PASS' if cond else 'FAIL'}  {name} {detail}")
    if not cond: fails.append(name)
def d1(f, x, h=1e-6): return (f(x + h) - f(x - h)) / (2 * h)
def d2(f, x, h=1e-4): return (f(x + h) - 2 * f(x) + f(x - h)) / h ** 2
def d3(f, x, h=1e-3): return (f(x + 2*h) - 2*f(x + h) + 2*f(x - h) - f(x - 2*h)) / (2 * h ** 3)
def real_roots_y(F, x0, lo=-20, hi=20, step=1e-3):
    return sorted({round(k * step, 3) for k in range(int(lo / step), int(hi / step) + 1) if abs(F(x0, k * step)) < 1e-9})
def inv(f, yv, lo=-10, hi=10):
    for _ in range(200):
        m = (lo + hi) / 2
        lo, hi = (m, hi) if f(m) < yv else (lo, m)
    return (lo + hi) / 2

# ----- 01-A -----
check("01A Q1(1)", 4 * 4 - 3 * (-2) + 1, 23)
check("01A Q1(2)", cos(pi / 2) * sin(3 * pi / 2), 0)
check("01A Q1(3)", 5 * exp(1 - 1), 5)
check("01A Q1(4)", (0 - 1) * log(0 + math.e), -1)
f = lambda x: (x + 1) / (x * x - 1)
check("01A Q2 left", f(-1 - 1e-7), -0.5, 1e-5); check("01A Q2 right", f(-1 + 1e-7), -0.5, 1e-5)
# ----- 01-B -----
check("01B Q1(1)", (4 - 4) * (2 + 3), 0)
check("01B Q1(2)", sin(pi / 2) + cos(pi / 4) * sin(pi / 4), 1.5)
check("01B Q1(3)", exp(1 - 1) * log(1), 0)
check("01B Q1(4)", asin(0.5) + acos(0.5), pi / 2)
f = lambda x: (x * x - 2 * x) / abs(x - 2)
check("01B Q2 left", f(2 - 1e-7), -2, 1e-5); check("01B Q2 right", f(2 + 1e-7), 2, 1e-5)
# ----- 02-A -----
check("02A Q1(1)", d1(lambda x: x**3 - 2*x**2 + x, 2), 5)
check("02A Q1(2)", d1(lambda x: x**3 + 2*exp(x), 0), 2)
check("02A Q2(1)", d1(lambda t: exp(t) * sin(t), pi / 2), exp(pi / 2))
check("02A Q2(2)", d1(lambda t: t * log(t), math.e), 2)
check("02A Q3(1)", d1(lambda x: sqrt(4 + sin(x)), 0), 0.25)
check("02A Q3(2)", d1(lambda x: exp(1 / x), 1), -math.e)
# ----- 02-B -----
check("02B Q1(1)", d1(lambda x: x**-2 + 2*sqrt(x), 1), -1)
check("02B Q1(2)", d1(lambda x: 2**x + x*x, 0), log(2))
check("02B Q2(1)", d1(lambda t: t * cos(t), pi), -1)
check("02B Q2(2)", d1(lambda t: exp(t) * log(t), 1), math.e)
check("02B Q3(1)", d1(lambda x: (sin(x) + cos(x))**3, 0), 3)
check("02B Q3(2)", d1(lambda x: log(cos(x)), pi / 3), -sqrt(3))
# ----- 03-A -----
check("03A Q1(1)", d1(lambda x: 1 / tan(x), pi / 6), -4)
check("03A Q1(2)", d1(lambda y: (exp(y) + 1) / 2, 0), 0.5)
check("03A Q1(2) via f", 1 / d1(lambda x: log(2*x - 1), 1), 0.5)
F = lambda x, y: y**3 + 2*x*y*y + x + y + 1
check_true("03A Q2(1) roots at x=-1", real_roots_y(F, -1) == [0.0, 1.0], str(real_roots_y(F, -1)))
Fx = lambda x, y: (F(x + 1e-6, y) - F(x - 1e-6, y)) / 2e-6
Fy = lambda x, y: (F(x, y + 1e-6) - F(x, y - 1e-6)) / 2e-6
check("03A Q2(2) slope (-1,0)", -Fx(-1, 0) / Fy(-1, 0), -1)
check("03A Q2(2) F_y(-1,1)=0", Fy(-1, 1), 0, 1e-5); check("03A Q2(2) F_x(-1,1)=3", Fx(-1, 1), 3, 1e-5)
xt = lambda t: log(t); yt = lambda t: t * sin(2*t)
check("03A Q3(1)", d1(yt, pi/4) / d1(xt, pi/4), pi / 4)
dydx = lambda t: t*sin(2*t) + 2*t*t*cos(2*t)
check("03A dy/dx formula", d1(yt, 0.7) / d1(xt, 0.7), dydx(0.7))
check("03A Q3(2)", d1(dydx, pi/2) / (1 / (pi/2)), -3*pi*pi/2)
# ----- 03-B -----
check("03B Q1(1)", d1(lambda x: 1 / cos(x)**2, -pi / 4), -4)
fq = lambda x: x**5 + x**3 + x
check("03B Q1(2) f(1)=3", fq(1), 3)
check("03B Q1(2)", d1(lambda yv: inv(fq, yv), 3, 1e-5), 1 / 9, 1e-5)
G = lambda x, y: y*y + x*y + x**3 - 7
check_true("03B Q2(1) roots at x=1", real_roots_y(G, 1) == [-3.0, 2.0], str(real_roots_y(G, 1)))
Gx = lambda x, y: (G(x + 1e-6, y) - G(x - 1e-6, y)) / 2e-6
Gy = lambda x, y: (G(x, y + 1e-6) - G(x, y - 1e-6)) / 2e-6
check("03B Q2(2) slope (1,2)", -Gx(1, 2) / Gy(1, 2), -1)
check("03B Q2(2) slope (1,-3)", -Gx(1, -3) / Gy(1, -3), 0, 1e-5)
xt = lambda t: t*t; yt = lambda t: t**3 - 3*t
check("03B Q3(1)", d1(yt, 2) / d1(xt, 2), 9 / 4)
dydx = lambda t: d1(yt, t) / d1(xt, t)
check("03B Q3(2)", d1(dydx, 1.0, 1e-5) / d1(xt, 1.0), 1.5, 1e-5)
check("03B Q3 trap value", d2(yt, 1) / d2(xt, 1), 3, 1e-4)
# ----- 04-A -----
f = lambda x: 2*x**3 + 3*x*x - 12*x + 1
check("04A crit -2", d1(f, -2), 0); check("04A crit 1", d1(f, 1), 0)
check("04A f''(-2)", d2(f, -2), -18, 1e-4); check("04A f''(1)", d2(f, 1), 18, 1e-4)
check("04A max", f(-2), 21); check("04A min", f(1), -6)
g = lambda x: log(x*x + 2*x + 3)
grid = [-2 + 3*i/300000 for i in range(300001)]; vals = [g(x) for x in grid]
check("04A Q2 max", max(vals), log(6)); check("04A Q2 min", min(vals), log(2))
check("04A Q2 argmin", grid[vals.index(min(vals))], -1, 1e-4)
# ----- 04-B -----
f = lambda x: x**4 - 2*x*x + 3
for c in (-1, 0, 1): check(f"04B crit {c}", d1(f, c), 0)
check("04B f''(1)", d2(f, 1), 8, 1e-4); check("04B f''(-1)", d2(f, -1), 8, 1e-4); check("04B f''(0)", d2(f, 0), -4, 1e-4)
check("04B max", f(0), 3); check("04B min", f(1), 2); check("04B min2", f(-1), 2)
g = lambda x: x**4 - 4*x**3
grid = [-1 + 5*i/500000 for i in range(500001)]; vals = [g(x) for x in grid]
check("04B Q2 max", max(vals), 5); check("04B Q2 min", min(vals), -27)
check("04B Q2 argmax", grid[vals.index(max(vals))], -1, 1e-6); check("04B Q2 argmin", grid[vals.index(min(vals))], 3, 1e-4)
check_true("04B x=0 no sign change", d1(g, -0.1) < 0 and d1(g, 0.1) < 0)
# ----- 05-A -----
for N in (0, 1, 4, 10):
    check(f"05A s_{N}", sum(2 * 0.25**n for n in range(N + 1)), (8/3) * (1 - 0.25**(N + 1)))
check("05A sum", sum(2 * 0.25**n for n in range(200)), 8 / 3)
f = lambda x: x**5 + 3*x - 3
check("05A x2", 1 - f(1) / d1(f, 1), 7 / 8)
f = lambda x: cos(x)**2 - sin(x)**2; a = pi / 6
check("05A c0", f(a), 0.5); check("05A c1", d1(f, a), -sqrt(3))
check("05A c2", d2(f, a) / 2, -1, 1e-5); check("05A c3", d3(f, a) / 6, 2*sqrt(3)/3, 1e-4)
# ----- 05-B -----
for N in (1, 2, 3, 8):
    check(f"05B s_{N}", sum((-0.5)**n for n in range(1, N + 1)), -(1/3) * (1 - (-0.5)**N))
check("05B sum", sum((-0.5)**n for n in range(1, 200)), -1 / 3)
f = lambda x: 2*x**3 + x - 4
check("05B x2", 1 - f(1) / d1(f, 1), 8 / 7)
check_true("05B root in D", f(1) < 0 < f(2))
f = lambda x: 2*cos(x)**2 - 1; a = pi / 4
check("05B c0", f(a), 0); check("05B c1", d1(f, a), -2)
check("05B c2", d2(f, a) / 2, 0, 1e-5); check("05B c3", d3(f, a) / 6, 4/3, 1e-4)
print("\nFAILED:" if fails else "\nALL FOLLOW-UP CHECKS PASSED", fails if fails else "")
sys.exit(1 if fails else 0)
