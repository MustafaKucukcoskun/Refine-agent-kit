# cli-tool Domain Kuralları

## Aktif Olma Koşulu

package.json "bin" alanı VEYA pyproject.toml [project.scripts] VEYA setup.py entry_points mevcut.

## Primary Agent

backend-specialist

## Kütüphane Tercihleri

Node.js:

- commander.js veya yargs (argüman parsing)
- inquirer (interaktif prompt)
- picocolors veya chalk (renk \u2014 hafif olanı tercih)
- ora (spinner), execa (alt process çalıştırma)

Python:

- Click (önerilen) veya Typer (type-hint bazlı)
- rich (terminal formatlama)

## UX Kuralları

- --help her zaman çalışmalı
- --version flag zorunlu
- Hata mesajları stderr'e (process.stderr / sys.stderr)
- Çıktılar stdout'a
- Exit code: 0 = başarı, 1+ = hata
- Yıkıcı işlemler için --dry-run sun
