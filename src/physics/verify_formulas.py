"""Numeric checks of the Physics Formulas tab (formulas.mjs): every row, every extra, the constants and the special angles.

Most rows are checked in the form the page shows them: the row's TeX is turned into Python (Expr below) and evaluated
with numbers taken from the physics itself (motion integrated step by step with RK4, forces summed as vectors, work
integrated, forces found by bisection), so a typo on the page fails here. Every value passed in must appear in the
formula, so a dropped factor fails too. Vector identities, definitions and units are checked by hand.
Every row needs a check, keyed by its module (or 'c1+' for a chapter's extras) and name: a row without one, or a check
whose row is gone, fails.
Run: python3 src/physics/verify_formulas.py   (exits non-zero if anything fails)"""
import cmath, json, keyword, os, re, subprocess, sys
from itertools import permutations

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from verify_lib import *  # noqa: F401,F403


def load():
    url = 'file://' + os.path.join(HERE, 'formulas.mjs')
    js = f"import('{url}').then((m) => console.log(JSON.stringify({{ trig: m.trig, constants: m.constants, fgroups: m.fgroups }})))"
    return json.loads(subprocess.run(['node', '-e', js], check=True, capture_output=True, text=True).stdout)


# ---------- the row's own TeX, turned into Python ----------
class Unsupported(Exception):
    pass


GREEK = {'theta', 'phi', 'rho', 'omega', 'alpha', 'mu', 'tau', 'sigma', 'beta'}
FUNCS = {'sin', 'cos', 'tan'}
SKIP = {'\\,', '\\ ', '\\;', '\\!', '\\displaystyle', '\\left', '\\right'}
REL = {'=': 'eq', '\\le': 'le', '\\leq': 'le', '\\ge': 'ge', '\\geq': 'ge', '<': 'lt', '>': 'gt', '\\approx': 'approx'}
NUM = re.compile(r'\d+(?:\.\d+)?$')
NS = {'sin': sin, 'cos': cos, 'tan': tan, 'sqrt': sqrt, 'pi': pi, 'abs': abs}


def tokens(tex):
    out = []
    for m in re.finditer(r'\\text\{([^{}]*)\}|\\[A-Za-z]+|\\.|\d+(?:\.\d+)?|\S', tex):
        if m.group(1) is not None:
            out.append(('text', m.group(1)))
        elif m.group(0) not in SKIP:
            out.append(m.group(0))
    return out


def ident(s):
    s = re.sub(r'\W', '', s)
    return s + '_' if keyword.iskeyword(s) else s


class Expr:
    """A recursive-descent reader of the TeX the rows use: + - and implicit products, \\frac, \\sqrt, powers (and
    ^\\circ), |…|, \\sin \\cos \\tan (with a bare argument such as \\sin2\\theta_0), Greek letters, \\Delta x, and
    subscripts (v_0, v_{0x}, v_\\text{avg}, F_{\\text{net},x}, f_{s,\\max}). Anything else (vectors, integrals,
    derivatives, units) raises Unsupported."""

    def __init__(self, toks):
        self.t, self.i, self.bars, self.names = toks, 0, 0, set()

    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else None

    def take(self, want=None):
        tok = self.peek()
        if tok is None or (want is not None and tok != want):
            raise Unsupported(f'expected {want or "more"}, found {tok!r}')
        self.i += 1
        return tok

    def whole(self):
        s = self.expr()
        if self.peek() is not None:
            raise Unsupported(f'cannot read from {self.peek()!r}')
        return s

    def expr(self):
        s = self.take() if self.peek() in ('-', '+') else ''
        s += self.term()
        while self.peek() in ('-', '+'):
            s += self.take() + self.term()
        return f'({s})'

    @staticmethod
    def simple(tok):  # a number, a variable or a Greek letter: what a bare function argument is made of
        if isinstance(tok, tuple):
            return True
        return isinstance(tok, str) and (bool(NUM.match(tok)) or (len(tok) == 1 and tok.isalpha())
                                         or tok in ('\\pi', '\\Delta') or tok[1:] in GREEK)

    def starts(self, tok):
        if tok == '|':
            return self.bars == 0  # inside |…| a bar closes it
        return self.simple(tok) or tok in ('(', '{', '\\frac', '\\tfrac', '\\dfrac', '\\sqrt') or (isinstance(tok, str) and tok[1:] in FUNCS)

    def term(self):
        s = self.factor()
        while True:
            tok = self.peek()
            if tok in ('*', '\\cdot', '\\times'):
                self.take()
                s += '*' + self.factor()
            elif tok == '/':
                self.take()
                s += '/' + self.factor()
            elif tok is not None and self.starts(tok):
                s += '*' + self.factor()
            else:
                return s

    def factor(self):
        base = self.atom()
        while self.peek() == '^':
            self.take()
            braced = self.peek() == '{'
            if braced:
                self.take()
            if self.peek() == '\\circ':
                self.take()
                base = f'({base}*pi/180)'
            else:
                e = self.expr() if braced else '(' + self.atom(simple=True) + ')'
                base = f'({base})**{e}'
            if braced:
                self.take('}')
        return base

    def atom(self, simple=False):
        tok = self.take()
        if isinstance(tok, tuple):
            return self.name(ident(tok[1].replace(' ', '_')))
        if NUM.match(tok):
            return tok
        if len(tok) == 1 and tok.isalpha():
            return self.name(tok)
        if tok[1:] in GREEK:
            return self.name(tok[1:])
        if tok == '\\pi':
            return 'pi'
        if tok == '\\Delta':
            nxt = self.take()
            if not (isinstance(nxt, str) and ((len(nxt) == 1 and nxt.isalpha()) or nxt[1:] in GREEK)):
                raise Unsupported(f'\\Delta {nxt!r}')
            return self.name('Delta_' + nxt.lstrip('\\'))
        if simple:
            raise Unsupported(f'{tok!r} in an exponent')
        if tok in ('(', '{'):
            e = self.expr()
            self.take(')' if tok == '(' else '}')
            return e
        if tok == '|':
            self.bars += 1
            e = self.expr()
            self.take('|')
            self.bars -= 1
            return f'abs{e}'
        if tok in ('\\frac', '\\tfrac', '\\dfrac'):
            if self.t[self.i:self.i + 2] == ['{', 'd']:
                raise Unsupported('a derivative')
            self.take('{')
            n = self.expr()
            self.take('}')
            self.take('{')
            d = self.expr()
            self.take('}')
            return f'({n}/{d})'
        if tok == '\\sqrt':
            self.take('{')
            e = self.expr()
            self.take('}')
            return f'sqrt{e}'
        if tok[1:] in FUNCS:
            return f'{tok[1:]}({self.argument()})'
        raise Unsupported(tok)

    def argument(self):
        if self.peek() == '(':
            self.take()
            e = self.expr()
            self.take(')')
            return e
        parts = []
        while self.peek() is not None and self.simple(self.peek()):
            parts.append(self.factor())
        if not parts:
            raise Unsupported('a function with no argument')
        return '*'.join(parts)

    def name(self, base):
        if self.peek() == '_':
            self.take()
            tok = self.take()
            pieces = []
            if tok == '{':
                depth = 1
                while True:
                    t2 = self.take()
                    if t2 == '{':
                        depth += 1
                    elif t2 == '}':
                        depth -= 1
                        if depth == 0:
                            break
                    else:
                        pieces.append(t2[1] if isinstance(t2, tuple) else t2.lstrip('\\'))
            else:
                pieces.append(tok[1] if isinstance(tok, tuple) else tok.lstrip('\\'))
            base = ident(base + '_' + ''.join('_' if p == ',' else p.replace(' ', '_') for p in pieces))
        self.names.add(base)
        return base


def equations(tex):
    """the row's separate equations (split at \\quad, \\qquad and ',\\ \\ ')"""
    return [p for p in re.split(r'[,:]?\s*\\q?quad\s*|,\\ \\ ', tex) if p.strip()]


def relation(part):
    """the sides of one equation and the relations between them (=, \\le, <, …), split outside braces and brackets"""
    sides, ops, cur, depth = [], [], [], 0
    for tok in tokens(part):
        if tok in ('{', '('):
            depth += 1
        elif tok in ('}', ')'):
            depth -= 1
        if depth == 0 and isinstance(tok, str) and tok in REL:
            sides.append(cur)
            ops.append(REL[tok])
            cur = []
        else:
            cur.append(tok)
    sides.append(cur)
    return sides, ops


def texval(tex, **vals):
    """the value of a lone TeX expression"""
    e = Expr(tokens(tex))
    return eval(e.whole(), dict(NS), vals)


def holds(label, tex, tol=1e-6, eqs=None, swap=None, **vals):
    """Checks the row's equations (all, or those numbered in eqs) with these values, in the form the page prints them.
    swap replaces a piece of TeX the reader can't take (a vector product, U(x)) by a named number first."""
    for old, new in (swap or {}).items():
        if old not in tex:
            check_true(f'{label}: the formula contains {old}', False)
        tex = tex.replace(old, '\\text{' + new + '}')
    parts, used = equations(tex), set()
    for k in (range(len(parts)) if eqs is None else eqs):
        name = f'{label} [{k + 1}]' if len(parts) > 1 else label
        try:
            sides, ops = relation(parts[k])
            exprs = [Expr(s) for s in sides]
            got = [eval(e.whole(), dict(NS), dict(vals)) for e in exprs]
            used |= set().union(*(e.names for e in exprs))
        except (Unsupported, NameError, SyntaxError, ZeroDivisionError, IndexError, TypeError) as err:
            check_true(f'{name}: {parts[k]}', False, f'(cannot evaluate: {err})')
            continue
        if not ops:
            check_true(f'{name}: {parts[k]}', False, '(no relation to check)')
        for (a, b), op in zip(zip(got, got[1:]), ops):
            if op == 'eq':
                check(name, a, b, tol)
            elif op == 'approx':
                check(name, a, b, 0.02)
            else:
                slack = tol * max(1.0, abs(b))
                ok = {'le': a <= b + slack, 'lt': a < b + slack, 'ge': a >= b - slack, 'gt': a > b - slack}[op]
                check_true(f'{name}: {a:.6g} {op} {b:.6g}', ok)
    unused = set(vals) - used
    if unused:
        check_true(f'{label}: every value given is in the formula', False, f'(not used: {", ".join(sorted(unused))})')


# ---------- other helpers ----------
CHECKS = {}


def row(where, name):
    def reg(f):
        assert (where, name) not in CHECKS, (where, name)
        CHECKS[(where, name)] = f
        return f
    return reg


def num(s):
    """a number as the TeX prints it: 299\\,792\\,458 or 1.66\\times10^{-27}"""
    s = s.replace('\\,', '').replace(' ', '')
    m = re.fullmatch(r'([\d.]+)(?:\\times10\^\{(-?\d+)\})?', s)
    return float(m.group(1)) * 10 ** int(m.group(2) or 0)


def simpson(ys, h):
    """Simpson's rule over equally spaced samples (an even number of intervals)"""
    if (len(ys) - 1) % 2:
        raise ValueError('Simpson needs an even number of intervals')
    return h / 3 * (ys[0] + ys[-1] + 4 * sum(ys[1:-1:2]) + 2 * sum(ys[2:-1:2]))


def angle_between(a, b):
    """the angle between two vectors from the law of cosines (the triangle a, b, a - b), not from a dot product"""
    A, B, C = norm(a), norm(b), norm(sub(a, b))
    return acos((A * A + B * B - C * C) / (2 * A * B))


UNIT_DIMS = {'kg': (1, 0, 0), 'm': (0, 1, 0), 's': (0, 0, 1), 'N': (1, 1, -2), 'J': (1, 2, -2), 'W': (1, 2, -3)}


