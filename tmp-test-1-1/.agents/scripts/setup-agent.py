#!/usr/bin/env python3
"""
setup-agent.py — Antigravity Domain Pack Auto-Detector v1.0
Usage: python setup-agent.py [--dry-run] [--domain NAME] [--list] [--multi] [--verbose] [--path DIR]
"""

import argparse
import json
import sys
from pathlib import Path


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _read_json(path: Path) -> dict:
    """Read JSON file safely. Returns empty dict on error."""
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}


def _read_text(path: Path) -> str:
    """Read text file safely. Returns empty string on error."""
    try:
        return path.read_text(encoding="utf-8")
    except OSError:
        return ""


# ─── Trigger Functions ───────────────────────────────────────────────────────

def _check_next_web(p: Path) -> bool:
    pkg = _read_json(p / "package.json")
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    return "next" in deps


def _check_python_backend(p: Path) -> bool:
    content = _read_text(p / "pyproject.toml")
    return bool(content) and any(kw in content for kw in ["fastapi", "django"])


def _check_csharp_backend(p: Path) -> bool:
    return any(p.glob("*.csproj")) or any(p.glob("**/*.csproj"))


def _check_unity_game(p: Path) -> bool:
    return (p / "Assets").is_dir() and (p / "ProjectSettings").is_dir()


def _check_godot_game(p: Path) -> bool:
    return (p / "project.godot").exists()


def _check_python_data(p: Path) -> bool:
    content = _read_text(p / "pyproject.toml")
    return bool(content) and any(kw in content for kw in ["pandas", "numpy", "scikit-learn"])


def _check_mobile_rn(p: Path) -> bool:
    pkg = _read_json(p / "package.json")
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    return "react-native" in deps


def _check_mobile_flutter(p: Path) -> bool:
    return (p / "pubspec.yaml").exists()


def _check_electron(p: Path) -> bool:
    pkg = _read_json(p / "package.json")
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    return "electron" in deps or "tauri" in deps


def _check_cli_tool(p: Path) -> bool:
    pkg = _read_json(p / "package.json")
    return "bin" in pkg


def _check_chrome_extension(p: Path) -> bool:
    manifest = _read_json(p / "manifest.json")
    return "content_scripts" in manifest or "background" in manifest


def _check_phaser_game(p: Path) -> bool:
    pkg = _read_json(p / "package.json")
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    return "phaser" in deps


# ─── Domain Detection ────────────────────────────────────────────────────────

DOMAIN_CHECKS = [
    ("next-web", _check_next_web),
    ("python-backend", _check_python_backend),
    ("csharp-backend", _check_csharp_backend),
    ("unity-game", _check_unity_game),
    ("godot-game", _check_godot_game),
    ("python-data", _check_python_data),
    ("mobile-rn", _check_mobile_rn),
    ("mobile-flutter", _check_mobile_flutter),
    ("electron-desktop", _check_electron),
    ("cli-tool", _check_cli_tool),
    ("chrome-extension", _check_chrome_extension),
    ("phaser-game", _check_phaser_game),
]


