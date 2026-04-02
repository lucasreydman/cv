/**
 * Portfolio — main.js
 * Lenis smooth scroll + GSAP animations + interactive polish
 */

// ═══════════════════════════════════════════════════════════════
// PROJECT READ MORE / LESS
// ═══════════════════════════════════════════════════════════════

function initProjectToggle() {
    document.querySelectorAll('.project-description').forEach(p => {
        p.classList.add('truncated');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'project-read-more';
        btn.textContent = 'Read more';

        btn.addEventListener('click', () => {
            const expanded = !p.classList.contains('truncated');
            p.classList.toggle('truncated', expanded);
            btn.textContent = expanded ? 'Read more' : 'Read less';
        });

        p.insertAdjacentElement('afterend', btn);
    });
}

// ═══════════════════════════════════════════════════════════════
// COPY EMAIL
// ═══════════════════════════════════════════════════════════════

function initCopyEmail() {
    const btn     = document.getElementById('copy-email-btn');
    const confirm = document.querySelector('.copy-email-confirm');
    if (!btn || !confirm) return;

    btn.addEventListener('click', async () => {
        const email = btn.querySelector('.copy-email-text').textContent.trim();
        try {
            await navigator.clipboard.writeText(email);
            confirm.textContent = 'Copied!';
            setTimeout(() => { confirm.textContent = ''; }, 2000);
        } catch {
            confirm.textContent = 'Failed';
            setTimeout(() => { confirm.textContent = ''; }, 2000);
        }
    });
}

