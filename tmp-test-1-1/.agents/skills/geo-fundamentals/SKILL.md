---
name: geo-fundamentals
description: Generative Engine Optimization — structure content to be CITED by AI search engines (ChatGPT, Claude, Perplexity, Gemini). NOT geographic/location data. Use when publishing blog posts, documentation, or knowledge base content that should be quoted by AI models. Covers entity definitions, structured data, citation-friendly formatting, AI engine landscape. Keywords: GEO, AI SEO, AI citations, ChatGPT visibility, Perplexity ranking, llms.txt, AI-friendly content.
allowed-tools: Read, Glob, Grep, Bash
---

# GEO Fundamentals — Generative Engine Optimization

> ⚠️ **Not about geography.** GEO = Generative Engine Optimization (being cited by AI search engines).

## When to Use vs. Skip

| ✅ Use when | ❌ Skip when |
|---|---|
| Publishing blog, docs, or research content | Internal-only content (no public exposure) |
| You want AI models (ChatGPT, Claude, Perplexity) to cite you | Traditional SEO rankings are the primary KPI |
| Launching a developer-facing knowledge base | Content is paywalled / behind auth |
| Building a "llms.txt" for LLM consumption | Team has no metrics infrastructure to measure AI citations |

## Relationship to SEO

| Aspect | SEO | GEO |
|---|---|---|
| Goal | #1 Google ranking | AI model citations |
| Optimize for | Keywords, backlinks | Entities, structured data, authority |
| Measure | Rankings, CTR, impressions | Citation rate, AI-referral traffic |
| Overlap | Schema markup, page speed, HTTPS | Both benefit from these |

**GEO and SEO are complementary, not competing.** If you do SEO well, you're 60% of the way to GEO.

---

## 1. What is GEO?

**GEO** = Generative Engine Optimization

| Goal | Platform |
|------|----------|
| Be cited in AI responses | ChatGPT, Claude, Perplexity, Gemini |

### SEO vs GEO

| Aspect | SEO | GEO |
|--------|-----|-----|
| Goal | #1 ranking | AI citations |
| Platform | Google | AI engines |
| Metrics | Rankings, CTR | Citation rate |
| Focus | Keywords | Entities, data |

---

## 2. AI Engine Landscape

| Engine | Citation Style | Opportunity |
|--------|----------------|-------------|
| **Perplexity** | Numbered [1][2] | Highest citation rate |
| **ChatGPT** | Inline/footnotes | Custom GPTs |
| **Claude** | Contextual | Long-form content |
| **Gemini** | Sources section | SEO crossover |

---

## 3. RAG Retrieval Factors

How AI engines select content to cite:

| Factor | Weight |
|--------|--------|
| Semantic relevance | ~40% |
| Keyword match | ~20% |
| Authority signals | ~15% |
| Freshness | ~10% |
| Source diversity | ~15% |

---

## 4. Content That Gets Cited

| Element | Why It Works |
|---------|--------------|
| **Original statistics** | Unique, citable data |
| **Expert quotes** | Authority transfer |
| **Clear definitions** | Easy to extract |
| **Step-by-step guides** | Actionable value |
| **Comparison tables** | Structured info |
| **FAQ sections** | Direct answers |

---

## 5. GEO Content Checklist

### Content Elements

- [ ] Question-based titles
- [ ] Summary/TL;DR at top
- [ ] Original data with sources
- [ ] Expert quotes (name, title)
- [ ] FAQ section (3-5 Q&A)
- [ ] Clear definitions
- [ ] "Last updated" timestamp
- [ ] Author with credentials

### Technical Elements

- [ ] Article schema with dates
- [ ] Person schema for author
- [ ] FAQPage schema
- [ ] Fast loading (< 2.5s)
- [ ] Clean HTML structure

---

## 6. Entity Building

| Action | Purpose |
|--------|---------|
| Google Knowledge Panel | Entity recognition |
| Wikipedia (if notable) | Authority source |
| Consistent info across web | Entity consolidation |
| Industry mentions | Authority signals |

---

## 7. AI Crawler Access

### Key AI User-Agents

| Crawler | Engine |
|---------|--------|
| GPTBot | ChatGPT/OpenAI |
| Claude-Web | Claude |
| PerplexityBot | Perplexity |
| Googlebot | Gemini (shared) |

### Access Decision

| Strategy | When |
|----------|------|
| Allow all | Want AI citations |
| Block GPTBot | Don't want OpenAI training |
| Selective | Allow some, block others |

---

## 8. Measurement

| Metric | How to Track |
|--------|--------------|
| AI citations | Manual monitoring |
| "According to [Brand]" mentions | Search in AI |
| Competitor citations | Compare share |
| AI-referred traffic | UTM parameters |

---

## 9. Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Publish without dates | Add timestamps |
| Vague attributions | Name sources |
| Skip author info | Show credentials |
| Thin content | Comprehensive coverage |

---

> **Remember:** AI cites content that's clear, authoritative, and easy to extract. Be the best answer.

---

## Script

| Script | Purpose | Command |
|--------|---------|---------|
| `scripts/geo_checker.py` | GEO audit (AI citation readiness) | `python scripts/geo_checker.py <project_path>` |

