/* Section 5.1 · Angles — interactive activities */
(() => {
'use strict';
const {fmt, num, F, Frac, toRad, toDeg} = CA;
const PI = Math.PI;
const ANGLE_WIN = {xmin: -1.5, xmax: 1.5, ymin: -1.3, ymax: 1.3, labels: false, grid: false, w: 520, h: 420};
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- 01 · standard position ---------- */
const STD_PRE = [['60', '60°'], ['-45', '−45°'], ['150', '150°'], ['-150', '−150°'],
  ['30', '30°'], ['-30', '−30°'], ['135', '135°'], ['-135', '−135°'], ['240', '240°'],
  ['-240', '−240°'], ['300', '300°'], ['-300', '−300°'], ['90', 'Quadrantal · 90°'], ['405', 'More than one turn · 405°'], ['-450', 'More than one turn · −450°']];
let cont = 60;
const std = CA.lab('std-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Angle', value: '60', options: STD_PRE}, {type: 'range', key: 'deg', label: 'θ =', min: -720, max: 720, step: 5, value: 60, fmt: v => fmt(v) + '°'}],
  plot: ANGLE_WIN, plotLabel: 'Angle in standard position on a circle', readouts: [['deg', 'Degrees'], ['rad', 'Radians'], ['dir', 'Rotation'], ['term', 'Terminal side']],
  bottom: '<p class="ca-drag-hint"><i class="fa-solid fa-hand-pointer"></i>Drag on the graph to turn the terminal side (keep turning to go past 360°).</p>'
}, (lab, st, key) => {
  if (key === 'pre') { st.set('deg', +st.pre, true); cont = +st.pre; }
  if (key === 'deg') cont = st.deg;
  const d = st.deg, th = toRad(d), P = lab.plane();
  P.label(1.08, -0.1, 'initial side', {color: 'blue', size: 11.5, anchor: 'start'});
  [['I', 1, 1], ['II', -1, 1], ['III', -1, -1], ['IV', 1, -1]].forEach(([q, sx, sy]) => P.label(sx * 1.32, sy * 1.12, q, {color: 'gray', size: 13, anchor: 'middle', dx: 0}));
  CA.drawAngle(P, th, {label: `${fmt(d)}°`, point: false}).render();
  const turns = Math.floor(Math.abs(d) / 360), rest = Math.abs(d) % 360, q = CA.quadrant(d);
  lab.read('deg', `${fmt(d)}°`); lab.read('rad', CA.radText(d));
  lab.read('dir', d > 0 ? 'counterclockwise (positive)' : d < 0 ? 'clockwise (negative)' : 'no rotation');
  lab.read('term', q.length <= 3 ? `Quadrant ${q}` : cap(q));
  const turnTxt = turns ? ` It makes ${turns} full turn${turns > 1 ? 's' : ''} and then ${rest}° more, so its terminal side is the same as the terminal side of ${fmt(CA.norm360(d))}°.` : '';
  lab.out(d === 0 ? 'θ = 0°: the terminal side lies on the initial side.' : `θ = ${fmt(d)}° is a <b>${d > 0 ? 'positive' : 'negative'}</b> angle: start on the positive x-axis and turn <b>${d > 0 ? 'counterclockwise' : 'clockwise'}</b> ${Math.abs(d)}°.${turnTxt} The terminal side ${q.length <= 3 ? `is in <b>Quadrant ${q}</b>` : `lies <b>on the ${q}</b>, so θ is a quadrantal angle`}.`);
});
let lastA = 0;
CA.drag(std.svg, (x, y, ph) => {
  const a = toDeg(Math.atan2(y, x));
  if (ph === 'start') cont = a + 360 * Math.round((std.state.deg - a) / 360);
  else { let dl = a - lastA; dl = ((dl + 540) % 360) - 180; cont += dl; }
  lastA = a; cont = Math.max(-720, Math.min(720, cont));
  std.state.set('deg', Math.round(cont / 5) * 5);
});

