/* Section 6.2 · Graphs of Exponential Functions — interactive activities */
(() => {
'use strict';
const {fmt, num, F} = CA, Frac = CA.Frac;
const BASES = [['1/4', '1/4'], ['1/3', '1/3'], ['2/5', '2/5'], ['1/2', '1/2'], ['2/3', '2/3'], ['3/2', '3/2'], ['2', '2'], ['3', '3'], ['4', '4'], ['10', '10']];
const toF = s => s.includes('/') ? F(...s.split('/').map(Number)) : F(Number(s), 1);
const bstr = s => s.includes('/') ? `(${s})` : s;
const fpow = (b, n) => { let r = F(1, 1); for (let i = 0; i < Math.abs(n); i++) r = r.mul(b); return n < 0 ? F(1, 1).div(r) : r; };
const pt = (x, y) => `(${x}, ${y})`;
const coefS = a => a.eq(1) ? '' : a.eq(-1) ? '−' : a.toString();
const ab = (a, s) => { const c = coefS(a); return c === '' || c === '−' ? c + bstr(s) : `${c}(${s})`; };
const xm = h => h === 0 ? 'x' : `x ${h > 0 ? '−' : '+'} ${Math.abs(h)}`;
const plusK = k => k === 0 ? '' : ` ${k > 0 ? '+' : '−'} ${Math.abs(k)}`;

/* ---------- 01 · key points ---------- */
CA.lab('key-lab', {
  controls: [{type: 'select', key: 'b', label: 'Base b', value: '2', options: BASES}, {type: 'check', key: 'mirror', label: 'Also show y = (1/b)ˣ', value: false}],
  plot: {h: 360}, plotLabel: 'Graph of b to the x with three key points', readouts: [['f', 'f(x)'], ['pts', 'Key points'], ['dir', 'Behavior']]
}, (lab, st) => {
  const b = toF(st.b), f = x => b.v ** x, Pl = lab.plane({xmin: -4, xmax: 4, ymin: -1, ymax: Math.max(5, Math.min(11.5, Math.max(b.v, 1 / b.v) + 1.5))});
  if (st.mirror) Pl.curve(x => (1 / b.v) ** x, {color: 'blue', dash: '7 6', width: 2.4});
  Pl.curve(f, {color: 'orange', width: 3.4, arrows: true}).hline(0, {color: 'purple', dash: '7 6'});
  const inv = F(1, 1).div(b);
  [[-1, inv], [0, F(1, 1)], [1, b]].forEach(([x, y]) => Pl.point(x, y.v, {color: 'green', r: 6, label: pt(x, y), labelOpt: {dy: x === 1 && b.v > 1 ? -12 : -12}}));
  Pl.render();
  lab.read('f', `f(x) = ${bstr(st.b)}ˣ`); lab.read('pts', `${pt(-1, inv)}, (0, 1), ${pt(1, b)}`); lab.read('dir', b.v > 1 ? 'increasing (b &gt; 1)' : 'decreasing (0 &lt; b &lt; 1)');
  lab.out(`(−1, 1/b) = ${pt(-1, inv)} because b⁻¹ = 1/b; (1, b) = ${pt(1, b)}.${st.mirror ? ` The dashed curve (1/b)ˣ = b⁻ˣ is the reflection over the y-axis: it has key points ${pt(-1, b)}, (0, 1), ${pt(1, inv)}.` : ''}`);
});

/* ---------- 02 · staged transformations ---------- */
const AS = [['-3', '−3'], ['-2', '−2'], ['-1', '−1'], ['-1/2', '−1/2'], ['1/2', '1/2'], ['1', '1'], ['2', '2'], ['3', '3']];
const TR = {
  e1: {b: '4', a: '-2', c: '1', h: -3, k: 1, t: 'Example: y = −2(4)^(x + 3) + 1'},
  t1: {b: '2/5', a: '-3', c: '1', h: 2, k: -4, t: 'Practice: y = −3(2/5)^(x − 2) − 4'},
  r1: {b: '2', a: '1', c: '-1', h: 0, k: 0, t: 'Reflection: y = 2^(−x)'},
  r2: {b: '2', a: '-1', c: '1', h: 0, k: 0, t: 'Reflection: y = −2ˣ'},
  own: {t: 'Set your own'}
};
const STAGES = ['Start: y = bˣ', 'Reflect over the y-axis and stretch, compress, or reflect over the x-axis', 'Horizontal shift', 'Vertical shift', 'Read the features'];
let trStepper;
const tr = CA.lab('tr-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Function', value: 'e1', options: Object.entries(TR).map(([k, v]) => [k, v.t])},
    {type: 'select', key: 'b', label: 'b', value: '4', options: BASES}, {type: 'select', key: 'a', label: 'a', value: '-2', options: AS},
    {type: 'seg', key: 'c', label: 'Exponent sign', value: '1', options: [['1', 'b^(x − h)'], ['-1', 'b^(−(x − h))']]},
    {type: 'range', key: 'h', label: 'h =', min: -4, max: 4, value: -3}, {type: 'range', key: 'k', label: 'k =', min: -5, max: 5, value: 1}],
  top: '<div id="tr-stepper"></div>', plot: {h: 400}, plotLabel: 'Key points moving through each transformation', readouts: [['f', 'Target'], ['ha', 'Asymptote'], ['y', 'y-intercept'], ['range', 'Range']],
  middle: '<div class="ca-scroll-x"><table class="ca-data-table" id="tr-table" aria-label="Key points at each stage"></table></div>'
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const S = TR[st.pre]; ['b', 'a', 'c', 'h', 'k'].forEach(q => st.set(q, S[q], true)); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  if (!trStepper) return; if (key) trStepper.reset(); else drawTr();
});
function drawTr() {
  const st = tr.state, i = trStepper ? trStepper.i : 0, b = toF(st.b), a = toF(st.a), c = Number(st.c), h = st.h, k = st.k;
  const base = [[-1, F(1, 1).div(b)], [0, F(1, 1)], [1, b]];
  const stage = j => base.map(([u, v]) => { let x = F(u, 1), y = v; if (j >= 1) { x = x.mul(c); y = y.mul(a); } if (j >= 2) x = x.add(h); if (j >= 3) y = y.add(k); return [x, y]; });
  const fs = [x => b.v ** x, x => a.v * b.v ** (c * x), x => a.v * b.v ** (c * (x - h)), x => a.v * b.v ** (c * (x - h)) + k];
  const j = Math.min(i, 3), P = stage(j), asym = j >= 3 ? k : 0, f = fs[j];
  const pts = [0, 1, 2, 3].flatMap(s => stage(s)).map(([x, y]) => [x.v, y.v]).filter(([, y]) => Math.abs(y) < 40);
  const ys = pts.map(p => p[1]).concat([k, 0]), xs = pts.map(p => p[0]).concat([0]);
  const lo = Math.min(...ys), hi = Math.max(...ys), pad = Math.max(2, (hi - lo) * 0.25);
  const Pl = tr.plane({xmin: Math.min(-5, Math.min(...xs) - 2), xmax: Math.max(5, Math.max(...xs) + 2), ymin: lo - pad, ymax: hi + pad});
  if (j > 0) Pl.curve(fs[j - 1], {color: 'gray', dash: '6 6', width: 2});
  Pl.curve(f, {color: 'orange', width: 3.4, arrows: true}).hline(asym, {color: 'purple', dash: '7 6'});
  P.forEach(([x, y]) => Pl.point(x.v, y.v, {color: 'green', r: 6, label: pt(x, y), labelOpt: {size: 12}}));
  const yint = a.mul(fpow(b, -c * h)).add(k);
  if (i >= 4) Pl.point(0, yint.v, {color: 'blue', r: 6, label: `y-int (0, ${yint})`, labelOpt: {dy: 20, size: 12}});
  Pl.render();
  const ex = c === 1 ? xm(h) : (h === 0 ? '−x' : `−(${xm(h)})`);
  tr.read('f', `y = ${ab(a, st.b)}<sup>${ex}</sup>${plusK(k)}`); tr.read('ha', `y = ${fmt(asym)}`); tr.read('y', i >= 4 ? `(0, ${yint})` : '—'); tr.read('range', i >= 4 ? (a.v > 0 ? `(${fmt(k)}, ∞)` : `(−∞, ${fmt(k)})`) : '—');
  const rows = [0, 1, 2, 3].map(s => stage(s));
  document.getElementById('tr-table').innerHTML = `<tr><th>stage</th><th>point 1</th><th>point 2</th><th>point 3</th><th>asymptote</th></tr>` + rows.map((r, s) => `<tr><th class="${s === j ? 'hl' : ''}">${['y = bˣ', 'reflect/stretch', 'shift ↔', 'shift ↕'][s]}</th>${r.map(([x, y]) => `<td class="${s === j ? 'hl' : ''}">${s <= j ? pt(x, y) : ''}</td>`).join('')}<td class="${s === j ? 'hl' : ''}">${s <= j ? `y = ${s === 3 ? fmt(k) : 0}` : ''}</td></tr>`).join('');
  const say = [
    `Start with y = ${bstr(st.b)}ˣ and its key points (−1, 1/b), (0, 1), (1, b). Asymptote y = 0.`,
    `${c === -1 ? 'Replace x by −x (reflect over the y-axis): change the sign of each x-coordinate. ' : ''}${a.eq(1) ? 'a = 1: no vertical stretch.' : `Multiply each y-coordinate by a = ${a}${a.v < 0 ? ' (this includes a reflection over the x-axis)' : ''}.`} The asymptote stays y = 0.`,
    h === 0 ? 'h = 0: no horizontal shift.' : `Shift ${Math.abs(h)} unit${Math.abs(h) === 1 ? '' : 's'} ${h > 0 ? 'right: add' : 'left: subtract'} ${Math.abs(h)} ${h > 0 ? 'to' : 'from'} each x-coordinate. The asymptote does not change.`,
    k === 0 ? 'k = 0: no vertical shift.' : `Shift ${Math.abs(k)} unit${Math.abs(k) === 1 ? '' : 's'} ${k > 0 ? 'up' : 'down'}: ${k > 0 ? 'add' : 'subtract'} ${Math.abs(k)} ${k > 0 ? 'to' : 'from'} each y-coordinate. The asymptote moves to y = ${fmt(k)}.`,
    `y-intercept: y = ${ab(a, st.b)}<sup>${c === 1 ? fmt(-h) : fmt(h)}</sup>${plusK(k)} = ${yint}. Domain (−∞, ∞); range ${a.v > 0 ? `(${fmt(k)}, ∞)` : `(−∞, ${fmt(k)})`}.${Math.abs(yint.v) > 40 ? ' (The y-intercept is off the visible window.)' : ''}`
  ];
  tr.out(`<b>${STAGES[i]}.</b> ${say[i]}`);
}
trStepper = CA.stepper('tr-stepper', () => 5, drawTr, {labels: j => ['parent', 'reflect/stretch', 'horizontal', 'vertical', 'features'][j]});

