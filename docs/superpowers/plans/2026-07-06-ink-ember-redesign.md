# Ink & Ember Immersive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild lucasreydman.xyz as an immersive dark-only cinematic scroll experience with a persistent WebGL ink/smoke atmosphere, per the approved spec at `docs/superpowers/specs/2026-07-06-immersive-redesign-design.md`.

**Architecture:** One full-viewport WebGL canvas (domain-warped FBM "ink" fragment shader — single pass, no FBO ping-pong) driven by scroll progress and pointer through a narrow interface. DOM content sits above it: 7 scenes choreographed with GSAP ScrollTrigger + Lenis. All content is semantic HTML in reading order; the canvas is decorative only.

**Tech Stack:** Vanilla HTML/CSS/JS (no build step) · OGL 1.0.11 (ES module, jsDelivr) · GSAP 3.12.5 + ScrollTrigger · Lenis 1.1.20 · Fontshare (Clash Display, Satoshi) + Google Fonts (JetBrains Mono) · Vercel.

**Verification model:** This is a visual site with no unit-test infrastructure — verification is behavioral, per phase: local static server + Playwright (webapp-testing skill) screenshots, console-error checks, reduced-motion / WebGL-disabled passes, and Lighthouse. Commit after every task.

**Design skills:** Load `frontend-design` and `design-taste-frontend` before Phase 1; use `web-design-guidelines` + `webapp-testing` in Phase 5.

---

## Locked technical decisions

### CDN resources (exact)
```html
<!-- fonts (replaces Syne/Inter links) -->
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```
```js
// js/atmosphere.js
import { Renderer, Program, Mesh, Triangle } from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/src/index.js';
```
GSAP/Lenis classic `defer` script tags stay as-is and, per HTML spec ordering, execute before module scripts — modules may safely read `window.gsap` / `window.Lenis`.

