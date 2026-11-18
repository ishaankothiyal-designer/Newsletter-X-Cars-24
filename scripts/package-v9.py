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
# Keep in sync with V9_HIDDEN / V9_OVERRIDES in dist/versions/v9/v9.js. The rendered page and the
# embedded JSON must match exactly — overriding a field at render time is not enough on its own;
# the raw (pre-override) value would otherwise still be sitting in "view source".
V9_HIDDEN = {'dhanteras', 'security'}
C2C_GLOSS = 'C2C – Cars24’s Consumer-to-Consumer marketplace, where everyday buyers purchase used cars from Cars24'
OWNERSHIP_GLOSS = 'Deemed Ownership – lets a delivered car’s buyer act as the owner (insurance, challans) while the RC transfer is still in progress'
WECARE_GLOSS = 'WeCare – Cars24’s internal employee-support ticketing system'
V9_OVERRIDES = {
    'growth': {
        'body': 'GMV — the combined value of every car Cars24 buys and sells across India, UAE and Australia — grew 29% year-on-year to ₹5,300 crore+ in H1 FY27 (Apr–Sep 2026). Net revenue rose even faster, up 33%+ to ₹921 crore.',
        'glossary': 'GMV – Gross Merchandise Value',
        'detail': 'GMV tells you how much is moving through Cars24; net revenue tells you how much of that Cars24 actually earns — and it’s growing faster than GMV because more customers are buying financing, insurance and ownership services alongside the car, not just the car itself. H1’s ₹5,300 crore+ puts the full year on track for ₹12,000 crore+, and the EBITDA loss has narrowed to just ~1% of GMV — Cars24’s closest it’s been to breaking even at this scale.',
    },
    'startup': {
        'detail': 'The four tracks are lending & fintech, mobility & road safety, logistics & supply chain, and sovereign AI — all real problems Cars24 works on every day. Startups apply, get shortlisted, and spend time building before pitching to a jury. The top 20 get a month of mentorship in December, and winners share the ₹1 crore prize pool at the New Delhi finale. The idea: find founders already working on problems Cars24 cares about, and give them a reason to build with Cars24 instead of around it.',
    },
    'frontier': {
        'detail': 'This isn’t a launch for one feature — it’s Cars24 opening up its entire effort to rebuild the company around AI, in front of the country. The event is positioned as India’s biggest AI summit: built to show what’s possible when a company goes AI-first across every part of the business, not just engineering.',
        'visual': {'src': 'assets/story-graphics/frontier.svg', 'fallbackSrc': 'assets/story-graphics/frontier.svg', 'alt': 'Three fanned cards opening together, standing in for many releases unveiled at once.', 'type': 'spot'},
    },
    'lending': {'glossary': C2C_GLOSS},
    'miles': {
        'body': 'Miles is Cars24’s own app for its field agents — the people who visit dealers and customers in person (internally called FOS, short for Fleet on Street). The latest update lets them log visits with new dealers and loan customers on the spot: visits up 13% in two weeks, with 200+ previously untracked dealer visits now captured.',
        'detail': 'Miles replaced an expensive third-party tool the field team used to rely on, cutting the monthly cost by around 98% while building something tailored to how these agents actually work — planning routes, checking in and out of visits, and keeping customer details on hand without a laptop. It’s the backbone that makes a lot of the ground-level work in this newsletter possible.',
    },
    'leads': {'glossary': ['AIRO – Cars24’s calling AI agent', C2C_GLOSS]},
    'approvals': {'glossary': C2C_GLOSS},
    'ownership': {'glossary': OWNERSHIP_GLOSS},
    'codex': {'body': 'Ishaan, one of our design builders, trialled Codex — an AI coding tool — alongside Figma and produced a usable homepage draft, an estimated 20–30% effort saving. Production validation is still pending; next up is testing it across 23 SEO pages. Want to try the same workflow? Reach out to Ishaan.'},
    'hackathon': {'glossary': WECARE_GLOSS},
    'diwali': {'body': 'Desi Fits Friday, a Diwali photo booth, festive snacks, games near the merch store, and a surprise gift countdown — the office went all out for Diwali this year. Gifts reached most desks on 5 November, though not every hub or office got there on time, and some ground staff got nothing right away; leadership said so directly rather than smoothing it over.'},
    'survey': {'link': 'https://cars24.darwinbox.in/user/login', 'linkLabel': 'Take the survey', 'glossary': WECARE_GLOSS},
    'milo': {'body': 'Milo is a confidential AI wellbeing companion, now live on Slack; it is not a replacement for therapy.', 'link': 'https://www.talktomilo.co/cars24', 'linkLabel': 'Talk to Milo'},
    'inflection': {'glossary': OWNERSHIP_GLOSS},
}
# storyCount is left at its original value (not pre-decremented): the embedded v9.js cover-caption
# formula already subtracts V9_HIDDEN.size at render time, same as the live site. Decrementing it
# here too would double-count and show "21 stories" instead of the correct 23.
for ch in data['chapters']:
    ch['stories'] = [sid for sid in ch['stories'] if sid not in V9_HIDDEN]
