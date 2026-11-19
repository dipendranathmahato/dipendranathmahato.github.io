/* Section 10.2 · The Hyperbola — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Frac} = CA;
const $ = id => document.getElementById(id);
const fabs = f => f.n < 0 ? f.neg() : f, sq = f => f.mul(f), R = q => CA.sqrtF(q).str(), dn = f => f.d === 1 ? f.toString() : '(' + f.toString() + ')';
const ptS = p => `(${p[0]}, ${p[1]})`, mc = f => f.d === 1 ? (f.n === 1 ? '' : f.toString()) : `(${f})`;
const slopeEq = r => { const s = r.str(); return s === '1' ? 'y = ±x' : /[/+−]/.test(s.replace(/^−/, '')) ? `y = ±(${s})x` : `y = ±${s}x`; };
/* features of a hyperbola: vertical = transverse axis along y; A2 = a², B2 = b² (Frac) */
const hyp = (vertical, A2, B2) => { const C2 = A2.add(B2), slope = CA.sqrtF(vertical ? A2.div(B2) : B2.div(A2)); return {vertical, A2, B2, C2, a: A2.v ** 0.5, b: B2.v ** 0.5, c: C2.v ** 0.5, ra: R(A2), rb: R(B2), rc: R(C2), slope, m: slope.v}; };
const lists = H => H.vertical ? {v: `(0, ±${H.ra})`, cv: `(±${H.rb}, 0)`, f: `(0, ±${H.rc})`} : {v: `(±${H.ra}, 0)`, cv: `(0, ±${H.rb})`, f: `(±${H.rc}, 0)`};
/* central rectangle, asymptotes, branches, and feature points */
const drawH = (P, H, {labels = true, box = true} = {}) => {
  const {a, b, c, vertical: v} = H, hx = v ? b : a, hy = v ? a : b;
  if (box) P.poly([[hx, hy], [-hx, hy], [-hx, -hy], [hx, -hy]], {color: 'gray', fillOpacity: 0.06, width: 1.4, dash: true});
  P.curve(x => H.m * x, {color: 'gray', width: 1.6, dash: '7 6'}).curve(x => -H.m * x, {color: 'gray', width: 1.6, dash: '7 6'});
  CA.drawHyperbola(P, a, b, v);
  const V = v ? [[0, a], [0, -a]] : [[a, 0], [-a, 0]], CV = v ? [[b, 0], [-b, 0]] : [[0, b], [0, -b]], Fo = v ? [[0, c], [0, -c]] : [[c, 0], [-c, 0]];
  V.forEach((p, i) => P.point(...p, {color: 'orange', r: 6.5, label: labels && i === 0 ? (v ? `(0, ${H.ra})` : `(${H.ra}, 0)`) : '', labelOpt: v ? {dx: 8, dy: 16} : {dy: -10, dx: 6}}));
  CV.forEach((p, i) => P.point(...p, {color: 'green', r: 6, label: labels && i === 0 ? (v ? `(${H.rb}, 0)` : `(0, ${H.rb})`) : '', labelOpt: v ? {dy: -10} : {dx: 8}}));
  Fo.forEach(p => P.point(...p, {color: 'purple', r: 6}));
  return P.point(0, 0, {color: 'gray', r: 4});
};
const winH = H => { const L = H.vertical ? Math.max(H.b * 1.9, H.c * 0.8, 3) : Math.max(H.c + 1.6, 4), M = H.vertical ? Math.max(H.c + 1.6, 4) : Math.max(H.b * 1.9, H.c * 0.8, 3); return {xmin: -L, xmax: L, ymin: -M, ymax: M}; };
const ratio = (n, d, r) => { const t = `${n}/${/[√/]/.test(d) ? '(' + d + ')' : d}`; return t === r ? t : `${t} = ${r}`; };
const LEG = [['orange', 'vertices'], ['green', 'co-vertices'], ['purple', 'foci'], ['gray', 'asymptotes and central rectangle', true]];

