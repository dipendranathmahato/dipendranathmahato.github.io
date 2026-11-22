/* Section 3.4 · Derivatives as Rates of Change — interactive activities */
(() => {
'use strict';
const {num} = CA;

/* ---------- 01 · amount of change ---------- */
const CHG = [
  {t: 'f(x) = x² + 2x, a = 3', f: x => x * x + 2 * x, df: x => 2 * x + 2, a: 3, win: {xmin: 0, xmax: 6, ymin: -2, ymax: 40}},
  {t: 'f(x) = √x, a = 9', f: x => Math.sqrt(Math.max(0, x)), df: x => 0.5 / Math.sqrt(x), a: 9, hs: 3, win: {xmin: 0, xmax: 16, ymin: -0.5, ymax: 4.5}},
  {t: 'P(t) = 1000e^(0.05t) (population), a = 10', f: t => 1000 * Math.exp(0.05 * t), df: t => 50 * Math.exp(0.05 * t), a: 10, hs: 5, win: {xmin: 0, xmax: 20, ymin: 900, ymax: 2900, xname: 't', yname: 'P'}},
  {t: 'f(x) = 1/x, a = 2', f: x => 1 / x, df: x => -1 / (x * x), a: 2, lo: 0.4, win: {xmin: 0.3, xmax: 5, ymin: -0.2, ymax: 2.5}}
];
CA.lab('change-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function and a', value: '0', options: CHG.map((c, i) => [String(i), c.t])}, {type: 'range', key: 'h', label: 'Change in x: h =', min: -2, max: 2, step: 0.05, value: 1, fmt: v => num(v, 2)}],
  plot: {w: 540, h: 360}, plotLabel: 'Actual change along the curve versus the change along the tangent line', legend: [['blue', 'y = f(x)'], ['green', 'tangent line at a']],
  readouts: [['act', 'actual change f(a + h) − f(a)'], ['est', 'estimate f′(a)·h'], ['err', 'difference'], ['avg', 'average rate']]
}, (lab, st) => {
  const C = CHG[+st.p], a = C.a, h = Math.max(st.h * (C.hs || 1), (C.lo ?? -Infinity) - a), f = C.f, m = C.df(a), P = lab.plane(Object.assign({equal: false}, C.win));
  const act = f(a + h) - f(a), est = m * h;
  P.curve(f, {color: 'blue', width: 3.2}).lineMB(m, f(a) - m * a, {color: 'green', width: 2});
  P.seg(a, f(a), a + h, f(a), {color: 'gray', dash: '4 4', width: 1.4}).seg(a + h, f(a), a + h, f(a + h), {color: 'blue', width: 3}).seg(a + h + (C.win.xmax - C.win.xmin) * 0.012, f(a), a + h + (C.win.xmax - C.win.xmin) * 0.012, f(a) + est, {color: 'green', width: 3});
  P.point(a, f(a), {color: 'orange', r: 7}).point(a + h, f(a + h), {color: 'blue', r: 5}).render();
  lab.read('act', num(act, 5)); lab.read('est', num(est, 5)); lab.read('err', num(act - est, 4)); lab.read('avg', num(act / h, 5));
  lab.out(`The blue segment is the actual change; the green one is the estimate f′(a)h with f′(a) = ${num(m, 4)}. The smaller |h|, the better the estimate.`);
});

