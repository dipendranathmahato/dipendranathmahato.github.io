/* Section 5.6 · Integrals Involving Exponential and Logarithmic Functions — interactive activities */
(() => {
'use strict';
const {num} = CA;

/* ---------- 01 · check ---------- */
CA.antiCheckLab('exp-check', {f: 'ln(x)', F: 'x(ln(x) - 1)', win: {xmin: 0.2, xmax: 5}});

/* ---------- 02 · exponential ---------- */
CA.stepLab('exp-steps', [
  {t: '∫ eˣ√(1 + eˣ) dx (u = 1 + eˣ)', res: '(2/3)(1 + eˣ)<sup>3/2</sup> + C', check: ['(2/3)(1 + e^x)^(1.5)', 'e^x sqrt(1 + e^x)', 0.4], steps: [['Choose u', 'u = 1 + eˣ, du = eˣ dx'], ['Rewrite', '∫ √u du = ∫ u<sup>1/2</sup> du'], ['Integrate', 'u<sup>3/2</sup>/(3/2) = (2/3)u<sup>3/2</sup> + C'], ['Back to x', '(2/3)(1 + eˣ)<sup>3/2</sup> + C']]},
  {t: '∫ eˣ√(1 + eˣ) dx (u = eˣ, then v = 1 + u)', res: '(2/3)(1 + eˣ)<sup>3/2</sup> + C', check: ['(2/3)(1 + e^x)^(1.5)', 'e^x sqrt(1 + e^x)', -0.6], steps: [['First substitution', 'u = eˣ, du = eˣ dx: ∫ √(1 + u) du'], ['Second substitution', 'v = 1 + u, dv = du: ∫ √v dv'], ['Integrate', '(2/3)v<sup>3/2</sup> + C'], ['Back to x', '(2/3)(1 + eˣ)<sup>3/2</sup> + C: the same answer']]},
  {t: '∫ 3x² e^(2x³) dx', res: '½e<sup>2x³</sup> + C', check: ['e^(2x^3)/2', '3x^2 e^(2x^3)', 0.5], steps: [['Observe', 'the exponent 2x³ has derivative 6x², and 3x² is half of that'], ['Choose u', 'u = 2x³, du = 6x² dx, so 3x² dx = du/2'], ['Rewrite', '½∫ eᵘ du'], ['Result', '½eᵘ + C = ½e<sup>2x³</sup> + C']]},
  {t: '∫ e^(1/x)/x² dx', res: '−e<sup>1/x</sup> + C', check: ['-e^(1/x)', 'e^(1/x)/x^2', 1.3], steps: [['Choose u', 'u = 1/x, du = −dx/x²'], ['Rewrite', '−∫ eᵘ du'], ['Result', '−e<sup>1/x</sup> + C']]},
  {t: '∫ 2^(3x) dx', res: '2<sup>3x</sup>/(3 ln 2) + C', check: ['2^(3x)/(3ln(2))', '2^(3x)', 0.5], steps: [['Rule', '∫ b<sup>ax</sup> dx = b<sup>ax</sup>/(a ln b) + C with b = 2, a = 3'], ['Result', '2<sup>3x</sup>/(3 ln 2) + C']]},
  {t: '∫ from 0 to 1 of x e^(−x²) dx', res: '(1 − e<sup>−1</sup>)/2', steps: [['Choose u', 'u = −x², du = −2x dx; x = 0 → u = 0, x = 1 → u = −1'], ['Rewrite', '−½∫<sub>0</sub><sup>−1</sup> eᵘ du = ½∫<sub>−1</sub><sup>0</sup> eᵘ du'], ['Evaluate', '½(e⁰ − e<sup>−1</sup>) = (1 − 1/e)/2 ≈ 0.316']]}
]);

/* ---------- 03 · logarithms ---------- */
CA.lab('ln-lab', {
  controls: [{type: 'range', key: 'x', label: 'x =', min: 0.2, max: 6, step: 0.05, value: 3, fmt: v => num(v, 2)}, {type: 'range', key: 'a', label: 'Scale by a =', min: 1, max: 3, step: 0.25, value: 1, fmt: v => num(v, 2)}],
  plot: {xmin: -0.2, xmax: 13, ymin: -0.3, ymax: 2.6, w: 560, h: 320, equal: false, xname: 't'}, plotLabel: 'Area under 1/t', legend: [['blue', 'from 1 to x (signed)'], ['purple', 'from a to ax']],
  readouts: [['A', 'area from 1 to x'], ['ln', 'ln x'], ['B', 'area from a to ax']]
}, (lab, st) => {
  const f = t => 1 / t, x = st.x, a = st.a, P = lab.plane();
  if (x !== 1) CA.shade(P, f, Math.min(1, x), Math.max(1, x), {color: x > 1 ? 'blue' : 'red', fillOpacity: 0.28});
  if (a > 1) CA.shade(P, f, a, a * x, {color: 'purple', fillOpacity: 0.2});
  P.curve(f, {color: 'text', width: 2.8, from: 0.38, to: 13}).vline(1, {color: 'gray', dash: '4 4', width: 1.2}).render();
  const A = (x >= 1 ? 1 : -1) * CA.integrate(f, Math.min(1, x), Math.max(1, x), 2000), B = CA.integrate(f, a, a * x, 2000);
  lab.read('A', num(A, 6)); lab.read('ln', num(Math.log(x), 6)); lab.read('B', a > 1 ? num(B, 6) : '(set a > 1)');
  lab.out(a > 1 ? `Stretching the interval by a factor ${num(a, 2)} (and the curve 1/t shrinking by the same factor) leaves the area unchanged: ln(ax) − ln a = ln x.` : `The area from 1 to x equals ln x${x < 1 ? ' (negative because x < 1: the limits run backward)' : ''}.`);
});
CA.stepLab('log-steps', [
  {t: '∫ dx/(x + 2)', res: 'ln|x + 2| + C', check: ['ln(abs(x + 2))', '1/(x + 2)', 0.3], steps: [['Choose u', 'u = x + 2, du = dx'], ['Rewrite', '∫ du/u'], ['Result', 'ln|u| + C = ln|x + 2| + C']]},
  {t: '∫ x/(x² + 1) dx', res: '½ ln(x² + 1) + C', check: ['ln(x^2 + 1)/2', 'x/(x^2 + 1)', 0.7], steps: [['Choose u', 'u = x² + 1, du = 2x dx'], ['Rewrite', '½∫ du/u'], ['Result', '½ ln|u| + C = ½ ln(x² + 1) + C (x² + 1 > 0)']]},
  {t: '∫ tan x dx', res: '−ln|cos x| + C = ln|sec x| + C', check: ['-ln(abs(cos(x)))', 'tan(x)', 0.6], steps: [['Rewrite', 'tan x = sin x/cos x'], ['Choose u', 'u = cos x, du = −sin x dx'], ['Rewrite', '−∫ du/u'], ['Result', '−ln|cos x| + C = ln|sec x| + C']]},
  {t: '∫ (2x + 3)/(x² + 3x − 1) dx', res: 'ln|x² + 3x − 1| + C', check: ['ln(abs(x^2 + 3x - 1))', '(2x + 3)/(x^2 + 3x - 1)', 1.5], steps: [['Notice', 'the numerator is the derivative of the denominator'], ['Result', 'ln|x² + 3x − 1| + C']]},
  {t: '∫ from 1 to e of (ln x)/x dx', res: '1/2', steps: [['Choose u', 'u = ln x, du = dx/x; x = 1 → u = 0, x = e → u = 1'], ['Rewrite', '∫<sub>0</sub><sup>1</sup> u du'], ['Evaluate', 'u²/2 |<sub>0</sub><sup>1</sup> = 1/2']]}
]);

/* ---------- 04 · price-demand ---------- */
CA.lab('price-lab', {
  controls: [{type: 'range', key: 'x', label: 'Tubes per week x =', min: 0, max: 300, step: 5, value: 100}, {type: 'check', key: 'r', label: 'Use e^(−0.5) ≈ 0.6 (rounded)', value: false}],
  plot: {xmin: -10, xmax: 310, ymin: 0, ymax: 3.2, w: 540, h: 320, equal: false, xname: 'x', yname: 'p'}, plotLabel: 'Price as a function of weekly demand', legend: [['blue', 'p(x)'], ['red', 'given point (50, 2.35)']],
  readouts: [['C', 'C'], ['p', 'p(x)'], ['r', 'p′(x)']]
}, (lab, st) => {
  const C = 2.35 - 1.5 * (st.r ? 0.6 : Math.exp(-0.5)), p = x => 1.5 * Math.exp(-0.01 * x) + C, x = st.x, P = lab.plane();
  P.curve(p, {color: 'blue', width: 3.2, from: 0, to: 300}).hline(C, {color: 'gray', dash: '6 5', width: 1.2}).point(50, 2.35, {color: 'red', r: 7, label: '(50, 2.35)'}).point(x, p(x), {color: 'orange', r: 7}).render();
  lab.read('C', num(C, 5)); lab.read('p', '$' + num(p(x), 4)); lab.read('r', num(-0.015 * Math.exp(-0.01 * x), 5) + ' $ per tube');
  lab.out(`At ${x} tubes per week the price is about $${p(x).toFixed(2)}. As demand grows, the price levels off near C ≈ $${C.toFixed(2)}.`);
});

/* ---------- guided problems ---------- */
CA.guided('56', [
  {q: '∫ e<sup>5x</sup> dx = ?', opts: ['e<sup>5x</sup>/5 + C', '5e<sup>5x</sup> + C', 'e<sup>5x</sup> + C', 'e<sup>6x</sup>/6 + C'], correct: 0, hint: '∫ e<sup>ax</sup> dx = e<sup>ax</sup>/a + C.', why: 'a = 5.', ref: {panel: 'rules', what: 'the rules', body: '<p>∫ e<sup>ax</sup> dx = e<sup>ax</sup>/a + C; ∫ dx/x = ln|x| + C.</p>'}},
  {q: '∫ 3ˣ dx = ?', opts: ['3ˣ/ln 3 + C', '3ˣ ln 3 + C', 'x3ˣ⁻¹ + C', '3ˣ⁺¹/(x + 1) + C'], correct: 0, hint: 'Divide by ln 3.', why: '(3ˣ)′ = 3ˣ ln 3.'},
  {q: '∫ ln x dx = ?', opts: ['x ln x − x + C', '1/x + C', '(ln x)²/2 + C', 'x ln x + C'], correct: 0, hint: 'Check by differentiating.', why: '(x ln x − x)′ = ln x.'},
  {q: '∫ eˣ√(1 + eˣ) dx = ?', opts: ['(2/3)(1 + eˣ)<sup>3/2</sup> + C', '(1 + eˣ)<sup>3/2</sup> + C', 'eˣ(1 + eˣ)<sup>1/2</sup> + C', '(1/2)(1 + eˣ)<sup>1/2</sup> + C'], correct: 0, hint: 'u = 1 + eˣ.', why: '∫ √u du.', ref: {panel: 'exponential', what: 'exponential integrands', body: '<p>Substitute the exponent or the expression containing eˣ.</p>'}},
  {q: '∫ 3x² e<sup>2x³</sup> dx = ?', opts: ['½e<sup>2x³</sup> + C', 'e<sup>2x³</sup> + C', '6x e<sup>2x³</sup> + C', '3e<sup>2x³</sup> + C'], correct: 0, hint: 'u = 2x³, du = 6x² dx.', why: '½∫ eᵘ du.'},
  {q: '∫ dx/(x + 2) = ?', opts: ['ln|x + 2| + C', 'ln x + 2 + C', '−1/(x + 2)² + C', '(x + 2)⁻² + C'], correct: 0, hint: 'u = x + 2.', why: '∫ du/u.', ref: {panel: 'logarithmic', what: 'integrals that give logarithms', body: '<p>∫ g′(x)/g(x) dx = ln|g(x)| + C.</p>'}},
  {q: '∫ tan x dx = ?', opts: ['−ln|cos x| + C', 'sec²x + C', 'ln|sin x| + C', '−ln|sin x| + C'], correct: 0, hint: 'sin x/cos x with u = cos x.', why: '−∫ du/u.'},
  {q: '∫<sub>1</sub><sup>e</sup> dx/x = ?', opts: ['1', 'e', '0', 'e − 1'], correct: 0, hint: 'ln x.', why: 'ln e − ln 1.'},
  {q: 'p′(x) = −0.015e<sup>−0.01x</sup>. Then p(x) = ?', opts: ['1.5e<sup>−0.01x</sup> + C', '−0.015e<sup>−0.01x</sup> + C', '0.00015e<sup>−0.01x</sup> + C', '−1.5e<sup>−0.01x</sup> + C'], correct: 0, hint: 'Divide by −0.01.', why: '−0.015/(−0.01) = 1.5.', ref: {panel: 'application', what: 'the price-demand problem', body: '<p>p(x) = ∫ p′(x) dx, then p(50) = 2.35 fixes C.</p>'}},
  {q: '∫ e<sup>sin x</sup> cos x dx = ?', opts: ['e<sup>sin x</sup> + C', 'e<sup>cos x</sup> + C', 'e<sup>sin x</sup> sin x + C', '−e<sup>sin x</sup> + C'], correct: 0, hint: 'u = sin x.', why: '∫ eᵘ du.'}
]);
})();
