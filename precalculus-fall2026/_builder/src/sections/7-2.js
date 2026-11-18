/* Section 7.2 · Sum and Difference Identities — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Rad, toRad} = CA;
const PI = Math.PI, $ = id => document.getElementById(id);
const ANG = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
const show = (d, u) => u === 'rad' ? CA.radText(d) : `${d}°`;
const P = s => `(${s})`;

/* ---------- 02 · exact values ---------- */
const SP = [
  [420, 'cos', 120, '+', 300, 'deg', 'Example 1.1 · cos 420°'], [195, 'cos', 225, '-', 30, 'rad', 'Example 1.2 · cos(13π/12)'], [255, 'sin', 135, '+', 120, 'deg', 'Example 2.1 · sin 255°'],
  [15, 'sin', 60, '-', 45, 'rad', 'Example 2.2 · sin(π/12)'], [105, 'tan', 45, '+', 60, 'deg', 'Example 3.1 · tan 105°'], [195, 'tan', 330, '-', 135, 'rad', 'Example 3.2 · tan(13π/12)'],
  [345, 'cos', 300, '+', 45, 'rad', 'Checkpoint 1.1 · cos(23π/12)'], [15, 'cos', 45, '-', 30, 'deg', 'Checkpoint 1.2 · cos 15°'], [75, 'sin', 30, '+', 45, 'rad', 'Checkpoint 2.1 · sin(5π/12)'],
  [75, 'sin', 120, '-', 45, 'deg', 'Checkpoint 2.2 · sin 75°'], [75, 'tan', 30, '+', 45, 'rad', 'Checkpoint 3.1 · tan(5π/12)'], [75, 'tan', 120, '-', 45, 'deg', 'Checkpoint 3.2 · tan 75°']
];
let target = 420;
CA.lab('sum-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: '0', options: SP.map((p, i) => [String(i), p[6]]).concat([['own', 'Build your own α ± β']])},
    {type: 'seg', key: 'fn', label: 'Function', value: 'cos', options: [['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan']]},
    {type: 'select', key: 'a', label: 'α', value: '120', options: ANG.map(d => [String(d), `${d}° = ${CA.radText(d)}`])}, {type: 'seg', key: 'op', label: '±', value: '+', options: [['+', '+'], ['-', '−']]},
    {type: 'select', key: 'b', label: 'β', value: '300', options: ANG.map(d => [String(d), `${d}° = ${CA.radText(d)}`])}, {type: 'seg', key: 'u', label: 'Show angles in', value: 'deg', options: [['deg', 'degrees'], ['rad', 'radians']]}],
  top: '<div class="ca-equation" id="sum-goal"></div>', readouts: [['chk', 'α ± β'], ['ans', 'Exact value'], ['dec', 'Decimal check']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = SP[+st.pre]; target = p[0]; st.set('fn', p[1], true); st.set('a', p[2], true); st.set('op', p[3], true); st.set('b', p[4], true); st.set('u', p[5], true); }
  else if (key && key !== 'pre' && key !== 'u') { if (st.pre !== 'own') st.set('pre', 'own', true); }
  const a = +st.a, b = +st.b, sg = st.op === '+' ? 1 : -1, sum = a + sg * b, u = st.u, fn = st.fn, own = st.pre === 'own';
  if (own) target = sum;
  $('sum-goal').innerHTML = `Find <b>${fn}(${show(target, u)})</b> exactly${own ? '' : ` using ${show(a, u)} ${st.op === '+' ? '+' : '−'} ${show(b, u)}`}.`;
  const okDec = CA.norm360(sum) === CA.norm360(target);
  lab.read('chk', `${show(a, u)} ${sg > 0 ? '+' : '−'} ${show(b, u)} = ${show(sum, u)}${okDec ? (sum === target ? ' ✓' : ` (coterminal with ${show(target, u)}) ✓`) : ` ≠ ${show(target, u)}`}`);
  if (!okDec) { lab.read('ans', '—'); lab.read('dec', '—'); lab.steps([]); lab.out(`${show(a, u)} ${sg > 0 ? '+' : '−'} ${show(b, u)} is ${show(sum, u)}, which is not coterminal with ${show(target, u)}. Choose α and β again.`, 'ca-incorrect'); return; }
  const sa = CA.exact('sin', a), ca = CA.exact('cos', a), sb = CA.exact('sin', b), cb = CA.exact('cos', b), A = show(a, u), B = show(b, u), op = sg > 0 ? '+' : '−', nop = sg > 0 ? '−' : '+';
  let res, steps;
  if (fn === 'sin') { res = sa.mul(cb).add(ca.mul(sb).mul(sg)); steps = [['Formula', `sin(α ${op} β) = sin α cos β ${op} cos α sin β`], ['Substitute', `sin ${A} · cos ${B} ${op} cos ${A} · sin ${B} = ${P(sa.str())}${P(cb.str())} ${op} ${P(ca.str())}${P(sb.str())}`], ['Multiply', `${sa.mul(cb).str()} ${op} ${P(ca.mul(sb).str())}`]]; }
  else if (fn === 'cos') { res = ca.mul(cb).sub(sa.mul(sb).mul(sg)); steps = [['Formula', `cos(α ${op} β) = cos α cos β ${nop} sin α sin β`], ['Substitute', `cos ${A} · cos ${B} ${nop} sin ${A} · sin ${B} = ${P(ca.str())}${P(cb.str())} ${nop} ${P(sa.str())}${P(sb.str())}`], ['Multiply', `${ca.mul(cb).str()} ${nop} ${P(sa.mul(sb).str())}`]]; }
  else {
    const ta = CA.exact('tan', a), tb = CA.exact('tan', b);
    if (ta === undefined || tb === undefined) { lab.read('ans', '—'); lab.read('dec', '—'); lab.steps([]); lab.out(`tan ${ta === undefined ? A : B} is undefined, so the tangent formula cannot use it. Choose a decomposition without 90° or 270°.`, 'ca-incorrect'); return; }
    const num_ = ta.add(tb.mul(sg)), den = Rad.of(1).sub(ta.mul(tb).mul(sg));
    steps = [['Formula', `tan(α ${op} β) = (tan α ${op} tan β)/(1 ${nop} tan α tan β)`], ['Substitute', `(${ta.str()} ${op} ${P(tb.str())}) / (1 ${nop} ${P(ta.str())}${P(tb.str())})`], ['Simplify top and bottom', `(${num_.str()}) / (${den.str()})`]];
    if (den.isZero()) { lab.read('ans', 'undefined'); lab.read('dec', '—'); lab.steps(steps); lab.out('The denominator is 0: the tangent is undefined at this angle.', 'ca-incorrect'); return; }
    res = num_.div(den); if (!den.isRational()) steps.push(['Rationalize', `multiply top and bottom by the conjugate of ${den.str()}`]);
  }
  steps.push(['Result', res.str()]);
  const exact = CA.trig[fn](toRad(target));
  lab.steps(steps); lab.read('ans', res.html()); lab.read('dec', `${num(res.v, 6)} vs calculator ${num(exact, 6)}`);
  lab.out(`${fn}(${show(target, u)}) = <b>${res.html()}</b>. ${Math.abs(res.v - exact) < 1e-9 ? 'The decimal check agrees with the calculator.' : ''}${CA.exact(fn, CA.norm360(target)) ? ' This angle is special, so you can also read it from the unit circle.' : ''}`, 'ca-correct');
});

