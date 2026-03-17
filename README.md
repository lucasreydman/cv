# Lucas Reydman. Portfolio

A premium, animated personal portfolio website. Dark-first design with cinematic motion, GSAP-powered scroll choreography, and Lenis smooth scroll.

## Tech Stack

- **HTML5 / CSS3 / Vanilla JS** — no framework
- **GSAP 3.12.5 + ScrollTrigger** — hero entrance sequence, scroll-triggered stagger reveals
- **Lenis 1.1.20** — smooth scroll, integrated with GSAP ticker
- **Font Awesome 6** — icons
- **Google Fonts** — Syne (display headings) + Inter (body)

## Features

- Dark-first design with full light-mode support (flash-prevention inline script)
- Cinematic full-viewport hero with animated radial-gradient aura + blueprint grid
- GSAP hero entrance timeline (staggered: eyebrow → name → subtitle → CTA → photo)
- ScrollTrigger reveals — timeline cards slide from sides, grids stagger up
- Lenis smooth scroll with GSAP ticker integration
- Glass-morphism cards with mouse-position spotlight effect
- Custom cursor (dot + lagging ring) and cursor spotlight
- Floating glass navbar — transparent → frosted on scroll, active section indicator
- Typewriter subtitle cycling 5 phrases
- Experience alternating timeline with glowing pulsing dots
- Scroll progress bar, scroll-to-top button, GitHub link
- Speech bubble on hero photo hover (desktop only)
- Grain overlay via CSS SVG filter
- Full graceful fallback to IntersectionObserver if GSAP/Lenis fail to load
- `prefers-reduced-motion` support

## File Structure

```
cv/
├── assets/
│   ├── favicon/
│   │   ├── logo-1024x1024.png   # Source logo
│   │   ├── favicon.ico          # 16/32/48 multi-size
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── apple-touch-icon.png # 180x180
│   │   ├── android-192x192.png
│   │   ├── android-512x512.png
│   │   └── site.webmanifest
│   ├── images/
│   │   ├── logos/               # Company + education logos
│   │   └── hero/
│   └── resume.pdf
├── css/
│   ├── main.css        # @import aggregator
│   ├── base.css        # Design tokens, reset, typography, grain
│   ├── layout.css      # Navbar, sections, footer
│   ├── components.css  # Cards, buttons, cursor, fixed UI
│   └── sections.css    # Hero, timeline, projects, contact
├── js/
│   └── main.js         # Lenis + GSAP + all interactions
├── index.html
└── README.md
```

## Design System

| Token | Value |
|---|---|
| `--bg` | `#07070f` |
| `--accent` | `#6d5aed` |
| `--accent-2` | `#a78bfa` |
| `--accent-3` | `#38bdf8` |
| `--text` | `#f0f0ff` |
| Heading font | Syne 700/800 |
| Body font | Inter 400/500/600 |

Light mode overrides all tokens via `[data-theme="light"]` on `<html>`.

## Content Sections

- **Hero** — name, typewriter role, resume download, floating photo
- **About** — personal summary with highlighted keywords
- **Experience** — 7 positions in alternating timeline (RBC incoming, RBC FSS, Torinit, Mirabella, Panther, Scale Hospitality, Over the Rainbow)
- **Education** — Dalhousie University + Lawrence Park CI
- **Honors & Awards** — 6 cards (Agile cert, GPT cert, Dean's List ×6, Community Leadership, Ontario Scholar, Bilingual)
- **Skills** — carousel with 4 cards (Technical, AI & Productivity, Business & Leadership, Tools & Platforms), 10 items each, auto-advances every 3.6s with progress bar indicators
- **Projects** — 4 cards (Pride STEM Canada, QuickCash, Tic Tec Toe, wdinomf?)
- **Contact** — email + LinkedIn

## Responsiveness

| Breakpoint | Changes |
|---|---|
| `< 1200px` | Reduced container padding |
| `< 900px` | Timeline collapses to single column |
| `< 768px` | Hero stacks vertically, hamburger nav, mobile card layouts |
| `< 480px` | Further padding/font reductions |

## Browser Support

Chrome 121+, Firefox, Safari, Edge, iOS Safari, Android Chrome.
`scrollbar-width: none` handles Firefox; `-webkit-scrollbar` covers Chrome/Safari.

## Author

**Lucas Reydman** | Applied Computer Science & Management, Dalhousie University
[lucas.reydman@dal.ca](mailto:lucas.reydman@dal.ca) · [LinkedIn](https://www.linkedin.com/in/lucasreydman) · [GitHub](https://github.com/lucasreydman)

## License

MIT
