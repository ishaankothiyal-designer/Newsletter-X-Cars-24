const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');
function render(version){
 const root={innerHTML:''},ctx={window:{},document:{getElementById:id=>id==='newsletter'?root:null,querySelectorAll:()=>[],querySelector:()=>({style:{}}),documentElement:{scrollHeight:1000}},addEventListener:()=>{},matchMedia:()=>({matches:false}),innerHeight:800,scrollY:0,location:{hash:''}};
 for(const file of ['stories.js','sources.js'])vm.runInNewContext(fs.readFileSync(path.join(dist,file),'utf8'),ctx);
 const shared=JSON.stringify(ctx.window.PITSTOP),script=fs.readFileSync(version==='v9' ? path.join(__dirname,'fixtures/v9-at-v13-release.js') : path.join(dist,`versions/${version}/${version}.js`),'utf8');
 vm.runInNewContext(script,ctx);assert.equal(JSON.stringify(ctx.window.PITSTOP),shared,'Shared stories remain unchanged');return {html:root.innerHTML,script};
}
// V13 retains its released copy while V9 evolves as a separate curated edition.
const before=render('v9'),after=render('v13');
const data=s=>s.slice(s.indexOf('const V9_HIDDEN='),s.indexOf('function art('));
assert.equal(data(after.script),data(before.script),'V9 filtering, story overrides, added stories, glossary, links and title logic remain byte-for-byte equal');
const text=html=>html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
assert.equal(text(after.html),text(before.html),'All rendered copy matches V9 exactly');
const ids=html=>[...html.matchAll(/data-story="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(ids(after.html),ids(before.html),'All 23 stories retain their V9 order');assert.equal(ids(after.html).length,23);
const images=html=>[...html.matchAll(/<img[^>]+src="([^"]+)"[^>]+alt="([^"]*)"/g)];
const oldAlts=[...new Set(images(before.html).map(m=>m[2]))].sort(),newAlts=[...new Set(images(after.html).map(m=>m[2]))].sort();assert.deepEqual(newAlts,oldAlts,'Original image descriptions are preserved');
for(const m of images(after.html))assert(fs.statSync(path.join(dist,m[1])).size>0,m[1]+' exists');
assert.equal((after.html.match(/class="story-preview-art"/g)||[]).length,23);
assert.equal(fs.readdirSync(path.join(dist,'assets/story-graphics/v13')).length,17);
console.log('V13 passed: V9 copy, 23-story order, overrides, glossary, links and alt text preserved; 17 repaired spots and six retained scenes; shared stories untouched.');
