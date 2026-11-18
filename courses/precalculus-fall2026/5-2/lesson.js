/* Section 5.2 · Unit Circle: Sine and Cosine Functions — interactive activities */
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
const UC_PRE = [['30', 't = 30° (π/6)'], ['83.6', 'Example 1 (a) · t ≈ 83.6°'], ['198.5', 'Example 1 (b) · t ≈ 198.5°'], ['135', 't = 135°'], ['240', 't = 240°'], ['300', 't = 300°'], ['90', 't = 90°'], ['180', 't = 180°']];
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
const PY_PRE = {ex2: ['cos', 7, 25, 'IV', 'Example 2 · cos t = 7/25, Quadrant IV'], c1: ['cos', 2, 7, 'I', 'Checkpoint 2 (1) · cos t = 2/7, Quadrant I'], c2: ['sin', -3, 5, 'III', 'Checkpoint 2 (2) · sin t = −3/5, Quadrant III'], x1: ['sin', 5, 13, 'II', 'sin t = 5/13, Quadrant II']};
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

/* ---------- 04 · reference angles → exact values ---------- */
const REF_PRE = [['120', 'deg', 'Example 3 (i) · 120°'], ['7π/6', 'rad', 'Example 3 (ii) · 7π/6'], ['315', 'deg', 'Example 3 (iii) · 315°'], ['800', 'deg', 'Example 3 (iv) · 800°'],
  ['5π/6', 'rad', 'Checkpoint 3 · 5π/6'], ['238', 'deg', 'Checkpoint 3 · 238°'], ['150', 'deg', 'Example 4 (a) · 150°'], ['13π/4', 'rad', 'Example 4 (b) · 13π/4'],
  ['23π/6', 'rad', 'Checkpoint 4 (a) · 23π/6'], ['480', 'deg', 'Checkpoint 4 (b) · 480°']];
CA.lab('ref-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Angle', value: '6', options: REF_PRE.map((p, i) => [String(i), p[2]]).concat([['own', 'Type your own']])},
    {type: 'seg', key: 'unit', label: 'Unit', value: 'deg', options: [['deg', 'Degrees'], ['rad', 'Radians']]}, {type: 'text', key: 'val', label: 't =', value: '150', placeholder: '150 or 13π/4'}],
  plot: UC_WIN, plotLabel: 'Angle with its reference angle on the unit circle', readouts: [['cot', 'Coterminal angle'], ['ref', 'Reference angle'], ['cos', 'cos t'], ['sin', 'sin t']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = REF_PRE[+st.pre]; st.set('unit', p[1], true); st.set('val', p[0], true); }
  else if (key === 'val' || key === 'unit') st.set('pre', 'own', true);
  const A = CA.parseAngle(st.val, st.unit), P = lab.plane();
  if (!A) { lab.out('Type an angle such as 150, 800, 7π/6, or 13π/4.', 'ca-incorrect'); lab.steps([]); P.render(); return; }
  const I = CA.angleInfo(A), d = Math.round(I.deg * 1e6) / 1e6, steps = I.steps.slice();
  const exact = isSpecial(d), r = I.refDeg !== null ? Math.round(I.refDeg * 1e6) / 1e6 : null;
  const cosT = exact ? CA.exact('cos', d).html() : num(Math.cos(toRad(d)), 4), sinT = exact ? CA.exact('sin', d).html() : num(Math.sin(toRad(d)), 4);
  if (r !== null) {
    const rc = isSpecial(r) ? CA.exact('cos', r).str() : `≈ ${num(Math.cos(toRad(r)), 4)}`, rs = isSpecial(r) ? CA.exact('sin', r).str() : `≈ ${num(Math.sin(toRad(r)), 4)}`, sg = CA.signs(I.quad);
    steps.push([`Values at the reference angle ${I.refText}`, `cos ${I.refText} = ${rc}, sin ${I.refText} = ${rs}`]);
    steps.push([`Signs in Quadrant ${I.quad}`, `x ${sg.cos > 0 ? '&gt;' : '&lt;'} 0 and y ${sg.sin > 0 ? '&gt;' : '&lt;'} 0: cos t = ${exact ? CA.exact('cos', d).str() : num(Math.cos(toRad(d)), 4)}, sin t = ${exact ? CA.exact('sin', d).str() : num(Math.sin(toRad(d)), 4)}`]);
  } else steps.push(['Read the axis point', `(cos t, sin t) = (${CA.exact('cos', d).str()}, ${CA.exact('sin', d).str()})`]);
  lab.steps(steps); lab.read('cot', I.cotText); lab.read('ref', I.refText ?? 'quadrantal'); lab.read('cos', cosT); lab.read('sin', sinT);
  const th = toRad(d);
  if (r !== null) { const axis = d <= 90 ? 0 : d <= 270 ? PI : 2 * PI; CA.sector(P, 0.5, Math.min(th, axis), Math.max(th, axis), {color: 'purple', fillOpacity: 0.28}); }
  CA.drawAngle(P, th, {ref: r !== null, point: true, pointLabel: exact ? `(${CA.exact('cos', d).str()}, ${CA.exact('sin', d).str()})` : '', label: I.label}).render();
  lab.out(exact ? `cos t = <b>${cosT}</b> and sin t = <b>${sinT}</b>. The size comes from the reference angle; the signs come from the quadrant.` : `${I.label} is not a special angle, so its reference angle ${I.refText} needs a calculator: cos t ≈ ${cosT}, sin t ≈ ${sinT}.`);
});

