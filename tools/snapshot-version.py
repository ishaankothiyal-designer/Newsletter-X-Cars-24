#!/usr/bin/env python3
"""Freeze a committed reader, then register it in the version picker."""
import argparse
import io
import json
from pathlib import Path
import re
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
MANIFEST = DIST / 'versions.json'
MARKER = '<script src="{prefix}version-picker.js" defer></script>'


def attach_picker(path, prefix):
    html = path.read_text()
    if 'version-picker.js' not in html:
        path.write_text(html.replace('</head>', MARKER.format(prefix=prefix) + '</head>'))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('id', help='Stable URL slug, e.g. v5')
    parser.add_argument('commit', help='Committed source to preserve')
    parser.add_argument('--name', required=True)
    parser.add_argument('--description', required=True)
    parser.add_argument('--date', required=True, help='YYYY-MM-DD')
    parser.add_argument('--default', action='store_true')
    args = parser.parse_args()
    if not re.fullmatch(r'v[1-9][0-9]*', args.id):
        parser.error('id must be v followed by a positive integer')
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {'default': None, 'versions': []}
    target = DIST / 'versions' / args.id
    if target.exists() or any(v['id'] == args.id for v in manifest['versions']):
        parser.error('Version already exists. Choose a new id to preserve saved versions.')
    sha = subprocess.check_output(['git', 'rev-parse', '--verify', args.commit + '^{commit}'], cwd=ROOT, text=True).strip()
    archive = subprocess.check_output(['git', 'archive', sha, 'dist'], cwd=ROOT)
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
        members = [m for m in tar.getmembers() if m.isfile() and not m.name.startswith('dist/versions/') and m.name not in ('dist/versions.json', 'dist/version-picker.js', 'dist/version-picker.css')]
        if not any(m.name == 'dist/index.html' for m in members):
            parser.error('Commit has no dist/index.html')
        for member in members:
            relative = Path(member.name).relative_to('dist')
            if '..' in relative.parts:
                raise ValueError('Unsafe archive path')
            output = target / relative
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(tar.extractfile(member).read())
    # Later snapshots may already include the root picker references.
    html = (target / 'index.html').read_text()
    html = re.sub(r'<script src="(?:\.\./)*version-picker.js" defer></script>', '', html)
    (target / 'index.html').write_text(html)
    attach_picker(target / 'index.html', '../../')
    attach_picker(DIST / 'index.html', '')
    manifest['versions'].append({'id': args.id, 'name': args.name, 'description': args.description, 'date': args.date, 'commit': sha, 'path': f'versions/{args.id}/'})
    if args.default or not manifest['default']:
        manifest['default'] = args.id
    MANIFEST.write_text(json.dumps(manifest, indent=2) + '\n')
    print(f"Saved {args.id}: {args.name} ({sha[:7]})")


if __name__ == '__main__':
    main()
