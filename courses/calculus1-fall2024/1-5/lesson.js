/* Section 1.5 · Exponential and Logarithmic Functions — interactive activities (some reuse the tested college algebra explorers) */

/* reused from 6-1.js */
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
  plot: {h: 360}, plotLabel: 'Graph of a times b to the x', readouts: [['f', 'f(x)'], ['case', 'Shape'], ['y', 'y-intercept'], ['ha', 'Asymptote'], ['range', 'Range']],
  bottom: '<div class="ca-scroll-x"><table class="ca-data-table" id="exp-table" aria-label="Table of values"></table></div>'
}, (lab, st) => {
  const a = st.a, b = bval(st.b), f = x => a * b ** x, Pl = lab.plane({xmin: -4, xmax: 4, ymin: a > 0 ? -2 : -Math.min(30, Math.abs(a) * 9), ymax: a > 0 ? Math.min(30, a * 9) : 2});
  Pl.curve(f, {color: 'orange', width: 3.4, arrows: true}).hline(0, {color: 'purple', dash: '7 6'}).point(0, a, {color: 'green', r: 6, label: `(0, ${fmt(a)})`}).point(1, a * b, {color: 'blue', r: 5}).render();
  const cs = (a > 0 ? (b > 1 ? 'A' : 'B') : (b > 1 ? 'C' : 'D'));
  lab.read('f', `f(x) = ${pw(ab(a, st.b), 'x')}`); lab.read('case', `a ${a > 0 ? '&gt;' : '&lt;'} 0, ${b > 1 ? 'b &gt; 1' : '0 &lt; b &lt; 1'}`); lab.read('y', `(0, ${fmt(a)})`); lab.read('ha', 'y = 0'); lab.read('range', a > 0 ? '(0, ∞)' : '(−∞, 0)');
  const xs = [-2, -1, 0, 1, 2, 3];
  document.getElementById('exp-table').innerHTML = `<tr><th>x</th>${xs.map(x => `<td>${fmt(x)}</td>`).join('')}</tr><tr><th>f(x)</th>${xs.map(x => `<td>${num(f(x), 4)}</td>`).join('')}</tr><tr><th>next ÷ this</th>${xs.map((x, i) => `<td class="${i < xs.length - 1 ? 'hl2' : ''}">${i < xs.length - 1 ? num(f(x + 1) / f(x), 4) : ''}</td>`).join('')}</tr>`;
  const grow = (a > 0) === (b > 1);
  lab.out(`Every step of 1 in x multiplies the output by b = ${st.b === 'e' ? 'e ≈ 2.718' : st.b}. ${b > 1 ? 'Since b &gt; 1, the size |f(x)| grows' : 'Since 0 &lt; b &lt; 1, the size |f(x)| shrinks'} as x increases, and the graph is <b>${grow ? 'increasing' : 'decreasing'}</b>. It never touches its asymptote y = 0.`);
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
  lab.out(`Larger n gives values closer to e ≈ 2.718282, but never past it. This limit is why <b>continuous</b> compounding uses e: A(t) = Pe<sup>rt</sup>.`);
});

})();

