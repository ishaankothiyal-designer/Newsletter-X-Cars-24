const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),v9=path.join(dist,'versions/v9');
// V9 (October) was rebuilt from scratch around seven curated stories instead of the shared
// V8/V10 story list — it is now fully self-contained, like V11, and no longer reads or mutates
// the shared window.PITSTOP at all.
let root={innerHTML:''};
const context={window:{},document:{getElementById:id=>id==='newsletter'?root:null,querySelectorAll:()=>[],querySelector:()=>({style:{}}),documentElement:{scrollHeight:1000}},addEventListener:()=>{},innerHeight:800,scrollY:0,location:{hash:''}};
vm.runInNewContext(fs.readFileSync(path.join(v9,'v9.js'),'utf8'),context);
assert.equal(context.window.PITSTOP,undefined,'V9 must not read or create the shared window.PITSTOP — it is now a fully separate edition');
const html=root.innerHTML;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const EXPECTED_CHAPTERS={moment:1,business:2,impact:1,people:2,life:1};
assert.equal((html.match(/data-story=/g)||[]).length,Object.values(EXPECTED_CHAPTERS).reduce((a,b)=>a+b,0),'one article per story');
for(const [chId,count] of Object.entries(EXPECTED_CHAPTERS)){
 const chapter=html.split(`<section class="chapter" id="${chId}"`)[1].split('</section>')[0];
 assert.equal((chapter.match(/data-story=/g)||[]).length,count,chId+' story count');
}

// Every card is a flip card: text-only teaser front, full story on the back, with its own close
// button, starting hidden from assistive tech.
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

// No leaked provenance, no accidental reuse of the same visual within this page.
assert(!/slack\.com/.test(html),'no Slack links in the rendered page');
const imageSources=[...html.matchAll(/src="(assets\/[^"]+)"/g)].map(m=>m[1]);
const dupes=imageSources.filter((src,i)=>imageSources.indexOf(src)!==i);
assert.deepEqual(dupes,[],'no story should reuse the same visual twice on this page');
for(const src of imageSources)if(src.startsWith('assets/story-graphics/'))assert(fs.statSync(path.join(dist,src)).size>0,src+' must exist on disk');

assert(html.includes(`<p class="glossary">* ${esc('GMV – Gross Merchandise Value')}</p>`),'h1results must carry its GMV glossary footnote');
assert(html.includes('href="https://www.talktomilo.co/cars24"')&&html.includes('>Talk to Milo ↗'),'milo must keep its external link');

const entry=fs.readFileSync(path.join(v9,'index.html'),'utf8');
assert(entry.includes('<base href="../../">'));
assert(entry.includes('October 2026'),'masthead/title must still say October');
assert(!/stories\.js|sources\.js/.test(entry),'V9 no longer loads the shared V8/V10/V11 data file — it is now a separate, self-contained edition');
assert(!entry.includes('reader.js'),'The swipe reader must not intercept document scrolling');
assert(html.includes('The October issue'));
assert(html.includes('aria-label="Newsletter chapters"'));
assert(html.includes('Why this exists'),'the new opening section must state the newsletter’s purpose');

const versionsDir=fs.readdirSync(path.join(dist,'versions')).sort();
assert(versionsDir.includes('v9')&&versionsDir.includes('v11'),'V9 and V11 must both still exist as separate editions');

console.log(`V9 content passed: ${cards.length} curated stories across ${Object.keys(EXPECTED_CHAPTERS).length} chapters, all flip cards, self-contained data, opening agenda section present.`);
