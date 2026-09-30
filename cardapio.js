(() => {
  'use strict';

  const WHATSAPP = '5565981372242';
  const STORAGE_KEY = 'chapeleiro-demo-cart-v1';
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const pageTransition = $('#pageTransition');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finishPageEnter = () => requestAnimationFrame(() => setTimeout(() => pageTransition?.classList.remove('is-active'), reducedMotion ? 0 : 230));
  window.addEventListener('pageshow', finishPageEnter);
  finishPageEnter();
  $$('[data-page-link="home"]').forEach(link => link.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return;
    e.preventDefault();
    sessionStorage.setItem('chapeleiro-return-top', '1');
    pageTransition?.classList.add('is-active');
    setTimeout(() => { location.href = link.href; }, reducedMotion ? 20 : 1430);
  }));

  const categories = [
    { id: 'cafes', label: 'Cafés', subtitle: 'clássicos e especiais' },
    { id: 'gelados', label: 'Gelados', subtitle: 'para dias quentes' },
    { id: 'comidas', label: 'Tostas & lanches', subtitle: 'para acompanhar' },
    { id: 'doces', label: 'Bolos & doces', subtitle: 'a pausa açucarada' },
    { id: 'chas', label: 'Chás', subtitle: 'calmos por natureza' }
  ];

  const commonCoffeeExtras = [
    { name: 'Shot extra de espresso', price: 4 },
    { name: 'Leite vegetal', price: 4 },
    { name: 'Chantilly', price: 3.5 },
    { name: 'Calda de chocolate', price: 3 }
  ];

  const products = [
    { id:'espresso', category:'cafes', name:'Espresso da Casa', price:8, image:'xicara.jpg', badge:'clássico', description:'Espresso curto, aromático e intenso, preparado com café especial.', sizes:[{name:'Tradicional', price:0},{name:'Duplo', price:5}], extras:commonCoffeeExtras },
    { id:'cappuccino', category:'cafes', name:'Cappuccino Cremoso', price:15, image:'cafe-espuma.jpg', badge:'queridinho', description:'Espresso, leite vaporizado e espuma cremosa com acabamento de canela.', sizes:[{name:'Médio',price:0},{name:'Grande',price:4}], extras:commonCoffeeExtras },
    { id:'coado', category:'cafes', name:'Coado Especial', price:12, image:'cafes-especiais.jpg', badge:'especial', description:'Café filtrado com perfil mais delicado e notas que mudam conforme o grão do dia.', sizes:[{name:'Individual',price:0},{name:'Para compartilhar',price:9}], extras:[{name:'Leite quente à parte',price:3},{name:'Leite vegetal à parte',price:4}] },
    { id:'mocha', category:'cafes', name:'Mocha do Chapeleiro', price:18, image:'mesa-cafe.jpg', badge:'da casa', description:'Espresso, leite cremoso e chocolate em uma bebida mais encorpada.', sizes:[{name:'Médio',price:0},{name:'Grande',price:4}], extras:commonCoffeeExtras },

    { id:'iced-latte', category:'gelados', name:'Iced Latte', price:17, image:'cafe-verde.jpg', badge:'gelado', description:'Espresso sobre gelo e leite, leve e refrescante para o calor cuiabano.', sizes:[{name:'400 ml',price:0},{name:'500 ml',price:4}], extras:[{name:'Leite vegetal',price:4},{name:'Shot extra',price:4},{name:'Baunilha',price:3},{name:'Caramelo',price:3}] },
    { id:'iced-mocha', category:'gelados', name:'Iced Mocha', price:20, image:'cafe-espuma.jpg', badge:'gelado', description:'Café gelado, leite e chocolate com textura cremosa.', sizes:[{name:'400 ml',price:0},{name:'500 ml',price:4}], extras:[{name:'Leite vegetal',price:4},{name:'Shot extra',price:4},{name:'Chantilly',price:3.5}] },

    { id:'tosta-caprese', category:'comidas', name:'Tosta Caprese', price:24, image:'tosta.jpg', badge:'salgado', description:'Pão tostado, queijo, tomate e ervas. Crocante por fora e macia no centro.', extras:[{name:'Queijo extra',price:5},{name:'Tomate extra',price:3},{name:'Molho da casa',price:3}] },
    { id:'croissant', category:'comidas', name:'Croissant Recheado', price:19, image:'croissant.jpg', badge:'fornada', description:'Croissant amanteigado com recheio cremoso, servido aquecido.', extras:[{name:'Queijo extra',price:5},{name:'Presunto extra',price:5},{name:'Requeijão',price:3.5}] },
    { id:'combo-manha', category:'comidas', name:'Pausa da Manhã', price:32, image:'mesa-cafe.jpg', badge:'combo', description:'Uma combinação de bebida quente, pão tostado e acompanhamento doce.', extras:[{name:'Trocar por cappuccino',price:5},{name:'Fruta do dia',price:6},{name:'Queijo extra',price:5}] },

    { id:'bolo-choco', category:'doces', name:'Bolo de Chocolate', price:16, image:'bolo-chocolate.jpg', badge:'fatia', description:'Fatia generosa de bolo de chocolate, úmida e intensa.', extras:[{name:'Calda de chocolate',price:3},{name:'Chantilly',price:3.5},{name:'Morangos',price:5}] },
    { id:'doce-morango', category:'doces', name:'Doce de Morango', price:18, image:'doce-morango.jpg', badge:'delicado', description:'Sobremesa cremosa finalizada com morangos frescos.', extras:[{name:'Morangos extra',price:5},{name:'Calda de chocolate',price:3}] },
    { id:'bolo-dia', category:'doces', name:'Bolo do Dia', price:14, image:'bolo.jpg', badge:'rotativo', description:'Uma fatia da receita escolhida para o dia. Sabor sujeito à disponibilidade.', extras:[{name:'Chantilly',price:3.5},{name:'Calda',price:3}] },

    { id:'cha-casa', category:'chas', name:'Chá da Casa', price:12, image:'cantinho.jpg', badge:'quente', description:'Infusão aromática servida em xícara generosa, perfeita para ler sem pressa.', sizes:[{name:'Xícara',price:0},{name:'Bule pequeno',price:8}], extras:[{name:'Mel',price:2},{name:'Limão',price:1.5}] },
    { id:'cha-gelado', category:'chas', name:'Chá Gelado', price:14, image:'jardim.jpg', badge:'refrescante', description:'Infusão gelada e leve com toque cítrico.', sizes:[{name:'400 ml',price:0},{name:'500 ml',price:3}], extras:[{name:'Limão extra',price:1.5},{name:'Xarope de frutas',price:3}] }
  ];

  let cart = [];
  let activeProduct = null;
  let currentQty = 1;

  try { cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { cart = []; }
  if (!Array.isArray(cart)) cart = [];

  const categoryBar = $('#categoryBar');
  const menuContent = $('#menuContent');
  const productSheet = $('#productSheet');
  const productBackdrop = $('#productBackdrop');
  const cartSheet = $('#cartSheet');
  const cartBackdrop = $('#cartBackdrop');

  function refreshIcons() {
    if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  function renderMenu() {
    categoryBar.innerHTML = categories.map((cat, i) => `<button class="category-chip${i === 0 ? ' active' : ''}" type="button" data-category-target="${cat.id}">${cat.label}</button>`).join('');
    menuContent.innerHTML = categories.map(cat => {
      const list = products.filter(p => p.category === cat.id);
      return `<section class="menu-section" id="category-${cat.id}" data-category-section="${cat.id}">
        <div class="section-head"><div><span>${cat.subtitle}</span><h2>${cat.label}</h2></div><p>Itens e preços demonstrativos para visualizar a experiência completa de pedido.</p></div>
        <div class="product-grid">${list.map((product, index) => productCard(product, index)).join('')}</div>
      </section>`;
    }).join('');
    $$('[data-product-id]').forEach(card => card.addEventListener('click', () => openProduct(card.dataset.productId)));
    $$('[data-category-target]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.categoryTarget;
      const target = document.getElementById(`category-${id}`);
      if (!target) return;
      setActiveCategory(id, true);
      categoryScrollLockUntil = performance.now() + 720;
      const offset = innerWidth >= 700 ? 154 : 138;
      const top = Math.max(0, target.getBoundingClientRect().top + scrollY - offset);
      window.scrollTo({ top, behavior:'smooth' });
      setTimeout(() => { categoryScrollLockUntil = 0; updateActiveCategory(); }, 760);
    }));
    observeSections();
    refreshIcons();
  }

  function productCard(p, index = 0) {
    const delay = Math.min(index, 5) * 45;
    return `<button class="product-card" style="--card-delay:${delay}ms" type="button" data-product-id="${p.id}" aria-label="Abrir ${p.name}">
      <div class="product-card-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-card-badge">${p.badge || 'item'}</span></div>
      <div class="product-card-copy"><h3>${p.name}</h3><p>${p.description}</p><div class="product-card-bottom"><span class="product-price">a partir de ${money(p.price)}</span><span class="plus-mark"><i data-lucide="plus"></i></span></div></div>
    </button>`;
  }

  let categoryScrollLockUntil = 0;
  let activeCategoryId = '';
  let categoryTrackingRaf = 0;

  function setActiveCategory(id, center = false) {
    if (!id) return;
    activeCategoryId = id;
    const chips = $$('[data-category-target]');
    chips.forEach(chip => chip.classList.toggle('active', chip.dataset.categoryTarget === id));
    const chip = chips.find(item => item.dataset.categoryTarget === id);
    if (!chip || !center) return;
    const left = chip.offsetLeft - (categoryBar.clientWidth - chip.offsetWidth) / 2;
    categoryBar.scrollTo({ left: Math.max(0, left), behavior:'smooth' });
  }

  function updateActiveCategory() {
    if (performance.now() < categoryScrollLockUntil) return;
    const sections = $$('[data-category-section]');
    if (!sections.length) return;
    const anchor = innerWidth >= 700 ? 168 : 150;
    let current = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= anchor) current = section;
    });
    const id = current.dataset.categorySection;
    if (id !== activeCategoryId) setActiveCategory(id, true);
  }

  function observeSections() {
    const onScroll = () => {
      cancelAnimationFrame(categoryTrackingRaf);
      categoryTrackingRaf = requestAnimationFrame(updateActiveCategory);
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll, { passive:true });
    updateActiveCategory();
  }

  let lockedScrollY = 0;
  let bodyLockActive = false;

  // Lock the page without switching the body to position:fixed.
  // That old trick prevented scrolling, but it also made the whole layout jump.
  function setBodyLocked(lock) {
    if (lock) {
      if (bodyLockActive) return;
      bodyLockActive = true;
      lockedScrollY = window.scrollY || window.pageYOffset || 0;
      document.documentElement.classList.add('sheet-open');
      document.body.classList.add('sheet-open');
      return;
    }

    requestAnimationFrame(() => {
      const anyOpen = productSheet.classList.contains('open') || cartSheet.classList.contains('open');
      if (anyOpen || !bodyLockActive) return;
      bodyLockActive = false;
      document.documentElement.classList.remove('sheet-open');
      document.body.classList.remove('sheet-open');

      // Most browsers keep the same scroll position when overflow is restored.
      // If one does not, restore it instantly without a smooth-scroll detour.
      const currentY = window.scrollY || window.pageYOffset || 0;
      if (Math.abs(currentY - lockedScrollY) > 1) {
        const html = document.documentElement;
        const previousScrollBehavior = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';
        window.scrollTo({ left: 0, top: lockedScrollY, behavior: 'auto' });
        requestAnimationFrame(() => { html.style.scrollBehavior = previousScrollBehavior; });
      }
    });
  }

  // Extra guard for mobile browsers: allow scrolling only inside the open sheet.
  const isAllowedSheetScrollTarget = target => !!target?.closest?.('.product-sheet-scroll, .cart-items');
  document.addEventListener('touchmove', e => {
    if (bodyLockActive && !isAllowedSheetScrollTarget(e.target)) e.preventDefault();
  }, { passive:false, capture:true });
  document.addEventListener('wheel', e => {
    if (bodyLockActive && !isAllowedSheetScrollTarget(e.target)) e.preventDefault();
  }, { passive:false, capture:true });

  function openProduct(id) {
    activeProduct = products.find(p => p.id === id);
    if (!activeProduct) return;
    currentQty = 1;
    $('#productImage').src = activeProduct.image;
    $('#productImage').alt = activeProduct.name;
    $('#productCategory').textContent = categories.find(c => c.id === activeProduct.category)?.label || '';
    $('#productTitle').textContent = activeProduct.name;
    $('#productDescription').textContent = activeProduct.description;
    $('#productPrice').textContent = `a partir de ${money(activeProduct.price)}`;
    $('#productNote').value = '';
    $('#noteCount').textContent = '0';

    const sizeGroup = $('#sizeGroup');
    const sizeOptions = $('#sizeOptions');
    if (activeProduct.sizes?.length) {
      sizeGroup.hidden = false;
      sizeOptions.innerHTML = activeProduct.sizes.map((o,i) => optionRow('size', o, i === 0, 'radio')).join('');
    } else {
      sizeGroup.hidden = true;
      sizeOptions.innerHTML = '';
    }
    const extras = activeProduct.extras || [];
    $('#extrasGroup').hidden = extras.length === 0;
    $('#extraOptions').innerHTML = extras.map(o => optionRow('extra', o, false, 'checkbox')).join('');
    $('#qtyValue').textContent = '1';
    updateAddPrice();
    $$('#productSheet input').forEach(input => input.addEventListener('change', updateAddPrice));

    productSheet.classList.remove('dragging');
    productSheet.style.setProperty('--drag-y', '0px');
    productBackdrop.style.opacity = '';
    const sheetScroll = $('.product-sheet-scroll');
    if (sheetScroll) sheetScroll.scrollTop = 0;
    productBackdrop.hidden = false;
    requestAnimationFrame(() => productBackdrop.classList.add('show'));
    productSheet.classList.add('open');
    productSheet.setAttribute('aria-hidden', 'false');
    setBodyLocked(true);
    refreshIcons();
  }

  function optionRow(group, option, checked, type) {
    const name = group === 'size' ? 'product-size' : `extra-${activeProduct?.id || 'p'}`;
    return `<label class="option-row"><input type="${type}" name="${name}" value="${escapeAttr(option.name)}" data-price="${option.price}" ${checked ? 'checked' : ''}><span class="option-row-copy"><strong>${escapeHtml(option.name)}</strong><span>${option.price ? `+ ${money(option.price)}` : 'incluso'}</span></span></label>`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }
  function escapeAttr(value) { return escapeHtml(value); }

  function currentConfiguration() {
    const sizeInput = $('#sizeOptions input:checked');
    const size = sizeInput ? { name:sizeInput.value, price:Number(sizeInput.dataset.price || 0) } : null;
    const extras = $$('#extraOptions input:checked').map(input => ({ name:input.value, price:Number(input.dataset.price || 0) }));
    const note = $('#productNote').value.trim();
    return { size, extras, note };
  }

  function configuredUnitPrice() {
    if (!activeProduct) return 0;
    const cfg = currentConfiguration();
    return activeProduct.price + (cfg.size?.price || 0) + cfg.extras.reduce((sum,e) => sum + e.price, 0);
  }

  function updateAddPrice() {
    $('#qtyValue').textContent = String(currentQty);
    $('#addPrice').textContent = money(configuredUnitPrice() * currentQty);
  }

  function closeProduct() {
    productSheet.classList.remove('dragging');
    productBackdrop.style.opacity = '';
    void productSheet.offsetHeight;
    productSheet.classList.remove('open');
    productSheet.setAttribute('aria-hidden', 'true');
    productBackdrop.classList.remove('show');
    setTimeout(() => {
      productBackdrop.hidden = true;
      productSheet.style.setProperty('--drag-y', '0px');
    }, 460);
    setBodyLocked(false);
  }

  function addCurrentProduct() {
    if (!activeProduct) return;
    const cfg = currentConfiguration();
    cart.push({
      lineId: uid(), productId: activeProduct.id, name: activeProduct.name, image: activeProduct.image,
      basePrice: activeProduct.price, unitPrice: configuredUnitPrice(), quantity: currentQty,
      size: cfg.size, extras: cfg.extras, note: cfg.note
    });
    persistCart();
    closeProduct();
    updateCartUI();
    openCart();
  }

  function persistCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function cartTotals() {
    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    return { items, total };
  }

  function updateCartUI() {
    const { items, total } = cartTotals();
    $('#headerCartCount').textContent = String(items);
    $('#floatingCount').textContent = String(items);
    $('#floatingTotal').textContent = money(total);
    $('#floatingCart').hidden = items === 0;
    renderCart();
  }

  function renderCart() {
    const itemsEl = $('#cartItems');
    const empty = $('#cartEmpty');
    const summary = $('#cartSummary');
    cartSheet.classList.toggle('is-empty', cart.length === 0);
    if (!cart.length) {
      itemsEl.innerHTML = '';
      empty.hidden = false;
      summary.hidden = true;
      refreshIcons();
      return;
    }
    empty.hidden = true;
    summary.hidden = false;
    itemsEl.innerHTML = cart.map(item => {
      const details = [item.size?.name, ...(item.extras || []).map(e => e.name)].filter(Boolean).join(' · ');
      return `<article class="cart-item" data-line-id="${item.lineId}">
        <img src="${item.image}" alt="${escapeHtml(item.name)}">
        <div class="cart-item-main"><div class="cart-item-top"><h3>${escapeHtml(item.name)}</h3><span class="cart-item-price">${money(item.unitPrice * item.quantity)}</span></div>
        ${details ? `<p class="cart-item-details">${escapeHtml(details)}</p>` : ''}${item.note ? `<p class="cart-item-note">Obs.: ${escapeHtml(item.note)}</p>` : ''}
        <div class="cart-item-actions"><div class="mini-qty"><button type="button" data-cart-minus aria-label="Diminuir"><i data-lucide="minus"></i></button><strong>${item.quantity}</strong><button type="button" data-cart-plus aria-label="Aumentar"><i data-lucide="plus"></i></button></div><button class="remove-item" type="button" data-remove>remover</button></div></div>
      </article>`;
    }).join('');
    const totals = cartTotals();
    $('#summaryItems').textContent = `${totals.items} ${totals.items === 1 ? 'item' : 'itens'}`;
    $('#summaryTotal').textContent = money(totals.total);
    $$('[data-line-id]').forEach(row => {
      const id = row.dataset.lineId;
      $('[data-cart-minus]', row).addEventListener('click', () => changeCartQty(id, -1));
      $('[data-cart-plus]', row).addEventListener('click', () => changeCartQty(id, 1));
      $('[data-remove]', row).addEventListener('click', () => removeCartItem(id));
    });
    refreshIcons();
  }

  function changeCartQty(lineId, delta) {
    const item = cart.find(i => i.lineId === lineId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.lineId !== lineId);
    persistCart(); updateCartUI();
  }
  function removeCartItem(lineId) { cart = cart.filter(i => i.lineId !== lineId); persistCart(); updateCartUI(); }

  function openCart() {
    renderCart();
    cartBackdrop.hidden = false;
    requestAnimationFrame(() => cartBackdrop.classList.add('show'));
    cartSheet.classList.add('open');
    cartSheet.setAttribute('aria-hidden','false');
    setBodyLocked(true);
  }
  function closeCart() {
    cartSheet.classList.remove('open');
    cartSheet.setAttribute('aria-hidden','true');
    cartBackdrop.classList.remove('show');
    setTimeout(() => { cartBackdrop.hidden = true; }, 460);
    setBodyLocked(false);
  }

  function buildWhatsAppMessage() {
    const totals = cartTotals();
    const lines = [
      'Olá! Gostaria de fazer um pedido pelo cardápio do site:',
      '',
      '*PEDIDO*'
    ];
    cart.forEach((item, index) => {
      lines.push(`${index + 1}. *${item.quantity}x ${item.name}*`);
      if (item.size) lines.push(`   Tamanho: ${item.size.name}`);
      if (item.extras?.length) lines.push(`   Adicionais: ${item.extras.map(e => `${e.name}${e.price ? ` (+${money(e.price)})` : ''}`).join(', ')}`);
      if (item.note) lines.push(`   Obs.: ${item.note}`);
      lines.push(`   ${money(item.unitPrice * item.quantity)}`, '');
    });
    lines.push(`*Subtotal demonstrativo: ${money(totals.total)}*`, '', 'Os itens, preços e disponibilidade desta demonstração devem ser confirmados.');
    return lines.join('\n');
  }

  function sendOrder() {
    if (!cart.length) return;
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
    window.open(url, '_blank', 'noopener');
  }

  // Dragging works from the handle and, on mobile, from the upper 60% of the product image.
  const sheetHandle = $('#sheetHandle');
  const sheetDragZone = $('#sheetDragZone');
  let draggingSheet = false;
  let dragStartY = 0;
  let dragLastY = 0;
  let dragStartTime = 0;
  let dragCaptureEl = null;

  function startSheetDrag(e) {
    if (!productSheet.classList.contains('open')) return;
    draggingSheet = true;
    dragStartY = dragLastY = e.clientY;
    dragStartTime = performance.now();
    dragCaptureEl = e.currentTarget;
    productSheet.classList.add('dragging');
    dragCaptureEl?.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  }
  function moveSheetDrag(e) {
    if (!draggingSheet) return;
    const delta = Math.max(0, e.clientY - dragStartY);
    dragLastY = e.clientY;
    productSheet.style.setProperty('--drag-y', `${delta}px`);
    productBackdrop.style.opacity = String(Math.max(.08, 1 - delta / 360));
    e.preventDefault();
  }
  function endSheetDrag(e) {
    if (!draggingSheet) return;
    draggingSheet = false;
    const delta = Math.max(0, dragLastY - dragStartY);
    const elapsed = Math.max(1, performance.now() - dragStartTime);
    const velocity = delta / elapsed;
    dragCaptureEl?.releasePointerCapture?.(e.pointerId);
    dragCaptureEl = null;
    productSheet.classList.remove('dragging');
    void productSheet.offsetHeight;
    if (delta > 105 || velocity > .58) {
      closeProduct();
      return;
    }
    productSheet.style.setProperty('--drag-y', '0px');
    productBackdrop.style.opacity = '';
  }

  [sheetHandle, sheetDragZone].filter(Boolean).forEach(zone => {
    zone.addEventListener('pointerdown', startSheetDrag);
    zone.addEventListener('pointermove', moveSheetDrag);
    zone.addEventListener('pointerup', endSheetDrag);
    zone.addEventListener('pointercancel', endSheetDrag);
  });

  $('#productClose').addEventListener('click', closeProduct);
  productBackdrop.addEventListener('click', closeProduct);
  $('#qtyMinus').addEventListener('click', () => { currentQty = Math.max(1, currentQty - 1); updateAddPrice(); });
  $('#qtyPlus').addEventListener('click', () => { currentQty = Math.min(30, currentQty + 1); updateAddPrice(); });
  $('#productNote').addEventListener('input', e => { $('#noteCount').textContent = String(e.target.value.length); });
  $('#addProduct').addEventListener('click', addCurrentProduct);
  $('#floatingCart').addEventListener('click', openCart);
  $('#headerCart').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  cartBackdrop.addEventListener('click', closeCart);
  $('#sendOrder').addEventListener('click', sendOrder);
  $('#clearCart').addEventListener('click', () => { cart = []; persistCart(); updateCartUI(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (productSheet.classList.contains('open')) closeProduct();
    else if (cartSheet.classList.contains('open')) closeCart();
  });

  renderMenu();
  updateCartUI();
  refreshIcons();
})();
