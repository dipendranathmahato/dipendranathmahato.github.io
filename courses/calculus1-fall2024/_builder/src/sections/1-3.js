/* Section 1.3 · Trigonometric Functions — interactive activities (radian labs reuse the tested precalculus explorers) */

/* reused from 5-1.js */
(() => {
'use strict';
const {fmt, num, F, Frac, toRad, toDeg} = CA;
const PI = Math.PI;
const ANGLE_WIN = {xmin: -1.5, xmax: 1.5, ymin: -1.3, ymax: 1.3, labels: false, grid: false, w: 520, h: 420};
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);


/* ---------- 02 · one radian ---------- */
CA.lab('rad-lab', {
  controls: [{type: 'select', key: 'jump', label: 'Jump to', value: '1', options: [['1', '1 radian'], ['2', '2 radians'], ['pi2', 'π/2 ≈ 1.57'], ['pi', 'π ≈ 3.14'], ['2pi', '2π ≈ 6.28']]},
    {type: 'range', key: 'k', label: 'Arc = radius-lengths', min: 0, max: 6.3, step: 0.01, value: 1, fmt: v => num(v, 2)}],
  plot: ANGLE_WIN, plotLabel: 'Radius lengths laid along a circle', readouts: [['ang', 'Central angle'], ['deg', 'In degrees'], ['frac', 'Fraction of a full turn']]
}, (lab, st, key) => {
  if (key === 'jump') st.set('k', {1: 1, 2: 2, pi2: PI / 2, pi: PI, '2pi': 2 * PI}[st.jump], true);
  const k = Math.min(st.k, 2 * PI), P = lab.plane();
  P.seg(0, 0, 1, 0, {color: 'blue', width: 3}).label(0.5, 0, 'r', {color: 'blue', anchor: 'middle', dx: 0, dy: 16});
  if (k > 0) { CA.sector(P, 1, 0, k, {color: 'orange', fillOpacity: 0.12}); P.param(t => Math.cos(t), t => Math.sin(t), 0, k, {color: 'orange', width: 7}); }
  for (let j = 1; j <= Math.floor(k + 1e-9) && j <= 6; j++) P.seg(0.9 * Math.cos(j), 0.9 * Math.sin(j), 1.12 * Math.cos(j), 1.12 * Math.sin(j), {color: 'text', width: 2}).label(1.24 * Math.cos(j), 1.24 * Math.sin(j), `${j}r`, {color: 'text', anchor: 'middle', dx: 0, dy: 4, size: 12});
  P.seg(0, 0, Math.cos(k), Math.sin(k), {color: 'orange', width: 3});
  P.param(t => Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.3}).render();
  lab.read('ang', `${num(k, 2)} rad`); lab.read('deg', `≈ ${num(k * 180 / PI, 1)}°`); lab.read('frac', `${num(k / (2 * PI) * 100, 1)}% of 2π`);
  const near = (v, t) => Math.abs(v - t) < 0.006;
  lab.out(near(k, 1) ? 'The arc is exactly one radius long, so the central angle is <b>1 radian ≈ 57.3°</b>.' : near(k, PI) ? 'Half of the circle holds about <b>3.14 radius-lengths</b>: π radians = 180°.' : near(k, 2 * PI) ? 'The whole circle holds <b>2π ≈ 6.28 radius-lengths</b>: 2π radians = 360°.' : near(k, PI / 2) ? 'A quarter turn holds π/2 ≈ 1.57 radius-lengths: π/2 radians = 90°.' : `An arc of ${num(k, 2)} radius-lengths makes a central angle of ${num(k, 2)} radians ≈ ${num(k * 180 / PI, 1)}°.`);
});

