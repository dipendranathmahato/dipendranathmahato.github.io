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
function machine(){let [a,b,c,x]=['coeff-a','coeff-b','coeff-c','input-x'].map(id=>+$(id).value);['a-label','b-label','c-label','x-label'].forEach((id,i)=>$(id).textContent=fmt([a,b,c,x][i]));$('machine-expression').textContent=`f(x) = ${a}x² ${b<0?'−':'+'} ${Math.abs(b)}x ${c<0?'−':'+'} ${Math.abs(c)}`;$('machine-result').textContent=`f(${fmt(x)}) = ${a*x*x+b*x+c}`;$('machine-steps').textContent=`Substitute x = ${fmt(x)}: (${a})(${fmt(x)})² + (${b})(${fmt(x)}) + (${c}) = ${a*x*x} + (${b*x}) + (${c}).`;}['coeff-a','coeff-b','coeff-c','input-x'].forEach(id=>$(id).addEventListener('input',machine));machine();document.querySelectorAll('#pairs-table tr').forEach(row=>{const select=()=>{document.querySelectorAll('#pairs-table tr').forEach(r=>r.classList.remove('selected'));row.classList.add('selected');$('lookup-result').textContent=`Selected ordered pair (${fmt(row.dataset.x)}, ${fmt(row.dataset.y)}).`;};row.addEventListener('click',select);row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});});$('lookup-btn').onclick=()=>{let y=+$('lookup-y').value,inputs=[...document.querySelectorAll('#pairs-table tr')].filter(r=>+r.dataset.y===y).map(r=>r.dataset.x);$('lookup-result').textContent=inputs.length?`t(x) = ${y} at x = ${inputs.map(fmt).join(' and ')}. ${inputs.length>1?'Different inputs can give the same output.':''}`:`No input in this table has output ${y}.`};
// Section 3.2 — original interactive interval, restrictions, and graph-projection lessons.
const caNum = n => String(Number.isInteger(n)?n:Number(n.toFixed(4))).replaceAll('-', '−');
const caPoint = (x,y,filled=true,color='#e95b2c',r=7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${filled?color:'var(--card-bg, #fff)'}" stroke="${color}" stroke-width="3"/>`;
const caAxisNumberLine=(svg,{segments=[],holes=[],test=null}={})=>{
 const W=620,l=32,r=588,y=99,tx=n=>l+(n+10)/20*(r-l);
 let marks='';for(let t=-10;t<=10;t+=2) marks+=`<line x1="${tx(t)}" y1="${y-5}" x2="${tx(t)}" y2="${y+7}" stroke="var(--muted,#8895a4)" stroke-width="1"/><text x="${tx(t)}" y="${y+27}" fill="var(--text,#354356)" font-size="13" text-anchor="middle">${caNum(t)}</text>`;
 let lines='';for(const z of segments){const x1=z.a===null?l:tx(z.a),x2=z.b===null?r:tx(z.b);lines+=`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#ee6334" stroke-width="8" stroke-linecap="round"/>`;
 if(z.a===null)lines+=`<path d="M${l} ${y} l15 -9 v18 z" fill="#ee6334"/>`;else lines+=caPoint(x1,y,!!z.ac);
 if(z.b===null)lines+=`<path d="M${r} ${y} l-15 -9 v18 z" fill="#ee6334"/>`;else lines+=caPoint(x2,y,!!z.bc);
 }
 for(const x of holes) lines+=caPoint(tx(x),y,false);
 if(test!==null && Number.isFinite(test) && test>=-10 && test<=10){lines+=`<line x1="${tx(test)}" x2="${tx(test)}" y1="38" y2="${y-12}" stroke="#1687a2" stroke-width="2" stroke-dasharray="5 5"/><path d="M${tx(test)-7} 45 L${tx(test)} 34 L${tx(test)+7} 45 L${tx(test)} 56 Z" fill="#1687a2"/><text x="${Math.max(25,Math.min(595,tx(test)))}" y="24" font-size="13" text-anchor="middle" font-weight="700" fill="var(--text,#29394a)">Test x = ${caNum(test)}</text>`;}
 svg.innerHTML=`<line x1="${l}" x2="${r}" y1="${y}" y2="${y}" stroke="var(--muted,#94a0aa)" stroke-width="2"/>${marks}${lines}`;
};
let caIntervalMode='finite';
function caRenderInterval(){
 const li=$('int-left'),ri=$('int-right'),a=Number(li.value),b=Number(ri.value),lc=$('left-closed').checked,rc=$('right-closed').checked;
 if(li.value===''||ri.value===''||!Number.isFinite(a)||!Number.isFinite(b)||a<-10||a>10||b<-10||b>10||((caIntervalMode==='finite'||caIntervalMode==='union')&&a>=b)){$('interval-answer').textContent='Choose a < b between −10 and 10.';$('interval-inequality').textContent='—';$('interval-setbuilder').textContent='—';$('interval-text').textContent='Adjust the boundaries to continue.';$('interval-svg').innerHTML='';return;}
 const m=caIntervalMode;let segments=[],ineq='',interval='';
 if(m==='leftopen'||m==='leftinclusive'){const incl=m==='leftinclusive';segments=[{a:null,b,ac:false,bc:incl}];ineq=`x ${incl?'≤':'<'} ${caNum(b)}`;interval=`(−∞, ${caNum(b)}${incl?']':')'}`;}
 else if(m==='rightopen'||m==='rightinclusive'){const incl=m==='rightinclusive';segments=[{a,b:null,ac:incl,bc:false}];ineq=`x ${incl?'≥':'>'} ${caNum(a)}`;interval=`${incl?'[':'('}${caNum(a)}, ∞)`;}
 else if(m==='all'){segments=[{a:null,b:null}];ineq='x ∈ ℝ';interval='(−∞, ∞)';}
 else if(m==='union'){segments=[{a:null,b:a,bc:lc},{a:b,b:null,ac:rc}];ineq=`x ${lc?'≤':'<'} ${caNum(a)} or x ${rc?'≥':'>'} ${caNum(b)}`;interval=`(−∞, ${caNum(a)}${lc?']':')'} ∪ ${rc?'[':'('}${caNum(b)}, ∞)`;}
 else{segments=[{a,b,ac:lc,bc:rc}];ineq=`${caNum(a)} ${lc?'≤':'<'} x ${rc?'≤':'<'} ${caNum(b)}`;interval=`${lc?'[':'('}${caNum(a)}, ${caNum(b)}${rc?']':')'}`;}
 caAxisNumberLine($('interval-svg'),{segments});$('interval-answer').textContent=interval;$('interval-inequality').textContent=ineq;
 $('interval-setbuilder').textContent=ineq==='x ∈ ℝ'?'{x ∈ ℝ}':`{x ∈ ℝ | ${ineq}}`;
 $('interval-text').innerHTML=`<b>Read the drawing:</b> orange marks are included in the set; a <b>filled dot</b> includes an endpoint, while a <b>hollow dot</b> excludes it. ${m==='union'?'The symbol ∪ combines both orange pieces.':m==='all'?'Every real x is allowed.':segments[0].a===null||segments[0].b===null?'The arrow continues without a finite endpoint.':'Move either boundary to see the interval change.'}`;
 $('left-closed').disabled=m==='all'||m==='leftopen'||m==='leftinclusive';$('right-closed').disabled=m==='all'||m==='rightopen'||m==='rightinclusive';
 document.querySelectorAll('#interval-presets button').forEach(btn=>btn.classList.toggle('active',btn.dataset.kind===(m==='finite'?(lc?(rc?'closed':'leftclosed'):(rc?'rightclosed':'open')):m)));
}
document.querySelectorAll('#interval-presets button').forEach(btn=>btn.addEventListener('click',()=>{const m=btn.dataset.kind;caIntervalMode=['open','closed','leftclosed','rightclosed'].includes(m)?'finite':m;const opts={open:[false,false],closed:[true,true],leftclosed:[true,false],rightclosed:[false,true]};if(opts[m]){ $('left-closed').checked=opts[m][0];$('right-closed').checked=opts[m][1];}if(m==='leftopen'||m==='leftinclusive')$('right-closed').checked=m==='leftinclusive';if(m==='rightopen'||m==='rightinclusive')$('left-closed').checked=m==='rightinclusive';caRenderInterval();}));
['int-left','int-right','left-closed','right-closed'].forEach(id=>$(id).addEventListener('input',()=>{if(caIntervalMode==='all')caIntervalMode='finite';else if(id==='right-closed'&&(caIntervalMode==='leftopen'||caIntervalMode==='leftinclusive'))caIntervalMode=$('right-closed').checked?'leftinclusive':'leftopen';else if(id==='left-closed'&&(caIntervalMode==='rightopen'||caIntervalMode==='rightinclusive'))caIntervalMode=$('left-closed').checked?'rightinclusive':'rightopen';else if(['left-closed','right-closed'].includes(id)&&caIntervalMode!=='union')caIntervalMode='finite';caRenderInterval();}));caRenderInterval();
function caDomain(){
 const kind=$('domain-kind').value,k=Number($('domain-k').value),raw=$('domain-x').value,x=Number(raw),validX=raw.trim()!==''&&Number.isFinite(x);
 $('k-output').textContent=caNum(k);
 const kk=caNum(k),pm=k<0?`+ ${caNum(-k)}`:`− ${kk}`,plus=k<0?`− ${caNum(-k)}`:`+ ${kk}`;
 const expressions={fraction:`f(x) = 1 / (x ${pm})`,fraction2:`f(x) = 1 / (x² − ${k*k})`,root:`f(x) = √(x ${pm})`,rootleft:`f(x) = √(${kk} − x)`,rootden:`f(x) = 1 / √(x ${pm})`,quadratic:`f(x) = (x ${pm})² + 1`,oddroot:`f(x) = ∛(x ${pm})`,oddrootden:`f(x) = 1 / ∛(x ${pm})`};
 const can = t=>kind==='fraction'||kind==='oddrootden'? t!==k : kind==='fraction2'? t!==k&&t!==-k : kind==='root'?t>=k :kind==='rootleft'?t<=k :kind==='rootden'?t>k:true;
 const val=t=>{const d=t-k;switch(kind){case'fraction':return 1/d;case'fraction2':return 1/(t*t-k*k);case'root':return Math.sqrt(d);case'rootleft':return Math.sqrt(k-t);case'rootden':return 1/Math.sqrt(d);case'quadratic':return d*d+1;case'oddroot':return Math.cbrt(d);default:return 1/Math.cbrt(d);}};
 const hole=Math.abs(k);let segments=[],interval='',condition='',steps=[];
 if(kind==='fraction'||kind==='oddrootden'){
  segments=[{a:null,b:k,bc:false},{a:k,b:null,ac:false}];
  interval=`(−∞, ${kk}) ∪ (${kk}, ∞)`;condition=`x ≠ ${kk}`;
  steps=kind==='fraction'?[`The denominator is x ${pm}. Set the restriction: x ${pm} ≠ 0.`,`Solve x ${pm} = 0 by isolating x: x = ${kk} is forbidden.`,`Every real number except ${kk} works. Use two open rays on the number line.`]:[`The denominator is ∛(x ${pm}), which may be negative but cannot equal zero.`,`∛(x ${pm}) ≠ 0 implies x ${pm} ≠ 0, so x ≠ ${kk}.`,`Exclude only ${kk}; all other inputs give real outputs.`];
 }else if(kind==='fraction2'){
  if(k===0){segments=[{a:null,b:0,bc:false},{a:0,b:null,ac:false}];interval='(−∞, 0) ∪ (0, ∞)';condition='x ≠ 0';}
  else {segments=[{a:null,b:-hole,bc:false},{a:-hole,b:hole,ac:false,bc:false},{a:hole,b:null,ac:false}];interval=`(−∞, ${caNum(-hole)}) ∪ (${caNum(-hole)}, ${caNum(hole)}) ∪ (${caNum(hole)}, ∞)`;condition=`x ≠ ${caNum(-hole)} and x ≠ ${caNum(hole)}`;}
  steps=[`Denominator restriction: x² − ${k*k} ≠ 0.`,`Factor: (x − ${caNum(hole)})(x + ${caNum(hole)}) ≠ 0.`,`The denominator is zero when x = ${caNum(-hole)} or x = ${caNum(hole)}${k===0?' (the same number).':'.'}`,`Draw an open circle at each distinct forbidden x-value and include the spaces between them.`];
 }else if(kind==='root'||kind==='rootleft'||kind==='rootden'){
  const right=kind!=='rootleft',strict=kind==='rootden';segments=[right?{a:k,b:null,ac:!strict}:{a:null,b:k,bc:true}];condition=`x ${right?(strict?'>':'≥'):'≤'} ${kk}`;
  interval=right?`${strict?'(':'['}${kk}, ∞)`:`(−∞, ${kk}]`;
  const inside=kind==='rootleft'?`${kk} − x`:`x ${pm}`;
  steps=[`Identify the radicand ${inside}. ${strict?'Because its square root is in the denominator, it must be strictly positive.':'For a real square root it must be nonnegative.'}`,`Write the inequality: ${inside} ${strict?'>':'≥'} 0.`,kind==='rootleft'?`Subtract ${kk} and multiply by −1, <b>reversing</b> the inequality: x ≤ ${kk}.`:`Isolate x: x ${strict?'>':'≥'} ${kk}.`,`Choose ${strict?'an open':'a filled'} circle at ${kk}${right?' and shade to the right.':' and shade to the left.'}`];
 }else{segments=[{a:null,b:null}];interval='(−∞, ∞)';condition='x ∈ ℝ';steps=kind==='quadratic'?[`Powers, addition, and subtraction are defined for every real number.`,`There are no denominators or even roots to restrict x.`,`Domain: all real numbers, (−∞, ∞).`]:[`A cube root is defined for a negative, zero, or positive radicand.`,`Therefore x ${pm} can take any real value.`,`Domain: all real numbers, (−∞, ∞).`];}
 $('domain-expression').textContent=expressions[kind];$('domain-setbuilder').textContent=condition==='x ∈ ℝ'?'{x ∈ ℝ}':`{x ∈ ℝ | ${condition}}`;$('domain-interval').textContent=interval;
 caAxisNumberLine($('domain-svg'),{segments,test:validX?x:null});
 const result=$('domain-result');result.className='ca-domain-status '+(validX?(can(x)?'ca-domain-allowed':'ca-domain-forbidden'):'');
 if(!validX){result.textContent='Enter a real input x to test whether this function accepts it.';}
 else if(can(x)){const v=val(x);const output=Math.abs(v)<1e-10?'0':caNum(v);result.textContent=`✓ ALLOWED: x = ${caNum(x)} gives a real output f(${caNum(x)}) ${Math.abs(v-Math.round(v))<1e-9?'=':'≈'} ${output}.`;}
 else {const why=(kind==='fraction'||kind==='fraction2'||kind==='oddrootden')?'the denominator becomes zero':kind==='root' || kind==='rootleft'?'the square-root radicand is negative':'the square-root denominator is zero or not real';result.textContent=`✕ NOT ALLOWED: x = ${caNum(x)} because ${why}.`;}
 $('domain-steps').innerHTML=steps.map(t=>`<li>${t}</li>`).join('');
}
['domain-kind','domain-k','domain-x'].forEach(id=>$(id).addEventListener('input',caDomain));caDomain();
// A full coordinate plane: finite endpoints, unbounded pieces and an excluded input/output.
let caDRView='domain';
const caGraphExamples={
 segment:{domain:'(−4, 2]',range:'(−3, 3]',why:'The graph starts at (−4, −3) with an open circle and ends at (2, 3) with a filled circle. The x-shadow is (−4, 2]; the y-shadow is (−3, 3].',f:x=>x+1,parts:[[-4,2]],ends:[[-4,-3,false],[2,3,true]],dx:[{a:-4,b:2,ac:false,bc:true}],dy:[{a:-3,b:3,ac:false,bc:true}]},
 root:{domain:'[−2, ∞)',range:'[−1, ∞)',why:'The square-root curve begins at the included point (−2, −1) and extends to the right and up. Both shadows start at filled endpoints.',f:x=>Math.sqrt(x+2)-1,parts:[[-2,6]],ends:[[-2,-1,true]],dx:[{a:-2,b:null,ac:true}],dy:[{a:-1,b:null,ac:true}]},
 absolute:{domain:'(−∞, ∞)',range:'[−2, ∞)',why:'The V-shaped graph continues to both left and right, so every real x occurs. Its lowest point is (1, −2), which is included.',f:x=>Math.abs(x-1)-2,parts:[[-6,6]],ends:[],dx:[{a:null,b:null}],dy:[{a:-2,b:null,ac:true}]},
 parabola:{domain:'(−∞, ∞)',range:'(−∞, 3]',why:'The parabola extends indefinitely in both horizontal directions. Its vertex (1, 3) is the greatest output, so y = 3 is included.',f:x=>-((x-1)**2)+3,parts:[[-6,6]],ends:[],dx:[{a:null,b:null}],dy:[{a:null,b:3,bc:true}]},
 reciprocal:{domain:'(−∞, 1) ∪ (1, ∞)',range:'(−∞, 0) ∪ (0, ∞)',why:'The vertical asymptote x = 1 is forbidden. The curve approaches but never reaches y = 0. One x-value and one y-value are missing.',f:x=>1/(x-1),parts:[[-6,1],[1,6]],ends:[],dx:[{a:null,b:1,bc:false},{a:1,b:null,ac:false}],dy:[{a:null,b:0,bc:false},{a:0,b:null,ac:false}]}
};
function caRenderGraph(){
 const key=$('dr-graph-kind').value,d=caGraphExamples[key],svg=$('dr-graph-svg'),xmin=-6,xmax=6,ymin=-5,ymax=7,W=650,H=400,pL=47,pR=34,pT=22,pB=43;
 const tx=x=>pL+(x-xmin)*(W-pL-pR)/(xmax-xmin),ty=y=>H-pB-(y-ymin)*(H-pT-pB)/(ymax-ymin),axisY=ty(0),axisX=tx(0);
 let grid='',paths='',projections='';for(let x=-6;x<=6;x++){grid+=`<line x1="${tx(x)}" x2="${tx(x)}" y1="${pT}" y2="${H-pB}" stroke="var(--ca-graph-grid,#dbe2e9)" stroke-width="${x===0?1.6:.8}"/><text x="${tx(x)}" y="${H-19}" font-size="12" fill="var(--ca-plot-text,#2f3c4a)" text-anchor="middle">${caNum(x)}</text>`;}
 for(let y=-5;y<=7;y++){grid+=`<line x1="${pL}" x2="${W-pR}" y1="${ty(y)}" y2="${ty(y)}" stroke="var(--ca-graph-grid,#dbe2e9)" stroke-width="${y===0?1.6:.8}"/>`;if(y%2===0)grid+=`<text x="${pL-10}" y="${ty(y)+5}" font-size="12" fill="var(--ca-plot-text,#2f3c4a)" text-anchor="end">${caNum(y)}</text>`;}
 const inBounds=v=>v>=ymin&&v<=ymax;
 for(const [start,end] of d.parts){let points=[],was=false;const segments=[];const n=700;
  for(let j=0;j<=n;j++){let x=start+(end-start)*j/n;if(key==='reciprocal'&&Math.abs(x-1)<1e-6){if(points.length>1)segments.push(points);points=[];was=false;continue;}let y=d.f(x);const ok=Number.isFinite(y)&&inBounds(y);if(ok){points.push([tx(x),ty(y)]);}else if(points.length){if(points.length>1)segments.push(points);points=[];}}
  if(points.length>1)segments.push(points);
  for(const seg of segments){const str=seg.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');paths+=`<path d="${str}" fill="none" stroke="#ed6336" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" ${key==='segment'?'':`marker-end="url(#ca-graph-arrow)" ${key==='root'?'':'marker-start="url(#ca-graph-arrow)"'}`}/>`;}
 }
 if(key==='reciprocal'){paths+=`<line x1="${tx(1)}" x2="${tx(1)}" y1="${pT}" y2="${H-pB}" stroke="#a7819e" stroke-dasharray="8 6" stroke-width="2"/><line x1="${pL}" x2="${W-pR}" y1="${axisY}" y2="${axisY}" stroke="#a7819e" stroke-dasharray="8 6" stroke-width="2"/>`;
 paths+=`<text x="${tx(1)+8}" y="${pT+18}" fill="var(--ca-plot-text,#39475b)" font-weight="700" font-size="13">x = 1</text>`;}
 for(const [x,y,filled] of d.ends)paths+=caPoint(tx(x),ty(y),filled,'#ed6336',8);
 const series=caDRView==='domain'?d.dx:d.dy;
 for(const seg of series){let a,b,x1,y1,x2,y2;
 if(caDRView==='domain'){a=seg.a===null?xmin:seg.a;b=seg.b===null?xmax:seg.b;x1=tx(a);x2=tx(b);y1=axisY;y2=axisY;}
 else{a=seg.a===null?ymin:seg.a;b=seg.b===null?ymax:seg.b;x1=axisX;x2=axisX;y1=ty(a);y2=ty(b);}
 projections+=`<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" stroke="#1b88b0" stroke-width="11" stroke-opacity=".82" stroke-linecap="round"/>`;
 if(seg.a!==null)projections+=caPoint(caDRView==='domain'?tx(seg.a):axisX,caDRView==='domain'?axisY:ty(seg.a),!!seg.ac,'#1b88b0',6);
 if(seg.b!==null)projections+=caPoint(caDRView==='domain'?tx(seg.b):axisX,caDRView==='domain'?axisY:ty(seg.b),!!seg.bc,'#1b88b0',6);
 if(seg.a===null){if(caDRView==='domain')projections+=`<path d="M${tx(xmin)} ${axisY} l15 -9 v18 z" fill="#1b88b0"/>`;else projections+=`<path d="M${axisX} ${ty(ymin)} l-9 -15 h18 z" fill="#1b88b0"/>`;}
 if(seg.b===null){if(caDRView==='domain')projections+=`<path d="M${tx(xmax)} ${axisY} l-15 -9 v18 z" fill="#1b88b0"/>`;else projections+=`<path d="M${axisX} ${ty(ymax)} l-9 15 h18 z" fill="#1b88b0"/>`;}
 }
 // Blue axis-shadows are overlaid after the orange graph: visible even when axes overlap.
 svg.innerHTML=`<defs><marker id="ca-graph-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse"><path d="M0 0 L6 3 L0 6 Z" fill="#ed6336"/></marker></defs><rect x="${pL}" y="${pT}" width="${W-pL-pR}" height="${H-pT-pB}" fill="var(--ca-plot-bg,#fff)"/>${grid}${paths}${projections}<text x="${W-pR+5}" y="${axisY-9}" fill="var(--ca-plot-text,#344356)" font-size="15" font-weight="700">x</text><text x="${axisX+8}" y="${pT+12}" fill="var(--ca-plot-text,#344356)" font-size="15" font-weight="700">y</text>`;
 $('dr-domain').textContent=d.domain;$('dr-range').textContent=d.range;
 $('dr-explanation').innerHTML=`<b>${caDRView==='domain'?'Reading the x-shadow (left → right)':'Reading the y-shadow (bottom → top)'}:</b> ${d.why} <b>Highlighted ${caDRView}:</b> ${caDRView==='domain'?d.domain:d.range}. <span class="ca-muted">The drawing shows a finite window; arrows/continuation indicate the curve goes on beyond the window.</span>`;
 document.querySelectorAll('[data-dr-view]').forEach(btn=>{const selected=btn.dataset.drView===caDRView;btn.classList.toggle('active',selected);btn.setAttribute('aria-pressed',String(selected));});
}
$('dr-graph-kind').addEventListener('change',caRenderGraph);document.querySelectorAll('[data-dr-view]').forEach(b=>b.addEventListener('click',()=>{caDRView=b.dataset.drView;caRenderGraph();}));caRenderGraph();
function caRangeParabola(){
 let h=+$('vertex-h').value,k=+$('vertex-k').value,a=+$('vertex-a').value;
 $('h-display').textContent=caNum(h);$('v-display').textContent=caNum(k);
 const svg=$('range-svg'),g=plot(svg,x=>a*(x-h)*(x-h)+k,{xmin:-6,xmax:6,ymin:-7,ymax:7});
 const axis=g.tx(0),at=g.ty(k),top=a>0?g.ty(7):g.ty(-7);
 svg.innerHTML+=`<line x1="${g.tx(-6)}" y1="${g.ty(0)}" x2="${g.tx(6)}" y2="${g.ty(0)}" stroke="#1b88b0" stroke-width="6" stroke-opacity=".75"/><line x1="${axis}" y1="${at}" x2="${axis}" y2="${top}" stroke="#1b88b0" stroke-width="9" stroke-opacity=".7"/>${caPoint(axis,at,true,'#1b88b0',6)}${caPoint(g.tx(h),g.ty(k),true,'#ed6336',8)}`;
 const range=a>0?`[${caNum(k)}, ∞)`:`(−∞, ${caNum(k)}]`;
 $('range-domain').textContent='(−∞, ∞)';$('range-range').textContent=range;
 $('range-answer').innerHTML=`<b>Vertex:</b> (${caNum(h)}, ${caNum(k)}). <b>Domain:</b> all real x, (−∞, ∞). <b>Range:</b> ${range}. Because the parabola opens ${a>0?'upward':'downward'}, <b>y = ${caNum(k)}</b> is the included ${a>0?'minimum':'maximum'} output. The blue shadows mark the allowed x- and y-values.`;
}
['vertex-h','vertex-k','vertex-a'].forEach(id=>$(id).addEventListener('input',caRangeParabola));caRangeParabola();
// Section 3.1: work backwards from y to find all x values.
function graphReading(){
 const x=Number($('graph-input').value),yTarget=Number($('graph-output').value),f=t=>(t+1)*(t+1)-1;
 const svg=$('ca-read-graph'),g=plot(svg,f,{xmin:-5,xmax:3,ymin:-2,ymax:10});
 const xPoints=[-1-Math.sqrt(yTarget+1),-1+Math.sqrt(yTarget+1)].filter((t,i,arr)=>i===0||Math.abs(t-arr[0])>1e-8);
 svg.innerHTML+=`<line x1="${g.tx(-5)}" x2="${g.tx(3)}" y1="${g.ty(yTarget)}" y2="${g.ty(yTarget)}" stroke="#137b9a" stroke-dasharray="6 5" stroke-width="2.3"/>`;
 svg.innerHTML+=`<line x1="${g.tx(x)}" x2="${g.tx(x)}" y1="${g.ty(0)}" y2="${g.ty(f(x))}" stroke="#d64d25" stroke-dasharray="4 4" stroke-width="2"/><circle cx="${g.tx(x)}" cy="${g.ty(f(x))}" r="6" fill="#e65125" stroke="#fff" stroke-width="2"/>`;
 for(const t of xPoints){if(t>=-5&&t<=3)svg.innerHTML+=`<circle cx="${g.tx(t)}" cy="${g.ty(yTarget)}" r="5.5" fill="#137b9a" stroke="white" stroke-width="2"/>`;}
 $('graph-read-feedback').textContent=`Input-first: g(${fmt(x)}) = ${f(x)}. Output-first: g(x) = ${yTarget} at x = ${xPoints.map(fmt).join(' or x = ')}.`;
}
['graph-input','graph-output'].forEach(id=>$(id).addEventListener('change',graphReading));graphReading();


// Newly authored mobile-friendly visual activities for Section 3.1.
const coordinatePoints=[[-3,2],[1,3],[2,-2],[4,1]],coordinateNames=['A','B','C','D'];let coordinateView='domain';
const svgText=v=>fmt(v);
function coordinateLab(){
 const chosen=+$('coordinate-which').value, [mx,my]=coordinatePoints[chosen];
 $('coordinate-x').value=mx;$('coordinate-y').value=my;$('coordinate-x-label').textContent=fmt(mx);$('coordinate-y-label').textContent=fmt(my);
 const svg=$('coordinate-svg'),tx=x=>280+x*48,ty=y=>178-y*35;
 let markup='';for(let x=-4;x<=4;x++){markup+=`<line x1="${tx(x)}" x2="${tx(x)}" y1="30" y2="320" stroke="${x===0?'#8394a8':'#8296a855'}" stroke-width="${x===0?2:1}"/><text x="${tx(x)}" y="342" text-anchor="middle" fill="currentColor" font-size="13">${fmt(x)}</text>`;}
 for(let y=-4;y<=4;y++){markup+=`<line x1="60" x2="500" y1="${ty(y)}" y2="${ty(y)}" stroke="${y===0?'#8394a8':'#8296a855'}" stroke-width="${y===0?2:1}"/><text x="45" y="${ty(y)+5}" text-anchor="end" fill="currentColor" font-size="13">${fmt(y)}</text>`;}
 const colors=['#d64d25','#008f91','#8c5acd','#cf8920'];
 coordinatePoints.forEach(([x,y],i)=>{const px=tx(x),py=ty(y),active=i===chosen,col=colors[i];const vertical=coordinateView==='domain';
 markup+=`<line x1="${px}" y1="${py}" x2="${vertical?px:tx(0)}" y2="${vertical?ty(0):py}" stroke="${col}" stroke-dasharray="5 4" stroke-width="${active?3:1.8}"/><circle cx="${px}" cy="${py}" r="${active?10:7.5}" fill="${col}" stroke="white" stroke-width="${active?3:1.6}"/><text x="${px+12}" y="${py-13}" fill="${col}" font-size="16" font-weight="800">${coordinateNames[i]}</text>`;
 });
 svg.innerHTML=markup;
 const distinct=(index)=>[...new Set(coordinatePoints.map(pair=>pair[index]))].sort((a,b)=>a-b);
 $('coordinate-pairs').innerHTML=coordinatePoints.map(([x,y],i)=>`<span class="ca-pair ${i===chosen?'ca-selected-pair':''}" style="--pair-tone:${colors[i]}">${coordinateNames[i]} (${fmt(x)}, ${fmt(y)})</span>`).join('');
 $('coordinate-domain').textContent='{ '+distinct(0).map(fmt).join(', ')+' }';$('coordinate-range').textContent='{ '+distinct(1).map(fmt).join(', ')+' }';
 const n=coordinateView==='domain'?0:1;
 $('coordinate-feedback').textContent=`${coordinateView==='domain'?'Project onto the x-axis: first coordinates.':'Project onto the y-axis: second coordinates.'} You have ${distinct(n).length} distinct ${coordinateView==='domain'?'inputs':'outputs'} from ${coordinatePoints.length} points. Selected point ${coordinateNames[chosen]} = (${fmt(mx)}, ${fmt(my)}).`;
 document.querySelectorAll('[data-coordinate-view]').forEach(button=>{const active=button.dataset.coordinateView===coordinateView;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
$('coordinate-which').addEventListener('change',coordinateLab);
for(const [id,idx] of [['coordinate-x',0],['coordinate-y',1]]) $(id).addEventListener('input',()=>{coordinatePoints[+$('coordinate-which').value][idx]=+$(id).value;coordinateLab()});
document.querySelectorAll('[data-coordinate-view]').forEach(el=>el.addEventListener('click',()=>{coordinateView=el.dataset.coordinateView;coordinateLab();}));coordinateLab();

const clubAssignments=[['Mia','Studio North'],['Leo','Studio North'],['Nora','Studio East']];let clubReverse=false;
function clubMap(){const groups=new Map();for(const [person,room] of clubAssignments){const key=clubReverse?room:person,val=clubReverse?person:room;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(val)}const valid=[...groups.values()].every(out=>new Set(out).size===1);
$('club-map').innerHTML=[...groups].map(([input,outs])=>`<div class="ca-story-line"><span class="ca-story-input">${input}</span><span aria-hidden="true" class="ca-story-arrow">→</span><span class="ca-story-output ${outs.length>1?'ca-story-conflict':''}">${outs.join(' · ')}</span></div>`).join('');
$('club-feedback').textContent=(valid?'✓ FUNCTION. ':'✕ NOT A FUNCTION. ')+(clubReverse?'A studio is now the input. Studio North corresponds to Mia and Leo: two outputs for one input.':'A member is the input. Every member has exactly one assigned room—even though two members share Studio North.');
$('club-flip').textContent=clubReverse?'Restore member → room ↔':'Reverse direction ↔';
}
$('club-flip').addEventListener('click',()=>{clubReverse=!clubReverse;clubMap()});clubMap();

function notationLab(){const n=+$('notation-n').value,expense=5*n+2;$('notation-n-label').textContent=n;$('notation-reading').textContent=`p(${n}) = $${expense}`;$('notation-steps').textContent=`Substitute n = ${n}: 5 × ${n} + 2 = ${expense}. The total is $${expense}.`;
 const total=Math.max(1,expense);$('notation-fee-bar').style.width=`${2/total*100}%`;$('notation-games-bar').style.width=`${5*n/total*100}%`;$('notation-games-value').textContent='$'+(5*n);$('notation-games-bar').textContent='';$('notation-fee-bar').setAttribute('title','Entry fee $2');$('notation-games-bar').setAttribute('title',`Games cost $${5*n}`);
}
$('notation-n').addEventListener('input',notationLab);notationLab();

const rules={line:{name:'r(x) = x + 2',f:x=>x+2,why:'This is a straight line: the output increases by 1 whenever x increases by 1.'},square:{name:'r(x) = x² − 1',f:x=>x*x-1,why:'A parabola: opposite inputs can share an output without violating the function rule.'},absolute:{name:'r(x) = |x| + 1',f:x=>Math.abs(x)+1,why:'A V-shaped graph: absolute value measures distance from 0 before shifting up.'}};
function fourViews(){const {name,f,why}=rules[$('four-rule').value],x=+$('four-input').value,y=f(x);$('four-input-label').textContent=fmt(x);$('four-formula').textContent=name;$('four-substitution').textContent=`Substitute x = ${fmt(x)} → r(${fmt(x)}) = ${fmt(y)}`;
 const entries=[-2,-1,0,1,2];$('four-pairs').innerHTML=entries.map(v=>`<span class="ca-pair ${v===x?'ca-selected-pair':''}">(${fmt(v)}, ${fmt(f(v))})</span>`).join('');
 $('four-tbody').innerHTML=entries.map(v=>`<tr class="${v===x?'selected':''}"><td>${fmt(v)}</td><td>${fmt(f(v))}</td></tr>`).join('');
 const svg=$('four-graph'),g=plot(svg,f,{xmin:-4,xmax:4,ymin:-3,ymax:8});svg.innerHTML+=`<circle cx="${g.tx(x)}" cy="${g.ty(y)}" r="9" fill="#008f91" stroke="white" stroke-width="3"/><text x="${g.tx(x)+11}" y="${g.ty(y)-13}" fill="currentColor" font-size="18" font-weight="800">(${fmt(x)},${fmt(y)})</text>`;
 $('four-feedback').textContent=`The point (${fmt(x)}, ${fmt(y)}) appears in all four representations. ${why}`;
}
['four-rule','four-input'].forEach(id=>$(id).addEventListener('input',fourViews));fourViews();

function twoWay(){const x=+$('forward-x').value,t=+$('backward-y').value,forward=(x-2)**2+1,shift=Math.sqrt(t-1),roots=[2-shift,2+shift].filter((v,i,arr)=>i===0||Math.abs(v-arr[0])>1e-10);$('forward-x-label').textContent=fmt(x);
 $('forward-result').textContent=`q(${fmt(x)}) = (${fmt(x)} − 2)² + 1 = ${forward}`;$('backward-result').textContent=`q(x) = ${t} → x = ${roots.map(fmt).join(' or ')}`;
 $('two-way-explanation').textContent=`Work backward: (x − 2)² + 1 = ${t} → (x − 2)² = ${t-1} → x − 2 = ±${shift} → ${roots.length} input${roots.length===1?'':'s'}: ${roots.map(fmt).join(' or ')}. Each input still gives exactly one output.`;
}
$('forward-x').addEventListener('input',twoWay);$('backward-y').addEventListener('change',twoWay);twoWay();

const toolkitFunctions={identity:{f:x=>x,clue:'Every point satisfies y = x, so input and output are equal.'},constant:{f:x=>2,clue:'All inputs share the same output 2. This is still a function.'},square:{f:x=>x*x,clue:'The graph has a U shape, with a minimum at (0, 0).'},cube:{f:x=>x*x*x,clue:'An S-shaped curve passes through the origin and keeps increasing.'},absolute:{f:x=>Math.abs(x),clue:'A V shape: both −3 and 3 produce output 3.'},root:{f:x=>x>=0?Math.sqrt(x):NaN,clue:'The square-root graph starts at the origin; negative x-values are not real inputs.'},reciprocal:{f:x=>x===0?NaN:1/x,clue:'The reciprocal graph never touches either axis. x = 0 is excluded.'}};
function toolkitLab(name){const item=toolkitFunctions[name];plot($('toolkit-graph'),item.f,{xmin:-5,xmax:5,ymin:-5,ymax:5});$('toolkit-clue').textContent=item.clue;document.querySelectorAll('[data-toolkit]').forEach(b=>{let yes=b.dataset.toolkit===name;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});}
document.querySelectorAll('[data-toolkit]').forEach(button=>button.addEventListener('click',()=>toolkitLab(button.dataset.toolkit)));toolkitLab('identity');

// Guided practice belongs inside each numbered section, not in a separate TOC chapter.
const guidedBanks={
 '31':[
  {q:'For {(−4, 1), (2, 1), (2, 7)}, which set is the domain?',opts:['{−4, 2}','{1, 7}','{−4, 2, 2}'],correct:0,why:'Only the first coordinates belong to the domain. Write each distinct input once: {−4, 2}.'},
  {q:'For {(−2, 6), (1, 4), (5, 6)}, what is the range?',opts:['{−2, 1, 5}','{4, 6}','{6, 4, 6}'],correct:1,why:'Collect the different outputs, 6 and 4, so the range is {4, 6}.'},
  {q:'At the art club, Mia and Leo are assigned Studio North. Is member → studio a function?',opts:['No, North appears twice','Yes, each member has one room','No, different members must have different rooms'],correct:1,why:'Each member has exactly one room. Sharing an output is allowed.'},
  {q:'Reverse the art-club assignment: studio → member. Is that a function when two members use Studio North?',opts:['Yes, because both people have a room','No, North would have two different outputs','Yes, because there are two inputs'],correct:1,why:'If the room is the input, Studio North would lead to two different people.'},
  {q:'For the game-booth rule p(n) = 5n + 2, what does n represent?',opts:['The $2 entry fee','The amount paid','The number of games (input)'],correct:2,why:'n is the independent variable: number of games played. p(n) is the total cost.'},
  {q:'Use the game-booth rule p(n) = 5n + 2. Find p(4).',opts:['14','22','27'],correct:1,why:'p(4) = 5(4) + 2 = 22.'},
  {q:'For q(x) = (x − 2)² + 1, solve q(x) = 5.',opts:['x = 0 or 4','x = 2 only','x = −4 or 0'],correct:0,why:'(x − 2)² = 4. Therefore x − 2 = ±2, so x = 0 or x = 4.'},
  {q:'The table lists t(−4)=3, t(−1)=6, t(2)=3, t(5)=8. Which inputs give output 3?',opts:['−1 and 5','−4 and 2','−4 only'],correct:1,why:'Inspect all table rows with output 3: inputs −4 and 2.'},
  {q:'Which relation fails the vertical line test?',opts:['y = |x|','x²/4 + y² = 1','y = x + 2'],correct:1,why:'The ellipse has two different y-values when x = 0: y = 1 and y = −1.'},
  {q:'For g(x) = (x + 1)² − 1, solve g(x) = 3.',opts:['x = −1','x = −3 or 1','x = −2 or 0'],correct:1,why:'(x + 1)² = 4. Taking both square roots gives x + 1 = ±2, hence x = −3 or 1.'}
 ],
 '32':[
  {q:'The shaded number line starts with an open circle at −2 and ends with a filled circle at 6. Choose the interval.',opts:['[−2, 6]','(−2, 6]','(−2, 6)'],correct:1,why:'An open circle excludes −2; a filled circle includes 6. The interval is (−2, 6].'},
  {q:'Which set-builder notation matches [3, ∞)?',opts:['{x ∈ ℝ | x > 3}','{x ∈ ℝ | x ≥ 3}','{x ∈ ℝ | x ≤ 3}'],correct:1,why:'The bracket at 3 includes the value 3, and the arrow goes to the right: x ≥ 3.'},
  {q:'What is the domain of f(x) = 1/(x + 5)?',opts:['(−∞, ∞)','(−∞, −5) ∪ (−5, ∞)','[−5, ∞)'],correct:1,why:'x + 5 = 0 at x = −5. Exclude this one input because division by zero is undefined.'},
  {q:'Find the domain of g(x) = √(x − 4).',opts:['(4, ∞)','(−∞, 4]','[4, ∞)'],correct:2,why:'The radicand must satisfy x − 4 ≥ 0, so x ≥ 4. The boundary is included.'},
  {q:'Find the domain of h(x) = 1/√(x + 2).',opts:['(−2, ∞)','[−2, ∞)','(−∞, −2)'],correct:0,why:'The radical is in the denominator: x + 2 > 0. Hence x > −2; the endpoint is open.'},
  {q:'What is the domain of p(x) = 1/(x² − 9)?',opts:['(−∞, −3) ∪ (−3, 3) ∪ (3, ∞)','[−3, 3]','(−∞, ∞)'],correct:0,why:'Factor x² − 9 = (x − 3)(x + 3). Exclude both −3 and 3.'},
  {q:'A line segment goes from a hollow dot at (−4, −3) to a filled dot at (2, 3). What is its range?',opts:['[−4, 2)','(−3, 3]','[−3, 3)'],correct:1,why:'Read from bottom to top: −3 is excluded and 3 is included. The range is (−3, 3].'},
  {q:'For f(x) = |x − 1| − 2, what is its range?',opts:['[−2, ∞)','(−∞, −2]','(−∞, ∞)'],correct:0,why:'Absolute value is never negative, so the lowest output is −2. It is attained at x = 1.'},
  {q:'For f(x) = −(x − 1)² + 3, what is the range?',opts:['[3, ∞)','(−∞, 3]','(−∞, ∞)'],correct:1,why:'The parabola opens downward. The vertex has maximum y = 3, included.'},
  {q:'Which value is excluded from the range of y = 1/(x − 1)?',opts:['y = 1','y = 0','y = −1'],correct:1,why:'A reciprocal can never equal zero; the horizontal asymptote is y = 0.'},
  {q:'For f(x) = √(3 − x), which interval is the domain?',opts:['(−∞, 3]','[3, ∞)','(−∞, 3)'],correct:0,why:'3 − x ≥ 0 means −x ≥ −3, so x ≤ 3 after reversing the inequality.'},
  {q:'Which statement about infinity is correct?',opts:['Use brackets when ∞ is included','Always use parentheses beside ±∞','Infinity is the largest real number'],correct:1,why:'Infinity is not a real endpoint, so it is never included in an interval.'},
  {q:'What is the domain of ∛(x + 8)?',opts:['[−8, ∞)','(−∞, ∞)','(−∞, −8) ∪ (−8, ∞)'],correct:1,why:'Cube roots are defined for negative, zero, and positive inputs; there is no restriction.'}
 ]
};
const guidedHints={
 '31':[
  'Domain comes from the first coordinates only; do not list a repeated input twice.',
  'Range comes from the second coordinates only; remove duplicate outputs.',
  'Does each member have just one room? Different members can share a room.',
  'After reversing, which quantity becomes the input? Can it lead to two people?',
  'Look inside the parentheses; that is the independent variable.',
  'Replace n by 4 in the game-booth rule and simplify.',
  'Subtract 1, then take both square roots.',
  'Scan the outputs for 3, then collect every matching input.',
  'Imagine a vertical line at x = 0. How many points will it hit?',
  'Add 1 to both sides, then take positive and negative square roots.'
 ],
 '32':[
  'A hollow dot means excluded; a filled dot means included.',
  'The bracket at 3 includes 3. Which inequality matches that?',
  'Set the denominator equal to zero to locate the forbidden x-value.',
  'A real square root needs a nonnegative radicand.',
  'If the root is in a denominator, zero is excluded as well.',
  'Factor the denominator using the difference of two squares.',
  'Range comes from y-values; scan bottom to top.',
  'The absolute-value expression cannot be negative.',
  'An upside-down parabola has a maximum at its vertex.',
  'Can 1 divided by a real nonzero number ever be zero?',
  'Remember: multiplying an inequality by a negative reverses it.',
  'Is a cube root defined for negative numbers?',
  'Infinity is not an attainable real endpoint.'
 ]
};
function setupGuided(which){
 const bank=guidedBanks[which],count=which==='31'?5:5;let offset=0;
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