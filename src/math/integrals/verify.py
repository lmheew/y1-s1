"""Numeric checks for the Calculus midterm 2 page (src/math/integrals): every practice answer, every claim in the
Summary, the formula sheet, the follow-up quizzes and the Riemann-sum graph. Riemann sums are added up exactly with
fractions and compared with the closed forms on the page; limits and integrals are checked against high-accuracy
numeric integration, and every primitive by differentiating it numerically at several points.
Each check prints PASS/FAIL; the script exits non-zero if anything fails.

    python3 src/math/integrals/verify.py"""
import math, sys
from fractions import Fraction as Fr
from math import sin, cos, tan, exp, log, sqrt, pi, atan

fails = []
def check(name, got, want, tol=1e-9):
    ok = abs(float(got) - float(want)) <= tol * max(1.0, abs(float(want)))
    print(f"{'PASS' if ok else 'FAIL'}  {name}: got={float(got):.12g}  claimed={float(want):.12g}")
    if not ok:
        fails.append(name)

def check_true(name, cond, detail=""):
    print(f"{'PASS' if cond else 'FAIL'}  {name} {detail}")
    if not cond:
        fails.append(name)

def riemann(f, a, b, n, where='right'):
    """the Riemann sum, exactly when f, a and b are rational: where = 'left', 'mid' or 'right'"""
    a, b = Fr(a), Fr(b)
    dx = (b - a) / n
    t = {'left': Fr(0), 'mid': Fr(1, 2), 'right': Fr(1)}[where]
    return sum(f(a + (k - 1 + t) * dx) for k in range(1, n + 1)) * dx

def integral(f, a, b, m=2000):
    """composite Simpson's rule (exact for cubics, very close for smooth functions)"""
    h = (b - a) / (2 * m)
    s = f(a) + f(b) + sum((4 if i % 2 else 2) * f(a + i * h) for i in range(1, 2 * m))
    return s * h / 3

def d1(F, x, h=1e-6):
    return (F(x + h) - F(x - h)) / (2 * h)

def primitive(name, F, f, xs):
    """F is a primitive of f: F'(x) = f(x) at every x in xs"""
    for x in xs:
        check(f"{name}: F'({x}) = f({x})", d1(F, x), f(x), 1e-6)

NS = (1, 2, 3, 4, 5, 7, 10, 25, 100)
sq = lambda x: x * x
cube = lambda x: x ** 3

# ================= PRACTICE: Day 14 & 15 (2 & 3 Nov) =================
# 1.1  n = 4 estimates of the integral of x^2 on [0, 2]
check("P1.1 left", riemann(sq, 0, 2, 4, 'left'), Fr(7, 4))
check("P1.1 right", riemann(sq, 0, 2, 4, 'right'), Fr(15, 4))
check("P1.1 mid", riemann(sq, 0, 2, 4, 'mid'), Fr(21, 8))
check("P1.1 exact area 8/3", integral(sq, 0, 2), 8 / 3)
check("P1.1 midpoint numerator 1+9+25+49", 1 + 9 + 25 + 49, 84)
check_true("P1.1 left < area < right; midpoint closest",
           Fr(7, 4) < Fr(8, 3) < Fr(15, 4) and abs(Fr(21, 8) - Fr(8, 3)) < min(Fr(8, 3) - Fr(7, 4), Fr(15, 4) - Fr(8, 3)))
# 1.2  (2x + 1) on [1, 3], right ends: S_n = 10 + 4/n -> 10
f = lambda x: 2 * x + 1
for n in NS:
    check(f"P1.2 S_{n} = 10 + 4/n", riemann(f, 1, 3, n), 10 + Fr(4, n))
    check(f"P1.2 f(x_k) = 3 + 4k/n (n={n})", f(1 + Fr(2 * 3, n)), 3 + Fr(4 * 3, n))   # k = 3
check("P1.2 integral", integral(f, 1, 3), 10)
check("P1.2 trapezoid (3+7)/2*2", Fr(3 + 7, 2) * 2, 10)
# 1.3  (x^2 + x) on [0, 1], right ends
f = lambda x: x * x + x
for n in NS:
    check(f"P1.3 S_{n}", riemann(f, 0, 1, n), Fr((n + 1) * (2 * n + 1), 6 * n * n) + Fr(n + 1, 2 * n))
check("P1.3 limit 5/6", integral(f, 0, 1), 5 / 6)
check("P1.3 S_n at n = 10^6 is near 5/6", (10**6 + 1) * (2 * 10**6 + 1) / (6 * 10**12) + (10**6 + 1) / (2 * 10**6), 5 / 6, 1e-5)
# 1.7  x - 1 on [0, 3]: S_n = 3/2 + 9/(2n), integral 3/2, area 5/2
f = lambda x: x - 1
for n in NS:
    check(f"P1.7 S_{n}", riemann(f, 0, 3, n), Fr(3, 2) + Fr(9, 2 * n))
