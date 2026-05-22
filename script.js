/**
 * Portfolio — Alex Morgan Style Theme
 * Handles: Theme Toggle, Mobile Nav, Scroll Animations, Active Nav, Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     THEME TOGGLE
     ============================================= */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else if (prefersDark) {
    htmlElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    const current = htmlElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.classList.remove('bx-moon');
      themeIcon.classList.add('bx-sun');
    } else {
      themeIcon.classList.remove('bx-sun');
      themeIcon.classList.add('bx-moon');
    }
  }

  /* =============================================
     MOBILE NAVIGATION
     ============================================= */
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');

  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('bx-menu');
      icon.classList.add('bx-x');
    } else {
      icon.classList.remove('bx-x');
      icon.classList.add('bx-menu');
    }
  });

  // Close mobile nav on link click
  document.querySelectorAll('#nav-links .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = mobileToggle.querySelector('i');
      icon.classList.remove('bx-x');
      icon.classList.add('bx-menu');
    });
  });

  /* =============================================
     NAVBAR SCROLL EFFECT (subtle shadow on scroll)
     ============================================= */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  /* =============================================
     ACTIVE NAVIGATION LINK ON SCROLL
     ============================================= */
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('#nav-links .nav-link');

  function setActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav);
  setActiveNav();

  /* =============================================
     SCROLL ANIMATIONS (Intersection Observer)
     ============================================= */
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation slightly for elements appearing at the same time
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animateElements.forEach((el, i) => {
    // Add a small stagger delay for items inside grids/lists
    const parent = el.parentElement;
    if (parent && (
      parent.classList.contains('work-list') ||
      parent.classList.contains('experience-list') ||
      parent.classList.contains('achievements-grid') ||
      parent.classList.contains('portfolio-grid') ||
      parent.classList.contains('skills-grid')
    )) {
      const siblings = Array.from(parent.querySelectorAll('.animate-on-scroll'));
      const idx = siblings.indexOf(el);
      el.dataset.delay = idx * 80;
    }
    observer.observe(el);
  });

  /* =============================================
     COUNTER ANIMATION (Stats)
     ============================================= */
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const text = el.textContent.trim();
    // Extract numeric part and suffix (e.g., "06+" -> 6, "+"; "14k+" -> 14, "k+")
    const match = text.match(/^(\d+)(.*)/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = match[2];
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = (target < 10 ? String(current).padStart(2, '0') : current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* =============================================
     SMOOTH SCROLL for anchor links
     ============================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});

/* =============================================
   CONTACT FORM HANDLER (Static — no backend)
   ============================================= */
function handleContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById('contact-submit-btn');
  const originalText = submitBtn.innerHTML;

  // Show loading state
  submitBtn.innerHTML = 'Sending... <i class="bx bx-loader-alt bx-spin"></i>';
  submitBtn.style.opacity = '0.8';
  submitBtn.disabled = true;

  // Gather form data
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value;

  // Build mailto link with pre-filled fields
  const mailtoLink = `mailto:mail.sandipanmukherjee@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  )}`;

  // Simulate a brief delay then open the email client
  setTimeout(() => {
    window.location.href = mailtoLink;
    form.reset();
    submitBtn.innerHTML = 'Message Sent! <i class="bx bx-check"></i>';
    submitBtn.style.background = '#10b981';

    // Reset button after 3 seconds
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.style.opacity = '1';
      submitBtn.disabled = false;
    }, 3000);
  }, 800);

  return false;
}
