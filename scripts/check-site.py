#!/usr/bin/env python3
"""Valida referencias locales básicas del sitio estático."""

from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob("*.html"))
DATA_FILES = [ROOT / "js/site-data.js", ROOT / "js/proyectos-data.js"]
REQUIRED = [ROOT / "index.html", ROOT / "404.html", ROOT / "CNAME", ROOT / ".nojekyll"]


def local_target(source: Path, reference: str) -> Path | None:
    if not reference or reference.startswith(("http:", "https:", "mailto:", "tel:", "data:", "//", "#")):
        return None
    clean = reference.split("?", 1)[0].split("#", 1)[0]
    if not clean or "${" in clean:
        return None
    if clean.startswith("/"):
        return ROOT / clean.lstrip("/")
    return source.parent / clean


errors: list[str] = []

for required in REQUIRED:
    if not required.exists():
        errors.append(f"Falta archivo requerido: {required.relative_to(ROOT)}")

for source in HTML_FILES:
    text = source.read_text(encoding="utf-8")
    for reference in re.findall(r'(?:src|href)=["\']([^"\']+)', text):
        target = local_target(source, reference)
        if target is not None and not target.exists():
            errors.append(f"{source.name}: referencia inexistente {reference}")

for source in DATA_FILES:
    text = source.read_text(encoding="utf-8")
    for reference in re.findall(r'["\'](\.?/?assets/[^"\']+)["\']', text):
        target = ROOT / reference.removeprefix("./").lstrip("/")
        if not target.exists():
            errors.append(f"{source.relative_to(ROOT)}: recurso inexistente {reference}")

if errors:
    print("Validación fallida:")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print(f"Sitio válido: {len(HTML_FILES)} páginas revisadas y referencias locales disponibles.")
