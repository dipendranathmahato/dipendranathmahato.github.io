/* Section 8.8 · Vectors — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Rad, toDeg, toRad} = CA;
const $ = id => document.getElementById(id);
const fx = x => { x = CA.clean(x); if (Number.isInteger(x)) return fmt(x); const f = CA.simpleFrac(x, 12); return f ? f.toString() : num(x, 3); };
const vec = (a, b) => `⟨${fx(a)}, ${fx(b)}⟩`;
const ij = (a, b) => { const t = (c, s, first) => c === 0 ? '' : `${first ? (c < 0 ? '−' : '') : (c < 0 ? ' − ' : ' + ')}${Math.abs(c) === 1 ? '' : fmt(Math.abs(c))}${s}`; const out = t(a, 'i', true) + t(b, 'j', a === 0); return out || '0'; };
const mag = (a, b) => Rad.sqrt(a * a + b * b);
const sq = x => x < 0 ? `(${fmt(x)})²` : `${fmt(x)}²`;
const dirDeg = (a, b) => { const d = toDeg(Math.atan2(b, a)); return d < 0 ? d + 360 : d; };
const arrow = (P, x1, y1, x2, y2, color, label, lo = {}) => { P.seg(x1, y1, x2, y2, {color, width: 3.2, arrow: true}); if (label) P.label((x1 + x2) / 2, (y1 + y2) / 2, label, Object.assign({color, size: 12.5}, lo)); return P; };
const win = (pts, pad = 1.5, min = 6) => { const xs = pts.map(p => p[0]).concat([0]), ys = pts.map(p => p[1]).concat([0]); let x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad; if (x1 - x0 < min) { const m = (x0 + x1) / 2; x0 = m - min / 2; x1 = m + min / 2; } if (y1 - y0 < min) { const m = (y0 + y1) / 2; y0 = m - min / 2; y1 = m + min / 2; } return {xmin: x0, xmax: x1, ymin: y0, ymax: y1}; };
/* drag the nearest of several handles; handles() -> [[x, y, setter]] */
const dragHandles = (lab, handles) => { let cur = null; CA.drag(lab.svg, (x, y, ph) => { if (ph === 'start') { const H = handles(), P = lab.svg._caPlane, tol = (P.o.xmax - P.o.xmin) / 14; let best = null, bd = tol; H.forEach(h => { const d = Math.hypot(h[0] - x, h[1] - y); if (d < bd) { bd = d; best = h; } }); cur = best; if (!cur) return false; } if (cur) cur[2](Math.round(x), Math.round(y)); }); };
const quadRule = (a, b) => a > 0 && b >= 0 ? ['Quadrant I', 'θ = tan⁻¹(b/a)'] : a < 0 ? [b >= 0 ? 'Quadrant II' : 'Quadrant III', 'θ = tan⁻¹(b/a) + 180°'] : a > 0 ? ['Quadrant IV', 'θ = tan⁻¹(b/a) + 360°'] : ['on the y-axis', b > 0 ? 'θ = 90°' : 'θ = 270°'];

