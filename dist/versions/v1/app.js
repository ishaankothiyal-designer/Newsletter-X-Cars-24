(() => {
'use strict';
const data=window.PITSTOP, track=document.getElementById('track'), $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const tones={'Big moves':['#c6e496','#fff7e9','#ffe4f1'],'People & places':['#c8e8ff','#ffe4f1','#fff7e9'],'Freshly shipped':['#e6dfff','#c6e496','#c8e8ff'],'How we work':['#ffe4f1','#c6e496','#fff7e9'],'Take it with you':['#c8e8ff','#e6dfff','#ffe4f1'],'One last thing':['#d9eff9']};
const alts={academy:'An instructor and colleagues inspect a blue car in a sunny workshop.',business:'Illustrated colleagues and cars at a hub at sunset.',frontier:'Imagined AI event in New Delhi with a team on stage.',customer:'Illustrated family receiving car keys from an advisor.', 'akbar-birbal':'Akbar and Birbal inspecting a car in an editorial illustration.',telugu:'Imagined editorial illustration of Vijay Deverakonda beside a car.',team:'Illustrated colleagues working together around a laptop.',perspective:'Illustrated colleagues looking towards a winding road and city horizon.'};
const chapters=[...new Set(data.stories.map(s=>s.chapter))];
let current=0, timer, lastCelebrated=false;
const count=data.stories.length;
track.innerHTML=`<article class="slide cover" id="cover" aria-label="Opening card"><div class="cover-art"><img src="assets/opening.webp" alt="The Pitstop. Your story belongs here. Big wins. Brave firsts. Everyday moments. Colleagues gather around a laptop." fetchpriority="high" draggable="false"><a class="cover-share" href="${esc(data.form)}" target="_blank" rel="noopener" aria-label="Share your story with The Pitstop"></a></div><p class="cover-edition">October 2026 · ${count} little pit stops</p></article>`+
data.stories.map((s,i)=>{const isImage=s.layout==='image';return `<article class="slide ${esc(s.layout)}" id="${esc(s.id)}" style="--tone:${tones[s.chapter][i%3]}" aria-label="Story ${i+1} of ${count}: ${esc(s.title.replace(/\n/g,' '))}">
${isImage?`<div class="image-frame"><img class="story-image" src="assets/${esc(s.image)}.webp" alt="${esc(alts[s.image])}" loading="${i===0?'eager':'lazy'}" draggable="false"><span class="image-label">Editorial illustration</span></div>`:'<span class="doodle" aria-hidden="true">✳</span>'}
<div class="story-content"><p class="story-label">${esc(s.label)}</p>${s.layout==='stat'?`<div class="big-stat">${esc(s.stat)}</div><div class="stat-unit">${esc(s.unit)}</div>`:''}<h2>${esc(s.title)}</h2>${s.accent?`<div class="accent">${esc(s.accent)}</div>`:''}<p class="story-body">${esc(s.body)}</p>${s.foot?`<p class="story-foot">${esc(s.foot)}</p>`:''}${s.link?`<a class="story-link" href="${esc(s.link)}" target="_blank" rel="noopener">${esc(s.linkLabel)} ↗</a>`:''}${s.layout==='winter'?'<div class="winter-scene" aria-hidden="true"><span class="snow">✳</span><div class="thermostat"><strong>22°</strong><small>STILL DEBATING</small></div><span class="snow two">✳</span></div>':''}<div class="story-bottom"><button class="story-credit" data-credit="${i}" aria-label="Story source and credits for ${esc(s.title.replace(/\n/g,' '))}">${esc(s.credit)} <span aria-hidden="true">ⓘ</span></button></div></div></article>`;}).join('')+
`<article class="slide end" id="caught-up" aria-label="You’re all caught up"><div class="completion-mark" aria-hidden="true">✓</div><h2>You’re all<br>caught up.</h2><p>That’s October. Got a win, lesson, or teammate story for the next edition?</p><a href="${esc(data.form)}" target="_blank" rel="noopener">Share your story ↗</a><button class="read-again">Read again</button><span class="eyebrow">See you at the next Pitstop.</span><div class="confetti" aria-hidden="true"></div></article>`;
const slides=[...track.children];
const progress=document.querySelector('.progress');progress.setAttribute('aria-valuemax',count);
function go(n,instant=false){n=Math.max(0,Math.min(slides.length-1,n));track.scrollTo({left:track.clientWidth*n,behavior:instant||reduced.matches?'instant':'smooth'});if(instant)update(n);}
function celebrate(){if(reduced.matches||lastCelebrated)return;lastCelebrated=true;document.querySelector('.confetti').innerHTML=Array.from({length:16},(_,i)=>`<i style="--x:${(i*37)%100}%;--r:${i*29}deg;animation-delay:${(i%4)*.09}s"></i>`).join('');}
function update(n){
 current=n;
 slides.forEach((s,i)=>{s.setAttribute('aria-hidden',i===n?'false':'true');s.querySelectorAll('a,button').forEach(el=>el.tabIndex=i===n?0:-1);});
 const story=data.stories[n-1], ended=n===slides.length-1;
 $('back').disabled=n===0;
 $('next').innerHTML=n===0?'Start reading <span aria-hidden="true">→</span>':ended?'Read again <span aria-hidden="true">↺</span>':n===count?'Finish the edition <span aria-hidden="true">→</span>':'Next story <span aria-hidden="true">→</span>';
 $('position').textContent=n===0?data.issue:ended?'October, wrapped.':`${String(n).padStart(2,'0')} / ${count} · ${story.chapter}`;
 $('gesture').innerHTML=n===0?'Swipe to read <span aria-hidden="true">↔</span>':ended?'Until next time ✳':'Swipe <span aria-hidden="true">↔</span>';
 $('progress-fill').style.width=`${Math.min(n,count)/count*100}%`;progress.setAttribute('aria-valuenow',Math.min(n,count));
 document.querySelectorAll('#chapter-nav button').forEach(b=>{const active=story&&b.dataset.chapter===story.chapter;b.classList.toggle('active',!!active);if(active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 $('announcement').textContent=n===0?'The Pitstop, October 2026. Start reading or swipe left.':ended?'You’re all caught up.':`Story ${n} of ${count}. ${story.title.replace(/\n/g,' ')}`;
 const hash=n===0?'cover':ended?'caught-up':story.id;history.replaceState(null,'','#'+hash);
 try{if(n>0&&!ended)localStorage.setItem('pitstop-oct-2026',String(n));}catch{}
 if(ended)celebrate();
}
$('next').addEventListener('click',()=>go(current===slides.length-1?0:current+1));
$('back').addEventListener('click',()=>go(current-1));$('home').addEventListener('click',()=>go(0));
document.querySelector('.logo-link').addEventListener('click',e=>{e.preventDefault();go(0)});
document.querySelector('.read-again').addEventListener('click',()=>go(0));
track.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(()=>{const n=Math.round(track.scrollLeft/track.clientWidth);if(n!==current)update(n);},80);},{passive:true});
track.addEventListener('scrollend',()=>{const n=Math.round(track.scrollLeft/track.clientWidth);if(n!==current)update(n);});
// Native touch scrolling supplies direct finger tracking. Pointer drag also works with a mouse.
let drag=null;
track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('a,button'))return;drag={x:e.clientX,left:track.scrollLeft,moved:false};track.setPointerCapture(e.pointerId);track.style.scrollSnapType='none';track.style.scrollBehavior='auto';});
track.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>5)drag.moved=true;track.scrollLeft=drag.left-dx;});
function endDrag(e){if(!drag)return;const dx=e.clientX-drag.x;const origin=Math.round(drag.left/track.clientWidth);drag=null;track.style.scrollSnapType='';track.style.scrollBehavior='';go(origin+(dx<-40?1:dx>40?-1:0));}
track.addEventListener('pointerup',endDrag);track.addEventListener('pointercancel',()=>{drag=null;track.style.scrollSnapType='';track.style.scrollBehavior='';go(current);});
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight'){e.preventDefault();go(current+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(current-1)}if(e.key==='Home'){e.preventDefault();go(0)}if(e.key==='End'){e.preventDefault();go(slides.length-1)}});
const resize=new ResizeObserver(()=>go(current,true));resize.observe(track);
chapters.forEach((chapter,i)=>{
 const start=data.stories.findIndex(s=>s.chapter===chapter)+1, amount=data.stories.filter(s=>s.chapter===chapter).length;
 const rail=document.createElement('button');rail.dataset.chapter=chapter;rail.innerHTML=`<small>${String(i+1).padStart(2,'0')}</small>${esc(chapter)}`;rail.addEventListener('click',()=>go(start));$('chapter-nav').append(rail);
 const item=document.createElement('button');item.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span><b>${esc(chapter)}</b><i>${amount} ${amount===1?'story':'stories'} ↗</i>`;item.addEventListener('click',()=>{$('contents').close();go(start)});$('contents-list').append(item);
});
$('menu').addEventListener('click',()=>$('contents').showModal());$('back-cover').addEventListener('click',()=>{$('contents').close();go(0)});
document.querySelectorAll('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
track.addEventListener('click',e=>{const b=e.target.closest('[data-credit]');if(!b)return;const s=data.stories[Number(b.dataset.credit)];$('credit-title').textContent=s.title;$('credit-source').textContent=s.credit;$('credit-note').textContent=s.note||'Condensed from the supplied October newsletter. Contributor names and the reported status are retained.';$('credits').showModal();});
// The opening stays the default. Returning readers can choose to resume.
try{const previous=Number(localStorage.getItem('pitstop-oct-2026'));if(previous>0&&previous<=count){$('resume').hidden=false;$('resume').addEventListener('click',()=>go(previous));}}catch{}
const hash=decodeURIComponent(location.hash.slice(1));const linked=slides.findIndex(s=>s.id===hash);go(linked>=0?linked:0,true);
})();
