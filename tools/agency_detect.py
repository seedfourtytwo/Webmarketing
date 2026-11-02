#!/usr/bin/env python3
"""Detect signs a site was built/maintained by a web agency (so direct outreach has little to gain).
Passive homepage GET only. Output: data/agency_signals.csv  (domain, cms, theme, footer_credit, agency_score)."""
import csv, re, sys
import requests
from bs4 import BeautifulSoup

UA = {"User-Agent": "Mozilla/5.0 (compatible; site-audit/1.0)"}
CREDIT = re.compile(r"(r[ée]alis[ée]e?s?|cr[ée]{1,2}[ée]?|conçu|concu|d[ée]velopp[ée]|h[ée]berg[ée]|propuls[ée]|design(?:ed)?|created|built|developed|powered)\s+(?:par|by)\s+([^|•\n©]{2,40})", re.I)
AGENCY = re.compile(r"agence|agency|studio|web ?design|communication|digital|creation|cr[ée]ation|\.fr|\.com", re.I)
BUILDERS = {"wix": r"wixstatic|wix\.com|X-Wix", "squarespace": r"squarespace", "webflow": r"webflow", "shopify": r"cdn\.shopify",
            "wordpress": r"wp-content|wp-includes", "jimdo": r"jimdo", "webador": r"webador", "prestashop": r"prestashop",
            "joomla": r"/media/jui|Joomla", "drupal": r"drupal", "notaires.fr": r"notaires\.fr"}


def fetch(host):
    bare = re.sub(r"^www\.", "", host)
    for u in (f"https://www.{bare}", f"https://{bare}"):
        try:
            r = requests.get(u, headers=UA, timeout=15)
            if r.status_code == 200: return r
        except Exception: pass
    return None


rows = list(csv.DictReader(open("data/design_targets.csv", encoding="utf-8")))
out = []
for t in rows:
    r = fetch(t["domain"])
    rec = dict(tier=t["tier"], name=t["name"], domain=t["domain"], cms="", theme="", footer_credit="", agency_score=0)
    if r is None:
        out.append(rec); print("skip", t["domain"]); continue
    html = r.text; s = BeautifulSoup(html, "html.parser")
    rec["cms"] = ",".join(k for k, p in BUILDERS.items() if re.search(p, html, re.I) or re.search(p, str(r.headers), re.I))
    m = re.search(r"/wp-content/themes/([\w\-]+)/", html)
    rec["theme"] = m.group(1) if m else ""
    foot = s.find("footer") or s
    txt = foot.get_text(" ", strip=True)[-600:]
    c = CREDIT.search(txt) or CREDIT.search(s.get_text(" ", strip=True)[-900:])
    if c: rec["footer_credit"] = (c.group(1) + " par " + c.group(2)).strip()[:60]
    sc = 0
    if rec["footer_credit"]: sc += 3
    if rec["theme"] and rec["theme"] not in ("twentytwenty", "twentytwentyone", "twentytwentytwo", "twentytwentythree", "twentyfifteen", "twentyseventeen"): sc += 1
    if re.search(r"elementor|divi|avada|wpbakery|revslider|slider-revolution", html, re.I): sc += 1
    if re.search(r"aos|wow\.js|animate\.css|parallax|gsap|scrollreveal|swiper|owl\.carousel", html, re.I): sc += 1
    rec["agency_score"] = sc
    out.append(rec); print(t["name"], rec["cms"], rec["theme"], rec["footer_credit"], sc, flush=True)
w = csv.DictWriter(open("data/agency_signals.csv", "w", newline="", encoding="utf-8"), list(out[0]))
w.writeheader(); w.writerows(out)
