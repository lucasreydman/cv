# Portfolio Website

A modern, responsive portfolio website with smooth animations, light/dark theme toggle, and high-quality visual components.

## Features

- **Responsive Design**: Looks great on all devices from mobile to desktop
- **Light/Dark Theme**: Toggle between themes with persistent user preference
- **Interactive UI Elements**: 
  - Custom cursor effects
  - Speech bubble animations
  - Smooth scroll navigation
  - Reveal animations on scroll
- **Section Organization**:
  - Hero section with animated elements
  - About section with highlight effects
  - Experience & Education sections with card layouts
  - Skills & Honors sections
  - Contact section

## Technologies Used

- **HTML5**: Semantic markup for better accessibility and SEO
- **CSS3**: 
  - CSS variables for theming
  - Flexbox and CSS Grid for layouts
  - CSS animations and transitions
  - Media queries for responsive design
- **JavaScript**: 
  - Intersection Observer API for scroll animations
  - Local Storage for theme persistence
  - DOM manipulation for dynamic elements

## File Structure

```
portfolio/
├── assets/
│   ├── favicon/        # Favicon files
│   └── images/         # Image assets
│       ├── company-logos/
│       ├── education-logos/
│       └── hero/
├── css/                # CSS files (modular organization)
│   ├── minified/       # Minified CSS files for production
│   │   └── main.min.css
│   ├── base.css        # Base styles and variables
│   ├── components.css  # Reusable component styles
│   ├── layout.css      # Layout and structure styles
│   ├── main.css        # Imports all CSS modules
│   └── sections.css    # Section-specific styles
├── js/                 # JavaScript files
│   ├── main.js         # Main JavaScript functionality
│   └── main.min.js     # Minified JavaScript for production
├── index.html          # Main HTML file
├── LICENSE             # License information
└── README.md           # This file
```

## CSS Organization

The CSS is organized in a modular fashion to improve maintainability:

- **base.css**: Reset styles, variables, typography, and basic elements
- **layout.css**: Page structure, grid systems, navbar, and footer
- **components.css**: Reusable components like cards, buttons, and tooltips
- **sections.css**: Specific styles for each section of the portfolio
- **main.css**: Central file that imports all other CSS modules

## JavaScript Features

- **Theme switching**: Toggle between light and dark themes with persistence
- **Smooth scrolling**: Navigate between sections smoothly
- **Reveal animations**: Elements animate in as they enter the viewport
- **Custom cursor**: Interactive cursor that responds to hoverable elements
- **Speech bubble**: Interactive speech bubble in the hero section
- **Mobile menu**: Hamburger menu for mobile navigation
- **Scroll to top**: Button to smoothly scroll back to the top of the page

## Customization

### Changing Colors

Edit the CSS variables in `css/base.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    /* other color variables */
}

[data-theme="dark"] {
    --primary-color: #60a5fa;
    --secondary-color: #3b82f6;
    /* other dark theme color variables */
}
```

### Adding New Sections

1. Add the HTML markup in `index.html`
2. Add section-specific styles in `css/sections.css`
3. If needed, add JavaScript functionality in `scripts.js`

### Modifying Animations

Animation settings are in the CSS variables:

```css
:root {
    --animation-short: 0.3s;
    --animation-medium: 0.6s;
    --animation-long: 1s;
    --ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55);
    --ease-smooth: cubic-bezier(0.65, 0, 0.35, 1);
}
```

## Browser Support

The portfolio website is compatible with:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Lucas Reydman
