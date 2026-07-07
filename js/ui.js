/**
 * ui.js — Entry module (Ink & Ember)
 *
 * Wires the atmosphere, scroll choreography, nav/overlay menu,
 * email copy, and the contact form. Loaded as an ES module after
 * the deferred GSAP/Lenis classic scripts (HTML spec guarantees
 * document-order execution), so window.gsap is safe to read.
 */

import { initAtmosphere } from './atmosphere.js';
import { initScroll } from './scroll.js';

// ── Atmosphere ─────────────────────────────────────────────
// The shader must never block first paint or choreography, so the
// scroll module gets a forwarding proxy and OGL loads in the background.

let atmosphere = null;
const atmosphereProxy = {
    setScrollProgress(p) { atmosphere?.setScrollProgress(p); },
    setPointer(x, y, v) { atmosphere?.setPointer(x, y, v); },
};

initAtmosphere(document.getElementById('atmosphere')).then((atmo) => {
    if (!atmo) {
        document.documentElement.classList.add('no-webgl');
        return;
    }
    atmosphere = atmo;
    let lastX = null, lastY = null;
    window.addEventListener('pointermove', (e) => {
        if (lastX !== null) {
            const v = Math.hypot(e.clientX - lastX, e.clientY - lastY);
            atmosphere.setPointer(e.clientX, e.clientY, v);
        }
        lastX = e.clientX;
        lastY = e.clientY;
    }, { passive: true });
});

// ── Scroll choreography ────────────────────────────────────

initScroll(atmosphereProxy);

// ── Mobile overlay menu ────────────────────────────────────

(function initMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    let previousFocus = null;

    const setOpen = (open) => {
        links.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
            previousFocus = document.activeElement;
            links.querySelector('a')?.focus();
        } else if (previousFocus) {
            previousFocus.focus();
            previousFocus = null;
        }
    };

    toggle.addEventListener('click', () => {
        setOpen(!links.classList.contains('open'));
    });

    links.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', () => setOpen(false))
    );

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && links.classList.contains('open')) setOpen(false);
    });
})();

// ── Copy email ─────────────────────────────────────────────

(function initCopyEmail() {
    const btn = document.getElementById('copy-email-btn');
    if (!btn) return;
    const confirmEl = btn.querySelector('.copy-confirm');
    const hintEl = btn.querySelector('.copy-hint');

    btn.addEventListener('click', async () => {
        const email = btn.querySelector('.copy-email-text').textContent.trim();
        try {
            await navigator.clipboard.writeText(email);
            hintEl.style.display = 'none';
            confirmEl.textContent = 'Copied';
        } catch {
            confirmEl.textContent = 'Copy failed';
        }
        setTimeout(() => {
            confirmEl.textContent = '';
            hintEl.style.display = '';
        }, 2000);
    });
})();

// ── Contact form (posts to /api/contact) ───────────────────

(function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('.contact-submit-btn');
        const status = form.querySelector('.contact-form-status');
        const btnText = btn.querySelector('.btn-text');

        btn.disabled = true;
        btnText.textContent = 'Sending';
        status.textContent = '';
        status.className = 'contact-form-status';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name.value.trim(),
                    email: form.email.value.trim(),
                    message: form.message.value.trim(),
                }),
            });

            if (res.ok) {
                status.textContent = "Message sent. I'll get back to you soon.";
                status.className = 'contact-form-status success';
                form.reset();
            } else {
                throw new Error();
            }
        } catch {
            status.textContent = 'Something went wrong. Try emailing me directly.';
            status.className = 'contact-form-status error';
        } finally {
            btn.disabled = false;
            btnText.textContent = 'Send message';
        }
    });
})();
