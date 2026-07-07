# Lucas Reydman — Portfolio (cv)

An immersive, dark-only, single-page portfolio ("Ink & Ember" design). No build step — pure HTML/CSS/JS with CDN dependencies. A persistent WebGL ink/smoke shader lives behind the whole page and evolves with scroll.

## Tech Stack

- **Vanilla HTML5 / CSS3 / JS (ES modules)** — no framework, no bundler
- **OGL 1.0.11** — WebGL atmosphere shader (jsDelivr `+esm` single-bundle import)
- **GSAP 3.12.5 + ScrollTrigger** — scroll choreography and hero entrance
- **Lenis 1.1.20** — smooth scroll, wired into GSAP ticker
- **Fontshare** — Clash Display (display) + Satoshi (body); **Google Fonts** — JetBrains Mono (data)

No `package.json` (gitignored). No build step. Edit files directly.

## File Map

```
index.html          Single page — 7 scenes, meta/OG tags, JSON-LD
css/
  main.css          @import aggregator (kept for tooling; index.html links the
                    four modules below directly in parallel for performance)
  base.css          Tokens, reset, typography, grain, atmosphere canvas + no-webgl
                    fallback, skip-link, reduced-motion
  layout.css        Navbar, mobile overlay menu, scene shells, footer, progress bar
  components.css    Buttons, chips, tags, index rows, copy-email, contact form
  sections.css      Hero, work scenes, experience list, about, credentials,
                    capabilities, contact
js/
  ui.js             Entry module — wires atmosphere (via non-blocking proxy),
                    scroll, overlay menu, copy email, contact form (/api/contact)
  atmosphere.js     WebGL scene — initAtmosphere(canvas) -> { setScrollProgress,
                    setPointer, destroy } | null (null -> html.no-webgl gradient)
  scroll.js         Lenis + all GSAP choreography, nav state, progress bar
api/contact.js      Serverless contact-form handler (Vercel)
assets/             resume.pdf, favicons, images/logos, images/hero
docs/superpowers/   Design spec + implementation plan for the redesign
```

Script order in `index.html` matters: GSAP/ScrollTrigger/Lenis load as classic `defer` scripts **before** the `type="module"` ui.js — the HTML spec guarantees document-order execution, so `window.gsap` is safe inside modules.

## Design System — "Ink & Ember" v2 (post de-slop pass)

| Token | Value |
|---|---|
| `--bg` | `#060608` (ink) |
| `--text` | `#eceae5` (warm off-white) |
| `--ember` | `#ff4d00` (single accent, used sparingly) |
| `--steel` | `#8b9bb4` (secondary tone) |
| Typeface | **Archivo variable only** (Google Fonts, wdth+wght axes) |
| Display voice | `font-stretch: 112–125%`, weight 640–780 |
| Body voice | normal width, 400/500/600; `tabular-nums` everywhere |

Dark only, no theme toggle. 2px radius system (6px on media). 12-col grid
(`repeat(12, 1fr)`, max 1360px). **Sentence case everywhere** — no uppercase
tracking labels, no mono font, no grain overlay, no stroked-outline text, no
boxed stat chips. These were removed in the de-slop pass because they
pattern-match to AI-generated portfolios; do not reintroduce them. Real product
screenshots (`assets/images/screens/*.webp`, captured from the live sites) are
the visual centerpiece of the projects section.

**Background**: `atmosphere.js` renders 1,344 whisper-faint drifting points
(one per SHARPRFI backtest game, ~6% ember) — data-derived, not decorative
smoke. The canvas is premultiplied-alpha: fragment shaders must output
`color * alpha` or opacity is ignored.

## Positioning

The site is **promotional for Lucas's freelance work as an agentic developer** — hero
tagline, About, contact pitch, and all meta/OG copy carry that framing. FBI Basketball
(client work, fbi-basketball.com) leads the projects section as the proof point.

## Scenes (in order)

