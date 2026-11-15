/* Section 3.1 · Functions and Function Notation — interactive activities */

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
function machine(){let [a,b,c,x]=['coeff-a','coeff-b','coeff-c','input-x'].map(id=>+$(id).value);['a-label','b-label','c-label','x-label'].forEach((id,i)=>$(id).textContent=fmt([a,b,c,x][i]));$('machine-expression').textContent=`f(x) = ${a}x² ${b<0?'−':'+'} ${Math.abs(b)}x ${c<0?'−':'+'} ${Math.abs(c)}`;$('machine-result').textContent=`f(${fmt(x)}) = ${a*x*x+b*x+c}`;$('machine-steps').textContent=`Substitute x = ${fmt(x)}: (${fmt(a)})(${fmt(x)})² + (${fmt(b)})(${fmt(x)}) + (${fmt(c)}) = ${fmt(a*x*x)} + (${fmt(b*x)}) + (${fmt(c)}).`;}['coeff-a','coeff-b','coeff-c','input-x'].forEach(id=>$(id).addEventListener('input',machine));machine();// Section 08 is driven solely by the synchronized table and coordinate explorer below.
// Section 3.1: work backwards from y to find all x values.
// Section 3.1 · 09: read three different graphs in two directions (notes Example 7 / TPS 7).
const graphKinds={
 parabola:{name:'g',formula:'g(x) = (x + 1)² − 1',f:t=>(t+1)*(t+1)-1,win:{xmin:-5,xmax:3,ymin:-2,ymax:10},
  inputs:[-4,-3,-2,-1,0,1,2],input:-3,outputs:[-1,0,3,8],output:3,
  solve:b=>b<-1?[]:b===-1?[-1]:[-1-Math.sqrt(b+1),-1+Math.sqrt(b+1)],
  none:b=>`no input gives g(x) = ${fmt(b)}, because the vertex (−1, −1) is the lowest point`,
  undefinedText:()=>'',
  preview:'Section 3.2 preview: domain (−∞, ∞), range [−1, ∞).',
  prompt:'Look for the vertex of the graph. What happens when you choose the <b>smallest possible output</b>?'},
 root:{name:'s',formula:'s(x) = √(x + 4) − 1',f:t=>t>=-4?Math.sqrt(t+4)-1:NaN,win:{xmin:-6,xmax:13,ymin:-3,ymax:4},
  inputs:[-5,-4,-3,0,5,12],input:0,outputs:[-2,-1,0,1,2,3],output:2,
  solve:b=>b<-1?[]:[(b+1)*(b+1)-4],
  none:b=>`no input gives s(x) = ${fmt(b)}, because the graph starts at (−4, −1) and only rises`,
  undefinedText:x=>`s(${fmt(x)}) is undefined: √(${fmt(x)} + 4) = √(${fmt(x+4)}) is not a real number, so x = ${fmt(x)} is not in the domain`,
  preview:'Section 3.2 preview: domain [−4, ∞), range [−1, ∞).',
  prompt:'Where does the graph <b>start</b>? What happens if you ask for an output below that starting height?'},
 cubic:{name:'c',formula:'c(x) = −(x − 1)³ + 1',f:t=>1-(t-1)**3,win:{xmin:-2,xmax:4,ymin:-8,ymax:10},
  inputs:[-1,0,1,2,3],input:0,outputs:[-7,0,1,2,9],output:1,
  solve:b=>[1+Math.cbrt(1-b)],
  none:()=>'',undefinedText:()=>'',
  preview:'Section 3.2 preview: domain (−∞, ∞), range (−∞, ∞).',
  prompt:'Try every output. Why does each output come from <b>exactly one input</b> here, but sometimes from two inputs on the parabola?'}
};
let graphKind='parabola';
function graphSetKind(kind){
 graphKind=kind;const d=graphKinds[kind];
 $('graph-input').innerHTML=d.inputs.map(v=>`<option value="${v}"${v===d.input?' selected':''}>${fmt(v)}</option>`).join('');
 $('graph-output').innerHTML=d.outputs.map(v=>`<option value="${v}"${v===d.output?' selected':''}>${fmt(v)}</option>`).join('');
 $('graph-read-name').textContent=d.formula;$('graph-solve-name').textContent=d.name;$('graph-read-prompt').innerHTML=d.prompt;
 $('ca-read-graph').setAttribute('aria-label',`Graph of ${d.formula} with an orange input marker and blue output-level intersections`);
 graphReading();
}
function graphReading(){
 const d=graphKinds[graphKind],x=Number($('graph-input').value),yTarget=Number($('graph-output').value),f=d.f,n=d.name,w=d.win;
 const clean=v=>Number(v.toFixed(9));
 const svg=$('ca-read-graph'),g=plot(svg,f,w);
 const xPoints=d.solve(yTarget).map(clean);
 svg.innerHTML+=`<line x1="${g.tx(w.xmin)}" x2="${g.tx(w.xmax)}" y1="${g.ty(yTarget)}" y2="${g.ty(yTarget)}" stroke="#137b9a" stroke-dasharray="6 5" stroke-width="2.3"/>`;
 const fx=f(x),defined=Number.isFinite(fx);
 if(defined)svg.innerHTML+=`<line x1="${g.tx(x)}" x2="${g.tx(x)}" y1="${g.ty(0)}" y2="${g.ty(fx)}" stroke="#d64d25" stroke-dasharray="4 4" stroke-width="2"/><circle cx="${g.tx(x)}" cy="${g.ty(fx)}" r="6" fill="#e65125" stroke="#fff" stroke-width="2"/>`;
 else svg.innerHTML+=`<text x="${g.tx(x)}" y="${g.ty(0)+6}" text-anchor="middle" font-size="20" font-weight="800" fill="#d64d25">✕</text>`;
 for(const t of xPoints){if(t>=w.xmin&&t<=w.xmax)svg.innerHTML+=`<circle cx="${g.tx(t)}" cy="${g.ty(yTarget)}" r="5.5" fill="#137b9a" stroke="white" stroke-width="2"/>`;}
 const inputText=defined?`${n}(${fmt(x)}) = ${fmt(clean(fx))}`:d.undefinedText(x);
 const outputText=xPoints.length===0?d.none(yTarget):`${n}(x) = ${fmt(yTarget)} at x = ${xPoints.map(fmt).join(' or x = ')}${xPoints.length===1?' only':''}`;
 $('graph-read-feedback').innerHTML=`<b>Input-first:</b> ${inputText}. <b>Output-first:</b> ${outputText}. <span class="ca-muted">${d.preview}</span>`;
}
['graph-input','graph-output'].forEach(id=>$(id).addEventListener('change',graphReading));$('graph-kind').addEventListener('change',e=>graphSetKind(e.target.value));graphReading();


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

