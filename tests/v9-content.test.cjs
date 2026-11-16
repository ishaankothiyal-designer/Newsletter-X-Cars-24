const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),v9=path.join(dist,'versions/v9');
let root={innerHTML:''};
const context={window:{},document:{getElementById:id=>id==='newsletter'?root:null,querySelectorAll:()=>[],querySelector:()=>({style:{}}),documentElement:{scrollHeight:1000}},addEventListener:()=>{},innerHeight:800,scrollY:0,location:{hash:''}};
vm.runInNewContext(fs.readFileSync(path.join(dist,'stories.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(dist,'sources.js'),'utf8'),context);
const before=JSON.stringify(context.window.PITSTOP);
vm.runInNewContext(fs.readFileSync(path.join(v9,'v9.js'),'utf8'),context);
assert.equal(JSON.stringify(context.window.PITSTOP),before,'V9 must not mutate the shared story data');
const html=root.innerHTML,d=context.window.PITSTOP;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// V9 is a cleaned, general-readership edition: it deliberately diverges from the shared
// V8/V10 story data in three ways — no Slack provenance shown to readers, V9-only copy on
// three cards, and the Dhanteras card omitted entirely. This is intentional product scope,
// not a mirror of V8 (unlike V8 <-> its /versions/v8/ copy, which must stay byte-identical).
const V9_HIDDEN=new Set(['dhanteras']);
const C2C_GLOSS='C2C – Cars24’s consumer car buying & selling flow';
const OWNERSHIP_GLOSS='Deemed Ownership – lets a delivered car’s buyer act as the owner (insurance, challans) while the RC transfer is still in progress';
const WECARE_GLOSS='WeCare – Cars24’s internal employee-support ticketing system';
const V9_OVERRIDES={
 growth:{body:'GMV grew about 29% year on year to ₹5,300 crore+, while adjusted net revenue rose over 33% to ₹921 crore. EBITDA loss narrowed to around 1% of GMV.',glossary:'GMV – Gross Merchandise Value'},
 frontier:{body:'Cars24 and Deployment Inc will unveil 30+ AI releases in New Delhi on 29 November, part of CEO Vikram Chopra’s push to rebuild the company around AI.'},
 lending:{body:'C2C and Loans24 recorded 414 disbursals and ₹22 crore disbursed in a single day — twice last Navratri’s first day — alongside 771 deliveries.',glossary:C2C_GLOSS},
 miles:{body:'FOS can record ad-hoc visits with new dealers and loan customers. The release targets 15% more monthly visits and 10% more leads entering the system.',glossary:'FOS – Fleet on Street'},
 leads:{glossary:['AIRO – Cars24’s calling AI agent',C2C_GLOSS]},
 approvals:{glossary:C2C_GLOSS},
 ownership:{glossary:OWNERSHIP_GLOSS},
 academy:{body:'Bangalore’s first Cars24 training academy opened on 26 October. Frontline teams combine classroom refreshers with hands-on practice using real cars. The first sessions covered frontline refreshers.'},
 hackathon:{glossary:WECARE_GLOSS},
 diwali:{body:'The Diwali gifts may have taken a little longer than planned, but the thought behind them was always to share the warmth and joy of the festival.'},
 survey:{link:'https://cars24.darwinbox.in/user/login',linkLabel:'Take the survey',glossary:WECARE_GLOSS},
 milo:{body:'Milo is a confidential AI wellbeing companion, now live on Slack; it is not a replacement for therapy.',link:'https://www.talktomilo.co/cars24',linkLabel:'Talk to Milo'},
 inflection:{glossary:OWNERSHIP_GLOSS}
};
const visible=d.stories.filter(s=>!V9_HIDDEN.has(s.id));
assert.equal((html.match(/data-story=/g)||[]).length,visible.length,'one article per visible story');
for(const id of V9_HIDDEN)assert(!html.includes(`data-story="${id}"`),id+' must be hidden from V9');

for(const base of visible){
 const s={...base,...(V9_OVERRIDES[base.id]||{})};
 assert.equal(html.split(`data-story="${s.id}"`).length-1,1,s.id+' must appear once');
 const card=html.split(`data-story="${s.id}"`)[1].split('</article>')[0];
 const heading=card.match(/<h3[^>]*>(.*?)<\/h3>/s)[1].replace(/<[^>]+>/g,'');
 assert.equal(heading,esc(s.title),s.id+' exact headline');
 assert(card.includes(`<p>${esc(s.body)}</p>`),s.id+' exact body (override applied where set)');
 for(const g of (Array.isArray(s.glossary)?s.glossary:[s.glossary]).filter(Boolean))assert(card.includes(`<p class="glossary">* ${esc(g)}</p>`),s.id+' glossary footnote: '+g);
 if(s.link)assert(card.includes(`href="${esc(s.link)}"`)&&card.includes(`>${esc(s.linkLabel)} ↗`),s.id+' override link');
 // No source-notes disclosure, no Slack credit/links, on any card in this edition.
 assert(!card.includes('Story notes & sources'),s.id+' must not show source notes');
 assert(!card.includes('class="notes"'),s.id+' must not render the notes disclosure');
 const chapter=html.split(`<section class="chapter" id="${s.chapterId}"`)[1].split('</section>')[0];
 assert(chapter.includes(`data-story="${s.id}"`),s.id+' retained in its chapter');
 for(const file of [base.visual.src,base.visual.fallbackSrc])assert(fs.statSync(path.join(dist,file)).size>0);
}
assert(!/slack\.com/.test(html),'no Slack links anywhere in the rendered V9 page');
assert(!html.includes('sourceCredit'),'no leaked sourceCredit markup');

const entry=fs.readFileSync(path.join(v9,'index.html'),'utf8');
assert(entry.includes('<base href="../../">'));assert(entry.includes('src="stories.js?v=dhanteras-1"'));assert(entry.includes('src="sources.js"'));
assert(!entry.includes('reader.js'),'The swipe reader must not intercept document scrolling');
assert(!/inert|aria-hidden="true"[^>]*data-story/.test(html));
assert(html.includes('aria-label="Newsletter chapters"'));
assert(html.includes(esc(d.form)));
console.log(`V9 content passed: ${visible.length} visible stories (Dhanteras hidden), overrides and glossary footnotes applied, no Slack provenance rendered, shared data unchanged.`);
