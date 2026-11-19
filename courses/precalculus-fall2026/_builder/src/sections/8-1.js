/* Section 8.1 · Non-right Triangles: Law of Sines — interactive activities */
(() => {
'use strict';
const {fmt, num, toRad, toDeg} = CA;
const $ = id => document.getElementById(id), sin = d => Math.sin(toRad(d)), r1 = v => num(v, 1);

/* ---------- 01 · drag vertex C ---------- */
let C = [2.2, 3.6];
const law = CA.lab('law-lab', {
  plot: {xmin: -1, xmax: 8, ymin: -1, ymax: 5.6, w: 600, h: 400, labels: false, grid: false}, plotLabel: 'Triangle with a draggable vertex', readouts: [['ra', 'a / sin α'], ['rb', 'b / sin β'], ['rc', 'c / sin γ'], ['ang', 'α, β, γ']],
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag vertex C.</p>'
}, lab => {
  const A = [0, 0], B = [6, 0], d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]), a = d(B, C), b = d(A, C), c = 6;
  const al = toDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c))), be = toDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c))), ga = 180 - al - be;
  const P = lab.plane(); P.poly([A, B, C], {color: 'orange', fillOpacity: 0.08, width: 2.6});
  P.seg(...A, ...B, {color: 'blue', width: 3}).seg(...B, ...C, {color: 'orange', width: 3}).seg(...A, ...C, {color: 'green', width: 3});
  P.label((B[0] + C[0]) / 2, (B[1] + C[1]) / 2, `a = ${num(a, 2)}`, {color: 'orange', dx: 10}).label((A[0] + C[0]) / 2, (A[1] + C[1]) / 2, `b = ${num(b, 2)}`, {color: 'green', anchor: 'end', dx: -10}).label(3, 0, 'c = 6', {color: 'blue', anchor: 'middle', dx: 0, dy: 20});
  P.label(0, 0, `A · α = ${r1(al)}°`, {anchor: 'end', dx: -6, dy: 18, size: 12}).label(6, 0, `B · β = ${r1(be)}°`, {anchor: 'start', dx: 6, dy: 18, size: 12}).point(...C, {color: 'orange', r: 9, label: `C · γ = ${r1(ga)}°`, labelOpt: {size: 12, dy: -14}}).render();
  const k = [a / sin(al), b / sin(be), c / sin(ga)];
  lab.read('ra', num(k[0], 3)); lab.read('rb', num(k[1], 3)); lab.read('rc', num(k[2], 3)); lab.read('ang', `${r1(al)}°, ${r1(be)}°, ${r1(ga)}° (sum 180°)`);
  lab.out(`All three ratios equal ${num(k[0], 3)}. The longest side is always across from the largest angle: here ${['a', 'b', 'c'][[a, b, c].indexOf(Math.max(a, b, c))]} is longest and ${['α', 'β', 'γ'][[al, be, ga].indexOf(Math.max(al, be, ga))]} is largest.`);
});
CA.drag(law.svg, (x, y) => { C = [Math.max(-0.8, Math.min(7.8, x)), Math.max(0.5, Math.min(5.4, y))]; law.refresh(); });

