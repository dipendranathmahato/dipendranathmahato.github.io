/* Section 3.5 Part II · Reflections, stretches, and compressions — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Frac} = CA, PAR = CA.parents;
const WIN = {xmin: -7, xmax: 7, ymin: -7, ymax: 7};
const brk = par => par.va !== undefined ? [0] : [];
const pt = (x, y) => `(${num(x)}, ${num(y)})`;
const tableHTML = (head, rows) => `<div class="ca-scroll-x"><table class="ca-data-table"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
const FR = {'0.5': '½', '-0.5': '−½', '0.333': '⅓', '-0.333': '−⅓', '0.25': '¼', '0.75': '¾', '1.5': '1.5'};
const coef = a => a === 1 ? '' : a === -1 ? '−' : (FR[String(CA.clean(Math.round(a * 1000) / 1000))] || num(a, 3));
const times = (a, par) => { // a·f(x) as a formula
  if (par === PAR.rec) return `${a < 0 ? '−' : ''}${Math.abs(a) === 1 ? '1' : coef(Math.abs(a))}/x`;
  if (par === PAR.rec2) return `${a < 0 ? '−' : ''}${Math.abs(a) === 1 ? '1' : coef(Math.abs(a))}/x²`;
  return `${coef(a)}${par.ex('x')}`;
};

/* ---------- 01 · reflections ---------- */
CA.lab('reflect-lab', {
  controls: [{type: 'select', key: 'p', label: 'Toolkit function f', value: 'sqrt', options: CA.parentOptions()},
    {type: 'seg', key: 'r', label: 'Reflection', value: 'x', options: [['x', 'over the x-axis: −f(x)'], ['y', 'over the y-axis: f(−x)'], ['both', 'both: −f(−x)']]}],
  plot: {h: 380}, plotLabel: 'Toolkit graph and its reflection', legend: [['gray', 'f(x)', true], ['orange', 'reflected graph'], ['purple', 'key points move']],
  readouts: [['eq', 'Formula'], ['rule', 'What changes']]
}, (lab, st) => {
  const par = PAR[st.p], sx = st.r === 'y' || st.r === 'both' ? -1 : 1, sy = st.r === 'x' || st.r === 'both' ? -1 : 1, P = lab.plane(WIN);
  if (par.va !== undefined) { P.vline(0); P.hline(0); }
  if (st.r !== 'y') P.hline(0, {color: 'purple', dash: '2 6', width: 3}); if (st.r !== 'x') P.vline(0, {color: 'purple', dash: '2 6', width: 3});
  P.curve(par.f, {color: 'gray', dash: '7 6', width: 2.4, breaks: brk(par)}).curve(x => sy * par.f(sx * x), {color: 'orange', width: 3.4, breaks: brk(par)});
  par.pts.forEach(([x, y]) => { const X = sx * x, Y = sy * y; if (X !== x || Y !== y) P.seg(x, y, X, Y, {color: 'purple', width: 1.8, arrow: true}); P.point(x, y, {color: 'gray', r: 4}).point(X, Y, {color: 'orange', r: 6}); });
  P.render();
  const inner = sx < 0 ? par.ex('−x') : par.ex('x');
  lab.read('eq', `y = ${sy < 0 ? '−' : ''}${par === PAR.rec || par === PAR.rec2 ? inner : inner}`.replace('−−', ''));
  lab.read('rule', st.r === 'x' ? 'outputs × (−1)' : st.r === 'y' ? 'inputs × (−1)' : 'inputs × (−1) and outputs × (−1)');
  lab.out('Key points:' + tableHTML(['point of f', 'reflected point'], par.pts.map(([x, y]) => [pt(x, y), `<b>${pt(sx * x, sy * y)}</b>`])) +
    (st.r !== 'x' && st.p === 'sq' ? '<p>y = x² is symmetric about the y-axis, so f(−x) = f(x): the reflection lands on itself.</p>' : '') +
    (st.r === 'both' && (st.p === 'cube' || st.p === 'x' || st.p === 'rec' || st.p === 'cbrt') ? '<p>This graph is symmetric about the origin, so −f(−x) = f(x): reflecting over both axes lands on itself.</p>' : ''));
});

