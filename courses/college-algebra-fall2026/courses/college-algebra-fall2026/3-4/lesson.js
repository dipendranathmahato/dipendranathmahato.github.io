/* Section 3.4 · Composition of Functions — interactive activities */
(() => {
'use strict';
const {fmt, num, Frac, F} = CA, P = CA.poly, S = p => P.str(p);
const signed = p => { const s = S(p); return s.startsWith('−') ? '− ' + s.slice(1) : '+ ' + s; };
const par = v => (typeof v === 'number' && v < 0) || (typeof v === 'string' && v.startsWith('−')) ? `(${typeof v === 'number' ? fmt(v) : v})` : (typeof v === 'number' ? fmt(v) : v);
const realRoots = p => { // exact real zeros of a polynomial of degree 1 or 2 with integer coefficients
  p = P.trim(p);
  if (p.length === 2) return [{v: -p[0] / p[1], t: F(-p[0], p[1]).toString()}];
  if (p.length === 3) {
    const [c, b, a] = p, D = b * b - 4 * a * c; if (D < 0) return [];
    const r = Math.sqrt(D);
    if (Number.isInteger(r)) return [...new Set([(-b - r), (-b + r)])].map(n => ({v: n / (2 * a), t: F(n, 2 * a).toString()})).sort((x, y) => x.v - y.v);
    return [-1, 1].map(s => ({v: (-b + s * r) / (2 * a), t: num((-b + s * r) / (2 * a))})).sort((x, y) => x.v - y.v);
  }
  return [];
};

/* ---------- 01 · function arithmetic ---------- */
const PAIRS = {a: {f: [3, 1], g: [-9, 0, 1]}, b: {f: [-1, 1], g: [-3, 2, 1]}, c: {f: [1, 2], g: [-4, 1]}};
CA.lab('combine-lab', {
  controls: [
    {type: 'select', key: 'pair', label: 'Functions', value: 'a', options: [['a', 'f(x) = x + 3, g(x) = x² − 9'], ['b', 'f(x) = x − 1, g(x) = x² + 2x − 3'], ['c', 'f(x) = 2x + 1, g(x) = x − 4']]},
    {type: 'seg', key: 'op', label: 'Operation', value: 'sum', options: [['sum', 'f + g'], ['diff', 'f − g'], ['rdiff', 'g − f'], ['prod', 'fg'], ['quot', 'f / g'], ['rquot', 'g / f']]},
    {type: 'range', key: 'x', label: 'Check at x =', min: -4, max: 4, step: 1, value: 2}
  ],
  plot: {h: 360}, plotLabel: 'Graphs of f, g, and the combined function',
  legend: [['blue', 'f', true], ['purple', 'g', true], ['orange', 'result']], steps: true
}, (lab, st) => {
  const {f, g} = PAIRS[st.pair], sf = S(f), sg = S(g), x = st.x, op = st.op;
  const fx = P.at(f, x), gx = P.at(g, x);
  let name, steps = [], res, evalRes, breaks = [], holes = [], vas = [], domainNote = '';
  if (op === 'sum' || op === 'diff' || op === 'rdiff') {
    const [A, B, nA, nB, sym] = op === 'sum' ? [f, g, 'f', 'g', '+'] : op === 'diff' ? [f, g, 'f', 'g', '−'] : [g, f, 'g', 'f', '−'];
    name = `(${nA} ${sym} ${nB})`; res = sym === '+' ? P.add(A, B) : P.sub(A, B);
    steps = [[`Write ${nA}(x) ${sym} ${nB}(x)`, `${name}(x) = (${S(A)}) ${sym} (${S(B)})`],
      [sym === '+' ? 'Remove the parentheses' : 'Distribute the minus sign', `= ${S(A)} ${signed(sym === '+' ? B : P.scale(B, -1))}`],
      ['Combine like terms', `= ${S(res)}`]];
    evalRes = t => P.at(res, t);
  } else if (op === 'prod') {
    name = '(fg)'; res = P.mul(f, g);
    const parts = []; for (let i = f.length - 1; i >= 0; i--) if (f[i]) { const mono = Array(i + 1).fill(0); mono[i] = f[i]; parts.push(P.mul(mono, g)); }
    steps = [['Multiply the outputs', `(fg)(x) = (${sf})(${sg})`],
      ['Distribute each term of f(x)', '= ' + parts.map((p, i) => i ? signed(p) : S(p)).join(' ')],
      ['Combine like terms', `= ${S(res)}`]];
    evalRes = t => P.at(res, t);
  } else {
    const [N, D, nN, nD] = op === 'quot' ? [f, g, 'f', 'g'] : [g, f, 'g', 'f'];
    name = `(${nN}/${nD})`; const zeros = realRoots(D);
    vas = zeros.map(z => z.v);
    steps = [['Divide the outputs', `${name}(x) = <span class="ca-frac"><span>${S(N)}</span><span>${S(D)}</span></span>`],
      ['Domain first: the denominator cannot be 0', `${S(D)} ≠ 0 → x ≠ ${zeros.map(z => z.t).join(', ')}`]];
    const d1 = P.divide(N, D), d2 = P.divide(D, N), zero = p => P.trim(p).every(c => Math.abs(c) < 1e-9);
    if (zero(d1.r)) { res = d1.q; steps.push(['Factor and cancel the common factor', `= ${S(res)}, &nbsp;x ≠ ${zeros.map(z => z.t).join(', ')}`]); holes = zeros.map(z => z.v); vas = []; evalRes = t => zeros.some(z => Math.abs(z.v - t) < 1e-9) ? NaN : P.at(res, t); }
    else if (zero(d2.r)) { steps.push(['Factor and cancel the common factor', `= <span class="ca-frac"><span>1</span><span>${S(d2.q)}</span></span>, &nbsp;x ≠ ${zeros.map(z => z.t).join(', ')}`]); const left = realRoots(d2.q).map(z => z.v); holes = zeros.map(z => z.v).filter(v => !left.some(l => Math.abs(l - v) < 1e-9)); vas = left; evalRes = t => zeros.some(z => Math.abs(z.v - t) < 1e-9) ? NaN : 1 / P.at(d2.q, t); }
    else { steps.push(['Check for common factors', 'There is no common factor, so the quotient does not simplify.']); evalRes = t => P.at(D, t) === 0 ? NaN : P.at(N, t) / P.at(D, t); }
    breaks = zeros.map(z => z.v);
    domainNote = ` Domain: all real numbers except ${zeros.map(z => z.t).join(' and ')}.`;
  }
  const Pl = lab.plane({xmin: -6, xmax: 6, ymin: -12, ymax: 12});
  Pl.curve(t => P.at(f, t), {color: 'blue', dash: '7 6', width: 2.4}).curve(t => P.at(g, t), {color: 'purple', dash: '7 6', width: 2.4});
  vas.forEach(v => Pl.vline(v, {color: 'gray'}));
  Pl.curve(evalRes, {color: 'orange', width: 3.4, breaks});
  holes.forEach(h => { const y = op === 'quot' || op === 'rquot' ? (res ? P.at(res, h) : null) : null; const yy = y ?? (() => { const e = 1e-6; return (evalRes(h - e) + evalRes(h + e)) / 2; })(); Pl.point(h, yy, {filled: false, color: 'orange', r: 6}); });
  const r = evalRes(x);
  if (Number.isFinite(r)) Pl.point(x, r, {color: 'orange', r: 7, label: `(${fmt(x)}, ${num(r)})`});
  Pl.render();
  lab.steps(steps);
  const sym = {sum: '+', diff: '−', rdiff: '−', prod: '·', quot: '/', rquot: '/'}[op];
  const [aV, bV, an, bn] = op === 'rdiff' || op === 'rquot' ? [gx, fx, 'g', 'f'] : [fx, gx, 'f', 'g'];
  const direct = op === 'sum' ? aV + bV : op === 'diff' || op === 'rdiff' ? aV - bV : op === 'prod' ? aV * bV : (bV === 0 ? NaN : aV / bV);
  lab.out(`<b>Check at x = ${fmt(x)}:</b> ${an}(${fmt(x)}) = ${fmt(aV)} and ${bn}(${fmt(x)}) = ${fmt(bV)}, so ${an}(${fmt(x)}) ${sym} ${bn}(${fmt(x)}) = ${Number.isFinite(direct) ? num(direct) : 'undefined (division by 0)'}. ` +
    (Number.isFinite(direct) ? `The simplified formula gives ${name}(${fmt(x)}) = ${num(r)} ✓.` : `The input x = ${fmt(x)} is <b>not</b> in the domain.`) + domainNote);
});

/* ---------- 02 · composition machine ---------- */
const FUN = {
  sq4: {p: [4, 0, 1], t: 'x² + 4', sub: s => `(${s})² + 4`},
  lin5: {p: [-1, 5], t: '5x − 1', sub: s => `5(${s}) − 1`},
  lin2: {p: [-1, 2], t: '2x − 1', sub: s => `2(${s}) − 1`},
  fivem: {p: [5, 0, -1], t: '5 − x²', sub: s => `5 − (${s})²`},
  quad3: {p: [0, -3, 1], t: 'x² − 3x', sub: s => `(${s})² − 3(${s})`},
  eight: {p: [8, -3], t: '8 − 3x', sub: s => `8 − 3(${s})`},
  three: {p: [3, -1], t: '3 − x', sub: s => `3 − (${s})`},
  plus4: {p: [4, 1], t: 'x + 4', sub: s => `(${s}) + 4`}
};
const opts = Object.entries(FUN).map(([k, v]) => [k, v.t]);
CA.lab('machine-lab', {
  controls: [
    {type: 'select', key: 'f', label: 'f(x) =', value: 'sq4', options: opts},
    {type: 'select', key: 'g', label: 'g(x) =', value: 'lin5', options: opts},
    {type: 'seg', key: 'ord', label: 'Order', value: 'fg', options: [['fg', 'f(g(x))'], ['gf', 'g(f(x))']]},
    {type: 'range', key: 'x', label: 'Input x =', min: -4, max: 4, step: 1, value: -2}
  ],
  top: '<div class="ca-chain" id="machine-chain" aria-live="polite"></div>', steps: true,
  bottom: '<div class="ca-side" id="machine-formulas"></div>'
}, (lab, st) => {
  const f = FUN[st.f], g = FUN[st.g], [outer, inner, on, inn] = st.ord === 'fg' ? [f, g, 'f', 'g'] : [g, f, 'g', 'f'], x = st.x;
  const u = P.at(inner.p, x), y = P.at(outer.p, u);
  document.getElementById('machine-chain').innerHTML = `<div class="ca-chain-box"><small>INPUT</small><b>x = ${fmt(x)}</b></div><span class="ca-chain-arrow">→</span><div class="ca-chain-box ca-chain-fn"><small>INNER</small><b>${inn}(x) = ${inner.t}</b></div><span class="ca-chain-arrow">→</span><div class="ca-chain-box"><small>${inn}(${fmt(x)})</small><b>${fmt(u)}</b></div><span class="ca-chain-arrow">→</span><div class="ca-chain-box ca-chain-fn"><small>OUTER</small><b>${on}(x) = ${outer.t}</b></div><span class="ca-chain-arrow">→</span><div class="ca-chain-box"><small>${on}(${inn}(${fmt(x)}))</small><b>${fmt(y)}</b></div>`;
  lab.steps([[`1 · Start inside: evaluate ${inn}(${fmt(x)})`, `${inn}(${fmt(x)}) = ${inner.sub(fmt(x))} = ${fmt(u)}`],
    [`2 · Use ${fmt(u)} as the input of ${on}`, `${on}(${inn}(${fmt(x)})) = ${on}(${fmt(u)}) = ${outer.sub(fmt(u))} = ${fmt(y)}`]]);
  lab.out(`Therefore <b>${on}(${inn}(${fmt(x)})) = ${fmt(y)}</b>. In the other order, ${inn}(${on}(${fmt(x)})) = ${inn}(${fmt(P.at(outer.p, x))}) = <b>${fmt(P.at(inner.p, P.at(outer.p, x)))}</b>.`);
  const box = (O, I, nO, nI, active) => `<div style="${active ? 'outline:3px solid #f0502366' : ''}"><small>${nO}(${nI}(x)) · replace x in ${nO} with ${nI}(x)</small>${nO}(${nI}(x)) = ${O.sub(I.t)}<br>= <b>${S(P.compose(O.p, I.p))}</b></div>`;
  document.getElementById('machine-formulas').innerHTML = box(f, g, 'f', 'g', st.ord === 'fg') + box(g, f, 'g', 'f', st.ord === 'gf');
});

/* ---------- 03 · composition from a table ---------- */
const TF = {1: 6, 2: 8, 3: 3, 4: 1}, TG = {1: 3, 2: 5, 3: 2, 4: 7}, T = {f: TF, g: TG};
CA.lab('table-comp-lab', {
  controls: [
    {type: 'seg', key: 'outer', label: 'Outer', value: 'f', options: [['f', 'f'], ['g', 'g']]},
    {type: 'seg', key: 'inner', label: 'Inner', value: 'g', options: [['f', 'f'], ['g', 'g']]},
    {type: 'seg', key: 'x', label: 'Input x', value: '1', options: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']]}
  ],
  top: '<div class="ca-scroll-x"><table class="ca-data-table" id="comp-table-t" aria-label="Values of f and g"></table></div>', steps: true
}, (lab, st) => {
  const x = +st.x, u = T[st.inner][x], has = u in T[st.outer], y = has ? T[st.outer][u] : null;
  document.getElementById('comp-table-t').innerHTML = '<tr><th>x</th><th>f(x)</th><th>g(x)</th></tr>' + [1, 2, 3, 4].map(r =>
    `<tr><td class="${r === x || (has && r === u) ? 'hl' : ''}">${r}</td>${['f', 'g'].map(c => `<td class="${r === x && c === st.inner ? 'hl2' : has && r === u && c === st.outer ? 'hl' : ''}">${T[c][r]}</td>`).join('')}</tr>`).join('');
  const expr = `${st.outer}(${st.inner}(${x}))`;
  lab.steps([[`1 · Inner value (blue cell): row x = ${x}, column ${st.inner}(x)`, `${st.inner}(${x}) = ${u}`],
    has ? [`2 · Outer value (orange cell): row x = ${u}, column ${st.outer}(x)`, `${expr} = ${st.outer}(${u}) = ${y}`] : [`2 · Look for x = ${u} in the table`, `x = ${u} is not in the table, so ${st.outer}(${u}) cannot be read here.`]]);
  lab.out(has ? `<b>${expr} = ${y}</b>` : `<b>${expr}</b> cannot be evaluated from this table: the inner output ${u} is not one of the listed inputs.`, has ? '' : 'ca-incorrect');
});

/* ---------- 04 · composition from graphs ---------- */
const GG = x => (x - 3) ** 2 - 1, GF = x => -((x - 3) ** 2) + 6, GR = {f: GF, g: GG};
const allowed = (o, i) => [0, 1, 2, 3, 4, 5, 6].filter(x => { const u = GR[i](x); return u >= 0 && u <= 6 && Number.isInteger(u); });
CA.lab('graph-comp-lab', {
  controls: [
    {type: 'seg', key: 'e', label: 'Expression', value: 'fg', options: [['fg', 'f(g(x))'], ['gf', 'g(f(x))']]},
    {type: 'select', key: 'x', label: 'Input x =', value: 1, options: allowed('f', 'g').map(v => [v, v])}
  ],
  top: '<div class="ca-two-plots"><figure><figcaption id="gc-cap1"></figcaption><svg id="gc-inner" role="img" aria-label="Inner function graph"></svg></figure><figure><figcaption id="gc-cap2"></figcaption><svg id="gc-outer" role="img" aria-label="Outer function graph"></svg></figure></div>', steps: true
}, (lab, st, key) => {
  const [o, i] = st.e === 'fg' ? ['f', 'g'] : ['g', 'f'];
  if (key === 'e') { const list = allowed(o, i); st.setOptions('x', list.map(v => [v, v]), list[0]); }
  const x = +st.x, u = GR[i](x), y = GR[o](u), win = {xmin: -0.5, xmax: 6.5, ymin: -4, ymax: 9, w: 420, h: 330, xstep: 1, ystep: 1};
  document.getElementById('gc-cap1').textContent = `Step 1 · inner graph ${i}(x)`; document.getElementById('gc-cap2').textContent = `Step 2 · outer graph ${o}(x)`;
  const A = CA.plane('gc-inner', win); A.curve(GR[i], {from: 0, to: 6, color: 'blue', width: 3.2}).point(0, GR[i](0), {color: 'blue', r: 5}).point(6, GR[i](6), {color: 'blue', r: 5});
  A.seg(x, 0, x, u, {color: 'orange', dash: '5 5'}).seg(x, u, -0.5, u, {color: 'orange', dash: '5 5'}).point(x, u, {color: 'orange', label: `(${x}, ${fmt(u)})`}).render();
  const B = CA.plane('gc-outer', win); B.curve(GR[o], {from: 0, to: 6, color: 'purple', width: 3.2}).point(0, GR[o](0), {color: 'purple', r: 5}).point(6, GR[o](6), {color: 'purple', r: 5});
  B.seg(u, 0, u, y, {color: 'orange', dash: '5 5'}).seg(u, y, -0.5, y, {color: 'orange', dash: '5 5'}).point(u, y, {color: 'orange', label: `(${fmt(u)}, ${fmt(y)})`}).render();
  lab.steps([[`1 · On the ${i} graph, go up from x = ${x}`, `${i}(${x}) = ${fmt(u)}`], [`2 · On the ${o} graph, go up from x = ${fmt(u)}`, `${o}(${i}(${x})) = ${o}(${fmt(u)}) = ${fmt(y)}`]]);
  lab.out(`<b>${o}(${i}(${x})) = ${fmt(y)}</b>. Only inputs whose inner output lands between 0 and 6 can be finished on these graphs, so the menu lists just those x-values.`);
});

/* ---------- 05 · domain of a composite ---------- */
const DOM = {
  A: {f: 'f(x) = 3/(x + 4)', g: 'g(x) = 7/(x − 2)', fe: u => 3 / (u + 4), fok: u => Math.abs(u + 4) > 1e-12, ge: x => 7 / (x - 2), gok: x => Math.abs(x - 2) > 1e-12, min: -5, max: 5, step: 1, x: 1,
    segs: [{a: null, b: 0.25}, {a: 0.25, b: 2}, {a: 2, b: null}], labels: [{x: 0.25, text: '1/4'}, {x: 2, text: '2'}],
    steps: ['Domain of g: x − 2 ≠ 0, so x ≠ 2.', 'Domain of f: x + 4 ≠ 0, so f cannot accept the input −4.', 'Remove x with g(x) = −4: 7/(x − 2) = −4 → 7 = −4x + 8 → x = 1/4.', 'Domain of f(g(x)): x ≠ 2 and x ≠ 1/4, that is (−∞, 1/4) ∪ (1/4, 2) ∪ (2, ∞).']},
  B: {f: 'f(x) = x² + 5', g: 'g(x) = (3x + 1)/(x − 6)', fe: u => u * u + 5, fok: () => true, ge: x => (3 * x + 1) / (x - 6), gok: x => Math.abs(x - 6) > 1e-12, min: -2, max: 10, step: 1, x: 2,
    segs: [{a: null, b: 6}, {a: 6, b: null}], labels: [{x: 6, text: '6'}],
    steps: ['Domain of g: x − 6 ≠ 0, so x ≠ 6.', 'Domain of f: all real numbers.', 'f accepts every output of g, so nothing else is removed.', 'Domain of f(g(x)): (−∞, 6) ∪ (6, ∞).']},
  C: {f: 'f(x) = √x', g: 'g(x) = x − 5', fe: u => Math.sqrt(u), fok: u => u >= 0, ge: x => x - 5, gok: () => true, min: 0, max: 10, step: 1, x: 3,
    segs: [{a: 5, b: null, ac: true}], labels: [{x: 5, text: '5'}],
    steps: ['Domain of g: all real numbers.', 'Domain of f: x ≥ 0 (no square roots of negatives).', 'Keep x with g(x) ≥ 0: x − 5 ≥ 0, so x ≥ 5.', 'Domain of f(g(x)): [5, ∞).']},
  D: {f: 'f(x) = 1/x', g: 'g(x) = x² − 4', fe: u => 1 / u, fok: u => Math.abs(u) > 1e-12, ge: x => x * x - 4, gok: () => true, min: -5, max: 5, step: 1, x: 2,
    segs: [{a: null, b: -2}, {a: -2, b: 2}, {a: 2, b: null}], labels: [{x: -2, text: '−2'}, {x: 2, text: '2'}],
    steps: ['Domain of g: all real numbers.', 'Domain of f: x ≠ 0.', 'Remove x with g(x) = 0: x² − 4 = 0, so x = −2 or x = 2.', 'Domain of f(g(x)): (−∞, −2) ∪ (−2, 2) ∪ (2, ∞).']}
};
CA.lab('domain-comp-lab', {
  controls: [
    {type: 'select', key: 'p', label: 'Functions', value: 'A', options: Object.entries(DOM).map(([k, v]) => [k, `${v.f} and ${v.g}`])},
    {type: 'number', key: 'x', label: 'Test input x =', value: 1, step: 0.25}
  ],
  top: '<svg id="domain-comp-line" role="img" aria-label="Domain of the composite function on a number line"></svg>', steps: true
}, (lab, st, key) => {
  const d = DOM[st.p]; if (key === 'p') st.set('x', d.x, true);
  CA.numberLine('domain-comp-line', {min: d.min, max: d.max, step: d.step, segments: d.segs, labels: d.labels});
  lab.steps(d.steps);
  const x = st.x; if (!Number.isFinite(x)) { lab.out('Type a number to test.'); return; }
  if (!d.gok(x)) { lab.out(`✕ Gate 1 fails: g(${num(x)}) is undefined, so x = ${num(x)} is not in the domain of f(g(x)).`, 'ca-incorrect'); return; }
  const u = d.ge(x);
  if (!d.fok(u)) { lab.out(`✓ Gate 1: g(${num(x)}) = ${num(u, 4)}. ✕ Gate 2 fails: f cannot accept ${num(u, 4)}, so x = ${num(x)} is not in the domain of f(g(x)).`, 'ca-incorrect'); return; }
  lab.out(`✓ Gate 1: g(${num(x)}) = ${num(u, 4)}. ✓ Gate 2: f(${num(u, 4)}) = ${num(d.fe(u), 4)}. So x = ${num(x)} is in the domain, and f(g(${num(x)})) = ${num(d.fe(u), 4)}.`, 'ca-correct');
});

CA.guided('34', [
  {q: 'f(x) = x + 2 and g(x) = x². Find (f + g)(3).', opts: ['14', '25', '11'], correct: 0, hint: 'Add f(3) and g(3).', why: 'f(3) = 5 and g(3) = 9, so (f + g)(3) = 14.'},
  {q: 'f(x) = x and g(x) = x + 1. Find (fg)(x).', opts: ['2x + 1', 'x² + x', 'x² + 1'], correct: 1, hint: 'Multiply x by (x + 1).', why: 'x(x + 1) = x² + x.'},
  {q: 'f(x) = x + 1 and g(x) = 3x. Find f(g(2)).', opts: ['9', '7', '6'], correct: 1, hint: 'Start inside: g(2).', why: 'g(2) = 6, then f(6) = 7.'},
  {q: 'Using the same functions, find g(f(2)).', opts: ['9', '7', '3'], correct: 0, hint: 'Now start with f(2).', why: 'f(2) = 3, then g(3) = 9. The order matters: f(g(2)) = 7 but g(f(2)) = 9.'},
  {q: 'For most pairs of functions, how do f(g(x)) and g(f(x)) compare?', opts: ['They are always equal', 'They are usually different', 'They are always opposites'], correct: 1, hint: 'Try f(x) = x + 1 and g(x) = 3x.', why: 'Composition is not commutative: in general f(g(x)) ≠ g(f(x)).'},
  {q: 'A table gives f(2) = 5 and g(5) = −1. Find g(f(2)).', opts: ['5', '−1', '2'], correct: 1, hint: 'Find f(2) first.', why: 'f(2) = 5, and g(5) = −1, so g(f(2)) = −1.'},
  {q: 'f(x) = x² and g(x) = x − 3. Find f(g(x)).', opts: ['x² − 3', 'x² − 6x + 9', 'x² + 9'], correct: 1, hint: 'Replace x in f with (x − 3).', why: 'f(g(x)) = (x − 3)² = x² − 6x + 9.'},
  {q: 'f(x) = √x and g(x) = x + 2. What is the domain of f(g(x))?', opts: ['[0, ∞)', '[−2, ∞)', '(−2, ∞)'], correct: 1, hint: 'We need g(x) ≥ 0.', why: 'x + 2 ≥ 0 gives x ≥ −2, so the domain is [−2, ∞).'},
  {q: 'f(x) = x + 1 and g(x) = x − 4. What is the domain of (f/g)(x)?', opts: ['x ≠ −1', 'x ≠ 4', 'all real numbers'], correct: 1, hint: 'The denominator g(x) cannot be 0.', why: 'g(x) = x − 4 = 0 when x = 4, so x ≠ 4.'},
  {q: 'f(x) = 2x + 1. Find f(f(1)).', opts: ['3', '7', '5'], correct: 1, hint: 'f(1) first, then apply f again.', why: 'f(1) = 3 and f(3) = 7.'}
]);
})();