/* ---------- 03 · given a ratio and a quadrant ---------- */
const FNS = [['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan'], ['csc', 'csc'], ['sec', 'sec'], ['cot', 'cot']], QS = [['I', 'I'], ['II', 'II'], ['III', 'III'], ['IV', 'IV']];
const GP = {ex: [['cos', 2, 5, 'IV'], ['cot', 4, 3, 'III'], 'Examples 1.3 and 2.3 · cos α = 2/5 (Q IV), cot β = 4/3 (Q III)'], cp: [['sin', 3, 5, 'II'], ['tan', 7, 2, 'I'], 'Checkpoint 2.3 · sin α = 3/5 (Q II), tan β = 7/2 (Q I)'], x: [['sin', -5, 13, 'III'], ['cos', 3, 5, 'IV'], 'sin α = −5/13 (Q III), cos β = 3/5 (Q IV)']};
const resolve = CA.resolveRatio;
const tryDiv = (a, b) => { try { return b.isZero() ? null : a.div(b); } catch (e) { return a.v / b.v; } };
CA.lab('giv-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: 'ex', options: Object.entries(GP).map(([k, v]) => [k, v[2]]).concat([['own', 'Set your own']])},
    {type: 'select', key: 'fa', label: 'α: function', value: 'cos', options: FNS}, {type: 'number', key: 'pa', label: 'numerator', value: 2, step: 1}, {type: 'number', key: 'qa', label: 'denominator', value: 5, step: 1}, {type: 'select', key: 'Qa', label: 'α in Quadrant', value: 'IV', options: QS},
    {type: 'select', key: 'fb', label: 'β: function', value: 'cot', options: FNS}, {type: 'number', key: 'pb', label: 'numerator', value: 4, step: 1}, {type: 'number', key: 'qb', label: 'denominator', value: 3, step: 1}, {type: 'select', key: 'Qb', label: 'β in Quadrant', value: 'III', options: QS},
    {type: 'seg', key: 'w', label: 'Show the steps for', value: 'c+', options: [['c+', 'cos(α + β)'], ['s+', 'sin(α + β)'], ['c-', 'cos(α − β)'], ['s-', 'sin(α − β)']]}],
  middle: '<div id="giv-table"></div>', steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const [A, B] = GP[st.pre]; [['fa', A[0]], ['pa', A[1]], ['qa', A[2]], ['Qa', A[3]], ['fb', B[0]], ['pb', B[1]], ['qb', B[2]], ['Qb', B[3]]].forEach(([k, v]) => st.set(k, v, true)); }
  else if (key && key !== 'pre' && key !== 'w') st.set('pre', 'own', true);
  const A = resolve(st.fa, st.pa, st.qa, st.Qa), B = resolve(st.fb, st.pb, st.qb, st.Qb);
  if (typeof A === 'string' || typeof B === 'string') { $('giv-table').innerHTML = ''; lab.steps([]); lab.out(`Check ${typeof A === 'string' ? 'α' : 'β'}: ${typeof A === 'string' ? A : B}`, 'ca-incorrect'); return; }
  const sa = A.y.div(A.r), ca = A.x.div(A.r), sb = B.y.div(B.r), cb = B.x.div(B.r);
  const R = {'s+': sa.mul(cb).add(ca.mul(sb)), 's-': sa.mul(cb).sub(ca.mul(sb)), 'c+': ca.mul(cb).sub(sa.mul(sb)), 'c-': ca.mul(cb).add(sa.mul(sb))};
  const t1 = tryDiv(R['s+'], R['c+']), t2 = tryDiv(R['s-'], R['c-']), tx = t => t === null ? 'undefined' : t instanceof Rad ? t.html() : `≈ ${num(t, 4)}`;
  $('giv-table').innerHTML = `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th></th><th>x</th><th>y</th><th>r</th><th>sin</th><th>cos</th></tr><tr><th>α (Q ${st.Qa})</th><td>${A.x.html()}</td><td>${A.y.html()}</td><td>${A.r.html()}</td><td class="hl">${sa.html()}</td><td class="hl">${ca.html()}</td></tr><tr><th>β (Q ${st.Qb})</th><td>${B.x.html()}</td><td>${B.y.html()}</td><td>${B.r.html()}</td><td class="hl2">${sb.html()}</td><td class="hl2">${cb.html()}</td></tr></table></div>
  <div class="ca-scroll-x"><table class="ca-data-table"><tr><th>sin(α + β)</th><th>sin(α − β)</th><th>cos(α + β)</th><th>cos(α − β)</th><th>tan(α + β)</th><th>tan(α − β)</th></tr><tr><td>${R['s+'].html()}</td><td>${R['s-'].html()}</td><td>${R['c+'].html()}</td><td>${R['c-'].html()}</td><td>${tx(t1)}</td><td>${tx(t2)}</td></tr></table></div>`;
  const w = st.w, f = w[0] === 's' ? 'sin' : 'cos', o = w[1], form = f === 'sin' ? `sin α cos β ${o === '+' ? '+' : '−'} cos α sin β` : `cos α cos β ${o === '+' ? '−' : '+'} sin α sin β`;
  const sub = f === 'sin' ? `${P(sa.str())}${P(cb.str())} ${o === '+' ? '+' : '−'} ${P(ca.str())}${P(sb.str())}` : `${P(ca.str())}${P(cb.str())} ${o === '+' ? '−' : '+'} ${P(sa.str())}${P(sb.str())}`;
  lab.steps([['α from its triangle', `x = ${A.x.str()}, y = ${A.y.str()}, r = ${A.r.str()}: sin α = ${sa.str()}, cos α = ${ca.str()}`], ['β from its triangle', `x = ${B.x.str()}, y = ${B.y.str()}, r = ${B.r.str()}: sin β = ${sb.str()}, cos β = ${cb.str()}`],
    [`${f}(α ${o === '+' ? '+' : '−'} β)`, form], ['Substitute', sub], ['Result', R[w].str()]]);
  lab.out(`${f}(α ${o === '+' ? '+' : '−'} β) = <b>${R[w].html()}</b> ≈ ${num(R[w].v, 4)}. The signs of x and y come from the quadrants; the sizes come from x² + y² = r².`, 'ca-correct');
});

