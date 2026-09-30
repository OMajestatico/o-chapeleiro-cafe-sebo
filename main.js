(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // Smooth handoff between the institutional page and the menu.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const pageTransition = $('#pageTransition');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finishPageEnter = () => {
    requestAnimationFrame(() => setTimeout(() => pageTransition?.classList.remove('is-active'), reducedMotion ? 0 : 230));
  };
  const forceTopIfReturning = () => {
    const url = new URL(location.href);
    const shouldReset = url.searchParams.get('from') === 'cardapio' || sessionStorage.getItem('chapeleiro-return-top') === '1';
    if (!shouldReset) return;
    sessionStorage.removeItem('chapeleiro-return-top');
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
    if (url.searchParams.has('from')) {
      url.searchParams.delete('from');
      history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
  };
  window.addEventListener('pageshow', () => { forceTopIfReturning(); finishPageEnter(); });
  forceTopIfReturning();
  finishPageEnter();

  $$('[data-page-link="cardapio"]').forEach(link => link.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return;
    e.preventDefault();
    const href = link.href;
    pageTransition?.classList.add('is-active');
    setTimeout(() => { location.href = href; }, reducedMotion ? 20 : 1430);
  }));

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

  // Carrossel: mesma mecânica do Buffet Fly Park / RE9.
  // Em touch, o navegador cuida 100% do gesto nativo. Nada de pointermove/touchmove
  // brigando com o scroll vertical da página. JS só arrasta com mouse no desktop.
  const setupCarousel = carousel => {
    const id = carousel.id;
    const items = [...carousel.children];
    if (!items.length) return;

    const progress = document.querySelector(`[data-progress-for="${id}"]`);
    const prevBtn = document.querySelector(`[data-carousel-prev="${id}"]`);
    const nextBtn = document.querySelector(`[data-carousel-next="${id}"]`);
    const firstLeft = items[0]?.offsetLeft ?? 0;
    const targetLeft = item => Math.max(0, item.offsetLeft - firstLeft);

    let active = 0;
    let raf = 0;

    if (progress) {
      progress.innerHTML = '';
      items.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Item ${index + 1} de ${items.length}`);
        if (index === 0) dot.classList.add('active');
        progress.appendChild(dot);
      });
    }

    const dots = progress ? [...progress.children] : [];

    const goTo = index => {
      const item = items[Math.max(0, Math.min(items.length - 1, index))];
      if (!item) return;
      carousel.scrollTo({ left: targetLeft(item), behavior: 'smooth' });
    };

    const nearest = () => {
      const left = carousel.scrollLeft;
      let best = 0;
      let distance = Infinity;
      items.forEach((item, index) => {
        const d = Math.abs(targetLeft(item) - left);
        if (d < distance) {
          distance = d;
          best = index;
        }
      });

      if (best !== active) {
        dots[active]?.classList.remove('active');
        active = best;
        dots[active]?.classList.add('active');
      }
    };

    carousel.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(nearest);
    }, { passive: true });

    prevBtn?.addEventListener('click', () => goTo(active - 1));
    nextBtn?.addEventListener('click', () => goTo(active + 1));

    // Igual ao Fly Park: touch fica totalmente nativo.
    // Drag manual existe apenas para mouse de desktop.
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let pointerId = null;

    carousel.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      startScroll = carousel.scrollLeft;
      carousel.classList.add('is-dragging');
      carousel.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    });

    carousel.addEventListener('pointermove', e => {
      if (!dragging || e.pointerId !== pointerId) return;
      carousel.scrollLeft = startScroll - (e.clientX - startX);
    });

    const stopDrag = e => {
      if (!dragging) return;
      if (e?.pointerId != null && pointerId != null && e.pointerId !== pointerId) return;
      dragging = false;
      carousel.classList.remove('is-dragging');
      if (pointerId != null && carousel.hasPointerCapture?.(pointerId)) {
        carousel.releasePointerCapture(pointerId);
      }
      pointerId = null;
      nearest();
      goTo(active);
    };

    carousel.addEventListener('pointerup', stopDrag);
    carousel.addEventListener('pointercancel', stopDrag);
    carousel.addEventListener('dragstart', e => e.preventDefault());

    nearest();
  };

  $$('[data-carousel]').forEach(setupCarousel);

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
