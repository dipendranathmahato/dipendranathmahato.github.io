/* Precalculus (MATH 2412, UTRGV) — shared interactive library.
   A copy of the College Algebra library (window.CA) with additions for trigonometry, triangles,
   vectors, polar coordinates, and conics. Every section page loads this file, then its own lesson.js. */
(function(){
'use strict';
const CA = window.CA = window.CA || {};
CA.BASE = '/courses/precalculus-fall2026/';
const $ = CA.$ = id => document.getElementById(id);
const fmt = CA.fmt = v => String(v).replaceAll('-', '−');
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
CA.sup = n => String(n).replace('-', '⁻').split('').map(c => c === '⁻' ? c : SUP[c]).join('');
CA.num = (v, d = 2) => {
  if (v === Infinity) return '∞'; if (v === -Infinity) return '−∞'; if (!Number.isFinite(v)) return 'undefined';
  let r = Number(Number(v).toFixed(d)); if (Object.is(r, -0)) r = 0; return fmt(r);
};
CA.money = v => (v < 0 ? '−' : '') + '$' + Math.abs(v).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
CA.comma = (v, d = 0) => (v < 0 ? '−' : '') + Math.abs(v).toLocaleString('en-US', {maximumFractionDigits: d});
CA.gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
CA.clean = v => { const r = Number(v.toFixed(10)); return Object.is(r, -0) ? 0 : r; };
CA.esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

/* ---------- exact fractions ---------- */
class Frac {
  constructor(n, d = 1) {
    if (d === 0) throw new Error('zero denominator');
    if (d < 0) { n = -n; d = -d; }
    const g = CA.gcd(n, d) || 1; this.n = n / g; this.d = d / g; if (Object.is(this.n, -0)) this.n = 0;
  }
  static of(x) {
    if (x instanceof Frac) return x;
    if (Number.isInteger(x)) return new Frac(x, 1);
    let d = 1; while (Math.abs(Math.round(x * d) - x * d) > 1e-9 && d < 1e7) d *= 10;
    return new Frac(Math.round(x * d), d);
  }
  add(o) { o = Frac.of(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = Frac.of(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = Frac.of(o); return new Frac(this.n * o.n, this.d * o.d); }
  div(o) { o = Frac.of(o); return new Frac(this.n * o.d, this.d * o.n); }
  neg() { return new Frac(-this.n, this.d); }
  get v() { return this.n / this.d; }
  valueOf() { return this.n / this.d; }
  isInt() { return this.d === 1; }
  eq(o) { o = Frac.of(o); return this.n === o.n && this.d === o.d; }
  toString() { return this.d === 1 ? fmt(this.n) : `${this.n < 0 ? '−' : ''}${Math.abs(this.n)}/${this.d}`; }
  html() { return this.d === 1 ? fmt(this.n) : `${this.n < 0 ? '−' : ''}<span class="ca-frac"><span>${Math.abs(this.n)}</span><span>${this.d}</span></span>`; }
}
CA.Frac = Frac; CA.F = (n, d) => new Frac(n, d); const F = CA.F;
/* a/b as a stacked fraction, followed by its simplified value when that differs */
CA.divHTML = (n, d) => { n = Frac.of(n); d = Frac.of(d); const raw = `<span class="ca-frac"><span>${n}</span><span>${d}</span></span>`, r = n.div(d); return (n.isInt() && d.isInt() && r.n === n.n && r.d === d.n) ? raw : raw + ' = ' + r.html(); };

/* ---------- simplest radical form ---------- */
CA.root = n => { // √n for a nonnegative integer n -> {text, whole, value}
  if (n === 0) return {text: '0', whole: true, value: 0, out: 0, in: 0};
  let out = 1, inside = n;
  for (let f = 2; f * f <= inside; f++) while (inside % (f * f) === 0) { inside /= f * f; out *= f; }
  return inside === 1 ? {text: fmt(out), whole: true, value: out, out, in: 1}
    : {text: `${out === 1 ? '' : fmt(out)}√${inside}`, whole: false, value: out * Math.sqrt(inside), out, in: inside};
};

/* ---------- polynomials in one variable: p[i] is the coefficient of x^i ---------- */
const P = CA.poly = {
  trim(p) { p = p.map(c => CA.clean(c)); while (p.length > 1 && p[p.length - 1] === 0) p.pop(); return p; },
  deg(p) { p = P.trim(p); return p.length === 1 && p[0] === 0 ? -Infinity : p.length - 1; },
  add(a, b) { const n = Math.max(a.length, b.length); return P.trim(Array.from({length: n}, (_, i) => (a[i] || 0) + (b[i] || 0))); },
  sub(a, b) { return P.add(a, b.map(c => -c)); },
  scale(a, s) { return P.trim(a.map(c => c * s)); },
  mul(a, b) { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return P.trim(r); },
  pow(a, n) { let r = [1]; for (let i = 0; i < n; i++) r = P.mul(r, a); return r; },
  compose(outer, inner) { let r = [0]; outer.forEach((c, i) => { r = P.add(r, P.scale(P.pow(inner, i), c)); }); return P.trim(r); },
  at(p, x) { return p.reduceRight((acc, c) => acc * x + c, 0); },
  divide(num, den) { // long division -> {q, r}
    num = P.trim(num); den = P.trim(den); let r = num.slice(), q = Array(Math.max(1, num.length - den.length + 1)).fill(0);
    const dd = den.length - 1, lead = den[dd];
    for (let i = r.length - 1; i >= dd; i--) { const c = r[i] / lead; q[i - dd] = c; for (let j = 0; j <= dd; j++) r[i - dd + j] -= c * den[j]; }
    return {q: P.trim(q), r: P.trim(r.slice(0, Math.max(1, dd)))};
  },
  fromRoots(roots, lead = 1) { return roots.reduce((acc, r) => P.mul(acc, [-r, 1]), [lead]); },
  str(p, v = 'x', {numFmt} = {}) {
    p = P.trim(p); const nf = numFmt || (c => CA.num(c, 4));
    const terms = [];
    for (let i = p.length - 1; i >= 0; i--) {
      const c = p[i]; if (c === 0) continue;
      const mag = Math.abs(c), sign = c < 0 ? '−' : '+';
      const body = i === 0 ? nf(mag) : `${mag === 1 ? '' : nf(mag)}${v}${i > 1 ? CA.sup(i) : ''}`;
      terms.push([sign, body]);
    }
    if (!terms.length) return '0';
    return terms.map(([s, b], i) => i === 0 ? (s === '−' ? '−' + b : b) : ` ${s} ${b}`).join('');
  }
};
CA.lin = (a, b, v = 'x') => P.str([b, a], v); // a·x + b


/* ---------- toolkit (parent) functions with key points and formula templates ---------- */
const wrapIn = s => s === 'x' ? 'x' : `(${s})`;
CA.parents = {
  x: {label: 'Identity · y = x', f: x => x, ex: s => s, pts: [[-1, -1], [0, 0], [1, 1]]},
  abs: {label: 'Absolute value · y = |x|', f: Math.abs, ex: s => `|${s}|`, pts: [[-1, 1], [0, 0], [1, 1]]},
  sq: {label: 'Quadratic · y = x²', f: x => x * x, ex: s => s === 'x' ? 'x²' : `(${s})²`, pts: [[-1, 1], [0, 0], [1, 1]]},
  cube: {label: 'Cubic · y = x³', f: x => x ** 3, ex: s => s === 'x' ? 'x³' : `(${s})³`, pts: [[-1, -1], [0, 0], [1, 1]]},
  sqrt: {label: 'Square root · y = √x', f: x => x >= 0 ? Math.sqrt(x) : NaN, ex: s => `√${wrapIn(s)}`, pts: [[0, 0], [1, 1], [4, 2]]},
  cbrt: {label: 'Cube root · y = ∛x', f: Math.cbrt, ex: s => `∛${wrapIn(s)}`, pts: [[-1, -1], [0, 0], [1, 1]]},
  rec: {label: 'Reciprocal · y = 1/x', f: x => 1 / x, ex: s => `1/${wrapIn(s)}`, pts: [[-1, -1], [1, 1]], va: 0, ha: 0},
  rec2: {label: 'Reciprocal squared · y = 1/x²', f: x => 1 / (x * x), ex: s => s === 'x' ? '1/x²' : `1/(${s})²`, pts: [[-1, 1], [1, 1]], va: 0, ha: 0}
};
CA.parentOptions = keys => (keys || Object.keys(CA.parents)).map(k => [k, CA.parents[k].label]);
/* "x − h" with the right sign: h = 3 -> "x − 3", h = −4 -> "x + 4" */
CA.xMinus = (h, v = 'x') => h === 0 ? v : h > 0 ? `${v} − ${fmt(h)}` : `${v} + ${fmt(-h)}`;
CA.plusK = k => k === 0 ? '' : k > 0 ? ` + ${fmt(k)}` : ` − ${fmt(-k)}`;

/* ---------- coordinate plane ---------- */
let planeCount = 0;
const COLORS = {orange: 'var(--cp-orange)', blue: 'var(--cp-blue)', green: 'var(--cp-green)', purple: 'var(--cp-purple)', gray: 'var(--cp-gray)', red: '#d63d28', text: 'var(--cp-text)'};
const col = c => COLORS[c] || c || COLORS.orange;
CA.color = col;
/* ---------- graph view: equal scale, zoom and pan (kept per graph across redraws) ---------- */
const VIEWS = new WeakMap();
const viewOf = svg => { let v = VIEWS.get(svg); if (!v) VIEWS.set(svg, v = {z: 1, px: 0, py: 0, eq: null}); return v; };
/* req = the window the lesson asked for; pw, ph = drawing area in px.
   auto: 'force' (always equal), true (equal unless that would widen an axis more than 3x), false (fit). */
CA.viewWindow = (svg, req, pw, ph, auto = true) => {
  const v = viewOf(svg), sx0 = req.xmax - req.xmin, sy0 = req.ymax - req.ymin;
  const ux = pw / sx0, uy = ph / sy0, ratio = Math.max(ux, uy) / Math.min(ux, uy);
  const autoEq = auto === 'force' || (auto === true && ratio <= 3.01), eq = v.eq === null ? autoEq : v.eq;
  let sx = sx0, sy = sy0;
  if (eq) { const u = Math.min(ux, uy); sx = pw / u; sy = ph / u; }
  sx /= v.z; sy /= v.z;
  const cx = (req.xmin + req.xmax) / 2 + v.px, cy = (req.ymin + req.ymax) / 2 + v.py;
  return {xmin: cx - sx / 2, xmax: cx + sx / 2, ymin: cy - sy / 2, ymax: cy + sy / 2, eq, autoEq, ratio, z: v.z, moved: v.z !== 1 || v.px !== 0 || v.py !== 0 || v.eq !== null};
};
/* toolbar under a graph; svg._caRedraw must redraw the graph with the current view */
CA.viewTools = (svg, win) => {
  let bar = svg._caTools;
  if (!bar) {
    bar = document.createElement('div'); bar.className = 'ca-plot-tools'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Graph view controls');
    bar.innerHTML = `<span class="ca-pt-group"><button type="button" data-a="out" title="Zoom out" aria-label="Zoom out">−</button><button type="button" data-a="in" title="Zoom in" aria-label="Zoom in">+</button></span><span class="ca-pt-group ca-pt-pan"><button type="button" data-a="l" title="Move left" aria-label="Move the view left">←</button><button type="button" data-a="u" title="Move up" aria-label="Move the view up">↑</button><button type="button" data-a="d" title="Move down" aria-label="Move the view down">↓</button><button type="button" data-a="r" title="Move right" aria-label="Move the view right">→</button></span><button type="button" class="ca-pt-eq" data-a="eq" aria-pressed="false" title="Use the same unit length on both axes">1:1 scale</button><button type="button" class="ca-pt-reset" data-a="reset" title="Back to the original view">Reset</button><span class="ca-pt-note" aria-live="polite"></span>`;
    svg.insertAdjacentElement('afterend', bar); svg._caTools = bar;
    bar.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const v = viewOf(svg), w = svg._caWin, a = b.dataset.a; if (!w) return;
      if (a === 'in') v.z = Math.min(16, v.z * 1.5);
      else if (a === 'out') v.z = Math.max(1 / 16, v.z / 1.5);
      else if (a === 'l' || a === 'r') v.px += (a === 'r' ? 1 : -1) * (w.xmax - w.xmin) * 0.25;
      else if (a === 'u' || a === 'd') v.py += (a === 'u' ? 1 : -1) * (w.ymax - w.ymin) * 0.25;
      else if (a === 'eq') v.eq = !w.eq;
      else if (a === 'reset') { v.z = 1; v.px = 0; v.py = 0; v.eq = null; }
      if (svg._caRedraw) svg._caRedraw();
    });
  }
  svg._caWin = win;
  const eqb = bar.querySelector('[data-a=eq]'); eqb.classList.toggle('active', win.eq); eqb.setAttribute('aria-pressed', String(win.eq));
  bar.querySelector('[data-a=reset]').disabled = !win.moved;
  const note = bar.querySelector('.ca-pt-note');
  note.textContent = win.eq ? 'Equal scale: 1 unit is the same length on both axes.' : win.autoEq ? 'The axes now use different unit lengths.' : 'The axes use different unit lengths so the graph fits. Press 1:1 for equal units.';
  note.classList.toggle('warn', !win.eq);
};

class Plane {
  constructor(svg, o = {}) {
    this.svg = typeof svg === 'string' ? $(svg) : svg;
    this.o = Object.assign({xmin: -6, xmax: 6, ymin: -5, ymax: 5, w: 560, h: 360, xstep: 0, ystep: 0, xname: 'x', yname: 'y', labels: true, grid: true, equal: 'auto', tools: true}, o);
    const {w, h} = this.o; this.L = 38; this.R = w - 16; this.T = 14; this.B = h - 30;
    this.id = 'cap' + (++planeCount); this.body = []; this.over = []; this.ops = [];
    this.req = {xmin: this.o.xmin, xmax: this.o.xmax, ymin: this.o.ymin, ymax: this.o.ymax};
    // equal scale by default for x–y graphs; quantity graphs (t, A, h, n …) start fitted to the window
    const eqMode = this.o.equal === true ? 'force' : this.o.equal === false ? false : (this.o.xname === 'x' && this.o.yname === 'y');
    this.eqMode = eqMode; this.fit();
    this.svg.setAttribute('viewBox', `0 0 ${w} ${h}`); this.svg.classList.add('ca-plot');
  }
  fit() { const w = CA.viewWindow(this.svg, this.req, this.R - this.L, this.B - this.T, this.eqMode); this.win = w; Object.assign(this.o, {xmin: w.xmin, xmax: w.xmax, ymin: w.ymin, ymax: w.ymax}); return w; }
  tx(x) { const o = this.o; return this.L + (x - o.xmin) / (o.xmax - o.xmin) * (this.R - this.L); }
  ty(y) { const o = this.o; return this.B - (y - o.ymin) / (o.ymax - o.ymin) * (this.B - this.T); }
  ix(px) { const o = this.o; return o.xmin + (px - this.L) / (this.R - this.L) * (o.xmax - o.xmin); }
  iy(py) { const o = this.o; return o.ymin + (this.B - py) / (this.B - this.T) * (o.ymax - o.ymin); }
  /* x ticks: numbers, or multiples of π when o.xpi is set (true = automatic step, or a Frac step such as F(1, 4) for π/4) */
  xticks(xs) {
    const o = this.o;
    if (!o.xpi) { const t = []; for (let x = Math.ceil(o.xmin / xs) * xs; x <= o.xmax + 1e-9; x += xs) t.push([x, CA.num(Math.abs(x) < 1e-9 ? 0 : x, 3)]); return t; }
    let st = o.xpi instanceof Frac ? o.xpi : null;
    if (!st) { const span = (o.xmax - o.xmin) / Math.PI, fam = o.xpiFam === 3 ? [F(1, 6), F(1, 3), F(2, 3), F(4, 3), F(8, 3)] : [F(1, 4), F(1, 2), F(1, 1), F(2, 1), F(4, 1), F(8, 1)]; st = fam.find(f => span / f.v <= 13) || fam[fam.length - 1]; }
    const step = st.v * Math.PI, t = [];
    if ((o.xmax - o.xmin) / step > 40) return t;
    for (let k = Math.ceil(o.xmin / step - 1e-9); k * step <= o.xmax + 1e-9; k++) if (o.xtickMin === undefined || k * step >= o.xtickMin - 1e-9) t.push([k * step, CA.piStr(st.mul(k))]);
    return t;
  }
  static nice(range, target = 10) { const raw = range / target, p = 10 ** Math.floor(Math.log10(raw)); for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= raw) return m * p; return 10 * p; }
  steps() {
    const o = this.o, sx = o.xmax - o.xmin, sy = o.ymax - o.ymin;
    let xs = o.xstep && sx / o.xstep <= 30 ? o.xstep : 0, ys = o.ystep && sy / o.ystep <= 24 ? o.ystep : 0;
    if (this.win && this.win.eq && !(xs && ys && xs === ys)) { const s = Plane.nice(Math.max(sx, sy), 12); return [s, o.xpi ? (ys || Plane.nice(sy, 9)) : s]; }
    return [xs || Plane.nice(sx, 12), ys || Plane.nice(sy, 9)];
  }
  axes() {
    const o = this.o, [xs, ys] = this.steps();
    let g = `<rect x="${this.L}" y="${this.T}" width="${this.R - this.L}" height="${this.B - this.T}" fill="var(--cp-bg)"/>`;
    const fx = v => CA.num(Math.abs(v) < 1e-9 ? 0 : v, 3);
    const XT = this.xticks(xs);
    if (o.grid) {
      for (const [x] of XT) g += `<line x1="${this.tx(x)}" y1="${this.T}" x2="${this.tx(x)}" y2="${this.B}" stroke="var(--cp-grid)" stroke-width="1"/>`;
      for (let y = Math.ceil(o.ymin / ys) * ys; y <= o.ymax + 1e-9; y += ys) g += `<line x1="${this.L}" y1="${this.ty(y)}" x2="${this.R}" y2="${this.ty(y)}" stroke="var(--cp-grid)" stroke-width="1"/>`;
    }
    const ax = o.ymin <= 0 && o.ymax >= 0 ? this.ty(0) : this.B, ay = o.xmin <= 0 && o.xmax >= 0 ? this.tx(0) : this.L;
    g += `<line x1="${this.L}" y1="${ax}" x2="${this.R}" y2="${ax}" stroke="var(--cp-axis)" stroke-width="1.6"/><line x1="${ay}" y1="${this.T}" x2="${ay}" y2="${this.B}" stroke="var(--cp-axis)" stroke-width="1.6"/>`;
    if (o.labels) {
      for (const [x, lab] of XT) { if (Math.abs(x) < 1e-9) continue; g += `<text x="${this.tx(x)}" y="${Math.min(this.B + 18, ax + 16)}" font-size="11.5" text-anchor="middle" fill="var(--cp-text)">${lab}</text>`; }
      for (let y = Math.ceil(o.ymin / ys) * ys; y <= o.ymax + 1e-9; y += ys) { if (Math.abs(y) < ys / 1e6) continue; g += `<text x="${Math.max(this.L - 5, ay - 6)}" y="${this.ty(y) + 4}" font-size="11.5" text-anchor="end" fill="var(--cp-text)">${fx(y)}</text>`; }
      g += `<text x="${this.R - 4}" y="${ax - 7}" font-size="13" font-weight="700" text-anchor="end" fill="var(--cp-text)">${o.xname}</text><text x="${ay + 7}" y="${this.T + 12}" font-size="13" font-weight="700" fill="var(--cp-text)">${o.yname}</text>`;
    }
    return g;
  }
  stroke(opt) { return `fill="none" stroke="${col(opt.color)}" stroke-width="${opt.width || 3}" stroke-linecap="round" stroke-linejoin="round"${opt.dash ? ` stroke-dasharray="${opt.dash === true ? '7 6' : opt.dash}"` : ''}${opt.opacity ? ` opacity="${opt.opacity}"` : ''}`; }
  // drawing calls are recorded and replayed at render(), so a zoom or pan redraws everything
  curve(...a) { this.ops.push(() => this._curve(...a)); return this; }
  param(...a) { this.ops.push(() => this._param(...a)); return this; }
  seg(...a) { this.ops.push(() => this._seg(...a)); return this; }
  vline(x, opt = {}) { this.ops.push(() => this._seg(x, this.o.ymin - 1, x, this.o.ymax + 1, Object.assign({dash: true, color: 'gray', width: 2}, opt))); return this; }
  hline(y, opt = {}) { this.ops.push(() => this._seg(this.o.xmin - 1, y, this.o.xmax + 1, y, Object.assign({dash: true, color: 'gray', width: 2}, opt))); return this; }
  lineMB(m, b, opt = {}) { this.ops.push(() => { const o = this.o; this._seg(o.xmin - 1, m * (o.xmin - 1) + b, o.xmax + 1, m * (o.xmax + 1) + b, Object.assign({width: 3}, opt)); }); return this; }
  band(...a) { this.ops.push(() => this._band(...a)); return this; }
  point(...a) { this.ops.push(() => this._point(...a)); return this; }
  label(...a) { this.ops.push(() => this._label(...a)); return this; }
  raw(s, over = false) { this.ops.push(() => (over ? this.over : this.body).push(s)); return this; }
  poly(...a) { this.ops.push(() => this._poly(...a)); return this; }
  /* custom drawing: fn(plane) runs at render time, so it can use tx/ty with the current view */
  draw(fn) { this.ops.push(() => fn(this)); return this; }
  _poly(pts, opt = {}) { const c = col(opt.color || 'orange'); this.body.push(`<polygon points="${pts.map(([x, y]) => this.tx(x).toFixed(2) + ',' + this.ty(y).toFixed(2)).join(' ')}" fill="${opt.fill ? col(opt.fill) : c}" fill-opacity="${opt.fillOpacity ?? 0.18}" stroke="${opt.stroke === false ? 'none' : c}" stroke-width="${opt.width ?? 0}"${opt.dash ? ' stroke-dasharray="6 5"' : ''}/>`); }
  _curve(f, opt = {}) {
    const o = this.o, a = Math.max(o.xmin, opt.from ?? -Infinity), b = Math.min(o.xmax, opt.to ?? Infinity), n = opt.samples || 900;
    if (!(b > a)) return;
    const yr = o.ymax - o.ymin, lim = yr * 6, breaks = (opt.breaks || []).slice().sort((p, q) => p - q);
    let segs = [], cur = [], prevX = null;
    const flush = () => { if (cur.length > 1) segs.push(cur); cur = []; };
    for (let i = 0; i <= n; i++) {
      let x = a + (b - a) * i / n;
      if (prevX !== null && breaks.some(k => prevX < k && x > k)) flush();
      if (breaks.some(k => Math.abs(x - k) < 1e-12)) { flush(); prevX = x; continue; }
      const y = f(x);
      if (!Number.isFinite(y) || Math.abs(y - (o.ymin + yr / 2)) > lim) { flush(); prevX = x; continue; }
      cur.push([this.tx(x), this.ty(y)]); prevX = x;
    }
    flush();
    const d = segs.map(s => 'M' + s.map(p => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' L')).join(' ');
    if (!d) return;
    this.body.push(`<path d="${d}" ${this.stroke(opt)}${opt.arrows ? ` marker-start="url(#${this.id}-arr)" marker-end="url(#${this.id}-arr)"` : ''}/>`);
  }
  _param(fx, fy, t0, t1, opt = {}) {
    const n = opt.samples || 400; let d = '';
    for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; d += (i ? 'L' : 'M') + this.tx(fx(t)).toFixed(2) + ' ' + this.ty(fy(t)).toFixed(2) + ' '; }
    this.body.push(`<path d="${d}" ${this.stroke(opt)}${opt.arrow ? ` marker-end="url(#${this.id}-arr2)"` : ''}/>`);
  }
  _seg(x1, y1, x2, y2, opt = {}) { this.body.push(`<line x1="${this.tx(x1)}" y1="${this.ty(y1)}" x2="${this.tx(x2)}" y2="${this.ty(y2)}" ${this.stroke(Object.assign({width: 2.2}, opt))}${opt.arrow ? ` marker-end="url(#${this.id}-arr2)"` : ''}/>`); }
  _band(axis, a, b, opt = {}) { // highlight an interval on an axis
    const o = this.o, c = col(opt.color || 'blue'), w = opt.width || 9;
    if (axis === 'x') { const y = o.ymin <= 0 && o.ymax >= 0 ? this.ty(0) : this.B; this.body.push(`<line x1="${this.tx(Math.max(a, o.xmin))}" y1="${y}" x2="${this.tx(Math.min(b, o.xmax))}" y2="${y}" stroke="${c}" stroke-width="${w}" stroke-opacity=".55" stroke-linecap="round"/>`); }
    else { const x = o.xmin <= 0 && o.xmax >= 0 ? this.tx(0) : this.L; this.body.push(`<line x1="${x}" y1="${this.ty(Math.max(a, o.ymin))}" x2="${x}" y2="${this.ty(Math.min(b, o.ymax))}" stroke="${c}" stroke-width="${w}" stroke-opacity=".55" stroke-linecap="round"/>`); }
  }
  inside(x, y) { const o = this.o; return x >= o.xmin - 1e-9 && x <= o.xmax + 1e-9 && y >= o.ymin - 1e-9 && y <= o.ymax + 1e-9; }
  _point(x, y, opt = {}) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !this.inside(x, y)) return;
    const c = col(opt.color), r = opt.r || 6, filled = opt.filled !== false;
    this.over.push(`<circle cx="${this.tx(x)}" cy="${this.ty(y)}" r="${r}" fill="${filled ? c : 'var(--cp-bg)'}" stroke="${filled ? 'var(--cp-bg)' : c}" stroke-width="${filled ? 2 : 3}"/>`);
    if (opt.label) this._label(x, y, opt.label, Object.assign({color: opt.color}, opt.labelOpt || {}));
  }
  _label(x, y, text, opt = {}) {
    if (!this.inside(x, y)) return;
    const dx = opt.dx ?? 9, dy = opt.dy ?? -10, anchor = opt.anchor || (this.tx(x) > this.R - 90 ? 'end' : 'start');
    const X = this.tx(x) + (anchor === 'end' ? -Math.abs(dx) : dx), Y = Math.max(this.T + 12, Math.min(this.B - 4, this.ty(y) + dy));
    this.over.push(`<text x="${X}" y="${Y}" font-size="${opt.size || 13}" font-weight="${opt.weight || 800}" text-anchor="${anchor}" fill="${col(opt.color || 'text')}" paint-order="stroke" stroke="var(--cp-bg)" stroke-width="4">${text}</text>`);
  }
  render() {
    const w = this.fit(); this.body = []; this.over = [];
    this.ops.forEach(op => op());
    const arr = `<marker id="${this.id}-arr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto-start-reverse"><path d="M0 0 L6 3 L0 6 Z" fill="context-stroke"/></marker><marker id="${this.id}-arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="context-stroke"/></marker>`;
    this.svg.innerHTML = `<defs><clipPath id="${this.id}-clip"><rect x="${this.L}" y="${this.T}" width="${this.R - this.L}" height="${this.B - this.T}"/></clipPath>${arr}</defs>${this.axes()}<g clip-path="url(#${this.id}-clip)">${this.body.join('')}</g>${this.over.join('')}`;
    this.svg._caRedraw = () => this.render(); this.svg._caPlane = this;
    if (this.o.tools) CA.viewTools(this.svg, w);
    return this;
  }
}
CA.Plane = Plane;
CA.plane = (svg, o) => new Plane(svg, o);


