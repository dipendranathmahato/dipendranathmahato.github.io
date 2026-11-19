/* Section 7.1 · Solving Trigonometric Equations with Identities (verifying and simplifying) — interactive activities */
(() => {
'use strict';
const {fmt, num, F} = CA;
const PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, sec = x => 1 / cos(x), csc = x => 1 / sin(x), cot = x => cos(x) / sin(x);

/* ---------- 01 · graph both sides ---------- */
const IDS = [
  ['sin²x + cos²x = 1', x => sin(x) ** 2 + cos(x) ** 2, x => 1, true], ['1 + tan²x = sec²x', x => 1 + tan(x) ** 2, x => sec(x) ** 2, true], ['1 + cot²x = csc²x', x => 1 + cot(x) ** 2, x => csc(x) ** 2, true],
  ['tan x = sin x / cos x', tan, x => sin(x) / cos(x), true], ['cot x = 1 / tan x', cot, x => 1 / tan(x), true], ['cos(−x) = cos x', x => cos(-x), cos, true], ['sin(−x) = −sin x', x => sin(-x), x => -sin(x), true],
  ['csc θ cos θ tan θ = 1', x => csc(x) * cos(x) * tan(x), x => 1, true], ['(1 − cos θ)(1 + cos(−θ)) = sin²θ', x => (1 - cos(x)) * (1 + cos(-x)), x => sin(x) ** 2, true],
  ['sin²x − cos²x = 1 (not an identity)', x => sin(x) ** 2 - cos(x) ** 2, x => 1, false], ['(sin x + cos x)² = 1 (not an identity)', x => (sin(x) + cos(x)) ** 2, x => 1, false]
];
CA.lab('tk-lab', {
  controls: [{type: 'select', key: 'i', label: 'Equation', value: '1', options: IDS.map((d, i) => [String(i), d[0]])}, {type: 'range', key: 'x', label: 'Test x =', min: -180, max: 180, step: 5, value: 40, fmt: v => v + '°'}],
  plot: {xmin: -2 * PI, xmax: 2 * PI, ymin: -3, ymax: 5, xpi: F(1, 2), w: 620, h: 340}, plotLabel: 'Graphs of the left and right sides', legend: [['orange', 'left side'], ['blue', 'right side', true]], readouts: [['L', 'Left side'], ['R', 'Right side']]
}, (lab, st) => {
  const [t, L, R, isId] = IDS[+st.i], x = st.x * PI / 180, P = lab.plane(), lv = L(x), rv = R(x), bad = v => !Number.isFinite(v) || Math.abs(v) > 1e8;
  P.curve(L, {color: 'orange', width: 4, samples: 2400}).curve(R, {color: 'blue', width: 2.4, dash: '8 7', samples: 2400}).vline(x, {color: 'gray', width: 1.2});
  if (!bad(lv)) P.point(x, lv, {color: 'orange', r: 6}); if (!bad(rv)) P.point(x, rv, {color: 'blue', r: 4}); P.render();
  lab.read('L', bad(lv) ? 'undefined' : num(lv, 5)); lab.read('R', bad(rv) ? 'undefined' : num(rv, 5));
  lab.out(bad(lv) || bad(rv) ? `At x = ${st.x}° one side is undefined, so this x is not in the domain of the identity.` : isId ? `The curves coincide: at x = ${st.x}° both sides equal ${num(lv, 5)}. This supports the identity; the algebra in panel 02 proves it.` : `The curves are different. At x = ${st.x}°, ${num(lv, 4)} ${Math.abs(lv - rv) < 1e-9 ? '=' : '≠'} ${num(rv, 4)}${Math.abs(lv - rv) < 1e-9 ? ' here, but not at most other x' : ''}: this equation is <b>not</b> an identity.`, isId ? '' : 'ca-incorrect');
});

/* ---------- 02 · verify ---------- */
CA.proof('ver-proof', [
  {title: 'csc θ cos θ tan θ = 1', goal: 'Verify <b>csc θ cos θ tan θ = 1</b>.', done: '✓ The left side became 1, the right side. The identity is verified.',
    lines: [['csc θ cos θ tan θ', 'Start with the left side'], ['= (1/sin θ) · cos θ · (sin θ/cos θ)', 'Reciprocal and quotient identities'], ['= (cos θ sin θ)/(sin θ cos θ)', 'Multiply the fractions'], ['= 1', 'Cancel']], lhs: x => csc(x) * cos(x) * tan(x), rhs: x => 1},
  {title: '(1 − cos θ)(1 + cos(−θ)) = sin²θ', goal: 'Verify <b>(1 − cos θ)(1 + cos(−θ)) = sin²θ</b>.', done: '✓ The left side equals sin²θ. Verified.',
    lines: [['(1 − cos θ)(1 + cos(−θ))', 'Start with the left side'], ['= (1 − cos θ)(1 + cos θ)', 'Cosine is even'], ['= 1 − cos²θ', 'Difference of squares'], ['= sin²θ', 'Pythagorean identity']], lhs: x => (1 - cos(x)) * (1 + cos(-x)), rhs: x => sin(x) ** 2},
  {title: '(csc²θ − 1)/csc²θ = cos²θ', goal: 'Verify <b>(csc²θ − 1)/csc²θ = cos²θ</b>.', done: '✓ The left side equals cos²θ. Verified.',
    lines: [['(csc²θ − 1)/csc²θ', 'Start with the left side'], ['= ((1 + cot²θ) − 1)/csc²θ', 'Pythagorean identity: csc²θ = 1 + cot²θ'], ['= cot²θ / csc²θ', 'Simplify the numerator'], ['= (cos²θ/sin²θ) ÷ (1/sin²θ)', 'Quotient and reciprocal identities'], ['= (cos²θ/sin²θ) · sin²θ', 'Divide by multiplying by the reciprocal'], ['= cos²θ', 'Cancel sin²θ']], lhs: x => (csc(x) ** 2 - 1) / csc(x) ** 2, rhs: x => cos(x) ** 2},
  {title: 'cot θ / csc θ = cos θ', goal: 'Verify <b>cot θ / csc θ = cos θ</b>.', done: '✓ Verified.',
    lines: [['cot θ / csc θ', 'Start with the left side'], ['= (cos θ/sin θ) ÷ (1/sin θ)', 'Quotient and reciprocal identities'], ['= (cos θ/sin θ) · sin θ', 'Multiply by the reciprocal'], ['= cos θ', 'Cancel sin θ']], lhs: x => cot(x) / csc(x), rhs: cos},
  {title: '(1 − cos²θ)(1 + cot²θ) = 1', goal: 'Verify <b>(1 − cos²θ)(1 + cot²θ) = 1</b>.', done: '✓ Verified.',
    lines: [['(1 − cos²θ)(1 + cot²θ)', 'Start with the left side'], ['= sin²θ · csc²θ', 'Two Pythagorean identities'], ['= sin²θ · (1/sin²θ)', 'Reciprocal identity'], ['= 1', 'Cancel']], lhs: x => (1 - cos(x) ** 2) * (1 + cot(x) ** 2), rhs: x => 1}
], {label: 'Identity'});

/* ---------- 03 · simplify ---------- */
CA.proof('sim-proof', [
  {title: '1/(1 − cos x) − cos x/(1 + cos x)', goal: 'Simplify <b>1/(1 − cos x) − cos x/(1 + cos x)</b>.', done: '✓ Simplified to <b>1 + 2cot²x</b> (equivalently (1 + cos²x)/sin²x).',
    lines: [['1/(1 − cos x) − cos x/(1 + cos x)', 'Start'], ['= [1(1 + cos x) − cos x(1 − cos x)] / [(1 − cos x)(1 + cos x)]', 'Common denominator (1 − cos x)(1 + cos x)'], ['= (1 + cos x − cos x + cos²x) / (1 − cos²x)', 'Expand'], ['= (1 + cos²x)/sin²x', 'Simplify; Pythagorean identity'], ['= 1/sin²x + cos²x/sin²x', 'Split the fraction'], ['= csc²x + cot²x', 'Reciprocal and quotient identities'], ['= (1 + cot²x) + cot²x = 1 + 2cot²x', 'Pythagorean identity']],
    lhs: x => 1 / (1 - cos(x)) - cos(x) / (1 + cos(x)), rhs: x => 1 + 2 * cot(x) ** 2},
  {title: '1/(sin x cos x) − cot x', goal: 'Simplify <b>1/(sin x cos x) − cot x</b>.', done: '✓ Simplified to <b>tan x</b>.',
    lines: [['1/(sin x cos x) − cot x', 'Start'], ['= 1/(sin x cos x) − cos x/sin x', 'Quotient identity'], ['= 1/(sin x cos x) − cos²x/(sin x cos x)', 'Common denominator sin x cos x'], ['= (1 − cos²x)/(sin x cos x)', 'Subtract'], ['= sin²x/(sin x cos x)', 'Pythagorean identity'], ['= sin x/cos x = tan x', 'Cancel sin x; quotient identity']],
    lhs: x => 1 / (sin(x) * cos(x)) - cot(x), rhs: tan},
  {title: 'cos x (tan(−x) + sec(−x))', goal: 'Simplify <b>cos x (tan(−x) + sec(−x))</b>.', done: '✓ Simplified to <b>1 − sin x</b>.',
    lines: [['cos x (tan(−x) + sec(−x))', 'Start'], ['= cos x (−tan x + sec x)', 'tan is odd, sec is even'], ['= −cos x · (sin x/cos x) + cos x · (1/cos x)', 'Distribute; quotient and reciprocal identities'], ['= −sin x + 1 = 1 − sin x', 'Cancel']],
    lhs: x => cos(x) * (tan(-x) + sec(-x)), rhs: x => 1 - sin(x)}
], {label: 'Expression'});

/* ---------- 04 · identity or not ---------- */
CA.cards('id-cards', [
  {expr: 'sin²x − cos²x = 1', correct: 1, why: 'At x = 0: 0 − 1 = −1 ≠ 1. One counterexample is enough.'},
  {expr: '(1 − cos x)(1 + cos x) = sin²x', correct: 0, why: 'Difference of squares gives 1 − cos²x = sin²x.'},
  {expr: 'sec x − cos x = sin x tan x', correct: 0, why: 'sec x − cos x = (1 − cos²x)/cos x = sin²x/cos x = sin x · (sin x/cos x).'},
  {expr: 'sin(2x) = 2 sin x', correct: 1, why: 'At x = π/2: sin π = 0 but 2 sin(π/2) = 2. (The correct formula, in 7.3, is sin 2x = 2 sin x cos x.)'},
  {expr: 'csc²x − cot²x = 1', correct: 0, why: 'Rearranged Pythagorean identity: 1 + cot²x = csc²x.'},
  {expr: 'cos(−x) = −cos x', correct: 1, why: 'Cosine is even: cos(−x) = cos x. At x = 0, 1 ≠ −1.'}
], {options: ['Identity', 'Not an identity']});

/* ---------- guided problems ---------- */
CA.guided('71', [
  {q: 'Which equation is a Pythagorean identity?', opts: ['1 + tan²x = sec²x', '1 + sec²x = tan²x', 'sin²x − cos²x = 1', 'tan²x + cot²x = 1'], correct: 0, hint: 'Divide sin²x + cos²x = 1 by cos²x.', why: 'sin²x/cos²x + cos²x/cos²x = 1/cos²x gives tan²x + 1 = sec²x.'},
  {q: 'csc θ cos θ tan θ simplifies to…', opts: ['1', 'sin θ', 'cos²θ', 'sec θ'], correct: 0, hint: 'Write each factor with sine and cosine.', why: '(1/sin θ) · cos θ · (sin θ/cos θ) = 1.', ref: {panel: 'verify', what: 'the identity csc θ cos θ tan θ = 1', body: '<p>Verify <b>csc θ cos θ tan θ = 1</b>.</p>'}},
  {q: '(1 − cos θ)(1 + cos(−θ)) equals…', opts: ['sin²θ', 'cos²θ', '1', '1 − 2cos θ'], correct: 0, hint: 'cos(−θ) = cos θ, then a difference of squares.', why: '(1 − cos θ)(1 + cos θ) = 1 − cos²θ = sin²θ.'},
  {q: '(csc²θ − 1)/csc²θ equals…', opts: ['cos²θ', 'sin²θ', 'cot²θ', '1'], correct: 0, hint: 'csc²θ − 1 = cot²θ.', why: 'cot²θ/csc²θ = (cos²θ/sin²θ) · sin²θ = cos²θ.'},
  {q: 'cot θ / csc θ equals…', opts: ['cos θ', 'sin θ', 'tan θ', 'sec θ'], correct: 0, hint: 'Rewrite in sines and cosines.', why: '(cos θ/sin θ) · (sin θ/1) = cos θ.'},
  {q: '(1 − cos²θ)(1 + cot²θ) equals…', opts: ['1', 'sin²θ', 'csc²θ', 'cos²θ'], correct: 0, hint: 'Each factor is a Pythagorean identity in disguise.', why: 'sin²θ · csc²θ = 1.'},
  {q: 'A good first step to verify csc θ cos θ tan θ = 1 is to…', opts: ['rewrite each factor in terms of sin θ and cos θ', 'move the 1 to the left side', 'square both sides', 'replace θ by −θ'], correct: 0, hint: 'Work on one side only.', why: 'Rewriting in sine and cosine exposes the cancellation. Moving terms across the equal sign is not allowed when verifying.'},
  {q: 'Simplify 1/(1 − cos x) − cos x/(1 + cos x).', opts: ['1 + 2cot²x', '1', 'csc²x', '2csc x'], correct: 0, hint: 'Common denominator 1 − cos²x = sin²x.', why: 'The numerator is 1 + cos²x, so the result is (1 + cos²x)/sin²x = csc²x + cot²x = 1 + 2cot²x.', ref: {panel: 'simplify', what: 'the expression 1/(1 − cos x) − cos x/(1 + cos x)', body: '<p>Simplify <b>1/(1 − cos x) − cos x/(1 + cos x)</b>.</p>'}},
  {q: 'Is sin²x − cos²x = 1 an identity?', opts: ['No: at x = 0 the left side is −1', 'Yes: it is the Pythagorean identity', 'Yes, for every x', 'Only when x is in Quadrant I'], correct: 0, hint: 'Try x = 0.', why: 'sin²0 − cos²0 = 0 − 1 = −1 ≠ 1, so it fails for at least one x.'},
  {q: 'Simplify cos x (tan(−x) + sec(−x)).', opts: ['1 − sin x', '1 + sin x', 'sin x − 1', 'cos x − 1'], correct: 0, hint: 'tan is odd, sec is even.', why: 'cos x(−tan x + sec x) = −sin x + 1.'}
]);
})();
