/* Section 2.4 · Continuity — interactive activities */
(() => {
'use strict';
const {num} = CA;
const ok = b => b ? '<span class="ca-ok">✓ yes</span>' : '<span class="ca-bad">✕ no</span>';

/* ---------- 01 · the three conditions ---------- */
const CT = [
  {t: 'f(x) = (sin x)/x (x ≠ 0), f(0) = 1; a = 0', pieces: [[x => Math.sin(x) / x, -9, 9]], a: 0, fa: '1', lim: '1', i: true, ii: true, iii: true, type: 'continuous', dots: [[0, 1]], holes: [], win: {xmin: -9, xmax: 9, ymin: -0.6, ymax: 1.4}},
  {t: 'f(x) = (x² − 2x)/(x² − 4); a = 2', pieces: [[x => x / (x + 2), -6, -2], [x => x / (x + 2), -2, 6]], a: 2, fa: 'undefined (0/0)', lim: '1/2', i: false, ii: true, iii: false, type: 'removable', dots: [], holes: [[2, 0.5]], win: {xmin: -6, xmax: 6, ymin: -6, ymax: 6}, asy: [-2]},
  {t: 'f(x) = (x² − 2x)/(x² − 4); a = −2', pieces: [[x => x / (x + 2), -6, -2], [x => x / (x + 2), -2, 6]], a: -2, fa: 'undefined', lim: 'does not exist (±∞)', i: false, ii: false, iii: false, type: 'infinite', dots: [], holes: [[2, 0.5]], win: {xmin: -6, xmax: 6, ymin: -6, ymax: 6}, asy: [-2]},
  {t: 'f(x) = x + 1 (x < 1), x² + 3 (x ≥ 1); a = 1', pieces: [[x => x + 1, -3, 1], [x => x * x + 3, 1, 3]], a: 1, fa: '4', lim: 'does not exist (2 from the left, 4 from the right)', i: true, ii: false, iii: false, type: 'jump', dots: [[1, 4]], holes: [[1, 2]], win: {xmin: -3, xmax: 3, ymin: -2, ymax: 10}},
  {t: 'f(x) = x² (x ≠ 1), f(1) = 3; a = 1', pieces: [[x => x * x, -2.5, 2.5]], a: 1, fa: '3', lim: '1', i: true, ii: true, iii: false, type: 'removable', dots: [[1, 3]], holes: [[1, 1]], win: {xmin: -2.5, xmax: 2.5, ymin: -1, ymax: 5}},
  {t: 'f(x) = 3x − 1; a = 2', pieces: [[x => 3 * x - 1, -2, 4]], a: 2, fa: '5', lim: '5', i: true, ii: true, iii: true, type: 'continuous', dots: [[2, 5]], holes: [], win: {xmin: -2, xmax: 4, ymin: -4, ymax: 10}}
];
CA.lab('cont-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function and point', value: '1', options: CT.map((c, i) => [String(i), c.t])}],
  plot: {w: 540, h: 380}, plotLabel: 'Graph of f near x = a', readouts: [['i', '(i) f(a) defined?'], ['ii', '(ii) limit exists?'], ['iii', '(iii) limit = f(a)?'], ['fa', 'f(a)'], ['lim', 'lim x → a'], ['type', 'Verdict']]
}, (lab, st) => {
  const C = CT[+st.p], P = lab.plane(Object.assign({equal: false}, C.win));
  (C.asy || []).forEach(x => P.vline(x, {color: 'red', dash: '7 6', width: 1.4}));
  C.pieces.forEach(([g, a, b]) => P.curve(g, {color: 'blue', width: 3.2, from: a + 1e-6, to: b - 1e-6, samples: 900}));
  P.vline(C.a, {color: 'green', dash: '3 4', width: 1.6});
  C.holes.forEach(([x, y]) => P.point(x, y, {color: 'blue', r: 6, filled: false})); C.dots.forEach(([x, y]) => P.point(x, y, {color: 'blue', r: 6}));
  P.render();
  lab.read('i', ok(C.i)); lab.read('ii', ok(C.ii)); lab.read('iii', C.i && C.ii ? ok(C.iii) : '— (needs (i) and (ii))'); lab.read('fa', C.fa); lab.read('lim', C.lim);
  lab.read('type', C.type === 'continuous' ? '<span class="ca-ok">continuous at a</span>' : `<span class="ca-bad">${C.type} discontinuity</span>`);
  const first = !C.i ? '(i)' : !C.ii ? '(ii)' : !C.iii ? '(iii)' : null;
  lab.out(first ? `Condition ${first} fails, so f is discontinuous at x = ${num(C.a)}: a <b>${C.type}</b> discontinuity.${C.type === 'removable' ? ` Defining f(${num(C.a)}) = ${C.lim} would make f continuous there.` : ''}` : 'All three conditions hold: f is continuous at a. You can draw through this point without lifting the pencil.', first ? 'ca-incorrect' : 'ca-correct');
});

