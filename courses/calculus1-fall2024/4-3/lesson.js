/* Section 4.3 · Maxima and Minima — interactive activities */
(() => {
'use strict';
const {num} = CA;
const nx = v => CA.niceX(v, 4);

/* ---------- 01 · which extrema exist ---------- */
const EX = [
  {t: 'f(x) = x³ on (−∞, ∞)', f: x => x ** 3, a: -2.2, b: 2.2, win: {xmin: -2.5, xmax: 2.5, ymin: -6, ymax: 6}, aMax: 'none', aMin: 'none', loc: 'none', why: 'f takes arbitrarily large and small values; the interval is not closed and bounded.', arrows: true},
  {t: 'f(x) = 1/(x² + 1) on (−∞, ∞)', f: x => 1 / (x * x + 1), a: -6, b: 6, win: {xmin: -6, xmax: 6, ymin: -0.3, ymax: 1.4}, aMax: '1 at x = 0', aMin: 'none', loc: 'local max at x = 0', why: 'f gets close to 0 but never reaches it, so there is no absolute minimum.', pts: [[0, 1, 'max']], arrows: true},
  {t: 'f(x) = cos x on (−∞, ∞)', f: Math.cos, a: -7, b: 7, win: {xmin: -7, xmax: 7, ymin: -1.6, ymax: 1.6}, aMax: '1 at x = 0, ±2π, …', aMin: '−1 at x = ±π, ±3π, …', loc: 'every absolute extremum is also local', why: 'Extrema exist even though the interval is not closed: the EVT gives a sufficient condition, not a necessary one.', pts: [[0, 1, 'max'], [2 * Math.PI, 1, 'max'], [-2 * Math.PI, 1, 'max'], [Math.PI, -1, 'min'], [-Math.PI, -1, 'min']], arrows: true},
  {t: 'f(x) = 2 − x² on [0, 2), x − 3 on [2, 4]', pieces: [[x => 2 - x * x, 0, 2], [x => x - 3, 2, 4]], a: 0, b: 4, win: {xmin: -0.5, xmax: 4.5, ymin: -2.6, ymax: 2.6}, aMax: '2 at x = 0', aMin: 'none', loc: 'none in the interior', why: 'f is not continuous at x = 2; values approach −2 from the left but f(2) = −1.', pts: [[0, 2, 'max']], holes: [[2, -2]], dots: [[2, -1], [4, 1]]},
  {t: 'f(x) = (x − 2)² on [1, 4]', f: x => (x - 2) ** 2, a: 1, b: 4, win: {xmin: 0, xmax: 4.5, ymin: -0.5, ymax: 4.6}, aMax: '4 at x = 4', aMin: '0 at x = 2', loc: 'local min at x = 2', why: 'Continuous on a closed interval: the EVT guarantees both extrema.', pts: [[4, 4, 'max'], [2, 0, 'min']], dots: [[1, 1]]},
  {t: 'f(x) = x/(2 − x) on [0, 2)', f: x => x / (2 - x), a: 0, b: 1.93, win: {xmin: -0.3, xmax: 2.4, ymin: -0.5, ymax: 12}, aMax: 'none', aMin: '0 at x = 0', loc: 'none', why: 'f → ∞ as x → 2⁻; the interval is not closed.', pts: [[0, 0, 'min']], asy: 2}
];
CA.lab('ext-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function and interval', value: '4', options: EX.map((e, i) => [String(i), e.t])}],
  plot: {w: 540, h: 360}, plotLabel: 'Function with its extrema marked', legend: [['green', 'maximum'], ['red', 'minimum']], readouts: [['M', 'absolute maximum'], ['m', 'absolute minimum'], ['l', 'local extrema']]
}, (lab, st) => {
  const E = EX[+st.p], P = lab.plane(Object.assign({equal: false}, E.win));
  if (E.asy) P.vline(E.asy, {color: 'red', dash: '7 6', width: 1.4});
  (E.pieces || [[E.f, E.a, E.b]]).forEach(([g, a, b]) => P.curve(g, {color: 'blue', width: 3.2, from: a, to: b - (E.pieces ? 1e-9 : 0)}));
  (E.holes || []).forEach(([x, y]) => P.point(x, y, {color: 'blue', r: 6, filled: false})); (E.dots || []).forEach(([x, y]) => P.point(x, y, {color: 'blue', r: 6}));
  (E.pts || []).forEach(([x, y, k]) => P.point(x, y, {color: k === 'max' ? 'green' : 'red', r: 8}));
  P.render();
  lab.read('M', E.aMax); lab.read('m', E.aMin); lab.read('l', E.loc);
  lab.out(E.why, E.aMax !== 'none' && E.aMin !== 'none' ? 'ca-correct' : '');
});

