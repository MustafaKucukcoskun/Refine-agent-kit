---
name: knowledge-management
description: How to interact with the Antigravity IDE Knowledge Items (KI) system.
allowed-tools: []
---

# Knowledge Items (KI) System Integration

Antigravity IDE supports a robust **Knowledge Items (KI)** system designed to preserve past context, architectural decisions, and repository patterns.

## MANDATORY FIRST STEP: Check KI Summaries

Before performing any research, analysis, or creating documentation for a task, you **MUST** interact with the local KI system if it exists.

The KI system lives in the Antigravity App Data Directory:
`[AppDataDir]\knowledge\`

### 1. Identify Relevant KIs
At the start of your workflow, check if any KI matches your task. KIs are especially crucial for:
- "Deceptively Simple" Tasks ("Add logging," "run this in the background") which often have repository-specific established patterns.
- Debugging & Troubleshooting.
- Architecture & Refactoring.
- Complex or Multi-Phase Work.

### 2. Read KI Artifacts
Each KI contains:
- `metadata.json`: Summary, timestamps, and references to original sources.
- `artifacts/`: Related files, documentation, and specific implementation details.

Use `view_file` to read the `metadata.json` and any relevant files inside `artifacts/` **BEFORE** doing independent research or writing code.

### 3. Critical Rule: KIs are Starting Points
KIs are snapshots of past work. While they provide essential context, they can become stale:
- **Always verify against active code:** Cross-reference any API usage pattern or dependency you pull from a KI with the *current* implementation in the workspace before committing to an edit.
- **Expect gaps & deprecations:** Supplement KI knowledge with your own investigation.

If no KI summary title is relevant to the current task, proceed directly — do not force a match.
