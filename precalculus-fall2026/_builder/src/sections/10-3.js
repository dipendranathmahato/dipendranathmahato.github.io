/* Section 10.3 · The Parabola — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Frac} = CA;
const $ = id => document.getElementById(id);
const neg = f => f.neg(), ptS = p => `(${p[0]}, ${p[1]})`;
/* coefficient in front of a variable: 1 → '', −1 → '−', 8 → '8', 4/3 → '(4/3)', −4/3 → '−(4/3)' */
const cf = f => f.d === 1 ? (f.n === 1 ? '' : f.n === -1 ? '−' : f.toString()) : (f.n < 0 ? '−' : '') + `(${Math.abs(f.n)}/${f.d})`;
const cfH = f => f.d === 1 ? (f.n === 1 ? '' : f.n === -1 ? '−' : f.toString()) : (f.n < 0 ? '−' : '') + CA.over(Math.abs(f.n), f.d);
/* features of x² = 4py (vertical) or y² = 4px */
const par = (vertical, p) => {
  const two = p.mul(2), four = p.mul(4);
  return {vertical, p, four, F: vertical ? [new Frac(0, 1), p] : [p, new Frac(0, 1)], dir: `${vertical ? 'y' : 'x'} = ${neg(p)}`, LR: vertical ? `(±${two.n < 0 ? two.neg() : two}, ${p})` : `(${p}, ±${two.n < 0 ? two.neg() : two})`,
    eq: vertical ? `x² = ${cf(four)}y` : `y² = ${cf(four)}x`, eqH: vertical ? `x² = ${cfH(four)}y` : `y² = ${cfH(four)}x`, opens: vertical ? (p.v > 0 ? 'upward' : 'downward') : (p.v > 0 ? 'to the right' : 'to the left')};
};
const drawP = (P, Q, {labels = true} = {}) => {
  const p = Q.p.v, v = Q.vertical, o = P.o;
  v ? P.hline(-p, {color: 'green', width: 2.2, dash: '7 5'}) : P.vline(-p, {color: 'green', width: 2.2, dash: '7 5'});
  CA.drawParabola(P, p, v);
  const e1 = v ? [2 * p, p] : [p, 2 * p], e2 = v ? [-2 * p, p] : [p, -2 * p];
  P.seg(...e1, ...e2, {color: 'purple', width: 2.4});
  P.point(...e1, {color: 'purple', r: 5.5, label: labels ? `(${v ? Q.p.mul(2) : Q.p}, ${v ? Q.p : Q.p.mul(2)})` : ''}).point(...e2, {color: 'purple', r: 5.5});
  P.point(Q.F[0].v, Q.F[1].v, {color: 'blue', r: 7, label: labels ? `F${ptS(Q.F)}` : '', labelOpt: v ? {dx: 10, dy: p > 0 ? 18 : -10} : {dy: -12}});
  if (labels) P.label(v ? o.xmin + 0.3 : -p, v ? -p : o.ymax - 0.3, Q.dir, {color: 'green', size: 12.5, anchor: 'start', dx: v ? 4 : 6, dy: v ? (p > 0 ? 16 : -8) : 12});
  return P.point(0, 0, {color: 'orange', r: 6});
};
const winP = Q => { const p = Math.abs(Q.p.v), L = Math.max(4, 2 * p + 2.2), M = Math.max(4, p + 2.5); return Q.vertical ? (Q.p.v > 0 ? {xmin: -L, xmax: L, ymin: -M, ymax: Math.max(M, L * 0.9)} : {xmin: -L, xmax: L, ymin: -Math.max(M, L * 0.9), ymax: M}) : (Q.p.v > 0 ? {xmin: -M, xmax: Math.max(M, L * 0.9), ymin: -L, ymax: L} : {xmin: -Math.max(M, L * 0.9), xmax: M, ymin: -L, ymax: L}); };
const LEG = [['orange', 'vertex'], ['blue', 'focus'], ['green', 'directrix', true], ['purple', 'latus rectum']];

