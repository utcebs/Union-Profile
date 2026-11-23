'use strict';
/* Union Trading Co. — Our Stores page (static rebuild of the Claude Design prototype). */
(function () {
  const el = id => document.getElementById(id);
  const ACCENT = '#a07d43';
  const ic = (p, s) => '<svg width="' + (s || 20) + '" height="' + (s || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' + p + '</svg>';
  const ICON_STORE = ic('<rect x="3" y="8" width="18" height="12" rx="1"></rect><path d="M3 8l2-4h14l2 4M8 20v-6h8v6"></path>', 30);
  // tel: uses the first listed number; wa.me wants digits only (no + or spaces)
  const telHref = p => 'tel:' + (p || '').split(/[·,]/)[0].replace(/[^0-9+]/g, '');
  const waHref = w => 'https://wa.me/' + (w || '').replace(/[^0-9]/g, '');

  const PH_DESC = 'Full details for this location are being added and will appear here soon.';
  const D = 'Saturday – Thursday', F = 'Friday: 4:00 PM – 10:00 PM', HRS = '9:00 AM – 10:00 PM';
  const ALLWEEK = 'Sunday – Saturday';
  // gallery photo paths for a store: P('salmiya', 8) -> ['img/stores/salmiya-1.webp', ...]
  const P = (slug, n) => Array.from({ length: n }, (_, i) => 'img/stores/' + slug + '-' + (i + 1) + '.webp');
  const stores = [
  /* cms:stores */
    { num: '01', name: 'Flagship Store', city: 'Salem Al Mubarak Street, Salmiya', cats: [],
      tagline: 'Where it all began.',
      desc: 'Our founding flagship in the heart of Kuwait City, home to the full breadth of Union Trading brands — where the Union Trading story began in 1949.',
      hours: '8:00 AM – 10:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 4:00 PM – 10:00 PM',
      addr: ['Kuwait City, Block 1', 'Fahad Al-Salem Street', 'Kuwait'], phone: '+965 2242 3355',
      maps: 'https://www.google.com/maps/search/?api=1&query=Union%20Trading%20Company%20Fahad%20Al-Salem%20Street%20Kuwait%20City',
      x: 63.9, y: 46.2, photos: ['img/Showroom%20Images/Flagship.webp', 'img/stores/fahed-al-salem-1.webp', 'img/stores/fahed-al-salem-2.webp', 'img/stores/fahed-al-salem-3.webp', 'img/stores/fahed-al-salem-4.webp', 'img/stores/fahed-al-salem-5.webp', 'img/stores/fahed-al-salem-6.webp'] },

    { num: '02', name: 'Salmiya Store', city: 'Salmiya', cats: [],
      tagline: 'At the heart of Salmiya.',
      desc: 'Our Salmiya destination on Salem Al Mubarak Street, bringing the full Union Trading range and trusted service close to home.',
      hours: '10:00 AM – 10:00 PM', days: 'Sunday – Saturday', friday: '',
      addr: ['Salem Al Mubarak Street', 'Salmiya, Kuwait'], phone: '+965 9550 1717', whatsapp: '+965 9550 1717',
      maps: 'https://www.google.com/maps/place/%D8%B9%D9%85%D8%A7%D8%B1%D8%A9+%D8%A7%D9%84%D8%B3%D8%A7%D9%84%D9%85%D9%8A%D8%A9+%D8%A7%D9%84%D8%B4%D9%85%D8%A7%D9%84%D9%8A%D8%A9%D8%8C+83M6%2BXG5+Union+Trading+Company,+22+Salem+Al+Mubarak+St,+Salmiya/@29.3339,48.0753,17z/',
      x: 68, y: 48.2, photos: ['img/stores/salmiya-1.webp', 'img/stores/salmiya-2.webp', 'img/stores/salmiya-3.webp', 'img/stores/salmiya-4.webp', 'img/stores/salmiya-5.webp', 'img/stores/salmiya-6.webp', 'img/stores/salmiya-7.webp', 'img/stores/salmiya-8.webp'] },

    { num: '03', name: 'Farwaniya Store', city: 'Farwaniya', cats: [],
      tagline: 'Serving the Farwaniya community.',
      desc: 'Your Union Trading destination in Farwaniya, with our full range of brands and dependable everyday service.',
      hours: '10:00 AM – 10:00 PM', days: 'Sunday – Saturday', friday: '',
      addr: ['Farwaniya, Kuwait'], phone: '+965 2473 3820', whatsapp: '+965 9550 1738',
      maps: 'https://maps.app.goo.gl/sKnpdwsrxFUwvfup8',
      x: 63.4, y: 51.1, photos: ['img/stores/farwaniya-2.webp', 'img/stores/farwaniya-1.webp'] },

    { num: '04', name: 'Hawally Store', city: 'Hawally', cats: [],
      tagline: 'Close to Hawally.',
      desc: 'The Union Trading experience in Hawally — trusted brands and expert support, right where you need them.',
      hours: '10:00 AM – 10:00 PM', days: 'Sunday – Saturday', friday: '',
      addr: ['Hawally, Kuwait'], phone: '+965 9407 4000', whatsapp: '+965 9407 4000',
      maps: 'https://maps.app.goo.gl/emGnAaX6nwLfUri26',
      x: 65.7, y: 47.7, photos: ['img/stores/hawally-1.webp', 'img/stores/hawally-2.webp', 'img/stores/hawally-3.webp', 'img/stores/hawally-4.webp'] },

    { num: '05', name: 'Fahaheel Store', city: 'Fahaheel', cats: [],
      tagline: 'Inside Fahaheel Yaal Mall.',
      desc: 'Visit us at Yaal Mall in Fahaheel for the complete Union Trading range and the service you know.',
      hours: '10:00 AM – 10:00 PM', days: 'Sunday – Saturday', friday: '',
      addr: ['Yaal Mall', 'Fahaheel, Kuwait'], phone: '+965 9550 1707', whatsapp: '+965 9550 1707',
      maps: 'https://www.google.com.kw/maps/place/Yaal+Mall/@29.0790652,48.1357316,17z/data=!3m1!4b1!4m5!3m4!1s0x3fcf065d2fa19795:0xc7f948d44e14d60c!8m2!3d29.0790652!4d48.1379203',
      x: 71.1, y: 62.2, photos: ['img/stores/fahaheel-1.webp', 'img/stores/fahaheel-2.webp', 'img/stores/fahaheel-3.webp', 'img/stores/fahaheel-4.webp', 'img/stores/fahaheel-5.webp', 'img/stores/fahaheel-6.webp', 'img/stores/fahaheel-7.webp', 'img/stores/fahaheel-8.webp'] },

    { num: '07', name: 'Al-Qurain Store', city: 'Al-Qurain', cats: [],
      tagline: 'Serving Al-Qurain.',
      desc: 'A look inside our Al-Qurain showroom. Full visiting details for this location are coming soon.',
      hours: '9:00 AM – 10:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 4:00 PM – 10:00 PM',
      addr: ['Al-Qurain, Kuwait'],
      x: 68.8, y: 55.4, photos: ['img/stores/al-qurain-1.webp', 'img/stores/al-qurain-2.webp', 'img/stores/al-qurain-3.webp', 'img/stores/al-qurain-4.webp', 'img/stores/al-qurain-5.webp', 'img/stores/al-qurain-6.webp'] },

    { num: '08', name: 'Jahra Store', city: 'Jahra', cats: [],
      tagline: 'Serving Jahra.',
      desc: 'Our Jahra destination brings Union Trading trusted brands and service to the west of Kuwait.',
      hours: '10:00 AM – 10:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 5:00 PM – 10:00 PM',
      addr: ['Jahra, Kuwait'], phone: '+965 2457 2747', whatsapp: '+965 9550 1808',
      maps: 'https://maps.app.goo.gl/xjbgbsW6j7vBFirQA',
      x: 50.4, y: 47.1, photos: ['img/stores/jahra-1.webp', 'img/stores/jahra-2.webp'] },

    { num: '09', name: 'Shuwaikh Store', city: 'Shuwaikh', cats: [],
      tagline: 'The Shuwaikh showroom.',
      desc: 'Our Shuwaikh location for the full range of Union Trading appliances and expert guidance.',
      hours: '9:00 AM – 9:00 PM', days: 'Saturday – Thursday', friday: 'Friday: Closed',
      addr: ['Shuwaikh, Kuwait'], phone: '+965 2491 8804 · +965 2494 8805', whatsapp: '+965 9550 1725',
      maps: 'https://maps.app.goo.gl/UXwYZT7qvXPXuiFA8',
      x: 62.9, y: 48.9, photos: ['img/stores/shuwaikh-1.webp', 'img/stores/shuwaikh-2.webp', 'img/stores/shuwaikh-3.webp'] },

    { num: '10', name: 'Hawalli (Built-in Appliances) Store', city: 'Hawalli · Built-in', cats: [],
      tagline: 'Built-in appliance specialists.',
      desc: 'Our Hawalli showroom dedicated to built-in kitchen and home appliances, with specialist advice.',
      hours: '9:30 AM – 1:00 PM  ·  5:00 PM – 9:30 PM', days: 'Saturday – Thursday', friday: '',
      addr: ['Hawalli, Kuwait'], phone: '+965 2264 3788', whatsapp: '+965 9550 1801',
      maps: 'https://maps.app.goo.gl/sCPyKSSZyjkuczv56',
      x: 66.3, y: 48.2, photos: ['img/stores/brazilia-1.webp'] },

    { num: '11', name: 'Sabah Al-Salem Store', city: 'Sabah Al-Salem', cats: [],
      tagline: 'Serving Sabah Al-Salem.',
      desc: 'Your neighbourhood Union Trading destination in Sabah Al-Salem, close and always ready to help.',
      hours: '10:00 AM – 10:00 PM', days: 'Sunday – Saturday', friday: '',
      addr: ['Sabah Al-Salem, Kuwait'], phone: '+965 9407 4004', whatsapp: '+965 9407 4004',
      maps: 'https://maps.app.goo.gl/drCcGEDE7VKsUcHq6',
      x: 68.6, y: 52.4, photos: ['img/stores/sabah-al-salem-1.webp', 'img/stores/sabah-al-salem-2.webp', 'img/stores/sabah-al-salem-3.webp', 'img/stores/sabah-al-salem-4.webp', 'img/stores/sabah-al-salem-5.webp', 'img/stores/sabah-al-salem-6.webp', 'img/stores/sabah-al-salem-7.webp', 'img/stores/sabah-al-salem-8.webp', 'img/stores/sabah-al-salem-9.webp', 'img/stores/sabah-al-salem-10.webp', 'img/stores/sabah-al-salem-11.webp'] },

    { num: '12', name: 'Al-Rai Store', city: 'Al-Rai', cats: [],
      tagline: 'Serving Al-Rai.',
      desc: 'A look inside our Al-Rai showroom. Full visiting details for this location are coming soon.',
      hours: '9:00 AM – 10:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 4:00 PM – 10:00 PM',
      addr: ['Al-Rai, Kuwait'],
      x: 61.7, y: 51.1, photos: ['img/stores/al-rai-1.webp', 'img/stores/al-rai-2.webp', 'img/stores/al-rai-3.webp', 'img/stores/al-rai-4.webp', 'img/stores/al-rai-5.webp', 'img/stores/al-rai-6.webp', 'img/stores/al-rai-7.webp'] },

    { num: '13', name: 'Farwaniya Store 2', city: 'Farwaniya', cats: [],
      tagline: 'A second home in Farwaniya.',
      desc: 'Our second Farwaniya destination, extending the full Union Trading range across the governorate.',
      hours: '10:00 AM – 10:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 5:00 PM – 10:00 PM',
      addr: ['Farwaniya, Kuwait'], phone: '+965 2474 2791', whatsapp: '+965 9550 1806',
      maps: 'https://goo.gl/maps/XCckvVJFSS92qqNA6',
      x: 62.3, y: 51.4, photos: ['img/stores/salmiya-2.webp'] },

    { num: '14', name: 'Vero Moda Store', city: 'Warehouse Mall', cats: [], soon: true,
      tagline: 'Coming soon to Warehouse Mall.',
      desc: 'Our newest destination inside Warehouse Mall. Full visiting details for this location are coming soon.',
      hours: 'Coming soon', days: 'Opening details coming soon', friday: '',
      addr: ['Warehouse Mall, Kuwait'],
      x: 61.4, y: 51.5, photos: ['img/stores/vero-moda-1.webp', 'img/stores/vero-moda-2.webp', 'img/stores/vero-moda-3.webp'] },

    { num: '15', name: 'Aluna Store', city: 'Salmiya', cats: [],
      tagline: 'Sophistication, comfort and confidence.',
      desc: 'Aluna is a modern lingerie brand that empowers women across all ages by blending sophistication, comfort, and confidence. We focus on quality, inclusivity, and timeless design.',
      hours: '10:00 AM – 10:00 PM', days: 'Saturday – Wednesday', friday: 'Thursday & Friday: 10:00 AM – 11:00 PM',
      addr: ['Marina Mall', 'Salmiya, Kuwait'], whatsapp: '+965 9407 6070',
      maps: 'https://maps.app.goo.gl/tfC1eESqKSgVfEyV9',
      x: 67.5, y: 48, photos: ['img/stores/aluna-1.webp', 'img/stores/aluna-2.webp', 'img/stores/aluna-3.webp'] },

    { num: '', name: 'Head Office', city: 'Al Qibla', cats: ['Offices'], head: true,
      tagline: 'Our corporate headquarters.',
      desc: 'The head office of Union Trading Company — the hub coordinating our divisions, brand partnerships, and retail network across Kuwait.',
      hours: '8:00 AM – 5:00 PM', days: 'Sunday – Thursday', friday: '',
      addr: ['Dawliah Commercial Center', 'Floor 3, Block 15', 'Al Qibla, Kuwait'], phone: '+965 2242 3355',
      maps: 'https://maps.app.goo.gl/SCB6ofeVmjWm91QE9',
      x: 62.7, y: 48.5, photos: ['img/Showroom%20Images/HOPrem.webp', 'img/Showroom%20Images/HO2.webp'] },
/* /cms:stores */
  ];

  const FILTERS = ['All Stores', 'Offices'];

  /* ===== TEMPORARY: manual pin-placement editor =====
     Set PIN_EDIT to false (or delete this block + the editor functions below) to turn it off.
     Positions are saved to localStorage so they persist on this browser across reloads.
     Use "Copy coords" to hand the final x/y values back so they can be baked into this file. */
  // Pin editing is OFF for visitors. The console opens this page with ?pinedit=1 inside
  // its own window, drags the pins on the real layout, and stores what comes back. The
  // page itself saves nothing and publishes nothing.
  const PIN_EDIT = /[?&]pinedit=1/.test(location.search);
  const PIN_HOST = PIN_EDIT && window.parent !== window;
  function tellHost(msg) { try { if (PIN_HOST) window.parent.postMessage(msg, '*'); } catch (e) { /* ignore */ } }
  // While being previewed, the pins shown are the ones the console is holding, which may
  // not be published yet. Nothing here is stored: it is a picture of the draft.
  if (PIN_HOST) {
    window.addEventListener('message', function (ev) {
      const m = ev.data;
      if (!m || m.utcPin !== 'positions' || !Array.isArray(m.list)) return;
      m.list.forEach(function (p) {
        const st = stores.filter(function (x) { return x.name === p.name; })[0];
        if (st && typeof p.x === 'number' && typeof p.y === 'number') { st.x = p.x; st.y = p.y; }
      });
      render();
    });
  }
  const PIN_KEY = 'utcStorePins';
  const PIN_VER = '2026-08-19e';
  // Pin positions come from the list above and nothing else. They used to be restored
  // from this browser's own storage, left over from dragging them by hand during design,
  // which quietly overrode the published positions on the machines that had done the
  // dragging. Any leftovers are cleared out once, then forgotten.
  (function forgetOldPins() {
    try { localStorage.removeItem(PIN_KEY); localStorage.removeItem('utcStorePinsVer'); } catch (e) { /* ignore */ }
  })();

  // ---- the pins belong to the PICTURE, not to the box around it ----------------
  // The picture fills the map box and the overflow is cropped, and that box is a
  // different shape on every screen. So the pin layer is put over the PICTURE itself, at
  // its drawn size and offset, and re-measured whenever anything resizes. A pin at
  // 50%/50% is then the middle of the map, not the middle of the box, and stretching the
  // window cannot move it off its town.
  const MAP_W = 1083, MAP_H = 992;                 // uploads/q8map.webp, its own size
  function fitPinLayer() {
    const inner = el('mapInner'), pins = el('mapPins');
    if (!inner || !pins) return;
    const img = inner.querySelector('img');
    const bw = inner.clientWidth, bh = inner.clientHeight;
    if (!bw || !bh) return;
    const iw = (img && img.naturalWidth) || MAP_W, ih = (img && img.naturalHeight) || MAP_H;
    const scale = Math.max(bw / iw, bh / ih);        // the same rule as object-fit: cover
    const w = iw * scale, h = ih * scale;
    pins.style.position = 'absolute';
    pins.style.left = ((bw - w) / 2) + 'px';
    pins.style.top = ((bh - h) / 2) + 'px';
    pins.style.width = w + 'px';
    pins.style.height = h + 'px';
    pins.style.zIndex = '3';
  }
  window.addEventListener('resize', fitPinLayer);
  window.addEventListener('load', fitPinLayer);
  if (window.ResizeObserver) {
    // the box also changes shape when the text beside it reflows, which fires no resize
    const ro = new ResizeObserver(function () { fitPinLayer(); });
    setTimeout(function () { const inner = el('mapInner'); if (inner) ro.observe(inner); }, 0);
  }

  const state = { store: 0, filter: 'All Stores', img: 0, showTip: false };
  let auto = null;
  let measuring = false;   // true while lockPanelHeight() cycles stores to measure

  function filteredIdx() {
    // "All Stores" = the retail stores only (offices excluded); any other filter matches by category
    return stores.map((s, i) => i).filter(i => state.filter === 'All Stores' ? !stores[i].head : stores[i].cats.includes(state.filter));
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
  // Another photo of the SAME store changes only the photo: the big picture cross-fades and the
  // highlight moves along the thumbnails. It used to call render(), which rebuilt the thumbnails,
  // the store list and the map, so every picture on the panel reloaded at once.
  function setImg(i) {
    stopAuto();
    const a = stores[clampIdx()]; const n = a.photos.length || 1;
    state.img = ((i % n) + n) % n;
    if (!a.photos.length || !el('galleryMain').querySelector('img')) { render(); return; }
    swapPhoto(a);
  }
  let swapTok = 0;
  function swapPhoto(a) {
    const gm = el('galleryMain'), src = photoAt(a, state.img), tok = ++swapTok;
    const im = new Image();
    im.className = 'cover'; im.alt = a.name; im.decoding = 'async'; im.src = src;
    im.style.cssText = 'position:absolute;inset:0;opacity:0;transition:opacity .35s ease';
    const show = () => {
      if (tok !== swapTok) return;                       // a newer choice already won
      gm.appendChild(im);
      requestAnimationFrame(() => requestAnimationFrame(() => { im.style.opacity = '1'; }));
      setTimeout(() => { if (tok !== swapTok) return; Array.prototype.forEach.call(gm.querySelectorAll('img'), x => { if (x !== im) x.remove(); }); }, 400);
    };
    if (im.decode) im.decode().then(show, show); else im.onload = show;
    const at = state.img, thumbs = el('galleryThumbs');
    thumbs.querySelectorAll('[data-thumb]').forEach(d => {
      const on = +d.dataset.thumb === at;
      d.style.borderColor = on ? ACCENT : '#2a2825';
      d.style.opacity = on ? 1 : 0.55;
    });
    if (thumbs.scrollWidth > thumbs.clientWidth + 2) {
      const t = thumbs.querySelector('[data-thumb="' + at + '"]');
      if (t) thumbs.scrollTo({ left: t.offsetLeft - (thumbs.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
    }
  }

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
    el('storeNum').textContent = active.num || '—';
    if (el('storeTotal')) el('storeTotal').textContent = ('0' + stores.filter(s => !s.head).length).slice(-2);
    el('storeName').innerHTML = active.name.replace('&', '&amp;');
    el('storeTagline').textContent = active.tagline;
    el('storeDesc').textContent = active.desc;

    /* ---- status badge (green "OPEN NOW", or amber "COMING SOON" for not-yet-open stores) ---- */
    const stW = el('storeStatus'), stD = el('storeStatusDot'), stT = el('storeStatusText');
    if (stW) {
      if (active.soon) {
        stW.style.background = '#241d10'; stW.style.borderColor = '#4a3a1c';
        stD.style.background = ACCENT; stT.style.color = '#d8b877'; stT.textContent = 'COMING SOON';
      } else {
        stW.style.background = '#17251a'; stW.style.borderColor = '#2c4531';
        stD.style.background = '#5fbf7a'; stT.style.color = '#7fd398'; stT.textContent = 'OPEN NOW';
      }
    }

    /* ---- details ---- */
    el('storeHours').textContent = active.hours;
    el('storeDays').innerHTML = active.days + (active.friday ? '<br>' + active.friday : '');
    el('storeAddr').innerHTML = active.addr.join('<br>');
    if (active.phone) { el('storePhoneRow').style.display = 'flex'; el('storePhone').textContent = active.phone; }
    else { el('storePhoneRow').style.display = 'none'; }

    /* ---- action links (only shown when the store has the data) ---- */
    const aDir = el('actDirections'), aCall = el('actCall'), aWa = el('actWhatsapp');
    if (active.maps) { aDir.style.display = 'flex'; aDir.href = active.maps; } else { aDir.style.display = 'none'; }
    if (active.phone) { aCall.style.display = 'flex'; aCall.href = telHref(active.phone); } else { aCall.style.display = 'none'; }
    if (el('actCallLabel')) el('actCallLabel').textContent = active.head ? 'CALL OFFICE' : 'CALL STORE';
    if (active.whatsapp) { aWa.style.display = 'flex'; aWa.href = waHref(active.whatsapp); } else { aWa.style.display = 'none'; }

    /* ---- gallery main ---- */
    const cur = photoAt(active, state.img);
    if (cur) {
      el('galleryMain').innerHTML = '<img loading="lazy" decoding="async" src="' + cur + '" alt="' + active.name + '" class="cover">';
    } else {
      el('galleryMain').innerHTML = '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#4a4842">' + ICON_STORE + '<span style="font-size:12px;letter-spacing:0.12em;font-weight:700">PHOTOS COMING SOON</span></div>';
    }

    /* ---- gallery thumbs: fixed 5-up tile size; centered when <=5, horizontally scrollable when more ---- */
    const thumbs = el('galleryThumbs');
    const many = active.photos.length > 5;
    thumbs.style.display = 'flex';
    thumbs.style.justifyContent = many ? 'flex-start' : 'center';
    thumbs.style.overflowX = many ? 'auto' : 'hidden';
    thumbs.style.gap = '10px';
    // each tile keeps the width of one cell in a 5-up row: (strip - 4 gaps) / 5
    const TILE = 'flex:0 0 calc((100% - 40px) / 5)';
    if (active.photos.length) {
      thumbs.style.position = 'relative';   // so tile.offsetLeft is measured within the strip -> correct active-thumb centering
      const activePhoto = ((state.img % active.photos.length) + active.photos.length) % active.photos.length;
      thumbs.innerHTML = active.photos.map((src, i) =>
        '<div data-thumb="' + i + '" style="' + TILE + ';aspect-ratio:4/3;border-radius:8px;overflow:hidden;background:#161513;border:2px solid ' + (i === activePhoto ? ACCENT : '#2a2825') + ';cursor:pointer;opacity:' + (i === activePhoto ? 1 : 0.55) + ';transition:opacity .2s,border-color .2s"><img src="' + src + '" alt="" class="cover" loading="lazy"></div>'
      ).join('');
      thumbs.querySelectorAll('[data-thumb]').forEach(d => d.onclick = () => setImg(+d.dataset.thumb));
      // keep the active thumb in view when the strip scrolls
      if (many) {
        const at = thumbs.querySelector('[data-thumb="' + activePhoto + '"]');
        if (at) thumbs.scrollTo({ left: at.offsetLeft - (thumbs.clientWidth - at.offsetWidth) / 2, behavior: 'smooth' });
      }
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
      if (dimmed) return '';   // filtered out -> hide entirely (e.g. Head Office hidden unless "Offices" filter)
      return '<button data-card="' + i + '" style="text-align:left;border:1px solid ' + (on ? ACCENT : '#2a2825') + ';background:' + (on ? '#161513' : 'transparent') + ';border-radius:12px;padding:12px 14px;cursor:pointer;opacity:' + (dimmed ? 0.35 : 1) + ';transition:all .25s;position:relative;min-width:0">'
        + '<div style="font-family:\'Archivo\';font-weight:600;font-size:13px;color:' + (on ? ACCENT : '#8f8c85') + ';margin-bottom:8px">' + (s.num || '&nbsp;') + '</div>'
        + '<div style="font-family:\'Archivo\';font-weight:700;font-size:14px;color:#fff;line-height:1.25;margin-bottom:5px">' + s.name.replace('&', '&amp;') + '</div>'
        + '<div style="font-size:11.5px;color:#8f8c85">' + s.city + '</div>'
        + '<span style="position:absolute;top:14px;right:14px;color:' + ACCENT + ';opacity:' + (on ? 1 : 0) + '">' + ic('<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle>', 16) + '</span>'
        + '</button>';
    }).join('');
    el('storeCards').querySelectorAll('[data-card]').forEach(b => b.onclick = () => goStore(+b.dataset.card));
    // keep the active card centered in the (now scrollable) rail. Use bounding rects
    // (not offsetLeft, which is relative to the offset parent and breaks in the stacked
    // mobile layout) so it centers correctly on every viewport. Skipped while measuring.
    const rail = el('storeCards'), ac = rail.querySelector('[data-card="' + idx + '"]');
    if (ac && !measuring) {
      const delta = (ac.getBoundingClientRect().left - rail.getBoundingClientRect().left)
        - (rail.clientWidth - ac.offsetWidth) / 2;
      rail.scrollBy({ left: delta, behavior: 'smooth' });
    }

    /* ---- map pins ---- */
    // Reveal an inactive pin's label on hover and lift it above its neighbours,
    // so the dense metro cluster stays readable (only the active + Head Office
    // pins are labelled at rest). Selection itself is driven by the card rail.
    if (!document.getElementById('pinHoverCss')) {
      const pc = document.createElement('style');
      pc.id = 'pinHoverCss';
      pc.textContent = '#mapPins [data-pin] .pinlabel{transition:opacity .15s ease}'
        + '#mapPins [data-pin]:hover{z-index:40 !important}'
        + '#mapPins [data-pin]:hover .pinlabel{opacity:1 !important}'
        + '#mapPins [data-pin] .pincol{transition:transform .15s ease}'
        + '#mapPins [data-pin]:hover .pincol{transform:scale(1.12)}';
      document.head.appendChild(pc);
    }
    el('mapPins').innerHTML = stores.map((s, i) => {
      const on = i === idx;
      const dimmed = !fi.includes(i);
      if (dimmed) return '';   // filtered out -> no pin (Head Office pin only under "Offices")
      let marker;
      if (s.head) {
        // Head Office — distinct larger dark pin with a building icon and a standing gold ring
        const hs = on ? 26 : 14;
        marker = '<div style="position:relative;width:' + hs + 'px;height:' + hs + 'px;border-radius:50%;background:#161513;border:2px solid ' + ACCENT + ';display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,0.32)">'
          + '<span style="color:' + ACCENT + ';line-height:0">' + ic('<path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path><path d="M10 20v-6h4v6"></path>', (on ? 14 : 9)) + '</span>'
          + '<span style="position:absolute;inset:-3px;border-radius:50%;border:2px solid ' + ACCENT + ';opacity:0.55;animation:pinPulse 2.6s ease-out infinite"></span>'
          + '</div>';
      } else {
        const size = on ? 26 : 14, dot = on ? 0 : 5;
        marker = '<div style="position:relative;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + (on ? ACCENT : '#fff') + ';border:2px solid ' + (on ? '#fff' : ACCENT) + ';display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,0.28)">'
          + '<span style="width:' + dot + 'px;height:' + dot + 'px;border-radius:50%;background:' + (on ? '#fff' : ACCENT) + '"></span>'
          + (on ? '<span style="position:absolute;inset:-2px;border-radius:50%;border:2px solid #fff;animation:pinPulse 2.2s ease-out infinite"></span>' : '')
          + '</div>';
      }
      const showLabel = on;
      return '<div data-pin="' + i + '" style="position:absolute;left:' + s.x + '%;top:' + s.y + '%;transform:translate(-50%,-100%);cursor:pointer;z-index:' + (s.head ? 20 : (on ? 15 : 5)) + '">'
        + '<div class="pincol" style="position:relative;display:flex;flex-direction:column;align-items:center">'
        + marker
        + '<span class="pinlabel" style="position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:6px;font-size:' + (s.head ? 10.5 : 10) + 'px;font-weight:' + (s.head ? 800 : 700) + ';letter-spacing:0.1em;color:' + (dimmed ? '#b6b1a5' : (s.head ? '#161513' : '#3a3833')) + ';text-transform:uppercase;white-space:nowrap;text-shadow:0 1px 3px rgba(239,236,228,0.9);pointer-events:none;opacity:' + (showLabel ? '1' : '0') + '">' + (s.head ? 'Head Office' : s.city) + '</span>'
        + '</div></div>';
    }).join('');
    fitPinLayer();
    el('mapPins').querySelectorAll('[data-pin]').forEach(d => d.onclick = () => { if (d.dataset.dragged) return; goStore(+d.dataset.pin); });
    if (PIN_EDIT) attachPinDrag();

    /* ---- tooltip ---- */
    const tip = el('mapTip');
    // the tooltip is placed in the BOX, but a pin now lives on the picture layer, so its
    // position is converted across before use
    const _layer = el('mapPins'), _inner = el('mapInner');
    const toBox = (x, y) => {
      if (!_layer || !_inner || !_inner.clientWidth) return { x: x, y: y };
      const lw = _layer.offsetWidth, lh = _layer.offsetHeight;
      const lx = parseFloat(_layer.style.left || '0'), ly = parseFloat(_layer.style.top || '0');
      return { x: ((lx + (x / 100) * lw) / _inner.clientWidth) * 100, y: ((ly + (y / 100) * lh) / _inner.clientHeight) * 100 };
    };
    const activeBox = toBox(active.x, active.y);
    if (state.showTip) {
      const rightSide = activeBox.x > 55;
      tip.style.display = 'block';
      tip.style.top = (activeBox.y + 4) + '%';
      if (rightSide) { tip.style.left = (activeBox.x - 1) + '%'; tip.style.transform = 'translate(-100%,-50%)'; }
      else { tip.style.left = (activeBox.x + 4) + '%'; tip.style.transform = 'translateY(-50%)'; }
      tip.innerHTML = '<div style="font-size:12px;letter-spacing:0.14em;font-weight:700;margin-bottom:8px">' + active.name.toUpperCase().replace('&', '&amp;') + '</div>'
        + '<div style="font-size:12.5px;color:#b9b5ac;line-height:1.6;margin-bottom:4px">' + active.tagline + '</div>'
        + '<div style="font-size:12.5px;color:#b9b5ac;line-height:1.6;margin-bottom:16px">' + (active.soon ? active.hours : 'Open ' + active.hours) + '</div>'
        + '<a href="#stores" style="display:inline-flex;align-items:center;gap:10px;font-size:11px;font-weight:700;letter-spacing:0.14em;color:#fff;border-bottom:1px solid rgba(255,255,255,0.4);padding-bottom:5px">VIEW STORE'
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>';
    } else {
      tip.style.display = 'none';
    }
  }

  /* ===== TEMPORARY pin editor: drag pins, save to localStorage, copy final coords ===== */
  function pinData() { const o = {}; stores.forEach(s => { o[s.name] = { x: s.x, y: s.y }; }); return o; }
  function pinReadout(i) {
    const st = document.getElementById('pinStatus');
    if (st) st.innerHTML = '<b>' + stores[i].name + '</b> &rarr; x:' + stores[i].x + ' &nbsp;y:' + stores[i].y;
  }
  function savePins() {
    try { localStorage.setItem(PIN_KEY, JSON.stringify(pinData())); } catch (e) {}
    const st = document.getElementById('pinStatus');
    if (st) st.innerHTML = '<span style="color:#7fd398">Saved &check; — will persist on reload</span>';
    console.log('[pins] saved:', JSON.stringify(pinData()));
  }
  function copyCoords() {
    const json = JSON.stringify(pinData(), null, 0);
    const pretty = stores.map(s => s.num + '  ' + s.name + '  →  x:' + s.x + '  y:' + s.y).join('\n');
    if (navigator.clipboard) navigator.clipboard.writeText(json).catch(() => {});
    console.log('[pins] coordinates:\n' + pretty + '\n\nJSON:\n' + json);
    const st = document.getElementById('pinStatus');
    if (st) st.innerHTML = '<span style="color:#7fd398">Coords copied &check; (also in console)</span>';
  }
  function attachPinDrag() {
    const pins = el('mapPins');
    // Measure against the sized map layer — #mapPins itself has height:0 (all its
    // children are absolutely positioned), which would divide-by-zero the y math.
    const ref = pins;   // the picture layer: a drag of half its width is half the map
    pins.querySelectorAll('[data-pin]').forEach(d => {
      d.style.cursor = 'grab';
      d.addEventListener('pointerdown', e => {
        e.preventDefault(); e.stopPropagation();
        const i = +d.dataset.pin;
        try { d.setPointerCapture(e.pointerId); } catch (_) {}
        d.style.cursor = 'grabbing';
        const rect = ref.getBoundingClientRect();
        const startX = e.clientX, startY = e.clientY;
        // where on the pin it was grabbed, so it does not jump on the first move
        const grabX = rect.width ? (((e.clientX - rect.left) / rect.width) * 100) - stores[i].x : 0;
        const grabY = rect.height ? (((e.clientY - rect.top) / rect.height) * 100) - stores[i].y : 0;
        let moved = false;
        const move = ev => {
          if (Math.abs(ev.clientX - startX) > 2 || Math.abs(ev.clientY - startY) > 2) moved = true;
          // where the pointer IS, not how far it has moved: the console shows this page
          // shrunk to fit, and adding up movements drifts away from the cursor there
          const r = ref.getBoundingClientRect();
          const px = r.width ? (((ev.clientX - r.left) / r.width) * 100) - grabX : stores[i].x;
          const py = r.height ? (((ev.clientY - r.top) / r.height) * 100) - grabY : stores[i].y;
          const x = Math.max(0, Math.min(100, Math.round(px * 10) / 10));
          const y = Math.max(0, Math.min(100, Math.round(py * 10) / 10));
          stores[i].x = x; stores[i].y = y;
          d.style.left = x + '%'; d.style.top = y + '%';
          pinReadout(i);
          tellHost({ utcPin: 'move', name: stores[i].name, x: x, y: y });
        };
        const up = () => {
          d.removeEventListener('pointermove', move);
          d.removeEventListener('pointerup', up);
          d.style.cursor = 'grab';
          try { d.releasePointerCapture(e.pointerId); } catch (_) {}
          if (moved) {
            d.dataset.dragged = '1'; setTimeout(() => { delete d.dataset.dragged; }, 60);
            tellHost({ utcPin: 'set', name: stores[i].name, x: stores[i].x, y: stores[i].y });
          }
        };
        d.addEventListener('pointermove', move);
        d.addEventListener('pointerup', up);
      });
    });
  }
  function buildPinBar() {
    if (document.getElementById('pinEditBar')) return;
    const bar = document.createElement('div');
    bar.id = 'pinEditBar';
    bar.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:99999;background:#0d0d0d;color:#fff;border:1px solid #33312d;border-radius:14px;padding:11px 15px;display:flex;align-items:center;gap:13px;flex-wrap:wrap;max-width:94vw;box-shadow:0 24px 60px -20px rgba(0,0,0,.7);font-family:Manrope,system-ui,sans-serif;font-size:13px';
    const btn = 'cursor:pointer;border:1px solid #4a4842;background:#161513;color:#fff;font-weight:700;font-size:12px;letter-spacing:.04em;padding:9px 16px;border-radius:999px';
    bar.innerHTML = '<span style="font-weight:800;letter-spacing:.12em;color:#a07d43">PIN EDIT</span>'
      + '<span style="color:#8f8c85">Drag any pin onto its exact spot</span>'
      + '<button id="pinSave" style="' + btn + ';background:#a07d43;border-color:#a07d43;color:#161513">Save</button>'
      + '<button id="pinCopy" style="' + btn + '">Copy coords</button>'
      + '<span id="pinStatus" style="color:#8f8c85;min-width:120px"></span>';
    document.body.appendChild(bar);
    document.getElementById('pinSave').onclick = savePins;
    document.getElementById('pinCopy').onclick = copyCoords;
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

  // Deep-link: ?store=<index> (from the homepage "Our Offices" cards) opens that
  // store, holds on it (no auto-cycle), and scrolls to the explorer.
  const dlRaw = new URLSearchParams(location.search).get('store');
  const dl = dlRaw == null ? NaN : parseInt(dlRaw, 10);
  const hasDeepLink = !isNaN(dl) && dl >= 0 && dl < stores.length;
  if (hasDeepLink) { state.store = dl; state.img = 0; state.showTip = true; if (stores[dl].head) state.filter = 'Offices'; }

  // Keep the explorer panel a constant height so it doesn't jump when switching
  // between stores with shorter/longer descriptions. Measures every store once and
  // locks to the tallest — desktop only (on mobile the columns stack, so a fixed
  // height would leave a gap).
  function lockPanelHeight() {
    const box = el('explorer');
    const nameEl = el('storeName'), descEl = el('storeDesc'), infoEl = el('storeInfo'), railEl = el('storeCards');
    if (!box || !nameEl || !descEl) return;
    // reset before (re)measuring in the current layout width
    box.style.minHeight = ''; nameEl.style.minHeight = ''; descEl.style.minHeight = '';
    if (infoEl) infoEl.style.minHeight = '';
    if (railEl) railEl.style.minHeight = '';
    const savedStore = state.store, savedImg = state.img, savedFilter = state.filter;
    measuring = true;   // suppress rail auto-centering during the measurement cycles
    // Pass 1: measure the tallest name + description (natural), then lock those blocks.
    let maxName = 0, maxDesc = 0, maxInfo = 0;
    stores.forEach((s, i) => {
      state.filter = s.head ? 'Offices' : 'All Stores';
      state.store = i; state.img = 0; render();
      if (nameEl.offsetHeight > maxName) maxName = nameEl.offsetHeight;
      if (descEl.offsetHeight > maxDesc) maxDesc = descEl.offsetHeight;
      if (infoEl && infoEl.offsetHeight > maxInfo) maxInfo = infoEl.offsetHeight;
    });
    nameEl.style.minHeight = maxName + 'px';
    descEl.style.minHeight = maxDesc + 'px';
    if (infoEl) infoEl.style.minHeight = maxInfo + 'px';
    // Pass 2: with the text blocks locked, measure the tallest whole box and pin to it,
    // so the panel never resizes between stores (every viewport).
    let maxBox = 0, maxRail = 0;
    stores.forEach((s, i) => {
      state.filter = s.head ? 'Offices' : 'All Stores';
      state.store = i; state.img = 0; render();
      if (box.offsetHeight > maxBox) maxBox = box.offsetHeight;
      if (railEl && railEl.offsetHeight > maxRail) maxRail = railEl.offsetHeight;
    });
    if (railEl) railEl.style.minHeight = maxRail + 'px';
    box.style.minHeight = maxBox + 'px';
    measuring = false;
    state.store = savedStore; state.img = savedImg; state.filter = savedFilter; render();   // restore the shown store
  }

  // On narrow screens add half-a-viewport of scroll room at each end of the store rail
  // so EVERY card (including the first and last) can scroll to the centre. On desktop
  // the rail is wide and shows many cards, so edge-anchoring is left as-is.
  function setRailPadding() {
    const rail = el('storeCards');
    const card = rail && rail.querySelector('[data-card]');
    if (!rail || !card) return;
    if (window.innerWidth <= 900) {
      const pad = Math.max(0, Math.round((rail.clientWidth - card.offsetWidth) / 2));
      rail.style.paddingLeft = pad + 'px';
      rail.style.paddingRight = pad + 'px';
    } else {
      rail.style.paddingLeft = '';
      rail.style.paddingRight = '';
    }
  }

  render();
  setRailPadding();
  lockPanelHeight();
  render();                 // re-centre the active card now that the end padding exists
  tellHost({ utcPin: 'ready' });          // ask the console what the pins should show
  // Re-measure once web fonts and images have loaded (their metrics change text height,
  // which would otherwise leave the lock slightly wrong / stores looking uneven).
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockPanelHeight);
  window.addEventListener('load', lockPanelHeight);
  let _lockT;
  window.addEventListener('resize', () => {
    clearTimeout(_lockT);
    _lockT = setTimeout(() => { setRailPadding(); lockPanelHeight(); render(); }, 150);
  });
  if (PIN_EDIT) buildPinBar();
  if (hasDeepLink) {
    setTimeout(() => {
      const target = el('explorer') || el('stores');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
  } else if (!PIN_EDIT) {
    // auto-cycle is paused while the pin editor is on, so pins don't shift underfoot
    startAuto();
  }
})();
