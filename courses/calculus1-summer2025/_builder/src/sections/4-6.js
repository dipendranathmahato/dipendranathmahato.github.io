/* Section 4.6 · Limits at Infinity and Asymptotes — interactive activities */
(() => {
'use strict';
const {num} = CA;
const big = v => !Number.isFinite(v) ? (v > 0 ? '∞' : '−∞') : Math.abs(v) >= 1e6 ? (v < 0 ? '−' : '') + Math.abs(v).toExponential(3) : num(v, 7);
const XS = [10, 100, 1000, 1e4, 1e6];

/* ---------- 01 · push x to ±∞ ---------- */
const FAR = [
  {t: 'f(x) = 2 + 1/x', f: x => 2 + 1 / x, Lp: '2', Lm: '2', ha: [2], va: [0], ylim: [-3, 7]},
  {t: 'f(x) = x³', f: x => x ** 3, Lp: '∞', Lm: '−∞', ha: [], va: [], ylim: [-30, 30]},
  {t: 'f(x) = (sin x)/x', f: x => Math.sin(x) / x, Lp: '0', Lm: '0', ha: [0], va: [], ylim: [-0.5, 1.2]},
  {t: 'f(x) = eˣ', f: Math.exp, Lp: '∞', Lm: '0', ha: [0], va: [], ylim: [-1, 8]},
  {t: 'f(x) = tan⁻¹x', f: Math.atan, Lp: 'π/2', Lm: '−π/2', ha: [Math.PI / 2, -Math.PI / 2], va: [], ylim: [-2.2, 2.2]},
  {t: 'f(x) = sin x', f: Math.sin, Lp: 'does not exist (oscillates)', Lm: 'does not exist', ha: [], va: [], ylim: [-1.6, 1.6]}
];
CA.lab('far-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: FAR.map((f, i) => [String(i), f.t])}, {type: 'range', key: 'w', label: 'Window half-width', min: 0.5, max: 3, step: 0.1, value: 1, fmt: v => num(10 ** v, 4)}],
  plot: {w: 560, h: 340}, plotLabel: 'Function over a wide window', legend: [['blue', 'y = f(x)'], ['green', 'horizontal asymptote', true], ['red', 'vertical asymptote', true]],
  readouts: [['p', 'lim x → ∞'], ['m', 'lim x → −∞']], bottom: '<div id="far-table"></div>'
}, (lab, st) => {
  const F = FAR[+st.p], W = 10 ** st.w, P = lab.plane({xmin: -W, xmax: W, ymin: F.ylim[0], ymax: F.ylim[1], equal: false});
  F.ha.forEach(y => P.hline(y, {color: 'green', dash: '7 6', width: 1.8})); F.va.forEach(x => P.vline(x, {color: 'red', dash: '7 6', width: 1.4}));
  P.curve(F.f, {color: 'blue', width: 3, breaks: F.va, samples: 4000}).render();
  lab.read('p', F.Lp); lab.read('m', F.Lm);
  document.getElementById('far-table').innerHTML = `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>x</th>${XS.map(x => `<th>${big(x)}</th>`).join('')}</tr><tr><th>f(x)</th>${XS.map(x => `<td>${big(F.f(x))}</td>`).join('')}</tr><tr><th>x</th>${XS.map(x => `<th>${big(-x)}</th>`).join('')}</tr><tr><th>f(x)</th>${XS.map(x => `<td>${big(F.f(-x))}</td>`).join('')}</tr></table></div>`;
  lab.out(F.ha.length ? `Horizontal asymptote${F.ha.length > 1 ? 's' : ''}: ${F.ha.map(y => 'y = ' + CA.niceX(y)).join(' and ')}.${+st.p === 2 ? ' The graph crosses its asymptote infinitely often: an asymptote may be crossed.' : ''}` : +st.p === 5 ? 'sin x keeps oscillating between −1 and 1: no limit at infinity and no horizontal asymptote.' : 'f grows without bound: an infinite limit at infinity, so no horizontal asymptote.');
});

/* ---------- 02 · power functions ---------- */
CA.lab('pow-lab', {
  controls: [{type: 'range', key: 'k', label: 'k =', min: -4, max: 5, step: 1, value: -2}],
  plot: {xmin: -4, xmax: 4, ymin: -6, ymax: 6, w: 520, h: 380, equal: false}, plotLabel: 'Graph of y = x to the k', readouts: [['p', 'x → ∞'], ['m', 'x → −∞'], ['z', 'x → 0⁺ · 0⁻'], ['a', 'asymptotes']]
}, (lab, st) => {
  const k = st.k, f = x => x ** k, P = lab.plane();
  if (k < 0) P.hline(0, {color: 'green', dash: '7 6', width: 1.8}).vline(0, {color: 'red', dash: '7 6', width: 1.8});
  P.curve(f, {color: 'blue', width: 3.4, breaks: k < 0 ? [0] : [], samples: 2000}).render();
  const even = k % 2 === 0;
  lab.read('p', k > 0 ? '+∞' : k === 0 ? '1' : '0'); lab.read('m', k > 0 ? (even ? '+∞' : '−∞') : k === 0 ? '1' : '0');
  lab.read('z', k < 0 ? `+∞ · ${even ? '+∞' : '−∞'}` : k === 0 ? '1 · 1' : '0 · 0');
  lab.read('a', k < 0 ? 'y = 0 (horizontal), x = 0 (vertical)' : 'none');
  lab.out(k === 0 ? 'x⁰ = 1 (for x ≠ 0): a horizontal line, which is not called an asymptote of itself.' : k > 0 ? `x${k === 1 ? '' : '^' + k} grows without bound${even ? ' at both ends' : ' (up on the right, down on the left)'}.` : `x^${k} = 1/x^${-k}: it tends to 0 at both ends and blows up near 0${even ? ' (upward on both sides)' : ' (up on the right, down on the left)'}.`);
});

/* ---------- 03 · rational functions ---------- */
const RA = [
  {t: '(x² + x − 6)/(2x² + 6)', f: x => (x * x + x - 6) / (2 * x * x + 6), deg: 'equal degrees (2 and 2)', ha: [0.5], ob: null, va: [], res: 'y = 1/2', win: [-12, 12, -2, 2]},
  {t: '(3x + 1)/(x² + 1)', f: x => (3 * x + 1) / (x * x + 1), deg: 'top degree 1 < bottom degree 2', ha: [0], ob: null, va: [], res: 'y = 0', win: [-12, 12, -2.5, 2.5]},
  {t: '(4x² − 1)/(x² − 4)', f: x => (4 * x * x - 1) / (x * x - 4), deg: 'equal degrees', ha: [4], ob: null, va: [-2, 2], res: 'y = 4; vertical x = ±2', win: [-10, 10, -15, 20]},
  {t: '(x² + 1)/(x − 1)', f: x => (x * x + 1) / (x - 1), deg: 'top degree = bottom degree + 1', ha: [], ob: [1, 1], va: [1], res: 'oblique y = x + 1; vertical x = 1', win: [-10, 12, -12, 16]},
  {t: '(2x³ − x)/(x² + 3)', f: x => (2 * x ** 3 - x) / (x * x + 3), deg: 'top degree = bottom degree + 1', ha: [], ob: [2, 0], va: [], res: 'oblique y = 2x', win: [-8, 8, -16, 16]},
  {t: 'x³/(x + 1)', f: x => x ** 3 / (x + 1), deg: 'top degree 3 > bottom degree + 1', ha: [], ob: null, va: [-1], res: 'no horizontal or oblique asymptote; vertical x = −1', win: [-6, 6, -10, 30]}
];
CA.lab('rat-lab', {
  controls: [{type: 'select', key: 'p', label: 'f(x) =', value: '0', options: RA.map((r, i) => [String(i), r.t])}],
  plot: {w: 560, h: 380}, plotLabel: 'Rational function with its asymptotes', legend: [['blue', 'y = f(x)'], ['green', 'horizontal / oblique asymptote', true], ['red', 'vertical asymptote', true]], readouts: [['d', 'degrees'], ['a', 'asymptotes'], ['v', 'f(1000)']]
}, (lab, st) => {
  const R = RA[+st.p], [a, b, c, d] = R.win, P = lab.plane({xmin: a, xmax: b, ymin: c, ymax: d, equal: false});
  R.ha.forEach(y => P.hline(y, {color: 'green', dash: '7 6', width: 2})); if (R.ob) P.lineMB(R.ob[0], R.ob[1], {color: 'green', dash: '7 6', width: 2});
  R.va.forEach(x => P.vline(x, {color: 'red', dash: '7 6', width: 1.6}));
  P.curve(R.f, {color: 'blue', width: 3.2, breaks: R.va, samples: 3000}).render();
  lab.read('d', R.deg); lab.read('a', R.res); lab.read('v', num(R.f(1000), 6));
  lab.out(R.ob ? `Long division: f(x) = ${R.ob[0] === 1 ? '' : R.ob[0]}x${R.ob[1] ? ' + ' + R.ob[1] : ''} + (a remainder that → 0), so the graph approaches the slanted line.` : R.ha.length ? `Divide numerator and denominator by the highest power of x in the denominator; the limit at ±∞ is ${R.ha[0] === 0.5 ? '1/2' : R.ha[0]}.` : 'The numerator wins by more than one degree: f grows like x² at both ends.');
});

/* ---------- 04 · square roots ---------- */
CA.lab('root-lab', {
  controls: [{type: 'range', key: 'w', label: 'Window half-width', min: 1.3, max: 3, step: 0.1, value: 1.6, fmt: v => num(10 ** v, 4)}],
  plot: {w: 560, h: 360}, plotLabel: 'Graph with two horizontal asymptotes and a vertical asymptote', legend: [['blue', 'f(x) = √(6x² + 7)/(x + 7)'], ['green', 'y = √6', true], ['purple', 'y = −√6', true], ['red', 'x = −7', true]],
  readouts: [['p', 'f(10⁶)'], ['m', 'f(−10⁶)'], ['s', '√6']]
}, (lab, st) => {
  const f = x => Math.sqrt(6 * x * x + 7) / (x + 7), W = 10 ** st.w, P = lab.plane({xmin: -W, xmax: W, ymin: -8, ymax: 8, equal: false});
  P.hline(Math.sqrt(6), {color: 'green', dash: '7 6', width: 2}).hline(-Math.sqrt(6), {color: 'purple', dash: '7 6', width: 2}).vline(-7, {color: 'red', dash: '7 6', width: 1.6});
  P.curve(f, {color: 'blue', width: 3.2, breaks: [-7], samples: 4000}).render();
  lab.read('p', num(f(1e6), 7)); lab.read('m', num(f(-1e6), 7)); lab.read('s', num(Math.sqrt(6), 7));
  lab.out('To the right the graph approaches √6 ≈ 2.449; to the left it approaches −√6 because √(x²) = |x| = −x for x < 0.', 'ca-correct');
});

/* ---------- 05 · the full picture ---------- */
const SK = [
  {t: 'f(x) = x/(x² + 1)', f: x => x / (x * x + 1), win: [-6, 6, -0.8, 0.8], dom: 'all real numbers', icpt: '(0, 0)', asy: 'horizontal y = 0', va: [], ha: [0]},
  {t: 'f(x) = x²/(x² − 1)', f: x => x * x / (x * x - 1), win: [-5, 5, -5, 6], dom: 'x ≠ ±1', icpt: '(0, 0)', asy: 'vertical x = ±1; horizontal y = 1', va: [-1, 1], ha: [1]},
  {t: 'f(x) = x e⁻ˣ', f: x => x * Math.exp(-x), win: [-1.5, 8, -2, 0.8], dom: 'all real numbers', icpt: '(0, 0)', asy: 'horizontal y = 0 as x → ∞', va: [], ha: [0]},
  {t: 'f(x) = (x² + 1)/(x − 1)', f: x => (x * x + 1) / (x - 1), win: [-6, 8, -14, 18], dom: 'x ≠ 1', icpt: '(0, −1)', asy: 'vertical x = 1; oblique y = x + 1', va: [1], ha: [], ob: [1, 1]}
];
CA.lab('sketch-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: SK.map((s, i) => [String(i), s.t])}],
  plot: {w: 560, h: 380}, plotLabel: 'Graph with asymptotes, extrema, and inflection points', legend: [['green', 'local max'], ['red', 'local min'], ['purple', 'inflection point']], readouts: [['d', 'domain'], ['i', 'intercepts'], ['a', 'asymptotes'], ['inc', 'increasing on'], ['cc', 'concave up on']]
}, (lab, st) => {
  const S = SK[+st.p], [a, b, c, d] = S.win, f = S.f, P = lab.plane({xmin: a, xmax: b, ymin: c, ymax: d, equal: false});
  S.va.forEach(x => P.vline(x, {color: 'red', dash: '7 6', width: 1.4})); S.ha.forEach(y => P.hline(y, {color: 'green', dash: '7 6', width: 1.6})); if (S.ob) P.lineMB(S.ob[0], S.ob[1], {color: 'green', dash: '7 6', width: 1.6});
  P.curve(f, {color: 'blue', width: 3.2, breaks: S.va, samples: 3000});
  const pieces = [a, ...S.va, b], cps = [], ips = [];
  for (let i = 0; i < pieces.length - 1; i++) { const l = pieces[i] + 1e-3, r = pieces[i + 1] - 1e-3; cps.push(...CA.critPoints(f, l, r)); }
  const dd = x => CA.deriv2(f, x, 1e-3), d1 = x => CA.deriv(f, x);
  for (let i = 0; i < pieces.length - 1; i++) { const l = pieces[i] + 0.05, r = pieces[i + 1] - 0.05, n = 2000; let px = l, pv = dd(l); for (let k = 1; k <= n; k++) { const x = l + (r - l) * Math.min(1, (k + 0.37) / n), v = dd(x); if (pv * v < 0) { let lo = px, hi = x; for (let j = 0; j < 50; j++) { const m = (lo + hi) / 2; if (dd(lo) * dd(m) <= 0) hi = m; else lo = m; } ips.push((lo + hi) / 2); } px = x; pv = v; } }
  const ivs = (cuts, g) => { const xs = [a, ...cuts].concat([b]).sort((p, q) => p - q), out = []; for (let i = 0; i < xs.length - 1; i++) { const m = (xs[i] + xs[i + 1]) / 2; if (g(m) > 0) { const last = out[out.length - 1]; if (last && Math.abs(last[1] - xs[i]) < 1e-9 && !S.va.some(v => Math.abs(v - xs[i]) < 1e-9)) last[1] = xs[i + 1]; else out.push([xs[i], xs[i + 1]]); } } return out; };
  const inc = ivs([...S.va, ...cps.map(p => p.x)], d1), ccu = ivs([...S.va, ...ips], dd);
  cps.forEach(p => P.point(p.x, f(p.x), {color: p.type === 'local max' ? 'green' : p.type === 'local min' ? 'red' : 'gray', r: 7, label: `(${num(p.x, 3)}, ${num(f(p.x), 3)})`, labelOpt: {size: 11, dy: p.type === 'local min' ? 20 : -12}}));
  ips.forEach(x => P.point(x, f(x), {color: 'purple', r: 6})); P.render();
  const iv = arr => arr.length ? arr.map(([l, r]) => `(${Math.abs(l - a) < 1e-6 ? '−∞' : CA.niceX(l, 3)}, ${Math.abs(r - b) < 1e-6 ? '∞' : CA.niceX(r, 3)})`).join(' ∪ ') : 'nowhere';
  lab.read('d', S.dom); lab.read('i', S.icpt); lab.read('a', S.asy); lab.read('inc', iv(inc)); lab.read('cc', iv(ccu));
  lab.out(`Local extrema: ${cps.length ? cps.map(p => `${p.type} at x ≈ ${num(p.x, 3)}`).join(', ') : 'none'}. Inflection points: ${ips.length ? ips.map(x => 'x ≈ ' + num(x, 3)).join(', ') : 'none'}.`);
});