/* ---------- 02 · critical points ---------- */
const CR = [
  {t: 'f(x) = x³ − 3x', src: 'x^3 - 3x', f: x => x ** 3 - 3 * x, a: -2.5, b: 2.5},
  {t: 'f(x) = x³ (f′(0) = 0, no extremum)', src: 'x^3', f: x => x ** 3, a: -2, b: 2},
  {t: 'f(x) = |x| (f′(0) undefined, minimum)', src: 'abs(x)', f: Math.abs, a: -3, b: 3, und: [0]},
  {t: 'f(x) = ∛x (f′(0) undefined, no extremum)', src: 'x^(1/3)', f: Math.cbrt, a: -3, b: 3, und: [0]},
  {t: 'f(x) = x⁴ − 4x³', src: 'x^4 - 4x^3', f: x => x ** 4 - 4 * x ** 3, a: -1.5, b: 4.5},
  {t: 'f(x) = x^(2/3)(x − 5)', src: 'x^(2/3)(x - 5)', f: x => Math.cbrt(x) ** 2 * (x - 5), a: -2, b: 6, und: [0]},
  {t: 'f(x) = sin x + cos x on [0, 2π]', src: 'sin(x) + cos(x)', f: x => Math.sin(x) + Math.cos(x), a: 0, b: 2 * Math.PI}
];
CA.lab('crit-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: CR.map((c, i) => [String(i), c.t]).concat([['own', 'Type your own']])}, {type: 'text', key: 'f', label: 'f(x) =', value: 'x^3 - 3x'}],
  plot: {w: 540, h: 360}, plotLabel: 'Function with its critical points', legend: [['green', 'local max'], ['red', 'local min'], ['purple', 'critical point, no extremum']], bottom: '<div id="crit-table"></div>'
}, (lab, st, key) => {
  let C = CR[+st.p];
  if (key === 'f') { st.set('p', 'own', true); }
  if (st.p === 'own') { const E = CA.expr(st.f); if (!E) { lab.plane({xmin: -5, xmax: 5, ymin: -5, ymax: 5}).render(); lab.out('Type a function of x.', 'ca-incorrect'); return; } C = {f: E.f, a: -5, b: 5}; }
  else if (key === 'p' || key == null) st.set('f', C.src, true);
  const Y = CA.fitY(C.f, C.a, C.b, {clip: 80}), P = lab.plane({xmin: C.a - 0.3, xmax: C.b + 0.3, ymin: Y.ymin, ymax: Y.ymax, equal: false});
  P.curve(C.f, {color: 'blue', width: 3.2, from: C.a, to: C.b, samples: 1500});
  const cp = CA.critPoints(C.f, C.a, C.b, {und: C.und || []});
  cp.forEach(p => P.point(p.x, C.f(p.x), {color: p.type === 'local max' ? 'green' : p.type === 'local min' ? 'red' : 'purple', r: 7, label: nx(p.x), labelOpt: {dy: -12, size: 11.5}}));
  P.render();
  const sg = v => !Number.isFinite(v) ? '?' : v > 0 ? '+' : v < 0 ? '−' : '0';
  document.getElementById('crit-table').innerHTML = cp.length ? `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>critical point c</th><th>f(c)</th><th>reason</th><th>f′ left · right</th><th>type</th></tr>${cp.map(p => `<tr><td>${nx(p.x)}</td><td>${num(C.f(p.x), 4)}</td><td>${p.kind === 'zero' ? 'f′(c) = 0' : 'f′(c) undefined'}</td><td>${sg(p.left)} · ${sg(p.right)}</td><td><b>${p.type}</b></td></tr>`).join('')}</table></div>` : '<p class="ca-muted">No critical points in this window.</p>';
  lab.out(cp.some(p => p.type === 'neither') ? 'Not every critical point is an extremum: where f′ has the same sign on both sides, f keeps going in the same direction.' : 'Each critical point here is a local extremum: f′ changes sign there.');
});