/* ---------- 01 · P to Q ---------- */
const PQ = {ex1: [[-1, 2], [-4, -1], 'Example 1 · P(−1, 2), Q(−4, −1)'], cp1: [[5, 2], [-1, 7], 'Checkpoint 1 · A(5, 2), B(−1, 7)']};
let Pp = [-1, 2], Qp = [-4, -1];
const pq = CA.lab('pq-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Vector', value: 'ex1', options: Object.entries(PQ).map(([k, v]) => [k, v[2]]).concat([['own', 'Drag your own']])}],
  plot: {w: 560, h: 420}, plotLabel: 'Vector from P to Q and the equal position vector', readouts: [['v', 'Position vector'], ['len', 'Both have length']], steps: true,
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag P or Q.</p>'
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { [Pp, Qp] = PQ[st.pre].slice(0, 2).map(p => p.slice()); }
  const a = Qp[0] - Pp[0], b = Qp[1] - Pp[1], P = lab.plane(win([Pp, Qp, [a, b]], 1.5, 8));
  arrow(P, ...Pp, ...Qp, 'orange', 'PQ⃗', {dx: 10}); arrow(P, 0, 0, a, b, 'blue', 'v', {dx: -14, anchor: 'end'});
  P.seg(Pp[0], Pp[1], 0, 0, {color: 'gray', dash: '3 5', width: 1.2}).seg(Qp[0], Qp[1], a, b, {color: 'gray', dash: '3 5', width: 1.2});
  P.point(...Pp, {color: 'orange', r: 7, label: `P(${fmt(Pp[0])}, ${fmt(Pp[1])})`}).point(...Qp, {color: 'orange', r: 7, label: `Q(${fmt(Qp[0])}, ${fmt(Qp[1])})`}).point(a, b, {color: 'blue', r: 5, label: `(${fmt(a)}, ${fmt(b)})`}).render();
  lab.read('v', vec(a, b)); lab.read('len', mag(a, b).html());
  lab.steps([['Subtract initial from terminal', `⟨x₂ − x₁, y₂ − y₁⟩ = ⟨${fmt(Qp[0])} − (${fmt(Pp[0])}), ${fmt(Qp[1])} − (${fmt(Pp[1])})⟩ = ${vec(a, b)}`], ['Position vector', `from (0, 0) to (${fmt(a)}, ${fmt(b)})`]]);
  lab.out(`PQ⃗ and v = ${vec(a, b)} are equal vectors: same length and same direction, drawn in different places (the dashed lines show the translation).`);
});
dragHandles(pq, () => [[...Pp, (x, y) => { Pp = [x, y]; pq.state.set('pre', 'own', true); pq.refresh(); }], [...Qp, (x, y) => { Qp = [x, y]; pq.state.set('pre', 'own', true); pq.refresh(); }]]);

/* ---------- 02 · magnitude and direction ---------- */
const MD = {ex21: [[-3, 3], [1, -2], 'Example 2 (1) · P(−3, 3) to Q(1, −2)'], ex22: [[2, -1], [-3, 1], 'Example 2 (2) · P(2, −1) to Q(−3, 1)'], cp21: [[-6, -1], [2, 5], 'Checkpoint 2 (1) · P(−6, −1) to Q(2, 5)'], cp22: [[3, 7], [1, 1], 'Checkpoint 2 (2) · P(3, 7) to Q(1, 1)']};
let V = [4, -5];
const md = CA.lab('md-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Vector', value: 'ex21', options: Object.entries(MD).map(([k, v]) => [k, v[2]]).concat([['own', 'Drag your own']])}],
  plot: {w: 560, h: 400}, plotLabel: 'Position vector with its direction angle', readouts: [['v', 'v'], ['m', '|v|'], ['d', 'Direction θ']], steps: true,
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag the tip of v.</p>'
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const [p, q] = MD[st.pre]; V = [q[0] - p[0], q[1] - p[1]]; }
  const [a, b] = V, M = mag(a, b), d = dirDeg(a, b), P = lab.plane(win([V], 1.5, 8)), th = toRad(d), r = Math.min(1.2, M.v / 2);
  if (a || b) P.param(t => r * Math.cos(t), t => r * Math.sin(t), 0, th, {color: 'purple', width: 2.4, arrow: true});
  P.seg(0, 0, a, 0, {color: 'gray', dash: '4 4', width: 1.6}).seg(a, 0, a, b, {color: 'gray', dash: '4 4', width: 1.6});
  arrow(P, 0, 0, a, b, 'orange', `|v| = ${M.str()}`, {dx: 10}); P.point(a, b, {color: 'orange', r: 7, label: `(${fmt(a)}, ${fmt(b)})`}).render();
  const [q, rule] = quadRule(a, b), base = a !== 0 ? toDeg(Math.atan(b / a)) : null;
  lab.read('v', vec(a, b)); lab.read('m', M.html()); lab.read('d', a || b ? `≈ ${num(d, 1)}°` : 'undefined');
  lab.steps([['Magnitude', `|v| = √(${sq(a)} + ${sq(b)}) = √${a * a + b * b} = ${M.str()}`], ['Sketch', `v points into ${q}`], ['Direction', base === null ? rule : `${rule} = tan⁻¹(${fmt(b)}/${fmt(a)})${q === 'Quadrant I' ? '' : q === 'Quadrant IV' ? ' + 360°' : ' + 180°'} ≈ ${num(base, 2)}°${q === 'Quadrant I' ? '' : q === 'Quadrant IV' ? ' + 360°' : ' + 180°'} ≈ ${num(d, 1)}°`]]);
  lab.out(a === 0 && b === 0 ? 'The zero vector has no direction.' : `v = ${vec(a, b)} has magnitude ${M.html()} ≈ ${num(M.v, 3)} and direction ≈ ${num(d, 1)}°.`, 'ca-correct');
});
dragHandles(md, () => [[...V, (x, y) => { V = [x, y]; md.state.set('pre', 'own', true); md.refresh(); }]]);