/* ---------- 02 · converter ---------- */
const conv = CA.lab('conv-lab', {
  controls: [{type: 'seg', key: 'dir', label: 'Direction', value: 'd2r', options: [['d2r', 'Degrees → radians'], ['r2d', 'Radians → degrees']]},
    {type: 'text', key: 'val', label: 'Angle', value: '45', placeholder: 'e.g. 45 or 5π/6'}],
  steps: true, readouts: [['ans', 'Answer']]
}, (lab, st, key) => {
  if (key === 'dir') st.set('val', st.dir === 'd2r' ? '45' : '−5π/6', true);
  const A = CA.parseAngle(st.val, st.dir === 'd2r' ? 'deg' : 'rad');
  if (!A || (st.dir === 'd2r' && A.kind !== 'deg') || (st.dir === 'r2d' && A.kind === 'deg')) { lab.read('ans', '—'); lab.steps([]); lab.out(st.dir === 'd2r' ? 'Type a number of degrees, such as 40 or −55.' : 'Type radians such as 5π/6, −3pi/2, or 2.', 'ca-incorrect'); return; }
  if (st.dir === 'd2r') {
    const d = A.deg, whole = Number.isInteger(d * 2);
    if (whole) { const f = CA.degFrac(d); lab.steps([['Multiply by π/180°', `${fmt(d)}° × π/180° = ${fmt(d)}π/180`], ['Simplify the fraction', `${CA.piStr(f)}`], ['Decimal value', `≈ ${num(f.v * PI, 4)} radians`]]); lab.read('ans', CA.piHTML(f)); lab.out(`${fmt(d)}° = <b>${CA.piStr(f)}</b> radians.`, 'ca-correct'); }
    else { const r = d * PI / 180; lab.steps([['Multiply by π/180°', `${fmt(d)}° × π/180° ≈ ${num(r, 4)}`]]); lab.read('ans', `${num(r, 4)} rad`); lab.out(`${fmt(d)}° ≈ ${num(r, 4)} radians.`, 'ca-correct'); }
  } else if (A.kind === 'pi') {
    const f = A.f, deg = f.mul(180);
    lab.steps([['Multiply by 180°/π', `${CA.piStr(f)} × 180°/π`], ['Cancel π', `${f.toString()} × 180° = ${fmt(f.n)} × 180°/${f.d}`], ['Result', `${deg.isInt() ? fmt(deg.n) : num(deg.v, 4)}°`]]);
    lab.read('ans', `${deg.isInt() ? fmt(deg.n) : num(deg.v, 4)}°`); lab.out(`${CA.piStr(f)} radians = <b>${deg.isInt() ? fmt(deg.n) : num(deg.v, 4)}°</b>.`, 'ca-correct');
  } else {
    const d = A.v * 180 / PI;
    lab.steps([['Multiply by 180°/π', `${fmt(A.v)} × 180°/π = ${fmt(A.v * 180)}°/π`], ['Decimal value', `≈ ${num(d, 2)}°`]]);
    lab.read('ans', `≈ ${num(d, 2)}°`); lab.out(`${fmt(A.v)} radians (no π) ≈ <b>${num(d, 2)}°</b>. A radian is about 57.3°, so ${fmt(A.v)} rad is about ${fmt(A.v)} × 57.3°.`, 'ca-correct');
  }
});

})();