check("P1.7 integral 3/2", integral(f, 0, 3), 1.5)
check("P1.7 area 5/2", integral(lambda x: abs(x - 1), 0, 1, 4000) + integral(lambda x: abs(x - 1), 1, 3, 4000), 2.5)
check("P1.7 triangle below", integral(lambda x: 1 - x, 0, 1), 0.5)
check("P1.7 triangle above", integral(f, 1, 3), 2)
# 1.8  limits read as integrals
for n in (10, 100, 1000):
    check(f"P1.8a sum (k/n)^3/n is the right sum of x^3 on [0,1] (n={n})",
          sum((Fr(k, n)) ** 3 * Fr(1, n) for k in range(1, n + 1)), riemann(cube, 0, 1, n))
    check(f"P1.8b sum (1+2k/n)^2 2/n is the right sum of x^2 on [1,3] (n={n})",
          sum((1 + Fr(2 * k, n)) ** 2 * Fr(2, n) for k in range(1, n + 1)), riemann(sq, 1, 3, n))
    check(f"P1.8b also the right sum of (1+x)^2 on [0,2] (n={n})",
          riemann(sq, 1, 3, n), riemann(lambda x: (1 + x) ** 2, 0, 2, n))
check("P1.8a value 1/4", integral(cube, 0, 1), 0.25)
check("P1.8a with the primitive x^4/4", Fr(1, 4) - 0, Fr(1, 4))
primitive("P1.8a x^4/4", lambda x: x ** 4 / 4, cube, (-1.3, 0.4, 2.0))
check("P1.8b value 26/3", integral(sq, 1, 3), 26 / 3)
check("P1.8b 27/3 - 1/3", Fr(27, 3) - Fr(1, 3), Fr(26, 3))
check("P1.8b int (1+x)^2 on [0,2]", integral(lambda x: (1 + x) ** 2, 0, 2), 26 / 3)
check("P1.8 large n approaches 1/4", float(riemann(cube, 0, 1, 2000)), 0.25, 1e-3)
# 1.9  the class example x^2 + x - 2 on [0, 2] (3 Nov)
f = lambda x: x * x + x - 2
F = lambda x: Fr(x) ** 3 / 3 + Fr(x) ** 2 / 2 - 2 * Fr(x)
for n in NS:
    S = riemann(f, 0, 2, n)
    check(f"P1.9 S_{n} = 2/3 + 6/n + 4/(3n^2)", S, Fr(2, 3) + Fr(6, n) + Fr(4, 3 * n * n))
    check(f"P1.9 S_{n} before simplifying", S, Fr(4 * (n + 1) * (2 * n + 1), 3 * n * n) + Fr(2 * (n + 1), n) - 4)
    check(f"P1.9 S_{n} as three sums", S, Fr(8, n ** 3) * sum(k * k for k in range(1, n + 1)) + Fr(4, n * n) * sum(range(1, n + 1)) - Fr(4, n) * n)
    check(f"P1.9 f(x_k) = 4k^2/n^2 + 2k/n - 2 (n={n}, k=3)", f(Fr(6, n)), Fr(36, n * n) + Fr(6, n) - 2)
