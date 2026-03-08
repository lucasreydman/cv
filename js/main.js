/**
 * Portfolio — main.js
 * Lenis smooth scroll + GSAP animations + interactive polish
 */

// ═══════════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════════

function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateHeroImage(next);
    });

    // Apply saved/system theme (HTML default is dark; inline script handles flash prevention)
    const saved = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = saved || (prefersLight ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    updateHeroImage(theme);
}

function updateHeroImage(theme) {
    const img = document.querySelector('.hero-image');
    if (!img) return;
    img.style.filter = theme === 'dark'
        ? 'drop-shadow(0 20px 40px rgba(109, 90, 237, 0.25)) brightness(1.05)'
        : 'drop-shadow(0 16px 32px rgba(91, 77, 214, 0.18))';
}

// ═══════════════════════════════════════════════════════════════
// LENIS — smooth scroll
// ═══════════════════════════════════════════════════════════════

function initLenis() {
    if (typeof Lenis === 'undefined') return null;

    const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false,
    });

    // Tie into GSAP ticker if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    } else {
        // Fallback RAF loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    return lenis;
}

// ═══════════════════════════════════════════════════════════════
// SMOOTH ANCHOR SCROLL
// ═══════════════════════════════════════════════════════════════

function initSmoothScroll(lenis) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(target, { offset: -80, duration: 1.4 });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main section[id]');

    // Scrolled class
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        updateActiveNavLink();
    }, { passive: true });

    // Active link highlight
    function updateActiveNavLink() {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 140) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// HAMBURGER MENU
// ═══════════════════════════════════════════════════════════════

function initHamburger() {
    const btn   = document.querySelector('.hamburger');
    const nav   = document.querySelector('.nav-links');
    if (!btn || !nav) return;

    const close = () => {
        btn.classList.remove('active');
        nav.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = nav.classList.toggle('active');
        btn.classList.toggle('active', open);
        btn.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !nav.contains(e.target)) close();
    });
}

// ═══════════════════════════════════════════════════════════════
// SCROLL PROGRESS BAR
// ═══════════════════════════════════════════════════════════════

function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
        bar.setAttribute('aria-valuenow', Math.round(pct));
    }, { passive: true });
}

// ═══════════════════════════════════════════════════════════════
// SCROLL-TO-TOP & GITHUB BUTTON
// ═══════════════════════════════════════════════════════════════

function initScrollTop(lenis) {
    const btn    = document.getElementById('scroll-top');
    const ghLink = document.querySelector('.github-link');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        const show = window.scrollY > 500;
        btn.classList.toggle('visible', show);
        if (ghLink) ghLink.classList.toggle('visible', show);
    }, { passive: true });

    btn.addEventListener('click', () => {
        if (lenis) lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ═══════════════════════════════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════════════════════════════

function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Computer Science & Management Student',
        'Aspiring Software Developer',
        "Dean's List @ Dalhousie University",
        'Builder. Leader. Problem Solver.',
    ];

    let phraseIdx = 0, charIdx = 0, deleting = false;

    function tick() {
        const phrase = phrases[phraseIdx];
        charIdx += deleting ? -1 : 1;
        el.textContent = phrase.slice(0, charIdx);

        let delay = deleting ? 38 : 75;
        if (!deleting && charIdx === phrase.length) {
            delay = 2400; deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay = 350;
        }
        setTimeout(tick, delay);
    }

    tick();
}

// ═══════════════════════════════════════════════════════════════
// SPEECH BUBBLE
// ═══════════════════════════════════════════════════════════════

function initSpeechBubble() {
    if (window.innerWidth <= 768) return;

    const container = document.querySelector('.hero-image-container');
    const bubble    = document.querySelector('.speech-bubble');
    if (!container || !bubble) return;

    const show = () => {
        bubble.style.opacity = '1';
        bubble.style.transform = 'scale(1) translateY(0)';
        bubble.classList.add('is-visible');
    };
    const hide = () => {
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0.88) translateY(10px)';
        bubble.classList.remove('is-visible');
    };

    setTimeout(() => { show(); setTimeout(hide, 3200); }, 1800);
    container.addEventListener('mouseenter', show);
    container.addEventListener('mouseleave', hide);
}

// ═══════════════════════════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════════════════════════

function initCursor() {
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFine || window.innerWidth <= 768) return;

    const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = -999, my = -999, rx = -999, ry = -999;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    (function animateRing() {
        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
    })();

    const hoverSel = 'a, button, [role="button"], label, input, textarea, .skill-tag, .scroll-to-top, .github-link, .theme-toggle';
    document.querySelectorAll(hoverSel).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// ═══════════════════════════════════════════════════════════════
// CURSOR SPOTLIGHT
// ═══════════════════════════════════════════════════════════════

function initSpotlight() {
    if (window.innerWidth <= 768) return;

    const el = document.createElement('div');
    el.className = 'cursor-spotlight';
    document.body.appendChild(el);

    let cx = -9999, cy = -9999, tx = -9999, ty = -9999;

    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });

    (function loop() {
        cx += (tx - cx) * 0.07;
        cy += (ty - cy) * 0.07;
        el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
    })();
}

// ═══════════════════════════════════════════════════════════════
// CARD SPOTLIGHT (mouse-position radial on card)
// ═══════════════════════════════════════════════════════════════

