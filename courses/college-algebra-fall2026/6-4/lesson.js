/* Section 6.4 · Graphs of Logarithmic Functions — interactive activities */
(() => {
'use strict';
const {fmt, num, F} = CA;
const BASES = [['2', '2'], ['3', '3'], ['4', '4'], ['10', '10'], ['e', 'e'], ['1/2', '1/2'], ['1/3', '1/3']];
const bval = s => s === 'e' ? Math.E : s.includes('/') ? s.split('/').map(Number).reduce((p, q) => p / q) : Number(s);
const toF = s => s.includes('/') ? F(...s.split('/').map(Number)) : F(Number(s), 1);
const SUBD = '₀₁₂₃₄₅₆₇₈₉', sub = s => String(s).split('').map(c => /\d/.test(c) ? SUBD[c] : c).join('');
const lname = b => b === '10' ? 'log' : b === 'e' ? 'ln' : b.includes('/') ? `log<sub>${b}</sub>` : `log${sub(b)}`;
const fstr = f => { if (f.d === 1) return f.toString(); let d = f.d, p = 0; while (d % 10 === 0) { d /= 10; p++; } return d === 1 ? fmt(String(f.v)) : f.toString(); };
const pt = (x, y) => `(${fstr(x)}, ${fstr(y)})`;

/* ---------- 01 · reflection over y = x ---------- */
CA.lab('refl-lab', {
  controls: [{type: 'select', key: 'b', label: 'Base b', value: '2', options: BASES.filter(b => b[0] !== 'e')}, {type: 'range', key: 's', label: 'Reflection', min: 0, max: 100, step: 5, value: 0, fmt: v => v + '%'}],
  plot: {h: 400}, plotLabel: 'Exponential graph reflecting over y = x into a logarithm', legend: [['orange', 'y = bˣ'], ['blue', 'y = log_b x'], ['gray', 'y = x', true]],
  readouts: [['dom', 'Domain'], ['rng', 'Range'], ['asy', 'Asymptote'], ['pts', 'Key points']]
}, (lab, st) => {
  const b = toF(st.b), bb = b.v, s = st.s / 100, Pl = lab.plane({xmin: -4, xmax: 6, ymin: -4, ymax: 6});
  const ex = t => bb ** t, lg = t => t > 0 ? Math.log(t) / Math.log(bb) : NaN;
  Pl.curve(x => x, {color: 'gray', dash: '5 5', width: 1.8}).curve(ex, {color: 'orange', width: s > 0 ? 2 : 3.2, dash: s > 0 ? '6 5' : null});
  if (s > 0 && s < 1) Pl.param(t => (1 - s) * t + s * ex(t), t => (1 - s) * ex(t) + s * t, -6, 4, {color: 'purple', width: 3});
  if (s === 1) Pl.curve(lg, {color: 'blue', width: 3.4, from: 1e-5}).vline(0, {color: 'blue', dash: '6 5'});
  else Pl.hline(0, {color: 'orange', dash: '6 5'});
  const inv = F(1, 1).div(b), E = [[F(-1, 1), inv], [F(0, 1), F(1, 1)], [F(1, 1), b]];
  E.forEach(([x, y]) => { const X = (1 - s) * x.v + s * y.v, Y = (1 - s) * y.v + s * x.v; Pl.point(X, Y, {color: s === 1 ? 'blue' : s === 0 ? 'orange' : 'purple', r: 6, label: s === 0 ? pt(x, y) : s === 1 ? pt(y, x) : '', labelOpt: {size: 12}}); });
  Pl.render();
  const done = s === 1;
  lab.read('dom', done ? '(0, ∞)' : s === 0 ? '(−∞, ∞)' : '…'); lab.read('rng', done ? '(−∞, ∞)' : s === 0 ? '(0, ∞)' : '…'); lab.read('asy', done ? 'vertical x = 0' : s === 0 ? 'horizontal y = 0' : '…');
  lab.read('pts', done ? E.map(([x, y]) => pt(y, x)).join(', ') : s === 0 ? E.map(([x, y]) => pt(x, y)).join(', ') : 'moving…');
  lab.out(done ? `y = ${lname(st.b)}(x): every point (x, y) of y = ${st.b.includes('/') ? `(${st.b})` : st.b}ˣ became (y, x). The horizontal asymptote y = 0 became the vertical asymptote x = 0, and the y-intercept (0, 1) became the x-intercept (1, 0).` : s === 0 ? `Start: y = ${st.b.includes('/') ? `(${st.b})` : st.b}ˣ with key points ${E.map(([x, y]) => pt(x, y)).join(', ')}. Slide the reflection to 100%.` : 'Each point moves straight across the line y = x toward its mirror image.');
});

/* ---------- 02 · domain from argument > 0 ---------- */
const DM = {
  a: {A: '1', b: '5', m: 1, c: 4, d: 0}, b: {A: '3', b: '10', m: 4, c: -1, d: 0}, c: {A: '-7', b: 'e', m: -8, c: 2, d: 1},
  t1: {A: '1/2', b: '10', m: -1, c: 7, d: -3}, t2: {A: '1', b: 'e', m: 2, c: 6, d: 4}
};
const lin = (m, c) => { const mx = m === 1 ? 'x' : m === -1 ? '−x' : `${fmt(m)}x`; if (m < 0 && c > 0) return `${c} − ${m === -1 ? 'x' : `${-m}x`}`; return c === 0 ? mx : `${mx} ${c > 0 ? '+' : '−'} ${Math.abs(c)}`; };
const coefS = A => A === '1' ? '' : A === '-1' ? '−' : A.includes('/') ? `(${fmt(A)})` : fmt(A);
const dform = D => `${coefS(D.A)}${lname(D.b)}(${lin(D.m, D.c)})${D.d ? ` ${D.d > 0 ? '+' : '−'} ${Math.abs(D.d)}` : ''}`;
CA.lab('dom-lab', {
  controls: [{type: 'select', key: 'f', label: 'Function', value: 'a', options: Object.entries(DM).map(([k, D]) => [k, dform(D).replace(/<[^>]+>/g, '')])}],
  middle: '<svg id="log-dom-line" role="img" aria-label="Domain on a number line"></svg>', plot: {h: 400}, plotLabel: 'Graph of the logarithmic function with its vertical asymptote', readouts: [['f', 'Function'], ['arg', 'Argument'], ['dom', 'Domain']], steps: true
}, (lab, st) => {
  const D = DM[st.f], A = toF(D.A).v, bb = bval(D.b), edge = F(-D.c, D.m), right = D.m > 0, f = x => { const u = D.m * x + D.c; return u > 0 ? A * Math.log(u) / Math.log(bb) + D.d : NaN; };
  lab.read('f', `y = ${dform(D)}`); lab.read('arg', lin(D.m, D.c)); lab.read('dom', right ? `(${edge}, ∞)` : `(−∞, ${edge})`);
  const steps = [['Set the argument &gt; 0', `${lin(D.m, D.c)} &gt; 0`]];
  if (D.m > 0) { steps.push(['Isolate the x-term', `${D.m === 1 ? 'x' : D.m + 'x'} &gt; ${fmt(-D.c)}`]); if (D.m !== 1) steps.push(['Divide by ' + D.m, `x &gt; ${edge}`]); }
  else { steps.push(['Isolate the x-term', `${D.m === -1 ? '−x' : fmt(D.m) + 'x'} &gt; ${fmt(-D.c)}`]); steps.push([`Divide by ${fmt(D.m)} and flip the inequality`, `x &lt; ${edge}`]); }
  steps.push(['Domain', right ? `(${edge}, ∞)` : `(−∞, ${edge})`]); lab.steps(steps);
  const e = edge.v, mn = Math.floor(e) - 6, mx = Math.ceil(e) + 6;
  CA.numberLine('log-dom-line', {min: mn, max: mx, step: 1, segments: [right ? {a: e, b: null, color: 'blue'} : {a: null, b: e, color: 'blue'}], labels: [{x: e, text: `x = ${edge}`, color: 'red'}]});
  const Pl = lab.plane({xmin: mn, xmax: mx, ymin: -10, ymax: 10});
  Pl.curve(f, {color: 'orange', width: 3.2, samples: 1600}).vline(e, {color: 'purple', dash: '7 6'}).render();
  lab.out(`The base (${D.b}), the coefficient ${fmt(D.A)}, and the vertical shift do not change the domain. Only the argument matters. The vertical asymptote sits at the boundary x = ${edge}.`);
});

/* ---------- 03 · staged transformations ---------- */
const AS = [['-3', '−3'], ['-2', '−2'], ['-1', '−1'], ['-1/2', '−1/2'], ['1/2', '1/2'], ['1', '1'], ['2', '2'], ['3', '3']];
const LT = {
  e2a: {b: '2', a: '1', h: -1, k: 4, t: 'Example: y = log₂(x + 1) + 4'},
  e2b: {b: '10', a: '-1/2', h: 3, k: -5, t: 'Example: y = −(1/2)log(x − 3) − 5'},
  t2: {b: '4', a: '-3', h: -5, k: -2, t: 'Practice: y = −3log₄(x + 5) − 2'},
  own: {t: 'Set your own'}
};
const STG = ['Start: y = log_b x', 'Stretch, compress, or reflect (multiply y by a)', 'Horizontal shift (move the asymptote)', 'Vertical shift', 'Read the features'];
let ltStepper;
const lt = CA.lab('lt-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Function', value: 'e2a', options: Object.entries(LT).map(([k, v]) => [k, v.t])},
    {type: 'select', key: 'b', label: 'b', value: '2', options: BASES.filter(b => b[0] !== 'e')}, {type: 'select', key: 'a', label: 'a', value: '1', options: AS},
    {type: 'range', key: 'h', label: 'h =', min: -6, max: 6, value: -1}, {type: 'range', key: 'k', label: 'k =', min: -6, max: 6, value: 4}],
  top: '<div id="lt-stepper"></div>', plot: {h: 400}, plotLabel: 'Key points of a logarithmic graph moving through transformations', readouts: [['f', 'Target'], ['va', 'Vertical asymptote'], ['dom', 'Domain'], ['int', 'Intercepts']],
  middle: '<div class="ca-scroll-x"><table class="ca-data-table" id="lt-table" aria-label="Key points at each stage"></table></div>'
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const S = LT[st.pre]; ['b', 'a', 'h', 'k'].forEach(q => st.set(q, S[q], true)); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  if (!ltStepper) return; if (key) ltStepper.reset(); else drawLt();
});
function drawLt() {
  const st = lt.state, i = ltStepper ? ltStepper.i : 0, b = toF(st.b), a = toF(st.a), h = st.h, k = st.k, bb = b.v;
  const base = [[F(1, 1).div(b), F(-1, 1)], [F(1, 1), F(0, 1)], [b, F(1, 1)]];
  const stage = j => base.map(([u, v]) => { let x = u, y = v; if (j >= 1) y = y.mul(a); if (j >= 2) x = x.add(h); if (j >= 3) y = y.add(k); return [x, y]; });
  const L = t => t > 0 ? Math.log(t) / Math.log(bb) : NaN, fs = [L, x => a.v * L(x), x => a.v * L(x - h), x => a.v * L(x - h) + k];
  const j = Math.min(i, 3), P = stage(j), va = j >= 2 ? h : 0;
  const all = [0, 1, 2, 3].flatMap(s => stage(s)).map(([x, y]) => [x.v, y.v]), xs = all.map(p => p[0]).concat([0, h]), ys = all.map(p => p[1]).concat([0]);
  const Pl = lt.plane({xmin: Math.min(-2, Math.min(...xs) - 2), xmax: Math.max(4, Math.max(...xs) + 2), ymin: Math.min(-3, Math.min(...ys) - 2), ymax: Math.max(3, Math.max(...ys) + 2)});
  if (j > 0) Pl.curve(fs[j - 1], {color: 'gray', dash: '6 6', width: 2, samples: 1600});
  Pl.curve(fs[j], {color: 'orange', width: 3.4, samples: 1600}).vline(va, {color: 'purple', dash: '7 6'});
  P.forEach(([x, y]) => Pl.point(x.v, y.v, {color: 'green', r: 6, label: pt(x, y), labelOpt: {size: 12}}));
  const xint = h + bb ** (-k / a.v), yint = h < 0 ? a.v * L(-h) + k : null;
  if (i >= 4) { Pl.point(xint, 0, {color: 'blue', r: 6}); if (yint !== null) Pl.point(0, yint, {color: 'blue', r: 6}); }
  Pl.render();
  const coef = a.eq(1) ? '' : a.eq(-1) ? '−' : a.d === 1 ? a.toString() : `(${a})`;
  lt.read('f', `y = ${coef}${lname(st.b)}(${h === 0 ? 'x' : `x ${h > 0 ? '−' : '+'} ${Math.abs(h)}`})${k ? ` ${k > 0 ? '+' : '−'} ${Math.abs(k)}` : ''}`);
  lt.read('va', `x = ${fmt(va)}`); lt.read('dom', i >= 4 ? `(${fmt(h)}, ∞)` : '—'); lt.read('int', i >= 4 ? `x-int ≈ (${num(xint, 4)}, 0)${yint !== null ? `; y-int ≈ (0, ${num(yint, 4)})` : '; no y-intercept (x = 0 is not in the domain)'}` : '—');
  document.getElementById('lt-table').innerHTML = `<tr><th>stage</th><th>point 1</th><th>point 2</th><th>point 3</th><th>asymptote</th></tr>` + [0, 1, 2, 3].map(s => `<tr><th class="${s === j ? 'hl' : ''}">${['y = log_b x', '× a', 'shift ↔', 'shift ↕'][s]}</th>${stage(s).map(([x, y]) => `<td class="${s === j ? 'hl' : ''}">${s <= j ? pt(x, y) : ''}</td>`).join('')}<td class="${s === j ? 'hl' : ''}">${s <= j ? `x = ${s >= 2 ? fmt(h) : 0}` : ''}</td></tr>`).join('');
  const say = [
    `Key points of y = ${lname(st.b)}(x): (1/b, −1), (1, 0), (b, 1). Vertical asymptote x = 0.`,
    a.eq(1) ? 'a = 1: nothing changes.' : `Multiply each y-coordinate by ${a}${a.v < 0 ? ' (a reflection over the x-axis)' : ''}. The asymptote stays x = 0.`,
    h === 0 ? 'h = 0: no horizontal shift.' : `Shift ${Math.abs(h)} ${h > 0 ? 'right: add' : 'left: subtract'} ${Math.abs(h)} ${h > 0 ? 'to' : 'from'} each x-coordinate. The vertical asymptote moves to x = ${fmt(h)}.`,
    k === 0 ? 'k = 0: no vertical shift.' : `Shift ${Math.abs(k)} ${k > 0 ? 'up: add' : 'down: subtract'} ${Math.abs(k)} ${k > 0 ? 'to' : 'from'} each y-coordinate.`,
    `Domain: x − (${fmt(h)}) &gt; 0, so (${fmt(h)}, ∞). Range (−∞, ∞). x-intercept: set y = 0 and solve, x = ${fmt(h)} + ${st.b}<sup>${num(-k / a.v, 4)}</sup> ≈ ${num(xint, 4)}.`
  ];
  lt.out(`<b>${STG[i]}.</b> ${say[i]}`);
}
ltStepper = CA.stepper('lt-stepper', () => 5, drawLt, {labels: j => ['parent', '× a', 'horizontal', 'vertical', 'features'][j]});

