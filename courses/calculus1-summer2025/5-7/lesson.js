/* Section 5.7 · Integrals Resulting in Inverse Trigonometric Functions — interactive activities */
(() => {
'use strict';
const {num} = CA, PI = Math.PI;
const deg = r => num(r * 180 / PI, 3) + '°';

/* ---------- 01 · area is an angle ---------- */
const AR = [
  {t: '∫ from 0 to x of dt/√(a² − t²) = sin⁻¹(x/a)', f: a => t => 1 / Math.sqrt(a * a - t * t), F: a => x => Math.asin(x / a), lo: a => -a * 0.995, hi: a => a * 0.995, x0: a => a / 2, s: 0, nm: 'sin⁻¹(x/a)', lim: 'π/2 as x → a'},
  {t: '∫ from 0 to x of dt/(a² + t²) = (1/a) tan⁻¹(x/a)', f: a => t => 1 / (a * a + t * t), F: a => x => Math.atan(x / a) / a, lo: a => -8, hi: a => 8, x0: a => a, s: 0, nm: '(1/a) tan⁻¹(x/a)', lim: 'π/(2a) as x → ∞'},
  {t: '∫ from a to x of dt/(t√(t² − a²)) = (1/a) sec⁻¹(x/a)', f: a => t => 1 / (t * Math.sqrt(t * t - a * a)), F: a => x => Math.acos(a / x) / a, lo: a => a * 1.001, hi: a => 8, x0: a => 2 * a, s: 'a', nm: '(1/a) sec⁻¹(x/a)', lim: 'π/(2a) as x → ∞'}
];
CA.lab('area-lab', {
  controls: [{type: 'select', key: 'p', label: 'Formula', value: '0', options: AR.map((r, i) => [String(i), r.t])}, {type: 'range', key: 'a', label: 'a =', min: 1, max: 3, step: 0.5, value: 1, fmt: v => num(v, 1)}, {type: 'range', key: 'u', label: 'x', min: 0, max: 1000, step: 1, value: 500, fmt: () => ''}],
  plot: {w: 560, h: 340}, plotLabel: 'Integrand with the area from the start to x', legend: [['blue', 'integrand'], ['green', 'accumulated area']], readouts: [['x', 'x'], ['A', 'area'], ['F', 'formula value'], ['L', 'limit of the area']]
}, (lab, st, key) => {
  const R = AR[+st.p], a = st.a, f = R.f(a), F = R.F(a), lo = R.lo(a), hi = R.hi(a);
  if (key === 'p' || key === 'a' || key == null) st.set('u', Math.round((R.x0(a) - lo) / (hi - lo) * 1000), true);
  const x = lo + (hi - lo) * st.u / 1000, s = R.s === 'a' ? a : 0, top = R.s === 'a' ? 2 / a : Math.max(f(0), 1 / a) * (+st.p === 0 ? 4 : 1.3);
  const P = lab.plane({xmin: R.s === 'a' ? 0 : lo - 0.2 * a, xmax: hi + 0.2, ymin: -0.08 * top, ymax: top, equal: false, xname: 't'});
  if (Math.abs(x - s) > 1e-9) CA.shade(P, t => Math.min(f(t), top * 3), Math.min(s, x), Math.max(s, x), {color: x > s ? 'green' : 'red', fillOpacity: 0.3, samples: 400});
  P.curve(f, {color: 'blue', width: 3, from: lo, to: hi, samples: 1500}).vline(x, {color: 'orange', width: 1.6}).render();
  const A = R.s === 'a' ? CA.integrate(q => 2 / ((a + q * q) * Math.sqrt(2 * a + q * q)), 0, Math.sqrt(x - a), 4000) : (x >= s ? 1 : -1) * CA.integrate(f, Math.min(s, x), Math.max(s, x), 6000), v = F(x);
  lab.read('x', num(x, 4)); lab.read('A', num(A, 5)); lab.read('F', `${R.nm} = ${num(v, 5)}${+st.p === 0 ? ` (an angle of ${deg(v)})` : ''}`); lab.read('L', R.lim);
  lab.out(`The area matches the formula. ${+st.p === 0 ? 'The area under 1/√(a² − t²) from 0 to x is an angle: sin⁻¹(x/a).' : 'Even though the region is infinitely long, its area stays below π/(2a).'}`, 'ca-correct');
});

/* ---------- 02 · examples ---------- */
CA.stepLab('inv-steps', [
  {t: '∫ from 0 to 1/2 of dx/√(1 − x²)', res: 'π/6', steps: [['Match formula 1', 'a = 1, u = x'], ['Antiderivative', 'sin⁻¹x'], ['Evaluate', 'sin⁻¹(1/2) − sin⁻¹(0) = π/6 − 0']]},
  {t: '∫ dx/√(4 − 9x²)', res: '(1/3) sin⁻¹(3x/2) + C', check: ['arcsin(3x/2)/3', '1/sqrt(4 - 9x^2)', 0.3], steps: [['Identify', 'a² = 4 so a = 2; u² = 9x² so u = 3x'], ['Substitute', 'du = 3 dx: (1/3)∫ du/√(4 − u²)'], ['Formula 1', '(1/3) sin⁻¹(u/2) + C'], ['Back to x', '(1/3) sin⁻¹(3x/2) + C']]},
  {t: '∫ from −1 to 1/√3 of dx/(1 + x²)', res: '5π/12', steps: [['Match formula 2', 'a = 1: antiderivative tan⁻¹x'], ['Evaluate', 'tan⁻¹(1/√3) − tan⁻¹(−1)'], ['Exact values', 'π/6 − (−π/4) = 2π/12 + 3π/12'], ['Result', '5π/12']]},
  {t: '∫ 8 dx/(16 + 9x²) (factor first)', res: '(2/3) tan⁻¹(3x/4) + C', check: ['(2/3)arctan(3x/4)', '8/(16 + 9x^2)', 0.7], steps: [['Factor 9 from the denominator', '(8/9)∫ dx/(16/9 + x²) = (8/9)∫ dx/((4/3)² + x²)'], ['Formula 2 with a = 4/3', '(8/9) · (3/4) tan⁻¹(x/(4/3)) + C'], ['Simplify', '(2/3) tan⁻¹(3x/4) + C']]},
  {t: '∫ 8 dx/(16 + 9x²) (substitute u = 3x)', res: '(2/3) tan⁻¹(3x/4) + C', check: ['(2/3)arctan(3x/4)', '8/(16 + 9x^2)', -0.7], steps: [['Substitute', 'u = 3x, du = 3 dx: (8/3)∫ du/(16 + u²)'], ['Formula 2 with a = 4', '(8/3) · (1/4) tan⁻¹(u/4) + C'], ['Back to x', '(2/3) tan⁻¹(3x/4) + C: the same answer']]},
  {t: '∫ eᵗ/(1 + e^(2t)) dt', res: 'tan⁻¹(eᵗ) + C', check: ['arctan(e^x)', 'e^x/(1 + e^(2x))', 0.4], steps: [['Notice', 'e<sup>2t</sup> = (eᵗ)²'], ['Substitute', 'u = eᵗ, du = eᵗ dt: ∫ du/(1 + u²)'], ['Result', 'tan⁻¹u + C = tan⁻¹(eᵗ) + C']]},
  {t: '∫ from 2 to 6 of dx/(x√(x² − 4))', res: '½ cos⁻¹(1/3) ≈ 0.6155', steps: [['Match formula 3', 'a = 2: antiderivative ½ sec⁻¹(|x|/2)'], ['Evaluate', '½ sec⁻¹(3) − ½ sec⁻¹(1)'], ['Use sec⁻¹y = cos⁻¹(1/y)', '½ cos⁻¹(1/3) − ½ cos⁻¹(1) = ½ cos⁻¹(1/3) − 0'], ['Result', '½ cos⁻¹(1/3) ≈ 0.6155']]}
]);
CA.cards('form-cards', [
  {expr: '∫ dx/√(25 − x²)', correct: 0, why: 'a² − u² under a root: sin⁻¹(x/5) + C.'},
  {expr: '∫ dx/(9 + x²)', correct: 1, why: 'a² + u²: (1/3) tan⁻¹(x/3) + C.'},
  {expr: '∫ dx/(x√(x² − 16))', correct: 2, why: 'u√(u² − a²): (1/4) sec⁻¹(|x|/4) + C.'},
  {expr: '∫ x dx/(9 + x²)', correct: 3, why: 'The numerator x is the derivative of the denominator up to a factor: ½ ln(9 + x²) + C.'},
  {expr: '∫ dx/√(1 − 4x²)', correct: 0, why: 'u = 2x: ½ sin⁻¹(2x) + C.'},
  {expr: '∫ cos x dx/(1 + sin²x)', correct: 1, why: 'u = sin x: tan⁻¹(sin x) + C.'}
], {options: ['sin⁻¹ form', 'tan⁻¹ form', 'sec⁻¹ form', 'none: use u = denominator']});

/* ---------- 03 · check ---------- */
CA.antiCheckLab('inv-check', {f: '1/(4 + x^2)', F: '(1/2)arctan(x/2)', win: {xmin: -4, xmax: 4}});

/* ---------- guided problems ---------- */
CA.guided('57', [
  {q: '∫ dx/√(9 − x²) = ?', opts: ['sin⁻¹(x/3) + C', '(1/3) sin⁻¹(x/3) + C', 'sin⁻¹(3x) + C', '(1/3) tan⁻¹(x/3) + C'], correct: 0, hint: 'Formula 1, a = 3.', why: 'No 1/a factor in the sine formula.', ref: {panel: 'formulas', what: 'the three formulas', body: '<p>∫ du/√(a² − u²) = sin⁻¹(u/a) + C; ∫ du/(a² + u²) = (1/a)tan⁻¹(u/a) + C.</p>'}},
  {q: '∫ dx/(4 + x²) = ?', opts: ['(1/2) tan⁻¹(x/2) + C', 'tan⁻¹(x/2) + C', '(1/4) tan⁻¹(x/4) + C', '2 tan⁻¹(2x) + C'], correct: 0, hint: 'a = 2.', why: '(1/a) tan⁻¹(u/a).'},
  {q: '∫<sub>0</sub><sup>1/2</sup> dx/√(1 − x²) = ?', opts: ['π/6', 'π/3', 'π/4', '1/2'], correct: 0, hint: 'sin⁻¹(1/2).', why: 'sin(π/6) = 1/2.'},
  {q: '∫<sub>−1</sub><sup>1/√3</sup> dx/(1 + x²) = ?', opts: ['5π/12', 'π/12', '7π/12', 'π/6'], correct: 0, hint: 'tan⁻¹(1/√3) − tan⁻¹(−1).', why: 'π/6 + π/4.'},
  {q: '∫ dx/√(4 − 9x²) = ?', opts: ['(1/3) sin⁻¹(3x/2) + C', 'sin⁻¹(3x/2) + C', '(1/2) sin⁻¹(3x/2) + C', '(1/3) sin⁻¹(2x/3) + C'], correct: 0, hint: 'u = 3x, du = 3 dx.', why: '(1/3)∫ du/√(4 − u²).', ref: {panel: 'matching', what: 'matching the form', body: '<p>Identify a² and u²; substitute or factor out constants.</p>'}},
  {q: '∫ 8 dx/(16 + 9x²) = ?', opts: ['(2/3) tan⁻¹(3x/4) + C', '(1/2) tan⁻¹(3x/4) + C', '8 tan⁻¹(3x/4) + C', '(2/3) tan⁻¹(4x/3) + C'], correct: 0, hint: 'u = 3x, a = 4.', why: '(8/3)(1/4) tan⁻¹(u/4).'},
  {q: '∫ eᵗ/(1 + e<sup>2t</sup>) dt = ?', opts: ['tan⁻¹(eᵗ) + C', 'ln(1 + e<sup>2t</sup>) + C', 'sin⁻¹(eᵗ) + C', '½ tan⁻¹(eᵗ) + C'], correct: 0, hint: 'u = eᵗ.', why: '∫ du/(1 + u²).'},
  {q: '∫<sub>2</sub><sup>6</sup> dx/(x√(x² − 4)) = ?', opts: ['½ cos⁻¹(1/3)', 'cos⁻¹(1/3)', '½ sec⁻¹(6)', 'π/6'], correct: 0, hint: '½[sec⁻¹(x/2)] from 2 to 6.', why: '½(sec⁻¹3 − sec⁻¹1).'},
  {q: 'Which integral is NOT an inverse trigonometric form?', opts: ['∫ x dx/(1 + x²)', '∫ dx/(1 + x²)', '∫ dx/√(1 − x²)', '∫ dx/(x√(x² − 1))'], correct: 0, hint: 'Look at the numerator.', why: 'u = 1 + x² gives ½ ln(1 + x²).'},
  {q: 'tan⁻¹x is the unique angle θ with tan θ = x and:', opts: ['−π/2 &lt; θ &lt; π/2', '0 ≤ θ ≤ π', '0 &lt; θ &lt; π', '−π ≤ θ ≤ π'], correct: 0, hint: 'The restricted domain of tangent.', why: 'That is the range of tan⁻¹.'}
]);
})();