def dims(u):
    """(kg, m, s) exponents of a unit written as on the page: \\text{kg}\\cdot\\text{m}^2/\\text{s}^2"""
    u = re.sub(r'\\text\{([^}]*)\}', r'\1', u).replace('\\cdot', ' ')
    top, *bottoms = u.split('/')
    out = [0, 0, 0]
    for part, sign in [(top, 1)] + [(b, -1) for b in bottoms]:
        for unit, p in re.findall(r'(kg|m|s|N|J|W)(?:\^(\d))?', part):
            for i in range(3):
                out[i] += sign * int(p or 1) * UNIT_DIMS[unit][i]
    return tuple(out)


def dmul(*ds):
    return tuple(sum(c) for c in zip(*ds))


MASS, LENGTH, TIME = (1, 0, 0), (0, 1, 0), (0, 0, 1)
PER_TIME = (0, 0, -1)
C_LIGHT = 299792458        # m/s, exact (SI)
CS_HZ = 9192631770         # the caesium-133 frequency that defines the second (SI)
U_KG = 1.66053906660e-27   # the atomic mass unit (CODATA 2018)
C12_KG = 1.99264687992e-26  # a carbon-12 atom (CODATA 2018)
N_A = 6.02214076e23        # Avogadro's number (exact, SI)
E_CHARGE = 1.602176634e-19  # C, exact (SI)
SI_PREFIX = {'T': 12, 'G': 9, 'M': 6, 'k': 3, 'c': -2, 'm': -3, 'mu': -6, 'n': -9, 'p': -12}
const_acc = lambda a: (lambda t, r, v: (a,))
fall1 = const_acc(-G)


# =====================================================================================================================
# constants and the special angles
@row('const', 'Free-fall acceleration')
def _(tex):
    g = num(re.match(r'g=([\d.]+)', tex).group(1))
    check('g on the page is the g of every check', g, G, 0)
    check('g = GM/R^2 for the Earth, to two significant figures', sig(6.674e-11 * 5.972e24 / 6.371e6 ** 2, 2), g)


@row('const', 'Speed of light')
def _(tex):
    check('c, digit by digit', num(re.match(r'c=((?:\d|\\,)+)', tex).group(1)), C_LIGHT, 0)


@row('const', 'Atomic mass unit')
def _(tex):
    u = num(re.search(r'=([\d.]+\\times10\^\{-27\})', tex).group(1))
    check('1 u in kg (x 1e27), to three significant figures', u * 1e27, sig(U_KG * 1e27, 3), 1e-12)


@row('const', 'Speed units')
def _(tex):
    check('1 m/s in km/h: 3600 s in an hour, 1000 m in a km', num(re.search(r'=([\d.]+)\\ \\text\{km/h\}', tex).group(1)), 3600 / 1000)


def trig_checks(trig):
    print('\n-- special angles')
    angles = []
    for t, label in trig['angles']:
        ang = texval(t)
        angles.append(ang)
        if label == '3-4-5':
            deg = round(degrees(ang))
            check(f'{deg} deg is an angle of the 3-4-5 triangle, to the degree', round(degrees(atan(3 / 4) if deg == 37 else atan(4 / 3))), deg, 0)
        else:
            check(f'{t} = {label}', ang, eval(label.replace('π', 'pi'), {'pi': pi}))
    for fn, vals in trig['rows']:
        f = {'\\sin': sin, '\\cos': cos, '\\tan': tan}[fn]
        for (t, _), ang, v in zip(trig['angles'], angles, vals):
            if v is None:
                check_true(f'{fn} {t} is undefined (cos = 0)', abs(cos(ang)) < 1e-12)
            else:
                approx = v.startswith('\\approx')
                check(f'{fn} {t} = {v}', f(ang), texval(v.replace('\\approx', '')), 0.01 if approx else 1e-12)
    check('sin 37 = 0.60 within 0.5%', sin(radians(37)) / 0.6, 1, 0.005)
    check('cos 37 = 0.80 within 0.5%', cos(radians(37)) / 0.8, 1, 0.005)


# =====================================================================================================================
# Chapter 1
def prefixes(tex):
    return {a or b: int(e) for a, b, e in re.findall(r'(?:\\text\{(\w+)\}|\\(mu))=10\^\{(-?\d+)\}', tex)}


def decimals(s):
    return len(s.split('.')[1]) if '.' in s else 0


def sigfigs(s):
    """the note's rule: leading zeros don't count, trailing zeros after a decimal point do"""
    return len(s.replace('-', '').replace('.', '').lstrip('0'))


@row('1-1', 'SI base units of mechanics')
def _(tex):
    got = dict(re.findall(r'\\text\{(\w+): (\w+)\}', tex))
    check_true('the SI base units of length, mass and time', got == {'length': 'm', 'mass': 'kg', 'time': 's'}, str(got))


@row('1-1', 'Large prefixes')
def _(tex):
    got = prefixes(tex)
    check_true('k, M, G, T', got == {p: SI_PREFIX[p] for p in 'kMGT'}, str(got))


@row('1-1', 'Small prefixes')
def _(tex):
    got = prefixes(tex)
    check_true('c, m, mu, n, p', got == {p: SI_PREFIX[p] for p in ('c', 'm', 'mu', 'n', 'p')}, str(got))


@row('1-1', 'Scientific notation')
def _(tex):
    form, rule = equations(tex)
    for x in (0.000425, 35000.0, -7.1, 6.02e23):
        n = floor(log10(abs(x)))
        a = x / 10 ** n
        check(f'{x:g} = a x 10^n', texval(form, a=a, n=n) / x, 1, 1e-12)
        holds(f'{x:g}: 1 <= |a| < 10', rule, a=a)


@row('1-1', 'Conversion factor')
def _(tex):
    unit = {'min': 60.0, 's': 1.0}
    q = [float(n) * unit[u] for n, u in re.findall(r'(\d+)\\ \\text\{(min|s)\}', tex)]
    check('1 min / 60 s', q[0] / q[1], 1)
    check('60 s / 1 min', q[2] / q[3], 1)
    check('2.5 min x (60 s / 1 min) = 150 s, and back', 150 * (q[0] / q[1]) / 60 * (q[2] / q[3]), 2.5)


@row('1-1', 'Sums and differences')
def _(tex):
    check_true('the rule is about decimal places', 'decimal places' in tex)
    for xs in (('4.2', '0.135'), ('12.65', '-3.1')):  # each number is known to half a unit of its last digit
        half = [0.5 * 10 ** -decimals(s) for s in xs]
        ratio = sum(half) / max(half)
        check_true(f'{" + ".join(xs)}: about as uncertain as the number with the fewest decimal places', 1 <= ratio < 1.25, f'(ratio {ratio:.3f})')


@row('1-1', 'Products and quotients')
def _(tex):
    check_true('the rule is about significant figures', 'significant figures' in tex)
    for s, n in (('0.0040', 2), ('2.50', 3), ('3.0', 2), ('21.6', 3), ('0.135', 3)):
        check(f'{s} has {n} significant figures', sigfigs(s), n, 0)
    for xs in (('2.50', '0.0040'), ('3.0', '21.6')):  # relative uncertainties add in a product
        rel = {s: 0.5 * 10 ** -decimals(s) / abs(float(s)) for s in xs}
        fewest = min(xs, key=sigfigs)
        ratio = sum(rel.values()) / rel[fewest]
        check_true(f'{" x ".join(xs)}: about as uncertain as {fewest}, the factor with the fewest significant figures', 1 <= ratio < 1.25, f'(ratio {ratio:.3f})')


@row('1-1', 'The metre')
def _(tex):
    n = num(re.search(r'\\frac\{1\}\{((?:\d|\\,)+)\}', tex).group(1))
    check('light covers 1 m in that time', C_LIGHT * (1 / n), 1, 1e-15)


@row('1-2', 'The second')
def _(tex):
    check('9 192 631 770 oscillations', num(re.search(r'=((?:\d|\\,)+)', tex).group(1)), CS_HZ, 0)


@row('1-3', 'Atomic mass unit')
def _(tex):
    u = num(re.search(r'=((?:[\d.]|\\,)+\\times10\^\{-27\})', tex).group(1))
    check('1 u (x 1e27), against CODATA', u * 1e27, U_KG * 1e27, 1e-6)
    check('a carbon-12 atom is 12 u (x 1e26)', 12 * u * 1e26, C12_KG * 1e26, 1e-6)


@row('1-3', 'Density')
def _(tex):
    holds('water: 1.00 kg in a litre', tex, rho=1000.0, m=1.00, V=1e-3)
    holds('the 2.00 cm cube of 21.6 g', tex, rho=2.70e3, m=21.6e-3, V=0.0200 ** 3)


@row('c1+', 'Area and volume units')
def _(tex):
    e = [int(x) for x in re.findall(r'=10\^\{(\d+)\}', tex)]
    cm, L = 1e-2, 1e-3  # in m and in m^3
    check('cm^2 in a m^2', 1 / cm ** 2, 10 ** e[0], 1e-12)
    check('cm^3 in a m^3', 1 / cm ** 3, 10 ** e[1], 1e-12)
    check('L in a m^3', 1 / L, 10 ** e[2], 1e-12)


@row('c1+', 'Density units')
def _(tex):
    e = int(re.search(r'=10\^\{(\d+)\}', tex).group(1))
    check('1 g/cm^3 in kg/m^3', 1e-3 / 1e-2 ** 3, 10 ** e, 1e-12)


@row('c1+', 'Atoms in a sample')
def _(tex):
    holds('12 g of carbon-12 is a mole of atoms', tex, N=N_A, M_sample=0.012, m_atom=C12_KG)


@row('c1+', 'Units of a result')
def _(tex):
    got = dict(re.findall(r'\[(\w)\]=(.+?)(?=,\\quad|$)', tex))
    force = dmul(MASS, LENGTH, PER_TIME, PER_TIME)          # F = ma
    want = {'F': force, 'E': dmul(force, LENGTH), 'P': dmul(force, LENGTH, PER_TIME)}  # W = Fd, P = W/t
    for q in 'FEP':
        check_vec(f'[{q}] in kg, m, s', dims(got[q]), want[q], 0)
    check_vec('[E] is also that of mv^2/2', dmul(MASS, LENGTH, PER_TIME, LENGTH, PER_TIME), want['E'], 0)


# =====================================================================================================================
# Chapter 2: a sample motion x = 2 + 3 sin(1.3t) - 0.4t (it turns around), and its velocity and acceleration
xs_ = lambda t: 2 + 3 * sin(1.3 * t) - 0.4 * t
vs_ = lambda t: 3.9 * cos(1.3 * t) - 0.4
as_ = lambda t: -5.07 * sin(1.3 * t)
T1, T2 = 0.4, 3.1


@row('2-1', 'Displacement')
def _(tex):
    holds('the sum of v dt', tex, Delta_x=integrate(vs_, T1, T2), x_2=xs_(T2), x_1=xs_(T1))


@row('2-1', 'Average velocity')
def _(tex):
    holds('the mean of v(t)', tex, v_avg=integrate(vs_, T1, T2) / (T2 - T1), Delta_x=xs_(T2) - xs_(T1), Delta_t=T2 - T1,
          x_2=xs_(T2), x_1=xs_(T1), t_2=T2, t_1=T1)


@row('2-1', 'Average speed')
def _(tex):
    n = 200000
    dist = sum(abs(xs_(T1 + (i + 1) * (T2 - T1) / n) - xs_(T1 + i * (T2 - T1) / n)) for i in range(n))
    holds('the mean of |v(t)|, and the path walked step by step', tex, 1e-5,
          s_avg=integrate(lambda t: abs(vs_(t)), T1, T2) / (T2 - T1), total_distance=dist, Delta_t=T2 - T1)


