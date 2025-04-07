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

// Scroll to top button functionality
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll-to-top on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    setupScrollToTop();
});

