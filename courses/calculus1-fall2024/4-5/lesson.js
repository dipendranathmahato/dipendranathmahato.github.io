/* Section 4.5 · Derivatives and the Shape of a Graph — interactive activities */
(() => {
'use strict';
const {num} = CA;
const nx = v => CA.niceX(v, 3);
const d1 = f => x => CA.deriv(f, x, 1e-5), d2 = f => x => CA.deriv2(f, x, 1e-3);
/* zeros of g on (a, b) by sign change */
const zeros = (g, a, b, n = 2000) => { const z = []; let px = a, pv = g(a); for (let i = 1; i <= n; i++) { const x = a + (b - a) * Math.min(1, (i + 0.37) / n), v = g(x); if (Number.isFinite(v) && Number.isFinite(pv) && pv * v < 0) { let l = px, r = x; for (let k = 0; k < 60; k++) { const m = (l + r) / 2; if (g(l) * g(m) <= 0) r = m; else l = m; } z.push((l + r) / 2); } px = x; pv = v; } return z; };
/* sign chart: cuts are x-values; rows are [name, g, words(+), words(−)] */
const chart = (cuts, a, b, rows, bounded) => {
  const xs = [a, ...cuts, b], ivs = xs.slice(0, -1).map((x, i) => [x, xs[i + 1]]);
  const lab = ([l, r], i) => `${i === 0 && bounded ? '[' : '('}${i === 0 ? (bounded ? nx(l) : '−∞') : nx(l)}, ${i === ivs.length - 1 ? (bounded ? nx(r) : '∞') : nx(r)}${i === ivs.length - 1 && bounded ? ']' : ')'}`;
  return `<div class="ca-scroll-x"><table class="ca-data-table ca-sign-table"><tr><th>interval</th>${ivs.map((v, i) => `<th>${lab(v, i)}</th>`).join('')}</tr>${rows.map(([name, g, pos, neg]) => `<tr><th>${name}</th>${ivs.map(([l, r]) => { const v = g((l + r) / 2); return `<td class="${v > 0 ? 'ca-pos' : 'ca-neg'}">${v > 0 ? '+' : '−'} <small>${v > 0 ? pos : neg}</small></td>`; }).join('')}</tr>`).join('')}</table></div>`;
};

const FN = [
  {t: 'f(x) = 2x³ − 3x²', src: '2x^3 - 3x^2', f: x => 2 * x ** 3 - 3 * x * x, a: -1.2, b: 2, dT: 'f′(x) = 6x(x − 1)', ddT: 'f″(x) = 12x − 6'},
  {t: 'f(x) = x³ − 3x', src: 'x^3 - 3x', f: x => x ** 3 - 3 * x, a: -2.5, b: 2.5, dT: 'f′(x) = 3(x − 1)(x + 1)', ddT: 'f″(x) = 6x'},
  {t: 'f(x) = x⁴ − 4x³', src: 'x^4 - 4x^3', f: x => x ** 4 - 4 * x ** 3, a: -1.5, b: 4.5, dT: 'f′(x) = 4x²(x − 3)', ddT: 'f″(x) = 12x(x − 2)'},
  {t: 'f(x) = x/(x² + 1)', src: 'x/(x^2 + 1)', f: x => x / (x * x + 1), a: -5, b: 5, dT: 'f′(x) = (1 − x²)/(x² + 1)²', ddT: 'f″(x) = 2x(x² − 3)/(x² + 1)³'},
  {t: 'f(x) = x e⁻ˣ', src: 'x e^(-x)', f: x => x * Math.exp(-x), a: -1, b: 6, dT: 'f′(x) = (1 − x)e⁻ˣ', ddT: 'f″(x) = (x − 2)e⁻ˣ'},
  {t: 'f(x) = x + 2 sin x on [0, 2π]', src: 'x + 2sin(x)', f: x => x + 2 * Math.sin(x), a: 0, b: 2 * Math.PI, bounded: true, dT: 'f′(x) = 1 + 2 cos x', ddT: 'f″(x) = −2 sin x'}
];
const pick = (lab, st, key) => {
  let F = FN[+st.p];
  if (key === 'f') st.set('p', 'own', true);
  if (st.p === 'own') { const E = CA.expr(st.f); if (!E) return null; F = {f: E.f, a: -4, b: 4}; }
  else if (key === 'p' || key == null) st.set('f', F.src, true);
  return F;
};
const ctrls = v => [{type: 'select', key: 'p', label: 'Function', value: v, options: FN.map((f, i) => [String(i), f.t]).concat([['own', 'Type your own']])}, {type: 'text', key: 'f', label: 'f(x) =', value: ''}];

/* ---------- 01 · first derivative ---------- */
CA.lab('first-lab', {
  controls: ctrls('0'), plot: {w: 560, h: 340}, plotLabel: 'Graph colored by the sign of f′', legend: [['green', 'increasing (f′ > 0)'], ['red', 'decreasing (f′ < 0)'], ['purple', 'f′ (dashed)', true]], readouts: [['d', 'f′(x)']], bottom: '<div id="first-chart"></div>'
}, (lab, st, key) => {
  const F = pick(lab, st, key); if (!F) { lab.out('Type a function of x.', 'ca-incorrect'); return; }
  const f = F.f, df = d1(f), Y = CA.fitY(f, F.a, F.b, {clip: 60}), P = lab.plane({xmin: F.a, xmax: F.b, ymin: Y.ymin, ymax: Y.ymax, equal: false});
  const cp = CA.critPoints(f, F.a, F.b), cuts = zeros(df, F.a, F.b);
  const xs = [F.a, ...cuts, F.b]; xs.slice(0, -1).forEach((x, i) => { const m = (x + xs[i + 1]) / 2; P.curve(f, {color: df(m) > 0 ? 'green' : 'red', width: 3.6, from: x, to: xs[i + 1]}); });
  P.curve(df, {color: 'purple', width: 1.8, dash: '6 5', from: F.a, to: F.b});
  cp.forEach(p => P.point(p.x, f(p.x), {color: p.type === 'neither' ? 'purple' : 'text', r: 6, label: `${p.type === 'neither' ? 'no extremum' : p.type} (${nx(p.x)}, ${num(f(p.x), 3)})`, labelOpt: {size: 11, dy: p.type === 'local min' ? 20 : -12}}));
  P.render();
  lab.read('d', F.dT || 'computed numerically');
  document.getElementById('first-chart').innerHTML = chart(cuts, F.a, F.b, [['f′', df, 'f increasing', 'f decreasing']], F.bounded);
  lab.out(cp.length ? cp.map(p => `x = ${nx(p.x)}: f′ ${p.left > 0 ? '+' : '−'} → ${p.right > 0 ? '+' : '−'}, so ${p.type === 'neither' ? 'no local extremum' : 'a ' + p.type}.`).join(' ') : 'f′ never changes sign here: no local extrema.');
});

/* ---------- 02 · concavity ---------- */
CA.lab('concave-lab', {
  controls: ctrls('0').concat([{type: 'range', key: 'u', label: 'Tangent point', min: 0, max: 100, step: 1, value: 20, fmt: () => ''}]), plot: {w: 560, h: 340}, plotLabel: 'Graph colored by concavity with a tangent line',
  legend: [['blue', 'concave up (f″ > 0)'], ['orange', 'concave down (f″ < 0)'], ['green', 'tangent line']], readouts: [['dd', 'f″(x)'], ['c', 'at the point'], ['ip', 'inflection points']], bottom: '<div id="concave-chart"></div>'
}, (lab, st, key) => {
  const F = pick(lab, st, key); if (!F) { lab.out('Type a function of x.', 'ca-incorrect'); return; }
  const f = F.f, ddf = d2(f), Y = CA.fitY(f, F.a, F.b, {clip: 60}), P = lab.plane({xmin: F.a, xmax: F.b, ymin: Y.ymin, ymax: Y.ymax, equal: false});
  const ips = zeros(ddf, F.a + 0.02, F.b - 0.02, 1500), xs = [F.a, ...ips, F.b];
  xs.slice(0, -1).forEach((x, i) => { const m = (x + xs[i + 1]) / 2; P.curve(f, {color: ddf(m) > 0 ? 'blue' : 'orange', width: 3.6, from: x, to: xs[i + 1]}); });
  const x = F.a + (F.b - F.a) * st.u / 100, m = CA.deriv(f, x), y = f(x), c = ddf(x);
  P.lineMB(m, y - m * x, {color: 'green', width: 2}).point(x, y, {color: 'green', r: 6});
  ips.forEach(p => P.point(p, f(p), {color: 'purple', r: 7, label: `(${nx(p)}, ${num(f(p), 3)})`, labelOpt: {size: 11, dy: -12}}));
  P.render();
  lab.read('dd', F.ddT || 'computed numerically'); lab.read('c', `${Math.abs(c) < 1e-3 ? 'f″ ≈ 0' : c > 0 ? 'concave up: tangent below the graph' : 'concave down: tangent above the graph'}`); lab.read('ip', ips.length ? ips.map(p => `x = ${nx(p)}`).join(', ') : 'none');
  document.getElementById('concave-chart').innerHTML = chart(ips, F.a, F.b, [['f″', ddf, 'concave up', 'concave down']], F.bounded);
  lab.out(ips.length ? 'At each purple point the concavity changes: an inflection point. There the tangent line crosses the graph.' : 'The concavity never changes on this window: no inflection points.');
});

/* ---------- 03 · second derivative test ---------- */
const ST = [
  {t: 'f(x) = 2x³ − 3x²', f: x => 2 * x ** 3 - 3 * x * x, a: -1.2, b: 2},
  {t: 'f(x) = x³ − 12x', f: x => x ** 3 - 12 * x, a: -4, b: 4},
  {t: 'f(x) = x⁴ (inconclusive, minimum)', f: x => x ** 4, a: -1.6, b: 1.6},
  {t: 'f(x) = x³ (inconclusive, no extremum)', f: x => x ** 3, a: -1.6, b: 1.6},
  {t: 'f(x) = x⁴ − 4x³', f: x => x ** 4 - 4 * x ** 3, a: -1.5, b: 4.5},
  {t: 'f(x) = sin x + cos x on [0, 2π]', f: x => Math.sin(x) + Math.cos(x), a: 0, b: 2 * Math.PI}
];
CA.lab('second-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: ST.map((s, i) => [String(i), s.t])}],
  plot: {w: 540, h: 340}, plotLabel: 'Function with its critical points', bottom: '<div id="second-table"></div>'
}, (lab, st) => {
  const S = ST[+st.p], f = S.f, ddf = d2(f), Y = CA.fitY(f, S.a, S.b), P = lab.plane({xmin: S.a, xmax: S.b, ymin: Y.ymin, ymax: Y.ymax, equal: false});
  P.curve(f, {color: 'blue', width: 3.2});
  const cp = CA.critPoints(f, S.a, S.b).filter(p => p.kind === 'zero');
  const rows = cp.map(p => { const v = ddf(p.x), t = Math.abs(v) < 1e-3 ? 'inconclusive' : v > 0 ? 'local min' : 'local max'; P.point(p.x, f(p.x), {color: t === 'local min' ? 'red' : t === 'local max' ? 'green' : 'purple', r: 7}); return `<tr><td>${nx(p.x)}</td><td>${Math.abs(v) < 1e-3 ? '0' : num(v, 4)}</td><td><b>${t}</b></td><td>${t === 'inconclusive' ? `first derivative test: ${p.type === 'neither' ? 'no extremum' : p.type}` : '—'}</td></tr>`; });
  P.render();
  document.getElementById('second-table').innerHTML = `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>c with f′(c) = 0</th><th>f″(c)</th><th>second derivative test</th><th>if inconclusive</th></tr>${rows.join('')}</table></div>`;
  lab.out(rows.some(r => r.includes('inconclusive')) ? 'When f″(c) = 0 the second derivative test gives no information; the first derivative test always decides.' : 'f″(c) > 0 means ∪ (a minimum); f″(c) < 0 means ∩ (a maximum).');
});

/* ---------- 04 · shapes ---------- */
CA.cards('shape-cards', [
  {expr: 'f′ > 0 and f″ > 0', correct: 0, why: 'Rising and bending up: increasing faster and faster.'},
  {expr: 'f′ > 0 and f″ < 0', correct: 1, why: 'Rising but bending down: increasing more and more slowly.'},
  {expr: 'f′ < 0 and f″ > 0', correct: 2, why: 'Falling but bending up: decreasing more and more slowly.'},
  {expr: 'f′ < 0 and f″ < 0', correct: 3, why: 'Falling and bending down: decreasing faster and faster.'}
], {options: ['rising, curving up ⤴', 'rising, leveling off ⤳', 'falling, leveling off ⤵', 'falling, steepening ↘']});

/* ---------- guided problems ---------- */
CA.guided('45', [
  {q: 'For f(x) = 2x³ − 3x², f is decreasing on:', opts: ['(0, 1)', '(−∞, 0)', '(1, ∞)', '(−∞, 1)'], correct: 0, hint: 'f′(x) = 6x(x − 1) &lt; 0.', why: 'f′ &lt; 0 between the roots 0 and 1.', ref: {panel: 'first', what: 'the sign of f′', body: '<p>f′ &gt; 0: increasing; f′ &lt; 0: decreasing.</p>'}},
  {q: 'If f′ changes from − to + at c, then f has at c:', opts: ['a local minimum', 'a local maximum', 'an inflection point', 'no extremum'], correct: 0, hint: 'Down, then up.', why: 'First derivative test.'},
  {q: 'f′(x) = (x − 2)²(x + 1). At x = 2, f has:', opts: ['no extremum', 'a local max', 'a local min', 'an asymptote'], correct: 0, hint: '(x − 2)² ≥ 0 does not change sign.', why: 'f′ &gt; 0 on both sides of 2.'},
  {q: 'f is concave up on an interval where:', opts: ['f″ &gt; 0', 'f′ &gt; 0', 'f &gt; 0', 'f″ &lt; 0'], correct: 0, hint: 'f′ is increasing.', why: 'f″ &gt; 0 ⇒ f′ increasing ⇒ concave up.', ref: {panel: 'concavity', what: 'concavity', body: '<p>f″ &gt; 0: concave up; f″ &lt; 0: concave down.</p>'}},
  {q: 'The inflection point of f(x) = 2x³ − 3x² is at x =', opts: ['1/2', '0', '1', '−1/2'], correct: 0, hint: 'f″(x) = 12x − 6.', why: 'f″ changes sign at 1/2.'},
  {q: 'f″(c) = 0 means:', opts: ['c may or may not be an inflection point', 'c is an inflection point', 'c is a local max', 'f is linear'], correct: 0, hint: 'Think of x⁴ at 0.', why: 'Concavity must actually change.'},
  {q: 'f′(3) = 0 and f″(3) = −5. Then f has at 3:', opts: ['a local maximum', 'a local minimum', 'an inflection point', 'cannot tell'], correct: 0, hint: 'Concave down ∩.', why: 'Second derivative test.', ref: {panel: 'second', what: 'the second derivative test', body: '<p>f′(c) = 0 and f″(c) &lt; 0 ⇒ local max; f″(c) &gt; 0 ⇒ local min.</p>'}},
  {q: 'For f(x) = x⁴, the second derivative test at 0 is:', opts: ['inconclusive', 'a local max', 'a local min', 'an inflection point'], correct: 0, hint: 'f″(0) = 0.', why: 'The test fails; the first derivative test shows a minimum.'},
  {q: 'For f(x) = x e⁻ˣ, the local maximum is at x =', opts: ['1', '0', '2', 'there is none'], correct: 0, hint: 'f′(x) = (1 − x)e⁻ˣ.', why: 'f′ changes from + to − at 1.'},
  {q: 'Where f′ &gt; 0 and f″ &lt; 0, the graph is:', opts: ['rising and leveling off', 'falling and steepening', 'rising and curving up', 'flat'], correct: 0, hint: 'Increasing, concave down.', why: 'The slopes are positive but getting smaller.'}
]);
})();