def detect_domains(project_path: Path, verbose: bool = False) -> list[str]:
    """Scan project directory and return matching domain names."""
    detected = []

    for domain_name, check_fn in DOMAIN_CHECKS:
        try:
            result = check_fn(project_path)
            if result:
                detected.append(domain_name)
                if verbose:
                    print(f"  \u2713 {domain_name}")
            elif verbose:
                print(f"  \u00b7 {domain_name} \u2014 no match")
        except Exception as e:
            if verbose:
                print(f"  \u26a0 {domain_name} \u2014 check error: {e}")

    return detected


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Antigravity Domain Pack Auto-Detector v1.0"
    )
    parser.add_argument("--dry-run", action="store_true", help="Detect only, don't write files")
    parser.add_argument("--domain", type=str, help="Skip auto-detect, use this domain")
    parser.add_argument("--list", action="store_true", help="Show current active domain")
    parser.add_argument("--multi", action="store_true", help="Allow multiple domains (monorepo)")
    parser.add_argument("--verbose", action="store_true", help="Detailed output")
    parser.add_argument("--path", type=str, default=".", help="Project directory (default: .)")
    args = parser.parse_args()

    project_path = Path(args.path).resolve()

    if not project_path.exists():
        print(f"Error: Project directory not found: {project_path}", file=sys.stderr)
        sys.exit(1)

    # --list: show current active domain
    if args.list:
        domain_file = project_path / ".agent" / "active-domain.json"
        if domain_file.exists():
            data = _read_json(domain_file)
            domain = data.get("domain", "undefined")
            if isinstance(domain, list):
                print(f"Active domains: {', '.join(domain)}")
            else:
                print(f"Active domain: {domain}")
        else:
            print("No active domain found.")
        return

    # --domain: manual override
    if args.domain:
        domains = [args.domain]
        print(f"Manual domain: {args.domain}")
    else:
        if args.verbose:
            print(f"Scanning project: {project_path}\n")
        domains = detect_domains(project_path, verbose=args.verbose)

    if not domains:
        print("\nNo matching domain found.")
        print("Supported domains:", ", ".join(name for name, _ in DOMAIN_CHECKS))
        return

    # Multiple domains handling
    if len(domains) > 1:
        # --domain flag ile override edilmişse sor
        if getattr(args, 'domain', None):
            # Manuel domain belirtilmişse direkt kullan, çakışmayı yoksay
            if args.domain in domains:
                domains = [args.domain]
            else:
                print(f"⚠ --domain '{args.domain}' bu projede eşleşmiyor.")
                print(f"  Eşleşen domainler: {domains}")
                print(f"  Devam etmek için listeden birini --domain ile belirt.")
                sys.exit(1)
        elif getattr(args, 'multi', False):
            # --multi flag varsa hepsini kullan (monorepo)
            print(f"ℹ Multi-domain mod: {domains}")
        else:
            # İnteraktif seçim
            print(f"\n⚠  Birden fazla domain eşleşti: {domains}")
            print(f"")
            for i, d in enumerate(domains, 1):
                print(f"  [{i}] {d}")
            print(f"  [0] İptal")
            print(f"")

            # --dry-run veya --non-interactive modda sessiz seçim (ilki)
            if getattr(args, 'non_interactive', False) or getattr(args, 'dry_run', False):
                chosen = domains[0]
                print(f"  (Non-interactive mod) Otomatik seçim: {chosen}")
                domains = [chosen]
            else:
                while True:
                    try:
                        choice = input(f"  Seçim [1-{len(domains)}]: ").strip()
                        if choice == '0':
                            print("  İptal edildi.")
                            sys.exit(0)
                        idx = int(choice) - 1
                        if 0 <= idx < len(domains):
                            domains = [domains[idx]]
                            print(f"  ✓ Seçildi: {domains[0]}")
                            break
                        else:
                            print(f"  Geçersiz seçim. 1-{len(domains)} arası bir sayı gir.")
                    except (ValueError, KeyboardInterrupt):
                        print("\n  İptal edildi.")
                        sys.exit(0)

    # Display results
    for domain in domains:
        print(f"\n{'='*40}")
        print(f"Domain: {domain}")
        print(f"{'='*40}")
        agent_dir = Path(__file__).resolve().parent.parent
        domain_meta_path = agent_dir / "domains" / f"{domain}.json"
        if domain_meta_path.exists():
            meta = _read_json(domain_meta_path)
            print(f"  Primary agent: {meta.get('primary_agent', '?')}")
            skills = meta.get("skills", {})
            p0 = skills.get("p0", [])
            if p0:
                print(f"  P0 skills: {', '.join(p0)}")
            mcp_extra = meta.get("mcp_extra", [])
            if mcp_extra:
                print(f"  Extra MCP: {', '.join(mcp_extra)}")
            mcp_status = meta.get("mcp_status")
            if mcp_status:
                print(f"  MCP status: {mcp_status}")
            rules = meta.get("rules_file", "")
            if rules:
                rules_path = agent_dir / rules
                exists = "\u2713" if rules_path.exists() else "\u2717 MISSING"
                print(f"  Domain rules: .agent/{rules} {exists}")
        else:
            print(f"  \u26a0 Domain metadata not found: {domain_meta_path.relative_to(project_path)}")

    if args.dry_run:
        print("\n[DRY RUN] No files modified.")
        return

    # Save active domain
    active_domain_path = project_path / ".agent" / "active-domain.json"
    active_data = {
        "domain": domains[0] if len(domains) == 1 else domains,
        "multi": len(domains) > 1,
        "detected_by": "setup-agent.py v1.0",
    }
    try:
        active_domain_path.parent.mkdir(parents=True, exist_ok=True)
        with open(active_domain_path, "w", encoding="utf-8") as f:
            json.dump(active_data, f, indent=2, ensure_ascii=False)
        print(f"\n\u2705 Active domain saved: {active_domain_path.relative_to(project_path)}")
    except OSError as e:
        print(f"\n\u26a0 Failed to save domain: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