/* ---------- 03 · closed interval method ---------- */
const CI = [
  {t: 'f(x) = −x² + 3x − 2 on [1, 3]', f: x => -x * x + 3 * x - 2, a: 1, b: 3, dT: 'f′(x) = −2x + 3'},
  {t: 'f(x) = x³ − 3x² + 1 on [−1, 3]', f: x => x ** 3 - 3 * x * x + 1, a: -1, b: 3, dT: 'f′(x) = 3x² − 6x = 3x(x − 2)'},
  {t: 'f(x) = x³ − 12x on [−3, 5]', f: x => x ** 3 - 12 * x, a: -3, b: 5, dT: 'f′(x) = 3x² − 12'},
  {t: 'f(x) = x − 2 sin x on [0, 2π]', f: x => x - 2 * Math.sin(x), a: 0, b: 2 * Math.PI, dT: 'f′(x) = 1 − 2 cos x'},
  {t: 'f(x) = x^(2/3) on [−1, 8]', f: x => Math.cbrt(x) ** 2, a: -1, b: 8, und: [0], dT: 'f′(x) = (2/3)x<sup>−1/3</sup>, undefined at 0'},
  {t: 'f(x) = x e⁻ˣ on [0, 3]', f: x => x * Math.exp(-x), a: 0, b: 3, dT: 'f′(x) = (1 − x)e⁻ˣ'}
];
CA.lab('civ-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function and interval', value: '0', options: CI.map((c, i) => [String(i), c.t])}],
  plot: {w: 540, h: 360}, plotLabel: 'Function on a closed interval with the candidates', legend: [['orange', 'candidate'], ['green', 'absolute max'], ['red', 'absolute min']], readouts: [['d', 'derivative'], ['M', 'absolute maximum'], ['m', 'absolute minimum']], bottom: '<div id="civ-table"></div>'
}, (lab, st) => {
  const C = CI[+st.p], Y = CA.fitY(C.f, C.a, C.b), w = (C.b - C.a) * 0.08, P = lab.plane({xmin: C.a - w, xmax: C.b + w, ymin: Y.ymin, ymax: Y.ymax, equal: false});
  P.curve(C.f, {color: 'gray', width: 1.6, dash: '5 5', from: C.a - w, to: C.b + w}).curve(C.f, {color: 'blue', width: 3.4, from: C.a, to: C.b});
  const cand = [{x: C.a, why: 'endpoint'}, ...CA.critPoints(C.f, C.a, C.b, {und: C.und || []}).map(p => ({x: p.x, why: p.kind === 'zero' ? 'f′ = 0' : 'f′ undefined'})), {x: C.b, why: 'endpoint'}];
  const vals = cand.map(c => C.f(c.x)), hi = Math.max(...vals), lo = Math.min(...vals);
  cand.forEach((c, i) => P.point(c.x, vals[i], {color: Math.abs(vals[i] - hi) < 1e-9 ? 'green' : Math.abs(vals[i] - lo) < 1e-9 ? 'red' : 'orange', r: 7}));
  P.render();
  const fv = v => { const f = CA.simpleFrac(v, 12); return f && Math.abs(f.v - v) < 1e-9 ? f.toString() : num(v, 5); };
  lab.read('d', C.dT); lab.read('M', `${fv(hi)} at x = ${cand.filter((c, i) => Math.abs(vals[i] - hi) < 1e-9).map(c => nx(c.x)).join(', ')}`); lab.read('m', `${fv(lo)} at x = ${cand.filter((c, i) => Math.abs(vals[i] - lo) < 1e-9).map(c => nx(c.x)).join(', ')}`);
  document.getElementById('civ-table').innerHTML = `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>candidate x</th><th>why</th><th>f(x)</th></tr>${cand.map((c, i) => `<tr class="${Math.abs(vals[i] - hi) < 1e-9 || Math.abs(vals[i] - lo) < 1e-9 ? 'selected' : ''}"><td>${nx(c.x)}</td><td>${c.why}</td><td>${fv(vals[i])}</td></tr>`).join('')}</table></div>`;
  lab.out('Compare the values in the table: the largest is the absolute maximum and the smallest is the absolute minimum. Nothing else on [a, b] can beat them.', 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('43', [
  {q: 'Which hypothesis does the Extreme Value Theorem need?', opts: ['f continuous on a closed, bounded interval', 'f differentiable everywhere', 'f increasing', 'f′(c) = 0 somewhere'], correct: 0, hint: 'Continuous on [a, b].', why: 'Then absolute extrema are guaranteed.', ref: {panel: 'extrema', what: 'the Extreme Value Theorem', body: '<p>Continuous on [a, b] ⇒ absolute max and min exist.</p>'}},
  {q: 'f(x) = 1/(x² + 1) on (−∞, ∞) has:', opts: ['an absolute max but no absolute min', 'both', 'neither', 'an absolute min but no absolute max'], correct: 0, hint: 'Values approach 0 but never reach it.', why: 'Max 1 at 0; no min.'},
  {q: 'The critical points of f(x) = x³ − 3x are:', opts: ['x = ±1', 'x = 0, ±√3', 'x = 0', 'x = 3'], correct: 0, hint: 'f′(x) = 3x² − 3.', why: '3(x² − 1) = 0.', ref: {panel: 'critical', what: 'critical points', body: '<p>c in the domain with f′(c) = 0 or f′(c) undefined.</p>'}},
  {q: 'Fermat’s theorem says:', opts: ['if f has a local extremum at c and f′(c) exists, then f′(c) = 0', 'if f′(c) = 0, then f has a local extremum at c', 'every critical point is an extremum', 'f′(c) = 0 at every endpoint'], correct: 0, hint: 'Think of x³ at 0.', why: 'The converse is false.'},
  {q: 'For f(x) = x³, x = 0 is:', opts: ['a critical point that is not an extremum', 'a local max', 'a local min', 'not a critical point'], correct: 0, hint: 'f′(0) = 0 but f increases through 0.', why: 'f′ ≥ 0 on both sides.'},
  {q: 'f(x) = |x − 1| has a critical point at:', opts: ['x = 1, where f′ is undefined', 'x = 0', 'no point', 'x = −1'], correct: 0, hint: 'A corner.', why: 'The left and right slopes differ at 1.'},
  {q: 'The absolute maximum of f(x) = −x² + 3x − 2 on [1, 3] is:', opts: ['1/4', '0', '−2', '3/2'], correct: 0, hint: 'Candidates f(1), f(3/2), f(3).', why: '0, 1/4, −2: the largest is 1/4.', ref: {panel: 'closed', what: 'the closed interval method', body: '<p>Compare f at the critical points and the endpoints.</p>'}},
  {q: 'The absolute minimum of f(x) = −x² + 3x − 2 on [1, 3] is at:', opts: ['x = 3', 'x = 1', 'x = 3/2', 'x = 2'], correct: 0, hint: 'f(3) = −2.', why: 'The smallest candidate value.'},
  {q: 'For f(x) = x³ − 3x² + 1 on [−1, 3], the absolute minimum is:', opts: ['−3', '1', '−1', '0'], correct: 0, hint: 'Candidates: f(−1) = −3, f(0) = 1, f(2) = −3, f(3) = 1.', why: '−3, attained at x = −1 and x = 2.'},
  {q: 'An absolute extremum on [a, b] can occur:', opts: ['at a critical point or an endpoint', 'only where f′ = 0', 'only at endpoints', 'only where f′ is undefined'], correct: 0, hint: 'That is the list of candidates.', why: 'Those are the only possibilities.'}
]);
})();
