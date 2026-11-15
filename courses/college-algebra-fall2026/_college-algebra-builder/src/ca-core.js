/* College Algebra (MATH 1314, UTRGV) — shared interactive library.
   Every section page loads this file, then its own lesson.js. */
(function(){
'use strict';
const CA = window.CA = window.CA || {};
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
CA.Frac = Frac; CA.F = (n, d) => new Frac(n, d);
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
class Plane {
  constructor(svg, o = {}) {
    this.svg = typeof svg === 'string' ? $(svg) : svg;
    this.o = Object.assign({xmin: -6, xmax: 6, ymin: -5, ymax: 5, w: 560, h: 360, xstep: 0, ystep: 0, xname: 'x', yname: 'y', labels: true, grid: true, equal: false}, o);
    const {w, h} = this.o; this.L = 38; this.R = w - 16; this.T = 14; this.B = h - 30;
    this.id = 'cap' + (++planeCount); this.body = []; this.over = [];
    this.svg.setAttribute('viewBox', `0 0 ${w} ${h}`); this.svg.classList.add('ca-plot');
  }
  tx(x) { const o = this.o; return this.L + (x - o.xmin) / (o.xmax - o.xmin) * (this.R - this.L); }
  ty(y) { const o = this.o; return this.B - (y - o.ymin) / (o.ymax - o.ymin) * (this.B - this.T); }
  static nice(range, target = 10) { const raw = range / target, p = 10 ** Math.floor(Math.log10(raw)); for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= raw) return m * p; return 10 * p; }
  axes() {
    const o = this.o, xs = o.xstep || Plane.nice(o.xmax - o.xmin, 12), ys = o.ystep || Plane.nice(o.ymax - o.ymin, 9);
    let g = `<rect x="${this.L}" y="${this.T}" width="${this.R - this.L}" height="${this.B - this.T}" fill="var(--cp-bg)"/>`;
    const fx = v => CA.num(v, 3);
    if (o.grid) {
      for (let x = Math.ceil(o.xmin / xs) * xs; x <= o.xmax + 1e-9; x += xs) g += `<line x1="${this.tx(x)}" y1="${this.T}" x2="${this.tx(x)}" y2="${this.B}" stroke="var(--cp-grid)" stroke-width="1"/>`;
      for (let y = Math.ceil(o.ymin / ys) * ys; y <= o.ymax + 1e-9; y += ys) g += `<line x1="${this.L}" y1="${this.ty(y)}" x2="${this.R}" y2="${this.ty(y)}" stroke="var(--cp-grid)" stroke-width="1"/>`;
    }
    const ax = o.ymin <= 0 && o.ymax >= 0 ? this.ty(0) : this.B, ay = o.xmin <= 0 && o.xmax >= 0 ? this.tx(0) : this.L;
    g += `<line x1="${this.L}" y1="${ax}" x2="${this.R}" y2="${ax}" stroke="var(--cp-axis)" stroke-width="1.6"/><line x1="${ay}" y1="${this.T}" x2="${ay}" y2="${this.B}" stroke="var(--cp-axis)" stroke-width="1.6"/>`;
    if (o.labels) {
      for (let x = Math.ceil(o.xmin / xs) * xs; x <= o.xmax + 1e-9; x += xs) { if (Math.abs(x) < 1e-9) continue; g += `<text x="${this.tx(x)}" y="${Math.min(this.B + 18, ax + 16)}" font-size="11.5" text-anchor="middle" fill="var(--cp-text)">${fx(x)}</text>`; }
      for (let y = Math.ceil(o.ymin / ys) * ys; y <= o.ymax + 1e-9; y += ys) { if (Math.abs(y) < 1e-9) continue; g += `<text x="${Math.max(this.L - 5, ay - 6)}" y="${this.ty(y) + 4}" font-size="11.5" text-anchor="end" fill="var(--cp-text)">${fx(y)}</text>`; }
      g += `<text x="${this.R - 4}" y="${ax - 7}" font-size="13" font-weight="700" text-anchor="end" fill="var(--cp-text)">${o.xname}</text><text x="${ay + 7}" y="${this.T + 12}" font-size="13" font-weight="700" fill="var(--cp-text)">${o.yname}</text>`;
    }
    return g;
  }
  stroke(opt) { return `fill="none" stroke="${col(opt.color)}" stroke-width="${opt.width || 3}" stroke-linecap="round" stroke-linejoin="round"${opt.dash ? ` stroke-dasharray="${opt.dash === true ? '7 6' : opt.dash}"` : ''}${opt.opacity ? ` opacity="${opt.opacity}"` : ''}`; }
  curve(f, opt = {}) {
    const o = this.o, a = Math.max(o.xmin, opt.from ?? -Infinity), b = Math.min(o.xmax, opt.to ?? Infinity), n = opt.samples || 900;
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
    // tighten endpoints near domain edges (e.g. square roots) by bisection
    const d = segs.map(s => 'M' + s.map(p => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' L')).join(' ');
    if (!d) return this;
    this.body.push(`<path d="${d}" ${this.stroke(opt)}${opt.arrows ? ` marker-start="url(#${this.id}-arr)" marker-end="url(#${this.id}-arr)"` : ''}/>`);
    return this;
  }
  param(fx, fy, t0, t1, opt = {}) {
    const n = opt.samples || 400; let d = '';
    for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; d += (i ? 'L' : 'M') + this.tx(fx(t)).toFixed(2) + ' ' + this.ty(fy(t)).toFixed(2) + ' '; }
    this.body.push(`<path d="${d}" ${this.stroke(opt)}/>`); return this;
  }
  seg(x1, y1, x2, y2, opt = {}) { this.body.push(`<line x1="${this.tx(x1)}" y1="${this.ty(y1)}" x2="${this.tx(x2)}" y2="${this.ty(y2)}" ${this.stroke(Object.assign({width: 2.2}, opt))}${opt.arrow ? ` marker-end="url(#${this.id}-arr2)"` : ''}/>`); return this; }
  vline(x, opt = {}) { return this.seg(x, this.o.ymin - 1, x, this.o.ymax + 1, Object.assign({dash: true, color: 'gray', width: 2}, opt)); }
  hline(y, opt = {}) { return this.seg(this.o.xmin - 1, y, this.o.xmax + 1, y, Object.assign({dash: true, color: 'gray', width: 2}, opt)); }
  lineMB(m, b, opt = {}) { const o = this.o; return this.seg(o.xmin - 1, m * (o.xmin - 1) + b, o.xmax + 1, m * (o.xmax + 1) + b, Object.assign({width: 3}, opt)); }
  band(axis, a, b, opt = {}) { // highlight an interval on an axis
    const o = this.o, c = col(opt.color || 'blue'), w = opt.width || 9;
    if (axis === 'x') { const y = o.ymin <= 0 && o.ymax >= 0 ? this.ty(0) : this.B; this.body.push(`<line x1="${this.tx(Math.max(a, o.xmin))}" y1="${y}" x2="${this.tx(Math.min(b, o.xmax))}" y2="${y}" stroke="${c}" stroke-width="${w}" stroke-opacity=".55" stroke-linecap="round"/>`); }
    else { const x = o.xmin <= 0 && o.xmax >= 0 ? this.tx(0) : this.L; this.body.push(`<line x1="${x}" y1="${this.ty(Math.max(a, o.ymin))}" x2="${x}" y2="${this.ty(Math.min(b, o.ymax))}" stroke="${c}" stroke-width="${w}" stroke-opacity=".55" stroke-linecap="round"/>`); }
    return this;
  }
  inside(x, y) { const o = this.o; return x >= o.xmin - 1e-9 && x <= o.xmax + 1e-9 && y >= o.ymin - 1e-9 && y <= o.ymax + 1e-9; }
  point(x, y, opt = {}) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !this.inside(x, y)) return this;
    const c = col(opt.color), r = opt.r || 6, filled = opt.filled !== false;
    this.over.push(`<circle cx="${this.tx(x)}" cy="${this.ty(y)}" r="${r}" fill="${filled ? c : 'var(--cp-bg)'}" stroke="${filled ? 'var(--cp-bg)' : c}" stroke-width="${filled ? 2 : 3}"/>`);
    if (opt.label) this.label(x, y, opt.label, Object.assign({color: opt.color}, opt.labelOpt || {}));
    return this;
  }
  label(x, y, text, opt = {}) {
    if (!this.inside(x, y)) return this;
    const dx = opt.dx ?? 9, dy = opt.dy ?? -10, anchor = opt.anchor || (this.tx(x) > this.R - 90 ? 'end' : 'start');
    const X = this.tx(x) + (anchor === 'end' ? -Math.abs(dx) : dx), Y = Math.max(this.T + 12, Math.min(this.B - 4, this.ty(y) + dy));
    this.over.push(`<text x="${X}" y="${Y}" font-size="${opt.size || 13}" font-weight="${opt.weight || 800}" text-anchor="${anchor}" fill="${col(opt.color || 'text')}" paint-order="stroke" stroke="var(--cp-bg)" stroke-width="4">${text}</text>`);
    return this;
  }
  raw(s, over = false) { (over ? this.over : this.body).push(s); return this; }
  render() {
    const arr = `<marker id="${this.id}-arr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto-start-reverse"><path d="M0 0 L6 3 L0 6 Z" fill="context-stroke"/></marker><marker id="${this.id}-arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="context-stroke"/></marker>`;
    this.svg.innerHTML = `<defs><clipPath id="${this.id}-clip"><rect x="${this.L}" y="${this.T}" width="${this.R - this.L}" height="${this.B - this.T}"/></clipPath>${arr}</defs>${this.axes()}<g clip-path="url(#${this.id}-clip)">${this.body.join('')}</g>${this.over.join('')}`;
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

/* ---------- guided problems (multiple choice sets with hints) ---------- */
CA.guided = (which, bank, {count = 5} = {}) => {
  const container = $(`quiz-${which}-container`), status = $(`quiz-${which}-feedback`); if (!container) return;
  let offset = 0;
  const render = () => {
    const chosen = Array.from({length: Math.min(count, bank.length)}, (_, i) => ({q: bank[(offset + i) % bank.length], i}));
    container.innerHTML = chosen.map(({q, i}) => `<div class="ca-quiz-question" role="group" aria-label="Problem ${i + 1}" data-answer="${q.correct}"><p class="ca-quiz-prompt">${i + 1}. ${q.q}</p>${q.opts.map((o, j) => `<label><input type="radio" name="guided${which}-${i}" value="${j}"> ${o}</label>`).join('')}${q.hint ? `<details class="ca-quiz-hint"><summary>Need a hint?</summary><p>${q.hint}</p></details>` : ''}<div class="ca-muted ca-quiz-explanation" hidden></div></div>`).join('');
    status.textContent = 'Choose an answer for each problem. You can open a hint before checking.';
    container.querySelectorAll('.ca-quiz-question').forEach((el, i) => el._q = chosen[i].q);
  };
  $(`quiz-${which}-check`).addEventListener('click', () => {
    let score = 0, answered = 0; const qs = container.querySelectorAll('.ca-quiz-question');
    qs.forEach(el => {
      const a = el.querySelector('input:checked'); if (a) answered++;
      const ok = a && Number(a.value) === Number(el.dataset.answer); if (ok) score++;
      el.classList.toggle('ca-answered-correct', !!ok); el.classList.toggle('ca-answered-incorrect', !ok);
      const ex = el.querySelector('.ca-quiz-explanation'); ex.hidden = false; ex.innerHTML = (ok ? '✓ Correct. ' : '→ Worked explanation: ') + el._q.why;
    });
    status.textContent = `${score} / ${qs.length} correct (${answered} answered). Review the explanations, then try another set.`;
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

document.addEventListener('DOMContentLoaded', () => { CA.initNav(); CA.initPredictGates(); });
/* labs are built after the browser's first jump to #anchor, which pushes the target down: jump again once the page is ready */
window.addEventListener('load', () => { const id = decodeURIComponent(location.hash.slice(1)), t = id && document.getElementById(id); if (t && !t.matches('dialog')) setTimeout(() => t.scrollIntoView({block: 'start', behavior: 'instant'}), 60); });
})();
