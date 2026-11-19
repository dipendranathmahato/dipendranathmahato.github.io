/* Section 6.1 · Graphs of the Sine and Cosine Functions — interactive activities */
(() => {
'use strict';
const {fmt, num, F, toRad} = CA;
const PI = Math.PI, $ = id => document.getElementById(id);
const isSpecial = d => Number.isInteger(d) && (d % 30 === 0 || d % 45 === 0);

/* ---------- 01 · unrolling the circle ---------- */
const CX = -2.4;
CA.lab('unroll-lab', {
  controls: [{type: 'seg', key: 'fn', label: 'Function', value: 'sin', options: [['sin', 'y = sin x'], ['cos', 'y = cos x']]}, {type: 'range', key: 'd', label: 'x =', min: 0, max: 360, step: 5, value: 120, fmt: v => `${CA.radText(v)} (${v}°)`}],
  plot: {xmin: -3.7, xmax: 6.75, ymin: -1.6, ymax: 1.6, xpi: F(1, 2), xtickMin: 0, w: 640, h: 300}, plotLabel: 'Unit circle and the graph traced so far', readouts: [['x', 'x'], ['v', 'value'], ['pt', 'graph point']]
}, (lab, st) => {
  const d = st.d, x = toRad(d), fn = st.fn, f = Math[fn], y = f(x), P = lab.plane();
  P.param(t => CX + Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.8});
  if (d > 0) P.param(t => CX + 0.3 * Math.cos(t), t => 0.3 * Math.sin(t), 0, x, {color: 'orange', width: 2, arrow: true});
  P.seg(CX, 0, CX + Math.cos(x), Math.sin(x), {color: 'orange', width: 2.4});
  P.curve(f, {from: 0, to: 2 * PI, color: 'gray', dash: '6 6', width: 1.6});
  if (d > 0) P.curve(f, {from: 0, to: x, color: fn === 'sin' ? 'orange' : 'blue', width: 3.6});
  if (fn === 'sin') { P.seg(CX + Math.cos(x), 0, CX + Math.cos(x), y, {color: 'orange', width: 4}).seg(CX + Math.cos(x), y, x, y, {color: 'gray', dash: '4 5', width: 1.6}).seg(x, 0, x, y, {color: 'orange', width: 4}); }
  else { P.seg(CX, 0, CX + Math.cos(x), 0, {color: 'blue', width: 4}).seg(x, 0, x, y, {color: 'blue', width: 4}); }
  for (let k = 0; k <= d; k += 15) if (isSpecial(k)) P.point(toRad(k), f(toRad(k)), {color: 'green', r: 3.5});
  P.point(CX + Math.cos(x), Math.sin(x), {color: 'orange', r: 6}).point(x, y, {color: fn === 'sin' ? 'orange' : 'blue', r: 7}).render();
  const val = isSpecial(d) ? CA.exact(fn, d).str() : num(y, 4);
  lab.read('x', `${CA.radText(d)} = ${d}°`); lab.read('v', `${fn} x = ${val}`); lab.read('pt', `(${CA.radText(d)}, ${val})`);
  lab.out(fn === 'sin' ? `The height of the point on the circle is sin x = ${val}; the same height is plotted above x = ${CA.radText(d)}. One trip around the circle (2π) draws one full period.` : `The x-coordinate of the point on the circle is cos x = ${val}; it becomes the height of the cosine graph above x = ${CA.radText(d)}. Cosine starts at its maximum, 1.`);
});

/* ---------- 02 · periodicity ---------- */
CA.lab('per-lab', {
  controls: [{type: 'seg', key: 'fn', label: 'Function', value: 'sin', options: [['sin', 'sin x'], ['cos', 'cos x']]}, {type: 'range', key: 'k', label: 'Shift P =', min: -16, max: 16, step: 1, value: 2, fmt: v => CA.piStr(F(v, 4))}],
  plot: {xmin: -2 * PI, xmax: 2 * PI, ymin: -1.7, ymax: 1.7, xpi: F(1, 2), w: 620, h: 280}, plotLabel: 'A graph and its horizontal shift', legend: [['orange', 'y = f(x)'], ['blue', 'y = f(x + P)', true]], readouts: [['P', 'P'], ['same', 'f(x + P) = f(x) for all x?']]
}, (lab, st) => {
  const f = Math[st.fn], P = st.k * PI / 4, Pl = lab.plane(), same = st.k % 8 === 0;
  Pl.curve(f, {color: 'orange', width: 3.4}).curve(x => f(x + P), {color: 'blue', width: 2.6, dash: '7 6'}).render();
  lab.read('P', CA.piStr(F(st.k, 4))); lab.read('same', same ? 'yes' : 'no');
  lab.out(same ? (st.k === 0 ? 'P = 0 does nothing, so it does not count. Try 2π.' : `Yes: shifting by ${CA.piStr(F(st.k, 4))}, a multiple of 2π, lands the graph on itself. The smallest positive shift that works is <b>2π</b>, the period.`) : `Shifting by ${CA.piStr(F(st.k, 4))} moves the wave off itself. For example, ${st.fn}(0 + P) = ${num(f(P), 4)} but ${st.fn}(0) = ${num(f(0), 4)}.`, same && st.k !== 0 ? 'ca-correct' : '');
});

/* ---------- 03 · sinusoid lab ---------- */
const WP = [
  {label: 'y = 4 sin x', fn: 'sin', A: '4', B: '1', C: '0', D: '0'}, {label: 'y = −3 sin x', fn: 'sin', A: '-3', B: '1', C: '0', D: '0'},
  {label: 'y = sin(4x)', fn: 'sin', A: '1', B: '4', C: '0', D: '0'}, {label: 'y = cos(2x)', fn: 'cos', A: '1', B: '2', C: '0', D: '0'},
  {label: 'y = cos(x/2)', fn: 'cos', A: '1', B: '1/2', C: '0', D: '0'}, {label: 'y = 5 sin(πx)', fn: 'sin', A: '5', B: 'π', C: '0', D: '0'},
  {label: 'y = −2 cos(x/4)', fn: 'cos', A: '-2', B: '1/4', C: '0', D: '0'}, {label: 'y = sin(2x − π/3)', fn: 'sin', A: '1', B: '2', C: 'π/3', D: '0'},
  {label: 'y = cos(x/2 + π/4)', fn: 'cos', A: '1', B: '1/2', C: '-π/4', D: '0'}, {label: 'y = sin(πx + π/6)', fn: 'sin', A: '1', B: 'π', C: '-π/6', D: '0'},
  {label: 'y = cos(3x − 2)', fn: 'cos', A: '1', B: '3', C: '2', D: '0'}, {label: 'y = sin x + 3', fn: 'sin', A: '1', B: '1', C: '0', D: '3'},
  {label: 'y = cos x − 2', fn: 'cos', A: '1', B: '1', C: '0', D: '-2'}, {label: 'y = 2 sin(4x − 1) + 5', fn: 'sin', A: '2', B: '4', C: '1', D: '5'},
  {label: 'y = −cos(x + π) − 1', fn: 'cos', A: '-1', B: '1', C: '-π', D: '-1'}
];
const nx = v => CA.niceX(v);
CA.waveLab('wave-lab', {fns: ['sin', 'cos'], presets: WP, readouts: [['amp', 'Amplitude'], ['per', 'Period'], ['ph', 'Phase shift'], ['mid', 'Midline'], ['rng', 'Range']],
  update(lab, w) {
    const {A, B, C, D, P, h, fn} = w, a = A.v, amp = Math.abs(a), Pl = w.plane();
    Pl.curve(Math[fn], {color: 'gray', dash: '6 6', width: 1.8}).hline(D.v, {color: 'purple', dash: '8 6', width: 2}).curve(w.f, {color: 'orange', width: 3.4, samples: 1600});
    const ys = fn === 'sin' ? [0, 1, 0, -1, 0] : [1, 0, -1, 0, 1], pts = ys.map((k, i) => [h + i * P / 4, D.v + k * a]);
    pts.forEach(([x, y], i) => Pl.point(x, y, {color: 'green', r: 6, label: `(${nx(x)}, ${nx(y)})`, labelOpt: {size: 11.5, dy: i % 2 ? 22 : -12}}));
    Pl.render();
    lab.read('amp', `|${A.str}| = ${nx(amp)}`); lab.read('per', `2π/${B.str.includes('/') || B.str.includes('π') ? `(${B.str})` : B.str} = ${nx(P)}`);
    lab.read('ph', Math.abs(h) < 1e-12 ? 'none' : `${nx(Math.abs(h))} ${h > 0 ? 'right' : 'left'}`); lab.read('mid', `y = ${nx(D.v)}`); lab.read('rng', `[${nx(D.v - amp)}, ${nx(D.v + amp)}]`);
    lab.steps([['A and amplitude', `A = ${A.str}; amplitude |A| = ${nx(amp)}${amp > 1 ? ' (vertical stretch)' : amp < 1 ? ' (vertical compression)' : ''}${a < 0 ? '; A &lt; 0 reflects the graph over the midline' : ''}`],
      ['B and period', `B = ${B.str}; P = 2π/|B| = ${nx(P)}${B.v > 1 ? ' (horizontal compression)' : B.v < 1 ? ' (horizontal stretch)' : ''}`],
      ['C and phase shift', Math.abs(C.v) < 1e-12 ? 'C = 0: no phase shift' : `C = ${C.str}; C/B = ${nx(h)}: ${nx(Math.abs(h))} unit${Math.abs(h) === 1 ? '' : 's'} to the ${h > 0 ? 'right' : 'left'}`],
      ['D and midline', Math.abs(D.v) < 1e-12 ? 'D = 0: midline y = 0' : `D = ${D.str}: ${nx(Math.abs(D.v))} unit${Math.abs(D.v) === 1 ? '' : 's'} ${D.v > 0 ? 'up' : 'down'}; midline y = ${nx(D.v)}`],
      ['Five key points (one period)', `start at x = ${nx(h)} and step by P/4 = ${nx(P / 4)}: ${pts.map(([x, y]) => `(${nx(x)}, ${nx(y)})`).join(', ')}`]]);
    lab.out(`Maximum ${nx(D.v + amp)}, minimum ${nx(D.v - amp)}: ½(max − min) = ${nx(amp)} = |A|. One period runs from x = ${nx(h)} to x = ${nx(h + P)}.`);
  }
});

/* ---------- 04 · graph detective ---------- */
const AMPS = [0.5, 1, 2, 3, 4], PERS = [[PI / 2, 'π/2'], [PI, 'π'], [2 * PI, '2π'], [4 * PI, '4π']], MIDS = [-2, -1, 0, 1, 2];
let det = null;
const det_lab = CA.lab('det-lab', {
  controls: [{type: 'select', key: 'amp', label: 'Amplitude', value: '', options: [['', 'choose']].concat(AMPS.map(a => [String(a), fmt(a)]))}, {type: 'select', key: 'per', label: 'Period', value: '', options: [['', 'choose']].concat(PERS.map(([v, t]) => [t, t]))},
    {type: 'select', key: 'mid', label: 'Midline', value: '', options: [['', 'choose']].concat(MIDS.map(m => [String(m), `y = ${fmt(m)}`]))}],
  plot: {xmin: -PI, xmax: 3 * PI, ymin: -6.5, ymax: 6.5, xpi: F(1, 2), w: 620, h: 340}, plotLabel: 'Mystery sinusoid',
  bottom: '<div class="ca-controls"><button type="button" class="ca-btn" id="det-check">Check</button><button type="button" class="ca-btn ca-btn-outline" id="det-new"><i class="fa-solid fa-shuffle"></i> New graph</button></div>'
}, () => drawDet());
function newDet() { const pick = a => a[Math.floor(Math.random() * a.length)]; det = {fn: pick(['sin', 'cos']), A: pick(AMPS) * pick([1, -1]), P: pick(PERS), D: pick(MIDS)}; ['amp', 'per', 'mid'].forEach(k => det_lab.state.set(k, '', true)); drawDet(); det_lab.out('Read the graph: amplitude = half the distance from the maximum to the minimum; period = the length of one full cycle; midline = halfway between max and min.'); }
function drawDet() {
  if (!det) return; const L = det_lab || null; if (!L) return;
  const B = 2 * PI / det.P[0], P = L.plane(); P.curve(x => det.A * Math[det.fn](B * x) + det.D, {color: 'orange', width: 3.4, samples: 1600}).render();
}
$('det-new').addEventListener('click', newDet);
$('det-check').addEventListener('click', () => {
  const st = det_lab.state, okA = +st.amp === Math.abs(det.A), okP = st.per === det.P[1], okM = st.mid !== '' && +st.mid === det.D, all = okA && okP && okM;
  det_lab.out(`${okA ? '✓' : '✕'} amplitude ${okA ? '' : `(it is ${fmt(Math.abs(det.A))})`} · ${okP ? '✓' : '✕'} period ${okP ? '' : `(it is ${det.P[1]})`} · ${okM ? '✓' : '✕'} midline ${okM ? '' : `(it is y = ${fmt(det.D)})`}. ${all ? `The function is y = ${CA.coefSp({str: fmt(det.A)})}${det.fn}(${det.P[1] === '2π' ? 'x' : det.P[1] === 'π' ? '2x' : det.P[1] === 'π/2' ? '4x' : 'x/2'})${det.D ? ` ${det.D > 0 ? '+' : '−'} ${Math.abs(det.D)}` : ''}.` : 'Look again at the highest and lowest points and at where the pattern repeats.'}`, all ? 'ca-correct' : 'ca-incorrect');
});
newDet();

/* ---------- guided problems ---------- */
CA.guided('61', [
  {q: 'If sin x = 0.341, what is sin(x + 2π)?', opts: ['0.341', '−0.341', '0.341 + 2π', '0.659'], correct: 0, hint: 'Sine has period 2π.', why: 'sin(x + 2π) = sin x = 0.341.'},
  {q: 'If cos x = −3/7, what is cos(x + 4π)?', opts: ['−3/7', '3/7', '−3/7 + 4π', '4/7'], correct: 0, hint: '4π is two periods.', why: 'cos(x + 4π) = cos(x + 2π + 2π) = cos x = −3/7.'},
  {q: 'What is the amplitude of y = −3 sin x?', opts: ['3', '−3', '6', '1/3'], correct: 0, hint: 'Amplitude = |A|.', why: '|−3| = 3. The negative sign reflects the graph; it does not make the amplitude negative.', ref: {panel: 'sinusoid', what: 'the graph of y = −3 sin x', body: '<p>For <b>y = −3 sin x</b>, find A, the amplitude, and the maximum and minimum values.</p>'}},
  {q: 'What is the period of y = sin(4x)?', opts: ['π/2', '4π', '8π', '2π'], correct: 0, hint: 'P = 2π/|B|.', why: 'P = 2π/4 = π/2: the graph is compressed horizontally.'},
  {q: 'What is the period of y = −2 cos(x/4)?', opts: ['8π', 'π/2', '2π', '4π'], correct: 0, hint: 'B = 1/4.', why: 'P = 2π ÷ (1/4) = 8π: a horizontal stretch.'},
  {q: 'What is the phase shift of y = sin(2x − π/3)?', opts: ['π/6 to the right', 'π/3 to the right', 'π/6 to the left', '2π/3 to the right'], correct: 0, hint: 'Phase shift = C/B.', why: 'C = π/3 and B = 2, so C/B = π/6 &gt; 0: π/6 to the right.', ref: {panel: 'sinusoid', what: 'the graph of y = sin(2x − π/3)', body: '<p>Find the phase shift and its direction for <b>y = sin(2x − π/3)</b>.</p>'}},
  {q: 'What is the phase shift of y = cos(x/2 + π/4)?', opts: ['π/2 to the left', 'π/4 to the left', 'π/8 to the left', 'π/2 to the right'], correct: 0, hint: 'Write x/2 + π/4 as Bx − C: C = −π/4.', why: 'C/B = (−π/4)/(1/2) = −π/2: π/2 to the left.', ref: {problem: 6, what: 'the same rule'}},
  {q: 'What is the midline of y = sin x + 3?', opts: ['y = 3', 'y = 1', 'y = 4', 'x = 3'], correct: 0, hint: 'The midline is y = D.', why: 'D = 3, so the graph shifts up 3 and the midline is y = 3.'},
  {q: 'What is the range of y = 2 sin(4x − 1) + 5?', opts: ['[3, 7]', '[−2, 2]', '[5, 7]', '[−1, 1]'], correct: 0, hint: 'Midline ± amplitude.', why: 'Midline y = 5 and amplitude 2, so the outputs run from 3 to 7.'},
  {q: 'Which function is even, with a graph symmetric about the y-axis?', opts: ['y = cos x', 'y = sin x', 'y = sin x + 1', 'y = sin(x − π/2) + x'], correct: 0, hint: 'cos(−x) = cos x.', why: 'Cosine is even: cos(−x) = cos x. Sine is odd and is symmetric about the origin.'}
]);
})();
