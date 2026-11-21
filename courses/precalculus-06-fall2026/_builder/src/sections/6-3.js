/* Section 6.3 · Inverse Trigonometric Functions — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Rad, toRad, toDeg} = CA;
const PI = Math.PI, nx = v => CA.niceX(v);
const RES = {sin: {a: -PI / 2, b: PI / 2, rng: [-1, 1]}, cos: {a: 0, b: PI, rng: [-1, 1]}, tan: {a: -PI / 2 + 0.06, b: PI / 2 - 0.06, rng: null}};
const UC_WIN = {xmin: -1.5, xmax: 1.5, ymin: -1.3, ymax: 1.3, w: 520, h: 400, xstep: 0.5, ystep: 0.5};

/* ---------- 01 · restrict and reflect ---------- */
CA.lab('res-lab', {
  controls: [{type: 'seg', key: 'fn', label: 'Function', value: 'sin', options: [['sin', 'sine'], ['cos', 'cosine'], ['tan', 'tangent']]}, {type: 'range', key: 's', label: 'Reflection', min: 0, max: 100, step: 5, value: 0, fmt: v => v + '%'}, {type: 'check', key: 'hlt', label: 'Show a horizontal line', value: true}],
  plot: {xmin: -3.6, xmax: 3.6, ymin: -2.6, ymax: 3.6, w: 600, h: 400, xpi: F(1, 2)}, plotLabel: 'Restricting and reflecting a trig graph', legend: [['gray', 'full graph'], ['orange', 'restricted piece'], ['blue', 'inverse']], readouts: [['dom', 'Restricted domain'], ['rng', 'Range'], ['inv', 'Inverse: domain → range']]
}, (lab, st) => {
  const fn = st.fn, f = Math[fn], R = RES[fn], s = st.s / 100, P = lab.plane();
  P.curve(x => x, {color: 'gray', dash: '5 5', width: 1.4});
  if (s === 0) P.curve(f, {color: 'gray', width: 2, opacity: 0.6, breaks: fn === 'tan' ? [-3 * PI / 2, -PI / 2, PI / 2, 3 * PI / 2] : [], samples: 1400});
  const lo = fn === 'tan' ? -PI / 2 + 0.002 : R.a, hi = fn === 'tan' ? PI / 2 - 0.002 : R.b;
  if (s < 1) P.param(t => (1 - s) * t + s * f(t), t => (1 - s) * f(t) + s * t, lo, hi, {color: s === 0 ? 'orange' : 'purple', width: 3.4, samples: 600});
  if (s === 1) P.curve({sin: Math.asin, cos: Math.acos, tan: Math.atan}[fn], {color: 'blue', width: 3.6, samples: 1200});
  if (st.hlt && s === 0) { const k = fn === 'tan' ? 1 : 0.5; P.hline(k, {color: 'green', dash: '6 5', width: 2}); const xs = []; for (let x = -3.6; x <= 3.6; x += 0.002) { const y1 = f(x), y2 = f(x + 0.002); if (Number.isFinite(y1) && Number.isFinite(y2) && Math.abs(y1 - y2) < 1 && (y1 - k) * (y2 - k) <= 0) xs.push(x); } xs.forEach(x => P.point(x, k, {color: x >= lo && x <= hi ? 'orange' : 'green', r: 5})); }
  P.render();
  const dom = {sin: '[−π/2, π/2]', cos: '[0, π]', tan: '(−π/2, π/2)'}[fn], rng = fn === 'tan' ? '(−∞, ∞)' : '[−1, 1]';
  lab.read('dom', dom); lab.read('rng', rng); lab.read('inv', `${fn}⁻¹: ${rng} → ${dom}`);
  lab.out(s === 0 ? `The green line meets the full graph many times, so ${fn} x is not one-to-one. On ${dom} (orange) it meets the graph only once: that piece has an inverse.` : s < 1 ? 'Each point (x, y) of the restricted piece travels across y = x toward (y, x).' : `The blue curve is y = ${fn}⁻¹x. Its domain ${rng} is the range of the piece, and its range ${dom} is the restricted domain.`);
});

