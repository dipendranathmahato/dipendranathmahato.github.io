/* Section 5.3 · The Other Trigonometric Functions — interactive activities */
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
  controls: [{type: 'select', key: 'd', label: 'Angle t', value: '300', options: ANG.map(d => [String(d), `${CA.radText(d)} (${d}°)${d === 300 ? ' · Example 1' : d === 135 ? ' · Checkpoint 1' : ''}`])}],
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

/* ---------- 02 · point on a circle of radius r ---------- */
const PT_PRE = {ex2: [10, 'x', 2, 'IV', 'Example 2 · (2, y) on x² + y² = 10, Quadrant IV'], cp2: [20, 'y', -4, 'III', 'Checkpoint 2 (i) · (x, −4) on x² + y² = 20, Quadrant III'], a: [25, 'x', -3, 'II', '(−3, y) on x² + y² = 25, Quadrant II']};
CA.lab('pt-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: 'ex2', options: Object.entries(PT_PRE).map(([k, v]) => [k, v[4]]).concat([['own', 'Set your own']])},
    {type: 'number', key: 'r2', label: 'r² (right side of x² + y² = r²)', value: 10, step: 1, min: 1}, {type: 'seg', key: 'known', label: 'Known coordinate', value: 'x', options: [['x', 'x'], ['y', 'y']]},
    {type: 'number', key: 'k', label: 'Its value', value: 2, step: 1}, {type: 'seg', key: 'q', label: 'Quadrant', value: 'IV', options: [['I', 'I'], ['II', 'II'], ['III', 'III'], ['IV', 'IV']]}],
  plot: {w: 520, h: 400}, plotLabel: 'Point on a circle of radius r', middle: '<div id="pt-table"></div>', steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = PT_PRE[st.pre]; st.set('r2', p[0], true); st.set('known', p[1], true); st.set('k', p[2], true); st.set('q', p[3], true); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const r2 = st.r2, k = st.k, kn = st.known, other = kn === 'x' ? 'y' : 'x', sg = CA.signs(st.q), sgn = {x: sg.cos, y: sg.sin};
  const fail = m => { lab.out(m, 'ca-incorrect'); lab.steps([]); document.getElementById('pt-table').innerHTML = ''; lab.plane({xmin: -5, xmax: 5, ymin: -4, ymax: 4}).render(); };
  if (!Number.isInteger(r2) || r2 < 1 || !Number.isInteger(k)) return fail('Use whole numbers: r² ≥ 1 and an integer coordinate.');
  if (k === 0 || Math.sign(k) !== sgn[kn]) return fail(`In Quadrant ${st.q}, ${kn} is ${sgn[kn] > 0 ? 'positive' : 'negative'}. Change the value or the quadrant.`);
  if (k * k >= r2) return fail(`${kn}² = ${k * k} must be less than r² = ${r2}; otherwise the point is not inside a quadrant of this circle.`);
  const o2 = r2 - k * k, oAbs = Rad.sqrt(o2), o = sgn[other] > 0 ? oAbs : oAbs.neg(), r = Rad.sqrt(r2), K = Rad.of(k);
  const X = kn === 'x' ? K : o, Y = kn === 'y' ? K : o;
  const vals = {sin: Y.div(r), cos: X.div(r), tan: Y.div(X), cot: X.div(Y), sec: r.div(X), csc: r.div(Y)};
  document.getElementById('pt-table').innerHTML = table6(vals, {sin: 'y/r', cos: 'x/r', tan: 'y/x', csc: 'r/y', sec: 'r/x', cot: 'x/y'});
  const R = Math.sqrt(r2), P = lab.plane({xmin: -1.35 * R, xmax: 1.35 * R, ymin: -1.2 * R, ymax: 1.2 * R});
  P.param(t => R * Math.cos(t), t => R * Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.8});
  P.seg(0, 0, X.v, 0, {color: 'blue', width: 4}).seg(X.v, 0, X.v, Y.v, {color: 'green', width: 4}).seg(0, 0, X.v, Y.v, {color: 'orange', width: 3});
  P.label(X.v / 2, Y.v / 2, `r = ${r.str()}`, {color: 'orange', anchor: 'middle', dx: 0, dy: Y.v > 0 ? -10 : 20});
  P.point(X.v, Y.v, {color: 'orange', r: 7, label: `(${X.str()}, ${Y.str()})`}).render();
  lab.steps([['Radius', `r² = ${r2}, so r = √${r2} = ${r.str()}`], [`Find ${other}`, `${kn === 'x' ? `(${k})² + y²` : `x² + (${k})²`} = ${r2} → ${other}² = ${r2} − ${k * k} = ${o2} → ${other} = ±${oAbs.str()}`],
    [`Sign of ${other} in Quadrant ${st.q}`, `${other} = ${o.str()}`], ['Six values (rationalized)', FN.map(f => `${f} t = ${vals[f].str()}`).join(';  ')]]);
  lab.out(`The point is (${X.str()}, ${Y.str()}) and r = ${r.str()}. Check a pair: sin t · csc t = (${vals.sin.str()})(${vals.csc.str()}) = ${vals.sin.mul(vals.csc).str()}.`, 'ca-correct');
});

