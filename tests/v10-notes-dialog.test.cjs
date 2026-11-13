const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url = process.env.PITSTOP_URL || 'http://localhost:8010/versions/v10/';
(async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.notes-trigger').count(), 25);
    assert.equal(await page.locator('details').count(), 0, 'Source notes no longer use accordions');
    const ids = await page.locator('[data-story]').evaluateAll(nodes => nodes.map(n => n.id));
    const layout = () => page.locator('[data-story]').evaluateAll(nodes => nodes.map(n => {
      const r = n.getBoundingClientRect();
      return { id: n.id, x: r.x, y: r.y + scrollY, width: r.width, height: r.height };
    }));
    let checked = 0;
    for (const width of [320, 393, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [index, id] of ids.entries()) {
        const trigger = page.locator(`#${id} .notes-trigger`);
        await trigger.scrollIntoViewIfNeeded();
        const before = await layout();
        const scroll = await page.evaluate(() => scrollY);
        await trigger.click();
        const dialog = page.getByRole('dialog');
        assert.equal(await dialog.count(), 1);
        assert.equal(await dialog.locator('.notes-story-title').textContent(), await page.locator(`#title-${id}`).textContent());
        assert.equal(await dialog.evaluate(e => e.contains(document.activeElement)), true, 'Focus enters dialog');
        assert.equal(await page.locator('html').evaluate(e => getComputedStyle(e).overflow), 'hidden', 'Background scrolling is locked');
        assert.deepEqual(await layout(), before, `Opening ${id} must not reflow stories at ${width}px`);
        const rect = await dialog.boundingBox();
        assert(rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= width + 1 && rect.y + rect.height <= 901, 'Dialog fits viewport');
        await page.keyboard.press('Shift+Tab');
        assert.equal(await dialog.evaluate(e => e.contains(document.activeElement)), true, 'Keyboard focus stays in popup');
        if (index % 3 === 0) await dialog.getByRole('button', { name: 'Close story notes' }).click();
        else if (index % 3 === 1) await page.keyboard.press('Escape');
        else await page.mouse.click(2, 2);
        assert.equal(await page.locator('dialog[open]').count(), 0);
        assert.equal(await trigger.evaluate(e => document.activeElement === e), true, 'Focus returns to the source button');
        assert.equal(await page.evaluate(() => scrollY), scroll, 'Closing preserves reading position');
        checked++;
      }
      const callout = page.locator('#hackathon .inline-stat');
      assert(!(await callout.innerText()).includes('\n'), '48 hours of building stays on one line');
    }
    // Long notes scroll inside the popup while the close control remains visible.
    await page.setViewportSize({ width: 393, height: 600 });
    await page.locator('#startup .notes-trigger').click();
    const modal = page.getByRole('dialog');
    await modal.locator('.notes-body').evaluate(e => { e.scrollTop = e.scrollHeight; });
    assert((await modal.locator('.notes-body').evaluate(e => e.scrollTop)) > 0);
    assert.equal(await modal.getByRole('button', { name: 'Close story notes' }).isVisible(), true);
    await page.keyboard.press('Escape');
    assert.deepEqual(errors, []);
    console.log(`V10 popup passed: ${checked} story/viewport combinations, no article reflow, cross/Escape/backdrop dismissal, focus containment/return, scroll lock, internal scrolling, and inline 48-hour callout.`);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
