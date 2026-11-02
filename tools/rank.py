#!/usr/bin/env python3
"""Rank verified businesses -> data/ranked.csv and RANKING.md.

Inputs: data/businesses_v2.csv (Places-verified), data/audit.csv (site audits), data/site_contacts.csv (public emails).
money (0-5): ability to pay (sector + size). need (0-10): how much they need a site.
tier A = money>=3 and need>=4 ; B = money>=1 and need>=4, or money>=3 and need 2-3 ; C = rest.
Lodging with no own site is treated as Booking-dependent (low need). Lodging with a poor site stays a lead.
"""
import csv, os, re

HIGH = ["accountant", "lawyer", "notary", "real estate", "dentist", "medical group", "hotel", "camping",
        "architect", "surveyor", "engineering", "insurance", "broker", "car dealership", "construction",
        "mason", "roofer", "pool", "electrician", "plumber", "garage", "body shop", "veterinar", "funeral",
        "joinery", "carpent", "earthworks", "landscap", "motoculture", "gîte", "chambres", "spa", "audioproth",
        "optician", "clinic", "outdoor", "consult", "it_web", "training", "driving"]
LOW = ["hair", "barber", "tattoo", "florist", "photograph", "bakery", "yoga", "gym", "dietitian", "pet",
       "jewel", "bookshop", "clothes", "gifts", "beauty", "ganterie", "charcut", "butcher", "wine", "painter"]
LODGING = ["hotel", "gîte", "chambres", "camping", "spa/hotel", "auberge"]
RISK = re.compile(r"negative equity|acquired|struck off|call.?centre|lead.?gen|unrelated personal|not a real local", re.I)


def money(r):
    s = r["sector"].lower()
    m = 3 if any(k in s for k in HIGH) else 1 if any(k in s for k in LOW) else 2
    sz = r["size_hint"].lower()
    if sz.startswith(("large", "medium")): m += 1
    elif sz.startswith("solo"): m -= 1
    if any(k in s for k in ("accountant", "lawyer", "notary", "dentist", "real estate", "hotel")): m += 1
    return max(0, min(5, m))


def main():
    biz = list(csv.DictReader(open("data/businesses_v2.csv", encoding="utf-8")))
    aud = {a["domain"]: a for a in csv.DictReader(open("data/audit.csv", encoding="utf-8"))}
    con = {c["domain"]: c for c in csv.DictReader(open("data/site_contacts.csv", encoding="utf-8"))} \
        if os.path.exists("data/site_contacts.csv") else {}
    out = []
    for r in biz:
        d, src, s = r["domain"], r["site_source"], r["sector"].lower()
        lodging = any(k in s for k in LODGING)
        flags = []
        a = aud.get(d)
        if not d:
            if src.startswith("platform-only"):
                need, status = 5, "no own site (" + src.split(":", 1)[1] + " only)"
            elif src == "none-on-google":
                need, status = 6, "no site (confirmed: none on Google)"
            else:
                need, status = 4, "no site (unverified: no Google match)"
            if lodging:
                need = 2; flags.append("lodging w/o site: likely Booking-dependent by choice")
        elif a is None:
            need, status = 3, "site not audited"
        elif a["bucket"] == "A-dead-site":
            need, status = 3, "site blocks research server (US IP); live but not auditable here"
        else:
            need, status = min(10, int(a["score"])), a["bucket"]
            if a["issues"]: flags.append(a["issues"])
        m = money(r)
        if r["franchise"].strip().lower() in ("yes", "true", "y"):
            m = min(m, 1); flags.append("franchise/chain")
        if RISK.search(r["notes"] + " " + r["evidence"]):
            m = min(m, 1); flags.append("risk flag in notes")
        big = (r["size_hint"].lower().startswith("large") or
               re.search(r"group|groupe|association|mutual|public|network|réseau|concession|corporate|chain|clinic", r["notes"] + " " + r["evidence"] + " " + s, re.I))
        if big:
            m = min(m, 1); flags.append("large structure: owner/decision maker harder to reach")
        if r["g_status"] == "CLOSED_TEMPORARILY":
            m = min(m, 1); flags.append("temporarily closed")
        tier = "A" if m >= 3 and need >= 4 else "B" if (m >= 1 and need >= 4) or (m >= 3 and need >= 2) else "C"
        c = con.get(d, {})
        out.append(dict(tier=tier, priority=m * 2 + need, name=r["name"], sector=r["sector"], address=r["address"],
                        phone=r["phone"], email=c.get("emails", ""), domain=d, money=m, need=need, status=status,
                        rating=r["g_rating"], reviews=r["g_reviews"], issues="; ".join(flags), maps=r["g_maps"],
                        notes=re.sub(r"(?:\+33|0)\s?[1-9](?:[\s.\-]?\d{2}){4}|[\w.+-]+@[\w-]+\.[\w.]+", "[contact removed]", r["notes"])[:200]))
    out.sort(key=lambda x: (x["tier"], -x["priority"]))
    PRIV = ("phone", "email", "maps")
    wp = csv.DictWriter(open("data/contacts_private.csv", "w", newline="", encoding="utf-8"), ["name", "domain", *PRIV], extrasaction="ignore")
    wp.writeheader(); wp.writerows(out)  # gitignored
    pub = [{k: v for k, v in x.items() if k not in PRIV} for x in out]
    w = csv.DictWriter(open("data/ranked.csv", "w", newline="", encoding="utf-8"), list(pub[0]))
    w.writeheader(); w.writerows(pub)
    with open("RANKING.md", "w", encoding="utf-8") as f:
        f.write("# Millau outreach ranking (Google Places verified)\n\nGenerated by tools/rank.py. Contact details are kept in the gitignored data/contacts_private.csv.\n")
        for t in "ABC":
            rows = [x for x in out if x["tier"] == t]
            f.write(f"\n## Tier {t} ({len(rows)})\n\n| # | Business | Sector | Site | Status | Issues |\n|---|---|---|---|---|---|\n")
            for i, x in enumerate(rows, 1):
                f.write(f"| {i} | {x['name']} | {x['sector']} | {x['domain'] or '-'} | {x['status']} | {x['issues'][:80]} |\n")
    print({t: sum(1 for x in out if x["tier"] == t) for t in "ABC"})


if __name__ == "__main__":
    main()
