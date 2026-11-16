/* Section 5.2 · Power Functions and Polynomial Functions — interactive activities */
(() => {
'use strict';
const {fmt, num} = CA, P = CA.poly;
const ends = (deg, lead) => {
  const right = lead > 0 ? '∞' : '−∞', left = deg % 2 === 0 ? right : (lead > 0 ? '−∞' : '∞');
  return {left, right, text: `as x → −∞, f(x) → ${left}; &nbsp; as x → ∞, f(x) → ${right}`};
};

/* ---------- 01 · power functions ---------- */
CA.lab('power-lab', {
  controls: [{type: 'range', key: 'p', label: 'Power p =', min: 1, max: 8, value: 2},
    {type: 'range', key: 'k', label: 'Coefficient k =', min: -3, max: 3, step: 0.5, value: 1, skip: [0], fmt: v => num(v)},
    {type: 'check', key: 'fam', label: 'Show the family (k = 1)', value: true}],
  plot: {h: 380}, plotLabel: 'Graph of a power function', readouts: [['f', 'Function'], ['type', 'Power'], ['end', 'End behavior']]
}, (lab, st) => {
  const p = st.p, k = st.k, Pl = lab.plane({xmin: -1.8, xmax: 1.8, ymin: -3, ymax: 3, xstep: 0.5, ystep: 1});
  if (st.fam) { const fam = p % 2 === 0 ? [2, 4, 6] : [1, 3, 5, 7]; fam.forEach((q, i) => Pl.curve(x => x ** q, {color: ['blue', 'green', 'purple', 'gray'][i % 4], dash: '4 5', width: 2})); }
  Pl.curve(x => k * x ** p, {color: 'orange', width: 3.6, arrows: true}).render();
  lab.read('f', `f(x) = ${num(k) === '1' ? '' : num(k) === '−1' ? '−' : num(k)}x${p > 1 ? CA.sup(p) : ''}`);
  lab.read('type', `${p % 2 === 0 ? 'even' : 'odd'}, k ${k > 0 ? '&gt; 0' : '&lt; 0'}`);
  lab.read('end', ends(p, k).text);
  lab.out(st.fam ? `Dotted curves: ${p % 2 === 0 ? 'x², x⁴, x⁶' : 'x, x³, x⁵, x⁷'}. All pass through (1, 1)${p % 2 === 0 ? ' and (−1, 1)' : ' and (−1, −1)'}; between −1 and 1 the higher powers are flatter, and beyond ±1 they are steeper.` : 'Turn on the family view to compare powers.');
});

/* ---------- 02 · power function or not ---------- */
CA.cards('power-cards', [
  {expr: 'A(r) = πr²', correct: 0, why: 'One term: coefficient π times r².'},
  {expr: 'y = −½x⁵', correct: 0, why: 'One term with k = −½ and p = 5.'},
  {expr: 'p(x) = ∛x', correct: 0, why: '∛x = x^(1/3): k = 1 and p = 1/3.'},
  {expr: 'r(x) = 4/x²', correct: 0, why: '4/x² = 4x⁻²: k = 4 and p = −2.'},
  {expr: 'q(x) = 7', correct: 0, why: '7 = 7x⁰, a constant is a power function with p = 0.'},
  {expr: 'f(x) = 3ˣ', correct: 1, why: 'The variable is in the exponent; this is an exponential function (Chapter 6), not kxᵖ.'},
  {expr: 'h(x) = x³ + x', correct: 1, why: 'Two terms: a sum of power functions, not a single power function.'},
  {expr: 's(x) = (x + 1)²', correct: 1, why: 'It expands to x² + 2x + 1, three terms.'}
], {options: ['power function', 'not a power function']});

/* ---------- 03 · polynomial or not ---------- */
CA.cards('poly-cards', [
  {expr: 'f(x) = 2x³ · 3x + 4', correct: 0, why: 'Simplifies to 6x⁴ + 4: powers 4 and 0 are non-negative integers.'},
  {expr: 'g(x) = −x(x² − 4)', correct: 0, why: 'Expands to −x³ + 4x: powers 3 and 1.'},
  {expr: 'h(x) = 5√(x + 2)', correct: 1, why: 'A square root means a power of 1/2, which is not an integer.'},
  {expr: 'k(x) = 2/x + 1', correct: 1, why: '2/x = 2x⁻¹: a negative power is not allowed.'},
  {expr: 'm(x) = πx³ − x', correct: 0, why: 'Coefficients may be any real numbers (π is fine); powers 3 and 1.'},
  {expr: 'n(x) = (x − 1)(x + 2)', correct: 0, why: 'Expands to x² + x − 2.'},
  {expr: 'p(x) = 2ˣ + 1', correct: 1, why: 'The variable is an exponent, so this is not a polynomial.'}
], {options: ['polynomial', 'not a polynomial']});

/* ---------- 04 · degree, leading term ---------- */
const POLYS = {
  a: {t: 'f(x) = 3 + 2x² − 4x³', p: [3, 0, 2, -4], v: 'x'},
  b: {t: 'g(t) = 5t⁵ − 2t³ + 7t', p: [0, 7, 0, -2, 0, 5], v: 't'},
  c: {t: 'h(p) = 6p − p³ − 2', p: [-2, 6, 0, -1], v: 'p'},
  d: {t: 'f(x) = −3x²(x − 1)(x + 4)', p: P.mul(P.mul([0, 0, -3], [-1, 1]), [4, 1]), v: 'x', fac: [['−3x²', [0, 0, -3]], ['(x − 1)', [-1, 1]], ['(x + 4)', [4, 1]]]},
  e: {t: 'f(x) = (2x + 1)(x − 3)²', p: P.mul([1, 2], P.mul([-3, 1], [-3, 1])), v: 'x', fac: [['(2x + 1)', [1, 2]], ['(x − 3)', [-3, 1]], ['(x − 3)', [-3, 1]]]},
  f: {t: 'f(x) = 7x − x⁴ + 2x⁶ − 1', p: [-1, 7, 0, 0, -1, 0, 2], v: 'x'}
};
CA.lab('degree-lab', {
  controls: [{type: 'select', key: 'f', label: 'Polynomial', value: 'a', options: Object.entries(POLYS).map(([k, v]) => [k, v.t])}],
  readouts: [['gen', 'General form'], ['deg', 'Degree'], ['lt', 'Leading term'], ['lc', 'Leading coefficient'], ['end', 'End behavior']], steps: true
}, (lab, st) => {
  const F = POLYS[st.f], p = P.trim(F.p), n = p.length - 1, lead = p[n], v = F.v;
  const lt = `${num(lead) === '1' ? '' : num(lead) === '−1' ? '−' : num(lead)}${v}${n > 1 ? CA.sup(n) : ''}`;
  lab.read('gen', `${F.t.split('=')[0]}= ${P.str(p, v)}`); lab.read('deg', String(n)); lab.read('lt', lt); lab.read('lc', num(lead)); lab.read('end', ends(n, lead).text.replaceAll('f(x)', F.t.split('=')[0].trim()));
  const steps = [];
  if (F.fac) {
    let acc = F.fac[0][1]; steps.push(['1 · Multiply the factors', F.fac.map(f => f[0]).join('')]);
    F.fac.slice(1).forEach((f, i) => { acc = P.mul(acc, f[1]); steps.push([`${i + 2} · Multiply by ${f[0]}`, `= ${P.str(acc, v)}`]); });
  } else steps.push(['1 · Write the terms in descending powers', `${P.str(p, v)}`]);
  steps.push([`${steps.length + 1} · Read the leader`, `highest power ${n} → leading term ${lt}, leading coefficient ${num(lead)}`]);
  steps.push([`${steps.length + 1} · End behavior`, `degree ${n} is ${n % 2 ? 'odd' : 'even'} and the leading coefficient is ${lead > 0 ? 'positive' : 'negative'}`]);
  lab.steps(steps);
  lab.out(`The ends of the graph behave like the leading term ${lt} alone.`);
});

/* ---------- 05 · end behavior zoom ---------- */
const ENDP = {
  a: {t: 'f(x) = 3 + 2x² − 4x³', p: [3, 0, 2, -4]},
  b: {t: 'f(x) = −3x⁴ − 9x³ + 12x²', p: [0, 0, 12, -9, -3]},
  c: {t: 'f(x) = x⁶ − 3x⁴ + 2x²', p: [0, 0, 2, 0, -3, 0, 1]},
  d: {t: 'f(x) = −x⁹', p: [0, 0, 0, 0, 0, 0, 0, 0, 0, -1]},
  e: {t: 'f(x) = x³ − 12x + 5', p: [5, -12, 0, 1]}
};
CA.lab('end-lab', {
  controls: [{type: 'select', key: 'f', label: 'Polynomial', value: 'a', options: Object.entries(ENDP).map(([k, v]) => [k, v.t])},
    {type: 'range', key: 'z', label: 'Zoom out: x from −w to w, w =', min: 2, max: 40, step: 1, value: 3}],
  plot: {h: 380}, plotLabel: 'Polynomial and its leading term at different zoom levels', legend: [['orange', 'polynomial'], ['blue', 'leading term only', true]],
  readouts: [['lt', 'Leading term'], ['end', 'End behavior']], bottom: '<div class="ca-scroll-x"><table class="ca-data-table" id="end-table" aria-label="Values far from the origin"></table></div>'
}, (lab, st) => {
  const p = P.trim(ENDP[st.f].p), n = p.length - 1, lead = p[n], w = st.z, f = x => P.at(p, x), g = x => lead * x ** n;
  const ys = [f(-w), f(w), g(-w), g(w)].map(Math.abs), H = Math.max(6, Math.max(...ys) * 1.05);
  const Pl = lab.plane({xmin: -w, xmax: w, ymin: -H, ymax: H});
  Pl.curve(g, {color: 'blue', dash: '8 6', width: 2.4}).curve(f, {color: 'orange', width: 3.2}).render();
  lab.read('lt', `${num(lead) === '1' ? '' : num(lead) === '−1' ? '−' : num(lead)}x${CA.sup(n)}`); lab.read('end', ends(n, lead).text);
  const xs = [-10, -5, 0, 5, 10];
  document.getElementById('end-table').innerHTML = `<tr><th>x</th>${xs.map(x => `<td>${fmt(x)}</td>`).join('')}</tr><tr><th>f(x)</th>${xs.map(x => `<td>${CA.comma(f(x))}</td>`).join('')}</tr><tr><th>leading term</th>${xs.map(x => `<td>${CA.comma(g(x))}</td>`).join('')}</tr>`;
  lab.out(w < 8 ? 'Up close, the other terms still shape the graph (turning points). Keep zooming out.' : 'Far out, the leading term dominates: the two graphs nearly coincide, and the ends point the way the leading term says.');
});

CA.guided('52', [
  {q: 'Which is a power function?', opts: ['f(x) = 4x³', 'f(x) = x² + 1', 'f(x) = 2ˣ'], correct: 0, hint: 'One term kxᵖ.', why: '4x³ is a single term with k = 4 and p = 3.'},
  {q: 'Describe the end behavior of f(x) = x⁸.', opts: ['Both ends up', 'Both ends down', 'Down on the left, up on the right'], correct: 0, hint: 'Even power, positive coefficient.', why: 'Even degree, positive leading coefficient: x → ±∞, f(x) → ∞.'},
  {q: 'Describe the end behavior of f(x) = −x⁵.', opts: ['Up on the left, down on the right', 'Down on the left, up on the right', 'Both ends down'], correct: 0, hint: 'Odd power reflected over the x-axis.', why: 'Odd degree with a negative coefficient: as x → −∞, f(x) → ∞; as x → ∞, f(x) → −∞.'},
  {ref: {panel: "polynomial", what: "the function g(x) = \u2212x(x\u00b2 \u2212 4)", body: "<p>Activity 03 shows this function as one of its cards; for each card you decide: <b>polynomial</b> or <b>not a polynomial</b>.</p><div class=\"ca-ref-eq\">g(x) = \u2212x(x\u00b2 \u2212 4)</div>"}, q: 'Is g(x) = −x(x² − 4) a polynomial?', opts: ['Yes', 'No'], correct: 0, hint: 'Expand it.', why: '−x³ + 4x has non-negative integer powers.'},
  {ref: {panel: "polynomial", what: "the function h(x) = 5\u221a(x + 2)", body: "<p>Activity 03 shows this function as one of its cards; for each card you decide: <b>polynomial</b> or <b>not a polynomial</b>.</p><div class=\"ca-ref-eq\">h(x) = 5\u221a(x + 2)</div>"}, q: 'Is h(x) = 5√(x + 2) a polynomial?', opts: ['Yes', 'No'], correct: 1, hint: 'What power does a square root represent?', why: 'A square root is a power of 1/2, not a non-negative integer.'},
  {ref: {panel: "degree", what: "the polynomial f(x) = 3 + 2x\u00b2 \u2212 4x\u00b3", body: "<p>Activity 04 loads this polynomial and asks for its <b>degree</b>, <b>leading term</b>, and <b>leading coefficient</b>:</p><div class=\"ca-ref-eq\">f(x) = 3 + 2x\u00b2 \u2212 4x\u00b3</div>"}, q: 'What is the degree of f(x) = 3 + 2x² − 4x³?', opts: ['2', '3', '4'], correct: 1, hint: 'The highest power of x.', why: 'The highest power is 3.'},
  {ref: {panel: "degree", what: "the polynomial g(t) = 5t\u2075 \u2212 2t\u00b3 + 7t", body: "<p>Activity 04 loads this polynomial and asks for its <b>degree</b>, <b>leading term</b>, and <b>leading coefficient</b>:</p><div class=\"ca-ref-eq\">g(t) = 5t\u2075 \u2212 2t\u00b3 + 7t</div>"}, q: 'What is the leading coefficient of g(t) = 5t⁵ − 2t³ + 7t?', opts: ['5', '7', '−2'], correct: 0, hint: 'The coefficient of the highest power.', why: 'The leading term is 5t⁵, so the leading coefficient is 5.'},
  {ref: {panel: "degree", what: "the polynomial f(x) = \u22123x\u00b2(x \u2212 1)(x + 4)", body: "<p>Activity 04 loads this polynomial, written in factored form, and asks for its <b>degree</b>, <b>leading term</b>, and <b>leading coefficient</b>:</p><div class=\"ca-ref-eq\">f(x) = \u22123x\u00b2(x \u2212 1)(x + 4)</div>"}, q: 'What is the leading term of f(x) = −3x²(x − 1)(x + 4)?', opts: ['−3x²', '−3x⁴', '12x²'], correct: 1, hint: 'Multiply the highest-power parts: −3x² · x · x.', why: '−3x² · x · x = −3x⁴ (the full expansion is −3x⁴ − 9x³ + 12x²).'},
  {q: 'f has degree 5 and a positive leading coefficient. As x → −∞, f(x) → ?', opts: ['∞', '−∞', '0'], correct: 1, hint: 'Odd degree, positive leader: like x³.', why: 'Like x⁵, the left end goes down: f(x) → −∞.'},
  {q: 'Which has the end behavior x → ±∞, f(x) → −∞?', opts: ['f(x) = −2x⁴ + x', 'f(x) = 2x⁴ − x', 'f(x) = −2x³ + x'], correct: 0, hint: 'Both ends down needs even degree and a negative leader.', why: '−2x⁴ + x has even degree 4 and leading coefficient −2.'}
]);
})();