/* reused from 6-3.js */
(() => {
'use strict';
const {fmt, num} = CA;
const B = s => `<span class="ca-part-base">${s}</span>`, E = s => `<span class="ca-part-exp">${s}</span>`, V = s => `<span class="ca-part-val">${s}</span>`;
const bval = s => s === 'e' ? Math.E : Number(s);
const eval_ = s => s.includes('/') ? s.split('/').map(Number).reduce((p, q) => p / q) : Number(s);
const SUBD = '₀₁₂₃₄₅₆₇₈₉', sub = s => String(s).split('').map(c => /\d/.test(c) ? SUBD[c] : c).join('');
const logName = (b, colored = true) => b === '10' ? 'log' : b === 'e' ? 'ln' : `log${colored ? `<sub class="ca-part-base">${b}</sub>` : sub(b)}`;
/* exact value of b^y as text */
function powText(b, y) {
  const v = bval(b) ** eval_(y);
  if (b === 'e') return y === '0' ? '1' : y === '1' ? 'e' : `e<sup>${fmt(y)}</sup>`;
  const bn = Number(b), yn = eval_(y);
  if (Number.isInteger(yn)) return yn >= 0 ? CA.comma(bn ** yn) : `1/${CA.comma(bn ** -yn)}`;
  const isInt = Math.abs(v - Math.round(v)) < 1e-9, isRec = Math.abs(1 / v - Math.round(1 / v)) < 1e-9;
  if (isInt) return CA.comma(Math.round(v));
  if (isRec) return `1/${Math.round(1 / v)}`;
  const root = y.endsWith('/2') ? '√' : y.endsWith('/3') ? '∛' : null;
  if (root && Math.abs(Math.abs(yn) - 1 / Number(y.split('/')[1])) < 1e-9) return yn > 0 ? `${root}${b}` : `1/${root}${b}`;
  return num(v, 4);
}
const BASES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '25', 'e'], EXPS = ['-3', '-2', '-1', '-1/2', '0', '1/3', '1/2', '1', '2', '3', '4'];


/* ---------- 01 · converter ---------- */
CA.lab('conv-lab', {
  controls: [{type: 'select', key: 'b', label: 'Base b', value: '2', options: BASES.map(b => [b, b === 'e' ? 'e (natural log)' : b === '10' ? '10 (common log)' : b])}, {type: 'select', key: 'y', label: 'Exponent y', value: '4', options: EXPS.map(y => [y, fmt(y)])}],
  top: '<div class="ca-convert" id="conv-box" aria-live="polite"></div>', plot: {h: 360}, plotLabel: 'Exponential and logarithmic graphs with matching points',
  legend: [['orange', 'y = bˣ'], ['blue', 'y = log_b x'], ['gray', 'y = x', true]]
}, (lab, st) => {
  const b = st.b, y = st.y, x = powText(b, y), v = bval(b) ** eval_(y);
  document.getElementById('conv-box').innerHTML = `<div><small>Exponential form</small><br>${B(b)}<sup class="ca-part-exp">${fmt(y)}</sup> = ${V(x)}</div><div aria-hidden="true">⇔</div><div><small>Logarithmic form</small><br>${logName(b)}(${V(x)}) = ${E(fmt(y))}</div>`;
  const bb = bval(b), Pl = lab.plane({xmin: -4, xmax: 8, ymin: -4, ymax: 8});
  Pl.curve(x => x, {color: 'gray', dash: '5 5', width: 1.8}).curve(t => bb ** t, {color: 'orange', width: 3}).curve(t => t > 0 ? Math.log(t) / Math.log(bb) : NaN, {color: 'blue', width: 3, from: 1e-4});
  Pl.point(eval_(y), v, {color: 'orange', r: 6, label: `(${fmt(y)}, ${x.replace(/<[^>]+>/g, '')})`}).point(v, eval_(y), {color: 'blue', r: 6, label: `(${x.replace(/<[^>]+>/g, '')}, ${fmt(y)})`, labelOpt: {dy: 20}}).render();
  lab.out(`${logName(b)}(${x}) asks: “what power of ${b === '10' ? '10' : b} gives ${x}?” The answer is the exponent ${fmt(y)}. On the graphs, the point (${fmt(y)}, ${x}) on y = ${b}ˣ swaps to (${x}, ${fmt(y)}) on the logarithm: the logarithm is the <b>inverse</b> of the exponential function.${v > 8 || v < -4 ? ' (These points are outside the window.)' : ''}`);
});

})();

