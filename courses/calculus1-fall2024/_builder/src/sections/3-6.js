/* Section 3.6 · The Chain Rule (with derivatives of inverse functions) — interactive activities */
(() => {
'use strict';
const {num} = CA;

/* ---------- 01 · rates multiply ---------- */
const CH = [
  {t: 'h(x) = sin(x³)', g: x => x ** 3, dg: x => 3 * x * x, f: Math.sin, df: Math.cos, gT: 'x³', dgT: '3x²', fT: 'sin u', dfT: 'cos u', hT: 'cos(x³) · 3x²', win: {xmin: -1.8, xmax: 1.8, ymin: -1.6, ymax: 1.6}},
  {t: 'h(x) = (3x² + 1)⁵', g: x => 3 * x * x + 1, dg: x => 6 * x, f: u => u ** 5, df: u => 5 * u ** 4, gT: '3x² + 1', dgT: '6x', fT: 'u⁵', dfT: '5u⁴', hT: '5(3x² + 1)⁴ · 6x = 30x(3x² + 1)⁴', win: {xmin: -0.8, xmax: 0.8, ymin: -2, ymax: 60}},
  {t: 'h(x) = √(x² + 9)', g: x => x * x + 9, dg: x => 2 * x, f: Math.sqrt, df: u => 0.5 / Math.sqrt(u), gT: 'x² + 9', dgT: '2x', fT: '√u', dfT: '1/(2√u)', hT: '2x/(2√(x² + 9)) = x/√(x² + 9)', win: {xmin: -6, xmax: 6, ymin: 0, ymax: 8}},
  {t: 'h(x) = cos(5x)', g: x => 5 * x, dg: () => 5, f: Math.cos, df: u => -Math.sin(u), gT: '5x', dgT: '5', fT: 'cos u', dfT: '−sin u', hT: '−5 sin(5x)', win: {xmin: -2, xmax: 2, ymin: -1.6, ymax: 1.6}},
  {t: 'h(x) = 1/(x² + 1)', g: x => x * x + 1, dg: x => 2 * x, f: u => 1 / u, df: u => -1 / (u * u), gT: 'x² + 1', dgT: '2x', fT: '1/u', dfT: '−1/u²', hT: '−2x/(x² + 1)²', win: {xmin: -4, xmax: 4, ymin: -0.3, ymax: 1.3}}
];
CA.lab('chain-lab', {
  controls: [{type: 'select', key: 'p', label: 'Composition', value: '0', options: CH.map((c, i) => [String(i), c.t])}, {type: 'range', key: 'u', label: 'Point x', min: 0, max: 100, step: 1, value: 70, fmt: () => ''}],
  plot: {w: 540, h: 340}, plotLabel: 'Graph of the composition with its tangent line', legend: [['blue', 'y = h(x)'], ['green', 'tangent line']],
  readouts: [['x', 'x'], ['u', 'inside u = g(x)'], ['dg', 'du/dx = g′(x)'], ['df', 'dy/du = f′(u)'], ['h', 'dy/dx = f′(u)·g′(x)'], ['n', 'numerical slope']], steps: true
}, (lab, st) => {
  const C = CH[+st.p], W = C.win, x = W.xmin + (W.xmax - W.xmin) * st.u / 100, h = t => C.f(C.g(t)), u = C.g(x), dg = C.dg(x), df = C.df(u), m = df * dg, P = lab.plane(Object.assign({equal: false}, W));
  P.curve(h, {color: 'blue', width: 3.2, samples: 1200}).lineMB(m, h(x) - m * x, {color: 'green', width: 2.2}).point(x, h(x), {color: 'orange', r: 7}).render();
  lab.read('x', num(x, 3)); lab.read('u', num(u, 4)); lab.read('dg', num(dg, 4)); lab.read('df', num(df, 4)); lab.read('h', num(m, 5)); lab.read('n', num(CA.deriv(h, x), 5));
  lab.steps([['Inside and outside', `u = g(x) = ${C.gT}, y = f(u) = ${C.fT}`], ['Differentiate each', `du/dx = ${C.dgT}, dy/du = ${C.dfT}`], ['Multiply, then write u in terms of x', `h′(x) = ${C.hT}`]]);
  lab.out(`At this x the inside changes ${num(dg, 3)} times as fast as x, and the outside changes ${num(df, 3)} times as fast as u. Together: ${num(df, 3)} × ${num(dg, 3)} = ${num(m, 4)}.`);
});

/* ---------- 02 · patterns ---------- */
CA.stepLab('chain-steps', [
  {t: 'y = (x² − 3x + 1)⁴', res: 'y′ = 4(x² − 3x + 1)³(2x − 3)', check: ['(x^2 - 3x + 1)^4', '4(x^2 - 3x + 1)^3 (2x - 3)', 1.3], steps: [['Power of a function', 'outside u⁴, inside u = x² − 3x + 1'], ['Chain rule', '4u³ · du/dx'], ['Result', '4(x² − 3x + 1)³(2x − 3)']]},
  {t: 'y = sin⁵x', res: 'y′ = 5 sin⁴x cos x', check: ['sin(x)^5', '5sin(x)^4 cos(x)', 0.7], steps: [['Rewrite', 'sin⁵x = (sin x)⁵'], ['Power of a function', '5(sin x)⁴ · (sin x)′'], ['Result', '5 sin⁴x cos x']]},
  {t: 'y = sin 3x', res: 'y′ = 3 cos 3x', check: ['sin(3x)', '3cos(3x)', 0.4], steps: [['A multiple inside', 'outside sin u, inside u = 3x'], ['Chain rule', 'cos(3x) · 3'], ['Result', '3 cos 3x']]},
  {t: 'y = cos(x²)', res: 'y′ = −2x sin(x²)', check: ['cos(x^2)', '-2x sin(x^2)', 1.1], steps: [['Inside and outside', 'outside cos u, inside u = x²'], ['Chain rule', '−sin(x²) · 2x'], ['Result', '−2x sin(x²)']]},
  {t: 'y = √(1 + sin x)', res: 'y′ = cos x/(2√(1 + sin x))', check: ['sqrt(1 + sin(x))', 'cos(x)/(2sqrt(1 + sin(x)))', 0.8], steps: [['Rewrite', '(1 + sin x)<sup>1/2</sup>'], ['Chain rule', '(1/2)(1 + sin x)<sup>−1/2</sup> · cos x'], ['Result', 'cos x/(2√(1 + sin x))']]},
  {t: 'y = sin(cos(x²)) (chain three times)', res: 'y′ = −2x sin(x²) cos(cos(x²))', check: ['sin(cos(x^2))', '-2x sin(x^2) cos(cos(x^2))', 0.9], steps: [['Three layers', 'sin( cos( x² ) )'], ['Outside', 'cos(cos(x²)) · (cos(x²))′'], ['Middle', '(cos(x²))′ = −sin(x²) · (x²)′'], ['Inside', '(x²)′ = 2x'], ['Multiply', '−2x sin(x²) cos(cos(x²))']]},
  {t: 'y = (2x + 1)³(x − 1)² (product and chain)', res: 'y′ = 2(2x + 1)²(x − 1)(5x − 2)', check: ['(2x + 1)^3 (x - 1)^2', '2(2x + 1)^2 (x - 1)(5x - 2)', 1.4], steps: [['Product rule', '[(2x + 1)³]′(x − 1)² + (2x + 1)³[(x − 1)²]′'], ['Chain rule on each power', '3(2x + 1)² · 2 · (x − 1)² + (2x + 1)³ · 2(x − 1)'], ['Factor 2(2x + 1)²(x − 1)', '2(2x + 1)²(x − 1)[3(x − 1) + (2x + 1)]'], ['Simplify', '2(2x + 1)²(x − 1)(5x − 2)']]}
]);

/* ---------- 03 · table of values ---------- */
CA.stepLab('table-steps', [
  {t: 'h(x) = f(sin²(g(x))), find h′(0)', res: 'h′(0) = 8√3 ≈ 13.856', steps: [['Layers', 'f( [sin( g(x) )]² )'], ['Chain rule', 'h′(x) = f′(sin²(g(x))) · 2 sin(g(x)) · cos(g(x)) · g′(x)'], ['Table at 0', 'g(0) = π/6, g′(0) = 1; sin(π/6) = 1/2, cos(π/6) = √3/2, sin²(π/6) = 1/4'], ['Table again', 'f′(1/4) = 16'], ['Multiply', 'h′(0) = 16 · 2 · (1/2) · (√3/2) · 1 = 8√3']]},
  {t: 'k(x) = g(1 + [f(x)]²), find k′(0)', res: 'k′(0) = −40', steps: [['Chain rule', 'k′(x) = g′(1 + [f(x)]²) · 2f(x) · f′(x)'], ['Table at 0', 'f(0) = −1, f′(0) = 4, so 1 + [f(0)]² = 2'], ['Table again', 'g′(2) = 5'], ['Multiply', 'k′(0) = 5 · 2(−1) · 4 = −40']]},
  {t: 'p(x) = g(f(x)), find p′(1/4)', res: 'p′(1/4) = 80', steps: [['Chain rule', 'p′(x) = g′(f(x)) · f′(x)'], ['Table at 1/4', 'f(1/4) = 2, f′(1/4) = 16'], ['Table again', 'g′(2) = 5'], ['Multiply', 'p′(1/4) = 5 · 16 = 80']]},
  {t: 'q(x) = [f(x)]³, find q′(0)', res: 'q′(0) = 12', steps: [['Power of a function', 'q′(x) = 3[f(x)]² · f′(x)'], ['Table at 0', 'f(0) = −1, f′(0) = 4'], ['Multiply', 'q′(0) = 3(1)(4) = 12']]},
  {t: 'r(x) = f(4x), find r′(0)', res: 'r′(0) = 16', steps: [['A multiple inside', 'r′(x) = 4f′(4x)'], ['At 0', '4x = 0, f′(0) = 4'], ['Multiply', 'r′(0) = 16']]},
  {t: 's(x) = g(x²), find s′(1/2)', res: 's′(1/2) = 8/5', steps: [['Chain rule', 's′(x) = g′(x²) · 2x'], ['At x = 1/2', 'x² = 1/4, g′(1/4) = 8/5'], ['Multiply', 's′(1/2) = (8/5) · 2 · (1/2) = 8/5']]}
]);

/* ---------- 04 · inverse functions ---------- */
const IN = [
  {t: 'f(x) = x³ + 1 and f⁻¹(x) = ∛(x − 1)', f: x => x ** 3 + 1, df: x => 3 * x * x, fi: x => Math.cbrt(x - 1), a0: -1.6, a1: 1.6, win: {xmin: -3, xmax: 5, ymin: -3, ymax: 5}},
  {t: 'f(x) = sin x on [−π/2, π/2] and sin⁻¹x', f: Math.sin, df: Math.cos, fi: Math.asin, a0: -1.5, a1: 1.5, win: {xmin: -2, xmax: 2, ymin: -2, ymax: 2}},
  {t: 'f(x) = tan x on (−π/2, π/2) and tan⁻¹x', f: Math.tan, df: x => 1 / Math.cos(x) ** 2, fi: Math.atan, a0: -1.3, a1: 1.3, win: {xmin: -4, xmax: 4, ymin: -4, ymax: 4}, br: [-Math.PI / 2, Math.PI / 2]},
  {t: 'f(x) = eˣ and f⁻¹(x) = ln x', f: Math.exp, df: Math.exp, fi: Math.log, a0: -2, a1: 1.5, win: {xmin: -3, xmax: 5, ymin: -3, ymax: 5}},
  {t: 'f(x) = x² on [0, ∞) and √x', f: x => x * x, df: x => 2 * x, fi: Math.sqrt, a0: 0.1, a1: 2, win: {xmin: -0.5, xmax: 4.5, ymin: -0.5, ymax: 4.5}, lo: 0}
];
CA.lab('invd-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function and inverse', value: '1', options: IN.map((v, i) => [String(i), v.t])}, {type: 'range', key: 'u', label: 'Point a on f', min: 0, max: 100, step: 1, value: 90, fmt: () => ''}],
  plot: {w: 520, h: 460}, plotLabel: 'A function, its inverse, and tangent lines at mirror points', legend: [['blue', 'y = f(x)'], ['purple', 'y = f⁻¹(x)'], ['gray', 'y = x', true]],
  readouts: [['p', '(a, f(a)) on f'], ['q', '(f(a), a) on f⁻¹'], ['m1', 'slope of f at a'], ['m2', 'slope of f⁻¹ at f(a)']]
}, (lab, st) => {
  const I = IN[+st.p], a = I.a0 + (I.a1 - I.a0) * st.u / 100, b = I.f(a), m = I.df(a), P = lab.plane(Object.assign({equal: true}, I.win));
  P.lineMB(1, 0, {color: 'gray', dash: '7 6', width: 1.6});
  P.curve(I.f, {color: 'blue', width: 3, from: I.lo ?? (st.p === '1' ? -Math.PI / 2 : st.p === '2' ? -Math.PI / 2 + 0.02 : I.win.xmin), to: st.p === '1' ? Math.PI / 2 : st.p === '2' ? Math.PI / 2 - 0.02 : I.win.xmax, breaks: I.br || []});
  P.curve(I.fi, {color: 'purple', width: 3, from: st.p === '4' ? 0 : st.p === '3' ? 0.01 : I.win.xmin, to: I.win.xmax});
  P.lineMB(m, b - m * a, {color: 'blue', width: 1.6, dash: '5 4'}).lineMB(1 / m, a - b / m, {color: 'purple', width: 1.6, dash: '5 4'});
  P.seg(a, b, b, a, {color: 'gray', dash: '2 4', width: 1.2}).point(a, b, {color: 'blue', r: 7}).point(b, a, {color: 'purple', r: 7}).render();
  lab.read('p', `(${num(a, 3)}, ${num(b, 3)})`); lab.read('q', `(${num(b, 3)}, ${num(a, 3)})`); lab.read('m1', num(m, 4)); lab.read('m2', `1/${num(m, 4)} = ${num(1 / m, 4)} (numerical ${num(CA.deriv(I.fi, b), 4)})`);
  lab.out(`Mirror points have reciprocal slopes: (f⁻¹)′(${num(b, 3)}) = 1/f′(${num(a, 3)}). ${st.p === '1' ? 'With b = sin a, this is 1/cos a = 1/√(1 − b²): the formula for (sin⁻¹x)′.' : st.p === '3' ? 'With b = eᵃ, this is 1/eᵃ = 1/b: so (ln x)′ = 1/x.' : st.p === '2' ? 'With b = tan a, this is 1/sec²a = 1/(1 + b²): the formula for (tan⁻¹x)′.' : ''}`);
});

