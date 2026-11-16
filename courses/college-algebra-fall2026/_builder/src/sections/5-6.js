/* Section 5.6 · Rational Functions — interactive activities */
(() => {
'use strict';
const {fmt, F} = CA, P = CA.poly, Frac = CA.Frac;

/* ===== a small exact engine for rational functions given in factored form =====
   L(a, b, m) = (ax + b)^m ;  Q(coeffs low→high, label, m) = an irreducible quadratic factor */
const L = (a, b, m = 1) => ({a, b, m}), Q = (q, s, m = 1) => ({q, s, m});
const isLin = f => !f.q && f.a !== 0;
const rootOf = f => F(-f.b, f.a);
const facPoly = f => f.q ? P.pow(f.q, f.m) : P.pow([f.b, f.a], f.m);
const polyOf = list => list.reduce((acc, f) => P.mul(acc, facPoly(f)), [1]);
const fpow = (x, m) => { let r = F(1, 1); for (let i = 0; i < m; i++) r = r.mul(x); return r; };
const hornerF = (c, x) => c.reduceRight((acc, ci) => acc.mul(x).add(ci), F(0, 1));
const evalF = (list, x) => list.reduce((acc, f) => acc.mul(fpow(f.q ? hornerF(f.q, x) : x.mul(f.a).add(f.b), f.m)), F(1, 1));
const evalN = (list, x) => list.reduce((acc, f) => acc * (f.q ? P.at(f.q, x) : f.a * x + f.b) ** f.m, 1);
const linStr = (a, b) => { const ax = a === 1 ? 'x' : a === -1 ? '−x' : `${fmt(a)}x`; return b === 0 ? ax : `${ax} ${b < 0 ? '−' : '+'} ${fmt(Math.abs(b))}`; };
const facStr = f => { const bare = !f.q && f.b === 0 && f.a === 1; return (bare ? 'x' : `(${f.q ? f.s : linStr(f.a, f.b)})`) + (f.m > 1 ? CA.sup(f.m) : ''); };
const prodStr = list => list.map(facStr).join('');
const frac = (t, b) => `<span class="ca-frac"><span>${t}</span><span>${b}</span></span>`;
const coefTop = (c, body) => body ? (c === 1 ? body : c === -1 ? '−' + body : fmt(c) + body) : fmt(c);
const lone = list => list.length === 1 && list[0].m === 1 && !list[0].q ? linStr(list[0].a, list[0].b) : null;
const formHTML = (num, den, K) => { const t = K.n === 1 && lone(num) ? lone(num) : coefTop(K.n, prodStr(num)), b = K.d === 1 ? (lone(den) || prodStr(den)) : (prodStr(den) ? fmt(K.d) + prodStr(den) : fmt(K.d)); return b ? frac(t, b) : t; };
const ftxt = r => r.d === 1 ? r.toString() : `(${r.toString()})`;
const rkey = r => r.toString();
const intervals = xs => { if (!xs.length) return '(−∞, ∞)'; const s = xs.map(x => x.toString()); return [`(−∞, ${s[0]})`].concat(s.slice(1).map((v, i) => `(${s[i]}, ${v})`), [`(${s[s.length - 1]}, ∞)`]).join(' ∪ '); };
const inf = s => s > 0 ? '∞' : '−∞';
const qStr = q => P.str(q, 'x', {numFmt: c => Frac.of(c).toString()});

function analyze(S) {
  let K = F(S.k ?? 1, S.kd ?? 1);
  const roots = list => { const m = new Map(); list.filter(isLin).forEach(f => { const r = rootOf(f), k = rkey(r), e = m.get(k) || {r, m: 0}; e.m += f.m; m.set(k, e); }); return m; };
  const nR = roots(S.num), dR = roots(S.den), excl = [...dR.values()].map(e => e.r).sort((p, q) => p.v - q.v);
  const num = S.num.map(f => ({...f})), den = S.den.map(f => ({...f})), common = [];
  dR.forEach((d, key) => {
    const n = nR.get(key); if (!n) return; const c = Math.min(n.m, d.m); common.push({r: d.r, c, mN: n.m, mD: d.m});
    [[num, 1], [den, -1]].forEach(([list, dir]) => { let left = c; list.forEach(f => { if (isLin(f) && rkey(rootOf(f)) === key && left > 0) { const t = Math.min(f.m, left); f.m -= t; left -= t; K = dir > 0 ? K.mul(fpow(F(f.a, 1), t)) : K.div(fpow(F(f.a, 1), t)); } }); });
  });
  const numR = num.filter(f => f.m > 0), denR = den.filter(f => f.m > 0);
  const f = x => K.v * evalN(numR, x) / evalN(denR, x);
  const holes = common.filter(c => c.mN >= c.mD).map(c => ({x: c.r, y: K.mul(evalF(numR, c.r)).div(evalF(denR, c.r))}));
  const xints = [...roots(numR).values()].filter(e => !dR.has(rkey(e.r))).sort((p, q) => p.r.v - q.r.v);
  const yint = dR.has('0') ? null : K.mul(evalF(numR, F(0, 1))).div(evalF(denR, F(0, 1)));
  const vas = [...roots(denR).values()].sort((p, q) => p.r.v - q.r.v).map(e => { const h = 1e-6 * Math.max(1, Math.abs(e.r.v)); return Object.assign(e, {left: Math.sign(f(e.r.v - h)), right: Math.sign(f(e.r.v + h))}); });
  const Np = polyOf(numR), Dp = polyOf(denR), n = Np.length - 1, d = Dp.length - 1;
  const N = Np.map(c => c * K.v);
  let asym;
  if (d === 0) asym = {type: 'poly', text: `After canceling, f is the polynomial y = ${qStr(P.scale(N, 1 / Dp[0]))} (except at its hole), so it has no asymptotes.`};
  else if (n < d) asym = {type: 'h', y: 0, case: 1, text: `Case 1: degree of numerator ${n} &lt; degree of denominator ${d}, so the horizontal asymptote is <b>y = 0</b>.`};
  else if (n === d) { const y = K.mul(Frac.of(Np[n])).div(Frac.of(Dp[d])); asym = {type: 'h', y: y.v, yF: y, case: 2, text: `Case 2: both degrees are ${n}. The horizontal asymptote is the ratio of leading coefficients: <b>y = ${y.toString()}</b>.`}; }
  else if (n === d + 1) { const dv = P.divide(N, Dp); asym = {type: 's', q: dv.q, case: 3, text: `Case 3: degree ${n} &gt; degree ${d}, so there is no horizontal asymptote. Dividing gives the quotient ${qStr(dv.q)}, so the slant asymptote is <b>y = ${qStr(dv.q)}</b>.`}; }
  else asym = {type: 'none', case: 3, text: `Case 3: degree ${n} &gt; degree ${d} + 1, so there is no horizontal or slant asymptote.`};
  return {S, K, num: numR, den: denR, excl, common, holes, xints, yint, vas, asym, f};
}
const origHTML = S => S.disp || formHTML(S.num, S.den, F(S.k ?? 1, S.kd ?? 1));
const expandedTxt = S => { const N = P.scale(polyOf(S.num), S.k ?? 1), D = P.scale(polyOf(S.den), S.kd ?? 1); return D.length === 1 && D[0] === 1 ? P.str(N) : `(${P.str(N)})/(${P.str(D)})`; };
function windowFor(R, extraX = []) {
  const xs = [0, ...extraX, ...R.xints.map(e => e.r.v), ...R.holes.map(h => h.x.v), ...R.vas.map(v => v.r.v)];
  const x0 = Math.min(-6, Math.min(...xs) - 3), x1 = Math.max(6, Math.max(...xs) + 3), vas = R.vas.map(v => v.r.v), n = 900, vals = [];
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; vals.push(vas.every(a => Math.abs(x - a) > 0.4) ? R.f(x) : null); }
  const ys = [0];
  for (let i = 1; i < n; i++) { const [a, b, c] = [vals[i - 1], vals[i], vals[i + 1]]; if ([a, b, c].every(v => v !== null && Number.isFinite(v)) && (b - a) * (c - b) < 0) ys.push(b); }
  R.holes.forEach(h => ys.push(h.y.v)); if (R.yint) ys.push(R.yint.v);
  if (R.asym.type === 'h') ys.push(R.asym.y - 2, R.asym.y + 2);
  if (R.asym.type === 's' || R.asym.type === 'poly') { const g = x => P.at(R.asym.q || R.S.poly || [0], x); if (R.asym.type === 's') ys.push(g(x0 + 2), g(x1 - 2)); }
  let lo = Math.min(...ys), hi = Math.max(...ys); if (hi - lo < 8) { const m = (hi + lo) / 2; lo = m - 4; hi = m + 4; }
  const pad = (hi - lo) * 0.3; return [x0, x1, lo - pad, hi + pad];
}

/* ===== the function library (examples used in class, plus a few originals) ===== */
const LIB = {
  e1a: {t: 'f(x) = 5x/(x² − 4)', k: 5, num: [L(1, 0)], den: [L(1, -2), L(1, 2)]},
  e1b: {t: 'g(x) = (x² + 3x + 2)/(x² + 9)', num: [L(1, 1), L(1, 2)], den: [Q([9, 0, 1], 'x² + 9')]},
  e1c: {t: 'r(x) = (2x + 3)/(4(x − 1)(x + 3))', num: [L(2, 3)], den: [L(1, -1), L(1, 3)], kd: 4},
  e1d: {t: 'y = (x + 6)(x + 9)/((x + 6)(x − 4))', num: [L(1, 6), L(1, 9)], den: [L(1, 6), L(1, -4)]},
  t1a: {t: 'y = −2x(x − 3)/(x²(x + 6))', k: -2, num: [L(1, 0), L(1, -3)], den: [L(1, 0, 2), L(1, 6)]},
  t1b: {t: 'h(x) = (6x³ − 5x)/(x² + 2x − 8)', num: [L(1, 0), Q([-5, 0, 6], '6x² − 5')], den: [L(1, 4), L(1, -2)], domainOnly: true},
  e2a: {t: 'f(x) = 3x(x − 5)/(−x(2x + 3))', k: -3, num: [L(1, 0), L(1, -5)], den: [L(1, 0), L(2, 3)], disp: frac('3x(x − 5)', '−x(2x + 3)')},
  e2b: {t: 't(x) = (x² − 6x + 5)/(x² − 1)', num: [L(1, -1), L(1, -5)], den: [L(1, -1), L(1, 1)]},
  e3b: {t: 'g(x) = (x² + x − 12)/(x² + 9x + 20)', num: [L(1, 4), L(1, -3)], den: [L(1, 4), L(1, 5)]},
  t3: {t: 'r(x) = 8x(x + 4)/(x² − 16)', k: 8, num: [L(1, 0), L(1, 4)], den: [L(1, -4), L(1, 4)]},
  e4a: {t: 'f(x) = −5/(3x − 1)', k: -5, num: [], den: [L(3, -1)]},
  e4b: {t: 'g(x) = (x² − 5x + 4)/((x² − 1)(x + 4))', num: [L(1, -1), L(1, -4)], den: [L(1, -1), L(1, 1), L(1, 4)]},
  e4c: {t: 'h(x) = (x² + 7x + 10)/(x + 5)', num: [L(1, 2), L(1, 5)], den: [L(1, 5)]},
  t4: {t: 'f(x) = (2x − 12)/(x(x² + 1)(x − 6))', k: 2, num: [L(1, -6)], den: [L(1, 0), Q([1, 0, 1], 'x² + 1'), L(1, -6)], disp: frac('2x − 12', 'x(x² + 1)(x − 6)')},
  c1: {t: 'f(x) = (4x + 2)/(x² + 4x − 5)', k: 2, num: [L(2, 1)], den: [L(1, 5), L(1, -1)]},
  c2: {t: 'f(x) = (3x² + 2)/(x² + 4x − 5)', num: [Q([2, 0, 3], '3x² + 2')], den: [L(1, 5), L(1, -1)]},
  c3: {t: 'f(x) = (3x² − 2x + 1)/(x − 1)', num: [Q([1, -2, 3], '3x² − 2x + 1')], den: [L(1, -1)]},
  e6: {t: 'f(x) = (x − 2)²(x + 3)/((x − 1)²(x² + 7x + 12))', num: [L(1, -2, 2), L(1, 3)], den: [L(1, -1, 2), L(1, 4), L(1, 3)], disp: frac('(x − 2)²(x + 3)', '(x − 1)²(x² + 7x + 12)')},
  t6: {t: 'f(x) = (x² + 5x + 4)/(x² − 9)', num: [L(1, 1), L(1, 4)], den: [L(1, -3), L(1, 3)]}
};
const pick = keys => keys.map(k => [k, LIB[k].t]);

/* ---------- 01 · domain lab ---------- */
CA.lab('dom-lab', {
  controls: [{type: 'select', key: 'f', label: 'Function', value: 'e1a', options: pick(['e1a', 'e1b', 'e1c', 'e1d', 't1a', 't1b'])}, {type: 'number', key: 'x', label: 'Test an input x =', value: 2, step: 1}],
  middle: '<svg id="dom-line" role="img" aria-label="Domain on a number line"></svg>', readouts: [['fx', 'Function'], ['ex', 'Denominator = 0 at'], ['dom', 'Domain']], steps: true
}, (lab, st) => {
  const S = LIB[st.f], R = analyze(S), K = F(S.k ?? 1, S.kd ?? 1);
  lab.read('fx', `f(x) = ${origHTML(S)}`); lab.read('ex', R.excl.length ? R.excl.map(r => 'x = ' + r).join(', ') : 'no real x'); lab.read('dom', intervals(R.excl));
  const span = Math.max(6, ...R.excl.map(r => Math.abs(r.v) + 2)), step = span > 8 ? 2 : 1, mn = -Math.ceil(span / step) * step, mx = -mn;
  const segs = R.excl.length ? [null, ...R.excl.map(r => r.v)].map((a, i, arr) => ({a, b: i + 1 < arr.length ? arr[i + 1] : null})) : [{a: null, b: null}];
  CA.numberLine('dom-line', {min: mn, max: mx, step, segments: segs.map(s => ({a: s.a, b: s.b, color: 'blue'})), labels: R.excl.map(r => ({x: r.v, text: `x ≠ ${r}`, color: 'red'}))});
  const steps = [['Set the denominator ≠ 0', `${S.disp ? S.disp.match(/<span>([^<]*)<\/span><\/span>$/)[1] : (S.kd && S.kd !== 1 ? fmt(S.kd) : '') + prodStr(S.den)} ≠ 0`]];
  S.den.forEach(fc => steps.push(fc.q ? ['Irreducible factor', `${fc.s} is never 0 for real x, so it excludes nothing`] : ['Factor ≠ 0', `${linStr(fc.a, fc.b)} ≠ 0 → x ≠ ${rootOf(fc)}`]));
  steps.push(['Domain', intervals(R.excl)]); lab.steps(steps);
  const x = st.x; if (!Number.isFinite(x)) { lab.out('Type a number to test.'); return; }
  const xf = Frac.of(x);
  if (R.excl.some(r => r.eq(xf))) lab.out(`x = ${fmt(x)} makes the denominator 0, so f(${fmt(x)}) is <b>undefined</b>. It is not in the domain.`, 'ca-incorrect');
  else { const v = K.mul(evalF(S.num, xf)).div(evalF(S.den, xf)); lab.out(`x = ${fmt(x)} is in the domain: f(${fmt(x)}) = ${v.html()}${v.isInt() ? '' : ' ≈ ' + CA.num(v.v, 4)}.`, 'ca-correct'); }
});

/* ---------- 02 · hole tracer ---------- */
const HS = [1, 0.5, 0.1, 0.01, 0.001];
CA.lab('hole-lab', {
  controls: [{type: 'select', key: 'f', label: 'Function', value: 'e2b', options: pick(['e2b', 'e2a', 'e3b', 'e4c', 't3'])},
    {type: 'seg', key: 'side', label: 'Approach from', value: 'L', options: [['L', 'the left'], ['R', 'the right']]},
    {type: 'range', key: 'h', label: 'Distance from the hole', min: 0, max: 4, value: 0, fmt: i => String(HS[i])}],
  plot: {h: 340}, plotLabel: 'Graph near a hole', readouts: [['fx', 'Factored'], ['red', 'Reduced'], ['x', 'x'], ['y', 'f(x)']], steps: true
}, (lab, st) => {
  const S = LIB[st.f], R = analyze(S), H = R.holes[0], a = H.x.v, hv = HS[st.h], x = st.side === 'L' ? a - hv : a + hv, y = R.f(x);
  const yy = [H.y.v, R.f(a - 1), R.f(a + 1)].filter(Number.isFinite), lo = Math.min(...yy), hi = Math.max(...yy), pad = Math.max(2, (hi - lo) * 0.6);
  const Pl = lab.plane({xmin: a - 3, xmax: a + 3, ymin: lo - pad, ymax: hi + pad});
  Pl.curve(R.f, {color: 'orange', width: 3.2, breaks: R.vas.map(v => v.r.v)});
  R.vas.forEach(v => Pl.vline(v.r.v, {color: 'purple', dash: '6 5'}));
  Pl.vline(a, {color: 'gray', dash: '3 5'}).point(x, y, {color: 'blue', r: 6}).point(a, H.y.v, {filled: false, color: 'purple', r: 7, label: `hole (${H.x}, ${H.y})`, labelOpt: {dy: -14}}).render();
  lab.read('fx', `${S.disp ? S.disp : formHTML(S.num, S.den, F(S.k ?? 1, S.kd ?? 1))}`); lab.read('red', formHTML(R.num, R.den, R.K) + `, x ≠ ${H.x}`); lab.read('x', CA.num(x, 4)); lab.read('y', CA.num(y, 5));
  const tbl = HS.map(h => st.side === 'L' ? a - h : a + h).map(xv => `f(${CA.num(xv, 4)}) ≈ ${CA.num(R.f(xv), 5)}`);
  lab.steps([['1 · Factor and find the common factor', `common factor ${facStr(L(1, -a))} → x = ${H.x} is excluded from the domain`], ['2 · Cancel it', `reduced form: ${formHTML(R.num, R.den, R.K)}`], ['3 · Height of the hole', `evaluate the reduced form at x = ${H.x}: ${H.y.html()}`], ['Outputs approaching the hole', tbl.join(' · ')]]);
  lab.out(`As x → ${ftxt(H.x)}${st.side === 'L' ? '⁻' : '⁺'}, f(x) → ${H.y}. But f(${H.x}) is undefined, so the graph has an open circle (a hole) at (${H.x}, ${H.y}).`);
});

/* ---------- 03 · arrow notation on 1/x ---------- */
const NEAR = [1, 0.5, 0.2, 0.1, 0.01, 0.001], FAR = [1, 2, 5, 10, 100, 1000];
CA.lab('arrow-lab', {
  controls: [{type: 'seg', key: 'fn', label: 'Function', value: '1', options: [['1', 'y = 1/x'], ['2', 'y = 1/x²']]},
    {type: 'seg', key: 'dir', label: 'Where does x go?', value: '0-', options: [['0-', 'x → 0⁻'], ['0+', 'x → 0⁺'], ['-inf', 'x → −∞'], ['inf', 'x → ∞']]},
    {type: 'range', key: 'i', label: 'Step', min: 0, max: 5, value: 0}],
  plot: {h: 340}, plotLabel: 'Graph of 1/x or 1/x² with a moving point', readouts: [['x', 'x'], ['y', 'f(x)'], ['arrow', 'Arrow notation']], bottom: '<div class="ca-scroll-x"><table class="ca-data-table" id="arrow-table" aria-label="Table of values"></table></div>'
}, (lab, st) => {
  const p = Number(st.fn), f = x => 1 / x ** p, near = st.dir.startsWith('0'), sgn = st.dir === '0-' || st.dir === '-inf' ? -1 : 1;
  const xs = (near ? NEAR : FAR).map(v => sgn * v), x = xs[st.i], y = f(x);
  const Pl = lab.plane({xmin: -6, xmax: 6, ymin: -6, ymax: 6});
  Pl.curve(f, {color: 'orange', width: 3.2, breaks: [0], arrows: true}).hline(0, {color: 'purple', dash: '6 5'}).vline(0, {color: 'purple', dash: '6 5'});
  if (Pl.inside(x, y)) Pl.point(x, y, {color: 'blue', r: 7});
  else { const cx = Math.max(-5.7, Math.min(5.7, x)), cy = Math.max(-5.7, Math.min(5.7, y)); Pl.point(cx, cy, {color: 'blue', r: 7, label: 'off screen', labelOpt: {dy: cy > 0 ? 22 : -14}}); }
  Pl.render();
  const lim = near ? (p === 2 ? '∞' : inf(sgn)) : '0';
  lab.read('x', CA.num(x, 4)); lab.read('y', CA.comma(y, 6)); lab.read('arrow', `as x → ${{'0-': '0⁻', '0+': '0⁺', '-inf': '−∞', inf: '∞'}[st.dir]}, f(x) → ${lim}`);
  document.getElementById('arrow-table').innerHTML = `<tr><th>x</th>${xs.map((v, j) => `<td class="${j === st.i ? 'hl' : ''}">${CA.num(v, 4)}</td>`).join('')}</tr><tr><th>f(x)</th>${xs.map((v, j) => `<td class="${j === st.i ? 'hl' : ''}">${CA.comma(f(v), 6)}</td>`).join('')}</tr>`;
  lab.out(near ? `As x gets closer to 0 from the ${sgn < 0 ? 'left' : 'right'}, the outputs ${lim === '∞' ? 'grow' : 'fall'} without bound. That is the signature of the <b>vertical asymptote x = 0</b>.${p === 2 ? ' For 1/x², both sides go to ∞ because x² is positive on both sides.' : ''}` : `As x moves ${sgn < 0 ? 'left' : 'right'} without bound, the outputs approach 0. That is the signature of the <b>horizontal asymptote y = 0</b>.`);
});

/* ---------- 04 · vertical asymptote multiplicity ---------- */
CA.lab('va-lab', {
  controls: [{type: 'range', key: 'm', label: 'Multiplicity m of (x − 1) in the denominator', min: 1, max: 4, value: 1}, {type: 'seg', key: 's', label: 'Numerator', value: '1', options: [['1', '1'], ['-1', '−1']]}],
  plot: {h: 400}, plotLabel: 'Graph near the vertical asymptote x = 1', readouts: [['fx', 'f(x)'], ['l', 'x → 1⁻'], ['r', 'x → 1⁺']]
}, (lab, st) => {
  const s = Number(st.s), f = x => s / (x - 1) ** st.m, Pl = lab.plane({xmin: -3, xmax: 5, ymin: -6, ymax: 6});
  Pl.curve(f, {color: 'orange', width: 3.4, breaks: [1], arrows: true}).vline(1, {color: 'purple', dash: '6 5'}).render();
  const l = Math.sign(f(0.999)), r = Math.sign(f(1.001));
  lab.read('fx', frac(s < 0 ? '−1' : '1', `(x − 1)${st.m > 1 ? CA.sup(st.m) : ''}`)); lab.read('l', `f(x) → ${inf(l)}`); lab.read('r', `f(x) → ${inf(r)}`);
  lab.out(st.m % 2 ? `Odd multiplicity ${st.m}: (x − 1)${st.m > 1 ? CA.sup(st.m) : ''} changes sign at x = 1, so the two sides go <b>opposite</b> ways.` : `Even multiplicity ${st.m}: (x − 1)${CA.sup(st.m)} is positive on both sides of 1, so both sides go the <b>same</b> way.`);
});
CA.cards('va-cards', [
  {expr: `${frac('x − 3', '(x − 3)(x + 1)')} at x = 3`, correct: 1, why: 'x − 3 cancels completely, so x = 3 is a hole.'},
  {expr: `${frac('x − 3', '(x − 3)(x + 1)')} at x = −1`, correct: 0, why: 'x + 1 stays in the reduced denominator, so x = −1 is a vertical asymptote.'},
  {expr: `${frac('x + 2', 'x² − 4')} at x = 2`, correct: 0, why: 'x² − 4 = (x − 2)(x + 2); after canceling x + 2, the factor x − 2 remains in the denominator.'},
  {expr: `${frac('x + 2', 'x² − 4')} at x = −2`, correct: 1, why: 'x + 2 cancels, so there is a hole at x = −2.'},
  {expr: `${frac('x²', 'x(x − 5)')} at x = 0`, correct: 1, why: 'The numerator has x², the denominator only x: the multiplicity in the numerator is at least as large, so x = 0 is a hole (at height 0).'},
  {expr: `${frac('x', 'x²(x − 5)')} at x = 0`, correct: 0, why: 'After canceling one x, an x remains in the denominator, so x = 0 is a vertical asymptote.'},
  {expr: `${frac('x + 1', 'x² + 4')} at x = −2`, correct: 2, why: 'x² + 4 is never 0, and x = −2 is not a zero of the numerator either: f(−2) = −1/8 is an ordinary point.'}
], {options: ['vertical asymptote', 'hole', 'neither']});

/* ---------- 05 · horizontal and slant asymptotes ---------- */
const HA = {
  c1: {t: 'Case 1 · (4x + 2)/(x² + 4x − 5)', N: [2, 4], D: [-5, 4, 1]},
  c1b: {t: 'Case 1 · (3x − 5)/(x² − 3)', N: [-5, 3], D: [-3, 0, 1]},
  c2: {t: 'Case 2 · (3x² + 2)/(x² + 4x − 5)', N: [2, 0, 3], D: [-5, 4, 1]},
  c2b: {t: 'Case 2 · (−2x³ + x² − 9)/(5x³ − 6x + 1)', N: [-9, 0, 1, -2], D: [1, -6, 0, 5]},
  t5a: {t: '(4x³ − 7)/(−5x³ + x² − 1)', N: [-7, 0, 0, 4], D: [-1, 0, 1, -5]},
  t5b: {t: '8/(5x⁴ − 3x − 2)', N: [8], D: [-2, -3, 0, 0, 5]},
  c3: {t: 'Case 3 · (3x² − 2x + 1)/(x − 1)', N: [1, -2, 3], D: [-1, 1]},
  t5c: {t: '(3x² + 7x − 5)/(x + 2)', N: [-5, 7, 3], D: [2, 1]}
};
const realRoots = (p, a, b) => { const r = [], n = 4000; let x0 = a, y0 = P.at(p, a); for (let i = 1; i <= n; i++) { const x1 = a + (b - a) * i / n, y1 = P.at(p, x1); if (y0 === 0) r.push(x0); else if (y0 * y1 < 0) { let lo = x0, hi = x1; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (P.at(p, lo) * P.at(p, m) <= 0) hi = m; else lo = m; } r.push((lo + hi) / 2); } x0 = x1; y0 = y1; } return r; };
const W = [5, 10, 25, 100, 500];
CA.lab('ha-lab', {
  controls: [{type: 'select', key: 'f', label: 'Rational function', value: 'c1', options: Object.entries(HA).map(([k, v]) => [k, v.t])}, {type: 'range', key: 'w', label: 'Window: x from −w to w, w =', min: 0, max: 4, value: 0, fmt: i => String(W[i])}],
  plot: {h: 360}, plotLabel: 'Rational function and its end-behavior asymptote', legend: [['orange', 'f(x)'], ['blue', 'asymptote', true]],
  readouts: [['deg', 'Degrees (n, d)'], ['case', 'Case'], ['asym', 'Asymptote']], steps: true
}, (lab, st) => {
  const H = HA[st.f], n = H.N.length - 1, d = H.D.length - 1, f = x => P.at(H.N, x) / P.at(H.D, x), w = W[st.w], br = realRoots(H.D, -w * 1.05, w * 1.05);
  let g, txt, cs, steps;
  if (n < d) { cs = 1; g = () => 0; txt = 'y = 0'; steps = [['Compare degrees', `n = ${n} &lt; d = ${d}`], ['Leading-term ratio', `${P.str([0, ...Array(n).fill(0)].map((c, i) => i === n ? H.N[n] : 0))} / ${P.str(Array(d + 1).fill(0).map((c, i) => i === d ? H.D[d] : 0))} → 0 as x → ±∞`]]; }
  else if (n === d) { cs = 2; const r = F(H.N[n], H.D[d]); g = () => r.v; txt = `y = ${r}`; steps = [['Compare degrees', `n = d = ${n}`], ['Ratio of leading coefficients', `${fmt(H.N[n])}/${fmt(H.D[d])} = ${r}`]]; }
  else { cs = 3; const q = P.divide(H.N, H.D); g = x => P.at(q.q, x); txt = `y = ${qStr(q.q)}`; steps = [['Compare degrees', `n = ${n} &gt; d = ${d}: no horizontal asymptote`], ['Divide numerator by denominator', `quotient ${qStr(q.q)}, remainder ${qStr(q.r)}`], ['Slant asymptote', txt]]; }
  let y0, y1;
  if (cs < 3) { const c = g(0), hh = Math.max(4, Math.abs(c) * 3); y0 = c - hh; y1 = c + hh; } else { const a = g(-w), b = g(w), lo = Math.min(a, b), hi = Math.max(a, b), pad = (hi - lo) * 0.25 + 4; y0 = lo - pad; y1 = hi + pad; }
  const Pl = lab.plane({xmin: -w, xmax: w, ymin: y0, ymax: y1});
  Pl.curve(g, {color: 'blue', dash: '8 6', width: 2.4}).curve(f, {color: 'orange', width: 3, breaks: br, samples: 2400});
  br.forEach(r => Pl.vline(r, {color: 'purple', dash: '5 5'})); Pl.render();
  lab.read('deg', `n = ${n}, d = ${d}`); lab.read('case', `Case ${cs}`); lab.read('asym', cs === 3 ? `slant: ${txt}` : `horizontal: ${txt}`);
  lab.steps(steps.concat([['Check far away', [10, 100, 1000].map(x => `f(${x}) ≈ ${CA.num(f(x), 4)} vs ${CA.num(g(x), 4)}`).join(' · ')]]));
  lab.out(w < 25 ? 'Near the origin the graph can wander, even crossing the asymptote. Zoom out to see the end behavior.' : `Zoomed out, the graph hugs ${txt}: the rest of the formula hardly matters far from the origin.`);
});

