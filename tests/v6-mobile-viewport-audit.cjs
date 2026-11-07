/* Serve dist/, then PLAYWRIGHT_MODULE=/path/to/playwright node tests/v6-mobile-viewport-audit.cjs. */
const{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const context=await browser.newContext({viewport:{width:393,height:852},isMobile:true,hasTouch:true});
 const page=await context.newPage(),errors=[],report={layouts:[],checks:[],errors};page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.AUDIT_URL||'http://localhost:8765';
 const go=async id=>{await page.evaluate(id=>location.hash=id,id);await page.waitForFunction(id=>document.querySelector('.sheet[data-depth="0"]').id===id,id)};
 const id=()=>page.locator('.sheet[data-depth="0"]').getAttribute('id');
 for(const route of ['/','/versions/v6/']){
  await page.goto(base+route+'#academy');await page.evaluate(()=>document.fonts.ready);
  for(const [width,height]of [[320,568],[360,640],[375,667],[393,852],[414,896],[430,932],[768,1024],[844,390],[932,430],[1024,768]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(100);
   const layout=await page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return{top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height}};return{height:visualViewport.height,documentHeight:document.documentElement.scrollHeight,documentWidth:document.documentElement.scrollWidth,body:rect('body'),header:rect('.newspaper-header'),reader:rect('.reader'),track:rect('#track'),controls:rect('.controls'),footer:rect('.page-footer')}});
   assert(layout.documentHeight<=height+1,`Outer page exceeds ${width}×${height}`);assert(layout.documentWidth<=width+1);
   for(const key of ['body','header','reader','track','controls','footer']){assert(layout[key].top>=-1&&layout[key].bottom<=height+1,`${key} outside ${width}×${height}: ${JSON.stringify(layout[key])}`)}
   assert(layout.track.height>=100);assert(layout.controls.height>=44);
   const ids=await page.locator('.sheet').evaluateAll(cards=>cards.map(c=>c.id));
   for(const storyId of ids){await go(storyId);const fit=await page.evaluate(()=>{const c=document.querySelector('.sheet[data-depth="0"]'),s=c.querySelector('.sheet-scroll');s.scrollTop=s.scrollHeight;const r=s.getBoundingClientRect(),last=s.lastElementChild.getBoundingClientRect();return{overflowX:s.scrollWidth>s.clientWidth+1,scrollMode:getComputedStyle(s).overflowY,tailVisible:last.bottom<=r.bottom+1,interactive:document.querySelectorAll('.sheet:not([inert])').length,outer:scrollY}});assert(!fit.overflowX);assert.equal(fit.scrollMode,'auto');assert(fit.tailVisible,`${storyId} footer unreachable at ${width}`);assert.equal(fit.interactive,1);assert.equal(fit.outer,0)}
   report.layouts.push({route,width,height,cardHeight:Math.round(layout.track.height),cardsChecked:ids.length});
  }
 }
 await page.setViewportSize({width:393,height:852});await go('startup');await page.waitForTimeout(100);
 await page.locator('.sheet[data-depth="0"] .sheet-scroll').evaluate(s=>s.scrollTop=0);
 const box=await page.locator('#track').boundingBox(),cdp=await context.newCDPSession(page),x=box.x+box.width*.7,y=box.y+140;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let n=1;n<=8;n++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-n*15}]});await page.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(250);
 assert.equal(await id(),'startup');assert(await page.locator('.sheet[data-depth="0"] .sheet-scroll').evaluate(s=>s.scrollTop>20));assert.equal(await page.evaluate(()=>scrollY),0);report.checks.push('Vertical touch scrolls the story without moving the page or changing cards');
 await page.locator('.sheet[data-depth="0"] .sheet-scroll').evaluate(s=>s.scrollTop=0);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let n=1;n<=8;n++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-n*16,y}]});await page.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert.equal(await id(),'lending');const frames=await page.locator('#startup').evaluate(c=>c.getAnimations()[0]?.effect.getKeyframes());assert(frames?.every(f=>f.opacity==='1'||f.opacity===1));await page.waitForTimeout(800);assert.equal(await page.locator('#startup').getAttribute('data-depth'),'3');assert.equal(await page.locator('#startup').evaluate(c=>getComputedStyle(c).visibility),'visible');report.checks.push('Horizontal swipe advances one card and returns the opaque outgoing card to the back');
 await page.setViewportSize({width:393,height:640});await page.waitForTimeout(100);assert.equal(await id(),'lending');assert(await page.locator('.controls').evaluate(c=>c.getBoundingClientRect().bottom<=visualViewport.height));await page.setViewportSize({width:393,height:852});await page.waitForTimeout(100);report.checks.push('Device-height changes resize the reader and preserve the selected story');
 await go('pdi');await page.locator('.sheet[data-depth="0"] .story-credit').click();assert(await page.locator('#credits').evaluate(d=>d.open&&d.getBoundingClientRect().top>=0&&d.getBoundingClientRect().bottom<=visualViewport.height));assert.equal(await page.locator('#credits .source-link').count(),2);await page.locator('#credits .close-dialog').click();report.checks.push('Source popup remains inside the viewport and retains source links');
 await page.locator('#menu').click();const milesIndex=await page.locator('.sheet').evaluateAll(cards=>cards.findIndex(c=>c.id==='miles'));await page.locator(`[data-go="${milesIndex}"]`).click();assert.equal(await id(),'miles');report.checks.push('Contents jumps directly to a story');
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#next').click();assert.equal(await page.evaluate(()=>document.getAnimations().length),0);await page.emulateMedia({reducedMotion:'no-preference'});report.checks.push('Reduced motion keeps navigation without animation');
 await go('academy');await page.locator('.sheet[data-depth="0"] .sheet-scroll').evaluate(s=>s.scrollTop=0);await page.addScriptTag({path:path.join(__dirname,'vendor/axe.min.js')});const axe=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));report.accessibility=axe.violations.map(v=>({id:v.id,impact:v.impact}));
 await page.screenshot({path:path.join(__dirname,'../../output/v6-mobile-viewport.png')});await page.setViewportSize({width:320,height:568});await page.waitForTimeout(100);await page.screenshot({path:path.join(__dirname,'../../output/v6-small-viewport.png')});await page.setViewportSize({width:844,height:390});await page.waitForTimeout(100);await page.screenshot({path:path.join(__dirname,'../../output/v6-landscape-viewport.png')});
 fs.writeFileSync(path.join(__dirname,'../../output/v6-mobile-viewport-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();assert.equal(errors.length,0);assert.equal(report.accessibility.length,0);
})().catch(e=>{console.error(e);process.exit(1)});
