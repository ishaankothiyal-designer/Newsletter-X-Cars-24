(() => {
'use strict';
const data=window.PITSTOP,$=id=>document.getElementById(id),track=$('track');
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>s.replace(/\n/g,' '),lines=s=>s.split('\n').map(x=>`<span>${escape(x)}</span>`).join('');
const count=data.stories.length,chapters=[...new Set(data.stories.map(x=>x.chapter))];
const paper={academy:'green',growth:'paper',ecosystem:'pink',frontier:'ice',startup:'yellow',lending:'sky',handovers:'mint',waits:'pink',dehradun:'green',pdi:'ice',telugu:'pink',dealer:'ice',miles:'sky',leads:'green',approvals:'yellow',saarathi:'mint',ownership:'green',security:'paper',codex:'sky',hackathon:'yellow',milo:'mint',badminton:'pink',survey:'yellow',finance:'ice',close:'paper',ambition:'green',controls:'yellow',inflection:'pink',safeguards:'ice',thermostat:'sky'};

// Original background extractions: source page provenance in assets/flatland/manifest.json.
const flatland={paper:'cream-grid',green:'green-grid',pink:'pink-grid',yellow:'yellow-grid',mint:'mint-grid',sky:'blue-grid',ice:'ice-grid'};
const editorialMotifs={"academy":"tools","growth":"chart","ecosystem":"globe","frontier":"rocket","startup":"bulb","lending":"chart","handovers":"key","waits":"clock","dehradun":"pin","pdi":"inspect","telugu":"film","dealer":"check","miles":"route","leads":"phone","approvals":"check","saarathi":"tools","ownership":"key","security":"shield","codex":"laptop","hackathon":"puzzle","milo":"sprout","badminton":"racket","survey":"bubble","finance":"inspect","close":"ledger","ambition":"telescope","controls":"gears","inflection":"route","safeguards":"shield","thermostat":"snow"};
const flourish=id=>`<span class="editorial-dingbat" aria-hidden="true">${id==='thermostat'?'❄':['growth','miles','frontier','ambition','controls'].includes(id)?'↗':'✦'}</span>`;
const editorialMark=motif=>`<svg viewBox="0 0 96 76" aria-hidden="true" focusable="false"><use href="assets/v5-editorial-marks.svg#${motif}"></use></svg>`;
const sticker=id=>`<span class="editorial-cut" aria-hidden="true">${editorialMark(editorialMotifs[id])}</span>`;
const alt={academy:'Illustrated colleagues learning beside a car in a workshop.',frontier:'An imagined AI event with a team on stage.',customer:'Illustrated family receiving car keys from an advisor.',business:'Illustrated colleagues and cars at a Cars24 hub.','akbar-birbal':'Akbar and Birbal inspecting a car in an editorial illustration.',telugu:'An imagined illustration of Vijay Deverakonda beside a car.',team:'Illustrated colleagues working around a laptop.',perspective:'Illustrated colleagues looking towards a road and city horizon.'};
const image=(name,cover=false)=>`<figure class="print-image"><img src="assets/${escape(name)}.webp" alt="${escape(alt[name])}" draggable="false" ${cover?'fetchpriority="high"':'loading="lazy"'}></figure>`;
const folio=(section,page)=>`<div class="folio"><span>THE PITSTOP / OCTOBER ’26</span><span>${escape(section)} · ${page}</span></div>`;
const cover=`<article class="sheet front-page" id="front-page" data-flatland="pink-grid" style="--tone:var(--pink)" role="group" aria-roledescription="slide" aria-label="Front page"><div class="sheet-scroll" tabindex="0" aria-label="Front page content">${folio('THE FRONT PAGE','00')}<div class="cover-headline"><h2>BIG WINS.<br>BRAVE FIRSTS.</h2><p class="cover-side">AND THE<br>PEOPLE<br>BEHIND<br>IT ALL. ↙</p></div><div class="card-category">YOUR OCTOBER, IN GOOD COMPANY.<span class="editorial-dingbat" aria-hidden="true">✦</span></div><div class="cover-feature"><div class="cover-sidebar"><div><h3>THE NEXT<br>CHAPTER<br>STARTS<br>HERE.</h3><p>A new academy.<br>Real cars.<br>Room to grow.</p></div><div><div class="mini-number">30</div><p>STORIES FROM<br>ACROSS CARS24.</p></div></div><div>${image('academy',true)}<div class="story-caption"><span>LEARNING, ON THE FRONTLINE.</span><span>01 ↗</span></div></div></div><div class="cover-teasers"><div><small>THE BIG PICTURE</small><h3>Stronger<br>economics.</h3></div><div><small>PEOPLE & PLACES</small><h3>A handover.<br>At 3 a.m.</h3></div><div><small>FRESHLY SHIPPED</small><h3>Small changes.<br>Better days.</h3></div></div><div class="story-bottom"><span>ONE STORY. ONE SMALL PIT STOP.</span><span class="page-number">↗</span></div></div></article>`;
const opening=`<article class="sheet opening-card newsprint-opening" id="cover" data-flatland="cream-grid" style="--tone:var(--paper)" role="group" aria-roledescription="slide" aria-label="The Pitstop opening slide"><div class="sheet-scroll" tabindex="0" aria-label="Opening slide content">${folio('THE OCTOBER EDITION','00')}<div class="opening-name"><h2>THE PITSTOP.</h2><span class="opening-spark" aria-hidden="true">✦</span></div><p class="opening-deck">YOUR STORY BELONGS HERE.</p><p class="opening-kicker">BIG WINS. BRAVE FIRSTS. EVERYDAY MOMENTS.</p><div class="opening-visual">${image('team',true)}<div class="story-caption"><span>OUR PEOPLE. OUR STORIES.</span><span>EDITORIAL ILLUSTRATION</span></div></div><div class="opening-summary"><div class="opening-count" aria-hidden="true">30<small>STORIES</small></div><div><p>The people, the work, and the little things in between. A month in the life of Cars24.</p><a class="opening-submit" href="${escape(data.form)}" target="_blank" rel="noopener">Share your story ↗</a></div></div><div class="opening-bottom"><span>OCTOBER 2026 / INTERNAL EDITION</span><span aria-hidden="true">TURN THE PAGE ↗</span></div></div></article>`;
track.innerHTML=opening+cover+data.stories.map((s,i)=>`<article class="sheet ${s.layout==='image'?'image-layout':s.layout==='stat'?'stat-layout':'statement-layout'}" id="${escape(s.id)}" data-flatland="${flatland[paper[s.id]]}" style="--tone:var(--${paper[s.id]})" role="group" aria-roledescription="slide" aria-label="Story ${i+1} of ${count}: ${escape(plain(s.title))}"><div class="sheet-scroll" tabindex="0" aria-label="Story content">${folio(s.chapter,String(i+1).padStart(2,'0'))}<div class="card-category">${escape(s.label)}${flourish(s.id)}</div><div class="story-headline"><h2>${lines(s.title)}</h2></div>${s.layout==='stat'?`<div class="stat-block"><div class="metric-value"><div class="big-stat">${escape(s.stat)}</div><div class="stat-unit">${escape(s.unit)}</div></div>${sticker(s.id)}</div>`:''}${s.image?`<div>${image(s.image)}<div class="story-caption"><span>EDITORIAL ILLUSTRATION</span><span>CARS24 / OCT ’26</span></div></div>`:''}${s.accent?`<p class="story-accent">${escape(s.accent)}</p>`:''}<div class="article-copy"><div class="byline"><span class="byline-label">REPORTED BY</span><span class="byline-name">${escape(s.credit.split(' · ')[0])}</span></div><p class="body-text">${escape(s.body)}</p></div>${s.foot?`<p class="story-foot">${escape(s.foot)}</p>`:''}${s.link?`<a class="story-link" href="${escape(s.link)}" target="_blank" rel="noopener">${escape(s.linkLabel)} ↗</a>`:''}${!s.image&&s.layout!=='stat'?`<div class="edition-stamp" aria-hidden="true"><strong>${String(i+1).padStart(2,'0')}</strong>${sticker(s.id)}<span>FROM OUR CORNER<br>OF THE WORLD.<br>THE PITSTOP / 2026</span></div>`:''}<div class="story-bottom"><button class="story-credit" data-credit="${i}">Story notes & source ↗</button><span class="page-number">${String(i+1).padStart(2,'0')}</span></div></div></article>`).join('')+`<article class="sheet completion" id="caught-up" data-flatland="green-grid" style="--tone:var(--green)" role="group" aria-roledescription="slide" aria-label="End of the edition"><div class="sheet-scroll" tabindex="0" aria-label="End of edition content">${folio('THAT’S A WRAP','31')}<div class="card-category">THE END. UNTIL NEXT MONTH.<span class="editorial-dingbat" aria-hidden="true">✦</span></div><div class="completion-cut" aria-hidden="true">${editorialMark('globe')}</div><h2>GOOD MONTH.<br>GREAT PEOPLE.</h2><p>That’s October. Got a win, a lesson, or a teammate story for the next edition?</p><a class="story-link" href="${escape(data.form)}" target="_blank" rel="noopener">Share your story ↗</a><button class="cover-link" id="read-again">Read the edition again ↗</button><div class="story-bottom"><span>YOUR STORY BELONGS HERE.</span><span class="page-number">✓</span></div></div></article>`;
track.querySelectorAll('[data-flatland]').forEach(card=>card.style.setProperty('--flatland-background',`url("assets/flatland/${card.dataset.flatland}.svg")`));
const cards=[...track.children],reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Measure all stories at their natural height and share one frame across the deck.
let measuredDeckWidth=0;
const mobileViewport=matchMedia('(max-width:1024px)');
function syncMobileViewport(){
 const view=window.visualViewport;
 // Browser zoom retains its own visual viewport; do not resize the UI during pinch zoom.
 if(view&&Math.abs(view.scale-1)>.01)return;
 document.documentElement.style.setProperty('--mobile-viewport-height',`${Math.floor(view?.height||innerHeight)}px`);
}
function updateScrollHint(){
 const scroller=cards[current]?.querySelector('.sheet-scroll');
 if(!scroller)return;
 $('gesture').textContent=mobileViewport.matches&&scroller.scrollHeight>scroller.clientHeight+2?'SCROLL STORY · SWIPE ↔':'DRAG OR SWIPE ↔';
}
function fitDeck(){
 measuredDeckWidth=track.clientWidth;
 if(mobileViewport.matches){track.style.removeProperty('--deck-height');updateScrollHint();return}
 track.classList.add('measuring-content');
 const tallest=Math.max(...cards.map(card=>card.querySelector('.sheet-scroll').scrollHeight));
 track.classList.remove('measuring-content');
 track.style.setProperty('--deck-height',`${Math.ceil(Math.max(measuredDeckWidth,tallest+6))}px`);
}

let current=0,revision=0,gesture=null,suppressClickUntil=0,wheelTime=0;
const storageKey='pitstop-october-2026-v6-viewport';
let saved=0;try{saved=Number(localStorage.getItem(storageKey))||0}catch{}
const chapterButtons=chapters.map((chapter,j)=>{const start=data.stories.findIndex(s=>s.chapter===chapter)+2;const button=document.createElement('button');button.innerHTML=`${escape(chapter)}<span>${String(j+1).padStart(2,'0')}</span>`;button.addEventListener('click',()=>go(start,false));$('chapter-nav').append(button);return{chapter,button}});
$('contents-list').innerHTML=chapters.map(ch=>`<section class="contents-section"><h3>${escape(ch)}</h3>${data.stories.map((s,i)=>s.chapter===ch?`<button data-go="${i+2}"><span>${String(i+1).padStart(2,'0')}</span>${escape(plain(s.title))}</button>`:'').join('')}</section>`).join('');
const stateTransform=d=>d===0?'translate3d(0,0,0) rotate(0deg) scale(1)':d===1?'translate3d(19px,8px,0) rotate(2deg) scale(.975)':d===2?'translate3d(37px,16px,0) rotate(4deg) scale(.95)':`translate3d(${d<0?-track.clientWidth-100:50}px,12px,0) rotate(${d<0?-12:5}deg) scale(.95)`;
function settle(animate=true,previous=current){
 const ticket=++revision;
 const back=(current-1+cards.length)%cards.length;
 cards.forEach((card,i)=>{
  const d=(i-current+cards.length)%cards.length,old=card.getBoundingClientRect();
  const from=getComputedStyle(card).transform;card.getAnimations().forEach(a=>a.cancel());
  const visible=d<=2||i===back,outgoing=i===previous&&current===previous+1;
  const depth=i===back?3:d>=3?d+1:d;
  const target=stateTransform(depth),z=String(4-depth);
  const focusInside=card.contains(document.activeElement);
  if(i!==current&&focusInside)track.focus({preventScroll:true});
  card.inert=i!==current;card.setAttribute('aria-hidden',String(i!==current));card.dataset.depth=String(depth);
  card.style.zIndex=z;card.style.pointerEvents=i===current?'auto':'none';
  card.style.transform=target;card.style.visibility=visible?'visible':'hidden';
  if(animate&&!reduced.matches&&visible&&old.width){
   // Carry the whole sheet around the left edge, then return it underneath.
   // Z-order belongs to the animation so interrupted turns cancel atomically.
   const start=from==='none'?stateTransform((i-previous+cards.length)%cards.length):from;
   const outside=`translate3d(${-track.clientWidth-70}px,18px,0) rotate(-10deg) scale(.97)`;
   const frames=outgoing?[
    {transform:start,opacity:1,zIndex:'5',offset:0},
    {transform:outside,opacity:1,zIndex:'5',offset:.48},
    {transform:outside,opacity:1,zIndex:z,offset:.49},
    {transform:target,opacity:1,zIndex:z,offset:1}
   ]:[{transform:start,opacity:1},{transform:target,opacity:1}];
   const a=card.animate(frames,{duration:outgoing?720:480,easing:'cubic-bezier(.22,.68,.2,1)',fill:'none'});
   a.finished.then(()=>{if(ticket!==revision)return;card.style.visibility=visible?'visible':'hidden'}).catch(()=>{});
  }
 });
}
function metadata(){
 const storyNumber=current-1,s=data.stories[storyNumber-1],next=data.stories[Math.max(0,storyNumber)];
 const progress=Math.max(0,Math.min(storyNumber,count));
 $('position').textContent=current===0?'THE OPENING':current===1?'FRONT PAGE':storyNumber>count?'EDITION COMPLETE':`${String(storyNumber).padStart(2,'0')} / ${count} STORIES`;
 $('home').textContent=current===0?'THE PITSTOP':current===1?'FRONT PAGE':s?s.chapter.toUpperCase():'THE LAST PAGE';
 $('back').disabled=current===0;$('next').disabled=current===cards.length-1;
 $('next').innerHTML=`${current===0?'Open the edition':current===1?'Start the stories':storyNumber===count?'Finish the edition':storyNumber>count?'All caught up':'Next story'} <span aria-hidden="true">→</span>`;
 $('progress-fill').style.width=`${progress/count*100}%`;
 document.querySelector('.progress').setAttribute('aria-valuenow',progress);
 chapterButtons.forEach(x=>{if(x.chapter===s?.chapter)x.button.setAttribute('aria-current','true');else x.button.removeAttribute('aria-current')});
 document.querySelectorAll('[data-go]').forEach(b=>{if(Number(b.dataset.go)===current)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')});
 $('upnext-label').textContent=current===0?'FIRST, THE FRONT PAGE':current===1?'YOUR FIRST PIT STOP':'UP NEXT';
 $('upnext-title').textContent=current===0?'Big wins. Brave firsts.':next?plain(next.title):storyNumber===count?'Good month. Great people.':'See you next month.';
 $('upnext-section').textContent=current===0?'THE OCTOBER EDITION':next?`${next.chapter.toUpperCase()} / ${String(Math.max(1,storyNumber+1)).padStart(2,'0')}`:'THE PITSTOP / OCTOBER 2026';
 $('announcement').textContent=current===0?'The Pitstop opening slide':current===1?'Front page':s?`Story ${storyNumber} of ${count}. ${plain(s.title)}`:'You’re all caught up.';
 try{history.replaceState(null,'','#'+cards[current].id)}catch{}
 if(current>0){saved=current;try{localStorage.setItem(storageKey,String(current))}catch{}}
 $('resume').hidden=!(saved>0&&saved!==current&&saved<cards.length);$('mobile-resume').hidden=$('resume').hidden;updateScrollHint();
}
function cancelGesture(){if(!gesture)return;const id=gesture.id;gesture=null;try{track.releasePointerCapture(id)}catch{}track.classList.remove('dragging')}
function go(index,animate=true){cancelGesture();index=Math.max(0,Math.min(cards.length-1,index));const old=current;current=index;if(old!==current)cards[current].querySelector('.sheet-scroll').scrollTop=0;settle(animate,old);metadata()}
$('next').addEventListener('click',()=>go(current+1));$('back').addEventListener('click',()=>go(current-1));$('home').addEventListener('click',()=>go(0,false));$('read-again').addEventListener('click',()=>go(0,false));$('resume').addEventListener('click',()=>go(saved,false));
$('menu').addEventListener('click',()=>$('contents').showModal());$('mobile-resume').addEventListener('click',()=>{$('contents').close();go(saved,false)});
document.querySelectorAll('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.addEventListener('keydown',e=>e.stopPropagation());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close()})});
$('contents-list').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;$('contents').close();go(Number(b.dataset.go),false)});
$('back-cover').addEventListener('click',()=>{$('contents').close();go(0,false)});
track.addEventListener('click',e=>{if(performance.now()<suppressClickUntil){e.preventDefault();e.stopPropagation();return}const b=e.target.closest('[data-credit]');if(!b)return;const s=data.stories[Number(b.dataset.credit)];$('credit-title').textContent=plain(s.title);$('credit-source').textContent=s.credit;$('credit-note').textContent=s.note||'Condensed from the supplied October edition. Status and figures reflect that edition’s reporting cut-off.';const sourceData=window.PITSTOP_SOURCES||{},links=sourceData.stories?.[s.id]||[];
$('credit-links').replaceChildren();
links.forEach(source=>{
 let url;try{url=new URL(source.url)}catch{return}if(url.protocol!=='https:')return;
 const link=document.createElement('a');link.className='source-link';link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${source.label} (opens in a new tab)`);
 const copy=document.createElement('span'),label=document.createElement('strong'),detail=document.createElement('small'),arrow=document.createElement('span');label.textContent=source.label;detail.textContent=source.detail;arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');arrow.className='source-link-arrow';copy.append(label,detail);link.append(copy,arrow);$('credit-links').append(link);
});
$('credit-links-section').hidden=!$('credit-links').children.length;
const sourceNote=sourceData.context?.[s.id]||sourceData.unavailable?.[s.id]||'';$('credit-link-note').textContent=sourceNote;$('credit-link-note').hidden=!sourceNote;
$('credits').showModal()},true);
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(current+(e.key==='ArrowRight'?1:-1))}if(e.target===track&&e.key==='Home'){e.preventDefault();go(0,false)}if(e.target===track&&e.key==='End'){e.preventDefault();go(cards.length-1,false)}});
track.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0||document.querySelector('dialog[open]')||e.target.closest('button,a'))return;settle(false);gesture={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,started:false,samples:[{x:e.clientX,t:performance.now()}]}});
track.addEventListener('pointermove',e=>{if(!gesture||e.pointerId!==gesture.id)return;const g=gesture,dx=e.clientX-g.x,dy=e.clientY-g.y;
 if(!g.started){if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){gesture=null;return}if(Math.abs(dx)<8)return;g.started=true;track.setPointerCapture(e.pointerId);track.classList.add('dragging')}
 e.preventDefault();g.dx=dx;const now=performance.now();g.samples.push({x:e.clientX,t:now});g.samples=g.samples.filter(p=>now-p.t<110);
 const bounded=(current===0&&dx>0)||(current===cards.length-1&&dx<0);const travel=bounded?dx*.2:dx;
 cards[current].style.transform=`translate3d(${travel}px,${Math.abs(travel)*.025}px,0) rotate(${reduced.matches?0:travel/track.clientWidth*9}deg)`;
 if(!reduced.matches&&dx<0){const amount=Math.min(Math.abs(dx)/track.clientWidth,1);[1,2].forEach(d=>{const c=cards[(current+d)%cards.length];if(c)c.style.transform=`translate3d(${19*d*(1-amount*.7)}px,${8*d*(1-amount*.7)}px,0) rotate(${2*d*(1-amount*.7)}deg) scale(${1-.025*d*(1-amount*.7)})`})}
});
function release(e,cancel=false){if(!gesture||e.pointerId!==gesture.id)return;const g=gesture;cancelGesture();if(!g.started)return;suppressClickUntil=performance.now()+300;const last=g.samples.at(-1),first=g.samples[0],v=last&&first&&last.t>first.t?(last.x-first.x)/(last.t-first.t):0;const reversed=Math.abs(v)>.18&&Math.sign(v)!==Math.sign(g.dx);const enough=Math.abs(g.dx)>Math.min(72,track.clientWidth*.18)||(Math.abs(g.dx)>18&&Math.abs(v)>.45);go(!cancel&&!reversed&&enough?current+(g.dx<0?1:-1):current)}
track.addEventListener('pointerup',e=>release(e));track.addEventListener('pointercancel',e=>release(e,true));track.addEventListener('lostpointercapture',e=>{if(e.target===track&&gesture&&e.pointerId===gesture.id){cancelGesture();settle(true)}});
track.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX))return;if(e.ctrlKey||e.metaKey||document.querySelector('dialog[open]'))return;const scroller=cards[current].querySelector('.sheet-scroll');if(scroller.scrollHeight>scroller.clientHeight+2&&Math.abs(e.deltaY)>Math.abs(e.deltaX))return;const unit=e.deltaMode===1?16:e.deltaMode===2?track.clientHeight:1;const delta=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*unit;if(Math.abs(delta)<10)return;e.preventDefault();const now=performance.now();if(now-wheelTime>550)go(current+(delta>0?1:-1));wheelTime=now},{passive:false});
window.addEventListener('resize',()=>{cancelGesture();syncMobileViewport();fitDeck();settle(false)});reduced.addEventListener('change',()=>{cancelGesture();settle(false)});
window.addEventListener('hashchange',()=>{let target;try{target=decodeURIComponent(location.hash.slice(1))}catch{return}const n=cards.findIndex(c=>c.id===target);if(n>=0)go(n,false)});
syncMobileViewport();fitDeck();
window.visualViewport?.addEventListener('resize',()=>{if(window.visualViewport.scale!==1)return;cancelGesture();syncMobileViewport();fitDeck();settle(false)});
if(document.fonts)document.fonts.ready.then(()=>{cancelGesture();fitDeck();settle(false)});
if(window.ResizeObserver){
 const contentSizes=new ResizeObserver(entries=>{
  if(!entries.some(entry=>entry.target!==track||Math.abs(track.clientWidth-measuredDeckWidth)>.5))return;
  cancelGesture();fitDeck();settle(false);
 });
 contentSizes.observe(track);
 track.querySelectorAll('h2,.body-text,.story-accent,.stat-unit,.opening-deck,.opening-summary').forEach(node=>contentSizes.observe(node));
}
let initial=0;try{initial=cards.findIndex(c=>c.id===decodeURIComponent(location.hash.slice(1)))}catch{}go(Math.max(0,initial),false);
})();
