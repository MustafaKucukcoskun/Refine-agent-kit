---
name: documentation-templates
description: Production-ready templates and quality standards for README, API reference, changelog, ADR, RFC, and AI-friendly docs (llms.txt, MCP-ready). Use when writing new docs, revising stale docs, picking a doc type for a given purpose, or generating docs that LLMs can cite. Keywords: docs, README, changelog, API docs, ADR, RFC, documentation, llms.txt.
allowed-tools: Read, Glob, Grep
---

# Documentation Templates

> Templates and quality standards for common documentation types — with explicit anti-patterns and a decision tree for picking the right template.

---

## Quality Standards (per template type)

| Template | Good | Bad | Target length |
|---|---|---|---|
| **README** | Under 5 min to quick-start | Tutorial-length saga | 150–400 lines |
| **API reference** | 1 request+response per endpoint with realistic data | Schema dumps, no examples | 1 page per endpoint |
| **Changelog** | Semantic versioning, breaking changes flagged | "Fixed stuff", "misc improvements" | 1 line per change |
| **ADR** | Context + options + decision + rationale + consequences | Decision without options considered | 1–2 pages |
| **Architecture** | Diagrams + rationale (not diagram-only) | Wall of prose, no visuals | 2–5 pages |
| **RFC** | Problem, proposal, alternatives, migration | Premature implementation detail | 3–10 pages |
| **llms.txt** | Structured sections, definitions upfront | Marketing copy | 100–300 lines |

---

## Template Selection Decision Tree

```
Is this for humans, AI, or both?
├── Humans only
│   ├── First-time user? → README
│   ├── Looking up specifics? → API Reference
│   └── Decision trail? → ADR / Changelog
├── AI only
│   ├── Fast citation? → llms.txt
│   └── Tool calling? → MCP-Ready spec
└── Both
    ├── Tutorial-style → README with examples
    └── Reference-style → API docs with JSON/YAML samples

Is this a decision that affects future work?
→ YES → ADR (lightweight) or RFC (heavier)
→ NO → Changelog entry or inline comment
```

---

## 1. README Structure

### Essential Sections (Priority Order)

| Section | Purpose |
|---------|---------|
| **Title + One-liner** | What is this? |
| **Quick Start** | Running in <5 min |
| **Features** | What can I do? |
| **Configuration** | How to customize |
| **API Reference** | Link to detailed docs |
| **Contributing** | How to help |
| **License** | Legal |

### README Template

```markdown
# Project Name

Brief one-line description.

## Quick Start

[Minimum steps to run]

## Features

- Feature 1
- Feature 2

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |

## Documentation

- [API Reference](./docs/api.md)
- [Architecture](./docs/architecture.md)

## License

MIT
```

---

## 2. API Documentation Structure

### Per-Endpoint Template

```markdown
## GET /users/:id

Get a user by ID.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | User ID |

**Response:**
- 200: User object
- 404: User not found

**Example:**
[Request and response example]
```

---

## 3. Code Comment Guidelines

### JSDoc/TSDoc Template

```typescript
/**
 * Brief description of what the function does.
 * 
 * @param paramName - Description of parameter
 * @returns Description of return value
 * @throws ErrorType - When this error occurs
 * 
 * @example
 * const result = functionName(input);
 */
```

### When to Comment

| ✅ Comment | ❌ Don't Comment |
|-----------|-----------------|
| Why (business logic) | What (obvious) |
| Complex algorithms | Every line |
| Non-obvious behavior | Self-explanatory code |
| API contracts | Implementation details |

---

## 4. Changelog Template (Keep a Changelog)

```markdown
# Changelog

## [Unreleased]
### Added
- New feature

## [1.0.0] - 2025-01-01
### Added
- Initial release
### Changed
- Updated dependency
### Fixed
- Bug fix
```

---

## 5. Architecture Decision Record (ADR)

```markdown
# ADR-001: [Title]

## Status
Accepted / Deprecated / Superseded

## Context
Why are we making this decision?

## Decision
What did we decide?

## Consequences
What are the trade-offs?
```

---

## 6. AI-Friendly Documentation (2025)

### llms.txt Template

For AI crawlers and agents:

```markdown
# Project Name
> One-line objective.

## Core Files
- [src/index.ts]: Main entry
- [src/api/]: API routes
- [docs/]: Documentation

## Key Concepts
- Concept 1: Brief explanation
- Concept 2: Brief explanation
```

### MCP-Ready Documentation

For RAG indexing:
- Clear H1-H3 hierarchy
- JSON/YAML examples for data structures
- Mermaid diagrams for flows
- Self-contained sections

---

## 7. Structure Principles

| Principle | Why |
|-----------|-----|
| **Scannable** | Headers, lists, tables |
| **Examples first** | Show, don't just tell |
| **Progressive detail** | Simple → Complex |
| **Up to date** | Outdated = misleading |

---

> **Remember:** Templates are starting points. Adapt to your project's needs.
