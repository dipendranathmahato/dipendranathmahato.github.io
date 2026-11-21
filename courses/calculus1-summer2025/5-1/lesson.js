/* Section 5.1 · Approximating Areas — interactive activities */
(() => {
'use strict';
const {num} = CA;

/* ---------- 01 · sums ---------- */
const SUMS = {
  lin: {t: '1 + 2 + ⋯ + n', term: i => i, termT: i => `${i}`, f: n => n * (n + 1) / 2, fT: n => `${n}(${n + 1})/2`},
  sq: {t: '1² + 2² + ⋯ + n²', term: i => i * i, termT: i => `${i}²`, f: n => n * (n + 1) * (2 * n + 1) / 6, fT: n => `${n}(${n + 1})(${2 * n + 1})/6`},
  cube: {t: '1³ + 2³ + ⋯ + n³', term: i => i ** 3, termT: i => `${i}³`, f: n => (n * (n + 1) / 2) ** 2, fT: n => `[${n}(${n + 1})/2]²`},
  mix: {t: 'Σ (2i + 3), i = 1 … n', term: i => 2 * i + 3, termT: i => `${2 * i + 3}`, f: n => n * (n + 1) + 3 * n, fT: n => `2·${n}(${n + 1})/2 + 3·${n}`}
};
CA.lab('sum-lab', {
  controls: [{type: 'select', key: 's', label: 'Sum', value: 'sq', options: Object.entries(SUMS).map(([k, v]) => [k, v.t])}, {type: 'range', key: 'n', label: 'n =', min: 1, max: 40, step: 1, value: 4}],
  plot: {xmin: 0, xmax: 41, ymin: 0, ymax: 10, w: 540, h: 280, equal: false, xname: 'i', yname: 'term'}, plotLabel: 'Each term drawn as a bar', readouts: [['add', 'adding the terms'], ['form', 'formula'], ['v', 'value']]
}, (lab, st) => {
  const S = SUMS[st.s], n = st.n, terms = Array.from({length: n}, (_, k) => S.term(k + 1)), tot = terms.reduce((a, b) => a + b, 0), top = Math.max(...terms) * 1.12;
  const P = lab.plane({xmin: 0, xmax: n + 1, ymin: 0, ymax: top});
  terms.forEach((t, k) => P.poly([[k + 0.6, 0], [k + 1.4, 0], [k + 1.4, t], [k + 0.6, t]], {color: 'blue', fillOpacity: 0.3, width: 1.2})); P.render();
  lab.read('add', n <= 6 ? terms.map((t, k) => S.termT(k + 1)).join(' + ') + ` = ${tot}` : `${S.termT(1)} + ${S.termT(2)} + ⋯ + ${S.termT(n)} = ${tot}`);
  lab.read('form', `${S.fT(n)} = ${S.f(n)}`); lab.read('v', String(tot));
  lab.out(`Adding the ${n} terms one by one and using the formula give the same number, ${tot}.`, 'ca-correct');
});

/* ---------- 02 · left / right / midpoint ---------- */
const RI = [
  {t: 'f(x) = x² on [0, 4]', f: x => x * x, a: 0, b: 4, ex: 64 / 3, exT: '64/3', win: {xmin: -0.5, xmax: 4.5, ymin: -1, ymax: 17.5}},
  {t: 'f(x) = x√(x³ + 1) on [0, 5]', f: x => x * Math.sqrt(x ** 3 + 1), a: 0, b: 5, ex: null, win: {xmin: -0.5, xmax: 5.5, ymin: -2, ymax: 60}},
  {t: 'f(x) = 1/x on [1, 3]', f: x => 1 / x, a: 1, b: 3, ex: Math.log(3), exT: 'ln 3', win: {xmin: 0.5, xmax: 3.5, ymin: -0.1, ymax: 1.2}},
  {t: 'f(x) = sin x on [0, π]', f: Math.sin, a: 0, b: Math.PI, ex: 2, exT: '2', win: {xmin: -0.3, xmax: 3.5, ymin: -0.2, ymax: 1.3}},
  {t: 'f(x) = 4 − x² on [−2, 2]', f: x => 4 - x * x, a: -2, b: 2, ex: 32 / 3, exT: '32/3', win: {xmin: -2.5, xmax: 2.5, ymin: -0.5, ymax: 4.6}}
];
const RULE = {left: 'left endpoints', right: 'right endpoints', mid: 'midpoints'}, COL = {left: 'orange', right: 'purple', mid: 'blue'};
CA.lab('riem-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: RI.map((r, i) => [String(i), r.t])}, {type: 'seg', key: 'rule', label: 'Heights from', value: 'left', options: Object.entries(RULE)}, {type: 'range', key: 'n', label: 'n =', min: 1, max: 60, step: 1, value: 4}],
  plot: {w: 540, h: 360}, plotLabel: 'Riemann sum rectangles', readouts: [['dx', 'Δx'], ['s', 'sum'], ['ex', 'exact area'], ['o', 'estimate is']], bottom: '<div id="riem-table"></div>'
}, (lab, st) => {
  const R = RI[+st.p], n = st.n, S = CA.riemann(R.f, R.a, R.b, n, st.rule), ex = R.ex ?? CA.integrate(R.f, R.a, R.b, 4000), P = lab.plane(Object.assign({equal: false}, R.win));
  CA.drawRects(P, S, {color: COL[st.rule], fillOpacity: 0.28}); P.curve(R.f, {color: 'text', width: 3, from: R.win.xmin, to: R.win.xmax}).render();
  lab.read('dx', `(${num(R.b, 4)} − ${num(R.a, 4)})/${n} = ${num(S.dx, 5)}`); lab.read('s', num(S.sum, 6)); lab.read('ex', R.ex !== null ? `${R.exT} ≈ ${num(ex, 6)}` : `≈ ${num(ex, 6)}`);
  lab.read('o', Math.abs(S.sum - ex) < 1e-9 ? 'exact' : S.sum > ex ? 'too large (over)' : 'too small (under)');
  const k = n <= 8 ? S.rects.map((r, i) => `<td>${num(r.xs, 4)}</td>`).join('') : '';
  document.getElementById('riem-table').innerHTML = n <= 8 ? `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>sample point</th>${k}</tr><tr><th>height f</th>${S.rects.map(r => `<td>${num(r.h, 4)}</td>`).join('')}</tr></table></div><p class="ca-muted">Sum = (${S.rects.map(r => num(r.h, 4)).join(' + ')}) × ${num(S.dx, 4)} = ${num(S.sum, 6)}</p>` : '';
  lab.out(+st.p === 3 || +st.p === 4 ? 'This function rises and then falls, so the left and right sums can both be close to the area (here they are equal by symmetry); the area need not lie between them.' : `This function is ${+st.p === 2 ? 'decreasing: left sums are too large and right sums too small' : 'increasing: left sums are too small and right sums too large'}. More rectangles shrink the error.`);
});

/* ---------- 03 · limit ---------- */
CA.stepLab('limit-steps', [
  {t: 'Rₙ for f(x) = x² on [0, 4]', res: 'A = 64/3', steps: [['Width and endpoints', 'Δx = 4/n, xᵢ = 4i/n'], ['Write the sum', 'Rₙ = Σ (4i/n)² · 4/n = Σ 4³i²/n³'], ['Factor out constants', 'Rₙ = (4³/n³)(1² + 2² + ⋯ + n²)'], ['Sum of squares', 'Rₙ = (4³/n³) · n(n + 1)(2n + 1)/6'], ['Limit', 'lim (4³/6)(1 + 1/n)(2 + 1/n) = (4³/6)·2 = 64/3']]},
  {t: 'Lₙ for f(x) = x² on [0, 4]', res: 'A = 64/3', steps: [['Left endpoints', 'xᵢ₋₁ = 4(i − 1)/n for i = 1, …, n'], ['Write the sum', 'Lₙ = (4³/n³)(0² + 1² + ⋯ + (n − 1)²)'], ['Sum of squares up to n − 1', 'Lₙ = (4³/n³) · (n − 1)n(2n − 1)/6'], ['Limit', 'lim (4³/6)(1 − 1/n)(2 − 1/n) = 64/3']]},
  {t: 'Rₙ for f(x) = 2x + 1 on [0, 3]', res: 'A = 12', steps: [['Width and endpoints', 'Δx = 3/n, xᵢ = 3i/n'], ['Write the sum', 'Rₙ = Σ (6i/n + 1)(3/n) = (18/n²)Σ i + (3/n)Σ 1'], ['Sum formulas', '(18/n²)·n(n + 1)/2 + (3/n)·n = 9(1 + 1/n) + 3'], ['Limit', '9 + 3 = 12 (a trapezoid with sides 1 and 7, width 3)']]}
]);
CA.lab('squeeze-lab', {
  controls: [{type: 'range', key: 'k', label: 'n = 2^k, k =', min: 0, max: 12, step: 1, value: 2}],
  plot: {xmin: 0, xmax: 12.5, ymin: 0, ymax: 34, w: 540, h: 300, equal: false, xname: 'k', yname: ''}, plotLabel: 'Lₙ and Rₙ for x² on [0, 4] approaching 64/3', legend: [['orange', 'Lₙ'], ['purple', 'Rₙ'], ['green', '64/3', true]], readouts: [['n', 'n'], ['L', 'Lₙ'], ['R', 'Rₙ'], ['g', 'Rₙ − Lₙ']]
}, (lab, st) => {
  const L = n => 64 * (n - 1) * (2 * n - 1) / (6 * n * n), R = n => 64 * (n + 1) * (2 * n + 1) / (6 * n * n), n = 2 ** st.k, P = lab.plane();
  P.hline(64 / 3, {color: 'green', dash: '7 6', width: 1.8});
  for (let k = 0; k <= 12; k++) { const m = 2 ** k; P.point(k, L(m), {color: 'orange', r: k === st.k ? 7 : 4}).point(k, R(m), {color: 'purple', r: k === st.k ? 7 : 4}); }
  P.render();
  lab.read('n', String(n)); lab.read('L', num(L(n), 7)); lab.read('R', num(R(n), 7)); lab.read('g', `${num(R(n) - L(n), 6)} = 16/n`);
  lab.out(`The gap Rₙ − Lₙ = 16/n shrinks to 0, and 64/3 ≈ 21.3333 is always between the two sums. So the area is exactly 64/3.`, st.k >= 8 ? 'ca-correct' : '');
});

/* ---------- guided problems ---------- */
CA.guided('51', [
  {q: 'Σ<sub>i=1</sub><sup>10</sup> i = ?', opts: ['55', '45', '100', '110'], correct: 0, hint: 'n(n + 1)/2.', why: '10 · 11/2.', ref: {panel: 'sigma', what: 'the sum formulas', body: '<p>Σ i = n(n + 1)/2, Σ i² = n(n + 1)(2n + 1)/6.</p>'}},
  {q: 'Σ<sub>i=1</sub><sup>5</sup> i² = ?', opts: ['55', '25', '15', '30'], correct: 0, hint: '5 · 6 · 11/6.', why: '1 + 4 + 9 + 16 + 25 = 55.'},
  {q: 'Σ<sub>i=1</sub><sup>20</sup> (3i − 2) = ?', opts: ['590', '630', '610', '570'], correct: 0, hint: '3 Σ i − 2 Σ 1.', why: '3 · 210 − 40.'},
  {q: 'For f(x) = x² on [0, 4] with n = 4, L₄ = ?', opts: ['14', '30', '21', '64/3'], correct: 0, hint: 'Heights f(0), f(1), f(2), f(3).', why: '0 + 1 + 4 + 9.', ref: {panel: 'endpoint', what: 'L₄ and R₄ for x²', body: '<p>Δx = 1; left endpoints 0, 1, 2, 3; right endpoints 1, 2, 3, 4.</p>'}},
  {q: 'For f(x) = x² on [0, 4] with n = 4, R₄ = ?', opts: ['30', '14', '22', '16'], correct: 0, hint: 'Heights f(1), …, f(4).', why: '1 + 4 + 9 + 16.'},
  {q: 'For f(x) = x² on [0, 4] with n = 4, M₄ = ?', opts: ['21', '22', '20', '64/3'], correct: 0, hint: 'Midpoints 0.5, 1.5, 2.5, 3.5.', why: '0.25 + 2.25 + 6.25 + 12.25 = 21.'},
  {q: 'For a decreasing function, the right-endpoint sum:', opts: ['underestimates the area', 'overestimates the area', 'is exact', 'is always 0'], correct: 0, hint: 'The right end is the lowest point of each strip.', why: 'Each rectangle stays under the curve.'},
  {q: 'For f(x) = x√(x³ + 1) on [0, 5] with n = 5, Δx = ?', opts: ['1', '5', '1/5', '0'], correct: 0, hint: '(b − a)/n.', why: '5/5.'},
  {q: 'lim<sub>n→∞</sub> Rₙ for x² on [0, 4] equals:', opts: ['64/3', '16', '30', '32'], correct: 0, hint: '(64/6)(1 + 1/n)(2 + 1/n).', why: '(64/6)·2.', ref: {panel: 'exact', what: 'the exact area', body: '<p>Rₙ = (4³/n³) · n(n + 1)(2n + 1)/6.</p>'}},
  {q: 'Rₙ for f(x) = 2x + 1 on [0, 3] approaches:', opts: ['12', '9', '7', '21'], correct: 0, hint: 'A trapezoid.', why: '(1 + 7)/2 · 3.'}
]);
})();