// 06 · Two-way calculator: a second function with a square root (notes Example 5 / TPS 5).
let twoWayMode='square';
const twoWaySetup={
 square:{name:'q',formula:'q(x) = (x − 2)² + 1',min:-1,max:5,x:0,targets:[1,2,5,10],target:5},
 root:{name:'r',formula:'r(x) = √(2x + 3)',min:-1,max:11,x:3,targets:[1,3,5,-1],target:3}
};
function caSimplifyRoot(n){
 if(n===0)return{text:'0',whole:true,value:0};
 let outside=1,inside=n;
 for(let f=2;f*f<=inside;f++){while(inside%(f*f)===0){inside/=f*f;outside*=f;}}
 return inside===1?{text:fmt(outside),whole:true,value:outside}:{text:`${outside===1?'':fmt(outside)}√${inside}`,whole:false,value:outside*Math.sqrt(inside)};
}
function twoWaySwitch(mode){
 twoWayMode=mode;const cfg=twoWaySetup[mode],slider=$('forward-x'),pick=$('backward-y');
 slider.min=cfg.min;slider.max=cfg.max;slider.value=cfg.x;
 pick.innerHTML=cfg.targets.map(t=>`<option value="${t}"${t===cfg.target?' selected':''}>${cfg.name}(x) = ${fmt(t)}</option>`).join('');
 $('twoway-equation').textContent=cfg.formula;
 document.querySelectorAll('.twoway-name').forEach(el=>el.textContent=cfg.name);
 document.querySelectorAll('[data-twoway]').forEach(b=>{const on=b.dataset.twoway===mode;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
 const extra=document.querySelector('#formula-examples .ca-extra-calculation');if(extra)extra.hidden=mode!=='square';
 twoWay();
}
function twoWayRoot(){
 const workStep=(title,equation)=>`<li><span class="ca-step-label">${title}</span><span class="ca-step-math">${equation}</span></li>`;
 const x=+$('forward-x').value,t=+$('backward-y').value;
 $('forward-x-label').textContent=fmt(x);
 const doubled=2*x,rad=doubled+3,root=caSimplifyRoot(rad),approx=root.whole?'':` ≈ ${fmt(Number(root.value.toFixed(2)))}`;
 $('forward-result').textContent=`Answer: r(${fmt(x)}) = ${root.text}${approx}`;
 $('forward-steps').innerHTML=[
  workStep('1 · Substitute the input',`r(${fmt(x)}) = √(2(${fmt(x)}) + 3)`),
  workStep('2 · Multiply',`= √(${fmt(doubled)} + 3)`),
  workStep('3 · Add 3 under the root',`= √${fmt(rad)}`),
  workStep(root.whole?'4 · Take the square root':'4 · Keep the exact root (then estimate)',`= ${root.text}${approx}`)
 ].join('');
 if(t<0){
  const x0=(t*t-3)/2,back=2*x0+3;
  $('backward-result').textContent='Answer: no solution';
  $('backward-steps').innerHTML=[
   workStep('1 · Set the formula equal to the output',`√(2x + 3) = ${fmt(t)}`),
   workStep('2 · Look at the sign',`A square root is never negative, so no input can give ${fmt(t)}.`),
   workStep('3 · What if we square anyway?',`2x + 3 = (${fmt(t)})² = ${fmt(t*t)}, so x = ${fmt(x0)}`),
   workStep('4 · Check that answer',`r(${fmt(x0)}) = √${fmt(back)} = ${caSimplifyRoot(back).text}, not ${fmt(t)} ✗`)
  ].join('');
  $('two-way-explanation').textContent=`No input gives r(x) = ${fmt(t)}. Squaring both sides produced x = ${fmt(x0)}, but the check shows it does not work. Always check your answers after squaring both sides.`;
  return;
 }
 const sq=t*t,minus=sq-3,x0=minus/2;
 $('backward-result').textContent=`Answer: x = ${fmt(x0)}`;
 $('backward-steps').innerHTML=[
  workStep('1 · Set the formula equal to the output',`√(2x + 3) = ${fmt(t)}`),
  workStep('2 · Square both sides',`2x + 3 = (${fmt(t)})² = ${fmt(sq)}`),
  workStep('3 · Subtract 3 from both sides',`2x = ${fmt(sq)} − 3 = ${fmt(minus)}`),
  workStep('4 · Divide both sides by 2',`x = ${fmt(minus)} ÷ 2 = ${fmt(x0)}`),
  workStep('5 · Check the solution',`r(${fmt(x0)}) = √(2(${fmt(x0)}) + 3) = √${fmt(sq)} = ${fmt(t)} ✓`)
 ].join('');
 $('two-way-explanation').textContent=`Evaluating r(${fmt(x)}) uses one known input to find one output. Solving r(x) = ${fmt(t)} works backward and finds exactly one input. Squaring both sides can create answers that do not work, so always check.`;
}
function twoWay(){
 if(twoWayMode==='root'){twoWayRoot();return;}
 const x=+$('forward-x').value,t=+$('backward-y').value;
 const difference=x-2,squared=difference*difference,forward=squared+1;
 const rhs=t-1,shift=Math.sqrt(rhs),roots=[2-shift,2+shift].filter((v,i,arr)=>i===0||Math.abs(v-arr[0])>1e-10);
 const math=n=>String(n).replaceAll('-', '−');
 const workStep=(title,equation)=>`<li><span class="ca-step-label">${title}</span><span class="ca-step-math">${equation}</span></li>`;
 $('forward-x-label').textContent=fmt(x);
 $('forward-result').textContent=`Answer: q(${fmt(x)}) = ${fmt(forward)}`;
 $('forward-steps').innerHTML=[
   workStep('1 · Substitute the input',`q(${fmt(x)}) = (${fmt(x)} − 2)² + 1`),
   workStep('2 · Subtract inside the parentheses',`= (${fmt(difference)})² + 1`),
   workStep('3 · Square the result',`= ${fmt(squared)} + 1`),
   workStep('4 · Add 1',`= ${fmt(forward)}`)
 ].join('');
 $('backward-result').textContent=`Answer: ${roots.map(v=>`x = ${fmt(v)}`).join(' or ')}`;
 const subtractStep=workStep('2 · Subtract 1 from both sides',`(x − 2)² = ${fmt(t)} − 1 = ${fmt(rhs)}`);
 const rootStep=workStep('3 · Take both square roots',rhs===0?'x − 2 = √0 = 0':`x − 2 = ±√${fmt(rhs)} = ±${fmt(shift)}`);
 const splitStep=roots.length===1
   ?workStep('4 · Add 2 to both sides',`x = 0 + 2 = ${fmt(roots[0])}`)
   :workStep('4 · Add 2 to both sides (both cases)',`x = 2 − ${fmt(shift)} = ${fmt(roots[0])}<br>x = 2 + ${fmt(shift)} = ${fmt(roots[1])}`);
 const verify=roots.map(v=>`q(${fmt(v)}) = (${fmt(v)} − 2)² + 1 = ${fmt(t)}`).join('<br>');
 $('backward-steps').innerHTML=[
   workStep('1 · Set the formula equal to the output',`(x − 2)² + 1 = ${fmt(t)}`),
   subtractStep,rootStep,splitStep,
   workStep('5 · Check every solution',verify)
 ].join('');
 $('two-way-explanation').textContent=`Evaluating q(${fmt(x)}) uses one known input to find one output. Solving q(x) = ${fmt(t)} works backward to find ${roots.length===1?'the input':'all inputs'} with that output. Different inputs may share an output, and the relation is still a function.`;
}
document.querySelectorAll('[data-twoway]').forEach(b=>b.addEventListener('click',()=>twoWaySwitch(b.dataset.twoway)));$('forward-x').addEventListener('input',twoWay);$('backward-y').addEventListener('change',twoWay);twoWay();

const toolkitFunctions={identity:{f:x=>x,clue:'Every point satisfies y = x, so input and output are equal.'},constant:{f:x=>2,clue:'All inputs share the same output 2. This is still a function.'},square:{f:x=>x*x,clue:'The graph has a U shape, with a minimum at (0, 0).'},cube:{f:x=>x*x*x,clue:'An S-shaped curve passes through the origin and keeps increasing.'},absolute:{f:x=>Math.abs(x),clue:'A V shape: both −3 and 3 produce output 3.'},root:{f:x=>x>=0?Math.sqrt(x):NaN,clue:'The square-root graph starts at the origin; negative x-values are not real inputs.'},reciprocal:{f:x=>x===0?NaN:1/x,clue:'The reciprocal graph never touches either axis. x = 0 is excluded.'}};
function toolkitLab(name){const item=toolkitFunctions[name];plot($('toolkit-graph'),item.f,{xmin:-5,xmax:5,ymin:-5,ymax:5});$('toolkit-clue').textContent=item.clue;document.querySelectorAll('[data-toolkit]').forEach(b=>{let yes=b.dataset.toolkit===name;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});}
document.querySelectorAll('[data-toolkit]').forEach(button=>button.addEventListener('click',()=>toolkitLab(button.dataset.toolkit)));toolkitLab('identity');


CA.guided('31',[
 {
  "q": "For {(−4, 1), (2, 1), (2, 7)}, which set is the domain?",
  "opts": [
   "{−4, 2}",
   "{1, 7}",
   "{−4, 2, 2}"
  ],
  "correct": 0,
  "why": "Only the first coordinates belong to the domain. Write each distinct input once: {−4, 2}.",
  "hint": "Domain comes from the first coordinates only; do not list a repeated input twice."
 },
 {
  "q": "For {(−2, 6), (1, 4), (5, 6)}, what is the range?",
  "opts": [
   "{−2, 1, 5}",
   "{4, 6}",
   "{6, 4, 6}"
  ],
  "correct": 1,
  "why": "Collect the different outputs, 6 and 4, so the range is {4, 6}.",
  "hint": "Range comes from the second coordinates only; remove duplicate outputs."
 },
 {
  "q": "At the art club, Mia and Leo are assigned Studio North. Is member → studio a function?",
  "opts": [
   "No, North appears twice",
   "Yes, each member has one room",
   "No, different members must have different rooms"
  ],
  "correct": 1,
  "why": "Each member has exactly one room. Sharing an output is allowed.",
  "hint": "Does each member have just one room? Different members can share a room."
 },
 {
  "q": "Reverse the art-club assignment: studio → member. Is that a function when two members use Studio North?",
  "opts": [
   "Yes, because both people have a room",
   "No, North would have two different outputs",
   "Yes, because there are two inputs"
  ],
  "correct": 1,
  "why": "If the room is the input, Studio North would lead to two different people.",
  "hint": "After reversing, which quantity becomes the input? Can it lead to two people?"
 },
 {
  "q": "For the game-booth rule p(n) = 5n + 2, what does n represent?",
  "opts": [
   "The $2 entry fee",
   "The amount paid",
   "The number of games (input)"
  ],
  "correct": 2,
  "why": "n is the independent variable: number of games played. p(n) is the total cost.",
  "hint": "Look inside the parentheses; that is the independent variable."
 },
 {
  "q": "Use the game-booth rule p(n) = 5n + 2. Find p(4).",
  "opts": [
   "14",
   "22",
   "27"
  ],
  "correct": 1,
  "why": "p(4) = 5(4) + 2 = 22.",
  "hint": "Replace n by 4 in the game-booth rule and simplify."
 },
 {
  "q": "For q(x) = (x − 2)² + 1, solve q(x) = 5.",
  "opts": [
   "x = 0 or 4",
   "x = 2 only",
   "x = −4 or 0"
  ],
  "correct": 0,
  "why": "(x − 2)² = 4. Therefore x − 2 = ±2, so x = 0 or x = 4.",
  "hint": "Subtract 1, then take both square roots."
 },
 {
  "q": "The table lists t(−4)=3, t(−1)=6, t(2)=3, t(5)=8. Which inputs give output 3?",
  "opts": [
   "−1 and 5",
   "−4 and 2",
   "−4 only"
  ],
  "correct": 1,
  "why": "Inspect all table rows with output 3: inputs −4 and 2.",
  "hint": "Scan the outputs for 3, then collect every matching input."
 },
 {
  "q": "Which relation fails the vertical line test?",
  "opts": [
   "y = |x|",
   "x²/4 + y² = 1",
   "y = x + 2"
  ],
  "correct": 1,
  "why": "The ellipse has two different y-values when x = 0: y = 1 and y = −1.",
  "hint": "Imagine a vertical line at x = 0. How many points will it hit?"
 },
 {
  "q": "For g(x) = (x + 1)² − 1, solve g(x) = 3.",
  "opts": [
   "x = −1",
   "x = −3 or 1",
   "x = −2 or 0"
  ],
  "correct": 1,
  "why": "(x + 1)² = 4. Taking both square roots gives x + 1 = ±2, hence x = −3 or 1.",
  "hint": "Add 1 to both sides, then take positive and negative square roots."
 }
]);
})();

