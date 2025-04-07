# Lucas Reydman - Personal Portfolio Website

A modern, responsive personal portfolio website built with HTML, CSS, and JavaScript. This website showcases Lucas Reydman's professional experience, education, skills, and achievements.

## Features

- Responsive design that works on all devices
- Modern and clean user interface
- Dark/Light theme toggle with smooth transitions
- Smooth scrolling navigation
- Animated section and card reveals
- Custom cursor with animations
- Company logos for all experience entries
- Institution logos for education entries
- Interactive sections for:
  - About (with highlighted key phrases)
  - Experience
  - Education
  - Honors
  - Skills
  - Contact
- Social media integration (LinkedIn)
- Contact functionality
- Progressive Web App (PWA) support
- Cross-platform favicon support
- Scroll-to-top button
- Animated UI elements with hover effects
- Subtle background patterns and gradients
- Comprehensive documentation for favicon and PWA implementation

## Technologies Used

- HTML5
- CSS3 (with CSS variables for theming)
- JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Inter)
- Intersection Observer API for animations
- CSS Animations and Transitions
- CSS Grid and Flexbox for layouts

## Project Structure

```
cv/
├── index.html                    # Main HTML file
├── styles.css                    # Main stylesheet with theming support
├── scripts.js                    # Main script file with animations and interactions
├── assets/                       # All static assets
│   ├── images/                   # Image assets
│   │   ├── company-logos/        # Company logos for work experiences
│   │   ├── education-logos/      # Educational institution logos
│   │   └── hero/                 # Hero image for the header section
│   └── favicon/                  # Favicon directory
│       ├── favicon.ico           # Default favicon
│       ├── favicon-16x16.png     # Small favicon
│       ├── favicon-32x32.png     # Large favicon
│       ├── apple-touch-icon.png  # iOS icon
│       ├── android-192x192.png   # Small android icon
│       ├── android-512x512.png   # Large android icon
│       ├── site.webmanifest      # PWA manifest file
│       ├── site.webmanifest.txt  # Documentation for the webmanifest
│       └── favicon.txt           # Documentation for the favicon system
├── LICENSE                       # License file
└── README.md                     # Project documentation
```

## Features Detail

### Theme Toggle
- Supports both light and dark themes
- Persists user preference
- Smooth transition between themes
- Contextual color adaptation in UI elements

### Custom Cursor
- Custom cursor implementation
- Interactive cursor effects
- Dash trail animation following cursor movement
- Cursor animations on interactive elements

### Company Logos
- Professional logos for all work experiences
- Educational institution logos
- Responsive sizing and positioning
- Optimized image loading
- Interactive hover effects

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Optimized layout for desktop, tablet, and mobile
- Responsive typography with clamp() functions
- Accessible on all devices

### Progressive Web App
- Full PWA support with web manifest (located in the assets/favicon folder)
- Cross-platform favicon support
- Installable on mobile devices
- Offline capability
- Customized theme colors

### Animations
- Smooth section reveal on scroll using Intersection Observer API
- Staggered card animations
- Interactive hover effects
- Smooth transitions between elements
- Subtle background animations
- Text highlight effects

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cv.git
   ```

2. Open `index.html` in your web browser to view the website.

## Development

To make changes to the website:

1. Edit the HTML in `index.html` to update content
2. Modify styles in `styles.css` to change appearance
3. Update scripts in `scripts.js` to adjust animations and interactions
4. Add or replace images in the `assets/images` directory as needed
5. Refer to `assets/favicon/favicon.txt` and `assets/favicon/site.webmanifest.txt` for documentation on the favicon system and PWA implementation

## Contact

- LinkedIn: [Lucas Reydman](https://www.linkedin.com/in/lucasreydman)
- Email: lucas.reydman@dal.ca

## License

This project is licensed under the terms specified in the LICENSE file.
