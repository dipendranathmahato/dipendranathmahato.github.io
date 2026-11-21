/* Section 1.2 · Basic Classes of Functions — interactive activities */
(() => {
'use strict';
const {fmt, num} = CA;
const $ = id => document.getElementById(id);
const sg = v => (v < 0 ? '−' : '') + fmt(Math.abs(v));
const par = v => v < 0 ? `(${sg(v)})` : fmt(v);

/* where f increases / decreases on [a, b] (numerically, from the sign of the slope) */
const runs = (f, a, b) => {
  const n = 600, out = []; let cur = null;
  for (let i = 0; i < n; i++) { const x0 = a + (b - a) * i / n, x1 = a + (b - a) * (i + 1) / n, d = f(x1) - f(x0), s = Math.abs(d) < 1e-12 ? 0 : Math.sign(d); if (!cur || cur.s !== s) { cur = {s, a: x0, b: x1}; out.push(cur); } else cur.b = x1; }
  return out;
};

/* ---------- 01 · increasing / decreasing ---------- */
const MONO = [
  {t: 'f(x) = x³ − 4x on [−1, 2]', f: x => x ** 3 - 4 * x, a: -1, b: 2, note: 'f decreases on [−1, 2/√3] and increases on [2/√3, 2], where 2/√3 ≈ 1.15 is the bottom of the valley.'},
  {t: 'f(x) = x² on [−3, 3]', f: x => x * x, a: -3, b: 3, note: 'f decreases on [−3, 0] and increases on [0, 3].'},
  {t: 'f(x) = −2x + 1 on [−3, 3]', f: x => -2 * x + 1, a: -3, b: 3, note: 'A line with negative slope is strictly decreasing everywhere.'},
  {t: 'f(x) = √x on [0, 9]', f: x => Math.sqrt(x), a: 0, b: 9, note: 'The square root is strictly increasing on its whole domain.'},
  {t: 'f(x) = 3 (constant) on [−3, 3]', f: () => 3, a: -3, b: 3, note: 'f(x₁) = f(x₂) always: a constant function is neither strictly increasing nor strictly decreasing.'}
];
CA.lab('mono-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: MONO.map((m, i) => [String(i), m.t])}, {type: 'range', key: 'u', label: 'x₁ at', min: 0, max: 100, step: 1, value: 20, fmt: v => v + '%'}, {type: 'range', key: 'v', label: 'x₂ at', min: 0, max: 100, step: 1, value: 60, fmt: v => v + '%'}],
  plot: {w: 560, h: 380}, plotLabel: 'Graph colored where it increases and decreases', legend: [['green', 'increasing'], ['red', 'decreasing'], ['blue', 'constant']], readouts: [['x', 'x₁ · x₂'], ['f', 'f(x₁) · f(x₂)'], ['cmp', 'Comparison']]
}, (lab, st, key) => {
  const M = MONO[+st.p], f = M.f, w = M.b - M.a; let u = st.u, v = st.v;
  if (u >= v) { if (key === 'u') { u = Math.max(0, v - 1); st.set('u', u, true); } else { v = Math.min(100, u + 1); st.set('v', v, true); } }
  const x1 = M.a + w * u / 100, x2 = M.a + w * v / 100, y1 = f(x1), y2 = f(x2), Y = CA.fitY(f, M.a, M.b, {pad: 0.2});
  const P = lab.plane({xmin: M.a - w * 0.12, xmax: M.b + w * 0.12, ymin: Y.ymin, ymax: Y.ymax});
  runs(f, M.a, M.b).forEach(r => P.curve(f, {color: r.s > 0 ? 'green' : r.s < 0 ? 'red' : 'blue', width: 3.6, from: r.a, to: r.b}));
  [[x1, y1, 'x₁'], [x2, y2, 'x₂']].forEach(([x, y, l]) => P.seg(x, 0, x, y, {color: 'gray', dash: true, width: 1.4}).point(x, y, {color: 'orange', r: 7, label: `f(${l})`}));
  P.render();
  lab.read('x', `${num(x1, 3)} &lt; ${num(x2, 3)}`); lab.read('f', `${num(y1, 3)} · ${num(y2, 3)}`);
  const c = Math.abs(y1 - y2) < 1e-9 ? '=' : y1 < y2 ? '&lt;' : '&gt;'; lab.read('cmp', `f(x₁) ${c} f(x₂)`);
  lab.out(M.note);
});

/* ---------- 02 · lines ---------- */
let PTS = [[-2, -1], [3, 2]];
const lineLab = CA.lab('line-lab', {
  plot: {xmin: -6, xmax: 6, ymin: -5, ymax: 5, w: 520, h: 420}, plotLabel: 'Line through two points', readouts: [['m', 'Slope m'], ['si', 'Slope-intercept'], ['sf', 'Standard form'], ['b', 'Behavior']], steps: true,
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag either point (it snaps to the grid).</p>'
}, lab => {
  const [[x1, y1], [x2, y2]] = PTS, P = lab.plane();
  if (x1 === x2) { P.vline(x1, {color: 'blue', dash: false, width: 3.2}); PTS.forEach(([x, y], i) => P.point(x, y, {color: 'orange', r: 8, label: `(${fmt(x)}, ${fmt(y)})`})); P.render();
    lab.read('m', 'undefined'); lab.read('si', '—'); lab.read('sf', `x = ${fmt(x1)}`); lab.read('b', 'vertical: not a function'); lab.steps([['Slope', `x₂ − x₁ = 0, so m is undefined`]]); lab.out('A vertical line fails the vertical line test.', 'ca-incorrect'); return; }
  const m = CA.F(y2 - y1, x2 - x1), b = CA.F(y1 * (x2 - x1) - x1 * (y2 - y1), x2 - x1), mv = m.v, bv = b.v;
  P.lineMB(mv, bv, {color: 'blue', width: 3.2}).seg(x1, y1, x2, y1, {color: 'green', width: 2.4, dash: true}).seg(x2, y1, x2, y2, {color: 'purple', width: 2.4, dash: true});
  PTS.forEach(([x, y], i) => P.point(x, y, {color: 'orange', r: 8, label: `(${fmt(x)}, ${fmt(y)})`}));
  if (Math.abs(bv) < 6) P.point(0, bv, {color: 'green', r: 5}); P.render();
  // standard form with integers: (y2−y1)x − (x2−x1)y = c
  let A = y2 - y1, B = -(x2 - x1), C = A * x1 + B * y1; const g = CA.gcd(CA.gcd(A, B), C) || 1; A /= g; B /= g; C /= g; if (A < 0 || (A === 0 && B < 0)) { A = -A; B = -B; C = -C; }
  const sf = `${A === 0 ? '' : (A === 1 ? '' : A === -1 ? '−' : fmt(A)) + 'x'}${B === 0 ? '' : (A === 0 ? (B < 0 ? '−' : '') : B < 0 ? ' − ' : ' + ') + (Math.abs(B) === 1 ? '' : fmt(Math.abs(B))) + 'y'} = ${sg(C)}`;
  const ms = m.toString(), si = mv === 0 ? `y = ${b.toString()}` : `y = ${m.n === m.d ? '' : m.n === -m.d ? '−' : m.d === 1 ? ms : '(' + ms + ')'}x${bv === 0 ? '' : bv > 0 ? ' + ' + b.toString() : ' − ' + b.neg().toString()}`;
  lab.read('m', m.toString()); lab.read('si', si); lab.read('sf', sf); lab.read('b', mv > 0 ? 'increasing' : mv < 0 ? 'decreasing' : 'constant');
  lab.steps([['Slope', `m = (y₂ − y₁)/(x₂ − x₁) = (${fmt(y2)} − ${par(y1)})/(${fmt(x2)} − ${par(x1)}) = ${sg(y2 - y1)}/${sg(x2 - x1)}${CA.F(y2 - y1, x2 - x1).toString() === `${sg(y2 - y1)}/${sg(x2 - x1)}` ? '' : ' = ' + ms}`], ['Intercept', `b = y₁ − m·x₁ = ${fmt(y1)} − (${m})(${fmt(x1)}) = ${b}`]]);
  lab.out(`Rise (purple) over run (green): ${sg(y2 - y1)} over ${sg(x2 - x1)}.`);
});
let drag = -1;
CA.drag(lineLab.svg, (x, y, ph) => {
  if (ph === 'start') { drag = PTS.findIndex(([a, b]) => Math.hypot(a - x, b - y) < 1); if (drag < 0) return false; }
  if (drag >= 0) { const nx = Math.round(x), ny = Math.round(y); if (Math.abs(nx) > 6 || Math.abs(ny) > 5) return; const other = PTS[1 - drag]; if (nx === other[0] && ny === other[1]) return; PTS[drag] = [nx, ny]; lineLab.refresh(); }
});

/* ---------- 03 · horizontal line test ---------- */
const HL = [
  {t: 'f(x) = √(x² + 7)', f: x => Math.sqrt(x * x + 7), a: -6, b: 6, one: false, why: 'f(1) = f(−1) = √8 although 1 ≠ −1.'},
  {t: 'g(x) = x³ − 8', f: x => x ** 3 - 8, a: -3, b: 3.3, one: true, why: 'If x₁ ≠ x₂ then x₁³ ≠ x₂³, so g(x₁) ≠ g(x₂).'},
  {t: 'f(x) = x²', f: x => x * x, a: -4, b: 4, one: false, why: 'f(2) = f(−2) = 4.'},
  {t: 'f(x) = x² for x ≥ 0', f: x => x * x, a: 0, b: 4, one: true, why: 'On x ≥ 0 the parabola is strictly increasing, so no two inputs share an output.'},
  {t: 'f(x) = 2x + 1', f: x => 2 * x + 1, a: -5, b: 5, one: true, why: 'A non-horizontal line is strictly increasing or decreasing.'},
  {t: 'f(x) = |x|', f: x => Math.abs(x), a: -5, b: 5, one: false, why: 'f(3) = f(−3) = 3.'}
];
CA.lab('hlt-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: HL.map((h, i) => [String(i), h.t])}, {type: 'range', key: 'y', label: 'Horizontal line y =', min: -10, max: 12, step: 0.25, value: 4}],
  plot: {w: 520, h: 420}, plotLabel: 'Horizontal line test', readouts: [['n', 'Points on the line'], ['one', 'One-to-one?']]
}, (lab, st) => {
  const H = HL[+st.p], Y = CA.fitY(H.f, H.a, H.b, {pad: 0.15}), P = lab.plane({xmin: Math.min(H.a, -1) - 0.5, xmax: H.b + 0.5, ymin: Math.min(Y.ymin, -2), ymax: Y.ymax});
  const y0 = st.y, xs = []; const n = 3000;
  for (let i = 0; i < n; i++) { const a = H.a + (H.b - H.a) * i / n, b = a + (H.b - H.a) / n, ga = H.f(a) - y0, gb = H.f(b) - y0; if (ga === 0) xs.push(a); else if (ga * gb < 0) xs.push((a + b) / 2); }
  P.curve(H.f, {color: 'blue', width: 3.2, from: H.a, to: H.b}).hline(y0, {color: xs.length > 1 ? 'red' : 'orange', width: 2.6, dash: false});
  xs.forEach(x => P.point(x, y0, {color: xs.length > 1 ? 'red' : 'orange', r: 7})); P.render();
  lab.read('n', String(xs.length)); lab.read('one', H.one ? '<span class="ca-ok">Yes</span>' : '<span class="ca-bad">No</span>');
  lab.out(xs.length > 1 ? `Two inputs, x ≈ ${num(xs[0], 2)} and x ≈ ${num(xs[1], 2)}, give the same output ${fmt(y0)}. ${H.why}` : H.one ? `${H.why}` : `Move the line: some horizontal line meets this graph twice. ${H.why}`, xs.length > 1 ? 'ca-incorrect' : H.one ? 'ca-correct' : '');
});

