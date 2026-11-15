/* Section 3.7 · Inverse Functions — interactive activities */
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

/* ---------- 02 · horizontal line test ---------- */
const HL = {
  cube: {label: 'y = x³', f: x => x ** 3, one: true, win: [-4, 4, -8, 8]},
  sq: {label: 'y = x²', f: x => x * x, one: false, win: [-4, 4, -2, 8]},
  sqr: {label: 'y = x² with x ≥ 0', f: x => x >= 0 ? x * x : NaN, one: true, win: [-4, 4, -2, 8]},
  abs: {label: 'y = |x|', f: Math.abs, one: false, win: [-4, 4, -2, 6]},
  root: {label: 'y = √x', f: x => x >= 0 ? Math.sqrt(x) : NaN, one: true, win: [-2, 9, -2, 4]},
  rec: {label: 'y = 1/x', f: x => 1 / x, one: true, win: [-5, 5, -5, 5], breaks: [0]},
  cub3: {label: 'y = x³ − 3x', f: x => x ** 3 - 3 * x, one: false, win: [-3, 3, -5, 5]}
};
CA.lab('hlt-lab', {
  controls: [{type: 'select', key: 'g', label: 'Graph', value: 'sq', options: Object.entries(HL).map(([k, v]) => [k, v.label])},
    {type: 'range', key: 'c', label: 'Horizontal line y =', min: -5, max: 7, step: 0.25, value: 1, fmt: v => num(v)}],
  plot: {h: 360}, plotLabel: 'Graph with a horizontal test line', readouts: [['n', 'Intersections on this line'], ['verdict', 'One-to-one?']]
}, (lab, st) => {
  const G = HL[st.g], [x0, x1, y0, y1] = G.win, c = st.c, P = lab.plane({xmin: x0, xmax: x1, ymin: y0, ymax: y1});
  const xs = solveNum(G.f, c, x0, x1);
  const bad = xs.length > 1;
  P.curve(G.f, {color: 'orange', width: 3.4, breaks: G.breaks || []});
  P.hline(c, {color: bad ? 'red' : 'green', dash: '8 6', width: 2.6});
  xs.forEach(x => P.point(x, c, {color: bad ? 'red' : 'green', r: 7}));
  P.render();
  lab.read('n', `${xs.length} ${xs.length ? '(x = ' + xs.map(x => num(x)).join(', ') + ')' : ''}`);
  lab.read('verdict', G.one ? '<span class="ca-ok">yes · has an inverse</span>' : '<span class="ca-bad">no</span>');
  lab.out(bad ? `This line meets the graph ${xs.length} times: the output ${num(c)} comes from ${xs.length} different inputs. One such line proves the function is <b>not one-to-one</b>.`
    : G.one ? 'Every horizontal line meets this graph at most once, so the function is <b>one-to-one</b> and has an inverse.'
    : `This line meets the graph at most once, but try other heights: some horizontal line meets this graph more than once.`);
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
  controls: [{type: 'select', key: 'f', label: 'Function', value: 'rat', options: Object.entries(FI).map(([k, v]) => [k, v.f])},
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

CA.guided('37', [
  {q: 'Which function has an inverse function?', opts: ['{(1, 4), (2, 4), (3, 5)}', '{(1, 4), (2, 5), (3, 6)}', '{(0, 0), (1, 1), (−1, 1)}'], correct: 1, hint: 'Look for a repeated output.', why: 'Only {(1, 4), (2, 5), (3, 6)} has no repeated output, so it is one-to-one.'},
  {q: 'For a one-to-one function f, what is f⁻¹(x)?', opts: ['1/f(x)', 'The function that undoes f', '−f(x)'], correct: 1, hint: 'The −1 is not an exponent.', why: 'f⁻¹ reverses f: if f(a) = b then f⁻¹(b) = a. It is not 1/f(x).'},
  {q: 'Find the inverse of f(x) = 2x + 6.', opts: ['f⁻¹(x) = (x − 6)/2', 'f⁻¹(x) = 2x − 6', 'f⁻¹(x) = 1/(2x + 6)'], correct: 0, hint: 'Swap x and y in y = 2x + 6, then solve for y.', why: 'x = 2y + 6 → x − 6 = 2y → y = (x − 6)/2.'},
  {q: 'f(2) = 7 for a one-to-one function f. What is f⁻¹(7)?', opts: ['7', '2', '1/7'], correct: 1, hint: 'The inverse sends outputs back to inputs.', why: 'Since f sends 2 to 7, f⁻¹ sends 7 back to 2.'},
  {q: 'f has domain [−2, ∞) and range (−∞, 6). What is the domain of f⁻¹?', opts: ['[−2, ∞)', '(−∞, 6)', '(−∞, ∞)'], correct: 1, hint: 'Domain and range switch.', why: 'The domain of f⁻¹ is the range of f: (−∞, 6).'},
  {q: 'Which graph passes the horizontal line test?', opts: ['y = x²', 'y = |x|', 'y = x³'], correct: 2, hint: 'Which graph never repeats an output?', why: 'y = x³ is always increasing, so each output occurs once. y = x² and y = |x| repeat outputs, e.g. f(−2) = f(2).'},
  {q: 'Find the inverse of f(x) = x³ − 1.', opts: ['∛x + 1', '∛(x + 1)', 'x³ + 1'], correct: 1, hint: 'Swap, then add 1, then take the cube root.', why: 'x = y³ − 1 → y³ = x + 1 → y = ∛(x + 1).'},
  {q: 'How do you verify that g is the inverse of f?', opts: ['Check f(g(x)) = x and g(f(x)) = x', 'Check f(x)·g(x) = 1', 'Check f(x) + g(x) = 0'], correct: 0, hint: 'Inverses undo each other.', why: 'Composition in both orders must return x.'},
  {q: 'The graph of f⁻¹ is the reflection of the graph of f over which line?', opts: ['the x-axis', 'the y-axis', 'y = x'], correct: 2, hint: 'Each point (a, b) becomes (b, a).', why: 'Swapping coordinates reflects points over the line y = x.'},
  {q: 'f(x) = x² restricted to x ≥ 0 has which inverse?', opts: ['f⁻¹(x) = −√x', 'f⁻¹(x) = √x', 'f⁻¹(x) = 1/x²'], correct: 1, hint: 'The inverse must return nonnegative inputs.', why: 'Solving x = y² with y ≥ 0 gives y = √x.'}
]);
})();