/* ---------- 01 · definition ---------- */
const def = CA.lab('def-lab', {
  controls: [{type: 'seg', key: 'or', label: 'Transverse axis', value: 'h', options: [['h', 'along the x-axis'], ['v', 'along the y-axis']]}, {type: 'range', key: 'a', label: 'a =', min: 1, max: 4.5, step: 0.5, value: 3}, {type: 'range', key: 'b', label: 'b =', min: 1, max: 4.5, step: 0.5, value: 2}, {type: 'seg', key: 'br', label: 'Branch', value: '1', options: [['1', 'first'], ['-1', 'second']]}, {type: 'range', key: 't', label: 'Move P', min: -100, max: 100, step: 1, value: 30}, {type: 'check', key: 'circ', label: 'Show the circle of radius c', value: true}],
  top: '<div class="ca-equation" id="def-eq"></div>', plot: {w: 560, h: 460}, plotLabel: 'Hyperbola with its foci and a moving point P',
  legend: [['blue', 'PF₁'], ['green', 'PF₂'], ['purple', 'foci'], ['gray', 'asymptotes', true]], readouts: [['d1', 'PF₁'], ['d2', 'PF₂'], ['diff', '|PF₁ − PF₂|'], ['c', 'c = √(a² + b²)']], steps: true,
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag P along either branch.</p>'
}, (lab, st) => {
  const a = st.a, b = st.b, v = st.or === 'v', s = +st.br, t = st.t / 45, H = hyp(v, Frac.of(a * a), Frac.of(b * b)), c = H.c;
  const X = v ? b * Math.sinh(t) : s * a * Math.cosh(t), Y = v ? s * a * Math.cosh(t) : b * Math.sinh(t);
  const F1 = v ? [0, c] : [c, 0], F2 = v ? [0, -c] : [-c, 0], d1 = Math.hypot(X - F1[0], Y - F1[1]), d2 = Math.hypot(X - F2[0], Y - F2[1]);
  const P = lab.plane(v ? {xmin: -7, xmax: 7, ymin: -9, ymax: 9} : {xmin: -9, xmax: 9, ymin: -7, ymax: 7});
  if (st.circ) P.param(u => c * Math.cos(u), u => c * Math.sin(u), 0, 2 * Math.PI, {color: 'purple', width: 1.4, dash: '4 5'});
  drawH(P, H, {labels: false});
  if (st.circ) P.seg(0, 0, v ? b : a, v ? a : b, {color: 'purple', width: 2.4}).label((v ? b : a) / 2, (v ? a : b) / 2, 'c', {color: 'purple', size: 15, dx: -14, dy: -4});
  P.seg(X, Y, ...F1, {color: 'blue', width: 3}).seg(X, Y, ...F2, {color: 'green', width: 3});
  P.point(...F1, {color: 'purple', r: 6.5, label: 'F₁', labelOpt: v ? {dx: 8, dy: 5} : {dy: -10}}).point(...F2, {color: 'purple', r: 6.5, label: 'F₂', labelOpt: v ? {dx: 8, dy: 5} : {dy: -10}}).point(X, Y, {color: 'blue', r: 8, label: 'P'}).render();
  $('def-eq').innerHTML = CA.conicEq('hyperbola', v, Frac.of(a * a), Frac.of(b * b));
  lab.read('d1', num(d1, 2)); lab.read('d2', num(d2, 2)); lab.read('diff', `${num(Math.abs(d1 - d2), 2)} = 2a`); lab.read('c', num(c, 3));
  lab.steps([['Vertices', v ? `(0, ±${fmt(a)})` : `(±${fmt(a)}, 0)`], ['c² = a² + b²', `c² = ${fmt(a * a)} + ${fmt(b * b)} = ${fmt(a * a + b * b)}, c ≈ ${num(c, 3)}`], ['Asymptotes', `y = ±${v ? `(${fmt(a)}/${fmt(b)})` : `(${fmt(b)}/${fmt(a)})`}x`]]);
  lab.out(`|PF₁ − PF₂| = |${num(d1, 2)} − ${num(d2, 2)}| = <b>${num(Math.abs(d1 - d2), 2)}</b> = 2a for every point on both branches. P is closer to ${d1 < d2 ? 'F₁' : 'F₂'}, the focus inside its branch.`);
});
let onP = false;
CA.drag(def.svg, (x, y, ph) => {
  const s = def.state, v = s.or === 'v', a = s.a, b = s.b, br = +s.br, t = s.t / 45, X = v ? b * Math.sinh(t) : br * a * Math.cosh(t), Y = v ? br * a * Math.cosh(t) : b * Math.sinh(t);
  if (ph === 'start') { onP = Math.hypot(x - X, y - Y) < 1.4; if (!onP) return false; }
  if (!onP) return;
  const side = v ? Math.sign(y) || 1 : Math.sign(x) || 1, nt = Math.asinh(v ? x / b : y / b);
  if (side !== br) s.set('br', String(side), true);
  s.set('t', Math.max(-100, Math.min(100, Math.round(nt * 45))));
});

