/* Section 3.3 · Rates of Change and Behavior of Graphs — interactive activities */
(() => {
'use strict';
const {fmt, num, Frac, F} = CA;
const fx = v => Frac.of(v).toString();
const interp = (m, text, name) => m > 0 ? `On average, ${name} <b>increases</b> by ${text} for every 1-unit increase in x.` : m < 0 ? `On average, ${name} <b>decreases</b> by ${text.replace('−', '')} for every 1-unit increase in x.` : `On average, ${name} has <b>no net change</b> over this interval: the start and end outputs are equal.`;

/* ---------- 01 · secant line lab ---------- */
const FNS = {
  quad: {name: 'f', label: 'f(x) = 3x² − 5', f: x => 3 * x * x - 5, ex: x => x.mul(x).mul(3).sub(5), sub: s => `3(${s})² − 5`, win: {xmin: -4, xmax: 4, ymin: -8, ymax: 24}, lo: -3, hi: 3, x1: -2, x2: 1},
  cubic: {name: 'p', label: 'p(x) = x³ − 4x', f: x => x ** 3 - 4 * x, ex: x => x.mul(x).mul(x).sub(x.mul(4)), sub: s => `(${s})³ − 4(${s})`, win: {xmin: -4, xmax: 4, ymin: -12, ymax: 12}, lo: -3, hi: 3, x1: -1, x2: 2},
  line: {name: 'q', label: 'q(x) = 6 − 2x', f: x => 6 - 2 * x, ex: x => F(6).sub(x.mul(2)), sub: s => `6 − 2(${s})`, win: {xmin: -4, xmax: 4, ymin: -4, ymax: 14}, lo: -3, hi: 3, x1: -1, x2: 2},
  root: {name: 'r', label: 'r(x) = 2√x', f: x => x >= 0 ? 2 * Math.sqrt(x) : NaN, ex: null, sub: s => `2√(${s})`, win: {xmin: -1, xmax: 10, ymin: -1, ymax: 7.5}, lo: 0, hi: 9, x1: 1, x2: 9}
};
const rootVal = x => { // 2√x: exact when x is a perfect square, otherwise simplified radical plus decimal
  if (Number.isInteger(x) && Number.isInteger(Math.sqrt(x))) return {exact: F(2 * Math.sqrt(x)), text: fmt(2 * Math.sqrt(x))};
  if (Number.isInteger(x)) { const r = CA.root(x); return {exact: null, text: `${fmt(2 * r.out)}√${r.in} ≈ ${num(2 * Math.sqrt(x))}`}; }
  return {exact: null, text: `≈ ${num(2 * Math.sqrt(x))}`};
};
CA.lab('rate-lab', {
  controls: [
    {type: 'select', key: 'fn', label: 'Function', value: 'quad', options: Object.entries(FNS).map(([k, v]) => [k, v.label])},
    {type: 'range', key: 'x1', label: 'x₁ =', min: -3, max: 3, step: 0.5, value: -2},
    {type: 'range', key: 'x2', label: 'x₂ =', min: -3, max: 3, step: 0.5, value: 1}
  ],
  plot: {h: 380}, plotLabel: 'Graph with a secant line through two points',
  legend: [['orange', 'function'], ['blue', 'secant line'], ['purple', 'Δx and Δy', true]],
  readouts: [['dx', 'Δx = x₂ − x₁'], ['dy', 'Δy = y₂ − y₁'], ['rate', 'Average rate Δy/Δx']],
  steps: true
}, (lab, st, key) => {
  const d = FNS[st.fn];
  if (key === 'fn') { ['x1', 'x2'].forEach(k => { const el = st.input(k); el.min = d.lo; el.max = d.hi; }); st.set('x1', d.x1, true); st.set('x2', d.x2, true); }
  const x1 = st.x1, x2 = st.x2, P = lab.plane(d.win);
  P.curve(d.f, {color: 'orange', width: 3.4});
  if (x1 === x2) {
    P.point(x1, d.f(x1), {color: 'orange'}).render();
    ['dx', 'dy', 'rate'].forEach(k => lab.read(k, '—'));
    lab.steps([]); lab.out('Choose two <b>different</b> inputs. If x₁ = x₂, then Δx = 0 and the ratio Δy/Δx is undefined.', 'ca-incorrect');
    return;
  }
  const y1n = d.f(x1), y2n = d.f(x2), m = (y2n - y1n) / (x2 - x1);
  P.lineMB(m, y1n - m * x1, {color: 'blue', width: 2.6});
  P.seg(x1, y1n, x2, y1n, {color: 'purple', dash: '6 5', width: 2.4}).seg(x2, y1n, x2, y2n, {color: 'purple', dash: '6 5', width: 2.4});
  P.label((x1 + x2) / 2, y1n, `Δx = ${num(x2 - x1)}`, {color: 'purple', dy: y2n > y1n ? 18 : -10, anchor: 'middle'});
  P.label(x2, (y1n + y2n) / 2, `Δy = ${num(y2n - y1n)}`, {color: 'purple'});
  P.point(x1, y1n, {color: 'orange', label: `(${num(x1)}, ${num(y1n)})`}).point(x2, y2n, {color: 'orange', label: `(${num(x2)}, ${num(y2n)})`});
  P.render();
  const X1 = Frac.of(x1), X2 = Frac.of(x2), dx = X2.sub(X1);
  let y1, y2, dy, rate, y1t, y2t;
  if (d.ex) { y1 = d.ex(X1); y2 = d.ex(X2); dy = y2.sub(y1); rate = dy.div(dx); y1t = y1.toString(); y2t = y2.toString(); }
  else { const a = rootVal(x1), b = rootVal(x2); y1t = a.text; y2t = b.text; if (a.exact && b.exact) { y1 = a.exact; y2 = b.exact; dy = y2.sub(y1); rate = dy.div(dx); } }
  const sx = v => v.d === 1 && v.n < 0 ? `(${v})` : v.toString();
  lab.read('dx', dx.toString()); lab.read('dy', dy ? dy.toString() : num(y2n - y1n)); lab.read('rate', rate ? rate.html() + (rate.isInt() ? '' : ` ≈ ${num(rate.v)}`) : '≈ ' + num(m, 3));
  lab.steps([
    ['i · Change in input', `x₂ − x₁ = ${X2} − ${sx(X1)} = ${dx}`],
    ['ii · Find both outputs', `y₁ = ${d.name}(${X1}) = ${d.sub(X1)} = ${y1t}<br>y₂ = ${d.name}(${X2}) = ${d.sub(X2)} = ${y2t}`],
    ['iii · Change in output', dy ? `y₂ − y₁ = ${y2} − ${dy && y1.n < 0 ? `(${y1})` : y1} = ${dy}` : `y₂ − y₁ ≈ ${num(y2n)} − ${num(y1n)} ≈ ${num(y2n - y1n)}`],
    ['iv · Divide', rate ? `Δy / Δx = ${CA.divHTML(dy, dx)}` : `Δy / Δx ≈ ${num(y2n - y1n)} / ${dx} ≈ ${num(m, 3)}`]
  ]);
  lab.out(interp(m, rate ? rate.toString() : num(m, 3), d.name + '(x)'));
});

/* ---------- 02 · from a table ---------- */
const TX = [1, 3, 6, 8, 10], TY = [-2, 0, 4, 9, 4];
CA.lab('table-lab', {
  controls: [
    {type: 'select', key: 'a', label: 'x₁ =', value: 1, options: TX.map(v => [v, v])},
    {type: 'select', key: 'b', label: 'x₂ =', value: 8, options: TX.map(v => [v, v])}
  ],
  top: '<div class="ca-scroll-x"><table class="ca-data-table" id="table-lab-table" aria-label="Function table"></table></div>',
  plot: {h: 320}, plotLabel: 'Table values plotted as points with a secant line', steps: true
}, (lab, st) => {
  const a = +st.a, b = +st.b, ia = TX.indexOf(a), ib = TX.indexOf(b);
  document.getElementById('table-lab-table').innerHTML = `<tr><th>x</th>${TX.map((v, i) => `<td class="${i === ia || i === ib ? 'hl' : ''}">${fmt(v)}</td>`).join('')}</tr><tr><th>y</th>${TY.map((v, i) => `<td class="${i === ia || i === ib ? 'hl' : ''}">${fmt(v)}</td>`).join('')}</tr>`;
  const P = lab.plane({xmin: 0, xmax: 11, ymin: -4, ymax: 11});
  for (let i = 0; i < TX.length - 1; i++) P.seg(TX[i], TY[i], TX[i + 1], TY[i + 1], {color: 'gray', dash: '4 6', width: 1.6});
  if (a !== b) { const m = (TY[ib] - TY[ia]) / (b - a); P.lineMB(m, TY[ia] - m * a, {color: 'blue', width: 2.4}); }
  TX.forEach((x, i) => P.point(x, TY[i], {color: i === ia || i === ib ? 'orange' : 'gray', r: i === ia || i === ib ? 7 : 5, label: i === ia || i === ib ? `(${x}, ${fmt(TY[i])})` : ''}));
  P.render();
  if (a === b) { lab.steps([]); lab.out('Choose two different inputs.', 'ca-incorrect'); return; }
  const dx = b - a, dy = TY[ib] - TY[ia], r = F(dy, dx);
  lab.steps([
    ['i · Change in input', `x₂ − x₁ = ${fmt(b)} − ${fmt(a)} = ${fmt(dx)}`],
    ['ii · Read both outputs from the table', `y₁ = ${fmt(TY[ia])}, y₂ = ${fmt(TY[ib])}`],
    ['iii · Change in output', `y₂ − y₁ = ${fmt(TY[ib])} − ${TY[ia] < 0 ? `(${fmt(TY[ia])})` : fmt(TY[ia])} = ${fmt(dy)}`],
    ['iv · Divide', CA.divHTML(dy, dx)]
  ]);
  lab.out(`Average rate of change from x = ${fmt(a)} to x = ${fmt(b)}: <b>${r.html()}</b>${r.isInt() ? '' : ` ≈ ${num(r.v)}`}. ${b < a ? 'Notice: swapping x₁ and x₂ changes the sign of both Δy and Δx, so the rate stays the same.' : ''}`);
});
CA.choice('table-choice', {q: 'Between which two consecutive table entries does the function increase fastest on average?', options: ['x = 1 to 3', 'x = 3 to 6', 'x = 6 to 8', 'x = 8 to 10'], correct: 2,
  why: 'The rates are 2/2 = 1, 4/3 ≈ 1.33, 5/2 = 2.5, and −5/2 = −2.5. The largest positive rate is 5/2, from x = 6 to x = 8.'});

/* ---------- 03 · from a graph ---------- */
const g = x => (x - 1) ** 2;
CA.lab('graph-lab', {
  controls: [{type: 'seg', key: 'iv', label: 'Interval', value: '-1,2', options: [['-1,2', '[−1, 2]'], ['0,3', '[0, 3]'], ['1,3', '[1, 3]'], ['-2,1', '[−2, 1]'], ['0,2', '[0, 2]']]}],
  plot: {h: 360}, plotLabel: 'Parabola with two highlighted points', steps: true
}, (lab, st) => {
  const [a, b] = st.iv.split(',').map(Number), ya = g(a), yb = g(b);
  const P = lab.plane({xmin: -3, xmax: 4, ymin: -1, ymax: 10});
  P.curve(g, {color: 'orange', width: 3.4});
  for (const [x, y] of [[a, ya], [b, yb]]) { P.seg(x, 0, x, y, {color: 'gray', dash: '4 5', width: 1.6}).seg(x, y, 0, y, {color: 'gray', dash: '4 5', width: 1.6}); }
  const m = (yb - ya) / (b - a); P.lineMB(m, ya - m * a, {color: 'blue', width: 2.4});
  P.point(a, ya, {color: 'orange', label: `(${fmt(a)}, ${fmt(ya)})`}).point(b, yb, {color: 'orange', label: `(${fmt(b)}, ${fmt(yb)})`}).render();
  const r = F(yb - ya, b - a);
  lab.steps([
    ['i · Change in input', `x₂ − x₁ = ${fmt(b)} − ${a < 0 ? `(${fmt(a)})` : fmt(a)} = ${fmt(b - a)}`],
    ['ii · Read the outputs from the graph', `y₁ = ${fmt(ya)} and y₂ = ${fmt(yb)}`],
    ['iii · Change in output', `y₂ − y₁ = ${fmt(yb)} − ${fmt(ya)} = ${fmt(yb - ya)}`],
    ['iv · Divide', CA.divHTML(yb - ya, b - a)]
  ]);
  lab.out(`Average rate of change on [${fmt(a)}, ${fmt(b)}]: <b>${r.html()}</b>. ${r.n === 0 ? 'The two outputs are equal, so the secant line is horizontal.' : ''}`);
});
CA.choice('graph-choice', {q: 'On [0, 2] the average rate of change is 0. Is the function constant on (0, 2)?', options: ['Yes · a rate of 0 means constant', 'No · it decreases, then increases'], correct: 1,
  why: 'The endpoints have the same output (both are 1), but the graph drops to 0 at x = 1 and then rises. An average rate of 0 only says the start and end heights match.',
  whyWrong: 'Look at the graph between x = 0 and x = 2: it goes down to 0 at x = 1 and back up. An average rate of 0 only says the start and end heights match.'});

/* ---------- 04 · increasing / decreasing / constant ---------- */
const pw = x => x <= -3 ? -((x + 3) ** 2) + 2 : x <= -1 ? 2 - 3.5 * (x + 3) : x <= 2 ? -5 : -5 + 2 * (x - 2);
const GRAPHS = {
  cubic: {label: 'Cubic · f(x) = x³/4 − 3x', f: x => x ** 3 / 4 - 3 * x, win: {xmin: -6, xmax: 6, ymin: -8, ymax: 8},
    parts: [[-Infinity, -2, 'inc'], [-2, 2, 'dec'], [2, Infinity, 'inc']]},
  piece: {label: 'Piecewise graph', f: pw, win: {xmin: -6, xmax: 6, ymin: -8, ymax: 5},
    parts: [[-Infinity, -3, 'inc'], [-3, -1, 'dec'], [-1, 2, 'const'], [2, Infinity, 'inc']]},
  abs: {label: 'Absolute value · f(x) = |x + 1| − 2', f: x => Math.abs(x + 1) - 2, win: {xmin: -6, xmax: 6, ymin: -3, ymax: 6},
    parts: [[-Infinity, -1, 'dec'], [-1, Infinity, 'inc']]}
};
const KIND = {inc: ['green', 'increasing', 'goes up'], dec: ['red', 'decreasing', 'goes down'], const: ['blue', 'constant', 'stays level']};
const ivText = (a, b) => `(${a === -Infinity ? '−∞' : fmt(a)}, ${b === Infinity ? '∞' : fmt(b)})`;
CA.lab('behavior-lab', {
  controls: [
    {type: 'select', key: 'g', label: 'Graph', value: 'cubic', options: Object.entries(GRAPHS).map(([k, v]) => [k, v.label])},
    {type: 'range', key: 'x', label: 'Walker at x =', min: -5.5, max: 5.5, step: 0.1, value: -4, fmt: v => num(v, 1)},
    {type: 'check', key: 'show', label: 'Show the intervals', value: false}
  ],
  plot: {h: 380}, plotLabel: 'Graph colored by increasing, decreasing, and constant pieces',
  legend: [['green', 'increasing'], ['red', 'decreasing'], ['blue', 'constant']],
  readouts: [['inc', 'Increasing on'], ['dec', 'Decreasing on'], ['const', 'Constant on']]
}, (lab, st) => {
  const G = GRAPHS[st.g], P = lab.plane(G.win), x = Math.round(st.x * 10) / 10;
  for (const [a, b, k] of G.parts) P.curve(G.f, {from: a, to: b, color: KIND[k][0], width: 3.6});
  if (st.show) for (const [a, b, k] of G.parts) P.band('x', Math.max(a, G.win.xmin), Math.min(b, G.win.xmax), {color: KIND[k][0], width: 7});
  const y = G.f(x), part = G.parts.find(([a, b]) => x > a + 1e-9 && x < b - 1e-9), turn = !part;
  P.vline(x, {color: 'gray', width: 1.4});
  P.point(x, y, {color: turn ? 'purple' : KIND[part[2]][0], r: 8, label: `x = ${num(x, 1)}`});
  P.render();
  const list = k => { const iv = G.parts.filter(p => p[2] === k).map(([a, b]) => ivText(a, b)); return iv.length ? iv.join(' ∪ ') : 'nowhere'; };
  for (const k of ['inc', 'dec', 'const']) lab.read(k, st.show ? list(k) : '<span class="ca-note">turn on “Show the intervals”</span>');
  lab.out(turn ? `At x = ${num(x, 1)} the graph is at a <b>turning point</b> (or a corner): it is switching behavior, so this x-value is not included in any of the intervals.`
    : `At x = ${num(x, 1)}, moving to the right, the graph <b>${KIND[part[2]][2]}</b>: the function is <b>${KIND[part[2]][1]}</b> on the interval ${ivText(part[0], part[1])}.`);
});

CA.guided('33', [
  {q: 'Find the average rate of change of f(x) = x² on [1, 4].', opts: ['5', '15', '3'], correct: 0, hint: 'Compute f(4) and f(1), then divide by 4 − 1.', why: 'f(4) − f(1) = 16 − 1 = 15 and 4 − 1 = 3, so the rate is 15/3 = 5.'},
  {q: 'Find the average rate of change of f(x) = 2x + 7 on [−3, 10].', opts: ['13', '2', '7'], correct: 1, hint: 'For a line, the average rate of change is the slope.', why: 'f(10) − f(−3) = 27 − 1 = 26 and 10 − (−3) = 13, so the rate is 26/13 = 2: the slope of the line.'},
  {q: 'A table gives f(0) = 4, f(2) = 10, f(5) = 1. Find the average rate of change from x = 2 to x = 5.', opts: ['3', '−9', '−3'], correct: 2, hint: 'Use y₂ = f(5) and y₁ = f(2).', why: '(1 − 10)/(5 − 2) = −9/3 = −3.'},
  {q: 'Find the average rate of change of g(x) = √x on [4, 9].', opts: ['1/5', '5', '1'], correct: 0, hint: 'g(9) = 3 and g(4) = 2.', why: '(3 − 2)/(9 − 4) = 1/5.'},
  {q: 'The average rate of change of f on [a, b] is negative. What must be true?', opts: ['f(b) > f(a)', 'f(b) < f(a)', 'f is decreasing everywhere'], correct: 1, hint: 'The denominator b − a is positive. What sign must the numerator have?', why: 'Since b − a > 0, a negative ratio needs f(b) − f(a) < 0, so f(b) < f(a). It does not mean f decreases everywhere in between.'},
  {q: 'What is the average rate of change of the constant function f(x) = 7 on any interval?', opts: ['7', '0', 'undefined'], correct: 1, hint: 'The outputs never change.', why: 'Δy = 7 − 7 = 0, so the rate is 0 on every interval.'},
  {q: 'A ball’s height is h(t) = −16t² + 64t feet. Find the average rate of change on [0, 1].', opts: ['48 ft/s', '64 ft/s', '−16 ft/s'], correct: 0, hint: 'h(0) = 0. Compute h(1).', why: 'h(1) = −16 + 64 = 48, so (48 − 0)/(1 − 0) = 48 feet per second.'},
  {q: 'Find the average rate of change of f(x) = 1/x on [1, 2].', opts: ['1/2', '−1/2', '−1'], correct: 1, hint: 'f(2) = 1/2 and f(1) = 1.', why: '(1/2 − 1)/(2 − 1) = −1/2.'},
  {q: 'A graph falls from x = −∞ to x = 0 and rises after x = 0. Where is it decreasing?', opts: ['(0, ∞)', '(−∞, 0)', '(−∞, ∞)'], correct: 1, hint: 'Read left to right and use x-values.', why: 'The outputs go down as x increases from −∞ to 0, so the function decreases on (−∞, 0).'},
  {q: 'Find the average rate of change of f(x) = x³ on [−1, 1].', opts: ['0', '1', '2'], correct: 1, hint: 'f(1) = 1 and f(−1) = −1.', why: '(1 − (−1))/(1 − (−1)) = 2/2 = 1.'}
]);
})();
