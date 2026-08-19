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
    { num: '01', name: 'Head Office & Main Store', city: 'Kuwait City', cats: [], head: true,
      tagline: 'Where it all began.',
      desc: 'Our founding flagship in the heart of Kuwait City, home to the full breadth of Union Trading brands and the beating heart of our operations since 1949.',
      hours: '8:00 AM – 10:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 4:00 PM – 10:00 PM',
      addr: ['Kuwait City, Block 1', 'Fahad Al-Salem Street', 'Kuwait'], phone: '+965 2242 3355',
      maps: 'https://www.google.com/maps/search/?api=1&query=Union%20Trading%20Company%20Fahad%20Al-Salem%20Street%20Kuwait%20City',
      x: 65.2, y: 47.2,
      photos: P('fahed-al-salem', 6) },

    { num: '02', name: 'Salmiya Store', city: 'Salmiya', cats: [],
      tagline: 'At the heart of Salmiya.',
      desc: 'Our Salmiya destination on Salem Al Mubarak Street, bringing the full Union Trading range and trusted service close to home.',
      hours: '10:00 AM – 10:00 PM', days: ALLWEEK, friday: '',
      addr: ['Salem Al Mubarak Street', 'Salmiya, Kuwait'], phone: '+965 9550 1717', whatsapp: '+965 9550 1717',
      maps: 'https://www.google.com/maps/place/%D8%B9%D9%85%D8%A7%D8%B1%D8%A9+%D8%A7%D9%84%D8%B3%D8%A7%D9%84%D9%85%D9%8A%D8%A9+%D8%A7%D9%84%D8%B4%D9%85%D8%A7%D9%84%D9%8A%D8%A9%D8%8C+83M6%2BXG5+Union+Trading+Company,+22+Salem+Al+Mubarak+St,+Salmiya/@29.3339,48.0753,17z/',
      x: 69.8, y: 50.5, photos: P('salmiya', 8) },

    { num: '03', name: 'Farwaniya Store', city: 'Farwaniya', cats: [],
      tagline: 'Serving the Farwaniya community.',
      desc: 'Your Union Trading destination in Farwaniya, with our full range of brands and dependable everyday service.',
      hours: '10:00 AM – 10:00 PM', days: ALLWEEK, friday: '',
      addr: ['Farwaniya, Kuwait'], phone: '+965 2473 3820', whatsapp: '+965 9550 1738',
      maps: 'https://goo.gl/maps/XCckvVJFSS92qqNA6', x: 65.1, y: 54, photos: ['img/stores/farwaniya-1.webp'] },

    { num: '04', name: 'Hawally Store', city: 'Hawally', cats: [],
      tagline: 'Close to Hawally.',
      desc: 'The Union Trading experience in Hawally — trusted brands and expert support, right where you need them.',
      hours: '10:00 AM – 10:00 PM', days: ALLWEEK, friday: '',
      addr: ['Hawally, Kuwait'], phone: '+965 9407 4000', whatsapp: '+965 9407 4000',
      maps: 'https://maps.app.goo.gl/emGnAaX6nwLfUri26', x: 66.7, y: 49.5, photos: P('hawally', 4) },

    { num: '05', name: 'Fahaheel Store', city: 'Fahaheel', cats: [],
      tagline: 'Inside Fahaheel Yaal Mall.',
      desc: 'Visit us at Yaal Mall in Fahaheel for the complete Union Trading range and the service you know.',
      hours: '10:00 AM – 10:00 PM', days: ALLWEEK, friday: '',
      addr: ['Yaal Mall', 'Fahaheel, Kuwait'], phone: '+965 9550 1707', whatsapp: '+965 9550 1707',
      maps: 'https://www.google.com.kw/maps/place/Yaal+Mall/@29.0790652,48.1357316,17z/data=!3m1!4b1!4m5!3m4!1s0x3fcf065d2fa19795:0xc7f948d44e14d60c!8m2!3d29.0790652!4d48.1379203',
      x: 75.4, y: 68.5, photos: P('fahaheel', 8) },

    { num: '06', name: 'Al Jawhara Al Khaleej Store', city: 'Al Jawhara', cats: [],
      tagline: 'The Al Jawhara Al Khaleej building.',
      desc: 'A look inside our Al Jawhara Al Khaleej building showroom. Full visiting details for this location are coming soon.',
      hours: HRS, days: D, friday: F, addr: ['Al Jawhara Al Khaleej, Kuwait'], phone: '', x: 66.3, y: 50.4, photos: P('al-jawhara', 6) },

    { num: '07', name: 'Al-Qurain Store', city: 'Al-Qurain', cats: [],
      tagline: 'Serving Al-Qurain.',
      desc: 'A look inside our Al-Qurain showroom. Full visiting details for this location are coming soon.',
      hours: HRS, days: D, friday: F, addr: ['Al-Qurain, Kuwait'], phone: '', x: 70.7, y: 55.4, photos: P('al-qurain', 8) },

    { num: '08', name: 'Jahra Store', city: 'Jahra', cats: [],
      tagline: 'Serving Jahra.',
      desc: 'Our Jahra destination brings Union Trading trusted brands and service to the west of Kuwait.',
      hours: '10:00 AM – 10:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 5:00 PM – 10:00 PM',
      addr: ['Jahra, Kuwait'], phone: '+965 2457 2747', whatsapp: '+965 9550 1808',
      maps: 'https://maps.app.goo.gl/xjbgbsW6j7vBFirQA', x: 50.3, y: 46.8, photos: P('jahra', 1) },

    { num: '09', name: 'Shuwaikh Store', city: 'Shuwaikh', cats: [],
      tagline: 'The Shuwaikh showroom.',
      desc: 'Our Shuwaikh location for the full range of Union Trading appliances and expert guidance.',
      hours: '9:00 AM – 9:00 PM', days: 'Saturday – Thursday', friday: 'Friday: Closed',
      addr: ['Shuwaikh, Kuwait'], phone: '+965 2491 8804 · +965 2494 8805', whatsapp: '+965 9550 1725',
      maps: 'https://maps.app.goo.gl/UXwYZT7qvXPXuiFA8', x: 63.9, y: 50.7, photos: P('shuwaikh', 3) },

    { num: '10', name: 'Hawalli (Built-in Appliances) Store', city: 'Hawalli · Built-in', cats: [],
      tagline: 'Built-in appliance specialists.',
      desc: 'Our Hawalli showroom dedicated to built-in kitchen and home appliances, with specialist advice.',
      hours: '9:30 AM – 1:00 PM  ·  5:00 PM – 9:30 PM', days: 'Saturday – Thursday', friday: '',
      addr: ['Hawalli, Kuwait'], phone: '+965 2264 3788', whatsapp: '+965 9550 1801',
      maps: 'https://maps.app.goo.gl/sCPyKSSZyjkuczv56', x: 67.5, y: 50.3, photos: ['img/stores/brazilia-1.webp'] },

    { num: '11', name: 'Sabah Al-Salem Store', city: 'Sabah Al-Salem', cats: [],
      tagline: 'Serving Sabah Al-Salem.',
      desc: 'Your neighbourhood Union Trading destination in Sabah Al-Salem, close and always ready to help.',
      hours: '10:00 AM – 10:00 PM', days: ALLWEEK, friday: '',
      addr: ['Sabah Al-Salem, Kuwait'], phone: '+965 9407 4004', whatsapp: '+965 9407 4004',
      maps: 'https://maps.app.goo.gl/drCcGEDE7VKsUcHq6', x: 70.6, y: 55.8, photos: P('sabah-al-salem', 11) },

    { num: '12', name: 'Al-Rai Store', city: 'Al-Rai', cats: [],
      tagline: 'Serving Al-Rai.',
      desc: 'A look inside our Al-Rai showroom. Full visiting details for this location are coming soon.',
      hours: HRS, days: D, friday: F, addr: ['Al-Rai, Kuwait'], phone: '', x: 62.9, y: 51.1, photos: P('al-rai', 7) },

    { num: '13', name: 'Farwaniya Store 2', city: 'Farwaniya', cats: [],
      tagline: 'A second home in Farwaniya.',
      desc: 'Our second Farwaniya destination, extending the full Union Trading range across the governorate.',
      hours: '10:00 AM – 10:00 PM', days: 'Saturday – Thursday', friday: 'Friday: 5:00 PM – 10:00 PM',
      addr: ['Farwaniya, Kuwait'], phone: '+965 2474 2791', whatsapp: '+965 9550 1806',
      maps: 'https://maps.app.goo.gl/sKnpdwsrxFUwvfup8', x: 64.8, y: 53.4, photos: ['img/stores/salmiya-2.webp'] },
  ];

  const FILTERS = ['All Stores'];

  /* ===== TEMPORARY: manual pin-placement editor =====
     Set PIN_EDIT to false (or delete this block + the editor functions below) to turn it off.
     Positions are saved to localStorage so they persist on this browser across reloads.
     Use "Copy coords" to hand the final x/y values back so they can be baked into this file. */
  const PIN_EDIT = false;
  const PIN_KEY = 'utcStorePins';
  const PIN_VER = '2026-08-19e';
  (function loadPins() {
    try {
      // One-time wipe of any stale hand-dragged pins so the freshly-baked coordinates
      // actually show. Bump PIN_VER whenever the baked coords change to re-wipe.
      if (localStorage.getItem('utcStorePinsVer') !== PIN_VER) {
        localStorage.removeItem(PIN_KEY);
        localStorage.setItem('utcStorePinsVer', PIN_VER);
      }
      const saved = JSON.parse(localStorage.getItem(PIN_KEY) || 'null');
      if (saved) stores.forEach(s => { if (saved[s.name]) { s.x = saved[s.name].x; s.y = saved[s.name].y; } });
    } catch (e) { /* ignore */ }
  })();

  const state = { store: 0, filter: 'All Stores', img: 0, showTip: false };
  let auto = null;
  let measuring = false;   // true while lockPanelHeight() cycles stores to measure

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
    if (el('storeTotal')) el('storeTotal').textContent = ('0' + stores.length).slice(-2);
    el('storeName').innerHTML = active.name.replace('&', '&amp;');
    el('storeTagline').textContent = active.tagline;
    el('storeDesc').textContent = active.desc;

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
      thumbs.style.position = 'static';
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
      return '<button data-card="' + i + '" style="text-align:left;border:1px solid ' + (on ? ACCENT : '#2a2825') + ';background:' + (on ? '#161513' : 'transparent') + ';border-radius:12px;padding:12px 14px;cursor:pointer;opacity:' + (dimmed ? 0.35 : 1) + ';transition:all .25s;position:relative;min-width:0">'
        + '<div style="font-family:\'Archivo\';font-weight:600;font-size:13px;color:' + (on ? ACCENT : '#7c7972') + ';margin-bottom:8px">' + s.num + '</div>'
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
    el('mapPins').querySelectorAll('[data-pin]').forEach(d => d.onclick = () => { if (d.dataset.dragged) return; goStore(+d.dataset.pin); });
    if (PIN_EDIT) attachPinDrag();

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
    const ref = document.getElementById('mapInner') || pins;
    pins.querySelectorAll('[data-pin]').forEach(d => {
      d.style.cursor = 'grab';
      d.addEventListener('pointerdown', e => {
        e.preventDefault(); e.stopPropagation();
        const i = +d.dataset.pin;
        try { d.setPointerCapture(e.pointerId); } catch (_) {}
        d.style.cursor = 'grabbing';
        const rect = ref.getBoundingClientRect();
        const startX = e.clientX, startY = e.clientY, origX = stores[i].x, origY = stores[i].y;
        let moved = false;
        const move = ev => {
          if (Math.abs(ev.clientX - startX) > 2 || Math.abs(ev.clientY - startY) > 2) moved = true;
          const dx = rect.width ? ((ev.clientX - startX) / rect.width) * 100 : 0;
          const dy = rect.height ? ((ev.clientY - startY) / rect.height) * 100 : 0;
          const x = Math.max(0, Math.min(100, Math.round((origX + dx) * 10) / 10));
          const y = Math.max(0, Math.min(100, Math.round((origY + dy) * 10) / 10));
          stores[i].x = x; stores[i].y = y;
          d.style.left = x + '%'; d.style.top = y + '%';
          pinReadout(i);
        };
        const up = () => {
          d.removeEventListener('pointermove', move);
          d.removeEventListener('pointerup', up);
          d.style.cursor = 'grab';
          try { d.releasePointerCapture(e.pointerId); } catch (_) {}
          if (moved) { d.dataset.dragged = '1'; setTimeout(() => { delete d.dataset.dragged; }, 60); }
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
  if (hasDeepLink) { state.store = dl; state.img = 0; state.showTip = true; }

  // Keep the explorer panel a constant height so it doesn't jump when switching
  // between stores with shorter/longer descriptions. Measures every store once and
  // locks to the tallest — desktop only (on mobile the columns stack, so a fixed
  // height would leave a gap).
  function lockPanelHeight() {
    const box = el('explorer');
    const nameEl = el('storeName'), descEl = el('storeDesc');
    if (!box || !nameEl || !descEl) return;
    // reset before (re)measuring in the current layout width
    box.style.minHeight = ''; nameEl.style.minHeight = ''; descEl.style.minHeight = '';
    const savedStore = state.store, savedImg = state.img;
    measuring = true;   // suppress rail auto-centering during the measurement cycles
    // Pass 1: measure the tallest name + description (natural), then lock those blocks.
    let maxName = 0, maxDesc = 0;
    stores.forEach((s, i) => {
      state.store = i; state.img = 0; render();
      if (nameEl.offsetHeight > maxName) maxName = nameEl.offsetHeight;
      if (descEl.offsetHeight > maxDesc) maxDesc = descEl.offsetHeight;
    });
    nameEl.style.minHeight = maxName + 'px';
    descEl.style.minHeight = maxDesc + 'px';
    // Pass 2: with the text blocks locked, measure the tallest whole box and pin to it,
    // so the panel never resizes between stores (every viewport).
    let maxBox = 0;
    stores.forEach((s, i) => {
      state.store = i; state.img = 0; render();
      if (box.offsetHeight > maxBox) maxBox = box.offsetHeight;
    });
    box.style.minHeight = maxBox + 'px';
    measuring = false;
    state.store = savedStore; state.img = savedImg; render();   // restore the shown store
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
