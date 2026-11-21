/* Section 4.8 · L’Hôpital’s Rule — interactive activities */
(() => {
'use strict';
const {num} = CA;
const big = v => !Number.isFinite(v) ? (Number.isNaN(v) ? 'undefined' : v > 0 ? '∞' : '−∞') : Math.abs(v) >= 1e7 ? (v < 0 ? '−' : '') + Math.abs(v).toExponential(3) : num(v, 8);

/* ---------- 01 · zoom ---------- */
const ZM = [
  {t: 'ln x / (2x − 2) at x = 1', f: Math.log, g: x => 2 * x - 2, c: 1, L: '1/2', df: x => 1 / x, dg: () => 2},
  {t: 'sin 3x / tan 4x at x = 0', f: x => Math.sin(3 * x), g: x => Math.tan(4 * x), c: 0, L: '3/4', df: x => 3 * Math.cos(3 * x), dg: x => 4 / Math.cos(4 * x) ** 2},
  {t: '(eˣ − 1) / x at x = 0', f: x => Math.expm1(x), g: x => x, c: 0, L: '1', df: Math.exp, dg: () => 1},
  {t: '(x² − 9) / (x − 3) at x = 3', f: x => x * x - 9, g: x => x - 3, c: 3, L: '6', df: x => 2 * x, dg: () => 1}
];
CA.lab('zoom-lab', {
  controls: [{type: 'select', key: 'p', label: 'Limit', value: '0', options: ZM.map((z, i) => [String(i), z.t])}, {type: 'range', key: 'z', label: 'Zoom: half-width', min: -0.3, max: 3, step: 0.1, value: 0, fmt: z => num(10 ** -z, 4)}],
  plot: {w: 540, h: 380}, plotLabel: 'Numerator and denominator near x = c', legend: [['blue', 'numerator f'], ['purple', 'denominator g']], readouts: [['r', 'f(x)/g(x) at the window edge'], ['d', 'f′(c)/g′(c)'], ['L', 'limit']]
}, (lab, st) => {
  const Z = ZM[+st.p], w = 10 ** -st.z, c = Z.c, s = Math.max(Math.abs(Z.df(c)), Math.abs(Z.dg(c))) * w * 1.3, P = lab.plane({xmin: c - w, xmax: c + w, ymin: -s, ymax: s, equal: false});
  P.curve(Z.f, {color: 'blue', width: 3.2, samples: 900}).curve(Z.g, {color: 'purple', width: 3.2, samples: 900}).point(c, 0, {color: 'orange', r: 6}).render();
  const x = c + w * 0.8;
  lab.read('r', num(Z.f(x) / Z.g(x), 6)); lab.read('d', `${num(Z.df(c), 4)}/${num(Z.dg(c), 4)} = ${num(Z.df(c) / Z.dg(c), 6)}`); lab.read('L', Z.L);
  lab.out(`Zoom in: both graphs straighten into lines through (${num(c)}, 0) with slopes f′(c) and g′(c), so f/g → f′(c)/g′(c) = ${Z.L}.`);
});

/* ---------- 02 · 0/0 and ∞/∞ ---------- */
CA.stepLab('basic-steps', [
  {t: 'lim x→1 ln x / (2x − 2)', res: '1/2', steps: [['Check the form', 'ln 1/(2 − 2) = 0/0'], ['Differentiate top and bottom', 'lim (1/x)/2'], ['Substitute', '(1/1)/2 = 1/2']]},
  {t: 'lim x→0 sin 3x / tan 4x', res: '3/4', steps: [['Check the form', '0/0'], ['L’Hôpital', 'lim (3 cos 3x)/(4 sec²4x)'], ['Substitute', '3 · 1/(4 · 1) = 3/4']]},
  {t: 'lim x→∞ eˣ / x', res: '∞', steps: [['Check the form', '∞/∞'], ['L’Hôpital', 'lim eˣ/1'], ['Result', 'eˣ → ∞']]},
  {t: 'lim x→∞ ln(ln x) / √x', res: '0', steps: [['Check the form', '∞/∞'], ['L’Hôpital', '[1/(x ln x)] / [1/(2√x)]'], ['Simplify', '2√x/(x ln x) = 2/(√x ln x)'], ['Result', '2/∞ = 0']]},
  {t: 'lim x→0 (1 − cos x) / x² (twice)', res: '1/2', steps: [['Check the form', '0/0'], ['L’Hôpital', 'lim (sin x)/(2x): still 0/0'], ['L’Hôpital again', 'lim (cos x)/2'], ['Substitute', '1/2']]},
  {t: 'lim x→∞ (3x² + 5)/(2x² − x)', res: '3/2', steps: [['Check the form', '∞/∞'], ['L’Hôpital', 'lim 6x/(4x − 1): still ∞/∞'], ['L’Hôpital again', 'lim 6/4'], ['Result', '3/2 (the same answer as dividing by x²)']]}
]);
CA.cards('form-cards', [
  {expr: 'lim x→0 (x + 1)/(x + 2)', correct: 1, why: 'The form is 1/2, not indeterminate: just substitute.'},
  {expr: 'lim x→0 (sin x)/x', correct: 0, why: '0/0.'},
  {expr: 'lim x→∞ x²/eˣ', correct: 0, why: '∞/∞.'},
  {expr: 'lim x→0⁺ x ln x', correct: 2, why: '0 · (−∞): rewrite as (ln x)/(1/x) first.'},
  {expr: 'lim x→∞ (1 + 1/x)ˣ', correct: 2, why: '1<sup>∞</sup>: take logarithms first.'},
  {expr: 'lim x→1 (x² + 1)/(x − 1)²', correct: 1, why: '2/0⁺: the limit is +∞; the rule does not apply.'}
], {options: ['yes, apply it now', 'no, not indeterminate', 'rewrite first']});

/* ---------- 03 · other forms ---------- */
CA.stepLab('other-steps', [
  {t: '0 · ∞: lim x→∞ x e^(−x²)', res: '0', steps: [['Form', '∞ · 0'], ['Rewrite as a quotient', 'x/e<sup>x²</sup>: ∞/∞'], ['L’Hôpital', '1/(2x e<sup>x²</sup>)'], ['Result', '1/∞ = 0']]},
  {t: '0 · ∞: lim x→0⁺ x ln x', res: '0', steps: [['Form', '0 · (−∞)'], ['Rewrite', '(ln x)/(1/x): −∞/∞'], ['L’Hôpital', '(1/x)/(−1/x²) = −x'], ['Result', '−x → 0']]},
  {t: '∞ − ∞: lim x→∞ (x − ln x)', res: '∞', steps: [['Form', '∞ − ∞'], ['Factor out x', 'x(1 − (ln x)/x)'], ['Side limit with L’Hôpital', 'lim (ln x)/x = lim (1/x)/1 = 0'], ['Result', '∞ · (1 − 0) = ∞']]},
  {t: '∞ − ∞: lim x→0⁺ (1/x − 1/sin x)', res: '0', steps: [['Form', '∞ − ∞'], ['One fraction', '(sin x − x)/(x sin x): 0/0'], ['L’Hôpital', '(cos x − 1)/(sin x + x cos x): 0/0'], ['L’Hôpital again', '(−sin x)/(2 cos x − x sin x) → 0/2 = 0']]},
  {t: '∞⁰: lim x→∞ x^(1/x)', res: '1', steps: [['Form', '∞⁰'], ['Take ln', 'y = x<sup>1/x</sup>, ln y = (ln x)/x'], ['L’Hôpital', 'lim (ln x)/x = lim (1/x)/1 = 0'], ['Undo ln', 'lim y = e⁰ = 1']]},
  {t: '1^∞: lim x→∞ (1 + 1/x)ˣ', res: 'e', steps: [['Form', '1<sup>∞</sup>'], ['Take ln', 'ln y = x ln(1 + 1/x) = ln(1 + 1/x)/(1/x): 0/0'], ['L’Hôpital', '[(−1/x²)/(1 + 1/x)] / (−1/x²) = 1/(1 + 1/x) → 1'], ['Undo ln', 'lim y = e¹ = e']]},
  {t: '0⁰: lim x→0⁺ xˣ', res: '1', steps: [['Form', '0⁰'], ['Take ln', 'ln y = x ln x'], ['Use the 0 · ∞ example', 'x ln x → 0'], ['Undo ln', 'lim y = e⁰ = 1']]}
]);

/* ---------- 04 · numerical check ---------- */
CA.lab('num-lab', {
  controls: [{type: 'text', key: 'f', label: 'expression in x', value: 'x^(1/x)'}, {type: 'seg', key: 'to', label: 'x →', value: 'inf', options: [['a', 'a number'], ['ap', 'a from the right'], ['inf', '∞'], ['minf', '−∞']]}, {type: 'text', key: 'a', label: 'a =', value: '0'}],
  readouts: [['g', 'guess']], bottom: '<div id="num-table"></div>'
}, (lab, st) => {
  const E = CA.expr(st.f), A = CA.expr(st.a), a = A ? A.f(0) : 0;
  if (!E) { document.getElementById('num-table').innerHTML = ''; lab.read('g', '—'); lab.out('Type an expression, for example (1 + 1/x)^x or sin(x)/x.', 'ca-incorrect'); return; }
  const pts = st.to === 'inf' ? [10, 100, 1e3, 1e4, 1e5, 1e6] : st.to === 'minf' ? [-10, -100, -1e3, -1e4, -1e5, -1e6] : [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6].map(h => a + h);
  const left = st.to === 'a' ? [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6].map(h => a - h) : null;
  const row = xs => xs.map(x => `<td>${big(E.f(x))}</td>`).join('');
  document.getElementById('num-table').innerHTML = `<div class="ca-scroll-x"><table class="ca-data-table"><tr><th>x</th>${pts.map(x => `<th>${big(x)}</th>`).join('')}</tr><tr><th>value</th>${row(pts)}</tr>${left ? `<tr><th>x</th>${left.map(x => `<th>${big(x)}</th>`).join('')}</tr><tr><th>value</th>${row(left)}</tr>` : ''}</table></div>`;
  const last = E.f(pts[pts.length - 1]), prev = E.f(pts[pts.length - 2]), lastL = left ? E.f(left[left.length - 1]) : last;
  const settled = Number.isFinite(last) && Math.abs(last - prev) < 1e-3 * Math.max(1, Math.abs(last)) && Math.abs(last - lastL) < 1e-3 * Math.max(1, Math.abs(last));
  const nice = settled ? (Math.abs(last - Math.E) < 1e-4 ? 'e ≈ 2.71828' : (CA.simpleFrac(last, 24) && Math.abs(CA.simpleFrac(last, 24).v - last) < 1e-4 ? CA.simpleFrac(last, 24).toString() : num(last, 5))) : Math.abs(last) > 1e6 ? (last > 0 ? '∞ (growing)' : '−∞') : 'not settled';
  lab.read('g', nice); lab.out(settled ? 'The values settle down: this supports (but does not prove) the limit.' : 'The values have not settled; the limit may be infinite or may not exist, or the values approach slowly.');
});

/* ---------- 05 · growth rates ---------- */
const GR = [
  {t: 'ln x vs √x', f: Math.log, g: Math.sqrt, fT: 'ln x', gT: '√x', w: 'g'},
  {t: 'ln x vs x^0.1', f: Math.log, g: x => x ** 0.1, fT: 'ln x', gT: 'x^0.1', w: 'g'},
  {t: 'x³ vs eˣ', f: x => x ** 3, g: Math.exp, fT: 'x³', gT: 'eˣ', w: 'g'},
  {t: 'x¹⁰ vs eˣ', f: x => x ** 10, g: Math.exp, fT: 'x¹⁰', gT: 'eˣ', w: 'g'},
  {t: 'x² vs x² + 100x', f: x => x * x, g: x => x * x + 100 * x, fT: 'x²', gT: 'x² + 100x', w: 'same'}
];
CA.lab('growth-lab', {
  controls: [{type: 'select', key: 'p', label: 'Compare', value: '2', options: GR.map((g, i) => [String(i), g.t])}, {type: 'range', key: 'L', label: 'x up to 10^', min: 1, max: 4, step: 0.1, value: 1.3, fmt: v => num(10 ** v, 5)}],
  plot: {w: 540, h: 320}, plotLabel: 'The ratio f(x)/g(x)', legend: [['blue', 'f(x)/g(x)']], readouts: [['r', 'f/g at the right edge'], ['w', 'winner']]
}, (lab, st) => {
  const G = GR[+st.p], X = 10 ** st.L, r = x => G.f(x) / G.g(x), Y = CA.fitY(r, 1, X, {clip: 1e9, pad: 0.1}), P = lab.plane({xmin: 0, xmax: X, ymin: Math.max(Y.ymin, -0.1 * Y.ymax), ymax: Y.ymax, equal: false, yname: 'f/g'});
  P.curve(r, {color: 'blue', width: 3.2, from: 1, to: X, samples: 2000}).render();
  lab.read('r', big(r(X))); lab.read('w', G.w === 'g' ? `${G.gT} grows faster` : 'the same rate (ratio → 1)');
  lab.out(G.w === 'g' ? `${G.fT}/${G.gT} → 0: widen the window to see the ratio collapse${+st.p === 3 ? ' (x¹⁰ leads for a long time, until x ≈ 36)' : ''}.` : 'The ratio approaches 1: the two functions grow at the same rate.');
});

/* ---------- guided problems ---------- */
CA.guided('48', [
  {q: 'lim<sub>x→1</sub> ln x/(2x − 2) = ?', opts: ['1/2', '0', '1', '2'], correct: 0, hint: '(1/x)/2.', why: '0/0 form; L’Hôpital gives 1/2.', ref: {panel: 'rule', what: 'L’Hôpital’s rule', body: '<p>For 0/0 or ∞/∞: lim f/g = lim f′/g′.</p>'}},
  {q: 'lim<sub>x→0</sub> sin 3x/tan 4x = ?', opts: ['3/4', '4/3', '0', '1'], correct: 0, hint: '3 cos 3x/(4 sec² 4x).', why: '3/4.', ref: {panel: 'basic', what: 'the 0/0 examples', body: '<p>Check the form, differentiate top and bottom separately, substitute.</p>'}},
  {q: 'lim<sub>x→∞</sub> x²/eˣ = ?', opts: ['0', '∞', '1', '2'], correct: 0, hint: 'Apply the rule twice.', why: '2x/eˣ, then 2/eˣ → 0.'},
  {q: 'lim<sub>x→0</sub> (1 − cos x)/x² = ?', opts: ['1/2', '0', '1', '2'], correct: 0, hint: 'Twice.', why: '(sin x)/(2x) → (cos x)/2 → 1/2.'},
  {q: 'Before applying the rule to x ln x as x → 0⁺ you should:', opts: ['rewrite it as (ln x)/(1/x)', 'differentiate x ln x', 'substitute x = 0', 'take ln'], correct: 0, hint: 'It is a 0 · ∞ form.', why: 'Make it ∞/∞ first.', ref: {panel: 'other', what: 'the other indeterminate forms', body: '<p>Rewrite 0 · ∞ and ∞ − ∞ as quotients; use logs for powers.</p>'}},
  {q: 'lim<sub>x→0⁺</sub> x ln x = ?', opts: ['0', '−∞', '1', '−1'], correct: 0, hint: '(1/x)/(−1/x²) = −x.', why: '−x → 0.'},
  {q: 'lim<sub>x→∞</sub> x<sup>1/x</sup> = ?', opts: ['1', '0', 'e', '∞'], correct: 0, hint: 'ln y = (ln x)/x → 0.', why: 'y → e⁰.'},
  {q: 'lim<sub>x→∞</sub> (1 + 1/x)ˣ = ?', opts: ['e', '1', '∞', '0'], correct: 0, hint: 'ln y → 1.', why: 'The definition of e reappears.'},
  {q: 'lim<sub>x→0</sub> (x + 1)/(x + 2) = ?', opts: ['1/2', '1', '0', 'use L’Hôpital: 1'], correct: 0, hint: 'Is it indeterminate?', why: 'Substitute; the rule does not apply.'},
  {q: 'Which grows fastest as x → ∞?', opts: ['eˣ', 'x¹⁰⁰', '(ln x)⁵', '100x'], correct: 0, hint: 'ln ≪ power ≪ exponential.', why: 'xⁿ/eˣ → 0 for every n.', ref: {panel: 'growth', what: 'growth rates', body: '<p>ln x ≪ xᵖ ≪ eˣ.</p>'}}
]);
})();
