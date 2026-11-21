/* Section 4.7 · Applied Optimization Problems — interactive activities */
(() => {
'use strict';
const {num} = CA, PI = Math.PI;
const rect = (P, x0, y0, w, h, o = {}) => P.poly([[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], Object.assign({color: 'blue', fillOpacity: 0.15, width: 2.4}, o));

const OPT = [
  {t: 'Garden: 100 ft of fence, maximize the area', v: 'x', a: 0, b: 50, x0: 10, best: 25, kind: 'max', obj: x => x * (50 - x), objT: 'A(x) = x(50 − x)', unit: 'ft²', vu: 'ft',
    steps: [['Variables', 'sides x and y'], ['Objective', 'A = xy'], ['Constraint', '2x + 2y = 100 ⇒ y = 50 − x'], ['One variable', 'A(x) = 50x − x² on [0, 50]'], ['Calculus', 'A′(x) = 50 − 2x = 0 ⇒ x = 25; A″ = −2 < 0'], ['Answer', '25 ft × 25 ft, area 625 ft²']],
    pic: (P, x) => { rect(P, 0, 0, x, 50 - x); P.label(x / 2, -3, `x = ${num(x, 1)}`, {anchor: 'middle', color: 'blue'}).label(x + 2, (50 - x) / 2, `y = ${num(50 - x, 1)}`, {anchor: 'start', color: 'blue'}); }, win: {xmin: -5, xmax: 60, ymin: -8, ymax: 55}},
  {t: 'River garden: 100 ft of fence on three sides', v: 'x', a: 0, b: 50, x0: 10, best: 25, kind: 'max', obj: x => x * (100 - 2 * x), objT: 'A(x) = x(100 − 2x)', unit: 'ft²', vu: 'ft',
    steps: [['Variables', 'two sides x perpendicular to the river, one side y along it'], ['Objective', 'A = xy'], ['Constraint', '2x + y = 100 ⇒ y = 100 − 2x'], ['One variable', 'A(x) = 100x − 2x² on [0, 50]'], ['Calculus', 'A′(x) = 100 − 4x = 0 ⇒ x = 25'], ['Answer', '25 ft × 50 ft, area 1250 ft²']],
    pic: (P, x) => { P.seg(-5, 0, 105, 0, {color: 'blue', width: 5}).label(50, -6, 'river', {anchor: 'middle', color: 'blue'}); rect(P, 0, 0, 100 - 2 * x, x, {color: 'green'}); P.label((100 - 2 * x) / 2, x + 4, `y = ${num(100 - 2 * x, 1)}`, {anchor: 'middle', color: 'green'}); }, win: {xmin: -5, xmax: 110, ymin: -12, ymax: 60}},
  {t: 'Box: 12 in square sheet, cut corners of side x', v: 'x', a: 0, b: 6, x0: 1, best: 2, kind: 'max', obj: x => x * (12 - 2 * x) ** 2, objT: 'V(x) = x(12 − 2x)²', unit: 'in³', vu: 'in',
    steps: [['Variables', 'corner square side x; base (12 − 2x) × (12 − 2x), height x'], ['Objective', 'V = (12 − 2x)²x'], ['Interval', '0 ≤ x ≤ 6'], ['Calculus', 'V′(x) = (12 − 2x)(12 − 6x) = 0 ⇒ x = 2 or x = 6'], ['Compare', 'V(0) = V(6) = 0, V(2) = 128'], ['Answer', 'cut 2 in squares; volume 128 in³']],
    pic: (P, x) => { rect(P, 0, 0, 12, 12, {color: 'gray', fillOpacity: 0.06, width: 1.4}); [[0, 0], [12 - x, 0], [0, 12 - x], [12 - x, 12 - x]].forEach(([a, b]) => rect(P, a, b, x, x, {color: 'red', fillOpacity: 0.35, width: 1.2})); rect(P, x, x, 12 - 2 * x, 12 - 2 * x, {color: 'blue', fillOpacity: 0.18}); P.label(6, 6, `base ${num(12 - 2 * x, 2)} × ${num(12 - 2 * x, 2)}`, {anchor: 'middle', color: 'blue'}); }, win: {xmin: -1, xmax: 13, ymin: -1, ymax: 13}},
  {t: 'Numbers: x + 2y = 50, maximize (x + 1)(y + 2)', v: 'y', a: 0, b: 25, x0: 5, best: 47 / 4, kind: 'max', obj: y => (51 - 2 * y) * (y + 2), objT: 'φ(y) = (51 − 2y)(y + 2) = −2y² + 47y + 102', unit: '', vu: '',
    steps: [['Constraint', 'x = 50 − 2y, and x, y > 0 ⇒ 0 < y < 25'], ['Objective', '(x + 1)(y + 2) = (51 − 2y)(y + 2)'], ['Expand', 'φ(y) = −2y² + 47y + 102'], ['Calculus', 'φ′(y) = −4y + 47 = 0 ⇒ y = 47/4; φ″ = −4 < 0'], ['Answer', 'y = 47/4, x = 50 − 47/2 = 53/2']],
    pic: (P, y) => { P.lineMB(-0.5, 25, {color: 'gray', width: 2}).point(50 - 2 * y, y, {color: 'orange', r: 7, label: `(x, y) = (${num(50 - 2 * y, 2)}, ${num(y, 2)})`}); P.label(30, 22, 'x + 2y = 50', {color: 'gray'}); }, win: {xmin: -2, xmax: 52, ymin: -2, ymax: 27}},
  {t: 'Can: volume 1000 cm³, minimize the surface area', v: 'r', a: 2, b: 12, x0: 9, best: Math.cbrt(500 / PI), kind: 'min', obj: r => 2 * PI * r * r + 2000 / r, objT: 'S(r) = 2πr² + 2000/r', unit: 'cm²', vu: 'cm',
    steps: [['Variables', 'radius r, height h'], ['Objective', 'S = 2πr² + 2πrh'], ['Constraint', 'πr²h = 1000 ⇒ h = 1000/(πr²)'], ['One variable', 'S(r) = 2πr² + 2000/r, r > 0'], ['Calculus', 'S′(r) = 4πr − 2000/r² = 0 ⇒ r³ = 500/π ⇒ r ≈ 5.42'], ['Answer', 'r ≈ 5.42 cm, h ≈ 10.84 cm (h = 2r: as tall as it is wide), S ≈ 553.6 cm²']],
    pic: (P, r) => { const h = 1000 / (PI * r * r); rect(P, -r, 0, 2 * r, h, {color: 'blue'}); P.label(0, h + 1.5, `r = ${num(r, 2)}, h = ${num(h, 2)}`, {anchor: 'middle', color: 'blue'}); }, win: {xmin: -14, xmax: 14, ymin: -2, ymax: 82}}
];
CA.lab('opt-lab', {
  controls: [{type: 'select', key: 'p', label: 'Problem', value: '0', options: OPT.map((o, i) => [String(i), o.t])}, {type: 'range', key: 'u', label: 'Your choice', min: 0, max: 1000, step: 1, value: 200, fmt: () => ''}, {type: 'check', key: 'show', label: 'Show the calculus answer', value: false}],
  top: '<svg id="opt-pic" role="img" aria-label="Picture of the problem"></svg>', plot: {w: 540, h: 320}, plotLabel: 'Objective function', legend: [['blue', 'objective'], ['orange', 'your choice'], ['green', 'optimum']],
  readouts: [['v', 'variable'], ['o', 'objective'], ['b', 'best so far vs optimum']], steps: true
}, (lab, st, key) => {
  const O = OPT[+st.p]; if (key === 'p') { st.set('u', Math.round((O.x0 - O.a) / (O.b - O.a) * 1000), true); st.set('show', false, true); }
  const x = O.a + (O.b - O.a) * st.u / 1000, val = O.obj(x), best = O.obj(O.best);
  const pic = new CA.Plane(document.getElementById('opt-pic'), Object.assign({w: 540, h: 260, equal: true, tools: false, labels: false, grid: false, xname: '', yname: ''}, O.win)); O.pic(pic, x); pic.render();
  const Y = CA.fitY(O.obj, O.a + 1e-3, O.b, {clip: 1e4}), P = lab.plane({xmin: O.a, xmax: O.b, ymin: Math.max(Y.ymin, O.kind === 'min' ? 0 : Y.ymin), ymax: O.kind === 'min' ? Math.min(Y.ymax, best * 3) : Y.ymax, equal: false, xname: O.v, yname: ''});
  P.curve(O.obj, {color: 'blue', width: 3.2, from: O.a + 1e-3, to: O.b}).point(x, val, {color: 'orange', r: 7});
  if (st.show) P.point(O.best, best, {color: 'green', r: 7, label: `${O.v} = ${num(O.best, 3)}`}); P.render();
  lab.read('v', `${O.v} = ${num(x, 3)} ${O.vu}`); lab.read('o', `${O.objT.split(' = ')[0]} = ${num(val, 5)} ${O.unit}`);
  lab.read('b', st.show ? `optimum ${num(best, 5)} ${O.unit} at ${O.v} = ${num(O.best, 4)}` : `${O.kind === 'max' ? 'try to make it larger' : 'try to make it smaller'}`);
  lab.steps(st.show ? O.steps : O.steps.slice(0, 2));
  const gap = Math.abs(val - best) / Math.max(1, Math.abs(best));
  lab.out(gap < 0.002 ? `Excellent: ${O.v} = ${num(x, 3)} is essentially optimal.` : `The objective is ${O.objT}. ${st.show ? '' : 'Tick “Show the calculus answer” to see the full solution.'}`, gap < 0.002 ? 'ca-correct' : '');
});

/* ---------- 03 · distance ---------- */
CA.lab('dist-lab', {
  controls: [{type: 'range', key: 'x', label: 'x on the curve', min: -2, max: 8, step: 0.05, value: 1, fmt: v => num(v, 2)}, {type: 'seg', key: 'w', label: 'Graph', value: 'D', options: [['D', 'D(x)'], ['D2', 'D(x)²']]}],
  top: '<svg id="dist-pic" role="img" aria-label="The curve and the point (5, 0)"></svg>', plot: {xmin: -2, xmax: 8, ymin: 0, ymax: 40, w: 540, h: 260, equal: false, yname: ''}, plotLabel: 'Distance as a function of x',
  readouts: [['p', 'point on the curve'], ['d', 'distance D'], ['d2', 'D²']]
}, (lab, st) => {
  const x = st.x, y = Math.sqrt(x + 2), D2 = t => t * t - 9 * t + 27, D = t => Math.sqrt(D2(t)), g = st.w === 'D' ? D : D2;
  const pic = new CA.Plane(document.getElementById('dist-pic'), {xmin: -3, xmax: 9, ymin: -1, ymax: 4, w: 540, h: 230, equal: true, tools: false});
  pic.curve(t => Math.sqrt(t + 2), {color: 'blue', width: 3.2, from: -2, to: 9}).seg(x, y, 5, 0, {color: 'orange', width: 2.4, dash: '6 5'}).point(5, 0, {color: 'red', r: 7, label: '(5, 0)'}).point(x, y, {color: 'orange', r: 7});
  pic.point(4.5, Math.sqrt(6.5), {color: 'green', r: 5}).render();
  const P = lab.plane({ymin: 0, ymax: st.w === 'D' ? 6 : 40}); P.curve(g, {color: 'blue', width: 3.2}).point(x, g(x), {color: 'orange', r: 7}).point(4.5, g(4.5), {color: 'green', r: 6, label: 'x = 4.5'}).render();
  lab.read('p', `(${num(x, 2)}, ${num(y, 4)})`); lab.read('d', num(D(x), 5)); lab.read('d2', num(D2(x), 5));
  lab.out(Math.abs(x - 4.5) < 0.03 ? 'At x = 4.5 the segment to (5, 0) is perpendicular to the curve and the distance is smallest: D = √(20.25 − 40.5 + 27) = √6.75 ≈ 2.598.' : 'Both D and D² are smallest at the same x = 9/2 = 4.5.', Math.abs(x - 4.5) < 0.03 ? 'ca-correct' : '');
});

/* ---------- guided problems ---------- */
CA.guided('47', [
  {q: 'With 100 ft of fence, the largest rectangular area is:', opts: ['625 ft²', '2500 ft²', '500 ft²', '1250 ft²'], correct: 0, hint: 'A square 25 × 25.', why: 'A(x) = x(50 − x) is largest at x = 25.', ref: {panel: 'strategy', what: 'the garden problem', body: '<p>Maximize A = xy with 2x + 2y = 100.</p>'}},
  {q: 'With 100 ft of fence on three sides (a river on the fourth), the largest area is:', opts: ['1250 ft²', '625 ft²', '2500 ft²', '833 ft²'], correct: 0, hint: 'A(x) = x(100 − 2x).', why: 'x = 25, y = 50.'},
  {q: 'For a box from a 12 in sheet, V(x) = x(12 − 2x)². The interval for x is:', opts: ['[0, 6]', '[0, 12]', '[2, 6]', '(−∞, ∞)'], correct: 0, hint: 'You cannot cut more than half of a side.', why: '12 − 2x ≥ 0.', ref: {panel: 'explore', what: 'the box problem', body: '<p>V(x) = x(12 − 2x)² on [0, 6].</p>'}},
  {q: 'The cut that maximizes that box is x =', opts: ['2 in', '3 in', '4 in', '1 in'], correct: 0, hint: 'V′(x) = (12 − 2x)(12 − 6x).', why: 'x = 2 gives V = 128.'},
  {q: 'Maximize (x + 1)(y + 2) with x + 2y = 50. The optimal y is:', opts: ['47/4', '25/2', '53/2', '47/2'], correct: 0, hint: 'φ(y) = −2y² + 47y + 102.', why: 'φ′(y) = −4y + 47 = 0.'},
  {q: 'The closest point on y = √(x + 2) to (5, 0) has x =', opts: ['9/2', '5', '3', '7/2'], correct: 0, hint: 'Minimize D² = x² − 9x + 27.', why: '2x − 9 = 0.', ref: {panel: 'closest', what: 'the distance problem', body: '<p>D(x)² = (x − 5)² + (x + 2) = x² − 9x + 27.</p>'}},
  {q: 'Minimizing D² instead of D works because:', opts: ['√ is increasing', 'D is always 1', 'D² = 2D', 'D is a polynomial'], correct: 0, hint: 'Compare D and D² for D ≥ 0.', why: 'Larger D means larger D².'},
  {q: 'A can with volume 1000 cm³ and least surface area has:', opts: ['h = 2r', 'h = r', 'h = r/2', 'h = 4r'], correct: 0, hint: 'r³ = 500/π, h = 1000/(πr²).', why: 'h = 1000/(πr²) = 2 · 500/(πr²) = 2r³/r² = 2r.'},
  {q: 'Two nonnegative numbers add to 20. The largest possible product is:', opts: ['100', '20', '400', '99'], correct: 0, hint: 'P(x) = x(20 − x).', why: 'x = 10.'},
  {q: 'After finding a critical point in an optimization problem, you should also:', opts: ['check the endpoints or use a derivative test', 'differentiate again', 'set x = 0', 'nothing else'], correct: 0, hint: 'A critical point need not be the absolute optimum.', why: 'Justify that it is the absolute maximum or minimum.'}
]);
})();
