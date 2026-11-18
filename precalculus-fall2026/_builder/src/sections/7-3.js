/* Section 7.3 · Double-Angle and Half-Angle Formulas — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Rad, toRad} = CA;
const PI = Math.PI, $ = id => document.getElementById(id), P = s => `(${s})`;
const show = (d, u) => u === 'rad' ? CA.radText(d) : `${fmt(d)}°`;
const FNS = [['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan'], ['csc', 'csc'], ['sec', 'sec'], ['cot', 'cot']], QS = [['I', 'I'], ['II', 'II'], ['III', 'III'], ['IV', 'IV']];

/* ---------- 01a · double a special angle ---------- */
const DS = [[600, 'sin', 'deg', 'Example 1 (i) · sin 600°'], [480, 'cos', 'rad', 'Example 1 (ii) · cos(8π/3)'], [120, 'sin', 'deg', 'sin 120° from 60°'], [300, 'tan', 'deg', 'tan 300° from 150°'], [270, 'cos', 'rad', 'cos(3π/2) from 3π/4']];
CA.lab('dsp-lab', {
  controls: [{type: 'select', key: 'p', label: 'Problem', value: '0', options: DS.map((d, i) => [String(i), d[3]])}, {type: 'seg', key: 'cf', label: 'cos 2α form', value: 'a', options: [['a', 'cos²α − sin²α'], ['b', '1 − 2sin²α'], ['c', '2cos²α − 1']]}],
  readouts: [['ans', 'Exact value'], ['chk', 'Calculator check']], steps: true
}, (lab, st) => {
  const [T, fn, u] = DS[+st.p], a = T / 2, sa = CA.exact('sin', a), ca = CA.exact('cos', a), ta = CA.exact('tan', a), A = show(a, u);
  let res, steps = [['Write as a double angle', `${show(T, u)} = 2 × ${A}`]];
  if (fn === 'sin') { res = sa.mul(ca).mul(2); steps.push(['sin 2α = 2 sin α cos α', `2 · ${P(sa.str())} · ${P(ca.str())}`]); }
  else if (fn === 'cos') { const f = st.cf; res = f === 'a' ? ca.square().sub(sa.square()) : f === 'b' ? Rad.of(1).sub(sa.square().mul(2)) : ca.square().mul(2).sub(1); steps.push([f === 'a' ? 'cos 2α = cos²α − sin²α' : f === 'b' ? 'cos 2α = 1 − 2 sin²α' : 'cos 2α = 2 cos²α − 1', f === 'a' ? `${P(ca.str())}² − ${P(sa.str())}² = ${ca.square().str()} − ${sa.square().str()}` : f === 'b' ? `1 − 2${P(sa.str())}² = 1 − 2(${sa.square().str()})` : `2${P(ca.str())}² − 1 = 2(${ca.square().str()}) − 1`]); }
  else { res = ta.mul(2).div(Rad.of(1).sub(ta.square())); steps.push(['tan 2α = 2 tan α/(1 − tan²α)', `2${P(ta.str())} / (1 − ${P(ta.str())}²) = ${ta.mul(2).str()} / ${Rad.of(1).sub(ta.square()).str()}`]); }
  steps.push(['Result', res.str()]); lab.steps(steps);
  lab.read('ans', res.html()); lab.read('chk', `${fn}(${show(T, u)}) ≈ ${num(CA.trig[fn](toRad(T)), 6)}`);
  lab.out(`${fn}(${show(T, u)}) = <b>${res.html()}</b>. ${fn === 'cos' ? 'All three cosine forms give the same value; try them.' : ''}`, 'ca-correct');
});