/* ---------- 02 · classify ---------- */
CA.cards('type-cards', [
  {expr: 'f(x) = (x² − 9)/(x − 3) at x = 3', correct: 1, why: 'For x ≠ 3, f(x) = x + 3 → 6, but f(3) is undefined.'},
  {expr: 'f(x) = 1/(x + 1)² at x = −1', correct: 3, why: 'f(x) → +∞ from both sides.'},
  {expr: 'f(x) = |x|/x at x = 0', correct: 2, why: 'Left limit −1, right limit 1.'},
  {expr: 'f(x) = x² + 2x at x = 1', correct: 0, why: 'A polynomial is continuous everywhere.'},
  {expr: 'f(x) = ⌊x⌋ at x = 2', correct: 2, why: 'Left limit 1, right limit 2.'},
  {expr: 'f(x) = tan x at x = π/2', correct: 3, why: 'tan x → +∞ from the left and −∞ from the right.'},
  {expr: 'f(x) = (sin x)/x with f(0) = 0, at x = 0', correct: 1, why: 'The limit is 1 but f(0) = 0.'},
  {expr: 'f(x) = eˣ at x = 0', correct: 0, why: 'Exponential functions are continuous everywhere.'}
], {options: ['continuous', 'removable', 'jump', 'infinite']});

/* ---------- 03 · continuity on an interval ---------- */
const IV = [
  {t: 'f(x) = √(x − 4) on [4, 7)', f: x => Math.sqrt(x - 4), a: 4, b: 7, inclA: true, inclB: false, win: {xmin: 2, xmax: 8, ymin: -0.5, ymax: 2.5}},
  {t: 'f(x) = √(9 − x²) on [−3, 3]', f: x => Math.sqrt(Math.max(0, 9 - x * x)), a: -3, b: 3, inclA: true, inclB: true, win: {xmin: -4, xmax: 4, ymin: -0.5, ymax: 3.8}},
  {t: 'f(x) = ln x on (0, 4]', f: Math.log, a: 0, b: 4, inclA: false, inclB: true, win: {xmin: -0.5, xmax: 5, ymin: -4, ymax: 2}},
  {t: 'f(x) = 1/x on [−3, −0.5]', f: x => 1 / x, a: -3, b: -0.5, inclA: true, inclB: true, win: {xmin: -3.5, xmax: 0.5, ymin: -2.5, ymax: 0.5}}
];
CA.lab('interval-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function and interval', value: '0', options: IV.map((v, i) => [String(i), v.t])}, {type: 'range', key: 'u', label: 'Point t in the interval', min: 0, max: 100, step: 1, value: 0, fmt: v => v + '%'}],
  plot: {w: 520, h: 340}, plotLabel: 'Function on an interval with a moving point', readouts: [['t', 't'], ['ft', 'f(t)'], ['chk', 'What to check'], ['c', 'Continuous at t?']]
}, (lab, st) => {
  const I = IV[+st.p], P = lab.plane(Object.assign({equal: false}, I.win));
  let t = I.a + (I.b - I.a) * st.u / 100; if (!I.inclA && st.u === 0) t = I.a + (I.b - I.a) * 0.01; if (!I.inclB && st.u === 100) t = I.b - (I.b - I.a) * 0.01;
  P.curve(I.f, {color: 'blue', width: 3.4, from: I.a + (I.inclA ? 0 : 1e-3), to: I.b});
  P.point(I.a, Number.isFinite(I.f(I.a)) ? I.f(I.a) : I.win.ymin, {color: 'blue', r: 6, filled: I.inclA && Number.isFinite(I.f(I.a))}).point(I.b, I.f(I.b), {color: 'blue', r: 6, filled: I.inclB});
  P.vline(t, {color: 'green', dash: '3 4', width: 1.4}).point(t, I.f(t), {color: 'orange', r: 7}).render();
  const atA = Math.abs(t - I.a) < 1e-9, atB = Math.abs(t - I.b) < 1e-9;
  lab.read('t', num(t, 3)); lab.read('ft', num(I.f(t), 4));
  lab.read('chk', atA ? `from the right: lim<sub>x→${num(t, 2)}⁺</sub> f(x) = f(${num(t, 2)})` : atB ? `from the left: lim<sub>x→${num(t, 2)}⁻</sub> f(x) = f(${num(t, 2)})` : 'two-sided: lim<sub>x→t</sub> f(x) = f(t)');
  lab.read('c', ok(true));
  lab.out(atA || atB ? `At an included endpoint only one side of the interval is available, so we use a one-sided limit. It equals f(${num(t, 2)}) = ${num(I.f(t), 4)}.` : `At an interior point both sides are available: the limit is f(t) = ${num(I.f(t), 4)}. ${!I.inclA || !I.inclB ? 'The excluded endpoint is not part of the interval, so nothing is checked there.' : ''}`, 'ca-correct');
});

