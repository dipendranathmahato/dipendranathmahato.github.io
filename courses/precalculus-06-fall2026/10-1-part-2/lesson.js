/* Section 10.1 Part II · The Ellipse: From Equation to Graph — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Frac} = CA;
const $ = id => document.getElementById(id);
const R = q => CA.sqrtF(q).str(), dn = f => f.d === 1 ? f.toString() : '(' + f.toString() + ')';
/* features of x²/X2 + y²/Y2 = 1 (Frac denominators) */
const feat = (X2, Y2) => {
  const vertical = Y2.v > X2.v, A2 = vertical ? Y2 : X2, B2 = vertical ? X2 : Y2, C2 = A2.sub(B2);
  return {vertical, A2, B2, C2, circle: C2.n === 0, a: A2.v ** 0.5, b: B2.v ** 0.5, c: C2.v ** 0.5, ra: R(A2), rb: R(B2), rc: R(C2)};
};
const eqTxt = (X2, Y2, html = true) => html ? `${CA.over('x²', X2)} + ${CA.over('y²', Y2)} = 1` : `x²/${dn(X2)} + y²/${dn(Y2)} = 1`;
const lists = E => E.vertical ? {v: `(0, ±${E.ra})`, cv: `(±${E.rb}, 0)`, f: `(0, ±${E.rc})`} : {v: `(±${E.ra}, 0)`, cv: `(0, ±${E.rb})`, f: `(±${E.rc}, 0)`};
const pts = E => E.vertical ? {V: [[0, E.a], [0, -E.a]], CV: [[E.b, 0], [-E.b, 0]], Fo: [[0, E.c], [0, -E.c]]} : {V: [[E.a, 0], [-E.a, 0]], CV: [[0, E.b], [0, -E.b]], Fo: [[E.c, 0], [-E.c, 0]]};
const drawE = (P, E, {labels = true, foci = true} = {}) => {
  const {V, CV, Fo} = pts(E), L = E.vertical ? [[`(0, ${E.ra})`, `(0, −${E.ra})`], [`(${E.rb}, 0)`, `(−${E.rb}, 0)`]] : [[`(${E.ra}, 0)`, `(−${E.ra}, 0)`], [`(0, ${E.rb})`, `(0, −${E.rb})`]];
  CA.drawEllipse(P, E.vertical ? E.B2.v : E.A2.v, E.vertical ? E.A2.v : E.B2.v);
  V.forEach((p, i) => P.point(...p, {color: 'orange', r: 6.5, label: labels ? L[0][i] : '', labelOpt: E.vertical ? {} : {dy: -10, anchor: i ? 'end' : 'start', dx: i ? -6 : 6}}));
  CV.forEach((p, i) => P.point(...p, {color: 'green', r: 6.5, label: labels && i === 0 ? L[1][0] : '', labelOpt: E.vertical ? {dy: -10} : {}}));
  if (foci && !E.circle) Fo.forEach(p => P.point(...p, {color: 'purple', r: 6}));
  return P.point(0, 0, {color: 'gray', r: 4});
};
const win = E => { const m = Math.max(E.a, E.b); return E.vertical ? {xmin: -(E.b + 1.6), xmax: E.b + 1.6, ymin: -(E.a + 1.2), ymax: E.a + 1.2} : {xmin: -(E.a + 1.6), xmax: E.a + 1.6, ymin: -(E.b + 1.2), ymax: E.b + 1.2}; };
const LEG = [['orange', 'vertices'], ['green', 'co-vertices'], ['purple', 'foci']];

