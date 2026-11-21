/* Section 4.2 · Linear Approximations and Differentials — interactive activities */
(() => {
'use strict';
const {num} = CA;

/* ---------- 01 · linearization ---------- */
const LIN = [
  {t: 'f(x) = ∛x at a = 8', f: Math.cbrt, df: x => 1 / (3 * Math.cbrt(x) ** 2), a: 8, LT: 'L(x) = 2 + (x − 8)/12', x0: 8.05, win: {xmin: -1, xmax: 28, ymin: -0.5, ymax: 4.2}, lo: 0},
  {t: 'f(x) = √x at a = 9', f: Math.sqrt, df: x => 0.5 / Math.sqrt(x), a: 9, LT: 'L(x) = 3 + (x − 9)/6', x0: 9.2, win: {xmin: -1, xmax: 20, ymin: -0.5, ymax: 5}, lo: 0},
  {t: 'f(x) = sin x at a = 0', f: Math.sin, df: Math.cos, a: 0, LT: 'L(x) = x', x0: 0.1, win: {xmin: -3, xmax: 3, ymin: -1.8, ymax: 1.8}},
  {t: 'f(x) = eˣ at a = 0', f: Math.exp, df: Math.exp, a: 0, LT: 'L(x) = 1 + x', x0: 0.05, win: {xmin: -2, xmax: 2, ymin: -0.5, ymax: 5}},
  {t: 'f(x) = (1 + x)¹⁰ at a = 0', f: x => (1 + x) ** 10, df: x => 10 * (1 + x) ** 9, a: 0, LT: 'L(x) = 1 + 10x', x0: 0.01, win: {xmin: -0.4, xmax: 0.4, ymin: -1, ymax: 6}},
  {t: 'f(x) = 1/x at a = 2', f: x => 1 / x, df: x => -1 / (x * x), a: 2, LT: 'L(x) = 1/2 − (x − 2)/4', x0: 2.1, win: {xmin: 0.2, xmax: 5, ymin: -0.5, ymax: 2.5}, lo: 0.1}
];
CA.lab('lin-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function and base point', value: '0', options: LIN.map((l, i) => [String(i), l.t])}, {type: 'range', key: 'u', label: 'Estimate at x (distance from a)', min: -100, max: 100, step: 1, value: 2, fmt: () => ''}],
  plot: {w: 540, h: 360}, plotLabel: 'Function and its linear approximation', legend: [['blue', 'y = f(x)'], ['green', 'y = L(x)']],
  readouts: [['L', 'Linearization'], ['x', 'x'], ['fx', 'true f(x)'], ['Lx', 'estimate L(x)'], ['e', 'error |f(x) − L(x)|']]
}, (lab, st, key) => {
  const Q = LIN[+st.p], W = Q.win; if (key === 'p') st.set('u', Math.round((Q.x0 - Q.a) / (W.xmax - Q.a) * 100) || 2, true);
  const span = st.u >= 0 ? W.xmax - Q.a : Q.a - Math.max(W.xmin, Q.lo ?? W.xmin), x = Q.a + span * st.u / 100 * 0.98, m = Q.df(Q.a), L = t => Q.f(Q.a) + m * (t - Q.a);
  const P = lab.plane(Object.assign({equal: false}, W));
  P.curve(Q.f, {color: 'blue', width: 3.2, from: Q.lo ?? W.xmin}).curve(L, {color: 'green', width: 2.4}).seg(x, Q.f(x), x, L(x), {color: 'red', width: 3}).point(Q.a, Q.f(Q.a), {color: 'orange', r: 7, label: 'a'}).point(x, L(x), {color: 'green', r: 5}).render();
  const e = Math.abs(Q.f(x) - L(x));
  lab.read('L', Q.LT); lab.read('x', num(x, 4)); lab.read('fx', num(Q.f(x), 7)); lab.read('Lx', num(L(x), 7)); lab.read('e', num(e, 3));
  lab.out(`The red segment is the error. Near x = ${num(Q.a)} it is tiny; farther away the tangent line drifts from the curve.`, e < 0.01 ? 'ca-correct' : '');
});