/* ---------- guided problems ---------- */
const UCfig = (d, lab) => { const t = toRad(d), x = Math.cos(t), y = Math.sin(t); return `<svg viewBox="0 0 220 200" role="img" aria-label="Point on the unit circle"><line x1="10" y1="100" x2="210" y2="100" stroke="var(--cp-axis)"/><line x1="110" y1="10" x2="110" y2="190" stroke="var(--cp-axis)"/><circle cx="110" cy="100" r="75" fill="none" stroke="var(--cp-gray)" stroke-width="1.6"/><line x1="110" y1="100" x2="${110 + 75 * x}" y2="${100 - 75 * y}" stroke="var(--cp-orange)" stroke-width="2.6"/><circle cx="${110 + 75 * x}" cy="${100 - 75 * y}" r="5.5" fill="var(--cp-orange)"/><text x="${110 + 75 * x + (x < 0 ? -8 : 8)}" y="${100 - 75 * y - 9}" font-size="12" font-weight="800" text-anchor="${x < 0 ? 'end' : 'start'}" fill="var(--cp-text)">${lab}</text></svg>`; };
CA.guided('52', [
  {q: 'The terminal side of t meets the unit circle at (−0.6, 0.8). What is cos t?', fig: UCfig(126.87, '(−0.6, 0.8)'), opts: ['−0.6', '0.8', '−0.75', '0.6'], correct: 0, hint: 'cos t is the x-coordinate.', why: 'cos t = x = −0.6 (and sin t = y = 0.8).'},
  {q: 'What is sin(5π/6)?', opts: ['1/2', '−1/2', '√3/2', '−√3/2'], correct: 0, hint: '5π/6 is in Quadrant II with reference angle π/6.', why: 'sin(π/6) = 1/2, and y is positive in Quadrant II, so sin(5π/6) = 1/2.'},
  {q: 'What is cos(210°)?', opts: ['−√3/2', '√3/2', '−1/2', '1/2'], correct: 0, hint: 'Reference angle 30°, Quadrant III.', why: 'cos 30° = √3/2 and x is negative in Quadrant III, so cos 210° = −√3/2.'},
  {q: 'If cos t = 7/25 and t is in Quadrant IV, what is sin t?', opts: ['−24/25', '24/25', '−18/25', '18/25'], correct: 0, hint: 'Use cos²t + sin²t = 1, then the sign of y in Quadrant IV.', why: 'sin²t = 1 − 49/625 = 576/625, so sin t = ±24/25. In Quadrant IV y &lt; 0: sin t = −24/25.', ref: {panel: 'pythagorean', what: 'Example 2', body: '<p>cos t = <b>7/25</b> and t is in <b>Quadrant IV</b>. Find sin t.</p>'}},
  {q: 'If sin t = −3/5 and t is in Quadrant III, what is cos t?', opts: ['−4/5', '4/5', '−2/5', '−√34/5'], correct: 0, hint: 'cos²t = 1 − 9/25.', why: 'cos²t = 16/25, so cos t = ±4/5; x &lt; 0 in Quadrant III, so cos t = −4/5.', ref: {problem: 4, what: 'the same method'}},
  {q: 'What is the reference angle of 7π/6?', opts: ['π/6', '7π/6', '5π/6', 'π/3'], correct: 0, hint: '7π/6 is in Quadrant III.', why: '|π − 7π/6| = π/6.', ref: {panel: 'reference', what: 'Example 3 (ii)', body: '<p>Find the reference angle of <b>7π/6</b>.</p>'}},
  {q: 'In which quadrant are both sin t and cos t negative?', keep: true, opts: ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'], correct: 2, hint: 'Both x and y are negative.', why: 'In Quadrant III both coordinates of the point are negative.'},
  {q: 'What is the range of y = sin t?', opts: ['[−1, 1]', '(−∞, ∞)', '[0, 1]', '[−π, π]'], correct: 0, hint: 'sin t is a coordinate of a point on the unit circle.', why: 'The y-coordinate of a point on the unit circle is between −1 and 1, inclusive.'},
  {q: 'What is cos(13π/4)?', opts: ['−√2/2', '√2/2', '−1/2', '1'], correct: 0, hint: '13π/4 − 2π = 5π/4.', why: '5π/4 is in Quadrant III with reference angle π/4, so cos(13π/4) = −√2/2.', ref: {panel: 'reference', what: 'Example 4 (b)', body: '<p>Use the reference angle to find cos(<b>13π/4</b>) and sin(13π/4).</p>'}},
  {q: 'What is sin(480°)?', opts: ['√3/2', '−√3/2', '1/2', '−1/2'], correct: 0, hint: '480° − 360° = 120°.', why: '120° is in Quadrant II with reference angle 60°: sin 480° = sin 120° = √3/2.'}
]);
})();