| Scene | Notes |
|---|---|
| Hero | Name at viewport scale (solid line 1, stroked line 2), status `Dalhousie Computer Science & Management`, freelance-agentic tagline, resume CTA |
| Projects | FBI Basketball (client work, first), SHARPRFI, Pride STEM Canada as ~76vh scenes (fuller copy + factual chips only), then a 5-row "More projects" index (MLB BvP, Fantasy Draft Lottery Simulator, QuickCash, wdinomf?, Tic Tec Toe) |
| Experience | Big-type list: RBC GFT (Current badge, bullets), RBC FSS, Torinit, Panther, Mirabella — each with 3-4 detail bullets and linked company names |
| About | First-person copy (freelance framing) + full-color photo |
| Credentials | Education + honors merged; GPA 3.91 and Dean's List ×6 as big stats; coursework detail line |
| Capabilities | Build / AI / Lead / Tools rows, 8-10 items each |
| Contact | "Let's talk." + freelance pitch line + copy-email + LinkedIn/GitHub + form |

## Key Behaviors

- **Atmosphere** — `atmosphere.js` renders a domain-warped FBM ink shader; scroll progress shifts palette steel-blue → ember (checkpoints in the fragment shader); pointer velocity injects turbulence. DPR capped at 1.5, reduced resolution < 768px, pauses when tab hidden.
- **Fallback ladder** — (1) no WebGL/CDN failure → `html.no-webgl` static CSS gradients; (2) `prefers-reduced-motion` → still shader frame, no GSAP animation; (3) mobile → cheaper shader; (4) no JS → semantic readable page. Content is never hidden by CSS — GSAP sets initial states, so a dead CDN degrades gracefully.
- **ui.js proxy** — the scroll module receives a forwarding proxy for the atmosphere so OGL loading never blocks choreography or first paint.
- **Contact form** — posts JSON to `/api/contact` (unchanged serverless handler).
- **GSAP owns `opacity` on revealed elements** — never add a CSS `transition` that
  includes `opacity` to anything animated by a scroll reveal. A lagging CSS transition
  poisons ScrollTrigger's refresh (revert → measure → re-apply) cycle, and the from()
  tween records ~0 as the element's natural opacity, leaving it invisible forever.
  Use `filter: brightness()` for hover-dim effects instead (see `.index-row`).

## Accessibility (Lighthouse a11y = 1.0 — keep it there)

- `:focus-visible` rings everywhere; never remove an outline without a replacement
- ≥ 44px touch targets; skip link; DOM order = visual order
- Overlay menu: `aria-expanded`, Esc closes, focus restored
- `aria-live` on form status and copy-email confirmation
- `prefers-reduced-motion` disables shader animation, pinning, and grain

## Copy rules (from design skills — enforced)

- **Zero em-dashes anywhere in visible copy** (use commas, colons, periods)
- Max one `·` separator per line; no decorative status dots
- No scroll-cue labels, no section-number eyebrows, minimal mono eyebrows (≤ 3 per page)
- Numbers/stats are real (10,000 sims, 1,344-game backtest, 119→0 SonarQube, $40K+)

## Responsiveness

| Breakpoint | Change |
|---|---|
| `< 1100px` | About grid stacks |
| `< 900px` | Credentials/capabilities/contact grids stack; experience period moves above role |
| `< 768px` | Overlay menu; cheaper shader; alt work scenes lose right alignment at 600px |
| `< 600px` | Capabilities single column, form rows stack |

## Deployment

Vercel — custom domain **lucasreydman.xyz**. Push to `main` = production deploy; branches/PRs get previews. Config in `vercel.json` (also sets the resume `Content-Disposition` filename). `.github/workflows/static.yml` is a dead leftover from GitHub Pages.

## Common Tasks

- **Content** — edit `index.html` (all copy inline; respect the copy rules above)
- **Styling** — edit the relevant CSS module; bump the `?v=` query on the four CSS links in `index.html`
- **Animation** — `js/scroll.js` (choreography) or `js/atmosphere.js` (shader)
- **Shader palette** — the scroll checkpoints live in the fragment shader in `atmosphere.js`
- **Resume** — replace `assets/resume.pdf`

## Things That Don't Exist (don't add them back)

- No light theme / theme toggle, no typewriter, no speech bubble, no skills carousel,
  no custom cursor, no scroll-to-top button, no Font Awesome, no `.github-link`,
  no card-grid layouts — these were all removed intentionally in the 2026-07 redesign
