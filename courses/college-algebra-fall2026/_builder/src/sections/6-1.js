/* Section 6.1 · Exponential Functions — interactive activities */
(() => {
'use strict';
const {fmt, num, money} = CA;
const BASES = [['1/4', '1/4'], ['1/3', '1/3'], ['2/5', '2/5'], ['1/2', '1/2'], ['0.8', '0.8'], ['1.5', '1.5'], ['2', '2'], ['e', 'e ≈ 2.718'], ['3', '3'], ['4', '4']];
const bval = s => s === 'e' ? Math.E : s.includes('/') ? s.split('/').reduce((p, q) => p / q) : Number(s);
const bstr = s => s === 'e' ? 'e' : /[/.]/.test(s) ? `(${s})` : s;
const pw = (b, e) => `${b}<sup>${e}</sup>`;
const coef = a => a === 1 ? '' : a === -1 ? '−' : fmt(a);
const xm = h => h === 0 ? 'x' : `x ${h > 0 ? '−' : '+'} ${fmt(Math.abs(h))}`;
const ab = (a, s) => { const c = coef(a); if (s === 'e') return c + 'e'; return c === '' || c === '−' ? c + bstr(s) : `${c}(${s})`; };
const plusK = k => k === 0 ? '' : ` ${k > 0 ? '+' : '−'} ${fmt(Math.abs(k))}`;

/* ---------- 01 · the four shapes ---------- */
CA.lab('exp-lab', {
  controls: [{type: 'range', key: 'a', label: 'Initial value a =', min: -4, max: 4, step: 0.5, value: 3, skip: [0]}, {type: 'select', key: 'b', label: 'Base b', value: '2', options: BASES}],
  plot: {h: 360}, plotLabel: 'Graph of a times b to the x', readouts: [['f', 'f(x)'], ['case', 'Table 1 case'], ['y', 'y-intercept'], ['ha', 'Asymptote'], ['range', 'Range']],
  bottom: '<div class="ca-scroll-x"><table class="ca-data-table" id="exp-table" aria-label="Table of values"></table></div>'
}, (lab, st) => {
  const a = st.a, b = bval(st.b), f = x => a * b ** x, Pl = lab.plane({xmin: -4, xmax: 4, ymin: a > 0 ? -2 : -Math.min(30, Math.abs(a) * 9), ymax: a > 0 ? Math.min(30, a * 9) : 2});
  Pl.curve(f, {color: 'orange', width: 3.4, arrows: true}).hline(0, {color: 'purple', dash: '7 6'}).point(0, a, {color: 'green', r: 6, label: `(0, ${fmt(a)})`}).point(1, a * b, {color: 'blue', r: 5}).render();
  const cs = (a > 0 ? (b > 1 ? 'A' : 'B') : (b > 1 ? 'C' : 'D'));
  lab.read('f', `f(x) = ${pw(ab(a, st.b), 'x')}`); lab.read('case', `${cs} · a ${a > 0 ? '&gt;' : '&lt;'} 0, ${b > 1 ? 'b &gt; 1' : '0 &lt; b &lt; 1'}`); lab.read('y', `(0, ${fmt(a)})`); lab.read('ha', 'y = 0'); lab.read('range', a > 0 ? '(0, ∞)' : '(−∞, 0)');
  const xs = [-2, -1, 0, 1, 2, 3];
  document.getElementById('exp-table').innerHTML = `<tr><th>x</th>${xs.map(x => `<td>${fmt(x)}</td>`).join('')}</tr><tr><th>f(x)</th>${xs.map(x => `<td>${num(f(x), 4)}</td>`).join('')}</tr><tr><th>next ÷ this</th>${xs.map((x, i) => `<td class="${i < xs.length - 1 ? 'hl2' : ''}">${i < xs.length - 1 ? num(f(x + 1) / f(x), 4) : ''}</td>`).join('')}</tr>`;
  const grow = (a > 0) === (b > 1);
  lab.out(`Every step of 1 in x multiplies the output by b = ${st.b === 'e' ? 'e ≈ 2.718' : st.b}. ${b > 1 ? 'Since b &gt; 1, the size |f(x)| grows' : 'Since 0 &lt; b &lt; 1, the size |f(x)| shrinks'} as x increases, and the graph is <b>${grow ? 'increasing' : 'decreasing'}</b>. It never touches its asymptote y = 0.`);
});

/* ---------- 02 · exponential or not ---------- */
CA.cards('exp-cards', [
  {expr: 'f(x) = 5ˣ', correct: 0, why: 'Exponential with a = 1, b = 5 (graph A), y-intercept (0, 1).'},
  {expr: 'g(x) = 7x', correct: 1, why: 'Linear: 7 is multiplied by x, not raised to the power x.'},
  {expr: 'h(x) = −4ˣ + 5', correct: 0, why: 'Exponential: −4ˣ has a = −1, b = 4 (graph C), then it shifts up 5. y-intercept (0, 4), asymptote y = 5.'},
  {expr: `p(x) = 6(0.8)<sup>x − 3</sup>`, correct: 0, why: 'Exponential: a = 6, b = 0.8 (graph B), shifted 3 right. (3, 6) is on the graph and the y-intercept is 6(0.8)⁻³ ≈ 11.719.'},
  {expr: 'q(x) = −2x³', correct: 1, why: 'A power function (polynomial): the exponent is the constant 3.'},
  {expr: 'r(x) = 1ˣ', correct: 1, why: 'The base cannot be 1: 1ˣ = 1 for every x, a constant function.'},
  {expr: 'k(x) = 3(1/2)ˣ', correct: 0, why: 'Exponential with a = 3, b = 1/2 (graph B): a decreasing curve with y-intercept (0, 3).'},
  {expr: 's(x) = xˣ', correct: 1, why: 'The base must be a constant; here the base changes with x.'}
], {options: ['exponential', 'not exponential']});

/* ---------- 03 · shifted exponentials ---------- */
const SH = {
  e2a: {a: -2, b: '1/4', h: 0, k: -1, t: 'y = −2(1/4)ˣ − 1'},
  e2b: {a: 0.3, b: '3', h: -2, k: 4, t: 'f(x) = 0.3(3)^(x + 2) + 4'},
  h: {a: -1, b: '4', h: 0, k: 5, t: 'h(x) = −4ˣ + 5'},
  p: {a: 6, b: '0.8', h: 3, k: 0, t: 'p(x) = 6(0.8)^(x − 3)'},
  t2: {a: 5, b: '2/5', h: 1, k: -3, t: 'g(x) = 5(2/5)^(x − 1) − 3'},
  own: {t: 'Set your own a, b, h, k'}
};
CA.lab('shift-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Function', value: 'e2b', options: Object.entries(SH).map(([k, v]) => [k, v.t])},
    {type: 'range', key: 'a', label: 'a =', min: -6, max: 6, step: 0.1, value: 0.3, skip: [0]}, {type: 'select', key: 'b', label: 'b', value: '3', options: BASES},
    {type: 'range', key: 'h', label: 'h =', min: -4, max: 4, value: -2}, {type: 'range', key: 'k', label: 'k =', min: -5, max: 5, value: 4}],
  plot: {h: 380}, plotLabel: 'Exponential function before and after shifting', legend: [['gray', 'y = a·bˣ (before shifting)', true], ['orange', 'shifted graph']],
  readouts: [['f', 'Function'], ['y', 'y-intercept'], ['ha', 'Horizontal asymptote'], ['range', 'Range']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const S = SH[st.pre]; ['a', 'b', 'h', 'k'].forEach(q => st.set(q, S[q], true)); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const a = Math.round(st.a * 10) / 10, b = bval(st.b), h = st.h, k = st.k, g = x => a * b ** x, f = x => a * b ** (x - h) + k, y0 = f(0);
  const ys = [k, y0, a + k, f(h + 1), f(h - 1)].filter(v => Math.abs(v) < 60), lo = Math.min(...ys, 0), hi = Math.max(...ys, 0), pad = Math.max(3, (hi - lo) * 0.35);
  const Pl = lab.plane({xmin: -6, xmax: 6, ymin: lo - pad, ymax: hi + pad});
  Pl.curve(g, {color: 'gray', dash: '7 6', width: 2.2}).curve(f, {color: 'orange', width: 3.4, arrows: true}).hline(k, {color: 'purple', dash: '7 6'});
  Pl.point(0, a, {color: 'gray', r: 5}).point(h, a + k, {color: 'blue', r: 6, label: `(${fmt(h)}, ${num(a + k, 3)})`}).point(0, y0, {color: 'green', r: 6, label: `(0, ${num(y0, 3)})`, labelOpt: {dy: 20}}).render();
  const form = `${pw(ab(a, st.b), xm(h))}${plusK(k)}`;
  lab.read('f', `y = ${form}`); lab.read('y', `(0, ${num(y0, 3)})`); lab.read('ha', `y = ${fmt(k)}`); lab.read('range', a > 0 ? `(${fmt(k)}, ∞)` : `(−∞, ${fmt(k)})`);
  lab.out(`The blue point (${fmt(h)}, ${num(a + k, 3)}) is where the point (0, ${fmt(a)}) of y = a·bˣ lands after the shifts. The green point is the new y-intercept.`);
  lab.steps([
    ['1 · Start from y = a·bˣ', `y = ${pw(ab(a, st.b), 'x')}: graph ${a > 0 ? (b > 1 ? 'A' : 'B') : (b > 1 ? 'C' : 'D')} of Table 1, y-intercept (0, ${fmt(a)}), asymptote y = 0`],
    ['2 · Horizontal shift', h === 0 ? 'none' : `${Math.abs(h)} unit${Math.abs(h) === 1 ? '' : 's'} to the ${h > 0 ? 'right' : 'left'}: (0, ${fmt(a)}) moves to (${fmt(h)}, ${fmt(a)}); the asymptote does not move`],
    ['3 · Vertical shift', k === 0 ? 'none' : `${Math.abs(k)} unit${Math.abs(k) === 1 ? '' : 's'} ${k > 0 ? 'up' : 'down'}: the asymptote moves to y = ${fmt(k)} and (${fmt(h)}, ${fmt(a)}) moves to (${fmt(h)}, ${num(a + k, 3)})`],
    ['4 · y-intercept', `y = ${pw(ab(a, st.b), `0 ${h > 0 ? '−' : '+'} ${Math.abs(h)}`)}${plusK(k)} ≈ ${num(y0, 4)}`],
    ['5 · Range', a > 0 ? `a &gt; 0, so the graph lies above its asymptote: (${fmt(k)}, ∞)` : `a &lt; 0, so the graph lies below its asymptote: (−∞, ${fmt(k)})`]
  ]);
});