check("P1.9 n = 4 by hand: 2.25", riemann(f, 0, 2, 4), Fr(9, 4))
check("P1.9 integral 2/3", integral(f, 0, 2), 2 / 3)
check("P1.9 F(2) - F(0) = 8/3 + 2 - 4", F(2) - F(0), Fr(2, 3))
check("P1.9 F(1) = 1/3 + 1/2 - 2 = -7/6", F(1), Fr(-7, 6))
check("P1.9 integral on [0,1] = -7/6", integral(f, 0, 1), -7 / 6)
check("P1.9 integral on [1,2] = 2/3 + 7/6 = 11/6", integral(f, 1, 2), 11 / 6)
check("P1.9 area 7/6 + 11/6 = 3", integral(f, 1, 2) - integral(f, 0, 1), 3)
check("P1.9 f = (x+2)(x-1)", f(0.37), (0.37 + 2) * (0.37 - 1))
check_true("P1.9 f < 0 on [0,1), f > 0 on (1,2]", all(f(x / 100) < 0 for x in range(0, 100)) and all(f(1 + x / 100) > 0 for x in range(1, 101)))
# 1.11  properties, with an f and a g that have the given integrals: f(x) = 3.9 - 1.4x, g(x) = -1/2
f = lambda x: 3.9 - 1.4 * x
g = lambda x: -0.5
check("P1.11 data: int_0^2 f = 5", integral(f, 0, 2), 5)
check("P1.11 data: int_0^5 f = 2", integral(f, 0, 5), 2)
check("P1.11 data: int_0^2 g = -1", integral(g, 0, 2), -1)
check("P1.11a int_2^5 f = -3", integral(f, 2, 5), -3)
check("P1.11b int_5^2 f = 3", integral(f, 5, 2), 3)
check("P1.11c int_0^2 (3f - 2g) = 17", integral(lambda x: 3 * f(x) - 2 * g(x), 0, 2), 17)
check("P1.11d int_2^2 f = 0", integral(f, 2, 2), 0)
# 1.12  x^2 - 4 on [0, 3]: the integral -3, the area 23/3, with F = x^3/3 - 4x
f = lambda x: x * x - 4
F = lambda x: Fr(x) ** 3 / 3 - 4 * Fr(x)
primitive("P1.12 F = x^3/3 - 4x", lambda x: x ** 3 / 3 - 4 * x, f, (-1.0, 0.5, 2.5))
check("P1.12 F(3) - F(0) = 9 - 12 = -3", F(3) - F(0), -3)
check("P1.12 integral -3", integral(f, 0, 3), -3)
check("P1.12 F(2) - F(0) = 8/3 - 8 = -16/3", F(2) - F(0), Fr(-16, 3))
check("P1.12 F(3) - F(2) = 7/3", F(3) - F(2), Fr(7, 3))
check("P1.12 area 16/3 + 7/3 = 23/3", integral(lambda x: abs(x * x - 4), 0, 2, 4000) + integral(lambda x: abs(x * x - 4), 2, 3, 4000), 23 / 3)
check_true("P1.12 f < 0 on [0,2), f > 0 on (2,3]", all(f(x / 100) < 0 for x in range(0, 200)) and all(f(2 + x / 100) > 0 for x in range(1, 101)))

# ================= PRACTICE: Day 16 & 17 (5 & 6 Nov) =================
XS = (-1.7, -0.6, 0.3, 1.1, 2.4)       # points to differentiate at (x > 0 only where the function needs it)
XP = (0.3, 0.9, 1.6, 2.8)
# 2.1  primitives of 6x^2 - 2
f = lambda x: 6 * x * x - 2
primitive("P2.1a F = 2x^3 - 2x", lambda x: 2 * x ** 3 - 2 * x, f, XS)
primitive("P2.1a G = 2x^3 - 2x + 7", lambda x: 2 * x ** 3 - 2 * x + 7, f, XS)
check("P2.1b H(1) = 5", 2 - 2 + 5, 5)
primitive("P2.1b H = 2x^3 - 2x + 5", lambda x: 2 * x ** 3 - 2 * x + 5, f, XS)
check_true("P2.1c (2x^3)' = 6x^2 misses the -2", abs(d1(lambda x: 2 * x ** 3, 1.3) - f(1.3) - 2) < 1e-6)
# 2.2  powers and 1/x
primitive("P2.2a x^4 - 2x^3 + 5x", lambda x: x ** 4 - 2 * x ** 3 + 5 * x, lambda x: 4 * x ** 3 - 6 * x * x + 5, XS)
primitive("P2.2b (2/3)x^(3/2) - 1/x", lambda x: 2 / 3 * x ** 1.5 - 1 / x, lambda x: sqrt(x) + 1 / x ** 2, XP)
primitive("P2.2c x^2/2 + 3 ln|x|", lambda x: x * x / 2 + 3 * log(abs(x)), lambda x: (x * x + 3) / x, XS)
# 2.3  sine, cosine and e
primitive("P2.3a 3 sin x - 2 cos x", lambda x: 3 * sin(x) - 2 * cos(x), lambda x: 3 * cos(x) + 2 * sin(x), XS)
primitive("P2.3b -e^(-4x)/4", lambda x: -exp(-4 * x) / 4, lambda x: exp(-4 * x), XS)
primitive("P2.3c -2 cos(x/2)", lambda x: -2 * cos(x / 2), lambda x: sin(x / 2), XS)
primitive("P2.3d e^x + tan x", lambda x: exp(x) + tan(x), lambda x: exp(x) + 1 / cos(x) ** 2, (-1.2, -0.4, 0.5, 1.3))
# 2.4  any base
primitive("P2.4a 2^x / ln 2", lambda x: 2 ** x / log(2), lambda x: 2 ** x, XS)
primitive("P2.4b 3^(2x) / (2 ln 3)", lambda x: 3 ** (2 * x) / (2 * log(3)), lambda x: 3 ** (2 * x), XS)
primitive("P2.4c -1/(5^x ln 5)", lambda x: -1 / (5 ** x * log(5)), lambda x: 1 / 5 ** x, XS)
check_true("P2.4c ln|5^x| is not a primitive of 1/5^x", abs(d1(lambda x: log(5 ** x), 0.7) - 1 / 5 ** 0.7) > 0.1)
# 2.5  logarithms
primitive("P2.5a ln|3x+2|/3", lambda x: log(abs(3 * x + 2)) / 3, lambda x: 1 / (3 * x + 2), (-1.7, -0.9, 0.3, 2.4))
primitive("P2.5b -2 ln|1-2x|", lambda x: -2 * log(abs(1 - 2 * x)), lambda x: 4 / (1 - 2 * x), (-1.7, -0.6, 0.3, 1.1, 2.4))
primitive("P2.5c ln|x^2+x-2|", lambda x: log(abs(x * x + x - 2)), lambda x: (2 * x + 1) / (x * x + x - 2), (-3.1, -1.7, -0.6, 0.3, 2.4))
for x in (-3.1, -0.6, 0.3, 2.4):
    check(f"P2.5c partial fractions 1/(x-1) + 1/(x+2) at {x}", 1 / (x - 1) + 1 / (x + 2), (2 * x + 1) / (x * x + x - 2))