/* ---------- 02 · choosing the base point ---------- */
CA.lab('choose-lab', {
  controls: [{type: 'range', key: 'x', label: 'Estimate ∛x at x =', min: 1, max: 30, step: 0.5, value: 25, fmt: v => num(v, 1)}],
  plot: {xmin: -1, xmax: 31, ymin: -0.5, ymax: 4.5, w: 540, h: 340, equal: false}, plotLabel: 'Cube root with two linearizations', legend: [['blue', 'y = ∛x'], ['orange', 'L from a = 8'], ['purple', 'L from a = 27']],
  readouts: [['t', 'true ∛x'], ['a', 'from a = 8'], ['b', 'from a = 27']]
}, (lab, st) => {
  const x = st.x, L8 = t => 2 + (t - 8) / 12, L27 = t => 3 + (t - 27) / 27, P = lab.plane();
  P.curve(Math.cbrt, {color: 'blue', width: 3.2, from: 0}).curve(L8, {color: 'orange', width: 2.2}).curve(L27, {color: 'purple', width: 2.2});
  P.point(8, 2, {color: 'orange', r: 6, label: '(8, 2)'}).point(27, 3, {color: 'purple', r: 6, label: '(27, 3)'}).vline(x, {color: 'gray', dash: '3 4', width: 1.2}).render();
  const t = Math.cbrt(x), e8 = Math.abs(L8(x) - t), e27 = Math.abs(L27(x) - t);
  lab.read('t', num(t, 6)); lab.read('a', `${num(L8(x), 6)} (error ${num(e8, 3)})`); lab.read('b', `${num(L27(x), 6)} (error ${num(e27, 3)})`);
  lab.out(`For x = ${num(x, 1)} the base point ${e8 < e27 ? '8' : '27'} gives the better estimate: it is ${e8 < e27 ? 'closer to 8' : 'closer to 27'}.`, 'ca-correct');
});

/* ---------- 03 · dy versus Δy ---------- */
const DY = [
  {t: 'y = x² + 7 at x = 1', f: x => x * x + 7, df: x => 2 * x, x: 1, dyT: 'dy = 2x dx', win: {xmin: -0.5, xmax: 3, ymin: 6, ymax: 14}},
  {t: 'y = x³ at x = 2', f: x => x ** 3, df: x => 3 * x * x, x: 2, dyT: 'dy = 3x² dx', win: {xmin: 0.5, xmax: 3.5, ymin: -1, ymax: 30}},
  {t: 'y = √x at x = 4', f: Math.sqrt, df: x => 0.5 / Math.sqrt(x), x: 4, dyT: 'dy = dx/(2√x)', win: {xmin: 0, xmax: 9, ymin: 0, ymax: 3.5}},
  {t: 'y = sin x at x = π/4', f: Math.sin, df: Math.cos, x: Math.PI / 4, dyT: 'dy = cos x dx', win: {xmin: -0.5, xmax: 2.5, ymin: -0.3, ymax: 1.4}}
];
CA.lab('dy-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function and x', value: '0', options: DY.map((d, i) => [String(i), d.t])}, {type: 'range', key: 'k', label: 'dx = Δx =', min: -3, max: 0, step: 0.25, value: 0, fmt: k => num(10 ** k, 4)}],
  plot: {w: 540, h: 360}, plotLabel: 'Actual change Δy and the differential dy', legend: [['blue', 'y = f(x)'], ['green', 'tangent line'], ['purple', 'Δy'], ['orange', 'dy']],
  readouts: [['f', 'formula'], ['dy', 'dy = f′(x)dx'], ['Dy', 'Δy = f(x + Δx) − f(x)'], ['d', 'Δy − dy']]
}, (lab, st) => {
  const D = DY[+st.p], x = D.x, dx = 10 ** st.k, f = D.f, m = D.df(x), dy = m * dx, Dy = f(x + dx) - f(x);
  const zoom = Math.max(dx * 2.5, 0.002), W = dx >= 0.5 ? D.win : {xmin: x - zoom, xmax: x + 2 * zoom, ymin: f(x) - Math.abs(m) * zoom - zoom, ymax: f(x) + Math.abs(m) * 2 * zoom + zoom};
  const P = lab.plane(Object.assign({equal: false}, W));
  P.curve(f, {color: 'blue', width: 3.2, samples: 800}).lineMB(m, f(x) - m * x, {color: 'green', width: 2}).seg(x, f(x), x + dx, f(x), {color: 'gray', dash: '4 4', width: 1.4});
  P.seg(x + dx, f(x), x + dx, f(x) + Dy, {color: 'purple', width: 4}).seg(x + dx * 1.04, f(x), x + dx * 1.04, f(x) + dy, {color: 'orange', width: 4});
  P.point(x, f(x), {color: 'text', r: 5}).render();
  lab.read('f', D.dyT); lab.read('dy', num(dy, 8)); lab.read('Dy', num(Dy, 8)); lab.read('d', num(Dy - dy, 3));
  lab.out(`dy follows the tangent line; Δy follows the curve. ${dx < 0.01 ? 'For this small dx they agree to many decimal places (the window zooms in with dx).' : 'Shrink dx: the two changes become almost equal.'}`);
});

