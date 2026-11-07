/* Native touch owns pan and snap; other inputs share one interruptible animator. */
window.PitstopGesture = Object.freeze({
 releaseTarget({origin,delta,velocity=0,width,count}) {
  const threshold=Math.min(40,width*.1);
  const reversed=Math.abs(velocity)>.5&&Math.sign(velocity)!==Math.sign(delta);
  const intentional=Math.abs(delta)>=threshold||(Math.abs(delta)>=12&&Math.abs(velocity)>=.35);
  const target=origin+(!reversed&&intentional?(delta<0?1:-1):0);
  return Math.max(0,Math.min(count-1,target));
 }
});
window.createPitstopMotion = ({track,slides,reduced,onChange}) => {
 const gsap=window.gsap;
 if(gsap)document.documentElement.classList.add('gsap-motion');
 slides.forEach(slide=>{
  const surface=document.createElement('div');surface.className='swipe-surface';
  while(slide.firstChild)surface.append(slide.firstChild);
  slide.append(surface);
 });
 track.classList.add('motion-track');
 let destination=0,committed=0,programmatic=false,touching=false,drag=null,scrollTimer,suppressClick=false,entrance=null,tween=null,fallbackFrame=0,wheel=null;
 let viewportWidth=track.clientWidth;
 const seen=new WeakSet();
 const clamp=n=>Math.max(0,Math.min(slides.length-1,n));
 const nearest=()=>clamp(Math.round(track.scrollLeft/Math.max(1,track.clientWidth)));
 function finishEntrance(){
  const active=entrance;entrance=null;
  if(active){active.timeline?.kill();active.context?.revert();}
 }
 function flatten(){
  track.classList.remove('is-scrolling','is-settling','is-dragging','is-controlled');
 }
 function warm(n){
  for(let i=Math.max(0,n-1);i<=Math.min(slides.length-1,n+1);i++){
   const image=slides[i].querySelector('img');
   if(image){image.loading='eager';if(image.decode)image.decode().catch(()=>{});}
  }
 }
 function enter(slide){
  if(seen.has(slide))return true;
  if(document.hidden)return false;
  seen.add(slide);
  // Typography remains readable while fonts load; never hide already-visible text.
  if(!gsap||reduced.matches||document.fonts?.status==='loading')return true;
  finishEntrance();
  const active={slide,context:null,timeline:null};entrance=active;
  active.context=gsap.context(()=>{
   const title=slide.querySelector('h2');
   const image=slide.querySelector('.story-image');
   const emoji=slide.querySelector('.story-emoji, .completion-mark');
   const tl=gsap.timeline({defaults:{duration:.26,ease:'power2.out'},onComplete:()=>{if(entrance===active)finishEntrance();}});
   active.timeline=tl;
   if(title)tl.from(title,{y:3},0);
   if(image?.complete&&image.naturalWidth)tl.from(image,{scale:1.012,duration:.36},0);
   if(emoji)tl.from(emoji,{rotation:'-=5',duration:.3},0);
  },slide);
  return true;
 }
 // Keep type and card geometry still while the viewport moves. Decorative motion
 // belongs to entrances; it must not distort text under the reader's pointer.
 function abortDrag(){
  const d=drag;drag=null;
  track.classList.remove('is-mouse-dragging','is-dragging');
  if(d&&track.hasPointerCapture(d.id))track.releasePointerCapture(d.id);
 }
 function commit(n){
  n=clamp(n);destination=n;committed=n;programmatic=false;
  clearTimeout(scrollTimer);flatten();warm(n);
  if(entrance&&entrance.slide!==slides[n])finishEntrance();
  onChange(n);
 }
 function stopAnimation(){
  tween?.kill();tween=null;
  if(fallbackFrame)cancelAnimationFrame(fallbackFrame);fallbackFrame=0;
  programmatic=false;clearTimeout(scrollTimer);
 }
 function go(n,instant=false){
  n=clamp(n);stopAnimation();abortDrag();touching=false;finishEntrance();
  destination=n;warm(n);
  const from=track.scrollLeft,to=n*track.clientWidth,distance=Math.abs(to-from);
  track.classList.add('is-controlled');
  if(instant||reduced.matches||distance<.5){track.scrollLeft=to;commit(n);return;}
  programmatic=true;track.classList.add('is-settling');
  const duration=Math.min(.48,.26+distance/Math.max(1,track.clientWidth)*.1);
  const position={x:from};
  const done=()=>{tween=null;fallbackFrame=0;track.scrollLeft=to;commit(n);};
  if(gsap){tween=gsap.to(position,{x:to,duration,ease:'power3.out',onUpdate:()=>{track.scrollLeft=position.x;},onComplete:done});}
  else{
   const start=performance.now();
   const tick=now=>{const t=Math.min(1,(now-start)/(duration*1000));track.scrollLeft=from+(to-from)*(1-Math.pow(1-t,4));if(t<1)fallbackFrame=requestAnimationFrame(tick);else done();};
   fallbackFrame=requestAnimationFrame(tick);
  }
 }
 function settle(){
  if(programmatic||drag||touching)return;
  const n=nearest();
  // Native momentum and native snapping finish themselves. Never restart a
  // browser's in-flight swipe from a debounce timer.
  if(Math.abs(track.scrollLeft-n*track.clientWidth)<2)commit(n);
 }
 track.addEventListener('pointerdown',e=>{
  if(!e.isPrimary)return;
  if(e.pointerType==='touch'){
   // Do not capture, preventDefault, or apply distance/diagonal rules to a thumb swipe.
   stopAnimation();abortDrag();finishEntrance();
   track.classList.remove('is-controlled','is-settling');touching=true;
   return;
  }
  if(e.button!==0||e.shiftKey||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  stopAnimation();finishEntrance();
  track.classList.remove('is-settling');track.classList.add('is-controlled');
  const now=performance.now();
  drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,left:track.scrollLeft,origin:nearest(),committed:false,samples:[{x:e.clientX,t:now}]};
 });
 track.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  if(!(e.buttons&1)){const n=drag.origin;abortDrag();go(n);return;}
  const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY,now=performance.now();
  if(!drag.committed){
   if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)*1.3){const n=drag.origin;drag=null;go(n);return;}
   if(Math.abs(dx)<6)return;
   drag.committed=true;track.classList.add('is-mouse-dragging','is-dragging');
   track.setPointerCapture(e.pointerId);
   document.getSelection()?.removeAllRanges();
  }
  e.preventDefault();
  drag.samples.push({x:e.clientX,t:now});drag.samples=drag.samples.filter(s=>now-s.t<=100);
  const min=Math.max(0,(drag.origin-1)*track.clientWidth),max=Math.min(slides.length-1,drag.origin+1)*track.clientWidth;
  track.scrollLeft=Math.max(min,Math.min(max,drag.left-dx));
 },{passive:false});
 function release(e){
  if(e.pointerType==='touch'){
   touching=false;clearTimeout(scrollTimer);scrollTimer=setTimeout(settle,180);return;
  }
  if(!drag||e.pointerId!==drag.id)return;
  const d=drag,now=performance.now();
  if(!d.committed){drag=null;go(nearest());return;}
  const recent=d.samples.filter(s=>now-s.t<=110),first=recent[0];
  const velocity=first&&now-first.t>0?(e.clientX-first.x)/(now-first.t):0;
  const target=window.PitstopGesture.releaseTarget({origin:d.origin,delta:e.clientX-d.startX,velocity,width:track.clientWidth,count:slides.length});
  suppressClick=true;abortDrag();setTimeout(()=>{suppressClick=false;},0);go(target);
 }
 window.addEventListener('pointerup',release); // Includes releases outside the reader.

 track.addEventListener('pointercancel',e=>{
  if(e.pointerType==='touch'){touching=false;clearTimeout(scrollTimer);scrollTimer=setTimeout(settle,180);return;}
  if(drag){const n=drag.origin;abortDrag();go(n);}
 });
 track.addEventListener('lostpointercapture',()=>{if(drag?.committed){const n=drag.origin;abortDrag();go(n);}});
 track.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 // Wheel/trackpad: one page per gesture, so inertia cannot run through stories.
 // A quiet gap starts the next gesture; an intentional reversal responds at once.
 document.addEventListener('wheel',e=>{
  if(e.ctrlKey||e.metaKey||e.defaultPrevented||drag||document.querySelector('dialog[open]'))return;
  const scale=e.deltaMode===1?16:e.deltaMode===2?track.clientHeight:1;
  let dx=e.deltaX*scale,dy=e.deltaY*scale;
  const vertical=Math.abs(dy)>Math.abs(dx),delta=vertical?dy:dx;
  if(!delta)return;
  const content=e.target.closest?.('.requires-scroll');
  if(vertical&&content)return; // Reading text never turns a page at its edge.
  e.preventDefault();finishEntrance();
  const now=performance.now(),direction=Math.sign(delta);
  const fresh=!wheel||now-wheel.time>170;
  const reversal=wheel&&direction!==wheel.direction&&Math.abs(delta)>3&&now-wheel.turnedAt>100;
  if(fresh||reversal)wheel={time:now,direction,total:0,fired:false,turnedAt:now};
  wheel.time=now;
  if(wheel.fired||direction!==wheel.direction)return;
  wheel.total+=Math.abs(delta);
  if(wheel.total<24)return;
  wheel.fired=true;wheel.turnedAt=now;
  go((programmatic?destination:nearest())+direction);
 },{passive:false});
 track.addEventListener('scroll',()=>{
  clearTimeout(scrollTimer);
  if(!programmatic&&!drag)scrollTimer=setTimeout(settle,240);
 },{passive:true});
 track.addEventListener('scrollend',()=>{if(!programmatic&&!drag&&!touching)settle();});
 reduced.addEventListener('change',()=>{finishEntrance();go(programmatic?destination:nearest(),true);});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){const n=programmatic?destination:nearest();stopAnimation();finishEntrance();abortDrag();track.scrollLeft=n*track.clientWidth;commit(n);}
  else commit(nearest());
 });
 return{go,enter,index:()=>programmatic?destination:nearest(),resize:()=>{if(track.clientWidth===viewportWidth)return;viewportWidth=track.clientWidth;go(programmatic?destination:committed,true);}};
};
