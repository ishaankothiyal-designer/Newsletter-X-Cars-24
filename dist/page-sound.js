/* The visual turn never waits for audio. Decode once; schedule a memory buffer. */
(() => {
 'use strict';
 const status=document.createElement('span');status.id='page-turn-audio';status.hidden=true;status.setAttribute('aria-hidden','true');document.body.append(status);
 const state=value=>status.setAttribute('data-state',value);
 const AudioContext=window.AudioContext||window.webkitAudioContext;
 let context,buffer,voice=null,frame=0,revision=0;
 function stop(){
  revision++;if(frame){cancelAnimationFrame(frame);frame=0;}
  if(voice){const old=voice;voice=null;try{old.gain.gain.cancelScheduledValues(context.currentTime);old.gain.gain.setTargetAtTime(0,context.currentTime,.003);old.source.stop(context.currentTime+.012)}catch{}}
  state(buffer?'ready':'loading');
 }
 function prime(){
  if(document.hidden||!context||context.state==='running')return;
  // Resume only during a user gesture; nothing awaits this promise in navigation.
  try{context.resume().catch(()=>{})}catch{}
 }
 function play({duration=210,startedAt=performance.now()}={}){
  stop();if(document.hidden||!buffer||context?.state!=='running'){state('skipped');return;}
  const ticket=revision;
  frame=requestAnimationFrame(()=>{
   frame=0;if(ticket!==revision||document.hidden)return;
   const elapsed=Math.max(0,performance.now()-startedAt);
   // A late cue is dropped, never replayed after the card has moved.
   if(elapsed>70){state('late-skipped');return;}
   try{
    const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;
    const seconds=Math.max(.18,Math.min(.28,duration/1000)),remaining=Math.max(.03,seconds-elapsed/1000),at=context.currentTime;
    // Keep the recording’s natural pitch; fade its tail to match the paper motion.
    source.playbackRate.value=1;gain.gain.setValueAtTime(.8,at);gain.gain.setValueAtTime(.8,at+Math.max(0,remaining-.04));gain.gain.linearRampToValueAtTime(0,at+remaining);source.connect(gain);gain.connect(context.destination);
    const active={source,gain};voice=active;
    source.onended=()=>{source.disconnect();gain.disconnect();if(voice===active){voice=null;state('ready')}};
    source.start(at,elapsed/1000);source.stop(at+remaining+.01);status.setAttribute('data-latency-ms',String(Math.round(elapsed)));state('playing');
   }catch{state('unavailable')}
  });
 }
 state('loading');
 if(AudioContext){
  try{
   context=new AudioContext({latencyHint:'interactive'});
   fetch(new URL('assets/page-turn-soft.wav',document.currentScript.src)).then(response=>{if(!response.ok)throw Error('Audio unavailable');return response.arrayBuffer()}).then(bytes=>context.decodeAudioData(bytes)).then(decoded=>{buffer=decoded;state('ready')}).catch(()=>state('unavailable'));
  }catch{state('unavailable')}
 }else state('unavailable');
 for(const event of ['pointerdown','touchstart','touchend','keydown'])document.addEventListener(event,prime,{capture:true,passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 window.PITSTOP_SOUND={play,stop};
})();
