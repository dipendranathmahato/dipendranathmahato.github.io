/* Section 1.4 · Inverse Functions — interactive activities (reusing the tested college algebra and precalculus explorers) */

/* reused from 3-7.js */
(() => {
'use strict';
const {fmt, num} = CA;
const pt = (x, y) => `(${num(x)}, ${num(y)})`;
const chips = (pairs, bad = []) => `<div class="ca-chip-wrap">${pairs.map(([x, y]) => `<span class="ca-pair ${bad.includes(x) ? 'ca-conflict' : ''}">${pt(x, y)}</span>`).join('')}</div>`;
const set = a => '{' + [...new Set(a)].sort((p, q) => p - q).map(fmt).join(', ') + '}';
const solveNum = (f, c, a, b) => { // all x in [a, b] with f(x) = c
  const out = [], n = 2400; let px = a, pv = f(a) - c;
  for (let i = 1; i <= n; i++) {
    const x = a + (b - a) * i / n, v = f(x) - c;
    if (!Number.isFinite(v) || !Number.isFinite(pv)) { px = x; pv = v; continue; }
    if (Math.abs(v) < 1e-12) out.push(x);
    else if (pv * v < 0) { let l = px, r = x; for (let k = 0; k < 60; k++) { const m = (l + r) / 2, fm = f(m) - c; if ((f(l) - c) * fm <= 0) r = m; else l = m; } out.push((l + r) / 2); }
    px = x; pv = v;
  }
  return out.filter((x, i) => i === 0 || Math.abs(x - out[i - 1]) > 1e-6);
};


/* ---------- 01 · swap ---------- */
const REL = {
  f: [[-2, 6], [0, -3], [4, 10]],
  g: [[-7, -1], [0, 5], [1, 0], [4, 5]],
  h: [[-7, -2], [-1, 0], [2, -3], [6, 1]]
};
CA.lab('swap-lab', {
  controls: [{type: 'seg', key: 'r', label: 'Function', value: 'f', options: [['f', 'f = {(−2, 6), (0, −3), (4, 10)}'], ['g', 'g = {(−7, −1), (0, 5), (1, 0), (4, 5)}'], ['h', 'h = {(−7, −2), (−1, 0), (2, −3), (6, 1)}']]},
    {type: 'check', key: 'sw', label: 'Swap inputs and outputs', value: true}],
  top: '<div class="ca-side" id="swap-side"></div>', plot: {h: 360}, plotLabel: 'Original points and swapped points with the line y = x',
  legend: [['orange', 'original (x, y)'], ['blue', 'swapped (y, x)'], ['gray', 'y = x', true]], readouts: [['dom', 'Domain → range of the reversal'], ['rng', 'Range → domain of the reversal']]
}, (lab, st) => {
  const R = REL[st.r], sw = R.map(([x, y]) => [y, x]);
  const outs = R.map(p => p[1]), rep = outs.filter((v, i) => outs.indexOf(v) !== i);
  const one = rep.length === 0;
  document.getElementById('swap-side').innerHTML = `<div><small>ORIGINAL · ${st.r}</small>${chips(R)}</div><div><small>REVERSED</small>${st.sw ? chips(sw, rep) : '<span class="ca-note">Check “Swap inputs and outputs”.</span>'}</div>`;
  const P = lab.plane({xmin: -9, xmax: 12, ymin: -9, ymax: 12, equal: true});
  P.lineMB(1, 0, {color: 'gray', dash: '7 6', width: 2});
  R.forEach(([x, y]) => { P.point(x, y, {color: 'orange'}); if (st.sw) { P.seg(x, y, y, x, {color: 'purple', dash: '3 5', width: 1.5}); P.point(y, x, {color: 'blue'}); } });
  P.render();
  lab.read('dom', `${set(R.map(p => p[0]))}`); lab.read('rng', `${set(outs)}`);
  lab.out(one ? `✓ No output of ${st.r} repeats, so ${st.r} is <b>one-to-one</b>. The reversed set is a function: ${st.r}⁻¹ = {${sw.map(([a, b]) => pt(a, b)).join(', ')}}.`
    : `✕ The output ${fmt(rep[0])} appears twice in ${st.r}. After swapping, the input ${fmt(rep[0])} would have two outputs, so the reversal is <b>not a function</b>: ${st.r} has no inverse.`, one ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 03 · mirror over y = x ---------- */
const MF = {
  lin: {label: 'f(x) = 2x + 1', f: x => 2 * x + 1, inv: x => (x - 1) / 2, it: 'f⁻¹(x) = (x − 1)/2', D: '(−∞, ∞)', R: '(−∞, ∞)', t: [-3, 3, 1]},
  cub: {label: 'f(x) = x³ + 2', f: x => x ** 3 + 2, inv: x => Math.cbrt(x - 2), it: 'f⁻¹(x) = ∛(x − 2)', D: '(−∞, ∞)', R: '(−∞, ∞)', t: [-2, 1.5, 1]},
  root: {label: 'f(x) = 3 + √(x − 1)', f: x => x >= 1 ? 3 + Math.sqrt(x - 1) : NaN, inv: x => x >= 3 ? (x - 3) ** 2 + 1 : NaN, it: 'f⁻¹(x) = (x − 3)² + 1, x ≥ 3', D: '[1, ∞)', R: '[3, ∞)', t: [1, 8, 2]},
  half: {label: 'f(x) = x/2 − 1', f: x => x / 2 - 1, inv: x => 2 * x + 2, it: 'f⁻¹(x) = 2x + 2', D: '(−∞, ∞)', R: '(−∞, ∞)', t: [-4, 6, 2]}
};
CA.lab('mirror-lab', {
  controls: [{type: 'select', key: 'f', label: 'Function', value: 'root', options: Object.entries(MF).map(([k, v]) => [k, v.label])},
    {type: 'range', key: 't', label: 'Point at x =', min: 1, max: 8, step: 0.25, value: 2, fmt: v => num(v)},
    {type: 'check', key: 'inv', label: 'Show the whole graph of f⁻¹', value: true}],
  plot: {h: 420}, plotLabel: 'A function, its inverse, and the line y = x', legend: [['orange', 'f'], ['blue', 'f⁻¹'], ['gray', 'y = x', true]],
  readouts: [['df', 'Domain of f = range of f⁻¹'], ['rf', 'Range of f = domain of f⁻¹'], ['eq', 'Inverse']]
}, (lab, st, key) => {
  const M = MF[st.f];
  if (key === 'f') { const el = st.input('t'); el.min = M.t[0]; el.max = M.t[1]; st.set('t', M.t[2], true); }
  const a = st.t, b = M.f(a), P = lab.plane({xmin: -6, xmax: 12, ymin: -6, ymax: 12});
  P.lineMB(1, 0, {color: 'gray', dash: '7 6', width: 2});
  P.curve(M.f, {color: 'orange', width: 3.4});
  if (st.inv) P.curve(M.inv, {color: 'blue', width: 3.2});
  P.seg(a, b, b, a, {color: 'purple', dash: '4 5', width: 1.8});
  P.point(a, b, {color: 'orange', r: 7, label: `(${num(a)}, ${num(b)})`}).point(b, a, {color: 'blue', r: 7, label: `(${num(b)}, ${num(a)})`});
  P.render();
  lab.read('df', M.D); lab.read('rf', M.R); lab.read('eq', M.it);
  lab.out(`f(${num(a)}) = ${num(b)}, so f⁻¹(${num(b)}) = ${num(a)}. The dashed segment joining the two points is cut in half by the line y = x at a right angle.`);
});

/* ---------- 04 · verify by composition ---------- */
const VP = {
  a: {f: 'f(x) = x³ + 2', g: 'g(x) = ∛(x − 2)', fe: x => x ** 3 + 2, ge: x => Math.cbrt(x - 2), ok: true,
    fg: 'f(g(x)) = (∛(x − 2))³ + 2 = x − 2 + 2 = x', gf: 'g(f(x)) = ∛((x³ + 2) − 2) = ∛(x³) = x'},
  b: {f: 'f(x) = 4x³', g: 'g(x) = x/4', fe: x => 4 * x ** 3, ge: x => x / 4, ok: false,
    fg: 'f(g(x)) = 4(x/4)³ = 4 · x³/64 = x³/16 ≠ x', gf: 'g(f(x)) = 4x³/4 = x³ ≠ x'},
  c: {f: 'f(x) = 2x + 1', g: 'g(x) = (x − 1)/2', fe: x => 2 * x + 1, ge: x => (x - 1) / 2, ok: true,
    fg: 'f(g(x)) = 2·(x − 1)/2 + 1 = x − 1 + 1 = x', gf: 'g(f(x)) = ((2x + 1) − 1)/2 = 2x/2 = x'},
  d: {f: 'f(x) = x − 5', g: 'g(x) = x + 5', fe: x => x - 5, ge: x => x + 5, ok: true,
    fg: 'f(g(x)) = (x + 5) − 5 = x', gf: 'g(f(x)) = (x − 5) + 5 = x'},
  e: {f: 'f(x) = 3x', g: 'g(x) = x + 3', fe: x => 3 * x, ge: x => x + 3, ok: false,
    fg: 'f(g(x)) = 3(x + 3) = 3x + 9 ≠ x', gf: 'g(f(x)) = 3x + 3 ≠ x'}
};
CA.lab('verify-lab', {
  controls: [{type: 'select', key: 'p', label: 'Pair', value: 'a', options: Object.entries(VP).map(([k, v]) => [k, `${v.f} and ${v.g}`])}],
  top: '<div class="ca-side" id="verify-side"></div><div class="ca-scroll-x"><table class="ca-data-table" id="verify-table" aria-label="Numerical check"></table></div>'
}, (lab, st) => {
  const V = VP[st.p];
  document.getElementById('verify-side').innerHTML = `<div><small>COMPOSE ONE WAY</small>${V.fg}</div><div><small>COMPOSE THE OTHER WAY</small>${V.gf}</div>`;
  const xs = [-2, -1, 0, 1, 3];
  document.getElementById('verify-table').innerHTML = `<tr><th>x</th>${xs.map(x => `<td>${fmt(x)}</td>`).join('')}</tr><tr><th>f(g(x))</th>${xs.map(x => { const v = V.fe(V.ge(x)); return `<td class="${Math.abs(v - x) < 1e-9 ? 'hl2' : 'hl'}">${num(v, 3)}</td>`; }).join('')}</tr><tr><th>g(f(x))</th>${xs.map(x => { const v = V.ge(V.fe(x)); return `<td class="${Math.abs(v - x) < 1e-9 ? 'hl2' : 'hl'}">${num(v, 3)}</td>`; }).join('')}</tr>`;
  lab.out(V.ok ? '✓ Both compositions give x, so f and g are <b>inverses</b> of each other: g = f⁻¹ and f = g⁻¹. (Blue cells: the output equals the input.)'
    : '✕ At least one composition is not x, so f and g are <b>not</b> inverses. A single input where f(g(x)) ≠ x is enough to show it. (Orange cells: the output differs from the input.)', V.ok ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 05 · find the inverse ---------- */
const FI = {
  n34: {f: 'f(x) = 3x − 4', fe: x => 3 * x - 4, ie: x => x / 3 + 4 / 3, res: 'f⁻¹(x) = x/3 + 4/3',
    steps: [['1 · Replace f(x) with y', 'y = 3x − 4'], ['2 · Solve for x', 'y + 4 = 3x, so x = (y + 4)/3'], ['3 · Interchange x and y', 'y = (x + 4)/3'], ['4 · Simplify', 'y = x/3 + 4/3'], ['5 · Replace y with f⁻¹(x)', 'f⁻¹(x) = x/3 + 4/3']]},
  rat: {f: 'f(x) = 2/(x − 1) + 6', fe: x => 2 / (x - 1) + 6, ie: x => 2 / (x - 6) + 1, res: 'f⁻¹(x) = 2/(x − 6) + 1', br: [1], ibr: [6],
    steps: [['1 · Replace f(x) with y', 'y = 2/(x − 1) + 6'], ['2 · Interchange x and y', 'x = 2/(y − 1) + 6'], ['3 · Subtract 6', 'x − 6 = 2/(y − 1)'], ['4 · Multiply by (y − 1), divide by (x − 6)', 'y − 1 = 2/(x − 6)'], ['5 · Add 1', 'y = 2/(x − 6) + 1'], ['6 · Replace y with f⁻¹(x)', 'f⁻¹(x) = 2/(x − 6) + 1']]},
  root: {f: 'g(x) = 3 + √(x − 1)', fe: x => x >= 1 ? 3 + Math.sqrt(x - 1) : NaN, ie: x => x >= 3 ? (x - 3) ** 2 + 1 : NaN, res: 'g⁻¹(x) = (x − 3)² + 1, x ≥ 3',
    steps: [['1 · Replace g(x) with y', 'y = 3 + √(x − 1)'], ['2 · Interchange x and y', 'x = 3 + √(y − 1)'], ['3 · Subtract 3', 'x − 3 = √(y − 1)'], ['4 · Square both sides', '(x − 3)² = y − 1'], ['5 · Add 1', 'y = (x − 3)² + 1'], ['6 · Domain of the inverse = range of g = [3, ∞)', 'g⁻¹(x) = (x − 3)² + 1, x ≥ 3']]},
  lin: {f: 'f(x) = 2x + 5', fe: x => 2 * x + 5, ie: x => (x - 5) / 2, res: 'f⁻¹(x) = (x − 5)/2',
    steps: [['1 · Replace f(x) with y', 'y = 2x + 5'], ['2 · Interchange x and y', 'x = 2y + 5'], ['3 · Subtract 5', 'x − 5 = 2y'], ['4 · Divide by 2', 'y = (x − 5)/2'], ['5 · Replace y with f⁻¹(x)', 'f⁻¹(x) = (x − 5)/2']]},
  cub: {f: 'f(x) = x³ − 1', fe: x => x ** 3 - 1, ie: x => Math.cbrt(x + 1), res: 'f⁻¹(x) = ∛(x + 1)',
    steps: [['1 · Replace f(x) with y', 'y = x³ − 1'], ['2 · Interchange x and y', 'x = y³ − 1'], ['3 · Add 1', 'x + 1 = y³'], ['4 · Take the cube root', 'y = ∛(x + 1)'], ['5 · Replace y with f⁻¹(x)', 'f⁻¹(x) = ∛(x + 1)']]},
  frac: {f: 'f(x) = (x − 4)/3', fe: x => (x - 4) / 3, ie: x => 3 * x + 4, res: 'f⁻¹(x) = 3x + 4',
    steps: [['1 · Replace f(x) with y', 'y = (x − 4)/3'], ['2 · Interchange x and y', 'x = (y − 4)/3'], ['3 · Multiply by 3', '3x = y − 4'], ['4 · Add 4', 'y = 3x + 4'], ['5 · Replace y with f⁻¹(x)', 'f⁻¹(x) = 3x + 4']]}
};
let findStep = 0, findStepper;
const find = CA.lab('find-lab', {
  controls: [{type: 'select', key: 'f', label: 'Function', value: 'n34', options: Object.entries(FI).map(([k, v]) => [k, v.f])},
    {type: 'range', key: 'x', label: 'Test input x =', min: 1.5, max: 8, step: 0.5, value: 3, fmt: v => num(v)}],
  top: '<div id="find-stepper"></div>', steps: true, plot: {h: 380}, plotLabel: 'Function, inverse, and y = x',
  legend: [['orange', 'f'], ['blue', 'f⁻¹'], ['gray', 'y = x', true]]
}, (lab, st, key) => { if (key === 'f') { findStep = 0; findStepper && findStepper.reset(); return; } drawFind(lab, st); });
function drawFind(lab, st) {
  const F = FI[st.f], x = st.x;
  lab.steps(F.steps.slice(0, findStep + 1));
  const P = lab.plane({xmin: -4, xmax: 12, ymin: -4, ymax: 12});
  P.lineMB(1, 0, {color: 'gray', dash: '7 6', width: 2}).curve(F.fe, {color: 'orange', width: 3.2, breaks: F.br || []});
  if (findStep >= F.steps.length - 1) P.curve(F.ie, {color: 'blue', width: 3.2, breaks: F.ibr || []});
  const y = F.fe(x), back = F.ie(y);
  P.point(x, y, {color: 'orange', r: 6}); if (findStep >= F.steps.length - 1) P.point(y, x, {color: 'blue', r: 6});
  P.render();
  lab.out(findStep < F.steps.length - 1 ? 'Use <b>Next step</b> to finish the algebra. The graph of the inverse appears at the last step.'
    : `<b>${F.res}</b>. Test: f(${num(x)}) = ${num(y, 4)}, and f⁻¹(${num(y, 4)}) = ${num(back, 4)} ✓ — the inverse sends the output back to the input.`);
}
findStepper = CA.stepper('find-stepper', () => FI[find.state.f].steps.length, i => { findStep = i; drawFind(find, find.state); });

/* ---------- 06 · restricting the domain ---------- */
const hq = x => (x - 2) ** 2 - 1;
CA.lab('restrict-lab', {
  controls: [{type: 'seg', key: 'r', label: 'Domain', value: 'all', options: [['all', 'all real numbers'], ['right', 'x ≥ 2'], ['left', 'x ≤ 2']]},
    {type: 'range', key: 'c', label: 'Horizontal line y =', min: -1, max: 6, step: 0.5, value: 3, fmt: v => num(v)}],
  plot: {h: 400}, plotLabel: 'Restricted parabola and its inverse', legend: [['orange', 'h on the chosen domain'], ['blue', 'h⁻¹'], ['gray', 'y = x', true]],
  readouts: [['dom', 'Domain of h'], ['rng', 'Range of h'], ['inv', 'Inverse']]
}, (lab, st) => {
  const r = st.r, c = st.c, P = lab.plane({xmin: -3, xmax: 8, ymin: -3, ymax: 8});
  const keep = x => r === 'all' || (r === 'right' ? x >= 2 : x <= 2);
  P.lineMB(1, 0, {color: 'gray', dash: '7 6', width: 2});
  if (r !== 'all') P.curve(hq, {color: 'gray', width: 2, opacity: .35});
  P.curve(x => keep(x) ? hq(x) : NaN, {color: 'orange', width: 3.6});
  if (r !== 'all') P.curve(x => x >= -1 ? (r === 'right' ? 2 + Math.sqrt(x + 1) : 2 - Math.sqrt(x + 1)) : NaN, {color: 'blue', width: 3.2});
  const xs = [2 - Math.sqrt(c + 1), 2 + Math.sqrt(c + 1)].filter((v, i, a) => keep(v) && (i === 0 || Math.abs(v - a[0]) > 1e-9));
  P.hline(c, {color: xs.length > 1 ? 'red' : 'green', width: 2.4});
  xs.forEach(x => P.point(x, c, {color: xs.length > 1 ? 'red' : 'green', r: 7}));
  P.render();
  lab.read('dom', r === 'all' ? '(−∞, ∞)' : r === 'right' ? '[2, ∞)' : '(−∞, 2]'); lab.read('rng', '[−1, ∞)');
  lab.read('inv', r === 'all' ? 'none: not one-to-one' : r === 'right' ? 'h⁻¹(x) = 2 + √(x + 1)' : 'h⁻¹(x) = 2 − √(x + 1)');
  lab.out(r === 'all' ? `The line y = ${num(c)} meets the whole parabola ${xs.length} time${xs.length === 1 ? '' : 's'}. Since some lines meet it twice, h is not one-to-one. Choose a half.`
    : `On ${r === 'right' ? '[2, ∞)' : '(−∞, 2]'} every horizontal line meets the graph at most once. Solving y = (x − 2)² − 1 for x gives x = 2 ${r === 'right' ? '+' : '−'} √(y + 1); the inverse has domain [−1, ∞) and range ${r === 'right' ? '[2, ∞)' : '(−∞, 2]'}.`);
});

})();

/* reused from 6-3.js */
(() => {
'use strict';
const {fmt, num, F, Rad, toRad, toDeg} = CA;
const PI = Math.PI, nx = v => CA.niceX(v);
const RES = {sin: {a: -PI / 2, b: PI / 2, rng: [-1, 1]}, cos: {a: 0, b: PI, rng: [-1, 1]}, tan: {a: -PI / 2 + 0.06, b: PI / 2 - 0.06, rng: null}};
const UC_WIN = {xmin: -1.5, xmax: 1.5, ymin: -1.3, ymax: 1.3, w: 520, h: 400, xstep: 0.5, ystep: 0.5};


/* ---------- 01 · restrict and reflect ---------- */
CA.lab('res-lab', {
  controls: [{type: 'seg', key: 'fn', label: 'Function', value: 'sin', options: [['sin', 'sine'], ['cos', 'cosine'], ['tan', 'tangent']]}, {type: 'range', key: 's', label: 'Reflection', min: 0, max: 100, step: 5, value: 0, fmt: v => v + '%'}, {type: 'check', key: 'hlt', label: 'Show a horizontal line', value: true}],
  plot: {xmin: -3.6, xmax: 3.6, ymin: -2.6, ymax: 3.6, w: 600, h: 400, xpi: F(1, 2)}, plotLabel: 'Restricting and reflecting a trig graph', legend: [['gray', 'full graph'], ['orange', 'restricted piece'], ['blue', 'inverse']], readouts: [['dom', 'Restricted domain'], ['rng', 'Range'], ['inv', 'Inverse: domain → range']]
}, (lab, st) => {
  const fn = st.fn, f = Math[fn], R = RES[fn], s = st.s / 100, P = lab.plane();
  P.curve(x => x, {color: 'gray', dash: '5 5', width: 1.4});
  if (s === 0) P.curve(f, {color: 'gray', width: 2, opacity: 0.6, breaks: fn === 'tan' ? [-3 * PI / 2, -PI / 2, PI / 2, 3 * PI / 2] : [], samples: 1400});
  const lo = fn === 'tan' ? -PI / 2 + 0.002 : R.a, hi = fn === 'tan' ? PI / 2 - 0.002 : R.b;
  if (s < 1) P.param(t => (1 - s) * t + s * f(t), t => (1 - s) * f(t) + s * t, lo, hi, {color: s === 0 ? 'orange' : 'purple', width: 3.4, samples: 600});
  if (s === 1) P.curve({sin: Math.asin, cos: Math.acos, tan: Math.atan}[fn], {color: 'blue', width: 3.6, samples: 1200});
  if (st.hlt && s === 0) { const k = fn === 'tan' ? 1 : 0.5; P.hline(k, {color: 'green', dash: '6 5', width: 2}); const xs = []; for (let x = -3.6; x <= 3.6; x += 0.002) { const y1 = f(x), y2 = f(x + 0.002); if (Number.isFinite(y1) && Number.isFinite(y2) && Math.abs(y1 - y2) < 1 && (y1 - k) * (y2 - k) <= 0) xs.push(x); } xs.forEach(x => P.point(x, k, {color: x >= lo && x <= hi ? 'orange' : 'green', r: 5})); }
  P.render();
  const dom = {sin: '[−π/2, π/2]', cos: '[0, π]', tan: '(−π/2, π/2)'}[fn], rng = fn === 'tan' ? '(−∞, ∞)' : '[−1, 1]';
  lab.read('dom', dom); lab.read('rng', rng); lab.read('inv', `${fn}⁻¹: ${rng} → ${dom}`);
  lab.out(s === 0 ? `The green line meets the full graph many times, so ${fn} x is not one-to-one. On ${dom} (orange) it meets the graph only once: that piece has an inverse.` : s < 1 ? 'Each point (x, y) of the restricted piece travels across y = x toward (y, x).' : `The blue curve is y = ${fn}⁻¹x. Its domain ${rng} is the range of the piece, and its range ${dom} is the restricted domain.`);
});

/* ---------- 02 · evaluate inverse values ---------- */
const INV_PRE = [['sin', '0', 'sin⁻¹(0)'], ['sin', '-√2/2', 'sin⁻¹(−√2/2)'], ['cos', '-√2/2', 'cos⁻¹(−√2/2)'], ['cos', '0.7439', 'cos⁻¹(0.7439)'],
  ['tan', '2.6851', 'tan⁻¹(2.6851)'], ['tan', '-√3', 'tan⁻¹(−√3)'], ['cos', '0', 'cos⁻¹(0)'], ['cos', '-0.1374', 'cos⁻¹(−0.1374)'],
  ['sin', '0.2219', 'sin⁻¹(0.2219)'], ['sin', '-√3/2', 'sin⁻¹(−√3/2)'], ['tan', '-4.0152', 'tan⁻¹(−4.0152)'], ['tan', '√3/3', 'tan⁻¹(√3/3)']];
CA.lab('inv-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: '1', options: INV_PRE.map((p, i) => [String(i), p[2]]).concat([['own', 'Type your own']])},
    {type: 'seg', key: 'fn', label: 'Inverse', value: 'sin', options: [['sin', 'sin⁻¹'], ['cos', 'cos⁻¹'], ['tan', 'tan⁻¹']]}, {type: 'text', key: 'v', label: 'Value', value: '-√2/2', placeholder: '−√3/2 or 0.62'}],
  plot: UC_WIN, plotLabel: 'Unit circle with the allowed arc for the inverse function', readouts: [['ans', 'Answer (radians)'], ['deg', 'In degrees'], ['q', 'Where it lies']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = INV_PRE[+st.pre]; st.set('fn', p[0], true); st.set('v', p[1], true); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const fn = st.fn, I = CA.INV[fn], V = CA.parseReal(st.v), P = lab.plane();
  const arc = {sin: [-PI / 2, PI / 2], cos: [0, PI], tan: [-PI / 2, PI / 2]}[fn];
  P.param(t => Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.6}).param(t => Math.cos(t), t => Math.sin(t), arc[0], arc[1], {color: 'green', width: 7, opacity: 0.6});
  if (!V) { P.render(); lab.out('Type a number such as −√3/2, 1/2, 2.6851, or −√3.', 'ca-incorrect'); lab.steps([]); return; }
  if (fn !== 'tan' && Math.abs(V.v) > 1 + 1e-12) { P.render(); lab.read('ans', 'undefined'); lab.read('deg', '—'); lab.read('q', '—'); lab.steps([]); lab.out(`${fn}⁻¹(${V.str}) is undefined: the domain of ${fn}⁻¹ is [−1, 1], because ${fn} of an angle is a coordinate on the unit circle.`, 'ca-incorrect'); return; }
  const th = I.f(V.v), d = CA.invExact(fn, V.v), x = Math.cos(th), y = Math.sin(th);
  if (fn === 'sin') P.hline(V.v, {color: 'blue', dash: '6 5', width: 2}); else if (fn === 'cos') P.vline(V.v, {color: 'blue', dash: '6 5', width: 2}); else P.seg(-1.6 * Math.cos(th), -1.6 * Math.sin(th), 1.6 * Math.cos(th), 1.6 * Math.sin(th), {color: 'blue', dash: '6 5', width: 2});
  CA.drawAngle(P, th, {circle: false, pointLabel: d !== null ? CA.radText(d) : num(th, 4), arcR: 0.25}).render();
  const ansTxt = d !== null ? CA.radText(d) : `≈ ${num(th, 4)}`, q = Math.abs(th) < 1e-12 ? 'on the positive x-axis' : CA.quadName(toDeg(th));
  lab.read('ans', ansTxt); lab.read('deg', d !== null ? `${d}°` : `≈ ${num(toDeg(th), 2)}°`); lab.read('q', q);
  const where = {sin: '[−π/2, π/2]', cos: '[0, π]', tan: '(−π/2, π/2)'}[fn], what = {sin: 'sine (y-coordinate)', cos: 'cosine (x-coordinate)', tan: 'tangent (y/x)'}[fn];
  lab.steps([['Translate', `${fn}⁻¹(${V.str}) = θ means ${fn} θ = ${V.str} with θ in ${where}`], ['Sign and quadrant', V.v === 0 ? 'value 0' : `${what} is ${V.v > 0 ? 'positive' : 'negative'}, so θ is ${fn === 'cos' ? (V.v > 0 ? 'in Quadrant I (0 to π/2)' : 'in Quadrant II (π/2 to π)') : (V.v > 0 ? 'in Quadrant I (0 to π/2)' : 'in Quadrant IV (−π/2 to 0)')}`],
    d !== null ? ['Special value', `${fn}(${CA.radText(d)}) = ${CA.exact(fn, d).str()}, so θ = ${CA.radText(d)}`] : ['Calculator (radian mode)', `θ = ${fn}⁻¹(${V.str}) ≈ ${num(th, 4)} rad ≈ ${num(toDeg(th), 2)}°`]]);
  lab.out(`${fn}⁻¹(${V.str}) = <b>${ansTxt}</b>. Other angles have the same ${fn} value, but only this one lies on the green arc ${where}.`, 'ca-correct');
});

/* ---------- 03 · compositions ---------- */
const CP = [
  {m: 'ff', fn: 'sin', v: '0.62', t: 'sin(sin⁻¹(0.62))'}, {m: 'ff', fn: 'cos', v: '-1/4', t: 'cos(cos⁻¹(−1/4))'}, {m: 'ff', fn: 'tan', v: '5.394', t: 'tan(tan⁻¹(5.394))'},
  {m: 'ff', fn: 'sin', v: '-2.8', t: 'sin(sin⁻¹(−2.8))'}, {m: 'ff', fn: 'cos', v: '5/3', t: 'cos(cos⁻¹(5/3))'},
  {m: 'if', fn: 'sin', v: '2π/5', t: 'sin⁻¹(sin(2π/5))'}, {m: 'if', fn: 'cos', v: '3π/4', t: 'cos⁻¹(cos(3π/4))'}, {m: 'if', fn: 'tan', v: '-4π/9', t: 'tan⁻¹(tan(−4π/9))'},
  {m: 'if', fn: 'sin', v: '5π/6', t: 'sin⁻¹(sin(5π/6))'}, {m: 'if', fn: 'cos', v: '7π/4', t: 'cos⁻¹(cos(7π/4))'}, {m: 'if', fn: 'tan', v: '8π/7', t: 'tan⁻¹(tan(8π/7))'},
  {m: 'if', fn: 'sin', v: '5π/4', t: 'sin⁻¹(sin(5π/4))'}, {m: 'if', fn: 'tan', v: '9π/10', t: 'tan⁻¹(tan(9π/10))'},
  {m: 'ig', fn: 'cos', g: 'sin', v: '7π/3', t: 'cos⁻¹(sin(7π/3))'}, {m: 'ig', fn: 'sin', g: 'cos', v: 'π', t: 'sin⁻¹(cos(π))'}, {m: 'ig', fn: 'tan', g: 'cos', v: '2π/5', t: 'tan⁻¹(cos(2π/5))'},
  {m: 'ig', fn: 'sin', g: 'cos', v: '4π/3', t: 'sin⁻¹(cos(4π/3))'}, {m: 'ig', fn: 'cos', g: 'sin', v: '-π/4', t: 'cos⁻¹(sin(−π/4))'}
];
const RNG = {sin: [-PI / 2, PI / 2, '[−π/2, π/2]'], cos: [0, PI, '[0, π]'], tan: [-PI / 2, PI / 2, '(−π/2, π/2)']};
const valStr = (fn, ang) => { const d = Math.round(ang.deg * 1e6) / 1e6, e = Number.isInteger(d) ? CA.exact(fn, d) : null; return e ? e.str() : num(CA.trig[fn](ang.v), 5); };
CA.lab('comp-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Expression', value: '8', options: CP.map((p, i) => [String(i), p.t])}],
  top: '<div class="ca-equation" id="comp-expr"></div>', plot: UC_WIN, plotLabel: 'Angles in the composition', readouts: [['inner', 'Inner value'], ['ans', 'Result']], steps: true
}, (lab, st) => {
  const p = CP[+st.pre], fn = p.fn, P = lab.plane(), R = RNG[fn];
  P.param(t => Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.6}).param(t => Math.cos(t), t => Math.sin(t), R[0], R[1], {color: 'green', width: 7, opacity: 0.55});
  const ex = document.getElementById('comp-expr');
  if (p.m === 'ff') {
    const V = CA.parseReal(p.v); ex.textContent = `${fn}(${fn}⁻¹(${V.str}))`;
    const ok = fn === 'tan' || Math.abs(V.v) <= 1; P.render();
    lab.read('inner', ok ? `${fn}⁻¹(${V.str}) is an angle in ${R[2]}` : 'undefined'); lab.read('ans', ok ? V.str : 'undefined');
    lab.steps([['Domain check', fn === 'tan' ? 'tan⁻¹ accepts every real number' : `${V.str} ${ok ? 'is' : 'is not'} in [−1, 1], the domain of ${fn}⁻¹`], ['Result', ok ? `${fn}(${fn}⁻¹(${V.str})) = ${V.str}` : `${fn}⁻¹(${V.str}) does not exist, so the expression is undefined`]]);
    lab.out(ok ? `${fn} undoes ${fn}⁻¹, so the answer is <b>${V.str}</b>.` : `<b>Undefined.</b> No angle has ${fn} equal to ${V.str}.`, ok ? 'ca-correct' : 'ca-incorrect'); return;
  }
  const A = CA.parseAngle(p.v, 'rad'), g = p.m === 'ig' ? p.g : fn, inner = CA.trig[g](A.v), th = CA.INV[fn].f(inner), thF = CA.simpleFrac(th / PI), dIn = CA.invExact(fn, inner);
  ex.textContent = `${fn}⁻¹(${g}(${CA.piStr(A.f)}))`;
  CA.drawAngle(P, A.v, {circle: false, point: true, color: 'gray', arcR: 0.18, pointLabel: CA.piStr(A.f), pointLabelOpt: {size: 11.5}});
  CA.drawAngle(P, th, {circle: false, point: true, arcR: 0.3, pointLabel: dIn !== null ? CA.radText(dIn) : num(th, 4), pointLabelOpt: {size: 12}}).render();
  const innerTxt = valStr(g, A), ansTxt = dIn !== null ? CA.radText(dIn) : thF ? CA.piStr(thF) : `≈ ${num(th, 4)}`;
  lab.read('inner', `${g}(${CA.piStr(A.f)}) = ${innerTxt}`); lab.read('ans', ansTxt);
  const steps = [['Inner value', `${g}(${CA.piStr(A.f)}) = ${innerTxt}`]];
  if (p.m === 'if') { const inside = A.v >= R[0] - 1e-12 && A.v <= R[1] + 1e-12 && !(fn === 'tan' && Math.abs(Math.abs(A.v) - PI / 2) < 1e-12); steps.push(['Restricted domain', `${CA.piStr(A.f)} ${inside ? 'is' : 'is not'} in ${R[2]}`]); if (!inside) steps.push(['Find θ in the restricted domain', `${fn}(${ansTxt}) = ${innerTxt} too, and ${ansTxt} is in ${R[2]}`]); }
  else steps.push(['Outer inverse', `${fn}⁻¹(${innerTxt}) = ${ansTxt}${dIn !== null ? ' (special value)' : ' (calculator)'}`]);
  lab.steps(steps);
  lab.out(`${ex.textContent} = <b>${ansTxt}</b>. The gray angle is the original input; the orange angle is the answer on the green arc ${R[2]}.`, 'ca-correct');
});

})();

