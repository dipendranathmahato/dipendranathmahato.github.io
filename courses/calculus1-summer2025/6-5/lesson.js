/* Section 6.5 · Physical Applications — interactive activities */
(() => {
'use strict';
const {num} = CA, PI = Math.PI;
const I = (f, a, b) => CA.integrate(f, a, b, 4000);

/* ---------- 01 · rod ---------- */
const ROD = [
  {t: 'ρ(x) = sin x on [π/2, π]', r: Math.sin, a: PI / 2, b: PI, exT: '1', u: 'kg/m'},
  {t: 'ρ(x) = 2 + x on [0, 4]', r: x => 2 + x, a: 0, b: 4, exT: '16', u: 'kg/m'},
  {t: 'ρ(x) = 3 (constant) on [1, 5]', r: () => 3, a: 1, b: 5, exT: '12 = 3 · (5 − 1)', u: 'kg/m'},
  {t: 'ρ(x) = 1 + x² on [0, 3]', r: x => 1 + x * x, a: 0, b: 3, exT: '12', u: 'kg/m'}
];
CA.lab('rod-lab', {
  controls: [{type: 'select', key: 'p', label: 'Density', value: '0', options: ROD.map((r, i) => [String(i), r.t])}, {type: 'range', key: 'n', label: 'Pieces n =', min: 1, max: 40, step: 1, value: 6}],
  plot: {w: 560, h: 360}, plotLabel: 'Density graph with the rod drawn below the axis', legend: [['blue', 'ρ(x) and the pieces ρ(xᵢ*)Δx'], ['orange', 'the rod: darker = denser']], readouts: [['s', 'Σ ρ(xᵢ*)Δx'], ['m', 'mass ∫ρ dx']]
}, (lab, st) => {
  const R = ROD[+st.p], top = Math.max(...Array.from({length: 101}, (_, i) => R.r(R.a + (R.b - R.a) * i / 100))), w = (R.b - R.a) * 0.08;
  const P = lab.plane({xmin: Math.min(0, R.a - w), xmax: R.b + w, ymin: -top * 0.35, ymax: top * 1.2, equal: false});
  const S = CA.riemann(R.r, R.a, R.b, st.n, 'mid'); CA.drawRects(P, S, {color: 'blue', fillOpacity: 0.2});
  P.curve(R.r, {color: 'blue', width: 3, from: R.a, to: R.b});
  const k = 60; for (let i = 0; i < k; i++) { const x0 = R.a + (R.b - R.a) * i / k, x1 = x0 + (R.b - R.a) / k, d = R.r((x0 + x1) / 2) / top; P.poly([[x0, -top * 0.25], [x1, -top * 0.25], [x1, -top * 0.1], [x0, -top * 0.1]], {color: 'orange', fillOpacity: 0.12 + 0.75 * d, width: 0}); }
  for (let i = 0; i <= st.n; i++) { const x = R.a + (R.b - R.a) * i / st.n; P.seg(x, -top * 0.27, x, -top * 0.08, {color: 'text', width: 1.2}); }
  P.render();
  lab.read('s', num(S.sum, 6)); lab.read('m', `${R.exT} ≈ ${num(I(R.r, R.a, R.b), 6)}`);
  lab.out(`Each piece has mass about ρ(xᵢ*)Δx (a rectangle in the graph). As n grows the sum approaches the mass ∫ ρ(x) dx.`);
});

/* ---------- 02 · disk ---------- */
const DK = [
  {t: 'ρ(x) = 3x + 2, radius 2', r: x => 3 * x + 2, R: 2, exT: '24π'},
  {t: 'ρ(x) = 5 (constant), radius 2', r: () => 5, R: 2, exT: '20π = 5 · π · 2²'},
  {t: 'ρ(x) = 10 − x², radius 3', r: x => 10 - x * x, R: 3, exT: '99π/2'},
  {t: 'ρ(x) = 4e^(−x), radius 3', r: x => 4 * Math.exp(-x), R: 3, exT: '8π(1 − 4e<sup>−3</sup>)'}
];
const ring = (P, r0, r1, o) => { const n = 72, out = [], inn = []; for (let i = 0; i <= n; i++) { const t = 2 * PI * i / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); inn.push([r0 * Math.cos(t), r0 * Math.sin(t)]); } P.poly(out.concat(inn.reverse()), o); };
CA.lab('disk-lab', {
  controls: [{type: 'select', key: 'p', label: 'Density', value: '0', options: DK.map((r, i) => [String(i), r.t])}, {type: 'range', key: 'n', label: 'Rings n =', min: 2, max: 30, step: 1, value: 8}, {type: 'range', key: 'i', label: 'Highlight ring', min: 1, max: 30, step: 1, value: 5}],
  plot: {xmin: -3.4, xmax: 3.4, ymin: -3.4, ymax: 3.4, w: 460, h: 460, equal: true}, plotLabel: 'Disk divided into rings; darker = denser', readouts: [['A', 'ring area π(xᵢ² − xᵢ₋₁²)'], ['a', '≈ 2πxᵢ*Δx'], ['mi', 'ring mass ≈'], ['s', 'sum of ring masses'], ['m', 'mass ∫ 2πxρ(x) dx']]
}, (lab, st) => {
  const D = DK[+st.p], n = st.n, i = Math.min(st.i, n), dx = D.R / n, top = Math.max(...Array.from({length: 101}, (_, k) => D.r(D.R * k / 100))), P = lab.plane({xmin: -D.R * 1.15, xmax: D.R * 1.15, ymin: -D.R * 1.15, ymax: D.R * 1.15});
  let S = 0; for (let k = 1; k <= n; k++) { const r0 = (k - 1) * dx, r1 = k * dx, xm = (r0 + r1) / 2; S += 2 * PI * xm * D.r(xm) * dx; ring(P, r0, r1, {color: k === i ? 'orange' : 'blue', fillOpacity: k === i ? 0.7 : 0.08 + 0.6 * D.r(xm) / top, width: k === i ? 2 : 0.6}); }
  P.render();
  const r0 = (i - 1) * dx, r1 = i * dx, xm = (r0 + r1) / 2;
  lab.read('A', num(PI * (r1 * r1 - r0 * r0), 5)); lab.read('a', num(2 * PI * xm * dx, 5)); lab.read('mi', num(2 * PI * xm * D.r(xm) * dx, 5)); lab.read('s', num(S, 6)); lab.read('m', `${D.exT} ≈ ${num(I(x => 2 * PI * x * D.r(x), 0, D.R), 6)}`);
  lab.out('A thin ring is almost a long thin rectangle: length 2πx (the circumference), width Δx. Its mass is about 2πx ρ(x)Δx.');
});

/* ---------- 03 · spring ---------- */
CA.lab('spring-lab', {
  controls: [{type: 'number', key: 'F0', label: 'Force (N)', value: 30, step: 5, min: 1}, {type: 'number', key: 's0', label: 'stretches it (cm)', value: 5, step: 1, min: 1}, {type: 'range', key: 'a', label: 'from stretch a (cm)', min: 0, max: 40, step: 1, value: 5}, {type: 'range', key: 'b', label: 'to stretch b (cm)', min: 0, max: 40, step: 1, value: 25}],
  top: '<svg id="spring-pic" role="img" aria-label="Spring stretched from a to b"></svg>', plot: {xmin: -0.02, xmax: 0.42, ymin: -10, ymax: 260, w: 540, h: 300, equal: false, xname: 'x (m)', yname: 'F (N)'}, plotLabel: 'Hooke’s law F(x) = kx; the shaded area is the work',
  readouts: [['k', 'k'], ['W', 'work W'], ['f', 'formula']]
}, (lab, st) => {
  if (!(st.F0 > 0 && st.s0 > 0)) { lab.out('Enter a positive force and stretch.', 'ca-incorrect'); return; }
  const k = st.F0 / (st.s0 / 100), a = Math.min(st.a, st.b) / 100, b = Math.max(st.a, st.b) / 100, F = x => k * x, P = lab.plane({ymax: Math.max(k * 0.42 * 1.1, 10)});
  CA.shade(P, F, a, b, {color: 'green', fillOpacity: 0.3}); P.curve(F, {color: 'blue', width: 3, from: 0, to: 0.42}).render();
  const pic = new CA.Plane(document.getElementById('spring-pic'), {xmin: -0.08, xmax: 0.72, ymin: -0.06, ymax: 0.06, w: 540, h: 110, equal: false, grid: false, tools: false, noY: true, xname: '', yname: ''});
  pic.seg(-0.06, -0.05, -0.06, 0.05, {color: 'text', width: 6});
  const L0 = 0.2, end = L0 + b, coils = 14, pts = [[-0.06, 0]]; for (let i = 1; i < coils * 2; i++) pts.push([-0.06 + (end + 0.06) * i / (coils * 2), i % 2 ? 0.03 : -0.03]); pts.push([end, 0]);
  for (let i = 0; i < pts.length - 1; i++) pic.seg(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], {color: 'blue', width: 2});
  pic.poly([[end, -0.04], [end + 0.06, -0.04], [end + 0.06, 0.04], [end, 0.04]], {color: 'orange', fillOpacity: 0.6, width: 1.5});
  pic.seg(L0, -0.055, L0, 0.055, {color: 'gray', dash: '3 3', width: 1.2}).label(L0, 0.058, 'natural length', {anchor: 'middle', size: 11, color: 'gray'}).render();
  const W = k / 2 * (b * b - a * a);
  lab.read('k', `${num(st.F0, 4)} N / ${num(st.s0 / 100, 4)} m = ${num(k, 5)} N/m`); lab.read('W', `${num(W, 5)} J`); lab.read('f', `∫<sub>${num(a, 3)}</sub><sup>${num(b, 3)}</sup> ${num(k, 5)}x dx = ${num(k / 2, 5)}(${num(b, 3)}² − ${num(a, 3)}²)`);
  lab.out(st.F0 === 30 && st.s0 === 5 && Math.min(st.a, st.b) === 5 && Math.max(st.a, st.b) === 25 ? 'Stretching the spring from 5 cm to 25 cm takes 18 J. Lengths must be in meters for the answer to come out in joules.' : 'The work is the area under F(x) = kx between the two stretches (a trapezoid).', 'ca-correct');
});