/* ---------- 02 · vertical stretch/compression ---------- */
CA.lab('vstretch-lab', {
  controls: [{type: 'select', key: 'p', label: 'Toolkit function f', value: 'sq', options: CA.parentOptions()},
    {type: 'range', key: 'a', label: 'a =', min: -3, max: 3, step: 0.25, value: 2, skip: [0], fmt: v => num(v)},
    {type: 'check', key: 'cmp', label: 'Also show 2f(x) and 0.5f(x)', value: false}],
  plot: {h: 380}, plotLabel: 'Toolkit graph and its vertical stretch or compression', legend: [['gray', 'f(x)', true], ['orange', 'g(x) = a·f(x)']],
  readouts: [['eq', 'Formula'], ['kind', 'Type']]
}, (lab, st) => {
  const par = PAR[st.p], a = st.a, P = lab.plane(WIN);
  if (st.cmp) { P.curve(x => 2 * par.f(x), {color: 'blue', dash: '3 5', width: 2, breaks: brk(par)}).curve(x => 0.5 * par.f(x), {color: 'green', dash: '3 5', width: 2, breaks: brk(par)}); }
  P.curve(par.f, {color: 'gray', dash: '7 6', width: 2.4, breaks: brk(par)}).curve(x => a * par.f(x), {color: 'orange', width: 3.4, breaks: brk(par)});
  par.pts.forEach(([x, y]) => { if (a * y !== y) P.seg(x, y, x, a * y, {color: 'purple', width: 1.8, arrow: true}); P.point(x, y, {color: 'gray', r: 4}).point(x, a * y, {color: 'orange', r: 6}); });
  P.render();
  lab.read('eq', `g(x) = ${times(a, par)}`);
  const m = Math.abs(a);
  lab.read('kind', (m > 1 ? `vertical stretch by ${num(m)}` : m < 1 ? `vertical compression by ${num(m)}` : 'no stretch') + (a < 0 ? ' + reflection over the x-axis' : ''));
  lab.out('Multiply each <b>output</b> by a; the inputs stay the same.' + tableHTML(['x', 'f(x)', `g(x) = ${num(a)}·f(x)`], par.pts.map(([x, y]) => [fmt(x), fmt(y), `<b>${num(a * y)}</b>`])) + (st.cmp ? '<p>Blue dotted: 2f(x), a vertical stretch. Green dotted: 0.5f(x), a vertical compression.</p>' : ''));
});

/* ---------- 03 · horizontal stretch/compression ---------- */
const BS = [['3', '3'], ['2', '2'], ['1', '1'], ['0.5', '½'], ['0.333', '⅓'], ['-0.5', '−½'], ['-1', '−1'], ['-2', '−2']];
CA.lab('hstretch-lab', {
  controls: [{type: 'select', key: 'p', label: 'Toolkit function f', value: 'sq', options: CA.parentOptions()},
    {type: 'select', key: 'b', label: 'b =', value: '2', options: BS}],
  plot: {h: 380}, plotLabel: 'Toolkit graph and its horizontal stretch or compression', legend: [['gray', 'f(x)', true], ['orange', 'g(x) = f(bx)']],
  readouts: [['eq', 'Formula'], ['kind', 'Type']]
}, (lab, st) => {
  const par = PAR[st.p], b = st.b === '0.333' ? 1 / 3 : Number(st.b), P = lab.plane(WIN);
  P.curve(par.f, {color: 'gray', dash: '7 6', width: 2.4, breaks: brk(par)}).curve(x => par.f(b * x), {color: 'orange', width: 3.4, breaks: brk(par)});
  par.pts.forEach(([x, y]) => { const X = x / b; if (Math.abs(X - x) > 1e-9) P.seg(x, y, X, y, {color: 'purple', width: 1.8, arrow: true}); P.point(x, y, {color: 'gray', r: 4}).point(X, y, {color: 'orange', r: 6}); });
  P.render();
  const bt = BS.find(o => o[0] === st.b)[1], inside = b === 1 ? 'x' : b === -1 ? '−x' : `${bt}x`;
  lab.read('eq', `g(x) = ${par.ex(inside)}`);
  const m = Math.abs(b), inv = m === 0.5 ? '2' : st.b.endsWith('333') ? '3' : m === 2 ? '½' : m === 3 ? '⅓' : '1';
  lab.read('kind', (m > 1 ? `horizontal compression by ${inv}` : m < 1 ? `horizontal stretch by ${inv}` : 'no stretch') + (b < 0 ? ' + reflection over the y-axis' : ''));
  lab.out(`Multiply each <b>input</b> by 1/b = ${b < 0 ? '−' : ''}${inv}; the outputs stay the same.` + tableHTML(['point of f', 'point of g'], par.pts.map(([x, y]) => [pt(x, y), `<b>${pt(x / b, y)}</b>`])));
});
CA.choice('hstretch-choice', {q: 'The point (6, 4) on the graph of f moves to (2, 4) on the graph of g(x) = f(bx). What is b?', options: ['b = 3', 'b = 1/3', 'b = 2'], correct: 0,
  why: 'The input 6 became 2: it was multiplied by 1/3 = 1/b, so b = 3. Since b &gt; 1, this is a horizontal compression: g(x) = f(3x).',
  whyWrong: 'Inputs are multiplied by 1/b. Here 6 → 2 means multiplying by 1/3, so 1/b = 1/3 and b = 3.'});