/* ---------- 07 · all six inverse trigonometric functions ---------- */
(() => {
'use strict';
const {num} = CA, PI = Math.PI, nx = v => CA.niceX(v);
const INV = {
  sin: {n: 'sin⁻¹x', f: Math.sin, inv: Math.asin, a: -PI / 2, b: PI / 2, gaps: [], dom: '[−1, 1]', rng: '[−π/2, π/2]', inD: x => Math.abs(x) <= 1, ok: x => [[-1, 1]]},
  cos: {n: 'cos⁻¹x', f: Math.cos, inv: Math.acos, a: 0, b: PI, gaps: [], dom: '[−1, 1]', rng: '[0, π]', inD: x => Math.abs(x) <= 1, ok: x => [[-1, 1]]},
  tan: {n: 'tan⁻¹x', f: Math.tan, inv: Math.atan, a: -PI / 2 + 1e-3, b: PI / 2 - 1e-3, gaps: [], dom: '(−∞, ∞)', rng: '(−π/2, π/2)', inD: () => true, ok: () => [[-5, 5]], asy: [PI / 2, -PI / 2]},
  cot: {n: 'cot⁻¹x', f: x => 1 / Math.tan(x), inv: x => PI / 2 - Math.atan(x), a: 1e-3, b: PI - 1e-3, gaps: [], dom: '(−∞, ∞)', rng: '(0, π)', inD: () => true, ok: () => [[-5, 5]], asy: [0, PI]},
  csc: {n: 'csc⁻¹x', f: x => 1 / Math.sin(x), inv: x => Math.asin(1 / x), a: -PI / 2, b: PI / 2, gaps: [0], dom: '(−∞, −1] ∪ [1, ∞)', rng: '[−π/2, 0) ∪ (0, π/2]', inD: x => Math.abs(x) >= 1, ok: () => [[-5, -1], [1, 5]], asy: [0]},
  sec: {n: 'sec⁻¹x', f: x => 1 / Math.cos(x), inv: x => Math.acos(1 / x), a: 0, b: PI, gaps: [PI / 2], dom: '(−∞, −1] ∪ [1, ∞)', rng: '[0, π/2) ∪ (π/2, π]', inD: x => Math.abs(x) >= 1, ok: () => [[-5, -1], [1, 5]], asy: [PI / 2]}
};
CA.lab('invsix-lab', {
  controls: [{type: 'seg', key: 'fn', label: 'Inverse', value: 'sec', options: Object.entries(INV).map(([k, v]) => [k, v.n])}, {type: 'check', key: 'orig', label: 'Show the restricted original', value: true},
    {type: 'range', key: 'x', label: 'Input x =', min: -4, max: 4, step: 0.05, value: 2, fmt: v => num(v, 2)}],
  plot: {xmin: -5, xmax: 5, ymin: -3.6, ymax: 3.6, w: 560, h: 420}, plotLabel: 'Inverse trigonometric function and the restricted original',
  legend: [['blue', 'inverse'], ['orange', 'restricted original', true], ['gray', 'y = x', true]], readouts: [['d', 'Domain'], ['r', 'Range'], ['v', 'Value'], ['chk', 'Check']]
}, (lab, st) => {
  const I = INV[st.fn], P = lab.plane(), x = st.x;
  P.lineMB(1, 0, {color: 'gray', dash: '7 6', width: 1.6});
  [[PI / 2, 'π/2'], [-PI / 2, '−π/2'], [PI, 'π']].forEach(([y, t]) => P.hline(y, {color: 'gray', dash: '2 5', width: 1}).label(-4.9, y, t, {color: 'gray', anchor: 'start', dx: 0, dy: -5, size: 11.5}));
  (I.asy || []).forEach(y => P.hline(y, {color: 'purple', dash: '6 5', width: 1.4}));
  if (st.orig) P.curve(I.f, {color: 'orange', width: 2.4, dash: '8 6', from: I.a, to: I.b, breaks: I.gaps});
  I.ok().forEach(([a, b]) => P.curve(I.inv, {color: 'blue', width: 3.6, from: a, to: b}));
  if (st.fn === 'sec' || st.fn === 'csc') [[1, I.inv(1)], [-1, I.inv(-1)]].forEach(([a, b]) => P.point(a, b, {color: 'blue', r: 4.5}));
  if (st.fn === 'sin' || st.fn === 'cos') [[1, I.inv(1)], [-1, I.inv(-1)]].forEach(([a, b]) => P.point(a, b, {color: 'blue', r: 4.5}));
  lab.read('d', I.dom); lab.read('r', I.rng);
  if (!I.inD(x)) { P.vline(x, {color: 'red', dash: '4 4', width: 1.6}).render(); lab.read('v', `${I.n.replace('x', '(' + num(x, 2) + ')')} is undefined`); lab.read('chk', '—');
    lab.out(`x = ${num(x, 2)} is not in the domain ${I.dom}: no angle has ${st.fn} equal to ${num(x, 2)}.`, 'ca-incorrect'); return; }
  const y = I.inv(x); P.point(x, y, {color: 'blue', r: 7, label: `(${num(x, 2)}, ${nx(y)})`}); if (st.orig) P.point(y, x, {color: 'orange', r: 6}); P.render();
  lab.read('v', `${I.n.replace('x', '(' + num(x, 2) + ')')} = ${nx(y)}${CA.simpleFrac(y / PI) ? '' : ' rad'}`); lab.read('chk', `${st.fn}(${nx(y)}) = ${num(I.f(y), 4)}`);
  lab.out(`The answer ${nx(y)} lies in the range ${I.rng}. The point (${num(x, 2)}, ${nx(y)}) on the inverse is the mirror image of (${nx(y)}, ${num(x, 2)}) on the restricted original.`, 'ca-correct');
});
})();

