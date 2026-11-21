/* Section 5.3 · The Fundamental Theorem of Calculus — interactive activities */
(() => {
'use strict';
const {num} = CA, PI = Math.PI;
const I = (f, a, b) => CA.integrate(f, a, b, 2000);

/* ---------- 01 · accumulation ---------- */
const AC = [
  {t: 'f(t) = t, a = 0', f: t => t, a: 0, lo: -3, hi: 3, FT: 'F(x) = x²/2'},
  {t: 'f(t) = cos t, a = 0', f: Math.cos, a: 0, lo: -1, hi: 7, FT: 'F(x) = sin x'},
  {t: 'f(t) = 1 − t², a = −1', f: t => 1 - t * t, a: -1, lo: -2, hi: 2.5, FT: 'F(x) = x − x³/3 + 2/3'},
  {t: 'f(t) = e^(−t²), a = 0', f: t => Math.exp(-t * t), a: 0, lo: -3, hi: 3, FT: 'no formula with elementary functions, but F still exists'},
  {t: 'f(t) = 1/t, a = 1', f: t => 1 / t, a: 1, lo: 0.2, hi: 5, FT: 'F(x) = ln x'}
];
let P2;
CA.lab('accum-lab', {
  controls: [{type: 'select', key: 'p', label: 'Integrand and start', value: '1', options: AC.map((s, i) => [String(i), s.t])}, {type: 'range', key: 'u', label: 'x', min: 0, max: 1000, step: 1, value: 450, fmt: () => ''}],
  plot: {w: 560, h: 260}, plotLabel: 'Area under f from a to x', legend: [['blue', 'area counted +'], ['red', 'area counted −'], ['purple', 'F(x) (lower graph)']],
  bottom: '<svg id="accum-svg2" role="img" aria-label="Graph of the accumulation function"></svg>', readouts: [['x', 'x'], ['F', 'F(x) = ∫ from a to x'], ['f', 'f(x) = slope of F'], ['T', 'formula']]
}, (lab, st) => {
  const A = AC[+st.p], x = A.lo + (A.hi - A.lo) * st.u / 1000, F = s => I(A.f, A.a, s), Yf = CA.fitY(A.f, A.lo, A.hi, {clip: 6}), P = lab.plane({xmin: A.lo, xmax: A.hi, ymin: Yf.ymin, ymax: Yf.ymax, equal: false, xname: 't'});
  if (Math.abs(x - A.a) > 1e-9) { const l = Math.min(x, A.a), r = Math.max(x, A.a), rev = x < A.a; CA.shade(P, A.f, l, r, {split: true, color: rev ? 'red' : 'blue', negColor: rev ? 'blue' : 'red', samples: 240}); }
  P.curve(A.f, {color: 'text', width: 2.8}).vline(A.a, {color: 'gray', dash: '4 4', width: 1.2}).vline(x, {color: 'orange', width: 2}).render();
  const svg2 = document.getElementById('accum-svg2'); CA.placeBelow(lab.svg, svg2);
  const YF = CA.fitY(F, A.lo, A.hi, {clip: 50});
  P2 = new CA.Plane(svg2, {xmin: A.lo, xmax: A.hi, ymin: YF.ymin, ymax: YF.ymax, w: 560, h: 220, equal: false, yname: 'F'});
  const Fx = F(x), m = A.f(x);
  P2.curve(F, {color: 'purple', width: 3, samples: 300}).lineMB(m, Fx - m * x, {color: 'green', width: 1.6, dash: '6 5'}).point(x, Fx, {color: 'orange', r: 7}).render();
  lab.read('x', num(x, 3)); lab.read('F', num(Fx, 5)); lab.read('f', num(m, 5)); lab.read('T', A.FT);
  lab.out(`F is ${m > 1e-9 ? 'increasing here because f(x) > 0' : m < -1e-9 ? 'decreasing here because f(x) < 0' : 'momentarily flat because f(x) = 0'}. The green tangent line on the lower graph has slope f(x): F′ = f.`);
});

/* ---------- 02 · the thin strip ---------- */
CA.lab('strip-lab', {
  controls: [{type: 'range', key: 'x', label: 'x =', min: 0.3, max: 2.6, step: 0.05, value: 1, fmt: v => num(v, 2)}, {type: 'range', key: 'k', label: 'h =', min: 0, max: 3, step: 0.25, value: 0, fmt: k => num(0.8 * 10 ** -k, 4)}],
  plot: {xmin: -0.2, xmax: 3.6, ymin: -0.3, ymax: 2.2, w: 540, h: 320, equal: false, xname: 't'}, plotLabel: 'The strip between x and x + h under f(t) = 1 + sin t',
  readouts: [['d', '(F(x + h) − F(x))/h'], ['f', 'f(x)']]
}, (lab, st) => {
  const f = t => 1 + Math.sin(t), x = st.x, h = 0.8 * 10 ** -st.k, P = lab.plane();
  CA.shade(P, f, 0, x, {color: 'blue', fillOpacity: 0.12}); CA.shade(P, f, x, x + h, {color: 'red', fillOpacity: 0.45});
  P.poly([[x, 0], [x + h, 0], [x + h, f(x)], [x, f(x)]], {color: 'green', fillOpacity: 0, width: 1.6}).curve(f, {color: 'text', width: 2.8}).render();
  const q = I(f, x, x + h) / h;
  lab.read('d', num(q, 6)); lab.read('f', num(f(x), 6));
  lab.out(`The red strip has area ∫ from x to x + h ≈ f(x)·h (the green rectangle). Dividing by h gives about f(x), with an error that vanishes as h → 0.`, st.k >= 2 ? 'ca-correct' : '');
});
CA.stepLab('p1-steps', [
  {t: 'd/dx ∫ from 0 to x of √(t² + 1) dt', res: '√(x² + 1)', steps: [['Part 1 (lower limit constant, upper limit x)', 'replace t by x in the integrand'], ['Result', '√(x² + 1)']]},
  {t: 'F(x) = ∫ from 4 to x of √(t³) dt; F′(4)', res: '8', steps: [['Part 1', 'F′(x) = √(x³)'], ['Evaluate', 'F′(4) = √64 = 8']]},
  {t: 'Ψ(x) = ∫ from 1.5 to x of √(t² + 3t) dt; Ψ′(3)', res: '3√2', steps: [['Part 1', 'Ψ′(x) = √(x² + 3x)'], ['Evaluate', 'Ψ′(3) = √(9 + 9) = √18 = 3√2']]},
  {t: 'F(x) = ∫ from 0 to x² of √(1 + t³) dt', res: '2x√(1 + x⁶)', note: 'Here G(u) = ∫<sub>0</sub><sup>u</sup> √(1 + t³) dt and F(x) = G(x²).', steps: [['Upper limit is x², not x', 'let u = x² and G(u) = ∫<sub>0</sub><sup>u</sup> √(1 + t³) dt, so F(x) = G(x²)'], ['Part 1 for G', 'G′(u) = √(1 + u³)'], ['Chain rule', 'F′(x) = G′(x²) · 2x = √(1 + (x²)³) · 2x'], ['Result', '2x√(1 + x⁶)']]},
  {t: 'd/dx ∫ from x to x² of sin t dt', res: '2x sin(x²) − sin x', steps: [['General version', 'f(h(x))h′(x) − f(g(x))g′(x) with h = x², g = x'], ['Substitute', 'sin(x²) · 2x − sin x · 1'], ['Result', '2x sin(x²) − sin x']]},
  {t: 'd/dx ∫ from x to 5 of e^(t²) dt', res: '−e<sup>x²</sup>', steps: [['Reverse the limits', '∫<sub>x</sub><sup>5</sup> = −∫<sub>5</sub><sup>x</sup>'], ['Part 1', '−e<sup>x²</sup>']]}
]);

/* ---------- 03 · Part 2 ---------- */
CA.stepLab('p2-steps', [
  {t: '∫ from 0 to 2 of x² dx', res: '8/3', steps: [['Antiderivative', 'F(x) = x³/3'], ['F(b) − F(a)', '2³/3 − 0³/3'], ['Result', '8/3']]},
  {t: '∫ from 0 to π of 2 sin x dx', res: '4', steps: [['Antiderivative', 'F(x) = −2 cos x'], ['F(π) − F(0)', '(−2 cos π) − (−2 cos 0) = 2 − (−2)'], ['Result', '4']]},
  {t: '∫ from π/2 to π of 2 sin x dx', res: '2', steps: [['Antiderivative', '−2 cos x'], ['Evaluate', '(−2 cos π) − (−2 cos(π/2)) = 2 − 0'], ['Result', '2']]},
  {t: '∫ from 1 to 3 of (t³ + 4t² + 4)/t dt', res: '74/3 + 4 ln 3', steps: [['Divide each term by t', 't² + 4t + 4/t'], ['Antiderivative', 't³/3 + 2t² + 4 ln|t|'], ['F(3)', '9 + 18 + 4 ln 3 = 27 + 4 ln 3'], ['F(1)', '1/3 + 2 + 0 = 7/3'], ['Subtract', '27 − 7/3 + 4 ln 3 = 74/3 + 4 ln 3 ≈ 29.06']]},
  {t: '∫ from −1 to 1 of (1/x) dx', res: 'Part 2 does not apply', note: 'The integrand is unbounded near 0, so the integral does not exist as a definite integral.', steps: [['Check continuity', 'f(x) = 1/x is undefined at x = 0, which is inside [−1, 1]'], ['Conclusion', 'the Fundamental Theorem does not apply']]}
]);
CA.lab('eval-lab', {
  controls: [{type: 'text', key: 'f', label: 'integrand f(x) =', value: '(x^3 + 4x^2 + 4)/x'}, {type: 'text', key: 'F', label: 'antiderivative F(x) =', value: 'x^3/3 + 2x^2 + 4ln(x)'}, {type: 'text', key: 'a', label: 'a =', value: '1'}, {type: 'text', key: 'b', label: 'b =', value: '3'}],
  plot: {w: 540, h: 300}, plotLabel: 'The integrand on [a, b]', readouts: [['d', 'F′ = f?'], ['c', 'f continuous on [a, b]?'], ['v', 'F(b) − F(a)'], ['n', 'numerical integral']]
}, (lab, st) => {
  const f = CA.expr(st.f), F = CA.expr(st.F), A = CA.expr(st.a), B = CA.expr(st.b), a = A && A.f(0), b = B && B.f(0);
  if (!f || !F || !Number.isFinite(a) || !Number.isFinite(b) || a === b) { lab.plane({xmin: -5, xmax: 5, ymin: -5, ymax: 5}).render(); lab.out('Fill in all four boxes (a ≠ b).', 'ca-incorrect'); return; }
  const lo = Math.min(a, b), hi = Math.max(a, b), pad = (hi - lo) * 0.15, Y = CA.fitY(f.f, lo - pad, hi + pad, {clip: 50}), P = lab.plane({xmin: lo - pad, xmax: hi + pad, ymin: Y.ymin, ymax: Y.ymax, equal: false});
  let cont = true; for (let i = 0; i <= 2000; i++) { const x = lo + (hi - lo) * i / 2000, v = f.f(x); if (!Number.isFinite(v) || Math.abs(v) > 1e8) { cont = false; break; } }
  if (cont) CA.shade(P, f.f, lo, hi, {split: true, samples: 300});
  P.curve(f.f, {color: 'text', width: 2.8, samples: 1200}).render();
  let worst = 0; for (let i = 0; i < 40; i++) { const x = lo + (hi - lo) * (i + 0.37) / 40, e = Math.abs(CA.deriv(F.f, x) - f.f(x)) / Math.max(1, Math.abs(f.f(x))); if (Number.isFinite(e)) worst = Math.max(worst, e); else worst = Infinity; }
  const v = F.f(b) - F.f(a), n = cont ? CA.integrate(f.f, a, b, 6000) : NaN, okF = worst < 1e-4;
  lab.read('d', okF ? '<span class="ca-ok">yes</span>' : '<span class="ca-bad">no</span>'); lab.read('c', cont ? '<span class="ca-ok">yes</span>' : '<span class="ca-bad">no</span>');
  lab.read('v', Number.isFinite(v) ? num(v, 7) : 'undefined'); lab.read('n', cont ? num(n, 7) : 'does not exist (f blows up)');
  lab.out(!cont ? 'f is not continuous on [a, b], so the Fundamental Theorem does not apply here.' : !okF ? 'Your F is not an antiderivative of f on [a, b]: F(b) − F(a) need not equal the integral.' : `F′ = f and f is continuous, so ∫ = F(b) − F(a) = ${num(v, 6)}, matching the numerical value.`, cont && okF ? 'ca-correct' : 'ca-incorrect');
});

/* ---------- 04 · mean value theorem for integrals ---------- */
const MV = [
  {t: 'f(x) = x² on [0, 4]', f: x => x * x, a: 0, b: 4, cT: 'c = 4/√3 ≈ 2.309'},
  {t: 'f(x) = sin x on [0, π]', f: Math.sin, a: 0, b: PI, cT: 'sin c = 2/π: c ≈ 0.690 or c ≈ 2.451'},
  {t: 'f(x) = 3 − x on [0, 3]', f: x => 3 - x, a: 0, b: 3, cT: 'c = 3/2'},
  {t: 'f(x) = eˣ on [0, 1]', f: Math.exp, a: 0, b: 1, cT: 'eᶜ = e − 1: c = ln(e − 1) ≈ 0.541'}
];
CA.lab('mvt-lab', {
  controls: [{type: 'select', key: 'p', label: 'Function', value: '0', options: MV.map((s, i) => [String(i), s.t])}],
  plot: {w: 540, h: 320}, plotLabel: 'Graph of f with its average value', legend: [['blue', 'y = f(x)'], ['green', 'y = f_ave', true], ['orange', 'points with f(c) = f_ave']], readouts: [['a', 'f_ave'], ['c', 'c']]
}, (lab, st) => {
  const M = MV[+st.p], avg = I(M.f, M.a, M.b) / (M.b - M.a), w = (M.b - M.a) * 0.1, Y = CA.fitY(M.f, M.a - w, M.b + w), P = lab.plane({xmin: M.a - w, xmax: M.b + w, ymin: Y.ymin, ymax: Y.ymax, equal: false});
  CA.shade(P, M.f, M.a, M.b, {color: 'blue', fillOpacity: 0.15}); P.curve(M.f, {color: 'blue', width: 3}).hline(avg, {color: 'green', dash: '7 6', width: 1.8});
  const g = x => M.f(x) - avg; let px = M.a, pv = g(M.a); for (let i = 1; i <= 2000; i++) { const x = M.a + (M.b - M.a) * i / 2000, v = g(x); if (pv * v <= 0 && pv !== v) P.point((px + x) / 2, avg, {color: 'orange', r: 7}); px = x; pv = v; }
  P.render(); lab.read('a', num(avg, 5)); lab.read('c', M.cT);
  lab.out('A continuous function on [a, b] actually reaches its average value at least once.', 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('53', [
  {q: 'd/dx ∫<sub>2</sub><sup>x</sup> (t³ + 1) dt = ?', opts: ['x³ + 1', '3x²', 'x⁴/4 + x', 'x³ − 7'], correct: 0, hint: 'Part 1.', why: 'Replace t by x.', ref: {panel: 'part1', what: 'Part 1 of the Fundamental Theorem', body: '<p>d/dx ∫<sub>a</sub><sup>x</sup> f(t) dt = f(x).</p>'}},
  {q: 'If F(x) = ∫<sub>4</sub><sup>x</sup> √(t³) dt, then F′(4) = ?', opts: ['8', '0', '64', '16'], correct: 0, hint: 'F′(x) = √(x³).', why: '√64.'},
  {q: 'd/dx ∫<sub>0</sub><sup>x²</sup> √(1 + t³) dt = ?', opts: ['2x√(1 + x⁶)', '√(1 + x⁶)', '√(1 + x³)', '2x√(1 + x³)'], correct: 0, hint: 'Chain rule with u = x².', why: '√(1 + (x²)³) · 2x.'},
  {q: 'd/dx ∫<sub>x</sub><sup>3</sup> cos t dt = ?', opts: ['−cos x', 'cos x', 'sin 3 − sin x', '−sin x'], correct: 0, hint: 'Reverse the limits.', why: '−∫<sub>3</sub><sup>x</sup> cos t dt.'},
  {q: '∫<sub>0</sub><sup>π</sup> 2 sin x dx = ?', opts: ['4', '2', '0', '−4'], correct: 0, hint: '−2 cos x.', why: '2 − (−2).', ref: {panel: 'part2', what: 'Part 2 of the Fundamental Theorem', body: '<p>∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a).</p>'}},
  {q: '∫<sub>1</sub><sup>4</sup> 3√x dx = ?', opts: ['14', '7', '21', '16'], correct: 0, hint: 'Antiderivative 2x<sup>3/2</sup>.', why: '2(8) − 2(1).'},
  {q: '∫<sub>0</sub><sup>1</sup> eˣ dx = ?', opts: ['e − 1', 'e', '1', 'e + 1'], correct: 0, hint: 'eˣ |<sub>0</sub><sup>1</sup>.', why: 'e¹ − e⁰.'},
  {q: 'Why can’t Part 2 be used for ∫<sub>−1</sub><sup>1</sup> dx/x²?', opts: ['1/x² is not continuous at 0', '1/x² has no antiderivative', 'the limits are negative', 'it can, the answer is −2'], correct: 0, hint: 'Check the hypothesis.', why: 'f must be continuous on [a, b].'},
  {q: 'F(x) = ∫<sub>0</sub><sup>x</sup> (t − 2) dt is decreasing on:', opts: ['(0, 2)', '(2, ∞)', '(−∞, 0)', 'nowhere'], correct: 0, hint: 'F′(x) = x − 2.', why: 'F′ &lt; 0 for x &lt; 2 (and x &gt; 0 on the domain shown).', ref: {panel: 'accumulation', what: 'the accumulation function', body: '<p>F increases where f &gt; 0 and decreases where f &lt; 0.</p>'}},
  {q: 'For f(x) = x² on [0, 4], the c given by the Mean Value Theorem for integrals is:', opts: ['4/√3', '2', '16/3', '√8'], correct: 0, hint: 'c² = 16/3.', why: 'f<sub>ave</sub> = 16/3.', ref: {panel: 'mvt', what: 'the Mean Value Theorem for integrals', body: '<p>f(c) = (1/(b − a))∫<sub>a</sub><sup>b</sup> f(x) dx for some c.</p>'}}
]);
})();