@row('2-2', 'Velocity')
def _(tex):
    t = 1.7
    errs = [abs((xs_(t + h) - xs_(t)) / h - vs_(t)) for h in (1e-1, 1e-3, 1e-5)]
    check_true('the secant slope closes in on v as the interval shrinks', errs[0] > errs[1] > errs[2], str(errs))
    check('the slope over 1e-5 s', (xs_(t + 1e-5) - xs_(t)) / 1e-5, vs_(t), 1e-4)
    check('dx/dt', d1(xs_, t), vs_(t), 1e-8)


@row('2-2', 'Speed')
def _(tex):
    t, h = 2.3, 1e-5
    holds('distance per time over a short moment, moving in -x', tex, speed=abs(xs_(t + h) - xs_(t - h)) / (2 * h), v=vs_(t))


@row('2-3', 'Average acceleration')
def _(tex):
    holds('the mean of a(t)', tex, a_avg=integrate(as_, T1, T2) / (T2 - T1), Delta_v=vs_(T2) - vs_(T1), Delta_t=T2 - T1,
          v_2=vs_(T2), v_1=vs_(T1), t_2=T2, t_1=T1)


@row('2-3', 'Acceleration')
def _(tex):
    check('dv/dt', d1(vs_, 1.7), as_(1.7), 1e-8)
    check('d2x/dt2', d2(xs_, 1.7), as_(1.7), 1e-5)


# constant acceleration, integrated step by step
CA = dict(x_0=1.5, v_0=-2.0, a=3.2, t=1.7)
_, _r, _v = state_at(const_acc(CA['a']), (CA['x_0'],), (CA['v_0'],), CA['t'])
CA_x, CA_v = _r[0], _v[0]


@row('2-4', 'Velocity (no x − x₀)')
def _(tex):
    holds('RK4', tex, v=CA_v, v_0=CA['v_0'], a=CA['a'], t=CA['t'])


@row('2-4', 'Position (no v)')
def _(tex):
    holds('RK4', tex, x=CA_x, x_0=CA['x_0'], v_0=CA['v_0'], a=CA['a'], t=CA['t'])


@row('2-4', 'No time')
def _(tex):
    holds('RK4', tex, v=CA_v, v_0=CA['v_0'], a=CA['a'], x=CA_x, x_0=CA['x_0'])


@row('2-4', 'No acceleration')
def _(tex):
    holds('RK4', tex, x=CA_x, x_0=CA['x_0'], v_0=CA['v_0'], v=CA_v, t=CA['t'])


@row('2-4', 'No v₀')
def _(tex):
    holds('RK4', tex, x=CA_x, x_0=CA['x_0'], v=CA_v, a=CA['a'], t=CA['t'])


@row('2-4', 'Average velocity')
def _(tex):
    holds('RK4', tex, v_avg=(CA_x - CA['x_0']) / CA['t'], v_0=CA['v_0'], v=CA_v)


@row('2-5', 'Free fall')
def _(tex):
    for m in (0.2, 50.0):  # the force of gravity mg on each, divided by its mass
        holds(f'a {m} kg body', tex, eqs=[0], a=-m * G / m, g=G)
    check('g in the row', num(re.search(r'g=([\d.]+)', tex).group(1)), G, 0)
    light = state_at(lambda t, r, v: (-0.2 * G / 0.2,), (10.0,), (0.0,), 1.2)[1][0]
    heavy = state_at(lambda t, r, v: (-50 * G / 50,), (10.0,), (0.0,), 1.2)[1][0]
    check('a light and a heavy body fall together', light, heavy, 1e-12)


FF = dict(y_0=3.0, v_0=11.5, t=2.9)
_, _r, _v = state_at(fall1, (FF['y_0'],), (FF['v_0'],), FF['t'])
FF_y, FF_v = _r[0], _v[0]


@row('2-5', 'Velocity')
def _(tex):
    holds('RK4, past the top', tex, v=FF_v, v_0=FF['v_0'], g=G, t=FF['t'])


@row('2-5', 'Height')
def _(tex):
    holds('RK4, past the top', tex, y=FF_y, y_0=FF['y_0'], v_0=FF['v_0'], g=G, t=FF['t'])


@row('2-5', 'No time')
def _(tex):
    holds('RK4, past the top', tex, v=FF_v, v_0=FF['v_0'], g=G, y=FF_y, y_0=FF['y_0'])


a26 = lambda t: 3 * cos(t) + 0.5 * t          # a changing acceleration
v26 = lambda t: 1 + 3 * sin(t) + 0.25 * t * t  # its velocity, from v(0) = 1


@row('2-6', 'Velocity from acceleration')
def _(tex):
    s0 = state_at(lambda t, r, v: (a26(t),), (0.0,), (1.0,), 0.7)
    s1 = state_at(lambda t, r, v: (a26(t),), (0.0,), (1.0,), 2.6)
    check('v1 - v0 (RK4) = area under a-t', s1[2][0] - s0[2][0], integrate(a26, 0.7, 2.6))


@row('2-6', 'Position from velocity')
def _(tex):
    s0 = state_at(lambda t, r, v: (a26(t),), (0.0,), (1.0,), 0.7)
    s1 = state_at(lambda t, r, v: (a26(t),), (0.0,), (1.0,), 2.6)
    check('x1 - x0 (RK4) = area under v-t', s1[1][0] - s0[1][0], integrate(v26, 0.7, 2.6))


@row('c2+', 'Speeding up or slowing down')
def _(tex):
    for t in (0.3, 0.9, 1.6, 2.0, 2.8, 3.5):
        grows = abs(vs_(t + 1e-4)) > abs(vs_(t - 1e-4))
        check_true(f't = {t}: va {"> 0" if vs_(t) * as_(t) > 0 else "< 0"} and the speed {"grows" if grows else "falls"}',
                   grows == (vs_(t) * as_(t) > 0))


V_UP = 13.7


@row('c2+', 'Thrown up: time to the top')
def _(tex):
    t, r, v = run(fall1, (0.0,), (V_UP,), lambda t, r, v: v[0])
    holds('RK4', tex, t_top=t, v_0=V_UP, g=G)


@row('c2+', 'Thrown up: greatest height')
def _(tex):
    t, r, v = run(fall1, (0.0,), (V_UP,), lambda t, r, v: v[0])
    holds('RK4', tex, H=r[0], v_0=V_UP, g=G)


@row('c2+', 'Thrown up: back down')
def _(tex):
    t, r, v = run(fall1, (0.0,), (V_UP,), lambda t, r, v: r[0] if t > 0.01 else 1)
    holds('RK4', tex, t=t, v=v[0], v_0=V_UP, g=G)


@row('c2+', 'Dropped from a height h')
def _(tex):
    t, r, v = run(fall1, (7.4,), (0.0,), lambda t, r, v: r[0])
    holds('RK4', tex, t=t, v=abs(v[0]), h=7.4, g=G)


@row('c2+', 'Stopping distance')
def _(tex):
    t, r, v = run(const_acc(-4.5), (0.0,), (16.0,), lambda t, r, v: v[0])
    holds('RK4', tex, d=r[0], v_0=16.0, a=4.5)


@row('c2+', 'Velocity at mid-time')
def _(tex):
    t1, t2 = 0.3, 1.9
    s1 = state_at(const_acc(CA['a']), (CA['x_0'],), (CA['v_0'],), t1)
    s2 = state_at(const_acc(CA['a']), (CA['x_0'],), (CA['v_0'],), t2)
    sm = state_at(const_acc(CA['a']), (CA['x_0'],), (CA['v_0'],), (t1 + t2) / 2)
    holds('RK4', tex, swap={R'v\left(\tfrac{t_1+t_2}{2}\right)': 'vmid'}, vmid=sm[2][0], v_avg=(s2[1][0] - s1[1][0]) / (t2 - t1))


# =====================================================================================================================
# Chapter 3: sample vectors (the angle between two of them comes from the law of cosines, not from a dot product)
A3, B3, C3 = (1.0, 2.0, -2.0), (3.0, -1.0, 4.0), (-0.5, 2.5, 1.0)
UNIT = {'i': (1.0, 0.0, 0.0), 'j': (0.0, 1.0, 0.0), 'k': (0.0, 0.0, 1.0)}
comps = lambda p, v: {f'{p}_{c}': x for c, x in zip('xyz', v)}


def det3(m):
    """a 3 x 3 determinant by the Leibniz formula (a sum over permutations), independent of any cross-product rule"""
    out = 0.0
    for p in permutations(range(3)):
        inv = sum(1 for i in range(3) for j in range(i + 1, 3) if p[i] > p[j])
        out += (-1) ** inv * m[0][p[0]] * m[1][p[1]] * m[2][p[2]]
    return out


def heron(a, b, c):
    s = (a + b + c) / 2
    return sqrt(s * (s - a) * (s - b) * (s - c))


@row('3-1', 'Components')
def _(tex):
    z = cmath.rect(6.5, radians(118))
    holds('6.5 at 118 deg', tex, a_x=z.real, a_y=z.imag, a=6.5, theta=radians(118))


@row('3-1', 'Magnitude and angle')
def _(tex):
    r, th = cmath.polar(complex(-2.4, 3.7))
    holds('(-2.4, 3.7)', tex, a=r, a_x=-2.4, a_y=3.7, theta=th)


@row('3-1', 'Order of addition')
def _(tex):
    check_vec('a + b = b + a', add(A3, B3), add(B3, A3))


@row('3-1', 'Grouping')
def _(tex):
    check_vec('(a + b) + c = a + (b + c)', add(add(A3, B3), C3), add(A3, add(B3, C3)))


@row('3-1', 'Subtraction')
def _(tex):
    check_vec('b - a = b + (-a)', sub(B3, A3), add(B3, mul(-1, A3)))
    check_vec('and (b - a) + a = b', add(sub(B3, A3), A3), B3)


@row('3-2', 'Unit-vector notation')
def _(tex):
    check_vec('a_x i + a_y j + a_z k', add(*(mul(c, UNIT[u]) for c, u in zip(A3, 'ijk'))), A3)


@row('3-2', 'Adding by components')
def _(tex):
    r = add(A3, B3)
    holds('component by component', tex, eqs=[1, 2, 3], **comps('r', r), **comps('a', A3), **comps('b', B3))
    phi = angle_between(A3, B3)
    check('|r|^2 by the law of cosines', dot(r, r), dot(A3, A3) + dot(B3, B3) + 2 * norm(A3) * norm(B3) * cos(phi))


@row('3-3', 'Scalar times vector')
def _(tex):
    for s in (-2.5, 1.5):
        sa = mul(s, A3)
        check(f's = {s}: length times |s|', norm(sa), abs(s) * norm(A3))
        check(f's = {s}: angle to a', degrees(angle_between(sa, A3)), 180 if s < 0 else 0, 1e-6)


@row('3-3', 'Dot product')
def _(tex):
    holds('law-of-cosines angle', tex, swap={R'\vec{a}\cdot\vec{b}': 'D'}, D=dot(A3, B3), a=norm(A3), b=norm(B3), phi=angle_between(A3, B3))


@row('3-3', 'Dot product by components')
def _(tex):
    holds('ab cos(phi), phi from the law of cosines', tex, swap={R'\vec{a}\cdot\vec{b}': 'D'},
          D=norm(A3) * norm(B3) * cos(angle_between(A3, B3)), **comps('a', A3), **comps('b', B3))


@row('3-3', 'Order of a dot product')
def _(tex):
    check('a.b = b.a', dot(A3, B3), dot(B3, A3))


@row('3-3', 'Unit vectors, dot')
def _(tex):
    for part in equations(tex):
        want = float(part.rsplit('=', 1)[1])
        for p, q in re.findall(r'\\hat\{(\w)\}\\cdot\\hat\{(\w)\}', part):
            check(f'{p}.{q}', dot(UNIT[p], UNIT[q]), want, 0)