/* y-window that shows turning points and intercepts clearly (ends may run off the graph) */
CA.autoY = (f, x0, x1, extra = [], minSpan = 6) => {
  const n = 600, ys = [], vals = [];
  for (let i = 0; i <= n; i++) { const v = f(x0 + (x1 - x0) * i / n); vals.push(v); }
  for (let i = 1; i < n; i++) { const a = vals[i - 1], b = vals[i], c = vals[i + 1]; if ([a, b, c].every(Number.isFinite) && (b - a) * (c - b) <= 0) ys.push(b); }
  ys.push(0, ...extra.filter(Number.isFinite));
  let lo = Math.min(...ys), hi = Math.max(...ys);
  if (hi - lo < minSpan) { const m = (hi + lo) / 2; lo = m - minSpan / 2; hi = m + minSpan / 2; }
  const pad = (hi - lo) * 0.25; return [lo - pad, hi + pad];
};

/* ---------- number line ---------- */
CA.numberLine = (svg, {min = -10, max = 10, step = 2, segments = [], points = [], labels = []} = {}) => {
  svg = typeof svg === 'string' ? $(svg) : svg; svg.setAttribute('viewBox', '0 0 620 120'); svg.classList.add('ca-plot');
  const l = 30, r = 590, y = 62, tx = n => l + (n - min) / (max - min) * (r - l); let s = `<line x1="${l}" x2="${r}" y1="${y}" y2="${y}" stroke="var(--cp-axis)" stroke-width="2"/>`;
  for (let t = min; t <= max + 1e-9; t += step) s += `<line x1="${tx(t)}" x2="${tx(t)}" y1="${y - 5}" y2="${y + 6}" stroke="var(--cp-axis)"/><text x="${tx(t)}" y="${y + 24}" font-size="12.5" text-anchor="middle" fill="var(--cp-text)">${CA.num(t, 3)}</text>`;
  for (const z of segments) {
    const a = z.a === null ? l : tx(z.a), b = z.b === null ? r : tx(z.b), c = col(z.color || 'orange');
    s += `<line x1="${a}" x2="${b}" y1="${y}" y2="${y}" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`;
    if (z.a === null) s += `<path d="M${l} ${y} l14 -9 v18 z" fill="${c}"/>`; else s += `<circle cx="${a}" cy="${y}" r="7" fill="${z.ac ? c : 'var(--cp-bg)'}" stroke="${c}" stroke-width="3"/>`;
    if (z.b === null) s += `<path d="M${r} ${y} l-14 -9 v18 z" fill="${c}"/>`; else s += `<circle cx="${b}" cy="${y}" r="7" fill="${z.bc ? c : 'var(--cp-bg)'}" stroke="${c}" stroke-width="3"/>`;
  }
  for (const p of points) s += `<circle cx="${tx(p.x)}" cy="${y}" r="7" fill="${p.filled ? col(p.color || 'orange') : 'var(--cp-bg)'}" stroke="${col(p.color || 'orange')}" stroke-width="3"/>`;
  for (const t of labels) s += `<text x="${tx(t.x)}" y="${y - 16}" font-size="13" font-weight="800" text-anchor="middle" fill="${col(t.color || 'orange')}">${t.text}</text>`;
  svg.innerHTML = s;
};

