"""Export the V9 reader as a self-contained HTML file for HTML Hub.

V9 is now a fully self-contained edition (its own STORIES array in v9.js, no dependency on the
shared dist/stories.js) — this packager works the same way scripts/package-v10.py's asset-
discovery does, just without any shared-data merge step.
"""
from pathlib import Path
import base64
import json
import mimetypes
import re
import subprocess
import sys

repo = Path(__file__).resolve().parents[1]
dist = repo / 'dist'
v9 = dist / 'versions/v9'
out = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else repo.parent / 'output/The-Pitstop-V9.html'


def data_uri(path):
    if not path.is_file():
        raise FileNotFoundError(f'Cannot package missing asset: {path}')
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()


def inline_css(path):
    css = path.read_text()
    css = re.sub(r'@import\s+url\(["\']?([^"\')]+)["\']?\);', lambda m: inline_css((path.parent / m[1]).resolve()), css)
    def embed(match):
        src = match[1].strip().strip('"\'')
        if src.startswith(('data:', 'https:', 'http:', '#')):
            return match[0]
        return 'url("' + data_uri((path.parent / src).resolve()) + '")'
    return re.sub(r'url\(([^)]+)\)', embed, css)


css = inline_css(v9 / 'v9.css')
js = (v9 / 'v9.js').read_text().replace("'versions/v9/#'", "'#'")
render_script = r'''const fs=require('fs'),vm=require('vm');
const root={innerHTML:''};
const context={window:{},document:{getElementById:()=>root,querySelectorAll:()=>[],querySelector:()=>({style:{}}),documentElement:{scrollHeight:1000}},addEventListener:()=>{},innerHeight:800,scrollY:0,location:{hash:''}};
vm.runInNewContext(fs.readFileSync('dist/versions/v9/v9.js','utf8'),context);
process.stdout.write(root.innerHTML);'''
rendered = subprocess.check_output(['node', '-e', render_script], cwd=repo, text=True)
assets = {}
for src in re.findall(r'(?:src|data-fallback)="(assets/[^"]+)"', rendered):
    assets[src] = data_uri(dist / src)
for src in re.findall(r'assets/[a-zA-Z0-9_./-]+\.(?:svg|png|webp|jpg|jpeg|avif)', js):
    assets[src] = data_uri(dist / src)
resolver = 'const asset=src=>esc(src);'
if resolver not in js:
    raise RuntimeError('V9 asset resolver changed; update the packager to embed its dynamic image sources.')
js = js.replace(resolver, 'const asset=src=>esc(V9_ASSETS[src]||src);')
# Literal URLs inside template HTML bypass the dynamic asset resolver.
js = re.sub(r'(?<=["\'])assets/[a-zA-Z0-9_./-]+\.(?:svg|png|webp|jpg|jpeg|avif)', lambda m: assets[m[0]], js)
js = 'const V9_ASSETS=' + json.dumps(assets) + ';\n' + js
html = (v9 / 'index.html').read_text().replace('<base href="../../">', '')
html = re.sub(r'<link rel="(?:preload|stylesheet)"[^>]+>', '', html)
html = re.sub(r'<script[^>]+></script>', '', html)
html = html.replace('href="versions/v9/#', 'href="#')
html = re.sub(r' data-fallback="assets/[a-zA-Z0-9_./-]+\.png"', '', html)
html = re.sub(r'(?<=["\'])assets/[a-zA-Z0-9_./-]+', lambda m: data_uri(dist / m[0]), html)
script = js.replace('</script', '<\\/script')
html = html.replace('</head>', '<style>' + css + '</style></head>').replace('</body>', '<script>' + script + '</script></body>')
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html)
print(f'Exported {out.name}: {out.stat().st_size:,} bytes')
