const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),v8=path.join(dist,'versions/v8'),context={window:{}};
assert.deepEqual(fs.readdirSync(path.join(dist,'versions')),['v8'],'Only V8 may remain');
for(const file of ['versions.json','version-picker.js','version-picker.css','app.js','design-reference.html'])assert(!fs.existsSync(path.join(dist,file)),file+' is a retired entry point');
for(const base of [dist,v8]){
 const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
 assert(!/id="(?:versions|menu-versions|version-dialog|page-sound|test-page-sound)"/.test(html),'Version controls must be removed');
 assert(html.includes('src="sources.js"'),'Current source map must load');
 const reader=fs.readFileSync(path.join(base,'reader.js'),'utf8');
 assert(!reader.includes('versions.json')&&!reader.includes('version-dialog'),'Reader must not load retired versions');
}
vm.runInNewContext(fs.readFileSync(path.join(v8,'stories.js'),'utf8'),context);
const d=context.window.PITSTOP,stories=d.stories;
assert.equal(stories.length,26);assert.equal(d.chapters.length,4);assert.equal(stories.length+d.chapters.length+3,33);
assert.deepEqual(Array.from(d.chapters,ch=>ch.stories.length),[7,10,5,4]);
assert.equal(new Set(stories.map(s=>s.id)).size,26);
assert.equal(d.chapters[1].name,'Builders at Work');assert(!d.chapters.some(ch=>ch.id==='tech'));
assert.equal(d.chapterAliases['chapter-tech'],'chapter-builders');
for(const s of stories){assert(s.body.split(/\s+/).length<=38,s.id+' exceeds the reading budget');assert(s.navTitle.length<=24,s.id+' navigation label');}
for(const id of ['handovers','waits','dehradun','pdi','telugu'])assert(!stories.find(s=>s.id===id),id);
for(const ch of d.chapters)for(const id of ch.stories)assert.equal(stories.find(s=>s.id===id).chapterId,ch.id);
assert.equal(stories.filter(s=>s.id==='academy').length,1);
assert(stories.find(s=>s.id==='ownership').body.includes('targeted for 29 October'));
assert(stories.find(s=>s.id==='lending').body.includes('771 deliveries'));
for(const story of stories){assert(story.body.length>40,story.id);assert(story.credit,story.id);assert(story.originalBody,story.id);assert(!story.title.includes('\n'),story.id);}
// Every story has purposeful, accessible artwork in both published entry points.
assert.equal(new Set(stories.map(s=>s.visual.src)).size,26);
assert.equal(stories.filter(s=>s.visual.type==='spot').length,18);
for(const story of stories){
 assert(story.visual.alt.length>30,story.id+' visual needs descriptive alt text');
 for(const base of [dist,v8]){assert(fs.statSync(path.join(base,story.visual.src)).size>0,story.id+' missing art');assert(fs.statSync(path.join(base,story.visual.fallbackSrc)).size>0,story.id+' missing fallback');}
 assert.equal(fs.readFileSync(path.join(dist,story.visual.src)).compare(fs.readFileSync(path.join(v8,story.visual.src))),0,story.id+' art parity');
}
const diwali=stories.find(s=>s.id==='diwali');assert.equal(diwali.sourceLinks.length,2);for(const file of Object.values(diwali.imageFiles))assert(fs.statSync(path.join(v8,file)).size>0);
for(const file of ['index.html','reader-images.js','sources.js','stories.js','reader.js','reader.css','reader-tokens.css','flatland-ui.css'])assert.equal(fs.readFileSync(path.join(dist,file),'utf8'),fs.readFileSync(path.join(v8,file),'utf8'),file);
const js=fs.readFileSync(path.join(v8,'reader.js'),'utf8');
assert(js.includes('rotate(-10deg) scale(.97)'));
assert(js.includes('duration:outgoing?total:previous===current?160:forward?depart+40:260'));
assert(js.includes('width===lastViewportWidth&&(gesture?.started||motions.size)'));
for(const file of ['cover-portrait.png','cover-wide.png','cars24-logo-black.svg'])assert(fs.statSync(path.join(v8,'assets',file)).size>0);
assert(!fs.readFileSync(path.join(v8,'index.html'),'utf8').includes('page-footer'));
const pageIds=['cover','overview'];for(const ch of d.chapters)pageIds.push('chapter-'+ch.id,...ch.stories);pageIds.push('caught-up');
assert.equal(Object.keys(d.colourSystem.pages).length,pageIds.length);
for(let i=0;i<pageIds.length;i++){
 const stack=Array.from({length:4},(_,depth)=>d.colourSystem.pages[pageIds[(i+depth)%pageIds.length]].paper);
 assert.equal(new Set(stack).size,4,pageIds[i]+' repeats paper in its visible stack');
}
assert.equal(new Set(pageIds.map(id=>d.colourSystem.pages[id].paper)).size,8);
for(const s of stories){const style=d.colourSystem.pages[s.id];assert(s.title.includes(style.emphasis),s.id+' emphasis must preserve the headline');assert(style.referencePage>=1&&style.referencePage<=38);}
assert.equal(new Set(stories.map(s=>d.colourSystem.pages[s.id].layout)).size,5);
for(const [id,stock] of Object.entries(d.colourSystem.stocks)){
 const svg=fs.readFileSync(path.join(v8,'assets/flatland',id+'.svg'),'utf8').toLowerCase();assert(svg.includes('fill="'+stock.hex.toLowerCase()+'"'),id);
}
assert.equal(d.colourSystem.ink,'#000000');
assert(!js.includes('Issue 10'),'Cover must not display an issue number');
function luminance(hex){const c=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];}
for(const [id,style] of Object.entries(d.colourSystem.pages)){const paper=d.colourSystem.stocks[style.paper].hex,muted=style.paper==='magenta-grid'?'#111111':'#333333';assert((luminance(paper)+.05)/(luminance(muted)+.05)>=4.5,id+' muted text contrast');}
console.log('V8 contract passed: 26 stories, four chapters, 33 pages, V6-style animation, responsive original-art cover, source status, root parity.');