/* ---------- controls ---------- */
CA.controls = (box, specs, onChange) => {
  box = typeof box === 'string' ? $(box) : box;
  const state = {}, inputs = {}, outs = {}, last = {};
  const show = (sp, v) => sp.fmt ? sp.fmt(v) : (typeof v === 'number' ? fmt(v) : v);
  box.innerHTML = specs.map(sp => {
    const id = (box.id || 'c') + '-' + sp.key;
    if (sp.type === 'range') return `<label for="${id}">${sp.label} <output id="${id}-out"></output><input id="${id}" type="range" min="${sp.min}" max="${sp.max}" step="${sp.step || 1}" value="${sp.value}"></label>`;
    if (sp.type === 'select') return `<label for="${id}">${sp.label}<select id="${id}">${sp.options.map(([v, t]) => `<option value="${v}"${String(v) === String(sp.value) ? ' selected' : ''}>${t}</option>`).join('')}</select></label>`;
    if (sp.type === 'number') return `<label for="${id}">${sp.label}<input id="${id}" type="number" value="${sp.value}" step="${sp.step || 'any'}"${sp.min !== undefined ? ` min="${sp.min}"` : ''}${sp.max !== undefined ? ` max="${sp.max}"` : ''}></label>`;
    if (sp.type === 'text') return `<label for="${id}">${sp.label}<input id="${id}" type="text" value="${CA.esc(sp.value)}" placeholder="${CA.esc(sp.placeholder || '')}" autocomplete="off" spellcheck="false"></label>`;
    if (sp.type === 'check') return `<label class="ca-inline-check"><input id="${id}" type="checkbox"${sp.value ? ' checked' : ''}> ${sp.label}</label>`;
    if (sp.type === 'seg') return `<div class="ca-seg-wrap"><span class="ca-seg-label">${sp.label || ''}</span><div class="ca-seg" role="group" aria-label="${CA.esc((sp.label || sp.key).replace(/<[^>]+>/g, ''))}" id="${id}">${sp.options.map(([v, t]) => `<button type="button" data-v="${v}" aria-pressed="false">${t}</button>`).join('')}</div></div>`;
    return '';
  }).join('');
  const read = sp => {
    const el = inputs[sp.key];
    if (sp.type === 'range' || sp.type === 'number') return el.value === '' ? NaN : Number(el.value);
    if (sp.type === 'check') return el.checked;
    return el.value;
  };
  specs.forEach(sp => {
    const id = (box.id || 'c') + '-' + sp.key; inputs[sp.key] = $(id); outs[sp.key] = $(id + '-out');
    if (sp.type === 'seg') {
      const group = inputs[sp.key]; let val = String(sp.value);
      const paint = () => group.querySelectorAll('button').forEach(b => { const on = b.dataset.v === val; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
      inputs[sp.key] = {get value() { return val; }, set value(v) { val = String(v); paint(); }};
      group.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; val = b.dataset.v; paint(); state[sp.key] = val; onChange && onChange(state, sp.key); });
      paint(); state[sp.key] = val; return;
    }
    state[sp.key] = read(sp); last[sp.key] = state[sp.key];
    if (outs[sp.key]) outs[sp.key].textContent = show(sp, state[sp.key]);
    inputs[sp.key].addEventListener(sp.type === 'select' || sp.type === 'check' ? 'change' : 'input', () => {
      let v = read(sp);
      if (sp.skip && sp.skip.includes(v)) { const dir = v > last[sp.key] ? 1 : -1; v = v + dir * (sp.step || 1); if (v > sp.max || v < sp.min) v = last[sp.key]; inputs[sp.key].value = v; }
      state[sp.key] = v; last[sp.key] = v; if (outs[sp.key]) outs[sp.key].textContent = show(sp, v);
      onChange && onChange(state, sp.key);
    });
  });
  Object.defineProperty(state, 'set', {value(key, v, silent) { const sp = specs.find(s => s.key === key); inputs[key].value = v; if (sp.type === 'check') inputs[key].checked = !!v; state[key] = sp.type === 'seg' ? String(v) : read(sp); last[key] = state[key]; if (outs[key]) outs[key].textContent = show(sp, state[key]); if (!silent && onChange) onChange(state, key); }});
  Object.defineProperty(state, 'input', {value: key => inputs[key]});
  Object.defineProperty(state, 'setOptions', {value(key, options, value) { const el = inputs[key]; el.innerHTML = options.map(([v, t]) => `<option value="${v}">${t}</option>`).join(''); el.value = value ?? options[0][0]; state[key] = el.value; }});
  return state;
};

/* ---------- lab: controls + optional graph, readouts, feedback, steps ---------- */
CA.lab = (id, spec, update) => {
  const box = $(id); if (!box) throw new Error('missing lab ' + id);
  box.classList.add('ca-lab');
  box.innerHTML = `${spec.controls ? `<div class="ca-controls" id="${id}-ctl"></div>` : ''}${spec.top || ''}${spec.legend ? `<div class="ca-plot-legend">${spec.legend.map(([c, t, d]) => `<span><i class="${d ? 'dash' : ''}" style="background:${col(c)};color:${col(c)}"></i>${t}</span>`).join('')}</div>` : ''}${spec.plot ? `<svg id="${id}-svg" role="img" aria-label="${CA.esc(spec.plotLabel || 'Interactive graph')}"></svg>` : ''}${spec.readouts ? `<div class="ca-readouts" aria-live="polite">${spec.readouts.map(([k, t]) => `<div><small>${t}</small><strong id="${id}-r-${k}"></strong></div>`).join('')}</div>` : ''}${spec.middle || ''}${spec.out !== false ? `<div class="ca-feedback" id="${id}-out" aria-live="polite"></div>` : ''}${spec.steps ? `<ol class="ca-calculation-steps" id="${id}-steps" aria-label="Worked steps"></ol>` : ''}${spec.bottom || ''}`;
  const lab = {box, svg: $(id + '-svg'), outEl: $(id + '-out'), stepsEl: $(id + '-steps')};
  lab.plane = o => new Plane(lab.svg, Object.assign({}, spec.plot === true ? {} : spec.plot, o));
  lab.read = (k, html) => { const el = $(id + '-r-' + k); if (el) el.innerHTML = html; };
  lab.out = (html, cls) => { if (lab.outEl) { lab.outEl.innerHTML = html; lab.outEl.className = 'ca-feedback' + (cls ? ' ' + cls : ''); } };
  lab.steps = arr => { if (lab.stepsEl) lab.stepsEl.innerHTML = CA.stepsHTML(arr); };
  lab.el = sel => box.querySelector(sel);
  const run = (st, key) => { try { update(lab, st, key); } catch (e) { console.error(e); } };
  lab.state = spec.controls ? CA.controls(id + '-ctl', spec.controls, run) : {};
  lab.refresh = () => run(lab.state, null);
  lab.refresh();
  return lab;
};
CA.stepsHTML = arr => arr.map(s => Array.isArray(s) ? `<li><span class="ca-step-label">${s[0]}</span><span class="ca-step-math">${s[1]}</span></li>` : `<li>${s}</li>`).join('');

/* ---------- stepper: walk through a sequence of stages ---------- */
CA.stepper = (box, count, render, {labels} = {}) => {
  box = typeof box === 'string' ? $(box) : box; let i = 0;
  box.innerHTML = `<button type="button" class="ca-btn ca-btn-outline" data-a="prev">← Back</button><button type="button" class="ca-btn" data-a="next">Next step →</button><button type="button" class="ca-btn ca-btn-outline" data-a="all">Show all</button><button type="button" class="ca-btn ca-btn-outline" data-a="reset">Start over</button><span class="ca-note" aria-live="polite"></span>`;
  box.classList.add('ca-stepper-bar');
  const paint = () => { box.querySelector('[data-a=prev]').disabled = i === 0; box.querySelector('[data-a=next]').disabled = i >= count() - 1; box.querySelector('.ca-note').textContent = `Step ${i + 1} of ${count()}${labels ? ' · ' + labels(i) : ''}`; render(i); };
  box.addEventListener('click', e => { const a = e.target.closest('button')?.dataset.a; if (!a) return; if (a === 'prev') i = Math.max(0, i - 1); if (a === 'next') i = Math.min(count() - 1, i + 1); if (a === 'all') i = count() - 1; if (a === 'reset') i = 0; paint(); });
  const api = {go(n) { i = Math.max(0, Math.min(count() - 1, n)); paint(); }, get i() { return i; }, reset() { i = 0; paint(); }};
  paint(); return api;
};

