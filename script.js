/* =============================================
   MORADA DO AÇAÍ - JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Page Loader
  const pageLoader = document.getElementById('pageLoader');
  setTimeout(() => {
    pageLoader.classList.add('hidden');
  }, 1800);

  // Header scroll effect
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = navLinks.querySelectorAll('a');

  function updateActiveNav() {
    const scrollPos = window.pageYOffset + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // Scroll reveal animations
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Counter animation for stats
  const statNumbers = document.querySelectorAll('.about-stat .number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * easeOut);

      if (target >= 1000) {
        element.textContent = current.toLocaleString('pt-BR') + '+';
      } else {
        element.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Back to top button
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Parallax-like effect on hero
  const hero = document.querySelector('.hero-bg img');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
      }
    });
  }

  // Add hover effects to specialty cards buttons
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', function() {
      const originalText = this.textContent;
      this.textContent = '✓ Adicionado!';
      this.style.background = '#25d366';
      setTimeout(() => {
        this.textContent = originalText;
        this.style.background = '';
      }, 1500);
    });
  });

  // Specialties Carousel
  const track = document.getElementById('carouselTrack');
  if (track) {
    const cards = Array.from(track.children);
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    let currentIndex = 0;

    function getCardsInView() {
      return window.innerWidth > 768 ? 2 : 1;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getCardsInView());
    }

    function setupDots() {
      dotsContainer.innerHTML = '';
      const maxIndex = getMaxIndex();
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateCarousel() {
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      const cardWidth = cards[0].getBoundingClientRect().width;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap) || 0;

      const moveAmount = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${moveAmount}px)`;

      // Update dots
      const dots = Array.from(dotsContainer.children);
      if (dots.length !== maxIndex + 1) {
        setupDots();
      } else {
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }

      // Update button states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === maxIndex;
    }

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < getMaxIndex()) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Touch Swipe Logic for Mobile
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - startX;

      if (Math.abs(diffX) > 40) {
        if (diffX > 0 && currentIndex > 0) {
          currentIndex--;
        } else if (diffX < 0 && currentIndex < getMaxIndex()) {
          currentIndex++;
        }
        updateCarousel();
      }
      isDragging = false;
    });

    // Initialize carousel
    setupDots();
    updateCarousel();

    // Re-setup on window resize
    window.addEventListener('resize', () => {
      setupDots();
      updateCarousel();
    });
  }

  // Lazy load images with fade-in effect
  const images = document.querySelectorAll('img');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';

        if (img.complete) {
          img.style.opacity = '1';
        } else {
          img.addEventListener('load', () => {
            img.style.opacity = '1';
          });
        }

        imageObserver.unobserve(img);
      }
    });
  }, { threshold: 0.1 });

  images.forEach(img => imageObserver.observe(img));

  // Cardapio Filters & Header Links Integration
  const filterButtons = document.querySelectorAll('.filter-btn');
  const catalogCards = document.querySelectorAll('.menu-catalog-card');

  if (filterButtons.length > 0 && catalogCards.length > 0) {
    function applyFilter(category) {
      // Find matching button
      const targetBtn = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === category);
      if (!targetBtn) return;

      filterButtons.forEach(b => b.classList.remove('active'));
      targetBtn.classList.add('active');

      catalogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'todos' || cardCategory === category) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-filter');
        applyFilter(category);
        
        // Update URL query parameter without page reload if desired
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?filter=' + category;
        window.history.pushState({ path: newUrl }, '', newUrl);
      });
    });

    // Check for query parameter 'filter' on load
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
      applyFilter(filterParam);
    }

    // Dynamic header navigation links behavior
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes('filter=')) {
        const category = href.split('filter=')[1];
        link.addEventListener('click', (e) => {
          if (window.location.pathname.includes('cardapio.html')) {
            e.preventDefault();
            applyFilter(category);
          }
        });
      }
    });
  }
});