CA.stepLab('invtrig-steps', [
  {t: '(sin⁻¹x)′', res: '1/√(1 − x²)', check: ['arcsin(x)', '1/sqrt(1 - x^2)', 0.5], steps: [['Start from the identity', 'sin(sin⁻¹x) = x for −1 ≤ x ≤ 1'], ['Differentiate both sides (chain rule)', 'cos(sin⁻¹x) · (sin⁻¹x)′ = 1'], ['Solve', '(sin⁻¹x)′ = 1/cos(sin⁻¹x)'], ['Simplify the cosine', 'θ = sin⁻¹x is in [−π/2, π/2], so cos θ = √(1 − sin²θ) = √(1 − x²)'], ['Result', '(sin⁻¹x)′ = 1/√(1 − x²)']]},
  {t: '(tan⁻¹x)′', res: '1/(1 + x²)', check: ['arctan(x)', '1/(1 + x^2)', 0.8], steps: [['Identity', 'tan(tan⁻¹x) = x'], ['Differentiate', 'sec²(tan⁻¹x) · (tan⁻¹x)′ = 1'], ['Use 1 + tan²θ = sec²θ', 'sec²(tan⁻¹x) = 1 + x²'], ['Result', '(tan⁻¹x)′ = 1/(1 + x²)']]},
  {t: 'd/dx sin⁻¹(x²)', res: '2x/√(1 − x⁴)', check: ['arcsin(x^2)', '2x/sqrt(1 - x^4)', 0.6], steps: [['Chain rule', '1/√(1 − (x²)²) · (x²)′'], ['Result', '2x/√(1 − x⁴)']]},
  {t: 'd/dx tan⁻¹(3x)', res: '3/(1 + 9x²)', check: ['arctan(3x)', '3/(1 + 9x^2)', 0.4], steps: [['Chain rule', '1/(1 + (3x)²) · 3'], ['Result', '3/(1 + 9x²)']]},
  {t: 'd/dx (x² tan⁻¹x)', res: '2x tan⁻¹x + x²/(1 + x²)', check: ['x^2 arctan(x)', '2x arctan(x) + x^2/(1 + x^2)', 1.2], steps: [['Product rule', '2x tan⁻¹x + x² · 1/(1 + x²)']]}
]);

