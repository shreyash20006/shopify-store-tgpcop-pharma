/* TGPCOP PHARMA — theme.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Menu ── */
  const toggle  = document.getElementById('MobileMenuToggle');
  const menu    = document.getElementById('MobileMenu');
  const close   = document.getElementById('MobileMenuClose');
  const overlay = menu && menu.querySelector('.mobile-menu-overlay');

  function openMenu()  { menu && menu.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { menu && menu.classList.remove('active'); document.body.style.overflow = ''; }

  toggle  && toggle.addEventListener('click', openMenu);
  close   && close.addEventListener('click', closeMenu);
  overlay && overlay.addEventListener('click', closeMenu);

  /* ── Counter Animation ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString('en-IN');
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ── Product Filter Tabs ── */
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.closest('.product-filter-tabs');
      group && group.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      document.querySelectorAll('.product-card-wrap').forEach(card => {
        if (!filter || filter === 'all') {
          card.style.display = '';
        } else {
          card.style.display = card.dataset.type === filter ? '' : 'none';
        }
      });
    });
  });

  /* ── Sticky Header shrink on scroll ── */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('header-scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── Scroll-reveal fade-up ── */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  /* ── Cart: AJAX add-to-cart feedback ── */
  const productForms = document.querySelectorAll('form[action="/cart/add"]');
  productForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn ? btn.innerHTML : '';
      if (btn) { btn.innerHTML = '✓ Added!'; btn.disabled = true; }
      try {
        const data = new FormData(form);
        await fetch('/cart/add.js', { method: 'POST', body: data });
        updateCartCount();
      } catch (_) {}
      setTimeout(() => {
        if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
      }, 1800);
    });
  });

  async function updateCartCount() {
    try {
      const res  = await fetch('/cart.js');
      const cart = await res.json();
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.item_count;
        el.style.display = cart.item_count > 0 ? 'flex' : 'none';
      });
    } catch (_) {}
  }
  updateCartCount();

  /* ── Newsletter form ── */
  const nlForm = document.getElementById('NewsletterForm');
  nlForm && nlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('NewsletterSuccess');
    if (msg) { msg.style.display = 'block'; }
    nlForm.reset();
  });

  /* ── Announcement bar marquee restart on visibility ── */
  document.addEventListener('visibilitychange', () => {
    const marqueeSpan = document.querySelector('.announcement-text');
    if (marqueeSpan && !document.hidden) {
      marqueeSpan.style.animation = 'none';
      requestAnimationFrame(() => { marqueeSpan.style.animation = ''; });
    }
  });

  /* ── Cart quantity buttons ── */
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.qty-selector')?.querySelector('.qty-input');
      if (!input) return;
      const val = parseInt(input.value, 10) || 1;
      if (btn.dataset.action === 'minus') input.value = Math.max(1, val - 1);
      if (btn.dataset.action === 'plus')  input.value = val + 1;
    });
  });

});
