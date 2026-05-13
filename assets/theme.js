/*
  TGPCOP PHARMA - Shopify Theme JS
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu Toggle ---
  const mobileMenuToggle = document.getElementById('MobileMenuToggle');
  const mobileMenu = document.getElementById('MobileMenu');
  const mobileMenuClose = document.getElementById('MobileMenuClose');
  const mobileMenuOverlay = document.getElementById('MobileMenuOverlay');

  function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    const isExpanded = mobileMenu.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    mobileMenu.setAttribute('aria-hidden', !isExpanded);
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  }

  if (mobileMenuToggle && mobileMenuClose && mobileMenuOverlay) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileMenuClose.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
  }

  // --- Counter Animation (Trust Badges) ---
  const counters = document.querySelectorAll('.counter');
  
  const animateCounters = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.innerText = Math.ceil(current).toLocaleString('en-IN');
            requestAnimationFrame(updateCounter);
          } else {
            counter.innerText = target.toLocaleString('en-IN');
          }
        };

        updateCounter();
        observer.unobserve(counter); // Only animate once
      }
    });
  };

  const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter));

  // --- Product Grid Filtering ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productItems = document.querySelectorAll('.product-grid-item');

  if (filterTabs.length > 0 && productItems.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const filterValue = tab.getAttribute('data-filter');

        // Filter products
        productItems.forEach(item => {
          const tags = item.getAttribute('data-tags') || '';
          
          // Animate out
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            if (filterValue === 'all' || tags.includes(filterValue)) {
              item.style.display = 'block';
              // Animate in
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              }, 50);
            } else {
              item.style.display = 'none';
            }
          }, 300); // Wait for fade out
        });
      });
    });
  }
});