/* ---------- 02 · evaluate inverse values ---------- */
const INV_PRE = [['sin', '0', 'sin⁻¹(0)'], ['sin', '-√2/2', 'sin⁻¹(−√2/2)'], ['cos', '-√2/2', 'cos⁻¹(−√2/2)'], ['cos', '0.7439', 'cos⁻¹(0.7439)'],
  ['tan', '2.6851', 'tan⁻¹(2.6851)'], ['tan', '-√3', 'tan⁻¹(−√3)'], ['cos', '0', 'cos⁻¹(0)'], ['cos', '-0.1374', 'cos⁻¹(−0.1374)'],
  ['sin', '0.2219', 'sin⁻¹(0.2219)'], ['sin', '-√3/2', 'sin⁻¹(−√3/2)'], ['tan', '-4.0152', 'tan⁻¹(−4.0152)'], ['tan', '√3/3', 'tan⁻¹(√3/3)']];
CA.lab('inv-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Problem', value: '1', options: INV_PRE.map((p, i) => [String(i), p[2]]).concat([['own', 'Type your own']])},
    {type: 'seg', key: 'fn', label: 'Inverse', value: 'sin', options: [['sin', 'sin⁻¹'], ['cos', 'cos⁻¹'], ['tan', 'tan⁻¹']]}, {type: 'text', key: 'v', label: 'Value', value: '-√2/2', placeholder: '−√3/2 or 0.62'}],
  plot: UC_WIN, plotLabel: 'Unit circle with the allowed arc for the inverse function', readouts: [['ans', 'Answer (radians)'], ['deg', 'In degrees'], ['q', 'Where it lies']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = INV_PRE[+st.pre]; st.set('fn', p[0], true); st.set('v', p[1], true); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const fn = st.fn, I = CA.INV[fn], V = CA.parseReal(st.v), P = lab.plane();
  const arc = {sin: [-PI / 2, PI / 2], cos: [0, PI], tan: [-PI / 2, PI / 2]}[fn];
  P.param(t => Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.6}).param(t => Math.cos(t), t => Math.sin(t), arc[0], arc[1], {color: 'green', width: 7, opacity: 0.6});
  if (!V) { P.render(); lab.out('Type a number such as −√3/2, 1/2, 2.6851, or −√3.', 'ca-incorrect'); lab.steps([]); return; }
  if (fn !== 'tan' && Math.abs(V.v) > 1 + 1e-12) { P.render(); lab.read('ans', 'undefined'); lab.read('deg', '—'); lab.read('q', '—'); lab.steps([]); lab.out(`${fn}⁻¹(${V.str}) is undefined: the domain of ${fn}⁻¹ is [−1, 1], because ${fn} of an angle is a coordinate on the unit circle.`, 'ca-incorrect'); return; }
  const th = I.f(V.v), d = CA.invExact(fn, V.v), x = Math.cos(th), y = Math.sin(th);
  if (fn === 'sin') P.hline(V.v, {color: 'blue', dash: '6 5', width: 2}); else if (fn === 'cos') P.vline(V.v, {color: 'blue', dash: '6 5', width: 2}); else P.seg(-1.6 * Math.cos(th), -1.6 * Math.sin(th), 1.6 * Math.cos(th), 1.6 * Math.sin(th), {color: 'blue', dash: '6 5', width: 2});
  CA.drawAngle(P, th, {circle: false, pointLabel: d !== null ? CA.radText(d) : num(th, 4), arcR: 0.25}).render();
  const ansTxt = d !== null ? CA.radText(d) : `≈ ${num(th, 4)}`, q = Math.abs(th) < 1e-12 ? 'on the positive x-axis' : CA.quadName(toDeg(th));
  lab.read('ans', ansTxt); lab.read('deg', d !== null ? `${d}°` : `≈ ${num(toDeg(th), 2)}°`); lab.read('q', q);
  const where = {sin: '[−π/2, π/2]', cos: '[0, π]', tan: '(−π/2, π/2)'}[fn], what = {sin: 'sine (y-coordinate)', cos: 'cosine (x-coordinate)', tan: 'tangent (y/x)'}[fn];
  lab.steps([['Translate', `${fn}⁻¹(${V.str}) = θ means ${fn} θ = ${V.str} with θ in ${where}`], ['Sign and quadrant', V.v === 0 ? 'value 0' : `${what} is ${V.v > 0 ? 'positive' : 'negative'}, so θ is ${fn === 'cos' ? (V.v > 0 ? 'in Quadrant I (0 to π/2)' : 'in Quadrant II (π/2 to π)') : (V.v > 0 ? 'in Quadrant I (0 to π/2)' : 'in Quadrant IV (−π/2 to 0)')}`],
    d !== null ? ['Special value', `${fn}(${CA.radText(d)}) = ${CA.exact(fn, d).str()}, so θ = ${CA.radText(d)}`] : ['Calculator (radian mode)', `θ = ${fn}⁻¹(${V.str}) ≈ ${num(th, 4)} rad ≈ ${num(toDeg(th), 2)}°`]]);
  lab.out(`${fn}⁻¹(${V.str}) = <b>${ansTxt}</b>. Other angles have the same ${fn} value, but only this one lies on the green arc ${where}.`, 'ca-correct');
});

