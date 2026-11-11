"""
Normalises the supplied app icons into one consistent set.

The source files arrive at different sizes (96-512 px), some with transparent
corners and one flattened onto white. Each is composited onto a square canvas
with a uniform optical size so the directory grid reads evenly, and exported at
320 px (comfortably above the largest on-screen use).

    python tools/app-icons.py
"""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(r"D:\itmedicus-solutions-website")
SRC = ROOT / "src" / "assets" / "source" / "products"
OUT = ROOT / "src" / "assets" / "img" / "products"

CANVAS = 320
FILL = 0.88  # content occupies 88% of the canvas on its longest edge

# slug -> source file (the order the client supplied them in)
ICONS = {
    "patient-aid": "patient-aid.png",
    "dims": "dims.png",
    "dims-vet": "dims-vet.png",
    "pdm": "pdm.png",
    "pharma-plus": "pharma-plus.png",
    "skinvd": "skinvd.png",
    "med-dictionary": "med-dictionary.png",
}


def content_box(img: Image.Image):
    """Bounding box of the visible artwork, ignoring transparent margins."""
    a = np.asarray(img.convert("RGBA"))
    if a[:, :, 3].min() < 250:
        mask = a[:, :, 3] > 8
    else:  # flattened onto white — treat near-white as margin
        rgb = a[:, :, :3].astype(np.int16)
        mask = (rgb < 246).any(axis=2)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return (0, 0, img.size[0], img.size[1])
    return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)


def normalise(path: Path) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    box = content_box(img)
    art = img.crop(box)

    longest = max(art.size)
    target = int(CANVAS * FILL)
    scale = target / longest
    new_size = (max(1, round(art.size[0] * scale)), max(1, round(art.size[1] * scale)))
    art = art.resize(new_size, Image.LANCZOS)

    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    canvas.alpha_composite(art, ((CANVAS - new_size[0]) // 2, (CANVAS - new_size[1]) // 2))
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, name in ICONS.items():
        src = SRC / name
        if not src.exists():
            print(f"  MISSING {name}")
            continue
        icon = normalise(src)
        out = OUT / f"{slug}.png"
        icon.save(out, optimize=True)
        print(f"  {slug:<16} {Image.open(src).size[0]}px source -> {out.stat().st_size // 1024 or 1} KB")


if __name__ == "__main__":
    main()
