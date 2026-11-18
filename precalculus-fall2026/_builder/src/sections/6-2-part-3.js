/* Section 6.2 Part III · Graphs of Secant and Cosecant — interactive activities */
(() => {
'use strict';
const {fmt, num, F} = CA;
const PI = Math.PI, nx = v => CA.niceX(v);
const ASY = (Q, start, step) => CA.gridPts(start, step, Q.o.xmin, Q.o.xmax).forEach(x => Q._seg(x, Q.o.ymin - 1, x, Q.o.ymax + 1, {dash: '7 6', color: 'purple', width: 1.8}));
const breaksFor = (start, step, a, b) => CA.gridPts(start, step, a - 30 * step, b + 30 * step);
const rangeTxt = (A, D) => `(−∞, ${nx(D - Math.abs(A))}] ∪ [${nx(D + Math.abs(A))}, ∞)`;

function recipLab(id, fn, presets) {
  const guideFn = fn === 'sec' ? 'cos' : 'sin';
  CA.waveLab(id, {fns: [fn], presets, yPad: 4, readouts: [['per', 'Period'], ['ph', 'Phase shift'], ['asy', 'Asymptotes in one period'], ['rng', 'Range'], ['pts', 'Turning points']],
    update(lab, w) {
      const {A, B, C, D, P, h} = w, a = A.v, amp = Math.abs(a);
      const first = fn === 'sec' ? h - P / 4 : h, Pl = w.plane({xmin: first - 0.6 * P, xmax: first + 1.6 * P, ymin: D.v - amp - Math.max(4, 2.5 * amp), ymax: D.v + amp + Math.max(4, 2.5 * amp)});
      const guide = x => a * Math[guideFn](B.v * x - C.v) + D.v, br = breaksFor(first, P / 2, Pl.o.xmin, Pl.o.xmax);
      Pl.draw(Q => ASY(Q, first, P / 2)).hline(D.v, {color: 'gray', dash: '4 6', width: 1.2}).hline(D.v + amp, {color: 'green', dash: '2 5', width: 1.2}).hline(D.v - amp, {color: 'green', dash: '2 5', width: 1.2});
      Pl.curve(guide, {color: 'gray', dash: '6 6', width: 2, samples: 1600});
      Pl.curve(w.f, {color: 'orange', width: 2.2, opacity: 0.45, breaks: br, samples: 3000}).curve(w.f, {from: first + 1e-6 * P, to: first + P - 1e-6 * P, color: 'orange', width: 3.6, breaks: [first + P / 2], samples: 1600});
      const tp = fn === 'sec' ? [[h, D.v + a], [h + P / 2, D.v - a]] : [[h + P / 4, D.v + a], [h + 3 * P / 4, D.v - a]];
      tp.forEach(([x, y]) => Pl.point(x, y, {color: 'green', r: 6, label: `(${nx(x)}, ${nx(y)})`, labelOpt: {size: 11.5, dy: y > D.v ? 20 : -12}}));
      Pl.render();
      const asy = [first, first + P / 2, first + P];
      lab.read('per', `2π/|B| = ${nx(P)}`); lab.read('ph', Math.abs(h) < 1e-12 ? 'none' : `${nx(Math.abs(h))} ${h > 0 ? 'right' : 'left'}`); lab.read('asy', asy.map(x => `x = ${nx(x)}`).join(', ')); lab.read('rng', rangeTxt(a, D.v)); lab.read('pts', tp.map(([x, y]) => `(${nx(x)}, ${nx(y)})`).join(', '));
      const kc = v => { const t = nx(v); return t.includes('/') ? `(${t})` : t; }, sh = Math.abs(h) < 1e-12 ? '' : ` ${h < 0 ? '−' : '+'} ${nx(Math.abs(h))}`;
      const kTxt = fn === 'sec' ? `x = (π/(2|B|))k + C/B with k odd: x = ${kc(PI / (2 * B.v))}k${sh}` : `x = (π/|B|)k + C/B: x = ${kc(PI / B.v)}k${sh}`;
      lab.steps([['Guide curve', `y = ${CA.coefSp(A)}${guideFn}(${CA.argStr(B, C)})${D.v ? ` ${D.v > 0 ? '+' : '−'} ${nx(Math.abs(D.v))}` : ''}`], ['Stretch factor and period', `|A| = ${nx(amp)}; P = 2π/|B| = ${nx(P)}`], ['Phase shift', `C/B = ${nx(h)}`],
        ['Vertical asymptotes', `where the guide's ${guideFn} part is 0: ${kTxt}; one period: ${asy.map(x => nx(x)).join(', ')}`], ['Range', `(−∞, −|A| + D] ∪ [|A| + D, ∞) = ${rangeTxt(a, D.v)}`]]);
      lab.out(`Each U-shaped branch touches the guide at a maximum or minimum (green points) and turns away from the midline. Between ${nx(D.v - amp)} and ${nx(D.v + amp)} there are no outputs at all.`);
    }});
}
recipLab('sec-wave', 'sec', [
  {label: 'Example 1 · y = (3/2) sec(2x)', fn: 'sec', A: '3/2', B: '2', C: '0', D: '0'}, {label: 'Checkpoint 1 · y = −3 sec(πx/3)', fn: 'sec', A: '-3', B: 'π/3', C: '0', D: '0'},
  {label: 'Example 2 · y = −2 sec(πx/2 + π) − 1', fn: 'sec', A: '-2', B: 'π/2', C: '-π', D: '-1'}, {label: 'Checkpoint 2 · y = (1/3) sec(3x − 2π) + 2', fn: 'sec', A: '1/3', B: '3', C: '2π', D: '2'},
  {label: 'Parent · y = sec x', fn: 'sec', A: '1', B: '1', C: '0', D: '0'}]);
recipLab('csc-wave', 'csc', [
  {label: 'Example 3 · y = 2 csc(πx/3)', fn: 'csc', A: '2', B: 'π/3', C: '0', D: '0'}, {label: 'Checkpoint 3 · y = −¼ csc(3x)', fn: 'csc', A: '-1/4', B: '3', C: '0', D: '0'},
  {label: 'Example 4 · y = −½ csc(4x − 2π/3) + 3', fn: 'csc', A: '-1/2', B: '4', C: '2π/3', D: '3'}, {label: 'Checkpoint 4 · y = 5 csc(x/6 + 4π/3) − 2', fn: 'csc', A: '5', B: '1/6', C: '-4π/3', D: '-2'},
  {label: 'Parent · y = csc x', fn: 'csc', A: '1', B: '1', C: '0', D: '0'}]);

/* ---------- 03 · all six graphs ---------- */
const SIX = {
  sin: {f: Math.sin, br: [], dom: '(−∞, ∞)', rng: '[−1, 1]', per: '2π', sym: 'odd (origin)', asy: 'none'},
  cos: {f: Math.cos, br: [], dom: '(−∞, ∞)', rng: '[−1, 1]', per: '2π', sym: 'even (y-axis)', asy: 'none'},
  tan: {f: Math.tan, start: PI / 2, step: PI, dom: 'x ≠ π/2 + kπ', rng: '(−∞, ∞)', per: 'π', sym: 'odd (origin)', asy: 'x = π/2 + kπ'},
  cot: {f: x => 1 / Math.tan(x), start: 0, step: PI, dom: 'x ≠ kπ', rng: '(−∞, ∞)', per: 'π', sym: 'odd (origin)', asy: 'x = kπ'},
  sec: {f: x => 1 / Math.cos(x), start: PI / 2, step: PI, dom: 'x ≠ π/2 + kπ', rng: '(−∞, −1] ∪ [1, ∞)', per: '2π', sym: 'even (y-axis)', asy: 'x = π/2 + kπ'},
  csc: {f: x => 1 / Math.sin(x), start: 0, step: PI, dom: 'x ≠ kπ', rng: '(−∞, −1] ∪ [1, ∞)', per: '2π', sym: 'odd (origin)', asy: 'x = kπ'}
};
CA.lab('six-lab', {
  controls: [{type: 'seg', key: 'fn', label: 'Function', value: 'sec', options: Object.keys(SIX).map(k => [k, `y = ${k} x`])}],
  plot: {xmin: -2 * PI, xmax: 2 * PI, ymin: -4, ymax: 4, xpi: F(1, 2), w: 620, h: 330}, plotLabel: 'Parent trigonometric graph', readouts: [['per', 'Period'], ['dom', 'Domain'], ['rng', 'Range'], ['sym', 'Symmetry'], ['asy', 'Asymptotes']]
}, (lab, st) => {
  const S = SIX[st.fn], P = lab.plane();
  if (S.step) P.draw(Q => ASY(Q, S.start, S.step));
  if (st.fn === 'sec') P.curve(Math.cos, {color: 'gray', dash: '6 6', width: 1.8}); if (st.fn === 'csc') P.curve(Math.sin, {color: 'gray', dash: '6 6', width: 1.8});
  P.curve(S.f, {color: 'orange', width: 3.2, breaks: S.step ? breaksFor(S.start, S.step, -2 * PI, 2 * PI) : [], samples: 2400}).render();
  ['per', 'dom', 'rng', 'sym', 'asy'].forEach(k => lab.read(k, S[k]));
  lab.out({sin: 'The sine wave: the guide curve for cosecant.', cos: 'The cosine wave: the guide curve for secant.', tan: 'Rising branches between asymptotes at the zeros of cosine.', cot: 'Falling branches between asymptotes at the zeros of sine.', sec: 'U-shaped branches touching the cosine guide at its maxima and minima.', csc: 'U-shaped branches touching the sine guide at its maxima and minima.'}[st.fn]);
});
const mini = (f, start) => CA.plotSVG({xmin: -PI, xmax: PI, ymin: -4, ymax: 4, xpi: F(1, 2), equal: false}, P => P.curve(f, {color: 'orange', width: 3, breaks: breaksFor(start, PI, -PI, PI), samples: 800}), 'Mystery graph');
CA.cards('sc-cards', [
  {expr: mini(x => 1 / Math.sin(x), 0), correct: 2, why: 'Asymptotes at multiples of π and a branch opening up on (0, π): csc x.'},
  {expr: mini(x => -1 / Math.cos(x), PI / 2), correct: 1, why: 'Asymptotes at ±π/2 and a branch opening down through (0, −1): −sec x.'},
  {expr: mini(x => 1 / Math.cos(x), PI / 2), correct: 0, why: 'Asymptotes at ±π/2 and a branch opening up through (0, 1): sec x.'},
  {expr: mini(x => -1 / Math.sin(x), 0), correct: 3, why: 'Asymptotes at multiples of π and a branch opening down on (0, π): −csc x.'}
], {options: ['y = sec x', 'y = −sec x', 'y = csc x', 'y = −csc x']});

/* ---------- guided problems ---------- */
CA.guided('62b', [
  {q: 'What is the range of y = sec x?', opts: ['(−∞, −1] ∪ [1, ∞)', '[−1, 1]', '(−∞, ∞)', '(−1, 1)'], correct: 0, hint: 'Reciprocals of numbers in [−1, 1].', why: '|cos x| ≤ 1, so |sec x| = 1/|cos x| ≥ 1.'},
  {q: 'Where does y = csc x have vertical asymptotes?', opts: ['x = kπ', 'x = π/2 + kπ', 'x = 2kπ', 'x = π/4 + kπ'], correct: 0, hint: 'Where is sin x = 0?', why: 'csc x = 1/sin x is undefined at every integer multiple of π.'},
  {q: 'What is the period of y = (3/2) sec(2x)?', opts: ['π', '2π', '4π', '3π'], correct: 0, hint: 'P = 2π/|B|.', why: 'P = 2π/2 = π.', ref: {panel: 'secant', what: 'Example 1', body: '<p>Graph <b>y = (3/2) sec(2x)</b> over two periods.</p>'}},
  {q: 'What is the range of y = (3/2) sec(2x)?', opts: ['(−∞, −3/2] ∪ [3/2, ∞)', '[−3/2, 3/2]', '(−∞, −1] ∪ [1, ∞)', '(−∞, ∞)'], correct: 0, hint: '(−∞, −|A|] ∪ [|A|, ∞).', why: '|A| = 3/2, so the range is (−∞, −3/2] ∪ [3/2, ∞).', ref: {problem: 3, what: 'the same function'}},
  {q: 'Where are the asymptotes of y = 2 csc(πx/3)?', opts: ['x = 3k', 'x = 6k', 'x = πk/3', 'x = 3/2 + 3k'], correct: 0, hint: 'x = (π/|B|)k.', why: 'π ÷ (π/3) = 3, so x = 3k: …, −3, 0, 3, 6, ….'},
  {q: 'What is the period of y = −2 sec(πx/2 + π) − 1?', opts: ['4', '2', '4π', 'π'], correct: 0, hint: 'B = π/2.', why: 'P = 2π ÷ (π/2) = 4.', ref: {panel: 'secant', what: 'Example 2', body: '<p>Graph <b>y = −2 sec(πx/2 + π) − 1</b> over one period.</p>'}},
  {q: 'What is the range of y = −2 sec(πx/2 + π) − 1?', opts: ['(−∞, −3] ∪ [1, ∞)', '[−3, 1]', '(−∞, −2] ∪ [2, ∞)', '(−∞, −1] ∪ [3, ∞)'], correct: 0, hint: 'D ± |A| with D = −1 and |A| = 2.', why: '−1 − 2 = −3 and −1 + 2 = 1: (−∞, −3] ∪ [1, ∞).', ref: {problem: 6, what: 'the same function'}},
  {q: 'What is the phase shift of y = −½ csc(4x − 2π/3) + 3?', opts: ['π/6 to the right', '2π/3 to the right', 'π/6 to the left', '8π/3 to the right'], correct: 0, hint: 'C/B with C = 2π/3 and B = 4.', why: '(2π/3)/4 = π/6 &gt; 0: right.'},
  {q: 'Which is the guide curve for y = 4 sec x − 1?', opts: ['y = 4 cos x − 1', 'y = 4 sin x − 1', 'y = (1/4) cos x − 1', 'y = cos x'], correct: 0, hint: 'Replace sec by cos and keep A and D.', why: 'Secant is graphed from y = A cos(Bx − C) + D, here 4 cos x − 1.'},
  {q: 'Which of these functions is odd?', opts: ['y = csc x', 'y = sec x', 'y = cos x', 'y = 2 + cos x'], correct: 0, hint: 'csc is the reciprocal of an odd function.', why: 'csc(−x) = 1/sin(−x) = −1/sin x = −csc x.'}
]);
})();
