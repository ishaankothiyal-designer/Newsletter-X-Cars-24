(() => {
'use strict';
const data=window.PITSTOP,$=id=>document.getElementById(id),track=$('track');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jump=(id,title,cls='story-jump')=>`<button class="${cls}" data-target="${esc(id)}">${esc(title)}</button>`;
const chapterIndex=ch=>`<details class="chapter-accordion"><summary><span class="chapter-index">${String(ch.number).padStart(2,'0')}</span><span>${esc(ch.name)}</span></summary><div class="accordion-body">${jump('chapter-'+ch.id,'Open chapter →','chapter-open')}${ch.stories.map(id=>jump(id,data.stories.find(s=>s.id===id).title)).join('')}</div></details>`;
const indices=data.chapters.map(chapterIndex).join('');
const pages=[{id:'cover',kind:'cover'},{id:'overview',kind:'overview'}];
for(const ch of data.chapters){pages.push({id:'chapter-'+ch.id,kind:'chapter',chapter:ch});for(const id of ch.stories)pages.push({...data.stories.find(s=>s.id===id),kind:'story'});}
pages.push({id:'caught-up',kind:'ending'});
// Story art is editorial illustration, not a product screenshot or a data chart.
const image=s=>`<figure class="story-image story-visual visual-${esc(s.visual.type)}"><img data-src="${esc(s.visual.src)}" data-fallback="${esc(s.visual.fallbackSrc||s.visual.src)}" alt="${esc(s.visual.alt)}" width="${s.visual.type==='spot'?400:1200}" height="${s.visual.type==='spot'?205:800}" decoding="async" draggable="false"${s.visual.position?` style="object-position:${esc(s.visual.position)}"`:''}></figure>`;
function storyTitle(p){
 const emphasis=data.colourSystem.pages[p.id].emphasis,index=p.title.indexOf(emphasis);
 if(index<0)return esc(p.title);
 return esc(p.title.slice(0,index))+`<span class="headline-mark">${esc(emphasis)}</span>`+esc(p.title.slice(index+emphasis.length));
}
function content(p){
 if(p.kind==='cover')return `<figure class="cover-bleed"><picture><img data-src="assets/cover-portrait.webp" data-fallback="assets/cover-portrait.png" width="941" height="1672" alt="The original Pitstop colleagues gathered around their laptop, extended into an edge-to-edge illustration." fetchpriority="high" draggable="false"></picture></figure><div class="cover-heading"><h1>The Pitstop</h1><p class="cover-subtitle">What’s happening across Cars24.</p></div><div class="card-bottom">${jump('overview','Open this issue →','primary-action')}</div>`;
 if(p.kind==='overview')return `<h2>In this issue</h2><div class="chapter-list">${indices}</div>`;
 if(p.kind==='chapter'){const ch=p.chapter;return `<p class="chapter-label">Chapter ${ch.number}</p><h2>${esc(ch.name)}</h2><p class="chapter-description">${esc(ch.body)}</p><div class="chapter-stories">${ch.stories.map(id=>jump(id,data.stories.find(s=>s.id===id).title)).join('')}</div><div class="card-bottom">${jump(ch.stories[0],'Start reading →','chapter-open')}</div>`;}
 if(p.kind==='ending')return `<h2>That’s this month’s Pitstop.</h2><p>Have a win, a lesson, or a teammate’s story for the next issue?</p><div class="ending-actions">${jump('cover','Read again','secondary-action')}<a class="primary-action" href="${esc(data.form)}" target="_blank" rel="noopener">Add your story ↗</a></div>`;
 return `<div class="story-main"><h2>${storyTitle(p)}</h2>${p.visual?image(p):''}<div class="story-body">${p.body.split(/\n\n/).map(t=>`<p>${esc(t)}</p>`).join('')}</div>${p.link?`<a class="story-link" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.linkLabel||'Read more')} ↗</a>`:''}</div><div class="card-bottom"><button class="source-button" data-source="${esc(p.id)}">Story notes & sources</button><button class="page-counter" aria-label="Story ${p.number} of ${data.storyCount}. Open contents." data-contents>${p.number} / ${data.storyCount}</button></div>`;
}
track.innerHTML=pages.map(p=>`<article id="${esc(p.id)}" class="sheet layout-${esc(data.colourSystem.pages[p.id].layout)} ${p.kind==='story'&&p.body.length>430?'story-long ':''}${p.kind==='chapter'?'chapter-card':p.kind==='overview'?'contents-card':p.kind}" role="group" aria-roledescription="slide" aria-label="${esc(p.kind==='story'?`Story ${p.number} of ${data.storyCount}: ${p.title}`:p.kind==='chapter'?p.chapter.name:p.kind==='overview'?'In this issue':p.kind==='cover'?'The Pitstop cover':'End of the issue')}"><div class="sheet-scroll" tabindex="0" aria-label="${p.kind==='story'?'Story content':'Page content'}">${content(p)}</div></article>`).join('');
$('contents-list').innerHTML=indices;
for(const list of document.querySelectorAll('.chapter-list,#contents-list'))list.addEventListener('toggle',e=>{if(e.target.tagName==='DETAILS'&&e.target.open)for(const other of list.querySelectorAll('details'))if(other!==e.target)other.open=false;},true);
// The PDF's page-by-page palette creates contrasting papers in every visible stack.
track.querySelectorAll('.sheet').forEach((card,i)=>{
 const paper=data.colourSystem.pages[pages[i].id].paper;
 card.dataset.flatland=paper;card.style.setProperty('--flatland-background',`url('assets/flatland/${paper}.svg')`);card.style.setProperty('--page-stock',data.colourSystem.stocks[paper].hex);
});
const cards=[...track.children],reduced=matchMedia('(prefers-reduced-motion: reduce)'),storageKey='pitstop-v8-clean-last-story';let current=0,revision=0,gesture=null,suppress=0,wheelAt=0,dragFrame=0,viewportFrame=0;const motions=new Map();
// V6's original geometry and opaque card-to-back animation, kept intact.
const stateTransform=d=>d===0?'translate3d(0,0,0) rotate(0deg) scale(1)':d===1?'translate3d(19px,8px,0) rotate(2deg) scale(.975)':d===2?'translate3d(37px,16px,0) rotate(4deg) scale(.95)':`translate3d(${d<0?-track.clientWidth-100:50}px,12px,0) rotate(${d<0?-12:5}deg) scale(.95)`;
// Read all in-flight transforms before any writes. A re-grab starts exactly here.
function freezeMotion(){
 const positions=cards.map(card=>card.style.visibility==='visible'?getComputedStyle(card).transform:null);
 for(const animation of motions.values())animation.cancel();motions.clear();
 cards.forEach((card,i)=>{if(positions[i])card.style.transform=positions[i]});
 return positions;
}
function settle(animate=true,previous=current,motion={}){
 const width=track.clientWidth,ticket=++revision,positions=freezeMotion(),back=(current-1+cards.length)%cards.length;
 const forward=current===previous+1,oldBack=(previous-1+cards.length)%cards.length;
 const depart=Math.max(140,Math.min(240,motion.depart||210)),returnMs=240,total=depart+returnMs,handoff=depart/total;
 let outgoingAnimation=null;
 cards.forEach((card,i)=>{
  const d=(i-current+cards.length)%cards.length,depth=i===back?3:d>=3?d+1:d;
  const visible=d<=2||i===back,carryTail=animate&&!reduced.matches&&forward&&i===oldBack;
  const target=stateTransform(depth),z=String(4-depth);
  if(i!==current&&card.contains(document.activeElement))track.focus({preventScroll:true});
  card.inert=i!==current;card.setAttribute('aria-hidden',String(i!==current));card.dataset.depth=String(depth);
  card.style.zIndex=carryTail?'0':z;card.style.pointerEvents=i===current?'auto':'none';
  card.style.transform=target;card.style.visibility=visible||carryTail?'visible':'hidden';
  if(!animate||reduced.matches||!visible)return;
  const start=positions[i]||stateTransform((i-previous+cards.length)%cards.length);
  const outgoing=i===previous&&forward;
  const outside=`translate3d(${-width-70}px,18px,0) rotate(-10deg) scale(.97)`;
  // V6's opaque paper path and layer hand-off, without an intervening snap to rest.
  const frames=outgoing?[
   {transform:start,opacity:1,zIndex:'5',offset:0,easing:'cubic-bezier(.2,.6,.25,1)'},
   {transform:outside,opacity:1,zIndex:'5',offset:handoff},
   {transform:outside,opacity:1,zIndex:z,offset:handoff+.001,easing:'cubic-bezier(.22,.68,.2,1)'},
   {transform:target,opacity:1,zIndex:z,offset:1}
  ]:[{transform:start,opacity:1},{transform:target,opacity:1}];
  if(start===target)return;
  const animation=card.animate(frames,{duration:outgoing?total:previous===current?160:forward?depart+40:260,easing:outgoing?'linear':'cubic-bezier(.22,.68,.2,1)',fill:'none'});
  motions.set(card,animation);if(outgoing)outgoingAnimation=animation;
  animation.finished.then(()=>{if(motions.get(card)===animation)motions.delete(card)}).catch(()=>{});
 });
 // Keep the existing back sheet underneath until the outgoing sheet lands on it.
 const finish=()=>{if(ticket!==revision)return;cards.forEach((card,i)=>{if(card.dataset.depth==='0'||Number(card.dataset.depth)<=2||i===back)return;card.style.visibility='hidden';});};
 if(outgoingAnimation)outgoingAnimation.finished.then(finish).catch(()=>{});else finish();
 return {duration:forward?depart:300};
}
function cancel(){if(dragFrame){cancelAnimationFrame(dragFrame);dragFrame=0;}if(!gesture)return;const id=gesture.id;gesture=null;track.removeAttribute('data-dragging');try{track.releasePointerCapture(id)}catch{}}
function matrixParts(value){const m=new DOMMatrixReadOnly(value==='none'||!value?undefined:value);return{x:m.m41,y:m.m42,angle:Math.atan2(m.m12,m.m11)*180/Math.PI,scale:Math.hypot(m.m11,m.m12)}}
function drawDrag(){
 dragFrame=0;const g=gesture;if(!g?.started)return;
 const dx=g.dx,bounded=(current===0&&dx>0)||(current===cards.length-1&&dx<0),travel=bounded?dx*.2:dx;
 cards[current].style.transform=`translate3d(${g.origin.x+travel}px,${g.origin.y+Math.abs(travel)*.025}px,0) rotate(${reduced.matches?0:g.origin.angle+travel/g.width*9}deg) scale(${g.origin.scale})`;
 if(!reduced.matches&&dx<0){const amount=Math.min(Math.abs(dx)/g.width,1);[1,2].forEach(d=>{const card=cards[(current+d)%cards.length],from=g.followers[d-1],end={x:19*d*.3,y:8*d*.3,angle:2*d*.3,scale:1-.025*d*.3};if(card)card.style.transform=`translate3d(${from.x+(end.x-from.x)*amount}px,${from.y+(end.y-from.y)*amount}px,0) rotate(${from.angle+(end.angle-from.angle)*amount}deg) scale(${from.scale+(end.scale-from.scale)*amount})`;});}
}

