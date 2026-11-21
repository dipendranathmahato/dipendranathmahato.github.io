/* Section 3.5 · Derivatives of Trigonometric Functions — interactive activities */
(() => {
'use strict';
const {num} = CA, PI = Math.PI, sec = x => 1 / Math.cos(x), csc = x => 1 / Math.sin(x), cot = x => Math.cos(x) / Math.sin(x);
const asyT = [-3 * PI / 2, -PI / 2, PI / 2, 3 * PI / 2], asyC = [-2 * PI, -PI, 0, PI, 2 * PI];

/* ---------- 01 · trace ---------- */
CA.derivTraceLab('trig-trace', {presets: [
  {t: 'f(x) = sin x', src: 'sin(x)', f: Math.sin, df: Math.cos, dT: 'cos x', win: {xmin: -6.5, xmax: 6.5, ymin: -1.6, ymax: 1.6}, dwin: {ymin: -1.6, ymax: 1.6}},
  {t: 'f(x) = cos x', src: 'cos(x)', f: Math.cos, df: x => -Math.sin(x), dT: '−sin x', win: {xmin: -6.5, xmax: 6.5, ymin: -1.6, ymax: 1.6}, dwin: {ymin: -1.6, ymax: 1.6}},
  {t: 'f(x) = tan x', src: 'tan(x)', f: Math.tan, df: x => sec(x) ** 2, dT: 'sec²x (always ≥ 1)', win: {xmin: -4.5, xmax: 4.5, ymin: -6, ymax: 6}, dwin: {ymin: -1, ymax: 10}, br: asyT, dbr: asyT},
  {t: 'f(x) = sec x', src: 'sec(x)', f: sec, df: x => sec(x) * Math.tan(x), dT: 'sec x tan x', win: {xmin: -4.5, xmax: 4.5, ymin: -6, ymax: 6}, dwin: {ymin: -10, ymax: 10}, br: asyT, dbr: asyT},
  {t: 'f(x) = 2 sin x − cos x', src: '2sin(x) - cos(x)', f: x => 2 * Math.sin(x) - Math.cos(x), df: x => 2 * Math.cos(x) + Math.sin(x), dT: '2 cos x + sin x', win: {xmin: -6.5, xmax: 6.5, ymin: -2.6, ymax: 2.6}, dwin: {ymin: -2.6, ymax: 2.6}}
]});

/* ---------- 02 · six derivatives ---------- */
CA.cards('six-cards', [
  {expr: 'd/dx (sin x)', correct: 0, why: '(sin x)′ = cos x.'}, {expr: 'd/dx (cos x)', correct: 1, why: '(cos x)′ = −sin x.'},
  {expr: 'd/dx (tan x)', correct: 2, why: '(tan x)′ = sec²x.'}, {expr: 'd/dx (cot x)', correct: 3, why: '(cot x)′ = −csc²x.'},
  {expr: 'd/dx (sec x)', correct: 4, why: '(sec x)′ = sec x tan x.'}, {expr: 'd/dx (csc x)', correct: 5, why: '(csc x)′ = −csc x cot x.'}
], {options: ['cos x', '−sin x', 'sec²x', '−csc²x', 'sec x tan x', '−csc x cot x']});

/* ---------- 03 · tangent lines ---------- */
CA.tangentLineLab('trig-tl', [
  {t: 'f(x) = 6 sin x at x = π/6', f: x => 6 * Math.sin(x), df: x => 6 * Math.cos(x), a: PI / 6, ptT: '(π/6, 3)', mT: '3√3 ≈ 5.196', eqT: 'y = 3√3 x + 3 − √3π/2', win: {xmin: -1, xmax: 4, ymin: -7, ymax: 8},
    steps: [['Point', 'f(π/6) = 6 sin(π/6) = 6 · ½ = 3'], ['Slope', 'f′(x) = 6 cos x, so f′(π/6) = 6 · √3/2 = 3√3'], ['Point-slope form', 'y − 3 = 3√3(x − π/6)'], ['Slope-intercept form', 'y = 3√3 x + 3 − √3π/2']]},
  {t: 'f(x) = tan x at x = π/4', f: Math.tan, df: x => sec(x) ** 2, a: PI / 4, ptT: '(π/4, 1)', mT: '2', eqT: 'y = 2x + 1 − π/2', win: {xmin: -1.4, xmax: 1.4, ymin: -4, ymax: 4}, br: [-PI / 2, PI / 2],
    steps: [['Point', 'tan(π/4) = 1'], ['Slope', 'sec²(π/4) = (√2)² = 2'], ['Point-slope form', 'y − 1 = 2(x − π/4)'], ['Slope-intercept form', 'y = 2x + 1 − π/2']]},
  {t: 'f(x) = sec x at x = π/3', f: sec, df: x => sec(x) * Math.tan(x), a: PI / 3, ptT: '(π/3, 2)', mT: '2√3 ≈ 3.464', eqT: 'y = 2√3 x + 2 − 2√3π/3', win: {xmin: -1.4, xmax: 1.5, ymin: -1, ymax: 7}, br: [-PI / 2, PI / 2],
    steps: [['Point', 'sec(π/3) = 1/cos(π/3) = 2'], ['Slope', 'sec(π/3) tan(π/3) = 2 · √3 = 2√3'], ['Point-slope form', 'y − 2 = 2√3(x − π/3)']]},
  {t: 'f(x) = 4 cos x at x = π/3', f: x => 4 * Math.cos(x), df: x => -4 * Math.sin(x), a: PI / 3, ptT: '(π/3, 2)', mT: '−2√3 ≈ −3.464', eqT: 'y = −2√3 x + 2 + 2√3π/3', win: {xmin: -1, xmax: 4, ymin: -5, ymax: 6},
    steps: [['Point', '4 cos(π/3) = 4 · ½ = 2'], ['Slope', 'f′(x) = −4 sin x, so f′(π/3) = −4 · √3/2 = −2√3'], ['Point-slope form', 'y − 2 = −2√3(x − π/3)']]}
]);

/* ---------- 04 · product and quotient rules ---------- */
CA.stepLab('trig-steps', [
  {t: 'tan x = sin x / cos x', res: '(tan x)′ = sec²x', check: ['tan(x)', '1/cos(x)^2', 0.6], steps: [['Quotient rule', '(cos x · (sin x)′ − sin x · (cos x)′)/cos²x'], ['Derivatives of sin and cos', '(cos x · cos x − sin x · (−sin x))/cos²x'], ['Pythagorean identity', '(cos²x + sin²x)/cos²x = 1/cos²x'], ['Result', 'sec²x']]},
  {t: 'y = t cos t / (1 + t)', res: 'y′ = (cos t − t sin t − t² sin t)/(1 + t)²', check: ['x cos(x)/(1 + x)', '(cos(x) - x sin(x) - x^2 sin(x))/(1 + x)^2', 1], steps: [['Quotient rule', '((1 + t)(t cos t)′ − t cos t · (1 + t)′)/(1 + t)²'], ['Product rule on t cos t', '(t cos t)′ = cos t − t sin t'], ['Substitute', '((1 + t)(cos t − t sin t) − t cos t)/(1 + t)²'], ['Distribute (1 + t) over both terms', '(cos t + t cos t − t sin t − t² sin t − t cos t)/(1 + t)²'], ['Simplify', '(cos t − t sin t − t² sin t)/(1 + t)²']]},
  {t: 'y = x² sin x', res: 'y′ = 2x sin x + x² cos x', check: ['x^2 sin(x)', '2x sin(x) + x^2 cos(x)', 1.1], steps: [['Product rule', '(x²)′ sin x + x² (sin x)′'], ['Result', '2x sin x + x² cos x']]},
  {t: 'sec x = 1 / cos x', res: '(sec x)′ = sec x tan x', check: ['1/cos(x)', 'tan(x)/cos(x)', 0.7], steps: [['Quotient rule', '(cos x · 0 − 1 · (−sin x))/cos²x = sin x/cos²x'], ['Split the fraction', '(1/cos x) · (sin x/cos x)'], ['Result', 'sec x tan x']]},
  {t: 'y = sin x / (1 + cos x)', res: 'y′ = 1/(1 + cos x)', check: ['sin(x)/(1 + cos(x))', '1/(1 + cos(x))', 0.9], steps: [['Quotient rule', '((1 + cos x) cos x − sin x(−sin x))/(1 + cos x)²'], ['Expand', '(cos x + cos²x + sin²x)/(1 + cos x)²'], ['Pythagorean identity', '(cos x + 1)/(1 + cos x)²'], ['Cancel', '1/(1 + cos x)']]}
]);

/* ---------- 05 · cycle of four ---------- */
const CY = [['sin x', Math.sin], ['cos x', Math.cos], ['−sin x', x => -Math.sin(x)], ['−cos x', x => -Math.cos(x)]];
CA.lab('cycle-lab', {
  controls: [{type: 'seg', key: 'f', label: 'Start with', value: 's', options: [['s', 'sin x'], ['c', 'cos x']]}, {type: 'range', key: 'n', label: 'Order n =', min: 0, max: 120, step: 1, value: 74}],
  plot: {xmin: -6.5, xmax: 6.5, ymin: -1.6, ymax: 1.6, w: 540, h: 260, equal: false}, plotLabel: 'The n-th derivative', readouts: [['r', 'n mod 4'], ['d', 'n-th derivative']]
}, (lab, st) => {
  const s = st.f === 's' ? 0 : 1, r = st.n % 4, k = (s + r) % 4, P = lab.plane();
  P.curve(CY[s][1], {color: 'gray', width: 1.8, dash: '6 6'}).curve(CY[k][1], {color: 'blue', width: 3.2}).render();
  lab.read('r', `${st.n} = 4 · ${Math.floor(st.n / 4)} + ${r}`); lab.read('d', `d<sup>${st.n}</sup>/dx<sup>${st.n}</sup> (${CY[s][0]}) = ${CY[k][0]}`);
  lab.out(`Every block of four derivatives brings ${CY[s][0]} back to itself, so only the remainder ${r} matters.`);
});

/* ---------- 06 · check ---------- */
CA.derivCheckLab('trig-check', {f: 'x^2 cos(x)', df: '2x cos(x) - x^2 sin(x)', win: {xmin: -4, xmax: 4}});

/* ---------- guided problems ---------- */
CA.guided('35', [
  {q: 'd/dx (3 sin x − 2 cos x) = ?', opts: ['3 cos x + 2 sin x', '3 cos x − 2 sin x', '−3 cos x + 2 sin x', '3 sin x + 2 cos x'], correct: 0, hint: '(cos x)′ = −sin x.', why: '3 cos x − 2(−sin x).', ref: {panel: 'sine', what: 'the derivatives of sine and cosine', body: '<p>(sin x)′ = cos x, (cos x)′ = −sin x.</p>'}},
  {q: 'd/dx (tan x) = ?', opts: ['sec²x', 'sec x tan x', '−csc²x', 'cot x'], correct: 0, hint: 'Quotient rule on sin x/cos x.', why: '1/cos²x.', ref: {panel: 'six', what: 'the six derivative formulas', body: '<p>(tan x)′ = sec²x, (sec x)′ = sec x tan x, …</p>'}},
  {q: 'd/dx (csc x) = ?', opts: ['−csc x cot x', 'csc x cot x', '−csc²x', 'sec x tan x'], correct: 0, hint: 'A “co” function: minus sign.', why: '(1/sin x)′ = −cos x/sin²x.'},
  {q: 'The slope of y = 6 sin x at x = π/6 is:', opts: ['3√3', '3', '6', '√3/2'], correct: 0, hint: '6 cos(π/6).', why: '6 · √3/2.', ref: {panel: 'tangent', what: 'the tangent line to 6 sin x', body: '<p>Point (π/6, 3), slope 6 cos(π/6).</p>'}},
  {q: 'The tangent line to y = tan x at x = π/4 has slope:', opts: ['2', '1', '√2', '1/2'], correct: 0, hint: 'sec²(π/4).', why: '(√2)² = 2.'},
  {q: 'd/dx (x sin x) = ?', opts: ['sin x + x cos x', 'cos x', 'x cos x', 'sin x − x cos x'], correct: 0, hint: 'Product rule.', why: '(x)′ sin x + x (sin x)′.', ref: {panel: 'rules', what: 'trig with the product and quotient rules', body: '<p>(fg)′ = f′g + fg′.</p>'}},
  {q: 'd/dt [t cos t/(1 + t)] = ?', opts: ['(cos t − t sin t − t² sin t)/(1 + t)²', '(cos t − t sin t)/(1 + t)²', '(cos t − sin t)/(1 + t)', '−sin t/(1 + t)²'], correct: 0, hint: 'Distribute (1 + t) over both terms of (cos t − t sin t).', why: '(1 + t)(cos t − t sin t) − t cos t = cos t − t sin t − t² sin t.'},
  {q: 'd⁴/dx⁴ (cos x) = ?', opts: ['cos x', '−cos x', 'sin x', '−sin x'], correct: 0, hint: 'A full cycle of four.', why: 'Four derivatives bring cos x back.', ref: {panel: 'higher', what: 'the cycle of four', body: '<p>sin → cos → −sin → −cos → sin.</p>'}},
  {q: 'd⁷⁴/dx⁷⁴ (sin x) = ?', opts: ['−sin x', 'sin x', 'cos x', '−cos x'], correct: 0, hint: '74 = 4 · 18 + 2.', why: 'Same as the second derivative.'},
  {q: 'Where does y = sin x have a horizontal tangent on [0, 2π]?', opts: ['x = π/2 and 3π/2', 'x = 0 and π', 'x = π only', 'nowhere'], correct: 0, hint: 'Solve cos x = 0.', why: 'cos x = 0 at π/2 and 3π/2.'}
]);
})();