/* ---------- 04 · table transformer ---------- */
const TX = [-2, 0, 2, 4], TY = [5, 10, 15, 20];
const OPS = {
  fneg: {t: 'g(x) = f(−x)', inp: x => -x, out: y => y, ix: x => `−(${fmt(x)}) = <b>${fmt(-x)}</b>`, oy: y => fmt(y), what: 'Inside change: multiply each input by −1 (reflection over the y-axis).'},
  neg: {t: 'g(x) = −f(x)', inp: x => x, out: y => -y, ix: fmt, oy: y => `−${fmt(y)} = <b>${fmt(-y)}</b>`, what: 'Outside change: multiply each output by −1 (reflection over the x-axis).'},
  two: {t: 'g(x) = 2f(x)', inp: x => x, out: y => 2 * y, ix: fmt, oy: y => `2·${fmt(y)} = <b>${fmt(2 * y)}</b>`, what: 'Outside change: multiply each output by 2 (vertical stretch).'},
  half: {t: 'g(x) = ½f(x)', inp: x => x, out: y => y / 2, ix: fmt, oy: y => `½·${fmt(y)} = <b>${num(y / 2)}</b>`, what: 'Outside change: multiply each output by ½ (vertical compression).'},
  in2: {t: 'g(x) = f(2x)', inp: x => x / 2, out: y => y, ix: x => `${fmt(x)}·½ = <b>${num(x / 2)}</b>`, what: 'Inside change: multiply each input by 1/2 (horizontal compression).', oy: fmt},
  inhalf: {t: 'g(x) = f(½x)', inp: x => 2 * x, out: y => y, ix: x => `${fmt(x)}·2 = <b>${fmt(2 * x)}</b>`, what: 'Inside change: multiply each input by 2 (horizontal stretch).', oy: fmt}
};
CA.lab('refl-table-lab', {
  controls: [{type: 'seg', key: 'op', label: 'New function', value: 'fneg', options: Object.entries(OPS).map(([k, v]) => [k, v.t])}],
  top: '<div id="refl-table-out"></div>', plot: {h: 320}, plotLabel: 'Table values before and after', legend: [['gray', 'f'], ['orange', 'g']]
}, (lab, st) => {
  const o = OPS[st.op];
  document.getElementById('refl-table-out').innerHTML = tableHTML(['x', ...TX.map(fmt)], [['f(x)', ...TY.map(fmt)]]) + `<p><b>${o.t}</b>: ${o.what}</p>` +
    tableHTML(['x', ...TX.map(x => o.ix(x))], [['g(x)', ...TY.map(y => o.oy(y))]]);
  const P = lab.plane({xmin: -9, xmax: 9, ymin: -22, ymax: 42});
  TX.forEach((x, i) => { const X = o.inp(x), Y = o.out(TY[i]); P.seg(x, TY[i], X, Y, {color: 'purple', width: 1.5, arrow: true}); P.point(x, TY[i], {color: 'gray', r: 5}).point(X, Y, {color: 'orange', r: 6}); });
  P.render();
  lab.out(o.t.includes('(−x)') || o.t.includes('(2x)') || o.t.includes('(½x)') ? 'The outputs did not change; only the inputs moved.' : 'The inputs did not change; only the outputs moved.');
});

