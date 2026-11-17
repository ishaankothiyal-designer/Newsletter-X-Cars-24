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
const V9_HIDDEN=new Set(['dhanteras','security']);
const C2C_GLOSS='C2C – Cars24’s Consumer-to-Consumer marketplace, where everyday buyers purchase used cars from Cars24';
const OWNERSHIP_GLOSS='Deemed Ownership – lets a delivered car’s buyer act as the owner (insurance, challans) while the RC transfer is still in progress';
const WECARE_GLOSS='WeCare – Cars24’s internal employee-support ticketing system';
const V9_OVERRIDES={
 growth:{
  body:'GMV — the combined value of every car Cars24 buys and sells across India, UAE and Australia — grew 29% year-on-year to ₹5,300 crore+ in H1 FY27 (Apr–Sep 2026). Net revenue rose even faster, up 33%+ to ₹921 crore.',
  glossary:'GMV – Gross Merchandise Value',
  detail:'GMV tells you how much is moving through Cars24; net revenue tells you how much of that Cars24 actually earns — and it’s growing faster than GMV because more customers are buying financing, insurance and ownership services alongside the car, not just the car itself. H1’s ₹5,300 crore+ puts the full year on track for ₹12,000 crore+, and the EBITDA loss has narrowed to just ~1% of GMV — Cars24’s closest it’s been to breaking even at this scale.'
 },
 ecosystem:{
  title:'Insurance, FASTag & more: ecosystem services cross ₹160 Cr',
  body:'Cars24’s ecosystem services — insurance, FASTag, pollution checks and other ownership-journey add-ons — generated ₹160 Cr+ in margin, up 4x year on year. UAE and Australia also each crossed roughly 700 cars sold in a month for the first time, in September.'
 },
 startup:{
  body:'Cars24 is hosting the Grand Startup Challenge — an event inviting early-stage founders to build against four of the company’s hardest problems, with a ₹1 crore prize pool and a January 2027 finale in New Delhi.',
  detail:'The four tracks are lending & fintech, mobility & road safety, logistics & supply chain, and sovereign AI — all real problems Cars24 works on every day. Startups apply, get shortlisted, and spend time building before pitching to a jury. The top 20 get a month of mentorship in December, and winners share the ₹1 crore prize pool at the New Delhi finale. The idea: find founders already working on problems Cars24 cares about, and give them a reason to build with Cars24 instead of around it.'
 },
 frontier:{
  body:'Frontier ’26 is Cars24’s biggest event of the year: on 29 November in New Delhi, Cars24 and Deployment Inc will unveil 30+ first-of-their-kind AI releases — live, in a single day.',
  detail:'This isn’t a launch for one feature — it’s Cars24 opening up its entire effort to rebuild the company around AI, in front of the country. The event is positioned as India’s biggest AI summit: built to show what’s possible when a company goes AI-first across every part of the business, not just engineering.',
  visual:{src:'assets/story-graphics/frontier.svg',fallbackSrc:'assets/story-graphics/frontier.svg',alt:'A spotlighted AI chip on a stage under a night sky.',type:'spot'}
 },
 lending:{body:'Loans24 disbursed ₹22 crore across 414 loans in a single day to customers buying through Cars24’s C2C marketplace — twice last Navratri’s first day — alongside 771 car deliveries that same day.',glossary:C2C_GLOSS},
 miles:{
  body:'Miles is Cars24’s own app for its field agents — the people who visit dealers and customers in person (internally called FOS, short for Fleet on Street). The latest update lets them log visits with new dealers and loan customers on the spot: visits up 13% in two weeks, with 200+ previously untracked dealer visits now captured.',
  detail:'Miles replaced an expensive third-party tool the field team used to rely on, cutting the monthly cost by around 98% while building something tailored to how these agents actually work — planning routes, checking in and out of visits, and keeping customer details on hand without a laptop. It’s the backbone that makes a lot of the ground-level work in this newsletter possible.'
 },
 leads:{glossary:['AIRO – Cars24’s calling AI agent',C2C_GLOSS]},
 approvals:{glossary:C2C_GLOSS},
 ownership:{glossary:OWNERSHIP_GLOSS},
 academy:{body:'Bangalore’s first Cars24 training academy opened on 26 October. Frontline teams combine classroom refreshers with hands-on practice using real cars. The first sessions covered frontline refreshers.'},
 codex:{body:'Ishaan, one of our design builders, trialled Codex — an AI coding tool — alongside Figma and produced a usable homepage draft, an estimated 20–30% effort saving. Production validation is still pending; next up is testing it across 23 SEO pages. Want to try the same workflow? Reach out to Ishaan.'},
 hackathon:{glossary:WECARE_GLOSS},
 diwali:{body:'Desi Fits Friday, a Diwali photo booth, festive snacks, games near the merch store, and a surprise gift countdown — the office went all out for Diwali this year. Gifts reached most desks on 5 November, though not every hub or office got there on time, and some ground staff got nothing right away; leadership said so directly rather than smoothing it over.'},
 survey:{link:'https://cars24.darwinbox.in/user/login',linkLabel:'Take the survey',glossary:WECARE_GLOSS},
 milo:{body:'Milo is a confidential AI wellbeing companion, now live on Slack; it is not a replacement for therapy.',link:'https://www.talktomilo.co/cars24',linkLabel:'Talk to Milo'},
 inflection:{glossary:OWNERSHIP_GLOSS}
};
const FLIP_IDS=new Set(['growth','startup','frontier','miles']);
// Two stories with no equivalent in the shared V8/V10 data at all — new content, V9-only.
const V9_EXTRA={
 alba:{id:'alba',chapterId:'business',title:'Alba Cars joins the Cars24 family',body:'Cars24’s partnership with Alba brings an established showroom, team and premium retail experience into the United Arab Emirates. Alba keeps its name and showroom, with its existing leadership continuing to guide the team.\n\nCars24 adds technology, financing and services — together, the businesses now sell more than 1,000 cars a month.',visual:{src:'assets/story-graphics/alba.svg',fallbackSrc:'assets/story-graphics/alba.svg'}},
 nach:{id:'nach',chapterId:'business',title:'NACH payments are easier to track',body:'NACH (National Automated Clearing House) is how Cars24 collects loan payments from customer bank accounts. A new connection between Pennant, Digio and Cars24’s own records now shows teams exactly which payments succeeded, which failed, and why — with retries, an audit trail and failure alerts built in.\n\nIn its first cycle: 63,205 cases processed, 53,994 payments succeeded, and ₹20.40 crore collected.',visual:{src:'assets/story-graphics/nach.svg',fallbackSrc:'assets/story-graphics/nach.svg'}}
};
const visible=d.stories.filter(s=>!V9_HIDDEN.has(s.id));
const allVisible=[...visible,...Object.values(V9_EXTRA)];
assert.equal((html.match(/data-story=/g)||[]).length,allVisible.length,'one article per visible story, including V9-only extras');
for(const id of V9_HIDDEN)assert(!html.includes(`data-story="${id}"`),id+' must be hidden from V9');
for(const id of Object.keys(V9_EXTRA))assert(html.includes(`data-story="${id}"`),id+' V9-only extra must be present');