/* ---------- 04 · pumping ---------- */
CA.lab('pump-lab', {
  controls: [{type: 'range', key: 'd', label: 'Water left in the tank (ft)', min: 0, max: 11, step: 0.5, value: 4}, {type: 'range', key: 's', label: 'Pump to this height above the top (ft)', min: 0, max: 6, step: 0.5, value: 0}, {type: 'range', key: 'x', label: 'Representative layer at depth x (ft)', min: 0, max: 12, step: 0.25, value: 3}],
  plot: {xmin: -6.2, xmax: 6.8, ymin: -1, ymax: 19, w: 480, h: 540, equal: true, xname: '', yname: 'height'}, plotLabel: 'Cross-section of the conical tank',
  legend: [['blue', 'water to pump out'], ['purple', 'water left'], ['orange', 'one layer']], readouts: [['r', 'layer radius 4 − x/3'], ['dW', 'work for the layer ≈'], ['W', 'total work'], ['f', 'integral']]
}, (lab, st) => {
  const d = st.d, s = st.s, P = lab.plane(), rad = x => 4 - x / 3, depth = 12 - d; let x = Math.min(st.x, 12);
  const sideL = y => -y / 3, sideR = y => y / 3;
  P.poly([[0, 0], [sideR(d), d], [sideL(d), d]], {color: 'purple', fillOpacity: 0.35, width: 0});
  P.poly([[sideL(d), d], [sideR(d), d], [4, 12], [-4, 12]], {color: 'blue', fillOpacity: 0.25, width: 0});
  P.seg(0, 0, 4, 12, {color: 'text', width: 2.4}).seg(0, 0, -4, 12, {color: 'text', width: 2.4}).seg(-4, 12, 4, 12, {color: 'gray', width: 1.2, dash: '4 4'});
  if (s > 0) P.seg(4, 12, 4, 12 + s, {color: 'gray', width: 3}).seg(4, 12 + s, 5.2, 12 + s, {color: 'gray', width: 3}).label(5.3, 12 + s, 'spout', {anchor: 'start', size: 11, color: 'gray'});
  const y = 12 - x, r = rad(x), dx = 0.35;
  P.poly([[-r, y - dx / 2], [r, y - dx / 2], [r, y + dx / 2], [-r, y + dx / 2]], {color: 'orange', fillOpacity: x <= depth ? 0.75 : 0.2, width: 1.4});
  P.seg(-r - 0.6, y, -r - 0.6, 12 + s, {color: 'red', width: 2}).label(-r - 0.8, (y + 12 + s) / 2, `lift ${num(x + s, 3)} ft`, {anchor: 'end', size: 11, color: 'red'});
  P.label(4.3, 6, '12 ft', {anchor: 'start', size: 11, color: 'gray'}).label(0, 12.6, '4 ft radius', {anchor: 'middle', size: 11, color: 'gray'}).render();
  const f = t => 62.4 * PI * (t + s) * rad(t) ** 2, W = I(f, 0, depth);
  lab.read('r', `${num(r, 4)} ft`); lab.read('dW', x <= depth ? `62.4π(${num(r, 3)})²(${num(x + s, 3)})Δx` : 'this layer stays in the tank');
  lab.read('W', `${d === 4 && s === 0 ? '10,649.6π ≈ ' : ''}${Math.round(W).toLocaleString('en-US')} ft-lb`);
  lab.read('f', `∫<sub>0</sub><sup>${num(depth, 3)}</sup> 62.4π (x${s ? ' + ' + num(s, 2) : ''})(4 − x/3)² dx`);
  lab.out(x > depth ? 'Layers below the final water level are not pumped.' : 'Layers near the top are wide but lifted only a short distance; deeper layers are narrow but lifted farther. The integral adds all of them.');
});