/* ---------- 02 · motion ---------- */
const MO = [
  {t: 's(t) = 4t/(t² + 4), t ≥ 0', s: t => 4 * t / (t * t + 4), v: t => -4 * (t * t - 4) / (t * t + 4) ** 2, a: t => 8 * t * (t * t - 12) / (t * t + 4) ** 3, T: 8, vT: '−4(t² − 4)/(t² + 4)²', aT: '8t(t² − 12)/(t² + 4)³'},
  {t: 's(t) = t³ − 9t² + 24t', s: t => t ** 3 - 9 * t * t + 24 * t, v: t => 3 * t * t - 18 * t + 24, a: t => 6 * t - 18, T: 6, vT: '3t² − 18t + 24 = 3(t − 2)(t − 4)', aT: '6t − 18'},
  {t: 's(t) = −16t² + 64t (thrown ball)', s: t => -16 * t * t + 64 * t, v: t => -32 * t + 64, a: () => -32, T: 4, vT: '−32t + 64', aT: '−32'},
  {t: 's(t) = 2 sin t', s: t => 2 * Math.sin(t), v: t => 2 * Math.cos(t), a: t => -2 * Math.sin(t), T: 2 * Math.PI, vT: '2 cos t', aT: '−2 sin t'}
];
const zeros = (f, a, b) => { const z = [], n = 3000; for (let i = 0; i < n; i++) { const x0 = a + (b - a) * i / n, x1 = a + (b - a) * (i + 1) / n, y0 = f(x0), y1 = f(x1); if (Math.abs(y0) < 1e-12 && i > 0) z.push(x0); else if (y0 * y1 < 0) { let l = x0, r = x1; for (let k = 0; k < 50; k++) { const m = (l + r) / 2; if (f(l) * f(m) <= 0) r = m; else l = m; } z.push((l + r) / 2); } } return z.filter((v, i, A) => !i || Math.abs(v - A[i - 1]) > 1e-6); };
const tT = t => { const k = CA.simpleFrac(t / Math.PI, 12); if (k && Math.abs(t) > 1e-9) return CA.piStr(k); if (Math.abs(t - 2 * Math.sqrt(3)) < 1e-6) return '2√3'; return num(t, 3); };
const behav = (v, a) => Math.abs(v) < 1e-9 ? 'at rest' : Math.abs(a) < 1e-9 ? 'constant speed' : v * a > 0 ? 'speeding up' : 'slowing down';
const mot = CA.lab('motion-lab', {
  controls: [{type: 'select', key: 'p', label: 'Position function', value: '0', options: MO.map((m, i) => [String(i), m.t])}, {type: 'range', key: 'u', label: 'Time t', min: 0, max: 1000, step: 1, value: 125, fmt: () => ''},
    {type: 'check', key: 'play', label: 'Play', value: false}],
  top: '<svg id="motion-track" role="img" aria-label="The particle on its track"></svg>',
  plot: {w: 560, h: 240}, plotLabel: 'Position against time', legend: [['blue', 's(t)'], ['purple', 'v(t) (lower graph)'], ['green', 'a(t) (lower graph)', true]],
  middle: '<svg id="motion-va" role="img" aria-label="Velocity and acceleration against time"></svg>', readouts: [['t', 't'], ['s', 's(t)'], ['v', 'v(t)'], ['sp', 'speed |v|'], ['a', 'a(t)'], ['d', 'moving'], ['b', 'speed is']],
  bottom: '<div id="motion-table"></div>'
}, (lab, st, key) => {
  const M = MO[+st.p], T = M.T, t = T * st.u / 1000, s = M.s(t), v = M.v(t), a = M.a(t);
  const smin = Math.min(...Array.from({length: 201}, (_, i) => M.s(T * i / 200))), smax = Math.max(...Array.from({length: 201}, (_, i) => M.s(T * i / 200))), pad = (smax - smin) * 0.08 || 1;
  const tr = new CA.Plane(document.getElementById('motion-track'), {xmin: smin - pad, xmax: smax + pad, ymin: -1, ymax: 1, w: 560, h: 90, equal: false, grid: false, tools: false, noY: true, xname: 's', yname: ''});
  tr.hline(0, {color: 'gray', width: 6}).point(s, 0, {color: 'orange', r: 10});
  if (Math.abs(v) > 1e-9) tr.seg(s, 0.55, s + Math.sign(v) * (smax - smin) * 0.12, 0.55, {color: 'purple', width: 3, arrow: true});
  tr.render();
  const P = lab.plane({xmin: 0, xmax: T, ...CA.fitY(M.s, 0, T), equal: false, xname: 't', yname: 's'});
  P.curve(M.s, {color: 'blue', width: 3.2, from: 0, to: T}).point(t, s, {color: 'orange', r: 7}).render();
  const svg2 = document.getElementById('motion-va'); CA.placeBelow(lab.svg, svg2);
  const Y = CA.fitY(x => Math.max(Math.abs(M.v(x)), Math.abs(M.a(x))), 0, T), lim = Math.max(Math.abs(Y.ymax), 0.5);
  const Q = new CA.Plane(svg2, {xmin: 0, xmax: T, ymin: -lim, ymax: lim, w: 560, h: 220, equal: false, xname: 't', yname: ''});
  Q.hline(0, {color: 'gray', width: 1}).curve(M.v, {color: 'purple', width: 3, from: 0, to: T}).curve(M.a, {color: 'green', width: 2.4, dash: '7 6', from: 0, to: T}).vline(t, {color: 'orange', width: 1.4, dash: '3 4'});
  Q.point(t, v, {color: 'purple', r: 6}).point(t, a, {color: 'green', r: 6}).render();
  lab.read('t', tT(t)); lab.read('s', num(s, 4)); lab.read('v', num(v, 4)); lab.read('sp', num(Math.abs(v), 4)); lab.read('a', num(a, 4));
  lab.read('d', Math.abs(v) < 1e-9 ? 'momentarily at rest' : v > 0 ? 'forward (s increasing)' : 'backward (s decreasing)'); lab.read('b', behav(v, a));
  // sign table
  const cuts = [0, ...zeros(M.v, 0, T), ...zeros(M.a, 0, T), T].sort((p, q) => p - q).filter((x, i, A) => !i || x - A[i - 1] > 1e-6);
  const rows = []; for (let i = 0; i < cuts.length - 1; i++) { const m = (cuts[i] + cuts[i + 1]) / 2, vv = M.v(m), aa = M.a(m); rows.push(`<tr><td>(${tT(cuts[i])}, ${tT(cuts[i + 1])}${i === cuts.length - 2 && +st.p === 0 ? ' and beyond' : ''})</td><td>${vv > 0 ? '+ forward' : '− backward'}</td><td>${aa > 0 ? '+ v increasing' : aa < 0 ? '− v decreasing' : '0'}</td><td><b>${behav(vv, aa)}</b></td></tr>`); }
  document.getElementById('motion-table').innerHTML = `<p class="ca-muted">v(t) = ${M.vT}, a(t) = ${M.aT}</p><div class="ca-scroll-x"><table class="ca-data-table"><tr><th>interval</th><th>sign of v</th><th>sign of a</th><th>speed</th></tr>${rows.join('')}</table></div>`;
  lab.out(`${Math.abs(v) < 1e-9 ? 'The particle is momentarily at rest and about to turn around.' : `Velocity ${num(v, 3)} and acceleration ${num(a, 3)} have ${v * a > 0 ? 'the same sign: the particle is <b>speeding up</b>' : 'opposite signs: the particle is <b>slowing down</b>'}.`}`);
  if (key === 'play' || key === 'p') { clearInterval(mot._timer); if (st.play) mot._timer = setInterval(() => { const nu = (mot.state.u + 4) % 1001; mot.state.set('u', nu); }, 40); }
});

