# OneGrid Website

Modern, responsive website for OneGrid - India's Next-Generation Renewable Energy IPP.

## 🎯 Features

### ✨ Visual Effects
- **Particle System**: Floating particles in hero section with GPU acceleration
- **Energy Flow Animations**: Flowing circuit lines and energy streams throughout the site
- **Live Platform Ticker**: Real-time updating metrics showing platform growth
- **Scroll-Triggered Animations**: Smooth reveal animations as you scroll
- **Energy Glow Effects**: Interactive hover effects on cards and elements
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile

### 📊 Sections
1. **Hero Section**: Bold introduction with animated particles and energy circuits
2. **Challenge**: 4-card grid showing C&I energy challenges with energy glow effects
3. **Dual Platform**: Split-screen showcasing Platform vs. Renewable offerings
4. **Platform Features**: 6-feature grid with detailed capabilities
5. **Energy Flow Visualization**: Animated energy particle flow diagram
6. **Flagship Project**: 100 MW renewable energy park details
7. **Customer Benefits**: 5-benefit grid with stats
8. **Climate Impact**: Animated counter showing CO₂ offset
9. **Insights**: Auto-updating blog posts from Medium
10. **Dual CTA**: Side-by-side calls to action
11. **Contact Form**: Integrated contact form with Formspree
12. **Footer**: Comprehensive navigation and links

### 🔌 Integrations
- **Medium Blog**: Auto-fetches latest 3 posts from @onegrid
- **Live Metrics**: Simulated real-time platform statistics
- **Contact Form**: Ready for Formspree integration

## 📁 Files

- `index.html` - Main HTML structure
- `styles.css` - Complete CSS with animations and responsive design
- `script.js` - JavaScript for animations, Medium integration, and interactivity

## 🚀 Setup Instructions

### 1. Basic Setup (No Server Required)
Simply open `index.html` in your web browser. All features will work locally.

### 2. Contact Form Setup (Optional)
To enable the contact form:

1. Sign up for a free account at [Formspree](https://formspree.io/)
2. Create a new form and get your form ID
3. In `index.html`, find line with `action="https://formspree.io/f/YOUR_FORM_ID"`
4. Replace `YOUR_FORM_ID` with your actual Formspree form ID

Example:
```html
<form id="contactForm" action="https://formspree.io/f/xyzabc123" method="POST">
```

### 3. Deploy to Production

#### Option A: GitHub Pages (Free)
1. Create a new GitHub repository
2. Upload `index.html`, `styles.css`, and `script.js`
3. Go to Settings → Pages
4. Select main branch as source
5. Your site will be live at `https://yourusername.github.io/repo-name`

#### Option B: Netlify (Free)
1. Sign up at [Netlify](https://www.netlify.com/)
2. Drag and drop the folder containing all files
3. Your site will be live instantly with a custom URL

#### Option C: Traditional Web Hosting
1. Upload all files to your hosting via FTP
2. Ensure `index.html` is in the root directory
3. Access via your domain

## 🎨 Customization

### Colors
All brand colors are defined in CSS variables at the top of `styles.css`:

```css
:root {
    --primary-green: #536D33;      /* Sap Green */
    --secondary-dark-green: #19412F; /* Dark Green Earth */
    --accent-green: #27AE60;       /* Accent Green */
}
```

### Platform Ticker Starting Values
In `script.js`, find the `PlatformTicker` class:

```javascript
this.unitsManaged = 1000000; // Starting units (1M)
this.dailyTarget = 32800;    // Daily growth target
```

### Medium Blog Username
If you need to change the Medium username, update in `script.js`:

```javascript
const response = await fetch(
    'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@onegrid'
);
```

Replace `@onegrid` with your Medium username.

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## ⚡ Performance

### Optimization Features
- Lazy loading for images
- Debounced scroll listeners
- GPU-accelerated animations
- Minimized reflows/repaints
- Efficient particle system (max 50 particles)
- Intersection Observer for scroll animations

### Loading Performance
- No external dependencies except Google Fonts
- All JavaScript is vanilla (no frameworks)
- CSS is optimized with minimal specificity
- Total page weight: ~50KB (before images)

## 🧪 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android)

## 🔧 Advanced Features

### Live Platform Ticker
The ticker updates every 2 seconds with:
- Units managed (starting at 1M, growing daily)
- Daily units (+32.8K per day)
- 10% monthly capacity growth simulation

### Energy Flow Visualization
- SVG-based particle animations
- Smooth bezier curve paths
- Multiple particles with staggered timing
- Floating energy orbs

### Medium Blog Auto-Update
- Fetches latest posts on page load
- Falls back to placeholder content if fetch fails
- Updates automatically when new posts are published
- Displays post title, excerpt, and image

## 📞 Support

For questions or issues:
- Email: hello@onegrid.in
- Medium: [@onegrid](https://medium.com/@onegrid)

## 📄 License

© 2026 OneGrid. All rights reserved.

---

Built with ⚡ for India's renewable energy future.