/* ---------- 03 · special-angle table ---------- */
const TAB_OPTS = ['', '1/2', '√2/2', '√3/2', '1', '√3', '√3/3', '2', '2√3/3', '√2', 'undefined'];
const TAB_ANG = [30, 45, 60];
const tab = document.getElementById('tab-table');
tab.innerHTML = `<tr><th>t</th>${FN.map(f => `<th>${f} t</th>`).join('')}</tr>` + TAB_ANG.map(d => `<tr><th>${CA.radText(d)} (${d}°)</th>${FN.map(f => `<td><select data-ans="${CA.exact(f, d).str()}" aria-label="${f} of ${d} degrees">${TAB_OPTS.map(o => `<option value="${o}">${o || 'choose'}</option>`).join('')}</select></td>`).join('')}</tr>`).join('');
const tsel = [...tab.querySelectorAll('select')], tout = document.getElementById('tab-out');
document.getElementById('tab-check').addEventListener('click', () => {
  let ok = 0, blank = 0; tsel.forEach(s => { s.classList.remove('right', 'wrong'); if (!s.value) { blank++; return; } const r = s.value === s.dataset.ans; s.classList.add(r ? 'right' : 'wrong'); if (r) ok++; });
  tout.className = 'ca-feedback ' + (ok === tsel.length ? 'ca-correct' : '');
  tout.innerHTML = ok === tsel.length ? '✓ All 18 values are correct. Notice the patterns: csc, sec, and cot are the reciprocals of sin, cos, and tan, and the 30° and 60° rows swap sin with cos.' : `${ok} of ${tsel.length} correct${blank ? `, ${blank} blank` : ''}. Red cells need another look: compute each from x and y, then rationalize.`;
});
document.getElementById('tab-fill').addEventListener('click', () => { tsel.forEach(s => { s.value = s.dataset.ans; s.classList.remove('wrong'); s.classList.add('right'); }); tout.className = 'ca-feedback'; tout.textContent = 'Answers shown. Clear the table and try it again from memory.'; });
document.getElementById('tab-clear').addEventListener('click', () => { tsel.forEach(s => { s.value = ''; s.classList.remove('right', 'wrong'); }); tout.className = 'ca-feedback'; tout.textContent = 'Choose a value in each cell, then check.'; });

/* ---------- 04 · even and odd ---------- */
CA.lab('eo-lab', {
  controls: [{type: 'range', key: 't', label: 't =', min: 0, max: 360, step: 5, value: 40, fmt: v => v + '°'}],
  plot: UC_WIN, plotLabel: 'Angles t and −t on the unit circle', middle: '<div id="eo-table"></div>'
}, (lab, st) => {
  const d = st.t, th = toRad(d), x = Math.cos(th), y = Math.sin(th), P = lab.plane();
  P.param(t => Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.8});
  CA.drawAngle(P, th, {circle: false, point: false, arcR: 0.22}); CA.drawAngle(P, -th, {circle: false, point: false, color: 'purple', arcR: 0.32});
  P.seg(x, y, x, -y, {color: 'gray', dash: '5 5', width: 1.8});
  P.point(x, y, {color: 'orange', r: 7, label: `t: (${num(x, 3)}, ${num(y, 3)})`}).point(x, -y, {color: 'purple', r: 7, label: `−t: (${num(x, 3)}, ${num(-y, 3)})`}).render();
  const row = f => { const a = CA.trig[f](th), b = CA.trig[f](-th), bad = v => !Number.isFinite(v) || Math.abs(v) > 1e6; return `<tr><th>${f}</th><td>${bad(a) ? 'undefined' : num(a, 4)}</td><td>${bad(b) ? 'undefined' : num(b, 4)}</td><td>${['cos', 'sec'].includes(f) ? 'even: same value' : 'odd: opposite value'}</td></tr>`; };
  document.getElementById('eo-table').innerHTML = `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>f</th><th>f(${d}°)</th><th>f(−${d}°)</th><th>property</th></tr>${FN.map(row).join('')}</table></div>`;
  lab.out(`Reflecting across the x-axis keeps x = ${num(x, 3)} and changes y = ${num(y, 3)} to ${num(-y, 3)}. Functions built from x alone (cos, sec) stay the same; functions that use y once (sin, csc, tan, cot) change sign.`);
});
CA.cards('eo-cards', FN.map(f => ({expr: `y = ${f} x`, correct: ['cos', 'sec'].includes(f) ? 0 : 1, why: ['cos', 'sec'].includes(f) ? `${f}(−x) = ${f} x: it depends only on the x-coordinate.` : `${f}(−x) = −${f} x: it changes sign with y.`})), {options: ['Even', 'Odd']});

