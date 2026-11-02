#!/usr/bin/env python3
"""Merge data/verify_nosite_*.csv (deep presence checks) into data/businesses_v2.csv and data/verified_presence.csv.
Adds columns presence_type / presence_notes; sets domain for businesses found to have their own site or a platform subdomain."""
import csv, glob, re
from urllib.parse import urlparse

CHAIN = re.compile(r"randstad|promovacances|autotransac|agences\.fiducial|volkswagen\.fr|guildedesorfevres", re.I)
ver = {}
for f in sorted(glob.glob("data/verify_nosite_*.csv")):
    for r in csv.DictReader(open(f, encoding="utf-8")):
        ver[r["name"].strip()] = r
rows = list(csv.DictReader(open("data/businesses_v2.csv", encoding="utf-8")))
keys = list(rows[0].keys())
for k in ("presence_type", "presence_notes"):
    if k not in keys: keys.append(k)
new_domains = []
for b in rows:
    v = ver.get(b["name"].strip())
    b.setdefault("presence_type", ""); b.setdefault("presence_notes", "")
    if not v: continue
    b["presence_type"] = v["site_type"]
    b["presence_notes"] = ("; ".join(x for x in (v["other_presence"], v["discoverability_notes"]) if x))[:400]
    url = v["found_site"].strip()
    if v["site_type"] in ("own-domain", "platform-subdomain") and url and not CHAIN.search(url) and not b["domain"]:
        h = urlparse(url if "//" in url else "//" + url).netloc.lower().replace("www.", "")
        if h:
            b["domain"] = h; b["site_source"] = "verified-search"; new_domains.append((b["name"], h))
with open("data/businesses_v2.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, keys); w.writeheader(); w.writerows(rows)
with open("data/verified_presence.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, ["name", "found_site", "site_type", "other_presence", "discoverability_notes", "evidence"])
    w.writeheader(); w.writerows(ver.values())
print(len(ver), "verified;", len(new_domains), "new domains:")
for n, h in new_domains: print(" ", n, "->", h)