@row('3-3', 'Cross product, size')
def _(tex):
    c = cross(A3, B3)
    holds('law-of-cosines angle', tex, swap={R'|\vec{a}\times\vec{b}|': 'S'}, S=norm(c), a=norm(A3), b=norm(B3), phi=angle_between(A3, B3))
    check('perpendicular to a', dot(c, A3), 0)
    check('perpendicular to b', dot(c, B3), 0)
    check_true('right-handed: det[a, b, a x b] > 0', det3([A3, B3, c]) > 0)


@row('3-3', 'Order of a cross product')
def _(tex):
    check_vec('b x a = -(a x b)', cross(B3, A3), mul(-1, cross(A3, B3)))


def cross_from_tex(tex, a, b):
    """the vector the row's three component formulas give"""
    terms = dict((u, e) for e, u in re.findall(r'\(([^()]*)\)\\,\\hat\{([ijk])\}', tex))
    return tuple(texval(terms[u], **comps('a', a), **comps('b', b)) for u in 'ijk')


@row('3-3', 'Cross product by components')
def _(tex):
    for a, b in ((A3, B3), (B3, C3), ((2.0, 0.0, 0.0), (0.0, 3.0, 0.0))):
        c = cross_from_tex(tex, a, b)
        check(f'{a} x {b}: perpendicular to a', dot(c, a), 0)
        check(f'{a} x {b}: perpendicular to b', dot(c, b), 0)
        check(f'{a} x {b}: size ab sin(phi)', norm(c), norm(a) * norm(b) * sin(angle_between(a, b)))
        check_true(f'{a} x {b}: right-handed', det3([a, b, c]) > 0)


@row('3-3', 'Cross product as a determinant')
def _(tex):
    check_true('the determinant has i j k on top, then a, then b', R'\hat{i}&\hat{j}&\hat{k}\\a_x&a_y&a_z\\b_x&b_y&b_z' in tex)
    by_det = tuple(det3([UNIT[u], A3, B3]) for u in 'ijk')  # each component: the top row replaced by a unit vector
    minor = lambda r, c: [[x for k, x in enumerate(row_) if k != c] for row_ in r]
    m2 = lambda m: m[0][0] * m[1][1] - m[0][1] * m[1][0]
    expansion = (m2(minor([A3, B3], 0)), -m2(minor([A3, B3], 1)), m2(minor([A3, B3], 2)))  # the j term takes the minus
    check_vec('expanding along the top row', expansion, by_det)
    check_vec('the same as a x b', by_det, cross(A3, B3))


@row('3-3', 'Unit vectors, cross')
def _(tex):
    for p, q, r in re.findall(r'\\hat\{(\w)\}\\times\\hat\{(\w)\}=\\hat\{(\w)\}', tex):
        check_vec(f'{p} x {q} = {r}', cross(UNIT[p], UNIT[q]), UNIT[r], 0)
        check_vec(f'{q} x {p} = -{r}', cross(UNIT[q], UNIT[p]), mul(-1, UNIT[r]), 0)
    check_vec('i x i = 0', cross(UNIT['i'], UNIT['i']), (0, 0, 0), 0)


@row('c3+', 'Unit vector along a')
def _(tex):
    u = mul(1 / norm(A3), A3)
    check('length 1', norm(u), 1)
    check('along a', degrees(angle_between(u, A3)), 0, 1e-6)


@row('c3+', 'Magnitude in 3D')
def _(tex):
    holds('two right triangles', tex, swap={R'|\vec{a}|': 'A'}, A=sqrt(sqrt(A3[0] ** 2 + A3[1] ** 2) ** 2 + A3[2] ** 2), **comps('a', A3))


@row('c3+', 'Angle between two vectors')
def _(tex):
    holds('law-of-cosines angle', tex, swap={R'\vec{a}\cdot\vec{b}': 'D'}, phi=angle_between(A3, B3), D=dot(A3, B3), a=norm(A3), b=norm(B3))


@row('c3+', 'Component of a along b')
def _(tex):
    holds('the projection a cos(phi)', tex, swap={R'\vec{a}\cdot\hat{b}': 'Dhat', R'\vec{a}\cdot\vec{b}': 'D'},
          a_b=norm(A3) * cos(angle_between(A3, B3)), Dhat=dot(A3, mul(1 / norm(B3), B3)), D=dot(A3, B3), b=norm(B3))


@row('c3+', 'Size of a sum')
def _(tex):
    holds('law-of-cosines angle', tex, swap={R'|\vec{a}+\vec{b}|': 'S'}, S=norm(add(A3, B3)), a=norm(A3), b=norm(B3), phi=angle_between(A3, B3))


@row('c3+', 'Areas')
def _(tex):
    tri = heron(norm(A3), norm(B3), norm(sub(A3, B3)))
    holds('Heron’s formula for the triangle a, b, a - b', tex, swap={R'|\vec{a}\times\vec{b}|': 'X'},
          X=norm(cross(A3, B3)), parallelogram=2 * tri, triangle=tri)


@row('c3+', 'Perpendicular or parallel')
def _(tex):
    p = sub(B3, mul(dot(B3, A3) / dot(A3, A3), A3))  # b with its part along a removed
    check('perpendicular (90 deg by the law of cosines): a.p', dot(A3, p), 0)
    check('the angle is 90 deg', degrees(angle_between(A3, p)), 90, 1e-9)
    q = mul(-1.5, A3)
    check_vec('parallel (180 deg): a x q', cross(A3, q), (0, 0, 0))
    check_true('neither: a.b and a x b are both non-zero', abs(dot(A3, B3)) > 0.1 and norm(cross(A3, B3)) > 0.1)


@row('c3+', 'Angle in the right quadrant')
def _(tex):
    check_true('the rule adds 180 deg when a_x < 0', R'a_x<0' in tex and R'+180^\circ' in tex)
    for ax, ay in ((-3.0, 4.0), (-3.0, -4.0), (-1.0, 0.2)):
        th = degrees(atan(ay / ax)) + 180
        check(f'({ax}, {ay}) against atan2', th % 360, degrees(atan2(ay, ax)) % 360)
    check_true('tan^-1 stays between -90 and 90 deg', -90 < degrees(atan(-1e12)) and degrees(atan(1e12)) < 90)


# =====================================================================================================================
# Chapter 4
R3a = lambda t: (t + 1 - cos(t), -t * t, 2 * t + 0.05 * t ** 3)   # a sample path in 3D...
V3a = lambda t: (1 + sin(t), -2 * t, 2 + 0.15 * t * t)           # ...its velocity...
A3a = lambda t: (cos(t), -2.0, 0.3 * t)                          # ...and its acceleration
acc3 = lambda t, r, v: A3a(t)


@row('4-1', 'Position vector')
def _(tex):
    x, y, z = 2.0, -3.0, 1.5
    r = add(mul(x, UNIT['i']), mul(y, UNIT['j']), mul(z, UNIT['k']))
    check_vec('x i + y j + z k', r, (x, y, z))
    check('its length is the distance from the origin', norm(r), sqrt(sqrt(x * x + y * y) ** 2 + z * z))


@row('4-1', 'Displacement')
def _(tex):
    s1, s2 = state_at(acc3, (1.0, 0.0, 2.0), V3a(0), 0.4), state_at(acc3, (1.0, 0.0, 2.0), V3a(0), 2.2)
    dr = sub(s2[1], s1[1])
    check_vec('r2 - r1 (RK4) = (sum of v dt) per component', dr, tuple(integrate(lambda t: V3a(t)[k], 0.4, 2.2) for k in range(3)))


@row('4-2', 'Average velocity')
def _(tex):
    s1, s2 = state_at(acc3, (1.0, 0.0, 2.0), V3a(0), 0.4), state_at(acc3, (1.0, 0.0, 2.0), V3a(0), 2.2)
    check_vec('dr/dt over the interval = the mean of v(t)', mul(1 / 1.8, sub(s2[1], s1[1])),
              tuple(integrate(lambda t: V3a(t)[k], 0.4, 2.2) / 1.8 for k in range(3)))


@row('4-2', 'Velocity')
def _(tex):
    t = 1.3
    errs = [angle_between(mul(1 / h, sub(R3a(t + h), R3a(t))), V3a(t)) for h in (1e-1, 1e-3, 1e-5)]
    check_true('the chord turns onto v as it shrinks: v is tangent to the path', errs[0] > errs[1] > errs[2] and errs[2] < 1e-4, str(errs))
    check('|chord|/dt -> |v|', norm(sub(R3a(t + 1e-6), R3a(t - 1e-6))) / 2e-6, norm(V3a(t)), 1e-8)


@row('4-2', 'Velocity components')
def _(tex):
    for k, c in enumerate('xyz'):
        check(f'v_{c} = d{c}/dt', d1(lambda t: R3a(t)[k], 1.3), V3a(1.3)[k], 1e-8)


@row('4-3', 'Average acceleration')
def _(tex):
    s1, s2 = state_at(acc3, (1.0, 0.0, 2.0), V3a(0), 0.5), state_at(acc3, (1.0, 0.0, 2.0), V3a(0), 2.0)
    check_vec('dv/dt over the interval (RK4) = the mean of a(t)', mul(1 / 1.5, sub(s2[2], s1[2])),
              tuple(integrate(lambda t: A3a(t)[k], 0.5, 2.0) / 1.5 for k in range(3)))


@row('4-3', 'Acceleration')
def _(tex):
    check_vec('dv/dt', tuple(d1(lambda t: V3a(t)[k], 1.1) for k in range(3)), A3a(1.1), 1e-8)


@row('4-3', 'Acceleration components')
def _(tex):
    for k, c in enumerate('xyz'):
        check(f'a_{c} = dv_{c}/dt', d1(lambda t: V3a(t)[k], 1.1), A3a(1.1)[k], 1e-8)
        check(f'a_{c} = d2{c}/dt2', d2(lambda t: R3a(t)[k], 1.1), A3a(1.1)[k], 1e-5)


V0P, TH0 = 15.0, radians(52)
LAUNCH = (cmath.rect(V0P, TH0).real, cmath.rect(V0P, TH0).imag)
_, PR, PV = state_at(gravity, (1.0, 2.0), LAUNCH, 1.9)
P4 = dict(v_0=V0P, theta_0=TH0, t=1.9)


@row('4-4', 'Launch components')
def _(tex):
    holds('15.0 m/s at 52 deg', tex, v_0x=LAUNCH[0], v_0y=LAUNCH[1], v_0=V0P, theta_0=TH0)


@row('4-4', 'Horizontal motion')
def _(tex):
    holds('RK4', tex, x=PR[0], x_0=1.0, **P4)


@row('4-4', 'Vertical motion')
def _(tex):
    holds('RK4', tex, y=PR[1], y_0=2.0, g=G, **P4)


@row('4-4', 'Vertical velocity')
def _(tex):
    holds('RK4', tex, v_y=PV[1], g=G, **P4)


@row('4-4', 'Vertical velocity, no time')
def _(tex):
    holds('RK4', tex, v_y=PV[1], v_0=V0P, theta_0=TH0, g=G, y=PR[1], y_0=2.0)


@row('4-4', 'Path (trajectory)')
def _(tex):
    for T in (0.5, 1.2, 2.0):
        _, r, _ = state_at(gravity, (0.0, 0.0), LAUNCH, T)
        holds(f'RK4 at t = {T}', tex, y=r[1], x=r[0], theta_0=TH0, g=G, v_0=V0P)


def landing(v0, deg):
    z = cmath.rect(v0, radians(deg))
    return run(gravity, (0.0, 0.0), (z.real, z.imag), lambda t, r, v: r[1] if t > 0.01 else 1)