/* ---------- 05 · simplification walker ---------- */
const sec = x => 1 / Math.cos(x), csc = x => 1 / Math.sin(x), cot = x => Math.cos(x) / Math.sin(x);
CA.proof('id-proof', [
  {title: 'Example 3 (iv) · tan(−x)(csc x + cot(−x))', goal: 'Simplify <b>tan(−x)(csc x + cot(−x))</b>.', done: '✓ Simplified: tan(−x)(csc x + cot(−x)) = <b>1 − sec x</b>.',
    lines: [['tan(−x)(csc x + cot(−x))', 'Start'], ['= −tan x (csc x − cot x)', 'Odd functions: tan(−x) = −tan x, cot(−x) = −cot x'], ['= −tan x csc x + tan x cot x', 'Distribute'], ['= −(sin x/cos x)(1/sin x) + tan x · (1/tan x)', 'Quotient and reciprocal identities'], ['= −1/cos x + 1', 'Cancel'], ['= 1 − sec x', 'Reciprocal identity']],
    lhs: x => Math.tan(-x) * (csc(x) + cot(-x)), rhs: x => 1 - sec(x)},
  {title: 'Checkpoint 3 (i) · cot(−x) sec(−x)', goal: 'Simplify <b>cot(−x) sec(−x)</b>.', done: '✓ Simplified: cot(−x) sec(−x) = <b>−csc x</b>.',
    lines: [['cot(−x) sec(−x)', 'Start'], ['= (−cot x)(sec x)', 'cot is odd, sec is even'], ['= −(cos x/sin x)(1/cos x)', 'Quotient and reciprocal identities'], ['= −1/sin x', 'Cancel cos x'], ['= −csc x', 'Reciprocal identity']],
    lhs: x => cot(-x) * sec(-x), rhs: x => -csc(x)},
  {title: 'Checkpoint 3 (ii) · sin x (csc(−x) + cot x)', goal: 'Simplify <b>sin x (csc(−x) + cot x)</b>.', done: '✓ Simplified: sin x (csc(−x) + cot x) = <b>cos x − 1</b>.',
    lines: [['sin x (csc(−x) + cot x)', 'Start'], ['= sin x (−csc x + cot x)', 'csc is odd'], ['= −sin x · (1/sin x) + sin x · (cos x/sin x)', 'Distribute; reciprocal and quotient identities'], ['= −1 + cos x', 'Cancel sin x'], ['= cos x − 1', 'Rearrange']],
    lhs: x => Math.sin(x) * (csc(-x) + cot(x)), rhs: x => Math.cos(x) - 1}
], {label: 'Expression'});