/* ---------- 03 · marginal cost ---------- */
CA.lab('marginal-lab', {
  controls: [{type: 'range', key: 'x', label: 'Items produced x =', min: 10, max: 300, step: 1, value: 100}],
  plot: {xmin: 0, xmax: 320, ymin: 0, ymax: 4000, w: 540, h: 340, equal: false, xname: 'x', yname: 'C'}, plotLabel: 'Cost function', legend: [['blue', 'C(x) = 0.02x² + 5x + 300'], ['green', 'tangent line (slope = marginal cost)']],
  readouts: [['c', 'C(x)'], ['mc', 'marginal cost C′(x)'], ['ex', 'C(x + 1) − C(x)']]
}, (lab, st) => {
  const C = x => 0.02 * x * x + 5 * x + 300, dC = x => 0.04 * x + 5, x = st.x, P = lab.plane();
  P.curve(C, {color: 'blue', width: 3.2, from: 0, to: 320}).lineMB(dC(x), C(x) - dC(x) * x, {color: 'green', width: 2}).point(x, C(x), {color: 'orange', r: 7}).render();
  lab.read('c', '$' + num(C(x), 2)); lab.read('mc', '$' + num(dC(x), 2) + ' per item'); lab.read('ex', '$' + num(C(x + 1) - C(x), 2));
  lab.out(`Producing item number ${x + 1} costs about C′(${x}) = $${num(dC(x), 2)}; the exact extra cost is $${num(C(x + 1) - C(x), 2)}.`);
});

