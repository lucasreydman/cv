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
- Skills carousel with 3D perspective, auto-advance every 3.6s, progress bar dots, hover-to-pause
- Scroll progress bar, scroll-to-top button, GitHub link
- Speech bubble on hero photo hover (desktop only)
- Grain overlay via CSS SVG filter
- Full graceful fallback to IntersectionObserver if GSAP/Lenis fail to load
- `prefers-reduced-motion` support

## File Structure

```
cv/
├── .github/
│   └── workflows/
│       └── static.yml              # GitHub Actions — auto-deploy to GitHub Pages on push to main
├── .gitignore                      # Git ignore rules
├── .hintrc                         # webhint config — suppresses scrollbar-width compat warning
├── LICENSE                         # MIT license
├── README.md
├── index.html                      # Single-page portfolio — all sections, meta tags, OG tags, structured data
├── assets/
│   ├── favicon/
│   │   ├── logo-1024x1024.png      # Source logo (used to generate all sizes below)
│   │   ├── favicon.ico             # Multi-size ICO (16/32/48) for legacy browsers
│   │   ├── favicon-16x16.png       # Standard small favicon
│   │   ├── favicon-32x32.png       # Standard large favicon
│   │   ├── apple-touch-icon.png    # 180x180 — iOS home screen bookmark icon
│   │   ├── android-192x192.png     # Android home screen icon
│   │   ├── android-512x512.png     # Android high-res / splash screen icon
│   │   └── site.webmanifest        # PWA manifest — app name, icons, theme color, display mode
│   ├── images/
│   │   ├── hero/
│   │   │   └── hero_transparent.png    # Hero section portrait (transparent background)
│   │   └── logos/                      # All company, school, and project logos (PNG, 52x52 display)
│   │       ├── rbc.png
│   │       ├── torinit_technologies_inc.png
│   │       ├── mirabella_development_corporation.png
│   │       ├── panther.png
│   │       ├── scale_hospitality.png
│   │       ├── over_the_rainbow_ltd.png
│   │       ├── sl_sports_camp.png
│   │       ├── dalhousie_university.png
│   │       ├── lawrence_park_collegiate_institute.png
│   │       ├── pride_stem_canada.png
│   │       ├── quickcash.png
│   │       ├── tic_tec_toe.png
│   │       └── wdinomf.png
│   └── resume.pdf                  # Downloadable resume (linked from hero CTA)
├── css/
│   ├── main.css                    # @import aggregator — loads the four modules below in order
│   ├── base.css                    # CSS custom properties, reset, typography, grain overlay, reduced-motion
│   ├── layout.css                  # Navbar, hamburger, sections grid, footer, scroll progress bar
│   ├── components.css              # Cards, buttons, custom cursor, spotlight, scroll-to-top, GitHub link
│   └── sections.css                # Hero, about, experience timeline, education, honors, skills carousel, projects, contact
└── js/
    └── main.js                     # All runtime logic — theme, Lenis, GSAP animations, typewriter, speech bubble, cursor, carousel, details animation
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
- **Honors & Awards** — 6 cards (Agile cert, GPT cert, Dean's List x6, Community Leadership, Ontario Scholar, Bilingual)
- **Skills** — carousel with 4 cards (Technical, AI & Productivity, Business & Leadership, Tools & Platforms), 10 items each, auto-advances every 3.6s with progress bar indicators
- **Projects** — 4 cards (Pride STEM Canada, QuickCash, Tic Tec Toe, wdinomf?)
- **Contact** — email + LinkedIn

## Responsiveness

| Breakpoint | Changes |
|---|---|
| `< 1200px` | Reduced container padding |
| `< 1100px` | Hero image shrinks, speech bubble repositioned above image |
| `< 900px` | Timeline collapses to single column |
| `< 768px` | Hero stacks vertically, hamburger nav, mobile card layouts, native cursor restored, speech bubble hidden |
| `< 480px` | Further padding/font reductions |

## Browser Support

Chrome 121+, Firefox, Safari, Edge, iOS Safari, Android Chrome.
`scrollbar-width: none` handles Firefox; `-webkit-scrollbar` covers Chrome/Safari.

## Author

**Lucas Reydman** | Applied Computer Science & Management, Dalhousie University
[lucas.reydman@dal.ca](mailto:lucas.reydman@dal.ca) · [LinkedIn](https://www.linkedin.com/in/lucasreydman) · [GitHub](https://github.com/lucasreydman)

## License

MIT
