# GEMINI.md — Antigravity Agent System (cli-tool)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi kurallari ~/.gemini/GEMINI.md'den yuklenir.

---

## CRITICAL: AGENT & SKILL PROTOCOL (ONCE OKU)

**ZORUNLU:** Her implementasyondan ONCE ilgili agent dosyasini ve skill'lerini oku.

### Skill Loading

`Agent aktif → frontmatter "skills:" kontrol → SKILL.md oku → Ilgili section'lari oku`

- **Selective:** TUM dosyalari okuma. Once `SKILL.md`, sonra sadece request'e uyan section.
- **Priority:** P0 (GEMINI.md) > P1 (Agent .md) > P2 (SKILL.md). Hepsi baglayici.
- **Enforcement:** `Read → Understand WHY → Apply PRINCIPLES → Code`. Skip yasak.

---

## REQUEST CLASSIFIER (ADIM 1)

| Tip              | Trigger                                     | Aksiyon                                |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| **SORU**         | "what is", "explain", "nasil calisir"       | Text yanit, arac yok                   |
| **SURVEY**       | "analyze", "listele", "overview"            | Session intel, dosya yok               |
| **SIMPLE CODE**  | "fix", "ekle", "degistir" (tek dosya)       | Inline edit                            |
| **COMPLEX CODE** | "build", "create", "implement", "yaz"       | `{task-slug}.md` + Agent               |
| **CLI DESIGN**   | "command", "flag", "subcommand", "argument" | `{task-slug}.md` + backend-specialist  |
| **SLASH CMD**    | /create, /debug, /verify, /code-review      | Command flow                           |

---

## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### Protocol

1. **Sessiz Analiz:** Domain tespit et (Command? I/O? Config? Error Handling?)
2. **Agent Sec:** En uygun specialist
3. **Bildir:** `**Applying knowledge of @[agent-name]...**`
4. **Uygula:** Agent .md dosyasini oku → kurallari uygula

### ROUTING CHECKLIST (Her kod yanitindan once ZORUNLU)

| #   | Kontrol                                       | Basarisiz →                                 |
| --- | --------------------------------------------- | ------------------------------------------- |
| 1   | Dogru agent domain tespit edildi mi?          | STOP. Analiz et.                            |
| 2   | Agent .md dosyasi OKUNDU mu?                  | STOP. `.agent/agents/{agent}.md` ac ve oku. |
| 3   | `Applying @[agent]...` yazildi mi?            | STOP. Ekle.                                 |
| 4   | Agent frontmatter'daki skill'ler yuklendi mi? | STOP. `skills:` oku.                        |

- Agent belirlemeden kod = **PROTOCOL VIOLATION**
- Agent kurallarini yoksaymak = **QUALITY FAILURE**

---

## File Dependency Awareness

Herhangi bir dosyayi degistirmeden once:

1. `CODEBASE.md` kontrol et (yoksa `session_manager.py` ile uret)
2. Bagimli dosyalari tespit et
3. Etkilenen TUM dosyalari birlikte guncelle

### System Map

**ZORUNLU:** Session basinda `ARCHITECTURE.md` oku. Agent, Skill ve Script yapisini anla.

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

### Gemini Mode Mapping

| Mod      | Agent             | Davranis                                       |
| -------- | ----------------- | ---------------------------------------------- |
| **plan** | `project-planner` | 4-asama metodoloji. Phase 4'e kadar KOD YAZMA. |
| **ask**  | —                 | Sadece anlamaya odaklan. Soru sor.             |
| **edit** | `orchestrator`    | Execute. Once `{task-slug}.md` kontrol et.     |

**Plan Mode (4 Faz):**
1. ANALYSIS → Arastir, soru sor
2. PLANNING → `{task-slug}.md`, gorev plani
3. SOLUTIONING → Mimari, tasarim (KOD YOK!)
4. IMPLEMENTATION → Kod + testler

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

## Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sira: **--help Check → --version Check → Exit Codes → Lint → Tests → Pipe Compatibility**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, bash-linux, nodejs-best-practices,
testing-patterns, context-engineering, code-review-checklist

**Workflows:** /create, /debug, /verify, /code-review

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

---