/* reused from 5-2.js */
(() => {
'use strict';
const {fmt, num, F, toRad, toDeg} = CA;
const PI = Math.PI;
const UC_WIN = {xmin: -1.5, xmax: 1.5, ymin: -1.3, ymax: 1.3, w: 520, h: 420, xstep: 0.5, ystep: 0.5};
const isSpecial = d => Number.isInteger(d) && (d % 30 === 0 || d % 45 === 0);
const radOf = d => Number.isInteger(d * 2) ? CA.radText(d) : `${num(toRad(d), 4)}`;
const valHTML = (fn, d, dp = 3) => isSpecial(d) ? CA.exact(fn, d).html() : num(CA.trig[fn](toRad(d)), dp);
const valTxt = (fn, d, dp = 3) => isSpecial(d) ? CA.exact(fn, d).str() : num(CA.trig[fn](toRad(d)), dp);


/* ---------- 01 · unit circle with draggable point ---------- */
const UC_PRE = [['30', 't = 30° (π/6)'], ['83.6', 't ≈ 83.6°'], ['198.5', 't ≈ 198.5°'], ['135', 't = 135°'], ['240', 't = 240°'], ['300', 't = 300°'], ['90', 't = 90°'], ['180', 't = 180°']];
const signGrid = document.getElementById('sign-grid');
const uc = CA.lab('uc-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Angle', value: '30', options: UC_PRE}, {type: 'range', key: 't', label: 't =', min: 0, max: 360, step: 0.1, value: 30, fmt: v => num(v, 1) + '°'},
    {type: 'check', key: 'snap', label: 'Snap to special angles while dragging', value: true}],
  plot: UC_WIN, plotLabel: 'Unit circle with a point at angle t', readouts: [['t', 'Angle t'], ['cos', 'cos t = x'], ['sin', 'sin t = y'], ['chk', 'x² + y²']],
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag the point around the circle.</p>'
}, (lab, st, key) => {
  if (key === 'pre') st.set('t', +st.pre, true);
  const d = Math.round(st.t * 10) / 10, th = toRad(d), x = Math.cos(th), y = Math.sin(th), P = lab.plane();
  CA.drawAngle(P, th, {point: false, arcR: 0.22});
  P.seg(0, 0, x, 0, {color: 'blue', width: 5}).seg(x, 0, x, y, {color: 'green', width: 5});
  if (Math.abs(x) > 0.08) P.label(x / 2, 0, 'cos t', {color: 'blue', anchor: 'middle', dx: 0, dy: y >= 0 ? 17 : -9, size: 12.5});
  if (Math.abs(y) > 0.08) P.label(x, y / 2, 'sin t', {color: 'green', anchor: x >= 0 ? 'start' : 'end', dx: 8, dy: 4, size: 12.5});
  P.point(x, y, {color: 'orange', r: 8, label: `(${valTxt('cos', d)}, ${valTxt('sin', d)})`, labelOpt: {size: 12.5, dy: y >= 0 ? -12 : 22}}).render();
  lab.read('t', `${num(d, 1)}° = ${radOf(d)}`); lab.read('cos', valHTML('cos', d)); lab.read('sin', valHTML('sin', d));
  lab.read('chk', `${num(x * x, 3)} + ${num(y * y, 3)} = ${num(x * x + y * y, 3)}`);
  const q = CA.quadrant(d);
  signGrid.innerHTML = [['II', '−', '+'], ['I', '+', '+'], ['III', '−', '−'], ['IV', '+', '−']].map(([n, c, s]) => `<div class="${q === n ? 'on' : ''}"><small>QUADRANT ${n}</small>cos t ${c} · sin t ${s}</div>`).join('');
  lab.out(q.length <= 3 ? `t is in <b>Quadrant ${q}</b>: x = cos t is <b>${x > 0 ? 'positive' : 'negative'}</b> and y = sin t is <b>${y > 0 ? 'positive' : 'negative'}</b>. Both coordinates stay between −1 and 1.` : `t lies on the ${q}: the point is (${valTxt('cos', d)}, ${valTxt('sin', d)}).`);
});
CA.drag(uc.svg, (x, y, ph) => {
  let d = CA.norm360(toDeg(Math.atan2(y, x)));
  if (uc.state.snap) { const near = [...CA.SPECIAL].sort((a, b) => Math.abs(a - d) - Math.abs(b - d))[0]; d = Math.abs(near - d) < 4 ? near % 360 : Math.round(d * 2) / 2; } else d = Math.round(d * 10) / 10;
  uc.state.set('t', d);
});