/* ---------- 02 · features → equation ---------- */
const MODES = {
  fv: ['a focus and a vertex', 'Focus', 'Vertex'], Lf: ['the length of the transverse axis and a focus', 'Length 2a', 'Focus'], fc: ['a focus and a co-vertex', 'Focus', 'Co-vertex'],
  cp: ['a co-vertex and a point on the graph', 'Co-vertex', 'Point on the graph'], vp: ['a vertex and a point on the graph', 'Vertex', 'Point on the graph'], fs: ['a focus and the slope of an asymptote', 'Focus', 'Asymptote slope']
};
const PRE = [['fv', '(-6, 0)', '(4, 0)', 'focus (−6, 0), vertex (4, 0)'], ['Lf', '16', '(0, 11)', 'transverse axis 16, focus (0, 11)'], ['cp', '(0, 2)', '(2, -3)', 'co-vertex (0, 2), point (2, −3)'], ['fs', '(5, 0)', '1/2', 'focus (5, 0), asymptote y = (1/2)x'],
  ['fc', '(-5, 0)', '(0, 2)', 'focus (−5, 0), co-vertex (0, 2)'], ['Lf', '18', '(0, 12)', 'transverse axis 18, focus (0, 12)'], ['fs', '(0, 10)', '3/2', 'focus (0, 10), asymptote y = (3/2)x']];
