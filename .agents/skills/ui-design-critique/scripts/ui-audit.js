#!/usr/bin/env node
/**
 * ui-audit.js — Automated UI Design, Accessibility & AI-Slop Diagnostic Tool
 * Inspired by Nutlope/hallmark (sloplint --render) and pbakaus/impeccable (audit/critique).
 *
 * Usage:
 *   node .agents/skills/ui-design-critique/scripts/ui-audit.js [url] [outputDir]
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TARGET_URL = process.argv[2] || 'http://localhost:3000';
const OUT_DIR = process.argv[3] || '';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = {
    url: TARGET_URL,
    timestamp: new Date().toISOString(),
    desktop: null,
    mobile: null,
    errors: []
  };

  async function runViewportAudit(name, width, height, screenshotName) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 2
    });

    const pageErrors = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') pageErrors.push(msg.text());
    });

    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Trigger a real move interaction on the board if present to verify interactive states
    const e2 = await page.$('.square[data-square="e2"]');
    const e4 = await page.$('.square[data-square="e4"]');
    const d5 = await page.$('.square[data-square="d5"]');
    if (e2 && e4 && name === 'desktop') {
      await page.click('.square[data-square="d2"]');
      await page.click('.square[data-square="d4"]');
      await page.waitForTimeout(100);
      await page.click('.square[data-square="c7"]');
      await page.click('.square[data-square="c5"]');
      await page.waitForTimeout(100);
      await page.click('.square[data-square="d4"]');
      await page.click('.square[data-square="d5"]');
      await page.waitForTimeout(100);
      await page.click('.square[data-square="e7"]');
      await page.click('.square[data-square="e6"]');
      await page.waitForTimeout(100);
      await page.click('.square[data-square="d5"]');
      await page.waitForTimeout(200);
    } else if (e2 && name === 'mobile') {
      await page.click('.square[data-square="e2"]');
      await page.waitForTimeout(200);
    }

    if (OUT_DIR && screenshotName) {
      fs.mkdirSync(OUT_DIR, { recursive: true });
      await page.screenshot({ path: path.join(OUT_DIR, screenshotName) });
    }

    const metrics = await page.evaluate(() => {
      const vw = window.innerWidth;
      const sw = document.documentElement.scrollWidth;
      const horizontalOverflowPx = Math.max(0, sw - vw);

      // 1. Emoji / Unicode Slop Check
      const bodyText = document.body.innerText || '';
      const emojis = bodyText.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) || [];

      // 2. Raster Image Quality Check (detect broken or low-res upscaled crops)
      const imgs = Array.from(document.querySelectorAll('img')).filter((i) => i.offsetParent !== null);
      const brokenImgs = imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src);
      const blurryUpscaledImgs = imgs
        .filter((i) => i.complete && i.naturalWidth > 0 && i.clientWidth > 0 && i.naturalWidth < i.clientWidth * 1.15)
        .map((i) => ({ src: i.src, naturalW: i.naturalWidth, renderedW: i.clientWidth }));

      // 3. AI-Slop Purple/Neon Gradient & Excessive Blur Check
      const allEls = Array.from(document.querySelectorAll('*')).filter((el) => el.offsetParent !== null);
      let purpleNeonCount = 0;
      let heavyBlurCount = 0;
      const radiiSet = new Set();

      for (const el of allEls) {
        const cs = window.getComputedStyle(el);
        const bg = cs.backgroundImage || '';
        const bs = cs.boxShadow || '';
        const bd = cs.borderColor || '';
        if (
          bg.includes('168, 85, 247') ||
          bg.includes('236, 72, 153') ||
          bg.includes('217, 70, 239') ||
          bs.includes('168, 85, 247') ||
          bs.includes('217, 70, 239') ||
          bd.includes('168, 85, 247')
        ) {
          purpleNeonCount++;
        }
        const bf = cs.backdropFilter || cs.webkitBackdropFilter || '';
        if (bf.includes('blur(20px)') || bf.includes('blur(24px)')) {
          heavyBlurCount++;
        }
        if (cs.borderRadius && cs.borderRadius !== '0px' && cs.borderRadius !== '50%' && !cs.borderRadius.includes('999')) {
          radiiSet.add(cs.borderRadius);
        }
      }

      // 4. Arena Width Alignment Check
      const getRectW = (sel) => {
        const el = document.querySelector(sel);
        return el ? Math.round(el.getBoundingClientRect().width) : null;
      };
      const alignment = {
        topBarW: getRectW('#player-bar-top'),
        boardFrameW: getRectW('#board-outer-frame'),
        bottomBarW: getRectW('#player-bar-bottom'),
        bottomDockW: getRectW('.rc-bottom-dock')
      };

      // 5. Accessibility, Scrollbar & Icon Check
      const colorSchemeDark = window.getComputedStyle(document.documentElement).colorScheme === 'dark';
      const playPane = document.getElementById('tab-pane-play');
      const playPaneVerticalOverflowPx = playPane ? Math.max(0, playPane.scrollHeight - playPane.clientHeight) : 0;
      const svgIcons = document.querySelectorAll('svg.rc-icon').length;
      const inlineSvgRaster = document.querySelectorAll('svg image').length;
      const unlabeledButtons = Array.from(document.querySelectorAll('button'))
        .filter((b) => b.offsetParent !== null)
        .filter((b) => {
          const text = (b.innerText || '').trim();
          const aria = b.getAttribute('aria-label') || '';
          const tip = b.getAttribute('data-tooltip') || '';
          const title = b.getAttribute('title') || '';
          return !text && !aria && !tip && !title;
        }).length;

      return {
        viewport: { width: vw, height: window.innerHeight },
        horizontalOverflowPx,
        colorSchemeDark,
        playPaneVerticalOverflowPx,
        emojiCount: emojis.length,
        emojis: emojis.slice(0, 10),
        visibleRasterImgs: imgs.length,
        brokenImgs,
        blurryUpscaledImgs,
        purpleNeonSlopCount: purpleNeonCount,
        heavyBlurCount,
        distinctBorderRadiiCount: radiiSet.size,
        distinctBorderRadii: Array.from(radiiSet),
        alignment,
        svgIcons,
        inlineSvgRaster,
        unlabeledButtons
      };
    });

    if (OUT_DIR && screenshotName && name === 'desktop') {
      const customTab = await page.$('.dock-tab[data-tab="customize"]');
      if (customTab) {
        await customTab.click();
        await page.waitForTimeout(150);
        const woodBtn = await page.$('[data-board-id="classic_wood"]');
        if (woodBtn) await woodBtn.click();
        const impBtn = await page.$('[data-piece-set="imperial"]');
        if (impBtn) await impBtn.click();
        await page.waitForTimeout(200);
        await page.screenshot({ path: path.join(OUT_DIR, 'pc_custom_cyberpunk.png') });
        const playTab = await page.$('.dock-tab[data-tab="play"]');
        if (playTab) await playTab.click();
      }
    }

    await page.close();
    return { ...metrics, pageErrors };
  }

  report.desktop = await runViewportAudit('desktop', 1440, 900, 'pc_online_match.png');
  report.mobile = await runViewportAudit('mobile', 390, 844, 'mobile_online_match.png');

  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})();
