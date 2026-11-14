"""Numeric checks of the Physics final page (src/physics/final): every Summary worked example, every Practice answer
and every Formulas row.

Each answer is recomputed from the physics with the problem's numbers, by a different route from the page's where one
exists: oscillators are integrated step by step (RK4), waves on strings are run on a chain of beads, sound and Doppler
shifts are timed pulse by pulse, p-V work and entropy are integrated, and microstates are counted one by one. Formula
rows are checked in the form the page prints them (their TeX turned into Python, as in ../verify_formulas.py).
Every Summary module and every Practice problem needs at least one check, and every Formulas row exactly one: a missing
one fails, and so does a check whose problem or row is gone.
Run: python3 src/physics/final/verify.py   (exits non-zero if anything fails)"""
import itertools, json, keyword, math, os, subprocess, sys
from math import sin, cos, tan, sqrt, pi, exp, log, log10, radians, degrees, atan, atan2, asin, acos, factorial

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from verify_lib import check, check_true, done, sig, run, path, state_at, rk4, G  # noqa: E402

LN2 = log(2)
R_GAS, K_B, N_A = 8.31, 1.38e-23, 6.02e23  # the values the page gives


def load():
    js = ("Promise.all([import('%s'), import('%s'), import('%s')]).then(([s, f, p]) => console.log(JSON.stringify("
          "{ summary: s.summary, fgroups: f.fgroups, constants: f.constants, practice: p.practice })))") % tuple(
        'file://' + os.path.join(HERE, n) for n in ('summary.mjs', 'formulas.mjs', 'practice.mjs'))
    return json.loads(subprocess.run(['node', '-e', js], check=True, capture_output=True, text=True).stdout)


# which module or problem each check belongs to: the label before the first space ('15-1 (a) ...', '15.3 (b) ...')
covered = set()


def chk(label, got, want, tol=1e-6):
    covered.add(label.split()[0])
    check(label, got, want, tol)


def ok(label, cond, detail=''):
    covered.add(label.split()[0])
    check_true(label, cond, detail)


# ---------- the physics, step by step ----------
def shm_period(acc, x0, v0=0.0, dt=1e-4):
    """the time between two passes through the same turning point: integrate until v changes sign twice"""
    t1, r, v = run(acc, (x0,), (v0,), lambda t, r, v: v[0] if t > 0 else -x0, dt=dt)
    t2, _, _ = run(acc, r, (v[0] - 1e-12 * (1 if x0 > 0 else -1),), lambda t, r2, v2: v2[0] if t > 0 else x0, dt=dt)
    return t1 + t2


def half_period(acc, x0, dt=1e-4):
    """released from rest at x0: the time to the far turning point (v back to zero)"""
    t, r, v = run(acc, (x0,), (0.0,), lambda t, r, v: (v[0] if t > dt / 2 else -x0), dt=dt)
    return t


def spring(k, m, b=0.0, F=None):
    return lambda t, r, v: ((-k * r[0] - b * v[0] + (F(t) if F else 0.0)) / m,)


def chain_frequency(L, tau, mu, mode=1, n=400):
    """A string of length L fixed at both ends, made of n beads (leapfrog in time). Started in the shape of a mode at
    rest; the time for the first loop's middle to reach zero is a quarter period."""
    dx = L / n
    c2 = tau / mu / dx ** 2
    y = [sin(mode * pi * i / n) for i in range(n + 1)]
    v = [0.0] * (n + 1)
    dt = 0.2 * dx / sqrt(tau / mu)
    j = max(1, round(n / (2 * mode)))
    t = 0.0
    a = [0.0] + [c2 * (y[i + 1] - 2 * y[i] + y[i - 1]) for i in range(1, n)] + [0.0]
    prev = y[j]
    while True:
        for i in range(1, n):
            v[i] += 0.5 * dt * a[i]
            y[i] += dt * v[i]
        for i in range(1, n):
            a[i] = c2 * (y[i + 1] - 2 * y[i] + y[i - 1])
            v[i] += 0.5 * dt * a[i]
        t += dt
        if y[j] <= 0 < prev:
            tq = t - dt * y[j] / (y[j] - prev)
            return 1 / (4 * tq)
        prev = y[j]


def joined_strings_frequency(tau, mu1, mu2, f, L1=1.0, L2=3.0, n_per_m=100):
    """Two bead chains joined at x = L1 (linear densities mu1 then mu2, one tension), the left end shaken up and down at
    f (switched on smoothly). Returns the frequency at which a bead 0.5 m into the second string moves, counted from its
    upward zero crossings before any reflection from the far end gets back."""
    n = int((L1 + L2) * n_per_m)
    dx = (L1 + L2) / n
    mass = [(mu1 if i * dx < L1 else mu2) * dx for i in range(n + 1)]
    y, v = [0.0] * (n + 1), [0.0] * (n + 1)
    dt = 0.2 * dx / sqrt(tau / min(mu1, mu2))
    j = int((L1 + 0.5) / dx)
    t, prev, ups = 0.0, 0.0, []
    t_end = L1 / sqrt(tau / mu1) + (L2 - 0.5 + L2) / sqrt(tau / mu2) - 0.01  # before the far end's echo returns to bead j
    while t < t_end:
        y[0] = 0.001 * sin(2 * pi * f * t) * min(1.0, t * f / 3)
        for i in range(1, n):
            v[i] += dt * tau * (y[i + 1] - 2 * y[i] + y[i - 1]) / dx / mass[i]
        for i in range(1, n):
            y[i] += dt * v[i]
        t += dt
        if prev < 0 <= y[j] and t > t_end / 2:
            ups.append(t)
        prev = y[j]
    return (len(ups) - 1) / (ups[-1] - ups[0])


def amplitude(f, t0, t1, n=4000):
    """the largest |f(t)| on [t0, t1], sampled finely, then refined around the best sample"""
    best = max(range(n + 1), key=lambda i: abs(f(t0 + (t1 - t0) * i / n)))
    lo, hi = t0 + (t1 - t0) * max(0, best - 1) / n, t0 + (t1 - t0) * min(n, best + 1) / n
    for _ in range(60):
        a, b = lo + (hi - lo) / 3, hi - (hi - lo) / 3
        if abs(f(a)) < abs(f(b)):
            lo = a
        else:
            hi = b
    return abs(f((lo + hi) / 2))


def arrivals(f0, v, src, det, n=40, t0=0.0):
    """Pulse timing for the Doppler effect: the source emits a crest every 1/f0 s from src(t); each crest spreads at
    v through still air and is caught by the detector at det(t). Returns the detected frequency."""
    times = []
    for i in range(n):
        te = t0 + i / f0
        xs = src(te)
        # the crest is at distance v (t - te) from xs; find when it meets the detector (bisection)
        g = lambda t: v * (t - te) - abs(det(t) - xs)
        lo, hi = te, te + 1e3
        for _ in range(200):
            mid = (lo + hi) / 2
            if g(mid) < 0:
                lo = mid
            else:
                hi = mid
        times.append((lo + hi) / 2)
    return (n - 1) / (times[-1] - times[0])