/* ---------- 05 · combination stepper ---------- */
const BASE = {
  semi: {label: 'Top half of a circle · f(x) = √(4 − x²)', f: x => 4 - x * x >= 0 ? Math.sqrt(4 - x * x) : NaN, pts: [[-2, 0], [0, 2], [2, 0]], name: 'f'},
  sqrt: {label: 'Square root · f(x) = √x', f: x => x >= 0 ? Math.sqrt(x) : NaN, pts: [[0, 0], [1, 1], [4, 2]], name: 'f'},
  abs: {label: 'Absolute value · f(x) = |x|', f: Math.abs, pts: [[-2, 2], [0, 0], [2, 2]], name: 'f'}
};
const BOPT = [['0.5', '½'], ['1', '1'], ['2', '2'], ['-1', '−1'], ['-0.5', '−½'], ['3', '3']];
const bTxt = b => BOPT.find(o => Number(o[0]) === b)?.[1] || num(b);
let comboStep = 0, stepper;
const combo = CA.lab('combo-lab', {
  controls: [
    {type: 'select', key: 'base', label: 'Toolkit graph', value: 'semi', options: Object.entries(BASE).map(([k, v]) => [k, v.label])},
    {type: 'seg', key: 'pre', label: 'Load', value: 'ex', options: [['ex', 'k(x) = f(½x + 1) − 3'], ['ex2', 'k(x) = 2f(−x) + 1'], ['own', 'my own']]},
    {type: 'range', key: 'a', label: 'a =', min: -3, max: 3, step: 0.5, value: 1, skip: [0], fmt: v => num(v)},
    {type: 'select', key: 'b', label: 'b =', value: '0.5', options: BOPT},
    {type: 'range', key: 'c', label: 'c =', min: -4, max: 4, step: 1, value: 1},
    {type: 'range', key: 'd', label: 'd =', min: -5, max: 5, step: 1, value: -3}
  ],
  top: '<div class="ca-equation" id="combo-eq"></div><div id="combo-step"></div>', plot: {h: 400}, plotLabel: 'Graph after each transformation',
  legend: [['gray', 'previous stage', true], ['orange', 'current stage']], bottom: '<div id="combo-table"></div>'
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const v = st.pre === 'ex' ? ['semi', 1, '0.5', 1, -3] : ['sqrt', 2, '-1', 0, 1]; st.set('base', v[0], true); st.set('a', v[1], true); st.set('b', v[2], true); st.set('c', v[3], true); st.set('d', v[4], true); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  if (key) { comboStep = 0; stepper && stepper.reset(); return; }
  draw(lab, st);
});
function stages(st) {
  const B = BASE[st.base], a = st.a, b = Number(st.b), c = st.c, d = st.d, h = -c / b, f = B.f;
  const H = Frac.of(c).neg().div(Frac.of(b));
  return [
    {t: `Start with ${B.label.split('·')[1].trim()}`, fn: f, map: (x, y) => [x, y], why: 'Key points of the toolkit graph.'},
    {t: `Horizontal ${Math.abs(b) > 1 ? 'compression' : Math.abs(b) < 1 ? 'stretch' : 'scale 1 (no change)'}${b < 0 ? ' and reflection over the y-axis' : ''}: inputs × 1/b = ${bTxt(1 / b)}`, fn: x => f(b * x), map: (x, y) => [x / b, y], why: `y = f(${bTxt(b)}x)`},
    {t: `Horizontal shift: ${h === 0 ? 'none (h = 0)' : `${h > 0 ? 'right' : 'left'} ${num(Math.abs(h))}`} (add h = ${H} to the inputs)`, fn: x => f(b * x + c), map: (x, y) => [x / b + h, y], why: `y = f(${bTxt(b)}(${CA.xMinus(CA.clean(h))}))`},
    {t: `Vertical ${Math.abs(a) > 1 ? 'stretch' : Math.abs(a) < 1 ? 'compression' : 'scale 1 (no change)'}${a < 0 ? ' and reflection over the x-axis' : ''}: outputs × ${num(a)}`, fn: x => a * f(b * x + c), map: (x, y) => [x / b + h, a * y], why: `y = ${coef(a)}f(${bTxt(b)}(${CA.xMinus(CA.clean(h))}))`},
    {t: `Vertical shift: ${d === 0 ? 'none' : `${d > 0 ? 'up' : 'down'} ${Math.abs(d)}`} (add ${fmt(d)} to the outputs)`, fn: x => a * f(b * x + c) + d, map: (x, y) => [x / b + h, a * y + d], why: `y = ${coef(a)}f(${bTxt(b)}(${CA.xMinus(CA.clean(h))}))${CA.plusK(d)}`}
  ];
}
function draw(lab, st) {
  const S = stages(st), i = comboStep, B = BASE[st.base], a = st.a, b = Number(st.b), c = st.c, d = st.d;
  const inside = `${bTxt(b) === '1' ? '' : bTxt(b) === '−1' ? '−' : bTxt(b)}x${CA.plusK(c)}`;
  document.getElementById('combo-eq').innerHTML = `k(x) = ${coef(a)}f(${inside})${CA.plusK(d)} &nbsp;=&nbsp; ${S[4].why.replace('y = ', '')}`;
  const P = lab.plane({xmin: -8, xmax: 8, ymin: -7, ymax: 7});
  if (i > 0) P.curve(S[i - 1].fn, {color: 'gray', dash: '7 6', width: 2.4});
  P.curve(S[i].fn, {color: 'orange', width: 3.4});
  B.pts.forEach(([x, y]) => { const [x0, y0] = S[Math.max(0, i - 1)].map(x, y), [x1, y1] = S[i].map(x, y); if (i > 0 && (Math.abs(x1 - x0) > 1e-9 || Math.abs(y1 - y0) > 1e-9)) P.seg(x0, y0, x1, y1, {color: 'purple', width: 1.8, arrow: true}); P.point(x1, y1, {color: 'orange', r: 6}); });
  P.render();
  document.getElementById('combo-table').innerHTML = tableHTML(['stage', ...B.pts.map((_, k) => `key point ${k + 1}`)], S.slice(0, i + 1).map((s, j) => [`${j}. ${s.why}`, ...B.pts.map(([x, y]) => { const [X, Y] = s.map(x, y); return j === i ? `<b>${pt(X, Y)}</b>` : pt(X, Y); })]));
  lab.out(`<b>Step ${i + 1} of 5:</b> ${S[i].t}.`);
}
stepper = CA.stepper('combo-step', () => 5, i => { comboStep = i; draw(combo, combo.state); });