/* ---------- 04 · intermediate value theorem and bisection ---------- */
const IVT = [
  {t: 'cos x = x on [0, π/2]', f: x => Math.cos(x) - x, a: 0, b: Math.PI / 2, aT: '0', bT: 'π/2', fT: 'f(x) = cos x − x', win: {xmin: -0.2, xmax: 1.8, ymin: -1.8, ymax: 1.3}},
  {t: 'x³ − x − 1 = 0 on [1, 2]', f: x => x ** 3 - x - 1, a: 1, b: 2, aT: '1', bT: '2', fT: 'f(x) = x³ − x − 1', win: {xmin: 0.8, xmax: 2.2, ymin: -2, ymax: 6}},
  {t: 'x² = 2 on [1, 2]', f: x => x * x - 2, a: 1, b: 2, aT: '1', bT: '2', fT: 'f(x) = x² − 2', win: {xmin: 0.8, xmax: 2.2, ymin: -1.5, ymax: 2.5}},
  {t: 'eˣ = 3 on [0, 2]', f: x => Math.exp(x) - 3, a: 0, b: 2, aT: '0', bT: '2', fT: 'f(x) = eˣ − 3', win: {xmin: -0.2, xmax: 2.2, ymin: -2.5, ymax: 5}}
];
const bisect = (f, a, b, n) => { const rows = []; for (let k = 0; k < n; k++) { const m = (a + b) / 2, fm = f(m); rows.push([a, b, m, fm]); if (f(a) * fm <= 0) b = m; else a = m; } return {a, b, rows}; };
CA.lab('ivt-lab', {
  controls: [{type: 'select', key: 'p', label: 'Equation', value: '0', options: IVT.map((v, i) => [String(i), v.t])}, {type: 'range', key: 'n', label: 'Bisection steps', min: 0, max: 14, step: 1, value: 3}],
  plot: {w: 540, h: 360}, plotLabel: 'Graph of f with the interval that contains a zero', readouts: [['ends', 'f(a) and f(b)'], ['int', 'Interval now'], ['x0', 'Estimate of x₀']], bottom: '<div id="ivt-table"></div>'
}, (lab, st) => {
  const I = IVT[+st.p], f = I.f, B = bisect(f, I.a, I.b, st.n), P = lab.plane(Object.assign({equal: false}, I.win));
  P.poly([[B.a, I.win.ymin], [B.b, I.win.ymin], [B.b, I.win.ymax], [B.a, I.win.ymax]], {color: 'green', fillOpacity: 0.12, width: 0}).band('x', B.a, B.b, {color: 'green'}).hline(0, {color: 'gray', width: 1}).curve(f, {color: 'blue', width: 3.2});
  P.point(I.a, f(I.a), {color: 'orange', r: 6, label: `f(${I.aT})`}).point(I.b, f(I.b), {color: 'purple', r: 6, label: `f(${I.bT})`});
  P.vline(B.a, {color: 'green', width: 1.6}).vline(B.b, {color: 'green', width: 1.6}).render();
  lab.read('ends', `${num(f(I.a), 4)} and ${num(f(I.b), 4)}`); lab.read('int', `[${num(B.a, 6)}, ${num(B.b, 6)}]`); lab.read('x0', `≈ ${num((B.a + B.b) / 2, 6)} (± ${num((B.b - B.a) / 2, 2)})`);
  document.getElementById('ivt-table').innerHTML = B.rows.length ? `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>step</th><th>interval</th><th>midpoint m</th><th>f(m)</th><th>keep</th></tr>${B.rows.map(([a, b, m, fm], k) => `<tr><td>${k + 1}</td><td>[${num(a, 5)}, ${num(b, 5)}]</td><td>${num(m, 6)}</td><td>${num(fm, 4)}</td><td>${f(a) * fm <= 0 ? 'left half' : 'right half'}</td></tr>`).join('')}</table></div>` : '';
  lab.out(`${I.fT} is continuous on [${I.aT}, ${I.bT}], f(${I.aT}) ${f(I.a) > 0 ? '&gt;' : '&lt;'} 0 and f(${I.bT}) ${f(I.b) > 0 ? '&gt;' : '&lt;'} 0, so by the IVT f has a zero between them. ${st.n ? `After ${st.n} halvings the zero lies in an interval of length ${num(B.b - B.a, 3)}.` : 'Add bisection steps to locate it.'}`, 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('24', [
  {q: 'Which condition fails for f(x) = (x² − 1)/(x − 1) at x = 1?', opts: ['f(1) is not defined', 'the limit does not exist', 'all three hold', 'only (iii)'], correct: 0, hint: 'Substitute x = 1.', why: 'f(1) = 0/0 is undefined (the limit 2 does exist).', ref: {panel: 'definition', what: 'the three conditions', body: '<p>(i) f(a) defined, (ii) the limit exists, (iii) they are equal.</p>'}},
  {q: 'f(x) = x² for x ≠ 2 and f(2) = 1. At x = 2, f has:', opts: ['a removable discontinuity', 'a jump discontinuity', 'an infinite discontinuity', 'no discontinuity'], correct: 0, hint: 'The limit is 4.', why: 'lim = 4 exists but ≠ f(2) = 1.', ref: {panel: 'types', what: 'the types of discontinuity', body: '<p>Removable: the limit exists; jump: one-sided limits differ; infinite: a one-sided limit is ±∞.</p>'}},
  {q: 'f(x) = 1/(x − 4) has at x = 4:', opts: ['an infinite discontinuity', 'a removable discontinuity', 'a jump discontinuity', 'no discontinuity'], correct: 0, hint: 'Vertical asymptote.', why: 'The one-sided limits are −∞ and +∞.'},
  {q: 'For which k is f(x) = kx + 1 (x &lt; 2), x² (x ≥ 2) continuous at 2?', opts: ['k = 3/2', 'k = 2', 'k = 4', 'k = 1/2'], correct: 0, hint: 'Make the left limit 2k + 1 equal f(2) = 4.', why: '2k + 1 = 4 gives k = 3/2.'},
  {q: 'Where is f(x) = √(x − 4) continuous?', opts: ['[4, ∞)', '(4, ∞)', '(−∞, ∞)', '[0, ∞)'], correct: 0, hint: 'Continuous from the right at the endpoint 4.', why: 'It is continuous on its domain, including x = 4 from the right.', ref: {panel: 'interval', what: 'continuity on an interval', body: '<p>Use a one-sided limit at an included endpoint.</p>'}},
  {q: 'Which function is continuous on (−∞, ∞)?', opts: ['f(x) = x⁵ + 7x + 5', 'f(x) = tan x', 'f(x) = 1/x', 'f(x) = ln x'], correct: 0, hint: 'Polynomials.', why: 'The others are undefined somewhere.'},
  {q: 'f is continuous on [0, 3], f(0) = −2, f(3) = 5. The IVT guarantees:', opts: ['f(c) = 0 for some c in (0, 3)', 'f(c) = 6 for some c', 'f is increasing', 'f(1.5) = 1.5'], correct: 0, hint: '0 lies between −2 and 5.', why: 'Every value between −2 and 5 is taken, including 0.', ref: {panel: 'ivt', what: 'the Intermediate Value Theorem', body: '<p>If f is continuous on [a, b] and C is between f(a) and f(b), then f(x₀) = C for some x₀ in [a, b].</p>'}},
  {q: 'To show x³ − x − 1 = 0 has a root in [1, 2], we use:', opts: ['f(1) = −1 &lt; 0 &lt; 5 = f(2) and continuity', 'f(1) = f(2)', 'f is a polynomial of odd degree', 'f′(1) &gt; 0'], correct: 0, hint: 'Sign change plus continuity.', why: 'The IVT with C = 0.'},
  {q: 'Why can’t the IVT be used for f(x) = 1/x on [−1, 1] to find a zero?', opts: ['f is not continuous on [−1, 1]', 'f(−1) and f(1) have the same sign', 'f has a zero at 0', 'the interval is too small'], correct: 0, hint: 'What happens at x = 0?', why: 'f is undefined at 0, so the hypothesis fails (and indeed 1/x is never 0).'},
  {q: 'If f is continuous at a, then lim<sub>x→a</sub> f(x):', opts: ['exists and equals f(a)', 'may not exist', 'is always 0', 'is ∞'], correct: 0, hint: 'That is the definition.', why: 'Conditions (ii) and (iii).'}
]);
})();