/* ---------- 01 · equation → features ---------- */
const PRE = [['18', '15', 'x²/18 + y²/15 = 1'], ['9', '16', 'x²/9 + y²/16 = 1'], ['30', '20', 'x²/30 + y²/20 = 1'], ['25', '40', 'x²/25 + y²/40 = 1']];
CA.lab('read-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Equation', value: '0', options: PRE.map((p, i) => [String(i), p[2]]).concat([['own', 'Set your own']])}, {type: 'text', key: 'x', label: 'Under x²', value: '18'}, {type: 'text', key: 'y', label: 'Under y²', value: '15'}],
  top: '<div class="ca-equation" id="read-eq"></div>', plot: {w: 560, h: 420}, plotLabel: 'Graph of the ellipse with its vertices, co-vertices, and foci', legend: LEG,
  readouts: [['abc', 'a, b, c'], ['v', 'Vertices'], ['cv', 'Co-vertices'], ['f', 'Foci'], ['len', 'Major · minor axis lengths']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = PRE[+st.pre]; st.set('x', p[0], true); st.set('y', p[1], true); } else if (key && key !== 'pre') st.set('pre', 'own', true);
  const X2 = CA.parseFrac(st.x), Y2 = CA.parseFrac(st.y);
  if (!X2 || !Y2 || X2.v <= 0 || Y2.v <= 0) { lab.plane({xmin: -5, xmax: 5, ymin: -4, ymax: 4}).render(); $('read-eq').innerHTML = '—'; ['abc', 'v', 'cv', 'f', 'len'].forEach(k => lab.read(k, '—')); lab.steps([]); lab.out('Both denominators must be positive numbers, such as 18 or 25/4.', 'ca-incorrect'); return; }
  const E = feat(X2, Y2), Lx = lists(E);
  drawE(lab.plane(win(E)), E).render();
  $('read-eq').innerHTML = eqTxt(X2, Y2);
  lab.read('abc', `a = ${E.ra}, b = ${E.rb}, c = ${E.rc}`); lab.read('v', Lx.v); lab.read('cv', Lx.cv); lab.read('f', E.circle ? 'both at the center' : Lx.f);
  lab.read('len', `${CA.sqrtF(E.A2).mul(2).str()} · ${CA.sqrtF(E.B2).mul(2).str()}`);
  if (E.circle) { lab.steps([['Equal denominators', `a² = b² = ${E.A2}`]]); lab.out(`The denominators are equal, so this is a <b>circle</b> of radius ${E.ra} (a = b and c = 0).`); return; }
  lab.steps([['Larger denominator', `a² = ${E.A2} (under ${E.vertical ? 'y' : 'x'}²) and b² = ${E.B2}, so the major axis is along the ${E.vertical ? 'y' : 'x'}-axis`],
    ['Square roots', `a = √${dn(E.A2)} = ${E.ra}, b = √${dn(E.B2)} = ${E.rb}`], ['c² = a² − b²', `c² = ${E.A2} − ${E.B2} = ${E.C2}, so c = ${E.rc}`],
    ['Features', `vertices ${Lx.v}, co-vertices ${Lx.cv}, foci ${Lx.f}`], ['Lengths', `major axis 2a = ${CA.sqrtF(E.A2).mul(2).str()}, minor axis 2b = ${CA.sqrtF(E.B2).mul(2).str()}`]]);
  lab.out(`Major axis along the <b>${E.vertical ? 'y' : 'x'}-axis</b>: vertices ${Lx.v}, co-vertices ${Lx.cv}, foci ${Lx.f}.`, 'ca-correct');
});

