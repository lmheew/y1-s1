"""Numeric checks for the Calculus midterm 2 page (src/math/integrals): every practice answer, every claim in the
Summary, the formula sheet, the follow-up quizzes and the Riemann-sum graph. Riemann sums are added up exactly with
fractions and compared with the closed forms on the page; limits and integrals are checked against high-accuracy
numeric integration, and every primitive by differentiating it numerically at several points.
Each check prints PASS/FAIL; the script exits non-zero if anything fails.

    python3 src/math/integrals/verify.py"""
import math, sys
from fractions import Fraction as Fr
from math import sin, cos, tan, exp, log, sqrt, pi, atan, atan2, asin

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

# ================= 9 Nov: inverse trigonometric functions (u2, g2c, P2.10) =================
from math import asin, acos
XI = (-0.9, -0.5, 0.0, 0.3, 0.8)             # inside (-1, 1)
primitive("arcsin' = 1/sqrt(1-x^2)", asin, lambda x: 1 / sqrt(1 - x * x), XI)
primitive("arccos' = -1/sqrt(1-x^2)", acos, lambda x: -1 / sqrt(1 - x * x), XI)
primitive("arctan' = 1/(1+x^2)", atan, lambda x: 1 / (1 + x * x), XS)
check("int_0^0.6 1/sqrt(1-x^2) = arcsin 0.6", integral(lambda x: 1 / sqrt(1 - x * x), 0, 0.6), asin(0.6))
for (v, ang) in ((0.5, pi / 6), (sqrt(2) / 2, pi / 4), (sqrt(3) / 2, pi / 3), (1.0, pi / 2), (0.0, 0.0)):
    check(f"arcsin {v:.4f} = {ang:.4f}", asin(v), ang)
for x in XI:
    check(f"arcsin(-x) = -arcsin x at {x}", asin(-x), -asin(x))
    check_true(f"ranges at {x}", -pi / 2 <= asin(x) <= pi / 2 and 0 <= acos(x) <= pi)
    check_true(f"cos(arcsin x) = sqrt(1-x^2) >= 0 at {x}", abs(cos(asin(x)) - sqrt(1 - x * x)) < 1e-12)
check("P2.10a arcsin(sqrt2/2) = pi/4", asin(sqrt(2) / 2), pi / 4)
check("P2.10a arcsin(-1/2) = -pi/6", asin(-0.5), -pi / 6)
check("P2.10b int_0^(1/2) = pi/6", integral(lambda x: 1 / sqrt(1 - x * x), 0, 0.5), pi / 6)
check("P2.10c int_(-1/2)^(sqrt3/2) = pi/2", integral(lambda x: 1 / sqrt(1 - x * x), -0.5, sqrt(3) / 2), pi / 2, 1e-8)

# ================= 9 & 10 Nov: substitution and parts (u3) =================
# Summary
primitive("summary: x e^(x^2) -> e^(x^2)/2", lambda x: exp(x * x) / 2, lambda x: x * exp(x * x), XS)
primitive("summary: 2x/(x^2+1) -> ln(x^2+1)", lambda x: log(x * x + 1), lambda x: 2 * x / (x * x + 1), XS)
primitive("summary: ln x / x -> (ln x)^2/2", lambda x: log(x) ** 2 / 2, lambda x: log(x) / x, XP)
check("summary: substitution for a definite integral (cos(x^2) 2x on [0.3, 1.2])", integral(lambda x: cos(x * x) * 2 * x, 0.3, 1.2), integral(cos, 0.09, 1.44))
slide = ((1 + exp(2)) ** 1.5 - sqrt(2) ** 3) / 3
check("summary/P3.1: int_0^1 e^(2x) sqrt(1+e^(2x)) = ((1+e^2)^(3/2) - (sqrt2)^3)/3", integral(lambda x: exp(2 * x) * sqrt(1 + exp(2 * x)), 0, 1), slide)
check("P3.1 with u = e^(2x): (1/2) int_1^(e^2) sqrt(1+u)", 0.5 * integral(lambda u: sqrt(1 + u), 1, exp(2)), slide)
check("P3.1 with u = 1 + e^(2x): (1/2) int_2^(1+e^2) sqrt(u)", 0.5 * integral(sqrt, 2, 1 + exp(2)), slide)
check("P3.1 2^(3/2) = 2 sqrt2", 2 ** 1.5, 2 * sqrt(2))
for x in XS:
    check(f"summary/P3.3: 1/(x^2+3x+2) = 1/(x+1) - 1/(x+2) at {x}", 1 / (x * x + 3 * x + 2), 1 / (x + 1) - 1 / (x + 2))
primitive("summary/P3.3: ln|(x+1)/(x+2)|", lambda x: log(abs((x + 1) / (x + 2))), lambda x: 1 / (x * x + 3 * x + 2), (-3.1, -1.5, 0.3, 2.4))
check("P3.3 int_0^1 = ln(4/3)", integral(lambda x: 1 / (x * x + 3 * x + 2), 0, 1), log(4 / 3))
check("P3.3 A = 1 from x = -1, B = -1 from x = -2", 1 / (-1 + 2) - 1, 0); check("P3.3 B", 1 / (-2 + 1), -1)
for x in XS:
    check(f"summary/P3.4: 1/(x^2+2x+5) = (1/4)/(((x+1)/2)^2+1) at {x}", 1 / (x * x + 2 * x + 5), 0.25 / (((x + 1) / 2) ** 2 + 1))
primitive("summary/P3.4: (1/2) arctan((x+1)/2)", lambda x: atan((x + 1) / 2) / 2, lambda x: 1 / (x * x + 2 * x + 5), XS)
check("P3.4 int_-1^1 = pi/8", integral(lambda x: 1 / (x * x + 2 * x + 5), -1, 1), pi / 8)
for (p, a0) in ((1.0, 2.0), (-2.5, 0.5), (0.0, 3.0)):
    primitive(f"formula: arctan form p={p} a={a0}", lambda x, p=p, a0=a0: atan((x + p) / a0) / a0, lambda x, p=p, a0=a0: 1 / ((x + p) ** 2 + a0 * a0), XS)
    primitive(f"formula: a perfect square p={p}", lambda x, p=p: -1 / (x + p), lambda x, p=p: 1 / (x + p) ** 2, (-3.7, 0.4, 2.9))
for (b0, c0) in ((2, 5), (-3, 1), (4, 4)):
    for x in XS:
        check(f"formula: making a square b={b0} c={c0} at {x}", x * x + b0 * x + c0, (x + b0 / 2) ** 2 + c0 - b0 * b0 / 4)
check_true("summary: Delta of x^2+3x+2 > 0, of x^2+2x+5 < 0, of x^2-4x+4 = 0", 9 - 8 > 0 and 4 - 20 < 0 and 16 - 16 == 0)
for x in XS:
    check(f"summary: 2x/(x^2+2x+2) = (2x+2)/(...) - 2/((x+1)^2+1) at {x}", 2 * x / (x * x + 2 * x + 2), (2 * x + 2) / (x * x + 2 * x + 2) - 2 / ((x + 1) ** 2 + 1))
# sqrt(ax + b): t = sqrt(x - 1)
for x in (1.2, 2.0, 5.5):
    t = sqrt(x - 1)
    check(f"summary/P3.5: x + 2 sqrt(x-1) = (t+1)^2 at {x}", x + 2 * sqrt(x - 1), (t + 1) ** 2)
    check(f"P3.5: 2t/(t+1)^2 = 2/(t+1) - 2/(t+1)^2 at t={t:.3f}", 2 * t / (t + 1) ** 2, 2 / (t + 1) - 2 / (t + 1) ** 2)
F35 = lambda x: 2 * log(sqrt(x - 1) + 1) + 2 / (sqrt(x - 1) + 1)
primitive("summary/P3.5: 2 ln(sqrt(x-1)+1) + 2/(sqrt(x-1)+1)", F35, lambda x: 1 / (x + 2 * sqrt(x - 1)), (1.3, 2.0, 4.5, 9.0))
for (a0, b0) in ((1.0, -1.0), (2.0, 3.0), (0.5, 1.0)):
    t0 = 1.7
    x0 = (t0 * t0 - b0) / a0
    check(f"formula: t = sqrt(ax+b) gives x = (t^2-b)/a (a={a0})", sqrt(a0 * x0 + b0), t0)
    check(f"formula: dx/dt = 2t/a (a={a0})", d1(lambda t: (t * t - b0) / a0, t0), 2 * t0 / a0)
# u = tan(x/2)
for x in (-2.5, -1.0, 0.4, 1.3, 2.8):
    u = tan(x / 2)
    check(f"summary: cos x = (1-u^2)/(1+u^2) at {x}", cos(x), (1 - u * u) / (1 + u * u))
    check(f"summary: sin x = 2u/(1+u^2) at {x}", sin(x), 2 * u / (1 + u * u))
    check(f"summary: u^2 = (1-cos x)/(1+cos x) at {x}", u * u, (1 - cos(x)) / (1 + cos(x)))
    check(f"summary: 1 + u^2 = 2/(1+cos x) at {x}", 1 + u * u, 2 / (1 + cos(x)))
    check(f"summary: 1 - u^2 = 2cos x/(1+cos x) at {x}", 1 - u * u, 2 * cos(x) / (1 + cos(x)))
    check(f"summary: (du/dx)^-1 = 2cos^2(x/2) = 1 + cos x = 2/(1+u^2) at {x}", 1 / d1(lambda s: tan(s / 2), x), 2 / (1 + u * u), 1e-6)
    check(f"formula: tan(x/2) = sin x/(1+cos x) at {x}", tan(x / 2), sin(x) / (1 + cos(x)))
F36 = lambda x: tan(x / 2) + log(1 + tan(x / 2) ** 2)
primitive("summary/P3.6: tan(x/2) + ln(1+tan^2(x/2))", F36, lambda x: (1 + sin(x)) / (1 + cos(x)), (-2.5, -1.0, 0.4, 1.3, 2.8))
for u in (-1.5, 0.2, 2.0):
    check(f"P3.6: (1+2u+u^2)/(1+u^2) = 1 + 2u/(1+u^2) at {u}", (1 + 2 * u + u * u) / (1 + u * u), 1 + 2 * u / (1 + u * u))
# integration by parts
primitive("summary/P3.10a: x sin x -> -x cos x + sin x", lambda x: -x * cos(x) + sin(x), lambda x: x * sin(x), XS)
primitive("summary/P3.10b: ln x -> x ln x - x", lambda x: x * log(x) - x, log, XP)
for (fn, fd, gp, g, a0, b0) in ((lambda x: x, lambda x: 1, cos, sin, 0.2, 1.9), (lambda x: x * x, lambda x: 2 * x, exp, exp, -1.0, 1.5),
                                (log, lambda x: 1 / x, lambda x: x, lambda x: x * x / 2, 1.0, 3.0)):
    check(f"formula: by parts with limits on [{a0},{b0}]", integral(lambda x: fn(x) * gp(x), a0, b0),
          (fn(b0) * g(b0) - fn(a0) * g(a0)) - integral(lambda x: fd(x) * g(x), a0, b0))
    check(f"formula: (fg)' = f'g + fg' at {a0 + 0.3}", d1(lambda x: fn(x) * g(x), a0 + 0.3), fd(a0 + 0.3) * g(a0 + 0.3) + fn(a0 + 0.3) * gp(a0 + 0.3))
F311 = lambda x: x * log(x * x + 1) - 2 * x + 2 * atan(x)
primitive("summary/P3.11: x ln(x^2+1) - 2x + 2 arctan x", F311, lambda x: log(x * x + 1), XS)
for x in XS:
    check(f"P3.11: 2x^2/(x^2+1) = 2 - 2/(x^2+1) at {x}", 2 * x * x / (x * x + 1), 2 - 2 / (x * x + 1))
check("summary/P3.11: int_0^1 ln(x^2+1) = ln2 - 2 + pi/2", integral(lambda x: log(x * x + 1), 0, 1), log(2) - 2 + pi / 2)
F312 = lambda x: exp(2 * x) / 4 * (2 * x * x - 2 * x + 1)
primitive("summary/P3.12: e^(2x)(2x^2-2x+1)/4", F312, lambda x: x * x * exp(2 * x), XS)
primitive("P3.12: second round x e^(2x) -> x e^(2x)/2 - e^(2x)/4", lambda x: x * exp(2 * x) / 2 - exp(2 * x) / 4, lambda x: x * exp(2 * x), XS)
check("summary/P3.12: int_0^2 x^2 e^(2x) = (5e^4-1)/4", integral(lambda x: x * x * exp(2 * x), 0, 2, 4000), (5 * exp(4) - 1) / 4, 1e-8)
check("P3.12 F(2) = 5e^4/4, F(0) = 1/4", F312(2) - F312(0), (5 * exp(4) - 1) / 4)
# watch-outs
check("watch: (1 + e^(2x))' = 2e^(2x)", d1(lambda x: 1 + exp(2 * x), 0.7), 2 * exp(1.4))
for x in XS:
    check(f"watch: x/(x^2+1) dx = (1/2) du/u with u = x^2+1, du = 2x dx at {x}", x / (x * x + 1), 0.5 * (2 * x) / (x * x + 1))
check("watch: int_1^2 ln x/x = int_0^ln2 u du", integral(lambda x: log(x) / x, 1, 2), log(2) ** 2 / 2)
primitive("watch: 1/(x^2-4x+4) -> -1/(x-2)", lambda x: -1 / (x - 2), lambda x: 1 / (x * x - 4 * x + 4), (-1.0, 0.5, 3.5))
check("watch: (1/4) * 2 du = (1/2) du", 0.25 * 2, 0.5)
primitive("watch: x e^x by parts -> (x-1)e^x", lambda x: (x - 1) * exp(x), lambda x: x * exp(x), XS)
# Exercise (1) and Exercise (2)
check("P3.2a int_1^2 ln x/x = (ln2)^2/2", integral(lambda x: log(x) / x, 1, 2), log(2) ** 2 / 2)
check_true("P3.2a (ln2)^2 is not ln(2^2)", abs(log(2) ** 2 - log(4)) > 0.5)
check("P3.2b int_0^1 (x+1)/(x^2+1) = ln2/2 + pi/4", integral(lambda x: (x + 1) / (x * x + 1), 0, 1), log(2) / 2 + pi / 4)
check("P3.2b first part (1/2) int_1^2 du/u", 0.5 * integral(lambda u: 1 / u, 1, 2), log(2) / 2)
F37 = lambda x: log(x * x + 2 * x + 2) - 2 * atan(x + 1)
primitive("P3.7: ln(x^2+2x+2) - 2 arctan(x+1)", F37, lambda x: 2 * x / (x * x + 2 * x + 2), XS)
check("P3.7: int_-1^0 = ln2 - pi/2", integral(lambda x: 2 * x / (x * x + 2 * x + 2), -1, 0), log(2) - pi / 2)
check("P3.7: F(0) - F(-1)", F37(0) - F37(-1), log(2) - pi / 2)
check_true("P3.7: f < 0 on [-1, 0)", all(2 * (-1 + k / 100) / ((-1 + k / 100) ** 2 + 2 * (-1 + k / 100) + 2) < 0 for k in range(100)))
F38 = lambda x: log(abs((sqrt(x + 1) - 1) / (sqrt(x + 1) + 1)))
primitive("P3.8: ln|(sqrt(x+1)-1)/(sqrt(x+1)+1)|", F38, lambda x: 1 / (x * sqrt(x + 1)), (0.4, 1.0, 2.2, 3.0, 7.5))
for t in (1.3, 2.0, 3.1):
    check(f"P3.8: 2/(t^2-1) = 1/(t-1) - 1/(t+1) at {t}", 2 / (t * t - 1), 1 / (t - 1) - 1 / (t + 1))
check("P3.8: int_1^3 = ln((3+2 sqrt2)/3)", integral(lambda x: 1 / (x * sqrt(x + 1)), 1, 3), log((3 + 2 * sqrt(2)) / 3))
check("P3.8: = 2 ln(sqrt2+1) - ln3", log((3 + 2 * sqrt(2)) / 3), 2 * log(sqrt(2) + 1) - log(3))
check("P3.8: = ln(1/3) - ln((sqrt2-1)/(sqrt2+1))", log(1 / 3) - log((sqrt(2) - 1) / (sqrt(2) + 1)), log((3 + 2 * sqrt(2)) / 3))
check("P3.8: (sqrt2+1)/(sqrt2-1) = 3 + 2 sqrt2", (sqrt(2) + 1) / (sqrt(2) - 1), 3 + 2 * sqrt(2))
primitive("P3.9: tan(x/2)", lambda x: tan(x / 2), lambda x: 1 / (1 + cos(x)), (-2.0, 0.3, 1.5, 2.6))
check("P3.9: int_0^(pi/2) 1/(1+cos x) = 1", integral(lambda x: 1 / (1 + cos(x)), 0, pi / 2), 1)
# Which method?
primitive("P3.13a e^(x^2)/2", lambda x: exp(x * x) / 2, lambda x: x * exp(x * x), XS)
primitive("P3.13b (x-1)e^x", lambda x: (x - 1) * exp(x), lambda x: x * exp(x), XS)
primitive("P3.13c (1/2) ln|(x-1)/(x+1)|", lambda x: 0.5 * log(abs((x - 1) / (x + 1))), lambda x: 1 / (x * x - 1), (-3.0, -0.5, 0.4, 2.5))
for x in (-3.0, 0.4, 2.5):
    check(f"P3.13c 1/(x^2-1) = (1/2)(1/(x-1) - 1/(x+1)) at {x}", 1 / (x * x - 1), 0.5 * (1 / (x - 1) - 1 / (x + 1)))
