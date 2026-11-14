(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const heroImage = document.querySelector('.hero-image');

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    let frame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    document.body.classList.add('cursor-ready');

    const animateCursor = () => {
      ringX += (pointerX - ringX) * 0.17;
      ringY += (pointerY - ringY) * 0.17;
      dot.style.transform = `translate(${pointerX}px, ${pointerY}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      frame = window.requestAnimationFrame(animateCursor);
    };
    frame = window.requestAnimationFrame(animateCursor);

    window.addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (event.target.closest('a, button')) document.body.classList.add('cursor-hover');
      else document.body.classList.remove('cursor-hover');

      if (event.target.closest('.hero') && heroImage) {
        const offsetX = (event.clientX / window.innerWidth - 0.5) * -8;
        const offsetY = (event.clientY / window.innerHeight - 0.5) * -6;
        heroImage.style.transform = `scale(1.06) translate(${offsetX}px, ${offsetY}px)`;
      }
    }, { passive: true });
    window.addEventListener('blur', () => {
      document.body.classList.remove('cursor-ready', 'cursor-hover');
      window.cancelAnimationFrame(frame);
    });
    window.addEventListener('focus', () => {
      document.body.classList.add('cursor-ready');
      frame = window.requestAnimationFrame(animateCursor);
    });
  }

  document.querySelectorAll('.magnetic').forEach((element) => {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const moveX = (event.clientX - rect.left - rect.width / 2) * 0.08;
      const moveY = (event.clientY - rect.top - rect.height / 2) * 0.12;
      element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });
})();
