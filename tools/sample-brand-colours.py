"""Print the brand palette measured off the logo artwork.

The values in `frontend/src/styles/tokens.css` come from this script rather
than from a colour picker, so if the logo is ever redrawn the palette can be
re-derived instead of re-guessed:

    python tools/sample-brand-colours.py

It wants Pillow and the logo file; neither is a build dependency, which is why
this lives in tools/ rather than in the frontend package.
"""

import colorsys
import sys
from collections import Counter
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("This needs Pillow: pip install pillow")

LOGO = Path(__file__).resolve().parents[1] / "frontend/src/assets/images/addis-limo-website-logo.png"

# The "ADDIS LIMO" lettering, which is the brand gold proper. The car's chrome
# highlights and the lion's shadowed mane cover a much wider range and would
# drag the figures in both directions.
LETTERING = (1000, 100, 2172, 500)

# The lettering is a metal gradient, so its gold falls into bands rather than
# onto one value: a cast shadow, a shaded side, the letter face and the lit
# edge. Each band reports the tone that covers the most pixels in it, and the
# token is that tone rounded. Bands are given as HSV value ranges.
BANDS = (
    ("--gold-deep", 0.00, 0.58),
    ("--gold-dark", 0.58, 0.72),
    ("--gold", 0.72, 0.90),
    ("--gold-light", 0.90, 0.95),
    ("--gold-bright", 0.95, 1.01),
)


def relative_luminance(colour):
    def channel(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4

    r, g, b = colour
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def contrast(colour, against=(0, 0, 0)):
    a, b = relative_luminance(colour), relative_luminance(against)
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)


def main():
    if not LOGO.exists():
        sys.exit(f"Logo not found at {LOGO}")
    image = Image.open(LOGO).convert("RGB")

    pixels = list(image.getdata())
    field = [p for p in pixels if max(p) <= 12]
    print(f"{LOGO.name}  {image.size[0]}x{image.size[1]}")
    print()
    print(f"Field: {100 * len(field) // len(pixels)}% of the file is near-black")
    for value, count in Counter(field).most_common(3):
        print("  #%02X%02X%02X  %d pixels" % (*value, count))
    print("  --ink takes the dominant value.")
    print()

    gold = []
    for r, g, b in image.crop(LETTERING).getdata():
        top, bottom = max(r, g, b), min(r, g, b)
        if top < 60:
            continue
        hue, _, value = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        if (top - bottom) / top > 0.30 and 20 <= hue * 360 <= 65:
            gold.append(((r, g, b), value))

    print(f"Gold: {len(gold)} lettering pixels, by band")
    for name, low, high in BANDS:
        band = [c for c, value in gold if low <= value < high]
        if not band:
            print("  %-14s (no pixels in this band)" % name)
            continue
        # Quantise before counting: a gradient never repeats an exact value
        # often enough for a raw mode to mean anything.
        buckets = {}
        for r, g, b in band:
            buckets.setdefault(((r >> 4) << 4, (g >> 4) << 4, (b >> 4) << 4), []).append((r, g, b))
        bucket = max(buckets.values(), key=len)
        count = len(bucket)
        # The bucket's own average, not its floor: flooring every channel to a
        # multiple of 16 would report each tone up to 15 steps too dark.
        tone = tuple(round(sum(c[i] for c in bucket) / count) for i in range(3))
        print(
            "  %-14s #%02X%02X%02X   %6d px   %5.2f:1 on the page"
            % (name, *tone, count, contrast(tone))
        )
    print()
    print("Body text stays white; gold below 4.5:1 is decoration only.")


if __name__ == "__main__":
    main()
