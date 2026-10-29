"""Numeric checks for every practice-problem answer.
Each check prints PASS/FAIL; the script exits non-zero if anything fails."""
import math, sys
from math import sin, cos, tan, exp, log, sqrt, pi, asin, acos, atan

fails = []
def check(name, got, want, tol=1e-6):
    ok = abs(got - want) <= tol * max(1.0, abs(want))
    print(f"{'PASS' if ok else 'FAIL'}  {name}: numeric={got:.10g}  claimed={want:.10g}")
    if not ok:
        fails.append(name)

def check_true(name, cond, detail=""):
    print(f"{'PASS' if cond else 'FAIL'}  {name} {detail}")
    if not cond:
        fails.append(name)

def d1(f, x, h=1e-6):
    return (f(x + h) - f(x - h)) / (2 * h)

def d2(f, x, h=1e-4):
    return (f(x + h) - 2 * f(x) + f(x - h)) / h**2

def d3(f, x, h=1e-3):
    return (f(x + 2*h) - 2*f(x + h) + 2*f(x - h) - f(x - 2*h)) / (2 * h**3)

cbrt = lambda x: math.copysign(abs(x) ** (1/3), x)

# ================= PRACTICE =================
# 1.1
check("P1.1a", 2*(-1)**3 - (-1)**2 + 5, 2)
check("P1.1b", cos(pi/4) * sin(2*pi/4), sqrt(2)/2)
check("P1.1c", 3*exp((-sqrt(3))**2 - 3), 3)
check("P1.1d", (0 - 2) * log(0 + 1), 0)
# 1.2
check("P1.2a", asin(-0.5), -pi/6)
check("P1.2b", acos(-sqrt(2)/2), 3*pi/4)
check("P1.2c", atan(sqrt(3)) - atan(1), pi/12)
# 1.3
f = lambda x: (x + 3) / (x**2 - 9)
check("P1.3a left", f(-3 - 1e-7), -1/6, 1e-5)
check("P1.3a right", f(-3 + 1e-7), -1/6, 1e-5)
check_true("P1.3c left -> -inf", f(3 - 1e-7) < -1e6)
check_true("P1.3c right -> +inf", f(3 + 1e-7) > 1e6)
# 1.4
k = 1/3
check("P1.4 left=right", k*2 + 3, 2**2 - k)
check("P1.4 common value", k*2 + 3, 11/3)
# 1.5
check("P1.5a", (sqrt(4 + 1e-7) - 2) / 1e-7, 0.25, 1e-5)
check("P1.5b", sin(5e-7) / 1e-7, 5, 1e-5)
check("P1.5c", (exp(2e-7) - 1) / 1e-7, 2, 1e-5)
# 2.1
check("P2.1a", d1(lambda x: x**5 - 3*x**3 + x, -1), -3)
check("P2.1b", d1(lambda x: exp(x) + log(x), 1), math.e + 1)
# 2.2
check("P2.2a", d1(lambda t: t**2 * cos(t), pi), -2*pi)
check("P2.2b", d1(lambda t: t**3 * log(t), math.e), 4*math.e**2)
# 2.3
check("P2.3a", d1(lambda x: sqrt(3 + cos(x)), pi/2), -sqrt(3)/6)
check("P2.3b", d1(lambda x: log(x**2 + 3), 1), 0.5)
# 2.4
check("P2.4a", d1(lambda x: log(sin(x)), pi/4), 1)
check("P2.4b", d1(lambda x: cos(2*x)**2, pi/8), -2)
# 2.5
f = lambda x: x**2 - 3*x
for x0 in (-2, 0.5, 3):
    check(f"P2.5a f'({x0})", d1(f, x0), 2*x0 - 3)
y = lambda x: x**3 - 2*x
check("P2.5b point", y(1), -1); check("P2.5b slope", d1(y, 1), 1)
check("P2.5b line through point", 1 - 2, y(1))
# 3.1
check("P3.1a", d1(lambda x: 1/cos(x), pi/3), 2*sqrt(3))
check("P3.1b", d1(lambda x: 1/sin(x), -pi/6), -2*sqrt(3))
# 3.2
finv = lambda y: (log(y) + 6) / 3           # inverse of e^(3x-6)
check("P3.2a", d1(finv, 1), 1/3)
f = lambda x: x**5 + 3*x - 2
check("P3.2b f(1)=2", f(1), 2)
def inv(f, yv, lo=-10, hi=10):              # f increasing: bisection
    for _ in range(200):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if f(mid) < yv else (lo, mid)
    return (lo + hi) / 2