const axisOf = p => p[1].n === 0 && p[0].n !== 0 ? 'x' : p[0].n === 0 && p[1].n !== 0 ? 'y' : null;
const along = p => axisOf(p) === 'x' ? fabs(p[0]) : fabs(p[1]);
function solve(mode, g1, g2) {
  const fail = (m, steps) => ({err: m, steps}), steps = [], one = new Frac(1, 1);
  const P1 = mode === 'Lf' ? CA.parseFrac(g1) : CA.parsePt(g1), P2 = mode === 'fs' ? CA.parseFrac(g2) : CA.parsePt(g2);
  if (!P1 || !P2) return fail(mode === 'fs' ? 'Type the focus like (5, 0) and the slope like 1/2.' : `Type ${mode === 'Lf' ? 'the length as a number and the focus' : 'each point'} like (4, 0) or (0, −5/2).`);
  const onAxis = (p, name) => axisOf(p) ? null : `The ${name} ${ptS(p)} must lie on an axis (one coordinate 0, the other not), because the center is the origin.`;
  let vertical, A2, B2;
  if (mode === 'fv' || mode === 'Lf' || mode === 'fc' || mode === 'fs') {
    const fpt = mode === 'Lf' ? P2 : P1, e = onAxis(fpt, 'focus'); if (e) return fail(e);
    const c = along(fpt), C2 = sq(c); vertical = axisOf(fpt) === 'y';
    if (mode === 'fv') { const e2 = onAxis(P2, 'vertex'); if (e2) return fail(e2); if (axisOf(P2) !== axisOf(P1)) return fail('A focus and a vertex are both on the transverse axis, so they must be on the same coordinate axis.'); const a = along(P2); if (a.v >= c.v) return fail(`For a hyperbola c &gt; a, but here c = ${c} and a = ${a}.`); A2 = sq(a); B2 = C2.sub(A2); steps.push(['Read a and c', `vertex ${ptS(P2)} gives a = ${a}; focus ${ptS(P1)} gives c = ${c}`], ['b² = c² − a²', `b² = ${c}² − ${a}² = ${C2} − ${A2} = ${B2}`]); }
    else if (mode === 'Lf') { if (P1.v <= 0) return fail('The length 2a must be positive.'); const a = P1.div(2); if (a.v >= c.v) return fail(`For a hyperbola c &gt; a, but here c = ${c} and a = ${a}.`); A2 = sq(a); B2 = C2.sub(A2); steps.push(['Read a and c', `2a = ${P1} so a = ${a}; focus ${ptS(P2)} gives c = ${c}`], ['b² = c² − a²', `b² = ${c}² − ${a}² = ${C2} − ${A2} = ${B2}`]); }
    else if (mode === 'fc') { const e2 = onAxis(P2, 'co-vertex'); if (e2) return fail(e2); if (axisOf(P2) === axisOf(P1)) return fail('The focus is on the transverse axis and the co-vertex is on the conjugate axis, so they must be on different coordinate axes.'); const b = along(P2); if (b.v >= c.v) return fail(`For a hyperbola c &gt; b, but here c = ${c} and b = ${b}.`); B2 = sq(b); A2 = C2.sub(B2); steps.push(['Read b and c', `co-vertex ${ptS(P2)} gives b = ${b}; focus ${ptS(P1)} gives c = ${c}`], ['a² = c² − b²', `a² = ${C2} − ${B2} = ${A2}`]); }
    else { const m = fabs(P2), m2 = sq(m); if (m.n === 0) return fail('The slope of an asymptote cannot be 0.'); const k = C2.div(one.add(m2));
      if (vertical) { B2 = k; A2 = m2.mul(k); steps.push(['Read c and the slope', `focus ${ptS(P1)}: c = ${c} on the y-axis, so the asymptotes are y = ±(a/b)x and a/b = ${m}, so a = ${mc(m)}b`], ['c² = a² + b²', `${C2} = ${mc(m2)}b² + b² = ${mc(one.add(m2))}b², so b² = ${B2}`], ['a²', `a² = ${mc(m2)}b² = ${m2} · ${B2} = ${A2}`]); }
      else { A2 = k; B2 = m2.mul(k); steps.push(['Read c and the slope', `focus ${ptS(P1)}: c = ${c} on the x-axis, so the asymptotes are y = ±(b/a)x and b/a = ${m}, so b = ${mc(m)}a`], ['c² = a² + b²', `${C2} = a² + ${mc(m2)}a² = ${mc(one.add(m2))}a², so a² = ${A2}`], ['b²', `b² = ${mc(m2)}a² = ${m2} · ${A2} = ${B2}`]); } }
    steps.unshift(['Transverse axis', `the focus is on the ${vertical ? 'y' : 'x'}-axis`]);
  } else {
    const nm = mode === 'cp' ? 'co-vertex' : 'vertex', e = onAxis(P1, nm); if (e) return fail(e);
    const k = along(P1), K2 = sq(k), ax = axisOf(P1); vertical = mode === 'cp' ? ax === 'x' : ax === 'y';
    const u = vertical ? P2[1] : P2[0], w = vertical ? P2[0] : P2[1], U2 = sq(u), W2 = sq(w), uu = vertical ? 'y' : 'x', ww = vertical ? 'x' : 'y';
    if (mode === 'cp') {
      B2 = K2; steps.push(['Read b', `co-vertex ${ptS(P1)} gives b = ${k}; the conjugate axis is on the ${ax}-axis, so the transverse axis is on the ${uu}-axis`], ['Form', `${uu}²/a² − ${ww}²/${dn(B2)} = 1`]);
      if (U2.n === 0) return fail(`The point ${ptS(P2)} cannot be on this hyperbola: its ${uu}-coordinate cannot be 0.`, steps);
      const rhs = one.add(W2.div(B2)); A2 = U2.div(rhs); steps.push(['Substitute the point', `${U2}/a² − ${W2}/${dn(B2)} = 1 ⟹ ${U2}/a² = ${rhs} ⟹ a² = ${A2}`]);
    } else {
      A2 = K2; steps.push(['Read a', `vertex ${ptS(P1)} gives a = ${k} on the ${uu}-axis`], ['Form', `${uu}²/${dn(A2)} − ${ww}²/b² = 1`]);
      const rhs = U2.div(A2).sub(one);
      if (rhs.v <= 0 || W2.n === 0) return fail(`The point ${ptS(P2)} cannot be on this hyperbola: every point on it has |${uu}| &gt; a = ${k} (or is a vertex, where ${ww} = 0), so no value of b works.`, steps);
      B2 = W2.div(rhs); steps.push(['Substitute the point', `${U2}/${dn(A2)} − ${W2}/b² = 1 ⟹ ${W2}/b² = ${rhs} ⟹ b² = ${B2}`]);
    }
  }
  const H = hyp(vertical, A2, B2);
  steps.push(['Asymptotes', `y = ±(${vertical ? 'a/b' : 'b/a'})x: ${slopeEq(H.slope)}`], ['Equation', CA.conicEq('hyperbola', vertical, A2, B2, false)]);
  return Object.assign(H, {steps, given: [P1, P2]});
}
CA.lab('build-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: '0', options: PRE.map((p, i) => [String(i), p[3]]).concat([['own', 'Set your own']])}, {type: 'select', key: 'mode', label: 'Given', value: 'fv', options: Object.entries(MODES).map(([k, m]) => [k, m[0]])}, {type: 'text', key: 'g1', label: 'First', value: '(-6, 0)'}, {type: 'text', key: 'g2', label: 'Second', value: '(4, 0)'}],
  top: '<p class="ca-note" id="build-what"></p><div class="ca-equation" id="build-eq"></div>', plot: {w: 560, h: 460}, plotLabel: 'The hyperbola described by the given features', legend: LEG.concat([['blue', 'given point']]),
  readouts: [['abc', 'a, b, c'], ['v', 'Vertices'], ['f', 'Foci'], ['asy', 'Asymptotes']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = PRE[+st.pre]; st.set('mode', p[0], true); st.set('g1', p[1], true); st.set('g2', p[2], true); } else if (key && key !== 'pre') st.set('pre', 'own', true);
  const M = MODES[st.mode]; $('build-what').innerHTML = `<b>First:</b> ${M[1].toLowerCase()} · <b>Second:</b> ${M[2].toLowerCase()}`;
  const S = solve(st.mode, st.g1, st.g2);
  if (S.err) { lab.plane({xmin: -6, xmax: 6, ymin: -5, ymax: 5}).render(); $('build-eq').innerHTML = '—'; ['abc', 'v', 'f', 'asy'].forEach(k => lab.read(k, '—')); lab.steps(S.steps || []); lab.out(S.err, 'ca-incorrect'); return; }
  const P = lab.plane(winH(S)); drawH(P, S);
  if (st.mode === 'cp' || st.mode === 'vp') { const g = S.given[1]; P.point(g[0].v, g[1].v, {color: 'blue', r: 7, label: ptS(g)}); }
  P.render();
  const Lx = lists(S); $('build-eq').innerHTML = CA.conicEq('hyperbola', S.vertical, S.A2, S.B2);
  lab.read('abc', `a = ${S.ra}, b = ${S.rb}, c = ${S.rc}`); lab.read('v', Lx.v); lab.read('f', Lx.f); lab.read('asy', slopeEq(S.slope));
  lab.steps(S.steps);
  lab.out(`Transverse axis along the <b>${S.vertical ? 'y' : 'x'}-axis</b>: <b>${CA.conicEq('hyperbola', S.vertical, S.A2, S.B2, false)}</b>, asymptotes ${slopeEq(S.slope)}.`, 'ca-correct');
});

