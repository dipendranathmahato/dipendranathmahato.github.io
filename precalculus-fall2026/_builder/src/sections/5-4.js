/* Section 5.4 · Right Triangle Trigonometry — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Rad, toRad} = CA;
const $ = id => document.getElementById(id);
const right = (alpha, c) => { const a = c * Math.sin(toRad(alpha)), b = c * Math.cos(toRad(alpha)); return {A: [0, 0], C: [b, 0], B: [b, a], a, b}; };

/* ---------- 01 · label the sides ---------- */
CA.lab('tri-lab', {
  controls: [{type: 'seg', key: 'at', label: 'Stand at', value: 'A', options: [['A', 'angle α'], ['B', 'angle β']]}, {type: 'range', key: 'al', label: 'α =', min: 10, max: 80, step: 1, value: 37, fmt: v => v + '°'}, {type: 'range', key: 'c', label: 'Hypotenuse =', min: 2, max: 10, step: 0.5, value: 5}],
  middle: '<svg id="tri-svg" role="img" aria-label="Right triangle with labeled sides"></svg>', readouts: [['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan']]
}, (lab, st) => {
  const T = right(st.al, st.c), atA = st.at === 'A', be = 90 - st.al, nm = atA ? 'α' : 'β', ang = atA ? st.al : be;
  const opp = atA ? T.a : T.b, adj = atA ? T.b : T.a;
  CA.triangle('tri-svg', T, {right: 'C', hl: st.at, names: {A: 'A', B: 'B', C: 'C'}, angles: {A: `α = ${st.al}°`, B: `β = ${be}°`},
    sides: atA ? {a: `opposite ${num(T.a, 2)}`, b: `adjacent ${num(T.b, 2)}`, c: `hypotenuse ${fmt(st.c)}`} : {a: `adjacent ${num(T.a, 2)}`, b: `opposite ${num(T.b, 2)}`, c: `hypotenuse ${fmt(st.c)}`}});
  lab.read('sin', `sin ${nm} = ${num(opp, 2)}/${fmt(st.c)} ≈ ${num(opp / st.c, 4)}`); lab.read('cos', `cos ${nm} = ${num(adj, 2)}/${fmt(st.c)} ≈ ${num(adj / st.c, 4)}`); lab.read('tan', `tan ${nm} = ${num(opp, 2)}/${num(adj, 2)} ≈ ${num(opp / adj, 4)}`);
  lab.out(`Standing at ${nm} = ${ang}°: the <b>opposite</b> side is across from ${nm}, the <b>adjacent</b> side touches ${nm} (and is not the hypotenuse). Make the hypotenuse longer or shorter: the sides change, but sin ${nm}, cos ${nm}, and tan ${nm} do not, because the triangles are similar.`);
});

