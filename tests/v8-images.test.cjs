const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'../dist'),script=fs.readFileSync(path.join(root,'reader-images.js'),'utf8');
function image(source='assets/a.png',fallback='assets/a.svg'){
 const frame={dataset:{},buttons:[],querySelector(){return this.buttons[0]},append(button){this.buttons.push(button);button.remove=()=>this.buttons.splice(this.buttons.indexOf(button),1)}};
 return{dataset:{src:source,fallback},complete:false,naturalWidth:0,closest:()=>frame,parentElement:frame,removeAttribute(key){if(key==='data-ready')delete this.dataset.ready},decode:()=>Promise.resolve(),frame};
}
async function main(){
 const window={},document={baseURI:'https://example.test/versions/v8/',createElement:()=>({setAttribute(){},addEventListener(name,fn){this[name]=fn}})};
 vm.runInNewContext(script,{window,document,URL,Date,WeakMap,Set,Promise});const {load,warm}=window.PITSTOP_IMAGES;
 const flush=async()=>{await Promise.resolve();await Promise.resolve()};
 const img=image();load(img);assert.equal(img.src,'assets/a.png');assert.equal(img.loading,'eager');assert.equal(img.frame.buttons.length,0);
 img.onerror();assert.equal(img.src,'assets/a.svg','Real alternate artwork is used if the primary request fails');img.onload();await flush();assert.equal(img.dataset.ready,'true');
 warm([{querySelectorAll:()=>[img]}],0);assert.equal(img.src,'assets/a.svg','Warming again must not reset an already successful fallback');
 const failed=image();load(failed);failed.onerror();failed.onerror();assert(failed.src.includes('image-retry='));failed.onerror();failed.onerror();assert.equal(failed.frame.buttons.length,1,'Retries are bounded');
 failed.frame.buttons[0].click({preventDefault(){},stopPropagation(){}});assert.equal(failed.src,'assets/a.png');assert.equal(failed.frame.buttons.length,0,'User can retry a genuine failure');
 const undecodable=image();load(undecodable);undecodable.decode=()=>Promise.reject(new Error('decode failed'));undecodable.onload();await flush();assert.equal(undecodable.src,'assets/a.svg','Decode failures get the same fallback as network failures');
 const changing=image();let resolve;changing.decode=()=>new Promise(r=>resolve=r);load(changing);changing.onload();load(changing,'assets/new.png','assets/new.svg');resolve();await flush();assert(!changing.dataset.ready,'A stale decode must not reveal a replacement that is still loading');changing.decode=()=>Promise.resolve();changing.onload();await flush();assert.equal(changing.dataset.ready,'true');
 const cards=Array.from({length:12},(_,i)=>{const im=image('assets/'+i+'.png');return{im,querySelectorAll:()=>[im]}});warm(cards,0);
 for(let i=0;i<12;i++)assert.equal(!!cards[i].im.src,[0,1,2,3,4,10,11].includes(i),'Only current and neighbouring cards load');
 assert.equal(cards[0].im.fetchPriority,'high');assert.equal(cards[1].im.fetchPriority,'low');
 assert.equal(fs.readFileSync(path.join(root,'versions/v8/reader-images.js'),'utf8'),script);
 console.log('V8 image checks passed: advance loading, decode readiness, network/decode fallbacks, bounded retries, source races, and current-card priority.');
}
main().catch(error=>{console.error(error);process.exit(1)});