check("P3.2b", d1(lambda yv: inv(f, yv), 2, 1e-5), 1/8, 1e-5)
check("P3.2c", d1(lambda x: atan(2*x), 0.5), 1)
# 3.3
F = lambda x, y: y**3 + 6*x*y**2 + 8*x**2*y + x + y + 1
check("P3.3a (-1,0) on C", F(-1, 0), 0); check("P3.3a (-1,3) on C", F(-1, 3), 0)
roots = [y/1000 for y in range(-10000, 10001) if abs(F(-1, y/1000)) < 1e-9]
check_true("P3.3a no other real y at x=-1", set(roots) == {0.0, 3.0}, str(roots))
Fx = lambda x, y: (F(x + 1e-6, y) - F(x - 1e-6, y)) / 2e-6
Fy = lambda x, y: (F(x, y + 1e-6) - F(x, y - 1e-6)) / 2e-6
check("P3.3b slope at (-1,0)", -Fx(-1, 0) / Fy(-1, 0), -1/9)
check("P3.3b F_y at (-1,3) is 0", Fy(-1, 3), 0, 1e-5)
check("P3.3b numerator 7 at (-1,3)", Fx(-1, 3), 7, 1e-5)
check("P3.3b denominator 0 at (-1,3)", 3*9 + 12*(-1)*3 + 8*1 + 1, 0)
# 3.4
check("P3.4a (2,-4) on circle", 2**2 + (-4)**2, 20)
check("P3.4a slope", -2/(-4), 0.5)
upper = lambda x: -sqrt(20 - x**2)         # lower half passes through (2,-4)
check("P3.4a slope numeric", d1(upper, 2), 0.5)
check("P3.4a line x-2y=10 through point", 2 - 2*(-4), 10)
G = lambda x, y: exp(y) + x*y - math.e
check("P3.4b (0,1) on curve", G(0, 1), 0)
Gx = (G(1e-6, 1) - G(-1e-6, 1)) / 2e-6; Gy = (G(0, 1 + 1e-6) - G(0, 1 - 1e-6)) / 2e-6
check("P3.4b", -Gx/Gy, -1/math.e)
# 3.5
xt = lambda t: log(t); yt = lambda t: t * cos(t)
check("P3.5a", d1(yt, pi) / d1(xt, pi), -pi)
dydx_exact = lambda t: t*cos(t) - t**2*sin(t)
check("P3.5 dy/dx formula", d1(yt, 1.1) / d1(xt, 1.1), dydx_exact(1.1))
check("P3.5b", d1(dydx_exact, pi/2) / (1/(pi/2)), -3*pi**2/4)
# 4.1
f = lambda x: x**3 - 3*x**2 - 9*x + 5
check("P4.1 crit -1", d1(f, -1), 0); check("P4.1 crit 3", d1(f, 3), 0)
check("P4.1 f''(-1)", d2(f, -1), -12, 1e-4); check("P4.1 f''(3)", d2(f, 3), 12, 1e-4)
check("P4.1 max", f(-1), 10); check("P4.1 min", f(3), -22)
# 4.2
g = lambda x: log(x**2 - 2*x + 2)
grid = [3*i/300000 for i in range(300001)]
vals = [g(x) for x in grid]
check("P4.2 max", max(vals), log(5)); check("P4.2 min", min(vals), 0)
check("P4.2 argmin", grid[vals.index(min(vals))], 1, 1e-4)
# 4.3
h = lambda x: abs(x**2 - 4*x)
grid = [-1 + 4*i/400000 for i in range(400001)]
vals = [h(x) for x in grid]
check("P4.3 max", max(vals), 5); check("P4.3 min", min(vals), 0)
check("P4.3 h(2)", h(2), 4); check("P4.3 h(3)", h(3), 3)
# 4.4
f = lambda x: x**4 - 6*x**2 + 1
check("P4.4a f''(-1)", d2(f, -1), 0, 1e-4); check("P4.4a f''(1)", d2(f, 1), 0, 1e-4)
check_true("P4.4a sign change at -1", d2(f, -1.1) > 0 > d2(f, -0.9))
check_true("P4.4a sign change at 1", d2(f, 0.9) < 0 < d2(f, 1.1))
check("P4.4a f(1)", f(1), -4); check("P4.4a f(-1)", f(-1), -4)
gq = lambda x: x**4 + x
check_true("P4.4b g'' >= 0 both sides of 0", d2(gq, -0.1) > 0 and d2(gq, 0.1) > 0)
# 4.5
f = lambda x: cbrt(x) * (x - 4)
check("P4.5 f'(1)=0", d1(f, 1), 0)
check_true("P4.5 f' < 0 on both sides of 0", d1(f, -0.5) < 0 and d1(f, 0.5) < 0)
check_true("P4.5 f' > 0 after 1", d1(f, 1.5) > 0)
check_true("P4.5 f' blows up at 0", abs((f(1e-9) - f(-1e-9)) / 2e-9) > 1e4)
check("P4.5 f(1)", f(1), -3)
fp = lambda x: 4*(x - 1) / (3*cbrt(x)**2)
check("P4.5 f' formula", d1(f, 2.7), fp(2.7))
# 5.1
for N in (0, 1, 5, 12):
    check(f"P5.1a s_{N}", sum((2/3)**n for n in range(N+1)), 3*(1 - (2/3)**(N+1)))
    check(f"P5.1b s_{N}", sum(2*(3/2)**n for n in range(N+1)), 4*((3/2)**(N+1) - 1))