/* ---------- 01 · definition ---------- */
const def = CA.lab('def-lab', {
  controls: [{type: 'seg', key: 'or', label: 'Axis of symmetry', value: 'v', options: [['v', 'y-axis (x² = 4py)'], ['h', 'x-axis (y² = 4px)']]}, {type: 'range', key: 'p', label: 'p =', min: -3, max: 3, step: 0.25, value: 1.5, skip: [0]}, {type: 'range', key: 't', label: 'Move P', min: -100, max: 100, step: 1, value: 60}, {type: 'check', key: 'lr', label: 'Show the latus rectum', value: true}],
  top: '<div class="ca-equation" id="def-eq"></div>', plot: {xmin: -7, xmax: 7, ymin: -7, ymax: 7, w: 520, h: 480}, plotLabel: 'Parabola with focus, directrix, and a moving point P',
  legend: [['blue', 'distance to the focus'], ['green', 'distance to the directrix'], ['purple', 'latus rectum']], readouts: [['pf', 'PF'], ['pd', 'distance to directrix'], ['f', 'Focus · directrix']], steps: true,
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag P along the parabola.</p>'
}, (lab, st) => {
  const p = st.p, v = st.or === 'v', t = st.t / 16, X = v ? t : t * t / (4 * p), Y = v ? t * t / (4 * p) : t, P = lab.plane();
  const Fp = v ? [0, p] : [p, 0], D = v ? [X, -p] : [-p, Y], pf = Math.hypot(X - Fp[0], Y - Fp[1]), pd = v ? Math.abs(Y + p) : Math.abs(X + p);
  v ? P.hline(-p, {color: 'green', width: 2.2, dash: '7 5'}) : P.vline(-p, {color: 'green', width: 2.2, dash: '7 5'});
  CA.drawParabola(P, p, v);
  if (st.lr) { const e1 = v ? [2 * p, p] : [p, 2 * p], e2 = v ? [-2 * p, p] : [p, -2 * p]; P.seg(...e1, ...e2, {color: 'purple', width: 2.6}).point(...e1, {color: 'purple', r: 5}).point(...e2, {color: 'purple', r: 5}); }
  P.seg(X, Y, ...Fp, {color: 'blue', width: 3}).seg(X, Y, ...D, {color: 'green', width: 3}).point(...D, {color: 'green', r: 5, label: 'D'});
  P.point(0, 0, {color: 'orange', r: 5.5}).point(...Fp, {color: 'blue', r: 7, label: 'F'}).point(X, Y, {color: 'blue', r: 8, label: 'P'}).render();
  const pq = Frac.of(p), Q = par(v, pq);
  $('def-eq').innerHTML = Q.eqH;
  lab.read('pf', num(pf, 2)); lab.read('pd', num(pd, 2)); lab.read('f', `${ptS(Q.F)} · ${Q.dir}`);
  lab.steps([['Focus', `p = ${pq}, so the focus is ${ptS(Q.F)}`], ['Directrix', `the same distance on the other side of the vertex: ${Q.dir}`], ['Latus rectum', `endpoints ${Q.LR}, length |4p| = ${Q.four.n < 0 ? Q.four.neg() : Q.four}`]]);
  lab.out(`PF = ${num(pf, 2)} and PD = ${num(pd, 2)}: <b>equal</b>, wherever P is. The parabola opens ${Q.opens} because p ${p > 0 ? '&gt;' : '&lt;'} 0.`);
});
let onP = false;
CA.drag(def.svg, (x, y, ph) => {
  const s = def.state, v = s.or === 'v', p = s.p, t = s.t / 16, X = v ? t : t * t / (4 * p), Y = v ? t * t / (4 * p) : t;
  if (ph === 'start') { onP = Math.hypot(x - X, y - Y) < 1.3; if (!onP) return false; }
  if (onP) s.set('t', Math.max(-100, Math.min(100, Math.round((v ? x : y) * 16))));
});

