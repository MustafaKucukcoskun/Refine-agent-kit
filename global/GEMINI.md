# GEMINI.md — Global Code Quality Rules

> This file governs AI code quality across ALL projects. Language and framework agnostic.
> Location: ~/.gemini/GEMINI.md

---

## 🔴 TIER 0: UNIVERSAL RULES (Always, Every Language, Every Project)

### 🌐 Language

- Respond in the same language the user writes in
- Code comments and variable names: English

### 🖥️ Shell Compatibility (Global Mandatory)

- Detect the user's OS from context/environment before giving executable commands.
- If OS is known:
  - Windows: use PowerShell 5.1-compatible syntax
  - macOS/Linux: use Bash syntax
- If OS is unknown: provide separate command blocks for Windows (PowerShell) and macOS/Linux (Bash).
- Prefer shell-agnostic command sequences for common tasks (example: run `npm run lint` then `npx tsc --noEmit`).
- Do not use Bash-only operators in Windows command examples: `&&`, `||`, `set -euo pipefail`, `/dev/null`.

### 🧹 Clean Code (Global Mandatory)

- DRY: Repeated code = refactor signal. But don't do premature abstraction.
- KISS: Choose the simplest working solution. Over-engineering = quality decrease.
- YAGNI: Don't write it because "it might be needed later." Write for the current requirement.
- Test: Mandatory. Pyramid (Unit > Integration > E2E) + AAA Pattern.
- Secrets: Never hardcode. Use environment variables / secret manager.

### 🚫 Anti-AI Slop (Global Mandatory — Every Language, Every Output)

**AI slop = generic, template-like, non-project-specific output produced by AI.**

**⚖️ BALANCE RULE (CRITICAL):**
Avoiding slop ≠ over-engineering everything. A simple task should stay simple.
Inflating a 3-line CRUD endpoint to 50 lines "to be unique" is as bad as slop.
**The right approach: code that fits the project, is readable, and serves its purpose.**

#### Code Slop (All Languages)

| Slop Type           | Example                                                   | Why It's Bad                    |
| ------------------- | --------------------------------------------------------- | ------------------------------- |
| Generic naming      | `data`, `item`, `temp`, `result`, `flag`, `utils.py`      | Unclear what it does            |
| Obvious comments    | `// increment counter by 1`, `# loop through list`        | Restates the code               |
| Empty catch         | `try: ... except: pass` / `catch(e) {}`                   | Swallows errors                 |
| God class/file      | 500+ line single file, 10+ methods single class           | Single responsibility violation |
| Unnecessary wrapper | `class UserService { getUser() { return db.getUser() } }` | Adds no layer, just a proxy     |
| Copy-paste pattern  | Taken from tutorial, not adapted to project               | Not project-specific            |
| Over-abstraction    | factory + strategy + observer for a 3-file project        | Complexity ≠ quality            |

#### Backend / API Slop

| Slop Type                                          | Correct Approach                |
| -------------------------------------------------- | ------------------------------- |
| Return all data from every endpoint                | Pagination + field selection    |
| Generic error: `{"error": "Something went wrong"}` | Specific error code + message   |
| Separate middleware for everything                 | Where needed, as much as needed |
| N+1 query problem                                  | Eager loading / batch query     |
| Business logic in controller                       | Move to service/domain layer    |

#### Frontend / Design Slop

| Slop Type                                      | Correct Approach                        |
| ---------------------------------------------- | --------------------------------------- |
| Generic hero + 3-column grid + purple gradient | Project-specific layout + color         |
| `handleClick`, `onChange` generic handler      | `submitPayment`, `toggleDarkMode`       |
| `useEffect` on every component                 | Where needed, with cleanup              |
| CSS-in-JS everywhere                           | Styling that matches project convention |
| Stock illustration + Lorem ipsum               | Real content, real data                 |

#### Copy / Text Slop

