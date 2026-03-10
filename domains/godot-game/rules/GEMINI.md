# GEMINI.md — Antigravity Agent System (godot-game)

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

| Tip              | Trigger                                       | Aksiyon                                |
| ---------------- | --------------------------------------------- | -------------------------------------- |
| **SORU**         | "what is", "explain", "nasil calisir"         | Text yanit, arac yok                   |
| **SURVEY**       | "analyze", "listele", "overview"              | Session intel, dosya yok               |
| **SIMPLE CODE**  | "fix", "ekle", "degistir" (tek dosya)         | Inline edit                            |
| **COMPLEX CODE** | "build", "create", "implement", "yaz"         | `{task-slug}.md` + Agent               |
| **GAME DESIGN**  | "scene", "node", "mechanic", "level", "enemy" | `{task-slug}.md` + game-developer      |
| **SLASH CMD**    | /create, /debug, /verify, /code-review        | Command flow                           |

---

## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### Protocol

1. **Sessiz Analiz:** Domain tespit et (Scene? Script? Physics? Audio? UI?)
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

## TIER 1: GODOT GAME KOD KURALLARI

### Primary Agent: `game-developer`
### Supporting: `performance-optimizer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | godot-gdscript-patterns, game-development |
| **P1** | game-development/2d-games, game-development/game-art |
| **P2** | testing-patterns |

### GDScript-Specific Rules

- **Static typing ZORUNLU:** `var speed: float = 10.0`, `func move(delta: float) -> void:`
- **Signals sinif basinda:** `signal health_changed(new_health: int)` — tum signal'lar class top'da.
- **_ready() setup, _process() frame logic:** Lifecycle fonksiyonlarini karistirma.
- **Composition over inheritance:** Node composition tercih et. Derin inheritance zincirleri YASAK (max 3 level).
- **Autoload sadece global:** GameManager, AudioManager, EventBus gibi gercekten global olanlar.
- **Resource data objeleri icin:** `class_name ItemData extends Resource` — data class'lar icin Resource kullan.
- **Testing:** GUT (Godot Unit Test) framework. Her system icin test.

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

## TIER 2: GODOT ARCHITECTURE & GAME DESIGN KURALLARI

### Scene Architecture

- One scene, one responsibility: Her scene tek bir amaca hizmet etmeli
- Scene inheritance: Base scene + variant pattern
- PackedScene: Prefab gibi kullan, `instance()` ile olustur
- Scene tree organization: Logical grouping (Entities/, UI/, Environment/)

### Node Patterns

- `@export` ile Inspector'dan degistirilebilir parametreler
- `@onready` ile lazy initialization: `@onready var sprite: Sprite2D = $Sprite2D`
- Group system: `add_to_group("enemies")` ile toplu islem
- Node references: `$ChildNode` veya `get_node()`, hard-coded path'lerden kacin

### Physics & Movement

- `_physics_process()` fizik islemleri icin, `_process()` gorsel icin
- CharacterBody2D/3D: `move_and_slide()` pattern
- Area2D/3D: Trigger zone'lar icin, collision layer/mask dogru ayarla
- Delta time: Her zaman `delta` carpani kullan

### Performance

- Object pooling: Mermi, particle gibi sik olusturulan objeler icin
- Visibility: `VisibleOnScreenNotifier` ile off-screen objeleri deaktive et
- Signal vs polling: `_process()` yerine signal-driven tasarim tercih et
- GDScript profiler: Darbogazlari bulmak icin Godot profiler kullan

---

## Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sira: **Static Typing Check → Scene Organization → GUT Tests → Performance Profile → Export Test**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, godot-gdscript-patterns, game-development,
game-development/2d-games, game-development/game-art, testing-patterns, performance-profiling,
context-engineering, code-review-checklist

**Workflows:** /create, /debug, /verify, /code-review

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

---
