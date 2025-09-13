document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     Load Header
  ====================== */
  fetch('../../components/header.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('headerContainer').innerHTML = data;

      // Mobile menu toggle
      const menuToggle = document.getElementById('menuToggle');
      const mobileMenu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('overlay');

      if (menuToggle && mobileMenu && overlay) {
        menuToggle.addEventListener('click', () => {
          const isOpen = mobileMenu.classList.toggle('active');
          overlay.classList.toggle('active', isOpen);
          menuToggle.setAttribute('aria-expanded', isOpen);
        });

        overlay.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          overlay.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', false);
        });
      }
    })
    .catch(err => console.error('Failed to load header:', err));

  /* ======================
     Load Footer
  ====================== */
  fetch('../../components/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footerContainer').innerHTML = data;
    })
    .catch(err => console.error('Failed to load footer:', err));

  /* ======================
     Build Table of Contents
  ====================== */
  const tocAside = document.getElementById('tocAside');
  const tocToggle = document.getElementById('tocToggle');
  const tocList = document.getElementById('tocList');

  if (tocAside && tocToggle && tocList) {
    tocToggle.addEventListener('click', () => tocAside.classList.toggle('active'));

    // Close TOC when clicking outside
    document.addEventListener('click', (e) => {
      if (!tocAside.contains(e.target) && !tocToggle.contains(e.target)) {
        tocAside.classList.remove('active');
      }
    });

    // Add blog title at the top
    const blogTitle = document.querySelector('main h1')?.textContent || "Blog Post";
    const titleEl = document.createElement('h2');
    titleEl.className = "toc-blog-title";
    titleEl.textContent = blogTitle;
    tocList.parentElement.insertBefore(titleEl, tocList);

    // Populate TOC from h2 and h3 headings
    const headings = document.querySelectorAll('main h2, main h3');
    let currentUl = tocList;

    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `heading-${index+1}`;

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent;

      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(heading.id);
        if (!target) return;

        const headerHeight = document.getElementById('headerContainer')?.offsetHeight || 80;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
        const scrollPosition = targetTop - headerHeight - (window.innerHeight / 2) + (target.offsetHeight / 2);

        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });

        tocAside.classList.remove('active');
      });

      li.appendChild(a);

      if (heading.tagName === 'H2') {
        tocList.appendChild(li);
        currentUl = document.createElement('ul');
        li.appendChild(currentUl);
      } else if (heading.tagName === 'H3') {
        currentUl.appendChild(li);
      }
    });
  }

  /* ======================
     Load Recommended Posts
  ====================== */
  const recommendedContainer = document.getElementById('recommendedPosts');

  if (recommendedContainer) {
    fetch('../../components/posts.html')
      .then(res => res.text())
      .then(data => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data;

        const allPosts = Array.from(tempDiv.querySelectorAll('article.post-card'));

        // Exclude current post
        const currentTitle = document.querySelector('main h1')?.textContent;
        const filteredPosts = allPosts.filter(post => {
          const postTitle = post.querySelector('h3 a')?.textContent;
          return postTitle !== currentTitle;
        });

        // Shuffle and pick first 3
        const shuffled = filteredPosts.sort(() => Math.random() - 0.5);
        recommendedContainer.innerHTML = '';
        shuffled.slice(0, 3).forEach(post => recommendedContainer.appendChild(post.cloneNode(true)));
      })
      .catch(err => console.error('Failed to load recommended posts:', err));
  }

});
