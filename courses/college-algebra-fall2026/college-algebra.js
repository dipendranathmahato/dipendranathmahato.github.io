(()=>{'use strict';const $=id=>document.getElementById(id),fmt=v=>String(v).replaceAll('-', '−');function plot(svg,fn,{xmin=-6,xmax=6,ymin=-5,ymax=5}={}){const W=560,H=310,p=24,tx=x=>p+(x-xmin)/(xmax-xmin)*(W-2*p),ty=y=>H-p-(y-ymin)/(ymax-ymin)*(H-2*p);let s='';for(let i=Math.ceil(xmin);i<=xmax;i++)s+=`<line x1="${tx(i)}" y1="${p}" x2="${tx(i)}" y2="${H-p}" stroke="${i===0?'#777':'#d9dce3'}" stroke-width="${i===0?1.5:.7}"/>`;for(let j=Math.ceil(ymin);j<=ymax;j++)s+=`<line x1="${p}" y1="${ty(j)}" x2="${W-p}" y2="${ty(j)}" stroke="${j===0?'#777':'#d9dce3'}" stroke-width="${j===0?1.5:.7}"/>`;let seg='',last=false;for(let i=0;i<=700;i++){let x=xmin+(xmax-xmin)*i/700,y=fn(x);let good=Number.isFinite(y)&&y>=ymin-2&&y<=ymax+2;seg+=good?(last?'L':'M')+tx(x).toFixed(2)+' '+ty(y).toFixed(2)+' ':'';last=good;}svg.innerHTML=s+`<path d="${seg}" fill="none" stroke="#e65125" stroke-width="3" stroke-linecap="round"/>`;return{tx,ty,W,H,p};}
let mappingChoice = null;
function mappings() {
  const arr = [...document.querySelectorAll('.mapping')].map(el => [+el.dataset.input, +el.value]);
  if ($('double-output').checked) arr.push([0, 5]);
  const groups = new Map();
  arr.forEach(([x,y]) => {if (!groups.has(x)) groups.set(x, new Set()); groups.get(x).add(y);});
  const repeatedInputs = [...groups].filter(([x,ys]) => ys.size > 1).map(([x]) => x);
  const repeatedOutputs = [...new Set(arr.map(p => p[1]))].filter(y => new Set(arr.filter(p => p[1] === y).map(p => p[0])).size > 1);
  const isFunction = repeatedInputs.length === 0;
  $('mapping-pairs').innerHTML = arr.map(([x,y]) => `<span class="ca-pair ${repeatedInputs.includes(x)?'ca-conflict':repeatedOutputs.includes(y)?'ca-shared':''}">(<b>${fmt(x)}</b>, ${fmt(y)})</span>`).join('');
  // A proper bipartite mapping diagram: input and output sets in two columns.
  const inputs=[...groups.keys()],outputs=[...new Set(arr.map(pair=>pair[1]))].sort((a,b)=>a-b);
  const H=Math.max(240, Math.max(inputs.length,outputs.length)*55+90),cxL=95,cxR=405,top=80,stepL=(H-125)/Math.max(1,inputs.length-1),stepR=(H-125)/Math.max(1,outputs.length-1);
  const iy=new Map(inputs.map((v,i)=>[v,top+i*stepL])),oy=new Map(outputs.map((v,i)=>[v,top+i*stepR]));
  const arrowLines=arr.map(([x,y])=>{const conflict=groups.get(x).size>1,shared=repeatedOutputs.includes(y);const color=conflict?'#d63d28':'#26749b';return `<path d="M ${cxL+18} ${iy.get(x)} C 200 ${iy.get(x)}, 295 ${oy.get(y)}, ${cxR-18} ${oy.get(y)}" fill="none" stroke="${color}" stroke-width="${conflict?3.7:2.6}" marker-end="url(#${conflict?'arrow-red':'arrow-blue'})"/>`;}).join('');
  const nodes=(values,where,ys)=>values.map(v=>`<circle cx="${where}" cy="${ys.get(v)}" r="19" fill="${where===cxL&&groups.get(v).size>1?'#ffe4df':'#fff'}" stroke="${where===cxL&&groups.get(v).size>1?'#d63d28':'#aab5c1'}" stroke-width="2"/><text x="${where}" y="${ys.get(v)+5}" text-anchor="middle" font-size="16" font-weight="700" fill="#253345">${fmt(v)}</text>`).join('');
  $('mapping-diagram').innerHTML=`<svg class="ca-function-svg" viewBox="0 0 500 ${H}" role="img" aria-label="Mapping diagram; red arrows show an input leading to two different outputs"><defs><marker id="arrow-red" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#d63d28"/></marker><marker id="arrow-blue" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#26749b"/></marker></defs><rect x="25" y="45" rx="55" width="145" height="${H-65}" fill="#fff6f1" stroke="#e8bcaa"/><rect x="330" y="45" rx="55" width="145" height="${H-65}" fill="#f1f6ff" stroke="#a5bdd7"/>${arrowLines}${nodes(inputs,cxL,iy)}${nodes(outputs,cxR,oy)}<text x="95" y="24" text-anchor="middle" font-size="16" font-weight="800" fill="#b33c1c">INPUTS</text><text x="405" y="24" text-anchor="middle" font-size="16" font-weight="800" fill="#26749b">OUTPUTS</text></svg><p class="ca-muted"><span style="color:#d63d28">●</span> Red arrows indicate a conflicting input. <span style="color:#26749b">●</span> Blue arrows show valid assignments (including shared outputs).</p>`;
  $('mapping-observation').innerHTML = `<strong>${repeatedInputs.length?'⚠ Repeated input: '+repeatedInputs.map(fmt).join(', '):'✓ No input has conflicting outputs'}</strong><p>${repeatedInputs.length?'The highlighted input has two different outputs. A single input must not have multiple outputs.':'Each input points to exactly one output.'}</p><p>${repeatedOutputs.length?'Shared output(s): '+repeatedOutputs.map(fmt).join(', ')+'. This is allowed.':'No shared outputs at present; shared outputs are allowed.'}</p>`;
  for (const [id,val] of [['mapping-yes',true],['mapping-no',false]]) {
    $(id).setAttribute('aria-pressed',String(mappingChoice===val));
    $(id).classList.toggle('selected',mappingChoice===val);
  }
  $('mapping-result').className = 'ca-feedback' + (mappingChoice===null?'':mappingChoice===isFunction?' ca-correct':' ca-incorrect');
  $('mapping-result').textContent = mappingChoice===null ? 'Make your prediction above; the highlighted pairs and diagram are evidence.' : (mappingChoice===isFunction?'✓ Correct. ':'✗ Not quite. ') + (isFunction ? 'This is a function: every input has one distinct output. Two inputs may share an output.' : `This is NOT a function: input ${repeatedInputs.map(fmt).join(', ')} is assigned two different outputs. Look at the highlighted ordered pairs.`);
}
document.querySelectorAll('.mapping').forEach(el=>el.addEventListener('change',()=>{mappingChoice=null;mappings();}));
$('double-output').addEventListener('change',()=>{mappingChoice=null;mappings();});
$('mapping-yes').addEventListener('click',()=>{mappingChoice=true;mappings();});
$('mapping-no').addEventListener('click',()=>{mappingChoice=false;mappings();});
mappings();
function vertical(){
 let type=$('curve-type').value,x=+$('scan-x').value;$('scan-x-label').textContent=x.toFixed(1);
 const svg=$('vline-svg');const func=type==='parabola'||type==='cubic';
 const g=plot(svg,z=>type==='parabola'?z*z/4:type==='cubic'?z*z*z/9:NaN);
 if(type==='circle'){let d='';for(let i=0;i<=500;i++){let a=2*Math.PI*i/500;d+=(i?'L':'M')+g.tx(3*Math.cos(a))+' '+g.ty(3*Math.sin(a))+' ';}svg.innerHTML+=`<path d="${d}" fill="none" stroke="#e65125" stroke-width="3"/>`;}
 if(type==='sideways'){let d='';for(let i=0;i<=400;i++){let y=-Math.sqrt(6)+i/400*2*Math.sqrt(6);d+=(i?'L':'M')+g.tx(y*y)+' '+g.ty(y)+' ';}svg.innerHTML+=`<path d="${d}" fill="none" stroke="#e65125" stroke-width="3"/>`;}
 let ys=type==='circle'?(Math.abs(x)<3?[-Math.sqrt(9-x*x),Math.sqrt(9-x*x)]:Math.abs(x)===3?[0]:[]):type==='sideways'?(x>0?[-Math.sqrt(x),Math.sqrt(x)]:x===0?[0]:[]):[type==='cubic'?x*x*x/9:x*x/4];
 ys=ys.filter(y=>y>=-5&&y<=5);const count=ys.length;
 const stroke=func?'#13836a':'#d63d28';svg.innerHTML+=`<line x1="${g.tx(x)}" y1="24" x2="${g.tx(x)}" y2="286" stroke="${stroke}" stroke-width="3" stroke-dasharray="7 5"/>`+ys.map(y=>`<circle cx="${g.tx(x)}" cy="${g.ty(y)}" r="8" fill="${stroke}" stroke="white" stroke-width="2"/>`).join('');
 $('vline-status').className='ca-vline-status '+(func?'ca-vline-good':'ca-vline-bad');$('vline-status').innerHTML=`<i class="fa-solid fa-${func?'circle-check':'circle-xmark'}"></i> <strong class="ca-vline-verdict">${func?'FUNCTION':'NOT A FUNCTION'}</strong> <small>${func?'Every vertical line has at most one intersection.':'There are vertical lines that intersect this graph twice.'}</small>`;
 $('vline-result').innerHTML=`<b>At x = ${x.toFixed(1)}:</b> ${count} visible intersection${count===1?'':'s'}. <strong class="ca-vline-result-strong ${func?'is-function':'not-function'}">${func?'FUNCTION':'NOT A FUNCTION'}</strong> — ${count>1?'Two red intersection points on the same vertical line prove this relation is NOT a function.':func?'Every vertical line intersects this graph at most once.':'This graph fails elsewhere: move the red test line until it crosses twice. One line with two intersections proves failure.'}`;
}
['curve-type','scan-x'].forEach(id=>$(id).addEventListener('input',vertical));vertical();
function machine(){let [a,b,c,x]=['coeff-a','coeff-b','coeff-c','input-x'].map(id=>+$(id).value);['a-label','b-label','c-label','x-label'].forEach((id,i)=>$(id).textContent=fmt([a,b,c,x][i]));$('machine-expression').textContent=`f(x) = ${a}x² ${b<0?'−':'+'} ${Math.abs(b)}x ${c<0?'−':'+'} ${Math.abs(c)}`;$('machine-result').textContent=`f(${fmt(x)}) = ${a*x*x+b*x+c}`;$('machine-steps').textContent=`Substitute x = ${fmt(x)}: (${a})(${fmt(x)})² + (${b})(${fmt(x)}) + (${c}) = ${a*x*x} + (${b*x}) + (${c}).`;}['coeff-a','coeff-b','coeff-c','input-x'].forEach(id=>$(id).addEventListener('input',machine));machine();document.querySelectorAll('#pairs-table tr').forEach(row=>row.addEventListener('click',()=>{document.querySelectorAll('#pairs-table tr').forEach(r=>r.classList.remove('selected'));row.classList.add('selected');$('lookup-result').textContent=`Selected ordered pair (${row.dataset.x}, ${row.dataset.y}).`;}));$('lookup-btn').onclick=()=>{let y=+$('lookup-y').value,inputs=[...document.querySelectorAll('#pairs-table tr')].filter(r=>+r.dataset.y===y).map(r=>r.dataset.x);$('lookup-result').textContent=inputs.length?`f(x) = ${y} at x = ${inputs.join(' and ')}. ${inputs.length>1?'Different inputs can give the same output.':''}`:`No input in this table has output ${y}.`};
let intervalPreset='finite';
function interval(){
 const l=+$('int-left').value,r=+$('int-right').value,lc=$('left-closed').checked,rc=$('right-closed').checked;
 if(!Number.isFinite(l)||!Number.isFinite(r)||l>=r){$('interval-answer').textContent='Left endpoint must be smaller than right endpoint.';$('interval-svg').innerHTML='';return;}
 const mode=intervalPreset,tx=x=>30+(x+11)/22*500;
 let svg=$('interval-svg'),marks=Array.from({length:23},(_,i)=>`<line x1="${tx(i-11)}" y1="58" x2="${tx(i-11)}" y2="64" stroke="#999"/>${i%2===0?`<text x="${tx(i-11)}" y="82" text-anchor="middle" font-size="11" fill="currentColor">${i-11}</text>`:''}`).join('');
 let pieces=[];const segment=(a,b,closedA,closedB)=>{pieces.push(`<line x1="${a===null?25:tx(a)}" y1="60" x2="${b===null?535:tx(b)}" y2="60" stroke="#f05023" stroke-width="6" stroke-linecap="round"/>`);if(a!==null)pieces.push(`<circle cx="${tx(a)}" cy="60" r="7" stroke="#f05023" stroke-width="3" fill="${closedA?'#f05023':'white'}"/>`);if(b!==null)pieces.push(`<circle cx="${tx(b)}" cy="60" r="7" stroke="#f05023" stroke-width="3" fill="${closedB?'#f05023':'white'}"/>`);if(a===null)pieces.push('<path d="M25 60 L38 52 L38 68 Z" fill="#f05023"/>');if(b===null)pieces.push('<path d="M535 60 L522 52 L522 68 Z" fill="#f05023"/>');};
 let notation='',meaning='';
 if(mode==='leftopen'||mode==='leftinclusive'){const incl=mode==='leftinclusive';segment(null,r,false,incl);notation=`(−∞, ${r}${incl?']':')'}`;meaning=`x ${incl?'≤':'<'} ${r}`;}
 else if(mode==='rightopen'||mode==='rightinclusive'){const incl=mode==='rightinclusive';segment(l,null,incl,false);notation=`${incl?'[':'('}${l}, ∞)`;meaning=`x ${incl?'≥':'>'} ${l}`;}
 else if(mode==='all'){segment(null,null,false,false);notation='(−∞, ∞)';meaning='All real numbers.';}
 else if(mode==='union'){segment(null,-2,false,false);segment(1,4,true,false);notation='(−∞, −2) ∪ [1, 4)';meaning='x < −2 or 1 ≤ x < 4.';}
 else {segment(l,r,lc,rc);notation=`${lc?'[':'('}${l}, ${r}${rc?']':')'}`;meaning=`${l} ${lc?'≤':'<'} x ${rc?'≤':'<'} ${r}`;}
 svg.innerHTML=`<line x1="25" y1="60" x2="535" y2="60" stroke="#777" stroke-width="2"/>${marks}${pieces.join('')}`;
 $('interval-answer').textContent=`Interval Notation: ${notation}`;$('interval-text').textContent=`${meaning} Open circles exclude endpoints; filled circles include them.`;
}
['int-left','int-right','left-closed','right-closed'].forEach(id=>$(id).addEventListener('input',()=>{intervalPreset='finite';interval()}));
document.querySelectorAll('#interval-presets button').forEach(btn=>btn.addEventListener('click',()=>{const mode=btn.dataset.kind;intervalPreset=mode==='open'||mode==='closed'||mode==='leftclosed'||mode==='rightclosed'?'finite':mode;const flags={open:[false,false],closed:[true,true],leftclosed:[true,false],rightclosed:[false,true]};if(flags[mode]){$('left-closed').checked=flags[mode][0];$('right-closed').checked=flags[mode][1];}document.querySelectorAll('#interval-presets button').forEach(b=>b.classList.toggle('active',b===btn));interval()}));interval();
function domain(){let kind=$('domain-kind').value,k=+$('domain-k').value,x=+$('domain-x').value;$('k-output').textContent=fmt(k);let d=x-k,ok=kind==='quadratic'||kind==='oddroot'||(kind==='fraction'||kind==='oddrootden'?d!==0:kind==='root'?d>=0:d>0),v=kind==='quadratic'?d*d:kind==='fraction'?1/d:kind==='root'?Math.sqrt(d):kind==='rootden'?1/Math.sqrt(d):kind==='oddroot'?Math.cbrt(d):1/Math.cbrt(d);let expr={fraction:`f(x) = 1 / (x − (${k}))`,root:`f(x) = √(x − (${k}))`,rootden:`f(x) = 1 / √(x − (${k}))`,quadratic:`f(x) = (x − (${k}))²`,oddroot:`f(x) = ∛(x − (${k}))`,oddrootden:`f(x) = 1 / ∛(x − (${k}))`};$('domain-expression').textContent=expr[kind];$('domain-result').textContent=ok?`Allowed: x = ${x} gives f(x) ≈ ${Number(v.toFixed(5))}.`:`Not allowed: x = ${x} ${kind==='fraction'||kind==='oddrootden'?'makes the denominator zero':kind==='root'?'makes the radicand negative':'makes the even root zero or nonreal in the denominator'}.`;$('domain-interval').textContent='Domain: '+(kind==='quadratic'||kind==='oddroot'?'(−∞, ∞)':kind==='fraction'||kind==='oddrootden'?`(−∞, ${k}) ∪ (${k}, ∞)`:kind==='root'?`[${k}, ∞)`:`(${k}, ∞)`);}['domain-kind','domain-k','domain-x'].forEach(id=>$(id).addEventListener('input',domain));domain();
function range(){let h=+$('vertex-h').value,k=+$('vertex-k').value,a=+$('vertex-a').value;$('h-display').textContent=fmt(h);$('v-display').textContent=fmt(k);let svg=$('range-svg'),g=plot(svg,x=>a*(x-h)**2+k,{xmin:-6,xmax:6,ymin:-7,ymax:7});svg.innerHTML+=`<circle cx="${g.tx(h)}" cy="${g.ty(k)}" r="6" fill="#147b79" stroke="white" stroke-width="2"/>`;$('range-answer').textContent=`Vertex (${h}, ${k}). Domain: (−∞, ∞). Range: ${a>0?`[${k}, ∞)`:`(−∞, ${k}]`}. ${a>0?'The vertex is the minimum.':'The vertex is the maximum.'}`;}['vertex-h','vertex-k','vertex-a'].forEach(id=>$(id).addEventListener('input',range));range();
// Section 3.1: work backwards from y to find all x values.
function graphReading(){
 const x=Number($('graph-input').value), yTarget=Number($('graph-output').value), f=t=>(t-1)*(t-1);
 const svg=$('ca-read-graph'),g=plot(svg,f,{xmin:-3,xmax:5,ymin:-1,ymax:10});
 const xPoints=[1-Math.sqrt(yTarget),1+Math.sqrt(yTarget)].filter((t,i,arr)=>i===0||Math.abs(t-arr[0])>1e-8);
 svg.innerHTML+=`<line x1="${g.tx(-3)}" x2="${g.tx(5)}" y1="${g.ty(yTarget)}" y2="${g.ty(yTarget)}" stroke="#137b9a" stroke-dasharray="6 5" stroke-width="2.3"/>`;
 svg.innerHTML+=`<line x1="${g.tx(x)}" x2="${g.tx(x)}" y1="${g.ty(0)}" y2="${g.ty(f(x))}" stroke="#d64d25" stroke-dasharray="4 4" stroke-width="2"/><circle cx="${g.tx(x)}" cy="${g.ty(f(x))}" r="6" fill="#e65125" stroke="#fff" stroke-width="2"/>`;
 for(const t of xPoints){if(t>=-3&&t<=5)svg.innerHTML+=`<circle cx="${g.tx(t)}" cy="${g.ty(yTarget)}" r="5.5" fill="#137b9a" stroke="white" stroke-width="2"/>`;}
 svg.innerHTML+=`<text x="${g.tx(5)-4}" y="${g.ty(0)-6}" text-anchor="end" font-size="14" fill="#b4bdd0">x</text><text x="${g.tx(0)+8}" y="${g.ty(10)+14}" font-size="14" fill="#b4bdd0">y</text>`;
 $('graph-read-feedback').textContent=`f(${fmt(x)}) = ${f(x)}.  To solve f(x) = ${yTarget}, read the horizontal line y = ${yTarget}: x = ${xPoints.map(v=>fmt(v)).join(' or x = ')}.`;
}
['graph-input','graph-output'].forEach(id=>$(id).addEventListener('change',graphReading));graphReading();

// Guided practice belongs inside each numbered section, not in a separate TOC chapter.
const guidedBanks={
 '31':[
  {q:'For R = {(1,5), (−5,2), (0,0), (1,−3)}, what is the domain?',opts:['{−5, 0, 1}','{−3, 0, 2, 5}','{1, −5, 0, 1}'],correct:0,why:'Collect the first coordinates and list distinct values only once: {−5, 0, 1}.'},
  {q:'For {(−7,−2), (3,0), (8,−2), (0,12), (−15,9)}, what is the range?',opts:['{−15, −7, 0, 3, 8}','{−2, 0, 9, 12}','{−2, 0, −2, 12, 9}'],correct:1,why:'The range is the set of distinct second coordinates: {−2, 0, 9, 12}.'},
  {q:'Is {(p,m), (q,n), (r,n)} a function?',opts:['Yes, the inputs p, q, r each have one output','No, the output n occurs twice','Only if all outputs are different'],correct:0,why:'Different inputs q and r may share output n. Each input has exactly one output.'},
  {q:'A shop sells a jelly and a chocolate donut for $1.99 each. Is item a function of price?',opts:['Yes, there is only one price','No, $1.99 would produce two different items','Yes, because the items are different'],correct:1,why:'Here price is the input. One input, $1.99, corresponds to two possible items.'},
  {q:'In k = g(c), which symbol is the independent variable?',opts:['k','g','c'],correct:2,why:'g names the function; c is the input/independent variable; k is the output.'},
  {q:'If f(x) = x³ − 6x + 1, what is f(−2)?',opts:['−19','5','−7'],correct:1,why:'f(−2) = (−2)³ − 6(−2) + 1 = −8 + 12 + 1 = 5.'},
  {q:'If h(m) = m² − 5, solve h(m) = 4.',opts:['m = 3 only','m = ±3','m = ±9'],correct:1,why:'m² − 5 = 4 implies m² = 9, so m = −3 or m = 3.'},
  {q:'Given g(n): (1,8), (2,6), (3,7), (4,6), (5,8), which inputs give output 8?',opts:['n = 1 and n = 5','n = 2 and n = 4','n = 3'],correct:0,why:'Find all pairs whose second coordinate is 8: (1,8) and (5,8).'},
  {q:'Which equation fails the vertical line test?',opts:['y = 4 − x²','x² + y² = 6','y = x³'],correct:1,why:'At x = 0, the circle has two outputs y = ±√6; one vertical line intersects twice.'},
  {q:'For f(x) = (x−1)², solve f(x) = 1.',opts:['x = 1','x = 0 or x = 2','x = −1 or x = 3'],correct:1,why:'(x−1)² = 1 implies x−1 = ±1, giving x = 0 or 2.'}
 ],
 '32':[
  {q:'What is the domain of 1/(x − 4)?',opts:['[4, ∞)','All real numbers except x = 4','All real numbers'],correct:1,why:'Division by zero is undefined, so exclude x = 4.'},
  {q:'What is the domain of √(x + 3)?',opts:['(−3, ∞)','(−∞, −3]','[−3, ∞)'],correct:2,why:'x + 3 ≥ 0 gives x ≥ −3, so [−3, ∞).'},
  {q:'Which interval represents −3 < x ≤ 10?',opts:['[−3, 10]','(−3, 10]','(−3, 10)'],correct:1,why:'−3 is excluded (parenthesis), while 10 is included (bracket).'},
  {q:'What is the range of y = (x−1)² + 2?',opts:['[2, ∞)','(−∞, 2]','All real numbers'],correct:0,why:'The upward-opening parabola has its minimum at y = 2.'},
  {q:'What is the domain of 1/√(x−5)?',opts:['[5, ∞)','(5, ∞)','All real x except 5'],correct:1,why:'The square-root denominator must be strictly positive: x − 5 > 0, so x > 5.'},
  {q:'For y = −(x+2)² + 3, what is the range?',opts:['[3, ∞)','(−∞, 3]','(−∞, ∞)'],correct:1,why:'A downward-opening parabola has maximum y = 3, included in its range.'},
  {q:'What is the domain of ∛(x−2)?',opts:['[2, ∞)','All real numbers','All real numbers except 2'],correct:1,why:'An odd root is defined for negative, zero, and positive real radicands.'},
  {q:'What does a filled endpoint at x = 4 mean?',opts:['x = 4 is included','x = 4 is excluded','The graph stops before x = 4'],correct:0,why:'A filled dot means the endpoint belongs to the set.'}
 ]
};
const guidedHints={
 '31':[
  'Look only at the first coordinates. Sets contain each distinct element once.',
  'Look only at the second coordinates. Repeated outputs are listed once.',
  'Does any one input point to two different outputs?',
  'Choose which quantity is the input, then check if it leads to a unique output.',
  'The variable inside the parentheses is the input.',
  'Substitute −2 for every x; take the cube before applying the minus sign.',
  'First add 5 to both sides; then solve the resulting square equation.',
  'Scan the output column for the number 8, then collect matching inputs.',
  'Think about whether one x-value can have both positive and negative y-values.',
  'Set the expression equal to 1, then use the two square roots of 1.'
 ],
 '32':[
  'Find any input that makes the denominator zero.',
  'A square-root radicand must be nonnegative.',
  'Use a parenthesis for an excluded endpoint and bracket for an included one.',
  'The graph opens upward. Identify its smallest output.',
  'A square root in the denominator cannot be zero.',
  'The graph opens downward. Identify its largest output.',
  'Cube roots are defined for negative, zero, and positive numbers.',
  'Think about the difference between an open and a filled dot.'
 ]
};
function setupGuided(which){
 const bank=guidedBanks[which],count=which==='31'?5:4;let offset=0;
 const container=$(`quiz-${which}-container`),status=$(`quiz-${which}-feedback`);
 function render(){
  const chosen=Array.from({length:count},(_,i)=>({q:bank[(offset+i)%bank.length],i}));
  container.innerHTML=chosen.map(({q,i})=>`<div class="ca-quiz-question" role="group" aria-label="${q.q}" data-answer="${q.correct}"><p class="ca-quiz-prompt">${i+1}. ${q.q}</p>${q.opts.map((option,j)=>`<label><input type="radio" name="guided${which}-${i}" value="${j}"> ${option}</label>`).join('')}<details class="ca-quiz-hint"><summary>Need a hint?</summary><p>${guidedHints[which][(offset+i)%bank.length]}</p></details><div class="ca-muted ca-quiz-explanation" hidden>${q.why}</div></div>`).join('');
  status.textContent='Choose an answer for each problem. You can reveal hints before checking.';
 }
 $(`quiz-${which}-check`).addEventListener('click',()=>{
  let score=0,answered=0;
  container.querySelectorAll('.ca-quiz-question').forEach((fieldset,i)=>{
   const answer=fieldset.querySelector('input:checked');if(answer)answered++;
   const yes=answer && Number(answer.value)===Number(fieldset.dataset.answer);if(yes)score++;
   fieldset.classList.toggle('ca-answered-correct',Boolean(yes));fieldset.classList.toggle('ca-answered-incorrect',!yes);
   const explanation=fieldset.querySelector('.ca-quiz-explanation');explanation.hidden=false;
   explanation.textContent=(yes?'✓ Correct. ':'→ Worked explanation: ')+bank[(offset+i)%bank.length].why;
  });
  status.textContent=`${score} / ${count} correct (${answered} answered). Review the explanations and try another set when ready.`;
 });
 $(`quiz-${which}-reset`).addEventListener('click',()=>{offset=(offset+count)%bank.length;render();});
 render();
}
setupGuided('31');setupGuided('32');
let modal=$('foundations-modal');$('foundations-open').onclick=()=>modal.showModal();$('foundations-close').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});let grades=[['Homework',25],['Reviews',5],['PLTL',10],['Class activities',10],['Three exams',35],['Final exam',15]];$('grade-rows').innerHTML=grades.map(([name,w],i)=>`<div class="ca-grade-row"><label for="grade-${i}">${name}</label><b>${w}%</b><input id="grade-${i}" class="grade-score" type="number" min="0" max="100" step="0.1" placeholder="0–100" aria-label="${name} score"></div>`).join('');function calcGrades(){let values=[...document.querySelectorAll('.grade-score')].map(el=>el.value===''?null:+el.value);if(values.some(v=>v!==null&&(v<0||v>100||!Number.isFinite(v)))){$('grade-total').textContent='Enter valid percentages between 0 and 100.';return;}let completed=grades.reduce((t,g,i)=>t+(values[i]===null?0:g[1]),0),earned=grades.reduce((t,g,i)=>t+(values[i]===null?0:g[1]*values[i]/100),0);$('grade-total').textContent=completed?`Earned: ${earned.toFixed(2)} percentage points toward the final grade. Average across entered categories: ${(earned/completed*100).toFixed(1)}%. Categories entered: ${completed}% of course weight.`:'Enter scores above to estimate your grade.';}document.querySelectorAll('.grade-score').forEach(el=>el.addEventListener('input',calcGrades));calcGrades();})();