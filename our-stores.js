'use strict';
/* Union Trading Co. — Our Stores page (static rebuild of the Claude Design prototype). */
(function () {
  const el = id => document.getElementById(id);
  const ACCENT = '#a07d43';
  const ic = (p, s) => '<svg width="' + (s || 20) + '" height="' + (s || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' + p + '</svg>';
  const ICON_STORE = ic('<rect x="3" y="8" width="18" height="12" rx="1"></rect><path d="M3 8l2-4h14l2 4M8 20v-6h8v6"></path>', 30);

  const stores = [
    { num: '01', name: 'Head Office & Main Store', city: 'Kuwait City', cats: ['Flagship Stores', 'Electronics', 'Fashion'],
      tagline: 'Where it all began.',
      desc: 'Our founding flagship in the heart of Kuwait City, home to the full breadth of Union Trading brands and the beating heart of our operations since 1949.',
      hours: '8:00 AM – 10:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 4:00 PM – 10:00 PM',
      addr: ['Kuwait City, Block 1', 'Fahad Al-Salem Street', 'Kuwait'], phone: '+965 2242 3355', x: 64, y: 34,
      photos: ['img/store-01-g0.webp', 'img/store-01-g1.webp', 'img/store-01-g2.webp', 'img/store-01-g3.webp', 'img/store-01-g4.webp'] },
    { num: '02', name: 'Shuwaikh Store', city: 'Shuwaikh', cats: ['Electronics', 'Service Centers'],
      tagline: 'Built for the everyday.',
      desc: 'Our Shuwaikh destination pairs a wide appliances and electronics showroom with a full service center, serving Kuwait’s busiest commercial district.',
      hours: '9:00 AM – 9:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 4:00 PM – 9:00 PM',
      addr: ['Shuwaikh Industrial', 'Canada Dry Street', 'Kuwait'], phone: '+965 2461 2200', x: 68, y: 27,
      photos: [] },
    { num: '03', name: 'Jahra Store', city: 'Jahra', cats: ['Electronics', 'Fashion'],
      tagline: 'Close to home.',
      desc: 'Bringing trusted brands and personal service to the west of Kuwait, the Jahra store keeps every family within reach of what they need.',
      hours: '9:00 AM – 10:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 4:00 PM – 10:00 PM',
      addr: ['Jahra, Block 3', 'Governorate Avenue', 'Kuwait'], phone: '', x: 48, y: 30,
      photos: [] },
    { num: '04', name: 'Farwaniya Store', city: 'Farwaniya', cats: ['Fashion', 'Perfumes & Cosmetics'],
      tagline: 'Style within reach.',
      desc: 'A vibrant fashion and cosmetics destination in one of Kuwait’s most densely populated governorates, curated for everyday elegance.',
      hours: '9:00 AM – 11:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 2:00 PM – 11:00 PM',
      addr: ['Farwaniya, Block 1', 'Habib Munawer Street', 'Kuwait'], phone: '+965 2473 1150', x: 53, y: 50,
      photos: ['img/store-04-main.webp'] },
  ];

  const FILTERS = ['All Stores', 'Flagship Stores', 'Electronics', 'Fashion', 'Service Centers', 'Perfumes & Cosmetics'];

  const state = { store: 0, filter: 'All Stores', img: 0, showTip: false };
  let auto = null;

  function filteredIdx() {
    return stores.map((s, i) => i).filter(i => state.filter === 'All Stores' || stores[i].cats.includes(state.filter));
  }
  function clampIdx() {
    const fi = filteredIdx();
    return fi.includes(state.store) ? state.store : (fi[0] != null ? fi[0] : 0);
  }
  function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
  function startAuto() {
    stopAuto();
    auto = setInterval(() => {
      const fi = filteredIdx();
      const pos = fi.indexOf(clampIdx());
      const next = fi[(pos + 1) % fi.length];
      if (next != null) { state.store = next; state.img = 0; state.showTip = false; render(); }
    }, 7000);
  }
  function goStore(i) { stopAuto(); state.store = i; state.img = 0; state.showTip = true; render(); }
  function step(dir) {
    const fi = filteredIdx();
    const pos = fi.indexOf(clampIdx());
    goStore(fi[(pos + dir + fi.length) % fi.length]);
  }
  function setFilter(f) { stopAuto(); state.filter = f; state.img = 0; render(); }
  function setImg(i) { stopAuto(); const p = stores[clampIdx()].photos; const n = p.length || 1; state.img = ((i % n) + n) % n; render(); }

  function photoAt(store, i) {
    if (!store.photos.length) return null;
    const n = store.photos.length;
    return store.photos[((i % n) + n) % n];
  }

  function render() {
    const idx = clampIdx();
    const active = stores[idx];
    const fi = filteredIdx();

    /* ---- store info ---- */
    el('storeNum').textContent = active.num;
    el('storeName').innerHTML = active.name.replace('&', '&amp;');
    el('storeTagline').textContent = active.tagline;
    el('storeDesc').textContent = active.desc;

    /* ---- details ---- */
    el('storeHours').textContent = active.hours;
    el('storeDays').innerHTML = active.days + '<br>' + active.friday;
    el('storeAddr').innerHTML = active.addr.join('<br>');
    if (active.phone) { el('storePhoneRow').style.display = 'flex'; el('storePhone').textContent = active.phone; }
    else { el('storePhoneRow').style.display = 'none'; }

    /* ---- gallery main ---- */
    const cur = photoAt(active, state.img);
    if (cur) {
      el('galleryMain').innerHTML = '<img src="' + cur + '" alt="' + active.name + '" class="cover">';
    } else {
      el('galleryMain').innerHTML = '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#4a4842">' + ICON_STORE + '<span style="font-size:12px;letter-spacing:0.12em;font-weight:700">PHOTOS COMING SOON</span></div>';
    }

    /* ---- gallery thumbs: fixed 5-up tile size, centered when fewer than 5 (never stretch) ---- */
    const thumbs = el('galleryThumbs');
    thumbs.style.display = 'flex';
    thumbs.style.justifyContent = 'center';
    thumbs.style.gap = '10px';
    // each tile keeps the width of one cell in a 5-up row: (strip - 4 gaps) / 5
    const TILE = 'flex:0 0 calc((100% - 40px) / 5)';
    if (active.photos.length) {
      thumbs.style.position = 'static';
      const activePhoto = ((state.img % active.photos.length) + active.photos.length) % active.photos.length;
      thumbs.innerHTML = active.photos.map((src, i) =>
        '<div data-thumb="' + i + '" style="' + TILE + ';aspect-ratio:4/3;border-radius:8px;overflow:hidden;background:#161513;border:2px solid ' + (i === activePhoto ? ACCENT : '#2a2825') + ';cursor:pointer;opacity:' + (i === activePhoto ? 1 : 0.55) + ';transition:opacity .2s,border-color .2s"><img src="' + src + '" alt="" class="cover"></div>'
      ).join('');
      thumbs.querySelectorAll('[data-thumb]').forEach(d => d.onclick = () => setImg(+d.dataset.thumb));
    } else {
      // invisible tile-sized spacer keeps the strip the exact height of a tile row,
      // so the panel size stays fixed for stores without photos
      thumbs.style.position = 'relative';
      thumbs.innerHTML = '<div style="' + TILE + ';aspect-ratio:4/3;visibility:hidden"></div>'
        + '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#4a4842;font-size:11px;letter-spacing:0.1em;font-weight:700;border:1px dashed #2a2825;border-radius:8px">STORE GALLERY COMING SOON</div>';
    }

    /* ---- filters ---- */
    el('filterBtns').innerHTML = FILTERS.map(f => {
      const on = state.filter === f;
      return '<button data-filter="' + f + '" style="border:1px solid ' + (on ? '#cbb894' : '#33312d') + ';background:' + (on ? '#cbb894' : 'transparent') + ';color:' + (on ? '#0d0d0d' : '#cfcbc0') + ';font-size:12px;font-weight:700;letter-spacing:0.08em;padding:10px 20px;border-radius:999px;cursor:pointer;transition:all .25s;text-transform:uppercase">' + f + '</button>';
    }).join('');
    el('filterBtns').querySelectorAll('[data-filter]').forEach(b => b.onclick = () => setFilter(b.dataset.filter));

    /* ---- store cards ---- */
    el('storeCards').innerHTML = stores.map((s, i) => {
      const on = i === idx;
      const dimmed = !fi.includes(i);
      return '<button data-card="' + i + '" style="text-align:left;border:1px solid ' + (on ? ACCENT : '#2a2825') + ';background:' + (on ? '#161513' : 'transparent') + ';border-radius:12px;padding:12px 14px;cursor:pointer;opacity:' + (dimmed ? 0.35 : 1) + ';transition:all .25s;position:relative;min-width:0">'
        + '<div style="font-family:\'Archivo\';font-weight:600;font-size:13px;color:' + (on ? ACCENT : '#7c7972') + ';margin-bottom:8px">' + s.num + '</div>'
        + '<div style="font-family:\'Archivo\';font-weight:700;font-size:14px;color:#fff;line-height:1.25;margin-bottom:5px">' + s.name.replace('&', '&amp;') + '</div>'
        + '<div style="font-size:11.5px;color:#8f8c85">' + s.city + '</div>'
        + '<span style="position:absolute;top:14px;right:14px;color:' + ACCENT + ';opacity:' + (on ? 1 : 0) + '">' + ic('<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle>', 16) + '</span>'
        + '</button>';
    }).join('');
    el('storeCards').querySelectorAll('[data-card]').forEach(b => b.onclick = () => goStore(+b.dataset.card));

    /* ---- map pins ---- */
    el('mapPins').innerHTML = stores.map((s, i) => {
      const on = i === idx;
      const dimmed = !fi.includes(i);
      const size = on ? 26 : 14, dot = on ? 0 : 5;
      return '<div data-pin="' + i + '" style="position:absolute;left:' + s.x + '%;top:' + s.y + '%;transform:translate(-50%,-100%);cursor:pointer;z-index:' + (on ? 15 : 5) + '">'
        + '<div style="display:flex;flex-direction:column;align-items:center;gap:6px">'
        + '<div style="position:relative;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + (on ? ACCENT : '#fff') + ';border:2px solid ' + (on ? '#fff' : ACCENT) + ';display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,0.28)">'
        + '<span style="width:' + dot + 'px;height:' + dot + 'px;border-radius:50%;background:' + (on ? '#fff' : ACCENT) + '"></span>'
        + (on ? '<span style="position:absolute;inset:-2px;border-radius:50%;border:2px solid #fff;animation:pinPulse 2.2s ease-out infinite"></span>' : '')
        + '</div>'
        + '<span style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:' + (dimmed ? '#b6b1a5' : '#3a3833') + ';text-transform:uppercase;white-space:nowrap;text-shadow:0 1px 3px rgba(239,236,228,0.9)">' + s.city + '</span>'
        + '</div></div>';
    }).join('');
    el('mapPins').querySelectorAll('[data-pin]').forEach(d => d.onclick = () => goStore(+d.dataset.pin));

    /* ---- tooltip ---- */
    const tip = el('mapTip');
    if (state.showTip) {
      const rightSide = active.x > 55;
      tip.style.display = 'block';
      tip.style.top = (active.y + 4) + '%';
      if (rightSide) { tip.style.left = (active.x - 1) + '%'; tip.style.transform = 'translate(-100%,-50%)'; }
      else { tip.style.left = (active.x + 4) + '%'; tip.style.transform = 'translateY(-50%)'; }
      tip.innerHTML = '<div style="font-size:12px;letter-spacing:0.14em;font-weight:700;margin-bottom:8px">' + active.name.toUpperCase().replace('&', '&amp;') + '</div>'
        + '<div style="font-size:12.5px;color:#b9b5ac;line-height:1.6;margin-bottom:4px">' + active.tagline + '</div>'
        + '<div style="font-size:12.5px;color:#b9b5ac;line-height:1.6;margin-bottom:16px">Open ' + active.hours + '</div>'
        + '<a href="#stores" style="display:inline-flex;align-items:center;gap:10px;font-size:11px;font-weight:700;letter-spacing:0.14em;color:#fff;border-bottom:1px solid rgba(255,255,255,0.4);padding-bottom:5px">VIEW STORE'
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>';
    } else {
      tip.style.display = 'none';
    }
  }

  /* ---- static wiring ---- */
  el('imgPrev').onclick = () => setImg(state.img - 1);
  el('imgNext').onclick = () => setImg(state.img + 1);
  el('prevStore').onclick = () => step(-1);
  el('nextStore').onclick = () => step(1);

  // Scroll to the store explorer via JS (no #stores stamped on the URL), and keep
  // placeholder "#" links from dirtying the address bar. Works for the hero EXPLORE
  // button and the map "VIEW STORE" tooltip (both regenerated), via delegation.
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#stores') {
      e.preventDefault();
      el('explorer').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (href === '#') {
      e.preventDefault();
    }
  });

  // Close the map tooltip when clicking anywhere outside it. Ignore clicks on a pin
  // (those open the tooltip) and inside the tooltip itself.
  document.addEventListener('click', e => {
    if (!state.showTip) return;
    if (el('mapTip').contains(e.target) || e.target.closest('[data-pin]')) return;
    state.showTip = false;
    el('mapTip').style.display = 'none';
  });

  render();
  startAuto();
})();
