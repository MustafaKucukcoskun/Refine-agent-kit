# UX Psychology Principles

Core psychological laws that drive effective interface design. Apply these BEFORE visual decisions.

---

## Cognitive Load Laws

### Hick's Law
**More choices = longer decision time (logarithmic).**

- Limit primary actions to 3-5 per screen
- Use progressive disclosure for complex options
- Group related items to reduce perceived choices
- Default selections reduce cognitive effort

### Miller's Law
**Working memory holds ~7 (±2) items.**

- Navigation: max 7 top-level items
- Form sections: group into chunks of 5-7 fields
- Lists without grouping: cap at 7 visible items
- Use categories/tabs to manage larger sets

### Cognitive Load Theory
**Intrinsic (task complexity) + Extraneous (UI complexity) + Germane (learning).**

- Minimize extraneous load: remove decorative elements that don't aid understanding
- Reduce intrinsic load: break complex tasks into steps (wizards, progress bars)
- Support germane load: use consistent patterns so users learn once

---

## Motor & Interaction Laws

### Fitts's Law
**Time to reach a target = f(distance / target size).**

- Primary actions: large click targets (min 44×44px touch, 32×32px desktop)
- Destructive actions: small and distant from primary path
- Related actions: group spatially to reduce travel
- Corner/edge placement on desktop: effectively infinite target size

### Steering Law
**Navigating through a constrained path takes longer.**

- Dropdown menus: avoid deep nested submenus
- Mega menus: prefer grid layouts over narrow cascading lists
- Touch: avoid precision-dependent interactions (small toggles, narrow sliders)

---

## Perception Laws

### Gestalt Principles

| Principle | Rule | UI Application |
|-----------|------|---------------|
| **Proximity** | Close items = related | Group form labels near their inputs |
| **Similarity** | Similar look = same function | Consistent button styles per action type |
| **Continuity** | Eye follows smooth paths | Align elements along clear visual lines |
| **Closure** | Brain completes incomplete shapes | Card borders can be implied, not drawn |
| **Figure-Ground** | Foreground vs background separation | Modals: dim background to focus dialog |

### Von Restorff Effect (Isolation Effect)
**Distinct items are remembered better.**

- Primary CTA should visually stand apart (color, size, weight)
- Don't make everything bold — if everything stands out, nothing does
- Use sparingly: 1 highlight per section maximum

### Serial Position Effect
**First and last items in a list are remembered best.**

- Put critical nav items first and last
- Middle items get least attention — don't hide important actions there

---

## Behavioral Patterns

### Jakob's Law
**Users spend most time on OTHER sites. They expect yours to work the same.**

- Follow established conventions (logo top-left, search top-right, nav horizontal or left sidebar)
- Innovation in function, not in navigation patterns
- When in doubt, match the user's mental model from dominant competitors

### Doherty Threshold
**Productivity spikes when response time < 400ms.**

- Perceived performance matters: skeleton screens, optimistic updates
- If real response > 400ms, show loading indicator immediately
- Instant feedback on user actions (button press states, form validation)

### Peak-End Rule
**Users judge experience by its peak moment and its ending.**

- Invest in delight at key moments (successful checkout, onboarding completion)
- End flows with positive confirmation, not abrupt redirects
- Error recovery should feel smooth, not punishing

### Zeigarnik Effect
**Incomplete tasks are remembered better than complete ones.**

- Progress indicators drive completion (profile 70% complete, 3/5 steps done)
- Don't show progress unless users can act on it

---

## Decision Framework

When making UI decisions, check in this order:

1. **Does it reduce cognitive load?** (Hick's, Miller's)
2. **Is the target easy to reach?** (Fitts's)
3. **Does it follow conventions?** (Jakob's)
4. **Is feedback immediate?** (Doherty)
5. **Does grouping make sense?** (Gestalt)
6. **Is the standout element truly important?** (Von Restorff)
