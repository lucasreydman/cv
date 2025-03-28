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

// Visitor Counter with Counter.dev
function getOrdinal(n) {
    let ord = 'th';
    
    if (n % 10 === 1 && n % 100 !== 11) {
        ord = 'st';
    } else if (n % 10 === 2 && n % 100 !== 12) {
        ord = 'nd';
    } else if (n % 10 === 3 && n % 100 !== 13) {
        ord = 'rd';
    }
    
    return ord;
}

function updateVisitorCount() {
    const visitorTextElement = document.getElementById('visitor-text');
    
    // Function to format the count with animation
    function displayCount(count) {
        const ordinal = getOrdinal(count);
        visitorTextElement.textContent = `You're visitor #${count}${ordinal}!`;
        visitorTextElement.classList.add('count-animation');
        setTimeout(() => {
            visitorTextElement.classList.remove('count-animation');
        }, 500);
    }

    // Check every second for 10 seconds if Counter.dev has loaded
    let attempts = 0;
    const checkInterval = setInterval(() => {
        if (window._counter && window._counter.visitors !== undefined) {
            displayCount(window._counter.visitors);
            clearInterval(checkInterval);
        } else if (attempts >= 10) {
            visitorTextElement.textContent = "Thanks for visiting!";
            clearInterval(checkInterval);
        }
        attempts++;
    }, 1000);
}

// Initialize counter when DOM is loaded
document.addEventListener('DOMContentLoaded', updateVisitorCount);

