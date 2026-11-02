#!/usr/bin/env python3
"""Audit a list of local-business websites.

Input : CSV with columns name,sector,domain  (domain may be empty => bucket A)
Output: JSON lines + CSV with findings and a rough bucket/score.

Usage: python3 tools/audit.py businesses.csv audit_out.csv
Only does passive, public GETs of the homepage (like a browser would).
"""
import csv, json, re, socket, ssl, sys, time, datetime
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

UA = "Mozilla/5.0 (compatible; site-audit/1.0)"
SEC_HEADERS = ["strict-transport-security", "content-security-policy",
               "x-frame-options", "x-content-type-options", "referrer-policy"]


def cert_info(host):
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((host, 443), timeout=8) as s:
            with ctx.wrap_socket(s, server_hostname=host) as ss:
                c = ss.getpeercert()
        exp = datetime.datetime.strptime(c["notAfter"], "%b %d %H:%M:%S %Y %Z")
        return {"cert_ok": True, "cert_days_left": (exp - datetime.datetime.utcnow()).days}
    except ssl.SSLCertVerificationError as e:
        return {"cert_ok": False, "cert_err": str(e)[:80]}
    except Exception as e:
        return {"cert_ok": None, "cert_err": type(e).__name__}


def audit(domain):
    r = {"domain": domain, "reachable": False, "issues": [], "score": 0}
    host = re.sub(r"^https?://", "", domain).split("/")[0]
    r.update(cert_info(host))
    if r.get("cert_ok") is False:
        r["issues"].append("invalid/expired TLS certificate"); r["score"] += 5
    elif r.get("cert_ok") and r["cert_days_left"] < 15:
        r["issues"].append("TLS cert expires soon"); r["score"] += 1
    resp = None
    bare = re.sub(r"^www\.", "", host)
    for url in (f"https://{host}", f"https://www.{bare}", f"https://{bare}", f"http://{host}", f"http://www.{bare}"):
        try:
            t = time.time()
            resp = requests.get(url, headers={"User-Agent": UA}, timeout=15, allow_redirects=True,
                                verify=False)
            r["load_s"] = round(time.time() - t, 2)
            break
        except Exception as e:
            r["err"] = type(e).__name__
    if resp is None:
        r["issues"].append("site unreachable"); r["score"] += 6
        return r
    r["reachable"] = True
    r["final_url"] = resp.url
    r["status"] = resp.status_code
    if resp.url.startswith("http://"):
        r["issues"].append("no HTTPS (served over http)"); r["score"] += 5
    h = {k.lower(): v for k, v in resp.headers.items()}
    missing = [x for x in SEC_HEADERS if x not in h]
    r["missing_sec_headers"] = missing
    if len(missing) >= 4:
        r["issues"].append(f"missing security headers ({len(missing)}/5)"); r["score"] += 1
    srv = h.get("server", "") + " " + h.get("x-powered-by", "")
    m = re.search(r"PHP/(\d+)\.(\d+)", srv)
    if m and (int(m[1]), int(m[2])) < (8, 1):
        r["issues"].append(f"outdated PHP {m[1]}.{m[2]} exposed"); r["score"] += 3
    html = resp.text or ""
    soup = BeautifulSoup(html, "html.parser")
    if not soup.find("meta", attrs={"name": "viewport"}):
        r["issues"].append("no mobile viewport (not responsive)"); r["score"] += 4
    gen = soup.find("meta", attrs={"name": "generator"})
    r["generator"] = gen.get("content") if gen else ""
    g = r["generator"]
    wp = re.search(r"WordPress ([\d.]+)", g or "")
    if wp and int(wp[1].split(".")[0]) < 6:
        r["issues"].append(f"old WordPress {wp[1]}"); r["score"] += 3
    if re.search(r"Joomla! 1|Joomla! 2|Joomla! 3", g or ""):
        r["issues"].append(f"old {g}"); r["score"] += 3
    for s in soup.find_all("script", src=True):
        jq = re.search(r"jquery[-.]?(\d+)\.(\d+)", s["src"], re.I)
        if jq and int(jq[1]) < 3:
            r["issues"].append(f"old jQuery {jq[1]}.{jq[2]}"); r["score"] += 2; break
    if soup.find(["marquee", "blink", "font", "center", "frameset"]) or soup.find("embed") or ".swf" in html:
        r["issues"].append("legacy HTML (font/center/flash)"); r["score"] += 3
    if len(soup.find_all("table")) > 4 and not soup.find("main"):
        r["issues"].append("table-based layout?"); r["score"] += 2
    yrs = [int(y) for y in re.findall(r"(?:©|&copy;|copyright)[^0-9]{0,20}((?:19|20)\d\d)", html, re.I)]
    if yrs:
        r["copyright_year"] = max(yrs)
        if max(yrs) <= 2021:
            r["issues"].append(f"stale copyright {max(yrs)}"); r["score"] += 2
    if not soup.find("meta", attrs={"name": "description"}):
        r["issues"].append("no meta description (SEO)"); r["score"] += 1
    if len(html) < 4000 and len(soup.get_text(strip=True)) < 300:
        r["issues"].append("very thin / placeholder page"); r["score"] += 3
    if resp.status_code >= 400:
        r["issues"].append(f"HTTP {resp.status_code}"); r["score"] += 4
    if r.get("load_s", 0) > 4:
        r["issues"].append(f"slow ({r['load_s']}s)"); r["score"] += 1
    return r


def bucket(row):
    if not row.get("domain"):
        return "A-no-site"
    if not row.get("reachable"):
        return "A-dead-site"
    tech = any(k in " ".join(row["issues"]) for k in ("TLS", "HTTPS", "PHP", "WordPress", "Joomla", "jQuery", "HTTP 4", "HTTP 5"))
    design = any(k in " ".join(row["issues"]) for k in ("viewport", "legacy", "table", "copyright", "thin"))
    if tech and row["score"] >= 5: return "B-tech/security"
    if design: return "C-design"
    return "OK-low-priority"


def main(inp, out):
    requests.packages.urllib3.disable_warnings()
    rows = list(csv.DictReader(open(inp, encoding="utf-8")))
    res = []
    for i, b in enumerate(rows):
        d = (b.get("domain") or "").strip()
        a = audit(d) if d else {"domain": "", "issues": ["no website found"], "score": 10, "reachable": False}
        a.update(name=b["name"], sector=b.get("sector", ""))
        a["bucket"] = bucket(a)
        res.append(a)
        print(f"[{i+1}/{len(rows)}] {b['name']}: {a['bucket']} score={a['score']} {a['issues']}", flush=True)
    keys = ["name", "sector", "domain", "bucket", "score", "issues", "generator", "copyright_year", "load_s"]
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, keys, extrasaction="ignore"); w.writeheader()
        for a in res:
            a2 = dict(a); a2["issues"] = "; ".join(a["issues"]); w.writerow(a2)
    json.dump(res, open(out.replace(".csv", ".json"), "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
