/* Section 3.5 Part I · Shifts — interactive activities */
(() => {
'use strict';
const {fmt, num} = CA, PAR = CA.parents;
const WIN = {xmin: -7, xmax: 7, ymin: -6, ymax: 9};
const moved = (par, h, k) => x => par.f(x - h) + k;
const brk = (par, h = 0) => par.va !== undefined ? [par.va + h] : [];
const asym = (P, par, h, k, color) => { if (par.va !== undefined) { P.vline(par.va + h, {color: color || 'gray'}); P.hline(par.ha + k, {color: color || 'gray'}); } };
const pt = (x, y) => `(${num(x)}, ${num(y)})`;
const tableHTML = (head, rows) => `<div class="ca-scroll-x"><table class="ca-data-table"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;

/* ---------- 01 · vertical shift ---------- */
CA.lab('vshift-lab', {
  controls: [{type: 'select', key: 'p', label: 'Toolkit function f', value: 'sq', options: CA.parentOptions()}, {type: 'range', key: 'k', label: 'k =', min: -5, max: 5, value: 4}],
  plot: {h: 380}, plotLabel: 'Toolkit graph and its vertical shift', legend: [['gray', 'f(x)', true], ['orange', 'g(x) = f(x) + k'], ['purple', 'key points move']],
  readouts: [['eq', 'Formula'], ['move', 'Shift']]
}, (lab, st) => {
  const par = PAR[st.p], k = st.k, P = lab.plane(WIN);
  asym(P, par, 0, 0); if (k && par.va !== undefined) P.hline(par.ha + k, {color: 'orange'});
  P.curve(par.f, {color: 'gray', dash: '7 6', width: 2.4, breaks: brk(par)}).curve(moved(par, 0, k), {color: 'orange', width: 3.4, breaks: brk(par)});
  par.pts.forEach(([x, y]) => { if (k) P.seg(x, y, x, y + k, {color: 'purple', width: 2, arrow: true}); P.point(x, y, {color: 'gray', r: 4}).point(x, y + k, {color: 'orange', r: 6}); });
  P.render();
  lab.read('eq', `g(x) = ${par.ex('x')}${CA.plusK(k)}`);
  lab.read('move', k > 0 ? `up ${k} unit${k === 1 ? '' : 's'}` : k < 0 ? `down ${-k} unit${k === -1 ? '' : 's'}` : 'no shift');
  lab.out('Key points: add k to each <b>output</b>; the inputs stay the same.' + tableHTML(['x', 'f(x)', `g(x) = f(x)${CA.plusK(k) || ' + 0'}`], par.pts.map(([x, y]) => [fmt(x), fmt(y), `${fmt(y)}${CA.plusK(k)} = <b>${fmt(y + k)}</b>`])));
});

/* ---------- 02 · horizontal shift ---------- */
CA.lab('hshift-lab', {
  controls: [{type: 'select', key: 'p', label: 'Toolkit function f', value: 'sq', options: CA.parentOptions()}, {type: 'range', key: 'h', label: 'h =', min: -5, max: 5, value: 2}],
  plot: {h: 380}, plotLabel: 'Toolkit graph and its horizontal shift', legend: [['gray', 'f(x)', true], ['orange', 'g(x) = f(x − h)'], ['purple', 'key points move']],
  readouts: [['eq', 'Formula'], ['move', 'Shift'], ['zero', 'Check: inside = 0 at']]
}, (lab, st) => {
  const par = PAR[st.p], h = st.h, P = lab.plane(WIN);
  asym(P, par, 0, 0); if (h && par.va !== undefined) P.vline(par.va + h, {color: 'orange'});
  P.curve(par.f, {color: 'gray', dash: '7 6', width: 2.4, breaks: brk(par)}).curve(moved(par, h, 0), {color: 'orange', width: 3.4, breaks: brk(par, h)});
  par.pts.forEach(([x, y]) => { if (h) P.seg(x, y, x + h, y, {color: 'purple', width: 2, arrow: true}); P.point(x, y, {color: 'gray', r: 4}).point(x + h, y, {color: 'orange', r: 6}); });
  P.render();
  lab.read('eq', `g(x) = ${par.ex(CA.xMinus(h))}`);
  lab.read('move', h > 0 ? `right ${h} unit${h === 1 ? '' : 's'}` : h < 0 ? `left ${-h} unit${h === -1 ? '' : 's'}` : 'no shift');
  lab.read('zero', `${CA.xMinus(h)} = 0 → x = ${fmt(h)}`);
  lab.out('Key points: each <b>input</b> moves by h; the outputs stay the same.' + tableHTML(['point of f', 'point of g'], par.pts.map(([x, y]) => [pt(x, y), `(${fmt(x)}${CA.plusK(h)}, ${fmt(y)}) = <b>${pt(x + h, y)}</b>`])));
});

/* ---------- 03 · shifting a table ---------- */
const TT = [-3, 1, 6, 9, 10], TS = [12, 8, 3, 0, -6];
CA.lab('shift-table-lab', {
  controls: [
    {type: 'seg', key: 't', label: 'New function', value: 'up', options: [['up', 'p(t) = s(t) + c'], ['down', 'p(t) = s(t) − c'], ['left', 'p(t) = s(t + c)'], ['right', 'p(t) = s(t − c)']]},
    {type: 'range', key: 'c', label: 'c =', min: 1, max: 8, value: 6}
  ],
  top: '<div id="shift-table-out"></div>', plot: {h: 340}, plotLabel: 'Original and shifted table values', legend: [['gray', 's(t)'], ['orange', 'p(t)']]
}, (lab, st) => {
  const c = st.c, t = st.t, vertical = t === 'up' || t === 'down', sgn = t === 'up' ? 1 : t === 'down' ? -1 : t === 'left' ? -1 : 1;
  const newT = TT.map(v => vertical ? v : v + sgn * c), newS = TS.map(v => vertical ? v + sgn * c : v);
  const op = sgn > 0 ? '+' : '−';
  const name = {up: `s(t) + ${c}`, down: `s(t) − ${c}`, left: `s(t + ${c})`, right: `s(t − ${c})`}[t];
  document.getElementById('shift-table-out').innerHTML = tableHTML(['t', ...TT.map(fmt)], [['s(t)', ...TS.map(fmt)]]) +
    `<p><b>p(t) = ${name}</b>: ${vertical ? `${t === 'up' ? 'add' : 'subtract'} ${c} ${t === 'up' ? 'to' : 'from'} every output` : `${t === 'left' ? 'subtract' : 'add'} ${c} ${t === 'left' ? 'from' : 'to'} every input`} (${vertical ? (t === 'up' ? `up ${c}` : `down ${c}`) : (t === 'left' ? `left ${c}` : `right ${c}`)}).</p>` +
    tableHTML(['t', ...TT.map((v, i) => vertical ? fmt(v) : `${fmt(v)} ${op} ${c} = <b>${fmt(newT[i])}</b>`)], [['p(t)', ...TS.map((v, i) => vertical ? `${fmt(v)} ${op} ${c} = <b>${fmt(newS[i])}</b>` : fmt(v))]]);
  const P = lab.plane({xmin: -12, xmax: 20, ymin: -16, ymax: 22});
  TT.forEach((v, i) => { P.seg(v, TS[i], newT[i], newS[i], {color: 'purple', width: 1.6, arrow: true}); P.point(v, TS[i], {color: 'gray', r: 5}).point(newT[i], newS[i], {color: 'orange', r: 6}); });
  P.render();
  lab.out(vertical ? 'In a vertical shift every point moves straight up or down: the inputs stay, the outputs change.' : 'In a horizontal shift every point moves straight left or right: the outputs stay, the inputs change.');
});

/* ---------- 04 · combined shifts of a cubic ---------- */
const cub = x => (x + 3) * (x + 1) * (x - 1), KEY = [[-3, 0, 'x-int'], [-1, 0, 'x-int'], [1, 0, 'x-int'], [0, -3, 'y-int']];
CA.lab('combined-lab', {
  controls: [
    {type: 'seg', key: 'pre', label: 'Load an example', value: 'ex1', options: [['ex1', 'g(x) = f(x + 2) − 1'], ['ex2', 'h(x) = f(x − 3) + 2'], ['custom', 'my own']]},
    {type: 'range', key: 'h', label: 'h =', min: -4, max: 4, value: -2},
    {type: 'range', key: 'k', label: 'k =', min: -4, max: 4, value: -1}
  ],
  plot: {h: 400}, plotLabel: 'Cubic and its shifted copy', legend: [['gray', 'f(x)', true], ['orange', 'shifted graph']], readouts: [['eq', 'Formula'], ['move', 'Shifts']]
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'custom') { const [h, k] = st.pre === 'ex1' ? [-2, -1] : [3, 2]; st.set('h', h, true); st.set('k', k, true); }
  if (key === 'h' || key === 'k') st.set('pre', 'custom', true);
  const h = st.h, k = st.k, P = lab.plane({xmin: -8, xmax: 8, ymin: -8, ymax: 8});
  P.curve(cub, {color: 'gray', dash: '7 6', width: 2.4}).curve(x => cub(x - h) + k, {color: 'orange', width: 3.4});
  KEY.forEach(([x, y]) => { P.seg(x, y, x + h, y + k, {color: 'purple', width: 1.6, arrow: true}); P.point(x, y, {color: 'gray', r: 4}).point(x + h, y + k, {color: 'orange', r: 6}); });
  P.render();
  lab.read('eq', `y = f(${CA.xMinus(h)})${CA.plusK(k)}`);
  lab.read('move', [h ? `${h > 0 ? 'right' : 'left'} ${Math.abs(h)}` : '', k ? `${k > 0 ? 'up' : 'down'} ${Math.abs(k)}` : ''].filter(Boolean).join(', ') || 'no shift');
  lab.out('Each point (x, y) moves to (x + h, y + k):' + tableHTML(['point of f', 'moves to'], KEY.map(([x, y, n]) => [`${pt(x, y)} · ${n}`, `(${fmt(x)}${CA.plusK(h)}, ${fmt(y)}${CA.plusK(k)}) = <b>${pt(x + h, y + k)}</b>`])));
});

/* ---------- 05 · match the target ---------- */
const POOL = ['sq', 'abs', 'sqrt', 'cube', 'rec', 'cbrt'];
let target = {p: 'sqrt', h: 1, k: 2}, tries = 0;
const lab5 = CA.lab('match-lab', {
  controls: [{type: 'range', key: 'h', label: 'h =', min: -5, max: 5, value: 0}, {type: 'range', key: 'k', label: 'k =', min: -5, max: 5, value: 0}],
  top: '<p><button class="ca-btn ca-btn-outline" id="match-new" type="button"><i class="fa-solid fa-shuffle"></i> New target</button> <span id="match-parent" class="ca-note"></span></p>',
  plot: {h: 380}, plotLabel: 'Target graph and your shifted graph', legend: [['blue', 'target', true], ['orange', 'your graph']], readouts: [['you', 'Your formula']]
}, (lab, st) => {
  const par = PAR[target.p], P = lab.plane(WIN);
  document.getElementById('match-parent').innerHTML = `Toolkit function: <b>${par.label}</b>`;
  if (par.va !== undefined) { P.vline(target.h, {color: 'blue'}); P.hline(target.k, {color: 'blue'}); }
  P.curve(moved(par, target.h, target.k), {color: 'blue', dash: '8 6', width: 3, breaks: brk(par, target.h)});
  P.curve(moved(par, st.h, st.k), {color: 'orange', width: 3.2, breaks: brk(par, st.h)}).render();
  const f = `y = ${par.ex(CA.xMinus(st.h))}${CA.plusK(st.k)}`; lab.read('you', f);
  const dh = target.h - st.h, dk = target.k - st.k;
  if (!dh && !dk) lab.out(`✓ Matched! The target graph is <b>${f}</b>: ${target.h ? `${target.h > 0 ? 'right' : 'left'} ${Math.abs(target.h)}` : 'no horizontal shift'}, ${target.k ? `${target.k > 0 ? 'up' : 'down'} ${Math.abs(target.k)}` : 'no vertical shift'}.`, 'ca-correct');
  else lab.out(`Not yet. Your graph needs to move ${[dh ? `${dh > 0 ? 'right' : 'left'} ${Math.abs(dh)}` : '', dk ? `${dk > 0 ? 'up' : 'down'} ${Math.abs(dk)}` : ''].filter(Boolean).join(' and ')}.`);
});
document.getElementById('match-new').addEventListener('click', () => {
  let n; do { n = {p: POOL[Math.floor(Math.random() * POOL.length)], h: Math.floor(Math.random() * 9) - 4, k: Math.floor(Math.random() * 9) - 4}; } while ((!n.h && !n.k) || (n.p === target.p && n.h === target.h && n.k === target.k));
  target = n; lab5.state.set('h', 0, true); lab5.state.set('k', 0, true); lab5.refresh();
});

CA.guided('35a', [
  {q: 'How is the graph of g(x) = x² − 2 related to the graph of y = x²?', opts: ['Shifted right 2', 'Shifted down 2', 'Shifted left 2'], correct: 1, hint: 'The −2 is outside the function.', why: 'Subtracting 2 from every output moves the graph down 2 units.'},
  {q: 'How is the graph of g(x) = (x + 4)² related to the graph of y = x²?', opts: ['Left 4', 'Right 4', 'Up 4'], correct: 0, hint: 'Where is x + 4 equal to 0?', why: 'x + 4 = x − (−4), so h = −4: the graph moves left 4 units.'},
  {q: 'Describe g(x) = √(x − 3).', opts: ['√x shifted left 3', '√x shifted right 3', '√x shifted down 3'], correct: 1, hint: 'The change is inside the square root.', why: 'x − 3 inside means h = 3: right 3 units. The graph now starts at (3, 0).'},
  {q: 'Describe g(x) = f(x + 2) − 1.', opts: ['Right 2, down 1', 'Left 2, up 1', 'Left 2, down 1'], correct: 2, hint: 'Inside: + means left. Outside: − means down.', why: 'f(x + 2) moves left 2, and − 1 moves down 1.'},
  {q: 'The point (2, 5) is on the graph of f. Which point is on the graph of y = f(x) + 3?', opts: ['(5, 5)', '(2, 8)', '(−1, 5)'], correct: 1, hint: 'A vertical shift changes only the output.', why: 'Add 3 to the output: (2, 5 + 3) = (2, 8).'},
  {q: 'The point (2, 5) is on the graph of f. Which point is on the graph of y = f(x − 4)?', opts: ['(6, 5)', '(−2, 5)', '(2, 1)'], correct: 0, hint: 'f(x − 4) moves the graph right 4.', why: 'Add 4 to the input: (2 + 4, 5) = (6, 5).'},
  {q: 'Which formula shifts y = |x| right 1 unit and up 2 units?', opts: ['|x + 1| + 2', '|x − 1| + 2', '|x − 2| + 1'], correct: 1, hint: 'Right 1 means x − 1 inside.', why: 'Right 1 is |x − 1|; up 2 adds 2 outside: |x − 1| + 2.'},
  {q: 'What is the vertex of y = (x + 3)² − 5?', opts: ['(3, −5)', '(−3, −5)', '(−5, −3)'], correct: 1, hint: 'Move the vertex (0, 0) of y = x².', why: 'Left 3 and down 5 move (0, 0) to (−3, −5).'},
  {q: 'h(m) contains the pair (4, 2). Which pair belongs to g(m) = h(m) − 3?', opts: ['(4, −1)', '(1, 2)', '(4, 5)'], correct: 0, hint: 'Subtract 3 from the output.', why: 'The input 4 stays; the output becomes 2 − 3 = −1.'},
  {q: 'Where is the vertical asymptote of y = 1/(x − 2) + 4?', opts: ['x = 4', 'x = −2', 'x = 2'], correct: 2, hint: 'The asymptote x = 0 of y = 1/x moves with the horizontal shift.', why: 'The graph of 1/x moves right 2 and up 4, so its vertical asymptote x = 0 moves to x = 2 (and y = 0 moves to y = 4).'}
]);
})();
