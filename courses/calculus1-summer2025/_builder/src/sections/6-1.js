/* Section 6.1 · Areas between Curves — interactive activities */
(() => {
'use strict';
const {num} = CA, PI = Math.PI;
const absI = (f, g, a, b) => CA.integrate(x => Math.abs(f(x) - g(x)), a, b, 6000);

/* ---------- 01 · vertical slices ---------- */
const BT = [
  {t: 'y = x + 4 and y = x² − 2x (enclosed)', f: x => x + 4, g: x => x * x - 2 * x, fT: 'x + 4', gT: 'x² − 2x', a: -1, b: 4, exT: '125/6', win: {xmin: -2, xmax: 5, ymin: -2, ymax: 9.5}},
  {t: 'y = cos x and y = sin x on [0, π]', f: Math.cos, g: Math.sin, fT: 'cos x', gT: 'sin x', a: 0, b: PI, exT: '2√2', win: {xmin: -0.3, xmax: 3.5, ymin: -1.3, ymax: 1.4}},
  {t: 'y = √x and y = x² (enclosed)', f: Math.sqrt, g: x => x * x, fT: '√x', gT: 'x²', a: 0, b: 1, exT: '1/3', win: {xmin: -0.2, xmax: 1.4, ymin: -0.2, ymax: 1.4}},
  {t: 'y = eˣ and y = x on [0, 1]', f: Math.exp, g: x => x, fT: 'eˣ', gT: 'x', a: 0, b: 1, exT: 'e − 3/2', win: {xmin: -0.5, xmax: 1.5, ymin: -0.5, ymax: 3}},
  {t: 'y = x³ and y = x (enclosed, two pieces)', f: x => x ** 3, g: x => x, fT: 'x³', gT: 'x', a: -1, b: 1, exT: '1/2', win: {xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5}}
];
CA.lab('between-lab', {
  controls: [{type: 'select', key: 'p', label: 'Curves', value: '0', options: BT.map((r, i) => [String(i), r.t])}, {type: 'range', key: 'u', label: 'Rectangle at x', min: 0, max: 100, step: 1, value: 40, fmt: () => ''}, {type: 'range', key: 'n', label: 'Show n rectangles (0 = region)', min: 0, max: 40, step: 1, value: 0}],
  plot: {w: 560, h: 380}, plotLabel: 'Region between two curves', legend: [['blue', 'first curve on top'], ['purple', 'second curve on top']], readouts: [['top', 'upper curve at x'], ['h', 'height upper − lower'], ['A', 'area'], ['R', 'Riemann sum (n rectangles)']]
}, (lab, st) => {
  const B = BT[+st.p], P = lab.plane(Object.assign({equal: false}, B.win)), x = B.a + (B.b - B.a) * st.u / 100, d = t => B.f(t) - B.g(t);
  if (st.n === 0) {
    CA.shade(P, B.f, B.a, B.b, {g: t => Math.min(B.f(t), B.g(t)), color: 'blue', fillOpacity: 0.25, samples: 300});
    CA.shade(P, B.g, B.a, B.b, {g: t => Math.min(B.f(t), B.g(t)), color: 'purple', fillOpacity: 0.25, samples: 300});
  } else { const dx = (B.b - B.a) / st.n; for (let i = 0; i < st.n; i++) { const m = B.a + (i + 0.5) * dx, hi = Math.max(B.f(m), B.g(m)), lo = Math.min(B.f(m), B.g(m)); P.poly([[m - dx / 2, lo], [m + dx / 2, lo], [m + dx / 2, hi], [m - dx / 2, hi]], {color: d(m) >= 0 ? 'blue' : 'purple', fillOpacity: 0.25, width: 1.2}); } }
  P.curve(B.f, {color: 'blue', width: 3}).curve(B.g, {color: 'purple', width: 3});
  const hi = Math.max(B.f(x), B.g(x)), lo = Math.min(B.f(x), B.g(x)), w = (B.b - B.a) / 40;
  P.poly([[x - w / 2, lo], [x + w / 2, lo], [x + w / 2, hi], [x - w / 2, hi]], {color: 'orange', fillOpacity: 0.55, width: 1.8}).render();
  const A = absI(B.f, B.g, B.a, B.b), R = st.n ? Array.from({length: st.n}, (_, i) => Math.abs(d(B.a + (i + 0.5) * (B.b - B.a) / st.n)) * (B.b - B.a) / st.n).reduce((p, q) => p + q, 0) : null;
  lab.read('top', d(x) >= 0 ? `y = ${B.fT}` : `y = ${B.gT}`); lab.read('h', num(Math.abs(d(x)), 4)); lab.read('A', `${B.exT} ≈ ${num(A, 6)}`); lab.read('R', R === null ? '—' : num(R, 6));
  lab.out(+st.p === 1 || +st.p === 4 ? 'The curves cross inside the interval: the upper curve changes, so split the integral at the crossing (or integrate |f − g|).' : `Height of each slice: (${B.fT}) − (${B.gT}). Adding the slices and letting n → ∞ gives the area.`);
});

/* ---------- 02 · crossings ---------- */
CA.stepLab('cross-steps', [
  {t: 'Area between y = cos x and y = sin x on [0, π]', res: '2√2', steps: [['Where do they cross?', 'cos x = sin x at x = π/4'], ['Which is on top?', 'cos x on [0, π/4]; sin x on [π/4, π]'], ['Split', '∫<sub>0</sub><sup>π/4</sup> (cos x − sin x) dx + ∫<sub>π/4</sub><sup>π</sup> (sin x − cos x) dx'], ['First piece', '[sin x + cos x]<sub>0</sub><sup>π/4</sup> = (√2/2 + √2/2) − (0 + 1) = √2 − 1'], ['Second piece', '[−cos x − sin x]<sub>π/4</sub><sup>π</sup> = (1 − 0) − (−√2/2 − √2/2) = 1 + √2'], ['Add', '(√2 − 1) + (1 + √2) = 2√2']]},
  {t: 'Area enclosed by y = x + 4 and y = x² − 2x', res: '125/6', steps: [['Intersections', 'x + 4 = x² − 2x ⇒ (x + 1)(x − 4) = 0 ⇒ x = −1, 4'], ['Which is on top?', 'at x = 0: line 4, parabola 0, so the line'], ['Set up', '∫<sub>−1</sub><sup>4</sup> [(x + 4) − (x² − 2x)] dx = ∫<sub>−1</sub><sup>4</sup> (−x² + 3x + 4) dx'], ['Evaluate', '[−x³/3 + 3x²/2 + 4x]<sub>−1</sub><sup>4</sup> = 56/3 − (−13/6)'], ['Result', '125/6']]},
  {t: 'Area enclosed by y = x³ and y = x', res: '1/2', steps: [['Intersections', 'x³ = x ⇒ x = −1, 0, 1'], ['On [−1, 0]', 'x³ ≥ x: ∫<sub>−1</sub><sup>0</sup> (x³ − x) dx = 1/4'], ['On [0, 1]', 'x ≥ x³: ∫<sub>0</sub><sup>1</sup> (x − x³) dx = 1/4'], ['Add', '1/4 + 1/4 = 1/2 (while ∫<sub>−1</sub><sup>1</sup> (x³ − x) dx = 0!)']]}
]);

/* ---------- 03 · slicing in y ---------- */
const L = y => y + 1, Pb = y => y * y / 2 - 3;
CA.lab('dy-lab', {
  controls: [{type: 'seg', key: 'm', label: 'Slice', value: 'y', options: [['y', 'horizontally (dy)'], ['x', 'vertically (dx)']]}, {type: 'range', key: 'n', label: 'Rectangles', min: 2, max: 40, step: 1, value: 12}],
  plot: {xmin: -4, xmax: 6, ymin: -3, ymax: 5, w: 560, h: 420, equal: true}, plotLabel: 'Region enclosed by x = y²/2 − 3 and y = x − 1', legend: [['blue', 'x = y²/2 − 3'], ['red', 'y = x − 1']], readouts: [['set', 'integral(s)'], ['A', 'area'], ['S', 'rectangle sum']], steps: true
}, (lab, st) => {
  const P = lab.plane(), n = st.n; let S = 0;
  P.param(Pb, t => t, -3, 4.6, {color: 'blue', width: 3}).lineMB(1, -1, {color: 'red', width: 3});
  if (st.m === 'y') { const dy = 6 / n; for (let i = 0; i < n; i++) { const y = -2 + (i + 0.5) * dy, l = Pb(y), r = L(y); S += (r - l) * dy; P.poly([[l, y - dy / 2], [r, y - dy / 2], [r, y + dy / 2], [l, y + dy / 2]], {color: 'green', fillOpacity: 0.28, width: 1}); } }
  else { const dx = 8 / n; for (let i = 0; i < n; i++) { const x = -3 + (i + 0.5) * dx, top = Math.sqrt(2 * x + 6), bot = x < -1 ? -Math.sqrt(2 * x + 6) : x - 1; S += (top - bot) * dx; P.poly([[x - dx / 2, bot], [x + dx / 2, bot], [x + dx / 2, top], [x - dx / 2, top]], {color: x < -1 ? 'orange' : 'purple', fillOpacity: 0.28, width: 1}); } }
  P.point(5, 4, {color: 'text', r: 5, label: '(5, 4)'}).point(-1, -2, {color: 'text', r: 5, label: '(−1, −2)', labelOpt: {anchor: 'end', dx: -10, dy: 16}}).render();
  lab.read('set', st.m === 'y' ? '∫<sub>−2</sub><sup>4</sup> [(y + 1) − (y²/2 − 3)] dy' : '∫<sub>−3</sub><sup>−1</sup> 2√(2x + 6) dx + ∫<sub>−1</sub><sup>5</sup> [√(2x + 6) − (x − 1)] dx'); lab.read('A', '18'); lab.read('S', num(S, 5));
  lab.steps(st.m === 'y' ? [['Right and left', 'right: x = y + 1; left: x = y²/2 − 3'], ['Integrate', '∫<sub>−2</sub><sup>4</sup> (−y²/2 + y + 4) dy = [−y³/6 + y²/2 + 4y]<sub>−2</sub><sup>4</sup>'], ['Result', '40/3 − (−14/3) = 18']] :
    [['Solve the parabola for y', 'y = ±√(2x + 6)'], ['Left part, −3 ≤ x ≤ −1', 'top √(2x + 6), bottom −√(2x + 6): ∫<sub>−3</sub><sup>−1</sup> 2√(2x + 6) dx = 16/3'], ['Right part, −1 ≤ x ≤ 5', 'top √(2x + 6), bottom x − 1: ∫<sub>−1</sub><sup>5</sup> √(2x + 6) dx − ∫<sub>−1</sub><sup>5</sup> (x − 1) dx = 56/3 − 6'], ['Result', '16/3 + 56/3 − 6 = 24 − 6 = 18']]);
  lab.out(st.m === 'y' ? 'Every horizontal slice runs from the parabola (left) to the line (right): one integral.' : 'Vertical slices have a different bottom curve left and right of x = −1 (orange versus purple): two integrals.', 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('61', [
  {q: 'The area between y = f(x) (upper) and y = g(x) (lower) on [a, b] is:', opts: ['∫<sub>a</sub><sup>b</sup> [f(x) − g(x)] dx', '∫<sub>a</sub><sup>b</sup> [g(x) − f(x)] dx', '∫<sub>a</sub><sup>b</sup> f(x)g(x) dx', '[f(b) − g(b)] − [f(a) − g(a)]'], correct: 0, hint: 'Upper minus lower.', why: 'Heights of vertical slices.', ref: {panel: 'dx', what: 'slicing vertically', body: '<p>A = ∫<sub>a</sub><sup>b</sup> [f(x) − g(x)] dx with f ≥ g.</p>'}},
  {q: 'y = x + 4 and y = x² − 2x intersect at x =', opts: ['−1 and 4', '1 and −4', '0 and 3', '−4 and 1'], correct: 0, hint: 'x² − 3x − 4 = 0.', why: '(x + 1)(x − 4) = 0.'},
  {q: 'The area enclosed by y = x + 4 and y = x² − 2x is:', opts: ['125/6', '56/3', '25/6', '45/2'], correct: 0, hint: '∫<sub>−1</sub><sup>4</sup> (−x² + 3x + 4) dx.', why: '56/3 + 13/6.'},
  {q: 'The area enclosed by y = √x and y = x² is:', opts: ['1/3', '2/3', '1', '1/6'], correct: 0, hint: '∫<sub>0</sub><sup>1</sup> (√x − x²) dx.', why: '2/3 − 1/3.'},
  {q: 'Where do y = cos x and y = sin x cross in [0, π]?', opts: ['x = π/4', 'x = π/2', 'x = 3π/4', 'x = π/6'], correct: 0, hint: 'tan x = 1.', why: 'cos(π/4) = sin(π/4).', ref: {panel: 'crossing', what: 'curves that cross', body: '<p>Split at each crossing; use upper − lower on each piece.</p>'}},
  {q: 'The area between y = cos x and y = sin x on [0, π] is:', opts: ['2√2', '0', '2', '√2'], correct: 0, hint: '(√2 − 1) + (1 + √2).', why: 'Split at π/4.'},
  {q: '∫<sub>−1</sub><sup>1</sup> (x³ − x) dx = 0, but the area enclosed by y = x³ and y = x is:', opts: ['1/2', '0', '1/4', '1'], correct: 0, hint: 'Add the two pieces as positive.', why: '1/4 + 1/4.'},
  {q: 'For a region bounded by x = f(y) on the right and x = g(y) on the left, A =', opts: ['∫<sub>c</sub><sup>d</sup> [f(y) − g(y)] dy', '∫<sub>c</sub><sup>d</sup> [g(y) − f(y)] dy', '∫<sub>a</sub><sup>b</sup> [f(x) − g(x)] dx', '∫<sub>c</sub><sup>d</sup> f(y)g(y) dy'], correct: 0, hint: 'Right minus left.', why: 'Widths of horizontal slices.', ref: {panel: 'dy', what: 'slicing horizontally', body: '<p>A = ∫<sub>c</sub><sup>d</sup> [right − left] dy.</p>'}},
  {q: 'x = y²/2 − 3 and y = x − 1 meet at:', opts: ['(5, 4) and (−1, −2)', '(4, 5) and (−2, −1)', '(3, 2) and (0, −1)', '(5, 4) only'], correct: 0, hint: 'y²/2 − 3 = y + 1.', why: '(y − 4)(y + 2) = 0.'},
  {q: 'The area enclosed by x = y²/2 − 3 and y = x − 1 is:', opts: ['18', '12', '24', '9'], correct: 0, hint: '∫<sub>−2</sub><sup>4</sup> (−y²/2 + y + 4) dy.', why: '40/3 + 14/3.'}
]);
})();
