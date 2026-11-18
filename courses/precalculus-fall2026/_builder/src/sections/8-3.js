/* Section 8.3 · Polar Coordinates — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Rad, toDeg, toRad} = CA;
const PI = Math.PI, $ = id => document.getElementById(id);
const exact = (fn, A) => { if (A.kind !== 'pi') return null; const d = A.f.v * 180; return Number.isInteger(Math.round(d * 1e9) / 1e9) ? CA.exact(fn, Math.round(d)) : null; };
const inQ = d => { const q = CA.quadName(d); return q.startsWith('on') ? q : 'in ' + q; }, par = t => String(t).startsWith('−') ? `(${t})` : t;
const rStr = r => { const f = CA.simpleFrac(r, 12); return f ? f.toString() : num(r, 3); };

/* ---------- 01 · plotting ---------- */
const PP = [['4', '2π/3', 'Example 1 (i) · A(4, 2π/3)'], ['-3', '7π/6', 'Example 1 (ii) · B(−3, 7π/6)'], ['5', '-π/4', '(5, −π/4)'], ['-2', 'π', '(−2, π)'], ['3', '-5π/6', '(3, −5π/6)']];
CA.lab('pp-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Point', value: '1', options: PP.map((p, i) => [String(i), p[2]]).concat([['own', 'Set your own']])}, {type: 'range', key: 'r', label: 'r =', min: -5, max: 5, step: 0.5, value: -3}, {type: 'text', key: 't', label: 'θ =', value: '7π/6'}],
  plot: {xmin: -6, xmax: 6, ymin: -6, ymax: 6, labels: false, grid: false, w: 520, h: 520}, plotLabel: 'Polar grid with a plotted point', readouts: [['rt', '(r, θ)'], ['xy', '(x, y)'], ['alt', 'Other names']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = PP[+st.pre]; st.set('r', +p[0], true); st.set('t', p[1], true); } else if (key && key !== 'pre') st.set('pre', 'own', true);
  const A = CA.parseAngle(st.t, 'rad'), P = lab.plane(); CA.polarGrid(P, 5);
  if (!A) { P.render(); lab.out('Type θ in radians, such as 7π/6 or −π/4.', 'ca-incorrect'); return; }
  const th = A.v, r = st.r, tx = A.kind === 'pi' ? CA.piStr(A.f) : fmt(A.v);
  P.seg(0, 0, 5.4 * Math.cos(th), 5.4 * Math.sin(th), {color: 'orange', width: 2.2, dash: '6 5'}).param(t => 0.7 * Math.cos(t), t => 0.7 * Math.sin(t), 0, th, {color: 'orange', width: 2.4, arrow: true});
  if (r < 0) P.seg(0, 0, 5.4 * Math.cos(th + PI), 5.4 * Math.sin(th + PI), {color: 'blue', width: 2, dash: '3 4'});
  const x = r * Math.cos(th), y = r * Math.sin(th);
  if (r !== 0) P.seg(0, 0, x, y, {color: r < 0 ? 'blue' : 'orange', width: 4});
  P.point(x, y, {color: 'green', r: 8, label: `(${fmt(r)}, ${tx})`, labelOpt: {size: 12.5}}).render();
  const ex = exact('cos', A), ey = exact('sin', A), X = ex ? ex.mul(Frac_(r)) : null, Y = ey ? ey.mul(Frac_(r)) : null;
  lab.read('rt', `(${fmt(r)}, ${tx})`); lab.read('xy', X ? `(${X.html()}, ${Y.html()})` : `(${num(x, 3)}, ${num(y, 3)})`);
  const alt2 = A.kind === 'pi' ? CA.piStr(A.f.add(F(2, 1))) : num(th + 2 * PI, 3), altN = A.kind === 'pi' ? CA.piStr(A.f.add(F(1, 1))) : num(th + PI, 3);
  lab.read('alt', `(${fmt(r)}, ${alt2}), (${fmt(-r)}, ${altN})`);
  lab.steps([['Turn', `θ = ${tx}: ${th >= 0 ? 'counterclockwise' : 'clockwise'} from the polar axis, ending ${Math.abs(th) < 1e-12 ? 'on the polar axis' : inQ(toDeg(th))}`], ['Walk', r > 0 ? `r = ${fmt(r)} &gt; 0: walk ${fmt(r)} units along the terminal side` : r < 0 ? `r = ${fmt(r)} &lt; 0: walk ${fmt(-r)} units along the opposite ray (blue)` : 'r = 0: the point is the pole'], ['Rectangular check', `x = r cos θ ≈ ${num(x, 3)}, y = r sin θ ≈ ${num(y, 3)}`]]);
  lab.out(r < 0 ? `Because r is negative, the point lands on the ray opposite θ's terminal side, ${inQ(toDeg(th + PI))}.` : `The point is ${fmt(r)} units from the pole along the ray at ${tx}.`);
});
function Frac_(r) { const f = CA.simpleFrac(r, 12); return f || r; }

