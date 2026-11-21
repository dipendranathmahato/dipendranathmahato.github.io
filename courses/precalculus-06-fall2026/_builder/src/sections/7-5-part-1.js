/* Section 7.5 Part I · Solving Linear Trigonometric Equations — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Rad} = CA;
const PI = Math.PI, $ = id => document.getElementById(id);

/* ---------- 01 · circle and graph ---------- */
const KV = {sin: ['-1', '-√3/2', '-√2/2', '-1/2', '0', '1/2', '√2/2', '√3/2', '1', '-3/5', '1/3'], cos: ['-1', '-√3/2', '-√2/2', '-1/2', '0', '1/2', '√2/2', '√3/2', '1', '0.25'], tan: ['-√3', '-1', '-√3/3', '0', '√3/3', '1', '√3', '2']};
const CX = -2.1;
CA.lab('circ-lab', {
  controls: [{type: 'seg', key: 'fn', label: 'Equation', value: 'sin', options: [['sin', 'sin θ = k'], ['cos', 'cos θ = k'], ['tan', 'tan θ = k']]}, {type: 'select', key: 'k', label: 'k =', value: '1/2', options: KV.sin.map(v => [v, v.replace('-', '−')])}],
  plot: {xmin: -3.4, xmax: 6.6, ymin: -2.2, ymax: 2.2, xpi: F(1, 2), xtickMin: 0, w: 660, h: 320}, plotLabel: 'Solutions on the unit circle and on the graph', readouts: [['sol', 'Solutions in [0, 2π)'], ['gen', 'General solution']]
}, (lab, st, key) => {
  if (key === 'fn') { lab.state.setOptions('k', KV[st.fn].map(v => [v, v.replace('-', '−')]), st.fn === 'tan' ? '1' : '1/2'); }
  const fn = st.fn, k = CA.parseReal(st.k).v, R = CA.solveTrig(fn, k), P = lab.plane(), f = Math[fn];
  P.param(t => CX + Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.8}).seg(CX - 1.3, 0, CX + 1.3, 0, {color: 'gray', width: 1}).seg(CX, -1.3, CX, 1.3, {color: 'gray', width: 1});
  if (fn === 'sin') P.seg(CX - 1.3, k, CX + 1.3, k, {color: 'blue', dash: '6 5', width: 2}); else if (fn === 'cos') P.seg(CX + k, -1.3, CX + k, 1.3, {color: 'blue', dash: '6 5', width: 2}); else { const a = Math.atan(k); P.seg(CX - 1.4 * Math.cos(a), -1.4 * Math.sin(a), CX + 1.4 * Math.cos(a), 1.4 * Math.sin(a), {color: 'blue', dash: '6 5', width: 2}); }
  P.curve(f, {from: 0, to: 2 * PI, color: 'orange', width: 3.2, breaks: fn === 'tan' ? [PI / 2, 3 * PI / 2] : [], samples: 1400}).seg(0, k, 2 * PI, k, {color: 'blue', dash: '6 5', width: 2});
  if (fn === 'tan') P.vline(PI / 2, {color: 'purple', dash: '6 6'}).vline(3 * PI / 2, {color: 'purple', dash: '6 6'});
  R.sols.forEach(s => { P.seg(CX, 0, CX + Math.cos(s.x), Math.sin(s.x), {color: 'green', width: 2.4}).point(CX + Math.cos(s.x), Math.sin(s.x), {color: 'green', r: 6, label: s.text, labelOpt: {size: 11.5}}).point(s.x, k, {color: 'green', r: 6, label: s.text, labelOpt: {size: 11.5, dy: k >= 0 ? -12 : 22}}); });
  P.render();
  lab.read('sol', R.sols.length ? R.sols.map(s => s.text).join(', ') : 'none'); lab.read('gen', R.sols.length ? R.general : 'no solution');
  lab.out(R.sols.length === 0 ? R.note + '.' : R.sols.length === 1 ? `Only one angle in [0, 2π) works: the line just touches the circle.` : `Reference angle ${R.refText}; the value ${num(k, 4)} is ${k > 0 ? 'positive' : k < 0 ? 'negative' : 'zero'}, so the solutions are in ${R.quads}. Each solution on the circle matches a crossing on the graph.`);
});

/* ---------- 02 · linear equation solver ---------- */
const IVS = {std: [{a: 0, b: 2 * PI}, false, '[0, 2π)'], deg: [{a: 0, b: 2 * PI}, true, '[0°, 360°)'], neg: [{a: -PI, b: PI}, false, '[−π, π)'], all: [{a: -Infinity, b: Infinity}, false, 'all real numbers (general solution)']};
const LP = [['sin', '1', '-1/2', '0', 'all', 'sin θ − 1/2 = 0'], ['cos', '1', '1', '0', 'all', 'cos θ + 1 = 0'], ['sin', '2', '√3', '0', 'std', '2 sin θ + √3 = 0'],
  ['tan', '3', '5', '2', 'deg', '3 tan θ + 5 = 2'], ['sin', '5', '3', '0', 'std', '5 sin θ + 3 = 0'], ['sin', '4', '3', '1', 'all', '4 sin x + 3 = 1'],
  ['cos', '√2', '-1', '0', 'std', '√2 cos x − 1 = 0'], ['tan', '-1', '1', '2', 'neg', '1 − tan x = 2']];
