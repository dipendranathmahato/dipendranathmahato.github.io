/* Section 3.2 · Domain and Range — interactive activities */

(()=>{'use strict';const $=id=>document.getElementById(id),fmt=v=>String(v).replaceAll('-', '−');function plot(svg,fn,win={},owner){const P=CA.plane(svg,Object.assign({xmin:-6,xmax:6,ymin:-5,ymax:5,w:560,h:330},win));P.curve(fn,{color:'orange',width:3});P.render();if(owner)svg._caRedraw=owner;const o=P.o,clipId=P.id+'-clip';return{tx:x=>P.tx(x),ty:y=>P.ty(y),T:P.T,B:P.B,L:P.L,R:P.R,win:{xmin:o.xmin,xmax:o.xmax,ymin:o.ymin,ymax:o.ymax},clip:html=>`<g clip-path="url(#${clipId})">${html}</g>`};}
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
 const isUnion=caIntervalMode==='union';$('union-builder').hidden=!isUnion;document.querySelector('#intervals .ca-interval-controls').hidden=isUnion;
 if(isUnion){document.querySelectorAll('#interval-presets button').forEach(btn=>btn.classList.toggle('active',btn.dataset.kind==='union'));caRenderUnion();return;}
 const li=$('int-left'),ri=$('int-right'),a=Number(li.value),b=Number(ri.value),lc=$('left-closed').checked,rc=$('right-closed').checked;
 if(li.value===''||ri.value===''||!Number.isFinite(a)||!Number.isFinite(b)||a<-10||a>10||b<-10||b>10||(caIntervalMode==='finite'&&a>=b)){$('interval-answer').textContent='Choose a < b between −10 and 10.';$('interval-inequality').textContent='—';$('interval-setbuilder').textContent='—';$('interval-text').textContent='Adjust the boundaries to continue.';$('interval-svg').innerHTML='';return;}
 const m=caIntervalMode;let segments=[],ineq='',interval='';
 if(m==='leftopen'||m==='leftinclusive'){const incl=m==='leftinclusive';segments=[{a:null,b,ac:false,bc:incl}];ineq=`x ${incl?'≤':'<'} ${caNum(b)}`;interval=`(−∞, ${caNum(b)}${incl?']':')'}`;}
 else if(m==='rightopen'||m==='rightinclusive'){const incl=m==='rightinclusive';segments=[{a,b:null,ac:incl,bc:false}];ineq=`x ${incl?'≥':'>'} ${caNum(a)}`;interval=`${incl?'[':'('}${caNum(a)}, ∞)`;}
 else if(m==='all'){segments=[{a:null,b:null}];ineq='x ∈ ℝ';interval='(−∞, ∞)';}
 else{segments=[{a,b,ac:lc,bc:rc}];ineq=`${caNum(a)} ${lc?'≤':'<'} x ${rc?'≤':'<'} ${caNum(b)}`;interval=`${lc?'[':'('}${caNum(a)}, ${caNum(b)}${rc?']':')'}`;}
 caAxisNumberLine($('interval-svg'),{segments});$('interval-answer').textContent=interval;$('interval-inequality').textContent=ineq;
 $('interval-setbuilder').textContent=ineq==='x ∈ ℝ'?'{x ∈ ℝ}':`{x ∈ ℝ | ${ineq}}`;
 $('interval-text').innerHTML=`<b>Read the drawing:</b> orange marks are included in the set; a <b>filled dot</b> includes an endpoint, while a <b>hollow dot</b> excludes it. ${m==='all'?'Every real x is allowed.':segments[0].a===null||segments[0].b===null?'The arrow continues without a finite endpoint.':'Move either boundary to see the interval change.'}`;
 $('left-closed').disabled=m==='all'||m==='leftopen'||m==='leftinclusive';$('right-closed').disabled=m==='all'||m==='rightopen'||m==='rightinclusive';
 document.querySelectorAll('#interval-presets button').forEach(btn=>btn.classList.toggle('active',btn.dataset.kind===(m==='finite'?(lc?(rc?'closed':'leftclosed'):(rc?'rightclosed':'open')):m)));
}
document.querySelectorAll('#interval-presets button').forEach(btn=>btn.addEventListener('click',()=>{const m=btn.dataset.kind;caIntervalMode=['open','closed','leftclosed','rightclosed'].includes(m)?'finite':m;const opts={open:[false,false],closed:[true,true],leftclosed:[true,false],rightclosed:[false,true]};if(opts[m]){ $('left-closed').checked=opts[m][0];$('right-closed').checked=opts[m][1];}if(m==='leftopen'||m==='leftinclusive')$('right-closed').checked=m==='leftinclusive';if(m==='rightopen'||m==='rightinclusive')$('left-closed').checked=m==='rightinclusive';caRenderInterval();}));
['int-left','int-right','left-closed','right-closed'].forEach(id=>$(id).addEventListener('input',()=>{if(caIntervalMode==='all')caIntervalMode='finite';else if(id==='right-closed'&&(caIntervalMode==='leftopen'||caIntervalMode==='leftinclusive'))caIntervalMode=$('right-closed').checked?'leftinclusive':'leftopen';else if(id==='left-closed'&&(caIntervalMode==='rightopen'||caIntervalMode==='rightinclusive'))caIntervalMode=$('left-closed').checked?'rightinclusive':'rightopen';else if(['left-closed','right-closed'].includes(id)&&caIntervalMode!=='union')caIntervalMode='finite';caRenderInterval();}));caRenderInterval();

// Two pieces: each piece has its own ends; every finite end can be open or closed.
const caUnionEnds={u1a:'closed',u1b:'open',u2a:'open',u2b:'closed'};
function caPieceText(p){
 const L=p.a===null?'(−∞':(p.ac?'[':'(')+caNum(p.a),R=p.b===null?'∞)':caNum(p.b)+(p.bc?']':')');
 const ineq=p.a===null?`x ${p.bc?'≤':'<'} ${caNum(p.b)}`:p.b===null?`x ${p.ac?'≥':'>'} ${caNum(p.a)}`:`${caNum(p.a)} ${p.ac?'≤':'<'} x ${p.bc?'≤':'<'} ${caNum(p.b)}`;
 return{interval:`${L}, ${R}`,ineq};
}
function caUnionFail(msg){$('interval-answer').textContent='—';$('interval-inequality').textContent='—';$('interval-setbuilder').textContent='—';$('interval-text').innerHTML=`<b>Adjust the pieces:</b> ${msg}`;$('interval-svg').innerHTML='';$('u1-readout').textContent='';$('u2-readout').textContent='';}
function caRenderUnion(){
 const linf=caUnionEnds.u1a==='inf',rinf=caUnionEnds.u2b==='inf';
 $('u1-a').disabled=linf;$('u2-b').disabled=rinf;
 document.querySelectorAll('#union-builder .ca-end-toggle').forEach(g=>{const k=g.dataset.end;g.querySelectorAll('button').forEach(btn=>{const on=btn.dataset.state===caUnionEnds[k];btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on));});});
 const read=id=>{const el=$(id);return el.value.trim()===''?NaN:Number(el.value);};
 const a1=linf?null:read('u1-a'),b1=read('u1-b'),a2=read('u2-a'),b2=rinf?null:read('u2-b');
 const ok=v=>v===null||(Number.isFinite(v)&&v>=-10&&v<=10);
 if(![a1,b1,a2,b2].every(ok))return caUnionFail('use whole numbers from −10 to 10 for every finite end.');
 if(a1!==null&&a1>=b1)return caUnionFail('in Piece 1, the left end must be smaller than the right end.');
 if(b2!==null&&a2>=b2)return caUnionFail('in Piece 2, the left end must be smaller than the right end.');
 const p1={a:a1,b:b1,ac:caUnionEnds.u1a==='closed',bc:caUnionEnds.u1b==='closed'},p2={a:a2,b:b2,ac:caUnionEnds.u2a==='closed',bc:caUnionEnds.u2b==='closed'};
 const t1=caPieceText(p1),t2=caPieceText(p2);$('u1-readout').textContent=t1.interval;$('u2-readout').textContent=t2.interval;
 if(b1>a2)return caUnionFail(`Piece 1 ends at ${caNum(b1)} but Piece 2 starts at ${caNum(a2)}, so they overlap. Overlapping pieces are really one interval; move Piece 2 to the right of Piece 1.`);
 const svg=$('interval-svg'),tx=n=>32+(n+10)/20*556;
 const label=(x,text,color)=>`<text x="${Math.max(30,Math.min(590,x))}" y="74" font-size="13" font-weight="800" text-anchor="middle" fill="${color}">${text}</text>`;
 const mid=p=>p.a===null?(32+tx(p.b))/2:p.b===null?(tx(p.a)+588)/2:(tx(p.a)+tx(p.b))/2;
 if(b1===a2&&(p1.bc||p2.ac)){
  const merged={a:p1.a,b:p2.b,ac:p1.ac,bc:p2.bc},tm=caPieceText(merged);
  caAxisNumberLine(svg,{segments:[merged]});svg.insertAdjacentHTML('beforeend',label(mid(merged),'one interval','#c2410c'));
  $('interval-answer').textContent=tm.interval;$('interval-inequality').textContent=tm.ineq;$('interval-setbuilder').textContent=`{x ∈ ℝ | ${tm.ineq}}`;
  $('interval-text').innerHTML=`<b>The pieces join.</b> They meet at x = ${caNum(b1)}, and ${caNum(b1)} is included by ${p1.bc&&p2.ac?'both pieces':p1.bc?'Piece 1':'Piece 2'}. Nothing is missing, so ${t1.interval} ∪ ${t2.interval} is the single interval <b>${tm.interval}</b>. Use ∪ only when there is a gap or a missing point between the pieces.`;
  return;
 }
 caAxisNumberLine(svg,{segments:[p1,p2]});
 let extra=label(mid(p1),'Piece 1','#c2410c')+label(mid(p2),'Piece 2','#c2410c');
 if(b1<a2)extra+=`<text x="${(tx(b1)+tx(a2))/2}" y="${b1+2<=a2?74:58}" font-size="12" font-weight="700" text-anchor="middle" fill="#64748b">gap</text>`;
 else extra+=`<text x="${tx(b1)}" y="58" font-size="12" font-weight="700" text-anchor="middle" fill="#64748b">hole</text>`;
 svg.insertAdjacentHTML('beforeend',extra);
 const ineq=`${t1.ineq} or ${t2.ineq}`,interval=`${t1.interval} ∪ ${t2.interval}`;
 $('interval-answer').textContent=interval;$('interval-inequality').textContent=ineq;$('interval-setbuilder').textContent=`{x ∈ ℝ | ${ineq}}`;
 const ends=(p,n)=>[p.a===null?`it runs left to −∞ (always a parenthesis)`:`${p.ac?'a filled dot includes':'a hollow dot excludes'} ${caNum(p.a)}`,p.b===null?`it runs right to ∞ (always a parenthesis)`:`${p.bc?'a filled dot includes':'a hollow dot excludes'} ${caNum(p.b)}`].join('; ');
 const gap=b1<a2?`The numbers strictly between ${caNum(b1)} and ${caNum(a2)} are <b>not</b> in the set (for example, x = ${caNum((b1+a2)/2)}). That gap is why the two pieces are joined with ∪, read “or.”`:`Only the single number ${caNum(b1)} is missing: every other x between the outer ends is in the set. This is how a domain such as x ≠ ${caNum(b1)} is written.`;
 $('interval-text').innerHTML=`<b>Piece 1:</b> ${ends(p1)}. <b>Piece 2:</b> ${ends(p2)}. ${gap}`;
}
document.querySelectorAll('#union-builder .ca-end-toggle button').forEach(btn=>btn.addEventListener('click',()=>{caUnionEnds[btn.closest('.ca-end-toggle').dataset.end]=btn.dataset.state;document.querySelectorAll('#union-examples button').forEach(b=>b.classList.remove('active'));caRenderUnion();}));
['u1-a','u1-b','u2-a','u2-b'].forEach(id=>$(id).addEventListener('input',()=>{document.querySelectorAll('#union-examples button').forEach(b=>b.classList.remove('active'));caRenderUnion();}));
document.querySelectorAll('#union-examples button').forEach(btn=>btn.addEventListener('click',()=>{const [a1,b1,a2,b2,s1,s2]=JSON.parse(btn.dataset.union);
 if(a1!==null)$('u1-a').value=a1;$('u1-b').value=b1;$('u2-a').value=a2;if(b2!==null)$('u2-b').value=b2;
 caUnionEnds.u1a=a1===null?'inf':s1[0]==='['?'closed':'open';caUnionEnds.u1b=s1[1]===']'?'closed':'open';caUnionEnds.u2a=s2[0]==='['?'closed':'open';caUnionEnds.u2b=b2===null?'inf':s2[1]===']'?'closed':'open';
 document.querySelectorAll('#union-examples button').forEach(b=>b.classList.toggle('active',b===btn));caRenderUnion();}));
