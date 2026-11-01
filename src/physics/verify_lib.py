"""Helpers for the Physics answer checks (verify_sets.py, and private/verify_exercises.py once it is open).

Every check recomputes an answer from the physics itself (summing force vectors, integrating the motion step by step,
adding up work) with sample numbers, and compares it with the closed form printed on the page. A check prints PASS or
FAIL; call done() at the end, which exits non-zero if anything failed."""
import math, sys
from math import sin, cos, tan, sqrt, pi, radians, degrees, atan, atan2, acos, asin, floor, log10

G = 9.8
fails = []


def check(name, got, want, tol=1e-6):
    ok = abs(got - want) <= tol * max(1.0, abs(want))
    print(f"{'PASS' if ok else 'FAIL'}  {name}: computed={got:.10g}  claimed={want:.10g}")
    if not ok:
        fails.append(name)


def check_vec(name, got, want, tol=1e-6):
    ok = len(got) == len(want) and all(abs(a - b) <= tol * max(1.0, abs(b)) for a, b in zip(got, want))
    print(f"{'PASS' if ok else 'FAIL'}  {name}: computed={fmt(got)}  claimed={fmt(want)}")
    if not ok:
        fails.append(name)


def check_true(name, cond, detail=''):
    print(f"{'PASS' if cond else 'FAIL'}  {name} {detail}".rstrip())
    if not cond:
        fails.append(name)


def done(what):
    print()
    if fails:
        print(f'{len(fails)} FAILED in {what}:', ', '.join(fails))
        sys.exit(1)
    print(f'all {what} checks passed')


fmt = lambda v: '(' + ', '.join(f'{x:.6g}' for x in v) + ')'


def sig(x, n):
    """x rounded to n significant figures"""
    return round(x, -int(floor(log10(abs(x)))) + (n - 1))


# ---------- vectors ----------
def add(*vs):
    return tuple(sum(c) for c in zip(*vs))


def sub(a, b):
    return tuple(x - y for x, y in zip(a, b))


def mul(k, v):
    return tuple(k * x for x in v)


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def cross(a, b):
    a, b = (tuple(a) + (0,) * 3)[:3], (tuple(b) + (0,) * 3)[:3]
    return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])


def norm(a):
    return sqrt(dot(a, a))


def polar(r, deg):
    """the 2D vector of length r at `deg` counterclockwise from +x"""
    return (r * cos(radians(deg)), r * sin(radians(deg)))


# ---------- calculus by numbers ----------
def d1(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)


def d2(f, x, h=1e-4):
    return (f(x + h) - 2 * f(x) + f(x - h)) / h ** 2


def integrate(f, a, b, n=20000):
    """Simpson's rule (n even)"""
    h = (b - a) / n
    s = f(a) + f(b) + sum((4 if i % 2 else 2) * f(a + i * h) for i in range(1, n))
    return s * h / 3


def solve(g, lo, hi, it=100):
    """a root of g on [lo, hi] by bisection (g changes sign there)"""
    glo = g(lo)
    if glo == 0:
        return lo
    for _ in range(it):
        mid = (lo + hi) / 2
        gm = g(mid)
        if (gm > 0) == (glo > 0):
            lo, glo = mid, gm
        else:
            hi = mid
    return (lo + hi) / 2


# ---------- motion: integrate dr/dt = v, dv/dt = acc(t, r, v) with RK4 ----------
def rk4(acc, t, r, v, h):
    def f(t, r, v):
        return v, acc(t, r, v)
    k1r, k1v = f(t, r, v)
    k2r, k2v = f(t + h / 2, add(r, mul(h / 2, k1r)), add(v, mul(h / 2, k1v)))
    k3r, k3v = f(t + h / 2, add(r, mul(h / 2, k2r)), add(v, mul(h / 2, k2v)))
    k4r, k4v = f(t + h, add(r, mul(h, k3r)), add(v, mul(h, k3v)))
    r2 = add(r, mul(h / 6, add(k1r, mul(2, k2r), mul(2, k3r), k4r)))
    v2 = add(v, mul(h / 6, add(k1v, mul(2, k2v), mul(2, k3v), k4v)))
    return r2, v2


def run(acc, r0, v0, until, dt=1e-3, t_max=1e4):
    """Integrates from t = 0 until the event function until(t, r, v) changes sign (from its starting sign), then pins
    the moment down by bisection on the last step. Returns (t, r, v) at the event."""
    t, r, v = 0.0, tuple(r0), tuple(v0)
    s0 = until(t, r, v)
    while t < t_max:
        r2, v2 = rk4(acc, t, r, v, dt)
        if (until(t + dt, r2, v2) > 0) != (s0 > 0):
            lo, hi = 0.0, dt
            for _ in range(80):
                mid = (lo + hi) / 2
                rm, vm = rk4(acc, t, r, v, mid)
                if (until(t + mid, rm, vm) > 0) == (s0 > 0):
                    lo = mid
                else:
                    hi = mid
            rm, vm = rk4(acc, t, r, v, hi)
            return t + hi, rm, vm
        t, r, v = t + dt, r2, v2
    raise RuntimeError('event never happened')


def path(acc, r0, v0, t_end, dt=1e-3):
    """the states (t, r, v) every dt from 0 to t_end"""
    out, t, r, v = [(0.0, tuple(r0), tuple(v0))], 0.0, tuple(r0), tuple(v0)
    while t < t_end - 1e-12:
        h = min(dt, t_end - t)
        r, v = rk4(acc, t, r, v, h)
        t += h
        out.append((t, r, v))
    return out


def state_at(acc, r0, v0, t_end, dt=1e-3):
    return path(acc, r0, v0, t_end, dt)[-1]


gravity = lambda t, r, v: (0.0, -G)