check("P5.1a sum", sum((2/3)**n for n in range(400)), 3)
# 5.2
n = 1e7
check("P5.2a", (4*n**2 - n) / (3 - 2*n**2), -2, 1e-5)
n = 200
check("P5.2b", (3**(n+1) + 2**n) / (3**n - 1), 3, 1e-9)
check("P5.2c ratio", (1e6 + 1) / (3*1e6), 1/3, 1e-5)
check("P5.2c sum is finite (=3/4)", sum(k/3**k for k in range(1, 200)), 0.75)
check("P5.2d terms -> 2", (2*1e8 + 1) / (1e8 + 5), 2, 1e-6)
# 5.3
f = lambda x: 3*x**5 - x**2 + x - 2
check("P5.3a", 1 - f(1)/d1(f, 1), 13/14)
f = lambda x: x**4 + x - 3
check("P5.3b", 1 - f(1)/d1(f, 1), 6/5)
# 5.4
check("P5.4 estimate", 3 + (1/6)*0.06, 3.01)
check_true("P5.4 too big", 3.01 > sqrt(9.06), f"true={sqrt(9.06):.8f}")
# 5.5
f = lambda x: 2*sin(x)*cos(x); a = pi/12
check("P5.5a c0", f(a), 0.5); check("P5.5a c1", d1(f, a), sqrt(3))
check("P5.5a c2", d2(f, a)/2, -1, 1e-5); check("P5.5a c3", d3(f, a)/6, -2*sqrt(3)/3, 1e-4)
f = lambda x: 1/x; a = 1
check("P5.5b c0", f(a), 1); check("P5.5b c1", d1(f, a), -1)
check("P5.5b c2", d2(f, a)/2, 1, 1e-5); check("P5.5b c3", d3(f, a)/6, -1, 1e-4)
# Taylor order check: error of p3 should shrink like h^4
for name, fn, a0, cs in (("P5.5a", lambda x: sin(2*x), pi/12, [0.5, sqrt(3), -1, -2*sqrt(3)/3]),):
    e1 = abs(fn(a0 + 0.02) - sum(c*0.02**k for k, c in enumerate(cs)))
    e2 = abs(fn(a0 + 0.01) - sum(c*0.01**k for k, c in enumerate(cs)))
    check_true(f"{name} p3 error ~ h^4", 12 < e1/e2 < 20, f"ratio={e1/e2:.2f}")

