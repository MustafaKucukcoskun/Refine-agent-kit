#!/usr/bin/env python3
"""
Session Manager - refine-kit
=================================
Analyzes project state, detects tech stack, tracks file statistics, generates
CODEBASE.md with file dependency map, and provides session summaries.

Usage:
    python .agent/scripts/session_manager.py status [path]
    python .agent/scripts/session_manager.py info [path]
    python .agent/scripts/session_manager.py codebase [path]  # Generate/update CODEBASE.md
"""

import os
import re
import json
import hashlib
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Set, Tuple

def get_project_root(path: str) -> Path:
    return Path(path).resolve()

def analyze_package_json(root: Path) -> Dict[str, Any]:
    pkg_file = root / "package.json"
    if not pkg_file.exists():
        return {"type": "unknown", "dependencies": {}}
    
    try:
        with open(pkg_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        deps = data.get("dependencies", {})
        dev_deps = data.get("devDependencies", {})
        all_deps = {**deps, **dev_deps}
        
        stack = []
        if "next" in all_deps: stack.append("Next.js")
        elif "react" in all_deps: stack.append("React")
        elif "vue" in all_deps: stack.append("Vue")
        elif "svelte" in all_deps: stack.append("Svelte")
        elif "express" in all_deps: stack.append("Express")
        elif "nestjs" in all_deps or "@nestjs/core" in all_deps: stack.append("NestJS")
        
        if "tailwindcss" in all_deps: stack.append("Tailwind CSS")
        if "prisma" in all_deps: stack.append("Prisma")
        if "typescript" in all_deps: stack.append("TypeScript")
        
        return {
            "name": data.get("name", "unnamed"),
            "version": data.get("version", "0.0.0"),
            "stack": stack,
            "scripts": list(data.get("scripts", {}).keys())
        }
    except Exception as e:
        return {"error": str(e)}

def count_files(root: Path) -> Dict[str, int]:
    stats = {"created": 0, "modified": 0, "total": 0}
    # Simple count for now, comprehensive tracking would require git diff or extensive history
    exclude = {".git", "node_modules", ".next", "dist", "build", ".agent", ".gemini", "__pycache__"}
    
    for root_dir, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in exclude]
        stats["total"] += len(files)
        
    return stats

def detect_features(root: Path) -> List[str]:
    # Heuristic: look at folder names in src/
    features = []
    src = root / "src"
    if src.exists():
        possible_dirs = ["components", "modules", "features", "app", "pages", "services"]
        for d in possible_dirs:
            p = src / d
            if p.exists() and p.is_dir():
                # List subdirectories as likely features
                for child in p.iterdir():
                    if child.is_dir():
                        features.append(child.name)
    return features[:10] # Limit to top 10

def print_status(root: Path):
    info = analyze_package_json(root)
    stats = count_files(root)
    features = detect_features(root)
    
    print("\n=== Project Status ===")
    print(f"\n📁 Project: {info.get('name', root.name)}")
    print(f"📂 Path: {root}")
    print(f"🏷️  Type: {', '.join(info.get('stack', ['Generic']))}")
    print(f"📊 Status: Active")
    
    print("\n🔧 Tech Stack:")
    for tech in info.get('stack', []):
        print(f"   • {tech}")
        
    print(f"\n✅ Detected Modules/Features ({len(features)}):")
    for feat in features:
        print(f"   • {feat}")
    if not features:
        print("   (No distinct feature modules detected)")
        
    print(f"\n📄 Files: {stats['total']} total files tracked")
    print("\n====================\n")

EXCLUDE_DIRS = {".git", "node_modules", ".next", "dist", "build", ".agent", ".gemini",
                "__pycache__", ".venv", "venv", ".shared", "coverage", ".turbo"}
JS_TS_EXTENSIONS = {".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"}
PY_EXTENSIONS = {".py"}
CS_EXTENSIONS = {".cs"}

