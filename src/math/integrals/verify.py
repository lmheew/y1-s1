"""Numeric checks for the Calculus midterm 2 page (src/math/integrals): every practice answer, every claim in the
Summary, the formula sheet and the Riemann-sum graph. Riemann sums are added up exactly with fractions and compared
with the closed forms on the page; limits and integrals are checked against high-accuracy numeric integration.
Each check prints PASS/FAIL; the script exits non-zero if anything fails.

    python3 src/math/integrals/verify.py"""
import math, sys
from fractions import Fraction as Fr
from math import sin, cos, exp, log, sqrt, pi

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

NS = (1, 2, 3, 4, 5, 7, 10, 25, 100)

# ================= PRACTICE =================
# 1.1  n = 4 estimates of the integral of x^2 on [0, 2]
sq = lambda x: x * x
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
# 1.4  x^2 on [1, 2], right ends
for n in NS:
    check(f"P1.4 S_{n}", riemann(sq, 1, 2, n), 1 + Fr(n + 1, n) + Fr((n + 1) * (2 * n + 1), 6 * n * n))
    check(f"P1.4 expanded square (n={n}, k=2)", (1 + Fr(2, n)) ** 2, 1 + Fr(2 * 2, n) + Fr(4, n * n))
check("P1.4 limit 7/3", integral(sq, 1, 2), 7 / 3)
# 1.5  4 - x^2 on [0, 2], right ends: a lower sum
f = lambda x: 4 - x * x
for n in NS:
    S = riemann(f, 0, 2, n)
    check(f"P1.5 S_{n}", S, 8 - Fr(4 * (n + 1) * (2 * n + 1), 3 * n * n))
    check_true(f"P1.5 S_{n} < 16/3 (lower sum)", S < Fr(16, 3), f"S={float(S):.6f}")
    check_true(f"P1.5 (n+1)(2n+1) > 2n^2 at n={n}", (n + 1) * (2 * n + 1) > 2 * n * n)
check("P1.5 integral 16/3", integral(f, 0, 2), 16 / 3)
check_true("P1.5 f is decreasing on [0, 2]", all(f(x / 100) > f((x + 1) / 100) for x in range(0, 200)))
# 1.6  x^3 on [0, 2], left ends: S_n = 4(1 - 1/n)^2 -> 4
cube = lambda x: x ** 3
for n in NS:
    S = riemann(cube, 0, 2, n, 'left')
    check(f"P1.6 S_{n} = 4(1-1/n)^2", S, 4 * (1 - Fr(1, n)) ** 2)
    check(f"P1.6 sum of (k-1)^3 (n={n})", sum((k - 1) ** 3 for k in range(1, n + 1)), Fr((n - 1) ** 2 * n * n, 4))
    check_true(f"P1.6 S_{n} < 4", S < 4)
