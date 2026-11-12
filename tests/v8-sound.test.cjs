const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'../dist'),source=fs.readFileSync(path.join(root,'page-sound.js'),'utf8');
async function environment({pendingDecode=false,broken=false,suspended=false}={}){
 const events={},frames=new Map(),voices=[];let time=0,id=0,fetches=0,decodes=0,resumeCalls=0,decodeResolve;
 const status={attrs:{},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]}};
 class AudioContext{
  constructor(){this.state=suspended?'suspended':'running';this.currentTime=2;this.destination={};}
  resume(){resumeCalls++;if(!suspended)this.state='running';return Promise.resolve();}
  decodeAudioData(){decodes++;if(broken)return Promise.reject(Error('decode'));if(pendingDecode)return new Promise(resolve=>decodeResolve=resolve);return Promise.resolve({duration:.35});}
  createGain(){return{gain:{value:0,cancelScheduledValues(){},setTargetAtTime(){},setValueAtTime(){},linearRampToValueAtTime(){}},connect(){},disconnect(){}};}
  createBufferSource(){const voice={playbackRate:{},connect(){},disconnect(){},start(at,offset){this.at=at;this.offset=offset;this.started=true},stop(){this.stopped=true}};voices.push(voice);return voice;}
 }
 const document={hidden:false,currentScript:{src:'https://example.test/versions/v8/page-sound.js'},createElement:()=>status,body:{append(){}},addEventListener:(name,fn)=>events[name]=fn};
 const window={AudioContext};const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve()};
 vm.runInNewContext(source,{window,document,URL,performance:{now:()=>time},fetch:()=>{fetches++;return Promise.resolve({ok:true,arrayBuffer:()=>Promise.resolve(new ArrayBuffer(4))})},requestAnimationFrame:fn=>{frames.set(++id,fn);return id},cancelAnimationFrame:id=>frames.delete(id)});
 await flush();return{window,document,events,status,voices,frames,flush,setTime:t=>time=t,stats:()=>({fetches,decodes,resumeCalls}),decode:async()=>{decodeResolve({duration:.35});await flush()},paint(){const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn())}};
}
(async()=>{
 const e=await environment();assert.equal(e.voices.length,0,'No audio on load');assert.equal(e.status.attrs['data-state'],'ready');
 e.events.pointerdown();e.window.PITSTOP_SOUND.play({startedAt:0,duration:210});assert.equal(e.voices.length,0,'Visual turn starts before audio work');e.setTime(12);e.paint();assert.equal(e.voices.length,1);assert.equal(e.status.attrs['data-state'],'playing');assert.equal(e.voices[0].playbackRate.value,1,'Preserve the soft recording’s natural pitch');assert(e.voices[0].offset>0,'Cue catches up to the animation phase');
 e.window.PITSTOP_SOUND.play();e.window.PITSTOP_SOUND.play();assert.equal(e.frames.size,1,'Latest turn replaces queued audio');assert(e.voices[0].stopped);e.paint();assert.equal(e.voices.length,2);assert.deepEqual(e.stats(),{fetches:1,decodes:1,resumeCalls:0},'One decode for every turn');
 e.window.PITSTOP_SOUND.play({startedAt:0});e.setTime(120);e.paint();assert.equal(e.voices.length,2,'Drop cues that missed the turn');assert.equal(e.status.attrs['data-state'],'late-skipped');
 e.window.PITSTOP_SOUND.play();e.document.hidden=true;e.events.visibilitychange();e.paint();assert.equal(e.frames.size,0);assert.equal(e.voices.length,2,'Hide cancels queued sounds');
 const loading=await environment({pendingDecode:true});loading.window.PITSTOP_SOUND.play();assert.equal(loading.frames.size,0);await loading.decode();loading.paint();assert.equal(loading.voices.length,0,'Late decoding never replays an old turn');loading.window.PITSTOP_SOUND.play();loading.paint();assert.equal(loading.voices.length,1);
 const locked=await environment({suspended:true});locked.events.pointerdown();locked.window.PITSTOP_SOUND.play();locked.paint();assert.equal(locked.voices.length,0,'A locked context never stalls or queues navigation');assert.equal(locked.stats().resumeCalls,1);
 const broken=await environment({broken:true});broken.window.PITSTOP_SOUND.play();broken.paint();assert.equal(broken.voices.length,0,'Audio decode failure remains silent');
 const wav=fs.readFileSync(path.join(root,'assets/page-turn-soft.wav'));assert.equal(wav.toString('ascii',0,4),'RIFF');assert(wav.length<40000);let sum=0;for(let i=44;i<wav.length;i+=2)sum+=(wav.readInt16LE(i)/32768)**2;const rms=Math.sqrt(sum/((wav.length-44)/2));assert(rms>.015&&rms<.05,'Keep the soft paper recording');
 const reader=fs.readFileSync(path.join(root,'reader.js'),'utf8'),go=reader.slice(reader.indexOf('function go('),reader.indexOf('\nfunction target('));let turns=0;
 const c=vm.createContext({window:{PITSTOP_SOUND:{play:()=>turns++}},cards:Array.from({length:3},()=>({querySelector:()=>({scrollTop:0})})),pages:[{id:'a',kind:'cover'},{id:'b',kind:'overview'},{id:'c',kind:'ending'}],reduced:{matches:false},queueWarm(){},cancel(){},settle(){},performance:{now:()=>0},$:()=>({}),Math});
 vm.runInContext('let current=0;'+go+';go(0);go(-1);go(1,false);',c);assert.equal(turns,0);vm.runInContext('go(2);go(3);go(1);',c);assert.equal(turns,2);vm.runInContext('reduced.matches=true;go(2);',c);assert.equal(turns,2,'Reduced motion also suppresses page sound');
 assert(!source.includes('currentTime=')&&!source.includes('audio.play('),'No synchronous media seeking or media play promises on release');assert.equal(fs.readFileSync(path.join(root,'versions/v8/page-sound.js'),'utf8'),source);
 console.log('V8 buffered sound checks passed: one asynchronous decode, no playback wait, silent loading/locked/failure states, stale cue suppression, no overlaps, cancellation, and reduced motion.');
})().catch(error=>{console.error(error);process.exit(1)});
