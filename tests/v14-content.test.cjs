const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const dir=path.join(__dirname,'../dist/versions/v14'),html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const stories=[...html.matchAll(/<article class="story [^"]*" id="s(\d+)"/g)].map(m=>+m[1]);
assert.equal(stories.length,19,'19 stories');assert.deepEqual(stories,stories.map((_,i)=>i+1),'stories numbered in order');
for(const id of ['business','builders','life','games'])assert(html.includes(`id="${id}"`),id+' section present');
for(const m of new Set([...html.matchAll(/(?:src|href)="(img\/[^"]+)"/g)].map(m=>m[1])))assert(fs.statSync(path.join(dir,m)).size>0,m+' exists');
for(const banned of ['Double issue','New<br>in Nov','No. 02','Price ₹0','explained simply'])assert(!html.includes(banned),'removed: '+banned);
console.log('V14 passed: 19 stories in 3 parts plus games; all images present; removed copy stays removed.');