check("P1.6 integral 4", integral(cube, 0, 2), 4)
check("P1.6 rectangle 16(k-1)^3/n^4 (n=5, k=3)", cube(Fr(2 * (3 - 1), 5)) * Fr(2, 5), Fr(16 * (3 - 1) ** 3, 5 ** 4))
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
# 1.10  any interval, from the results on [0, L]
P = lambda L, m: Fr(L) ** (m + 1) / (m + 1)          # the integral of x^m from 0 to L
check("P1.10a int_2^4 x = 8 - 2", P(4, 1) - P(2, 1), 6)
check("P1.10a numeric", integral(lambda x: x, 2, 4), 6)
check("P1.10a trapezoid (2+4)/2*2", Fr(2 + 4, 2) * 2, 6)
check("P1.10b int_1^2 x^3 = 4 - 1/4", P(2, 3) - P(1, 3), Fr(15, 4))
check("P1.10b numeric", integral(cube, 1, 2), 3.75)
check("P1.10c 3*(27-1)/3 = 26", 3 * (P(3, 2) - P(1, 2)), 26)
check("P1.10c 2*(9-1)/2 = 8", 2 * (P(3, 1) - P(1, 1)), 8)
check("P1.10c int_1^3 1 = 2", P(3, 0) - P(1, 0), 2)
check("P1.10c int_1^3 (3x^2-2x+1) = 20", integral(lambda x: 3 * x * x - 2 * x + 1, 1, 3), 20)
check("P1.10c via F = x^3 - x^2 + x", (27 - 9 + 3) - (1 - 1 + 1), 20)
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
# 1.12  x^2 - 4 on [0, 3]: the integral -3, the area 23/3
f = lambda x: x * x - 4
check("P1.12 integral 9 - 12 = -3", integral(f, 0, 3), -3)
check("P1.12 int_0^2 = 8/3 - 8 = -16/3", integral(f, 0, 2), -16 / 3)
check("P1.12 int_2^3 = 7/3", integral(f, 2, 3), 7 / 3)
check("P1.12 int_2^3 as int_0^3 - int_0^2", Fr(-3) - Fr(-16, 3), Fr(7, 3))
check("P1.12 area 16/3 + 7/3 = 23/3", integral(lambda x: abs(x * x - 4), 0, 2, 4000) + integral(lambda x: abs(x * x - 4), 2, 3, 4000), 23 / 3)
check_true("P1.12 f < 0 on [0,2), f > 0 on (2,3]", all(f(x / 100) < 0 for x in range(0, 200)) and all(f(2 + x / 100) > 0 for x in range(1, 101)))

# ================= SUMMARY (u1) =================
# partial sums, for many n
for n in range(1, 31):
    ks = range(1, n + 1)
    check(f"sum 1 = n (n={n})", sum(1 for _ in ks), n)
    check(f"sum k (n={n})", sum(ks), Fr(n * (n + 1), 2))
    check(f"sum k^2 (n={n})", sum(k * k for k in ks), Fr(n * (n + 1) * (2 * n + 1), 6))
    check(f"sum k^3 (n={n})", sum(k ** 3 for k in ks), Fr(n * n * (n + 1) ** 2, 4))
    check(f"sum k^3 = [n(n+1)/2]^2 (n={n})", sum(k ** 3 for k in ks), Fr(n * (n + 1), 2) ** 2)
    check(f"left ends: sum (k-1)^2 (n={n})", sum((k - 1) ** 2 for k in ks), Fr((n - 1) * n * (2 * n - 1), 6))
    check(f"left ends: sum (k-1) (n={n})", sum(k - 1 for k in ks), Fr((n - 1) * n, 2))
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
# x^2 from 0 to L, right ends: S_n = (L^3/6)(n+1)(2n+1)/n^2 -> L^3/3; x^3: S_n = (L^4/4)(1+1/n)^2 -> L^4/4
for L in (Fr(1), Fr(2), Fr(3, 2), Fr(5)):
    for n in (1, 2, 5, 12, 40):
        check(f"x^2 on [0,{L}] S_{n}", riemann(sq, 0, L, n), L ** 3 / 6 * Fr((n + 1) * (2 * n + 1), n * n))
        check(f"x^2 on [0,{L}] S_{n} = L^3/n^3 sum k^2", riemann(sq, 0, L, n), L ** 3 / n ** 3 * sum(k * k for k in range(1, n + 1)))
        check(f"x^3 on [0,{L}] S_{n}", riemann(cube, 0, L, n), L ** 4 / 4 * (1 + Fr(1, n)) ** 2)
        check(f"x^3 on [0,{L}] left S_{n}", riemann(cube, 0, L, n, 'left'), L ** 4 / 4 * (1 - Fr(1, n)) ** 2)
        check_true(f"x^2 on [0,{L}]: lower sum < L^3/3 < upper sum (n={n})",
                   riemann(sq, 0, L, n, 'left') < L ** 3 / 3 < riemann(sq, 0, L, n, 'right'))
    check(f"x^2 on [0,{L}] area L^3/3", integral(sq, 0, float(L)), float(L) ** 3 / 3)
    check(f"x^3 on [0,{L}] area L^4/4", integral(cube, 0, float(L)), float(L) ** 4 / 4)
    check(f"one third of the L x L^2 box (L={L})", (L ** 3 / 3) / (L * L ** 2), Fr(1, 3))
