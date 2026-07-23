/**
 * DeCee Agency — Premium Landing Page JavaScript
 * Production-ready, vanilla JS, no frameworks
 */

(function () {
  'use strict';

  /* ============================================
     DOM READY
     ============================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initFAQ();
    initSmoothScroll();
    initContactForm();
  });

  /* ============================================
     LOADING SCREEN
     ============================================ */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    // Minimum display time for perceived performance
    const minLoadTime = 800;
    const startTime = performance.now();

    window.addEventListener('load', function () {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);

      setTimeout(function () {
        loader.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(function () {
          loader.style.display = 'none';
        }, 700);
      }, remaining);
    });
  }

  /* ============================================
     NAVBAR SCROLL EFFECT
     ============================================ */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    function updateNavbar() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateNavbar();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check
    updateNavbar();
  }

  /* ============================================
     MOBILE MENU
     ============================================ */
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      const isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================
     SCROLL REVEAL (Intersection Observer)
     ============================================ */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (!revealElements.length) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve after reveal
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================
     ANIMATED COUNTERS
     ============================================ */
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const animatedCounters = new Set();

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animatedCounters.has(entry.target)) {
          animatedCounters.add(entry.target);
          animateCounter(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(function (counter) {
      observer.observe(counter);
    });

    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 2000; // ms
      const startTime = performance.now();
      const startValue = 0;

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out quart
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (target - startValue) * easeOut);

        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(update);
    }
  }

  /* ============================================
     FAQ ACCORDION
     ============================================ */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');
      if (!trigger || !content) return;

      trigger.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // Close all others (accordion behavior)
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.faq-content');
            if (otherContent) otherContent.classList.add('hidden');
          }
        });

        // Toggle current
        if (isActive) {
          item.classList.remove('active');
          content.classList.add('hidden');
        } else {
          item.classList.add('active');
          content.classList.remove('hidden');
        }
      });
    });
  }

  /* ============================================
     SMOOTH SCROLL (for anchor links)
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navbar = document.getElementById('navbar');
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ============================================
     CONTACT FORM
     ============================================ */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        submitBtn.textContent = "Message Sent!";
        submitBtn.classList.remove("bg-brand-accent", "hover:bg-blue-600");
        submitBtn.classList.add("bg-green-600");

        form.reset();
      } else {
        submitBtn.textContent = "Failed to Send";
        submitBtn.classList.remove("bg-brand-accent", "hover:bg-blue-600");
        submitBtn.classList.add("bg-red-600");
      }
    } catch (error) {
      submitBtn.textContent = "Error";
      submitBtn.classList.remove("bg-brand-accent", "hover:bg-blue-600");
      submitBtn.classList.add("bg-red-600");
    }

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.classList.remove("bg-green-600", "bg-red-600");
      submitBtn.classList.add("bg-brand-accent", "hover:bg-blue-600");
    }, 3000);
  });
}

  /* ============================================
     LAZY LOADING IMAGES (if any added later)
     ============================================ */
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    document.querySelectorAll('img[data-src]').forEach(function (img) {
      img.src = img.dataset.src;
      img.loading = 'lazy';
    });
  } else {
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length && 'IntersectionObserver' in window) {
      const lazyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            lazyObserver.unobserve(img);
          }
        });
      });
      lazyImages.forEach(function (img) {
        lazyObserver.observe(img);
      });
    }
  }

})();
