"""Reproducible, original ink-and-paper spot illustrations for V8.

These are editorial metaphors, not product screenshots or quantitative charts.
The palette and outline language come from the retained Flatland source.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist/assets/story-graphics'
OUT.mkdir(parents=True, exist_ok=True)
cream, blue, green, pink, lemon = '#FFF7E8', '#80C5FF', '#C6E496', '#F9D1F4', '#FAFFAD'

def path(d, fill='none', **attrs):
    return f'<path d="{d}" fill="{fill}" '+ ' '.join(f'{k}="{v}"' for k,v in attrs.items()) + '/>'

def rect(x,y,w,h,fill=cream,rx=2):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"/>'

def circle(x,y,r,fill=cream):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'

def car(x,y,scale=1,fill=blue):
    return f'<g transform="translate({x} {y}) scale({scale})">'+path('M0 25 13 22 25 4 67 4 83 22 96 27 96 47 0 47Z',fill)+path('M25 22 34 10 62 10 74 22Z',cream)+circle(22,47,9,'#000')+circle(76,47,9,'#000')+path('M45 12V22')+'</g>'

def doc(x,y,scale=1,fill=cream):
    return f'<g transform="translate({x} {y}) scale({scale})">'+path('M0 0H65L85 20V115H0Z',fill)+path('M65 0V20H85 M15 38H62 M15 53H70 M15 68H53 M15 88H38')+'</g>'

def arrow(d):
    return path(d,**{'marker-end':'url(#arrow)'})

def check(x,y,r=16,fill=green):
    return circle(x,y,r,fill)+path(f'M{x-r*.45} {y}l{r*.3} {r*.3} {r*.65} {-r*.65}')

ART = {
 'growth': ('A rising road carries a car upwards, an editorial metaphor for growth.',
    path('M150 167C220 170 230 112 307 112S365 70 445 45',blue,**{'stroke-width':28})+path('M150 167C220 170 230 112 307 112S365 70 445 45',**{'stroke':'#FFF7E8','stroke-width':2,'stroke-dasharray':'9 11'})+car(248,57,.9,green)+path('M412 27 461 36 445 84',lemon)),
 'ecosystem': ('A car, a protective shield, and finance papers connected as one ecosystem.',
    path('M225 102H386 M300 65V145',**{'stroke-dasharray':'5 7'})+circle(185,102,48,blue)+car(149,81,.75,cream)+circle(408,102,48,green)+path('M408 70 434 80V105Q432 126 408 137Q384 126 382 105V80Z',cream)+check(408,100,13)+doc(271,15,.6,pink)+doc(271,132,.55,lemon)),
 'startup': ('A seedling grows from an open notebook beside a pencil.',
    path('M165 130Q220 112 294 139Q361 112 424 130V179Q355 162 294 185Q221 162 165 179Z',cream)+path('M294 139V185 M181 144Q226 134 274 149 M316 150Q357 135 404 144')+path('M294 136V55 M294 103Q241 103 237 63Q283 54 294 103Z',green)+path('M294 81Q337 80 348 38Q305 29 294 81Z',blue)+path('M441 77 453 82 422 160 409 165 408 151Z',pink)+path('M408 151 422 160')),
 'lending': ('A stack of coins beside a car and a completed loan document.',
    doc(178,25,1,cream)+check(242,119,21)+car(281,96,1.25,blue)+rect(382,154,57,12,lemon,6)+rect(382,140,57,12,lemon,6)+rect(382,126,57,12,lemon,6)+path('M388 134H432 M388 148H432')),
 'finance': ('A process map under review with a magnifying glass and pencil.',
    rect(142,33,300,132,cream)+rect(164,55,56,34,blue)+rect(269,55,56,34,green)+rect(374,55,46,34,pink)+arrow('M225 72H257')+arrow('M332 72H363')+path('M397 97V126H192V98',**{'stroke-dasharray':'5 6'})+circle(307,126,37,lemon)+path('M333 153 367 185',**{'stroke-width':13})+path('M292 125H321 M306 111V139')),
 'close': ('A ruled ledger with a magnifying glass focusing on a reconciled entry.',
    rect(172,25,233,148,cream)+path('M211 25V173 M172 63H405 M172 99H405 M172 135H405 M281 63V173 M344 63V173')+path('M225 81H263 M294 81H327 M356 81H390')+circle(328,120,44,blue)+check(328,120,24,cream)+path('M359 152 392 182',**{'stroke-width':13})),
 'dealer': ('A phone and an offer document, with a pencil for customising terms.',
    rect(192,16,92,166,cream,12)+rect(200,37,76,119,blue,2)+path('M222 26H253')+circle(238,169,3,'#000')+doc(312,41,1,pink)+path('M342 85 351 94 419 26 410 17Z',lemon)+path('M342 85 337 99 351 94Z',cream)+check(367,148,21)),
 'miles': ('A dotted field-visit route links three location pins to a car.',
    path('M145 151C120 67 268 185 284 100S440 50 458 134',**{'stroke-dasharray':'6 8','stroke-width':3})+''.join(path(f'M{x} {y+36}Q{x-35} {y-1} {x-20} {y-20}Q{x} {y-44} {x+20} {y-20}Q{x+35} {y-1} {x} {y+36}Z',c)+circle(x,y-8,7,cream) for x,y,c in [(155,98,pink),(296,60,lemon),(447,101,green)])+car(253,133,.7,cream)),
 'leads': ('A priority queue of three customer conversations with one brought forward.',
    rect(155,54,98,103,cream)+rect(244,40,98,117,pink)+rect(333,25,105,132,lemon)+circle(386,68,16,cream)+path('M357 122V114Q386 88 416 114V122',green)+path('M177 80H228 M177 99H217 M266 71H315 M266 91H303')+arrow('M159 179H438')+path('M348 16 355 3 M429 10 439 1')),
 'approvals': ('An approval journey moves from waiting to in progress to a check mark.',
    path('M201 100H396',**{'stroke-width':3})+circle(185,100,37,cream)+circle(299,100,37,lemon)+circle(414,100,37,green)+path('M185 77V100L198 109 M280 100A19 19 0 0 1 314 86 M316 83V95H304')+path('M397 100 409 113 432 87')+path('M174 161H196 M287 161H310 M403 161H426')),
 'saarathi': ('A car at the yard next to adjustable offer controls on a clipboard.',
    car(142,80,1.4,cream)+rect(326,24,110,153,cream)+rect(354,14,54,18,pink)+path('M343 67H420 M343 106H420 M343 145H420')+circle(367,67,9,blue)+circle(398,106,9,green)+circle(375,145,9,lemon)+path('M147 174H295')),
 'ownership': ('Connected backend servers lead to a separate phone awaiting final checks.',
    rect(151,42,92,34,cream)+rect(151,82,92,34,cream)+rect(151,122,92,34,cream)+circle(226,59,4,green)+circle(226,99,4,green)+circle(226,139,4,green)+path('M166 59H207 M166 99H207 M166 139H207')+arrow('M254 100H338')+rect(361,19,83,164,cream,9)+rect(369,41,67,111,blue)+path('M389 29H414')+circle(402,167,3,'#000')+path('M388 95 399 106 417 84',**{'stroke-dasharray':'4 4'})),
 'security': ('A software package receives a stitched security patch.',
    path('M183 56 287 23 386 60V145L281 181 183 143Z',cream)+path('M183 56 281 96 386 60 M281 96V181 M237 39 335 79V115L310 124V88Z',blue)+rect(307,110,87,61,lemon,6)+path('M321 124 378 157 M378 124 321 157 M316 117H385V164H316Z',**{'stroke-dasharray':'3 5'})+check(397,51,23,green)),
 'survey': ('Three different speech bubbles meet an open feedback notebook.',
    path('M152 31H246V83H209L185 103V83H152Z',blue)+path('M280 17H371V68H332L312 86V68H280Z',green)+path('M388 62H462V111H439L417 130V111H388Z',lemon)+path('M170 52H226 M300 39H353 M405 84H447')+path('M215 129Q255 113 300 136Q345 113 393 129V179Q348 163 300 185Q257 163 215 179Z',cream)+path('M300 136V185')),
 'thermostat': ('A thermostat between a winter scarf and a small desk fan.',
    rect(238,36,119,119,cream,13)+circle(298,95,41,blue)+path('M298 64V95L318 104')+path('M279 120Q298 130 317 120')+path('M166 54Q185 29 202 54V125H183V69Q176 58 167 74L156 132 137 127Z',pink)+path('M155 132 151 151 M162 133 158 151 M185 125V144 M194 125V144')+circle(425,84,36,green)+circle(425,84,6,cream)+path('M425 78Q397 47 411 61Q430 57 428 78 M431 86Q466 70 451 89Q449 105 431 90 M420 89Q413 122 407 103Q401 89 420 86')+path('M425 122V162 M402 165H448')),
 'controls': ('Routine checks flow through a system while one exception is separated.',
    path('M148 96H438',**{'stroke-dasharray':'5 6'})+doc(149,60,.65,cream)+rect(260,48,85,94,blue)+check(302,94,23,cream)+arrow('M349 96H402')+check(438,96,26,green)+path('M301 47V21H394',**{'stroke-dasharray':'4 6'})+path('M420 4 442 38H399Z',pink)+path('M420 14V23 M420 29V30')),
 'inflection': ('Different interlocking pieces assemble into a shared bridge.',
    path('M153 160V97H219V126H266V79H330V126H377V97H443V160',blue)+path('M153 160H443')+path('M225 30H271V18Q290 0 307 18V30H353V76H337Q315 96 337 114H353V144H307V129Q288 109 271 129V144H225V99H241Q262 80 241 65H225Z',green)+path('M166 94 177 78 M426 92 416 76')+path('M278 170V188 M297 170V188')),
 'safeguards': ('A growing branch is supported by a protective shield.',
    path('M292 168V55 M292 113Q247 108 233 70Q276 63 292 113Z',green)+path('M292 90Q335 84 349 45Q306 39 292 90Z',blue)+path('M292 57Q269 36 281 14Q310 24 292 57Z',lemon)+path('M292 98 355 119V148Q346 178 292 194Q239 178 229 148V119Z',cream)+check(292,146,25,green)+path('M205 177H167 M379 177H417')),
}

for name,(alt,body) in ART.items():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 0 400 205" role="img" aria-labelledby="title"><title id="title">{alt}</title><defs><pattern id="dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".65" fill="#000" opacity=".18"/></pattern><marker id="arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 6 3 0 6" fill="none" stroke="#000" stroke-width="1.2"/></marker></defs><ellipse cx="300" cy="177" rx="160" ry="15" fill="url(#dots)"/><g stroke="#000" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">{body}</g></svg>'''
    (OUT / f'{name}.svg').write_text(svg)

(OUT / 'manifest.json').write_text(json.dumps({k:{'src':f'assets/story-graphics/{k}.svg','alt':v[0],'type':'spot'} for k,v in ART.items()},indent=2)+'\n')
print(f'Created {len(ART)} original story graphics.')