/* ---------- 02 · missing side, exact ratios ---------- */
const MS_PRE = {ex2: [33, 56, null, 'α', 'β', 'Example 2 · legs 33 and 56'], cp2: [null, 10, 15, 'β', 'α', 'Checkpoint 2 · leg 10, hypotenuse 15'], cp4: [8, 10, null, 'β', 'α', 'Checkpoint 4 · legs 8 and 10'], tri: [5, 12, null, 'α', 'β', 'legs 5 and 12']};
const FN = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot'];
CA.lab('ms-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Triangle', value: 'ex2', options: Object.entries(MS_PRE).map(([k, v]) => [k, v[5]]).concat([['own', 'Set your own']])},
    {type: 'seg', key: 'unk', label: 'Unknown side', value: 'c', options: [['a', 'a (vertical leg)'], ['b', 'b (base)'], ['c', 'c (hypotenuse)']]},
    {type: 'number', key: 'a', label: 'a =', value: 33, min: 1, step: 1}, {type: 'number', key: 'b', label: 'b =', value: 56, min: 1, step: 1}, {type: 'number', key: 'c', label: 'c =', value: 65, min: 1, step: 1}],
  middle: '<svg id="ms-svg" role="img" aria-label="Right triangle with the missing side"></svg><div id="ms-table"></div>', steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = MS_PRE[st.pre]; st.set('unk', p[0] === null ? 'a' : p[1] === null ? 'b' : 'c', true); if (p[0] !== null) st.set('a', p[0], true); if (p[1] !== null) st.set('b', p[1], true); if (p[2] !== null) st.set('c', p[2], true); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const names = st.pre !== 'own' ? MS_PRE[st.pre].slice(3, 5) : ['α', 'β'], u = st.unk;
  const fail = m => { lab.out(m, 'ca-incorrect'); lab.steps([]); $('ms-table').innerHTML = ''; $('ms-svg').innerHTML = ''; };
  const v = {a: st.a, b: st.b, c: st.c}; if (['a', 'b', 'c'].some(k => k !== u && !(Number.isInteger(v[k]) && v[k] > 0))) return fail('Use positive whole numbers for the two known sides.');
  let A, B, C, step;
  if (u === 'c') { A = Rad.of(v.a); B = Rad.of(v.b); C = Rad.sqrt(v.a * v.a + v.b * v.b); step = `c² = a² + b² = ${v.a}² + ${v.b}² = ${v.a * v.a + v.b * v.b} → c = ${C.str()}`; }
  else { const leg = u === 'a' ? v.b : v.a; if (leg >= v.c) return fail('Each leg must be shorter than the hypotenuse.'); const m = Rad.sqrt(v.c * v.c - leg * leg); if (u === 'a') { A = m; B = Rad.of(v.b); } else { A = Rad.of(v.a); B = m; } C = Rad.of(v.c); step = `${u}² = c² − ${u === 'a' ? 'b' : 'a'}² = ${v.c}² − ${leg}² = ${v.c * v.c - leg * leg} → ${u} = ${m.str()}`; }
  const [nA, nB] = names, valsA = {sin: A.div(C), cos: B.div(C), tan: A.div(B), csc: C.div(A), sec: C.div(B), cot: B.div(A)}, valsB = {sin: B.div(C), cos: A.div(C), tan: B.div(A), csc: C.div(B), sec: C.div(A), cot: A.div(B)};
  CA.triangle('ms-svg', {A: [0, 0], C: [B.v, 0], B: [B.v, A.v]}, {right: 'C', angles: {A: nA, B: nB}, sides: {a: `a = ${A.str()}`, b: `b = ${B.str()}`, c: `c = ${C.str()}`}, hl: u});
  $('ms-table').innerHTML = `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th></th>${FN.map(f => `<th>${f}</th>`).join('')}</tr><tr><th>${nA} (at the base)</th>${FN.map(f => `<td class="hl">${valsA[f].html()}</td>`).join('')}</tr><tr><th>${nB} (at the top)</th>${FN.map(f => `<td>${valsB[f].html()}</td>`).join('')}</tr></table></div>`;
  lab.steps([['Pythagorean Theorem', step], [`Sides for ${nA}`, `opposite a = ${A.str()}, adjacent b = ${B.str()}, hypotenuse c = ${C.str()}`], [`Ratios for ${nA}`, `sin ${nA} = ${valsA.sin.str()}, cos ${nA} = ${valsA.cos.str()}, tan ${nA} = ${valsA.tan.str()}`], [`Ratios for ${nB}`, `sin ${nB} = ${valsB.sin.str()}, cos ${nB} = ${valsB.cos.str()}, tan ${nB} = ${valsB.tan.str()}`]]);
  lab.out(`Compare the two rows: sin ${nA} = cos ${nB}, tan ${nA} = cot ${nB}, and sec ${nA} = csc ${nB}, because the side opposite ${nA} is adjacent to ${nB}. Radicals in a denominator have been rationalized.`, 'ca-correct');
});

/* ---------- 03 · cofunctions ---------- */
CA.lab('co-lab', {
  controls: [{type: 'range', key: 't', label: 't =', min: 5, max: 85, step: 1, value: 25, fmt: v => v + '°'}],
  middle: '<svg id="co-svg" role="img" aria-label="Right triangle with complementary angles"></svg>', readouts: [['s', 'sin t and cos(90° − t)'], ['t', 'tan t and cot(90° − t)'], ['c', 'sec t and csc(90° − t)']]
}, (lab, st) => {
  const t = st.t, T = right(t, 5), r = x => num(x, 4);
  CA.triangle('co-svg', T, {right: 'C', angles: {A: `t = ${t}°`, B: `90° − t = ${90 - t}°`}, sides: {a: 'opp. t = adj. (90° − t)', b: 'adj. t = opp. (90° − t)'}});
  lab.read('s', `${r(Math.sin(toRad(t)))} = ${r(Math.cos(toRad(90 - t)))}`); lab.read('t', `${r(Math.tan(toRad(t)))} = ${r(1 / Math.tan(toRad(90 - t)))}`); lab.read('c', `${r(1 / Math.cos(toRad(t)))} = ${r(1 / Math.sin(toRad(90 - t)))}`);
  lab.out(`t + (90° − t) = 90°: the two acute angles are complementary. Each “co-” function of one angle equals the function of the other angle.`);
});
const fb = $('co-fill'), fsels = [...fb.querySelectorAll('select')], fout = $('co-out');
$('co-check').addEventListener('click', () => { let ok = 0; fsels.forEach(s => { s.classList.remove('right', 'wrong'); if (!s.value) return; const r = s.value === s.dataset.answer; s.classList.add(r ? 'right' : 'wrong'); if (r) ok++; }); fout.className = 'ca-feedback ' + (ok === fsels.length ? 'ca-correct' : ''); fout.innerHTML = ok === fsels.length ? '✓ All correct. A function of an angle equals the cofunction of its complement.' : `${ok} of ${fsels.length} correct. Pair each function with its cofunction and each angle with its complement.`; });
$('co-reset').addEventListener('click', () => { fsels.forEach(s => { s.value = ''; s.classList.remove('right', 'wrong'); }); fout.className = 'ca-feedback'; fout.textContent = 'Choose an answer in each blank, then check.'; });