/* ---------- 04 · propagated error ---------- */
const ER = [
  {t: 'cube: V = s³, side s', q: s => s ** 3, dq: s => 3 * s * s, x: 10, dx: 0.1, xU: 'cm', qU: 'cm³', qn: 'V', xn: 's'},
  {t: 'sphere: V = (4/3)πr³, radius r', q: r => 4 / 3 * Math.PI * r ** 3, dq: r => 4 * Math.PI * r * r, x: 5, dx: 0.05, xU: 'cm', qU: 'cm³', qn: 'V', xn: 'r'},
  {t: 'circle: A = πr², radius r', q: r => Math.PI * r * r, dq: r => 2 * Math.PI * r, x: 20, dx: 0.5, xU: 'm', qU: 'm²', qn: 'A', xn: 'r'}
];
CA.lab('err-lab', {
  controls: [{type: 'select', key: 'p', label: 'Quantity', value: '0', options: ER.map((e, i) => [String(i), e.t])}, {type: 'number', key: 'x', label: 'Measured value', value: 10, step: 0.5, min: 0.5}, {type: 'number', key: 'dx', label: 'Possible error ±', value: 0.1, step: 0.01, min: 0}],
  readouts: [['q', 'computed value'], ['dq', 'propagated error ≈ q′(x)dx'], ['rel', 'relative error dq/q'], ['act', 'actual worst change']], steps: true
}, (lab, st, key) => {
  const E = ER[+st.p]; if (key === 'p') { st.set('x', E.x, true); st.set('dx', E.dx, true); }
  const x = st.x, dx = st.dx; if (!(x > 0) || !(dx >= 0)) { lab.out('Use a positive measurement and a nonnegative error.', 'ca-incorrect'); return; }
  const q = E.q(x), dq = E.dq(x) * dx;
  lab.read('q', `${num(q, 5)} ${E.qU}`); lab.read('dq', `± ${num(dq, 4)} ${E.qU}`); lab.read('rel', `${num(dq / q * 100, 3)}% (the measurement itself: ${num(dx / x * 100, 3)}%)`); lab.read('act', `${num(E.q(x + dx) - q, 4)} ${E.qU}`);
  lab.steps([['Differential', `d${E.qn} = ${E.qn}′(${E.xn}) d${E.xn}`], ['Substitute', `d${E.qn} = ${num(E.dq(x), 5)} × ${num(dx, 4)} = ${num(dq, 4)} ${E.qU}`], ['Relative error', `d${E.qn}/${E.qn} = ${num(dq, 4)}/${num(q, 5)} ≈ ${num(dq / q * 100, 3)}%`]]);
  lab.out(+st.p === 2 ? 'For an area (a square of the measurement) the relative error is about twice that of the measurement.' : 'For a volume (a cube of the measurement) the relative error is about three times that of the measurement.');
});

