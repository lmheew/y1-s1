"""Numeric checks of every Practice problem (practice.mjs): Chapters 1–8, three tiers each.

Each answer is recomputed from the physics with the problem's numbers: motion integrated step by step (RK4), forces
summed as vectors or solved by bisection, work integrated, and compared with the answer on the page.
Run: python3 src/physics/verify_practice.py   (exits non-zero if anything fails)"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from verify_lib import *  # noqa: F401,F403

S2, S3 = sqrt(2), sqrt(3)
s37, c37 = 0.60, 0.80  # the 3-4-5 values the problems give for 37°


def sigfigs(s):
    return len(s.replace('-', '').replace('.', '').lstrip('0'))


def round_dp(x, n):
    return round(x + 1e-12, n)


def two(a11, a12, b1, a21, a22, b2):
    det = a11 * a22 - a12 * a21
    return (b1 * a22 - a12 * b2) / det, (a11 * b2 - b1 * a21) / det


# ---------------------------------------------------------------------------------------------------------------------
print('== Chapter 1 ==')
check_true('1.1 (b) base units among the list', [u for u in ('newton', 'kilogram', 'joule', 'second', 'watt', 'metre')
                                                  if u in ('kilogram', 'second', 'metre')] == ['kilogram', 'second', 'metre'])
check_vec('1.1 (c) N = kg m/s^2 (dims kg, m, s from F = ma)', (1, 1, -2), (1, 1, -2), 0)
check('1.2 (a)', 3.5 * 1e3, 3.5e3)
check('1.2 (b) x 1e4', 250 * 1e-3 * 1e-3 * 1e4, 2.5)
check('1.2 (c) x 1e5', 72 * 1e-6 * 1e5, 7.2)
check('1.2 (d) x 1e10', 0.45 * 1e-9 * 1e10, 4.5)
for s, n in (('0.00340', 3), ('2.050', 4), ('6.02', 3), ('1.0080', 5)):
    check(f'1.3 {s} has {n} significant figures', sigfigs(s), n, 0)
check('1.4 (a) 12.47 + 0.0381 to 2 dp', round_dp(12.47 + 0.0381, 2), 12.51)
check('1.4 (b) 5.2 x 0.0413 to 2 sf', sig(5.2 * 0.0413, 2), 0.21)
check('1.4 (c) 8.10 / 2.7 to 2 sf', sig(8.10 / 2.7, 2), 3.0)
check('1.4 (d) 100.0 - 0.256 to 1 dp', round_dp(100.0 - 0.256, 1), 99.7)
check('1.5 (a)', 90 * 1000 / 3600, 25)
check('1.5 (b)', 5.0 * 3600 / 1000, 18)
check('1.5 (c) to 2 sf', sig(1.2e-3 * 3600, 2), 4.3)
check('1.6 (a) x 1e-4', 2.5 / (1e-2) ** 2 * 1e-4, 2.5)
check('1.6 (b) x 1e3', 1.2 * 1e3 * (1e-2) ** 3 * 1e3, 1.2)
check('1.6 (c)', 7.9 * 1e-3 / (1e-2) ** 3, 7.9e3)
check('1.6 (d)', 0.80 * 1200 / 1000, 0.96)
check('1.7 (a) to 3 sf', sig(365 * 24 * 3600, 3), 3.15e7)
check('1.7 (b) to 3 sf', sig(3.00e8 * 365 * 24 * 3600, 3), 9.46e15)
check('1.7 (c)', 1.50e11 / 3.00e8, 500)
check('1.8 (a) cm^3', 2.0 * 5.0 * 10.0, 100)
check('1.8 (b) kg to 2 sf', sig(19.3 * 100 / 1000, 2), 1.9)
check('1.8 (c)', 19.3 * 1e3, 1.93e4)
# 1.9: exponents from units: kg: a + b = 0, m: a - b = 1, s: -2a = -1
a, b = two(1, 1, 0, 1, -1, 1)
check('1.9 (b) a', a, 0.5)
check('1.9 (b) b', b, -0.5)
check('1.9 (b) seconds check', -2 * a, -1)
check('1.9 (c) factor', 4 ** a, 2)
check('1.10 (a) perimeter', 2 * round_dp(12.5 + 3.20, 1), 31.4)
check('1.10 (b) area to 3 sf', sig(12.5 * 3.20, 3), 40.0)
check('1.10 (c) x 1e3', 40.0e-4 * 1e3, 4.00)
check('1.10 (d) ratio to 3 sf', sig(12.5 / 3.20, 3), 3.91)
m_w = 18 * 1.66e-27
check('1.11 (a) x 1e26 to 2 sf', sig(m_w * 1e26, 2), 3.0)
check('1.11 (b) x 1e-25 to 2 sf', sig(1.0 / m_w * 1e-25, 2), 3.3)
check('1.11 (c) moles to 2 sf', sig(1.0 / m_w / 6.02e23, 2), 56)

# ---------------------------------------------------------------------------------------------------------------------
print('\n== Chapter 2 ==')
legs = [(120, 20), (-40, 10)]
check('2.1 (a)', sum(d for d, _ in legs), 80)
check('2.1 (b)', sum(abs(d) for d, _ in legs), 160)
check('2.1 (c)', 80 / 30, 8 / 3)
check('2.1 (d)', 160 / 30, 16 / 3)
x22 = lambda t: 3 * t * t - 2 * t + 1
check('2.2 (a) v at t = 0.7', d1(x22, 0.7), 6 * 0.7 - 2)
check('2.2 (b)', d1(x22, 2), 10)
check('2.2 (c)', d2(x22, 1.3), 6, 1e-5)
tr = solve(lambda t: d1(x22, t), 0, 1)
check('2.2 (d) time', tr, 1 / 3)
check('2.2 (d) place', x22(tr), 2 / 3)
_, r, v = state_at(lambda t, r, v: (2.0,), (0,), (4.0,), 5.0)
check('2.3 (a)', v[0], 14)
check('2.3 (b)', r[0], 45)
check('2.3 (c)', r[0] / 5.0, 9.0)
fall = lambda t, r, v: (-G,)
_, r, v = state_at(fall, (0,), (0,), 3.0)
check('2.4 (a)', abs(v[0]), 29.4)
check('2.4 (b)', -r[0], 44.1)
_, r2, _ = state_at(fall, (0,), (0,), 2.0)
check('2.4 (c)', r2[0] - r[0], 24.5)
check('2.5 (a)', (5.0 - 20) / 3.0, -5.0)
check_true('2.5 (b) v > 0 and a < 0: slowing down', 20 > 0 and -5.0 < 0)
check('2.5 (c)', solve(lambda t: 20 - 5.0 * t, 0, 10), 4.0)
check('2.6 (a)', 24 * 0.75, 18)
t, r, v = run(lambda t, r, v: (-6.0,), (0,), (24.0,), lambda t, r, v: v[0])
check('2.6 (b) braking distance', r[0], 48)
check('2.6 (c) total distance', 18 + r[0], 66)
check('2.6 (c) total time', 0.75 + t, 4.75)
t, r, v = run(fall, (14.7,), (9.8,), lambda t, r, v: v[0])
check('2.7 (a) time to top', t, 1.0)
check('2.7 (a) top above ground', r[0], 19.6)
t, r, v = run(fall, (14.7,), (9.8,), lambda t, r, v: r[0])
check('2.7 (b)', t, 3.0)
check('2.7 (c)', v[0], -19.6)
x28 = lambda t: 4 * sin(pi * t / 2)
check('2.8 (a) v at 0.4', d1(x28, 0.4), 2 * pi * cos(pi * 0.4 / 2))
check('2.8 (a) a at 0.4', d2(x28, 0.4), -pi ** 2 * sin(pi * 0.4 / 2), 1e-5)
tr = solve(lambda t: d1(x28, t), 0.5, 1.5)
check('2.8 (b) time', tr, 1)
check('2.8 (b) place', x28(tr), 4)
check('2.8 (c) v', d1(x28, 2 / 3), pi)
check('2.8 (c) a', d2(x28, 2 / 3), -S3 / 2 * pi ** 2, 1e-5)
for T in (0.3, 1.7):
    check(f'2.8 (d) a = -(pi^2/4) x at t = {T}', d2(x28, T), -pi ** 2 / 4 * x28(T), 1e-5)
# 2.9: the v-t graph of Figure P2-9
v29 = lambda t: 2 * t if t < 4 else 8 if t < 10 else 8 - 2 * (t - 10)
check('2.9 (b) area', integrate(v29, 0, 14, 28000), 80, 1e-6)
check('2.9 (c)', 80 / 14, 40 / 7)
check('2.9 (d) half distance at', solve(lambda T: integrate(v29, 0, T, 4000) - 40, 4, 10), 7.0, 1e-6)
gap = lambda t: 12 * t - t * t
tc = solve(gap, 1, 20)
check('2.10 (a)', tc, 12)
check('2.10 (b)', 12 * tc, 144)
check('2.10 (c)', 2.0 * tc, 24)
tm = solve(lambda t: d1(gap, t), 0.1, 11)
check('2.10 (d) when', tm, 6)
check('2.10 (d) gap', gap(tm), 36)
_, r, v = state_at(lambda t, r, v: (6 * t,), (0,), (0,), 2.0)
check('2.11 (a) v(2) = 3t^2', v[0], 12)
check('2.11 (b) x(2) = t^3', r[0], 8)
check('2.11 (d) the wrong formula gives', 12 ** 2 / (2 * 12), 6)
# 2.12: the v-t graph of Figure P2-12
v212 = lambda t: -4 + 2 * t if t < 4 else 4 if t < 6 else 4 - 2 * (t - 6)
check_vec('2.12 (a) slopes', (d1(v212, 1.0), d1(v212, 5.0), d1(v212, 7.0)), (2, 0, -2))
check('2.12 (b) turns around', solve(v212, 0, 3), 2.0)
check('2.12 (c) displacement', integrate(v212, 0, 8, 16000), 12, 1e-6)
check('2.12 (c) distance', integrate(lambda t: abs(v212(t)), 0, 8, 16000), 20, 1e-6)
check('2.12 (d)', 2.0 + 12, 14)
_, r1, v1 = state_at(lambda t, r, v: (4.9,), (0,), (0,), 4.0)
check('2.13 (a) height', r1[0], 39.2)
check('2.13 (a) speed', v1[0], 19.6)
t, r, v = run(fall, r1, v1, lambda t, r, v: v[0])
check('2.13 (b) greatest height', r[0], 58.8)
t2, r, v = run(fall, r1, v1, lambda t, r, v: r[0], dt=1e-4)
check('2.13 (c) total time', 4.0 + t2, 6 + 2 * S3)
check('2.13 (d) speed at the ground', abs(v[0]), 19.6 * S3)

# ---------------------------------------------------------------------------------------------------------------------
print('\n== Chapter 3 ==')
a = polar(20, 30)
check_vec('3.1 (a)', a, (10 * S3, 10))
b = (-5.0, 12.0)
check('3.1 (b) size', norm(b), 13)
check('3.1 (b) angle', degrees(atan2(b[1], b[0])), 180 - degrees(atan(12 / 5)))
check('3.1 (b) about 113', round(degrees(atan2(b[1], b[0]))), 113, 0)
check_vec('3.1 (c) with the 3-4-5 values', (-10 * c37, -10 * s37), (-8.0, -6.0))
check('3.1 (c) direction 217 deg (37 below -x)', degrees(atan2(-6, -8)) % 360, (180 + degrees(atan(3 / 4))))
a, b = (3, -2, 1), (-1, 4, 2)
check_vec('3.2 (a)', add(a, b), (2, 2, 3))
check_vec('3.2 (b)', sub(mul(2, a), b), (7, -8, 0))
check('3.2 (c)', norm(add(a, b)), sqrt(17))
check_vec('3.2 (d)', add(a, b, (-2, -2, -3)), (0, 0, 0))
a, b = (2, 3, -1), (1, -1, 4)
check('3.3 (a)', dot(a, b), -5)
check('3.3 (b) |a|', norm(a), sqrt(14))
check('3.3 (b) |b|', norm(b), 3 * S2)
check('3.3 (c)', dot(a, b) / (norm(a) * norm(b)), -5 / (6 * sqrt(7)))
I, J, K = (1, 0, 0), (0, 1, 0), (0, 0, 1)
check_vec('3.4 (a) i x j', cross(I, J), K)
check_vec('3.4 (a) j x i', cross(J, I), (0, 0, -1))
check_vec('3.4 (a) k x k', cross(K, K), (0, 0, 0))
check_vec('3.4 (b)', cross(mul(2, I), mul(3, J)), (0, 0, 6))
check_vec('3.4 (c)', cross(add(I, J), sub(I, J)), (0, 0, -2))
check('3.4 (d)', degrees(acos(dot(add(I, J), sub(I, J)) / 2)), 90)
r = (6, -2, 3)
check('3.5 (b) |r|', norm(r), 7)
check_vec('3.5 (c)', mul(14 / norm(r), r), (12, -4, 6))
a, b = (2, 2, 1), (4, 0, 3)
check('3.6 (a)', dot(a, b), 11)
check('3.6 (a) cos', dot(a, b) / (norm(a) * norm(b)), 11 / 15)
check('3.6 (b)', dot(a, b) / norm(b), 2.2)
check_vec('3.6 (c)', cross(a, b), (6, -2, -8))
check('3.6 (d) triangle', norm(cross(a, b)) / 2, sqrt(26))
legs = [(10 * c37, 10 * s37), (0, -5.0), (-6.0, 0)]
check_vec('3.7 (a) first leg', legs[0], (8.0, 6.0))
tot = add(*legs)
check_vec('3.7 (b)', tot, (2.0, 1.0))
check('3.7 (c)', norm(tot), sqrt(5))
check('3.7 (c) about 27 deg', round(degrees(atan2(tot[1], tot[0]))), 27, 0)
s, d = (5, 1), (1, -3)
a, b = mul(0.5, add(s, d)), mul(0.5, sub(s, d))
check_vec('3.8 (a) a', a, (3, -1))
check_vec('3.8 (a) b', b, (2, 2))
check('3.8 (b)', dot(a, b), 4)
check_vec('3.8 (c)', cross(a, b), (0, 0, 8))
check('3.8 (d)', dot(a, b) / (norm(a) * norm(b)), 1 / sqrt(5))
check('3.8 (d) about 63 deg', round(degrees(acos(1 / sqrt(5)))), 63, 0)
v, B = (3, 2, -1), (1, -1, 2)
check('3.9 (a)', dot(v, B), -1)
vxB = cross(v, B)
check_vec('3.9 (b)', vxB, (3, -7, -5))
check('3.9 (d)', norm(vxB), sqrt(83))
check('3.9 (e) F.v', dot(vxB, v), 0)
check('3.9 (e) F.B', dot(vxB, B), 0)
P, Q, Rp = (1, 0, 2), (3, 1, 2), (1, 2, 4)
PQ, PR = sub(Q, P), sub(Rp, P)
check_vec('3.10 (a) PQ', PQ, (2, 1, 0))
check_vec('3.10 (a) PR', PR, (0, 2, 2))
n = cross(PQ, PR)
check_vec('3.10 (b)', n, (2, -4, 4))
check('3.10 (c) area', norm(n) / 2, 3)
check_vec('3.10 (d) unit normal', mul(1 / norm(n), n), mul(1 / 3, (1, -2, 2)))
check('3.10 (e)', dot(PQ, PR) / (norm(PQ) * norm(PR)), 1 / sqrt(10))
A = 2.0
for phi in (0.4, 1.9):
    a, b = polar(A, 10), polar(A, 10 + degrees(phi))
    check(f'3.11 (a) at phi = {phi}', dot(add(a, b), add(a, b)), 2 * A * A * (1 + cos(phi)))
check('3.11 (b)', degrees(solve(lambda p: norm(add(polar(A, 0), polar(A, degrees(p)))) - A, 0.1, 3.1)), 120)
check('3.11 (c)', degrees(solve(lambda p: norm(sub(polar(A, 0), polar(A, degrees(p)))) - A, 0.1, 3.1)), 60)
check('3.11 (d)', degrees(solve(lambda p: norm(add(polar(A, 0), polar(A, degrees(p)))) - norm(sub(polar(A, 0), polar(A, degrees(p)))), 0.1, 3.1)), 90)
D = (1, 1, 1)
check('3.12 (a)', dot(D, I) / norm(D), 1 / S3)
check('3.12 (b)', dot(D, sub((0, 1, 1), (1, 0, 0))) / 3, 1 / 3)
check('3.12 (c)', dot(D, (1, 1, 0)) / (norm(D) * S2), sqrt(6) / 3)

# ---------------------------------------------------------------------------------------------------------------------
print('\n== Chapter 4 ==')
r1, r2 = (-2, 5), (4, -3)
dr = sub(r2, r1)
check_vec('4.1 (a)', dr, (6, -8))
check('4.1 (b)', norm(dr), 10)
check_vec('4.1 (c)', mul(1 / 2.0, dr), (3, -4))
check('4.1 (c) size', norm(dr) / 2.0, 5.0)
rx, ry = (lambda t: 2 * t * t), (lambda t: 5 * t - t * t)
check_vec('4.2 (a) v at 0.6', (d1(rx, 0.6), d1(ry, 0.6)), (4 * 0.6, 5 - 1.2))
check_vec('4.2 (b) a', (d2(rx, 1.1), d2(ry, 1.1)), (4, -2), 1e-5)
check_vec('4.2 (c)', (d1(rx, 2), d1(ry, 2)), (8, 1))
check('4.2 (c) speed', norm((d1(rx, 2), d1(ry, 2))), sqrt(65))
check('4.2 (d)', solve(lambda t: d1(ry, t), 0, 5), 2.5)
t, r, v = run(gravity, (0.0, 19.6), (14.7, 0.0), lambda t, r, v: r[1])
check('4.3 (a)', t, 2.0)
check('4.3 (b)', r[0], 29.4)
check('4.3 (c) speed', norm(v), 24.5)
check('4.3 (c) angle', degrees(atan2(-v[1], v[0])), degrees(atan(4 / 3)))
check('4.3 (c) about 53', round(degrees(atan2(-v[1], v[0]))), 53, 0)
rw, f = 0.40, 2.0
T = 1 / f
check('4.4 (a)', T, 0.50)
vv = 2 * pi * rw / T
check('4.4 (b)', vv, 1.6 * pi)
pos = lambda t: (rw * cos(2 * pi * f * t), rw * sin(2 * pi * f * t))
acc = (d2(lambda t: pos(t)[0], 0.13, 1e-5), d2(lambda t: pos(t)[1], 0.13, 1e-5))
check('4.4 (c) from the motion', norm(acc), 6.4 * pi ** 2, 1e-4)
check('4.4 (c) about 63', round(6.4 * pi ** 2), 63, 0)
check('4.5 (a)', 72 / 3.6, 20)
check('4.5 (a) B', 54 / 3.6, 15)
check('4.5 (b)', -15 - 20, -35)
check('4.5 (c)', 140 / 35, 4.0)
L46 = (24.5 * 0.60, 24.5 * 0.80)
check_vec('4.6 (a)', L46, (14.7, 19.6))
t, r, v = run(gravity, (0.0, 0.0), L46, lambda t, r, v: r[1] if t > 0.01 else 1)
check('4.6 (b) time', t, 4.0)
check('4.6 (b) range', r[0], 58.8)
t, r, v = run(gravity, (0.0, 0.0), L46, lambda t, r, v: v[1])
check('4.6 (c)', r[1], 19.6)
_, r, v = state_at(gravity, (0.0, 0.0), L46, 3.0)
check_vec('4.6 (d)', v, (14.7, -9.8))
check('4.6 (d) speed', norm(v), 4.9 * sqrt(13))
rel = sub((0, -8.0), (6.0, 0))
check_vec('4.7 (a)', rel, (-6.0, -8.0))
check('4.7 (b) speed', norm(rel), 10)
check('4.7 (b) angle from vertical', round(degrees(atan(6 / 8))), 37, 0)
RC, VC = 2.0, 4.0
th = pi / 4
circ = lambda t: (RC * cos(th + VC * t / RC), RC * sin(th + VC * t / RC))
check_vec('4.8 (a) the point', circ(0), (S2, S2))
check_vec('4.8 (b)', (d1(lambda t: circ(t)[0], 0), d1(lambda t: circ(t)[1], 0)), (-2 * S2, 2 * S2), 1e-8)
acc = (d2(lambda t: circ(t)[0], 0), d2(lambda t: circ(t)[1], 0))
check_vec('4.8 (c)', acc, (-4 * S2, -4 * S2), 1e-5)
check('4.8 (c) size', norm(acc), 8.0, 1e-5)
t, _, _ = run(lambda t, r, v: mul(-dot(v, v) / dot(r, r), r), (RC, 0.0), (0.0, VC), lambda t, r, v: r[1] if t > 0.1 else 1)
check('4.8 (d) one lap (RK4)', 2 * t, pi)
acc49 = lambda t, r, v: (2 * t, 6.0)
_, r, v = state_at(acc49, (0.0, 0.0), (1.0, -3.0), 0.5)
check_vec('4.9 (a) at 0.5', v, (1 + 0.25, 0.0))
check_vec('4.9 (c) where', r, (13 / 24, -0.75))
_, r, v = state_at(acc49, (0.0, 0.0), (1.0, -3.0), 1.3)
check_vec('4.9 (a) at 1.3', v, (1 + 1.69, 6 * 1.3 - 3))
check_vec('4.9 (b) at 1.3', r, (1.3 + 1.3 ** 3 / 3, 3 * 1.69 - 3 * 1.3))


def flight(v0, deg, y0=0.0):
    z = polar(v0, deg)
    return run(gravity, (0.0, y0), z, lambda t, r, v: r[1] if t > 0.01 else 1)


check('4.10 (a) sin 2 theta', 9.8 * 10 * S3 / 14 ** 2, S3 / 2)
for deg, T, H in ((30, 10 / 7, 2.5), (60, 10 * S3 / 7, 7.5)):
    t, r, v = flight(14, deg)
    check(f'4.10 at {deg}: lands on the target', r[0], 10 * S3)
    check(f'4.10 (b) at {deg}', t, T)
    t, r, v = run(gravity, (0.0, 0.0), polar(14, deg), lambda t, r, v: v[1])
    check(f'4.10 (c) at {deg}', r[1], H)
# 4.11: the staircase, y measured down: find the first step whose top the ball reaches inside the step
ball = lambda x: 9.8 * x * x / (2 * 1.4 ** 2)
check('4.11 (a) y = 2.5 x^2 at x = 0.37', ball(0.37), 2.5 * 0.37 ** 2)
land = None
for n in range(1, 10):
    xs = sqrt(0.25 * n / 2.5)  # where the ball reaches the depth of step n
    if 0.20 * (n - 1) < xs <= 0.20 * n:
        land = (n, xs)
        break
check('4.11 (b) the step', land[0], 3, 0)
check('4.11 (c) where', land[1], sqrt(0.3))
t, r, v = run(gravity, (0.0, 0.0), (1.4, 0.0), lambda t, r, v: r[1] + 0.75)
check('4.11 (c) when (RK4)', t, sqrt(1.5 / 9.8))
check('4.11 (c) where (RK4)', r[0], sqrt(0.3))
check('4.12 (a) sin', 30 / 50, 3 / 5)
for v0 in (25.0, 31.0):
    aim = mul(v0 / 50, (40.0, 30.0))
    t, r, v = run(gravity, (0.0, 0.0), aim, lambda t, r, v: r[0] - 40)
    check(f'4.12 (b) reaches x = 40 at 50/v0 for v0 = {v0}', t, 50 / v0)
    check(f'4.12 (b) the target is there too for v0 = {v0}', r[1], 30 - 4.9 * t * t)
check('4.12 (c) height', 30 - 4.9 * 4, 10.4)
check('4.12 (d) smallest v0', solve(lambda v0: 50 / v0 - sqrt(60 / 9.8), 5, 100), 35 / S3)
v0 = 10.0
L = polar(v0, 45)
t, r, v = run(lambda t, r, v: (-G / 4, -G), (0.0, 0.0), L, lambda t, r, v: r[1] if t > 0.01 else 1)
check('4.13 (b)', t, S2 * v0 / G)
check('4.13 (c)', r[0], 3 * v0 ** 2 / (4 * G))
check('4.13 (c) three quarters', r[0] / (v0 ** 2 / G), 0.75)
check('4.13 (d)', v[0], S2 / 4 * v0)
alpha = asin(120 / 200)
check('4.14 (a) about 37 deg', round(degrees(alpha)), 37, 0)
check('4.14 (a) east parts cancel', -200 * sin(alpha) + 120, 0)
check('4.14 (b)', 200 * cos(alpha), 160)
check('4.14 (c)', 400 / 160, 2.5)
check('4.14 (d)', norm((120, 200)), 40 * sqrt(34))

# ---------------------------------------------------------------------------------------------------------------------
print('\n== Chapter 5 ==')
F = add((3, 4), (-1, 2))
check_vec('5.1 (a)', F, (2, 6))
check_vec('5.1 (b)', mul(1 / 2.0, F), (1, 3))
check('5.1 (b) size', norm(F) / 2.0, sqrt(10))
_, _, v = state_at(lambda t, r, v: mul(1 / 2.0, add(F, (-2, -6))), (0, 0), (1.0, 0.5), 3.0)
check_vec('5.1 (c) constant velocity', v, (1.0, 0.5))
check('5.2 (a)', 60 * 9.8, 588)
check('5.2 (b)', 60 * 1.6, 96)
check('5.2 (c)', 60 * 2.0, 120)


def follow(m, a_floor, T=2.0):
    """the upward force that makes a body (forces F up, mg down) follow a support accelerating at a_floor (bisection)"""
    gap = lambda N: state_at(lambda t, r, v: ((N - m * G) / m,), (0.0,), (0.0,), T)[1][0] - 0.5 * a_floor * T * T
    return solve(gap, -10 * m * G, 10 * m * G, 60)


check('5.3 (a)', follow(1200, 0), 11760, 1e-6)
check('5.3 (b)', follow(1200, 1.2), 13200, 1e-6)
check('5.3 (c)', follow(1200, -1.2), 10320, 1e-6)
check('5.3 (d) no cable: a = -g', (0 - 1200 * G) / 1200, -G)
check('5.4 (a)', follow(1.5, 0), 14.7, 1e-6)
th = radians(30)
N, acc = None, None
n_hat, up = (-sin(th), cos(th)), (cos(th), sin(th))
accel = lambda N, m=2.0: mul(1 / m, add((0.0, -m * G), mul(N, n_hat)))
N = solve(lambda N: dot(accel(N), n_hat), 0, 100)
check('5.5 (a)', norm(accel(N)), 4.9)
check('5.5 (b)', N, 9.8 * S3)
t, r, v = run(lambda t, r, v: (4.9,), (0,), (0,), lambda t, r, v: r[0] - 9.8)
check('5.5 (c)', t, 2.0)
check('5.5 (d)', v[0], 9.8)
check('5.6 (a)', 12 / 6.0, 2.0)
check('5.6 (b)', (2.0 + 1.0) * 2.0, 6.0)
check('5.6 (c)', 1.0 * 2.0, 2.0)
check('5.6 (d) first string', (2.0 + 3.0) * 2.0, 10)
check('5.6 (d) second string', 3.0 * 2.0, 6.0)
pull = (50 * c37, 50 * s37)
check('5.7 (a)', pull[0] / 10, 4.0)
check('5.7 (b)', solve(lambda N: N + pull[1] - 98, -50, 200), 68)
check('5.7 (c)', solve(lambda F: 98 - F * s37, 0, 500), 490 / 3)
for deg, s, want in ((37, s37, 9.8), (30, 0.5, 11.76)):
    T = solve(lambda T: 2 * T * s - 1.2 * G, 0, 100)
    check(f'5.8 tension at {deg} deg', T, want)
check_true('5.8 (c) tension grows as the angle shrinks', 1.2 * G / (2 * sin(radians(1))) > 300)
x59 = lambda t: 4 * t ** 3 - 3 * t * t + 2
for T in (0.4, 2.0):
    check(f'5.9 (a) F at {T}', 2.0 * d2(x59, T), 48 * T - 12, 1e-5)
check('5.9 (b)', solve(lambda t: 48 * t - 12, 0, 1), 0.25)
check('5.9 (c)', 2.0 * d2(x59, 2.0), 84, 1e-5)
check('5.9 (d)', 2.0 * (d1(x59, 2.0) - d1(x59, 0.0)) / 2.0, 36)
check('5.9 (d) mean of F', integrate(lambda t: 48 * t - 12, 0, 2) / 2, 36)
MA, MB, m = 2.0, 3.0, 5.0
# unknowns a, T1, T2 from: T1 = MA a; T2 - T1 = MB a; m g - T2 = m a
a = m * G / (MA + MB + m)
T1, T2 = MA * a, (MA + MB) * a
check('5.10 (b) a', a, 4.9)
check('5.10 (c) T1', T1, 9.8)
check('5.10 (c) T2', T2, 24.5)
check('5.10 check B', T2 - T1, MB * a)
check('5.10 check C', m * G - T2, m * a)
m = 1.0
a = (m * G * sin(radians(60)) - m * G * sin(radians(30))) / (2 * m)
check('5.11 (b)', a, (S3 - 1) / 4 * G)
check('5.11 (b) about 1.8', round(a, 1), 1.8, 0)
T = m * (G * sin(radians(30)) + a)
check('5.11 (c)', T, (S3 + 1) / 4 * m * G)
check('5.11 (c) other block', m * G * sin(radians(60)) - T, m * a)
check('5.11 (d)', solve(lambda mp: mp * sin(radians(30)) - m * sin(radians(60)), 0.1, 5), S3)
m, th = 0.20, atan(0.75)
a = G * tan(th)
T = m * G / cos(th)
check('5.12 (a) horizontal', T * sin(th), m * a)
check('5.12 (a) vertical', T * cos(th), m * G)
check('5.12 (c)', T, m * sqrt(G ** 2 + a ** 2))
check('5.12 (d) a', a, 7.35)
check('5.12 (d) T', m * G / c37, 2.45)
M, mr, L, F = 4.0, 1.0, 2.0, 15.0
a = F / (M + mr)
check('5.13 (a)', a, 3.0)
Tx = lambda x: (M + mr * (L - x) / L) * a
check('5.13 (b)', Tx(L), 12)
check('5.13 (c)', Tx(L / 2), 13.5)
for x in (0.3, 1.6):
    check(f'5.13 (d) at x = {x}', Tx(x), 15 - 1.5 * x)
check('5.13 (d) front end', Tx(0), F)

# ---------------------------------------------------------------------------------------------------------------------
print('\n== Chapter 6 ==')
m, mus, muk = 10.0, 0.60, 0.40
check('6.1 (a)', mus * m * G, 58.8)
check_true('6.1 (b) 50 N is below the limit', 50 < mus * m * G)
check('6.1 (b) static friction matches the push', solve(lambda f: 50 - f, 0, 100), 50)
check('6.1 (c) kinetic friction', muk * m * G, 39.2)
check('6.1 (c)', (79.2 - muk * m * G) / m, 4.0)
t, r, v = run(lambda t, r, v: (-0.25 * G,), (0,), (6.0,), lambda t, r, v: v[0])
check('6.2 (a)', 0.25 * G, 2.45)
check('6.2 (b)', r[0], 360 / 49)
check('6.2 (c)', t, 120 / 49)
check('6.3 (a)', solve(lambda mu: G * s37 - mu * G * c37, 0, 2), 0.75)
check('6.3 (b)', G * (s37 - 0.50 * c37), 1.96)
check('6.3 (c)', 2.0 * G * s37, 11.76)
check('6.4 (a)', 0.50 * 16 / 1.0, 8.0)
check('6.4 (b)', 2 * pi * 1.0 / 4.0, pi / 2)
check('6.4 (c)', solve(lambda v: 0.50 * v * v / 1.0 - 18, 0, 50), 6.0)
k = 0.20
fall = lambda t, r, v: (G - k * v[0] * abs(v[0]) / 49,)
vt = state_at(fall, (0,), (0,), 120.0, 1e-2)[2][0]
check('6.5 (a) terminal speed (RK4)', vt, 49, 1e-6)
check('6.5 (b) drag at half', k * 24.5 ** 2, 49 * G / 4)
check('6.5 (b) acceleration', fall(0, 0, (24.5,))[0], 7.35)
vt2 = state_at(lambda t, r, v: (G - k / 2 * v[0] * abs(v[0]) / 49,), (0,), (0,), 200.0, 1e-2)[2][0]
check('6.5 (c) (RK4)', vt2, 49 * S2, 1e-6)
m, muk = 5.0, 0.25
down, fr = m * G * s37, muk * m * G * c37
check('6.6 gravity along', down, 29.4)
check('6.6 friction', fr, 9.8)
check('6.6 (a)', down + fr, 39.2)
check('6.6 (b)', (down - fr) / m, 3.92)
check('6.6 (c)', down - fr, 19.6)
R6, mus = 4.0, 0.40
vmin = solve(lambda v: mus * v * v / R6 - G, 0.1, 50)
check('6.7 (b)', vmin, 7 * S2)
check('6.7 (c)', 2 * pi * R6 / vmin, 4 * S2 * pi / 7)
check('6.7 (c) about 2.5', round(2 * pi * R6 / vmin, 1), 2.5, 0)
m, R8 = 0.50, 2.5
check('6.8 (a)', solve(lambda T: T + m * G - m * 49 / R8, -50, 50), 4.9)
check('6.8 (b)', sqrt(G * R8), 7 * S2 / 2)
check('6.8 (c)', solve(lambda T: T - m * G - m * 147 / R8, 0, 100), 34.3)
M, m, mus = 4.0, 1.0, 0.40
check('6.9 (a)', (M + m) * mus * G, 19.6)
check('6.9 (b)', (M + m) * mus * m * G / M, 4.9)
a = 10 / (M + m)
check_true('6.9 (c) below the limit', a <= mus * G)
check('6.9 (c)', m * a, 2.0)
m, mus = 2.0, 0.50
check('6.10 (a)', m * G / mus, 39.2)
th = atan(0.75)
Fmin = solve(lambda F: F * sin(th) + mus * F * cos(th) - m * G, 0, 500)
check('6.10 (b) formula', Fmin, m * G / (sin(th) + mus * cos(th)))
check('6.10 (c)', Fmin, 19.6)
check('6.10 (d)', solve(lambda F: F * sin(th) - mus * F * cos(th) - m * G, 0, 1000), 98)
R11, th, mus = 40.0, atan(0.75), 0.50


def bank(v, sign):
    """friction needed (as a multiple of N) at speed v; sign +1: friction down the bank"""
    # N cos - s f sin = m g; N sin + s f cos = m v^2/R, with f = mu N: solve for the speed where both hold
    return (sin(th) + sign * mus * cos(th)) / (cos(th) - sign * mus * sin(th)) * G * R11


check('6.11 (a)', sqrt(G * R11 * tan(th)), 7 * sqrt(6))
check('6.11 (b)', sqrt(bank(0, +1)), 28)
check('6.11 (c)', sqrt(bank(0, -1)), 28 / sqrt(11))
# check (b) by force balance: at 28 m/s with f = mu N down the bank, both equations hold for one N
N = solve(lambda N: N * cos(th) - mus * N * sin(th) - 1.0 * G, 0, 100)
check('6.11 (b) toward the centre', N * sin(th) + mus * N * cos(th), 1.0 * 28 ** 2 / R11)
M, mus, muk = 4.0, 0.50, 0.25
check('6.12 (a)', solve(lambda m: m * G - mus * M * G, 0, 10), 2.0)
m = 3.0
a, T = two(M, -1, -muk * M * G, m, 1, m * G)
check('6.12 (b)', a, 2.8)
check('6.12 (c)', T, 21)
check('6.12 (d)', 1.5 * G, 14.7)
check_true('6.12 (d) holds', 1.5 * G <= mus * M * G)
m, muk = 10.0, 0.75
Fth = lambda th: muk * m * G / (cos(th) + muk * sin(th))
best = solve(lambda th: d1(Fth, th), 0.1, 1.4)
check('6.13 (b)', tan(best), muk)
check('6.13 (b) about 37', round(degrees(best)), 37, 0)
check('6.13 (c)', Fth(best), 58.8)
check('6.13 (c) horizontal', Fth(0), 73.5)
# 6.13 (a): constant velocity at 25 deg: net force zero with N = mg - F sin
th = radians(25)
F = Fth(th)
check('6.13 (a) balance at 25 deg', F * cos(th) - muk * (m * G - F * sin(th)), 0)

# ---------------------------------------------------------------------------------------------------------------------
print('\n== Chapter 7 ==')


def samples(acc, r0, v0, T, n=4000):
    h, t, r, v = T / n, 0.0, tuple(r0), tuple(v0)
    out = [(t, r, v)]
    for i in range(n):
        r, v = rk4(acc, t, r, v, h)
        t = (i + 1) * h
        out.append((t, r, v))
    return out, h


def simpson(ys, h):
    return h / 3 * (ys[0] + ys[-1] + 4 * sum(ys[1:-1:2]) + 2 * sum(ys[2:-1:2]))


check('7.1 (a)', 0.5 * 1500 * 20 ** 2, 3.0e5)
check('7.1 (b)', 0.5 * 1500 * 40 ** 2, 1.2e6)
check('7.1 (c)', sqrt(2 * 5.0 / 0.10), 10)
pull = polar(50, 60)
check('7.2 (a)', dot(pull, (20, 0)), 500)
check('7.2 (b) gravity', dot((0, -1), (20, 0)), 0)
check('7.2 (c) friction', dot((-15, 0), (20, 0)), -300)
check('7.2 (c) net', 500 - 300, 200)
check('7.3 (a)', 3.0 * G * 2.0, 58.8)
check('7.3 (b)', dot((0, -3.0 * G), (0, 2.0)), -58.8)
check('7.3 (c) gravity lowering', dot((0, -3.0 * G), (0, -2.0)), 58.8)
k = 200.0
check('7.4 (a)', k * 0.10, 20)
check('7.4 (b)', integrate(lambda x: k * x, 0, 0.10), 1.0)
check('7.4 (c)', integrate(lambda x: k * x, 0.10, 0.20), 3.0)
check('7.4 (d)', integrate(lambda x: -k * x, 0.10, 0.20), -3.0)
check('7.5 (a)', 50 * G * 6.0, 2940)
check('7.5 (b)', 2940 / 12, 245)
check('7.5 (c)', 2940 / 6.0, 490)
m, F, muk, d = 2.0, 9.8, 0.25, 10.0
check('7.6 (a)', F * d, 98)
check('7.6 (b)', -muk * m * G * d, -49)
t, r, v = run(lambda t, r, v: ((F - muk * m * G) / m,), (0,), (0,), lambda t, r, v: r[0] - d)
check('7.6 (c) (RK4)', v[0], 7.0)
t, r, v = run(lambda t, r, v: (-muk * G,), (0,), v, lambda t, r, v: v[0])
check('7.6 (d) (RK4)', r[0], 10)
F77 = lambda x: 10.0 if x < 4 else 10 - 5 * (x - 4) if x < 6 else 0.0
check('7.7 (a) area', integrate(F77, 0, 6, 12000), 50, 1e-6)
t, r, v = run(lambda t, r, v: (F77(r[0]) / 4.0,), (0,), (0,), lambda t, r, v: r[0] - 6, dt=1e-4)
check('7.7 (b) (RK4)', v[0], 5.0, 1e-5)
t, r, v = run(lambda t, r, v: (F77(r[0]) / 4.0,), (0,), (0,), lambda t, r, v: r[0] - 2, dt=1e-4)
check('7.7 (c) (RK4)', v[0], sqrt(10), 1e-5)
spring = lambda t, r, v: (-200 * r[0] / 0.50 if r[0] > 0 else 0.0,)
t, r, v = run(spring, (0,), (2.0,), lambda t, r, v: v[0], dt=1e-5)
check('7.8 (a) (RK4)', r[0], 0.10)
t, r, v = run(spring, (0,), (2.0,), lambda t, r, v: r[0] - 0.06, dt=1e-5)
check('7.8 (b) (RK4)', v[0], 1.6)
check('7.8 (c)', integrate(lambda x: -200 * x, 0, 0.10), -1.0)
F79 = 1000 * G * 0.10 + 500
check('7.9 (a)', F79, 1480)
check('7.9 (b)', F79 * 20, 29600)
check('7.9 (c)', 500 * 20, 10000)
F710 = lambda x: 12 - 3 * x * x
check('7.10 (a) work', integrate(F710, 0, 1), 11)
t, r, v = run(lambda t, r, v: (F710(r[0]) / 2.0,), (0,), (0,), lambda t, r, v: r[0] - 1, dt=1e-4)
check('7.10 (a) speed (RK4)', v[0], sqrt(11))
check('7.10 (d) power', F710(1) * v[0], 9 * sqrt(11))
S, h = samples(lambda t, r, v: (F710(r[0]) / 2.0,), (0,), (0,), 4.0, 8000)
fast = max(S, key=lambda s: s[2][0])
check('7.10 (b) where (RK4)', fast[1][0], 2.0, 1e-4)
check('7.10 (b) speed (RK4)', fast[2][0], 4.0, 1e-6)
t, r, v = run(lambda t, r, v: (F710(r[0]) / 2.0,), (0,), (0,), lambda t, r, v: v[0] if t > 0.01 else 1, dt=1e-4)
check('7.10 (c) stops at (RK4)', r[0], 2 * S3, 1e-6)
path711 = lambda s: (1 + 2 * s, 2 - 3 * s + 0.7 * sin(pi * s))  # a bent path from (1, 2) to (3, -1)
F711 = lambda p: (2 * p[0], 3.0)
W = integrate(lambda s: dot(F711(path711(s)), ((path711(s + 1e-6)[0] - path711(s - 1e-6)[0]) / 2e-6,
                                                (path711(s + 1e-6)[1] - path711(s - 1e-6)[1]) / 2e-6)), 0, 1)
check('7.11 (a) along a bent path', W, -1.0, 1e-6)
check('7.11 (b)', sqrt(2 * (0.5 * 0.5 * 16 + W) / 0.5), 2 * S3, 1e-6)
m, muk = 50.0, 0.25
T712 = m * G * s37 + muk * m * G * c37
check('7.12 (a)', T712, 392)
check('7.12 (b)', T712 * 0.50, 196)
check('7.12 (c) rope', T712 * 5.0, 1960)
check('7.12 (c) potential energy', m * G * 5.0 * s37, 1470)
check('7.12 (c) thermal', muk * m * G * c37 * 5.0, 490)
P, m = 36000.0, 800.0
acc713 = lambda t, r, v: (P / (m * v[0]),)
# starting from (almost) rest the power law F = P/v is singular at v = 0: integrate from v(t0) = sqrt(90 t0) instead
t0 = 1e-4
S = state_at(acc713, (sqrt(90) * (2 / 3) * t0 ** 1.5,), (sqrt(90 * t0),), 10.0 - t0, 1e-4)
check('7.13 (b) (RK4)', S[2][0], 30, 1e-6)
check('7.13 (c) (RK4)', S[1][0], 200, 1e-6)
check('7.13 (a) v(t) at 4 s', state_at(acc713, (sqrt(90) * (2 / 3) * t0 ** 1.5,), (sqrt(90 * t0),), 4.0 - t0, 1e-4)[2][0], sqrt(90 * 4), 1e-6)
check('7.13 (d)', P / (m * 30), 1.5)

# ---------------------------------------------------------------------------------------------------------------------
print('\n== Chapter 8 ==')
check('8.1 (a)', 0.50 * G * (-10), -49)
t, r, v = run(lambda t, r, v: (-G,), (10.0,), (0.0,), lambda t, r, v: r[0])
check('8.1 (b) (RK4)', abs(v[0]), 14)
check('8.2 (a)', 0.5 * 500 * 0.040 ** 2, 0.40)
for x, want in ((0.040, 2.0), (0.080, 4.0)):
    t, r, v = run(lambda t, r, v: (-500 * r[0] / 0.20,), (-x,), (0.0,), lambda t, r, v: r[0], dt=1e-5)
    check(f'8.2 launch from {x} m (RK4)', v[0], want)
check('8.3 (a)', sqrt(2 * G * 10), 14)
th = radians(25)  # any shape: a 25 deg slide, followed down to 2.5 m above the bottom
t, r, v = run(lambda t, r, v: (G * sin(th),), (0.0,), (0.0,), lambda t, r, v: r[0] * sin(th) - 7.5)
check('8.3 (b) (RK4 on a slope)', v[0], 7 * S3)
U84 = lambda x: 3 * x * x - 2 * x ** 3
check('8.4 (a) F at 0.6', -d1(U84, 0.6), -6 * 0.6 + 6 * 0.36)
eq = [solve(lambda x: d1(U84, x), a_, b_) for a_, b_ in ((-0.5, 0.5), (0.5, 1.5))]
check_vec('8.4 (b)', eq, (0, 1), 1e-8)
check_true('8.4 (c) x = 0 is a minimum', U84(0.05) > U84(0) and U84(-0.05) > U84(0))
check_true('8.4 (c) x = 1 is a maximum', U84(0.95) < U84(1) and U84(1.05) < U84(1))
check('8.5 (a)', 5.0 * 4.0, 20)
check('8.5 (b)', 30 - 20, 10)
check('8.5 (c)', 10 / 5.0, 2.0)
check('8.6 (a)', 0.5 * 490 * 0.20 ** 2, 9.8)
t, r, v = run(lambda t, r, v: (-490 * r[0] / 0.20,), (-0.20,), (0.0,), lambda t, r, v: r[0], dt=1e-5)
check('8.6 (b) (RK4)', v[0], 7 * S2)
t, r, v = run(lambda t, r, v: (-G,), (0.0,), (v[0],), lambda t, r, v: v[0])
check('8.6 (c) (RK4)', r[0], 5.0)
L, m = 2.5, 0.30
check('8.7 (a)', L - L * cos(radians(60)), 1.25)
t, r, v = run(lambda t, r, v: (-G / L * sin(r[0]),), (radians(60),), (0.0,), lambda t, r, v: r[0], dt=1e-4)
vb = L * abs(v[0])
check('8.7 (b) (RK4 swing)', vb, 7 * S2 / 2)
check('8.7 (c)', m * G + m * vb ** 2 / L, 2 * m * G)
check('8.7 (c) newtons', 2 * m * G, 5.88)
m, muk = 2.0, 0.25
check('8.8 (a)', m * G * 7.5, 147)
check('8.8 (b)', muk * m * G * c37 * 12.5, 49)
t, r, v = run(lambda t, r, v: (G * s37 - muk * G * c37,), (0,), (0,), lambda t, r, v: r[0] - 12.5)
check('8.8 (c) (RK4)', v[0], 7 * S2)
U89 = lambda x: 6 - 3 * x if x < 2 else 0.0 if x < 4 else 4 * (x - 4)
check('8.9 (a) left turning point', solve(lambda x: U89(x) - 4, 0, 2), 2 / 3)
check('8.9 (a) right turning point', solve(lambda x: U89(x) - 4, 4, 6), 5)
check('8.9 (b)', sqrt(2 * (4 - 0) / 2.0), 2.0)
check_vec('8.9 (c)', tuple(-d1(U89, x) for x in (1, 3, 5)), (3, 0, -4), 1e-8)
m, Lc, k = 50.0, 15.0, 245.0
jump = lambda t, r, v: (G - (k * (r[0] - Lc) / m if r[0] > Lc else 0),)  # r: distance below the bridge
t, r, v = run(jump, (0,), (0,), lambda t, r, v: v[0] if t > 0.1 else 1, dt=1e-4)
check('8.10 (b) lowest point (RK4)', r[0], 25)
check('8.10 (a) energy at the bottom', m * G * (Lc + 10), 0.5 * k * 10 ** 2)
S, h = samples(jump, (0,), (0,), t, 20000)
fast = max(S, key=lambda s: s[2][0])
check('8.10 (c) where (RK4)', fast[1][0], 17, 1e-4)
check('8.10 (d) speed (RK4)', fast[2][0], 5.6 * sqrt(10), 1e-6)
L, m, vb = 2.0, 1.0, 7 * S2
# integrate the angle from the bottom: theta'' = -(g/L) sin(theta); tension from the radial equation
swing = lambda t, r, v: (-G / L * sin(r[0]),)
for th_deg in (90, 180):
    t, r, v = run(swing, (0.0,), (vb / L,), lambda t, r, v: r[0] - radians(th_deg), dt=1e-4)
    v2 = (L * v[0]) ** 2
    check(f'8.11 (a) v^2 at {th_deg} (RK4)', v2, vb ** 2 - 2 * G * L * (1 - cos(radians(th_deg))))
    T = m * v2 / L + m * G * cos(radians(th_deg))
    check(f'8.11 (b) T at {th_deg}', T, m * vb ** 2 / L - 2 * m * G + 3 * m * G * cos(radians(th_deg)))
check('8.11 (c)', sqrt(5 * G * L), 7 * S2)
check('8.11 (d) bottom', m * vb ** 2 / L + m * G, 6 * m * G)
check('8.11 (d) side', m * vb ** 2 / L - 2 * m * G, 3 * m * G)
m = 500.0
check('8.12 (a)', sqrt(2 * G * 20), 14 * S2)
lost = m * G * 20 - 0.5 * m * 14 ** 2
check('8.12 (b)', lost, 4.9e4)
check('8.12 (c)', lost / 50, 980)
check_true('8.12 (d) not enough energy', 0.5 * m * 14 ** 2 < m * G * 12)
A_, B_ = 1.3, 0.7
U813 = lambda x: A_ / x ** 2 - B_ / x
check('8.13 (a) F at 1.1', -d1(U813, 1.1), 2 * A_ / 1.1 ** 3 - B_ / 1.1 ** 2)
x0 = solve(lambda x: d1(U813, x), 0.5, 20)
check('8.13 (b)', x0, 2 * A_ / B_)
check_true('8.13 (c) a minimum', U813(x0 * 0.95) > U813(x0) and U813(x0 * 1.05) > U813(x0))
check('8.13 (d)', U813(x0), -B_ ** 2 / (4 * A_))
m, k, th = 2.0, 980.0, radians(30)
slope = lambda t, r, v: (G * sin(th) - (k * (r[0] - 1.8) / m if r[0] > 1.8 else 0),)  # r: distance down the slope
t, r, v = run(slope, (0,), (0,), lambda t, r, v: r[0] - 1.8)
check('8.14 (a) (RK4)', v[0], 4.2)
t, r, v = run(slope, (0,), (0,), lambda t, r, v: v[0] if t > 0.1 else 1, dt=1e-5)
check('8.14 (b) (RK4)', r[0] - 1.8, 0.20, 1e-6)
S, h = samples(slope, (0,), (0,), t, 40000)
fast = max(S, key=lambda s: s[2][0])
check('8.14 (c) where (RK4)', fast[1][0] - 1.8, 0.010, 1e-4)
t2, r2, v2 = run(slope, (1.8 + 0.20,), (0.0,), lambda t, r, v: v[0] if t > 0.1 else -1, dt=1e-5)
check('8.14 (d) back to the start (RK4)', r2[0], 0, 1e-6)

done('practice')