/* ---------- 02 · polar to rectangular ---------- */
const PR = [['-4', '3π/2', 'Example 2 · (−4, 3π/2)'], ['5', '-5π/3', 'Checkpoint 2 · (5, −5π/3)'], ['-1/2', '2', 'Checkpoint 2 · (−1/2, 2)'], ['6', '5π/4', '(6, 5π/4)']];
CA.lab('pr-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Point', value: '0', options: PR.map((p, i) => [String(i), p[2]]).concat([['own', 'Set your own']])}, {type: 'text', key: 'r', label: 'r =', value: '-4'}, {type: 'text', key: 't', label: 'θ =', value: '3π/2'}],
  plot: {xmin: -7, xmax: 7, ymin: -7, ymax: 7, w: 480, h: 440}, plotLabel: 'Polar point and its rectangular coordinates', readouts: [['xy', '(x, y)']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = PR[+st.pre]; st.set('r', p[0], true); st.set('t', p[1], true); } else if (key && key !== 'pre') st.set('pre', 'own', true);
  const R = CA.parseVal(st.r), A = CA.parseAngle(st.t, 'rad'), P = lab.plane();
  if (!R || !A) { P.render(); lab.out('Type r as a number (such as −4 or −1/2) and θ in radians (such as 3π/2 or 2).', 'ca-incorrect'); return; }
  const r = R.v, th = A.v, x = r * Math.cos(th), y = r * Math.sin(th), ex = exact('cos', A), ey = exact('sin', A), rq = R.frac || CA.simpleFrac(r, 12);
  const X = ex && rq ? ex.mul(rq) : null, Y = ey && rq ? ey.mul(rq) : null, tx = A.kind === 'pi' ? CA.piStr(A.f) : fmt(A.v);
  P.seg(0, 0, x, 0, {color: 'blue', width: 3}).seg(x, 0, x, y, {color: 'green', width: 3}).seg(0, 0, x, y, {color: 'orange', width: 2.4}).point(x, y, {color: 'orange', r: 7, label: X ? `(${X.str()}, ${Y.str()})` : `(${num(x, 3)}, ${num(y, 3)})`}).render();
  lab.read('xy', X ? `(${X.html()}, ${Y.html()})` : `≈ (${num(x, 4)}, ${num(y, 4)})`);
  lab.steps([['x = r cos θ', `x = ${par(R.str)} · cos(${tx}) ${ex ? `= ${par(R.str)} · ${par(ex.str())} = ${X.str()}` : `≈ ${par(R.str)} · ${par(num(Math.cos(th), 4))} ≈ ${num(x, 4)}`}`], ['y = r sin θ', `y = ${par(R.str)} · sin(${tx}) ${ey ? `= ${par(R.str)} · ${par(ey.str())} = ${Y.str()}` : `≈ ${par(R.str)} · ${par(num(Math.sin(th), 4))} ≈ ${num(y, 4)}`}`]]);
  lab.out(`(r, θ) = (${R.str}, ${tx}) is the rectangular point <b>${X ? `(${X.str()}, ${Y.str()})` : `(${num(x, 4)}, ${num(y, 4)})`}</b>${A.kind !== 'pi' ? ' (θ = ' + fmt(A.v) + ' radians is not a special angle, so the values are decimals)' : ''}.`, 'ca-correct');
});

