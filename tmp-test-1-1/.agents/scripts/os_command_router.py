#!/usr/bin/env python3
"""
OS command router for cross-platform workflows.

Usage:
  python .agent/scripts/os_command_router.py detect
  python .agent/scripts/os_command_router.py command install-python
  python .agent/scripts/os_command_router.py command install-playwright
  python .agent/scripts/os_command_router.py command lint-and-typecheck
"""

from __future__ import annotations

import argparse
import json
import os
import platform
import shutil
from typing import Dict, List, Optional

LINUX_PACKAGE_MANAGER_ORDER: List[str] = ["apt", "dnf", "yum", "pacman", "zypper", "apk"]
SUPPORTED_TASKS: List[str] = [
    "install-python",
    "install-node",
    "install-playwright",
    "lint-and-typecheck",
    "lint-and-typecheck-chain",
]


def detect_os() -> str:
    system = platform.system().lower()
    if system.startswith("win"):
        return "windows"
    if system == "darwin":
        return "macos"
    return "linux"


def detect_linux_package_manager() -> Optional[str]:
    for manager in LINUX_PACKAGE_MANAGER_ORDER:
        if shutil.which(manager):
            return manager
    return None


def recommended_shell(os_name: str) -> str:
    if os_name == "windows":
        return "powershell"
    return "bash"


def detect_active_shell(os_name: str) -> Optional[str]:
    shell_env = os.environ.get("SHELL")
    if shell_env:
        return os.path.basename(shell_env)

    if os_name == "windows":
        if os.environ.get("PSModulePath"):
            return "powershell"
        comspec = os.environ.get("ComSpec", "")
        if comspec:
            return os.path.basename(comspec)

    return None


def command_plan(task: str, os_name: str, linux_pm: Optional[str]) -> Dict[str, object]:
    if task == "install-python":
        if os_name == "windows":
            commands = ["winget install --id Python.Python.3.12 -e"]
            note = "If winget is unavailable, install Python from https://python.org/downloads/."
        elif os_name == "macos":
            commands = ["brew install python"]
            note = "If Homebrew is unavailable, install from https://brew.sh first."
        else:
            if linux_pm == "apt":
                commands = ["sudo apt update", "sudo apt install -y python3 python3-pip"]
            elif linux_pm == "dnf":
                commands = ["sudo dnf install -y python3 python3-pip"]
            elif linux_pm == "yum":
                commands = ["sudo yum install -y python3 python3-pip"]
            elif linux_pm == "pacman":
                commands = ["sudo pacman -S --noconfirm python python-pip"]
            elif linux_pm == "zypper":
                commands = ["sudo zypper install -y python3 python3-pip"]
            elif linux_pm == "apk":
                commands = ["sudo apk add python3 py3-pip"]
            else:
                commands = ["Install Python 3 and pip with your distro package manager."]
            note = "Run commands one by one with sudo privileges."
        return {"commands": commands, "note": note}

    if task == "install-node":
        if os_name == "windows":
            commands = ["winget install --id OpenJS.NodeJS.LTS -e"]
            note = "If winget is unavailable, install Node.js LTS from https://nodejs.org/."
        elif os_name == "macos":
            commands = ["brew install node"]
            note = "If Homebrew is unavailable, install from https://brew.sh first."
        else:
            if linux_pm == "apt":
                commands = ["sudo apt update", "sudo apt install -y nodejs npm"]
            elif linux_pm == "dnf":
                commands = ["sudo dnf install -y nodejs npm"]
            elif linux_pm == "yum":
                commands = ["sudo yum install -y nodejs npm"]
            elif linux_pm == "pacman":
                commands = ["sudo pacman -S --noconfirm nodejs npm"]
            elif linux_pm == "zypper":
                commands = ["sudo zypper install -y nodejs npm"]
            elif linux_pm == "apk":
                commands = ["sudo apk add nodejs npm"]
            else:
                commands = ["Install Node.js LTS with your distro package manager."]
            note = "Use nvm if you need strict version control per project."
        return {"commands": commands, "note": note}

    if task == "install-playwright":
        commands = [
            "python -m pip install --upgrade pip",
            "python -m pip install playwright",
            "python -m playwright install chromium",
        ]
        note = "These commands are shell-agnostic and work on Windows/macOS/Linux."
        return {"commands": commands, "note": note}

    if task == "lint-and-typecheck":
        commands = ["npm run lint", "npx tsc --noEmit"]
        note = "Run sequentially. Stop and fix issues if lint fails."
        return {"commands": commands, "note": note}

    if task == "lint-and-typecheck-chain":
        if os_name == "windows":
            commands = ["npm run lint; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; npx tsc --noEmit"]
        else:
            commands = ["npm run lint && npx tsc --noEmit"]
        note = "Shell-specific chain command for strict fail-fast behavior."
        return {"commands": commands, "note": note}

    raise ValueError(f"Unsupported task: {task}")


def build_context(task: Optional[str] = None) -> Dict[str, object]:
    os_name = detect_os()
    linux_pm = detect_linux_package_manager() if os_name == "linux" else None
    context: Dict[str, object] = {
        "os": os_name,
        "recommended_shell": recommended_shell(os_name),
        "active_shell": detect_active_shell(os_name),
        "linux_package_manager": linux_pm,
    }

    if task:
        plan = command_plan(task, os_name, linux_pm)
        context["task"] = task
        context["commands"] = plan["commands"]
        context["note"] = plan["note"]

    return context


def print_text(context: Dict[str, object]) -> None:
    print(f"OS: {context['os']}")
    print(f"Recommended shell: {context['recommended_shell']}")

    active_shell = context.get("active_shell")
    if active_shell:
        print(f"Detected active shell: {active_shell}")

    linux_pm = context.get("linux_package_manager")
    if linux_pm:
        print(f"Linux package manager: {linux_pm}")

    if "task" in context:
        print(f"Task: {context['task']}")
        print("Commands:")
        for idx, command in enumerate(context["commands"], start=1):
            print(f"{idx}. {command}")
        print(f"Note: {context['note']}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Route shell/package commands by OS.")
    subparsers = parser.add_subparsers(dest="subcommand", required=True)

    detect_parser = subparsers.add_parser("detect", help="Print OS and shell context.")
    detect_parser.add_argument("--format", choices=["text", "json"], default="text")

    command_parser = subparsers.add_parser("command", help="Print commands for a predefined task.")
    command_parser.add_argument("task", choices=SUPPORTED_TASKS)
    command_parser.add_argument("--format", choices=["text", "json"], default="text")

    args = parser.parse_args()

    if args.subcommand == "detect":
        context = build_context()
    else:
        context = build_context(args.task)

    if args.format == "json":
        print(json.dumps(context, indent=2))
    else:
        print_text(context)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
