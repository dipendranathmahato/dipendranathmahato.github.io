/* Section 8.2 · Non-right Triangles: Law of Cosines — interactive activities */
(() => {
'use strict';
const {fmt, num, toRad, toDeg} = CA;
const $ = id => document.getElementById(id), cos = d => Math.cos(toRad(d)), acosD = v => toDeg(Math.acos(Math.max(-1, Math.min(1, v)))), r1 = v => num(v, 1);
const tri = (a, b, c) => CA.triCoords({a, b, c});

/* ---------- 01 · Pythagoras plus a correction ---------- */
CA.lab('law-lab', {
  controls: [{type: 'range', key: 'a', label: 'a =', min: 2, max: 9, step: 0.5, value: 6}, {type: 'range', key: 'b', label: 'b =', min: 2, max: 9, step: 0.5, value: 5}, {type: 'range', key: 'g', label: 'γ =', min: 10, max: 170, step: 1, value: 60, fmt: v => v + '°'}],
  middle: '<svg id="law-svg" role="img" aria-label="Triangle with sides a and b and the angle between them"></svg>', readouts: [['ab', 'a² + b²'], ['corr', '−2ab cos γ'], ['c2', 'c² = sum'], ['c', 'c']]
}, (lab, st) => {
  const {a, b, g} = st, corr = -2 * a * b * cos(g), c2 = a * a + b * b + corr, c = Math.sqrt(c2);
  CA.triangle('law-svg', {C: [0, 0], B: [a, 0], A: [b * cos(g), b * Math.sin(toRad(g))]}, {right: g === 90 ? 'C' : null, angles: {C: `γ = ${g}°`}, sides: {a: `a = ${fmt(a)}`, b: `b = ${fmt(b)}`, c: `c ≈ ${num(c, 2)}`}, hl: 'c'});
  lab.read('ab', num(a * a + b * b, 2)); lab.read('corr', `${corr >= 0 ? '+' : '−'}${num(Math.abs(corr), 2)}`); lab.read('c2', num(c2, 2)); lab.read('c', num(c, 3));
  lab.out(Math.abs(g - 90) < 1e-9 ? 'γ = 90°: cos γ = 0, so c² = a² + b², the Pythagorean Theorem.' : g < 90 ? `γ is acute: cos γ &gt; 0, so the correction −2ab cos γ is negative and c² is <b>less</b> than a² + b².` : `γ is obtuse: cos γ &lt; 0, so the correction is positive and c² is <b>more</b> than a² + b².`);
});

/* ---------- 02 · SAS ---------- */
const SP = [
  {t: 'a = 25, b = 17, γ = 62°', s1: ['a', 25], s2: ['b', 17], ang: 62},
  {t: 'Bus: 41 mi north, then 26 mi after turning 45° west', s1: ['b', 41], s2: ['c', 26], ang: 135, ctx: 'The bus travels 41 mi north, turns 45° toward the west, and travels 26 mi. The angle between the two legs at the turn is 180° − 45° = 135°. The distance back to the station is the side opposite that angle.', unit: 'mi'},
  {t: 'β = 106°, a = 11, c = 16', s1: ['a', 11], s2: ['c', 16], ang: 106},
  {t: 'a = 8, c = 5, β = 40°', s1: ['a', 8], s2: ['c', 5], ang: 40}
];
const GR = {a: 'α', b: 'β', c: 'γ'};
CA.lab('sas-lab', {
  controls: [{type: 'select', key: 'p', label: 'Triangle', value: '0', options: SP.map((p, i) => [String(i), p.t])}],
  top: '<div class="ca-feedback" id="sas-ctx" hidden></div>', middle: '<svg id="sas-svg" role="img" aria-label="Solved SAS triangle"></svg>', readouts: [['sid', 'Sides'], ['ang', 'Angles']], steps: true
}, (lab, st) => {
  const p = SP[+st.p], [n1, x] = p.s1, [n2, y] = p.s2, n3 = ['a', 'b', 'c'].find(n => n !== n1 && n !== n2), u = p.unit ? ' ' + p.unit : '';
  const z2 = x * x + y * y - 2 * x * y * cos(p.ang), z = Math.sqrt(z2), S = {[n1]: x, [n2]: y, [n3]: z};
  const small = x < y ? n1 : n2, angS = acosD((S[n3] ** 2 + S[small === n1 ? n2 : n1] ** 2 - S[small] ** 2) / (2 * S[n3] * S[small === n1 ? n2 : n1])), last = ['a', 'b', 'c'].find(n => n !== n3 && n !== small);
  const A = {[n3]: p.ang, [small]: angS}; A[last] = 180 - p.ang - angS;
  $('sas-ctx').hidden = !p.ctx; $('sas-ctx').textContent = p.ctx || '';
  CA.triangle('sas-svg', tri(S.a, S.b, S.c), {angles: {A: `α ≈ ${r1(A.a)}°`, B: `β ≈ ${r1(A.b)}°`, C: `γ ≈ ${r1(A.c)}°`}, sides: {a: `a ≈ ${r1(S.a)}`, b: `b ≈ ${r1(S.b)}`, c: `c ≈ ${r1(S.c)}`}, hl: n3});
  lab.read('sid', `a ≈ ${r1(S.a)}, b ≈ ${r1(S.b)}, c ≈ ${r1(S.c)}`); lab.read('ang', `α ≈ ${r1(A.a)}°, β ≈ ${r1(A.b)}°, γ ≈ ${r1(A.c)}°`);
  const o = small === n1 ? n2 : n1;
  lab.steps([['Law of Cosines for ' + n3, `${n3}² = ${x}² + ${y}² − 2(${x})(${y}) cos ${p.ang}° ≈ ${num(z2, 1)} ⟹ ${n3} ≈ ${r1(z)}${u}`],
    [`Smaller angle ${GR[small]}`, `${GR[small]} = cos⁻¹((${r1(S[n3])}² + ${S[o]}² − ${S[small]}²)/(2 · ${r1(S[n3])} · ${S[o]})) ≈ ${r1(angS)}°`], ['Angle sum', `${GR[last]} = 180° − ${p.ang}° − ${r1(angS)}° ≈ ${r1(A[last])}°`]]);
  lab.out(p.unit ? `The bus is about <b>${r1(z)}${u}</b> from the station.` : `Solved: the new side ${n3} ≈ ${r1(z)}; check that the largest angle (${r1(Math.max(A.a, A.b, A.c))}°) faces the longest side (${r1(Math.max(S.a, S.b, S.c))}).`, 'ca-correct');
});

/* ---------- 03 · SSS ---------- */
const SS = [[16, 13, 20, 'a = 16, b = 13, c = 20'], [35, 29, 21, 'a = 35, b = 29, c = 21'], [5, 7, 10, 'a = 5, b = 7, c = 10'], [3, 4, 9, 'a = 3, b = 4, c = 9 (impossible)']];
CA.lab('sss-lab', {
  controls: [{type: 'select', key: 'p', label: 'Triangle', value: '0', options: SS.map((p, i) => [String(i), p[3]]).concat([['own', 'Set your own']])}, {type: 'number', key: 'a', label: 'a =', value: 16, min: 0.1, step: 0.1}, {type: 'number', key: 'b', label: 'b =', value: 13, min: 0.1, step: 0.1}, {type: 'number', key: 'c', label: 'c =', value: 20, min: 0.1, step: 0.1}],
  middle: '<svg id="sss-svg" role="img" aria-label="Solved SSS triangle"></svg>', readouts: [['ang', 'Angles'], ['type', 'Type']], steps: true
}, (lab, st, key) => {
  if (key === 'p' && st.p !== 'own') { const p = SS[+st.p]; st.set('a', p[0], true); st.set('b', p[1], true); st.set('c', p[2], true); }
  else if (key && key !== 'p') st.set('p', 'own', true);
  const {a, b, c} = st;
  if (!(a > 0 && b > 0 && c > 0) || a + b <= c || a + c <= b || b + c <= a) { $('sss-svg').innerHTML = ''; lab.read('ang', '—'); lab.read('type', 'no triangle'); lab.steps([['Triangle inequality', `${a} + ${b} ${a + b > c ? '&gt;' : '≤'} ${c}, ${a} + ${c} ${a + c > b ? '&gt;' : '≤'} ${b}, ${b} + ${c} ${b + c > a ? '&gt;' : '≤'} ${a}`]]); lab.out('These sides cannot form a triangle: one side is at least as long as the other two together.', 'ca-incorrect'); return; }
  const al = acosD((b * b + c * c - a * a) / (2 * b * c)), be = acosD((a * a + c * c - b * b) / (2 * a * c)), ga = 180 - al - be;
  CA.triangle('sss-svg', tri(a, b, c), {angles: {A: `α ≈ ${r1(al)}°`, B: `β ≈ ${r1(be)}°`, C: `γ ≈ ${r1(ga)}°`}, sides: {a: `a = ${fmt(a)}`, b: `b = ${fmt(b)}`, c: `c = ${fmt(c)}`}});
  lab.read('ang', `α ≈ ${r1(al)}°, β ≈ ${r1(be)}°, γ ≈ ${r1(ga)}°`); lab.read('type', Math.max(al, be, ga) > 90.05 ? 'obtuse' : Math.abs(Math.max(al, be, ga) - 90) < 0.05 ? 'right' : 'acute');
  lab.steps([['Triangle inequality', 'each side is shorter than the sum of the other two ✓'], ['α', `cos⁻¹((${b}² + ${c}² − ${a}²)/(2 · ${b} · ${c})) = cos⁻¹(${num((b * b + c * c - a * a) / (2 * b * c), 4)}) ≈ ${r1(al)}°`], ['β', `cos⁻¹((${a}² + ${c}² − ${b}²)/(2 · ${a} · ${c})) = cos⁻¹(${num((a * a + c * c - b * b) / (2 * a * c), 4)}) ≈ ${r1(be)}°`], ['γ', `180° − ${r1(al)}° − ${r1(be)}° ≈ ${r1(ga)}°`]]);
  lab.out(`Solved. The largest angle, ${r1(Math.max(al, be, ga))}°, is across from the longest side, ${fmt(Math.max(a, b, c))}.`, 'ca-correct');
});

/* ---------- 04 · Heron ---------- */
const HP = [[47, 58, 62, 'a = 47, b = 58, c = 62'], [18, 24, 27, 'a = 18, b = 24, c = 27'], [3, 4, 5, '3-4-5 right triangle']];
CA.lab('her-lab', {
  controls: [{type: 'select', key: 'p', label: 'Triangle', value: '0', options: HP.map((p, i) => [String(i), p[3]])}],
  readouts: [['s', 's'], ['her', "Heron's formula"], ['sin', '½ab sin γ (check)']], steps: true
}, (lab, st) => {
  const [a, b, c] = HP[+st.p], s = (a + b + c) / 2, A = Math.sqrt(s * (s - a) * (s - b) * (s - c)), ga = acosD((a * a + b * b - c * c) / (2 * a * b)), A2 = 0.5 * a * b * Math.sin(toRad(ga));
  lab.read('s', fmt(s)); lab.read('her', `≈ ${r1(A)}`); lab.read('sin', `≈ ${r1(A2)} (γ ≈ ${r1(ga)}°)`);
  lab.steps([['Semi-perimeter', `s = ½(${a} + ${b} + ${c}) = ${fmt(s)}`], ['Heron', `√(${fmt(s)} · ${fmt(s - a)} · ${fmt(s - b)} · ${fmt(s - c)}) = √${num(s * (s - a) * (s - b) * (s - c), 2)} ≈ ${r1(A)}`], ['Check', `γ from the Law of Cosines ≈ ${r1(ga)}°, ½(${a})(${b}) sin γ ≈ ${r1(A2)}`]]);
  lab.out(`Area ≈ <b>${r1(A)}</b> square units, and both methods agree.`, 'ca-correct');
});

/* ---------- 05 · which law ---------- */
CA.cards('which-cards', [
  {expr: 'α = 40°, β = 78°, c = 7 (ASA)', correct: 0, why: 'Find γ from the angle sum; then γ and c form a known angle–side pair.'},
  {expr: 'a = 25, b = 17, γ = 62° (SAS)', correct: 1, why: 'γ is between the known sides; there is no known angle–side pair yet.'},
  {expr: 'a = 16, b = 13, c = 20 (SSS)', correct: 1, why: 'No angle is known, so start with the Law of Cosines.'},
  {expr: 'α = 38°, a = 10, b = 12 (SSA)', correct: 0, why: 'α and a are an opposite pair (watch for the ambiguous case).'},
  {expr: 'α = 52°, β = 70°, a = 17 (AAS)', correct: 0, why: 'α and a are an opposite pair.'},
  {expr: 'β = 106°, a = 11, c = 16 (SAS)', correct: 1, why: 'β is the included angle between a and c.'}
], {options: ['Law of Sines', 'Law of Cosines']});

/* ---------- guided problems ---------- */
CA.guided('82', [
  {q: 'Which is the Law of Cosines for side c?', opts: ['c² = a² + b² − 2ab cos γ', 'c² = a² + b² + 2ab cos γ', 'c² = a² + b² − 2ab sin γ', 'c = a + b − 2ab cos γ'], correct: 0, hint: 'γ is the angle opposite c.', why: 'c² = a² + b² − 2ab cos γ.'},
  {q: 'Which given information calls for the Law of Cosines first?', opts: ['SAS', 'AAS', 'ASA', 'SSA'], correct: 0, hint: 'Is there a known angle with its opposite side?', why: 'In SAS the known angle is between the known sides, so no opposite pair is known.'},
  {q: 'For a = 25, b = 17, γ = 62°, c ≈ ?', opts: ['22.7', '30.2', '42.0', '18.4'], correct: 0, hint: 'c² = 625 + 289 − 850 cos 62°.', why: 'c² ≈ 914 − 399.1 ≈ 514.9, so c ≈ 22.7.', ref: {panel: 'sas', what: 'the triangle a = 25, b = 17, γ = 62°', body: '<p>Solve the triangle with <b>a = 25, b = 17, γ = 62°</b>.</p>'}},
  {q: 'In the same triangle, α ≈ ?', opts: ['76.6°', '41.4°', '62.0°', '103.4°'], correct: 0, hint: 'α = cos⁻¹((b² + c² − a²)/(2bc)).', why: 'cos⁻¹((289 + 515.3 − 625)/(2 · 17 · 22.7)) ≈ 76.6°.', ref: {problem: 3, what: 'the same triangle'}},
  {q: 'For a = 16, b = 13, c = 20, α ≈ ?', opts: ['53.0°', '40.5°', '86.5°', '60.0°'], correct: 0, hint: 'cos α = (13² + 20² − 16²)/(2 · 13 · 20).', why: 'cos α = 313/520 ≈ 0.6019, α ≈ 53.0°.'},
  {q: 'A bus goes 41 mi north, turns 45° toward the west, and goes 26 mi. How far is it from the start?', opts: ['≈ 62.2 mi', '≈ 29.1 mi', '≈ 67.0 mi', '≈ 48.5 mi'], correct: 0, hint: 'The angle between the legs is 135°.', why: 'd² = 26² + 41² − 2(26)(41) cos 135° ≈ 3864.6, so d ≈ 62.2 mi.'},
  {q: "In Heron's formula for a = 47, b = 58, c = 62, s = ?", opts: ['83.5', '167', '55.7', '41.75'], correct: 0, hint: 's is half the perimeter.', why: '(47 + 58 + 62)/2 = 83.5.'},
  {q: 'The area of the triangle with sides 47, 58, 62 is about…', opts: ['1292.6', '1670.9', '646.3', '2585.2'], correct: 0, hint: '√(83.5 · 36.5 · 25.5 · 21.5).', why: '√(1,670,929.9) ≈ 1292.6 square units.'},
  {q: 'When γ = 90°, the Law of Cosines for c becomes…', opts: ['the Pythagorean Theorem', 'the Law of Sines', "Heron's formula", 'c = a + b'], correct: 0, hint: 'cos 90° = 0.', why: 'c² = a² + b² − 0.'},
  {q: 'Which information can NOT determine a unique triangle?', opts: ['AAA', 'SSS', 'SAS', 'ASA'], correct: 0, hint: 'Similar triangles share their angles.', why: 'Three angles fix the shape but not the size: infinitely many similar triangles.'}
]);
})();
