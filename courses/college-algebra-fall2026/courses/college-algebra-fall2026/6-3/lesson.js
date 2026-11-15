/* Section 6.3 · Logarithmic Functions — interactive activities */
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

/* ---------- 02 · conversion cards ---------- */
const CV = [
  ['log₂(16) = 4', ['2⁴ = 16', '4² = 16', '16⁴ = 2']],
  ['log₃(9) = 2', ['3² = 9', '9² = 3', '2³ = 9']],
  ['log₆(√6) = 1/2', ['6<sup>1/2</sup> = √6', '(1/2)⁶ = √6', '(√6)<sup>1/2</sup> = 6']],
  ['log₅(125) = 3', ['5³ = 125', '3⁵ = 125', '125³ = 5']],
  ['log₄(1/64) = −3', ['4⁻³ = 1/64', '(−3)⁴ = 1/64', '4<sup>1/64</sup> = −3']],
  ['7² = 49', ['log₇(49) = 2', 'log₂(49) = 7', 'log₄₉(7) = 2']],
  ['√25 = 5', ['log₂₅(5) = 1/2', 'log₅(25) = 1/2', 'log₂₅(1/2) = 5']],
  ['9⁻³ = 1/729', ['log₉(1/729) = −3', 'log₋₃(9) = 1/729', 'log<sub>1/729</sub>(9) = −3']],
  ['10³ = 1,000', ['log(1,000) = 3', 'log₃(1,000) = 10', 'ln(1,000) = 3']],
  ['8<sup>1/3</sup> = 2', ['log₈(2) = 1/3', 'log₂(8) = 1/3', 'log<sub>1/3</sub>(8) = 2']]
];
CA.cards('conv-cards', CV.map(([q, o], i) => { const r = i % 3, opts = o.slice(r).concat(o.slice(0, r)); return {expr: q, options: opts, correct: (3 - r) % 3, why: `Equivalent form: ${o[0]}. The base stays the base, and the logarithm is the exponent.`}; }));

/* ---------- 03 · ladder of powers ---------- */
const LAD = {
  a: {b: '3', x: '81'}, b: {b: '10', x: '100'}, c: {b: 'e', x: 'e'}, d: {b: '10', x: '10,000'}, e: {b: '5', x: '625'},
  f: {b: '2', x: '1/8'}, g: {b: '4', x: '2'}, h: {b: '25', x: '5'}, i: {b: '7', x: '1'}, j: {b: '9', x: '1/729'}
};
const XV = x => x === 'e' ? Math.E : x.includes('/') ? eval_(x) : Number(x.replace(/,/g, ''));
const KS = ['-3', '-2', '-1', '-1/2', '0', '1/2', '1', '2', '3', '4', '5'];
let pickK = null;
const ladder = CA.lab('ladder-lab', {
  controls: [{type: 'select', key: 'p', label: 'Evaluate', value: 'a', options: Object.entries(LAD).map(([k, v]) => [k, `${logName(v.b, false)}(${v.x})`])}],
  top: '<div class="ca-seg" id="ladder" role="group" aria-label="Powers of the base"></div>', readouts: [['q', 'Question'], ['ans', 'Value']], steps: true
}, (lab, st, key) => {
  if (key) pickK = null;
  const P = LAD[st.p], target = XV(P.x), bb = bval(P.b);
  const kOk = KS.find(k => Math.abs(bb ** eval_(k) - target) < 1e-9 * Math.max(1, target));
  document.getElementById('ladder').innerHTML = KS.map(k => `<button type="button" data-k="${k}" class="${pickK === k ? 'active' : ''}" aria-pressed="${pickK === k}">${P.b === '10' ? '10' : P.b}<sup>${fmt(k)}</sup> = ${powText(P.b, k)}</button>`).join('');
  lab.read('q', `${logName(P.b)}(${P.x}): what power of ${P.b} gives ${P.x}?`);
  if (pickK === null) { lab.read('ans', '?'); lab.steps([]); lab.out('Click the power that equals the argument.'); return; }
  const ok = pickK === kOk;
  lab.read('ans', ok ? fmt(kOk) : '?');
  lab.steps(ok ? [['Set it equal to y', `${logName(P.b)}(${P.x}) = y`], ['Convert to exponential form', `${P.b}<sup>y</sup> = ${P.x}`], ['Write the right side as a power of the base', `${P.b}<sup>y</sup> = ${P.b}<sup>${fmt(kOk)}</sup>`], ['Match exponents', `y = ${fmt(kOk)}`]] : []);
  lab.out(ok ? `✓ ${P.b}<sup>${fmt(kOk)}</sup> = ${P.x}, so ${logName(P.b)}(${P.x}) = <b>${fmt(kOk)}</b>.` : `${P.b}<sup>${fmt(pickK)}</sup> = ${powText(P.b, pickK)}, not ${P.x}. ${bb ** eval_(pickK) < target ? 'Too small: try a larger power.' : 'Too large: try a smaller power.'}`, ok ? 'ca-correct' : 'ca-incorrect');
});
document.getElementById('ladder').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; pickK = b.dataset.k; ladder.refresh(); });

