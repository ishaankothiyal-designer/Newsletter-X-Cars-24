/* V8, V9 and V10 share the approved story list, labels and source objects. */
(() => {
'use strict';
const d=window.PITSTOP, sources=window.PITSTOP_SOURCES||{}, root=document.getElementById('newsletter');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const href=id=>'versions/v10/#'+encodeURIComponent(id);
const asset=src=>esc(src);
const link=(url,label,cls='')=>/^https:\/\//.test(url||'')?`<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`:'';
function title(s){return esc(s.title);}
const pressArt={frontier:['press-tech','An imagined newspaper ink illustration of colleagues building connected-car technology.'],diwali:['press-life','An imagined newspaper ink illustration of colleagues celebrating Diwali together.']};
function art(s){const item=pressArt[s.id];return item?`<figure class="art art-scene"><img src="${asset('assets/v10/'+item[0]+'.webp')}" alt="${esc(item[1])}" loading="lazy" decoding="async" width="1536" height="864"></figure>`:'';}
function notes(s){const urls=s.sourceLinks||sources.stories?.[s.id]||[];return `<div class="notes"><button type="button" class="notes-trigger" aria-haspopup="dialog" aria-controls="notes-${esc(s.id)}" aria-label="Story notes & sources: ${esc(s.title)}">Story notes & sources <svg class="notes-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 12l8-8M4 4h8v8"/></svg></button><dialog class="notes-dialog" id="notes-${esc(s.id)}" aria-labelledby="notes-heading-${esc(s.id)}"><header class="notes-dialog-header"><h2 id="notes-heading-${esc(s.id)}">Story notes & sources</h2><button type="button" class="notes-close" aria-label="Close story notes" autofocus><svg aria-hidden="true" viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></button></header><div class="notes-body" tabindex="0" role="region" aria-label="Notes for ${esc(s.title)}"><p class="notes-story-title">${esc(s.title)}</p><p class="credit">${esc(s.sourceCredit||s.credit)}</p>${[s.note,sources.context?.[s.id],sources.unavailable?.[s.id]].filter(Boolean).map(t=>`<p>${esc(t)}</p>`).join('')}${s.foot?`<p>${esc(s.foot)}</p>`:''}<div class="source-links">${urls.map(u=>link(u.url,u.label)+(u.detail?`<small>${esc(u.detail)}</small>`:'')).join('')}</div><div class="original"><h3>Full supplied update</h3><p>${esc(s.originalBody||s.body)}</p></div>${s.images?.length>1?s.images.slice(1).map(n=>`<img class="extra-art" src="${asset(s.imageFiles[n])}" alt="Additional supplied illustration of the Diwali celebration." loading="lazy">`).join(''):''}</div></dialog></div>`;}
function story(id,size=''){const s=d.stories.find(s=>s.id===id);return `<article class="story ${size}" id="${esc(id)}" data-story="${esc(id)}" aria-labelledby="title-${esc(id)}"><div class="story-inner"><div class="story-copy"><p class="eyebrow">${esc(s.label)}</p><h3 id="title-${esc(id)}">${title(s)}</h3>${s.stat?`<p class="story-stat${s.id==='hackathon'?' inline-stat':''}">${esc(s.stat)} <small>${esc(s.unit||'')}</small></p>`:''}<div class="body">${s.body.split(/\n\n/).map(t=>`<p>${esc(t)}</p>`).join('')}</div>${s.link?link(s.link,s.linkLabel||'Read more','story-link'):''}</div>${art(s)}</div>${notes(s)}</article>`;}
const rows={business:story('growth','lead text-lead')+`<div class="pair">${story('ecosystem')}${story('lending')}</div><div class="pair">${story('startup')}${story('dhanteras')}</div>`,builders:`<div class="pair tech-opening">${story('academy')}${story('frontier')}</div>`+`<div class="release-list">${['dealer','miles','leads','approvals','saarathi','ownership','security'].map(id=>story(id,'release')).join('')}</div><div class="pair">${story('codex')}${story('hackathon')}</div>`,life:story('diwali','lead')+`<div class="pair">${story('milo')}${story('badminton')}</div><div class="pair">${story('survey')}${story('thermostat')}</div>`,perspectives:`<div class="pair voices">${['ambition','controls','inflection','safeguards'].map(id=>story(id,'voice')).join('')}</div>`};
root.innerHTML=`<section class="front-page wrap" id="cover" aria-labelledby="cover-title"><div class="front-grid"><figure class="front-image"><img src="${asset('assets/v10/press-cover.webp')}" alt="Ink illustration of the four colleagues from the original Pitstop cover celebrating together around their laptop, with a winding road and car behind them." width="1600" height="900" fetchpriority="high"></figure><aside class="front-rail" aria-label="Headlines"><a href="${href('growth')}" class="front-stat"><strong>₹5,300 <span>crore+</span></strong><p>H1 FY27 gross merchandise value</p></a><a href="${href('dhanteras')}" class="front-stat"><strong>381</strong><p>Cars sold on Dhanteras</p></a><a href="${href('frontier')}" class="front-headline"><h2>Frontier ’26: 30+ AI releases</h2><p>29 November · New Delhi</p></a></aside></div></section>
<nav class="chapter-nav" id="briefing" aria-label="Newsletter chapters"><div class="nav-inner"><a href="${href('cover')}" class="nav-top" aria-label="Back to top">↑</a>${d.chapters.map(ch=>`<a href="${href(ch.id)}" data-chapter="${ch.id}"><span>0${ch.number}</span> ${esc(({business:'Business',builders:'Tech',life:'Life',perspectives:'Voices'})[ch.id])}</a>`).join('')}<span class="nav-progress" aria-hidden="true"></span></div></nav>
<div class="wrap chapters">${d.chapters.map(ch=>`<section class="chapter" id="${ch.id}" aria-labelledby="heading-${ch.id}"><header class="chapter-heading"><span class="chapter-number">0${ch.number}</span><div><h2 id="heading-${ch.id}">${esc(ch.name)}</h2></div></header>${rows[ch.id]}</section>`).join('')}</div>
<footer class="ending" id="caught-up"><h2>Share your story</h2>${link(d.form,'Contribute to the next issue','read-button')}<a href="${href('cover')}" class="read-again">Back to top ↑</a></footer>`;
// Native dialogs keep notes outside document flow and provide modal focus containment.
for(const trigger of document.querySelectorAll('.notes-trigger')){
  const dialog=document.getElementById(trigger.getAttribute('aria-controls'));
  trigger.addEventListener('click',()=>{dialog.showModal();dialog.querySelector('.notes-body').scrollTop=0;});
  dialog.querySelector('.notes-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>trigger.focus({preventScroll:true}));
  dialog.addEventListener('keydown',e=>{
    if(e.key!=='Tab')return;
    const items=[...dialog.querySelectorAll('button:not([disabled]),a[href],[tabindex="0"]')].filter(el=>el.getClientRects().length);
    const first=items[0],last=items.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  // A backdrop click dismisses; dragging from inside the popup does not.
  let backdropStart=false;
  const outside=e=>{const r=dialog.getBoundingClientRect();return e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom;};
  dialog.addEventListener('pointerdown',e=>{backdropStart=e.target===dialog&&outside(e);});
  dialog.addEventListener('click',e=>{if(backdropStart&&e.target===dialog&&outside(e))dialog.close();backdropStart=false;});
}
for(const img of document.querySelectorAll('img[data-fallback]'))img.addEventListener('error',()=>{if(img.dataset.fallback){img.src=img.dataset.fallback;delete img.dataset.fallback;}},{once:true});
// Account for navigation wrapping and larger user text when positioning deep links.
const chapterNav=document.querySelector('.chapter-nav');
if(typeof ResizeObserver!=='undefined'&&chapterNav){
  new ResizeObserver(()=>document.documentElement.style.setProperty('--nav-height',`${chapterNav.getBoundingClientRect().height}px`)).observe(chapterNav);
}
// Native document scrolling: links, browser find, text selection, and keyboard reading all work normally.
const navLinks=[...document.querySelectorAll('[data-chapter]')],chapters=[...document.querySelectorAll('.chapter')];
let frame=0;function update(){frame=0;const active=chapters.filter(el=>el.getBoundingClientRect().top<=180).at(-1);for(const a of navLinks){if(a.dataset.chapter===active?.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.nav-progress').style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});addEventListener('resize',update);document.fonts?.ready.then(update);update();
// A base URL is used for V8's shared assets; restore this edition's story deep links after rendering.
const initialHash=location.hash;
if(initialHash){const loaded=document.readyState==='complete'?Promise.resolve():new Promise(resolve=>addEventListener('load',resolve,{once:true}));Promise.all([loaded,document.fonts?.ready]).then(()=>requestAnimationFrame(()=>{if(location.hash!==initialHash)return;let id;try{id=decodeURIComponent(initialHash.slice(1))}catch{return}document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'});}));}
})();