/* ---------- 03 · rectangular to polar ---------- */
const RP = [[4, -2, 'Example 3 (i) · (4, −2)'], [-5, -6, 'Example 3 (ii) · (−5, −6)'], [7, 5, 'Checkpoint 3 · (7, 5)'], [-3, 1, 'Checkpoint 3 · (−3, 1)'], [-2, -6, 'Checkpoint 3 · (−2, −6)'], [9, -4, 'Checkpoint 3 · (9, −4)']];
let XY = [4, -2];
const rp = CA.lab('rp-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Point', value: '0', options: RP.map((p, i) => [String(i), p[2]]).concat([['own', 'Drag your own']])}],
  plot: {xmin: -10, xmax: 10, ymin: -8, ymax: 8, w: 560, h: 440}, plotLabel: 'Rectangular point and its polar coordinates', readouts: [['r', 'r'], ['p1', 'Polar (r > 0)'], ['p2', 'Polar (r < 0)'], ['deg', 'In degrees']], steps: true,
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag the point (it snaps to the grid).</p>'
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = RP[+st.pre]; XY = [p[0], p[1]]; }
  const [x, y] = XY, P = lab.plane(), R = Rad.sqrt(x * x + y * y), t0 = x !== 0 ? Math.atan(y / x) : (y >= 0 ? PI / 2 : -PI / 2), q = x === 0 && y === 0 ? 'origin' : CA.quadrant(CA.norm360(toDeg(Math.atan2(y, x))));
  const fix = x < 0 ? t0 + PI : t0, d0 = toDeg(t0), dfix = toDeg(fix), where = q === 'origin' ? 'the pole' : q.length <= 3 ? 'in Quadrant ' + q : 'on the ' + q;
  P.param(t => Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1, dash: '3 4'}).seg(0, 0, x, y, {color: 'orange', width: 3}).param(t => 1.2 * Math.cos(t), t => 1.2 * Math.sin(t), 0, Math.atan2(y, x), {color: 'purple', width: 2.4, arrow: true});
  if (x < 0) P.seg(0, 0, 9 * Math.cos(t0), 9 * Math.sin(t0), {color: 'blue', width: 1.8, dash: '6 5'});
  P.point(x, y, {color: 'orange', r: 8, label: `(${fmt(x)}, ${fmt(y)})`}).render();
  lab.read('r', R.html()); lab.read('p1', `(${R.str()}, ≈ ${num(fix, 2)})`); lab.read('p2', x < 0 ? `(−${R.str()}, ≈ ${num(t0, 2)})` : `(−${R.str()}, ≈ ${num(t0 + PI, 2)})`); lab.read('deg', `θ ≈ ${num(dfix, 2)}° (r &gt; 0)`);
  lab.steps([['r² = x² + y²', `r² = ${x < 0 ? `(${fmt(x)})` : fmt(x)}² + ${y < 0 ? `(${fmt(y)})` : fmt(y)}² = ${x * x + y * y} ⟹ r = ${R.str()}`], ['tan θ = y/x', x === 0 ? 'x = 0: θ = ±π/2' : `θ = tan⁻¹(${fmt(y)}/${fmt(x)}) ≈ ${num(t0, 2)} rad ≈ ${num(d0, 2)}°`],
    ['Check the quadrant', q === 'origin' ? 'the pole: r = 0 and any θ works' : x < 0 ? `(${fmt(x)}, ${fmt(y)}) is ${where}, but tan⁻¹ gave an angle ${t0 === 0 ? 'on the positive x-axis' : 'in Quadrant ' + (t0 > 0 ? 'I' : 'IV')} (blue dashed). Add π: θ ≈ ${num(fix, 2)}, or keep θ and use r = −${R.str()}` : `tan⁻¹ already points ${q.length <= 3 ? 'into Quadrant ' + q : 'along the ' + q}`]]);
  lab.out(`One polar name is <b>(${R.str()}, ${num(fix, 2)})</b>. Adding 2π to the angle, or using −r with the angle plus π, gives other names for the same point.`, 'ca-correct');
});
let dragOn = false;
CA.drag(rp.svg, (x, y, ph) => { if (ph === 'start') { dragOn = Math.hypot(x - XY[0], y - XY[1]) < 1.5; if (!dragOn) return false; } if (dragOn) { XY = [Math.round(x), Math.round(y)]; rp.state.set('pre', 'own', true); rp.refresh(); } });