primitive("P3.13d arctan(x+2)", lambda x: atan(x + 2), lambda x: 1 / (x * x + 4 * x + 5), XS)
primitive("P3.13e ln(1 + sin x)", lambda x: log(1 + sin(x)), lambda x: cos(x) / (1 + sin(x)), (-1.0, 0.3, 1.2, 2.5))
primitive("P3.13f (2/5)(x+1)^(5/2) - (2/3)(x+1)^(3/2)", lambda x: 0.4 * (x + 1) ** 2.5 - (2 / 3) * (x + 1) ** 1.5, lambda x: x * sqrt(x + 1), (-0.5, 0.3, 1.1, 2.4))
check_true("P3.13 Delta: x^2-1 has 4 > 0, x^2+4x+5 has 16-20 < 0", 0 + 4 > 0 and 16 - 20 < 0)
# formulas g3 / g3b with numbers
primitive("formula: linear inside, cos(3x - 1) -> sin(3x-1)/3", lambda x: sin(3 * x - 1) / 3, lambda x: cos(3 * x - 1), XS)
primitive("formula: log rule, f = x^3 + 2", lambda x: log(abs(x ** 3 + 2)), lambda x: 3 * x * x / (x ** 3 + 2), (-0.5, 0.3, 1.1, 2.4))
primitive("formula: u = tan(x/2) dx = 2du/(1+u^2): x = 2 arctan u", lambda u: 2 * atan(u), lambda u: 2 / (1 + u * u), (-2.0, 0.0, 0.7, 3.0))

# ================= SHORTCUTS (extras, 10 Nov): u2/u3 tricks, group gs, P2.11, P3.14, P3.15 =================
# u2: values from the special triangles
check("tricks: tan(pi/4) = 1 from the 45-degree triangle (1, 1, sqrt2)", tan(pi / 4), 1)
check("tricks: tan(pi/6) = 1/sqrt3", tan(pi / 6), 1 / sqrt(3)); check("tricks: tan(pi/3) = sqrt3", tan(pi / 3), sqrt(3))
check("tricks: sin(pi/6) = 1/2", sin(pi / 6), 0.5); check("tricks: sin(pi/3) = sqrt3/2", sin(pi / 3), sqrt(3) / 2)
check_true("tricks: the triangles are right triangles", abs(1 + 1 - sqrt(2) ** 2) < 1e-12 and abs(1 + 3 - 2 ** 2) < 1e-12)
# odd and even on [-a, a]
for (fn, kind) in ((lambda x: sin(x) / (1 + x * x), 'odd'), (lambda x: x ** 3 * cos(x), 'odd'), (lambda x: x * sin(x), 'even'), (lambda x: exp(-x * x), 'even')):
    for a0 in (0.7, 1.0, 2.5):
        if kind == 'odd':
            check(f"tricks/gs: odd function integrates to 0 on [-{a0},{a0}]", integral(fn, -a0, a0), 0, 1e-9)
        else:
            check(f"tricks/gs: even function, int_-a^a = 2 int_0^a (a={a0})", integral(fn, -a0, a0), 2 * integral(fn, 0, a0))
check("tricks: int_-1^1 sin x/(1+x^2) = 0", integral(lambda x: sin(x) / (1 + x * x), -1, 1), 0, 1e-9)
# half a circle
for r in (1.0, 2.0, 3.5):
    check(f"tricks/gs: int_-r^r sqrt(r^2-x^2) = pi r^2/2 (r={r})", integral(lambda x: sqrt(max(r * r - x * x, 0.0)), -r, r, 20000), pi * r * r / 2, 1e-5)
check("tricks: int_0^1 sqrt(1-x^2) = pi/4", integral(lambda x: sqrt(max(1 - x * x, 0.0)), 0, 1, 20000), pi / 4, 1e-5)
# u3: guess and adjust (class example)
check("tricks: ((1+e^(2x))^(3/2))' = 3 e^(2x) sqrt(1+e^(2x)) at 0.4", d1(lambda x: (1 + exp(2 * x)) ** 1.5, 0.4), 3 * exp(0.8) * sqrt(1 + exp(0.8)))
primitive("tricks: (1/3)(1+e^(2x))^(3/2)", lambda x: (1 + exp(2 * x)) ** 1.5 / 3, lambda x: exp(2 * x) * sqrt(1 + exp(2 * x)), XS)
# make the derivative appear
check("tricks: x + 3 = (1/2)(2x+2) + 2", 0.5 * (2 * 1.7 + 2) + 2, 1.7 + 3)
primitive("tricks: (x+3)/(x^2+2x+5) -> (1/2)ln(x^2+2x+5) + arctan((x+1)/2)", lambda x: 0.5 * log(x * x + 2 * x + 5) + atan((x + 1) / 2), lambda x: (x + 3) / (x * x + 2 * x + 5), XS)
for (pp, qq, bb, cc) in ((1, 3, 2, 5), (2, -1, -4, 13), (-3, 2, 1, 1)):
    for x in XS:
        check(f"gs: make the derivative appear p={pp} q={qq} b={bb} c={cc} at {x}", (pp * x + qq) / (x * x + bb * x + cc),
              pp / 2 * (2 * x + bb) / (x * x + bb * x + cc) + (qq - pp * bb / 2) / (x * x + bb * x + cc))
# cover-up
fr = lambda x: (x + 5) / ((x - 1) * (x + 2))
check("tricks: cover-up A at x = 1: 6/3 = 2", (1 + 5) / (1 + 2), 2); check("tricks: cover-up B at x = -2: 3/(-3) = -1", (-2 + 5) / (-2 - 1), -1)
for x in (-3.3, 0.0, 0.5, 2.7):
    check(f"tricks: (x+5)/((x-1)(x+2)) = 2/(x-1) - 1/(x+2) at {x}", fr(x), 2 / (x - 1) - 1 / (x + 2))
    check(f"gs: cover-up A = (x-1) f(x) near x = 1 ({x})", ((1 + 1e-7) - 1) * fr(1 + 1e-7), 2, 1e-5)
# DI table
primitive("tricks/gs: x^2 e^x -> e^x(x^2-2x+2)", lambda x: exp(x) * (x * x - 2 * x + 2), lambda x: x * x * exp(x), XS)
primitive("tricks: DI with ln x stops early: x ln x -> (x^2/2) ln x - x^2/4", lambda x: x * x / 2 * log(x) - x * x / 4, lambda x: x * log(x), XP)
# King's rule
for (fn, a0) in ((lambda x: x * exp(-x), 1.5), (lambda x: sin(x) ** 2 * x, 2.0), (lambda x: 1 / (1 + x ** 3), 1.2)):
    check(f"tricks/gs: King's rule on [0,{a0}]", integral(fn, 0, a0), integral(lambda x: fn(a0 - x), 0, a0))
check("tricks: int_0^(pi/2) sin/(sin+cos) = pi/4", integral(lambda x: sin(x) / (sin(x) + cos(x)), 0, pi / 2), pi / 4)
check("tricks: int_0^(pi/2) cos/(sin+cos) = pi/4", integral(lambda x: cos(x) / (sin(x) + cos(x)), 0, pi / 2), pi / 4)
# P2.11
check("P2.11a int_-1^1 sin x/(1+x^2) = 0", integral(lambda x: sin(x) / (1 + x * x), -1, 1), 0, 1e-9)
check("P2.11b int_-1^1 (x^3 + 3x^2) = 2", integral(lambda x: x ** 3 + 3 * x * x, -1, 1), 2)
check("P2.11c int_-2^2 sqrt(4-x^2) = 2 pi", integral(lambda x: sqrt(max(4 - x * x, 0.0)), -2, 2, 20000), 2 * pi, 1e-5)
# P3.14
primitive("P3.14a (x^3+1)^5/15", lambda x: (x ** 3 + 1) ** 5 / 15, lambda x: x * x * (x ** 3 + 1) ** 4, XS)
check("P3.14b x + 2 = (1/2)(2x+2) + 1", 0.5 * (2 * 0.9 + 2) + 1, 0.9 + 2)
primitive("P3.14b (1/2)ln(x^2+2x+2) + arctan(x+1)", lambda x: 0.5 * log(x * x + 2 * x + 2) + atan(x + 1), lambda x: (x + 2) / (x * x + 2 * x + 2), XS)
check("P3.14c cover-up at x = -1: 1/2", (3 * -1 + 1) / (-1 - 3), 0.5); check("P3.14c cover-up at x = 3: 5/2", (3 * 3 + 1) / (3 + 1), 2.5)
primitive("P3.14c (1/2)ln|x+1| + (5/2)ln|x-3|", lambda x: 0.5 * log(abs(x + 1)) + 2.5 * log(abs(x - 3)), lambda x: (3 * x + 1) / ((x + 1) * (x - 3)), (-2.5, -0.5, 1.0, 4.2))
# P3.15
primitive("P3.15a e^x(x^3-3x^2+6x-6)", lambda x: exp(x) * (x ** 3 - 3 * x * x + 6 * x - 6), lambda x: x ** 3 * exp(x), XS)
primitive("P3.15b -x^2 cos x + 2x sin x + 2 cos x", lambda x: -x * x * cos(x) + 2 * x * sin(x) + 2 * cos(x), lambda x: x * x * sin(x), XS)
g315 = lambda x: sqrt(sin(x)) / (sqrt(sin(x)) + sqrt(cos(x)))
check("P3.15c int_0^(pi/2) sqrt(sin)/(sqrt(sin)+sqrt(cos)) = pi/4", integral(g315, 1e-12, pi / 2 - 1e-12, 20000), pi / 4, 1e-6)
check("P3.15c King's rule swaps sin and cos: g(pi/2 - x) + g(x) = 1", g315(0.4) + g315(pi / 2 - 0.4), 1)

# ================= FOLLOW-UPS (Quiz 07) =================
# 07-A
check("07A Q1(1) int_0^2 (x+2)/(x^2+4x+4) = ln2", integral(lambda x: (x + 2) / (x * x + 4 * x + 4), 0, 2), log(2))
check("07A Q1(2) int_0^(pi/2) cos^2 sin = 1/3", integral(lambda x: cos(x) ** 2 * sin(x), 0, pi / 2), 1 / 3)
F = lambda x: exp(3 * x - 1) / 9 * (3 * x - 1)
primitive("07A Q1(3) e^(3x-1)(3x-1)/9", F, lambda x: x * exp(3 * x - 1), XS)
check("07A Q1(3) int_(1/3)^1 = 2e^2/9", integral(lambda x: x * exp(3 * x - 1), 1 / 3, 1), 2 * exp(2) / 9)
check("07A Q1(3) F(1/3) = 0", F(1 / 3), 0)
check("07A Q1(4) int_1^3 1/(x^2-4x+5) = pi/2", integral(lambda x: 1 / (x * x - 4 * x + 5), 1, 3), pi / 2)
check("07A Q2 int_(pi/3)^(pi/2) 1/(1+cos x) = 1 - sqrt3/3", integral(lambda x: 1 / (1 + cos(x)), pi / 3, pi / 2), 1 - sqrt(3) / 3)
check("07A Q2 = (3 - sqrt3)/3", 1 - sqrt(3) / 3, (3 - sqrt(3)) / 3)
# 07-B
check("07B Q1(1) int_2^3 (2x-2)/(x^2-2x+1) = 2 ln2", integral(lambda x: (2 * x - 2) / (x * x - 2 * x + 1), 2, 3), 2 * log(2))
check("07B Q1(1) via ln(x^2-2x+1): ln4", log(4) - log(1), 2 * log(2))
check("07B Q1(2) int_0^(pi/3) sin/cos^3 = 3/2", integral(lambda x: sin(x) / cos(x) ** 3, 0, pi / 3), 1.5)
check("07B Q1(2) via u: int_(1/2)^1 u^-3 du", integral(lambda u: u ** -3, 0.5, 1), 1.5)
F = lambda x: -exp(1 - 2 * x) / 4 * (2 * x + 1)
primitive("07B Q1(3) -e^(1-2x)(2x+1)/4", F, lambda x: x * exp(1 - 2 * x), XS)
check("07B Q1(3) int_0^(1/2) x e^(1-2x) = (e-2)/4", integral(lambda x: x * exp(1 - 2 * x), 0, 0.5), (math.e - 2) / 4)
check("07B Q1(3) F(1/2) = -1/2, F(0) = -e/4", F(0.5) - F(0), (math.e - 2) / 4)
check("07B Q1(4) int_-1^2 1/(x^2+2x+4) = pi/(3 sqrt3)", integral(lambda x: 1 / (x * x + 2 * x + 4), -1, 2), pi / (3 * sqrt(3)))
check("07B Q1(4) = sqrt3 pi/9", pi / (3 * sqrt(3)), sqrt(3) * pi / 9)
for x in XS:
    check(f"07B Q1(4) x^2+2x+4 = 3[((x+1)/sqrt3)^2+1] at {x}", x * x + 2 * x + 4, 3 * (((x + 1) / sqrt(3)) ** 2 + 1))
check("07B Q2 int_0^(pi/4) 1/(1+cos x) = sqrt2 - 1", integral(lambda x: 1 / (1 + cos(x)), 0, pi / 4), sqrt(2) - 1)
check("07B Q2 tan(pi/8) = sqrt2 - 1", tan(pi / 8), sqrt(2) - 1)
check("07B Q2 (sqrt2/2)/(1+sqrt2/2) = sqrt2/(2+sqrt2) = sqrt2 - 1", (sqrt(2) / 2) / (1 + sqrt(2) / 2), sqrt(2) - 1)

# ================= 12 & 13 Nov: applications (u4: area, volume, averages, length, cos^n and sin^n) =================
E = math.e
vol = lambda f, a, b, m=4000: pi * integral(lambda x: f(x) ** 2, a, b, m)          # pi int f^2
length = lambda fp, a, b, m=4000: integral(lambda x: sqrt(1 + fp(x) ** 2), a, b, m)  # int sqrt(1 + f'^2)
# Summary: area between two curves (the region between y = x and y = x^2 via the general rule)
check("summary: area between y = x and y = x^2 on [0,1] = 1/6", integral(lambda x: x - x * x, 0, 1), 1 / 6)
# volume from slices: cylinder, cone, sphere (several r and h)
for (r, h) in ((1.0, 1.0), (2.0, 3.0), (1.5, 0.5)):
    check(f"summary/g4: cylinder from slices r={r} h={h}", integral(lambda x: pi * r * r, 0, h), pi * r * r * h)
    check(f"summary/g4: cone from slices r={r} h={h}", integral(lambda x: pi * (r * x / h) ** 2, 0, h), pi * r * r * h / 3)
    check(f"summary/g4: sphere from slices r={r}", integral(lambda x: pi * (r * r - x * x), -r, r), 4 / 3 * pi * r ** 3)
    check(f"summary: the cone is a third of the cylinder (r={r}, h={h})", integral(lambda x: pi * (r * x / h) ** 2, 0, h) * 3, pi * r * r * h)
