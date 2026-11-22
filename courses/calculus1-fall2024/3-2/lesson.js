/* Section 3.2 · The Derivative as a Function — interactive activities */
(() => {
'use strict';
const {num} = CA;

/* ---------- 01 · trace the slope function ---------- */
CA.derivTraceLab('trace-lab', {presets: [
  {t: 'f(x) = x² − 3x', src: 'x^2 - 3x', f: x => x * x - 3 * x, df: x => 2 * x - 3, dT: '2x − 3', win: {xmin: -2, xmax: 5}},
  {t: 'f(x) = x³ − 3x', src: 'x^3 - 3x', f: x => x ** 3 - 3 * x, df: x => 3 * x * x - 3, dT: '3x² − 3', win: {xmin: -2.5, xmax: 2.5}},
  {t: 'f(x) = x³ (horizontal tangent, no turn)', src: 'x^3', f: x => x ** 3, df: x => 3 * x * x, dT: '3x²', win: {xmin: -2, xmax: 2}, note: (x, m) => Math.abs(x) < 0.05 ? 'At x = 0 the tangent is horizontal (f′(0) = 0), but f keeps increasing on both sides: a horizontal tangent does not force a change of direction.' : `f′(x) = 3x² ≥ 0 everywhere; here f′ ≈ ${num(m, 3)}.`},
  {t: 'f(x) = sin x', src: 'sin(x)', f: Math.sin, df: Math.cos, dT: 'cos x (Section 3.5)', win: {xmin: -6.5, xmax: 6.5}},
  {t: 'f(x) = eˣ', src: 'e^x', f: Math.exp, df: Math.exp, dT: 'eˣ (the same function!)', win: {xmin: -3, xmax: 2}},
  {t: 'f(x) = |x| (corner at 0)', src: 'abs(x)', f: Math.abs, df: x => Math.abs(x) < 1e-9 ? NaN : Math.sign(x), dT: '−1 for x < 0 and 1 for x > 0', win: {xmin: -3, xmax: 3}, br: [], dbr: [0], dwin: {ymin: -1.6, ymax: 1.6}}
]});

/* ---------- 02 · sketch f′ from f ---------- */
const p1 = x => 5 - 0.24 * (x - 4) ** 2, p2 = x => 5 - (x - 4) ** 2 / 3, p3 = x => 2 + 0.5 * (x - 7), p4 = x => 4 + 0.5 * (x - 11) + (x - 11) ** 2 / 18;
const F = x => x <= 4 ? p1(x) : x <= 7 ? p2(x) : x <= 11 ? p3(x) : p4(x);
const dF = x => x < 4 ? -0.48 * (x - 4) : x < 7 ? -(2 / 3) * (x - 4) : Math.abs(x - 7) < 1e-9 ? NaN : x <= 11 ? 0.5 : 0.5 + (x - 11) / 9;
CA.lab('sketch-lab', {
  controls: [{type: 'range', key: 'x', label: 'x =', min: -1, max: 17, step: 0.1, value: 2, fmt: v => num(v, 1)}, {type: 'check', key: 'show', label: 'Show f′ (all of it)', value: false}],
  plot: {xmin: -2, xmax: 18, ymin: -2, ymax: 10, w: 560, h: 300, equal: false}, plotLabel: 'Graph of f with its tangent line', legend: [['blue', 'y = f(x)'], ['green', 'tangent line'], ['purple', 'y = f′(x) (lower graph)']],
  bottom: '<svg id="sketch-svg2" role="img" aria-label="Graph of f prime"></svg>', readouts: [['m', 'slope f′(x)'], ['b', 'f is']]
}, (lab, st) => {
  const x = Math.abs(st.x - 7) < 0.05 ? 7 : st.x, y = F(x), m = dF(x), P = lab.plane();
  P.curve(F, {color: 'blue', width: 3.2, from: -1, to: 17, samples: 1200});
  [[-1, -1], [4, 5], [7, 2], [11, 4], [17, 9]].forEach(([a, b]) => P.point(a, b, {color: 'blue', r: 4.5, label: `(${a}, ${b})`, labelOpt: {size: 11, dy: b > 4 ? -10 : 18}}));
  if (Number.isFinite(m)) P.seg(x - 3, y - 3 * m, x + 3, y + 3 * m, {color: 'green', width: 2.4}); else P.seg(x - 1.5, y + 3, x, y, {color: 'green', width: 2, dash: '5 5'}).seg(x, y, x + 3, y + 1.5, {color: 'green', width: 2, dash: '5 5'});
  P.point(x, y, {color: 'orange', r: 7}).render();
  const svg2 = document.getElementById('sketch-svg2'); CA.placeBelow(lab.svg, svg2);
  const Q = new CA.Plane(svg2, {xmin: -2, xmax: 18, ymin: -2.6, ymax: 2.8, w: 560, h: 220, equal: false, yname: 'y′'});
  Q.hline(0, {color: 'gray', width: 1}).curve(dF, {color: 'purple', width: 3, from: -1, to: st.show ? 17 : x, breaks: [7], samples: 1500});
  if (st.show || x > 7) Q.point(7, -2, {color: 'purple', r: 5, filled: false}).point(7, 0.5, {color: 'purple', r: 5, filled: false});
  if (Number.isFinite(m)) Q.point(x, m, {color: 'orange', r: 7}); Q.render();
  lab.read('m', Number.isFinite(m) ? num(m, 3) : 'does not exist (corner)');
  lab.read('b', !Number.isFinite(m) ? 'at a corner' : Math.abs(m) < 0.02 ? 'momentarily flat' : m > 0 ? 'increasing' : 'decreasing');
  lab.out(x < 4 ? 'Rising, but less and less steeply: f′ is positive and decreasing toward 0.' : Math.abs(x - 4) < 0.06 ? 'The top of the hill: horizontal tangent, f′(4) = 0.' : x < 7 ? 'Falling, more and more steeply: f′ is negative.' : x === 7 ? 'At (7, 2) the slope jumps from −2 to 1/2. Left and right tangent lines differ, so f′(7) does not exist.' : x <= 11 ? 'A straight segment: f′ is the constant slope 1/2.' : 'Rising more and more steeply: f′ is positive and increasing.', x === 7 ? 'ca-incorrect' : '');
});

/* ---------- 03 · differentiability by zooming ---------- */
const DF = [
  {t: 'f(x) = |x| at 0 (corner)', f: Math.abs, a: 0, ok: false, why: 'left slope −1, right slope 1'},
  {t: 'f(x) = x^(2/3) at 0 (cusp)', f: x => Math.cbrt(x) ** 2, a: 0, ok: false, why: 'the slopes go to −∞ on the left and +∞ on the right'},
  {t: 'f(x) = ∛x at 0 (vertical tangent)', f: Math.cbrt, a: 0, ok: false, why: 'the slopes grow without bound: the tangent line is vertical'},
  {t: 'f(x) = x for x < 0, x + 1 for x ≥ 0 (jump)', f: x => x < 0 ? x : x + 1, a: 0, ok: false, why: 'f is not even continuous at 0', jump: true},
  {t: 'f(x) = x² at 1 (smooth)', f: x => x * x, a: 1, ok: true, why: 'the slopes on both sides approach 2'},
  {t: 'f(x) = sin x at 0 (smooth)', f: Math.sin, a: 0, ok: true, why: 'the slopes on both sides approach 1'}
];
CA.lab('diff-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function and point', value: '0', options: DF.map((d, i) => [String(i), d.t])}, {type: 'range', key: 'z', label: 'Zoom: half-width', min: 0, max: 4, step: 0.25, value: 0, fmt: z => num(10 ** -z, 5)}],
  plot: {w: 500, h: 400}, plotLabel: 'Zoomed view of a graph around a point', readouts: [['l', 'slope from the left'], ['r', 'slope from the right'], ['d', 'Differentiable?']]
}, (lab, st) => {
  const D = DF[+st.p], w = 2 * 10 ** -st.z, a = D.a, f = D.f, ya = f(a), P = lab.plane({xmin: a - w, xmax: a + w, ymin: ya - w, ymax: ya + w, equal: true});
  P.curve(f, {color: 'blue', width: 3.2, breaks: D.jump ? [0] : [], samples: 1500});
  if (D.jump) P.point(0, 0, {color: 'blue', r: 6, filled: false}).point(0, 1, {color: 'blue', r: 6});
  P.point(a, ya, {color: 'orange', r: 6}).render();
  const h = w / 10, sl = (f(a) - f(a - h)) / h, sr = (f(a + h) - f(a)) / h;
  lab.read('l', Math.abs(sl) > 1e5 ? 'huge' : num(sl, 4)); lab.read('r', Math.abs(sr) > 1e5 ? 'huge' : num(sr, 4)); lab.read('d', D.ok ? '<span class="ca-ok">yes</span>' : '<span class="ca-bad">no</span>');
  lab.out(D.ok ? `Zoom in: the graph straightens into a line of slope ${num((sl + sr) / 2, 3)} (local linearity). Here ${D.why}.` : `Zooming in does not straighten the graph: ${D.why}, so f′(${num(a)}) does not exist.`, D.ok ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 04 · higher derivatives ---------- */
const HD = [
  {t: 'f(x) = x⁴ − 3x²', fs: [x => x ** 4 - 3 * x * x, x => 4 * x ** 3 - 6 * x, x => 12 * x * x - 6, x => 24 * x, () => 24], ts: ['x⁴ − 3x²', '4x³ − 6x', '12x² − 6', '24x', '24'], win: {xmin: -2.2, xmax: 2.2, ymin: -12, ymax: 30}},
  {t: 'f(x) = sin x', fs: [Math.sin, Math.cos, x => -Math.sin(x), x => -Math.cos(x), Math.sin], ts: ['sin x', 'cos x', '−sin x', '−cos x', 'sin x'], win: {xmin: -6.5, xmax: 6.5, ymin: -1.6, ymax: 1.6}},
  {t: 'f(x) = eˣ', fs: [Math.exp, Math.exp, Math.exp, Math.exp, Math.exp], ts: ['eˣ', 'eˣ', 'eˣ', 'eˣ', 'eˣ'], win: {xmin: -3, xmax: 2, ymin: -0.5, ymax: 7}},
  {t: 's(t) = t³ − 6t² (position)', fs: [x => x ** 3 - 6 * x * x, x => 3 * x * x - 12 * x, x => 6 * x - 12, () => 6, () => 0], ts: ['t³ − 6t² (position)', '3t² − 12t (velocity)', '6t − 12 (acceleration)', '6 (jerk)', '0'], win: {xmin: -1, xmax: 6.5, ymin: -35, ymax: 40}}
];
const COLS = ['blue', 'purple', 'green', 'orange', 'red'], NAMES = ['f', 'f′', 'f″', 'f‴', 'f⁽⁴⁾'];
CA.lab('higher-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: HD.map((h, i) => [String(i), h.t])}, {type: 'range', key: 'n', label: 'Show derivatives up to order', min: 0, max: 4, step: 1, value: 2}],
  plot: {w: 560, h: 380}, plotLabel: 'A function and its higher derivatives', legend: NAMES.map((n, i) => [COLS[i], n]), readouts: NAMES.map((n, i) => ['d' + i, n])
}, (lab, st) => {
  const H = HD[+st.p], P = lab.plane(Object.assign({equal: false}, H.win));
  for (let k = 0; k <= st.n; k++) P.curve(H.fs[k], {color: COLS[k], width: k === st.n ? 3.4 : 2.2, dash: k === st.n ? false : '6 5'});
  P.render();
  NAMES.forEach((n, i) => lab.read('d' + i, i <= st.n ? H.ts[i] : '…'));
  lab.out(st.p === '1' ? 'The derivatives of sin x repeat every four steps: sin, cos, −sin, −cos, sin, …' : st.p === '2' ? 'Every derivative of eˣ is eˣ.' : st.p === '3' ? 'For motion: s′ is velocity, s″ is acceleration (and s‴ is called jerk).' : 'Each derivative of a polynomial lowers the degree by one; eventually the derivatives are 0.');
});

/* ---------- guided problems ---------- */
CA.guided('32', [
  {q: 'Using the definition, the derivative of f(x) = x² − 3x is:', opts: ['2x − 3', '2x', 'x − 3', '2x² − 3'], correct: 0, hint: '(2xh + h² − 3h)/h.', why: '2x + h − 3 → 2x − 3.', ref: {panel: 'function', what: 'the derivative function', body: '<p>f′(x) = lim<sub>h→0</sub> (f(x + h) − f(x))/h.</p>'}},
  {q: 'f(x) = x² − 3x has a horizontal tangent at x =', opts: ['3/2', '0', '3', '−3/2'], correct: 0, hint: 'Solve 2x − 3 = 0.', why: 'f′(3/2) = 0.'},
  {q: 'If f′(x) &lt; 0 for all x in (1, 4), then on (1, 4) f is:', opts: ['decreasing', 'increasing', 'constant', 'not continuous'], correct: 0, hint: 'Negative slopes.', why: 'Every tangent line slopes downward.'},
  {q: 'f′(a) = 0 means:', opts: ['the tangent line at a is horizontal', 'f changes direction at a', 'f(a) = 0', 'f is constant'], correct: 0, hint: 'Think of f(x) = x³ at 0.', why: 'A horizontal tangent does not force a change of direction.', ref: {panel: 'function', what: 'what f′(a) = 0 tells us', body: '<p>f(x) = x³ has f′(0) = 0 but increases on both sides of 0.</p>'}},
  {q: 'In the sketching activity, f′ on the segment from (7, 2) to (11, 4) equals:', opts: ['1/2', '2', '0', '4/7'], correct: 0, hint: 'Slope of a line segment.', why: '(4 − 2)/(11 − 7) = 1/2.', ref: {panel: 'sketch', what: 'the graph from the sketching activity', body: '<p>From (7, 2) to (11, 4) the graph of f is a straight line.</p>'}},
  {q: 'Why does f′(7) not exist for that graph?', opts: ['the graph has a corner at x = 7', 'f(7) is undefined', 'f is decreasing there', 'f′(7) = 0'], correct: 0, hint: 'Compare the slopes just left and right of 7.', why: 'Left slope −2, right slope 1/2.'},
  {q: 'Which function is continuous but not differentiable at 0?', opts: ['f(x) = |x|', 'f(x) = x²', 'f(x) = sin x', 'f(x) = eˣ'], correct: 0, hint: 'Look for a corner.', why: '|x| has a corner at 0.', ref: {panel: 'differentiable', what: 'corners, cusps, and vertical tangents', body: '<p>Differentiable ⇒ continuous, but not the other way around.</p>'}},
  {q: 'If f is differentiable at a, then f is:', opts: ['continuous at a', 'not continuous at a', 'increasing at a', 'zero at a'], correct: 0, hint: 'A theorem from this section.', why: 'Differentiability implies continuity.'},
  {q: 'For f(x) = x⁴ − 3x², f″(x) = ?', opts: ['12x² − 6', '4x³ − 6x', '24x', '12x² − 6x'], correct: 0, hint: 'Differentiate 4x³ − 6x.', why: 'd/dx (4x³ − 6x) = 12x² − 6.', ref: {panel: 'higher', what: 'higher derivatives', body: '<p>f″ is the derivative of f′.</p>'}},
  {q: 'If s(t) is position, then s″(t) is:', opts: ['acceleration', 'velocity', 'speed', 'distance'], correct: 0, hint: 'The derivative of velocity.', why: 'v = s′ and a = v′ = s″.'}
]);
})();