/* ---------- 06 · calculator ---------- */
CA.lab('calc-lab', {
  controls: [{type: 'text', key: 'a', label: 'Angle', value: '40', placeholder: '40 or 2π/7'}, {type: 'seg', key: 'unit', label: 'The angle is in', value: 'deg', options: [['deg', 'degrees'], ['rad', 'radians']]},
    {type: 'seg', key: 'mode', label: 'Calculator mode', value: 'deg', options: [['deg', 'DEG'], ['rad', 'RAD']]}],
  middle: '<div id="calc-table"></div>'
}, (lab, st) => {
  const A = CA.parseAngle(st.a, st.unit), T = document.getElementById('calc-table');
  if (!A || (st.unit === 'deg' && A.kind !== 'deg')) { T.innerHTML = ''; lab.out('Type an angle such as 40 (degrees) or 2π/7 or 1.3 (radians).', 'ca-incorrect'); return; }
  const shown = A.kind === 'deg' ? fmt(A.deg) : A.kind === 'pi' ? `(${CA.piStr(A.f)})` : fmt(A.v), x = A.v, wrongX = st.mode === 'deg' ? (A.kind === 'deg' ? x : (A.kind === 'pi' ? A.f.v * PI : A.v) * PI / 180) : (A.kind === 'deg' ? A.deg : x);
  const match = (st.unit === 'deg') === (st.mode === 'deg'), keys = {sin: `sin ${shown}`, cos: `cos ${shown}`, tan: `tan ${shown}`, csc: `1 ÷ sin ${shown}`, sec: `1 ÷ cos ${shown}`, cot: `1 ÷ tan ${shown}`};
  const v = (f, t) => { const r = CA.trig[f](t); return !Number.isFinite(r) || Math.abs(r) > 1e9 ? 'undefined' : num(r, 4); };
  T.innerHTML = `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>function</th><th>keystrokes</th><th>correct value</th>${match ? '' : '<th>what the calculator shows</th>'}</tr>${FN.map(f => `<tr><th>${f} ${shown}</th><td><span class="ca-calc-key">${keys[f]}</span></td><td class="hl">${v(f, x)}</td>${match ? '' : `<td style="color:#d63d28;font-weight:800">${v(f, wrongX)}</td>`}</tr>`).join('')}</table></div>`;
  lab.out(match ? `The calculator mode matches the unit of the angle, so every value in the table is what you should get. Use 1 ÷ sin, never sin⁻¹, for csc.` : `<b>Mode mismatch.</b> The angle is in ${st.unit === 'deg' ? 'degrees' : 'radians'} but the calculator is in ${st.mode === 'deg' ? 'DEG' : 'RAD'} mode, so it reads ${shown} as ${st.mode === 'deg' ? 'degrees' : 'radians'}. The red column is wrong; switch the mode.`, match ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- guided problems ---------- */
CA.guided('53', [
  {q: 'The point (1/2, −√3/2) is on the unit circle at angle t. What is tan t?', opts: ['−√3', '−√3/3', '√3', '−1/2'], correct: 0, hint: 'tan t = y/x.', why: '(−√3/2) ÷ (1/2) = −√3.', ref: {panel: 'six', what: 'Example 1', body: '<p>The point <b>(1/2, −√3/2)</b> is on the unit circle. Find all six values.</p>'}},
  {q: 'For the same point (1/2, −√3/2), what is csc t?', opts: ['−2√3/3', '−2', '2', '−√3/2'], correct: 0, hint: 'csc t = 1/y, then rationalize.', why: '1 ÷ (−√3/2) = −2/√3 = −2√3/3.', ref: {problem: 1, what: 'the same point'}},
  {q: 'What is sec(π/3)?', opts: ['2', '1/2', '2√3/3', '√3'], correct: 0, hint: 'cos(π/3) = 1/2.', why: 'sec(π/3) = 1/cos(π/3) = 1 ÷ (1/2) = 2.'},
  {q: 'What is cot(π/4)?', opts: ['1', '√2', '√2/2', '0'], correct: 0, hint: 'x = y at π/4.', why: 'cot(π/4) = x/y = (√2/2)/(√2/2) = 1.'},
  {q: 'Which value is undefined?', opts: ['tan(π/2)', 'cot(π/2)', 'sec(0)', 'csc(π/2)'], correct: 0, hint: 'Look for a zero denominator.', why: 'At π/2 the point is (0, 1), so tan(π/2) = 1/0 is undefined. cot(π/2) = 0/1 = 0.'},
  {q: 'If sin x = 0.52, what is sin(−x)?', opts: ['−0.52', '0.52', '1/0.52', '0.48'], correct: 0, hint: 'Sine is odd.', why: 'sin(−x) = −sin x = −0.52.'},
  {q: 'If cos x = −1/5, what is cos(−x)?', opts: ['−1/5', '1/5', '−5', '5'], correct: 0, hint: 'Cosine is even.', why: 'cos(−x) = cos x = −1/5.'},
  {q: 'Which pair lists exactly the even trigonometric functions?', opts: ['cosine and secant', 'sine and cosecant', 'tangent and cotangent', 'cosine and sine'], correct: 0, hint: 'Which functions use only x?', why: 'cos(−x) = cos x and sec(−x) = sec x; the other four are odd.'},
  {q: 'Simplify cot(−x) sec(−x).', opts: ['−csc x', 'csc x', '−sec x', '−1'], correct: 0, hint: 'cot is odd, sec is even; then write in sines and cosines.', why: '−cot x sec x = −(cos x/sin x)(1/cos x) = −1/sin x = −csc x.', ref: {panel: 'identities', what: 'Checkpoint 3 (i)', body: '<p>Simplify <b>cot(−x) sec(−x)</b>.</p>'}},
  {q: 'An angle t in Quadrant IV has endpoint (2, y) on x² + y² = 10. What is tan t?', opts: ['−√6/2', '√6/2', '−√6/3', '−√15/5'], correct: 0, hint: 'y = −√6.', why: 'y² = 10 − 4 = 6 and y &lt; 0, so y = −√6; tan t = y/x = −√6/2.', ref: {panel: 'any-circle', what: 'Example 2', body: '<p>t is in Quadrant IV with endpoint <b>(2, y)</b> on <b>x² + y² = 10</b>.</p>'}},
  {q: 'Using a calculator in degree mode, csc 40° ≈ ?', opts: ['1.5557', '0.6428', '0.6981', '−1.3410'], correct: 0, hint: 'Press 1 ÷ sin 40.', why: 'sin 40° ≈ 0.6428, so csc 40° = 1/0.6428 ≈ 1.5557. (0.6428 is sin 40° itself, and 0.6981 is 40° written in radians.)'}
]);
})();