/* ---------- 02 · one radian ---------- */
CA.lab('rad-lab', {
  controls: [{type: 'select', key: 'jump', label: 'Jump to', value: '1', options: [['1', '1 radian'], ['2', '2 radians'], ['pi2', 'π/2 ≈ 1.57'], ['pi', 'π ≈ 3.14'], ['2pi', '2π ≈ 6.28']]},
    {type: 'range', key: 'k', label: 'Arc = radius-lengths', min: 0, max: 6.3, step: 0.01, value: 1, fmt: v => num(v, 2)}],
  plot: ANGLE_WIN, plotLabel: 'Radius lengths laid along a circle', readouts: [['ang', 'Central angle'], ['deg', 'In degrees'], ['frac', 'Fraction of a full turn']]
}, (lab, st, key) => {
  if (key === 'jump') st.set('k', {1: 1, 2: 2, pi2: PI / 2, pi: PI, '2pi': 2 * PI}[st.jump], true);
  const k = Math.min(st.k, 2 * PI), P = lab.plane();
  P.seg(0, 0, 1, 0, {color: 'blue', width: 3}).label(0.5, 0, 'r', {color: 'blue', anchor: 'middle', dx: 0, dy: 16});
  if (k > 0) { CA.sector(P, 1, 0, k, {color: 'orange', fillOpacity: 0.12}); P.param(t => Math.cos(t), t => Math.sin(t), 0, k, {color: 'orange', width: 7}); }
  for (let j = 1; j <= Math.floor(k + 1e-9) && j <= 6; j++) P.seg(0.9 * Math.cos(j), 0.9 * Math.sin(j), 1.12 * Math.cos(j), 1.12 * Math.sin(j), {color: 'text', width: 2}).label(1.24 * Math.cos(j), 1.24 * Math.sin(j), `${j}r`, {color: 'text', anchor: 'middle', dx: 0, dy: 4, size: 12});
  P.seg(0, 0, Math.cos(k), Math.sin(k), {color: 'orange', width: 3});
  P.param(t => Math.cos(t), t => Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.3}).render();
  lab.read('ang', `${num(k, 2)} rad`); lab.read('deg', `≈ ${num(k * 180 / PI, 1)}°`); lab.read('frac', `${num(k / (2 * PI) * 100, 1)}% of 2π`);
  const near = (v, t) => Math.abs(v - t) < 0.006;
  lab.out(near(k, 1) ? 'The arc is exactly one radius long, so the central angle is <b>1 radian ≈ 57.3°</b>.' : near(k, PI) ? 'Half of the circle holds about <b>3.14 radius-lengths</b>: π radians = 180°.' : near(k, 2 * PI) ? 'The whole circle holds <b>2π ≈ 6.28 radius-lengths</b>: 2π radians = 360°.' : near(k, PI / 2) ? 'A quarter turn holds π/2 ≈ 1.57 radius-lengths: π/2 radians = 90°.' : `An arc of ${num(k, 2)} radius-lengths makes a central angle of ${num(k, 2)} radians ≈ ${num(k * 180 / PI, 1)}°.`);
});

