# Lucas Reydman — Portfolio (cv)

A premium animated personal portfolio website. Dark-first, single-page, no build step — pure HTML/CSS/JS with CDN dependencies.

## Tech Stack

- **Vanilla HTML5 / CSS3 / JS** — no framework, no bundler
- **GSAP 3.12.5 + ScrollTrigger** — scroll choreography and hero entrance
- **Lenis 1.1.20** — smooth scroll, wired into GSAP ticker
- **Font Awesome 6** — icons (CDN)
- **Google Fonts** — Syne (headings) + Inter (body)

No build step. Edit files directly.

## File Map

```
index.html          Single-page portfolio — all sections, meta/OG tags
css/
  main.css          @import aggregator (loads the four modules below in order)
  base.css          CSS variables, reset, typography, grain overlay, skip-link, reduced-motion
  layout.css        Navbar, hamburger, sections grid, footer, scroll progress bar
  components.css    Cards, buttons, custom cursor, spotlight, scroll-to-top
  sections.css      Hero, timeline, education, honors, skills carousel, projects, contact
js/
  main.js           All runtime logic — theme, Lenis, GSAP, typewriter,
                    speech bubble, cursor, skills carousel, details animation
assets/
  favicon/          Favicons + site.webmanifest (PWA)
  images/hero/      hero_transparent.png
  images/logos/     Company/school/project logos (PNG, 52×52 display)
  resume.pdf        Downloadable resume
vercel.json         Vercel config — www redirect, security headers, asset caching
sitemap.xml         Search engine sitemap
robots.txt          Crawler directives
```

## Design System

| Token | Value |
|---|---|
| `--bg` | `#07070f` |
| `--accent` | `#6d5aed` |
| `--accent-2` | `#a78bfa` |
| `--accent-3` | `#38bdf8` |
| `--text` | `#f0f0ff` |
| Heading | Syne 700/800 |
| Body | Inter 400/500/600 |

Light mode overrides all tokens via `[data-theme="light"]` on `<html>`.

## Key Behaviors in main.js

- **Theme** — persisted in `localStorage`, flash-prevention inline script in `<head>`
- **Lenis + GSAP** — Lenis RAF wired into `gsap.ticker`; `ScrollTrigger.scroller` set to Lenis instance
- **Typewriter** — cycles 5 role phrases with typing/deleting animation
- **Skills carousel** — auto-advances every 3.6s, progress bar dots, pauses on hover; dots are `<button>` elements with `aria-pressed` synced in `updateDots()`
- **Custom cursor** — dot + lagging ring; disabled at `< 768px`
- **Speech bubble** — hero photo hover, desktop only (`< 768px` hidden)
- **Graceful fallback** — IntersectionObserver used if GSAP/Lenis CDN fails

## Accessibility

- All interactive elements use `:focus-visible` rings — never `outline: none` without a replacement
- Touch targets are ≥ 44×44px (nav controls, fixed buttons)
- Skip navigation link (`<a class="skip-link" href="#main">`) at top of `<body>`; styled in `base.css`
- Skills carousel dots are `<button>` elements with `aria-label` and `aria-pressed`
- `prefers-reduced-motion` respected — disables all animations including grain overlay

## Sections

| Section | Notes |
|---|---|
| Hero | GSAP entrance sequence; `hero-cv-note` fades in last (Latin definition of CV) |
| About | 4 paragraphs, staggered GSAP reveal (`stagger: 0.15`) |
| Experience | 7-item alternating timeline; slide-in from left/right |
| Education | Expandable `<details>` with smooth height animation in `initDetailsAnimation()` |
| Honors | 6 cards in auto-fit grid |
| Skills | 3D carousel, 4 cards, swipe/click/dot navigation |
| Projects | Full-width stacked cards with skill tags (tooltips via `data-tooltip`) |
| Contact | Centered pill-style link cards |

## Responsiveness Breakpoints

| Breakpoint | Change |
|---|---|
| `< 1200px` | Reduced container padding |
| `< 1100px` | Hero image shrinks, speech bubble repositioned above image |
| `< 900px` | Timeline collapses to single column |
| `< 768px` | Vertical hero stack, hamburger nav, native cursor, speech bubble hidden |
| `< 480px` | Further font/padding reductions |

## Deployment

Vercel — push to `main` deploys automatically. Live at **https://lucasreydman.xyz**.

## Common Tasks

- **Add/update content** — edit `index.html` directly (all sections are inline)
- **Style changes** — edit the relevant CSS module (`sections.css` for section-specific, `components.css` for reusable UI)
- **Animation changes** — edit `js/main.js`; GSAP timelines are self-contained functions
- **Add a logo** — drop PNG into `assets/images/logos/` and reference it in `index.html`
- **Update resume** — replace `assets/resume.pdf`
- **Add a nav link** — add `<li><a href="#id">Label</a></li>` to `.nav-links` in `index.html`

## SEO

- **Title tag**: "Lucas Reydman — Software Developer & CS Student"
- **JSON-LD Person schema** in `<head>`: includes `name`, `url`, `email`, `image`, `description`, `jobTitle`, `worksFor`, `alumniOf`, `sameAs` (LinkedIn, GitHub, site), `knowsAbout`
- **`<link rel="me">`** tags for LinkedIn and GitHub — identity verification for Google Knowledge Graph
- **Google Search Console**: domain verified via DNS TXT record (Vercel), sitemap submitted at `https://lucasreydman.xyz/sitemap.xml`

## Things That Don't Exist (don't add them back)

- No `.github-link` — the fixed GitHub source button was intentionally removed; CSS and JS are already clean of it