/* ---------- 03 · compositions ---------- */
const CP = [
  {m: 'ff', fn: 'sin', v: '0.62', t: 'sin(sin⁻¹(0.62))'}, {m: 'ff', fn: 'cos', v: '-1/4', t: 'cos(cos⁻¹(−1/4))'}, {m: 'ff', fn: 'tan', v: '5.394', t: 'tan(tan⁻¹(5.394))'},
  {m: 'ff', fn: 'sin', v: '-2.8', t: 'sin(sin⁻¹(−2.8))'}, {m: 'ff', fn: 'cos', v: '5/3', t: 'cos(cos⁻¹(5/3))'},
  {m: 'if', fn: 'sin', v: '2π/5', t: 'sin⁻¹(sin(2π/5))'}, {m: 'if', fn: 'cos', v: '3π/4', t: 'cos⁻¹(cos(3π/4))'}, {m: 'if', fn: 'tan', v: '-4π/9', t: 'tan⁻¹(tan(−4π/9))'},
  {m: 'if', fn: 'sin', v: '5π/6', t: 'sin⁻¹(sin(5π/6))'}, {m: 'if', fn: 'cos', v: '7π/4', t: 'cos⁻¹(cos(7π/4))'}, {m: 'if', fn: 'tan', v: '8π/7', t: 'tan⁻¹(tan(8π/7))'},
  {m: 'if', fn: 'sin', v: '5π/4', t: 'sin⁻¹(sin(5π/4))'}, {m: 'if', fn: 'tan', v: '9π/10', t: 'tan⁻¹(tan(9π/10))'},
  {m: 'ig', fn: 'cos', g: 'sin', v: '7π/3', t: 'cos⁻¹(sin(7π/3))'}, {m: 'ig', fn: 'sin', g: 'cos', v: 'π', t: 'sin⁻¹(cos(π))'}, {m: 'ig', fn: 'tan', g: 'cos', v: '2π/5', t: 'tan⁻¹(cos(2π/5))'},
  {m: 'ig', fn: 'sin', g: 'cos', v: '4π/3', t: 'sin⁻¹(cos(4π/3))'}, {m: 'ig', fn: 'cos', g: 'sin', v: '-π/4', t: 'cos⁻¹(sin(−π/4))'}
];
const RNG = {sin: [-PI / 2, PI / 2, '[−π/2, π/2]'], cos: [0, PI, '[0, π]'], tan: [-PI / 2, PI / 2, '(−π/2, π/2)']};
const valStr = (fn, ang) => { const d = Math.round(ang.deg * 1e6) / 1e6, e = Number.isInteger(d) ? CA.exact(fn, d) : null; return e ? e.str() : num(CA.trig[fn](ang.v), 5); };
CA.lab('comp-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Expression', value: '8', options: CP.map((p, i) => [String(i), p.t])}],
  top: '<div class="ca-equation" id="comp-expr"></div>', plot: UC_WIN, plotLabel: 'Angles in the composition', readouts: [['inner', 'Inner value'], ['ans', 'Result']], steps: true
}, (lab, st) => {
  const p = CP[+st.pre], fn = p.fn, P = lab.plane(), R = RNG[fn];
  P.param(t => Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.6}).param(t => Math.cos(t), t => Math.sin(t), R[0], R[1], {color: 'green', width: 7, opacity: 0.55});
  const ex = document.getElementById('comp-expr');
  if (p.m === 'ff') {
    const V = CA.parseReal(p.v); ex.textContent = `${fn}(${fn}⁻¹(${V.str}))`;
    const ok = fn === 'tan' || Math.abs(V.v) <= 1; P.render();
    lab.read('inner', ok ? `${fn}⁻¹(${V.str}) is an angle in ${R[2]}` : 'undefined'); lab.read('ans', ok ? V.str : 'undefined');
    lab.steps([['Domain check', fn === 'tan' ? 'tan⁻¹ accepts every real number' : `${V.str} ${ok ? 'is' : 'is not'} in [−1, 1], the domain of ${fn}⁻¹`], ['Result', ok ? `${fn}(${fn}⁻¹(${V.str})) = ${V.str}` : `${fn}⁻¹(${V.str}) does not exist, so the expression is undefined`]]);
    lab.out(ok ? `${fn} undoes ${fn}⁻¹, so the answer is <b>${V.str}</b>.` : `<b>Undefined.</b> No angle has ${fn} equal to ${V.str}.`, ok ? 'ca-correct' : 'ca-incorrect'); return;
  }
  const A = CA.parseAngle(p.v, 'rad'), g = p.m === 'ig' ? p.g : fn, inner = CA.trig[g](A.v), th = CA.INV[fn].f(inner), thF = CA.simpleFrac(th / PI), dIn = CA.invExact(fn, inner);
  ex.textContent = `${fn}⁻¹(${g}(${CA.piStr(A.f)}))`;
  CA.drawAngle(P, A.v, {circle: false, point: true, color: 'gray', arcR: 0.18, pointLabel: CA.piStr(A.f), pointLabelOpt: {size: 11.5}});
  CA.drawAngle(P, th, {circle: false, point: true, arcR: 0.3, pointLabel: dIn !== null ? CA.radText(dIn) : num(th, 4), pointLabelOpt: {size: 12}}).render();
  const innerTxt = valStr(g, A), ansTxt = dIn !== null ? CA.radText(dIn) : thF ? CA.piStr(thF) : `≈ ${num(th, 4)}`;
  lab.read('inner', `${g}(${CA.piStr(A.f)}) = ${innerTxt}`); lab.read('ans', ansTxt);
  const steps = [['Inner value', `${g}(${CA.piStr(A.f)}) = ${innerTxt}`]];
  if (p.m === 'if') { const inside = A.v >= R[0] - 1e-12 && A.v <= R[1] + 1e-12 && !(fn === 'tan' && Math.abs(Math.abs(A.v) - PI / 2) < 1e-12); steps.push(['Restricted domain', `${CA.piStr(A.f)} ${inside ? 'is' : 'is not'} in ${R[2]}`]); if (!inside) steps.push(['Find θ in the restricted domain', `${fn}(${ansTxt}) = ${innerTxt} too, and ${ansTxt} is in ${R[2]}`]); }
  else steps.push(['Outer inverse', `${fn}⁻¹(${innerTxt}) = ${ansTxt}${dIn !== null ? ' (special value)' : ' (calculator)'}`]);
  lab.steps(steps);
  lab.out(`${ex.textContent} = <b>${ansTxt}</b>. The gray angle is the original input; the orange angle is the answer on the green arc ${R[2]}.`, 'ca-correct');
});

