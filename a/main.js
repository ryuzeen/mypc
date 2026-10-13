(() => {
  const S = window.SETUP;
  const all = [...S.pc, ...S.gear, ...S.extra];
  const byId = Object.fromEntries(all.map((i) => [i.id, i]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // how tall each product stands on its shelf, as a share of the shelf height
  const fit = {
    case: [1, 330], gpu: [0.78, 330], cpu: [0.66, 230],
    mobo: [0.95, 300], ram: [0.3, 300], ssd: [0.28, 300], psu: [0.6, 300],
    monitor: [1, 340], keyboard: [0.5, 420], speaker: [0.55, 320],
    mouse: [0.62, 180], pad: [0.55, 260], headset: [0.8, 260],
    quest: [0.62, 260], iphone: [0.72, 150], ds4: [0.48, 250], kz: [0.68, 220],
    fun68: [0.3, 330], mad68: [0.3, 330], z84: [0.36, 330],
  };
  const tilts = [-2, 1.5, -1, 2, -1.5, 1, -0.5];
  let n = 0;

  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };

  const price = (v) => `<small>R$</small>${v.toLocaleString('pt-BR')}`;

  const item = (it) => {
    const i = n++;
    const [s, maxw] = fit[it.id] || [0.7, 300];
    const art = el('article', 'item');
    art.style.setProperty('--s', s);
    art.style.setProperty('--maxw', maxw + 'px');

    const stage = el('button', 'item-stage');
    stage.type = 'button';
    stage.setAttribute('aria-label', `${it.kind}: ${it.brand} ${it.name}, ver specs`);
    if (it.img) {
      const img = el('img');
      img.src = '../assets/img/' + it.img;
      img.alt = '';
      img.loading = i < 3 ? 'eager' : 'lazy';
      stage.append(img);
    } else {
      // no clean photo yet: a dark plate with the model name stands in
      stage.append(el('span', 'no-photo', `${it.brand}<br><b>${it.name}</b>`));
    }

    const pop = el('div', 'pop');
    pop.style.setProperty('--tilt', tilts[i % tilts.length] + 'deg');
    const backId = 'specs-' + it.id;
    pop.innerHTML = `
      <div class="pop-inner">
        <div class="pop-face pop-front">
          <span class="pop-kind">${it.kind}</span>
          <h3 class="pop-name">${it.brand} ${it.name}</h3>
          <span class="pop-brand">${it.line}</span>
          <span class="pop-price">${price(it.price)}</span>
          <button class="pop-flip" type="button" aria-controls="${backId}" aria-expanded="false">Ver specs</button>
        </div>
        <div class="pop-face pop-back" id="${backId}" inert>
          <span class="pop-kind">${it.brand} ${it.name}</span>
          <dl class="pop-specs">${it.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
          <a class="pop-search" href="${S.search(it.q)}" target="_blank" rel="noopener">Buscar no Google ↗</a>
          <button class="pop-flip" type="button">Voltar</button>
        </div>
      </div>
      ${it.priceNote ? `<span class="pop-note">${it.priceNote}</span>` : ''}`;

    const front = pop.querySelector('.pop-front');
    const back = pop.querySelector('.pop-back');
    const toggle = () => {
      const on = pop.classList.toggle('is-flipped');
      front.inert = on;
      back.inert = !on;
      pop.querySelector('.pop-front .pop-flip').setAttribute('aria-expanded', on);
      // move focus to the visible side so keyboard users stay on the card
      (on ? back.querySelector('.pop-search') : front.querySelector('.pop-flip')).focus({ preventScroll: true });
    };
    pop.querySelectorAll('.pop-flip').forEach((b) => b.addEventListener('click', toggle));
    stage.addEventListener('click', toggle);

    art.append(stage, pop);
    return art;
  };

  document.querySelectorAll('.shelves').forEach((wrap) => {
    const group = wrap.dataset.group;
    const rows = wrap.dataset.rows
      ? wrap.dataset.rows.split('|').map((r) => r.split(',').map((id) => byId[id]).filter(Boolean))
      : chunk(S[group] || [], 4);
    if (!rows.flat().length) return;
    wrap.closest('section').hidden = false;
    rows.forEach((r) => {
      const shelf = el('div', 'shelf');
      r.forEach((it) => shelf.append(item(it)));
      wrap.append(shelf);
    });
  });

  function chunk(list, size) {
    const out = [];
    for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
    return out;
  }

  document.querySelectorAll('[data-total]').forEach((e) => {
    e.innerHTML = price(S.total(S[e.dataset.total]));
  });
  document.querySelectorAll('[data-date]').forEach((e) => { e.textContent = S.priceDate; });

  // glass reflection drifts as the page scrolls
  const sheen = document.querySelector('.sheen');
  if (!reduce) {
    let ticking = false;
    const move = () => {
      sheen.style.setProperty('--sheen', (window.scrollY * 0.55 - 500).toFixed(0));
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(move); }
    }, { passive: true });
    move();
  }

  // performance poster
  const P = S.perf;
  const max = 650;
  const chart = document.querySelector('.chart');
  P.games.forEach((g, i) => {
    const row = el('div', 'chart-row');
    row.innerHTML = `
      <div class="chart-game">${g.game}<small>${g.preset}</small></div>
      <div class="chart-track" style="--r:${(P.refresh / max) * 100}">
        <div class="chart-bar" style="--a:${(g.min / max) * 100};--b:${(g.max / max) * 100};--i:${i}" title="${g.min}–${g.max} FPS"></div>
        <span class="chart-val" style="--b:${(g.max / max) * 100}">${g.min}–${g.max}</span>
        ${i === 0 ? `<span class="chart-ref">monitor ${P.refresh} Hz</span>` : ''}
      </div>`;
    chart.append(row);
  });
  const axis = el('div', 'chart-axis', '<span></span><div></div>');
  [0, 100, 200, 300, 400, 500, 600].forEach((v) => {
    axis.lastChild.append(Object.assign(el('span', null, String(v)), { style: `left:${(v / max) * 100}%` }));
  });
  chart.append(axis);

  document.getElementById('perf-table').innerHTML =
    '<caption>FPS em 1080p</caption><tr><th>Jogo</th><th>Preset</th><th>FPS</th></tr>' +
    P.games.map((g) => `<tr><td>${g.game}</td><td>${g.preset}</td><td>${g.min} a ${g.max}</td></tr>`).join('');
  document.querySelector('[data-sources]').innerHTML =
    P.sources.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join(', ');

  new IntersectionObserver((entries, io) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { chart.classList.add('is-in'); io.disconnect(); }
    });
  }, { threshold: 0.3 }).observe(chart);
})();