check("P2.5c A = 1 from x = 1: 3 = 3A", Fr(3, 3), 1); check("P2.5c B = 1 from x = -2: -3 = -3B", Fr(-3, -3), 1)
# 2.6  simplify first
for x in XS:
    check(f"P2.6a (1-e^(2x))/(1+e^x) = 1 - e^x at {x}", (1 - exp(2 * x)) / (1 + exp(x)), 1 - exp(x))
    check(f"P2.6c (2^x+4^x)/2^x = 1 + 2^x at {x}", (2 ** x + 4 ** x) / 2 ** x, 1 + 2 ** x)
    check(f"P2.6b (x+1)^2/x = x + 2 + 1/x at {x}", (x + 1) ** 2 / x, x + 2 + 1 / x)
primitive("P2.6a x - e^x", lambda x: x - exp(x), lambda x: (1 - exp(2 * x)) / (1 + exp(x)), XS)
primitive("P2.6b x^2/2 + 2x + ln|x|", lambda x: x * x / 2 + 2 * x + log(abs(x)), lambda x: (x + 1) ** 2 / x, XS)
primitive("P2.6c x + 2^x/ln 2", lambda x: x + 2 ** x / log(2), lambda x: (2 ** x + 4 ** x) / 2 ** x, XS)
# 2.7  definite integrals
check("P2.7a int_1^2 (3x^2 - 2x) = 4", integral(lambda x: 3 * x * x - 2 * x, 1, 2), 4)
check("P2.7a F(2) = 4, F(1) = 0", (8 - 4) + (1 - 1), 4)
check("P2.7b int_0^pi sin = 2", integral(sin, 0, pi), 2)
check("P2.7b F(pi) = 1, F(0) = -1", -cos(pi) - (-cos(0)), 2)
check("P2.7c int_0^1 e^(2x) = (e^2-1)/2", integral(lambda x: exp(2 * x), 0, 1), (math.e ** 2 - 1) / 2)
check("P2.7d int_1^e 1/x = 1", integral(lambda x: 1 / x, 1, math.e), 1)
# 2.8  swapped limits and arctan
check("P2.8a int_(pi/2)^0 cos = -1", integral(cos, pi / 2, 0), -1)
check("P2.8a minus int_0^(pi/2) cos", -integral(cos, 0, pi / 2), -1)
check("P2.8b int_-1^1 1/(1+x^2) = pi/2", integral(lambda x: 1 / (1 + x * x), -1, 1), pi / 2)
check("P2.8b pi/4 - (-pi/4)", atan(1) - atan(-1), pi / 2)
check("P2.8c int_0^sqrt3 1/(1+x^2) = pi/3", integral(lambda x: 1 / (1 + x * x), 0, sqrt(3)), pi / 3)
check("P2.8c tan(pi/3) = sqrt3", tan(pi / 3), sqrt(3))
# 2.9  area of x^2 - x - 2 on [0, 3]
f = lambda x: x * x - x - 2
F = lambda x: Fr(x) ** 3 / 3 - Fr(x) ** 2 / 2 - 2 * Fr(x)
primitive("P2.9 F = x^3/3 - x^2/2 - 2x", lambda x: x ** 3 / 3 - x * x / 2 - 2 * x, f, XS)
check("P2.9 F(0) = 0", F(0), 0); check("P2.9 F(2) = -10/3", F(2), Fr(-10, 3)); check("P2.9 F(3) = -3/2", F(3), Fr(-3, 2))
check("P2.9a integral -3/2", integral(f, 0, 3), -1.5)
check("P2.9 F(3) - F(2) = 11/6", F(3) - F(2), Fr(11, 6))
check("P2.9b area 31/6", integral(lambda x: abs(f(x)), 0, 2, 4000) + integral(lambda x: abs(f(x)), 2, 3, 4000), 31 / 6)
check("P2.9 10/3 + 11/6 = 31/6", Fr(10, 3) + Fr(11, 6), Fr(31, 6))
check("P2.9 f = (x-2)(x+1)", f(0.37), (0.37 - 2) * (0.37 + 1))
check_true("P2.9 f < 0 on [0,2), f > 0 on (2,3]", all(f(x / 100) < 0 for x in range(0, 200)) and all(f(2 + x / 100) > 0 for x in range(1, 101)))

