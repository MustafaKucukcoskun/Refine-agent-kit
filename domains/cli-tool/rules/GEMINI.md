# GEMINI.md — Antigravity Agent System (cli-tool)

> This file defines the agent routing and skill system for this workspace.
> Global code quality rules are loaded from ~/.gemini/GEMINI.md.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (STEP 1)

| Type | Trigger | Action |
|------|---------|--------|
| **QUESTION** | "what is", "explain", "how does it work" | Text response |
| **SIMPLE CODE** | "fix", "add", "change" (single file) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **CLI DESIGN** | "command", "flag", "subcommand", "argument" | `{task-slug}.md` + backend-specialist |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: CLI TOOL CODE RULES

### Primary Agent: `backend-specialist`
### Supporting: `test-engineer`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | bash-linux, clean-code |
| **P1** | testing-patterns |
| **P2** | nodejs-best-practices |

### CLI-Specific Rules

- **--help must always work:** Help output in all commands and subcommands.
- **--version flag MANDATORY:** Show semantic versioning (`x.y.z`).
- **Errors to stderr:** Use `console.error` / `sys.stderr`. stdout must stay clean.
- **Output to stdout:** Pipe-friendly output. Colored output only on TTY (isatty check).
- **Exit code:** 0 = success, 1 = general error, 2 = usage error. Meaningful codes.
- **--dry-run:** Mandatory dry-run support for destructive operations.
- **Testing:** Vitest (Node) or Pytest (Python). Test for every command.

@./gemini-modes.md

### Final Checklist

Order: **--help Check → --version Check → Exit Codes → Lint → Tests → Pipe Compatibility**

---

## TIER 2: CLI ARCHITECTURE & UX RULES

### Command Design

- Subcommand pattern: `mycli <command> [options]` (git-style)
- Positional args: Minimum, with clear names
- Options: Both long form (`--output`) + short form (`-o`)
- Config file: `.myclirc` or `mycli.config.js` support
- Environment variables: Override with `MYCLI_*` prefix

### I/O Patterns

- stdin: Pipe input support (`cat file | mycli process`)
- stdout: Machine-readable format (JSON, CSV) with `--format` flag
- stderr: Progress bar, spinners, warnings
- Interactive prompts: Only on TTY, skip with `--yes` / `-y`

### Error Handling

- User-friendly error messages: What happened + what to do
- Stack trace: Only in `--verbose` or `--debug` mode
- Validation: Input validation first, clear error messages
- Graceful degradation: Network errors, file not found, etc.

### Distribution

- Node.js: `package.json` `bin` field, npm publish
- Python: `pyproject.toml` `[project.scripts]`, pip install
- Standalone: `pkg` (Node) or `PyInstaller` (Python)

---

@./agents-reference.md

**Key Skills:** bash-linux, clean-code, nodejs-best-practices, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /release

---
