// Theme switching functionality
const themeToggle = document.getElementById('theme-toggle');

// Function to set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Initialize theme as light
setTheme('light');

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Reveal animations for sections
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
    
    // Observe grid items within sections
    section.querySelectorAll('.skill-card, .honor-card, .education-card, .experience-card').forEach((item, index) => {
        item.classList.add('reveal-item');
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
});

// Custom cursor functionality
function setupCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    
    // Main cursor positioning - instant follow
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    // Add expanding effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .experience-card, .education-card, .honor-card, .skill-card, .nav-links li');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('expanded');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('expanded');
        });
    });
    
    // Handle cursor visibility when leaving/entering window
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Fix for touch devices
    if ('ontouchstart' in window) {
        document.body.style.cursor = 'auto';
        cursor.style.display = 'none';
    }
}

// Hamburger menu functionality
function setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
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

// Scroll to top button functionality
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-top');
    const githubBtn = document.querySelector('.github-link');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
            githubBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
            githubBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize all functionality on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    setupHamburgerMenu();
    setupScrollToTop();
    setupCustomCursor();
});

