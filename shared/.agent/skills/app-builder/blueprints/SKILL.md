---
name: blueprints
description: Project scaffolding blueprints for new applications. Use when creating new projects from scratch. Contains 13 stack-specific blueprints.
allowed-tools: Read, Glob, Grep
---

# Project Blueprints

> Quick-start blueprint references for scaffolding new projects.

---

## 🎯 Selective Reading Rule

These files are reference blueprints, not executable starter kits.
Read only the blueprint that matches the user's project type.

| Blueprint | Tech Stack | When to Use |
|-----------|------------|-------------|
| [nextjs-fullstack](nextjs-fullstack/BLUEPRINT.md) | Next.js + Prisma | Full-stack web app |
| [nextjs-saas](nextjs-saas/BLUEPRINT.md) | Next.js + Stripe | SaaS product |
| [nextjs-static](nextjs-static/BLUEPRINT.md) | Next.js + Framer | Landing page |
| [nuxt-app](nuxt-app/BLUEPRINT.md) | Nuxt 4 + Pinia | Vue full-stack app |
| [express-api](express-api/BLUEPRINT.md) | Express + JWT | REST API |
| [python-fastapi](python-fastapi/BLUEPRINT.md) | FastAPI | Python API |
| [react-native-app](react-native-app/BLUEPRINT.md) | Expo + Zustand | Mobile app |
| [flutter-app](flutter-app/BLUEPRINT.md) | Flutter + Riverpod | Cross-platform |
| [electron-desktop](electron-desktop/BLUEPRINT.md) | Electron + React | Desktop app |
| [chrome-extension](chrome-extension/BLUEPRINT.md) | Chrome MV3 | Browser extension |
| [cli-tool](cli-tool/BLUEPRINT.md) | Node.js + Commander | CLI app |
| [monorepo-turborepo](monorepo-turborepo/BLUEPRINT.md) | Turborepo + pnpm | Monorepo |
| [astro-static](astro-static/BLUEPRINT.md) | Astro + MDX | Blog / Docs |

---

## Usage

1. User says "create [type] app"
2. Match to appropriate blueprint
3. Read ONLY that blueprint's BLUEPRINT.md
4. Follow its tech stack and structure
