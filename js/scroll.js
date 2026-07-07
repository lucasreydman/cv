/**
 * scroll.js — Lenis smooth scroll + GSAP choreography (Ink & Ember)
 *
 * Owns every scroll-driven behavior: hero entrance, scene reveals,
 * work-scene parallax, progress bar, nav active state, and the
 * atmosphere's scroll uniform. Content is never hidden by CSS, so a
 * missing GSAP/Lenis CDN degrades to a plain readable page.
 */

export function initScroll(atmosphere) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    // ── Lenis ───────────────────────────────────────────────
    let lenis = null;
    if (!reducedMotion && typeof window.Lenis !== 'undefined') {
        lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false });
        if (hasGsap) {
            gsap.registerPlugin(ScrollTrigger);
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        } else {
            const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
            requestAnimationFrame(raf);
        }
    } else if (hasGsap) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ── Anchor scrolling ────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.3 });
            else target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        });
    });

    // Without GSAP (or with reduced motion) the page stays static and readable.
    if (!hasGsap || reducedMotion) {
        if (atmosphere && !reducedMotion) trackScrollFallback(atmosphere);
        return lenis;
    }

    // ── Atmosphere scroll uniform + progress bar ────────────
    ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate(self) {
            if (atmosphere) atmosphere.setScrollProgress(self.progress);
        },
    });

    gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
    });

    // ── Hero entrance ───────────────────────────────────────
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });
    heroTl
        .from('.hero-status', { opacity: 0, y: 18, duration: 0.7 })
        .from('.hero-name .line-1', { opacity: 0, y: 90, duration: 1.0 }, '-=0.45')
        .from('.hero-name .line-2', { opacity: 0, y: 90, duration: 1.0 }, '-=0.8')
        .from('.hero-sub', { opacity: 0, y: 24, duration: 0.8 }, '-=0.55')
        .from('.hero-cta', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5');

    // Hero drifts up slightly as you leave it
    gsap.to('.hero-name', {
        yPercent: -10,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'bottom 85%', end: 'bottom 20%', scrub: true },
    });

    // ── Section heading reveals ─────────────────────────────
    document.querySelectorAll('.scene-heading, .contact-heading').forEach((el) => {
        gsap.from(el, {
            opacity: 0,
            y: 36,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
        });
    });

    // ── Work scenes ─────────────────────────────────────────
    document.querySelectorAll('.scene-work').forEach((scene) => {
        const name = scene.querySelector('.work-name');
        const meta = scene.querySelector('.work-meta');
        const bodyEls = scene.querySelectorAll('.work-desc, .chips, .tags, .arrow-link');

        // Name parallax: drifts against scroll for depth
        gsap.fromTo(name,
            { yPercent: 16 },
            {
                yPercent: -8,
                ease: 'none',
                scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true },
            }
        );

        gsap.from(meta, {
            opacity: 0,
            y: 16,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: scene, start: 'top 72%' },
        });

        gsap.from(bodyEls, {
            opacity: 0,
            y: 28,
            duration: 0.8,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: { trigger: scene, start: 'top 62%' },
        });
    });

    // ── Row / grid reveals ──────────────────────────────────
    const rowGroups = [
        ['.index-list', '.index-row'],
        ['.exp-list', '.exp-row'],
        ['.cred-lines', '.cred-line'],
        ['.cap-rows', '.cap-row'],
    ];
    rowGroups.forEach(([groupSel, rowSel]) => {
        const group = document.querySelector(groupSel);
        if (!group) return;
        gsap.from(group.querySelectorAll(rowSel), {
            opacity: 0,
            y: 26,
            duration: 0.75,
            stagger: 0.09,
            ease: 'power2.out',
            scrollTrigger: { trigger: group, start: 'top 82%' },
        });
    });

    [['.about-copy p', '.about-grid'], ['.about-photo', '.about-grid'],
     ['.cred-main', '.cred-main'], ['.exp-earlier', '.exp-earlier'],
     ['.contact-sub', '.contact'], ['.contact-grid', '.contact-grid'],
     ['.more-work h3', '.more-work']].forEach(([sel, trigger]) => {
        const els = document.querySelectorAll(sel);
        if (!els.length) return;
        gsap.from(els, {
            opacity: 0,
            y: 26,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: { trigger, start: 'top 82%' },
        });
    });

    // ── Nav: scrolled state + active link ───────────────────
    ScrollTrigger.create({
        start: 60,
        onUpdate(self) {
            document.querySelector('.navbar')?.classList.toggle('scrolled', self.scroll() > 60);
        },
    });

    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    document.querySelectorAll('main section[id]').forEach((section) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 45%',
            end: 'bottom 45%',
            onToggle(self) {
                if (!self.isActive) return;
                navLinks.forEach((l) =>
                    l.classList.toggle('active', l.getAttribute('href') === `#${section.id}`)
                );
            },
        });
    });

    return lenis;
}

/** No-GSAP path: still feed the shader its scroll uniform, cheaply. */
function trackScrollFallback(atmosphere) {
    let ticking = false;
    const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        atmosphere.setScrollProgress(max > 0 ? window.scrollY / max : 0);
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
}
