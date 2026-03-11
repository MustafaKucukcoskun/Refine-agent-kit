# Domain: CLI Tool (Node.js/Python)

> This directory contains a command-line tool (CLI) project.
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `backend-specialist` — CLI architecture, command parsing, I/O handling
- **Test:** `test-engineer` — Vitest or Pytest

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
|-------------|-------------|-------------|
| bash-linux | testing-patterns | nodejs-best-practices |
| clean-code | | |

## Tech Stack

- Node.js: commander / yargs
- Python: Click / Typer
- Testing: Vitest (Node) or Pytest (Python)

## CLI-Specific Rules

- `--help` must always work: Help output in all commands and subcommands
- `--version` flag MANDATORY: Show semantic versioning
- Errors to stderr: `console.error` / `sys.stderr`, stdout must stay clean
- Output to stdout: Pipe-friendly output, colored output only on TTY
- Exit code: 0 = success, 1+ = error (meaningful error codes)
- `--dry-run`: Mandatory dry-run support for destructive operations