# solid of revolution, class exercise (1) and (2)
check("summary/P4.3a: pi int_(pi/6)^(pi/3) 1/cos^2 = 2 sqrt3 pi/3", vol(lambda x: 1 / cos(x), pi / 6, pi / 3), 2 * sqrt(3) * pi / 3)
check("P4.3a: sqrt3 - sqrt3/3 = 2 sqrt3/3", sqrt(3) - sqrt(3) / 3, 2 * sqrt(3) / 3)
check("P4.3a: tan(pi/3) - tan(pi/6)", tan(pi / 3) - tan(pi / 6), 2 * sqrt(3) / 3)
check_true("P4.3a: the other order is negative", tan(pi / 6) - tan(pi / 3) < 0)
check("summary/P4.3b: pi int_0^(1/2) x e^(-x^2) = (pi/2)(1 - e^(-1/4))", vol(lambda x: sqrt(x) * exp(-x * x / 2), 0, 0.5), pi / 2 * (1 - exp(-0.25)))
check("P4.3b: with u = -x^2: (pi/2) int_(-1/4)^0 e^u du", pi / 2 * integral(exp, -0.25, 0), pi / 2 * (1 - exp(-0.25)))
check("P4.3b: f^2 = x e^(-x^2) at 0.3", (sqrt(0.3) * exp(-0.045)) ** 2, 0.3 * exp(-0.09))
check("P4.3b: x = 1/2 gives u = -(1/2)^2 = -1/4", -(0.5 ** 2), -0.25)
# with a hole: y = x and y = x^2 on [0,1]
check("summary/P4.4a: pi int_0^1 (x^2 - x^4) = 2 pi/15", pi * integral(lambda x: x * x - x ** 4, 0, 1), 2 * pi / 15)
check("P4.4a: washers = pi int x^2 - pi int x^4", vol(lambda x: x, 0, 1) - vol(lambda x: x * x, 0, 1), 2 * pi / 15)
check("P4.4b: y = 2 and y = x^2 + 1: pi int_-1^1 (4 - (x^2+1)^2) = 64 pi/15", pi * integral(lambda x: 4 - (x * x + 1) ** 2, -1, 1), 64 * pi / 15)
check("P4.4b: 4 - (x^2+1)^2 = 3 - 2x^2 - x^4 at 0.7", 4 - (0.49 + 1) ** 2, 3 - 2 * 0.49 - 0.7 ** 4)
check("P4.4b: 6 - 4/3 - 2/5 = 64/15", Fr(6) - Fr(4, 3) - Fr(2, 5), Fr(64, 15))
check("P4.4b: squaring the difference gives 16 pi/15 instead", pi * integral(lambda x: (2 - (x * x + 1)) ** 2, -1, 1), 16 * pi / 15)
check("watch: pi (int f)^2 is not pi int f^2 (f = 1 + sin x on [0, pi/2])", abs(pi * integral(lambda x: 1 + sin(x), 0, pi / 2) ** 2 - vol(lambda x: 1 + sin(x), 0, pi / 2)) > 1, 1)
for x in XS:
    check(f"watch: (1 + sin x)^2 = 1 + 2 sin x + sin^2 x at {x}", (1 + sin(x)) ** 2, 1 + 2 * sin(x) + sin(x) ** 2)
# two types of averages
check("summary/P4.5a: average of sin on [0,pi] = 2/pi", integral(sin, 0, pi) / pi, 2 / pi)
check("P4.5a: 2/pi is about 0.64", 2 / pi, 0.6366197724, 1e-9)
check("P4.5b: average of x^2 on [0,3] = 3", integral(sq, 0, 3) / 3, 3)
check("P4.5b: reached at x = sqrt3", sqrt(3) ** 2, 3)
xbar = lambda f, a, b: integral(lambda x: x * f(x), a, b) / integral(f, a, b)
check("summary/P4.5c: x bar with f = x^2 on [0,1] = 3/4", xbar(sq, 0, 1), 0.75)
check("P4.5c: (1/4)/(1/3)", Fr(1, 4) / Fr(1, 3), Fr(3, 4))
check("P4.5d: x bar with f = e^(-x) on [0,1] = (e-2)/(e-1)", xbar(lambda x: exp(-x), 0, 1), (E - 2) / (E - 1))
check("P4.5d: int_0^1 x e^(-x) = 1 - 2/e", integral(lambda x: x * exp(-x), 0, 1), 1 - 2 / E)
check("P4.5d: P = 1 - 1/e", integral(lambda x: exp(-x), 0, 1), 1 - 1 / E)
primitive("P4.5d: -x e^(-x) - e^(-x)", lambda x: -x * exp(-x) - exp(-x), lambda x: x * exp(-x), XS)
check("P4.5d: about 0.42", (E - 2) / (E - 1), 0.4180232931, 1e-9)
for (f, a, b) in ((lambda x: 3.0, 1.0, 4.0), (lambda x: x, 0.0, 2.0), (lambda x: exp(x), -1.0, 1.0)):
    check(f"summary: p = f/P has area 1 on [{a},{b}]", integral(lambda x: f(x) / integral(f, a, b), a, b), 1)
check("summary: a constant weight gives the middle: x bar = (a+b)/2", xbar(lambda x: 3.0, 1.0, 4.0), 2.5)
check("summary: the average value is the rectangle's height: f bar (b-a) = area", integral(sin, 0, pi) / pi * pi, integral(sin, 0, pi))
# length of a curve: the straight piece, the integral, the examples
for c0 in (0.0, 0.5, -2.0, 3.0):
    check(f"summary/g4b: a straight piece dl = dx sqrt(1+c^2) (c={c0})", sqrt(0.3 ** 2 + (c0 * 0.3) ** 2), 0.3 * sqrt(1 + c0 * c0))
    check(f"summary: the line y = {c0}x + 1 on [0,2] has length 2 sqrt(1+c^2)", length(lambda x: c0, 0, 2), 2 * sqrt(1 + c0 * c0))
# the Riemann sum of the pieces tends to the length (y = x^2 on [0,1], polygon of N chords)
chord = lambda N: sum(sqrt((1 / N) ** 2 + ((k / N) ** 2 - ((k - 1) / N) ** 2) ** 2) for k in range(1, N + 1))
check("summary: chords of y = x^2 on [0,1] tend to the length", chord(4000), length(lambda x: 2 * x, 0, 1), 1e-7)
check("summary/P4.6a: y = (2/3)x^(3/2) on [0,3]: 14/3", length(lambda x: sqrt(x), 0, 3), 14 / 3)
check("P4.6a: 1 + f'^2 = 1 + x", 1 + sqrt(2.2) ** 2, 3.2)
check("P4.6b: y = x^(3/2) on [0,4/3]: 56/27", length(lambda x: 1.5 * sqrt(x), 0, 4 / 3), 56 / 27)
check("P4.6b: (2/3)(4/9) = 8/27", Fr(2, 3) * Fr(4, 9), Fr(8, 27))
check("P4.6b: 1 + (9/4)(4/3) = 4, 4^(3/2) = 8", (1 + 9 / 4 * 4 / 3) ** 1.5, 8)
ch = lambda x: (exp(x) + exp(-x)) / 2
sh = lambda x: (exp(x) - exp(-x)) / 2
check("P4.6c: y = (e^x + e^-x)/2 on [0,1]: (e - 1/e)/2", length(sh, 0, 1), (E - 1 / E) / 2)
for x in XS:
    check(f"P4.6c: 1 + f'^2 = ((e^x+e^-x)/2)^2 at {x}", 1 + sh(x) ** 2, ch(x) ** 2)
check("P4.7a: y = x^2/2 - ln x/4 on [1,e]: (2e^2-1)/4", length(lambda x: x - 1 / (4 * x), 1, E), (2 * E * E - 1) / 4)
for x in XP:
    check(f"P4.7a: 1 + (x - 1/(4x))^2 = (x + 1/(4x))^2 at {x}", 1 + (x - 1 / (4 * x)) ** 2, (x + 1 / (4 * x)) ** 2)
    check(f"P4.7a: f' = x - 1/(4x) at {x}", d1(lambda t: t * t / 2 - log(t) / 4, x), x - 1 / (4 * x), 1e-6)
check("P4.7b: y = x^3/6 + 1/(2x) on [1,2]: 17/12", length(lambda x: x * x / 2 - 1 / (2 * x * x), 1, 2), 17 / 12)
for x in XP:
    check(f"P4.7b: 1 + f'^2 = (x^2/2 + 1/(2x^2))^2 at {x}", 1 + (x * x / 2 - 1 / (2 * x * x)) ** 2, (x * x / 2 + 1 / (2 * x * x)) ** 2)
    check(f"P4.7b: f' = x^2/2 - 1/(2x^2) at {x}", d1(lambda t: t ** 3 / 6 + 1 / (2 * t), x), x * x / 2 - 1 / (2 * x * x), 1e-6)
check("P4.7b: (4/3 - 1/4) - (1/6 - 1/2) = 17/12", (Fr(4, 3) - Fr(1, 4)) - (Fr(1, 6) - Fr(1, 2)), Fr(17, 12))
check("watch: (ln x/4)' = 1/(4x) at 1.7", d1(lambda x: log(x) / 4, 1.7), 1 / (4 * 1.7), 1e-6)
check("watch: (ln(x/4))' = 1/x at 1.7", d1(lambda x: log(x / 4), 1.7), 1 / 1.7, 1e-6)
# the circle
for r in (1.0, 2.0, 3.0):
    for x in (0.1 * r, 0.5 * r, 0.8 * r):
        fp = d1(lambda t: sqrt(r * r - t * t), x)
        check(f"summary/P4.8a: 1 + f'^2 = r^2/(r^2-x^2) (r={r}, x={x})", 1 + fp * fp, r * r / (r * r - x * x), 1e-6)
    primitive(f"summary: r arcsin(x/r) is a primitive of r/sqrt(r^2-x^2) (r={r})", lambda x: r * asin(x / r), lambda x: r / sqrt(r * r - x * x), (0.1 * r, 0.5 * r, 0.8 * r))
    check(f"summary/P4.8c: quarter circle r pi/2 (r={r})", r * (asin(1) - asin(0)), pi * r / 2)
check("P4.8b: arc of y = sqrt(4-x^2) from 0 to 1 = pi/3", length(lambda x: -x / sqrt(4 - x * x), 0, 1), pi / 3)
check("P4.8b: 2 arcsin(1/2)", 2 * asin(0.5), pi / 3)
check("P4.8b: r theta with theta = pi/6", 2 * (pi / 2 - atan2(sqrt(3), 1)), pi / 3)
check("summary: an arc of angle theta has length r theta (r=2, theta=1)", length(lambda x: -x / sqrt(4 - x * x), 0, 2 * sin(1)), 2 * 1)
# reduction formulas for cos^n and sin^n
for n in range(2, 8):
    Cn = lambda x, n=n: cos(x) ** n
    for x in (0.3, 1.1, 2.4):
        # d/dx [ (1/n) cos^(n-1) sin ] + (n-1)/n cos^(n-2) = cos^n
        check(f"summary/g4c: C_n reduction (n={n}) at {x}", d1(lambda t: cos(t) ** (n - 1) * sin(t) / n, x) + (n - 1) / n * cos(x) ** (n - 2), Cn(x), 1e-6)
        check(f"summary/g4c: S_n reduction (n={n}) at {x}", d1(lambda t: -sin(t) ** (n - 1) * cos(t) / n, x) + (n - 1) / n * sin(x) ** (n - 2), sin(x) ** n, 1e-6)
        check(f"summary: by parts, C_n = cos^(n-1) sin + (n-1) int cos^(n-2) sin^2 (derivative, n={n}) at {x}",
              d1(lambda t: cos(t) ** (n - 1) * sin(t), x) + (n - 1) * cos(x) ** (n - 2) * sin(x) ** 2, Cn(x), 1e-6)
        check(f"watch: cos^(n-2) sin^2 = cos^(n-2) - cos^n (n={n}) at {x}", cos(x) ** (n - 2) * sin(x) ** 2, cos(x) ** (n - 2) - cos(x) ** n)
def I(n):
    return pi / 2 if n == 0 else 1.0 if n == 1 else (n - 1) / n * I(n - 2)
for n in range(0, 9):
    check(f"summary/g4c: I_{n} = int_0^(pi/2) cos^n", integral(lambda x: cos(x) ** n, 0, pi / 2), I(n))
    check(f"summary/g4c: I_{n} = int_0^(pi/2) sin^n", integral(lambda x: sin(x) ** n, 0, pi / 2), I(n))
check("summary/g4c: I_2 = pi/4", I(2), pi / 4); check("g4c: I_3 = 2/3", I(3), 2 / 3)
check("summary/g4c/P4.9c: I_4 = 3 pi/16", I(4), 3 * pi / 16); check("summary/g4c/P4.9d: I_5 = 8/15", I(5), 8 / 15)
check_true("watch: I_3 has no pi", abs(I(3) - 2 / 3) < 1e-15)
primitive("P4.9a: (1/2) sin x cos x + x/2", lambda x: sin(x) * cos(x) / 2 + x / 2, lambda x: cos(x) ** 2, XS)
primitive("P4.9a: x/2 + sin 2x/4 (half-angle)", lambda x: x / 2 + sin(2 * x) / 4, lambda x: cos(x) ** 2, XS)
primitive("P4.9b: -(1/3) sin^2 x cos x - (2/3) cos x", lambda x: -sin(x) ** 2 * cos(x) / 3 - 2 / 3 * cos(x), lambda x: sin(x) ** 3, XS)
# products of sines and cosines
for (m, n) in ((1, 2), (2, 3), (1, 3), (3, 5), (2, -1), (4, 1)):
    check(f"summary/g4d: int_0^pi sin mx sin nx = 0 (m={m}, n={n})", integral(lambda x: sin(m * x) * sin(n * x), 0, pi), 0, 1e-9)
    check(f"g4d: int_0^pi cos mx cos nx = 0 (m={m}, n={n})", integral(lambda x: cos(m * x) * cos(n * x), 0, pi), 0, 1e-9)
for x in XS:
    for (A, B) in ((0.7, 1.9), (2.0, -0.4)):
        Ax, Bx = A * x, B * x
        check(f"g4d: sin A sin B product to sum ({A}x, {B}x) at {x}", sin(Ax) * sin(Bx), 0.5 * (cos(Ax - Bx) - cos(Ax + Bx)))
        check(f"g4d: cos A cos B product to sum ({A}x, {B}x) at {x}", cos(Ax) * cos(Bx), 0.5 * (cos(Ax - Bx) + cos(Ax + Bx)))
        check(f"g4d: sin A cos B product to sum ({A}x, {B}x) at {x}", sin(Ax) * cos(Bx), 0.5 * (sin(Ax + Bx) + sin(Ax - Bx)))
    check(f"g4d: cos 2x = 1 - 2 sin^2 x at {x}", cos(2 * x), 1 - 2 * sin(x) ** 2)
    check(f"g4d: cos 2x = 2 cos^2 x - 1 at {x}", cos(2 * x), 2 * cos(x) ** 2 - 1)
    check(f"g4d: sin^2 x = (1 - cos 2x)/2 at {x}", sin(x) ** 2, (1 - cos(2 * x)) / 2)
    check(f"g4d: cos^2 x = (1 + cos 2x)/2 at {x}", cos(x) ** 2, (1 + cos(2 * x)) / 2)
    check(f"g4d: sin x cos x = sin 2x/2 at {x}", sin(x) * cos(x), sin(2 * x) / 2)
primitive("g4d: int sin^2 = x/2 - sin 2x/4", lambda x: x / 2 - sin(2 * x) / 4, lambda x: sin(x) ** 2, XS)
primitive("g4d: int cos^2 = x/2 + sin 2x/4", lambda x: x / 2 + sin(2 * x) / 4, lambda x: cos(x) ** 2, XS)
check("summary/watch: on [-pi/2, pi/2], int cos x cos 2x = 2/3", integral(lambda x: cos(x) * cos(2 * x), -pi / 2, pi / 2), 2 / 3)
check("P4.10a: int_0^pi sin 2x sin 3x = 0", integral(lambda x: sin(2 * x) * sin(3 * x), 0, pi), 0, 1e-9)
check("P4.10b: int_0^pi sin^2 2x = pi/2", integral(lambda x: sin(2 * x) ** 2, 0, pi), pi / 2)
check("P4.10c: int_(-pi/2)^(pi/2) cos 2x cos 3x = 6/5", integral(lambda x: cos(2 * x) * cos(3 * x), -pi / 2, pi / 2), 6 / 5)
check("P4.10c: sin(pi/2) + sin(5pi/2)/5", sin(pi / 2) + sin(5 * pi / 2) / 5, 1.2)
# area examples
check("P4.1a: int_0^2 (2x - x^2) = 4/3", integral(lambda x: 2 * x - x * x, 0, 2), 4 / 3)
check_true("P4.1a: 2x >= x^2 on [0,2]", all(2 * (k / 50) >= (k / 50) ** 2 for k in range(0, 101)))
check("P4.1b: int_0^(pi/4) (cos - sin) = sqrt2 - 1", integral(lambda x: cos(x) - sin(x), 0, pi / 4), sqrt(2) - 1)
check_true("P4.1b: cos >= sin on [0, pi/4]", all(cos(k * pi / 400) >= sin(k * pi / 400) - 1e-15 for k in range(0, 101)))
# volumes from slices
check("P4.2a: cone r = 3, h = 4: 12 pi", integral(lambda x: pi * (3 * x / 4) ** 2, 0, 4), 12 * pi)
check("P4.2a: (9 pi/16)(64/3)", 9 * pi / 16 * 64 / 3, 12 * pi)
check("P4.2b: sphere r = 2: 32 pi/3", pi * integral(lambda x: 4 - x * x, -2, 2), 32 * pi / 3)
check("P4.2b: 16 - 16/3 = 32/3", Fr(16) - Fr(16, 3), Fr(32, 3))
check("P4.2c: square slices of side x on [0,2]: 8/3", integral(sq, 0, 2), 8 / 3)
check("P4.2c: pyramid (1/3)(4)(2)", 4 * 2 / 3, 8 / 3)
# shortcuts of u4 (extras)
check("tricks/P4.11a: I_6 = (5.3.1)/(6.4.2) pi/2 = 5 pi/32", integral(lambda x: sin(x) ** 6, 0, pi / 2), 5 * pi / 32)
check("tricks: 15/48 pi/2", 15 / 48 * pi / 2, 5 * pi / 32)
check("tricks/P4.11b: I_7 = (6.4.2)/(7.5.3) = 16/35", integral(lambda x: cos(x) ** 7, 0, pi / 2), 16 / 35)
check("tricks: 48/105 = 16/35", Fr(48, 105), Fr(16, 35))
for n in range(2, 10):
    num = math.prod(range(n - 1, 0, -2)); den = math.prod(range(n, 0, -2))
    check(f"gs: the reduction formula in one line, n={n}", num / den * (pi / 2 if n % 2 == 0 else 1), I(n))
