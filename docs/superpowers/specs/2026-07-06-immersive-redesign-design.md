# Immersive Redesign — "Ink & Ember"

**Date:** 2026-07-06
**Status:** Approved by Lucas (brainstorming session)
**Scope:** Complete UI overhaul + full content rethink of lucasreydman.xyz

## Goal

Replace the current dark-purple glass-card portfolio with an immersive, WebGL-powered,
cinematic single-page experience. Rebuild the visual layer and rewrite the content;
keep the no-build vanilla stack, the deployment pipeline, the accessibility baseline,
and the SEO infrastructure.

## Decisions made (with user)

| Decision | Choice |
|---|---|
| Start fresh vs iterate | Rebuild visual layer + content against existing infrastructure; no framework rewrite |
| Design direction | Immersive/expressive |
| Tech ceiling | Full WebGL (not CSS-only, not hero-only hybrid) |
| Theming | Dark only — light theme and toggle removed |
| Palette | Proposed by Claude, approved: "Ink & Ember" |
| Content scope | Full content rethink — rewrite copy, re-weight sections, cut weak items |
| Architecture | Cinematic scroll story (one continuous narrative, persistent WebGL atmosphere) |

## Visual concept — "Ink & Ember"

### Atmosphere
One full-viewport WebGL canvas behind the entire page running a slow fluid
"ink in dark water" shader — smoke drifting in near-blackness, lit from within.

- **Cursor-reactive:** pointer velocity injects turbulence and a faint glow trail.
- **Scroll-linked:** color temperature, density, and motion evolve across the page —
  cool and vast in the hero, warming through the work section, settling to a quiet
  ember glow at contact.
- One continuous living background; no per-section decorations.

### Palette
| Token | Value | Role |
|---|---|---|
| Ink base | `#060608` | Page background (darker, less purple than current navy) |
| Type | `#ECEAE5` | Warm off-white body/display text |
| Accent | `#FF4D00` family (ember orange) | Links, live data, emphasis, warm shader tones — used sparingly |
| Secondary | Desaturated steel blue | Secondary text, borders |

### Typography (replaces Syne/Inter)
| Role | Face | Source |
|---|---|---|
| Display | Clash Display | Fontshare CDN |
| Body | Satoshi | Fontshare CDN |
| Data | JetBrains Mono | Google Fonts |

Mono is an identity move: dates, GPAs, stats, section labels, and tags render in
JetBrains Mono (`3.91 GPA`, `10,000 sims/game`, `1,344-game backtest`) — the
analytics/probability work becomes a visual signature.

### Texture
Film-grain overlay rebuilt, subtler — unifies WebGL layer with DOM content.

## Content architecture — 7-scene scroll story

Projects move to position 2 and become the centerpiece.

### 1 — Hero
- Name at viewport scale (10–12vw Clash Display).
- Mono status line: `Applied CS & Management @ Dalhousie · Incoming Analyst @ RBC`.
- One written human identity line replaces the typewriter effect.
- Resume download button stays.
- Headshot moves to About; speech bubble cut.

### 2 — Selected Work
- Three flagship projects as full-viewport pinned scenes with scroll choreography:
  **SHARPRFI**, **Pride STEM Canada**, **QuickCash**.
- Each scene: huge project name, 2-sentence rewritten description, three mono stat
  chips (e.g. `10,000 sims/game`, `250+ delegates`, `119→0 SonarQube issues`),
  tight tag row, live link.
- Below: **"More work" index** — BvP, Fantasy Draft Lottery Simulator, wdinomf?,
  Tic Tec Toe as one-line hover rows (name · one-liner · year · link).

### 3 — Experience
- Alternating timeline cards replaced by a big-type list.
- **Featured (5):** RBC incoming, RBC 2025, Torinit, Panther (led by `$40K+ revenue`),
  Mirabella — role, mono period, one or two outcome lines each.
- **Earlier (one line each):** S&L Sports Camp, Scale Hospitality, Over the Rainbow.
- Nothing deleted from history; re-weighted.

### 4 — About
- Rewritten from scratch: first person, two short paragraphs, human voice.
- Story: entrepreneur-who-codes + AI-assisted development (Claude Code, agentic
  workflows) as the differentiator. Resume-speak removed.
- Photo lives here with a WebGL/duotone treatment.

### 5 — Credentials (Education + Honors merged)
- Dalhousie Applied CS + Managing Data & Information certificate.
- Mono stats: `GPA 3.91`, `Dean's List ×6`.
- Community Leadership Scholarship, Ontario Scholar.
- High school collapses to one line.
- Udemy/DeepLearning certificates become a small footnote row.

### 6 — Capabilities (Skills rethought)
- 40-bullet carousel replaced by curated statement in three groups:
  **Build / AI / Lead**, ~6 strongest items each, bold type rows with mono tags.
- Full keyword coverage stays in resume PDF and meta tags.

### 7 — Contact
- Full-viewport closing scene: huge "Let's talk" type over ember-glow shader.
- Email copy button, LinkedIn, contact form (existing handler carried over as-is).
- `curriculum vitae · "course of life"` Latin note stays as footer sign-off.

### Navigation
- "LR." mark + four links (Work, Experience, About, Contact).
- Full-screen overlay menu on mobile. Theme toggle removed.
- Scroll progress indicator kept, restyled.

## Technical architecture

### Stack (no build step, CDN dependencies)
- **OGL (~35KB)** for WebGL, loaded as ES module pinned to exact version.
  Chosen over Three.js (~150KB) — sufficient for fluid shader, cursor turbulence,
  duotone photo treatment.
- **GSAP 3.12 + ScrollTrigger** and **Lenis** stay for choreography/smooth scroll.

### JS modules (replaces single main.js)
| File | Owns |
|---|---|
| `js/atmosphere.js` | WebGL scene; canvas lifecycle; exposes `setScrollProgress()` and `setPointer()` |
| `js/scroll.js` | All GSAP scene choreography |
| `js/ui.js` | Nav, overlay menu, cursor, email copy, contact form |

Scroll and cursor drive the atmosphere only through the exposed interface.

### CSS
Rewritten fresh in the same four-module layout (`base/layout/components/sections`)
with new tokens; `main.css` aggregator unchanged.

### Fallback ladder
1. **No WebGL / shader crash** → static layered CSS gradient background; all else identical.
2. **`prefers-reduced-motion`** → shader freezes to still frame; pinned scenes become
   normal stacked sections; reveals become simple fades.
3. **Mobile / low power** → shader at reduced resolution, DPR capped at 1.5,
   paused when tab hidden; pinned scenes simplify below 768px.
4. **No JS** → semantic HTML in reading order, fully legible. Content never lives
   inside the canvas.

### Preserved infrastructure
- Accessibility: skip link, `:focus-visible` rings, ≥44px touch targets,
  DOM order = visual order, aria attributes.
- SEO: meta/OG/Twitter tags and JSON-LD retained, updated for new copy.
- Vercel deployment, custom domain, analytics/speed-insights scripts.
- Contact form handler as-is.

## Rollout & verification

- Built on a `redesign` branch → Vercel preview deploy reviewed against production
  before merge to `main`.
- Verification: Playwright screenshots at all five breakpoints (1200/1100/900/768/480),
  reduced-motion pass, WebGL-disabled pass, Lighthouse ≥90 performance.

## Out of scope

- Framework/bundler migration.
- Light theme.
- New sections or new content beyond re-presentation of existing material.
- Resume PDF changes.