/* ---------- 02 · equation → features ---------- */
const RPRE = [['x', '1', '7', 'Example 2 (i) · x² = 7y'], ['x', '2', '-1', 'Example 2 (ii) · 2x² = −y'], ['y', '1', '1', 'Example 2 (iii) · y² = x'], ['y', '-1/2', '9', 'Example 2 (iv) · −(1/2)y² = 9x'],
  ['x', '-2', '5', 'Checkpoint 2 (i) · −2x² = 5y'], ['x', '1', '6', 'Checkpoint 2 (ii) · x² = 6y'], ['y', '4', '10', 'Checkpoint 2 (iii) · 4y² = 10x'], ['y', '-1', '5', 'Checkpoint 2 (iv) · −y² = 5x']];
CA.lab('read-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Equation', value: '0', options: RPRE.map((p, i) => [String(i), p[3]]).concat([['own', 'Set your own']])}, {type: 'seg', key: 'sq', label: 'Squared variable', value: 'x', options: [['x', 'x² = …y'], ['y', 'y² = …x']]}, {type: 'text', key: 'k', label: 'Coefficient of the square', value: '1'}, {type: 'text', key: 'm', label: 'Coefficient on the other side', value: '7'}],
  top: '<div class="ca-equation" id="read-eq"></div>', plot: {w: 560, h: 440}, plotLabel: 'Graph of the parabola with its focus, directrix, and latus rectum', legend: LEG,
  readouts: [['p', 'p'], ['f', 'Focus'], ['d', 'Directrix'], ['lr', 'Latus rectum endpoints']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = RPRE[+st.pre]; st.set('sq', p[0], true); st.set('k', p[1], true); st.set('m', p[2], true); } else if (key && key !== 'pre') st.set('pre', 'own', true);
  const k = CA.parseFrac(st.k), m = CA.parseFrac(st.m), v = st.sq === 'x', s = v ? 'x' : 'y', l = v ? 'y' : 'x';
  if (!k || !m || k.n === 0 || m.n === 0) { lab.plane({xmin: -5, xmax: 5, ymin: -4, ymax: 4}).render(); $('read-eq').innerHTML = '—'; ['p', 'f', 'd', 'lr'].forEach(q => lab.read(q, '—')); lab.steps([]); lab.out('Both coefficients must be nonzero numbers, such as 2, −1, or −1/2.', 'ca-incorrect'); return; }
  const four = m.div(k), p = four.div(4), Q = par(v, p);
  drawP(lab.plane(winP(Q)), Q).render();
  $('read-eq').innerHTML = `${cfH(k)}${s}² = ${cfH(m)}${l}${k.n === 1 && k.d === 1 ? '' : ` &nbsp;⟶&nbsp; ${Q.eqH}`}`;
  lab.read('p', p.html()); lab.read('f', ptS(Q.F)); lab.read('d', Q.dir); lab.read('lr', Q.LR);
  const steps = [];
  if (!(k.n === 1 && k.d === 1)) steps.push([`Divide both sides by ${k}`, `${s}² = ${cf(four)}${l}`]);
  steps.push(['Match the form', `${s}² = 4p${l}, so 4p = ${four} and p = ${four} ÷ 4 = ${p}`], ['Focus', `${v ? '(0, p)' : '(p, 0)'} = ${ptS(Q.F)}`], ['Directrix', `${v ? 'y' : 'x'} = −p: ${Q.dir}`], ['Latus rectum', `${v ? '(±2p, p)' : '(p, ±2p)'} = ${Q.LR}`]);
  lab.steps(steps);
  lab.out(`p = ${p} is ${p.v > 0 ? 'positive' : 'negative'}, so the parabola opens <b>${Q.opens}</b>: focus ${ptS(Q.F)}, directrix ${Q.dir}.`, 'ca-correct');
});
CA.cards('open-cards', [
  {expr: 'x² = −6y', correct: 1, why: 'x² = 4py with 4p = −6 &lt; 0: opens downward.'},
  {expr: 'y² = 10x', correct: 3, why: 'y² = 4px with p &gt; 0: opens to the right.'},
  {expr: '−y² = 5x', correct: 2, why: 'y² = −5x, so p &lt; 0: opens to the left.'},
  {expr: '2x² = y', correct: 0, why: 'x² = (1/2)y, so p &gt; 0: opens upward.'},
  {expr: '−(1/2)y² = 9x', correct: 2, why: 'y² = −18x: opens to the left.'},
  {expr: '−2x² = −3y', correct: 0, why: 'x² = (3/2)y: opens upward.'}
], {options: ['up', 'down', 'left', 'right']});