| Slop                             | Alternative                                    |
| -------------------------------- | ---------------------------------------------- |
| "In today's rapidly evolving..." | Get straight to the point                      |
| "Leveraging cutting-edge..."     | Say what it does                               |
| "Seamless integration"           | Be specific: "Connect in 3 steps with API key" |
| "Robust and scalable"            | Give metrics: "10K req/s, 99.9% uptime"        |

### 📐 SCOPE EXPANSION (Every Implementation Task)

**On "add", "improve", "enhance" requests, DON'T NARROW scope, EXPAND it:**

| Area         | ❌ Minimal (FAIL)        | ✅ Full Scope                                |
| ------------ | ------------------------ | -------------------------------------------- |
| **Frontend** | 1 animation              | Scroll-trigger + stagger for every section   |
| **Backend**  | Validation on 1 endpoint | Validation + error handling on all endpoints |
| **API**      | Only happy path          | Happy + error + edge cases + rate limiting   |
| **Database** | Just create table        | Table + index + constraint + migration       |
| **Test**     | Write 1 test             | Happy path + edge case + error case tests    |

**Rule:** If scope is unclear → choose maximum interpretation, deliver, then ask.

### 🔐 Security (Global Mandatory)

- OWASP Top 10 awareness active in every code writing
- Input validation: Validate every external input (user input, API response, file read)
- Injection: Parameterized queries (SQL, command, LDAP). String concat for queries NEVER.
- Auth: Don't keep tokens in memory, use httpOnly cookie or secure storage
- Secrets: .env + environment variable. If a secret enters a commit = urgent rotate

### 📊 Performance (Language-Agnostic)

**Measure first, then optimize. Premature optimization = bad.**

| Area             | Measurement                         | Target                          |
| ---------------- | ----------------------------------- | ------------------------------- |
| **Web Frontend** | Core Web Vitals (LCP, INP, CLS)     | LCP <2.5s, INP <200ms, CLS <0.1 |
| **Backend API**  | Response time, throughput           | p95 <200ms, error rate <0.1%    |
| **Database**     | Query time, connection pool         | Slow query <100ms, no N+1       |
| **Python**       | Profiling (cProfile, line_profiler) | Hot path optimized              |
| **General**      | Memory, CPU, I/O                    | No leaks, low idle CPU          |

---

## 🛑 SOCRATIC GATE (Every Request)

| Type                     | Strategy       | Action                                              |
| ------------------------ | -------------- | --------------------------------------------------- |
| **New Feature / Build**  | Deep Discovery | Ask min. 3 strategic questions                      |
| **Code Edit / Bug Fix**  | Context Check  | Confirm impact area                                 |
| **Unclear / Vague**      | Clarification  | Ask purpose + user + scope                          |
| **"Continue" / "Do it"** | Execution      | Start immediately. Ask for irreversible operations. |

**Rules:**

1. After passing the gate → full implementation. Leaving half-done = FAIL.
2. After receiving answer, expand scope, don't narrow.
3. Spec-heavy request: ask trade-off / edge case, but then do everything.

---

## 🛡️ SAFETY GUARD (Dangerous Command Blocking)

**NEVER execute without explicit user confirmation:**

| Category | Commands | Risk |
|----------|----------|------|
| **Destructive Delete** | `rm -rf` with root/home paths, `Remove-Item -Recurse` on system dirs | Data loss |
| **Git Force** | `git push --force` to main/master, `git reset --hard` | History loss |
| **Database Drop** | `DROP TABLE`, `DROP DATABASE`, `TRUNCATE` | Data loss |
| **Permission Nuke** | `chmod 777`, `chmod -R 777` | Security breach |
| **Irreversible Publish** | `npm publish` (no unpublish after 72h) | Public exposure |
| **Pipe to Shell** | `curl \| bash`, `wget \| sh`, `iex (iwr ...)` | Remote code execution |
| **Process Kill** | `kill -9` on unknown PIDs, `Stop-Process -Force` | Service disruption |

**Rule:** If ANY of the above appears in a plan → STOP, explain the risk, ask for explicit confirmation. Never auto-execute.

## 🔧 CONFIG PROTECTION (Quality Config Integrity)

**NEVER weaken project quality configurations to bypass errors — fix the code instead.**

