const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'../dist'),source=fs.readFileSync(path.join(root,'page-sound.js'),'utf8');
async function main(){
 const events={},attrs={},stored=new Map(),mediaEvents={};let time=0,plays=0,pauses=0,nextPlay=()=>Promise.resolve();
 const controls={};for(const id of ['page-sound','test-page-sound'])controls[id]={addEventListener:(name,fn)=>events[id+'-'+name]=fn,setAttribute:(k,v)=>attrs[id+k]=v};
 const audio={readyState:4,ended:false,attrs:{},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},addEventListener:(name,fn)=>mediaEvents[name]=fn,pause(){pauses++},play(){plays++;return nextPlay()}};
 const document={hidden:false,currentScript:{src:'https://example.test/versions/v8/page-sound.js'},getElementById:id=>controls[id],createElement:()=>audio,body:{append(){}},addEventListener:(name,fn)=>events[name]=fn};
 const window={},localStorage={getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v)};
 const flush=async()=>{await Promise.resolve();await Promise.resolve()};
 vm.runInNewContext(source,{window,document,localStorage,URL,Date,Promise,performance:{now:()=>time}});
 assert.equal(plays,0,'No autoplay at load');assert.equal(audio.preload,'auto');assert.equal(audio.src,'https://example.test/versions/v8/assets/page-turn-soft.wav');
 events.pointerdown();assert(audio.muted,'Contact warm-up is silent');await flush();assert(!audio.muted);assert.equal(audio.attrs['data-state'],'ready');
 window.PITSTOP_SOUND.play();await flush();assert.equal(audio.attrs['data-state'],'playing');assert.equal(audio.currentTime,0);assert(audio.volume===1);
 mediaEvents.ended();assert.equal(audio.attrs['data-state'],'ended');
 events['page-sound-click']();assert.equal(stored.get('pitstop-v8-page-sound'),'off');assert(controls['test-page-sound'].disabled);const count=plays;window.PITSTOP_SOUND.play();assert.equal(plays,count);
 events['page-sound-click']();await flush();assert.equal(audio.attrs['data-state'],'playing','Enabling sound gives an audible preview');
 events['test-page-sound-click']();await flush();assert.equal(audio.attrs['data-state'],'playing');assert(pauses>=3,'Turns restart the same player rather than overlapping');
 document.hidden=true;events.visibilitychange();const hiddenPlays=plays;window.PITSTOP_SOUND.play();assert.equal(plays,hiddenPlays);document.hidden=false;
 // Pending native playback must not be restarted by touchend.
 let pendingResolve;nextPlay=()=>new Promise(resolve=>pendingResolve=resolve);window.PITSTOP_SOUND.play();const pendingPlays=plays;events.touchend();assert.equal(plays,pendingPlays);pendingResolve();await flush();
 // A sound delayed beyond its visual cue is suppressed; a smaller delay is trimmed.
 let lateResolve;nextPlay=()=>new Promise(resolve=>lateResolve=resolve);time=100;window.PITSTOP_SOUND.play();time=220;lateResolve();await flush();assert.equal(audio.attrs['data-state'],'late-skipped');
 nextPlay=()=>Promise.resolve();time=300;window.PITSTOP_SOUND.play({startedAt:260,duration:260});await flush();assert(audio.currentTime>0,'Trim to the current animation phase');
 nextPlay=()=>Promise.reject({name:'NotAllowedError'});window.PITSTOP_SOUND.play();await flush();assert.equal(audio.attrs['data-state'],'blocked');nextPlay=()=>Promise.resolve();events.touchend();await flush();assert.equal(audio.attrs['data-state'],'playing','Blocked swipe retries within touchend activation');
 // A late silent warm-up must not pause a newly committed turn.
 let resolvePrime;const raceAudio={...audio,attrs:{},play(){return nextPlay()}};const raceWindow={},raceEvents={};
 nextPlay=()=>new Promise(resolve=>resolvePrime=resolve);
 vm.runInNewContext(source,{window:raceWindow,document:{...document,createElement:()=>raceAudio,addEventListener:(name,fn)=>raceEvents[name]=fn},localStorage,URL,Date,Promise,performance:{now:()=>time}});
 raceEvents.pointerdown();nextPlay=()=>Promise.resolve();raceWindow.PITSTOP_SOUND.play();await flush();const beforePause=pauses;resolvePrime();await flush();assert.equal(pauses,beforePause);assert.equal(raceAudio.attrs['data-state'],'playing');assert(!raceAudio.muted);
 const wav=fs.readFileSync(path.join(root,'assets/page-turn-soft.wav'));assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.readUInt32LE(24),44100);assert(wav.length<40000);let sum=0;for(let i=44;i<wav.length;i+=2)sum+=(wav.readInt16LE(i)/32768)**2;const rms=Math.sqrt(sum/((wav.length-44)/2));assert(rms>.015&&rms<.05,'Paper sound must be soft, not a loud noise burst');
 // Sound is tied to committed animated navigation, not drag samples or jumps.
 const reader=fs.readFileSync(path.join(root,'reader.js'),'utf8'),go=reader.slice(reader.indexOf('function go('),reader.indexOf('\nfunction target('));let turns=0;
 const context=vm.createContext({window:{PITSTOP_SOUND:{play:()=>turns++}},cards:Array.from({length:3},()=>({querySelector:()=>({scrollTop:0})})),pages:[{id:'a',kind:'cover'},{id:'b',kind:'overview'},{id:'c',kind:'ending'}],cancel(){},settle(){},performance:{now:()=>time},$:()=>({}),Math});
 vm.runInContext('let current=0;'+go+';go(0);go(-1);go(1,false);',context);assert.equal(turns,0);
 vm.runInContext('go(2);go(3);go(1);',context);assert.equal(turns,2,'One sound per actual animated card change');
 assert.equal(fs.readFileSync(path.join(root,'versions/v8/page-sound.js'),'utf8'),source);
 console.log('V8 native sound checks passed: silent load/warm-up, preloaded audible clip, gesture retry, warm-up race protection, persistent mute, test playback, no overlaps, and committed-turn integration.');
}
main().catch(e=>{console.error(e);process.exit(1)});