/* ---------- 03 · matching ---------- */
const MG = [
  {f: x => (1 / 3) ** (x - 1), t: 'y = (1/3)<sup>x − 1</sup>'},
  {f: x => 3 ** x - 2, t: 'y = 3ˣ − 2'},
  {f: x => -((1 / 2) ** x) + 3, t: 'y = −(1/2)ˣ + 3'},
  {f: x => 2 ** (x + 2), t: 'y = 2<sup>x + 2</sup>'}
];
const order = [2, 0, 3, 1]; // graph letters A–D show MG[order[i]]
document.getElementById('match-plots').innerHTML = order.map((m, i) => `<figure><svg id="mg-${i}" role="img" aria-label="Mystery graph ${'ABCD'[i]}"></svg><figcaption>Graph ${'ABCD'[i]}</figcaption></figure>`).join('');
order.forEach((m, i) => { const Pl = new CA.Plane(document.getElementById(`mg-${i}`), {xmin: -4, xmax: 4, ymin: -3, ymax: 7, w: 400, h: 440, equal: true, tools: false}); Pl.curve(MG[m].f, {color: 'orange', width: 3.2, arrows: true}); const asy = [0, -2, 3, 0][m]; Pl.hline(asy, {color: 'purple', dash: '6 5'}).render(); });
CA.cards('match-cards', MG.map((g, m) => ({expr: g.t, correct: order.indexOf(m), why: [
  'Decreasing (b = 1/3 &lt; 1), asymptote y = 0, and (1, 1) is on the graph: Graph ' + 'ABCD'[order.indexOf(0)] + '.',
  'Increasing, asymptote y = −2, y-intercept (0, −1): Graph ' + 'ABCD'[order.indexOf(1)] + '.',
  '−(1/2)ˣ is (1/2)ˣ reflected over the x-axis, so it increases; shifted up 3, its asymptote is y = 3 and the y-intercept is (0, 2): Graph ' + 'ABCD'[order.indexOf(2)] + '.',
  'Increasing, asymptote y = 0, shifted 2 left so (−2, 1) is on it and the y-intercept is (0, 4): Graph ' + 'ABCD'[order.indexOf(3)] + '.'][m]})), {options: ['Graph A', 'Graph B', 'Graph C', 'Graph D']});