/* ---------- 02 · graphing in steps ---------- */
const GEQ = [['25', '9'], ['9', '16'], ['18', '15'], ['4', '36'], ['30', '20'], ['25', '40']].map(([x, y]) => [CA.parseFrac(x), CA.parseFrac(y)]);
CA.lab('graph-lab', {
  controls: [{type: 'select', key: 'e', label: 'Equation', value: '0', options: GEQ.map((g, i) => [String(i), eqTxt(g[0], g[1], false)])}, {type: 'seg', key: 's', label: 'Step', value: '1', options: [['1', '1 · center'], ['2', '2 · vertices'], ['3', '3 · co-vertices'], ['4', '4 · curve and foci']]}],
  plot: {w: 560, h: 420}, plotLabel: 'Graphing an ellipse step by step', legend: LEG, steps: true
}, (lab, st, key) => {
  if (key === 'e') st.set('s', '1', true);
  const [X2, Y2] = GEQ[+st.e], E = feat(X2, Y2), s = +st.s, {V, CV, Fo} = pts(E), Lx = lists(E), P = lab.plane(win(E));
  const vl = E.vertical ? [`(0, ${E.ra})`, `(0, −${E.ra})`] : [`(${E.ra}, 0)`, `(−${E.ra}, 0)`], cl = E.vertical ? [`(${E.rb}, 0)`, `(−${E.rb}, 0)`] : [`(0, ${E.rb})`, `(0, −${E.rb})`];
  if (s >= 4) CA.drawEllipse(P, E.vertical ? E.B2.v : E.A2.v, E.vertical ? E.A2.v : E.B2.v);
  if (s >= 2) V.forEach((p, i) => P.seg(0, 0, ...p, {color: 'orange', width: 1.6, dash: '5 5'}).point(...p, {color: 'orange', r: 7, label: vl[i], labelOpt: E.vertical ? {} : {anchor: i ? 'end' : 'start', dx: i ? -6 : 6}}));
  if (s >= 3) CV.forEach((p, i) => P.seg(0, 0, ...p, {color: 'green', width: 1.6, dash: '5 5'}).point(...p, {color: 'green', r: 7, label: cl[i], labelOpt: E.vertical ? {anchor: i ? 'end' : 'start', dx: i ? -6 : 6} : {}}));
  if (s >= 4) Fo.forEach(p => P.point(...p, {color: 'purple', r: 6}));
  P.point(0, 0, {color: 'gray', r: 6, label: s === 1 ? 'center (0, 0)' : ''}).render();
  const all = [['1 · Center', '(0, 0)'], ['2 · Vertices', `a² = ${E.A2} is the larger denominator (under ${E.vertical ? 'y' : 'x'}²), so a = ${E.ra}${/√/.test(E.ra) ? ' ≈ ' + num(E.a, 2) : ''}: ${Lx.v}`], ['3 · Co-vertices', `b² = ${E.B2}, so b = ${E.rb}${/√/.test(E.rb) ? ' ≈ ' + num(E.b, 2) : ''}: ${Lx.cv}`], ['4 · Curve and foci', `draw the oval through the four points; c² = ${E.A2} − ${E.B2} = ${E.C2}, c = ${E.rc}: foci ${Lx.f}`]];
  lab.steps(all.slice(0, s));
  lab.out(s < 4 ? 'Press the next step.' : `Done: the ellipse ${eqTxt(X2, Y2, false)} with its foci marked inside, on the major axis.`, s < 4 ? '' : 'ca-correct');
});