### Design tokens (css/base.css)
```css
:root {
  --bg: #060608;
  --ink-2: #0c0c11;            /* raised surfaces */
  --text: #ECEAE5;
  --text-2: #9a9aa3;
  --steel: #6b7a94;             /* secondary/borders base */
  --border: rgba(236, 234, 229, 0.10);
  --ember: #FF4D00;
  --ember-soft: #ff7a3d;
  --font-display: 'Clash Display', 'Syne', sans-serif;
  --font-body: 'Satoshi', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

### atmosphere.js public interface
```js
initAtmosphere(canvas) -> { setScrollProgress(p /*0..1*/), setPointer(x, y, velocity), destroy() } | null
// returns null when WebGL unavailable -> caller adds .no-webgl to <html> (CSS gradient fallback)
```

### Shader concept + scroll color checkpoints (reviewer-requested, concrete)
Domain-warped FBM noise, 4 octaves, slow time drift; pointer adds local turbulence + glow.
Palette blend driven by `uScroll`:

| uScroll | Tint color | Intensity | Feel |
|---|---|---|---|
| 0.00 | `vec3(0.27, 0.35, 0.47)` steel blue | 0.55 | cool, vast (hero) |
| 0.45 | mix steel→ember `vec3(1.0, 0.30, 0.0)` | 0.40 | warming (work) |
| 1.00 | ember `vec3(1.0, 0.30, 0.0)` | 0.75, concentrated low | quiet glow (contact) |

Performance: DPR capped at `min(devicePixelRatio, 1.5)`; render at 0.75× resolution below 768px; `IntersectionObserver`/`visibilitychange` pauses RAF when hidden; shader time freezes under `prefers-reduced-motion`.

### File map after redesign
| File | Action | Responsibility |
|---|---|---|
| `index.html` | Rewrite body + head deltas | 7 scenes, semantic order; keep SEO/OG/JSON-LD (copy updated); remove theme-flash script + toggle |
| `css/main.css` | Keep | @import aggregator (bump `?v=`) |
| `css/base.css` | Rewrite | Tokens, reset, typography, grain, no-webgl gradient fallback, reduced-motion |
| `css/layout.css` | Rewrite | Nav + overlay menu, section shells, footer, scroll progress |
| `css/components.css` | Rewrite | Buttons, mono chips, tag rows, index rows, cursor, form, copy-email |
| `css/sections.css` | Rewrite | Hero, work scenes, experience list, about, credentials, capabilities, contact |
| `js/atmosphere.js` | Create | WebGL scene (interface above) |
| `js/scroll.js` | Create | Lenis + all GSAP choreography; drives `setScrollProgress` |
| `js/ui.js` | Create | Nav/overlay, cursor, email copy, contact form (port handler from main.js), entry point wiring |
| `js/main.js` | Delete | Replaced by the three modules |
| `api/contact` | Untouched | Existing serverless handler |

Script loading in `index.html`: keep GSAP/ScrollTrigger/Lenis defer tags → `<script type="module" src="js/ui.js?v=1">` (ui.js imports atmosphere.js and scroll.js).

---

## Copy deck (locked drafts — refine wording at build, keep facts/numbers exact)

**Hero** — status: `APPLIED CS & MANAGEMENT — DALHOUSIE · INCOMING ANALYST @ RBC`; H1: `Lucas Reydman`; identity line: "I build products where software, statistics, and AI-assisted development meet — and I ship them."; CTA: Download Resume (keep exact `download` filename).

**Flagship scenes**
1. **SHARPRFI** — "MLB first-inning betting research covering both sides of the NRFI/YRFI market. Two probability engines — a Poisson model and a batter-level Monte Carlo simulation — blend into one calibrated number for every game on the slate." Chips: `10,000 SIMS / GAME` · `1,344-GAME BACKTEST` · `2 ENGINES, 1 BLEND`. Tags: Next.js · TypeScript · Tailwind · Vercel KV. Link: sharprfi.vercel.app.
2. **Pride STEM Canada** — "The public home of a national 2SLGBTQ+ in STEM conference — registration, schedule, submissions, and sponsorship for delegates across Canada. As senior developer I led the architecture and owned the hardest parts: Stripe registration, Firebase auth, and the email pipeline." Chips: `250+ DELEGATES` · `SENIOR DEVELOPER` · `STRIPE + FIREBASE`. Tags: Next.js · React · Framer Motion · GitLab CI/CD. Link: psc-fsc.ca.
3. **QuickCash** — "An Android job marketplace connecting students with short-term work — role-based dashboards, location-aware search, applications, and PayPal payments. Built in a team of eight under strict TDD, refactored until static analysis had nothing left to say." Chips: `119 → 0 SONARQUBE ISSUES` · `TEAM OF 8` · `TDD + CI`. Tags: Java · Android · Firebase · Gradle.

**More work index** (name · one-liner · year · link)
- MLB BvP — Batter-vs-pitcher hit research for every MLB slate — 2026 — bvp-betting.vercel.app
- Fantasy Draft Lottery Simulator — Exact-odds lottery engine with a cinematic reveal — 2026 — GitHub Pages link
- wdinomf? — The final-grade calculator every student opens in April — 2025 — GitHub Pages link
- Tic Tec Toe — A research-paper feed with audio playback for academics — 2025 — (no public link; no anchor)

**Experience — featured (role · company · mono period · outcome line)**
1. Analyst, Global Functions Technology · RBC · `MAY 2026 —` · `INCOMING` badge, "Details soon."
2. Analyst, Financial Shared Services · RBC · `MAY–AUG 2025` · "Owned the invoice lifecycle for RBC's U.S. business units across SAP and Pega workflows."
3. Digital Solutions Intern · Torinit · `MAY–AUG 2024` · "Design-thinking POCs and data-backed digital strategy for client growth."
4. Founder & Head of Operations · Panther · `2021–2023` · "Built a student-events company to $40K+ revenue — sales, marketing, and operations."
5. R&D Intern · Mirabella Development · `SUMMER 2023` · "Market research and cross-functional coordination for a Toronto real-estate developer."

**Earlier (single line):** "Earlier: co-founded S&L Sports Camp (`$15K+` revenue) · Scale Hospitality · Over the Rainbow Ltd."

**About (2 paragraphs, first person)**
P1: "I'm an Applied Computer Science student at Dalhousie with one foot in the Faculty of Management — I like building software, and I like knowing why it should exist. Before I wrote much code I was running businesses: a student-events company that cleared $40K, a sports camp before that. That instinct — ship something real, charge for it, make it better — is still how I build."
P2: "Most of my work now happens alongside AI. I run agentic workflows with Claude Code daily and care about the craft of it: prompt design, tool use, knowing when to trust the machine and when not to. In May 2026 I join RBC's Global Functions Technology team."
Photo: `assets/images/hero/hero_transparent.png` with CSS duotone treatment (grayscale + ember gradient overlay, `mix-blend-mode`).

**Credentials strip**
- Dalhousie University — BSc Applied Computer Science + Certificate in Managing Data & Information — `2023–2027` — `GPA 3.91` · `DEAN'S LIST ×6`
- Community Leadership Scholarship · Ontario Scholar
- Lawrence Park CI — `94% AVG` Honor Roll · Bilingual Studies (one line)
- Footnote: "Certified: Agile & Scrum (365 Careers) · Prompt Engineering for Developers (DeepLearning.AI)" — keep certificate links.

