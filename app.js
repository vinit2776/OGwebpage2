/* OneGrid — interactive logic
   Calculator · Quiz · Blind Spot · CO2 counter · Scroll progress */

(function () {
  'use strict';

  // ─── Number formatters (Indian-style L / Cr) ──────────────
  function fmtINR(amountLakhs) {
    // input is in Lakhs (1L = 100,000)
    if (amountLakhs >= 100) {
      const cr = amountLakhs / 100;
      return '₹' + (cr >= 10 ? cr.toFixed(1) : cr.toFixed(2)) + 'Cr';
    }
    return '₹' + (amountLakhs >= 10 ? Math.round(amountLakhs) : amountLakhs.toFixed(1)) + 'L';
  }

  // ─── Rotating hero headline ────────────────────────────────
  const HEADLINES = [
    `You're <em>Already</em><br>Losing Money<br>on <em class="signal">Energy.</em>`,
    `Your Energy Bill<br>Has a <em>Hidden</em><br><em class="signal">Tax.</em>`,
    `Your Competitor<br>Just Cut Their<br><em class="signal">Energy Cost.</em>`,
    `You Don't Know<br>What Your Energy<br><em class="signal">Actually Costs.</em>`
  ];
  const heroHeadline = document.querySelector('.hero-headline');
  if (heroHeadline) {
    const idx = Math.floor(Math.random() * HEADLINES.length);
    heroHeadline.innerHTML = HEADLINES[idx];
  }

  // ─── Scroll progress ───────────────────────────────────────
  const bar = document.getElementById('scroll-bar');
  if (bar) {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── Cost Calculator ───────────────────────────────────────
  const spend = document.getElementById('spend');
  const facilities = document.getElementById('facilities');
  const sourcesEl = document.getElementById('sources');
  const spendVal = document.getElementById('spend-value');
  const facVal = document.getElementById('facilities-value');
  const srcCount = document.getElementById('sources-count');
  const outMonthly = document.getElementById('out-monthly');
  const outAnnual = document.getElementById('out-annual');
  const outSavings = document.getElementById('out-savings');

  function recalc() {
    const monthlySpendL = parseFloat(spend.value); // in Lakhs
    const nFacilities = parseInt(facilities.value, 10);
    const activeSources = sourcesEl.querySelectorAll('input[type="checkbox"]:checked').length || 1;

    // Leakage rate = 12% + (sources - 1) × 3%, capped at 24%
    const leak = Math.min(0.12 + (activeSources - 1) * 0.03, 0.24);
    const monthlyLoss = monthlySpendL * nFacilities * leak;
    const annualLoss = monthlyLoss * 12;
    const savings = annualLoss * 0.7;

    spendVal.textContent = '₹' + monthlySpendL + 'L';
    facVal.textContent = nFacilities + (nFacilities === 1 ? ' facility' : ' facilities');
    srcCount.textContent = activeSources + (activeSources === 1 ? ' active' : ' active');

    outMonthly.textContent = fmtINR(monthlyLoss);
    outAnnual.textContent = fmtINR(annualLoss);
    outSavings.textContent = fmtINR(savings);
  }

  if (spend && facilities && sourcesEl) {
    spend.addEventListener('input', recalc);
    facilities.addEventListener('input', recalc);
    sourcesEl.addEventListener('change', (e) => {
      // Toggle visual 'on' state on chip wrapper
      const chip = e.target.closest('.src-chip');
      if (chip) chip.classList.toggle('on', e.target.checked);
      recalc();
    });
    recalc();
  }

  // ─── Quiz ──────────────────────────────────────────────────
  const QUIZ = [
    {
      q: 'How do you currently track energy costs across your facility?',
      a: [
        { t: 'Spreadsheets updated manually', s: 1 },
        { t: 'Basic billing or ERP software', s: 2 },
        { t: 'Real-time monitoring dashboard', s: 3 }
      ]
    },
    {
      q: 'When your Power Factor drops, how quickly do you know?',
      a: [
        { t: 'When the penalty appears on the bill', s: 1 },
        { t: 'Within a few days, via manual check', s: 2 },
        { t: 'Same-day automated alert', s: 3 }
      ]
    },
    {
      q: 'How do you decide when to buy power from the exchange?',
      a: [
        { t: "We don't use the exchange", s: 1 },
        { t: 'Ad-hoc, based on whoever notices first', s: 2 },
        { t: 'Data-driven scheduling with forecasts', s: 3 }
      ]
    },
    {
      q: 'How many distinct power sources does your facility manage?',
      a: [
        { t: 'Just the grid', s: 1 },
        { t: 'Grid plus one more (solar or DG)', s: 2 },
        { t: 'Multiple: grid, OA solar, OA wind, DG, exchange', s: 3 }
      ]
    },
    {
      q: 'Do you know your exact landed cost per unit right now?',
      a: [
        { t: "No — I'd have to calculate it", s: 1 },
        { t: 'Approximately, within ₹1–2', s: 2 },
        { t: 'Yes, to the paisa, updated daily', s: 3 }
      ]
    }
  ];

  const RESULTS = [
    { min: 13, max: 15, grade: 'A', title: 'Optimised', body: "You're ahead of most facilities. A full audit would still find gaps." },
    { min: 10, max: 12, grade: 'B', title: 'Aware but Exposed', body: "You see some of the picture. The rest is costing you." },
    { min: 6, max: 9, grade: 'C', title: 'Flying Blind', body: "Significant exposure. You're losing money you haven't quantified yet." },
    { min: 0, max: 5, grade: 'D', title: 'Critical Risk', body: 'Every month without visibility is a guaranteed loss.' }
  ];

  const quizCard = document.getElementById('quiz-card');
  const quizResult = document.getElementById('quiz-result');
  const qNum = document.getElementById('q-num');
  const qTitle = document.getElementById('q-title');
  const qOptions = document.getElementById('q-options');
  const quizProgress = document.getElementById('quiz-progress');
  const quizGrade = document.getElementById('quiz-grade');
  const quizScore = document.getElementById('quiz-score');
  const quizVTitle = document.getElementById('quiz-verdict-title');
  const quizVBody = document.getElementById('quiz-verdict-body');
  const quizRetake = document.getElementById('quiz-retake');

  let qIdx = 0;
  let qTotal = 0;

  function renderQuiz() {
    if (!qNum) return;
    const item = QUIZ[qIdx];
    const num = String(qIdx + 1).padStart(2, '0');
    qNum.textContent = num;
    qTitle.textContent = item.q;
    qOptions.innerHTML = '';
    item.a.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'quiz__opt';
      b.innerHTML = `<span class="key">${String.fromCharCode(65 + i)}</span><span>${opt.t}</span><span class="arr">→</span>`;
      b.addEventListener('click', () => answerQuiz(opt.s, b));
      qOptions.appendChild(b);
    });
    // progress
    [...quizProgress.children].forEach((seg, i) => {
      seg.classList.toggle('done', i <= qIdx);
    });
  }

  function answerQuiz(score, btn) {
    // Lock every button immediately — prevents mis-clicks landing on the next question
    qOptions.querySelectorAll('.quiz__opt').forEach(b => { b.disabled = true; });
    btn.classList.add('selected');
    qTotal += score;

    const inner = document.getElementById('quiz-inner');

    // Brief pause so the green selection registers, then slide out
    setTimeout(() => {
      inner.classList.add('anim-out');

      // After slide-out (220ms), swap content and slide the new question in from right
      setTimeout(() => {
        inner.classList.remove('anim-out');
        qIdx++;
        if (qIdx >= QUIZ.length) {
          showQuizResult();
        } else {
          renderQuiz();
          // Double rAF ensures the new DOM is painted before the slide-in starts
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              inner.classList.add('anim-in');
              setTimeout(() => inner.classList.remove('anim-in'), 320);
            });
          });
        }
      }, 220); // matches quizSlideOut duration
    }, 260); // just enough to see the selected answer before it exits
  }

  function showQuizResult() {
    const r = RESULTS.find(x => qTotal >= x.min && qTotal <= x.max);
    quizGrade.textContent = r.grade;
    quizScore.textContent = qTotal;
    quizVTitle.textContent = r.title;
    quizVBody.textContent = r.body;
    quizCard.style.display = 'none';
    quizResult.classList.add('show');
  }

  function resetQuiz() {
    qIdx = 0;
    qTotal = 0;
    quizCard.style.display = '';
    quizResult.classList.remove('show');
    renderQuiz();
  }

  if (quizCard) {
    renderQuiz();
    quizRetake && quizRetake.addEventListener('click', resetQuiz);
  }

  // ─── Blind Spot Assessment ─────────────────────────────────
  const BS_QS = [
    'Can you see your real-time energy consumption right now — across all sources?',
    'Do you know the exact landed cost per unit from each of your power sources today?',
    'Can you predict your energy costs for next month within 10% confidence?'
  ];
  const BS_RES = [
    { yes: 3, glyph: '●', glyphColor: 'var(--signal)', title: 'In Control', body: 'Genuinely rare. A OneGrid audit will still surface savings.', tier: 1 },
    { yes: 2, glyph: '●', glyphColor: '#E4D03F', title: 'Partially Visible', body: 'You have some coverage. The gaps are where the losses hide.', tier: 2 },
    { yes: 1, glyph: '●', glyphColor: '#E68B3F', title: 'Exposed', body: "Two-thirds of your energy picture is dark. That's expensive.", tier: 3 },
    { yes: 0, glyph: '●', glyphColor: '#C8462E', title: 'Critical', body: "You're operating completely blind. This is not a future risk — it's a current loss.", tier: 4 }
  ];

  const bsCard = document.getElementById('bs-card');
  const bsResult = document.getElementById('bs-result');
  const bsQ = document.getElementById('bs-q');
  const bsNum = document.getElementById('bs-num');
  const bsTier = document.getElementById('bs-tier');
  const bsDot = document.getElementById('bs-dot');
  const bsTierNum = document.getElementById('bs-tier-num');
  const bsYesCount = document.getElementById('bs-yes-count');
  const bsTitle = document.getElementById('bs-title');
  const bsBody = document.getElementById('bs-body');
  const bsRetake = document.getElementById('bs-retake');

  let bsIdx = 0;
  let bsYes = 0;

  function renderBS() {
    if (!bsQ) return;
    bsQ.textContent = BS_QS[bsIdx];
    bsNum.textContent = String(bsIdx + 1).padStart(2, '0');
  }

  function answerBS(ans) {
    if (ans === 'yes') bsYes++;
    bsIdx++;
    if (bsIdx >= BS_QS.length) {
      const r = BS_RES.find(x => x.yes === bsYes);
      bsTier.textContent = r.tier;
      bsDot.style.color = r.glyphColor;
      bsDot.textContent = r.glyph;
      bsTierNum.textContent = r.tier;
      bsYesCount.textContent = bsYes;
      bsTitle.textContent = r.title;
      bsBody.textContent = r.body;
      bsCard.style.display = 'none';
      bsResult.classList.add('show');
    } else {
      renderBS();
    }
  }

  function resetBS() {
    bsIdx = 0;
    bsYes = 0;
    bsCard.style.display = '';
    bsResult.classList.remove('show');
    renderBS();
  }

  if (bsCard) {
    bsCard.querySelectorAll('.bs__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.add('selected');
        setTimeout(() => {
          btn.classList.remove('selected');
          answerBS(btn.dataset.ans);
        }, 200);
      });
    });
    bsRetake && bsRetake.addEventListener('click', resetBS);
    renderBS();
  }

  // ─── CO2 counter ───────────────────────────────────────────
  const counterEl = document.getElementById('co2-counter');
  if (counterEl) {
    const target = parseInt(counterEl.dataset.target, 10);
    let started = false;
    const fmt = new Intl.NumberFormat('en-IN');

    function animateCounter() {
      if (started) return;
      started = true;
      const dur = 2000;
      const t0 = performance.now();
      function tick(t) {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.floor(target * eased);
        counterEl.textContent = fmt.format(v);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter();
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(counterEl);
  }

  // ─── Active nav link on scroll ─────────────────────────────
  const navLinks = document.querySelectorAll('.nav__links a');
  const sections = [...document.querySelectorAll('section[id]')];
  if (navLinks.length && sections.length) {
    const setActive = () => {
      const y = window.scrollY + 140;
      let current = sections[0]?.id;
      for (const s of sections) {
        if (s.offsetTop <= y) current = s.id;
      }
      navLinks.forEach(a => {
        a.style.opacity = (a.getAttribute('href') === '#' + current) ? '1' : '';
      });
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  // ─── Contact form — web3forms AJAX ────────────────────────
  const contactForm = document.getElementById('contact-form');
  const contactSubmit = document.getElementById('contact-submit');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      contactSubmit.disabled = true;
      contactSubmit.textContent = 'Sending…';

      const data = new FormData(contactForm);
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data
        });
        const json = await res.json();
        if (json.success) {
          formStatus.style.display = 'block';
          formStatus.style.color = 'var(--signal-deep)';
          formStatus.textContent = "✓ Message sent. We'll be in touch within one business day.";
          contactForm.reset();
          contactSubmit.textContent = 'Sent';
        } else {
          throw new Error(json.message || 'Submission failed');
        }
      } catch (err) {
        formStatus.style.display = 'block';
        formStatus.style.color = 'var(--bleed)';
        formStatus.textContent = '✕ Something went wrong. Please email info@onegrid.in directly.';
        contactSubmit.disabled = false;
        contactSubmit.innerHTML = 'Send Message <span class="arrow">→</span>';
      }
    });
  }

  // ─── Case stories ──────────────────────────────────────────
  const CASES = [
    {
      loss: '₹2.5Cr',
      lossLabel: 'left before anyone noticed',
      tag: 'Pharma · Pune',
      hook: 'The Penalty They Never Caught',
      body: 'A pharma plant was paying ₹18L/month in power factor penalties — logged as "grid charges" for 14 months. No one questioned it. A OneGrid audit found it in 6 hours.'
    },
    {
      loss: '₹60L',
      lossLabel: 'saved by a competitor in the same zone',
      tag: 'Auto Components · Chennai',
      hook: 'The Exchange Window They Never Acted On',
      body: 'An OA solar user watched exchange prices drop to ₹2.8/unit every afternoon — and never acted. A competitor 40km away automated it. Same tariff zone. ₹60L difference.'
    },
    {
      loss: '₹8.4L',
      lossLabel: 'spent on diesel the grid didn\'t require',
      tag: 'Textiles · Coimbatore',
      hook: 'The Diesel They Didn\'t Need to Run',
      body: 'A textile mill ran DG sets for 11 hours last monsoon. The grid was stable for 7 of them. No real-time signal meant the DG ran anyway. ₹8.4L. Entirely avoidable.'
    },
    {
      loss: '₹1.1Cr',
      lossLabel: 'found in the first audit',
      tag: 'Cold Chain · Tamil Nadu',
      hook: 'Four Facilities. Four Different Costs. Nobody Knew.',
      body: 'Landed cost varied from ₹6.20 to ₹9.40/unit across 4 facilities — same state, same month. One had unmonitored solar. One had no PF correction. No visibility, no action.'
    },
    {
      loss: '₹28.8L',
      lossLabel: 'cost of an 8-month delay',
      tag: 'Steel Processing · Tamil Nadu',
      hook: 'The Tariff Migration Nobody Tracked',
      body: 'They qualified for HT industrial tariffs 8 months before they switched. At ₹1.20/unit across 3 lakh units/month, the delay cost ₹28.8L. "We didn\'t have the data front of mind."'
    }
  ];

  const casesGrid = document.getElementById('cases-grid');
  if (casesGrid) {
    const shuffled = [...CASES].sort(() => Math.random() - 0.5).slice(0, 3);
    casesGrid.innerHTML = shuffled.map(c => `
      <div class="case-card">
        <span class="case-card__tag">${c.tag}</span>
        <div>
          <div class="case-card__loss">${c.loss}</div>
          <div class="case-card__loss-label">${c.lossLabel}</div>
        </div>
        <h3 class="case-card__hook">${c.hook}</h3>
        <p class="case-card__body">${c.body}</p>
      </div>
    `).join('');
  }

  // ─── Insights — Medium RSS via rss2json ────────────────────
  const insightsGrid = document.getElementById('insights-grid');

  if (insightsGrid) {
    const RSS_URL = 'https://medium.com/feed/@onegrid';
    const API_URL = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(RSS_URL);

    function stripHtml(html) {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }

    function truncate(str, n) {
      const s = str.trim();
      return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s;
    }

    function readTime(content) {
      const words = stripHtml(content).split(/\s+/).length;
      return Math.max(1, Math.round(words / 200)) + ' min read';
    }

    function extractImage(html) {
      // Medium puts the cover image inside the description HTML — pull the first <img src>
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const img = tmp.querySelector('img');
      return img ? img.src : '';
    }

    function renderInsightCard(item) {
      const thumb = item.thumbnail || extractImage(item.description || '') || item.enclosure?.link || '';
      const tag = (item.categories && item.categories[0]) ? item.categories[0] : 'Insights';
      const excerpt = truncate(stripHtml(item.description), 160);
      const rt = readTime(item.content || item.description || '');

      return `<article class="insight">
        <div class="insight__cover" style="${thumb ? `background-image:url(${thumb});background-size:cover;background-position:center;` : ''}">
          ${!thumb ? '<span class="mono">cover · 16:10</span>' : ''}
        </div>
        <span class="insight__tag">${tag} · ${rt}</span>
        <h3 class="insight__title">${item.title}</h3>
        <p class="insight__excerpt">${excerpt}</p>
        <a href="${item.link}" target="_blank" rel="noopener" class="insight__cta">Read</a>
      </article>`;
    }

    fetch(API_URL)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok' && data.items && data.items.length) {
          insightsGrid.innerHTML = data.items.slice(0, 3).map(renderInsightCard).join('');
        }
        // If fetch fails silently, the static placeholder cards remain
      })
      .catch(() => { /* keep static cards */ });
  }

})();
