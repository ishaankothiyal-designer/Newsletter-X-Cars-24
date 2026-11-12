/* Explicitly prepare the next papers instead of relying on lazy-loading hidden cards. */
(() => {
 'use strict';
 const records=new WeakMap();
 function load(img,source=img.dataset.src,fallback=img.dataset.fallback,priority='low'){
  if(!source)return;
  img.fetchPriority=priority;
  if(records.get(img)?.source===source)return;
  img.dataset.src=source;if(fallback)img.dataset.fallback=fallback;
  const frame=img.closest('figure')||img.parentElement;
  frame.querySelector('.image-retry')?.remove();frame.dataset.imageState='loading';img.removeAttribute('data-ready');
  const retry=new URL(source,document.baseURI);retry.searchParams.set('image-retry',Date.now());
  const choices=[...new Set([source,fallback,retry.href].filter(Boolean))],record={source,index:0,active:source};records.set(img,record);
  const current=path=>records.get(img)===record&&record.active===path&&!record.failed;
  const ready=path=>{if(current(path)){img.dataset.ready='true';frame.dataset.imageState='ready'}};
  const failed=path=>{
   if(!current(path))return;
   if(++record.index<choices.length){record.active=choices[record.index];img.src=record.active;return;}
   record.failed=true;frame.dataset.imageState='error';
   const button=document.createElement('button');button.className='image-retry';button.textContent='Reload image';button.setAttribute('aria-label','Reload illustration');
   button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();records.delete(img);load(img,source,fallback,'high')});frame.append(button);
  };
  img.onload=()=>{
   const path=record.active;
   if(typeof img.decode==='function')Promise.resolve(img.decode()).then(()=>ready(path)).catch(()=>failed(path));else ready(path);
  };
  img.onerror=()=>failed(record.active);
  img.loading='eager';img.src=source;
  if(img.complete&&img.naturalWidth>0)img.onload();
 }
 function warm(cards,index){
  for(const offset of [0,1,2,3,4,-1,-2]){
   const card=cards[(index+offset+cards.length)%cards.length];
   for(const img of card.querySelectorAll('img[data-src]'))load(img,img.dataset.src,img.dataset.fallback,offset===0?'high':'low');
  }
 }
 window.PITSTOP_IMAGES={load,warm};
})();
