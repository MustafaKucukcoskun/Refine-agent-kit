---
description: Coordinate multiple agents for complex tasks. Use for multi-perspective analysis, comprehensive reviews, or tasks requiring different domain expertise running in parallel workspaces.
---

# Multi-Agent Orchestration

You are now in **ORCHESTRATION MODE**. Your task: plan and coordinate specialized agents to solve this complex problem.

## Task to Orchestrate
$ARGUMENTS

---

## CRITICAL: Minimum Agent Requirement

> ORCHESTRATION = MINIMUM 3 DIFFERENT AGENTS
>
> If you use fewer than 3 agents, you are NOT orchestrating — you're just delegating.
>
> **Validation before completion:**
> - Count agents used
> - If `agent_count < 3` -> STOP and include more agents
> - Single agent = FAILURE of orchestration

### Agent Selection Matrix

| Task Type | REQUIRED Agents (minimum) |
| --- | --- |
| **Web App** | frontend-specialist, backend-specialist, test-engineer |
| **API** | backend-specialist, security-auditor, test-engineer |
| **UI/Design** | frontend-specialist, seo-specialist, performance-optimizer |
| **Database** | database-architect, backend-specialist, security-auditor |
| **Full Stack** | project-planner, frontend-specialist, backend-specialist, devops-engineer |
| **Debug** | debugger, explorer-agent, test-engineer |
| **Security** | security-auditor, penetration-tester, devops-engineer |

---

## Pre-Flight: Mode Check

| Current Mode | Task Type | Action |
| --- | --- | --- |
| **plan** | Any | Proceed with planning-first approach |
| **edit** | Simple execution | Proceed directly |
| **edit** | Complex/multi-file | Ask: "This task requires planning. Switch to plan mode?" |
| **ask** | Any | Ask: "Ready to orchestrate. Switch to edit or plan mode?" |

---

## STRICT 2-PHASE ORCHESTRATION

### PHASE 1: PLANNING (Sequential — NO parallel agents)

| Step | Agent | Action |
| --- | --- | --- |
| 1 | `project-planner` | Create docs/PLAN.md |
| 2 | (optional) `explorer-agent` | Codebase discovery if needed |

> NO OTHER AGENTS during planning! Only project-planner and explorer-agent.

### CHECKPOINT: User Approval

```
After PLAN.md is complete, ASK:

"Plan created: docs/PLAN.md

Do you approve? (Y/N)
- Y: Start implementation
- N: I'll revise the plan"
```

> DO NOT proceed to Phase 2 without explicit user approval!

### PHASE 2: IMPLEMENTATION (After approval — choose execution model)

#### Step 2a: Choose Execution Model

Based on task dependencies, choose how agents will work:

| Task Dependencies | Execution Model | How |
| --- | --- | --- |
| Independent subtasks | **Parallel Workspaces** | Agent Manager spawns isolated workspaces |
| Each step depends on previous | **Sequential Chain** | Agents run one at a time in shared context |
| Mix of independent + dependent | **Hybrid Groups** | Parallel groups with sequential gates |

#### Step 2b: Set Up Handoff (Parallel/Hybrid only)

For parallel execution, create the `_handoff/` directory:

```
_handoff/
  orchestrator/
    plan.md           # Execution plan with agent assignments
    assignments.md    # Expected inputs/outputs per agent
  {agent-name}/
    status.md         # PENDING | IN_PROGRESS | DONE | BLOCKED
    output.md         # Agent's deliverable
    issues.md         # Blockers, questions
    artifacts/        # Generated files (schemas, configs)
```

#### Step 2c: Execute Agents

**Parallel Workspaces (independent tasks):**

```
Recommend Agent Manager to spawn:
  Workspace 1: database-architect  -- schema design
  Workspace 2: security-auditor    -- auth architecture review

After both complete:
  Workspace 3: backend-specialist  -- API implementation
  Workspace 4: frontend-specialist -- UI components

After all implementation:
  Workspace 5: test-engineer       -- integration tests
```

**Sequential Chain (dependent tasks):**

```
Use explorer-agent to map affected code paths.
Based on those findings, use debugger for root cause analysis.
Then use test-engineer to write regression tests.
Finally use [domain-agent] to implement the fix.
```

**Hybrid Groups:**

```
Group 1 (Parallel — Foundation):
  Spawn: database-architect + security-auditor

Gate: Both complete

Group 2 (Parallel — Core):
  Spawn: backend-specialist + frontend-specialist

Gate: Both complete

Group 3 (Sequential — Verification):
  test-engineer -> devops-engineer
```

## Available Agents (21 total)