/* ---------- 03 · Ax² + By² = C ---------- */
const SPRE = [[4, 25, 100], [9, 4, 36], [16, 9, 144], [2, 3, 6], [1, 4, 16]];
CA.lab('std-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Equation', value: '0', options: SPRE.map((p, i) => [String(i), `${p[0] === 1 ? '' : p[0]}x² + ${p[1] === 1 ? '' : p[1]}y² = ${p[2]}`]).concat([['own', 'Set your own']])}, {type: 'number', key: 'A', label: 'A =', value: 4, min: 1, step: 1}, {type: 'number', key: 'B', label: 'B =', value: 25, min: 1, step: 1}, {type: 'number', key: 'C', label: 'C =', value: 100, min: 1, step: 1}],
  top: '<div class="ca-equation" id="std-eq"></div>', plot: {w: 560, h: 380}, plotLabel: 'Graph of the ellipse after dividing', legend: LEG, readouts: [['v', 'Vertices'], ['cv', 'Co-vertices'], ['f', 'Foci']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = SPRE[+st.pre]; st.set('A', p[0], true); st.set('B', p[1], true); st.set('C', p[2], true); } else if (key && key !== 'pre') st.set('pre', 'own', true);
  const {A, B, C} = st;
  if (![A, B, C].every(v => Number.isInteger(v) && v > 0)) { lab.plane({xmin: -5, xmax: 5, ymin: -4, ymax: 4}).render(); $('std-eq').innerHTML = '—'; lab.steps([]); lab.out('Use positive whole numbers A, B, and C.', 'ca-incorrect'); return; }
  const X2 = new Frac(C, A), Y2 = new Frac(C, B), E = feat(X2, Y2), Lx = lists(E);
  drawE(lab.plane(win(E)), E).render();
  $('std-eq').innerHTML = `${A === 1 ? '' : A}x² + ${B === 1 ? '' : B}y² = ${C} &nbsp;⟶&nbsp; ${eqTxt(X2, Y2)}`;
  lab.read('v', Lx.v); lab.read('cv', Lx.cv); lab.read('f', E.circle ? 'both at the center' : Lx.f);
  const cx = A === 1 ? '' : A, cy = B === 1 ? '' : B;
  lab.steps([['Divide every term by ' + C, `${cx}x²/${C} + ${cy}y²/${C} = ${C}/${C}`], ['Simplify each fraction', `${cx}x²/${C} = x²/${dn(X2)} (since ${C} ÷ ${A} = ${X2}) and ${cy}y²/${C} = y²/${dn(Y2)} (since ${C} ÷ ${B} = ${Y2})`], ['Read', E.circle ? `equal denominators: a circle of radius ${E.ra}` : `a² = ${E.A2}, b² = ${E.B2}, c² = ${E.C2}`]]);
  lab.out(E.circle ? `This is a circle of radius ${E.ra}.` : `Standard form: <b>${eqTxt(X2, Y2, false)}</b>, with the major axis along the ${E.vertical ? 'y' : 'x'}-axis.`, 'ca-correct');
});

/* ---------- 04 · name the ellipse from its graph ---------- */
const GR = [[5, 3, false], [4, 2, true], [6, 4, false], [3, 1, true], [5, 4, true], [7, 2, false]];
const fg = CA.lab('fg-lab', {
  controls: [{type: 'select', key: 'g', label: 'Graph', value: '0', options: GR.map((g, i) => [String(i), 'Graph ' + 'ABCDEF'[i]])}],
  plot: {w: 560, h: 400}, plotLabel: 'An ellipse on a grid', out: false
}, (lab, st) => {
  const [a, b, v] = GR[+st.g], E = feat(new Frac(v ? b * b : a * a, 1), new Frac(v ? a * a : b * b, 1)), P = lab.plane(win(E));
  CA.drawEllipse(P, v ? b * b : a * a, v ? a * a : b * b); pts(E).V.concat(pts(E).CV).forEach(p => P.point(...p, {color: 'orange', r: 5})); P.render();
  const A2 = a * a, B2 = b * b, c2 = A2 - B2, eq = (x, y) => `x²/${x} + y²/${y} = 1`;
  const right = v ? eq(B2, A2) : eq(A2, B2), opts = [right, v ? eq(A2, B2) : eq(B2, A2), v ? eq(b, a) : eq(a, b), v ? eq(c2, A2) : eq(A2, c2)], k = +st.g % 4, rot = opts.map((_, i) => opts[(i + k) % 4]);
  CA.choice('fg-choice', {q: `Which equation matches Graph ${'ABCDEF'[+st.g]}?`, options: rot, correct: rot.indexOf(right), why: `The vertices are ${v ? `(0, ±${a})` : `(±${a}, 0)`} and the co-vertices ${v ? `(±${b}, 0)` : `(0, ±${b})`}, so a² = ${A2} goes under ${v ? 'y' : 'x'}² and b² = ${B2} under ${v ? 'x' : 'y'}².`, whyWrong: i => rot[i] === opts[2] ? 'The denominators are a² and b², not a and b.' : rot[i] === opts[1] ? 'Look again at which axis is longer: a² goes under the variable of the longer axis.' : `${c2} is c² = a² − b², which is not a denominator. Use b² = ${B2}.`});
});

