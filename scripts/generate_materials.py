import json
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
MATERIALS = ROOT / "materials"
OUTPUT = ROOT / "public" / "materials.json"

CATEGORIES = {
    "문제집": ["문제집"],
    "실모": ["실모", "실전모의고사", "모의고사"],
    "N제": ["n제", "N제"],
}


def classify(path: Path):
    name = path.stem.strip()
    normalized = name.lower()
    parent = path.parent.name.strip().lower()

    for category, prefixes in CATEGORIES.items():
        if any(normalized.startswith(prefix.lower()) for prefix in prefixes):
            return category

    for category, prefixes in CATEGORIES.items():
        if parent in {prefix.lower() for prefix in prefixes}:
            return category

    return None


def clean_name(path: Path):
    name = path.stem.strip()
    name = re.sub(r"^(n제|실모|문제집)\s*[-_:：]?\s*", "", name, flags=re.IGNORECASE)
    return name.strip() or path.stem

items = []

for path in sorted(MATERIALS.rglob("*.pdf"), key=lambda p: p.as_posix().lower()):
    category = classify(path)
    if category is None:
        continue

    relative = path.relative_to(ROOT).as_posix()
    items.append({
        "name": clean_name(path),
        "category": category,
        "url": "/".join(quote(part) for part in relative.split("/")),
    })

seen = set()
unique_items = []
for item in items:
    key = (item["category"], item["url"])
    if key not in seen:
        seen.add(key)
        unique_items.append(item)

category_order = {"문제집": 0, "실모": 1, "N제": 2}
unique_items.sort(key=lambda item: (category_order[item["category"]], item["name"].lower()))

OUTPUT.write_text(json.dumps(unique_items, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Generated {OUTPUT} with {len(unique_items)} materials.")