/* reused from 6-4.js */
(() => {
'use strict';
const {fmt, num, F} = CA;
const BASES = [['2', '2'], ['3', '3'], ['4', '4'], ['10', '10'], ['e', 'e'], ['1/2', '1/2'], ['1/3', '1/3']];
const bval = s => s === 'e' ? Math.E : s.includes('/') ? s.split('/').map(Number).reduce((p, q) => p / q) : Number(s);
const toF = s => s.includes('/') ? F(...s.split('/').map(Number)) : F(Number(s), 1);
const SUBD = '₀₁₂₃₄₅₆₇₈₉', sub = s => String(s).split('').map(c => /\d/.test(c) ? SUBD[c] : c).join('');
const lname = b => b === '10' ? 'log' : b === 'e' ? 'ln' : b.includes('/') ? `log<sub>${b}</sub>` : `log${sub(b)}`;
const fstr = f => { if (f.d === 1) return f.toString(); let d = f.d, p = 0; while (d % 10 === 0) { d /= 10; p++; } return d === 1 ? fmt(String(f.v)) : f.toString(); };
const pt = (x, y) => `(${fstr(x)}, ${fstr(y)})`;


/* ---------- 01 · reflection over y = x ---------- */
CA.lab('refl-lab', {
  controls: [{type: 'select', key: 'b', label: 'Base b', value: '2', options: BASES.filter(b => b[0] !== 'e')}, {type: 'range', key: 's', label: 'Reflection', min: 0, max: 100, step: 5, value: 0, fmt: v => v + '%'}],
  plot: {h: 400}, plotLabel: 'Exponential graph reflecting over y = x into a logarithm', legend: [['orange', 'y = bˣ'], ['blue', 'y = log_b x'], ['gray', 'y = x', true]],
  readouts: [['dom', 'Domain'], ['rng', 'Range'], ['asy', 'Asymptote'], ['pts', 'Key points']]
}, (lab, st) => {
  const b = toF(st.b), bb = b.v, s = st.s / 100, Pl = lab.plane({xmin: -4, xmax: 6, ymin: -4, ymax: 6});
  const ex = t => bb ** t, lg = t => t > 0 ? Math.log(t) / Math.log(bb) : NaN;
  Pl.curve(x => x, {color: 'gray', dash: '5 5', width: 1.8}).curve(ex, {color: 'orange', width: s > 0 ? 2 : 3.2, dash: s > 0 ? '6 5' : null});
  if (s > 0 && s < 1) Pl.param(t => (1 - s) * t + s * ex(t), t => (1 - s) * ex(t) + s * t, -6, 4, {color: 'purple', width: 3});
  if (s === 1) Pl.curve(lg, {color: 'blue', width: 3.4, from: 1e-5}).vline(0, {color: 'blue', dash: '6 5'});
  else Pl.hline(0, {color: 'orange', dash: '6 5'});
  const inv = F(1, 1).div(b), E = [[F(-1, 1), inv], [F(0, 1), F(1, 1)], [F(1, 1), b]];
  E.forEach(([x, y]) => { const X = (1 - s) * x.v + s * y.v, Y = (1 - s) * y.v + s * x.v; Pl.point(X, Y, {color: s === 1 ? 'blue' : s === 0 ? 'orange' : 'purple', r: 6, label: s === 0 ? pt(x, y) : s === 1 ? pt(y, x) : '', labelOpt: {size: 12}}); });
  Pl.render();
  const done = s === 1;
  lab.read('dom', done ? '(0, ∞)' : s === 0 ? '(−∞, ∞)' : '…'); lab.read('rng', done ? '(−∞, ∞)' : s === 0 ? '(0, ∞)' : '…'); lab.read('asy', done ? 'vertical x = 0' : s === 0 ? 'horizontal y = 0' : '…');
  lab.read('pts', done ? E.map(([x, y]) => pt(y, x)).join(', ') : s === 0 ? E.map(([x, y]) => pt(x, y)).join(', ') : 'moving…');
  lab.out(done ? `y = ${lname(st.b)}(x): every point (x, y) of y = ${st.b.includes('/') ? `(${st.b})` : st.b}ˣ became (y, x). The horizontal asymptote y = 0 became the vertical asymptote x = 0, and the y-intercept (0, 1) became the x-intercept (1, 0).` : s === 0 ? `Start: y = ${st.b.includes('/') ? `(${st.b})` : st.b}ˣ with key points ${E.map(([x, y]) => pt(x, y)).join(', ')}. Slide the reflection to 100%.` : 'Each point moves straight across the line y = x toward its mirror image.');
});

})();

/* reused from 6-5.js */
(() => {
'use strict';
const {fmt, num} = CA;
const fr = (t, b) => `<span class="ca-frac"><span>${t}</span><span>${b}</span></span>`;
const half = fr(1, 2);


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

})();

