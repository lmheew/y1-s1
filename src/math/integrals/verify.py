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

# ================= GRAPH (riemann) =================
check("graph: n = 4 right sum, as in P1.1", riemann(sq, 0, 2, 4, 'right'), Fr(15, 4))
check("graph: area 8/3 shown as 2.6667", round(8 / 3, 4), 2.6667)
check_true("graph: the error shrinks as n grows (right ends)",
           all(riemann(sq, 0, 2, n + 1) - Fr(8, 3) < riemann(sq, 0, 2, n) - Fr(8, 3) for n in range(1, 40)))

print("\nFAILED:" if fails else "\nALL INTEGRAL CHECKS PASSED", fails if fails else "")
sys.exit(1 if fails else 0)
