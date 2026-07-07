---
name: nuxt-app
description: Nuxt 4 full-stack blueprint. Vue 3, Pinia, Tailwind CSS v4, Prisma.
---

# Nuxt 4 Full-Stack Blueprint (2026 Edition)

Modern full-stack blueprint for Nuxt 4 with the official app directory structure, Nitro server routes, and Tailwind CSS v4.

## Tech Stack

| Component  | Technology   | Version / Notes                 |
| ---------- | ------------ | ------------------------------- |
| Framework  | Nuxt         | v4.0+ (App Directory structure) |
| UI Engine  | Vue          | v3.5+                           |
| Language   | TypeScript   | v5+ (Strict Mode)               |
| State      | Pinia        | v3+ (Store syntax)              |
| Database   | PostgreSQL   | Prisma ORM                      |
| Styling    | Tailwind CSS | v4.0+ with `@tailwindcss/vite`  |
| UI Lib     | Nuxt UI      | v3 (Tailwind v4 native)         |
| Validation | Zod          | Schema validation               |

---

## Directory Structure (Nuxt 4 Standard)

Use the `app/` directory to keep application code and routing conventions explicit.

```
project-name/
├── app/                  # Application Source
│   ├── assets/
│   │   └── css/
│   │       └── main.css  # Tailwind v4 imports
│   ├── components/       # Auto-imported components
│   ├── composables/      # Auto-imported logic
│   ├── layouts/
│   ├── pages/            # File-based routing
│   ├── app.vue           # Root component
│   └── router.options.ts
├── server/               # Nitro Server Engine
│   ├── api/              # API Routes (e.g. /api/users)
│   ├── routes/           # Server Routes
│   └── utils/            # Server-only helpers (Prisma)
├── prisma/
│   └── schema.prisma
├── public/
├── nuxt.config.ts        # Main Config
└── package.json
```

---

## Key Concepts (2026)

| Concept                 | Description                             | Future Update                                                                   |
| ----------------------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| **App Directory**       | `app/`                                  | Official Nuxt 4 structure for pages, layouts, composables, and root app code.   |
| **File-based Routing**  | `app/pages/`                            | Routes are generated from the pages directory when routing is needed.           |
| **Nitro Server Engine** | `server/api/` and `server/routes/`      | Full-stack server endpoints and server logic ship with Nuxt by default.         |
| **Auto-imports**        | `components/`, `composables/`, `utils/` | Nuxt auto-imports common app primitives to keep feature code lean.              |
| **Tailwind v4**         | CSS-first                               | Tailwind's current Nuxt guide uses `@tailwindcss/vite` and a global CSS import. |

---

## Environment Variables

| Variable              | Purpose                               |
| --------------------- | ------------------------------------- |
| DATABASE_URL          | Prisma connection string (PostgreSQL) |
| NUXT_PUBLIC_APP_URL   | Canonical URL                         |
| NUXT_SESSION_PASSWORD | Session encryption key                |

---

## Setup Steps

1. Initialize Project:

   ```bash
   npm create nuxt@latest my-app
   ```

2. Install Core Deps:

   ```bash
   npm install @pinia/nuxt @prisma/client zod
   npm install -D prisma
   ```

3. Setup Tailwind v4:
   Install the Vite plugin (new standard):

   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```

   Add to `nuxt.config.ts`:

   ```ts
   import tailwindcss from "@tailwindcss/vite";
   export default defineNuxtConfig({
     vite: {
       plugins: [tailwindcss()],
     },
     css: ["~/assets/css/main.css"],
   });
   ```

4. Configure CSS:
   In `app/assets/css/main.css`:

   ```css
   @import "tailwindcss";
   @theme {
     --color-primary: oklch(0.6 0.15 150);
   }
   ```

5. Run Development:
   ```bash
   npm run dev -- -o
   ```

---

## Best Practices

- **Root app**: Keep `app/app.vue` minimal and compose layouts with `<NuxtLayout>` and `<NuxtPage>` when routing is enabled.
- **Routing**: Omit `app/pages/` entirely for very small landing pages that do not need `vue-router`.
- **State**: Use `defineStore` for shared application state and prefer server-first data loading where possible.
- **Server code**: Keep Prisma access in `server/` to avoid leaking database concerns into client bundles.
- **Experimental features**: Treat Vue Vapor-related work as exploratory, not as a default Nuxt 4 requirement.