IMPORT_PATTERNS = {
    "js_import": re.compile(r'''import\s+.*?from\s+['"]([^'"]+)['"]'''),
    "js_require": re.compile(r'''require\s*\(\s*['"]([^'"]+)['"]\s*\)'''),
    "js_dynamic": re.compile(r'''import\s*\(\s*['"]([^'"]+)['"]\s*\)'''),
    "py_import": re.compile(r'''^\s*(?:from\s+([\w.]+)\s+import|import\s+([\w.]+))''', re.MULTILINE),
    "cs_using": re.compile(r'''^\s*using\s+([\w.]+)\s*;''', re.MULTILINE),
}


def get_source_files(root: Path) -> List[Path]:
    """Collect all source files, excluding vendor/build directories."""
    files = []
    valid_ext = JS_TS_EXTENSIONS | PY_EXTENSIONS | CS_EXTENSIONS
    for dirpath, dirs, filenames in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for f in filenames:
            fp = Path(dirpath) / f
            if fp.suffix in valid_ext:
                files.append(fp)
    return files


def parse_imports(filepath: Path, root: Path) -> List[str]:
    """Extract import targets from a source file."""
    try:
        content = filepath.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return []

    imports = []
    ext = filepath.suffix

    if ext in JS_TS_EXTENSIONS:
        for m in IMPORT_PATTERNS["js_import"].findall(content):
            imports.append(m)
        for m in IMPORT_PATTERNS["js_require"].findall(content):
            imports.append(m)
        for m in IMPORT_PATTERNS["js_dynamic"].findall(content):
            imports.append(m)
    elif ext in PY_EXTENSIONS:
        for m in IMPORT_PATTERNS["py_import"].findall(content):
            imports.append(m[0] or m[1])
    elif ext in CS_EXTENSIONS:
        for m in IMPORT_PATTERNS["cs_using"].findall(content):
            imports.append(m)

    return imports


def resolve_local_import(source: Path, target: str, root: Path, all_files: Set[str]) -> str | None:
    """Try to resolve a relative import to an actual project file."""
    if target.startswith("."):
        base = source.parent
        candidates = [
            base / target,
            base / (target + ".ts"),
            base / (target + ".tsx"),
            base / (target + ".js"),
            base / (target + ".jsx"),
            base / target / "index.ts",
            base / target / "index.tsx",
            base / target / "index.js",
        ]
        for c in candidates:
            resolved = c.resolve()
            rel = str(resolved.relative_to(root)).replace("\\", "/")
            if rel in all_files:
                return rel
    elif target.startswith("@/") or target.startswith("~/"):
        alias_path = target[2:]
        src_root = root / "src"
        candidates = [
            src_root / alias_path,
            src_root / (alias_path + ".ts"),
            src_root / (alias_path + ".tsx"),
            src_root / (alias_path + ".js"),
            src_root / alias_path / "index.ts",
            src_root / alias_path / "index.tsx",
        ]
        for c in candidates:
            if c.exists():
                rel = str(c.resolve().relative_to(root)).replace("\\", "/")
                if rel in all_files:
                    return rel
    return None


def build_dependency_graph(root: Path) -> Dict[str, List[str]]:
    """Build file → [dependencies] graph for the project."""
    files = get_source_files(root)
    all_files_set = set()
    for f in files:
        rel = str(f.relative_to(root)).replace("\\", "/")
        all_files_set.add(rel)

    graph: Dict[str, List[str]] = {}
    for f in files:
        rel = str(f.relative_to(root)).replace("\\", "/")
        raw_imports = parse_imports(f, root)
        resolved = []
        for imp in raw_imports:
            local = resolve_local_import(f, imp, root, all_files_set)
            if local and local != rel:
                resolved.append(local)
        if resolved:
            graph[rel] = sorted(set(resolved))
    return graph


def compute_project_hash(root: Path) -> str:
    """Hash based on source file paths + mtimes for cache invalidation."""
    files = get_source_files(root)
    h = hashlib.md5()
    for f in sorted(files):
        rel = str(f.relative_to(root))
        mtime = str(f.stat().st_mtime)
        h.update(f"{rel}:{mtime}".encode())
    return h.hexdigest()


