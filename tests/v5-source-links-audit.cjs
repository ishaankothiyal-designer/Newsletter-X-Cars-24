/* Serve dist/, then PLAYWRIGHT_MODULE=/path/to/playwright node tests/v5-source-links-audit.cjs. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const page=await browser.newPage(),errors=[],report={routes:[],errors};page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.AUDIT_URL||'http://localhost:8765';
 for(const route of ['/','/versions/v5/']){
  await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
  const records=await page.evaluate(()=>window.PITSTOP.stories.map(s=>({id:s.id,title:s.title.replace(/\n/g,' '),links:window.PITSTOP_SOURCES.stories[s.id]||[]})));
  assert.equal(records.filter(s=>s.links.length).length,27);
  for(const width of [320,393,1040]){
   await page.setViewportSize({width,height:955});
   for(const story of records){
    await page.evaluate(id=>location.hash=id,story.id);await page.waitForFunction(id=>document.querySelector('.sheet[data-depth="0"]').id===id,story.id);
    await page.locator('.sheet[data-depth="0"] .story-credit').click();
    assert.equal(await page.locator('#credit-title').textContent(),story.title);
    const actual=await page.locator('#credit-links .source-link').evaluateAll(links=>links.map(a=>({href:a.href,target:a.target,rel:a.rel,label:a.getAttribute('aria-label')})));
    assert.equal(actual.length,story.links.length);
    actual.forEach((link,i)=>{assert.equal(link.href,new URL(story.links[i].url).href);assert.equal(link.target,'_blank');assert(link.rel.includes('noopener'));assert(link.label.includes('new tab'))});
    const layout=await page.locator('#credits').evaluate(d=>({overflow:d.scrollWidth>d.clientWidth+1,open:d.open,missing:!d.querySelector('#credit-link-note').hidden,section:d.querySelector('#credit-links-section').hidden}));
    assert(layout.open&&!layout.overflow,`${story.id} dialog fits at ${width}`);if(!actual.length){assert(layout.missing&&layout.section)}
    await page.locator('#credits .close-dialog').click();
   }
   report.routes.push({route,width,storiesChecked:records.length,linkedStories:27});
  }
 }
 await page.setViewportSize({width:393,height:852});await page.evaluate(()=>location.hash='pdi');await page.waitForFunction(()=>document.querySelector('.sheet[data-depth="0"]').id==='pdi');await page.locator('.sheet[data-depth="0"] .story-credit').click();
 await page.addScriptTag({path:path.join(__dirname,'vendor/axe.min.js')});const axe=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));report.accessibility=axe.violations.map(v=>({id:v.id,impact:v.impact}));
 await page.screenshot({path:path.join(__dirname,'../../output/v5-story-source-popup.png')});
 fs.writeFileSync(path.join(__dirname,'../../output/v5-source-links-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();assert.equal(errors.length,0);assert.equal(report.accessibility.length,0);
})().catch(e=>{console.error(e);process.exit(1)});