check("tricks/gs: int_0^(pi/2) sin^2 = pi/4", integral(lambda x: sin(x) ** 2, 0, pi / 2), pi / 4)
check("tricks/gs: int_0^(pi/2) cos^2 = pi/4", integral(lambda x: cos(x) ** 2, 0, pi / 2), pi / 4)
check("tricks/P4.11c: int_0^pi sin^2 = pi/2", integral(lambda x: sin(x) ** 2, 0, pi), pi / 2)
check("tricks: int_0^pi cos^2 = pi/2", integral(lambda x: cos(x) ** 2, 0, pi), pi / 2)
for (A0, B0) in ((lambda x: x, lambda x: 1 / (4 * x)), (lambda x: x * x / 2, lambda x: 1 / (2 * x * x)), (lambda x: x / 2, lambda x: 1 / (2 * x))):
    for x in XP:
        check(f"tricks/gs: AB = 1/4 at {x}", A0(x) * B0(x), 0.25)
        check(f"tricks/gs: 1 + (A-B)^2 = (A+B)^2 at {x}", 1 + (A0(x) - B0(x)) ** 2, (A0(x) + B0(x)) ** 2)
check_true("tricks: 2/pi lies between 0 and 1", 0 < 2 / pi < 1)
# habits
check("habit: expand f^2 for f = 1 + e^x at 0.4", (1 + exp(0.4)) ** 2, 1 + 2 * exp(0.4) + exp(0.8))

# ================= FOLLOW-UPS (Quiz 08) =================
# 08-A
check("08A Q1 pi int_0^pi (2 + sin x)^2 = 9pi^2/2 + 8 pi", vol(lambda x: 2 + sin(x), 0, pi), 9 * pi * pi / 2 + 8 * pi)
check("08A Q1 terms 4pi + 8 + pi/2", integral(lambda x: 4.0, 0, pi) + integral(lambda x: 4 * sin(x), 0, pi) + integral(lambda x: sin(x) ** 2, 0, pi), 4 * pi + 8 + pi / 2)
check("08A Q2 length of (2/3)(x+1)^(3/2) on [0,2] = (16 - 4 sqrt2)/3", length(lambda x: sqrt(x + 1), 0, 2), (16 - 4 * sqrt(2)) / 3)
check("08A Q2 f' = (x+1)^(1/2) at 0.9", d1(lambda x: 2 / 3 * (x + 1) ** 1.5, 0.9), sqrt(1.9), 1e-6)
check("08A Q2 (2/3)(8 - 2 sqrt2)", 2 / 3 * (8 - 2 * sqrt(2)), (16 - 4 * sqrt(2)) / 3)
for (m, n) in ((1, 2), (2, 5), (3, 1), (4, -2), (0, 3)):
    check(f"08A Q3 int_0^pi cos mx cos nx = 0 (m={m}, n={n})", integral(lambda x: cos(m * x) * cos(n * x), 0, pi), 0, 1e-9)
# 08-B
check("08B Q1 pi int_0^(pi/2) (sin + cos)^2 = pi^2/2 + pi", vol(lambda x: sin(x) + cos(x), 0, pi / 2), pi * pi / 2 + pi)
for x in XS:
    check(f"08B Q1 (sin x + cos x)^2 = 1 + sin 2x at {x}", (sin(x) + cos(x)) ** 2, 1 + sin(2 * x))
check("08B Q1 without the middle term: pi^2/2", pi * integral(lambda x: 1.0, 0, pi / 2), pi * pi / 2)
check("08B Q2 length of x^2/4 - ln x/2 on [1,e] = (e^2+1)/4", length(lambda x: x / 2 - 1 / (2 * x), 1, E), (E * E + 1) / 4)
for x in XP:
    check(f"08B Q2 f' = x/2 - 1/(2x) at {x}", d1(lambda t: t * t / 4 - log(t) / 2, x), x / 2 - 1 / (2 * x), 1e-6)
    check(f"08B Q2 1 + f'^2 = (x/2 + 1/(2x))^2 at {x}", 1 + (x / 2 - 1 / (2 * x)) ** 2, (x / 2 + 1 / (2 * x)) ** 2)
gen = lambda m, n: sin((m - n) * pi / 2) / (m - n) - sin((m + n) * pi / 2) / (m + n)
for (m, n) in ((1, 2), (2, 3), (1, 3), (3, 6), (2, -1), (4, 1)):
    check(f"08B Q3 int_(-pi/2)^(pi/2) sin mx sin nx = the formula (m={m}, n={n})", integral(lambda x: sin(m * x) * sin(n * x), -pi / 2, pi / 2), gen(m, n), 1e-9)
check("08B Q3 m = 1, n = 2: 4/3", integral(lambda x: sin(x) * sin(2 * x), -pi / 2, pi / 2), 4 / 3)
check("08B Q3 1 + 1/3", gen(1, 2), 4 / 3)

# ================= 16 & 17 Nov: parametric and polar curves (u5) =================
def plen(xf, yf, a, b, m=4000):
    """length of a parametric curve, with numerical derivatives"""
    return integral(lambda t: sqrt(d1(xf, t) ** 2 + d1(yf, t) ** 2), a, b, m)
def polar_len(rf, a, b, m=4000):
    return integral(lambda th: sqrt(rf(th) ** 2 + d1(rf, th) ** 2), a, b, m)
def chord_len(xf, yf, a, b, N=20000):
    """the curve as N straight pieces: the sum of the pieces tends to the length"""
    pts = [(xf(a + (b - a) * k / N), yf(a + (b - a) * k / N)) for k in range(N + 1)]
    return sum(sqrt((pts[k][0] - pts[k - 1][0]) ** 2 + (pts[k][1] - pts[k - 1][1]) ** 2) for k in range(1, N + 1))
# parametrization: y = sqrt x with x = t^2, the same points; the area both ways
for t in (1.0, 1.3, 1.7, 2.0):
    check(f"summary/P5.1a: x = t^2 gives y = sqrt(x) = t at t={t}", sqrt(t * t), t)
check("P5.1a: x = 1 -> t = 1, x = 4 -> t = 2", sqrt(1) + sqrt(4), 3)
check("summary/P5.1b: int_1^4 sqrt x = 14/3", integral(sqrt, 1, 4), 14 / 3)
check("P5.1b: int_1^2 t * 2t dt = 14/3", integral(lambda t: t * 2 * t, 1, 2), 14 / 3)
for t in (0.3, 1.9, 4.0):
    check(f"summary/P5.1c: x = 2cos t, y = 2 sin t lies on x^2 + y^2 = 4 (t={t})", (2 * cos(t)) ** 2 + (2 * sin(t)) ** 2, 4)
    check(f"summary: x = cos t, y = sin t lies on x^2 + y^2 = 1 (t={t})", cos(t) ** 2 + sin(t) ** 2, 1)
# polar coordinates
for (r, th) in ((2.0, 0.4), (1.5, 2.2), (3.0, -1.0)):
    xx, yy = r * cos(th), r * sin(th)
    check(f"summary/g5b: r = sqrt(x^2 + y^2) (r={r})", sqrt(xx * xx + yy * yy), r)
    check(f"summary/g5b: tan theta = y/x (theta={th})", tan(th), yy / xx)
check("P5.2a: (1,1) -> r = sqrt2", sqrt(2), sqrt(1 + 1)); check("P5.2a: theta = pi/4", atan2(1, 1), pi / 4)
check("P5.2b: x = 2 cos(2pi/3) = -1", 2 * cos(2 * pi / 3), -1); check("P5.2b: y = 2 sin(2pi/3) = sqrt3", 2 * sin(2 * pi / 3), sqrt(3))
for th in (-1.2, 0.3, 1.1):
    xx, yy = 2 * cos(th) * cos(th), 2 * cos(th) * sin(th)
    check(f"P5.2c: r = 2cos theta lies on (x-1)^2 + y^2 = 1 (theta={th})", (xx - 1) ** 2 + yy * yy, 1)
check("summary: r = 2 is the circle x^2 + y^2 = 4", (2 * cos(0.7)) ** 2 + (2 * sin(0.7)) ** 2, 4)
# the arc y = sqrt(1 - x^2) with x = cos theta
g = lambda x: sqrt(1 - x * x)
for th in (pi / 4 + 0.1, pi / 2, 3 * pi / 4 - 0.1):
    gp = d1(g, cos(th))
    check(f"summary/P5.4b: g'(x) = -cos/sin at theta={th:.3f}", gp, -cos(th) / sin(th), 1e-6)
    check(f"summary/P5.4b: sqrt(1+g'^2) dx/dtheta = -1 at theta={th:.3f}", sqrt(1 + gp * gp) * (-sin(th)), -1, 1e-6)
check("summary/P5.4a: cos(3pi/4) = -1/sqrt2", cos(3 * pi / 4), -1 / sqrt(2)); check("P5.4a: cos(pi/4) = 1/sqrt2", cos(pi / 4), 1 / sqrt(2))
check("summary/P5.4c: the arc length in x: int sqrt(1 + g'^2) = pi/2", integral(lambda x: 1 / sqrt(1 - x * x), -1 / sqrt(2), 1 / sqrt(2)), pi / 2)
check("summary/P5.4c: int_(3pi/4)^(pi/4) (-1) dtheta = pi/2", integral(lambda th: -1.0, 3 * pi / 4, pi / 4), pi / 2)
check("summary: the general formula gives pi/2 for the arc", plen(cos, sin, pi / 4, 3 * pi / 4), pi / 2)
check("summary: the chords of the arc tend to pi/2", chord_len(cos, sin, pi / 4, 3 * pi / 4), pi / 2, 1e-7)
# the general length formula: both forms agree where dx/dtheta > 0, and the second needs no division
xf, yf = (lambda t: t * t + t), (lambda t: sin(t))
check("summary/g5: sqrt(1 + (y'/x')^2) x' = sqrt(x'^2 + y'^2) (x' > 0)", integral(lambda t: sqrt(1 + (d1(yf, t) / d1(xf, t)) ** 2) * d1(xf, t), 0.2, 1.7), plen(xf, yf, 0.2, 1.7))
check("summary/g5: the length formula against chords", plen(xf, yf, 0.2, 1.7), chord_len(xf, yf, 0.2, 1.7), 1e-7)
check("summary: the whole unit circle (dx/dtheta = 0 at 0 and pi) has length 2pi", plen(cos, sin, 0, 2 * pi), 2 * pi)
check("summary: the vertical line x = 1, y = theta on [0,3] has length 3", plen(lambda t: 1.0, lambda t: t, 0, 3), 3)
check("summary/g5: slope dy/dx = (dy/dt)/(dx/dt) (x = t^2 + t, y = sin t at 0.8)", d1(yf, 0.8) / d1(xf, 0.8), cos(0.8) / (2 * 0.8 + 1), 1e-6)
# polar: the sum of squares of the derivatives
for (rf, name) in ((lambda th: 1 + cos(th), '1 + cos'), (lambda th: 2 * th, '2 theta'), (lambda th: exp(th), 'e^theta'), (lambda th: th * th - 3, 'theta^2 - 3')):
    for th in (0.4, 1.3, 2.6):
        dx = d1(lambda u: rf(u) * cos(u), th); dy = d1(lambda u: rf(u) * sin(u), th)
        check(f"summary/g5b: x'^2 + y'^2 = r^2 + r'^2 for r = {name} at {th}", dx * dx + dy * dy, rf(th) ** 2 + d1(rf, th) ** 2, 1e-6)
check("summary: the circle r = a has length 2 pi a (a = 1.5)", polar_len(lambda th: 1.5, 0, 2 * pi), 3 * pi)
# the cardioid r = 1 + cos theta
card = lambda th: 1 + cos(th)
for th in (0.3, 1.7, 3.0, 4.4, 6.0):
    check(f"summary/P5.6a: r^2 + r'^2 = 2 + 2cos = 4cos^2(theta/2) at {th}", card(th) ** 2 + sin(th) ** 2, 4 * cos(th / 2) ** 2)
check("summary/P5.6b: the cardioid's length is 8", polar_len(card, 0, 2 * pi, 8000), 8, 1e-7)
check("summary/P5.6b: 2 int_0^pi cos(theta/2) = 4", 2 * integral(lambda th: cos(th / 2), 0, pi), 4)
check("summary/P5.6b: -2 int_pi^2pi cos(theta/2) = 4", -2 * integral(lambda th: cos(th / 2), pi, 2 * pi), 4)
check("watch/P5.6: without | |, 2 int_0^2pi cos(theta/2) = 0", 2 * integral(lambda th: cos(th / 2), 0, 2 * pi), 0, 1e-9)
check("summary: the cardioid's chords tend to 8", chord_len(lambda th: card(th) * cos(th), lambda th: card(th) * sin(th), 0, 2 * pi, 40000), 8, 1e-6)
check("g5b: sqrt(cos^2(theta/2)) = |cos(theta/2)| at 4.4", sqrt(cos(2.2) ** 2), abs(cos(2.2)))
for th in (0.5, 2.0, 4.0):
    check(f"g5b: half-angle 1 + cos = 2cos^2(theta/2) at {th}", 1 + cos(th), 2 * cos(th / 2) ** 2)
    check(f"g5b: half-angle 1 - cos = 2sin^2(theta/2) at {th}", 1 - cos(th), 2 * sin(th / 2) ** 2)
# exercises (1) and (2)
L1 = sqrt(2) / 2 + log(1 + sqrt(2)) / 2
check("summary/P5.3: length of y = x^2/2 on [0,1]", integral(lambda x: sqrt(1 + x * x), 0, 1), L1)
check("P5.3: [x sqrt(1+x^2)]_0^1 = sqrt2", 1 * sqrt(2) - 0, sqrt(2))
check("P5.3: int_0^1 x^2/sqrt(1+x^2) = ell - ln(1+sqrt2)", integral(lambda x: x * x / sqrt(1 + x * x), 0, 1), L1 - log(1 + sqrt(2)))
check("P5.3: by parts: ell = sqrt2 - int x^2/sqrt(1+x^2)", sqrt(2) - integral(lambda x: x * x / sqrt(1 + x * x), 0, 1), L1)
for x in XS:
    check(f"P5.3: x^2/sqrt(1+x^2) = sqrt(1+x^2) - 1/sqrt(1+x^2) at {x}", x * x / sqrt(1 + x * x), sqrt(1 + x * x) - 1 / sqrt(1 + x * x))
for a0 in (1.0, 2.0, 0.5):
    primitive(f"summary/g5b: ln|x + sqrt(x^2+a^2)| (a={a0})", lambda x, a0=a0: log(abs(x + sqrt(x * x + a0 * a0))), lambda x, a0=a0: 1 / sqrt(x * x + a0 * a0), XS)
    primitive(f"tricks/gs: the ready-made primitive of sqrt(x^2+a^2) (a={a0})", lambda x, a0=a0: 0.5 * (x * sqrt(x * x + a0 * a0) + a0 * a0 * log(abs(x + sqrt(x * x + a0 * a0)))), lambda x, a0=a0: sqrt(x * x + a0 * a0), XS)
check("watch: int dx/(x^2+4) on [0,2] is an arctan: (1/2)arctan(1)", integral(lambda x: 1 / (x * x + 4), 0, 2), atan(1) / 2)
check("summary/P5.5: length of r = 2 theta on [0,1]", polar_len(lambda th: 2 * th, 0, 1), sqrt(2) + log(1 + sqrt(2)))
check("P5.5: = 2 x exercise (1)", 2 * L1, sqrt(2) + log(1 + sqrt(2)))
check("P5.5: about 2.30, more than 2", sqrt(2) + log(1 + sqrt(2)), 2.2955871494, 1e-9)
# conversion of summation, area and length with x = 3t^2, y = 3t - t^3
X3, Y3 = (lambda t: 3 * t * t), (lambda t: 3 * t - t ** 3)
for t in (0.4, 1.0, 1.6):
    check(f"summary/g5: dx/dt = 6t at {t}", d1(X3, t), 6 * t, 1e-6)
