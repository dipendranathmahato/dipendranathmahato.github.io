/* Section 2.2 · The Limit of a Function — interactive activities */
(() => {
'use strict';
const {num} = CA;
const $ = id => document.getElementById(id);
const v = y => !Number.isFinite(y) ? (y > 0 ? 'huge (+)' : y < 0 ? 'huge (−)' : 'undefined') : Math.abs(y) > 1e7 ? (y > 0 ? '≈ +' : '≈ −') + Math.abs(y).toExponential(2) : num(y, 9);
const DS = [0.1, 0.01, 0.001, 0.0001];
const table = (f, c, cT) => `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>x → ${cT}⁻</th>${DS.map(d => `<td>${num(c - d, 6)}</td>`).join('')}</tr><tr><th>f(x)</th>${DS.map(d => `<td>${v(f(c - d))}</td>`).join('')}</tr><tr><th>x → ${cT}⁺</th>${DS.map(d => `<td>${num(c + d, 6)}</td>`).join('')}</tr><tr><th>f(x)</th>${DS.map(d => `<td>${v(f(c + d))}</td>`).join('')}</tr></table></div>`;
const delta = k => 10 ** -k;

/* ---------- 01 · intuitive definition ---------- */
const AP = [
  {t: 'f(x) = (x³ − 1)/(x − 1), x → 1', f: x => (x ** 3 - 1) / (x - 1), c: 1, cT: '1', L: '3', fc: 'undefined', hole: [1, 3], win: {xmin: -2, xmax: 3, ymin: -1, ymax: 9}},
  {t: 'f(x) = (sin x)/x, x → 0', f: x => Math.sin(x) / x, c: 0, cT: '0', L: '1', fc: 'undefined', hole: [0, 1], win: {xmin: -10, xmax: 10, ymin: -0.6, ymax: 1.4}},
  {t: 'f(x) = (eˣ − 1)/x, x → 0', f: x => Math.expm1(x) / x, c: 0, cT: '0', L: '1', fc: 'undefined', hole: [0, 1], win: {xmin: -3, xmax: 2, ymin: -0.3, ymax: 3.5}},
  {t: 'f(x) = x² + 1 for x ≠ 2, f(2) = 1; x → 2', f: x => Math.abs(x - 2) < 1e-12 ? 1 : x * x + 1, g: x => x * x + 1, c: 2, cT: '2', L: '5', fc: '1', hole: [2, 5], dot: [2, 1], win: {xmin: -1, xmax: 4, ymin: -1, ymax: 10}},
  {t: 'f(x) = 3x − 1, x → 2 (a “special” case: f(2) = limit)', f: x => 3 * x - 1, c: 2, cT: '2', L: '5', fc: '5', dot: [2, 5], win: {xmin: -1, xmax: 4, ymin: -3, ymax: 10}},
  {t: 'f(x) = sin(π/x), x → 0', f: x => Math.sin(Math.PI / x), c: 0, cT: '0', L: null, fc: 'undefined', win: {xmin: -1, xmax: 1, ymin: -1.5, ymax: 1.5}}
];
CA.lab('approach-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: AP.map((a, i) => [String(i), a.t])}, {type: 'range', key: 'k', label: 'Distance from c', min: 0, max: 4, step: 0.25, value: 0.5, fmt: k => num(delta(k), 5)}],
  plot: {w: 560, h: 380}, plotLabel: 'Graph of f with two points approaching x = c', legend: [['blue', 'y = f(x)'], ['orange', 'from the left'], ['purple', 'from the right']],
  readouts: [['l', 'f(c − d)'], ['r', 'f(c + d)'], ['fc', 'f(c)'], ['lim', 'Limit']], bottom: '<div id="approach-table"></div>'
}, (lab, st) => {
  const A = AP[+st.p], d = delta(st.k), c = A.c, f = A.g || A.f, P = lab.plane(Object.assign({equal: false}, A.win));
  P.curve(f, {color: 'blue', width: 3, samples: A.L === null ? 6000 : 800, breaks: A.L === null ? [0] : []});
  P.vline(c, {color: 'gray', dash: '4 5', width: 1.2});
  if (A.hole) P.point(A.hole[0], A.hole[1], {color: 'blue', r: 6, filled: false});
  if (A.dot) P.point(A.dot[0], A.dot[1], {color: 'blue', r: 6});
  const yl = A.f(c - d), yr = A.f(c + d);
  if (Number.isFinite(yl)) P.point(c - d, yl, {color: 'orange', r: 7}); if (Number.isFinite(yr)) P.point(c + d, yr, {color: 'purple', r: 7});
  if (A.L !== null) P.hline(+A.L, {color: 'green', dash: '2 5', width: 1.2});
  P.render();
  lab.read('l', v(yl)); lab.read('r', v(yr)); lab.read('fc', A.fc); lab.read('lim', A.L === null ? 'does not exist' : A.L);
  $('approach-table').innerHTML = table(A.f, c, A.cT);
  lab.out(A.L === null ? 'Near 0, sin(π/x) takes every value between −1 and 1 infinitely often; it never settles near one number, so the limit does not exist.' : A.fc === 'undefined' ? `f(${A.cT}) is undefined, but the values on both sides close in on ${A.L}: lim<sub>x→${A.cT}</sub> f(x) = ${A.L}.` : A.fc === A.L ? `Here f(${A.cT}) = ${A.fc} equals the limit. That is the special situation we will call <b>continuity</b>.` : `f(${A.cT}) = ${A.fc}, yet the limit is ${A.L}: the value at the point does not affect the limit.`, A.L === null ? 'ca-incorrect' : 'ca-correct');
});

/* ---------- 02 · one-sided limits ---------- */
const OS = [
  {t: 'f(x) = |x − 2|/(x − 2), x → 2', pieces: [[x => -1, -1, 2], [x => 1, 2, 5]], c: 2, L: '−1', R: '1', fc: 'undefined', holes: [[2, -1], [2, 1]], dots: [], win: {xmin: -1, xmax: 5, ymin: -2.5, ymax: 2.5}},
  {t: 'f(x) = x + 1 for x < 1; x² − 4x + 6 for x ≥ 1', pieces: [[x => x + 1, -2, 1], [x => x * x - 4 * x + 6, 1, 4.5]], c: 1, L: '2', R: '3', fc: '3', holes: [[1, 2]], dots: [[1, 3]], win: {xmin: -2, xmax: 4.5, ymin: -1, ymax: 7}},
  {t: 'f(x) = x² for x < 1; 2 − x for x > 1; f(1) = 3', pieces: [[x => x * x, -2, 1], [x => 2 - x, 1, 4]], c: 1, L: '1', R: '1', fc: '3', holes: [[1, 1]], dots: [[1, 3]], win: {xmin: -2, xmax: 4, ymin: -2.5, ymax: 4.5}},
  {t: 'f(x) = ⌊x⌋ (greatest integer ≤ x), x → 2', pieces: [-1, 0, 1, 2, 3].map(n => [() => n, n, n + 1]), c: 2, L: '1', R: '2', fc: '2', holes: [-1, 0, 1, 2, 3].map(n => [n + 1, n]), dots: [-1, 0, 1, 2, 3].map(n => [n, n]), win: {xmin: -1.5, xmax: 4.5, ymin: -1.5, ymax: 4}},
  {t: 'f(x) = √x, x → 0', pieces: [[Math.sqrt, 0, 5]], c: 0, L: 'does not exist (f is undefined for x < 0)', R: '0', fc: '0', holes: [], dots: [[0, 0]], win: {xmin: -2, xmax: 5, ymin: -1, ymax: 2.6}, half: true}
];
const evalP = (O, x) => { for (const [g, a, b] of O.pieces) if (x > a && x < b) return g(x); return NaN; };
CA.lab('onesided-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '1', options: OS.map((o, i) => [String(i), o.t])}, {type: 'range', key: 'k', label: 'Distance from c', min: 0, max: 4, step: 0.25, value: 0.5, fmt: k => num(delta(k), 5)}],
  plot: {w: 540, h: 380}, plotLabel: 'Piecewise graph with points approaching from the left and the right', legend: [['orange', 'x → c⁻'], ['purple', 'x → c⁺']],
  readouts: [['L', 'lim from the left'], ['R', 'lim from the right'], ['lim', 'Two-sided limit'], ['fc', 'f(c)']]
}, (lab, st) => {
  const O = OS[+st.p], d = delta(st.k), c = O.c, P = lab.plane(Object.assign({equal: false}, O.win));
  O.pieces.forEach(([g, a, b]) => P.curve(g, {color: 'blue', width: 3.2, from: Math.max(a, O.win.xmin), to: Math.min(b, O.win.xmax) - 1e-9}));
  P.vline(c, {color: 'gray', dash: '4 5', width: 1.2});
  O.holes.forEach(([x, y]) => P.point(x, y, {color: 'blue', r: 6, filled: false})); O.dots.forEach(([x, y]) => P.point(x, y, {color: 'blue', r: 6}));
  const yl = evalP(O, c - d), yr = evalP(O, c + d);
  if (Number.isFinite(yl)) P.point(c - d, yl, {color: 'orange', r: 7, label: num(yl, 4), labelOpt: {anchor: 'end', dx: -10, dy: -8}});
  if (Number.isFinite(yr)) P.point(c + d, yr, {color: 'purple', r: 7, label: num(yr, 4), labelOpt: {anchor: 'start', dx: 10, dy: 16}});
  P.render();
  const same = O.L === O.R, lim = O.half ? 'only the right-hand limit makes sense: 0' : same ? O.L : 'does not exist';
  lab.read('L', O.L); lab.read('R', O.R); lab.read('lim', lim); lab.read('fc', O.fc);
  lab.out(O.half ? 'f is only defined for x ≥ 0, so we can only approach 0 from the right: lim<sub>x→0⁺</sub> √x = 0.' : same ? `Both one-sided limits equal ${O.L}, so lim<sub>x→${c}</sub> f(x) = ${O.L}${O.fc !== O.L ? `, even though f(${c}) = ${O.fc}` : ''}.` : `The left-hand limit ${O.L} and the right-hand limit ${O.R} differ, so lim<sub>x→${c}</sub> f(x) does not exist.`, same || O.half ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 03 · infinite limits ---------- */
const INF = [
  {t: 'f(x) = 1/(x − 2)², x → 2', f: x => 1 / (x - 2) ** 2, c: 2, L: '+∞', R: '+∞', lim: '+∞', win: {xmin: -1, xmax: 5, ymin: -2, ymax: 20}},
  {t: 'f(x) = 1/x, x → 0', f: x => 1 / x, c: 0, L: '−∞', R: '+∞', lim: 'does not exist', win: {xmin: -4, xmax: 4, ymin: -10, ymax: 10}},
  {t: 'f(x) = −1/(x + 1)², x → −1', f: x => -1 / (x + 1) ** 2, c: -1, L: '−∞', R: '−∞', lim: '−∞', win: {xmin: -4, xmax: 2, ymin: -20, ymax: 2}},
  {t: 'f(x) = (x + 1)/(x − 3), x → 3', f: x => (x + 1) / (x - 3), c: 3, L: '−∞', R: '+∞', lim: 'does not exist', win: {xmin: -2, xmax: 8, ymin: -15, ymax: 15}},
  {t: 'f(x) = tan x, x → π/2', f: Math.tan, c: Math.PI / 2, cT: 'π/2', L: '+∞', R: '−∞', lim: 'does not exist', win: {xmin: -0.5, xmax: 3.5, ymin: -10, ymax: 10}},
  {t: 'f(x) = ln x, x → 0⁺', f: x => x > 0 ? Math.log(x) : NaN, c: 0, L: '(not defined for x < 0)', R: '−∞', lim: 'lim from the right is −∞', win: {xmin: -1, xmax: 5, ymin: -6, ymax: 3}, half: true}
];
CA.lab('infinite-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: INF.map((o, i) => [String(i), o.t])}, {type: 'range', key: 'k', label: 'Distance from c', min: 0, max: 3, step: 0.25, value: 0.5, fmt: k => num(delta(k), 4)}],
  plot: {w: 540, h: 400}, plotLabel: 'Graph near a vertical asymptote', legend: [['blue', 'y = f(x)'], ['red', 'vertical asymptote', true]],
  readouts: [['vl', 'f(c − d)'], ['vr', 'f(c + d)'], ['L', 'x → c⁻'], ['R', 'x → c⁺'], ['lim', 'lim x → c']]
}, (lab, st) => {
  const I = INF[+st.p], d = delta(st.k), c = I.c, P = lab.plane(Object.assign({equal: false}, I.win));
  P.vline(c, {color: 'red', dash: '7 6', width: 1.8}).curve(I.f, {color: 'blue', width: 3.2, breaks: [c], samples: 3000});
  const yl = I.f(c - d), yr = I.f(c + d), clip = y => Math.max(I.win.ymin, Math.min(I.win.ymax, y));
  if (Number.isFinite(yl)) P.point(c - d, clip(yl), {color: 'orange', r: 7}); if (Number.isFinite(yr)) P.point(c + d, clip(yr), {color: 'purple', r: 7});
  P.render();
  lab.read('vl', v(yl)); lab.read('vr', v(yr)); lab.read('L', I.L); lab.read('R', I.R); lab.read('lim', I.lim);
  lab.out(I.half ? 'ln x is only defined for x &gt; 0; as x → 0⁺ it decreases without bound. The y-axis is a vertical asymptote.' : I.L === I.R ? `Both sides go to ${I.L}, so lim<sub>x→${I.cT || c}</sub> f(x) = ${I.lim}. The line x = ${I.cT || c} is a vertical asymptote.` : `The two sides go to ${I.L} and ${I.R}: lim<sub>x→${I.cT || c}</sub> f(x) does not exist, but x = ${I.cT || c} is still a vertical asymptote.`);
});

/* ---------- 04 · read limits from a graph ---------- */
const G1 = x => 0.5 * (x + 3) + 1, G2 = x => 2 + 0.25 * (x + 1) ** 2, G3 = x => -1 / (x - 2);
const gf = x => x < -3 ? G1(x) : x < 2 ? G2(x) : x > 2 ? G3(x) : NaN;
const OPTS = [['?', 'choose'], ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['17/4', '17/4'], ['inf', '+∞'], ['-inf', '−∞'], ['dne', 'does not exist'], ['und', 'undefined']];
const ANS = {
  '-3': {L: '1', R: '3', lim: 'dne', fc: '3', why: 'Jump: the left piece ends at height 1 (open circle), the right piece starts at height 3 (filled circle).'},
  '-1': {L: '2', R: '2', lim: '2', fc: '4', why: 'Hole at height 2 with the single point (−1, 4) above it: the limit is 2, but f(−1) = 4.'},
  '1': {L: '3', R: '3', lim: '3', fc: '3', why: 'Nothing unusual: the graph passes through (1, 3).'},
  '2': {L: '17/4', R: '-inf', lim: 'dne', fc: 'und', why: 'From the left the curve ends at height 2 + 0.25·9 = 17/4 (open circle); from the right it drops to −∞ along the asymptote x = 2. f(2) is undefined.'}
};
const NAME = Object.fromEntries(OPTS);
CA.lab('read-lab', {
  controls: [{type: 'seg', key: 'c', label: 'Point c', value: '-3', options: [['-3', 'c = −3'], ['-1', 'c = −1'], ['1', 'c = 1'], ['2', 'c = 2']]},
    ...[['L', 'lim from the left'], ['R', 'lim from the right'], ['lim', 'lim x → c'], ['fc', 'f(c)']].map(([k, l]) => ({type: 'select', key: k, label: l, value: '?', options: OPTS}))],
  plot: {xmin: -5, xmax: 5, ymin: -3, ymax: 6, w: 560, h: 420, equal: false}, plotLabel: 'Graph of a function with a jump, a hole, and a vertical asymptote'
}, (lab, st, key) => {
  if (key === 'c') ['L', 'R', 'lim', 'fc'].forEach(k => st.set(k, '?', true));
  const P = lab.plane(), c = +st.c;
  P.curve(G1, {color: 'blue', width: 3.2, from: -5, to: -3 - 1e-9}).curve(G2, {color: 'blue', width: 3.2, from: -3, to: 2 - 1e-9}).curve(G3, {color: 'blue', width: 3.2, from: 2 + 1e-6, to: 5});
  P.vline(2, {color: 'red', dash: '7 6', width: 1.4});
  P.point(-3, 1, {color: 'blue', r: 6, filled: false}).point(-3, 3, {color: 'blue', r: 6}).point(-1, 2, {color: 'blue', r: 6, filled: false}).point(-1, 4, {color: 'blue', r: 6}).point(2, 17 / 4, {color: 'blue', r: 6, filled: false});
  P.vline(c, {color: 'green', dash: '3 4', width: 2}).render();
  const A = ANS[st.c], ks = ['L', 'R', 'lim', 'fc'], done = ks.filter(k => st[k] !== '?'), right = done.filter(k => st[k] === A[k]);
  if (!done.length) { lab.out(`Read the four quantities at c = ${st.c.replace('-', '−')}.`); return; }
  const lab4 = {L: 'left limit', R: 'right limit', lim: 'limit', fc: 'f(c)'};
  lab.out(right.length === 4 ? `<b>All four correct.</b> ${A.why}` : `${right.length} of ${done.length} chosen ${done.length === 1 ? 'is' : 'are'} correct. ${done.filter(k => st[k] !== A[k]).map(k => `Check the ${lab4[k]} (you chose ${NAME[st[k]]}).`).join(' ')}`, right.length === 4 ? 'ca-correct' : right.length === done.length ? '' : 'ca-incorrect');
});

/* ---------- guided problems ---------- */
CA.guided('22', [
  {q: 'From the table x = 0.9, 0.99, 0.999 → f(x) = 2.71, 2.9701, 2.997 and x = 1.1, 1.01, 1.001 → 3.31, 3.0301, 3.003, the best estimate of lim<sub>x→1</sub> f(x) is:', opts: ['3', '2.997', '3.003', 'it does not exist'], correct: 0, hint: 'Both rows close in on the same number.', why: 'Both sides approach 3.', ref: {panel: 'intuitive', what: 'estimating a limit with a table', body: '<p>Look at the values of f(x) for x closer and closer to c on both sides.</p>'}},
  {q: 'lim<sub>x→4</sub> (x² − 16)/(x − 4) = ?', opts: ['8', '0', '4', 'does not exist'], correct: 0, hint: 'For x ≠ 4 the quotient is x + 4.', why: '(x − 4)(x + 4)/(x − 4) = x + 4 → 8.'},
  {q: 'If f(3) = 7 and lim<sub>x→3</sub> f(x) = 5, then:', opts: ['the limit is 5; f(3) does not matter', 'the limit is 7', 'the limit does not exist', 'f is not a function'], correct: 0, hint: 'The limit ignores the value at the point.', why: 'Limits describe values near 3, not at 3.'},
  {q: 'lim<sub>x→0⁺</sub> |x|/x = ?', opts: ['1', '−1', '0', 'does not exist'], correct: 0, hint: 'For x &gt; 0, |x| = x.', why: 'x/x = 1 for x &gt; 0.', ref: {panel: 'one-sided', what: 'one-sided limits', body: '<p>x → c⁺ uses only x &gt; c; x → c⁻ uses only x &lt; c.</p>'}},
  {q: 'If lim<sub>x→2⁻</sub> f(x) = 4 and lim<sub>x→2⁺</sub> f(x) = 4, then lim<sub>x→2</sub> f(x):', opts: ['= 4', 'does not exist', 'depends on f(2)', '= 8'], correct: 0, hint: 'Equal one-sided limits.', why: 'The two-sided limit exists exactly when both one-sided limits exist and agree.'},
  {q: 'For f(x) = x + 1 (x &lt; 1) and x² − 4x + 6 (x ≥ 1), lim<sub>x→1</sub> f(x):', opts: ['does not exist', '= 2', '= 3', '= 5'], correct: 0, hint: 'Left gives 2; right gives 1 − 4 + 6.', why: 'Left limit 2 ≠ right limit 3.'},
  {q: 'lim<sub>x→3</sub> 1/(x − 3)² = ?', opts: ['+∞', '−∞', '0', '1/9'], correct: 0, hint: 'The denominator is small and positive on both sides.', why: '1/(small positive) is large and positive.', ref: {panel: 'infinite', what: 'infinite limits', body: '<p>1/(x − c)² → +∞ as x → c from either side.</p>'}},
  {q: 'lim<sub>x→5⁻</sub> 1/(x − 5) = ?', opts: ['−∞', '+∞', '0', 'does not exist'], correct: 0, hint: 'For x &lt; 5, x − 5 is a small negative number.', why: '1/(small negative) is large and negative.'},
  {q: 'Which line is a vertical asymptote of f(x) = (x + 2)/(x − 1)?', opts: ['x = 1', 'x = −2', 'y = 1', 'x = 0'], correct: 0, hint: 'Where does the denominator vanish (and the numerator not)?', why: 'Near x = 1 the quotient blows up.'},
  {q: 'lim<sub>x→7</sub> 9 = ?', opts: ['9', '7', '63', 'does not exist'], correct: 0, hint: 'A constant does not change.', why: 'lim c = c.', ref: {panel: 'read-graph', what: 'the two basic limits', body: '<p>lim<sub>x→a</sub> x = a and lim<sub>x→a</sub> c = c.</p>'}}
]);
})();