function go(index,animate=true,motion={}){window.PITSTOP_SOUND?.stop?.();cancel();index=Math.max(0,Math.min(cards.length-1,index));const previous=current;current=index;if(previous!==current)cards[current].querySelector('.sheet-scroll').scrollTop=0;const startedAt=performance.now(),turn=settle(animate,previous,motion);window.PITSTOP_IMAGES?.warm(cards,current);if(previous!==current&&animate)window.PITSTOP_SOUND?.play({...turn,startedAt});$('back').disabled=$('menu-back').disabled=current===0;$('next').disabled=$('menu-next').disabled=current===cards.length-1;const p=pages[current];$('announcement').textContent=p.kind==='story'?`Story ${p.number} of ${data.storyCount}. ${p.title}`:p.kind==='chapter'?`Chapter ${p.chapter.number}. ${p.chapter.name}`:p.kind==='overview'?'In this issue':p.kind==='cover'?'The Pitstop cover':'End of the issue';try{history.replaceState(null,'','#'+p.id);localStorage.setItem(storageKey,p.id)}catch{}}
function target(id){const n=pages.findIndex(p=>p.id===id);go(n<0?1:n,false)}
function showContents(){for(const details of $('contents').querySelectorAll('details'))details.open=false;const p=pages[current],ch=p.kind==='chapter'?p.chapter.id:p.chapterId;if(ch){const at=data.chapters.findIndex(x=>x.id===ch);const d=$('contents-list').querySelectorAll('details')[at];if(d)d.open=true;}$('contents').showModal();}
function notes(id){const s=data.stories.find(s=>s.id===id);if(!s)return;$('credit-title').textContent=s.title;$('credit-source').textContent=s.sourceCredit||s.credit;$('credit-note').textContent=[s.note,window.PITSTOP_SOURCES?.context?.[id],window.PITSTOP_SOURCES?.unavailable?.[id]].filter(Boolean).join('\n\n');$('original-update').textContent=s.originalBody||s.body;$('credit-links').replaceChildren();const links=s.sourceLinks||window.PITSTOP_SOURCES?.stories?.[id]||[];for(const source of links){let url;try{url=new URL(source.url)}catch{continue}if(url.protocol!=='https:')continue;const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';const label=document.createElement('span');label.textContent=source.label+' ↗';const detail=document.createElement('small');detail.textContent=source.detail||'';a.append(label,detail);$('credit-links').append(a);}$('credit-art').replaceChildren();if(s.images?.length>1){for(const name of s.images.slice(1)){const img=document.createElement('img');img.dataset.src=s.imageFiles[name];img.dataset.fallback=s.imageFiles[name].replace('.webp','.png');img.alt='Additional supplied illustration of the Diwali celebration.';$('credit-art').append(img);window.PITSTOP_IMAGES?.load(img,img.dataset.src,img.dataset.fallback,'high');}}$('credits').querySelector('.full-update').open=false;$('credits').showModal();}
document.addEventListener('click',e=>{const jump=e.target.closest('[data-target]');if(jump){document.querySelectorAll('dialog[open]').forEach(d=>d.close());target(jump.dataset.target);return}if(e.target.closest('[data-contents]'))showContents();const source=e.target.closest('[data-source]');if(source)notes(source.dataset.source);});
$('back').addEventListener('click',()=>go(current-1));$('next').addEventListener('click',()=>go(current+1));$('menu').addEventListener('click',showContents);$('menu-back').addEventListener('click',()=>{$('contents').close();go(current-1)});$('menu-next').addEventListener('click',()=>{$('contents').close();go(current+1)});
for(const dialog of document.querySelectorAll('dialog')){dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('keydown',e=>e.stopPropagation());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});}
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('summary,button,a,input,textarea,select'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(current+(e.key==='ArrowRight'?1:-1));}if(e.target===track&&e.key==='Home'){e.preventDefault();go(0,false)}if(e.target===track&&e.key==='End'){e.preventDefault();go(cards.length-1,false)}});
track.addEventListener('dragstart',e=>e.preventDefault());
// A drag may start on any card action. Suppress only its compatibility click;
// untouched taps and keyboard activation keep their normal behaviour.
track.addEventListener('click',e=>{if(performance.now()<suppress&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation();}},true);
track.addEventListener('pointerdown',e=>{
 if(!e.isPrimary||e.button!==0||e.target.closest('input,textarea,select,[contenteditable="true"],dialog'))return;
 suppress=0;
 // A tap or vertical scroll must not reset an animation already in flight.
 gesture={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,started:false,samples:[{x:e.clientX,t:performance.now()}]};
});
track.addEventListener('pointermove',e=>{
 const g=gesture;if(!g||e.pointerId!==g.id)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;
 if(!g.started){if(Math.abs(dy)>Math.abs(dx)*1.2&&Math.abs(dy)>8){gesture=null;return;}if(Math.abs(dx)<6||Math.abs(dx)<Math.abs(dy)*1.05)return;
  window.PITSTOP_SOUND?.stop?.();const positions=freezeMotion();g.origin=matrixParts(positions[current]);g.followers=[1,2].map(d=>matrixParts(positions[(current+d)%cards.length]||stateTransform(d)));
  g.width=track.clientWidth;g.started=true;track.setPointerCapture(e.pointerId);track.setAttribute('data-dragging','true');
 }
 e.preventDefault();g.dx=dx;const now=performance.now();g.samples.push({x:e.clientX,t:now});g.samples=g.samples.filter(p=>now-p.t<110);
 if(!dragFrame)dragFrame=requestAnimationFrame(drawDrag);
});
function release(e,canceled=false){
 const g=gesture;if(!g||e.pointerId!==g.id)return;
 if(!g.started){gesture=null;return;}
 // Settle from the last painted frame, without a write/read layout flush on release.
 if(dragFrame){cancelAnimationFrame(dragFrame);dragFrame=0;}
 // Include the release position even if Chrome coalesced the final move event.
 const releasedAt=performance.now();if(!canceled&&Number.isFinite(e.clientX)){g.dx=e.clientX-g.x;if(g.samples.at(-1)?.x!==e.clientX)g.samples.push({x:e.clientX,t:releasedAt});g.samples=g.samples.filter(p=>releasedAt-p.t<110);}
 const last=g.samples.at(-1),first=g.samples[0],velocity=last&&first&&performance.now()-last.t<110&&last.t>first.t?(last.x-first.x)/(last.t-first.t):0;
 const reversed=last&&first&&Math.abs(last.x-first.x)>=14&&Math.abs(velocity)>.25&&Math.sign(velocity)!==Math.sign(g.dx);
 const enough=Math.abs(g.dx)>=Math.min(28,track.clientWidth*.065)||(Math.abs(g.dx)>=12&&Math.abs(velocity)>=.22);
 const depart=Math.max(140,Math.min(240,(g.width-Math.min(Math.abs(g.dx),g.width*.85))/Math.max(.7,Math.abs(velocity))*.7));
 cancel();suppress=performance.now()+300;go(!canceled&&!reversed&&enough?current+(g.dx<0?1:-1):current,true,{depart});
}
track.addEventListener('pointerup',e=>release(e));track.addEventListener('pointercancel',e=>release(e,true));
track.addEventListener('lostpointercapture',e=>{if(e.target===track&&gesture?.started){cancel();settle(true,current)}});
track.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)<=Math.abs(e.deltaY)||e.ctrlKey||e.metaKey||document.querySelector('dialog[open]'))return;if(Math.abs(e.deltaX)<12)return;e.preventDefault();const now=performance.now();if(now-wheelAt>500)go(current+(e.deltaX>0?1:-1));wheelAt=now;},{passive:false});
let lastViewportWidth=0,lastViewportHeight=0,viewportTimer=0;
function viewport(){
 const v=visualViewport;if(v&&Math.abs(v.scale-1)>.01)return;
 const width=Math.floor(v?.width||innerWidth),height=Math.floor(v?.height||innerHeight);
 // VisualViewport also fires during browser chrome/scroll updates. Ignore unchanged geometry.
 if(width===lastViewportWidth&&height===lastViewportHeight)return;
 // Safari toolbar height changes must not reset a drag or a card in flight.
 if(width===lastViewportWidth&&(gesture?.started||motions.size)){clearTimeout(viewportTimer);viewportTimer=setTimeout(scheduleViewport,100);return;}
 lastViewportWidth=width;lastViewportHeight=height;document.documentElement.style.setProperty('--viewport-height',`${height}px`);const coverImage=document.querySelector('#cover img'),coverSource=track.clientWidth/track.clientHeight>=.82?'assets/cover-wide.webp':'assets/cover-portrait.webp';window.PITSTOP_IMAGES?.load(coverImage,coverSource,coverSource.replace('.webp','.png'),'high');cancel();settle(false,current);
}
function scheduleViewport(){if(!viewportFrame)viewportFrame=requestAnimationFrame(()=>{viewportFrame=0;viewport()});}
window.addEventListener('resize',scheduleViewport);window.visualViewport?.addEventListener('resize',scheduleViewport);reduced.addEventListener('change',()=>settle(false,current));window.addEventListener('hashchange',()=>{try{target(decodeURIComponent(location.hash.slice(1)))}catch{target('overview')}});
viewport();let initial='cover';try{initial=decodeURIComponent(location.hash.slice(1))||'cover'}catch{}target(initial);
})();
