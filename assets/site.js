(() => {
  const S = window.SETUP;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const GROUPS = [
    { id: 'pc', title: 'O PC', label: 'PC completo', list: S.pc },
    { id: 'mesa', title: 'Mesa', label: 'Mesa', list: S.gear },
    { id: 'guardados', title: 'Guardados', label: 'Guardados', sub: 'e no trabalho', list: S.extra },
  ].filter((g) => g.list.length);

  $$('[data-steam]').forEach((a) => { a.href = S.steam; });
  $$('[data-date]').forEach((e) => { e.textContent = S.priceDate; });
  $$('.tabs a').forEach((a) => {
    const id = a.hash.slice(1);
    if (id !== 'desempenho' && !GROUPS.find((g) => g.id === id)) a.remove();
  });

  // decoded images by file, so a swap only starts once the picture can paint
  const decoded = {};
  function load(it) {
    if (!decoded[it.img]) {
      decoded[it.img] = new Promise((done) => {
        const im = new Image();
        const finish = () => done(im);
        im.onload = () => {
          // decode() can stall in background tabs; never wait on it for long
          Promise.race([im.decode().catch(() => {}), new Promise((r) => setTimeout(r, 120))]).then(finish);
        };
        im.onerror = finish;
        im.src = 'assets/img/' + it.img;
      });
    }
    return decoded[it.img];
  }


  // ---------- bays ----------

  const bays = $('#bays');
  const state = {};

  GROUPS.forEach((g) => {
    const sec = document.createElement('section');
    sec.className = 'bay';
    sec.id = g.id;
    sec.setAttribute('aria-labelledby', g.id + '-t');
    sec.innerHTML = `
      <div class="side">
        <h2 class="side-title" id="${g.id}-t">${g.title}</h2>
        <p class="side-meta">${g.list.length} itens${g.sub ? ' ' + g.sub : ''} · <b>${S.fmt(S.total(g.list))}</b></p>
        <ol class="slots" aria-label="Itens: ${g.title}"></ol>
      </div>
      <div class="stage">
        <div class="ghost" aria-hidden="true"><span></span></div>
        <div class="platform" aria-hidden="true"><span class="ring ring-a"></span><span class="ring ring-b"></span></div>
        <div class="media"><img class="is-current" alt=""><img alt="" aria-hidden="true"></div>
      </div>
      <div class="panel" aria-live="polite"><div class="panel-body"></div></div>`;
    bays.append(sec);

    const slots = $('.slots', sec);
    g.list.forEach((it, k) => {
      const li = document.createElement('li');
      li.innerHTML = `<button class="slot" type="button" aria-pressed="false">
        <span class="slot-thumb"><img src="assets/img/thumb/${it.img}" alt="" width="52" height="52"></span>
        <span><span class="slot-kind">${it.kind}</span><span class="slot-name">${it.brand} ${it.name}</span></span>
      </button>`;
      const b = li.firstElementChild;
      b.addEventListener('click', () => select(g.id, k));
      if (fine) b.addEventListener('pointerenter', () => select(g.id, k));
      slots.append(li);
    });

    state[g.id] = { g, sec, index: -1, front: 0, timer: 0, seq: 0 };
    select(g.id, 0, true);

    // the item turns a little toward the cursor
    if (fine && !reduce) {
      const stage = $('.stage', sec);
      const media = $('.media', sec);
      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        media.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`);
        media.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -8}deg`);
      });
      stage.addEventListener('pointerleave', () => {
        media.style.setProperty('--ry', '0deg');
        media.style.setProperty('--rx', '0deg');
      });
    }
  });


  function select(gid, i, instant = false) {
    const st = state[gid];
    const list = st.g.list;
    i = (i + list.length) % list.length;
    if (i === st.index) return;
    st.index = i;
    const it = list[i];
    const sec = st.sec;

    $$('.slot', sec).forEach((b, k) => b.setAttribute('aria-pressed', k === i));
    if (current === sec) setTint(it.tint);
    sec.dataset.tint = it.tint;

    const ghost = $('.ghost', sec);
    const panel = $('.panel-body', sec);
    const fillText = () => {
      $('span', ghost).textContent = it.name;
      ghost.classList.remove('is-swapping');
      panel.innerHTML = `
        <p class="p-kind">${it.kind}</p>
        <h3 class="p-name">${it.brand} ${it.name}</h3>
        <p class="p-line">${it.line}</p>
        <dl class="p-specs">${it.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        <div class="p-price"><b>${S.fmt(it.price)}</b><span>${[it.priceNote, it.priceNote && it.priceNote.includes('pago') ? '' : 'média ' + S.priceDate].filter(Boolean).join(' · ')}</span></div>
        <a class="p-search" href="${S.search(it.q)}" target="_blank" rel="noopener">Buscar no Google <kbd>G</kbd></a>`;
      panel.classList.remove('is-swapping');
    };

    clearTimeout(st.timer);
    const seq = ++st.seq;
    if (instant || reduce) {
      fillText();
      swapImage(st, it, true);
      return;
    }
    ghost.classList.add('is-swapping');
    panel.classList.add('is-swapping');
    st.timer = setTimeout(fillText, 150);
    load(it).then(() => { if (seq === st.seq) swapImage(st, it, false); });
  }

  function swapImage(st, it, instant) {
    const imgs = $$('.media img', st.sec);
    const out = imgs[st.front];
    st.front = 1 - st.front;
    const inc = imgs[st.front];
    inc.src = 'assets/img/' + it.img;
    inc.alt = `${it.brand} ${it.name}`;
    inc.removeAttribute('aria-hidden');
    out.setAttribute('aria-hidden', 'true');
    if (instant) {
      out.classList.remove('is-current', 'is-leaving');
      inc.classList.add('is-current');
      return;
    }
    inc.classList.remove('is-current');
    inc.classList.add('is-entering');
    out.classList.add('is-leaving');
    out.classList.remove('is-current');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      inc.classList.remove('is-entering');
      inc.classList.add('is-current');
    }));
    setTimeout(() => out.classList.remove('is-leaving'), 200);
  }

  // first item of every bay first, then the rest in order
  GROUPS.forEach((g) => load(g.list[0]));
  const warm = () => GROUPS.forEach((g) => g.list.forEach(load));
  if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 1500 }); else setTimeout(warm, 600);

  // ---------- performance ----------

  const P = S.perf;
  const max = 760;
  const perf = $('#desempenho');
  $('.chart', perf).innerHTML = P.games.map((g, i) => `
    <div class="chart-row">
      <div class="chart-game">${g.game}<small>${g.preset}</small></div>
      <div class="chart-track" style="--r:${(P.refresh / max) * 100}">
        <div class="chart-bar" style="--a:${(g.min / max) * 100};--b:${(g.max / max) * 100};--i:${i}" title="${g.min}–${g.max} FPS"></div>
        <span class="chart-val${g.max / max > 0.7 ? ' inside' : ''}" style="--b:${(g.max / max) * 100}">${g.min}–${g.max} fps</span>
        ${i === 0 ? `<span class="chart-ref">${P.refresh} Hz do monitor</span>` : ''}
      </div>
    </div>`).join('');
  $('#perf-table').innerHTML = '<caption>FPS em 1080p</caption><tr><th>Jogo</th><th>Preset</th><th>FPS</th></tr>' +
    P.games.map((g) => `<tr><td>${g.game}</td><td>${g.preset}</td><td>${g.min} a ${g.max}</td></tr>`).join('');
  $('[data-sources]').innerHTML = P.sources.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join(', ');
  $('.foot-totals').innerHTML = GROUPS.map((g) => `<div><dt>${g.label}</dt><dd>${S.fmt(S.total(g.list))}</dd></div>`).join('');

  // ---------- scroll spy: section in view drives tint, tabs and total ----------

  const bar = $('.bar');
  const totalBox = $('.bar-total');
  const sections = [$('.hero'), ...GROUPS.map((g) => state[g.id].sec), perf];
  const tabs = $$('.tabs a');
  var current = null;

  function setTint(c) { document.body.style.setProperty('--tint', c); }

  function sync() {
    bar.classList.toggle('is-solid', scrollY > 24);
    const mid = innerHeight * 0.45;
    const sec = sections.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= mid && r.bottom > mid;
    }) || sections[0];
    if (sec === current) return;
    current = sec;
    setTint(sec.dataset.tint || '#ff7a2f');
    tabs.forEach((a) => a.setAttribute('aria-current', a.hash === '#' + sec.id));
    const st = state[sec.id];
    if (st) {
      $('.bar-total-label').textContent = st.g.label;
      $('.bar-total-val').textContent = S.fmt(S.total(st.g.list));
      totalBox.classList.add('is-on');
    } else if (sec === perf) {
      $('.bar-total-label').textContent = 'Monitor';
      $('.bar-total-val').textContent = P.refresh + ' Hz';
      totalBox.classList.add('is-on');
      perf.classList.add('is-in');
    } else {
      totalBox.classList.remove('is-on');
    }
  }
  let ticking = false;
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { sync(); ticking = false; }); }
  }, { passive: true });
  addEventListener('resize', sync);
  sync();

  // ---------- keyboard ----------

  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest('input, textarea')) return;
    const k = e.key.toLowerCase();
    const at = sections.indexOf(current);
    const st = current && state[current.id];
    if (k === 'q' || k === 'e') {
      const next = sections[Math.max(0, Math.min(sections.length - 1, at + (k === 'e' ? 1 : -1)))];
      next.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    } else if (st && (k === 'arrowdown' || k === 'arrowup')) {
      e.preventDefault();
      select(current.id, st.index + (k === 'arrowdown' ? 1 : -1));
      $$('.slot', current)[st.index].focus({ preventScroll: true });
    } else if (st && k === 'g') {
      window.open(S.search(st.g.list[st.index].q), '_blank', 'noopener');
    }
  });

  // ---------- cursor light + hero tilt ----------

  if (fine && !reduce) {
    const light = $('.cursor-light');
    const caseImg = $('.hero-case img');
    let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, running = false;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (scrollY < innerHeight) {
        caseImg.style.setProperty('--ry', `${(x / innerWidth - 0.5) * 10}deg`);
        caseImg.style.setProperty('--rx', `${(y / innerHeight - 0.5) * -6}deg`);
      }
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.5) requestAnimationFrame(tick);
      else running = false;
    };
    addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      light.classList.add('is-on');
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });
    document.addEventListener('pointerleave', () => light.classList.remove('is-on'));
  }
})();
