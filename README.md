# refine-agent-kit

AI Agent toolkit for **Google Antigravity IDE**. 21 specialist agents, 53 skills, design persona system, and anti-AI-slop protection.

Built on [antigravity-kit](https://github.com/vudovn/antigravity-kit).

## Quick Start

### Single Project (e.g. Next.js)

```bash
cd my-nextjs-app
npx github:YOUR_USERNAME/refine-agent-kit init --domain next-web
```

### Monorepo (Multi-Technology)

```bash
cd my-monorepo

# 1. Root setup — installs agent system + global rules
npx github:YOUR_USERNAME/refine-agent-kit init --domain next-web

# 2. Add domain markers for each subdirectory
npx github:YOUR_USERNAME/refine-agent-kit add-domain --domain python-backend --subdir services/api
npx github:YOUR_USERNAME/refine-agent-kit add-domain --domain python-ml --subdir services/ml
npx github:YOUR_USERNAME/refine-agent-kit add-domain --domain next-web --subdir apps/landing
npx github:YOUR_USERNAME/refine-agent-kit add-domain --domain next-web --subdir apps/dashboard
```

Result:
```
my-monorepo/
├── .agent/                        ← Agent system (21 agents, 53 skills)
├── .shared/design-system/         ← 59 personas, 107 reference sites
├── .agent/rules/GEMINI.md         ← Root agent routing
├── .agent/mcp_config.json         ← Domain MCP servers
├── apps/
│   ├── landing/GEMINI.md          ← "Next.js frontend" routing
│   └── dashboard/GEMINI.md        ← "Next.js frontend" routing
├── services/
│   ├── api/GEMINI.md              ← "FastAPI backend" routing
│   └── ml/GEMINI.md               ← "Python ML" routing
└── .env.agent.example
```

When you work on `services/api/handler.py`, Antigravity automatically activates **backend-specialist**. When you switch to `apps/landing/page.tsx`, it activates **frontend-specialist**. No manual switching needed.

## Available Domains

| Domain | Description | Primary Agent | MCP Servers |
|--------|-------------|---------------|-------------|
| `next-web` | Next.js + React + Tailwind + shadcn | frontend-specialist | shadcn, magic-ui, figma, supabase |
| `python-backend` | FastAPI + PostgreSQL + SQLAlchemy | backend-specialist | — |
| `python-ml` | PyTorch + OpenCV + NumPy | backend-specialist | — |

## What Gets Installed

### Global (`~/.gemini/`) — applies to ALL projects

| File | Purpose |
|------|---------|
| `GEMINI.md` | Code quality rules, anti-AI-slop, scope expansion |
| `antigravity/mcp_config.json` | context7, github, playwright, chrome-devtools |

### Project (`.agent/` + `.shared/`) — per project

| Directory | Contents |
|-----------|----------|
| `.agent/agents/` | 21 specialist AI agents |
| `.agent/skills/` | 53 domain-specific skills |
| `.agent/workflows/` | 17 slash command workflows |
| `.agent/domains/` | 12 domain configuration packs |
| `.agent/rules/` | Local GEMINI.md + domain rules |
| `.agent/scripts/` | 6 master utility scripts |
| `.agent/mcp_config.json` | Domain-specific MCP servers |
| `.shared/design-system/` | 59 personas + 107 reference sites + 32 anti-patterns |

## API Keys Setup

After installation, copy `.env.agent.example` to `.env` and fill in:

| Key | Required | Where to get |
|-----|----------|-------------|
| `GITHUB_PERSONAL_ACCESS_TOKEN` | Yes | [GitHub Settings > Tokens](https://github.com/settings/tokens) |
| `CONTEXT7_API_KEY` | Yes | [context7.com](https://context7.com) |
| `MAGIC_UI_API_KEY` | Optional | [21st.dev/settings/api](https://21st.dev/settings/api) |
| Figma | Auto | OAuth — browser login when first used |
| Supabase | Auto | OAuth — browser login when first used |

## How Agent Routing Works

```
You open a file
      ↓
Antigravity reads GEMINI.md hierarchy:
  1. ~/.gemini/GEMINI.md              ← Global quality rules
  2. .agent/rules/GEMINI.md           ← Agent system + routing
  3. services/api/GEMINI.md           ← "Use backend-specialist"
      ↓
Correct agent activates automatically
      ↓
Agent loads its skills from frontmatter
      ↓
AI writes project-specific, anti-slop code
```

## CLI Reference

```bash
# Install full agent system
npx refine-kit init --domain <domain>

# Add domain marker to subdirectory (monorepo)
npx refine-kit add-domain --domain <domain> --subdir <path>

# Options
--force          Overwrite existing files
--skip-global    Skip ~/.gemini/ installation
--path <dir>     Target directory (default: cwd)
--yes            Skip interactive prompts
--quiet          Minimal output
```

## Anti-AI Slop

Global rules prevent generic AI output across ALL languages:

- **Code**: No `data`, `temp`, `utils.py`, obvious comments, unnecessary wrappers
- **Backend**: No generic CRUD without domain logic, proper error handling
- **Frontend**: No purple gradients, 3-column grids, stock illustrations
- **Text**: No "In today's rapidly evolving...", no "seamless integration"

**Balance rule**: Avoiding slop ≠ over-engineering. Simple tasks stay simple. A 3-line CRUD endpoint doesn't need a factory pattern.

## License

MIT