@row('4-4', 'Horizontal range')
def _(tex):
    holds('RK4', tex, R=landing(V0P, 52)[1][0], v_0=V0P, g=G, theta_0=TH0)
    r40, r45, r50 = (landing(V0P, d)[1][0] for d in (40, 45, 50))
    check_true('45 deg goes farthest', r45 > r40 and r45 > r50)


RC, VC = 2.5, 4.0  # uniform circular motion
circ = lambda t: (RC * cos(VC * t / RC), RC * sin(VC * t / RC))
central = lambda t, r, v: mul(-dot(v, v) / dot(r, r), r)  # pulled toward the centre with v^2/r


@row('4-5', 'Centripetal acceleration')
def _(tex):
    a = (d2(lambda t: circ(t)[0], 0.7), d2(lambda t: circ(t)[1], 0.7))
    holds('the second derivative of the motion', tex, 1e-5, a=norm(a), v=VC, r=RC)
    check('toward the centre', dot(mul(1 / norm(a), a), mul(1 / RC, circ(0.7))), -1, 1e-6)


@row('4-5', 'Period')
def _(tex):
    t, _, _ = run(central, (RC, 0.0), (0.0, VC), lambda t, r, v: r[1] if t > 0.1 else 1)  # half a lap, by RK4
    holds('one lap, timed by RK4', tex, T=2 * t, r=RC, v=VC)


# frames: B moves along x at constant velocity relative to A; P accelerates inside B
xBA = lambda t: 5 + 20 * t
xPB = lambda t: -1.5 * t + 0.3 * t * t


@row('4-6', 'Positions')
def _(tex):
    _, r, _ = state_at(const_acc(0.6), (xPB(0) + xBA(0),), (-1.5 + 20,), 2.4)  # P on the ground, by RK4
    holds('RK4 in frame A', tex, x_PA=r[0], x_PB=xPB(2.4), x_BA=xBA(2.4))


@row('4-6', 'Velocities')
def _(tex):
    holds('derivatives', tex, v_PA=d1(lambda t: xPB(t) + xBA(t), 2.4), v_PB=d1(xPB, 2.4), v_BA=d1(xBA, 2.4))


@row('4-6', 'Accelerations')
def _(tex):
    holds('second derivatives', tex, 1e-5, a_PA=d2(lambda t: xPB(t) + xBA(t), 2.4), a_PB=d2(xPB, 2.4))
    check('B does not accelerate', d2(xBA, 2.4), 0, 1e-5)


rBA = lambda t: (1 + 3.0 * t, 2 - 1.0 * t)
rPB = lambda t: (0.5 * t * t, 2 * t)


@row('4-7', 'Position vectors')
def _(tex):
    _, r, _ = state_at(lambda t, r, v: (1.0, 0.0), add(rPB(0), rBA(0)), (3.0, 1.0), 2.4)  # v_PB(0) + v_BA = (0, 2) + (3, -1)
    check_vec('RK4 in frame A', r, add(rPB(2.4), rBA(2.4)))


@row('4-7', 'Velocity vectors')
def _(tex):
    rPA = lambda t: add(rPB(t), rBA(t))
    for k in range(2):
        check(f'component {k + 1}', d1(lambda t: rPA(t)[k], 2.4), d1(lambda t: rPB(t)[k], 2.4) + d1(lambda t: rBA(t)[k], 2.4), 1e-8)


@row('4-7', 'Acceleration vectors')
def _(tex):
    rPA = lambda t: add(rPB(t), rBA(t))
    for k in range(2):
        check(f'component {k + 1}', d2(lambda t: rPA(t)[k], 2.4), d2(lambda t: rPB(t)[k], 2.4), 1e-5)


@row('c4+', 'Projectile: time to the top')
def _(tex):
    t, r, v = run(gravity, (0.0, 0.0), LAUNCH, lambda t, r, v: v[1])
    holds('RK4', tex, t_top=t, v_0=V0P, theta_0=TH0, g=G)


@row('c4+', 'Projectile: greatest height')
def _(tex):
    t, r, v = run(gravity, (0.0, 0.0), LAUNCH, lambda t, r, v: v[1])
    holds('RK4', tex, H=r[1], v_0=V0P, theta_0=TH0, g=G)


@row('c4+', 'Projectile: time of flight')
def _(tex):
    holds('RK4', tex, T=landing(V0P, 52)[0], v_0=V0P, theta_0=TH0, g=G)


@row('c4+', 'Same range')
def _(tex):
    holds('28 and 62 deg, RK4', tex, swap={R'R(\theta_0)': 'R1', R'R(90^\circ-\theta_0)': 'R2'},
          R1=landing(V0P, 28)[1][0], R2=landing(V0P, 62)[1][0])


@row('c4+', 'Angular speed')
def _(tex):
    t_half, _, _ = run(central, (RC, 0.0), (0.0, VC), lambda t, r, v: r[1] if t > 0.1 else 1)
    _, r1, _ = state_at(central, (RC, 0.0), (0.0, VC), 0.2)
    _, r2, _ = state_at(central, (RC, 0.0), (0.0, VC), 0.9)
    omega = (atan2(r2[1], r2[0]) - atan2(r1[1], r1[0])) / 0.7
    _, _, v1 = state_at(central, (RC, 0.0), (0.0, VC), 0.9 - 1e-4)
    _, _, v2 = state_at(central, (RC, 0.0), (0.0, VC), 0.9 + 1e-4)
    holds('RK4', tex, 1e-6, omega=omega, v=VC, r=RC, T=2 * t_half, a=norm(mul(1 / 2e-4, sub(v2, v1))))


@row('c4+', 'Frequency')
def _(tex):
    t_half, _, _ = run(central, (RC, 0.0), (0.0, VC), lambda t, r, v: r[1] if t > 0.1 else 1)
    turned, prev = 0.0, 0.0
    for t, r, v in path(central, (RC, 0.0), (0.0, VC), 10.0, 1e-3)[1:]:
        ang = atan2(r[1], r[0])
        turned += (ang - prev + pi) % (2 * pi) - pi
        prev = ang
    holds('laps per second over 10 s', tex, f=turned / (2 * pi) / 10.0, T=2 * t_half)


@row('c4+', 'Circular motion in components')
def _(tex):
    t = 0.7
    vel = (d1(lambda s: circ(s)[0], t), d1(lambda s: circ(s)[1], t))
    acc = (d2(lambda s: circ(s)[0], t), d2(lambda s: circ(s)[1], t))
    for part, want, tol in zip(equations(tex), (vel, acc), (1e-8, 1e-5)):
        m = re.fullmatch(r'\\vec\{(\w)\}=(.*)\((.*)\)', part)
        got = tuple(texval(m.group(2) + '(' + c + ')', v=VC, r=RC, theta=VC * t / RC) for c in m.group(3).split(R',\ '))
        check_vec(f'{m.group(1)}: derivatives of r(cos theta, sin theta)', got, want, tol)


@row('c4+', 'Heading straight across a river')
def _(tex):
    t, r, v = run(lambda t, r, v: (0.0, 0.0), (0.0, 0.0), (1.8, 3.2), lambda t, r, v: r[1] - 75.0)
    holds('RK4', tex, t=t, w=75.0, v_boat=3.2, drift=r[0], v_river=1.8)


# =====================================================================================================================
# Chapter 5
def two(a11, a12, b1, a21, a22, b2):
    """solves a11 x + a12 y = b1, a21 x + a22 y = b2"""
    det = a11 * a22 - a12 * a21
    return (b1 * a22 - a12 * b2) / det, (a11 * b2 - b1 * a21) / det


def follow_floor(m, a_floor, T=2.0):
    """the normal force that makes a block (forces N up, mg down) keep up with a floor accelerating at a_floor, found by
    bisection over RK4 runs"""
    gap = lambda N: state_at(lambda t, r, v: ((N - m * G) / m,), (0.0,), (0.0,), T)[1][0] - 0.5 * a_floor * T * T
    return solve(gap, -10 * m * G, 10 * m * G, 60)


M51 = 2.5
forces51 = lambda r, v: [(4.0, 1.0, -2.0), (-1.0, 3.0, 0.5), mul(-0.8, v)]  # two pulls and a drag
acc51 = lambda t, r, v: mul(1 / M51, add(*forces51(r, v)))
S51 = [state_at(acc51, (0.0, 0.0, 0.0), (0.0, 0.0, 0.0), 1.5 + d) for d in (-1e-4, 0.0, 1e-4)]
A51 = mul(1 / 2e-4, sub(S51[2][2], S51[0][2]))   # the acceleration, from the RK4 velocities
F51 = add(*forces51(S51[1][1], S51[1][2]))       # the net force at that moment


@row('5-1', 'First law')
def _(tex):
    F1, F2 = polar(5.0, 30), polar(7.0, 150)
    F3 = mul(-1, add(F1, F2))
    _, _, v = state_at(lambda t, r, v: mul(1 / 2.0, add(F1, F2, F3)), (0.0, 0.0), (1.2, -0.7), 10.0)
    check_vec('balanced forces: the velocity 10 s later', v, (1.2, -0.7))
    _, _, v = state_at(lambda t, r, v: mul(1 / 2.0, add(F1, F2)), (0.0, 0.0), (1.2, -0.7), 10.0)
    check_true('unbalanced: it changes', norm(sub(v, (1.2, -0.7))) > 1)


@row('5-1', 'Second law')
def _(tex):
    check_vec('F_net = m a (a from the motion)', F51, mul(M51, A51), 1e-6)


@row('5-1', 'Second law by components')
def _(tex):
    holds('the same motion', tex, m=M51, **comps('a', A51), **{f'F_net_{c}': F51[k] for k, c in enumerate('xyz')})


@row('5-1', 'The newton')
def _(tex):
    check_vec('kg m/s^2: mass times acceleration', dims(tex.split('=')[1]), dmul(MASS, LENGTH, PER_TIME, PER_TIME), 0)


@row('5-2', 'Gravitational force')
def _(tex):
    holds('Newton’s gravitation for 3.0 kg at the surface', tex, 0.01, F_g=6.674e-11 * 5.972e24 * 3.0 / 6.371e6 ** 2, m=3.0, g=G)


@row('5-2', 'Weight')
def _(tex):
    holds('the scale’s push on a body at rest', tex, W=follow_floor(3.0, 0.0), m=3.0, g=G)


@row('5-2', 'Normal force on a level floor')
def _(tex):
    holds('the floor’s push on a body at rest', tex, F_N=follow_floor(3.0, 0.0), m=3.0, g=G)


@row('5-2', 'Normal force, accelerating')
def _(tex):
    for a in (1.8, -2.6):
        holds(f'a floor accelerating at {a} m/s^2', tex, F_N=follow_floor(3.0, a), m=3.0, g=G, a_y=a)


@row('5-3', 'Third law')
def _(tex):
    m1, m2, F = 2.0, 3.0, 15.0
    a, _ = two(m1, 1, F, m2, -1, 0)  # F pushes block 1, which pushes block 2
    on2 = m2 * a          # from block 2's own equation
    on1 = m1 * a - F      # from block 1's own equation
    check('the pair of contact forces is equal and opposite', on1, -on2)


@row('5-3', 'Gravity on an incline')
def _(tex):
    m, th = 3.0, radians(25)
    Fg = (0.0, -m * G)
    holds('gravity projected on the slope (rising to the right) and into it', tex,
          F_g_parallel=dot(Fg, (-cos(th), -sin(th))), F_g_perp=dot(Fg, (sin(th), -cos(th))), m=m, g=G, theta=th)


@row('5-3', 'Tension')
def _(tex):
    M, ms, F = 4.0, 1e-9, 12.0
    check('a nearly massless string pulls the block with the hand’s force', M * F / (M + ms), F, 1e-8)
    m1, m2, I, R = 3.0, 2.0, 1e-9, 0.1  # a pulley with almost no moment of inertia: (T1 - T2) R = I a / R
    a = (m1 - m2) * G / (m1 + m2 + I / R ** 2)
    check('the same tension on both sides of a light pulley', m1 * (G - a), m2 * (G + a), 1e-6)


