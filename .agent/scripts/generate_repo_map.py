#!/usr/bin/env python3
"""
generate_repo_map.py — High-Level Codebase Architecture Mapper
Generates a 'Repo Map' (a structural overview of the project) to provide AI agents
with a bird's-eye view of the codebase without exhausting their context window.

Usage:
  python generate_repo_map.py [directory] > repo_map.md
"""

import os
import re
import sys
from pathlib import Path

# Common directories to ignore to keep the map clean and fast
IGNORE_DIRS = {
    ".git", "node_modules", "venv", ".venv", "__pycache__", "dist", "build", 
    ".next", "coverage", ".pytest_cache", ".idea", ".vscode", "out", "target", 
    ".agent", ".agents"
}

# Common files to ignore
IGNORE_FILES = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "poetry.lock", "Pipfile.lock",
    ".DS_Store"
}

# Extensions we want to extract symbols from
PARSEABLE_EXTS = {
    ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".cs", ".go", ".cpp", ".c", ".h", 
    ".hpp", ".rb", ".php"
}

def is_ignored(path_obj):
    if path_obj.name in IGNORE_DIRS or path_obj.name in IGNORE_FILES:
        return True
    if path_obj.name.startswith(".") and path_obj.is_dir() and path_obj.name not in {".github", ".agent"}:
        return True
    return False

def extract_symbols(filepath):
    """
    AST-lite extraction using regex. Not perfect, but enough for a repo map.
    """
    ext = filepath.suffix.lower()
    symbols = []
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except Exception:
        return symbols

    for line in lines:
        line_stripped = line.strip()
        if not line_stripped:
            continue

        if ext == ".py":
            match = re.match(r'^(class|def)\s+([a-zA-Z_]\w*)', line_stripped)
            if match:
                symbols.append(f"{match.group(1)} {match.group(2)}")
                
        elif ext in {".js", ".jsx", ".ts", ".tsx"}:
            # class Name, function name(), const name = () =>
            match_class = re.match(r'^(?:export\s+)?(?:default\s+)?class\s+([a-zA-Z_]\w*)', line_stripped)
            if match_class:
                symbols.append(f"class {match_class.group(1)}")
                continue
                
            match_func = re.match(r'^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([a-zA-Z_]\w*)', line_stripped)
            if match_func:
                symbols.append(f"function {match_func.group(1)}")
                continue
                
            match_arrow = re.match(r'^(?:export\s+)?(?:const|let|var)\s+([a-zA-Z_]\w*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z_]\w*)\s*=>', line_stripped)
            if match_arrow:
                symbols.append(f"function {match_arrow.group(1)}")
                continue

            match_interface = re.match(r'^(?:export\s+)?(?:interface|type)\s+([a-zA-Z_]\w*)', line_stripped)
            if match_interface:
                symbols.append(f"type {match_interface.group(1)}")
                continue
                
        elif ext == ".go":
            match_func = re.match(r'^func\s+(?:\([^)]+\)\s+)?([a-zA-Z_]\w*)', line_stripped)
            if match_func:
                symbols.append(f"func {match_func.group(1)}")
            match_type = re.match(r'^type\s+([a-zA-Z_]\w*)\s+struct', line_stripped)
            if match_type:
                symbols.append(f"struct {match_type.group(1)}")
                
        elif ext in {".java", ".cs"}:
            match_class = re.match(r'^(?:public|private|protected)?\s*(?:static\s+)?(?:abstract\s+)?class\s+([a-zA-Z_]\w*)', line_stripped)
            if match_class:
                symbols.append(f"class {match_class.group(1)}")

    return symbols

def walk_tree(dir_path, prefix=""):
    """
    Recursively walk the directory and print a tree structure with symbols.
    """
    try:
        entries = sorted(list(dir_path.iterdir()), key=lambda x: (not x.is_dir(), x.name.lower()))
    except PermissionError:
        return

    # Filter out ignored
    entries = [e for e in entries if not is_ignored(e)]
    count = len(entries)

    for i, entry in enumerate(entries):
        is_last = i == count - 1
        connector = "└── " if is_last else "├── "
        
        print(f"{prefix}{connector}{entry.name}")
        
        if entry.is_dir():
            extension = "    " if is_last else "│   "
            walk_tree(entry, prefix + extension)
        else:
            if entry.suffix.lower() in PARSEABLE_EXTS:
                symbols = extract_symbols(entry)
                if symbols:
                    sym_prefix = prefix + ("    " if is_last else "│   ")
                    for j, sym in enumerate(symbols):
                        sym_connector = "    " if j == len(symbols) - 1 else "│   "
                        print(f"{sym_prefix}│   ▪ {sym}")
                    print(f"{sym_prefix}│")

def main():
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    target_path = Path(target_dir).resolve()

    if not target_path.exists() or not target_path.is_dir():
        print(f"Error: Directory '{target_dir}' does not exist.", file=sys.stderr)
        sys.exit(1)

    print(f"# Repository Map: {target_path.name}")
    print("Generated by Antigravity Agent System\n")
    print(f"```text\n{target_path.name}/")
    walk_tree(target_path)
    print("```")

if __name__ == "__main__":
    main()