/* ---------- 04 · elevation and depression ---------- */
const SC = {
  kite: {t: 'Example 3 · kite string', known: 130, ang: 40, kl: 'String length (ft)'},
  bld: {t: 'Checkpoint 3 (1) · building', known: 140, ang: 27, kl: 'Distance to the building (ft)'},
  hawk: {t: 'Checkpoint 3 (2) · hawk and rat', known: 25, ang: 34, kl: 'Height of the tree (ft)'}
};
CA.lab('el-lab', {
  controls: [{type: 'select', key: 'sc', label: 'Situation', value: 'kite', options: Object.entries(SC).map(([k, v]) => [k, v.t])}, {type: 'number', key: 'L', label: 'Known length (ft)', value: 130, min: 1, step: 1}, {type: 'range', key: 'th', label: 'Angle =', min: 5, max: 80, step: 1, value: 40, fmt: v => v + '°'}],
  middle: '<svg id="el-svg" role="img" aria-label="Applied right-triangle problem"></svg>', readouts: [['ratio', 'Ratio used'], ['ans', 'Answer']], steps: true
}, (lab, st, key) => {
  if (key === 'sc') { st.set('L', SC[st.sc].known, true); st.set('th', SC[st.sc].ang, true); }
  const L = st.L, th = st.th, R = toRad(th);
  if (!(L > 0)) { lab.out('Enter a positive length.', 'ca-incorrect'); return; }
  if (st.sc === 'kite') {
    const h = L * Math.sin(R), T = right(th, L);
    CA.triangle('el-svg', T, {right: 'C', names: {A: 'you', B: 'kite', C: ''}, angles: {A: `${th}°`}, sides: {c: `string ${fmt(L)} ft`, a: 'h = ?'}, hl: 'a'});
    lab.read('ratio', 'sin = opposite / hypotenuse'); lab.read('ans', `h ≈ ${num(h, 1)} ft`);
    lab.steps([['Opposite and hypotenuse', `h is opposite ${th}°; the string (${fmt(L)} ft) is the hypotenuse`], ['Set up', `sin ${th}° = h/${fmt(L)}`], ['Solve', `h = ${fmt(L)} sin ${th}° ≈ ${num(h, 1)} ft`]]);
    lab.out(`The kite is about <b>${num(h, 1)} ft</b> above the point where the string is held.`, 'ca-correct');
  } else if (st.sc === 'bld') {
    const h = L * Math.tan(R), T = {A: [0, 0], C: [L, 0], B: [L, h]};
    CA.triangle('el-svg', T, {right: 'C', names: {A: 'you', B: 'top', C: 'base'}, angles: {A: `${th}°`}, sides: {b: `${fmt(L)} ft`, a: 'h = ?'}, hl: 'a'});
    lab.read('ratio', 'tan = opposite / adjacent'); lab.read('ans', `h ≈ ${num(h, 1)} ft`);
    lab.steps([['Opposite and adjacent', `h is opposite ${th}°; the ${fmt(L)} ft ground distance is adjacent`], ['Set up', `tan ${th}° = h/${fmt(L)}`], ['Solve', `h = ${fmt(L)} tan ${th}° ≈ ${num(h, 1)} ft`]]);
    lab.out(`The building is about <b>${num(h, 1)} ft</b> tall.`, 'ca-correct');
  } else {
    const d = L / Math.sin(R), g = L / Math.tan(R), T = {A: [0, 0], C: [g, 0], B: [g, L]};
    CA.triangle('el-svg', T, {right: 'C', names: {A: 'rat', B: 'hawk', C: ''}, angles: {A: `${th}°`}, sides: {a: `tree ${fmt(L)} ft`, c: 'd = ?'}, hl: 'c',
      extra: (TT) => { const b = TT(T.B), lft = TT([g * 0.35, L]); return `<line x1="${b[0]}" y1="${b[1]}" x2="${lft[0]}" y2="${lft[1]}" stroke="var(--cp-purple)" stroke-width="2.2" stroke-dasharray="6 5"/><text x="${(b[0] + lft[0]) / 2}" y="${b[1] - 9}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--cp-purple)">horizontal · depression ${th}°</text>`; }});
    lab.read('ratio', 'sin = opposite / hypotenuse'); lab.read('ans', `d ≈ ${num(d, 1)} ft`);
    lab.steps([['Move the angle', `The angle of depression from the hawk (${th}°) equals the angle of elevation from the rat (alternate interior angles)`], ['Opposite and hypotenuse', `the tree (${fmt(L)} ft) is opposite ${th}° at the rat; the line of sight d is the hypotenuse`], ['Set up', `sin ${th}° = ${fmt(L)}/d`], ['Solve', `d = ${fmt(L)}/sin ${th}° ≈ ${num(d, 1)} ft`]]);
    lab.out(`The hawk is about <b>${num(d, 1)} ft</b> from the rat.`, 'ca-correct');
  }
});