/* ---------- 04 · equations ---------- */
const circle = (cx, cy, r) => P => P.param(t => cx + r * Math.cos(t), t => cy + r * Math.sin(t), 0, 2 * PI, {color: 'orange', width: 8, opacity: 0.45});
const line = (a, b, c) => P => { if (Math.abs(b) > 1e-12) P.curve(x => (c - a * x) / b, {color: 'orange', width: 8, opacity: 0.45}); else P.vline(c / a, {color: 'orange', dash: false, width: 8, opacity: 0.45}); };
const EQ = [
  {t: 'Example 4 (i) · x² + y² = 12', draw: circle(0, 0, Math.sqrt(12)), r: [t => Math.sqrt(12), t => -Math.sqrt(12)], polar: 'r = ±2√3', steps: [['Use x² + y² = r²', 'r² = 12'], ['Solve', 'r = ±√12 = ±2√3 (a circle of radius 2√3)']]},
  {t: 'Example 4 (ii) · 3x + 5y = 2', draw: line(3, 5, 2), r: [t => 2 / (3 * Math.cos(t) + 5 * Math.sin(t))], polar: 'r = 2/(3 cos θ + 5 sin θ)', steps: [['Substitute x = r cos θ, y = r sin θ', '3r cos θ + 5r sin θ = 2'], ['Factor r', 'r(3 cos θ + 5 sin θ) = 2'], ['Solve for r', 'r = 2/(3 cos θ + 5 sin θ)']]},
  {t: 'Example 4 (iii) · x² + y² = 4x', draw: circle(2, 0, 2), r: [t => 4 * Math.cos(t)], polar: 'r = 4 cos θ', steps: [['Substitute', 'r² = 4r cos θ'], ['Factor', 'r(r − 4 cos θ) = 0'], ['Drop r = 0 (only the pole, already on the curve)', 'r = 4 cos θ']]},
  {t: 'Checkpoint 4 (i) · 2x − y = 6', draw: line(2, -1, 6), r: [t => 6 / (2 * Math.cos(t) - Math.sin(t))], polar: 'r = 6/(2 cos θ − sin θ)', steps: [['Substitute', '2r cos θ − r sin θ = 6'], ['Factor and solve', 'r = 6/(2 cos θ − sin θ)']]},
  {t: 'Checkpoint 4 (ii) · 3x² + 5y = 1', draw: P => P.curve(x => (1 - 3 * x * x) / 5, {color: 'orange', width: 8, opacity: 0.45}), r: [t => { const a = 3 * Math.cos(t) ** 2, b = 5 * Math.sin(t); return Math.abs(a) < 1e-9 ? 1 / b : (-b + Math.sqrt(b * b + 4 * a)) / (2 * a); }, t => { const a = 3 * Math.cos(t) ** 2, b = 5 * Math.sin(t); return Math.abs(a) < 1e-9 ? NaN : (-b - Math.sqrt(b * b + 4 * a)) / (2 * a); }], polar: '3r² cos²θ + 5r sin θ = 1', steps: [['Substitute', '3(r cos θ)² + 5(r sin θ) = 1'], ['Simplify', '3r² cos²θ + 5r sin θ = 1 (a quadratic in r; leaving it in this form is fine)']]},
  {t: 'Checkpoint 4 (iii) · x² + y² = 8y', draw: circle(0, 4, 4), r: [t => 8 * Math.sin(t)], polar: 'r = 8 sin θ', steps: [['Substitute', 'r² = 8r sin θ'], ['Factor and drop r = 0', 'r = 8 sin θ']]},
  {t: 'Example 5 (i) · r = 3 cos θ', draw: circle(1.5, 0, 1.5), r: [t => 3 * Math.cos(t)], polar: 'r = 3 cos θ', rect: '(x − 3/2)² + y² = 9/4', steps: [['Multiply both sides by r', 'r² = 3r cos θ'], ['Substitute', 'x² + y² = 3x'], ['Complete the square', 'x² − 3x + 9/4 + y² = 9/4 ⟹ (x − 3/2)² + y² = 9/4']]},
  {t: 'Example 5 (ii) · r = 4 sec θ', draw: line(1, 0, 4), r: [t => 4 / Math.cos(t)], polar: 'r = 4 sec θ', rect: 'x = 4', steps: [['Reciprocal identity', 'r = 4/cos θ'], ['Multiply by cos θ', 'r cos θ = 4'], ['Substitute', 'x = 4']]},
  {t: 'Checkpoint 5 (i) · r = 7 sin θ', draw: circle(0, 3.5, 3.5), r: [t => 7 * Math.sin(t)], polar: 'r = 7 sin θ', rect: 'x² + (y − 7/2)² = 49/4', steps: [['Multiply by r', 'r² = 7r sin θ'], ['Substitute', 'x² + y² = 7y'], ['Complete the square', 'x² + (y − 7/2)² = 49/4']]},
  {t: 'Checkpoint 5 (ii) · r = 2 csc θ', draw: line(0, 1, 2), r: [t => 2 / Math.sin(t)], polar: 'r = 2 csc θ', rect: 'y = 2', steps: [['Reciprocal identity', 'r = 2/sin θ'], ['Multiply by sin θ', 'r sin θ = 2'], ['Substitute', 'y = 2']]}
];
CA.lab('eq-lab', {
  controls: [{type: 'select', key: 'p', label: 'Equation', value: '2', options: EQ.map((e, i) => [String(i), e.t])}, {type: 'range', key: 'th', label: 'Trace θ up to', min: 0, max: 360, step: 5, value: 360, fmt: v => CA.radText(v)}],
  top: '<div class="ca-equation" id="eq-forms"></div>', plot: {xmin: -8, xmax: 8, ymin: -6, ymax: 9, w: 560, h: 440}, plotLabel: 'Rectangular curve with the traced polar equation', legend: [['orange', 'rectangular equation'], ['blue', 'polar equation, traced as θ increases']], steps: true
}, (lab, st) => {
  const e = EQ[+st.p], P = lab.plane(), T = toRad(st.th);
  e.draw(P);
  const n = 720, ok = (rf, t) => { const r = rf(t); return Number.isFinite(r) && Math.abs(r) < 40; };
  e.r.forEach(rf => { let a = null; for (let i = 0; i <= n; i++) { const t = T * i / n, good = ok(rf, t); if (good && a === null) a = t; if ((!good || i === n) && a !== null) { const b = good ? t : T * (i - 1) / n; if (b > a) P.param(u => rf(u) * Math.cos(u), u => rf(u) * Math.sin(u), a, b, {color: 'blue', width: 2.6, samples: 300}); a = null; } } });
  if (st.th < 360) { const r = e.r[0](T); P.seg(0, 0, 12 * Math.cos(T), 12 * Math.sin(T), {color: 'gray', dash: '4 5', width: 1.2}); if (Number.isFinite(r) && Math.abs(r) < 40) P.point(r * Math.cos(T), r * Math.sin(T), {color: 'blue', r: 6}); }
  P.render();
  $('eq-forms').innerHTML = `Rectangular: <b>${e.rect || e.t.split(' · ')[1]}</b> &nbsp;⟷&nbsp; Polar: <b>${e.polar}</b>`;
  lab.steps(e.steps);
  lab.out(`The traced polar points fall on the rectangular curve, so the two equations describe the same set of points.${e.r.length > 1 ? ' (This polar equation gives two values of r for most θ, so two blue traces are drawn.)' : ''}`);
});

