const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../dist/versions/v8/reader.js'),'utf8');
const motion=source.slice(source.indexOf('const stateTransform='),source.indexOf('\nfunction go('));
const pointers=source.slice(source.indexOf("track.addEventListener('dragstart'"),source.indexOf("track.addEventListener('wheel'"));
(async()=>{
 const log=[],listeners={},raf=new Map();let now=0,frame=0;
 const cards=Array.from({length:6},(_,i)=>{const state={visibility:i<4?'visible':'hidden',transform:`matrix(1,0,0,1,${i*10},0)`};return {style:new Proxy(state,{set(o,k,v){log.push('write');o[k]=v;return true}}),dataset:{},contains:()=>false,setAttribute(){},animate(frames,options){let finish;const finished=new Promise(resolve=>finish=resolve);return{frames,options,finished,finish,cancel(){log.push('cancel')}}}}});
 class Matrix{constructor(v){const parts=v?.startsWith('matrix(')?v.slice(7,-1).split(',').map(Number):[1,0,0,1,0,0];[this.m11,this.m12,this.m21,this.m22,this.m41,this.m42]=parts}}
 const track={clientWidth:400,addEventListener:(n,fn)=>listeners[n]=fn,focus(){},setPointerCapture(){},releasePointerCapture(){},setAttribute(){},removeAttribute(){}};
 const context=vm.createContext({window:{},cards,track,document:{activeElement:null},getComputedStyle:c=>{log.push('read');return{transform:c.rendered||c.style.transform}},DOMMatrixReadOnly:Matrix,performance:{now:()=>now},requestAnimationFrame:fn=>{raf.set(++frame,fn);return frame},cancelAnimationFrame:id=>raf.delete(id),Map,Math});
 vm.runInContext('let current=0,revision=0,gesture=null,suppress=0,dragFrame=0;const motions=new Map(),reduced={matches:false};const go=index=>{current=index};'+motion+'\n'+pointers,context);
 // All reads must precede every write/cancel, avoiding read/write layout thrashing.
 vm.runInContext('motions.set(cards[0],{cancel(){}});freezeMotion()',context);const firstWrite=log.indexOf('write');assert(log.slice(firstWrite).every(x=>x!=='read'));
 // V6's exit, opaque layer handoff and landing are preserved.
 vm.runInContext('current=1;settle(true,0)',context);const animation=vm.runInContext('motions.get(cards[0])',context);assert.equal(animation.options.duration,450);assert.equal(animation.options.easing,'linear');assert(animation.frames.every(f=>f.opacity===1));assert.equal(cards[0].dataset.depth,'3');assert.equal(cards[5].style.visibility,'visible');animation.finish();await Promise.resolve();await Promise.resolve();assert.equal(cards[5].style.visibility,'hidden');
 // Merely touching or scrolling vertically must leave an in-flight turn alone.
 const evt=(x,y,kind=null)=>({isPrimary:true,button:0,pointerId:1,clientX:x,clientY:y,target:{closest(selector){return kind&&selector.split(',').some(s=>s.trim()===kind)?this:null}},preventDefault(){}});
 const cancels=()=>log.filter(x=>x==='cancel').length;let before=cancels();listeners.pointerdown(evt(200,100));assert.equal(cancels(),before);listeners.pointermove(evt(201,130));assert.equal(cancels(),before);
 // Several pointer samples produce only one render for the next display frame.
 listeners.pointerdown(evt(200,100));now=10;listeners.pointermove(evt(180,100));now=20;listeners.pointermove(evt(150,100));now=30;listeners.pointermove(evt(110,100));assert.equal(raf.size,1);const render=Array.from(raf.values())[0];raf.clear();log.length=0;render();assert(!log.includes('read'));assert(cards[1].style.transform.includes('-90px'));
 listeners.pointerup(evt(110,100));assert.equal(vm.runInContext('current',context),2);
 // A short fast flick qualifies.
 vm.runInContext('current=1',context);listeners.pointerdown(evt(200,100));now=40;listeners.pointermove(evt(170,100));listeners.pointerup(evt(170,100));assert.equal(vm.runInContext('current',context),2);
 // Light, deliberate drags and small flicks work without traversing the card.
 vm.runInContext('current=1',context);now=80;listeners.pointerdown(evt(200,100));now=280;listeners.pointermove(evt(172,100));listeners.pointerup(evt(172,100));assert.equal(vm.runInContext('current',context),2,'28px slow drag');
 vm.runInContext('current=1',context);now=300;listeners.pointerdown(evt(200,100));now=330;listeners.pointermove(evt(188,100));listeners.pointerup(evt(188,100));assert.equal(vm.runInContext('current',context),2,'12px light flick');
 // Chrome may coalesce the final move: the pointerup coordinate still commits it.
 vm.runInContext('current=1',context);now=400;listeners.pointerdown(evt(200,100));now=410;listeners.pointermove(evt(194,100));now=440;listeners.pointerup(evt(170,100));assert.equal(vm.runInContext('current',context),2,'Release position');
 // Tiny backwards drift at lift-off must not cancel a valid swipe.
 vm.runInContext('current=1',context);now=500;listeners.pointerdown(evt(200,100));now=520;listeners.pointermove(evt(165,100));now=640;listeners.pointermove(evt(167,100));listeners.pointerup(evt(167,100));assert.equal(vm.runInContext('current',context),2,'2px release wobble');
 // Re-grabbing a moving sheet continues from its rendered transform, never its rest pose.
 vm.runInContext('current=1;cards[1].rendered="matrix(1,0,0,1,80,0)"',context);now=100;listeners.pointerdown(evt(200,100));now=110;listeners.pointermove(evt(180,100));Array.from(raf.values())[0]();raf.clear();assert(cards[1].style.transform.includes('60px'));listeners.pointercancel(evt(180,100));delete cards[1].rendered;
 // A reversal near release cancels even a drag beyond the distance threshold.
 now=200;listeners.pointerdown(evt(200,100));now=210;listeners.pointermove(evt(50,100));now=300;listeners.pointermove(evt(20,100));now=330;listeners.pointermove(evt(80,100));listeners.pointerup(evt(80,100));assert.equal(vm.runInContext('current',context),1);
 // Link/button/accordion-row swipes turn the card, without activating the action.
 for(const kind of ['a','button','summary']){
  vm.runInContext('current=1',context);now+=200;
  listeners.pointerdown(evt(200,100,kind));now+=20;listeners.pointermove(evt(90,100,kind));listeners.pointerup(evt(90,100,kind));assert.equal(vm.runInContext('current',context),2,kind+' swipe');
  let blocked=false,stopped=false;listeners.click({detail:1,preventDefault(){blocked=true},stopImmediatePropagation(){stopped=true}});assert(blocked&&stopped,kind+' drag click');
  // A new, stationary tap can activate immediately; it is not held behind a timer.
  now+=10;listeners.pointerdown(evt(200,100,kind));listeners.pointerup(evt(200,100,kind));blocked=false;listeners.click({detail:1,preventDefault(){blocked=true},stopImmediatePropagation(){}});assert(!blocked,kind+' tap');
  // Vertical intent relinquishes the gesture without turning a page.
  listeners.pointerdown(evt(200,100,kind));listeners.pointermove(evt(201,140,kind));listeners.pointerup(evt(201,140,kind));assert.equal(vm.runInContext('current',context),2,kind+' vertical scroll');
 }
 // Keyboard clicks are never suppressed after a pointer swipe.
 vm.runInContext('suppress=performance.now()+300',context);let keyboardBlocked=false;listeners.click({detail:0,preventDefault(){keyboardBlocked=true},stopImmediatePropagation(){}});assert(!keyboardBlocked);
 // Faster release shortens departure, while retaining the opaque return to the stack.
 vm.runInContext('current=1;cards[0].rendered="matrix(1,0,0,1,0,0)";settle(true,0,{depart:150})',context);
 const fast=vm.runInContext('motions.get(cards[0])',context);assert.equal(fast.options.duration,390);assert.equal(fast.frames[1].offset,150/390);delete cards[0].rendered;
 // No synchronous last-frame drag write is inserted before settling on release.
 assert(!pointers.includes('drawDrag();'));
 // Reduced motion preserves immediate stacking without launching animations.
 vm.runInContext('reduced.matches=true;current=2;settle(true,1)',context);assert.equal(vm.runInContext('motions.size',context),0);assert.equal(cards[1].dataset.depth,'3');
 console.log('V8 motion regressions passed: batched reads, V6 opacity/layering, retained back sheet, no tap/vertical reset, rAF coalescing, fast flick, re-grab continuity, reversal, links/buttons/summary tap-versus-drag, keyboard activation, reduced motion.');
})().catch(e=>{console.error(e);process.exit(1)});