@row('c5+', 'Equilibrium')
def _(tex):
    check_true('both sums are zero', R'\sum F_x=0' in tex and R'\sum F_y=0' in tex)
    m = 12.0  # a sign hung from two cables, 30 and 45 deg above the horizontal
    T1, T2 = two(cos(radians(30)), -cos(radians(45)), 0, sin(radians(30)), sin(radians(45)), m * G)
    net = add(polar(T1, 150), polar(T2, 45), (0.0, -m * G))
    check_vec('sum of the forces', net, (0.0, 0.0), 1e-9)
    _, r, _ = state_at(lambda t, r, v: mul(1 / m, net), (0.0, 0.0), (0.0, 0.0), 5.0)
    check_vec('it stays put', r, (0.0, 0.0), 1e-9)


def incline(m, th, along=0.0, friction=0.0):
    """a block on a slope rising to the right at th: the normal force (by bisection, so the block doesn't leave or sink
    into the slope) and the acceleration vector. along: an extra force up the slope; friction: mu_k, sliding down."""
    n = (-sin(th), cos(th))
    up = (cos(th), sin(th))

    def accel(N):
        return mul(1 / m, add((0.0, -m * G), mul(N, n), mul(along + friction * N, up)))
    N = solve(lambda N: dot(accel(N), n), 0.0, 10 * m * G)
    return N, accel(N)


@row('c5+', 'Frictionless incline')
def _(tex):
    N, a = incline(3.0, radians(25))
    holds('vector sum', tex, a=norm(a), g=G, theta=radians(25), F_N=N, m=3.0)


@row('c5+', 'Table and hanging block')
def _(tex):
    M, m = 4.0, 1.5
    a, T = two(M, -1, 0, m, 1, m * G)  # M a = T; m a = mg - T
    holds('the two blocks’ equations', tex, a=a, T=T, m=m, M=M, g=G)


@row('c5+', 'Atwood machine')
def _(tex):
    m1, m2 = 3.0, 2.0
    a, T = two(m1, 1, m1 * G, m2, -1, -m2 * G)  # m1 a = m1 g - T; m2 a = T - m2 g
    holds('the two blocks’ equations', tex, a=a, T=T, m_1=m1, m_2=m2, g=G)


@row('c5+', 'Two blocks pushed together')
def _(tex):
    m1, m2, F = 2.0, 3.0, 15.0
    a, P = two(m1, 1, F, m2, -1, 0)  # m1 a = F - P; m2 a = P
    holds('the two blocks’ equations', tex, a=a, F_contact=P, F=F, m_1=m1, m_2=m2)


@row('c5+', 'Scale in an elevator')
def _(tex):
    for a in (1.8, -2.6, -G):
        holds(f'a = {a:g}', tex, F_N=follow_floor(3.0, a), m=3.0, g=G, a=a)


@row('c5+', 'Pulling up at an angle')
def _(tex):
    m, F, th = 5.0, 20.0, radians(30)
    N = solve(lambda N: N + F * sin(th) - m * G, -100, 200)
    holds('no vertical acceleration', tex, F_N=N, m=m, g=G, F=F, theta=th)
    check('pushing down at the angle', solve(lambda N: N - F * sin(th) - m * G, -100, 200), m * G + F * sin(th))


# =====================================================================================================================
# Chapter 6
@row('6-1', 'Static friction')
def _(tex):
    m, mus = 4.0, 0.6
    FN = m * G
    for share in (0.2, 0.7, 1.0):
        push = share * mus * FN
        needed = solve(lambda f: push - f, -100, 100)  # the friction that keeps the block from accelerating
        holds(f'a push of {share:g} x mu_s F_N', tex, f_s=needed, f_s_max=mus * FN, mu_s=mus, F_N=FN)


@row('6-1', 'Kinetic friction')
def _(tex):
    m, muk = 4.0, 0.3
    stop = lambda t, r, v: (-muk * G,)
    _, _, v1 = state_at(stop, (0.0,), (5.0,), 0.2)
    _, _, v2 = state_at(stop, (0.0,), (5.0,), 0.6)
    holds('m x the deceleration of a sliding block', tex, f_k=m * (v1[0] - v2[0]) / 0.4, mu_k=muk, F_N=m * G)


DR = dict(m=80.0, C=0.6, rho=1.2, A=0.7)
_k = 0.5 * DR['C'] * DR['rho'] * DR['A']
V_T = state_at(lambda t, r, v: (G - _k * v[0] * abs(v[0]) / DR['m'],), (0.0,), (0.0,), 150.0, 1e-2)[2][0]  # falls for 150 s


@row('6-2', 'Drag force')
def _(tex):
    check_vec('units: (kg/m^3)(m^2)(m/s)^2 is a force', dmul((1, -3, 0), (0, 2, 0), (0, 2, -2)), dims(R'\text{N}'), 0)
    holds('at the terminal speed (RK4) drag equals the weight', tex, D=DR['m'] * G, C=DR['C'], rho=DR['rho'], A=DR['A'], v=V_T)


@row('6-2', 'Terminal speed')
def _(tex):
    holds('RK4: 150 s of falling', tex, v_t=V_T, F_g=DR['m'] * G, C=DR['C'], rho=DR['rho'], A=DR['A'])


@row('6-3', 'Centripetal acceleration')
def _(tex):
    a = (d2(lambda t: circ(t)[0], 0.7), d2(lambda t: circ(t)[1], 0.7))
    holds('the second derivative of the motion', tex, 1e-5, a=norm(a), v=VC, R=RC)


@row('6-3', 'Centripetal force')
def _(tex):
    m, R, v = 1.5, 2.0, 3.0

    def drift(F):  # the radius after a quarter lap with a pull F toward the centre
        _, r, _ = state_at(lambda t, r, v_: mul(-F / m / norm(r), r), (R, 0.0), (0.0, v), (pi / 2) * R / v)
        return norm(r) - R
    F = solve(drift, 0.5 * m * v * v / R, 2 * m * v * v / R, 50)
    holds('the pull that keeps a circle, by bisection over RK4 runs', tex, F=F, m=m, v=v, R=R)


@row('c6+', 'Sliding down a rough incline')
def _(tex):
    N, a = incline(2.0, radians(35), friction=0.3)
    holds('vector sum', tex, a=norm(a), g=G, theta=radians(35), mu_k=0.3)


@row('c6+', 'About to slip on an incline')
def _(tex):
    mus = 0.45
    th = solve(lambda th: G * sin(th) - mus * G * cos(th), 0.01, 1.5)
    holds('the steepest angle at rest', tex, theta=th, mu_s=mus)


@row('c6+', 'Sliding to a stop')
def _(tex):
    muk, v0 = 0.3, 7.5
    stop = lambda t, r, v: (-muk * G if v[0] > 0 else 0.0,)
    _, _, v1 = state_at(stop, (0.0,), (v0,), 0.2)
    _, _, v2 = state_at(stop, (0.0,), (v0,), 0.6)
    t, r, v = run(stop, (0.0,), (v0,), lambda t, r, v: v[0])
    holds('RK4', tex, a=(v2[0] - v1[0]) / 0.4, mu_k=muk, g=G, d=r[0], v_0=v0)


@row('c6+', 'Flat curve, top speed')
def _(tex):
    mus, R = 0.6, 40.0
    v = solve(lambda v: v * v / R - mus * G, 0.1, 100)
    holds('friction at its most', tex, v_max=v, mu_s=mus, g=G, R=R)


@row('c6+', 'Banked curve, no friction')
def _(tex):
    v, R = 15.0, 50.0
    th = solve(lambda th: G / cos(th) * sin(th) - v * v / R, 0.001, 1.5)  # N cos(th) = mg; N sin(th) = mv^2/R
    holds('the normal force alone turns the car', tex, theta=th, v=v, g=G, R=R)


@row('c6+', 'Top of a hill')
def _(tex):
    m, v, R = 1000.0, 9.0, 30.0
    N = solve(lambda N: (m * G - N) - m * v * v / R, -1e5, 1e5)
    holds('the net force down supplies mv^2/R', tex, F_N=N, m=m, g=G, v=v, R=R)
    check('contact is lost at sqrt(gR)', solve(lambda u: m * G - m * u * u / R, 0.1, 100), sqrt(G * R))


@row('c6+', 'Bottom of a dip')
def _(tex):
    m, v, R = 1000.0, 9.0, 30.0
    N = solve(lambda N: (N - m * G) - m * v * v / R, -1e5, 1e5)
    holds('the net force up supplies mv^2/R', tex, F_N=N, m=m, g=G, v=v, R=R)


@row('c6+', 'Vertical loop, top')
def _(tex):
    m, R = 0.5, 1.2
    N = lambda v: m * v * v / R - m * G  # the track's push at the top
    holds('the slowest speed with N >= 0', tex, v_top=solve(N, 0.1, 50), g=G, R=R)
    check_true('10% slower would need the track to pull', N(0.9 * sqrt(G * R)) < 0)


@row('c6+', 'Conical pendulum')
def _(tex):
    m, L, th = 0.4, 1.2, radians(35)
    r = L * sin(th)
    T = solve(lambda T: T * cos(th) - m * G, 0, 100)                    # vertical balance
    v = solve(lambda v: T * sin(th) - m * v * v / r, 0.01, 50)          # the horizontal pull turns it
    holds('force balance', tex, theta=th, v=v, g=G, r=r, T_period=2 * pi * r / v, L=L)
    check('tension mg/cos(theta)', T, m * G / cos(th))


# =====================================================================================================================
# Chapter 7
def samples(acc, r0, v0, T, n=4000):
    """n equal RK4 steps from 0 to T: the states (t, r, v), and the step"""
    h, t, r, v = T / n, 0.0, tuple(r0), tuple(v0)
    out = [(t, r, v)]
    for i in range(n):
        r, v = rk4(acc, t, r, v, h)
        t = (i + 1) * h
        out.append((t, r, v))
    return out, h


def line_integral(F, r, n=4000):
    """the work of a force field F along the path r(s), s from 0 to 1"""
    return integrate(lambda s: dot(F(r(s)), tuple((a - b) / 2e-6 for a, b in zip(r(s + 1e-6), r(s - 1e-6)))), 0, 1, n)


# a mass on a spring, with friction-like damping and a steady push: forces that change along the way
M72, K72, B72, F72 = 2.0, 5.0, 0.4, 3.0
F72f = lambda x, v: -K72 * x - B72 * v + F72
S72, H72 = samples(lambda t, r, v: (F72f(r[0], v[0]) / M72,), (0.5,), (1.0,), 3.0)
W72 = simpson([F72f(s[1][0], s[2][0]) * s[2][0] for s in S72], H72)  # the work: the sum of F v dt
KE72 = [0.5 * M72 * s[2][0] ** 2 for s in S72]
# lifting with a varying hand force, from rest
M73 = 2.0
Fa73 = lambda t: M73 * G + 3 * sin(2 * t)
S73, H73 = samples(lambda t, r, v: ((Fa73(t) - M73 * G) / M73,), (0.0,), (0.0,), 2.5)
Wa73 = simpson([Fa73(s[0]) * s[2][0] for s in S73], H73)
Wg73 = simpson([-M73 * G * s[2][0] for s in S73], H73)
dK73 = 0.5 * M73 * S73[-1][2][0] ** 2
curve73 = lambda s: (4 * s, 3 - 2.5 * s + 0.8 * sin(pi * s))  # from (0, 3) to (4, 0.5), not straight


@row('7-1', 'Kinetic energy')
def _(tex):
    m, F, d = 1.5, 6.0, 2.0
    t, r, v = run(const_acc(F / m), (0.0,), (0.0,), lambda t, r, v: r[0] - d)
    holds('the work F d of a steady push from rest', tex, K=F * d, m=m, v=v[0])