/* ---------- 06 · the 8-step analyzer ---------- */
const RAT = ['e6', 't6', 'e1d', 'e2b', 'e3b', 'e4a', 'e4b', 'e4c', 't4', 'c1', 'c2', 'c3', 't3'];
let ratStep = 0, ratStepper;
const rat = CA.lab('rat-lab', {
  controls: [{type: 'select', key: 'f', label: 'Rational function', value: 'e6', options: pick(RAT)}, {type: 'check', key: 'ghost', label: 'Show the finished graph faintly', value: false}],
  top: '<div id="rat-stepper"></div>', plot: {h: 420}, plotLabel: 'Rational function built step by step', middle: '<div class="ca-feedback" id="rat-say" aria-live="polite"></div>', out: false, steps: true
}, (lab, st, key) => { if (!ratStepper) return; if (key === 'f') ratStepper.reset(); else drawRat(lab); });
const TITLES = ['Factor', 'Domain', 'Reduce', 'Holes', 'Intercepts', 'Vertical asymptotes', 'Horizontal or slant asymptote', 'Sketch'];
function ratSteps(R) {
  const S = R.S, mult = m => m % 2 ? 'odd, the graph crosses' : 'even, the graph bounces';
  return [
    `f(x) = ${origHTML(S)} = ${formHTML(S.num, S.den, F(S.k ?? 1, S.kd ?? 1))}`,
    R.excl.length ? `Denominator ≠ 0 → x ≠ ${R.excl.join(', x ≠ ')}. Domain: ${intervals(R.excl)}` : 'The denominator is never 0. Domain: (−∞, ∞)',
    R.common.length ? `Cancel ${R.common.map(c => facStr(L(c.r.d, -c.r.n, c.c))).join(' and ')}: f(x) = ${formHTML(R.num, R.den, R.K)}` : `No common factors, so f(x) = ${formHTML(R.num, R.den, R.K)} is already reduced.`,
    R.holes.length ? R.holes.map(h => `Hole at x = ${h.x}: the reduced form gives f(${h.x}) = ${h.y}, so an open circle at (${h.x}, ${h.y}).`).join(' ') : 'No holes.',
    `${R.xints.length ? 'x-intercepts: ' + R.xints.map(e => `(${e.r}, 0), multiplicity ${e.m} (${mult(e.m)})`).join('; ') : 'No x-intercepts: the reduced numerator is never 0.'} ${R.yint ? `y-intercept: f(0) = ${R.yint}, so (0, ${R.yint}).` : 'x = 0 is not in the domain, so there is no y-intercept.'}`,
    R.vas.length ? R.vas.map(v => `x = ${v.r} (multiplicity ${v.m}): as x → ${ftxt(v.r)}⁻, f(x) → ${inf(v.left)}; as x → ${ftxt(v.r)}⁺, f(x) → ${inf(v.right)}.`).join(' ') : 'No vertical asymptotes: the reduced denominator is never 0.',
    R.asym.text,
    'Draw each branch: follow the asymptotes, pass through the intercepts (crossing or bouncing), and leave open circles at the holes.'
  ];
}
function drawRat(lab) {
  const R = analyze(LIB[lab.state.f]), i = ratStep, [x0, x1, y0, y1] = windowFor(R), Pl = lab.plane({xmin: x0, xmax: x1, ymin: y0, ymax: y1}), vb = R.vas.map(v => v.r.v);
  if (lab.state.ghost && i < 7) Pl.curve(R.f, {color: 'gray', width: 1.6, breaks: vb});
  if (i >= 1 && i < 3) R.excl.forEach(r => Pl.point(r.v, 0, {filled: false, color: 'red', r: 6, label: `x ≠ ${r}`, labelOpt: {dy: -12, size: 12}}));
  if (i >= 5) R.vas.forEach(v => Pl.vline(v.r.v, {color: 'purple', dash: '7 6'}));
  if (i >= 6) { if (R.asym.type === 'h') Pl.hline(R.asym.y, {color: 'blue', dash: '7 6'}); if (R.asym.type === 's') Pl.lineMB(R.asym.q[1] || 0, R.asym.q[0] || 0, {color: 'blue', dash: '7 6'}); }
  if (i >= 7) Pl.curve(R.f, {color: 'orange', width: 3.4, breaks: vb, arrows: true});
  if (i >= 4) { R.xints.forEach(e => Pl.point(e.r.v, 0, {color: 'blue', r: 6, label: `(${e.r}, 0)`, labelOpt: {dy: 22, size: 12}})); if (R.yint) Pl.point(0, R.yint.v, {color: 'green', r: 6, label: `(0, ${R.yint})`, labelOpt: {size: 12}}); }
  if (i >= 3) R.holes.forEach(h => Pl.point(h.x.v, h.y.v, {filled: false, color: 'purple', r: 7, label: `hole (${h.x}, ${h.y})`, labelOpt: {dy: -14, size: 12}}));
  Pl.render();
  const T = ratSteps(R);
  document.getElementById('rat-say').innerHTML = `<b>Step ${i + 1} · ${TITLES[i]}.</b> ${T[i]}`;
  lab.steps(T.slice(0, i + 1).map((t, j) => [`${j + 1} · ${TITLES[j]}`, t]));
}
ratStepper = CA.stepper('rat-stepper', () => 8, j => { ratStep = j; drawRat(rat); }, {labels: j => TITLES[j]});

