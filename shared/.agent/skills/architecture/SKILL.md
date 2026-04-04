---
name: architecture
description: Architectural decision-making framework. Requirements analysis, trade-off evaluation, ADR documentation. Use when making architecture decisions or analyzing system design.
allowed-tools: Read, Glob, Grep
---

# Architecture Decision Framework

> "Requirements drive architecture. Trade-offs inform decisions. ADRs capture rationale."

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File                    | Description                              | When to Read                 |
| ----------------------- | ---------------------------------------- | ---------------------------- |
| `context-discovery.md`  | Questions to ask, project classification | Starting architecture design |
| `trade-off-analysis.md` | ADR templates, trade-off framework       | Documenting decisions        |
| `pattern-selection.md`  | Decision trees, anti-patterns            | Choosing patterns            |
| `examples.md`           | MVP, SaaS, Enterprise examples           | Reference implementations    |
| `patterns-reference.md` | Quick lookup for patterns                | Pattern comparison           |

---

## 🔗 Related Skills

| Skill                             | Use For                 |
| --------------------------------- | ----------------------- |
| `@[skills/database-design]`       | Database schema design  |
| `@[skills/api-patterns]`          | API design patterns     |
| `@[skills/deployment-procedures]` | Deployment architecture |

---

## Core Principle

**"Simplicity is the ultimate sophistication."**

- Start simple
- Add complexity ONLY when proven necessary
- You can always add patterns later
- Removing complexity is MUCH harder than adding it

---

## Validation Checklist

Before finalizing architecture:

- [ ] Requirements clearly understood
- [ ] Constraints identified
- [ ] Each decision has trade-off analysis
- [ ] Simpler alternatives considered
- [ ] ADRs written for significant decisions
- [ ] Team expertise matches chosen patterns

---

## Decision Quality Protocol (MANDATORY)

For each architectural milestone, produce a **Decision Packet**.

### Decision Packet Structure

1. Problem statement and desired outcome.
2. Constraint envelope (hard/soft/open).
3. Option space (minimum 3 viable options).
4. Trade-off scoring matrix.
5. Chosen option + rationale.
6. Risks, mitigations, and rollback strategy.
7. Revisit triggers (when to re-open this decision).

### Trade-off Scoring Matrix

Score each option from 1 to 5 on these dimensions:

| Dimension     | Question                                    |
| ------------- | ------------------------------------------- |
| Correctness   | Does it satisfy core requirements safely?   |
| Operability   | Is it observable, debuggable, supportable?  |
| Time-to-Value | How fast can the team deliver useful value? |
| Team Fit      | Does current team expertise support it?     |
| Cost Profile  | Infra and implementation cost trajectory    |
| Evolvability  | Can it adapt to next-stage product needs?   |

Use weighted scoring only when stakeholders agree on priorities.

### Unknown-Unknown Scan

Before finalizing architecture, answer:

1. Which assumptions are least validated?
2. Which integration points can fail silently?
3. What breaks first at 10x scale?
4. Which decision creates irreversible lock-in?

If uncertainty is high, prefer reversible decisions and staged rollout.

---

## SaaS and Product Systems Guidance

When user asks for full SaaS/system design, avoid single-path recommendations.

Always provide:

1. Baseline architecture (fastest reliable path).
2. Scale-ready variant (for growth stage).
3. Frontier variant (higher upside, higher risk).

Then recommend one path based on explicit constraints, not preference bias.