check("(n+1)(2n+1)/n^2 -> 2", (10**7 + 1) * (2 * 10**7 + 1) / 10**14, 2, 1e-6)
check("(n+1)/n -> 1", (10**7 + 1) / 10**7, 1, 1e-6)
# the pattern: integral of x^m from 0 to L is L^(m+1)/(m+1)
for m in (0, 1, 2, 3, 4, 5):
    for L in (0.7, 1.0, 2.0, 3.0):
        check(f"x^{m} on [0,{L}]", integral(lambda x: x ** m, 0, L), L ** (m + 1) / (m + 1))
# signed area: the integral of x - 1 on [0, 2] is 0, the region's area 1
check("integral of x-1 on [0,2] is 0", integral(lambda x: x - 1, 0, 2), 0, 1e-9)
check("its area is 1", integral(lambda x: abs(x - 1), 0, 1) + integral(lambda x: abs(x - 1), 1, 2), 1)
check("right sums of x-1 on [0,2] tend to 0", float(riemann(lambda x: x - 1, 0, 2, 10**4)), 0, 1e-3)
# with an antiderivative: F(x) = x^3/3 gives L^3/3; the habits' 16/3
check("F = x^3/3: F(2) - F(0)", Fr(2) ** 3 / 3, Fr(8, 3))
check("16/3 is about 5.33", 16 / 3, 5.3333333, 1e-6)
# (3 Nov) the class example x^2 + x - 2 is checked under P1.9; the quick way for x^m on [0, L]
for m in (1, 2, 3, 4):
    for L in (Fr(1), Fr(3, 2), Fr(2)):
        for n in (3, 8):
            check(f"quick way: S_n = (L/n)^(m+1) sum k^m (m={m}, L={L}, n={n})",
                  riemann(lambda x: x ** m, 0, L, n), (L / n) ** (m + 1) * sum(k ** m for k in range(1, n + 1)))
    N = 10 ** 5
    check(f"leading term: sum k^{m} is about n^{m + 1}/{m + 1}", sum(k ** m for k in range(1, N + 1)) / (N ** (m + 1) / (m + 1)), 1, 1e-4)
# any interval: int_a^b = int_0^b - int_0^a, and (b^(m+1) - a^(m+1))/(m+1), also for a > b and negative ends
for (a0, b0) in ((1, 3), (-1, 2), (2, -1), (-2, -0.5), (0.5, 0.5)):
    for m in (0, 1, 2, 3, 4):
        check(f"powers on [{a0},{b0}], m={m}", integral(lambda x: x ** m, a0, b0), (b0 ** (m + 1) - a0 ** (m + 1)) / (m + 1))
    check(f"any interval: int_a^b cos = int_0^b - int_0^a ({a0},{b0})", integral(cos, a0, b0), integral(cos, 0, b0) - integral(cos, 0, a0))
check("example: int_1^2 x^2 = (8-1)/3", integral(sq, 1, 2), 7 / 3)
# properties, for any order of a, b, c
f1, g1 = (lambda x: exp(x) - x * x), (lambda x: sin(3 * x) + 2)
for (a0, b0, c0) in ((0, 1, 2.5), (0, 2.5, 1), (1.5, -0.5, 0.7)):
    check(f"joining intervals ({a0},{b0},{c0})", integral(f1, a0, b0) + integral(f1, b0, c0), integral(f1, a0, c0))
    check(f"swapping the limits ({a0},{b0})", integral(f1, b0, a0), -integral(f1, a0, b0))
    check(f"sums and constants ({a0},{b0})", integral(lambda x: 2.5 * f1(x) - 4 * g1(x), a0, b0), 2.5 * integral(f1, a0, b0) - 4 * integral(g1, a0, b0))
    check(f"a constant function: int 7 dx = 7(b-a) ({a0},{b0})", integral(lambda x: 7.0, a0, b0), 7 * (b0 - a0))