/* ---------- guided problems ---------- */
const fig = (a, b, opt) => CA.triSVG({A: [0, 0], C: [b, 0], B: [b, a]}, Object.assign({right: 'C'}, opt));
CA.guided('54', [
  {q: 'In the triangle, find sin α.', fig: fig(33, 56, {angles: {A: 'α'}, sides: {a: '33', b: '56', c: 'c'}}), opts: ['33/65', '56/65', '33/56', '65/33'], correct: 0, hint: 'First find c = √(33² + 56²).', why: 'c = √(1089 + 3136) = √4225 = 65, so sin α = opposite/hypotenuse = 33/65.', ref: {panel: 'missing-side', what: 'Example 2', body: '<p>Legs <b>33</b> (opposite α) and <b>56</b> (adjacent to α). Evaluate sin α, cos α, tan α.</p>'}},
  {q: 'In the same triangle (legs 33 and 56), find tan α.', opts: ['33/56', '56/33', '33/65', '56/65'], correct: 0, hint: 'tan = opposite/adjacent.', why: 'tan α = 33/56.', ref: {problem: 1, what: 'the same triangle'}},
  {q: 'A right triangle has hypotenuse 15 and one leg 10 adjacent to angle β. What is cos β?', opts: ['2/3', '√5/3', '3/2', '√5/2'], correct: 0, hint: 'cos = adjacent/hypotenuse.', why: 'cos β = 10/15 = 2/3.'},
  {q: 'If sin t = 3/7, what is cos(π/2 − t)?', opts: ['3/7', '4/7', '7/3', '√40/7'], correct: 0, hint: 'Cofunction identity.', why: 'cos(π/2 − t) = sin t = 3/7.'},
  {q: 'tan 53° = cot x for which acute angle x?', opts: ['37°', '53°', '127°', '143°'], correct: 0, hint: 'Complementary angles add to 90°.', why: 'tan 53° = cot(90° − 53°) = cot 37°.'},
  {q: '130 ft of kite string is out and the angle of elevation is 40°. How high is the kite?', opts: ['≈ 83.6 ft', '≈ 99.6 ft', '≈ 109.1 ft', '≈ 202.2 ft'], correct: 0, hint: 'sin 40° = h/130.', why: 'h = 130 sin 40° ≈ 130(0.6428) ≈ 83.6 ft. (99.6 uses cos, 109.1 uses tan.)', ref: {panel: 'elevation', what: 'Example 3', body: '<p><b>130 ft</b> of string, angle of elevation <b>40°</b>. Find the height of the kite.</p>'}},
  {q: 'From 140 ft away, the angle of elevation to the top of a building is 27°. How tall is it?', opts: ['≈ 71.3 ft', '≈ 63.6 ft', '≈ 124.7 ft', '≈ 274.8 ft'], correct: 0, hint: 'tan 27° = h/140.', why: 'h = 140 tan 27° ≈ 140(0.5095) ≈ 71.3 ft.'},
  {q: 'A hawk on a 25-ft tree sees a rat with an angle of depression of 34°. How far apart are they?', opts: ['≈ 44.7 ft', '≈ 14.0 ft', '≈ 30.2 ft', '≈ 37.1 ft'], correct: 0, hint: 'sin 34° = 25/d.', why: 'd = 25/sin 34° ≈ 25/0.5592 ≈ 44.7 ft.'},
  {q: 'The two acute angles of a right triangle are always…', opts: ['complementary', 'supplementary', 'equal', 'coterminal'], correct: 0, hint: 'The three angles add to 180°.', why: 'α + β + 90° = 180°, so α + β = 90°.'},
  {q: 'Legs 8 and 10, with α opposite the side of length 10. What is sec α?', fig: fig(10, 8, {angles: {A: 'α'}, sides: {a: '10', b: '8'}}), opts: ['√41/4', '5√41/41', '5/4', '√41/5'], correct: 0, hint: 'Hypotenuse = √(64 + 100); sec = hypotenuse/adjacent.', why: 'Hypotenuse = √164 = 2√41. The side adjacent to α is 8, so sec α = 2√41/8 = √41/4.'}
]);
})();