/* ---------- 01b · double an angle given by a ratio ---------- */
const DB = {e3: ['tan', 3, 2, 'I', 'Example 1 (iii) · tan θ = 3/2, 0 < θ < π/2'], e4: ['cos', 4, 5, 'I', 'Example 1 (iv) · cos θ = 4/5, 0 < θ < π/2'], e5: ['sin', -2, 5, 'III', 'Example 1 (v) · sin θ = −2/5, π < θ < 3π/2'], c1: ['tan', 4, 3, 'III', 'Checkpoint 1 · tan θ = 4/3, π < θ < 3π/2']};
CA.lab('dbl-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: 'c1', options: Object.entries(DB).map(([k, v]) => [k, v[4]]).concat([['own', 'Set your own']])},
    {type: 'select', key: 'f', label: 'Given', value: 'tan', options: FNS}, {type: 'number', key: 'p', label: 'numerator', value: 4, step: 1}, {type: 'number', key: 'q', label: 'denominator', value: 3, step: 1}, {type: 'select', key: 'Q', label: 'θ in Quadrant', value: 'III', options: QS},
    {type: 'seg', key: 'w', label: 'Steps for', value: 's', options: [['s', 'sin 2θ'], ['c', 'cos 2θ'], ['t', 'tan 2θ']]}],
  plot: {w: 480, h: 360}, plotLabel: 'Reference triangle for θ', readouts: [['th', 'sin θ, cos θ, tan θ'], ['s', 'sin 2θ'], ['c', 'cos 2θ'], ['t', 'tan 2θ']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = DB[st.pre]; st.set('f', p[0], true); st.set('p', p[1], true); st.set('q', p[2], true); st.set('Q', p[3], true); }
  else if (key && key !== 'pre' && key !== 'w') st.set('pre', 'own', true);
  const R = CA.resolveRatio(st.f, st.p, st.q, st.Q);
  if (typeof R === 'string') { lab.out(R, 'ca-incorrect'); lab.steps([]); lab.plane({xmin: -5, xmax: 5, ymin: -4, ymax: 4}).render(); return; }
  const s = R.y.div(R.r), c = R.x.div(R.r), t = R.y.div(R.x), s2 = s.mul(c).mul(2), c2 = c.square().sub(s.square()), den = Rad.of(1).sub(t.square()), t2 = den.isZero() ? null : t.mul(2).div(den);
  const r0 = R.r.v, Pl = lab.plane({xmin: -1.3 * r0, xmax: 1.3 * r0, ymin: -1.2 * r0, ymax: 1.2 * r0});
  Pl.seg(0, 0, R.x.v, 0, {color: 'blue', width: 4}).seg(R.x.v, 0, R.x.v, R.y.v, {color: 'green', width: 4}).seg(0, 0, R.x.v, R.y.v, {color: 'orange', width: 3});
  Pl.label(R.x.v / 2, 0, `x = ${R.x.str()}`, {color: 'blue', anchor: 'middle', dx: 0, dy: R.y.v > 0 ? 18 : -10}).label(R.x.v, R.y.v / 2, `y = ${R.y.str()}`, {color: 'green', anchor: R.x.v > 0 ? 'start' : 'end'}).label(R.x.v / 2, R.y.v / 2, `r = ${R.r.str()}`, {color: 'orange', anchor: R.x.v > 0 ? 'end' : 'start', dx: -8}).point(R.x.v, R.y.v, {color: 'orange', r: 6}).render();
  lab.read('th', `${s.html()}, ${c.html()}, ${t.html()}`); lab.read('s', s2.html()); lab.read('c', c2.html()); lab.read('t', t2 ? t2.html() : 'undefined');
  const base = [['Triangle in Quadrant ' + st.Q, `x = ${R.x.str()}, y = ${R.y.str()}, r = ${R.r.str()}`], ['sin θ, cos θ, tan θ', `${s.str()}, ${c.str()}, ${t.str()}`]];
  const ws = {s: [['sin 2θ = 2 sin θ cos θ', `2${P(s.str())}${P(c.str())} = ${s2.str()}`]], c: [['cos 2θ = cos²θ − sin²θ', `${c.square().str()} − ${s.square().str()} = ${c2.str()}`], ['Check with 2cos²θ − 1', `2(${c.square().str()}) − 1 = ${c.square().mul(2).sub(1).str()}`]], t: [['tan 2θ = 2 tan θ/(1 − tan²θ)', t2 ? `${t.mul(2).str()} / (1 − ${t.square().str()}) = ${t.mul(2).str()} / ${den.str()} = ${t2.str()}` : 'the denominator is 0, so tan 2θ is undefined']]}[st.w];
  lab.steps(base.concat(ws));
  lab.out(`Notice that 2θ can land in a different quadrant from θ: here sin 2θ is ${s2.v > 0 ? 'positive' : 'negative'} and cos 2θ is ${c2.v > 0 ? 'positive' : 'negative'}, so 2θ is in Quadrant ${s2.v > 0 ? (c2.v > 0 ? 'I' : 'II') : (c2.v > 0 ? 'IV' : 'III')}.`, 'ca-correct');
});

