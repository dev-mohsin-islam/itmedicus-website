"""
Generates the hero background: a light "health + technology" texture.

Deterministic (fixed seed) so the artwork can be regenerated identically:

    python tools/hero-bg.py

Output: src/assets/img/hero-bg.jpg (2000x1100) — deliberately pale, with the
left third left almost blank so the headline keeps AA contrast.
"""
from pathlib import Path
import math
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(r"D:\itmedicus-solutions-website")
OUT = ROOT / "src" / "assets" / "img" / "hero-bg.jpg"

W, H = 2000, 1100
SEED = 20261111

INK = (20, 35, 30)
SAGE = (46, 107, 85)
PINE = (27, 78, 64)
CLAY = (196, 112, 58)


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def base_gradient() -> Image.Image:
    """Warm bone at the top, a whisper of sage at the bottom."""
    top, bottom = (253, 251, 247), (236, 243, 238)
    img = Image.new("RGB", (W, H))
    px = img.load()
    for y in range(H):
        colour = lerp(top, bottom, (y / H) ** 0.85)
        for x in range(0, W, 1):
            px[x, y] = colour
    # a soft off-centre glow, upper right
    glow = Image.new("L", (W, H), 0)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W * 0.42, -H * 0.45, W * 1.25, H * 0.95], fill=90)
    glow = glow.filter(ImageFilter.GaussianBlur(180))
    tint = Image.new("RGB", (W, H), (223, 234, 226))
    img = Image.composite(tint, img, glow.point(lambda v: int(v * 0.55)))
    return img


def decoration() -> Image.Image:
    """Network of nodes, molecular rings, ECG trace and dot grid."""
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    rng = random.Random(SEED)

    # --- fine dot grid across the whole field
    for y in range(0, H, 26):
        for x in range(0, W, 26):
            d.point((x, y), fill=SAGE + (16,))

    # --- nodes clustered to the right, where the product mockups sit
    nodes = []
    attempts = 0
    while len(nodes) < 30 and attempts < 6000:
        attempts += 1
        x = rng.uniform(W * 0.30, W * 1.02)
        y = rng.uniform(-H * 0.05, H * 1.02)
        if all((x - nx) ** 2 + (y - ny) ** 2 > 130 ** 2 for nx, ny in nodes):
            nodes.append((x, y))

    # connect each node to its two nearest neighbours
    for i, (x, y) in enumerate(nodes):
        near = sorted(
            ((nx, ny) for j, (nx, ny) in enumerate(nodes) if j != i),
            key=lambda n: (n[0] - x) ** 2 + (n[1] - y) ** 2,
        )[:2]
        for nx, ny in near:
            if (nx - x) ** 2 + (ny - y) ** 2 < 420 ** 2:
                d.line([(x, y), (nx, ny)], fill=SAGE + (26,), width=2)

    # node heads
    for x, y in nodes:
        r = rng.uniform(2.5, 6.0)
        d.ellipse([x - r, y - r, x + r, y + r], fill=PINE + (70,))
        d.ellipse([x - r * 3, y - r * 3, x + r * 3, y + r * 3], outline=SAGE + (18,), width=2)

    # --- molecular rings, a few, larger
    for cx, cy, r in [(W * 0.60, H * 0.24, 74), (W * 0.86, H * 0.66, 96), (W * 0.44, H * 0.86, 58)]:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=SAGE + (22,), width=3)
        for k in range(6):
            a = k * math.pi / 3 + 0.35
            x, y = cx + math.cos(a) * r, cy + math.sin(a) * r
            d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=CLAY + (46,))

    # --- ECG trace across the lower third
    ys = H * 0.78
    pts = []
    x = W * 0.06
    while x < W * 0.98:
        pts.append((x, ys))
        pts.append((x + 60, ys))
        pts.append((x + 74, ys - 8))
        pts.append((x + 88, ys))
        pts.append((x + 100, ys - 54))
        pts.append((x + 112, ys + 66))
        pts.append((x + 126, ys))
        x += 320
    d.line(pts, fill=PINE + (24,), width=3, joint="curve")

    # soften
    layer = layer.filter(ImageFilter.GaussianBlur(0.7))
    return layer


def fade_left(layer: Image.Image) -> Image.Image:
    """Fade the artwork out over the left third so the headline stays clean."""
    mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask)
    start, end = int(W * 0.02), int(W * 0.52)
    for x in range(start, end):
        t = (x - start) / (end - start)
        md.line([(x, 0), (x, H)], fill=int(255 * (t ** 1.4)))
    md.rectangle([end, 0, W, H], fill=255)

    # fade the bottom edge a touch too
    bottom = Image.new("L", (W, H), 0)
    bd = ImageDraw.Draw(bottom)
    bd.rectangle([0, 0, W, H * 0.86], fill=255)
    for y in range(int(H * 0.86), H):
        bd.line([(0, y), (W, y)], fill=int(255 * (1 - (y - H * 0.86) / (H * 0.14))))

    combined = Image.composite(mask, Image.new("L", (W, H), 0), bottom)
    alpha = layer.getchannel("A")
    layer.putalpha(Image.composite(alpha, Image.new("L", (W, H), 0), combined))
    return layer


def main() -> None:
    art = base_gradient().convert("RGBA")
    art.alpha_composite(fade_left(decoration()))
    out = art.convert("RGB")
    out.save(OUT, "JPEG", quality=86, optimize=True, progressive=True)
    kb = OUT.stat().st_size // 1024
    print(f"  {OUT.name}  {W}x{H}  {kb} KB")


if __name__ == "__main__":
    main()
