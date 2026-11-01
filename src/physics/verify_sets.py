"""Numeric checks of every answer in the Physics practice sets A, B and C (quizzes.mjs).

Each answer is recomputed from the physics with sample numbers: force vectors are summed, motion is integrated step
by step (RK4), work is integrated, and the result is compared with the closed form on the page.
Run: python3 src/physics/verify_sets.py   (exits non-zero if anything fails)"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from verify_lib import *  # noqa: F401,F403

S3 = sqrt(3)

# =====================================================================================================================
print('== Practice Set A ==')
# --- Problem 0
check('A0-1 average velocity', (9 - (-3)) / (5 - 1), 3)
check('A0-3 average acceleration', (-6 - 4) / (7 - 2), -2)
check('A0-5 sum to the hundredths', round(4.27 + 0.0315, 2), 4.30)
check('A0-6 product to three significant figures', sig(4.27 * 0.0315, 3), 0.135)
a = (3, -4)
check_vec('A0-7 unit vector', mul(1 / norm(a), a), (3 / 5, -4 / 5))
x = lambda t: 3 + 8 * t - t ** 3
for t in (0.4, 1.7):
    check(f'A0-9 v at t={t}', d1(x, t), 8 - 3 * t ** 2)
    check(f'A0-10 a at t={t}', d2(x, t), -6 * t, 1e-4)
check('A0-10 at rest', solve(lambda t: d1(x, t), 0.5, 3), 2 * sqrt(6) / 3)
c = cross((1, 2, 0), (3, -1, 0))
check_true('A0-12 a cross product of two xy-plane vectors points along z', c[0] == 0 and c[1] == 0 and c[2] != 0)

# --- Problem 1 (symbols: random components)
P, Q = (1.3, -0.7, 2.1), (-0.4, 1.9, 0.8)
px, py, pz = P
qx, qy, qz = Q
check_vec('A1-1 P - 2Q', sub(P, mul(2, Q)), (px - 2 * qx, py - 2 * qy, pz - 2 * qz))
cos_law = (norm(P) ** 2 + norm(Q) ** 2 - norm(sub(P, Q)) ** 2) / (2 * norm(P) * norm(Q))  # law of cosines
check('A1-2 cos(phi)', cos_law, (px * qx + py * qy + pz * qz) / (sqrt(px ** 2 + py ** 2 + pz ** 2) * sqrt(qx ** 2 + qy ** 2 + qz ** 2)))
check_vec('A1-3 Q x P', cross(Q, P), (qy * pz - qz * py, qz * px - qx * pz, qx * py - qy * px))
check_vec('A1-3 Q x P = -(P x Q)', cross(Q, P), mul(-1, cross(P, Q)))
check_vec('A1-4 P x P', cross(P, P), (0, 0, 0))
u = mul(1 / sqrt(qx ** 2 + qy ** 2 + qz ** 2), Q)
check('A1-5 unit vector has length 1', norm(u), 1)
check('A1-5 and points along Q', dot(u, Q), norm(Q))
check('A1-6 |P+Q|^2', norm(add(P, Q)) ** 2, norm(P) ** 2 + norm(Q) ** 2 + 2 * dot(P, Q))

# --- Problem 2
X, Y = (2, -1, 1), (1, 3, -2)
check('A2-1 X.Y', dot(X, Y), -3)
check_true('A2-2 angle larger than 90 deg', degrees(acos(dot(X, Y) / (norm(X) * norm(Y)))) > 90)
check_vec('A2-3 X x Y', cross(X, Y), (-1, 5, 7))
F = mul(1, cross(X, Y))  # e = 1, positive charge
check_vec('A2-4 F', F, (-1, 5, 7))
check('A2-4 |F|', norm(F), 5 * S3)
check('A2-5 F.v', dot(F, X), 0)

# --- Problem 3: x = 2t^3 - 9t^2 + 12t
x = lambda t: 2 * t ** 3 - 9 * t ** 2 + 12 * t
for t in (0.5, 2.5):
    check(f'A3-1 v at t={t}', d1(x, t), 6 * t ** 2 - 18 * t + 12)
    check(f'A3-1 a at t={t}', d2(x, t), 12 * t - 18, 1e-4)
v = lambda t: d1(x, t)
check('A3-2 first rest', solve(v, 0, 1.5), 1)
check('A3-2 second rest', solve(v, 1.5, 3), 2)
check('A3-3 displacement', x(3) - x(0), 9)
dist = integrate(lambda t: abs(v(t)), 0, 3, 30000)
check('A3-3 distance', dist, 11, 1e-5)
check('A3-4 average velocity', (x(3) - x(0)) / 3, 3)
check('A3-4 average speed', dist / 3, 11 / 3, 1e-5)
claimed = lambda t: 1 < t < 1.5 or 2 < t < 3
ok = all((abs(v(t + 1e-4)) > abs(v(t - 1e-4))) == claimed(t) for t in [i / 100 + 0.005 for i in range(300)])
check_true('A3-5 speeding up exactly on 1 < t < 1.5 and 2 < t < 3', ok)

# --- Problem 4
acc = lambda t, r, v: ((3 if t < 2 else 0 if t < 5 else -2),)
st = path(acc, (0,), (-2,), 8, dt=1e-3)
vat = lambda T: min(st, key=lambda s: abs(s[0] - T))[2][0]
check_vec('A4-1 v at 2, 5 and 8 s', (vat(2), vat(5), vat(8)), (4, 4, -2), 1e-3)
vint = lambda T: -2 + integrate(lambda t: acc(t, 0, 0)[0], 0, T, 40000) if T > 0 else -2
check('A4-2 first rest', solve(vint, 0.01, 1.9), 2 / 3, 1e-3)
check('A4-2 second rest', solve(vint, 5.1, 7.9), 7, 1e-3)
check('A4-3 displacement', st[-1][1][0], 17, 1e-3)
v2 = lambda t: 2 * t if t <= 3 else 6 if t <= 4 else 6 - 3 * (t - 4)  # Figure A4-2
check_vec('A4-4 slopes', (d1(v2, 1.5), d1(v2, 3.5), d1(v2, 5)), (2, 0, -3))
check('A4-5 distance', integrate(lambda t: abs(v2(t)), 0, 6, 60000), 21, 1e-5)

# --- Problem 5: knot; string 1 up-left at 30 deg to the ceiling, string 2 up-right at 60 deg
W = 10.0
T1, T2 = W / 2, S3 / 2 * W
net = add(polar(T1, 180 - 30), polar(T2, 60), (0, -W))
check_vec('A5-2 the knot is in equilibrium', net, (0, 0))
Tmax = 7.0
Wm = 2 / S3 * Tmax
check('A5-3 at W_max string 2 is at T_max', S3 / 2 * Wm, Tmax)
check_true('A5-3 and string 1 is below it', Wm / 2 < Tmax)

# --- Problem 6: cliff, v0 = 2 sqrt(gh) at 30 deg, origin at the foot
h = 5.0
v0 = 2 * sqrt(G * h)
r0, u0 = (0.0, h), polar(v0, 30)
t, r, vv = run(gravity, r0, u0, lambda t, r, v: v[1])
check('A6-2 time of the top', t, sqrt(h / G))
check('A6-2 top height', r[1], 1.5 * h)
t, r, vv = run(gravity, r0, u0, lambda t, r, v: r[1] if t > 0.01 else 1)
check('A6-3 time of flight', t, (1 + S3) * sqrt(h / G))
check('A6-4 landing x', r[0], (3 + S3) * h)
check('A6-5 landing speed', norm(vv), sqrt(6 * G * h))


# --- Problem 7: A (M) up the slope, B (m) down; solve the two equations for a and T
def two(a11, a12, b1, a21, a22, b2):
    det = a11 * a22 - a12 * a21
    return (b1 * a22 - a12 * b2) / det, (a11 * b2 - b1 * a21) / det


for M, m, th in ((2.0, 1.5, 25), (1.0, 3.0, 50)):
    s, c_ = sin(radians(th)), cos(radians(th))
    a_, T_ = two(M, -1, -M * G * s, m, 1, m * G)  # M a - T = -M g sin; m a + T = m g
    check(f'A7-2 a (M={M}, m={m}, {th} deg)', a_, (m - M * s) / (M + m) * G)
    check(f'A7-2 T (M={M}, m={m}, {th} deg)', T_, M * m * (1 + s) / (M + m) * G)
    mu = 0.2
    a_, T_ = two(M, -1, -M * G * (s + mu * c_), m, 1, m * G)
    check(f'A7-5 a with friction (M={M}, m={m})', a_, (m - M * (s + mu * c_)) / (M + m) * G)
a_, _ = two(1, -1, -G * 0.5, 1, 1, G)
check('A7-3 M = m, 30 deg', a_, G / 4)
check_true('A7-4 B moves down only when m > M/2',
           two(1, -1, -G * 0.5, 0.51, 1, 0.51 * G)[0] > 0 and two(1, -1, -G * 0.5, 0.49, 1, 0.49 * G)[0] < 0)

# --- Problem 8: conical pendulum
m, L, th = 0.3, 1.2, radians(35)
T = m * G / cos(th)
vv = sqrt(G * L * sin(th) * tan(th))
r_ = L * sin(th)
check('A8-2 vertical balance', T * cos(th), m * G)
check('A8-3 horizontal part of T is m v^2 / r', T * sin(th), m * vv ** 2 / r_)
check('A8-4 period', 2 * pi * r_ / vv, 2 * pi * sqrt(L * cos(th) / G))
Tvec = (-T * sin(th), T * cos(th), 0)  # from the ball toward the axis and up
vel = (0, 0, vv)  # along the circle
check('A8-5 power of the tension', dot(Tvec, vel), 0)

# --- Problem 9: spring, rough strip, frictionless ramp
m, k, d, mu, Ls = 0.5, 200.0, 0.15, 0.3, 0.4
t, r, vv = run(lambda t, r, v: (-k * r[0] / m,), (-d,), (0,), lambda t, r, v: r[0], dt=1e-5)
v1 = vv[0]
check('A9-1 speed off the spring', v1, d * sqrt(k / m))
check('A9-2 work by friction', integrate(lambda s: -mu * m * G, 0, Ls, 100), -mu * m * G * Ls)
t, r, vv = run(lambda t, r, v: (-mu * G,), (0,), (v1,), lambda t, r, v: r[0] - Ls, dt=1e-5)
v2 = vv[0]
check('A9-3 speed after the strip', v2, sqrt(k * d ** 2 / m - 2 * mu * G * Ls))
ramp = radians(40)  # any frictionless ramp: run up a straight one until it stops
t, r, vv = run(lambda t, r, v: (-G * sin(ramp),), (0,), (v2,), lambda t, r, v: v[0], dt=1e-5)
check('A9-4 greatest height', r[0] * sin(ramp), k * d ** 2 / (2 * m * G) - mu * Ls)
d_min = solve(lambda dd: dd ** 2 * k / m - 2 * mu * G * Ls, 1e-6, d)  # where the strip takes all the energy
check('A9-5 smallest compression', d_min, sqrt(2 * mu * m * G * Ls / k))

# --- Problem 10: F = 3 + 4x - 3x^2 on 2.0 kg, from rest at x = 0
Fx = lambda x: 3 + 4 * x - 3 * x ** 2
m = 2.0
check('A10-1 work 0 to 2 m', integrate(Fx, 0, 2), 6)
f10 = lambda t, r, v: (Fx(r[0]) / m,)
t, r, vv = run(f10, (0,), (0,), lambda t, r, v: r[0] - 2, dt=1e-4)
check('A10-2 speed at 2 m', vv[0], sqrt(6))
t, r, vv = run(f10, (0,), (0,), lambda t, r, v: r[0] - 1, dt=1e-4)
check('A10-3 power at 1 m', Fx(1) * vv[0], 8)
t, r, vv = run(f10, (0,), (0,), lambda t, r, v: v[0] if t > 0.01 else 1, dt=1e-4)
check('A10-4 comes to rest at', r[0], 3, 1e-5)

# =====================================================================================================================
print('\n== Practice Set B ==')
v = lambda t: 3 * t ** 2 - 2
check('B0-3 average acceleration', (v(3) - v(1)) / 2, 12)
check('B0-4 acceleration at 2 s', d1(v, 2), 12)
check('B0-5 sum to the tenths', round(12.4 + 3.256, 1), 15.7)
check('B0-6 product to three significant figures', sig(12.4 * 3.256, 3), 40.4)
check_vec('B0-7 unit vector', mul(1 / norm((2, -1, 2)), (2, -1, 2)), (2 / 3, -1 / 3, 2 / 3))
x = lambda t: 2 + 5 * t ** 2 - t ** 3
check('B0-9 v at 1.2 s', d1(x, 1.2), 10 * 1.2 - 3 * 1.2 ** 2)
check('B0-10 a at 0.7 s', d2(x, 0.7), 10 - 6 * 0.7, 1e-4)
check('B0-10 a = 0 at', solve(lambda t: d2(x, t), 0, 3), 5 / 3, 1e-4)
check_vec('B0-11 i.i and i.j', (dot((1, 0, 0), (1, 0, 0)), dot((1, 0, 0), (0, 1, 0))), (1, 0))
check_vec('B0-12 i x j', cross((1, 0, 0), (0, 1, 0)), (0, 0, 1))
check_vec('B0-12 j x i', cross((0, 1, 0), (1, 0, 0)), (0, 0, -1))

av, bv = polar(4, 30), polar(3, 120)
check_vec('B1-1 a', av, (2 * S3, 2))
check_vec('B1-1 b', bv, (-1.5, 1.5 * S3))
check_vec('B1-2 a + b', add(av, bv), (2 * S3 - 1.5, 2 + 1.5 * S3))
check('B1-3 a.b from components', dot(av, bv), 0)
check('B1-3 a.b from the angle', 4 * 3 * cos(radians(120 - 30)), 0)
check_vec('B1-4 a x b', cross(av, bv), (0, 0, 12))
check('B1-5 |a + b|', norm(add(av, bv)), 5)

F = 1.0
for phi, FA in ((225, (S3 + 1) * F), (315, (S3 - 1) * F)):
    check_vec(f'B2 equilibrium with C at {phi} deg', add((FA, 0), polar(2 * F, 150), polar(sqrt(2) * F, phi)), (0, 0))
roots = [p / 10 for p in range(3600) if abs(2 * F * sin(radians(150)) + sqrt(2) * F * sin(radians(p / 10))) < 1e-9]
check_true('B2-2 only 225 and 315 deg balance the y components', roots == [225.0, 315.0], str(roots))

a_, v0, t1, x1 = 1.7, -2.0, 0.8, 3.0
xc = lambda t: x1 + v0 * (t - t1) + 0.5 * a_ * (t ** 2 - t1 ** 2)
check('B3-2 x(t1) = x1', xc(t1), x1)
check('B3-2 dx/dt = v0 + a t', d1(xc, 2.3), v0 + a_ * 2.3)
for (t, r, vv) in path(lambda t, r, v: (a_,), (0.5,), (v0,), 3, 1e-3)[::1000]:
    check(f'B3-3 v^2 - v0^2 = 2a(x - x0) at t={t:.0f}', vv[0] ** 2 - v0 ** 2, 2 * a_ * (r[0] - 0.5))
u0 = 14.0
t, r, vv = run(gravity, (0, 0), (0, u0), lambda t, r, v: v[1])
check('B3-4 greatest height', r[1], u0 ** 2 / (2 * G))
t, r, vv = run(gravity, (0, 0), (0, u0), lambda t, r, v: r[1] if t > 0.01 else 1)
check('B3-4 time to come back', t, 2 * u0 / G)
hh = 6.0
ta, _, _ = run(gravity, (0, 0), (0, u0), lambda t, r, v: r[1] - hh)
tb, _, _ = run(gravity, (0, 0), (0, u0), lambda t, r, v: (r[1] - hh) if v[1] < 0 else 1)  # on the way down
check('B3-5 time between the passes', tb - ta, 2 / G * sqrt(u0 ** 2 - 2 * G * hh))

f4 = lambda t, r, v: (6 * t - 4,)
for T in (0.5, 1.6):
    _, r, vv = state_at(f4, (2,), (1,), T)
    check(f'B4-1 v({T})', vv[0], 3 * T ** 2 - 4 * T + 1)
    check(f'B4-2 x({T})', r[0], T ** 3 - 2 * T ** 2 + T + 2)
st = path(f4, (2,), (1,), 2, 1e-4)
turns = [s[0] for s0, s in zip(st, st[1:]) if (s0[2][0] > 0) != (s[2][0] > 0)]
check_vec('B4-3 at rest', tuple(turns), (1 / 3, 1), 1e-3)
check('B4-4 displacement', st[-1][1][0] - 2, 2)
check('B4-4 distance', sum(abs(s[1][0] - s0[1][0]) for s0, s in zip(st, st[1:])), 62 / 27, 1e-6)

m, th, mus, muk = 3.0, radians(25), 0.5, 0.3
Fp = 20.0
push = lambda F: polar(F, -25)  # pointing down at 25 deg below the horizontal
Nof = lambda F: -(push(F)[1] - m * G)  # the floor cancels the vertical forces
check('B5-1 normal force', Nof(Fp), m * G + Fp * sin(th))
check('B5-2 static friction', abs(-push(Fp)[0]), Fp * cos(th))
Fstart = solve(lambda F: push(F)[0] - mus * Nof(F), 0, 1e4)
check('B5-3 starting force', Fstart, mus * m * G / (cos(th) - mus * sin(th)))
_, _, vv = state_at(lambda t, r, v: ((push(Fstart)[0] - muk * Nof(Fstart)) / m,), (0,), (0,), 1.0)
check('B5-4 acceleration (speed after 1 s)', vv[0], (Fstart * cos(th) - muk * (m * G + Fstart * sin(th))) / m)
Fpull = solve(lambda F: F * cos(th) - mus * (m * G - F * sin(th)), 0, 1e4)
check('B5-5 starting force when pulling up', Fpull, mus * m * G / (cos(th) + mus * sin(th)))
check_true('B5-5 pulling is easier', Fpull < Fstart)

m1, m2, F = 2.0, 3.0, 15.0
a_, P_ = two(m1, 1, F, m2, -1, 0)  # F - P = m1 a; P = m2 a
check('B6-1 acceleration', a_, F / (m1 + m2))
check('B6-2 contact force', P_, m2 * F / (m1 + m2))
a_, P_ = two(m2, 1, F, m1, -1, 0)
check('B6-3 pushed from the other side', P_, m1 * F / (m1 + m2))
mu = 0.2
a_, P_ = two(m1, 1, F - mu * m1 * G, m2, -1, -mu * m2 * G)  # F - P - mu m1 g = m1 a; P - mu m2 g = m2 a
check('B6-4 acceleration', a_, F / (m1 + m2) - mu * G)
check('B6-4 contact force', P_, m2 * F / (m1 + m2))

d, v0 = 12.0, 14.0
t, r, vv = run(gravity, (0, 0), polar(v0, 45), lambda t, r, v: r[0] - d)
check('B7-1 time at the wall', t, sqrt(2) * d / v0)
check('B7-2 height at the wall', r[1], d - G * d ** 2 / v0 ** 2)
v0 = sqrt(2 * G * d)
t, r, vv = run(gravity, (0, 0), polar(v0, 45), lambda t, r, v: r[0] - d)
check('B7-3 vertical speed there is 0', vv[1], 0)
check('B7-3 height', r[1], d / 2)
hw = 4.0
height_at_wall = lambda u: run(gravity, (0, 0), polar(u, 45), lambda t, r, v: r[0] - d)[1][1]
check('B7-4 smallest speed to clear', solve(lambda u: height_at_wall(u) - hw, sqrt(G * d) * 1.01, 40, it=50), d * sqrt(G / (d - hw)), 1e-5)

M, R, mus = 1200.0, 50.0, 0.6
vmax = sqrt(mus * G * R)
check('B8-2 at v_max friction needed equals mu_s M g', M * vmax ** 2 / R, mus * M * G)
th = radians(18)
vb = sqrt(G * R * tan(th))
N = M * G / cos(th)
check('B8-3 vertical balance on the bank', N * cos(th), M * G)
check('B8-4 the horizontal part of N is the centripetal force', N * sin(th), M * vb ** 2 / R)
check_true('B8-5 N > Mg', N > M * G)

m, R = 0.2, 0.5


def loop_top(h):
    """slide down from h (energy on the frictionless ramp), then integrate the motion around the loop: R th'' = -g sin th
    from the bottom (th = 0) to the top (th = pi)"""
    vb = sqrt(2 * G * h)
    t, r, vv = run(lambda t, r, v: (-G / R * sin(r[0]),), (0,), (vb / R,), lambda t, r, v: r[0] - pi, dt=1e-4)
    return vb, R * vv[0]


hh = 2.0
vb, vt = loop_top(hh)
check('B9-1 speed at the bottom', vb, sqrt(2 * G * hh))
check('B9-2 speed at the top', vt, sqrt(2 * G * (hh - 2 * R)))
check('B9-3 normal force at the top', m * vt ** 2 / R - m * G, m * G * (2 * hh / R - 5))
hmin = solve(lambda h: loop_top(h)[1] ** 2 / R - G, 2.1 * R, 4 * R, it=50)
check('B9-4 smallest h', hmin, 5 * R / 2, 1e-5)
check('B9-5 normal force at the bottom', m * G + m * (2 * G * hmin) / R, 6 * m * G, 1e-5)

m, k, v0 = 0.4, 90.0, 3.0
spring = lambda t, r, v: (-k * r[0] / m,)
t, r, vv = run(spring, (0,), (v0,), lambda t, r, v: v[0], dt=1e-5)
check('B10-1 greatest compression', r[0], v0 * sqrt(m / k))
check('B10-2 work by the spring', integrate(lambda x: -k * x, 0, r[0]), -0.5 * m * v0 ** 2)
t, r, vv = run(spring, (0,), (v0,), lambda t, r, v: v[0] - v0 / 2, dt=1e-5)
check('B10-3 compression at half speed', r[0], S3 / 2 * v0 * sqrt(m / k))
check('B10-4 power', -k * r[0] * vv[0], -S3 / 4 * v0 ** 2 * sqrt(k * m))

# =====================================================================================================================
print('\n== Practice Set C ==')
check('C0-1 average velocity', (30 - 12) / (8 - 2), 3)
check('C0-3 average acceleration', (2 - 8) / (3 - 0), -2)
aa = lambda t: cos(t) + 2 * t  # any a(t): integrating it from v0 matches the motion
_, _, vv = state_at(lambda t, r, v: (aa(t),), (0,), (1.5,), 2.0)
check('C0-4 v = v0 + integral of a', vv[0], 1.5 + integrate(aa, 0, 2.0))
check('C0-5 sum to the tenths', round(0.0450 + 2.3, 1), 2.3)
check('C0-6 product to two significant figures', sig(0.0450 * 2.3, 2), 0.10)
r_, thc = 2.5, radians(130)
rv = (r_ * cos(thc), r_ * sin(thc))
check_vec('C0-7 unit vector', mul(1 / norm(rv), rv), (cos(thc), sin(thc)))
x = lambda t: 4 + 6 * t ** 2 - t ** 4
check('C0-9 v at 0.8 s', d1(x, 0.8), 12 * 0.8 - 4 * 0.8 ** 3)
check('C0-10 a at 0.5 s', d2(x, 0.5), 12 - 12 * 0.25, 1e-4)
check('C0-10 a = 0 at', solve(lambda t: d2(x, t), 0.1, 3), 1, 1e-4)

A, B = (3, 4, 0), (2, -1, 2)
check_vec('C1-1 lengths', (norm(A), norm(B)), (5, 3))
check('C1-2 A.B', dot(A, B), 2)
check('C1-3 component along B', dot(A, mul(1 / norm(B), B)), 2 / 3)
check_vec('C1-4 A x B', cross(A, B), (8, -6, -11))
phi = acos(dot(A, B) / (norm(A) * norm(B)))
check('C1-5 parallelogram area', norm(A) * norm(B) * sin(phi), sqrt(221))

ac = lambda t, r, v: (-2, 1)
for T in (0.7, 2.6):
    _, r, vv = state_at(ac, (0, 0), (4, 2), T)
    check_vec(f'C2-1 r({T})', r, (4 * T - T ** 2, 2 * T + T ** 2 / 2))
    check_vec(f'C2-2 v({T})', vv, (4 - 2 * T, 2 + T))
t, r, vv = run(ac, (0, 0), (4, 2), lambda t, r, v: v[0])
check('C2-3 time of the largest x', t, 2)
check_vec('C2-3 where', r, (4, 6))
check('C2-4 speed', norm(vv), 4)
spd = lambda T: norm(state_at(ac, (0, 0), (4, 2), T, 1e-3)[2])
lo, hi = 0.0, 3.0
for _ in range(60):  # ternary search for the slowest moment
    m1_, m2_ = lo + (hi - lo) / 3, hi - (hi - lo) / 3
    lo, hi = (lo, m2_) if spd(m1_) < spd(m2_) else (m1_, hi)
check('C2-5 slowest at', (lo + hi) / 2, 6 / 5, 1e-5)
check('C2-5 slowest speed', spd(1.2), 8 / sqrt(5))
_, _, vv = state_at(ac, (0, 0), (4, 2), 1.2)
check('C2-5 v perpendicular to a then', dot(vv, (-2, 1)), 0)

H, v0 = 20.0, 12.0
# both balls at once, as one 4D state (x1, y1, x2, y2)
t, r, vv = run(lambda t, r, v: (0, -G, 0, -G), (0, H, 0, 0), (0, 0, 0, v0), lambda t, r, v: r[1] - r[3])
check('C3-2 meeting time', t, H / v0)
check('C3-3 meeting height', r[1], H - G * H ** 2 / (2 * v0 ** 2))
meet_h = lambda u: run(lambda t, r, v: (0, -G, 0, -G), (0, H, 0, 0), (0, 0, 0, u), lambda t, r, v: r[1] - r[3])[1][1]
check('C3-4 smallest v0', solve(meet_h, 5, 40, it=50), sqrt(G * H / 2), 1e-5)
u = sqrt(G * H)
t, r, vv = run(lambda t, r, v: (0, -G, 0, -G), (0, H, 0, 0), (0, 0, 0, u), lambda t, r, v: r[1] - r[3])
check('C3-5 ball 2 is momentarily at rest', vv[3], 0)
check('C3-5 at height H/2', r[3], H / 2)

m1, m2 = 3.0, 2.0
a_, T_ = two(m1, 1, m1 * G, m2, -1, -m2 * G)  # m1 g - T = m1 a; T - m2 g = m2 a
check('C4-2 acceleration', a_, (m1 - m2) / (m1 + m2) * G)
check('C4-2 tension', T_, 2 * m1 * m2 / (m1 + m2) * G)
_, r, _ = state_at(lambda t, r, v: (a_,), (0,), (0,), 1.5)
check('C4-3 distance fallen in 1.5 s', r[0], (m1 - m2) * G * 1.5 ** 2 / (2 * (m1 + m2)))
M, m = 4.0, 1.0
Tn = m * G  # the hanging block is at rest
check('C4-4 friction balances the tension', Tn, m * G)
check('C4-4 smallest mu_s', Tn / (M * G), m / M)

m, th, mus = 2.0, radians(35), 0.3
s, c_ = sin(th), cos(th)
fneed = lambda F: m * G * s - F * c_  # the friction needed up the slope to hold the block
Nf = lambda F: m * G * c_ + F * s
Ff = solve(fneed, 0, 1e4)
check('C5-1 frictionless F', Ff, m * G * tan(th))
check('C5-2 normal force', Nf(Ff), m * G / c_)
check('C5-3 smallest F', solve(lambda F: fneed(F) - mus * Nf(F), 0, Ff), m * G * (s - mus * c_) / (c_ + mus * s))
check('C5-4 largest F', solve(lambda F: -fneed(F) - mus * Nf(F), Ff, 1e4), m * G * (s + mus * c_) / (c_ - mus * s))

m, v0 = 0.5, 9.0
wind = lambda t, r, v: (0, -G, 0.1 * G)
t, r, vv = run(wind, (0, 0, 0), (v0, v0, 0), lambda t, r, v: r[1] if t > 0.01 else 1)
check('C6-2 time of flight', t, 2 * v0 / G)
check_vec('C6-3 landing point (x, z)', (r[0], r[2]), (2 * v0 ** 2 / G, v0 ** 2 / (5 * G)))
check_vec('C6-4 velocity at landing', vv, (v0, -v0, 0.2 * v0))
check('C6-5 speed at landing', norm(vv), sqrt(51) / 5 * v0)
check('C6-5 work-energy', 0.5 * m * (norm(vv) ** 2 - 2 * v0 ** 2), 0.1 * m * G * r[2])

M, R, vv_ = 1000.0, 40.0, 12.0
N = M * (G - vv_ ** 2 / R)
check('C7-2 normal force at the top', M * G - N, M * vv_ ** 2 / R)
check('C7-3 N = 0 at the greatest speed', M * (G - sqrt(G * R) ** 2 / R), 0)
m, L = 0.3, 0.8
vt = sqrt(G * L)
check('C7-4 at the slowest top speed the tension is 0', m * vt ** 2 / L - m * G, 0)
# from the top (th = pi from the bottom) down to the side (th = pi/2): L th'' = -g sin th
t, r, vv = run(lambda t, r, v: (-G / L * sin(r[0]),), (pi,), (-vt / L,), lambda t, r, v: r[0] - pi / 2, dt=1e-5)
check('C7-5 tension with the string horizontal', m * (L * vv[0]) ** 2 / L, 3 * m * G)

m, L = 0.2, 1.1
pend = lambda t, r, v: (-G / L * sin(r[0]),)  # angle from the bottom
t, r, vv = run(pend, (pi / 2,), (0,), lambda t, r, v: r[0], dt=1e-5)
vb = L * abs(vv[0])
check('C8-1 speed at the bottom', vb, sqrt(2 * G * L))
check('C8-2 tension at the bottom', m * G + m * vb ** 2 / L, 3 * m * G)
for below in (20, 55):  # degrees below the horizontal = 90 - angle from the bottom
    t, r, vv = run(pend, (pi / 2,), (0,), lambda t, r, v: r[0] - radians(90 - below), dt=1e-5)
    sp = L * abs(vv[0])
    Tn = m * sp ** 2 / L + m * G * cos(r[0])
    check(f'C8-3 speed at {below} deg below', sp, sqrt(2 * G * L * sin(radians(below))))
    check(f'C8-3 tension at {below} deg below', Tn, 3 * m * G * sin(radians(below)))
tens = lambda ang: (lambda st: m * (L * st[2][0]) ** 2 / L + m * G * cos(st[1][0]))(
    run(pend, (pi / 2,), (0,), lambda t, r, v: r[0] - ang, dt=1e-5))
brk = solve(lambda ang: tens(ang) - 2 * m * G, 0.05, pi / 2 - 0.05, it=50)
check('C8-4 breaks at sin(theta) = 2/3', sin(pi / 2 - brk), 2 / 3, 1e-5)

m, th, muk, d = 1.5, radians(40), 0.25, 3.0
down = (cos(th), -sin(th))  # down the slope
check('C9-1 work by gravity', dot((0, -m * G), mul(d, down)), m * G * d * sin(th))
check('C9-2 work by the normal force', dot(mul(m * G * cos(th), (sin(th), cos(th))), mul(d, down)), 0)
check('C9-3 work by friction', dot(mul(-muk * m * G * cos(th), down), mul(d, down)), -muk * m * G * d * cos(th))
t, r, vv = run(lambda t, r, v: (G * (sin(th) - muk * cos(th)),), (0,), (0,), lambda t, r, v: r[0] - d, dt=1e-4)
vf = sqrt(2 * G * d * (sin(th) - muk * cos(th)))
check('C9-4 speed', vv[0], vf)
check('C9-5 average power of gravity', m * G * d * sin(th) / t, 0.5 * m * G * sin(th) * vf)

m, k, d = 0.1, 400.0, 0.08
launcher = lambda t, r, v: ((k * (d - r[0]) / m if r[0] < d else 0) - G,)  # height from the start
t, r, vv = run(launcher, (0,), (0,), lambda t, r, v: r[0] - d, dt=1e-6)
check('C10-1 speed leaving the spring', vv[0], sqrt(k * d ** 2 / m - 2 * G * d))
t, r, vv = run(launcher, (0,), (0,), lambda t, r, v: v[0] if t > 1e-4 else 1, dt=1e-5)
check('C10-2 greatest height', r[0], k * d ** 2 / (2 * m * G))
st = path(launcher, (0,), (0,), 0.05, 1e-6)
fast = max(st, key=lambda s: s[2][0])
check('C10-3 fastest at', fast[1][0], d - m * G / k, 1e-4)
check('C10-4 greatest speed', fast[2][0], (d - m * G / k) * sqrt(k / m), 1e-6)

done('practice-set')