**Capabilities (Build / AI / Lead, 6 each)**
- BUILD: TypeScript & React/Next.js · Java & Android · Node.js & REST APIs · SQL & Firebase · GSAP & modern CSS · Git + CI/CD
- AI: Claude Code & agentic workflows · Claude API & Anthropic SDK · Prompt engineering · AI code review & debugging · RAG & vector search · LLM evaluation
- LEAD: Entrepreneurship & venture building · Team leadership · Agile / Scrum · Strategic planning · Market & competitive research · Cross-functional collaboration

**Contact** — H2 "Let's talk." · line "Open to opportunities, collaborations, and good conversations." · email copy button (lucasreydman@gmail.com) · LinkedIn · existing form. Footer keeps the `curriculum vitae · "course of life"` note + © line.

---

## Phase 0 — Branch + skills

### Task 0: Setup
- [ ] `git checkout -b redesign`
- [ ] Invoke Skill `frontend-design` and Skill `design-taste-frontend` (guidance for all subsequent visual work)
- [ ] Start local server for verification: `npx serve -l 4173 .` (background)

## Phase 1 — Foundation (tokens, head, atmosphere)

### Task 1: Head + base.css tokens
**Files:** Modify `index.html` (head), Rewrite `css/base.css`
- [ ] Replace font links with Fontshare/JetBrains links above; remove theme-flash inline script; set `<html lang="en">` (drop `data-theme`); update meta description/OG copy minimally (same facts, new voice)
- [ ] Rewrite `base.css`: tokens, reset, type scale (`clamp()`-based display sizes), grain overlay, `.no-webgl` body gradient fallback, `prefers-reduced-motion` global block, selection/focus styles
- [ ] Temporary: leave old body markup in place (it will look broken-ugly; fine — replaced in Phase 3)
- [ ] Verify: page loads, new fonts render, no console errors
- [ ] Commit: `redesign: new tokens, fonts, dark-only head`

### Task 2: atmosphere.js (WebGL ink shader)
**Files:** Create `js/atmosphere.js`; Modify `index.html` (add `<canvas id="atmosphere">` after `<body>` open + module script tag); add canvas CSS to `base.css` (fixed, inset 0, z-index 0, `pointer-events: none`)
- [ ] Implement per locked interface: OGL fullscreen Triangle, FBM fragment shader (4 octaves, domain warp), uniforms `uTime, uRes, uScroll, uPointer, uVelocity`; palette checkpoints per table above
- [ ] WebGL-unavailable path returns null → caller sets `document.documentElement.classList.add('no-webgl')`
- [ ] DPR cap 1.5, sub-resolution below 768px, RAF pause on `visibilitychange`, reduced-motion freezes `uTime`
- [ ] Verify in browser: shader visible, cursor reacts, no errors; screenshot; force-disable WebGL (Playwright `--disable-webgl` args) → gradient fallback shows
- [ ] Commit: `redesign: WebGL ink atmosphere with fallback`

## Phase 2 — Shell (nav, layout, ui.js)