/* ---------- 03 · features → equation ---------- */
const MODES = {f: ['the focus', 'Focus'], d: ['the directrix', 'Directrix'], lr: ['an endpoint of the latus rectum', 'Endpoint'], fd: ['the focus and the directrix', 'Focus']};
const PRE = [['f', '(0, 2)', '', 'Example 1 (i) · vertex (0, 0), focus (0, 2)'], ['d', 'y = 1/3', '', 'Example 1 (ii) · vertex (0, 0), directrix y = 1/3'], ['fd', '(5/2, 0)', 'x = -5/2', 'Example 1 (iii) · focus (5/2, 0), directrix x = −5/2'], ['lr', '(-1, 2)', '', 'Example 1 (iv) · latus rectum endpoints (−1, ±2)'],
  ['d', 'x = -7/3', '', 'Checkpoint 1 (i) · vertex (0, 0), directrix x = −7/3'], ['f', '(0, -2/5)', '', 'Checkpoint 1 (ii) · vertex (0, 0), focus (0, −2/5)'], ['lr', '(3, 3/2)', '', 'Checkpoint 1 (iii) · latus rectum endpoints (±3, 3/2)'], ['f', '(-6/5, 0)', '', 'Checkpoint 1 (iv) · focus (−6/5, 0), axis along the x-axis']];
