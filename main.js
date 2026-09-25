(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });

  // Mobile menu
  const menu = $('#mobileMenu');
  const openBtn = $('.menu-toggle');
  const closeBtn = $('.menu-close');
  const setMenu = (open) => {
    if (!menu || !openBtn) return;
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    openBtn.setAttribute('aria-expanded', String(open));
  };
  openBtn?.addEventListener('click', () => setMenu(true));
  closeBtn?.addEventListener('click', () => setMenu(false));
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(el => {
    if (el.dataset.delay) el.style.setProperty('--delay', `${el.dataset.delay}ms`);
    observer.observe(el);
  });

  // Snap carousel helpers: move by the nearest card width for stable navigation.
  const getStep = (carousel) => {
    const item = carousel.firstElementChild;
    if (!item) return carousel.clientWidth * .8;
    const styles = getComputedStyle(carousel);
    const gap = parseFloat(styles.columnGap || styles.gap || 0);
    return item.getBoundingClientRect().width + gap;
  };
  const move = (id, dir) => {
    const carousel = document.getElementById(id);
    if (!carousel) return;
    carousel.scrollBy({ left: getStep(carousel) * dir, behavior: 'smooth' });
  };
  $$('[data-carousel-prev]').forEach(btn => btn.addEventListener('click', () => move(btn.dataset.carouselPrev, -1)));
  $$('[data-carousel-next]').forEach(btn => btn.addEventListener('click', () => move(btn.dataset.carouselNext, 1)));

  // Dot indicators + click-to-jump
  $$('[data-carousel]').forEach(carousel => {
    const id = carousel.id;
    const progress = document.querySelector(`[data-progress-for="${id}"]`);
    const items = [...carousel.children];
    if (!progress || !items.length) return;

    const dots = items.map((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir para item ${idx + 1}`);
      dot.addEventListener('click', () => items[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }));
      progress.appendChild(dot);
      return dot;
    });

    const update = () => {
      const left = carousel.getBoundingClientRect().left;
      let best = 0, bestDistance = Infinity;
      items.forEach((item, idx) => {
        const distance = Math.abs(item.getBoundingClientRect().left - left);
        if (distance < bestDistance) { bestDistance = distance; best = idx; }
      });
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === best));
    };
    let raf = 0;
    carousel.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }, { passive: true });

    // A roda do mouse continua rolando a página mesmo com o cursor sobre o carrossel.
    // Movimento horizontal de trackpad permanece reservado ao próprio carrossel.
    carousel.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      e.preventDefault();
      let deltaY = e.deltaY;
      if (e.deltaMode === 1) deltaY *= 16;
      else if (e.deltaMode === 2) deltaY *= window.innerHeight;

      window.scrollBy({ top: deltaY, left: 0, behavior: 'auto' });
    }, { passive: false });
    window.addEventListener('resize', update, { passive: true });
    update();
  });

  // Subtle 3D tilt only on devices that actually have a pointing device.
  const canTilt = matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canTilt) {
    $$('.tilt-card').forEach(card => {
      const base = card.classList.contains('hero-card-main') ? 3 : -7;
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `rotate(${base}deg) rotateY(${x * 7}deg) rotateX(${y * -6}deg) translateZ(18px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = card.classList.contains('hero-card-main') ? 'rotate(3deg)' : 'rotate(-7deg) translateZ(40px)';
      });
    });
  }
})();