# ================= SUMMARY: Day 14 & 15 =================
# partial sums, for many n
for n in range(1, 31):
    ks = range(1, n + 1)
    check(f"sum 1 = n (n={n})", sum(1 for _ in ks), n)
    check(f"sum k (n={n})", sum(ks), Fr(n * (n + 1), 2))
    check(f"sum k^2 (n={n})", sum(k * k for k in ks), Fr(n * (n + 1) * (2 * n + 1), 6))
    check(f"sum k^3 (n={n})", sum(k ** 3 for k in ks), Fr(n * n * (n + 1) ** 2, 4))
    check(f"a constant added n times: sum 3 = 3n (n={n})", sum(3 for _ in ks), 3 * n)
    check(f"constant factor: sum 5k^2 = 5 sum k^2 (n={n})", sum(5 * k * k for k in ks), 5 * sum(k * k for k in ks))
# strips: strip k runs from a+(k-1)dx to a+k dx, and the three sample points lie in it
a, b, n = Fr(1), Fr(4), 6
dx = (b - a) / n
check("strip width (b-a)/n", dx, Fr(1, 2))
check("last strip ends at b", a + n * dx, b)
check_true("left, mid, right sample points lie in their strip",
           all(a + (k - 1) * dx <= a + (k - 1 + t) * dx <= a + k * dx for k in range(1, n + 1) for t in (0, Fr(1, 2), 1)))
# every choice of sample point tends to the same limit
for where in ('left', 'mid', 'right'):
    check(f"{where} sums of e^x on [0,1] tend to e - 1", float(riemann(lambda x: exp(float(x)), 0, 1, 20000, where)), math.e - 1, 1e-4)
# the class example: x^2 from 0 to L, right ends: S_n = (L^3/6)(n+1)(2n+1)/n^2 -> L^3/3
for L in (Fr(1), Fr(2), Fr(3, 2), Fr(5)):
    for n in (1, 2, 5, 12, 40):
        check(f"x^2 on [0,{L}] S_{n}", riemann(sq, 0, L, n), L ** 3 / 6 * Fr((n + 1) * (2 * n + 1), n * n))
        check(f"x^2 on [0,{L}] S_{n} = L^3/n^3 sum k^2", riemann(sq, 0, L, n), L ** 3 / n ** 3 * sum(k * k for k in range(1, n + 1)))
    check(f"x^2 on [0,{L}] area L^3/3", integral(sq, 0, float(L)), float(L) ** 3 / 3)
check("(n+1)(2n+1)/n^2 -> 2", (10**7 + 1) * (2 * 10**7 + 1) / 10**14, 2, 1e-6)
# signed area: the integral of x - 1 on [0, 2] is 0, the region's area 1
check("integral of x-1 on [0,2] is 0", integral(lambda x: x - 1, 0, 2), 0, 1e-9)
check("its area is 1", integral(lambda x: abs(x - 1), 0, 1) + integral(lambda x: abs(x - 1), 1, 2), 1)
check("right sums of x-1 on [0,2] tend to 0", float(riemann(lambda x: x - 1, 0, 2, 10**4)), 0, 1e-3)
# the class example x^2 + x - 2 is checked under P1.9; the shortcut F(b) - F(a): F(x) = x^3/3 gives L^3/3
check("F = x^3/3: F(2) - F(0)", Fr(2) ** 3 / 3, Fr(8, 3))
check("watch: the -2 gives -4 in S_n: (4/n) * n", Fr(4, 7) * 7, 4)

# ================= SUMMARY: Day 16 & 17 =================
# the general form on [a, b] with right ends is the right Riemann sum, and on [0, 1] it is (1/N) sum f(k/N)
for (a0, b0) in ((Fr(0), Fr(1)), (Fr(-1), Fr(2)), (Fr(1, 2), Fr(3))):
    for N in (1, 3, 8, 20):
        gen = sum(cube(a0 + Fr(k) * (b0 - a0) / N) * (b0 - a0) / N for k in range(1, N + 1))
        check(f"general form S_N on [{a0},{b0}] (N={N})", gen, riemann(cube, a0, b0, N))
for N in (1, 4, 10):
    check(f"on [0,1]: S_N = (1/N) sum f(k/N) (N={N})", sum(sq(Fr(k, N)) for k in range(1, N + 1)) / N, riemann(sq, 0, 1, N))
