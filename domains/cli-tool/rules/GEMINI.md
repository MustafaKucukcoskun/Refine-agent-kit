# GEMINI.md — Antigravity Agent System (cli-tool)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi kurallari ~/.gemini/GEMINI.md'den yuklenir.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (ADIM 1)

| Tip | Trigger | Aksiyon |
|-----|---------|---------|
| **SORU** | "what is", "explain", "nasil calisir" | Text yanit |
| **SIMPLE CODE** | "fix", "ekle", "degistir" (tek dosya) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **CLI DESIGN** | "command", "flag", "subcommand", "argument" | `{task-slug}.md` + backend-specialist |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: CLI TOOL KOD KURALLARI

### Primary Agent: `backend-specialist`
### Supporting: `test-engineer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | bash-linux, clean-code |
| **P1** | testing-patterns |
| **P2** | nodejs-best-practices |

### CLI-Specific Rules

- **--help her zaman calismali:** Tum komut ve alt komutlarda yardim ciktisi.
- **--version flag ZORUNLU:** Semantic versioning (`x.y.z`) goster.
- **Hatalar stderr'e:** `console.error` / `sys.stderr` kullan. stdout temiz kalmali.
- **Output stdout'a:** Pipe-friendly cikti. Renkli cikti sadece TTY'de (isatty kontrol).
- **Exit code:** 0 = basarili, 1 = genel hata, 2 = kullanim hatasi. Anlamli kodlar.
- **--dry-run:** Yikici islemler icin zorunlu dry-run destegi.
- **Testing:** Vitest (Node) veya Pytest (Python). Her komut icin test.

@./gemini-modes.md

### Final Checklist

Sira: **--help Check → --version Check → Exit Codes → Lint → Tests → Pipe Compatibility**

---

## TIER 2: CLI ARCHITECTURE & UX KURALLARI

### Command Design

- Subcommand pattern: `mycli <command> [options]` (git-style)
- Positional args: Minimum, acik isimlerle
- Options: Long form (`--output`) + short form (`-o`) ikisi birden
- Config file: `.myclirc` veya `mycli.config.js` destegi
- Environment variables: `MYCLI_*` prefix ile override

### I/O Patterns

- stdin: Pipe input destegi (`cat file | mycli process`)
- stdout: Machine-readable format (JSON, CSV) `--format` flag ile
- stderr: Progress bar, spinners, warnings
- Interactive prompts: Sadece TTY'de, `--yes` / `-y` ile skip

### Error Handling

- User-friendly error messages: Ne oldu + ne yapilmali
- Stack trace: Sadece `--verbose` veya `--debug` modda
- Validation: Input validation ONCE, acik hata mesajlari
- Graceful degradation: Network hatasi, dosya bulunamadi vb.

### Distribution

- Node.js: `package.json` `bin` field, npm publish
- Python: `pyproject.toml` `[project.scripts]`, pip install
- Standalone: `pkg` (Node) veya `PyInstaller` (Python)

---

@./agents-reference.md

**Key Skills:** bash-linux, clean-code, nodejs-best-practices, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /release

---