/* ---------- 05 · check ---------- */
CA.derivCheckLab('chain-check', {f: 'sin(x^3)', df: '3x^2 cos(x^3)', win: {xmin: -2, xmax: 2}});

/* ---------- guided problems ---------- */
CA.guided('36', [
  {q: 'd/dx (5x − 2)⁸ = ?', opts: ['40(5x − 2)⁷', '8(5x − 2)⁷', '40x(5x − 2)⁷', '5(5x − 2)⁸'], correct: 0, hint: 'Outside u⁸, inside 5x − 2.', why: '8(5x − 2)⁷ · 5.', ref: {panel: 'chain', what: 'the chain rule', body: '<p>(f(g(x)))′ = f′(g(x)) · g′(x).</p>'}},
  {q: 'd/dx sin(x³) = ?', opts: ['3x² cos(x³)', 'cos(3x²)', 'cos(x³)', '3x² sin(x³)'], correct: 0, hint: 'Derivative of the outside at the inside, times the derivative of the inside.', why: 'cos(x³) · 3x².'},
  {q: 'd/dx cos(4x) = ?', opts: ['−4 sin(4x)', '4 sin(4x)', '−sin(4x)', '−4 cos(4x)'], correct: 0, hint: 'g(mx) pattern.', why: '−sin(4x) · 4.', ref: {panel: 'patterns', what: 'the common chain-rule patterns', body: '<p>d/dx g(mx) = m g′(mx).</p>'}},
  {q: 'd/dx √(x² + 9) = ?', opts: ['x/√(x² + 9)', '1/(2√(x² + 9))', '2x√(x² + 9)', 'x/(x² + 9)'], correct: 0, hint: '(1/2)(x² + 9)<sup>−1/2</sup> · 2x.', why: 'The 2s cancel.'},
  {q: 'd/dx sin²x = ?', opts: ['2 sin x cos x', '2 sin x', 'cos²x', '2 cos x'], correct: 0, hint: '(sin x)².', why: '2 sin x · cos x (= sin 2x).'},
  {q: 'With the table, (g ∘ f)′(1/4) = ?', opts: ['80', '16', '5', '8/5'], correct: 0, hint: 'g′(f(1/4)) · f′(1/4).', why: 'g′(2) · 16 = 5 · 16.', ref: {panel: 'table', what: 'the table of values', body: '<p>x = 1/4: f = 2, g = 4/3, f′ = 16, g′ = 8/5; x = 0: f = −1, g = π/6, f′ = 4, g′ = 1; x = 2: f = 0, g = 3, f′ = 0, g′ = 5.</p>'}},
  {q: 'With the table, d/dx [f(x)]² at x = 0 is:', opts: ['−8', '8', '4', '−2'], correct: 0, hint: '2f(0)f′(0).', why: '2(−1)(4) = −8.'},
  {q: 'If f(2) = 5 and f′(2) = 3, then (f⁻¹)′(5) = ?', opts: ['1/3', '3', '1/5', '1/2'], correct: 0, hint: '(f⁻¹)′(5) = 1/f′(f⁻¹(5)).', why: 'f⁻¹(5) = 2, so 1/f′(2) = 1/3.', ref: {panel: 'inverse', what: 'derivatives of inverse functions', body: '<p>(f⁻¹)′(x) = 1/f′(f⁻¹(x)).</p>'}},
  {q: 'd/dx tan⁻¹(x²) = ?', opts: ['2x/(1 + x⁴)', '1/(1 + x⁴)', '2x/(1 + x²)', '1/(1 + 4x²)'], correct: 0, hint: 'Chain rule with (tan⁻¹u)′ = 1/(1 + u²).', why: '2x/(1 + (x²)²).'},
  {q: 'd/dx sec⁻¹x for x &lt; −1 is:', opts: ['positive: 1/(|x|√(x² − 1))', 'negative: 1/(x√(x² − 1))', 'zero', 'undefined'], correct: 0, hint: 'sec⁻¹ is increasing on its domain.', why: 'The absolute value keeps the derivative positive.'}
]);
})();
