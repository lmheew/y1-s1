"""Numeric verification of every answer in the three mock midterms (exams.mjs).
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
    return (f(x + h) - 2 * f(x) + f(x - h)) / h ** 2


def d3(f, x, h=1e-3):
    return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h ** 3)


def lim2(f, a, h=1e-7):
    """two-sided limit estimate and the gap between the sides"""
    return (f(a - h) + f(a + h)) / 2, abs(f(a - h) - f(a + h))


def solve(g, lo, hi):
    """root of g on [lo, hi] by bisection (g changes sign)"""
    glo = g(lo)
    for _ in range(200):
        mid = (lo + hi) / 2
        if (g(mid) > 0) == (glo > 0):
            lo, glo = mid, g(mid)
        else:
            hi = mid
    return (lo + hi) / 2


def implicit_slope(F, x0, y0, h=1e-6):
    """dy/dx of the curve F(x, y) = 0 through (x0, y0), by solving for y near x0 +- h"""
    def y_at(x):
        y = y0
        for _ in range(60):  # Newton in y
            fy = (F(x, y + 1e-7) - F(x, y - 1e-7)) / 2e-7
            y -= F(x, y) / fy
        return y
    return (y_at(x0 + h) - y_at(x0 - h)) / (2 * h)


def taylor(f, a):
    return [f(a), d1(f, a), d2(f, a) / 2, d3(f, a) / 6]


def sampled_extrema(f, lo, hi, n=200001):
    xs = [lo + (hi - lo) * i / (n - 1) for i in range(n)]
    vals = [f(x) for x in xs]
    return max(vals), min(vals), xs[vals.index(max(vals))], xs[vals.index(min(vals))]


# ---------------- Mock Midterm 1 ----------------
v, gap = lim2(lambda x: (x * x + x - 6) / (x * x - 4), 2)
check("M1 Q1(1) lim (x^2+x-6)/(x^2-4), x->2", v, 5 / 4, 1e-5)
check("M1 Q1(2) lim sin4x/(3x)", sin(4e-7) / 3e-7, 4 / 3, 1e-6)
check("M1 Q1(3) arccos(-1/2)+arcsin(sqrt3/2)", acos(-0.5) + asin(sqrt(3) / 2), pi)
a = 1
check("M1 Q1(4) a=1: left limit a+1 = right value 3-a", a * 1 ** 2 + 1, 3 * 1 - a)
check("M1 Q1(4) a solves a+1 = 3-a", (3 - 1) / 2, a)

check("M1 Q2(1) f'(1), f=x^4-2x^2+3x", d1(lambda x: x ** 4 - 2 * x * x + 3 * x, 1), 3)
check("M1 Q2(2) f'(1), f=x^2/(x+1)", d1(lambda x: x * x / (x + 1), 1), 3 / 4)
check("M1 Q2(3) f'(pi), f=e^sinx", d1(lambda x: exp(sin(x)), pi), -1)
check("M1 Q2(4) tangent y=x/e: slope 1/e", d1(log, math.e), 1 / math.e)
check("M1 Q2(4) tangent y=x/e passes through (e, 1)", math.e / math.e, log(math.e))

F = lambda x, y: x * x + x * y + y * y - 7
check("M1 Q3(1) (1,2) is on x^2+xy+y^2=7", F(1, 2) + 7, 7)
check("M1 Q3(1) dy/dx at (1,2)", implicit_slope(F, 1, 2), -4 / 5, 1e-5)
f = lambda x: x ** 3 + 2 * x + 1
finv = lambda y: solve(lambda x: f(x) - y, -5, 5)
check("M1 Q3(2) f(1) = 4", f(1), 4)
check("M1 Q3(2) (f^-1)'(4)", d1(finv, 4, 1e-5), 1 / 5, 1e-5)
xt, yt = (lambda t: t ** 3 + t), (lambda t: t * t)
dydx = lambda t: d1(yt, t) / d1(xt, t)
check("M1 Q3(3) dy/dx at t=1", dydx(1), 1 / 2)
check("M1 Q3(4) d2y/dx2 at t=1", d1(dydx, 1, 1e-4) / d1(xt, 1), -1 / 16, 1e-5)

f = lambda x: x ** 3 - 6 * x * x + 9 * x + 1
fp = lambda x: 3 * x * x - 12 * x + 9
check_true("M1 Q4(1) f'(1)=f'(3)=0 and f' is quadratic (no other roots)", abs(fp(1)) < 1e-12 and abs(fp(3)) < 1e-12)
check_true("M1 Q4(2) f''(1)<0 and f''(3)>0", d2(f, 1) < 0 < d2(f, 3))
check("M1 Q4(2) relative max f(1)", f(1), 5)
check("M1 Q4(2) relative min f(3)", f(3), 1)
check_true("M1 Q4(3) f'' changes sign at 2", d2(f, 1.9) < 0 < d2(f, 2.1))
check("M1 Q4(3) f(2)", f(2), 3)
mx, mn, _, _ = sampled_extrema(f, 0, 4)
check("M1 Q4(4) absolute max on [0,4]", mx, 5)
check("M1 Q4(4) absolute min on [0,4]", mn, 1)
check_true("M1 Q4(4) max reached at x=1 and x=4", abs(f(1) - 5) < 1e-12 and abs(f(4) - 5) < 1e-12)
check_true("M1 Q4(4) min reached at x=0 and x=3", abs(f(0) - 1) < 1e-12 and abs(f(3) - 1) < 1e-12)

n = 1e7
check("M1 Q5(1) lim (5n^3-2n)/(2n^3+n^2+1)", (5 * n ** 3 - 2 * n) / (2 * n ** 3 + n * n + 1), 5 / 2, 1e-6)
for N in range(0, 12):
    s = sum(3 * 0.5 ** k for k in range(N + 1))
    check(f"M1 Q5(2) s_{N}", s, 6 * (1 - 0.5 ** (N + 1)))
check("M1 Q5(2) infinite sum", sum(3 * 0.5 ** k for k in range(200)), 6)
check("M1 Q5(3) sum 2^n/n! converges (to e^2-1)", sum(2 ** k / math.factorial(k) for k in range(1, 80)), exp(2) - 1)
f, fp = (lambda x: x ** 3 + x - 1), (lambda x: 3 * x * x + 1)
check("M1 Q5(4) Newton x2", 1 - f(1) / fp(1), 3 / 4)

check("M1 Q6(1) linear estimate of cbrt(8.12)", 2 + d1(lambda x: x ** (1 / 3), 8) * 0.12, 2.01, 1e-6)
check_true("M1 Q6(2) estimate is too big", 8.12 ** (1 / 3) < 2.01, f"(true value {8.12 ** (1 / 3):.8f})")
for k, (got, want) in enumerate(zip(taylor(lambda x: cos(x) ** 2 - sin(x) ** 2, pi / 3), [-0.5, -sqrt(3), 1, 2 * sqrt(3) / 3])):
    check(f"M1 Q6(3) c{k}", got, want, 1e-5)

# ---------------- Mock Midterm 2 ----------------
check("M2 Q1(1) f(-1), f=(x+1)ln(x^2)+e^(x+1)", (-1 + 1) * log((-1) ** 2) + exp(0), 1)
check("M2 Q1(2) arctan(-1)+arccos(0)", atan(-1) + acos(0), pi / 4)
v, gap = lim2(lambda x: (sqrt(x + 3) - 2) / (x - 1), 1, 1e-6)
check("M2 Q1(3) lim (sqrt(x+3)-2)/(x-1)", v, 1 / 4, 1e-5)
v, gap = lim2(lambda x: (x * x - x - 2) / (x - 2), 2)
check("M2 Q1(4) limit at x=2 is 3", v, 3, 1e-6)
check_true("M2 Q1(4) limit 3 differs from f(2)=4: not continuous, removable", abs(v - 4) > 0.5 and gap < 1e-5)

check("M2 Q2(1) f'(1), f=3x^4-2/x", d1(lambda x: 3 * x ** 4 - 2 / x, 1), 14)
check("M2 Q2(2) f'(0), f=x e^(2x)", d1(lambda x: x * exp(2 * x), 0), 1)
check("M2 Q2(3) f'(pi/12), f=sin^2(3x)", d1(lambda x: sin(3 * x) ** 2, pi / 12), 3)
for x0 in (0.5, 1, 2, -3):
    check(f"M2 Q2(4) (1/x)' = -1/x^2 at x={x0}", d1(lambda x: 1 / x, x0), -1 / x0 ** 2)

F = lambda x, y: x ** 3 + y ** 3 - 9 * x * y
check("M2 Q3(1) (2,4) is on x^3+y^3=9xy", F(2, 4), 0)
m = implicit_slope(F, 2, 4)
check("M2 Q3(1) slope at (2,4)", m, 4 / 5, 1e-5)
check("M2 Q3(1) tangent y=(4/5)x+12/5 passes through (2,4)", 4 / 5 * 2 + 12 / 5, 4)
check("M2 Q3(2) d/dx arcsin(x^2) at 1/2", d1(lambda x: asin(x * x), 0.5), 4 * sqrt(15) / 15)
f = lambda x: exp(2 * x) + x
finv = lambda y: solve(lambda x: f(x) - y, -5, 5)
check("M2 Q3(3) f(0) = 1", f(0), 1)
check("M2 Q3(3) (f^-1)'(1)", d1(finv, 1, 1e-5), 1 / 3, 1e-5)
check("M2 Q3(4) dy/dx at t=pi/6", d1(lambda t: sin(2 * t), pi / 6) / d1(cos, pi / 6), -2)

f = lambda x: 3 * x ** 4 - 4 * x ** 3
fp = lambda x: 12 * x ** 3 - 12 * x * x
check_true("M2 Q4(1) f'(0)=f'(1)=0", fp(0) == 0 and fp(1) == 0)
check_true("M2 Q4(2) f'<0 on both sides of 0 (neither)", fp(-0.1) < 0 and fp(0.1) < 0)
check_true("M2 Q4(2) f' goes - to + at 1 (relative min)", fp(0.9) < 0 < fp(1.1))
check("M2 Q4(2) f(1)", f(1), -1)
check_true("M2 Q4(3) f'' changes sign at 0 and 2/3", d2(f, -0.05) > 0 > d2(f, 0.05) and d2(f, 2 / 3 - 0.05) < 0 < d2(f, 2 / 3 + 0.05))
check("M2 Q4(3) f(2/3)", f(2 / 3), -16 / 27)
mx, mn, xmx, xmn = sampled_extrema(f, -1, 2)
check("M2 Q4(4) absolute max on [-1,2]", mx, 16)
check("M2 Q4(4) absolute min on [-1,2]", mn, -1)
check("M2 Q4(4) max at x=2", xmx, 2, 1e-4)
check("M2 Q4(4) min at x=1", xmn, 1, 1e-4)

n = 60
check("M2 Q5(1) lim (2^(n+2)-5^n)/(5^n+3)", (2 ** (n + 2) - 5 ** n) / (5 ** n + 3), -1)
for N in range(0, 12):
    s = sum((-1 / 3) ** k for k in range(N + 1))
    check(f"M2 Q5(2) s_{N}", s, 3 / 4 * (1 - (-1 / 3) ** (N + 1)))
check("M2 Q5(2) infinite sum", sum((-1 / 3) ** k for k in range(200)), 3 / 4)
check("M2 Q5(3) terms tend to 1/2 (so it diverges)", (1e8 + 1) / (2e8 + 5), 1 / 2, 1e-6)
check("M2 Q5(4) Newton x2", 2 - (4 - 5) / 4, 9 / 4)

check("M2 Q6(1) linear estimate of ln(1.04)", 0 + d1(log, 1) * 0.04, 0.04)
check_true("M2 Q6(2) estimate is too big", log(1.04) < 0.04, f"(true value {log(1.04):.8f})")
for k, (got, want) in enumerate(zip(taylor(sqrt, 4), [2, 1 / 4, -1 / 64, 1 / 512])):
    check(f"M2 Q6(3) c{k}", got, want, 1e-5)

# ---------------- Mock Midterm 3 ----------------
check("M3 Q1(1) f(pi/6), f=sin(2t)cos(t)+1", sin(2 * pi / 6) * cos(pi / 6) + 1, 7 / 4)
check("M3 Q1(2) lim (e^(3x)-1)/sin2x", (exp(3e-7) - 1) / sin(2e-7), 3 / 2, 1e-5)
g = lambda x: (x - 2) / (x * x - 5 * x + 6)
check_true("M3 Q1(3) f -> -inf from the left of 3, +inf from the right", g(3 - 1e-6) < -1e5 and g(3 + 1e-6) > 1e5)
v, gap = lim2(g, 2, 1e-6)
check("M3 Q1(4) limit at x=2", v, -1, 1e-5)
check_true("M3 Q1(4) the denominator is 0 at x=2 (f(2) undefined)", 2 * 2 - 5 * 2 + 6 == 0)

check("M3 Q2(1) f'(1), f=sqrt(x)+1/x^2", d1(lambda x: sqrt(x) + 1 / x ** 2, 1), -3 / 2)
check("M3 Q2(2) f'(e), f=ln(x)/x", d1(lambda x: log(x) / x, math.e), 0)
check("M3 Q2(3) f'(pi/8), f=tan(2x)", d1(lambda x: tan(2 * x), pi / 8), 4)
check("M3 Q2(4) f''(0), f=x^2 e^x", d2(lambda x: x * x * exp(x), 0), 2, 1e-5)

F = lambda x, y: x * x * y + y ** 3 - 10
check("M3 Q3(1) (3,1) is on x^2y+y^3=10", F(3, 1), 0)
check("M3 Q3(1) dy/dx at (3,1)", implicit_slope(F, 3, 1), -1 / 2, 1e-5)
for sgn in (1, -1):
    xy = lambda y: sgn * sqrt(4 * y - y * y)  # the curve x^2+y^2-4y=0 written as x(y)
    check(f"M3 Q3(2) ({2 * sgn},2) is on the curve", (2 * sgn) ** 2 + 4 - 8, 0)
    check(f"M3 Q3(2) dx/dy = 0 at ({2 * sgn},2): vertical tangent", d1(xy, 2, 1e-5), 0, 1e-4)
check_true("M3 Q3(2) the top and bottom points (0,0), (0,4) have horizontal tangents instead", abs(d1(lambda x: 2 + sqrt(4 - x * x), 0)) < 1e-6)
check("M3 Q3(3) d/dx arctan(sqrt x) at 1", d1(lambda x: atan(sqrt(x)), 1), 1 / 4)
check("M3 Q3(4) dy/dx at t=1", d1(lambda t: t * t, 1) / d1(exp, 1), 2 / math.e)

f = lambda x: x / (x * x + 1)
check_true("M3 Q4(1) f'(+-1) = 0", abs(d1(f, 1)) < 1e-9 and abs(d1(f, -1)) < 1e-9)
check_true("M3 Q4(2) f' sign - + - around -1 and 1", d1(f, -2) < 0 < d1(f, 0) and d1(f, 2) < 0)
check("M3 Q4(2) relative min f(-1)", f(-1), -1 / 2)
check("M3 Q4(2) relative max f(1)", f(1), 1 / 2)
mx, mn, xmx, xmn = sampled_extrema(f, 0, 3)
check("M3 Q4(3) absolute max on [0,3]", mx, 1 / 2)
check("M3 Q4(3) absolute min on [0,3]", mn, 0)
check("M3 Q4(3) f(3)", f(3), 3 / 10)

n = 1e7
check("M3 Q5(1) lim (n+1)^2/(3n^2-n)", (n + 1) ** 2 / (3 * n * n - n), 1 / 3, 1e-6)
for N in range(0, 12):
    s = sum(2 / 5 ** k for k in range(N + 1))
    check(f"M3 Q5(2) s_{N}", s, 5 / 2 * (1 - 0.2 ** (N + 1)))
check("M3 Q5(2) infinite sum", sum(2 / 5 ** k for k in range(200)), 5 / 2)
check("M3 Q5(3) sum n^2/2^n converges (to 6)", sum(k * k / 2 ** k for k in range(1, 200)), 6)
check("M3 Q5(4) Newton x2", 1 - (1 - 2) / 4, 5 / 4)

check("M3 Q6(1) linear estimate of 1/0.98", 1 + d1(lambda x: 1 / x, 1) * (0.98 - 1), 1.02)
check_true("M3 Q6(2) estimate is too small", 1 / 0.98 > 1.02, f"(true value {1 / 0.98:.8f})")
for k, (got, want) in enumerate(zip(taylor(log, 2), [log(2), 1 / 2, -1 / 8, 1 / 24])):
    check(f"M3 Q6(3) c{k}", got, want, 1e-5)

print(f"\n{len(fails)} FAILED: {fails}" if fails else "\nALL MOCK EXAM CHECKS PASSED")
sys.exit(1 if fails else 0)