/* ---------- new · exponential growth vs power growth ---------- */
(() => {
'use strict';
const {num} = CA, E = Math.E;
const BASES = [['2', '2'], ['1.5', '1.5'], ['e', 'e ≈ 2.718'], ['3', '3']], POWS = [['2', 'x²'], ['3', 'x³'], ['4', 'x⁴'], ['10', 'x¹⁰']];
const crossings = (f, a, b) => { const out = []; const n = 4000; for (let i = 0; i < n; i++) { const x0 = a + (b - a) * i / n, x1 = a + (b - a) * (i + 1) / n, g0 = f(x0), g1 = f(x1); if (g0 === 0) out.push(x0); else if (g0 * g1 < 0) { let l = x0, r = x1; for (let k = 0; k < 60; k++) { const m = (l + r) / 2; if (f(l) * f(m) <= 0) r = m; else l = m; } out.push((l + r) / 2); } } return out; };
CA.lab('growth-lab', {
  controls: [{type: 'select', key: 'b', label: 'Exponential bˣ, b =', value: '2', options: BASES}, {type: 'select', key: 'n', label: 'Power xⁿ', value: '2', options: POWS},
    {type: 'range', key: 'X', label: 'Show x up to', min: 3, max: 60, step: 1, value: 6}],
  plot: {w: 560, h: 380}, plotLabel: 'Exponential and power functions', legend: [['orange', 'y = bˣ'], ['blue', 'y = xⁿ']], readouts: [['c', 'Crossings for x > 0'], ['w', 'Eventually'], ['t', 'At the right edge']]
}, (lab, st) => {
  const b = st.b === 'e' ? E : +st.b, n = +st.n, X = st.X, f = x => b ** x, g = x => x ** n, d = x => Math.log(f(x)) - Math.log(g(x));
  const top = Math.max(f(X), g(X)), P = lab.plane({xmin: -0.05 * X, xmax: X * 1.02, ymin: -0.06 * top, ymax: top * 1.08});
  P.curve(g, {color: 'blue', width: 3.2, from: 0, to: X * 1.02}).curve(f, {color: 'orange', width: 3.4});
  const cr = crossings(d, 0.01, 200);
  cr.filter(x => x <= X * 1.02).forEach(x => P.point(x, f(x), {color: 'green', r: 6}));
  P.render();
  const bTxt = st.b === 'e' ? 'e' : st.b, pTxt = POWS.find(p => p[0] === st.n)[1];
  lab.read('c', cr.length ? cr.map(x => 'x ≈ ' + num(x, 3)).join(', ') : 'none');
  lab.read('w', cr.length ? `${bTxt}ˣ &gt; ${pTxt} for x &gt; ${num(cr[cr.length - 1], 3)}` : `${bTxt}ˣ &gt; ${pTxt} for all x &gt; 0`);
  lab.read('t', `${bTxt}^${X} ≈ ${num(f(X), 4)} · ${X}^${n} ≈ ${num(g(X), 4)}`);
  lab.out(cr.length && cr[cr.length - 1] > X ? `The power function is still ahead on this window. Increase the window past x ≈ ${num(cr[cr.length - 1], 3)}: the exponential catches up and then stays ahead.` : `Every exponential function bˣ with b &gt; 1 eventually grows faster than every power xⁿ.`, cr.length && cr[cr.length - 1] > X ? '' : 'ca-correct');
});
})();

