#!/usr/bin/env python3
"""
Downscales and re-encodes the source texture set into web-ready WebP.

Usage:  python3 scripts/optimize-textures.py [--src DIR] [--out DIR]
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  pip install Pillow")

Image.MAX_IMAGE_PIXELS = None

MONTHS = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
]


@dataclass(frozen=True)
class Job:
    src: str
    out: str
    width: int
    grayscale: bool = False
    quality: int = 80


JOBS: list[Job] = [
    Job("earth/earth_day.jpg", "earth/day.webp", 8192, quality=82),
    Job("earth/earth_night.jpg", "earth/night.webp", 8192, quality=78),
    Job("earth/earth_lights.jpg", "earth/lights.webp", 8192, grayscale=True),
    Job("earth/earth_clouds.jpg", "earth/clouds.webp", 8192, grayscale=True),
    Job("earth/earth_bump.jpg", "earth/bump.webp", 8192, grayscale=True, quality=85),
    Job(
        "earth/earth_specular.jpg",
        "earth/specular.webp",
        8192,
        grayscale=True,
        quality=75,
    ),
    Job("milkyway/milkyway.jpg", "milkyway/milkyway.webp", 8192),
    Job("moon/moon.jpg", "moon/moon.webp", 4096),
]

for _m in MONTHS:
    _stem = f"earth-{_m}"
    JOBS.append(
        Job(
            f"earth/earth_by_month/{_stem}.jpg",
            f"earth/months/{_m}.webp",
            4096,
            quality=80,
        )
    )


def resolve(src_root: Path, rel: str) -> Path | None:
    """Locate a source file, tolerating the stray .png.jpg double extension."""
    candidates = [src_root / rel]
    if rel.endswith(".jpg"):
        candidates.append(src_root / rel.replace(".jpg", ".png.jpg"))
    for c in candidates:
        if c.exists():
            return c
    return None


def process(job: Job, src_root: Path, out_root: Path) -> tuple[int, int] | None:
    source = resolve(src_root, job.src)
    if source is None:
        print(f"  skip   {job.src} (not found)")
        return None

    dest = out_root / job.out
    dest.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as im:
        height = job.width // 2
        im = im.convert("L" if job.grayscale else "RGB")
        im = im.resize((job.width, height), Image.Resampling.LANCZOS)
        im.save(dest, "WEBP", quality=job.quality, method=6)

    before = source.stat().st_size
    after = dest.stat().st_size
    print(
        f"  ok     {job.out:<34} {job.width}x{height}  "
        f"{before / 1e6:7.1f} MB -> {after / 1e6:5.2f} MB"
    )
    return before, after


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--src", default="assets/textures-src", type=Path)
    parser.add_argument("--out", default="public/textures", type=Path)
    args = parser.parse_args()

    if not args.src.exists():
        sys.exit(
            f"Source directory {args.src} not found.\n"
            "Place the original full-resolution textures there, or pass --src."
        )

    print(f"Optimizing textures: {args.src} -> {args.out}\n")
    total_before = total_after = 0
    for job in JOBS:
        result = process(job, args.src, args.out)
        if result:
            total_before += result[0]
            total_after += result[1]

    if total_before:
        print(
            f"\nTotal: {total_before / 1e6:.1f} MB -> {total_after / 1e6:.1f} MB "
            f"({100 * (1 - total_after / total_before):.1f}% smaller)"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
