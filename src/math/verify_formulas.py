"""Numeric checks for every row of the formula sheet and the exact-values table."""
import math, sys
from math import sin, cos, tan, exp, log, sqrt, pi, asin, acos, atan

fails = []
def check(name, got, want, tol=1e-6):
    ok = abs(got - want) <= tol * max(1.0, abs(want))
    print(f"{'PASS' if ok else 'FAIL'}  {name}: {got:.10g} vs {want:.10g}")
    if not ok: fails.append(name)
def d1(f, x, h=1e-6): return (f(x + h) - f(x - h)) / (2 * h)
sec = lambda x: 1 / cos(x); csc = lambda x: 1 / sin(x); cot = lambda x: cos(x) / sin(x)

# g1 limits
x = 1e-5
check("sin x/x", sin(x) / x, 1)
check("(1-cos x)/x", (1 - cos(x)) / x, 0, 1e-4)
check("(1-cos x)/x^2", (1 - cos(1e-3)) / 1e-6, 0.5, 1e-5)
check("(e^x-1)/x", (exp(x) - 1) / x, 1, 1e-4)
check("ln(1+x)/x", log(1 + x) / x, 1, 1e-4)
check("(1+1/n)^n", (1 + 1 / 1e7) ** 1e7, math.e, 1e-6)
for a0, x0 in ((4, 6.25), (2, 3)):
    check(f"conjugate a={a0}", (sqrt(x0) - sqrt(a0)) / (x0 - a0), 1 / (sqrt(x0) + sqrt(a0)))
check("arcsin range ends", asin(1), pi / 2); check("arccos range end", acos(-1), pi)
check("arctan -> pi/2", atan(1e12), pi / 2)
# g2 derivative rules
p = 1.3
check("power rule", d1(lambda t: t ** 3.5, p), 3.5 * p ** 2.5)
check("(a^x)'", d1(lambda t: 3 ** t, p), 3 ** p * log(3))
check("(log_a x)'", d1(lambda t: log(t) / log(5), p), 1 / (p * log(5)))
check("(tan)'", d1(tan, p - 0.5), sec(p - 0.5) ** 2)
check("(cot)'", d1(cot, p), -csc(p) ** 2)
check("(sec)'", d1(sec, 0.4), sec(0.4) * tan(0.4))
check("(csc)'", d1(csc, 0.9), -csc(0.9) * cot(0.9))
f = lambda t: t ** 2 + 1; g = lambda t: sin(t)
check("quotient rule", d1(lambda t: f(t) / g(t), p), (2 * p * g(p) - f(p) * cos(p)) / g(p) ** 2)
check("chain rule", d1(lambda t: f(g(t)), p), 2 * g(p) * cos(p))
# g3
check("(arcsin)'", d1(asin, 0.3), 1 / sqrt(1 - 0.09))
check("(arccos)'", d1(acos, 0.3), -1 / sqrt(1 - 0.09))
check("(arctan)'", d1(atan, 0.7), 1 / (1 + 0.49))
fx = lambda t: t ** 3 + t           # inverse-function rule at b = f(1) = 2
check("inverse rule", 1 / d1(fx, 1), 0.25)
r = 5; xx, yy = 3, 4                 # circle slope at (3,4)
check("circle slope", d1(lambda t: sqrt(r * r - t * t), xx), -xx / yy)
xt = lambda t: t ** 2; yt = lambda t: t ** 3 - 3 * t   # parametric second derivative
dydx = lambda t: d1(yt, t) / d1(xt, t)
check("parametric 2nd", d1(dydx, 1.0, 1e-5) / d1(xt, 1.0), 3 * (1 + 1) / (4 * 1), 1e-5)
# g5 sums and series
N = 37
check("sum n", sum(range(1, N + 1)), N * (N + 1) / 2)
check("sum n^2", sum(n * n for n in range(1, N + 1)), N * (N + 1) * (2 * N + 1) / 6)
check("sum n^3", sum(n ** 3 for n in range(1, N + 1)), (N * (N + 1) / 2) ** 2)
for rr in (0.4, -0.7, 2.5):
    check(f"geom partial r={rr}", sum(rr ** n for n in range(N + 1)), (1 - rr ** (N + 1)) / (1 - rr))