/* ---------- new · laws of exponents ---------- */
(() => {
'use strict';
const {num} = CA;
const LAWS = {
  ex: {t: '(x³y⁻¹)² / (xy²)⁻²', L: (x, y) => (x ** 3 / y) ** 2 / (x * y * y) ** -2, R: (x, y) => x ** 8 * y ** 2, res: 'x⁸y²',
    steps: [['Power of a product', '(x³y⁻¹)² = x⁶y⁻² and (xy²)⁻² = x⁻²y⁻⁴'], ['Quotient rule', 'x⁶y⁻² / (x⁻²y⁻⁴) = x⁶⁻⁽⁻²⁾ y⁻²⁻⁽⁻⁴⁾'], ['Simplify', 'x⁸y²']]},
  p1: {t: '(2x²)³ · x⁻⁴', L: x => (2 * x * x) ** 3 * x ** -4, R: x => 8 * x * x, res: '8x²', steps: [['Power of a product', '(2x²)³ = 2³x⁶ = 8x⁶'], ['Product rule', '8x⁶ · x⁻⁴ = 8x⁶⁺⁽⁻⁴⁾'], ['Simplify', '8x²']]},
  p2: {t: '(x^(1/2) y⁻³)⁴ / (x y⁻²)', L: (x, y) => (Math.sqrt(x) * y ** -3) ** 4 / (x / (y * y)), R: (x, y) => x / y ** 10, res: 'x / y¹⁰',
    steps: [['Power rule', '(x<sup>1/2</sup>y⁻³)⁴ = x²y⁻¹²'], ['Quotient rule', 'x²y⁻¹² / (x y⁻²) = x²⁻¹ y⁻¹²⁺²'], ['Simplify', 'x y⁻¹⁰ = x / y¹⁰']]},
  p3: {t: 'e²ˣ · e³⁻ˣ', L: x => Math.exp(2 * x) * Math.exp(3 - x), R: x => Math.exp(x + 3), res: 'eˣ⁺³', steps: [['Product rule', 'e²ˣ · e³⁻ˣ = e²ˣ⁺³⁻ˣ'], ['Simplify the exponent', 'eˣ⁺³']]},
  p4: {t: '(e^x)² / e^(x − 1)', L: x => Math.exp(x) ** 2 / Math.exp(x - 1), R: x => Math.exp(x + 1), res: 'eˣ⁺¹', steps: [['Power rule', '(eˣ)² = e²ˣ'], ['Quotient rule', 'e²ˣ / eˣ⁻¹ = e²ˣ⁻⁽ˣ⁻¹⁾'], ['Simplify', 'eˣ⁺¹']]}
};
CA.lab('laws-lab', {
  controls: [{type: 'select', key: 'e', label: 'Simplify', value: 'ex', options: Object.entries(LAWS).map(([k, v]) => [k, v.t])}, {type: 'number', key: 'x', label: 'Test x =', value: 2, step: 0.5, min: 0.5}, {type: 'number', key: 'y', label: 'Test y =', value: 3, step: 0.5, min: 0.5}],
  readouts: [['r', 'Simplified'], ['lhs', 'Original at (x, y)'], ['rhs', 'Simplified at (x, y)']], steps: true
}, (lab, st) => {
  const L = LAWS[st.e], {x, y} = st;
  lab.steps(L.steps); lab.read('r', L.res);
  if (!(x > 0 && y > 0)) { lab.read('lhs', '—'); lab.read('rhs', '—'); lab.out('Use positive test values.', 'ca-incorrect'); return; }
  const a = L.L(x, y), b = L.R(x, y); lab.read('lhs', num(a, 6)); lab.read('rhs', num(b, 6));
  lab.out(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)) ? 'Both expressions give the same number: a numerical check of the algebra (not a proof).' : 'The two values differ: check the algebra.', Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)) ? 'ca-correct' : 'ca-incorrect');
});
})();

/* ---------- new · the slope of bˣ at x = 0 ---------- */
(() => {
'use strict';
const {num} = CA, E = Math.E;
CA.lab('slope0-lab', {
  controls: [{type: 'range', key: 'b', label: 'Base b =', min: 1.5, max: 4, step: 0.01, value: 2, fmt: v => num(v, 2)}, {type: 'range', key: 'h', label: 'Secant step h =', min: 0.01, max: 1, step: 0.01, value: 0.5, fmt: v => num(v, 2)},
    {type: 'check', key: 'snap', label: 'Snap b to e', value: false}],
  plot: {xmin: -2, xmax: 2, ymin: -0.5, ymax: 4.5, w: 520, h: 420}, plotLabel: 'Graph of y = bˣ with a secant line and the tangent line at (0, 1)',
  legend: [['orange', 'y = bˣ'], ['purple', 'secant through (0, 1) and (h, bʰ)', true], ['blue', 'tangent at (0, 1)']], readouts: [['sec', 'Secant slope (bʰ − 1)/h'], ['tan', 'Tangent slope'], ['ln', 'ln b']]
}, (lab, st, key) => {
  if (key === 'snap' && st.snap) st.set('b', Math.round(E * 100) / 100, true);
  const b = st.snap ? E : st.b, h = st.h, f = x => b ** x, s = (b ** h - 1) / h, m = Math.log(b), P = lab.plane();
  P.curve(f, {color: 'orange', width: 3.4}).lineMB(s, 1, {color: 'purple', width: 2, dash: '7 6'}).lineMB(m, 1, {color: 'blue', width: 2.6});
  P.point(0, 1, {color: 'text', r: 6, label: '(0, 1)'}).point(h, f(h), {color: 'purple', r: 6}).render();
  lab.read('sec', num(s, 5)); lab.read('tan', num(CA.deriv(f, 0), 5)); lab.read('ln', num(m, 5));
  lab.out(Math.abs(b - E) < 0.006 ? `With b = e the tangent line at (0, 1) has slope <b>1</b>. This is what makes e the natural base: the slope of eˣ at x = 0 is exactly 1.` : `Shrink h: the secant slope approaches the tangent slope ${num(m, 4)}. The slope is ${m < 1 ? 'less' : 'more'} than 1; try b near 2.72 (or snap to e) to make it exactly 1.`, Math.abs(b - E) < 0.006 ? 'ca-correct' : '');
});
})();

