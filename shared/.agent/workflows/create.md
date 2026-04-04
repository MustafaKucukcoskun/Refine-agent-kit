---
description: Create new application command. Triggers App Builder skill and starts interactive dialogue with user.
---

# /create - Create Application

$ARGUMENTS

---

## Task

This command starts a new application creation process.

### Steps:

0. **Constraint Envelope Discovery (First)**
   - Classify constraints as hard/soft/open
   - Hard: security, compliance, performance budget, accessibility
   - Soft: libraries, style preferences, implementation conventions
   - Open: areas where innovation is welcome
   - Avoid rigid diktats (for example fixed colors/components) unless user explicitly requires them

1. **Request Analysis**
   - Understand what the user wants
   - If information is missing, use `brainstorming` skill to ask focused questions
   - Define target outcome (user/business impact), not only feature list

2. **Project Planning**
   - Use `project-planner` agent for task breakdown
   - Determine tech stack
   - Plan file structure
   - Generate at least 3 viable solution directions (conservative, balanced, frontier)
   - Create plan file with trade-off rationale and proceed to building after user alignment

3. **Application Building (After Approval)**
   - Orchestrate with `app-builder` skill
   - Coordinate expert agents:
     - `database-architect` → Schema
     - `backend-specialist` → API
     - `frontend-specialist` → UI
   - For user-facing experiences, propose domain-fit concept options before locking visuals

4. **Preview**
   - Start with `auto_preview.py` when complete
   - Present URL to user

5. **Quality Gates**
   - Confirm correctness, security, performance, maintainability, and test coverage scope
   - If any gate fails, loop back to planning/building with explicit fixes

---

## Usage Examples

```
/create blog site
/create e-commerce app with product listing and cart
/create todo app
/create Instagram clone
/create crm system with customer management
```

---

## Before Starting

If request is unclear, ask these questions:

- What type of application?
- What are the basic features?
- Who will use it?

Use defaults, add details later.
