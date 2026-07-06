---
description: Codebase onboarding workflow. Systematically analyzes a new or unfamiliar repository to understand its architecture, patterns, dependencies, and key files. Produces a structured onboarding report. Use when joining a new project, starting on an unfamiliar codebase, or after a long break from a project. Keywords: onboard, analyze, understand, explore, architecture, codebase, new project, getting started.
---

# /onboard — Codebase Onboarding

Systematic analysis of a codebase for rapid onboarding. Produces a structured report.

## Trigger

User invokes `/onboard` or asks to "understand this codebase", "analyze this project", "get me up to speed".

## Phase 1: Stack Detection

Detect the project's technology stack by examining:

1. **Package files:** `package.json`, `requirements.txt`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `*.csproj`, `pubspec.yaml`, `Gemfile`
2. **Config files:** `tsconfig.json`, `next.config.*`, `vite.config.*`, `.eslintrc.*`, `tailwind.config.*`, `docker-compose.yml`
3. **Lock files:** `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `poetry.lock`, `Pipfile.lock`
4. **Framework markers:** `app/` directory (Next.js/Rails), `src/` structure, `pages/`, `components/`

Output: Technology stack summary with versions.

## Phase 2: Structure Mapping

Map the project's directory structure:

1. **Root-level layout** — What directories exist and their purpose
2. **Entry points** — Main files (`index.ts`, `main.py`, `App.tsx`, `Program.cs`)
3. **Routing** — URL structure (file-based or config-based)
4. **Data layer** — Database models, schemas, migrations
5. **Shared code** — Utilities, helpers, common components
6. **Tests** — Test directory structure and framework
7. **Config** — Environment files, CI/CD, deployment configs

Output: Annotated directory tree with purpose labels.

## Phase 3: Pattern Identification

Identify architectural patterns and conventions:

1. **Architecture style** — MVC, layered, hexagonal, microservices, monolith
2. **State management** — Redux, Zustand, Context, Riverpod, BLoC
3. **Data fetching** — REST, GraphQL, tRPC, Server Components, SWR
4. **Auth pattern** — JWT, session, OAuth, middleware-based
5. **Error handling** — Custom error classes, error boundaries, global handlers
6. **Naming conventions** — PascalCase components, kebab-case files, etc.
7. **Import style** — Absolute paths, barrel exports, path aliases

Output: Convention summary that new contributors should follow.

## Phase 4: Key File Identification

Find the most important files a new developer should read first:

1. **README / docs** — Existing documentation quality assessment
2. **Config files** — Critical configuration that affects behavior
3. **Core business logic** — The "heart" of the application
4. **Database schema** — Data model definition
5. **API surface** — Public endpoints or exported interfaces
6. **Environment setup** — Required env vars, secrets, services

Output: Prioritized reading list (top 10-15 files) with rationale.

## Phase 5: Dependency Analysis

Analyze project dependencies:

1. **Core dependencies** — Framework, runtime, essential libraries
2. **Dev dependencies** — Build tools, linters, test frameworks
3. **Outdated check** — Major version gaps or deprecated packages
4. **Security** — Known vulnerabilities (if audit tool available)
5. **Custom/internal** — Monorepo packages or local dependencies

Output: Dependency health summary.

## Phase 6: Report Generation

Compile findings into a structured onboarding report:

```markdown
# [Project Name] — Onboarding Report

## Quick Summary
- **Stack:** [detected stack]
- **Architecture:** [pattern]
- **Status:** [active/maintained/legacy]

## Technology Stack
[from Phase 1]

## Directory Structure
[from Phase 2]

## Patterns & Conventions
[from Phase 3]

## Key Files (Read These First)
[from Phase 4]

## Dependencies
[from Phase 5]

## Getting Started
1. Clone + install
2. Environment setup
3. Run locally
4. Run tests

## Known Issues / Tech Debt
[any findings from analysis]
```

## Rules

- **READ ONLY** — This workflow does not modify any files. It only reads and reports.
- **Be specific** — Don't say "uses modern patterns." Say "uses React Server Components with streaming, SWR for client data fetching, and Zod for validation."
- **Prioritize** — A developer's time is limited. Rank findings by importance.
- **Flag risks** — If you see security issues, outdated deps, or missing tests, call them out.
- **Adapt scope** — For small projects (<20 files), keep the report concise. For large projects (>500 files), focus on architecture and key entry points.
