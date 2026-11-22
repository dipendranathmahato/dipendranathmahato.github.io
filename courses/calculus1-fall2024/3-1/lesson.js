/* Section 3.1 · Defining the Derivative — interactive activities */
(() => {
'use strict';
const {num} = CA, PI = Math.PI;
const HS = [1, 0.5, 0.1, 0.01, 0.001];

/* ---------- 01 · difference quotient ---------- */
const DQ = [
  {t: 'f(x) = x² at a = 3', f: x => x * x, a: 3, aT: '3', m: 6, mT: '6', win: {xmin: 0, xmax: 5.5, ymin: -2, ymax: 28}},
  {t: 'f(x) = x³ at a = 1', f: x => x ** 3, a: 1, aT: '1', m: 3, mT: '3', win: {xmin: -1, xmax: 3, ymin: -3, ymax: 20}},
  {t: 'f(x) = √x at a = 4', f: Math.sqrt, a: 4, aT: '4', m: 0.25, mT: '1/4', win: {xmin: 0, xmax: 7, ymin: -0.3, ymax: 3}, lo: 0},
  {t: 'f(x) = 1/x at a = 2', f: x => 1 / x, a: 2, aT: '2', m: -0.25, mT: '−1/4', win: {xmin: 0, xmax: 4.5, ymin: -0.3, ymax: 2.5}, lo: 0.2},
  {t: 'f(x) = eˣ at a = 0', f: Math.exp, a: 0, aT: '0', m: 1, mT: '1', win: {xmin: -2.5, xmax: 2.5, ymin: -0.5, ymax: 8}},
  {t: 'f(x) = sin x at a = π/3', f: Math.sin, a: PI / 3, aT: 'π/3', m: 0.5, mT: '1/2', win: {xmin: -1, xmax: 3.4, ymin: -1.3, ymax: 1.5}}
];
const dq = CA.lab('dq-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function and point', value: '0', options: DQ.map((d, i) => [String(i), d.t])}, {type: 'range', key: 'h', label: 'h =', min: -1.5, max: 1.5, step: 0.01, value: 1, skip: [0], fmt: v => num(v, 2)},
    {type: 'seg', key: 'form', label: 'Form', value: 'h', options: [['h', '(f(a + h) − f(a))/h'], ['x', '(f(x) − f(a))/(x − a)']]}],
  plot: {w: 540, h: 380}, plotLabel: 'Secant line approaching the tangent line', legend: [['blue', 'y = f(x)'], ['purple', 'secant line'], ['green', 'tangent line (the limit)', true]],
  readouts: [['q', 'Difference quotient'], ['m', 'f′(a)']], bottom: '<div id="dq-table"></div>'
}, (lab, st) => {
  const D = DQ[+st.p], f = D.f, a = D.a; let h = st.h;
  if (D.lo !== undefined && a + h <= D.lo) { h = Math.round((D.lo - a + 0.05) * 100) / 100; st.set('h', h, true); }
  const x = a + h, q = (f(x) - f(a)) / h, P = lab.plane(Object.assign({equal: false}, D.win));
  P.curve(f, {color: 'blue', width: 3.2, from: D.lo ?? D.win.xmin}).lineMB(q, f(a) - q * a, {color: 'purple', width: 2.2}).lineMB(D.m, f(a) - D.m * a, {color: 'green', width: 2, dash: '7 6'});
  P.point(a, f(a), {color: 'orange', r: 7, label: `(${D.aT}, ${num(f(a), 3)})`}).point(x, f(x), {color: 'purple', r: 6}).render();
  lab.read('q', st.form === 'h' ? `(f(${D.aT} + ${num(h, 2)}) − f(${D.aT}))/${num(h, 2)} = ${num(q, 6)}` : `(f(${num(x, 3)}) − f(${D.aT}))/(${num(x, 3)} − ${D.aT}) = ${num(q, 6)}`);
  lab.read('m', Math.abs(h) < 0.02 ? D.mT : '…');
  document.getElementById('dq-table').innerHTML = `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>h</th>${HS.map(k => `<th>${k}</th><th>−${k}</th>`).join('')}</tr><tr><th>quotient</th>${HS.map(k => `<td>${num((f(a + k) - f(a)) / k, 6)}</td><td>${num((f(a - k) - f(a)) / -k, 6)}</td>`).join('')}</tr></table></div>`;
  lab.out(Math.abs(h) < 0.02 ? `The difference quotients approach <b>f′(${D.aT}) = ${D.mT}</b> from both sides.` : `As h → 0 (equivalently x → ${D.aT}) the quotients approach ${D.mT}. Shrink h to see it.`, Math.abs(h) < 0.02 ? 'ca-correct' : '');
});
CA.drag(dq.svg, x => { const D = DQ[+dq.state.p]; let h = Math.round((x - D.a) * 100) / 100; if (h === 0) h = 0.01; dq.state.set('h', Math.max(-1.5, Math.min(1.5, h))); });

