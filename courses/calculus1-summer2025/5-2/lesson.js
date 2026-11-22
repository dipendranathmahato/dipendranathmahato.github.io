/* Section 5.2 · The Definite Integral — interactive activities */
(() => {
'use strict';
const {num} = CA, PI = Math.PI;
const I = (f, a, b) => CA.integrate(f, a, b, 4000);
/* positive and negative parts */
const parts = (f, a, b) => { const lo = Math.min(a, b), hi = Math.max(a, b), s = Math.sign(b - a) || 1; return {pos: s * I(x => Math.max(0, f(x)), lo, hi), neg: s * I(x => Math.min(0, f(x)), lo, hi)}; };

/* ---------- 01 · signed area ---------- */
const SG = [
  {t: 'f(x) = x on [−2, 3]', f: x => x, a: -2, b: 3, exT: '5/2', win: {xmin: -3, xmax: 4, ymin: -3, ymax: 4}},
  {t: 'f(x) = sin x on [0, 2π]', f: Math.sin, a: 0, b: 2 * PI, exT: '0', win: {xmin: -0.5, xmax: 6.8, ymin: -1.5, ymax: 1.5}},
  {t: 'f(x) = x² − 4 on [0, 3]', f: x => x * x - 4, a: 0, b: 3, exT: '−3', win: {xmin: -0.5, xmax: 3.5, ymin: -5, ymax: 6}},
  {t: 'f(x) = x³ − 3x on [−2, 2]', f: x => x ** 3 - 3 * x, a: -2, b: 2, exT: '0', win: {xmin: -2.5, xmax: 2.5, ymin: -3, ymax: 3}},
  {t: 'f(x) = 2 − x on [0, 5]', f: x => 2 - x, a: 0, b: 5, exT: '−5/2', win: {xmin: -0.5, xmax: 5.5, ymin: -3.5, ymax: 2.5}}
];
CA.lab('signed-lab', {
  controls: [{type: 'select', key: 'p', label: 'Integral', value: '0', options: SG.map((s, i) => [String(i), s.t])}, {type: 'range', key: 'n', label: 'Rectangles n (0 = exact region)', min: 0, max: 60, step: 1, value: 10}],
  plot: {w: 540, h: 360}, plotLabel: 'Net signed area: blue counts positive, red counts negative', legend: [['blue', 'above the axis (+)'], ['red', 'below the axis (−)']],
  readouts: [['A', 'area above'], ['B', 'area below'], ['net', 'integral (net)'], ['tot', 'total area'], ['rs', 'midpoint sum']]
}, (lab, st) => {
  const S = SG[+st.p], P = lab.plane(Object.assign({equal: false}, S.win)), {pos, neg} = parts(S.f, S.a, S.b);
  if (st.n === 0) CA.shade(P, S.f, S.a, S.b, {split: true, samples: 300}); else CA.drawRects(P, CA.riemann(S.f, S.a, S.b, st.n, 'mid'), {signed: true, color: 'blue', negColor: 'red', fillOpacity: 0.3});
  P.curve(S.f, {color: 'text', width: 2.8}).render();
  lab.read('A', num(pos, 5)); lab.read('B', num(-neg, 5)); lab.read('net', `${S.exT} = ${num(pos + neg, 5)}`); lab.read('tot', num(pos - neg, 5)); lab.read('rs', st.n ? num(CA.riemann(S.f, S.a, S.b, st.n, 'mid').sum, 6) : '—');
  lab.out(`∫ f(x) dx = (area above) − (area below) = ${num(pos, 4)} − ${num(-neg, 4)} = ${num(pos + neg, 4)}. The total area adds them instead: ${num(pos - neg, 4)}.`);
});

/* ---------- 02 · geometry ---------- */
const g = x => x < -4 || x > 4 ? NaN : x <= 0 ? -Math.sqrt(Math.max(0, 4 - (x + 2) ** 2)) : x <= 2 ? x : 4 - x;
const PRE = [[-4, 4], [-4, 0], [0, 4], [-2, 2], [-4, -2], [2, 4], [4, -4]], EXACT = ['4 − 2π', '−2π', '4', '2 − π', '−π', '2', '2π − 4'];
CA.lab('geo-lab', {
  controls: [{type: 'select', key: 'q', label: 'Preset', value: '0', options: PRE.map(([a, b], i) => [String(i), `∫ from ${a} to ${b}`.replace(/-/g, '−')]).concat([['own', 'Use the sliders']])}, {type: 'range', key: 'a', label: 'a =', min: -4, max: 4, step: 0.5, value: -4}, {type: 'range', key: 'b', label: 'b =', min: -4, max: 4, step: 0.5, value: 4}],
  plot: {xmin: -4.6, xmax: 4.6, ymin: -2.6, ymax: 2.6, w: 560, h: 340, equal: true}, plotLabel: 'Lower semicircle on [−4, 0] and triangle on [0, 4]', legend: [['blue', 'counts +'], ['red', 'counts −']],
  readouts: [['g', 'geometry'], ['v', 'value'], ['t', 'total area']]
}, (lab, st, key) => {
  if (key === 'q' && st.q !== 'own') { const [a, b] = PRE[+st.q]; st.set('a', a, true); st.set('b', b, true); } else if (key === 'a' || key === 'b') st.set('q', 'own', true);
  const a = st.a, b = st.b, P = lab.plane(), lo = Math.min(a, b), hi = Math.max(a, b);
  if (hi > lo) CA.shade(P, g, lo, hi, {split: true, samples: 300, color: b >= a ? 'blue' : 'red', negColor: b >= a ? 'red' : 'blue'});
  P.curve(g, {color: 'text', width: 3, from: -4, to: 4, samples: 800}).vline(a, {color: 'orange', width: 1.6, dash: '4 4'}).vline(b, {color: 'purple', width: 1.6, dash: '4 4'}).render();
  const v = (b >= a ? 1 : -1) * I(g, lo, hi), tot = I(x => Math.abs(g(x)), lo, hi), k = PRE.findIndex(([p, q]) => p === a && q === b), nice = k >= 0 ? EXACT[k] + ' ≈ ' : '';
  lab.read('g', a === b ? 'zero width' : b < a ? 'limits reversed: the sign flips' : 'semicircle part counts −, triangle part counts +'); lab.read('v', `${nice}${num(v, 5)}`); lab.read('t', num(tot, 5));
  lab.out(a === -4 && b === 4 ? '∫ from −4 to 4 = −2π + 4: the semicircle (area 2π) is below the axis and the triangle (area 4) is above.' : b < a ? 'Reversing the limits changes the sign: ∫ from b to a = −∫ from a to b.' : 'The value is the blue area minus the red area.');
});

/* ---------- 03 · additivity ---------- */
const AD = [
  {t: 'f(x) = x² on [0, 3]', f: x => x * x, a: 0, b: 3, win: {xmin: -0.5, xmax: 3.5, ymin: -1, ymax: 10}},
  {t: 'f(x) = sin x on [0, 2π]', f: Math.sin, a: 0, b: 2 * PI, win: {xmin: -0.5, xmax: 6.8, ymin: -1.5, ymax: 1.5}},
  {t: 'f(x) = 3 − x on [0, 5]', f: x => 3 - x, a: 0, b: 5, win: {xmin: -0.5, xmax: 5.5, ymin: -2.5, ymax: 3.5}}
];
CA.lab('add-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: AD.map((s, i) => [String(i), s.t])}, {type: 'range', key: 'c', label: 'Split point c', min: 0, max: 1, step: 0.05, value: 0, fmt: v => num(v, 2)}],
  plot: {w: 540, h: 320}, plotLabel: 'An integral split at c', legend: [['orange', '∫ from a to c'], ['purple', '∫ from c to b']], readouts: [['l', '∫ a to c'], ['r', '∫ c to b'], ['s', 'sum'], ['t', '∫ a to b']]
}, (lab, st, key) => {
  const A = AD[+st.p];
  if (key === null || key === 'p') CA.setRange(st, 'c', {min: A.a, max: A.b, step: CA.niceStep(A.b - A.a), value: A.a + (A.b - A.a) * 0.4});  // c moves through [a, b] itself
  const c = st.c, P = lab.plane(Object.assign({equal: false}, A.win));
  if (c > A.a) CA.shade(P, A.f, A.a, c, {color: 'orange', fillOpacity: 0.3}); if (c < A.b) CA.shade(P, A.f, c, A.b, {color: 'purple', fillOpacity: 0.3});
  P.curve(A.f, {color: 'text', width: 2.8}).vline(c, {color: 'green', width: 2}).render();
  const l = I(A.f, A.a, c), r = I(A.f, c, A.b);
  lab.read('l', num(l, 5)); lab.read('r', num(r, 5)); lab.read('s', num(l + r, 5)); lab.read('t', num(I(A.f, A.a, A.b), 5));
  lab.out('Wherever you split, the two pieces add up to the whole integral.', 'ca-correct');
});
CA.stepLab('prop-steps', [
  {t: '∫ from 1 to 3 of (5f(x) − 3g(x)) dx', res: '44', steps: [['Linearity', '5∫<sub>1</sub><sup>3</sup> f dx − 3∫<sub>1</sub><sup>3</sup> g dx'], ['Substitute', '5(7) − 3(−3)'], ['Result', '35 + 9 = 44']]},
  {t: '∫ from 3 to 6 of (2f(x) + g(x)) dx', res: '23', steps: [['Additivity for f', '∫<sub>1</sub><sup>3</sup> f + ∫<sub>3</sub><sup>6</sup> f = ∫<sub>1</sub><sup>6</sup> f ⇒ 7 + ∫<sub>3</sub><sup>6</sup> f = 17 ⇒ ∫<sub>3</sub><sup>6</sup> f = 10'], ['Additivity for g', '−3 + ∫<sub>3</sub><sup>6</sup> g = 0 ⇒ ∫<sub>3</sub><sup>6</sup> g = 3'], ['Linearity', '2(10) + 3 = 23']]},
  {t: '∫ from 6 to 1 of f(x) dx', res: '−17', steps: [['Reverse the limits', '∫<sub>6</sub><sup>1</sup> f = −∫<sub>1</sub><sup>6</sup> f'], ['Result', '−17']]},
  {t: '∫ from 3 to 3 of (f(x) + 100) dx', res: '0', steps: [['Zero width', 'any integral from 3 to 3 is 0']]}
]);

/* ---------- 04 · average value ---------- */
const AV = [
  {t: 'f(x) = x² on [0, 4]', f: x => x * x, a: 0, b: 4, avT: '16/3', win: {xmin: -0.5, xmax: 4.5, ymin: -1, ymax: 17}},
  {t: 'f(x) = sin x on [0, π]', f: Math.sin, a: 0, b: PI, avT: '2/π', win: {xmin: -0.3, xmax: 3.5, ymin: -0.2, ymax: 1.3}},
  {t: 'f(x) = √x on [0, 9]', f: Math.sqrt, a: 0, b: 9, avT: '2', win: {xmin: -0.5, xmax: 9.5, ymin: -0.3, ymax: 3.5}},
  {t: 'f(x) = 1/x on [1, e]', f: x => 1 / x, a: 1, b: Math.E, avT: '1/(e − 1)', win: {xmin: 0.5, xmax: 3, ymin: -0.1, ymax: 1.2}}
];
CA.lab('avg-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: AV.map((s, i) => [String(i), s.t])}, {type: 'range', key: 'h', label: 'Try a height', min: 0, max: 100, step: 1, value: 50, fmt: () => ''}],
  plot: {w: 540, h: 340}, plotLabel: 'Region under f and a rectangle with the same width', legend: [['blue', 'region under f'], ['orange', 'rectangle of your height'], ['green', 'f_ave', true]], readouts: [['i', '∫ f dx'], ['r', 'rectangle area'], ['h', 'your height'], ['a', 'f_ave']]
}, (lab, st) => {
  const A = AV[+st.p], P = lab.plane(Object.assign({equal: false}, A.win)), tot = I(A.f, A.a, A.b), avg = tot / (A.b - A.a), h = A.win.ymax * 0.9 * st.h / 100;
  CA.shade(P, A.f, A.a, A.b, {color: 'blue', fillOpacity: 0.2}); P.poly([[A.a, 0], [A.b, 0], [A.b, h], [A.a, h]], {color: 'orange', fillOpacity: 0.18, width: 2});
  P.curve(A.f, {color: 'text', width: 2.8}).hline(avg, {color: 'green', dash: '7 6', width: 1.8}).render();
  const r = h * (A.b - A.a);
  lab.read('i', num(tot, 5)); lab.read('r', num(r, 5)); lab.read('h', num(h, 4)); lab.read('a', `${A.avT} ≈ ${num(avg, 5)}`);
  lab.out(Math.abs(h - avg) < A.win.ymax * 0.012 ? 'The rectangle and the region have the same area: your height is the average value.' : `Adjust the height until the rectangle area equals ${num(tot, 4)}.`, Math.abs(h - avg) < A.win.ymax * 0.012 ? 'ca-correct' : '');
});