/* ---------- 04 · combining and composing ---------- */
const ff = x => 3 * x + 1, gg = x => x * x - 7;
const OPS = {
  sum: ['(f + g)(x)', 'f(x) + g(x) = (3x + 1) + (x² − 7)', 'x² + 3x − 6', x => ff(x) + gg(x)],
  diff: ['(f − g)(x)', 'f(x) − g(x) = (3x + 1) − (x² − 7)', '−x² + 3x + 8', x => ff(x) - gg(x)],
  prod: ['(f · g)(x)', 'f(x) · g(x) = (3x + 1)(x² − 7)', '3x³ + x² − 21x − 7', x => ff(x) * gg(x)],
  quot: ['(f/g)(x)', 'f(x)/g(x) = (3x + 1)/(x² − 7)', '(3x + 1)/(x² − 7), x ≠ ±√7', x => ff(x) / gg(x)],
  fog: ['(f ∘ g)(x)', 'f(g(x)) = f(x² − 7) = 3(x² − 7) + 1', '3x² − 21 + 1 = 3x² − 20', x => ff(gg(x))],
  gof: ['(g ∘ f)(x)', 'g(f(x)) = g(3x + 1) = (3x + 1)² − 7', '9x² + 6x + 1 − 7 = 9x² + 6x − 6', x => gg(ff(x))]
};
CA.lab('comb-lab', {
  controls: [{type: 'select', key: 'op', label: 'Combination', value: 'fog', options: Object.entries(OPS).map(([k, o]) => [k, o[0]])}, {type: 'range', key: 'x', label: 'Evaluate at x =', min: -3, max: 3, step: 0.5, value: 1}],
  plot: {xmin: -4, xmax: 4, ymin: -12, ymax: 30, w: 540, h: 400}, plotLabel: 'Graphs of f, g, and the combination', legend: [['gray', 'f(x) = 3x + 1', true], ['purple', 'g(x) = x² − 7', true], ['blue', 'the combination']], readouts: [['val', 'Value']], steps: true
}, (lab, st) => {
  const O = OPS[st.op], x = st.x, P = lab.plane(), v = O[3](x);
  P.curve(ff, {color: 'gray', width: 2, dash: true}).curve(gg, {color: 'purple', width: 2, dash: true}).curve(O[3], {color: 'blue', width: 3.4, breaks: st.op === 'quot' ? [-Math.sqrt(7), Math.sqrt(7)] : []});
  if (Number.isFinite(v)) P.point(x, v, {color: 'orange', r: 7, label: `(${fmt(x)}, ${num(v, 3)})`}); P.render();
  const chain = st.op === 'fog' ? `x = ${fmt(x)} → g(${fmt(x)}) = ${num(gg(x), 3)} → f(${num(gg(x), 3)}) = ${num(v, 3)}` : st.op === 'gof' ? `x = ${fmt(x)} → f(${fmt(x)}) = ${num(ff(x), 3)} → g(${num(ff(x), 3)}) = ${num(v, 3)}` : `f(${fmt(x)}) = ${num(ff(x), 3)}, g(${fmt(x)}) = ${num(gg(x), 3)}`;
  lab.read('val', `${O[0].replace('(x)', `(${fmt(x)})`)} = ${Number.isFinite(v) ? num(v, 4) : 'undefined'}`);
  lab.steps([['Definition', O[1]], ['Simplify', `${O[0]} = ${O[2]}`], ['At this x', chain]]);
  lab.out(st.op === 'fog' || st.op === 'gof' ? `Compare (f ∘ g)(x) = 3x² − 20 with (g ∘ f)(x) = 9x² + 6x − 6: switching the order changes the function.` : 'Sum, difference, product, and quotient combine the outputs of f and g at the same x.');
});

