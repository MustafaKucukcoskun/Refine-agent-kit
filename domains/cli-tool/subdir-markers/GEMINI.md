# Domain: CLI Tool (Node.js/Python)

> Bu dizin komut satiri araci (CLI) projesi icerir.
> Agent routing: Bu dizindeki dosyalar icin asagidaki kurallar gecerlidir.

## Agent Routing

- **Primary:** `backend-specialist` — CLI architecture, command parsing, I/O handling
- **Test:** `test-engineer` — Vitest veya Pytest

## Skill Priority

| P0 (Kritik) | P1 (Onemli) | P2 (Destek) |
|-------------|-------------|-------------|
| bash-linux | testing-patterns | nodejs-best-practices |
| clean-code | | |

## Tech Stack

- Node.js: commander / yargs
- Python: Click / Typer
- Testing: Vitest (Node) veya Pytest (Python)

## CLI-Specific Rules

- `--help` her zaman calismali: Tum komut ve alt komutlarda yardim
- `--version` flag ZORUNLU: Semantic versioning goster
- Hatalar stderr'e: `console.error` / `sys.stderr`, stdout temiz kalmali
- Output stdout'a: Pipe-friendly cikti, renkli cikti sadece TTY'de
- Exit code: 0 = basarili, 1+ = hata (anlamli hata kodlari)
- `--dry-run`: Yikici islemler icin zorunlu dry-run destegi
