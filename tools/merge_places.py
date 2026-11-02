#!/usr/bin/env python3
"""Merge Google Places verification into data/businesses.csv -> data/businesses_v2.csv (drops permanently closed)."""
import csv, re
from urllib.parse import urlparse

PLAT = re.compile(r"facebook|instagram|booking\.com|planity|fresha|doctolib|tripadvisor|google\.|linktr|treatwell|airbnb|"
                  r"gites-de-france|tourisme|pagesjaunes|business\.site|mappy|youtube|linkedin|leboncoin|kiute|resalib|maiia|"
                  r"doqi|booksy|calendly|reservio|fleuristes-et-fleurs|pleinciel|autotransac|guildedesorfevres|"
                  r"agences\.fiducial|randstad|promovacances|fabre-mobilite", re.I)


def host(u):
    return urlparse(u if "//" in u else "//" + u).netloc.lower().replace("www.", "") if u else ""


biz = list(csv.DictReader(open("data/businesses.csv", encoding="utf-8")))
pl = {r["name"]: r for r in csv.DictReader(open("data/places.csv", encoding="utf-8"))}
out, dropped = [], []
for b in biz:
    g = pl.get(b["name"], {})
    st = g.get("g_status", "")
    if st == "CLOSED_PERMANENTLY":
        dropped.append(b["name"])
        continue
    gh = host(g.get("g_website", ""))
    b["old_domain"] = b["domain"]
    if gh and not PLAT.search(gh):
        b["domain"] = gh
        b["site_source"] = "google" if not b["old_domain"] else ("match" if b["old_domain"] == gh else "google(differs)")
    elif gh:
        keep = b["domain"] and not PLAT.search(b["domain"])
        b["domain"] = b["domain"] if keep else ""
        b["site_source"] = "ours" if keep else "platform-only:" + gh
    else:
        b["site_source"] = "none-on-google" if g.get("g_name") else "no-google-match"
    b["g_phone"] = g.get("g_phone", "")
    b["g_status"] = st
    b["g_rating"] = g.get("g_rating", "")
    b["g_reviews"] = g.get("g_reviews", "")
    b["g_maps"] = g.get("g_maps", "")
    b["phone"] = g.get("g_phone") or b["phone"]
    out.append(b)
w = csv.DictWriter(open("data/businesses_v2.csv", "w", newline="", encoding="utf-8"), list(out[0]))
w.writeheader()
w.writerows(out)
print(len(out), "kept;", len(dropped), "closed dropped:", dropped)
print(sum(1 for b in out if b["domain"]), "with own domain")