/* ---------- 04 · the number e ---------- */
const NS = [1, 2, 5, 10, 100, 1000, 10000, 1000000];
CA.lab('e-lab', {
  controls: [{type: 'range', key: 'i', label: 'n =', min: 0, max: 7, value: 0, fmt: i => CA.comma(NS[i])}, {type: 'number', key: 'x', label: 'Evaluate eˣ for x =', value: 3, step: 0.5}],
  plot: {h: 300, xname: 'n'}, plotLabel: 'Graph of (1 + 1/n) to the n approaching e', readouts: [['v', '(1 + 1/n)ⁿ'], ['gap', 'e − (1 + 1/n)ⁿ'], ['ex', 'eˣ']], bottom: '<div class="ca-scroll-x"><table class="ca-data-table" id="e-table" aria-label="Values approaching e"></table></div>'
}, (lab, st) => {
  const n = NS[st.i], g = x => (1 + 1 / x) ** x, v = g(n), Pl = lab.plane({xmin: 0, xmax: 40, ymin: 1.8, ymax: 2.9, ystep: 0.2});
  Pl.curve(g, {color: 'orange', width: 3.2, from: 0.3}).hline(Math.E, {color: 'purple', dash: '7 6'}).label(30, Math.E, 'y = e ≈ 2.71828', {color: 'purple', dy: -10});
  if (n <= 40) Pl.point(n, v, {color: 'blue', r: 7, label: `n = ${n}`}); Pl.render();
  lab.read('v', num(v, 6)); lab.read('gap', num(Math.E - v, 6)); lab.read('ex', Number.isFinite(st.x) ? `e<sup>${fmt(st.x)}</sup> ≈ ${num(Math.exp(st.x), 4)}` : '—');
  document.getElementById('e-table').innerHTML = `<tr><th>n</th>${NS.map((m, j) => `<td class="${j === st.i ? 'hl' : ''}">${CA.comma(m)}</td>`).join('')}</tr><tr><th>(1 + 1/n)ⁿ</th>${NS.map((m, j) => `<td class="${j === st.i ? 'hl' : ''}">${num(g(m), 6)}</td>`).join('')}</tr>`;
  lab.out(`Larger n gives values closer to e ≈ 2.718282, but never past it. This limit is why <b>continuous</b> compounding uses e (panel 05).`);
});

