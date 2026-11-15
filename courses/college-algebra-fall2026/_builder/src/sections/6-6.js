/* Section 6.6 · Exponential Equations — interactive activities */
(() => {
'use strict';
const {fmt, num} = CA;
const fr = (t, b) => `<span class="ca-frac"><span>${t}</span><span>${b}</span></span>`;
const P = (b, e) => `${b}<sup>${e}</sup>`;

/* ---------- 01 · trace both sides ---------- */
CA.lab('trace-lab', {
  controls: [{type: 'range', key: 'x', label: 'x =', min: -2, max: 4, step: 0.25, value: 0}, {type: 'check', key: 'ex', label: 'Show the exponents instead', value: false}],
  plot: {h: 360}, plotLabel: 'Graphs of both sides of the equation', legend: [['orange', 'left side'], ['blue', 'right side']], readouts: [['L', 'Left: 2^(x + 1)'], ['R', 'Right: 2^(2x − 1)'], ['eq', 'Equal?']]
}, (lab, st) => {
  const x = st.x, L = t => 2 ** (t + 1), R = t => 2 ** (2 * t - 1), ok = Math.abs(L(x) - R(x)) < 1e-9;
  if (!st.ex) {
    const Pl = lab.plane({xmin: -2, xmax: 4, ymin: -1, ymax: 20});
    Pl.curve(L, {color: 'orange', width: 3.2}).curve(R, {color: 'blue', width: 3.2}).vline(x, {color: 'gray', dash: '4 5'});
    Pl.point(x, L(x), {color: 'orange', r: 6}).point(x, R(x), {color: 'blue', r: 6});
    if (ok) Pl.point(2, 8, {color: 'green', r: 8, label: '(2, 8)'}); Pl.render();
  } else {
    const Pl = lab.plane({xmin: -2, xmax: 4, ymin: -6, ymax: 8});
    Pl.curve(t => t + 1, {color: 'orange', width: 3.2}).curve(t => 2 * t - 1, {color: 'blue', width: 3.2}).vline(x, {color: 'gray', dash: '4 5'}).point(2, 3, {color: 'green', r: 7, label: 'exponents meet at x = 2'}).render();
  }
  lab.read('L', `${P(2, fmt(num(x + 1, 2)))} = ${num(L(x), 4)}`); lab.read('R', `${P(2, fmt(num(2 * x - 1, 2)))} = ${num(R(x), 4)}`); lab.read('eq', ok ? '✓ yes' : '✕ no');
  lab.out(ok ? '✓ At x = 2 both sides equal 8: the graphs meet at (2, 8). Since the bases match, the exponents x + 1 and 2x − 1 must be equal there too: x + 1 = 2x − 1 gives x = 2.' : `At x = ${fmt(x)} the ${L(x) > R(x) ? 'left side is larger' : 'right side is larger'}. Move x until the outputs agree.`, ok ? 'ca-correct' : '');
});

/* ---------- 02 · common base ---------- */
const CB = {
  a: {t: '4^(x + 5) = 4', eq: `${P(4, 'x + 5')} = 4`, M: x => x + 5, N: () => 1, sol: [-4], steps: [['Write 4 as 4¹', `${P(4, 'x + 5')} = ${P(4, 1)}`], ['Set the exponents equal', 'x + 5 = 1'], ['Solve', 'x = −4']]},
  b: {t: '(1/3)^(3 − 7x) = (1/3)^(2x + 4)', eq: `${P('(1/3)', '3 − 7x')} = ${P('(1/3)', '2x + 4')}`, M: x => 3 - 7 * x, N: x => 2 * x + 4, sol: [-1 / 9], steps: [['Same base 1/3: set the exponents equal', '3 − 7x = 2x + 4'], ['Collect terms', '−9x = 1'], ['Solve', `x = −${fr(1, 9)}`]]},
  c: {t: 'e^(x² + 5x) = e^(x − 3)', eq: `${P('e', 'x² + 5x')} = ${P('e', 'x − 3')}`, M: x => x * x + 5 * x, N: x => x - 3, sol: [-3, -1], steps: [['Same base e: set the exponents equal', 'x² + 5x = x − 3'], ['Write in standard form', 'x² + 4x + 3 = 0'], ['Factor', '(x + 3)(x + 1) = 0'], ['Solve', 'x = −3 or x = −1']]},
  d: {t: '2^(6x) = 1/2', eq: `${P(2, '6x')} = ${fr(1, 2)}`, M: x => 6 * x, N: () => -1, sol: [-1 / 6], steps: [['Write 1/2 = 2⁻¹', `${P(2, '6x')} = ${P(2, '−1')}`], ['Set the exponents equal', '6x = −1'], ['Solve', `x = −${fr(1, 6)}`]]},
  t1a: {t: 'Practice: 7^(8x − 3) = 7^(4x)', eq: `${P(7, '8x − 3')} = ${P(7, '4x')}`, M: x => 8 * x - 3, N: x => 4 * x, sol: [3 / 4], steps: [['Same base: set the exponents equal', '8x − 3 = 4x'], ['Solve', `4x = 3, so x = ${fr(3, 4)}`]]},
  t1b: {t: 'Practice: (5/4)^(x² − x + 2) = (5/4)^22', eq: `${P('(5/4)', 'x² − x + 2')} = ${P('(5/4)', 22)}`, M: x => x * x - x + 2, N: () => 22, sol: [-4, 5], steps: [['Same base: set the exponents equal', 'x² − x + 2 = 22'], ['Standard form', 'x² − x − 20 = 0'], ['Factor', '(x − 5)(x + 4) = 0'], ['Solve', 'x = 5 or x = −4']]},
  e: {t: '3^(4x + 9) = 27^(x − 1)', eq: `${P(3, '4x + 9')} = ${P(27, 'x − 1')}`, M: x => 4 * x + 9, N: x => 3 * x - 3, sol: [-12], steps: [['Write 27 = 3³', `${P(3, '4x + 9')} = ${P('(3³)', 'x − 1')}`], ['Power of a power', `${P(3, '4x + 9')} = ${P(3, '3x − 3')}`], ['Set the exponents equal', '4x + 9 = 3x − 3'], ['Solve', 'x = −12']]},
  f: {t: '8^(x − 4) = 32^(x + 1)', eq: `${P(8, 'x − 4')} = ${P(32, 'x + 1')}`, M: x => 3 * x - 12, N: x => 5 * x + 5, sol: [-17 / 2], steps: [['Write 8 = 2³ and 32 = 2⁵', `${P('(2³)', 'x − 4')} = ${P('(2⁵)', 'x + 1')}`], ['Power of a power', `${P(2, '3x − 12')} = ${P(2, '5x + 5')}`], ['Set the exponents equal', '3x − 12 = 5x + 5'], ['Solve', `−2x = 17, so x = −${fr(17, 2)}`]]},
  g: {t: '∛16 = 64^(2x − 5)', eq: `∛16 = ${P(64, '2x − 5')}`, M: () => 4 / 3, N: x => 12 * x - 30, sol: [47 / 18], steps: [['Write ∛16 = 16<sup>1/3</sup> = (2⁴)<sup>1/3</sup> and 64 = 2⁶', `${P(2, '4/3')} = ${P('(2⁶)', '2x − 5')}`], ['Power of a power', `${P(2, '4/3')} = ${P(2, '12x − 30')}`], ['Set the exponents equal', `${fr(4, 3)} = 12x − 30`], ['Solve', `12x = ${fr(94, 3)}, so x = ${fr(47, 18)}`]]},
  h: {t: '9^(2x + 2) = 81^(x − 4)', eq: `${P(9, '2x + 2')} = ${P(81, 'x − 4')}`, M: x => 2 * x + 2, N: x => 2 * x - 8, sol: [], steps: [['Write 81 = 9²', `${P(9, '2x + 2')} = ${P(9, '2x − 8')}`], ['Set the exponents equal', '2x + 2 = 2x − 8'], ['Simplify', '2 = −8 is false'], ['Conclusion', 'No solution']]},
  t2a: {t: 'Practice: 25^(3x) = (1/125)^(x + 2)', eq: `${P(25, '3x')} = ${P('(1/125)', 'x + 2')}`, M: x => 6 * x, N: x => -3 * x - 6, sol: [-2 / 3], steps: [['Write 25 = 5² and 1/125 = 5⁻³', `${P('(5²)', '3x')} = ${P('(5⁻³)', 'x + 2')}`], ['Power of a power', `${P(5, '6x')} = ${P(5, '−3x − 6')}`], ['Set the exponents equal', '6x = −3x − 6'], ['Solve', `9x = −6, so x = −${fr(2, 3)}`]]},
  t2b: {t: 'Practice: 1000^(5 − x) = 100^x', eq: `${P(1000, '5 − x')} = ${P(100, 'x')}`, M: x => 15 - 3 * x, N: x => 2 * x, sol: [3], steps: [['Write 1000 = 10³ and 100 = 10²', `${P('(10³)', '5 − x')} = ${P('(10²)', 'x')}`], ['Power of a power', `${P(10, '15 − 3x')} = ${P(10, '2x')}`], ['Set the exponents equal', '15 − 3x = 2x'], ['Solve', 'x = 3']]}
};
let cbStepper;
const cb = CA.lab('cb-lab', {
  controls: [{type: 'select', key: 'e', label: 'Equation', value: 'a', options: Object.entries(CB).map(([k, v]) => [k, v.t])}],
  top: '<div id="cb-stepper"></div>', plot: {h: 340}, plotLabel: 'The two exponents as functions of x', legend: [['orange', 'exponent on the left'], ['blue', 'exponent on the right']], steps: true
}, (lab, st, key) => { if (!cbStepper) return; if (key) cbStepper.reset(); else drawCb(); });
function drawCb() {
  const D = CB[cb.state.e], i = cbStepper ? cbStepper.i : 0, last = i === D.steps.length - 1;
  const xs = D.sol.length ? D.sol : [0], x0 = Math.min(-5, Math.min(...xs) - 3), x1 = Math.max(5, Math.max(...xs) + 3);
  const ys = [x0, x1, ...xs].flatMap(x => [D.M(x), D.N(x)]), lo = Math.max(-60, Math.min(...ys)), hi = Math.min(60, Math.max(...ys)), pad = Math.max(2, (hi - lo) * 0.15);
  const Pl = cb.plane({xmin: x0, xmax: x1, ymin: lo - pad, ymax: hi + pad});
  Pl.curve(D.M, {color: 'orange', width: 3.2}).curve(D.N, {color: 'blue', width: 3.2});
  if (last) D.sol.forEach(x => Pl.point(x, D.M(x), {color: 'green', r: 7, label: `x = ${num(x, 4)}`}));
  Pl.render();
  cb.steps(D.steps.slice(0, i + 1));
  const fin = D.steps[D.steps.length - 1][1], ans = fin.includes('so ') ? fin.split('so ')[1] : fin;
  cb.out(last ? (D.sol.length ? `✓ Solution${D.sol.length > 1 ? 's' : ''}: ${ans}. The exponent graphs meet ${D.sol.length > 1 ? 'twice' : 'once'}.` : 'The exponents 2x + 2 and 2x − 8 are parallel lines that never meet, so the equation has <b>no solution</b>.') : `Equation: ${D.eq}. Continue to the next step.`, last ? (D.sol.length ? 'ca-correct' : 'ca-incorrect') : '');
}
cbStepper = CA.stepper('cb-stepper', () => CB[cb.state.e].steps.length, drawCb);

/* ---------- 03 · solving with logarithms ---------- */
const LG = {
  a: {a: '5', p: 1, q: 2, b: '4', r: 1, s: 0}, b: {a: '3', p: 1, q: 0, b: '7', r: 1, s: 0}, c: {a: '11', p: 1, q: -1, b: '6', r: 7, s: 2},
  d: {a: '2', p: 1, q: -3, b: 'e', r: 5, s: 0}, t3a: {a: '9', p: 4, q: 0, b: '2', r: 1, s: -3}, t3b: {a: '17', p: -3, q: 1, b: '5', r: 0, s: 1}
};
const lin = (p, q) => { if (p === 0) return fmt(q); const px = p === 1 ? 'x' : p === -1 ? '−x' : `${fmt(p)}x`; if (q === 0) return px; if (p < 0) return `${q} − ${p === -1 ? 'x' : `${-p}x`}`; return `${px} ${q > 0 ? '+' : '−'} ${Math.abs(q)}`; };
const side = (b, p, q) => (p === 0 && q === 1) ? b : P(b, lin(p, q));
const LN = b => b === 'e' ? 1 : Math.log(Number(b)), lnS = b => b === 'e' ? '1' : `ln ${b}`;
const term = (c, b) => b === 'e' ? fmt(c) : `${c === 1 ? '' : fmt(c)}ln ${b}`;
const lnSide = (b, p, q) => b === 'e' ? lin(p, q) : p === 0 ? `${q === 1 ? '' : fmt(q)}ln ${b}` : q === 0 ? `${lin(p, 0)} ln ${b}` : `(${lin(p, q)})ln ${b}`;
const combo = parts => { const t = parts.filter(([c]) => c !== 0); if (!t.length) return '0'; return t.map(([c, b], i) => { const body = term(Math.abs(c), b); return i === 0 ? (c < 0 ? '−' : '') + body : ` ${c < 0 ? '−' : '+'} ${body}`; }).join(''); };
CA.lab('log-lab', {
  controls: [{type: 'select', key: 'e', label: 'Equation', value: 'a', options: Object.entries(LG).map(([k, D]) => [k, `${k.startsWith('t') ? 'Practice: ' : ''}${side(D.a, D.p, D.q).replace(/<\/?sup>/g, m => m === '<sup>' ? '^(' : ')')} = ${side(D.b, D.r, D.s).replace(/<\/?sup>/g, m => m === '<sup>' ? '^(' : ')')}`])}],
  plot: {h: 340}, plotLabel: 'Both sides after taking the natural log', legend: [['orange', '(px + q)·ln a'], ['blue', '(rx + s)·ln b']], readouts: [['x', 'Exact'], ['xv', 'Decimal'], ['chk', 'Check']], steps: true
}, (lab, st) => {
  const D = LG[st.e], la = LN(D.a), lb = LN(D.b), A = D.p * la - D.r * lb, B = D.s * lb - D.q * la, x = B / A;
  const left = t => (D.p * t + D.q) * la, right = t => (D.r * t + D.s) * lb;
  const x0 = Math.min(-4, x - 3), x1 = Math.max(4, x + 3), ys = [x0, x1].flatMap(t => [left(t), right(t)]), lo = Math.min(...ys), hi = Math.max(...ys);
  const Pl = lab.plane({xmin: x0, xmax: x1, ymin: lo, ymax: hi});
  Pl.curve(left, {color: 'orange', width: 3.2}).curve(right, {color: 'blue', width: 3.2}).point(x, left(x), {color: 'green', r: 7, label: `x ≈ ${num(x, 3)}`}).render();
  const L = side(D.a, D.p, D.q), R = side(D.b, D.r, D.s);
  const lnL = lnSide(D.a, D.p, D.q), lnR = lnSide(D.b, D.r, D.s);
  const xs = combo([[D.p, D.a], [-D.r, D.b]]), rs = combo([[D.s, D.b], [-D.q, D.a]]);
  const steps = [['Take ln of both sides', `ln(${L}) = ln(${R})`], ['Power rule' + (D.b === 'e' ? ' (and ln e = 1)' : ''), `${lnL} = ${lnR}`]];
  steps.push(['Collect the x-terms on the left', `x(${xs}) = ${rs}`]);
  steps.push(['Divide', `x = ${fr(rs, xs)}`]);
  steps.push(['Evaluate', `x ≈ ${num(x, 4)}`]);
  lab.steps(steps);
  lab.read('x', `x = ${fr(rs, xs)}`); lab.read('xv', `x ≈ ${num(x, 4)}`);
  const lv = (D.a === 'e' ? Math.E : Number(D.a)) ** (D.p * x + D.q), rv = (D.b === 'e' ? Math.E : Number(D.b)) ** (D.r * x + D.s);
  lab.read('chk', `${L.replace(/x/g, '(' + num(x, 4) + ')')} ≈ ${lv < 1e-3 ? lv.toExponential(3) : num(lv, 4)}; right ≈ ${rv < 1e-3 ? rv.toExponential(3) : num(rv, 4)}`);
  lab.out(`${D.a !== D.b && st.e === 'b' ? 'Since 3 ≠ 7, the only way 3ˣ = 7ˣ is x = 0 (both sides equal 1). ' : ''}Both lines come from the power rule, and they cross at x ≈ ${num(x, 4)}.${Math.abs(x) > 5 ? ' (Plug it in: both sides are tiny numbers, yet they are equal.)' : ''}`);
});

CA.guided('66', [
  {q: 'Solve 2<sup>x</sup> = 32.', opts: ['x = 5', 'x = 16', 'x = 4'], correct: 0, hint: '32 = 2⁵.', why: 'Same base, so x = 5.'},
  {q: 'Solve 3<sup>x − 2</sup> = 3<sup>7</sup>.', opts: ['x = 9', 'x = 5', 'x = 14'], correct: 0, hint: 'Set the exponents equal.', why: 'x − 2 = 7.'},
  {q: 'Solve 5<sup>2x</sup> = 1/25.', opts: ['x = −1', 'x = 1', 'x = −2'], correct: 0, hint: '1/25 = 5⁻².', why: '2x = −2.'},
  {q: 'Solve 4<sup>x</sup> = 8.', opts: ['x = 3/2', 'x = 2', 'x = 2/3'], correct: 0, hint: 'Write both sides as powers of 2.', why: '2<sup>2x</sup> = 2³ gives 2x = 3.'},
  {q: 'How many solutions does 2<sup>x + 1</sup> = 2<sup>x + 3</sup> have?', opts: ['None', 'One', 'Two'], correct: 0, hint: 'Compare the exponents.', why: 'x + 1 = x + 3 is never true.'},
  {q: 'Solve 3<sup>x</sup> = 10 exactly.', opts: ['x = ln 10 / ln 3', 'x = ln 3 / ln 10', 'x = 10/3'], correct: 0, hint: 'Take ln of both sides.', why: 'x ln 3 = ln 10.'},
  {q: 'Solve e<sup>2x</sup> = 5.', opts: ['x = (ln 5)/2', 'x = ln 10', 'x = 5/(2e)'], correct: 0, hint: 'ln(e<sup>2x</sup>) = 2x.', why: '2x = ln 5.'},
  {q: 'After taking ln of 6<sup>x + 1</sup> = 2<sup>x</sup>, which equation follows?', opts: ['(x + 1)ln 6 = x ln 2', 'ln 6 + x = x ln 2', 'x + 1 = x'], correct: 0, hint: 'Power rule.', why: 'ln(6<sup>x + 1</sup>) = (x + 1)ln 6.'},
  {q: 'Solve e<sup>x² − 4</sup> = e<sup>0</sup>.', opts: ['x = ±2', 'x = 4', 'x = 2 only'], correct: 0, hint: 'x² − 4 = 0.', why: 'x² = 4.'},
  {q: 'Solve 10<sup>x</sup> = 0.001.', opts: ['x = −3', 'x = 3', 'x = −2'], correct: 0, hint: '0.001 = 10⁻³.', why: 'Same base 10.'}
]);
})();