// ═══════════════════════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════════════════════

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn    = form.querySelector('.contact-submit-btn');
        const status = form.querySelector('.contact-form-status');
        const btnText = btn.querySelector('.btn-text');

        btn.disabled = true;
        btnText.textContent = 'Sending…';
        status.textContent = '';
        status.className = 'contact-form-status';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name:    form.name.value.trim(),
                    email:   form.email.value.trim(),
                    message: form.message.value.trim(),
                }),
            });

            if (res.ok) {
                status.textContent = "Message sent! I'll get back to you soon.";
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
            btnText.textContent = 'Send Message';
        }
    });
}

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
    const btn = document.getElementById('scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
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
        'Computer Science & Management Student.',
        'Builder. Leader. Problem Solver.',
        'Bridging Business & Technology.',
        'Shipping Faster with AI.',
        'Full-Stack Developer & AI Enthusiast.',
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

    let floatTimer = null;
    let hovered = false;

    const show = () => {
        clearTimeout(floatTimer);
        bubble.classList.remove('leaving', 'floating');
        void bubble.offsetWidth;
        bubble.classList.add('entering');
        floatTimer = setTimeout(() => {
            bubble.classList.remove('entering');
            bubble.classList.add('floating');
        }, 550);
    };

    const hide = () => {
        clearTimeout(floatTimer);
        bubble.classList.remove('entering', 'floating');
        void bubble.offsetWidth;
        bubble.classList.add('leaving');
        setTimeout(() => bubble.classList.remove('leaving'), 350);
    };

    // Auto show on load, then hide only if not hovered
    setTimeout(() => {
        show();
        setTimeout(() => { if (!hovered) hide(); }, 3400);
    }, 1800);

    container.addEventListener('mouseenter', () => { hovered = true;  show(); });
    container.addEventListener('mouseleave', () => { hovered = false; hide(); });
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

    const hoverSel = 'a, button, [role="button"], label, input, textarea, .skill-tag, .scroll-to-top, .theme-toggle';
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
    gsap.set('.hero-status',          { opacity: 0, y: 16 });
    gsap.set('.hero-eyebrow',         { opacity: 0, y: 20 });
    gsap.set('.hero-text h1',         { opacity: 0, y: 32 });
    gsap.set('.hero-text .subtitle',  { opacity: 0, y: 20 });
    gsap.set('.hero-cta',             { opacity: 0, y: 20 });
    gsap.set('.hero-cv-note',         { opacity: 0, y: 12 });
    gsap.set('.hero-image-container', { opacity: 0, x: 40 });
    gsap.set('.hero-scroll',          { opacity: 0 });

    gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
        .to('.hero-status',           { opacity: 1, y: 0, duration: 0.6 })
        .to('.hero-eyebrow',          { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
        .to('.hero-text h1',          { opacity: 1, y: 0, duration: 0.85 }, '-=0.4')
        .to('.hero-text .subtitle',   { opacity: 1, y: 0, duration: 0.7  }, '-=0.5')
        .to('.hero-cta',              { opacity: 1, y: 0, duration: 0.7  }, '-=0.45')
        .to('.hero-cv-note',          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
        .to('.hero-image-container',  { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, '-=0.9')
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
        stagger: 0.15,
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
    ['.hero-status', '.hero-eyebrow', '.hero-text h1', '.hero-text .subtitle', '.hero-cta', '.hero-cv-note', '.hero-image-container', '.hero-scroll']
        .forEach(sel => {
            const el = document.querySelector(sel);
            if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
        });
}

// ═══════════════════════════════════════════════════════════════
// DETAILS ANIMATION (smooth height for pursuing dropdowns)
// ═══════════════════════════════════════════════════════════════

function initDetailsAnimation() {
    document.querySelectorAll('.education-details details').forEach(el => {
        const summary = el.querySelector('summary');

        summary.addEventListener('click', e => {
            e.preventDefault();

            if (el.open) {
                // Closing
                const start = el.scrollHeight;
                el.style.height = start + 'px';
                el.offsetHeight; // reflow
                el.style.transition = 'height 0.4s cubic-bezier(0.4,0,0.2,1), border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease';
                el.style.height = summary.scrollHeight + 8 + 'px';
                el.addEventListener('transitionend', function handler(ev) {
                    if (ev.propertyName !== 'height') return;
                    el.open = false;
                    el.style.height = '';
                    el.style.transition = '';
                    el.removeEventListener('transitionend', handler);
                });
            } else {
                // Opening
                el.open = true;
                const end = el.scrollHeight;
                el.style.height = summary.scrollHeight + 8 + 'px';
                el.offsetHeight; // reflow
                el.style.transition = 'height 0.4s cubic-bezier(0.4,0,0.2,1), border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease';
                el.style.height = end + 'px';
                el.addEventListener('transitionend', function handler(ev) {
                    if (ev.propertyName !== 'height') return;
                    el.style.height = '';
                    el.style.transition = '';
                    el.removeEventListener('transitionend', handler);
                });
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// SKILLS CAROUSEL
// ═══════════════════════════════════════════════════════════════

function initSkillsCarousel() {
    const wrapper = document.querySelector('.skills-carousel-wrapper');
    if (!wrapper) return;

    const track   = wrapper.querySelector('.skills-track');
    const cards   = [...track.querySelectorAll('.skill-card')];
    const dots    = [...wrapper.querySelectorAll('.skills-dot')];
    const total   = cards.length; // 4
    let current   = 0;
    let autoTimer = null;

    // Reveal cards immediately — bypass GSAP entrance for carousel cards
    cards.forEach(c => { c.style.opacity = '0'; c.style.transform = ''; });

    function layout() {
        const ww       = track.offsetWidth;
        const cardW    = Math.round(ww * 0.36);
        const gap      = Math.round(ww * 0.02);
        const step     = cardW + gap;
        const centerX  = Math.round((ww - cardW) / 2);
        let maxH = 0;

        cards.forEach(c => {
            c.style.width = cardW + 'px';
            c.style.left  = centerX + 'px';
            maxH = Math.max(maxH, c.offsetHeight);
        });
        track.style.height = maxH + 'px';

        cards.forEach((card, i) => {
            let offset = i - current;
            // Wrap for infinite feel
            if (offset > total / 2)  offset -= total;
            if (offset < -total / 2) offset += total;

            const x        = offset * step;
            const isCenter = offset === 0;
            const isSide   = Math.abs(offset) === 1;
            const scale    = isCenter ? 1 : isSide ? 0.88 : 0.76;
            const opacity  = isCenter ? 1 : isSide ? 0.5 : 0;
            const rotateY  = isCenter ? 0 : offset * -12;
            const zIndex   = isCenter ? 3 : isSide ? 2 : 0;
            const shadow   = isCenter ? '0 20px 60px rgba(0,0,0,0.4)' : 'none';

            card.style.transform    = `translateX(${x}px) scale(${scale}) rotateY(${rotateY}deg)`;
            card.style.opacity      = opacity;
            card.style.zIndex       = zIndex;
            card.style.boxShadow    = shadow;
            card.style.pointerEvents = (isCenter || isSide) ? 'auto' : 'none';
        });
    }

    function updateDots() {
        dots.forEach((d, i) => {
            // Force restart CSS animation by removing/re-adding active
            d.classList.remove('active');
            d.setAttribute('aria-pressed', 'false');
            if (i === current) {
                void d.offsetWidth; // reflow to restart transition
                d.classList.add('active');
                d.setAttribute('aria-pressed', 'true');
            }
        });
    }

    function go(dir) {
        current = (current + dir + total) % total;
        layout();
        updateDots();
        resetAuto();
    }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => go(1), 3600);
    }

    // Click dot to jump to card
    dots.forEach((dot, i) => dot.addEventListener('click', () => {
        current = i; layout(); updateDots(); resetAuto();
    }));

    // Click side cards to advance
    cards.forEach((card, i) => card.addEventListener('click', () => {
        if (i === current) return;
        let offset = i - current;
        if (offset > total / 2)  offset -= total;
        if (offset < -total / 2) offset += total;
        go(offset > 0 ? 1 : -1);
    }));

    // Touch / drag swipe
    let startX = 0, dragging = false;
    wrapper.addEventListener('pointerdown',  e => { startX = e.clientX; dragging = true; });
    wrapper.addEventListener('pointerup',    e => {
        if (!dragging) return;
        dragging = false;
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1);
    });
    wrapper.addEventListener('pointerleave', () => { dragging = false; });

    // Pause bar + auto on hover, resume on leave
    wrapper.addEventListener('mouseenter', () => {
        clearInterval(autoTimer);
        dots.forEach(d => d.style.setProperty('--bar-state', 'paused'));
    });
    wrapper.addEventListener('mouseleave', () => {
        dots.forEach(d => d.style.removeProperty('--bar-state'));
        updateDots();   // restart bar animation from 0 so it stays in sync
        resetAuto();
    });

    window.addEventListener('resize', layout);

    layout();
    updateDots();
    resetAuto();
}

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    const lenis = initLenis();

    initContactForm();
    initProjectToggle();
    initCopyEmail();
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
    initDetailsAnimation();
    initSkillsCarousel();

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
