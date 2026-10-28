// Checks the calculator engine against the Windows standard calculator's behaviour.
//   node src/shared/calculator_test.js
// Keys: digits . + - * / = and {sqrt} {sqr} {inv} {neg} {pct} {ce} {c} {back} {ms} {mr} {m+} {m-} {mc}
const { Q, S, A, reset, displayText, exprText } = require('./calculator.js');

const NAMED = { sqrt: () => A.unary('sqrt'), sqr: () => A.unary('sqr'), inv: () => A.unary('inv'), neg: () => A.neg(), pct: () => A.pct(),
  ce: () => A.ce(), c: () => A.c(), back: () => A.back(), ms: () => A.ms(), mr: () => A.mr(), 'm+': () => A.mplus(), 'm-': () => A.mminus(), mc: () => A.mc() };
function press(seq) {
  for (const tok of seq.match(/\{[^}]+\}|./g)) {
    if (tok[0] === '{') NAMED[tok.slice(1, -1)]();
    else if (/\d/.test(tok)) A.digit(tok);
    else if (tok === '.') A.dot();
    else if (tok === '=') A.eq();
    else A.op(tok);
  }
}
let fails = 0, count = 0;
function check(seq, display, expr, fresh = true) {
  if (fresh) { reset(); S.mem = []; }
  press(seq);
  count++;
  const got = displayText(), gotExpr = exprText();
  const ok = got === display && (expr === undefined || gotExpr === expr);
  if (!ok) { fails++; console.log(`FAIL  ${seq}  →  "${got}" / "${gotExpr}"   expected "${display}"${expr === undefined ? '' : ` / "${expr}"`}`); }
  else console.log(`PASS  ${seq.padEnd(26)} ${got}${gotExpr ? '   [' + gotExpr + ']' : ''}`);
}

// exact arithmetic, where binary floating point slips
check('0.1+0.2=', '0.3', '0.1 + 0.2 =');
check('1/3*3=', '1');
check('0.1*3-0.3=', '0');
check('1-0.9=', '0.1');
check('1.1*1.1=', '1.21');
check('0.25{sqrt}', '0.5', '√(0.25)');
check('2.25{sqrt}', '1.5');
check('2{sqrt}', '1.414213562373095');
check('2{sqrt}{sqr}', '2', 'sqr(√(2))');
// 16 significant digits, Windows' layout rules
check('1/3=', '0.3333333333333333');
check('2/3=', '0.6666666666666667');
check('1/7=', '0.1428571428571429');
check('22/7=', '3.142857142857143');
check('1/30=', '0.0333333333333333');
check('1/300=', '0.0033333333333333');
check('1/3000=', '3.333333333333333e−4');
check('1/1024=', '0.0009765625');
check('0.0000001/1000=', '0.0000000001');
check('9999999999999999+1=', '1.e+16');
check('123456789*1000=', '123,456,789,000');
check('0-1/3000=', '−3.333333333333333e−4', '−1 ÷ 3,000 =');
// entry
check('1234567', '1,234,567');
check('12345678901234567', '1,234,567,890,123,456');
check('0.1234567890123456789', '0.1234567890123456');
check('123{back}', '12');
check('123{back}{back}{back}', '0');
check('3.{back}', '3');
check('{neg}', '0');
check('7{neg}', '−7');
// immediate execution, operator changes, repeated equals
check('2+3*4=', '20');
check('5+3*', '8', '8 ×');
check('5+-', '5', '5 −');
check('5+=', '10', '5 + 5 =');
check('5+==', '15', '10 + 5 =');
check('2+3=10=', '13', '10 + 3 =');
check('9{sqrt}=', '3', '√(9) =');
check('5+3={neg}', '−8', 'negate(8)');
check('5+3={back}', '8', '');
check('4{inv}', '0.25', '1/(4)');
check('3+4{sqr}', '16', '3 + sqr(4)');
check('3+4{sqr}=', '19', '3 + sqr(4) =');
// percent: of the first number for + and −, a plain hundredth for × and ÷
check('50+10{pct}', '5', '50 + 5');
check('50+10{pct}=', '55');
check('50*10{pct}=', '5');
check('200-5{pct}=', '190');
// errors and recovery
check('1/0=', 'Cannot divide by zero');
check('0/0=', 'Result is undefined');
check('0{inv}', 'Cannot divide by zero', '1/(0)');
check('5{neg}{sqrt}', 'Invalid input');
check('1/0=2+2=', '4');
check('9999999999999999{sqr}{sqr}{sqr}{sqr}{sqr}{sqr}{sqr}{sqr}{sqr}{sqr}', 'Overflow');
// memory
check('5{ms}3{m+}{mr}', '8');
check('5{ms}9{ms}{mr}', '9');
check('7{m-}{mr}', '−7');
check('5{ms}{mc}{mr}', '5');
reset(); S.mem = [];
press('5{ms}2{ms}');
count++;
if (S.mem.length !== 2 || Q.fmt(S.mem[0]) !== '2' || Q.fmt(S.mem[1]) !== '5') { fails++; console.log('FAIL  memory list order'); } else console.log('PASS  memory list keeps newest first');
count++;
const round = Q.unstore(Q.store(Q.div(Q.frac(1n), Q.frac(3n))));
if (!round || Q.fmt(round) !== '0.3333333333333333') { fails++; console.log('FAIL  memory storage round trip'); } else console.log('PASS  memory storage round trip');

console.log(fails ? `\n${fails} of ${count} failed` : `\nall ${count} calculator checks passed`);
process.exit(fails ? 1 : 0);