/* ---------- 02 · converter ---------- */
const conv = CA.lab('conv-lab', {
  controls: [{type: 'seg', key: 'dir', label: 'Direction', value: 'd2r', options: [['d2r', 'Degrees → radians'], ['r2d', 'Radians → degrees']]},
    {type: 'text', key: 'val', label: 'Angle', value: '45', placeholder: 'e.g. 45 or 5π/6'}],
  steps: true, readouts: [['ans', 'Answer']]
}, (lab, st, key) => {
  if (key === 'dir') st.set('val', st.dir === 'd2r' ? '45' : '−5π/6', true);
  const A = CA.parseAngle(st.val, st.dir === 'd2r' ? 'deg' : 'rad');
  if (!A || (st.dir === 'd2r' && A.kind !== 'deg') || (st.dir === 'r2d' && A.kind === 'deg')) { lab.read('ans', '—'); lab.steps([]); lab.out(st.dir === 'd2r' ? 'Type a number of degrees, such as 40 or −55.' : 'Type radians such as 5π/6, −3pi/2, or 2.', 'ca-incorrect'); return; }
  if (st.dir === 'd2r') {
    const d = A.deg, whole = Number.isInteger(d * 2);
    if (whole) { const f = CA.degFrac(d); lab.steps([['Multiply by π/180°', `${fmt(d)}° × π/180° = ${fmt(d)}π/180`], ['Simplify the fraction', `${CA.piStr(f)}`], ['Decimal value', `≈ ${num(f.v * PI, 4)} radians`]]); lab.read('ans', CA.piHTML(f)); lab.out(`${fmt(d)}° = <b>${CA.piStr(f)}</b> radians.`, 'ca-correct'); }
    else { const r = d * PI / 180; lab.steps([['Multiply by π/180°', `${fmt(d)}° × π/180° ≈ ${num(r, 4)}`]]); lab.read('ans', `${num(r, 4)} rad`); lab.out(`${fmt(d)}° ≈ ${num(r, 4)} radians.`, 'ca-correct'); }
  } else if (A.kind === 'pi') {
    const f = A.f, deg = f.mul(180);
    lab.steps([['Multiply by 180°/π', `${CA.piStr(f)} × 180°/π`], ['Cancel π', `${f.toString()} × 180° = ${fmt(f.n)} × 180°/${f.d}`], ['Result', `${deg.isInt() ? fmt(deg.n) : num(deg.v, 4)}°`]]);
    lab.read('ans', `${deg.isInt() ? fmt(deg.n) : num(deg.v, 4)}°`); lab.out(`${CA.piStr(f)} radians = <b>${deg.isInt() ? fmt(deg.n) : num(deg.v, 4)}°</b>.`, 'ca-correct');
  } else {
    const d = A.v * 180 / PI;
    lab.steps([['Multiply by 180°/π', `${fmt(A.v)} × 180°/π = ${fmt(A.v * 180)}°/π`], ['Decimal value', `≈ ${num(d, 2)}°`]]);
    lab.read('ans', `≈ ${num(d, 2)}°`); lab.out(`${fmt(A.v)} radians (no π) ≈ <b>${num(d, 2)}°</b>. A radian is about 57.3°, so ${fmt(A.v)} rad is about ${fmt(A.v)} × 57.3°.`, 'ca-correct');
  }
});

/* ---------- 03 · coterminal and reference angles ---------- */
const COT_PRE = [['925', 'deg', '925°'], ['-405', 'deg', '−405°'], ['32π/13', 'rad', '32π/13'], ['-17π/6', 'rad', '−17π/6'],
  ['255', 'deg', '255°'], ['3π/5', 'rad', '3π/5'], ['667', 'deg', '667°'],
  ['861', 'deg', '861°'], ['-297', 'deg', '−297°'], ['32π/5', 'rad', '32π/5'], ['-12π/7', 'rad', '−12π/7']];