### Task 3: Navigation + layout + ui.js
**Files:** Rewrite `css/layout.css`; Create `js/ui.js`; Modify `index.html` (nav markup, footer markup)
- [ ] New minimal nav: `LR.` mark, 4 links (Work, Experience, About, Contact), resume icon-link; ≥44px targets; full-screen overlay menu <768px (button `aria-expanded`, focus trap, Esc closes)
- [ ] `ui.js`: entry module — imports atmosphere + scroll, wires pointer events → `setPointer`, nav/overlay logic, custom cursor (dot + `mix-blend-mode: difference` ring, desktop only), email copy button, contact form handler ported verbatim from `main.js` (`/api/contact` POST, status line)
- [ ] Delete `js/main.js`, remove its script tag; add module tag; keep GSAP/Lenis tags
- [ ] Verify: nav works with JS on and off, overlay menu on narrow viewport, form still posts (network tab), console clean
- [ ] Commit: `redesign: shell, nav, ui module; retire main.js`

## Phase 3 — Content scenes (markup + section CSS + copy)

### Task 4: Hero + About + Credentials + Capabilities + Experience + Contact markup/CSS
**Files:** Modify `index.html` (full `<main>` rewrite per copy deck), Rewrite `css/sections.css`, Rewrite `css/components.css`
- [ ] Rewrite `<main>` as 7 scenes in semantic reading order (hero → work → experience → about → credentials → capabilities → contact); all copy from deck; mono chips/labels; keep JSON-LD + update `knowsAbout`
- [ ] `sections.css`: viewport-scale hero type, work-scene layout (built Task 5), big-type experience list + earlier line, about with duotone photo, credentials strip, capabilities rows, full-viewport contact
- [ ] `components.css`: chips, tags, index rows, buttons, form, cursor
- [ ] Verify: full page reads correctly top-to-bottom with JS disabled (fallback ladder level 4); screenshot desktop + 375px
- [ ] Commit: `redesign: full content rewrite, 7 scenes`

### Task 5: Flagship work scenes
**Files:** Modify `index.html` (work section), `css/sections.css`
- [ ] Three `100vh` project scenes (SHARPRFI, Pride STEM, QuickCash) per copy deck + "More work" index rows with hover states
- [ ] Verify + screenshot; Commit: `redesign: flagship project scenes + index`

## Phase 4 — Choreography

### Task 6: scroll.js — Lenis + GSAP scenes
**Files:** Create `js/scroll.js`
- [ ] Lenis wired into `gsap.ticker` (same pattern as old main.js); ScrollTrigger defaults
- [ ] Hero entrance timeline; per-scene reveals; pinned scroll choreography for the 3 flagship scenes (pin + content swap/parallax); nav active-state; scroll progress bar; overall page progress → `atmosphere.setScrollProgress()`
- [ ] `prefers-reduced-motion`: skip pinning entirely, use plain fade reveals; IntersectionObserver fallback when GSAP CDN fails (port pattern from old main.js)
- [ ] Verify: full scroll-through recording/screenshots at key points; shader palette shifts at checkpoints; reduced-motion pass (Playwright `reducedMotion: 'reduce'`) shows stacked sections
- [ ] Commit: `redesign: scroll choreography + shader scroll link`

## Phase 5 — Hardening + verification + ship

### Task 7: Responsive + fallback hardening
- [ ] Pass at 1200 / 1100 / 900 / 768 / 480 widths; fix overflow, type scale, touch targets
- [ ] Re-run: no-WebGL, reduced-motion, no-JS passes
- [ ] Commit: `redesign: responsive + fallback hardening`

### Task 8: Review + audit
- [ ] Invoke Skill `web-design-guidelines` for compliance review of the new UI; fix findings
- [ ] Lighthouse (desktop + mobile) via Playwright/`npx lighthouse`; require Perf ≥ 90, A11y ≥ 95; fix regressions
- [ ] Commit fixes

### Task 9: Ship
- [ ] Update `CLAUDE.md` (design system, file map, behaviors — remove theme toggle, typewriter, carousel notes) and project memory
- [ ] Push `redesign` branch → confirm Vercel preview deployment builds and renders (vercel MCP: get deployment status)
- [ ] Merge `redesign` → `main`, push → production deploy; verify live at lucasreydman.xyz
- [ ] Final commit/report with before/after summary
