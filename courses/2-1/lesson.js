/* Section 2.1 · A Preview of Calculus — interactive activities */
(() => {
'use strict';
const {num} = CA;
const HS = [1, 0.5, 0.1, 0.01, 0.001];
const slopeTable = (f, a, unit = '') => `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>h</th>${HS.map(h => `<th>${h}</th>`).join('')}</tr><tr><th>slope, h &gt; 0</th>${HS.map(h => `<td>${num((f(a + h) - f(a)) / h, 6)}</td>`).join('')}</tr><tr><th>h</th>${HS.map(h => `<th>−${h}</th>`).join('')}</tr><tr><th>slope, h &lt; 0</th>${HS.map(h => `<td>${num((f(a - h) - f(a)) / -h, 6)}</td>`).join('')}</tr></table></div>${unit}`;

/* ---------- 01 · secant lines approach the tangent ---------- */
const SEC = [
  {t: 'f(x) = x² at P = (1, 1)', f: x => x * x, a: 1, m: 2, win: {xmin: -1.5, xmax: 3.5, ymin: -1, ymax: 9, equal: false}},
  {t: 'f(x) = x³ − 2x at P = (1, −1)', f: x => x ** 3 - 2 * x, a: 1, m: 1, win: {xmin: -2, xmax: 3.2, ymin: -4, ymax: 8, equal: false}},
  {t: 'f(x) = √x at P = (4, 2)', f: x => Math.sqrt(x), a: 4, m: 0.25, win: {xmin: -0.5, xmax: 7, ymin: -0.5, ymax: 3.5, equal: false}, lo: 0},
  {t: 'f(x) = 1/x at P = (1, 1)', f: x => 1 / x, a: 1, m: -1, win: {xmin: -0.2, xmax: 3.5, ymin: -0.5, ymax: 4, equal: false}, lo: 0.02},
  {t: 'f(x) = sin x at P = (0, 0)', f: Math.sin, a: 0, m: 1, win: {xmin: -3.5, xmax: 3.5, ymin: -1.6, ymax: 1.6, equal: false}}
];
const sec = CA.lab('secant-lab', {
  controls: [{type: 'select', key: 'p', label: 'Curve and point', value: '0', options: SEC.map((s, i) => [String(i), s.t])}, {type: 'range', key: 'h', label: 'h =', min: -2, max: 2, step: 0.01, value: 1.5, skip: [0], fmt: v => num(v, 2)},
    {type: 'check', key: 'tan', label: 'Show the tangent line', value: false}],
  plot: {w: 540, h: 400}, plotLabel: 'Curve with a secant line through P and Q', legend: [['blue', 'y = f(x)'], ['purple', 'secant line PQ'], ['green', 'tangent line at P', true]],
  readouts: [['q', 'Q = (a + h, f(a + h))'], ['m', 'Secant slope'], ['t', 'Tangent slope (the limit)']],
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag Q along the curve.</p><div id="secant-table"></div>'
}, (lab, st, key) => {
  const S = SEC[+st.p], f = S.f, a = S.a; let h = st.h;
  if (key === 'p') { h = 1.5; if (S.lo !== undefined && a - 1.5 < S.lo) h = 1.5; st.set('h', h, true); }
  if (S.lo !== undefined && a + h < S.lo) { h = S.lo - a + 0.01; st.set('h', Math.round(h * 100) / 100, true); }
  const P = lab.plane(S.win), q = a + h, m = (f(q) - f(a)) / h;
  P.curve(f, {color: 'blue', width: 3.2, from: S.lo ?? S.win.xmin, to: S.win.xmax, breaks: S.lo === 0.02 ? [0] : []});
  P.lineMB(m, f(a) - m * a, {color: 'purple', width: 2.4});
  if (st.tan) P.lineMB(S.m, f(a) - S.m * a, {color: 'green', width: 2.2, dash: '7 6'});
  P.seg(a, f(a), q, f(a), {color: 'gray', dash: '4 4', width: 1.4}).seg(q, f(a), q, f(q), {color: 'gray', dash: '4 4', width: 1.4});
  P.point(a, f(a), {color: 'orange', r: 7, label: 'P'}).point(q, f(q), {color: 'purple', r: 7, label: 'Q'}).render();
  lab.read('q', `(${num(q, 3)}, ${num(f(q), 4)})`); lab.read('m', num(m, 6)); lab.read('t', Math.abs(h) < 0.06 || st.tan ? num(S.m, 4) : '? (make h small)');
  document.getElementById('secant-table').innerHTML = slopeTable(f, a);
  lab.out(Math.abs(h) < 0.06 ? `With h = ${num(h, 2)} the secant line is almost the tangent line: the slopes approach <b>${num(S.m, 4)}</b> from both sides.` : `m<sub>sec</sub> = (f(${num(q, 2)}) − f(${num(a, 2)}))/${num(h, 2)} = ${num(m, 4)}. Move Q closer to P.`, Math.abs(h) < 0.06 ? 'ca-correct' : '');
});
CA.drag(sec.svg, x => { const S = SEC[+sec.state.p]; let h = Math.round((x - S.a) * 100) / 100; if (h === 0) h = 0.01; h = Math.max(-2, Math.min(2, h)); sec.state.set('h', h); });

/* ---------- 02 · average and instantaneous velocity ---------- */
const s = t => -16 * t * t + 64 * t;
CA.lab('vel-lab', {
  controls: [{type: 'range', key: 'a', label: 'Instant t = a', min: 0, max: 3.5, step: 0.5, value: 1, fmt: v => num(v, 1) + ' s'}, {type: 'range', key: 'h', label: 'Interval length h', min: 0.01, max: 2, step: 0.01, value: 1, fmt: v => num(v, 2) + ' s'}],
  plot: {xmin: -0.3, xmax: 4.4, ymin: -10, ymax: 75, w: 540, h: 380, xname: 't', yname: 's'}, plotLabel: 'Height of the ball against time', legend: [['blue', 's(t) = −16t² + 64t'], ['purple', 'secant: average velocity'], ['green', 'tangent: instantaneous velocity', true]],
  readouts: [['avg', 'Average velocity on [a, a + h]'], ['inst', 'Instantaneous velocity at a']], bottom: '<div id="vel-table"></div>'
}, (lab, st) => {
  const {a, h} = st, b = Math.min(a + h, 4), hh = b - a, avg = (s(b) - s(a)) / hh, v = -32 * a + 64, P = lab.plane();
  P.curve(s, {color: 'blue', width: 3.2, from: 0, to: 4}).lineMB(avg, s(a) - avg * a, {color: 'purple', width: 2.2}).lineMB(v, s(a) - v * a, {color: 'green', width: 2, dash: '7 6'});
  P.point(a, s(a), {color: 'orange', r: 7, label: `t = ${num(a, 1)}`}).point(b, s(b), {color: 'purple', r: 6}).render();
  lab.read('avg', `(s(${num(b, 2)}) − s(${num(a, 1)}))/${num(hh, 2)} = ${num(avg, 4)} ft/s`); lab.read('inst', `${num(v, 4)} ft/s`);
  document.getElementById('vel-table').innerHTML = `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>interval</th>${HS.map(k => `<th>[${num(a, 1)}, ${num(a + k, 4)}]</th>`).join('')}</tr><tr><th>average velocity (ft/s)</th>${HS.map(k => `<td>${num((s(a + k) - s(a)) / k, 5)}</td>`).join('')}</tr></table></div>`;
  lab.out(`On [${num(a, 1)}, ${num(a, 1)} + h] the average velocity is ${num(64 - 32 * a, 4)} − 16h ft/s, which approaches <b>${num(v, 4)} ft/s</b> as h → 0. ${v > 0 ? 'The ball is rising.' : v < 0 ? 'The ball is falling.' : 'At this instant the ball is at the top: velocity 0.'}`);
});

/* ---------- 03 · area with rectangles ---------- */
const AR = [
  {t: 'y = x² on [0, 2]', f: x => x * x, a: 0, b: 2, ex: 8 / 3, exT: '8/3', win: {xmin: -0.4, xmax: 2.4, ymin: -0.5, ymax: 4.6, equal: false}},
  {t: 'y = x² + 1 on [0, 2]', f: x => x * x + 1, a: 0, b: 2, ex: 14 / 3, exT: '14/3', win: {xmin: -0.4, xmax: 2.4, ymin: -0.5, ymax: 5.6, equal: false}},
  {t: 'y = √x on [0, 4]', f: x => Math.sqrt(Math.max(0, x)), a: 0, b: 4, ex: 16 / 3, exT: '16/3', win: {xmin: -0.4, xmax: 4.5, ymin: -0.4, ymax: 2.6, equal: false}},
  {t: 'y = sin x on [0, π]', f: Math.sin, a: 0, b: Math.PI, ex: 2, exT: '2', win: {xmin: -0.4, xmax: 3.6, ymin: -0.3, ymax: 1.4, equal: false}},
  {t: 'y = (x − 1)² + 1 on [0, 3]', f: x => (x - 1) ** 2 + 1, a: 0, b: 3, ex: 6, exT: '6', win: {xmin: -0.4, xmax: 3.4, ymin: -0.5, ymax: 5.6, equal: false}}
];
const RULE = {left: 'left endpoints', right: 'right endpoints', mid: 'midpoints'};
CA.lab('area-lab', {
  controls: [{type: 'select', key: 'p', label: 'Region', value: '0', options: AR.map((r, i) => [String(i), r.t])}, {type: 'seg', key: 'rule', label: 'Heights from', value: 'right', options: Object.entries(RULE)},
    {type: 'range', key: 'n', label: 'Rectangles n =', min: 1, max: 100, step: 1, value: 4}],
  plot: {w: 540, h: 380}, plotLabel: 'Region under a curve with approximating rectangles', readouts: [['dx', 'Δx = (b − a)/n'], ['s', 'Sum of rectangle areas'], ['ex', 'Exact area'], ['err', 'Error']], bottom: '<div id="area-table"></div>'
}, (lab, st) => {
  const A = AR[+st.p], n = st.n, R = CA.riemann(A.f, A.a, A.b, n, st.rule), P = lab.plane(A.win);
  CA.shade(P, A.f, A.a, A.b, {color: 'green', fillOpacity: 0.12}); CA.drawRects(P, R, {color: st.rule === 'left' ? 'orange' : st.rule === 'right' ? 'purple' : 'blue', fillOpacity: 0.26});
  P.curve(A.f, {color: 'text', width: 3, from: A.a - 0.3, to: A.b + 0.3}).render();
  lab.read('dx', num(R.dx, 5)); lab.read('s', num(R.sum, 6)); lab.read('ex', `${A.exT} ≈ ${num(A.ex, 6)}`); lab.read('err', num(Math.abs(R.sum - A.ex), 6));
  const ns = [4, 8, 16, 32, 64, 128, 1000];
  document.getElementById('area-table').innerHTML = `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>n</th>${ns.map(k => `<th>${k}</th>`).join('')}</tr><tr><th>sum (${RULE[st.rule]})</th>${ns.map(k => `<td>${num(CA.riemann(A.f, A.a, A.b, k, st.rule).sum, 5)}</td>`).join('')}</tr></table></div>`;
  lab.out(n < 20 ? `With n = ${n} rectangles the estimate is ${num(R.sum, 4)}. Increase n: the gaps and overlaps shrink.` : `With n = ${n} narrow rectangles the estimate ${num(R.sum, 5)} is within ${num(Math.abs(R.sum - A.ex), 3)} of the exact area. As n → ∞ the sums approach the area.`, n >= 20 ? 'ca-correct' : '');
});

/* ---------- 04 · which problem? ---------- */
CA.cards('app-cards', [
  {expr: 'The speed of a car at exactly 2:15 PM', correct: 0, why: 'An instantaneous rate: a tangent slope (derivative).'},
  {expr: 'The distance traveled from 1 PM to 3 PM, given the speed at every moment', correct: 1, why: 'Total accumulation: an area under the speed graph (integral).'},
  {expr: 'The dimensions of a box with the largest volume', correct: 0, why: 'Optimization: maxima and minima come from derivatives.'},
  {expr: 'The volume of a vase with a curved profile', correct: 1, why: 'Volumes are found by adding up thin slices: integrals.'}
], {options: ['tangent problem', 'area problem']});

/* ---------- guided problems ---------- */
CA.guided('21', [
  {q: 'The slope of the secant line of f(x) = x² through x = 1 and x = 3 is:', opts: ['4', '8', '2', '6'], correct: 0, hint: '(f(3) − f(1))/(3 − 1).', why: '(9 − 1)/2 = 4.', ref: {panel: 'tangent', what: 'secant slopes', body: '<p>m<sub>sec</sub> = (f(a + h) − f(a))/h.</p>'}},
  {q: 'For f(x) = x², the secant slope through x = 1 and x = 1 + h simplifies to:', opts: ['2 + h', '2h', '1 + h', 'h²'], correct: 0, hint: '(1 + h)² − 1 = 2h + h².', why: '(2h + h²)/h = 2 + h for h ≠ 0.'},
  {q: 'As h → 0, the secant slopes 2 + h approach:', opts: ['2', '0', '1', 'they do not approach a number'], correct: 0, hint: 'Let h get close to 0.', why: '2 + h → 2: the tangent slope at (1, 1).'},
  {q: 'For f(x) = x³, the secant slope through x = 0 and x = 2 is:', opts: ['4', '8', '2', '6'], correct: 0, hint: '(8 − 0)/(2 − 0).', why: '8/2 = 4.'},
  {q: 's(t) = −16t² + 64t. The average velocity on [0, 2] is:', opts: ['32 ft/s', '64 ft/s', '0 ft/s', '16 ft/s'], correct: 0, hint: '(s(2) − s(0))/2.', why: 's(2) = 64 and s(0) = 0, so 64/2 = 32.', ref: {panel: 'velocity', what: 'the ball thrown upward', body: '<p>s(t) = −16t² + 64t; average velocity (s(b) − s(a))/(b − a).</p>'}},
  {q: 'For the same ball, the velocity at t = 2 is 0. What does that mean?', opts: ['The ball is at its highest point.', 'The ball hits the ground.', 'The ball has not moved.', 'The ball is falling fastest.'], correct: 0, hint: 'Look at the graph at t = 2.', why: 'At the top the ball stops rising and starts falling.'},
  {q: 'Two right-endpoint rectangles for y = x² on [0, 2] give:', opts: ['5', '1', '4', '2.5'], correct: 0, hint: 'Δx = 1; heights f(1) and f(2).', why: '1·1 + 1·4 = 5.', ref: {panel: 'area', what: 'rectangle approximations', body: '<p>Sum of f(xᵢ)·Δx over the rectangles.</p>'}},
  {q: 'For an increasing function, right-endpoint rectangles:', opts: ['overestimate the area', 'underestimate the area', 'give the exact area', 'can do either'], correct: 0, hint: 'The right end is the highest point of each strip.', why: 'Each rectangle reaches above the curve.'},
  {q: 'Finding the total distance from a velocity graph is an example of:', opts: ['the area problem', 'the tangent problem', 'neither', 'both'], correct: 0, hint: 'Distance = rate × time, added up.', why: 'Adding up velocity × time over small intervals is an area.'}
]);
})();
