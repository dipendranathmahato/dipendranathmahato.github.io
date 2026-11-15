/* Section 5.5 · Zeros of Polynomial Functions — interactive activities */
(() => {
'use strict';
const {fmt, F} = CA, P = CA.poly;
/* coefficient lists are written high → low (as in the notes); CA.poly stores low → high */
const toP = hi => hi.slice().reverse(), toHi = p => p.slice().reverse();
const pstr = hi => P.str(toP(hi));
const div = k => `x ${k < 0 ? '+' : '−'} ${fmt(Math.abs(k))}`;
const parseList = s => String(s).split(/[,\s]+/).filter(Boolean).map(CA.parseNum);
const synth = (hi, k) => { const prod = [null], row = [hi[0]]; for (let j = 1; j < hi.length; j++) { prod.push(CA.clean(row[j - 1] * k)); row.push(CA.clean(hi[j] + prod[j])); } return {prod, row, q: row.slice(0, -1), r: row[row.length - 1]}; };
const ps = v => v < 0 ? `(${fmt(v)})` : fmt(v);
const xWin = (hi, extra = []) => { const zs = extra.concat([0]); return [Math.min(-4, ...zs) - 1.2, Math.max(4, ...zs) + 1.2]; };

/* ---------- 01 · long division stepper ---------- */
const LONG = {
  a: {hi: [2, -3, 4, 5], k: -2},
  b: {hi: [1, -6, -1, 30], k: -2},
  c: {hi: [-9, 10, 7, 0, -6], k: 1},
  d: {hi: [1, 0, -5, 7], k: -3}
};
function longSteps(hi, k) {
  const steps = [], n = hi.length - 1, q = [], zeros = m => Array(Math.max(0, m)).fill(0);
  const mono = (c, e) => e === 0 ? fmt(c) : `${c === 1 ? '' : c === -1 ? '−' : fmt(c)}x${e > 1 ? CA.sup(e) : ''}`;
  let cur = hi.slice();
  for (let i = 0; i < n; i++) {
    const deg = n - i, lead = cur[0], qterm = mono(lead, deg - 1);
    q.push(lead);
    const prodStr = P.str(toP([lead, CA.clean(-lead * k)].concat(zeros(deg - 1))));
    const after = [CA.clean(cur[1] + lead * k)].concat(cur.slice(2));
    steps.push([`Round ${i + 1} · divide`, `${mono(cur[0], deg)} ÷ x = <b>${qterm}</b> (next term of the quotient)`]);
    steps.push([`Round ${i + 1} · multiply`, `${qterm}(${div(k)}) = ${prodStr}`]);
    steps.push([`Round ${i + 1} · subtract${i < n - 1 ? ' and bring down' : ''}`, `(${P.str(toP(cur.slice(0, 2).concat(zeros(deg - 1))))}) − (${prodStr}) = ${P.str(toP([after[0]].concat(zeros(deg - 1))))}${i < n - 1 ? ` → bring down: <b>${P.str(toP(after))}</b>` : ''}`]);
    cur = after;
  }
  return {steps, q, r: cur[0]};
}
let longStepper;
const longLab = CA.lab('long-lab', {
  controls: [{type: 'select', key: 'f', label: 'Division', value: 'a', options: Object.entries(LONG).map(([key, v]) => [key, `(${pstr(v.hi)}) ÷ (${div(v.k)})`])}],
  top: '<div id="long-stepper"></div>', middle: '<ol class="ca-calculation-steps" id="long-steps" aria-label="Long division steps"></ol>', out: true
}, (lab, st, key) => { if (!longStepper) return; if (key) longStepper.reset(); else drawLong(); });
function drawLong() {
  const D = LONG[longLab.state.f], L = longSteps(D.hi, D.k), i = longStepper ? longStepper.i : 0, total = L.steps.length;
  document.getElementById('long-steps').innerHTML = CA.stepsHTML(L.steps.slice(0, i + 1));
  if (i >= total) {
    const q = pstr(L.q);
    longLab.out(`<b>Quotient</b> q(x) = ${q}, <b>remainder</b> r = ${fmt(L.r)}.<br>Division Algorithm: ${pstr(D.hi)} = (${div(D.k)})(${q}) ${L.r < 0 ? '−' : '+'} ${fmt(Math.abs(L.r))}`, 'ca-correct');
  } else longLab.out(`Move ${i + 1} of ${total}. Keep going; the quotient is built one term per round.`);
}
longStepper = CA.stepper('long-stepper', () => longSteps(LONG[longLab.state.f].hi, LONG[longLab.state.f].k).steps.length + 1, drawLong, {labels: i => i === longSteps(LONG[longLab.state.f].hi, LONG[longLab.state.f].k).steps.length ? 'result' : ''});

/* ---------- 02 · Remainder Theorem lab ---------- */
const REM = {
  a: {hi: [2, -3, 4, 5], k: -2, note: 'Example: the same division as above'},
  b: {hi: [-3, 0, 0, 6, -4, 27], k: 3, note: 'f(x) = −3x⁵ + 6x² − 4x + 27 divided by x − 3'},
  c: {hi: [1, 7, -10, 5, -8], k: -4, note: 'g(x) divided by x + 4'},
  d: {hi: [1, 0, 7, -9], k: -4, note: 'Is x + 4 a factor?'},
  e: {hi: [2, -9, -6, 5], k: 5, note: 'Is x − 5 a factor?'},
  own: {note: 'your own polynomial'}
};
CA.lab('rem-lab', {
  controls: [{type: 'select', key: 'f', label: 'Polynomial', value: 'a', options: Object.entries(REM).map(([key, v]) => [key, key === 'own' ? 'Type your own…' : `${pstr(v.hi)} ÷ (${div(v.k)})`])},
    {type: 'text', key: 'co', label: 'Coefficients, highest power first (use 0 for a missing power)', value: '1, -2, -5, 6'},
    {type: 'range', key: 'k', label: 'k =', min: -6, max: 6, value: 1}],
  plot: {h: 360}, plotLabel: 'Graph of f with the point (k, f(k))', readouts: [['f', 'f(x)'], ['div', 'Divisor'], ['r', 'Remainder f(k)']], steps: true
}, (lab, st, key) => {
  const own = st.f === 'own';
  st.input('co').closest('label').hidden = !own; st.input('k').closest('label').hidden = !own;
  let hi, k;
  if (own) { hi = parseList(st.co); k = st.k; if (!hi.length || hi.some(v => !Number.isFinite(v)) || hi[0] === 0) { lab.out('Type numbers separated by commas, highest power first, with a nonzero first coefficient, for example 1, -2, -5, 6.', 'ca-incorrect'); return; } }
  else { hi = REM[st.f].hi; k = REM[st.f].k; }
  const p = toP(hi), f = x => P.at(p, x), r = CA.clean(f(k)), [x0, x1] = xWin(hi, [k]), [y0, y1] = CA.autoY(f, x0, x1, [r], 8);
  const Pl = lab.plane({xmin: x0, xmax: x1, ymin: y0, ymax: y1});
  Pl.curve(f, {color: 'orange', width: 3.2, arrows: true}).vline(k, {color: 'purple', dash: '6 5'}).seg(k, 0, k, r, {color: 'blue', width: 3});
  Pl.point(k, r, {color: r === 0 ? 'green' : 'blue', r: 7, label: `(${fmt(k)}, ${CA.comma(r, 3)})`}).render();
  const terms = hi.map((c, i) => [c, hi.length - 1 - i]).filter(([c]) => c !== 0);
  const sub = terms.map(([c, e], i) => { const s = e === 0 ? fmt(Math.abs(c)) : `${Math.abs(c) === 1 ? '' : fmt(Math.abs(c))}(${fmt(k)})${e > 1 ? CA.sup(e) : ''}`; return i === 0 ? (c < 0 ? '−' : '') + s : ` ${c < 0 ? '−' : '+'} ${s}`; }).join('');
  const vals = terms.map(([c, e]) => CA.clean(c * k ** e));
  lab.read('f', pstr(hi)); lab.read('div', div(k)); lab.read('r', CA.comma(r, 4));
  lab.steps([['1 · Set the divisor equal to 0', `${div(k)} = 0 → x = ${fmt(k)}`], ['2 · Evaluate f(k)', `f(${fmt(k)}) = ${sub}`], ['3 · Simplify', `= ${vals.map((v, i) => i === 0 ? CA.comma(v, 4) : ` ${v < 0 ? '−' : '+'} ${CA.comma(Math.abs(v), 4)}`).join('')} = <b>${CA.comma(r, 4)}</b>`]]);
  lab.out(r === 0 ? `Remainder 0: by the Factor Theorem, <b>${div(k)} is a factor</b> and x = ${fmt(k)} is a zero; the graph crosses or touches the x-axis there.` : `The remainder is ${CA.comma(r, 4)} ≠ 0, so ${div(k)} is <b>not</b> a factor. The graph is ${CA.comma(Math.abs(r), 4)} units ${r > 0 ? 'above' : 'below'} the x-axis at x = ${fmt(k)}.`, r === 0 ? 'ca-correct' : '');
});

/* ---------- 03 · factor or not ---------- */
const FC = [
  {hi: [1, 0, 7, -9], k: -4}, {hi: [2, -9, -6, 5], k: 5}, {hi: [-1, 4, 12, 0, 0], k: -2},
  {hi: [1, -2, -5, 6], k: 1}, {hi: [1, 1, -1, 2], k: 3}, {hi: [1, 0, 0, -8], k: 2}
];
CA.cards('factor-cards', FC.map(c => {
  const r = CA.clean(P.at(toP(c.hi), c.k));
  return {expr: `Is ${div(c.k)} a factor of ${pstr(c.hi)}?`, correct: r === 0 ? 0 : 1, why: `f(${fmt(c.k)}) = ${CA.comma(r)}${r === 0 ? ', so it is a factor and x = ' + fmt(c.k) + ' is a zero.' : ' ≠ 0, so it is not a factor.'}`};
}), {options: ['factor', 'not a factor']});

/* ---------- 04 · synthetic division animator ---------- */
const SY = {
  a: {hi: [2, -3, 4, 5], k: -2}, b: {hi: [-9, 10, 7, 0, -6], k: 1}, c: {hi: [1, -6, -1, 30], k: -2}, d: {hi: [1, 0, -5, 7], k: -3}, own: {}
};
let syStepper, syCur = {hi: SY.a.hi, k: -2};
const syLab = CA.lab('synth-lab', {
  controls: [{type: 'select', key: 'f', label: 'Division', value: 'a', options: Object.entries(SY).map(([key, v]) => [key, key === 'own' ? 'Type your own…' : `(${pstr(v.hi)}) ÷ (${div(v.k)})`])},
    {type: 'text', key: 'co', label: 'Coefficients, highest power first', value: '1, 0, -5, 7'}, {type: 'number', key: 'k', label: 'k (divisor x − k)', value: -3, step: 1}],
  top: '<div id="synth-stepper"></div><div class="ca-scroll-x"><div id="synth-grid" class="ca-synth" aria-live="polite"></div></div>', out: true
}, (lab, st, key) => {
  const own = st.f === 'own';
  st.input('co').closest('label').hidden = !own; st.input('k').closest('label').hidden = !own;
  if (own) { const hi = parseList(st.co); if (!hi.length || hi.some(v => !Number.isFinite(v)) || hi[0] === 0 || !Number.isFinite(st.k)) { lab.out('Type numbers separated by commas, highest power first, with a nonzero first coefficient, and a number for k.', 'ca-incorrect'); return; } syCur = {hi, k: st.k}; }
  else syCur = SY[st.f];
  if (!syStepper) return; if (key) syStepper.reset(); else drawSynth();
});
const syCount = () => 2 * syCur.hi.length + 1;
function drawSynth() {
  const {hi, k} = syCur, S = synth(hi, k), n = hi.length, i = syStepper ? syStepper.i : 0;
  // stage 0: setup; 1: bring down; then multiply/add pairs; last: read result
  const shownProd = j => i >= 2 * j, shownRow = j => j === 0 ? i >= 1 : i >= 2 * j + 1, newest = i === 1 ? 'r0' : i >= 2 && i < 2 * n ? (i % 2 === 0 ? 'p' + i / 2 : 'r' + (i - 1) / 2) : '';
  const cell = (txt, cls) => `<div class="${cls || ''}">${txt}</div>`;
  let g = cell(fmt(k), 'k') + hi.map(c => cell(fmt(c))).join('');
  g += cell('', 'k') + hi.map((c, j) => cell(j > 0 && shownProd(j) ? fmt(S.prod[j]) : '', newest === 'p' + j ? 'new' : '')).join('');
  g += cell('', 'k rule') + hi.map((c, j) => cell(shownRow(j) ? fmt(S.row[j]) : '', 'rule' + (newest === 'r' + j ? ' new' : '') + (j === n - 1 && i >= 2 * n - 1 ? ' rem' : ''))).join('');
  const grid = document.getElementById('synth-grid'); grid.style.gridTemplateColumns = `repeat(${n + 1}, auto)`; grid.innerHTML = g;
  let msg;
  if (i === 0) msg = `Set up: ${div(k)} = 0 gives k = ${fmt(k)}. Write k on the left and the coefficients ${hi.map(fmt).join(', ')} across the top.`;
  else if (i === 1) msg = `Bring down the leading coefficient <b>${fmt(hi[0])}</b>.`;
  else if (i < 2 * n) { const j = Math.floor(i / 2); msg = i % 2 === 0 ? `Multiply: ${ps(S.row[j - 1])} × ${ps(k)} = <b>${fmt(S.prod[j])}</b>; write it under the next coefficient.` : `Add the column: ${fmt(hi[j])} + ${ps(S.prod[j])} = <b>${fmt(S.row[j])}</b>.`; }
  else { const q = pstr(S.q); msg = `<b>Read the answer.</b> Quotient (degree ${n - 2}): q(x) = ${q}; remainder ${fmt(S.r)}.<br>${pstr(hi)} = (${div(k)})(${q})${S.r === 0 ? '' : ` ${S.r < 0 ? '−' : '+'} ${fmt(Math.abs(S.r))}`}${S.r === 0 ? `<br>Remainder 0, so ${div(k)} is a factor.` : ''}`; }
  syLab.out(msg, i >= 2 * n ? 'ca-correct' : '');
}
syStepper = CA.stepper('synth-stepper', syCount, drawSynth);

/* ---------- 05 · zero hunt and factor ---------- */
const HUNT = {
  a: {hi: [1, -6, -1, 30], given: -2, t: 'f(x) = x³ − 6x² − x + 30 (show x + 2 is a factor)'},
  b: {hi: [1, 4, -4, -16], given: 2, t: 'f(x) = x³ + 4x² − 4x − 16 (given x − 2 is a factor)'},
  c: {hi: [1, -2, -5, 6], t: 'f(x) = x³ − 2x² − 5x + 6 (no factor given)'},
  d: {hi: [2, -3, -11, 6], t: 'f(x) = 2x³ − 3x² − 11x + 6 (no factor given)'}
};
const divisors = n => { n = Math.abs(n); const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; };
const candidates = hi => { const ps = divisors(hi[hi.length - 1]), qs = divisors(hi[0]), set = new Map(); ps.forEach(p => qs.forEach(q => { [p / q, -p / q].forEach(v => { const fr = F(Math.sign(v) * p, q); set.set(fr.toString(), fr); }); })); return [...set.values()].sort((a, b) => a.v - b.v); };
const binom = fr => fr.d === 1 ? `(${div(fr.n)})` : `(${fr.d}x ${fr.n < 0 ? '+' : '−'} ${Math.abs(fr.n)})`;
function factorQuad(q) { // q high → low, degree 2
  const [a, b, c] = q, D = CA.clean(b * b - 4 * a * c);
  if (D < 0) return {pre: '', fac: `(${pstr(q)})`, note: `${pstr(q)} has no real zeros (b² − 4ac = ${fmt(D)} < 0)`, zeros: []};
  const s = Math.round(Math.sqrt(D));
  if (s * s !== D || ![a, b, c].every(Number.isInteger)) { const R = CA.root(D); return {pre: '', fac: `(${pstr(q)})`, note: `${pstr(q)} does not factor over the integers; its zeros are (${fmt(-b)} ± ${R.text})/${fmt(2 * a)}`, zeros: [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)]}; }
  const r1 = F(-b - s, 2 * a), r2 = F(-b + s, 2 * a), lead = F(a, r1.d * r2.d);
  const pre = lead.isInt() ? (lead.n === 1 ? '' : lead.n === -1 ? '−' : fmt(lead.n)) : lead.toString() + ' · ';
  const fac = r1.eq(r2) ? `${binom(r1)}²` : `${binom(r1)}${binom(r2)}`;
  return {pre, fac, note: `${pstr(q)} = ${pre}${fac}`, zeros: r1.eq(r2) ? [r1] : [r1, r2]};
}
let huntK = null;
const tested = new Map();
const hunt = CA.lab('hunt-lab', {
  controls: [{type: 'select', key: 'f', label: 'Cubic', value: 'a', options: Object.entries(HUNT).map(([key, v]) => [key, v.t])}],
  top: '<p class="ca-note" id="hunt-cands-note"></p><div class="ca-seg" id="hunt-cands" role="group" aria-label="Candidate zeros"></div><div class="ca-scroll-x"><div id="hunt-grid" class="ca-synth"></div></div>',
  plot: {h: 340}, plotLabel: 'Cubic with tested candidates', readouts: [['test', 'Tested k'], ['r', 'Remainder'], ['fact', 'Factored form']]
}, (lab, st, key) => { if (key) { huntK = null; tested.clear(); } drawHunt(lab); });
function drawHunt(hunt) {
  const H = HUNT[hunt.state.f], hi = H.hi, C = candidates(hi);
  document.getElementById('hunt-cands-note').innerHTML = `Rational Zero Theorem: p divides the constant ${fmt(hi[hi.length - 1])}, q divides the leading coefficient ${fmt(hi[0])}. Candidates p/q:${H.given !== undefined ? ` (hint: the given factor means k = ${fmt(H.given)})` : ''}`;
  document.getElementById('hunt-cands').innerHTML = C.map(fr => `<button type="button" data-k="${fr.v}" aria-pressed="${huntK !== null && Math.abs(huntK - fr.v) < 1e-12}" class="${huntK !== null && Math.abs(huntK - fr.v) < 1e-12 ? 'active' : ''}">${fr.toString()}</button>`).join('');
  const f = x => P.at(toP(hi), x), [y0, y1] = CA.autoY(f, -5.5, 5.5, [], 10), Pl = hunt.plane({xmin: -5.5, xmax: 5.5, ymin: y0, ymax: y1});
  Pl.curve(f, {color: 'orange', width: 3.2, arrows: true});
  tested.forEach((r, k) => Pl.point(k, r === 0 ? 0 : Math.max(y0 + (y1 - y0) * 0.03, Math.min(y1 - (y1 - y0) * 0.03, r)), {color: r === 0 ? 'green' : 'gray', r: r === 0 ? 7 : 5}));
  const grid = document.getElementById('hunt-grid');
  if (huntK === null) { Pl.render(); grid.innerHTML = ''; hunt.read('test', '—'); hunt.read('r', '—'); hunt.read('fact', '—'); hunt.out('Click a candidate to divide by x − k.'); return; }
  const S = synth(hi, huntK), kf = F(Math.round(huntK * hi[0]), hi[0]), n = hi.length, kTxt = kf.toString();
  grid.style.gridTemplateColumns = `repeat(${n + 1}, auto)`;
  grid.innerHTML = `<div class="k">${kTxt}</div>${hi.map(c => `<div>${fmt(c)}</div>`).join('')}<div class="k"></div>${S.prod.map(v => `<div>${v === null ? '' : CA.Frac.of(v).toString()}</div>`).join('')}<div class="k rule"></div>${S.row.map((v, j) => `<div class="rule${j === n - 1 ? ' rem' : ''}">${CA.Frac.of(v).toString()}</div>`).join('')}`;
  hunt.read('test', kTxt); hunt.read('r', CA.Frac.of(S.r).toString());
  if (Math.abs(S.r) > 1e-9) { Pl.render(); hunt.read('fact', '—'); hunt.out(`Remainder ${CA.Frac.of(S.r).toString()} ≠ 0, so x = ${kTxt} is not a zero. Try another candidate.`, 'ca-incorrect'); return; }
  // factor out (x − k) (or (dx − n) when k is a fraction) and the quadratic
  let q = S.q.slice(), lin = `(${kf.d === 1 ? div(kf.n) : `x − ${kTxt}`})`;
  if (kf.d !== 1) { q = q.map(c => CA.clean(c / kf.d)); lin = binom(kf); }
  const Q = factorQuad(q), zeros = [kf].concat(Q.zeros);
  zeros.forEach(z => { const v = typeof z === 'number' ? z : z.v; Pl.point(v, 0, {color: 'green', r: 7, label: typeof z === 'number' ? CA.num(z, 3) : z.toString(), labelOpt: {dy: 22, size: 12}}); });
  Pl.render();
  hunt.read('fact', `${Q.pre}${lin}${Q.fac}`);
  hunt.out(`✓ Remainder 0, so ${lin} is a factor.<br>${pstr(hi)} = ${lin}(${pstr(q)})${kf.d !== 1 ? ` (the quotient ${pstr(S.q)} was divided by ${kf.d})` : ''}.<br>Factor the quadratic: ${Q.note}.<br><b>Factored form:</b> ${pstr(hi)} = ${Q.pre}${lin}${Q.fac}.<br><b>All real zeros:</b> ${zeros.map(z => typeof z === 'number' ? CA.num(z, 3) : z.toString()).join(', ')}.`, 'ca-correct');
}
document.getElementById('hunt-cands').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return; huntK = Number(b.dataset.k);
  const r = synth(HUNT[hunt.state.f].hi, huntK).r; tested.set(huntK, Math.abs(r) < 1e-9 ? 0 : r); drawHunt(hunt);
});