/* ---------- 04 · fill in the blanks ---------- */
const box = document.getElementById('fill-box'), sels = [...box.querySelectorAll('select')], out = document.getElementById('fill-out');
document.getElementById('fill-check').addEventListener('click', () => {
  let right = 0, blank = 0;
  sels.forEach(s => { s.classList.remove('right', 'wrong'); if (!s.value) { blank++; return; } const ok = s.value === s.dataset.answer; s.classList.add(ok ? 'right' : 'wrong'); if (ok) right++; });
  out.className = 'ca-feedback ' + (right === sels.length ? 'ca-correct' : '');
  out.innerHTML = right === sels.length ? `✓ All ${sels.length} blanks are correct. Remember: a changes y-values, c moves the vertical asymptote, d moves the graph up or down.` : `${right} of ${sels.length} correct${blank ? `, ${blank} blank` : ''}. Red blanks need another look: the sign inside (x − c) works opposite to the shift direction.`;
});
document.getElementById('fill-reset').addEventListener('click', () => { sels.forEach(s => { s.value = ''; s.classList.remove('right', 'wrong'); }); out.className = 'ca-feedback'; out.textContent = 'Choose an answer in each blank, then check.'; });

CA.guided('64', [
  {q: 'What is the domain of y = log₃(x − 2)?', opts: ['(2, ∞)', '(−2, ∞)', '(−∞, 2)'], correct: 0, hint: 'x − 2 &gt; 0.', why: 'x &gt; 2.'},
  {q: 'What is the domain of y = ln(5 − x)?', opts: ['(−∞, 5)', '(5, ∞)', '(−5, ∞)'], correct: 0, hint: 'Solve 5 − x &gt; 0; dividing by −1 flips the inequality.', why: '−x &gt; −5 gives x &lt; 5.'},
  {q: 'What is the vertical asymptote of y = log(x + 4) − 1?', opts: ['x = −4', 'x = 4', 'y = −1'], correct: 0, hint: 'Set the argument equal to 0.', why: 'x + 4 = 0 gives x = −4.'},
  {q: 'Which point is on y = log₅(x)?', opts: ['(5, 1)', '(1, 5)', '(0, 1)'], correct: 0, hint: 'Key point (b, 1).', why: 'log₅(5) = 1.'},
  {q: 'What is the x-intercept of y = log₇(x)?', opts: ['(1, 0)', '(0, 1)', '(7, 0)'], correct: 0, hint: 'log_b(1) = 0.', why: 'log₇(1) = 0.'},
  {q: 'Under y = log₂(x − 3), the key point (2, 1) of log₂x moves to…', opts: ['(5, 1)', '(−1, 1)', '(2, −2)'], correct: 0, hint: 'Shift right 3.', why: 'Add 3 to the x-coordinate.'},
  {q: 'The graph of y = −log(x) is the graph of y = log(x)…', opts: ['reflected over the x-axis', 'reflected over the y-axis', 'shifted down 1'], correct: 0, hint: 'a &lt; 0.', why: 'A negative a reflects over the x-axis.'},
  {q: 'Does the domain of y = 4log₂(x + 1) + 9 depend on the 4 or the 9?', opts: ['No, only on x + 1 &gt; 0', 'Yes, on both', 'Only on the 9'], correct: 0, hint: 'Only the argument matters.', why: 'The domain is (−1, ∞) regardless of the stretch and shift.'},
  {q: 'Is y = log<sub>1/2</sub>(x) increasing or decreasing?', opts: ['Decreasing', 'Increasing'], correct: 0, hint: 'Compare b with 1.', why: '0 &lt; b &lt; 1 gives a decreasing graph.'},
  {q: 'The logarithm y = log_b x is the reflection of y = bˣ over…', opts: ['the line y = x', 'the x-axis', 'the y-axis'], correct: 0, hint: 'Inverse functions.', why: 'Inverse functions are reflections over y = x.'}
]);
})();