/* ---------- 04 · f(g⁻¹(x)) with a triangle ---------- */
const TP = [['sin', 'tan', 6, 7, 'sin(tan⁻¹(6/7))'], ['cos', 'sin', -1, 5, 'cos(sin⁻¹(−1/5))'], ['tan', 'cos', -9, 12, 'tan(cos⁻¹(−9/12))'],
  ['cos', 'tan', -9, 4, 'cos(tan⁻¹(−9/4))'], ['sin', 'cos', 2, 3, 'sin(cos⁻¹(2/3))'], ['tan', 'sin', -3, 7, 'tan(sin⁻¹(−3/7))']];
CA.lab('tri-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Expression', value: '0', options: TP.map((p, i) => [String(i), p[4]]).concat([['own', 'Set your own']])},
    {type: 'select', key: 'f', label: 'Outer f', value: 'sin', options: [['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan']]}, {type: 'select', key: 'g', label: 'Inner g⁻¹', value: 'tan', options: [['sin', 'sin⁻¹'], ['cos', 'cos⁻¹'], ['tan', 'tan⁻¹']]},
    {type: 'number', key: 'p', label: 'Numerator', value: 6, step: 1}, {type: 'number', key: 'q', label: 'Denominator', value: 7, step: 1, min: 1}],
  top: '<div class="ca-equation" id="tri-expr"></div>', plot: {w: 520, h: 400}, plotLabel: 'Reference triangle for the inner angle', readouts: [['th', 'θ'], ['xyr', 'x, y, r'], ['ans', 'Result']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = TP[+st.pre]; st.set('f', p[0], true); st.set('g', p[1], true); st.set('p', p[2], true); st.set('q', p[3], true); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const f = st.f, g = st.g, p = st.p, q = st.q, ex = document.getElementById('tri-expr');
  const fail = m => { lab.out(m, 'ca-incorrect'); lab.steps([]); lab.plane({xmin: -5, xmax: 5, ymin: -4, ymax: 4}).render(); };
  if (!Number.isInteger(p) || !Number.isInteger(q) || q <= 0) return fail('Use an integer numerator and a positive integer denominator.');
  const a = F(p, q); ex.textContent = `${f}(${g}⁻¹(${a}))`;
  if (g !== 'tan' && Math.abs(a.v) > 1) return fail(`${g}⁻¹(${a}) is undefined because ${a} is not in [−1, 1].`);
  if (g !== 'tan' && Math.abs(a.v) === 1 || p === 0) return fail('Choose a value that is not 0 or ±1, so that θ is not on an axis.');
  let X, Y, Rr, how, quad;
  if (g === 'tan') { X = Rad.of(Math.abs(q)); Y = Rad.of(p * Math.sign(q)); Rr = Rad.sqrt(p * p + q * q); quad = p > 0 ? 'I' : 'IV'; how = `tan θ = y/x = ${a}: x = ${q}, y = ${p}; r = √(${q}² + ${p}²) = ${Rr.str()}`; }
  else if (g === 'sin') { Y = Rad.of(p); Rr = Rad.of(q); X = Rad.sqrt(q * q - p * p); quad = p > 0 ? 'I' : 'IV'; how = `sin θ = y/r = ${a}: y = ${p}, r = ${q}; x = √(${q}² − ${p}²) = ${X.str()} (x &gt; 0 in Quadrant ${quad})`; }
  else { X = Rad.of(p); Rr = Rad.of(q); Y = Rad.sqrt(q * q - p * p); quad = p > 0 ? 'I' : 'II'; how = `cos θ = x/r = ${a}: x = ${p}, r = ${q}; y = √(${q}² − ${p}²) = ${Y.str()} (y &gt; 0 in Quadrant ${quad})`; }
  const val = f === 'sin' ? Y.div(Rr) : f === 'cos' ? X.div(Rr) : Y.div(X);
  const R0 = Rr.v, P = lab.plane({xmin: -1.3 * R0, xmax: 1.3 * R0, ymin: -1.2 * R0, ymax: 1.2 * R0});
  P.param(t => R0 * Math.cos(t), t => R0 * Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.2, dash: '4 5'});
  P.seg(0, 0, X.v, 0, {color: 'blue', width: 4}).seg(X.v, 0, X.v, Y.v, {color: 'green', width: 4}).seg(0, 0, X.v, Y.v, {color: 'orange', width: 3});
  P.label(X.v / 2, 0, `x = ${X.str()}`, {color: 'blue', anchor: 'middle', dx: 0, dy: Y.v > 0 ? 18 : -10}).label(X.v, Y.v / 2, `y = ${Y.str()}`, {color: 'green', anchor: X.v > 0 ? 'start' : 'end', dx: 8}).label(X.v / 2, Y.v / 2, `r = ${Rr.str()}`, {color: 'orange', anchor: X.v > 0 ? 'end' : 'start', dx: -8, dy: Y.v > 0 ? -8 : 16});
  P.point(X.v, Y.v, {color: 'orange', r: 6}).render();
  lab.read('th', `${g}⁻¹(${a}) ≈ ${num(CA.INV[g].f(a.v), 4)}, Quadrant ${quad}`); lab.read('xyr', `${X.str()}, ${Y.str()}, ${Rr.str()}`); lab.read('ans', val.html());
  lab.steps([['Let θ = ' + g + '⁻¹(' + a + ')', `${g} θ = ${a} and θ is in ${{sin: '[−π/2, π/2]', cos: '[0, π]', tan: '(−π/2, π/2)'}[g]}, so θ is in Quadrant ${quad}`], ['Sides', how], [`${f} θ`, `${f} θ = ${f === 'sin' ? 'y/r' : f === 'cos' ? 'x/r' : 'y/x'} = ${val.str()}`]]);
  lab.out(`${ex.textContent} = <b>${val.html()}</b> ≈ ${num(val.v, 4)}. Check: ${f}(${g}⁻¹(${num(a.v, 4)})) on a calculator gives ${num(CA.trig[f](CA.INV[g].f(a.v)), 4)}.`, 'ca-correct');
});

