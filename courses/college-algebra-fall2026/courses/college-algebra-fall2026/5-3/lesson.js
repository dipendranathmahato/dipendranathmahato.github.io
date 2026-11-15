/* Section 5.3 · Graphs of Polynomial Functions — interactive activities */
(() => {
'use strict';
const {fmt, num, F} = CA, P = CA.poly;
const factorStr = (h, m) => `(${CA.xMinus(h)})${m > 1 ? CA.sup(m) : ''}`;
const BEH = m => m === 1 ? 'crosses' : m % 2 === 0 ? 'touches and bounces' : 'crosses and flattens';
const turning = (f, a, b) => { let c = 0, prev = null; const n = 3000; for (let i = 1; i <= n; i++) { const x0 = a + (b - a) * (i - 1) / n, x1 = a + (b - a) * i / n, d = f(x1) - f(x0); if (Math.abs(d) < 1e-12) continue; const s = Math.sign(d); if (prev !== null && s !== prev) c++; prev = s; } return c; };
const endTxt = (n, lead) => { const r = lead > 0 ? '∞' : '−∞', l = n % 2 === 0 ? r : (lead > 0 ? '−∞' : '∞'); return `x → −∞: f(x) → ${l}; x → ∞: f(x) → ${r}`; };

/* ---------- 01 · build from factors ---------- */
CA.lab('mult-lab', {
  controls: [
    {type: 'range', key: 'r1', label: 'Zero 1: x =', min: -4, max: 4, value: -3}, {type: 'range', key: 'm1', label: 'multiplicity', min: 0, max: 4, value: 1},
    {type: 'range', key: 'r2', label: 'Zero 2: x =', min: -4, max: 4, value: 2}, {type: 'range', key: 'm2', label: 'multiplicity', min: 0, max: 4, value: 2},
    {type: 'range', key: 'r3', label: 'Zero 3: x =', min: -4, max: 4, value: -1}, {type: 'range', key: 'm3', label: 'multiplicity', min: 0, max: 4, value: 3},
    {type: 'seg', key: 's', label: 'Leading coefficient', value: '1', options: [['1', 'positive (a = 1)'], ['-1', 'negative (a = −1)']]}],
  plot: {h: 400}, plotLabel: 'Polynomial built from its zeros', readouts: [['f', 'f(x)'], ['deg', 'Degree'], ['end', 'End behavior'], ['y', 'y-intercept'], ['turn', 'Turning points']]
}, (lab, st) => {
  const a = Number(st.s), Z = {};
  [[st.r1, st.m1], [st.r2, st.m2], [st.r3, st.m3]].forEach(([r, m]) => { if (m > 0) Z[r] = (Z[r] || 0) + m; });
  const zs = Object.entries(Z).map(([r, m]) => [Number(r), m]).sort((p, q) => p[0] - q[0]);
  const f = x => a * zs.reduce((acc, [r, m]) => acc * (x - r) ** m, 1), n = zs.reduce((s, z) => s + z[1], 0);
  const [y0, y1] = CA.autoY(f, -5.5, 5.5, [f(0)], 6);
  const Pl = lab.plane({xmin: -5.5, xmax: 5.5, ymin: y0, ymax: y1, xstep: 1});
  Pl.curve(f, {color: 'orange', width: 3.4, arrows: true});
  zs.forEach(([r, m]) => Pl.point(r, 0, {color: m % 2 ? 'blue' : 'purple', r: 7, label: `x = ${fmt(r)}: m = ${m}`, labelOpt: {dy: m % 2 ? -12 : 20, size: 12}}));
  Pl.point(0, f(0), {color: 'green', r: 5}).render();
  lab.read('f', n === 0 ? `f(x) = ${a}` : `f(x) = ${a < 0 ? '−' : ''}${zs.map(([r, m]) => factorStr(r, m)).join('')}`);
  lab.read('deg', n === 0 ? '0' : `${zs.map(z => z[1]).join(' + ')} = ${n}`); lab.read('end', n ? endTxt(n, a) : 'constant');
  lab.read('y', `(0, ${CA.comma(f(0), 3)})`); const t = turning(f, -8, 8); lab.read('turn', `${t} (at most ${Math.max(0, n - 1)})`);
  lab.out(zs.length ? zs.map(([r, m]) => `At x = ${fmt(r)} (multiplicity ${m}) the graph <b>${BEH(m)}</b>.`).join(' ') : 'Give at least one zero a positive multiplicity.');
});

/* ---------- 02 · factor to find intercepts ---------- */
const FACT = {
  a: {t: 'f(x) = x⁶ − 3x⁴ + 2x²', p: [0, 0, 2, 0, -3, 0, 1], zeros: [[-Math.SQRT2, '−√2', 1], [-1, '−1', 1], [0, '0', 2], [1, '1', 1], [Math.SQRT2, '√2', 1]],
    steps: [['Factor out the greatest common factor', 'x²(x⁴ − 3x² + 2) = 0'], ['Factor the quadratic in x²', 'x²(x² − 1)(x² − 2) = 0'], ['Set each factor to 0', 'x² = 0 or x² = 1 or x² = 2'], ['Solve', 'x = 0, x = ±1, x = ±√2'], ['y-intercept', 'f(0) = 0, so (0, 0) is both an x- and the y-intercept']], win: [-2.2, 2.2, -1, 2]},
  b: {t: 'f(x) = x³ − 4x² − 5x', p: [0, -5, -4, 1], zeros: [[-1, '−1', 1], [0, '0', 1], [5, '5', 1]],
    steps: [['Factor out x', 'x(x² − 4x − 5) = 0'], ['Factor the quadratic', 'x(x − 5)(x + 1) = 0'], ['Solve', 'x = 0, x = 5, x = −1'], ['y-intercept', 'f(0) = 0']], win: [-3, 7, -45, 15]},
  c: {t: 'f(x) = x⁴ − 5x² + 4', p: [4, 0, -5, 0, 1], zeros: [[-2, '−2', 1], [-1, '−1', 1], [1, '1', 1], [2, '2', 1]],
    steps: [['Factor as a quadratic in x²', '(x² − 1)(x² − 4) = 0'], ['Difference of squares', '(x − 1)(x + 1)(x − 2)(x + 2) = 0'], ['Solve', 'x = ±1, x = ±2'], ['y-intercept', 'f(0) = 4, so (0, 4)']], win: [-3, 3, -4, 8]},
  d: {t: 'h(x) = x³ + 4x² + x − 6', p: [-6, 1, 4, 1], zeros: [[-3, '−3', 1], [-2, '−2', 1], [1, '1', 1]],
    steps: [['Read the x-intercepts from the graph', 'x = −3, x = −2, x = 1'], ['Each intercept c gives a factor (x − c)', 'h(x) = (x + 3)(x + 2)(x − 1)'], ['Check by expanding', '(x + 3)(x + 2)(x − 1) = (x² + 5x + 6)(x − 1) = x³ + 4x² + x − 6 ✓'], ['y-intercept', 'h(0) = −6']], win: [-4.5, 2.5, -10, 6]}
};
CA.lab('factor-lab', {
  controls: [{type: 'select', key: 'f', label: 'Polynomial', value: 'a', options: Object.entries(FACT).map(([k, v]) => [k, v.t])}],
  plot: {h: 360}, plotLabel: 'Polynomial with labeled intercepts', steps: true
}, (lab, st) => {
  const D = FACT[st.f], f = x => P.at(D.p, x), [x0, x1, y0, y1] = D.win, Pl = lab.plane({xmin: x0, xmax: x1, ymin: y0, ymax: y1});
  Pl.curve(f, {color: 'orange', width: 3.4, arrows: true});
  D.zeros.forEach(([x, t], i) => Pl.point(x, 0, {color: 'blue', r: 6, label: `(${t}, 0)`, labelOpt: {size: 12, dy: i % 2 ? -14 : 22}}));
  if (f(0) !== 0) Pl.point(0, f(0), {color: 'green', r: 6, label: `(0, ${fmt(f(0))})`}); else Pl.point(0, 0, {color: 'green', r: 6});
  Pl.render();
  lab.steps(D.steps);
  lab.out(`x-intercepts: ${D.zeros.map(z => `(${z[1]}, 0)`).join(', ')}. ${D.zeros.some(z => z[2] === 2) ? 'The zero x = 0 has multiplicity 2 (from x²), so the graph touches the axis there.' : 'Every zero has multiplicity 1, so the graph crosses at each one.'}`);
});

/* ---------- 03 · graph detective ---------- */
const MYST = {
  A: {deg: 9, zeros: [-5, -1, 3], mult: [3, 2, 4], yint: 10, win: [-6, 4.5, -60, 60], note: 'Degree 9, y-intercept (0, 10)'},
  B: {deg: 4, zeros: [-3, 1, 4], mult: [1, 2, 1], yint: -6, win: [-4.5, 5, -20, 12], note: 'Degree 4, y-intercept (0, −6)'}
};
const prodAt0 = (zs, ms) => zs.reduce((acc, z, i) => acc * (0 - z) ** ms[i], 1);
CA.lab('gd-lab', {
  controls: [{type: 'seg', key: 'g', label: 'Mystery graph', value: 'A', options: [['A', 'A · degree 9'], ['B', 'B · degree 4']]},
    {type: 'select', key: 'm1', label: 'Multiplicity at the 1st zero', value: '1', options: [1, 2, 3, 4].map(v => [v, v])},
    {type: 'select', key: 'm2', label: 'at the 2nd zero', value: '1', options: [1, 2, 3, 4].map(v => [v, v])},
    {type: 'select', key: 'm3', label: 'at the 3rd zero', value: '1', options: [1, 2, 3, 4].map(v => [v, v])}],
  plot: {h: 400}, plotLabel: 'Mystery polynomial and your guess', legend: [['orange', 'mystery graph'], ['blue', 'your guess', true]],
  readouts: [['zeros', 'Zeros'], ['you', 'Your formula'], ['deg', 'Your degree']], steps: true
}, (lab, st, key) => {
  if (key === 'g') ['m1', 'm2', 'm3'].forEach(k => st.set(k, '1', true));
  const M = MYST[st.g], [x0, x1, y0, y1] = M.win;
  const aTrue = M.yint / prodAt0(M.zeros, M.mult), fT = x => aTrue * M.zeros.reduce((acc, z, i) => acc * (x - z) ** M.mult[i], 1);
  const ms = [st.m1, st.m2, st.m3].map(Number), base = prodAt0(M.zeros, ms), aG = M.yint / base, fG = x => aG * M.zeros.reduce((acc, z, i) => acc * (x - z) ** ms[i], 1);
  const Pl = lab.plane({xmin: x0, xmax: x1, ymin: y0, ymax: y1});
  Pl.curve(fT, {color: 'orange', width: 3.6, arrows: true}).curve(fG, {color: 'blue', dash: '7 6', width: 2.4});
  M.zeros.forEach(z => Pl.point(z, 0, {color: 'orange', r: 5})); Pl.point(0, M.yint, {color: 'green', r: 6, label: `(0, ${fmt(M.yint)})`}).render();
  const deg = ms.reduce((s, m) => s + m, 0), ok = ms.every((m, i) => m === M.mult[i]);
  const aF = F(M.yint, base);
  lab.read('zeros', M.zeros.map(fmt).join(', ')); lab.read('you', `${aF.isInt() ? fmt(aF.n) : aF.toString()} · ${M.zeros.map((z, i) => factorStr(z, ms[i])).join('')}`); lab.read('deg', `${ms.join(' + ')} = ${deg}${deg === M.deg ? ' ✓' : ` (needs ${M.deg})`}`);
  lab.steps([['1 · Write the factors with your multiplicities', `f(x) = a${M.zeros.map((z, i) => factorStr(z, ms[i])).join('')}`],
    ['2 · Use the y-intercept to find a', `${fmt(M.yint)} = a${M.zeros.map((z, i) => `(${fmt(-z)})${ms[i] > 1 ? CA.sup(ms[i]) : ''}`).join('')} = ${CA.comma(base)}a → a = ${aF.toString()}`]]);
  lab.out(ok ? `✓ Your graph matches: f(x) = ${aF.toString()}${M.zeros.map((z, i) => factorStr(z, ms[i])).join('')}, of degree ${deg}.` : 'Not yet. Compare the dashed blue curve with the orange one at each zero: does it cross, bounce, or flatten? A flatter bounce means a higher even power.', ok ? 'ca-correct' : '');
});

/* ---------- 04 · sketch step by step ---------- */
const SK = {
  a: {t: 'f(x) = −2(x + 3)²(x − 5)', f: x => -2 * (x + 3) ** 2 * (x - 5), zeros: [[-3, 2], [5, 1]], lead: -2, n: 3, win: [-6, 7, -120, 180], y0: 90,
    txt: ['End behavior: the leading term is −2x³ (odd degree, negative), so the graph starts up on the left and ends down on the right.', 'x-intercepts: x = −3 (multiplicity 2, the graph bounces) and x = 5 (multiplicity 1, the graph crosses).', 'y-intercept: f(0) = −2(3)²(0 − 5) = −2 · 9 · (−5) = 90, so (0, 90).', 'Symmetry: f(−x) is neither f(x) nor −f(x), so there is no symmetry.', 'Connect: come down from the upper left, bounce at (−3, 0), rise through (0, 90), turn, and cross at (5, 0) going down. Degree 3 allows at most 2 turning points; this graph has exactly 2.']},
  b: {t: 'f(x) = (x + 1)³(x − 1)(x − 3)²', f: x => (x + 1) ** 3 * (x - 1) * (x - 3) ** 2, zeros: [[-1, 3], [1, 1], [3, 2]], lead: 1, n: 6, win: [-2, 4, -30, 30], y0: -9,
    txt: ['End behavior: the leading term is x⁶ (even degree, positive), so both ends go up.', 'x-intercepts: x = −1 (multiplicity 3, crosses and flattens), x = 1 (multiplicity 1, crosses), x = 3 (multiplicity 2, bounces).', 'y-intercept: f(0) = (1)³(−1)(−3)² = −9, so (0, −9).', 'Symmetry: none.', 'Connect: degree 6 allows at most 5 turning points. The graph comes down from the upper left, flattens through (−1, 0), dips to (0, −9), crosses at (1, 0), turns, and bounces at (3, 0) before rising.']}
};
let skStep = 0, skStepper;
const sk = CA.lab('sketch-lab', {
  controls: [{type: 'seg', key: 'f', label: 'Polynomial', value: 'a', options: Object.entries(SK).map(([k, v]) => [k, v.t])}],
  top: '<div id="sketch-stepper"></div>', plot: {h: 400}, plotLabel: 'Polynomial sketch built in stages'
}, (lab, st, key) => { if (key) { skStep = 0; skStepper && skStepper.reset(); return; } drawSketch(lab, st); });
function drawSketch(lab, st) {
  const S = SK[st.f], [x0, x1, y0, y1] = S.win, Pl = lab.plane({xmin: x0, xmax: x1, ymin: y0, ymax: y1}), i = skStep;
  if (i >= 0) { const L = S.n % 2 ? -S.lead : S.lead; Pl.seg(x0 + 1, (L > 0 ? 0.72 : 0.28) * (y1 - y0) + y0, x0 + 0.3, (L > 0 ? 0.88 : 0.12) * (y1 - y0) + y0, {color: 'purple', width: 3, arrow: true}); Pl.seg(x1 - 1, (S.lead > 0 ? 0.72 : 0.28) * (y1 - y0) + y0, x1 - 0.3, (S.lead > 0 ? 0.88 : 0.12) * (y1 - y0) + y0, {color: 'purple', width: 3, arrow: true}); }
  if (i >= 1) S.zeros.forEach(([z, m]) => Pl.point(z, 0, {color: m % 2 ? 'blue' : 'purple', r: 7, label: `${fmt(z)} (m = ${m})`, labelOpt: {dy: 20, size: 12}}));
  if (i >= 2) Pl.point(0, S.y0, {color: 'green', r: 7, label: `(0, ${fmt(S.y0)})`});
  if (i >= 4) Pl.curve(S.f, {color: 'orange', width: 3.4, arrows: true});
  Pl.render();
  lab.out(`<b>Step ${i + 1}.</b> ${S.txt[i]}`);
}
skStepper = CA.stepper('sketch-stepper', () => 5, i => { skStep = i; drawSketch(sk, sk.state); });

CA.guided('53', [
  {q: 'What are the x-intercepts of f(x) = x(x − 4)(x + 2)?', opts: ['0, 4, −2', '0, −4, 2', '4 and −2 only'], correct: 0, hint: 'Set each factor equal to 0.', why: 'x = 0, x − 4 = 0 → 4, x + 2 = 0 → −2.'},
  {q: 'At x = 2, f(x) = (x − 2)²(x + 1) has a zero of multiplicity…', opts: ['1, so the graph crosses', '2, so the graph bounces', '3, so the graph flattens'], correct: 1, hint: 'Look at the power on (x − 2).', why: 'The factor (x − 2)² gives multiplicity 2: the graph touches and turns back.'},
  {q: 'What is the degree of y = −2x⁵(x − 1)³(3x + 5)⁴(6 − x)?', opts: ['5', '13', '12'], correct: 1, hint: 'Add the degrees of all the factors.', why: '5 + 3 + 4 + 1 = 13.'},
  {q: 'How many turning points can a polynomial of degree 4 have at most?', opts: ['4', '3', '5'], correct: 1, hint: 'At most n − 1.', why: 'A degree-4 polynomial has at most 4 − 1 = 3 turning points.'},
  {q: 'Find the y-intercept of f(x) = (x − 2)²(2x + 3).', opts: ['(0, 12)', '(0, −12)', '(0, 6)'], correct: 0, hint: 'Evaluate f(0).', why: 'f(0) = (−2)²(3) = 4 · 3 = 12.'},
  {q: 'At a zero of multiplicity 3, the graph…', opts: ['bounces off the axis', 'crosses while flattening, like x³', 'does not touch the axis'], correct: 1, hint: 'Odd multiplicity crosses.', why: 'Odd multiplicities cross; a power of 3 also flattens near the zero.'},
  {q: 'Which polynomial of degree 3 crosses the x-axis at −3, bounces at 1, and rises to the right (f(x) → ∞ as x → ∞)?', opts: ['(x + 3)(x − 1)²', '(x − 3)(x + 1)²', '−(x + 3)(x − 1)²'], correct: 0, hint: 'Crossing at −3 needs an odd power; bouncing at 1 needs an even power; rising to the right needs a positive leading coefficient.', why: '(x + 3)(x − 1)² has a simple zero at −3, a double zero at 1, and leading term x³, so it rises to the right.'},
  {q: 'Factor to find the zeros of f(x) = x³ − 9x.', opts: ['0, 3, −3', '0 and 9', '3 and −3'], correct: 0, hint: 'Factor out x, then use a difference of squares.', why: 'x(x² − 9) = x(x − 3)(x + 3).'},
  {q: 'For f(x) = −2(x + 3)²(x − 5), as x → ∞, f(x) → ?', opts: ['∞', '−∞', '0'], correct: 1, hint: 'The leading term is −2x³.', why: 'Odd degree with a negative leading coefficient: the right end goes down.'},
  {q: 'A degree-6 polynomial’s zeros have multiplicities 2, 1, and m. What is m?', opts: ['2', '3', '6'], correct: 1, hint: 'The multiplicities add up to the degree.', why: '2 + 1 + m = 6, so m = 3.'}
]);
})();