/* ---------- guided problems ---------- */
CA.guided('52', [
  {q: '∫<sub>−2</sub><sup>3</sup> x dx = ?', opts: ['5/2', '13/2', '5', '−5/2'], correct: 0, hint: 'Triangle above (area 9/2) minus triangle below (area 2).', why: '9/2 − 2.', ref: {panel: 'definition', what: 'net signed area', body: '<p>Area above counts +, area below counts −.</p>'}},
  {q: '∫<sub>0</sub><sup>2π</sup> sin x dx = ?', opts: ['0', '2', '4', '−2'], correct: 0, hint: 'Equal areas above and below.', why: '2 − 2.'},
  {q: 'The total area between y = sin x and the x-axis on [0, 2π] is:', opts: ['4', '0', '2', '2π'], correct: 0, hint: 'Add both humps as positive.', why: '2 + 2.'},
  {q: '∫<sub>0</sub><sup>3</sup> √(9 − x²) dx = ?', opts: ['9π/4', '9π/2', '3π', '9'], correct: 0, hint: 'A quarter circle of radius 3.', why: '¼ · π · 9.', ref: {panel: 'geometry', what: 'integrals from geometry', body: '<p>Use areas of circles, triangles, and rectangles.</p>'}},
  {q: 'For the semicircle-and-triangle graph, ∫<sub>−4</sub><sup>4</sup> f(x) dx = ?', opts: ['4 − 2π', '4 + 2π', '4 − 4π', '2π − 4'], correct: 0, hint: 'Semicircle area 2π below the axis.', why: '−2π + 4.'},
  {q: 'If ∫<sub>1</sub><sup>3</sup> f = 7 and ∫<sub>1</sub><sup>6</sup> f = 17, then ∫<sub>3</sub><sup>6</sup> f = ?', opts: ['10', '24', '−10', '17/7'], correct: 0, hint: 'Additivity.', why: '17 − 7.', ref: {panel: 'properties', what: 'the properties', body: '<p>∫<sub>a</sub><sup>b</sup> = ∫<sub>a</sub><sup>c</sup> + ∫<sub>c</sub><sup>b</sup>; reversing the limits changes the sign.</p>'}},
  {q: 'With ∫<sub>1</sub><sup>3</sup> f = 7 and ∫<sub>1</sub><sup>3</sup> g = −3, ∫<sub>1</sub><sup>3</sup> (5f − 3g) = ?', opts: ['44', '26', '35', '−44'], correct: 0, hint: 'Linearity.', why: '35 + 9.'},
  {q: '∫<sub>5</sub><sup>2</sup> f(x) dx equals:', opts: ['−∫<sub>2</sub><sup>5</sup> f(x) dx', '∫<sub>2</sub><sup>5</sup> f(x) dx', '0', '3f(5)'], correct: 0, hint: 'Reversed limits.', why: 'The sign changes.'},
  {q: 'The average value of f(x) = 2x on [0, 3] is:', opts: ['3', '9', '6', '1'], correct: 0, hint: '(1/3)∫<sub>0</sub><sup>3</sup> 2x dx = (1/3)(9).', why: '9/3.', ref: {panel: 'average', what: 'the average value', body: '<p>f<sub>ave</sub> = (1/(b − a))∫<sub>a</sub><sup>b</sup> f(x) dx.</p>'}},
  {q: 'If 1 ≤ f(x) ≤ 4 on [0, 2], then ∫<sub>0</sub><sup>2</sup> f(x) dx is between:', opts: ['2 and 8', '1 and 4', '0 and 2', '4 and 16'], correct: 0, hint: 'm(b − a) ≤ ∫ ≤ M(b − a).', why: '1·2 and 4·2.'}
]);
})();
