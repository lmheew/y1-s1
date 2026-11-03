"""Numeric checks of every answer in the three Physics mock midterms (mocks.mjs).

Each answer is recomputed from the physics with the problem's numbers (RK4 for the motion, vector sums for the
forces, bisection for the conditions) and compared with the answer on the page.
Run: python3 src/physics/verify_mocks.py   (exits non-zero if anything fails)"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from verify_lib import *  # noqa: F401,F403

S2, S3 = sqrt(2), sqrt(3)
s37, c37 = 0.60, 0.80

# ===================================================================================================================
print('== Mock 1 ==')
check('1-2 3.40 x 0.0250 to 3 sf', sig(3.40 * 0.0250, 3), 0.0850)
check('1-3 12.6 + 0.347 to 1 dp', round(12.6 + 0.347, 1), 12.9)
x = lambda t: 5 - 4 * t + 3 * t ** 3
check('1-4 v at 0.8', d1(x, 0.8), -4 + 9 * 0.64)
check('1-4 a at 0.8', d2(x, 0.8), 18 * 0.8, 1e-5)
check_vec('1-5', mul(1 / norm((2, -1, 2)), (2, -1, 2)), mul(1 / 3, (2, -1, 2)))
A, B = (2, -1, 3), (1, 4, -2)
check('2-1', dot(A, B), -8)
AxB = cross(A, B)
check_vec('2-2', AxB, (-10, 7, 9))
check('2-3', dot(A, B) / (norm(A) * norm(B)), -8 / (7 * sqrt(6)))
check('2-4 |F|/q', norm(AxB), sqrt(230))
check('2-5', dot(AxB, A), 0)
v = lambda t: 6 - 2 * t
xs = lambda T: integrate(v, 0, T)
check('3-1 a', d1(v, 1.3), -2)
check('3-1 x at 1.7', xs(1.7), 6 * 1.7 - 1.7 ** 2)
tt = solve(v, 0, 5)
check('3-2 time', tt, 3.0)
check('3-2 place', xs(tt), 9.0)
check('3-3 displacement', xs(5.0), 5.0)
check('3-3 distance', integrate(lambda t: abs(v(t)), 0, 5, 20000), 13, 1e-6)
check('3-4 average velocity', xs(5.0) / 5.0, 1.0)
check('3-4 average speed', 13 / 5.0, 2.6)
check('3-5', 6 ** 2 + 2 * (-2) * (xs(5.0) - 0), v(5) ** 2)
d, h = 20.0, 10.0
v0 = d * sqrt(G / (d - h))
check('4-2', v0, 14 * S2)
t, r, vv = run(gravity, (0.0, 0.0), polar(v0, 45), lambda t, r, v: r[0] - d)
check('4-2 the ball passes through the target (RK4)', r[1], h)
check('4-3', t, 10 / 7)
check_vec('4-4', vv, (14, 0), 1e-6)
m = 1.0
up = lambda t, r, v: (-G * (s37 + 0.25 * c37),)
check('5-1 N/mg', c37, 0.80)
check('5-2', G * (s37 + 0.25 * c37), 7.84)
t, r, vv = run(up, (0.0,), (5.6,), lambda t, r, v: v[0])
check('5-3 distance (RK4)', r[0], 2.0)
check('5-3 time (RK4)', t, 5 / 7)
check_true('5-4 slides back', G * s37 > 0.50 * G * c37)
t, r, vv = run(lambda t, r, v: (G * (s37 - 0.25 * c37),), (0.0,), (0.0,), lambda t, r, v: r[0] - 2.0)
check('5-5 (RK4)', vv[0], 2.8 * S2)
Rr, w = 0.50, 2.0
rx = lambda t: Rr * cos(w * t)
ry = lambda t: Rr * sin(w * t)
for T in (0.3, 1.1):
    vel = (d1(rx, T), d1(ry, T))
    acc = (d2(rx, T), d2(ry, T))
    check_vec(f'6-1 v at {T}', vel, (-Rr * w * sin(w * T), Rr * w * cos(w * T)), 1e-8)
    check_vec(f'6-2 a = -w^2 r at {T}', acc, (-w * w * rx(T), -w * w * ry(T)), 1e-5)
    check(f'6-3 |a| = v^2/R at {T}', norm(acc), norm(vel) ** 2 / Rr, 1e-5)
    check(f'6-4 power at {T}', dot(acc, vel), 0, 1e-6)
check('6-5 omega from the period', 2 * pi / pi, w)
check('6-5 speed', Rr * w, 1.0)
check('6-5 acceleration', Rr * w * w, 2.0)

# ===================================================================================================================
print('\n== Mock 2 ==')
check('1-2 4.52 - 0.0315 to 2 dp', round(4.52 - 0.0315, 2), 4.49)
check('1-3 6.0 / 0.250 to 2 sf', sig(6.0 / 0.250, 2), 24)
x = lambda t: 2 * t * t - 6 * t + 7
check('1-4 v at 0.4', d1(x, 0.4), 4 * 0.4 - 6)
check('1-4 a', d2(x, 1.0), 4, 1e-5)
check('1-4 at rest', solve(lambda t: d1(x, t), 0, 5), 1.5)
vel, B = (1, 2, 2), (2, -2, 1)
check('2-1', dot(vel, B), 0)
vxB = cross(vel, B)
check_vec('2-2', vxB, (6, 3, -6))
F = mul(-1, vxB)
check_vec('2-3 F/e', F, (-6, -3, 6))
check('2-4 from components', norm(F), 9)
check('2-4 from |v||B| sin 90', norm(vel) * norm(B) * 1, 9)
check_vec('2-5', mul(1 / norm(F), F), mul(1 / 3, (-2, -1, 2)))
# the a-t graph of Figure M2-3, integrated piece by piece (RK4 within each piece, so no step straddles a jump)
phases = [(-2.0, 3.0), (4.0, 2.0), (0.0, 3.0)]
r, v, t0, S = (0.0,), (4.0,), 0.0, []
for a_, dur in phases:
    seg = path(lambda t, r, v, a_=a_: (a_,), r, v, dur, 1e-4)
    S += [(t0 + s[0], s[1], s[2]) for s in seg]
    _, r, v = seg[-1]
    t0 += dur
    if t0 in (3.0, 5.0, 8.0):
        check(f'3-1 v at {t0:g} s (RK4)', v[0], {3.0: -2, 5.0: 6, 8.0: 6}[t0])
zeros = [s[0] for s0, s in zip(S, S[1:]) if (s0[2][0] > 0) != (s[2][0] > 0)]
check_vec('3-2 at rest (RK4)', zeros, (2.0, 3.5), 1e-3)
check('3-3 displacement (RK4)', S[-1][1][0], 25)
dist = sum(abs(s[1][0] - s0[1][0]) for s0, s in zip(S, S[1:]))
check('3-4 distance (RK4)', dist, 28, 1e-6)
acc = (-0.25 * G, -G, 0.50 * G)
check_vec('4-1', acc, (-2.45, -9.8, 4.9))
t, r, vv = run(lambda t, r, v: acc, (0.0, 19.6, 0.0), (9.8, 0.0, 0.0), lambda t, r, v: r[1])
check('4-2 (RK4)', t, 2.0)
check_vec('4-3 (RK4)', (r[0], r[2]), (14.7, 9.8))
check_vec('4-4 velocity (RK4)', vv, (4.9, -19.6, 9.8))
check('4-4 speed', norm(vv), 4.9 * sqrt(21))
m, F, muk = 2.0, 20.0, 0.25
N1 = m * G
N2 = solve(lambda N: N + F * s37 - m * G, -50, 50)
check('5-1 N1', N1, 19.6)
check('5-1 N2', N2, 7.6)
# the two blocks: unknowns a and T. Block 2: F cos - T - mu N2 = m a; block 1: T - mu N1 = m a
a = (F * c37 - muk * (N1 + N2)) / (2 * m)
T = m * a + muk * N1
check('5-2', a, 2.3)
check('5-3', T, 9.5)
check('5-3 block 2', F * c37 - T - muk * N2, m * a)
check('5-4', solve(lambda F: m * G - F * s37, 0, 100), 98 / 3)
v, R6 = 14.0, 20.0
th = atan(v * v / (G * R6))
check('6-2', degrees(th), 45)
M = 1.0
N = M * G / cos(th)
check('6-3', N, S2 * M * G)
check('6-1 toward the centre', N * sin(th), M * v * v / R6)
check_true('6-4 slower: N sin(theta) is more than needed', N * sin(th) > M * 10.0 ** 2 / R6)
check('6-5', 2 * pi * R6 / v, 20 * pi / 7)

# ===================================================================================================================
print('\n== Mock 3 ==')
check('1-2 2.0 x 3.14159 to 2 sf', sig(2.0 * 3.14159, 2), 6.3)
check('1-3 0.0450 + 1.2 to 1 dp', round(0.0450 + 1.2, 1), 1.2)
x = lambda t: 3 * sin(2 * t)
check('1-4 v at 0.7', d1(x, 0.7), 6 * cos(1.4))
check('1-4 a at 0.7', d2(x, 0.7), -12 * sin(1.4), 1e-5)
check_vec('1-5 parallel', cross((1, 2, 3), (2, 4, 6)), (0, 0, 0))
check('1-5 perpendicular', dot((1, 2, 0), (-2, 1, 5)), 0)
for a_, b_ in ((2.0, 1.0), (0.7, 3.1)):
    A, B = (a_, b_, 0), (-b_, a_, 0)
    check(f'2-1 ({a_}, {b_})', dot(A, B), 0)
    check_vec(f'2-2 ({a_}, {b_})', cross(A, B), (0, 0, a_ * a_ + b_ * b_))
    S_ = add(A, B)
    check(f'2-3 ({a_}, {b_})', norm(S_), sqrt(2 * (a_ * a_ + b_ * b_)))
    check(f'2-4 ({a_}, {b_})', degrees(acos(dot(S_, A) / (norm(S_) * norm(A)))), 45)
    check_vec(f'2-5 ({a_}, {b_})', mul(1 / norm(S_), S_), mul(1 / sqrt(2 * (a_ * a_ + b_ * b_)), (a_ - b_, a_ + b_, 0)))
x = lambda t: t ** 3 - 3 * t
check('3-1', (x(2) - x(0)) / 2, 1.0)
tm = solve(lambda t: d1(x, t) - 1.0, 0.01, 2)
check('3-2', tm, 2 / S3)
check('3-3', integrate(lambda t: abs(d1(x, t)), 0, 2, 20000), 6.0, 1e-6)
check('3-4', 6.0 / 2, 3.0)
check('3-4 turns around at', solve(lambda t: d1(x, t), 0.1, 2), 1.0)
L = (14 * 0.60, 14 * 0.80)
check_vec('4-1 launch', L, (8.4, 11.2))
t, r, vv = run(gravity, (0.0, 0.0), L, lambda t, r, v: r[1] - 0.75 * r[0] if t > 0.01 else 1)
check('4-2 (RK4)', t, 1.0)
check_vec('4-3 (RK4)', r, (8.4, 6.3))
check('4-3 along the slope', norm(r), 10.5)
check_vec('4-4 (RK4)', vv, (8.4, 1.4))
m = 5.0
N = m * G * c37
check('5-1', N, 39.2)
check_true('5-2 slides without F', m * G * s37 > 0.50 * N)
check('5-3', solve(lambda F: F + 0.50 * N - m * G * s37, -50, 100), 9.8)
check('5-4', solve(lambda F: F - 0.50 * N - m * G * s37, 0, 200), 49)
f_down = solve(lambda f: 30 - m * G * s37 - f, -50, 50)  # the static friction, counted down the slope
check('5-5 friction, down the slope', f_down, 0.6)
check_true('5-5 within the static limit', abs(f_down) <= 0.50 * N)
R_, m = 1.0, 1.0
v0 = 0.5 * sqrt(G * R_)
# integrate the block on the dome: angle phi from the top, phi'' = (g/R) sin(phi) while it stays on
dome = lambda t, r, v: (G / R_ * sin(r[0]),)
for ph in (0.3, 0.6):
    t, r, vv = run(dome, (0.0,), (v0 / R_,), lambda t, r, v: r[0] - ph)
    v2 = (R_ * vv[0]) ** 2
    check(f'6-1 v^2 at {ph} (RK4)', v2, G * R_ / 4 + 2 * G * R_ * (1 - cos(ph)))
    check(f'6-3 N at {ph}', m * G * cos(ph) - m * v2 / R_, m * G * (3 * cos(ph) - 9 / 4))
ph1 = solve(lambda ph: 3 * cos(ph) - 9 / 4, 0.1, 1.5)
check('6-4', cos(ph1), 3 / 4)
t, r, vv = run(dome, (0.0,), (v0 / R_,), lambda t, r, v: r[0] - ph1)
check('6-5 (RK4)', R_ * vv[0], sqrt(3 * G * R_) / 2)

done('mock')