/* ---------- guided problems ---------- */
(() => {
'use strict';
CA.guided('14', [
  {q: 'The inverse of f(x) = 3x − 4 is:', opts: ['f⁻¹(x) = x/3 + 4/3', 'f⁻¹(x) = 3x + 4', 'f⁻¹(x) = 1/(3x − 4)', 'f⁻¹(x) = x/3 − 4'], correct: 0, hint: 'Solve y = 3x − 4 for x.', why: 'x = (y + 4)/3; then swap x and y.', ref: {panel: 'find-inverse', what: 'the steps for finding f⁻¹', body: '<p>Write y = f(x), solve for x, then interchange x and y.</p>'}},
  {q: 'The inverse of f(x) = (2x + 1)/5 is:', opts: ['(5x − 1)/2', '(5x + 1)/2', '5/(2x + 1)', '(x − 1)/10'], correct: 0, hint: '5y = 2x + 1.', why: '2x = 5y − 1, so x = (5y − 1)/2.'},
  {q: 'Which function has no inverse?', opts: ['f(x) = 7 (constant)', 'f(x) = x³', 'f(x) = 2x − 9', 'f(x) = √x'], correct: 0, hint: 'An inverse needs one-to-one.', why: 'A constant sends every input to 7, so 7 cannot be sent back to a single input.', ref: {panel: 'swap', what: 'when an inverse exists', body: '<p>A function has an inverse exactly when it is one-to-one.</p>'}},
  {q: 'If (2, 9) is on the graph of f, which point is on the graph of f⁻¹?', opts: ['(9, 2)', '(−2, −9)', '(2, 1/9)', '(1/2, 9)'], correct: 0, hint: 'Reflect over y = x.', why: 'f(2) = 9 means f⁻¹(9) = 2.', ref: {panel: 'mirror', what: 'the graph of an inverse', body: '<p>(a, b) on f means (b, a) on f⁻¹: reflect in y = x.</p>'}},
  {q: 'f(x) = x² on [0, ∞) has inverse:', opts: ['√x', '−√x', '1/x²', 'x/2'], correct: 0, hint: 'Outputs of f⁻¹ must lie in [0, ∞).', why: 'The restricted domain [0, ∞) becomes the range of f⁻¹, so f⁻¹(x) = √x.'},
  {q: 'sin⁻¹(−√3/2) = ?', opts: ['−π/3', '4π/3', '5π/3', '−π/6'], correct: 0, hint: 'The answer must be in [−π/2, π/2].', why: 'sin(−π/3) = −√3/2 and −π/3 is in [−π/2, π/2].', ref: {panel: 'evaluate', what: 'evaluating inverse trig functions', body: '<p>sin⁻¹ answers lie in [−π/2, π/2]; cos⁻¹ answers in [0, π].</p>'}},
  {q: 'cos⁻¹(−1/2) = ?', opts: ['2π/3', '−π/3', '4π/3', 'π/3'], correct: 0, hint: 'Look in [0, π].', why: 'cos(2π/3) = −1/2 and 2π/3 is in [0, π].'},
  {q: 'The range of sec⁻¹x is:', opts: ['[0, π/2) ∪ (π/2, π]', '[−π/2, π/2]', '(0, π)', '[−π/2, 0) ∪ (0, π/2]'], correct: 0, hint: 'It is the restricted domain of secant.', why: 'Secant is restricted to [0, π] without π/2, where cos x = 0.', ref: {panel: 'all-six-inverse', what: 'the domains and ranges of the six inverses', body: '<p>sec⁻¹: domain (−∞, −1] ∪ [1, ∞), range [0, π/2) ∪ (π/2, π].</p>'}},
  {q: 'tan⁻¹(1) + cot⁻¹(1) = ?', opts: ['π/2', 'π', 'π/4', '0'], correct: 0, hint: 'Both equal π/4.', why: 'π/4 + π/4 = π/2. In fact tan⁻¹x + cot⁻¹x = π/2 for every x.'},
  {q: 'sin⁻¹(sin(5π/6)) = ?', opts: ['π/6', '5π/6', '−π/6', '7π/6'], correct: 0, hint: '5π/6 is outside [−π/2, π/2].', why: 'sin(5π/6) = 1/2 and sin⁻¹(1/2) = π/6.', ref: {panel: 'compose', what: 'compositions with inverses', body: '<p>sin⁻¹(sin x) = x only for x in [−π/2, π/2].</p>'}}
]);
})();
