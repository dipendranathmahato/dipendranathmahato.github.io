/* Section 3.3 · Differentiation Rules — interactive activities */
(() => {
'use strict';
const {num} = CA;
const sup = s => String(s).replace(/-/g, '⁻').replace(/\./g, '·').replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
const nT = n => { const f = CA.simpleFrac(n, 12); return f ? f.toString() : num(n, 3); };
const powT = n => Number.isInteger(n) ? (n === 1 ? '' : sup(n)) : `<sup>${nT(n)}</sup>`;

/* ---------- 01 · power rule ---------- */
CA.lab('power-lab', {
  controls: [{type: 'range', key: 'n', label: 'Exponent n =', min: -3, max: 4, step: 0.5, value: 2, fmt: v => nT(v)}, {type: 'range', key: 'c', label: 'Coefficient c =', min: -3, max: 3, step: 0.5, value: 1, skip: [0], fmt: v => nT(v)},
    {type: 'range', key: 'x', label: 'Point x =', min: 0.2, max: 2.6, step: 0.05, value: 1.5, fmt: v => num(v, 2)}],
  top: '<div class="ca-equation" id="power-eq"></div>', plot: {xmin: -3, xmax: 3, ymin: -6, ymax: 8, w: 540, h: 380, equal: false}, plotLabel: 'y = c·xⁿ and its derivative', legend: [['blue', 'y = c·xⁿ'], ['purple', 'y = c·n·xⁿ⁻¹'], ['green', 'tangent line']],
  readouts: [['rule', 'Rule'], ['m', 'slope at x (rule)'], ['chk', 'slope at x (numerical)']]
}, (lab, st) => {
  const {n, c, x} = st, f = t => c * t ** n, df = t => c * n * t ** (n - 1), P = lab.plane(), intN = Number.isInteger(n), lo = intN ? -3 : 0;
  P.curve(f, {color: 'blue', width: 3.4, from: lo, breaks: n < 0 ? [0] : []}).curve(df, {color: 'purple', width: 2.4, dash: '7 6', from: lo, breaks: n - 1 < 0 ? [0] : []});
  const y = f(x), m = df(x); P.lineMB(m, y - m * x, {color: 'green', width: 2}).point(x, y, {color: 'orange', r: 7}).render();
  const cT = c === 1 ? '' : c === -1 ? '−' : nT(c), cnT = nT(c * n);
  document.getElementById('power-eq').innerHTML = n === 0 ? `y = ${nT(c)} (a constant) ⟹ y′ = 0` : `y = ${cT}x${powT(n)} ⟹ y′ = ${c * n === 1 ? '' : c * n === -1 ? '−' : cnT}${n - 1 === 0 ? '' : 'x' + powT(n - 1)}`;
  lab.read('rule', `d/dx (c·xⁿ) = c·n·xⁿ⁻¹`); lab.read('m', num(m, 5)); lab.read('chk', num(CA.deriv(f, x), 5));
  lab.out(Number.isInteger(n) ? 'Bring the exponent down as a factor, then lower the exponent by one.' : `For a fractional exponent such as ${nT(n)}, the same rule applies: x${powT(n)} has derivative ${nT(n)}x${powT(n - 1)} (graphed here for x &gt; 0).`);
});

/* ---------- 02 · rewrite then differentiate ---------- */
CA.stepLab('rewrite-steps', [
  {t: 'h(x) = 5√(x³) − 2∛(x¹¹)', res: 'h′(x) = (15/2)x<sup>1/2</sup> − (22/3)x<sup>8/3</sup>', check: ['5sqrt(x^3) - 2x^(11/3)', '7.5x^(0.5) - (22/3)x^(8/3)', 1.3], steps: [['Roots as powers', 'h(x) = 5x<sup>3/2</sup> − 2x<sup>11/3</sup>'], ['Power rule on each term', 'h′(x) = 5 · (3/2)x<sup>3/2 − 1</sup> − 2 · (11/3)x<sup>11/3 − 1</sup>'], ['Simplify', 'h′(x) = (15/2)x<sup>1/2</sup> − (22/3)x<sup>8/3</sup>']]},
  {t: 'g(x) = (x³ + 4)(x² + 1)/x', res: 'g′(x) = 4x³ + 2x + 4 − 4/x²', check: ['(x^3 + 4)(x^2 + 1)/x', '4x^3 + 2x + 4 - 4/x^2', 1.2], steps: [['Expand the numerator', '(x³ + 4)(x² + 1) = x⁵ + x³ + 4x² + 4'], ['Divide each term by x', 'g(x) = x⁴ + x² + 4x + 4x⁻¹'], ['Power rule', 'g′(x) = 4x³ + 2x + 4 + 4(−1)x⁻²'], ['Simplify', 'g′(x) = 4x³ + 2x + 4 − 4/x²']]},
  {t: 'f(x) = (2x² − 3)/√x', res: 'f′(x) = 3x<sup>1/2</sup> + (3/2)x<sup>−3/2</sup>', check: ['(2x^2 - 3)/sqrt(x)', '3x^(0.5) + 1.5x^(-1.5)', 1.4], steps: [['Divide each term by x<sup>1/2</sup>', 'f(x) = 2x<sup>3/2</sup> − 3x<sup>−1/2</sup>'], ['Power rule', 'f′(x) = 2(3/2)x<sup>1/2</sup> − 3(−1/2)x<sup>−3/2</sup>'], ['Simplify', 'f′(x) = 3√x + 3/(2x√x)']]},
  {t: 'k(x) = 1/x³ + 4∛x − 7', res: 'k′(x) = −3/x⁴ + (4/3)x<sup>−2/3</sup>', check: ['1/x^3 + 4x^(1/3) - 7', '-3/x^4 + (4/3)x^(-2/3)', 1.1], steps: [['Rewrite', 'k(x) = x⁻³ + 4x<sup>1/3</sup> − 7'], ['Power rule (the constant gives 0)', 'k′(x) = −3x⁻⁴ + (4/3)x<sup>−2/3</sup> + 0'], ['Simplify', 'k′(x) = −3/x⁴ + 4/(3∛(x²))']]}
]);

/* ---------- 03a · product rule as area ---------- */
const pf = x => x * x, pg = x => x + 1;
CA.lab('area-prod-lab', {
  controls: [{type: 'range', key: 'x', label: 'x =', min: 0.6, max: 2, step: 0.05, value: 1.2, fmt: v => num(v, 2)}, {type: 'range', key: 'h', label: 'h =', min: 0.01, max: 0.5, step: 0.01, value: 0.3, fmt: v => num(v, 2)}],
  plot: {xmin: -0.3, xmax: 5, ymin: -0.3, ymax: 3.6, w: 540, h: 380, equal: true, xname: 'width', yname: 'height'}, plotLabel: 'Rectangle of width f(x) = x² and height g(x) = x + 1, grown by h',
  legend: [['blue', 'f(x)·g(x)'], ['orange', 'Δf · g(x)'], ['purple', 'f(x) · Δg'], ['gray', 'Δf · Δg']], readouts: [['dA', 'ΔA/h'], ['parts', '(Δf·g + f·Δg + Δf·Δg)/h'], ['rule', 'f′g + fg′ (h → 0)']]
}, (lab, st) => {
  const {x, h} = st, W = pf(x), H = pg(x), W2 = pf(x + h), H2 = pg(x + h), P = lab.plane({xmin: -0.3, xmax: W2 + 0.5, ymin: -0.3, ymax: H2 + 0.4});
  const R = (a, b, c, d, color, op) => P.poly([[a, b], [c, b], [c, d], [a, d]], {color, fillOpacity: op, width: 1.4});
  R(0, 0, W, H, 'blue', 0.18); R(W, 0, W2, H, 'orange', 0.35); R(0, H, W, H2, 'purple', 0.35); R(W, H, W2, H2, 'gray', 0.5);
  P.label(W / 2, H / 2, 'f(x)·g(x)', {color: 'blue', anchor: 'middle', size: 13}).render();
  const dA = (W2 * H2 - W * H) / h, df = W2 - W, dg = H2 - H, rule = 2 * x * pg(x) + pf(x) * 1;
  lab.read('dA', num(dA, 5)); lab.read('parts', `(${num(df * H, 4)} + ${num(W * dg, 4)} + ${num(df * dg, 4)})/${num(h, 2)}`); lab.read('rule', `2x(x + 1) + x² = ${num(rule, 5)}`);
  lab.out(`The orange strip ≈ f′(x)h · g(x), the purple strip ≈ f(x) · g′(x)h, and the gray corner is about h², which disappears after dividing by h and letting h → 0. That is why (fg)′ = f′g + fg′. Shrink h: ΔA/h → ${num(rule, 4)}.`);
});

/* ---------- 03b · product rule examples ---------- */
CA.stepLab('prod-steps', [
  {t: 'y = (x² + 1)(x³ − 2x)', res: 'y′ = 5x⁴ − 3x² − 2', check: ['(x^2 + 1)(x^3 - 2x)', '5x^4 - 3x^2 - 2', 1.1], steps: [['Name the factors', 'f = x² + 1, g = x³ − 2x; f′ = 2x, g′ = 3x² − 2'], ['Product rule', 'y′ = (2x)(x³ − 2x) + (x² + 1)(3x² − 2)'], ['Expand', '2x⁴ − 4x² + 3x⁴ − 2x² + 3x² − 2'], ['Collect', 'y′ = 5x⁴ − 3x² − 2']]},
  {t: 'y = √x (4x − 3)', res: 'y′ = 6√x − 3/(2√x)', check: ['sqrt(x)(4x - 3)', '6sqrt(x) - 3/(2sqrt(x))', 1.5], steps: [['Name the factors', 'f = x<sup>1/2</sup>, g = 4x − 3; f′ = 1/(2√x), g′ = 4'], ['Product rule', 'y′ = (4x − 3)/(2√x) + 4√x'], ['Simplify', 'y′ = 2√x − 3/(2√x) + 4√x = 6√x − 3/(2√x)']]},
  {t: 'y = x³eˣ (using (eˣ)′ = eˣ)', res: 'y′ = x²eˣ(x + 3)', check: ['x^3 e^x', 'x^2 e^x (x + 3)', 0.8], steps: [['Name the factors', 'f = x³, g = eˣ; f′ = 3x², g′ = eˣ'], ['Product rule', 'y′ = 3x²eˣ + x³eˣ'], ['Factor', 'y′ = x²eˣ(3 + x)']]}
]);

/* ---------- 04 · quotient rule examples ---------- */
CA.stepLab('quot-steps', [
  {t: 'y = (x² + 1)/(x − 3)', res: 'y′ = (x² − 6x − 1)/(x − 3)²', check: ['(x^2 + 1)/(x - 3)', '(x^2 - 6x - 1)/(x - 3)^2', 1], steps: [['High and low', 'high = x² + 1 (d-high = 2x); low = x − 3 (d-low = 1)'], ['Quotient rule', 'y′ = ((x − 3)(2x) − (x² + 1)(1))/(x − 3)²'], ['Simplify the numerator', '2x² − 6x − x² − 1 = x² − 6x − 1'], ['Result', 'y′ = (x² − 6x − 1)/(x − 3)²']]},
  {t: 'y = 3x/(x² + 4)', res: 'y′ = (12 − 3x²)/(x² + 4)²', check: ['3x/(x^2 + 4)', '(12 - 3x^2)/(x^2 + 4)^2', 0.9], steps: [['High and low', 'high = 3x (d-high = 3); low = x² + 4 (d-low = 2x)'], ['Quotient rule', 'y′ = ((x² + 4)(3) − 3x(2x))/(x² + 4)²'], ['Simplify', 'y′ = (12 − 3x²)/(x² + 4)²']]},
  {t: 'y = (2x − 1)/(x + 5)', res: 'y′ = 11/(x + 5)²', check: ['(2x - 1)/(x + 5)', '11/(x + 5)^2', 0.5], steps: [['High and low', 'high = 2x − 1 (d-high = 2); low = x + 5 (d-low = 1)'], ['Quotient rule', 'y′ = ((x + 5)(2) − (2x − 1)(1))/(x + 5)²'], ['Simplify', 'y′ = (2x + 10 − 2x + 1)/(x + 5)² = 11/(x + 5)²']]},
  {t: 'y = 1/x⁵ (quotient rule or power rule)', res: 'y′ = −5/x⁶', check: ['1/x^5', '-5/x^6', 1.2], note: 'Same answer as the power rule: (x⁻⁵)′ = −5x⁻⁶. The power rule is quicker here.', steps: [['Quotient rule', 'y′ = (x⁵ · 0 − 1 · 5x⁴)/(x⁵)²'], ['Simplify', 'y′ = −5x⁴/x¹⁰ = −5/x⁶']]}
]);

/* ---------- 05 · check your derivative ---------- */
CA.derivCheckLab('check-lab', {f: '(x^2 + 1)/(x - 3)', df: '(x^2 - 6x - 1)/(x - 3)^2', win: {xmin: -4, xmax: 2.5}});

/* ---------- guided problems ---------- */
CA.guided('33', [
  {q: 'd/dx (x⁷) = ?', opts: ['7x⁶', 'x⁶', '7x⁷', '6x⁷'], correct: 0, hint: 'Power rule.', why: 'n xⁿ⁻¹ with n = 7.', ref: {panel: 'basic', what: 'the power rule', body: '<p>d/dx xⁿ = n xⁿ⁻¹.</p>'}},
  {q: 'd/dx (4x³ − 5x + 9) = ?', opts: ['12x² − 5', '12x² − 5x', '4x² − 5', '12x³ − 5'], correct: 0, hint: 'Term by term.', why: '12x² − 5 + 0.'},
  {q: 'd/dx (√x) = ?', opts: ['1/(2√x)', '2√x', '√x/2', '1/√x'], correct: 0, hint: '√x = x<sup>1/2</sup>.', why: '(1/2)x<sup>−1/2</sup>.'},
  {q: 'd/dx (3/x²) = ?', opts: ['−6/x³', '6/x³', '−3/x³', '3/(2x)'], correct: 0, hint: '3x⁻².', why: '3(−2)x⁻³.', ref: {panel: 'rewrite', what: 'rewriting before differentiating', body: '<p>1/xⁿ = x⁻ⁿ and ⁿ√(xᵐ) = x<sup>m/n</sup>.</p>'}},
  {q: 'If g(x) = (x³ + 4)(x² + 1)/x, then g′(1) = ?', opts: ['6', '10', '2', '0'], correct: 0, hint: 'g′(x) = 4x³ + 2x + 4 − 4/x².', why: '4 + 2 + 4 − 4 = 6.'},
  {q: 'd/dx [x² eˣ] = ?', opts: ['2xeˣ + x²eˣ', '2xeˣ', 'x²eˣ', '2x + eˣ'], correct: 0, hint: 'Product rule.', why: 'f′g + fg′.', ref: {panel: 'product', what: 'the product rule', body: '<p>(fg)′ = f′g + fg′.</p>'}},
  {q: 'Which is NOT equal to d/dx [(x + 1)(x − 1)]?', opts: ['(1)(1)', '(x − 1) + (x + 1)', '2x', 'd/dx (x² − 1)'], correct: 0, hint: 'The derivative of a product is not the product of derivatives.', why: 'The derivative is 2x, not 1.'},
  {q: 'd/dx [(x + 2)/(x − 1)] = ?', opts: ['−3/(x − 1)²', '3/(x − 1)²', '1', '(2x + 1)/(x − 1)²'], correct: 0, hint: '((x − 1) − (x + 2))/(x − 1)².', why: 'The numerator is −3.', ref: {panel: 'quotient', what: 'the quotient rule', body: '<p>(f/g)′ = (gf′ − fg′)/g².</p>'}},
  {q: 'If f(2) = 3, f′(2) = −1, g(2) = 4, g′(2) = 5, then (fg)′(2) = ?', opts: ['11', '−5', '19', '7'], correct: 0, hint: 'f′g + fg′.', why: '(−1)(4) + (3)(5) = 11.'},
  {q: 'With the same values, (f/g)′(2) = ?', opts: ['−19/16', '19/16', '−11/16', '−1/5'], correct: 0, hint: '(gf′ − fg′)/g².', why: '(4(−1) − 3(5))/16 = −19/16.'}
]);
})();
