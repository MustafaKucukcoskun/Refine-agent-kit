---
name: context-engineering
description: Context window management, progressive skill loading, token budget optimization, and multi-agent context sharing patterns. Foundational skill for efficient AI agent operation. Use when planning context strategy, optimizing token usage, or building multi-agent workflows.
version: 1.0.0
domain: global
triggers: context, token, budget, overflow, loading, progressive, JIT
---

# Context Engineering

> Production-grade patterns for managing AI agent context windows effectively.
> Inspired by Agent Skills for Context Engineering (7.7K★).

---

## Core Principle

> Context is your agent's most precious resource. Every token matters.
> A well-engineered context window is the difference between a brilliant agent and a confused one.

---

## 1. Context Window Management

### The Context Budget Rule

Before ANY complex task, calculate your budget:

```
Total Context = System Prompt + Rules + Agent + Skills + MCP Tools + Conversation + Working Memory
```

| Layer                | Typical Load     | Control           |
| -------------------- | ---------------- | ----------------- |
| System prompt        | ~2K tokens       | Fixed             |
| Rules (GEMINI.md)    | ~3-6K tokens     | Fixed (always_on) |
| Agent file           | ~3-26K tokens    | Per-request       |
| Skill files          | ~10-113K tokens  | JIT loaded        |
| MCP tool definitions | ~1-4K per server | Per-config        |
| Conversation history | Growing          | Managed by IDE    |
| Working memory       | Variable         | Your control      |

### Budget Thresholds

| Total Usage | Status         | Action                                         |
| ----------- | -------------- | ---------------------------------------------- |
| < 50K       | 🟢 Comfortable | Normal operation                               |
| 50-100K     | 🟡 Caution     | Avoid loading large skills simultaneously      |
| 100-150K    | 🔴 Danger      | Summarize, offload, prioritize                 |
| > 150K      | ⛔ Critical    | Context collapse imminent — reduce immediately |

---

## 2. Progressive Disclosure Strategy

### JIT (Just-In-Time) Loading

**Don't load everything at once.** Load resources only when needed:

```
Level 0: Rules (always loaded) ←────── ~6K tokens
Level 1: Agent persona (on request) ← ~3-26K tokens
Level 2: Skill SKILL.md (on demand) ← ~2-10K tokens
Level 3: Skill sub-files (deep dive) ← Variable
Level 4: MCP tool results (runtime) ← Variable
```

### Decision Tree

```
User request arrives
├── Simple question? → Level 0 only (no agent/skill needed)
├── Single-domain task? → Level 0 + 1 agent + 1-2 skills
├── Multi-domain task? → Level 0 + orchestrator + targeted skills
└── Deep research? → Progressive: start Level 2, expand to Level 3 as needed
```

### Anti-Pattern: The Kitchen Sink

```
❌ WRONG: Load 5 agents + 10 skills + all MCP tools = 200K+ tokens
✅ RIGHT: Load 1 agent + 2 skills + targeted MCP = 30K tokens
```

---

## 3. Skill Loading Strategy

### Index-First Pattern

1. Read SKILL.md header (frontmatter) — ~200 tokens
2. Scan section headings — ~100 tokens
3. Read ONLY the section matching the user's request
4. Load sub-files/references ONLY if the section refers to them

### Skill Size Awareness

| Skill Size       | Strategy                                         |
| ---------------- | ------------------------------------------------ |
| Small (< 5KB)    | Load fully, no concern                           |
| Medium (5-30KB)  | Load SKILL.md, sub-files JIT                     |
| Large (30-100KB) | Load SKILL.md header + relevant section only     |
| XL (> 100KB)     | ⚠️ Never load fully. Summary + targeted sections |

### Concurrent Skill Limit

**Rule:** Maximum 3 skills actively loaded at once.

If you need more:

1. Summarize current skill insights → working memory
2. Unload (stop referencing) the completed skill
3. Load the next skill

---

## 4. Multi-Agent Context Sharing

### The Handoff Pattern

When orchestrator delegates to specialist agents:

```
Orchestrator Context:
├── Task summary (< 500 tokens)
├── Key constraints
├── Expected output format
└── DO NOT pass: full conversation history, all skills, all MCP results
```

### Context Isolation

Each agent should receive ONLY:

- Its own persona file
- Relevant skill(s) for the sub-task
- Task-specific context (not everything)
- Clear exit criteria

### Anti-Pattern: Context Flooding

```
❌ WRONG: Pass entire conversation + all research to sub-agent
✅ RIGHT: Summarize → extract key points → pass structured brief
```

---

## 5. Token Budget Optimization Techniques

### Summarization Checkpoints

After every 5-10 tool calls, create a mental checkpoint:

```
What I've learned:    [key findings, 3-5 bullets]
What I still need:    [remaining questions]
Current approach:     [1-sentence strategy]
```

### File Reading Strategy

| File Size     | Strategy                                        |
| ------------- | ----------------------------------------------- |
| < 100 lines   | Read fully                                      |
| 100-500 lines | Read outline first, then targeted sections      |
| > 500 lines   | Search (grep) first, read only matching regions |

### MCP Tool Result Management

- **context7:** Results can be large. Extract key code snippets, discard boilerplate.
- **Playwright:** Snapshots are large. Use targeted element snapshots, not full-page.
- **Serena:** Symbol results are structured. Focus on signatures, not implementations.

---

## 6. Context Recovery Patterns

### When Context is Lost (Long Sessions)

1. Re-read task.md or implementation_plan.md (your own artifacts)
2. Check Knowledge Items (KIs) for distilled past insights
3. Re-read only the 1-2 most critical source files
4. DON'T re-read everything — targeted recovery only

### Session Continuity

Between sessions, ensure:

- Key decisions are written to artifacts (not just in conversation)
- Open questions are explicitly listed
- Next steps are documented in task.md

---

## 7. System Prompt Engineering

### Effective Rule Writing

| Principle            | Example                                              |
| -------------------- | ---------------------------------------------------- |
| **Be specific**      | "Max 40 lines per function" > "Keep functions short" |
| **Use tables**       | Structured data loads faster than paragraphs         |
| **Avoid repetition** | Say it once, reference it elsewhere                  |
| **Priority markers** | 🔴 critical > 🟡 important > 🟢 nice-to-have         |

### Rule Size Budget

| Category       | Target Size  | Justification                  |
| -------------- | ------------ | ------------------------------ |
| Global rules   | < 8K tokens  | Always loaded, must be lean    |
| Agent persona  | < 10K tokens | Loaded per-request             |
| Skill SKILL.md | < 5K tokens  | Index file, not the full skill |

---

## Quick Reference Checklist

Before starting any complex task:

- [ ] Estimate total context load (rules + agent + skills + MCP)
- [ ] Is it under 100K? If not, reduce
- [ ] Am I loading only what I need? (JIT, not everything)
- [ ] Do I have a summarization checkpoint plan?
- [ ] Are my artifacts capturing key decisions?

---

> **Remember:** A lean context window produces better results than a bloated one.
> When in doubt, summarize and discard — you can always re-read.
