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
    });

  /* ======================
     Load Footer
  ====================== */
  fetch('../../components/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footerContainer').innerHTML = data;
    });

  /* ======================
     Build Table of Contents
  ====================== */
  const tocAside = document.getElementById('tocAside');
  const tocToggle = document.getElementById('tocToggle');
  const tocList = document.getElementById('tocList');

  if (tocAside && tocToggle && tocList) {
    // Toggle drawer
    tocToggle.addEventListener('click', () => tocAside.classList.toggle('active'));

    // Close TOC when clicking outside
    document.addEventListener('click', (e) => {
      if (!tocAside.contains(e.target) && !tocToggle.contains(e.target)) {
        tocAside.classList.remove('active');
      }
    });

    // Add Blog Title at the top
    const blogTitle = document.querySelector('main h1')?.textContent || "Blog Post";
    const titleEl = document.createElement('h2');
    titleEl.className = "toc-blog-title";
    titleEl.textContent = blogTitle;
    tocList.parentElement.insertBefore(titleEl, tocList);

    // Populate TOC from headings
    const headings = document.querySelectorAll('main h2, main h3');
    let currentUl = tocList;

    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `heading-${index+1}`;

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent;

      // Smooth scroll to heading
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(heading.id);
        if (!target) return;

        const headerHeight = document.getElementById('headerContainer')?.offsetHeight || 80;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
        const scrollPosition = targetTop - headerHeight - (window.innerHeight / 2) + (target.offsetHeight / 2);

        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });

        // Close TOC aside
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
  const recommendedContainer = document.querySelector('#recommendedPosts .post-cards-container');
  if (recommendedContainer) {
    fetch('../../components/posts.html')
      .then(res => res.text())
      .then(data => {
        // Convert HTML string to DOM nodes
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data;

        // Pick a few posts to recommend (e.g., first 3 posts)
        const posts = tempDiv.querySelectorAll('article.post-card');
        posts.forEach(post => {
          // Optional: skip the current blog post
          const postTitle = post.querySelector('h3 a')?.textContent;
          if (postTitle !== document.querySelector('main h1')?.textContent) {
            recommendedContainer.appendChild(post.cloneNode(true));
          }
        });
      });
  }

  document.addEventListener("DOMContentLoaded", () => {
  // Load related posts component
  const blogPostSection = document.querySelector('.blog-post');
  if (blogPostSection) {
    fetch('../../components/posts.html')
      .then(res => res.text())
      .then(data => {
        blogPostSection.insertAdjacentHTML('beforeend', data);

        // Shuffle and limit to 3 posts
        const recommendedContainer = document.getElementById("recommendedPosts");
        if (recommendedContainer) {
          const allPosts = Array.from(recommendedContainer.children);
          const shuffled = allPosts.sort(() => Math.random() - 0.5);
          recommendedContainer.innerHTML = "";
          shuffled.slice(0, 3).forEach(post => recommendedContainer.appendChild(post));
        }
      });
  }
});




});
