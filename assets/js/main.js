/* ===== NAVBAR SCROLL EFFECT ===== */
(function () {
  const navbar = document.querySelector('.site-navbar');
  const topbar = document.getElementById('topbar');
  if (!navbar) return;
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
      if (topbar) topbar.style.maxHeight = '0';
      if (topbar) topbar.style.overflow = 'hidden';
    } else {
      navbar.classList.remove('scrolled');
      if (topbar) topbar.style.maxHeight = '';
      if (topbar) topbar.style.overflow = '';
    }
  }
  window.addEventListener('scroll', onScroll);

  /* Close mobile menu on link click */
  document.querySelectorAll('.site-navbar .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('siteNav');
      if (collapse && collapse.classList.contains('show')) {
        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) toggler.click();
      }
    });
  });
})();

/* ===== ACTIVE NAV LINK ===== */
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-navbar .nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ===== SCROLL REVEAL ===== */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
})();

/* ===== LIFE AT MYERS TABS ===== */
(function () {
  const tabBtns = document.querySelectorAll('.life-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-area');
  if (!tabBtns.length) return;
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) {
        panel.classList.add('active');
        /* re-run reveal for newly visible elements */
        panel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
          const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); }}, { threshold: 0.05 });
          obs.observe(el);
        });
      }
    });
  });
})();

/* ===== ACCORDION SCHOOLS / HOUSES (Academics page) ===== */
(function () {
  document.querySelectorAll('.custom-accordion').forEach(acc => {
    acc.querySelectorAll('.accordion-button').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.accordion-item');
        const body = item.querySelector('.accordion-collapse');
        const isOpen = body.classList.contains('show');
        /* collapse all */
        acc.querySelectorAll('.accordion-collapse.show').forEach(b => {
          b.classList.remove('show');
          b.previousElementSibling.querySelector('.accordion-button').classList.remove('collapsed-active');
          b.previousElementSibling.querySelector('.accordion-button').setAttribute('aria-expanded','false');
        });
        if (!isOpen) {
          body.classList.add('show');
          btn.setAttribute('aria-expanded','true');
        }
      });
    });
  });
})();

/* ===== GOLD MEDALISTS SHOW MORE ===== */
(function () {
  const btn = document.getElementById('showMoreMedalists');
  const extra = document.getElementById('extraMedalists');
  if (!btn || !extra) return;
  let shown = false;
  btn.addEventListener('click', () => {
    shown = !shown;
    extra.style.display = shown ? '' : 'none';
    btn.innerHTML = shown
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg> Show Less'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> View All 19 Years';
  });
  if (extra) extra.style.display = 'none';
})();

/* ===== UNIVERSITY PLACEMENTS YEAR TABS ===== */
(function () {
  const yearBtns = document.querySelectorAll('.year-tab-btn');
  const yearPanels = document.querySelectorAll('.year-panel');
  if (!yearBtns.length) return;
  yearBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const year = btn.dataset.year;
      yearBtns.forEach(b => { b.classList.remove('btn-navy'); b.classList.add('btn-outline-light'); });
      btn.classList.add('btn-navy'); btn.classList.remove('btn-outline-light');
      yearPanels.forEach(p => p.style.display = 'none');
      const panel = document.getElementById('year-' + year);
      if (panel) panel.style.display = '';
    });
  });
})();

/* ===== CONTACT FORM ===== */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const toast = document.getElementById('successToast');
    if (toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 4000); }
    form.reset();
  });
})();

/* ===== NEWSLETTER FORM ===== */
(function () {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input) { input.value = ''; input.placeholder = 'Thanks for subscribing!'; setTimeout(() => { input.placeholder = 'Your email'; }, 3000); }
    });
  });
})();
