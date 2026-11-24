const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),v11=path.join(dist,'versions/v11');
// V11 (November) is a separate edition from V9 (October): its own self-contained story data,
// not sourced from the shared stories.js at all — October's content is untouched by this file.
let root={innerHTML:''};
const context={window:{},document:{getElementById:id=>id==='newsletter'?root:null,querySelectorAll:()=>[],querySelector:()=>({style:{}}),documentElement:{scrollHeight:1000}},addEventListener:()=>{},innerHeight:800,scrollY:0,location:{hash:''}};
vm.runInNewContext(fs.readFileSync(path.join(v11,'v11.js'),'utf8'),context);
assert.equal(context.window.PITSTOP,undefined,'V11 must not read or create the shared window.PITSTOP — it is a fully separate edition');
const html=root.innerHTML;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const EXPECTED_CHAPTERS={business:4,builders:9,life:7,perspectives:1};
assert.equal((html.match(/data-story=/g)||[]).length,Object.values(EXPECTED_CHAPTERS).reduce((a,b)=>a+b,0),'one article per story');
for(const [chId,count] of Object.entries(EXPECTED_CHAPTERS)){
 const chapter=html.split(`<section class="chapter" id="${chId}"`)[1].split('</section>')[0];
 assert.equal((chapter.match(/data-story=/g)||[]).length,count,chId+' story count');
}

// Every card is a flip card — same pattern as V9: text-only teaser front, full story on the
// back, with its own close button, starting hidden from assistive tech.
const cards=[...html.matchAll(/<article class="story story-flip-card[^"]*" id="([a-z0-9]+)"[\s\S]*?<\/article>/g)];
assert.equal(cards.length,Object.values(EXPECTED_CHAPTERS).reduce((a,b)=>a+b,0),'every story must be a flip card');
for(const m of cards){
 const id=m[1],card=m[0];
 assert(card.includes(`id="${id}-front"`)&&card.includes(`id="${id}-back"`),id+' front/back faces present');
 assert(card.includes(`aria-controls="${id}-back"`),id+' front references its back face');
 assert(card.includes('← Back to summary'),id+' has a back-to-summary action');
 assert(card.includes('aria-hidden="true"'),id+' back face starts hidden');
 const frontTitle=card.match(/<span class="story-preview-title"[^>]*>([\s\S]*?)<\/span>(?=<span class="story-preview-summary")/)[1].replace(/<[^>]+>/g,'');
 const backHeading=card.match(/story-back"[\s\S]*?<h3[^>]*>(.*?)<\/h3>/)[1].replace(/<[^>]+>/g,'');
 assert.equal(frontTitle,backHeading,id+' front teaser and back heading show the same title');
}
assert(html.includes('story-preview-art'),'frontiernov keeps its front-face icon, matching how October treats its Frontier card');

// No leaked provenance, no accidental reuse of the same visual in two slots.
assert(!/slack\.com/.test(html),'no Slack links in the rendered page');
// frontiernov intentionally shows its icon on both front and back (same as V9's frontier card),
// so its src legitimately appears twice — every other story's visual should still be unique.
const imageSources=[...html.matchAll(/src="(assets\/[^"]+)"/g)].map(m=>m[1]);
const dupes=imageSources.filter((src,i)=>imageSources.indexOf(src)!==i);
assert.deepEqual(dupes,['assets/story-graphics/v11-frontier-stage.svg'],'only frontiernov’s intentional front+back icon reuse should duplicate');
for(const src of imageSources)if(src.startsWith('assets/story-graphics/'))assert(fs.statSync(path.join(dist,src)).size>0,src+' must exist on disk');

const entry=fs.readFileSync(path.join(v11,'index.html'),'utf8');
assert(entry.includes('<base href="../../">'));
assert(entry.includes('November 2026'),'masthead/title must say November, not October');
assert(!/stories\.js|sources\.js/.test(entry),'V11 must not load the shared V8/V9/V10 data file — it is a separate edition');
assert(html.includes('The November issue'));
assert(!html.includes('The October issue'),'must not carry over October\'s cover copy');

const versionsDir=fs.readdirSync(path.join(dist,'versions')).sort();
assert.deepEqual(versionsDir,['v10','v11','v14','v8','v9'],'V11 sits alongside, not instead of, the existing editions');
assert(fs.existsSync(path.join(dist,'versions/v9/v9.js')),'October (V9) must still exist untouched');

console.log(`V11 content passed: ${cards.length} stories across ${Object.keys(EXPECTED_CHAPTERS).length} chapters, all flip cards, self-contained data, October (V9) untouched.`);