/* ---------- guided problems ---------- */
CA.guided('83', [
  {q: 'Where is the polar point (−3, 7π/6)?', keep: true, opts: ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'], correct: 0, hint: 'r &lt; 0: go the opposite way from the terminal side of 7π/6.', why: '7π/6 points into Quadrant III; a negative r sends the point to the opposite ray, in Quadrant I (at angle π/6).', ref: {panel: 'plot', what: 'Example 1 (ii)', body: '<p>Plot <b>B(−3, 7π/6)</b> on the polar grid.</p>'}},
  {q: 'Convert (−4, 3π/2) to rectangular coordinates.', opts: ['(0, 4)', '(0, −4)', '(4, 0)', '(−4, 0)'], correct: 0, hint: 'cos(3π/2) = 0, sin(3π/2) = −1.', why: 'x = −4 · 0 = 0 and y = −4 · (−1) = 4.'},
  {q: 'Convert (5, −5π/3) to rectangular coordinates.', opts: ['(5/2, 5√3/2)', '(5/2, −5√3/2)', '(5√3/2, 5/2)', '(−5/2, 5√3/2)'], correct: 0, hint: '−5π/3 is coterminal with π/3.', why: 'x = 5 cos(π/3) = 5/2 and y = 5 sin(π/3) = 5√3/2.'},
  {q: 'For the rectangular point (4, −2), r = ?', opts: ['2√5', '√12', '2', '6'], correct: 0, hint: 'r² = 16 + 4.', why: 'r = √20 = 2√5.', ref: {panel: 'to-polar', what: 'Example 3 (i)', body: '<p>Convert <b>(4, −2)</b> to polar coordinates.</p>'}},
  {q: 'Which polar name is correct for (−5, −6)?', opts: ['(√61, ≈ 4.02)', '(√61, ≈ 0.88)', '(−√61, ≈ 4.02)', '(61, ≈ 0.88)'], correct: 0, hint: 'The point is in Quadrant III; tan⁻¹(6/5) ≈ 0.88 points into Quadrant I.', why: 'With r &gt; 0 add π: 0.88 + π ≈ 4.02. (−√61, 0.88) would also work.'},
  {q: 'Which is another name for the polar point (4, 2π/3)?', opts: ['(−4, 5π/3)', '(−4, 2π/3)', '(4, −2π/3)', '(4, 5π/3)'], correct: 0, hint: '(−r, θ + π).', why: '(−4, 2π/3 + π) = (−4, 5π/3) names the same point.'},
  {q: 'Write x² + y² = 4x in polar form.', opts: ['r = 4 cos θ', 'r = 4 sin θ', 'r = 4', 'r² = 4 cos θ'], correct: 0, hint: 'r² = 4r cos θ.', why: 'Divide by r (r = 0 is already on the curve): r = 4 cos θ.', ref: {panel: 'equations', what: 'Example 4 (iii)', body: '<p>Write <b>x² + y² = 4x</b> in polar form.</p>'}},
  {q: 'Write 3x + 5y = 2 in polar form.', opts: ['r = 2/(3 cos θ + 5 sin θ)', 'r = 2(3 cos θ + 5 sin θ)', 'r = 3 cos θ + 5 sin θ − 2', 'r = 2/(3 sin θ + 5 cos θ)'], correct: 0, hint: 'Replace x and y, then factor r.', why: 'r(3 cos θ + 5 sin θ) = 2.'},
  {q: 'Write r = 4 sec θ in rectangular form.', opts: ['x = 4', 'y = 4', 'x² + y² = 16', 'x = 4y'], correct: 0, hint: 'Multiply by cos θ.', why: 'r cos θ = 4, which is x = 4.'},
  {q: 'Write r = 3 cos θ in rectangular form.', opts: ['(x − 3/2)² + y² = 9/4', 'x² + y² = 9', 'x = 3', '(x − 3)² + y² = 9'], correct: 0, hint: 'Multiply by r, then complete the square.', why: 'x² + y² = 3x, so (x − 3/2)² + y² = 9/4: a circle of radius 3/2 centered at (3/2, 0).'}
]);
})();
