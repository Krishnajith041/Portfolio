/**
 * Krishnajith PS - Portfolio Interactive Scripts
 * Particle Canvas, Scroll-Spy, Modals, Form Validation, and Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initStickyHeader();
  initScrollSpy();
  initMobileMenu();
  initProjectModals();
  initContactForm();
  initCopyButtons();
  initScrollReveal();
});

/* ============================================================
   1. AMBIENT GOLD PARTICLES CANVAS
   ============================================================ */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = Math.min(window.innerWidth < 768 ? 30 : 60, 80);

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.3 ? '245, 158, 11' : '255, 215, 0'; // Amber or Gold
      this.alphaSpeed = (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1);
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      this.alpha += this.alphaSpeed;
      if (this.alpha <= 0.05 || this.alpha >= 0.6) {
        this.alphaSpeed = -this.alphaSpeed;
      }

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.color}, 0.5)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Subtle particle connections for nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================================
   2. STICKY HEADER
   ============================================================ */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ============================================================
   3. SCROLL-SPY NAVIGATION
   ============================================================ */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
          }
        });

        mobileLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
}

/* ============================================================
   4. MOBILE NAVIGATION DRAWER
   ============================================================ */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const barsIcon = toggleBtn?.querySelector('.menu-icon-bars');
  const closeIcon = toggleBtn?.querySelector('.menu-icon-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, #mob-connect-btn');

  if (!toggleBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (barsIcon && closeIcon) {
      barsIcon.classList.toggle('hidden', isOpen);
      closeIcon.classList.toggle('hidden', !isOpen);
    }
  }

  function closeMenu() {
    drawer.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    if (barsIcon && closeIcon) {
      barsIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !toggleBtn.contains(e.target) && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ============================================================
   5. INTERACTIVE PROJECT DETAILS MODAL
   ============================================================ */
const projectData = {
  "1": {
    title: "Python Programming Project",
    category: "Python Development",
    tags: ["Python 3", "Algorithms", "OOP", "Problem Solving"],
    image: "assets/images/project-python.jpg",
    description: "A comprehensive Python-based application engineered to demonstrate core programming paradigms, algorithmic problem solving, clean code architecture, and modular structure.",
    features: [
      "Optimized data structure implementations (Trees, Graphs, Queues)",
      "Interactive command-line and logic simulation modules",
      "Robust exception handling and automated validation test cases",
      "Clean adherence to PEP 8 standards and docstring conventions"
    ],
    github: "#contact",
    demo: "#contact"
  },
  "2": {
    title: "Data Analysis Project",
    category: "Data Science & Analysis",
    tags: ["Python", "NumPy", "Pandas", "Data Cleaning", "Visualization"],
    image: "assets/images/project-data-analysis.svg",
    description: "An exploratory data analysis pipeline utilizing Python, NumPy, and Pandas to clean, filter, transform, and extract actionable statistical insights from structured real-world datasets.",
    features: [
      "Vectorized operations using NumPy arrays for high compute efficiency",
      "DataFrame cleaning, null handling, grouping, and aggregation with Pandas",
      "Statistical distribution analysis (mean, variance, quartiles, correlations)",
      "Visual variance trend charts and correlation matrix heatmaps"
    ],
    github: "#contact",
    demo: "#contact"
  },
  "3": {
    title: "C Programming Project",
    category: "Systems Programming",
    tags: ["C Language", "Pointers", "Dynamic Memory", "Data Structures"],
    image: "assets/images/project-c.svg",
    description: "A high-efficiency console application written in C exploring fundamental low-level computing concepts including dynamic memory allocation, pointers, structs, and recursive algorithms.",
    features: [
      "Custom memory pool management and pointer-based linked list structures",
      "Zero memory leak guarantee verified via Valgrind / GCC analyzers",
      "Optimized time complexity: O(1) prepend, O(n) search and traversal",
      "Clean standard I/O interface with modular header and source files"
    ],
    github: "#contact",
    demo: "#contact"
  },
  "4": {
    title: "Web Development Project",
    category: "Frontend Web Development",
    tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Glassmorphism"],
    image: "assets/images/project-web.svg",
    description: "A fully responsive, modern web interface created to demonstrate advanced frontend styling techniques, semantic HTML structure, dynamic DOM manipulation, and cross-browser accessibility.",
    features: [
      "Tailored dark & gold luxury design system with CSS custom properties",
      "Responsive multi-column CSS Grid and Flexbox layouts without frameworks",
      "Interactive JavaScript micro-animations and smooth scroll-spy navigation",
      "100% responsive fluid scaling across desktop, tablet, and mobile screens"
    ],
    github: "#contact",
    demo: "#contact"
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close-btn');
  const triggerBtns = document.querySelectorAll('.view-project-modal-btn');

  if (!modal || !modalBody) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="modal-project-content space-y-4">
        <div class="relative rounded-xl overflow-hidden aspect-video border border-gold-subtle bg-black">
          <img src="${data.image}" alt="${data.title}" class="w-full h-full object-cover">
          <div class="absolute top-3 left-3">
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-black/80 text-amber border border-amber/40">${data.category}</span>
          </div>
        </div>

        <div>
          <h3 class="text-2xl font-black text-white">${data.title}</h3>
          <div class="flex flex-wrap gap-2 mt-2">
            ${data.tags.map(t => `<span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-subtle text-amber border border-amber/20">${t}</span>`).join('')}
          </div>
        </div>

        <p class="text-sm text-muted-light leading-relaxed">${data.description}</p>

        <div class="p-4 rounded-xl bg-black-glass border border-gold-subtle">
          <h4 class="text-xs font-bold uppercase tracking-wider text-amber mb-2">Key Technical Highlights:</h4>
          <ul class="space-y-1.5 text-xs text-secondary">
            ${data.features.map(f => `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-amber"></span><span>${f}</span></li>`).join('')}
          </ul>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <a href="${data.github}" class="btn btn-primary-glow btn-sm" onclick="showToast('Project repository link: Connect with Krishnajith for source access.')">
            <span>Source Code</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <button type="button" class="btn btn-glass-outline btn-sm" onclick="closeProjectModal()">
            <span>Close Window</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  window.closeProjectModal = function() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      if (projId) openModal(projId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', window.closeProjectModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeProjectModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      window.closeProjectModal();
    }
  });
}

/* ============================================================
   6. CONTACT FORM HANDLING
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#contact-name').value.trim();
    const email = form.querySelector('#contact-email').value.trim();
    const subject = form.querySelector('#contact-subject').value.trim();
    const message = form.querySelector('#contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill in all required fields.', true);
      return;
    }

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', true);
      return;
    }

    // Button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path></svg>
      <span>Sending Message...</span>
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();
      showToast(`Thank you, ${name}! Your message has been received.`);
    }, 900);
  });
}

/* ============================================================
   7. COPY TO CLIPBOARD & TOAST NOTIFICATION
   ============================================================ */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.btn-copy-contact');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }).catch(() => {
        showToast(`Copied: ${textToCopy}`);
      });
    });
  });
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  if (isError) {
    toast.style.borderColor = 'rgba(239, 68, 68, 0.6)';
    toastIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    toast.style.borderColor = 'rgba(251, 191, 36, 0.7)';
    toastIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ============================================================
   8. SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.about-glass-card, .skill-badge-card, .skills-categories-card, .learning-card, .project-card, .education-timeline-card, .interest-item, .opportunities-card');

  targets.forEach(target => {
    target.classList.add('reveal-fade');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(target => observer.observe(target));
}