/* ---------- new · solving exponential and logarithmic equations ---------- */
(() => {
'use strict';
const {num} = CA, ln = Math.log;
const EQ = {
  a: {t: 'ln(2x) − ln(x⁶) = 0', f: x => x > 0 ? ln(2 * x) - ln(x ** 6) : NaN, win: [0, 3, -4, 4], roots: [2 ** 0.2], dom: 'x &gt; 0',
    steps: [['Quotient rule', 'ln(2x/x⁶) = 0, so ln(2/x⁵) = 0'], ['Undo ln', '2/x⁵ = e⁰ = 1'], ['Solve', 'x⁵ = 2, so x = ⁵√2 = 2<sup>1/5</sup> ≈ 1.1487'], ['Check the domain', 'x = ⁵√2 &gt; 0 ✓']]},
  b: {t: 'log₂(x) + log₂(x − 2) = 3', f: x => x > 2 ? ln(x) / ln(2) + ln(x - 2) / ln(2) - 3 : NaN, win: [0, 8, -4, 4], roots: [4], dom: 'x &gt; 2',
    steps: [['Product rule', 'log₂(x(x − 2)) = 3'], ['Exponential form', 'x(x − 2) = 2³ = 8'], ['Solve the quadratic', 'x² − 2x − 8 = (x − 4)(x + 2) = 0, so x = 4 or x = −2'], ['Check the domain', 'x = −2 makes log₂(x) undefined: reject it. Answer: x = 4']]},
  c: {t: '3e²ˣ = 12', f: x => 3 * Math.exp(2 * x) - 12, win: [-1.5, 1.5, -14, 20], roots: [ln(2)], dom: 'all real x',
    steps: [['Isolate the exponential', 'e²ˣ = 4'], ['Take ln of both sides', '2x = ln 4'], ['Solve', 'x = (ln 4)/2 = ln 2 ≈ 0.6931']]},
  d: {t: '5ˣ = 3ˣ⁺¹', f: x => x * ln(5) - (x + 1) * ln(3), win: [-1, 4, -1.5, 1.5], roots: [ln(3) / (ln(5) - ln(3))], dom: 'all real x', note: 'Graphed: x ln 5 − (x + 1) ln 3, which is 0 at the same x.',
    steps: [['Take ln of both sides', 'x ln 5 = (x + 1) ln 3'], ['Collect the x terms', 'x(ln 5 − ln 3) = ln 3'], ['Solve', 'x = ln 3/(ln 5 − ln 3) ≈ 2.1507']]},
  e: {t: 'ln x + ln(x + 1) = ln 6', f: x => x > 0 ? ln(x) + ln(x + 1) - ln(6) : NaN, win: [0, 5, -3, 2.5], roots: [2], dom: 'x &gt; 0',
    steps: [['Product rule', 'ln(x(x + 1)) = ln 6'], ['ln is one-to-one', 'x² + x = 6'], ['Solve', '(x + 3)(x − 2) = 0, so x = 2 or x = −3'], ['Check the domain', 'x = −3 is not allowed (ln of a negative number). Answer: x = 2']]}
};
CA.lab('solve-lab', {
  controls: [{type: 'select', key: 'e', label: 'Equation', value: 'a', options: Object.entries(EQ).map(([k, v]) => [k, v.t])}],
  plot: {w: 520, h: 360}, plotLabel: 'Graph of left side minus right side; solutions are its zeros', readouts: [['d', 'Domain of the equation'], ['s', 'Solution']], steps: true
}, (lab, st) => {
  const Q = EQ[st.e], [a, b, c, d] = Q.win, P = lab.plane({xmin: a, xmax: b, ymin: c, ymax: d});
  P.curve(Q.f, {color: 'blue', width: 3.2, from: a + 1e-4, to: b}); Q.roots.forEach(r => P.point(r, 0, {color: 'orange', r: 7, label: `x ≈ ${num(r, 4)}`})); P.render();
  lab.read('d', Q.dom); lab.read('s', Q.roots.map(r => 'x ≈ ' + num(r, 4)).join(', ')); lab.steps(Q.steps);
  lab.out(`The blue curve is (left side) − (right side); it crosses zero exactly at the solution. ${Q.note || ''}`, 'ca-correct');
});
})();

