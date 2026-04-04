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
