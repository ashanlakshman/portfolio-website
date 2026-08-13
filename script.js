(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  /* ---------------- Navigation ---------------- */
  const menu = $('.menu-toggle');
  const nav = $('.nav-links');
  menu?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  }));

  const sections = $$('main section[id]');
  const navLinks = $$('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-32% 0px -58% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));

  /* ---------------- Cursor hover ---------------- */
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  if (dot && ring && window.matchMedia('(pointer:fine)').matches) {
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    document.addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      dot.style.left = `${x}px`; dot.style.top = `${y}px`;
      dot.style.opacity = '1'; ring.style.opacity = '1';
    });
    const tick = () => {
      rx += (x - rx) * .18; ry += (y - ry) * .18;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      requestAnimationFrame(tick);
    };
    tick();
    $$('.interactive, button, a, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ---------------- Toast ---------------- */
  const toast = $('#toast');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /* ---------------- CV actions ---------------- */
  const navCV = $('#navDownloadCV');
  const contactCV = $('#downloadCV');
  function downloadCvFeedback(link) {
    if (!link) return;
    setTimeout(() => showToast('CV download started.'), 80);
  }
  navCV?.addEventListener('click', () => downloadCvFeedback(navCV));
  contactCV?.addEventListener('click', () => downloadCvFeedback(contactCV));

  /* ---------------- Projects: center-focused 3D carousel ---------------- */
  const stage = $('#projectsStage');
  const track = $('#projectsTrack');
  const cards = $$('.project-card-3d', track);
  const prev = $('#prevProject');
  const next = $('#nextProject');
  const indicator = $('#projectIndicator');
  let activeIndex = 0;
  let dragging = false;
  let dragMoved = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  function centerProject(index, animate = true) {
    if (!cards.length || !stage || !track) return;
    activeIndex = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle('is-center', i === activeIndex);
      card.classList.remove('flipped');
    });
    const card = cards[activeIndex];
    const offset = stage.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
    track.style.transition = animate ? 'transform .65s cubic-bezier(.2,.8,.2,1)' : 'none';
    track.style.transform = `translate3d(${offset}px,0,0)`;
    cards.forEach((card, i) => {
      const distance = i - activeIndex;
      const abs = Math.min(Math.abs(distance), 3);
      card.style.transform = `translateZ(${i === activeIndex ? 55 : 0}px) rotateY(${distance * -6}deg) scale(${i === activeIndex ? 1 : Math.max(.84, 1 - abs * .045)})`;
      card.style.opacity = i === activeIndex ? '1' : String(Math.max(.45, 1 - abs * .18));
      card.style.filter = i === activeIndex ? 'none' : `brightness(${Math.max(.72, 1 - abs * .08)})`;
    });
    if (indicator) indicator.textContent = `${String(activeIndex + 1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  }
  function nextProject() { centerProject(activeIndex + 1); }
  function prevProject() { centerProject(activeIndex - 1); }
  next?.addEventListener('click', e => { e.stopPropagation(); nextProject(); });
  prev?.addEventListener('click', e => { e.stopPropagation(); prevProject(); });

  cards.forEach((card, index) => {
    card.addEventListener('click', e => {
      if (dragMoved) return;
      if (e.target.closest('a,button')) return;
      if (index !== activeIndex) centerProject(index);
      else card.classList.toggle('flipped');
    });
    $('.flip-btn', card)?.addEventListener('click', e => {
      e.stopPropagation();
      card.classList.toggle('flipped');
    });
    $('.github-btn', card)?.addEventListener('click', e => {
      const url = e.currentTarget.getAttribute('href');
      if (!url || url === '#') {
        e.preventDefault();
        showToast('GitHub repository link will be connected here.');
      }
    });
  });

  function projectDragStart(e) {
    if (e.target.closest('button,a')) return;
    dragging = true; dragMoved = false; dragStartX = e.clientX; dragStartScroll = 0;
    stage.classList.add('dragging');
    stage.setPointerCapture?.(e.pointerId);
  }
  function projectDragMove(e) {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 8) dragMoved = true;
    if (Math.abs(dx) > 55) {
      centerProject(activeIndex + (dx < 0 ? 1 : -1));
      dragStartX = e.clientX;
    }
  }
  function projectDragEnd(e) {
    if (!dragging) return;
    dragging = false; stage.classList.remove('dragging');
    try { stage.releasePointerCapture?.(e.pointerId); } catch (_) {}
    setTimeout(() => { dragMoved = false; }, 40);
  }
  stage?.addEventListener('pointerdown', projectDragStart);
  stage?.addEventListener('pointermove', projectDragMove);
  stage?.addEventListener('pointerup', projectDragEnd);
  stage?.addEventListener('pointercancel', projectDragEnd);
  stage?.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
      e.preventDefault();
      if (e.deltaY > 0) nextProject(); else prevProject();
    }
  }, { passive: false });
  window.addEventListener('resize', () => centerProject(activeIndex, false));

  /* ---------------- Skills flow: wheel + touch/pointer interaction ---------------- */
  $$('.skill-flow').forEach(flow => {
    let down = false, startX = 0, moved = false;
    flow.addEventListener('pointerdown', e => { down = true; moved = false; startX = e.clientX; flow.setPointerCapture?.(e.pointerId); });
    flow.addEventListener('pointermove', e => { if (down && Math.abs(e.clientX - startX) > 8) moved = true; });
    flow.addEventListener('pointerup', e => { down = false; try { flow.releasePointerCapture?.(e.pointerId); } catch (_) {} });
    flow.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        const track = $('.skill-flow-track', flow);
        const speed = flow.dataset.direction === 'rtl' ? -1 : 1;
        track.style.animationPlayState = 'paused';
        track.style.transform = `translateX(${speed * e.deltaY * -0.35}px)`;
        clearTimeout(flow._wheelTimer);
        flow._wheelTimer = setTimeout(() => { track.style.transform = ''; track.style.animationPlayState = ''; }, 120);
      }
    }, { passive: false });
  });

  /* ---------------- Contact form ---------------- */
  const form = $('#contactForm');
  const sendButton = $('.send-btn', form || document);
  const success = $('#successMessage');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    sendButton?.classList.add('sending');
    const label = $('span', sendButton);
    if (label) label.textContent = 'Sending...';
    setTimeout(() => {
      if (label) label.textContent = 'Sent';
      sendButton?.classList.remove('sending');
      success?.classList.add('show');
      setTimeout(() => {
        form.reset();
        success?.classList.remove('show');
        if (label) label.textContent = 'Send Message';
      }, 2600);
    }, 500);
  });

  /* ---------------- Smooth keyboard accessibility for project arrows ---------------- */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') nextProject();
    if (e.key === 'ArrowLeft') prevProject();
  });

  centerProject(0, false);
})();
