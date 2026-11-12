// Optional asset preparation: npm install --no-save @resvg/resvg-js.
// The renderer can also be supplied as an absolute module path (no runtime dependency).
const fs=require('node:fs'),path=require('node:path');
const {Resvg}=require(process.argv[2]||'@resvg/resvg-js');
const root=path.join(__dirname,'../dist'),folder=path.join(root,'assets/story-graphics');
for(const file of fs.readdirSync(folder).filter(x=>x.endsWith('.svg'))){
 const png=new Resvg(fs.readFileSync(path.join(folder,file)),{fitTo:{mode:'width',value:800},font:{loadSystemFonts:false}}).render().asPng();
 const name=file.replace(/\.svg$/,'.png');
 for(const base of [root,path.join(root,'versions/v8')])fs.writeFileSync(path.join(base,'assets/story-graphics',name),png);
}
console.log('Prepared PNG versions of the 18 editorial spot illustrations. SVG originals retained.');