/* ---------- 05 · even / odd ---------- */
const EO = [
  {t: 'x²', f: x => x * x, neg: '(−x)² = x²', k: 'even'}, {t: 'x³', f: x => x ** 3, neg: '(−x)³ = −x³', k: 'odd'},
  {t: 'x³ + x + 1', f: x => x ** 3 + x + 1, neg: '(−x)³ + (−x) + 1 = −x³ − x + 1', k: 'neither'}, {t: '|x|', f: x => Math.abs(x), neg: '|−x| = |x|', k: 'even'},
  {t: 'x⁴ − 3x²', f: x => x ** 4 - 3 * x * x, neg: '(−x)⁴ − 3(−x)² = x⁴ − 3x²', k: 'even'}, {t: 'x³ − x', f: x => x ** 3 - x, neg: '(−x)³ − (−x) = −x³ + x', k: 'odd'},
  {t: '1/x', f: x => 1 / x, neg: '1/(−x) = −1/x', k: 'odd', brk: [0]}, {t: 'x² + x', f: x => x * x + x, neg: '(−x)² + (−x) = x² − x', k: 'neither'},
  {t: 'sin x', f: Math.sin, neg: 'sin(−x) = −sin x', k: 'odd'}, {t: 'cos x', f: Math.cos, neg: 'cos(−x) = cos x', k: 'even'}
];
CA.lab('eo-lab', {
  controls: [{type: 'select', key: 'p', label: 'f(x) =', value: '2', options: EO.map((e, i) => [String(i), e.t])}, {type: 'seg', key: 'm', label: 'Overlay', value: 'e', options: [['e', 'mirror in the y-axis: f(−x)'], ['o', 'rotate 180°: −f(−x)']]}],
  plot: {xmin: -4, xmax: 4, ymin: -4, ymax: 4, w: 500, h: 440}, plotLabel: 'Graph of f with its mirror image', legend: [['blue', 'y = f(x)'], ['orange', 'the overlay', true]], readouts: [['neg', 'f(−x)'], ['k', 'Type']]
}, (lab, st) => {
  const E = EO[+st.p], P = lab.plane(), ov = st.m === 'e' ? x => E.f(-x) : x => -E.f(-x);
  P.curve(E.f, {color: 'blue', width: 4, breaks: E.brk || []}).curve(ov, {color: 'orange', width: 2.6, dash: '7 6', breaks: E.brk || []}).render();
  lab.read('neg', E.neg); lab.read('k', E.k);
  const match = (st.m === 'e' && E.k === 'even') || (st.m === 'o' && E.k === 'odd');
  lab.out(match ? `The overlay lands exactly on the graph: f is <b>${E.k}</b>.` : E.k === 'neither' ? 'Neither overlay matches the graph: f is neither even nor odd.' : `This overlay does not match. Try the other one: f is ${E.k}.`, match ? 'ca-correct' : '');
});

