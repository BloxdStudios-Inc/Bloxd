/* ============================================================
   SIGNAL — shared site behaviour
   - Theme toggle (light/dark), remembers choice in localStorage
   - Mobile nav open/close
   - Project category filtering (only runs if .filter-bar exists)
   ============================================================ */

(function initTheme(){
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('signal-theme'); } catch (e) { /* storage blocked, ignore */ }

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', theme);

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('signal-theme', next); } catch (e) { /* ignore */ }
      });
    }

    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
      });
    }

    // Project category filter — expects cards with data-category
    // and buttons with data-filter, inside .filter-bar
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
      const buttons = filterBar.querySelectorAll('.filter-btn');
      const cards = document.querySelectorAll('[data-category]');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.getAttribute('data-filter');
          cards.forEach(card => {
            const show = filter === 'all' || card.getAttribute('data-category') === filter;
            card.style.display = show ? '' : 'none';
          });
        });
      });
    }
  });
})();
