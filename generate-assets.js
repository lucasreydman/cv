/**
 * Asset generator — run once locally to produce:
 *   assets/og-image.png          (1200×630 OG card)
 *   assets/images/hero/hero_transparent.webp
 */

const sharp = require('sharp');
const path  = require('path');

const root = __dirname;

// ── OG Image ────────────────────────────────────────────────
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d0d1e"/>
      <stop offset="100%" stop-color="#07070f"/>
    </linearGradient>
    <radialGradient id="glow1" cx="15%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#6d5aed" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#07070f" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="85%" cy="60%" r="45%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#07070f" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Border -->
  <rect x="1" y="1" width="1198" height="628" fill="none" stroke="#6d5aed" stroke-opacity="0.15" stroke-width="1" rx="0"/>

  <!-- Left accent bar -->
  <rect x="80" y="190" width="4" height="250" rx="2" fill="#6d5aed"/>

  <!-- LR monogram circle -->
  <circle cx="980" cy="315" r="130" fill="#6d5aed" fill-opacity="0.07" stroke="#a78bfa" stroke-opacity="0.2" stroke-width="1"/>
  <text x="980" y="355" text-anchor="middle" font-family="system-ui,-apple-system,BlinkMacSystemFont,sans-serif" font-size="88" font-weight="800" fill="#a78bfa" fill-opacity="0.9">LR.</text>

  <!-- Name -->
  <text x="118" y="288" font-family="system-ui,-apple-system,BlinkMacSystemFont,sans-serif" font-size="68" font-weight="800" fill="#f0f0ff" letter-spacing="-1">Lucas Reydman</text>

  <!-- Role -->
  <text x="120" y="342" font-family="system-ui,-apple-system,BlinkMacSystemFont,sans-serif" font-size="26" font-weight="400" fill="#9090c0">Applied CS &amp; Management · Dalhousie University</text>

  <!-- Divider -->
  <line x1="120" y1="378" x2="580" y2="378" stroke="#6d5aed" stroke-opacity="0.35" stroke-width="1"/>

  <!-- URL -->
  <text x="120" y="412" font-family="system-ui,-apple-system,BlinkMacSystemFont,sans-serif" font-size="22" font-weight="500" fill="#6d5aed">lucasreydman.xyz</text>
</svg>`;

sharp(Buffer.from(svg))
  .png()
  .toFile(path.join(root, 'assets', 'og-image.png'))
  .then(info => console.log('✓ OG image →', 'assets/og-image.png', info))
  .catch(err => console.error('✗ OG image error:', err));

// ── Hero WebP ────────────────────────────────────────────────
sharp(path.join(root, 'assets', 'images', 'hero', 'hero_transparent.png'))
  .webp({ quality: 90, lossless: false, nearLossless: true })
  .toFile(path.join(root, 'assets', 'images', 'hero', 'hero_transparent.webp'))
  .then(info => console.log('✓ Hero WebP →', 'assets/images/hero/hero_transparent.webp', info))
  .catch(err => console.error('✗ Hero WebP error:', err));