/* ---------- 02 · from the definition ---------- */
CA.stepLab('def-steps', [
  {t: 'f(x) = x² at a = 3', res: 'f′(3) = 6', check: ['x^2', '2x', 3], steps: [['Definition', 'f′(3) = lim<sub>x→3</sub> (f(x) − f(3))/(x − 3)'], ['Substitute f', '= lim<sub>x→3</sub> (x² − 3²)/(x − 3)'], ['Factor (x − 3 ≠ 0)', '= lim<sub>x→3</sub> (x + 3)(x − 3)/(x − 3)'], ['Cancel and substitute', '= lim<sub>x→3</sub> (x + 3) = 6']]},
  {t: 'f(x) = x² + 2x at a = 1 (h form)', res: 'f′(1) = 4', check: ['x^2 + 2x', '2x + 2', 1], steps: [['Definition', 'f′(1) = lim<sub>h→0</sub> (f(1 + h) − f(1))/h'], ['Expand', 'f(1 + h) = 1 + 2h + h² + 2 + 2h = 3 + 4h + h², and f(1) = 3'], ['Simplify', '(4h + h²)/h = 4 + h for h ≠ 0'], ['Take the limit', 'lim<sub>h→0</sub> (4 + h) = 4']]},
  {t: 'f(x) = 1/x at a = 2', res: 'f′(2) = −1/4', check: ['1/x', '-1/x^2', 2], steps: [['Definition', 'f′(2) = lim<sub>h→0</sub> (1/(2 + h) − 1/2)/h'], ['Common denominator', '(2 − (2 + h))/(2(2 + h)) = −h/(2(2 + h))'], ['Divide by h', '−1/(2(2 + h))'], ['Take the limit', '−1/(2 · 2) = −1/4']]},
  {t: 'f(x) = √x at a = 4', res: 'f′(4) = 1/4', check: ['sqrt(x)', '1/(2sqrt(x))', 4], steps: [['Definition', 'f′(4) = lim<sub>x→4</sub> (√x − 2)/(x − 4)'], ['Multiply by the conjugate', '(√x − 2)(√x + 2)/((x − 4)(√x + 2)) = (x − 4)/((x − 4)(√x + 2))'], ['Cancel', '1/(√x + 2)'], ['Take the limit', '1/(2 + 2) = 1/4']]},
  {t: 'f(x) = x³ at a general point a', res: 'f′(a) = 3a²', check: ['x^3', '3x^2', 1.3], steps: [['Definition', 'f′(a) = lim<sub>x→a</sub> (x³ − a³)/(x − a)'], ['Difference of cubes', 'x³ − a³ = (x − a)(x² + ax + a²)'], ['Cancel', 'x² + ax + a²'], ['Take the limit', 'a² + a² + a² = 3a²']]},
  {t: 'f(x) = eˣ, using lim (eʰ − 1)/h = 1', res: 'f′(x) = eˣ', check: ['e^x', 'e^x', 0.7], note: 'eˣ is its own derivative.', steps: [['Definition', 'f′(x) = lim<sub>h→0</sub> (e<sup>x + h</sup> − eˣ)/h'], ['Factor out eˣ', '= lim<sub>h→0</sub> eˣ(eʰ − 1)/h'], ['eˣ does not depend on h', '= eˣ · lim<sub>h→0</sub> (eʰ − 1)/h'], ['Use the given limit', '= eˣ · 1 = eˣ']]}
]);

