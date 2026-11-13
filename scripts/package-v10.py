"""Export the V10 newspaper as a self-contained HTML file for HTML Hub."""
from pathlib import Path
import base64
import json
import mimetypes
import re
import subprocess
import sys

repo = Path(__file__).resolve().parents[1]
dist = repo / 'dist'
v10 = dist / 'versions/v10'
out = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else repo.parent / 'output/The-Pitstop-V10.html'


def data_uri(path):
    if not path.is_file():
        raise FileNotFoundError(f'Cannot package missing asset: {path}')
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()


def inline_css(path):
    css = path.read_text()
    css = re.sub(r'@import\s+url\([\"\']?([^\"\')]+)[\"\']?\);', lambda m: inline_css((path.parent / m[1]).resolve()), css)
    def embed(match):
        src = match[1].strip().strip('\"\'')
        if src.startswith(('data:', 'https:', 'http:', '#')):
            return match[0]
        return 'url("' + data_uri((path.parent / src).resolve()) + '")'
    return re.sub(r'url\(([^)]+)\)', embed, css)


data = json.loads(subprocess.check_output(['node', '-e', 'global.window={};require("./dist/stories.js");console.log(JSON.stringify(window.PITSTOP))'], cwd=repo))
css = inline_css(v10 / 'v10.css')
js = (v10 / 'v10.js').read_text().replace("'versions/v10/#'", "'#'")
render_script = r'''const fs=require('fs'),vm=require('vm');
const root={innerHTML:''};
const context={window:{},document:{getElementById:()=>root,querySelectorAll:()=>[],querySelector:()=>({style:{}}),documentElement:{scrollHeight:1000}},addEventListener:()=>{},innerHeight:800,scrollY:0,location:{hash:''}};
for(const file of ['dist/stories.js','dist/sources.js','dist/versions/v10/v10.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
process.stdout.write(root.innerHTML);'''
rendered = subprocess.check_output(['node', '-e', render_script], cwd=repo, text=True)
assets = {}
for src in re.findall(r'(?:src|data-fallback)="(assets/[^"]+)"', rendered):
    assets[src] = data_uri(dist / src)
for story in data['stories']:
    for src in story.get('imageFiles', {}).values():
        if src:
            assets[src] = data_uri(dist / src)
# Include V10's generated newspaper illustrations, including assets selected dynamically by story ID.
for file in (dist / 'assets/v10').rglob('*'):
    if file.is_file() and file.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp', '.svg', '.avif'}:
        assets[str(file.relative_to(dist))] = data_uri(file)
for src in re.findall(r'assets/[a-zA-Z0-9_./-]+\.(?:svg|png|webp|jpg|jpeg|avif)', js):
    assets[src] = data_uri(dist / src)
resolver = 'const asset=src=>esc(src);'
if resolver not in js:
    raise RuntimeError('V10 asset resolver changed; update the packager to embed its dynamic image sources.')
js = js.replace(resolver, 'const asset=src=>esc(V10_ASSETS[src]||src);')
# Literal URLs inside template HTML bypass the dynamic asset resolver.
js = re.sub(r'(?<=[\"\'])assets/[a-zA-Z0-9_./-]+\.(?:svg|png|webp|jpg|jpeg|avif)', lambda m: assets[m[0]], js)
js = 'const V10_ASSETS=' + json.dumps(assets) + ';\n' + js
html = (v10 / 'index.html').read_text().replace('<base href="../../">', '')
html = re.sub(r'<link rel="(?:preload|stylesheet)"[^>]+>', '', html)
html = re.sub(r'<script[^>]+></script>', '', html)
html = html.replace('href="versions/v10/#', 'href="#')
html = re.sub(r'(?<=[\"\'])assets/[a-zA-Z0-9_./-]+', lambda m: data_uri(dist / m[0]), html)
script = 'window.PITSTOP=' + json.dumps(data, ensure_ascii=False) + ';\n' + (dist / 'sources.js').read_text() + '\n' + js
script = script.replace('</script', '<\\/script')
html = html.replace('</head>', '<style>' + css + '</style></head>').replace('</body>', '<script>' + script + '</script></body>')
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html)
print(f'Exported {out.name}: {out.stat().st_size:,} bytes')