/* ---------- 03 · operations ---------- */
const OP = [
  {t: 'Example 3 · u = ⟨5, −2⟩, v = ⟨−1, 7⟩: u + v', u: [5, -2], v: [-1, 7], m: 'sum'}, {t: 'Example 3 · u − v', u: [5, -2], v: [-1, 7], m: 'diff'},
  {t: 'Checkpoint 3 · u = ⟨−1, −5⟩, v = ⟨3, −6⟩: u + v', u: [-1, -5], v: [3, -6], m: 'sum'}, {t: 'Checkpoint 3 · u − v', u: [-1, -5], v: [3, -6], m: 'diff'},
  {t: 'Example 4.1 · 2v for v = ⟨7, −3⟩', u: [7, -3], v: [7, -3], m: 'scal', k: 2}, {t: 'Example 4.1 · (1/3)v', u: [7, -3], v: [7, -3], m: 'scal', k: 1 / 3}, {t: 'Example 4.1 · −4v', u: [7, -3], v: [7, -3], m: 'scal', k: -4},
  {t: 'Example 4.2 · 2v + 4w, v = ⟨8, −2⟩, w = ⟨5, 1⟩', u: [8, -2], v: [5, 1], m: 'combo', a: 2, b: 4}, {t: 'Checkpoint 4 · −v, ½v, 2v for v = ⟨2, 5⟩', u: [2, 5], v: [2, 5], m: 'scal', k: -1},
  {t: 'Checkpoint 4 · 3v − 2w, v = ⟨−4, 4⟩, w = ⟨6, −5⟩', u: [-4, 4], v: [6, -5], m: 'combo', a: 3, b: -2}, {t: 'Example 6.2 · 3v + 5w, v = −i + 3j, w = 6i − 2j', u: [-1, 3], v: [6, -2], m: 'combo', a: 3, b: 5},
  {t: 'Checkpoint 6.2 · 2v − 4w, v = 5i − 2j, w = −4i + j', u: [5, -2], v: [-4, 1], m: 'combo', a: 2, b: -4}
];
let U = [5, -2], W = [-1, 7];
const kf = k => { const f = CA.simpleFrac(k, 12); return f && f.d !== 1 ? `(${f})` : fmt(k); };
const op = CA.lab('op-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: '0', options: OP.map((p, i) => [String(i), p.t]).concat([['own', 'Drag your own']])},
    {type: 'seg', key: 'm', label: 'Operation', value: 'sum', options: [['sum', 'u + v'], ['diff', 'u − v'], ['scal', 'k·v'], ['combo', 'a·u + b·v']]},
    {type: 'select', key: 'k', label: 'k =', value: '2', options: ['-4', '-3', '-2', '-1', '-1/2', '-1/3', '1/3', '1/2', '1', '2', '3', '4'].map(v => [v, v.replace('-', '−')])}, {type: 'range', key: 'a', label: 'a =', min: -5, max: 5, step: 1, value: 2}, {type: 'range', key: 'b', label: 'b =', min: -5, max: 5, step: 1, value: 4}],
  plot: {w: 600, h: 420}, plotLabel: 'Vector operations', legend: [['orange', 'u'], ['blue', 'v'], ['green', 'result']], readouts: [['r', 'Result ⟨ , ⟩'], ['ij', 'Result in i, j form'], ['m', '|result|']], steps: true,
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag the tips of u and v.</p>'
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = OP[+st.pre]; U = p.u.slice(); W = p.v.slice(); st.set('m', p.m, true); if (p.k !== undefined) st.set('k', p.k === 1 / 3 ? '1/3' : String(p.k), true); if (p.a !== undefined) { st.set('a', p.a, true); st.set('b', p.b, true); } }
  const m = st.m, k = CA.parseVal(st.k).v, A = st.a, B = st.b; let R, steps, pts, P;
  const label = st.pre !== 'own' && OP[+st.pre].m === 'combo' ? ['v', 'w'] : ['u', 'v'];
  if (m === 'sum') { R = [U[0] + W[0], U[1] + W[1]]; pts = [U, W, R]; P = lab.plane(win(pts)); arrow(P, 0, 0, ...U, 'orange', label[0]); arrow(P, ...U, ...R, 'blue', label[1]); P.seg(0, 0, ...W, {color: 'blue', dash: '5 5', width: 1.6}).seg(...W, ...R, {color: 'orange', dash: '5 5', width: 1.6}); arrow(P, 0, 0, ...R, 'green', `${label[0]} + ${label[1]}`, {anchor: 'end', dx: -10});
    steps = [['Add components', `${vec(...U)} + ${vec(...W)} = ⟨${fmt(U[0])} + (${fmt(W[0])}), ${fmt(U[1])} + (${fmt(W[1])})⟩ = ${vec(...R)}`], ['Tip-to-tail', `start ${label[1]} at the tip of ${label[0]}; the result runs from the start of ${label[0]} to the end of ${label[1]} (the diagonal of the parallelogram)`]]; }
  else if (m === 'diff') { R = [U[0] - W[0], U[1] - W[1]]; pts = [U, W, R, [-W[0], -W[1]]]; P = lab.plane(win(pts)); arrow(P, 0, 0, ...U, 'orange', label[0]); arrow(P, 0, 0, ...W, 'blue', label[1]); arrow(P, ...U, ...R, 'purple', `−${label[1]}`); arrow(P, 0, 0, ...R, 'green', `${label[0]} − ${label[1]}`, {anchor: 'end', dx: -10});
    steps = [['Opposite of ' + label[1], `−${label[1]} = ${vec(-W[0], -W[1])}`], ['Add', `${vec(...U)} + ${vec(-W[0], -W[1])} = ${vec(...R)}`]]; }
  else if (m === 'scal') { R = [k * W[0], k * W[1]]; pts = [W, R]; P = lab.plane(win(pts)); arrow(P, 0, 0, ...W, 'blue', 'v'); arrow(P, 0, 0, ...R, 'green', `${kf(k)}v`, {anchor: 'end', dx: -10});
    const M = mag(...W); steps = [['Multiply each component', `${kf(k)}${vec(...W)} = ${vec(...R.map(x => CA.clean(x)))}`], ['Magnitude', `|${kf(k)}v| = |${kf(k)}| · |v| = ${num(Math.abs(k), 3)} · ${M.str()} ≈ ${num(Math.abs(k) * M.v, 3)}`], ['Direction', k > 0 ? `same as v (≈ ${num(dirDeg(...W), 1)}°)` : k < 0 ? `opposite to v: ≈ ${num(dirDeg(...R), 1)}° (v is ≈ ${num(dirDeg(...W), 1)}°)` : 'the zero vector']]; }
  else { R = [A * U[0] + B * W[0], A * U[1] + B * W[1]]; const Au = [A * U[0], A * U[1]]; pts = [U, W, Au, R]; P = lab.plane(win(pts)); arrow(P, 0, 0, ...U, 'orange', label[0]); arrow(P, 0, 0, ...W, 'blue', label[1]); P.seg(0, 0, ...Au, {color: 'orange', dash: '5 5', width: 2}).seg(...Au, ...R, {color: 'blue', dash: '5 5', width: 2}); arrow(P, 0, 0, ...R, 'green', `${fmt(A)}${label[0]} ${B < 0 ? '−' : '+'} ${fmt(Math.abs(B))}${label[1]}`, {anchor: 'end', dx: -10});
    steps = [['Scale', `${fmt(A)}${label[0]} = ${vec(...Au)}, ${fmt(B)}${label[1]} = ${vec(B * W[0], B * W[1])}`], ['Add', `${vec(...Au)} + ${vec(B * W[0], B * W[1])} = ${vec(...R)}`], ['In i, j form', `${fmt(A)}(${ij(...U)}) ${B < 0 ? '−' : '+'} ${fmt(Math.abs(B))}(${ij(...W)}) = ${ij(...R)}`]]; }
  P.point(...U, {color: 'orange', r: 6}).point(...W, {color: 'blue', r: 6}).render();
  const Rc = R.map(x => CA.clean(x)), Mr = Number.isInteger(Rc[0]) && Number.isInteger(Rc[1]) ? mag(...Rc).str() : num(Math.hypot(...Rc), 4);
  lab.read('r', vec(...Rc)); lab.read('ij', Rc.every(Number.isInteger) ? ij(...Rc) : '—'); lab.read('m', Mr);
  lab.steps(steps); lab.out(`Result: <b>${vec(...Rc)}</b>.`, 'ca-correct');
});
dragHandles(op, () => [[...U, (x, y) => { U = [x, y]; op.state.set('pre', 'own', true); op.refresh(); }], [...W, (x, y) => { W = [x, y]; op.state.set('pre', 'own', true); op.refresh(); }]]);

