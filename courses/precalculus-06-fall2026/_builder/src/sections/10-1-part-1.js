/* Section 10.1 Part I · The Ellipse: Definition and Equations — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Frac, toDeg, toRad} = CA;
const PI = Math.PI, $ = id => document.getElementById(id);
const fabs = f => f.n < 0 ? f.neg() : f, sq = f => f.mul(f), R = q => CA.sqrtF(q).str();
const pt = (x, y) => `(${x}, ${y})`;

/* ---------- 01 · definition ---------- */
const def = CA.lab('def-lab', {
  controls: [{type: 'seg', key: 'or', label: 'Major axis', value: 'h', options: [['h', 'along the x-axis'], ['v', 'along the y-axis']]}, {type: 'range', key: 'a', label: 'a =', min: 2, max: 7, step: 0.5, value: 5}, {type: 'range', key: 'b', label: 'b =', min: 1, max: 6.5, step: 0.5, value: 3}, {type: 'range', key: 't', label: 'P at angle', min: 0, max: 359, step: 1, value: 60, fmt: v => v + '°'}, {type: 'check', key: 'tri', label: 'Show the a, b, c triangle', value: true}],
  top: '<div class="ca-equation" id="def-eq"></div>', plot: {w: 560, h: 460}, plotLabel: 'Ellipse with its foci and a moving point P',
  legend: [['blue', 'PF₁'], ['green', 'PF₂'], ['purple', 'foci']], readouts: [['d1', 'PF₁'], ['d2', 'PF₂'], ['sum', 'PF₁ + PF₂'], ['c', 'c = √(a² − b²)']], steps: true,
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag P along the ellipse.</p>'
}, (lab, st, key) => {
  if (st.b >= st.a) { if (key === 'b') st.set('a', Math.min(7, st.b + 0.5), true); if (st.b >= st.a) st.set('b', st.a - 0.5, true); }
  const a = st.a, b = st.b, c = Math.sqrt(a * a - b * b), v = st.or === 'v', t = toRad(st.t);
  const X = v ? b * Math.cos(t) : a * Math.cos(t), Y = v ? a * Math.sin(t) : b * Math.sin(t);
  const F1 = v ? [0, c] : [c, 0], F2 = v ? [0, -c] : [-c, 0], V = v ? [[0, a], [0, -a]] : [[a, 0], [-a, 0]], CV = v ? [[b, 0], [-b, 0]] : [[0, b], [0, -b]];
  const d1 = Math.hypot(X - F1[0], Y - F1[1]), d2 = Math.hypot(X - F2[0], Y - F2[1]), P = lab.plane(v ? {xmin: -6, xmax: 6, ymin: -7.8, ymax: 7.8} : {xmin: -7.8, xmax: 7.8, ymin: -6, ymax: 6});
  P.seg(V[0][0], V[0][1], V[1][0], V[1][1], {color: 'orange', width: 1.6, dash: '6 5'}).seg(CV[0][0], CV[0][1], CV[1][0], CV[1][1], {color: 'green', width: 1.6, dash: '6 5'});
  v ? CA.drawEllipse(P, b * b, a * a) : CA.drawEllipse(P, a * a, b * b);
  if (st.tri) { const cv = CV[0]; P.poly([[0, 0], cv, F1], {color: 'purple', fillOpacity: 0.12}).seg(0, 0, cv[0], cv[1], {color: 'green', width: 3}).seg(0, 0, F1[0], F1[1], {color: 'purple', width: 3}).seg(cv[0], cv[1], F1[0], F1[1], {color: 'orange', width: 3});
    P.label(cv[0] / 2, cv[1] / 2, 'b', v ? {color: 'green', size: 15, anchor: 'middle', dx: 0, dy: -8} : {color: 'green', size: 15, anchor: 'start', dx: 7, dy: 5}).label(F1[0] / 2, F1[1] / 2, 'c', v ? {color: 'purple', size: 15, anchor: 'start', dx: 7, dy: 5} : {color: 'purple', size: 15, anchor: 'middle', dx: 0, dy: -8}).label((cv[0] + F1[0]) / 2, (cv[1] + F1[1]) / 2, 'a', {color: 'orange', size: 15, anchor: 'start', dx: 8, dy: -8}); }
  P.seg(X, Y, F1[0], F1[1], {color: 'blue', width: 3}).seg(X, Y, F2[0], F2[1], {color: 'green', width: 3});
  V.forEach(p => P.point(p[0], p[1], {color: 'orange', r: 6})); CV.forEach(p => P.point(p[0], p[1], {color: 'green', r: 6}));
  P.point(...F1, {color: 'purple', r: 6.5, label: 'F₁', labelOpt: v ? {dx: -10, anchor: 'end', dy: 5} : {dy: -10}}).point(...F2, {color: 'purple', r: 6.5, label: 'F₂', labelOpt: v ? {dx: -10, anchor: 'end', dy: 5} : {dy: -10}}).point(0, 0, {color: 'gray', r: 4}).point(X, Y, {color: 'blue', r: 8, label: 'P'}).render();
  $('def-eq').innerHTML = CA.conicEq('ellipse', v, Frac.of(a * a), Frac.of(b * b));
  lab.read('d1', num(d1, 2)); lab.read('d2', num(d2, 2)); lab.read('sum', `${num(d1 + d2, 2)} = 2a`); lab.read('c', num(c, 3));
  lab.steps([['Vertices', v ? `(0, ±${fmt(a)})` : `(±${fmt(a)}, 0)`], ['Co-vertices', v ? `(±${fmt(b)}, 0)` : `(0, ±${fmt(b)})`], ['c² = a² − b²', `c² = ${fmt(a * a)} − ${fmt(b * b)} = ${fmt(Math.round((a * a - b * b) * 100) / 100)}, c ≈ ${num(c, 3)}; foci ${v ? `(0, ±${num(c, 3)})` : `(±${num(c, 3)}, 0)`}`]]);
  lab.out(`PF₁ + PF₂ = ${num(d1, 2)} + ${num(d2, 2)} = <b>${num(d1 + d2, 2)}</b>, which is 2a = ${fmt(2 * a)} for every position of P.${st.tri ? ' In the triangle, the side from the co-vertex to the focus has length a, so b² + c² = a².' : ''}`);
});
let onP = false;
CA.drag(def.svg, (x, y, ph) => {
  const s = def.state, v = s.or === 'v', ax = v ? s.b : s.a, ay = v ? s.a : s.b;
  if (ph === 'start') { const t0 = toRad(s.t); onP = Math.hypot(x - ax * Math.cos(t0), y - ay * Math.sin(t0)) < 1.6; if (!onP) return false; }
  if (onP) { let d = Math.round(toDeg(Math.atan2(y / ay, x / ax))); if (d < 0) d += 360; s.set('t', d % 360); }
});