/* ---------- guided problems ---------- */
CA.guided('42', [
  {q: 'The linear approximation of f(x) = √x at a = 9 is:', opts: ['L(x) = 3 + (x − 9)/6', 'L(x) = 3 + (x − 9)/3', 'L(x) = 9 + (x − 3)/6', 'L(x) = x/6'], correct: 0, hint: 'f(9) = 3, f′(9) = 1/(2·3).', why: 'L(x) = f(9) + f′(9)(x − 9).', ref: {panel: 'linear', what: 'the linearization formula', body: '<p>L(x) = f(a) + f′(a)(x − a).</p>'}},
  {q: 'Using L(x) = 2 + (x − 8)/12, ∛8.6 ≈ ?', opts: ['2.05', '2.6', '2.005', '2.5'], correct: 0, hint: '0.6/12.', why: '2 + 0.05.'},
  {q: 'Near x = 0, sin x ≈ ?', opts: ['x', '1', '1 − x', '0'], correct: 0, hint: 'sin 0 = 0, cos 0 = 1.', why: 'L(x) = 0 + 1 · x.'},
  {q: 'To estimate ∛25, the best base point among these is:', opts: ['a = 27', 'a = 8', 'a = 1', 'a = 64'], correct: 0, hint: 'Close to 25 and easy to evaluate.', why: '∛27 = 3 and 27 is near 25.', ref: {panel: 'choose-a', what: 'choosing a base point', body: '<p>Pick a nearby point where f and f′ are easy.</p>'}},
  {q: 'The linearization of eˣ at 0 gives e^0.1 ≈ ?', opts: ['1.1', '1.01', '0.1', '1.105'], correct: 0, hint: 'L(x) = 1 + x.', why: '1 + 0.1 (true value 1.10517).'},
  {q: 'For y = x³, dy = ?', opts: ['3x² dx', 'x³ dx', '3x dx', '(x + dx)³ − x³'], correct: 0, hint: 'dy = f′(x) dx.', why: 'f′(x) = 3x².', ref: {panel: 'differentials', what: 'differentials', body: '<p>dy = f′(x)dx; Δy = f(x + Δx) − f(x).</p>'}},
  {q: 'For y = x² + 7 at x = 1 with Δx = 0.001, Δy = ?', opts: ['0.002001', '0.002', '0.001', '8.002'], correct: 0, hint: '(1.001)² − 1.', why: '(2.001)(0.001).'},
  {q: 'For y = x² + 7 at x = 1 with dx = 0.001, dy = ?', opts: ['0.002', '0.002001', '0.001', '0.0001'], correct: 0, hint: 'dy = 2x dx.', why: '2(1)(0.001).'},
  {q: 'A cube’s side is measured as 10 cm ± 0.1 cm. The propagated error in its volume is about:', opts: ['± 30 cm³', '± 0.3 cm³', '± 3 cm³', '± 300 cm³'], correct: 0, hint: 'dV = 3s² ds.', why: '3(100)(0.1) = 30.', ref: {panel: 'error', what: 'propagated error', body: '<p>dq = q′(x)dx; relative error dq/q.</p>'}},
  {q: 'A 1% error in the radius gives about what relative error in the area of a circle?', opts: ['2%', '1%', '3%', '0.5%'], correct: 0, hint: 'dA/A = 2πr dr/(πr²) = 2 dr/r.', why: 'Twice the relative error of r.'}
]);
})();
