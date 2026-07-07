# next-web Domain Rules

## Activation Condition

"next" dependency present in package.json.

## Font Preference

- Geist → first choice
- Inter → acceptable alternative
- Roboto, Arial → FORBIDDEN

## MCP Selection Protocol

Do not call multiple UI MCPs simultaneously. Decide which one is needed first:

- Generate new component → 21st-dev-magic
- Install/modify existing shadcn component → shadcn MCP
- Animation/motion component → @magicuidesign/mcp

## Skill Loading Order

P0 (always): nextjs-react-expert, nextjs-app-router-patterns
P1 (if UI task): frontend-design, tailwind-patterns
P2 (if specifically requested): seo-fundamentals, geo-fundamentals

## Primary Agent

frontend-specialist