@row('7-1', 'The joule')
def _(tex):
    for part in tex.split('='):
        check_vec(f'{part}: force times distance', dims(part), dmul(MASS, LENGTH, PER_TIME, PER_TIME, LENGTH), 0)


@row('7-1', 'Electron-volt')
def _(tex):
    ev = num(re.search(r'=([\d.]+\\times10\^\{-19\})', tex).group(1))
    check('e x 1 V, to four significant figures (x 1e19)', ev * 1e19, sig(E_CHARGE * 1e19, 4), 1e-12)


@row('7-2', 'Work by a constant force')
def _(tex):
    F, d = (6.0, 2.5), (4.0, -1.5)
    W = line_integral(lambda r: F, lambda s: (4 * s, -1.5 * s + 2 * sin(pi * s)))  # a bent path to the same end
    holds('along a bent path', tex, swap={R'\vec{F}\cdot\vec{d}': 'FdotD'}, W=W, F=norm(F), d=norm(d), phi=angle_between(F, d), FdotD=dot(F, d))


@row('7-2', 'Net work')
def _(tex):
    Fs, d = [(6.0, 2.5), (-2.0, 1.0), (0.5, -3.0)], (4.0, -1.5)
    check('W1 + W2 + W3 = the work of the net force', sum(dot(F, d) for F in Fs), dot(add(*Fs), d))


@row('7-2', 'Work–kinetic energy theorem')
def _(tex):
    holds('spring, damping and a push (RK4)', tex, 1e-7, Delta_K=KE72[-1] - KE72[0], K_f=KE72[-1], K_i=KE72[0], W=W72)


@row('7-2', 'Final kinetic energy')
def _(tex):
    holds('spring, damping and a push (RK4)', tex, 1e-7, K_f=KE72[-1], K_i=KE72[0], W=W72)


@row('7-3', 'Work by gravity')
def _(tex):
    m = 2.0
    Fg = (0.0, -m * G)
    d = sub(curve73(1), curve73(0))
    holds('along a curved path', tex, W_g=line_integral(lambda r: Fg, curve73), m=m, g=G, d=norm(d), phi=angle_between(Fg, d))
    check_true('negative going up', dot(Fg, (0.0, 1.0)) < 0)


@row('7-3', 'Lifting or lowering')
def _(tex):
    holds('a varying lift (RK4)', tex, 1e-7, Delta_K=dK73, W_a=Wa73, W_g=Wg73)


@row('7-3', 'At rest before and after')
def _(tex):
    m, h, tau = 2.0, 1.8, 2.0  # y = h(1 - cos(pi t/tau))/2 starts and ends at rest
    yd = lambda t: h * pi / (2 * tau) * sin(pi * t / tau)
    ydd = lambda t: h * pi ** 2 / (2 * tau ** 2) * cos(pi * t / tau)
    holds('a lift that starts and ends at rest', tex, W_a=integrate(lambda t: m * (ydd(t) + G) * yd(t), 0, tau),
          W_g=integrate(lambda t: -m * G * yd(t), 0, tau))


@row('7-4', 'Hooke’s law')
def _(tex):
    k = 400.0
    for x in (0.04, -0.03):
        holds(f'x = {x}: minus the slope of kx^2/2', tex, eqs=[1], F_x=-d1(lambda s: 0.5 * k * s * s, x), k=k, x=x)
    d = (0.03, -0.04)
    F = mul(-k, d)
    check('3D: size k|d|', norm(F), k * norm(d))
    check('3D: opposite to d', degrees(angle_between(F, d)), 180, 1e-6)


@row('7-4', 'Work by a spring')
def _(tex):
    k = 400.0
    holds('the sum of F dx', tex, W_s=integrate(lambda x: -k * x, 0.03, -0.05), k=k, x_i=0.03, x_f=-0.05)


@row('7-4', 'From the relaxed length')
def _(tex):
    k = 400.0
    holds('the sum of F dx', tex, W_s=integrate(lambda x: -k * x, 0, 0.07), k=k, x=0.07)


@row('7-4', 'Applied force on a spring')
def _(tex):
    m, k, xi, xf, tau = 0.5, 400.0, 0.02, 0.09, 1.5  # moved from xi to xf, starting and ending at rest
    x = lambda t: xi + (xf - xi) * (1 - cos(pi * t / tau)) / 2
    xd = lambda t: (xf - xi) * pi / (2 * tau) * sin(pi * t / tau)
    xdd = lambda t: (xf - xi) * pi ** 2 / (2 * tau ** 2) * cos(pi * t / tau)
    holds('the hand’s work against the spring’s', tex, W_a=integrate(lambda t: (m * xdd(t) + k * x(t)) * xd(t), 0, tau),
          W_s=integrate(lambda t: -k * x(t) * xd(t), 0, tau))


@row('7-5', 'Work in one dimension')
def _(tex):
    m, F = 1.2, (lambda x: 5 - 3 * x + 0.4 * x ** 3)
    t, r, v = run(lambda t, r, v: (F(r[0]) / m,), (0.0,), (0.0,), lambda t, r, v: r[0] - 1.5, dt=1e-4)
    check('the area under F(x) = the kinetic energy gained (RK4)', integrate(F, 0, 1.5), 0.5 * m * v[0] ** 2)


@row('7-5', 'Work in three dimensions')
def _(tex):
    F = lambda r: (3 * r[0] ** 2, 4.0, -2 * r[2])  # each component depends only on its own coordinate
    W = line_integral(F, lambda s: (2 + s, 3 - 3 * s * s, 1 + s ** 3))
    parts = integrate(lambda x: 3 * x * x, 2, 3) + integrate(lambda y: 4.0, 3, 0) + integrate(lambda z: -2 * z, 1, 2)
    check('along a curved path = the sum of the three integrals', W, parts)
    check('which is 4 J', parts, 4)


@row('7-6', 'Average power')
def _(tex):
    T = S72[-1][0]
    holds('the mean of F v (RK4)', tex, 1e-7, P_avg=simpson([F72f(s[1][0], s[2][0]) * s[2][0] for s in S72], H72) / T,
          W=KE72[-1] - KE72[0], Delta_t=T)


@row('7-6', 'Instantaneous power')
def _(tex):
    for i in (800, 2500):
        s = S72[i]
        check(f'dW/dt (the change in K) = F v at t = {s[0]:.1f} s', (KE72[i + 1] - KE72[i - 1]) / (2 * H72), F72f(s[1][0], s[2][0]) * s[2][0], 1e-5)


@row('7-6', 'Power from force and velocity')
def _(tex):
    m, F, v0, t = 1.0, (2.0, -3.0), (1.5, 2.0), 0.8
    st = lambda T: state_at(lambda t, r, v: mul(1 / m, F), (0.0, 0.0), v0, T)
    K = lambda T: 0.5 * m * dot(st(T)[2], st(T)[2])
    v = st(t)[2]
    holds('dK/dt (RK4)', tex, 1e-6, swap={R'\vec{F}\cdot\vec{v}': 'FdotV'}, P=(K(t + 1e-4) - K(t - 1e-4)) / 2e-4,
          F=norm(F), v=norm(v), phi=angle_between(F, v), FdotV=dot(F, v))


@row('7-6', 'Units of power and energy')
def _(tex):
    w, hp, kwh = equations(tex)
    l, r = w.split('=')
    check_vec('a watt is a joule per second', dims(l), dims(r), 0)
    check('1 hp = 550 ft lb/s, to three significant figures', num(re.search(r'=(\d+)\\ \\text\{W\}', hp).group(1)), sig(550 * 0.3048 * 4.4482216152605, 3), 0)
    check('1 kW h = 1000 W x 3600 s', num(re.search(r'=([\d.]+\\times10\^\{6\})', kwh).group(1)), 1000 * 3600, 1e-12)


@row('c7+', 'Work by kinetic friction')
def _(tex):
    m, muk = 2.0, 0.25
    S, h = samples(lambda t, r, v: (-muk * G,), (0.0,), (6.0,), 1.0)  # still sliding at 1 s
    holds('the sum of f v dt (RK4)', tex, 1e-7, W_f=simpson([-muk * m * G * s[2][0] for s in S], h), f_k=muk * m * G, d=S[-1][1][0], mu_k=muk, F_N=m * G)


@row('c7+', 'Work by the normal force')
def _(tex):
    m = 1.5
    S, h = samples(central, (RC, 0.0), (0.0, VC), 2 * pi * RC / VC)  # one lap, pushed toward the centre
    holds('a push always across the motion, over a lap (RK4)', tex, W_N=simpson([dot(mul(m, central(*s)), s[2]) for s in S], h))
    check('the speed is unchanged', norm(S[-1][2]), VC, 1e-9)


@row('c7+', 'Speed from work')
def _(tex):
    holds('spring, damping and a push (RK4)', tex, 1e-7, v_f=abs(S72[-1][2][0]), v_i=abs(S72[0][2][0]), W_net=W72, m=M72)


@row('c7+', 'Power at constant velocity')
def _(tex):
    m, v, T = 2.0, 0.8, 3.0
    F = solve(lambda F: F - m * G, 0, 100)  # no acceleration
    holds('lifting steadily: the work over the time', tex, P=F * v * T / T, F=F, v=v)
    check('= mgv', F * v, m * G * v)


@row('c7+', 'Constant net force from rest')
def _(tex):
    m, F, T = 1.5, 6.0, 2.0
    _, r, v = state_at(const_acc(F / m), (0.0,), (0.0,), T)
    holds('RK4', tex, P_end=F * v[0], P_avg=0.5 * m * v[0] ** 2 / T)


@row('c7+', 'Kinetic energy and speed')
def _(tex):
    check_true('the row says 2v gives 4K', '2v' in tex and '4K' in tex)
    for v in (1.3, 7.0):
        check(f'K(2v)/K(v) at v = {v}', (0.5 * 3.0 * (2 * v) ** 2) / (0.5 * 3.0 * v * v), 4)


# =====================================================================================================================
# Chapter 8
U83 = lambda x: x ** 4 - 3 * x * x + 1  # a sample potential-energy curve (J), for a 0.5 kg particle
F83 = lambda x: -(4 * x ** 3 - 6 * x)
acc83 = lambda t, r, v: (F83(r[0]) / 0.5,)
E83 = 0.5 * 0.5 * 0.8 ** 2 + U83(0.3)  # starting at x = 0.3 with v = 0.8
_, R83, V83 = state_at(acc83, (0.3,), (0.8,), 2.7)


@row('8-1', 'Change in potential energy')
def _(tex):
    m = 2.0
    holds('gravity, along a curved path', tex, Delta_U=m * G * (curve73(1)[1] - curve73(0)[1]),
          W=line_integral(lambda r: (0.0, -m * G), curve73))
    holds('a spring from 0.02 to 0.09 m', tex, Delta_U=0.5 * 400 * (0.09 ** 2 - 0.02 ** 2), W=integrate(lambda x: -400 * x, 0.02, 0.09))


@row('8-1', 'From a force')
def _(tex):
    U = lambda x: 2 * x ** 3 - 5 * x
    check('-(sum of F dx) = U(x2) - U(x1)', -integrate(lambda x: -d1(U, x), -0.5, 1.7), U(1.7) - U(-0.5), 1e-8)


@row('8-1', 'Gravitational potential energy')
def _(tex):
    m, y1, y2 = 2.0, 0.7, 2.9
    holds('-(work of gravity)', tex, swap={'U(y)': 'Uy'}, Delta_U=-integrate(lambda y: -m * G, y1, y2), m=m, g=G, Delta_y=y2 - y1,
          Uy=-integrate(lambda y: -m * G, 0, y2), y=y2)