/* ---------- 02 · Pythagorean identity ---------- */
const PY_PRE = {ex2: ['cos', 7, 25, 'IV', 'cos t = 7/25, Quadrant IV'], c1: ['cos', 2, 7, 'I', 'cos t = 2/7, Quadrant I'], c2: ['sin', -3, 5, 'III', 'sin t = −3/5, Quadrant III'], x1: ['sin', 5, 13, 'II', 'sin t = 5/13, Quadrant II']};
CA.lab('pyth-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: 'ex2', options: Object.entries(PY_PRE).map(([k, v]) => [k, v[4]]).concat([['own', 'Set your own']])},
    {type: 'seg', key: 'given', label: 'Given', value: 'cos', options: [['cos', 'cos t'], ['sin', 'sin t']]}, {type: 'number', key: 'n', label: 'Numerator', value: 7, step: 1}, {type: 'number', key: 'd', label: 'Denominator', value: 25, step: 1, min: 1},
    {type: 'seg', key: 'q', label: 'Quadrant of t', value: 'IV', options: [['I', 'I'], ['II', 'II'], ['III', 'III'], ['IV', 'IV']]}],
  plot: UC_WIN, plotLabel: 'Point on the unit circle for the given value', steps: true, readouts: [['cos', 'cos t'], ['sin', 'sin t']]
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = PY_PRE[st.pre]; st.set('given', p[0], true); st.set('n', p[1], true); st.set('d', p[2], true); st.set('q', p[3], true); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const P = lab.plane(), g = st.given, o = g === 'cos' ? 'sin' : 'cos', n = st.n, d = st.d;
  P.param(t => Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.8});
  const fail = msg => { lab.out(msg, 'ca-incorrect'); lab.steps([]); lab.read('cos', '—'); lab.read('sin', '—'); P.render(); };
  if (!Number.isInteger(n) || !Number.isInteger(d) || d <= 0) return fail('Use a whole-number numerator and a positive whole-number denominator.');
  const v = F(n, d);
  if (Math.abs(v.v) > 1) return fail(`${g} t = ${v} is impossible: on the unit circle, ${g} t is a coordinate, so it is between −1 and 1.`);
  if (v.n === 0) return fail(`${g} t = 0 puts t on an axis, not inside a quadrant. Choose a nonzero value.`);
  const sg = CA.signs(st.q);
  if (Math.sign(v.v) !== sg[g]) return fail(`In Quadrant ${st.q}, ${g} t is ${sg[g] > 0 ? 'positive' : 'negative'} (${g === 'cos' ? 'x' : 'y'} ${sg[g] > 0 ? '&gt;' : '&lt;'} 0), so ${g} t = ${v} cannot happen there. Change the sign or the quadrant.`);
  const sq = F(1, 1).sub(v.mul(v)), root = CA.Rad.sqrt(sq), ans = sg[o] > 0 ? root : root.neg();
  const X = g === 'cos' ? v.v : ans.v, Y = g === 'sin' ? v.v : ans.v;
  CA.drawAngle(P, Math.atan2(Y, X) < 0 ? Math.atan2(Y, X) + 2 * PI : Math.atan2(Y, X), {circle: false, point: false, arcR: 0.2});
  P.seg(0, 0, X, 0, {color: 'blue', width: 5}).seg(X, 0, X, Y, {color: 'green', width: 5}).point(X, Y, {color: 'orange', r: 8, label: `(${g === 'cos' ? v : ans.str()}, ${g === 'sin' ? v : ans.str()})`, labelOpt: {size: 12.5}}).render();
  lab.read(g, v.html()); lab.read(o, ans.html());
  lab.steps([['Pythagorean identity', 'cos²t + sin²t = 1'], ['Substitute', g === 'cos' ? `(${v})² + sin²t = 1` : `cos²t + (${v})² = 1`], [`Solve for ${o}²t`, `${o}²t = 1 − ${v.mul(v)} = ${sq}`],
    ['Square root', `${o} t = ±√(${sq}) = ±${root.str()}`], [`Choose the sign · Quadrant ${st.q}`, `${o === 'cos' ? 'x' : 'y'} is ${sg[o] > 0 ? 'positive' : 'negative'}, so ${o} t = ${ans.str()}`]]);
  lab.out(`${o} t = <b>${ans.html()}</b> ≈ ${num(ans.v, 4)}. Check: (${num(X, 4)})² + (${num(Y, 4)})² = ${num(X * X + Y * Y, 4)}.`, 'ca-correct');
});

