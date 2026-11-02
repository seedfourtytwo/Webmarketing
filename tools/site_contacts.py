#!/usr/bin/env python3
"""Extract public contact details (mailto:, tel:, visible emails) from business sites.
Passive: homepage + a few standard public pages (/contact, /mentions-legales). Output: data/site_contacts.csv"""
import csv, re, sys, requests
from bs4 import BeautifulSoup
UA = {"User-Agent": "Mozilla/5.0 (compatible; site-audit/1.0)"}
PAGES = ["", "/contact", "/mentions-legales"]
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
BAD = re.compile(r"\.(png|jpg|jpeg|gif|webp|svg)$|sentry|wixpress|example\.|domain\.|votre|your", re.I)

def get(host, path):
    bare = re.sub(r"^www\.", "", host)
    for base in (f"https://www.{bare}", f"https://{bare}"):
        try:
            r = requests.get(base + path, headers=UA, timeout=8)
            if r.status_code == 200 and "text/html" in r.headers.get("content-type", ""):
                return r.text
        except Exception:
            pass
    return None

def main():
    requests.packages.urllib3.disable_warnings()
    rows = [r for r in csv.DictReader(open("data/businesses_v2.csv", encoding="utf-8")) if r["domain"]]
    from concurrent.futures import ThreadPoolExecutor
    def work(r):
        emails, tels = set(), set()
        for p in PAGES:
            h = get(r["domain"], p)
            if not h: continue
            s = BeautifulSoup(h, "html.parser")
            for a in s.find_all("a", href=True):
                if a["href"].lower().startswith("mailto:"):
                    emails.add(a["href"][7:].split("?")[0].strip().lower())
                if a["href"].lower().startswith("tel:"):
                    tels.add(re.sub(r"[^\d+]", "", a["href"][4:]))
            emails |= {e.lower() for e in EMAIL.findall(s.get_text(" "))}
        emails = {e for e in emails if not BAD.search(e) and "%" not in e}
        print(r["name"], sorted(emails), flush=True)
        return dict(name=r["name"], domain=r["domain"], emails="; ".join(sorted(emails)), phones="; ".join(sorted(tels)))
    with ThreadPoolExecutor(12) as ex:
        out = list(ex.map(work, rows))
    w = csv.DictWriter(open("data/site_contacts.csv", "w", newline="", encoding="utf-8"), ["name", "domain", "emails", "phones"])
    w.writeheader(); w.writerows(out)

if __name__ == "__main__":
    main()