function initCardSpotlight() {
    const cards = document.querySelectorAll(
        '.skill-card, .honor-card, .education-card, .experience-card, .project-card'
    );
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
            const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
            card.style.setProperty('--mx', x);
            card.style.setProperty('--my', y);
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// GSAP ANIMATIONS
// ═══════════════════════════════════════════════════════════════

function initGSAP() {
    if (typeof gsap === 'undefined') {
        // Fallback: simple IntersectionObserver reveal
        initFallbackReveal();
        return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ── Hero entrance sequence ──────────────────────────────
    // Set initial states first, then animate
    gsap.set('.hero-eyebrow',         { opacity: 0, y: 20 });
    gsap.set('.hero-text h1',         { opacity: 0, y: 32 });
    gsap.set('.hero-text .subtitle',  { opacity: 0, y: 20 });
    gsap.set('.hero-cta',             { opacity: 0, y: 20 });
    gsap.set('.hero-image-container', { opacity: 0, x: 40 });
    gsap.set('.hero-scroll',          { opacity: 0 });

    gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
        .to('.hero-eyebrow',          { opacity: 1, y: 0, duration: 0.7 })
        .to('.hero-text h1',          { opacity: 1, y: 0, duration: 0.85 }, '-=0.4')
        .to('.hero-text .subtitle',   { opacity: 1, y: 0, duration: 0.7  }, '-=0.5')
        .to('.hero-cta',              { opacity: 1, y: 0, duration: 0.7  }, '-=0.45')
        .to('.hero-image-container',  { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, '-=0.8')
        .to('.hero-scroll',           { opacity: 1, duration: 0.6 }, '-=0.3');

    if (typeof ScrollTrigger === 'undefined') {
        initFallbackReveal();
        return;
    }

    // ── Section headings ────────────────────────────────────
    document.querySelectorAll('section h2').forEach(heading => {
        gsap.from(heading, {
            scrollTrigger: { trigger: heading, start: 'top 88%', toggleActions: 'play none none none' },
            opacity: 0, y: 22, duration: 0.75, ease: 'power2.out',
        });
    });

    // ── About text ──────────────────────────────────────────
    gsap.from('.about-text p', {
        scrollTrigger: { trigger: '.about-text', start: 'top 85%' },
        opacity: 0, y: 24, duration: 0.9, ease: 'power2.out',
    });

    // ── Timeline cards ──────────────────────────────────────
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
        const card = item.querySelector('.experience-card');
        const isLeft = item.classList.contains('timeline-left');
        if (!card) return;

        gsap.fromTo(card,
            { opacity: 0, x: isLeft ? -30 : 30 },
            {
                scrollTrigger: { trigger: item, start: 'top 85%' },
                opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
                delay: (i % 2) * 0.1,
                onComplete: () => card.classList.add('revealed'),
            }
        );
    });

    // ── Grid cards (stagger) ────────────────────────────────
    ['.education-grid', '.honors-grid', '.skills-grid'].forEach(sel => {
        const grid = document.querySelector(sel);
        if (!grid) return;
        const cards = grid.querySelectorAll('.education-card, .honor-card, .skill-card');

        gsap.fromTo(cards,
            { opacity: 0, y: 30 },
            {
                scrollTrigger: { trigger: grid, start: 'top 85%' },
                opacity: 1, y: 0,
                stagger: 0.1, duration: 0.7, ease: 'power2.out',
                onComplete: () => cards.forEach(c => c.classList.add('revealed')),
            }
        );
    });

    // ── Project cards (stagger) ─────────────────────────────
    const projectCards = document.querySelectorAll('.project-card');
    gsap.fromTo(projectCards,
        { opacity: 0, y: 32 },
        {
            scrollTrigger: { trigger: '.projects-grid', start: 'top 85%' },
            opacity: 1, y: 0,
            stagger: 0.12, duration: 0.75, ease: 'power2.out',
            onComplete: () => projectCards.forEach(c => c.classList.add('revealed')),
        }
    );

    // ── Contact ─────────────────────────────────────────────
    gsap.from('.contact-content', {
        scrollTrigger: { trigger: '.contact-content', start: 'top 88%' },
        opacity: 0, y: 24, duration: 0.8, ease: 'power2.out',
    });
}

// ═══════════════════════════════════════════════════════════════
// FALLBACK (no GSAP)
// ═══════════════════════════════════════════════════════════════

function initFallbackReveal() {
    const opts = { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0 };
    const obs  = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, opts);

    document.querySelectorAll(
        '.skill-card, .honor-card, .education-card, .experience-card, .project-card'
    ).forEach((el, i) => {
        el.style.transitionDelay = `${(i % 4) * 0.1}s`;
        obs.observe(el);
    });

    // Reveal hero elements immediately
    ['.hero-eyebrow', '.hero-text h1', '.hero-text .subtitle', '.hero-cta', '.hero-image-container', '.hero-scroll']
        .forEach(sel => {
            const el = document.querySelector(sel);
            if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
        });
}

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    const lenis = initLenis();

    initSmoothScroll(lenis);
    initNavbar();
    initHamburger();
    initScrollProgress();
    initScrollTop(lenis);
    initTypewriter();
    initSpeechBubble();
    initCursor();
    initSpotlight();
    initCardSpotlight();

    // GSAP runs after libraries load (they are deferred)
    // We use a small rAF loop until GSAP is ready
    let attempts = 0;
    function tryGSAP() {
        if (typeof gsap !== 'undefined') {
            initGSAP();
        } else if (attempts++ < 40) {
            requestAnimationFrame(tryGSAP);
        } else {
            // Libraries never loaded — fallback
            initFallbackReveal();
        }
    }
    tryGSAP();
});