/* ---------- 03 · equation → features ---------- */
const RPRE = [['x', '16', '20', 'x²/16 − y²/20 = 1'], ['y', '8', '8', 'y²/8 − x²/8 = 1'], ['x', '30', '20', 'x²/30 − y²/20 = 1'], ['x', '25', '40', 'x²/25 − y²/40 = 1'], ['y', '9', '49', 'y²/9 − x²/49 = 1']];
CA.lab('read-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Equation', value: '0', options: RPRE.map((p, i) => [String(i), p[3]]).concat([['own', 'Set your own']])}, {type: 'seg', key: 'pos', label: 'Positive term', value: 'x', options: [['x', 'x²'], ['y', 'y²']]}, {type: 'text', key: 'A', label: 'Under the positive term', value: '16'}, {type: 'text', key: 'B', label: 'Under the negative term', value: '20'}],
  top: '<div class="ca-equation" id="read-eq"></div>', plot: {w: 560, h: 460}, plotLabel: 'Graph of the hyperbola with its central rectangle and asymptotes', legend: LEG,
  readouts: [['abc', 'a, b, c'], ['v', 'Vertices'], ['cv', 'Co-vertices'], ['f', 'Foci'], ['asy', 'Asymptotes'], ['len', 'Transverse axis length']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = RPRE[+st.pre]; st.set('pos', p[0], true); st.set('A', p[1], true); st.set('B', p[2], true); } else if (key && key !== 'pre') st.set('pre', 'own', true);
  const A2 = CA.parseFrac(st.A), B2 = CA.parseFrac(st.B);
  if (!A2 || !B2 || A2.v <= 0 || B2.v <= 0) { lab.plane({xmin: -6, xmax: 6, ymin: -5, ymax: 5}).render(); $('read-eq').innerHTML = '—'; ['abc', 'v', 'cv', 'f', 'asy', 'len'].forEach(k => lab.read(k, '—')); lab.steps([]); lab.out('Both denominators must be positive numbers, such as 16 or 9/4.', 'ca-incorrect'); return; }
  const H = hyp(st.pos === 'y', A2, B2), Lx = lists(H), u = st.pos, w = u === 'x' ? 'y' : 'x';
  drawH(lab.plane(winH(H)), H).render();
  $('read-eq').innerHTML = CA.conicEq('hyperbola', H.vertical, A2, B2);
  lab.read('abc', `a = ${H.ra}, b = ${H.rb}, c = ${H.rc}`); lab.read('v', Lx.v); lab.read('cv', Lx.cv); lab.read('f', Lx.f); lab.read('asy', slopeEq(H.slope)); lab.read('len', `2a = ${CA.sqrtF(A2).mul(2).str()}`);
  lab.steps([['Positive term', `${u}² is positive, so the transverse axis is along the ${u}-axis: a² = ${A2}, b² = ${B2}${A2.v < B2.v ? ' (a² is the smaller number here, and that is fine)' : ''}`], ['Square roots', `a = ${H.ra}, b = ${H.rb}`], ['c² = a² + b²', `c² = ${A2} + ${B2} = ${H.C2}, so c = ${H.rc}`],
    ['Asymptotes', `slope ${H.vertical ? 'a/b' : 'b/a'} = ${ratio(H.vertical ? H.ra : H.rb, H.vertical ? H.rb : H.ra, H.slope.str())}: ${slopeEq(H.slope)}`], ['Features', `vertices ${Lx.v}, co-vertices ${Lx.cv}, foci ${Lx.f}`]]);
  lab.out(`Transverse axis along the <b>${u}-axis</b>: vertices ${Lx.v}, foci ${Lx.f}, asymptotes ${slopeEq(H.slope)}.`, 'ca-correct');
});
const O = ['ellipse · x-axis', 'ellipse · y-axis', 'hyperbola · x-axis', 'hyperbola · y-axis'];
CA.cards('type-cards', [
  {expr: 'x²/16 − y²/20 = 1', correct: 2, why: 'A minus sign makes it a hyperbola; x² is the positive term.'},
  {expr: 'y²/8 − x²/8 = 1', correct: 3, why: 'Hyperbola with y² positive, so the vertices are (0, ±2√2).'},
  {expr: 'x²/9 + y²/16 = 1', correct: 1, why: 'A plus sign makes it an ellipse; the larger denominator 16 is under y².'},
  {expr: 'x²/4 − y²/25 = 1', correct: 2, why: 'Hyperbola with x² positive. a² = 4 even though 25 is larger.'},
  {expr: 'y²/9 − x²/49 = 1', correct: 3, why: 'Hyperbola with y² positive: vertices (0, ±3).'},
  {expr: 'x²/30 + y²/20 = 1', correct: 0, why: 'Ellipse; the larger denominator 30 is under x².'}
], {options: O});