/* ---------- 04 · unit vectors; length and angle ---------- */
CA.lab('unit-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Vector', value: 'e5', options: [['e5', 'Example 5 · v = ⟨−3, −4⟩'], ['c5', 'Checkpoint 5 · v = ⟨−7, 3⟩'], ['x', 'v = ⟨2, 2⟩'], ['own', 'Set your own']]}, {type: 'number', key: 'a', label: 'a =', value: -3, step: 1}, {type: 'number', key: 'b', label: 'b =', value: -4, step: 1}],
  plot: {xmin: -8, xmax: 8, ymin: -6, ymax: 6, w: 560, h: 380}, plotLabel: 'A vector and its unit vector', readouts: [['m', '|v|'], ['u', 'Unit vector'], ['chk', '|u|']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const v = {e5: [-3, -4], c5: [-7, 3], x: [2, 2]}[st.pre]; st.set('a', v[0], true); st.set('b', v[1], true); } else if (key && key !== 'pre') st.set('pre', 'own', true);
  const {a, b} = st; if (!Number.isInteger(a) || !Number.isInteger(b) || (a === 0 && b === 0)) { lab.out('Use integers, not both zero.', 'ca-incorrect'); return; }
  const M = mag(a, b), ux = Rad.of(a).div(M), uy = Rad.of(b).div(M), P = lab.plane(win([[a, b]], 1.5, 4));
  P.param(t => Math.cos(t), t => Math.sin(t), 0, 2 * Math.PI, {color: 'gray', dash: '4 4', width: 1.4}); arrow(P, 0, 0, a, b, 'blue', 'v', {dx: 10}); arrow(P, 0, 0, ux.v, uy.v, 'green', 'u', {dx: -12, anchor: 'end'}); P.render();
  lab.read('m', M.html()); lab.read('u', `⟨${ux.html()}, ${uy.html()}⟩`); lab.read('chk', num(Math.hypot(ux.v, uy.v), 6));
  lab.steps([['Magnitude', `|v| = √(${sq(a)} + ${sq(b)}) = ${M.str()}`], ['Divide by |v|', `u = v/|v| = ⟨${fmt(a)}/${M.str()}, ${fmt(b)}/${M.str()}⟩ = ⟨${ux.str()}, ${uy.str()}⟩`], ['i, j form', `u = ${ux.str()} i ${uy.v < 0 ? '−' : '+'} ${uy.v < 0 ? uy.neg().str() : uy.str()} j`]]);
  lab.out('u points the same way as v but ends on the unit circle (dashed): its length is exactly 1.', 'ca-correct');
});
CA.lab('ld-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Vector', value: 'e', options: [['e', 'Example 6.3 · length 9 at 120°'], ['c', 'Checkpoint 6.3 · length 3 at 210°'], ['own', 'Set your own']]}, {type: 'number', key: 'L', label: '|v| =', value: 9, min: 1, step: 1}, {type: 'select', key: 'th', label: 'θ =', value: '120', options: CA.SPECIAL.slice(0, -1).map(d => [String(d), d + '°'])}],
  plot: {xmin: -10, xmax: 10, ymin: -10, ymax: 10, w: 520, h: 400}, plotLabel: 'Vector from its length and direction', readouts: [['v', 'v in i, j form']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const v = {e: [9, '120'], c: [3, '210']}[st.pre]; st.set('L', v[0], true); st.set('th', v[1], true); } else if (key && key !== 'pre') st.set('pre', 'own', true);
  const L = st.L, d = +st.th, c = CA.exact('cos', d).mul(L), s = CA.exact('sin', d).mul(L), P = lab.plane({xmin: -L - 1.5, xmax: L + 1.5, ymin: -L - 1.5, ymax: L + 1.5});
  P.param(t => L * Math.cos(t), t => L * Math.sin(t), 0, toRad(d), {color: 'purple', width: 2, arrow: true}); arrow(P, 0, 0, c.v, s.v, 'orange', `|v| = ${fmt(L)}`, {dx: 10}); P.render();
  const tx = r => r.isZero() ? '' : r.str();
  lab.read('v', `${c.isZero() ? '' : c.html() + ' i'} ${s.isZero() ? '' : (s.v < 0 ? '− ' + s.neg().html() : (c.isZero() ? '' : '+ ') + s.html()) + ' j'}`);
  lab.steps([['Formula', 'v = |v|(cos θ i + sin θ j)'], ['Substitute', `v = ${fmt(L)}(cos ${d}° i + sin ${d}° j) = ${fmt(L)}(${CA.exact('cos', d).str()} i + ${CA.exact('sin', d).str()} j)`], ['Distribute', `v = ${tx(c) ? tx(c) + ' i' : ''} ${s.isZero() ? '' : (s.v < 0 ? '− ' + s.neg().str() : '+ ' + s.str()) + ' j'}`]]);
  lab.out(`Components: ⟨${c.str()}, ${s.str()}⟩ ≈ ⟨${num(c.v, 3)}, ${num(s.v, 3)}⟩.`, 'ca-correct');
});

