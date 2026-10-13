(() => {
  const S = window.SETUP;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const TABS = [
    { id: 'pc', label: 'PC completo', list: S.pc },
    { id: 'gear', label: 'Mesa', list: S.gear },
    { id: 'extra', label: 'Guardados', list: S.extra },
    { id: 'perf', label: 'Desempenho' },
  ].filter((t) => !t.list || t.list.length);

  const $ = (s) => document.querySelector(s);
  const slotsEl = $('.slots');
  const panel = $('.panel-body');
  const imgs = [...document.querySelectorAll('.stage-img')];
  const stageText = $('.stage-text');
  const chart = $('.chart');
  const media = $('.stage-media');
  const totalLabel = $('.bar-total-label');
  const totalVal = $('.bar-total-val');
  const tabBtns = [...document.querySelectorAll('[role="tab"]')];

  let tab = 0;
  let index = 0;
  let front = 0;
  let swapTimer;

  document.querySelectorAll('[data-date]').forEach((e) => { e.textContent = S.priceDate; });
  tabBtns.forEach((b) => { if (!TABS.find((t) => t.id === b.dataset.tab)) b.remove(); });

  // preload everything once so swaps never flash
  [...S.pc, ...S.gear, ...S.extra].forEach((it) => { if (it.img) new Image().src = '../assets/img/' + it.img; });

  const setTint = (c) => document.body.style.setProperty('--tint', c);

  function openTab(t, i = 0) {
    tab = (t + TABS.length) % TABS.length;
    const T = TABS[tab];
    tabBtns.forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === T.id));

    if (T.id === 'perf') {
      slotsEl.innerHTML = '';
      slotsEl.hidden = true;
      media.hidden = true;
      chart.hidden = false;
      renderChart();
      totalLabel.textContent = 'Monitor';
      totalVal.textContent = S.perf.refresh + ' Hz';
      setTint('#ff7a2f');
      return;
    }

    slotsEl.hidden = false;
    media.hidden = false;
    chart.hidden = true;
    totalLabel.textContent = T.label;
    totalVal.textContent = S.fmt(S.total(T.list));

    slotsEl.innerHTML = '';
    T.list.forEach((it, k) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.className = 'slot';
      b.type = 'button';
      b.innerHTML = `
        <span class="slot-thumb">${it.img ? `<img src="../assets/img/${it.img}" alt="">` : `<span>${it.brand}</span>`}</span>
        <span><span class="slot-kind">${it.kind}</span><span class="slot-name">${it.brand} ${it.name}</span></span>`;
      b.addEventListener('click', () => select(k));
      if (fine) b.addEventListener('pointerenter', () => select(k));
      li.append(b);
      slotsEl.append(li);
    });
    select(i, true);
  }

  function select(i, instant = false) {
    const T = TABS[tab];
    if (!T.list) return;
    index = (i + T.list.length) % T.list.length;
    const it = T.list[index];
    [...slotsEl.querySelectorAll('.slot')].forEach((b, k) => b.setAttribute('aria-selected', k === index));
    slotsEl.querySelectorAll('.slot')[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    setTint(it.tint);

    const out = imgs[front];
    if (it.img) {
      stageText.hidden = true;
      front = 1 - front;
      const inc = imgs[front];
      inc.src = '../assets/img/' + it.img;
      inc.alt = `${it.brand} ${it.name}`;
      if (instant || reduce) {
        out.classList.remove('is-current', 'is-leaving');
        inc.classList.add('is-current');
      } else {
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
    } else {
      imgs.forEach((im) => im.classList.remove('is-current'));
      stageText.hidden = false;
      stageText.innerHTML = `${it.brand}<b>${it.name}</b><small>sem foto ainda</small>`;
    }

    const fill = () => {
      panel.innerHTML = `
        <p class="p-kind">${it.kind}</p>
        <h1 class="p-name">${it.brand} ${it.name}</h1>
        <p class="p-line">${it.line}</p>
        <dl class="p-specs">${it.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        <div class="p-price"><b>${S.fmt(it.price)}</b><span>${it.priceNote ? it.priceNote + ' · ' : ''}média ${S.priceDate}</span></div>
        <a class="p-search" href="${S.search(it.q)}" target="_blank" rel="noopener">Buscar no Google <kbd>G</kbd></a>`;
      panel.classList.remove('is-swapping');
    };
    clearTimeout(swapTimer);
    if (instant || reduce) fill();
    else { panel.classList.add('is-swapping'); swapTimer = setTimeout(fill, 140); }
  }

  function renderChart() {
    const P = S.perf;
    const max = 650;
    chart.innerHTML = P.games.map((g, i) => `
      <div class="chart-row">
        <div class="chart-game">${g.game}<small>${g.preset}</small></div>
        <div class="chart-track" style="--r:${(P.refresh / max) * 100}">
          <div class="chart-bar" style="--a:${(g.min / max) * 100};--b:${(g.max / max) * 100};--i:${i}"></div>
          <span class="chart-val" style="--b:${(g.max / max) * 100}">${g.min}–${g.max} fps</span>
          ${i === 0 ? `<span class="chart-ref">${P.refresh} Hz do monitor</span>` : ''}
        </div>
      </div>`).join('');
    panel.classList.remove('is-swapping');
    panel.innerHTML = `
      <p class="p-kind">1080p</p>
      <h1 class="p-name">Quanto roda</h1>
      <p class="p-line">Faixas de FPS para Ryzen 7 7700X + RTX 4070 Super, tiradas de reviews e calculadoras públicas.</p>
      <p class="p-note">Não medido neste PC. Tudo que passa da linha laranja já é mais do que o monitor de ${P.refresh} Hz consegue mostrar.</p>
      <p class="p-note">Fontes: ${P.sources.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join(', ')}</p>`;
  }

  tabBtns.forEach((b) => b.addEventListener('click', () => openTab(TABS.findIndex((t) => t.id === b.dataset.tab))));

  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 'q') openTab(tab - 1);
    else if (k === 'e') openTab(tab + 1);
    else if ((k === 'arrowdown' || k === 's') && TABS[tab].list) { e.preventDefault(); select(index + 1); }
    else if ((k === 'arrowup' || k === 'w') && TABS[tab].list) { e.preventDefault(); select(index - 1); }
    else if (k === 'g' && TABS[tab].list) window.open(S.search(TABS[tab].list[index].q), '_blank', 'noopener');
  });

  // the item turns a little toward the cursor
  if (fine && !reduce) {
    const stage = $('.stage');
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      media.style.setProperty('--ry', `${x * 14}deg`);
      media.style.setProperty('--rx', `${y * -8}deg`);
    });
    stage.addEventListener('pointerleave', () => {
      media.style.setProperty('--ry', '0deg');
      media.style.setProperty('--rx', '0deg');
    });
  }

  openTab(0);
})();
