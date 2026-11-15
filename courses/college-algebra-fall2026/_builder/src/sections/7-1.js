/* Section 7.1 · Systems of Linear Equations: Two Variables — interactive activities */
(() => {
'use strict';
const {fmt, num, Frac, F} = CA;
const Q = v => Frac.of(v);
const term = (c, v, first) => { // signed term "c·v" for an equation or expression
  c = Q(c); if (c.n === 0) return '';
  const mag = c.n < 0 ? c.neg() : c, body = (v && mag.eq(1)) ? v : `${mag}${v}`;
  return first ? (c.n < 0 ? '−' : '') + body : (c.n < 0 ? ' − ' : ' + ') + body;
};
const eqStr = ([a, b, c]) => { const L = (term(a, 'x', true) + term(b, 'y', !a)) || '0'; return `${L} = ${Q(c)}`; };
const linStr = (p, q, v) => { const s = term(p, v, true) + term(q, '', !Q(p).n); return s || '0'; };
const solve2 = (e1, e2) => {
  const [a1, b1, c1] = e1.map(Q), [a2, b2, c2] = e2.map(Q), D = a1.mul(b2).sub(a2.mul(b1));
  if (D.n !== 0) return {type: 'independent', x: c1.mul(b2).sub(c2.mul(b1)).div(D), y: a1.mul(c2).sub(a2.mul(c1)).div(D)};
  const consistent = a1.mul(c2).sub(a2.mul(c1)).n === 0 && b1.mul(c2).sub(b2.mul(c1)).n === 0;
  return {type: consistent ? 'dependent' : 'inconsistent'};
};
const drawLine = (P, [a, b, c], opt) => b !== 0 ? P.lineMB(-a / b, c / b, opt) : P.vline(c / a, Object.assign({dash: false, width: 3}, opt));
const TYPE = {independent: 'Independent · one solution', inconsistent: 'Inconsistent · no solution', dependent: 'Dependent · infinitely many solutions'};

/* ---------- 01 · test a point ---------- */
const SYS1 = {A: [[1, 4, 5], [-3, 2, 0]], B: [[3, -1, 5], [2, 1, 15]], C: [[1, 1, 5], [2, -1, 4]]};
CA.lab('check-lab', {
  controls: [{type: 'select', key: 's', label: 'System', value: 'A', options: Object.entries(SYS1).map(([k, [e1, e2]]) => [k, `${eqStr(e1)} and ${eqStr(e2)}`])},
    {type: 'range', key: 'x', label: 'x =', min: -8, max: 8, step: 0.5, value: -4, fmt: v => num(v)},
    {type: 'range', key: 'y', label: 'y =', min: -8, max: 10, step: 0.5, value: 1, fmt: v => num(v)},
    {type: 'check', key: 'show', label: 'Show the intersection', value: false}],
  plot: {h: 380}, plotLabel: 'Two lines and a test point', legend: [['blue', 'equation 1'], ['purple', 'equation 2'], ['orange', 'test point']],
  readouts: [['e1', 'Equation 1'], ['e2', 'Equation 2']]
}, (lab, st) => {
  const [e1, e2] = SYS1[st.s], x = st.x, y = st.y, P = lab.plane({xmin: -9, xmax: 9, ymin: -9, ymax: 11});
  drawLine(P, e1, {color: 'blue'}); drawLine(P, e2, {color: 'purple'});
  const sol = solve2(e1, e2); if (st.show && sol.x) P.point(sol.x.v, sol.y.v, {color: 'green', r: 7, label: `(${sol.x}, ${sol.y})`});
  P.point(x, y, {color: 'orange', r: 8, label: `(${num(x)}, ${num(y)})`}).render();
  const chk = ([a, b, c]) => { const L = a * x + b * y, ok = Math.abs(L - c) < 1e-9; return [`${a === 1 ? '' : a === -1 ? '−' : fmt(a)}(${num(x)}) ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}(${num(y)}) = ${num(L)} ${ok ? '= ' + fmt(c) + ' <span class="ca-ok">✓ true</span>' : '≠ ' + fmt(c) + ' <span class="ca-bad">✕ false</span>'}`, ok]; };
  const [t1, ok1] = chk(e1), [t2, ok2] = chk(e2);
  lab.read('e1', t1); lab.read('e2', t2);
  lab.out(ok1 && ok2 ? `✓ (${num(x)}, ${num(y)}) makes both equations true, so it <b>is</b> the solution: the lines meet here.` : `✕ (${num(x)}, ${num(y)}) is <b>not</b> a solution: ${!ok1 && !ok2 ? 'neither equation is true' : `equation ${ok1 ? 2 : 1} is false`}.${ok1 || ok2 ? ' The point lies on one line but not on the other.' : ''}`, ok1 && ok2 ? 'ca-correct' : '');
});

/* ---------- 02 · graphing ---------- */
CA.lab('graph-lab', {
  controls: [
    {type: 'seg', key: 'pre', label: 'Load', value: 'ex', options: [['ex', '−x + y = 1 and −2x − y = 8'], ['par', 'parallel lines'], ['same', 'the same line'], ['own', 'my own']]},
    {type: 'range', key: 'm1', label: 'm₁ =', min: -3, max: 3, step: 0.5, value: 1, fmt: v => num(v)},
    {type: 'range', key: 'b1', label: 'b₁ =', min: -8, max: 8, step: 1, value: 1},
    {type: 'range', key: 'm2', label: 'm₂ =', min: -3, max: 3, step: 0.5, value: -2, fmt: v => num(v)},
    {type: 'range', key: 'b2', label: 'b₂ =', min: -8, max: 8, step: 1, value: -8}],
  plot: {h: 400}, plotLabel: 'Two lines in slope-intercept form', legend: [['blue', 'y = m₁x + b₁'], ['purple', 'y = m₂x + b₂', true]],
  readouts: [['l1', 'Line 1'], ['l2', 'Line 2'], ['type', 'Type'], ['sol', 'Solution']], steps: true
}, (lab, st, key) => {
  const PRE = {ex: [1, 1, -2, -8], par: [2, 3, 2, -1], same: [-0.5, 2, -0.5, 2]};
  if (key === 'pre' && PRE[st.pre]) ['m1', 'b1', 'm2', 'b2'].forEach((k, i) => st.set(k, PRE[st.pre][i], true));
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const {m1, b1, m2, b2} = st, P = lab.plane({xmin: -10, xmax: 10, ymin: -12, ymax: 12});
  P.lineMB(m1, b1, {color: 'blue', width: 3.2}).lineMB(m2, b2, {color: 'purple', width: 3, dash: m1 === m2 && b1 === b2 ? '10 8' : false});
  const ln = (m, b) => `y = ${linStr(m, b, 'x')}`;
  lab.read('l1', ln(m1, b1)); lab.read('l2', ln(m2, b2));
  let type, sol = '—';
  if (m1 !== m2) { type = 'independent'; const x = Q(b2).sub(Q(b1)).div(Q(m1).sub(Q(m2))), y = Q(m1).mul(x).add(Q(b1)); sol = `(${x}, ${y})`; P.point(x.v, y.v, {color: 'orange', r: 8, label: sol}); }
  else type = b1 === b2 ? 'dependent' : 'inconsistent';
  P.render();
  lab.read('type', TYPE[type]); lab.read('sol', type === 'dependent' ? 'every point on the line' : type === 'inconsistent' ? 'none' : sol);
  lab.steps(st.pre === 'ex' ? [['Solve equation 1 for y', '−x + y = 1 → y = x + 1 (slope 1, y-intercept 1)'], ['Solve equation 2 for y', '−2x − y = 8 → −y = 2x + 8 → y = −2x − 8 (slope −2, y-intercept −8)'], ['Read the intersection', 'The lines cross at (−3, −2). Check: −(−3) + (−2) = 1 ✓ and −2(−3) − (−2) = 8 ✓']]
    : [['Compare the slopes', m1 !== m2 ? `m₁ = ${num(m1)} ≠ m₂ = ${num(m2)}: the lines cross exactly once.` : `m₁ = m₂ = ${num(m1)}: the lines are parallel or identical.`], ['Compare the intercepts', m1 !== m2 ? 'Not needed: different slopes already guarantee one intersection.' : b1 === b2 ? 'b₁ = b₂: it is the same line.' : `b₁ = ${b1} ≠ b₂ = ${b2}: parallel lines never meet.`]]);
  lab.out(`<b>${TYPE[type]}.</b> ${type === 'independent' ? `The solution is the intersection point ${sol}.` : type === 'inconsistent' ? 'Parallel lines have no point in common.' : 'The lines coincide, so every point on the line is a solution.'}`);
});

/* ---------- 03 · substitution stepper ---------- */
const SUBS = {
  a: [[3, 5, -11], [1, -2, 11]], b: [[2, 1, 1], [-4, -2, 5]], c: [[1, 1, 5], [2, -1, 4]], d: [[-2, 1, -1], [4, -2, 2]], e: [[2, 3, 7], [5, -1, 9]]
};
function substitutionSteps(E) {
  // choose an equation and a variable with coefficient ±1 if possible
  let pick = null;
  for (const i of [1, 0]) for (const v of [0, 1]) if (!pick && Math.abs(E[i][v]) === 1) pick = [i, v];
  if (!pick) pick = [0, E[0][0] !== 0 ? 0 : 1];
  const [i, v] = pick, j = 1 - i, u = 1 - v, V = 'xy'[v], U = 'xy'[u];
  const [ai, bi, ci] = E[i].map(Q), coef = [ai, bi], cv = coef[v], cu = coef[u];
  const p = cu.neg().div(cv), q = ci.div(cv); // V = p·U + q
  const expr = linStr(p, q, U);
  const S = [[`1 · Solve equation ${i + 1} for ${V}`, `${eqStr(E[i])} → ${V} = ${expr}`]];
  const aj = Q(E[j][v]), bj = Q(E[j][u]), cj = Q(E[j][2]);
  const mag = aj.n < 0 ? aj.neg() : aj, subPart = first => `${first ? (aj.n < 0 ? '−' : '') : (aj.n < 0 ? ' − ' : ' + ')}${mag.eq(1) ? '' : mag}(${expr})`;
  const left = v === 0 ? subPart(true) + term(bj, U, false) : (bj.n ? term(bj, U, true) + subPart(false) : subPart(true));
  S.push([`2 · Substitute into equation ${j + 1}`, `${eqStr(E[j])} → ${left} = ${cj}`]);
  const K = aj.mul(p).add(bj), C0 = aj.mul(q);
  S.push(['3 · Distribute', `${linStr(aj.mul(p), C0, U)}${term(bj, U, false)} = ${cj}`]);
  let out;
  if (K.n === 0) {
    const tru = C0.eq(cj);
    S.push(['4 · Combine like terms', `${C0} = ${cj} &nbsp; ${tru ? '<span class="ca-ok">true</span>' : '<span class="ca-bad">false</span>'}`]);
    S.push(['5 · Interpret', tru ? `${U} canceled and a true statement remains: the equations describe the same line. Infinitely many solutions (dependent).` : `${U} canceled and a false statement remains: the lines are parallel. No solution (inconsistent).`]);
    out = {type: tru ? 'dependent' : 'inconsistent'};
  } else {
    S.push(['4 · Combine like terms', `${linStr(K, C0, U)} = ${cj}`]);
    const uval = cj.sub(C0).div(K);
    S.push([`5 · Solve for ${U}`, `${linStr(K, 0, U)} = ${cj.sub(C0)} → ${U} = ${uval}`]);
    const vval = p.mul(uval).add(q);
    const pPart = p.n === 0 ? '' : `${p.eq(1) ? '' : p.eq(-1) ? '−' : p}(${uval})`, qPart = p.n === 0 ? `${q}` : term(q, '', false);
    S.push([`6 · Substitute back into ${V} = ${expr}`, `${V} = ${pPart}${qPart} = ${vval}`]);
    const x = v === 0 ? vval : uval, y = v === 0 ? uval : vval;
    const chk = e => Q(e[0]).mul(x).add(Q(e[1]).mul(y)).eq(e[2]);
    S.push(['7 · Check in both equations', `${eqStr(E[0])}: ${chk(E[0]) ? '✓' : '✕'} &nbsp; ${eqStr(E[1])}: ${chk(E[1]) ? '✓' : '✕'} → solution (${x}, ${y})`]);
    out = {type: 'independent', x, y};
  }
  return {steps: S, out};
}
let subStep = 0, subStepper;
const sysOf = st => [[st.pa, st.pb, st.pc], [st.qa, st.qb, st.qc]].map(e => e.map(v => Number.isFinite(v) ? Math.round(v) : 0));
const coefCtl = pref => [['a', 'a'], ['b', 'b'], ['c', 'c']].map(([k]) => ({type: 'number', key: pref + k, label: `${k}${pref === 'p' ? '₁' : '₂'} =`, value: 0, step: 1}));
const sub = CA.lab('sub-lab', {
  controls: [{type: 'select', key: 'pre', label: 'System', value: 'a', options: [['a', '3x + 5y = −11, x − 2y = 11'], ['b', '2x + y = 1, −4x − 2y = 5'], ['c', 'x + y = 5, 2x − y = 4'], ['d', '−2x + y = −1, 4x − 2y = 2'], ['e', '2x + 3y = 7, 5x − y = 9'], ['own', 'my own (type below)']]},
    ...coefCtl('p'), ...coefCtl('q')],
  top: '<div class="ca-equation" id="sub-eq"></div><div id="sub-stepper"></div>', steps: true, plot: {h: 360}, plotLabel: 'The two lines of the system'
}, (lab, st, key) => {
  if (key === 'pre' || key === null) { if (SUBS[st.pre]) { const [e1, e2] = SUBS[st.pre]; ['pa', 'pb', 'pc'].forEach((k, i) => st.set(k, e1[i], true)); ['qa', 'qb', 'qc'].forEach((k, i) => st.set(k, e2[i], true)); } }
  else st.set('pre', 'own', true);
  if (key !== null) { subStep = 0; subStepper && subStepper.reset(); return; }
  drawSub(lab, st);
});
function drawSub(lab, st) {
  const E = sysOf(st);
  document.getElementById('sub-eq').innerHTML = `Equation 1: ${eqStr(E[0])} &nbsp;&nbsp;|&nbsp;&nbsp; Equation 2: ${eqStr(E[1])}`;
  if ((E[0][0] === 0 && E[0][1] === 0) || (E[1][0] === 0 && E[1][1] === 0)) { lab.steps([]); lab.out('Each equation needs at least one nonzero coefficient.', 'ca-incorrect'); return; }
  const {steps, out} = substitutionSteps(E), n = steps.length, i = Math.min(subStep, n - 1);
  lab.steps(steps.slice(0, i + 1));
  const P = lab.plane({xmin: -10, xmax: 10, ymin: -10, ymax: 10});
  drawLine(P, E[0], {color: 'blue'}); drawLine(P, E[1], {color: 'purple', dash: out.type === 'dependent' ? '10 8' : false});
  if (i === n - 1 && out.x) P.point(out.x.v, out.y.v, {color: 'orange', r: 8, label: `(${out.x}, ${out.y})`});
  P.render();
  lab.out(i < n - 1 ? 'Press <b>Next step</b> to continue.' : `<b>${TYPE[out.type]}</b>${out.x ? `: the solution is (${out.x}, ${out.y}).` : '.'}`, i === n - 1 ? 'ca-correct' : '');
}
subStepper = CA.stepper('sub-stepper', () => substitutionSteps(sysOf(sub.state)).steps.length, i => { subStep = i; drawSub(sub, sub.state); });

/* ---------- 04 · elimination with multipliers ---------- */
const ELIM = {a: [[1, 2, -1], [-1, 1, 3]], b: [[5, 2, 7], [3, 1, -1]], c: [[4, -5, 0], [6, 2, 11]], d: [[1, -3, -4], [-2, 6, 8]], e: [[3, -2, 4], [-6, 4, 7]]};
const gcd = CA.gcd, lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const elim = CA.lab('elim-lab', {
  controls: [{type: 'select', key: 'pre', label: 'System', value: 'b', options: [['a', 'x + 2y = −1, −x + y = 3'], ['b', '5x + 2y = 7, 3x + y = −1'], ['c', '4x − 5y = 0, 6x + 2y = 11'], ['d', 'x − 3y = −4, −2x + 6y = 8'], ['e', '3x − 2y = 4, −6x + 4y = 7']]},
    {type: 'seg', key: 'v', label: 'Eliminate', value: 'y', options: [['x', 'x'], ['y', 'y']]},
    {type: 'range', key: 'k1', label: 'Multiply equation 1 by', min: -6, max: 6, value: 1, skip: [0]},
    {type: 'range', key: 'k2', label: 'Multiply equation 2 by', min: -6, max: 6, value: 1, skip: [0]}],
  top: '<p><button class="ca-btn ca-btn-outline" id="elim-suggest" type="button"><i class="fa-solid fa-wand-magic-sparkles"></i> Suggest multipliers</button></p>', steps: true, plot: {h: 340}, plotLabel: 'The two lines of the system'
}, (lab, st, key) => {
  if (key === 'pre') { st.set('k1', 1, true); st.set('k2', 1, true); }
  const [e1, e2] = ELIM[st.pre], k1 = st.k1, k2 = st.k2, vi = st.v === 'x' ? 0 : 1;
  const s1 = e1.map(c => c * k1), s2 = e2.map(c => c * k2), sum = s1.map((c, i) => c + s2[i]);
  const P = lab.plane({xmin: -12, xmax: 12, ymin: -10, ymax: 30});
  const sol = solve2(e1, e2);
  drawLine(P, e1, {color: 'blue'}); drawLine(P, e2, {color: 'purple', dash: sol.type === 'dependent' ? '10 8' : false});
  const steps = [['1 · Organize the equations', `${eqStr(e1)} &nbsp;|&nbsp; ${eqStr(e2)}`],
    ['2 · Multiply', `${k1}·(eq. 1): ${eqStr(s1)} &nbsp;|&nbsp; ${k2}·(eq. 2): ${eqStr(s2)}`],
    ['3 · Add the equations', eqStr(sum)]];
  if (sum[vi] !== 0) { lab.steps(steps); P.render(); lab.out(`Not yet: the ${st.v}-terms are ${fmt(s1[vi])}${st.v} and ${fmt(s2[vi])}${st.v}, which are not opposites, so ${st.v} does not cancel. Make the coefficients opposites (for example ${lcm(e1[vi], e2[vi])} and −${lcm(e1[vi], e2[vi])}).`); return; }
  const other = 1 - vi, O = 'xy'[other];
  if (sum[other] === 0) {
    const tru = sum[2] === 0;
    steps.push(['4 · Interpret', `Both variables canceled: 0 = ${fmt(sum[2])} is ${tru ? '<span class="ca-ok">true</span> → dependent, infinitely many solutions' : '<span class="ca-bad">false</span> → inconsistent, no solution'}.`]);
    lab.steps(steps); P.render(); lab.out(`<b>${TYPE[tru ? 'dependent' : 'inconsistent']}.</b>`, 'ca-correct'); return;
  }
  const val = F(sum[2], sum[other]);
  steps.push([`4 · Solve for ${O}`, `${O} = ${CA.divHTML(sum[2], sum[other])}`]);
  const eA = Q(e1[vi]), eB = Q(e1[other]), rest = Q(e1[2]).sub(eB.mul(val)), back = rest.div(eA);
  steps.push([`5 · Substitute ${O} = ${val} into equation 1`, `${eA.eq(1) ? '' : eA.eq(-1) ? '−' : eA}${st.v} ${eB.n < 0 ? '−' : '+'} ${eB.n < 0 ? eB.neg() : eB}(${val}) = ${Q(e1[2])} → ${st.v} = ${back}`]);
  const x = vi === 0 ? back : val, y = vi === 0 ? val : back;
  steps.push(['6 · Solution', `(${x}, ${y})`]);
  P.point(x.v, y.v, {color: 'orange', r: 8, label: `(${x}, ${y})`}).render();
  lab.steps(steps); lab.out(`✓ ${st.v} was eliminated. <b>Independent</b>: the solution is (${x}, ${y}).`, 'ca-correct');
});
document.getElementById('elim-suggest').addEventListener('click', () => {
  const st = elim.state, [e1, e2] = ELIM[st.pre], vi = st.v === 'x' ? 0 : 1, L = lcm(e1[vi], e2[vi]);
  st.set('k1', L / e1[vi], true); st.set('k2', -L / e2[vi]);
});

/* ---------- 05 · classify ---------- */
CA.cards('types-cards', [
  {expr: 'y = 3x + 1 and y = 3x − 4', correct: 1, why: 'Same slope 3, different intercepts: parallel lines, no solution.'},
  {expr: 'y = 2x + 5 and y = −x + 2', correct: 0, why: 'Different slopes (2 and −1): the lines cross once.'},
  {expr: 'x − 3y = −4 and −2x + 6y = 8', correct: 2, why: 'The second equation is −2 times the first: the same line.'},
  {expr: 'Solving gives 0 = 9', correct: 1, why: 'A false statement after both variables cancel means no solution.'},
  {expr: 'Solving gives 0 = 0', correct: 2, why: 'A true statement after both variables cancel means the equations describe the same line.'},
  {expr: 'Solving gives x = 2, y = −1', correct: 0, why: 'Exactly one ordered pair: one intersection point.'}
], {options: ['independent', 'inconsistent', 'dependent']});

CA.guided('71', [
  {q: 'Is (2, 3) a solution of x + y = 5 and x − y = −1?', opts: ['Yes', 'No, only the first equation is true', 'No, neither equation is true'], correct: 0, hint: 'Substitute x = 2 and y = 3 into both.', why: '2 + 3 = 5 ✓ and 2 − 3 = −1 ✓, so (2, 3) is the solution.'},
  {q: 'Is (1, 1) a solution of 2x + y = 3 and x − y = 1?', opts: ['Yes', 'No'], correct: 1, hint: 'Check the second equation carefully.', why: '2(1) + 1 = 3 ✓, but 1 − 1 = 0 ≠ 1 ✕. It must satisfy both.'},
  {q: 'A system’s lines are parallel and distinct. How many solutions are there?', opts: ['One', 'None', 'Infinitely many'], correct: 1, hint: 'Do parallel lines ever meet?', why: 'Parallel distinct lines never intersect: no solution (inconsistent).'},
  {q: 'Both equations of a system describe the same line. The system is…', opts: ['independent', 'inconsistent', 'dependent'], correct: 2, hint: 'Every point of the line works.', why: 'Infinitely many solutions: a dependent system.'},
  {q: 'Solve by substitution: y = 2x and x + y = 9.', opts: ['(3, 6)', '(6, 3)', '(2, 7)'], correct: 0, hint: 'Replace y with 2x in the second equation.', why: 'x + 2x = 9 → x = 3, so y = 6.'},
  {q: 'Solve by addition: x + y = 7 and x − y = 1.', opts: ['(3, 4)', '(4, 3)', '(1, 6)'], correct: 1, hint: 'Add the equations to eliminate y.', why: '2x = 8 → x = 4, then 4 + y = 7 → y = 3.'},
  {q: 'While solving a system, you reach 0 = 5. What does this mean?', opts: ['x = 5', 'No solution', 'Infinitely many solutions'], correct: 1, hint: 'Is 0 = 5 ever true?', why: 'A false statement means the system is inconsistent.'},
  {q: 'While solving a system, you reach 0 = 0. What does this mean?', opts: ['No solution', 'The solution is (0, 0)', 'Infinitely many solutions'], correct: 2, hint: 'Is 0 = 0 always true?', why: 'A true statement with no variables left means the system is dependent.'},
  {q: 'To eliminate y from 3x + 2y = 5 and x − y = 0, what should you do?', opts: ['Multiply equation 2 by 2, then add', 'Multiply equation 1 by 3, then add', 'Add the equations as they are'], correct: 0, hint: 'You need +2y and −2y.', why: '2(x − y) = 0 gives 2x − 2y = 0; adding to 3x + 2y = 5 eliminates y: 5x = 5.'},
  {q: 'How many solutions do y = 3x + 1 and y = 3x − 4 have?', opts: ['One', 'None', 'Infinitely many'], correct: 1, hint: 'Compare the slopes and the intercepts.', why: 'Equal slopes, different intercepts: parallel lines, no solution.'}
]);
})();
