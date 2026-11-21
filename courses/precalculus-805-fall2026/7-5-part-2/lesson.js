/* Section 7.5 Part II · Solving Trigonometric Equations: Factoring and Identities — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Rad} = CA;
const PI = Math.PI, $ = id => document.getElementById(id);
const IVS = {std: [{a: 0, b: 2 * PI}, false, '[0, 2π)'], deg: [{a: 0, b: 2 * PI}, true, '[0°, 360°)'], neg2: [{a: -2 * PI, b: 0}, false, '[−2π, 0)']};
const lin = (a, fn, b) => { const as = a.str === '1' ? '' : a.str === '−1' ? '−' : a.str + ' '; return `${as}${fn} θ${b.v ? ` ${b.v < 0 ? '−' : '+'} ${b.str.replace(/^[−-]/, '')}` : ''}`; };
const R = s => CA.parseReal(s);
function solveAll(list, ivKey, dp) { // list of {fn, v, label}
  const [iv, deg] = IVS[ivKey], all = [], parts = [];
  list.forEach(e => { const S = CA.solveTrig(e.fn, e.v, iv, {deg, dp}); parts.push([e.label, S.sols.length ? S.sols.map(s => s.text).join(', ') : `no solution${S.note ? ' (' + S.note + ')' : ''}`]); S.sols.forEach(s => { if (!all.some(t => Math.abs(t.x - s.x) < 1e-9)) all.push(s); }); });
  all.sort((p, q) => p.x - q.x); return {all, parts};
}
function graph(lab, f, ivKey, sols, breaks = []) {
  const [iv] = IVS[ivKey], P = lab.plane({xmin: iv.a, xmax: iv.b, ymin: -6, ymax: 6, xpi: F(1, 2), equal: false});
  P.curve(f, {color: 'orange', width: 3.2, samples: 2400, breaks}); sols.forEach((s, i) => P.point(s.x, 0, {color: 'green', r: 6.5, label: s.text, labelOpt: {size: 11, dy: i % 2 ? 22 : -12}})); P.render();
}

/* ---------- 01 · factored form ---------- */
const FP = [
  {t: 'cos θ (2 + csc θ) = 0 on [0, 2π)', eq: 'cos θ (2 + csc θ) = 0', iv: 'std', dp: 4, fac: [['cos', '1', '0'], ['csc', '1', '2']], f: x => Math.cos(x) * (2 + 1 / Math.sin(x)), br: [0, PI, 2 * PI]},
  {t: '5 sin²θ + 2 sin θ = 0 on [0, 2π)', eq: '5 sin²θ + 2 sin θ = 0 ⟹ sin θ (5 sin θ + 2) = 0', iv: 'std', dp: 2, fac: [['sin', '1', '0'], ['sin', '5', '2']], f: x => 5 * Math.sin(x) ** 2 + 2 * Math.sin(x)},
  {t: '(8 sec θ + 8)(tan θ − √3) = 0 on [−2π, 0)', eq: '(8 sec θ + 8)(tan θ − √3) = 0', iv: 'neg2', dp: 4, fac: [['sec', '8', '8'], ['tan', '1', '-√3']], f: x => (8 / Math.cos(x) + 8) * (Math.tan(x) - Math.sqrt(3)), br: [-3 * PI / 2, -PI / 2]}
];
CA.lab('fac-lab', {
  controls: [{type: 'select', key: 'p', label: 'Equation', value: '0', options: FP.map((p, i) => [String(i), p.t])}],
  top: '<div class="ca-equation" id="fac-eq"></div>', plot: {w: 620, h: 300}, plotLabel: 'Graph of the left side with its zeros', readouts: [['sol', 'All solutions']], steps: true
}, (lab, st) => {
  const p = FP[+st.p]; $('fac-eq').innerHTML = `Solve <b>${p.eq}</b> on ${IVS[p.iv][2]}`;
  const list = p.fac.map(([fn, a, b]) => { const A = R(a), B = R(b), v = -B.v / A.v, vR = B.rad && A.rad ? B.rad.neg().div(A.rad) : null; return {fn, v, label: `${lin(A, fn, B)} = 0 ⟹ ${fn} θ = ${vR ? vR.str() : num(v, 4)}`}; });
  const {all, parts} = solveAll(list, p.iv, p.dp);
  lab.steps([['Zero-product property', p.fac.map(([fn, a, b]) => `${lin(R(a), fn, R(b))} = 0`).join('  or  ')]].concat(parts));
  lab.read('sol', all.map(s => s.text).join(', ') || 'none'); graph(lab, p.f, p.iv, all, p.br || []);
  lab.out(`Every green point is an x-intercept of the left side: ${all.length} solution${all.length === 1 ? '' : 's'} in ${IVS[p.iv][2]}.`, 'ca-correct');
});