/* ---------- 05 · dot product ---------- */
const DP = {e7: [[3, 8], [-2, 6], 'Example 7 · v = ⟨3, 8⟩, w = ⟨−2, 6⟩'], c7: [[-2, -5], [9, -1], 'Checkpoint 7 · v = ⟨−2, −5⟩, w = ⟨9, −1⟩'], p: [[4, 2], [-1, 2], 'v = ⟨4, 2⟩, w = ⟨−1, 2⟩']};
let D1 = [3, 8], D2 = [-2, 6];
const dot = CA.lab('dot-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Vectors', value: 'e7', options: Object.entries(DP).map(([k, v]) => [k, v[2]]).concat([['own', 'Drag your own']])}],
  plot: {w: 560, h: 400}, plotLabel: 'Two vectors and the angle between them', readouts: [['dp', 'v · w'], ['mm', '|v| and |w|'], ['th', 'θ']], steps: true,
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag the tips of v and w.</p>'
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { [D1, D2] = DP[st.pre].slice(0, 2).map(p => p.slice()); }
  const [a, b] = D1, [c, d] = D2, dp = a * c + b * d, M1 = mag(a, b), M2 = mag(c, d), P = lab.plane(win([D1, D2], 1.5, 8));
  if ((a || b) && (c || d)) { const t1 = toRad(dirDeg(a, b)), t2 = toRad(dirDeg(c, d)); let s = t1, e = t2; if (Math.abs(e - s) > Math.PI) { if (e > s) s += 2 * Math.PI; else e += 2 * Math.PI; } const r = Math.min(M1.v, M2.v) / 3; P.param(t => r * Math.cos(t), t => r * Math.sin(t), s, e, {color: 'purple', width: 2.2}); }
  arrow(P, 0, 0, a, b, 'orange', 'v', {dx: 10}); arrow(P, 0, 0, c, d, 'blue', 'w', {dx: 10}); P.point(a, b, {color: 'orange', r: 6}).point(c, d, {color: 'blue', r: 6}).render();
  const ok = (a || b) && (c || d), cosv = ok ? dp / (M1.v * M2.v) : NaN, th = ok ? toDeg(Math.acos(Math.max(-1, Math.min(1, cosv)))) : NaN;
  lab.read('dp', fmt(dp)); lab.read('mm', `${M1.html()} and ${M2.html()}`); lab.read('th', ok ? `≈ ${num(th, 1)}°` : 'undefined');
  lab.steps([['Dot product', `v · w = (${fmt(a)})(${fmt(c)}) + (${fmt(b)})(${fmt(d)}) = ${fmt(dp)}`], ['Magnitudes', `|v| = ${M1.str()}, |w| = ${M2.str()}`], ['Angle', ok ? `θ = cos⁻¹(${fmt(dp)}/(${M1.str()} · ${M2.str()})) = cos⁻¹(${num(cosv, 4)}) ≈ ${num(th, 1)}°` : 'undefined for a zero vector']]);
  lab.out(!ok ? 'The angle is undefined for the zero vector.' : dp === 0 ? '<b>v · w = 0</b>: the vectors are perpendicular.' : dp > 0 ? 'v · w &gt; 0: the angle between them is acute.' : 'v · w &lt; 0: the angle between them is obtuse.', dp === 0 && ok ? 'ca-correct' : '');
});
dragHandles(dot, () => [[...D1, (x, y) => { D1 = [x, y]; dot.state.set('pre', 'own', true); dot.refresh(); }], [...D2, (x, y) => { D2 = [x, y]; dot.state.set('pre', 'own', true); dot.refresh(); }]]);

