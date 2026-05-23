/* ============================================================
   KHUSHIE NITEEN MOHOD — PORTFOLIO SCRIPT
   ============================================================ */

'use strict';

/* ---------- Utility: debounce ---------- */
function debounce(fn, delay = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ---------- 1. STICKY NAVBAR ---------- */
const navbar      = document.getElementById('navbar');
const navLinks    = document.querySelectorAll('.nav-links a, .nav-mobile a');
const hamburger   = document.querySelector('.nav-hamburger');
const navMobile   = document.querySelector('.nav-mobile');
const scrollTopBtn = document.getElementById('scrollTop');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    scrollTopBtn.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ---------- 2. MOBILE HAMBURGER ---------- */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMobile.classList.toggle('open');
  document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---------- 3. ACTIVE NAV LINK on scroll ---------- */
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollMid = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollMid >= top && scrollMid < bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + section.id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', debounce(updateActiveNav, 60), { passive: true });
updateActiveNav();

/* ---------- 4. SCROLL REVEAL (IntersectionObserver) ---------- */
const revealElements = document.querySelectorAll(
  '.reveal, .timeline-item, .placeholder-card'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80 * (entry.target.dataset.delay || 0));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);

// Assign stagger delays to siblings
document.querySelectorAll('.timeline-item').forEach((el, i) => {
  el.dataset.delay = i;
});

document.querySelectorAll('.placeholder-card').forEach((el, i) => {
  el.dataset.delay = i;
});

revealElements.forEach(el => revealObserver.observe(el));

/* ---------- 5. PROGRESS BAR ANIMATION ---------- */
const progressFills = document.querySelectorAll('.edu-progress-fill');

const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const percent = target.dataset.percent;
        setTimeout(() => {
          target.style.width = percent + '%';
        }, 200);
        progressObserver.unobserve(target);
      }
    });
  },
  { threshold: 0.4 }
);

progressFills.forEach(bar => progressObserver.observe(bar));

/* ---------- 6. SCROLL TO TOP ---------- */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- 7. COUNTER ANIMATION (Stats) ---------- */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 1600;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = eased * target;

    el.textContent = isDecimal
      ? value.toFixed(2)
      : Math.floor(value) + (progress < 1 ? '' : '+');

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(2) : target + '+';
  }

  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.stat-number[data-target]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach(c => counterObserver.observe(c));

/* ---------- 8. SMOOTH SCROLL for nav links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- 9. CONTACT FORM (static redirect enabled) ---------- */

/* ============================================================
   PROJECTS DATA & INTERACTIVE GRID
   ============================================================ */
const projectsData = [
  {
    id: 1,
    title: 'CivicFix',
    category: 'Civic Issue Reporting Platform',
    icon: 'fa-city',
    details: [
      'Developed a platform to report and track public issues in real time.',
      'Implemented role-based dashboards (citizens, departments, admins) with secure JWT-based authentication.',
      'Integrated AI-driven validation for duplicate detection, spam filtering, and categorization.'
    ]
  },
  {
    id: 2,
    title: 'AtomTrack',
    category: 'Enterprise Web Application',
    icon: 'fa-bullseye',
    details: [
      'Built a goal setting/tracking portal using Next.js and Tailwind CSS with role-based workflows.',
      'Engineered strict validation logic (exactly 100% total weightage) and automated scoring formulas.',
      'Designed role-scoped analytics dashboards to visualize trends and a secure audit trail.'
    ]
  },
  {
    id: 3,
    title: 'QueueSmart',
    category: 'Queue Intelligence Platform',
    icon: 'fa-people-group',
    details: [
      'Developed a real-time queue prediction system for government offices.',
      'Enabled crowd reporting, live queue updates, and optimized appointment scheduling.',
      'Implemented analytics to identify peak hours and improve wait-time efficiency.'
    ]
  },
  {
    id: 4,
    title: 'TrustWise',
    category: 'AI Intelligence Pipeline',
    icon: 'fa-brain',
    details: [
      'Engineered a privacy-first AI system for multi-source research.',
      'Implemented concurrent data ingestion from research APIs with validation-based scoring.',
      'Built RAG-based synthesis to generate structured, citation-backed outputs.'
    ]
  },
  {
    id: 5,
    title: 'RailRoute Optimization',
    category: 'Web Application',
    icon: 'fa-train',
    details: [
      'Built a graph-based system optimizing railway routes using Dijkstra, Prims, and Kruskal algorithms.',
      'Implemented AVL trees for efficient train scheduling and data management.',
      'Designed an interactive interface to visualize routes.'
    ]
  },
  {
    id: 6,
    title: 'Student Record Management System',
    category: 'Database Management System',
    icon: 'fa-database',
    details: [
      'Built a secure system for storing and retrieving student academic data.',
      'Implemented structured data handling with CRUD operations and file-based persistence.'
    ]
  }
];

/* Build the project grid */
const projectsGrid = document.getElementById('projectsGrid');

if (projectsGrid) {
  projectsData.forEach((project, idx) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'View details for ' + project.title);
    card.dataset.delay = idx;
    card.id = 'project-card-' + project.id;

    card.innerHTML =
      '<div class="project-card-icon"><i class="fas ' + project.icon + '" aria-hidden="true"></i></div>' +
      '<div class="project-card-num">Project 0' + project.id + '</div>' +
      '<h3 class="project-card-title">' + project.title + '</h3>' +
      '<p class="project-card-category">' + project.category + '</p>' +
      '<div class="project-card-footer">' +
        '<span class="project-card-cta"><i class="fas fa-eye" aria-hidden="true"></i>&nbsp;View Details</span>' +
        '<i class="fas fa-arrow-right project-card-arrow" aria-hidden="true"></i>' +
      '</div>';

    card.addEventListener('click', () => openProjectModal(project));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(project);
      }
    });

    projectsGrid.appendChild(card);
    revealObserver.observe(card);
  });
}

/* ============================================================
   MODAL LOGIC
   ============================================================ */
const projectModal   = document.getElementById('projectModal');
const modalCloseBtn  = document.getElementById('modalClose');
const modalIconEl    = document.getElementById('modalIcon');
const modalCategoryEl = document.getElementById('modalCategory');
const modalTitleEl   = document.getElementById('modalTitle');
const modalBulletsEl = document.getElementById('modalBullets');

function openProjectModal(project) {
  modalIconEl.innerHTML    = '<i class="fas ' + project.icon + '" aria-hidden="true"></i>';
  modalCategoryEl.textContent = project.category;
  modalTitleEl.textContent = project.title;
  modalBulletsEl.innerHTML = project.details.map(function(d) {
    return '<li>' + d + '</li>';
  }).join('');

  projectModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Focus trap — focus the close button */
  requestAnimationFrame(() => modalCloseBtn.focus());
}

function closeProjectModal() {
  projectModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeProjectModal);
}

if (projectModal) {
  projectModal.addEventListener('click', function(e) {
    if (e.target === projectModal) closeProjectModal();
  });
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
    closeProjectModal();
  }
});
