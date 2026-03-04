/**
 * Portfolio Website JavaScript
 * Main script file for handling interactive functionality
 * 
 * @author Lucas Reydman
 * @version 1.0.0
 * @license MIT
 */

// =================================
// Theme Management
// =================================

const themeToggle = document.getElementById('theme-toggle');

/**
 * Sets the theme and updates relevant elements
 * @param {string} theme - The theme to set ('light' or 'dark')
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update hero image for dark mode if needed
    updateHeroImageForTheme(theme);
}

/**
 * Updates the hero image based on current theme
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateHeroImageForTheme(theme) {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        // Always ensure we're using the transparent image
        heroImage.src = 'assets/images/hero/hero-removebg-preview.png';
        
        if (theme === 'dark') {
            heroImage.style.filter = 'brightness(1.2) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3))';
        } else {
            heroImage.style.filter = '';
        }
    }
}

/**
 * Initializes theme based on user preference or system setting
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

// Initialize theme
initializeTheme();

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
    
    setTheme(newTheme);
});

// =================================
// Scroll Effects
// =================================

/**
 * Sets up smooth scrolling for navigation links
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Sets up navbar scroll effect (background change on scroll)
 */
function setupNavbarScroll() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// =================================
// Reveal Animations
// =================================

/**
 * Sets up reveal animations for sections and cards using Intersection Observer
 */
function setupRevealAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all main sections and their children
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal-section');
        observer.observe(section);
        
        // Observe grid items within sections with staggered delay
        section.querySelectorAll('.skill-card, .honor-card, .education-card, .experience-card').forEach((item, index) => {
            item.classList.add('reveal-item');
            item.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(item);
        });
    });
}

// =================================
// Interactive Elements
// =================================

/**
 * Detects if the current device is a mobile device
 * @returns {boolean} True if the device is a mobile device
 */
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
}

/**
 * Sets up speech bubble animation and interaction
 * Only activates on non-mobile devices
 */
function setupSpeechBubble() {
    // Skip on mobile devices
    if (isMobileDevice()) return;
    
    const heroImage = document.querySelector('.hero-image-container');
    const speechBubble = document.querySelector('.speech-bubble');
    
    if (heroImage && speechBubble) {
        // Initial show on page load
        setTimeout(() => {
            speechBubble.style.opacity = '1';
            speechBubble.style.transform = 'scale(1) translateY(0)';
            
            // Hide after 3 seconds
            setTimeout(() => {
                speechBubble.style.opacity = '0';
                speechBubble.style.transform = 'scale(0.8) translateY(10px)';
            }, 3000);
        }, 1500);
        
        // Show on mouse enter
        heroImage.addEventListener('mouseenter', () => {
            speechBubble.style.transform = 'scale(1) translateY(0)';
            speechBubble.style.opacity = '1';
        });
        
        // Hide on mouse leave
        heroImage.addEventListener('mouseleave', () => {
            speechBubble.style.opacity = '0';
            speechBubble.style.transform = 'scale(0.8) translateY(10px)';
        });
    }
}

/**
 * Sets up hamburger menu functionality for mobile
 */
function setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

/**
 * Sets up scroll-to-top button functionality
 */
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-top');
    const githubBtn = document.querySelector('.github-link');
    
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
            if (githubBtn) githubBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
            if (githubBtn) githubBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =================================
// Typewriter Effect
// =================================

/**
 * Cycles through identity phrases with a typewriter animation in the hero subtitle
 */
function setupTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Computer Science & Management Student',
        'Aspiring Software Developer',
        "Dean's List @ Dalhousie University",
        'Builder. Leader. Problem Solver.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            charIndex--;
            el.textContent = current.slice(0, charIndex);
        } else {
            charIndex++;
            el.textContent = current.slice(0, charIndex);
        }

        let delay = isDeleting ? 40 : 80;
        if (!isDeleting && charIndex === current.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(tick, delay);
    }

    tick();
}


// =================================
// Scroll Progress Bar
// =================================

/**
 * Updates a fixed progress bar at the top of the page based on scroll position
 */
function setupScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
        bar.setAttribute('aria-valuenow', Math.round(pct));
    }, { passive: true });
}

// =================================
// Cursor Spotlight
// =================================

/**
 * Creates a subtle radial spotlight that follows the cursor on desktop
 */
function setupCursorSpotlight() {
    if (window.innerWidth <= 768) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    document.body.appendChild(spotlight);

    let mouseX = -9999, mouseY = -9999;
    let currentX = -9999, currentY = -9999;
    let raf;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;
        spotlight.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
        raf = requestAnimationFrame(animate);
    }

    animate();
}

// =================================
// Custom Cursor
// =================================

function setupCustomCursor() {
    if (window.innerWidth <= 768 || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -9999, mouseY = -9999;
    let ringX = -9999, ringY = -9999;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    (function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
    })();

    const hoverTargets = 'a, button, [role="button"], label, input, textarea, select, .skill-tag, .scroll-to-top, .theme-toggle';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// =================================
// Initialization
// =================================

/**
 * Initializes all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScroll();
    setupNavbarScroll();
    setupRevealAnimations();
    setupHamburgerMenu();
    setupScrollToTop();
    setupSpeechBubble();
    setupTypewriter();
    setupScrollProgress();
    setupCursorSpotlight();
    setupCustomCursor();

    // Force apply the correct transparent image in the current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    updateHeroImageForTheme(currentTheme);
});