/* ---------- quick multiple choice with instant feedback ---------- */
CA.choice = (box, {q, options, correct, why, whyWrong, onAnswer}) => {
  box = typeof box === 'string' ? $(box) : box;
  box.classList.add('ca-predict');
  box.innerHTML = `${q ? `<p><b>${q}</b></p>` : ''}<div class="ca-choice-row" role="group">${options.map((o, i) => `<button type="button" class="ca-choice" data-i="${i}" aria-pressed="false">${o}</button>`).join('')}</div><div class="ca-feedback" aria-live="polite" hidden></div>`;
  const fb = box.querySelector('.ca-feedback');
  box.addEventListener('click', e => {
    const b = e.target.closest('[data-i]'); if (!b) return; const i = +b.dataset.i, ok = i === correct;
    box.querySelectorAll('[data-i]').forEach(x => { const on = x === b; x.classList.toggle('selected', on); x.setAttribute('aria-pressed', String(on)); });
    fb.hidden = false; fb.className = 'ca-feedback ' + (ok ? 'ca-correct' : 'ca-incorrect');
    fb.innerHTML = (ok ? '✓ Correct. ' : '✕ Not quite. ') + (ok || !whyWrong ? why : (typeof whyWrong === 'function' ? whyWrong(i) : whyWrong));
    onAnswer && onAnswer(ok, i);
  });
};