fcos = lambda x: cos(x) + x * x
check("summary/g5: int f(x) dx over [0,9] = int f(x(t)) dx/dt dt over [0,sqrt3]", integral(fcos, 0, 9), integral(lambda t: fcos(X3(t)) * 6 * t, 0, sqrt(3)))
for N in (50, 400):
    ts = [sqrt(3) * k / N for k in range(N + 1)]
    S = sum(fcos(X3(ts[k])) * (X3(ts[k]) - X3(ts[k - 1])) / (ts[k] - ts[k - 1]) * (ts[k] - ts[k - 1]) for k in range(1, N + 1))
    check(f"summary: the converted sum tends to the integral (N={N})", S, integral(fcos, 0, 9), 3 / N * 20)
check("summary/P5.7a: y = 0 at t = sqrt3, x = 9", Y3(sqrt(3)), 0, 1e-12); check("P5.7a: x(sqrt3) = 9", X3(sqrt(3)), 9)
check("summary/P5.7b: area int_0^sqrt3 (3t - t^3) 6t = 36 sqrt3/5", integral(lambda t: Y3(t) * 6 * t, 0, sqrt(3)), 36 * sqrt(3) / 5)
check("P5.7b: 18 sqrt3 - 54 sqrt3/5", 18 * sqrt(3) - 54 * sqrt(3) / 5, 36 * sqrt(3) / 5)
yofx = lambda x: Y3(sqrt(x / 3))
check("P5.7b: the same area in x: int_0^9 y dx", integral(yofx, 0, 9, 20000), 36 * sqrt(3) / 5, 1e-6)
for t in (0.3, 1.2, 1.9):
    check(f"summary/P5.7c: 36t^2 + 9(1-t^2)^2 = 9(1+t^2)^2 at {t}", 36 * t * t + 9 * (1 - t * t) ** 2, 9 * (1 + t * t) ** 2)
check("summary/P5.7c: length on 0 <= x <= 12 (t to 2) = 14", plen(X3, Y3, 0, 2), 14)
check("P5.7c: x = 12 at t = 2", X3(2), 12)
check("P5.7c: chords tend to 14", chord_len(X3, Y3, 0, 2), 14, 1e-7)
check("P5.7d: the arch's length 6 sqrt3", plen(X3, Y3, 0, sqrt(3)), 6 * sqrt(3))
check("tricks/gs: (A-B)^2 + 4AB = (A+B)^2 with A = t^2, B = 1 at 1.3", (1.69 - 1) ** 2 + 4 * 1.69, (1.69 + 1) ** 2)
# P5.8: x = t^2, y = t - t^3/3
X8, Y8 = (lambda t: t * t), (lambda t: t - t ** 3 / 3)
check("P5.8a: slope at t = 2 is -3/4", d1(Y8, 2) / d1(X8, 2), -0.75, 1e-6)
check("P5.8b: y(sqrt3) = 0", Y8(sqrt(3)), 0, 1e-12); check("P5.8b: x(sqrt3) = 3", X8(sqrt(3)), 3)
check("P5.8c: area 4 sqrt3/5", integral(lambda t: Y8(t) * 2 * t, 0, sqrt(3)), 4 * sqrt(3) / 5)
check("P5.8c: 2 sqrt3 - 6 sqrt3/5", 2 * sqrt(3) - 6 * sqrt(3) / 5, 4 * sqrt(3) / 5)
check("P5.8d: length of the arch 2 sqrt3", plen(X8, Y8, 0, sqrt(3)), 2 * sqrt(3))
for t in (0.5, 1.4):
    check(f"P5.8d: 4t^2 + (1-t^2)^2 = (1+t^2)^2 at {t}", 4 * t * t + (1 - t * t) ** 2, (1 + t * t) ** 2)
# P5.9: polar lengths
check("P5.9a: r = e^theta on [0,1]: sqrt2 (e - 1)", polar_len(exp, 0, 1), sqrt(2) * (math.e - 1))
check("P5.9b: r = theta^2 on [0, sqrt5]: 19/3", polar_len(lambda th: th * th, 0, sqrt(5)), 19 / 3)
check("P5.9b: (1/2) int_4^9 sqrt u du = 19/3", 0.5 * integral(sqrt, 4, 9), 19 / 3)
check("P5.9c: r = 1 - cos theta on [0, 2pi]: 8", polar_len(lambda th: 1 - cos(th), 0, 2 * pi, 8000), 8, 1e-7)
check_true("P5.9c: sin(theta/2) >= 0 on [0, 2pi]", all(sin(k * pi / 200) >= -1e-15 for k in range(0, 201)))
# P5.10: shortcuts
check("P5.10a: int_0^2 sqrt(x^2+4) = 2 sqrt2 + 2 ln(1+sqrt2)", integral(lambda x: sqrt(x * x + 4), 0, 2), 2 * sqrt(2) + 2 * log(1 + sqrt(2)))
check("P5.10b: length of y = x^2/4 on [0,2] = sqrt2 + ln(1+sqrt2)", integral(lambda x: sqrt(1 + x * x / 4), 0, 2), sqrt(2) + log(1 + sqrt(2)))
check("tricks/P5.10c: the cardioid's top half doubled: 2 * 2 int_0^pi cos(theta/2) = 8", 2 * 2 * integral(lambda th: cos(th / 2), 0, pi), 8)
check("tricks: the cardioid's top half is half its length", polar_len(card, 0, pi), 4)
# speed: a point moving along x = cos t, y = sin t at unit speed covers 2 pi in one turn
check("tricks: speed sqrt(x'^2 + y'^2) = 1 for (cos t, sin t)", sqrt(d1(cos, 0.9) ** 2 + d1(sin, 0.9) ** 2), 1, 1e-6)
# habit
check("habit: (theta^2 + 1)^2 = theta^4 + 2 theta^2 + 1 at 1.7", (1.7 ** 2 + 1) ** 2, 1.7 ** 4 + 2 * 1.7 ** 2 + 1)

# ================= FOLLOW-UPS (Quiz 09) =================
# 09-A
r9a = lambda th: 3 * th * th - 3
for th in (0.6, 2.1):
    check(f"09A Q1(1) x = (3 theta^2 - 3) cos theta is r cos theta at {th}", r9a(th) * cos(th), (3 * th * th - 3) * cos(th))
    check(f"09A Q1(2) r^2 + r'^2 = 9(theta^2+1)^2 at {th}", r9a(th) ** 2 + d1(r9a, th) ** 2, 9 * (th * th + 1) ** 2, 1e-6)
check("09A Q1(2) length on [0, pi] = pi^3 + 3 pi", polar_len(r9a, 0, pi), pi ** 3 + 3 * pi)
y9a = lambda t: -t ** 3 + 2 * t * t + 3 * t
check("09A Q2(1) y(3) = 0", y9a(3), 0); check_true("09A Q2(1) y >= 0 on [1,3], < 0 after", all(y9a(1 + k / 100) >= -1e-12 for k in range(201)) and y9a(3.01) < 0)
check("09A Q2(1) x = ln 3 at t = 3", log(3), log(3))
check("09A Q2(2) area int_1^3 y (1/t) dt = 16/3", integral(lambda t: y9a(t) / t, 1, 3), 16 / 3)
check("09A Q2(2) the same area in x: int_0^ln3 y dx", integral(lambda x: y9a(exp(x)), 0, log(3)), 16 / 3)
# 09-B
r9b = lambda th: 2 + 2 * cos(th)
for th in (0.5, 3.5, 5.0):
    check(f"09B Q1(2) r^2 + r'^2 = 16 cos^2(theta/2) at {th}", r9b(th) ** 2 + d1(r9b, th) ** 2, 16 * cos(th / 2) ** 2, 1e-6)
check("09B Q1(2) length on [0, 2pi] = 16", polar_len(r9b, 0, 2 * pi, 8000), 16, 1e-7)
check("09B Q1(2) without | |: 0", 4 * integral(lambda th: cos(th / 2), 0, 2 * pi), 0, 1e-9)
y9b = lambda t: 4 * t - t ** 3
check_true("09B Q2(1) y >= 0 on [1,2], < 0 after", all(y9b(1 + k / 100) >= -1e-12 for k in range(101)) and y9b(2.01) < 0)
check("09B Q2(2) area int_1^2 y/t dt = 5/3", integral(lambda t: y9b(t) / t, 1, 2), 5 / 3)
check("09B Q2(2) the same area in x: int_0^ln2 y dx", integral(lambda x: y9b(exp(x)), 0, log(2)), 5 / 3)
check("09B Q2(2) without the 1/t: 9/4", integral(y9b, 1, 2), 9 / 4)

# ================= 19 Nov: improper integrals and L'Hôpital's rule (u6, g6, g6b, P6.1–P6.11) =================
# Convergent improper integrals are checked with scipy's quad (adaptive, made for infinite ranges and integrable
# singularities at an end); each closed form "integral up to w" is checked against Simpson's rule on an ordinary
# interval; divergence is shown by the closed form passing every bound as w moves to the problem point.
import warnings
from scipy.integrate import quad, IntegrationWarning
warnings.simplefilter('error', IntegrationWarning)   # a quad that struggles must fail, not pass quietly
INF = float('inf')
def imp(f, a, b):
    v, err = quad(f, a, b, limit=400, epsabs=1e-12, epsrel=1e-12)
    return v
def grows(name, F, ws, bound=1e3):
    """F(w) increases along ws and passes the bound: the integral up to w has no finite limit"""
    vals = [F(w) for w in ws]
    check_true(f"{name}: grows without bound", all(b > a for a, b in zip(vals, vals[1:])) and vals[-1] > bound, [round(v, 3) for v in vals])
XN = (0.3, 0.9, 1.6, 2.8)      # x > 0
# --- the definition and converge or diverge ---
check("summary/g6: int_0^inf e^-x = lim of int_0^w (w = 40)", integral(lambda x: exp(-x), 0, 40), imp(lambda x: exp(-x), 0, INF), 1e-9)
# power functions: the primitives, and the improper integral on [1, inf) characterized by n
for n in (-3, -2, -1.5, -0.5, 2):
    primitive(f"summary: x^(n+1)/(n+1) is a primitive of x^n (n={n})", lambda x, n=n: x ** (n + 1) / (n + 1), lambda x, n=n: x ** n, XN)
primitive("summary: ln x is a primitive of x^-1", log, lambda x: 1 / x, XN)
for n in (-3, -2, -1.5, -1.2):
    check(f"summary/g6: int_1^inf x^n = -1/(n+1) (n={n})", imp(lambda x, n=n: x ** n, 1, INF), -1 / (n + 1), 1e-8)
    check(f"summary: lim x^(n+1) = 0 for n < -1 (n={n}, x = 1e12)", (1e12) ** (n + 1), 0, 1e-2)
grows("summary/g6: n = -1: int_1^w dx/x = ln w", log, [10.0 ** k for k in (1, 10, 100, 300)], 600)
grows("summary/g6: n = -1/2: int_1^w = 2 sqrt w - 2", lambda w: 2 * sqrt(w) - 2, [10.0 ** k for k in (1, 4, 8, 12)])
grows("g6: n = 0: int_1^w 1 dx = w - 1", lambda w: w - 1, [10.0 ** k for k in (1, 4, 8)])
check("summary/g6: int_1^w dx/x = ln w (w = 7.5)", integral(lambda x: 1 / x, 1, 7.5), log(7.5))
check("summary: int_1^inf dx/x^2 = 1", imp(lambda x: x ** -2, 1, INF), 1, 1e-9)
# --- class exercise (1) (P6.1) ---
check("summary/P6.1a: int_0^inf dx/(1+x^2) = pi/2", imp(lambda x: 1 / (1 + x * x), 0, INF), pi / 2, 1e-9)
check("summary/P6.1a/g6b: arctan w -> pi/2 (w = 1e9)", atan(1e9), pi / 2, 1e-8)
check("P6.1a: int_0^w = arctan w (w = 3)", integral(lambda x: 1 / (1 + x * x), 0, 3), atan(3))
check("summary/P6.1b: int_-inf^0 e^x = 1", imp(exp, -INF, 0), 1, 1e-9)
check("P6.1b: int_w^0 e^x = 1 - e^w (w = -4)", integral(exp, -4, 0), 1 - exp(-4))
check("summary/P6.1b: e^w -> 0 as w -> -inf (w = -60)", exp(-60), 0, 1e-20)
# --- divergence at an open boundary: 1/sqrt(1-x) on [0, 1) (P6.3) ---
primitive("summary/P6.3a/g6: -2 sqrt(1-x) is a primitive of 1/sqrt(1-x)", lambda x: -2 * sqrt(1 - x), lambda x: 1 / sqrt(1 - x), (-1.5, 0.1, 0.5, 0.9))
check("summary/P6.3b: int_0^1 dx/sqrt(1-x) = 2", imp(lambda x: 1 / sqrt(1 - x), 0, 1), 2, 1e-9)
check("summary/P6.3b: int_0^w = 2 - 2 sqrt(1-w) (w = 0.96)", integral(lambda x: 1 / sqrt(1 - x), 0, 0.96), 2 - 2 * sqrt(0.04))
check_true("summary: 1/sqrt(1-x) shoots up near x = 1", 1 / sqrt(1 - (1 - 1e-12)) > 1e5)
check_true("watch: 2 sqrt(1-x) (the sign dropped) is not a primitive", abs(d1(lambda x: 2 * sqrt(1 - x), 0.4) - 1 / sqrt(0.6)) > 1)
check_true("watch: -(1/2) sqrt(1-x) (multiplied by the new exponent) is not a primitive", abs(d1(lambda x: -0.5 * sqrt(1 - x), 0.4) - 1 / sqrt(0.6)) > 0.5)
# --- class exercise (2): tan x on [0, pi/2) (P6.4) ---
primitive("summary/P6.4/g6: -ln|cos x| is a primitive of tan x", lambda x: -log(abs(cos(x))), tan, (-1.2, 0.3, 1.1, 2.5))
for w in (0.7, 1.2, 1.55):
    check(f"summary/P6.4a: int_0^w tan x = -ln|cos w| (w={w})", integral(tan, 0, w, 20000), -log(cos(w)), 1e-8)
check("summary/P6.4a: tan x = -(cos x)'/cos x at 0.8", tan(0.8), -d1(cos, 0.8) / cos(0.8), 1e-8)
grows("summary/P6.4b: -ln|cos w| as w -> pi/2", lambda w: -log(cos(w)), [pi / 2 - 10.0 ** -k for k in (1, 3, 6, 9)], 20)
# --- class exercise (3) (P6.5) ---
primitive("summary/P6.5a/g6: -(1/2)e^(-x^2) is a primitive of x e^(-x^2)", lambda x: -0.5 * exp(-x * x), lambda x: x * exp(-x * x), XS)
check("summary/P6.5a: int_-inf^1 x e^(-x^2) = -1/(2e)", imp(lambda x: x * exp(-x * x), -INF, 1), -1 / (2 * math.e), 1e-9)
check("P6.5a: int_w^1 = -1/(2e) + e^(-w^2)/2 (w = -1.3)", integral(lambda x: x * exp(-x * x), -1.3, 1), -1 / (2 * math.e) + 0.5 * exp(-1.69))
check("P6.5a: the part from -inf to 0 is -1/2, from 0 to 1 is (1 - 1/e)/2", imp(lambda x: x * exp(-x * x), -INF, 0) + integral(lambda x: x * exp(-x * x), 0, 1), -1 / (2 * math.e))
check_true("P6.5a: the negative part outweighs the positive one", 0.5 > 0.5 * (1 - 1 / math.e))
primitive("summary/P6.5b/g3b: x ln x - x is a primitive of ln x", lambda x: x * log(x) - x, log, XN)
check("summary/P6.5b: int_0^1 ln x = -1", imp(log, 0, 1), -1, 1e-9)
check("P6.5b: int_w^1 ln x = (0 - 1) - (w ln w - w) (w = 0.2)", integral(log, 0.2, 1), -1 - (0.2 * log(0.2) - 0.2))
# --- a discontinuous point inside: 1/sqrt|x| on [-1, 1] (P6.6) ---
g = lambda x: 1 / sqrt(abs(x))
check("summary/P6.6: the right part int_0^1 = 2", imp(g, 0, 1), 2, 1e-9)
check("summary/P6.6: the left part int_-1^0 = 2", imp(g, -1, 0), 2, 1e-9)
check("summary/P6.6b: I = 2 + 2 = 4", imp(g, -1, 0) + imp(g, 0, 1), 4, 1e-9)
primitive("P6.6b: -2 sqrt(-x) is a primitive of 1/sqrt(-x) (x < 0)", lambda x: -2 * sqrt(-x), lambda x: 1 / sqrt(-x), (-0.9, -0.5, -0.1))
check("P6.6b: int_w^1 x^(-1/2) = 2 - 2 sqrt w (w = 0.25)", integral(g, 0.25, 1), 2 - 2 * sqrt(0.25))
check("P6.6b: int_-1^w (-x)^(-1/2) = 2 - 2 sqrt(-w) (w = -0.25)", integral(g, -1, -0.25), 2 - 2 * sqrt(0.25))
check("tricks: 1/sqrt|x| is even, so I = 2 int_0^1", g(-0.37), g(0.37)); check("tricks: 2 int_0^1 dx/sqrt x = 4", 2 * imp(g, 0, 1), 4, 1e-9)
# --- L'Hôpital's rule (summary, g6b) ---
check("summary/g6b: w/e^w -> 0 (w = 60)", 60 / exp(60), 0, 1e-20)
check("summary: the derivatives of w and e^w give 1/e^w", d1(lambda w: w, 2.0), 1, 1e-8)
for w in (0.3, 0.07):
    check(f"summary/g6b: w ln w = ln w / (1/w) at {w}", w * log(w), log(w) / (1 / w))
    check(f"summary: (1/w)/(-1/w^2) = -w at {w}", (1 / w) / (-1 / w ** 2), -w)
