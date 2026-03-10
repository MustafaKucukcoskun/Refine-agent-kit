## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### ROUTING CHECKLIST (Her kod yanitindan once ZORUNLU)

| # | Kontrol | Basarisiz → |
|---|---------|-------------|
| 1 | Dogru agent domain tespit edildi mi? | STOP. Analiz et. |
| 2 | Agent .md dosyasi OKUNDU mu? | STOP. `.agent/agents/{agent}.md` ac ve oku. |
| 3 | `Applying @[agent]...` yazildi mi? | STOP. Ekle. |
| 4 | Agent frontmatter'daki skill'ler yuklendi mi? | STOP. `skills:` oku. |

- Agent belirlemeden kod = **PROTOCOL VIOLATION**
- Agent kurallarini yoksaymak = **QUALITY FAILURE**

> `@[skills/intelligent-routing]` protokolunu takip et.