/* ---------- sorting cards: each card has its own choice buttons ---------- */
CA.cards = (box, items, {options: shared} = {}) => {
  box = typeof box === 'string' ? $(box) : box; box.classList.add('ca-cards');
  box.innerHTML = items.map((it, k) => `<div class="ca-card" data-k="${k}"><div class="ca-card-expr">${it.expr}</div><div class="ca-seg" role="group" aria-label="Choose an answer">${(it.options || shared).map((o, i) => `<button type="button" data-i="${i}" aria-pressed="false">${o}</button>`).join('')}</div><div class="ca-card-why" aria-live="polite"></div></div>`).join('');
  box.addEventListener('click', e => {
    const b = e.target.closest('[data-i]'); if (!b) return; const card = b.closest('.ca-card'), it = items[+card.dataset.k], ok = +b.dataset.i === it.correct;
    card.querySelectorAll('[data-i]').forEach(x => { const on = x === b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', String(on)); });
    card.classList.toggle('right', ok); card.classList.toggle('wrong', !ok);
    card.querySelector('.ca-card-why').innerHTML = (ok ? '<span class="ca-ok">✓</span> ' : '<span class="ca-bad">✕</span> ') + it.why;
  });
};

/* ---------- "see that problem" previews: hover (mouse) or tap/click (pins it) ---------- */
// A guided bank entry may carry `ref`, pointing at the earlier problem it reuses:
//   {panel: 'id', what: 'the game-booth rule', body: 'html', plot: {win: {...}, draw: P => ...}}   an activity on this page
//   {problem: 3, what: 'the same functions', body: 'html'}                                          entry 3 (1-based) of the same bank
//   {page: '3-7', panel: 'hlt', section: '3.7', title: '…', what: '…', body: 'html', plot: {…}}    an activity in another section
let refCount = 0, openRef = null;
const refClose = () => {
  if (!openRef) return; const r = openRef; openRef = null; r.pinned = false;
  r.pop.hidden = true; r.chip.setAttribute('aria-expanded', 'false'); r.chip.classList.remove('is-open', 'is-pinned');
};
document.addEventListener('keydown', e => { if (e.key === 'Escape' && openRef) { const c = openRef.chip; refClose(); c.focus(); } });
document.addEventListener('click', e => { if (openRef && openRef.pinned && !openRef.wrap.contains(e.target)) refClose(); });
CA.backButton = (target, label) => {
  document.querySelector('.ca-back-float')?.remove();
  const b = document.createElement('button'); b.type = 'button'; b.className = 'ca-back-float';
  b.innerHTML = `<i aria-hidden="true" class="fa-solid fa-arrow-down"></i> ${label}`;
  b.addEventListener('click', () => { b.remove(); CA.flashTo(target); });
  document.body.append(b);
};
CA.flashTo = (target, block = 'center') => {
  target.scrollIntoView({behavior: 'smooth', block});
  target.classList.remove('ca-flash'); void target.offsetWidth; target.classList.add('ca-flash');
  setTimeout(() => target.classList.remove('ca-flash'), 1800);
};
const panelTitle = id => { const h = document.getElementById(id)?.querySelector('h3'); return h ? h.textContent.replace(/\s+/g, ' ').trim() : 'an earlier activity'; };
const refHTML = (ref, bank, chosen) => {
  const n = ++refCount;
  let kicker, source, body = ref.body || '', jump = '';
  if (ref.problem) {
    const target = bank[ref.problem - 1], pos = chosen.findIndex(c => c.q === target);
    kicker = 'FROM THIS PRACTICE SET'; source = pos >= 0 ? `Problem ${pos + 1}` : 'a problem in another set';
    body = `<p class="ca-ref-q">${target.q}</p>` + body;
    if (pos >= 0) jump = `<a class="ca-ref-jump" href="#" data-problem="${pos}">Show Problem ${pos + 1} in the list <i aria-hidden="true" class="fa-solid fa-arrow-up"></i></a>`;
  } else if (ref.page) {
    kicker = `FROM SECTION ${ref.section}`; source = `Section ${ref.section} · ${ref.title}`;
    jump = `<a class="ca-ref-jump" href="${CA.BASE}${ref.page}/#${ref.panel}">Open Section ${ref.section} <i aria-hidden="true" class="fa-solid fa-arrow-up-right-from-square"></i></a>`;
  } else {
    const t = panelTitle(ref.panel);
    kicker = 'EARLIER ON THIS PAGE'; source = `activity ${t}`;
    jump = `<a class="ca-ref-jump" href="#${ref.panel}" data-panel="${ref.panel}">Go to activity ${t.split(' · ')[0]} <i aria-hidden="true" class="fa-solid fa-arrow-up"></i></a><span class="ca-ref-note">A “Back to the problem” button will bring you here.</span>`;
  }
  return `<div class="ca-ref" data-ref="${n}"><button type="button" class="ca-ref-chip" aria-expanded="false" aria-controls="ca-ref-pop-${n}">`
    + `<span class="ca-ref-text"><i aria-hidden="true" class="fa-solid fa-link"></i> Uses ${ref.what} from <b>${source}</b></span>`
    + `<span class="ca-ref-how"><i aria-hidden="true" class="fa-regular fa-hand-pointer"></i> Hover over or tap this link to see that problem here</span></button>`
    + `<div class="ca-ref-pop" id="ca-ref-pop-${n}" role="dialog" aria-label="Preview: ${CA.esc(source.replace(/<[^>]+>/g, ''))}" hidden>`
    + `<div class="ca-ref-head"><div><span class="ca-ref-kicker">${kicker}</span><b>${source.replace(/^activity /, '')}</b></div><button type="button" class="ca-ref-close" aria-label="Close preview">×</button></div>`
    + `<div class="ca-ref-body">${body}${ref.plot ? `<svg class="ca-ref-plot" role="img" aria-label="${CA.esc(ref.plot.label || 'Graph from that problem')}"></svg>` : ''}</div>`
    + (jump ? `<div class="ca-ref-foot">${jump}</div>` : '') + '</div></div>';
};
const wireRef = (wrap, ref, question, list) => {
  const chip = wrap.querySelector('.ca-ref-chip'), pop = wrap.querySelector('.ca-ref-pop'), st = {wrap, chip, pop, pinned: false};
  let timer = null;
  const place = () => {
    pop.classList.remove('is-above'); pop.style.left = '0px';
    const vw = Math.min(innerWidth, document.documentElement.clientWidth || innerWidth, window.visualViewport ? visualViewport.width : innerWidth);
    const r = pop.getBoundingClientRect(), c = chip.getBoundingClientRect();
    if (r.right > vw - 10) pop.style.left = Math.max(10 - r.left, vw - 10 - r.right) + 'px';
    if (r.bottom > innerHeight - 8 && c.top - r.height - 10 > 0) pop.classList.add('is-above');
    else if (st.pinned && r.bottom > innerHeight - 8) pop.scrollIntoView({block: 'nearest', behavior: 'smooth'});
  };
  const open = pin => {
    clearTimeout(timer);
    if (openRef && openRef !== st) refClose();
    if (ref.plot && !pop._drawn) { const P = new CA.Plane(pop.querySelector('.ca-ref-plot'), Object.assign({w: 440, h: 270, tools: false}, ref.plot.win || {})); ref.plot.draw(P); P.render(); pop._drawn = true; }
    pop.hidden = false; chip.setAttribute('aria-expanded', 'true'); chip.classList.add('is-open');
    if (pin) st.pinned = true; chip.classList.toggle('is-pinned', st.pinned);
    openRef = st; place();
  };
  wrap.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') open(false); });
  wrap.addEventListener('pointerleave', e => { if (e.pointerType !== 'mouse' || st.pinned) return; clearTimeout(timer); timer = setTimeout(() => { if (openRef === st && !st.pinned) refClose(); }, 250); });
  chip.addEventListener('click', () => { if (openRef === st && st.pinned) refClose(); else open(true); });
  pop.querySelector('.ca-ref-close').addEventListener('click', () => { refClose(); chip.focus(); });
  const jump = pop.querySelector('.ca-ref-jump');
  if (jump && (jump.dataset.panel || jump.dataset.problem)) jump.addEventListener('click', e => {
    e.preventDefault(); refClose();
    const label = question.getAttribute('aria-label');
    const target = jump.dataset.panel ? document.getElementById(jump.dataset.panel) : list[Number(jump.dataset.problem)];
    if (!target) return;
    CA.flashTo(target, jump.dataset.panel ? 'start' : 'center');
    if (jump.dataset.panel) CA.backButton(question, `Back to ${label}`);
  });
};

/* ---------- guided problems (multiple choice sets with hints) ---------- */
CA.guided = (which, bank, {count = 5} = {}) => {
  const container = $(`quiz-${which}-container`), status = $(`quiz-${which}-feedback`); if (!container) return;
  let offset = 0;
  const say = (cls, html) => { status.className = 'ca-feedback ca-quiz-status' + (cls ? ' ' + cls : ''); status.innerHTML = html; };
  const clear = el => {
    el.classList.remove('ca-answered-correct', 'ca-answered-incorrect', 'ca-answered-none');
    el.querySelectorAll('label').forEach(l => { l.classList.remove('ca-opt-right', 'ca-opt-wrong'); l.querySelector('.ca-opt-tag')?.remove(); });
    const ex = el.querySelector('.ca-quiz-explanation'); ex.hidden = true; ex.className = 'ca-quiz-explanation';
  };
  const render = () => {
    refClose();
    const chosen = Array.from({length: Math.min(count, bank.length)}, (_, i) => ({q: bank[(offset + i) % bank.length], i}));
    chosen.forEach(c => { const n = c.q.opts.length, perm = [...Array(n).keys()]; if (!c.q.keep) for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [perm[k], perm[j]] = [perm[j], perm[k]]; } c.perm = perm; c.correct = perm.indexOf(c.q.correct); });
    container.innerHTML = chosen.map(({q, i, perm, correct}) => `<div class="ca-quiz-question" role="group" aria-label="Problem ${i + 1}" data-answer="${correct}"><p class="ca-quiz-prompt">${i + 1}. ${q.q}</p>${q.ref ? refHTML(q.ref, bank, chosen) : ''}${q.fig ? `<div class="ca-quiz-fig">${q.fig}</div>` : ''}${perm.map((k, j) => `<label><input type="radio" name="guided${which}-${i}" value="${j}"> <span class="ca-opt-text">${q.opts[k]}</span></label>`).join('')}${q.hint ? `<details class="ca-quiz-hint"><summary>Need a hint?</summary><p>${q.hint}</p></details>` : ''}<div class="ca-quiz-explanation" aria-live="polite" hidden></div></div>`).join('');
    say('', 'Choose an answer for each problem. You can open a hint before checking.');
    const list = [...container.querySelectorAll('.ca-quiz-question')];
    list.forEach((el, i) => {
      el._q = chosen[i].q;
      if (el._q.ref) wireRef(el.querySelector('.ca-ref'), el._q.ref, el, list);
      el.addEventListener('change', () => { if (el.matches('[class*="ca-answered-"]')) clear(el); });
    });
  };
  const optText = (el, j) => el.querySelectorAll('.ca-opt-text')[j].innerHTML;
  const tag = (label, cls, text) => { const s = document.createElement('span'); s.className = 'ca-opt-tag ' + cls; s.textContent = text; label.querySelector('.ca-opt-text').append(s); };
  $(`quiz-${which}-check`).addEventListener('click', () => {
    let score = 0, answered = 0; const qs = [...container.querySelectorAll('.ca-quiz-question')];
    qs.forEach(el => {
      clear(el);
      const a = el.querySelector('input:checked'), ans = Number(el.dataset.answer), labels = el.querySelectorAll('label');
      const state = !a ? 'none' : Number(a.value) === ans ? 'correct' : 'incorrect';
      if (a) answered++; if (state === 'correct') score++;
      el.classList.add('ca-answered-' + state);
      const ansText = optText(el, ans), pickText = a ? optText(el, Number(a.value)) : '';
      labels[ans].classList.add('ca-opt-right'); tag(labels[ans], 'is-right', state === 'correct' ? '✓ your answer' : '✓ correct answer');
      if (state === 'incorrect') { labels[Number(a.value)].classList.add('ca-opt-wrong'); tag(labels[Number(a.value)], 'is-wrong', '✕ your answer'); }
      const ex = el.querySelector('.ca-quiz-explanation'); ex.hidden = false; ex.className = 'ca-quiz-explanation is-' + state;
      ex.innerHTML = state === 'correct' ? `<b class="ca-x-head">✓ Correct.</b> ${el._q.why}`
        : state === 'incorrect' ? `<b class="ca-x-head">✕ Not quite.</b> You chose <span class="ca-x-pick">${pickText}</span>, but the correct answer is <span class="ca-x-ans">${ansText}</span>.<span class="ca-x-why"><b>Worked explanation:</b> ${el._q.why}</span>`
        : `<b class="ca-x-head">No answer chosen.</b> The correct answer is <span class="ca-x-ans">${ansText}</span>.<span class="ca-x-why"><b>Worked explanation:</b> ${el._q.why}</span>`;
    });
    const wrong = answered - score, blank = qs.length - answered;
    if (score === qs.length) say('is-correct', `<b>✓ ${score} / ${qs.length} correct.</b> Well done. Press <b>Try more problems</b> for a new set.`);
    else say(wrong ? 'is-incorrect' : 'is-none', `<b>${score} / ${qs.length} correct.</b> ${wrong ? `${wrong} answer${wrong === 1 ? ' is' : 's are'} wrong (marked in red)` : ''}${wrong && blank ? '; ' : ''}${blank ? `${blank} problem${blank === 1 ? ' was' : 's were'} not answered (marked in yellow)` : ''}. Read the worked explanations, change any answer, and check again.`);
  });
  $(`quiz-${which}-reset`).addEventListener('click', () => { offset = (offset + count) % bank.length; render(); });
  render();
};

/* ---------- predict-first cards: lock an activity until the student predicts (or skips) ---------- */
CA.initPredictGates = () => document.querySelectorAll('.ca-predict-gate').forEach(card => {
  const target = $(card.dataset.gate); if (!target || card._ready) return; card._ready = true;
  const note = document.createElement('p'); note.className = 'ca-gate-note'; note.innerHTML = '<i aria-hidden="true" class="fa-solid fa-lock"></i> Make a prediction above (or skip) to unlock the explorer.';
  target.before(note);
  const lock = on => { target.classList.toggle('is-locked', on); if (on) target.setAttribute('inert', ''); else target.removeAttribute('inert'); note.hidden = !on; };
  lock(true);
  const fb = card.querySelector('.ca-predict-feedback');
  const after = () => { const id = card.dataset.setId, v = card.dataset.setValue; if (id && $(id)) { $(id).value = v; $(id).dispatchEvent(new Event('input', {bubbles: true})); $(id).dispatchEvent(new Event('change', {bubbles: true})); } if (card.dataset.setSeg) { const b = document.querySelector(card.dataset.setSeg); b && b.click(); } };
  card.querySelectorAll('[data-predict]').forEach(btn => btn.addEventListener('click', () => {
    const ok = btn.dataset.predict === card.dataset.correct;
    card.querySelectorAll('[data-predict]').forEach(b => { const on = b === btn; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', String(on)); });
    fb.hidden = false; fb.className = 'ca-feedback ca-predict-feedback ' + (ok ? 'ca-correct' : 'ca-incorrect');
    fb.innerHTML = (ok ? '✓ Good prediction. ' : '✕ Not quite. ') + card.querySelector('template.ca-predict-why').innerHTML;
    lock(false); after();
  }));
  card.querySelector('.ca-predict-skip')?.addEventListener('click', () => { lock(false); fb.hidden = false; fb.className = 'ca-feedback ca-predict-feedback'; fb.textContent = 'Explorer unlocked. You can still make a prediction above.'; });
});

/* ---------- answer boxes: compare typed numbers with expected values ---------- */
CA.parseNum = s => {
  s = String(s).trim().replace(/−/g, '-').replace(/\s+/g, ''); if (!s) return NaN;
  if (/^-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/.test(s)) { const [a, b] = s.split('/').map(Number); return a / b; }
  return Number(s);
};
CA.checkInputs = (inputs, expected, tol = 1e-6) => inputs.map((el, i) => {
  const v = CA.parseNum(el.value), ok = Number.isFinite(v) && Math.abs(v - expected[i]) <= tol * Math.max(1, Math.abs(expected[i]));
  el.classList.toggle('right', ok); el.classList.toggle('wrong', !ok && el.value.trim() !== ''); return ok;
});

/* =====================================================================
   PRECALCULUS ADDITIONS: angles, exact values, radicals, unit circle,
   triangles, dragging, polar grids
   ===================================================================== */
const PI = Math.PI;
CA.PI = PI;
CA.toRad = d => d * PI / 180;
CA.toDeg = r => r * 180 / PI;
CA.deg = (v, d = 1) => CA.num(v, d) + '°';
CA.norm360 = d => ((d % 360) + 360) % 360;
CA.trig = {sin: Math.sin, cos: Math.cos, tan: Math.tan, csc: x => 1 / Math.sin(x), sec: x => 1 / Math.cos(x), cot: x => Math.cos(x) / Math.sin(x)};
/* a multiple of π given as a Frac (or number): F(5, 6) -> "5π/6" */
CA.piStr = f => { f = Frac.of(f); if (f.n === 0) return '0'; const sg = f.n < 0 ? '−' : '', n = Math.abs(f.n); return sg + (n === 1 ? '' : n) + 'π' + (f.d === 1 ? '' : '/' + f.d); };
CA.piHTML = f => { f = Frac.of(f); if (f.n === 0) return '0'; if (f.d === 1) return CA.piStr(f); const sg = f.n < 0 ? '−' : '', n = Math.abs(f.n); return `${sg}<span class="ca-frac"><span>${n === 1 ? '' : n}π</span><span>${f.d}</span></span>`; };
/* degrees -> exact multiple of π (works for whole and half degrees) */
CA.degFrac = deg => Frac.of(deg).div(180);
CA.radText = deg => CA.piStr(CA.degFrac(deg));
CA.quadrant = deg => { const d = CA.norm360(deg); if (d === 0) return 'positive x-axis'; if (d === 90) return 'positive y-axis'; if (d === 180) return 'negative x-axis'; if (d === 270) return 'negative y-axis'; return d < 90 ? 'I' : d < 180 ? 'II' : d < 270 ? 'III' : 'IV'; };
CA.quadName = deg => { const q = CA.quadrant(deg); return q.length <= 3 ? `Quadrant ${q}` : `on the ${q}`; };
/* reference angle (degrees) of any angle */
CA.refAngle = deg => { const d = CA.norm360(deg); return d <= 90 ? d : d <= 180 ? 180 - d : d <= 270 ? d - 180 : 360 - d; };

/* ---------- exact radicals: sums of rational multiples of √m (m squarefree) ---------- */
const sqf = m => { let out = 1, inside = m; for (let f = 2; f * f <= inside; f++) while (inside % (f * f) === 0) { inside /= f * f; out *= f; } return [out, inside]; };
class Rad {
  constructor(terms = []) { // terms: [[coefficient, m]] meaning coefficient·√m
    const map = new Map();
    for (let [c, m] of terms) { c = Frac.of(c); if (m === 0 || c.n === 0) continue; const [o, i] = sqf(m); c = c.mul(o); map.set(i, (map.get(i) || new Frac(0, 1)).add(c)); }
    this.t = [...map.entries()].filter(([, c]) => c.n !== 0).sort((a, b) => a[0] - b[0]).map(([m, c]) => [c, m]);
  }
  static of(x) { return x instanceof Rad ? x : new Rad([[Frac.of(x), 1]]); }
  static r(c, m = 1) { return new Rad([[Frac.of(c), m]]); }
  /* √(p/q) in simplest form, e.g. √(3/5) = √15/5; null for negatives */
  static sqrt(x) { if (x instanceof Rad) { if (!x.isRational()) throw new Error('Rad.sqrt of an irrational'); x = x.t.length ? x.t[0][0] : new Frac(0, 1); } x = Frac.of(x); if (x.n < 0) return null; return new Rad([[new Frac(1, x.d), x.n * x.d]]); }
  add(o) { o = Rad.of(o); return new Rad([...this.t, ...o.t]); }
  neg() { return new Rad(this.t.map(([c, m]) => [c.neg(), m])); }
  sub(o) { return this.add(Rad.of(o).neg()); }
  mul(o) { o = Rad.of(o); const out = []; for (const [c1, m1] of this.t) for (const [c2, m2] of o.t) out.push([c1.mul(c2), m1 * m2]); return new Rad(out); }
  inv() {
    if (this.t.length === 1) { const [c, m] = this.t[0]; return new Rad([[new Frac(1, 1).div(c.mul(m)), m]]); }
    if (this.t.length === 2 && this.t[0][1] === 1) { const [a] = this.t[0], [b, m] = this.t[1], den = a.mul(a).sub(b.mul(b).mul(m)); return new Rad([[a.div(den), 1], [b.neg().div(den), m]]); }
    throw new Error('Rad.inv: unsupported denominator');
  }
  div(o) { return this.mul(Rad.of(o).inv()); }
  square() { return this.mul(this); }
  get v() { return this.t.reduce((acc, [c, m]) => acc + c.v * Math.sqrt(m), 0); }
  valueOf() { return this.v; }
  isZero() { return this.t.length === 0; }
  isRational() { return this.t.every(([, m]) => m === 1); }
  eq(o) { return this.sub(o).isZero(); }
  parts() { if (!this.t.length) return {D: 1, terms: []}; const D = this.t.reduce((acc, [c]) => acc / CA.gcd(acc, c.d) * c.d, 1); return {D, terms: this.t.map(([c, m]) => [c.n * D / c.d, m])}; }
  str(html = false) {
    const {D, terms} = this.parts(); if (!terms.length) return '0';
    const allNeg = terms.every(([k]) => k < 0);
    let ord = allNeg ? terms.map(([k, m]) => [-k, m]) : terms.slice();
    const fp = ord.findIndex(([k]) => k > 0); if (fp > 0) ord = [ord[fp], ...ord.filter((_, i) => i !== fp)];
    const ts = (k, m) => { const a = Math.abs(k); return m === 1 ? String(a) : (a === 1 ? '' : a) + '√' + m; };
    const num = ord.map(([k, m], i) => (i === 0 ? (k < 0 ? '−' : '') : (k < 0 ? ' − ' : ' + ')) + ts(k, m)).join('');
    const sg = allNeg ? '−' : '', many = ord.length > 1;
    if (D === 1) return sg + (allNeg && many ? `(${num})` : num);
    if (html) return `${sg}<span class="ca-frac"><span>${num}</span><span>${D}</span></span>`;
    return sg + (many ? `(${num})` : num) + '/' + D;
  }
  toString() { return this.str(false); }
  html() { return this.str(true); }
}
CA.Rad = Rad;
CA.R = (c, m = 1) => Rad.r(c, m);
/* exact display of a number when it is a Rad, else a rounded decimal; undefined -> "undefined" */
CA.ex = (v, html = true, d = 4) => v === undefined || v === null ? 'undefined' : v instanceof Rad ? (html ? v.html() : v.str()) : v instanceof Frac ? (html ? v.html() : v.toString()) : CA.num(v, d);

/* exact (cos, sin) for multiples of 30° and 45°; null otherwise */
CA.exactSC = deg => {
  if (!Number.isInteger(deg) || (deg % 30 !== 0 && deg % 45 !== 0)) return null;
  const d = CA.norm360(deg), ref = CA.refAngle(d);
  const base = {0: [1, 0], 30: [Rad.r(F(1, 2), 3), Rad.r(F(1, 2))], 45: [Rad.r(F(1, 2), 2), Rad.r(F(1, 2), 2)], 60: [Rad.r(F(1, 2)), Rad.r(F(1, 2), 3)], 90: [0, 1]}[ref];
  const c = Rad.of(base[0]), sn = Rad.of(base[1]), sx = d > 90 && d < 270 ? -1 : 1, sy = d > 180 ? -1 : 1;
  return {cos: sx < 0 ? c.neg() : c, sin: sy < 0 ? sn.neg() : sn};
};
/* exact value of fn at deg degrees: Rad, undefined (not defined), or null (not a special angle) */
CA.exact = (fn, deg) => {
  const e = CA.exactSC(deg); if (!e) return null; const c = e.cos, sn = e.sin, one = Rad.of(1);
  if (fn === 'sin') return sn; if (fn === 'cos') return c;
  if (fn === 'tan') return c.isZero() ? undefined : sn.div(c); if (fn === 'cot') return sn.isZero() ? undefined : c.div(sn);
  if (fn === 'sec') return c.isZero() ? undefined : one.div(c); if (fn === 'csc') return sn.isZero() ? undefined : one.div(sn);
  return null;
};
CA.fnName = {sin: 'sin', cos: 'cos', tan: 'tan', csc: 'csc', sec: 'sec', cot: 'cot'};
/* special angles in [0°, 360°] */
CA.SPECIAL = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];

/* ---------- drawing an angle in standard position on an equal-scale Plane ---------- */
// opt: r (circle radius, default 1), circle, point, ref (reference triangle), arc, color, label (text near the terminal side), ticks (special-angle ticks)
CA.drawAngle = (P, th, opt = {}) => {
  const r = opt.r ?? 1, c = opt.color || 'orange', R = opt.len ?? r * 1.18;
  if (opt.circle !== false) P.param(t => r * Math.cos(t), t => r * Math.sin(t), 0, 2 * PI, {color: 'gray', width: 1.8});
  if (opt.ticks) CA.SPECIAL.slice(0, -1).forEach(dg => { const a = CA.toRad(dg); P.seg(0.94 * r * Math.cos(a), 0.94 * r * Math.sin(a), 1.06 * r * Math.cos(a), 1.06 * r * Math.sin(a), {color: 'gray', width: 1.4}); });
  P.seg(0, 0, R, 0, {color: opt.initColor || 'blue', width: 3});
  if (opt.ref) { const x = r * Math.cos(th), y = r * Math.sin(th); P.seg(x, 0, x, y, {color: 'purple', width: 2.2, dash: '5 4'}).seg(0, 0, x, 0, {color: 'purple', width: 4, opacity: 0.55}); }
  if (opt.arc !== false && Math.abs(th) > 1e-9) { const a0 = opt.arcR ?? r * 0.26, grow = r * 0.05; P.param(t => (a0 + grow * Math.abs(t) / (2 * PI)) * Math.cos(t), t => (a0 + grow * Math.abs(t) / (2 * PI)) * Math.sin(t), 0, th, {color: c, width: 2.4, arrow: true, samples: Math.max(60, Math.ceil(Math.abs(th) * 40))}); }
  P.seg(0, 0, R * Math.cos(th), R * Math.sin(th), {color: c, width: 3.4});
  if (opt.point !== false) P.point(r * Math.cos(th), r * Math.sin(th), {color: c, r: 7, label: opt.pointLabel || '', labelOpt: opt.pointLabelOpt || {size: 12.5}});
  if (opt.label) P.label(R * Math.cos(th), R * Math.sin(th), opt.label, {color: c, size: 12.5});
  return P;
};

/* parse an angle typed by a student: "150", "-45", "5π/6", "-3pi/2", "5/6π", or "2" (radians when unit = 'rad') */
CA.parseAngle = (txt, unit = 'deg') => {
  const t = String(txt).trim().replace(/−/g, '-').replace(/\s+/g, '').replace(/pi/gi, 'π').replace(/°/g, '');
  if (!t) return null;
  let m = t.match(/^([-+]?)(\d*)π(?:\/(\d+))?$/);
  if (m) { const f = new Frac((m[1] === '-' ? -1 : 1) * (m[2] ? +m[2] : 1), m[3] ? +m[3] : 1); return {kind: 'pi', f, v: f.v * PI, deg: f.v * 180}; }
  m = t.match(/^([-+]?)(\d+)\/(\d+)π$/);
  if (m) { const f = new Frac((m[1] === '-' ? -1 : 1) * +m[2], +m[3]); return {kind: 'pi', f, v: f.v * PI, deg: f.v * 180}; }
  if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t)) { const v = Number(t); return unit === 'rad' ? {kind: 'rad', v, deg: v * 180 / PI} : {kind: 'deg', deg: v, v: v * PI / 180}; }
  return null;
};
/* coterminal angle in [0°, 360°) / [0, 2π) and reference angle, with worked steps. A comes from CA.parseAngle */
CA.angleInfo = A => {
  const steps = [], out = {steps};
  if (A.kind === 'pi') {
    let f = A.f; const two = F(2, 1), k = Math.floor(f.v / 2);
    if (Math.abs(k) > 3) { const g = f.sub(two.mul(k)); steps.push([`${k > 0 ? 'Subtract' : 'Add'} ${Math.abs(k)} full turns`, `${CA.piStr(f)} ${k > 0 ? '−' : '+'} ${Math.abs(k)}(2π) = ${CA.piStr(g)}`]); f = g; }
    else {
      const tw = (sign) => f.d > 1 ? ` = ${CA.piStr(f)} ${sign} ${2 * f.d}π/${f.d}` : '';
      while (f.v >= 2) { const g = f.sub(two); steps.push(['Subtract 2π', `${CA.piStr(f)} − 2π${tw('−')} = ${CA.piStr(g)}`]); f = g; }
      while (f.v < 0) { const g = f.add(two); steps.push(['Add 2π', `${CA.piStr(f)} + 2π${tw('+')} = ${CA.piStr(g)}`]); f = g; }
    }
    const one = F(1, 1), deg = f.v * 180, q = CA.quadrant(Math.round(deg * 1e6) / 1e6);
    Object.assign(out, {f, deg, quad: q, cotText: CA.piStr(f)});
    const r = q === 'I' ? f : q === 'II' ? one.sub(f) : q === 'III' ? f.sub(one) : q === 'IV' ? two.sub(f) : null;
    const how = {I: `θ′ = θ = ${CA.piStr(f)}`, II: `θ′ = π − ${CA.piStr(f)} = ${r && CA.piStr(r)}`, III: `θ′ = ${CA.piStr(f)} − π = ${r && CA.piStr(r)}`, IV: `θ′ = 2π − ${CA.piStr(f)} = ${r && CA.piStr(r)}`}[q];
    if (steps.length) steps.push(['Coterminal angle in [0, 2π)', `${CA.piStr(f)}`]);
    out.refF = r; out.refText = r ? CA.piStr(r) : null; out.refDeg = r ? r.v * 180 : null; out.how = how;
  } else {
    let d = A.kind === 'deg' ? A.deg : A.v * 180 / PI; const k = Math.floor(d / 360);
    if (A.kind === 'rad') { let v = A.v; while (v >= 2 * PI) { steps.push(['Subtract 2π ≈ 6.2832', `${CA.num(v, 4)} − 6.2832 ≈ ${CA.num(v - 2 * PI, 4)}`]); v -= 2 * PI; } while (v < 0) { steps.push(['Add 2π ≈ 6.2832', `${CA.num(v, 4)} + 6.2832 ≈ ${CA.num(v + 2 * PI, 4)}`]); v += 2 * PI; } d = v * 180 / PI; out.cotText = `≈ ${CA.num(v, 4)}`; }
    else {
      if (Math.abs(k) > 3) { const g = d - 360 * k; steps.push([`${k > 0 ? 'Subtract' : 'Add'} ${Math.abs(k)} full turns`, `${fmt(d)}° ${k > 0 ? '−' : '+'} ${Math.abs(k)}(360°) = ${fmt(g)}°`]); d = g; }
      else { while (d >= 360) { steps.push(['Subtract 360°', `${fmt(d)}° − 360° = ${fmt(d - 360)}°`]); d -= 360; } while (d < 0) { steps.push(['Add 360°', `${fmt(d)}° + 360° = ${fmt(d + 360)}°`]); d += 360; } }
      if (steps.length) steps.push(['Coterminal angle in [0°, 360°)', `${fmt(d)}°`]);
      out.cotText = `${fmt(CA.clean(d))}°`;
    }
    const q = CA.quadrant(CA.clean(d)), ref = q.length <= 3 ? CA.refAngle(d) : null;
    Object.assign(out, {deg: d, quad: q, refDeg: ref});
    if (A.kind === 'rad') { out.refText = ref === null ? null : `≈ ${CA.num(ref * PI / 180, 4)}`; out.how = ref === null ? null : `θ′ ≈ ${CA.num(ref * PI / 180, 4)} radians`; }
    else { out.refText = ref === null ? null : `${fmt(CA.clean(ref))}°`; out.how = {I: `θ′ = θ = ${fmt(d)}°`, II: `θ′ = 180° − ${fmt(d)}° = ${fmt(CA.clean(180 - d))}°`, III: `θ′ = ${fmt(d)}° − 180° = ${fmt(CA.clean(d - 180))}°`, IV: `θ′ = 360° − ${fmt(d)}° = ${fmt(CA.clean(360 - d))}°`}[q]; }
  }
  if (out.how) steps.push([`Reference angle · Quadrant ${out.quad}`, out.how]); else steps.push(['Quadrantal angle', `The terminal side lies on the ${out.quad}.`]);
  out.label = A.kind === 'deg' ? `${fmt(A.deg)}°` : A.kind === 'pi' ? CA.piStr(A.f) : `${fmt(A.v)}`;
  return out;
};
/* signs of the six functions in a quadrant */
CA.signs = q => ({I: {sin: 1, cos: 1, tan: 1}, II: {sin: 1, cos: -1, tan: -1}, III: {sin: -1, cos: -1, tan: 1}, IV: {sin: -1, cos: 1, tan: -1}})[q];
/* step-by-step proof / simplification walker with a numeric spot check.
   problems: [{title, goal (html), lines: [[math, reason], ...], done (html), lhs: x => number, rhs: x => number}] (x in radians) */