/* ---------- 03 · tangent lines ---------- */
CA.tangentLineLab('tl-lab', [
  {t: 'f(x) = x² at x = 3', f: x => x * x, df: x => 2 * x, a: 3, ptT: '(3, 9)', mT: 'f′(3) = 6', eqT: 'y = 6x − 9', win: {xmin: -1, xmax: 5.5, ymin: -10, ymax: 30},
    steps: [['Point', 'f(3) = 9, so the point is (3, 9)'], ['Slope', 'f′(3) = 6'], ['Point-slope form', 'y − 9 = 6(x − 3)'], ['Slope-intercept form', 'y = 6x − 18 + 9 = 6x − 9']]},
  {t: 'f(x) = x³ − 2x at x = 1', f: x => x ** 3 - 2 * x, df: x => 3 * x * x - 2, a: 1, ptT: '(1, −1)', mT: 'f′(1) = 1', eqT: 'y = x − 2', win: {xmin: -2.5, xmax: 2.5, ymin: -5, ymax: 5},
    steps: [['Point', 'f(1) = 1 − 2 = −1'], ['Slope', 'f(1 + h) − f(1) = h + 3h² + h³, so f′(1) = lim<sub>h→0</sub> (1 + 3h + h²) = 1'], ['Point-slope form', 'y + 1 = 1(x − 1)'], ['Slope-intercept form', 'y = x − 2']]},
  {t: 'f(x) = √x at x = 4', f: Math.sqrt, df: x => 0.5 / Math.sqrt(x), a: 4, ptT: '(4, 2)', mT: 'f′(4) = 1/4', eqT: 'y = x/4 + 1', win: {xmin: -1, xmax: 9, ymin: -0.5, ymax: 4},
    steps: [['Point', '(4, 2)'], ['Slope', 'f′(4) = 1/4 (computed in activity 02)'], ['Point-slope form', 'y − 2 = (1/4)(x − 4)'], ['Slope-intercept form', 'y = x/4 + 1']]},
  {t: 'f(x) = 1/x at x = 2', f: x => 1 / x, df: x => -1 / (x * x), a: 2, ptT: '(2, 1/2)', mT: 'f′(2) = −1/4', eqT: 'y = −x/4 + 1', win: {xmin: -0.5, xmax: 5, ymin: -0.5, ymax: 3}, br: [0],
    steps: [['Point', '(2, 1/2)'], ['Slope', 'f′(2) = −1/4'], ['Point-slope form', 'y − 1/2 = −(1/4)(x − 2)'], ['Slope-intercept form', 'y = −x/4 + 1']]},
  {t: 'f(x) = eˣ at x = 0', f: Math.exp, df: Math.exp, a: 0, ptT: '(0, 1)', mT: 'f′(0) = 1', eqT: 'y = x + 1', win: {xmin: -3, xmax: 2.5, ymin: -1, ymax: 7},
    steps: [['Point', 'e⁰ = 1, so (0, 1)'], ['Slope', 'f′(0) = e⁰ = 1'], ['Point-slope form', 'y − 1 = 1(x − 0)'], ['Slope-intercept form', 'y = x + 1']]}
]);

/* ---------- 04 · units ---------- */
CA.cards('rate-cards', [
  {expr: 's(t) = position in meters after t seconds. s′(4) is measured in', options: ['meters per second', 'seconds per meter', 'meters', 'meters·seconds'], correct: 0, why: 'units of s per unit of t.'},
  {expr: 'C(x) = cost in dollars of x shirts. C′(100) = 6.5 means', options: ['the 101st shirt costs about $6.50', '100 shirts cost $6.50', 'the cost is falling', 'each shirt costs $100'], correct: 0, why: 'the cost grows at about $6.50 per extra shirt when x = 100.'},
  {expr: 'T(h) = temperature in °C at altitude h km. T′(2) = −6.5 means', options: ['temperature drops about 6.5 °C per km near 2 km', 'it is −6.5 °C at 2 km', 'the altitude is falling', 'temperature rises 6.5 °C'], correct: 0, why: 'a negative rate: T decreases as h increases.'},
  {expr: 'V(t) = liters of water in a tank after t minutes. V′(2) is measured in', options: ['liters per minute', 'minutes per liter', 'liters', 'liters per minute²'], correct: 0, why: 'units of V per unit of t.'}
]);

