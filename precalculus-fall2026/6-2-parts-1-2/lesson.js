/* Section 6.2 Parts I–II · Graphs of Tangent and Cotangent — interactive activities */
(() => {
'use strict';
const {fmt, num, F, toRad} = CA;
const PI = Math.PI, nx = v => CA.niceX(v);
const ASY = (Q, start, step) => CA.gridPts(start, step, Q.o.xmin, Q.o.xmax).forEach(x => Q._seg(x, Q.o.ymin - 1, x, Q.o.ymax + 1, {dash: '7 6', color: 'purple', width: 1.8}));
const breaksFor = (start, step, a, b) => CA.gridPts(start, step, a - 30 * step, b + 30 * step);

/* ---------- 01 · tangent as a height ---------- */
const CX = -4.1;
CA.lab('tan-lab', {
  controls: [{type: 'range', key: 'd', label: 'x =', min: -89, max: 89, step: 1, value: 50, fmt: v => v + '°'}],
  plot: {xmin: -5.4, xmax: 2.1, ymin: -3.2, ymax: 3.2, xpi: F(1, 4), xtickMin: -PI / 2, w: 620, h: 380}, plotLabel: 'Unit circle with the tangent line and the graph of tangent', readouts: [['x', 'x'], ['sc', 'sin x and cos x'], ['t', 'tan x = sin x / cos x']]
}, (lab, st) => {
  const t = toRad(st.d), T = Math.tan(t), P = lab.plane();
  P.param(u => CX + Math.cos(u), u => Math.sin(u), 0, 2 * PI, {color: 'gray', width: 1.8}).seg(CX - 1.2, 0, CX + 1.3, 0, {color: 'gray', width: 1.2});
  P.seg(CX + 1, -9, CX + 1, 9, {color: 'blue', width: 1.6, dash: '3 4'}).label(CX + 1, -2.6, 'x = 1', {color: 'blue', size: 11.5});
  P.seg(CX, 0, CX + 1, T, {color: 'orange', width: 2.2}).seg(CX + 1, 0, CX + 1, T, {color: 'orange', width: 5});
  P.point(CX + Math.cos(t), Math.sin(t), {color: 'orange', r: 5}).point(CX + 1, T, {color: 'orange', r: 6});
  P.vline(-PI / 2, {color: 'purple', dash: '7 6'}).vline(PI / 2, {color: 'purple', dash: '7 6'});
  P.curve(Math.tan, {from: -PI / 2 + 1e-4, to: PI / 2 - 1e-4, color: 'orange', width: 3.2, samples: 1200});
  P.seg(CX + 1, T, t, T, {color: 'gray', dash: '4 5', width: 1.4}).point(t, T, {color: 'orange', r: 7, label: `(${st.d}°, ${num(T, 2)})`}).render();
  lab.read('x', `${st.d}° ≈ ${num(t, 4)}`); lab.read('sc', `${num(Math.sin(t), 4)} and ${num(Math.cos(t), 4)}`); lab.read('t', num(T, 4));
  lab.out(Math.abs(st.d) > 80 ? `x is close to ${st.d > 0 ? '' : '−'}π/2: cos x is nearly 0, so tan x = sin x / cos x is huge. At ±π/2 itself the ray never meets the line x = 1: a vertical asymptote.` : `The ray through the point (cos x, sin x) meets x = 1 at height tan x = ${num(T, 4)}. ${st.d < 0 ? 'Negative angles give negative heights: tan(−x) = −tan x.' : ''}`);
});

/* ---------- 02 · tangent lab ---------- */
const TP = [
  {label: 'Example 1 (i) · y = 2 tan(x/3)', fn: 'tan', A: '2', B: '1/3', C: '0', D: '0'}, {label: 'Example 1 (ii) · y = −½ tan(πx)', fn: 'tan', A: '-1/2', B: 'π', C: '0', D: '0'},
  {label: 'Checkpoint 1 (i) · y = −4 tan(2x)', fn: 'tan', A: '-4', B: '2', C: '0', D: '0'}, {label: 'Checkpoint 1 (ii) · y = (2/3) tan(πx/4)', fn: 'tan', A: '2/3', B: 'π/4', C: '0', D: '0'},
  {label: 'Example 2 (i) · y = 3 tan(πx/4 − π/3) − 1', fn: 'tan', A: '3', B: 'π/4', C: 'π/3', D: '-1'}, {label: 'Example 2 (ii) · y = −tan(x/3 + π/4) + 2', fn: 'tan', A: '-1', B: '1/3', C: '-π/4', D: '2'},
  {label: 'Checkpoint 2 (i) · y = 4 tan(πx/3 + π/6) − 2', fn: 'tan', A: '4', B: 'π/3', C: '-π/6', D: '-2'}, {label: 'Checkpoint 2 (ii) · y = −(5/2) tan(2x − π/3) + 4', fn: 'tan', A: '-5/2', B: '2', C: 'π/3', D: '4'}
];
CA.waveLab('tan-wave', {fns: ['tan'], presets: TP, readouts: [['dir', 'Stretch and direction'], ['per', 'Period'], ['ph', 'Phase shift'], ['asy', 'Asymptotes (highlighted period)'], ['pts', 'Reference points']],
  update(lab, w) {
    const {A, D, P, h} = w, a = A.v, amp = Math.abs(a), Pl = w.plane({xmin: h - 1.25 * P, xmax: h + 1.25 * P, ymin: D.v - Math.max(4, 3 * amp), ymax: D.v + Math.max(4, 3 * amp)});
    const L = h - P / 2, R = h + P / 2, br = breaksFor(L, P, Pl.o.xmin, Pl.o.xmax);
    Pl.draw(Q => ASY(Q, L, P)).hline(D.v, {color: 'gray', dash: '4 6', width: 1.2});
    Pl.curve(w.f, {color: 'orange', width: 2.2, opacity: 0.45, breaks: br, samples: 2400}).curve(w.f, {from: L + 1e-6 * P, to: R - 1e-6 * P, color: 'orange', width: 3.6, samples: 1200});
    const pts = [[h - P / 4, D.v - a], [h, D.v], [h + P / 4, D.v + a]];
    pts.forEach(([x, y], i) => Pl.point(x, y, {color: 'green', r: 6, label: `(${nx(x)}, ${nx(y)})`, labelOpt: {size: 11.5, dy: i === 1 ? 20 : -12}}));
    Pl.render();
    lab.read('dir', `|A| = ${nx(amp)}; ${a > 0 ? 'increasing' : 'decreasing'}`); lab.read('per', `π/|B| = ${nx(P)}`); lab.read('ph', Math.abs(h) < 1e-12 ? 'none' : `${nx(Math.abs(h))} ${h > 0 ? 'right' : 'left'}`);
    lab.read('asy', `x = ${nx(L)} and x = ${nx(R)}`); lab.read('pts', pts.map(([x, y]) => `(${nx(x)}, ${nx(y)})`).join(', '));
    lab.steps([['Stretch factor', `|A| = ${nx(amp)}${amp > 1 ? ', a vertical stretch' : amp < 1 ? ', a vertical compression' : ''}; A ${a > 0 ? '&gt; 0: increasing' : '&lt; 0: decreasing'}`], ['Period', `P = π/|B| = π/${w.B.str.includes('/') || w.B.str.includes('π') ? `(${w.B.str})` : w.B.str} = ${nx(P)}`],
      ['Before shifting', `asymptotes x = ±P/2 = ±${nx(P / 2)}; points (${nx(-P / 4)}, ${nx(-a)}), (0, 0), (${nx(P / 4)}, ${nx(a)})`],
      ['Phase shift and vertical shift', `C/B = ${nx(h)}${Math.abs(h) < 1e-12 ? '' : h > 0 ? ' (right)' : ' (left)'}; D = ${nx(D.v)}${D.v ? (D.v > 0 ? ' (up)' : ' (down)') : ''}`],
      ['After shifting', `asymptotes x = ${nx(L)} and x = ${nx(R)}; points ${pts.map(([x, y]) => `(${nx(x)}, ${nx(y)})`).join(', ')}`]]);
    lab.out(`Check: the distance between the asymptotes is ${nx(R)} − (${nx(L)}) = ${nx(P)}, the period. The vertical shift moves the points but never the asymptotes.`);
  }
});

/* ---------- 03 · cotangent lab ---------- */
const CP = [
  {label: 'Example 3 · y = 2 cot(x/3)', fn: 'cot', A: '2', B: '1/3', C: '0', D: '0'}, {label: 'Checkpoint 3 · y = −4 cot(2x)', fn: 'cot', A: '-4', B: '2', C: '0', D: '0'},
  {label: 'Example 4 · y = 3 cot(πx/4 − π/3) − 1', fn: 'cot', A: '3', B: 'π/4', C: 'π/3', D: '-1'}, {label: 'Checkpoint 4 · y = ½ cot(2x − π/3) + 4', fn: 'cot', A: '1/2', B: '2', C: 'π/3', D: '4'},
  {label: 'Parent · y = cot x', fn: 'cot', A: '1', B: '1', C: '0', D: '0'}
];
CA.waveLab('cot-wave', {fns: ['cot'], presets: CP, readouts: [['dir', 'Stretch and direction'], ['per', 'Period'], ['asy', 'Asymptotes (highlighted period)'], ['pts', 'Reference points']],
  bottom: '<label class="ca-inline-check"><input type="checkbox" id="cot-guide" checked> Show the tangent guide A tan(Bx − C) + D</label>',
  update(lab, w) {
    const {A, B, C, D, P, h} = w, a = A.v, amp = Math.abs(a), Pl = w.plane({xmin: h - 0.75 * P, xmax: h + 1.75 * P, ymin: D.v - Math.max(4, 3 * amp), ymax: D.v + Math.max(4, 3 * amp)});
    const L = h, R = h + P, br = breaksFor(L, P, Pl.o.xmin, Pl.o.xmax), tanF = x => a * Math.tan(B.v * x - C.v) + D.v, guide = document.getElementById('cot-guide');
    Pl.draw(Q => ASY(Q, L, P)).hline(D.v, {color: 'gray', dash: '4 6', width: 1.2});
    if (!guide || guide.checked) Pl.curve(tanF, {color: 'gray', dash: '6 6', width: 1.8, breaks: breaksFor(h - P / 2, P, Pl.o.xmin, Pl.o.xmax), samples: 2400});
    Pl.curve(w.f, {color: 'blue', width: 2.2, opacity: 0.45, breaks: br, samples: 2400}).curve(w.f, {from: L + 1e-6 * P, to: R - 1e-6 * P, color: 'blue', width: 3.6, samples: 1200});
    const pts = [[h + P / 4, D.v + a], [h + P / 2, D.v], [h + 3 * P / 4, D.v - a]];
    pts.forEach(([x, y], i) => Pl.point(x, y, {color: 'green', r: 6, label: `(${nx(x)}, ${nx(y)})`, labelOpt: {size: 11.5, dy: i === 1 ? 20 : -12}}));
    Pl.render();
    lab.read('dir', `|A| = ${nx(amp)}; ${a > 0 ? 'decreasing' : 'increasing'}`); lab.read('per', `π/|B| = ${nx(P)}`); lab.read('asy', `x = ${nx(L)} and x = ${nx(R)}`); lab.read('pts', pts.map(([x, y]) => `(${nx(x)}, ${nx(y)})`).join(', '));
    lab.steps([['Period', `P = π/|B| = ${nx(P)}`], ['Phase shift and vertical shift', `C/B = ${nx(h)}; D = ${nx(D.v)}`], ['Asymptotes', `cot is undefined where Bx − C = kπ: x = C/B + kP. One period: x = ${nx(L)} to x = ${nx(R)}`],
      ['Reference points', `(C/B + P/4, D + A), (C/B + P/2, D), (C/B + 3P/4, D − A) = ${pts.map(([x, y]) => `(${nx(x)}, ${nx(y)})`).join(', ')}`], ['Direction', `cot decreases on each period, so A ${a > 0 ? '&gt; 0 keeps it decreasing' : '&lt; 0 flips it to increasing'}`]]);
    lab.out(`Compare with the dashed tangent guide: its zeros sit exactly on the cotangent's asymptotes, and its asymptotes are where the cotangent crosses the midline y = ${nx(D.v)}.`);
  }
});
document.getElementById('cot-guide').addEventListener('change', () => document.querySelector('#cot-wave-ctl select').dispatchEvent(new Event('change')));

/* ---------- 04 · match the graph ---------- */
const mini = f => CA.plotSVG({xmin: -PI, xmax: PI, ymin: -4, ymax: 4, xpi: F(1, 2), equal: false}, P => P.curve(f, {color: 'orange', width: 3, breaks: [-PI, -PI / 2, 0, PI / 2, PI], samples: 800}), 'Mystery graph');
const OPT = ['y = tan x', 'y = −tan x', 'y = cot x', 'y = −cot x'];
CA.cards('match-cards', [
  {expr: mini(x => -1 / Math.tan(x)), correct: 3, why: 'Asymptotes at 0 and ±π (so a cotangent), and the branches rise: −cot x.'},
  {expr: mini(Math.tan), correct: 0, why: 'Asymptotes at ±π/2 and rising branches through the origin: tan x.'},
  {expr: mini(x => 1 / Math.tan(x)), correct: 2, why: 'Asymptotes at multiples of π and falling branches: cot x.'},
  {expr: mini(x => -Math.tan(x)), correct: 1, why: 'Asymptotes at ±π/2 and falling branches through the origin: −tan x.'}
], {options: OPT});

/* ---------- guided problems ---------- */
CA.guided('62a', [
  {q: 'What is the period of y = tan x?', opts: ['π', '2π', 'π/2', '4π'], correct: 0, hint: 'The tangent graph repeats on intervals of kπ.', why: 'tan(x + π) = tan x, so the period is π.'},
  {q: 'Where does y = tan x have vertical asymptotes?', opts: ['x = π/2 + kπ', 'x = kπ', 'x = 2kπ', 'x = π/4 + kπ'], correct: 0, hint: 'Where is cos x = 0?', why: 'tan x = sin x/cos x is undefined at the odd multiples of π/2.'},
  {q: 'What is the period of y = 2 tan(x/3)?', opts: ['3π', 'π/3', '6π', '2π/3'], correct: 0, hint: 'P = π/|B| with B = 1/3.', why: 'P = π ÷ (1/3) = 3π.', ref: {panel: 'tan-transform', what: 'Example 1 (i)', body: '<p>Sketch <b>y = 2 tan(x/3)</b> over one period.</p>'}},
  {q: 'Which are the asymptotes of one period of y = 2 tan(x/3)?', opts: ['x = −3π/2 and x = 3π/2', 'x = −π/2 and x = π/2', 'x = −3π and x = 3π', 'x = −π/6 and x = π/6'], correct: 0, hint: 'x = ±P/2.', why: 'P = 3π, so x = ±3π/2.', ref: {problem: 3, what: 'the same function'}},
  {q: 'Which point is on one period of y = −½ tan(πx)?', opts: ['(1/4, −1/2)', '(1/4, 1/2)', '(1/2, −1/2)', '(π/4, −1/2)'], correct: 0, hint: 'P = 1; the point (P/4, A).', why: 'P = π/π = 1 and A = −1/2, so (P/4, A) = (1/4, −1/2).'},
  {q: 'What is the phase shift of y = 3 tan(πx/4 − π/3) − 1?', opts: ['4/3 to the right', 'π/3 to the right', '3/4 to the right', '4/3 to the left'], correct: 0, hint: 'C/B = (π/3)/(π/4).', why: 'C/B = (π/3) · (4/π) = 4/3 &gt; 0: right.', ref: {panel: 'tan-transform', what: 'Example 2 (i)', body: '<p>Graph <b>y = 3 tan(πx/4 − π/3) − 1</b> over one period.</p>'}},
  {q: 'For y = 3 tan(πx/4 − π/3) − 1, where are the asymptotes of the shifted period?', opts: ['x = −2/3 and x = 10/3', 'x = −2 and x = 2', 'x = −5/3 and x = 7/3', 'x = 1/3 and x = 7/3'], correct: 0, hint: 'P = 4, so ±2, then add 4/3.', why: '±2 + 4/3 gives −2/3 and 10/3; the vertical shift does not move them.', ref: {problem: 6, what: 'the same function'}},
  {q: 'Where does y = cot x have vertical asymptotes?', opts: ['x = kπ', 'x = π/2 + kπ', 'x = 2kπ', 'nowhere'], correct: 0, hint: 'Where is sin x = 0?', why: 'cot x = cos x/sin x is undefined at the integer multiples of π.'},
  {q: 'On the interval (0, 3π), the graph of y = 2 cot(x/3) is…', opts: ['decreasing', 'increasing', 'constant', 'increasing, then decreasing'], correct: 0, hint: 'cot x decreases on each period; A = 2 &gt; 0.', why: 'A positive multiple of cotangent keeps the decreasing shape of cot x.'},
  {q: 'What is the range of y = A tan(Bx)?', opts: ['all real numbers', '[−|A|, |A|]', '(−∞, −|A|] ∪ [|A|, ∞)', '(−π/2, π/2)'], correct: 0, hint: 'Between asymptotes the graph takes every value.', why: 'Each branch of a tangent graph goes from −∞ to ∞, so the range is (−∞, ∞).'}
]);
})();