/* ---------- 02 · quadratic in form ---------- */
const QP = {e2: ['cos', 2, 0, -1, 'deg', '2cos²θ − 1 = 0 on [0°, 360°)'], e3: ['sin', 3, 5, -2, 'std', '3sin²θ + 5 sin θ − 2 = 0 on [0, 2π)'], c3: ['cos', 1, -2, -1, 'deg', 'cos²θ − 2 cos θ − 1 = 0 on [0°, 360°)'], x: ['sin', 2, -1, -1, 'std', '2sin²θ − sin θ − 1 = 0 on [0, 2π)']};
const quadStr = (u, a, b, c) => `${a === 1 ? '' : a === -1 ? '−' : a}${u}²θ${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${u} θ` : ''}${c ? ` ${c < 0 ? '−' : '+'} ${Math.abs(c)}` : ''} = 0`;
CA.lab('quad-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Equation', value: 'e3', options: Object.entries(QP).map(([k, v]) => [k, v[5]]).concat([['own', 'Set your own']])},
    {type: 'seg', key: 'u', label: 'u =', value: 'sin', options: [['sin', 'sin θ'], ['cos', 'cos θ']]}, {type: 'number', key: 'a', label: 'a =', value: 3, step: 1}, {type: 'number', key: 'b', label: 'b =', value: 5, step: 1}, {type: 'number', key: 'c', label: 'c =', value: -2, step: 1},
    {type: 'select', key: 'iv', label: 'Interval', value: 'std', options: [['std', '[0, 2π)'], ['deg', '[0°, 360°)']]}],
  top: '<div class="ca-equation" id="quad-eq"></div>', plot: {w: 620, h: 300}, plotLabel: 'Graph of the quadratic expression in θ', readouts: [['u', 'Values of u'], ['sol', 'Solutions']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = QP[st.pre]; ['u', 'a', 'b', 'c', 'iv'].forEach((k, i) => st.set(k, p[i], true)); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const {u, a, b, c} = st; if (![a, b, c].every(Number.isInteger) || a === 0) { lab.out('Use integers with a ≠ 0.', 'ca-incorrect'); lab.steps([]); return; }
  $('quad-eq').innerHTML = `Solve <b>${quadStr(u, a, b, c)}</b> on ${IVS[st.iv][2]}`;
  const D = b * b - 4 * a * c, steps = [['Substitute u = ' + u + ' θ', quadStr('u', a, b, c).replace(/u²θ/, 'u²').replace(/u θ/, 'u')], ['Discriminant', `b² − 4ac = ${b * b} − 4(${a})(${c}) = ${D}`]];
  if (D < 0) { steps.push(['No real u', 'the discriminant is negative']); lab.steps(steps); lab.read('u', 'none'); lab.read('sol', 'none'); lab.out('No real solutions.', 'ca-incorrect'); return; }
  const roots = [1, -1].map(sg => Rad.of(F(-b, 2 * a)).add(Rad.sqrt(D).mul(F(sg, 2 * a)))).filter((r, i, arr) => i === 0 || !r.eq(arr[0]));
  steps.push(['Quadratic formula', `u = (${-b} ± √${D})/${2 * a} ⟹ u = ${roots.map(r => r.str()).join(' or u = ')}`]);
  const keep = roots.filter(r => Math.abs(r.v) <= 1 + 1e-12), rej = roots.filter(r => Math.abs(r.v) > 1 + 1e-12);
  if (rej.length) steps.push(['Reject', rej.map(r => `${u} θ = ${r.str()} ≈ ${num(r.v, 4)} is outside [−1, 1]`).join('; ')]);
  const dp = st.pre === 'e2' ? 0 : 2, {all, parts} = solveAll(keep.map(r => ({fn: u, v: r.v, label: `${u} θ = ${r.str()}`})), st.iv, dp);
  lab.steps(steps.concat(parts)); lab.read('u', roots.map(r => `${r.html()}${Math.abs(r.v) > 1 + 1e-12 ? ' ✕' : ''}`).join(', ')); lab.read('sol', all.map(s => s.text).join(', ') || 'none');
  graph(lab, x => a * CA.trig[u](x) ** 2 + b * CA.trig[u](x) + c, st.iv, all);
  lab.out(rej.length ? `One root is impossible for ${u} θ, so only ${keep.length ? keep.map(r => r.str()).join(' and ') : 'no value'} remains.` : `Both values of u are allowed, so each gives its own angles.`, 'ca-correct');
});

/* ---------- 03 · identities first ---------- */
const s = Math.sin, c = Math.cos;
const IP = [
  {t: 'sin(2x)cos x − sin x cos(2x) = √2/2 on [0, 2π)', iv: 'std', dp: 4, f: x => s(2 * x) * c(x) - s(x) * c(2 * x) - Math.SQRT2 / 2,
    lines: [['Difference formula for sine', 'sin(2x)cos x − cos(2x)sin x = sin(2x − x)'], ['Simplify', 'sin x = √2/2']], eqs: [{fn: 'sin', v: Math.SQRT2 / 2, label: 'sin x = √2/2'}]},
  {t: '5cos²x + sin x − 5 = 0 on [0°, 360°)', iv: 'deg', dp: 2, f: x => 5 * c(x) ** 2 + s(x) - 5,
    lines: [['Pythagorean identity', '5(1 − sin²x) + sin x − 5 = 0'], ['Simplify', '−5sin²x + sin x = 0'], ['Factor', 'sin x(−5 sin x + 1) = 0'], ['Zero-product property', 'sin x = 0 or sin x = 1/5']], eqs: [{fn: 'sin', v: 0, label: 'sin x = 0'}, {fn: 'sin', v: 0.2, label: 'sin x = 1/5 (reference angle sin⁻¹(1/5) ≈ 11.54°)'}]},
  {t: '4 sin(2x) − cos x = 0 on [0, 2π)', iv: 'std', dp: 2, f: x => 4 * s(2 * x) - c(x),
    lines: [['Double-angle formula', '4(2 sin x cos x) − cos x = 8 sin x cos x − cos x = 0'], ['Factor', 'cos x(8 sin x − 1) = 0'], ['Zero-product property', 'cos x = 0 or sin x = 1/8']], eqs: [{fn: 'cos', v: 0, label: 'cos x = 0'}, {fn: 'sin', v: 0.125, label: 'sin x = 1/8'}]},
  {t: '3sin²x + 2 cos x = 0 on [0, 2π)', iv: 'std', dp: 2, f: x => 3 * s(x) ** 2 + 2 * c(x),
    lines: [['Pythagorean identity', '3(1 − cos²x) + 2 cos x = 0'], ['Simplify and multiply by −1', '3cos²x − 2 cos x − 3 = 0'], ['Quadratic formula', 'cos x = (2 ± √40)/6 = (1 ± √10)/3'], ['Reject', '(1 + √10)/3 ≈ 1.387 is outside [−1, 1]']], eqs: [{fn: 'cos', v: (1 - Math.sqrt(10)) / 3, label: 'cos x = (1 − √10)/3 ≈ −0.7208'}]}
];
CA.lab('idn-lab', {
  controls: [{type: 'select', key: 'p', label: 'Equation', value: '0', options: IP.map((p, i) => [String(i), p.t])}],
  plot: {w: 620, h: 300}, plotLabel: 'Graph of left side minus right side', readouts: [['sol', 'Solutions']], steps: true
}, (lab, st) => {
  const p = IP[+st.p], {all, parts} = solveAll(p.eqs, p.iv, p.dp);
  lab.steps(p.lines.concat(parts)); lab.read('sol', all.map(t => t.text).join(', ')); graph(lab, p.f, p.iv, all);
  lab.out(`After the identity, the equation only involves ${p.eqs.map(e => e.fn).filter((v, i, a) => a.indexOf(v) === i).join(' and ')} of x, and the solutions match the graph's x-intercepts.`, 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('75b', [
  {q: 'Solve cos θ (2 + csc θ) = 0 on [0, 2π).', opts: ['π/2, 7π/6, 3π/2, 11π/6', 'π/2, 3π/2 only', '7π/6, 11π/6 only', 'π/6, π/2, 5π/6, 3π/2'], correct: 0, hint: 'cos θ = 0 or csc θ = −2 (sin θ = −1/2).', why: 'cos θ = 0 gives π/2, 3π/2; sin θ = −1/2 gives 7π/6, 11π/6.', ref: {panel: 'factored', what: 'the equation cos θ (2 + csc θ) = 0', body: '<p>Solve <b>cos θ (2 + csc θ) = 0</b> on [0, 2π).</p>'}},
  {q: 'Solve 2cos²θ − 1 = 0 on [0°, 360°).', opts: ['45°, 135°, 225°, 315°', '45°, 315°', '60°, 300°', '30°, 150°, 210°, 330°'], correct: 0, hint: 'cos θ = ±√2/2.', why: 'cos θ = √2/2: 45°, 315°; cos θ = −√2/2: 135°, 225°.'},
  {q: 'In 3sin²θ + 5 sin θ − 2 = 0, which value of sin θ is rejected?', opts: ['−2', '1/3', '−1/3', '2'], correct: 0, hint: '(sin θ + 2)(3 sin θ − 1) = 0.', why: 'sin θ = −2 is outside [−1, 1]; sin θ = 1/3 is kept.', ref: {panel: 'quadratic', what: 'the equation 3sin²θ + 5 sin θ − 2 = 0', body: '<p>Solve <b>3sin²θ + 5 sin θ − 2 = 0</b> on [0, 2π).</p>'}},
  {q: 'The solutions of 3sin²θ + 5 sin θ − 2 = 0 in [0, 2π) are approximately…', opts: ['0.34 and 2.80', '0.34 and 5.94', '3.48 and 5.94', '0.34 only'], correct: 0, hint: 'sin θ = 1/3 is positive: Quadrants I and II.', why: 'sin⁻¹(1/3) ≈ 0.34 and π − 0.34 ≈ 2.80.', ref: {problem: 3, what: 'the same equation'}},
  {q: 'sin(2x)cos x − sin x cos(2x) simplifies to…', opts: ['sin x', 'sin 3x', 'cos x', '2 sin x'], correct: 0, hint: 'sin α cos β − cos α sin β = sin(α − β).', why: 'sin(2x − x) = sin x.'},
  {q: 'After using sin²x + cos²x = 1, 5cos²x + sin x − 5 = 0 becomes…', opts: ['−5sin²x + sin x = 0', '5sin²x + sin x = 0', '−5sin²x + sin x − 10 = 0', 'sin x = 0'], correct: 0, hint: 'Replace cos²x by 1 − sin²x.', why: '5 − 5sin²x + sin x − 5 = −5sin²x + sin x.'},
  {q: 'Why should you not divide sin x(−5 sin x + 1) = 0 by sin x?', opts: ['You would lose the solutions where sin x = 0', 'Dividing by sin x is never allowed in algebra', 'It changes the period', 'It makes the equation quadratic'], correct: 0, hint: 'What if sin x = 0?', why: 'Dividing assumes sin x ≠ 0 and throws away x = 0° and 180°.'},
  {q: 'Using sin 2x = 2 sin x cos x, 4 sin(2x) − cos x = 0 factors as…', opts: ['cos x(8 sin x − 1) = 0', 'sin x(8 cos x − 1) = 0', 'cos x(4 sin x − 1) = 0', '(8 sin x − 1)(cos x − 1) = 0'], correct: 0, hint: '4 · 2 sin x cos x = 8 sin x cos x.', why: '8 sin x cos x − cos x = cos x(8 sin x − 1).'},
  {q: 'How many solutions does sin θ (5 sin θ + 2) = 0 have in [0, 2π)?', opts: ['4', '2', '3', '1'], correct: 0, hint: 'sin θ = 0 and sin θ = −2/5 each give two.', why: '0, π from the first factor; π + 0.41 and 2π − 0.41 from the second.'},
  {q: 'Solve tan θ = √3 on [−2π, 0).', opts: ['−5π/3 and −2π/3', '−π/3 and −4π/3', 'π/3 and 4π/3', '−2π/3 only'], correct: 0, hint: 'θ = π/3 + kπ.', why: 'k = −1 gives −2π/3 and k = −2 gives −5π/3; both are in [−2π, 0).'}
]);
})();
