// Capture phone + desktop screenshots and measurable design signals for each site in data/design_targets.csv.
// Sequential on purpose (one site at a time). Output: data/shots/<slug>_m.jpg, _d.jpg and data/design_metrics.json
// Usage: NODE_PATH=$(npm root -g) node tools/design_capture.js
const { chromium } = require('playwright');
const fs = require('fs');

const rows = fs.readFileSync('data/design_targets.csv', 'utf8').trim().split('\n').slice(1).map(l => {
  const m = l.match(/("([^"]*)"|[^,]*)(,|$)/g).map(s => s.replace(/,$/, '').replace(/^"|"$/g, ''));
  return { tier: m[0], name: m[1], sector: m[2], domain: m[3] };
});
fs.mkdirSync('data/shots', { recursive: true });
const u = new URL(process.env.HTTPS_PROXY);
const proxy = { server: `${u.protocol}//${u.host}`, username: decodeURIComponent(u.username), password: decodeURIComponent(u.password) };

const measure = () => {
  const vw = window.innerWidth;
  const all = [...document.querySelectorAll('body *')];
  const vis = all.filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; });
  const wide = vis.filter(e => e.getBoundingClientRect().right > vw + 2);
  const texts = vis.filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 3));
  const sizes = texts.map(e => parseFloat(getComputedStyle(e).fontSize)).filter(Boolean).sort((a, b) => a - b);
  const clickable = vis.filter(e => e.matches('a,button,input,select')).map(e => e.getBoundingClientRect());
  const smallTap = clickable.filter(r => r.width < 32 || r.height < 28).length;
  const imgs = [...document.images];
  const nav = document.querySelector('nav, header ul, .menu, #menu, .navbar');
  const navR = nav ? nav.getBoundingClientRect() : null;
  return {
    vw, scrollW: document.documentElement.scrollWidth, overflowX: document.documentElement.scrollWidth > vw + 4,
    wideEls: wide.length, medianFont: sizes.length ? sizes[Math.floor(sizes.length / 2)] : null,
    smallTextPct: sizes.length ? Math.round(100 * sizes.filter(s => s < 12).length / sizes.length) : null,
    tapSmall: smallTap, tapTotal: clickable.length,
    imgs: imgs.length, imgsNoAlt: imgs.filter(i => !(i.alt || '').trim()).length,
    brokenImgs: imgs.filter(i => i.complete && i.naturalWidth === 0).length,
    tables: document.querySelectorAll('table').length, iframes: document.querySelectorAll('iframe').length,
    hasViewportMeta: !!document.querySelector('meta[name=viewport]'),
    navRight: navR ? Math.round(navR.right) : null, navCutOff: navR ? navR.right > vw + 2 : null,
    h1: document.querySelectorAll('h1').length, title: document.title.slice(0, 80),
    bodyBg: getComputedStyle(document.body).backgroundColor, fonts: [...new Set(texts.slice(0, 80).map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '')))].slice(0, 4),
    copyright: (document.body.innerText.match(/(?:©|copyright)[^\d]{0,15}((?:19|20)\d\d)/i) || [])[1] || null,
    textLen: document.body.innerText.length,
  };
};

(async () => {
  const b = await chromium.launch({ proxy });
  const out = [];
  for (const r of rows) {
    const slug = r.domain.replace(/[^a-z0-9]/gi, '_');
    const rec = { ...r, slug };
    for (const [tag, ctxOpts] of [['m', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }], ['d', { viewport: { width: 1366, height: 768 } }]]) {
      const c = await b.newContext(ctxOpts);
      const p = await c.newPage();
      let bytes = 0;
      p.on('response', async res => { try { const l = res.headers()['content-length']; if (l) bytes += +l; } catch (e) {} });
      const t0 = Date.now();
      try {
        const bare = r.domain.replace(/^www\./, '');
        let resp;
        for (const url of [`https://www.${bare}`, `https://${bare}`]) {
          try { resp = await p.goto(url, { timeout: 25000, waitUntil: 'load' }); if (resp) break; } catch (e) { rec[tag + '_err'] = e.message.slice(0, 80); }
        }
        if (resp) {
          await p.waitForTimeout(1500);
          rec[tag + '_status'] = resp.status(); rec[tag + '_finalUrl'] = p.url(); rec[tag + '_loadMs'] = Date.now() - t0; rec[tag + '_kb'] = Math.round(bytes / 1024);
          rec[tag] = await p.evaluate(measure);
          await p.screenshot({ path: `data/shots/${slug}_${tag}.jpg`, type: 'jpeg', quality: 55 });
          if (tag === 'm') await p.screenshot({ path: `data/shots/${slug}_mfull.jpg`, type: 'jpeg', quality: 45, fullPage: true, clip: { x: 0, y: 0, width: 390, height: 2400 } }).catch(() => {});
        }
      } catch (e) { rec[tag + '_err'] = e.message.slice(0, 120); }
      await c.close();
    }
    out.push(rec);
    fs.writeFileSync('data/design_metrics.json', JSON.stringify(out, null, 1));
    console.log(`${out.length}/${rows.length} ${r.name} m:${rec.m ? (rec.m.overflowX ? 'OVERFLOW' : 'ok') : 'fail'} d:${rec.d ? 'ok' : 'fail'}`);
  }
  await b.close();
})();