/* ---------- guided problems ---------- */
CA.guided('31', [
  {q: 'The average rate of change of f(x) = x² from x = 1 to x = 4 is:', opts: ['5', '15', '3', '8'], correct: 0, hint: '(f(4) − f(1))/(4 − 1).', why: '(16 − 1)/3 = 5.', ref: {panel: 'definition', what: 'average rate of change', body: '<p>(f(b) − f(a))/(b − a), the slope of a secant line.</p>'}},
  {q: 'Which limit equals f′(a)?', opts: ['lim<sub>h→0</sub> (f(a + h) − f(a))/h', 'lim<sub>h→0</sub> (f(a + h) − f(a))', 'lim<sub>x→a</sub> f(x)/x', 'lim<sub>h→0</sub> f(h)/h'], correct: 0, hint: 'A slope is a quotient.', why: 'The limit of secant slopes.'},
  {q: 'For f(x) = x², the quotient (f(3 + h) − f(3))/h simplifies to:', opts: ['6 + h', '6h', '9 + h', '3 + h'], correct: 0, hint: '(3 + h)² − 9 = 6h + h².', why: 'Divide by h.', ref: {panel: 'from-definition', what: 'f′(3) for f(x) = x²', body: '<p>(x² − 9)/(x − 3) = x + 3 → 6.</p>'}},
  {q: 'Using the definition, f′(2) for f(x) = 3x − 7 is:', opts: ['3', '−1', '6', '−7'], correct: 0, hint: '(3(2 + h) − 7 − (−1))/h.', why: '3h/h = 3: a line has constant slope.'},
  {q: 'For f(x) = 4x², f′(1) = ?', opts: ['8', '4', '2', '16'], correct: 0, hint: '4((1 + h)² − 1)/h = 4(2 + h).', why: '4(2 + h) → 8.'},
  {q: 'The tangent line to f(x) = x² at x = 3 is:', opts: ['y = 6x − 9', 'y = 6x + 9', 'y = 3x', 'y = 9x − 18'], correct: 0, hint: 'Point (3, 9), slope 6.', why: 'y − 9 = 6(x − 3).', ref: {panel: 'tangent-line', what: 'the tangent line formula', body: '<p>y − f(a) = f′(a)(x − a).</p>'}},
  {q: 'If f(2) = 5 and f′(2) = −3, the tangent line at x = 2 is:', opts: ['y = −3x + 11', 'y = 5x − 3', 'y = −3x + 5', 'y = −3x − 1'], correct: 0, hint: 'y − 5 = −3(x − 2).', why: 'y = −3x + 6 + 5.'},
  {q: 'lim<sub>h→0</sub> ((2 + h)³ − 8)/h is f′(a) for:', opts: ['f(x) = x³, a = 2', 'f(x) = x³, a = 8', 'f(x) = 2x³, a = 0', 'f(x) = x², a = 2'], correct: 0, hint: 'Match (f(a + h) − f(a))/h.', why: 'f(2 + h) = (2 + h)³ and f(2) = 8.'},
  {q: 'A balloon’s volume V (cm³) after t s satisfies V′(3) = 12. This means:', opts: ['at t = 3 the volume grows about 12 cm³ per second', 'V(3) = 12', 'the volume is 12 cm³ after 3 s', 'the volume grows 3 cm³ per 12 s'], correct: 0, hint: 'Units of V′ are cm³/s.', why: 'An instantaneous rate of change.', ref: {panel: 'rate', what: 'units of a derivative', body: '<p>f′ has units of f per unit of x.</p>'}},
  {q: 'For f(x) = 1/x, f′(1) = ?', opts: ['−1', '1', '0', '−1/2'], correct: 0, hint: '(1/(1 + h) − 1)/h = −1/(1 + h).', why: '→ −1.'}
]);
})();