(()=>{
  'use strict';
  const assignments=[['Mia','Studio North'],['Leo','Studio North'],['Nora','Studio East']];
  const ns='http://www.w3.org/2000/svg';
  const cleanName=(str)=>str.replace(/[^a-zA-Z0-9]/g,'-').toLowerCase();
  function drawConnectors(map){
    if(!map || !map.classList.contains('ca-sets-diagram')) return;
    const svg=map.querySelector('.ca-sets-svg'),body=map.querySelector('.ca-sets-body');
    if(!svg||!body) return;
    const bounds=body.getBoundingClientRect();
    if(!bounds.width || !bounds.height) return;
    svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
    const reverse=map.classList.contains('reverse-map');
    const pairs=assignments.map(([p,r])=>reverse?[r,p]:[p,r]);
    let paths='';
    for(const [src,dst] of pairs){
      const a=map.querySelector(`[data-side="in"][data-name="${cleanName(src)}"]`);
      const b=map.querySelector(`[data-side="out"][data-name="${cleanName(dst)}"]`);
      if(!a || !b) continue;
      const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
      const x1=ar.right-bounds.left+1, x2=br.left-bounds.left-7;
      const y1=ar.top-bounds.top+ar.height/2, y2=br.top-bounds.top+br.height/2;
      const color=(reverse&&src==='Studio North')?'#d75943':'#267d9e';
      const marker=(reverse&&src==='Studio North')?'club-arrow-red':'club-arrow-blue';
      const dx=Math.max(8,(x2-x1)*.42);
      paths+=`<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1+dx).toFixed(1)} ${y1.toFixed(1)}, ${(x2-dx).toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${color}" stroke-width="${reverse&&src==='Studio North'?3.1:2.6}" fill="none" stroke-linecap="round" marker-end="url(#${marker})"/>`;
    }
    svg.innerHTML=`<defs><marker id="club-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#267d9e"/></marker><marker id="club-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#d75943"/></marker></defs>${paths}`;
  }
  function renderClubDiagram(){
    const map=document.getElementById('club-map'),flip=document.getElementById('club-flip');
    if(!map || !flip) return;
    // The page's original exercise owns the reverse button and feedback; we only redraw its diagram.
    const reverse=flip.textContent.trim().startsWith('Restore');
    const inputs=reverse?['Studio North','Studio East']:['Mia','Leo','Nora'];
    const outputs=reverse?['Mia','Leo','Nora']:['Studio North','Studio East'];
    const nodes=(list,side)=>list.map(name=>{
      const conflict=reverse&&side==='in'&&name==='Studio North';
      return `<span class="ca-sets-node${conflict?' multi-target':''}" data-side="${side}" data-name="${cleanName(name)}">${name}</span>`;
    }).join('');
    map.className='ca-story-map ca-sets-diagram'+(reverse?' reverse-map':'');
    map.removeAttribute('role');
    map.setAttribute('aria-label',reverse?'Mapping diagram: Studio North points to both Mia and Leo, and Studio East points to Nora. This is not a function.':'Mapping diagram: Mia and Leo both point to Studio North, and Nora points to Studio East. This is a function.');
    map.innerHTML=`<div class="ca-sets-headings"><span class="ca-sets-label">INPUTS<br>${reverse?'Rooms':'Members'}</span><span class="ca-sets-label output-label">OUTPUTS<br>${reverse?'Members':'Rooms'}</span></div><div class="ca-sets-body"><div class="ca-sets-column input-set">${nodes(inputs,'in')}</div><svg class="ca-sets-svg" focusable="false" aria-hidden="true"></svg><div class="ca-sets-column output-set">${nodes(outputs,'out')}</div></div><div class="ca-sets-caption"><span class="ca-sets-dot" aria-hidden="true"></span><span>${reverse?'<strong>Not a function:</strong> two arrows leave the same input, Studio North.':'<strong>Function:</strong> each member has one outgoing arrow. Multiple arrows may arrive at the same room.'}</span></div>`;
    drawConnectors(map);
  }
  function initialize(){
    const flip=document.getElementById('club-flip');
    if(!flip)return;
    // The original button handler runs first and updates the answer; this handler changes only the visualization.
    flip.addEventListener('click',renderClubDiagram);
    window.addEventListener('resize',()=>drawConnectors(document.getElementById('club-map')),{passive:true});
    if('ResizeObserver' in window){
      const observer=new ResizeObserver(()=>drawConnectors(document.getElementById('club-map')));
      observer.observe(document.getElementById('club-map'));
    }
    renderClubDiagram();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initialize,{once:true});
  else initialize();
})();