/* ---------- 02 · ASA / AAS solver ---------- */
const AP = [
  {t: 'α = 40°, β = 78°, c = 7', ang: {A: 40, B: 78}, side: 'c', len: 7},
  {t: 'Birdwatchers 36 ft apart', ang: {A: 47, B: 65}, side: 'c', len: 36, ask: 'a', names: {A: 'watcher 1', B: 'watcher 2', C: 'bird'}, ctx: 'Two birdwatchers 36 ft apart see a bird between them with angles of elevation 47° and 65°. The distance from the bird to the second birdwatcher is side a.', unit: 'ft'},
  {t: 'β = 52°, γ = 96°, a = 15', ang: {B: 52, C: 96}, side: 'a', len: 15},
  {t: 'Radar stations 15 mi apart', ang: {A: 38, B: 20}, side: 'c', len: 15, ask: 'b', names: {A: 'station 1', B: 'station 2', C: 'aircraft'}, ctx: 'Two radar stations 15 mi apart detect an aircraft between them with angles of elevation 38° and 20°. The distance from the aircraft to the first station is side b.', unit: 'mi'},
  {t: 'α = 52°, β = 70°, a = 17', ang: {A: 52, B: 70}, side: 'a', len: 17},
  {t: 'Satellite and two tracking stations', ang: {A: 83.9, B: 93.8}, side: 'b', len: 940, ask: 'a', names: {A: 'A', B: 'B', C: 'satellite'}, ctx: 'The angles of elevation at A and B are 83.9° and 86.2°, so the interior angle at B is 180° − 86.2° = 93.8°. The satellite is 940 km from A (side b). Find its distance from B (side a).', unit: 'km', round: 0},
  {t: 'α = 37°, γ = 81°, c = 8', ang: {A: 37, C: 81}, side: 'c', len: 8},
  {t: 'Across the lake', ang: {A: 98, B: 62}, side: 'b', len: 97, ask: 'c', names: {A: 'A', B: 'B', C: 'C'}, ctx: 'C is 97 m from A (side b), ∠BAC = 98°, and ∠ABC = 62°. Find the distance AB across the lake (side c).', unit: 'm', round: 0}
];
const OPP = {a: 'A', b: 'B', c: 'C'}, GR = {A: 'α', B: 'β', C: 'γ'};
CA.lab('aas-lab', {
  controls: [{type: 'select', key: 'p', label: 'Triangle', value: '0', options: AP.map((p, i) => [String(i), p.t])}],
  top: '<div class="ca-feedback" id="aas-ctx" hidden></div>', middle: '<svg id="aas-svg" role="img" aria-label="Solved triangle"></svg>', readouts: [['case', 'Case'], ['ang', 'Angles'], ['sid', 'Sides']], steps: true
}, (lab, st) => {
  const p = AP[+st.p], known = Object.keys(p.ang), miss = ['A', 'B', 'C'].find(k => !known.includes(k)), ang = Object.assign({}, p.ang), rd = p.round ?? 1, R = v => num(v, rd);
  ang[miss] = 180 - known.reduce((s, k) => s + p.ang[k], 0);
  const S = OPP[p.side], k = p.len / sin(ang[S]), sides = {a: k * sin(ang.A), b: k * sin(ang.B), c: k * sin(ang.C)}, u = p.unit ? ' ' + p.unit : '';
  const isASA = OPP[p.side] === miss;
  $('aas-ctx').hidden = !p.ctx; $('aas-ctx').textContent = p.ctx || '';
  CA.triangle('aas-svg', CA.triCoords(sides), {names: p.names || {A: 'A', B: 'B', C: 'C'}, angles: {A: `α = ${num(ang.A, 1)}°`, B: `β = ${num(ang.B, 1)}°`, C: `γ = ${num(ang.C, 1)}°`}, sides: {a: `a ≈ ${R(sides.a)}`, b: `b ≈ ${R(sides.b)}`, c: `c ≈ ${R(sides.c)}`}, hl: p.ask || p.side});
  lab.read('case', isASA ? 'ASA (the known side is between the known angles)' : 'AAS (the known side is opposite a known angle)'); lab.read('ang', `α = ${num(ang.A, 1)}°, β = ${num(ang.B, 1)}°, γ = ${num(ang.C, 1)}°`); lab.read('sid', `a ≈ ${R(sides.a)}, b ≈ ${R(sides.b)}, c ≈ ${R(sides.c)}`);
  const others = ['a', 'b', 'c'].filter(x => x !== p.side);
  lab.steps([['Third angle', `${GR[miss]} = 180° − ${known.map(x => num(p.ang[x], 1) + '°').join(' − ')} = ${num(ang[miss], 1)}°`], ['Known ratio', `${p.side} / sin ${GR[S]} = ${fmt(p.len)} / sin ${num(ang[S], 1)}° ≈ ${num(k, 4)}`]]
    .concat(others.map(x => [`Find ${x}`, `${x} / sin ${GR[OPP[x]]} = ${fmt(p.len)} / sin ${num(ang[S], 1)}° ⟹ ${x} = ${fmt(p.len)} sin ${num(ang[OPP[x]], 1)}° / sin ${num(ang[S], 1)}° ≈ ${R(sides[x])}${u}`])));
  lab.out(p.ask ? `Answer: <b>${p.ask} ≈ ${R(sides[p.ask])}${u}</b>.` : `Solved: α = ${num(ang.A, 1)}°, β = ${num(ang.B, 1)}°, γ = ${num(ang.C, 1)}°, a ≈ ${R(sides.a)}, b ≈ ${R(sides.b)}, c ≈ ${R(sides.c)}.`, 'ca-correct');
});

