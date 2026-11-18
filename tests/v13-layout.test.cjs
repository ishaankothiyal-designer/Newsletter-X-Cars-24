const{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('fs'),path=require('node:path');
const url=process.env.PITSTOP_URL||'http://127.0.0.1:8798/versions/v13/';
const artDir=path.join(__dirname,'../dist/assets/story-graphics/v13');
(async()=>{const browser=await chromium.launch({channel:'chrome'});try{
const page=await browser.newPage({reducedMotion:'reduce'});const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url())});
for(const width of [320,375,414,768,1024,1440]){
 await page.setViewportSize({width,height:960});await page.goto(url);await page.evaluate(()=>document.fonts.ready);
 const ids=await page.locator('[data-story]').evaluateAll(es=>es.map(e=>e.id));assert.equal(ids.length,23);
 for(const id of ids){const card=page.locator('#'+id),front=card.locator('.story-front'),back=card.locator('.story-back');
  await front.scrollIntoViewIfNeeded();const img=front.locator('img');await img.evaluate(e=>e.decode());assert(await img.evaluate(e=>e.naturalWidth>0));
  await front.click();assert.equal(await back.evaluate(e=>e.inert),false);assert.equal(await front.getAttribute('aria-expanded'),'true');
  const geometry=await card.evaluate(e=>{const r=e.getBoundingClientRect();return [...e.querySelectorAll('.story-back h3,.story-back .body,.story-back img,.story-back-action')].filter(x=>x.getClientRects().length).map(x=>{const b=x.getBoundingClientRect();return {tag:x.tagName,inside:b.left>=r.left-1&&b.right<=r.right+1&&b.top>=r.top-1&&b.bottom<=r.bottom+1}})});assert(geometry.every(e=>e.inside),width+' '+id+' back content escapes '+JSON.stringify(geometry));
  await page.keyboard.press('Escape');assert.equal(await front.getAttribute('aria-expanded'),'false');assert.equal(await front.evaluate(e=>e===document.activeElement),true);
 }
 const pairs=await page.locator('.pair:not(.single)').evaluateAll(es=>es.filter(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length===2).map(e=>[...e.children].map(c=>c.getBoundingClientRect().height)));assert(pairs.every(a=>Math.max(...a)-Math.min(...a)<2),'row height mismatch '+width);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'document overflow '+width);
 
 console.log(width+'px: 23 cards, images, content bounds, Escape/focus, paired heights and document width passed');
}
await page.setViewportSize({width:1440,height:960});await page.goto(url);await page.locator('#lending .story-front').hover();await page.waitForTimeout(50);assert.equal(await page.locator('.pointer-cue').evaluate(e=>getComputedStyle(e).visibility),'visible');assert.equal(await page.locator('.pointer-cue').textContent(),'Tap to read more');assert.equal(await page.locator('.pointer-cue').evaluate(e=>getComputedStyle(e).pointerEvents),'none');await page.locator('#lending .story-front').click();assert.equal(await page.locator('.pointer-cue').evaluate(e=>getComputedStyle(e).visibility),'hidden');
// Artwork geometry must have breathing room inside the viewBox, including stroke allowance.
for(const file of fs.readdirSync(artDir)){
 await page.goto(new URL('../../assets/story-graphics/v13/'+file,url).href);
 const bounds=await page.locator('svg').evaluate(e=>{const b=e.querySelector('g').getBBox(),v=e.viewBox.baseVal;return {x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,w:v.width,h:v.height}});assert(bounds.x>=8&&bounds.y>=8&&bounds.right<=bounds.w-8&&bounds.bottom<=bounds.h-8,file+' unsafe SVG geometry '+JSON.stringify(bounds));
}
const touch=await browser.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true});const mobile=await touch.newPage();await mobile.goto(url);assert.equal(await mobile.locator('.pointer-cue').count(),0);await mobile.locator('#growth .story-front').tap();assert.equal(await mobile.locator('#growth .story-front').getAttribute('aria-expanded'),'true');await mobile.locator('#growth .story-back-action').tap();assert.equal(await mobile.locator('#growth .story-front').getAttribute('aria-expanded'),'false');await touch.close();
const motion=await browser.newPage({reducedMotion:'no-preference',viewport:{width:1280,height:960}});
await motion.goto(url);await motion.evaluate(()=>document.fonts.ready);
const front=motion.locator('#lending .story-front'),flipper=motion.locator('#lending .story-flipper');
await front.click();await motion.waitForTimeout(100);
const during=await flipper.evaluate(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).m11);
assert(Math.abs(during)<.999,'Card must pass through an intermediate 3D rotation');
await motion.waitForTimeout(400);
assert(await flipper.evaluate(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).m11<-.99),'Open card must complete its 180-degree flip');
await motion.locator('#lending .story-back-action').click();await motion.waitForTimeout(450);
assert(await flipper.evaluate(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).m11>.99),'Closing restores the front face');
await motion.close();console.log('3D flip animation and return verified with normal motion');
assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('Pointer cue, touch, all 17 SVG safe bounds passed; no page errors or missing assets');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
