# B&B rebuild demos

One-page, phone-first demo sites for two Millau-area B&Bs, two designs each, used as before/after images in outreach emails.

| Page | Design | Buttons |
|---|---|---|
| `/les-falaises/a/` | Spa retreat: dark, Marcellus, the night spa as signature | Square ochre slab, label left, phone number right |
| `/les-falaises/b/` | Village charm: light, Young Serif, shutter-blue photo collages | No box: serif words with a thick underline |
| `/cardabelle/a/` | Vineyard farmhouse: Alegreya, table d'hôtes as a farm menu card | Wine-label shape with cut corners |
| `/cardabelle/b/` | Family holiday: Bricolage Grotesque, each fruit-named room in its own colour | Leaf shape: two opposite corners rounded |

House rules for every design (client's, Tufte-minded): no letter-spacing, no all-caps, no gradients, no 1px lines, no pill buttons, no decoration that carries no information (chips repeating text, icons, tilted photos, shadows).

Content and photos are the owners' own, from their current sites (`src/data/*.ts`). Photos and screenshots are gitignored: not ours to publish.

## Run

```bash
npm install
npm test            # SEO helpers (phone format, GPS, structured data)
npm run build
npx wrangler pages dev dist --port 8788   # serves with public/_headers applied
```

Screenshots and the email mockup (old site, A, B; phone row above desktop row):

```bash
node scripts/shoot.mjs http://127.0.0.1:8788/les-falaises/a/ after-les-falaises-a
scripts/mockup.sh les-falaises
```

Photos are re-downloadable with `scripts/fetch-photos.py` from a crawl of the old site.

## What is built in

- SEO: per-page title and description, canonical, Open Graph, schema.org `BedAndBreakfast` JSON-LD (address, phone, geo, rooms, amenities; no self-declared ratings), French `lang`, alt text on every photo.
- Security: Astro-generated hashed Content-Security-Policy (no inline code, no third-party scripts, fonts or embeds; map is a link, not an iframe), plus HSTS, nosniff, frame denial, referrer and permissions policies in `public/_headers`.

## Measured 2026-11-02 (Lighthouse 12, mobile)

Performance / accessibility / best practices / SEO. Old sites measured live; demos on the local build, so their performance figure will move slightly once hosted (the other three do not depend on the network).

| Site | Perf | A11y | Best pr. | SEO | Security headers |
|---|---|---|---|---|---|
| lesfalaises.fr (now) | 92 | 76 | 79 | 91 | 0 / 6, no https redirect |
| Les Falaises A | 100 | 100 | 100 | 100 | 6 / 6 |
| Les Falaises B | 100 | 100 | 100 | 100 | 6 / 6 |
| domaine-lacardabelle.eu (now) | 100 | 53 | 57 | 83 | 1 / 6, no https redirect |
| Cardabelle A | 97 | 100 | 100 | 100 | 6 / 6 |
| Cardabelle B | 100 | 100 | 100 | 100 | 6 / 6 |

The old sites are already fast (tiny pages), so speed is not a selling point; readability, Google understanding and security are.

## Open points for the owners

- Cardabelle: published prices (56 € for two) look old; room bed layouts are inferred from photos.
- Les Falaises: prices and the 0,66 € tourist tax are as published; « entrée indépendante » wording kept as on their site.
