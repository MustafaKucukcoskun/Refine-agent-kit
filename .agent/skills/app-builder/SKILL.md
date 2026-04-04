---
name: app-builder
description: Main application building orchestrator. Creates full-stack applications from natural language requests. Determines project type, selects tech stack, coordinates agents.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# App Builder - Application Building Orchestrator

> Analyzes user's requests, determines tech stack, plans structure, and coordinates agents.

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File                    | Description                            | When to Read                        |
| ----------------------- | -------------------------------------- | ----------------------------------- |
| `project-detection.md`  | Keyword matrix, project type detection | Starting new project                |
| `tech-stack.md`         | 2026 default stack, alternatives       | Choosing technologies               |
| `agent-coordination.md` | Agent pipeline, execution order        | Coordinating multi-agent work       |
| `scaffolding.md`        | Directory structure, core files        | Creating project structure          |
| `feature-building.md`   | Feature analysis, error handling       | Adding features to existing project |
| `blueprints/SKILL.md`   | **Project blueprints**                 | Scaffolding new project             |

---

## 📦 Blueprints (13)

These files are prompt-time reference blueprints, not executable starter repos.
Read only the matching blueprint, then scaffold the project from that guidance.

| Blueprint                                                        | Tech Stack          | When to Use           |
| ---------------------------------------------------------------- | ------------------- | --------------------- |
| [nextjs-fullstack](blueprints/nextjs-fullstack/BLUEPRINT.md)     | Next.js + Prisma    | Full-stack web app    |
| [nextjs-saas](blueprints/nextjs-saas/BLUEPRINT.md)               | Next.js + Stripe    | SaaS product          |
| [nextjs-static](blueprints/nextjs-static/BLUEPRINT.md)           | Next.js + Framer    | Landing page          |
| [nuxt-app](blueprints/nuxt-app/BLUEPRINT.md)                     | Nuxt 4 + Pinia      | Vue full-stack app    |
| [express-api](blueprints/express-api/BLUEPRINT.md)               | Express + JWT       | REST API              |
| [python-fastapi](blueprints/python-fastapi/BLUEPRINT.md)         | FastAPI             | Python API            |
| [react-native-app](blueprints/react-native-app/BLUEPRINT.md)     | Expo + Zustand      | Mobile app            |
| [flutter-app](blueprints/flutter-app/BLUEPRINT.md)               | Flutter + Riverpod  | Cross-platform mobile |
| [electron-desktop](blueprints/electron-desktop/BLUEPRINT.md)     | Electron + React    | Desktop app           |
| [chrome-extension](blueprints/chrome-extension/BLUEPRINT.md)     | Chrome MV3          | Browser extension     |
| [cli-tool](blueprints/cli-tool/BLUEPRINT.md)                     | Node.js + Commander | CLI app               |
| [monorepo-turborepo](blueprints/monorepo-turborepo/BLUEPRINT.md) | Turborepo + pnpm    | Monorepo              |
| [astro-static](blueprints/astro-static/BLUEPRINT.md)             | Astro + MDX         | Blog / Docs           |

---

## 🔗 Related Agents

| Agent                 | Role                             |
| --------------------- | -------------------------------- |
| `project-planner`     | Task breakdown, dependency graph |
| `frontend-specialist` | UI components, pages             |
| `backend-specialist`  | API, business logic              |
| `database-architect`  | Schema, migrations               |
| `devops-engineer`     | Deployment, preview              |

---

## Usage Example

```
User: "Make an Instagram clone with photo sharing and likes"

App Builder Process:
1. Project type: Social Media App
2. Tech stack: Next.js + Prisma + Cloudinary + Clerk
3. Create plan:
   ├─ Database schema (users, posts, likes, follows)
   ├─ API routes (12 endpoints)
   ├─ Pages (feed, profile, upload)
   └─ Components (PostCard, Feed, LikeButton)
4. Coordinate agents
5. Report progress
6. Start preview
```

---

## Quality Upgrade Protocol (v1)

Use this protocol for every non-trivial build request.

### 1. Outcome-First Framing

Define success as product outcomes, not only code completion.

| Question                                 | Why It Matters                               |
| ---------------------------------------- | -------------------------------------------- |
| What business/user outcome must improve? | Prevents feature-for-feature's-sake building |
| What does failure look like?             | Creates guardrails for trade-offs            |
| What is the quality bar for v1?          | Aligns scope and ambition                    |

### 2. Dynamic Constraint Envelope

Classify constraints before stack selection:

| Level    | Examples                                                | Handling                     |
| -------- | ------------------------------------------------------- | ---------------------------- |
| **Hard** | Compliance, security baseline, SLA, accessibility       | Must satisfy                 |
| **Soft** | Style preferences, team familiarity, optional libraries | Can be traded with rationale |
| **Open** | Areas where innovation is encouraged                    | Explore alternatives         |

This prevents over-restrictive prompts like fixed color/component diktats while preserving quality.

### 3. Option Space Before Commitment

Generate at least 3 implementation candidates before locking architecture.

| Option           | Shape                                  | Strength                             | Risk                  |
| ---------------- | -------------------------------------- | ------------------------------------ | --------------------- |
| **Conservative** | Proven stack, low novelty              | Predictable delivery                 | Lower differentiation |
| **Balanced**     | Modern defaults + selective innovation | Strong quality/speed trade-off       | Moderate complexity   |
| **Frontier**     | High-leverage novel approach           | Differentiation and long-term upside | Higher execution risk |

### 4. ADR-Lite Decision Record (Mandatory)

For each major decision, record:

1. Context and constraints.
2. Options considered.
3. Chosen option + why.
4. Risks and rollback path.
5. Trigger conditions for revisiting the decision.

### 5. Domain-Fit Innovation Pass

For product-facing work (landing pages, SaaS UX, onboarding, dashboards), propose 3 domain-compatible ideas users may not ask for directly.

Example framing:

- "If we add this concept, what user/job does it unlock?"
- "How does this reduce cognitive load or decision friction?"
- "Can this be implemented incrementally without architecture debt?"

### 6. Quality Gates (Before Final Output)

Do not finalize until these are explicit:

- Functional correctness and edge cases
- Security and data-safety checks
- Performance budget assumptions
- Maintainability and ownership clarity
- Test strategy (unit/integration/e2e scope)

---

## Behavioral Rule: Avoid Rigid Design Dictation

Do not force arbitrary style constraints like fixed colors/components unless user or brand context explicitly requires them.

Preferred approach:

1. Offer 2-3 justified directions.
2. Explain trade-offs clearly.
3. Let constraints adapt to goals, audience, and product stage.