const parseLine = txt => { const m = String(txt).trim().replace(/−/g, '-').replace(/\s/g, '').match(/^([xy])=(.+)$/i); if (!m) return null; const c = CA.parseFrac(m[2]); return c ? [m[1].toLowerCase(), c] : null; };
function solve(mode, g1, g2) {
  const fail = m => ({err: m}), steps = [];
  let vertical, p;
  if (mode === 'f' || mode === 'fd') {
    const Fp = CA.parsePt(g1); if (!Fp) return fail('Type the focus like (0, 2) or (−6/5, 0).');
    if ((Fp[0].n === 0) === (Fp[1].n === 0)) return fail(`With the vertex at the origin, the focus ${ptS(Fp)} must be on an axis and not at the origin.`);
    vertical = Fp[0].n === 0; p = vertical ? Fp[1] : Fp[0];
    steps.push(['Axis of symmetry', `the focus ${ptS(Fp)} is on the ${vertical ? 'y' : 'x'}-axis, so use ${vertical ? 'x² = 4py' : 'y² = 4px'}`], ['p', `the focus is ${vertical ? '(0, p)' : '(p, 0)'}, so p = ${p}`]);
    if (mode === 'fd') { const L = parseLine(g2); if (!L) return fail('Type the directrix like x = −5/2 or y = 1/3.'); const ok = L[0] === (vertical ? 'y' : 'x') && L[1].eq(p.neg()); if (!ok) return fail(`For a vertex at the origin the directrix must be ${vertical ? 'y' : 'x'} = ${p.neg()}, the same distance on the other side; ${g2} does not match, so the vertex is not at the origin.`); steps.push(['Check the directrix', `${L[0]} = ${L[1]} is ${vertical ? 'y' : 'x'} = −p, so the vertex is midway at the origin`]); }
  } else if (mode === 'd') {
    const L = parseLine(g1); if (!L) return fail('Type the directrix like y = 1/3 or x = −7/3.'); if (L[1].n === 0) return fail('The directrix cannot pass through the vertex.');
    vertical = L[0] === 'y'; p = L[1].neg();
    steps.push(['Axis of symmetry', `the directrix ${L[0]} = ${L[1]} is ${vertical ? 'horizontal' : 'vertical'}, so the axis is the ${vertical ? 'y' : 'x'}-axis: ${vertical ? 'x² = 4py' : 'y² = 4px'}`], ['p', `${L[0]} = −p = ${L[1]}, so p = ${p}`]);
  } else {
    const E = CA.parsePt(g1); if (!E) return fail('Type one endpoint like (−1, 2) or (3, 3/2).');
    const ax = E[0].n < 0 ? E[0].neg() : E[0], ay = E[1].n < 0 ? E[1].neg() : E[1];
    if (ay.eq(E[0].mul(2).n < 0 ? E[0].mul(-2) : E[0].mul(2)) && E[0].n !== 0) { vertical = false; p = E[0]; steps.push(['Match the endpoints', `(p, ±2p): the first coordinate is p = ${p}, and |±2p| = ${ay} checks`]); }
    else if (ax.eq(E[1].mul(2).n < 0 ? E[1].mul(-2) : E[1].mul(2)) && E[1].n !== 0) { vertical = true; p = E[1]; steps.push(['Match the endpoints', `(±2p, p): the second coordinate is p = ${p}, and |±2p| = ${ax} checks`]); }
    else return fail(`An endpoint of the latus rectum has one coordinate equal to p and the other equal to ±2p. ${ptS(E)} does not fit that pattern.`);
    steps.unshift(['Axis of symmetry', `the endpoints are ${vertical ? '(±2p, p), on a horizontal segment, so the axis is the y-axis' : '(p, ±2p), on a vertical segment, so the axis is the x-axis'}`]);
  }
  const Q = par(vertical, p);
  steps.push(['Substitute', `4p = 4(${p}) = ${Q.four}: ${Q.eq}`]);
  return Object.assign(Q, {steps});
}
CA.lab('build-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: '0', options: PRE.map((p, i) => [String(i), p[3]]).concat([['own', 'Set your own']])}, {type: 'select', key: 'mode', label: 'Given', value: 'f', options: Object.entries(MODES).map(([k, m]) => [k, m[0]])}, {type: 'text', key: 'g1', label: 'Given', value: '(0, 2)'}, {type: 'text', key: 'g2', label: 'Directrix (only for focus and directrix)', value: ''}],
  top: '<div class="ca-equation" id="build-eq"></div>', plot: {w: 560, h: 440}, plotLabel: 'The parabola described by the given features', legend: LEG,
  readouts: [['f', 'Focus'], ['d', 'Directrix'], ['lr', 'Latus rectum endpoints'], ['o', 'Opens']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = PRE[+st.pre]; st.set('mode', p[0], true); st.set('g1', p[1], true); st.set('g2', p[2], true); } else if (key && key !== 'pre') st.set('pre', 'own', true);
  const S = solve(st.mode, st.g1, st.g2);
  if (S.err) { lab.plane({xmin: -5, xmax: 5, ymin: -4, ymax: 4}).render(); $('build-eq').innerHTML = '—'; ['f', 'd', 'lr', 'o'].forEach(q => lab.read(q, '—')); lab.steps(S.steps || []); lab.out(S.err, 'ca-incorrect'); return; }
  drawP(lab.plane(winP(S)), S).render();
  $('build-eq').innerHTML = S.eqH;
  lab.read('f', ptS(S.F)); lab.read('d', S.dir); lab.read('lr', S.LR); lab.read('o', S.opens);
  lab.steps(S.steps);
  lab.out(`The equation is <b>${S.eq}</b>; the parabola opens ${S.opens}.`, 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('103', [
  {q: 'The focus of x² = 12y is:', opts: ['(0, 3)', '(0, 12)', '(3, 0)', '(0, −3)'], correct: 0, hint: '4p = 12.', why: 'p = 3 and the axis is the y-axis.'},
  {q: 'The directrix of y² = −8x is:', opts: ['x = 2', 'x = −2', 'y = 2', 'x = 8'], correct: 0, hint: '4p = −8, and the directrix is x = −p.', why: 'p = −2, so the directrix is x = 2.'},
  {q: 'Which way does x² = −6y open?', keep: true, opts: ['up', 'down', 'left', 'right'], correct: 1, hint: 'x² = 4py with 4p = −6.', why: 'p &lt; 0 with x² = 4py: downward.', ref: {panel: 'read', what: 'the two standard forms', body: '<p>x² = 4py opens up if p &gt; 0 and down if p &lt; 0; y² = 4px opens right or left.</p>'}},
  {q: 'Vertex (0, 0), focus (0, 2). The equation is:', opts: ['x² = 8y', 'x² = 2y', 'y² = 8x', 'x² = −8y'], correct: 0, hint: 'p = 2 in x² = 4py.', why: '4p = 8.', ref: {panel: 'build', what: 'Example 1 (i)', body: '<p>Vertex at <b>(0, 0)</b>, focus at <b>(0, 2)</b>.</p>'}},
  {q: 'Vertex (0, 0), directrix y = 1/3. The equation is:', opts: ['x² = −(4/3)y', 'x² = (4/3)y', 'y² = −(4/3)x', 'x² = −(1/3)y'], correct: 0, hint: 'The directrix y = −p gives p = −1/3.', why: '4p = −4/3, and the directrix is horizontal, so x² = 4py.', ref: {panel: 'build', what: 'Example 1 (ii)', body: '<p>Vertex <b>(0, 0)</b>, directrix <b>y = 1/3</b>.</p>'}},
  {q: 'The focus of 2x² = −y is:', opts: ['(0, −1/8)', '(0, −1/2)', '(0, −2)', '(−1/8, 0)'], correct: 0, hint: 'Divide by 2: x² = −(1/2)y, so 4p = −1/2.', why: 'p = −1/8.', ref: {panel: 'read', what: 'Example 2 (ii)', body: '<p>Find the focus, directrix, and latus rectum of <b>2x² = −y</b>.</p>'}},
  {q: 'The latus rectum endpoints of −(1/2)y² = 9x are:', opts: ['(−9/2, ±9)', '(9/2, ±9)', '(±9, −9/2)', '(−18, ±36)'], correct: 0, hint: 'y² = −18x, so p = −9/2.', why: '(p, ±2p) = (−9/2, ±9).', ref: {panel: 'read', what: 'Example 2 (iv)', body: '<p>Find the features of <b>−(1/2)y² = 9x</b>.</p>'}},
  {q: 'Vertex (0, 0) and latus rectum endpoints (−1, ±2). The equation is:', opts: ['y² = −4x', 'x² = −4y', 'y² = 4x', 'y² = −x'], correct: 0, hint: '(p, ±2p) with p = −1.', why: '4p = −4 and the axis is the x-axis.', ref: {panel: 'build', what: 'Example 1 (iv)', body: '<p>Vertex at <b>(0, 0)</b>, endpoints of latus rectum <b>(−1, ±2)</b>.</p>'}},
  {q: 'Every point P on a parabola is the same distance from the focus as from:', opts: ['the directrix', 'the vertex', 'the latus rectum', 'the axis of symmetry'], correct: 0, hint: 'Recall the definition.', why: 'A parabola is the set of points equidistant from the focus and the directrix.'},
  {q: 'The length of the latus rectum of y² = 10x is:', opts: ['10', '5/2', '5', '20'], correct: 0, hint: 'The length is |4p|.', why: '4p = 10, so the latus rectum has length 10 (from (5/2, −5) to (5/2, 5)).'}
]);
})();
