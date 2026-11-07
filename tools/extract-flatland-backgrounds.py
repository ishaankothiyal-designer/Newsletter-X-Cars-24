"""Extract original background drawing operators; never redraw or invent textures.
Run with PyMuPDF and Pillow. Page numbers refer to physical PDF pages.
"""
from pathlib import Path
import re, json, hashlib
import pymupdf as fitz
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'pitstop/dist/assets/flatland'
OUT.mkdir(parents=True, exist_ok=True)
SOURCE = ROOT / 'FLATLAND_2_SEPTEMBER.pdf'
SPECS = [
    ('ice-grid', 'Ice blue grid', 2, 2),
    ('green-grid', 'Builder green grid', 4, 434),
    ('cream-grid', 'Warm cream grid', 10, 433),
    ('yellow-grid', 'Lemon yellow grid', 12, 433),
    ('magenta-grid', 'Magenta grid', 14, 433),
    ('pink-grid', 'Soft pink grid', 22, 433),
    ('mint-grid', 'Mint grid', 28, 433),
    ('blue-grid', 'Sky blue grid', 32, 433),
]

def blocks(stream):
    """Top-level graphics-state blocks before PDF text objects."""
    depth = 0
    for match in re.finditer(rb'(?m)^(q|Q)\s*$', stream):
        if match[1] == b'q':
            if depth == 0: start = match.start()
            depth += 1
        else:
            depth -= 1
            if depth == 0: yield stream[start:match.end()]
    assert depth == 0

manifest = {'source': SOURCE.name, 'sha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
            'method': 'Original PDF background graphics-state blocks retained verbatim; all foreground blocks and page text excluded. SVG and PNG rendered with PyMuPDF.',
            'backgrounds': []}
for slug, name, page_no, block_count in SPECS:
    doc = fitz.open(SOURCE)
    page = doc[page_no - 1]
    xref = page.get_xobjects()[0][0]
    selected = list(blocks(doc.xref_stream(xref)))[:block_count]
    # Keep the form's original colour space, resource tree, alpha, and geometry.
    doc.update_stream(xref, b'\n'.join(selected))
    # Only invoke the background Form; remove the page's live text objects.
    doc.update_stream(page.get_contents()[0], b'/C1 CS\n/C1 cs\nq\n/X1 Do\nQ\n')
    for content in page.get_contents()[1:]: doc.update_stream(content, b'')
    page = doc.reload_page(page)
    assert not page.get_text().strip()
    (OUT / f'{slug}.svg').write_text(page.get_svg_image(), encoding='utf-8')
    page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False).save(OUT / f'{slug}.png')
    # Confirm unchanged background pixels in a clear strip of the original page.
    original = fitz.open(SOURCE)
    clip = fitz.Rect(5, 20, 25, 760)
    a = original[page_no-1].get_pixmap(clip=clip, alpha=False).samples
    b = page.get_pixmap(clip=clip, alpha=False).samples
    max_difference = max(abs(x-y) for x,y in zip(a,b))
    assert max_difference == 0, (slug, max_difference)
    manifest['backgrounds'].append({'id': slug, 'name': name, 'page': page_no,
        'graphics_blocks': block_count, 'size': [595,842], 'clear_strip_max_pixel_difference': max_difference,
        'svg': f'{slug}.svg', 'png': f'{slug}.png'})

(OUT/'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
sheet = Image.new('RGB', (1600, 1090), '#f6f3ec')
draw = ImageDraw.Draw(sheet)
font_path = ROOT/'pitstop/dist/fonts/Geist.ttf'
font = ImageFont.truetype(str(font_path), 23)
small = ImageFont.truetype(str(font_path), 17)
draw.text((35,22), 'FLATLAND / Original background layers', fill='#142033', font=font)
draw.text((35,60), 'Extracted from the PDF. Original colours, grid geometry, and page proportions.',fill='#53606a',font=small)
for i, bg in enumerate(manifest['backgrounds']):
    x, y = 35+(i%4)*395, 108+(i//4)*485
    im=Image.open(OUT/bg['png']);im.thumbnail((285,405))
    sheet.paste(im, (x,y))
    draw.text((x,y+413),bg['name'],fill='#142033',font=font)
    draw.text((x,y+447),f"PDF page {bg['page']:02} / exact vector extraction",fill='#53606a',font=small)
sheet.save(ROOT/'output/flatland-backgrounds.png')
print(json.dumps(manifest, indent=2))
