/* Section 5.5 · Substitution — interactive activities */
(() => {
'use strict';
const {num} = CA;

/* ---------- 01 · choose u ---------- */
const CH = [
  {t: '∫ x(x² + 1)⁵ dx', ch: [
    {u: 'x² + 1', du: 'du = 2x dx, so x dx = du/2', rw: '∫ u⁵ · du/2', v: 'works', res: 'u⁶/12 + C = (x² + 1)⁶/12 + C'},
    {u: 'x', du: 'du = dx', rw: '∫ u(u² + 1)⁵ du', v: 'fails', res: 'nothing changed: the integral is the same as before'},
    {u: '(x² + 1)⁵', du: 'du = 10x(x² + 1)⁴ dx', rw: '∫ u · du/(10(x² + 1)⁴): x is still there', v: 'fails', res: 'x remains in the integral'}]},
  {t: '∫ cos²θ sin θ dθ', ch: [
    {u: 'cos θ', du: 'du = −sin θ dθ', rw: '∫ u² (−du)', v: 'works', res: '−u³/3 + C = −cos³θ/3 + C'},
    {u: 'sin θ', du: 'du = cos θ dθ', rw: '∫ (1 − u²) u du/cos θ: θ is still there', v: 'fails', res: 'a factor 1/cos θ is left over'},
    {u: 'cos²θ', du: 'du = −2 cos θ sin θ dθ', rw: '∫ u · du/(−2 cos θ) = −½ ∫ √u du', v: 'works with more effort', res: '−u<sup>3/2</sup>/3 + C = −cos³θ/3 + C (same answer, more algebra)'}]},
  {t: '∫ eˣ√(1 + eˣ) dx', ch: [
    {u: '1 + eˣ', du: 'du = eˣ dx', rw: '∫ √u du', v: 'works', res: '(2/3)u<sup>3/2</sup> + C = (2/3)(1 + eˣ)<sup>3/2</sup> + C'},
    {u: 'eˣ', du: 'du = eˣ dx', rw: '∫ √(1 + u) du', v: 'works with more effort', res: 'a second substitution v = 1 + u finishes it: (2/3)(1 + eˣ)<sup>3/2</sup> + C'},
    {u: '√(1 + eˣ)', du: 'u² = 1 + eˣ, so 2u du = eˣ dx', rw: '∫ u · 2u du', v: 'works', res: '(2/3)u³ + C = (2/3)(1 + eˣ)<sup>3/2</sup> + C'}]},
  {t: '∫ 3x² e^(2x³) dx', ch: [
    {u: '2x³', du: 'du = 6x² dx, so 3x² dx = du/2', rw: '½ ∫ eᵘ du', v: 'works', res: '½eᵘ + C = ½e<sup>2x³</sup> + C'},
    {u: 'x³', du: 'du = 3x² dx', rw: '∫ e<sup>2u</sup> du', v: 'works', res: '½e<sup>2u</sup> + C = ½e<sup>2x³</sup> + C'},
    {u: '3x²', du: 'du = 6x dx', rw: 'x and e<sup>2x³</sup> remain', v: 'fails', res: 'the derivative of 3x² does not match the rest'}]},
  {t: '∫ 7/(7x + 5) dx', ch: [
    {u: '7x + 5', du: 'du = 7 dx', rw: '∫ du/u', v: 'works', res: 'ln|u| + C = ln|7x + 5| + C'},
    {u: '7x', du: 'du = 7 dx', rw: '∫ du/(u + 5)', v: 'works with more effort', res: 'one more substitution: ln|u + 5| + C = ln|7x + 5| + C'},
    {u: '1/(7x + 5)', du: 'du = −7/(7x + 5)² dx', rw: '∫ −du/u', v: 'works with more effort', res: '−ln|u| + C = ln|7x + 5| + C'}]},
  {t: '∫ sin(x²) dx', ch: [
    {u: 'x²', du: 'du = 2x dx, but there is no factor x', rw: '∫ sin u · du/(2√u)', v: 'fails', res: 'no elementary antiderivative exists; substitution cannot help'},
    {u: 'sin(x²)', du: 'du = 2x cos(x²) dx', rw: 'x and cos(x²) remain', v: 'fails', res: 'no elementary antiderivative exists'},
    {u: 'x', du: 'du = dx', rw: '∫ sin(u²) du', v: 'fails', res: 'the same integral'}]}
];
const choose = CA.lab('choose-lab', {
  controls: [{type: 'select', key: 'p', label: 'Integral', value: '0', options: CH.map((c, i) => [String(i), c.t])}, {type: 'seg', key: 'c', label: 'Choose u', value: '0', options: [['0', 'choice 1'], ['1', 'choice 2'], ['2', 'choice 3']]}],
  readouts: [['u', 'u ='], ['du', 'du'], ['rw', 'rewritten'], ['r', 'result']]
}, (lab, st) => {
  const C = CH[+st.p], c = C.ch[+st.c];
  const btns = document.querySelectorAll('#choose-lab .ca-seg button'); C.ch.forEach((o, i) => { if (btns[i]) btns[i].innerHTML = 'u = ' + o.u; });
  lab.read('u', c.u); lab.read('du', c.du); lab.read('rw', c.rw); lab.read('r', c.res);
  lab.out(c.v === 'works' ? 'A good choice: only u and du remain.' : c.v === 'fails' ? 'This choice does not simplify the integral.' : 'This works, but needs extra steps. The usual choice is simpler.', c.v === 'works' ? 'ca-correct' : c.v === 'fails' ? 'ca-incorrect' : '');
});

/* ---------- 02 · examples ---------- */
CA.stepLab('sub-steps', [
  {t: '∫ (7x + 9)⁸ dx', res: '(7x + 9)⁹/63 + C', check: ['(7x + 9)^9/63', '(7x + 9)^8', -1.2], steps: [['Choose u', 'u = 7x + 9, du = 7 dx, so dx = du/7'], ['Rewrite', '∫ u⁸ · du/7 = (1/7)∫ u⁸ du'], ['Integrate', '(1/7) · u⁹/9 + C = u⁹/63 + C'], ['Back to x', '(7x + 9)⁹/63 + C']]},
  {t: '∫ 7/(7x + 5) dx', res: 'ln|7x + 5| + C', check: ['ln(abs(7x + 5))', '7/(7x + 5)', 0.4], steps: [['Choose u', 'u = 7x + 5, du = 7 dx'], ['Rewrite', '∫ (7/u) · du/7 = ∫ du/u'], ['Integrate', 'ln|u| + C'], ['Back to x', 'ln|7x + 5| + C']]},
  {t: '∫ cos²θ sin θ dθ', res: '−cos³θ/3 + C', check: ['-cos(x)^3/3', 'cos(x)^2 sin(x)', 0.7], steps: [['Choose u', 'u = cos θ, du = −sin θ dθ, so sin θ dθ = −du'], ['Rewrite', '∫ u²(−du) = −∫ u² du'], ['Integrate', '−u³/3 + C'], ['Back to θ', '−cos³θ/3 + C']]},
  {t: '∫ x√(x² − 4) dx', res: '(1/3)(x² − 4)<sup>3/2</sup> + C', check: ['(x^2 - 4)^(1.5)/3', 'x sqrt(x^2 - 4)', 2.6], steps: [['Choose u', 'u = x² − 4, du = 2x dx, so x dx = du/2'], ['Rewrite', '½∫ u<sup>1/2</sup> du'], ['Integrate', '½ · (2/3)u<sup>3/2</sup> = (1/3)u<sup>3/2</sup> + C'], ['Back to x', '(1/3)(x² − 4)<sup>3/2</sup> + C']]},
  {t: '∫ sec²(5x) dx', res: '(1/5) tan 5x + C', check: ['tan(5x)/5', '1/cos(5x)^2', 0.1], steps: [['Choose u', 'u = 5x, du = 5 dx'], ['Rewrite', '(1/5)∫ sec²u du'], ['Integrate and back', '(1/5) tan u + C = (1/5) tan 5x + C']]},
  {t: '∫ x/(x + 1)⁴ dx (solve for x)', res: '−1/(2(x + 1)²) + 1/(3(x + 1)³) + C', check: ['-1/(2(x + 1)^2) + 1/(3(x + 1)^3)', 'x/(x + 1)^4', 0.8], steps: [['Choose u', 'u = x + 1, du = dx, and x = u − 1'], ['Rewrite', '∫ (u − 1)/u⁴ du = ∫ (u⁻³ − u⁻⁴) du'], ['Integrate', '−u⁻²/2 + u⁻³/3 + C'], ['Back to x', '−1/(2(x + 1)²) + 1/(3(x + 1)³) + C']]}
]);
CA.antiCheckLab('sub-check', {f: 'x(x^2 + 1)^5', F: '(x^2 + 1)^6/12', win: {xmin: -1.5, xmax: 1.5}});

/* ---------- 03 · definite integrals ---------- */
const DF = [
  {t: '∫ from 0 to 1 of 3/√(6x + 5) dx, u = 6x + 5', f: x => 3 / Math.sqrt(6 * x + 5), a: 0, b: 1, g: x => 6 * x + 5, h: u => 0.5 / Math.sqrt(u), hT: '½u<sup>−1/2</sup>', exT: '√11 − √5'},
  {t: '∫ from 0 to 1 of x(x² + 1)³ dx, u = x² + 1', f: x => x * (x * x + 1) ** 3, a: 0, b: 1, g: x => x * x + 1, h: u => 0.5 * u ** 3, hT: '½u³', exT: '15/8'},
  {t: '∫ from 0 to π/2 of cos x · e^(sin x) dx, u = sin x', f: x => Math.cos(x) * Math.exp(Math.sin(x)), a: 0, b: Math.PI / 2, g: Math.sin, h: Math.exp, hT: 'eᵘ', exT: 'e − 1'},
  {t: '∫ from 1 to e of (ln x)/x dx, u = ln x', f: x => Math.log(x) / x, a: 1, b: Math.E, g: Math.log, h: u => u, hT: 'u', exT: '1/2'}
];
let Q2;
CA.lab('def-lab', {
  controls: [{type: 'select', key: 'p', label: 'Integral', value: '0', options: DF.map((d, i) => [String(i), d.t])}],
  plot: {w: 560, h: 260}, plotLabel: 'Original integrand on [a, b]', legend: [['blue', 'in x'], ['purple', 'in u (lower graph)']],
  bottom: '<svg id="def-svg2" role="img" aria-label="The integrand after substitution"></svg>', readouts: [['lim', 'new limits'], ['x', 'area in x'], ['u', 'area in u'], ['e', 'exact']]
}, (lab, st) => {
  const D = DF[+st.p], ua = D.g(D.a), ub = D.g(D.b), w = (D.b - D.a) * 0.15, Y = CA.fitY(D.f, D.a - w, D.b + w), P = lab.plane({xmin: D.a - w, xmax: D.b + w, ymin: Math.min(0, Y.ymin), ymax: Y.ymax, equal: false});
  CA.shade(P, D.f, D.a, D.b, {color: 'blue', fillOpacity: 0.25}); P.curve(D.f, {color: 'blue', width: 3, from: D.a - w * 0.9, to: D.b + w}).render();
  const svg2 = document.getElementById('def-svg2'); CA.placeBelow(lab.svg, svg2);
  const wu = (ub - ua) * 0.15; let top = 0; for (let i = 0; i <= 200; i++) top = Math.max(top, D.h(ua + (ub - ua) * i / 200)); const YU = {ymin: -top * 0.08, ymax: top * 1.2};
  Q2 = new CA.Plane(svg2, {xmin: ua - wu, xmax: ub + wu, ymin: YU.ymin, ymax: YU.ymax, w: 560, h: 220, equal: false, xname: 'u', yname: ''});
  CA.shade(Q2, D.h, ua, ub, {color: 'purple', fillOpacity: 0.25}); Q2.curve(D.h, {color: 'purple', width: 3}).render();
  lab.read('lim', `x = ${CA.niceX(D.a)} → u = ${CA.niceX(ua)}; x = ${CA.niceX(D.b)} → u = ${CA.niceX(ub)}`); lab.read('x', num(CA.integrate(D.f, D.a, D.b, 4000), 7)); lab.read('u', num(CA.integrate(D.h, ua, ub, 4000), 7)); lab.read('e', D.exT);
  lab.out(`The new integrand is ${D.hT}. Its region on the new interval has exactly the same area as the original region.`, 'ca-correct');
});

/* ---------- guided problems ---------- */
CA.guided('55', [
  {q: 'For ∫ 2x cos(x²) dx, the best choice is:', opts: ['u = x²', 'u = 2x', 'u = cos(x²)', 'u = cos x'], correct: 0, hint: 'Whose derivative appears?', why: 'du = 2x dx.', ref: {panel: 'idea', what: 'choosing u', body: '<p>Choose the inside function whose derivative also appears.</p>'}},
  {q: '∫ 2x cos(x²) dx = ?', opts: ['sin(x²) + C', 'x² sin(x²) + C', '−sin(x²) + C', '2 sin(x²) + C'], correct: 0, hint: '∫ cos u du.', why: 'sin u + C.'},
  {q: '∫ (7x + 9)⁸ dx = ?', opts: ['(7x + 9)⁹/63 + C', '(7x + 9)⁹/9 + C', '7(7x + 9)⁹/9 + C', '(7x + 9)⁹/7 + C'], correct: 0, hint: 'dx = du/7.', why: 'u⁹/(9 · 7).', ref: {panel: 'examples', what: 'the worked examples', body: '<p>u = 7x + 9, du = 7 dx.</p>'}},
  {q: '∫ cos²θ sin θ dθ = ?', opts: ['−cos³θ/3 + C', 'cos³θ/3 + C', 'sin³θ/3 + C', '−sin²θ cos θ + C'], correct: 0, hint: 'u = cos θ, du = −sin θ dθ.', why: '−u³/3.'},
  {q: '∫ x(x² + 1)⁵ dx = ?', opts: ['(x² + 1)⁶/12 + C', '(x² + 1)⁶/6 + C', 'x²(x² + 1)⁶/12 + C', '(x² + 1)⁶/2 + C'], correct: 0, hint: 'x dx = du/2.', why: '½ · u⁶/6.'},
  {q: '∫ (ln x)²/x dx = ?', opts: ['(ln x)³/3 + C', '(ln x)³ + C', '2 ln x/x + C', 'ln(x³)/3 + C'], correct: 0, hint: 'u = ln x, du = dx/x.', why: '∫ u² du.'},
  {q: 'With u = 6x + 5, the limits x = 0 and x = 1 become:', opts: ['u = 5 and u = 11', 'u = 0 and u = 1', 'u = 6 and u = 11', 'u = 5 and u = 6'], correct: 0, hint: 'Plug in.', why: '6·0 + 5 and 6·1 + 5.', ref: {panel: 'definite', what: 'changing the limits', body: '<p>New limits g(a) and g(b).</p>'}},
  {q: '∫<sub>0</sub><sup>1</sup> 3/√(6x + 5) dx = ?', opts: ['√11 − √5', '2(√11 − √5)', '(√11 − √5)/2', '√6'], correct: 0, hint: '∫<sub>5</sub><sup>11</sup> ½u<sup>−1/2</sup> du.', why: '√u |<sub>5</sub><sup>11</sup>.'},
  {q: '∫<sub>0</sub><sup>1</sup> x(x² + 1)³ dx = ?', opts: ['15/8', '15/4', '2', '1/2'], correct: 0, hint: '½∫<sub>1</sub><sup>2</sup> u³ du.', why: '½ · (16 − 1)/4.'},
  {q: 'Why does u = x² not help with ∫ sin(x²) dx?', opts: ['there is no factor x to pair with du = 2x dx', 'sin cannot be substituted', 'x² is not continuous', 'it does help'], correct: 0, hint: 'du = 2x dx.', why: 'The integral has no elementary antiderivative.'}
]);
})();
