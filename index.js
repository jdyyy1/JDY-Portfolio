// Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

  // Smooth active nav
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--amber)' : '';
    });
  });

  // Hover website preview panel
  document.addEventListener('DOMContentLoaded', () => {
    const previewLinks = document.querySelectorAll('.hover-preview');
    if (!previewLinks.length) return;

    // Create preview panel element
    const panel = document.createElement('div');
    panel.className = 'preview-panel';
    panel.innerHTML = `
      <div class="preview-header">
        <div class="preview-dots">
          <span class="preview-dot red"></span>
          <span class="preview-dot yellow"></span>
          <span class="preview-dot green"></span>
        </div>
        <div class="preview-title">Loading...</div>
      </div>
      <div class="preview-body">
        <div class="preview-overlay"></div>
        <iframe src="" class="preview-iframe" scrolling="no" loading="lazy"></iframe>
      </div>
    `;
    document.body.appendChild(panel);

    const previewIframe = panel.querySelector('.preview-iframe');
    const previewTitle = panel.querySelector('.preview-title');
    let hideTimeout;
    let activeUrl = '';

    // Click on panel redirects to the website URL
    panel.addEventListener('click', () => {
      if (activeUrl) {
        window.open(activeUrl, '_blank');
      }
    });

    previewLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        const url = link.getAttribute('href');
        const title = link.getAttribute('data-title') || link.getAttribute('data-url');
        
        activeUrl = url;
        
        // Only update source if changed
        if (previewIframe.src !== url) {
          previewTitle.textContent = "Loading " + title + "...";
          previewIframe.src = url;
        } else {
          previewTitle.textContent = title;
        }

        // Position the panel
        const linkRect = link.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        // Center panel horizontally above the link
        const panelWidth = 320;
        const panelHeight = 216; // 36px header/padding + 180px body height

        let left = linkRect.left + (linkRect.width / 2) - (panelWidth / 2) + scrollX;
        let top = linkRect.top - panelHeight - 12 + scrollY; // 12px space above link

        // Bounds checking (keep within window bounds)
        if (left < 10) left = 10;
        if (left + panelWidth > window.innerWidth - 10) {
          left = window.innerWidth - panelWidth - 10;
        }

        // If there's no space above, show it below the link instead
        if (linkRect.top - panelHeight - 12 < 0) {
          top = linkRect.bottom + 12 + scrollY;
        }

        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
        panel.classList.add('show');
      });

      link.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => {
          panel.classList.remove('show');
        }, 150); // Small delay to prevent flickering
      });
    });

    // Support hovering directly over the popup window to click it or see it
    panel.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
    });

    panel.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        panel.classList.remove('show');
      }, 150);
    });

    // When the iframe finishes loading, set title to normal
    previewIframe.addEventListener('load', () => {
      const matchedLink = Array.from(previewLinks).find(l => l.getAttribute('href') === previewIframe.src);
      if (matchedLink) {
        previewTitle.textContent = matchedLink.getAttribute('data-title') || matchedLink.getAttribute('data-url');
      }
    });
  });



  // Lightbox for certificates
  document.addEventListener('DOMContentLoaded', () => {
    const certWrappers = document.querySelectorAll('.cert-image-wrapper');
    if (certWrappers.length) {
      const lightbox = document.createElement('div');
      lightbox.className = 'cert-lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-close">&times;</div>
        <img class="lightbox-img" src="" alt="Certificate Preview">
      `;
      document.body.appendChild(lightbox);

      const lightboxImg = lightbox.querySelector('.lightbox-img');
      const closeBtn = lightbox.querySelector('.lightbox-close');

      certWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
          const img = wrapper.querySelector('.cert-img');
          if (img) {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
          }
        });
      });

      const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
      };

      closeBtn.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
          closeLightbox();
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          closeLightbox();
        }
      });
    }
  });