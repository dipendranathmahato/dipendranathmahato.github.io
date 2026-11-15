/* Section 6.5 · Logarithmic Properties — interactive activities */
(() => {
'use strict';
const {fmt, num} = CA;
const fr = (t, b) => `<span class="ca-frac"><span>${t}</span><span>${b}</span></span>`;
const half = fr(1, 2);

/* ---------- 01 · basic properties ---------- */
const BP = [
  ['log₅1', ['0', '1', '5']], ['log₃3', ['1', '0', '3']], ['log 10', ['1', '10', '0']], ['ln e', ['1', 'e', '0']],
  ['log₄(4⁸)', ['8', '4', '32']], ['log(10⁻²)', ['−2', '100', '−20']], ['ln(e<sup>m</sup>)', ['m', 'e', '1']],
  ['2<sup>log₂x</sup>', ['x', '2', '2x']], ['10<sup>log 4</sup>', ['4', '10', '40']], ['e<sup>ln 7</sup>', ['7', 'e', '1']]
];
const WHY = ['b⁰ = 1, so log_b 1 = 0.', 'b¹ = b, so log_b b = 1.', 'log 10 = log₁₀10 = 1.', 'ln e = log_e e = 1.', 'log_b(bˣ) = x.', 'log(10⁻²) = −2.', 'ln(e<sup>m</sup>) = m.', 'b<sup>log_b x</sup> = x.', '10<sup>log 4</sup> = 4.', 'e<sup>ln 7</sup> = 7.'];
CA.cards('basic-cards', BP.map(([q, o], i) => { const r = i % 3, opts = o.slice(r).concat(o.slice(0, r)); return {expr: `${q} = ?`, options: opts, correct: (3 - r) % 3, why: WHY[i]}; }));

/* ---------- 02 · rule tester ---------- */
const RULES = {
  prod: {t: 'Product rule', L: (M, N) => `log<sub>b</sub>(${M} · ${N})`, R: (M, N) => `log<sub>b</sub>${M} + log<sub>b</sub>${N}`, l: (M, N, n, g) => g(M * N), r: (M, N, n, g) => g(M) + g(N)},
  quot: {t: 'Quotient rule', L: (M, N) => `log<sub>b</sub>(${M}/${N})`, R: (M, N) => `log<sub>b</sub>${M} − log<sub>b</sub>${N}`, l: (M, N, n, g) => g(M / N), r: (M, N, n, g) => g(M) - g(N)},
  pow: {t: 'Power rule', L: (M, N, n) => `log<sub>b</sub>(${M}<sup>${fmt(n)}</sup>)`, R: (M, N, n) => `${fmt(n)} · log<sub>b</sub>${M}`, l: (M, N, n, g) => g(M ** n), r: (M, N, n, g) => n * g(M)},
  m1: {t: 'Mistake: log(M + N)', L: (M, N) => `log<sub>b</sub>(${M} + ${N})`, R: (M, N) => `log<sub>b</sub>${M} + log<sub>b</sub>${N}`, l: (M, N, n, g) => g(M + N), r: (M, N, n, g) => g(M) + g(N)},
  m2: {t: 'Mistake: (log M)/(log N)', L: (M, N) => `log<sub>b</sub>(${M}/${N})`, R: (M, N) => `(log<sub>b</sub>${M}) / (log<sub>b</sub>${N})`, l: (M, N, n, g) => g(M / N), r: (M, N, n, g) => g(M) / g(N)},
  m3: {t: 'Mistake: (log M)ⁿ', L: (M, N, n) => `log<sub>b</sub>(${M}<sup>${fmt(n)}</sup>)`, R: (M, N, n) => `(log<sub>b</sub>${M})<sup>${fmt(n)}</sup>`, l: (M, N, n, g) => g(M ** n), r: (M, N, n, g) => g(M) ** n}
};
CA.lab('rule-lab', {
  controls: [{type: 'select', key: 'rule', label: 'Rule', value: 'prod', options: Object.entries(RULES).map(([k, v]) => [k, v.t])}, {type: 'seg', key: 'b', label: 'Base b', value: '10', options: [['2', '2'], ['10', '10'], ['e', 'e']]},
    {type: 'range', key: 'M', label: 'M =', min: 1, max: 12, value: 4}, {type: 'range', key: 'N', label: 'N =', min: 1, max: 12, value: 8}, {type: 'range', key: 'n', label: 'n =', min: -3, max: 5, value: 3}],
  plot: {h: 300}, plotLabel: 'Heights on the logarithm graph', readouts: [['L', 'Left side'], ['R', 'Right side'], ['eq', 'Equal?']]
}, (lab, st) => {
  const R = RULES[st.rule], bb = st.b === 'e' ? Math.E : Number(st.b), g = x => Math.log(x) / Math.log(bb), M = st.M, N = st.N, n = st.n;
  const usesN = !['pow', 'm3'].includes(st.rule);
  st.input('N').closest('label').hidden = !usesN; st.input('n').closest('label').hidden = usesN;
  const lv = R.l(M, N, n, g), rv = R.r(M, N, n, g), ok = Number.isFinite(lv) && Number.isFinite(rv) && Math.abs(lv - rv) < 1e-9;
  const bs = st.b;
  lab.read('L', `${R.L(M, N, n).replaceAll('<sub>b</sub>', `<sub>${bs}</sub>`)} ≈ ${num(lv, 4)}`); lab.read('R', `${R.R(M, N, n).replaceAll('<sub>b</sub>', `<sub>${bs}</sub>`)} ≈ ${Number.isFinite(rv) ? num(rv, 4) : 'undefined'}`); lab.read('eq', ok ? '✓ yes' : '✕ no');
  // picture: heights of g at M, N, and the combined argument
  const arg = st.rule === 'prod' || st.rule === 'm1' ? (st.rule === 'prod' ? M * N : M + N) : st.rule === 'quot' || st.rule === 'm2' ? M / N : M ** n;
  const xmax = Math.max(4, Math.min(160, Math.max(M, N, arg) * 1.15)), Pl = lab.plane({xmin: 0, xmax, ymin: Math.min(-2, g(Math.min(M, N, arg)) - 1), ymax: Math.max(2, g(Math.max(M, N, arg)) + 1)});
  Pl.curve(g, {color: 'blue', width: 3, from: 1e-4});
  const bar = (x, c, lbl) => { if (x > 0 && x <= xmax) { Pl.seg(x, 0, x, g(x), {color: c, width: 4}); Pl.point(x, g(x), {color: c, r: 5, label: lbl, labelOpt: {size: 12}}); } };
  bar(M, 'orange', `M = ${M}`); if (usesN) bar(N, 'green', `N = ${N}`); bar(arg, 'purple', `argument ${num(arg, 3)}`);
  Pl.render();
  lab.out(ok ? `Both sides equal ${num(lv, 4)}. ${st.rule === 'prod' ? 'The height at MN is the sum of the heights at M and N.' : st.rule === 'quot' ? 'The height at M/N is the height at M minus the height at N.' : 'The height at Mⁿ is n times the height at M.'}` : `The two sides differ (${num(lv, 4)} vs ${Number.isFinite(rv) ? num(rv, 4) : 'undefined'}). ${st.rule === 'm1' ? 'There is no rule for the log of a sum.' : st.rule === 'm2' ? 'A quotient of logs is not the log of a quotient.' : 'The power rule moves the exponent in front, not onto the logarithm.'}${M === N && st.rule === 'm2' ? '' : ''}`, ok ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 03/04 · step-through for expanding and condensing ---------- */
function stepLab(id, data, verb) {
  let stp;
  const lab = CA.lab(id, {
    controls: [{type: 'select', key: 'e', label: verb === 'expand' ? 'Expand' : 'Condense', value: Object.keys(data)[0], options: Object.entries(data).map(([k, v]) => [k, v.label])}],
    top: `<div id="${id}-stepper"></div>`, middle: `<div class="ca-convert" id="${id}-start"></div>`, steps: true
  }, (lab2, st, key) => { if (!stp) return; if (key) stp.reset(); else draw(); });
  function draw() {
    const D = data[lab.state.e], i = stp ? stp.i : 0;
    document.getElementById(id + '-start').innerHTML = `<div><small>Start</small><br>${D.start}</div><div aria-hidden="true">→</div><div><small>${i === D.steps.length - 1 ? (verb === 'expand' ? 'Fully expanded' : 'Single logarithm') : 'So far'}</small><br>${D.steps[i][1]}</div>`;
    lab.steps(D.steps.slice(0, i + 1));
    lab.out(i === D.steps.length - 1 ? `✓ Done. ${D.note || ''}` : `Next: look at the newest expression and decide which rule applies.`, i === D.steps.length - 1 ? 'ca-correct' : '');
  }
  stp = CA.stepper(id + '-stepper', () => data[lab.state.e].steps.length, draw);
}
stepLab('exp-steps', {
  a: {label: 'log₃(15x(x + 3))', start: 'log₃(15x(x + 3))', steps: [['Write 15 = 3 · 5', 'log₃(3 · 5 · x · (x + 3))'], ['Product rule', 'log₃3 + log₃5 + log₃x + log₃(x + 3)'], ['log₃3 = 1', '1 + log₃5 + log₃x + log₃(x + 3)']]},
  b: {label: 'ln(30x²)', start: 'ln(30x²)', steps: [['Write 30 = 2 · 3 · 5 and x² = x · x', 'ln(2 · 3 · 5 · x · x)'], ['Product rule', 'ln 2 + ln 3 + ln 5 + ln x + ln x'], ['Combine like terms', 'ln 2 + ln 3 + ln 5 + 2ln x']], note: 'The power rule on ln x² gives the same 2ln x.'},
  c: {label: 'ln(x/(x² + 1))', start: `ln(${fr('x', 'x² + 1')})`, steps: [['Quotient rule', 'ln x − ln(x² + 1)']], note: 'ln(x² + 1) cannot be expanded: there is no rule for the log of a sum.'},
  d: {label: 'log₈((7x − 2)/13)', start: `log₈(${fr('7x − 2', '13')})`, steps: [['Quotient rule', 'log₈(7x − 2) − log₈13']]},
  e: {label: 'log₃x⁷', start: 'log₃x⁷', steps: [['Power rule', '7log₃x']]},
  f: {label: 'log₄((5x + 1)/(7x²))³', start: `log₄(${fr('5x + 1', '7x²')})³`, steps: [['Power rule: the whole argument is cubed', `3log₄(${fr('5x + 1', '7x²')})`], ['Quotient rule, keeping the 3 outside', '3(log₄(5x + 1) − log₄(7x²))'], ['Product rule on 7x², in parentheses after the minus', '3(log₄(5x + 1) − (log₄7 + log₄x²))'], ['Power rule on x²', '3(log₄(5x + 1) − (log₄7 + 2log₄x))'], ['Distribute the minus sign', '3(log₄(5x + 1) − log₄7 − 2log₄x)']], note: 'Without the parentheses after the minus, the sign of 2log₄x would be wrong.'},
  g: {label: 'log(√(6x)/(x − 2))', start: `log(${fr('√(6x)', 'x − 2')})`, steps: [['Quotient rule', 'log√(6x) − log(x − 2)'], ['Write √(6x) = (6x)<sup>1/2</sup>; power rule', `${half}log(6x) − log(x − 2)`], ['Product rule on 6x = 2 · 3 · x', `${half}(log 2 + log 3 + log x) − log(x − 2)`]]},
  h: {label: 'Practice: ln(2x⁴(x + 3)/(x − 5))', start: `ln(${fr('2x⁴(x + 3)', 'x − 5')})`, steps: [['Quotient rule', 'ln(2x⁴(x + 3)) − ln(x − 5)'], ['Product rule', 'ln 2 + ln x⁴ + ln(x + 3) − ln(x − 5)'], ['Power rule', 'ln 2 + 4ln x + ln(x + 3) − ln(x − 5)']]},
  i: {label: 'Practice: log₇√(x(x + 6))', start: 'log₇√(x(x + 6))', steps: [['Write the root as a power', 'log₇(x(x + 6))<sup>1/2</sup>'], ['Power rule', `${half}log₇(x(x + 6))`], ['Product rule', `${half}(log₇x + log₇(x + 6))`]]}
}, 'expand');
stepLab('con-steps', {
  a: {label: 'log 7 + log 2 + log x + log(3x − 1)', start: 'log 7 + log 2 + log x + log(3x − 1)', steps: [['Product rule', 'log(7 · 2 · x · (3x − 1))'], ['Simplify', 'log(14x(3x − 1))']]},
  b: {label: 'ln 3 + ln 11 + ln(4x + 5)', start: 'ln 3 + ln 11 + ln(4x + 5)', steps: [['Product rule', 'ln(3 · 11 · (4x + 5))'], ['Simplify', 'ln(33(4x + 5))']]},
  c: {label: 'log(7x) − log(x² + 5)', start: 'log(7x) − log(x² + 5)', steps: [['Quotient rule', `log(${fr('7x', 'x² + 5')})`]]},
  d: {label: 'ln m − ln(pq)', start: 'ln m − ln(pq)', steps: [['Quotient rule', `ln(${fr('m', 'pq')})`]]},
  e: {label: '(1/2)ln(x + 6)', start: `${half}ln(x + 6)`, steps: [['Power rule', 'ln(x + 6)<sup>1/2</sup>'], ['An exponent of 1/2 is a square root', 'ln√(x + 6)']]},
  f: {label: '7log x + 2log(x − 3) − log 3', start: '7log x + 2log(x − 3) − log 3', steps: [['Power rule on each coefficient', 'log x⁷ + log(x − 3)² − log 3'], ['Product rule (left to right)', 'log(x⁷(x − 3)²) − log 3'], ['Quotient rule', `log(${fr('x⁷(x − 3)²', '3')})`]]},
  g: {label: 'ln 11 − (3ln x + ln(4x + 7))', start: 'ln 11 − (3ln x + ln(4x + 7))', steps: [['Inside the parentheses: power rule', 'ln 11 − (ln x³ + ln(4x + 7))'], ['Inside the parentheses: product rule', 'ln 11 − ln(x³(4x + 7))'], ['Quotient rule', `ln(${fr('11', 'x³(4x + 7)')})`]]},
  h: {label: '8(log₅x − 2log₅(x² + 7))', start: '8(log₅x − 2log₅(x² + 7))', steps: [['Inside the parentheses: power rule', '8(log₅x − log₅(x² + 7)²)'], ['Inside the parentheses: quotient rule', `8log₅(${fr('x', '(x² + 7)²')})`], ['Power rule on the 8', `log₅(${fr('x', '(x² + 7)²')})⁸`]]},
  i: {label: 'Practice: 6log₇(x + 2) + log₇x − 3log₇(1 − 3x)', start: '6log₇(x + 2) + log₇x − 3log₇(1 − 3x)', steps: [['Power rule', 'log₇(x + 2)⁶ + log₇x − log₇(1 − 3x)³'], ['Product rule', 'log₇(x(x + 2)⁶) − log₇(1 − 3x)³'], ['Quotient rule', `log₇(${fr('x(x + 2)⁶', '(1 − 3x)³')})`]]}
}, 'condense');

/* ---------- 05 · change of base ---------- */
const CB = {a: {b: 4, M: 9, t: 'log₄9'}, b: {b: 0.5, M: Math.sqrt(13), t: 'log₀.₅√13'}, c: {b: 7, M: 100, t: 'log₇100'}, d: {b: 2, M: 10, t: 'log₂10'}, own: {t: 'Your own'}};
CA.lab('cob-lab', {
  controls: [{type: 'select', key: 'p', label: 'Evaluate', value: 'a', options: Object.entries(CB).map(([k, v]) => [k, v.t])}, {type: 'number', key: 'b', label: 'Base b', value: 4, step: 0.5}, {type: 'number', key: 'M', label: 'Argument M', value: 9, step: 1}],
  readouts: [['ln', 'ln M / ln b'], ['log', 'log M / log b'], ['chk', 'Check: b to that power']], steps: true
}, (lab, st, key) => {
  if (key === 'p' && st.p !== 'own') { st.set('b', CB[st.p].b, true); st.set('M', CB[st.p].M, true); } else if (key && key !== 'p') st.set('p', 'own', true);
  const b = st.b, M = st.M;
  if (!(b > 0) || b === 1 || !(M > 0)) { lab.out('Use a base b &gt; 0 with b ≠ 1 and an argument M &gt; 0.', 'ca-incorrect'); ['ln', 'log', 'chk'].forEach(k => lab.read(k, '—')); lab.steps([]); return; }
  const v = Math.log(M) / Math.log(b), Ms = st.p === 'b' ? '√13' : num(M, 4);
  lab.read('ln', `${num(Math.log(M), 4)} / ${num(Math.log(b), 4)} ≈ <b>${num(v, 4)}</b>`); lab.read('log', `${num(Math.log10(M), 4)} / ${num(Math.log10(b), 4)} ≈ <b>${num(v, 4)}</b>`); lab.read('chk', `${num(b, 4)}<sup>${num(v, 4)}</sup> ≈ ${num(b ** v, 4)}`);
  lab.steps([['Change of base with ln', `log<sub>${num(b, 4)}</sub>(${Ms}) = ln(${Ms}) / ln(${num(b, 4)})`], ['Evaluate', `≈ ${num(v, 4)}`]]);
  lab.out(`Either common or natural logs give the same answer, log<sub>${num(b, 4)}</sub>(${Ms}) ≈ ${num(v, 3)}. ${v < 0 ? 'It is negative because ' + (b < 1 ? 'the base is between 0 and 1 while M &gt; 1.' : 'M is between 0 and 1.') : ''}`);
});

CA.guided('65', [
  {q: 'Expand log₂(8x).', opts: ['3 + log₂x', '8log₂x', 'log₂8 · log₂x'], correct: 0, hint: 'Product rule, then log₂8.', why: 'log₂8 + log₂x = 3 + log₂x.'},
  {q: 'Expand log(x⁵).', opts: ['5log x', 'log 5x', '(log x)⁵'], correct: 0, hint: 'Power rule.', why: 'The exponent moves in front.'},
  {q: 'Expand ln(x/y).', opts: ['ln x − ln y', 'ln x / ln y', 'ln y − ln x'], correct: 0, hint: 'Quotient rule.', why: 'The log of a quotient is a difference of logs.'},
  {q: 'Condense log₃x + log₃(x − 1).', opts: ['log₃(x(x − 1))', 'log₃(2x − 1)', 'log₃x · log₃(x − 1)'], correct: 0, hint: 'Product rule.', why: 'A sum of logs is the log of the product.'},
  {q: 'Condense 2ln x − ln y.', opts: ['ln(x²/y)', 'ln(2x/y)', 'ln(x² − y)'], correct: 0, hint: 'Power rule first, then quotient rule.', why: 'ln x² − ln y = ln(x²/y).'},
  {q: 'Which is equal to log(a + b)?', opts: ['None of these: there is no sum rule', 'log a + log b', 'log a · log b'], correct: 0, hint: 'Test with numbers.', why: 'The product rule turns log(ab) into a sum, not log(a + b).'},
  {q: 'Using change of base, log₃20 ≈ ?', opts: ['2.727', '6.667', '1.301'], correct: 0, hint: 'ln 20 / ln 3.', why: '2.9957 / 1.0986 ≈ 2.727.'},
  {q: 'Simplify log₆(6⁷).', opts: ['7', '6', '42'], correct: 0, hint: 'log_b(bˣ) = x.', why: 'The log undoes the power.'},
  {q: 'Simplify e<sup>ln 9</sup>.', opts: ['9', 'e⁹', 'ln 9'], correct: 0, hint: 'b<sup>log_b x</sup> = x.', why: 'The power undoes the log.'},
  {q: 'Expand log₅(25x³).', opts: ['2 + 3log₅x', '25 + 3log₅x', '3log₅(25x)'], correct: 0, hint: 'Product rule, then power rule; log₅25 = 2.', why: 'log₅25 + log₅x³ = 2 + 3log₅x.'}
]);
})();
