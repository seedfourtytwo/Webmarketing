#!/usr/bin/env python3
"""Verify businesses via Google Places API (New). Key from env GOOGLE_PLACES_KEY (never stored in files).
Output: data/places.csv with website, phone, status, rating, review count, address, match name."""
import csv, os, sys, time, requests
K = os.environ["GOOGLE_PLACES_KEY"]
URL = "https://places.googleapis.com/v1/places:searchText"
MASK = ",".join("places." + f for f in ["displayName", "formattedAddress", "websiteUri", "nationalPhoneNumber",
                                         "businessStatus", "rating", "userRatingCount", "googleMapsUri"])
biz = list(csv.DictReader(open("data/businesses.csv", encoding="utf-8")))
import json
DONE = "data/places_partial.jsonl"
out = [json.loads(l) for l in open(DONE)] if os.path.exists(DONE) else []
for i, b in enumerate(biz, 1):
    if i <= len(out): continue
    q = f"{b['name']} {b['address'] or ''} Millau".strip()
    try:
        for attempt in range(8):
            r = requests.post(URL, headers={"X-Goog-Api-Key": K, "X-Goog-FieldMask": MASK, "Content-Type": "application/json"},
                          json={"textQuery": q, "languageCode": "fr", "regionCode": "FR", "maxResultCount": 1,
                                "locationBias": {"circle": {"center": {"latitude": 44.1006, "longitude": 3.0777}, "radius": 12000.0}}},
                          timeout=20)
            if r.status_code == 200: break
            print("retry", r.status_code, flush=True); time.sleep(5 * (attempt + 1))
        if r.status_code != 200:
            print("ERR", r.status_code, r.text[:200]); sys.exit(1)
        p = (r.json().get("places") or [{}])[0]
    except requests.RequestException as e:
        p = {}
    out.append(dict(name=b["name"], g_name=(p.get("displayName") or {}).get("text", ""), g_address=p.get("formattedAddress", ""),
                    g_website=p.get("websiteUri", ""), g_phone=p.get("nationalPhoneNumber", ""), g_status=p.get("businessStatus", ""),
                    g_rating=p.get("rating", ""), g_reviews=p.get("userRatingCount", ""), g_maps=p.get("googleMapsUri", "")))
    open(DONE, "a").write(json.dumps(out[-1], ensure_ascii=False) + "\n")
    print(f"[{i}/{len(biz)}] {b['name']} -> {out[-1]['g_name']} | {out[-1]['g_website']}", flush=True)
    time.sleep(0.1)
w = csv.DictWriter(open("data/places.csv", "w", newline="", encoding="utf-8"), list(out[0]))
w.writeheader(); w.writerows(out)