CA.guided('62', [
  {q: 'Which three points are key points of y = 3ˣ?', opts: ['(−1, 1/3), (0, 1), (1, 3)', '(−1, −3), (0, 0), (1, 3)', '(−1, 3), (0, 1), (1, 1/3)'], correct: 0, hint: '(−1, 1/b), (0, 1), (1, b).', why: 'With b = 3: (−1, 1/3), (0, 1), (1, 3).'},
  {q: 'What is the horizontal asymptote of y = 2<sup>x − 5</sup> + 3?', opts: ['y = 3', 'y = −5', 'y = 0'], correct: 0, hint: 'Only the vertical shift moves it.', why: 'Shifted up 3, so y = 3.'},
  {q: 'The graph of y = 5<sup>x + 2</sup> is the graph of y = 5ˣ shifted…', opts: ['2 units left', '2 units right', '2 units up'], correct: 0, hint: 'x − h with h = −2.', why: 'x + 2 = x − (−2): shift 2 left.'},
  {q: 'Under y = −2·4ˣ, the key point (1, 4) moves to…', opts: ['(1, −8)', '(−1, 8)', '(1, −2)'], correct: 0, hint: 'Multiply the y-coordinate by a.', why: '4 × (−2) = −8.'},
  {q: 'Which function is the reflection of y = 6ˣ over the y-axis?', opts: ['y = 6<sup>−x</sup>', 'y = −6ˣ', 'y = 6ˣ − 1'], correct: 0, hint: 'Replace x with −x.', why: 'b<sup>−x</sup> reflects over the y-axis.'},
  {q: 'What is the range of y = −3(2)ˣ + 1?', opts: ['(−∞, 1)', '(1, ∞)', '(−∞, ∞)'], correct: 0, hint: 'a &lt; 0 puts the graph below the asymptote.', why: 'Asymptote y = 1 and a &lt; 0, so (−∞, 1).'},
  {q: 'Is y = (0.7)ˣ increasing or decreasing?', opts: ['Increasing', 'Decreasing'], correct: 1, hint: 'Compare b with 1.', why: '0 &lt; 0.7 &lt; 1, so it decreases.'},
  {q: 'What is the y-intercept of y = 2<sup>x + 3</sup> − 1?', opts: ['(0, 7)', '(0, 1)', '(0, 8)'], correct: 0, hint: 'Evaluate at x = 0.', why: '2³ − 1 = 7.'},
  {q: 'Why does every exponential function y = bˣ have an inverse?', opts: ['It passes the horizontal line test', 'Its domain is (0, ∞)', 'It has an x-intercept'], correct: 0, hint: 'Recall Section 3.7.', why: 'It is one-to-one, so it has an inverse: the logarithm (Section 6.3).'},
  {q: 'The key point (−1, 1/b) of y = (2/5)ˣ is…', opts: ['(−1, 5/2)', '(−1, 2/5)', '(−1, −2/5)'], correct: 0, hint: '1/b with b = 2/5.', why: '1/(2/5) = 5/2.'}
]);
})();
