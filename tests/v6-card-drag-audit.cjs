const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  for(const mobile of [false,true]){
   const context=await browser.newContext({viewport:mobile?{width:393,height:852}:{width:1440,height:1100},isMobile:mobile,hasTouch:mobile});
   const page=await context.newPage();await page.goto((process.env.AUDIT_URL||'http://localhost:8771')+'/versions/v6/#cover');await page.reload();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);
   const ids=await page.locator('.sheet').evaluateAll(cards=>cards.map(c=>c.id));assert.equal(ids.length,32);
   const cdp=mobile?await context.newCDPSession(page):null;
   await page.evaluate(()=>{window.linkClicks=0;document.querySelector('.original-artwork').addEventListener('click',e=>{e.preventDefault();window.linkClicks++})});
   for(let i=0;i<ids.length;i++){
    const box=await page.locator(i===0?'.original-artwork':'#track').boundingBox();const x=box.x+box.width*.75,y=box.y+Math.min(90,box.height*.3),dx=i===ids.length-1?130:-130;
    if(mobile){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let n=1;n<=8;n++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*n/8,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}
    else{await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+dx,y,{steps:8});await page.mouse.up()}
    assert.equal(await page.locator('.sheet[data-depth="0"]').getAttribute('id'),ids[i===ids.length-1?i-1:i+1],`Drag ${ids[i]}`);
    if(i===0)assert.equal(await page.evaluate(()=>window.linkClicks),0,'Dragging artwork must not open link');
    await page.waitForTimeout(100);
   }
   await page.goto((process.env.AUDIT_URL||'http://localhost:8771')+'/versions/v6/#cover');await page.reload();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);
   await page.evaluate(()=>{window.linkClicks=0;document.querySelector('.original-artwork').addEventListener('click',e=>{e.preventDefault();window.linkClicks++})});
   if(mobile)await page.locator('.original-artwork').tap();else await page.locator('.original-artwork').click();assert.equal(await page.evaluate(()=>window.linkClicks),1,'Tap/click still activates cover link');
   console.log(`PASS: all 32 V6 cards draggable with ${mobile?'touch':'mouse'}; cover drag suppresses link, tap/click activates it`);await context.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