CA.proof = (id, problems, {label = 'Problem'} = {}) => {
  const box = $(id); if (!box) return; box.classList.add('ca-lab');
  box.innerHTML = `<div class="ca-controls"><label for="${id}-sel">${label}<select id="${id}-sel">${problems.map((p, i) => `<option value="${i}">${p.title}</option>`).join('')}</select></label></div><div class="ca-equation" id="${id}-goal"></div><div id="${id}-bar"></div><ol class="ca-calculation-steps ca-proof-steps" id="${id}-steps" aria-live="polite"></ol><div class="ca-feedback" id="${id}-out" aria-live="polite"></div><div class="ca-controls"><label for="${id}-x">Spot check at x = <output id="${id}-xo">40°</output><input id="${id}-x" type="range" min="-180" max="180" step="5" value="40"></label></div><div class="ca-feedback" id="${id}-chk" aria-live="polite"></div>`;
  let cur = 0; const sel = $(id + '-sel'), xr = $(id + '-x');
  const check = () => { const p = problems[cur], d = +xr.value, x = d * PI / 180; $(id + '-xo').textContent = CA.fmt(d) + '°'; if (!p.lhs) { $(id + '-chk').hidden = true; return; } $(id + '-chk').hidden = false; const L = p.lhs(x), R = p.rhs(x), ok = Number.isFinite(L) && Number.isFinite(R); $(id + '-chk').innerHTML = ok ? `At x = ${CA.fmt(d)}°: left side ≈ <b>${CA.num(L, 5)}</b>, right side ≈ <b>${CA.num(R, 5)}</b>${Math.abs(L - R) < 1e-7 ? ' — equal, as an identity requires.' : ' — not equal.'}` : `At x = ${CA.fmt(d)}° one side is undefined (division by zero), so this x is not in the domain. Try another value.`; };
  const st = CA.stepper(id + '-bar', () => problems[cur].lines.length, i => {
    const p = problems[cur];
    $(id + '-steps').innerHTML = p.lines.slice(0, i + 1).map(([e, r], k) => `<li class="${k === i ? 'ca-proof-new' : ''}"><span class="ca-step-label">${r}</span><span class="ca-step-math">${e}</span></li>`).join('');
    const out = $(id + '-out'); out.className = 'ca-feedback' + (i === p.lines.length - 1 ? ' ca-correct' : ''); out.innerHTML = i === p.lines.length - 1 ? p.done : 'Before you press <b>Next step</b>, decide which identity or algebra move you would use next.';
  }, {labels: i => problems[cur].lines[i][1].replace(/<[^>]+>/g, '')});
  sel.addEventListener('change', () => { cur = +sel.value; $(id + '-goal').innerHTML = problems[cur].goal; st.reset(); check(); });
  xr.addEventListener('input', check);
  $(id + '-goal').innerHTML = problems[0].goal; check();
  return st;
};
/* a number shown nicely: a simple multiple of π, a simple fraction, or a decimal */
CA.simpleFrac = (v, maxDen = 48) => { for (let d = 1; d <= maxDen; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return new Frac(n, d); } return null; };
CA.niceX = (v, dp = 3) => { if (Math.abs(v) < 1e-12) return '0'; const k = CA.simpleFrac(v / PI); if (k) return CA.piStr(k); const f = CA.simpleFrac(v); if (f) return f.toString(); return CA.num(v, dp); };
/* parse a coefficient typed by a student: "2", "-1/2", "0.25", "π", "-2π/3", "pi/4" -> {v, str} or null */
CA.parseVal = txt => {
  const t = String(txt).trim().replace(/−/g, '-').replace(/\s+/g, '').replace(/pi/gi, 'π');
  if (!t) return null;
  if (t.includes('π')) { const A = CA.parseAngle(t, 'rad'); return A && A.kind === 'pi' ? {v: A.v, str: CA.piStr(A.f), pi: A.f} : null; }
  let m = t.match(/^([-+]?\d+)\/(\d+)$/); if (m && +m[2] !== 0) { const f = new Frac(+m[1], +m[2]); return {v: f.v, str: f.toString(), frac: f}; }
  if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t)) { const v = Number(t); return {v, str: CA.fmt(v), frac: CA.simpleFrac(v)}; }
  return null;
};
/* parse a real number typed with radicals: "-√3/2", "2√3/3", "sqrt(2)/2", "-1/4", "0.62" -> {v, rad (Rad or null), str} */
CA.parseReal = txt => {
  const t = String(txt).trim().replace(/−/g, '-').replace(/\s+/g, '').replace(/sqrt\(?(\d+)\)?/gi, '√$1');
  if (!t) return null;
  let m = t.match(/^([-+]?)(\d*)√(\d+)(?:\/(\d+))?$/);
  if (m) { const r = Rad.r(new Frac((m[1] === '-' ? -1 : 1) * (m[2] ? +m[2] : 1), m[4] ? +m[4] : 1), +m[3]); return {v: r.v, rad: r, str: r.str()}; }
  m = t.match(/^([-+]?\d+)\/(\d+)$/); if (m && +m[2]) { const r = Rad.of(new Frac(+m[1], +m[2])); return {v: r.v, rad: r, str: r.str()}; }
  if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t)) { const v = Number(t), f = CA.simpleFrac(v, 12); return {v, rad: f && /^[-+]?\d+$/.test(t) ? Rad.of(f) : null, str: CA.fmt(v)}; }
  return null;
};
/* inverse trig: principal value (radians) and an exact special angle in degrees when there is one */
CA.INV = {
  sin: {f: Math.asin, dom: [-1, 1], rng: '[−π/2, π/2]', cand: [-90, -60, -45, -30, 0, 30, 45, 60, 90]},
  cos: {f: Math.acos, dom: [-1, 1], rng: '[0, π]', cand: [0, 30, 45, 60, 90, 120, 135, 150, 180]},
  tan: {f: Math.atan, dom: [-Infinity, Infinity], rng: '(−π/2, π/2)', cand: [-60, -45, -30, 0, 30, 45, 60]}
};
CA.invExact = (fn, v) => { const I = CA.INV[fn]; for (const d of I.cand) { const e = CA.exact(fn, d); if (e && Math.abs(e.v - v) < 1e-9) return d; } return null; };
/* a point (x, y) and r for an angle given by one ratio p/q of fn and its quadrant; returns {x, y, r} (Rad) or an error string */
CA.resolveRatio = (fn, p, q, Q) => {
  if (!Number.isInteger(p) || !Number.isInteger(q) || q === 0 || p === 0) return 'Use nonzero integers.';
  let v = F(p, q); const sg = CA.signs(Q), sx = sg.cos, sy = sg.sin;
  if (fn === 'csc') { fn = 'sin'; v = F(1, 1).div(v); } else if (fn === 'sec') { fn = 'cos'; v = F(1, 1).div(v); } else if (fn === 'cot') { fn = 'tan'; v = F(1, 1).div(v); }
  if (fn === 'tan') { if (Math.sign(v.v) !== sx * sy) return `tan is ${sx * sy > 0 ? 'positive' : 'negative'} in Quadrant ${Q}.`; return {x: Rad.of(sx * v.d), y: Rad.of(sy * Math.abs(v.n)), r: Rad.sqrt(v.n * v.n + v.d * v.d)}; }
  if (Math.abs(v.v) >= 1) return `${fn} must be strictly between −1 and 1 inside a quadrant.`;
  if (Math.sign(v.v) !== (fn === 'sin' ? sy : sx)) return `${fn} is ${(fn === 'sin' ? sy : sx) > 0 ? 'positive' : 'negative'} in Quadrant ${Q}.`;
  const r = Rad.of(v.d), known = Rad.of(v.n), other = Rad.sqrt(v.d * v.d - v.n * v.n);
  return fn === 'sin' ? {y: known, r, x: sx > 0 ? other : other.neg()} : {x: known, r, y: sy > 0 ? other : other.neg()};
};
/* √(value) for a Rad value ≥ 0: simplified when rational, otherwise the nested form √(a ± b√m)/k */
CA.sqrtRad = r => {
  if (r.isRational()) { const q = r.t.length ? r.t[0][0] : new Frac(0, 1); const s = Rad.sqrt(q); return {html: s.html(), str: s.str(), v: s.v, rad: s}; }
  const {D, terms} = r.parts(), k = Math.round(Math.sqrt(D)), inner = new Rad(terms.map(([c, m]) => [new Frac(c, 1), m])).str();
  if (k * k === D) return {str: `√(${inner})${k === 1 ? '' : '/' + k}`, html: k === 1 ? `√(${inner})` : `<span class="ca-frac"><span>√(${inner})</span><span>${k}</span></span>`, v: Math.sqrt(r.v)};
  return {str: `√(${r.str()})`, html: `√(${r.str()})`, v: Math.sqrt(r.v)};
};
/* solve f(θ) = v on an interval. iv = {a, b} in radians (half-open [a, b)), deg: show degrees, dp: decimals.
   Returns {sols: [{x, text}], general, refText, quads, note} */