def generate_codebase_md(root: Path) -> str:
    """Generate CODEBASE.md content with dependency graph."""
    info = analyze_package_json(root)
    graph = build_dependency_graph(root)
    stats = count_files(root)
    features = detect_features(root)

    # Build reverse dependency map (who depends on me?)
    reverse: Dict[str, List[str]] = {}
    for src, deps in graph.items():
        for d in deps:
            reverse.setdefault(d, []).append(src)

    # Find high-impact files (most dependents)
    high_impact = sorted(reverse.items(), key=lambda x: len(x[1]), reverse=True)[:15]

    lines = [
        "# CODEBASE.md",
        "",
        f"> Auto-generated by session_manager.py on {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"> Project hash: `{compute_project_hash(root)}`",
        "",
        "---",
        "",
        "## Project Info",
        "",
        f"- **Name:** {info.get('name', root.name)}",
        f"- **Stack:** {', '.join(info.get('stack', ['Unknown']))}",
        f"- **Total Files:** {stats['total']}",
        f"- **Source Files with Dependencies:** {len(graph)}",
        "",
        "---",
        "",
        "## High-Impact Files (Most Dependents)",
        "",
        "Changing these files affects the most other files. **Edit with care.**",
        "",
        "| File | Dependents | Used By |",
        "| ---- | ---------- | ------- |",
    ]

    for filepath, dependents in high_impact:
        dep_list = ", ".join(d.split("/")[-1] for d in dependents[:5])
        if len(dependents) > 5:
            dep_list += f" +{len(dependents)-5} more"
        lines.append(f"| `{filepath}` | {len(dependents)} | {dep_list} |")

    lines += [
        "",
        "---",
        "",
        "## File Dependencies",
        "",
    ]

    # Group by directory
    dirs: Dict[str, List[Tuple[str, List[str]]]] = {}
    for src, deps in sorted(graph.items()):
        d = "/".join(src.split("/")[:-1]) or "."
        dirs.setdefault(d, []).append((src, deps))

    for dir_name, entries in sorted(dirs.items()):
        lines.append(f"### `{dir_name}/`")
        lines.append("")
        for src, deps in entries:
            fname = src.split("/")[-1]
            dep_names = ", ".join(f"`{d.split('/')[-1]}`" for d in deps)
            lines.append(f"- **{fname}** → {dep_names}")
        lines.append("")

    if features:
        lines += [
            "---",
            "",
            "## Detected Modules",
            "",
        ]
        for feat in features:
            lines.append(f"- {feat}")
        lines.append("")

    return "\n".join(lines)


def cmd_codebase(root: Path):
    """Generate or update CODEBASE.md with caching."""
    cache_file = root / ".agent" / ".codebase_cache"
    output_file = root / "CODEBASE.md"
    current_hash = compute_project_hash(root)

    # Check cache
    if cache_file.exists() and output_file.exists():
        try:
            cached_hash = cache_file.read_text(encoding="utf-8").strip()
            if cached_hash == current_hash:
                print(f"✅ CODEBASE.md is up to date (hash: {current_hash[:8]}...)")
                return
        except Exception:
            pass

    print("🔄 Generating CODEBASE.md...")
    content = generate_codebase_md(root)
    output_file.write_text(content, encoding="utf-8")

    # Update cache
    cache_file.parent.mkdir(parents=True, exist_ok=True)
    cache_file.write_text(current_hash, encoding="utf-8")

    line_count = content.count("\n")
    print(f"✅ CODEBASE.md generated ({line_count} lines)")
    print(f"   Cache hash: {current_hash[:8]}...")


def main():
    parser = argparse.ArgumentParser(description="Session Manager")
    parser.add_argument("command", choices=["status", "info", "codebase"], help="Command to run")
    parser.add_argument("path", nargs="?", default=".", help="Project path")

    args = parser.parse_args()
    root = get_project_root(args.path)

    if args.command == "status":
        print_status(root)
    elif args.command == "info":
        print(json.dumps(analyze_package_json(root), indent=2))
    elif args.command == "codebase":
        cmd_codebase(root)

if __name__ == "__main__":
    main()