/* ---------- guided problems ---------- */
CA.guided('65', [
  {q: 'A rod on [0, 4] has density ρ(x) = 2 + x. Its mass is:', opts: ['16', '8', '24', '12'], correct: 0, hint: '∫<sub>0</sub><sup>4</sup> (2 + x) dx.', why: '8 + 8.', ref: {panel: 'rod', what: 'mass of a rod', body: '<p>m = ∫<sub>a</sub><sup>b</sup> ρ(x) dx.</p>'}},
  {q: 'A rod on [π/2, π] has density sin x. Its mass is:', opts: ['1', '2', '0', 'π/2'], correct: 0, hint: '−cos x.', why: '(1) − (0).'},
  {q: 'The mass of a disk of radius r with radial density ρ(x) is:', opts: ['∫<sub>0</sub><sup>r</sup> 2πx ρ(x) dx', '∫<sub>0</sub><sup>r</sup> ρ(x) dx', '∫<sub>0</sub><sup>r</sup> πx² ρ(x) dx', 'πr² ρ(r)'], correct: 0, hint: 'Rings of area ≈ 2πxΔx.', why: 'Mass of a ring ≈ 2πxρ(x)Δx.', ref: {panel: 'disk', what: 'mass of a disk', body: '<p>m = ∫<sub>0</sub><sup>r</sup> 2πxρ(x) dx.</p>'}},
  {q: 'A disk of radius 2 has density ρ(x) = 3x + 2. Its mass is:', opts: ['24π', '12π', '8π', '20π'], correct: 0, hint: '2π[x³ + x²]<sub>0</sub><sup>2</sup>.', why: '2π · 12.'},
  {q: 'A force of 30 N stretches a spring 0.05 m. The spring constant is:', opts: ['600 N/m', '1.5 N/m', '6 N/m', '150 N/m'], correct: 0, hint: 'F = kx.', why: '30/0.05.', ref: {panel: 'work', what: 'Hooke’s law', body: '<p>F(x) = kx; W = ∫<sub>a</sub><sup>b</sup> F(x) dx.</p>'}},
  {q: 'With k = 600 N/m, the work to stretch from 0.05 m to 0.25 m is:', opts: ['18 J', '36 J', '12 J', '180 J'], correct: 0, hint: '300(0.25² − 0.05²).', why: '300 · 0.06.'},
  {q: 'With k = 600 N/m, the work to stretch from natural length to 0.1 m is:', opts: ['3 J', '6 J', '60 J', '0.3 J'], correct: 0, hint: '300(0.1)².', why: '300 · 0.01.'},
  {q: 'In the cone tank (height 12 ft, radius 4 ft), a layer at depth x has radius:', opts: ['4 − x/3', 'x/3', '4 − 3x', '12 − x'], correct: 0, hint: 'Similar triangles: r/(12 − x) = 4/12.', why: 'r = (12 − x)/3.', ref: {panel: 'pumping', what: 'the cone tank', body: '<p>Inverted cone, height 12 ft, top radius 4 ft; x is the depth below the top.</p>'}},
  {q: 'The weight density of water used here is:', opts: ['62.4 lb/ft³', '9.8 lb/ft³', '1000 lb/ft³', '32 lb/ft³'], correct: 0, hint: 'English units.', why: '62.4 lb/ft³.'},
  {q: 'Pumping the cone tank until 4 ft of water remain takes about:', opts: ['33,457 ft-lb', '10,650 ft-lb', '62,400 ft-lb', '3,346 ft-lb'], correct: 0, hint: '62.4π · 512/3.', why: '10,649.6π ≈ 33,457.'}
]);
})();