| Agent | Domain | Use When |
| --- | --- | --- |
| `project-planner` | Planning | Task breakdown, PLAN.md |
| `explorer-agent` | Discovery | Codebase mapping |
| `frontend-specialist` | UI/UX | React, Vue, CSS, HTML |
| `backend-specialist` | Server | API, Node.js, Python |
| `database-architect` | Data | SQL, NoSQL, Schema |
| `security-auditor` | Security | Defensive audit, OWASP |
| `security-specialist` | Security | Full-spectrum assessment |
| `penetration-tester` | Security | Offensive testing, red team |
| `test-engineer` | Testing | Unit, E2E, Coverage |
| `qa-automation-engineer` | QA | CI pipelines, quality gates |
| `devops-engineer` | Ops | CI/CD, Docker, Deploy |
| `mobile-developer` | Mobile | React Native, Flutter |
| `performance-optimizer` | Speed | Lighthouse, Profiling |
| `seo-specialist` | SEO | Meta, Schema, Rankings |
| `documentation-writer` | Docs | README, API docs |
| `debugger` | Debug | Error analysis |
| `game-developer` | Games | Unity, Godot, Phaser |
| `code-archaeologist` | Legacy | Legacy analysis, refactoring |
| `product-manager` | Product | PRD, user stories |
| `product-owner` | Product | Backlog, acceptance criteria |
| `orchestrator` | Meta | Coordination |

---

## Orchestration Protocol

### Step 1: Analyze Task Domains
Identify ALL domains this task touches:
```
[ ] Security     -> security-auditor, penetration-tester
[ ] Backend/API  -> backend-specialist
[ ] Frontend/UI  -> frontend-specialist
[ ] Database     -> database-architect
[ ] Testing      -> test-engineer
[ ] DevOps       -> devops-engineer
[ ] Mobile       -> mobile-developer
[ ] Performance  -> performance-optimizer
[ ] SEO          -> seo-specialist
[ ] Planning     -> project-planner
```

### Step 2: Phase Detection

| If Plan Exists | Action |
| --- | --- |
| NO `docs/PLAN.md` | Go to PHASE 1 (planning only) |
| YES `docs/PLAN.md` + user approved | Go to PHASE 2 (implementation) |

### Step 3: Execute Based on Phase

**PHASE 1 (Planning):**
```
Use the project-planner agent to create PLAN.md
-> STOP after plan is created
-> ASK user for approval
```

**PHASE 2 (Implementation — after approval):**
```
1. Choose execution model (parallel/sequential/hybrid)
2. Set up _handoff/ if using parallel
3. Execute agents per chosen model
4. Synthesize results
```

**CRITICAL: Context Passing (MANDATORY)**

When invoking ANY subagent, you MUST include:

1. **Original User Request:** Full text of what user asked
2. **Decisions Made:** All user answers to Socratic questions
3. **Previous Agent Work:** Summary of what previous agents did
4. **Current Plan State:** If plan files exist in workspace, include them

**Example with FULL context:**
```
Use the project-planner agent to create PLAN.md:

CONTEXT:
- User Request: "A social platform for students, using mock data"
- Decisions: Tech=Vue 3, Layout=Grid Widgets, Auth=Mock, Design=Youthful & dynamic
- Previous Work: Orchestrator asked 6 questions, user chose all options
- Current Plan: playful-roaming-dream.md exists in workspace with initial structure

TASK: Create detailed PLAN.md based on ABOVE decisions. Do NOT infer from folder name.
```

> VIOLATION: Invoking subagent without full context = subagent will make wrong assumptions!

### Step 4: Verification (MANDATORY)
The LAST agent must run appropriate verification scripts:
```bash
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
python .agent/skills/lint-and-validate/scripts/lint_runner.py .
```

### Step 5: Synthesize Results
Combine all agent outputs into unified report.

---

## Output Format

```markdown
## Orchestration Report

### Task
[Original task summary]

### Execution Model
[Parallel Workspaces / Sequential Chain / Hybrid — and why this model was chosen]

### Agents Invoked (MINIMUM 3)
| # | Agent | Focus Area | Status |
| --- | --- | --- | --- |
| 1 | project-planner | Task breakdown | DONE |
| 2 | frontend-specialist | UI implementation | DONE |
| 3 | test-engineer | Verification | DONE |

### Handoff Artifacts
- _handoff/orchestrator/plan.md
- _handoff/frontend-specialist/output.md
- _handoff/test-engineer/output.md

### Verification Scripts Executed
- [x] security_scan.py -> Pass/Fail
- [x] lint_runner.py -> Pass/Fail

### Key Findings
1. **[Agent 1]**: Finding
2. **[Agent 2]**: Finding
3. **[Agent 3]**: Finding

### Deliverables
- [ ] PLAN.md created
- [ ] Code implemented
- [ ] Tests passing
- [ ] Scripts verified

### Summary
[One paragraph synthesis of all agent work]
```

---

## EXIT GATE

Before completing orchestration, verify:

1. **Agent Count:** `invoked_agents >= 3`
2. **Scripts Executed:** At least `security_scan.py` ran
3. **Report Generated:** Orchestration Report with all agents listed
4. **Handoff Clean:** All `_handoff/{agent}/status.md` show DONE or issues documented

> **If any check fails -> DO NOT mark orchestration complete. Invoke more agents or run scripts.**

---

**Begin orchestration now. Analyze the task, choose execution model, select 3+ agents, run verification scripts, synthesize results.**