# 6.x differential equations (Day 12): every claimed y must satisfy its equation and its conditions
XS = (-0.8, -0.3, 0.4, 1.1, 1.6)
def ode(name, y, a, b, xs=XS, tol=1e-4):
    """y'' + a y' + b y = 0 at several x"""
    for x in xs:
        check(f"{name} residual at x={x}", d2(y, x) + a*d1(y, x) + b*y(x), 0, tol)
def first(name, y, lam, xs=XS, tol=1e-5):
    """y' = lam y at several x"""
    for x in xs:
        check(f"{name} y'=λy at x={x}", d1(y, x) - lam*y(x), 0, tol)
# 6.1
f = lambda x: log(x)
for x in (0.5, 1.7, 3.2): check(f"P6.1a f'({x})", d1(f, x), 1/x)
check("P6.1a f(1)", f(1), 0)
f = lambda x: exp(x) + math.e - 1
for x in (-0.6, 0.9): check(f"P6.1b f'({x})", d1(f, x), exp(x))
check("P6.1b f(0)", f(0), math.e)
# 6.2
y = lambda x: 4*exp(-3*x); first("P6.2a", y, -3); check("P6.2a y(0)", y(0), 4)
y = lambda x: exp(2*x - 1); first("P6.2b", y, 2); check("P6.2b y(1)", y(1), math.e)
# 6.3: the general solutions work for any constants; the roots are right
for C1, C2 in ((1, 0), (0, 1), (0.7, -1.3)):
    ode(f"P6.3a C=({C1},{C2})", lambda x: C1*exp(2*x) + C2*exp(3*x), -5, 6)
    ode(f"P6.3b C=({C1},{C2})", lambda x: (C1 + C2*x)*exp(-3*x), 6, 9)
    ode(f"P6.3c C=({C1},{C2})", lambda x: C1*cos(2*x) + C2*sin(2*x), 0, 4)
    ode(f"P6.3d C=({C1},{C2})", lambda x: exp(x)*(C1*cos(2*x) + C2*sin(2*x)), -2, 5)
import cmath
for lam in (1 + 2j, 1 - 2j):
    check(f"P6.3d root {lam}", abs(lam**2 - 2*lam + 5), 0)
check("P6.3d discriminant", (-2)**2 - 4*5, -16)
# 6.4: equation, y(0) and y'(0)
y = lambda x: exp(2*x) + 2*exp(-x); ode("P6.4a", y, -1, -2); check("P6.4a y(0)", y(0), 3); check("P6.4a y'(0)", d1(y, 0), 0)
y = lambda x: (1 + 3*x)*exp(2*x); ode("P6.4b", y, -4, 4); check("P6.4b y(0)", y(0), 1); check("P6.4b y'(0)", d1(y, 0), 5)
y = lambda x: 2*cos(3*x) + sin(3*x); ode("P6.4c", y, 0, 9); check("P6.4c y(0)", y(0), 2); check("P6.4c y'(0)", d1(y, 0), 3)
# 6.5: each pair (a, b) is solved by the given functions
for name, a, b, fs in (("P6.5a", 1, -6, (lambda x: exp(2*x), lambda x: exp(-3*x))),
                       ("P6.5b", 2, 1, (lambda x: exp(-x), lambda x: x*exp(-x))),
                       ("P6.5c", 0, 9, (lambda x: cos(3*x), lambda x: sin(3*x)))):
    for i, yy in enumerate(fs):
        ode(f"{name} solution {i+1}", yy, a, b)
# Day 12 summary and watch-out examples
first("u6 y=Ce^(2x)", lambda x: 2.5*exp(2*x), 2)
check("u6 y=x^2+C solves y'=2x", d1(lambda x: x**2 + 7, 1.3), 2*1.3)
check("u6 C=5e^2 for y(1)=5", 5*math.e**2 * exp(-2*1), 5)
check("u6 C=e-1 for f(0)=e", exp(0) + (math.e - 1), math.e)
for a, b in ((-4, 4), (2, 1), (6, 9)):    # repeated root: x e^(λx) works because 2λ + a = 0
    lam = -a/2
    check(f"u6 repeated root a={a}: 2λ+a", 2*lam + a, 0)
    ode(f"u6 x e^(λx) a={a}", lambda x: x*exp(lam*x), a, b)

print("\nFAILED:" if fails else "\nALL CHECKS PASSED", fails if fails else "")
sys.exit(1 if fails else 0)
