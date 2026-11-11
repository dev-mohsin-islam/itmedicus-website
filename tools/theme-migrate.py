"""
One-off theme migration: navy/teal -> pine/bone/clay, Manrope+Inter -> Newsreader+Public Sans.

Renames design tokens, remaps hard-coded brand colours, and updates the font
stacks. Run once; the result is committed source, this script is kept for the
record of what changed.
"""
from pathlib import Path
import re

ROOT = Path(r"D:\itmedicus-solutions-website")
SRC = ROOT / "src"

# ---------------------------------------------------------------- tokens ---
TOKENS = {
    "--navy-950": "--pine-950",
    "--navy-900": "--pine-900",
    "--navy-800": "--pine-800",
    "--navy-700": "--pine-700",
    "--navy-600": "--pine-600",
    "--teal-700": "--sage-700",
    "--teal-600": "--sage-600",
    "--teal-500": "--sage-500",
    "--teal-300": "--sage-300",
    "--aqua-100": "--sage-100",
    "--aqua-50": "--sage-50",
    "--cloud-50": "--bone-50",
    "--cloud-100": "--bone-100",
}
ACCENT = (r"--accent(?!-)", "--clay")
ACCENT_SOFT = (r"--accent-soft", "--clay-soft")

# ------------------------------------------------------------------ hexes --
HEX = {
    "#071a26": "#081c17",
    "#0c2638": "#0c2a22",
    "#12304a": "#123a2f",
    "#1b4162": "#1b4e40",
    "#2a5677": "#2a6653",
    "#0b8181": "#2e6b55",
    "#0e9a9a": "#2e6b55",
    "#17adad": "#3f8a6c",
    "#5ad2c9": "#8cc5a9",
    "#dff4f2": "#dfeae2",
    "#f0faf9": "#f1f6f2",
    "#fafcfd": "#fbf9f4",
    "#f2f6f8": "#f5f1e8",
    "#f2a65a": "#c4703a",
    "#fdf0e2": "#f8e8da",
    # pale UI tints inside the mock screens (were blue-grey, now warm)
    "#dbe6ec": "#dcd9cf",
    "#fbfdfe": "#fbfaf6",
    "#edf3f6": "#eeeae1",
    "#f1faf9": "#eef4ef",
    "#cbeae7": "#cfe3d6",
    "#d3eeee": "#d7e8dc",
    "#93a7b5": "#8b9890",
    "#b8cad6": "#c0b7a4",
    # form + notice states
    "#c0392b": "#b3261e",
    "#fdf7f6": "#f9efed",
    "#f2d5d1": "#edd6d2",
    "#8f2c20": "#8c2018",
    "#fdf5f4": "#f9efed",
    "#b9752a": "#a5561f",
    "#7a5227": "#6b4420",
    "#cddbe4": "#d3c9b6",
    "#dee8ee": "#e3dccd",
}

# --------------------------------------------------------------- rgba -----
RGBA = {
    "rgba(10, 31, 44,": "rgba(20, 35, 30,",
    "rgba(18, 48, 74,": "rgba(18, 58, 47,",
    "rgba(14, 154, 154,": "rgba(46, 107, 85,",
    "rgba(90, 210, 201,": "rgba(140, 197, 169,",
    "rgba(11, 129, 129,": "rgba(46, 107, 85,",
    "rgba(7, 26, 38,": "rgba(8, 28, 23,",
}

TARGETS = [
    *sorted(SRC.joinpath("assets").glob("*.css")),
    SRC / "assets" / "main.js",
    SRC / "layout.mjs",
    SRC / "content.mjs",
    *sorted(SRC.joinpath("pages").glob("*.mjs")),
    SRC / "og" / "og-card.html",
    ROOT / "tools" / "logo.py",
]


def migrate(text: str) -> str:
    for old, new in TOKENS.items():
        text = text.replace(old, new)
    text = re.sub(ACCENT_SOFT[0], ACCENT_SOFT[1], text)
    text = re.sub(ACCENT[0], ACCENT[1], text)

    for old, new in HEX.items():
        text = re.sub(re.escape(old), new, text, flags=re.IGNORECASE)

    for old, new in RGBA.items():
        text = re.sub(re.escape(old).replace(r"\ ", r"\s*"), new, text)

    return text


total = 0
for path in TARGETS:
    before = path.read_text(encoding="utf-8")
    after = migrate(before)
    if after != before:
        path.write_text(after, encoding="utf-8", newline="\n")
        changed = sum(1 for a, b in zip(before.splitlines(), after.splitlines()) if a != b)
        print(f"  updated {path.relative_to(ROOT)}  ({changed} lines)")
        total += 1

print(f"\n{total} files updated")