CA.guided('55', [
  {q: 'Use the Remainder Theorem: what is the remainder when f(x) = x³ − 2x + 4 is divided by x − 2?', opts: ['8', '4', '0'], correct: 0, hint: 'Evaluate f(2).', why: 'f(2) = 8 − 4 + 4 = 8.'},
  {q: 'What is the remainder when f(x) = x² + 5x − 1 is divided by x + 1?', opts: ['5', '−5', '3'], correct: 1, hint: 'x + 1 = 0 gives x = −1.', why: 'f(−1) = 1 − 5 − 1 = −5.'},
  {q: 'If f(3) = 0, which statement is true?', opts: ['x + 3 is a factor of f(x)', 'x − 3 is a factor of f(x)', 'f(x) has no real zeros'], correct: 1, hint: 'Factor Theorem.', why: 'f(k) = 0 means x − k is a factor; here k = 3.'},
  {q: 'Is x − 1 a factor of f(x) = x⁴ − 3x² + 2?', opts: ['Yes', 'No'], correct: 0, hint: 'Compute f(1).', why: 'f(1) = 1 − 3 + 2 = 0, so yes.'},
  {q: 'To divide f(x) = 4x³ − x + 2 by x − 2 synthetically, which coefficient row do you write?', opts: ['4, −1, 2', '4, 0, −1, 2', '4, −1, 0, 2'], correct: 1, hint: 'Use 0 for a missing power.', why: 'There is no x² term, so the row is 4, 0, −1, 2.'},
  {q: 'Synthetic division of x³ + 2x² − x − 2 by x − 1 gives the bottom row 1, 3, 2 | 0. What is the quotient?', opts: ['x³ + 3x² + 2x', 'x² + 3x + 2', 'x² + 3x + 2 with remainder 1'], correct: 1, hint: 'The quotient is one degree lower than the dividend.', why: 'The numbers 1, 3, 2 are the coefficients of x² + 3x + 2, and the remainder is 0.'},
  {q: 'For which divisor is k = −5 used in synthetic division?', opts: ['x − 5', 'x + 5', '5x'], correct: 1, hint: 'Solve divisor = 0.', why: 'x + 5 = 0 gives k = −5.'},
  {q: 'f(x) = (x − 4)(x² − 9). What are all the zeros?', opts: ['4, 3, −3', '4 and 9', '−4, 3, −3'], correct: 0, hint: 'Factor x² − 9 as a difference of squares.', why: '(x − 4)(x − 3)(x + 3) = 0 gives 4, 3, −3.'},
  {q: 'Which value is NOT a possible rational zero of f(x) = 2x³ + x − 3?', opts: ['3/2', '1', '2'], correct: 2, hint: 'p divides 3; q divides 2.', why: 'Candidates are ±1, ±3, ±1/2, ±3/2. The number 2 is not on the list.'},
  {q: 'Dividing f(x) by x + 2 gives quotient x² − 1 and remainder 4. Which equation is the Division Algorithm?', opts: ['f(x) = (x + 2)(x² − 1) + 4', 'f(x) = (x − 2)(x² − 1) + 4', 'f(x) = (x² − 1) + 4(x + 2)'], correct: 0, hint: 'Dividend = divisor × quotient + remainder.', why: 'f(x) = d(x)q(x) + r(x) = (x + 2)(x² − 1) + 4.'}
]);
})();