/* ---------- guided problems ---------- */
CA.guided('88', [
  {q: 'What is the position vector equal to PQ⃗ with P(−1, 2) and Q(−4, −1)?', opts: ['⟨−3, −3⟩', '⟨3, 3⟩', '⟨−5, 1⟩', '⟨−4, −1⟩'], correct: 0, hint: '⟨x₂ − x₁, y₂ − y₁⟩.', why: '⟨−4 − (−1), −1 − 2⟩ = ⟨−3, −3⟩.', ref: {panel: 'component', what: 'Example 1', body: '<p>P(−1, 2) and Q(−4, −1). Find the position vector equal to PQ⃗.</p>'}},
  {q: 'What is the magnitude of v = ⟨4, −5⟩?', opts: ['√41', '√31', '9', '1'], correct: 0, hint: '√(16 + 25).', why: '|v| = √(4² + (−5)²) = √41 ≈ 6.40.'},
  {q: 'What is the direction of v = ⟨4, −5⟩?', opts: ['≈ 308.7°', '≈ −51.3°', '≈ 231.3°', '≈ 51.3°'], correct: 0, hint: 'Quadrant IV: add 360°.', why: 'tan⁻¹(−5/4) ≈ −51.3°, and −51.3° + 360° ≈ 308.7°.', ref: {problem: 2, what: 'the same vector'}},
  {q: 'What is the direction of u = ⟨−5, 2⟩?', opts: ['≈ 158.2°', '≈ −21.8°', '≈ 21.8°', '≈ 338.2°'], correct: 0, hint: 'Quadrant II: add 180°.', why: 'tan⁻¹(2/(−5)) ≈ −21.8°, and −21.8° + 180° ≈ 158.2°.'},
  {q: 'For u = ⟨5, −2⟩ and v = ⟨−1, 7⟩, u + v = ?', opts: ['⟨4, 5⟩', '⟨6, −9⟩', '⟨4, −9⟩', '⟨−5, −14⟩'], correct: 0, hint: 'Add matching components.', why: '⟨5 + (−1), −2 + 7⟩ = ⟨4, 5⟩.', ref: {panel: 'operations', what: 'Example 3', body: '<p>u = ⟨5, −2⟩ and v = ⟨−1, 7⟩. Find u + v and u − v.</p>'}},
  {q: 'For the same u and v, u − v = ?', opts: ['⟨6, −9⟩', '⟨4, 5⟩', '⟨−6, 9⟩', '⟨6, 5⟩'], correct: 0, hint: 'u + (−v) with −v = ⟨1, −7⟩.', why: '⟨5 + 1, −2 − 7⟩ = ⟨6, −9⟩.', ref: {problem: 5, what: 'the same u and v'}},
  {q: 'For v = ⟨7, −3⟩, which is −4v and how does its direction compare with v?', opts: ['⟨−28, 12⟩, opposite direction', '⟨−28, −12⟩, same direction', '⟨28, −12⟩, opposite direction', '⟨−28, 12⟩, same direction'], correct: 0, hint: 'k &lt; 0 reverses the direction.', why: '−4⟨7, −3⟩ = ⟨−28, 12⟩, which points in the opposite direction (≈ 156.8° vs ≈ 336.8°).'},
  {q: 'What is the unit vector in the direction of ⟨−3, −4⟩?', opts: ['⟨−3/5, −4/5⟩', '⟨3/5, 4/5⟩', '⟨−3, −4⟩/25', '⟨−1, −1⟩'], correct: 0, hint: 'Divide by |v| = 5.', why: '⟨−3, −4⟩/5 = ⟨−3/5, −4/5⟩.'},
  {q: 'Write the vector of length 9 at 120° in i, j form.', opts: ['−(9/2)i + (9√3/2)j', '(9/2)i + (9√3/2)j', '−(9√3/2)i + (9/2)j', '−9i + 9j'], correct: 0, hint: '9(cos 120° i + sin 120° j).', why: 'cos 120° = −1/2 and sin 120° = √3/2, so v = −(9/2)i + (9√3/2)j.'},
  {q: 'Find the angle between v = ⟨3, 8⟩ and w = ⟨−2, 6⟩.', opts: ['≈ 39°', '≈ 51°', '≈ 129°', '≈ 90°'], correct: 0, hint: 'v · w = 42, |v| = √73, |w| = 2√10.', why: 'cos θ = 42/(√73 · 2√10) ≈ 0.777, so θ ≈ 39°.', ref: {panel: 'dot', what: 'Example 7', body: '<p>Find the angle between <b>v = ⟨3, 8⟩</b> and <b>w = ⟨−2, 6⟩</b>.</p>'}},
  {q: 'If v · w = 0 (both nonzero), then v and w are…', opts: ['perpendicular', 'parallel', 'equal', 'unit vectors'], correct: 0, hint: 'cos θ = 0.', why: 'cos θ = 0 means θ = 90°.'}
]);
})();