/* ---------- guided problems ---------- */
const triFig = CA.triSVG({A: [0, 0], C: [6, 0], B: [6, 7]}, {right: 'C', angles: {A: 'θ'}, sides: {a: '7', b: '6'}});
CA.guided('63', [
  {q: 'What is sin⁻¹(1)?', opts: ['π/2', '0', 'π', '5π/2'], correct: 0, hint: 'Which angle in [−π/2, π/2] has sine 1?', why: 'sin(π/2) = 1 and π/2 is in [−π/2, π/2].'},
  {q: 'What is cos⁻¹(√3/2)?', opts: ['π/6', 'π/3', '−π/6', '11π/6'], correct: 0, hint: 'Look in [0, π].', why: 'cos(π/6) = √3/2.'},
  {q: 'What is tan⁻¹(−√3)?', opts: ['−π/3', '2π/3', '5π/3', '−π/6'], correct: 0, hint: 'The answer must be in (−π/2, π/2).', why: 'tan(−π/3) = −√3. 2π/3 and 5π/3 also have tangent −√3 but are outside the range.'},
  {q: 'What is sin⁻¹(−√2/2)?', opts: ['−π/4', '5π/4', '7π/4', '3π/4'], correct: 0, hint: 'Negative input: a negative angle in [−π/2, 0).', why: 'sin(−π/4) = −√2/2 and −π/4 is in [−π/2, π/2].', ref: {panel: 'evaluate', what: 'the value sin⁻¹(−√2/2)', body: '<p>Evaluate <b>sin⁻¹(−√2/2)</b>.</p>'}},
  {q: 'What is cos⁻¹(−√2/2)?', opts: ['3π/4', '−π/4', '5π/4', 'π/4'], correct: 0, hint: 'Negative input: Quadrant II for arccos.', why: 'cos(3π/4) = −√2/2 and 3π/4 is in [0, π].'},
  {q: 'What is the range of y = cos⁻¹x?', keep: true, opts: ['[−π/2, π/2]', '[0, π]', '(−π/2, π/2)', '[−1, 1]'], correct: 1, hint: 'It is the restricted domain of cosine.', why: 'cos is restricted to [0, π], so arccos returns angles in [0, π].'},
  {q: 'What is sin⁻¹(sin(5π/6))?', opts: ['π/6', '5π/6', '−π/6', '7π/6'], correct: 0, hint: '5π/6 is not in [−π/2, π/2].', why: 'sin(5π/6) = 1/2 = sin(π/6), and π/6 is in the restricted domain.', ref: {panel: 'compose', what: 'the value sin⁻¹(sin(5π/6))', body: '<p>Evaluate <b>sin⁻¹(sin(5π/6))</b>.</p>'}},
  {q: 'What is cos(cos⁻¹(5/3))?', opts: ['undefined', '5/3', '3/5', '1'], correct: 0, hint: 'Check the domain of cos⁻¹.', why: '5/3 is not in [−1, 1], so cos⁻¹(5/3) does not exist.'},
  {q: 'What is cos⁻¹(sin(7π/3))?', opts: ['π/6', 'π/3', '7π/3', '5π/6'], correct: 0, hint: 'sin(7π/3) = sin(π/3).', why: 'sin(7π/3) = √3/2 and cos⁻¹(√3/2) = π/6.'},
  {q: 'In the right triangle, θ = ?', fig: triFig, opts: ['≈ 49.4°', '≈ 40.6°', '≈ 41.2°', '≈ 59.0°'], correct: 0, hint: 'tan θ = opposite/adjacent = 7/6.', why: 'θ = tan⁻¹(7/6) ≈ 0.8622 rad ≈ 49.4°.'},
  {q: 'What is sin(tan⁻¹(6/7))?', opts: ['6√85/85', '7√85/85', '6/7', '√85/6'], correct: 0, hint: 'x = 7, y = 6, r = √85.', why: 'sin θ = y/r = 6/√85 = 6√85/85.', ref: {panel: 'triangle', what: 'the value sin(tan⁻¹(6/7))', body: '<p>Evaluate <b>sin(tan⁻¹(6/7))</b>.</p>'}}
]);
})();
