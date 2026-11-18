/* V12: The Pitstop, November 2026 edition. A separate edition from V9 (October) — its own
   story data, entirely self-contained (no dependency on the shared stories.js, since this
   month's content has nothing to do with October's). Based on V11. Markup, CSS and behaviour follow the same
   continuous-read, flip-card design as V9; only the content changes. */
(() => {
'use strict';
const root=document.getElementById('newsletter');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const href=id=>'versions/v12/#'+encodeURIComponent(id);
const asset=src=>esc(src);
const link=(url,label,cls='')=>/^https:\/\//.test(url||'')?`<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`:'';
// Same eight Flatland paper stocks V9 uses, inlined here rather than read from stories.js —
// this edition doesn't load that file at all, so the palette is just copied as plain data.
const STOCKS={
 'cream-grid':'#FFF7E8','blue-grid':'#80C5FF','green-grid':'#C6E496','pink-grid':'#F9D1F4',
 'yellow-grid':'#FAFFAD','mint-grid':'#CAFAE0','ice-grid':'#E7F2FF','magenta-grid':'#EF5FA3'
};
const FORM='https://script.google.com/a/macros/cars24.com/s/AKfycbyBB0mU8dp6ACiQnm6Mss1npu9BBgF4ETae3TOrvmbgxAdAY4XuIP5BnA0tsV_ztX_4/exec';
const C2C_GLOSS='C2C – Cars24’s Consumer-to-Consumer marketplace, where everyday buyers purchase used cars from Cars24';
const WECARE_GLOSS='WeCare – Cars24’s internal employee-support ticketing system';
// Source: #announcements, #builders-cars24, #sas-office-announcement, #live-shipping-feed and
// related channels, 25 Oct – 18 Nov 2026. Anything already covered in the October edition
// (Alba Cars, the NACH×Digio numbers, the Badminton Championship results, Milo, the Diwali
// gift-delay story) is left out here rather than repeated. No individual Slack-handle credit
// is shown on the tech/business cards, matching how October handled team-shipped work; the
// human-interest cards keep names the company already shared publicly.
const STORIES=[
 {id:'phoenix',chapterId:'business',label:'AI platform · Builders',title:'Phoenix: the next chapter of AI at Cars24',
  body:'AIRO’s successor, Phoenix, is built for multi-agent work — specialist agents handing off to each other instead of one agent carrying everything. AIRO was already running 45+ agents across 1.5 lakh conversations a day; Phoenix’s Support agent is live today, handling 4,000 queries a day.',
  detail:'The roadmap from here: fully autonomous agents that complete a task end to end without a human nudging each step, voice agents, and agents anyone can build through Claude or Codex without opening Phoenix at all. AIRO’s scale is the proof of what’s possible once this lands — Phoenix is about handing that same scale to every team, not just the ones who built the platform.',
  visual:{src:'assets/story-graphics/v12/phoenix.svg',fallbackSrc:'assets/story-graphics/v12/phoenix.svg',alt:'A phoenix-like spark passing a baton between two agent nodes.',type:'spot'},
  style:{paper:'blue-grid',layout:'feature',emphasis:'next chapter'}},
 {id:'goldloan',chapterId:'business',label:'New line · Lending',title:'Gold Loan goes live, with Bajaj Finance',
  body:'Cars24 has a new loan product line: Gold Loan, in partnership with Bajaj Finance. Customers go from entering their gold’s details to picking a branch in one flow, with a gold-rate loan estimator built in.',
  detail:'It’s the same shape as the Personal Loan launches that came before it — a new lending category stitched into the same Cars24 flow, this time starting from something customers already own instead of the car itself.',
  visual:{src:'assets/story-graphics/v12/gold-loan.svg',fallbackSrc:'assets/story-graphics/v12/gold-loan.svg',alt:'A gold bar beside a loan document and branch pin.',type:'spot'},
  style:{paper:'yellow-grid',layout:'poster',emphasis:'Bajaj Finance'}},
 {id:'tatstory',chapterId:'business',label:'Builder spirit · Logistics',title:'Car-movement time, cut from 2.5 days to 1.5',
  body:'A logistics team redesigned how cars move between the yard and refurb — bypassing an extra C2B yard step, building their own driver-allocation solver, and adding new incentives for long-distance pilots.',
  detail:'The result: car-movement turnaround fell from 2.5 days to 1.5, interstate movement got less dependent on vendors, and the team freed up listing capacity worth around 200 cars — not from more headcount, but from redesigning the process itself.',
  visual:{src:'assets/story-graphics/v12/tat.svg',fallbackSrc:'assets/story-graphics/v12/tat.svg',alt:'A car on a shortened route between two points, clock hands winding back.',type:'spot'},
  style:{paper:'green-grid',layout:'poster',emphasis:'1.5'}},
 {id:'hubexpansion',chapterId:'business',label:'Network · Retail',title:'Four new hubs in four weeks',
  body:'Cars24 opened four hubs this stretch — Dehradun, Ranchi (the first in Jharkhand), Kukatpally in Hyderabad, and a new Premium Hub in Bellandur, Bengaluru. Each one was inaugurated by a top-performing frontline teammate.',
  detail:'Ranchi marks the first Cars24 hub in Jharkhand; Bellandur is the Premium Hub format’s debut in Bengaluru, built around a more curated, guided buying experience than a standard hub.',
  visual:{src:'assets/story-graphics/v12/hubs.svg',fallbackSrc:'assets/story-graphics/v12/hubs.svg',alt:'Four location pins lighting up one after another on a map.',type:'spot'},
  style:{paper:'ice-grid',layout:'poster'}},
 {id:'frontiernov',chapterId:'builders',label:'Coming up · 29 November',title:'Frontier ’26 takes the stage at Yashobhoomi',
  body:'On Sunday 29 November, Cars24 and Deployment Inc take over Yashobhoomi, Delhi’s largest convention centre, to unveil 30+ AI releases in one day — in front of founders, CXOs and India’s top investors.',
  detail:'100 seats were opened up for Cars24 employees to attend in person, allocated by lottery once demand ran past that. This is the “before” half of the story — we’ll bring the actual releases and what happened on the day to the next edition.',
  visual:{src:'assets/story-graphics/v12/frontier-stage.svg',fallbackSrc:'assets/story-graphics/v12/frontier-stage.svg',alt:'A spotlighted stage with a countdown numbered 29.',type:'spot'},
  style:{paper:'blue-grid',layout:'feature',emphasis:'Yashobhoomi'}},
 {id:'bfffix',chapterId:'builders',label:'Under the hood · Engineering',title:'The bug that took 15 seconds, now takes 17 milliseconds',
  body:'A fix to the BFF engine cleared up hung requests and silent null responses. One specific failing request that used to take roughly 15 seconds now resolves in 17.2 milliseconds, and DAG skip-warnings across the system dropped 93.6%.',
  visual:{src:'assets/story-graphics/v12/bff-fix.svg',fallbackSrc:'assets/story-graphics/v12/bff-fix.svg',alt:'A stopwatch next to a lightning bolt, before and after.',type:'spot'},
  style:{paper:'pink-grid',layout:'poster',emphasis:'17 milliseconds'}},
 {id:'personalloans',chapterId:'builders',label:'Leveled up · Lending',title:'Personal Loans, leveled up',
  body:'Personal Loans added new lending partners — PFL, HIPL, and FIBE’s pre-qualified program — plus a CIBIL soft-pull that routes each applicant to the lender most likely to approve them.',
  detail:'Behind the scenes: partner MIS now ingests automatically instead of someone downloading it from email each day, contextual nudge cards bring back customers who drop off mid-journey, and the whole product has moved onto the same shared partner/journey infrastructure the rest of lending already runs on.',
  visual:{src:'assets/story-graphics/v12/personal-loans.svg',fallbackSrc:'assets/story-graphics/v12/personal-loans.svg',alt:'A document with a checkmark, routed between three lender nodes.',type:'spot'},
  style:{paper:'cream-grid',layout:'poster'}},
 {id:'assigno',chapterId:'builders',label:'Tool rollout · Internal',title:'Assigno gets a proper onboarding',
  body:'As Assigno scales out to C2B, RA, Category, Leadverse and ground teams, it now ships with a 17-minute chaptered video walkthrough, an interactive in-product guide, and team performance analytics.',
  visual:{src:'assets/story-graphics/v12/assigno.svg',fallbackSrc:'assets/story-graphics/v12/assigno.svg',alt:'A play button over a chaptered video timeline beside a small bar chart.',type:'spot'},
  style:{paper:'mint-grid',layout:'poster'}},
 {id:'flexiclosure',chapterId:'builders',label:'Shipped',title:'Flexi Closure Charges, as a standalone VAS',
  body:'Loan offers can now carry Flexi Closure Charges as their own value-added-service line, instead of being folded into the rest of the offer.',
  visual:{src:'assets/story-graphics/v12/flexi-closure.svg',fallbackSrc:'assets/story-graphics/v12/flexi-closure.svg',alt:'A small standalone tile breaking off from a loan offer document.',type:'spot'},
  style:{paper:'yellow-grid',layout:'poster'}},
 {id:'ledgernarrations',chapterId:'builders',label:'Shipped',title:'Dealer ledger entries finally explain themselves',
  body:'The Dealer app ledger now shows a clear narration for each entry instead of a generic “deposit” — so dealers can tell what a line item actually was without asking.',
  visual:{src:'assets/story-graphics/v12/ledger.svg',fallbackSrc:'assets/story-graphics/v12/ledger.svg',alt:'A ledger row with a label instead of a blank line.',type:'spot'},
  style:{paper:'green-grid',layout:'poster'}},
 {id:'webhookmigration',chapterId:'builders',label:'Shipped',title:'Asset-status webhooks moved in-house',
  body:'Asset-status webhooks were migrated off the external gateway onto Cars24’s own infrastructure — one less third-party dependency in a path that affects every asset update.',
  visual:{src:'assets/story-graphics/v12/webhook.svg',fallbackSrc:'assets/story-graphics/v12/webhook.svg',alt:'A signal moving from an outside gateway to a house-shaped server.',type:'spot'},
  style:{paper:'ice-grid',layout:'poster'}},
 {id:'aicrm',chapterId:'builders',label:'Shipped',title:'AI call outcomes now feed the CRM',
  body:'Outcomes from AI calls now flow into CRM events directly, so follow-ups can be faster and more personalised instead of waiting on a manual update.',
  visual:{src:'assets/story-graphics/v12/ai-crm.svg',fallbackSrc:'assets/story-graphics/v12/ai-crm.svg',alt:'A phone call outcome flowing into a CRM contact card.',type:'spot'},
  style:{paper:'pink-grid',layout:'poster'}},
 {id:'saarathifcu',chapterId:'builders',label:'Shipped',title:'Saarathi and FCU, a little more efficient',
  body:'Saarathi now captures employer details the same way across every form, and FCU has a side-by-side history view — so the same recheck doesn’t have to happen twice.',
  visual:{src:'assets/story-graphics/v12/saarathi-fcu.svg',fallbackSrc:'assets/story-graphics/v12/saarathi-fcu.svg',alt:'Two matching form fields side by side with a check mark.',type:'spot'},
  style:{paper:'cream-grid',layout:'poster'}},
 {id:'diwalinov',chapterId:'life',label:'Diwali 2026',title:'Diwali, the lighter cut',
  body:'Traditional-dress day, a photo booth, festive snacks, and a surprise gift drop straight to people’s seats — no queues, no treasure hunt. Diwali games ran near the merch store, and a Halloween candy hunt the week before got everyone warmed up.',
  detail:'Vikram’s note to the company leaned on ambition for the year ahead and a reminder of what the Compassion Fund and Scholarship Fund already do, quietly, in the background: this year they supported 11 families with ₹12.7 lakh, and helped pay school fees for 102 children — about ₹26 lakh.',
  visual:{src:'assets/story-graphics/v12/diwali.svg',fallbackSrc:'assets/story-graphics/v12/diwali.svg',alt:'A string of diyas above a small gift box and a pair of hands in a heart shape.',type:'spot'},
  style:{paper:'magenta-grid',layout:'poster',emphasis:'lighter cut'}},
 {id:'sportswellness',chapterId:'life',label:'Sports & wellness',title:'62 people, one step-count leaderboard',
  body:'The Step Count Challenge has 62 Autonauts competing for the top 3 spots — one person clocked 225.7k steps in a single week, with two others past 100k.',
  detail:'Alongside the challenge: a Breath Reset Townhall, weekly drop-in Reset Hours, and physiotherapy sessions at the Athlete Development Center averaging 6–8 consultations a day.',
  visual:{src:'assets/story-graphics/v12/steps.svg',fallbackSrc:'assets/story-graphics/v12/steps.svg',alt:'A rising step-count graph with a small trophy at the top.',type:'spot'},
  style:{paper:'green-grid',layout:'poster',emphasis:'62 people'}},
 {id:'funcorner',chapterId:'life',label:'Overheard at Cars24',title:'The Great Box Heist, and other investigations',
  body:'Someone posted “whoever has taken the box from my desk please return it” — and the thread turned into a full mock-investigation, complete with detective emojis and a ninja accusation. Separately, a very matter-of-fact “I am stuck in the lift at ground floor” got a wave of salutes and laughter.',
  detail:'Also this fortnight: a suspense GIF sat in a channel for a week teasing an announcement before the Diwali reveal, AC-temperature requests kept arriving from every floor like clockwork, and the Cars24 YouTube channel crossed 1 million subscribers. And, overheard on Diwali: “May your CTC grow faster than your workload, your salary faster than inflation, and your career faster than office gossip.”',
  visual:{src:'assets/story-graphics/v12/fun-corner.svg',fallbackSrc:'assets/story-graphics/v12/fun-corner.svg',alt:'A magnifying glass over a cardboard box with a question mark.',type:'spot'},
  style:{paper:'pink-grid',layout:'poster'}},
 {id:'davinder',chapterId:'life',label:'Transformation',title:'98 kg to 89 kg, and back to full strength',
  body:'Davinder Singh started with a simple goal — lose weight — while nursing knee and shoulder issues that made basic movement difficult. A year of consistent coaching later, he’s back to squats, overhead lifts and explosive jumps, nine kilos lighter.',
  visual:{src:'assets/story-graphics/v12/davinder.svg',fallbackSrc:'assets/story-graphics/v12/davinder.svg',alt:'A weight scale dropping beside a figure mid-squat.',type:'spot'},
  style:{paper:'yellow-grid',layout:'poster',emphasis:'89 kg'}},
 {id:'powerlifter',chapterId:'life',label:'Delivery day',title:'A gold medalist’s delivery, at the Rajouri hub',
  body:'The Rajouri Hub team delivered a car to Uttam Singh Rawat, a national powerlifting gold medalist — a small, proud moment for the team on an otherwise ordinary delivery day.',
  visual:{src:'assets/story-graphics/v12/powerlifter.svg',fallbackSrc:'assets/story-graphics/v12/powerlifter.svg',alt:'A medal beside a car key, handed over at a hub.',type:'spot'},
  style:{paper:'blue-grid',layout:'poster'}},
 {id:'deliverycloth',chapterId:'life',label:'Small details',title:'A month, three prototypes, one delivery cloth',
  body:'The cloth used to reveal a car at handover looks simple. It took almost a month and three different prototypes to get there — testing material, weight and reusability until it slid on smoothly every time.',
  visual:{src:'assets/story-graphics/v12/cloth.svg',fallbackSrc:'assets/story-graphics/v12/cloth.svg',alt:'A folded cloth being lifted off a car, mid-reveal.',type:'spot'},
  style:{paper:'mint-grid',layout:'poster'}},
 {id:'saathi',chapterId:'life',label:'Saathi',title:'A mentorship visit, both ways',
  body:'A Bangalore hub visit under the Saathi mentorship program left both sides a little changed: “You sent me there so they could find a friend in me, but I ended up finding friends in them too.”',
  visual:{src:'assets/story-graphics/v12/saathi.svg',fallbackSrc:'assets/story-graphics/v12/saathi.svg',alt:'Two figures meeting halfway, each holding out a hand.',type:'spot'},
  style:{paper:'ice-grid',layout:'poster'}},
 {id:'vikramvoice',chapterId:'perspectives',label:'A thought from Vikram',title:'On ambition, and what Diwali is actually for',
  body:'Vikram’s Diwali note to the company was about ambition for the year ahead — and a reminder that the Compassion Fund and Scholarship Fund keep working quietly in the background, supporting 11 families and 102 children’s school fees this year.',
  visual:{src:'assets/story-graphics/v12/vikram-voice.svg',fallbackSrc:'assets/story-graphics/v12/vikram-voice.svg',alt:'A diya next to an open book, both glowing softly.',type:'spot'},
  style:{paper:'yellow-grid',layout:'poster'}}
];
const BY_ID=Object.fromEntries(STORIES.map(s=>[s.id,s]));
const CHAPTERS=[
 {id:'business',name:'Business highlights',body:'Results, new lines and the work supporting Cars24’s growth.',number:1,
  stories:['phoenix','goldloan','tatstory','hubexpansion']},
 {id:'builders',name:'Tech Updates',body:'Product releases, new ways to work, and what shipped this fortnight.',number:2,
  stories:['frontiernov','bfffix','personalloans','assigno','flexiclosure','ledgernarrations','webhookmigration','aicrm','saarathifcu']},
 {id:'life',name:'Life at Cars24',body:'Diwali, wellbeing, and the moments we share beyond the work.',number:3,
  stories:['diwalinov','sportswellness','funcorner','davinder','powerlifter','deliverycloth','saathi']},
 {id:'perspectives',name:'Thoughts & perspectives',body:'A note from Vikram on ambition and what Diwali is actually for.',number:4,
  stories:['vikramvoice']}
];
const chCount=ch=>ch.stories.length;
const storyWord=n=>n===1?'story':'stories';
function title(s){const mark=s.style.emphasis,at=mark?s.title.indexOf(mark):-1;return at<0?esc(s.title):esc(s.title.slice(0,at))+`<span class="headline-mark">${esc(mark)}</span>`+esc(s.title.slice(at+mark.length));}
function art(s){return `<figure class="art art-${esc(s.visual.type)}"><img src="${asset(s.visual.src)}" data-fallback="${asset(s.visual.fallbackSrc||s.visual.src)}" alt="${esc(s.visual.alt)}" loading="lazy" decoding="async" width="${s.visual.type==='spot'?400:1200}" height="${s.visual.type==='spot'?205:800}"></figure>`;}
function body(text){return text.split(/\n\n/).map(t=>`<p>${esc(t)}</p>`).join('');}
function glossaryHtml(s){return (Array.isArray(s.glossary)?s.glossary:[s.glossary]).filter(Boolean).map(g=>`<p class="glossary">* ${esc(g)}</p>`).join('');}
// Every card is a flip card: a text-only teaser up front, the full story (title, detail copy,
// artwork, glossary) on the back. Same pattern as V9 — front is a <button> that opens the back,
// the back has its own "Back to summary" button.
function story(id,size=''){
 const s=BY_ID[id];
 const linkHtml=s.link?link(s.link,s.linkLabel||'Read more','story-link'):'';
 const frontId=`${esc(id)}-front`,backId=`${esc(id)}-back`;
 const frontArt=`<span class="story-preview-art">${art(s).replaceAll('figure','span')}</span>`;
 const front=`<button type="button" class="story-face story-front" id="${frontId}" aria-controls="${backId}" aria-expanded="false" aria-label="${esc(s.title)} — tap to read more">${frontArt}<span class="story-preview-main"><span class="story-preview-kicker">${esc(s.label)}</span><span class="story-preview-title" id="title-${esc(id)}">${title(s)}</span><span class="story-preview-summary">${esc(s.body)}</span></span><span class="story-preview-cue"><span>Tap to read more</span><span class="story-preview-arrow" aria-hidden="true">↗</span></span></button>`;
 const back=`<div class="story-face story-back" id="${backId}" aria-hidden="true"><button type="button" class="story-back-action">← Back to summary</button><div class="story-back-content"><div class="story-inner"><div class="story-copy"><p class="eyebrow">More context</p><h3>${title(s)}</h3><div class="body">${body(s.detail||s.body)}</div>${glossaryHtml(s)}${linkHtml}</div>${art(s)}</div></div></div>`;
 return `<article class="story story-flip-card ${size} treatment-${esc(s.style.layout)}" id="${esc(id)}" data-story="${esc(id)}" data-paper="${esc(s.style.paper)}"><div class="story-flipper">${front}${back}</div></article>`;
}
const rows={
 business:story('phoenix','lead')+`<div class="pair">${story('goldloan')}${story('hubexpansion')}</div><div class="pair single">${story('tatstory')}</div>`,
 builders:`<div class="pair tech-opening">${story('frontiernov')}${story('bfffix')}</div>`+`<div class="pair">${story('personalloans')}${story('assigno')}</div><div class="release-list">${['flexiclosure','ledgernarrations','webhookmigration','aicrm','saarathifcu'].map(id=>story(id,'release')).join('')}</div>`,
 life:story('diwalinov','lead')+`<div class="pair">${story('sportswellness')}${story('funcorner')}</div><div class="pair">${story('davinder')}${story('powerlifter')}</div><div class="pair">${story('deliverycloth')}${story('saathi')}</div>`,
 perspectives:`<div class="pair voices single">${story('vikramvoice','voice')}</div>`
};
root.innerHTML=`<section class="cover" id="cover" aria-labelledby="cover-title"><div class="cover-copy"><p class="eyebrow">The November issue <span aria-hidden="true">✦</span> 2026</p><h1 id="cover-title">The Pitstop</h1><p class="cover-subtitle">What’s happening<br> across Cars24.</p><a class="read-button" href="${href('briefing')}">Open this issue <span aria-hidden="true">↓</span></a><p class="cover-caption">${STORIES.length} stories. Four chapters. One good catch-up.</p></div><figure class="cover-art"><picture><source media="(max-width:600px)" srcset="assets/cover-wide.webp"><img src="assets/cover-portrait.webp" data-fallback="assets/cover-portrait.png" alt="The original Pitstop colleagues gathered around their laptop." width="941" height="1672" fetchpriority="high"></picture></figure></section>
<section class="briefing wrap" id="briefing" aria-labelledby="briefing-title"><div class="briefing-intro"><p class="eyebrow">Your fortnightly catch-up</p><h2 id="briefing-title">In this issue</h2><p>Results, things we’ve built, and the people behind them.</p></div><div class="briefing-chapters">${CHAPTERS.map(ch=>`<a href="${href(ch.id)}"><span class="chapter-number">0${ch.number}</span><span>${esc(ch.name)}<small>${chCount(ch)} ${storyWord(chCount(ch))}</small></span><span aria-hidden="true">↘</span></a>`).join('')}</div></section>
<nav class="chapter-nav" aria-label="Newsletter chapters"><div class="nav-inner"><a href="${href('cover')}" class="nav-top" aria-label="Back to top">↑</a>${CHAPTERS.map(ch=>`<a href="${href(ch.id)}" data-chapter="${ch.id}"><span>0${ch.number}</span> ${esc(({business:'Business',builders:'Tech',life:'Life',perspectives:'Voices'})[ch.id])}</a>`).join('')}<span class="nav-progress" aria-hidden="true"></span></div></nav>
<div class="wrap chapters">${CHAPTERS.map(ch=>`<section class="chapter" id="${ch.id}" aria-labelledby="heading-${ch.id}"><header class="chapter-heading"><span class="chapter-number">0${ch.number}</span><div><h2 id="heading-${ch.id}">${esc(ch.name)}</h2><p>${esc(ch.body)}</p></div><span class="chapter-count">${chCount(ch)} ${storyWord(chCount(ch))}</span></header>${rows[ch.id]}<a class="chapter-return" href="${href('briefing')}">Back to contents ↑</a></section>`).join('')}</div>
<footer class="ending" id="caught-up"><p class="eyebrow">You’re all caught up <span aria-hidden="true">✦</span></p><h2>That’s this fortnight’s Pitstop.</h2><p>Have a win, a lesson, or a teammate’s story for the next issue?</p>${link(FORM,'Add your story','read-button')}<a href="${href('cover')}" class="read-again">Read again ↑</a><div class="colophon"><img src="assets/cars24-logo-black.svg" alt="Cars24" width="80" height="22"><span>The Pitstop · November 2026 Edition</span></div></footer>`;
for(const el of document.querySelectorAll('[data-paper]')){const paper=el.dataset.paper;el.style.setProperty('--page-stock',STOCKS[paper]);el.style.setProperty('--paper-art',`url('../../assets/flatland/${paper}.svg')`);}
for(const img of document.querySelectorAll('img[data-fallback]'))img.addEventListener('error',()=>{if(img.dataset.fallback){img.src=img.dataset.fallback;delete img.dataset.fallback;}},{once:true});
// Natural layout sizes each active face; paired cards share a row height.
for(const card of document.querySelectorAll('.story-flip-card')){
 const front=card.querySelector('.story-front'),back=card.querySelector('.story-back'),backAction=card.querySelector('.story-back-action');
 back.inert=true;
 const setOpen=open=>{
  card.classList.toggle('is-open',open);
  front.setAttribute('aria-expanded',String(open));front.inert=open;
  back.inert=!open;back.setAttribute('aria-hidden',String(!open));
  (open?backAction:front).focus({preventScroll:true});
 };
 front.addEventListener('click',()=>setOpen(true));
 backAction.addEventListener('click',()=>setOpen(false));
 card.addEventListener('keydown',event=>{if(event.key==='Escape'&&card.classList.contains('is-open')){event.preventDefault();setOpen(false);}});
}
// The pointer retains its native shape; a small, non-interactive cue follows it.
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 const cue=document.createElement('span');cue.className='pointer-cue';cue.textContent='Tap to read more';cue.setAttribute('aria-hidden','true');document.body.append(cue);
 let pointer=null;
 const hide=()=>cue.classList.remove('is-visible');
 const move=()=>{
  const target=pointer&&document.elementFromPoint(pointer.x,pointer.y)?.closest('.story-front');
  if(!target||target.inert){hide();return;}
  const x=Math.max(8,Math.min(pointer.x+18,innerWidth-cue.offsetWidth-12));
  const y=Math.max(8,Math.min(pointer.y+20,innerHeight-cue.offsetHeight-12));
  cue.style.transform=`translate3d(${x}px,${y}px,0)`;cue.classList.add('is-visible');
 };
 document.addEventListener('pointermove',event=>{pointer={x:event.clientX,y:event.clientY};move();},{passive:true});
 document.addEventListener('pointerdown',hide);document.addEventListener('pointerleave',()=>{pointer=null;hide();});document.addEventListener('focusin',()=>{pointer=null;hide();});addEventListener('scroll',move,{passive:true});addEventListener('blur',hide);
}
const navLinks=[...document.querySelectorAll('[data-chapter]')],chapters=[...document.querySelectorAll('.chapter')];
let frame=0;function update(){frame=0;const active=chapters.filter(el=>el.getBoundingClientRect().top<=180).at(-1);for(const a of navLinks){if(a.dataset.chapter===active?.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.nav-progress').style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});addEventListener('resize',update);document.fonts?.ready.then(update);update();
const initialHash=location.hash;
if(initialHash){const loaded=document.readyState==='complete'?Promise.resolve():new Promise(resolve=>addEventListener('load',resolve,{once:true}));Promise.all([loaded,document.fonts?.ready]).then(()=>requestAnimationFrame(()=>{if(location.hash!==initialHash)return;let id;try{id=decodeURIComponent(initialHash.slice(1))}catch{return}document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'});}));}
})();