/* ---------- 03 · special angles: explore and quiz ---------- */
const SP = CA.SPECIAL.slice(0, -1);
let spSel = 30, spQuiz = null, spScore = [0, 0];
const spText = (d, u) => u === 'deg' ? `${d}°` : CA.radText(d);
const coord = d => `(${CA.exact('cos', d).str()}, ${CA.exact('sin', d).str()})`;
const spLab = CA.lab('sp-lab', {
  controls: [{type: 'seg', key: 'unit', label: 'Show angles in', value: 'rad', options: [['rad', 'Radians'], ['deg', 'Degrees']]}],
  top: '<div class="ca-uc-grid" id="sp-grid" role="group" aria-label="Special angles"></div><div class="ca-controls"><button type="button" class="ca-btn" id="sp-quiz"><i class="fa-solid fa-dice"></i> Quiz me</button><button type="button" class="ca-btn ca-btn-outline" id="sp-explore">Back to explore</button><span class="ca-note" id="sp-score" aria-live="polite"></span></div><div id="sp-q"></div>',
  plot: UC_WIN, plotLabel: 'Unit circle with the special angles', readouts: [['t', 'Angle'], ['pt', '(cos t, sin t)'], ['ref', 'Reference angle']]
}, lab => drawSp(lab));
function drawSp(L) {
  const sp = L || spLab, u = sp.state.unit, d = spQuiz ?? spSel, P = sp.plane();
  document.getElementById('sp-grid').innerHTML = SP.map(a => `<button type="button" data-d="${a}" class="${a === d ? 'active' : ''}${spQuiz === null ? '' : ''}">${spText(a, u)}</button>`).join('');
  P.param(t => Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.8});
  SP.forEach(a => { const t = toRad(a); P.seg(0, 0, Math.cos(t), Math.sin(t), {color: 'gray', width: 0.8, opacity: 0.5}); P.point(Math.cos(t), Math.sin(t), {color: 'gray', r: 4}); P.label(1.17 * Math.cos(t), 1.17 * Math.sin(t), spText(a, u), {color: 'gray', anchor: 'middle', dx: 0, dy: 4, size: 10.5, weight: 700}); });
  const t = toRad(d); P.seg(0, 0, Math.cos(t), Math.sin(t), {color: 'orange', width: 3}).point(Math.cos(t), Math.sin(t), {color: 'orange', r: 8, label: spQuiz === null ? coord(d) : '?', labelOpt: {size: 12.5, dx: Math.cos(t) < 0 ? -10 : 10, anchor: Math.cos(t) < 0 ? 'end' : 'start', dy: Math.sin(t) >= 0 ? -14 : 24}}).render();
  sp.read('t', spText(d, u) + (u === 'rad' ? ` (${d}°)` : ` (${CA.radText(d)})`)); sp.read('pt', spQuiz === null ? coord(d) : '?'); sp.read('ref', spQuiz === null ? `${CA.refAngle(d)}° (${CA.radText(CA.refAngle(d))})` : '?');
  sp.out(spQuiz === null ? `At ${spText(d, u)}, the reference angle is ${CA.refAngle(d)}°: start from the first-quadrant point for ${CA.refAngle(d)}° and attach the signs of ${CA.quadName(d).replace('on the ', 'the ')}.` : 'Which point belongs to the highlighted angle? Use the reference angle and the quadrant.');
  document.getElementById('sp-score').textContent = spScore[1] ? `Score: ${spScore[0]} / ${spScore[1]}` : '';
}
document.getElementById('sp-grid').addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (!b || spQuiz !== null) return; spSel = +b.dataset.d; drawSp(); });
document.getElementById('sp-explore').addEventListener('click', () => { spQuiz = null; document.getElementById('sp-q').innerHTML = ''; drawSp(); });
document.getElementById('sp-quiz').addEventListener('click', newQuiz);
function newQuiz() {
  let d; do d = SP[Math.floor(Math.random() * SP.length)]; while (d === spQuiz);
  spQuiz = d; const c = CA.exact('cos', d), s = CA.exact('sin', d), f = v => v.str();
  const cands = [coord(d), `(${f(s)}, ${f(c)})`, `(${f(c.neg())}, ${f(s)})`, `(${f(c)}, ${f(s.neg())})`, `(${f(c.neg())}, ${f(s.neg())})`, `(${f(s.neg())}, ${f(c)})`];
  const opts = [...new Set(cands)].slice(0, 4), order = opts.map((o, i) => [Math.random(), o]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  drawSp();
  CA.choice('sp-q', {q: `Which point is at t = ${spText(d, spLab.state.unit)}?`, options: order, correct: order.indexOf(coord(d)), why: `Reference angle ${CA.refAngle(d)}°, ${CA.quadName(d)}: the point is ${coord(d)}. <button type="button" class="ca-btn ca-btn-outline" id="sp-next">Next angle →</button>`,
    whyWrong: () => `Not quite: find the reference angle (${CA.refAngle(d)}°) and the signs of x and y in ${CA.quadName(d).replace('on the ', 'the ')}. Try another option.`,
    onAnswer: ok => { if (ok) { spScore[0]++; spScore[1]++; } else spScore[1]++; document.getElementById('sp-score').textContent = `Score: ${spScore[0]} / ${spScore[1]}`; const nx = document.getElementById('sp-next'); if (nx) nx.onclick = newQuiz; }});
}

})();