check("its limit is the integral (x^3 on [-1, 2], N = 4000)", float(riemann(cube, -1, 2, 4000)), (16 - 1) / 4, 1e-3)
# exchange of initial and final points, zero width, joining, linearity (for any order of a, b, c)
f1, g1 = (lambda x: exp(x) - x * x), (lambda x: sin(3 * x) + 2)
for (a0, b0, c0) in ((0, 1, 2.5), (0, 2.5, 1), (1.5, -0.5, 0.7)):
    check(f"exchange of the points ({a0},{b0})", integral(f1, b0, a0), -integral(f1, a0, b0))
    check(f"joining intervals ({a0},{b0},{c0})", integral(f1, a0, b0) + integral(f1, b0, c0), integral(f1, a0, c0))
    check(f"sums and constants ({a0},{b0})", integral(lambda x: 2.5 * f1(x) - 4 * g1(x), a0, b0), 2.5 * integral(f1, a0, b0) - 4 * integral(g1, a0, b0))
    check(f"a constant function: int 7 dx = 7(b-a) ({a0},{b0})", integral(lambda x: 7.0, a0, b0), 7 * (b0 - a0))
check("zero width", integral(f1, 1.3, 1.3), 0)
for N in (5, 9):
    check_true(f"from b back to a every dx is negative (N={N})", (Fr(1) - Fr(3)) / N < 0)
# primitive and ambiguity: x^3/3 and x^3/3 + C are primitives of x^2; two primitives differ by a constant
for C in (0, 4, -2.5):
    primitive(f"x^3/3 + {C}", lambda x, C=C: x ** 3 / 3 + C, sq, XS)
Fa, Fb = (lambda x: sin(x) ** 2), (lambda x: -cos(x) ** 2)       # both primitives of 2 sin x cos x
primitive("sin^2 x", Fa, lambda x: 2 * sin(x) * cos(x), XS)
primitive("-cos^2 x", Fb, lambda x: 2 * sin(x) * cos(x), XS)
check_true("they differ by the constant 1", all(abs(Fa(x) - Fb(x) - 1) < 1e-12 for x in XS))
check("F(1) = 4 picks C: x^3/3 + 11/3", Fr(1, 3) + Fr(11, 3), 4)
# the definite integral from a primitive, with any C
for C in (0, 7):
    check(f"[F]_a^b with C = {C}: int_0.2^1.4 cos = sin 1.4 - sin 0.2", (sin(1.4) + C) - (sin(0.2) + C), integral(cos, 0.2, 1.4))
# the fundamental primitive functions (b > 0, b != 1)
for nn in (0, 1, 2, 3, -2, 0.5, -0.5):
    primitive(f"x^n with n = {nn}", lambda x, nn=nn: x ** (nn + 1) / (nn + 1), lambda x, nn=nn: x ** nn, XP)
primitive("ln|x| (x > 0 and x < 0)", lambda x: log(abs(x)), lambda x: 1 / x, XS)
primitive("e^x", exp, exp, XS)
for bb in (2, 3, 0.5, 10):
    primitive(f"b^x / ln b with b = {bb}", lambda x, bb=bb: bb ** x / log(bb), lambda x, bb=bb: bb ** x, XS)
primitive("-cos x", lambda x: -cos(x), sin, XS)
primitive("sin x", sin, cos, XS)
primitive("tan x", tan, lambda x: 1 / cos(x) ** 2, (-1.2, -0.4, 0.5, 1.3))
primitive("arctan x", atan, lambda x: 1 / (1 + x * x), XS)
# a number inside: divide by it
for aa in (2, -3, 0.5):
    primitive(f"e^(ax)/a, a = {aa}", lambda x, aa=aa: exp(aa * x) / aa, lambda x, aa=aa: exp(aa * x), XS)
    primitive(f"b^(ax)/(a ln b), b = 3, a = {aa}", lambda x, aa=aa: 3 ** (aa * x) / (aa * log(3)), lambda x, aa=aa: 3 ** (aa * x), XS)
    primitive(f"-cos(ax)/a, a = {aa}", lambda x, aa=aa: -cos(aa * x) / aa, lambda x, aa=aa: sin(aa * x), XS)
    primitive(f"sin(ax)/a, a = {aa}", lambda x, aa=aa: sin(aa * x) / aa, lambda x, aa=aa: cos(aa * x), XS)
# logarithms: 1/(ax + b), on both sides of the zero of ax + b
for (aa, bb) in ((3, 2), (-2, 1), (0.5, -1)):
    primitive(f"ln|ax+b|/a, a = {aa}, b = {bb}", lambda x, aa=aa, bb=bb: log(abs(aa * x + bb)) / aa, lambda x, aa=aa, bb=bb: 1 / (aa * x + bb), (-3.1, -0.6, 0.3, 1.1, 3.7))