/* ---------- 04 · calculator check ---------- */
CA.lab('calc-lab', {
  controls: [{type: 'seg', key: 'b', label: 'Logarithm', value: '10', options: [['10', 'log (base 10)'], ['e', 'ln (base e)'], ['2', 'log₂']]}, {type: 'number', key: 'x', label: 'Argument x =', value: 50, step: 1}],
  plot: {h: 320}, plotLabel: 'Graph of the logarithm with the evaluated point', readouts: [['v', 'Value'], ['chk', 'Check: b to that power']]
}, (lab, st) => {
  const bb = bval(st.b), x = st.x, f = t => t > 0 ? Math.log(t) / Math.log(bb) : NaN, name = logName(st.b, false);
  const xmax = Number.isFinite(x) && x > 0 ? Math.max(10, x * 1.2) : 10, ymax = Math.max(3, f(xmax) + 1), Pl = lab.plane({xmin: Math.min(-1, -xmax * 0.06), xmax, ymin: -4, ymax});
  Pl.curve(f, {color: 'blue', width: 3.2, from: 1e-5}).vline(0, {color: 'purple', dash: '6 5'});
  if (!Number.isFinite(x) || x <= 0) { Pl.render(); lab.read('v', 'undefined'); lab.read('chk', '—'); lab.out(`${name}(${Number.isFinite(x) ? fmt(x) : '?'}) is <b>undefined</b>: every power of ${st.b} is positive, so no exponent produces ${Number.isFinite(x) ? fmt(x) : 'that'}. The argument must be &gt; 0.`, 'ca-incorrect'); return; }
  const y = f(x); Pl.point(x, y, {color: 'orange', r: 7, label: `(${num(x, 3)}, ${num(y, 4)})`}).render();
  lab.read('v', `${name}(${num(x, 4)}) ≈ ${num(y, 4)}`); lab.read('chk', `${st.b}<sup>${num(y, 4)}</sup> ≈ ${num(bb ** y, 4)}`);
  lab.out(`${name}(${num(x, 4)}) ≈ ${num(y, 4)} means ${st.b}<sup>${num(y, 4)}</sup> ≈ ${num(x, 4)}.${x > 1 ? ' Arguments greater than 1 give positive logarithms' : x < 1 ? ' Arguments between 0 and 1 give negative logarithms' : ' The logarithm of 1 is 0 in every base'}.`);
});

CA.guided('63', [
  {q: 'Write log₂(32) = 5 in exponential form.', opts: ['2⁵ = 32', '5² = 32', '32⁵ = 2'], correct: 0, hint: 'log_b x = y ⇔ b<sup>y</sup> = x.', why: 'Base 2, exponent 5, result 32.'},
  {q: 'Write 6³ = 216 in logarithmic form.', opts: ['log₆(216) = 3', 'log₃(216) = 6', 'log₂₁₆(6) = 3'], correct: 0, hint: 'The exponent becomes the value of the log.', why: 'log₆(216) = 3.'},
  {q: 'Evaluate log₄(64).', opts: ['3', '16', '4'], correct: 0, hint: '4 to what power is 64?', why: '4³ = 64.'},
  {q: 'Evaluate log(0.01).', opts: ['−2', '2', '−1/2'], correct: 0, hint: '0.01 = 10⁻².', why: '10⁻² = 0.01.'},
  {q: 'Evaluate ln(e⁵).', opts: ['5', 'e⁵', '1/5'], correct: 0, hint: 'ln is log base e.', why: 'e to the power 5 is e⁵.'},
  {q: 'Evaluate log₉(3).', opts: ['1/2', '3', '2'], correct: 0, hint: '√9 = 3.', why: '9<sup>1/2</sup> = 3.'},
  {q: 'Evaluate log₇(1).', opts: ['0', '1', '7'], correct: 0, hint: 'Any base to the 0 power is 1.', why: '7⁰ = 1.'},
  {q: 'Which logarithm is undefined?', opts: ['log₃(−9)', 'log₃(1/9)', 'log(1)'], correct: 0, hint: 'The argument must be positive.', why: 'No power of 3 is negative.'},
  {q: 'Write e² = x in logarithmic form.', opts: ['ln(x) = 2', 'ln(2) = x', 'log(x) = 2'], correct: 0, hint: 'Base e means ln.', why: 'log_e(x) = 2 is written ln(x) = 2.'},
  {q: 'Evaluate log₂(1/16).', opts: ['−4', '4', '1/4'], correct: 0, hint: '1/16 = 2⁻⁴.', why: '2⁻⁴ = 1/16.'}
]);
})();
