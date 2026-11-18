const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');
function render(version){
 const root={innerHTML:''},ctx={window:{},document:{getElementById:id=>id==='newsletter'?root:null,querySelectorAll:()=>[],querySelector:()=>({style:{}}),documentElement:{scrollHeight:1000}},addEventListener:()=>{},matchMedia:()=>({matches:false}),innerHeight:800,scrollY:0,location:{hash:''}};
 const script=fs.readFileSync(path.join(dist,`versions/${version}/${version}.js`),'utf8');
 vm.runInNewContext(script,ctx);return {html:root.innerHTML,script};
}
const before=render('v11'),after=render('v12');
const storyData=s=>s.slice(s.indexOf('const STORIES=['),s.indexOf('const BY_ID='));
assert.equal(storyData(after.script).replaceAll('assets/story-graphics/v12/','assets/story-graphics/v11-'),storyData(before.script),'Every V11 story field and all copy must remain byte-for-byte equal apart from illustration paths');
const text=html=>html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
assert.equal(text(after.html),text(before.html),'All rendered page copy must match V11 exactly');
assert.equal((after.html.match(/data-story=/g)||[]).length,21);
for(const source of after.html.matchAll(/src="(assets\/story-graphics\/v12\/[^"]+)"/g))assert(fs.statSync(path.join(dist,source[1])).size>0,source[1]+' exists');
assert.equal((after.html.match(/class="story-preview-art"/g)||[]).length,21,'All cards have a contained illustration on the front');
assert(after.script.includes("front.inert=open")&&after.script.includes('back.inert=!open'),'Hidden faces remain inaccessible to keyboard navigation');
assert(after.script.includes("cue.setAttribute('aria-hidden','true')"),'The pointer cue must not repeat content for assistive technology');
console.log('V12 passed: all 21 V11 stories and page copy preserved exactly, 21 illustrated cards, all assets exist, accessible disclosure and pointer cue.');