check_true("summary/g6b: w ln w -> 0 as w -> +0", all(abs(w * log(w)) < b for w, b in ((1e-4, 1e-2), (1e-8, 1e-6), (1e-15, 1e-13))))
check("g6b: ln w / w -> 0 (w = 1e12)", log(1e12) / 1e12, 0, 1e-9)
check("watch: lim (x+1)/(x+2) at 0 is 1/2", (0 + 1) / (0 + 2), 0.5); check_true("watch: L'Hôpital would wrongly give 1/1", 1 / 1 != 0.5)
# --- watch out ---
check("watch/P6.7a: plugging in the ends: [-1/x] from -1 to 1 = -2", (-1 / 1) - (-1 / -1), -2)
check("watch/P6.7a: int_w^1 dx/x^2 = 1/w - 1 (w = 0.1)", integral(lambda x: x ** -2, 0.1, 1), 9)
grows("watch/P6.7a: 1/w - 1 as w -> +0", lambda w: 1 / w - 1, [10.0 ** -k for k in (1, 3, 6)])
check_true("watch: 1/x -> 0, yet int_1^w dx/x = ln w passes every bound", 1 / 1e9 < 1e-8 and log(1e300) > 690)
# --- the power test (tricks, gs, P6.11) ---
for p in (1.5, 2, 3):
    check(f"tricks/gs: int_1^inf dx/x^p converges for p > 1 (p={p})", imp(lambda x, p=p: x ** -p, 1, INF), 1 / (p - 1), 1e-8)
for p in (0.5, 0.25):
    check(f"tricks/gs: int_0^1 dx/x^p converges for p < 1 (p={p})", imp(lambda x, p=p: x ** -p, 0, 1), 1 / (1 - p), 1e-8)
grows("tricks/gs: int_w^1 dx/x^p = (w^(1-p) - 1)/(p - 1) for p = 3/2", lambda w: (w ** -0.5 - 1) / 0.5, [10.0 ** -k for k in (1, 4, 8)])
grows("tricks/gs: int_w^1 dx/x = -ln w", lambda w: -log(w), [10.0 ** -k for k in (1, 10, 300)], 600)
check("tricks/P6.11c: tan x behaves like 1/(pi/2 - x): tan x (pi/2 - x) -> 1", tan(pi / 2 - 1e-6) * 1e-6, 1, 1e-9)
check("tricks: w^3 e^-w -> 0 (w = 200)", 200 ** 3 * exp(-200), 0, 1e-70)
check("tricks: ln w / w^(1/2) -> 0 (w = 1e30)", log(1e30) / 1e15, 0, 1e-12)
check("tricks: w^(1/2) ln w -> 0 (w = 1e-30)", 1e-15 * log(1e-30), 0, 1e-12)
# --- practice ---
# P6.2 powers on [1, inf)
check("P6.2a: int_1^inf x^-3 = 1/2", imp(lambda x: x ** -3, 1, INF), 0.5, 1e-9)
check("P6.2a: int_1^w = 1/2 - 1/(2w^2) (w = 4)", integral(lambda x: x ** -3, 1, 4), 0.5 - 1 / 32)
check("P6.2b: int_1^w x^(-1/2) = 2 sqrt w - 2 (w = 9)", integral(lambda x: x ** -0.5, 1, 9), 4)
check("P6.2c: int_1^w dx/x = ln w (w = 20)", integral(lambda x: 1 / x, 1, 20, 8000), log(20))
check("P6.2d: 1/(x sqrt x) = x^(-3/2) at 2.3", 1 / (2.3 * sqrt(2.3)), 2.3 ** -1.5)
check("P6.2d: int_1^inf x^(-3/2) = 2", imp(lambda x: x ** -1.5, 1, INF), 2, 1e-9)
check("P6.2d: int_1^w = 2 - 2/sqrt w (w = 16)", integral(lambda x: x ** -1.5, 1, 16), 2 - 2 / 4)
# P6.7b: the cube root, defined for negative x
cr = lambda x: math.copysign(abs(x) ** (1 / 3), x)
h = lambda x: 1 / cr(x)
check("P6.7b: cube root of -1 is -1", cr(-1), -1)
primitive("P6.7b: (3/2) x^(2/3) is a primitive of x^(-1/3) on both sides", lambda x: 1.5 * cr(x) ** 2, h, (-0.8, -0.2, 0.5, 3.0))
check("P6.7b: the right part int_0^8 = 6", imp(h, 0, 8), 6, 1e-9)
check("P6.7b: int_w^8 = 6 - (3/2) w^(2/3) (w = 0.5)", integral(h, 0.5, 8), 6 - 1.5 * 0.5 ** (2 / 3))
check("P6.7b: the left part int_-1^0 = -3/2", imp(h, -1, 0), -1.5, 1e-9)
check("P6.7b: (-1)^(2/3) = (cube root of -1)^2 = 1", cr(-1) ** 2, 1)
check("P6.7b: the whole integral 9/2", imp(h, -1, 0) + imp(h, 0, 8), 4.5, 1e-9)
# P6.8 L'Hôpital's rule
check("P6.8a: (e^x - 1)/x -> 1 (x = 1e-7)", (exp(1e-7) - 1) / 1e-7, 1, 1e-6)
check("P6.8b: (1 - cos x)/x^2 -> 1/2 (x = 1e-4)", (1 - cos(1e-4)) / 1e-8, 0.5, 1e-6)
check("P6.8b: the middle step sin x/(2x) -> 1/2 (x = 1e-6)", sin(1e-6) / 2e-6, 0.5, 1e-9)
check("P6.8c: x^2/e^x -> 0 (x = 80)", 80 ** 2 / exp(80), 0, 1e-25)
check("P6.8c: the middle step 2x/e^x -> 0 (x = 80)", 160 / exp(80), 0, 1e-25)
check("P6.8d: x^2 ln x -> 0 (x = 1e-6)", 1e-12 * log(1e-6), 0, 1e-10)
check("P6.8d: (1/x)/(-2x^-3) = -x^2/2 at 0.7", (1 / 0.7) / (-2 * 0.7 ** -3), -0.49 / 2)
# P6.9 by parts, then a limit
primitive("P6.9a: -(x+1)e^(-x) is a primitive of x e^(-x)", lambda x: -(x + 1) * exp(-x), lambda x: x * exp(-x), XS)
check("P6.9a: int_0^inf x e^-x = 1", imp(lambda x: x * exp(-x), 0, INF), 1, 1e-9)
check("P6.9a: int_0^w = 1 - (w+1)/e^w (w = 3)", integral(lambda x: x * exp(-x), 0, 3), 1 - 4 / exp(3))
primitive("P6.9b: -(ln x + 1)/x is a primitive of ln x/x^2", lambda x: -(log(x) + 1) / x, lambda x: log(x) / x ** 2, XN)
check("P6.9b: int_1^inf ln x/x^2 = 1", imp(lambda x: log(x) / x ** 2, 1, INF), 1, 1e-9)
check("P6.9b: int_1^w = 1 - (ln w + 1)/w (w = 5)", integral(lambda x: log(x) / x ** 2, 1, 5), 1 - (log(5) + 1) / 5)
check("P6.9b: (ln w + 1)/w -> 0 (w = 1e15)", (log(1e15) + 1) / 1e15, 0, 1e-12)
# P6.10 converge or diverge
check("P6.10a: int_0^inf e^(-2x) = 1/2", imp(lambda x: exp(-2 * x), 0, INF), 0.5, 1e-9)
primitive("P6.10b: ln(ln x) is a primitive of 1/(x ln x)", lambda x: log(log(x)), lambda x: 1 / (x * log(x)), (1.5, 2.5, 7.0))
grows("P6.10b: ln(ln w) - ln(ln 2)", lambda w: log(log(w)) - log(log(2)), [10.0 ** k for k in (1, 10, 100, 300)], 6)
primitive("P6.10c: arcsin(x/2) is a primitive of 1/sqrt(4 - x^2)", lambda x: asin(x / 2), lambda x: 1 / sqrt(4 - x * x), (-1.5, 0.3, 1.2, 1.9))
check("P6.10c: int_0^2 dx/sqrt(4 - x^2) = pi/2", imp(lambda x: 1 / sqrt(4 - x * x), 0, 2), pi / 2, 1e-9)
for x in (1.3, 4.0):
    check(f"P6.10d: 1/(x(x+1)) = 1/x - 1/(x+1) at {x}", 1 / (x * (x + 1)), 1 / x - 1 / (x + 1))
primitive("P6.10d: ln(x/(x+1)) is a primitive of 1/(x(x+1))", lambda x: log(x / (x + 1)), lambda x: 1 / (x * (x + 1)), XN)
check("P6.10d: int_1^inf dx/(x(x+1)) = ln 2", imp(lambda x: 1 / (x * (x + 1)), 1, INF), log(2), 1e-9)
# P6.11 the power test
check("P6.11a: int_1^inf dx/(x^2+1) = pi/4", imp(lambda x: 1 / (x * x + 1), 1, INF), pi / 4, 1e-9)
check("P6.11a: 1/(x^2+1) is about 1/x^2 for large x", (1 / (1e6 ** 2 + 1)) * 1e12, 1, 1e-9)
check("P6.11b: converges: int_0^1 dx/sqrt(x + x^2) = ln(3 + 2 sqrt2)", imp(lambda x: 1 / sqrt(x + x * x), 0, 1), log(3 + 2 * sqrt(2)), 1e-9)
check("P6.11b: near 0 the integrand is about 1/sqrt x", sqrt(1e-10) / sqrt(1e-10 + 1e-20), 1, 1e-9)
primitive("P6.11c: ln(1/cos x + tan x) is a primitive of 1/cos x", lambda x: log(1 / cos(x) + tan(x)), lambda x: 1 / cos(x), (-1.2, 0.2, 0.9, 1.4))
check("P6.11c: cos x is about pi/2 - x near pi/2", cos(pi / 2 - 1e-6) / 1e-6, 1, 1e-9)
grows("P6.11c: ln(1/cos w + tan w) as w -> pi/2", lambda w: log(1 / cos(w) + tan(w)), [pi / 2 - 10.0 ** -k for k in (1, 4, 8, 12)], 25)
primitive("P6.11d: 2/sqrt(1-x) is a primitive of (1-x)^(-3/2)", lambda x: 2 / sqrt(1 - x), lambda x: (1 - x) ** -1.5, (-0.5, 0.2, 0.8))
check("P6.11d: int_0^w = 2/sqrt(1-w) - 2 (w = 0.9)", integral(lambda x: (1 - x) ** -1.5, 0, 0.9, 20000), 2 / sqrt(0.1) - 2, 1e-8)
grows("P6.11d: 2/sqrt(1-w) - 2 as w -> 1", lambda w: 2 / sqrt(1 - w) - 2, [1 - 10.0 ** -k for k in (1, 4, 8, 12)], 1e5)

# ================= 20 Nov: orthogonal functions and the Fourier basis (u6, g6c, P6.12–P6.16) =================
ip = lambda f, g: integral(lambda x: f(x) * g(x), -pi, pi, 4000)
S = lambda m: (lambda x: sin(m * x))
C = lambda n: (lambda x: cos(n * x))
am = lambda f, m: ip(f, C(m)) / pi
bm = lambda f, m: ip(f, S(m)) / pi
avg = lambda f: integral(f, -pi, pi, 4000) / (2 * pi)
for m in range(1, 6):
    for n in range(1, 6):
        check(f"summary/g6c/P6.12: <S_{m}|C_{n}> = 0", ip(S(m), C(n)), 0, 1e-9)
        check(f"summary/g6c/P6.13: <S_{m}|S_{n}> = {'pi' if m == n else 0}", ip(S(m), S(n)), pi if m == n else 0, 1e-9)
        check(f"summary/g6c/P6.13: <C_{m}|C_{n}> = {'pi' if m == n else 0}", ip(C(m), C(n)), pi if m == n else 0, 1e-9)
    check(f"summary: the constant 1 is orthogonal to C_{m} and S_{m}", abs(ip(lambda x: 1, C(m))) + abs(ip(lambda x: 1, S(m))), 0, 1e-9)
check("summary: <f|f> = int f^2 > 0 (f = x: 2 pi^3/3)", ip(lambda x: x, lambda x: x), 2 * pi ** 3 / 3)
check("summary: <1|1> = 2 pi", ip(lambda x: 1, lambda x: 1), 2 * pi)
for x in (0.3, 1.7, -2.4):
    for m, n in ((2, 3), (1, 4), (3, 1)):
        check(f"summary/P6.13: sin mx sin nx = (cos(m-n)x - cos(m+n)x)/2 (m={m}, n={n}, x={x})", sin(m * x) * sin(n * x), (cos((m - n) * x) - cos((m + n) * x)) / 2)
        check(f"P6.13: cos mx cos nx = (cos(m-n)x + cos(m+n)x)/2 (m={m}, n={n}, x={x})", cos(m * x) * cos(n * x), (cos((m - n) * x) + cos((m + n) * x)) / 2)
        check(f"summary/P6.12: sin mx cos nx = (sin(m+n)x + sin(m-n)x)/2 (m={m}, n={n}, x={x})", sin(m * x) * cos(n * x), (sin((m + n) * x) + sin((m - n) * x)) / 2)
    check(f"summary/P6.13: sin^2 3x = (1 - cos 6x)/2 at {x}", sin(3 * x) ** 2, (1 - cos(6 * x)) / 2)
    check(f"P6.13: cos^2 2x = (1 + cos 4x)/2 at {x}", cos(2 * x) ** 2, (1 + cos(4 * x)) / 2)
    check(f"summary/P6.12: sin mx cos mx = sin(2mx)/2 at {x} (m=2)", sin(2 * x) * cos(2 * x), sin(4 * x) / 2)
for k in range(1, 6):
    check(f"summary/P6.13: int_-pi^pi cos {k}x dx = 0", integral(lambda x, k=k: cos(k * x), -pi, pi), 0, 1e-12)
# class exercise (4): the primitive takes the same value at pi and -pi
for m, n in ((1, 2), (3, 1), (2, 5)):
    F = lambda x, m=m, n=n: -cos((m + n) * x) / (2 * (m + n)) - cos((m - n) * x) / (2 * (m - n))
    primitive(f"summary/P6.12: a primitive of sin({m}x)cos({n}x)", F, lambda x, m=m, n=n: sin(m * x) * cos(n * x), (-1.1, 0.4, 2.0))
    check(f"summary/P6.12: F(pi) = F(-pi) (m={m}, n={n})", F(pi), F(-pi), 1e-12)
for m in (1, 2, 3):
    G = lambda x, m=m: -cos(2 * m * x) / (4 * m)
    primitive(f"P6.12(2): a primitive of sin(mx)cos(mx) (m={m})", G, lambda x, m=m: sin(m * x) * cos(m * x), (-1.1, 0.4, 2.0))
    check(f"P6.12(2): G(pi) = G(-pi) (m={m})", G(pi), G(-pi), 1e-12)
