# Portfolio Website

A modern, responsive portfolio website for Lucas Reydman - Applied Computer Science & Management Student at Dalhousie University. Features smooth animations, light/dark theme toggle, and high-quality visual components.

## Features

- **Responsive Design**: Fully responsive layout optimized for all devices from mobile to desktop
- **Light/Dark Theme**: Toggle between themes with persistent user preference stored in localStorage
- **Interactive UI Elements**: 
  - Speech bubble animations in hero section (desktop only)
  - Smooth scroll navigation between sections
  - Reveal animations on scroll using Intersection Observer API
  - Fixed scroll-to-top button with tooltip
  - GitHub repository link with hover tooltip
- **Section Organization**:
  - **Hero**: Introduction with animated image and speech bubble
  - **About**: Personal description with highlighted keywords
  - **Experience**: 6 work experience cards with company logos
  - **Education**: Academic background with institution logos
  - **Honors**: Awards, certifications, and achievements
  - **Skills**: Technical, Business, and Digital Tools expertise
  - **Projects**: 4 featured projects with technology tags
  - **Contact**: Email and LinkedIn contact information

## Technologies Used

- **HTML5**: Semantic markup for better accessibility and SEO
- **CSS3**: 
  - CSS variables for theming
  - Flexbox and CSS Grid for layouts
  - CSS animations and transitions
  - Media queries for responsive design
  - Modular CSS architecture
- **JavaScript**: 
  - Intersection Observer API for scroll animations
  - Local Storage for theme persistence
  - DOM manipulation for dynamic elements
  - Mobile device detection
- **External Resources**:
  - Font Awesome 6.0 for icons
  - Google Fonts (Inter) for typography

## File Structure

```
cv/
├── assets/
│   ├── favicon/              # Favicon files for various platforms
│   └── images/               # Image assets
│       ├── company-logos/    # Work experience company logos
│       ├── education-logos/  # Education and project logos
│       └── hero/             # Hero section images
├── css/                      # CSS files (modular organization)
│   ├── minified/             # Minified CSS files for production
│   │   └── main.min.css
│   ├── base.css              # Base styles, reset, variables, typography
│   ├── components.css       # Reusable component styles
│   ├── layout.css            # Layout and structure styles
│   ├── main.css              # Imports all CSS modules
│   └── sections.css          # Section-specific styles
├── js/                       # JavaScript files
│   ├── main.js               # Main JavaScript functionality
│   └── main.min.js           # Minified JavaScript for production
├── index.html                 # Main HTML file
├── LICENSE                    # MIT License
└── README.md                  # This file
```

## CSS Organization

The CSS is organized in a modular fashion to improve maintainability:

- **base.css**: Reset styles, CSS variables for theming, typography, and basic elements
- **layout.css**: Page structure, grid systems, navbar, footer, and section layouts
- **components.css**: Reusable components like cards, buttons, tooltips, theme toggle, and speech bubble
- **sections.css**: Specific styles for each section (hero, about, experience, education, skills, honors, projects, contact)
- **main.css**: Central file that imports all other CSS modules using `@import`

## JavaScript Features

- **Theme switching**: Toggle between light and dark themes with persistence in localStorage
- **Smooth scrolling**: Navigate between sections smoothly with animated scroll behavior
- **Reveal animations**: Elements animate in as they enter the viewport using Intersection Observer
- **Speech bubble**: Interactive speech bubble in the hero section (desktop only, hidden on mobile)
- **Mobile menu**: Hamburger menu for mobile navigation with smooth slide-in animation
- **Scroll to top**: Fixed button that appears after scrolling 500px, smoothly scrolls back to top
- **GitHub link**: Fixed button linking to the repository with hover tooltip
- **Navbar scroll effect**: Navbar background changes on scroll for better visibility

## Content Sections

### Work Experience (6 positions)
1. **RBC** - Operations Analyst (May 2025 - Aug 2025)
2. **Torinit Technologies Inc.** - Digital Solutions Intern (May 2024 - Aug 2024)
3. **Mirabella Development Corporation** - Research & Development Intern (Jun 2023 - Aug 2023)
4. **Panther** - Founder & Head of Operations (Sep 2021 - Aug 2023)
5. **Scale Hospitality** - Hospitality Assistant (Jun 2022 - Aug 2022)
6. **Over the Rainbow Ltd.** - Sales Associate (Jun 2021 - Aug 2021)

### Projects (4 projects)
1. **QuickCash** - Android mobile application for job finding (Sep 2025 - Dec 2025)
   - Technologies: Android Studio, Firebase, Java, GitLab, Agile, Figma, XP
2. **Tic Tec Toe** - Social media platform for researchers (Jan 2025 - Apr 2025)
   - Technologies: React Native, Node.js, Supabase, GitLab, Jira, Figma, LaTeX, Expo Go
3. **wdinomf?** - Final grade calculator web app (Apr 2025)
   - Technologies: HTML5, CSS3, JavaScript, Local Storage API
4. **Fantasy Basketball Draft Lottery Simulator** - Web-based lottery simulator (Mar 2025)
   - Technologies: HTML5, CSS3, JavaScript, Local Storage API

### Education
- **Dalhousie University** - Bachelor of Applied Computer Science (Sep 2023 - Present)
- **Lawrence Park Collegiate Institute** - Ontario Secondary School Diploma (Sep 2019 - Jun 2023)

## Customization

### Changing Colors

Edit the CSS variables in `css/base.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --text-color: #1f2937;
    --background: #ffffff;
    /* other color variables */
}

[data-theme="dark"] {
    --primary-color: #60a5fa;
    --secondary-color: #3b82f6;
    --text-color: #f3f4f6;
    --background: #111827;
    /* other dark theme color variables */
}
```

### Adding New Sections

1. Add the HTML markup in `index.html` within the `<main>` tag
2. Add section-specific styles in `css/sections.css`
3. Add navigation link in the navbar
4. If needed, add JavaScript functionality in `js/main.js`

### Modifying Animations

Animation settings are in the CSS variables in `css/base.css`:

```css
:root {
    --animation-short: 0.3s;
    --animation-medium: 0.6s;
    --animation-long: 1s;
    --ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55);
    --ease-smooth: cubic-bezier(0.65, 0, 0.35, 1);
}
```

### Mobile Responsiveness

The website is fully responsive with breakpoints at:
- **1400px**: Large desktop adjustments
- **1200px**: Desktop layout adjustments
- **900px**: Tablet layout adjustments
- **768px**: Mobile layout (hamburger menu, single column grids)
- **480px**: Small mobile adjustments (reduced padding, font sizes)

Mobile-specific optimizations:
- Cards stack vertically on mobile
- Hamburger menu replaces horizontal navigation
- Speech bubble and tooltips hidden on mobile
- Touch-friendly button sizes
- Optimized spacing and padding
- Word wrapping for long text content

## Browser Support

The portfolio website is compatible with:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Performance Optimizations

- Minified CSS and JavaScript for production
- Preload critical assets (CSS, JS, hero image)
- Lazy loading for external resources (Font Awesome, Google Fonts)
- Reduced motion support for accessibility
- Optimized animations using CSS transforms
- Efficient Intersection Observer usage

## Accessibility Features

- Semantic HTML5 elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes
- Reduced motion support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Lucas Reydman**
- Applied Computer Science & Management Student
- Dalhousie University
- Email: lucas.reydman@dal.ca
- LinkedIn: [lucasreydman](https://www.linkedin.com/in/lucasreydman)
- GitHub: [lucasreydman](https://github.com/lucasreydman)
