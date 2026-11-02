#!/usr/bin/env python3
"""Build SECURITY.md from data/audit.csv: sites with passively observable security issues.
Passive only: one normal homepage GET per site. No probing, no login pages, no exploitation."""
import csv, re
SEC = [("HIGH", r"no HTTPS|invalid/expired TLS"), ("HIGH", r"old WordPress|old Joomla|outdated PHP [0-7]\.[0-3]|PHP 5|old jQuery"),
       ("MED", r"outdated PHP"), ("LOW", r"missing security headers")]
rows = list(csv.DictReader(open("data/audit.csv", encoding="utf-8")))
rk = {"HIGH": 0, "MED": 1, "LOW": 2}
out = []
for r in rows:
    if not r["reachable"] if "reachable" in r else False: continue
    sev = None
    for s, pat in SEC:
        if re.search(pat, r["issues"], re.I):
            sev = s if sev is None or rk[s] < rk[sev] else sev
    if sev: out.append((rk[sev], -int(r["score"]), sev, r))
out.sort(key=lambda x: x[:2])
with open("SECURITY.md", "w", encoding="utf-8") as f:
    f.write("# Security-oriented leads (sites that exist)\n\nPassive, homepage-only observations. Confirm before outreach; "
            "never test beyond what a normal visitor's browser sees.\n\n| Sev | Business | Sector | Site | Observed |\n|---|---|---|---|---|\n")
    for _, _, sev, r in out:
        f.write(f"| {sev} | {r['name']} | {r['sector']} | {r['domain']} | {r['issues']} |\n")
print(len(out), "sites;", {s: sum(1 for o in out if o[2] == s) for s in ("HIGH", "MED", "LOW")})