CA.guided('35b', [
  {q: 'Which transformation turns y = √x into y = −√x?', opts: ['Reflection over the y-axis', 'Reflection over the x-axis', 'Shift down'], correct: 1, hint: 'The minus sign is outside the square root.', why: 'Multiplying every output by −1 reflects the graph over the x-axis.'},
  {q: 'Which transformation turns y = √x into y = √(−x)?', opts: ['Reflection over the y-axis', 'Reflection over the x-axis', 'Shift left'], correct: 0, hint: 'The minus sign is inside, on the input.', why: 'Multiplying every input by −1 reflects the graph over the y-axis.'},
  {q: 'Describe g(x) = 3f(x).', opts: ['Horizontal stretch by 3', 'Vertical stretch by 3', 'Vertical compression by 1/3'], correct: 1, hint: 'The 3 multiplies the outputs.', why: 'Outputs × 3 with 3 &gt; 1: a vertical stretch by a factor of 3.'},
  {q: 'Describe g(x) = 0.5f(x).', opts: ['Vertical compression by 0.5', 'Horizontal stretch by 2', 'Vertical stretch by 2'], correct: 0, hint: '0 &lt; 0.5 &lt; 1 and the multiplier is outside.', why: 'Outputs × 0.5: a vertical compression by a factor of 0.5.'},
  {q: 'Describe g(x) = f(2x).', opts: ['Horizontal stretch by 2', 'Horizontal compression by 1/2', 'Vertical stretch by 2'], correct: 1, hint: 'Inside multipliers act on inputs, by 1/b.', why: 'Inputs × 1/2: the graph is compressed horizontally by a factor of 1/2.'},
  {q: 'Describe g(x) = f(x/3).', opts: ['Horizontal stretch by 3', 'Horizontal compression by 1/3', 'Vertical compression by 1/3'], correct: 0, hint: 'Here b = 1/3, so 1/b = 3.', why: 'Inputs × 3: a horizontal stretch by a factor of 3.'},
  {q: '(4, 6) is on the graph of f. Which point is on y = −2f(x)?', opts: ['(−8, 6)', '(4, −12)', '(4, −3)'], correct: 1, hint: 'Only the output changes.', why: 'Output × (−2): 6 → −12, so the point is (4, −12).'},
  {q: '(4, 6) is on the graph of f. Which point is on y = f(2x)?', opts: ['(8, 6)', '(2, 6)', '(4, 12)'], correct: 1, hint: 'Inputs are multiplied by 1/2.', why: 'Input × 1/2: 4 → 2, so the point is (2, 6). Check: f(2·2) = f(4) = 6.'},
  {q: 'Which list describes q(x) = −4f(2x) + 6?', opts: ['Reflect over x-axis, vertical stretch 4, horizontal compression 1/2, up 6', 'Reflect over y-axis, horizontal stretch 2, down 6', 'Vertical compression 1/4, horizontal stretch 2, up 6'], correct: 0, hint: 'Outside: −4 and + 6. Inside: 2.', why: 'The −4 reflects over the x-axis and stretches vertically by 4; the 2 inside compresses horizontally by 1/2; + 6 shifts up 6.'},
  {q: 'f(2) = −1. For g(x) = f(−x), which input gives g(x) = −1?', opts: ['x = 2', 'x = −2', 'x = 1'], correct: 1, hint: 'g(−2) = f(−(−2)).', why: 'g(−2) = f(2) = −1. Inputs are multiplied by −1.'}
]);
})();
