"""Download a B&B's own photos (largest available version) into src/assets/<slug>/.

Usage: python3 -I scripts/fetch-photos.py <crawl pages.json> <slug>
The crawl JSON comes from the site crawl (list of {url, imgs: [[src, alt], ...]}).
"""
import json
import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import unquote, urlparse

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36"
# Site chrome, not content: menu buttons, flags, banners, partner logos.
SKIP = re.compile(r"(icon|icone|titre|bande|drap|logo|banner|banniere|ban-|label|gite image|image_0\d\d\.gif|DIAPORAMA|lien_clip|panneau|plan\.jpg)", re.I)


def best_url(src: str) -> str:
    # Les Falaises serves thumbnails as NNN_2_name.jpg and the zoom version as NNN_3_name.jpg.
    return re.sub(r"(/PicturesGallery/\d+)_2_", r"\1_3_", src)


def slugify(name: str) -> str:
    stem = re.sub(r"[^a-z0-9]+", "-", unquote(name).lower()).strip("-")
    return stem or "photo"


def main() -> None:
    pages = json.loads(Path(sys.argv[1]).read_text())
    out = Path("src/assets") / sys.argv[2]
    out.mkdir(parents=True, exist_ok=True)
    seen: set[str] = set()
    for page in pages:
        for src, _alt in page.get("imgs", []):
            host = urlparse(src).netloc
            if host not in urlparse(page["url"]).netloc and not host.endswith(urlparse(page["url"]).netloc.removeprefix("www.")):
                continue
            path = urlparse(src).path
            if SKIP.search(unquote(path)) or not re.search(r"\.(jpe?g)$", path, re.I):
                continue
            # English pages duplicate the French photos under /pagesanglaise/.
            key = unquote(path.rsplit("/", 1)[-1]).lower()
            if key in seen:
                continue
            seen.add(key)
            url = best_url(src).replace(" ", "%20")
            dest = out / (slugify(key.rsplit(".", 1)[0]) + ".jpg")
            try:
                req = urllib.request.Request(url, headers={"User-Agent": UA})
                with urllib.request.urlopen(req, timeout=30) as r:
                    dest.write_bytes(r.read())
            except Exception as e:  # keep going; report what failed
                print(f"FAIL {url}: {e}")
    print(f"{len(list(out.iterdir()))} photos in {out}")


if __name__ == "__main__":
    main()