data['stories'] = [s for s in data['stories'] if s['id'] not in V9_HIDDEN]
for story in data['stories']:
    story.update(V9_OVERRIDES.get(story['id'], {}))
    # V9 never renders Slack provenance (credit/sourceCredit/note/sourceLinks/originalBody) — strip
    # it from the embedded data too, so a self-contained export doesn't leak it via "view source".
    for field in ('credit', 'sourceCredit', 'note', 'sourceLinks', 'originalBody'):
        story.pop(field, None)
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
    # imageFiles feeds the "extra illustrations" dialog in the Story notes & sources panel,
    # which V9 never renders — skip embedding it (saves several MB of otherwise-unused images).
js = js.replace('const asset=src=>esc(src);', 'const asset=src=>esc(V9_ASSETS[V9_ALIASES[src]||src]||src);')
js = js.replace("`url('../../assets/flatland/${paper}.svg')`", "`url('${V9_PAPERS[paper]}')`")
js = re.sub(r'assets/[a-zA-Z0-9_./-]+', lambda m: data_uri((dist / m[0]).with_suffix('.webp') if (dist / m[0]).with_suffix('.webp').is_file() else dist / m[0]) if (dist / m[0]).is_file() else m[0], js)
js = 'const V9_PAPERS=' + json.dumps(papers) + ';\nconst V9_ASSETS=' + json.dumps(assets) + ';\nconst V9_ALIASES=' + json.dumps(aliases) + ';\n' + js
html = (v9 / 'index.html').read_text().replace('<base href="../../">', '')
html = re.sub(r'<link rel="(?:preload|stylesheet)"[^>]+>', '', html)
html = re.sub(r'<script[^>]+></script>', '', html)
html = html.replace('href="versions/v9/#', 'href="#')
# Drop the PNG webp-fallback on the cover image — every modern browser (and HTML Hub's viewer)
# supports webp, so embedding both formats would just double this one image for no benefit.
html = re.sub(r' data-fallback="assets/[a-zA-Z0-9_./-]+\.png"', '', html)
html = re.sub(r'(?<=["\'])assets/[a-zA-Z0-9_./-]+', lambda m: data_uri(dist / m[0]), html)
script = 'window.PITSTOP=' + json.dumps(data, ensure_ascii=False) + ';\n' + js  # sources.js (Slack-sourced provenance) is never read by v9.js and is deliberately not embedded
script = script.replace('</script', '<\\/script')
html = html.replace('</head>', '<style>' + css + '</style></head>').replace('</body>', '<script>' + script + '</script></body>')
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html)
print(f'Exported {out.name}: {out.stat().st_size:,} bytes')