CA.solveTrig = (fn, v, iv = {a: 0, b: 2 * PI}, opt = {}) => {
  const deg = !!opt.deg, dp = opt.dp ?? (deg ? 2 : 4), TP = 2 * PI;
  let f = fn, val = v, note = '';
  if (fn === 'csc' || fn === 'sec') { if (Math.abs(v) < 1e-12) return {sols: [], general: 'no solution', note: `${fn} θ is never 0`, refText: '—', quads: ''}; f = fn === 'csc' ? 'sin' : 'cos'; val = 1 / v; note = `${fn} θ = ${CA.num(v, 4)} ⟺ ${f} θ = 1/(${CA.num(v, 4)})`; }
  if (fn === 'cot') { f = 'tan'; if (Math.abs(v) < 1e-12) { val = Infinity; } else val = 1 / v; note = Math.abs(v) < 1e-12 ? 'cot θ = 0 ⟺ cos θ = 0' : `cot θ = ${CA.num(v, 4)} ⟺ tan θ = 1/(${CA.num(v, 4)})`; }
  if ((f === 'sin' || f === 'cos') && Math.abs(val) > 1 + 1e-12) return {sols: [], general: 'no solution', note: `${f} θ = ${CA.num(val, 4)} is impossible: the range of ${f} is [−1, 1]`, refText: '—', quads: ''};
  const nm = x => { x = ((x % TP) + TP) % TP; return Math.abs(x - TP) < 1e-10 ? 0 : x; };
  let base;
  if (f === 'sin') { const t = Math.asin(Math.max(-1, Math.min(1, val))); base = [nm(t), nm(PI - t)]; }
  else if (f === 'cos') { const t = Math.acos(Math.max(-1, Math.min(1, val))); base = [nm(t), nm(TP - t)]; }
  else { const t = val === Infinity ? PI / 2 : Math.atan(val); base = [nm(t), nm(t + PI)]; }
  base = base.filter((x, i) => base.findIndex(y => Math.abs(y - x) < 1e-9) === i).sort((x, y) => x - y);
  const txt = x => { if (deg) { const d = x * 180 / PI, fr = CA.simpleFrac(d, 4); return (fr && fr.d === 1 ? CA.fmt(fr.n) : CA.num(d, dp)) + '°'; } const k = CA.simpleFrac(x / PI); return k ? CA.piStr(k) : CA.num(x, dp); };
  const sols = [];
  const step = f === 'tan' ? PI : TP, bases = f === 'tan' ? [base[0]] : base;
  if (Number.isFinite(iv.a) && Number.isFinite(iv.b)) bases.forEach(b0 => { for (let k = Math.floor((iv.a - b0) / step) - 1; b0 + k * step < iv.b + step; k++) { const x = b0 + k * step; if (x >= iv.a - 1e-9 && x < iv.b - 1e-9) sols.push(x); } });
  const uniq = sols.sort((x, y) => x - y).filter((x, i, arr) => i === 0 || Math.abs(x - arr[i - 1]) > 1e-9).map(x => ({x, text: txt(x)}));
  const per = deg ? (f === 'tan' ? '180°' : '360°') : (f === 'tan' ? 'π' : '2π');
  const general = bases.map(b0 => `θ = ${txt(b0)} + ${per}·k`).join(', ') + ' (k an integer)';
  const r = f === 'sin' ? Math.asin(Math.min(1, Math.abs(val))) : f === 'cos' ? Math.acos(Math.min(1, Math.abs(val))) : val === Infinity ? PI / 2 : Math.atan(Math.abs(val));
  const sg = val === Infinity ? 0 : Math.sign(val);
  const quads = sg === 0 ? 'on an axis' : {sin: sg > 0 ? 'Quadrants I and II' : 'Quadrants III and IV', cos: sg > 0 ? 'Quadrants I and IV' : 'Quadrants II and III', tan: sg > 0 ? 'Quadrants I and III' : 'Quadrants II and IV'}[f];
  return {sols: uniq, general, refText: txt(r), ref: r, quads, note, f, val};
};
/* ---------- transformed trig functions y = A f(Bx − C) + D ---------- */
CA.coefStr = c => { const t = c.str.replace(/-/g, '−'); return t === '1' ? '' : t === '−1' ? '−' : ((c.frac && c.frac.d !== 1) || (c.pi && c.pi.d !== 1)) ? `(${t})` : t; };
CA.argStr = (B, C) => {
  const fr = B.frac, bs = B.str.replace(/-/g, '−'); let bx;
  if (bs === '1') bx = 'x'; else if (fr && fr.n === 1 && fr.d > 1) bx = `x/${fr.d}`; else if (B.pi && B.pi.n === 1 && B.pi.d === 1) bx = 'πx'; else if ((fr && fr.d !== 1) || (B.pi && B.pi.d !== 1)) bx = `(${bs})x`; else bx = `${bs}x`;
  if (Math.abs(C.v) < 1e-12) return bx; const cs = C.str.replace(/-/g, '−').replace(/^−/, ''); return `${bx} ${C.v < 0 ? '+' : '−'} ${cs}`;
};
CA.coefSp = A => { const c = CA.coefStr(A); return c && c !== '−' ? c + ' ' : c; };
CA.waveStr = (fn, A, B, C, D) => `y = ${CA.coefSp(A)}${fn}(${CA.argStr(B, C)})${Math.abs(D.v) < 1e-12 ? '' : ` ${D.v < 0 ? '−' : '+'} ${D.str.replace(/-/g, '−').replace(/^−/, '')}`}`;
/* a lab with a function menu, presets, and text boxes for A, B, C, D; update(lab, w) draws the section-specific picture */
CA.waveLab = (id, {fns, presets, update, readouts, yPad = 1.5, h = 400, middle = '', bottom = ''}) => CA.lab(id, {
  controls: [{type: 'select', key: 'pre', label: 'Function', value: '0', options: presets.map((p, i) => [String(i), p.label]).concat([['own', 'Set your own A, B, C, D']])},
    {type: 'select', key: 'fn', label: 'f', value: presets[0].fn, options: fns.map(f => [f, f])},
    {type: 'text', key: 'A', label: 'A =', value: presets[0].A}, {type: 'text', key: 'B', label: 'B =', value: presets[0].B}, {type: 'text', key: 'C', label: 'C =', value: presets[0].C}, {type: 'text', key: 'D', label: 'D =', value: presets[0].D}],
  top: '<div class="ca-equation" id="' + id + '-formula"></div>', plot: {w: 620, h}, plotLabel: 'Graph of the transformed function', readouts, steps: true, middle, bottom
}, (lab, st, key) => {
  if (key === 'pre' && st.pre !== 'own') { const p = presets[+st.pre]; ['fn', 'A', 'B', 'C', 'D'].forEach(k => st.set(k, p[k], true)); }
  else if (key && key !== 'pre') st.set('pre', 'own', true);
  const v = {A: CA.parseVal(st.A), B: CA.parseVal(st.B), C: CA.parseVal(st.C), D: CA.parseVal(st.D)}, F = $(id + '-formula');
  if (Object.values(v).some(x => !x) || v.A.v === 0 || !(v.B.v > 0)) { F.textContent = 'Check the coefficients: use numbers such as 2, −1/2, 0.5, π, or −π/3; A ≠ 0 and B > 0.'; lab.steps([]); lab.out('One of the boxes could not be read.', 'ca-incorrect'); lab.plane({xmin: -7, xmax: 7, ymin: -4, ymax: 4}).render(); return; }
  const fn = st.fn, base = ['sin', 'cos', 'csc', 'sec'].includes(fn) ? 2 * PI : PI, P = base / v.B.v, hh = v.C.v / v.B.v;
  const w = Object.assign({fn, P, h: hh, base, formula: CA.waveStr(fn, v.A, v.B, v.C, v.D), f: x => v.A.v * CA.trig[fn](v.B.v * x - v.C.v) + v.D.v}, v);
  F.innerHTML = w.formula;
  const piP = CA.simpleFrac(P / PI), L = Math.min(0, hh) - P / 2, R = Math.max(0, hh + P) + P / 2, amp = Math.abs(v.A.v);
  w.plane = (o = {}) => lab.plane(Object.assign({xmin: L, xmax: R, ymin: v.D.v - amp - yPad, ymax: v.D.v + amp + yPad, xpi: piP ? true : false}, o));
  update(lab, w, st);
});
/* a small static graph as an SVG string: draw(P) adds curves to the Plane */
CA.plotSVG = (o, draw, label = 'Graph') => { const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); const P = new Plane(el, Object.assign({w: 300, h: 200, tools: false}, o)); draw(P); P.render(); el.setAttribute('role', 'img'); el.setAttribute('aria-label', label); return el.outerHTML; };
/* asymptotes x = start + k·step inside [a, b] */
CA.gridPts = (start, step, a, b) => { const out = []; for (let k = Math.ceil((a - start) / step - 1e-9); start + k * step <= b + 1e-9; k++) out.push(start + k * step); return out; };
/* filled sector of radius r from angle a0 to a1 (radians) */
CA.sector = (P, r, a0, a1, opt = {}) => { const n = Math.max(12, Math.ceil(Math.abs(a1 - a0) * 30)), pts = [[0, 0]]; for (let i = 0; i <= n; i++) { const t = a0 + (a1 - a0) * i / n; pts.push([r * Math.cos(t), r * Math.sin(t)]); } return P.poly(pts, Object.assign({color: 'orange', fillOpacity: 0.2}, opt)); };
/* ---------- dragging on a Plane graph: fn(x, y, phase) with phase 'start' | 'move' | 'end' ---------- */
CA.drag = (svg, fn) => {
  svg = typeof svg === 'string' ? $(svg) : svg; svg.classList.add('ca-draggable'); let on = false;
  const at = e => { const P = svg._caPlane; if (!P) return null; const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal; if (!r.width || !vb || !vb.width) return null; return [P.ix((e.clientX - r.left) / r.width * vb.width), P.iy((e.clientY - r.top) / r.height * vb.height)]; };
  svg.addEventListener('pointerdown', e => { const p = at(e); if (!p || fn(p[0], p[1], 'start', e) === false) return; on = true; try { svg.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault(); });
  svg.addEventListener('pointermove', e => { if (!on) return; const p = at(e); if (p) fn(p[0], p[1], 'move', e); });
  const end = e => { if (!on) return; on = false; const p = at(e); if (p) fn(p[0], p[1], 'end', e); };
  svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
};

/* ---------- polar grid on an equal-scale Plane ---------- */
CA.polarGrid = (P, rmax, opt = {}) => {
  const step = opt.step || 1, every = opt.every || 30;
  for (let r = step; r <= rmax + 1e-9; r += step) P.param(t => r * Math.cos(t), t => r * Math.sin(t), 0, 2 * PI, {color: 'gray', width: r === rmax ? 1.4 : 1, opacity: 0.6});
  for (let d = 0; d < 360; d += every) { const a = CA.toRad(d); P.seg(0, 0, rmax * Math.cos(a), rmax * Math.sin(a), {color: 'gray', width: 1, opacity: 0.5}); if (opt.labels !== false) P.label(rmax * 1.1 * Math.cos(a), rmax * 1.1 * Math.sin(a), opt.deg ? d + '°' : CA.radText(d), {color: 'gray', size: 11, weight: 700, anchor: 'middle', dx: 0, dy: 4}); }
  return P;
};

/* ---------- triangle figure (no axes): pts {A:[x,y], B:[x,y], C:[x,y]} in any units ---------- */
// opt.sides {a: 'a = 5', ...} labels opposite each vertex, opt.angles {A: 'α = 40°', ...}, opt.right: 'C', opt.names (vertex labels), opt.extra(T) -> svg, opt.hl: 'a' | 'A' (highlight)
CA.triangle = (svg, pts, opt = {}) => {
  svg = typeof svg === 'string' ? $(svg) : svg; const w = opt.w || 560, h = opt.h || 300, pad = opt.pad ?? 50;
  const all = [pts.A, pts.B, pts.C].concat(opt.fitPts || []), xs = all.map(p => p[0]), ys = all.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((w - 2 * pad) / ((x1 - x0) || 1), (h - 2 * pad) / ((y1 - y0) || 1));
  const ox = (w - (x1 - x0) * k) / 2, oy = (h - (y1 - y0) * k) / 2;
  const T = ([x, y]) => [ox + (x - x0) * k, h - (oy + (y - y0) * k)];
  const V = {A: T(pts.A), B: T(pts.B), C: T(pts.C)}, G = [(V.A[0] + V.B[0] + V.C[0]) / 3, (V.A[1] + V.B[1] + V.C[1]) / 3];
  const unit = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; };
  const opp = {A: ['B', 'C'], B: ['A', 'C'], C: ['A', 'B']}, sideOf = {A: 'a', B: 'b', C: 'c'};
  let g = `<polygon points="${['A', 'B', 'C'].map(n => V[n].join(',')).join(' ')}" fill="${opt.fill || 'rgba(240,80,35,.08)'}" stroke="var(--cp-text)" stroke-width="2.4" stroke-linejoin="round"/>`;
  ['A', 'B', 'C'].forEach(n => { // sides
    const [p, q] = opp[n].map(m => V[m]), mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], u = unit(G, mid), lab = (opt.sides || {})[sideOf[n]];
    if (opt.hl === sideOf[n]) g += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="var(--cp-orange)" stroke-width="6" stroke-linecap="round" opacity=".75"/>`;
    if (lab) g += `<text x="${mid[0] + u[0] * 20}" y="${mid[1] + u[1] * 20 + 5}" text-anchor="middle" font-size="15" font-weight="800" fill="var(--cp-blue)" paint-order="stroke" stroke="var(--cp-bg)" stroke-width="4">${lab}</text>`;
  });
  ['A', 'B', 'C'].forEach(n => { // angles and vertex names
    const P0 = V[n], [p, q] = opp[n].map(m => V[m]), u1 = unit(P0, p), u2 = unit(P0, q);
    const lens = [Math.hypot(p[0] - P0[0], p[1] - P0[1]), Math.hypot(q[0] - P0[0], q[1] - P0[1])], rr = Math.min(30, 0.3 * Math.min(...lens));
    const lab = (opt.angles || {})[n], isRight = opt.right === n, hl = opt.hl === n;
    if (isRight) { const s = Math.min(16, rr * 0.7), a = [P0[0] + u1[0] * s, P0[1] + u1[1] * s], b = [P0[0] + u2[0] * s, P0[1] + u2[1] * s], cc = [a[0] + u2[0] * s, a[1] + u2[1] * s]; g += `<path d="M${a.join(' ')} L${cc.join(' ')} L${b.join(' ')}" fill="none" stroke="var(--cp-text)" stroke-width="1.8"/>`; }
    else if (lab || hl) { const a1 = Math.atan2(u1[1], u1[0]), a2 = Math.atan2(u2[1], u2[0]); let d = a2 - a1; while (d > PI) d -= 2 * PI; while (d < -PI) d += 2 * PI; g += `<path d="M${P0[0] + rr * Math.cos(a1)} ${P0[1] + rr * Math.sin(a1)} A${rr} ${rr} 0 0 ${d > 0 ? 1 : 0} ${P0[0] + rr * Math.cos(a1 + d)} ${P0[1] + rr * Math.sin(a1 + d)}" fill="${hl ? 'rgba(240,80,35,.25)' : 'none'}" stroke="var(--cp-orange)" stroke-width="2.4"/>`; }
    if (lab) { const bx = u1[0] + u2[0], by = u1[1] + u2[1], L = Math.hypot(bx, by) || 1, dist = rr + 16; g += `<text x="${P0[0] + bx / L * dist}" y="${P0[1] + by / L * dist + 5}" text-anchor="middle" font-size="13.5" font-weight="800" fill="var(--cp-orange)" paint-order="stroke" stroke="var(--cp-bg)" stroke-width="4">${lab}</text>`; }
    const name = (opt.names || {A: 'A', B: 'B', C: 'C'})[n];
    if (name) { const u = unit(G, P0); g += `<text x="${P0[0] + u[0] * 18}" y="${P0[1] + u[1] * 18 + 5}" text-anchor="middle" font-size="15" font-weight="850" fill="var(--cp-text)">${name}</text>`; }
  });
  if (opt.extra) g += opt.extra(T, k);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.classList.add('ca-plot', 'ca-tri-fig'); svg.innerHTML = g;
  return {T, k};
};
/* the same triangle figure as an SVG string (for guided-problem figures) */
CA.triSVG = (pts, opt = {}) => { const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); CA.triangle(el, pts, Object.assign({w: 360, h: 220, pad: 40}, opt)); el.setAttribute('role', 'img'); el.setAttribute('aria-label', opt.label || 'Triangle'); return el.outerHTML; };
/* solve a triangle numerically from any valid three of {a, b, c, A, B, C} (angles in degrees); returns {a,b,c,A,B,C} or null */
CA.triCoords = ({a, b, c}) => { // place A at origin, B on the x-axis (side c), C above
  const xC = (b * b + c * c - a * a) / (2 * c), yC = Math.sqrt(Math.max(0, b * b - xC * xC));
  return {A: [0, 0], B: [c, 0], C: [xC, yC]};
};

/* ---------- course navigation: open the current chapter, mark the active block ---------- */
CA.initNav = () => {
  const toc = document.querySelector('.ca-toc'); if (!toc) return;
  const links = [...toc.querySelectorAll('.ca-toc-sub a[href^="#"]')];
  const mark = id => links.forEach(l => { const on = l.hash === '#' + id; l.classList.toggle('ca-active', on); if (on) l.setAttribute('aria-current', 'location'); else l.removeAttribute('aria-current'); });
  toc.addEventListener('click', e => { const l = e.target.closest('a[href^="#"]'); if (l) mark(l.hash.slice(1)); });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) mark(en.target.id); }), {rootMargin: '-30% 0px -60% 0px'});
    links.forEach(l => { const t = document.getElementById(l.hash.slice(1)); t && io.observe(t); });
  }
};

/* ---------- conics centered at the origin (Chapter 10) ---------- */
/* parse a point typed by a student: "(4, 0)", "-1,2", "(5/2, 0)" -> [Frac, Frac] or null */
CA.parsePt = txt => {
  const t = String(txt).trim().replace(/−/g, '-').replace(/[()\s]/g, ''), m = t.split(','); if (m.length !== 2) return null;
  const v = m.map(u => { if (/^[-+]?\d+\/\d+$/.test(u)) { const [a, b] = u.split('/').map(Number); return b ? new Frac(a, b) : null; } return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(u) ? Frac.of(Number(u)) : null; });
  return v[0] && v[1] ? v : null;
};
/* parse a positive or negative rational: "20", "-7/3", "0.5" -> Frac or null */
CA.parseFrac = txt => { const t = String(txt).trim().replace(/−/g, '-').replace(/\s/g, ''); if (/^[-+]?\d+\/\d+$/.test(t)) { const [a, b] = t.split('/').map(Number); return b ? new Frac(a, b) : null; } return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(t) ? Frac.of(Number(t)) : null; };
/* √q for a nonnegative Frac (exact, simplest radical form) */
CA.sqrtF = q => Rad.sqrt(Frac.of(q));
/* stacked fraction num/den in HTML, den may be a Frac */
CA.over = (n, d) => `<span class="ca-frac"><span>${n}</span><span>${d}</span></span>`;
/* equation of a centered conic. kind 'ellipse' | 'hyperbola'; vertical: major (transverse) axis along y; A2 = a², B2 = b² as Frac */
CA.conicEq = (kind, vertical, A2, B2, html = true) => {
  const op = kind === 'ellipse' ? ' + ' : ' − ';
  const [v1, d1, v2, d2] = kind === 'ellipse' ? (vertical ? ['x²', B2, 'y²', A2] : ['x²', A2, 'y²', B2]) : (vertical ? ['y²', A2, 'x²', B2] : ['x²', A2, 'y²', B2]);
  const T = (v, d) => html ? CA.over(v, String(d)) : `${v}/${d instanceof Frac && d.d !== 1 ? '(' + d.toString() + ')' : String(d)}`;
  return `${T(v1, d1)}${op}${T(v2, d2)} = 1`;
};
/* ±value text: "±3", "±2√5" */
CA.pm = r => '±' + (r instanceof Rad ? r.str() : r.toString());
/* ellipse x²/A + y²/B = 1 (A, B numbers) */
CA.drawEllipse = (P, A, B, opt = {}) => P.param(t => Math.sqrt(A) * Math.cos(t), t => Math.sqrt(B) * Math.sin(t), 0, 2 * PI, Object.assign({color: 'orange', width: 3.4, samples: 360}, opt));
/* hyperbola with transverse half-axis a and conjugate half-axis b (numbers); vertical = transverse axis along y */
CA.drawHyperbola = (P, a, b, vertical, opt = {}) => {
  const o = P.o, R = Math.max(Math.abs(o.xmin), Math.abs(o.xmax), Math.abs(o.ymin), Math.abs(o.ymax)) * 1.6, T = Math.acosh(Math.max(1.01, R / Math.min(a, b)));
  const o2 = Object.assign({color: 'orange', width: 3.4, samples: 300}, opt);
  [1, -1].forEach(s => vertical ? P.param(t => b * Math.sinh(t), t => s * a * Math.cosh(t), -T, T, o2) : P.param(t => s * a * Math.cosh(t), t => b * Math.sinh(t), -T, T, o2));
  return P;
};
/* parabola x² = 4py (vertical axis) or y² = 4px */
CA.drawParabola = (P, p, vertical, opt = {}) => {
  const o = P.o, R = Math.max(Math.abs(o.xmin), Math.abs(o.xmax), Math.abs(o.ymin), Math.abs(o.ymax)) * 1.5, o2 = Object.assign({color: 'orange', width: 3.4, samples: 400}, opt);
  const T = Math.min(R, Math.sqrt(4 * Math.abs(p) * R)) + 1;
  return vertical ? P.param(t => t, t => t * t / (4 * p), -T, T, o2) : P.param(t => t * t / (4 * p), t => t, -T, T, o2);
};
/* a good square-ish window around a set of points */
CA.fitWin = (pts, pad = 1.5, min = 6) => { const xs = pts.map(p => p[0]).concat([0]), ys = pts.map(p => p[1]).concat([0]); let x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad; if (x1 - x0 < min) { const m = (x0 + x1) / 2; x0 = m - min / 2; x1 = m + min / 2; } if (y1 - y0 < min) { const m = (y0 + y1) / 2; y0 = m - min / 2; y1 = m + min / 2; } return {xmin: x0, xmax: x1, ymin: y0, ymax: y1}; };

document.addEventListener('DOMContentLoaded', () => { CA.initNav(); CA.initPredictGates(); });
/* labs are built after the browser's first jump to #anchor, which pushes the target down: jump again once the page is ready */
window.addEventListener('load', () => { const id = decodeURIComponent(location.hash.slice(1)), t = id && document.getElementById(id); if (t && !t.matches('dialog')) setTimeout(() => t.scrollIntoView({block: 'start', behavior: 'instant'}), 60); });
})();
