// Phone + desktop screenshots of a page, for the outreach email.
// Usage: node scripts/shoot.mjs <url> <name> [outDir=shots]
// Writes <name>-phone.png (first screen), <name>-phone-full.png, <name>-desktop.png (first screen).
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';

const [url, name, outDir = 'shots'] = process.argv.slice(2);
if (!url || !name) {
  console.error('Usage: node scripts/shoot.mjs <url> <name> [outDir]');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

// Full-page shots must not show empty frames where lazy photos never got scrolled into view.
async function loadAllImages(page) {
  // Scrolling is what triggers lazy <picture> sources; switching `loading` alone does not.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
}

const browser = await chromium.launch();
try {
  // iPhone 13: 390x844 at 3x; the old fixed-width sites render as a shrunken desktop page, as a real phone shows them.
  const phone = await browser.newContext({ ...devices['iPhone 13'], locale: 'fr-FR' });
  const p = await phone.newPage();
  await p.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
  await p.screenshot({ path: `${outDir}/${name}-phone.png` });
  await loadAllImages(p);
  await p.screenshot({ path: `${outDir}/${name}-phone-full.png`, fullPage: true });

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR' });
  const d = await desktop.newPage();
  await d.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
  await d.screenshot({ path: `${outDir}/${name}-desktop.png` });
  console.log(`saved ${outDir}/${name}-{phone,phone-full,desktop}.png`);
} finally {
  await browser.close();
}
