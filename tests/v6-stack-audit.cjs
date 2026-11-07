const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  const base=process.env.AUDIT_URL||'http://localhost:8767';
  for(const route of ['/', '/versions/v6/', '/versions/v7/']){
   await page.goto(base+route+'#academy');await page.evaluate(()=>document.fonts.ready);
   await page.locator('#next').click();
   const frames=await page.locator('#academy').evaluate(c=>c.getAnimations()[0].effect.getKeyframes());
   assert(frames.every(f=>f.opacity==='1'||f.opacity===1),'Outgoing sheet remains opaque');
   assert.equal(frames.at(-1).zIndex,'1');
   assert.equal(frames.some(f=>f.transform.includes('rotateY(-98deg)')),route!=='/versions/v6/','V6 uses cards; root and V7 use page turns');
   await page.waitForTimeout(800);
   const back=await page.locator('#academy').evaluate(c=>({depth:c.dataset.depth,visible:getComputedStyle(c).visibility,inert:c.inert,z:c.style.zIndex}));
   assert.deepEqual(back,{depth:'3',visible:'visible',inert:true,z:'1'});
   assert.equal(await page.locator('.sheet[data-depth="0"]').getAttribute('id'),'growth');
   for(let n=0;n<4;n++)await page.keyboard.press('ArrowRight');
   await page.waitForTimeout(800);
   assert.equal(await page.locator('.sheet:not([inert])').count(),1);
   assert.equal(await page.locator('.sheet[data-depth="3"]').evaluate(c=>getComputedStyle(c).visibility),'visible');
   await page.emulateMedia({reducedMotion:'reduce'});await page.keyboard.press('ArrowLeft');
   assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
   await page.emulateMedia({reducedMotion:'no-preference'});
  }
  await page.goto(base+'/#growth');await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:require('node:path').join(__dirname,'../../output/v6-stack-desktop.png'),fullPage:true});
  await page.setViewportSize({width:393,height:852});await page.screenshot({path:require('node:path').join(__dirname,'../../output/v6-stack-mobile.png'),fullPage:true});
  console.log('PASS: V6 uses card motion; root and V7 use page turns; all retain the back sheet; opaque motion, rapid navigation, reduced motion.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
