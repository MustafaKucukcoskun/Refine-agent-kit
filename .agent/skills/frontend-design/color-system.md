# Color System Reference

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 1. Color Theory Fundamentals

### Color Relationships

| Scheme                  | How to Create                      | When to Use            |
| ----------------------- | ---------------------------------- | ---------------------- |
| **Monochromatic**       | ONE hue, vary lightness/saturation | Minimal, professional  |
| **Analogous**           | 2-3 ADJACENT hues                  | Harmonious, calm       |
| **Complementary**       | OPPOSITE hues                      | High contrast, vibrant |
| **Split-Complementary** | Base + 2 adjacent to complement    | Dynamic but balanced   |
| **Triadic**             | 3 EQUIDISTANT hues                 | Vibrant, playful       |

**Choose by:** Mood (calm→analogous, bold→complementary) · Count (minimal→mono) · Audience (conservative→mono, young→triadic)

---

## 2. The 60-30-10 Rule

- **60% PRIMARY** — Background, large areas (neutral/calming)
- **30% SECONDARY** — Cards, sections, headers (supports)
- **10% ACCENT** — CTAs, highlights (attention-grabbing)

```css
:root {
  --color-bg: /* 60% neutral */;
  --color-surface: /* slightly different from bg */;
  --color-secondary: /* 30% muted */;
  --color-accent: /* 10% vibrant */;
}
```

---

## 3. Color Selection by Context

| Project Type            | Hues                   | Why                |
| ----------------------- | ---------------------- | ------------------ |
| Finance/Tech/Healthcare | Blues, Teals           | Trust, stability   |
| Eco/Wellness            | Greens, Earth          | Growth, organic    |
| Food/Energy/Youth       | Orange, Yellow         | Warmth, excitement |
| Luxury/Beauty           | Deep Teal, Gold, Black | Premium            |
| Urgency/Sales           | Red, Orange            | Action, attention  |

> ⚠️ **Purple — AI default, use with caution.** Do not choose without explicit user request: as AI's #1 default color, it signals "AI-generated output." However, if intentionally chosen as a brand color (Twitch, Figma, GitHub etc.) it's fine.

**Selection:** Industry → Hue family → Light/dark mode → ASK USER → Confirm

---

## 4. Palette Generation Principles

### From a Single Color (HSL Method)

Instead of memorizing hex codes, learn to **manipulate HSL**:

```
HSL = Hue, Saturation, Lightness

Hue (0-360): The color family
  0/360 = Red
  60 = Yellow
  120 = Green
  180 = Cyan
  240 = Blue
  300 = Purple

Saturation (0-100%): Color intensity
  Low = Muted, sophisticated
  High = Vibrant, energetic

Lightness (0-100%): Brightness
  0% = Black
  50% = Pure color
  100% = White
```

### Generating a Full Palette

Given ANY base color, create a scale:

```
Lightness Scale:
  50  (lightest) → L: 97%
  100            → L: 94%
  200            → L: 86%
  300            → L: 74%
  400            → L: 66%
  500 (base)     → L: 50-60%
  600            → L: 48%
  700            → L: 38%
  800            → L: 30%
  900 (darkest)  → L: 20%
```

### Saturation Adjustments

| Context                    | Saturation Level                     |
| -------------------------- | ------------------------------------ |
| **Professional/Corporate** | Lower (40-60%)                       |
| **Playful/Youth**          | Higher (70-90%)                      |
| **Dark Mode**              | Reduce by 10-20%                     |
| **Accessibility**          | Ensure contrast, may need adjustment |

---

## 5. Context-Based Selection Guide

### Instead of Copying Palettes, Follow This Process:

**Step 1: Identify the Context**

```
What type of project?
├── E-commerce → Need trust + urgency balance
├── SaaS/Dashboard → Need low-fatigue, data focus
├── Health/Wellness → Need calming, natural feel
├── Luxury/Premium → Need understated elegance
├── Creative/Portfolio → Need personality, memorable
└── Other → ASK the user
```

**Step 2: Select Primary Hue Family**

```
Based on context, pick ONE:
- Blue family (trust)
- Green family (growth)
- Warm family (energy)
- Neutral family (elegant)
- OR ask user preference
```

**Step 3: Decide Light/Dark Mode**

```
Consider:
- User preference?
- Industry standard?
- Content type? (text-heavy = light preferred)
- Time of use? (evening app = dark option)
```

**Step 4: Generate Palette Using Principles**

- Use HSL manipulation
- Follow 60-30-10 rule
- Check contrast (WCAG)
- Test with actual content

---

## 6. Dark Mode Principles

### Key Rules (No Fixed Codes)

1. **Never pure black** → Use very dark gray with slight hue
2. **Never pure white text** → Use 87-92% lightness
3. **Reduce saturation** → Vibrant colors strain eyes in dark mode
4. **Elevation = brightness** → Higher elements slightly lighter

### Contrast in Dark Mode

```
Background layers (darker → lighter as elevation increases):
Layer 0 (base)    → Darkest
Layer 1 (cards)   → Slightly lighter
Layer 2 (modals)  → Even lighter
Layer 3 (popups)  → Lightest dark
```

### Adapting Colors for Dark Mode

| Light Mode             | Dark Mode Adjustment          |
| ---------------------- | ----------------------------- |
| High saturation accent | Reduce saturation 10-20%      |
| Pure white background  | Dark gray with brand hue tint |
| Black text             | Light gray (not pure white)   |
| Colorful backgrounds   | Desaturated, darker versions  |

---

## 7. Accessibility Guidelines

### Contrast Requirements (WCAG)

| Level          | Normal Text | Large Text |
| -------------- | ----------- | ---------- |
| AA (minimum)   | 4.5:1       | 3:1        |
| AAA (enhanced) | 7:1         | 4.5:1      |

### How to Check Contrast

1. **Convert colors to luminance**
2. **Calculate ratio**: (lighter + 0.05) / (darker + 0.05)
3. **Adjust until ratio meets requirement**

### Safe Patterns

| Use Case             | Guideline                         |
| -------------------- | --------------------------------- |
| **Text on light bg** | Use lightness 35% or less         |
| **Text on dark bg**  | Use lightness 85% or more         |
| **Primary on white** | Ensure dark enough variant        |
| **Buttons**          | High contrast between bg and text |

---

## 8. Color Selection Checklist

Before finalizing any color choice, verify:

- [ ] **Asked user preference?** (if not specified)
- [ ] **Matches project context?** (industry, audience)
- [ ] **Follows 60-30-10?** (proper distribution)
- [ ] **WCAG compliant?** (contrast checked)
- [ ] **Works in both modes?** (if dark mode needed)
- [ ] **NOT your default/favorite?** (variety check)
- [ ] **Different from last project?** (avoid repetition)

---

## 9. Anti-Patterns to Avoid

### ❌ DON'T:

- Copy the same hex codes every project
- Default to purple/violet (AI tendency)
- Default to dark mode + neon (AI tendency)
- Use pure black (#000000) backgrounds
- Use pure white (#FFFFFF) text on dark
- Ignore user's industry context
- Skip asking user preference

### ✅ DO:

- Generate fresh palette per project
- Ask user about color preferences
- Consider industry and audience
- Use HSL for flexible manipulation
- Test contrast and accessibility
- Offer light AND dark options

---

> **Remember**: Colors are decisions, not defaults. Every project deserves thoughtful selection based on its unique context.