CA.guided('56', [
  {ref: {panel: "domain", what: "the function f(x) = 5x/(x\u00b2 \u2212 4)", body: "<p>Activity 01 starts with this function and lets you test inputs to see which ones are allowed:</p><div class=\"ca-ref-eq\">f(x) = 5x/(x\u00b2 \u2212 4)</div>"}, q: 'What is the domain of f(x) = 5x/(x² − 4)?', opts: ['(−∞, −2) ∪ (−2, 2) ∪ (2, ∞)', '(−∞, 4) ∪ (4, ∞)', '(−∞, ∞)'], correct: 0, hint: 'Set x² − 4 ≠ 0.', why: 'x² − 4 = 0 at x = ±2, so both are excluded.'},
  {q: 'Where does f(x) = (x − 2)(x + 1)/((x − 2)(x − 5)) have a hole?', opts: ['x = 2', 'x = 5', 'x = −1'], correct: 0, hint: 'Look for a factor that cancels.', why: 'x − 2 cancels completely, leaving a hole at x = 2.'},
  {ref: {panel: "graphing", what: "the function f(x) = \u22125/(3x \u2212 1)", body: "<p>This function is in the menu of activity 06, which graphs a rational function in 8 steps:</p><div class=\"ca-ref-eq\">f(x) = \u22125/(3x \u2212 1)</div>"}, q: 'What is the vertical asymptote of f(x) = −5/(3x − 1)?', opts: ['x = 1/3', 'x = −5', 'x = 3'], correct: 0, hint: 'Solve 3x − 1 = 0.', why: '3x − 1 = 0 gives x = 1/3.'},
  {q: 'What is the horizontal asymptote of f(x) = (6x² − 1)/(2x² + x)?', opts: ['y = 3', 'y = 0', 'y = 6'], correct: 0, hint: 'Same degree: use the leading coefficients.', why: 'Degrees are equal, so y = 6/2 = 3.'},
  {ref: {panel: "horizontal", what: "the function 8/(5x\u2074 \u2212 3x \u2212 2)", body: "<p>Activity 05 includes this function in its menu of functions to test for horizontal and slant asymptotes:</p><div class=\"ca-ref-eq\">g(x) = 8/(5x\u2074 \u2212 3x \u2212 2)</div>"}, q: 'What is the horizontal asymptote of g(x) = 8/(5x⁴ − 3x − 2)?', opts: ['y = 8/5', 'y = 0', 'none'], correct: 1, hint: 'Compare degrees 0 and 4.', why: 'The numerator has lower degree, so y = 0 (Case 1).'},
  {q: 'Which function has a slant asymptote?', opts: ['(x² + 1)/(x − 3)', '(x + 1)/(x² − 3)', '(x² + 1)/(x² − 3)'], correct: 0, hint: 'Numerator degree = denominator degree + 1.', why: 'Degree 2 over degree 1 gives a slant asymptote.'},
  {q: 'For f(x) = 1/(x − 2)², as x → 2⁻, f(x) → ?', opts: ['∞', '−∞', '0'], correct: 0, hint: 'An even power is positive on both sides.', why: '(x − 2)² is a small positive number near 2, so f(x) → ∞ from both sides.'},
  {q: 'What is the y-intercept of g(x) = (x − 3)/(x + 5)?', opts: ['(0, −3/5)', '(0, 3/5)', '(3, 0)'], correct: 0, hint: 'Evaluate g(0).', why: 'g(0) = −3/5.'},
  {q: 'What is the x-intercept of f(x) = (x + 4)(x − 3)/((x + 4)(x + 5))?', opts: ['(3, 0)', '(3, 0) and (−4, 0)', '(−5, 0)'], correct: 0, hint: 'x = −4 is not in the domain.', why: 'After canceling, only x − 3 = 0 gives an intercept; x = −4 is a hole, not an intercept.'},
  {ref: {panel: "arrows", what: "the graph of y = 1/x", body: "<p>Activity 03 uses <b>y = 1/x</b>: move x toward \u221e, \u2212\u221e, 0\u207b or 0\u207a and read where y goes.</p>", plot: {win: {xmin: -6, xmax: 6, ymin: -5, ymax: 5}, draw: P => P.curve(x => 1 / x, {color: "orange", width: 3.5, breaks: [0], arrows: true}), label: "Graph of y = 1/x"}}, q: 'Using arrow notation for y = 1/x, as x → ∞, f(x) → ?', opts: ['∞', '0', '1'], correct: 1, hint: 'Large x gives tiny 1/x.', why: 'The outputs approach 0, the horizontal asymptote.'}
]);
})();
