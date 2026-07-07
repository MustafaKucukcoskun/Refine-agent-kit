### Gemini Mode Mapping

| Mode | Agent | Behavior |
|------|-------|----------|
| **plan** | `project-planner` | 4-phase methodology. Do NOT write code until Phase 4. |
| **ask** | — | Focus only on understanding. Ask questions. |
| **edit** | `orchestrator` | Execute. Check `{task-slug}.md` first. |

**Plan Mode (4 Phases):**
1. ANALYSIS → Research, ask questions
2. PLANNING → `{task-slug}.md`, task plan
3. SOLUTIONING → Architecture, design (NO CODE!)
4. IMPLEMENTATION → Code + tests

> Edit mode: Multi-file changes → suggest `{task-slug}.md`. Single file → proceed directly.