/* ---------- 04 · cofunctions ---------- */
CA.proof('co-proof', [
  {title: 'cos(π/2 − θ) = sin θ', goal: 'Show <b>cos(π/2 − θ) = sin θ</b>.', done: '✓ Cosine of the complement is sine.', lines: [['cos(π/2 − θ)', 'Start'], ['= cos(π/2)cos θ + sin(π/2)sin θ', 'Difference formula for cosine'], ['= 0 · cos θ + 1 · sin θ', 'cos(π/2) = 0, sin(π/2) = 1'], ['= sin θ', 'Simplify']], lhs: x => Math.cos(PI / 2 - x), rhs: Math.sin},
  {title: 'sin(π/2 − θ) = cos θ', goal: 'Show <b>sin(π/2 − θ) = cos θ</b>.', done: '✓ Sine of the complement is cosine.', lines: [['sin(π/2 − θ)', 'Start'], ['= sin(π/2)cos θ − cos(π/2)sin θ', 'Difference formula for sine'], ['= 1 · cos θ − 0 · sin θ', 'Special values'], ['= cos θ', 'Simplify']], lhs: x => Math.sin(PI / 2 - x), rhs: Math.cos},
  {title: 'tan(π/2 − θ) = cot θ', goal: 'Show <b>tan(π/2 − θ) = cot θ</b>.', done: '✓ Tangent of the complement is cotangent.', lines: [['tan(π/2 − θ)', 'Start'], ['= sin(π/2 − θ) / cos(π/2 − θ)', 'Quotient identity (tan(π/2) is undefined, so use sine and cosine)'], ['= cos θ / sin θ', 'The two identities above'], ['= cot θ', 'Quotient identity']], lhs: x => Math.tan(PI / 2 - x), rhs: x => 1 / Math.tan(x)},
  {title: 'sin(π − θ) = sin θ', goal: 'Show <b>sin(π − θ) = sin θ</b> (why reference angles work in Quadrant II).', done: '✓ An angle and its supplement have the same sine.', lines: [['sin(π − θ)', 'Start'], ['= sin π cos θ − cos π sin θ', 'Difference formula for sine'], ['= 0 · cos θ − (−1) sin θ', 'sin π = 0, cos π = −1'], ['= sin θ', 'Simplify']], lhs: x => Math.sin(PI - x), rhs: Math.sin}
], {label: 'Identity'});

