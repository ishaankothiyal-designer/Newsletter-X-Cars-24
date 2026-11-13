"""Export the V9 reader as a self-contained HTML file for HTML Hub."""
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
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()

data = json.loads(subprocess.check_output(['node', '-e', 'global.window={};require("./dist/stories.js");console.log(JSON.stringify(window.PITSTOP))'], cwd=repo))
css = (v9 / 'v9.css').read_text().replace("@import url('../../reader-tokens.css');", (dist / 'reader-tokens.css').read_text())
css = re.sub(r"url\('([^']+)'\)", lambda m: "url('" + data_uri((v9 / m[1]).resolve()) + "')", css)
js = (v9 / 'v9.js').read_text().replace("'versions/v9/#'", "'#'")
# Dynamic paper backgrounds use the same embedded SVG assets as the hosted edition.
papers = {key: data_uri(dist / 'assets/flatland' / (key + '.svg')) for key in data['colourSystem']['stocks']}
assets = {}
aliases = {}
for story in data['stories']:
    src = story['visual']['src']
    assets[src] = data_uri(dist / src)
    aliases[story['visual'].get('fallbackSrc', src)] = src
    for file in story.get('imageFiles', {}).values():
        target = (dist / file).with_suffix('.webp')
        assets[file] = data_uri(target if target.is_file() else dist / file)
js = js.replace('const asset=src=>esc(src);', 'const asset=src=>esc(V9_ASSETS[V9_ALIASES[src]||src]||src);')
js = js.replace("`url('../../assets/flatland/${paper}.svg')`", "`url('${V9_PAPERS[paper]}')`")
js = re.sub(r'assets/[a-zA-Z0-9_./-]+', lambda m: data_uri((dist / m[0]).with_suffix('.webp') if (dist / m[0]).with_suffix('.webp').is_file() else dist / m[0]) if (dist / m[0]).is_file() else m[0], js)
js = 'const V9_PAPERS=' + json.dumps(papers) + ';\nconst V9_ASSETS=' + json.dumps(assets) + ';\nconst V9_ALIASES=' + json.dumps(aliases) + ';\n' + js
html = (v9 / 'index.html').read_text().replace('<base href="../../">', '')
html = re.sub(r'<link rel="(?:preload|stylesheet)"[^>]+>', '', html)
html = re.sub(r'<script[^>]+></script>', '', html)
html = html.replace('href="versions/v9/#', 'href="#')
html = re.sub(r'(?<=["\'])assets/[a-zA-Z0-9_./-]+', lambda m: data_uri(dist / m[0]), html)
script = 'window.PITSTOP=' + json.dumps(data, ensure_ascii=False) + ';\n' + (dist / 'sources.js').read_text() + '\n' + js
script = script.replace('</script', '<\\/script')
html = html.replace('</head>', '<style>' + css + '</style></head>').replace('</body>', '<script>' + script + '</script></body>')
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html)
print(f'Exported {out.name}: {out.stat().st_size:,} bytes')
