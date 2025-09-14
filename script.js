// ========================
// ELEMENT SELECTORS
// ========================
let ticking = false;
let lastScrollTop = 0;
let isHidden = false;
const SCROLL_DELTA = 50;

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-nav'); 
const overlay = document.getElementById('overlay');
const topHeader = document.querySelector('.header');
const pullAside = document.getElementById('pullAside');
const toggleAsideBtn = document.getElementById('toggleAsideBtn'); 
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
// PULL-ASIDE POSITION
// ========================
function updateAsidePosition() {
  const headerHeight = topHeader.offsetHeight;
  pullAside.style.top = `${headerHeight}px`;
  pullAside.style.height = `calc(100vh - ${headerHeight}px)`;
}

['DOMContentLoaded', 'load', 'resize'].forEach(evt => {
  window.addEventListener(evt, updateAsidePosition);
});

window.addEventListener('load', () => setTimeout(updateAsidePosition, 50));

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


