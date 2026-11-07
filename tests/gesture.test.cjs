const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/motion.js','utf8'),sandbox);
const target=sandbox.window.PitstopGesture.releaseTarget;
const choose=overrides=>target({origin:8,delta:0,velocity:0,width:393,count:32,...overrides});
const cases=[
 ['comfortable short left drag', {delta:-44},9],
 ['comfortable short right drag',{delta:44},7],
 ['accidental 8px movement',{delta:8,velocity:.1},8],
 ['deliberate fast left flick',{delta:-18,velocity:-.6},9],
 ['deliberate fast right flick',{delta:18,velocity:.6},7],
 ['reversal returns to origin',{delta:-60,velocity:.7},8],
 ['slow long left movement',{delta:-100,velocity:0},9],
 ['beginning clamps',{origin:0,delta:80,velocity:.5},0],
 ['end clamps',{origin:31,delta:-80,velocity:-.5},31],
 ['desktop distance remains easy',{delta:-44,width:1440},9],
 ['small phone distance remains easy',{delta:-33,width:320},9],
 ['zero movement never turns',{delta:0,velocity:3},8]
];
for(const [name,input,expected]of cases)assert.equal(choose(input),expected,name);
console.log(`${cases.length} gesture intent and boundary cases passed.`);
