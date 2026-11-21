/* Section 2.3 · The Limit Laws — interactive activities */
(() => {
'use strict';
const {num} = CA;

/* ---------- 01a · the laws one at a time ---------- */
const LAW = {
  lin: {t: 'lim x→−3 (4x + 2)', f: x => 4 * x + 2, a: -3, win: {xmin: -6, xmax: 1, ymin: -14, ymax: 4}, ans: '−10', steps: [
    ['Sum law', 'lim (4x + 2) = lim 4x + lim 2'], ['Constant multiple law', '= 4 · lim x + lim 2'], ['Basic limits', '= 4(−3) + 2'], ['Result', '= −12 + 2 = −10']]},
  rat: {t: 'lim x→2 (2x² − 3x + 1)/(x³ + 4)', f: x => (2 * x * x - 3 * x + 1) / (x ** 3 + 4), a: 2, win: {xmin: -1, xmax: 4, ymin: -0.5, ymax: 1}, ans: '1/4', steps: [
    ['Quotient law (denominator limit 12 ≠ 0)', '= lim (2x² − 3x + 1) / lim (x³ + 4)'], ['Sum and constant multiple laws', '= (2·lim x² − 3·lim x + lim 1)/(lim x³ + lim 4)'], ['Power law', '= (2(lim x)² − 3(lim x) + 1)/((lim x)³ + 4)'], ['Substitute lim x = 2', '= (2·4 − 6 + 1)/(8 + 4) = 3/12 = 1/4']]},
  pow: {t: 'lim x→1 (x² + 3x)⁴', f: x => (x * x + 3 * x) ** 4, a: 1, win: {xmin: -0.5, xmax: 2, ymin: -20, ymax: 400}, ans: '256', steps: [
    ['Power law', '= (lim (x² + 3x))⁴'], ['Sum and power laws', '= ((lim x)² + 3 lim x)⁴'], ['Substitute', '= (1 + 3)⁴ = 256']]},
  root: {t: 'lim x→4 √(x² + 9)', f: x => Math.sqrt(x * x + 9), a: 4, win: {xmin: -1, xmax: 7, ymin: -1, ymax: 9}, ans: '5', steps: [
    ['Root law (inside limit 25 ≥ 0)', '= √(lim (x² + 9))'], ['Sum and power laws', '= √((lim x)² + 9)'], ['Substitute', '= √(16 + 9) = √25 = 5']]},
  prod: {t: 'lim x→3 (x + 1)(2x − 5)', f: x => (x + 1) * (2 * x - 5), a: 3, win: {xmin: -1, xmax: 5, ymin: -6, ymax: 16}, ans: '4', steps: [
    ['Product law', '= lim (x + 1) · lim (2x − 5)'], ['Sum and constant multiple laws', '= (3 + 1)(2·3 − 5)'], ['Result', '= 4 · 1 = 4']]}
};
let lawStep = 0, lawSt;
const lawLab = CA.lab('law-lab', {
  controls: [{type: 'select', key: 'e', label: 'Limit', value: 'rat', options: Object.entries(LAW).map(([k, v]) => [k, v.t])}],
  top: '<div id="law-stepper"></div>', plot: {w: 520, h: 320}, plotLabel: 'Graph of the function near x = a', readouts: [['ans', 'Limit']], steps: true
}, (lab, st, key) => { if (key === 'e') { lawStep = 0; lawSt && lawSt.reset(); return; } drawLaw(lab, st); });
function drawLaw(lab, st) {
  const L = LAW[st.e], P = lab.plane(Object.assign({equal: false}, L.win)), y = L.f(L.a);
  P.curve(L.f, {color: 'blue', width: 3}).vline(L.a, {color: 'gray', dash: '4 5', width: 1.2});
  if (lawStep >= L.steps.length - 1) P.point(L.a, y, {color: 'orange', r: 7, label: `(${num(L.a)}, ${L.ans})`});
  P.render();
  lab.steps(L.steps.slice(0, lawStep + 1)); lab.read('ans', lawStep >= L.steps.length - 1 ? L.ans : '…');
  lab.out(lawStep >= L.steps.length - 1 ? `Every step used a limit law, so the limit equals the value obtained by substituting: ${L.ans}.` : 'Press Next step to apply the next law.', lawStep >= L.steps.length - 1 ? 'ca-correct' : '');
}
lawSt = CA.stepper('law-stepper', () => LAW[lawLab.state.e].steps.length, i => { lawStep = i; drawLaw(lawLab, lawLab.state); });

/* ---------- 01b · direct substitution checker ---------- */
CA.lab('sub-lab', {
  controls: [{type: 'text', key: 'f', label: 'f(x) =', value: '(x^2 - 2x)/(x^2 - 4)', placeholder: 'e.g. (x^3 - 1)/(x - 1)'}, {type: 'text', key: 'a', label: 'x → a, a =', value: '2', placeholder: 'e.g. 2 or pi/2'}],
  plot: {w: 520, h: 340}, plotLabel: 'Graph of your function near x = a', readouts: [['fa', 'f(a)'], ['l', 'f(a − 0.0001)'], ['r', 'f(a + 0.0001)'], ['c', 'Conclusion']]
}, (lab, st) => {
  const F = CA.expr(st.f), A = CA.expr(st.a), a = A ? A.f(0) : NaN;
  if (!F || !Number.isFinite(a)) { lab.plane({xmin: -5, xmax: 5, ymin: -5, ymax: 5}).render(); ['fa', 'l', 'r', 'c'].forEach(k => lab.read(k, '—')); lab.out('Type a function of x and a number a.', 'ca-incorrect'); return; }
  const f = F.f, fa = f(a), d = 1e-4, l = f(a - d), r = f(a + d), l2 = f(a - 1e-6), r2 = f(a + 1e-6);
  const Y = CA.fitY(f, a - 3, a + 3, {clip: 40, pad: 0.15}), P = lab.plane({xmin: a - 3, xmax: a + 3, ymin: Y.ymin, ymax: Y.ymax, equal: false});
  P.curve(f, {color: 'blue', width: 3, samples: 1500}).vline(a, {color: 'gray', dash: '4 5', width: 1.2});
  const agree = Number.isFinite(l2) && Number.isFinite(r2) && Math.abs(l2 - r2) < 1e-4 * Math.max(1, Math.abs(l2)), est = (l2 + r2) / 2;
  if (agree) P.point(a, est, {color: 'blue', r: 6, filled: Number.isFinite(fa)});
  P.render();
  lab.read('fa', Number.isFinite(fa) ? num(fa, 6) : 'undefined'); lab.read('l', Number.isFinite(l) ? num(l, 6) : 'undefined'); lab.read('r', Number.isFinite(r) ? num(r, 6) : 'undefined');
  const nice = CA.simpleFrac(est, 60), estT = nice && Math.abs(nice.v - est) < 1e-6 ? nice.toString() : num(est, 5);
  if (Number.isFinite(fa) && agree && Math.abs(fa - est) < 1e-4 * Math.max(1, Math.abs(fa))) { lab.read('c', `limit = f(a) = ${num(fa, 6)}`); lab.out('Direct substitution works here: the limit is the value f(a).', 'ca-correct'); }
  else if (!Number.isFinite(fa) && agree) { lab.read('c', `f(a) undefined; limit ≈ ${estT}`); lab.out(`Substitution fails (probably 0/0), but the values on both sides agree: the limit appears to be ${estT}. Use algebra (factor, or multiply by a conjugate) to prove it.`, 'ca-correct'); }
  else if (agree) { lab.read('c', `limit ≈ ${estT}, but f(a) = ${num(fa, 5)}`); lab.out('The nearby values agree with each other but not with f(a): the limit is not f(a) here.'); }
  else { lab.read('c', 'the two sides disagree'); lab.out('The values on the two sides do not approach the same number (a jump or an infinite limit): the two-sided limit does not exist.', 'ca-incorrect'); }
});

/* ---------- 02 · factor and cancel ---------- */
const FAC = [
  {t: 'lim x→2 (x² − 2x)/(x² − 4)', f: x => (x * x - 2 * x) / (x * x - 4), g: x => x / (x + 2), a: 2, L: 1 / 2, LT: '1/2', br: [-2], win: {xmin: -5, xmax: 5, ymin: -5, ymax: 5},
    steps: [['Substitute', '(4 − 4)/(4 − 4) = 0/0: indeterminate'], ['Factor', 'x(x − 2)/((x + 2)(x − 2))'], ['Cancel x − 2 (x ≠ 2)', 'x/(x + 2)'], ['Substitute in the simpler function', '2/(2 + 2) = 1/2']]},
  {t: 'lim x→1 (x³ − 1)/(x − 1)', f: x => (x ** 3 - 1) / (x - 1), g: x => x * x + x + 1, a: 1, L: 3, LT: '3', br: [], win: {xmin: -2.5, xmax: 2.5, ymin: -1, ymax: 8},
    steps: [['Substitute', '(1 − 1)/(1 − 1) = 0/0'], ['Factor a difference of cubes', '(x − 1)(x² + x + 1)/(x − 1)'], ['Cancel x − 1', 'x² + x + 1'], ['Substitute', '1 + 1 + 1 = 3']]},
  {t: 'lim x→−3 (x² + x − 6)/(x + 3)', f: x => (x * x + x - 6) / (x + 3), g: x => x - 2, a: -3, L: -5, LT: '−5', br: [], win: {xmin: -7, xmax: 2, ymin: -9, ymax: 2},
    steps: [['Substitute', '(9 − 3 − 6)/0 = 0/0'], ['Factor', '(x + 3)(x − 2)/(x + 3)'], ['Cancel x + 3', 'x − 2'], ['Substitute', '−3 − 2 = −5']]},
  {t: 'lim h→0 ((2 + h)² − 4)/h', f: x => ((2 + x) ** 2 - 4) / x, g: x => 4 + x, a: 0, L: 4, LT: '4', br: [], win: {xmin: -3, xmax: 3, ymin: -1, ymax: 8},
    steps: [['Substitute', '(4 − 4)/0 = 0/0'], ['Expand the numerator', '(4 + 4h + h² − 4)/h = (4h + h²)/h = h(4 + h)/h'], ['Cancel h', '4 + h'], ['Substitute h = 0', '4 (the slope of y = x² at x = 2)']]},
  {t: 'lim x→3 (1/x − 1/3)/(x − 3)', f: x => (1 / x - 1 / 3) / (x - 3), g: x => -1 / (3 * x), a: 3, L: -1 / 9, LT: '−1/9', br: [0], win: {xmin: 0.3, xmax: 6, ymin: -0.6, ymax: 0.1},
    steps: [['Substitute', '(1/3 − 1/3)/0 = 0/0'], ['Combine the fractions', '((3 − x)/(3x))/(x − 3)'], ['Cancel x − 3 (3 − x = −(x − 3))', '−1/(3x)'], ['Substitute', '−1/9']]}
];
CA.lab('factor-lab', {
  controls: [{type: 'select', key: 'p', label: 'Limit', value: '0', options: FAC.map((q, i) => [String(i), q.t])}, {type: 'check', key: 'g', label: 'Show the simplified function', value: true}],
  plot: {w: 520, h: 360}, plotLabel: 'Original function with a hole and the simplified function', legend: [['blue', 'original f'], ['green', 'simplified (agrees except at a)', true]], readouts: [['L', 'Limit']], steps: true
}, (lab, st) => {
  const Q = FAC[+st.p], P = lab.plane(Object.assign({equal: false}, Q.win));
  P.curve(Q.f, {color: 'blue', width: 4, breaks: Q.br, samples: 1200}); if (st.g) P.curve(Q.g, {color: 'green', width: 2, dash: '7 6', breaks: Q.br});
  P.point(Q.a, Q.L, {color: 'blue', r: 6.5, filled: false, label: `(${num(Q.a)}, ${Q.LT})`, labelOpt: {dy: -12}}).render();
  lab.steps(Q.steps); lab.read('L', Q.LT);
  lab.out(`The graphs are identical except at x = ${num(Q.a)}, where f has a hole. Equal functions near a have equal limits: ${Q.LT}.`, 'ca-correct');
});

/* ---------- 03 · conjugates ---------- */
const CJ = [
  {t: 'lim x→5 (√(x + 4) − 3)/(x − 5)', f: x => (Math.sqrt(x + 4) - 3) / (x - 5), a: 5, L: 1 / 6, LT: '1/6', lo: -4, win: {xmin: -4.5, xmax: 12, ymin: -0.1, ymax: 0.6},
    steps: [['Substitute', '(√9 − 3)/0 = 0/0'], ['Multiply by the conjugate', '(√(x + 4) − 3)(√(x + 4) + 3) / ((x − 5)(√(x + 4) + 3))'], ['Difference of squares', '((x + 4) − 9)/((x − 5)(√(x + 4) + 3)) = (x − 5)/((x − 5)(√(x + 4) + 3))'], ['Cancel and substitute', '1/(√(x + 4) + 3) → 1/(3 + 3) = 1/6']]},
  {t: 'lim x→4 (√x − 2)/(x − 4)', f: x => (Math.sqrt(x) - 2) / (x - 4), a: 4, L: 1 / 4, LT: '1/4', lo: 0, win: {xmin: -0.5, xmax: 10, ymin: -0.1, ymax: 0.7},
    steps: [['Substitute', '0/0'], ['Multiply by the conjugate', '(√x − 2)(√x + 2)/((x − 4)(√x + 2))'], ['Difference of squares', '(x − 4)/((x − 4)(√x + 2))'], ['Cancel and substitute', '1/(√x + 2) → 1/4']]},
  {t: 'lim x→0 (√(x + 1) − 1)/x', f: x => (Math.sqrt(x + 1) - 1) / x, a: 0, L: 1 / 2, LT: '1/2', lo: -1, win: {xmin: -1.2, xmax: 4, ymin: -0.1, ymax: 1.1},
    steps: [['Substitute', '0/0'], ['Multiply by the conjugate', '(√(x + 1) − 1)(√(x + 1) + 1)/(x(√(x + 1) + 1))'], ['Difference of squares', 'x/(x(√(x + 1) + 1))'], ['Cancel and substitute', '1/(√(x + 1) + 1) → 1/2']]},
  {t: 'lim x→9 (x − 9)/(√x − 3)', f: x => (x - 9) / (Math.sqrt(x) - 3), a: 9, L: 6, LT: '6', lo: 0, win: {xmin: -0.5, xmax: 16, ymin: -0.5, ymax: 8},
    steps: [['Substitute', '0/0'], ['Multiply by the conjugate', '(x − 9)(√x + 3)/((√x − 3)(√x + 3))'], ['Difference of squares', '(x − 9)(√x + 3)/(x − 9)'], ['Cancel and substitute', '√x + 3 → 6']]}
];
CA.lab('conj-lab', {
  controls: [{type: 'select', key: 'p', label: 'Limit', value: '0', options: CJ.map((q, i) => [String(i), q.t])}],
  plot: {w: 520, h: 340}, plotLabel: 'Graph of the quotient with a hole', readouts: [['L', 'Limit'], ['n', 'f(a ± 0.001)']], steps: true
}, (lab, st) => {
  const Q = CJ[+st.p], P = lab.plane(Object.assign({equal: false}, Q.win));
  P.curve(Q.f, {color: 'blue', width: 3.6, from: Q.lo + 1e-6, to: Q.win.xmax, samples: 1200}).point(Q.a, Q.L, {color: 'blue', r: 6.5, filled: false, label: `(${num(Q.a)}, ${Q.LT})`, labelOpt: {dy: -12}}).render();
  lab.steps(Q.steps); lab.read('L', Q.LT); lab.read('n', `${num(Q.f(Q.a - 0.001), 6)} · ${num(Q.f(Q.a + 0.001), 6)}`);
  lab.out(`After rationalizing, the factor that made 0/0 cancels, and substitution gives ${Q.LT}.`, 'ca-correct');
});

/* ---------- 04 · piecewise limits ---------- */
const PW = [
  {t: 'f(x) = 4x − 3 (x < 2); (x − 3)² (x ≥ 2)', l: x => 4 * x - 3, r: x => (x - 3) ** 2, a: 2, lT: '4(2) − 3 = 5', rT: '(2 − 3)² = 1', win: {xmin: -1, xmax: 5, ymin: -4, ymax: 8}},
  {t: 'f(x) = x² − 1 (x < 3); 2x + 2 (x ≥ 3)', l: x => x * x - 1, r: x => 2 * x + 2, a: 3, lT: '3² − 1 = 8', rT: '2(3) + 2 = 8', win: {xmin: -1, xmax: 6, ymin: -2, ymax: 16}},
  {t: 'f(x) = √(4 − x) (x < 4); x − 4 (x ≥ 4)', l: x => Math.sqrt(4 - x), r: x => x - 4, a: 4, lT: '√(4 − 4) = 0', rT: '4 − 4 = 0', win: {xmin: -1, xmax: 8, ymin: -1, ymax: 4}},
  {t: 'f(x) = 1/x (x < 1); x + 1 (x ≥ 1)', l: x => 1 / x, r: x => x + 1, a: 1, lT: '1/1 = 1', rT: '1 + 1 = 2', win: {xmin: -0.2, xmax: 4, ymin: -0.5, ymax: 5}, lo: 0.01}
];
CA.lab('pwl-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: PW.map((q, i) => [String(i), q.t])}],
  plot: {w: 520, h: 360}, plotLabel: 'Piecewise function near the break point', legend: [['orange', 'piece for x < a'], ['purple', 'piece for x ≥ a']], readouts: [['L', 'x → a⁻'], ['R', 'x → a⁺'], ['lim', 'lim x → a']]
}, (lab, st) => {
  const Q = PW[+st.p], a = Q.a, P = lab.plane(Object.assign({equal: false}, Q.win)), yl = Q.l(a), yr = Q.r(a);
  P.curve(Q.l, {color: 'orange', width: 3.4, from: Q.lo ?? Q.win.xmin, to: a - 1e-9}).curve(Q.r, {color: 'purple', width: 3.4, from: a, to: Q.win.xmax}).vline(a, {color: 'gray', dash: '4 5', width: 1.2});
  P.point(a, yl, {color: 'orange', r: 6, filled: Math.abs(yl - yr) < 1e-9}).point(a, yr, {color: 'purple', r: 6}).render();
  const same = Math.abs(yl - yr) < 1e-9;
  lab.read('L', Q.lT); lab.read('R', Q.rT); lab.read('lim', same ? num(yl) : 'does not exist');
  lab.out(same ? `Both pieces arrive at ${num(yl)}, so the limit is ${num(yl)}.` : `The left piece arrives at ${num(yl)} and the right piece at ${num(yr)}: the limit does not exist.`, same ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 05 · squeeze theorem ---------- */
const SQ = [
  {t: 'g(x) = x² sin(1/x), between −x² and x²', g: x => x * x * Math.sin(1 / x), lo: x => -x * x, hi: x => x * x, why: '−1 ≤ sin(1/x) ≤ 1, multiplied by x² ≥ 0'},
  {t: 'g(x) = x sin(1/x), between −|x| and |x|', g: x => x * Math.sin(1 / x), lo: x => -Math.abs(x), hi: x => Math.abs(x), why: '|x sin(1/x)| ≤ |x|'},
  {t: 'g(x) = x² cos(20/x), between −x² and x²', g: x => x * x * Math.cos(20 / x), lo: x => -x * x, hi: x => x * x, why: '−1 ≤ cos(20/x) ≤ 1, multiplied by x²'},
  {t: 'g(x) = (sin x)/x, between cos x and 1', g: x => Math.sin(x) / x, lo: Math.cos, hi: () => 1, why: 'cos x ≤ (sin x)/x ≤ 1 for 0 < |x| < π/2 (from areas in the unit circle)', L: 1}
];
CA.lab('squeeze-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: SQ.map((q, i) => [String(i), q.t])}, {type: 'range', key: 'z', label: 'Zoom: window half-width', min: 0, max: 3, step: 0.1, value: 0, fmt: z => num(10 ** -z, 4)}],
  plot: {w: 560, h: 380}, plotLabel: 'Function squeezed between two bounds near x = 0', legend: [['blue', 'g(x)'], ['orange', 'lower bound', true], ['purple', 'upper bound', true]], readouts: [['b', 'Bounds at the window edge'], ['lim', 'lim x → 0 g(x)']]
}, (lab, st) => {
  const Q = SQ[+st.p], w = 10 ** -st.z * (Q.L ? 1.5 : 1), L = Q.L || 0, hiW = Math.max(Q.hi(w), Q.hi(-w)), loW = Math.min(Q.lo(w), Q.lo(-w)), span = Math.max(hiW - L, L - loW, 1e-12) * 1.3;
  const P = lab.plane({xmin: -w, xmax: w, ymin: L - span, ymax: L + span, equal: false});
  P.curve(Q.lo, {color: 'orange', width: 2.2, dash: '7 6'}).curve(Q.hi, {color: 'purple', width: 2.2, dash: '7 6'}).curve(Q.g, {color: 'blue', width: 2.4, samples: 6000, breaks: [0]});
  P.point(0, L, {color: 'blue', r: 6, filled: false}).render();
  lab.read('b', `${num(Q.lo(w), 6)} ≤ g ≤ ${num(Q.hi(w), 6)}`); lab.read('lim', String(L));
  lab.out(`Because ${Q.why}, g is trapped between the two bounds, and both bounds approach ${L} as x → 0. Zoom in: the bounds pinch g to ${L}.`, 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('23', [
  {q: 'lim<sub>x→−1</sub> (3x² − 5x + 2) = ?', opts: ['10', '0', '4', '6'], correct: 0, hint: 'Polynomials: substitute.', why: '3 + 5 + 2 = 10.', ref: {panel: 'laws', what: 'the limit laws', body: '<p>For a polynomial, lim<sub>x→a</sub> p(x) = p(a).</p>'}},
  {q: 'If lim f(x) = 4 and lim g(x) = −2 as x → a, then lim (f(x)² − 3g(x)) = ?', opts: ['22', '10', '14', '−2'], correct: 0, hint: 'Power, difference, and constant multiple laws.', why: '4² − 3(−2) = 16 + 6 = 22.'},
  {q: 'lim<sub>x→3</sub> (x² − 9)/(x − 3) = ?', opts: ['6', '0', '3', 'does not exist'], correct: 0, hint: 'Factor x² − 9.', why: '(x − 3)(x + 3)/(x − 3) = x + 3 → 6.', ref: {panel: 'factor', what: 'factoring and canceling', body: '<p>Factor, cancel the common factor (x − a), then substitute.</p>'}},
  {q: 'lim<sub>x→2</sub> (x² − 2x)/(x² − 4) = ?', opts: ['1/2', '0', '1', 'does not exist'], correct: 0, hint: 'Cancel x − 2.', why: 'x/(x + 2) → 2/4.'},
  {q: 'lim<sub>h→0</sub> ((3 + h)² − 9)/h = ?', opts: ['6', '9', '0', '3'], correct: 0, hint: 'Expand: 6h + h².', why: '(6h + h²)/h = 6 + h → 6.'},
  {q: 'lim<sub>x→0</sub> (√(x + 9) − 3)/x = ?', opts: ['1/6', '1/3', '0', '6'], correct: 0, hint: 'Multiply by √(x + 9) + 3.', why: 'x/(x(√(x + 9) + 3)) → 1/6.', ref: {panel: 'conjugate', what: 'multiplying by a conjugate', body: '<p>(√a − √b)(√a + √b) = a − b.</p>'}},
  {q: 'For f(x) = 4x − 3 (x &lt; 2) and (x − 3)² (x ≥ 2), lim<sub>x→2⁻</sub> f(x) = ?', opts: ['5', '1', '−3', 'does not exist'], correct: 0, hint: 'Use the piece for x &lt; 2.', why: '4·2 − 3 = 5.', ref: {panel: 'piecewise', what: 'piecewise limits', body: '<p>Use the left formula for x → a⁻ and the right formula for x → a⁺.</p>'}},
  {q: 'For the same f, lim<sub>x→2</sub> f(x):', opts: ['does not exist', '5', '1', '3'], correct: 0, hint: 'Compare the one-sided limits 5 and 1.', why: 'They differ.'},
  {q: 'If 1 − x² ≤ g(x) ≤ 1 + x² for all x, then lim<sub>x→0</sub> g(x) = ?', opts: ['1', '0', '2', 'cannot be determined'], correct: 0, hint: 'Both bounds approach the same number.', why: 'Both bounds → 1; the Squeeze Theorem gives 1.', ref: {panel: 'squeeze', what: 'the Squeeze Theorem', body: '<p>If f ≤ g ≤ h near a and f, h → L, then g → L.</p>'}},
  {q: 'lim<sub>x→0</sub> x⁴ cos(1/x) = ?', opts: ['0', '1', 'does not exist', '∞'], correct: 0, hint: '−x⁴ ≤ x⁴ cos(1/x) ≤ x⁴.', why: 'Both bounds → 0.'}
]);
})();
