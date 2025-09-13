// ========================
// ELEMENT SELECTORS
// ========================

let ticking = false;
let lastScrollTop = 0;
let isHidden = false;
const SCROLL_DELTA = 50;

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-nav'); // use class, not ID
const overlay = document.getElementById('overlay');

const topHeader = document.querySelector('.header');

const asideToggle = document.getElementById('asideToggle');
const pullAside = document.getElementById('pullAside');
const toggleAsideBtn = document.getElementById('toggleAsideBtn'); // Make sure this exists

const revealTipBtn = document.getElementById('revealTip');
const demoText = document.getElementById('demo');

// ========================
// MOBILE MENU TOGGLE
// ========================
function toggleMenu() {
  const isActive = mobileMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = isActive ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close menus on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (mobileMenu.classList.contains('active')) toggleMenu();
    if (pullAside.classList.contains('open')) closeAside();
  }
});

// ========================
// PULL-ASIDE TOGGLE
// ========================
asideToggle.addEventListener('click', () => {
  pullAside.classList.toggle('open');
});

function closeAside() {
  pullAside.classList.remove('open');
  if (toggleAsideBtn) toggleAsideBtn.setAttribute('aria-expanded', false);
}

if (toggleAsideBtn) {
  toggleAsideBtn.addEventListener('click', () => {
    const isOpen = pullAside.classList.toggle('open');
    toggleAsideBtn.setAttribute('aria-expanded', isOpen);
  });
}

// ========================
// PULL-ASIDE POSITION UPDATE
// ========================
function updateAsidePosition() {
  const headerHeight = topHeader.offsetHeight;
  pullAside.style.top = `${headerHeight}px`;
  pullAside.style.height = `calc(100vh - ${headerHeight}px)`;
}

// Call on load and resize
['DOMContentLoaded', 'load', 'resize'].forEach(evt => {
  window.addEventListener(evt, updateAsidePosition);
});

window.addEventListener('load', () => setTimeout(updateAsidePosition, 50));

// Ensure aside is closed on load
window.addEventListener('DOMContentLoaded', () => {
  updateAsidePosition();
  pullAside.classList.remove('open');
});

// ========================
// SCROLL HANDLER
// ========================
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (typeof updateHeader === 'function') updateHeader(window.scrollY);
      updateAsidePosition();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll);

// ========================
// INTERACTIVE BLOG TIP
// ========================
revealTipBtn.addEventListener('click', () => {
  demoText.innerText = 'Tip: Write regularly and keep posts short but meaningful!';
});