CA.lab('cot-lab', {
  controls: [{type: 'select', key: 'pre', label: 'Angle', value: '0', options: COT_PRE.map((p, i) => [String(i), p[2]]).concat([['own', 'Type your own']])},
    {type: 'seg', key: 'unit', label: 'Unit', value: 'deg', options: [['deg', 'Degrees'], ['rad', 'Radians']]}, {type: 'text', key: 'val', label: 'θ =', value: '925', placeholder: '925 or 32π/13'}],
  plot: ANGLE_WIN, plotLabel: 'An angle, its coterminal angle and its reference angle', readouts: [['cot', 'Coterminal angle'], ['quad', 'Terminal side'], ['ref', 'Reference angle']], steps: true
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = COT_PRE[+st.pre]; st.set('unit', p[1], true); st.set('val', p[0], true); }
  else if (key === 'val' || key === 'unit') st.set('pre', 'own', true);
  const A = CA.parseAngle(st.val, st.unit), P = lab.plane();
  if (!A) { lab.out('Type an angle such as 925, −405, 32π/13, or −17π/6.', 'ca-incorrect'); lab.steps([]); ['cot', 'quad', 'ref'].forEach(k => lab.read(k, '—')); P.render(); return; }
  const steps = [];
  let cotText, refText, quadDeg, refDeg;
  if (A.kind === 'pi') {
    let f = A.f; const two = F(2, 1), k = Math.floor(f.v / 2), big = Math.abs(k) > 3;
    if (big) { const g = f.sub(two.mul(k)); steps.push([`${k > 0 ? 'Subtract' : 'Add'} ${Math.abs(k)} full turns`, `${CA.piStr(f)} ${k > 0 ? '−' : '+'} ${Math.abs(k)}(2π) = ${CA.piStr(g)}`]); f = g; }
    else {
      const tw = d => d > 1 ? ` = ${CA.piStr(f)} ${'§'} ${2 * d}π/${d}` : '';
      while (f.v >= 2) { const g = f.sub(two); steps.push(['Subtract 2π', `${CA.piStr(f)} − 2π${tw(f.d).replace('§', '−')} = ${CA.piStr(g)}`]); f = g; }
      while (f.v < 0) { const g = f.add(two); steps.push(['Add 2π', `${CA.piStr(f)} + 2π${tw(f.d).replace('§', '+')} = ${CA.piStr(g)}`]); f = g; }
    }
    cotText = CA.piStr(f); quadDeg = f.v * 180;
    const h = F(1, 2), one = F(1, 1), q = CA.quadrant(Math.round(quadDeg * 1e6) / 1e6);
    let r = null, how = '';
    if (q === 'I') { r = f; how = `θ′ = θ = ${CA.piStr(r)}`; } else if (q === 'II') { r = one.sub(f); how = `θ′ = π − ${CA.piStr(f)} = ${CA.piStr(r)}`; }
    else if (q === 'III') { r = f.sub(one); how = `θ′ = ${CA.piStr(f)} − π = ${CA.piStr(r)}`; } else if (q === 'IV') { r = two.sub(f); how = `θ′ = 2π − ${CA.piStr(f)} = ${CA.piStr(r)}`; }
    steps.push(['Coterminal angle in [0, 2π)', `${cotText}${f.v > 0 && f.v < 2 && f !== A.f ? ` is coterminal with ${CA.piStr(A.f)}` : ''}`]);
    if (r) { steps.push([`Quadrant ${q}`, how]); refText = CA.piStr(r); refDeg = r.v * 180; } else { refText = 'none (quadrantal)'; refDeg = null; steps.push(['Quadrantal angle', `The terminal side is on the ${q}, so there is no reference triangle.`]); }
  } else if (A.kind === 'deg') {
    let d = A.deg; const k = Math.floor(d / 360);
    if (Math.abs(k) > 3) { const g = d - 360 * k; steps.push([`${k > 0 ? 'Subtract' : 'Add'} ${Math.abs(k)} full turns`, `${fmt(d)}° ${k > 0 ? '−' : '+'} ${Math.abs(k)}(360°) = ${fmt(g)}°`]); d = g; }
    else { while (d >= 360) { steps.push(['Subtract 360°', `${fmt(d)}° − 360° = ${fmt(d - 360)}°`]); d -= 360; } while (d < 0) { steps.push(['Add 360°', `${fmt(d)}° + 360° = ${fmt(d + 360)}°`]); d += 360; } }
    cotText = `${fmt(d)}°`; quadDeg = d; const q = CA.quadrant(d);
    steps.push(['Coterminal angle in [0°, 360°)', `0° ≤ ${fmt(d)}° &lt; 360°`]);
    const how = {I: `θ′ = θ = ${fmt(d)}°`, II: `θ′ = 180° − ${fmt(d)}° = ${fmt(180 - d)}°`, III: `θ′ = ${fmt(d)}° − 180° = ${fmt(d - 180)}°`, IV: `θ′ = 360° − ${fmt(d)}° = ${fmt(360 - d)}°`}[q];
    if (how) { refDeg = CA.refAngle(d); refText = `${fmt(refDeg)}°`; steps.push([`Quadrant ${q}`, how]); } else { refDeg = null; refText = 'none (quadrantal)'; steps.push(['Quadrantal angle', `The terminal side is on the ${q}.`]); }
  } else {
    let v = A.v; const TP = 2 * PI;
    while (v >= TP) { steps.push(['Subtract 2π ≈ 6.2832', `${num(v, 4)} − 6.2832 ≈ ${num(v - TP, 4)}`]); v -= TP; } while (v < 0) { steps.push(['Add 2π ≈ 6.2832', `${num(v, 4)} + 6.2832 ≈ ${num(v + TP, 4)}`]); v += TP; }
    cotText = `≈ ${num(v, 4)}`; quadDeg = v * 180 / PI; const q = CA.quadrant(quadDeg);
    const r = q === 'I' ? v : q === 'II' ? PI - v : q === 'III' ? v - PI : 2 * PI - v; refDeg = r * 180 / PI; refText = `≈ ${num(r, 4)}`;
    steps.push([`Quadrant ${q}`, `θ′ ≈ ${num(r, 4)} radians`]);
  }
  const th = A.v, many = Math.abs(th) > 4 * PI, lim = many ? Math.sign(th) * (2 * PI + (Math.abs(th) % (2 * PI))) : th;
  if (refDeg !== null) { const end = toRad(quadDeg), axis = quadDeg <= 90 ? 0 : quadDeg <= 270 ? PI : 2 * PI; CA.sector(P, 0.62, Math.min(end, axis), Math.max(end, axis), {color: 'purple', fillOpacity: 0.28}); P.label(0.7 * Math.cos((end + axis) / 2), 0.7 * Math.sin((end + axis) / 2), 'θ′', {color: 'purple', anchor: 'middle', dx: 0, dy: 5}); }
  CA.drawAngle(P, lim, {point: false, label: A.kind === 'deg' ? `${fmt(A.deg)}°` : A.kind === 'pi' ? CA.piStr(A.f) : `${fmt(A.v)} rad`}).render();
  lab.steps(steps); lab.read('cot', cotText); const q = CA.quadrant(quadDeg); lab.read('quad', q.length <= 3 ? `Quadrant ${q}` : cap(q)); lab.read('ref', refText);
  lab.out(`The angle and <b>${cotText}</b> share the same terminal side${many ? ' (the graph draws one full turn and then the rest, so the terminal side is exact)' : ''}. The purple wedge is the reference angle θ′ = ${refText}, measured to the nearest part of the x-axis.`);
});