/* ---------- 03 · SSA ambiguous case ---------- */
const SP = [[63, 5, 8, 'α = 63°, a = 5, b = 8'], [25, 10, 8, 'α = 25°, a = 10, b = 8'], [38, 10, 12, 'α = 38°, a = 10, b = 12'], [58, 5, 7, 'α = 58°, a = 5, b = 7'], [63, 9, 6, 'α = 63°, a = 9, b = 6'], [34, 6, 9, 'α = 34°, a = 6, b = 9'], [120, 9, 6, 'Obtuse · α = 120°, a = 9, b = 6']];
function ssa(al, a, b) {
  const h = b * sin(al), s = b * sin(al) / a, out = {h, s, tris: []};
  if (s > 1 + 1e-12) return out;
  const b1 = toDeg(Math.asin(Math.min(1, s))), cands = [b1]; if (Math.abs(s - 1) > 1e-9) cands.push(180 - b1);
  cands.forEach(be => { const ga = 180 - al - be; if (ga > 1e-9) out.tris.push({be, ga, c: a * sin(ga) / sin(al)}); });
  return out;
}
CA.lab('ssa-lab', {
  controls: [{type: 'select', key: 'p', label: 'Problem', value: '2', options: SP.map((p, i) => [String(i), p[3]]).concat([['own', 'Use the sliders']])},
    {type: 'range', key: 'al', label: 'α =', min: 5, max: 170, step: 1, value: 38, fmt: v => v + '°'}, {type: 'range', key: 'a', label: 'a =', min: 1, max: 15, step: 0.1, value: 10}, {type: 'range', key: 'b', label: 'b =', min: 1, max: 15, step: 0.1, value: 12}],
  plot: {w: 620, h: 380}, plotLabel: 'Side a swinging from vertex C', readouts: [['h', 'h = b sin α'], ['n', 'Number of triangles'], ['t1', 'Triangle 1'], ['t2', 'Triangle 2']], steps: true
}, (lab, st, key) => {
  if (key === 'p' && st.p !== 'own') { const p = SP[+st.p]; st.set('al', p[0], true); st.set('a', p[1], true); st.set('b', p[2], true); }
  else if (key && key !== 'p') st.set('p', 'own', true);
  const al = st.al, a = st.a, b = st.b, R = ssa(al, a, b), Cx = b * Math.cos(toRad(al)), Cy = b * Math.sin(toRad(al));
  const xs = [0, Cx, Cx + a, Cx - a], P = lab.plane({xmin: Math.min(...xs) - 1, xmax: Math.max(...xs) + 1, ymin: -1, ymax: Math.max(Cy, a) + 1, xname: 'x', yname: 'y'});
  P.seg(Math.min(...xs) - 5, 0, Math.max(...xs) + 5, 0, {color: 'gray', width: 1.6}).seg(0, 0, Cx, Cy, {color: 'green', width: 3}).seg(Cx, Cy, Cx, 0, {color: 'purple', dash: '5 5', width: 2});
  P.param(t => Cx + a * Math.cos(t), t => Cy + a * Math.sin(t), 0, 2 * Math.PI, {color: 'gray', dash: '6 6', width: 1.6});
  const cols = ['orange', 'blue'];
  R.tris.forEach((T, i) => P.seg(Cx, Cy, T.c, 0, {color: cols[i], width: 3.2}).point(T.c, 0, {color: cols[i], r: 6, label: `B${R.tris.length > 1 ? i + 1 : ''}`})); // B lies on the base at distance c from A
  P.label(Cx / 2, Cy / 2, `b = ${num(b, 1)}`, {color: 'green', anchor: 'end', dx: -8}).label(Cx, Cy / 2, `h ≈ ${num(R.h, 2)}`, {color: 'purple', dx: 8}).point(0, 0, {color: 'text', r: 5, label: `A (α = ${al}°)`, labelOpt: {dy: 20, anchor: 'start'}}).point(Cx, Cy, {color: 'green', r: 6, label: 'C'}).render();
  const n = R.tris.length, tt = T => `β ≈ ${num(T.be, 1)}°, γ ≈ ${num(T.ga, 1)}°, c ≈ ${num(T.c, 1)}`;
  lab.read('h', num(R.h, 3)); lab.read('n', n === 0 ? 'none' : n === 1 ? 'one' : 'two'); lab.read('t1', n ? tt(R.tris[0]) : '—'); lab.read('t2', n > 1 ? tt(R.tris[1]) : '—');
  const steps = [['Law of Sines for β', `sin β = b sin α / a = ${num(b, 1)} sin ${al}° / ${num(a, 1)} ≈ ${num(R.s, 4)}`]];
  if (R.s > 1 + 1e-12) steps.push(['No triangle', `sin β cannot exceed 1 (a = ${num(a, 1)} &lt; h ≈ ${num(R.h, 2)})`]);
  else { steps.push(['β₁', `β₁ = sin⁻¹(${num(R.s, 4)}) ≈ ${num(toDeg(Math.asin(Math.min(1, R.s))), 1)}°`]); steps.push(['Second triangle?', n === 2 ? `h &lt; a &lt; b, so β₂ = 180° − β₁ ≈ ${num(R.tris[1].be, 1)}° also works` : al >= 90 ? 'α is obtuse, so only one triangle' : `a ≥ b (or a = h), so β₂ = 180° − β₁ would make the angle sum too big: one triangle`]); R.tris.forEach((T, i) => steps.push([`Triangle ${i + 1}`, `γ = 180° − ${al}° − ${num(T.be, 1)}° ≈ ${num(T.ga, 1)}°; c = a sin γ / sin α ≈ ${num(T.c, 1)}`])); }
  lab.steps(steps);
  lab.out(n === 0 ? `<b>No triangle:</b> side a = ${num(a, 1)} is too short to reach the base (it would have to be at least h ≈ ${num(R.h, 2)}).` : n === 1 ? `<b>One triangle.</b> The circle of radius a meets the base on the correct side of A only once.` : `<b>Two triangles</b> (the ambiguous case): the circle meets the base at B₁ and B₂, and both are on the ray from A.`, n ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 04 · area ---------- */
const AR = [[7, 10, 102, 'B', 'a', 'c', 'β = 102°, a = 7, c = 10'], [28, 20, 62, 'C', 'a', 'b', 'γ = 62°, a = 28, b = 20'], [5, 8, 30, 'A', 'b', 'c', 'α = 30°, b = 5, c = 8']];
CA.lab('area-lab', {
  controls: [{type: 'select', key: 'p', label: 'Triangle', value: '0', options: AR.map((p, i) => [String(i), p[6]])}],
  middle: '<svg id="area-svg" role="img" aria-label="Triangle with two sides and the included angle"></svg>', readouts: [['f', 'Formula'], ['ar', 'Area']], steps: true
}, (lab, st) => {
  const [p, q, th, V, n1, n2] = AR[+st.p], gr = {A: 'α', B: 'β', C: 'γ'}[V], area = 0.5 * p * q * sin(th);
  CA.triangle('area-svg', {A: [0, 0], B: [p, 0], C: [q * Math.cos(toRad(th)), q * Math.sin(toRad(th))]}, {names: {A: V, B: '', C: ''}, angles: {A: `${gr} = ${th}°`}, sides: {c: `${n1} = ${p}`, b: `${n2} = ${q}`}, hl: 'A',
    extra: (T) => { const c = T([q * Math.cos(toRad(th)), q * Math.sin(toRad(th))]), f = T([q * Math.cos(toRad(th)), 0]); return th < 90 ? `<line x1="${c[0]}" y1="${c[1]}" x2="${f[0]}" y2="${f[1]}" stroke="var(--cp-purple)" stroke-dasharray="5 5" stroke-width="2"/><text x="${f[0] + 6}" y="${(c[1] + f[1]) / 2}" font-size="12.5" font-weight="800" fill="var(--cp-purple)">height = ${q} sin ${th}°</text>` : ''; }});
  lab.read('f', `Area = ½ ${n1}${n2} sin ${gr}`); lab.read('ar', `≈ ${num(area, 1)} square units`);
  lab.steps([['Two sides and the included angle', `${n1} = ${p}, ${n2} = ${q}, ${gr} = ${th}°`], ['Area', `½(${p})(${q}) sin ${th}° ≈ ${num(area, 1)}`]]);
  lab.out(`Area ≈ <b>${num(area, 1)}</b> square units.`, 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('81', [
  {q: 'Which equation is the Law of Sines?', opts: ['a/sin α = b/sin β = c/sin γ', 'a/sin β = b/sin γ = c/sin α', 'a sin α = b sin β = c sin γ', 'a² = b² + c² − 2bc cos α'], correct: 0, hint: 'Each side is paired with its opposite angle.', why: 'The ratio of each side to the sine of its opposite angle is the same.'},
  {q: 'For which given information can you use the Law of Sines directly?', opts: ['AAS', 'SSS', 'SAS', 'AAA'], correct: 0, hint: 'You need a known angle with its opposite side.', why: 'ASA, AAS, and SSA work with the Law of Sines; SSS and SAS need the Law of Cosines, and AAA does not fix the size.'},
  {q: 'A triangle has α = 40°, β = 78°, and c = 7. What is γ?', opts: ['62°', '118°', '52°', '72°'], correct: 0, hint: 'α + β + γ = 180°.', why: '180° − 40° − 78° = 62°.', ref: {panel: 'asa-aas', what: 'the triangle α = 40°, β = 78°, c = 7', body: '<p>Solve the triangle with <b>α = 40°, β = 78°, c = 7</b>.</p>'}},
  {q: 'In the same triangle, a ≈ ?', opts: ['5.1', '7.8', '4.6', '9.6'], correct: 0, hint: 'a = 7 sin 40°/sin 62°.', why: '7(0.6428)/0.8829 ≈ 5.1.', ref: {problem: 3, what: 'the same triangle'}},
  {q: 'In the same triangle, b ≈ ?', opts: ['7.8', '5.1', '4.6', '6.2'], correct: 0, hint: 'b uses sin 78°.', why: 'b = 7 sin 78°/sin 62° ≈ 7(0.9781)/0.8829 ≈ 7.8.', ref: {problem: 3, what: 'the same triangle'}},
  {q: 'Solve for b when α = 52°, β = 70°, a = 17.', opts: ['≈ 20.3', '≈ 18.3', '≈ 14.3', '≈ 22.1'], correct: 0, hint: 'b = 17 sin 70°/sin 52°.', why: '17(0.9397)/0.7880 ≈ 20.3.'},
  {q: 'How many triangles have α = 63°, a = 5, b = 8?', opts: ['none', 'one', 'two', 'infinitely many'], correct: 0, hint: 'Compute sin β = 8 sin 63°/5.', why: 'sin β ≈ 1.43 &gt; 1 (a is shorter than h ≈ 7.13), so no triangle exists.', ref: {panel: 'ssa', what: 'the SSA case α = 63°, a = 5, b = 8', body: '<p>α = 63°, a = 5, b = 8. Is there a triangle?</p>'}},
  {q: 'How many triangles have α = 38°, a = 10, b = 12?', opts: ['two', 'one', 'none', 'three'], correct: 0, hint: 'h = 12 sin 38° ≈ 7.39.', why: 'h &lt; a &lt; b (7.39 &lt; 10 &lt; 12), the ambiguous case: β₁ ≈ 47.6° and β₂ ≈ 132.4°.'},
  {q: 'Find the area of triangle ABC with β = 102°, a = 7, c = 10.', opts: ['≈ 34.2', '≈ 68.5', '≈ 7.3', '≈ 35.0'], correct: 0, hint: '½ac sin β.', why: '½(7)(10) sin 102° ≈ 35(0.9781) ≈ 34.2.'},
  {q: 'Two birdwatchers 36 ft apart see a bird between them at angles of elevation 47° and 65°. How far is the bird from the second birdwatcher (angle 65°)?', opts: ['≈ 28.4 ft', '≈ 35.2 ft', '≈ 33.4 ft', '≈ 26.3 ft'], correct: 0, hint: 'The angle at the bird is 68°; the side you want is opposite 47°.', why: 'x/sin 47° = 36/sin 68°, so x = 36 sin 47°/sin 68° ≈ 28.4 ft.'}
]);
})();
