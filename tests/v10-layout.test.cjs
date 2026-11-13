/* Browser regression audit. Install Playwright separately or set PLAYWRIGHT_MODULE. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url = process.env.PITSTOP_URL || 'http://localhost:8010/versions/v10/';
const widths = [...new Set([160, 200, 240, 256, ...Array.from({ length: 146 }, (_, i) => 280 + i * 16), 599, 600, 601, 767, 768, 769, 899, 900, 901, 1023, 1024, 1025, 3840])].sort((a, b) => a - b);
async function geometry(page) {
  return page.evaluate(() => {
    const visible = [...document.querySelectorAll('body *')].filter(e => e.getClientRects().length && !['SCRIPT', 'STYLE'].includes(e.tagName));
    const failures = visible.filter(e => {
      const r = e.getBoundingClientRect();
      return r.right > innerWidth + 1 || r.left < -1 || e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 2;
    }).map(e => ({ tag: e.tagName, class: e.getAttribute('class'), width: e.clientWidth, content: e.scrollWidth }));
    const overlaps = [...document.querySelectorAll('.pair, .release-list, .front-grid, .front-stat, .masthead')].flatMap(grid => {
      const items = [...grid.children].map(e => e.getBoundingClientRect());
      return items.flatMap((a, i) => items.slice(i + 1).filter(b => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1).map(() => grid.className));
    });
    return { width: innerWidth, documentWidth: document.documentElement.scrollWidth, failures, overlaps };
  });
}
(async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('[data-story]').count(), 25);
    const samples = [];
    // Open notes exercise long source URLs and supplied text, not just the cover.
    await page.locator('details').evaluateAll(nodes => nodes.forEach(node => { node.open = true; }));
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      samples.push(await geometry(page));
    }
    await page.locator('details').evaluateAll(nodes => nodes.forEach(node => { node.open = false; }));
    const type = await page.locator('.story h3').evaluateAll(nodes => [...new Set(nodes.map(e => getComputedStyle(e).fontSize))]);
    assert.deepEqual(type, ['28px'], 'Every story must use the same headline size');
    await page.locator('details').evaluateAll(nodes => nodes.forEach(node => { node.open = true; }));
    for (const width of [320, 393, 540, 768, 1100, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const header = await page.locator('.masthead').boundingBox();
      assert(header.height <= 96, `Compact header at ${width}px: ${header.height}`);
      if (width < 1024) {
        const rail = await page.locator('.front-rail > a').evaluateAll(nodes => nodes.map(e => ({left:e.getBoundingClientRect().left,width:e.getBoundingClientRect().width})));
        assert(rail.every(r => Math.abs(r.left-rail[0].left)<1&&Math.abs(r.width-rail[0].width)<1), 'Headlines must stack in one full-width column');
      }
    }
    const spacing = await page.locator('.story-copy').evaluateAll(nodes => [...new Set(nodes.map(e => getComputedStyle(e).rowGap))]);
    assert.deepEqual(spacing, ['16px'], 'Consistent label, headline and body spacing');
    const zoom = [];
    for (const size of ['200%', '300%']) {
      await page.setViewportSize({ width: 640, height: 1000 });
      await page.evaluate(size => { document.documentElement.style.fontSize = size; }, size);
      zoom.push({ textSize: size, ...await geometry(page) });
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
    await page.setViewportSize({ width: 240, height: 900 });
    const deepLink = new URL(url);
    deepLink.searchParams.set('layout-audit', 'deep-link');
    deepLink.hash = 'builders';
    await page.goto(deepLink.href);
    await page.waitForFunction(() => {
      const nav = document.querySelector('.chapter-nav').getBoundingClientRect();
      const chapter = document.getElementById('builders').getBoundingClientRect();
      return chapter.top >= nav.bottom - 1 && chapter.top < nav.bottom + 80;
    });
    await page.setViewportSize({ width: 844, height: 390 });
    assert.equal(await page.locator('.chapter-nav').evaluate(e => getComputedStyle(e).position), 'relative', 'Short landscapes must retain reading space');
    const failed = [...samples, ...zoom].filter(r => r.failures.length || r.overlaps.length || r.documentWidth > r.width);
    const report = { samples: samples.length, minWidth: widths[0], maxWidth: widths.at(-1), failures: failed, zoom, headlineSizes: type, errors };
    fs.writeFileSync(path.join(__dirname, '../docs/v10-layout-audit.json'), JSON.stringify(report, null, 2) + '\n');
    assert.equal(failed.length, 0, JSON.stringify(failed.slice(0, 3)));
    assert.deepEqual(errors, []);
    console.log(`V10 layout passed: ${samples.length} widths (${widths[0]}–${widths.at(-1)}px), expanded sources, 200%/300% text, consistent headlines, wrapped-nav deep link, and short landscape.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
