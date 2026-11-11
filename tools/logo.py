"""
Builds the site's logo assets from the official ITmedicus wordmark.

The only published company logo is a flat raster on a solid green field
(assets/source/about-itmedicus.png, 780x520). This script:

  1. isolates the wordmark from the green background using colour distance,
  2. keeps the antialiased edges as partial alpha,
  3. re-tints it for light and dark backgrounds,
  4. trims, and writes 2x-ready PNGs plus favicon sizes.

Run with the bundled Python (Pillow + numpy):
    python tools/logo.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "assets" / "source" / "about-itmedicus.png"
OUT = ROOT / "src" / "assets" / "img"

INK = (20, 35, 30)         # site ink — warm near-black green
WHITE = (255, 255, 255)
BRAND_NAVY = (12, 42, 34)  # pine-900, the app-mark ground


def extract_wordmark() -> Image.Image:
    """Returns an RGBA wordmark cropped to its content, tinted INK."""
    im = Image.open(SRC).convert("RGB")
    arr = np.asarray(im).astype(np.float32)

    # The wordmark sits in the upper-left corner. Stop above the illustration,
    # which begins around y=125 in the source.
    crop = arr[0:110, 0:460]
    bg = arr[2, 2]  # solid green field

    dist = np.sqrt(((crop - bg) ** 2).sum(axis=2)) / 255.0
    full_ink = np.percentile(dist, 99.5)
    alpha = np.clip(dist / full_ink, 0.0, 1.0)
    # Pull the faint halo down to zero without eating into the antialiasing.
    alpha = np.clip((alpha - 0.08) / 0.92, 0.0, 1.0)

    mask = Image.fromarray((alpha * 255).astype(np.uint8), mode="L")
    bbox = mask.point(lambda v: 255 if v > 12 else 0).getbbox()
    if not bbox:
        raise SystemExit("Could not find the wordmark in the source image")

    mask = mask.crop(bbox)
    out = Image.new("RGBA", mask.size, INK + (0,))
    out.putalpha(mask)
    print(f"  wordmark extracted: {mask.size[0]}x{mask.size[1]}")
    return out


def it_monogram(wordmark: Image.Image) -> Image.Image:
    """Cuts the 'IT' block out of the wordmark.

    Letter gaps run 6-8px and the word gap is wider, so within the first half
    of the wordmark the widest gap is the one that ends the 'IT' ligature.
    """
    a = np.asarray(wordmark.getchannel("A"))
    cols = (a > 90).sum(axis=0)
    filled = np.where(cols > 0)[0]
    limit = int(filled[-1] * 0.5)

    gaps = []
    run = None
    for x in range(int(filled[0]), limit + 1):
        if cols[x] == 0:
            run = x if run is None else run
        else:
            if run is not None:
                gaps.append((run, x))
            run = None

    if not gaps:
        return wordmark

    start, end = max(gaps, key=lambda g: g[1] - g[0])
    return wordmark.crop((0, 0, end, wordmark.size[1]))


def tint(img: Image.Image, colour) -> Image.Image:
    out = Image.new("RGBA", img.size, colour + (0,))
    out.putalpha(img.getchannel("A"))
    return out


def save(img: Image.Image, name: str) -> None:
    path = OUT / name
    img.save(path, optimize=True)
    print(f"  {name:<34} {img.size[0]}x{img.size[1]}  {path.stat().st_size // 1024 or 1} KB")


def app_mark(wordmark: Image.Image, size: int) -> Image.Image:
    """Square app/favicon mark: the 'IT' monogram in white on brand navy."""
    it = it_monogram(wordmark)

    pad = int(size * 0.24)
    target_h = size - pad * 2
    scale = target_h / it.size[1]
    it = it.resize((max(1, int(it.size[0] * scale)), target_h), Image.LANCZOS)
    it = tint(it, WHITE)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.27), fill=BRAND_NAVY + (255,))
    x = (size - it.size[0]) // 2
    y = (size - it.size[1]) // 2
    canvas.alpha_composite(it, (x, y))
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    wordmark = extract_wordmark()

    save(tint(wordmark, INK), "itmedicus-logo.png")
    save(tint(wordmark, WHITE), "itmedicus-logo-white.png")

    # Trimmed wordmark for the social card, where it needs to sit on navy.
    save(app_mark(wordmark, 512), "app-mark-512.png")
    save(app_mark(wordmark, 180), "apple-touch-icon.png")
    save(app_mark(wordmark, 32), "favicon-32.png")
    save(app_mark(wordmark, 16), "favicon-16.png")


if __name__ == "__main__":
    main()

    # Contact sheet: each variant on the background it is designed for, plus
    # favicon sizes at actual pixel size.
    ink = Image.open(OUT / "itmedicus-logo.png")
    white = Image.open(OUT / "itmedicus-logo-white.png")

    sheet = Image.new("RGB", (800, 420), (255, 255, 255))
    dark = Image.new("RGB", (800, 160), (7, 26, 38))
    sheet.paste(dark, (0, 0))
    sheet.paste(white, (40, 52), white)

    ink_small = ink.resize((240, int(ink.size[1] * 240 / ink.size[0])), Image.LANCZOS)
    sheet.paste(ink_small, (40, 210), ink_small)

    x = 380
    for size in (16, 32, 64, 128):
        icon = Image.open(OUT / f"favicon-{size}.png") if size in (16, 32) else None
        icon = icon or Image.open(OUT / "apple-touch-icon.png").resize((size, size), Image.LANCZOS)
        sheet.paste(icon, (x, 210), icon)
        x += size + 28

    preview_dir = ROOT / "qa"
    preview_dir.mkdir(exist_ok=True)
    sheet.save(preview_dir / "logo-preview.png")
    print("  preview: qa/logo-preview.png")