# the coefficients from inner products: a sum of basis functions gives back its own coefficients
fs = lambda x: 0.7 + 2 * cos(x) - 3 * sin(2 * x) + 0.5 * cos(3 * x)
check("summary/g6c: a_1 of 0.7 + 2cos x - 3sin 2x + 0.5cos 3x = 2", am(fs, 1), 2)
check("summary/g6c: its b_2 = -3", bm(fs, 2), -3)
check("summary/g6c: its a_3 = 0.5", am(fs, 3), 0.5)
check("summary/g6c: its b_1 = a_2 = 0", abs(bm(fs, 1)) + abs(am(fs, 2)), 0, 1e-9)
check("summary: the constant term is the average of f", avg(fs), 0.7)
f4 = lambda x: sin(x + pi / 4)
for x in (0.5, -2.0):
    check(f"summary: sin(x + pi/4) = (sqrt2/2) sin x + (sqrt2/2) cos x at {x}", f4(x), sqrt(2) / 2 * (sin(x) + cos(x)))
check("summary: sin(x + pi/4): a_1 = sqrt2/2", am(f4, 1), sqrt(2) / 2)
check("summary: sin(x + pi/4): b_1 = sqrt2/2", bm(f4, 1), sqrt(2) / 2)
check("summary: sin(x + pi/4): a_m = b_m = 0 for m = 2..5", sum(abs(am(f4, m)) + abs(bm(f4, m)) for m in range(2, 6)), 0, 1e-9)
check("summary/fourier: x^2 = pi^2/3 + sum 4(-1)^m cos(mx)/m^2 at x = 1 (the constant is the average)",
      pi ** 2 / 3 + sum(4 * (-1) ** m * cos(m * 1.0) / m ** 2 for m in range(1, 20001)), 1.0, 1e-6)
for A, B in ((0.7, 0.3), (2.1, -1.2)):
    check(f"g6c/watch: cos(A + B) = cos A cos B - sin A sin B at {A}, {B}", cos(A + B), cos(A) * cos(B) - sin(A) * sin(B))
    check(f"g6c/P6.14: cos(A - B) = cos A cos B + sin A sin B at {A}, {B}", cos(A - B), cos(A) * cos(B) + sin(A) * sin(B))
    check(f"g6c: sin(A + B) = sin A cos B + cos A sin B at {A}, {B}", sin(A + B), sin(A) * cos(B) + cos(A) * sin(B))
    check(f"g6c/watch: sin(A - B) = sin A cos B - cos A sin B at {A}, {B}", sin(A - B), sin(A) * cos(B) - cos(A) * sin(B))
check("watch: int_{-pi/2}^{pi/2} sin x sin 2x dx = 4/3", integral(lambda x: sin(x) * sin(2 * x), -pi / 2, pi / 2), 4 / 3)
# --- practice ---
f14 = lambda x: cos(3 * x - pi / 6)
check("P6.14(1): a_3 = sqrt3/2", am(f14, 3), sqrt(3) / 2)
check("P6.14(1): b_3 = 1/2", bm(f14, 3), 0.5)
for x in (0.9, -1.3):
    check(f"P6.14(1): cos(3x - pi/6) = (sqrt3/2)cos 3x + (1/2)sin 3x at {x}", f14(x), sqrt(3) / 2 * cos(3 * x) + 0.5 * sin(3 * x))
check("P6.14(2): a_1 = 0", am(f14, 1), 0, 1e-9); check("P6.14(2): b_2 = 0", bm(f14, 2), 0, 1e-9)
g14 = lambda x: sin(3 * x) * cos(x)
check("P6.14(3): b_2 = 1/2", bm(g14, 2), 0.5); check("P6.14(3): b_4 = 1/2", bm(g14, 4), 0.5)
check("P6.14(3): every a_m, and b_1, b_3, b_5, is 0", sum(abs(am(g14, m)) for m in range(1, 7)) + abs(bm(g14, 1)) + abs(bm(g14, 3)) + abs(bm(g14, 5)), 0, 1e-9)
check("P6.14(3): int sin 3x cos x sin 2x dx = pi/2", ip(g14, S(2)), pi / 2)
for x in (0.6, 2.3):
    check(f"P6.14(3): sin 3x cos x = (sin 4x + sin 2x)/2 at {x}", g14(x), (sin(4 * x) + sin(2 * x)) / 2)
for m in range(1, 7):
    check(f"P6.15(1): a_{m} of x = 0", am(lambda x: x, m), 0, 1e-9)
    check(f"P6.15(2): b_{m} of x = 2(-1)^(m+1)/m", bm(lambda x: x, m), 2 * (-1) ** (m + 1) / m)
    primitive(f"P6.15(1): x sin(mx)/m + cos(mx)/m^2 (m={m})", lambda x, m=m: x * sin(m * x) / m + cos(m * x) / m ** 2, lambda x, m=m: x * cos(m * x), (-2.0, 0.5, 1.9))
    primitive(f"P6.15(2): -x cos(mx)/m + sin(mx)/m^2 (m={m})", lambda x, m=m: -x * cos(m * x) / m + sin(m * x) / m ** 2, lambda x, m=m: x * sin(m * x), (-2.0, 0.5, 1.9))
    check(f"P6.15(2): -pi(-1)^m/m - pi(-1)^m/m = 2pi(-1)^(m+1)/m (m={m})", -2 * pi * (-1) ** m / m, 2 * pi * (-1) ** (m + 1) / m)
check("P6.15(3): b_1, b_2, b_3 = 2, -1, 2/3", abs(bm(lambda x: x, 1) - 2) + abs(bm(lambda x: x, 2) + 1) + abs(bm(lambda x: x, 3) - 2 / 3), 0, 1e-9)
check("P6.15(3): 2 sin x - sin 2x + (2/3) sin 3x - ... tends to x (x = 1)", sum(2 * (-1) ** (m + 1) / m * sin(m * 1.0) for m in range(1, 200001)), 1.0, 1e-4)
for m in range(1, 5):
    check(f"P6.16(1)/tricks: a_{m} of x^3 = 0", am(lambda x: x ** 3, m), 0, 1e-9)
    check(f"P6.16(2)/tricks: b_{m} of x^2 = 0", bm(lambda x: x * x, m), 0, 1e-9)
    check(f"P6.16(3): b_{m} of x sin x = 0", bm(lambda x: x * sin(x), m), 0, 1e-9)
check("P6.16(1): x^3 keeps its sines (b_1 = 2(pi^2 - 6))", bm(lambda x: x ** 3, 1), 2 * (pi ** 2 - 6))
check("P6.16(2): the average of x^2 = pi^2/3", avg(lambda x: x * x), pi ** 2 / 3)
check("P6.16(3): the average of x sin x = 1", avg(lambda x: x * sin(x)), 1)

# ================= FOLLOW-UPS (Quiz 10) =================
# 10-A
gA = lambda t: 2 * t ** 3 / (2 - t)
FA = lambda s: -2 * (s ** 3 / 3 + s * s + 4 * s) - 16 * log(2 - s) + 16 * log(2)
for t in (0.3, 1.1, 1.9):
    check(f"10A Q1(1) t^3 = (t-2)(t^2+2t+4) + 8 at {t}", t ** 3, (t - 2) * (t * t + 2 * t + 4) + 8)
    check(f"10A Q1(1) 2t^3/(2-t) = -2(t^2+2t+4) + 16/(2-t) at {t}", gA(t), -2 * (t * t + 2 * t + 4) + 16 / (2 - t))
    check(f"10A Q1(1) F'(s) = 2s^3/(2-s) at {t}", d1(FA, t), gA(t), 1e-6)
check("10A Q1(1) F(0) = 0", FA(0), 0, 1e-12)
for w in (1.0, 3.2):
    check(f"10A Q1(1) int_0^w x/(2 - sqrt x) dx = F(sqrt w) (w={w})", imp(lambda x: x / (2 - sqrt(x)), 0, w), FA(sqrt(w)), 1e-9)
grows("10A Q1(1) F(s) as s -> 2", FA, [2 - 10.0 ** -k for k in (2, 4, 8, 12)], 100)
check("10A Q1(2) int_0^inf x^2 e^(-x^3) dx = 1/3", imp(lambda x: x * x * exp(-x ** 3), 0, INF), 1 / 3, 1e-9)
primitive("10A Q1(2) -(1/3)e^(-x^3) is a primitive of x^2 e^(-x^3)", lambda x: -exp(-x ** 3) / 3, lambda x: x * x * exp(-x ** 3), XN)
fA = lambda x: sin(2 * x + pi / 6)
check("10A Q2 a_2 = 1/2", am(fA, 2), 0.5); check("10A Q2 b_2 = sqrt3/2", bm(fA, 2), sqrt(3) / 2)
check("10A Q2 every other coefficient is 0", sum(abs(am(fA, m)) + abs(bm(fA, m)) for m in (1, 3, 4, 5)), 0, 1e-9)
for x in (0.8, -2.2):
    check(f"10A Q2 sin(2x + pi/6) = (sqrt3/2) sin 2x + (1/2) cos 2x at {x}", fA(x), sqrt(3) / 2 * sin(2 * x) + 0.5 * cos(2 * x))
check("10A Q2 a_2 = (1/pi)(1/2)<C_2|C_2>", 0.5 * ip(C(2), C(2)) / pi, 0.5)
# 10-B
check("10B Q1(1) int_0^2 dx/cbrt(2-x) = (3/2) cbrt 4", imp(lambda x: (2 - x) ** (-1 / 3), 0, 2), 1.5 * 4 ** (1 / 3), 1e-9)
primitive("10B Q1(1) -(3/2)(2-x)^(2/3) is a primitive of (2-x)^(-1/3)", lambda x: -1.5 * (2 - x) ** (2 / 3), lambda x: (2 - x) ** (-1 / 3), (-1.0, 0.5, 1.5))
check("10B Q1(1) (3/2) 2^(2/3) = (3/2) cbrt 4", 1.5 * 2 ** (2 / 3), 1.5 * 4 ** (1 / 3))
check("10B Q1(1) int_0^w = (3/2)2^(2/3) - (3/2)(2-w)^(2/3) (w = 1.5)", integral(lambda x: (2 - x) ** (-1 / 3), 0, 1.5), 1.5 * 2 ** (2 / 3) - 1.5 * 0.5 ** (2 / 3))
check_true("10B Q1(1) without the minus sign the answer is negative", -1.5 * 4 ** (1 / 3) < 0)
FB = lambda w: -1 / (w - 1) - 1
check("10B Q1(2) int_0^w dx/(x-1)^2 = -1/(w-1) - 1 (w = 0.6)", integral(lambda x: 1 / (x - 1) ** 2, 0, 0.6), FB(0.6))
grows("10B Q1(2) -1/(w-1) - 1 as w -> 1 from below", FB, [1 - 10.0 ** -k for k in (1, 3, 6, 9)])
check("10B Q1(2) without the split: [-1/(x-1)]_0^3 = -3/2", (-1 / (3 - 1)) - (-1 / (0 - 1)), -1.5)
fB = lambda x: sin(x - pi / 3)
check("10B Q2 a_1 = -sqrt3/2", am(fB, 1), -sqrt(3) / 2); check("10B Q2 b_1 = 1/2", bm(fB, 1), 0.5)
check("10B Q2 b_2 = 0", bm(fB, 2), 0, 1e-9)
for x in (0.8, -2.2):
    check(f"10B Q2 sin(x - pi/3) = (1/2) sin x - (sqrt3/2) cos x at {x}", fB(x), 0.5 * sin(x) - sqrt(3) / 2 * cos(x))

# ================= MOCK MIDTERMS (exams.mjs: im1, im2, im3) =================
# --- Mock 1 ---
primitive("M1[1](1): x^4 - 6 sqrt x + 2 ln|x|", lambda x: x ** 4 - 6 * sqrt(x) + 2 * log(abs(x)), lambda x: 4 * x ** 3 - 3 / sqrt(x) + 2 / x, XN)
primitive("M1[1](2): ln(e^x + 3)", lambda x: log(exp(x) + 3), lambda x: exp(x) / (exp(x) + 3), XS)
f13 = lambda x: (x + 5) / (x * x + x - 2)
primitive("M1[1](3): 2 ln|x-1| - ln|x+2|", lambda x: 2 * log(abs(x - 1)) - log(abs(x + 2)), f13, (-3.5, -0.5, 0.4, 2.7))
check("M1[1](3): A = 6/3 = 2 at x = 1", Fr(1 + 5, 1 + 2), 2); check("M1[1](3): B = 3/(-3) = -1 at x = -2", Fr(-2 + 5, -2 - 1), -1)
primitive("M1[1](4): (x/2) sin 2x + (1/4) cos 2x", lambda x: x / 2 * sin(2 * x) + cos(2 * x) / 4, lambda x: x * cos(2 * x), XS)
check("M1[1](5): int_0^(pi/4) tan x / cos^2 x = 1/2", integral(lambda x: tan(x) / cos(x) ** 2, 0, pi / 4), 0.5)
check("M1[1](5): with u = tan x: int_0^1 u du", integral(lambda u: u, 0, 1), 0.5)
check("M1[1](6): int_0^inf dx/(x^2+4) = pi/4", imp(lambda x: 1 / (x * x + 4), 0, INF), pi / 4, 1e-9)
check("M1[1](6): int_0^w = (1/2) arctan(w/2) (w = 5)", integral(lambda x: 1 / (x * x + 4), 0, 5), 0.5 * atan(2.5))
v1 = lambda t: 6 * t - 3 * t * t
s1 = lambda t: 3 * t * t - t ** 3 + 2
primitive("M1[2](a): s(t) = 3t^2 - t^3 + 2 has s' = v", s1, v1, (0.4, 1.3, 2.6)); check("M1[2](a): s(0) = 2", s1(0), 2)
check("M1[2](b): displacement int_0^3 v = 0", integral(v1, 0, 3), 0, 1e-12)
check("M1[2](b): distance int_0^3 |v| = 8", integral(lambda t: abs(v1(t)), 0, 2) + integral(lambda t: abs(v1(t)), 2, 3), 8)
check_true("M1[2](b): v > 0 on (0, 2), v < 0 on (2, 3]", all(v1(k / 100) > 0 for k in range(1, 200)) and all(v1(2 + k / 100) < 0 for k in range(1, 101)))
check("M1[3](a): the curves meet at x = 4", sqrt(4), 4 / 2)
check_true("M1[3](a): sqrt x >= x/2 on [0, 4]", all(sqrt(k / 100) >= k / 200 - 1e-15 for k in range(0, 401)))
check("M1[3](a): area 4/3", imp(lambda x: sqrt(x) - x / 2, 0, 4), 4 / 3, 1e-9)
check("M1[3](b): volume pi int (x - x^2/4) = 8 pi/3", pi * integral(lambda x: x - x * x / 4, 0, 4), 8 * pi / 3)
check("M1[3](b): the same as pi int (sqrt(x)^2 - (x/2)^2)", pi * integral(lambda x: sqrt(x) ** 2 - (x / 2) ** 2, 0, 4), 8 * pi / 3)
check_true("M1[3](b): squaring the difference gives another number (8 pi/15)",
           abs(pi * integral(lambda x: (sqrt(x) - x / 2) ** 2, 0, 4, 20000) - 8 * pi / 15) < 1e-6 and abs(8 * pi / 15 - 8 * pi / 3) > 1)
X41, Y41 = (lambda t: t * t), (lambda t: 2 * t ** 3 / 3)
check("M1[4](a): dy/dx at t = 1 is 1", d1(Y41, 1.0) / d1(X41, 1.0), 1, 1e-6)
check("M1[4](b): length on [0, sqrt3] = 14/3", plen(X41, Y41, 0, sqrt(3)), 14 / 3)
check("M1[4](b): 2t sqrt(1+t^2) is the root of 4t^2 + 4t^4 (t = 1.2)", 2 * 1.2 * sqrt(1 + 1.44), sqrt(4 * 1.44 + 4 * 1.2 ** 4))
check("M1[4](c): area int y dx/dt = 12 sqrt3/5", integral(lambda t: Y41(t) * 2 * t, 0, sqrt(3)), 12 * sqrt(3) / 5)
check("M1[4](c): the same area in x: int_0^3 (2/3) x^(3/2)", integral(lambda x: 2 / 3 * x ** 1.5, 0, 3), 12 * sqrt(3) / 5)
check("M1[4](c): sqrt3^5 = 9 sqrt3", sqrt(3) ** 5, 9 * sqrt(3))
# --- Mock 2 ---
primitive("M2[1](1): 2^x/ln 2 + arctan x", lambda x: 2 ** x / log(2) + atan(x), lambda x: 2 ** x + 1 / (1 + x * x), XS)
primitive("M2[1](2): (2/3)(1 + sin x)^(3/2)", lambda x: 2 / 3 * (1 + sin(x)) ** 1.5, lambda x: cos(x) * sqrt(1 + sin(x)), XS)
primitive("M2[1](3): (1/2) arctan((x+3)/2)", lambda x: 0.5 * atan((x + 3) / 2), lambda x: 1 / (x * x + 6 * x + 13), XS)
check("M2[1](3): (x+3)^2 + 4 = x^2 + 6x + 13 at 1.7", (1.7 + 3) ** 2 + 4, 1.7 ** 2 + 6 * 1.7 + 13); check_true("M2[1](3): 36 - 52 < 0", 36 - 52 < 0)
primitive("M2[1](4): (x^3/3) ln x - x^3/9", lambda x: x ** 3 / 3 * log(x) - x ** 3 / 9, lambda x: x * x * log(x), XN)
check("M2[1](5): int_0^sqrt3 x^3/sqrt(x^2+1) = 4/3", integral(lambda x: x ** 3 / sqrt(x * x + 1), 0, sqrt(3)), 4 / 3)
check("M2[1](5): (1/2) int_1^4 (u - 1)/sqrt u du = 4/3", 0.5 * integral(lambda u: (u - 1) / sqrt(u), 1, 4), 4 / 3)
check("M2[1](5): [u^(3/2)/3 - u^(1/2)] from 1 to 4", (8 / 3 - 2) - (1 / 3 - 1), 4 / 3)
check("M2[1](6): int_1^w dx/(2x+1) = (1/2) ln(2w+1) - (1/2) ln 3 (w = 10)", integral(lambda x: 1 / (2 * x + 1), 1, 10), 0.5 * log(21) - 0.5 * log(3))
grows("M2[1](6): (1/2) ln(2w+1) - (1/2) ln 3", lambda w: 0.5 * log(2 * w + 1) - 0.5 * log(3), [10.0 ** k for k in (1, 10, 100, 300)], 300)
f2 = lambda x: 3 * x * x + 2
for n in NS:
    check(f"M2[2](a): S_n = 12 + 12/n + 4/n^2 exactly (n={n})", riemann(f2, 0, 2, n), 12 + Fr(12, n) + Fr(4, n * n))
