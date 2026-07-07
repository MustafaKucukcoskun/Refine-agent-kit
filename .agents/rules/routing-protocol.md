## INTELLIGENT AGENT ROUTING (STEP 2 — AUTOMATIC)

**Automatically select and announce an agent BEFORE every request.**

### ROUTING CHECKLIST (MANDATORY before every code response)

| # | Check | On Failure → |
|---|-------|-------------|
| 1 | Is the correct agent domain identified? | STOP. Analyze. |
| 2 | Was the agent .md file READ? | STOP. Open and read `.agent/agents/{agent}.md`. |
| 3 | Was `Applying @[agent]...` written? | STOP. Add it. |
| 4 | Were the skills from agent frontmatter loaded? | STOP. Read `skills:`. |

- Coding without agent selection = **PROTOCOL VIOLATION**
- Ignoring agent rules = **QUALITY FAILURE**

> Follow the `@[skills/intelligent-routing]` protocol.
