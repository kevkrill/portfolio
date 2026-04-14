'use strict';

/* =====================================================
   KEVIN KRILL — PORTFOLIO JAVASCRIPT
   Three responsibilities:
   1. Mobile nav toggle
   2. Scroll-reveal animations (Intersection Observer)
   3. Active nav link highlighting
   4. Footer year (always current)
   ===================================================== */


/* =====================================================
   1. MOBILE NAV TOGGLE
   ===================================================== */

const navToggle = document.querySelector('.nav__toggle');
const navMenu   = document.querySelector('.nav__menu');
const navLinks  = document.querySelectorAll('.nav__link');

function openMenu() {
  navMenu.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close navigation menu');
  // Prevent body from scrolling while menu is open
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navMenu.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation menu');
  document.body.style.overflow = '';
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });
}

// Close menu when a nav link is clicked (scrolls to section and closes)
navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside the nav
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav')) closeMenu();
});

// Close on Escape key — returns focus to the toggle button (keyboard accessibility)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
    closeMenu();
    navToggle.focus();
  }
});


/* =====================================================
   2. SCROLL-REVEAL — Intersection Observer

   IntersectionObserver fires a callback when elements
   enter/exit the viewport. Much more efficient than
   listening to the scroll event (which fires hundreds
   of times per second while scrolling).
   ===================================================== */

const animatedEls = document.querySelectorAll('.project-card, .fade-up');

if (animatedEls.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;

      // Stagger sibling cards by index for a cascade effect
      const delay = entry.target.classList.contains('project-card')
        ? i * 80   // 80ms between each card
        : 0;

      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, delay);

      // Stop watching once revealed — no need to re-animate
      observer.unobserve(entry.target);
    });
  }, {
    root: null,      // viewport
    threshold: 0.1   // trigger when 10% visible
  });

  animatedEls.forEach(el => revealObserver.observe(el));
}


/* =====================================================
   3. ACTIVE NAV LINK

   Uses a second IntersectionObserver to track which
   section is currently in the viewport and highlights
   the matching nav link.
   ===================================================== */

const sections = document.querySelectorAll('section[id]');

if (sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Remove active from all links
      navLinks.forEach(link => link.classList.remove('active'));

      // Add active to the link that matches this section's id
      const matchingLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
      if (matchingLink) matchingLink.classList.add('active');
    });
  }, {
    // Negative margins create a narrow "active zone" in the middle of the screen.
    // A section is only "active" when it's in the center portion of the viewport.
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(section => navObserver.observe(section));
}


/* =====================================================
   4. FOOTER YEAR
   Always shows the current year — never goes stale.
   ===================================================== */

const yearEl = document.getElementById('footer-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
