#!/usr/bin/env python3
"""Comprueba el ambiente local de mantenimiento sin modificar el remoto."""

from __future__ import annotations

import argparse
from pathlib import Path
import platform
import re
import shutil
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = [
    "AGENTS.md",
    "README.md",
    "CONFIGURACION-MANTENIMIENTO.md",
    "PENDIENTES-PAGINA-EQUIM.docx",
    ".github/workflows/deploy-pages.yml",
    "scripts/check-site.py",
    "index.html",
    "404.html",
    "CNAME",
    ".nojekyll",
]
EXPECTED_ORIGIN = "github.com/javiersn79/pagina-Grumo-Equim"


def run(command: list[str], timeout: int = 30) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        timeout=timeout,
        check=False,
    )


def version_tuple(text: str) -> tuple[int, ...]:
    match = re.search(r"(\d+)(?:\.(\d+))?(?:\.(\d+))?", text)
    if not match:
        return ()
    return tuple(int(part) for part in match.groups(default="0"))


errors: list[str] = []
warnings: list[str] = []
successes: list[str] = []


def ok(message: str) -> None:
    successes.append(message)


def warn(message: str) -> None:
    warnings.append(message)


def error(message: str) -> None:
    errors.append(message)


def check_command(name: str, args: list[str], minimum: tuple[int, ...]) -> None:
    path = shutil.which(name)
    if path is None:
        error(f"No se encontró {name} en PATH.")
        return
    result = run([name, *args])
    output = result.stdout.strip()
    if result.returncode != 0:
        error(f"{name} no pudo ejecutarse: {output}")
        return
    detected = version_tuple(output)
    if detected and detected < minimum:
        error(f"{name} {'.'.join(map(str, detected))} es anterior al mínimo {'.'.join(map(str, minimum))}.")
        return
    ok(f"{name}: {output}")


def git_value(*args: str) -> str:
    result = run(["git", *args])
    return result.stdout.strip() if result.returncode == 0 else ""


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Verifica herramientas, repositorio y validaciones locales sin publicar cambios."
    )
    parser.add_argument(
        "--remote",
        action="store_true",
        help="Comprueba acceso de lectura a la rama main del remoto origin.",
    )
    args = parser.parse_args()

    print(f"Sistema: {platform.system()} {platform.release()}")
    print(f"Repositorio: {ROOT}")

    if sys.version_info < (3, 10):
        error(f"Python {platform.python_version()} es anterior al mínimo 3.10.")
    else:
        ok(f"Python: {platform.python_version()}")

    check_command("git", ["--version"], (2, 23, 0))
    check_command("node", ["--version"], (18, 0, 0))

    for relative in REQUIRED_FILES:
        if not (ROOT / relative).exists():
            error(f"Falta el archivo requerido: {relative}")
    if not any(message.startswith("Falta el archivo requerido") for message in errors):
        ok("Archivos esenciales disponibles.")

    if not (ROOT / ".git").exists():
        error("La carpeta no es un clon Git. No uses una descarga ZIP.")
    elif shutil.which("git"):
        name = git_value("config", "user.name")
        email = git_value("config", "user.email")
        if name:
            ok(f"Identidad Git configurada: {name}")
        else:
            error("Falta configurar git user.name.")
        if email:
            ok(f"Correo Git configurado: {email}")
        else:
            error("Falta configurar git user.email.")

        origin = git_value("remote", "get-url", "origin")
        normalized_origin = origin.removesuffix(".git")
        if EXPECTED_ORIGIN in normalized_origin:
            ok(f"Remoto origin correcto: {origin}")
        elif origin:
            error(f"El remoto origin no corresponde al repositorio esperado: {origin}")
        else:
            error("No existe el remoto origin.")

        branch = git_value("branch", "--show-current")
        if branch:
            ok(f"Rama actual: {branch}")
            if branch == "main":
                warn("La rama actual es main. Crea una rama nueva antes de editar.")
        else:
            warn("No se pudo determinar la rama actual.")

        status = git_value("status", "--short")
        if status:
            warn("Hay archivos modificados o sin seguimiento; revísalos con git status --short.")
        else:
            ok("Árbol de trabajo limpio.")

        diff_check = run(["git", "diff", "--check"])
        if diff_check.returncode == 0:
            ok("git diff --check sin errores.")
        else:
            error(f"git diff --check falló: {diff_check.stdout.strip()}")

        if args.remote:
            remote = run(["git", "ls-remote", "--exit-code", "--heads", "origin", "main"], timeout=60)
            if remote.returncode == 0 and remote.stdout.strip():
                ok("Acceso remoto de lectura a origin/main confirmado.")
            else:
                error(f"No se pudo leer origin/main: {remote.stdout.strip() or 'sin detalle'}")

    site_check = run([sys.executable, "scripts/check-site.py"])
    if site_check.returncode == 0:
        ok(site_check.stdout.strip())
    else:
        error(f"La validación del sitio falló: {site_check.stdout.strip()}")

    if shutil.which("node"):
        javascript_files = sorted((ROOT / "js").glob("*.js"))
        failed_javascript: list[str] = []
        for source in javascript_files:
            result = run(["node", "--check", str(source)])
            if result.returncode != 0:
                failed_javascript.append(f"{source.relative_to(ROOT)}: {result.stdout.strip()}")
        if failed_javascript:
            error("Falló la sintaxis JavaScript: " + " | ".join(failed_javascript))
        else:
            ok(f"Sintaxis JavaScript válida en {len(javascript_files)} archivos.")

    print("\nRESULTADOS")
    for message in successes:
        print(f"[OK] {message}")
    for message in warnings:
        print(f"[AVISO] {message}")
    for message in errors:
        print(f"[ERROR] {message}")

    if errors:
        print(f"\nAmbiente no listo: {len(errors)} error(es) y {len(warnings)} aviso(s).")
        return 1

    print(f"\nAmbiente listo: 0 errores y {len(warnings)} aviso(s).")
    print("No se hizo push ni se modificaron permisos.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