check("M2[2](a): one strip: 2 f(2) = 28", 2 * f2(2), 28)
check("M2[2](a): 4(n+1)(2n+1)/n^2 + 4 at n = 7", Fr(4 * 8 * 15, 49) + 4, 12 + Fr(12, 7) + Fr(4, 49))
check("M2[2](b): the limit 12 = int_0^2 (3x^2 + 2)", integral(f2, 0, 2), 12)
check("M2[2](b): n = 10^6 is near 12", 12 + 12 / 1e6 + 4 / 1e12, 12, 1e-5)
yp = lambda x: x * sqrt(x * x + 2)
for x in (0.4, 1.3, 2.7):
    check(f"M2[3](a): y' = x sqrt(x^2+2) at {x}", d1(lambda t: (t * t + 2) ** 1.5 / 3, x), yp(x), 1e-6)
    check(f"M2[3](a): 1 + y'^2 = (x^2+1)^2 at {x}", 1 + yp(x) ** 2, (x * x + 1) ** 2)
check("M2[3](a): length on [0, 3] = 12", integral(lambda x: sqrt(1 + yp(x) ** 2), 0, 3), 12)
primitive("M2[3](b): x sin x + cos x", lambda x: x * sin(x) + cos(x), lambda x: x * cos(x), XS)
check("M2[3](b): int_0^(pi/2) x cos x = pi/2 - 1", integral(lambda x: x * cos(x), 0, pi / 2), pi / 2 - 1)
check("M2[3](b): average 1 - 2/pi", integral(lambda x: x * cos(x), 0, pi / 2) / (pi / 2), 1 - 2 / pi)
r42 = lambda th: sin(th / 3) ** 3
for th in (0.5, 2.0, 7.4):
    check(f"M2[4](a): x^2 + y^2 = r^2 at {th}", (r42(th) * cos(th)) ** 2 + (r42(th) * sin(th)) ** 2, r42(th) ** 2)
    check(f"M2[4](b): r' = sin^2(th/3) cos(th/3) at {th}", d1(r42, th), sin(th / 3) ** 2 * cos(th / 3), 1e-6)
    check(f"M2[4](b): r^2 + r'^2 = sin^4(th/3) at {th}", r42(th) ** 2 + d1(r42, th) ** 2, sin(th / 3) ** 4, 1e-6)
check("M2[4](c): length on [0, 3 pi] = 3 pi/2", polar_len(r42, 0, 3 * pi, 8000), 3 * pi / 2, 1e-7)
primitive("M2[4](c): theta/2 - (3/4) sin(2 theta/3) is a primitive of sin^2(theta/3)", lambda th: th / 2 - 0.75 * sin(2 * th / 3), lambda th: sin(th / 3) ** 2, (0.3, 2.2, 6.0))
check_true("M2[4](c): sin^2(theta/3) >= 0, so no absolute value", all(sin(k * pi / 300) ** 2 >= 0 for k in range(0, 301)))
# --- Mock 3 ---
primitive("M3[1](1): x + 4 sqrt x + ln x", lambda x: x + 4 * sqrt(x) + log(x), lambda x: (sqrt(x) + 1) ** 2 / x, XN)
primitive("M3[1](2): -cos(ln x)", lambda x: -cos(log(x)), lambda x: sin(log(x)) / x, XN)
primitive("M3[1](3): ln(x^2+4) - (3/2) arctan(x/2)", lambda x: log(x * x + 4) - 1.5 * atan(x / 2), lambda x: (2 * x - 3) / (x * x + 4), XS)
primitive("M3[1](4): x arctan x - (1/2) ln(1+x^2)", lambda x: x * atan(x) - 0.5 * log(1 + x * x), atan, XS)
for x in (0.3, 1.1):
    check(f"M3[1](5): sin 3x cos x = (sin 4x + sin 2x)/2 at {x}", sin(3 * x) * cos(x), (sin(4 * x) + sin(2 * x)) / 2)
check("M3[1](5): int_0^(pi/2) sin 3x cos x = 1/2", integral(lambda x: sin(3 * x) * cos(x), 0, pi / 2), 0.5)
check("M3[1](6): int_0^(pi/2) cos x/sqrt(sin x) = 2", imp(lambda x: cos(x) / sqrt(sin(x)), 0, pi / 2), 2, 1e-9)
check("M3[1](6): int_w^(pi/2) = 2 - 2 sqrt(sin w) (w = 0.3)", integral(lambda x: cos(x) / sqrt(sin(x)), 0.3, pi / 2), 2 - 2 * sqrt(sin(0.3)))
v3 = lambda t: 3 * t * t - 4 * t + 1
s3 = lambda t: t ** 3 - 2 * t * t + t
primitive("M3[2](a): v' = a = 6t - 4", v3, lambda t: 6 * t - 4, (0.2, 0.9, 1.7)); check("M3[2](a): v(0) = 1", v3(0), 1)
primitive("M3[2](a): s' = v", s3, v3, (0.2, 0.9, 1.7)); check("M3[2](a): s(0) = 0", s3(0), 0)
check("M3[2](b): at rest at t = 1/3", v3(Fr(1, 3)), 0); check("M3[2](b): at rest at t = 1", v3(1), 0)
check("M3[2](c): s(1/3) = 4/27", s3(Fr(1, 3)), Fr(4, 27)); check("M3[2](c): s(1) = 0", s3(1), 0)
check("M3[2](c): distance int_0^1 |v| = 8/27", integral(lambda t: abs(v3(t)), 0, 1 / 3) + integral(lambda t: abs(v3(t)), 1 / 3, 1), 8 / 27)
check("M3[2](c): displacement 0", integral(v3, 0, 1), 0, 1e-12)
check_true("M3[3](a): x >= x^3 on [0, 1]", all(k / 100 >= (k / 100) ** 3 for k in range(0, 101)))
check("M3[3](a): area int_0^1 (x - x^3) = 1/4", integral(lambda x: x - x ** 3, 0, 1), 0.25)
check("M3[3](b): volume pi int_0^1 (x^2 - x^6) = 4 pi/21", pi * integral(lambda x: x * x - x ** 6, 0, 1), 4 * pi / 21)
check("M3[4](a): w^2 e^-w -> 0 (w = 100)", 100 ** 2 * exp(-100), 0, 1e-35)
check("M3[4](a): the middle step 2w/e^w -> 0 (w = 100)", 200 * exp(-100), 0, 1e-35)
primitive("M3[4](b): -(x^2 + 2x + 2) e^-x is a primitive of x^2 e^-x", lambda x: -(x * x + 2 * x + 2) * exp(-x), lambda x: x * x * exp(-x), XS)
check("M3[4](b): int_0^inf x^2 e^-x = 2", imp(lambda x: x * x * exp(-x), 0, INF), 2, 1e-9)
check("M3[4](b): int_0^w = 2 - (w^2 + 2w + 2) e^-w (w = 4)", integral(lambda x: x * x * exp(-x), 0, 4), 2 - 26 * exp(-4))

# --- Mock 4 (quiz style) ---
f41 = lambda x: 3 * x * x + 2 * x
for n in NS:
    check(f"M4 Q.1(1): S_N = 2 + 5/(2N) + 1/(2N^2) exactly (N={n})", riemann(f41, 0, 1, n), 2 + Fr(5, 2 * n) + Fr(1, 2 * n * n))
check("M4 Q.1(1): (N+1)(2N+1)/(2N^2) + (N+1)/N at N = 6", Fr(7 * 13, 72) + Fr(7, 6), 2 + Fr(5, 12) + Fr(1, 72))
check("M4 Q.1(1): the limit 2 = int_0^1 (3x^2 + 2x)", integral(f41, 0, 1), 2)
check("M4 Q.1(2): int_0^ln2 e^(2x) = 3/2", integral(lambda x: exp(2 * x), 0, log(2)), 1.5)
f43 = lambda x: x * x - 2 * x
check("M4 Q.1(3): int_0^2 (x^2 - 2x) = -4/3", integral(f43, 0, 2), -4 / 3); check("M4 Q.1(3): int_2^3 = 4/3", integral(f43, 2, 3), 4 / 3)
check("M4 Q.1(3): area 8/3", integral(lambda x: abs(f43(x)), 0, 2) + integral(lambda x: abs(f43(x)), 2, 3), 8 / 3)
check("M4 Q.1(3): the integral over [0, 3] alone is 0", integral(f43, 0, 3), 0, 1e-12)
check("M4 Q.2(1): int_0^1 x^2/(x^3+1) = ln 2 / 3", integral(lambda x: x * x / (x ** 3 + 1), 0, 1), log(2) / 3)
check("M4 Q.2(2): int_0^(pi/4) sin x / cos^3 x = 1/2", integral(lambda x: sin(x) / cos(x) ** 3, 0, pi / 4), 0.5)
primitive("M4 Q.2(2): 1/(2 cos^2 x) is a primitive of sin x / cos^3 x", lambda x: 1 / (2 * cos(x) ** 2), lambda x: sin(x) / cos(x) ** 3, (-0.9, 0.2, 0.7))
check("M4 Q.2(3): int_2^3 dx/(x^2-1) = (1/2) ln(3/2)", integral(lambda x: 1 / (x * x - 1), 2, 3), 0.5 * log(1.5))
for x in (2.3, 2.8):
    check(f"M4 Q.2(3): 1/(x^2-1) = (1/2)(1/(x-1) - 1/(x+1)) at {x}", 1 / (x * x - 1), 0.5 * (1 / (x - 1) - 1 / (x + 1)))
check("M4 Q.2(4): int_1^3 dx/(x^2-2x+5) = pi/8", integral(lambda x: 1 / (x * x - 2 * x + 5), 1, 3), pi / 8)
check("M4 Q.2(4): (x-1)^2 + 4 = x^2 - 2x + 5 at 2.2", (2.2 - 1) ** 2 + 4, 2.2 ** 2 - 2 * 2.2 + 5); check_true("M4 Q.2(4): 4 - 20 < 0", 4 - 20 < 0)
primitive("M4 Q.3(1): 2 sqrt x ln x - 4 sqrt x", lambda x: 2 * sqrt(x) * log(x) - 4 * sqrt(x), lambda x: log(x) / sqrt(x), XN)
check("M4 Q.3(1): int_1^(e^2) ln x / sqrt x = 4", integral(lambda x: log(x) / sqrt(x), 1, math.e ** 2), 4)
check("M4 Q.3(2): int_0^(pi/2) dx/(2 + cos x) = pi/(3 sqrt3)", integral(lambda x: 1 / (2 + cos(x)), 0, pi / 2), pi / (3 * sqrt(3)))
check("M4 Q.3(2): with u = tan(x/2): int_0^1 2/(u^2+3) du", integral(lambda u: 2 / (u * u + 3), 0, 1), pi / (3 * sqrt(3)))
for x in (0.4, 1.2):
    u = tan(x / 2)
    check(f"M4 Q.3(2): 2 + cos x = (3 + u^2)/(1 + u^2) at {x}", 2 + cos(x), (3 + u * u) / (1 + u * u))
check("M4 Q.3(2): pi/(3 sqrt3) = sqrt3 pi/9", pi / (3 * sqrt(3)), sqrt(3) * pi / 9)
check("M4 Q.4(1): volume pi int_0^1 (1 + sqrt x)^2 = 17 pi/6", pi * imp(lambda x: (1 + sqrt(x)) ** 2, 0, 1), 17 * pi / 6, 1e-9)
check_true("M4 Q.4(1): without the middle term the volume is different (3 pi/2)", abs(pi * (1 + 0.5) - 17 * pi / 6) > 1)
yq = lambda x: x * x / 8 - log(x)
for x in (1.2, 1.7):
    check(f"M4 Q.4(2): 1 + y'^2 = (x/4 + 1/x)^2 at {x}", 1 + d1(yq, x) ** 2, (x / 4 + 1 / x) ** 2, 1e-6)
check("M4 Q.4(2): length on [1, 2] = 3/8 + ln 2", integral(lambda x: sqrt(1 + (x / 4 - 1 / x) ** 2), 1, 2), 3 / 8 + log(2))
check("M4 Q.4(3): int_0^pi sin 4x sin x = 0", integral(lambda x: sin(4 * x) * sin(x), 0, pi), 0, 1e-10)
check("M4 Q.4(3): sin 4x sin x = (cos 3x - cos 5x)/2 at 0.9", sin(3.6) * sin(0.9), (cos(2.7) - cos(4.5)) / 2)
r45 = lambda th: exp(2 * th)
check("M4 Q.5(1): x^2 + y^2 = r^2 at 0.6", (r45(0.6) * cos(0.6)) ** 2 + (r45(0.6) * sin(0.6)) ** 2, r45(0.6) ** 2)
check("M4 Q.5(2): length of r = e^(2 theta) on [0, ln 2] = 3 sqrt5/2", polar_len(r45, 0, log(2)), 3 * sqrt(5) / 2)
y45 = lambda t: 4 * t - t ** 3
check_true("M4 Q.5(3): y >= 0 on [0, 2], < 0 after", all(y45(k / 100) >= -1e-12 for k in range(0, 201)) and y45(2.01) < 0)
check("M4 Q.5(3): x = t^2 reaches 4 at t = 2", 2 ** 2, 4)
check("M4 Q.5(4): area int_0^2 (4t - t^3) 2t dt = 128/15", integral(lambda t: y45(t) * 2 * t, 0, 2), 128 / 15)
check("M4 Q.5(4): the same area in x: int_0^4 y dx", imp(lambda x: y45(sqrt(x)), 0, 4), 128 / 15, 1e-9)
check("M4 Q.6(1): (e^(2x) - 1)/sin x -> 2 (x = 1e-7)", (exp(2e-7) - 1) / sin(1e-7), 2, 1e-6)
check("M4 Q.6(2): int_0^4 dx/sqrt(4-x) = 4", imp(lambda x: 1 / sqrt(4 - x), 0, 4), 4, 1e-9)
check("M4 Q.6(2): int_0^w = 4 - 2 sqrt(4-w) (w = 3)", integral(lambda x: 1 / sqrt(4 - x), 0, 3), 4 - 2)
primitive("M4 Q.6(3): (ln x)^2/2 is a primitive of ln x / x", lambda x: log(x) ** 2 / 2, lambda x: log(x) / x, XN)
grows("M4 Q.6(3): (ln w)^2/2", lambda w: log(w) ** 2 / 2, [10.0 ** k for k in (1, 10, 100, 300)], 1e5)
check("M4 Q.6(3): ln x / x -> 0 (x = 1e12)", log(1e12) / 1e12, 0, 1e-9)

# ================= GRAPH (riemann) =================
check("graph: n = 4 right sum, as in P1.1", riemann(sq, 0, 2, 4, 'right'), Fr(15, 4))
check("graph: area 8/3 shown as 2.6667", round(8 / 3, 4), 2.6667)
check_true("graph: the error shrinks as n grows (right ends)",
           all(riemann(sq, 0, 2, n + 1) - Fr(8, 3) < riemann(sq, 0, 2, n) - Fr(8, 3) for n in range(1, 40)))

print("\nFAILED:" if fails else "\nALL INTEGRAL CHECKS PASSED", fails if fails else "")
sys.exit(1 if fails else 0)