/* reused from 5-3.js */
(() => {
'use strict';
const {fmt, num, F, Rad, toRad, toDeg} = CA;
const PI = Math.PI;
const UC_WIN = {xmin: -1.5, xmax: 1.5, ymin: -1.3, ymax: 1.3, w: 520, h: 400, xstep: 0.5, ystep: 0.5};
const FN = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot'];
const ex = (v, html = true) => v === undefined ? '<span class="ca-bad">undefined</span>' : html ? v.html() : v.str();
const table6 = (vals, forms) => `<div class="ca-scroll-x"><table class="ca-data-table"><tr>${FN.map(f => `<th>${f} t</th>`).join('')}</tr><tr>${FN.map(f => `<td class="ca-muted">${forms[f]}</td>`).join('')}</tr><tr>${FN.map(f => `<td class="hl">${ex(vals[f])}</td>`).join('')}</tr></table></div>`;


/* ---------- 01 · unit circle point ---------- */
const ANG = CA.SPECIAL.slice(0, -1);
CA.lab('six-lab', {
  controls: [{type: 'select', key: 'd', label: 'Angle t', value: '300', options: ANG.map(d => [String(d), `${CA.radText(d)} (${d}°)`])}],
  plot: UC_WIN, plotLabel: 'Point on the unit circle', readouts: [['pt', 'Point (x, y)'], ['q', 'Location']], middle: '<div id="six-table"></div>', steps: true
}, (lab, st) => {
  const d = +st.d, x = CA.exact('cos', d), y = CA.exact('sin', d), P = lab.plane(), th = toRad(d);
  CA.drawAngle(P, th, {ref: true, pointLabel: `(${x.str()}, ${y.str()})`}).render();
  const vals = {}; FN.forEach(f => vals[f] = CA.exact(f, d));
  document.getElementById('six-table').innerHTML = table6(vals, {sin: 'y', cos: 'x', tan: 'y/x', csc: '1/y', sec: '1/x', cot: 'x/y'});
  lab.read('pt', `(${x.html()}, ${y.html()})`); lab.read('q', CA.quadName(d));
  const st6 = [['sin t = y', ex(vals.sin)], ['cos t = x', ex(vals.cos)]];
  st6.push(['tan t = y/x', x.isZero() ? 'x = 0, so tan t is undefined' : `(${y.str()}) ÷ (${x.str()}) = ${vals.tan.str()}`]);
  st6.push(['cot t = x/y', y.isZero() ? 'y = 0, so cot t is undefined' : `(${x.str()}) ÷ (${y.str()}) = ${vals.cot.str()}`]);
  st6.push(['sec t = 1/x', x.isZero() ? 'x = 0, so sec t is undefined' : `1 ÷ (${x.str()}) = ${vals.sec.str()}${vals.sec.isRational() ? '' : ' (rationalized)'}`]);
  st6.push(['csc t = 1/y', y.isZero() ? 'y = 0, so csc t is undefined' : `1 ÷ (${y.str()}) = ${vals.csc.str()}${vals.csc.isRational() ? '' : ' (rationalized)'}`]);
  lab.steps(st6);
  lab.out(`Notice the pairs: csc is the reciprocal of sin, sec of cos, and cot of tan. A reciprocal keeps the sign, so all six signs follow from the signs of x and y.`);
});

})();

/* reused from 6-1.js */
(() => {
'use strict';
const {fmt, num, F, toRad} = CA;
const PI = Math.PI, $ = id => document.getElementById(id);
const isSpecial = d => Number.isInteger(d) && (d % 30 === 0 || d % 45 === 0);


/* ---------- 01 · unrolling the circle ---------- */
const CX = -2.4;
CA.lab('unroll-lab', {
  controls: [{type: 'seg', key: 'fn', label: 'Function', value: 'sin', options: [['sin', 'y = sin x'], ['cos', 'y = cos x']]}, {type: 'range', key: 'd', label: 'x =', min: 0, max: 360, step: 5, value: 120, fmt: v => `${CA.radText(v)} (${v}°)`}],
  plot: {xmin: -3.7, xmax: 6.75, ymin: -1.6, ymax: 1.6, xpi: F(1, 2), xtickMin: 0, w: 640, h: 300}, plotLabel: 'Unit circle and the graph traced so far', readouts: [['x', 'x'], ['v', 'value'], ['pt', 'graph point']]
}, (lab, st) => {
  const d = st.d, x = toRad(d), fn = st.fn, f = Math[fn], y = f(x), P = lab.plane();
  P.param(t => CX + Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.8});
  if (d > 0) P.param(t => CX + 0.3 * Math.cos(t), t => 0.3 * Math.sin(t), 0, x, {color: 'orange', width: 2, arrow: true});
  P.seg(CX, 0, CX + Math.cos(x), Math.sin(x), {color: 'orange', width: 2.4});
  P.curve(f, {from: 0, to: 2 * PI, color: 'gray', dash: '6 6', width: 1.6});
  if (d > 0) P.curve(f, {from: 0, to: x, color: fn === 'sin' ? 'orange' : 'blue', width: 3.6});
  if (fn === 'sin') { P.seg(CX + Math.cos(x), 0, CX + Math.cos(x), y, {color: 'orange', width: 4}).seg(CX + Math.cos(x), y, x, y, {color: 'gray', dash: '4 5', width: 1.6}).seg(x, 0, x, y, {color: 'orange', width: 4}); }
  else { P.seg(CX, 0, CX + Math.cos(x), 0, {color: 'blue', width: 4}).seg(x, 0, x, y, {color: 'blue', width: 4}); }
  for (let k = 0; k <= d; k += 15) if (isSpecial(k)) P.point(toRad(k), f(toRad(k)), {color: 'green', r: 3.5});
  P.point(CX + Math.cos(x), Math.sin(x), {color: 'orange', r: 6}).point(x, y, {color: fn === 'sin' ? 'orange' : 'blue', r: 7}).render();
  const val = isSpecial(d) ? CA.exact(fn, d).str() : num(y, 4);
  lab.read('x', `${CA.radText(d)} = ${d}°`); lab.read('v', `${fn} x = ${val}`); lab.read('pt', `(${CA.radText(d)}, ${val})`);
  lab.out(fn === 'sin' ? `The height of the point on the circle is sin x = ${val}; the same height is plotted above x = ${CA.radText(d)}. One trip around the circle (2π) draws one full period.` : `The x-coordinate of the point on the circle is cos x = ${val}; it becomes the height of the cosine graph above x = ${CA.radText(d)}. Cosine starts at its maximum, 1.`);
});

})();