/* ---------- guided problems ---------- */
(() => {
'use strict';
CA.guided('15', [
  {q: 'Which function is exponential?', opts: ['f(x) = 3·(0.5)ˣ', 'f(x) = x³', 'f(x) = (−2)ˣ', 'f(x) = 1ˣ'], correct: 0, hint: 'bˣ needs b &gt; 0 and b ≠ 1.', why: 'The base 0.5 is positive and not 1.', ref: {panel: 'exp-def', what: 'the definition of an exponential function', body: '<p>f(x) = a·bˣ with b &gt; 0, b ≠ 1.</p>'}},
  {q: 'The range of y = eˣ is:', opts: ['(0, ∞)', '(−∞, ∞)', '[0, ∞)', '(1, ∞)'], correct: 0, hint: 'eˣ is always positive.', why: 'eˣ &gt; 0 for all x and takes every positive value.'},
  {q: 'Simplify (x⁴y⁻²)³ / (x²y)⁻¹ for x, y &gt; 0:', opts: ['x¹⁴y⁻⁵', 'x¹⁰y⁻⁷', 'x¹⁴y⁻⁷', 'x¹⁰y⁻⁵'], correct: 0, hint: 'Numerator x¹²y⁻⁶; dividing by x⁻²y⁻¹ adds 2 and 1 to the exponents.', why: 'x¹²⁺²y⁻⁶⁺¹ = x¹⁴y⁻⁵.', ref: {panel: 'laws', what: 'the laws of exponents', body: '<p>bˣbʸ = bˣ⁺ʸ, bˣ/bʸ = bˣ⁻ʸ, (bˣ)ʸ = bˣʸ, (ab)ˣ = aˣbˣ.</p>'}},
  {q: 'For large x, which grows fastest?', opts: ['2ˣ', 'x¹⁰', '100x²', 'x⁵ + x⁴'], correct: 0, hint: 'Exponential beats power.', why: 'Every bˣ with b &gt; 1 eventually overtakes every power of x.', ref: {panel: 'growth', what: 'exponential versus power growth', body: '<p>bˣ (b &gt; 1) eventually exceeds xⁿ for every n.</p>'}},
  {q: 'The tangent line to y = eˣ at (0, 1) has slope:', opts: ['1', 'e', '0', 'ln 2'], correct: 0, hint: 'This is the defining property of e.', why: 'e is the base for which the slope at x = 0 is exactly 1.', ref: {panel: 'slope', what: 'the slope of bˣ at 0', body: '<p>The slope of bˣ at x = 0 is ln b, which equals 1 when b = e.</p>'}},
  {q: 'log₃ 81 = ?', opts: ['4', '3', '27', '1/4'], correct: 0, hint: '3 to what power is 81?', why: '3⁴ = 81.', ref: {panel: 'log-def', what: 'the definition of a logarithm', body: '<p>y = log_b x means bʸ = x.</p>'}},
  {q: 'ln(e⁵) + e<sup>ln 2</sup> = ?', opts: ['7', '10', '5 + ln 2', 'e⁵ + 2'], correct: 0, hint: 'ln and eˣ undo each other.', why: 'ln(e⁵) = 5 and e<sup>ln 2</sup> = 2.'},
  {q: 'ln(x²y) expands to:', opts: ['2 ln x + ln y (x, y &gt; 0)', 'ln(2x) + ln y', '2 ln x · ln y', '(ln x)² + ln y'], correct: 0, hint: 'Product rule, then power rule.', why: 'ln(x²) + ln y = 2 ln x + ln y.', ref: {panel: 'rules', what: 'the product, quotient, and power rules', body: '<p>ln(MN) = ln M + ln N and ln(Mⁿ) = n ln M.</p>'}},
  {q: 'log₅ 12 written with natural logs is:', opts: ['ln 12 / ln 5', 'ln 5 / ln 12', 'ln(12/5)', 'ln 12 − ln 5'], correct: 0, hint: 'Change of base.', why: 'log_b M = ln M / ln b.'},
  {q: 'The solution of ln(3x) − ln(x²) = 0 is:', opts: ['x = 3', 'x = 1/3', 'x = 0 or 3', 'x = √3'], correct: 0, hint: 'ln(3x/x²) = 0, so 3/x = 1.', why: '3/x = e⁰ = 1 gives x = 3 (x = 0 is outside the domain).', ref: {panel: 'solve', what: 'solving equations with logarithms', body: '<p>Combine the logs, undo ln with eˣ, solve, and check the domain.</p>'}}
]);
})();