/* ---------- 04 · arc length and sector area ---------- */
const UNITS = [['cm', 'cm'], ['in', 'in'], ['m', 'm'], ['ft', 'ft']];
CA.lab('arc-lab', {
  controls: [{type: 'range', key: 'r', label: 'Radius r =', min: 1, max: 20, step: 0.5, value: 10}, {type: 'range', key: 'd', label: 'Central angle θ =', min: 1, max: 360, step: 1, value: 60, fmt: v => v + '°'}, {type: 'select', key: 'u', label: 'Unit', value: 'cm', options: UNITS}],
  plot: {w: 520, h: 400}, plotLabel: 'Sector of a circle with its arc', readouts: [['th', 'θ in radians'], ['s', 'Arc length s'], ['A', 'Sector area A']], steps: true
}, (lab, st) => {
  const r = st.r, d = st.d, u = st.u, f = CA.degFrac(d), th = f.v * PI, s = r * th, A = r * r * th / 2;
  const P = lab.plane({xmin: -1.3 * r, xmax: 1.3 * r, ymin: -1.15 * r, ymax: 1.15 * r, xname: 'x', yname: 'y'});
  P.param(t => r * Math.cos(t), t => r * Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.5});
  CA.sector(P, r, 0, th, {color: 'orange', fillOpacity: 0.18});
  P.param(t => r * Math.cos(t), t => r * Math.sin(t), 0, th, {color: 'orange', width: 6});
  P.seg(0, 0, r, 0, {color: 'blue', width: 3}).seg(0, 0, r * Math.cos(th), r * Math.sin(th), {color: 'blue', width: 3});
  P.label(r / 2, 0, `r = ${fmt(r)}`, {color: 'blue', anchor: 'middle', dx: 0, dy: -10});
  P.label(1.08 * r * Math.cos(th / 2), 1.08 * r * Math.sin(th / 2), `s ≈ ${num(s, 2)}`, {color: 'orange', anchor: Math.cos(th / 2) < 0 ? 'end' : 'start'}).render();
  const exS = F(1, 1).mul(Frac.of(r)).mul(f), exA = Frac.of(r * r).div(2).mul(f);
  lab.read('th', `${CA.piHTML(f)} ≈ ${num(th, 4)}`); lab.read('s', `${num(s, 2)} ${u}`); lab.read('A', `${num(A, 2)} ${u}²`);
  lab.steps([['Convert θ to radians', `${d}° × π/180° = ${CA.piStr(f)} ≈ ${num(th, 4)}`], ['Arc length', `s = rθ = ${fmt(r)} × ${CA.piStr(f)} = ${CA.piStr(exS)} ≈ ${num(s, 2)} ${u}`], ['Sector area', `A = ½r²θ = ½(${fmt(r)})²(${CA.piStr(f)}) = ${CA.piStr(exA)} ≈ ${num(A, 2)} ${u}²`]]);
  lab.out(`Arc length is a length (${u}); area is in square units (${u}²). The sector is ${num(d / 360 * 100, 1)}% of the circle, so its area is ${num(d / 360 * 100, 1)}% of πr² = ${num(PI * r * r, 2)} ${u}².`);
});
CA.choice('arc-mistake', {
  q: 'A student finds the arc length on a circle of radius 3 in with central angle 70° by writing S = rθ = 3 × 70° = 210 in. Where is the mistake?',
  options: ['θ must be in radians: 70° = 7π/18, so S = 3 · 7π/18 = 7π/6 ≈ 3.67 in.', 'The radius should be squared: S = 3² × 70 = 630 in.', 'She should divide by 2: S = ½ · 3 · 70 = 105 in.', 'There is no mistake.'],
  correct: 0, why: 'The formula s = rθ only works when θ is measured in radians. 70° × π/180° = 7π/18 ≈ 1.2217, so s = 3(1.2217) ≈ 3.67 in. An arc of 210 in on a circle of radius 3 in would wrap around the circle more than 11 times.',
  whyWrong: 'Look at the units of θ. The formula s = rθ only works when θ is in radians, so the 70° must be converted first.'
});