/* reused from 6-2-part-3.js */
(() => {
'use strict';
const {fmt, num, F} = CA;
const PI = Math.PI, nx = v => CA.niceX(v);
const ASY = (Q, start, step) => CA.gridPts(start, step, Q.o.xmin, Q.o.xmax).forEach(x => Q._seg(x, Q.o.ymin - 1, x, Q.o.ymax + 1, {dash: '7 6', color: 'purple', width: 1.8}));
const breaksFor = (start, step, a, b) => CA.gridPts(start, step, a - 30 * step, b + 30 * step);
const rangeTxt = (A, D) => `(−∞, ${nx(D - Math.abs(A))}] ∪ [${nx(D + Math.abs(A))}, ∞)`;


/* ---------- 03 · all six graphs ---------- */
const SIX = {
  sin: {f: Math.sin, br: [], dom: '(−∞, ∞)', rng: '[−1, 1]', per: '2π', sym: 'odd (origin)', asy: 'none'},
  cos: {f: Math.cos, br: [], dom: '(−∞, ∞)', rng: '[−1, 1]', per: '2π', sym: 'even (y-axis)', asy: 'none'},
  tan: {f: Math.tan, start: PI / 2, step: PI, dom: 'x ≠ π/2 + kπ', rng: '(−∞, ∞)', per: 'π', sym: 'odd (origin)', asy: 'x = π/2 + kπ'},
  cot: {f: x => 1 / Math.tan(x), start: 0, step: PI, dom: 'x ≠ kπ', rng: '(−∞, ∞)', per: 'π', sym: 'odd (origin)', asy: 'x = kπ'},
  sec: {f: x => 1 / Math.cos(x), start: PI / 2, step: PI, dom: 'x ≠ π/2 + kπ', rng: '(−∞, −1] ∪ [1, ∞)', per: '2π', sym: 'even (y-axis)', asy: 'x = π/2 + kπ'},
  csc: {f: x => 1 / Math.sin(x), start: 0, step: PI, dom: 'x ≠ kπ', rng: '(−∞, −1] ∪ [1, ∞)', per: '2π', sym: 'odd (origin)', asy: 'x = kπ'}
};
CA.lab('six-graph-lab', {
  controls: [{type: 'seg', key: 'fn', label: 'Function', value: 'sec', options: Object.keys(SIX).map(k => [k, `y = ${k} x`])}],
  plot: {xmin: -2 * PI, xmax: 2 * PI, ymin: -4, ymax: 4, xpi: F(1, 2), w: 620, h: 330}, plotLabel: 'Parent trigonometric graph', readouts: [['per', 'Period'], ['dom', 'Domain'], ['rng', 'Range'], ['sym', 'Symmetry'], ['asy', 'Asymptotes']]
}, (lab, st) => {
  const S = SIX[st.fn], P = lab.plane();
  if (S.step) P.draw(Q => ASY(Q, S.start, S.step));
  if (st.fn === 'sec') P.curve(Math.cos, {color: 'gray', dash: '6 6', width: 1.8}); if (st.fn === 'csc') P.curve(Math.sin, {color: 'gray', dash: '6 6', width: 1.8});
  P.curve(S.f, {color: 'orange', width: 3.2, breaks: S.step ? breaksFor(S.start, S.step, -2 * PI, 2 * PI) : [], samples: 2400}).render();
  ['per', 'dom', 'rng', 'sym', 'asy'].forEach(k => lab.read(k, S[k]));
  lab.out({sin: 'The sine wave: the guide curve for cosecant.', cos: 'The cosine wave: the guide curve for secant.', tan: 'Rising branches between asymptotes at the zeros of cosine.', cot: 'Falling branches between asymptotes at the zeros of sine.', sec: 'U-shaped branches touching the cosine guide at its maxima and minima.', csc: 'U-shaped branches touching the sine guide at its maxima and minima.'}[st.fn]);
});
const mini = (f, start) => CA.plotSVG({xmin: -PI, xmax: PI, ymin: -4, ymax: 4, xpi: F(1, 2), equal: false}, P => P.curve(f, {color: 'orange', width: 3, breaks: breaksFor(start, PI, -PI, PI), samples: 800}), 'Mystery graph');
CA.cards('sc-cards', [
  {expr: mini(x => 1 / Math.sin(x), 0), correct: 2, why: 'Asymptotes at multiples of π and a branch opening up on (0, π): csc x.'},
  {expr: mini(x => -1 / Math.cos(x), PI / 2), correct: 1, why: 'Asymptotes at ±π/2 and a branch opening down through (0, −1): −sec x.'},
  {expr: mini(x => 1 / Math.cos(x), PI / 2), correct: 0, why: 'Asymptotes at ±π/2 and a branch opening up through (0, 1): sec x.'},
  {expr: mini(x => -1 / Math.sin(x), 0), correct: 3, why: 'Asymptotes at multiples of π and a branch opening down on (0, π): −csc x.'}
], {options: ['y = sec x', 'y = −sec x', 'y = csc x', 'y = −csc x']});

})();

