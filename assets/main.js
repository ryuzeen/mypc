(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktop = window.matchMedia('(min-width: 901px)');

  // nav background after leaving the hero
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // cursor light + hero case tilt, both eased toward the pointer
  if (finePointer && !reduceMotion) {
    const light = document.querySelector('.cursor-light');
    const caseImg = document.querySelector('.hero-case img');
    let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty;
    let running = false;

    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (caseImg && window.scrollY < innerHeight) {
        const nx = x / innerWidth - 0.5;
        const ny = y / innerHeight - 0.5;
        caseImg.style.setProperty('--ry', `${nx * 8}deg`);
        caseImg.style.setProperty('--rx', `${ny * -5}deg`);
      }
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.5) {
        requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    window.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      light.classList.add('is-on');
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    }, { passive: true });

    document.addEventListener('pointerleave', () => light.classList.remove('is-on'));
  }

  // build stage: the list drives one large view of the selected part
  const parts = [...document.querySelectorAll('.part')];
  const stage = document.getElementById('stage');
  if (!parts.length || !stage) return;

  const imgs = [...stage.querySelectorAll('.stage-img')];
  const info = stage.querySelector('.stage-info');
  let current = null;
  let front = 0;
  let swapTimer;

  // warm the cache so swaps never flash empty
  parts.forEach((p) => { const i = new Image(); i.src = p.querySelector('.part-detail img').src; });

  const select = (part, instant = false) => {
    if (part === current) return;
    current = part;
    parts.forEach((p) => {
      const on = p === part;
      p.classList.toggle('is-active', on);
      p.querySelector('.part-btn').setAttribute('aria-pressed', on);
    });

    const src = part.querySelector('.part-detail img');
    const outgoing = imgs[front];
    front = 1 - front;
    const incoming = imgs[front];

    incoming.src = src.src;
    incoming.alt = src.alt;
    incoming.removeAttribute('aria-hidden');
    outgoing.setAttribute('aria-hidden', 'true');

    if (instant || reduceMotion) {
      outgoing.classList.remove('is-current', 'is-leaving');
      incoming.classList.add('is-current');
    } else {
      incoming.classList.remove('is-current');
      incoming.classList.add('is-entering');
      outgoing.classList.add('is-leaving');
      outgoing.classList.remove('is-current');
      // next frame: let the entering image transition from its start state
      requestAnimationFrame(() => requestAnimationFrame(() => {
        incoming.classList.remove('is-entering');
        incoming.classList.add('is-current');
      }));
      setTimeout(() => outgoing.classList.remove('is-leaving'), 220);
    }

    const fill = () => {
      info.innerHTML = '';
      info.append(
        part.querySelector('.specs').cloneNode(true),
        part.querySelector('.search').cloneNode(true)
      );
      info.classList.remove('is-swapping');
    };
    clearTimeout(swapTimer);
    if (instant || reduceMotion) {
      fill();
    } else {
      info.classList.add('is-swapping');
      swapTimer = setTimeout(fill, 160);
    }
  };

  let hoverTimer;
  parts.forEach((part) => {
    const btn = part.querySelector('.part-btn');
    btn.addEventListener('click', () => desktop.matches && select(part));
    btn.addEventListener('focus', () => desktop.matches && select(part));
    if (finePointer) {
      btn.addEventListener('pointerenter', () => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => desktop.matches && select(part), 70);
      });
      btn.addEventListener('pointerleave', () => clearTimeout(hoverTimer));
    }
  });

  // arrow keys move through the list
  document.querySelector('.parts').addEventListener('keydown', (e) => {
    if (!desktop.matches || !['ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const i = parts.indexOf(current);
    const next = parts[(i + (e.key === 'ArrowDown' ? 1 : parts.length - 1)) % parts.length];
    next.querySelector('.part-btn').focus();
  });

  select(parts[0], true);
})();