/* ---------- guided problems ---------- */
CA.guided('46', [
  {q: 'lim<sub>x→∞</sub> (5 − 3/x²) = ?', opts: ['5', '0', '∞', '2'], correct: 0, hint: '3/x² → 0.', why: '5 − 0.', ref: {panel: 'definition', what: 'limits at infinity', body: '<p>1/xʳ → 0 as x → ±∞ for r &gt; 0.</p>'}},
  {q: 'lim<sub>x→−∞</sub> x⁴ = ?', opts: ['∞', '−∞', '0', 'does not exist'], correct: 0, hint: 'An even power.', why: 'x⁴ &gt; 0 and grows without bound.', ref: {panel: 'power', what: 'power functions', body: '<p>For k &gt; 0 even, xᵏ → +∞ at both ends.</p>'}},
  {q: 'The horizontal asymptote of (x² + x − 6)/(2x² + 6) is:', opts: ['y = 1/2', 'y = 1', 'y = 0', 'none'], correct: 0, hint: 'Equal degrees: ratio of leading coefficients.', why: '1/2.', ref: {panel: 'rational', what: 'rational functions', body: '<p>Divide by the highest power of x in the denominator.</p>'}},
  {q: 'The horizontal asymptote of (3x + 1)/(x² + 1) is:', opts: ['y = 0', 'y = 3', 'y = 1', 'none'], correct: 0, hint: 'Bottom degree is larger.', why: 'f → 0.'},
  {q: 'f(x) = (x² + 1)/(x − 1) has the oblique asymptote:', opts: ['y = x + 1', 'y = x − 1', 'y = x', 'y = 1'], correct: 0, hint: 'Divide x² + 1 by x − 1.', why: 'x + 1 remainder 2.'},
  {q: 'The horizontal asymptotes of √(6x² + 7)/(x + 7) are:', opts: ['y = √6 and y = −√6', 'y = √6 only', 'y = 6', 'none'], correct: 0, hint: '√(x²) = |x|.', why: 'Different signs at +∞ and −∞.', ref: {panel: 'roots', what: 'the example √(6x² + 7)/(x + 7)', body: '<p>√(6x² + 7) = |x|√(6 + 7/x²).</p>'}},
  {q: 'f(x) = 1/x³ has:', opts: ['y = 0 and x = 0 as asymptotes', 'no asymptotes', 'only y = 0', 'only x = 0'], correct: 0, hint: 'k = −3 &lt; 0.', why: 'Horizontal y = 0 and vertical x = 0.'},
  {q: 'lim<sub>x→∞</sub> eˣ and lim<sub>x→−∞</sub> eˣ are:', opts: ['∞ and 0', '0 and ∞', 'both ∞', 'both 0'], correct: 0, hint: 'e⁻ˣ = 1/eˣ.', why: 'y = 0 is a horizontal asymptote on the left only.'},
  {q: 'Can a graph cross its horizontal asymptote?', opts: ['yes, for example (sin x)/x', 'never', 'only once', 'only at x = 0'], correct: 0, hint: 'An asymptote describes the ends of the graph.', why: '(sin x)/x crosses y = 0 infinitely often.'},
  {q: 'lim<sub>x→∞</sub> (2x³ − x)/(5x³ + 4) = ?', opts: ['2/5', '0', '∞', '−1/4'], correct: 0, hint: 'Equal degrees.', why: 'Ratio of leading coefficients.'}
]);
})();