/* ---------- guided problems ---------- */
CA.guided('34', [
  {q: 'If f(4) = 10 and f′(4) = 3, estimate f(4.2).', opts: ['10.6', '10.2', '13', '12.6'], correct: 0, hint: 'f(a + h) ≈ f(a) + f′(a)h.', why: '10 + 3(0.2).', ref: {panel: 'change', what: 'estimating an amount of change', body: '<p>f(a + h) ≈ f(a) + f′(a)h.</p>'}},
  {q: 's(t) = t² − 6t. The velocity at t = 1 is:', opts: ['−4', '−5', '2', '4'], correct: 0, hint: 'v = 2t − 6.', why: '2 − 6 = −4.', ref: {panel: 'motion', what: 'position, velocity, and acceleration', body: '<p>v = s′, a = v′ = s″.</p>'}},
  {q: 'For s(t) = t² − 6t, the object moves backward when:', opts: ['0 &lt; t &lt; 3', 't &gt; 3', 't &lt; 6', 'never'], correct: 0, hint: 'v &lt; 0.', why: '2t − 6 &lt; 0 for t &lt; 3.'},
  {q: 'v(2) = −5 and a(2) = −3. At t = 2 the object is:', opts: ['speeding up', 'slowing down', 'at rest', 'moving forward'], correct: 0, hint: 'Compare the signs.', why: 'Same signs: speeding up.'},
  {q: 'v(1) = −5 and a(1) = 3. At t = 1:', opts: ['the velocity increases, but the object slows down', 'the object speeds up', 'the object moves forward', 'the speed is 3'], correct: 0, hint: 'a &gt; 0 makes v increase toward 0.', why: 'Opposite signs: slowing down.'},
  {q: 'For s(t) = 4t/(t² + 4), on 0 &lt; t &lt; 2 the object is:', opts: ['moving forward and slowing down', 'moving forward and speeding up', 'moving backward and slowing down', 'at rest'], correct: 0, hint: 'v &gt; 0 and a &lt; 0 there.', why: 'Opposite signs.'},
  {q: 'For the same object, on 2 &lt; t &lt; 2√3 it is:', opts: ['moving backward and speeding up', 'moving forward and slowing down', 'moving backward and slowing down', 'at rest'], correct: 0, hint: 'Both v and a are negative.', why: 'Same signs: speeding up.'},
  {q: 'The speed of an object with v(t) = −8 is:', opts: ['8', '−8', '0', '64'], correct: 0, hint: 'Speed = |v|.', why: '|−8| = 8.'},
  {q: 'C(x) = 0.02x² + 5x + 300. The marginal cost at x = 100 is:', opts: ['$9', '$5', '$700', '$0.04'], correct: 0, hint: 'C′(x) = 0.04x + 5.', why: '4 + 5 = 9.', ref: {panel: 'marginal', what: 'marginal cost', body: '<p>C(x + 1) − C(x) ≈ C′(x).</p>'}},
  {q: 'A ball has height s(t) = −16t² + 64t. Its acceleration is:', opts: ['−32 ft/s² at every time', '0 at the top', '64 ft/s²', '−16 ft/s²'], correct: 0, hint: 's″(t).', why: 'Gravity: a constant −32.'}
]);
})();