/* ---------- 02 · which axis? ---------- */
CA.cards('axis-cards', [
  {expr: 'vertex at (−5, 0)', correct: 0, why: 'Vertices are on the major axis, and (−5, 0) is on the x-axis.'},
  {expr: 'focus at (0, −3)', correct: 1, why: 'The foci are on the major axis, and (0, −3) is on the y-axis.'},
  {expr: 'co-vertex at (0, 2)', correct: 0, why: 'Co-vertices are on the <b>minor</b> axis. The minor axis is vertical, so the major axis is horizontal.'},
  {expr: 'co-vertices (±4, 0)', correct: 1, why: 'The minor axis is horizontal, so the major axis is vertical.'},
  {expr: 'x²/9 + y²/16 = 1', correct: 1, why: 'The larger denominator, 16, is under y², so a² = 16 and the major axis is vertical.'},
  {expr: 'x²/18 + y²/15 = 1', correct: 0, why: 'The larger denominator, 18, is under x².'},
  {expr: 'length of major axis 20, focus at (0, −3)', correct: 1, why: 'The length alone does not tell the direction; the focus on the y-axis does.'},
  {expr: 'vertex at (0, 4), point (1, −3) on the graph', correct: 1, why: 'The vertex (0, 4) is on the y-axis. The extra point is used later to find b².'}
], {options: ['x-axis', 'y-axis']});