/* ---------- 02 · half of a special angle ---------- */
const HS = [[15, 'sin', 'deg', 'Example 2 (i) · sin 15°'], [105, 'cos', 'rad', 'Example 2 (ii) · cos(7π/12)'], [22.5, 'tan', 'deg', 'Example 2 (iii) · tan 22.5°'], [157.5, 'sin', 'rad', 'Checkpoint 2 (i) · sin(7π/8)'],
  [75, 'cos', 'deg', 'Checkpoint 2 (ii) · cos 75°'], [15, 'tan', 'deg', 'Checkpoint 2 (iii) · tan 15°'], [112.5, 'cos', 'deg', 'cos 112.5°'], [67.5, 'sin', 'rad', 'sin(3π/8)']];
CA.lab('half-lab', {
  controls: [{type: 'select', key: 'p', label: 'Problem', value: '0', options: HS.map((d, i) => [String(i), d[3]])}, {type: 'seg', key: 'tf', label: 'tan form', value: 'b', options: [['a', '(1 − cos α)/sin α'], ['b', 'sin α/(1 + cos α)']]}],
  plot: {xmin: -1.4, xmax: 1.4, ymin: -1.2, ymax: 1.2, w: 460, h: 340, xstep: 0.5, ystep: 0.5}, plotLabel: 'The half angle and the full angle on the unit circle', readouts: [['al', 'α = 2 × target'], ['sg', 'Sign'], ['ans', 'Exact value'], ['chk', 'Calculator check']], steps: true
}, (lab, st) => {
  const [T, fn, u] = HS[+st.p], a = T * 2, ca = CA.exact('cos', a), sa = CA.exact('sin', a), q = CA.quadrant(T), sg = fn === 'tan' ? null : CA.signs(q)[fn];
  const Pl = lab.plane(); CA.drawAngle(Pl, toRad(a), {color: 'gray', point: true, arcR: 0.36, pointLabel: show(a, u)}); CA.drawAngle(Pl, toRad(T), {circle: false, point: true, arcR: 0.22, pointLabel: show(T, u)}); Pl.render();
  let res, steps = [['Write as a half angle', `${show(T, u)} = ½ × ${show(a, u)}, and cos ${show(a, u)} = ${ca.str()}`]];
  if (fn === 'tan') {
    const v = st.tf === 'a' ? Rad.of(1).sub(ca).div(sa) : sa.div(Rad.of(1).add(ca));
    steps.push([st.tf === 'a' ? 'tan(α/2) = (1 − cos α)/sin α' : 'tan(α/2) = sin α/(1 + cos α)', st.tf === 'a' ? `(1 − ${P(ca.str())}) / ${P(sa.str())}` : `${P(sa.str())} / (1 + ${P(ca.str())})`], ['Simplify (rationalize)', v.str()]);
    res = {html: v.html(), str: v.str(), v: v.v}; lab.read('sg', 'no sign decision needed');
  } else {
    const inside = (fn === 'sin' ? Rad.of(1).sub(ca) : Rad.of(1).add(ca)).div(2), root = CA.sqrtRad(inside);
    steps.push([`${fn}(α/2) = ±√((1 ${fn === 'sin' ? '−' : '+'} cos α)/2)`, `±√((1 ${fn === 'sin' ? '−' : '+'} ${P(ca.str())})/2) = ±√(${inside.str()})`], ['Simplify', `±${root.str}`], [`Sign: ${show(T, u)} is in ${CA.quadName(T)}`, `${fn} is ${sg > 0 ? 'positive' : 'negative'} there, so take ${sg > 0 ? '+' : '−'}`]);
    res = {html: (sg < 0 ? '−' : '') + root.html, str: (sg < 0 ? '−' : '') + root.str, v: sg * root.v}; lab.read('sg', `${sg > 0 ? '+' : '−'} (${CA.quadName(T)})`);
  }
  steps.push(['Result', res.str]); lab.steps(steps);
  const calc = CA.trig[fn](toRad(T));
  lab.read('al', `${show(a, u)}`); lab.read('ans', res.html); lab.read('chk', `${num(res.v, 6)} vs ${num(calc, 6)}`);
  lab.out(`${fn}(${show(T, u)}) = <b>${res.html}</b>. The decimal value ${Math.abs(res.v - calc) < 1e-9 ? 'matches' : 'does not match'} the calculator.`, Math.abs(res.v - calc) < 1e-9 ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 03 · half of an angle given by a ratio ---------- */
const HG = {e4: ['cos', 1, 5, 'IV', 'Example 2 (iv) · cos θ = 1/5, 3π/2 < θ < 2π'], c4: ['sin', -5, 13, 'III', 'Checkpoint 2 (iv) · sin θ = −5/13, π < θ < 3π/2'], x: ['cos', -7, 25, 'II', 'cos θ = −7/25, π/2 < θ < π']};
const HALFQ = {I: ['0 &lt; θ/2 &lt; π/4', 'I'], II: ['π/4 &lt; θ/2 &lt; π/2', 'I'], III: ['π/2 &lt; θ/2 &lt; 3π/4', 'II'], IV: ['3π/4 &lt; θ/2 &lt; π', 'II']};
CA.lab('hg-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: 'e4', options: Object.entries(HG).map(([k, v]) => [k, v[4]]).concat([['own', 'Set your own']])},
    {type: 'select', key: 'f', label: 'Given', value: 'cos', options: [['sin', 'sin'], ['cos', 'cos']]}, {type: 'number', key: 'p', label: 'numerator', value: 1, step: 1}, {type: 'number', key: 'q', label: 'denominator', value: 5, step: 1}, {type: 'select', key: 'Q', label: 'θ in Quadrant', value: 'IV', options: QS}],
  readouts: [['c', 'cos θ'], ['hq', 'θ/2 lies in'], ['s', 'sin(θ/2)'], ['co', 'cos(θ/2)'], ['t', 'tan(θ/2)']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = HG[st.pre]; st.set('f', p[0], true); st.set('p', p[1], true); st.set('q', p[2], true); st.set('Q', p[3], true); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const R = CA.resolveRatio(st.f, st.p, st.q, st.Q);
  if (typeof R === 'string') { lab.out(R, 'ca-incorrect'); lab.steps([]); return; }
  const c = R.x.div(R.r), s = R.y.div(R.r), [range, hq] = HALFQ[st.Q], sgS = 1, sgC = hq === 'I' ? 1 : -1;
  const sIn = Rad.of(1).sub(c).div(2), cIn = Rad.of(1).add(c).div(2), sv = CA.sqrtRad(sIn), cv = CA.sqrtRad(cIn), tv = s.div(Rad.of(1).add(c));
  lab.read('c', c.html()); lab.read('hq', `${range.replace(/&lt;/g, '<')} · Quadrant ${hq}`); lab.read('s', sv.html); lab.read('co', (sgC < 0 ? '−' : '') + cv.html); lab.read('t', tv.html());
  lab.steps([['Find cos θ', st.f === 'cos' ? `given: cos θ = ${c.str()}` : `sin θ = ${s.str()} in Quadrant ${st.Q}: cos θ = ${c.str()} (Pythagorean identity, sign from the quadrant)`], ['Halve the interval', `θ in Quadrant ${st.Q} ⟹ ${range}: Quadrant ${hq}, where sine is positive and cosine is ${sgC > 0 ? 'positive' : 'negative'}`],
    ['sin(θ/2) = +√((1 − cos θ)/2)', `√((1 − ${P(c.str())})/2) = √(${sIn.str()}) = ${sv.str}`], [`cos(θ/2) = ${sgC > 0 ? '+' : '−'}√((1 + cos θ)/2)`, `${sgC > 0 ? '' : '−'}√((1 + ${P(c.str())})/2) = ${sgC > 0 ? '' : '−'}√(${cIn.str()}) = ${sgC > 0 ? '' : '−'}${cv.str}`], ['tan(θ/2) = sin θ/(1 + cos θ)', `${P(s.str())} / (1 + ${P(c.str())}) = ${tv.str()}`]]);
  const th = Math.atan2(R.y.v, R.x.v), t0 = th < 0 ? th + 2 * PI : th;
  lab.out(`Calculator check: θ ≈ ${num(t0, 4)}, so θ/2 ≈ ${num(t0 / 2, 4)}; sin(θ/2) ≈ ${num(Math.sin(t0 / 2), 4)}, cos(θ/2) ≈ ${num(Math.cos(t0 / 2), 4)}. Exact: ${sv.str} ≈ ${num(sv.v, 4)} and ${sgC > 0 ? '' : '−'}${cv.str} ≈ ${num(sgC * cv.v, 4)}.`, 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('73', [
  {q: 'sin(2α) = ?', opts: ['2 sin α cos α', '2 sin α', 'sin²α − cos²α', '2 sin α + 2 cos α'], correct: 0, hint: 'Set β = α in sin(α + β).', why: 'sin α cos α + cos α sin α = 2 sin α cos α.'},
  {q: 'Which is NOT a correct formula for cos(2α)?', opts: ['2 sin²α − 1', 'cos²α − sin²α', '1 − 2 sin²α', '2 cos²α − 1'], correct: 0, hint: 'Check α = 0.', why: 'At α = 0, cos 0 = 1 but 2 sin²0 − 1 = −1. The correct form is 1 − 2 sin²α.'},
  {q: 'Use 600° = 2 × 300° to find sin 600°.', opts: ['−√3/2', '√3/2', '−1/2', '1/2'], correct: 0, hint: 'sin 300° = −√3/2 and cos 300° = 1/2.', why: '2(−√3/2)(1/2) = −√3/2.', ref: {panel: 'double', what: 'Example 1 (i)', body: '<p>Use a double-angle formula to find <b>sin 600°</b>.</p>'}},
  {q: 'If tan θ = 3/2 and 0 &lt; θ &lt; π/2, tan(2θ) = ?', opts: ['−12/5', '12/5', '3', '−3/5'], correct: 0, hint: '2 tan θ/(1 − tan²θ).', why: '3/(1 − 9/4) = 3/(−5/4) = −12/5.'},
  {q: 'If cos θ = 4/5 and 0 &lt; θ &lt; π/2, cos(2θ) = ?', opts: ['7/25', '8/5', '24/25', '−7/25'], correct: 0, hint: 'Use 2cos²θ − 1.', why: '2(16/25) − 1 = 7/25.'},
  {q: 'If sin θ = −2/5 and π &lt; θ &lt; 3π/2, sin(2θ) = ?', opts: ['4√21/25', '−4√21/25', '−4/5', '2√21/25'], correct: 0, hint: 'cos θ = −√21/5.', why: '2(−2/5)(−√21/5) = 4√21/25.', ref: {panel: 'double', what: 'Example 1 (v)', body: '<p>sin θ = <b>−2/5</b> and π &lt; θ &lt; 3π/2. Find sin(2θ).</p>'}},
  {q: 'sin 15° = ?', opts: ['√(2 − √3)/2', '√(2 + √3)/2', '(√3 − 1)/2', '√3/4'], correct: 0, hint: '15° = 30°/2 and cos 30° = √3/2.', why: '√((1 − √3/2)/2) = √((2 − √3)/4) = √(2 − √3)/2 (positive in Quadrant I).'},
  {q: 'cos(7π/12) is…', opts: ['negative, because 7π/12 is in Quadrant II', 'positive, because 7π/6 is in Quadrant III', 'positive, because square roots are positive', 'zero'], correct: 0, hint: 'The sign comes from the half angle.', why: '7π/12 ≈ 105° is in Quadrant II, where cosine is negative: cos(7π/12) = −√(2 − √3)/2.'},
  {q: 'tan 22.5° = ?', opts: ['√2 − 1', '√2 + 1', '(2 − √2)/2', '1/2'], correct: 0, hint: '(1 − cos 45°)/sin 45°.', why: '(1 − √2/2)/(√2/2) = (2 − √2)/√2 = √2 − 1.'},
  {q: 'If cos θ = 1/5 and 3π/2 &lt; θ &lt; 2π, cos(θ/2) = ?', opts: ['−√15/5', '√15/5', '−√10/5', '√10/5'], correct: 0, hint: 'θ/2 is in Quadrant II; cos(θ/2) uses 1 + cos θ.', why: '−√((1 + 1/5)/2) = −√(3/5) = −√15/5. (−√10/5 would come from 1 − cos θ.)', ref: {panel: 'half-given', what: 'Example 2 (iv)', body: '<p>cos θ = <b>1/5</b> and 3π/2 &lt; θ &lt; 2π. Find cos(θ/2).</p>'}}
]);
})();
