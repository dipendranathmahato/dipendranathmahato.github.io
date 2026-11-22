/* Section 5.4 · Integration Formulas and the Net Change Theorem — interactive activities */
(() => {
'use strict';
const {num} = CA;
const I = (f, a, b) => CA.integrate(f, a, b, 3000);

/* ---------- 01 · formulas ---------- */
CA.cards('formula-cards', [
  {expr: '∫ x⁵ dx', options: ['x⁶/6 + C', '5x⁴ + C', 'x⁶ + C', '6x⁶ + C'], correct: 0, why: 'raise the power, divide by the new power.'},
  {expr: '∫ (1/x) dx', options: ['ln|x| + C', 'x⁰/0 + C', '−1/x² + C', 'eˣ + C'], correct: 0, why: 'the exception n = −1.'},
  {expr: '∫ sin x dx', options: ['−cos x + C', 'cos x + C', '−sin x + C', 'sec x + C'], correct: 0, why: '(−cos x)′ = sin x.'},
  {expr: '∫ csc²x dx', options: ['−cot x + C', 'cot x + C', 'tan x + C', '−csc x + C'], correct: 0, why: '(cot x)′ = −csc²x.'},
  {expr: '∫ sec x tan x dx', options: ['sec x + C', 'tan x + C', 'sec²x + C', '−csc x + C'], correct: 0, why: '(sec x)′ = sec x tan x.'},
  {expr: '∫ dx/(1 + x²)', options: ['tan⁻¹x + C', 'ln(1 + x²) + C', 'sin⁻¹x + C', '1/(x + x³/3) + C'], correct: 0, why: '(tan⁻¹x)′ = 1/(1 + x²).'}
]);

/* ---------- 02 · net change ---------- */
const NV = [
  {t: 'v(t) = (t − 1)²(t − 2) on [0, 3]', v: t => (t - 1) ** 2 * (t - 2), a: 0, b: 3, netT: '3/4', distT: '25/12'},
  {t: 'v(t) = −t/5 + 20 on [0, 100] (car)', v: t => -t / 5 + 20, a: 0, b: 100, netT: '1000', distT: '1000'},
  {t: 'v(t) = t² − 4t + 3 on [0, 4]', v: t => t * t - 4 * t + 3, a: 0, b: 4, netT: '4/3', distT: '4'},
  {t: 'v(t) = 3 sin t on [0, 3π/2]', v: t => 3 * Math.sin(t), a: 0, b: 1.5 * Math.PI, netT: '3', distT: '9'},
  {t: 'v(t) = e^(−t) − 0.2 on [0, 5]', v: t => Math.exp(-t) - 0.2, a: 0, b: 5, netT: '−e<sup>−5</sup>', distT: null}
];
CA.lab('net-lab', {
  controls: [{type: 'select', key: 'p', label: 'Velocity', value: '0', options: NV.map((s, i) => [String(i), s.t])}, {type: 'range', key: 'u', label: 'Up to time t', min: 0, max: 100, step: 1, value: 100, fmt: v => v + '%'}],
  plot: {w: 560, h: 260}, plotLabel: 'Velocity; blue moves forward, red moves backward', legend: [['blue', 'forward (v > 0)'], ['red', 'backward (v < 0)'], ['purple', 'position s(t) − s(a) (lower graph)']],
  bottom: '<svg id="net-svg2" role="img" aria-label="Position graph"></svg>', readouts: [['t', 't'], ['n', 'net displacement ∫v dt'], ['d', 'distance ∫|v| dt']]
}, (lab, st) => {
  const N = NV[+st.p], T = N.a + (N.b - N.a) * st.u / 100, Y = CA.fitY(N.v, N.a, N.b), w = (N.b - N.a) * 0.04, P = lab.plane({xmin: N.a - w, xmax: N.b + w, ymin: Y.ymin, ymax: Y.ymax, equal: false, xname: 't', yname: 'v'});
  if (T > N.a) CA.shade(P, N.v, N.a, T, {split: true, samples: 300});
  P.curve(N.v, {color: 'text', width: 2.8, from: N.a, to: N.b}).vline(T, {color: 'orange', width: 1.8}).render();
  const S = t => I(N.v, N.a, t), svg2 = document.getElementById('net-svg2'); CA.placeBelow(lab.svg, svg2);
  const YS = CA.fitY(S, N.a, N.b), Q = new CA.Plane(svg2, {xmin: N.a - w, xmax: N.b + w, ymin: YS.ymin, ymax: YS.ymax, w: 560, h: 200, equal: false, xname: 't', yname: 's'});
  Q.curve(S, {color: 'purple', width: 3, from: N.a, to: N.b, samples: 300}).point(T, S(T), {color: 'orange', r: 7}).render();
  const net = S(T), dist = I(t => Math.abs(N.v(t)), N.a, T), full = st.u === 100;
  lab.read('t', num(T, 4)); lab.read('n', (full ? N.netT + ' ≈ ' : '') + num(net, 5)); lab.read('d', (full && N.distT ? N.distT + ' ≈ ' : '') + num(dist, 5));
  lab.out(Math.abs(net - dist) < 1e-6 ? 'The object never moved backward, so displacement and distance are equal.' : 'Backward motion (red) subtracts from the displacement but adds to the distance traveled.');
});
CA.stepLab('net-steps', [
  {t: '∫ from 0 to 8 of e^(−x) dx', res: '1 − e<sup>−8</sup>', steps: [['Antiderivative', 'd/dx(−e<sup>−x</sup>) = e<sup>−x</sup>, so F(x) = −e<sup>−x</sup>'], ['Evaluate', '(−e<sup>−8</sup>) − (−e⁰)'], ['Result', '1 − e<sup>−8</sup> ≈ 0.99966']]},
  {t: 'Net displacement, v(t) = (t − 1)²(t − 2) on [0, 3]', res: '3/4', steps: [['Expand', '(t² − 2t + 1)(t − 2) = t³ − 4t² + 5t − 2'], ['Antiderivative', 't⁴/4 − 4t³/3 + 5t²/2 − 2t'], ['Evaluate at 3 and 0', '81/4 − 36 + 45/2 − 6 − 0'], ['Result', '3/4']]},
  {t: 'Total distance, same v(t)', res: '25/12', steps: [['Where is v negative?', 'v(t) = 0 at t = 1, 2; v &lt; 0 on (0, 1) and (1, 2), v &gt; 0 on (2, 3)'], ['Split', '−∫<sub>0</sub><sup>2</sup> v dt + ∫<sub>2</sub><sup>3</sup> v dt'], ['Evaluate', '−(−2/3) + 17/12'], ['Result', '2/3 + 17/12 = 25/12']]},
  {t: 'Decelerating car: ∫ from 0 to 100 of (−t/5 + 20) dt', res: '1000 m', steps: [['Antiderivative', '−t²/10 + 20t'], ['Evaluate', '(−1000 + 2000) − 0'], ['Result', '1000 m']]}
]);

/* ---------- 03 · symmetry ---------- */
const SY = [
  {t: 'f(x) = x² (even)', f: x => x * x, k: 'even'}, {t: 'f(x) = x³ (odd)', f: x => x ** 3, k: 'odd'},
  {t: 'f(x) = x³ + 3x² (neither)', f: x => x ** 3 + 3 * x * x, k: 'neither'}, {t: 'f(x) = cos x (even)', f: Math.cos, k: 'even'},
  {t: 'f(x) = x cos x (odd)', f: x => x * Math.cos(x), k: 'odd'}, {t: 'f(x) = x⁴ − 2x² (even)', f: x => x ** 4 - 2 * x * x, k: 'even'}
];
CA.lab('sym-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '1', options: SY.map((s, i) => [String(i), s.t])}, {type: 'range', key: 'a', label: 'a =', min: 0.5, max: 3, step: 0.1, value: 2, fmt: v => num(v, 1)}],
  plot: {w: 540, h: 340}, plotLabel: 'Integral over a symmetric interval', legend: [['blue', 'counts +'], ['red', 'counts −']], readouts: [['L', '∫ from −a to 0'], ['R', '∫ from 0 to a'], ['T', '∫ from −a to a']]
}, (lab, st) => {
  const S = SY[+st.p], a = st.a, Y = CA.fitY(S.f, -3.2, 3.2, {clip: 40}), P = lab.plane({xmin: -3.2, xmax: 3.2, ymin: Y.ymin, ymax: Y.ymax, equal: false});
  CA.shade(P, S.f, -a, a, {split: true, samples: 300}); P.curve(S.f, {color: 'text', width: 2.8}).render();
  const l = I(S.f, -a, 0), r = I(S.f, 0, a);
  lab.read('L', num(l, 5)); lab.read('R', num(r, 5)); lab.read('T', num(l + r, 5));
  lab.out(S.k === 'even' ? 'Even: the two halves are equal, so the total is twice the right half.' : S.k === 'odd' ? 'Odd: the two halves cancel, so the total is 0.' : 'Neither: split it into an odd part (x³, integral 0) and an even part (3x², twice the right half).', S.k === 'neither' ? '' : 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('54', [
  {q: '∫ (4x³ − 6x + 2) dx = ?', opts: ['x⁴ − 3x² + 2x + C', '12x² − 6 + C', 'x⁴ − 6x² + 2x + C', '4x⁴ − 3x² + C'], correct: 0, hint: 'Term by term.', why: '4(x⁴/4) − 6(x²/2) + 2x.', ref: {panel: 'formulas', what: 'the basic formulas', body: '<p>∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C, n ≠ −1.</p>'}},
  {q: '∫<sub>0</sub><sup>8</sup> e<sup>−x</sup> dx = ?', opts: ['1 − e<sup>−8</sup>', 'e<sup>−8</sup> − 1', 'e<sup>−8</sup>', '1'], correct: 0, hint: 'Antiderivative −e<sup>−x</sup>.', why: '−e<sup>−8</sup> + 1.'},
  {q: '∫<sub>0</sub><sup>π/4</sup> sec²x dx = ?', opts: ['1', '√2', '0', 'π/4'], correct: 0, hint: 'tan x.', why: 'tan(π/4) − tan 0.'},
  {q: 'A car with v(t) = −t/5 + 20 m/s travels how far from t = 0 to t = 100?', opts: ['1000 m', '2000 m', '20 m', '500 m'], correct: 0, hint: '[−t²/10 + 20t]<sub>0</sub><sup>100</sup>.', why: '−1000 + 2000.', ref: {panel: 'net', what: 'the net change theorem', body: '<p>∫<sub>a</sub><sup>b</sup> v(t) dt = s(b) − s(a).</p>'}},
  {q: 'For v(t) = (t − 1)²(t − 2) on [0, 3], the net displacement is:', opts: ['3/4', '25/12', '0', '−2/3'], correct: 0, hint: '∫ (t³ − 4t² + 5t − 2) dt.', why: '81/4 − 36 + 45/2 − 6.'},
  {q: 'For the same v, the total distance is:', opts: ['25/12', '3/4', '17/12', '2/3'], correct: 0, hint: '−∫<sub>0</sub><sup>2</sup> v + ∫<sub>2</sub><sup>3</sup> v.', why: '2/3 + 17/12.'},
  {q: 'Total distance traveled equals:', opts: ['∫ |v(t)| dt', '∫ v(t) dt', '|∫ v(t) dt|', 'v(b) − v(a)'], correct: 0, hint: 'Backward motion still covers distance.', why: 'Integrate the speed.'},
  {q: '∫<sub>−3</sub><sup>3</sup> x⁵ dx = ?', opts: ['0', '243', '486', '81'], correct: 0, hint: 'x⁵ is odd.', why: 'The halves cancel.', ref: {panel: 'symmetry', what: 'even and odd functions', body: '<p>Odd: ∫<sub>−a</sub><sup>a</sup> f = 0. Even: ∫<sub>−a</sub><sup>a</sup> f = 2∫<sub>0</sub><sup>a</sup> f.</p>'}},
  {q: '∫<sub>−2</sub><sup>2</sup> (x³ + 3x²) dx = ?', opts: ['16', '0', '8', '32'], correct: 0, hint: 'Odd part 0, even part doubled.', why: '2∫<sub>0</sub><sup>2</sup> 3x² dx = 16.'},
  {q: 'If water flows into a tank at r(t) liters per minute, ∫<sub>0</sub><sup>10</sup> r(t) dt is:', opts: ['the change in volume over 10 minutes', 'the rate at t = 10', 'the volume at t = 0', 'the average rate'], correct: 0, hint: 'Integrate a rate.', why: 'Net change.'}
]);
})();