for(const base of allVisible){
 const s={...base,...(V9_OVERRIDES[base.id]||{})};
 assert.equal(html.split(`data-story="${s.id}"`).length-1,1,s.id+' must appear once');
 const artStart=html.lastIndexOf('<article',html.indexOf(`data-story="${s.id}"`));
 const card=html.slice(artStart,html.indexOf('</article>',artStart)+'</article>'.length);
 const heading=card.match(/<h3[^>]*>(.*?)<\/h3>/s)[1].replace(/<[^>]+>/g,'');
 assert.equal(heading,esc(s.title),s.id+' exact headline');
 for(const para of s.body.split(/\n\n/))assert(card.includes(`<p>${esc(para)}</p>`),s.id+' exact body paragraph (override applied where set)');
 for(const g of (Array.isArray(s.glossary)?s.glossary:[s.glossary]).filter(Boolean))assert(card.includes(`<p class="glossary">* ${esc(g)}</p>`),s.id+' glossary footnote: '+g);
 if(s.link)assert(card.includes(`href="${esc(s.link)}"`)&&card.includes(`>${esc(s.linkLabel)} ↗`),s.id+' override link');
 // No source-notes disclosure, no Slack credit/links, on any card in this edition.
 assert(!card.includes('Story notes & sources'),s.id+' must not show source notes');
 assert(!card.includes('class="notes"'),s.id+' must not render the notes disclosure');
 assert.equal(!!s.detail,FLIP_IDS.has(s.id),s.id+' flip-card status matches FLIP_IDS');
 if(s.detail){
  assert(card.includes('class="story flip'),s.id+' must carry the flip class');
  assert(card.includes('tabindex="0"')&&card.includes('role="button"'),s.id+' flip card must be keyboard-reachable');
  assert(card.includes('<p>'+esc(s.detail)+'</p>'),s.id+' back face must contain the detail text');
  assert(card.includes('flip-hint'),s.id+' must show a tap-for-more hint');
 } else {
  assert(!card.includes('story flip'),s.id+' non-flip card must not carry the flip class');
 }
 const chapter=html.split(`<section class="chapter" id="${s.chapterId}"`)[1].split('</section>')[0];
 assert(chapter.includes(`data-story="${s.id}"`),s.id+' retained in its chapter');
 for(const file of [s.visual.src,s.visual.fallbackSrc])assert(fs.statSync(path.join(dist,file)).size>0,s.id+' visual asset (override applied where set) must exist on disk');
}
assert(!/slack\.com/.test(html),'no Slack links anywhere in the rendered V9 page');
assert(!html.includes('sourceCredit'),'no leaked sourceCredit markup');

const entry=fs.readFileSync(path.join(v9,'index.html'),'utf8');
assert(entry.includes('<base href="../../">'));assert(entry.includes('src="stories.js?v=dhanteras-1"'));assert(entry.includes('src="sources.js"'));
assert(!entry.includes('reader.js'),'The swipe reader must not intercept document scrolling');
assert(!/inert|aria-hidden="true"[^>]*data-story/.test(html));
assert(html.includes('aria-label="Newsletter chapters"'));
assert(html.includes(esc(d.form)));
console.log(`V9 content passed: ${allVisible.length} visible stories (Dhanteras+security hidden, Alba+NACH added), overrides and glossary footnotes applied, no Slack provenance rendered, shared data unchanged.`);
