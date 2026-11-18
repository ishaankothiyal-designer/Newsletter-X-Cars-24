/* V8 and V9 share the approved story list, labels and source objects. */
(() => {
'use strict';
const d=window.PITSTOP, root=document.getElementById('newsletter');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const href=id=>'versions/v9/#'+encodeURIComponent(id);
const asset=src=>esc(src);
const link=(url,label,cls='')=>/^https:\/\//.test(url||'')?`<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`:'';
// V9 is a clean, general-readership edition: no Slack-sourced provenance (names, channel links)
// is shown to readers, and a few cards carry V9-only copy and acronym footnotes. These overrides
// apply only here — V8 and V10 keep reading the shared story data in stories.js unchanged.
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
 // ecosystem's title/body override used to diverge from the shared stories.js text; dropped
 // since the shared copy already reads the same as the reference deck.
 startup:{
  detail:'The four tracks are lending & fintech, mobility & road safety, logistics & supply chain, and sovereign AI — all real problems Cars24 works on every day. Startups apply, get shortlisted, and spend time building before pitching to a jury. The top 20 get a month of mentorship in December, and winners share the ₹1 crore prize pool at the New Delhi finale. The idea: find founders already working on problems Cars24 cares about, and give them a reason to build with Cars24 instead of around it.'
 },
 frontier:{
  detail:'This isn’t a launch for one feature — it’s Cars24 opening up its entire effort to rebuild the company around AI, in front of the country. The event is positioned as India’s biggest AI summit: built to show what’s possible when a company goes AI-first across every part of the business, not just engineering.',
  // Swapped the photoreal "team at an AI event" illustration for a flat icon — on-brand with the
  // rest of the deck's artwork, and far lighter (a few KB of SVG vs. ~240KB of webp+jpg fallback).
  visual:{src:'assets/story-graphics/frontier.svg',fallbackSrc:'assets/story-graphics/frontier.svg',alt:'Three fanned cards opening together, standing in for many releases unveiled at once.',type:'spot'}
 },
 // lending's body override used to diverge from the shared stories.js text; dropped since the
 // shared copy already reads the same as the reference deck.
 lending:{glossary:C2C_GLOSS},
 miles:{
  body:'Miles is Cars24’s own app for its field agents — the people who visit dealers and customers in person (internally called FOS, short for Fleet on Street). The latest update lets them log visits with new dealers and loan customers on the spot: visits up 13% in two weeks, with 200+ previously untracked dealer visits now captured.',
  detail:'Miles replaced an expensive third-party tool the field team used to rely on, cutting the monthly cost by around 98% while building something tailored to how these agents actually work — planning routes, checking in and out of visits, and keeping customer details on hand without a laptop. It’s the backbone that makes a lot of the ground-level work in this newsletter possible.'
 },
 leads:{glossary:['AIRO – Cars24’s calling AI agent',C2C_GLOSS]},
 approvals:{glossary:C2C_GLOSS},
 ownership:{glossary:OWNERSHIP_GLOSS},
 // academy's body override used to diverge from the shared stories.js text in one clause only
 // ("frontline refreshers" vs. "CJ refreshers"); dropped since the shared copy already matches
 // the reference deck.
 // codex, diwali and miles keep their body overrides below (unlike the ones just removed) —
 // each one adds context that was specifically asked for (who Ishaan is, the honest framing on
 // uneven Diwali gifting, and what FOS stands for) that the shared/reference text doesn't have.
 codex:{body:'Ishaan, one of our design builders, trialled Codex — an AI coding tool — alongside Figma and produced a usable homepage draft, an estimated 20–30% effort saving. Production validation is still pending; next up is testing it across 23 SEO pages. Want to try the same workflow? Reach out to Ishaan.'},
 hackathon:{glossary:WECARE_GLOSS},
 diwali:{body:'Desi Fits Friday, a Diwali photo booth, festive snacks, games near the merch store, and a surprise gift countdown — the office went all out for Diwali this year. Gifts reached most desks on 5 November, though not every hub or office got there on time, and some ground staff got nothing right away; leadership said so directly rather than smoothing it over.'},
 survey:{link:'https://cars24.darwinbox.in/user/login',linkLabel:'Take the survey',glossary:WECARE_GLOSS},
 milo:{body:'Milo is a confidential AI wellbeing companion, now live on Slack; it is not a replacement for therapy.',link:'https://www.talktomilo.co/cars24',linkLabel:'Talk to Milo'},
 inflection:{glossary:OWNERSHIP_GLOSS}
};
// Two stories that don't exist in the shared V8/V10 data at all — new content, V9-only, added
// via the same extension point rather than touching stories.js (which V8's locked tests pin).
const V9_EXTRA={
 alba:{id:'alba',chapterId:'business',label:'United Arab Emirates · Retail',title:'Alba Cars joins the Cars24 family',body:'Cars24’s partnership with Alba brings an established showroom, team and premium retail experience into the United Arab Emirates. Alba keeps its name and showroom, with its existing leadership continuing to guide the team.\n\nCars24 adds technology, financing and services — together, the businesses now sell more than 1,000 cars a month.',visual:{src:'assets/story-graphics/alba.svg',fallbackSrc:'assets/story-graphics/alba.svg',alt:'A premium car showroom with glass frontage, a car and palms.',type:'spot'}},
 nach:{id:'nach',chapterId:'business',label:'NACH × Digio · Payments',title:'NACH payments are easier to track',body:'NACH (National Automated Clearing House) is how Cars24 collects loan payments from customer bank accounts. A new connection between Pennant, Digio and Cars24’s own records now shows teams exactly which payments succeeded, which failed, and why — with retries, an audit trail and failure alerts built in.\n\nIn its first cycle: 63,205 cases processed, 53,994 payments succeeded, and ₹20.40 crore collected.',visual:{src:'assets/story-graphics/nach.svg',fallbackSrc:'assets/story-graphics/nach.svg',alt:'A bank, payment flow and completed payment record.',type:'spot'}}
};
const V9_EXTRA_STYLE={alba:{paper:'mint-grid',layout:'open'},nach:{paper:'ice-grid',layout:'open'}};
const V9_EXTRA_BY_CHAPTER={business:['alba','nach']};
const chCount=ch=>ch.stories.filter(id=>!V9_HIDDEN.has(id)).length+(V9_EXTRA_BY_CHAPTER[ch.id]||[]).length;
function title(s){const mark=(d.colourSystem.pages[s.id]||{}).emphasis,at=mark?s.title.indexOf(mark):-1;return at<0?esc(s.title):esc(s.title.slice(0,at))+`<span class="headline-mark">${esc(mark)}</span>`+esc(s.title.slice(at+mark.length));}
function art(s){return `<figure class="art art-${esc(s.visual.type)}"><img src="${asset(s.visual.src)}" data-fallback="${asset(s.visual.fallbackSrc||s.visual.src)}" alt="${esc(s.visual.alt)}" loading="lazy" decoding="async" width="${s.visual.type==='spot'?400:1200}" height="${s.visual.type==='spot'?205:800}"></figure>`;}
function body(text){return text.split(/\n\n/).map(t=>`<p>${esc(t)}</p>`).join('');}
function glossaryHtml(s){return (Array.isArray(s.glossary)?s.glossary:[s.glossary]).filter(Boolean).map(g=>`<p class="glossary">* ${esc(g)}</p>`).join('');}
function story(id,size=''){
 if(V9_HIDDEN.has(id))return '';
 const base=V9_EXTRA[id]||d.stories.find(s=>s.id===id),s={...base,...(V9_OVERRIDES[id]||{})},style=d.colourSystem.pages[id]||V9_EXTRA_STYLE[id];
 const linkHtml=s.link?link(s.link,s.linkLabel||'Read more','story-link'):'';
 // Every card is a flip card: a text-only teaser up front, the full story (title, detail copy,
 // artwork, glossary) on the back. Markup/behaviour follows the card-flip reference — front is a
 // <button> that opens the back, the back has its own "Back to summary" button — but the content
 // comes from this story's own body/detail fields rather than being auto-scraped from the DOM.
 // Stories without hand-written `detail` copy (most of them) show their own body on the back too,
 // rather than requiring every story to carry two versions of itself.
 const frontId=`${esc(id)}-front`,backId=`${esc(id)}-back`;
 const frontArt=id==='frontier'?`<span class="story-preview-art">${art(s)}</span>`:'';
 const front=`<button type="button" class="story-face story-front" id="${frontId}" aria-controls="${backId}" aria-expanded="false" aria-label="${esc(s.title)} — tap to read more">${frontArt}<span class="story-preview-main"><span class="story-preview-kicker">${esc(s.label)}</span><span class="story-preview-title" id="title-${esc(id)}">${title(s)}</span><span class="story-preview-summary">${esc(s.body)}</span></span><span class="story-preview-cue"><span>Tap to read more</span><span class="story-preview-arrow" aria-hidden="true">↗</span></span></button>`;
 const back=`<div class="story-face story-back" id="${backId}" aria-hidden="true"><button type="button" class="story-back-action">← Back to summary</button><div class="story-back-content"><div class="story-inner"><div class="story-copy"><p class="eyebrow">More context</p><h3>${title(s)}</h3><div class="body">${body(s.detail||s.body)}</div>${glossaryHtml(s)}${linkHtml}</div>${art(s)}</div></div></div>`;
 return `<article class="story story-flip-card ${size} treatment-${esc(style.layout)}" id="${esc(id)}" data-story="${esc(id)}" data-paper="${esc(style.paper)}"><div class="story-flipper">${front}${back}</div></article>`;
}
const rows={business:story('growth','lead')+`<div class="pair">${story('ecosystem')}${story('alba')}</div><div class="pair">${story('lending')}${story('nach')}</div><div class="pair single">${story('startup')}</div>`,builders:`<div class="pair tech-opening">${story('academy')}${story('frontier')}</div>`+`<div class="release-list">${['dealer','miles','leads','approvals','saarathi','ownership','security'].map(id=>story(id,'release')).join('')}</div><div class="pair">${story('codex')}${story('hackathon')}</div>`,life:story('diwali','lead')+`<div class="pair">${story('milo')}${story('badminton')}</div><div class="pair">${story('survey')}${story('thermostat')}</div>`,perspectives:`<div class="pair voices">${['ambition','controls','inflection','safeguards'].map(id=>story(id,'voice')).join('')}</div>`};
root.innerHTML=`<section class="cover" id="cover" aria-labelledby="cover-title"><div class="cover-copy"><p class="eyebrow">The October issue <span aria-hidden="true">✦</span> 2026</p><h1 id="cover-title">The Pitstop</h1><p class="cover-subtitle">What’s happening<br> across Cars24.</p><a class="read-button" href="${href('briefing')}">Open this issue <span aria-hidden="true">↓</span></a><p class="cover-caption">${d.storyCount-V9_HIDDEN.size+Object.keys(V9_EXTRA).length} stories. Four chapters. One good catch-up.</p></div><figure class="cover-art"><picture><source media="(max-width:600px)" srcset="assets/cover-wide.webp"><img src="assets/cover-portrait.webp" data-fallback="assets/cover-portrait.png" alt="The original Pitstop colleagues gathered around their laptop." width="941" height="1672" fetchpriority="high"></picture></figure></section>
<section class="briefing wrap" id="briefing" aria-labelledby="briefing-title"><div class="briefing-intro"><p class="eyebrow">Your monthly catch-up</p><h2 id="briefing-title">In this issue</h2><p>Results, things we’ve built, and the people behind them.</p></div><div class="briefing-chapters">${d.chapters.map(ch=>`<a href="${href(ch.id)}"><span class="chapter-number">0${ch.number}</span><span>${esc(ch.name)}<small>${chCount(ch)} stories</small></span><span aria-hidden="true">↘</span></a>`).join('')}</div></section>
<nav class="chapter-nav" aria-label="Newsletter chapters"><div class="nav-inner"><a href="${href('cover')}" class="nav-top" aria-label="Back to top">↑</a>${d.chapters.map(ch=>`<a href="${href(ch.id)}" data-chapter="${ch.id}"><span>0${ch.number}</span> ${esc(({business:'Business',builders:'Tech',life:'Life',perspectives:'Voices'})[ch.id])}</a>`).join('')}<span class="nav-progress" aria-hidden="true"></span></div></nav>
<div class="wrap chapters">${d.chapters.map(ch=>`<section class="chapter" id="${ch.id}" aria-labelledby="heading-${ch.id}"><header class="chapter-heading"><span class="chapter-number">0${ch.number}</span><div><h2 id="heading-${ch.id}">${esc(ch.name)}</h2><p>${esc(ch.body)}</p></div><span class="chapter-count">${chCount(ch)} stories</span></header>${rows[ch.id]}<a class="chapter-return" href="${href('briefing')}">Back to contents ↑</a></section>`).join('')}</div>
<footer class="ending" id="caught-up"><p class="eyebrow">You’re all caught up <span aria-hidden="true">✦</span></p><h2>That’s this month’s Pitstop.</h2><p>Have a win, a lesson, or a teammate’s story for the next issue?</p>${link(d.form,'Add your story','read-button')}<a href="${href('cover')}" class="read-again">Read again ↑</a><div class="colophon"><img src="assets/cars24-logo-black.svg" alt="Cars24" width="80" height="22"><span>The Pitstop · October 2026 Edition</span></div></footer>`;
for(const el of document.querySelectorAll('[data-paper]')){const paper=el.dataset.paper;el.style.setProperty('--page-stock',d.colourSystem.stocks[paper].hex);el.style.setProperty('--paper-art',`url('../../assets/flatland/${paper}.svg')`);}
for(const img of document.querySelectorAll('img[data-fallback]'))img.addEventListener('error',()=>{if(img.dataset.fallback){img.src=img.dataset.fallback;delete img.dataset.fallback;}},{once:true});
// A few cards carry extra context on a flip side. Height animates between the collapsed teaser
// and the full back face — measured from each face's real content — and the hidden face is made
// properly inert (not just visually hidden) so keyboard/screen-reader users can't reach it.
for(const card of document.querySelectorAll('.story-flip-card')){
 const flipper=card.querySelector('.story-flipper'),front=card.querySelector('.story-front'),back=card.querySelector('.story-back'),backAction=card.querySelector('.story-back-action'),backContent=card.querySelector('.story-back-content');
 const previewHeight=()=>{
  // front is position:absolute with inset:0, so top/bottom:0 keep stretching it to the
  // flipper's current (possibly stale, taller) height even once height is cleared — bottom:0
  // still wins over height:auto. Taking it out of absolute positioning entirely is what lets
  // scrollHeight reflect its own content instead.
  const prevPos=front.style.position,prevH=front.style.height;
  front.style.position='static';front.style.height='auto';
  const h=Math.ceil(Math.max(280,front.scrollHeight));
  front.style.position=prevPos;front.style.height=prevH;
  return h;
 };
 const detailHeight=()=>Math.ceil(Math.max(280,backContent.scrollHeight));
 const size=open=>{flipper.style.height=(open?detailHeight():previewHeight())+'px';};
 const setOpen=(open,moveFocus)=>{
  card.classList.toggle('is-open',open);flipper.classList.toggle('is-flipped',open);
  front.setAttribute('aria-expanded',String(open));front.inert=open;
  back.inert=!open;back.setAttribute('aria-hidden',String(!open));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{size(open);if(moveFocus)(open?backAction:front).focus({preventScroll:true});}));
 };
 front.addEventListener('click',()=>setOpen(true,true));
 backAction.addEventListener('click',e=>{e.stopPropagation();setOpen(false,true);});
 back.addEventListener('click',e=>{if(e.target.closest('a,button'))return;setOpen(false,true);});
 requestAnimationFrame(()=>{size(false);setTimeout(()=>size(card.classList.contains('is-open')),120);});
 for(const img of backContent.querySelectorAll('img'))if(!img.complete)img.addEventListener('load',()=>size(card.classList.contains('is-open')),{once:true});
 addEventListener('resize',()=>size(card.classList.contains('is-open')),{passive:true});
}
// Native document scrolling: links, browser find, text selection, and keyboard reading all work normally.
const navLinks=[...document.querySelectorAll('[data-chapter]')],chapters=[...document.querySelectorAll('.chapter')];
let frame=0;function update(){frame=0;const active=chapters.filter(el=>el.getBoundingClientRect().top<=180).at(-1);for(const a of navLinks){if(a.dataset.chapter===active?.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.nav-progress').style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});addEventListener('resize',update);document.fonts?.ready.then(update);update();
// A base URL is used for V8's shared assets; restore this edition's story deep links after rendering.
const initialHash=location.hash;
if(initialHash){const loaded=document.readyState==='complete'?Promise.resolve():new Promise(resolve=>addEventListener('load',resolve,{once:true}));Promise.all([loaded,document.fonts?.ready]).then(()=>requestAnimationFrame(()=>{if(location.hash!==initialHash)return;let id;try{id=decodeURIComponent(initialHash.slice(1))}catch{return}document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'});}));}
})();
