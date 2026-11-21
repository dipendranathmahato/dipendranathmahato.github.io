/* Section 4.10 · Antiderivatives — interactive activities */
(() => {
'use strict';
const {num} = CA;

/* slope field: short segments with slope f(x) */
const field = (P, f, o, nx = 22, ny = 14) => {
  const dx = (o.xmax - o.xmin) / nx, dy = (o.ymax - o.ymin) / ny, sx = (P.R - P.L) / (o.xmax - o.xmin), sy = (P.B - P.T) / (o.ymax - o.ymin);
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
    const x = o.xmin + i * dx, y = o.ymin + j * dy, m = f(x); if (!Number.isFinite(m)) continue;
    const ang = Math.atan(m * sy / sx), L = Math.min(dx, dy * sx / sy) * 0.36, ux = Math.cos(ang) * L, uy = Math.sin(ang) * L * sx / sy;
    P.seg(x - ux, y - uy, x + ux, y + uy, {color: 'gray', width: 1.4});
  }
};

/* ---------- 01 · family ---------- */
const FAM = [
  {t: 'f(x) = x²', f: x => x * x, F: x => x ** 3 / 3, FT: 'x³/3 + C', win: {xmin: -3, xmax: 3, ymin: -6, ymax: 6}},
  {t: 'f(x) = 5 cos 3x', f: x => 5 * Math.cos(3 * x), F: x => 5 / 3 * Math.sin(3 * x), FT: '(5/3) sin 3x + C', win: {xmin: -3.2, xmax: 3.2, ymin: -5, ymax: 5}},
  {t: 'f(x) = e^(0.5x)', f: x => Math.exp(0.5 * x), F: x => 2 * Math.exp(0.5 * x), FT: '2e<sup>0.5x</sup> + C', win: {xmin: -4, xmax: 3, ymin: -4, ymax: 10}},
  {t: 'f(x) = 1/√x', f: x => x > 0 ? 1 / Math.sqrt(x) : NaN, F: x => x > 0 ? 2 * Math.sqrt(x) : NaN, FT: '2√x + C', win: {xmin: -0.5, xmax: 6, ymin: -3, ymax: 7}},
  {t: 'f(x) = 1/x', f: x => 1 / x, F: x => Math.log(Math.abs(x)), FT: 'ln|x| + C', win: {xmin: -4, xmax: 4, ymin: -4, ymax: 4}, br: [0]},
  {t: 'f(x) = 2x − 1', f: x => 2 * x - 1, F: x => x * x - x, FT: 'x² − x + C', win: {xmin: -3, xmax: 4, ymin: -4, ymax: 8}}
];
CA.lab('family-lab', {
  controls: [{type: 'select', key: 'p', label: 'Integrand', value: '0', options: FAM.map((f, i) => [String(i), f.t])}, {type: 'range', key: 'C', label: 'C =', min: -4, max: 4, step: 0.25, value: 0}, {type: 'check', key: 'all', label: 'Show several members of the family', value: true}],
  plot: {w: 560, h: 380}, plotLabel: 'Slope field with antiderivative curves', legend: [['gray', 'slopes f(x)'], ['blue', 'y = F(x) + C'], ['purple', 'other members', true]], readouts: [['F', 'general antiderivative'], ['chk', 'slope of the curve at x = 1 vs f(1)']]
}, (lab, st) => {
  const A = FAM[+st.p], P = lab.plane(Object.assign({equal: false}, A.win));
  field(P, A.f, P.o);
  if (st.all) for (let k = -4; k <= 4; k += 2) if (k !== st.C) P.curve(x => A.F(x) + k, {color: 'purple', width: 1.6, dash: '6 5', breaks: A.br || []});
  P.curve(x => A.F(x) + st.C, {color: 'blue', width: 3.4, breaks: A.br || []}).render();
  lab.read('F', A.FT); lab.read('chk', `${num(CA.deriv(x => A.F(x) + st.C, 1), 5)} = ${num(A.f(1), 5)}`);
  lab.out('Every curve in the family has the same slope at the same x; they differ only by a vertical shift C.');
});

/* ---------- 02 · guess and adjust ---------- */
CA.stepLab('anti-steps', [
  {t: '∫ x² dx', res: 'x³/3 + C', check: ['x^3/3', 'x^2', 1.3], steps: [['Guess the form', 'the power goes down by 1 when differentiating, so try F = Ax³'], ['Differentiate', 'F′ = 3Ax²'], ['Match', '3A = 1 ⇒ A = 1/3'], ['Add C', 'x³/3 + C']]},
  {t: '∫ 5 cos 3x dx', res: '(5/3) sin 3x + C', check: ['(5/3)sin(3x)', '5cos(3x)', 0.7], steps: [['Guess the form', 'derivatives of trig functions are trig functions: try A sin 3x + B cos 3x'], ['Differentiate', '3A cos 3x − 3B sin 3x'], ['Match with 5 cos 3x + 0 sin 3x', '3A = 5, −3B = 0 ⇒ A = 5/3, B = 0'], ['Add C', '(5/3) sin 3x + C']]},
  {t: '∫ e^(mx) dx (m ≠ 0)', res: 'e<sup>mx</sup>/m + C', check: ['e^(2x)/2', 'e^(2x)', 0.4], note: 'Checked with m = 2.', steps: [['Guess the form', 'try A e<sup>mx</sup>'], ['Differentiate', 'Am e<sup>mx</sup>'], ['Match', 'Am = 1 ⇒ A = 1/m'], ['Add C', 'e<sup>mx</sup>/m + C']]},
  {t: '∫ 1/√x dx', res: '2√x + C', check: ['2sqrt(x)', '1/sqrt(x)', 1.5], steps: [['Rewrite', 'x<sup>−1/2</sup> (n = −1/2 ≠ −1)'], ['Power rule backwards', 'x<sup>1/2</sup>/(1/2) + C'], ['Simplify', '2√x + C']]},
  {t: '∫ (3x² − 4/x + 2eˣ) dx', res: 'x³ − 4 ln|x| + 2eˣ + C', check: ['x^3 - 4ln(abs(x)) + 2e^x', '3x^2 - 4/x + 2e^x', 1.2], steps: [['Term by term', '3∫x² dx − 4∫(1/x) dx + 2∫eˣ dx'], ['Formulas', '3(x³/3) − 4 ln|x| + 2eˣ'], ['One constant is enough', 'x³ − 4 ln|x| + 2eˣ + C']]},
  {t: '∫ (sec²x + 1/(1 + x²)) dx', res: 'tan x + tan⁻¹x + C', check: ['tan(x) + arctan(x)', '1/cos(x)^2 + 1/(1 + x^2)', 0.5], steps: [['Read the derivative table backwards', '(tan x)′ = sec²x and (tan⁻¹x)′ = 1/(1 + x²)'], ['Result', 'tan x + tan⁻¹x + C']]}
]);

/* ---------- 03 · check ---------- */
CA.lab('anti-check', {
  controls: [{type: 'text', key: 'f', label: 'integrand f(x) =', value: '5cos(3x)'}, {type: 'text', key: 'F', label: 'your F(x) =', value: '(5/3)sin(3x)'}],
  plot: {xmin: -3, xmax: 3, ymin: -6, ymax: 6, w: 540, h: 300, equal: false}, plotLabel: 'f and the derivative of your F', legend: [['purple', 'f(x)'], ['orange', 'F′(x), numerical', true]], readouts: [['v', 'verdict']]
}, (lab, st) => {
  const f = CA.expr(st.f), F = CA.expr(st.F);
  if (!f || !F) { lab.plane().render(); lab.read('v', '—'); lab.out('Type both functions.', 'ca-incorrect'); return; }
  const dF = x => CA.deriv(F.f, x); let worst = 0, used = 0, at = 0;
  for (let i = 0; i < 61; i++) { const x = -3 + 6 * (i + 0.37) / 61, a = f.f(x), b = dF(x); if (!Number.isFinite(a) || !Number.isFinite(F.f(x)) || Math.abs(a) > 1e6) continue; used++; const e = Number.isFinite(b) ? Math.abs(a - b) / Math.max(1, Math.abs(a)) : Infinity; if (e > worst) { worst = e; at = x; } }
  const Y = CA.fitY(f.f, -3, 3, {clip: 60}), P = lab.plane({ymin: Y.ymin, ymax: Y.ymax}); P.curve(f.f, {color: 'purple', width: 4.5}).curve(dF, {color: 'orange', width: 2.2, dash: '7 6'}).render();
  const ok = used > 5 && worst < 1e-4;
  lab.read('v', ok ? '<span class="ca-ok">✓ F′ = f</span>' : '<span class="ca-bad">✕ F′ ≠ f</span>');
  lab.out(ok ? 'Your F is an antiderivative of f (on this window). Remember the + C in the general answer.' : `At x ≈ ${num(at, 3)}: f = ${num(f.f(at), 5)} but F′ ≈ ${num(dF(at), 5)}. Adjust a coefficient and try again.`, ok ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 04 · initial value problems ---------- */
const IV = [
  {t: 'F′(x) = 1/√x, F(1) = 5', F: x => x > 0 ? 2 * Math.sqrt(x) : NaN, x0: 1, y0: 5, C: 3, gT: 'F(x) = 2√x + C', aT: 'F(x) = 2√x + 3', win: {xmin: -0.5, xmax: 8, ymin: -1, ymax: 12}},
  {t: 'F′(x) = 3x² − 2, F(2) = 1', F: x => x ** 3 - 2 * x, x0: 2, y0: 1, C: -3, gT: 'F(x) = x³ − 2x + C', aT: 'F(x) = x³ − 2x − 3', win: {xmin: -2.5, xmax: 3, ymin: -10, ymax: 12}},
  {t: 'F′(x) = cos x, F(π/2) = 0', F: Math.sin, x0: Math.PI / 2, y0: 0, C: -1, gT: 'F(x) = sin x + C', aT: 'F(x) = sin x − 1', win: {xmin: -4, xmax: 6, ymin: -3, ymax: 3}},
  {t: 'v(t) = −32t + 48, s(0) = 6 (height of a ball)', F: t => -16 * t * t + 48 * t, x0: 0, y0: 6, C: 6, gT: 's(t) = −16t² + 48t + C', aT: 's(t) = −16t² + 48t + 6', win: {xmin: -0.3, xmax: 3.4, ymin: -5, ymax: 50}}
];
CA.lab('ivp-lab', {
  controls: [{type: 'select', key: 'p', label: 'Problem', value: '0', options: IV.map((v, i) => [String(i), v.t])}, {type: 'range', key: 'C', label: 'C =', min: -8, max: 8, step: 0.5, value: 0}],
  plot: {w: 540, h: 360}, plotLabel: 'Antiderivative family and the required point', legend: [['blue', 'your choice of C'], ['red', 'required point']], readouts: [['g', 'general antiderivative'], ['v', 'value at the given point'], ['a', 'answer']], steps: true
}, (lab, st, key) => {
  const V = IV[+st.p]; if (key === 'p') st.set('C', 0, true);
  const C = st.C, P = lab.plane(Object.assign({equal: false}, V.win)), hit = Math.abs(C - V.C) < 1e-9;
  for (let k = -8; k <= 8; k += 2) P.curve(x => V.F(x) + k, {color: 'gray', width: 1, dash: '4 6'});
  P.curve(x => V.F(x) + C, {color: hit ? 'green' : 'blue', width: 3.4}).point(V.x0, V.y0, {color: 'red', r: 8}).render();
  lab.read('g', V.gT); lab.read('v', `${num(V.F(V.x0) + C, 4)} (need ${num(V.y0)})`); lab.read('a', hit ? V.aT : '…');
  lab.steps([['General antiderivative', V.gT], ['Use the given value', `${num(V.F(V.x0), 4)} + C = ${num(V.y0)}`], ['Solve for C', hit ? `C = ${num(V.C)}` : 'C = ?']]);
  lab.out(hit ? `C = ${num(V.C)}: the curve passes through the required point. ${V.aT}.` : 'Move C until the curve passes through the red point (or solve for C directly).', hit ? 'ca-correct' : '');
});

/* ---------- guided problems ---------- */
CA.guided('410', [
  {q: '∫ x⁴ dx = ?', opts: ['x⁵/5 + C', '4x³ + C', 'x⁵ + C', '5x⁵ + C'], correct: 0, hint: 'Raise the power by 1 and divide.', why: '(x⁵/5)′ = x⁴.', ref: {panel: 'formulas', what: 'the basic formulas', body: '<p>∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C, n ≠ −1.</p>'}},
  {q: '∫ 1/x dx = ?', opts: ['ln|x| + C', 'x⁰/0 + C', '−1/x² + C', 'ln x² + C'], correct: 0, hint: 'n = −1 is the exception.', why: '(ln|x|)′ = 1/x for x ≠ 0.'},
  {q: '∫ 5 cos 3x dx = ?', opts: ['(5/3) sin 3x + C', '15 sin 3x + C', '5 sin 3x + C', '−(5/3) sin 3x + C'], correct: 0, hint: 'Try A sin 3x.', why: '(A sin 3x)′ = 3A cos 3x = 5 cos 3x.', ref: {panel: 'formulas', what: 'guess, differentiate, adjust', body: '<p>Try a form, differentiate, and match the coefficients.</p>'}},
  {q: '∫ e<sup>4x</sup> dx = ?', opts: ['e<sup>4x</sup>/4 + C', '4e<sup>4x</sup> + C', 'e<sup>4x</sup> + C', 'e<sup>5x</sup>/5 + C'], correct: 0, hint: '∫ e<sup>mx</sup> dx = e<sup>mx</sup>/m + C.', why: 'm = 4.'},
  {q: '∫ (6x² − 2x + 3) dx = ?', opts: ['2x³ − x² + 3x + C', '12x − 2 + C', '6x³ − 2x² + 3x + C', '2x³ − x² + C'], correct: 0, hint: 'Term by term.', why: '6(x³/3) − 2(x²/2) + 3x.'},
  {q: '∫ sec²x dx = ?', opts: ['tan x + C', 'sec x + C', '2 sec x tan x + C', 'sec³x/3 + C'], correct: 0, hint: 'Which function has derivative sec²x?', why: '(tan x)′ = sec²x.'},
  {q: 'If F and G are both antiderivatives of f on an interval, then:', opts: ['F − G is constant', 'F = G', 'F + G = f', 'F′ = G'], correct: 0, hint: '(F − G)′ = 0.', why: 'A function with derivative 0 on an interval is constant.', ref: {panel: 'definition', what: 'the + C', body: '<p>All antiderivatives of f are F(x) + C.</p>'}},
  {q: 'F′(x) = 1/√x and F(1) = 5. Then F(4) = ?', opts: ['7', '9', '5', '4'], correct: 0, hint: 'F(x) = 2√x + 3.', why: '2 · 2 + 3.', ref: {panel: 'ivp', what: 'the initial-value problem', body: '<p>F(x) = 2√x + C with F(1) = 5.</p>'}},
  {q: 'F′(x) = 2x and F(0) = −3. Then F(x) = ?', opts: ['x² − 3', 'x² + 3', '2x − 3', 'x² − 3x'], correct: 0, hint: 'x² + C with C = F(0).', why: 'C = −3.'},
  {q: 'A ball has v(t) = −32t + 48 ft/s and s(0) = 6 ft. Then s(1) = ?', opts: ['38 ft', '16 ft', '22 ft', '54 ft'], correct: 0, hint: 's(t) = −16t² + 48t + 6.', why: '−16 + 48 + 6 = 38.'}
]);
})();