const term = (a, fn) => { const s = a.str; return s === '1' ? `${fn} θ` : s === '−1' || s === '-1' ? `−${fn} θ` : `${s} ${fn} θ`; };
CA.lab('lin-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Equation', value: '2', options: LP.map((p, i) => [String(i), p[5]]).concat([['own', 'Set your own a, b, c']])},
    {type: 'select', key: 'fn', label: 'f', value: 'sin', options: [['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan']]}, {type: 'text', key: 'a', label: 'a =', value: '2'}, {type: 'text', key: 'b', label: 'b =', value: '√3'}, {type: 'text', key: 'c', label: 'c =', value: '0'},
    {type: 'select', key: 'iv', label: 'Interval', value: 'std', options: Object.entries(IVS).map(([k, v]) => [k, v[2]])}],
  top: '<div class="ca-equation" id="lin-eq"></div>', plot: {xmin: 0, xmax: 2 * PI, ymin: -4, ymax: 4, xpi: F(1, 2), w: 620, h: 300}, plotLabel: 'Graph of a·f(θ) + b − c with its zeros', readouts: [['val', 'f(θ) ='], ['sol', 'Solutions']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = LP[+st.pre]; ['fn', 'a', 'b', 'c', 'iv'].forEach((k, i) => st.set(k, p[i], true)); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const a = CA.parseReal(st.a), b = CA.parseReal(st.b), c = CA.parseReal(st.c), fn = st.fn, [iv, deg, ivT] = IVS[st.iv];
  if (!a || !b || !c || a.v === 0) { $('lin-eq').textContent = 'Use numbers such as 2, −1/2, √3, or 0.6, with a ≠ 0.'; lab.steps([]); lab.out('One of the boxes could not be read.', 'ca-incorrect'); return; }
  $('lin-eq').innerHTML = `Solve <b>${term(a, fn)}${b.v ? ` ${b.v < 0 ? '−' : '+'} ${b.str.replace(/^[−-]/, '')}` : ''} = ${c.str}</b> on ${ivT}`;
  let valR = null; try { if (a.rad && b.rad && c.rad) valR = c.rad.sub(b.rad).div(a.rad); } catch (e) { valR = null; }
  const val = (c.v - b.v) / a.v, valT = valR ? valR.str() : num(val, 4), R = CA.solveTrig(fn, val, iv, {deg, dp: deg ? 2 : 2});
  const steps = [['Isolate ' + fn + ' θ', `${term(a, fn)} = ${c.str} − (${b.str}) ⟹ ${fn} θ = ${valT}`]];
  if (!R.sols.length && R.general === 'no solution') { steps.push(['No solution', R.note]); lab.steps(steps); lab.read('val', valT); lab.read('sol', 'none'); lab.out(`No solution: ${R.note}.`, 'ca-incorrect'); lab.plane().curve(x => a.v * CA.trig[fn](x) + b.v - c.v, {color: 'orange', width: 3, samples: 1400}).render(); return; }
  const special = CA.invExact(fn, Math.abs(val)) !== null;
  steps.push(['Reference angle', `${fn}⁻¹(${num(Math.abs(val), 4)}) = ${deg ? CA.num(R.ref * 180 / PI, 2) + '°' : (special ? CA.niceX(R.ref) : num(R.ref, 4))}${special ? ' (special angle)' : ' (calculator)'}`]);
  steps.push(['Quadrants', `${fn} θ ${val > 0 ? '&gt; 0' : val < 0 ? '&lt; 0' : '= 0'}: ${R.quads}`]);
  steps.push([st.iv === 'all' ? 'General solution' : `Solutions in ${ivT}`, st.iv === 'all' ? R.general : R.sols.map(s => s.text).join(', ') || 'none']);
  lab.steps(steps); lab.read('val', valR ? valR.html() : valT); lab.read('sol', st.iv === 'all' ? R.general : (R.sols.map(s => s.text).join(', ') || 'none'));
  const lo = st.iv === 'neg' ? -PI : 0, hi = st.iv === 'neg' ? PI : 2 * PI, G = x => a.v * CA.trig[fn](x) + b.v - c.v, amp = Math.abs(a.v) + Math.abs(b.v - c.v) + 1;
  const Pl = lab.plane({xmin: lo, xmax: hi, ymin: -Math.min(6, amp), ymax: Math.min(6, amp)});
  Pl.curve(G, {color: 'orange', width: 3.2, breaks: fn === 'tan' ? [-PI / 2, PI / 2, 3 * PI / 2] : [], samples: 1600});
  const shown = st.iv === 'all' ? CA.solveTrig(fn, val, {a: 0, b: 2 * PI}).sols : R.sols;
  shown.forEach(s => Pl.point(s.x, 0, {color: 'green', r: 7, label: st.iv === 'all' ? CA.solveTrig(fn, val, {a: 0, b: 2 * PI}).sols.find(t => t.x === s.x).text : s.text, labelOpt: {size: 11.5}}));
  Pl.render();
  lab.out(`The green points are the x-intercepts of y = ${term(a, fn).replace(/θ/g, 'x')}${b.v ? ` ${b.v < 0 ? '−' : '+'} ${b.str.replace(/^[−-]/, '')}` : ''}${c.v ? ` − ${c.str}` : ''}${st.iv === 'all' ? ' in one period; add multiples of the period for all solutions' : ''}.`, 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('75a', [
  {q: 'Solve sin θ = 1/2 on [0, 2π).', opts: ['π/6 and 5π/6', 'π/6 and 11π/6', 'π/3 and 2π/3', 'π/6 only'], correct: 0, hint: 'Sine is positive in Quadrants I and II.', why: 'Reference angle π/6: θ = π/6 and π − π/6 = 5π/6.'},
  {q: 'What is the general solution of cos θ + 1 = 0?', opts: ['θ = π + 2kπ', 'θ = 2kπ', 'θ = π/2 + kπ', 'θ = π + kπ/2'], correct: 0, hint: 'cos θ = −1 happens once per turn.', why: 'cos θ = −1 only at θ = π in [0, 2π); add 2kπ.', ref: {panel: 'linear', what: 'the equation cos θ + 1 = 0', body: '<p>Solve <b>cos θ + 1 = 0</b> (all solutions).</p>'}},
  {q: 'Solve 2 sin θ + √3 = 0 on [0, 2π).', opts: ['4π/3 and 5π/3', 'π/3 and 2π/3', '7π/6 and 11π/6', '2π/3 and 4π/3'], correct: 0, hint: 'sin θ = −√3/2: Quadrants III and IV with reference angle π/3.', why: 'π + π/3 = 4π/3 and 2π − π/3 = 5π/3.', ref: {panel: 'linear', what: 'the equation 2 sin θ + √3 = 0', body: '<p>Solve <b>2 sin θ + √3 = 0</b> on [0, 2π).</p>'}},
  {q: 'Solve 3 tan θ + 5 = 2 on [0°, 360°).', opts: ['135° and 315°', '45° and 225°', '135° and 225°', '45° and 315°'], correct: 0, hint: 'tan θ = −1.', why: 'Reference angle 45°, tangent negative in Quadrants II and IV: 135° and 315°.'},
  {q: 'Solve 5 sin θ + 3 = 0 on [0, 2π), to two decimals.', opts: ['3.79 and 5.64', '0.64 and 2.50', '−0.64 and 3.79', '2.50 and 5.64'], correct: 0, hint: 'Reference angle sin⁻¹(3/5) ≈ 0.64; Quadrants III and IV.', why: 'π + 0.6435 ≈ 3.79 and 2π − 0.6435 ≈ 5.64.', ref: {panel: 'linear', what: 'the equation 5 sin θ + 3 = 0', body: '<p>Solve <b>5 sin θ + 3 = 0</b> on [0, 2π); round to two decimals.</p>'}},
  {q: 'Which is the general solution of 4 sin x + 3 = 1?', opts: ['x = 7π/6 + 2kπ, x = 11π/6 + 2kπ', 'x = π/6 + 2kπ, x = 5π/6 + 2kπ', 'x = 7π/6 + kπ', 'x = −π/6 + 2kπ only'], correct: 0, hint: 'sin x = −1/2.', why: 'Reference angle π/6 in Quadrants III and IV.'},
  {q: 'Solve √2 cos x − 1 = 0 on [0, 2π).', opts: ['π/4 and 7π/4', 'π/4 and 3π/4', '3π/4 and 5π/4', 'π/4 only'], correct: 0, hint: 'cos x = √2/2.', why: 'Cosine is positive in Quadrants I and IV: π/4 and 2π − π/4.'},
  {q: 'Solve 1 − tan x = 2 on [−π, π).', opts: ['−π/4 and 3π/4', '3π/4 and 7π/4', 'π/4 and 5π/4', '−3π/4 and π/4'], correct: 0, hint: 'tan x = −1, then stay inside [−π, π).', why: 'tan x = −1 at 3π/4 + kπ; inside [−π, π) that is −π/4 and 3π/4.'},
  {q: 'How many solutions does cos θ = 1.4 have?', opts: ['none', 'one', 'two', 'infinitely many'], correct: 0, hint: 'Range of cosine.', why: 'cos θ is always between −1 and 1, so cos θ = 1.4 has no solution.'},
  {q: 'The general solution of tan θ = √3 is…', opts: ['θ = π/3 + kπ', 'θ = π/3 + 2kπ', 'θ = π/6 + kπ', 'θ = π/3 + 2kπ and 2π/3 + 2kπ'], correct: 0, hint: 'Tangent has period π.', why: 'tan(π/3) = √3 and tangent repeats every π, which already includes 4π/3.'}
]);
})();
