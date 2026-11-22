/* Section 3.9 · Derivatives of Exponential and Logarithmic Functions — interactive activities */
(() => {
'use strict';
const {num} = CA, E = Math.E;

/* ---------- 01 · slope / height ---------- */
CA.lab('ratio-lab', {
  controls: [{type: 'range', key: 'b', label: 'Base a =', min: 0.3, max: 4, step: 0.01, value: 2, fmt: v => num(v, 2)}, {type: 'check', key: 'e', label: 'Use a = e', value: false}, {type: 'range', key: 'x', label: 'Point x =', min: -2, max: 2, step: 0.05, value: 1, fmt: v => num(v, 2)}],
  plot: {xmin: -2.5, xmax: 2.5, ymin: -1, ymax: 8, w: 540, h: 360, equal: false}, plotLabel: 'Exponential function and its derivative', legend: [['blue', 'y = aˣ'], ['purple', 'y = (aˣ)′', true], ['green', 'tangent line']],
  readouts: [['h', 'height aˣ'], ['s', 'slope (aˣ)′'], ['r', 'slope ÷ height'], ['ln', 'ln a']]
}, (lab, st) => {
  const a = st.e ? E : st.b, x = st.x, f = t => a ** t, df = t => CA.deriv(f, t), P = lab.plane(), y = f(x), m = df(x);
  P.curve(f, {color: 'blue', width: 3.4}).curve(df, {color: 'purple', width: 2.2, dash: '7 6'}).lineMB(m, y - m * x, {color: 'green', width: 2}).point(x, y, {color: 'orange', r: 7}).render();
  lab.read('h', num(y, 5)); lab.read('s', num(m, 5)); lab.read('r', num(m / y, 5)); lab.read('ln', num(Math.log(a), 5));
  lab.out(st.e ? 'With a = e the ratio is exactly 1: the derivative graph lies on top of the function graph. (eˣ)′ = eˣ.' : `Move x: the ratio slope ÷ height stays ${num(Math.log(a), 4)} = ln ${num(a, 2)}. So (aˣ)′ = aˣ · ln a.${a < 1 ? ' For 0 < a < 1, ln a < 0: the function decreases.' : ''}`, st.e ? 'ca-correct' : '');
});

/* ---------- 02 · exponential examples ---------- */
CA.stepLab('exp-steps', [
  {t: 'y = e⁷ˣ', res: 'y′ = 7e⁷ˣ', check: ['e^(7x)', '7e^(7x)', 0.2], steps: [['Chain rule', 'e⁷ˣ · (7x)′'], ['Result', '7e⁷ˣ']]},
  {t: 'y = x²e⁻ˣ', res: 'y′ = (2x − x²)e⁻ˣ', check: ['x^2 e^(-x)', '(2x - x^2)e^(-x)', 1.3], steps: [['Product rule', '(x²)′e⁻ˣ + x²(e⁻ˣ)′'], ['Chain rule on e⁻ˣ', '(e⁻ˣ)′ = e⁻ˣ · (−1)'], ['Combine', '2xe⁻ˣ − x²e⁻ˣ = (2x − x²)e⁻ˣ']]},
  {t: 'y = 2^(cos x)', res: 'y′ = −2<sup>cos x</sup> ln 2 · sin x', check: ['2^(cos(x))', '-2^(cos(x)) ln(2) sin(x)', 0.8], steps: [['Exponential rule with chain rule', '2<sup>cos x</sup> ln 2 · (cos x)′'], ['Result', '2<sup>cos x</sup> ln 2 · (−sin x) = −2<sup>cos x</sup> ln 2 · sin x']]},
  {t: 'y = (eˣ + e⁻ˣ)⁻¹', res: 'y′ = −(eˣ − e⁻ˣ)/(eˣ + e⁻ˣ)²', check: ['(e^x + e^(-x))^(-1)', '-(e^x - e^(-x))/(e^x + e^(-x))^2', 0.6], steps: [['Power of a function', '−1 · (eˣ + e⁻ˣ)⁻² · (eˣ + e⁻ˣ)′'], ['Derivative of the inside', '(eˣ + e⁻ˣ)′ = eˣ − e⁻ˣ'], ['Result', '−(eˣ − e⁻ˣ)/(eˣ + e⁻ˣ)²']]},
  {t: 'y = e^(x²) sin x', res: 'y′ = e<sup>x²</sup>(2x sin x + cos x)', check: ['e^(x^2) sin(x)', 'e^(x^2)(2x sin(x) + cos(x))', 0.7], steps: [['Product rule', '(e<sup>x²</sup>)′ sin x + e<sup>x²</sup> cos x'], ['Chain rule', '(e<sup>x²</sup>)′ = 2x e<sup>x²</sup>'], ['Factor', 'e<sup>x²</sup>(2x sin x + cos x)']]}
]);

/* ---------- 03 · logarithms ---------- */
CA.derivTraceLab('log-trace', {presets: [
  {t: 'f(x) = ln x', src: 'ln(x)', f: x => x > 0 ? Math.log(x) : NaN, df: x => x > 0 ? 1 / x : NaN, dT: '1/x', win: {xmin: 0.05, xmax: 6, ymin: -3, ymax: 2.2}, dwin: {ymin: -0.5, ymax: 5}},
  {t: 'f(x) = log₂ x', src: 'ln(x)/ln(2)', f: x => x > 0 ? Math.log2(x) : NaN, df: x => x > 0 ? 1 / (x * Math.LN2) : NaN, dT: '1/(x ln 2)', win: {xmin: 0.05, xmax: 6, ymin: -4, ymax: 3}, dwin: {ymin: -0.5, ymax: 6}},
  {t: 'f(x) = log₁₀ x', src: 'log(x)', f: x => x > 0 ? Math.log10(x) : NaN, df: x => x > 0 ? 1 / (x * Math.LN10) : NaN, dT: '1/(x ln 10)', win: {xmin: 0.05, xmax: 6, ymin: -1.5, ymax: 1}, dwin: {ymin: -0.3, ymax: 3}},
  {t: 'f(x) = ln|x|', src: 'ln(abs(x))', f: x => Math.log(Math.abs(x)), df: x => 1 / x, dT: '1/x for x ≠ 0', win: {xmin: -5, xmax: 5, ymin: -3, ymax: 2}, br: [0], dbr: [0], dwin: {ymin: -5, ymax: 5}},
  {t: 'f(x) = ln(x² + 1)', src: 'ln(x^2 + 1)', f: x => Math.log(x * x + 1), df: x => 2 * x / (x * x + 1), dT: '2x/(x² + 1)', win: {xmin: -5, xmax: 5, ymin: -0.5, ymax: 3.5}, dwin: {ymin: -1.3, ymax: 1.3}}
], value: '0'});

/* ---------- 04 · simplify first ---------- */
CA.stepLab('log-steps', [
  {t: 'y = ln(⁷√(x + 1)/(x⁷ + 1))', res: 'y′ = 1/(7(x + 1)) − 7x⁶/(x⁷ + 1)', check: ['ln((x + 1)^(1/7)/(x^7 + 1))', '1/(7(x + 1)) - 7x^6/(x^7 + 1)', 0.8], steps: [['Quotient property', 'ln(⁷√(x + 1)) − ln(x⁷ + 1)'], ['Power property', '(1/7) ln(x + 1) − ln(x⁷ + 1)'], ['Differentiate each term', '(1/7) · 1/(x + 1) − 7x⁶/(x⁷ + 1)'], ['Compare', 'Applying the chain rule to the original quotient gives the same result after much more algebra.']]},
  {t: 'y = log₅(x²), find y″', res: 'y″ = −2/(x² ln 5)', check: ['2/(x ln(5))', '-2/(x^2 ln(5))', 1.3], note: 'The check compares y′ = 2/(x ln 5) with its derivative.', steps: [['Power property (x > 0)', 'log₅(x²) = 2 log₅ x'], ['First derivative', 'y′ = 2/(x ln 5)'], ['Second derivative', 'y″ = (2/ln 5) · (−1/x²) = −2/(x² ln 5)']]},
  {t: 'y = ln(x√(x + 2))', res: 'y′ = 1/x + 1/(2(x + 2))', check: ['ln(x sqrt(x + 2))', '1/x + 1/(2(x + 2))', 1.5], steps: [['Product and power properties', 'ln x + (1/2) ln(x + 2)'], ['Differentiate', '1/x + 1/(2(x + 2))']]},
  {t: 'y = ln((x² + 1)/(x − 3)²)', res: 'y′ = 2x/(x² + 1) − 2/(x − 3)', check: ['ln((x^2 + 1)/(x - 3)^2)', '2x/(x^2 + 1) - 2/(x - 3)', 1.2], steps: [['Quotient and power properties', 'ln(x² + 1) − 2 ln|x − 3|'], ['Differentiate', '2x/(x² + 1) − 2/(x − 3)']]}
]);

/* ---------- 05 · logarithmic differentiation ---------- */
CA.stepLab('logdiff-steps', [
  {t: 'y = xˣ (x > 0)', res: 'y′ = xˣ(ln x + 1)', check: ['x^x', 'x^x (ln(x) + 1)', 1.3], steps: [['Take ln', 'ln y = ln(xˣ) = x ln x'], ['Differentiate both sides', 'y′/y = ln x + x · (1/x) = ln x + 1'], ['Multiply by y', 'y′ = xˣ(ln x + 1)']]},
  {t: 'y = x^(sin x) (x > 0)', res: 'y′ = x<sup>sin x</sup>(cos x ln x + sin x/x)', check: ['x^(sin(x))', 'x^(sin(x))(cos(x) ln(x) + sin(x)/x)', 1.4], steps: [['Take ln', 'ln y = sin x · ln x'], ['Differentiate', 'y′/y = cos x ln x + sin x/x'], ['Multiply by y', 'y′ = x<sup>sin x</sup>(cos x ln x + sin x/x)']]},
  {t: 'y = (x² + 1)³√x / (x + 5)⁴', res: 'y′ = y(6x/(x² + 1) + 1/(2x) − 4/(x + 5))', check: ['(x^2 + 1)^3 sqrt(x)/(x + 5)^4', '(x^2 + 1)^3 sqrt(x)/(x + 5)^4 (6x/(x^2 + 1) + 1/(2x) - 4/(x + 5))', 1.5], steps: [['Take ln', 'ln y = 3 ln(x² + 1) + (1/2) ln x − 4 ln(x + 5)'], ['Differentiate', 'y′/y = 6x/(x² + 1) + 1/(2x) − 4/(x + 5)'], ['Multiply by y', 'y′ = ((x² + 1)³√x/(x + 5)⁴)(6x/(x² + 1) + 1/(2x) − 4/(x + 5))']]}
]);

/* ---------- 06 · check ---------- */
CA.derivCheckLab('exp-check', {f: 'x^2 e^(-x)', df: '(2x - x^2) e^(-x)', win: {xmin: -1, xmax: 5}});

/* ---------- guided problems ---------- */
CA.guided('39', [
  {q: 'd/dx (e³ˣ) = ?', opts: ['3e³ˣ', 'e³ˣ', '3xe³ˣ⁻¹', 'e³'], correct: 0, hint: 'Chain rule.', why: 'e³ˣ · 3.', ref: {panel: 'exponential', what: 'derivatives of exponentials', body: '<p>(e<sup>g(x)</sup>)′ = e<sup>g(x)</sup> g′(x); (aˣ)′ = aˣ ln a.</p>'}},
  {q: 'd/dx (5ˣ) = ?', opts: ['5ˣ ln 5', 'x5ˣ⁻¹', '5ˣ', '5ˣ/ln 5'], correct: 0, hint: 'Not the power rule: the variable is in the exponent.', why: '(aˣ)′ = aˣ ln a.'},
  {q: 'd/dx (x e⁻²ˣ) = ?', opts: ['(1 − 2x)e⁻²ˣ', 'e⁻²ˣ', '−2xe⁻²ˣ', '(1 + 2x)e⁻²ˣ'], correct: 0, hint: 'Product rule, then chain rule.', why: 'e⁻²ˣ + x(−2e⁻²ˣ).', ref: {panel: 'exp-examples', what: 'exponentials with the other rules', body: '<p>Product rule, chain rule, power-of-a-function rule.</p>'}},
  {q: 'd/dx (ln x) = ?', opts: ['1/x', 'ln x', 'x', '1/(x ln x)'], correct: 0, hint: 'Inverse of eˣ.', why: '(ln x)′ = 1/x.', ref: {panel: 'logarithm', what: 'derivatives of logarithms', body: '<p>(ln x)′ = 1/x, (logₐx)′ = 1/(x ln a).</p>'}},
  {q: 'd/dx ln(x² + 4) = ?', opts: ['2x/(x² + 4)', '1/(x² + 4)', '2x ln(x² + 4)', '1/(2x)'], correct: 0, hint: 'g′/g.', why: '(x² + 4)′/(x² + 4).'},
  {q: 'd/dx log₃ x = ?', opts: ['1/(x ln 3)', '1/(3x)', 'ln 3/x', '3/x'], correct: 0, hint: 'Change of base: ln x/ln 3.', why: '1/(x ln 3).'},
  {q: 'Simplify first: d/dx ln(x³(x + 1)) = ?', opts: ['3/x + 1/(x + 1)', '3x² + 1', '1/(x³(x + 1))', '3/(x + 1)'], correct: 0, hint: '3 ln x + ln(x + 1).', why: 'Differentiate each term.', ref: {panel: 'properties', what: 'simplifying with log properties', body: '<p>ln(MN) = ln M + ln N, ln Mⁿ = n ln M.</p>'}},
  {q: 'For y = xˣ, y′ = ?', opts: ['xˣ(ln x + 1)', 'x · xˣ⁻¹', 'xˣ ln x', 'xˣ'], correct: 0, hint: 'ln y = x ln x.', why: 'y′/y = ln x + 1.', ref: {panel: 'log-diff', what: 'logarithmic differentiation', body: '<p>Take ln, differentiate implicitly, multiply by y.</p>'}},
  {q: 'The tangent line to y = ln x at x = 1 is:', opts: ['y = x − 1', 'y = x', 'y = x + 1', 'y = 1'], correct: 0, hint: 'Point (1, 0), slope 1.', why: 'y − 0 = 1(x − 1).'},
  {q: 'd/dx e<sup>sin x</sup> at x = 0 is:', opts: ['1', '0', 'e', 'cos 1'], correct: 0, hint: 'e<sup>sin x</sup> cos x.', why: 'e⁰ · cos 0 = 1.'}
]);
})();
