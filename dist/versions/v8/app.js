(() => {
'use strict';
const data=window.PITSTOP, track=document.getElementById('track'), $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.documentElement.classList.toggle('reduce-motion',reduced.matches);reduced.addEventListener('change',()=>document.documentElement.classList.toggle('reduce-motion',reduced.matches));
const tones={'Big moves':['#c6e496','#fff7e9','#ffe4f1'],'People & places':['#c8e8ff','#ffe4f1','#fff7e9'],'Freshly shipped':['#e6dfff','#c6e496','#c8e8ff'],'How we work':['#ffe4f1','#c6e496','#fff7e9'],'Take it with you':['#c8e8ff','#e6dfff','#ffe4f1'],'One last thing':['#d9eff9']};
const alts={academy:'An instructor and colleagues inspect a blue car in a sunny workshop.',business:'Illustrated colleagues and cars at a hub at sunset.',frontier:'Imagined AI event in New Delhi with a team on stage.',customer:'Illustrated family receiving car keys from an advisor.', 'akbar-birbal':'Akbar and Birbal inspecting a car in an editorial illustration.',telugu:'Imagined editorial illustration of Vijay Deverakonda beside a car.',team:'Illustrated colleagues working together around a laptop.',perspective:'Illustrated colleagues looking towards a winding road and city horizon.'};
const artDirection={
 academy:{variant:'postcard'},growth:{variant:'receipt'},ecosystem:{variant:'metric-poster'},frontier:{variant:'cinema'},startup:{variant:'ticket'},lending:{variant:'night-metric'},
 handovers:{variant:'photo-bottom',emoji:'🔑'},waits:{variant:'poster'},dehradun:{variant:'postcard',emoji:'📍'},pdi:{variant:'postcard',emoji:'🔍'},telugu:{variant:'photo-bottom',emoji:'🎬'},
 dealer:{variant:'note'},miles:{variant:'metric-split'},leads:{variant:'note'},approvals:{variant:'editorial'},saarathi:{variant:'editorial'},ownership:{variant:'poster'},security:{variant:'editorial'},
 codex:{variant:'postcard'},hackathon:{variant:'metric-split',emoji:'🧩'},milo:{variant:'editorial'},badminton:{variant:'poster',emoji:'🏸'},survey:{variant:'note',emoji:'💬'},finance:{variant:'note'},close:{variant:'editorial'},
 ambition:{variant:'photo-bottom'},controls:{variant:'note'},inflection:{variant:'poster'},safeguards:{variant:'editorial'},thermostat:{variant:'weather',emoji:'🧣'}
};
const titleLines=title=>title.split('\n').map((line,j)=>`<span class="reveal-line"><span style="--line-delay:${j*75}ms">${esc(line)}</span></span>`).join('');
const chapters=[...new Set(data.stories.map(s=>s.chapter))];
let current=0, timer, lastCelebrated=false, initialised=false;
const count=data.stories.length;
track.innerHTML=`<article class="slide cover" id="cover" aria-label="Opening card"><div class="cover-art"><img src="assets/opening.webp" alt="The Pitstop. Your story belongs here. Big wins. Brave firsts. Everyday moments. Colleagues gather around a laptop." fetchpriority="high" draggable="false"><a class="cover-share" href="${esc(data.form)}" target="_blank" rel="noopener" aria-label="Share your story with The Pitstop"></a></div><p class="cover-edition">October 2026 · ${count} little pit stops</p></article>`+
data.stories.map((s,i)=>{const isImage=s.layout==='image', direction=artDirection[s.id]||{variant:'editorial'};return `<article class="slide ${esc(s.layout)} layout-${direction.variant}" id="${esc(s.id)}" style="--tone:${tones[s.chapter][i%3]}" aria-label="Story ${i+1} of ${count}: ${esc(s.title.replace(/\n/g,' '))}">
${isImage?`<div class="image-frame"><img class="story-image" src="assets/${esc(s.image)}.webp" alt="${esc(alts[s.image])}" loading="${i===0?'eager':'lazy'}" decoding="async" draggable="false"><span class="image-label">Editorial illustration</span>${s.id==='frontier'?'<div class="event-date" aria-hidden="true"><b>29</b><span>NOV</span></div>':''}</div>`:''}
<div class="story-content">${direction.emoji?`<span class="story-emoji" aria-hidden="true">${direction.emoji}</span>`:''}<p class="story-label">${esc(s.label)}</p>${s.layout==='stat'?`<div class="big-stat">${esc(s.stat)}</div><div class="stat-unit">${esc(s.unit)}</div>`:''}<h2>${titleLines(s.title)}</h2>${s.accent?`<div class="accent">${esc(s.accent)}</div>`:''}<p class="story-body">${esc(s.body)}</p>${s.foot?`<p class="story-foot">${esc(s.foot)}</p>`:''}${s.link?`<a class="story-link" href="${esc(s.link)}" target="_blank" rel="noopener">${esc(s.linkLabel)} ↗</a>`:''}${s.layout==='winter'?'<div class="winter-scene" aria-hidden="true"><span class="snow">❄</span><div class="thermostat"><strong>22°</strong><small>STILL DEBATING</small></div><span class="snow two">❄</span></div>':''}<div class="story-bottom"><button class="story-credit" data-credit="${i}" title="Open source and credits"><span class="credit-person">${esc(s.credit.split(' · ')[0])}</span> <span class="source-word">Source <span aria-hidden="true">ⓘ</span></span></button></div></div></article>`;}).join('')+
`<article class="slide end" id="caught-up" aria-label="You’re all caught up"><div class="completion-mark" aria-hidden="true">✓</div><h2>You’re all<br>caught up.</h2><p>That’s October. Got a win, lesson, or teammate story for the next edition?</p><a href="${esc(data.form)}" target="_blank" rel="noopener">Share your story ↗</a><button class="read-again">Read again</button><span class="eyebrow">See you at the next Pitstop. <span aria-hidden="true">👋</span></span><div class="confetti" aria-hidden="true"></div></article>`;
const slides=[...track.children];
// Background artwork extracted verbatim from FLATLAND_2_SEPTEMBER.pdf.
// Physical PDF page numbers are recorded per card and in assets/flatland/manifest.json.
const flatlandBackgrounds={
 academy:['green-grid',4],growth:['cream-grid',10],ecosystem:['pink-grid',22],
 frontier:['ice-grid',2],startup:['yellow-grid',12],lending:['blue-grid',32],
 handovers:['mint-grid',28],waits:['pink-grid',22],dehradun:['green-grid',4],
 pdi:['ice-grid',2],telugu:['pink-grid',22],dealer:['ice-grid',2],
 miles:['blue-grid',32],leads:['green-grid',4],approvals:['yellow-grid',12],
 saarathi:['mint-grid',28],ownership:['green-grid',4],security:['cream-grid',10],
 codex:['blue-grid',32],hackathon:['yellow-grid',12],milo:['mint-grid',28],
 badminton:['magenta-grid',14],survey:['pink-grid',22],finance:['ice-grid',2],
 close:['cream-grid',10],ambition:['green-grid',4],controls:['yellow-grid',12],
 inflection:['pink-grid',22],safeguards:['mint-grid',28],thermostat:['ice-grid',2],
 'caught-up':['green-grid',4]
};
slides.forEach(slide=>{const background=flatlandBackgrounds[slide.id];if(!background)return;
 slide.dataset.flatland=background[0];slide.dataset.flatlandPage=background[1];
 slide.style.setProperty('--flatland-background',`url("assets/flatland/${background[0]}.svg")`);
});
const motion=window.createPitstopMotion?.({track,slides,reduced,onChange:update});
const progress=document.querySelector('.progress');progress.setAttribute('aria-valuemax',count);
function go(n,instant=false){if(motion)return motion.go(n,instant);n=Math.max(0,Math.min(slides.length-1,n));track.scrollTo({left:track.clientWidth*n,behavior:instant||reduced.matches?'instant':'smooth'});if(instant)update(n);}
function celebrate(){if(reduced.matches||lastCelebrated)return;lastCelebrated=true;document.querySelector('.confetti').innerHTML=Array.from({length:16},(_,i)=>`<i style="--x:${(i*37)%100}%;--r:${i*29}deg;animation-delay:${(i%4)*.09}s"></i>`).join('');}
function refreshReadable(){
 slides.forEach((slide,i)=>{
  const content=slide.querySelector('.story-content');if(!content)return;
  const needs=content.scrollHeight>content.clientHeight+2;
  content.classList.toggle('requires-scroll',needs);
  if(needs){content.dataset.readable='true';content.tabIndex=i===current?0:-1;content.setAttribute('role','region');content.setAttribute('aria-label','Story text. Scroll vertically to read the full story.');}
  else{delete content.dataset.readable;content.removeAttribute('tabindex');content.removeAttribute('role');content.removeAttribute('aria-label');}
 });
 const readable=slides[current]?.querySelector('.requires-scroll');
 $('gesture').innerHTML=readable?'Scroll story ↕':current===slides.length-1?'See you next month 👋':'Scroll / swipe / drag <span aria-hidden="true">↔</span>';
}
function update(n){
 const changed=!initialised||n!==current;
 const focused=document.activeElement?.closest('.slide');
 if(focused&&focused!==slides[n])track.focus({preventScroll:true});
 current=n;initialised=true;
 slides.forEach((s,i)=>{
  s.setAttribute('aria-hidden',i===n?'false':'true');s.classList.toggle('is-current',i===n);
  if(i===n&&!s.dataset.revealed){if(motion){if(motion.enter(s)!==false)s.dataset.revealed='true';}else{s.dataset.revealed='true';}}
  s.querySelectorAll('a,button,[data-readable]').forEach(el=>el.tabIndex=i===n?0:-1);
 });
 const story=data.stories[n-1],ended=n===slides.length-1;
 $('back').disabled=n===0;
 $('next').innerHTML=n===0?'Start reading <span aria-hidden="true">→</span>':ended?'Read again <span aria-hidden="true">↺</span>':n===count?'Finish the edition <span aria-hidden="true">→</span>':'Next story <span aria-hidden="true">→</span>';
 $('position').textContent=n===0?data.issue:ended?'October, wrapped.':`${String(n).padStart(2,'0')} / ${count} · ${story.chapter}`;
 $('progress-fill').style.width=`${Math.min(n,count)/count*100}%`;progress.setAttribute('aria-valuenow',Math.min(n,count));
 progress.setAttribute('aria-valuetext',n===0?'Opening card':ended?'Edition complete':`Story ${n} of ${count}: ${story.title.replace(/\n/g,' ')}`);
 document.querySelectorAll('#chapter-nav button').forEach(b=>{const active=story&&b.dataset.chapter===story.chapter;b.classList.toggle('active',!!active);if(active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 if(changed){
  $('announcement').textContent=n===0?'The Pitstop, October 2026. Use next, arrow keys, or swipe to read.':ended?'You’re all caught up.':`Story ${n} of ${count}. ${story.title.replace(/\n/g,' ')}`;
  const hash=n===0?'cover':ended?'caught-up':story.id;try{history.replaceState(null,'','#'+hash);}catch{}
  try{if(n>0&&!ended)localStorage.setItem('pitstop-oct-2026',String(n));}catch{}
 }
 requestAnimationFrame(refreshReadable);
 if(ended)celebrate();
}
$('next').addEventListener('click',()=>{if(current===slides.length-1)go(0,true);else go(Math.min(slides.length-1,(motion?.index()??current)+1));});
$('back').addEventListener('click',()=>go((motion?.index()??current)-1));$('home').addEventListener('click',()=>go(0,true));$('skip-reader').addEventListener('click',e=>{e.preventDefault();track.focus({preventScroll:true});});
document.querySelector('.logo-link').addEventListener('click',e=>{e.preventDefault();go(0,true)});
document.querySelector('.read-again').addEventListener('click',()=>go(0,true));
if(!motion){
track.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(()=>{const n=Math.round(track.scrollLeft/track.clientWidth);if(n!==current)update(n);},80);},{passive:true});
track.addEventListener('scrollend',()=>{const n=Math.round(track.scrollLeft/track.clientWidth);if(n!==current)update(n);});
// Native touch scrolling supplies direct finger tracking. Pointer drag also works with a mouse.
let drag=null;
track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('a,button'))return;drag={x:e.clientX,left:track.scrollLeft,moved:false};track.setPointerCapture(e.pointerId);track.style.scrollSnapType='none';track.style.scrollBehavior='auto';});
track.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>5)drag.moved=true;track.scrollLeft=drag.left-dx;});
function endDrag(e){if(!drag)return;const dx=e.clientX-drag.x;const origin=Math.round(drag.left/track.clientWidth);drag=null;track.style.scrollSnapType='';track.style.scrollBehavior='';go(origin+(dx<-40?1:dx>40?-1:0));}
track.addEventListener('pointerup',endDrag);track.addEventListener('pointercancel',()=>{drag=null;track.style.scrollSnapType='';track.style.scrollBehavior='';go(current);});
}
document.addEventListener('keydown',e=>{if(e.defaultPrevented||document.querySelector('dialog[open]')||e.shiftKey||e.altKey||e.ctrlKey||e.metaKey||e.target.closest?.('input,textarea,select,[contenteditable="true"]'))return;const inside=e.target===document.body||e.target===document.documentElement||e.target.closest?.('.reader');if(!inside)return;if(e.target.closest?.('.requires-scroll')&&['Home','End'].includes(e.key))return;if(e.key==='ArrowRight'){e.preventDefault();go((motion?.index()??current)+1)}if(e.key==='ArrowLeft'){e.preventDefault();go((motion?.index()??current)-1)}if(e.key==='Home'){e.preventDefault();go(0,true)}if(e.key==='End'){e.preventDefault();go(slides.length-1,true)}});
let lastSize='';const resize=new ResizeObserver(()=>{const size=track.clientWidth+'x'+track.clientHeight;if(size!==lastSize){lastSize=size;if(motion)motion.resize();else go(current,true);}refreshReadable();});resize.observe(track);document.fonts?.ready.then(refreshReadable);const contentResize=new ResizeObserver(()=>requestAnimationFrame(refreshReadable));slides.forEach(s=>s.querySelectorAll('h2,.story-body,.accent,.big-stat,.stat-unit').forEach(el=>contentResize.observe(el)));
chapters.forEach((chapter,i)=>{
 const start=data.stories.findIndex(s=>s.chapter===chapter)+1, amount=data.stories.filter(s=>s.chapter===chapter).length;
 const rail=document.createElement('button');rail.dataset.chapter=chapter;rail.innerHTML=`<small>${String(i+1).padStart(2,'0')}</small>${esc(chapter)}`;rail.addEventListener('click',()=>go(start,true));$('chapter-nav').append(rail);
 const item=document.createElement('button');item.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span><b>${esc(chapter)}</b><i>${amount} ${amount===1?'story':'stories'} ↗</i>`;item.addEventListener('click',()=>{$('contents').close();go(start,true)});$('contents-list').append(item);
});
$('menu').addEventListener('click',()=>$('contents').showModal());$('back-cover').addEventListener('click',()=>{$('contents').close();go(0,true)});
document.querySelectorAll('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{const outgoing=document.activeElement?.closest('.slide[aria-hidden="true"]');if(outgoing)track.focus({preventScroll:true});}));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
track.addEventListener('click',e=>{const b=e.target.closest('[data-credit]');if(!b)return;const s=data.stories[Number(b.dataset.credit)];$('credit-title').textContent=s.title;$('credit-source').textContent=s.credit;$('credit-note').textContent=s.note||'Condensed from the supplied October newsletter. Contributor names and the reported status are retained.';$('credits').showModal();});
// The opening stays the default. Returning readers can choose to resume.
try{const previous=Number(localStorage.getItem('pitstop-oct-2026'));if(previous>0&&previous<=count){$('resume').hidden=false;$('resume').addEventListener('click',()=>go(previous,true));$('mobile-resume').hidden=false;$('mobile-resume').textContent=`Resume at story ${previous} ↗`;$('mobile-resume').addEventListener('click',()=>{$('contents').close();go(previous,true);});}}catch{}
let hash='';try{hash=decodeURIComponent(location.hash.slice(1));}catch{}const linked=slides.findIndex(s=>s.id===hash);go(linked>=0?linked:0,true);
})();