/* ---------- 05 · linear and angular speed ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let spin = 0, playing = !reduce, lastT = null, rpm = 160;
const sp = CA.lab('speed-lab', {
  controls: [{type: 'range', key: 'dia', label: 'Wheel diameter (in)', min: 10, max: 36, step: 1, value: 22}, {type: 'range', key: 'rpm', label: 'Revolutions per minute', min: 10, max: 400, step: 10, value: 160}],
  top: `<div class="ca-controls"><button type="button" class="ca-btn ca-btn-outline" id="wheel-play">${playing ? '<i class="fa-solid fa-pause"></i> Pause' : '<i class="fa-solid fa-play"></i> Play'}</button><span class="ca-muted">Animation slowed to 10% of the real speed.</span></div><div class="ca-wheel-wrap"><svg id="wheel-svg" class="ca-plot" viewBox="0 0 320 240" role="img" aria-label="Rotating bicycle wheel" style="max-width:340px"></svg></div>`,
  readouts: [['r', 'Radius r'], ['w', 'Angular speed ω'], ['v', 'Linear speed v'], ['mph', 'Speed in mph']], steps: true
}, (lab, st) => {
  const r = st.dia / 2, N = st.rpm; rpm = N;
  const w = 2 * PI * N, v = r * w, mph = v / 12 / 5280 * 60;
  lab.read('r', `${fmt(r)} in`); lab.read('w', `${fmt(2 * N)}π ≈ ${CA.comma(w, 1)} rad/min`); lab.read('v', `≈ ${CA.comma(v, 2)} in/min`); lab.read('mph', `≈ ${num(mph, 1)} mph`);
  lab.steps([['Radius', `r = ${st.dia} ÷ 2 = ${fmt(r)} in`], ['Angular speed', `ω = ${N} rot/min × 2π rad/rot = ${2 * N}π rad/min`], ['Linear speed', `v = rω = ${fmt(r)} × ${2 * N}π = ${fmt(r * 2 * N)}π ≈ ${CA.comma(v, 2)} in/min`], ['Convert to mph', `${fmt(r * 2 * N)}π in/min × (1 ft/12 in) × (1 mi/5280 ft) × (60 min/1 h) ≈ ${num(mph, 1)} mph`]]);
  lab.out(`Each turn of the wheel rolls the bicycle forward one circumference, 2πr = ${num(2 * PI * r, 2)} in. At ${N} turns per minute that is ${CA.comma(v, 2)} in per minute.`);
  drawWheel(r);
});
function drawWheel(r) {
  const svg = document.getElementById('wheel-svg'), R = 40 + r * 2.4;
  const spokes = Array.from({length: 12}, (_, i) => { const a = i * PI / 6; return `<line x1="0" y1="0" x2="${R * Math.cos(a)}" y2="${R * Math.sin(a)}" stroke="var(--cp-gray)" stroke-width="1.6"/>`; }).join('');
  svg.innerHTML = `<line x1="10" y1="${120 + R}" x2="310" y2="${120 + R}" stroke="var(--cp-axis)" stroke-width="2"/><g transform="translate(160 120)"><g id="wheel-rot" transform="rotate(${spin})"><circle r="${R}" fill="none" stroke="var(--cp-text)" stroke-width="7"/>${spokes}<circle cx="${R}" cy="0" r="7" fill="var(--cp-orange)"/></g><circle r="5" fill="var(--cp-text)"/><text x="0" y="${-R - 10}" text-anchor="middle" font-size="12" font-weight="800" fill="var(--cp-blue)">d = ${2 * r} in</text></g>`;
}
const tick = t => { if (playing) { if (lastT !== null) { spin = (spin + (t - lastT) / 1000 * rpm / 60 * 360 * 0.1) % 360; const g = document.getElementById('wheel-rot'); if (g) g.setAttribute('transform', `rotate(${spin})`); } lastT = t; } else lastT = null; requestAnimationFrame(tick); };
requestAnimationFrame(tick);
document.getElementById('wheel-play').addEventListener('click', e => { playing = !playing; e.currentTarget.innerHTML = playing ? '<i class="fa-solid fa-pause"></i> Pause' : '<i class="fa-solid fa-play"></i> Play'; });

/* ---------- guided problems ---------- */
CA.guided('51', [
  {q: 'Convert 225° to radians.', opts: ['5π/4', '4π/5', '5π/8', '225π'], correct: 0, hint: 'Multiply by π/180° and simplify 225/180.', why: '225° × π/180° = 225π/180 = 5π/4.'},
  {q: 'Convert −5π/6 to degrees.', opts: ['−150°', '−300°', '150°', '−216°'], correct: 0, hint: 'Multiply by 180°/π.', why: '−5π/6 × 180°/π = −5 × 30° = −150°.', ref: {panel: 'radians', what: 'the conversion rule', body: '<p>Radians → degrees: multiply by 180°/π. For example, −5π/6 · 180°/π = −150°.</p>'}},
  {q: 'Which angle between 0° and 360° is coterminal with 925°?', opts: ['205°', '565°', '155°', '25°'], correct: 0, hint: 'Subtract 360° until the result is less than 360°.', why: '925° − 360° = 565°, and 565° − 360° = 205°.', ref: {panel: 'coterminal', what: 'the angle 925°', body: '<p>Find the angle between 0° and 360° that is coterminal with <b>925°</b>.</p>'}},
  {q: 'Which angle between 0° and 360° is coterminal with −405°?', opts: ['315°', '45°', '−45°', '225°'], correct: 0, hint: 'Add 360° until the result is positive.', why: '−405° + 360° = −45°, and −45° + 360° = 315°.', ref: {panel: 'coterminal', what: 'the angle −405°', body: '<p>Find the angle between 0° and 360° that is coterminal with <b>−405°</b>.</p>'}},
  {q: 'What is the reference angle of 255°?', opts: ['75°', '15°', '105°', '255°'], correct: 0, hint: '255° is in Quadrant III.', why: 'In Quadrant III, θ′ = θ − 180° = 255° − 180° = 75°.', ref: {panel: 'coterminal', what: 'the reference angle of 255°', body: '<p>Find the reference angle of <b>255°</b>.</p>'}},
  {q: 'What is the reference angle of 3π/5?', opts: ['2π/5', '3π/5', 'π/5', '8π/5'], correct: 0, hint: '3π/5 is between π/2 and π.', why: 'Quadrant II: θ′ = π − 3π/5 = 2π/5.'},
  {q: 'Find the arc length on a circle of radius 10 cm cut off by a central angle of 60°.', opts: ['10π/3 ≈ 10.47 cm', '600 cm', '50π/3 ≈ 52.36 cm', '5π/3 ≈ 5.24 cm'], correct: 0, hint: 'Convert 60° to π/3 first.', why: 's = rθ = 10 · π/3 = 10π/3 ≈ 10.47 cm.', ref: {panel: 'arc-sector', what: 'the 10 cm sector', body: '<p>Radius <b>10 cm</b>, central angle <b>60°</b>. Find the arc length and the sector area.</p>'}},
  {q: 'Find the area of the sector of a circle of radius 10 cm with central angle 60°.', opts: ['50π/3 ≈ 52.36 cm²', '10π/3 ≈ 10.47 cm²', '100π/3 ≈ 104.72 cm²', '3000 cm²'], correct: 0, hint: 'A = ½r²θ with θ in radians.', why: 'A = ½(10)²(π/3) = 50π/3 ≈ 52.36 cm².', ref: {problem: 7, what: 'the same circle and angle'}},
  {q: 'A wheel turns at 30 revolutions per minute. What is its angular speed?', opts: ['60π rad/min', '30π rad/min', '15π rad/min', '60 rad/min'], correct: 0, hint: 'One revolution is 2π radians.', why: 'ω = 2πN = 2π(30) = 60π radians per minute.'},
  {q: 'Which angle is negative and has its terminal side in Quadrant III?', opts: ['−150°', '−30°', '150°', '210°'], correct: 0, hint: 'Turn clockwise from the positive x-axis.', why: 'Turning 150° clockwise passes the negative y-axis (−90°) and stops in Quadrant III. −30° ends in Quadrant IV, and 150° and 210° are positive.'}
]);
})();