| Anti-Pattern | Why It's Bad | Correct Approach |
|-------------|-------------|-----------------|
| Disable ESLint/Prettier rules | Hides real bugs, degrades team standards | Fix the code that triggers the rule |
| Modify `tsconfig.json` strictness downward | Lets type errors slip through | Add proper types or use safe assertion |
| Add `// @ts-ignore` without documented reason | Silences compiler, creates tech debt | Fix the type issue, or document why ignore is necessary |
| Add `eslint-disable` without explanation | Accumulates silent rule bypasses | Fix the code, or add inline comment explaining why |
| Remove `"strict": true` from tsconfig | Disables entire TypeScript safety system | Never. Keep strict mode on. |
| Set `any` type broadly | Defeats TypeScript's purpose | Use `unknown` + type narrowing |

**Rule:** If a lint/type error blocks progress → fix the source code. If genuinely unfixable → add a documented exception with WHY.

---

## 🔌 MCP SERVERS (Optional Enhancements — NOT Required)

**The system works at full capacity WITHOUT any MCP servers.** MCP tools are optional enhancements that improve specific workflows.

### Graceful Degradation Rules

| Scenario | Behavior |
|----------|----------|
| **No MCP servers at all** | System operates normally using built-in skills, workflows, and local tools |
| **No Context7** | Use web search or local documentation instead |
| **No Playwright** | Skip browser tests, rely on unit tests |
| **No GitHub MCP** | Use local `git` CLI for version control. If `git` is not available, inform user and continue without versioning |

### MCP Installation Guidance (If User Wants Them)

| Principle | Rule |
|-----------|------|
| **Optional, Not Mandatory** | Never assume or require MCP servers. System must work without them. |
| **Quality > Quantity** | Max 3-6 MCP servers per workspace. Each must earn its slot. |
| **Global vs Domain** | Only universal tools go global. Domain-specific tools stay in domain config. |
| **No Bulk Install** | Never install "awesome-skills" packs wholesale. Cherry-pick what the project needs. |
| **Prefer Remote** | Use `serverUrl` (HTTPS) over `command` (stdio) when available — faster startup, no local deps. |
| **Verify Before Trust** | Only install MCP servers from official vendors or repos with 1000+ stars. |

### Version Control Fallback Chain

```
1. GitHub MCP → If available, use for PRs, issues, remote operations
2. Local git CLI → If no MCP, use git commands directly (commit, branch, log, diff)
3. No git at all → Warn user: "Git not found. Proceeding without version control."
                    Continue development normally. User's own risk.
```

**Never block development because a tool is missing. Inform and proceed.**

## 🚀 ANTIGRAVITY 2.0 COMPATIBILITY (May 2026+)

The platform split into two products. Be aware of the differences:

| Feature | Antigravity IDE | Antigravity 2.0 |
|---------|----------------|-----------------|
| **Purpose** | VS Code-based coding | Agent-first command center |
| **Agent Dir** | `.agents/` (default) | Dynamic subagents |
| **Best For** | Hands-on coding with AI assist | Multi-agent orchestration |

**Key 2.0 features to leverage:**
- **Dynamic Subagents** — IDE can spawn specialized sub-agents for parallel work
- **Manager Surface** — Monitor multiple agents from one dashboard
- **Scheduled Tasks** — Cron-like agent automation
- **Artifacts** — Structured agent outputs for human review

## 🧠 AGENT MEMORY & CONTINUITY

**Agents must not start from zero in every session.** To maintain context across long-running projects, use the `.agents/memory/` directory.

### Core Memory Files

If these files exist, read them before making architectural changes:
1. `architecture_context.md`: High-level system design, domain boundaries, and core dependencies.
2. `decision_log.md`: An append-only log of major technical decisions (ADRs) and *why* they were made.

### The Memory Rule
**When you make a significant design choice, fix a complex bug, or change the architecture:**
Do not just write the code. You MUST append an entry to `.agents/memory/decision_log.md` (create it if it doesn't exist). Include the Date, Context, Decision, and Consequences.

---
