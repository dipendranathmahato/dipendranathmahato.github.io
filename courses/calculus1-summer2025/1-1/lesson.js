/* Section 1.1 · Review of Functions — interactive activities */
(() => {
'use strict';
const {fmt, num} = CA;
const $ = id => document.getElementById(id);
const INF = 1e9;

/* ---------- 01 · mapping diagrams ---------- */
const MAPS = [
  {t: 'f(x) = x² on {−2, −1, 1, 2}', ins: [-2, -1, 1, 2], outs: [1, 4], arrows: [[0, 1], [1, 0], [2, 0], [3, 1]], fn: true,
   why: 'Every input has exactly one arrow. Two inputs share an output (f(1) = f(−1) = 1), which is allowed.', range: '{1, 4}'},
  {t: '{(1, 3), (2, 5), (3, 7)}', ins: [1, 2, 3], outs: [3, 5, 7], arrows: [[0, 0], [1, 1], [2, 2]], fn: true, why: 'Each input has one output, and no two inputs share one.', range: '{3, 5, 7}'},
  {t: '{(1, 3), (1, 5), (2, 7)}', ins: [1, 2], outs: [3, 5, 7], arrows: [[0, 0], [0, 1], [1, 2]], fn: false, why: 'The input 1 has <b>two</b> outputs, 3 and 5. A function cannot do that.', range: '—'},
  {t: 'Domain {1, 2, 3}, codomain {1, 4, 9, 16}', ins: [1, 2, 3], outs: [1, 4, 9, 16], arrows: [[0, 0], [1, 1], [2, 2]], fn: true,
   why: 'A function. 16 is in the codomain but no input reaches it, so the range {1, 4, 9} is smaller than the codomain.', range: '{1, 4, 9}'},
  {t: 'Inputs {1, 2, 3}, but 2 has no arrow', ins: [1, 2, 3], outs: [4, 9], arrows: [[0, 0], [2, 1]], fn: false, why: 'The input 2 has no output, so this is not a function with domain {1, 2, 3}.', range: '—'}
];
CA.lab('map-lab', {
  controls: [{type: 'select', key: 'm', label: 'Relation', value: '0', options: MAPS.map((m, i) => [String(i), m.t])}],
  plot: true, plotLabel: 'Mapping diagram from inputs to outputs', readouts: [['fn', 'Function?'], ['d', 'Domain'], ['r', 'Range']]
}, (lab, st) => {
  const M = MAPS[+st.m], svg = lab.svg, W = 600, H = 300, yIn = i => 60 + i * (180 / Math.max(1, M.ins.length - 1 || 1)), yOut = i => 60 + i * (180 / Math.max(1, M.outs.length - 1 || 1));
  const ys = (arr, f) => arr.map((_, i) => arr.length === 1 ? 150 : f(i));
  const yi = ys(M.ins, yIn), yo = ys(M.outs, yOut), bad = new Set(), cnt = {};
  M.arrows.forEach(([a]) => { cnt[a] = (cnt[a] || 0) + 1; }); Object.keys(cnt).forEach(k => { if (cnt[k] > 1) bad.add(+k); });
  let s = `<defs><marker id="map-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="context-stroke"/></marker></defs>`;
  s += `<ellipse cx="140" cy="150" rx="70" ry="125" fill="var(--cp-orange)" fill-opacity=".08" stroke="var(--cp-orange)" stroke-width="2"/><ellipse cx="460" cy="150" rx="70" ry="125" fill="var(--cp-green)" fill-opacity=".08" stroke="var(--cp-green)" stroke-width="2"/>`;
  s += `<text x="140" y="16" text-anchor="middle" font-weight="800" fill="var(--cp-orange)">inputs</text><text x="460" y="16" text-anchor="middle" font-weight="800" fill="var(--cp-green)">outputs</text>`;
  M.arrows.forEach(([a, b]) => { const c = bad.has(a) ? 'var(--cp-red, #c8372b)' : 'var(--cp-blue)'; s += `<path d="M168 ${yi[a]} C 300 ${yi[a]}, 300 ${yo[b]}, 430 ${yo[b]}" fill="none" stroke="${c}" stroke-width="2.6" marker-end="url(#map-arr)"/>`; });
  M.ins.forEach((v, i) => { const lone = !M.arrows.some(([a]) => a === i); s += `<circle cx="140" cy="${yi[i]}" r="18" fill="var(--cp-bg)" stroke="${lone || bad.has(i) ? '#c8372b' : 'var(--cp-orange)'}" stroke-width="2.5"/><text x="140" y="${yi[i] + 5}" text-anchor="middle" font-weight="800" fill="var(--cp-text)">${fmt(v)}</text>`; });
  M.outs.forEach((v, i) => { const used = M.arrows.some(([, b]) => b === i); s += `<circle cx="460" cy="${yo[i]}" r="18" fill="var(--cp-bg)" stroke="var(--cp-green)" stroke-width="2.5" ${used ? '' : 'stroke-dasharray="4 4"'}/><text x="460" y="${yo[i] + 5}" text-anchor="middle" font-weight="800" fill="var(--cp-text)">${fmt(v)}</text>`; });
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.classList.add('ca-plot'); svg.innerHTML = s;
  lab.read('fn', M.fn ? '<span class="ca-ok">Yes</span>' : '<span class="ca-bad">No</span>'); lab.read('d', `{${M.ins.map(fmt).join(', ')}}`); lab.read('r', M.range);
  lab.out(M.why, M.fn ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 02 · domain and range ---------- */
const DOM = [
  {t: 'f(x) = 3/(x² − 1)', holes: [[-1, false], [1, false]], f: x => 3 / (x * x - 1), brk: [-1, 1], win: {xmin: -5, xmax: 5, ymin: -7, ymax: 7}, dom: [[-INF, -1], [-1, 1], [1, INF]], ran: [[-INF, -3], [0, INF]],
   sb: '{x | x² − 1 ≠ 0} = {x | x ≠ ±1}', iv: '(−∞, −1) ∪ (−1, 1) ∪ (1, ∞)', rg: '(−∞, −3] ∪ (0, ∞)',
   steps: [['Denominator', 'x² − 1 = 0 when x = ±1, so exclude ±1'], ['Range', 'for −1 &lt; x &lt; 1, x² − 1 is in [−1, 0), so f(x) ≤ −3; for |x| &gt; 1, x² − 1 &gt; 0, so f(x) &gt; 0']]},
  {t: 'f(x) = (2x + 5)/(3x² + 4)', f: x => (2 * x + 5) / (3 * x * x + 4), win: {xmin: -8, xmax: 8, ymin: -1.5, ymax: 2.5}, dom: [[-INF, INF]], ran: [[(15 - Math.sqrt(273)) / 24, (15 + Math.sqrt(273)) / 24]],
   sb: '{x | x is any real number}', iv: '(−∞, ∞)', rg: '≈ [−0.063, 1.313] (read from the graph)',
   steps: [['Denominator', 'x² ≥ 0 for all real x, so 3x² + 4 ≥ 4 &gt; 0: never zero'], ['Domain', 'all real numbers']]},
  {t: 'f(x) = √(4 − 3x)', holes: [[4 / 3, true]], f: x => Math.sqrt(4 - 3 * x), win: {xmin: -6, xmax: 4, ymin: -1, ymax: 5.5}, dom: [[-INF, 4 / 3]], ran: [[0, INF]], sb: '{x | 4 − 3x ≥ 0} = {x | x ≤ 4/3}', iv: '(−∞, 4/3]', rg: '[0, ∞)',
   steps: [['Square root', 'need 4 − 3x ≥ 0'], ['Solve', '4 ≥ 3x, so x ≤ 4/3'], ['Range', 'a square root is never negative and takes every value ≥ 0']]},
  {t: 'f(x) = x² − 4', f: x => x * x - 4, win: {xmin: -5, xmax: 5, ymin: -5, ymax: 8}, dom: [[-INF, INF]], ran: [[-4, INF]], sb: 'ℝ', iv: '(−∞, ∞)', rg: '[−4, ∞)',
   steps: [['Domain', 'a polynomial is defined for every x'], ['Range', 'x² ≥ 0, so x² − 4 ≥ −4, with −4 reached at x = 0']]},
  {t: 'g(x) = √(x² − 4)', holes: [[-2, true], [2, true]], f: x => Math.sqrt(x * x - 4), win: {xmin: -6, xmax: 6, ymin: -1, ymax: 6}, dom: [[-INF, -2], [2, INF]], ran: [[0, INF]], sb: '{x | x² ≥ 4} = {x | x ≤ −2 or x ≥ 2}', iv: '(−∞, −2] ∪ [2, ∞)', rg: '[0, ∞)',
   steps: [['Square root', 'need x² − 4 ≥ 0, so x² ≥ 4'], ['Solve', 'x ≤ −2 or x ≥ 2'], ['Range', 'g(±2) = 0 and g grows without bound']]},
  {t: 'f(x) = √(x + 3) + 1', holes: [[-3, true]], f: x => Math.sqrt(x + 3) + 1, win: {xmin: -4, xmax: 8, ymin: -1, ymax: 5}, dom: [[-3, INF]], ran: [[1, INF]], sb: '{x | x ≥ −3}', iv: '[−3, ∞)', rg: '[1, ∞)',
   steps: [['Square root', 'x + 3 ≥ 0, so x ≥ −3'], ['Range', '√(x + 3) ≥ 0, so f(x) ≥ 1']]},
  {t: 'f(x) = (3x − 1)/(5x + 2)', holes: [[-0.4, false]], f: x => (3 * x - 1) / (5 * x + 2), brk: [-0.4], win: {xmin: -4, xmax: 4, ymin: -4, ymax: 5}, dom: [[-INF, -0.4], [-0.4, INF]], ran: [[-INF, 0.6], [0.6, INF]], sb: '{x | x ≠ −2/5}', iv: '(−∞, −2/5) ∪ (−2/5, ∞)', rg: '(−∞, 3/5) ∪ (3/5, ∞)',
   steps: [['Denominator', '5x + 2 = 0 at x = −2/5'], ['Range', 'solving y = (3x − 1)/(5x + 2) for x gives x = (2y + 1)/(3 − 5y), which needs y ≠ 3/5']]},
  {t: 'f(x) = √(4 − x²)', holes: [[-2, true], [2, true]], f: x => Math.sqrt(4 - x * x), win: {xmin: -3.5, xmax: 3.5, ymin: -1, ymax: 3}, dom: [[-2, 2]], ran: [[0, 2]], sb: '{x | −2 ≤ x ≤ 2}', iv: '[−2, 2]', rg: '[0, 2]',
   steps: [['Square root', '4 − x² ≥ 0, so x² ≤ 4 and −2 ≤ x ≤ 2'], ['Range', 'the largest value is f(0) = 2 and the smallest is f(±2) = 0']]}
];
CA.lab('dom-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: DOM.map((d, i) => [String(i), d.t])}],
  plot: {w: 560, h: 380}, plotLabel: 'Graph with the domain and range highlighted', legend: [['orange', 'domain (x-axis)'], ['green', 'range (y-axis)']],
  readouts: [['sb', 'Domain · set-builder'], ['iv', 'Domain · interval'], ['rg', 'Range']], steps: true
}, (lab, st) => {
  const D = DOM[+st.p], P = lab.plane(D.win);
  D.dom.forEach(([a, b]) => P.band('x', a, b, {color: 'orange'})); D.ran.forEach(([a, b]) => P.band('y', a, b, {color: 'green'}));
  (D.holes || []).forEach(([x, filled]) => P.point(x, 0, {color: 'orange', r: 6, filled}));
  P.curve(D.f, {color: 'blue', width: 3.2, breaks: D.brk || []});
  (D.brk || []).forEach(k => P.vline(k, {color: 'gray', width: 1.4}));
  P.render();
  lab.read('sb', D.sb); lab.read('iv', D.iv); lab.read('rg', D.rg); lab.steps(D.steps);
  lab.out(`Domain ${D.iv}; range ${D.rg}.`, 'ca-correct');
});

/* interval builder */
const ivl = CA.lab('int-lab', {
  controls: [{type: 'select', key: 'l', label: 'Left end', value: 'c', options: [['c', 'included [ '], ['o', 'not included ( '], ['inf', '−∞']]}, {type: 'number', key: 'a', label: 'a =', value: -2, step: 1},
    {type: 'number', key: 'b', label: 'b =', value: 5, step: 1}, {type: 'select', key: 'r', label: 'Right end', value: 'o', options: [['o', ') not included'], ['c', '] included'], ['inf', '∞']]}],
  top: '<svg class="ca-plot" id="int-line" role="img" aria-label="Number line"></svg>', readouts: [['sb', 'Set-builder'], ['iv', 'Interval'], ['in', 'Inequality']]
}, (lab, st) => {
  const L = st.l === 'inf', Rr = st.r === 'inf', a = st.a, b = st.b;
  if (!L && !Rr && !(a < b)) { lab.out('Choose a &lt; b.', 'ca-incorrect'); return; }
  const lo = L ? Math.min(-10, b - 6) : a, hi = Rr ? Math.max(10, a + 6) : b, mn = Math.floor(Math.min(lo, hi) - 2), mx = Math.ceil(Math.max(lo, hi) + 2);
  CA.numberLine('int-line', {min: L ? (Rr ? -10 : Math.min(-10, b - 8)) : Math.min(a - 3, Rr ? a - 3 : a - 3), max: Rr ? (L ? 10 : Math.max(10, a + 8)) : b + 3, step: 1,
    segments: [{a: L ? null : a, b: Rr ? null : b, ac: st.l === 'c', bc: st.r === 'c', color: 'orange'}]});
  const sa = fmt(a), sb = fmt(b);
  const ineq = L && Rr ? 'x is any real number' : L ? `x ${st.r === 'c' ? '≤' : '&lt;'} ${sb}` : Rr ? `x ${st.l === 'c' ? '≥' : '&gt;'} ${sa}` : `${sa} ${st.l === 'c' ? '≤' : '&lt;'} x ${st.r === 'c' ? '≤' : '&lt;'} ${sb}`;
  const iv = `${L ? '(−∞' : (st.l === 'c' ? '[' : '(') + sa}, ${Rr ? '∞)' : sb + (st.r === 'c' ? ']' : ')')}`;
  lab.read('sb', `{x | ${ineq}}`); lab.read('iv', iv); lab.read('in', ineq);
  lab.out(L || Rr ? 'An infinite end always gets a parenthesis: ∞ is not a number, so it cannot be included.' : `A bracket means the endpoint is included (filled dot); a parenthesis means it is not (open dot).`);
});

/* ---------- 03 · evaluating ---------- */
const f = x => x * x + 4 * x + 3;
const SYM = {
  a: ['(a)² + 4(a) + 3', 'a² + 4a + 3'], 'b+1': ['(b + 1)² + 4(b + 1) + 3', '(b² + 2b + 1) + (4b + 4) + 3 = b² + 6b + 8'], 'x+h': ['(x + h)² + 4(x + h) + 3', 'x² + 2xh + h² + 4x + 4h + 3'],
  '-x': ['(−x)² + 4(−x) + 3', 'x² − 4x + 3'], '2a': ['(2a)² + 4(2a) + 3', '4a² + 8a + 3']
};
CA.lab('eval-lab', {
  controls: [{type: 'select', key: 'in', label: 'Input', value: '1', options: [['1', 'x = 1'], ['-2', 'x = −2'], ['-3', 'x = −3'], ['0', 'x = 0'], ['a', 'x = a'], ['b+1', 'x = b + 1'], ['x+h', 'x = x + h'], ['-x', 'x = −x'], ['2a', 'x = 2a'], ['own', 'a number of your own']]},
    {type: 'number', key: 'c', label: 'Your number', value: 1.5, step: 0.5}],
  plot: {xmin: -6, xmax: 3, ymin: -2, ymax: 9, w: 520, h: 360}, plotLabel: 'Graph of f(x) = x² + 4x + 3', steps: true
}, (lab, st) => {
  const P = lab.plane(); P.curve(f, {color: 'blue', width: 3.2});
  const sym = SYM[st.in];
  if (sym) { P.render(); lab.steps([['Replace x', `f(${st.in.replace('-', '−').replace('+', ' + ')}) = ${sym[0]}`], ['Simplify', sym[1]]]); lab.out(`f(${st.in.replace('-', '−').replace('+', ' + ')}) = <b>${sym[1].split(' = ').pop()}</b>. A letter input gives an expression, not a number.`, 'ca-correct'); return; }
  const c = st.in === 'own' ? st.c : +st.in, y = f(c), cs = c < 0 ? `(${fmt(c)})` : `(${fmt(c)})`;
  P.seg(c, 0, c, y, {color: 'orange', dash: true}).seg(0, y, c, y, {color: 'orange', dash: true}).point(c, y, {color: 'orange', r: 7, label: `(${fmt(c)}, ${num(y, 4)})`}).render();
  lab.steps([['Replace x', `f(${fmt(c)}) = ${cs}² + 4${cs} + 3`], ['Simplify', `= ${num(c * c, 4)} + ${num(4 * c, 4).replace('-', '−')} + 3 = ${num(y, 4)}`]]);
  lab.out(`f(${fmt(c)}) = <b>${num(y, 4)}</b>: the point (${fmt(c)}, ${num(y, 4)}) is on the graph.`, 'ca-correct');
});

/* ---------- 04 · piecewise ---------- */
const PW = [
  {t: 'f(x) = −x (x &lt; 4); 0 (x = 4); x² (x &gt; 4)', win: {xmin: -3, xmax: 6.5, ymin: -5, ymax: 40}, pieces: [
    {f: x => -x, a: -10, b: 4, ac: false, bc: false, s: '−x', cond: x => x < 4, cs: 'x &lt; 4'}, {pt: [4, 0], s: '0', cond: x => x === 4, cs: 'x = 4'}, {f: x => x * x, a: 4, b: 10, ac: false, bc: false, s: 'x²', cond: x => x > 4, cs: 'x &gt; 4'}]},
  {t: 'f(x) = x + 3 (x &lt; 1); (x − 2)² (x ≥ 1)', win: {xmin: -5, xmax: 5, ymin: -2, ymax: 8}, pieces: [
    {f: x => x + 3, a: -10, b: 1, bc: false, s: 'x + 3', cond: x => x < 1, cs: 'x &lt; 1'}, {f: x => (x - 2) ** 2, a: 1, b: 10, ac: true, s: '(x − 2)²', cond: x => x >= 1, cs: 'x ≥ 1'}]},
  {t: '|x| = −x (x &lt; 0); x (x ≥ 0)', win: {xmin: -5, xmax: 5, ymin: -2, ymax: 6}, pieces: [
    {f: x => -x, a: -10, b: 0, bc: false, s: '−x', cond: x => x < 0, cs: 'x &lt; 0'}, {f: x => x, a: 0, b: 10, ac: true, s: 'x', cond: x => x >= 0, cs: 'x ≥ 0'}]}
];
CA.lab('pw-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: PW.map((p, i) => [String(i), p.t])}, {type: 'range', key: 'x', label: 'x =', min: -3, max: 6, step: 0.5, value: 4}],
  plot: {w: 560, h: 400}, plotLabel: 'Graph of a piecewise function', readouts: [['piece', 'Piece used'], ['v', 'Value']], steps: true
}, (lab, st) => {
  const W = PW[+st.p], P = lab.plane(W.win), x = st.x;
  const k = W.pieces.findIndex(q => q.cond(x)), q = W.pieces[k];
  W.pieces.forEach((pc, i) => {
    const c = i === k ? 'orange' : 'blue';
    if (pc.pt) { P.point(pc.pt[0], pc.pt[1], {color: c, r: 6}); return; }
    P.curve(pc.f, {color: c, width: i === k ? 4 : 3, from: pc.a, to: pc.b});
    if (pc.a > -10) P.point(pc.a, pc.f(pc.a), {color: c, r: 6, filled: !!pc.ac});
    if (pc.b < 10) P.point(pc.b, pc.f(pc.b), {color: c, r: 6, filled: !!pc.bc});
  });
  const y = q.pt ? q.pt[1] : q.f(x);
  P.vline(x, {color: 'gray', width: 1.4}).point(x, y, {color: 'green', r: 8, label: `(${fmt(x)}, ${fmt(y)})`}).render();
  lab.read('piece', `${q.s} (because ${q.cs})`); lab.read('v', `f(${fmt(x)}) = ${fmt(y)}`);
  lab.steps([['Which piece?', `x = ${fmt(x)} satisfies ${q.cs}`], ['Evaluate', q.pt ? `f(${fmt(x)}) = ${q.s}` : `f(${fmt(x)}) = ${q.s.replace(/x/g, `(${fmt(x)})`)} = ${fmt(y)}`]]);
  lab.out('An open dot is an endpoint the piece does not include; a filled dot is included. Exactly one rule applies at each x, so the graph passes the vertical line test.');
});

/* vertical line test */
const VL = [
  {t: 'y = x²', fn: true, ys: x => [x * x], draw: P => P.curve(x => x * x, {color: 'blue', width: 3.2})},
  {t: 'y = x³ − 3x', fn: true, ys: x => [x ** 3 - 3 * x], draw: P => P.curve(x => x ** 3 - 3 * x, {color: 'blue', width: 3.2})},
  {t: 'x² + y² = 9 (circle)', fn: false, ys: x => Math.abs(x) <= 3 ? (Math.abs(x) === 3 ? [0] : [Math.sqrt(9 - x * x), -Math.sqrt(9 - x * x)]) : [], draw: P => P.param(t => 3 * Math.cos(t), t => 3 * Math.sin(t), 0, 2 * Math.PI, {color: 'blue', width: 3.2})},
  {t: 'x = y² (sideways parabola)', fn: false, ys: x => x < 0 ? [] : x === 0 ? [0] : [Math.sqrt(x), -Math.sqrt(x)], draw: P => P.param(t => t * t, t => t, -4, 4, {color: 'blue', width: 3.2})},
  {t: 'x = y³ − 3y (an S-curve)', fn: false, ys: x => { const out = []; for (let i = 0; i < 4000; i++) { const y0 = -3 + 6 * i / 4000, y1 = y0 + 6 / 4000, g0 = y0 ** 3 - 3 * y0 - x, g1 = y1 ** 3 - 3 * y1 - x; if (g0 === 0 || g0 * g1 < 0) out.push((y0 + y1) / 2); } return out; }, draw: P => P.param(t => t ** 3 - 3 * t, t => t, -2.6, 2.6, {color: 'blue', width: 3.2})}
];
CA.lab('vlt-lab', {
  controls: [{type: 'select', key: 'p', label: 'Graph', value: '2', options: VL.map((v, i) => [String(i), v.t])}, {type: 'range', key: 'x', label: 'Vertical line x =', min: -4, max: 4, step: 0.1, value: 1}],
  plot: {xmin: -5, xmax: 5, ymin: -5, ymax: 5, w: 480, h: 440}, plotLabel: 'Vertical line test', readouts: [['n', 'Points on the line'], ['fn', 'Function of x?']]
}, (lab, st) => {
  const V = VL[+st.p], P = lab.plane(), ys = V.ys(st.x);
  V.draw(P); P.vline(st.x, {color: ys.length > 1 ? 'red' : 'orange', width: 2.6, dash: false});
  ys.forEach(y => P.point(st.x, y, {color: ys.length > 1 ? 'red' : 'orange', r: 7})); P.render();
  lab.read('n', String(ys.length)); lab.read('fn', V.fn ? '<span class="ca-ok">Yes</span>' : '<span class="ca-bad">No</span>');
  lab.out(ys.length > 1 ? `This vertical line meets the graph ${ys.length} times: the input x = ${num(st.x, 1)} has ${ys.length} outputs, so the graph is <b>not</b> a function of x.` : V.fn ? 'Every vertical line meets this graph at most once: it is the graph of a function.' : `This line meets the graph ${ys.length === 1 ? 'once' : 'not at all'}. Move it: somewhere a vertical line meets the graph twice.`, ys.length > 1 ? 'ca-incorrect' : '');
});

/* ---------- 05 · intercepts ---------- */
const IC = [
  {t: 'f(x) = −x + 2', f: x => -x + 2, z: [2], y0: 2, win: {xmin: -4, xmax: 5, ymin: -3, ymax: 5}, steps: [['Zeros', '−x + 2 = 0 gives x = 2'], ['y-intercept', 'f(0) = 2, the point (0, 2)']]},
  {t: 'f(x) = √(x² − 1)', f: x => Math.sqrt(x * x - 1), z: [-1, 1], y0: null, win: {xmin: -4, xmax: 4, ymin: -1, ymax: 4}, steps: [['Zeros', '√(x² − 1) = 0 ⟹ x² − 1 = 0 ⟹ x = ±1'], ['y-intercept', 'f(0) = √(−1) is not a real number (DNE): no y-intercept, because 0 is not in the domain']]},
  {t: 'f(x) = x² − 2x − 3', f: x => x * x - 2 * x - 3, z: [-1, 3], y0: -3, win: {xmin: -3, xmax: 5, ymin: -5, ymax: 6}, steps: [['Zeros', 'x² − 2x − 3 = (x − 3)(x + 1) = 0 ⟹ x = 3 or x = −1'], ['y-intercept', 'f(0) = −3']]},
  {t: 'f(x) = 2|x − 3| − 4', f: x => 2 * Math.abs(x - 3) - 4, z: [1, 5], y0: 2, win: {xmin: -2, xmax: 8, ymin: -5, ymax: 6}, steps: [['Zeros', '|x − 3| = 2 ⟹ x − 3 = ±2 ⟹ x = 1 or x = 5'], ['y-intercept', 'f(0) = 2|−3| − 4 = 2']]},
  {t: 'f(x) = (x − 1)/(x + 2)', f: x => (x - 1) / (x + 2), brk: [-2], z: [1], y0: -0.5, win: {xmin: -7, xmax: 5, ymin: -5, ymax: 6}, steps: [['Zeros', 'a fraction is 0 when its numerator is 0 (and the denominator is not): x = 1'], ['y-intercept', 'f(0) = −1/2']]},
  {t: 'f(x) = x² + 1', f: x => x * x + 1, z: [], y0: 1, win: {xmin: -4, xmax: 4, ymin: -2, ymax: 6}, steps: [['Zeros', 'x² + 1 = 0 means x² = −1: no real solution, so no zeros'], ['y-intercept', 'f(0) = 1']]}
];
CA.lab('icpt-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '1', options: IC.map((c, i) => [String(i), c.t])}],
  plot: {w: 540, h: 380}, plotLabel: 'Graph with its intercepts', legend: [['orange', 'x-intercepts (zeros)'], ['green', 'y-intercept']], readouts: [['z', 'Zeros'], ['y', 'y-intercept']], steps: true
}, (lab, st) => {
  const C = IC[+st.p], P = lab.plane(C.win);
  P.curve(C.f, {color: 'blue', width: 3.2, breaks: C.brk || []}); (C.brk || []).forEach(k => P.vline(k, {width: 1.4}));
  C.z.forEach(z => P.point(z, 0, {color: 'orange', r: 7, label: `(${fmt(z)}, 0)`, labelOpt: {dy: 22}}));
  if (C.y0 !== null) P.point(0, C.y0, {color: 'green', r: 7, label: `(0, ${fmt(C.y0)})`});
  P.render();
  lab.read('z', C.z.length ? C.z.map(z => 'x = ' + fmt(z)).join(', ') : 'none'); lab.read('y', C.y0 === null ? 'none' : `(0, ${fmt(C.y0)})`); lab.steps(C.steps);
  lab.out('Zeros come from solving f(x) = 0; the y-intercept comes from evaluating f(0).');
});

/* ---------- guided problems ---------- */
CA.guided('11', [
  {q: 'The domain of f(x) = 1/(x − 5) is:', opts: ['(−∞, 5) ∪ (5, ∞)', '(5, ∞)', '[5, ∞)', '(−∞, ∞)'], correct: 0, hint: 'Which x makes the denominator 0?', why: 'Only x = 5 is excluded.'},
  {q: 'The domain of g(x) = √(2x − 6) is:', opts: ['[3, ∞)', '(3, ∞)', '(−∞, 3]', '[−3, ∞)'], correct: 0, hint: 'Need 2x − 6 ≥ 0.', why: '2x ≥ 6, so x ≥ 3, and x = 3 is included because √0 = 0.', ref: {panel: 'domain', what: 'the domain of √(4 − 3x)', body: '<p>Find the domain of <b>f(x) = √(4 − 3x)</b>: the part under the root must be non-negative.</p>'}},
  {q: 'The range of f(x) = x² + 1 is:', opts: ['[1, ∞)', '(1, ∞)', '[0, ∞)', '(−∞, ∞)'], correct: 0, hint: 'x² ≥ 0.', why: 'x² + 1 ≥ 1, and the value 1 occurs at x = 0.'},
  {q: 'If f(x) = 2x² − x, then f(−1) = ?', opts: ['3', '1', '−3', '−1'], correct: 0, hint: 'Use parentheses: 2(−1)² − (−1).', why: '2(1) + 1 = 3.'},
  {q: 'If f(x) = x² + 4x + 3, then f(b + 1) = ?', opts: ['b² + 6b + 8', 'b² + 4b + 4', 'b² + 4b + 3 + 1', 'b² + 6b + 4'], correct: 0, hint: 'Replace every x by (b + 1).', why: '(b + 1)² + 4(b + 1) + 3 = b² + 2b + 1 + 4b + 4 + 3.', ref: {panel: 'evaluate', what: 'the function x² + 4x + 3', body: '<p>Evaluate <b>f(x) = x² + 4x + 3</b> at the input <b>b + 1</b>.</p>'}},
  {q: 'Write {x | −2 ≤ x &lt; 5} in interval notation.', opts: ['[−2, 5)', '(−2, 5]', '[−2, 5]', '(−2, 5)'], correct: 0, hint: '≤ uses a bracket, &lt; uses a parenthesis.', why: '−2 is included and 5 is not.'},
  {q: 'Which relation is <b>not</b> a function?', opts: ['{(1, 2), (1, 3), (2, 4)}', '{(1, 2), (2, 2), (3, 2)}', '{(0, 0), (1, 1), (2, 4)}', '{(−1, 1), (1, 1)}'], correct: 0, hint: 'Look for one input with two outputs.', why: 'The input 1 has outputs 2 and 3.', ref: {panel: 'concept', what: 'mapping diagrams', body: '<p>A relation is a function when every input has <b>exactly one</b> output.</p>'}},
  {q: 'Let f(x) = x + 3 for x &lt; 1 and f(x) = (x − 2)² for x ≥ 1. Then f(1) = ?', opts: ['1', '4', '0', '2'], correct: 0, hint: 'x = 1 belongs to the piece with x ≥ 1.', why: 'f(1) = (1 − 2)² = 1.', ref: {panel: 'piecewise', what: 'the piecewise function x + 3, (x − 2)²', body: '<p>f(x) = x + 3 for x &lt; 1 and f(x) = (x − 2)² for x ≥ 1.</p>'}},
  {q: 'Which graph fails the vertical line test?', opts: ['x² + y² = 9', 'y = x²', 'y = x³ − 3x', 'y = |x|'], correct: 0, hint: 'Which one has two y-values above some x?', why: 'Above x = 0 the circle has the points (0, 3) and (0, −3).'},
  {q: 'Which describes the intercepts of f(x) = √(x² − 1)?', opts: ['zeros at x = ±1 and no y-intercept', 'zero at x = 1 only and y-intercept (0, −1)', 'no zeros and y-intercept (0, 1)', 'zeros at x = ±1 and y-intercept (0, 0)'], correct: 0, hint: 'Is 0 in the domain?', why: 'x² − 1 = 0 gives x = ±1; f(0) = √(−1) is not real.', ref: {panel: 'intercepts', what: 'the function √(x² − 1)', body: '<p>Find the zeros and the y-intercept of <b>f(x) = √(x² − 1)</b>.</p>'}}
]);
})();