/* ---------- guided problems ---------- */
CA.guided('72', [
  {q: 'Which formula is correct?', opts: ['cos(α + β) = cos α cos β − sin α sin β', 'cos(α + β) = cos α cos β + sin α sin β', 'cos(α + β) = cos α + cos β', 'cos(α + β) = sin α cos β + cos α sin β'], correct: 0, hint: 'The cosine formulas switch the sign.', why: 'cos(α + β) = cos α cos β − sin α sin β.'},
  {q: 'Which formula is correct?', opts: ['sin(α − β) = sin α cos β − cos α sin β', 'sin(α − β) = sin α cos β + cos α sin β', 'sin(α − β) = sin α − sin β', 'sin(α − β) = cos α cos β − sin α sin β'], correct: 0, hint: 'The sine formulas keep the sign.', why: 'sin(α − β) = sin α cos β − cos α sin β.'},
  {q: 'cos 15° = ?', opts: ['(√6 + √2)/4', '(√6 − √2)/4', '(√3 − 1)/2', '√2/2 − √3/2'], correct: 0, hint: '15° = 45° − 30°.', why: 'cos 45° cos 30° + sin 45° sin 30° = (√6)/4 + (√2)/4.', ref: {panel: 'exact', what: 'Checkpoint 1.2', body: '<p>Use the difference formula of cosine to find <b>cos 15°</b>.</p>'}},
  {q: 'sin(π/12) = ?', opts: ['(√6 − √2)/4', '(√6 + √2)/4', '(√2 − √6)/4', '1/2 − √2/2'], correct: 0, hint: 'π/12 = π/3 − π/4.', why: 'sin(π/3)cos(π/4) − cos(π/3)sin(π/4) = √6/4 − √2/4.'},
  {q: 'tan 105° = ?', opts: ['−(2 + √3)', '2 + √3', '2 − √3', '−(2 − √3)'], correct: 0, hint: '105° = 45° + 60°, then rationalize.', why: '(1 + √3)/(1 − √3) = (1 + √3)²/(1 − 3) = (4 + 2√3)/(−2) = −(2 + √3).', ref: {panel: 'exact', what: 'Example 3.1', body: '<p>Find the exact value of <b>tan 105°</b>.</p>'}},
  {q: 'cos(13π/12) = ?', opts: ['−(√6 + √2)/4', '(√6 + √2)/4', '−(√6 − √2)/4', '(√2 − √6)/4'], correct: 0, hint: '13π/12 = 5π/4 − π/6, Quadrant III.', why: 'cos(5π/4)cos(π/6) + sin(5π/4)sin(π/6) = −√6/4 − √2/4.'},
  {q: 'Given cos α = 2/5 (3π/2 &lt; α &lt; 2π) and cot β = 4/3 (π &lt; β &lt; 3π/2), cos(α + β) = ?', opts: ['(−8 − 3√21)/25', '(−8 + 3√21)/25', '(8 − 3√21)/25', '(4√21 − 6)/25'], correct: 0, hint: 'sin α = −√21/5, sin β = −3/5, cos β = −4/5.', why: '(2/5)(−4/5) − (−√21/5)(−3/5) = −8/25 − 3√21/25.', ref: {panel: 'given', what: 'Example 1.3', body: '<p>cos α = <b>2/5</b>, 3π/2 &lt; α &lt; 2π; cot β = <b>4/3</b>, π &lt; β &lt; 3π/2. Find cos(α + β).</p>'}},
  {q: 'With the same α and β, sin(α + β) = ?', opts: ['(4√21 − 6)/25', '(−4√21 − 6)/25', '(6 − 4√21)/25', '(−8 − 3√21)/25'], correct: 0, hint: 'sin α cos β + cos α sin β.', why: '(−√21/5)(−4/5) + (2/5)(−3/5) = 4√21/25 − 6/25.', ref: {problem: 7, what: 'the same α and β'}},
  {q: 'Which is the difference formula for tangent?', opts: ['(tan α − tan β)/(1 + tan α tan β)', '(tan α − tan β)/(1 − tan α tan β)', '(tan α + tan β)/(1 + tan α tan β)', 'tan α − tan β'], correct: 0, hint: 'The denominator has the opposite sign of the numerator.', why: 'tan(α − β) = (tan α − tan β)/(1 + tan α tan β).'},
  {q: 'cos(π/2 − θ) equals…', opts: ['sin θ', 'cos θ', '−sin θ', '−cos θ'], correct: 0, hint: 'Use the difference formula with α = π/2.', why: 'cos(π/2)cos θ + sin(π/2)sin θ = sin θ.'}
]);
})();