/* ---------- 06 · quadratic formula ---------- */
const QP = [[1, 3, 1], [1, 3, 7], [1, 6, 9], [2, -3, -2], [1, 0, -5], [-1, 4, 3]];
CA.lab('quad-lab', {
  controls: [{type: 'select', key: 'p', label: 'Equation', value: '0', options: QP.map(([a, b, c], i) => [String(i), `${a === 1 ? '' : a === -1 ? '−' : a}x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)} = 0`]).concat([['own', 'Set your own']])},
    {type: 'number', key: 'a', label: 'a =', value: 1, step: 1}, {type: 'number', key: 'b', label: 'b =', value: 3, step: 1}, {type: 'number', key: 'c', label: 'c =', value: 1, step: 1}],
  plot: {w: 520, h: 360}, plotLabel: 'Parabola y = ax² + bx + c and its x-intercepts', readouts: [['D', 'Discriminant b² − 4ac'], ['r', 'Roots']], steps: true
}, (lab, st, key) => {
  if (key === 'p' && st.p !== 'own') { const [a, b, c] = QP[+st.p]; st.set('a', a, true); st.set('b', b, true); st.set('c', c, true); } else if (key && key !== 'p') st.set('p', 'own', true);
  const {a, b, c} = st;
  if (![a, b, c].every(Number.isInteger) || a === 0) { lab.plane({xmin: -5, xmax: 5, ymin: -5, ymax: 5}).render(); lab.out('Use whole numbers with a ≠ 0.', 'ca-incorrect'); lab.steps([]); return; }
  const D = b * b - 4 * a * c, f = x => a * x * x + b * x + c, v = -b / (2 * a), fv = f(v);
  const P = lab.plane({xmin: v - 5, xmax: v + 5, ...CA.fitY(f, v - 5, v + 5, {clip: 60, pad: 0.1})});
  P.curve(f, {color: 'blue', width: 3.2});
  let roots = 'no real roots', exact = '';
  if (D >= 0) {
    const R = CA.root(D), xs = [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)];
    if (R.whole) { const r1 = CA.F(-b + R.out, 2 * a), r2 = CA.F(-b - R.out, 2 * a); exact = D === 0 ? `x = ${r1}` : `x = ${r1} or x = ${r2}`; }
    else { let p = -b, q = R.out, d = 2 * a; const g = CA.gcd(CA.gcd(Math.abs(p), q), Math.abs(d)); p /= g; q /= g; d /= g; if (d < 0) { p = -p; d = -d; } const rad = `${q === 1 ? '' : q}√${R.in}`; exact = `x = ${d === 1 ? `${p === 0 ? '' : sg(p) + ' '}± ${rad}` : `(${p === 0 ? '' : sg(p) + ' '}± ${rad})/${d}`}`; }
    xs.forEach(x => P.point(x, 0, {color: 'orange', r: 7})); roots = exact + (R.whole ? '' : ` ≈ ${num(xs[0], 3)}, ${num(xs[1], 3)}`);
  }
  P.point(v, fv, {color: 'green', r: 5}).render();
  lab.read('D', `${fmt(b * b)} − ${fmt(4 * a * c).replace('-', '−')} = ${sg(D)}`); lab.read('r', roots);
  lab.steps([['Identify', `a = ${sg(a)}, b = ${sg(b)}, c = ${sg(c)}`], ['Formula', `x = (−${par(b)} ± √(${par(b)}² − 4(${sg(a)})(${sg(c)})))/(2·${par(a)}) = (${sg(-b)} ± √${D < 0 ? '(' + sg(D) + ')' : D})/${sg(2 * a)}`], ['Result', D < 0 ? `√(${sg(D)}) is not a real number: no real solution` : exact]]);
  lab.out(D > 0 ? 'D &gt; 0: two real roots, where the parabola crosses the x-axis.' : D === 0 ? 'D = 0: one repeated root; the vertex touches the x-axis.' : 'D &lt; 0: no real roots; the parabola never meets the x-axis.', D >= 0 ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 07 · transformations ---------- */
const PAR = {abs: ['|x|', Math.abs, 'x'], sq: ['x²', x => x * x, 'x'], cube: ['x³', x => x ** 3, 'x'], sqrt: ['√x', Math.sqrt, 'x'], recip: ['1/x', x => 1 / x, 'x'], four: ['x⁴', x => x ** 4, 'x']};
CA.lab('trans-lab', {
  controls: [{type: 'select', key: 'p', label: 'Parent f(x) =', value: 'abs', options: Object.entries(PAR).map(([k, v]) => [k, v[0]])}, {type: 'range', key: 'a', label: 'a =', min: -3, max: 3, step: 0.5, value: 2, skip: [0]}, {type: 'range', key: 'h', label: 'h =', min: -5, max: 5, step: 1, value: 3}, {type: 'range', key: 'k', label: 'k =', min: -5, max: 5, step: 1, value: 4}],
  top: '<div class="ca-equation" id="trans-eq"></div>', plot: {xmin: -8, xmax: 8, ymin: -6, ymax: 10, w: 540, h: 460}, plotLabel: 'Parent graph and transformed graph', legend: [['gray', 'parent y = f(x)', true], ['blue', 'y = a·f(x − h) + k']], readouts: [['d', 'Domain'], ['r', 'Range']], steps: true
}, (lab, st) => {
  const [name, f] = PAR[st.p], {a, h, k} = st, g = x => a * f(x - h) + k, P = lab.plane();
  P.curve(f, {color: 'gray', width: 2, dash: true, breaks: st.p === 'recip' ? [0] : []}).curve(g, {color: 'blue', width: 3.6, breaks: st.p === 'recip' ? [h] : []});
  if (st.p !== 'recip' && st.p !== 'cube') P.point(h, k, {color: 'orange', r: 6, label: `(${fmt(h)}, ${fmt(k)})`});
  P.render();
  const inside = h === 0 ? 'x' : h > 0 ? `x − ${fmt(h)}` : `x + ${fmt(-h)}`, A = a === 1 ? '' : a === -1 ? '−' : sg(a), K = k === 0 ? '' : k > 0 ? ` + ${fmt(k)}` : ` − ${fmt(-k)}`;
  const body = st.p === 'abs' ? `|${inside}|` : st.p === 'sqrt' ? `√(${inside})` : st.p === 'recip' ? `1/(${inside})` : `(${inside})${name.slice(1)}`;
  $('trans-eq').innerHTML = `y = ${A}${body}${K}`;
  const up = a > 0, even = st.p === 'abs' || st.p === 'sq' || st.p === 'four';
  lab.read('d', st.p === 'sqrt' ? `[${fmt(h)}, ∞)` : st.p === 'recip' ? `x ≠ ${fmt(h)}` : '(−∞, ∞)');
  lab.read('r', even ? (up ? `[${fmt(k)}, ∞)` : `(−∞, ${fmt(k)}]`) : st.p === 'sqrt' ? (up ? `[${fmt(k)}, ∞)` : `(−∞, ${fmt(k)}]`) : st.p === 'recip' ? `y ≠ ${fmt(k)}` : '(−∞, ∞)');
  lab.steps([['Stretch / reflect', a < 0 ? `multiply by ${sg(a)}: stretch by ${fmt(Math.abs(a))} and reflect in the x-axis` : `multiply by ${fmt(a)}: ${a > 1 ? 'vertical stretch' : a < 1 ? 'vertical compression' : 'no change'}`], ['Horizontal shift', h === 0 ? 'none' : `${h > 0 ? 'right' : 'left'} ${fmt(Math.abs(h))}`], ['Vertical shift', k === 0 ? 'none' : `${k > 0 ? 'up' : 'down'} ${fmt(Math.abs(k))}`]]);
  lab.out(even || st.p === 'sqrt' ? `The corner or vertex moves from the origin to (${fmt(h)}, ${fmt(k)}), so the range starts at y = ${fmt(k)}.` : 'Every point (x, y) of the parent moves to (x + h, a·y + k).');
});

/* ---------- guided problems ---------- */
CA.guided('12', [
  {q: 'The slope of the line through (1, −2) and (4, 7) is:', opts: ['3', '1/3', '−3', '5/3'], correct: 0, hint: 'm = (y₂ − y₁)/(x₂ − x₁).', why: '(7 − (−2))/(4 − 1) = 9/3 = 3.', ref: {panel: 'lines', what: 'the slope formula', body: '<p>The slope of the line through (x₁, y₁) and (x₂, y₂) is m = (y₂ − y₁)/(x₂ − x₁).</p>'}},
  {q: 'Which function is one-to-one?', opts: ['g(x) = x³ − 8', 'f(x) = x²', 'f(x) = |x|', 'f(x) = √(x² + 7)'], correct: 0, hint: 'Look for a function that is strictly increasing.', why: 'Different inputs always give different cubes.', ref: {panel: 'one-to-one', what: 'the functions √(x² + 7) and x³ − 8', body: '<p>Decide whether <b>√(x² + 7)</b> and <b>x³ − 8</b> are one-to-one.</p>'}},
  {q: 'For f(x) = 3x + 1 and g(x) = x² − 7, (f ∘ g)(x) = ?', opts: ['3x² − 20', '9x² + 6x − 6', '3x³ + x² − 21x − 7', 'x² + 3x − 6'], correct: 0, hint: 'Put g(x) into f.', why: 'f(x² − 7) = 3(x² − 7) + 1.', ref: {panel: 'combine', what: 'f(x) = 3x + 1 and g(x) = x² − 7', body: '<p>f(x) = 3x + 1 and g(x) = x² − 7: find f(g(x)).</p>'}},
  {q: 'For f(x) = 3x + 1 and g(x) = x² − 7, (g ∘ f)(2) = ?', opts: ['42', '−9', '13', '49'], correct: 0, hint: 'First f(2), then g of that.', why: 'f(2) = 7 and g(7) = 49 − 7 = 42.'},
  {q: 'f(x) = x⁴ − 3x² is:', keep: true, opts: ['even', 'odd', 'neither'], correct: 0, hint: 'Compute f(−x).', why: 'Even powers do not change sign: f(−x) = f(x).'},
  {q: 'f(x) = x³ + x + 1 is:', keep: true, opts: ['even', 'odd', 'neither'], correct: 2, hint: 'f(−x) = −x³ − x + 1.', why: 'f(−x) is neither f(x) nor −f(x) = −x³ − x − 1.', ref: {panel: 'even-odd', what: 'the function x³ + x + 1', body: '<p>Test <b>f(x) = x³ + x + 1</b> by replacing x with −x.</p>'}},
  {q: 'The degree and leading coefficient of f(x) = 100x⁴⁷ + 8 are:', opts: ['47 and 100', '100 and 47', '48 and 100', '47 and 8'], correct: 0, hint: 'Look at the highest power.', why: 'The highest power is x⁴⁷, with coefficient 100.'},
  {q: 'The solutions of x² + 3x + 1 = 0 are:', opts: ['(−3 ± √5)/2', '(3 ± √5)/2', '(−3 ± √13)/2', 'no real solutions'], correct: 0, hint: 'b² − 4ac = 9 − 4.', why: 'x = (−3 ± √5)/2.', ref: {panel: 'polynomials', what: 'the equation x² + 3x + 1 = 0', body: '<p>Solve <b>x² + 3x + 1 = 0</b> with the quadratic formula.</p>'}},
  {q: 'How many real solutions does x² + 3x + 7 = 0 have?', opts: ['none', 'one', 'two', 'infinitely many'], correct: 0, hint: 'Compute the discriminant.', why: '9 − 28 = −19 &lt; 0.'},
  {q: 'The range of y = 2|x − 3| + 4 is:', opts: ['[4, ∞)', '[3, ∞)', '(−∞, ∞)', '[2, ∞)'], correct: 0, hint: '|x − 3| ≥ 0.', why: '2|x − 3| ≥ 0, so y ≥ 4, with y = 4 at x = 3.', ref: {panel: 'families', what: 'the function 2|x − 3| + 4', body: '<p>Describe the graph of <b>y = 2|x − 3| + 4</b>.</p>'}}
]);
})();