// Section 3.2 · 02: formulas with a coefficient on x (fraction endpoints and the inequality flip).
let caDomainLastKind=null,caLinLastA=3;
const caLinPresets={linfrac:[3,-4],linroot:[-3,5],linrootden:[1,-3]};
function caFrac(n,d){
 if(d<0){n=-n;d=-d;}
 const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),g=gcd(n,d)||1;n/=g;d/=g;
 return{value:n/d,text:d===1?caNum(n):`${n<0?'−':''}${Math.abs(n)}/${d}`};
}
function caLinText(a,b){
 const ax=a===1?'x':a===-1?'−x':`${caNum(a)}x`;
 if(b===0)return ax;
 if(a<0&&b>0)return `${caNum(b)} − ${Math.abs(a)===1?'':Math.abs(a)}x`;
 return `${ax} ${b<0?'−':'+'} ${Math.abs(b)}`;
}
function caDomain(){
 const kind=$('domain-kind').value,linear=kind.startsWith('lin');
 if(linear&&kind!==caDomainLastKind){const [pa,pb]=caLinPresets[kind];$('lin-a').value=pa;$('lin-b').value=pb;caLinLastA=pa;}
 caDomainLastKind=kind;
 $('domain-k-wrap').hidden=linear;$('lin-a-wrap').hidden=!linear;$('lin-b-wrap').hidden=!linear;
 return linear?caDomainLinear(kind):caDomainK();
}
function caDomainLinear(kind){
 let a=Number($('lin-a').value);const b=Number($('lin-b').value);
 if(a===0){a=caLinLastA>0?-1:1;$('lin-a').value=a;}
 caLinLastA=a;
 $('lin-a-output').textContent=caNum(a);$('lin-b-output').textContent=caNum(b);
 const lin=caLinText(a,b),bound=caFrac(-b,a),X=bound.text,xv=bound.value,L=t=>a*t+b;
 const ax=a===1?'x':a===-1?'−x':`${caNum(a)}x`;
 const raw=$('domain-x').value,x=Number(raw),validX=raw.trim()!==''&&Number.isFinite(x);
 const strict=kind==='linrootden',isFrac=kind==='linfrac';
 const expression={linfrac:`f(x) = 1 / (${lin})`,linroot:`f(x) = √(${lin})`,linrootden:`f(x) = 1 / √(${lin})`}[kind];
 let segments,interval,condition,steps;
 if(isFrac){
  segments=[{a:null,b:xv,bc:false},{a:xv,b:null,ac:false}];
  interval=`(−∞, ${X}) ∪ (${X}, ∞)`;condition=`x ≠ ${X}`;
  steps=[`The denominator is ${lin}. It cannot equal zero: ${lin} ≠ 0.`];
  if(b!==0)steps.push(`Solve ${lin} = 0. Move the constant to the other side: ${ax} = ${caNum(-b)}.`);
  if(a!==1)steps.push(`Divide both sides by ${caNum(a)}: x = ${X}.`);
  steps.push(`Exclude only x = ${X}. Draw an open circle there and shade every other real number.`);
 }else{
  const rel=strict?'>':'≥',flip=strict?'<':'≤',right=a>0;
  segments=[right?{a:xv,b:null,ac:!strict}:{a:null,b:xv,bc:!strict}];
  condition=`x ${right?rel:flip} ${X}`;
  interval=right?`${strict?'(':'['}${X}, ∞)`:`(−∞, ${X}${strict?')':']'}`;
  steps=[`Identify the radicand ${lin}. ${strict?'The root is in a denominator, so the radicand must be strictly positive (zero would mean dividing by zero).':'For a real square root it must be nonnegative.'}`,
   `Write the inequality: ${lin} ${rel} 0.`];
  if(b!==0)steps.push(`Move the constant to the other side: ${ax} ${rel} ${caNum(-b)}.`);
  if(a>1)steps.push(`Divide both sides by ${caNum(a)}. It is positive, so the inequality keeps its direction: x ${rel} ${X}.`);
  else if(a<0)steps.push(`<span class="ca-flip-note">Divide both sides by ${caNum(a)}. Dividing by a negative number <b>reverses</b> the inequality:</span> x ${flip} ${X}.`);
  steps.push(`Draw ${strict?'an open':'a filled'} circle at ${X} and shade to the ${right?'right':'left'}.`);
 }
 $('domain-expression').textContent=expression;
 $('domain-setbuilder').textContent=`{x ∈ ℝ | ${condition}}`;$('domain-interval').textContent=interval;
 caAxisNumberLine($('domain-svg'),{segments,test:validX?x:null});
 const tx=n=>32+(n+10)/20*(588-32);
 $('domain-svg').innerHTML+=`<text x="${tx(xv)}" y="149" font-size="14" font-weight="800" text-anchor="middle" fill="#d9481f">x = ${X}</text>`;
 const result=$('domain-result'),can=t=>isFrac?L(t)!==0:strict?L(t)>0:L(t)>=0;
 result.className='ca-domain-status '+(validX?(can(x)?'ca-domain-allowed':'ca-domain-forbidden'):'');
 if(!validX){result.textContent='Enter a real input x to test whether this function accepts it.';}
 else if(can(x)){const v=isFrac?1/L(x):strict?1/Math.sqrt(L(x)):Math.sqrt(L(x));const out=Math.abs(v)<1e-10?'0':caNum(v);result.textContent=`✓ ALLOWED: x = ${caNum(x)} gives a real output f(${caNum(x)}) ${Math.abs(v-Math.round(v))<1e-9?'=':'≈'} ${out}.`;}
 else{const value=caNum(L(x));const why=isFrac?`the denominator ${lin} equals 0`:L(x)===0?`the radicand ${lin} equals 0, and √0 = 0 cannot be a denominator`:`the radicand ${lin} equals ${value}, which is negative`;result.textContent=`✕ NOT ALLOWED: at x = ${caNum(x)}, ${why}.`;}
 $('domain-steps').innerHTML=steps.map(t=>`<li>${t}</li>`).join('');
}
function caDomainK(){
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
['domain-kind','domain-k','domain-x','lin-a','lin-b'].forEach(id=>$(id).addEventListener('input',caDomain));caDomain();
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
 const key=$('dr-graph-kind').value,d=caGraphExamples[key],svg=$('dr-graph-svg'),W=650,H=400,pL=47,pR=34,pT=22,pB=43,vw=CA.viewWindow(svg,{xmin:-6,xmax:6,ymin:-5,ymax:7},W-pL-pR,H-pT-pB,true),{xmin,xmax,ymin,ymax}=vw,stp=CA.Plane.nice(Math.max(xmax-xmin,ymax-ymin)*(vw.eq?1:1),12),stpY=vw.eq?stp:CA.Plane.nice(ymax-ymin,9),stpX=vw.eq?stp:CA.Plane.nice(xmax-xmin,12);
 const tx=x=>pL+(x-xmin)*(W-pL-pR)/(xmax-xmin),ty=y=>H-pB-(y-ymin)*(H-pT-pB)/(ymax-ymin),axisY=Math.max(pT,Math.min(H-pB,ty(0))),axisX=Math.max(pL,Math.min(W-pR,tx(0)));
 let grid='',paths='',projections='';for(let x=Math.ceil(xmin/stpX)*stpX;x<=xmax+1e-9;x+=stpX){grid+=`<line x1="${tx(x)}" x2="${tx(x)}" y1="${pT}" y2="${H-pB}" stroke="var(--ca-graph-grid,#dbe2e9)" stroke-width="${Math.abs(x)<1e-9?1.6:.8}"/><text x="${tx(x)}" y="${H-19}" font-size="12" fill="var(--ca-plot-text,#2f3c4a)" text-anchor="middle">${caNum(Number(x.toFixed(6)))}</text>`;}
 for(let y=Math.ceil(ymin/stpY)*stpY;y<=ymax+1e-9;y+=stpY){grid+=`<line x1="${pL}" x2="${W-pR}" y1="${ty(y)}" y2="${ty(y)}" stroke="var(--ca-graph-grid,#dbe2e9)" stroke-width="${Math.abs(y)<1e-9?1.6:.8}"/>`;if(Math.abs(y)>1e-9)grid+=`<text x="${pL-10}" y="${ty(y)+5}" font-size="12" fill="var(--ca-plot-text,#2f3c4a)" text-anchor="end">${caNum(Number(y.toFixed(6)))}</text>`;}
 const inBounds=v=>v>=ymin&&v<=ymax;
 for(const [s0,e0] of d.parts){const start=s0<=-6?xmin:s0,end=e0>=6?xmax:e0;let points=[],was=false;const segments=[];const n=700;
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
 svg.innerHTML=`<defs><marker id="ca-graph-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse"><path d="M0 0 L6 3 L0 6 Z" fill="#ed6336"/></marker><clipPath id="ca-dr-clip"><rect x="${pL-8}" y="${pT-8}" width="${W-pL-pR+16}" height="${H-pT-pB+16}"/></clipPath></defs><rect x="${pL}" y="${pT}" width="${W-pL-pR}" height="${H-pT-pB}" fill="var(--ca-plot-bg,#fff)"/>${grid}<g clip-path="url(#ca-dr-clip)">${paths}${projections}</g><text x="${W-pR+5}" y="${axisY-9}" fill="var(--ca-plot-text,#344356)" font-size="15" font-weight="700">x</text><text x="${axisX+8}" y="${pT+12}" fill="var(--ca-plot-text,#344356)" font-size="15" font-weight="700">y</text>`;
 svg._caRedraw=caRenderGraph;CA.viewTools(svg,vw);
 $('dr-domain').textContent=d.domain;$('dr-range').textContent=d.range;
 $('dr-explanation').innerHTML=`<b>${caDRView==='domain'?'Reading the x-shadow (left → right)':'Reading the y-shadow (bottom → top)'}:</b> ${d.why} <b>Highlighted ${caDRView}:</b> ${caDRView==='domain'?d.domain:d.range}. <span class="ca-muted">The drawing shows a finite window; arrows/continuation indicate the curve goes on beyond the window.</span>`;
 document.querySelectorAll('[data-dr-view]').forEach(btn=>{const selected=btn.dataset.drView===caDRView;btn.classList.toggle('active',selected);btn.setAttribute('aria-pressed',String(selected));});
}
$('dr-graph-kind').addEventListener('change',caRenderGraph);document.querySelectorAll('[data-dr-view]').forEach(b=>b.addEventListener('click',()=>{caDRView=b.dataset.drView;caRenderGraph();}));caRenderGraph();
function caRangeParabola(){
 let h=+$('vertex-h').value,k=+$('vertex-k').value,a=+$('vertex-a').value;
 $('h-display').textContent=caNum(h);$('v-display').textContent=caNum(k);
 const svg=$('range-svg'),g=plot(svg,x=>a*(x-h)*(x-h)+k,{xmin:-6,xmax:6,ymin:-7,ymax:7},caRangeParabola),v=g.win;
 const axis=g.tx(0),at=g.ty(k),top=a>0?g.ty(v.ymax):g.ty(v.ymin);
 svg.innerHTML+=g.clip(`<line x1="${g.tx(v.xmin)}" y1="${g.ty(0)}" x2="${g.tx(v.xmax)}" y2="${g.ty(0)}" stroke="#1b88b0" stroke-width="6" stroke-opacity=".75"/><line x1="${axis}" y1="${at}" x2="${axis}" y2="${top}" stroke="#1b88b0" stroke-width="9" stroke-opacity=".7"/>${caPoint(axis,at,true,'#1b88b0',6)}${caPoint(g.tx(h),g.ty(k),true,'#ed6336',8)}`);
 const range=a>0?`[${caNum(k)}, ∞)`:`(−∞, ${caNum(k)}]`;
 $('range-domain').textContent='(−∞, ∞)';$('range-range').textContent=range;
 $('range-answer').innerHTML=`<b>Vertex:</b> (${caNum(h)}, ${caNum(k)}). <b>Domain:</b> all real x, (−∞, ∞). <b>Range:</b> ${range}. Because the parabola opens ${a>0?'upward':'downward'}, <b>y = ${caNum(k)}</b> is the included ${a>0?'minimum':'maximum'} output. The blue shadows mark the allowed x- and y-values.`;
}
['vertex-h','vertex-k','vertex-a'].forEach(id=>$(id).addEventListener('input',caRangeParabola));caRangeParabola();

CA.guided('32',[
 {
  "q": "The shaded number line starts with an open circle at −2 and ends with a filled circle at 6. Choose the interval.",
  "opts": [
   "[−2, 6]",
   "(−2, 6]",
   "(−2, 6)"
  ],
  "correct": 1,
  "why": "An open circle excludes −2; a filled circle includes 6. The interval is (−2, 6].",
  "hint": "A hollow dot means excluded; a filled dot means included."
 },
 {
  "q": "Which set-builder notation matches [3, ∞)?",
  "opts": [
   "{x ∈ ℝ | x > 3}",
   "{x ∈ ℝ | x ≥ 3}",
   "{x ∈ ℝ | x ≤ 3}"
  ],
  "correct": 1,
  "why": "The bracket at 3 includes the value 3, and the arrow goes to the right: x ≥ 3.",
  "hint": "The bracket at 3 includes 3. Which inequality matches that?"
 },
 {
  "q": "What is the domain of f(x) = 1/(x + 5)?",
  "opts": [
   "(−∞, ∞)",
   "(−∞, −5) ∪ (−5, ∞)",
   "[−5, ∞)"
  ],
  "correct": 1,
  "why": "x + 5 = 0 at x = −5. Exclude this one input because division by zero is undefined.",
  "hint": "Set the denominator equal to zero to locate the forbidden x-value."
 },
 {
  "q": "Find the domain of g(x) = √(x − 4).",
  "opts": [
   "(4, ∞)",
   "(−∞, 4]",
   "[4, ∞)"
  ],
  "correct": 2,
  "why": "The radicand must satisfy x − 4 ≥ 0, so x ≥ 4. The boundary is included.",
  "hint": "A real square root needs a nonnegative radicand."
 },
 {
  "q": "Find the domain of h(x) = 1/√(x + 2).",
  "opts": [
   "(−2, ∞)",
   "[−2, ∞)",
   "(−∞, −2)"
  ],
  "correct": 0,
  "why": "The radical is in the denominator: x + 2 > 0. Hence x > −2; the endpoint is open.",
  "hint": "If the root is in a denominator, zero is excluded as well."
 },
 {
  "q": "What is the domain of p(x) = 1/(x² − 9)?",
  "opts": [
   "(−∞, −3) ∪ (−3, 3) ∪ (3, ∞)",
   "[−3, 3]",
   "(−∞, ∞)"
  ],
  "correct": 0,
  "why": "Factor x² − 9 = (x − 3)(x + 3). Exclude both −3 and 3.",
  "hint": "Factor the denominator using the difference of two squares."
 },
 {
  "q": "A line segment goes from a hollow dot at (−4, −3) to a filled dot at (2, 3). What is its range?",
  "opts": [
   "[−4, 2)",
   "(−3, 3]",
   "[−3, 3)"
  ],
  "correct": 1,
  "why": "Read from bottom to top: −3 is excluded and 3 is included. The range is (−3, 3].",
  "hint": "Range comes from y-values; scan bottom to top."
 },
 {
  "q": "For f(x) = |x − 1| − 2, what is its range?",
  "opts": [
   "[−2, ∞)",
   "(−∞, −2]",
   "(−∞, ∞)"
  ],
  "correct": 0,
  "why": "Absolute value is never negative, so the lowest output is −2. It is attained at x = 1.",
  "hint": "The absolute-value expression cannot be negative."
 },
 {
  "q": "For f(x) = −(x − 1)² + 3, what is the range?",
  "opts": [
   "[3, ∞)",
   "(−∞, 3]",
   "(−∞, ∞)"
  ],
  "correct": 1,
  "why": "The parabola opens downward. The vertex has maximum y = 3, included.",
  "hint": "An upside-down parabola has a maximum at its vertex."
 },
 {
  "q": "Which value is excluded from the range of y = 1/(x − 1)?",
  "opts": [
   "y = 1",
   "y = 0",
   "y = −1"
  ],
  "correct": 1,
  "why": "A reciprocal can never equal zero; the horizontal asymptote is y = 0.",
  "hint": "Can 1 divided by a real nonzero number ever be zero?"
 },
 {
  "q": "For f(x) = √(3 − x), which interval is the domain?",
  "opts": [
   "(−∞, 3]",
   "[3, ∞)",
   "(−∞, 3)"
  ],
  "correct": 0,
  "why": "3 − x ≥ 0 means −x ≥ −3, so x ≤ 3 after reversing the inequality.",
  "hint": "Remember: multiplying an inequality by a negative reverses it."
 },
 {
  "q": "Which statement about infinity is correct?",
  "opts": [
   "Use brackets when ∞ is included",
   "Always use parentheses beside ±∞",
   "Infinity is the largest real number"
  ],
  "correct": 1,
  "why": "Infinity is not a real endpoint, so it is never included in an interval.",
  "hint": "Is a cube root defined for negative numbers?"
 },
 {
  "q": "What is the domain of ∛(x + 8)?",
  "opts": [
   "[−8, ∞)",
   "(−∞, ∞)",
   "(−∞, −8) ∪ (−8, ∞)"
  ],
  "correct": 1,
  "why": "Cube roots are defined for negative, zero, and positive inputs; there is no restriction.",
  "hint": "Infinity is not an attainable real endpoint."
 }
]);
})();