# rewrite first: 1/3^x = 3^(-x), primitive -3^(-x)/ln 3
primitive("-3^(-x)/ln 3", lambda x: -3 ** (-x) / log(3), lambda x: 1 / 3 ** x, XS)
for x in XP:
    check(f"sqrt x = x^(1/2) at {x}", sqrt(x), x ** 0.5)
# arctan values and symmetry
check("arctan 0 = 0", atan(0), 0); check("arctan(1/sqrt3) = pi/6", atan(1 / sqrt(3)), pi / 6)
check("arctan 1 = pi/4", atan(1), pi / 4); check("arctan sqrt3 = pi/3", atan(sqrt(3)), pi / 3)
for x in XS:
    check(f"arctan(-x) = -arctan x at {x}", atan(-x), -atan(x))
check_true("arctan stays between -pi/2 and pi/2", all(-pi / 2 < atan(x) < pi / 2 for x in (-1e6, -3, 0, 5, 1e6)))
# watch-outs of 5 & 6 Nov
primitive("watch: cos 3x has primitive sin(3x)/3", lambda x: sin(3 * x) / 3, lambda x: cos(3 * x), XS)
primitive("watch: e^(-x) has primitive -e^(-x)", lambda x: -exp(-x), lambda x: exp(-x), XS)
primitive("watch: 1/(2x+1) has primitive ln|2x+1|/2", lambda x: log(abs(2 * x + 1)) / 2, lambda x: 1 / (2 * x + 1), (-1.7, -0.9, 0.3, 2.4))
check_true("watch: ln|2x+1| itself is not a primitive of 1/(2x+1)", abs(d1(lambda x: log(abs(2 * x + 1)), 0.3) - 1 / 1.6) > 0.1)
check_true("watch: 2^(x+1)/(x+1) is not a primitive of 2^x", abs(d1(lambda x: 2 ** (x + 1) / (x + 1), 0.8) - 2 ** 0.8) > 0.1)
check_true("watch: ln|3^x| is not a primitive of 1/3^x", abs(d1(lambda x: log(3 ** x), 0.8) - 1 / 3 ** 0.8) > 0.1)
check("watch: tan^-1 1 = pi/4", atan(1), pi / 4)
check_true("watch: 1/tan 1 is a different number", abs(1 / tan(1) - pi / 4) > 0.1, f"1/tan 1 = {1 / tan(1):.4f}")
check("watch: [-cos x]_0^pi = 2", -cos(pi) - (-cos(0)), 2)
check("watch: int_-1^1 x dx = 0", integral(lambda x: x, -1, 1), 0)
check("watch: its area is 1", integral(lambda x: abs(x), -1, 0) + integral(lambda x: abs(x), 0, 1), 1)
# habits
primitive("habit: (-cos x)' = sin x", lambda x: -cos(x), sin, XS)
check("habit: 16/3 is about 5.33", 16 / 3, 5.3333333, 1e-6)

# ================= FORMULAS =================
# g1: the Riemann sum and definite integral, for a function that is not a polynomial
for n in (200, 2000):
    check(f"definite integral: right sums of cos on [0, 1.3] (n={n})", float(riemann(lambda x: cos(float(x)), 0, Fr(13, 10), n)), sin(1.3), 1 / n * 2)
check("signed area: A_above - A_below for sin on [0, 3pi/2]",
      integral(sin, 0, 3 * pi / 2), integral(sin, 0, pi) - (-integral(sin, pi, 3 * pi / 2)))
# g2: with a primitive, and the area of the region
for (fn, F, a0, b0, name) in ((cos, sin, 0.2, 1.4, 'cos/sin'), (lambda x: 1 / x, log, 1.0, 3.5, '1/x / ln'),
                              (lambda x: 3 * x * x + 1, lambda x: x ** 3 + x, -1.0, 2.0, 'polynomial'),
                              (lambda x: 1 / (1 + x * x), atan, -0.5, 2.0, 'arctan')):
    check(f"with a primitive: {name}", integral(fn, a0, b0), F(b0) - F(a0))
check("area of the region = int |f|: x^2 - 1 on [-2, 0]", integral(lambda x: abs(x * x - 1), -2, -1) + integral(lambda x: abs(x * x - 1), -1, 0), 2)
# g2b: every row is a primitive checked above; one more with values: int_0^1 b^(ax) dx
check("b^(ax) row: int_0^1 2^(3x) = (8 - 1)/(3 ln 2)", integral(lambda x: 2 ** (3 * x), 0, 1), 7 / (3 * log(2)))

# ================= FOLLOW-UPS (Quiz 06) =================
def SN(f, a, b, N):
    return riemann(f, a, b, N)
# 06-A
f = lambda x: 3 * x * x - 2 * x + 2
for N in (1, 2, 3, 7, 40):
    check(f"06A Q1 S_{N} = (4N^2+N+1)/(2N^2)", SN(f, 0, 1, N), Fr(4 * N * N + N + 1, 2 * N * N))
    check(f"06A Q1 S_{N} before simplifying", SN(f, 0, 1, N), Fr(3, N ** 3) * Fr(N * (N + 1) * (2 * N + 1), 6) - Fr(2, N * N) * Fr(N * (N + 1), 2) + 2)
