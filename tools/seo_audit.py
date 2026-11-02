#!/usr/bin/env python3
"""SEO quick-win audit for sites that are otherwise decent (audit bucket OK-low-priority).
Passive: homepage + /robots.txt + /sitemap.xml only. Output: data/seo.csv and SEO.md."""
import csv, json, re, requests
from bs4 import BeautifulSoup

UA = {"User-Agent": "Mozilla/5.0 (compatible; site-audit/1.0)"}


def fetch(host, path=""):
    bare = re.sub(r"^www\.", "", host)
    for base in (f"https://www.{bare}", f"https://{bare}"):
        try:
            r = requests.get(base + path, headers=UA, timeout=12)
            if r.status_code == 200:
                return r
        except Exception:
            pass
    return None


def audit(host):
    fixes, score = [], 0
    r = fetch(host)
    if r is None:
        return None
    s = BeautifulSoup(r.text, "html.parser")
    t = (s.title.string or "").strip() if s.title and s.title.string else ""
    if not t: fixes.append("add a page title"); score += 3
    elif len(t) < 20 or len(t) > 65: fixes.append(f"rewrite title ({len(t)} chars; aim 30-60 with service + Millau)"); score += 1
    elif "millau" not in t.lower(): fixes.append("add the town (Millau) to the title"); score += 1
    d = s.find("meta", attrs={"name": "description"})
    dc = (d.get("content") or "").strip() if d else ""
    if not dc: fixes.append("add a meta description"); score += 2
    elif len(dc) < 70 or len(dc) > 170: fixes.append("rewrite meta description (70-160 chars)"); score += 1
    h1 = s.find_all("h1")
    if not h1: fixes.append("add one H1 heading with the main service"); score += 2
    elif len(h1) > 1: fixes.append("single H1 per page"); score += 1
    html = r.text
    if not re.search(r"LocalBusiness|schema\.org", html, re.I): fixes.append("add LocalBusiness structured data (address, hours, phone)"); score += 3
    if not s.find("link", attrs={"rel": "canonical"}): fixes.append("add canonical link"); score += 1
    if not s.find("meta", attrs={"property": "og:title"}): fixes.append("add social share (Open Graph) tags"); score += 1
    imgs = s.find_all("img")
    noalt = [i for i in imgs if not (i.get("alt") or "").strip()]
    if imgs and len(noalt) / len(imgs) > 0.5: fixes.append(f"add alt text to images ({len(noalt)}/{len(imgs)} missing)"); score += 2
    if not (s.html or {}).get("lang") if s.html else True: fixes.append("set html lang=fr"); score += 1
    rb = fetch(host, "/robots.txt")
    sm = fetch(host, "/sitemap.xml")
    if sm is None and not (rb and "sitemap" in rb.text.lower()): fixes.append("publish a sitemap.xml"); score += 2
    if not re.search(r"(?:0|\+33\s?)[1-9](?:[\s.\-]?\d{2}){4}", s.get_text(" ")): fixes.append("show phone number as text on homepage"); score += 1
    if not (s.find("a", href=re.compile(r"google\.[a-z.]+/maps|goo\.gl/maps|maps\.app", re.I)) or s.find("iframe", src=re.compile("maps"))):
        fixes.append("embed Google Maps / link to Google Business profile"); score += 1
    return dict(seo_score=score, fixes="; ".join(fixes), title=t[:70])


def main():
    requests.packages.urllib3.disable_warnings()
    rk = {r["domain"]: r for r in csv.DictReader(open("data/ranked.csv", encoding="utf-8"))}
    aud = {a["domain"]: a for a in csv.DictReader(open("data/audit.csv", encoding="utf-8"))}
    rows = []
    for d, a in aud.items():
        if a["bucket"] != "OK-low-priority" or d not in rk: continue
        b = rk[d]
        res = audit(d)
        if not res: continue
        rows.append(dict(name=b["name"], sector=b["sector"], domain=d, tier=b["tier"],
                         reviews=b["reviews"], **res))
        print(len(rows), b["name"], res["seo_score"], flush=True)
    rows.sort(key=lambda x: -x["seo_score"])
    w = csv.DictWriter(open("data/seo.csv", "w", newline="", encoding="utf-8"), list(rows[0]))
    w.writeheader(); w.writerows(rows)
    with open("SEO.md", "w", encoding="utf-8") as f:
        f.write("# SEO quick-win leads (sites that are decent but under-optimised)\n\nPassive checks of public homepage, robots.txt, sitemap.xml.\n\n"
                "| Score | Business | Sector | Site | Suggested fixes |\n|---|---|---|---|---|\n")
        for x in rows:
            if x["seo_score"] >= 5:
                f.write(f"| {x['seo_score']} | {x['name']} | {x['sector']} | {x['domain']} | {x['fixes']} |\n")
    print(len(rows), "audited;", sum(1 for x in rows if x["seo_score"] >= 5), "with score >= 5")


if __name__ == "__main__":
    main()
