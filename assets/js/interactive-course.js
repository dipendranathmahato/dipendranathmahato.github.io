/* Shared interactive course engine (v1). No analytics or third-party state.
   Load once per page after or with defer, along with interactive-course.css.
   Features are opt-in by their markup: quizzes, weighted grades, mapping,
   number line, function plot, piecewise plot, and vertical line test.
   Hard-coded demo equations are specific reusable *examples*, not a
   general-purpose mathematics plotting engine. */
(() => {
'use strict';
document.querySelectorAll('.calc-learning').forEach(root => {
const $ = s => root.querySelector(s);
const safe = x => Number.isFinite(x)?String(Number(x.toFixed(2))): 'undefined';
// Reusable input/output mapping diagram
const map=$('#calc-mapping'),mapButtons=[...root.querySelectorAll('[data-map-mode]')],mapText=$('#calc-mapping-feedback');
function paintMapping(invalid=false){
 if(!map||!mapText)return;
 const xs=[45,95,145],ys=[46,95,145],xsR=[38,87,136];
 const curves=[[0,1],[1,2],[2,2],...(invalid?[[1,0]]:[])];
 const paths=curves.map(([a,b],i)=>`<path d="M 192 ${ys[a]} C 273 ${ys[a]}, 341 ${ys[b]}, 420 ${ys[b]}" fill="none" stroke="${invalid&&i===3?'#be5c2c':'#16845e'}" stroke-width="${invalid&&i===3?3:2.7}" marker-end="url(#calc-arrow)"/>`).join('');
 map.innerHTML=`<defs><marker id="calc-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1 L7 4 L1 7" fill="none" stroke="#16845e" stroke-width="1.5"/></marker></defs>
 <rect x="40" y="16" width="195" height="178" rx="72" fill="#e7f3ee" stroke="#85b4a2" stroke-width="2"/><rect x="382" y="16" width="190" height="178" rx="72" fill="#eff5fb" stroke="#93b6d2" stroke-width="2"/>
 <text x="125" y="16" fill="#14583f" font-size="13" font-weight="bold">DOMAIN</text><text x="440" y="16" fill="#195280" font-size="13" font-weight="bold">CODOMAIN</text>
 ${paths}${xs.map((y,i)=>`<circle cx="151" cy="${ys[i]}" r="16" fill="#fff" stroke="#578e73"/><text x="151" y="${ys[i]+5}" text-anchor="middle" font-size="14" fill="#1c4838">${i+1}</text>`).join('')}
 ${xsR.map((y,i)=>`<circle cx="483" cy="${y}" r="16" fill="#fff" stroke="#6699bd"/><text x="483" y="${y+5}" text-anchor="middle" font-size="14" fill="#1c4838">${[2,4,6][i]}</text>`).join('')}`;
 mapText.textContent=invalid?'Not a function: input 2 is assigned two outputs (2 and 6). A single input must never have two outputs.':'A valid function: inputs 2 and 3 both lead to output 6. Sharing an output is allowed; leaving a codomain value unused is also allowed.';
 mapButtons.forEach(b=>{const yes=(b.dataset.mapMode==='not-function')===invalid;b.classList.toggle('is-selected',yes);b.setAttribute('aria-pressed',String(yes))});
}
mapButtons.forEach(b=>b.addEventListener('click',()=>paintMapping(b.dataset.mapMode==='not-function')));paintMapping();
// Interval visual, open/closed endpoints
const interval=$('#calc-interval-svg'),l=$('#calc-include-left'),r=$('#calc-include-right'),intervalOut=$('#calc-interval-feedback');
function paintInterval(){if(!interval||!l||!r||!intervalOut)return;const L=l.checked,R=r.checked;
 interval.innerHTML=`<line x1="44" y1="55" x2="516" y2="55" stroke="#769b8a" stroke-width="2"/><path d="M46 49 L38 55 L46 61 M508 49 L516 55 L508 61" fill="none" stroke="#769b8a" stroke-width="2"/><line x1="165" y1="55" x2="400" y2="55" stroke="#058659" stroke-width="8" stroke-linecap="round"/><circle cx="165" cy="55" r="10" fill="${L?'#058659':'white'}" stroke="#058659" stroke-width="3"/><circle cx="400" cy="55" r="10" fill="${R?'#058659':'white'}" stroke="#058659" stroke-width="3"/><text x="165" y="91" text-anchor="middle" font-size="16" fill="currentColor">1</text><text x="400" y="91" text-anchor="middle" font-size="16" fill="currentColor">5</text>`;
 intervalOut.textContent=`Interval ${L?'[':'('}1, 5${R?']':')'} — ${L?'includes':'excludes'} 1 and ${R?'includes':'excludes'} 5.`;}
[l,r].forEach(x=>x?.addEventListener('change',paintInterval));paintInterval();
// Grades: validation and weighted average; not official grade
const gradeInputs=[...root.querySelectorAll('#calc-grade-calculator input')],gradeResult=$('#calc-grade-result');
function grade(){if(!gradeResult)return;if(!gradeInputs.length)return;const vals=gradeInputs.map(input=>Number(input.value));if(vals.some((v,i)=>gradeInputs[i].value===''||!Number.isFinite(v)||v<0||v>100)){gradeResult.textContent='Enter scores between 0 and 100 for all categories.';return}const total=vals.reduce((sum,v,i)=>sum+v*Number(gradeInputs[i].dataset.weight)/100,0);gradeResult.textContent=`Estimated overall course grade: ${total.toFixed(2)}%`}
gradeInputs.forEach(x=>x.addEventListener('input',grade));grade();
// Device-pixel-ratio canvas preparation
function canvasContext(canvas){if(!canvas)return null;const dpr=Math.min(window.devicePixelRatio||1,2),w=canvas.width,h=canvas.height;const ctx=canvas.getContext('2d');if(!ctx)return null;canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);return {ctx,w,h};}
function axis(ctx,w,h,box){const {left,top,right,bottom}=box;ctx.strokeStyle='#dce8e1';ctx.lineWidth=1;ctx.font='12px system-ui';ctx.fillStyle='#667b70';for(let x=Math.ceil(left);x<=right;x++){const [px]=transform(x,0,w,h,box);ctx.beginPath();ctx.moveTo(px,14);ctx.lineTo(px,h-27);ctx.stroke();if(x%2===0)ctx.fillText(x.toString(),px-4,h-7)}for(let y=Math.ceil(bottom);y<=top;y+=2){const [,py]=transform(0,y,w,h,box);ctx.beginPath();ctx.moveTo(35,py);ctx.lineTo(w-14,py);ctx.stroke();ctx.fillText(y.toString(),6,py+4)}const [zeroX,zeroY]=transform(0,0,w,h,box);ctx.strokeStyle='#486c5a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(zeroX,14);ctx.lineTo(zeroX,h-27);ctx.moveTo(35,zeroY);ctx.lineTo(w-14,zeroY);ctx.stroke();}
function transform(x,y,w,h,b){return [35+(x-b.left)/(b.right-b.left)*(w-49),14+(b.top-y)/(b.top-b.bottom)*(h-41)]}
function line(ctx,w,h,b,fn,color,min,max,step=.023){ctx.beginPath();let started=false;ctx.lineWidth=3;ctx.strokeStyle=color;for(let x=min;x<=max;x+=step){const y=fn(x);if(!Number.isFinite(y)||y>b.top+1||y<b.bottom-1){started=false;continue}const [px,py]=transform(x,y,w,h,b);if(!started){ctx.moveTo(px,py);started=true}else ctx.lineTo(px,py)}ctx.stroke()}
function mark(ctx,x,y,w,h,b,color,filled=true){const [px,py]=transform(x,y,w,h,b);ctx.beginPath();ctx.arc(px,py,6,0,Math.PI*2);ctx.fillStyle=filled?color:'#fff';ctx.strokeStyle=color;ctx.lineWidth=3;ctx.fill();ctx.stroke()}
const graph=$('#calc-graph'),graphctx=canvasContext(graph),sx=$('#calc-point-x'),so=$('#calc-point-output'),showF=$('#calc-show-f'),showG=$('#calc-show-g');
function drawGraph(){if(!graphctx||!sx||!so||!showF||!showG)return;const {ctx,w,h}=graphctx,b={left:-6,right:6,top:15,bottom:-5};ctx.clearRect(0,0,w,h);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);axis(ctx,w,h,b);if(showF.checked)line(ctx,w,h,b,x=>x*x-4,'#d05e42',-6,6);if(showG.checked){line(ctx,w,h,b,x=>Math.sqrt(x*x-4),'#155ac5',-6,-2);line(ctx,w,h,b,x=>Math.sqrt(x*x-4),'#155ac5',2,6)}const x=Number(sx.value);const f=x*x-4,rad=x*x-4; if(showF.checked&&f<=b.top){}else if(showF.checked)mark(ctx,x,f,w,h,b,'#d05e42');if(showG.checked&&rad>=0)mark(ctx,x,Math.sqrt(rad),w,h,b,'#155ac5');const [px]=transform(x,0,w,h,b);ctx.strokeStyle='#c7931d';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(px,14);ctx.lineTo(px,h-27);ctx.stroke();ctx.setLineDash([]);so.textContent=`x = ${safe(x)} | f(x) = ${safe(f)} | g(x) = ${rad>=0?safe(Math.sqrt(rad)):'not real'}`}
[sx,showF,showG].forEach(x=>x?.addEventListener('input',drawGraph));drawGraph();
const piece=$('#calc-piecewise-graph'),piec=canvasContext(piece),ps=$('#calc-piecewise-x'),pf=$('#calc-piecewise-feedback');
function drawPiece(){if(!piec||!ps||!pf)return;const {ctx,w,h}=piec,b={left:0,right:7,top:22,bottom:-8};ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);axis(ctx,w,h,b);line(ctx,w,h,b,x=>-x,'#d05e42',0,4);line(ctx,w,h,b,x=>x*x,'#155ac5',4,Math.sqrt(b.top));mark(ctx,4,-4,w,h,b,'#d05e42',false);mark(ctx,4,16,w,h,b,'#155ac5',false);mark(ctx,4,0,w,h,b,'#16845e',true);const x=Number(ps.value),y=x<4?-x:x===4?0:x*x;const branch=x<4?'−x (x < 4)':x===4?'0 (x = 4)':'x² (x > 4)';if(y<=b.top&&y>=b.bottom)mark(ctx,x,y,w,h,b,'#efaa1a');pf.textContent=`h(${safe(x)}) = ${safe(y)} · Rule: ${branch}`}
ps?.addEventListener('input',drawPiece);drawPiece();
// Multiple-choice feedback: reveal targeted reasoning for each selected option
const quizzes=[...root.querySelectorAll('.calc-quiz[data-answer]')];const score=$('#calc-score');
function tally(){let done=quizzes.filter(q=>q.dataset.correct==='true').length;let answered=quizzes.filter(q=>q.dataset.attempted==='true').length;if(score)score.textContent=`${done} of ${quizzes.length} checkpoints correct · ${answered} attempted`;}
quizzes.forEach(q=>{let feedback={};try{feedback=JSON.parse(q.dataset.feedback)}catch{}q.querySelectorAll('button[data-option]').forEach(btn=>btn.addEventListener('click',()=>{const correct=btn.dataset.option===q.dataset.answer;q.dataset.attempted='true';q.dataset.correct=correct?'true':'false';q.querySelectorAll('button[data-option]').forEach(b=>{b.classList.remove('is-correct','is-wrong');b.setAttribute('aria-pressed',String(b===btn))});btn.classList.add(correct?'is-correct':'is-wrong');const target=q.querySelector('.calc-quiz-feedback');if(!target)return;target.classList.toggle('is-incorrect',!correct);target.textContent=(correct?'✓ ':'Not quite. ')+(feedback[btn.dataset.option]||'Review the explanation above and try again.')+(correct?'':' How to reason it through: '+(q.dataset.explanation||''));tally()}))});tally();

// Vertical line test visualization (parabola vs. circle)
const verticalSvg=$('#calc-vertical-svg'),verticalX=$('#calc-vertical-x'),verticalOut=$('#calc-vertical-x-value'),verticalResult=$('#calc-vertical-result'),verticalButtons=[...root.querySelectorAll('[data-vertical-mode]')];
let verticalMode='parabola';
function drawVertical(){
 if(!verticalSvg||!verticalX||!verticalOut||!verticalResult)return;
 const x=Number(verticalX.value),mode=verticalMode;
 const sx=u=>320+u*76, sy=v=>158-v*43;
 const axis=`<line x1="30" x2="610" y1="158" y2="158" stroke="#839c8f" stroke-width="1.5"/><line x1="320" x2="320" y1="14" y2="305" stroke="#839c8f" stroke-width="1.5"/><text x="594" y="149" font-size="14" fill="#4c6a59">x</text><text x="329" y="22" font-size="14" fill="#4c6a59">y</text>`;
 let curve='',hits=[];
 if(mode==='parabola'){
  const d=[];for(let u=-2.4;u<=2.4;u+=.035){let v=.48*u*u-1.45;if(v>3.2)continue;d.push(`${d.length?'L':'M'}${sx(u).toFixed(1)} ${sy(v).toFixed(1)}`)}
  curve=`<path d="${d.join(' ')}" fill="none" stroke="#087450" stroke-width="4" stroke-linecap="round"/>`;
  const v=.48*x*x-1.45;if(v<=3.2&&v>=-3.3)hits=[[x,v]];
 } else {
  curve=`<circle cx="320" cy="158" r="90" fill="none" stroke="#087450" stroke-width="4"/>`;
  const rad=90/76; if(Math.abs(x)<rad-1e-7){const v=Math.sqrt(rad*rad-x*x)*76/43;hits=[[x,v],[x,-v]]}else if(Math.abs(x-rad)<.015||Math.abs(x+rad)<.015){hits=[[x,0]]}
 }
 const marker=hits.map(([a,b])=>`<circle cx="${sx(a).toFixed(1)}" cy="${sy(b).toFixed(1)}" r="6.2" fill="#f5ac35" stroke="#895c15" stroke-width="2"/>`).join('');
 verticalSvg.innerHTML=`${axis}${curve}<line x1="${sx(x)}" x2="${sx(x)}" y1="14" y2="305" stroke="#e47436" stroke-width="3" stroke-dasharray="9 6"/>${marker}<text x="38" y="35" font-size="14" fill="#16563f" font-weight="bold">${mode==='parabola'?'y = 0.48x² − 1.45':'x² + y² = 1.40'}</text>`;
 verticalOut.textContent=x.toFixed(1).replace(/\\.0$/,'');
 const count=hits.length;
 verticalResult.innerHTML=`<strong>${count} ${count===1?'intersection':'intersections'} at x = ${x.toFixed(1)}.</strong> ${mode==='parabola'?'This parabola is the graph of a function because no vertical line has more than one intersection.':count===2?'The circle fails the vertical line test: one input corresponds to two different y-values.':'A circle is still not a function of x: other vertical lines cross it twice.'}`;
 verticalButtons.forEach(b=>{const sel=b.dataset.verticalMode===verticalMode;b.classList.toggle('is-selected',sel);b.setAttribute('aria-pressed',String(sel))});
}
verticalX?.addEventListener('input',drawVertical);
verticalButtons.forEach(b=>b.addEventListener('click',()=>{verticalMode=b.dataset.verticalMode;drawVertical()}));drawVertical();
});
})();
