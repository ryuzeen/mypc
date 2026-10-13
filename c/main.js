(() => {
  const S = window.SETUP;
  const feed = document.getElementById('feed');
  const outro = document.getElementById('desempenho');
  const progress = document.querySelector('.progress');
  const hudGroup = document.querySelector('.hud-group');
  const hudCount = document.querySelector('.hud-count');

  const GROUPS = [
    { id: 'pc', title: 'O PC', list: S.pc },
    { id: 'mesa', title: 'Mesa', list: S.gear },
    { id: 'guardados', title: 'Guardados', sub: 'e no trabalho', list: S.extra },
  ].filter((g) => g.list.length);
  const totalItems = GROUPS.reduce((n, g) => n + g.list.length, 0);

  const arrow = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // intro summary
  document.querySelector('.intro-sum').innerHTML = GROUPS.map((g) =>
    `<div><dt>${g.title}${g.sub ? ' ' + g.sub : ''}</dt><dd>${g.list.length} itens</dd></div>`).join('');

  let n = 0;
  GROUPS.forEach((g, gi) => {
    const head = document.createElement('section');
    head.className = 'screen group';
    head.id = g.id;
    head.dataset.tint = g.list[0].tint;
    head.dataset.group = g.title;
    head.innerHTML = `<h2>${g.title}</h2><p>${g.list.length} itens · total aprox. <b>${S.fmt(S.total(g.list))}</b></p>`;
    feed.insertBefore(head, outro);

    g.list.forEach((it, k) => {
      n++;
      const sec = document.createElement('section');
      sec.className = 'screen item';
      sec.id = it.id;
      sec.dataset.tint = it.tint;
      sec.dataset.group = g.title;
      sec.dataset.n = n;
      sec.setAttribute('aria-label', `${it.kind}: ${it.brand} ${it.name}`);
      sec.innerHTML = `
        <div class="item-media">
          ${it.img
            ? `<img src="../assets/img/${it.img}" alt="${it.brand} ${it.name}" loading="${n < 3 ? 'eager' : 'lazy'}">`
            : `<div class="no-photo">${it.brand}<b>${it.name}</b><small>sem foto ainda</small></div>`}
        </div>
        <div class="item-copy">
          <p class="item-kind">${it.kind}</p>
          <h3 class="item-name"><span class="item-brand">${it.brand}</span>${it.name}</h3>
          <p class="item-line">${it.line}</p>
          <dl class="item-specs">${it.specs.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>
          <div class="item-buy">
            <p class="item-price">${S.fmt(it.price)}<small>${it.priceNote ? it.priceNote + ' · ' : ''}média ${S.priceDate}</small></p>
            <a class="item-search" href="${S.search(it.q)}" target="_blank" rel="noopener">Buscar no Google ${arrow}</a>
          </div>
        </div>`;
      feed.insertBefore(sec, outro);

      const dot = document.createElement('a');
      dot.href = '#' + it.id;
      dot.title = `${it.brand} ${it.name}`;
      dot.setAttribute('aria-label', `${it.brand} ${it.name}`);
      if (k === 0 && gi > 0) dot.className = 'gap';
      progress.append(dot);
    });
  });

  // outro: chart + totals
  const P = S.perf;
  const max = 650;
  outro.querySelector('.chart').innerHTML = P.games.map((g, i) => `
    <div class="chart-row">
      <div class="chart-game">${g.game}<small>${g.preset}</small></div>
      <div class="chart-track" style="--r:${(P.refresh / max) * 100}">
        <div class="chart-bar" style="--a:${(g.min / max) * 100};--b:${(g.max / max) * 100};--i:${i}"></div>
        <span class="chart-val" style="--b:${(g.max / max) * 100}">${g.min}–${g.max}</span>
        ${i === 0 ? `<span class="chart-ref">${P.refresh} Hz do monitor</span>` : ''}
      </div>
    </div>`).join('');
  outro.querySelector('[data-sources]').innerHTML =
    P.sources.map(([nm, u]) => `<a href="${u}" target="_blank" rel="noopener">${nm}</a>`).join(', ');
  outro.querySelector('.totals').innerHTML = GROUPS.map((g) =>
    `<div><dt>${g.title}</dt><dd>${S.fmt(S.total(g.list))}</dd></div>`).join('');
  document.querySelectorAll('[data-date]').forEach((e) => { e.textContent = S.priceDate; });

  // whichever screen holds the viewport sets the room colour and the hud
  const dots = [...progress.querySelectorAll('a')];
  const all = [...document.querySelectorAll('.screen')];
  let current = null;
  const sync = () => {
    const mid = innerHeight * 0.45;
    const el = all.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= mid && r.bottom > mid;
    }) || all[0];
    if (el === current) return;
    current = el;
    el.classList.add('is-in');
    document.body.style.setProperty('--tint', el.dataset.tint || '#2a2420');
    hudGroup.textContent = el.dataset.group || '';
    hudCount.textContent = el.dataset.n ? `${el.dataset.n} / ${totalItems}` : '';
    dots.forEach((d) => d.setAttribute('aria-current', d.hash === '#' + el.id));
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { sync(); ticking = false; }); }
  }, { passive: true });
  addEventListener('resize', sync);

  // deep links (#gpu, #mesa...) land on their screen once the screens exist
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView({ behavior: 'instant' });
  }
  sync();

  // j / k as an alternative to the wheel
  const screens = () => [...document.querySelectorAll('.screen')];
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k !== 'j' && k !== 'k') return;
    const list = screens();
    const cur = list.findIndex((s) => Math.abs(s.getBoundingClientRect().top) < innerHeight / 2);
    const next = list[Math.max(0, Math.min(list.length - 1, cur + (k === 'j' ? 1 : -1)))];
    next.scrollIntoView({ behavior: 'smooth' });
  });
})();