/* ---------- guided problems ---------- */
(() => {
'use strict';
CA.guided('13', [
  {q: '150° in radians is:', opts: ['5π/6', '3π/4', '5π/3', '2π/3'], correct: 0, hint: 'Multiply by π/180°.', why: '150π/180 = 5π/6.', ref: {panel: 'radians', what: 'converting degrees to radians', body: '<p>Multiply degrees by π/180° and simplify the fraction.</p>'}},
  {q: '4π/3 radians in degrees is:', opts: ['240°', '120°', '270°', '225°'], correct: 0, hint: 'π = 180°.', why: '4 · 180°/3 = 240°.'},
  {q: 'The point on the unit circle at t = 2π/3 is:', opts: ['(−1/2, √3/2)', '(1/2, √3/2)', '(−√3/2, 1/2)', '(−1/2, −√3/2)'], correct: 0, hint: 'Reference angle π/3, Quadrant II.', why: 'cos(2π/3) = −1/2 and sin(2π/3) = √3/2.', ref: {panel: 'unit-circle', what: 'the definition (cos t, sin t)', body: '<p>The point where the angle t meets the unit circle is (cos t, sin t).</p>'}},
  {q: 'tan(π/4) = ?', opts: ['1', '√2/2', '√3', '0'], correct: 0, hint: 'tan t = sin t/cos t.', why: '(√2/2)/(√2/2) = 1.', ref: {panel: 'special', what: 'the special values', body: '<p>sin(π/4) = cos(π/4) = √2/2.</p>'}},
  {q: 'sec(π/3) = ?', opts: ['2', '1/2', '2/√3', '√3'], correct: 0, hint: 'sec t = 1/cos t.', why: 'cos(π/3) = 1/2, so sec(π/3) = 2.'},
  {q: 'Which value is undefined?', opts: ['tan(π/2)', 'sin(π/2)', 'cot(π/2)', 'cos(π)'], correct: 0, hint: 'Look for a zero denominator.', why: 'tan(π/2) = sin(π/2)/cos(π/2) = 1/0.', ref: {panel: 'six', what: 'where the functions are undefined', body: '<p>tan and sec are undefined where x = cos t = 0; cot and csc where y = sin t = 0.</p>'}},
  {q: 'If cos t = 5/13 and t is in Quadrant IV, then sin t = ?', opts: ['−12/13', '12/13', '−5/12', '8/13'], correct: 0, hint: 'sin²t = 1 − cos²t; sine is negative in Quadrant IV.', why: 'sin²t = 1 − 25/169 = 144/169, so sin t = −12/13.', ref: {panel: 'identities', what: 'the Pythagorean identity', body: '<p>sin²t + cos²t = 1; choose the sign from the quadrant.</p>'}},
  {q: '1 + tan²t equals:', opts: ['sec²t', 'csc²t', 'cot²t', '1'], correct: 0, hint: 'Divide sin²t + cos²t = 1 by cos²t.', why: 'tan²t + 1 = 1/cos²t = sec²t.'},
  {q: 'The period of y = tan x is:', opts: ['π', '2π', 'π/2', '4π'], correct: 0, hint: 'The tangent graph repeats between consecutive asymptotes.', why: 'tan(x + π) = tan x.', ref: {panel: 'graphs', what: 'the periods of the six functions', body: '<p>sin, cos, sec, csc: period 2π. tan, cot: period π.</p>'}},
  {q: 'Which function is even?', opts: ['cos x', 'sin x', 'tan x', 'csc x'], correct: 0, hint: 'Even means f(−x) = f(x).', why: 'cos(−x) = cos x; the others are odd.'}
]);
})();