(()=>{'use strict';
 const points=[{name:'A',x:-4,y:3},{name:'B',x:-1,y:6},{name:'C',x:2,y:3},{name:'D',x:5,y:8}];
 const fmt=n=>String(n).replaceAll('-','−');
 const ns='http://www.w3.org/2000/svg';
 let selected=2,matches=[];
 const $=id=>document.getElementById(id);
 // Same scale on both axes: 33 SVG units represent one coordinate unit.
 const tx=x=>290+x*33,ty=y=>347-y*33;
 function draw(){
  const svg=$('ca-table-coordinate-plane');if(!svg)return;
  let parts=['<defs><marker id="ca-plot-axis-tip" markerWidth="7" markerHeight="7" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="var(--plot-axis)"/></marker></defs>'];
  for(let x=-6;x<=6;x++)parts.push(`<line x1="${tx(x)}" y1="17" x2="${tx(x)}" y2="413" stroke="var(--plot-grid)" stroke-width="1"/>`);
  for(let y=-2;y<=10;y++)parts.push(`<line x1="92" y1="${ty(y)}" x2="488" y2="${ty(y)}" stroke="var(--plot-grid)" stroke-width="1"/>`);
  parts.push(`<line x1="83" y1="347" x2="497" y2="347" stroke="var(--plot-axis)" stroke-width="2.2" marker-end="url(#ca-plot-axis-tip)"/><line x1="290" y1="421" x2="290" y2="9" stroke="var(--plot-axis)" stroke-width="2.2" marker-end="url(#ca-plot-axis-tip)"/>`);
  for(let x=-6;x<=6;x+=2)parts.push(`<text x="${tx(x)}" y="370" font-size="14" fill="var(--plot-text)" text-anchor="middle">${fmt(x)}</text>`);
  for(let y=-2;y<=10;y+=2){if(y!==0)parts.push(`<text x="279" y="${ty(y)+5}" font-size="14" fill="var(--plot-text)" text-anchor="end">${fmt(y)}</text>`);}
  parts.push('<text x="505" y="354" font-size="20" font-style="italic" fill="var(--plot-axis)">x</text><text x="300" y="19" font-size="20" font-style="italic" fill="var(--plot-axis)">y</text>');
  for(let i=0;i<points.length;i++){
   const p=points[i],isSelected=selected===i,isMatch=matches.includes(i),x=tx(p.x),y=ty(p.y);
   let lx=x+12,ly=y-13;
   if(p.x===5)lx=x-22;
   parts.push(`<g class="ca-plot-point${isSelected?' ca-selected':''}${isMatch?' ca-output-match':''}" role="button" tabindex="0" focusable="true" data-point-index="${i}" aria-label="Select point ${p.name}, ${fmt(p.x)} comma ${fmt(p.y)}"><title>Point ${p.name}: (${fmt(p.x)}, ${fmt(p.y)})</title><circle cx="${x}" cy="${y}" r="22" fill="transparent"/><circle class="ca-point-halo" cx="${x}" cy="${y}" r="16" stroke-width="2.6"/><circle class="ca-point-marker" cx="${x}" cy="${y}" r="${isSelected?8:6.5}"/><text x="${lx}" y="${ly}">${p.name}</text></g>`);
  }
  svg.innerHTML=parts.join('');
 }
 function sync(){
  const p=points[selected];
  document.querySelectorAll('#pairs-table tr').forEach((row,i)=>{
   row.classList.toggle('selected',i===selected);row.classList.toggle('ca-output-match',matches.includes(i));row.setAttribute('aria-pressed',String(i===selected));
  });
  const pair=$('ca-table-selected-pair');pair.innerHTML=`<span>Selected ordered pair:</span> <strong>${p.name} = (${fmt(p.x)}, ${fmt(p.y)})</strong>`;
  draw();
 }
 function choose(i){
  if(!Number.isInteger(i)||i<0||i>=points.length)return;
  selected=i;matches=[];sync();
  $('lookup-result').textContent=`Point ${points[i].name} corresponds to the ordered pair (${fmt(points[i].x)}, ${fmt(points[i].y)}).`;
 }
 function search(){
  const y=Number($('lookup-y').value);matches=points.flatMap((p,i)=>p.y===y?[i]:[]);
  sync();
  const res=$('lookup-result');
  if(matches.length){
   const xs=matches.map(i=>`x = ${fmt(points[i].x)}`),names=matches.map(i=>points[i].name);
   const phrase=xs.length===1?xs[0]:xs.join(' and ');
   res.innerHTML=`<strong>For t(x) = ${fmt(y)}, the matching input${xs.length===1?' is':'s are'} ${phrase}.</strong> These correspond to point${names.length===1?'':'s'} ${names.join(' and ')} on the coordinate plane.`;
  }else res.textContent=`No input in the table produces output ${fmt(y)}. None of the plotted points has y-coordinate ${fmt(y)}.`;
 }
 function init(){
  const tbody=$('pairs-table'),svg=$('ca-table-coordinate-plane'),btn=$('lookup-btn');if(!tbody||!svg||!btn)return;
  // The existing course script manages the other activities; this module only enhances Section 08.
  tbody.addEventListener('click',e=>{const row=e.target.closest('tr[data-x]');if(row)choose([...tbody.rows].indexOf(row));});
  tbody.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const row=e.target.closest('tr[data-x]');if(row){e.preventDefault();choose([...tbody.rows].indexOf(row));}});
  svg.addEventListener('click',e=>{const g=e.target.closest('g[data-point-index]');if(g)choose(Number(g.dataset.pointIndex));});
  svg.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const g=e.target.closest('g[data-point-index]');if(g){e.preventDefault();choose(Number(g.dataset.pointIndex));}});
  btn.addEventListener('click',search);
  $('lookup-y').addEventListener('change',()=>{matches=[];sync();$('lookup-result').textContent='Select “Find every input” to highlight all points with this output.';});
  sync();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();