/* ---------- 05 · compound interest calculator ---------- */
const FREQ = [['1', 'annually (n = 1)'], ['2', 'semi-annually (n = 2)'], ['4', 'quarterly (n = 4)'], ['12', 'monthly (n = 12)'], ['52', 'weekly (n = 52)'], ['365', 'daily (n = 365)'], ['c', 'continuously']];
const MP = {
  e3a: {mode: 'A', amt: 2000, r: 8, n: '12', t: 7, txt: 'Example: $2,000 at 8% monthly for 7 years'},
  e3b: {mode: 'P', amt: 50000, r: 12.5, n: '4', t: 15, txt: 'Example: present value of $50,000 at 12.5% quarterly, 15 years'},
  t3: {mode: 'A', amt: 830, r: 10.6, n: '52', t: 20, txt: 'Practice: $830 at 10.6% weekly for 20 years'},
  e4a: {mode: 'A', amt: 6200, r: 9.5, n: 'c', t: 10, txt: 'Example: $6,200 at 9.5% continuously for 10 years (goal $15,000)'},
  e4b: {mode: 'P', amt: 5000, r: 4.8, n: 'c', t: 3, txt: 'Example: present value of $5,000 at 4.8% continuously, 3 years'},
  t4: {mode: 'P', amt: 25000, r: 14.7, n: 'c', t: 8, txt: 'Practice: present value of $25,000 at 14.7% continuously, 8 years'},
  own: {txt: 'Your own numbers'}
};
const grow = (P, r, n, t) => n === 'c' ? P * Math.exp(r * t) : P * (1 + r / Number(n)) ** (Number(n) * t);
CA.lab('money-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Scenario', value: 'e3a', options: Object.entries(MP).map(([k, v]) => [k, v.txt])},
    {type: 'seg', key: 'mode', label: 'Find', value: 'A', options: [['A', 'future value A'], ['P', 'present value P']]},
    {type: 'number', key: 'amt', label: 'Known amount ($)', value: 2000, min: 0}, {type: 'number', key: 'r', label: 'Annual rate (%)', value: 8, step: 0.1},
    {type: 'select', key: 'n', label: 'Compounded', value: '12', options: FREQ}, {type: 'number', key: 't', label: 'Years t', value: 7, step: 1, min: 0}],
  plot: {h: 320, xname: 't', yname: 'A'}, plotLabel: 'Account value over time', readouts: [['ans', 'Answer'], ['form', 'Formula']], steps: true,
  bottom: '<div class="ca-scroll-x"><table class="ca-data-table" id="money-table" aria-label="Compounding comparison"></table></div>'
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const M = MP[st.pre]; st.set('mode', M.mode, true); st.set('amt', M.amt, true); st.set('r', M.r, true); st.set('n', M.n, true); st.set('t', M.t, true); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const amt = st.amt, r = st.r / 100, n = st.n, t = st.t, cont = n === 'c';
  if (![amt, r, t].every(Number.isFinite) || amt <= 0 || t < 0) { lab.out('Enter a positive amount, a rate, and a number of years.', 'ca-incorrect'); return; }
  const P = st.mode === 'A' ? amt : amt / grow(1, r, n, t), A = st.mode === 'A' ? grow(amt, r, n, t) : amt;
  const rr = num(r, 5), sub = cont ? `e<sup>${rr}·${fmt(t)}</sup>` : `(1 + ${rr}/${n})<sup>${n}·${fmt(t)}</sup>`;
  lab.read('ans', st.mode === 'A' ? `A ≈ ${money(A)}` : `P ≈ ${money(P)}`);
  lab.read('form', st.mode === 'A' ? (cont ? 'A = Pe<sup>rt</sup>' : 'A = P(1 + r/n)<sup>nt</sup>') : (cont ? 'P = Ae<sup>−rt</sup>' : 'P = A(1 + r/n)<sup>−nt</sup>'));
  const Pl = lab.plane({xmin: 0, xmax: Math.max(1, t), ymin: 0, ymax: A * 1.15});
  Pl.curve(s => grow(P, r, n, s), {color: 'orange', width: 3.4}).hline(A, {color: 'purple', dash: '6 5'}).point(0, P, {color: 'green', r: 6, label: `P ≈ ${money(P)}`, labelOpt: {dy: -14}}).point(t, A, {color: 'blue', r: 6, label: `A ≈ ${money(A)}`, labelOpt: {dx: -60, dy: -12}}).render();
  lab.steps(st.mode === 'A'
    ? [['Identify', `P = ${money(amt)}, r = ${st.r}% = ${rr}, ${cont ? 'compounded continuously' : `n = ${n}`}, t = ${fmt(t)}`], ['Substitute', `A = ${CA.comma(amt, 2)}${sub}`], ['Evaluate', `A ≈ ${money(A)}`]]
    : [['Identify', `A = ${money(amt)}, r = ${st.r}% = ${rr}, ${cont ? 'compounded continuously' : `n = ${n}`}, t = ${fmt(t)}`], ['Substitute', cont ? `P = ${CA.comma(amt, 2)}e<sup>−${rr}·${fmt(t)}</sup>` : `P = ${CA.comma(amt, 2)}(1 + ${rr}/${n})<sup>−${n}·${fmt(t)}</sup>`], ['Evaluate', `P ≈ ${money(P)}`]]);
  const cols = [['1', 'annually'], ['4', 'quarterly'], ['12', 'monthly'], ['365', 'daily'], ['c', 'continuously']];
  document.getElementById('money-table').innerHTML = `<tr><th>${money(P)} compounded…</th>${cols.map(([c, l]) => `<td class="${c === n ? 'hl' : ''}">${l}</td>`).join('')}</tr><tr><th>value after ${fmt(t)} yr</th>${cols.map(([c]) => `<td class="${c === n ? 'hl' : ''}">${money(grow(P, r, c, t))}</td>`).join('')}</tr>`;
  const goal = st.pre === 'e4a' ? ` Since ${money(A)} &gt; $15,000, the goal is reached.` : '';
  lab.out(`${st.mode === 'A' ? `${money(amt)} grows to about <b>${money(A)}</b>` : `Investing about <b>${money(P)}</b> now grows to ${money(amt)}`} in ${fmt(t)} years.${goal} More frequent compounding earns a little more each time, but the values level off at the continuous amount.`);
});