/* ---------- guided problems ---------- */
CA.guided('102', [
  {q: 'A hyperbola has a = 3 and b = 4. What is c?', opts: ['5', '√7', '7', '25'], correct: 0, hint: 'For a hyperbola, c² = a² + b².', why: 'c² = 9 + 16 = 25, so c = 5.', ref: {panel: 'definition', what: 'c² = a² + b²', body: '<p>Use <b>c² = a² + b²</b>: the half-diagonal of the central rectangle.</p>'}},
  {q: 'A hyperbola has vertices (±5, 0). For every point P on it, |PF₁ − PF₂| = ?', opts: ['10', '5', '25', 'it depends on P'], correct: 0, hint: 'The constant difference is 2a.', why: 'a = 5, so the difference is 2a = 10.'},
  {q: 'Center (0, 0), focus (−5, 0), vertex (3, 0). The equation is:', opts: ['x²/9 − y²/16 = 1', 'x²/16 − y²/9 = 1', 'x²/9 − y²/34 = 1', 'y²/9 − x²/16 = 1'], correct: 0, hint: 'a = 3, c = 5, b² = c² − a².', why: 'b² = 25 − 9 = 16 and the transverse axis is horizontal.', ref: {panel: 'build', what: 'the focus-and-vertex problem', body: '<p>Center at the origin, focus at <b>(−6, 0)</b>, vertex at <b>(4, 0)</b>.</p>'}},
  {q: 'Center (0, 0), transverse axis of length 12, focus (0, 10). The equation is:', opts: ['y²/36 − x²/64 = 1', 'x²/36 − y²/64 = 1', 'y²/64 − x²/36 = 1', 'y²/36 − x²/136 = 1'], correct: 0, hint: 'a = 6, c = 10, and the focus is on the y-axis.', why: 'b² = 100 − 36 = 64, and y² is the positive term.', ref: {panel: 'build', what: 'the transverse-axis-and-focus problem', body: '<p>Center at the origin, length of the transverse axis <b>16</b>, focus at <b>(0, 11)</b>.</p>'}},
  {q: 'The asymptotes of x²/16 − y²/20 = 1 are:', opts: ['y = ±(√5/2)x', 'y = ±(2√5/5)x', 'y = ±(5/4)x', 'y = ±(4/5)x'], correct: 0, hint: 'Slope b/a with a = 4 and b = 2√5.', why: '2√5/4 = √5/2.', ref: {panel: 'read', what: 'the hyperbola x²/16 − y²/20 = 1', body: '<p>Find the features of <b>x²/16 − y²/20 = 1</b>.</p>'}},
  {q: 'The foci of y²/8 − x²/8 = 1 are:', opts: ['(0, ±4)', '(±4, 0)', '(0, ±2√2)', '(0, ±16)'], correct: 0, hint: 'c² = 8 + 8.', why: 'c = 4, and y² is positive, so the foci are on the y-axis.', ref: {panel: 'read', what: 'the hyperbola y²/8 − x²/8 = 1', body: '<p>Find the features of <b>y²/8 − x²/8 = 1</b>.</p>'}},
  {q: 'Which hyperbola opens up and down?', opts: ['y²/4 − x²/25 = 1', 'x²/4 − y²/25 = 1', 'x²/25 − y²/4 = 1', 'x²/25 + y²/4 = 1'], correct: 0, hint: 'Look for the positive y² term.', why: 'With y² positive, the vertices (0, ±2) are on the y-axis and the branches open up and down.'},
  {q: 'Center (0, 0), focus (5, 0), asymptote y = (1/2)x. The equation is:', opts: ['x²/20 − y²/5 = 1', 'x²/5 − y²/20 = 1', 'x²/4 − y²/1 = 1', 'y²/20 − x²/5 = 1'], correct: 0, hint: 'b/a = 1/2, so a = 2b; then 25 = a² + b².', why: '25 = 5b² gives b² = 5 and a² = 20.', ref: {panel: 'build', what: 'the focus-and-asymptote problem', body: '<p>Center at the origin, focus at <b>(5, 0)</b>, asymptote <b>y = (1/2)x</b>.</p>'}},
  {q: 'The vertices of x²/4 − y²/25 = 1 are:', opts: ['(±2, 0)', '(0, ±5)', '(±5, 0)', '(±√29, 0)'], correct: 0, hint: 'a² is under the positive term.', why: 'a² = 4, so a = 2 on the x-axis.'},
  {q: 'Center (0, 0), co-vertex (0, 2), point (2, −3) on the graph. Then a² = ?', opts: ['16/13', '4/13', '13/16', '4'], correct: 0, hint: '4/a² − 9/4 = 1.', why: '4/a² = 13/4, so a² = 16/13.', ref: {panel: 'build', what: 'the co-vertex-and-point problem', body: '<p>Center at the origin, co-vertex at <b>(0, 2)</b>, point on graph <b>(2, −3)</b>.</p>'}}
]);
})();
