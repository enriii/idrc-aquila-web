/* ============================================================
   XXI IDRC 2026 – Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Init Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ----------------------------------------------------------
     Navbar: scroll shadow + active link highlight
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  const updateNavbar = () => {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', scrolled);
    document.documentElement.style.setProperty('--nav-h', scrolled ? '80px' : '120px');
  };
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => observer.observe(s));

  /* ----------------------------------------------------------
     Hamburger menu
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');

  const closeMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navMobile.classList.remove('open');
    navMobile.setAttribute('aria-hidden', 'true');
    navbar.classList.remove('nav-open');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navMobile.classList.toggle('open', isOpen);
    navMobile.setAttribute('aria-hidden', String(!isOpen));
    navbar.classList.toggle('nav-open', isOpen);
  });

  // Close on mobile link click
  navMobile.querySelectorAll('.nav-mobile-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      closeMenu();
    }
  });

  /* ----------------------------------------------------------
     Schedule tabs
  ---------------------------------------------------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetDay = btn.dataset.day;

      tabBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach((p) => {
        p.classList.remove('active');
        p.hidden = true;
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panel = document.getElementById(`day${targetDay}`);
      if (panel) {
        panel.classList.add('active');
        panel.hidden = false;

        // Scroll to top of panel, below navbar + sticky tabs bar
        const tabsWrap = document.querySelector('.schedule-tabs-wrap');
        const offset = navbar.offsetHeight + (tabsWrap ? tabsWrap.offsetHeight : 0) + 16;
        const top = panel.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });

    // Keyboard navigation for tabs (← →)
    btn.addEventListener('keydown', (e) => {
      const allBtns = [...tabBtns];
      const idx = allBtns.indexOf(btn);
      if (e.key === 'ArrowRight') {
        allBtns[(idx + 1) % allBtns.length].focus();
        allBtns[(idx + 1) % allBtns.length].click();
      } else if (e.key === 'ArrowLeft') {
        allBtns[(idx - 1 + allBtns.length) % allBtns.length].focus();
        allBtns[(idx - 1 + allBtns.length) % allBtns.length].click();
      }
    });
  });

  /* ----------------------------------------------------------
     Fade-in on scroll (Intersection Observer)
  ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings by index
          const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in')];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
  );

  fadeEls.forEach((el) => fadeObserver.observe(el));

  /* ----------------------------------------------------------
     Smooth scroll for all anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     Sponsors marquee – duplicate items for seamless loop
  ---------------------------------------------------------- */
  const sponsorsGrid = document.querySelector('.sponsors-grid');
  if (sponsorsGrid) {
    [...sponsorsGrid.children].forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      sponsorsGrid.appendChild(clone);
    });
  }

  /* ----------------------------------------------------------
     Hero fade-in on load
  ---------------------------------------------------------- */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(32px)';
    heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      });
    });
  }

});
