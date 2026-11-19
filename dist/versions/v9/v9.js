/* V9: The Pitstop, October 2026 edition — rebuilt from scratch around seven stories instead of
   a long roll call of updates. Fully self-contained (no dependency on the shared stories.js):
   nothing here needs to match the old shared story list anymore, since the brief was quality
   over quantity, not "as many cards as last time." Markup, CSS and behaviour are the same
   continuous-read, flip-card design the earlier editions used; only the content and chapter
   shape change. */
(() => {
'use strict';
const root=document.getElementById('newsletter');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const href=id=>'versions/v9/#'+encodeURIComponent(id);
const asset=src=>esc(src);
const link=(url,label,cls='')=>/^https:\/\//.test(url||'')?`<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`:'';
const STOCKS={
 'cream-grid':'#FFF7E8','blue-grid':'#80C5FF','green-grid':'#C6E496','pink-grid':'#F9D1F4',
 'yellow-grid':'#FAFFAD','mint-grid':'#CAFAE0','ice-grid':'#E7F2FF','magenta-grid':'#EF5FA3'
};
const FORM='https://script.google.com/a/macros/cars24.com/s/AKfycbyBB0mU8dp6ACiQnm6Mss1npu9BBgF4ETae3TOrvmbgxAdAY4XuIP5BnA0tsV_ztX_4/exec';
// Source: #announcements and #sas-office-announcement, 1-31 Oct 2026. Seven stories, picked for
// what they actually show about the month rather than for coverage - a deliberate cut from the
// twenty-plus-card editions that came before. Milo keeps its own link and short framing, same as
// earlier editions; everything else is written fresh from the original Slack posts.
const STORIES=[
 {id:'navratri',chapterId:'moment',label:'The first day of Navratri',title:'770 customers, one Sunday, and a 3 am handover',
  body:'On the first day of Navratri, 770 customers drove home in a car Cars24 helped them buy - 50% more than any single day before it. The number is the easy part to tell. The harder part is everything that made it possible, and what it cost some hubs to get there.',
  detail:'A customer in Dombivli wanted delivery at 3 am because the hour was auspicious. His delivery coordinator and car advisor stayed, handed over the keys at 3 am, and were back at the hub on time the next morning - nobody asked them to.\n\nAcross hubs, people who didn’t have to be there showed up anyway: wholesale staff doing handovers, RTO and finance teams working the counter, a customer buying his third car from Cars24 in a row. One line captured the day best: “Mumma, meri gaadi.”\n\nBut the full account didn’t stop at the number. At peak footfall, some hubs couldn’t cope, and customers waited longer than they should have - said out loud, not smoothed over, by the same post celebrating the day. Both things were true at once: the best day the retail team has had, and a system that still has work to do before the next one.',
  visual:{src:'assets/story-graphics/v9r-navratri.svg',fallbackSrc:'assets/story-graphics/v9r-navratri.svg',alt:'A car at night beside a glowing diya, with stars above.',type:'spot'},
  style:{paper:'blue-grid',layout:'feature',emphasis:'770 customers'}},
 {id:'h1results',chapterId:'business',label:'H1 FY27 · Results',title:'A return to growth, on stronger economics',
  body:'GMV grew 29% year-on-year to ₹5,300 crore+ in H1 FY27, and net revenue grew even faster - up 33%+ to ₹921 crore - as more customers bought financing, insurance and ownership services alongside the car itself. The EBITDA loss narrowed to roughly 1% of GMV, the closest Cars24 has been to breaking even at this scale.',
  detail:'Two numbers tell the deeper story: consumer market share has grown from 35% to 45% over two years, and consumer deliveries grew 68% year-on-year in H1. Ecosystem services and insurance added ₹160 crore+ in margin, up 4x year-on-year, and UAE and Australia each crossed roughly 700 cars in a month for the first time in September.\n\nThe plan for H2: win Consumer India, deepen the ownership relationship, and grow more efficiently - targeting roughly 8,000 consumer deliveries a month and a ₹1,200 crore GMV run rate by December.',
  glossary:'GMV – Gross Merchandise Value',
  visual:{src:'assets/story-graphics/growth.svg',fallbackSrc:'assets/story-graphics/growth.svg',alt:'A car climbing a rising road, standing in for growth.',type:'spot'},
  style:{paper:'green-grid',layout:'poster',emphasis:'29%'}},
 {id:'frontier',chapterId:'business',label:'Coming up · 29 November',title:'Frontier ’26: built in India, for the world',
  body:'On 29 November, Cars24 and Deployment Inc will unveil 30+ first-of-their-kind AI releases in a single day in New Delhi - and open up the company’s entire effort to rebuild itself around AI. Cars24 is calling it Frontier ’26.',
  detail:'“Audacity is the only moat,” is how the day was framed internally - the idea that AI has opened up possibilities that would have sounded unreasonable a few years ago, and that a moment like this deserves the full extent of the company’s ambition. Every release is meant to push what AI can do in the real world; together, they’re meant to change how people expect technology to work at all.\n\n100 seats are open for Cars24 employees to attend in person. We’ll bring you what actually happened on the day in the next issue.',
  visual:{src:'assets/story-graphics/frontier.svg',fallbackSrc:'assets/story-graphics/frontier.svg',alt:'Three fanned cards opening together, standing in for many releases unveiled at once.',type:'spot'},
  style:{paper:'yellow-grid',layout:'poster',emphasis:'29 November'}},
 {id:'crashfree',chapterId:'impact',label:'Crashfree India · Jaipur',title:'13 families, two weeks, and an invisible fix',
  body:'In the last 15 days, 13 families in Jaipur were approved for compensation under the hit-and-run scheme - against a run rate of 2-3 a month for the rest of the year. Every one of those 13 claims had been stuck for 7+ months: a policy nuance here, a desk nobody owned there.',
  detail:'The piece this story is proudest of: none of those 13 families will know what moved their claim. All they’ll see is compensation they applied for months ago, finally landing in their account - which is the actual goal. An invisible hand, doing its job well enough that on-time compensation stops being news and starts being normal.\n\nIt’s not a victory lap. 13 is small. What it proves is the approach - and a clear map of exactly where claims get stuck, for Crashfree India’s team to keep clearing on the ground in Jaipur.',
  visual:{src:'assets/story-graphics/v9r-crashfree.svg',fallbackSrc:'assets/story-graphics/v9r-crashfree.svg',alt:'A small house with a check mark, representing a family’s claim approved.',type:'spot'},
  style:{paper:'pink-grid',layout:'feature',emphasis:'13 families'}},
 {id:'milo',chapterId:'people',label:'Wellbeing · New on Slack',title:'Meet Milo',
  body:'Milo is a confidential AI wellbeing companion, now live on Slack - somewhere to think out loud about a conversation you keep replaying, a decision you’re stuck on, or just the Sunday-evening feeling before a big week.',
  detail:'Milo isn’t a replacement for therapy or a therapist - think of it as a place to start when something’s on your mind. If things ever feel heavier than that, Cars24’s wellness team is reachable directly, no reason required.',
  link:'https://www.talktomilo.co/cars24',linkLabel:'Talk to Milo',
  visual:{src:'assets/story-graphics/v9r-milo.svg',fallbackSrc:'assets/story-graphics/v9r-milo.svg',alt:'A chat bubble beside a calm crescent moon.',type:'spot'},
  style:{paper:'ice-grid',layout:'poster'}},
 {id:'hubs',chapterId:'people',label:'Network · Three cities',title:'New hubs in Dehradun and Hyderabad, and a training floor in Bengaluru',
  body:'October added a new hub in Dehradun - Cars24’s first there - and moved the Hyderabad hub from Bachupally to Kukatpally. Both were inaugurated by top-performing frontline teammates, with Dehradun’s launch built specifically around celebrating their families too.',
  detail:'In Bengaluru, Cars24’s first training academy opened in Jakkur: classroom refreshers paired with hands-on practice on real cars, run in batches across all 90 Bangalore CJs and 15 WSMs. Day one covered the customer journey - connecting the lesson straight back to the floor.',
  visual:{src:'assets/story-graphics/v11-hubs.svg',fallbackSrc:'assets/story-graphics/v11-hubs.svg',alt:'Location pins lighting up one after another on a map.',type:'spot'},
  style:{paper:'mint-grid',layout:'poster'}},
 {id:'funcorner',chapterId:'life',label:'Overheard at Cars24',title:'Akbar, Birbal, and a pre-delivery inspection',
  body:'Cars24’s first-ever PDI brand film brought back Akbar and Birbal - this time, Birbal’s inspecting cars, not sawaaris: “Zamana badle, sawaari badle… par jaanch har sawaari ki honi chahiye.”',
  detail:'Also this month: the badminton championship crowned its winners, then added its own honest postscript - “we had fewer women participants than we’d hoped, and we’d genuinely love to change that next time.” And in the week before Diwali, one Slack message simply said “Kuch toh pak raha hai…” and the entire office spent a week guessing what.',
  visual:{src:'assets/story-graphics/v9r-fun.svg',fallbackSrc:'assets/story-graphics/v9r-fun.svg',alt:'A small crown beside a badminton racquet and shuttlecock.',type:'spot'},
  style:{paper:'magenta-grid',layout:'poster'}}
];
const BY_ID=Object.fromEntries(STORIES.map(s=>[s.id,s]));
const CHAPTERS=[
 {id:'moment',name:'The Moment',body:'The one story worth slowing down for this month.',number:1,
  stories:['navratri']},
 {id:'business',name:'Business & Ambition',body:'Where the numbers stand, and what’s next.',number:2,
  stories:['h1results','frontier']},
 {id:'impact',name:'Beyond Cars24',body:'The work that matters outside our own numbers.',number:3,
  stories:['crashfree']},
 {id:'people',name:'People',body:'New support, and new places to find Cars24.',number:4,
  stories:['milo','hubs']},
 {id:'life',name:'Fun Corner',body:'The lighter side of the month.',number:5,
  stories:['funcorner']}
];
const chCount=ch=>ch.stories.length;
const storyWord=n=>n===1?'story':'stories';
function title(s){const mark=s.style.emphasis,at=mark?s.title.indexOf(mark):-1;return at<0?esc(s.title):esc(s.title.slice(0,at))+`<span class="headline-mark">${esc(mark)}</span>`+esc(s.title.slice(at+mark.length));}
function art(s){return `<figure class="art art-${esc(s.visual.type)}"><img src="${asset(s.visual.src)}" data-fallback="${asset(s.visual.fallbackSrc||s.visual.src)}" alt="${esc(s.visual.alt)}" loading="lazy" decoding="async" width="${s.visual.type==='spot'?400:1200}" height="${s.visual.type==='spot'?205:800}"></figure>`;}
function body(text){return text.split(/\n\n/).map(t=>`<p>${esc(t)}</p>`).join('');}
function glossaryHtml(s){return (Array.isArray(s.glossary)?s.glossary:[s.glossary]).filter(Boolean).map(g=>`<p class="glossary">* ${esc(g)}</p>`).join('');}
function story(id,size=''){
 const s=BY_ID[id];
 const linkHtml=s.link?link(s.link,s.linkLabel||'Read more','story-link'):'';
 const frontId=`${esc(id)}-front`,backId=`${esc(id)}-back`;
 const front=`<button type="button" class="story-face story-front" id="${frontId}" aria-controls="${backId}" aria-expanded="false" aria-label="${esc(s.title)} — tap to read more"><span class="story-preview-main"><span class="story-preview-kicker">${esc(s.label)}</span><span class="story-preview-title" id="title-${esc(id)}">${title(s)}</span><span class="story-preview-summary">${esc(s.body)}</span></span><span class="story-preview-cue"><span>Tap or click to read the full story</span><span class="story-preview-arrow" aria-hidden="true">↗</span></span></button>`;
 const back=`<div class="story-face story-back" id="${backId}" aria-hidden="true"><button type="button" class="story-back-action">← Back to summary</button><div class="story-back-content"><div class="story-inner"><div class="story-copy"><p class="eyebrow">More context</p><h3>${title(s)}</h3><div class="body">${body(s.detail||s.body)}</div>${glossaryHtml(s)}${linkHtml}</div>${art(s)}</div></div></div>`;
 return `<article class="story story-flip-card ${size} treatment-${esc(s.style.layout)}" id="${esc(id)}" data-story="${esc(id)}" data-paper="${esc(s.style.paper)}"><div class="story-flipper">${front}${back}</div></article>`;
}
const rows={
 moment:story('navratri','lead'),
 business:`<div class="pair">${story('h1results')}${story('frontier')}</div>`,
 impact:story('crashfree','lead'),
 people:`<div class="pair">${story('milo')}${story('hubs')}</div>`,
 life:story('funcorner','lead')
};
root.innerHTML=`<section class="cover" id="cover" aria-labelledby="cover-title"><div class="cover-copy"><p class="eyebrow">The October issue <span aria-hidden="true">✦</span> 2026</p><h1 id="cover-title">The Pitstop</h1><p class="cover-subtitle">The stories behind the month<br>— not just the updates.</p><a class="read-button" href="${href('briefing')}">Open this issue <span aria-hidden="true">↓</span></a><p class="cover-caption">${STORIES.length} stories. Five chapters. One good catch-up.</p></div><figure class="cover-art"><picture><source media="(max-width:600px)" srcset="assets/cover-wide.webp"><img src="assets/cover-portrait.webp" data-fallback="assets/cover-portrait.png" alt="The original Pitstop colleagues gathered around their laptop." width="941" height="1672" fetchpriority="high"></picture></figure></section>
<section class="briefing wrap" id="briefing" aria-labelledby="briefing-title"><div class="briefing-intro"><p class="eyebrow">Why this exists</p><h2 id="briefing-title">What this is, and why it's worth five minutes</h2><p>Every one of these stories started as a Slack message, a number on someone's dashboard, or a moment nobody thought to write down. The Pitstop exists to put them in one place — not as a list of updates, but as the actual texture of what building Cars24 looked like this month. If something mattered to you, we want it in the next one.</p></div><div class="briefing-chapters">${CHAPTERS.map(ch=>`<a href="${href(ch.id)}"><span class="chapter-number">0${ch.number}</span><span>${esc(ch.name)}<small>${chCount(ch)} ${storyWord(chCount(ch))}</small></span><span aria-hidden="true">↘</span></a>`).join('')}</div></section>
<nav class="chapter-nav" aria-label="Newsletter chapters"><div class="nav-inner"><a href="${href('cover')}" class="nav-top" aria-label="Back to top">↑</a>${CHAPTERS.map(ch=>`<a href="${href(ch.id)}" data-chapter="${ch.id}"><span>0${ch.number}</span> ${esc(({moment:'Moment',business:'Business',impact:'Impact',people:'People',life:'Fun'})[ch.id])}</a>`).join('')}<span class="nav-progress" aria-hidden="true"></span></div></nav>
<div class="wrap chapters">${CHAPTERS.map(ch=>`<section class="chapter" id="${ch.id}" aria-labelledby="heading-${ch.id}"><header class="chapter-heading"><span class="chapter-number">0${ch.number}</span><div><h2 id="heading-${ch.id}">${esc(ch.name)}</h2><p>${esc(ch.body)}</p></div><span class="chapter-count">${chCount(ch)} ${storyWord(chCount(ch))}</span></header>${rows[ch.id]}<a class="chapter-return" href="${href('briefing')}">Back to contents ↑</a></section>`).join('')}</div>
<footer class="ending" id="caught-up"><p class="eyebrow">You're all caught up <span aria-hidden="true">✦</span></p><h2>That's this month's Pitstop.</h2><p>Have a win, a lesson, or a teammate's story for the next issue?</p>${link(FORM,'Add your story','read-button')}<a href="${href('cover')}" class="read-again">Read again ↑</a><div class="colophon"><img src="assets/cars24-logo-black.svg" alt="Cars24" width="80" height="22"><span>The Pitstop · October 2026 Edition</span></div></footer>`;
for(const el of document.querySelectorAll('[data-paper]')){const paper=el.dataset.paper;el.style.setProperty('--page-stock',STOCKS[paper]);el.style.setProperty('--paper-art',`url('../../assets/flatland/${paper}.svg')`);}
for(const img of document.querySelectorAll('img[data-fallback]'))img.addEventListener('error',()=>{if(img.dataset.fallback){img.src=img.dataset.fallback;delete img.dataset.fallback;}},{once:true});
for(const card of document.querySelectorAll('.story-flip-card')){
 const flipper=card.querySelector('.story-flipper'),front=card.querySelector('.story-front'),back=card.querySelector('.story-back'),backAction=card.querySelector('.story-back-action'),backContent=card.querySelector('.story-back-content');
 back.inert=true;
 const previewHeight=()=>{
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
const navLinks=[...document.querySelectorAll('[data-chapter]')],chapters=[...document.querySelectorAll('.chapter')];
let frame=0;function update(){frame=0;const active=chapters.filter(el=>el.getBoundingClientRect().top<=180).at(-1);for(const a of navLinks){if(a.dataset.chapter===active?.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.nav-progress').style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});addEventListener('resize',update);document.fonts?.ready.then(update);update();
const initialHash=location.hash;
if(initialHash){const loaded=document.readyState==='complete'?Promise.resolve():new Promise(resolve=>addEventListener('load',resolve,{once:true}));Promise.all([loaded,document.fonts?.ready]).then(()=>requestAnimationFrame(()=>{if(location.hash!==initialHash)return;let id;try{id=decodeURIComponent(initialHash.slice(1))}catch{return}document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'});}));}
})();
