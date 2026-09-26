import json
from pathlib import Path

HOME = Path(r"c:\Users\robbi\Desktop\PORTFOLIOV2TRUE\PortfolioTRUEV2\src\pages\Home.tsx")
content = HOME.read_text(encoding="utf-8")


def apply_unified_patch(text: str, patch: str) -> tuple[str, bool]:
    lines = patch.splitlines()
    if not any(line.startswith("*** Update File:") for line in lines):
        return text, False

    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.startswith("*** Update File:"):
            i += 1
            continue

        i += 1
        while i < len(lines) and not lines[i].startswith("*** "):
            if lines[i].startswith("@@"):
                i += 1
                removed: list[str] = []
                added: list[str] = []
                while i < len(lines) and not lines[i].startswith("@@") and not lines[i].startswith("*** "):
                    row = lines[i]
                    if row.startswith("-"):
                        removed.append(row[1:])
                    elif row.startswith("+"):
                        added.append(row[1:])
                    elif row.startswith(" "):
                        removed.append(row[1:])
                        added.append(row[1:])
                    else:
                        removed.append(row)
                        added.append(row)
                    i += 1

                block = "\n".join(removed)
                replacement = "\n".join(added)
                if block not in text:
                    return text, False
                text = text.replace(block, replacement, 1)
            else:
                i += 1
    return text, True


def extract_patches_from_transcript(tid: str) -> list[tuple]:
    path = (
        Path(r"C:\Users\robbi\.cursor\projects\c-Users-robbi-Desktop-PORTFOLIOV2TRUE-PortfolioTRUEV2\agent-transcripts")
        / tid
        / f"{tid}.jsonl"
    )
    out: list[tuple] = []
    with open(path, encoding="utf-8") as handle:
        for line_no, line in enumerate(handle, 1):
            obj = json.loads(line)
            for item_idx, item in enumerate(obj.get("message", {}).get("content", [])):
                if not isinstance(item, dict) or item.get("type") != "tool_use":
                    continue
                name = item.get("name", "")
                inp = item.get("input")
                if name == "StrReplace" and isinstance(inp, dict) and "Home.tsx" in inp.get("path", ""):
                    out.append(("StrReplace", line_no, item_idx, inp.get("old_string", ""), inp.get("new_string", "")))
                elif name == "ApplyPatch":
                    patch = inp if isinstance(inp, str) else (inp.get("patch") if isinstance(inp, dict) else None)
                    if patch and "Home.tsx" in patch:
                        out.append(("ApplyPatch", line_no, item_idx, patch, None))
    return out


transcripts = [
    "4028a208-847c-4918-bdb0-71032bd94a9c",
    "407d292a-c015-409c-b70c-c1a02e5b2cf9",
    "1641bc4c-d6ac-4ff4-9c46-7a46d1ef462f",
]

applied = 0
failed: list[tuple] = []

for tid in transcripts:
    patches = extract_patches_from_transcript(tid)
    print(f"\n=== {tid[:8]}: {len(patches)} patches ===")
    for kind, line, item_idx, old, new in patches:
        if kind == "StrReplace":
            if old in content:
                content = content.replace(old, new, 1)
                applied += 1
                print(f"  OK L{line}.{item_idx} StrReplace ({len(old)}->{len(new)})")
            else:
                failed.append((tid[:8], line, item_idx, kind, old[:100]))
                print(f"  FAIL L{line}.{item_idx} StrReplace")
        else:
            new_content, ok = apply_unified_patch(content, old)
            if ok:
                content = new_content
                applied += 1
                print(f"  OK L{line}.{item_idx} ApplyPatch")
            else:
                failed.append((tid[:8], line, item_idx, kind, old[:100]))
                print(f"  FAIL L{line}.{item_idx} ApplyPatch")

print(f"\nApplied {applied}, failed {len(failed)}")
syms = [
    "heroRobLockupSvg",
    "applyHeroSvgTextLayout",
    "svgTextDebugControls",
    "HERO_NAME_MOBILE_DISPLAY_FONT_CLASS",
    "nonDesktopLockupZoom",
    "nameOverlayHostsRef",
    "syncNameOverlayHostToSvg",
    "HERO_ROB_LOCKUP_SVG_BASE",
    "hideHeroNameSvgGlyphs",
    "setHeroSvgPartPosition",
    "pointer-events-auto",
    "select-text",
    "HERO_SVG_TEXT_LAYOUT_DEFAULTS",
]
for sym in syms:
    print(f"{sym}: {sym in content}")

out = Path(r"c:\Users\robbi\Desktop\PORTFOLIOV2TRUE\PortfolioTRUEV2\src\pages\Home.tsx.recovered")
out.write_text(content, encoding="utf-8")
print("Wrote", out, "lines", content.count("\n") + 1)
