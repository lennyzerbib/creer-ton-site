/* ═══════════════════════════════════════════════════════
   creer-ton-site.fr — Interactions & Animations
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── Header scroll behaviour ── */
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Mobile menu ── */
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

function openMenu() {
    mobileMenu.hidden = false;
    burgerBtn.classList.add('open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}
function closeMenu() {
    mobileMenu.hidden = true;
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}
burgerBtn.addEventListener('click', () => {
    burgerBtn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
});

// Close on mobile link click
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

// Close on Escape
document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 72; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMenu();
    });
});

/* ── Intersection Observer — reveal animations ── */
const revealEls = document.querySelectorAll(
    '.service-card, .testimonial-card, .pricing-card, .faq-item, .feature-block, .stat, .process-step'
);
const revealObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
});

/* ── Counter animation for stats ── */
function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            const valueEl = entry.target.querySelector('.stat__value');
            const target = parseInt(valueEl.dataset.target, 10);
            animateCounter(valueEl, target);
            statsObserver.unobserve(entry.target);
        }
    }),
    { threshold: 0.5 }
);
document.querySelectorAll('.stat').forEach(stat => statsObserver.observe(stat));

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        const panelId = btn.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);

        // Close all
        document.querySelectorAll('.faq-question').forEach(b => {
            b.setAttribute('aria-expanded', 'false');
            const p = document.getElementById(b.getAttribute('aria-controls'));
            if (p) p.hidden = true;
        });

        // Open clicked (if was closed)
        if (!isOpen) {
            btn.setAttribute('aria-expanded', 'true');
            if (panel) panel.hidden = false;
        }
    });
});

/* ── Contact form ── */
const contactForm = document.getElementById('contactForm');
const ctaSuccess = document.getElementById('ctaSuccess');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // Loading state
        submitBtn.classList.add('btn--loading');
        submitBtn.disabled = true;

        // Simulate API call (replace with real endpoint)
        await new Promise(resolve => setTimeout(resolve, 1800));

        // Success
        contactForm.hidden = true;
        ctaSuccess.hidden = false;
    });
}

/* ── Scroll-to-top button ── */
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.setAttribute('aria-label', 'Retour en haut de page');
scrollTopBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`;
document.body.appendChild(scrollTopBtn);

const toggleScrollBtn = () => scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
window.addEventListener('scroll', toggleScrollBtn, { passive: true });
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Animate hero elements on load ── */
document.querySelectorAll('.animate-fade-up, .animate-fade-left').forEach(el => {
    el.addEventListener('animationend', () => { el.style.opacity = '1'; }, { once: true });
});

/* ── Active nav highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header__nav-link');

const navObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    },
    { rootMargin: '-30% 0px -60% 0px' }
);
sections.forEach(s => navObserver.observe(s));

/* ── Add active style ── */
const style = document.createElement('style');
style.textContent = `.header__nav-link.active{color:var(--c-900);font-weight:600}`;
document.head.appendChild(style);