(()=>{'use strict';
/* November 2026 enhancements: letters as inputs, solve-for-y, naming drill,
   predict-first cards, linkable Course Foundations. */
const $=id=>document.getElementById(id),fmt=v=>String(v).replaceAll('-','−');
const num=v=>fmt(Number(Number(v).toFixed(2)));
function rootText(n){ // simplest radical form of √n for a positive integer n
 let outside=1,inside=n;
 for(let f=2;f*f<=inside;f++){while(inside%(f*f)===0){inside/=f*f;outside*=f;}}
 return inside===1?fmt(outside):`${outside===1?'':fmt(outside)}√${inside}`;
}

/* ---------- 07 · Letters as inputs: exact symbolic substitution into ax² + bx + c ---------- */
const VARS=['t','x','h'],SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';
const keyOf=m=>VARS.map(v=>m[v]||0).join(',');
const clean=p=>{for(const [k,c] of p)if(c===0)p.delete(k);return p;};
const poly=terms=>{const p=new Map();for(const [c,m] of terms){const k=keyOf(m);p.set(k,(p.get(k)||0)+c);}return clean(p);};
const add=(...ps)=>{const out=new Map();for(const p of ps)for(const [k,c] of p)out.set(k,(out.get(k)||0)+c);return clean(out);};
const mul=(p,q)=>{const out=new Map();for(const [k1,c1] of p)for(const [k2,c2] of q){const e2=k2.split(',').map(Number),k=k1.split(',').map((e,i)=>Number(e)+e2[i]).join(',');out.set(k,(out.get(k)||0)+c1*c2);}return clean(out);};
const scale=(p,s)=>clean(new Map([...p].map(([k,c])=>[k,c*s])));
const sup=n=>n===1?'':String(n).split('').map(d=>SUP[d]).join('');
function show(p){
 if(!p.size)return '0';
 const terms=[...p].map(([k,c])=>({e:k.split(',').map(Number),c})).sort((A,B)=>{
  const dA=A.e.reduce((s,v)=>s+v,0),dB=B.e.reduce((s,v)=>s+v,0);if(dA!==dB)return dB-dA;
  for(let i=0;i<A.e.length;i++)if(A.e[i]!==B.e[i])return B.e[i]-A.e[i];return 0;});
 return terms.map(({e,c},i)=>{const vars=e.map((n,j)=>n?VARS[j]+sup(n):'').join(''),mag=Math.abs(c);
  const body=vars?(mag===1?'':mag)+vars:String(mag);return (c<0?(i?' − ':'−'):(i?' + ':''))+body;}).join('');
}
const joinSigned=parts=>parts.filter(p=>p.size).map(show).reduce((acc,s,i)=>i===0?s:acc+(s.startsWith('−')?' − '+s.slice(1):' + '+s),'')||'0';
const symbolicInputs={
 't':{label:'t',p:poly([[1,{t:1}]])},
 't+1':{label:'t + 1',p:poly([[1,{t:1}],[1,{}]])},
 '-x':{label:'−x',p:poly([[-1,{x:1}]])},
 '2t':{label:'2t',p:poly([[2,{t:1}]])},
 't+h':{label:'t + h',p:poly([[1,{t:1}],[1,{h:1}]])}
};
function symbolic(){
 if(!$('symbolic-input'))return;
 const A=+$('coeff-a').value,B=+$('coeff-b').value,C=+$('coeff-c').value,choice=$('symbolic-input').value,{label,p:u}=symbolicInputs[choice];
 const f=w=>add(scale(mul(w,w),A),scale(w,B),poly([[C,{}]]));
 const sq=mul(u,u),termA=scale(sq,A),termB=scale(u,B),termC=poly([[C,{}]]),result=add(termA,termB,termC);
 const step=(title,math)=>`<li><span class="ca-step-label">${title}</span><span class="ca-step-math">${math}</span></li>`;
 const joined=joinSigned([termA,termB,termC]),final=show(result);
 $('symbolic-expression').textContent=`f(x) = ${show(f(poly([[1,{x:1}]])))}`;
 $('symbolic-steps').innerHTML=[
  step(`1 · Replace every x with (${label})`,`f(${label}) = (${fmt(A)})(${label})² + (${fmt(B)})(${label}) + (${fmt(C)})`),
  step('2 · Square the input',`(${label})² = ${show(sq)}`),
  step('3 · Multiply by the coefficients',`(${fmt(A)})(${show(sq)}) = ${show(termA)}<br>(${fmt(B)})(${label}) = ${show(termB)}`),
  step('4 · Combine like terms',joined===final?`= ${final}`:`= ${joined}<br>= ${final}`)
 ].join('');
 $('symbolic-result').textContent=`Answer: f(${label}) = ${final}`;
 let compare='';
 if(choice==='t+1'){const ft=f(poly([[1,{t:1}]])),plus=add(ft,poly([[1,{}]])),same=show(plus)===final;
  compare=`<b>Compare:</b> f(t) + 1 = (${show(ft)}) + 1 = ${show(plus)}. ${same?'With these coefficients the two happen to match, but usually they do not.':`That is <b>not</b> the same as f(t + 1) = ${final}. Adding 1 to the <i>input</i> is different from adding 1 to the <i>output</i>.`}`;}
 else if(choice==='-x'){const fx=f(poly([[1,{x:1}]]));compare=`<b>Compare:</b> −f(x) = −(${show(fx)}) = ${show(scale(fx,-1))}. f(−x) changes the sign of the <i>input</i>; −f(x) changes the sign of the <i>output</i>.`;}
 else if(choice==='2t'){const ft=f(poly([[1,{t:1}]]));compare=`<b>Compare:</b> 2·f(t) = 2(${show(ft)}) = ${show(scale(ft,2))}. Doubling the input is different from doubling the output.`;}
 else if(choice==='t'){compare='f(t) is the same rule written with a different letter. The function has not changed; only the name of the input has. Writing f(a) works in exactly the same way.';}
 else compare='Expressions like f(t + h) come back later in the course, when you study average rates of change.';
 $('symbolic-compare').innerHTML=compare;
}
['coeff-a','coeff-b','coeff-c','symbolic-input'].forEach(id=>$(id)?.addEventListener('input',symbolic));symbolic();

/* ---------- 05 · Solve for y beside the vertical line test ---------- */
function vlineSolve(){
 if(!$('vline-solve'))return;
 const type=$('curve-type').value,xi=Math.round(+$('scan-x').value*10),xs=fmt(xi/10);
 let html='';
 if(type==='parabola'){html=`<b>Solve for y:</b> y = x²/4. At x = ${xs}: y = (${xs})²/4 = ${num(xi*xi/400)}. <b>One output</b> for this input.`;}
 else if(type==='cubic'){const y=xi**3/9000,exact=Math.abs(y*100-Math.round(y*100))<1e-9;html=`<b>Solve for y:</b> y = x³/9. At x = ${xs}: y = (${xs})³/9 ${exact?'=':'≈'} ${num(y)}. <b>One output</b> for this input.`;}
 else if(type==='circle'){
  const r100=900-xi*xi,head='<b>Solve for y:</b> x² + y² = 9, so y² = 9 − x² and y = ±√(9 − x²).';
  if(r100<0)html=`${head} At x = ${xs}: 9 − x² = ${num(r100/100)}, which is negative, so there is <b>no real y</b>. This vertical line misses the circle.`;
  else if(r100===0)html=`${head} At x = ${xs}: y = ±√0 = 0, a single point. Other x-values give two outputs.`;
  else{const exact=xi%10===0?rootText(r100/100):`√${num(r100/100)}`,hasRoot=exact.includes('√');
   html=`${head} At x = ${xs}: y = ±${exact}${hasRoot?` ≈ ±${num(Math.sqrt(r100/100))}`:''}. The <b>±</b> gives <b>two outputs</b> for one input, so y is not a function of x.`;}
 }else{
  const head='<b>Solve for y:</b> x = y², so y = ±√x.';
  if(xi<0)html=`${head} At x = ${xs}: √x is not a real number, so there is <b>no real y</b>. This vertical line misses the graph.`;
  else if(xi===0)html=`${head} At x = 0: y = 0, a single point. Other x-values give two outputs.`;
  else{const exact=xi%10===0?rootText(xi/10):`√${xs}`,hasRoot=exact.includes('√');
   html=`${head} At x = ${xs}: y = ±${exact}${hasRoot?` ≈ ±${num(Math.sqrt(xi/10))}`:''}. The <b>±</b> gives <b>two outputs</b> for one input, so y is not a function of x.`;}
 }
 $('vline-solve').innerHTML=html;
}
['curve-type','scan-x'].forEach(id=>$(id)?.addEventListener('input',vlineSolve));vlineSolve();

/* ---------- 03 · Name the parts of function notation ---------- */
(function nameDrill(){
 const rowsBox=$('name-drill-rows');if(!rowsBox)return;
 const pool='abdmnpqrstuvwyz'.split('');let drill={out:'s',name:'v',inp:'t'},answers={};
 const rows=()=>[['name','Name of the function',drill.name],['input','Input · independent variable',drill.inp],['output','Output · dependent variable',drill.out]];
 function render(){
  $('name-drill-equation').textContent=`${drill.out} = ${drill.name}(${drill.inp})`;
  const letters=[drill.out,drill.name,drill.inp].sort();
  rowsBox.innerHTML=rows().map(([k,label])=>`<div class="ca-name-row" data-row="${k}"><span class="ca-name-label">${label}</span><div class="ca-choice-row" role="group" aria-label="${label}">${letters.map(l=>`<button type="button" class="ca-choice" data-letter="${l}" aria-pressed="false">${l}</button>`).join('')}</div><span class="ca-name-mark" aria-hidden="true"></span></div>`).join('');
  answers={};update();
 }
 function update(){
  let right=0,done=0;
  for(const [k,,ans] of rows()){
   const row=rowsBox.querySelector(`[data-row="${k}"]`),pick=answers[k];
   row.querySelectorAll('button').forEach(b=>{const on=b.dataset.letter===pick;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));});
   row.classList.toggle('ca-row-correct',pick===ans);row.classList.toggle('ca-row-wrong',!!pick&&pick!==ans);
   row.querySelector('.ca-name-mark').textContent=pick?(pick===ans?'✓':'✕'):'';
   if(pick){done++;if(pick===ans)right++;}
  }
  const fb=$('name-drill-feedback'),{out,name,inp}=drill;
  fb.className='ca-feedback'+(done===3?(right===3?' ca-correct':' ca-incorrect'):'');
  fb.innerHTML=done<3?'Pick a letter in each row.':right===3
   ?`✓ All correct. <b>${out} = ${name}(${inp})</b> reads “${out} is a function of ${inp}.” <b>${name}</b> is the name, <b>${inp}</b> is the input (independent variable), and <b>${out}</b> — also written ${name}(${inp}) — is the output (dependent variable).`
   :`${right} of 3 correct. Hint: the letter <b>in front of</b> the parentheses is the name, the letter <b>inside</b> them is the input, and the letter <b>alone</b> on the other side of “=” is the output.`;
 }
 rowsBox.addEventListener('click',e=>{const b=e.target.closest('button[data-letter]');if(!b)return;answers[b.closest('[data-row]').dataset.row]=b.dataset.letter;update();});
 $('name-drill-next').addEventListener('click',()=>{
  let pick;do{const bag=[...pool];pick=[0,1,2].map(()=>bag.splice(Math.floor(Math.random()*bag.length),1)[0]);}while(pick.join()===[drill.out,drill.name,drill.inp].join());
  drill={out:pick[0],name:pick[1],inp:pick[2]};render();$('name-drill-rows').querySelector('button')?.focus();
 });
 render();
})();

})();
