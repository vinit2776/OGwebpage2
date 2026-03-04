// OneGrid - Interactive Website JavaScript

// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// PARTICLE SYSTEM
// ============================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', debounce(() => this.resize(), 250));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ============================================
// ENERGY CIRCUIT LINES
// ============================================

function generateEnergyCircuits() {
    const circuit = document.getElementById('energyCircuit');
    if (!circuit) return;

    // Clear existing circuits
    circuit.innerHTML = '';

    // Create horizontal lines
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line horizontal';
        line.style.top = `${Math.random() * 100}%`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDelay = `${Math.random() * 3}s`;
        circuit.appendChild(line);
    }

    // Create vertical lines
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line vertical';
        line.style.top = `${Math.random() * 100}%`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDelay = `${Math.random() * 3}s`;
        circuit.appendChild(line);
    }
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================

function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.transform = `scaleX(${Math.min(progress / 100, 1)})`;
}

// ============================================
// NAVIGATION
// ============================================

function setupNavigation() {
    const nav = document.getElementById('mainNav');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when link is clicked
    if (navLinks) {
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80; // Nav height
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Special handling for different sections
                handleSectionAnimation(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Observe platform sides
    document.querySelectorAll('.platform-side').forEach(side => {
        observer.observe(side);
    });

    // Observe cards
    document.querySelectorAll('.challenge-card, .feature-card, .benefit-card, .blog-card, .agent-card').forEach(card => {
        observer.observe(card);
    });
}

function handleSectionAnimation(section) {
    // Challenge cards stagger animation
    if (section.classList.contains('challenge')) {
        const cards = section.querySelectorAll('.challenge-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 150);
        });
    }

    // Agent / Feature cards stagger
    if (section.classList.contains('platform-features')) {
        const cards = section.querySelectorAll('.agent-card, .feature-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 150);
        });
    }

    // Benefit cards stagger
    if (section.classList.contains('benefits')) {
        const cards = section.querySelectorAll('.benefit-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 80);
        });
    }

    // Impact counter animation
    if (section.id === 'impact') {
        animateCounter();
    }

    // Blog cards stagger
    if (section.id === 'insights') {
        const cards = section.querySelectorAll('.blog-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 150);
        });
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================

let counterAnimated = false;

function animateCounter() {
    if (counterAnimated) return;
    counterAnimated = true;

    const counter = document.getElementById('impactCounter');
    if (!counter) return;

    const target = 120000;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ============================================
// LIVE PLATFORM TICKER
// ============================================

// ============================================
// MEDIUM BLOG INTEGRATION
// ============================================

async function loadMediumPosts() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;

    try {
        // Using RSS2JSON service to fetch Medium RSS feed
        const response = await fetch(
            'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@onegrid'
        );

        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
            // Get first 3 posts
            const posts = data.items.slice(0, 3);

            // Clear skeleton loaders
            blogGrid.innerHTML = '';

            // Create blog cards
            posts.forEach((post, index) => {
                const card = createBlogCard(post, index);
                blogGrid.appendChild(card);
            });
        } else {
            showFallbackBlogPosts();
        }
    } catch (error) {
        console.error('Error loading Medium posts:', error);
        showFallbackBlogPosts();
    }
}

function createBlogCard(post, index) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.style.transitionDelay = `${index * 0.1}s`;

    // Extract image from content if available
    const imgMatch = post.content ? post.content.match(/<img[^>]+src="([^">]+)"/) : null;
    const imageUrl = post.thumbnail || (imgMatch ? imgMatch[1] : null);

    // Clean excerpt
    const excerpt = post.description
        ? post.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...'
        : 'Read more on Medium...';

    card.innerHTML = `
        <div class="blog-image">
            ${imageUrl ? `<img src="${imageUrl}" alt="${post.title}" loading="lazy">` :
                '<span style="font-size: 48px;">📝</span>'}
        </div>
        <div class="blog-content">
            <div class="blog-title">${post.title}</div>
            <div class="blog-excerpt">${excerpt}</div>
            <a href="${post.link}" target="_blank" rel="noopener" class="blog-link">Read More →</a>
        </div>
    `;

    return card;
}

function showFallbackBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;

    blogGrid.innerHTML = `
        <div class="blog-card">
            <div class="blog-image">
                <span style="font-size: 48px;">📝</span>
            </div>
            <div class="blog-content">
                <div class="blog-title">Latest Insights on Renewable Energy</div>
                <div class="blog-excerpt">Explore our latest thoughts on renewable energy management, C&I solutions, and the future of clean power in India.</div>
                <a href="https://medium.com/@onegrid" target="_blank" rel="noopener" class="blog-link">Visit Medium →</a>
            </div>
        </div>
        <div class="blog-card">
            <div class="blog-image">
                <span style="font-size: 48px;">💡</span>
            </div>
            <div class="blog-content">
                <div class="blog-title">Industry Perspectives</div>
                <div class="blog-excerpt">Deep dives into energy management, platform intelligence, and how technology is transforming industrial energy consumption.</div>
                <a href="https://medium.com/@onegrid" target="_blank" rel="noopener" class="blog-link">Read More →</a>
            </div>
        </div>
        <div class="blog-card">
            <div class="blog-image">
                <span style="font-size: 48px;">🌱</span>
            </div>
            <div class="blog-content">
                <div class="blog-title">Thought Leadership</div>
                <div class="blog-excerpt">Analysis and insights from Vinit Chordia on the renewable energy landscape and sustainable business practices.</div>
                <a href="https://medium.com/@onegrid" target="_blank" rel="noopener" class="blog-link">Learn More →</a>
            </div>
        </div>
    `;
}

// ============================================
// FORM HANDLING
// ============================================

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(object)
            });

            if (response.ok) {
                alert('Thank you! Your message has been sent successfully. We will get back to you soon.');
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            alert('Oops! There was a problem sending your message. Please email us directly at hello@onegrid.in');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const particlesCanvas = document.getElementById('particles-canvas');
    if (particlesCanvas) {
        new ParticleSystem(particlesCanvas);
    }

    // Generate energy circuits
    generateEnergyCircuits();

    // Setup navigation
    setupNavigation();

    // Setup intersection observer for animations
    setupIntersectionObserver();

    // Load Medium blog posts
    loadMediumPosts();

    // Setup contact form
    setupContactForm();

    // Scroll progress
    window.addEventListener('scroll', debounce(updateScrollProgress, 10));
    updateScrollProgress();
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Preload critical resources
const preloadLink = document.createElement('link');
preloadLink.rel = 'preload';
preloadLink.as = 'font';
preloadLink.type = 'font/woff2';
preloadLink.crossOrigin = 'anonymous';
document.head.appendChild(preloadLink);
