// Theme switching functionality
const themeToggle = document.getElementById('theme-toggle');

// Function to set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update hero image for dark mode if needed
    updateHeroImageForTheme(theme);
}

// Function to update hero image based on theme
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

// Check for preferred color scheme and initialize accordingly
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

// Speech bubble animation enhancement
function setupSpeechBubble() {
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
                if (window.innerWidth <= 768) {
                    speechBubble.style.transform = 'translateX(-50%) scale(0.8) translateY(10px)';
                } else {
                    speechBubble.style.transform = 'scale(0.8) translateY(10px)';
                }
            }, 3000);
        }, 1500);
        
        // Show on mouse enter
        heroImage.addEventListener('mouseenter', () => {
            if (window.innerWidth <= 768) {
                speechBubble.style.transform = 'translateX(-50%) scale(1) translateY(0)';
            } else {
                speechBubble.style.transform = 'scale(1) translateY(0)';
            }
            speechBubble.style.opacity = '1';
        });
        
        // Hide on mouse leave
        heroImage.addEventListener('mouseleave', () => {
            speechBubble.style.opacity = '0';
            if (window.innerWidth <= 768) {
                speechBubble.style.transform = 'translateX(-50%) scale(0.8) translateY(10px)';
            } else {
                speechBubble.style.transform = 'scale(0.8) translateY(10px)';
            }
        });
        
        // Update on window resize to handle mobile/desktop differences
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                if (parseFloat(speechBubble.style.opacity) > 0) {
                    speechBubble.style.transform = 'translateX(-50%) scale(1) translateY(0)';
                } else {
                    speechBubble.style.transform = 'translateX(-50%) scale(0.8) translateY(10px)';
                }
            } else {
                if (parseFloat(speechBubble.style.opacity) > 0) {
                    speechBubble.style.transform = 'scale(1) translateY(0)';
                } else {
                    speechBubble.style.transform = 'scale(0.8) translateY(10px)';
                }
            }
        });
    }
}

// Custom cursor functionality
function setupCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    
    // Main cursor positioning - instant follow
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    // Add expanding effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .experience-card, .education-card, .honor-card, .skill-card, .nav-links li, .hero-image-container');
    
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

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupHamburgerMenu();
    setupScrollToTop();
    setupCustomCursor();
    setupSpeechBubble();
    
    // Force apply the correct transparent image in the current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    updateHeroImageForTheme(currentTheme);
});