check("geom series", sum(0.6 ** n for n in range(400)), 1 / (1 - 0.6))
xv = 0.3
check("e^x series", sum(xv ** k / math.factorial(k) for k in range(20)), exp(xv))
check("sin series", sum((-1) ** k * xv ** (2 * k + 1) / math.factorial(2 * k + 1) for k in range(12)), sin(xv))
check("cos series", sum((-1) ** k * xv ** (2 * k) / math.factorial(2 * k) for k in range(12)), cos(xv))
check("ln(1+x) series", sum((-1) ** (k + 1) * xv ** k / k for k in range(1, 60)), log(1 + xv))
check("1/(1-x) series", sum(xv ** k for k in range(80)), 1 / (1 - xv))
# g6 trig
for t in (0.3, 1.1, 2.0):
    check(f"pythag {t}", sin(t) ** 2 + cos(t) ** 2, 1)
    check(f"1+tan^2 {t}", 1 + tan(t) ** 2, sec(t) ** 2)
    check(f"sin2x {t}", sin(2 * t), 2 * sin(t) * cos(t))
    check(f"cos2x {t}", cos(2 * t), cos(t) ** 2 - sin(t) ** 2)
    check(f"cos2x alt {t}", cos(2 * t), 1 - 2 * sin(t) ** 2)
# exact values table
ang = [0, pi / 6, pi / 4, pi / 3, pi / 2]
for a, s_, c_ in zip(ang, [0, .5, sqrt(2) / 2, sqrt(3) / 2, 1], [1, sqrt(3) / 2, sqrt(2) / 2, .5, 0]):
    check(f"sin {a:.4f}", sin(a), s_); check(f"cos {a:.4f}", cos(a), c_)
for a, t_ in zip(ang[:4], [0, sqrt(3) / 3, 1, sqrt(3)]):
    check(f"tan {a:.4f}", tan(a), t_)
# g7 differential equations (Day 12)
import cmath
def d2(f, x, h=1e-4): return (f(x + h) - 2 * f(x) + f(x - h)) / h ** 2
check("y'=f(x): y = sin x + C", d1(lambda t: sin(t) + 4, 0.8), cos(0.8))
for lam, C in ((-0.7, 2.3), (1.4, -0.5)):
    y = lambda t: C * exp(lam * t)
    check(f"y'=λy λ={lam}", d1(y, 0.6), lam * y(0.6)); check(f"C=y(0) λ={lam}", y(0), C)
a, b, lam = 1.5, -2.0, 0.9                       # substituting e^(λx) gives (λ²+aλ+b)e^(λx)
y = lambda t: exp(lam * t)
check("characteristic factor", d2(y, 0.3) + a * d1(y, 0.3) + b * y(0.3), (lam ** 2 + a * lam + b) * exp(lam * 0.3), 1e-5)
for name, a, b, y in (("Δ>0 a=-3 b=2", -3, 2, lambda t: 0.8 * exp(t) - 1.7 * exp(2 * t)),
                      ("Δ=0 a=-4 b=4", -4, 4, lambda t: (0.8 - 1.7 * t) * exp(2 * t)),
                      ("Δ<0 a=-2 b=5", -2, 5, lambda t: exp(t) * (0.8 * cos(2 * t) - 1.7 * sin(2 * t)))):
    for t in (-0.5, 0.4, 1.2):
        check(f"{name} at {t}", d2(y, t) + a * d1(y, t) + b * y(t), 0, 1e-4)
for th in (0.3, 2.0, -1.1):
    z = cmath.exp(1j * th)
    check(f"Euler re {th}", z.real, cos(th)); check(f"Euler im {th}", z.imag, sin(th))

print("\nFAILED:" if fails else "\nALL FORMULA CHECKS PASSED", fails if fails else "")
sys.exit(1 if fails else 0)