def integrate(f, a, b, n=20000):
    h = (b - a) / n
    return h / 3 * (f(a) + f(b) + 4 * sum(f(a + (2 * i - 1) * h) for i in range(1, n // 2 + 1)) + 2 * sum(f(a + 2 * i * h) for i in range(1, n // 2)))


def bisect(g, lo, hi, it=200):
    glo = g(lo)
    for _ in range(it):
        mid = (lo + hi) / 2
        if (g(mid) > 0) == (glo > 0):
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def adiabat(n, Cv, T0, V0, V1, steps=20000):
    """a slow adiabatic change of an ideal gas, step by step: dT = -p dV / (n Cv). Returns (T1, work done by the gas)."""
    T, V, W = T0, V0, 0.0
    h = (V1 - V0) / steps
    for _ in range(steps):  # midpoint rule
        p = n * R_GAS * T / V
        Tm = T - p * (h / 2) / (n * Cv)
        pm = n * R_GAS * Tm / (V + h / 2)
        T -= pm * h / (n * Cv)
        W += pm * h
        V += h
    return T, W


def maxwell(M, T):
    a = M / (2 * pi * R_GAS * T)
    return lambda v: 4 * pi * a ** 1.5 * v * v * exp(-M * v * v / (2 * R_GAS * T))


# =====================================================================================================================
def summary_checks():
    print('== Summary worked examples ==')
    # 15-1: k = 50 N/m, m = 0.50 kg, released from rest at 0.20 m
    acc = spring(50, 0.50)
    T = 2 * half_period(acc, 0.20)
    chk('15-1 (a) period from RK4 = pi/5', T, pi / 5)
    chk('15-1 (a) omega = 2pi/T', 2 * pi / T, 10)
    chk('15-1 (a) f = 5/pi', 1 / T, 5 / pi)
    _, r, _ = state_at(acc, (0.20,), (0.0,), 0.07, dt=1e-4)
    chk('15-1 (b) x(0.07) = 0.20 cos(0.7)', r[0], 0.20 * cos(0.7))
    _, r, v = run(acc, (0.20,), (0.0,), lambda t, r, v: r[0], dt=1e-4)
    chk('15-1 (c) speed through x = 0', abs(v[0]), 2.0)
    chk('15-1 (c) acceleration at the turning point, from F = -kx', 50 * 0.20 / 0.50, 20)
    _, r, v = run(acc, (0.20,), (0.0,), lambda t, r, v: r[0] - 0.12, dt=1e-4)
    chk('15-1 (d) speed at x = 0.12 m', abs(v[0]), 1.6)

    # 15-2: m = 2.0 kg, k = 200 N/m, amplitude 0.10 m
    acc = spring(200, 2.0)
    chk('15-2 (a) E = kx_m^2/2', 0.5 * 200 * 0.10 ** 2, 1.0)
    _, r, v = run(acc, (0.10,), (0.0,), lambda t, r, v: r[0], dt=1e-4)
    chk('15-2 (b) speed through x = 0 (RK4)', abs(v[0]), 1.0)
    _, r, v = run(acc, (0.10,), (0.0,), lambda t, r, v: r[0] - 0.060, dt=1e-4)
    chk('15-2 (c) U at 0.060 m', 0.5 * 200 * r[0] ** 2, 0.36)
    chk('15-2 (c) K at 0.060 m (RK4)', 0.5 * 2.0 * v[0] ** 2, 0.64)
    chk('15-2 (c) speed at 0.060 m', abs(v[0]), 0.80)
    _, r, v = run(acc, (0.10,), (0.0,), lambda t, r, v: 0.5 * 2.0 * v[0] ** 2 - 0.5 * 200 * r[0] ** 2, dt=1e-4)
    chk('15-2 (d) K = U at x = 0.10/sqrt2', r[0], 0.10 / sqrt(2))
    chk('15-2 (d) about 0.071 m', round(0.10 / sqrt(2), 3), 0.071)

    # 15-3: torsion pendulum, I = 0.020, kappa = 0.50, twisted 0.20 rad
    acc = spring(0.50, 0.020)  # theta'' = -kappa theta / I
    T = 2 * half_period(acc, 0.20)
    chk('15-3 (a) period = 2pi/5', T, 2 * pi / 5)
    chk('15-3 (a) omega = 5.0', 2 * pi / T, 5.0)
    chk('15-3 (a) about 1.3 s', round(T, 1), 1.3)
    _, r, v = run(acc, (0.20,), (0.0,), lambda t, r, v: r[0], dt=1e-4)
    chk('15-3 (b) greatest angular speed', abs(v[0]), 1.0)
    chk('15-3 (c) 0.080 kg m^2 doubles the period', 2 * half_period(spring(0.50, 0.080), 0.20) / T, 2.0)

    # 15-4: pendulums, small swings (0.01 rad), sin(theta) kept in the motion
    pend = lambda g_over_L: (lambda t, r, v: (-g_over_L * sin(r[0]),))
    chk('15-4 (a) L = 2.45 m: T = pi', 2 * half_period(pend(G / 2.45), 0.01), pi, 1e-4)
    chk('15-4 (b) L = 9.8/pi^2 gives T = 2.0 s', 2 * half_period(pend(G / (9.8 / pi ** 2)), 0.01), 2.0, 1e-4)
    chk('15-4 (b) about 0.99 m', round(9.8 / pi ** 2, 2), 0.99)
    Lr = 1.2
    chk('15-4 (c) rod about its end: T = 4pi/7', 2 * half_period(pend(G * (Lr / 2) / (Lr ** 2 / 3)), 0.01), 4 * pi / 7, 1e-4)
    chk('15-4 (c) about 1.8 s', round(4 * pi / 7, 1), 1.8)

    # 15-5: m = 0.25 kg, k = 100 N/m, b = 0.050 kg/s
    m, k, b = 0.25, 100.0, 0.050
    acc = spring(k, m, b)
    states = path(acc, (1.0,), (0.0,), 12.0, dt=2e-4)
    peaks = []  # the moments v = 0 with x > 0, found from the samples
    for (t1, r1, v1), (t2, r2, v2) in zip(states, states[1:]):
        if v1[0] > 0 >= v2[0] or (t1 == 0 and r1[0] > 0):
            tp = t1 if t1 == 0 else t1 + (t2 - t1) * v1[0] / (v1[0] - v2[0])
            xp = r1[0] if t1 == 0 else r1[0] + (r2[0] - r1[0]) * (tp - t1) / (t2 - t1)
            peaks.append((tp, xp))
    Tp = (peaks[-1][0] - peaks[1][0]) / (len(peaks) - 2)
    chk('15-5 (a) omega = sqrt(k/m) = 20', sqrt(k / m), 20)
    chk('15-5 (a) damped omega from the motion = sqrt(400 - 0.01)', 2 * pi / Tp, sqrt(400 - 0.01), 1e-5)
    chk('15-5 (a) and that is about 20', round(2 * pi / Tp, 1), 20.0)
    (ta, xa), (tb, xb) = peaks[1], peaks[-1]
    gamma = -log(xb / xa) / (tb - ta)
    chk('15-5 (b) amplitude halves in 10 ln2', LN2 / gamma, 10 * LN2, 1e-4)
    chk('15-5 (b) about 6.9 s', round(10 * LN2, 1), 6.9)
    chk('15-5 (c) energy (kx^2/2 at the peaks) halves in 5 ln2', LN2 / (2 * gamma), 5 * LN2, 1e-4)
    chk('15-5 (c) about 3.5 s', round(5 * LN2, 1), 3.5)
    chk('15-5 (d) energy left after 10 s', exp(-2 * gamma * 10), exp(-2), 1e-4)
    chk('15-5 (d) e^-2 about 0.14', round(exp(-2), 2), 0.14)

    # 15-6: m = 0.40 kg, k = 160 N/m, light damping (b = 0.10 kg/s), driven by cos(wd t)
    m, k, b = 0.40, 160.0, 0.10

    def steady_amp(wd):
        acc = spring(k, m, b, lambda t: cos(wd * t))
        s = path(acc, (0.0,), (0.0,), 60.0, dt=2e-3)
        tail = [abs(r[0]) for t, r, v in s if t > 50]
        return max(tail)
    lo, hi = 19.0, 21.0
    for _ in range(18):  # golden-section search for the largest amplitude
        a, c = hi - 0.618 * (hi - lo), lo + 0.618 * (hi - lo)
        if steady_amp(a) > steady_amp(c):
            hi = c
        else:
            lo = a
    chk('15-6 (a) the amplitude peaks at about 20 rad/s', (lo + hi) / 2, 20, 2e-3)
    chk('15-6 (a) 20 rad/s is 10/pi Hz', 20 / (2 * pi), 10 / pi)
    chk('15-6 (a) about 3.2 Hz', round(10 / pi, 1), 3.2)
    acc = spring(k, m, b, lambda t: cos(2 * pi * 2.0 * t))
    s = path(acc, (0.0,), (0.0,), 80.0, dt=1e-3)
    ups = [t1 for (t1, r1, _), (t2, r2, _) in zip(s, s[1:]) if t1 > 60 and r1[0] < 0 <= r2[0]]
    chk('15-6 (b) settled motion repeats at 2.0 Hz', (len(ups) - 1) / (ups[-1] - ups[0]), 2.0, 1e-3)
    m2 = 10 / pi ** 2
    chk('15-6 (c) mass 10/pi^2 kg resonates at 2.0 Hz', 1 / (2 * half_period(spring(k, m2), 0.01)), 2.0, 1e-5)
    chk('15-6 (c) about 1.0 kg', round(m2, 1), 1.0)

    # 16-1: y = 0.020 sin(4.0 pi x - 20 pi t)
    y = lambda x, t: 0.020 * sin(4.0 * pi * x - 20 * pi * t)
    chk('16-1 (a) amplitude', amplitude(lambda x: y(x, 0), 0, 1), 0.020)
    crests = [i / 20000 for i in range(1, 20000) if y((i - 1) / 20000, 0) < y(i / 20000, 0) >= y((i + 1) / 20000, 0)]
    chk('16-1 (a) wavelength: crest to crest', crests[1] - crests[0], 0.50, 1e-4)
    ups = [i / 1e5 for i in range(1, 30000) if y(0.3, (i - 1) / 1e5) < 0 <= y(0.3, i / 1e5)]
    chk('16-1 (b) period at one point', ups[1] - ups[0], 0.10, 1e-3)
    chk('16-1 (b) frequency', 1 / (ups[1] - ups[0]), 10, 1e-3)
    c0 = bisect(lambda x: 4.0 * pi * 0.020 * cos(4.0 * pi * x), 0.0, 0.2)
    c1 = bisect(lambda x: 4.0 * pi * 0.020 * cos(4.0 * pi * x - 20 * pi * 0.004), 0.0, 0.2)
    chk('16-1 (c) a crest moves 0.020 m in 0.004 s: 5.0 m/s toward +x', (c1 - c0) / 0.004, 5.0)
    ut = lambda t: (y(0.1, t + 1e-7) - y(0.1, t - 1e-7)) / 2e-7
    chk('16-1 (d) greatest transverse speed', amplitude(ut, 0, 0.1), 0.4 * pi, 1e-5)
    chk('16-1 (d) about 1.3 m/s', round(0.4 * pi, 1), 1.3)

    # 16-2: 2.0 m, 10 g, 50 N; the speed from a chain of beads (fundamental frequency times 2L)
    mu = 0.010 / 2.0
    chk('16-2 (a) mu', mu, 5.0e-3)
    v = 2 * 2.0 * chain_frequency(2.0, 50, mu)
    chk('16-2 (b) speed on the bead chain', v, 100, 1e-4)
    chk('16-2 (c) wavelength of 250 Hz', 100 / 250, 0.40)
    chk('16-2 (d) 200 N doubles the speed', 2 * 2.0 * chain_frequency(2.0, 200, mu) / v, 2.0, 1e-4)

    # 16-3: power = average of -tau y_x y_t at a point, with tau = mu v^2
    def power(mu, v, w, ym):
        tau, kk = mu * v * v, w / v
        yx = lambda t: ym * kk * cos(-w * t)
        yt = lambda t: -ym * w * cos(-w * t)
        Tw = 2 * pi / w
        return integrate(lambda t: -tau * yx(t) * yt(t), 0, Tw, 2000) / Tw
    chk('16-3 (a) average power', power(5.0e-3, 100, 200, 0.010), 1.0)
    chk('16-3 (b) amplitude doubled', power(5.0e-3, 100, 200, 0.020), 4.0)
    chk('16-3 (c) frequency halved', power(5.0e-3, 100, 100, 0.010), 0.25)

    # 16-4: second derivatives by finite differences
    def ratio(f, x, t, h=1e-3):
        fxx = (f(x + h, t) - 2 * f(x, t) + f(x - h, t)) / h ** 2
        ftt = (f(x, t + h) - 2 * f(x, t) + f(x, t - h)) / h ** 2
        return ftt / fxx
    chk('16-4 (a) v^2 = y_tt / y_xx', sqrt(ratio(lambda x, t: 0.030 * sin(2.0 * x - 8.0 * t), 0.3, 0.1)), 4.0, 1e-5)
    chk('16-4 (b) standing wave: v', sqrt(ratio(lambda x, t: 0.10 * sin(2.0 * x) * cos(6.0 * t), 0.3, 0.1)), 3.0, 1e-5)
    chk('16-4 (c) tension for 4.0 m/s on 0.25 kg/m (bead chain)', 2 * 1.0 * chain_frequency(1.0, 4.0, 0.25, n=200), 4.0, 1e-4)

    # 16-5: two 4.0 mm waves; the amplitude of the sum at a point
    amp2 = lambda phi: amplitude(lambda t: 4.0 * sin(-t) + 4.0 * sin(-t + phi), 0, 2 * pi)
    chk('16-5 (a) in phase', amp2(0), 8.0)
    chk('16-5 (b) phase pi', amp2(pi), 0.0)
    chk('16-5 (c) phase 2pi/3', amp2(2 * pi / 3), 4.0)
    phi = bisect(lambda p: amp2(p) - 4 * sqrt(3), 0, pi)
    chk('16-5 (d) phase for 4 sqrt3 mm', phi, pi / 3, 1e-6)
    chk('16-5 (d) a sixth of a wavelength', phi / (2 * pi), 1 / 6, 1e-6)

    # 16-6: amplitudes 3.0 and 4.0 mm
    s34 = lambda phi: (lambda t: 3.0 * sin(t) + 4.0 * sin(t + phi))
    chk('16-6 (a) right angles: 5.0 mm', amplitude(s34(pi / 2), 0, 2 * pi), 5.0)
    tpk = max((i * 2 * pi / 100000 for i in range(100000)), key=s34(pi / 2))
    chk('16-6 (a) the sum peaks 53 deg before the first wave does (its phase leads by beta)', round(degrees(pi / 2 - tpk)), 53, 0)
    chk('16-6 (a) beta about 0.93 rad', round(pi / 2 - tpk, 2), 0.93)
    chk('16-6 (b) in line', amplitude(s34(0), 0, 2 * pi), 7.0)
    chk('16-6 (b) opposite', amplitude(s34(pi), 0, 2 * pi), 1.0)
    chk('16-6 (c) pi/3: sqrt37', amplitude(s34(pi / 3), 0, 2 * pi), sqrt(37))
    chk('16-6 (c) about 6.1 mm', round(sqrt(37), 1), 6.1)

    # 16-7: 0.80 m, 72 N, 5.0 g/m, on a chain of beads
    f1 = chain_frequency(0.80, 72, 5.0e-3)
    chk('16-7 (a) fundamental', f1, 75, 1e-4)
    chk('16-7 (a) speed = 2L f1', 2 * 0.80 * f1, 120, 1e-4)
    chk('16-7 (b) third harmonic', chain_frequency(0.80, 72, 5.0e-3, mode=3), 225, 1e-4)
    chk('16-7 (b) wavelength 2L/3 = 8/15', 2 * 0.80 / 3, 8 / 15)
    chk('16-7 (b) about 0.53 m', round(8 / 15, 2), 0.53)
    nodes = sum(1 for i in range(0, 3001) if abs(sin(3 * pi * i / 3000)) < 1e-9)
    chk('16-7 (c) nodes of the third harmonic, ends included', nodes, 4, 0)
    chk('16-7 (d) 288 N gives 150 Hz', chain_frequency(0.80, 288, 5.0e-3), 150, 1e-4)

    # 17-1
    chk('17-1 (a) sqrt(B/rho) for water', sqrt(2.25e9 / 1000), 1.5e3)
    chk('17-1 (b) in water', 1500 / 3000, 0.500)
    chk('17-1 (b) in air, to 3 figures', round(343 / 3000, 3), 0.114)
    chk('17-1 (c) storm distance, km to 2 figures', sig(343 * 3.0, 2), 1.0e3)

    # 17-2: pressure from the displacement field, dp = -B ds/dx with B = rho v^2
    v, rho, w, sm = 340, 1.20, 1000, 1.0e-5
    kk = w / v
    s = lambda x, t: sm * cos(kk * x - w * t)
    dp = lambda x, t: -rho * v * v * (s(x + 1e-6, t) - s(x - 1e-6, t)) / 2e-6
    chk('17-2 (a) pressure amplitude', amplitude(lambda x: dp(x, 0), 0, 2 * pi / kk), 4.08, 1e-5)
    chk('17-2 (a) about 4.1 Pa', round(4.08, 1), 4.1)
    chk('17-2 (b) doubled', 2 * 4.08, 8.16)
    chk('17-2 (b) about 8.2 Pa', round(8.16, 1), 8.2)
    chk('17-2 (c) at a displacement maximum (x = 0, t = 0)', dp(0, 0), 0.0, 1e-5)
    chk('17-2 (d) wavelength = 0.68 pi', 2 * pi / kk, 0.68 * pi)
    chk('17-2 (d) about 2.1 m', round(0.68 * pi, 1), 2.1)

    # 17-3: two speakers in phase, 686 Hz, v = 343 m/s
    lam = 343 / 686
    chk('17-3 (a) wavelength', lam, 0.50)
    both = lambda r1, r2, lam: amplitude(lambda t: sin(2 * pi * r1 / lam - t) + sin(2 * pi * r2 / lam - t), 0, 2 * pi)
    chk('17-3 (b) at 3.0 m and 4.0 m: fully constructive (amplitude 2)', both(3.0, 4.0, lam), 2.0)
    chk('17-3 (c) path difference 1.25 m: fully destructive', both(3.0, 4.25, lam), 0.0)
    fmin = 171.5
    chk('17-3 (d) 171.5 Hz cancels at a 1.0 m difference', both(0.0, 1.0, 343 / fmin), 0.0)
    ok('17-3 (d) and no lower frequency does', all(both(0.0, 1.0, 343 / f) > 1e-3 for f in range(20, 171)))

    # 17-4
    P = 4 * pi * 1e-2
    I = lambda r: P / (4 * pi * r * r)
    beta = lambda I: 10 * log10(I / 1e-12)
    chk('17-4 (a) intensity at 10 m', I(10), 1.0e-4)
    chk('17-4 (a) level', beta(I(10)), 80)
    chk('17-4 (b) level at 100 m', beta(I(100)), 60)
    chk('17-4 (c) two sources, to the dB', round(beta(2 * I(10))), 83)
    chk('17-4 (d) 40 dB at 1.0 km', beta(I(1000)), 40)

    # 17-5: resonances from the end conditions (open end: ds/dx = 0; closed end: s = 0), scanned over frequency
    def resonances(L, v, closed, n=2):
        cond = (lambda f: cos(2 * pi * f / v * L)) if closed else (lambda f: sin(2 * pi * f / v * L))
        out, f = [], 1.0
        while len(out) < n:
            if (cond(f) > 0) != (cond(f + 1) > 0):
                out.append(bisect(cond, f, f + 1))
            f += 1
        return out
    chk('17-5 (a) open pipe, first', resonances(0.50, 340, False)[0], 340)
    chk('17-5 (a) open pipe, second', resonances(0.50, 340, False)[1], 680)
    chk('17-5 (b) closed pipe, first', resonances(0.50, 340, True)[0], 170)
    chk('17-5 (b) closed pipe, second', resonances(0.50, 340, True)[1], 510)
    chk('17-5 (c) 1.0 m closed pipe: 85 Hz', resonances(1.0, 340, True)[0], 85)

    # 17-6: the sum of 440 Hz and 443 Hz, its loudness counted
    sumw = lambda t: cos(2 * pi * 440 * t) + cos(2 * pi * 443 * t)
    env = [amplitude(sumw, 0.05 + i / 300, 0.05 + (i + 1) / 300, 12) for i in range(3000)]  # loudness in 1/300 s windows, 10 s
    swells = sum(1 for a, b, c in zip(env, env[1:], env[2:]) if a < b >= c and b > 1.5)
    chk('17-6 (a) swells in 10 s, per second', swells / 10, 3, 0)
    chk('17-6 (a) the other choice', abs(437 - 440), 3)
    ok('17-6 (b) raising 443 Hz speeds the beats, raising 437 Hz slows them', abs(444 - 440) > 3 and abs(438 - 440) < 3)
    zc = [i / 1e6 for i in range(1, 100000) if sumw((i - 1) / 1e6) < 0 <= sumw(i / 1e6)]
    chk('17-6 (c) pitch from upward zero crossings', (len(zc) - 1) / (zc[-1] - zc[0]), 441.5, 1e-3)
    chk('17-6 (d) tension falls by (1 - (440/443)^2), in % to 2 decimals', round(100 * (1 - (440 / 443) ** 2), 2), 1.35)
    chk('17-6 (d) the estimate 2 x 3/443, in % to 2 decimals', round(100 * 2 * 3 / 443, 2), 1.35)

    # 17-7: pulse timing, v = 340 m/s, f = 990 Hz, speeds 34 m/s
    chk('17-7 (a) source toward', arrivals(990, 340, lambda t: -500 + 34 * t, lambda t: 0.0), 1100, 1e-6)
    chk('17-7 (b) source away', arrivals(990, 340, lambda t: 1 + 34 * t, lambda t: 0.0), 900, 1e-6)
    chk('17-7 (c) detector toward', arrivals(990, 340, lambda t: 0.0, lambda t: 500 - 34 * t), 1089, 1e-6)
    chk('17-7 (d) detector away', arrivals(990, 340, lambda t: 0.0, lambda t: 1 + 34 * t), 891, 1e-6)

    # 17-8: Mach 2.0 at 5.0 km; the first sound to reach the observer
    vS, h = 2.0 * 340, 5000.0
    chk('17-8 (a) speed', vS, 680)
    chk('17-8 (b) cone half-angle', degrees(asin(340 / vS)), 30)
    arrive = lambda te: te + sqrt((vS * te) ** 2 + h * h) / 340  # sound from the jet at time te (overhead at te = 0)
    lo, hi = -100.0, 100.0
    for _ in range(200):
        a, c = lo + (hi - lo) / 3, hi - (hi - lo) / 3
        if arrive(a) < arrive(c):
            hi = c
        else:
            lo = a
    tb = arrive((lo + hi) / 2)
    chk('17-8 (c) jet past the observer when the boom arrives', vS * tb, 5000 * sqrt(3), 1e-6)
    chk('17-8 (c) about 8.7 km', round(5 * sqrt(3), 1), 8.7)
    chk('17-8 (d) about 13 s after it passed overhead', round(tb), 13)

    # 18-1 to 18-3
    chk('18-1 (a) T = 273.16 x 75/50', 273.16 * 75.0 / 50.0, 409.74)
    chk('18-1 (a) about 410 K', round(409.74, -1), 410)
    chk('18-1 (b) p proportional to T: zero at 0 K', 50.0 * 0 / 273.16, 0)
    chk('18-1 (c) at 546.32 K', 50.0 * 546.32 / 273.16, 100)
    chk('18-2 (a) 98.6 F in C', (98.6 - 32) * 5 / 9, 37.0)
    chk('18-2 (a) in K', (98.6 - 32) * 5 / 9 + 273.15, 310.15)
    chk('18-2 (b) 25 C rise in F', 9 / 5 * 25, 45)
    chk('18-2 (c) C = F', bisect(lambda t: 9 / 5 * t + 32 - t, -100, 100), -40)
    chk('18-3 (a) rail, mm', 20 * 1.2e-5 * 40 * 1000, 9.6)
    chk('18-3 (b) cube: (1 + alpha dT)^3 - 1, cm^3 to 2 figures', sig(1000 * ((1 + 2.3e-5 * 100) ** 3 - 1), 2), 6.9)
    chk('18-3 (c) hole diameter, cm', 2.000 * (1 + 1.2e-5 * 100), 2.0024)

    # 18-4
    chk('18-4 (a) warming 2.0 kg by 80 K', 4186 * 2.0 * 80, 669760)
    chk('18-4 (a) 2 figures', sig(669760, 2), 6.7e5)
    chk('18-4 (b) boiling 2.0 kg, 2 figures', sig(2256e3 * 2.0, 2), 4.5e6)
    chk('18-4 (c) mixing: sum of Q = 0', bisect(lambda T: 0.20 * 4186 * (T - 80) + 0.30 * 4186 * (T - 20), 20, 80), 44)
    chk('18-4 (d) melting 0.50 kg, 2 figures', sig(333e3 * 0.50, 2), 1.7e5)

    # 18-5: the rectangle cycle, W = integral of p dV along each side
    side = lambda p, V0, V1: integrate(lambda V: p, V0, V1, 200)
    W_AB, W_CD = side(3.0e5, 1.0e-3, 3.0e-3), side(1.0e5, 3.0e-3, 1.0e-3)
    chk('18-5 (a) A to B', W_AB, 600)
    chk('18-5 (b) C to D', W_CD, -200)
    chk('18-5 (c) net (B to C and D to A at fixed V do none)', W_AB + W_CD, 400)
    chk('18-5 (d) net heat = net work round a cycle', W_AB + W_CD - 0, 400)

    # 18-6
    chk('18-6 (a) conduction', 1.0 * 1.0 * 20 / 5.0e-3, 4.0e3)
    chk('18-6 (b) twice as thick', 1.0 * 1.0 * 20 / 10.0e-3, 2.0e3)
    chk('18-6 (c) sigma T^4 at 1000 K', 5.67e-8 * 1000 ** 4, 5.67e4)
    chk('18-6 (c) at 2000 K, 2 figures', sig(5.67e-8 * 2000 ** 4, 2), 9.1e5)

    # 19-1 to 19-5
    chk('19-1 (a) molecules in 36 g of water, 2 figures', sig(36 / 18 * N_A, 2), 1.2e24)
    chk('19-1 (b) one water molecule, 2 figures', sig(0.018 / N_A, 2), 3.0e-26)
    chk('19-1 (c) moles of N2 in 1.0 kg', round(1000 / 28), 36)
    p0 = 2.0 * R_GAS * 300 / 10e-3
    chk('19-2 (a) initial pressure, 2 figures', sig(p0, 2), 5.0e5)
    chk('19-2 (b) final pressure, 2 figures', sig(2.0 * R_GAS * 300 / 20e-3, 2), 2.5e5)
    W = integrate(lambda V: 2.0 * R_GAS * 300 / V, 10e-3, 20e-3)
    chk('19-2 (c) work: integral of p dV', W, 4986 * LN2)
    chk('19-2 (c) 2 figures', sig(W, 2), 3.5e3)
    chk('19-2 (d) heat = work (T fixed)', sig(W, 2), 3.5e3)
    vrms = lambda M, T: sqrt(3 * R_GAS * T / M)
    chk('19-3 (a) N2 at 300 K', round(vrms(0.028, 300)), 517)
    chk('19-3 (b) H2 over O2', vrms(0.002, 300) / vrms(0.032, 300), 4)
    chk('19-3 (c) O2 is 483 m/s at 300 K, to the m/s', round(vrms(0.032, 300)), 483)
    chk('19-3 (c) at 1200 K: twice', vrms(0.032, 1200) / vrms(0.032, 300) * 483, 966)
    chk('19-3 (d) O2 matches H2 at 300 K', bisect(lambda T: vrms(0.032, T) - vrms(0.002, 300), 300, 10000), 4800)
    chk('19-4 (a) 3/2 kT at 300 K', 1.5 * K_B * 300, 6.21e-21)
    chk('19-4 (b) doubled at', 2 * 300, 600)
    chk('19-4 (b) 600 K in C', 600 - 273.15, 326.85)
    chk('19-4 (c) 3/2 nRT', 1.5 * 2.0 * R_GAS * 300, 7479)
    lam = 1 / (sqrt(2) * pi * (3.0e-10) ** 2 * 2.5e25)
    chk('19-5 (a) mean free path, 2 figures', sig(lam, 2), 1.0e-7)
    chk('19-5 (a) about 300 diameters', round(lam / 3.0e-10, -2), 300)
    chk('19-5 (b) half as dense', sig(1 / (sqrt(2) * pi * (3.0e-10) ** 2 * 1.25e25), 2), 2.0e-7)
    chk('19-5 (c) collisions per second', 500 / 1.0e-7, 5e9)

    # 19-6: the Maxwell distribution for a gas with v_rms = 500 m/s (M/RT chosen to match)
    M, T = 0.032, 0.032 * 500 ** 2 / (3 * R_GAS)
    P = maxwell(M, T)
    chk('19-6 (a) area under the curve', integrate(P, 0, 5000), 1.0, 1e-6)
    vp = bisect(lambda v: (P(v + 1e-3) - P(v - 1e-3)), 100, 1000)
    vavg = integrate(lambda v: v * P(v), 0, 5000)
    chk('19-6 (a) v_rms from the curve', sqrt(integrate(lambda v: v * v * P(v), 0, 5000)), 500, 1e-6)
    chk('19-6 (a) ratio vP/vrms = sqrt2/sqrt3', vp / 500, sqrt(2) / sqrt(3), 1e-6)
    chk('19-6 (a) ratio vavg/vrms = sqrt(8/pi)/sqrt3', vavg / 500, sqrt(8 / pi) / sqrt(3), 1e-6)
    chk('19-6 (a) 1.41 : 1.60 : 1.73', round(sqrt(2), 2) + round(sqrt(8 / pi), 2) / 10 + round(sqrt(3), 2) / 100, 1.41 + 0.160 + 0.0173)
    chk('19-6 (b) vP to the m/s', round(vp), 408)
    chk('19-6 (b) vavg to the m/s', round(vavg), 461)
    vp4 = bisect(lambda v: (maxwell(M, 4 * T)(v + 1e-3) - maxwell(M, 4 * T)(v - 1e-3)), 100, 2000)
    chk('19-6 (c) vP at 4T to the m/s', round(vp4), 816)

    # 19-7, 19-8: heat at constant volume and pressure, with the first law
    n, dT = 2.0, 100
    Qv, Qp, Wp = n * 1.5 * R_GAS * dT, n * 2.5 * R_GAS * dT, n * R_GAS * dT
    chk('19-7 (a) Q at constant volume', Qv, 2493)
    chk('19-7 (b) Q at constant pressure', Qp, 4155)
    chk('19-7 (c) W at constant pressure', Wp, 1662)
    chk('19-7 (d) first law at constant pressure: Q - W = Q at constant volume', Qp - Wp, Qv)
    chk('19-7 (a) 2 figures', sig(Qv, 2), 2.5e3)
    chk('19-7 (b) 2 figures', sig(Qp, 2), 4.2e3)
    chk('19-7 (c) 2 figures', sig(Wp, 2), 1.7e3)
    chk('19-8 (a) CV diatomic, 3 figures', sig(2.5 * R_GAS, 3), 20.8)
    chk('19-8 (a) Cp diatomic, 3 figures', sig(3.5 * R_GAS, 3), 29.1)
    chk('19-8 (b) gamma', 3.5 / 2.5, 1.4)
    chk('19-8 (c) heat for 1.0 mol, 10 K', round(3.5 * R_GAS * 10), 291)
    chk('19-8 (d) CV/Cp', 2.5 / 3.5, 5 / 7)
    chk('19-8 (d) about 0.71', round(5 / 7, 2), 0.71)

    # 19-9: a slow adiabatic expansion, step by step
    Tf, W = adiabat(1.0, 1.5 * R_GAS, 400, 1.0, 8.0)
    chk('19-9 (a) final temperature', Tf, 100, 1e-6)
    chk('19-9 (b) pressure ratio = (Tf/Ti)(Vi/Vf)', (Tf / 400) / 8, 1 / 32, 1e-6)
    chk('19-9 (c) work = integral of p dV', W, 1.5 * R_GAS * 300, 1e-6)
    chk('19-9 (c) 2 figures', sig(W, 2), 3.7e3)

    # 20-1: entropy along a reversible path
    dS = integrate(lambda V: R_GAS * 300 / V / 300, 1.0, 2.0)  # dQ = p dV at constant T, divided by T
    chk('20-1 (a) R ln2', dS, R_GAS * LN2)
    chk('20-1 (a) 5.76 J/K', round(R_GAS * 0.693, 2), 5.76)
    chk('20-1 (b) same end states: same change', round(dS, 2), 5.76)
    chk('20-1 (c) melting, 3 figures', sig(333e3 / 273, 3), 1.22e3)

    # 20-2, 20-3
    chk('20-2 (a) Carnot efficiency', 1 - 300 / 600, 0.50)
    chk('20-2 (b) work', 0.50 * 1200, 600)
    chk('20-2 (c) heat out', 1200 - 600, 600)
    ok('20-2 (d) 700/1200 beats Carnot', 700 / 1200 > 0.50 and round(700 / 1200, 2) == 0.58)
    chk('20-3 (a) Carnot COP', 270 / (300 - 270), 9.0)
    chk('20-3 (b) work', 900 / 9.0, 100)
    chk('20-3 (c) heat to the room', 900 + 100, 1000)

    # 20-4: four molecules, every microstate listed
    states = list(itertools.product('LR', repeat=4))
    chk('20-4 (a) microstates with two on each side', sum(1 for s in states if s.count('L') == 2), 6)
    chk('20-4 (b) all microstates', len(states), 16)
    chk('20-4 (b) chance of all four on the left', sum(1 for s in states if s.count('L') == 4) / len(states), 1 / 16)
    chk('20-4 (c) k ln6, 2 figures', sig(K_B * log(6), 2), 2.5e-23)



# =====================================================================================================================
# The Formulas tab: each row's own TeX, turned into Python by the reader of ../verify_formulas.py (with ln, log and a
# few more Greek letters), evaluated with numbers from the physics.
import verify_formulas as VF  # noqa: E402
VF.GREEK |= {'lambda', 'gamma', 'kappa', 'varepsilon'}
VF.FUNCS |= {'ln', 'log'}
VF.NS.update(ln=log, log=log10)
_argument = VF.Expr.argument


def _argument_frac(self):  # \ln\frac{V_f}{V_i}: a fraction as a function's bare argument
    if self.peek() in ('\\frac', '\\tfrac', '\\dfrac'):
        return self.atom()
    return _argument(self)


VF.Expr.argument = _argument_frac
_name = VF.Expr.name


def _name_kw(self, base):  # lambda is a Python keyword: \lambda is read as lambda_
    out = _name(self, base)
    if keyword.iskeyword(out):
        self.names.discard(out)
        out += '_'
        self.names.add(out)
    return out


VF.Expr.name = _name_kw
holds, num = VF.holds, VF.num
E = math.e
FCHECKS = {}


def frow(where, name):
    def reg(f):
        assert (where, name) not in FCHECKS, (where, name)
        FCHECKS[(where, name)] = f
        return f
    return reg


def brackets(tex):  # [ ] around a factor, read as ( )
    return tex.replace('\\left[', '(').replace('\\right]', ')')


def peaks_of(states):
    """(t, x) at each maximum of x (where v goes from + to -), from a sampled path"""
    out = []
    for (t1, r1, v1), (t2, r2, v2) in zip(states, states[1:]):
        if v1[0] > 0 >= v2[0]:
            tp = t1 + (t2 - t1) * v1[0] / (v1[0] - v2[0])
            out.append((tp, r1[0] + (r2[0] - r1[0]) * (tp - t1) / (t2 - t1)))
    return out


def gas_path(n, Cv, T0, V0, V1, steps=20000, adiabatic=True):
    """a slow change of an ideal gas from V0 to V1, in ln V: adiabatic (dT = -p dV/(n Cv)) or isothermal.
    Returns (T1, W by the gas, Q into the gas)."""
    T, u, W, Q = T0, log(V0), 0.0, 0.0
    h = (log(V1) - log(V0)) / steps
    for _ in range(steps):
        def rates(T):  # per unit of ln V: dW = p dV = nRT du
            dW = n * R_GAS * T
            return (-dW / (n * Cv) if adiabatic else 0.0), dW
        dT1, dW1 = rates(T)
        dT2, dW2 = rates(T + h * dT1)
        T += h * (dT1 + dT2) / 2
        W += h * (dW1 + dW2) / 2
        u += h
    Q = 0.0 if adiabatic else W
    return T, W, Q


def gas_until(n, Cv, T0, V0, T1):
    """the volume at which a slow adiabatic expansion from (T0, V0) reaches T1"""
    return bisect(lambda V: gas_path(n, Cv, T0, V0, V, 4000)[0] - T1, V0, V0 * 1000, 80)


def carnot(TH, TL, n=1.0, Cv=1.5 * R_GAS, V1=1.0, V2=2.0):
    """an ideal-gas Carnot cycle, leg by leg: isothermal at TH from V1 to V2, adiabatic to TL, isothermal back, and
    adiabatic to the start. Returns (|Q_H|, |Q_L|, |W|)."""
    _, W12, QH = gas_path(n, Cv, TH, V1, V2, adiabatic=False)
    V3, V4 = gas_until(n, Cv, TH, V2, TL), gas_until(n, Cv, TH, V1, TL)
    W23 = gas_path(n, Cv, TH, V2, V3)[1]
    _, W34, Q34 = gas_path(n, Cv, TL, V3, V4, adiabatic=False)
    W41 = -gas_path(n, Cv, TH, V1, V4)[1]
    return QH, -Q34, W12 + W23 + W34 + W41


def maxwell_cdf(v, a):  # the speed distribution's cumulative fraction, from the three Gaussian velocity components
    return math.erf(v / (a * sqrt(2))) - sqrt(2 / pi) * (v / a) * exp(-v * v / (2 * a * a))


def slab_flux(layers, TH, TC, A=1.0, n=60, sweeps=20000):
    """Steady conduction through slabs [(L, k), ...] in series: relax the temperatures of n nodes per slab until the
    heat flowing into each node equals the heat flowing out, then read the flow through the first slab."""
    xs, ks = [], []
    for L, k in layers:
        for i in range(n):
            xs.append(L / n)
            ks.append(k)
    m = len(xs)
    T = [TH + (TC - TH) * i / m for i in range(m + 1)]
    g = [ks[i] / xs[i] for i in range(m)]  # conductance of each cell
    for _ in range(sweeps):
        for i in range(1, m):
            T[i] = (g[i - 1] * T[i - 1] + g[i] * T[i + 1]) / (g[i - 1] + g[i])
    return A * g[0] * (T[0] - T[1])


# ---------- constants ----------
@frow('const', 'Gas constant')
def _(tex):
    check('R on the page, to 3 figures (8.314462618)', num(tex.split('=')[1].split('\\ ')[0]), sig(8.314462618, 3), 0)


@frow('const', 'Boltzmann constant')
def _(tex):
    check('k on the page, to 3 figures', num(tex.split('=')[1].split('\\ \\text')[0]), sig(1.380649e-23, 3), 1e-12)
    check('k = R/N_A (CODATA)', 8.314462618 / 6.02214076e23, 1.380649e-23, 1e-9)


@frow('const', 'Avogadro’s number')
def _(tex):
    check('N_A on the page, to 3 figures', num(tex.split('=')[1].split('\\ \\text')[0]), sig(6.02214076e23, 3), 1e-12)


@frow('const', 'Absolute zero')
def _(tex):
    check('0 K in Celsius', -273.15, 0 - 273.15)
    check_true('the page says -273.15', '-273.15' in tex)


@frow('const', 'Logarithms')
def _(tex):
    for part, val in zip(VF.equations(tex), [log10(2), log10(3), log(2), log(3)]):
        check(f'{part}: to 2 decimals', float(part.split('\\approx')[1]), round(val, 2), 0)


@frow('const', 'Exponentials')
def _(tex):
    for part, val in zip(VF.equations(tex), [E, exp(-1), exp(-2)]):
        check(f'{part}: to 2 decimals', float(part.split('\\approx')[1]), round(val, 2), 0)


@frow('const', 'Speed of sound in air')
def _(tex):
    v = sqrt(1.4 * 8.314462618 * 293.15 / 0.028965)  # gamma R T / M for dry air at 20 C
    check('sqrt(gamma R T / M) for air at 20 C, to the m/s', round(v), num(tex.split('=')[1].split('\\ ')[0]), 0)


@frow('const', 'Reference intensity')
def _(tex):
    check_true('I0 is 10^-12 W/m^2', 'I_0=10^{-12}' in tex)
    check('0 dB at I0', 10 * log10(1e-12 / 1e-12), 0)


@frow('const', 'Atmospheric pressure')
def _(tex):
    check('1 atm = 101325 Pa, to 3 figures', sig(101325, 3), 1.01e5)
    check_true('the page says 1.01 x 10^5', '1.01\\times10^5' in tex)


@frow('const', 'Water')
def _(tex):
    check('c = 1 cal/(g K) in J/(kg K)', 1 * 4.186 * 1000, 4186)
    check('L_F: 333.55 kJ/kg, as the book rounds it', math.floor(333.55), 333)
    check('L_V: 2256.4 kJ/kg at 100 C, to the kJ', round(2256.4), 2256)
    check_true('the page has all three', all(s in tex for s in ('c=4186', 'L_F=333', 'L_V=2256')))


@frow('const', 'Calorie')
def _(tex):
    check('the 15-degree calorie, 4.1855 J, to 4 figures', sig(4.1855, 4), num(tex.split('=')[1].split('\\ ')[0]))


@frow('const', 'Stefan–Boltzmann constant')
def _(tex):
    check('sigma = 2 pi^5 k^4 / (15 h^3 c^2), to 3 figures', sig(2 * pi ** 5 * 1.380649e-23 ** 4 / (15 * 6.62607015e-34 ** 3 * 299792458 ** 2), 3), 5.67e-8, 1e-12)
    check_true('the page says 5.67 x 10^-8', '5.67\\times10^{-8}' in tex)


@frow('const', 'Free-fall acceleration')
def _(tex):
    check('g on the page is the g of every check', num(tex.split('=')[1].split('\\ ')[0]), G, 0)


# ---------- Chapter 15 ----------
K15, M15 = 8.0, 2.0  # a 2.0 kg block on an 8.0 N/m spring: omega = 2 rad/s
XM, PHI = 0.30, 0.60


def shm_state(t):
    return state_at(spring(K15, M15), (XM * cos(PHI),), (-2.0 * XM * sin(PHI),), t, dt=1e-4)


@frow('15-1', 'Frequency')
def _(tex):
    s = path(spring(K15, M15), (XM,), (0.0,), 30.0, dt=1e-3)
    ups = [t1 for (t1, r1, _), (t2, r2, _) in zip(s, s[1:]) if r1[0] < 0 <= r2[0]]
    f = (len(ups) - 1) / (ups[-1] - ups[0])
    holds('oscillations counted for 30 s against the RK4 period', tex, 1e-4, f=f, T=2 * half_period(spring(K15, M15), XM))


@frow('15-1', 'Displacement')
def _(tex):
    t, r, v = shm_state(1.3)
    holds('RK4', tex, swap={'x(t)': 'x_t'}, x_t=r[0], x_m=XM, omega=2.0, t=t, phi=PHI)


@frow('15-1', 'Angular frequency')
def _(tex):
    T = 2 * half_period(spring(K15, M15), XM)
    holds('RK4 period, omega = sqrt(k/m)', tex, omega=sqrt(K15 / M15), T=T, f=1 / T)


@frow('15-1', 'Velocity')
def _(tex):
    t, r, v = shm_state(1.3)
    holds('RK4', tex, swap={'v(t)': 'v_t'}, v_t=v[0], omega=2.0, x_m=XM, t=t, phi=PHI)


@frow('15-1', 'Acceleration')
def _(tex):
    t, r, v = shm_state(1.3)
    holds('RK4, a from the spring force', tex, swap={'a(t)': 'a_t'}, a_t=-K15 * r[0] / M15, omega=2.0, x_m=XM, t=t, phi=PHI)


@frow('15-1', 'The mark of SHM')
def _(tex):
    t, r, v = shm_state(0.9)
    holds('RK4, a from the spring force', tex, a=-K15 * r[0] / M15, omega=2.0, x=r[0])


@frow('15-1', 'Greatest speed and acceleration')
def _(tex):
    s = path(spring(K15, M15), (XM,), (0.0,), pi, dt=1e-4)
    holds('largest |v| and |a| over a period (RK4)', tex, 1e-6, v_m=max(abs(v[0]) for _, _, v in s), omega=2.0, x_m=XM,
          a_m=max(abs(K15 * r[0] / M15) for _, r, _ in s))


@frow('15-1', 'Restoring force')
def _(tex):
    k, x = 8.0, 0.25
    U = lambda x: integrate(lambda s: k * s, 0, x, 200)  # work done stretching the spring
    holds('F = -dU/dx', tex, 1e-6, F=-(U(x + 1e-5) - U(x - 1e-5)) / 2e-5, k=k, x=x)


@frow('15-1', 'Block on a spring')
def _(tex):
    T = 2 * half_period(spring(K15, M15), XM)
    holds('RK4 period', tex, omega=2 * pi / T, k=K15, m=M15, T=T)


@frow('15-2', 'Potential energy')
def _(tex):
    holds('work done stretching the spring', tex, U=integrate(lambda s: 50 * s, 0, 0.12, 200), k=50, x=0.12)


@frow('15-2', 'Kinetic energy')
def _(tex):
    t, r, v = run(lambda t, r, v: (3.0 / 1.5,), (0.0,), (0.0,), lambda t, r, v: r[0] - 2.0, dt=1e-3)
    holds('a 3.0 N push over 2.0 m from rest: K = work done', tex, K=3.0 * 2.0, m=1.5, v=v[0])


@frow('15-2', 'Mechanical energy')
def _(tex):
    s = path(spring(K15, M15), (XM,), (0.0,), 2.2, dt=1e-4)
    t, r, v = s[-1]
    holds('RK4 at t = 2.2 s', tex, E=0.5 * K15 * r[0] ** 2 + 0.5 * M15 * v[0] ** 2, k=K15, x_m=XM, m=M15, v_m=max(abs(w[0]) for _, _, w in s))


@frow('15-2', 'Speed at a position')
def _(tex):
    _, r, v = run(spring(K15, M15), (XM,), (0.0,), lambda t, r, v: r[0] - 0.1, dt=1e-4)
    holds('RK4', tex, v=abs(v[0]), omega=2.0, x_m=XM, x=0.1)


@frow('15-3', 'Restoring torque')
def _(tex):
    kap, th = 0.50, 0.3
    U = lambda a: integrate(lambda s: kap * s, 0, a, 200)
    holds('tau = -dU/dtheta', tex, 1e-6, tau=-(U(th + 1e-5) - U(th - 1e-5)) / 2e-5, kappa=kap, theta=th)


@frow('15-3', 'Angular displacement')
def _(tex):
    I, kap, thm, ph = 0.020, 0.50, 0.20, 0.3
    t, r, v = state_at(spring(kap, I), (thm * cos(ph),), (-5.0 * thm * sin(ph),), 0.8, dt=1e-4)
    holds('RK4', tex, theta=r[0], theta_m=thm, omega=5.0, t=t, phi=ph)


@frow('15-3', 'Torsion pendulum')
def _(tex):
    holds('RK4 period', tex, T=2 * half_period(spring(0.50, 0.020), 0.20), I=0.020, kappa=0.50)


@frow('15-4', 'Simple pendulum')
def _(tex):
    L = 0.75
    holds('RK4 with sin(theta), 0.01 rad', tex, 1e-4, T=2 * half_period(lambda t, r, v: (-G / L * sin(r[0]),), 0.01), L=L, g=G)


@frow('15-4', 'Physical pendulum')
def _(tex):
    m, L = 2.0, 1.2
    I, h = m * L * L / 3, L / 2
    holds('RK4, a rod about one end', tex, 1e-4, T=2 * half_period(lambda t, r, v: (-m * G * h / I * sin(r[0]),), 0.01), I=I, m=m, g=G, h=h)


@frow('15-4', 'Small angles')
def _(tex):
    holds('0.20 rad', tex, theta=0.20)
    deg = degrees(bisect(lambda a: (a - sin(a)) / sin(a) - 0.01, 0.01, 1.0))
    check('the error reaches 1% at about 14 degrees', round(deg), 14, 0)


@frow('15-4', 'Pendulum’s restoring torque')
def _(tex):
    m, L, th = 0.5, 1.5, 0.12
    r, F = (L * sin(th), -L * cos(th)), (0.0, -m * G)  # from the pivot to the bob, and the bob's weight
    holds('r x F about the pivot', tex, tau=r[0] * F[1] - r[1] * F[0], m=m, g=G, L=L, theta=th)


@frow('15-4', 'SHM and circular motion')
def _(tex):
    xm, w, ph, t = 0.4, 3.0, 0.5, 0.7
    c, s_ = cos(w * t), sin(w * t)
    x0, y0 = xm * cos(ph), xm * sin(ph)
    pos = lambda t: (xm * cos(ph) * cos(w * t) - xm * sin(ph) * sin(w * t), xm * cos(ph) * sin(w * t) + xm * sin(ph) * cos(w * t))
    speed = math.dist(pos(t + 1e-6), pos(t - 1e-6)) / 2e-6
    holds('a point turned by the angle wt (rotation matrix)', tex, 1e-6, x=x0 * c - y0 * s_, x_m=xm, omega=w, t=t, phi=ph, v_ref=speed)


@frow('15-5', 'Damping force')
def _(tex):
    m, F, b = 0.5, 2.0, 0.8
    s = path(lambda t, r, v: ((F - b * v[0]) / m,), (0.0,), (0.0,), 20.0, dt=1e-3)
    vt = s[-1][2][0]
    holds('at terminal speed the drag balances a 2.0 N push', tex, 1e-6, F_d=-F, b=b, v=vt)


@frow('15-5', 'Damped oscillation')
def _(tex):
    m, k, b, xm, ph = 0.5, 50.0, 0.4, 0.2, 0.4
    g, wp = b / (2 * m), sqrt(k / m - b * b / (4 * m * m))
    t, r, v = state_at(spring(k, m, b), (xm * cos(ph),), (xm * (-g * cos(ph) - wp * sin(ph)),), 1.7, dt=1e-4)
    peaks = peaks_of(path(spring(k, m, b), (1.0,), (0.0,), 6.0, dt=1e-4))
    holds('RK4', tex, swap={'x(t)': 'x_t', "\\omega'": 'omega_p'}, x_t=r[0], x_m=xm, e=E, b=b, t=t, m=m,
          omega_p=2 * pi * (len(peaks) - 1) / (peaks[-1][0] - peaks[0][0]), phi=ph)


@frow('15-5', 'Damped angular frequency')
def _(tex):
    m, k, b = 0.5, 50.0, 2.0
    peaks = peaks_of(path(spring(k, m, b), (1.0,), (0.0,), 6.0, dt=1e-4))
    holds('RK4: from the time between peaks', tex, 1e-6, swap={"\\omega'": 'omega_p'}, omega_p=2 * pi * (len(peaks) - 1) / (peaks[-1][0] - peaks[0][0]), k=k, m=m, b=b)


@frow('15-5', 'Energy of a damped oscillator')
def _(tex):
    m, k, b, xm = 0.5, 50.0, 0.1, 0.2
    peaks = peaks_of(path(spring(k, m, b), (xm,), (0.0,), 8.0, dt=1e-4))
    t, x = peaks[-1]  # at a peak the energy is all in the spring
    holds('RK4, at a peak', tex, swap={'E(t)': 'E_t'}, E_t=0.5 * k * x * x, k=k, x_m=xm, e=E, b=b, t=t, m=m)


@frow('15-6', 'Resonance')
def _(tex):
    m, k, b = 0.40, 160.0, 1.0

    def vamp(wd):  # the settled speed amplitude
        s = path(spring(k, m, b, lambda t: cos(wd * t)), (0.0,), (0.0,), 14.0, dt=2e-3)
        return max(abs(v[0]) for t, _, v in s if t > 11)
    lo, hi = 18.0, 22.0
    for _ in range(26):
        a, c = hi - 0.618 * (hi - lo), lo + 0.618 * (hi - lo)
        if vamp(a) > vamp(c):
            hi = c
        else:
            lo = a
    holds('the driving frequency with the largest settled speed (RK4)', tex, 2e-3, omega_d=(lo + hi) / 2, omega=sqrt(k / m))


@frow('15-6', 'Driven oscillation')
def _(tex):
    m, k, b, wd = 0.40, 160.0, 1.0, 12.0
    s = path(spring(k, m, b, lambda t: cos(wd * t)), (0.0,), (0.0,), 16.0, dt=1e-3)
    tail = [(t, r[0]) for t, r, _ in s if t > 12]
    xm = max(abs(x) for _, x in tail)
    tpk = max(tail, key=lambda p: p[1])[0]
    t, x = tail[-1]
    holds('RK4, settled: amplitude and phase read off a peak', tex, 2e-3, swap={'x(t)': 'x_t'}, x_t=x, x_m=xm, omega_d=wd, t=t, phi=-wd * tpk)


@frow('c15+', 'Greatest speed from k and m')
def _(tex):
    _, r, v = run(spring(K15, M15), (XM,), (0.0,), lambda t, r, v: r[0], dt=1e-4)
    holds('RK4 speed through x = 0', tex, v_m=abs(v[0]), x_m=XM, k=K15, m=M15)


@frow('c15+', 'Share of the energy')
def _(tex):
    t, r, v = shm_state(0.4)
    En = 0.5 * K15 * r[0] ** 2 + 0.5 * M15 * v[0] ** 2
    holds('RK4', tex, U=0.5 * K15 * r[0] ** 2, E=En, x=r[0], x_m=sqrt(2 * En / K15))


@frow('c15+', 'Halving times with damping')
def _(tex):
    m, k, b = 0.25, 100.0, 0.050
    pk = peaks_of(path(spring(k, m, b), (1.0,), (0.0,), 12.0, dt=2e-4))
    gamma = -log(pk[-1][1] / pk[0][1]) / (pk[-1][0] - pk[0][0])
    holds('RK4 peaks', tex, 1e-4, t_amp=LN2 / gamma, m=m, b=b, t_E=LN2 / (2 * gamma))


@frow('c15+', 'Pendulum length for a period')
def _(tex):
    L = 0.993
    holds('RK4 period of a 0.993 m pendulum', tex, 1e-4, L=L, g=G, T=2 * half_period(lambda t, r, v: (-G / L * sin(r[0]),), 0.01))


@frow('c15+', 'Hanging spring')
def _(tex):
    m, k = 0.3, 12.0
    s = path(lambda t, r, v: (-G - k * r[0] / m,), (0.0,), (0.0,), 4.0, dt=1e-4)  # released at the spring's free end
    lowest = min(r[0] for _, r, _ in s)
    holds('the middle of the RK4 swing', tex, Delta_y=-lowest / 2, m=m, g=G, k=k)


@frow('c15+', 'Springs side by side and end to end')
def _(tex):
    k1, k2, F, x = 30.0, 60.0, 6.0, 0.05
    holds('forces added (same stretch), stretches added (same force)', tex, k_par=(k1 * x + k2 * x) / x, k_1=k1, k_2=k2, k_ser=F / (F / k1 + F / k2))


# ---------- Chapter 16 ----------
YM, KW, WW = 0.012, 3.0, 15.0  # a wave with amplitude 1.2 cm, k = 3.0 rad/m, omega = 15 rad/s (v = 5.0 m/s)
shape = lambda x: YM * sin(KW * x)  # the string at t = 0; the wave is this shape moving at v = omega/k
wave = lambda x, t: shape(x - WW / KW * t)


@frow('16-1', 'Sinusoidal wave')
def _(tex):
    holds('the shape at t = 0, moved along by vt', tex, swap={'y(x,t)': 'y_xt'}, y_xt=wave(0.7, 0.3), y_m=YM, k=KW, x=0.7, omega=WW, t=0.3)


@frow('16-1', 'Angular wave number')
def _(tex):
    c = [bisect(lambda x: YM * KW * cos(KW * x), a, a + 1.0) for a in (0.1, 2.2)]  # two neighbouring crests
    holds('crest to crest', tex, 1e-6, k=KW, lambda_=c[1] - c[0])


@frow('16-1', 'Angular frequency')
def _(tex):
    ups = [i / 1e5 for i in range(1, 200000) if wave(0.4, (i - 1) / 1e5) < 0 <= wave(0.4, i / 1e5)]
    T = (ups[-1] - ups[0]) / (len(ups) - 1)
    holds('the period at one point', tex, 1e-4, omega=WW, T=T, f=1 / T)


@frow('16-1', 'Wave speed')
def _(tex):
    c0 = bisect(lambda x: (wave(x + 1e-6, 0) - wave(x - 1e-6, 0)), 0.1, 1.0)
    c1 = bisect(lambda x: (wave(x + 1e-6, 0.05) - wave(x - 1e-6, 0.05)), 0.1, 1.0)
    lam = 2 * pi / KW
    holds('a crest followed for 0.05 s', tex, 1e-5, v=(c1 - c0) / 0.05, omega=WW, k=KW, T=2 * pi / WW, f=WW / (2 * pi), lambda_=lam)


@frow('16-1', 'Transverse velocity')
def _(tex):
    x, t = 0.3, 0.2
    holds('dy/dt at one point', tex, 1e-6, u=(wave(x, t + 1e-6) - wave(x, t - 1e-6)) / 2e-6, omega=WW, y_m=YM, k=KW, x=x, t=t)


@frow('16-2', 'Wave speed on a string')
def _(tex):
    L, tau, mu = 1.5, 40.0, 0.010
    holds('a chain of 400 beads: v = 2 L f1', tex, 1e-4, v=2 * L * chain_frequency(L, tau, mu), tau=tau, mu=mu)


@frow('16-2', 'Linear density')
def _(tex):
    beads, mb, L = 400, 0.5e-4, 2.0  # 400 beads of 0.05 g on 2.0 m
    holds('beads per length', tex, mu=beads * mb / L, m=beads * mb, L=L)


def string_power(mu, v, w, ym):
    """the average of -tau (dy/dx)(dy/dt) at one point: the power the left part of the string passes on"""
    tau, k = mu * v * v, w / v
    y = lambda x, t: ym * sin(k * x - w * t)
    yx = lambda t: (y(1e-6, t) - y(-1e-6, t)) / 2e-6
    yt = lambda t: (y(0, t + 1e-7) - y(0, t - 1e-7)) / 2e-7
    T = 2 * pi / w
    return integrate(lambda t: -tau * yx(t) * yt(t), 0, T, 2000) / T


@frow('16-3', 'Average power')
def _(tex):
    mu, v, w, ym = 0.020, 30.0, 40.0, 0.015
    holds('-tau y_x y_t averaged over a period', tex, 1e-5, P_avg=string_power(mu, v, w, ym), mu=mu, v=v, omega=w, y_m=ym)


def wave_eq_ratio(f, x, t, h=1e-3):
    fxx = (f(x + h, t) - 2 * f(x, t) + f(x - h, t)) / h ** 2
    ftt = (f(x, t + h) - 2 * f(x, t) + f(x, t - h)) / h ** 2
    return ftt / fxx


@frow('16-4', 'The wave equation')
def _(tex):
    check_true('the row is the wave equation', tex.replace(' ', '') == '\\frac{\\partial^2y}{\\partial x^2}=\\frac{1}{v^2}\\frac{\\partial^2y}{\\partial t^2}'.replace(' ', ''))
    k, w = 2.0, 7.0
    for name, h in (('a sine', sin), ('a bump', lambda u: exp(-u * u)), ('a kink-free step', math.atan)):
        check(f'{name} moving at w/k: y_tt / y_xx = v^2', wave_eq_ratio(lambda x, t: h(k * x - w * t), 0.31, 0.07), (w / k) ** 2, 1e-4)


@frow('16-4', 'Any travelling shape')
def _(tex):
    k, w, h = 2.0, 7.0, (lambda u: 1 / (1 + u * u))
    for sgn in (1, -1):
        check(f'h(kx {"-" if sgn > 0 else "+"} wt) solves it with v = w/k', wave_eq_ratio(lambda x, t: h(k * x - sgn * w * t), 0.2, 0.1), (w / k) ** 2, 1e-4)
    peak = lambda t: bisect(lambda x: -2 * (k * x - w * t), -5, 5)  # the top of the bump, where its slope is zero
    check('the bump moves at w/k', (peak(0.3) - peak(0.0)) / 0.3, w / k)
    check_true('the row says v = w/k', 'v=\\frac{\\omega}{k}' in tex)


@frow('16-5', 'Superposition')
def _(tex):
    y1 = lambda x, t: 0.01 * sin(2.0 * x - 6.0 * t)
    y2 = lambda x, t: exp(-(2.0 * x + 6.0 * t - 1) ** 2)
    check('the sum of two solutions solves the wave equation too', wave_eq_ratio(lambda x, t: y1(x, t) + y2(x, t), 0.3, 0.05), 9.0, 1e-4)
    check_true('the row adds the two waves', "y'(x,t)=y_1(x,t)+y_2(x,t)" in tex)


@frow('16-5', 'Two equal waves')
def _(tex):
    ym, k, w, ph, x, t = 0.02, 3.0, 9.0, 1.1, 0.4, 0.25
    total = ym * sin(k * x - w * t) + ym * sin(k * x - w * t + ph)
    holds('the two waves added', brackets(tex), swap={"y'": 'y_res'}, y_res=total, y_m=ym, phi=ph, k=k, x=x, omega=w, t=t)


@frow('16-5', 'Resultant amplitude')
def _(tex):
    for ph in (0.0, 1.1, pi, 4.0):
        holds(f'largest of the sum, phi = {ph:.2f}', tex, 1e-6, swap={"y_m'": 'y_res'}, y_res=amplitude(lambda t: 0.02 * sin(-t) + 0.02 * sin(-t + ph), 0, 2 * pi), y_m=0.02, phi=ph)


@frow('16-5', 'Phase from a shift')
def _(tex):
    k, w, dx = 3.0, 9.0, 0.35  # the second wave is the first moved back by dx: it arrives dx/v later
    lag = dx / (w / k)  # the same crest reaches a point dx later, at the wave speed
    holds('the time lag times omega', tex, phi=w * lag, Delta_x=dx, lambda_=2 * pi / k)


@frow('16-6', 'Adding phasors')
def _(tex):
    a, b, ph = 2.0, 5.0, 1.1
    holds('largest of the sum', tex, 1e-6, swap={"y_m'": 'y_res'}, y_res=amplitude(lambda t: a * sin(t) + b * sin(t + ph), 0, 2 * pi), y_m1=a, y_m2=b, phi=ph)


@frow('16-6', 'Phase of the resultant')
def _(tex):
    a, b, ph = 2.0, 5.0, 1.1
    f = lambda t: a * sin(t) + b * sin(t + ph)
    tpk = bisect(lambda t: (f(t + 1e-7) - f(t - 1e-7)), 0.0, pi / 2)  # the sum's peak comes beta before the first wave's
    holds('the lead of the sum over the first wave', tex, 1e-6, beta=pi / 2 - tpk, y_m1=a, y_m2=b, phi=ph)


@frow('16-7', 'Standing wave')
def _(tex):
    ym, k, w, x, t = 0.02, 3.0, 9.0, 0.4, 0.25
    holds('two waves running opposite ways, added', brackets(tex), swap={"y'": 'y_res'}, y_res=ym * sin(k * x - w * t) + ym * sin(k * x + w * t), y_m=ym, k=k, x=x, omega=w, t=t)


@frow('16-7', 'Nodes')
def _(tex):
    k = 3.0
    lam = 2 * pi / k
    amp = lambda x: amplitude(lambda t: 0.02 * sin(k * x - t) + 0.02 * sin(k * x + t), 0, 2 * pi, 200)
    for n in range(3):
        check(f'no motion at n = {n}', amp(n * lam / 2), 0.0, 1e-9)
    check_true('and motion just beside one', amp(lam / 2 + 0.01) > 1e-4)


@frow('16-7', 'Antinodes')
def _(tex):
    k = 3.0
    lam = 2 * pi / k
    amp = lambda x: amplitude(lambda t: 0.02 * sin(k * x - t) + 0.02 * sin(k * x + t), 0, 2 * pi, 200)
    for n in range(3):
        x = bisect(lambda x: amp(x + 1e-6) - amp(x - 1e-6), n * lam / 2 + 0.05, (n + 1) * lam / 2 - 0.05, 60)
        check(f'largest motion at n = {n}', x, (n + 0.5) * lam / 2, 1e-5)


@frow('16-7', 'String fixed at both ends')
def _(tex):
    L, tau, mu = 0.6, 30.0, 0.0050
    v = sqrt(tau / mu)
    for n in (1, 2, 3):
        holds(f'a chain of beads, mode {n}', tex, 1e-4, eqs=[0], f=chain_frequency(L, tau, mu, mode=n), n=n, v=v, L=L)


@frow('16-7', 'Resonant wavelengths')
def _(tex):
    L, tau, mu = 0.6, 30.0, 0.0050
    for n in (1, 3):
        holds(f'v / f of mode {n} on a chain of beads', tex, 1e-4, L=L, n=n, lambda_=sqrt(tau / mu) / chain_frequency(L, tau, mu, mode=n))


@frow('c16+', 'Fundamental from the tension')
def _(tex):
    L, tau, mu = 0.6, 30.0, 0.0050
    holds('a chain of beads', tex, 1e-4, f_1=chain_frequency(L, tau, mu), L=L, tau=tau, mu=mu)


@frow('c16+', 'Wavelength from the string')
def _(tex):
    L, tau, mu, f = 1.5, 40.0, 0.010, 90.0
    v = 2 * L * chain_frequency(L, tau, mu)
    holds('the speed from a chain of beads', tex, 1e-4, f=f, tau=tau, mu=mu, lambda_=v / f)


@frow('c16+', 'Power ratio')
def _(tex):
    P1, P2 = string_power(0.02, 30.0, 40.0, 0.015), string_power(0.02, 30.0, 70.0, 0.006)
    holds('-tau y_x y_t averaged, two waves', tex, 1e-5, P_2=P2, P_1=P1, y_m2=0.006, y_m1=0.015, omega_2=70.0, omega_1=40.0)


@frow('c16+', 'Greatest transverse speed')
def _(tex):
    holds('largest dy/dt', tex, 1e-6, u_max=amplitude(lambda t: (wave(0.3, t + 1e-7) - wave(0.3, t - 1e-7)) / 2e-7, 0, 1), omega=WW, y_m=YM)


# ---------- Chapter 17 ----------
@frow('17-1', 'Speed of sound')
def _(tex):
    holds('air at 20 C: B = 1.4 x 101325 Pa (adiabatic), rho = 1.204 kg/m^3, measured 343.2 m/s', tex, 2e-3, v=343.2, B=1.4 * 101325, rho=1.204)


@frow('17-1', 'Bulk modulus')
def _(tex):
    p, V, dV = 1.0e5, 2.0e-3, -1e-9  # an ideal gas squeezed slowly at constant temperature: B = p
    dp = p * V / (V + dV) - p
    holds('an ideal gas squeezed at constant T', tex, 1e-6, B=p, Delta_p=dp, Delta_V=dV, V=V)


@frow('17-1', 'Wavelength')
def _(tex):
    v, f = 343.0, 440.0
    k = 2 * pi * f / v
    c = [bisect(lambda x: -sin(k * x), a, a + pi / k) for a in (0.1, 0.1 + 2 * pi / k)]  # neighbouring crests of cos(kx)
    holds('crest to crest', tex, 1e-6, v=v, f=f, lambda_=c[1] - c[0])


@frow('17-2', 'Displacement wave')
def _(tex):
    sm, k, w, x, t = 2e-6, 18.0, 6000.0, 0.21, 0.004
    holds('the shape moved along by vt', tex, swap={'s(x,t)': 's_xt'}, s_xt=sm * cos(k * (x - w / k * t)), s_m=sm, k=k, x=x, omega=w, t=t)


@frow('17-2', 'Pressure wave')
def _(tex):
    sm, v, rho, w, x, t = 2e-6, 340.0, 1.20, 6000.0, 0.21, 0.004
    k = w / v
    s = lambda x: sm * cos(k * x - w * t)
    holds('dp = -B ds/dx with B = rho v^2', tex, 1e-5, swap={'\\Delta p(x,t)': 'dp_xt'}, dp_xt=-rho * v * v * (s(x + 1e-7) - s(x - 1e-7)) / 2e-7,
          Delta_p_m=v * rho * w * sm, k=k, x=x, omega=w, t=t)


@frow('17-2', 'Pressure amplitude')
def _(tex):
    sm, v, rho, w = 2e-6, 340.0, 1.20, 6000.0
    k = w / v
    s = lambda x: sm * cos(k * x)
    holds('largest -B ds/dx', tex, 1e-5, Delta_p_m=amplitude(lambda x: -rho * v * v * (s(x + 1e-7) - s(x - 1e-7)) / 2e-7, 0, 2 * pi / k),
          v=v, rho=rho, omega=w, s_m=sm)


@frow('17-3', 'Phase from path difference')
def _(tex):
    v, f, dL = 343.0, 500.0, 0.25
    holds('the later arrival, as a phase', tex, phi=2 * pi * f * dL / v, Delta_L=dL, lambda_=v / f)


def two_paths(dL, lam):
    return amplitude(lambda t: sin(-t) + sin(2 * pi * dL / lam - t), 0, 2 * pi)


@frow('17-3', 'Fully constructive')
def _(tex):
    for m in range(4):
        check(f'path difference {m} wavelengths: amplitude 2', two_paths(m * 0.7, 0.7), 2.0)


@frow('17-3', 'Fully destructive')
def _(tex):
    for m in range(4):
        check(f'path difference {m} and a half wavelengths: amplitude 0', two_paths((m + 0.5) * 0.7, 0.7), 0.0)


@frow('17-4', 'Intensity')
def _(tex):
    P, r = 2.0, 3.0
    A = integrate(lambda th: 2 * pi * r * r * sin(th), 0, pi, 2000)  # a sphere, ring by ring
    holds('power spread over a sphere', tex, 1e-6, I=P / (4 * pi * r * r), P=P, A=A)


@frow('17-4', 'Intensity of a sound wave')
def _(tex):
    sm, v, rho, w = 2e-6, 340.0, 1.20, 6000.0
    k = w / v
    s = lambda x, t: sm * cos(k * x - w * t)
    dp = lambda t: -rho * v * v * (s(1e-7, t) - s(-1e-7, t)) / 2e-7
    u = lambda t: (s(0, t + 1e-9) - s(0, t - 1e-9)) / 2e-9
    T = 2 * pi / w
    holds('the average of pressure times velocity', tex, 1e-5, I=integrate(lambda t: dp(t) * u(t), 0, T, 2000) / T, rho=rho, v=v, omega=w, s_m=sm)


@frow('17-4', 'Point source')
def _(tex):
    Ps, r = 2.0, 3.0
    A = integrate(lambda th: 2 * pi * r * r * sin(th), 0, pi, 2000)
    holds('the power through a sphere', tex, 1e-6, I=Ps / A, P_s=Ps, r=r)


@frow('17-4', 'Sound level')
def _(tex):
    holds('a millionth of a watt per square metre is 60 dB', tex, beta=60, dB=1, I=1e-6, I_0=1e-12)


@frow('17-4', 'Change of level')
def _(tex):
    holds('from 60 dB to 85 dB', tex, beta_2=85, beta_1=60, dB=1, I_2=10 ** (85 / 10) * 1e-12, I_1=1e-6)


def pipe_resonances(L, v, closed, n):
    cond = (lambda f: cos(2 * pi * f / v * L)) if closed else (lambda f: sin(2 * pi * f / v * L))
    out, f = [], 1.0
    while len(out) < n:
        if (cond(f) > 0) != (cond(f + 1) > 0):
            out.append(bisect(cond, f, f + 1))
        f += 1
    return out


@frow('17-5', 'Pipe open at both ends')
def _(tex):
    for n, f in enumerate(pipe_resonances(0.7, 343.0, False, 3), 1):
        holds(f'resonance {n} from the end conditions', tex, eqs=[0], f=f, n=n, v=343.0, L=0.7)


@frow('17-5', 'Pipe closed at one end')
def _(tex):
    for n, f in zip((1, 3, 5), pipe_resonances(0.7, 343.0, True, 3)):
        holds(f'resonance n = {n} from the end conditions', tex, eqs=[0], f=f, n=n, v=343.0, L=0.7)


@frow('17-5', 'Wavelengths in pipes')
def _(tex):
    L, v = 0.7, 343.0
    holds('the third harmonics', tex, lambda_open=v / pipe_resonances(L, v, False, 3)[2], lambda_closed=v / pipe_resonances(L, v, True, 2)[1], L=L, n=3)


@frow('17-6', 'Beat frequency')
def _(tex):
    w = lambda t: cos(2 * pi * 304 * t) + cos(2 * pi * 300 * t)
    env = [amplitude(w, 0.05 + i / 100, 0.05 + (i + 1) / 100, 40) for i in range(1000)]  # windows longer than a cycle
    swells = sum(1 for a, b, c in zip(env, env[1:], env[2:]) if a < b >= c and b > 1.5)
    holds('swells counted over 10 s', tex, f_beat=swells / 10, f_1=304, f_2=300)


@frow('17-6', 'Pitch heard')
def _(tex):
    w = lambda t: cos(2 * pi * 304 * t) + cos(2 * pi * 300 * t)
    zc = [i / 1e6 for i in range(1, 120000) if w((i - 1) / 1e6) < 0 <= w(i / 1e6)]
    holds('upward zero crossings', tex, 1e-3, f=(len(zc) - 1) / (zc[-1] - zc[0]), f_1=304, f_2=300)


def doppler_cases(tex, both=True):
    f, v, vs, vd = 600.0, 340.0, 25.0, 15.0
    cases = [('toward each other', '+', '-', arrivals(f, v, lambda t: -400 + vs * t, lambda t: 300 - vd * t)),
             ('away from each other', '-', '+', arrivals(f, v, lambda t: -1 - vs * t, lambda t: 1 + vd * t))]
    return f, v, vs, vd, cases


@frow('17-7', 'Doppler effect')
def _(tex):
    f, v, vs, vd, cases = doppler_cases(tex)
    for what, top, bottom, got in cases:
        holds(f'crests timed, both moving, {what}', tex.replace('\\pm', top).replace('\\mp', bottom), 1e-9, swap={"f'": 'f_p'}, f_p=got, f=f, v=v, v_D=vd, v_S=vs)


@frow('17-7', 'Moving source')
def _(tex):
    f, v, vs = 600.0, 340.0, 25.0
    for what, sign, got in (('toward', '-', arrivals(f, v, lambda t: -400 + vs * t, lambda t: 0.0)),
                            ('away', '+', arrivals(f, v, lambda t: -1 - vs * t, lambda t: 0.0))):
        holds(f'crests timed, source {what}', tex.replace('\\mp', sign), 1e-9, swap={"f'": 'f_p'}, f_p=got, f=f, v=v, v_S=vs)


@frow('17-7', 'Moving detector')
def _(tex):
    f, v, vd = 600.0, 340.0, 15.0
    for what, sign, got in (('toward', '+', arrivals(f, v, lambda t: 0.0, lambda t: 300 - vd * t)),
                            ('away', '-', arrivals(f, v, lambda t: 0.0, lambda t: 1 + vd * t))):
        holds(f'crests timed, detector {what}', tex.replace('\\pm', sign), 1e-9, swap={"f'": 'f_p'}, f_p=got, f=f, v=v, v_D=vd)


def boom(vS, h, v=340.0):
    """a jet flying level at height h passes over an observer at t = 0: the time its first sound arrives, and where
    the jet is then"""
    arrive = lambda te: te + sqrt((vS * te) ** 2 + h * h) / v
    lo, hi = -1e3, 1e3
    for _ in range(300):
        a, c = lo + (hi - lo) / 3, hi - (hi - lo) / 3
        if arrive(a) < arrive(c):
            hi = c
        else:
            lo = a
    tb = arrive((lo + hi) / 2)
    return tb, vS * tb


@frow('17-8', 'Mach cone')
def _(tex):
    vS, h = 550.0, 3000.0
    tb, d = boom(vS, h)
    holds('the cone edge reaching the ground: tan(theta) = h/d', tex, 1e-6, theta=atan2(h, d), v=340.0, v_S=vS)


@frow('17-8', 'Mach number')
def _(tex):
    holds('680 m/s in 340 m/s air', tex, Mach_number=2.0, v_S=680.0, v=340.0)


@frow('c17+', 'Level and distance')
def _(tex):
    I = lambda r: 0.5 / (4 * pi * r * r)
    b = lambda r: 10 * log10(I(r) / 1e-12)
    holds('levels from the point-source intensities', tex, beta_2=b(40.0), beta_1=b(10.0), dB=1, r_2=40.0, r_1=10.0)


@frow('c17+', 'Two equal sources')
def _(tex):
    holds('twice the intensity', tex, 1e-6, Delta_beta=10 * log10(2 * 3e-5 / 1e-12) - 10 * log10(3e-5 / 1e-12), dB=1)


@frow('c17+', 'Where a boom is heard')
def _(tex):
    vS, h = 680.0, 5000.0
    tb, d = boom(vS, h)
    holds('the first sound to arrive', tex, 1e-6, d=d, h=h, theta=asin(340.0 / vS))


# ---------- Chapter 18 ----------
@frow('18-1', 'Triple point of water')
def _(tex):
    check('the Kelvin scale puts the triple point at 273.16 K (0.01 C)', 273.15 + 0.01, num(tex.split('=')[1].split('\\ ')[0]))


@frow('18-1', 'Gas thermometer')
def _(tex):
    n, V = 0.05, 1.0e-3
    p = lambda T: n * R_GAS * T / V
    holds('an ideal gas at fixed volume', tex, T=350.0, K=1, p=p(350.0), p_3=p(273.16))


@frow('18-2', 'Celsius')
def _(tex):
    holds('water: 0.01 C at its triple point, 273.16 K', tex.replace('^\\circ', ''), T_C=0.01, T=273.16)


@frow('18-2', 'Fahrenheit')
def _(tex):
    for c, fval in ((0, 32), (100, 212), (37, 98.6)):
        holds(f'{c} C is {fval} F', tex.replace('^\\circ', ''), T_F=fval, T_C=c)


@frow('18-2', 'Sizes of degrees')
def _(tex):
    check('Fahrenheit degrees between freezing and boiling, per Celsius degree', (212 - 32) / (100 - 0), 1.8)
    check('kelvins and Celsius degrees: the same step', (373.15 - 273.15) / (100 - 0), 1.0)
    check_true('the row says 1.8', '1.8' in tex)


@frow('18-3', 'Linear expansion')
def _(tex):
    L, a, dT = 20.0, 1.2e-5, 40.0
    grown = L * exp(a * dT)  # each kelvin adds the fraction alpha of the current length
    holds('growing a little each kelvin', tex, 1e-3, Delta_L=grown - L, L=L, alpha=a, Delta_T=dT)


@frow('18-3', 'Volume expansion')
def _(tex):
    V, a, dT = 1.0e-3, 2.3e-5, 100.0
    holds('a cube, each side grown', tex, 3e-3, Delta_V=V * ((1 + a * dT) ** 3 - 1), V=V, beta=3 * a, Delta_T=dT)


@frow('18-3', 'Solids')
def _(tex):
    a = 2.3e-5
    holds('dV/V per kelvin for a cube', tex, 1e-6, beta=((1 + a * 1e-3) ** 3 - 1) / 1e-3, alpha=a)


@frow('18-4', 'Heat and temperature change')
def _(tex):
    holds('the calorie: 1 g of water by 1 K', tex, Q=4.186, c=4186, m=1e-3, Delta_T=1.0)


@frow('18-4', 'Heat capacity')
def _(tex):
    holds('2.0 kg of water', tex, Q=4186 * 2.0 * 5.0, C=4186 * 2.0, Delta_T=5.0, c=4186, m=2.0)


@frow('18-4', 'Change of phase')
def _(tex):
    holds('melting 0.50 kg of ice', tex, Q=333e3 * 0.50, L=333e3, m=0.50)


@frow('18-5', 'Work done by a gas')
def _(tex):
    corners = [(1.0e-3, 3.0e5), (3.0e-3, 3.0e5), (3.0e-3, 1.0e5), (1.0e-3, 1.0e5)]
    shoelace = abs(sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(corners, corners[1:] + corners[:1]))) / 2
    W = sum(integrate(lambda V, p0=a[1], p1=b[1], V0=a[0], V1=b[0]: p0 + (p1 - p0) * ((V - V0) / (V1 - V0) if V1 != V0 else 0), a[0], b[0], 200)
            for a, b in zip(corners, corners[1:] + corners[:1]) if a[0] != b[0])
    check('the integral of p dV round the rectangle = its area (shoelace)', W, shoelace)
    _, Wiso, _ = gas_path(1.0, 1.5 * R_GAS, 300, 1.0, 2.0, adiabatic=False)
    check('isothermal: the integral of p dV, step by step = nRT ln2', Wiso, R_GAS * 300 * LN2, 1e-6)
    check_true('the row integrates p dV', 'p\\,dV' in tex)


@frow('18-5', 'First law of thermodynamics')
def _(tex):
    n, T0, dT = 1.0, 300.0, 40.0  # a monatomic ideal gas warmed at constant pressure
    Eint = lambda T: n * N_A * 0.5 * (0.004 / N_A) * 3 * R_GAS * T / 0.004  # N times the average (1/2) m v^2, with m v_rms^2 = 3kT
    p = 1.0e5
    W = integrate(lambda V: p, n * R_GAS * T0 / p, n * R_GAS * (T0 + dT) / p, 200)
    Q = n * 2.5 * R_GAS * dT
    holds('warming at constant pressure', tex, Delta_E_int=Eint(T0 + dT) - Eint(T0), Q=Q, W=W)


@frow('18-5', 'Constant pressure')
def _(tex):
    p, V0, V1 = 2.0e5, 1.0e-3, 2.5e-3
    holds('the integral of p dV', tex, W=integrate(lambda V: p, V0, V1, 200), p=p, Delta_V=V1 - V0)


@frow('18-5', 'Adiabatic')
def _(tex):
    T1, W, Q = gas_path(1.0, 1.5 * R_GAS, 400, 1.0, 3.0)
    holds('a slow adiabatic expansion, step by step', tex, 1e-6, Q=Q, Delta_E_int=1.5 * R_GAS * (T1 - 400), W=W)


@frow('18-5', 'Constant volume')
def _(tex):
    W = integrate(lambda V: 1e5, 1e-3, 1e-3, 10)
    holds('warming at fixed volume: no p dV', tex, W=W, Delta_E_int=1.5 * R_GAS * 20, Q=1.5 * R_GAS * 20)


@frow('18-5', 'Closed cycle')
def _(tex):
    QH, QL, W = carnot(500, 300)
    holds('round a Carnot cycle (the gas ends where it began)', tex, 1e-6, Delta_E_int=0.0, Q=QH - QL, W=W)


@frow('18-5', 'Free expansion')
def _(tex):
    holds('into a vacuum: nothing pushed, insulated', tex, Q=0.0, W=0.0, Delta_E_int=0.0)


@frow('18-6', 'Conduction')
def _(tex):
    L, k, A = 0.05, 0.8, 2.0
    holds('steady temperatures relaxed node by node', tex, 1e-6, P_cond=slab_flux([(L, k)], 300, 280, A=A, n=20, sweeps=4000), k=k, A=A, T_H=300, T_C=280, L=L)


@frow('18-6', 'Thermal resistance')
def _(tex):
    L, k = 0.05, 0.8
    holds('1 m^2: temperature difference over heat flow', tex, 1e-6, R=(300 - 280) / slab_flux([(L, k)], 300, 280, n=20, sweeps=4000), L=L, k=k)


@frow('18-6', 'Two slabs in series')
def _(tex):
    A = 1.5
    holds('two slabs, relaxed node by node', tex, 1e-6, P_cond=slab_flux([(0.02, 0.4), (0.10, 2.0)], 310, 270, A=A, n=20, sweeps=20000),
          A=A, T_H=310, T_C=270, L_1=0.02, k_1=0.4, L_2=0.10, k_2=2.0)


@frow('18-6', 'Radiation')
def _(tex):
    Rs, Ts, Ls = 6.957e8, 5772, 3.828e26  # the Sun: radius, effective temperature, power (IAU 2015)
    holds('the Sun as a blackbody', tex, 2e-3, P_rad=Ls, sigma=5.670374e-8, varepsilon=1.0, A=4 * pi * Rs * Rs, T=Ts)


@frow('18-6', 'Net radiation')
def _(tex):
    s, eps, A, T, Te = 5.67e-8, 0.9, 1.5, 310.0, 293.0
    absorbed, emitted = s * eps * A * Te ** 4, s * eps * A * T ** 4
    holds('absorbed minus emitted', tex, P_net=absorbed - emitted, sigma=s, varepsilon=eps, A=A, T_env=Te, T=T)


@frow('c18+', 'Mixing water')
def _(tex):
    m1, T1, m2, T2 = 0.20, 80.0, 0.30, 20.0
    holds('sum of Q = 0, by bisection', tex, T_f=bisect(lambda T: m1 * 4186 * (T - T1) + m2 * 4186 * (T - T2), T2, T1), m_1=m1, T_1=T1, m_2=m2, T_2=T2)


@frow('c18+', 'Area expansion')
def _(tex):
    A, a, dT = 0.5, 1.2e-5, 60.0
    holds('a square, each side grown', tex, 2e-3, Delta_A=A * ((1 + a * dT) ** 2 - 1), alpha=a, A=A, Delta_T=dT)


@frow('c18+', 'Degrees Fahrenheit in a change')
def _(tex):
    F = lambda c: 9 / 5 * c + 32
    holds('from 15 C to 40 C', tex, Delta_T_F=F(40) - F(15), Delta_T_C=25)


# ---------- Chapter 19 ----------
@frow('19-1', 'Moles')
def _(tex):
    holds('36 g of water', tex, n=2.0, N=2.0 * 6.02214076e23, N_A=6.02214076e23, M_sam=0.036, M=0.018)


@frow('19-1', 'Molar mass')
def _(tex):
    m = (2 * 1.008 + 15.999) * 1.66053906660e-27  # one water molecule, from the atomic masses
    holds('water', tex, 1e-4, M=0.018015, m=m, N_A=6.02214076e23)


@frow('19-2', 'Ideal gas law')
def _(tex):
    holds('1 mol at 0 C and 1 atm fills 22.414 L', tex, 1e-4, p=101325, V=22.414e-3, n=1.0, R=8.314462618, T=273.15)


@frow('19-2', 'In molecules')
def _(tex):
    holds('the same, counted in molecules', tex, 1e-4, p=101325, V=22.414e-3, N=6.02214076e23, k=1.380649e-23, T=273.15)


@frow('19-2', 'Boltzmann constant')
def _(tex):
    holds('CODATA', tex, 1e-9, k=1.380649e-23, R=8.314462618, N_A=6.02214076e23)


@frow('19-2', 'Fixed amount of gas')
def _(tex):
    n = 0.4
    holds('two states of 0.4 mol', tex, p_1=n * R_GAS * 300 / 1e-2, V_1=1e-2, T_1=300, p_2=n * R_GAS * 450 / 3e-2, V_2=3e-2, T_2=450)


@frow('19-2', 'Isothermal work')
def _(tex):
    holds('the integral of nRT/V dV', tex, 1e-6, W=integrate(lambda V: 2.0 * R_GAS * 300 / V, 0.010, 0.025), n=2.0, R=R_GAS, T=300, V_f=0.025, V_i=0.010)


@frow('19-2', 'Work at constant pressure')
def _(tex):
    n, p, T0, T1 = 1.5, 2.0e5, 300.0, 380.0
    V0, V1 = n * R_GAS * T0 / p, n * R_GAS * T1 / p
    holds('the integral of p dV', tex, 1e-6, W=integrate(lambda V: p, V0, V1, 200), p=p, Delta_V=V1 - V0, n=n, R=R_GAS, Delta_T=T1 - T0)


def wall_pressure(speeds, m, Lbox):
    """molecules bouncing in a cube of side Lbox: each pushes on a wall with an average force m v_x^2 / Lbox"""
    return sum(m * vx * vx / Lbox for vx, vy, vz in speeds) / Lbox ** 2


ISO = [p for a, b, c in ((300.0, 120.0, 40.0), (510.0, 60.0, 250.0), (90.0, 700.0, 330.0)) for p in itertools.permutations((a, b, c))]


@frow('19-3', 'Pressure from molecules')
def _(tex):
    M, Lbox = 0.028, 0.1
    m = M / N_A
    N = len(ISO)
    holds('collisions with a wall, every direction alike', tex, 1e-9, p=wall_pressure(ISO, m, Lbox), n=N / N_A, M=M,
          v_rms=sqrt(sum(a * a + b * b + c * c for a, b, c in ISO) / N), V=Lbox ** 3)


@frow('19-3', 'rms speed')
def _(tex):
    M, T = 0.028, 300.0
    P = maxwell(M, T)
    holds('the square root of the mean square speed of the distribution', tex, 1e-6, v_rms=sqrt(integrate(lambda v: v * v * P(v), 0, 4000)), R=R_GAS, T=T, M=M)


@frow('19-4', 'Average translational kinetic energy')
def _(tex):
    M, T = 0.032, 300.0
    m, P = M / N_A, maxwell(M, T)
    holds('the average of (1/2) m v^2 over the distribution', tex, 1e-6, K_avg=integrate(lambda v: 0.5 * m * v * v * P(v), 0, 4000), k=R_GAS / N_A, T=T)


@frow('19-4', 'Total for n moles')
def _(tex):
    M, T, n = 0.032, 300.0, 2.0
    m, P = M / N_A, maxwell(M, T)
    holds('N times the average', tex, 1e-6, K_tot=n * N_A * integrate(lambda v: 0.5 * m * v * v * P(v), 0, 4000), n=n, R=R_GAS, T=T)


def relative_speed_factor(n=40000):
    """<|v1 - v2|> / <|v|> for molecules drawn from one Maxwellian (fixed pseudo-random numbers)"""
    import random
    rnd = random.Random(19)
    g = lambda: tuple(rnd.gauss(0, 1) for _ in range(3))
    vs = [g() for _ in range(2 * n)]
    avg = sum(math.hypot(*v) for v in vs) / len(vs)
    rel = sum(math.hypot(*(a - b for a, b in zip(vs[2 * i], vs[2 * i + 1]))) for i in range(n)) / n
    return rel / avg


@frow('19-5', 'Mean free path')
def _(tex):
    d, nV = 3.0e-10, 2.5e25
    f = relative_speed_factor()
    check('molecules meet at sqrt2 times their average speed (sampled)', f, sqrt(2), 0.01)
    holds('the average speed over the collision rate pi d^2 (N/V) <v_rel>', tex, 0.01, d=d, N=nV, V=1.0, lambda_=1 / (pi * d * d * nV * f))


@frow('19-5', 'Collision rate')
def _(tex):
    d, nV, vavg = 3.0e-10, 2.5e25, 460.0
    f = relative_speed_factor()
    holds('pi d^2 (N/V) <v_rel>', tex, 0.01, rate=pi * d * d * nV * f * vavg, v_avg=vavg, lambda_=1 / (sqrt(2) * pi * d * d * nV))


@frow('19-6', 'Maxwell’s speed distribution')
def _(tex):
    M, T, v = 0.032, 300.0, 410.0
    a = sqrt(R_GAS * T / M)  # each velocity component is Gaussian with this spread
    holds('the slope of the fraction below v, from the three Gaussian components', tex, 1e-6, swap={'P(v)': 'P_v'},
          P_v=(maxwell_cdf(v + 1e-3, a) - maxwell_cdf(v - 1e-3, a)) / 2e-3, M=M, R=R_GAS, T=T, v=v, e=E)
    check('the area under it is 1', integrate(maxwell(M, T), 0, 5000), 1.0)


@frow('19-6', 'Most probable speed')
def _(tex):
    M, T = 0.032, 300.0
    P = maxwell(M, T)
    holds('the peak of the curve', tex, 1e-6, v_P=bisect(lambda v: P(v + 1e-3) - P(v - 1e-3), 100, 1000), R=R_GAS, T=T, M=M)


@frow('19-6', 'Average speed')
def _(tex):
    M, T = 0.032, 300.0
    P = maxwell(M, T)
    holds('the average over the curve', tex, 1e-6, v_avg=integrate(lambda v: v * P(v), 0, 5000), R=R_GAS, T=T, M=M)


@frow('19-6', 'In order')
def _(tex):
    M, T = 0.032, 300.0
    P = maxwell(M, T)
    holds('the three speeds of one curve', tex, v_P=bisect(lambda v: P(v + 1e-3) - P(v - 1e-3), 100, 1000), v_avg=integrate(lambda v: v * P(v), 0, 5000),
          v_rms=sqrt(integrate(lambda v: v * v * P(v), 0, 5000)))


def e_trans(n, M, T):  # n moles' translational kinetic energy, from the distribution
    m = M / N_A
    return n * N_A * integrate(lambda v: 0.5 * m * v * v * maxwell(M, T)(v), 0, 6000)


@frow('19-7', 'Internal energy, monatomic')
def _(tex):
    holds('N times the average kinetic energy (helium)', tex, 1e-6, E_int=e_trans(2.0, 0.004, 300.0), n=2.0, R=R_GAS, T=300.0)


@frow('19-7', 'Constant volume')
def _(tex):
    dE = e_trans(1.0, 0.004, 330.0) - e_trans(1.0, 0.004, 300.0)
    holds('no work, so Q is the rise in kinetic energy', tex, 1e-6, Q=dE, n=1.0, C_V=1.5 * R_GAS, Delta_T=30.0)


@frow('19-7', 'Monatomic gas')
def _(tex):
    holds('dE/dT per mole', tex, 1e-6, C_V=(e_trans(1.0, 0.004, 301.0) - e_trans(1.0, 0.004, 299.0)) / 2.0, R=R_GAS)


@frow('19-7', 'Any process')
def _(tex):
    T1, W, _ = gas_path(1.0, 1.5 * R_GAS, 400, 1.0, 3.0)
    holds('a slow adiabatic expansion: the change is minus the work', tex, 1e-6, Delta_E_int=-W, n=1.0, C_V=1.5 * R_GAS, Delta_T=T1 - 400)


@frow('19-7', 'Constant pressure')
def _(tex):
    n, p, T0, T1 = 1.0, 1e5, 300.0, 340.0
    W = integrate(lambda V: p, n * R_GAS * T0 / p, n * R_GAS * T1 / p, 200)
    holds('the first law: the rise in energy plus the work', tex, 1e-6, Q=e_trans(n, 0.004, T1) - e_trans(n, 0.004, T0) + W, n=n, C_p=2.5 * R_GAS, Delta_T=T1 - T0)


@frow('19-7', 'The two molar specific heats')
def _(tex):
    n, p, T0, T1 = 1.0, 1e5, 300.0, 340.0
    W = integrate(lambda V: p, n * R_GAS * T0 / p, n * R_GAS * T1 / p, 200)
    Q = e_trans(n, 0.004, T1) - e_trans(n, 0.004, T0) + W
    holds('heat per mole and kelvin at constant pressure', tex, 1e-6, C_p=Q / (n * (T1 - T0)), C_V=1.5 * R_GAS, R=R_GAS)


def rotor_energy(T, I=1.9e-46):
    """the average rotational energy of a linear molecule: two axes, each a Gaussian in its angular speed"""
    kT = R_GAS / N_A * T
    s = sqrt(kT / I)
    gauss = lambda w: exp(-0.5 * (w / s) ** 2) / (s * sqrt(2 * pi))
    return 2 * integrate(lambda w: 0.5 * I * w * w * gauss(w), -12 * s, 12 * s, 4000)


@frow('19-8', 'Equipartition')
def _(tex):
    n, T = 1.0, 300.0
    E = e_trans(n, 0.028, T) + n * N_A * rotor_energy(T)
    holds('moving and turning (a diatomic gas)', tex, 1e-6, E_int=E, f=5, n=n, R=R_GAS, T=T)


@frow('19-8', 'Molar specific heat')
def _(tex):
    dE = (e_trans(1.0, 0.028, 301.0) + N_A * rotor_energy(301.0)) - (e_trans(1.0, 0.028, 299.0) + N_A * rotor_energy(299.0))
    holds('dE/dT per mole, diatomic', tex, 1e-6, C_V=dE / 2.0, f=5, R=R_GAS)


@frow('19-8', 'Ratio of specific heats')
def _(tex):
    Cv = 2.5 * R_GAS
    T1, _, _ = gas_path(1.0, Cv, 400, 1.0, 2.0)
    p0, p1 = R_GAS * 400 / 1.0, R_GAS * T1 / 2.0
    holds('pV^gamma along a slow adiabatic expansion', tex, 1e-6, gamma=log(p0 / p1) / log(2.0), C_p=Cv + R_GAS, C_V=Cv)


@frow('19-8', 'Values of γ')
def _(tex):
    g = lambda f: (f / 2 + 1) / (f / 2)
    holds('(f/2 + 1)/(f/2) for 3, 5 and 6 degrees of freedom', tex, gamma_mono=g(3), gamma_di=g(5), gamma_poly=g(6))


@frow('19-9', 'Adiabatic process')
def _(tex):
    gam, Cv = 5 / 3, 1.5 * R_GAS
    T1, _, _ = gas_path(1.0, Cv, 400, 1.0, 5.0)
    holds('the end of a slow adiabatic expansion', tex, 1e-6, p=R_GAS * T1 / 5.0, V=5.0, gamma=gam, constant=R_GAS * 400 / 1.0 * 1.0 ** gam)


@frow('19-9', 'Temperature and volume')
def _(tex):
    gam, Cv = 7 / 5, 2.5 * R_GAS
    T1, _, _ = gas_path(1.0, Cv, 400, 1.0, 5.0)
    holds('the end of a slow adiabatic expansion', tex, 1e-6, T=T1, V=5.0, gamma=gam, constant=400 * 1.0 ** (gam - 1))


@frow('19-9', 'Adiabatic work')
def _(tex):
    gam, Cv = 5 / 3, 1.5 * R_GAS
    T1, W, _ = gas_path(1.0, Cv, 400, 1.0, 5.0)
    holds('the work, step by step', tex, 1e-6, W=W, p_i=R_GAS * 400 / 1.0, V_i=1.0, p_f=R_GAS * T1 / 5.0, V_f=5.0, gamma=gam)


@frow('19-9', 'Free expansion')
def _(tex):
    n, T0, V0, V1 = 1.0, 300.0, 1.0, 3.0
    Tf = bisect(lambda T: e_trans(n, 0.004, T) - e_trans(n, 0.004, T0), 100, 600, 60)  # no Q, no W: the same energy
    holds('the same internal energy', tex, 1e-6, T_i=T0, T_f=Tf, p_i=n * R_GAS * T0 / V0, V_i=V0, p_f=n * R_GAS * Tf / V1, V_f=V1)


@frow('c19+', 'Ratio of rms speeds')
def _(tex):
    vr = lambda M: sqrt(integrate(lambda v: v * v * maxwell(M, 300.0)(v), 0, 8000))
    holds('hydrogen and oxygen at 300 K', tex, 1e-6, v_1=vr(0.002), v_2=vr(0.032), M_2=0.032, M_1=0.002)


@frow('c19+', 'Adiabatic temperature change')
def _(tex):
    gam = 7 / 5
    T1, _, _ = gas_path(1.0, 2.5 * R_GAS, 400, 1.0, 3.0)
    holds('a slow adiabatic expansion', tex, 1e-6, T_f=T1, T_i=400, V_i=1.0, V_f=3.0, gamma=gam)


@frow('c19+', 'Work from the temperature drop')
def _(tex):
    T1, W, _ = gas_path(2.0, 1.5 * R_GAS, 400, 1.0, 3.0)
    holds('a slow adiabatic expansion', tex, 1e-6, W=W, n=2.0, C_V=1.5 * R_GAS, T_i=400, T_f=T1)


# ---------- Chapter 20 ----------
@frow('20-1', 'Change in entropy')
def _(tex):
    m, c = 0.5, 4186.0
    dS = integrate(lambda T: m * c / T, 300, 350)  # warming water slowly: dQ = m c dT at each temperature
    check('warming water: the integral of dQ/T', dS, m * c * log(350 / 300))
    _, W, Q = gas_path(1.0, 1.5 * R_GAS, 300, 1.0, 2.0, adiabatic=False)
    check('isothermal expansion: Q/T', Q / 300, R_GAS * LN2, 1e-6)
    check_true('the row integrates dQ/T', '\\frac{dQ}{T}' in tex)


@frow('20-1', 'At constant temperature')
def _(tex):
    _, W, Q = gas_path(1.0, 1.5 * R_GAS, 300, 1.0, 2.0, adiabatic=False)
    holds('isothermal doubling, dQ/T summed step by step', tex, 1e-6, Delta_S=integrate(lambda V: R_GAS * 300 / V / 300, 1.0, 2.0), Q=Q, T=300)


@frow('20-1', 'Ideal gas')
def _(tex):
    n, Cv, Ti, Tf, Vi, Vf = 1.0, 1.5 * R_GAS, 300.0, 450.0, 1.0, 2.5
    dS = integrate(lambda V: n * R_GAS / V, Vi, Vf) + integrate(lambda T: n * Cv / T, Ti, Tf)  # isothermal, then at fixed volume
    holds('a reversible path in two legs', tex, 1e-6, Delta_S=dS, n=n, R=R_GAS, V_f=Vf, V_i=Vi, C_V=Cv, T_f=Tf, T_i=Ti)


@frow('20-1', 'Warming a body')
def _(tex):
    holds('the integral of m c dT / T', tex, 1e-6, Delta_S=integrate(lambda T: 0.5 * 4186 / T, 300, 350), m=0.5, c=4186, T_f=350, T_i=300)


@frow('20-1', 'Second law')
def _(tex):
    Q = 500.0
    holds('heat passing from 400 K to 300 K: the two reservoirs together', tex, Delta_S=Q / 300 - Q / 400)


@frow('20-2', 'Energy over a cycle')
def _(tex):
    QH, QL, W = carnot(600, 300)
    holds('a Carnot cycle, leg by leg', tex, 1e-6, W=W, Q_H=QH, Q_L=QL)


@frow('20-2', 'Efficiency')
def _(tex):
    QH, QL, W = carnot(600, 300)
    holds('a Carnot cycle', tex, 1e-6, varepsilon=0.5, W=W, Q_H=QH)


@frow('20-2', 'Carnot cycle')
def _(tex):
    QH, QL, W = carnot(500, 350)
    holds('a Carnot cycle, leg by leg', tex, 1e-6, Q_H=QH, T_H=500, Q_L=QL, T_L=350)


@frow('20-2', 'Carnot efficiency')
def _(tex):
    QH, QL, W = carnot(500, 350)
    holds('work over heat in', tex, 1e-6, varepsilon_C=W / QH, T_L=350, T_H=500)


@frow('20-3', 'Refrigerator')
def _(tex):
    QH, QL, W = carnot(300, 270)  # run backwards, the same legs move the same heats the other way
    holds('a Carnot cycle run backwards', tex, 1e-6, Q_H=QH, Q_L=QL, W=W)


@frow('20-3', 'Coefficient of performance')
def _(tex):
    QH, QL, W = carnot(300, 270)
    holds('a Carnot cycle run backwards', tex, 1e-6, K=9.0, Q_L=QL, W=W)


@frow('20-3', 'Carnot refrigerator')
def _(tex):
    QH, QL, W = carnot(300, 270)
    holds('heat out of the cold side over work', tex, 1e-6, K_C=QL / W, T_L=270, T_H=300)


@frow('20-4', 'Multiplicity')
def _(tex):
    states = list(itertools.product('LR', repeat=6))
    check('6 molecules, 2 on the left: microstates listed', sum(1 for s in states if s.count('L') == 2), factorial(6) / (factorial(2) * factorial(4)))
    check_true('the row is N!/(n1! n2!)', 'W=\\frac{N!}{n_1!\\,n_2!}' in tex)


@frow('20-4', 'Boltzmann’s entropy equation')
def _(tex):
    N = 50  # doubling the volume of 50 molecules: each has twice the places, W grows 2^50 times
    holds('the entropy change of a free expansion from thermodynamics', tex, 1e-9, S=N / N_A * R_GAS * LN2, k=R_GAS / N_A, W=2.0 ** N)


@frow('20-4', 'All microstates')
def _(tex):
    N = 10
    check('the multiplicities of every split add up to 2^N', sum(factorial(N) // (factorial(i) * factorial(N - i)) for i in range(N + 1)), 2 ** N, 0)
    check('microstates listed', len(list(itertools.product('LR', repeat=N))), 2 ** N, 0)
    check_true('the row says 2^N', '2^N' in tex)


@frow('20-4', 'Stirling’s approximation')
def _(tex):
    N = 1000
    check('ln N! against N ln N - N for N = 1000, within 0.1%', (N * log(N) - N) / math.lgamma(N + 1), 1.0, 1e-3)
    check_true('the row says N ln N - N', 'N\\ln N-N' in tex)


@frow('c20+', 'Heat flowing from hot to cold')
def _(tex):
    Q = 500.0
    holds('the hot reservoir loses Q/T_H, the cold one gains Q/T_L', tex, Delta_S=-Q / 400 + Q / 300, Q=Q, T_L=300, T_H=400)


@frow('c20+', 'Free expansion')
def _(tex):
    holds('along a reversible isothermal path between the same states', tex, 1e-6, Delta_S=integrate(lambda V: 2.0 * R_GAS / V, 1.0, 3.0), n=2.0, R=R_GAS, V_f=3.0, V_i=1.0)


@frow('c20+', 'Engine and refrigerator')
def _(tex):
    QH, QL, W = carnot(300, 270)
    holds('one Carnot cycle, as an engine and run backwards', tex, 1e-6, K_C=QL / W, varepsilon_C=W / QH)


def formula_checks(data):
    print('\n== Formulas ==')
    rows = [('const', r[0], r[1]) for r in data['constants']]
    for g in data['fgroups']:
        for m in g['mods']:
            rows += [(m['no'], r[0], r[1]) for r in m['rows']]
        rows += [(g['id'] + '+', r[0], r[1]) for r in g['extra']]
    seen = set()
    for where, name, tex in rows:
        print(f'\n-- {where} {name}')
        f = FCHECKS.get((where, name))
        if f is None:
            check_true(f'{where} "{name}" has a check', False)
            continue
        seen.add((where, name))
        f(tex)
    for key in sorted(FCHECKS.keys() - seen):
        check_true(f'the check for {key} matches a row on the page', False)
    print(f'\n{len(seen)} of {len(rows)} formula rows checked')


# =====================================================================================================================
def practice_checks():
    print('\n== Practice ==')
    # ---------- Chapter 15 ----------
    x = lambda t: 0.050 * cos(4 * pi * t + pi / 3)
    chk('15.1 (a) amplitude from the motion', amplitude(x, 0, 1), 0.050)
    ups = [i / 1e5 for i in range(1, 200000) if x((i - 1) / 1e5) < 0 <= x(i / 1e5)]
    chk('15.1 (b) period from the motion', (ups[-1] - ups[0]) / (len(ups) - 1), 0.50, 1e-4)
    chk('15.1 (c) x(0)', x(0), 0.025)
    chk('15.1 (d) greatest speed', amplitude(lambda t: (x(t + 1e-7) - x(t - 1e-7)) / 2e-7, 0, 1), 0.2 * pi, 1e-6)
    chk('15.2 (b) RK4 period', 2 * half_period(spring(80, 0.20), 0.1), pi / 10, 1e-6)
    chk('15.2 (a) omega', 2 * pi / (pi / 10), 20)
    chk('15.2 (c) four times the mass', 2 * half_period(spring(80, 0.80), 0.1), pi / 5, 1e-6)
    _, r, v = run(spring(400, 1.0), (0.050,), (0.0,), lambda t, r, v: r[0], dt=1e-4)
    chk('15.3 (a) E', 0.5 * 400 * 0.050 ** 2, 0.50)
    chk('15.3 (b) speed through the centre (RK4)', abs(v[0]), 1.0)
    _, r, v = run(spring(400, 1.0), (0.050,), (0.0,), lambda t, r, v: r[0] - 0.025, dt=1e-4)
    chk('15.3 (c) U at 0.025 m', 0.5 * 400 * r[0] ** 2, 0.125)
    chk('15.3 (c) K at 0.025 m (RK4)', 0.5 * 1.0 * v[0] ** 2, 0.375)
    pend = lambda L: (lambda t, r, v: (-G / L * sin(r[0]),))
    chk('15.4 (a) T of 0.392 m (RK4, 0.01 rad)', 2 * half_period(pend(0.392), 0.01), 0.4 * pi, 1e-4)
    chk('15.4 (b) 1.568 m doubles it', 2 * half_period(pend(1.568), 0.01), 0.8 * pi, 1e-4)
    chk('15.4 (b) about 1.6 m', round(1.568, 1), 1.6)
    torque_pend = lambda m: (lambda t, r, v: (-m * G * 0.392 * sin(r[0]) / (m * 0.392 ** 2),))  # torque over I for a bob of mass m
    chk('15.4 (c) three times the mass: the same period (RK4)', 2 * half_period(torque_pend(0.30), 0.01), 2 * half_period(torque_pend(0.10), 0.01), 1e-9)
    pk = peaks_of(path(spring(50.0, 0.50, 0.10), (1.0,), (0.0,), 14.0, dt=2e-4))
    gam = -log(pk[-1][1] / pk[0][1]) / (pk[-1][0] - pk[0][0])
    chk('15.5 (a) amplitude falls to 1/e in 2m/b (RK4 peaks)', 1 / gam, 10, 1e-4)
    chk('15.5 (b) energy left', exp(-2 * gam * 10), exp(-2), 1e-4)
    chk('15.5 (c) pushes per second', 1 / 2.5, 0.40)
    xm, ph = sqrt(0.10 ** 2 + (sqrt(3) / 10) ** 2), atan2(sqrt(3) / 10, 0.10)
    chk('15.6 (a) amplitude', xm, 0.20)
    chk('15.6 (b) phase', ph, pi / 3)
    t, r, v = state_at(spring(100, 1.0), (0.10,), (-sqrt(3),), 0.3, dt=1e-4)
    chk('15.6 (c) x(0.3) on RK4', r[0], 0.20 * cos(10 * 0.3 + pi / 3))
    t, r, v = run(spring(100, 1.0), (0.10,), (-sqrt(3),), lambda t, r, v: v[0] if t > 1e-6 else -1, dt=1e-5)
    chk('15.6 (d) first at -x_m (RK4: v = 0)', t, pi / 15, 1e-6)
    chk('15.6 (d) and it is -x_m there', r[0], -0.20, 1e-6)
    _, r, v = run(spring(16 * 1.0, 1.0), (0.25,), (0.0,), lambda t, r, v: r[0] - 0.15, dt=1e-5)
    chk('15.7 (a) speed at 0.15 m (RK4)', abs(v[0]), 0.80)
    chk('15.7 (b) acceleration from the force', -16 * 0.15, -2.4)
    chk('15.7 (c) K/E', 0.5 * v[0] ** 2 / (0.5 * 16 * 0.25 ** 2), 0.64)
    s_ = path(lambda t, r, v: (-G - 49 * r[0] / 0.50,), (-0.14,), (0.0,), 3.0, dt=1e-4)  # 0.04 m below rest
    mid = (max(r[0] for _, r, _ in s_) + min(r[0] for _, r, _ in s_)) / 2
    chk('15.8 (a) rest stretch = middle of the swing', -mid, 0.10, 1e-6)
    chk('15.8 (b) period (RK4)', 2 * half_period(lambda t, r, v: (-49 * r[0] / 0.50,), 0.040), sqrt(2) * pi / 7, 1e-6)
    chk('15.8 (c) greatest speed', max(abs(v[0]) for _, _, v in s_), 0.28 * sqrt(2), 1e-6)
    m, Rh = 0.20, 0.49
    chk('15.9 (a) I about the nail, 2 figures', sig(2 * m * Rh ** 2, 2), 0.096)
    Th = 2 * half_period(lambda t, r, v: (-m * G * Rh / (2 * m * Rh ** 2) * sin(r[0]),), 0.01)
    chk('15.9 (b) period (RK4)', Th, 2 * pi * sqrt(0.10), 1e-4)
    chk('15.9 (b) about 2.0 s', round(Th, 1), 2.0)
    chk('15.9 (c) simple pendulum of 0.98 m matches', 2 * half_period(pend(0.98), 0.01), Th, 1e-6)
    kap = 4 * pi ** 2 * 0.010 / 1.0 ** 2
    chk('15.10 (a) kappa: RK4 period with it is 1.0 s', 2 * half_period(spring(kap, 0.010), 0.1), 1.0, 1e-6)
    chk('15.10 (a) about 0.39', round(kap, 2), 0.39)
    chk('15.10 (b) 0.090 kg m^2 gives 3.0 s', 2 * half_period(spring(kap, 0.090), 0.1), 3.0, 1e-6)
    pk = peaks_of(path(spring(20, 0.20, 0.040), (0.10,), (0.0,), 8.0, dt=2e-4))
    E5 = 0.10 * exp(-2 * (-log(pk[-1][1] / pk[0][1]) / (pk[-1][0] - pk[0][0])) * 5.0)
    chk('15.11 (a) starting energy', 0.5 * 20 * 0.10 ** 2, 0.10)
    chk('15.11 (b) energy at 5.0 s (RK4 peaks)', E5, 0.10 * exp(-1), 1e-4)
    chk('15.11 (b) about 0.037 J', round(0.10 * exp(-1), 3), 0.037)
    chk('15.11 (c) oscillations in 5.0 s', round(5.0 / (2 * pi / 10)), 8)
    acc2 = lambda t, r, v: ((-30 * r[0] - 20 * r[0]) / 0.50,)
    chk('15.12 (a) both springs push back: k = 50', -acc2(0, (0.01,), (0,))[0] * 0.50 / 0.01, 50)
    chk('15.12 (b) period (RK4)', 2 * half_period(acc2, 0.05), pi / 5, 1e-6)
    kser = 1 / (1 / 30 + 1 / 20)
    chk('15.12 (c) series k', kser, 12)
    chk('15.12 (c) period (RK4)', 2 * half_period(spring(kser, 0.50), 0.05), pi / sqrt(6), 1e-6)
    _, r, v = run(spring(200, 2.0), (0.10,), (0.0,), lambda t, r, v: r[0], dt=1e-5)
    chk('15.13 (a) speed at x = 0', abs(v[0]), 1.0)
    vafter = 2.0 * abs(v[0]) / 4.0
    chk('15.13 (b) momentum kept', vafter, 0.50)
    _, r2, _ = run(spring(200, 4.0), (0.0,), (vafter,), lambda t, r, v: v[0], dt=1e-5)
    chk('15.13 (c) new amplitude (RK4)', r2[0], 0.05 * sqrt(2), 1e-6)
    chk('15.13 (d) new period (RK4)', 2 * half_period(spring(200, 4.0), 0.05), sqrt(2) * pi / 5, 1e-6)
    kcar = 100 * G / 0.020
    chk('15.14 (a) k', kcar, 4.9e4)
    chk('15.14 (b) omega (RK4)', 2 * pi / (2 * half_period(spring(kcar, 1000), 0.01)), 7.0, 1e-6)
    chk('15.14 (c) speed: one 4.0 m bump per period', 4.0 / (2 * half_period(spring(kcar, 1000), 0.01)), 14 / pi, 1e-6)
    chk('15.14 (c) about 4.5 m/s', round(14 / pi, 1), 4.5)

    # ---------- Chapter 16 ----------
    y = lambda x, t: 0.040 * sin(pi * x - 4 * pi * t)
    c0 = bisect(lambda x: cos(pi * x), 0.1, 1.0)
    c1 = bisect(lambda x: cos(pi * x - 4 * pi * 0.01), 0.1, 1.0)
    chk('16.1 (a) amplitude', amplitude(lambda x: y(x, 0), 0, 2), 0.040)
    chk('16.1 (b) wavelength 2pi/k', 2 * pi / pi, 2.0)
    chk('16.1 (b) frequency', 4 * pi / (2 * pi), 2.0)
    chk('16.1 (c) a crest followed: 4.0 m/s toward +x', (c1 - c0) / 0.01, 4.0)
    v = 2 * 1.0 * chain_frequency(1.0, 25, 0.010, n=300)
    chk('16.2 (a) bead chain speed', v, 50, 1e-4)
    chk('16.2 (b) wavelength', 50 / 200, 0.25)
    chk('16.2 (c) doubled tension (bead chain)', 2 * 1.0 * chain_frequency(1.0, 50, 0.010, n=300), 50 * sqrt(2), 1e-4)
    chk('16.3 (a) power', string_power(0.010, 50, 100, 0.020), 1.0, 1e-5)
    chk('16.3 (b) half the amplitude', string_power(0.010, 50, 100, 0.010), 0.25, 1e-5)
    a3 = lambda ph: amplitude(lambda t: 3.0 * sin(-t) + 3.0 * sin(-t + ph), 0, 2 * pi)
    chk('16.4 (a) in phase', a3(0), 6.0)
    chk('16.4 (b) opposite', a3(pi), 0.0)
    chk('16.4 (c) quarter cycle', a3(pi / 2), 3 * sqrt(2))
    f1 = chain_frequency(1.0, 200 ** 2 * 0.001, 0.001, n=300)
    chk('16.5 (a) fundamental (bead chain)', f1, 100, 1e-4)
    chk('16.5 (a) second and third', chain_frequency(1.0, 40.0, 0.001, mode=2, n=300) + chain_frequency(1.0, 40.0, 0.001, mode=3, n=300), 500, 1e-4)
    chk('16.5 (b) second harmonic wavelength', 2 * 1.0 / 2, 1.0)
    chk('16.5 (c) nodes of two loops', sum(1 for i in range(2001) if abs(sin(2 * pi * i / 2000)) < 1e-9), 3, 0)
    k, w = 2 * pi / 0.40, 2 * pi * 20 / 0.40
    chk('16.6 (a) k', k, 5 * pi)
    chk('16.6 (a) omega', w, 100 * pi)
    yy = lambda x, t: 0.0050 * sin(5 * pi * x + 100 * pi * t)
    ok('16.6 (b) zero and rising at the origin', abs(yy(0, 0)) < 1e-12 and yy(0, 1e-6) > 0)
    c0 = bisect(lambda x: cos(5 * pi * x), 0.0, 0.15)  # a crest, and the same crest 1 ms later
    c1 = bisect(lambda x: cos(5 * pi * x + 100 * pi * 0.001), 0.0, 0.15)
    chk('16.6 (b) the crest moves at 20 m/s toward -x', (c1 - c0) / 0.001, -20, 1e-6)
    chk('16.6 (c) greatest transverse speed', amplitude(lambda t: (yy(0.1, t + 1e-7) - yy(0.1, t - 1e-7)) / 2e-7, 0, 0.02), 0.5 * pi, 1e-6)
    yv = lambda x, t: 0.020 * sin(2.0 * x - 8.0 * t)
    u = lambda t: (yv(0, t + 1e-7) - yv(0, t - 1e-7)) / 2e-7
    chk('16.7 (a) u at t = 0', u(0), -0.16, 1e-6)
    tq = pi / 16
    chk('16.7 (b) y', yv(0, tq), -0.020)
    chk('16.7 (b) u', u(tq), 0.0, 1e-6)
    chk('16.7 (b) a', (yv(0, tq + 1e-4) - 2 * yv(0, tq) + yv(0, tq - 1e-4)) / 1e-8, 1.28, 1e-5)
    chk('16.8 (a) v1 (bead chain)', 2 * chain_frequency(1.0, 3.6, 1.0e-3, n=300), 60, 1e-4)
    chk('16.8 (a) v2 (bead chain)', 2 * chain_frequency(1.0, 3.6, 4.0e-3, n=300), 30, 1e-4)
    chk('16.8 (b) the second string moves at 120 Hz (two bead chains, joined, driven at one end)', joined_strings_frequency(3.6, 1.0e-3, 4.0e-3, 120), 120, 2e-3)
    chk('16.8 (c) wavelengths', 60 / 120 + 30 / 120, 0.75)
    phi = 2 * pi * 0.10 / 0.60
    chk('16.9 (a) phase', phi, pi / 3)
    chk('16.9 (b) amplitude of the sum', amplitude(lambda t: 4.0 * sin(-t) + 4.0 * sin(-t + phi), 0, 2 * pi), 4 * sqrt(3))
    chk('16.9 (c) half a wavelength cancels', amplitude(lambda t: 4.0 * sin(-t) + 4.0 * sin(-t + 2 * pi * 0.30 / 0.60), 0, 2 * pi), 0.0)
    a512 = lambda ph: amplitude(lambda t: 5.0 * sin(t) + 12 * sin(t + ph), 0, 2 * pi)
    chk('16.10 (a) right angles', a512(pi / 2), 13)
    chk('16.10 (b) opposite', a512(pi), 7.0)
    chk('16.10 (c) 2pi/3', a512(2 * pi / 3), sqrt(109))
    chk('16.10 (c) about 10 mm', round(sqrt(109)), 10)
    ys = lambda x, t: 0.040 * sin(5 * pi * x) * cos(40 * pi * t)
    chk('16.11 (a) it is two 0.020 m waves at 8.0 m/s', ys(0.13, 0.021), 0.020 * sin(5 * pi * 0.13 - 40 * pi * 0.021) + 0.020 * sin(5 * pi * 0.13 + 40 * pi * 0.021))
    chk('16.11 (a) v = omega/k', 40 * pi / (5 * pi), 8.0)
    ok('16.11 (b) nodes at 0, 0.20, 0.40 m', all(amplitude(lambda t: ys(x, t), 0, 0.05, 50) < 1e-12 for x in (0, 0.20, 0.40)))
    ok('16.11 (c) antinodes at 0.10, 0.30 m', all(abs(amplitude(lambda t: ys(x, t), 0, 0.05, 50) - 0.040) < 1e-9 for x in (0.10, 0.30)))
    chk('16.11 (d) speed at an antinode', amplitude(lambda t: (ys(0.10, t + 1e-7) - ys(0.10, t - 1e-7)) / 2e-7, 0, 0.05), 1.6 * pi, 1e-6)
    chk('16.11 (d) about 5.0 m/s', round(1.6 * pi, 1), 5.0)
    chk('16.12 (a) 96.8 N gives 220 Hz (bead chain)', chain_frequency(0.50, 96.8, 2.0e-3, n=300), 220, 1e-4)
    chk('16.12 (b) half the length', chain_frequency(0.25, 96.8, 2.0e-3, n=300), 440, 1e-4)
    chk('16.12 (c) third harmonic', chain_frequency(0.50, 96.8, 2.0e-3, mode=3, n=300), 660, 1e-4)
    chk('16.13 (a) four loops', 2 * 1.2 / 4, 0.60)
    chk('16.13 (b) speed', 0.60 * 70, 42)
    chk('16.13 (c) 0.36 kg: 4 loops at 70 Hz (bead chain)', chain_frequency(1.2, 0.36 * G, 2.0e-3, mode=4, n=320), 70, 1e-4)
    chk('16.13 (d) 0.64 kg: 3 loops at 70 Hz (bead chain)', chain_frequency(1.2, 0.64 * G, 2.0e-3, mode=3, n=300), 70, 1e-4)
    chk('16.14 (a) speed', sqrt(50 / 5.0e-3), 100)
    chk('16.14 (b) amplitude for 1.0 W', bisect(lambda ym: string_power(5.0e-3, 100, 100 * pi, ym) - 1.0, 1e-4, 0.1, 60), 1 / (50 * pi), 1e-5)
    chk('16.14 (b) about 6.4 mm', round(1000 / (50 * pi), 1), 6.4)
    chk('16.14 (c) four times the tension', bisect(lambda ym: string_power(5.0e-3, 200, 100 * pi, ym) - 1.0, 1e-4, 0.1, 60), 1 / (50 * sqrt(2) * pi), 1e-5)
    chk('16.14 (c) about 4.5 mm', round(1000 / (50 * sqrt(2) * pi), 1), 4.5)

    # ---------- Chapter 17 ----------
    chk('17.1 (a) wavelength', 343 / 686, 0.50)
    chk('17.1 (b) frequency, kHz', 343 / 0.010 / 1000, 34.3)
    chk('17.1 (c) time', round(100 / 343, 2), 0.29)
    chk('17.2 (a) liquid', sqrt(1.0e9 / 1.0e3), 1.0e3)
    chk('17.2 (b) metal', sqrt(9.0e10 / 1.0e4), 3.0e3)
    chk('17.2 (c) ratio', 3.0e3 / 1.0e3, 3.0)
    chk('17.3 (a) 0.20 m: amplitude 0', two_paths(0.20, 0.40), 0.0)
    chk('17.3 (b) 0.80 m: amplitude 2', two_paths(0.80, 0.40), 2.0)
    chk('17.3 (c) 0.10 m: phase pi/2 (amplitude sqrt2)', two_paths(0.10, 0.40), sqrt(2))
    chk('17.4 (a) 70 dB', 10 * log10(1e-5 / 1e-12), 70)
    chk('17.4 (b) 90 dB', 1e-12 * 10 ** 9, 1e-3)
    chk('17.4 (c) 20 dB', 10 ** (20 / 10), 100)
    bw = lambda t: cos(2 * pi * 256 * t) + cos(2 * pi * 260 * t)
    env = [amplitude(bw, 0.05 + i / 100, 0.05 + (i + 1) / 100, 40) for i in range(1000)]
    chk('17.5 (a) swells counted over 10 s', sum(1 for a, b, c in zip(env, env[1:], env[2:]) if a < b >= c and b > 1.5) / 10, 4, 0)
    chk('17.5 (a) pitch', (256 + 260) / 2, 258)
    ok('17.5 (b) lowering 256 Hz widens the gap, lowering 260 Hz narrows it', abs(260 - 255) > 4 and abs(259 - 256) < 4)
    sm = 2.04 / (340 * 1.20 * 1000)
    chk('17.6 (a) displacement amplitude', sm, 5.0e-6)
    s_x = lambda x, t: sm * cos(1000 / 340 * x - 1000 * t)
    Iw = integrate(lambda t: -1.20 * 340 ** 2 * (s_x(1e-6, t) - s_x(-1e-6, t)) / 2e-6 * (s_x(0, t + 1e-9) - s_x(0, t - 1e-9)) / 2e-9, 0, 2 * pi / 1000, 2000) / (2 * pi / 1000)
    chk('17.6 (b) intensity: average of pressure times velocity', Iw, 5.1e-3, 1e-4)
    chk('17.6 (c) level to the dB', round(10 * log10(Iw / 1e-12)), 97)
    Isir = 1e-12 * 10 ** 10
    chk('17.7 (a) intensity', Isir, 1e-2)
    chk('17.7 (b) power', Isir * 4 * pi * 10 ** 2, 4 * pi)
    chk('17.7 (b) about 13 W', round(4 * pi), 13)
    chk('17.7 (c) at 100 m', 10 * log10(4 * pi / (4 * pi * 100 ** 2) / 1e-12), 80)
    chk('17.7 (d) 60 dB at', sqrt(4 * pi / (4 * pi * 1e-6)), 1.0e3)
    chk('17.8 (a) 0.50 m closed pipe: 170 Hz (end conditions)', pipe_resonances(0.50, 340, True, 1)[0], 170)
    rs = pipe_resonances(0.50, 340, True, 3)
    chk('17.8 (b) next two', rs[1] + rs[2], 510 + 850)
    chk('17.8 (c) opened', pipe_resonances(0.50, 340, False, 1)[0], 340)
    loud = lambda x: amplitude(lambda t: sin(2 * pi * x / 1.0 - t) + sin(2 * pi * (3.0 - x) / 1.0 - t), 0, 2 * pi, 60)
    chk('17.9 (a) midpoint: amplitude 2', loud(1.5), 2.0)
    quiet = [x / 1000 for x in range(1, 3000) if loud(x / 1000) < 1e-9]
    ok('17.9 (b) the quiet spots nearest the middle are at 1.25 m and 1.75 m', sorted(quiet, key=lambda q: abs(q - 1.5))[:2] in ([1.25, 1.75], [1.75, 1.25]))
    chk('17.9 (c) quiet spots', len(quiet), 6, 0)
    chk('17.10 (a) approaching (crests timed)', arrivals(500, 340, lambda t: -300 + 20 * t, lambda t: 0.0), 531.25, 1e-9)
    fa = arrivals(500, 340, lambda t: 1 + 20 * t, lambda t: 0.0)
    chk('17.10 (b) receding, to the Hz', round(fa), 472)
    chk('17.10 (c) the drop, to the Hz', round(531.25 - fa), 59)
    chk('17.11 (a) approaching', arrivals(400, 340, lambda t: 0.0, lambda t: 300 - 34 * t), 440, 1e-9)
    chk('17.11 (b) receding', arrivals(400, 340, lambda t: 0.0, lambda t: 1 + 34 * t), 360, 1e-9)
    tb, d = boom(680.0, 3000.0)
    chk('17.12 (a) 680 m/s gives a 30 degree cone (boom timing)', degrees(atan2(3000.0, d)), 30, 1e-6)
    chk('17.12 (b) Mach number for 60 degrees', 1 / sin(radians(60)), 2 / sqrt(3))
    f_wall = arrivals(640, 340, lambda t: -300 + 20 * t, lambda t: 0.0)
    chk('17.13 (a) at the wall (crests timed)', f_wall, 680, 1e-9)
    chk('17.13 (b) echo heard by the driver (crests timed)', arrivals(f_wall, 340, lambda t: 0.0, lambda t: -300 + 20 * t), 720, 1e-9)
    chk('17.13 (c) beats', 720 - 640, 80)
    res = pipe_resonances(0.17, 340, True, 1)[0]
    chk('17.14 (a) 0.17 m and 0.51 m both resonate at 500 Hz', res + pipe_resonances(0.51, 340, True, 2)[1], 1000)
    chk('17.14 (a) wavelength', 2 * (0.51 - 0.17), 0.68)
    chk('17.14 (b) speed', 0.68 * 500, 340)
    chk('17.14 (c) next length resonates at 500 Hz too', pipe_resonances(0.85, 340, True, 3)[2], 500)

    # ---------- Chapter 18 ----------
    chk('18.1 (a) K', 25 + 273.15, 298.15)
    chk('18.1 (a) F', 9 / 5 * 25 + 32, 77)
    chk('18.1 (b) -40 F', 5 / 9 * (-40 - 32), -40)
    chk('18.1 (c) 0 K in F', 9 / 5 * (0 - 273.15) + 32, -459.67)
    chk('18.2 (a) rod, mm', 2.0 * 2.3e-5 * 50 * 1000, 2.3)
    chk('18.3 (a) copper, 2 figures', sig(386 * 0.50 * 100, 2), 1.9e4)
    chk('18.3 (b) water, 2 figures', sig(4186 * 0.50 * 100, 2), 2.1e5)
    chk('18.4 (a) melting, 2 figures', sig(333e3 * 2.0, 2), 6.7e5)
    chk('18.4 (b) boiling, 2 figures', sig(2256e3 * 0.10, 2), 2.3e5)
    chk('18.5 (a) first law', 500 - 200, 300)
    chk('18.5 (b) first law', -100 - (-300), 200)
    chk('18.5 (c) first law', 0 - 150, -150)
    pth = lambda T: 0.05 * R_GAS * T / 1e-3  # an ideal-gas thermometer at fixed volume
    Troom = bisect(lambda T: pth(T) / pth(273.16) - 66.0 / 60.0, 200, 400)
    chk('18.6 (a) room temperature', Troom, 300.476, 1e-6)
    chk('18.6 (a) in C to 0.1', round(Troom - 273.15, 1), 27.3)
    chk('18.6 (b) at 546.32 K, kPa', 60.0 * pth(546.32) / pth(273.16), 120)
    chk('18.7 (a) mercury, cm^3', 200 * 1.8e-4 * 50, 1.8)
    chk('18.7 (b) flask, cm^3', 200 * 3 * 1.2e-5 * 50, 0.36)
    chk('18.7 (c) spill', 1.8 - 0.36, 1.44)
    chk('18.8 (a) melting, cal', 80 * 100, 8.0e3)
    chk('18.8 (b) water to 0 C, cal', 1.0 * 400 * 60, 2.4e4)
    chk('18.8 (c) sum of Q = 0', bisect(lambda T: 8000 + 100 * T + 400 * (T - 60), 0, 60), 32)
    lin = lambda V: 4.0e5 + (2.0e5 - 4.0e5) * (V - 2.0e-3) / 4.0e-3
    chk('18.9 (a) integral of p dV along the line', integrate(lin, 2.0e-3, 6.0e-3, 200), 1200)
    chk('18.9 (b) compression', integrate(lambda V: 2.0e5, 6.0e-3, 2.0e-3, 200), -800)
    chk('18.9 (c) net', 1200 - 800, 400)
    chk('18.9 (d) Q = W round a cycle', 400, 400)
    chk('18.10 (a) work', integrate(lambda V: 1.5e5, 1.0e-3, 3.0e-3, 200), 300)
    chk('18.10 (b) first law', 750 - 300, 450)
    chk('18.11 (a) bare wall (relaxed)', slab_flux([(0.20, 0.80)], 25, 0, A=4.0, n=20, sweeps=4000), 400, 1e-6)
    Pins = slab_flux([(0.20, 0.80), (0.050, 0.040)], 25, 0, A=4.0, n=20, sweeps=40000)
    chk('18.11 (b) with insulation (relaxed)', Pins, 400 / 6, 1e-4)
    chk('18.11 (b) about 67 W', round(Pins), 67)
    chk('18.11 (c) in a day, 2 figures', sig(400 * 86400, 2), 3.5e7)
    chk('18.12 (a) 300 K, to the W', round(5.67e-8 * 300 ** 4), 459)
    chk('18.12 (b) same temperature: no net loss', 5.67e-8 * (300 ** 4 - 300 ** 4), 0)
    chk('18.12 (c) 600 K, 2 figures', sig(5.67e-8 * 600 ** 4, 2), 7.3e3)
    W_AB = integrate(lambda V: 2.0e5, 1.0e-3, 4.0e-3, 200)
    chk('18.13 (a) W_AB', W_AB, 600)
    chk('18.13 (b) dE_AB', 1500 - W_AB, 900)
    chk('18.13 (c) Q_CA: the changes round the cycle add to zero', (0 - (900 - 900)) + (-450), -450)
    chk('18.13 (d) net work = net heat', W_AB + 0 - 450, 1500 - 900 - 450)

    # ---------- Chapter 19 ----------
    chk('19.1 (a) moles', 64 / 32, 2.0)
    chk('19.1 (b) molecules, 2 figures', sig(2.0 * N_A, 2), 1.2e24)
    chk('19.1 (c) one molecule, 2 figures', sig(0.032 / N_A, 2), 5.3e-26)
    chk('19.2 (a) pressure, 2 figures', sig(2.0 * R_GAS * 300 / 0.050, 2), 1.0e5)
    chk('19.2 (b) volume, L to 3 figures', sig(R_GAS * 273 / 1.0e5 * 1000, 3), 22.7)
    chk('19.2 (c) factor', 450 / 300, 1.5)
    vr = lambda M, T: sqrt(integrate(lambda v: v * v * maxwell(M, T)(v), 0, 20000))
    chk('19.3 (a) helium at 300 K (distribution), 2 figures', sig(vr(0.0040, 300), 2), 1.4e3)
    chk('19.3 (b) at 1200 K, 2 figures', sig(vr(0.0040, 1200), 2), 2.7e3)
    chk('19.3 (c) helium over neon', vr(0.0040, 300) / vr(0.020, 300), sqrt(5), 1e-6)
    chk('19.3 (c) about 2.2', round(sqrt(5), 1), 2.2)
    m4 = 0.004 / N_A
    chk('19.4 (a) <(1/2) m v^2> at 400 K (distribution), 2 figures', sig(integrate(lambda v: 0.5 * m4 * v * v * maxwell(0.004, 400)(v), 0, 20000) * (K_B * N_A / R_GAS), 2), 8.3e-21)
    chk('19.4 (b) temperature, to the K', round(2 * 1.0e-20 / (3 * K_B)), 483)
    ok('19.4 (c) helium and oxygen at one T: the same average', abs(integrate(lambda v: 0.5 * (0.004 / N_A) * v * v * maxwell(0.004, 300)(v), 0, 20000)
                                                               - integrate(lambda v: 0.5 * (0.032 / N_A) * v * v * maxwell(0.032, 300)(v), 0, 8000)) < 1e-26)
    for f_, cv, cp, gm in ((3, 12.5, 20.8, 5 / 3), (5, 20.8, 29.1, 1.40), (6, 24.9, 33.2, 4 / 3)):
        chk(f'19.5 f = {f_}: C_V to 3 figures', sig(f_ / 2 * R_GAS, 3), cv)
        chk(f'19.5 f = {f_}: C_p to 3 figures', sig((f_ / 2 + 1) * R_GAS, 3), cp)
        chk(f'19.5 f = {f_}: gamma', (f_ / 2 + 1) / (f_ / 2), gm)
    Wc = integrate(lambda V: 0.50 * R_GAS * 300 / V, 0.020, 0.0050)
    chk('19.6 (a) work by the gas, 2 figures', sig(Wc, 2), -1.7e3)
    chk('19.6 (b) heat = work at constant T, 2 figures', sig(Wc, 2), -1.7e3)
    chk('19.6 (c) final pressure, 2 figures', sig(0.50 * R_GAS * 300 / 0.0050, 2), 2.5e5)
    Wp = integrate(lambda V: 1e5, 3 * R_GAS * 300 / 1e5, 3 * R_GAS * 350 / 1e5, 200)
    dE = e_trans(3.0, 0.004, 350) - e_trans(3.0, 0.004, 300)
    chk('19.7 (a) Q = dE + W, 2 figures', sig(dE + Wp, 2), 3.1e3)
    chk('19.7 (b) dE from the distribution, 2 figures', sig(dE, 2), 1.9e3)
    chk('19.7 (c) W, 2 figures', sig(Wp, 2), 1.2e3)
    chk('19.8 (a) 1.0e5 Pa to 1.0 Pa', 1.0e-7 * 1.0e5 / 1.0, 1.0e-2)
    chk('19.8 (b) to 1.0e-4 Pa', 1.0e-7 * 1.0e5 / 1.0e-4, 1.0e2)
    M28 = 0.028
    T28 = M28 * 517 ** 2 / (3 * R_GAS)
    P28 = maxwell(M28, T28)
    chk('19.9 (a) most probable speed (curve peak), to the m/s', round(bisect(lambda v: P28(v + 1e-3) - P28(v - 1e-3), 100, 1000)), 422)
    chk('19.9 (b) average speed (curve), to the m/s', round(integrate(lambda v: v * P28(v), 0, 5000)), 476)
    chk('19.10 (a) constant volume', 2.0 * 2.5 * R_GAS * 20, 831)
    chk('19.10 (b) constant pressure, 3 figures', sig(2.0 * 3.5 * R_GAS * 20, 3), 1.16e3)
    chk('19.10 (c) work, to the J', round(2.0 * R_GAS * 20), 332)
    Tf = gas_path(1.0, 2.5 * R_GAS, 300, 32.0, 1.0)[0]  # squeezed slowly from 32 units of volume to 1
    chk('19.11 (a) final temperature (step by step)', Tf, 1200, 1e-6)
    chk('19.11 (b) final pressure from pV = nRT, ratio', (Tf / 300) * 32, 128, 1e-6)
    _, Wd, _ = gas_path(1.0, 2.5 * R_GAS, 300, 32.0, 1.0)
    chk('19.11 (c) work done on it, 2 figures', sig(-Wd, 2), 1.9e4)
    QAB, WAB = 2.5 * R_GAS * 300, integrate(lambda V: R_GAS * 300 / 1.0, 1.0, 2.0, 200)
    QBC = 1.5 * R_GAS * (300 - 600)
    _, WCA, _ = gas_path(1.0, 1.5 * R_GAS, 300, 2.0, 1.0, adiabatic=False)
    chk('19.12 (a) Q_AB, 2 figures', sig(QAB, 2), 6.2e3)
    chk('19.12 (a) W_AB = p dV, 2 figures', sig(WAB, 2), 2.5e3)
    chk('19.12 (b) Q_BC, 2 figures', sig(QBC, 2), -3.7e3)
    chk('19.12 (c) W_CA, 2 figures', sig(WCA, 2), -1.7e3)
    chk('19.12 (d) net work, to the J', round(WAB + WCA), 765)
    chk('19.12 (d) efficiency, 2 decimals', round((WAB + WCA) / QAB, 2), 0.12)
    chk('19.13 (a) pressure', 1.2e-3 * 500 ** 2 / (3 * 1.0e-3), 1.0e5)
    T13 = 0.028 * 500 ** 2 / (3 * R_GAS)
    chk('19.13 (b) temperature, to the K', round(T13), 281)
    chk('19.13 (c) nRT = pV, J to 3 figures', sig(1.2 / 28 * R_GAS * T13, 3), 100)
    ok('19.14 (a) free expansion: same energy, same T', abs(bisect(lambda T: e_trans(1.0, 0.004, T) - e_trans(1.0, 0.004, 300), 100, 600, 60) - 300) < 1e-6)
    _, W14, _ = gas_path(1.0, 1.5 * R_GAS, 300, 0.010, 0.030, adiabatic=False)
    chk('19.14 (b) isothermal work, 2 figures', sig(W14, 2), 2.7e3)
    chk('19.14 (c) final pressure, 2 figures', sig(R_GAS * 300 / 0.030, 2), 8.3e4)

    # ---------- Chapter 20 ----------
    chk('20.1 (a) melting, 2 figures', sig(333e3 * 2.0 / 273, 2), 2.4e3)
    chk('20.1 (b) boiling, 2 figures', sig(2256e3 * 0.50 / 373, 2), 3.0e3)
    chk('20.2 (a) efficiency', 500 / 2000, 0.25)
    chk('20.2 (b) heat out', 2000 - 500, 1500)
    QH, QL, W = carnot(800, 400)
    chk('20.3 (a) Carnot cycle run leg by leg', W / QH, 0.50, 1e-6)
    QH, QL, W = carnot(773.15, 298.15)
    chk('20.3 (b) 500 C and 25 C, 2 decimals (leg by leg)', round(W / QH, 2), 0.61)
    chk('20.3 (b) the Celsius mistake', 1 - 25 / 500, 0.95)
    chk('20.4 (a) work', 600 / 3.0, 200)
    chk('20.4 (a) heat out', 600 + 200, 800)
    QH, QL, W = carnot(300, 250)
    chk('20.4 (b) Carnot refrigerator (leg by leg)', QL / W, 5.0, 1e-6)
    st = list(itertools.product('LR', repeat=6))
    chk('20.5 (a) three and three', sum(1 for s in st if s.count('L') == 3), 20)
    chk('20.5 (b) six and none', sum(1 for s in st if s.count('L') == 6), 1)
    chk('20.5 (c) all, and the chance', len(st) + sum(1 for s in st if s.count('L') == 6) / len(st), 64 + 1 / 64)
    dS2 = integrate(lambda V: 2.0 * R_GAS / V, 1.0, 2.0)
    chk('20.6 (a) doubling, J/K to 3 figures', sig(dS2, 3), 11.5)
    chk('20.6 (b) heat, 2 figures', sig(400 * dS2, 2), 4.6e3)
    chk('20.6 (c) tripling, J/K to 3 figures', sig(integrate(lambda V: 2.0 * R_GAS / V, 1.0, 3.0), 3), 18.3)
    chk('20.7 (a) integral of mc dT/T, 2 figures', sig(integrate(lambda T: 4186 / T, 273, 373), 2), 1.3e3)
    chk('20.7 (a) ln(373/273) to 3 decimals', round(log(373 / 273), 3), 0.312)
    chk('20.7 (b) heat, 2 figures', sig(4186 * 100, 2), 4.2e5)
    chk('20.7 (b) Q/373 and Q/273, 2 figures', sig(418600 / 373, 2) + sig(418600 / 273, 2), 1.1e3 + 1.5e3)
    chk('20.8 (a) hot', -1200 / 400, -3.0)
    chk('20.8 (b) cold', 1200 / 300, 4.0)
    chk('20.8 (c) total', -1200 / 400 + 1200 / 300, 1.0)
    QH, QL, W = carnot(600, 400)
    chk('20.9 (a) efficiency (leg by leg)', W / QH, 1 / 3, 1e-6)
    chk('20.9 (b) heat in for 500 J', 500 / (W / QH), 1500, 1e-6)
    chk('20.9 (b) heat out', 500 / (W / QH) * QL / QH, 1000, 1e-6)
    chk('20.9 (c) reservoirs together', -1500 / 600 + 1000 / 400, 0)
    chk('20.10 (a) final temperature', bisect(lambda T: (T - 360) + (T - 300), 300, 360), 330)
    hot, cold = integrate(lambda T: 4186 / T, 360, 330), integrate(lambda T: 4186 / T, 300, 330)
    chk('20.10 (b) hot part, to the J/K', round(hot), -364)
    chk('20.10 (b) cold part, to the J/K', round(cold), 399)
    chk('20.10 (c) total, to the J/K', round(hot + cold), 35)
    chk('20.10 given logs, 4 figures', sig(log(1.1), 3) + sig(log(12 / 11), 3), 0.0953 + 0.0870)
    QH, QL, W = carnot(500, 300)
    chk('20.11 (a) Carnot efficiency (leg by leg)', W / QH, 0.40, 1e-6)
    chk('20.11 (b) the reservoirs if it worked, 2 figures', sig(-1000 / 500 + 550 / 300, 2), -0.17)
    chk('20.11 (c) most work', 0.40 * 1000, 400)
    chk('20.12 (a) R ln2, 3 figures', sig(integrate(lambda V: R_GAS / V, 1.0, 2.0), 3), 5.76)
    chk('20.12 (b) N_A k ln2, 3 figures', sig(N_A * K_B * LN2, 3), 5.76)
    chk('20.12 (c) zeros after the point, 2 figures', sig(N_A * log10(2), 2), 1.8e23)
    QH, QL, W = carnot(300, 255)
    chk('20.13 (a) Carnot freezer (leg by leg)', QL / W, 17 / 3, 1e-6)
    chk('20.13 (b) work', 1.7e6 / (17 / 3), 3.0e5)
    chk('20.13 (c) heat to the kitchen', 1.7e6 + 3.0e5, 2.0e6)

# =====================================================================================================================
if __name__ == '__main__':
    data = load()
    summary_checks()
    formula_checks(data)
    practice_checks()
    ids = {f"{c['id'][1:]}.{i + 1}" for c in [{'id': k} for k in data['practice']] for i in range(len(data['practice'][c['id']]))}
    for pid in sorted(ids - covered, key=lambda s: tuple(map(int, s.split('.')))):
        check_true(f'Practice {pid} has a check', False)
    for pid in sorted({c for c in covered if '.' in c} - ids):
        check_true(f'the check for {pid} matches a Practice problem', False)
    mods = {m['no'] for c in data['summary'].values() for m in c['mods']}
    for no in sorted(mods - covered):
        check_true(f'Summary module {no} has a worked-example check', False)
    for no in sorted({c for c in covered if '-' in c} - mods):
        check_true(f'the check for {no} matches a Summary module', False)
    done('final')