/* ---------- 03 · features → equation ---------- */
const MODES = {
  fv: ['a focus and a vertex', 'Focus', 'Vertex'], Lf: ['the length of the major axis and a focus', 'Length 2a', 'Focus'], vc: ['a vertex and a co-vertex', 'Vertex', 'Co-vertex'],
  fc: ['a focus and a co-vertex', 'Focus', 'Co-vertex'], cp: ['a co-vertex and a point on the graph', 'Co-vertex', 'Point on the graph'], vp: ['a vertex and a point on the graph', 'Vertex', 'Point on the graph']
};
const PRE = [['fv', '(4, 0)', '(6, 0)', 'focus (4, 0), vertex (6, 0)'], ['Lf', '20', '(0, -3)', 'major axis 20, focus (0, −3)'], ['cp', '(0, 2)', '(3, 1)', 'co-vertex (0, 2), point (3, 1)'],
  ['vc', '(-5, 0)', '(0, 2)', 'vertex (−5, 0), co-vertex (0, 2)'], ['Lf', '16', '(0, 6)', 'major axis 16, focus (0, 6)'], ['vp', '(0, 4)', '(1, -3)', 'vertex (0, 4), point (1, −3)']];
const axisOf = p => p[1].n === 0 && p[0].n !== 0 ? 'x' : p[0].n === 0 && p[1].n !== 0 ? 'y' : null;
const along = p => axisOf(p) === 'x' ? fabs(p[0]) : fabs(p[1]);
const ptS = p => `(${p[0]}, ${p[1]})`;
function solve(mode, g1, g2) {
  const fail = m => ({err: m}), steps = [];
  const P1 = mode === 'Lf' ? CA.parseFrac(g1) : CA.parsePt(g1), P2 = CA.parsePt(g2);
  if (!P1 || !P2) return fail(`Type ${mode === 'Lf' ? 'the length as a number and the point' : 'each point'} like (4, 0) or (0, −5/2).`);
  let vertical, A2, B2, C2;
  const onAxis = (p, name) => axisOf(p) ? null : `The ${name} ${ptS(p)} must lie on an axis (one coordinate 0, the other not), because the center is the origin.`;
  if (mode === 'fv' || mode === 'Lf') {
    const fpt = mode === 'fv' ? P1 : P2, e = onAxis(fpt, 'focus'); if (e) return fail(e);
    let a; if (mode === 'fv') { const e2 = onAxis(P2, 'vertex'); if (e2) return fail(e2); if (axisOf(P1) !== axisOf(P2)) return fail('A focus and a vertex are both on the major axis, so they must be on the same coordinate axis.'); a = along(P2); steps.push(['Read a and c', `vertex ${ptS(P2)} gives a = ${a}; focus ${ptS(P1)} gives c = ${along(P1)}`]); }
    else { if (P1.v <= 0) return fail('The length 2a must be positive.'); a = P1.div(2); steps.push(['Read a and c', `2a = ${P1} so a = ${a}; focus ${ptS(P2)} gives c = ${along(P2)}`]); }
    const c = along(fpt); vertical = axisOf(fpt) === 'y';
    if (c.v >= a.v) return fail(`For an ellipse c &lt; a, but here c = ${c} and a = ${a}.`);
    A2 = sq(a); C2 = sq(c); B2 = A2.sub(C2);
    steps.push(['Major axis', `the ${mode === 'fv' ? 'focus and vertex are' : 'focus is'} on the ${vertical ? 'y' : 'x'}-axis`], ['b² = a² − c²', `b² = ${a}² − ${c}² = ${A2} − ${C2} = ${B2}`]);
  } else if (mode === 'vc' || mode === 'fc') {
    const nm = mode === 'vc' ? 'vertex' : 'focus', e = onAxis(P1, nm) || onAxis(P2, 'co-vertex'); if (e) return fail(e);
    if (axisOf(P1) === axisOf(P2)) return fail(`The ${nm} is on the major axis and the co-vertex is on the minor axis, so they must be on different coordinate axes.`);
    vertical = axisOf(P1) === 'y'; const b = along(P2); B2 = sq(b);
    if (mode === 'vc') { const a = along(P1); if (a.v <= b.v) return fail(`For an ellipse a &gt; b, but here a = ${a} and b = ${b}.`); A2 = sq(a); C2 = A2.sub(B2); steps.push(['Read a and b', `vertex ${ptS(P1)} gives a = ${a}; co-vertex ${ptS(P2)} gives b = ${b}`], ['Major axis', `the vertex is on the ${vertical ? 'y' : 'x'}-axis`], ['c² = a² − b²', `c² = ${A2} − ${B2} = ${C2} (needed only for the foci)`]); }
    else { const c = along(P1); C2 = sq(c); A2 = B2.add(C2); steps.push(['Read b and c', `co-vertex ${ptS(P2)} gives b = ${b}; focus ${ptS(P1)} gives c = ${c}`], ['Major axis', `the focus is on the ${vertical ? 'y' : 'x'}-axis`], ['a² = b² + c²', `a² = ${B2} + ${C2} = ${A2}`]); }
  } else {
    const nm = mode === 'cp' ? 'co-vertex' : 'vertex', e = onAxis(P1, nm); if (e) return fail(e);
    const k = along(P1), K2 = sq(k), ax = axisOf(P1); vertical = mode === 'cp' ? ax === 'x' : ax === 'y';
    const u = vertical ? P2[1] : P2[0], w = vertical ? P2[0] : P2[1], U2 = sq(u), W2 = sq(w); // u: major-axis coordinate
    const form = CA.conicEq('ellipse', vertical, mode === 'cp' ? 'a²' : K2, mode === 'cp' ? K2 : 'b²', false);
    if (mode === 'cp') {
      B2 = K2; const rest = new Frac(1, 1).sub(W2.div(B2));
      steps.push(['Read b', `co-vertex ${ptS(P1)} gives b = ${k}; the minor axis is on the ${ax}-axis, so the major axis is on the ${vertical ? 'y' : 'x'}-axis`], ['Form', form]);
      if (rest.v <= 0 || U2.n === 0) return Object.assign(fail(`The point ${ptS(P2)} cannot be on this ellipse: its ${vertical ? 'x' : 'y'}-coordinate must be between −b and b (strictly) and its ${vertical ? 'y' : 'x'}-coordinate cannot be 0.`), {steps});
      A2 = U2.div(rest); if (A2.v <= B2.v) return fail(`That gives a² = ${A2}, which is not larger than b² = ${B2}, so the co-vertex would not be on the minor axis.`);
      steps.push(['Substitute the point', `${U2}/a² + ${W2}/${B2} = 1 ⟹ ${U2}/a² = ${rest} ⟹ a² = ${A2}`]);
    } else {
      A2 = K2; const rest = new Frac(1, 1).sub(U2.div(A2));
      steps.push(['Read a', `vertex ${ptS(P1)} gives a = ${k} on the ${vertical ? 'y' : 'x'}-axis`], ['Form', form]);
      if (rest.v <= 0 || W2.n === 0) return Object.assign(fail(`The point ${ptS(P2)} cannot be on this ellipse: its ${vertical ? 'y' : 'x'}-coordinate must be between −a and a (strictly) and its ${vertical ? 'x' : 'y'}-coordinate cannot be 0.`), {steps});
      B2 = W2.div(rest); if (B2.v >= A2.v) return fail(`That gives b² = ${B2}, which is not smaller than a² = ${A2}.`);
      steps.push(['Substitute the point', `${W2}/b² + ${U2}/${A2} = 1 ⟹ ${W2}/b² = ${rest} ⟹ b² = ${B2}`]);
    }
    C2 = A2.sub(B2);
  }
  steps.push(['Equation', CA.conicEq('ellipse', vertical, A2, B2, false)]);
  return {vertical, A2, B2, C2, steps, given: [P1, P2]};
}
CA.lab('build-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: '0', options: PRE.map((p, i) => [String(i), p[3]]).concat([['own', 'Set your own']])}, {type: 'select', key: 'mode', label: 'Given', value: 'fv', options: Object.entries(MODES).map(([k, m]) => [k, m[0]])}, {type: 'text', key: 'g1', label: 'First', value: '(4, 0)'}, {type: 'text', key: 'g2', label: 'Second', value: '(6, 0)'}],
  top: '<p class="ca-note" id="build-what"></p><div class="ca-equation" id="build-eq"></div>', plot: {w: 560, h: 460}, plotLabel: 'The ellipse described by the given features',
  legend: [['orange', 'vertices'], ['green', 'co-vertices'], ['purple', 'foci'], ['blue', 'given point']], readouts: [['abc', 'a, b, c'], ['v', 'Vertices'], ['cv', 'Co-vertices'], ['f', 'Foci']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = PRE[+st.pre]; st.set('mode', p[0], true); st.set('g1', p[1], true); st.set('g2', p[2], true); } else if (key && key !== 'pre') st.set('pre', 'own', true);
  const M = MODES[st.mode]; $('build-what').innerHTML = `<b>First:</b> ${M[1].toLowerCase()} · <b>Second:</b> ${M[2].toLowerCase()}`;
  const S = solve(st.mode, st.g1, st.g2);
  if (S.err) { lab.plane({xmin: -6, xmax: 6, ymin: -5, ymax: 5}).render(); $('build-eq').innerHTML = '—'; ['abc', 'v', 'cv', 'f'].forEach(k => lab.read(k, '—')); lab.steps(S.steps || []); lab.out(S.err, 'ca-incorrect'); return; }
  const {vertical: v, A2, B2, C2} = S, a = A2.v ** 0.5, b = B2.v ** 0.5, c = C2.v ** 0.5, ra = R(A2), rb = R(B2), rc = R(C2);
  const pts = v ? [[0, a], [0, -a], [b, 0], [-b, 0]] : [[a, 0], [-a, 0], [0, b], [0, -b]], P = lab.plane(CA.fitWin(pts.concat(S.given.filter(g => Array.isArray(g)).map(g => [g[0].v, g[1].v])), 1.4, 6));
  v ? CA.drawEllipse(P, B2.v, A2.v) : CA.drawEllipse(P, A2.v, B2.v);
  P.point(...pts[0], {color: 'orange', r: 6, label: v ? `(0, ${ra})` : `(${ra}, 0)`}).point(...pts[1], {color: 'orange', r: 6, label: v ? `(0, −${ra})` : `(−${ra}, 0)`});
  P.point(...pts[2], {color: 'green', r: 6, label: v ? `(${rb}, 0)` : `(0, ${rb})`}).point(...pts[3], {color: 'green', r: 6});
  [1, -1].forEach(s => P.point(v ? 0 : s * c, v ? s * c : 0, {color: 'purple', r: 6}));
  if (st.mode === 'cp' || st.mode === 'vp') { const g = S.given[1]; P.point(g[0].v, g[1].v, {color: 'blue', r: 7, label: ptS(g)}); }
  P.render();
  $('build-eq').innerHTML = CA.conicEq('ellipse', v, A2, B2);
  lab.read('abc', `a = ${ra}, b = ${rb}, c = ${rc}`); lab.read('v', v ? `(0, ±${ra})` : `(±${ra}, 0)`); lab.read('cv', v ? `(±${rb}, 0)` : `(0, ±${rb})`); lab.read('f', v ? `(0, ±${rc})` : `(±${rc}, 0)`);
  lab.steps(S.steps);
  lab.out(`The major axis is along the <b>${v ? 'y' : 'x'}-axis</b>, so a² = ${A2} goes under ${v ? 'y' : 'x'}²: <b>${CA.conicEq('ellipse', v, A2, B2, false)}</b>.`, 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('101a', [
  {q: 'An ellipse has a = 10 and b = 6. What is c?', opts: ['8', '4', '√136', '16'], correct: 0, hint: 'c² = a² − b².', why: 'c² = 100 − 36 = 64, so c = 8.', ref: {panel: 'definition', what: 'a² = b² + c²', body: '<p>Use <b>a² = b² + c²</b> with the definition of a, b, and c.</p>'}},
  {q: 'For every point P on an ellipse with vertices (±7, 0), PF₁ + PF₂ = ?', opts: ['14', '7', '49', 'it depends on P'], correct: 0, hint: 'The constant sum is 2a.', why: 'a = 7, so the sum of the distances is 2a = 14.'},
  {q: 'Center (0, 0), focus (3, 0), vertex (5, 0). The equation is:', opts: ['x²/25 + y²/16 = 1', 'x²/16 + y²/25 = 1', 'x²/25 + y²/9 = 1', 'x²/25 − y²/16 = 1'], correct: 0, hint: 'a = 5, c = 3, b² = a² − c².', why: 'b² = 25 − 9 = 16, and the major axis is horizontal.', ref: {panel: 'build', what: 'the focus-and-vertex problem', body: '<p>Center at the origin, focus at <b>(4, 0)</b>, vertex at <b>(6, 0)</b>: the same steps with different numbers.</p>'}},
  {q: 'Center (0, 0), major axis of length 10, focus (0, −4). The equation is:', opts: ['x²/9 + y²/25 = 1', 'x²/25 + y²/9 = 1', 'x²/9 + y²/100 = 1', 'x²/16 + y²/25 = 1'], correct: 0, hint: '2a = 10, c = 4, and the focus is on the y-axis.', why: 'a = 5, b² = 25 − 16 = 9, and a² goes under y².', ref: {panel: 'build', what: 'the major-axis-and-focus problem', body: '<p>Center at the origin, length of the major axis <b>20</b>, focus at <b>(0, −3)</b>.</p>'}},
  {q: 'Center (0, 0), vertex (0, 6), co-vertex (−2, 0). The equation is:', opts: ['x²/4 + y²/36 = 1', 'x²/36 + y²/4 = 1', 'x²/2 + y²/6 = 1', 'x²/4 + y²/32 = 1'], correct: 0, hint: 'a = 6 on the y-axis, b = 2.', why: 'a² = 36 under y² and b² = 4 under x².'},
  {q: 'An ellipse centered at the origin has a co-vertex at (0, 3) and a = 4. Which point is a vertex?', opts: ['(4, 0)', '(0, 4)', '(3, 0)', '(0, −3)'], correct: 0, hint: 'The co-vertex is on the minor axis.', why: 'The minor axis is vertical, so the vertices are on the x-axis: (±4, 0).'},
  {q: 'Center (0, 0), co-vertex (0, 2), point (3, 1) on the graph. Find a².', opts: ['12', '9', '4', '36'], correct: 0, hint: '9/a² + 1/4 = 1.', why: '9/a² = 3/4, so a² = 12.', ref: {panel: 'build', what: 'the co-vertex-and-point problem', body: '<p>Center at the origin, co-vertex at <b>(0, 2)</b>, point on graph <b>(3, 1)</b>.</p>'}},
  {q: 'Center (0, 0), vertex (0, 5), point (2, 3) on the graph. Find b².', opts: ['25/4', '4', '16/25', '25'], correct: 0, hint: 'x²/b² + y²/25 = 1 with x = 2, y = 3.', why: '4/b² = 1 − 9/25 = 16/25, so b² = 100/16 = 25/4.'},
  {q: 'Which equation has its foci on the y-axis?', opts: ['x²/12 + y²/20 = 1', 'x²/20 + y²/12 = 1', 'x²/30 + y²/4 = 1', 'x²/5 + y²/2 = 1'], correct: 0, hint: 'The larger denominator marks the major axis.', why: '20 &gt; 12 is under y², so the major axis and the foci are on the y-axis.'},
  {q: 'The major axis of an ellipse has length 12 and the minor axis has length 8. Then c = ?', opts: ['2√5', '√52', '4', '20'], correct: 0, hint: 'a = 6, b = 4.', why: 'c² = 36 − 16 = 20, so c = √20 = 2√5.'}
]);
})();
