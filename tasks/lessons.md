## 2026-07-06 — Ink & Ember revision round

- **Never mix CSS `transition: opacity` with GSAP scroll reveals.** ScrollTrigger's
  refresh cycle (revert → measure → re-apply) reads computed styles while a CSS
  transition is still lagging, so the from() tween records ~0 as the natural opacity
  and the element stays invisible despite the trigger firing and the tween completing.
  Symptom: transform animates, opacity doesn't. Fix: keep opacity out of CSS
  transitions on revealed elements; use `filter: brightness()` for hover dims.
- **Content beats minimalism for this user.** The redesign initially cut experience
  bullets, skills detail, and project depth for editorial brevity; Lucas wanted the
  substance back. Default to preserving factual detail (bullets, tool lists, links)
  inside the new visual language rather than trimming it.
- **No invented-sounding stat chips.** "Team of 8", "TDD + CI", "2 engines one blend"
  read as filler to him. Chips must be facts a client would care about.
- **The site is a freelance-agentic-developer pitch first, resume second.**

## 2026-07-06 — De-slop pass (v2)

- **"Tasteful defaults" can still be slop in aggregate.** Clash Display + Satoshi +
  JetBrains Mono, mono-caps eyebrows, stroked-outline headlines, dark smoke + accent:
  each individually fine, together they pattern-match to AI-generated portfolios.
  The de-slop levers that actually worked: real product screenshots, ONE typeface
  (Archivo variable, width axis as the display voice), a 12-col grid, sentence case
  everywhere, and a background derived from real data (1,344 backtest points).
- **Premultiplied-alpha canvases need premultiplied fragment output** (color * alpha),
  or every transparent pixel renders at full brightness and alpha tuning does nothing.
- **Film grain reads as static/starfield on flat dark backgrounds** — it only worked
  over the smoke shader. Texture must match the ground it sits on.