CA.guided('61', [
  {q: 'Which function is exponential?', opts: ['y = 3(1.05)ˣ', 'y = 3x¹·⁰⁵', 'y = 1.05x + 3'], correct: 0, hint: 'The variable must be in the exponent.', why: 'y = 3(1.05)ˣ has a = 3 and b = 1.05.'},
  {q: 'What is the y-intercept of f(x) = −2(5)ˣ?', opts: ['(0, −2)', '(0, 5)', '(0, −10)'], correct: 0, hint: 'Evaluate f(0); b⁰ = 1.', why: 'f(0) = −2 · 1 = −2.'},
  {q: 'What is the range of f(x) = 4(0.5)ˣ − 3?', opts: ['(−3, ∞)', '(−∞, −3)', '(0, ∞)'], correct: 0, hint: 'a &gt; 0 puts the graph above its asymptote y = k.', why: 'The asymptote is y = −3 and a = 4 &gt; 0, so (−3, ∞).'},
  {q: 'Which describes y = 2(0.6)ˣ?', opts: ['Increasing', 'Decreasing', 'Constant'], correct: 1, hint: 'Compare b with 1.', why: 'a &gt; 0 and 0 &lt; b &lt; 1: graph B, decreasing.'},
  {q: 'What is the horizontal asymptote of y = 7ˣ + 2?', opts: ['y = 0', 'y = 2', 'y = 7'], correct: 1, hint: 'A vertical shift moves the asymptote.', why: 'The graph of 7ˣ shifts up 2, so y = 2.'},
  {q: 'Which formula gives the value of $1,000 at 6% compounded quarterly for 5 years?', opts: ['1000(1 + 0.06/4)<sup>20</sup>', '1000(1 + 0.06)<sup>20</sup>', '1000(1 + 6/4)<sup>5</sup>'], correct: 0, hint: 'n = 4 and nt = 20.', why: 'A = P(1 + r/n)<sup>nt</sup> with r = 0.06, n = 4, t = 5.'},
  {q: 'Which formula gives $3,000 compounded continuously at 5% for 4 years?', opts: ['3000e<sup>0.2</sup>', '3000e<sup>20</sup>', '3000(1.05)⁴'], correct: 0, hint: 'A = Pe<sup>rt</sup> with r as a decimal.', why: 'rt = 0.05 · 4 = 0.2.'},
  {q: 'To the nearest hundredth, e² ≈ ?', opts: ['7.39', '5.44', '4.00'], correct: 0, hint: 'e ≈ 2.718.', why: 'e² ≈ 7.389.'},
  {q: 'For f(x) = 3(2)<sup>x + 1</sup>, which point is on the graph?', opts: ['(−1, 3)', '(0, 3)', '(1, 3)'], correct: 0, hint: 'The point (0, 3) of 3(2)ˣ shifts 1 left.', why: 'f(−1) = 3(2)⁰ = 3.'},
  {ref: {panel: "interest", what: "the compound-interest formulas", body: "<p>Activity 05 \u00b7 Compound interest uses these formulas, where r is the annual rate as a decimal, n is the number of compounding periods per year, and t is the time in years:</p><div class=\"ca-ref-eq\">A(t) = P(1 + r/n)<sup>nt</sup></div><div class=\"ca-ref-eq\">P = A(1 + r/n)<sup>\u2212nt</sup></div>"}, q: 'In P = A(1 + r/n)<sup>−nt</sup>, what is P?', opts: ['The amount needed now', 'The interest earned', 'The future value'], correct: 0, hint: 'Present value.', why: 'P is the present value: what you must invest now to reach A.'}
]);
})();