check("06A Q1 limit 2", integral(f, 0, 1), 2)
check("06A Q2(1) 3/4", integral(lambda x: x ** 3 - 3 * x * x + 2, -1, 2), 0.75)
check("06A Q2(1) F(2) = 0, F(-1) = -3/4", (2 ** 4 / 4 - 8 + 4) - (1 / 4 + 1 - 2), 0.75)
check("06A Q2(2) 1/3", integral(lambda x: cos(3 * x), 0, pi / 6), 1 / 3)
check("06A Q2(3) (1 - e^-2)/2", integral(lambda x: exp(-2 * x), 0, 1), (1 - exp(-2)) / 2)
check("06A Q2(4) pi/3", integral(lambda x: 1 / (1 + x * x), 0, sqrt(3)), pi / 3)
f = lambda x: x * x - 3 * x + 2
F = lambda x: Fr(x) ** 3 / 3 - Fr(3, 2) * Fr(x) ** 2 + 2 * Fr(x)
check("06A Q3 F(1) = 5/6", F(1), Fr(5, 6)); check("06A Q3 F(2) = 2/3", F(2), Fr(2, 3)); check("06A Q3 F(3) = 3/2", F(3), Fr(3, 2))
check("06A Q3 area 11/6", sum(integral(lambda x: abs(f(x)), p, q, 4000) for (p, q) in ((0, 1), (1, 2), (2, 3))), 11 / 6)
check("06A Q3 the integral alone 3/2", integral(f, 0, 3), 1.5)
check_true("06A Q3 signs: + on [0,1), - on (1,2), + on (2,3]", f(0.5) > 0 and f(1.5) < 0 and f(2.5) > 0)
# 06-B
f = lambda x: x * x + 1
for N in (1, 2, 3, 7, 40):
    check(f"06B Q1 S_{N} = (14N^2+12N+4)/(3N^2)", SN(f, 0, 2, N), Fr(14 * N * N + 12 * N + 4, 3 * N * N))
    check(f"06B Q1 S_{N} before simplifying", SN(f, 0, 2, N), Fr(4 * (N + 1) * (2 * N + 1), 3 * N * N) + 2)
check("06B Q1 limit 14/3", integral(f, 0, 2), 14 / 3)
F = lambda x: Fr(x) ** 4 / 2 - Fr(x) ** 3 / 3 + 3 * Fr(x)
check("06B Q2(1) F(-2) = 14/3", F(-2), Fr(14, 3)); check("06B Q2(1) F(1) = 19/6", F(1), Fr(19, 6))
check("06B Q2(1) -3/2", integral(lambda x: 2 * x ** 3 - x * x + 3, -2, 1), -1.5)
check("06B Q2(2) 2/3", integral(lambda x: sin(3 * x), 0, pi / 3), 2 / 3)
check("06B Q2(3) e - 1", integral(lambda x: exp(-x), -1, 0), math.e - 1)
check("06B Q2(4) 7pi/12", integral(lambda x: 1 / (1 + x * x), -sqrt(3), 1), 7 * pi / 12)
check("06B Q2(4) pi/4 + pi/3", atan(1) - atan(-sqrt(3)), 7 * pi / 12)
f = lambda x: x * x - 1
F = lambda x: Fr(x) ** 3 / 3 - Fr(x)
check("06B Q3 F(-2) = -2/3", F(-2), Fr(-2, 3)); check("06B Q3 F(-1) = 2/3", F(-1), Fr(2, 3))
check("06B Q3 pieces 4/3 and -2/3", (F(-1) - F(-2)) * 10 + (F(0) - F(-1)), Fr(40, 3) - Fr(2, 3))
check("06B Q3 area 2", integral(lambda x: abs(f(x)), -2, -1) + integral(lambda x: abs(f(x)), -1, 0), 2)
check("06B Q3 the integral alone 2/3", integral(f, -2, 0), 2 / 3)

# ================= GRAPH (riemann) =================
check("graph: n = 4 right sum, as in P1.1", riemann(sq, 0, 2, 4, 'right'), Fr(15, 4))
check("graph: area 8/3 shown as 2.6667", round(8 / 3, 4), 2.6667)
check_true("graph: the error shrinks as n grows (right ends)",
           all(riemann(sq, 0, 2, n + 1) - Fr(8, 3) < riemann(sq, 0, 2, n) - Fr(8, 3) for n in range(1, 40)))

print("\nFAILED:" if fails else "\nALL INTEGRAL CHECKS PASSED", fails if fails else "")
sys.exit(1 if fails else 0)