check("zero width", integral(f1, 1.3, 1.3), 0)
check_true("comparison: x^2 <= x on [0,1], so int x^2 <= int x", integral(sq, 0, 1) <= integral(lambda x: x, 0, 1))
check("the variable's name doesn't matter: int_0^2 t^2 dt", integral(lambda t: t * t, 0, 2), integral(sq, 0, 2))
# definite integral and antiderivative: the area from 0 to L has derivative f(L)
for L in (0.5, 1.2, 2.0):
    A = lambda L: integral(sq, 0, L)
    check(f"area function A(L) = L^3/3 at {L}", A(L), L ** 3 / 3)
    check(f"A'(L) = f(L) = L^2 at {L}", (A(L + 1e-4) - A(L - 1e-4)) / 2e-4, L * L, 1e-6)
# no formula for F: sin x / x (value 1 at 0) still has an integral, about 0.946
sinc = lambda x: 1.0 if x == 0 else sin(x) / x
v = integral(sinc, 0, 1)
check("int_0^1 sin x / x rounds to 0.946", round(v, 3), 0.946)
check("by its Taylor series, term by term", sum((-1) ** j / ((2 * j + 1) * math.factorial(2 * j + 1)) for j in range(8)), v)
check("first terms 1 - 1/18 + 1/600 - 1/35280", 1 - 1 / 18 + 1 / 600 - 1 / 35280, v, 1e-6)
check("a Riemann sum gets there too (midpoints, n = 4)", float(riemann(lambda x: sinc(float(x)), 0, 1, 4, 'mid')), v, 1e-3)
check_true("sin x / x tends to 1 at 0", abs(sin(1e-6) / 1e-6 - 1) < 1e-9)
check("e^(-x^2) has an integral too: right sums tend to 0.74682", float(riemann(lambda x: exp(-float(x) ** 2), 0, 1, 20000)), 0.746824, 1e-4)
# watch-outs of 3 Nov
check("watch: the -2 gives -4 in S_n: (4/n) * n", Fr(4, 7) * 7, 4)
check("watch: int_1^2 x^2 = 8/3 - 1/3", integral(sq, 1, 2), 8 / 3 - 1 / 3)
check("watch: int_2^0 x = -2", integral(lambda x: x, 2, 0), -2)

# ================= FORMULAS =================
# Riemann sum and definite integral, for a function that is not a polynomial
for n in (200, 2000):
    check(f"definite integral: right sums of cos on [0, 1.3] (n={n})", float(riemann(lambda x: cos(float(x)), 0, Fr(13, 10), n)), sin(1.3), 1 / n * 2)
check_true("increasing f: left sum < integral < right sum (e^x on [0, 2], n = 8)",
           float(riemann(lambda x: exp(float(x)), 0, 2, 8, 'left')) < exp(2) - 1 < float(riemann(lambda x: exp(float(x)), 0, 2, 8, 'right')))
check("signed area: A_above - A_below for sin on [0, 3pi/2]",
      integral(sin, 0, 3 * pi / 2), integral(sin, 0, pi) - (-integral(sin, pi, 3 * pi / 2)))
for (fn, F, a0, b0, name) in ((cos, sin, 0.2, 1.4, 'cos/sin'), (lambda x: 1 / x, log, 1.0, 3.5, '1/x / ln'),
                              (lambda x: 3 * x * x + 1, lambda x: x ** 3 + x, -1.0, 2.0, 'polynomial')):
    check(f"with an antiderivative: {name}", integral(fn, a0, b0), F(b0) - F(a0))

# ================= GRAPH (riemann) =================
check("graph: n = 4 right sum, as in P1.1", riemann(sq, 0, 2, 4, 'right'), Fr(15, 4))
check("graph: area 8/3 shown as 2.6667", round(8 / 3, 4), 2.6667)
check_true("graph: the error shrinks as n grows (right ends)",
           all(riemann(sq, 0, 2, n + 1) - Fr(8, 3) < riemann(sq, 0, 2, n) - Fr(8, 3) for n in range(1, 40)))

print("\nFAILED:" if fails else "\nALL INTEGRAL CHECKS PASSED", fails if fails else "")
sys.exit(1 if fails else 0)
