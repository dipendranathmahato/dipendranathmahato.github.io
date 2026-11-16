/* Section 5.1 · Quadratic Functions — interactive activities */
(() => {
'use strict';
const {fmt, num, Frac, F} = CA, P = CA.poly;
const Q = v => Frac.of(v);
const quad = (a, b, c) => { // exact analysis of ax² + bx + c with integer a, b, c
  const h = F(-b, 2 * a), k = Q(a).mul(h).mul(h).add(Q(b).mul(h)).add(c), D = b * b - 4 * a * c;
  let roots = [], text = 'none (no real zeros)', vals = [];
  if (D === 0) { roots = [h]; vals = [h.v]; text = `x = ${h}`; }
  else if (D > 0) {
    const r = CA.root(D); vals = [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((p, q) => p - q);
    if (r.in === 1) { roots = [F(-b - r.out, 2 * a), F(-b + r.out, 2 * a)].sort((p, q) => p.v - q.v); text = roots.map(x => `x = ${x}`).join(' and '); }
    else {
      let n = -b, s = r.out, d = 2 * a; const g = CA.gcd(CA.gcd(Math.abs(n), s), Math.abs(d)) || 1; n /= g; s /= g; d /= g; if (d < 0) { n = -n; d = -d; }
      const core = `${n ? fmt(n) + ' ' : ''}± ${s === 1 ? '' : s}√${r.in}`;
      text = (d === 1 ? `x = ${core}` : `x = (${core})/${d}`) + ` ≈ ${vals.map(v => num(v, 3)).join(' and ')}`;
    }
  }
  return {h, k, D, roots, vals, text};
};
const pstr = (a, b, c) => P.str([c, b, a]);

/* ---------- 01 · anatomy ---------- */
CA.lab('anatomy-lab', {
  controls: [
    {type: 'seg', key: 'pre', label: 'Load', value: 'a', options: [['a', 'f(x) = −3x² + 6x + 1'], ['b', 'g(x) = x² + 8x − 20'], ['c', 'y = 3x² − 3x + 10'], ['own', 'my own']]},
    {type: 'range', key: 'a', label: 'a =', min: -3, max: 3, value: -3, skip: [0]},
    {type: 'range', key: 'b', label: 'b =', min: -10, max: 10, value: 6},
    {type: 'range', key: 'c', label: 'c =', min: -20, max: 20, value: 1}],
  plot: {h: 400}, plotLabel: 'Parabola with vertex, axis of symmetry, and intercepts',
  readouts: [['open', 'Opens'], ['vertex', 'Vertex (h, k)'], ['axis', 'Axis of symmetry'], ['y', 'y-intercept'], ['x', 'x-intercepts'], ['range', 'Range']], steps: true
}, (lab, st, key) => {
  const PRE = {a: [-3, 6, 1], b: [1, 8, -20], c: [3, -3, 10]};
  if (key === 'pre' && PRE[st.pre]) ['a', 'b', 'c'].forEach((k, i) => st.set(k, PRE[st.pre][i], true)); else if (key && key !== 'pre') st.set('pre', 'own', true);
  const {a, b, c} = st, R = quad(a, b, c), h = R.h.v, k = R.k.v, f = x => a * x * x + b * x + c;
  let w = Math.max(2, Math.sqrt((Math.abs(k - c) + 12) / Math.abs(a))); R.vals.forEach(v => { w = Math.max(w, Math.abs(v - h) + 1); });
  w = Math.max(w, Math.abs(h) + 1);
  const xs = [h - w, h + w], ys = [k, c, 0, f(xs[0]), f(xs[1])], lo = Math.min(...ys), hi = Math.max(...ys), pad = (hi - lo) * 0.08 + 1;
  const Pl = lab.plane({xmin: Math.min(xs[0], -1), xmax: Math.max(xs[1], 1), ymin: lo - pad, ymax: hi + pad});
  Pl.vline(h, {color: 'blue', width: 1.8}).curve(f, {color: 'orange', width: 3.4});
  Pl.point(h, k, {color: 'purple', r: 7, label: `vertex (${R.h}, ${R.k})`}).point(0, c, {color: 'green', r: 6, label: `(0, ${fmt(c)})`});
  R.vals.forEach(v => Pl.point(v, 0, {color: 'red', r: 6}));
  Pl.render();
  lab.read('open', a > 0 ? 'up · vertex is a minimum' : 'down · vertex is a maximum');
  lab.read('vertex', `(${R.h}, ${R.k})`); lab.read('axis', `x = ${R.h}`); lab.read('y', `(0, ${fmt(c)})`);
  lab.read('x', R.text); lab.read('range', a > 0 ? `[${R.k}, ∞)` : `(−∞, ${R.k}]`);
  const par = v => v < 0 ? `(${fmt(v)})` : fmt(v);
  lab.steps([
    ['1 · Read the coefficients', `a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)} → ${a > 0 ? 'a &gt; 0, opens up (minimum)' : 'a &lt; 0, opens down (maximum)'}`],
    ['2 · Axis of symmetry', `h = −b/(2a) = −${par(b)}/(2·${par(a)}) = ${R.h}`],
    ['3 · Vertex height', `k = f(${R.h}) = ${par(a)}(${R.h})² + ${par(b)}(${R.h}) + ${par(c)} = ${R.k}`],
    ['4 · Discriminant', `b² − 4ac = ${par(b)}² − 4(${par(a)})(${par(c)}) = ${fmt(R.D)} → ${R.D > 0 ? 'two x-intercepts' : R.D === 0 ? 'one x-intercept (the vertex)' : 'no x-intercepts'}`],
    ['5 · x-intercepts (quadratic formula)', R.D < 0 ? `x = (−b ± √(${fmt(R.D)}))/(2a) — the square root of a negative number is not real, so there are no x-intercepts.` : R.text],
    ['6 · y-intercept', `f(0) = c = ${fmt(c)} → (0, ${fmt(c)})`]
  ]);
  lab.out(`f(x) = ${pstr(a, b, c)} has ${a > 0 ? 'a minimum' : 'a maximum'} value of <b>${R.k}</b> at x = ${R.h}. Domain: all real numbers.`);
});

/* ---------- 02 · standard form ---------- */
CA.lab('standard-lab', {
  controls: [
    {type: 'seg', key: 'pre', label: 'Load', value: 'p1', options: [['p1', 'f(x) = (x − 2)² + 1'], ['p2', 'g(x) = −(x + 3)² + 4'], ['p3', 'f(x) = −(x + 2)² + 5'], ['own', 'my own']]},
    {type: 'range', key: 'a', label: 'a =', min: -3, max: 3, step: 0.5, value: 1, skip: [0], fmt: v => num(v)},
    {type: 'range', key: 'h', label: 'h =', min: -5, max: 5, value: 2},
    {type: 'range', key: 'k', label: 'k =', min: -6, max: 6, value: 1}],
  plot: {h: 380}, plotLabel: 'Parabola in standard form compared with y = x²', legend: [['gray', 'y = x²', true], ['orange', 'f(x) = a(x − h)² + k']],
  readouts: [['std', 'Standard form'], ['gen', 'General form'], ['vertex', 'Vertex'], ['moves', 'Compared with y = x²']], steps: true
}, (lab, st, key) => {
  const PRE = {p1: [1, 2, 1], p2: [-1, -3, 4], p3: [-1, -2, 5]};
  if (key === 'pre' && PRE[st.pre]) ['a', 'h', 'k'].forEach((q, i) => st.set(q, PRE[st.pre][i], true)); else if (key && key !== 'pre') st.set('pre', 'own', true);
  const {a, h, k} = st, Pl = lab.plane({xmin: -8, xmax: 8, ymin: -8, ymax: 10});
  Pl.curve(x => x * x, {color: 'gray', dash: '7 6', width: 2.2}).curve(x => a * (x - h) ** 2 + k, {color: 'orange', width: 3.4});
  Pl.point(0, 0, {color: 'gray', r: 4}).seg(0, 0, h, k, {color: 'purple', width: 1.8, arrow: true}).point(h, k, {color: 'purple', r: 7, label: `(${fmt(h)}, ${fmt(k)})`}).render();
  const A = num(a) === '1' ? '' : num(a) === '−1' ? '−' : num(a), b = -2 * a * h, c = a * h * h + k;
  lab.read('std', `f(x) = ${A}(${CA.xMinus(h)})²${CA.plusK(k)}`); lab.read('gen', `f(x) = ${P.str([c, b, a])}`); lab.read('vertex', `(${fmt(h)}, ${fmt(k)}) · ${a > 0 ? 'minimum' : 'maximum'} value ${fmt(k)}`);
  const moves = [];
  if (a < 0) moves.push('reflect over the x-axis'); if (Math.abs(a) !== 1) moves.push(`vertical ${Math.abs(a) > 1 ? 'stretch' : 'compression'} by ${num(Math.abs(a))}`);
  if (h) moves.push(`${h > 0 ? 'right' : 'left'} ${Math.abs(h)}`); if (k) moves.push(`${k > 0 ? 'up' : 'down'} ${Math.abs(k)}`);
  lab.read('moves', moves.join(', ') || 'no change');
  lab.steps([['1 · Expand the square', `(${CA.xMinus(h)})² = ${P.str([h * h, -2 * h, 1])}`],
    ['2 · Multiply by a', `${num(a)}(${P.str([h * h, -2 * h, 1])}) = ${P.str([a * h * h, -2 * a * h, a])}`],
    ['3 · Add k', `f(x) = ${P.str([c, b, a])}`],
    ['4 · Check with h = −b/(2a)', `−(${num(b)})/(2·${num(a)}) = ${num(-b / (2 * a))} = h ✓`]]);
  lab.out(`Range: ${a > 0 ? `[${fmt(k)}, ∞)` : `(−∞, ${fmt(k)}]`}. The vertex (0, 0) of y = x² moved to (${fmt(h)}, ${fmt(k)}).`);
});

/* ---------- 03 · how many x-intercepts ---------- */
CA.choice('intercept-choice', {q: 'Before you explore: how many x-intercepts can a parabola have?', options: ['Exactly 2', '0, 1, or 2', 'Any number'], correct: 1,
  why: 'A parabola can miss the x-axis (0), touch it at the vertex (1), or cross it twice (2). It always has exactly one y-intercept.'});
CA.lab('count-lab', {
  controls: [{type: 'range', key: 'c', label: 'f(x) = x² − 4x + c, with c =', min: -2, max: 8, step: 0.5, value: 6, fmt: v => num(v)}],
  plot: {h: 440}, plotLabel: 'Parabola moving up and down', readouts: [['d', 'Discriminant b² − 4ac'], ['n', 'Number of x-intercepts'], ['x', 'x-intercepts']]
}, (lab, st) => {
  const c = st.c, D = 16 - 4 * c, f = x => x * x - 4 * x + c, Pl = lab.plane({xmin: -2, xmax: 6, ymin: -7, ymax: 9});
  Pl.curve(f, {color: 'orange', width: 3.4}).point(2, c - 4, {color: 'purple', r: 6, label: `vertex (2, ${num(c - 4)})`});
  const xs = D > 0 ? [2 - Math.sqrt(D) / 2, 2 + Math.sqrt(D) / 2] : D === 0 ? [2] : [];
  xs.forEach(x => Pl.point(x, 0, {color: 'red', r: 7})); Pl.render();
  lab.read('d', `(−4)² − 4(1)(${num(c)}) = ${num(D)}`); lab.read('n', D > 0 ? '2 (D &gt; 0)' : D === 0 ? '1 (D = 0)' : '0 (D &lt; 0)'); lab.read('x', xs.length ? xs.map(x => num(x, 3)).join(', ') : 'none');
  lab.out(D > 0 ? 'The vertex is below the x-axis and the parabola opens up, so it crosses the axis twice.' : D === 0 ? 'The vertex sits exactly on the x-axis: one x-intercept, and it is the vertex.' : 'The vertex is above the x-axis and the parabola opens up, so it never reaches the axis.');
});

/* ---------- 04 · graph detective ---------- */
let puzzle = {a: -1, h: 3, k: 4};
const newPuzzle = () => { let p; do { p = {a: Math.random() < 0.5 ? 1 : -1, h: Math.floor(Math.random() * 9) - 4, k: Math.floor(Math.random() * 11) - 5}; } while (Math.abs(p.a * p.h * p.h + p.k) > 12 || (p.h === puzzle.h && p.k === puzzle.k)); puzzle = p; };
const det = CA.lab('detective-lab', {
  top: '<div class="ca-answer-row"><label>Vertex x (h)<input id="det-h" inputmode="decimal"></label><label>Vertex y (k)<input id="det-k" inputmode="decimal"></label><label>Axis: x =<input id="det-ax" inputmode="decimal"></label><label>y-intercept (0, ?)<input id="det-y" inputmode="decimal"></label><label>Opens<select id="det-open"><option value="">choose</option><option value="up">up</option><option value="down">down</option></select></label></div><p><button class="ca-btn" id="det-check" type="button">Check</button> <button class="ca-btn ca-btn-outline" id="det-new" type="button"><i class="fa-solid fa-shuffle"></i> New parabola</button></p>',
  plot: {h: 440}, plotLabel: 'Mystery parabola to read'
}, lab => {
  const {a, h, k} = puzzle, f = x => a * (x - h) ** 2 + k, Pl = lab.plane({xmin: -8, xmax: 8, ymin: -14, ymax: 14, xstep: 1, ystep: 2});
  Pl.curve(f, {color: 'orange', width: 3.4}).render();
  lab.out('Read the graph, fill in the boxes, and press <b>Check</b>.');
});
document.getElementById('det-check').addEventListener('click', () => {
  const {a, h, k} = puzzle, ins = ['det-h', 'det-k', 'det-ax', 'det-y'].map(id => document.getElementById(id));
  const ok = CA.checkInputs(ins, [h, k, h, a * h * h + k]), op = document.getElementById('det-open'), okOpen = op.value === (a > 0 ? 'up' : 'down');
  op.classList.toggle('right', okOpen); op.classList.toggle('wrong', !okOpen);
  const all = ok.every(Boolean) && okOpen;
  det.out(all ? `✓ All correct: f(x) = ${a < 0 ? '−' : ''}(${CA.xMinus(h)})²${CA.plusK(k)}, vertex (${fmt(h)}, ${fmt(k)}), axis x = ${fmt(h)}, y-intercept (0, ${fmt(a * h * h + k)}), opens ${a > 0 ? 'up' : 'down'}, range ${a > 0 ? `[${fmt(k)}, ∞)` : `(−∞, ${fmt(k)}]`}.`
    : `${ok.filter(Boolean).length + (okOpen ? 1 : 0)} of 5 correct. Hints: the vertex is the turning point; the axis passes through it; the y-intercept is where the graph crosses x = 0.`, all ? 'ca-correct' : 'ca-incorrect');
});
document.getElementById('det-new').addEventListener('click', () => { newPuzzle(); ['det-h', 'det-k', 'det-ax', 'det-y'].forEach(id => { const e = document.getElementById(id); e.value = ''; e.className = ''; }); document.getElementById('det-open').value = ''; det.refresh(); });

/* ---------- 05 · ball in the air ---------- */
const hb = t => -16 * t * t + 64 * t + 3, land = (64 + Math.sqrt(64 * 64 + 4 * 16 * 3)) / 32;
CA.lab('ball-lab', {
  controls: [{type: 'range', key: 't', label: 'Time t (seconds) =', min: 0, max: 4.05, step: 0.05, value: 1, fmt: v => num(v)}],
  plot: {h: 340, xname: 't', yname: 'h'}, plotLabel: 'Height of the ball over time', readouts: [['h', 'Height now'], ['max', 'Maximum height'], ['land', 'Hits the ground']], steps: true
}, (lab, st) => {
  const t = st.t, Pl = lab.plane({xmin: -0.2, xmax: 4.4, ymin: -5, ymax: 75, xname: 't', yname: 'h'});
  Pl.curve(hb, {color: 'gray', width: 2, dash: '6 6', from: 0, to: land}).curve(hb, {color: 'orange', width: 3.4, from: 0, to: t});
  Pl.point(2, 67, {color: 'purple', r: 5, label: 'max (2, 67)'}).point(t, hb(t), {color: 'orange', r: 9}).render();
  lab.read('h', `h(${num(t)}) = ${num(hb(t), 1)} ft`); lab.read('max', '67 ft at t = 2 s'); lab.read('land', `t ≈ ${num(land, 2)} s`);
  lab.steps([['1 · a = −16 &lt; 0, so the vertex is a maximum', 'h(t) = −16t² + 64t + 3'], ['2 · Time of the maximum', 't = −b/(2a) = −64/(2·(−16)) = 2 seconds'], ['3 · Maximum height', 'h(2) = −16(4) + 64(2) + 3 = −64 + 128 + 3 = 67 feet'], ['4 · Landing time: solve h(t) = 0', `t = (−64 − √(64² − 4(−16)(3)))/(2(−16)) ≈ ${num(land, 3)} s (the other root is negative)`]]);
  lab.out(t < 2 ? 'The ball is still rising: the height increases until t = 2.' : t > 2 ? 'The ball is falling: the height decreases after t = 2.' : 'This is the top of the flight: the vertex.');
});

CA.guided('51', [
  {q: 'What is the vertex of f(x) = (x − 3)² + 2?', opts: ['(−3, 2)', '(3, 2)', '(2, 3)'], correct: 1, hint: 'Standard form a(x − h)² + k has vertex (h, k).', why: 'h = 3 and k = 2, so the vertex is (3, 2).'},
  {q: 'Does f(x) = −2x² + 5x + 1 open up or down?', opts: ['Up', 'Down'], correct: 1, hint: 'Look at the sign of a.', why: 'a = −2 &lt; 0, so the parabola opens down and has a maximum.'},
  {q: 'What is the axis of symmetry of f(x) = x² − 6x + 1?', opts: ['x = 6', 'x = 3', 'x = −3'], correct: 1, hint: 'x = −b/(2a).', why: 'x = −(−6)/(2·1) = 3.'},
  {q: 'Find the vertex of f(x) = x² + 4x − 1.', opts: ['(−2, −5)', '(2, 11)', '(−4, −1)'], correct: 0, hint: 'h = −4/2, then k = f(h).', why: 'h = −2 and k = 4 − 8 − 1 = −5.'},
  {q: 'What is the range of f(x) = −(x + 1)² + 4?', opts: ['[4, ∞)', '(−∞, 4]', '(−∞, ∞)'], correct: 1, hint: 'Opens down with maximum value k.', why: 'a = −1 &lt; 0 and k = 4, so the range is (−∞, 4].'},
  {q: 'What is the y-intercept of f(x) = 2x² − 3x + 7?', opts: ['(7, 0)', '(0, 7)', '(0, −3)'], correct: 1, hint: 'Evaluate f(0).', why: 'f(0) = 7, so the y-intercept is (0, 7).'},
  {q: 'How many x-intercepts does f(x) = x² + 2x + 5 have?', opts: ['0', '1', '2'], correct: 0, hint: 'Compute b² − 4ac.', why: 'b² − 4ac = 4 − 20 = −16 &lt; 0, so there are no x-intercepts.'},
  {q: 'Find the x-intercepts of f(x) = x² − 9.', opts: ['x = 9 only', 'x = −3 and x = 3', 'x = 0 and x = 9'], correct: 1, hint: 'Solve x² − 9 = 0.', why: 'x² = 9 gives x = ±3.'},
  {q: 'Write f(x) = x² − 6x + 5 in standard form.', opts: ['(x − 3)² − 4', '(x + 3)² − 4', '(x − 6)² + 5'], correct: 0, hint: 'h = 3; then compute k = f(3).', why: 'h = 3 and k = 9 − 18 + 5 = −4, so f(x) = (x − 3)² − 4.'},
  {q: 'What is the maximum value of f(x) = −x² + 4x?', opts: ['2', '4', '0'], correct: 1, hint: 'Find the vertex height.', why: 'h = −4/(−2) = 2 and f(2) = −4 + 8 = 4.'}
]);
})();
