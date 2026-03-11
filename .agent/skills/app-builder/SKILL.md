---
name: app-builder
description: Main application building orchestrator. Creates full-stack applications from natural language requests. Determines project type, selects tech stack, coordinates agents.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# App Builder - Application Building Orchestrator

> Analyzes user's requests, determines tech stack, plans structure, and coordinates agents.

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File | Description | When to Read |
|------|-------------|--------------|
| `project-detection.md` | Keyword matrix, project type detection | Starting new project |
| `tech-stack.md` | 2026 default stack, alternatives | Choosing technologies |
| `agent-coordination.md` | Agent pipeline, execution order | Coordinating multi-agent work |
| `scaffolding.md` | Directory structure, core files | Creating project structure |
| `feature-building.md` | Feature analysis, error handling | Adding features to existing project |
| `blueprints/SKILL.md` | **Project blueprints** | Scaffolding new project |

---

## 📦 Blueprints (13)

These files are prompt-time reference blueprints, not executable starter repos.
Read only the matching blueprint, then scaffold the project from that guidance.

| Blueprint | Tech Stack | When to Use |
|-----------|------------|-------------|
| [nextjs-fullstack](blueprints/nextjs-fullstack/BLUEPRINT.md) | Next.js + Prisma | Full-stack web app |
| [nextjs-saas](blueprints/nextjs-saas/BLUEPRINT.md) | Next.js + Stripe | SaaS product |
| [nextjs-static](blueprints/nextjs-static/BLUEPRINT.md) | Next.js + Framer | Landing page |
| [nuxt-app](blueprints/nuxt-app/BLUEPRINT.md) | Nuxt 4 + Pinia | Vue full-stack app |
| [express-api](blueprints/express-api/BLUEPRINT.md) | Express + JWT | REST API |
| [python-fastapi](blueprints/python-fastapi/BLUEPRINT.md) | FastAPI | Python API |
| [react-native-app](blueprints/react-native-app/BLUEPRINT.md) | Expo + Zustand | Mobile app |
| [flutter-app](blueprints/flutter-app/BLUEPRINT.md) | Flutter + Riverpod | Cross-platform mobile |
| [electron-desktop](blueprints/electron-desktop/BLUEPRINT.md) | Electron + React | Desktop app |
| [chrome-extension](blueprints/chrome-extension/BLUEPRINT.md) | Chrome MV3 | Browser extension |
| [cli-tool](blueprints/cli-tool/BLUEPRINT.md) | Node.js + Commander | CLI app |
| [monorepo-turborepo](blueprints/monorepo-turborepo/BLUEPRINT.md) | Turborepo + pnpm | Monorepo |
| [astro-static](blueprints/astro-static/BLUEPRINT.md) | Astro + MDX | Blog / Docs |

---

## 🔗 Related Agents

| Agent | Role |
|-------|------|
| `project-planner` | Task breakdown, dependency graph |
| `frontend-specialist` | UI components, pages |
| `backend-specialist` | API, business logic |
| `database-architect` | Schema, migrations |
| `devops-engineer` | Deployment, preview |

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