/* ---------- guided problems ---------- */
CA.guided('101b', [
  {q: 'For x²/9 + y²/16 = 1, the major axis is:', keep: true, opts: ['along the x-axis', 'along the y-axis'], correct: 1, hint: 'Which denominator is larger?', why: '16 &gt; 9 and 16 is under y².', ref: {panel: 'read', what: 'the ellipse x²/9 + y²/16 = 1', body: '<p>Find the features of <b>x²/9 + y²/16 = 1</b>.</p>'}},
  {q: 'The foci of x²/18 + y²/15 = 1 are:', opts: ['(±√3, 0)', '(±3, 0)', '(0, ±√3)', '(±√33, 0)'], correct: 0, hint: 'c² = 18 − 15.', why: 'c² = 3, so c = √3, and the major axis is along x.', ref: {panel: 'read', what: 'the ellipse x²/18 + y²/15 = 1', body: '<p>Find the features of <b>x²/18 + y²/15 = 1</b>.</p>'}},
  {q: 'The vertices of x²/9 + y²/16 = 1 are:', opts: ['(0, ±4)', '(±3, 0)', '(0, ±16)', '(±4, 0)'], correct: 0, hint: 'a² = 16 is under y².', why: 'a = 4 along the y-axis.'},
  {q: 'For x²/49 + y²/24 = 1, c = ?', opts: ['5', '√73', '25', '7'], correct: 0, hint: 'c² = a² − b².', why: 'c² = 49 − 24 = 25, so c = 5.'},
  {q: 'The length of the major axis of x²/36 + y²/11 = 1 is:', opts: ['12', '6', '36', '2√11'], correct: 0, hint: 'The length is 2a.', why: 'a = 6, so 2a = 12.'},
  {q: 'The co-vertices of x²/12 + y²/48 = 1 are:', opts: ['(±2√3, 0)', '(0, ±2√3)', '(±4√3, 0)', '(0, ±4√3)'], correct: 0, hint: 'b² = 12 is under x², and √12 = 2√3.', why: 'The major axis is along y, so the co-vertices are on the x-axis at (±2√3, 0).'},
  {q: 'Write 25x² + 4y² = 100 in standard form.', opts: ['x²/4 + y²/25 = 1', 'x²/25 + y²/4 = 1', 'x²/100 + y²/100 = 1', '25x²/4 + 4y²/25 = 1'], correct: 0, hint: 'Divide every term by 100.', why: '25x²/100 = x²/4 and 4y²/100 = y²/25.', ref: {panel: 'standardize', what: 'dividing by the constant', body: '<p>Write an equation like <b>4x² + 25y² = 100</b> in standard form by dividing every term by 100.</p>'}},
  {q: 'The foci of x²/50 + y²/2 = 1 are:', opts: ['(±4√3, 0)', '(±√52, 0)', '(0, ±4√3)', '(±48, 0)'], correct: 0, hint: 'c² = 50 − 2 = 48.', why: 'c = √48 = 4√3 on the x-axis.'},
  {q: 'An ellipse has vertices (±6, 0) and co-vertices (0, ±2). Its equation is:', opts: ['x²/36 + y²/4 = 1', 'x²/4 + y²/36 = 1', 'x²/6 + y²/2 = 1', 'x²/36 + y²/32 = 1'], correct: 0, hint: 'a = 6 on the x-axis, b = 2.', why: 'a² = 36 goes under x² and b² = 4 under y².', ref: {panel: 'from-graph', what: 'reading a graph', body: '<p>Read the vertices and co-vertices from a graph, then choose the equation.</p>'}},
  {q: 'Which point is on the graph of x²/25 + y²/9 = 1?', opts: ['(0, −3)', '(0, 5)', '(3, 0)', '(9, 0)'], correct: 0, hint: 'Substitute each point.', why: '0/25 + 9/9 = 1, so (0, −3) is a co-vertex.'}
]);
})();
