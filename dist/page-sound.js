/* Native preloaded audio keeps page turns independent of suspended Web Audio contexts. */
(() => {
 'use strict';
 const script=document.currentScript,button=document.getElementById('page-sound'),test=document.getElementById('test-page-sound'),key='pitstop-v8-page-sound';
 const audio=document.createElement('audio');
 audio.id='page-turn-audio';audio.preload='auto';audio.src=new URL('assets/page-turn-soft.wav',script.src).href;
 audio.hidden=true;audio.volume=1;audio.setAttribute('playsinline','');audio.setAttribute('aria-hidden','true');
 document.body.append(audio);
 let enabled=true,primed=false,priming=false,attempt=0,turnStarted=-Infinity,turnDuration=260,previewing=false,aligned=false;
 try{enabled=localStorage.getItem(key)!=='off'}catch{}
 const state=value=>audio.setAttribute('data-state',value);
 const label=()=>{button.textContent=`Page sound: ${enabled?'on':'off'}`;button.setAttribute('aria-pressed',String(enabled));test.disabled=!enabled;};
 function stop(){attempt++;priming=false;audio.pause();try{audio.currentTime=0}catch{}audio.muted=false;state('idle');}
 // Prime the same media element silently during contact, before the swipe is classified.
 // A token prevents a late warm-up promise from muting or pausing an actual turn.
 function prime(){
  if(!enabled||document.hidden||primed||priming)return;
  priming=true;const ticket=++attempt;audio.muted=true;state('priming');
  try{Promise.resolve(audio.play()).then(()=>{
   if(ticket!==attempt)return;
   primed=true;priming=false;audio.pause();try{audio.currentTime=0}catch{}audio.muted=false;state('ready');
  }).catch(()=>{if(ticket===attempt){priming=false;audio.muted=false;state('locked')}})}catch{priming=false;audio.muted=false;state('unavailable')}
 }
 // Native playback can start late on mobile. Catch up to the motion, or skip it;
 // never play a detached sound after the sheet has already moved away.
 function align(){
  if(priming||aligned)return;aligned=true;
  const elapsed=performance.now()-turnStarted;
  if(!previewing&&elapsed>90){stop();state('late-skipped');return;}
  if(!previewing&&elapsed>18){try{audio.currentTime=elapsed/1000*audio.playbackRate}catch{}}
  audio.setAttribute('data-latency-ms',String(Math.round(elapsed)));state(audio.ended?'ended':'playing');
 }
 function play({duration=260,startedAt=performance.now(),preview=false}={}){
  if(!enabled||document.hidden)return;
  stop();aligned=false;turnStarted=startedAt;turnDuration=duration;previewing=preview;
  const ticket=attempt;audio.playbackRate=.35/Math.max(.18,Math.min(.32,duration/1000));audio.preservesPitch=true;state('starting');
  try{Promise.resolve(audio.play()).then(()=>{
   if(ticket!==attempt)return;primed=true;align();
  }).catch(error=>{if(ticket===attempt)state(error?.name==='NotAllowedError'?'blocked':'unavailable')})}catch{state('unavailable')}
 }
 audio.addEventListener('playing',align);
 audio.addEventListener('ended',()=>{if(!priming)state('ended')});
 audio.addEventListener('error',()=>state('unavailable'));
 button.addEventListener('click',()=>{enabled=!enabled;stop();try{localStorage.setItem(key,enabled?'on':'off')}catch{}label();if(enabled)play({preview:true})});
 test.addEventListener('click',()=>play({preview:true}));
 document.addEventListener('pointerdown',prime,{capture:true,passive:true});
 document.addEventListener('touchstart',prime,{capture:true,passive:true});
 document.addEventListener('touchend',()=>{
  // WebKit recognises touchend as a media gesture; retry only a blocked, still-current turn. Never restart pending playback.
  const status=audio.getAttribute('data-state');
  if(status==='blocked'&&performance.now()-turnStarted<75)play({duration:turnDuration,startedAt:turnStarted});else if(status!=='starting')prime();
 },{passive:true});
 document.addEventListener('keydown',prime,{capture:true,passive:true});
 document.addEventListener('click',prime,{capture:true,passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 state('idle');label();window.PITSTOP_SOUND={play,stop};
})();