@row('8-1', 'Elastic potential energy')
def _(tex):
    holds('-(work of the spring) from the relaxed length', tex, swap={'U(x)': 'Ux'}, Ux=-integrate(lambda x: -400 * x, 0, 0.06), k=400.0, x=0.06)


@row('8-1', 'Conservative force')
def _(tex):
    loop = lambda s: (1 + 1.5 * cos(2 * pi * s), 2 + 1.5 * sin(2 * pi * s))
    holds('gravity around a circle', tex, W_closed_path=line_integral(lambda r: (0.0, -2.0 * G), loop))
    check_true('friction around the same loop is not zero', -0.3 * 2.0 * G * 2 * pi * 1.5 < -1)


# a mass on a vertical spring, with gravity: y from the relaxed length, up positive
m82, k82 = 0.5, 40.0
E82 = lambda r, v: 0.5 * m82 * v[0] ** 2 + 0.5 * k82 * r[0] ** 2 + m82 * G * r[0]
acc82 = lambda t, r, v: ((-k82 * r[0] - m82 * G) / m82,)
_, R82, V82 = state_at(acc82, (0.3,), (0.0,), 1.7)


@row('8-2', 'Mechanical energy')
def _(tex):
    holds('the energy it started with, 1.7 s later (RK4)', tex, 1e-9, E_mec=E82((0.3,), (0.0,)), K=0.5 * m82 * V82[0] ** 2,
          U=0.5 * k82 * R82[0] ** 2 + m82 * G * R82[0])


def proj_energy(T, m=0.7):
    _, r, v = state_at(gravity, (0.0, 1.0), LAUNCH, T)
    return 0.5 * m * dot(v, v), m * G * r[1]


@row('8-2', 'Conservation')
def _(tex):
    (K1, U1), (K2, U2) = proj_energy(0.4), proj_energy(1.9)
    holds('a projectile (RK4)', tex, 1e-9, K_2=K2, U_2=U2, K_1=K1, U_1=U1)


@row('8-2', 'Conservation as changes')
def _(tex):
    (K1, U1), (K2, U2) = proj_energy(0.4), proj_energy(1.9)
    holds('a projectile (RK4)', tex, 1e-9, Delta_E_mec=(K2 + U2) - (K1 + U1), Delta_K=K2 - K1, Delta_U=U2 - U1)


@row('8-3', 'Force from the curve')
def _(tex):
    check('a particle pushed by F = -dU/dx keeps K + U (RK4)', 0.5 * 0.5 * V83[0] ** 2 + U83(R83[0]), E83, 1e-9)
    check('F is minus the slope', F83(0.9), -d1(U83, 0.9), 1e-8)


@row('8-3', 'Kinetic energy from the curve')
def _(tex):
    holds('2.7 s later (RK4)', tex, 1e-9, swap={'K(x)': 'Kx', 'U(x)': 'Ux'}, Kx=0.5 * 0.5 * V83[0] ** 2, Ux=U83(R83[0]), E_mec=E83)
    S, _ = samples(acc83, (0.3,), (0.8,), 6.0)
    check_true('it stays where U <= E', all(U83(s[1][0]) <= E83 + 1e-9 for s in S))


@row('8-3', 'Turning point')
def _(tex):
    t, r, v = run(acc83, (0.3,), (0.8,), lambda t, r, v: v[0])
    holds('where it stops (RK4)', tex, 1e-9, eqs=[0], swap={'U(x)': 'Ux'}, Ux=U83(r[0]), E_mec=E83)
    check_true('the row adds K = 0', '(K=0)' in tex)


@row('8-3', 'Equilibrium')
def _(tex):
    xs = [solve(lambda x: d1(U83, x), a, b) for a, b in ((-2, -0.5), (-0.5, 0.5), (0.5, 2))]
    check_vec('dU/dx = 0 at', xs, (-sqrt(1.5), 0, sqrt(1.5)), 1e-8)
    S, _ = samples(acc83, (sqrt(1.5) + 0.02,), (0.0,), 20.0)
    check_true('released by a minimum, it stays near (stable)', max(abs(s[1][0] - sqrt(1.5)) for s in S) < 0.05)
    S, _ = samples(acc83, (0.01,), (0.0,), 20.0)
    check_true('released by the maximum, it runs off (unstable)', max(abs(s[1][0]) for s in S) > 0.5)


@row('8-4', 'No friction')
def _(tex):
    dU = M73 * G * S73[-1][1][0]
    holds('a varying lift (RK4)', tex, 1e-7, W=Wa73, Delta_E_mec=dK73 + dU, Delta_K=dK73, Delta_U=dU)


def rough(F, th, muk, v0, T, m=2.0):
    """a block on a rough slope at th (0 = level), pushed up the slope by F; s along the slope (up positive), moving up
    when v0 > 0 or sliding down when v0 <= 0 and F = 0"""
    fk = muk * m * G * cos(th)
    acc = lambda t, r, v: ((F - m * G * sin(th) - (fk if v[0] > 0 else -fk)) / m,)
    S, h = samples(acc, (0.0,), (v0,), T)
    s, v = S[-1][1][0], S[-1][2][0]
    return dict(W=F * s, dK=0.5 * m * (v * v - v0 * v0), dU=m * G * s * sin(th), dEth=simpson([fk * abs(x[2][0]) for x in S], h),
                fk=fk, s=s, m=m)


@row('8-4', 'With friction')
def _(tex):
    r = rough(20.0, 0.0, 0.3, 0.0001, 2.0, m=3.0)
    holds('a block pushed along a rough floor (RK4)', tex, 1e-6, W=r['W'], Delta_E_mec=r['dK'], Delta_E_th=r['dEth'])


@row('8-4', 'Thermal energy')
def _(tex):
    r = rough(0.0, 0.0, 0.25, 6.0, 1.5)
    holds('the kinetic energy a sliding block loses (RK4)', tex, 1e-6, Delta_E_th=-r['dK'], f_k=r['fk'], d=r['s'])


@row('8-5', 'Work on a system')
def _(tex):
    r = rough(30.0, radians(20), 0.2, 0.0001, 1.5)
    holds('pushed up a rough slope (RK4)', tex, 1e-6, W=r['W'], Delta_E=r['dK'] + r['dU'] + r['dEth'], Delta_E_mec=r['dK'] + r['dU'],
          Delta_E_th=r['dEth'], Delta_E_int=0.0)


SL85 = rough(0.0, radians(35), 0.3, -0.0001, 1.2)  # sliding down a rough slope, nothing pushing


@row('8-5', 'Isolated system')
def _(tex):
    holds('sliding down a rough slope (RK4)', tex, 1e-6, Delta_E_mec=SL85['dK'] + SL85['dU'], Delta_E_th=SL85['dEth'], Delta_E_int=0.0)


@row('8-5', 'Isolated system, end state')
def _(tex):
    E1 = 0.5 * SL85['m'] * 0.0001 ** 2
    holds('sliding down a rough slope (RK4)', tex, 1e-6, E_mec_2=E1 + SL85['dK'] + SL85['dU'], E_mec_1=E1, Delta_E_th=SL85['dEth'], Delta_E_int=0.0)


@row('8-5', 'Power as energy transfer')
def _(tex):
    T = S73[-1][0]
    E = [0.5 * M73 * s[2][0] ** 2 + M73 * G * s[1][0] for s in S73]
    holds('a varying lift (RK4)', tex, 1e-7, eqs=[0], P_avg=simpson([Fa73(s[0]) * s[2][0] for s in S73], H73) / T, Delta_E=E[-1] - E[0], Delta_t=T)
    i = 1500
    check('dE/dt = the hand’s power at that moment', (E[i + 1] - E[i - 1]) / (2 * H73), Fa73(S73[i][0]) * S73[i][2][0], 1e-5)


@row('c8+', 'Speed after a drop')
def _(tex):
    h, v0 = 6.0, 5.0
    for deg in (30, -60):
        z = cmath.rect(v0, radians(deg))
        t, r, v = run(gravity, (0.0, 0.0), (z.real, z.imag), lambda t, r, v: r[1] + h)
        holds(f'launched at {deg} deg (RK4)', tex, v=norm(v), v_0=v0, g=G, h=h)


@row('c8+', 'Height reached')
def _(tex):
    for deg in (20, 65):
        th = radians(deg)
        t, r, v = run(lambda t, r, v: (-G * sin(th),), (0.0,), (8.0,), lambda t, r, v: v[0])
        holds(f'up a {deg} deg slope (RK4)', tex, h=r[0] * sin(th), v=8.0, g=G)


@row('c8+', 'Spring launch')
def _(tex):
    k, m, x = 900.0, 0.25, 0.06
    t, r, v = run(lambda t, r, v: (-k * r[0] / m,), (-x,), (0.0,), lambda t, r, v: r[0], dt=1e-5)
    holds('RK4', tex, v=v[0], x=x, k=k, m=m)


@row('c8+', 'Greatest compression')
def _(tex):
    k, m, v0 = 900.0, 0.25, 2.4
    t, r, v = run(lambda t, r, v: (-k * r[0] / m,), (0.0,), (-v0,), lambda t, r, v: v[0], dt=1e-5)
    holds('RK4', tex, x_max=-r[0], v=v0, m=m, k=k)


@row('c8+', 'Pendulum from horizontal')
def _(tex):
    L, m = 0.9, 0.3
    t, r, v = run(lambda t, r, v: (-G / L * sin(r[0]),), (pi / 2,), (0.0,), lambda t, r, v: r[0], dt=1e-4)
    vb = L * abs(v[0])
    holds('the swing, integrated by RK4', tex, v_bottom=vb, g=G, L=L, T_bottom=m * G + m * vb * vb / L, m=m)


@row('c8+', 'Loop from rest')
def _(tex):
    m, R, ramp = 0.2, 0.8, radians(45)

    def n_top(h):  # down a straight 45 deg ramp from height h, then around the loop; the track's push at the top
        s0 = h / sin(ramp)
        _, r, v = run(lambda t, r, v: (G * sin(ramp),), (0.0,), (0.0,), lambda t, r, v: r[0] - s0, dt=1e-4)  # the ramp
        _, _, v = run(lambda t, r, v: (-G * sin((r[0] - s0) / R),), r, v, lambda t, r, v: (r[0] - s0) / R - pi, dt=1e-4)  # the loop
        return m * v[0] ** 2 / R - m * G
    holds('the start height where the push at the top falls to zero', tex, 1e-5, h_min=solve(n_top, 2.2 * R, 3 * R, 40), R=R)


@row('c8+', 'Sliding with friction')
def _(tex):
    m, muk, vi, d = 2.0, 0.25, 6.0, 3.0
    t, r, v = run(lambda t, r, v: (-muk * G,), (0.0,), (vi,), lambda t, r, v: r[0] - d, dt=1e-4)
    holds('RK4', tex, m=m, v_f=v[0], v_i=vi, f_k=muk * m * G, d=d)


# =====================================================================================================================
def main():
    data = load()
    rows = [('const', r[0], r[1]) for r in data['constants']]
    for g in data['fgroups']:
        for m in g['mods']:
            rows += [(m['no'], r[0], r[1]) for r in m['rows']]
        rows += [(g['id'] + '+', r[0], r[1]) for r in g['extra']]
    trig_checks(data['trig'])
    seen = set()
    for where, name, tex in rows:
        print(f'\n-- {where} {name}')
        f = CHECKS.get((where, name))
        if f is None:
            check_true(f'{where} "{name}" has a check', False)
            continue
        seen.add((where, name))
        f(tex)
    for key in sorted(CHECKS.keys() - seen):
        check_true(f'the check for {key} matches a row on the page', False)
    print(f'\n{len(seen)} of {len(rows)} rows checked, and the special angles')
    done('formula')


if __name__ == '__main__':
    main()
