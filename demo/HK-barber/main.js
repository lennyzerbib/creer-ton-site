/* ═══════════════════════════════════════════════════════
   HK Barber Demo - Apple HIG Interactions
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ── Header Blur on Scroll (iOS NavBar pattern) ── */
    const header = document.getElementById('header');

    const handleScroll = () => {
        // HIG specifies thin material applies on scroll
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    /* ── Mobile Tab Bar Navigation ── */
    const tabItems = document.querySelectorAll('.tab-item');

    tabItems.forEach(tab => {
        tab.addEventListener('click', function (e) {
            // Remove active from all
            tabItems.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');

            // Allow default anchor jump, but provide haptic feedback simulation
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(10); // Subtle haptic tap
            }
        });
    });

    /* ── Intersection Observer for Section Highlighting ── */
    // Updates the active tab bar icon based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const scrollObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Update Tab bar
                tabItems.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.getAttribute('href') === `#${id}`) {
                        tab.classList.add('active');
                    }
                });
            }
        });
    }, scrollObserverOptions);

    sections.forEach(sec => scrollObserver.observe(sec));

    /* ── Smooth Scroll w/ Spring Simulation ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                // Offset calculation (header + safety)
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth' /* Browsers will use native smooth scrolling */
                });
            }
        });
    });

    /* ── Scroll Animations (HIG Fluid Reveal) ── */
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use requestAnimationFrame for buttery smooth 60fps addition
                window.requestAnimationFrame(() => {
                    entry.target.classList.add('active');
                });
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it comes into view
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});
