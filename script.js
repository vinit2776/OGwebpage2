// OneGrid — script.js v5

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// ============================================
// SCROLL PROGRESS
// ============================================

function updateScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${Math.min(window.scrollY / total, 1)})`;
}

// ============================================
// NAVIGATION
// ============================================

function setupNavigation() {
    const toggle = document.getElementById('mobileMenuToggle');
    const links  = document.getElementById('navLinks');

    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('active'));
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => links.classList.remove('active'));
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// QUIZ
// ============================================

function setupQuiz() {
    const container = document.getElementById('quizContainer');
    if (!container) return;

    const questions  = container.querySelectorAll('.quiz-question');
    const progressBar   = document.getElementById('quizProgressBar');
    const progressLabel = document.getElementById('quizProgressLabel');
    const resultEl      = document.getElementById('quizResult');
    const retakeBtn     = document.getElementById('quizRetake');

    let currentQ = 0;
    let scores   = [];

    const total = questions.length;

    function updateProgress(q) {
        const pct = ((q) / total) * 100;
        if (progressBar)   progressBar.style.setProperty('--progress', pct + '%');
        if (progressLabel) progressLabel.textContent = q < total
            ? `Question ${q + 1} of ${total}`
            : 'Complete';
    }

    function showQuestion(index) {
        questions.forEach(q => q.classList.remove('active'));
        if (index < total) {
            questions[index].classList.add('active');
            updateProgress(index);
        }
    }

    function showResult() {
        updateProgress(total);
        const totalScore = scores.reduce((a, b) => a + b, 0);
        const maxScore   = total * 3;
        const pct        = (totalScore / maxScore) * 100;

        document.getElementById('quizQuestions').style.display = 'none';
        container.querySelector('.quiz-progress').style.display = 'none';
        resultEl.style.display = 'block';

        let scoreLabel, desc, scoreDisplay;

        if (pct <= 40) {
            scoreDisplay = 'D';
            scoreLabel   = 'Energy Blind';
            desc         = 'You have significant blind spots across visibility, accountability, and predictability. Based on industry benchmarks, you\'re likely losing 15–20% of your energy spend to invisible costs. The longer you wait, the more expensive it gets.';
            document.getElementById('quizResultScore').style.color = '#e05c4a';
        } else if (pct <= 65) {
            scoreDisplay = 'C';
            scoreLabel   = 'Partially Sighted';
            desc         = 'You have some tracking in place, but significant gaps remain. Anomalies are being caught late — or not at all. Most C&I facilities at this level are losing ₹20–50L annually to costs that real-time intelligence would have prevented.';
            document.getElementById('quizResultScore').style.color = '#E8A838';
        } else if (pct <= 85) {
            scoreDisplay = 'B';
            scoreLabel   = 'Energy Aware';
            desc         = 'You\'re ahead of most facilities, but there are still gaps — especially in predictability and exchange optimisation. A targeted upgrade to your intelligence layer could recover ₹10–30L annually.';
            document.getElementById('quizResultScore').style.color = '#A8D58C';
        } else {
            scoreDisplay = 'A';
            scoreLabel   = 'Fully Optimised';
            desc         = 'Excellent. You have strong energy intelligence in place. Talk to us about locking in those gains with fixed-tariff renewable power and integrating the OneGrid platform for even tighter control.';
            document.getElementById('quizResultScore').style.color = 'var(--pulse)';
        }

        document.getElementById('quizResultScore').textContent = scoreDisplay;
        document.getElementById('quizResultLabel').textContent = scoreLabel;
        document.getElementById('quizResultDesc').textContent  = desc;
    }

    // Wire up options
    container.querySelectorAll('.quiz-opt').forEach(btn => {
        btn.addEventListener('click', function () {
            const qEl    = this.closest('.quiz-question');
            const qIndex = parseInt(qEl.dataset.q);
            const score  = parseInt(this.dataset.score);

            // Highlight selected
            qEl.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');

            scores[qIndex] = score;

            // Advance after short delay
            setTimeout(() => {
                currentQ++;
                if (currentQ < total) {
                    showQuestion(currentQ);
                } else {
                    showResult();
                }
            }, 320);
        });
    });

    // Retake
    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            scores    = [];
            currentQ  = 0;
            resultEl.style.display = 'none';
            document.getElementById('quizQuestions').style.display = 'block';
            container.querySelector('.quiz-progress').style.display = 'flex';
            container.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected'));
            showQuestion(0);
        });
    }

    showQuestion(0);
}

// ============================================
// COST CALCULATOR
// ============================================

function setupCalculator() {
    const billSlider       = document.getElementById('calcBill');
    const facilitiesSlider = document.getElementById('calcFacilities');
    const billDisplay      = document.getElementById('calcBillDisplay');
    const facilitiesDisplay= document.getElementById('calcFacilitiesDisplay');

    if (!billSlider) return;

    function formatLakh(val) {
        if (val >= 100) return `₹${(val / 100).toFixed(1)} Cr`;
        return `₹${val.toFixed(1)} L`;
    }

    function calculateAndUpdate() {
        const monthlyBill  = parseFloat(billSlider.value) || 0;
        const facilities   = parseInt(facilitiesSlider.value) || 1;
        const sourcesCount = document.querySelectorAll('.source-check:checked').length;

        // Leakage: 12% base + 3% per additional source beyond the first
        const leakageRate   = 0.12 + Math.max(0, sourcesCount - 1) * 0.03;
        const monthlyLeak   = monthlyBill * leakageRate * facilities;
        const annualLoss    = monthlyLeak * 12;
        const annualSavings = annualLoss * 0.70;

        // Update displays
        if (billDisplay)       billDisplay.textContent       = formatLakh(monthlyBill) + ' / month';
        if (facilitiesDisplay) facilitiesDisplay.textContent = `${facilities} ${facilities === 1 ? 'Facility' : 'Facilities'}`;

        animateCalcValue('calcMonthlyLoss', monthlyLeak);
        animateCalcValue('calcAnnualLoss',  annualLoss);
        animateCalcValue('calcSavings',     annualSavings);
    }

    function animateCalcValue(id, target) {
        const el = document.getElementById(id);
        if (!el) return;

        // Format target value
        function fmt(v) {
            if (v >= 100) return `₹${(v / 100).toFixed(1)} Cr`;
            return `₹${v.toFixed(1)} L`;
        }
        el.textContent = fmt(target);
    }

    billSlider.addEventListener('input', calculateAndUpdate);
    facilitiesSlider.addEventListener('input', calculateAndUpdate);
    document.querySelectorAll('.source-check').forEach(cb => {
        cb.addEventListener('change', calculateAndUpdate);
    });

    calculateAndUpdate();
}

// ============================================
// BLIND SPOT ASSESSMENT
// ============================================

function setupAssessment() {
    const container = document.getElementById('assessmentContainer');
    if (!container) return;

    const retakeBtn = document.getElementById('assessmentRetake');
    let answers = {};

    function checkComplete() {
        if (Object.keys(answers).length === 3) {
            showAssessmentResult();
        }
    }

    function showAssessmentResult() {
        const yesCount = Object.values(answers).filter(v => v === 'yes').length;

        const resultEl = document.getElementById('assessmentResult');
        const ratings  = [
            {
                yes: 0,
                rating: '0/3',
                label: 'Critical Risk',
                desc: 'You have all three blind spots. You\'re operating without visibility, accountability, or predictability. Based on this profile, your facility is likely losing 15–20% of its energy spend monthly to costs you can\'t see, dispute, or prevent.',
                color: '#e05c4a'
            },
            {
                yes: 1,
                rating: '1/3',
                label: 'High Exposure',
                desc: 'Two blind spots remain. You have partial control — but partial control means partial losses. The gaps in your energy intelligence are likely costing ₹30–60L annually in penalties, missed exchange opportunities, and undisputed billing errors.',
                color: '#E8A838'
            },
            {
                yes: 2,
                rating: '2/3',
                label: 'Moderate Risk',
                desc: 'One blind spot. You\'re managing energy better than most — but that remaining gap is still expensive. Even a single missing dimension (visibility, accountability, or predictability) leaves money on the table every month.',
                color: '#A8D58C'
            },
            {
                yes: 3,
                rating: '3/3',
                label: 'Well Positioned',
                desc: 'You have strong energy intelligence in place. Consider whether your tools are truly integrated, real-time, and automated — or whether they depend on manual effort that could fail at the wrong moment.',
                color: 'var(--pulse)'
            }
        ];

        const result = ratings[yesCount];
        document.getElementById('arRating').textContent = result.rating;
        document.getElementById('arRating').style.color = result.color;
        document.getElementById('arLabel').textContent  = result.label;
        document.getElementById('arDesc').textContent   = result.desc;
        resultEl.style.display = 'block';
    }

    container.querySelectorAll('.aq-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const qIndex = parseInt(this.dataset.q);
            const val    = this.dataset.val;

            answers[qIndex] = val;

            // Update button states for this question
            const qEl = document.getElementById(`aq${qIndex}`);
            qEl.querySelectorAll('.aq-btn').forEach(b => {
                b.classList.remove('yes-selected', 'no-selected');
            });
            this.classList.add(val === 'yes' ? 'yes-selected' : 'no-selected');

            checkComplete();
        });
    });

    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            answers = {};
            document.getElementById('assessmentResult').style.display = 'none';
            container.querySelectorAll('.aq-btn').forEach(b => {
                b.classList.remove('yes-selected', 'no-selected');
            });
        });
    }
}

// ============================================
// INTERSECTION OBSERVER
// ============================================

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                handleSectionAnimation(entry.target);
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.section').forEach(s => observer.observe(s));
    document.querySelectorAll('.platform-side').forEach(s => observer.observe(s));
    document.querySelectorAll('.agent-row').forEach(s => observer.observe(s));
    document.querySelectorAll('.terminal').forEach(s => observer.observe(s));
    document.querySelectorAll('.transform-side').forEach(s => observer.observe(s));
    document.querySelectorAll('.stat-cell').forEach(s => observer.observe(s));
    document.querySelectorAll('.benefit-card').forEach(s => observer.observe(s));
    document.querySelectorAll('.blog-card').forEach(s => observer.observe(s));
    document.querySelectorAll('.incident-card').forEach(s => observer.observe(s));
    document.querySelectorAll('.assessment-q').forEach(s => observer.observe(s));
}

function handleSectionAnimation(el) {
    if (el.classList.contains('challenge')) {
        el.querySelectorAll('.challenge-item').forEach((item, i) => {
            setTimeout(() => item.classList.add('animate'), i * 150);
        });
    }

    if (el.classList.contains('agent-suite')) {
        el.querySelectorAll('.agent-row').forEach((row, i) => {
            setTimeout(() => row.classList.add('visible'), i * 150);
        });
    }

    if (el.classList.contains('agents-action')) {
        const terminal = el.querySelector('.terminal');
        if (terminal) terminal.classList.add('visible');
        el.querySelectorAll('.terminal-row').forEach((row, i) => {
            setTimeout(() => row.classList.add('animate'), 200 + i * 120);
        });
    }

    if (el.classList.contains('transformation')) {
        el.querySelectorAll('.transform-side').forEach((side, i) => {
            setTimeout(() => side.classList.add('visible'), i * 250);
        });
    }

    if (el.classList.contains('flagship-project')) {
        el.querySelectorAll('.stat-cell').forEach((cell, i) => {
            setTimeout(() => cell.classList.add('visible'), i * 100);
        });
    }

    if (el.classList.contains('benefits')) {
        el.querySelectorAll('.benefit-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 80);
        });
    }

    if (el.id === 'impact') animateCounter();

    if (el.id === 'insights') {
        el.querySelectorAll('.blog-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 150);
        });
    }

    if (el.classList.contains('incident-stories')) {
        el.querySelectorAll('.incident-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 120);
        });
    }

    if (el.classList.contains('blind-spot')) {
        el.querySelectorAll('.assessment-q').forEach((q, i) => {
            setTimeout(() => q.classList.add('visible'), i * 150);
        });
    }
}

// ============================================
// COUNTER
// ============================================

let counterAnimated = false;

function animateCounter() {
    if (counterAnimated) return;
    counterAnimated = true;
    const el = document.getElementById('impactCounter');
    if (!el) return;
    const target = 120000;
    let current  = 0;
    const step   = target / (2000 / 16);
    const timer  = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current).toLocaleString('en-IN');
    }, 16);
}

// ============================================
// MEDIUM BLOG
// ============================================

async function loadMediumPosts() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    try {
        const res  = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@onegrid');
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();

        if (data.status === 'ok' && data.items?.length) {
            grid.innerHTML = '';
            data.items.slice(0, 3).forEach((post, i) => {
                grid.appendChild(createBlogCard(post, i));
            });
            grid.querySelectorAll('.blog-card').forEach((card, i) => {
                setTimeout(() => card.classList.add('visible'), i * 150);
            });
        } else {
            showFallbackBlogPosts();
        }
    } catch {
        showFallbackBlogPosts();
    }
}

function createBlogCard(post, index) {
    const card     = document.createElement('div');
    card.className = 'blog-card';
    card.style.transitionDelay = `${index * 0.1}s`;

    const imgMatch = post.content?.match(/<img[^>]+src="([^">]+)"/);
    const imageUrl = post.thumbnail || (imgMatch ? imgMatch[1] : null);
    const excerpt  = post.description
        ? post.description.replace(/<[^>]+>/g, '').substring(0, 140) + '...'
        : 'Read more on Medium...';

    card.innerHTML = `
        <div class="blog-image">
            ${imageUrl ? `<img src="${imageUrl}" alt="${post.title}" loading="lazy">` : 'Insights'}
        </div>
        <div class="blog-content">
            <div class="blog-tag">Thought Leadership</div>
            <div class="blog-title">${post.title}</div>
            <div class="blog-excerpt">${excerpt}</div>
            <a href="${post.link}" target="_blank" rel="noopener" class="blog-link">Read More →</a>
        </div>
    `;
    return card;
}

function showFallbackBlogPosts() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    const posts = [
        { title: "Day One for Tamil Nadu's Energy Future", excerpt: "What CM Vijay's Clean Power Vision Means for Every Factory — and why the window to act is narrowing.", tag: 'Policy & Markets' },
        { title: 'The Tariff Rate Illusion', excerpt: 'Your TANGEDCO bill says ₹7.85. Your solar PPA says ₹3.50. Your DG set runs at ₹18. But none of these numbers tell you what you\'re actually paying.', tag: 'Energy Economics' },
        { title: 'Your Energy Manager Knows Everything. Your System Knows Nothing.', excerpt: 'The best energy managers carry decades of institutional knowledge. What happens when they retire?', tag: 'Intelligence' }
    ];

    grid.innerHTML = '';
    posts.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'blog-card visible';
        card.innerHTML = `
            <div class="blog-image">Insights</div>
            <div class="blog-content">
                <div class="blog-tag">${p.tag}</div>
                <div class="blog-title">${p.title}</div>
                <div class="blog-excerpt">${p.excerpt}</div>
                <a href="https://medium.com/@onegrid" target="_blank" rel="noopener" class="blog-link">Read on Medium →</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ============================================
// CONTACT FORM
// ============================================

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn  = form.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled    = true;

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body:    JSON.stringify(Object.fromEntries(new FormData(form)))
            });
            if (res.ok) {
                alert('Thank you — we\'ll be in touch within one business day.');
                form.reset();
            } else {
                throw new Error();
            }
        } catch {
            alert('There was a problem. Please email us directly at info@onegrid.in');
        } finally {
            btn.textContent = orig;
            btn.disabled    = false;
        }
    });
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupQuiz();
    setupCalculator();
    setupAssessment();
    setupIntersectionObserver();
    loadMediumPosts();
    setupContactForm();

    window.addEventListener('scroll', debounce(updateScrollProgress, 10));
    updateScrollProgress();
});
