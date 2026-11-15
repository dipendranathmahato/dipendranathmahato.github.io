/* Section 6.7 · Exponential and Logarithmic Models — interactive activities */
(() => {
'use strict';
const {fmt, num} = CA;
const LN2 = Math.LN2;
const ek = k => `e<sup>${num(k, 4)}t</sup>`;

/* ---------- 01 · model explorer ---------- */
CA.lab('model-lab', {
  controls: [{type: 'range', key: 'A0', label: 'Starting amount A₀ =', min: 100, max: 1000, step: 50, value: 400}, {type: 'range', key: 'k', label: 'Rate k =', min: -0.5, max: 0.5, step: 0.01, value: 0.15, skip: [0]},
    {type: 'range', key: 't', label: 'Time t =', min: 0, max: 30, step: 0.5, value: 4}],
  plot: {h: 360, xname: 't', yname: 'A'}, plotLabel: 'Exponential growth or decay with doubling or halving marks', readouts: [['m', 'Model'], ['kind', 'Type'], ['T', 'Doubling time / half-life'], ['A', 'A(t)']]
}, (lab, st) => {
  const A0 = st.A0, k = Math.round(st.k * 100) / 100, A = t => A0 * Math.exp(k * t), T = LN2 / Math.abs(k), grow = k > 0;
  const tmax = 30, ymax = grow ? Math.min(A0 * 9, Math.max(A0 * 2.2, A(Math.min(tmax, 3 * T)) * 1.1)) : A0 * 1.15;
  const Pl = lab.plane({xmin: 0, xmax: tmax, ymin: 0, ymax});
  Pl.curve(A, {color: grow ? 'green' : 'orange', width: 3.4});
  for (let j = 1; j <= 6; j++) { const tj = j * T; if (tj > tmax) break; const yj = A0 * (grow ? 2 ** j : 0.5 ** j); if (yj > ymax) break; Pl.seg(tj, 0, tj, yj, {color: 'purple', dash: '5 5', width: 1.6}).seg(0, yj, tj, yj, {color: 'purple', dash: '5 5', width: 1.6}).point(tj, yj, {color: 'purple', r: 4, label: grow ? `×${2 ** j}` : `÷${2 ** j}`, labelOpt: {size: 11}}); }
  Pl.point(st.t, A(st.t), {color: 'blue', r: 7, label: `(${fmt(st.t)}, ${CA.comma(A(st.t), 1)})`}).point(0, A0, {color: 'gray', r: 5}).render();
  lab.read('m', `A = ${A0}${ek(k)}`); lab.read('kind', grow ? 'growth (k &gt; 0)' : 'decay (k &lt; 0)'); lab.read('T', `${grow ? 'doubling' : 'half-life'}: ln 2/${num(Math.abs(k), 2)} ≈ ${num(T, 2)}`); lab.read('A', `A(${fmt(st.t)}) ≈ ${CA.comma(A(st.t), 2)}`);
  lab.out(`Every ${num(T, 2)} time units the amount ${grow ? 'doubles' : 'halves'} (purple marks), no matter where you start. A larger |k| means a ${grow ? 'shorter doubling time' : 'shorter half-life'}: T = ln 2/|k|.`);
});

/* ---------- 02 · k ⇄ time ---------- */
CA.lab('k-lab', {
  controls: [{type: 'seg', key: 'type', label: 'Process', value: 'd', options: [['d', 'doubling (growth)'], ['h', 'half-life (decay)']]}, {type: 'seg', key: 'dir', label: 'Given', value: 't', options: [['t', 'the time → find k'], ['k', 'the rate |k| → find the time']]},
    {type: 'number', key: 'v', label: 'Value', value: 3, step: 0.1, min: 0}],
  readouts: [['k', 'Rate k'], ['T', 'Time'], ['m', 'Model']], steps: true
}, (lab, st) => {
  const v = st.v, dbl = st.type === 'd';
  if (!(v > 0)) { lab.out('Enter a positive value.', 'ca-incorrect'); return; }
  const T = st.dir === 't' ? v : LN2 / v, k = (dbl ? 1 : -1) * LN2 / T;
  lab.read('k', `k ≈ ${num(k, 5)}`); lab.read('T', `${dbl ? 'doubling time' : 'half-life'} ≈ ${num(T, 4)}`); lab.read('m', `A = A₀${ek(k)}`);
  lab.steps(st.dir === 't'
    ? [[dbl ? 'Doubling: 2A₀ = A₀e<sup>kt</sup>' : 'Half-life: ½A₀ = A₀e<sup>kt</sup>', `${dbl ? '2' : '½'} = e<sup>k·${num(T, 4)}</sup>`], ['Take ln of both sides', `${dbl ? 'ln 2' : '−ln 2'} = ${num(T, 4)}k`], ['Solve for k', `k = ${dbl ? '' : '−'}ln 2/${num(T, 4)} ≈ ${num(k, 5)}`]]
    : [['Use the formula', `${dbl ? 'doubling time = ln 2/k' : 'half-life = −ln 2/k'}`], ['Substitute', `${dbl ? '' : '−'}ln 2/${dbl ? num(v, 5) : `(−${num(v, 5)})`} ≈ ${num(T, 4)}`]]);
  lab.out(`${dbl ? 'Growth' : 'Decay'} with k ≈ ${num(k, 5)}: the amount ${dbl ? 'doubles' : 'halves'} every ${num(T, 4)} time units.`);
});

/* ---------- 03 · problems ---------- */
const PR = {
  p1: {t: 'Bacteria double every 3 hours; 3,200 at the start. Population after 8 hours?', k: LN2 / 3, A0: 3200, unit: 'hours', solveT: false, tq: 8,
    steps: k => [['Key word “double”: doubling time t = 3', `k = ln 2/3 ≈ ${num(k, 4)}`], ['Write the model', `A = 3200e<sup>(ln 2/3)t</sup>`], ['Evaluate at t = 8', `A = 3200e<sup>(ln 2/3)·8</sup> ≈ ${CA.comma(3200 * Math.exp(8 * k), 1)}`], ['Answer', `about ${CA.comma(Math.round(3200 * Math.exp(8 * k)))} bacteria`]]},
  p2: {t: 'A virus doubles in 6 days. How long until it quadruples?', k: LN2 / 6, A0: 1, unit: 'days', solveT: true, target: 4, rel: true,
    steps: k => [['Doubling time t = 6', `k = ln 2/6 ≈ ${num(k, 4)}`], ['Model', 'A = A₀e<sup>(ln 2/6)t</sup>'], ['Set A = 4A₀ and divide by A₀', '4 = e<sup>(ln 2/6)t</sup>'], ['Take ln', 'ln 4 = (ln 2/6)t'], ['Solve', `t = 6 ln 4/ln 2 = ${num(6 * Math.log(4) / LN2, 1)} days`]]},
  p3: {t: 'Carbon-14 (half-life 5,730 years): a bone has 35% left. How old is it?', k: -LN2 / 5730, A0: 1, unit: 'years', solveT: true, target: 0.35, rel: true,
    steps: k => [['Half-life t = 5,730', `k = −ln 2/5730 ≈ ${num(k, 7)}`], ['Model', 'A = A₀e<sup>(−ln 2/5730)t</sup>'], ['Set A = 0.35A₀ and divide by A₀', '0.35 = e<sup>kt</sup>'], ['Take ln', 'ln 0.35 = kt'], ['Solve', `t = ln 0.35/k ≈ ${CA.comma(Math.log(0.35) / k, 1)} → about ${CA.comma(Math.round(Math.log(0.35) / k))} years`]]},
  p4: {t: 'Cesium-137 (half-life 30 years): 50 mg decays to 7 mg. How long?', k: -LN2 / 30, A0: 50, unit: 'years', solveT: true, target: 7,
    steps: k => [['Half-life t = 30', `k = −ln 2/30 ≈ ${num(k, 5)}`], ['Model', 'A = 50e<sup>(−ln 2/30)t</sup>'], ['Set A = 7', '7 = 50e<sup>kt</sup> ⇒ 0.14 = e<sup>kt</sup>'], ['Take ln', 'ln 0.14 = kt'], ['Solve', `t = ln 0.14/k ≈ ${num(Math.log(0.14) / k, 1)} years`]]},
  p5: {t: 'Bacteria: 600 → 300 in 13 minutes. When will 10 remain?', k: -LN2 / 13, A0: 600, unit: 'minutes', solveT: true, target: 10,
    steps: k => [['600 → 300 is one half-life: t = 13', `k = −ln 2/13 ≈ ${num(k, 5)}`], ['Model', 'A = 600e<sup>(−ln 2/13)t</sup>'], ['Set A = 10', '10 = 600e<sup>kt</sup> ⇒ 1/60 = e<sup>kt</sup>'], ['Take ln', 'ln(1/60) = kt'], ['Solve', `t = ln(1/60)/k ≈ ${num(Math.log(1 / 60) / k, 1)} minutes`]]},
  p6: {t: 'Iodine-125 decays at 1.15% per day (k = −0.0115); 0.5 g injected. Half-life? Amount after 20 days?', k: -0.0115, A0: 0.5, unit: 'days', solveT: false, tq: 20,
    steps: k => [['(a) Half-life from k', `t = −ln 2/k = −ln 2/(−0.0115) ≈ ${num(-LN2 / k, 1)} → about ${Math.round(-LN2 / k)} days`], ['(b) Model', 'A = 0.5e<sup>−0.0115t</sup>'], ['Evaluate at t = 20', `A = 0.5e<sup>−0.23</sup> ≈ ${num(0.5 * Math.exp(-0.23), 3)}`], ['Answer', `about ${num(0.5 * Math.exp(-0.23), 1)} g remains`]]}
};
let prStepper;
const pr = CA.lab('prob-lab', {
  controls: [{type: 'select', key: 'p', label: 'Problem', value: 'p1', options: Object.entries(PR).map(([k, v]) => [k, v.t])}],
  top: '<div id="prob-stepper"></div>', plot: {h: 340, xname: 't', yname: 'A'}, plotLabel: 'Growth or decay model for the chosen problem', readouts: [['k', 'Rate k'], ['m', 'Model'], ['ans', 'Answer']], steps: true
}, (lab, st, key) => { if (!prStepper) return; if (key) prStepper.reset(); else drawPr(); });
function drawPr() {
  const D = PR[pr.state.p], i = prStepper ? prStepper.i : 0, S = D.steps(D.k), last = i === S.length - 1, A = t => D.A0 * Math.exp(D.k * t);
  const tAns = D.solveT ? Math.log((D.rel ? D.target : D.target / D.A0)) / D.k : D.tq, yAns = A(tAns);
  const tmax = tAns * 1.35, ymax = Math.max(D.A0, yAns) * 1.2;
  const Pl = pr.plane({xmin: 0, xmax: tmax, ymin: 0, ymax});
  Pl.curve(A, {color: D.k > 0 ? 'green' : 'orange', width: 3.4}).point(0, D.A0, {color: 'gray', r: 5, label: D.rel ? 'A₀' : `A₀ = ${D.A0}`});
  const T = LN2 / Math.abs(D.k); if (T < tmax) Pl.seg(T, 0, T, A(T), {color: 'purple', dash: '5 5', width: 1.6}).point(T, A(T), {color: 'purple', r: 4, label: D.k > 0 ? 'doubled' : 'halved', labelOpt: {size: 11}});
  if (last) Pl.hline(yAns, {color: 'blue', dash: '6 5'}).vline(tAns, {color: 'blue', dash: '6 5'}).point(tAns, yAns, {color: 'blue', r: 7, label: `t ≈ ${CA.comma(tAns, 1)}`});
  Pl.render();
  pr.read('k', `${num(D.k, D.k > -0.001 && D.k < 0 ? 7 : 4)} per ${D.unit.replace(/s$/, '')}`); pr.read('m', `A = ${D.rel ? 'A₀' : D.A0}${ek(D.k).replace(num(D.k, 4), num(D.k, Math.abs(D.k) < 0.001 ? 7 : 4))}`);
  pr.read('ans', last ? S[S.length - 1][1] : '…');
  pr.steps(S.slice(0, i + 1));
  pr.out(last ? `✓ ${pr.state.p === 'p6' ? `(a) Half-life ≈ ${Math.round(-LN2 / D.k)} days. (b) ` : ''}${S[S.length - 1][1]}.` : 'Step through: find k, write the model, then use it.', last ? 'ca-correct' : '');
}
prStepper = CA.stepper('prob-stepper', () => PR[pr.state.p].steps(PR[pr.state.p].k).length, drawPr);

CA.guided('67', [
  {q: 'In A = 500e<sup>0.03t</sup>, what is the starting amount?', opts: ['500', '0.03', '515'], correct: 0, hint: 'A₀ is the value at t = 0.', why: 'e⁰ = 1, so A(0) = 500.'},
  {q: 'Which model shows decay?', opts: ['A = 80e<sup>−0.2t</sup>', 'A = 80e<sup>0.2t</sup>', 'A = 80(2)<sup>t</sup>'], correct: 0, hint: 'k &lt; 0.', why: 'A negative k means decay.'},
  {q: 'A quantity doubles every 10 years. Its k is…', opts: ['ln 2/10 ≈ 0.0693', '10/ln 2 ≈ 14.43', '2/10 = 0.2'], correct: 0, hint: 'k = ln 2/t.', why: 'k = ln 2/10.'},
  {q: 'If k = 0.05, the doubling time is about…', opts: ['13.9', '20', '0.035'], correct: 0, hint: 't = ln 2/k.', why: '0.6931/0.05 ≈ 13.86.'},
  {q: 'A substance has a half-life of 8 days. What is k?', opts: ['−ln 2/8', 'ln 2/8', '−8/ln 2'], correct: 0, hint: 'Decay gives a negative k.', why: 'k = −ln 2/t with t = 8.'},
  {q: 'After 3 half-lives, what fraction remains?', opts: ['1/8', '1/3', '1/6'], correct: 0, hint: 'Halve three times.', why: '(1/2)³ = 1/8.'},
  {q: 'To solve 300 = 100e<sup>0.2t</sup> for t, the first step is…', opts: ['divide by 100: 3 = e<sup>0.2t</sup>', 'take ln of 300 only', 'subtract 100'], correct: 0, hint: 'Isolate the exponential first.', why: 'Then ln 3 = 0.2t.'},
  {q: 'Solve 3 = e<sup>0.2t</sup>.', opts: ['t = ln 3/0.2 ≈ 5.49', 't = 3/0.2 = 15', 't = 0.2 ln 3'], correct: 0, hint: 'Take ln of both sides.', why: 'ln 3 = 0.2t.'},
  {q: 'Does a population’s doubling time depend on its starting size?', opts: ['No, only on k', 'Yes, bigger populations double faster', 'Yes, smaller ones double faster'], correct: 0, hint: 'Look at t = ln 2/k.', why: 'A₀ cancels when you set 2A₀ = A₀e<sup>kt</sup>.'},
  {q: 'A radioactive sample keeps 60% after t years. Which equation finds t?', opts: ['0.6 = e<sup>kt</sup>', '60 = e<sup>kt</sup>', '0.4 = e<sup>kt</sup>'], correct: 0, hint: 'A = 0.6A₀; divide by A₀.', why: '0.6A₀ = A₀e<sup>kt</sup>.'}
]);
})();
