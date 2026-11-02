"""Numeric checks of every worked example in the Physics Summary (summary.mjs), one per module of Chapters 1–8.

Each answer is recomputed from the physics with the example's numbers: motion is integrated step by step (RK4),
forces are summed as vectors, work is integrated, and the result is compared with the answer on the page.
Run: python3 src/physics/verify_summary.py   (exits non-zero if anything fails)"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from verify_lib import *  # noqa: F401,F403

S2, S3 = sqrt(2), sqrt(3)
s37, c37 = 0.60, 0.80  # the values the examples give for 37°


def two(a11, a12, b1, a21, a22, b2):
    det = a11 * a22 - a12 * a21
    return (b1 * a22 - a12 * b2) / det, (a11 * b2 - b1 * a21) / det


print('== Chapter 1 ==')
check('1-1 (a) 72.0 km/h in m/s', 72.0 * 1000 / 3600, 20.0)
check('1-1 (b) 3.0 cm^2 in m^2', 3.0 * (1e-2) ** 2, 3.0e-4)
check('1-1 (c) 4.2 + 0.135 to the tenths', round(4.2 + 0.135, 1), 4.3)
check('1-1 (d) 2.50 x 0.0040 to two significant figures', sig(2.50 * 0.0040, 2), 0.010)
check('1-2 (a) seconds in a day', 24 * 3600, 86400)
check('1-2 (b) light in 1.00 ns', 3.00e8 * 1.00e-9, 0.300)
check('1-2 (c) 1.00e6 s in days', round(1.00e6 / 86400, 1), 11.6)
V = 0.0200 ** 3
check('1-3 (a) volume', V, 8.00e-6)
check('1-3 (b) density', sig(21.6e-3 / V, 3), 2.70e3)
check('1-3 (c) density in g/cm^3', 21.6 / 2.00 ** 3, 2.70)
check('1-3 (d) wire length', (8.00 * 10 ** 3) / 1.00 / 1000, 8.00)  # mm^3 / mm^2 -> mm -> m

print('\n== Chapter 2 ==')
legs = [(+60, 1.0), (-30, 0.5)]
check('2-1 (a) displacement', sum(d for d, _ in legs), 30)
check('2-1 (a) distance', sum(abs(d) for d, _ in legs), 90)
check('2-1 (b) average velocity', sum(d for d, _ in legs) / sum(t for _, t in legs), 20)
check('2-1 (c) average speed', sum(abs(d) for d, _ in legs) / sum(t for _, t in legs), 60)
x = lambda t: 5 + 12 * t - 2 * t ** 3
check('2-2 (a) v(t) at t = 0.7', d1(x, 0.7), 12 - 6 * 0.7 ** 2)
check('2-2 (b) v(1)', d1(x, 1), 6.0)
check('2-2 (b) speed at 2 s', abs(d1(x, 2)), 12)
check('2-2 (c) at rest', solve(lambda t: d1(x, t), 0, 3), S2)
check('2-3 (a) a(t) at t = 1.3', d2(x, 1.3), -12 * 1.3, 1e-4)
v = lambda t: 12 - 6 * t ** 2
check('2-3 (b) average acceleration', (v(2) - v(0)) / 2, -12)
check_true('2-3 (c) slowing at 1 s, speeding up at 2 s',
           abs(v(1.0001)) < abs(v(0.9999)) and abs(v(2.0001)) > abs(v(1.9999)))
t, r, vv = run(lambda t, r, v: (-5.0,), (0,), (20,), lambda t, r, v: v[0], dt=1e-4)
check('2-4 stops in 40 m with a = -5.0', r[0], 40)
check('2-4 (b) time to stop', t, 4.0)
_, r, _ = state_at(lambda t, r, v: (-5.0,), (0,), (20,), 2.0)
check('2-4 (c) distance in 2.0 s', r[0], 30)
up = lambda t, r, v: (-G,)
t, r, vv = run(up, (0,), (19.6,), lambda t, r, v: v[0])
check('2-5 (a) time to the top', t, 2.0)
check('2-5 (a) greatest height', r[0], 19.6)
_, r, vv = state_at(up, (0,), (19.6,), 3.0)
check('2-5 (b) velocity at 3.0 s', vv[0], -9.8)
check('2-5 (b) height at 3.0 s', r[0], 14.7)
t, r, vv = run(up, (0,), (19.6,), lambda t, r, v: r[0] if t > 0.01 else 1)
check('2-5 (c) landing time', t, 4.0)
check('2-5 (c) landing velocity', vv[0], -19.6)
a26 = lambda t, r, v: ((2.0 if t < 3 else 0.0 if t < 5 else -3.0),)
st = path(a26, (0,), (0,), 7, 1e-4)
at_ = lambda T: min(st, key=lambda s: abs(s[0] - T))
check_vec('2-6 (a) v at 3, 5 and 7 s', tuple(at_(T)[2][0] for T in (3, 5, 7)), (6.0, 6.0, 0.0), 1e-3)
check('2-6 (b) position at 7 s', st[-1][1][0], 27, 1e-3)

print('\n== Chapter 3 ==')
d = (10 * c37, 10 * s37)
check_vec('3-1 (a) components', d, (8.0, 6.0))
a = (-3.0, 4.0)
check('3-1 (b) magnitude', norm(a), 5.0)
check('3-1 (b) direction (atan2)', degrees(atan2(a[1], a[0])), 180 - degrees(atan(4 / 3)))
check('3-1 (b) about 127 deg', round(degrees(atan2(a[1], a[0]))), 127)
d, e = (8.0, 6.0), (-2.0, 2.0)
s = add(d, e)
check_vec('3-2 (a) d + e', s, (6.0, 8.0))
check('3-2 (a) |s|', norm(s), 10)
check('3-2 (a) direction about 53 deg', round(degrees(atan2(s[1], s[0]))), 53)
check_vec('3-2 (b) d - 2e', sub(d, mul(2, e)), (12, 2))
a, b = (1, 1, 0), (0, 1, 1)
check('3-3 (a) a.b', dot(a, b), 1)
check('3-3 (b) angle', degrees(acos(dot(a, b) / (norm(a) * norm(b)))), 60)
check_vec('3-3 (c) a x b', cross(a, b), (1, -1, 1))
check('3-3 (d) |a x b| = ab sin(phi)', norm(cross(a, b)), norm(a) * norm(b) * sin(radians(60)))
check('3-3 (d) is sqrt 3', norm(cross(a, b)), S3)

print('\n== Chapter 4 ==')
dr = sub((5.0, -1.0), (2.0, 3.0))
check_vec('4-1 (a) displacement', dr, (3.0, -4.0))
check('4-1 (b) size', norm(dr), 5.0)
check('4-1 (b) 53 deg below +x', round(degrees(atan2(dr[1], dr[0]))), -53)
rx = lambda t: 3 * t
ry = lambda t: 4 * t - t ** 2
for T in (0.4, 1.7):
    check_vec(f'4-2 (a) v({T})', (d1(rx, T), d1(ry, T)), (3, 4 - 2 * T))
check_vec('4-2 (b) v(2)', (d1(rx, 2), d1(ry, 2)), (3, 0))
check('4-2 (b) speed at 2 s', norm((d1(rx, 2), d1(ry, 2))), 3)
check_vec('4-2 (c) average velocity', ((rx(2) - rx(0)) / 2, (ry(2) - ry(0)) / 2), (3, 2))
vx = lambda t: 3
vy = lambda t: 4 - 2 * t
check_vec('4-3 (a) a', (d1(vx, 0.8), d1(vy, 0.8)), (0, -2))
check_vec('4-3 (b) average acceleration', ((vx(2) - vx(0)) / 2, (vy(2) - vy(0)) / 2), (0, -2))
spd = lambda t: norm((vx(t), vy(t)))
check_true('4-3 (c) slowing down at 1 s', spd(1.001) < spd(0.999) and dot((vx(1), vy(1)), (0, -2)) < 0)
check('4-3 (c) speed at 1 s', spd(1), sqrt(13))
u0 = polar(19.6, 30)
check_vec('4-4 (a) components', u0, (9.8 * S3, 9.8))
t, r, vv = run(gravity, (0, 0), u0, lambda t, r, v: v[1])
check('4-4 (b) time of the top', t, 1.0)
check('4-4 (b) height', r[1], 4.9)
t, r, vv = run(gravity, (0, 0), u0, lambda t, r, v: r[1] if t > 0.01 else 1)
check('4-4 (c) flight time', t, 2.0)
check('4-4 (c) range', r[0], 19.6 * S3)
check_vec('4-4 (d) landing velocity', vv, (9.8 * S3, -9.8))
check('4-4 (d) landing speed', norm(vv), 19.6)
check('4-4 (d) 30 deg below', degrees(atan2(-vv[1], vv[0])), 30)
rc, vc = 50.0, 10.0
pos = lambda t: (rc * cos(vc * t / rc), rc * sin(vc * t / rc))
acc = (d2(lambda s: pos(s)[0], 1.3), d2(lambda s: pos(s)[1], 1.3))
check('4-5 (a) acceleration', norm(acc), 2.0, 1e-5)
check('4-5 (a) toward the centre', dot(mul(1 / norm(acc), acc), mul(1 / rc, pos(1.3))), -1, 1e-5)
t, r, vv = run(lambda t, r, v: tuple(-(v[0] ** 2 + v[1] ** 2) / (r[0] ** 2 + r[1] ** 2) * c for c in r), (rc, 0), (0, vc),
               lambda t, r, v: r[1] if t > 1 else 1, dt=1e-3)  # integrate around the circle: back to y = 0 after half a lap
check('4-5 (b) one lap', 2 * t, 10 * pi, 1e-5)
check('4-5 (c) acceleration at 20 m/s', 20.0 ** 2 / rc, 8.0)
check('4-6 (a) passenger relative to the ground', -1.5 + 20, 18.5)
check('4-6 (b) passenger relative to the car', 18.5 - 25, -6.5)
vbg = add((0, 4.0), (3.0, 0))  # across (y) and downstream (x)
check('4-7 (a) speed over the ground', norm(vbg), 5.0)
check('4-7 (a) 37 deg downstream', round(degrees(atan2(vbg[0], vbg[1]))), 37)
t, r, vv = run(lambda t, r, v: (0, 0), (0, 0), vbg, lambda t, r, v: r[1] - 80)
check('4-7 (b) crossing time', t, 20)
check('4-7 (b) drift', r[0], 60)
alpha = asin(3.0 / 5.0)
vb2 = add((-5.0 * sin(alpha), 5.0 * cos(alpha)), (3.0, 0))
check('4-7 (c) heading 37 deg upstream: no drift', vb2[0], 0)
check('4-7 (c) heading is about 37 deg', round(degrees(alpha)), 37)
check('4-7 (c) crossing time', 80 / vb2[1], 20)

print('\n== Chapter 5 ==')
F = add((6.0, 0), (0, 8.0))
check('5-1 (a) |F_net|', norm(F), 10)
check('5-1 (a) 53 deg', round(degrees(atan2(F[1], F[0]))), 53)
_, _, vv = state_at(lambda t, r, v: mul(1 / 2.0, F), (0, 0), (0, 0), 1.0)
check('5-1 (b) acceleration (speed after 1 s)', norm(vv), 5.0)
check_vec('5-1 (c) third force cancels', add(F, (-6.0, -8.0)), (0, 0))
m = 60.0
for label, a_, want in (('(a) up 2.0', 2.0, 708), ('(b) constant', 0.0, 588), ('(c) slowing on the way down', 2.0, 708), ('(d) free fall', -G, 0)):
    N = m * G + m * a_  # from N - mg = ma
    check(f'5-2 {label}', N, want)
m, th, T = 5.0, radians(30), 40.0
N = m * G * cos(th)
check('5-3 (b) normal force', N, 24.5 * S3)
_, _, vv = state_at(lambda t, r, v: ((T - m * G * sin(th)) / m,), (0,), (0,), 1.0)
check('5-3 (c) acceleration (speed after 1 s)', vv[0], 3.1)
check('5-3 (d) tension for constant velocity', m * G * sin(th), 24.5)

print('\n== Chapter 6 ==')
m, mus, muk = 5.0, 0.50, 0.25
down, N = m * G * s37, m * G * c37
check('6-1 gravity along the ramp', down, 29.4)
check('6-1 normal force', N, 39.2)
check_true('6-1 (a) static friction cannot hold it', down > mus * N, f'{down} > {mus * N}')
check('6-1 (a) most static friction', mus * N, 19.6)
_, _, vv = state_at(lambda t, r, v: ((down - muk * N) / m,), (0,), (0,), 1.0)
check('6-1 (b) acceleration (speed after 1 s)', vv[0], 3.92)
check('6-1 (c) push for constant speed down', down - muk * N, 19.6)
check('6-1 (d) push to start it up', down + mus * N, 49)
m, k = 80.0, 0.25  # k = C rho A / 2
fall = lambda t, r, v: (G - k * v[0] ** 2 / m,)
_, _, vv = state_at(fall, (0,), (0,), 120.0, dt=1e-2)
check('6-2 (a) terminal speed (falling for 2 minutes)', vv[0], 56, 1e-6)
check('6-2 (b) drag at 28 m/s', k * 28 ** 2, 196)
check('6-2 (b) acceleration at 28 m/s', fall(0, 0, (28,))[0], 7.35)
_, _, vv = state_at(lambda t, r, v: (G - k / 2 * v[0] ** 2 / m,), (0,), (0,), 200.0, dt=1e-2)
check('6-2 (c) terminal speed with half the area', vv[0], 56 * S2, 1e-6)
m, R, v = 1000.0, 20.0, 7.0
cent = m * v ** 2 / R
check('6-3 centripetal force', cent, 2450)
check('6-3 (a) top of the hill', m * G - cent, 7350)
check('6-3 (b) bottom of the dip', m * G + cent, 12250)
check('6-3 (c) contact lost at', solve(lambda u: m * G - m * u ** 2 / R, 1, 50), 14)
check('6-3 (d) twice the weight at', solve(lambda u: m * G + m * u ** 2 / R - 2 * m * G, 1, 50), 14)

print('\n== Chapter 7 ==')
check('7-1 (a) K at 20 m/s', 0.5 * 1000 * 20 ** 2, 2.0e5)
check('7-1 (b) K at 40 m/s', 0.5 * 1000 * 40 ** 2, 8.0e5)
check('7-1 (c) speed', sqrt(2 * 9.0 / 0.50), 6.0)
m, Fp, muk, dist = 2.0, 18.0, 0.50, 10.0
pull = (Fp * c37, Fp * s37)
N = m * G - pull[1]
check('7-2 (a) normal force', N, 8.8)
check('7-2 (a) friction', muk * N, 4.4)
check('7-2 (b) work by the pull', dot(pull, (dist, 0)), 144)
check('7-2 (b) work by friction', dot((-muk * N, 0), (dist, 0)), -44)
check('7-2 (b) work by gravity and the normal force', dot((0, -m * G), (dist, 0)) + dot((0, N), (dist, 0)), 0)
t, r, vv = run(lambda t, r, v: ((pull[0] - muk * N) / m,), (0,), (0,), lambda t, r, v: r[0] - dist, dt=1e-4)
check('7-2 (c) final speed', vv[0], 10)
m, h = 5.0, 2.5
check('7-3 (a) gravity going up', dot((0, -m * G), (0, h)), -122.5)
t, r, vv = run(gravity, (0, h), (0, 0), lambda t, r, v: r[1])
check('7-3 (b) gravity coming down', dot((0, -m * G), (0, -h)), 122.5)
check('7-3 (b) speed at the floor', abs(vv[1]), 7.0)
check('7-3 (c) work by the cable', 0.5 * m * 3.0 ** 2 - dot((0, -m * G), (0, h)), 145)
k = 400.0
check('7-4 (a) force at 5.0 cm', k * 0.050, 20)
Ws = integrate(lambda x: -k * x, 0.050, 0.15)
check('7-4 (b) spring work stretching 5 -> 15 cm', Ws, -4.0)
check('7-4 (c) work by the hand', -Ws, 4.0)
check('7-4 (d) spring work returning 15 -> 5 cm', integrate(lambda x: -k * x, 0.15, 0.050), 4.0)
Fx = lambda x: 12 - 4 * x
m = 2.0
check('7-5 (a) work 0 -> 2 m', integrate(Fx, 0, 2), 16)
f75 = lambda t, r, v: (Fx(r[0]) / m,)
t, r, vv = run(f75, (0,), (0,), lambda t, r, v: r[0] - 2, dt=1e-4)
check('7-5 (b) speed at 2 m', vv[0], 4.0)
st = path(f75, (0,), (0,), 5.0, 1e-4)
fast = max(st, key=lambda s: s[2][0])
check('7-5 (c) fastest at', fast[1][0], 3.0, 1e-4)
check('7-5 (c) top speed', fast[2][0], 3 * S2, 1e-6)
t, r, vv = run(f75, (0,), (0,), lambda t, r, v: v[0] if t > 0.01 else 1, dt=1e-4)
check('7-5 (d) stops at', r[0], 6.0, 1e-6)
m, vf, T = 1200.0, 20.0, 8.0
W = 0.5 * m * vf ** 2
check('7-6 (a) work', W, 2.4e5)
check('7-6 (b) average power', W / T, 3.0e4)
check('7-6 (c) power at the end', m * (vf / T) * vf, 6.0e4)
check('7-6 (d) cruising power', 500 * vf, 1.0e4)

print('\n== Chapter 8 ==')
check('8-1 (a) dU lifting the book', 2.0 * G * 1.5, 29.4)
check('8-1 (a) work by gravity', dot((0, -2.0 * G), (0, 1.5)), -29.4)
check('8-1 (b) U on the floor, zero at the shelf', 2.0 * G * (-1.5), -29.4)
check('8-1 (c) elastic energy', -integrate(lambda x: -800 * x, 0, 0.050), 1.0)
check('8-1 (d) change from 5 to 10 cm', -integrate(lambda x: -800 * x, 0.050, 0.10), 3.0)
m, k, xc = 0.20, 980.0, 0.10
t, r, vv = run(lambda t, r, v: (-k * r[0] / m,), (-xc,), (0,), lambda t, r, v: r[0], dt=1e-6)
check('8-2 (a) speed off the spring', vv[0], 7.0)
ramp = radians(35)
t, r, vv = run(lambda t, r, v: (-G * sin(ramp),), (0,), (7.0,), lambda t, r, v: v[0], dt=1e-4)
check('8-2 (b) height reached', r[0] * sin(ramp), 2.5)
t, r, vv = run(lambda t, r, v: (-G * sin(ramp),), (0,), (7.0,), lambda t, r, v: r[0] * sin(ramp) - 1.25, dt=1e-4)
check('8-2 (c) speed at half the height', vv[0], 7.0 / S2)
t, r, vv = run(lambda t, r, v: (-k * r[0] / m,), (0,), (-7.0,), lambda t, r, v: v[0], dt=1e-6)
check('8-2 (d) compression on the way back', -r[0], xc)
U = lambda x: x ** 2 - 4 * x + 5
check('8-3 (a) F(x) at x = 0.7', -d1(U, 0.7), 4 - 2 * 0.7)
xe = solve(lambda x: -d1(U, x), 0, 4)
check('8-3 (b) equilibrium', xe, 2)
check_true('8-3 (b) stable: U has a minimum', U(xe - 0.1) > U(xe) and U(xe + 0.1) > U(xe))
check('8-3 (c) left turning point', solve(lambda x: U(x) - 5, -1, 2), 0)
check('8-3 (c) right turning point', solve(lambda x: U(x) - 5, 2, 5), 4)
check('8-3 (d) greatest kinetic energy', 5 - U(2), 4)
m, muk, F, dpush = 4.0, 0.25, 19.6, 5.0
fk = muk * m * G
check('8-4 friction', fk, 9.8)
check('8-4 (a) work by the worker', F * dpush, 98)
check('8-4 (b) thermal energy', fk * dpush, 49)
t, r, vv = run(lambda t, r, v: ((F - fk) / m,), (0,), (0,), lambda t, r, v: r[0] - dpush, dt=1e-4)
check('8-4 (c) kinetic energy at the end of the push', 0.5 * m * vv[0] ** 2, 49)
t, r, vv = run(lambda t, r, v: (-fk / m,), (0,), (vv[0],), lambda t, r, v: v[0], dt=1e-4)
check('8-4 (d) slides farther', r[0], 5.0)
m, h, vland = 0.50, 20.0, 18.0
lost = m * G * h - 0.5 * m * vland ** 2
check('8-5 (a) energy lost to the air', lost, 17)
check('8-5 (b) average drag', lost / h, 0.85)
t, r, vv = run(gravity, (0, h), (0, 0), lambda t, r, v: r[1])
check('8-5 (c) speed with no air', abs(vv[1]), 14 * S2)

done('worked-example')
