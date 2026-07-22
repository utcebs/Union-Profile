'use strict';
/* Union Trading Co. — faithful static rebuild of the Claude Design prototype. */
(function () {

  /* ---------- icon helpers ---------- */
  const ic = p => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' + p + '</svg>';
  const sic = p => '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">' + p + '</svg>';

  /* ---------- crop table (from image-slot state; _applyView reproduction) ---------- */
  const CROP = {
    'div-elec': { s: 1, x: 23.44, y: 0 }, 'div-fmcg': { s: 1, x: 21.83, y: 0 }, 'div-cosmetics': { s: 1, x: 30.91, y: 0 }, 'div-fashion': { s: 1, x: 16.63, y: 0 }, 'div-health': { s: 1, x: 0, y: 0 }, 'div-commercial': { s: 1, x: 0, y: 0 },
    'story-storefront': { s: 1, x: 0, y: 4.99 },
    'ms-1966': { s: 1, x: 7.69, y: 0 }, 'ms-1970': { s: 1, x: 7.69, y: 0 }, 'ms-1969': { s: 1, x: 7.69, y: 0 },
    'pimg-0': { s: 1, x: -41.94, y: 0 }, 'pimg-1': { s: 1, x: -34.51, y: 0 }, 'pimg-2': { s: 1, x: -26.52, y: 0 }, 'pimg-3': { s: 1, x: 0, y: 0 }
  };

  function layoutSlot(el) {
    const img = el.querySelector('img');
    if (!img || !img.naturalWidth) return;
    const fw = el.clientWidth, fh = el.clientHeight;
    if (!fw || !fh) return;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const fit = el.dataset.fit || 'cover';
    const base = fit === 'contain' ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
    const c = CROP[el.dataset.slot] || { s: 1, x: 0, y: 0 };
    const k = base * (c.s || 1);
    const imgW = iw * k, imgH = ih * k;
    // desired centre shift (px) from the stored crop, clamped so a cover image
    // never reveals a gap — pan only as far as the available overflow allows.
    let cx = (c.x || 0) / 100 * fw, cy = (c.y || 0) / 100 * fh;
    const maxX = Math.max(0, (imgW - fw) / 2), maxY = Math.max(0, (imgH - fh) / 2);
    cx = Math.max(-maxX, Math.min(maxX, cx));
    cy = Math.max(-maxY, Math.min(maxY, cy));
    img.style.width = (imgW / fw * 100) + '%';
    img.style.height = (imgH / fh * 100) + '%';
    img.style.left = 'calc(50% + ' + cx.toFixed(1) + 'px)';
    img.style.top = 'calc(50% + ' + cy.toFixed(1) + 'px)';
  }
  function layoutAll() { document.querySelectorAll('.slot').forEach(layoutSlot); }
  window.addEventListener('resize', layoutAll);
  // Re-lay-out each slot whenever its box settles (zoom, 3D transforms, fonts,
  // responsive) — guarantees cover images fully fill regardless of load timing.
  const slotRO = ('ResizeObserver' in window) ? new ResizeObserver(es => es.forEach(e => layoutSlot(e.target))) : null;
  function observeSlots() { if (slotRO) document.querySelectorAll('.slot').forEach(s => slotRO.observe(s)); }

  // build a slot element with an image; relayout on load
  function slotEl(id, src, fit) {
    const d = document.createElement('div');
    d.className = 'slot';
    d.dataset.slot = id;
    if (fit) d.dataset.fit = fit;
    const img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    img.onload = () => layoutSlot(d);
    img.src = src;
    d.appendChild(img);
    return d;
  }
  function fillSlot(el, id, src, fit) {
    el.dataset.slot = id;
    if (fit) el.dataset.fit = fit;
    el.innerHTML = '';
    const img = document.createElement('img');
    img.alt = ''; img.decoding = 'async';
    img.onload = () => layoutSlot(el);
    img.src = src;
    el.appendChild(img);
  }

  /* ---------- data ---------- */
  const NAV = ['About Us', 'Our Divisions', 'Our Stores', 'Service Center', 'Careers', 'Contact'];
  const heroImgs = ['uploads/app.png', 'uploads/Carousal4-0ab1d92c.jpg', 'uploads/OGeneral.jpg', 'uploads/JBL.png'];
  const heroPartners = ['Apple', 'GlemGas', 'O General', 'JBL'];
  const heroLabelLight = [true, true, false, true];  // dark label only on the light O General image

  function heroPalette() {
    const light = (bg, head, sub, kick, track, muted) => ({ heroBg: bg, heroHead: head, heroSub: sub, heroKick: kick, heroTrack: track, heroFill: head, heroMuted: muted, heroCtaBg: '#0d0d0d', heroCtaTx: '#fff' });
    const dark = (bg, head, sub, kick, track, muted) => ({ heroBg: bg, heroHead: head, heroSub: sub, heroKick: kick, heroTrack: track, heroFill: head, heroMuted: muted, heroCtaBg: head, heroCtaTx: bg });
    return [
      light('#ece9e1', '#161513', '#4a473f', '#8f8b81', '#c4c0b5', '#a5a196'),
      dark('#182430', '#f2efe8', '#b6c0c8', '#7d909c', '#37485580', '#6f818d'),
      light('#e6ddc9', '#2a2417', '#57503d', '#978f76', '#c9c0a6', '#a99f83'),
      dark('#262322', '#f2efe9', '#b6b1a8', '#8a857b', '#47433d80', '#7d786f'),
    ];
  }

  const brandNames = [
    { name: 'Braun', src: 'assets/b1.png' }, { name: 'Angel Wear', src: 'assets/b2.png' }, { name: 'India Gate', src: 'assets/b3.png' },
    { name: 'Hitachi', src: 'assets/b4.png' }, { name: 'Brandili', src: 'assets/b5.png' }, { name: 'Constance Carroll', src: 'assets/b6.png' },
    { name: 'Glysolid', src: 'assets/b7.png' }, { name: 'Eagle Safes', src: 'assets/b8.png' }, { name: 'Prestige', src: 'assets/b9.png' }, { name: 'O General', src: 'assets/b10.png' }
  ];
  function logoFor(name) {
    const n = String(name).toLowerCase();
    const f = brandNames.find(b => { const bn = b.name.toLowerCase(); return bn === n || bn.includes(n) || n.includes(bn); });
    return f ? f.src : null;
  }

  const divData = [
    { name: 'Electric Appliances', tagline: 'Smarter Homes. Simpler Living.', icon: '<rect x="4" y="3" width="7" height="18" rx="1.5"></rect><circle cx="7.5" cy="8" r="1.4"></circle><rect x="13" y="3" width="7" height="18" rx="1.5"></rect><circle cx="16.5" cy="8" r="1.4"></circle>', desc: 'Recognizing the growing demand for premium electronic appliances, UNION strategically expanded its portfolio to offer a comprehensive range of world-renowned consumer electronics and home appliances. Through partnerships with leading global brands, the company has consistently delivered innovative, reliable, and energy-efficient solutions that enhance everyday living while meeting the evolving needs of customers across Kuwait.', mgr: 'Available on request', contact: 'Chat with Us', brands: ['Braun', 'Hitachi', '+6 more'], slot: 'div-elec' },
    { name: 'FMCG', tagline: 'Everyday Essentials, Delivered.', icon: '<circle cx="9" cy="20" r="1.2"></circle><circle cx="17" cy="20" r="1.2"></circle><path d="M2 4h2.5l2.5 12h10l2-8H6.2"></path>', desc: 'As consumer expectations for quality everyday essentials continued to rise, UNION expanded its portfolio to include a wide range of fast-moving consumer goods from leading international brands. By delivering trusted food, beverage, and household products, the company has become a reliable partner in meeting the daily needs of consumers.', mgr: 'Available on request', contact: 'Chat with Us', brands: ['India Gate', 'Glysolid', 'Angel Wear', '+8 more'], slot: 'div-fmcg' },
    { name: 'Cosmetics & Perfumes', tagline: 'Beauty in Every Detail.', icon: '<path d="M9 21h6a2 2 0 002-2v-6a3 3 0 00-3-3h-1V7h-2v3H10a3 3 0 00-3 3v6a2 2 0 002 2z"></path><path d="M10 5h4M11 3h2"></path>', desc: 'Recognizing the growing demand for premium beauty and fragrance products, UNION developed a distinguished portfolio of internationally acclaimed cosmetics and perfume brands. By offering authentic, high-quality products, the company continues to deliver luxury, elegance, and confidence to customers throughout Kuwait.', mgr: 'Available on request', contact: 'Chat with Us', brands: ['Constance Carroll', 'Glysolid', '+5 more'], slot: 'div-cosmetics' },
    { name: 'Fashion', tagline: 'Timeless Everyday Style.', icon: '<circle cx="12" cy="5" r="2"></circle><path d="M12 7l7 5-2 2-2-1.5V21H9v-8.5L7 14l-2-2 7-5z"></path>', desc: 'With changing lifestyles and increasing demand for premium fashion, UNION established a strong presence by introducing internationally renowned apparel, footwear, and lifestyle brands. Through a carefully curated portfolio, the company continues to deliver quality, style, and exceptional retail experiences to customers across the region.', mgr: 'Available on request', contact: 'Chat with Us', brands: ['Angel Wear', 'Brandili', '+4 more'], slot: 'div-fashion' },
    { name: 'Healthcare Solutions', tagline: 'Caring for Every Family.', icon: '<path d="M12 20s-6.5-4.2-9-8.2C1.4 9 2.6 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 4.6 3.5 3 6.3-2.5 4-9 8.2-9 8.2z"></path>', desc: 'As the healthcare sector evolved, the need for advanced medical technologies and dependable healthcare solutions continued to grow. UNION answered this demand by partnering with globally recognized brands to provide innovative medical equipment and healthcare products that support hospitals, clinics, and healthcare professionals across Kuwait.', mgr: 'Available on request', contact: 'Chat with Us', brands: ['Glysolid', 'Prestige', 'Eagle Safes', '+5 more'], slot: 'div-health' },
    { name: 'Commercial Airconditioning', tagline: 'Powerful, Efficient Cooling.', icon: '<rect x="3" y="5" width="18" height="8" rx="2"></rect><path d="M6.5 9h1M10 9h7.5M7 16c.2 1.4 1 1.8 1 3M12 16c.2 1.4 1 1.8 1 3M17 16c-.2 1.4-1 1.8-1 3"></path>', desc: "At the time of the company's inception there was a great demand in the market for climate control technology. UTC's answer to this demand was the creation of its very own line of climate control solution: General Air Conditioners.", descHtml: "At the time of the company's inception there was a great demand in the market for climate control technology. UTC's answer to this demand was the creation of its very own line of climate control <strong style=\"color:#161513;font-weight:700\">solution: General Air Conditioners.</strong>", mgr: 'Mr. Walid Khalid', contact: 'Chat with Us', brands: ['O General', 'Hitachi', '+3 more'], slot: 'div-commercial' }
  ];

  const storyStats = [
    { n: '75', l: 'YEARS IN BUSINESS', sub: 'Built on trust. Driven by excellence.', icon: ic('<rect x="3" y="7" width="18" height="13" rx="1"></rect><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"></path>') },
    { n: '70+', l: 'GLOBAL BRANDS', sub: 'Partnerships with world leaders.', icon: ic('<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"></path>') },
    { n: '500+', l: 'EMPLOYEES', sub: 'A team powering our promise.', icon: ic('<circle cx="9" cy="8" r="3"></circle><path d="M3 20c0-3 3-5 6-5s6 2 6 5"></path><path d="M16 6a3 3 0 010 6M21 20c0-2.5-2-4-4-4.5"></path>') },
    { n: '10+', l: 'RETAIL OUTLETS', sub: 'Across Kuwait and beyond.', icon: ic('<path d="M3 9l1.5-5h15L21 9"></path><path d="M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9"></path><path d="M3 9h18"></path><path d="M9 20v-6h6v6"></path>') }
  ];
  const storyExtra = ['uploads/City showroom old enhanced.jpg', 'uploads/old general photo.png'];

  const plist = [
    { name: 'Milton Lloyd', since: '1978', years: '46+', src: 'uploads/Mil-trimmed.png', person: 'Peter Jackson', role: 'CEO', quote: 'Across more than four decades, our mission with UTC has — under Union Trading Company’s unique vision, foresight and leadership — always been to offer consumers exceptional fragrance within reach.' },
    { name: 'Glemgas', since: '1970', years: '54+', src: 'uploads/Glem-trimmed.png', person: 'Marco Guerzoni', role: 'Marketing Director', quote: 'For over five decades Glemgas has trusted Union Trading Company to bring Italian craftsmanship into Kuwaiti homes — a partnership defined by reliability and shared ambition.' },
    { name: 'Jockey', since: '2003', years: '21+', src: 'uploads/Jock-trimmed.png', person: 'Brand Team', role: 'Brand Partner', quote: 'Since 2003, Union Trading Company has carried the Jockey name across the region with the same commitment to comfort and quality that defines our brand.' },
    { name: 'Braun', since: '2001', years: '23+', src: 'uploads/Braun-trimmed.png', person: 'Brand Team', role: 'Brand Partner', quote: 'For more than two decades Union Trading Company has represented Braun in Kuwait, delivering German engineering to our customers with trust and care.' }
  ];

  const milestones = [
    { year: '1949', title: 'First Showroom, Ahmadi', desc: 'Our journey began with a single showroom in Ahmadi, marking the start of Union Trading Co.', slot: 'ms-1949' },
    { year: '1958', title: 'Kuwait City Showroom Launch', desc: 'We expanded our presence with the launch of our showroom in Kuwait City, bringing us closer to our customers.', slot: 'ms-1958' },
    { year: '1966', title: 'Partnership with Gillette', desc: 'We partnered with Gillette to bring world-class grooming products to our customers.', slot: 'ms-1966' },
    { year: '1969', title: 'Partnership with Glemgas', desc: 'We joined hands with Glemgas to bring premium Italian home appliances to our customers.', slot: 'ms-1969' },
    { year: '1970', title: 'Partnership with General', desc: 'Joined hands with General to offer advanced and reliable air conditioning solutions.', slot: 'ms-1970' },
    { year: '1977', title: 'Foundation of UTC Perfumes', desc: 'We ventured into beauty with the foundation of UTC Perfumes — quality fragrances for every lifestyle.', slot: 'ms-1977' }
  ];

  const socials = [
    { name: 'Facebook', icon: sic('<path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1z"></path>') },
    { name: 'X', icon: sic('<path d="M17.5 4h2.6l-5.7 6.5L21 20h-5.3l-4.2-5.4L6.7 20H4.1l6.1-7L3.5 4h5.4l3.8 5z"></path>') },
    { name: 'Instagram', icon: sic('<path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm0 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"></path><path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm0 2a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H7zm10.5 1.5a1 1 0 110 2 1 1 0 010-2z"></path>') },
    { name: 'LinkedIn', icon: sic('<path d="M6.5 8v10H3.5V8h3zM5 3.5A1.75 1.75 0 105 7 1.75 1.75 0 005 3.5zM20.5 18h-3v-5c0-1.3-.5-2-1.5-2s-1.5.7-1.5 2v5h-3V8h3v1.3c.5-.8 1.4-1.5 2.7-1.5 2 0 3.3 1.3 3.3 4z"></path>') },
    { name: 'TikTok', icon: sic('<path d="M16 3c.3 2 1.5 3.5 3.5 4v3c-1.4 0-2.6-.4-3.5-1v5.5A5.5 5.5 0 118 9v3.2A2.5 2.5 0 1011 14V3h3z"></path>') }
  ];
  const phoneIcon = '<path d="M4 4h4l2 5-2 2a11 11 0 005 5l2-2 5 2v4a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2z"></path>';
  const contacts = [
    { icon: ic(phoneIcon), main: '+965 2242 3355', sub: 'Head Office Number' },
    { icon: ic(phoneIcon), main: '+965 184 0011', sub: 'Service Center Hotline' },
    { icon: ic(phoneIcon), main: '+965 9407 3737', sub: 'WhatsApp' },
    { icon: ic('<rect x="3" y="5" width="18" height="14" rx="1"></rect><path d="M3 7l9 6 9-6"></path>'), main: 'info@utc.com.kw', sub: 'Email Us' },
    { icon: ic('<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle>'), main: 'Union Trading Co.', sub: 'Rehab Al-Salem Street, Al Dawliya Complex, 3rd Floor, Kuwait City.' }
  ];
  const footAbout = ['About UTC', 'FAQ', 'Careers', 'Sitemap', 'Privacy Statement'];

  /* ---------- state ---------- */
  const S = { hero: 0, div: 0, storyImg: 0, partner: 0 };

  /* ---------- static renders ---------- */
  const el = id => document.getElementById(id);

  // nav (About Us -> Our Story, Our Divisions -> divisions, Contact -> contact)
  const NAV_HREF = { 'About Us': '#story', 'Our Divisions': '#divisions', 'Contact': '#contact' };
  el('nav').innerHTML = NAV.map(l => '<a href="' + (NAV_HREF[l] || '#') + '" class="hoverline" style="color:#fff;font-size:15px;font-weight:500;letter-spacing:0.01em;padding-bottom:4px;border-bottom:2px solid transparent">' + l + '</a>').join('');

  // brand marquee — starts with Apple, JBL (already white logos, no invert); filter on the logo only so separators stay uniform
  const marqueeBrands = [
    { name: 'Apple', src: 'uploads/applg_t.png', raw: true },
    { name: 'JBL', src: 'uploads/JBLlg_t.png', raw: true },
  ].concat(brandNames);
  const marqHtml = marqueeBrands.map(b => {
    const filt = b.raw ? 'none' : 'brightness(0) invert(1)';
    return '<div class="bcell" style="width:200px;height:56px;border-right:1px solid rgba(255,255,255,0.16);padding:9px 24px;opacity:0.82;transition:opacity .35s ease">'
      + '<div class="bimg" role="img" aria-label="' + b.name + '" style="width:100%;height:100%;filter:' + filt + ';background-image:url(&quot;' + b.src + '&quot;);background-size:contain;background-repeat:no-repeat;background-position:center;transition:transform .35s ease"></div></div>';
  }).join('');
  const marqsets = document.querySelectorAll('.marqset');
  marqsets.forEach(m => m.innerHTML = marqHtml);
  // JS-driven marquee so the FIRST brand (Apple) starts centred, then scrolls
  (function () {
    const row = document.querySelector('.marqrow');
    if (!row || !marqsets.length) return;
    row.style.animation = 'none';
    let W = 0, pos0 = 0, pos = 0, paused = false;
    function measure() { W = marqsets[0].getBoundingClientRect().width; pos0 = window.innerWidth / 2 - 100 - W; pos = pos0; }
    measure();
    row.addEventListener('mouseenter', () => paused = true);
    row.addEventListener('mouseleave', () => paused = false);
    window.addEventListener('resize', measure);
    let last = 0;
    function frame(t) {
      if (!last) last = t; const dt = t - last; last = t;
      if (!paused && W) { pos -= dt * (W / 34000); if (pos <= pos0 - W) pos += W; row.style.transform = 'translateX(' + pos.toFixed(1) + 'px)'; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  // socials (2), contacts, footAbout
  const socHtml1 = socials.map(s => '<a href="#" aria-label="' + s.name + '" style="width:40px;height:40px;border-radius:50%;border:1px solid #cfcbc0;display:flex;align-items:center;justify-content:center;color:#161513">' + s.icon + '</a>').join('');
  el('socials1').innerHTML = socHtml1;
  el('socials2').innerHTML = socials.map(s => '<a href="#" aria-label="' + s.name + '" style="width:34px;height:34px;border:1px solid #33312d;display:flex;align-items:center;justify-content:center;color:#cfcbc0">' + s.icon + '</a>').join('');
  el('contacts').innerHTML = contacts.map(c => '<div style="display:flex;gap:16px;align-items:flex-start"><div style="width:44px;height:44px;border-radius:50%;border:1px solid #d5d1c7;display:flex;align-items:center;justify-content:center;color:#161513;flex-shrink:0">' + c.icon + '</div><div><div style="font-size:15px;font-weight:600;color:#161513">' + c.main + '</div><div style="font-size:13px;color:#8a877f;margin-top:3px">' + c.sub + '</div></div></div>').join('');
  el('footAbout').innerHTML = footAbout.map(l => '<a href="#" style="color:#8f8c85;font-size:14px">' + l + '</a>').join('');

  // hero slides + dots
  el('heroSlides').innerHTML = '';
  heroImgs.forEach((img, i) => {
    const layer = document.createElement('div');
    layer.style.cssText = 'position:absolute;inset:0;transition:opacity 800ms ease;opacity:' + (i === 0 ? 1 : 0) + ';pointer-events:none';
    layer.appendChild(slotEl('hero-' + i, img, 'cover'));
    layer.dataset.h = i;
    el('heroSlides').appendChild(layer);
  });
  el('heroDots').innerHTML = heroImgs.map((_, i) => '<button data-hd="' + i + '" aria-label="slide" style="width:9px;height:9px;border-radius:50%;border:none;cursor:pointer;padding:0;background:' + (i === 0 ? '#141311' : 'rgba(255,255,255,0.55)') + '"></button>').join('');
  el('heroDots').querySelectorAll('button').forEach(b => b.onclick = () => setHero(+b.dataset.hd));

  // division image layers + tabs
  el('divLayers').innerHTML = '';
  divData.forEach((d, i) => {
    const layer = document.createElement('div');
    layer.style.cssText = 'position:absolute;inset:0;transition:opacity 500ms ease;opacity:' + (i === 0 ? 1 : 0) + ';z-index:' + (i === 0 ? 2 : 1) + ';pointer-events:none';
    layer.appendChild(slotEl(d.slot, 'img/' + d.slot + '.webp', 'cover'));
    el('divLayers').appendChild(layer);
  });
  function tabHtml() {
    return divData.map((d, i) => {
      const active = i === S.div;
      const divider = (i === divData.length - 1 || i === S.div || i === S.div - 1) ? '1px solid transparent' : '1px solid #2c2a26';
      return '<button data-dt="' + i + '" style="cursor:pointer;background:' + (active ? '#262a2e' : 'transparent') + ';border:none;border-right:' + divider + ';color:' + (active ? '#ffffff' : '#b4b8bc') + ';padding:11px 14px;display:flex;flex-direction:column;align-items:center;gap:7px;flex:1 1 0;min-width:118px;border-radius:14px;position:relative;transition:background 250ms ease"><span style="width:26px;height:26px;display:flex;align-items:center;justify-content:center">' + ic(d.icon) + '</span><span style="font-size:12px;font-weight:700;text-align:center;line-height:1.2">' + d.name + '</span></button>';
    }).join('');
  }
  el('divTabs').innerHTML = tabHtml();
  el('divTabs').querySelectorAll('button').forEach(b => b.onclick = () => setDiv(+b.dataset.dt));
  el('divPrev').onclick = () => setDiv((S.div - 1 + divData.length) % divData.length);
  el('divNext').onclick = () => setDiv((S.div + 1) % divData.length);

  // story photo layers (storefront + 2 extras)
  const storyPhotos = el('storyPhotos');
  const storyLayers = [];
  [{ id: 'story-storefront', src: 'img/story-storefront.webp' }, { id: 'story-x0', src: storyExtra[0] }, { id: 'story-x1', src: storyExtra[1] }].forEach((o, i) => {
    const layer = document.createElement('div');
    layer.style.cssText = 'position:absolute;inset:0;opacity:' + (i === 0 ? 1 : 0) + ';transition:opacity 1.1s ease';
    layer.appendChild(slotEl(o.id, o.src, 'cover'));
    storyPhotos.appendChild(layer);
    storyLayers.push(layer);
  });

  // story stats (desktop cqw + mobile)
  el('storyStats').innerHTML = storyStats.map(s => '<div style="display:flex;gap:1.2cqw;align-items:center"><div style="width:4cqw;height:4cqw;min-width:42px;min-height:42px;border-radius:50%;border:1px solid rgba(255,255,255,0.22);display:flex;align-items:center;justify-content:center;color:#cfcbc2;flex-shrink:0">' + s.icon + '</div><div><div data-kpi="' + s.n + '" style="font-family:\'Archivo\';font-weight:800;font-size:3.6cqw;line-height:1;color:#fff">' + s.n + '</div><div style="font-size:0.95cqw;letter-spacing:0.08em;color:#cbc7be;font-weight:700;margin:0.55cqw 0 0.3cqw">' + s.l + '</div><div style="font-size:0.8cqw;line-height:1.4;color:#8a867e">' + s.sub + '</div></div></div>').join('');
  el('storyStatsMobile').innerHTML = storyStats.map(s => '<div><div style="font-family:\'Archivo\';font-weight:800;font-size:34px;color:#fff">' + s.n + '</div><div style="font-size:12px;letter-spacing:0.06em;color:#cbc7be;font-weight:700;margin:6px 0 3px">' + s.l + '</div><div style="font-size:12px;color:#8a867e">' + s.sub + '</div></div>').join('');

  // partner rail dots, image layers, cells
  function renderPartnerStatic() {
    el('partnerRail').innerHTML = plist.map((p, i) => {
      const a = i === activePartner();
      return '<div data-pr="' + i + '" style="display:flex;align-items:center;gap:12px;cursor:pointer"><span style="font-size:11px;font-weight:700;letter-spacing:0.1em;width:18px;color:' + (a ? '#161513' : '#b3afa6') + '">0' + (i + 1) + '</span><span style="width:9px;height:9px;border-radius:50%;background:' + (a ? '#161513' : 'transparent') + ';border:1px solid ' + (a ? '#161513' : '#c3bfb5') + ';box-sizing:border-box"></span></div>';
    }).join('');
    el('partnerRail').querySelectorAll('[data-pr]').forEach(d => d.onclick = () => setPartner(+d.dataset.pr));
  }
  el('partnerImages').innerHTML = '';
  plist.forEach((p, i) => {
    const layer = document.createElement('div');
    layer.style.cssText = 'position:absolute;inset:0;opacity:' + (i === 0 ? 1 : 0) + ';transition:opacity .8s ease;pointer-events:none;z-index:' + (i === 0 ? 2 : 1);
    layer.appendChild(slotEl('pimg-' + i, 'img/pimg-' + i + '.webp', 'cover'));
    el('partnerImages').appendChild(layer);
  });
  function renderPartnerCells() {
    const a = activePartner();
    let h = plist.map((p, i) => {
      const on = i === a;
      return '<div data-pc="' + i + '" style="flex:1;min-width:0;padding:clamp(16px,1.8vw,26px) clamp(10px,1.5vw,22px);background:' + (on ? '#141414' : '#ffffff') + ';border-right:1px solid #ededed;cursor:pointer;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">'
        + '<span style="position:absolute;top:10px;left:14px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:' + (on ? '#7a7a7a' : '#b3afa6') + '">0' + (i + 1) + '</span>'
        + '<div class="slot pbar" data-slot="pbar-' + i + '" data-fit="contain" data-src="' + p.src + '" style="height:clamp(26px,2.4vw,34px);width:100%;position:relative;filter:' + (on ? 'invert(1) brightness(2)' : 'none') + '"></div>'
        + '<span style="font-size:10px;letter-spacing:0.12em;font-weight:600;color:' + (on ? '#8a8a8a' : '#9a978f') + '">SINCE ' + p.since + '</span></div>';
    }).join('');
    h += '<div style="flex:0.8;min-width:0;padding:clamp(16px,1.8vw,26px) clamp(12px,1.6vw,24px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px"><span style="font-size:11px;letter-spacing:0.14em;font-weight:700;color:#6d6a62;text-align:center;line-height:1.5">AND MORE<br>PARTNERS</span><span style="width:34px;height:1px;background:#c8c4ba"></span></div>';
    el('partnerCells').innerHTML = h;
    el('partnerCells').querySelectorAll('.pbar').forEach(sl => fillSlot(sl, sl.dataset.slot, sl.dataset.src, 'contain'));
    el('partnerCells').querySelectorAll('[data-pc]').forEach(d => d.onclick = () => setPartner(+d.dataset.pc));
  }
  el('partnerLogo').style.width = '100%';

  // milestones panels + mobile
  el('msPanels').innerHTML = milestones.map(m =>
    '<div data-ms-panel style="position:absolute;inset:0;overflow:hidden;border-radius:14px;background:#151515;backface-visibility:hidden;transform-origin:center center;will-change:transform,opacity;box-shadow:0 28px 70px -26px rgba(0,0,0,.85)">'
    + '<div class="slot" data-slot="' + m.slot + '"><img alt="" src="img/' + m.slot + '.webp"></div>'
    + '<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,10,10,.92) 0%,rgba(10,10,10,.72) 30%,rgba(10,10,10,.25) 62%,rgba(10,10,10,0) 85%)"></div>'
    + '<div style="position:absolute;left:0;top:0;bottom:0;width:min(52%,420px);display:flex;flex-direction:column;justify-content:center;padding:clamp(28px,4vw,54px)">'
    + '<div style="font-family:\'Archivo\';font-weight:800;font-size:clamp(40px,4.6vw,68px);line-height:0.9;color:#fff">' + m.year + '</div>'
    + '<h3 style="font-family:\'Archivo\';font-weight:700;font-size:clamp(18px,1.9vw,26px);line-height:1.15;margin:clamp(12px,1.6vh,18px) 0 14px;color:#fff">' + m.title + '</h3>'
    + '<div style="width:36px;height:2px;background:#7a7a7a;margin-bottom:14px"></div>'
    + '<p style="color:#b5b5b5;font-size:clamp(13px,1.05vw,15px);line-height:1.6;margin:0;max-width:300px">' + m.desc + '</p></div>'
    + '<div data-ms-dim style="position:absolute;inset:0;background:#0a0a0a;opacity:0.5;transition:opacity .45s ease;pointer-events:none"></div>'
    + '<div data-ms-ring style="position:absolute;inset:0;border:1px solid rgba(255,255,255,.09);border-radius:14px;opacity:0;transition:opacity .45s ease;pointer-events:none"></div></div>'
  ).join('');
  el('msMobile').innerHTML = milestones.map(m =>
    '<div style="position:relative;border-radius:14px;overflow:hidden;margin-bottom:16px;min-height:200px;background:#151515">'
    + '<div class="slot" data-slot="' + m.slot + '-m"><img alt="" src="img/' + m.slot + '.webp"></div>'
    + '<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,10,10,.92),rgba(10,10,10,.4))"></div>'
    + '<div style="position:relative;padding:24px"><div style="font-family:\'Archivo\';font-weight:800;font-size:42px;color:#fff">' + m.year + '</div>'
    + '<h3 style="font-family:\'Archivo\';font-weight:700;font-size:20px;margin:10px 0 10px;color:#fff">' + m.title + '</h3>'
    + '<div style="width:36px;height:2px;background:#7a7a7a;margin-bottom:12px"></div>'
    + '<p style="color:#b5b5b5;font-size:14px;line-height:1.6;margin:0;max-width:340px">' + m.desc + '</p></div></div>'
  ).join('');

  /* ---------- hero controller ---------- */
  function setHero(i) {
    S.hero = ((i % 4) + 4) % 4;
    const pal = heroPalette()[S.hero];
    el('heroText').style.background = pal.heroBg;
    el('heroKick').style.color = pal.heroKick;
    el('heroHead').style.color = pal.heroHead;
    el('heroSub').style.color = pal.heroSub;
    el('heroCta').style.background = pal.heroCtaBg;
    el('heroCta').style.color = pal.heroCtaTx;
    el('heroLabel').textContent = '0' + (S.hero + 1);
    el('heroLabel').style.color = pal.heroHead;
    el('heroTrack').style.background = pal.heroTrack;
    el('heroFill').style.background = pal.heroFill;
    el('heroFill').style.width = Math.round((S.hero + 1) / 4 * 100) + '%';
    el('heroMuted').style.color = pal.heroMuted;
    el('heroPartner').textContent = heroPartners[S.hero];
    const lite = heroLabelLight[S.hero] !== false;
    el('heroPartner').style.color = lite ? '#ffffff' : '#141311';
    el('heroPartnerKick').style.color = lite ? 'rgba(255,255,255,0.7)' : '#5a5750';
    el('heroSlides').querySelectorAll('[data-h]').forEach(l => l.style.opacity = (+l.dataset.h === S.hero) ? 1 : 0);
    el('heroDots').querySelectorAll('button').forEach(b => b.style.background = (+b.dataset.hd === S.hero) ? '#141311' : 'rgba(255,255,255,0.55)');
  }
  let heroTimer = setInterval(() => setHero(S.hero + 1), 5000);

  /* ---------- divisions controller ---------- */
  function setDiv(i) {
    S.div = ((i % divData.length) + divData.length) % divData.length;
    const d = divData[S.div];
    el('divTagline').textContent = d.tagline;
    el('divCounter').textContent = '0' + (S.div + 1);
    el('divIcon').innerHTML = ic(d.icon);
    el('divName').textContent = d.name;
    el('divDesc').innerHTML = d.descHtml || d.desc;
    el('divMgr').textContent = d.mgr;
    el('divContact').textContent = d.contact;
    // featured brands
    const raw = d.brands || [];
    const named = raw.filter(n => !/^\+/.test(n));
    const moreEntry = raw.find(n => /^\+/.test(n));
    const moreNum = moreEntry ? (parseInt(moreEntry.replace(/\D/g, ''), 10) || 0) : 0;
    const shown = named.slice(0, 2);
    const moreTotal = (named.length - shown.length) + moreNum;
    let bh = shown.map(name => {
      const src = logoFor(name);
      if (src) return '<div style="background:#0d0d0d;height:48px;width:126px;display:flex;align-items:center;justify-content:center;padding:0 20px;border-radius:12px"><div role="img" aria-label="' + name + '" style="width:100%;height:26px;filter:brightness(0) invert(1);background-image:url(&quot;' + src + '&quot;);background-size:contain;background-repeat:no-repeat;background-position:center"></div></div>';
      return '<div style="background:#0d0d0d;height:48px;min-width:78px;display:flex;align-items:center;justify-content:center;padding:0 22px;border-radius:12px"><span style="font-family:\'Archivo\';font-weight:700;font-size:13px;color:#fff">' + name + '</span></div>';
    }).join('');
    if (moreTotal > 0) bh += '<div style="border:1px solid #cfd1d4;background:#fff;height:48px;min-width:72px;display:flex;align-items:center;justify-content:center;padding:0 18px;border-radius:12px"><span style="font-family:\'Archivo\';font-weight:700;font-size:13px;color:#57544c">+' + moreTotal + ' more</span></div>';
    el('divBrands').innerHTML = bh;
    // image layers
    Array.from(el('divLayers').children).forEach((l, i) => { l.style.opacity = i === S.div ? 1 : 0; l.style.zIndex = i === S.div ? 2 : 1; });
    // tabs
    el('divTabs').innerHTML = tabHtml();
    el('divTabs').querySelectorAll('button').forEach(b => b.onclick = () => setDiv(+b.dataset.dt));
  }
  let divTimer = setInterval(() => setDiv(S.div + 1), 7000);

  /* ---------- story image cycle ---------- */
  setInterval(() => {
    S.storyImg++;
    const active = S.storyImg % storyLayers.length;
    storyLayers.forEach((l, i) => l.style.opacity = i === active ? 1 : 0);
  }, 4000);

  /* ---------- partners controller ---------- */
  function activePartner() { const n = plist.length; return ((S.partner % n) + n) % n; }
  function setPartner(i) {
    S.partner = i;
    const a = activePartner();
    const p = plist[a];
    fillSlot(el('partnerLogo'), 'plogo-' + a, p.src, 'contain');
    el('partnerLogo').style.width = '100%';
    el('partnerQuote').textContent = p.quote;
    fillSlot(el('partnerAvatar'), 'pavatar-' + a, 'img/pavatar-' + a + '.webp', 'cover');
    el('partnerPerson').textContent = p.person;
    el('partnerRole').textContent = p.role;
    el('partnerYears').textContent = p.years;
    el('partnerSince').textContent = p.since;
    Array.from(el('partnerImages').children).forEach((l, i) => { l.style.opacity = i === a ? 1 : 0; l.style.zIndex = i === a ? 2 : 1; });
    renderPartnerStatic();
    renderPartnerCells();
  }
  let partnerTimer = setInterval(() => setPartner(S.partner + 1), 6000);

  /* ---------- contact form ---------- */
  el('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    el('submitBtn').childNodes[0].nodeValue = 'MESSAGE SENT ✓';
  });

  /* ---------- KPI count-up ---------- */
  function initKpis() {
    const els = Array.from(document.querySelectorAll('[data-kpi]'));
    if (!els.length) return;
    let done = false;
    els.forEach(e => { const raw = e.getAttribute('data-kpi'); e.__t = parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0; e.__s = raw.replace(/[0-9]/g, ''); e.textContent = '0' + e.__s; });
    const animate = () => {
      const dur = 1600, start = performance.now();
      const tick = now => { const t = Math.min(1, (now - start) / dur); const e2 = 1 - Math.pow(1 - t, 3); els.forEach(e => e.textContent = Math.round(e.__t * e2) + e.__s); if (t < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(ents => { ents.forEach(en => { if (en.isIntersecting && !done) { done = true; animate(); obs.disconnect(); } }); }, { threshold: 0.4 });
    els.forEach(e => obs.observe(e));
  }

  /* ---------- milestones 3D drum ---------- */
  function initMilestones() {
    const sec = document.querySelector('[data-ms-section]');
    if (!sec) return;
    const panels = Array.from(document.querySelectorAll('[data-ms-panel]'));
    const counter = document.querySelector('[data-ms-counter]');
    const rail = document.querySelector('[data-ms-rail]');
    const progdot = document.querySelector('[data-ms-progdot]');
    const prevBtn = document.querySelector('[data-ms-prev]');
    const nextBtn = document.querySelector('[data-ms-next]');
    const N = panels.length;
    if (!N) return;
    const pad = n => (n < 10 ? '0' + n : '' + n);
    const STEP = 60, FACTOR = 0.5 / Math.tan((STEP / 2) * Math.PI / 180);
    const measure = () => panels.forEach(p => { const vp = p.closest('[data-ms-viewport]'); p.__r = (vp ? vp.offsetHeight : 400) * FACTOR; });
    measure();
    let target = 0, cur = 0, lastActive = -1, running = false, prog = 0;
    panels.forEach(p => { p.__dim = p.querySelector('[data-ms-dim]'); p.__ring = p.querySelector('[data-ms-ring]'); });
    const setActive = active => {
      panels.forEach((p, i) => { const on = i === active; if (p.__dim) p.__dim.style.opacity = on ? '0' : '0.5'; if (p.__ring) p.__ring.style.opacity = on ? '1' : '0'; });
      if (counter) counter.innerHTML = pad(active + 1) + ' <span style="color:#5a5a5a">/ ' + pad(N) + '</span>';
    };
    const render = raw => {
      panels.forEach((p, i) => {
        const ang = (i - raw) * STEP;
        const vis = Math.abs(ang) < 91;
        const op = vis ? Math.max(0, Math.pow(Math.cos(ang * Math.PI / 180), 0.9)) : 0;
        const r = p.__r || 300;
        p.style.transform = 'translateZ(' + (-r).toFixed(0) + 'px) rotateX(' + (-ang).toFixed(2) + 'deg) translateZ(' + r.toFixed(0) + 'px)';
        p.style.opacity = op.toFixed(3);
        p.style.zIndex = vis ? String(100 - Math.round(Math.abs(ang))) : '0';
      });
      if (rail && progdot) progdot.style.top = (Math.min(1, Math.max(0, raw / (N - 1))) * (rail.offsetHeight - 7)).toFixed(1) + 'px';
      const active = Math.min(N - 1, Math.round(raw));
      if (active !== lastActive) { lastActive = active; setActive(active); }
    };
    const tick = () => { cur += (target - cur) * 0.12; if (Math.abs(target - cur) < 0.0006) { cur = target; render(cur); running = false; return; } render(cur); requestAnimationFrame(tick); };
    const kick = () => { if (!running) { running = true; requestAnimationFrame(tick); } };
    const go = n => { prog = Math.max(0, Math.min(N - 1, n)); target = prog; lastWheel = Date.now(); kick(); };
    const vp = document.querySelector('[data-ms-viewport]');
    let engaged = false, lastWheel = 0;
    const SENS = 520;
    const onWheel = e => {
      const rect = sec.getBoundingClientRect(), vh = window.innerHeight;
      const near = rect.top <= vh * 0.5 && rect.bottom >= vh * 0.5;
      const dir = e.deltaY > 0 ? 1 : -1;
      const atEnd = (dir > 0 && prog >= N - 1 - 0.001) || (dir < 0 && prog <= 0.001);
      if (!near) { engaged = false; return; }
      if (atEnd) { engaged = false; return; }
      e.preventDefault();
      if (!engaged) { engaged = true; window.scrollTo({ top: rect.top + window.scrollY, behavior: 'smooth' }); }
      prog = Math.max(0, Math.min(N - 1, prog + e.deltaY / SENS));
      target = prog; lastWheel = Date.now(); kick();
    };
    if (vp) vp.addEventListener('wheel', onWheel, { passive: false });
    if (prevBtn) prevBtn.onclick = () => go(Math.round(prog) - 1);
    if (nextBtn) nextBtn.onclick = () => go(Math.round(prog) + 1);
    window.addEventListener('resize', () => { measure(); render(cur); });
    setInterval(() => {
      const rect = sec.getBoundingClientRect(), vh = window.innerHeight;
      const covers = rect.top <= vh * 0.5 && rect.bottom >= vh * 0.5;
      if (covers && Date.now() - lastWheel > 3200) go((Math.round(prog) + 1) % N);
    }, 3400);
    cur = target; render(cur);
  }

  /* ---------- fit hero to viewport minus header ---------- */
  function fitHero() { const h = document.querySelector('header'); if (h) document.documentElement.style.setProperty('--hdr', h.offsetHeight + 'px'); }
  window.addEventListener('resize', fitHero);

  /* ---------- init ---------- */
  setHero(0);
  setDiv(0);
  setPartner(0);
  fitHero();
  setTimeout(fitHero, 300);
  setTimeout(layoutAll, 60);
  setTimeout(layoutAll, 400);
  setTimeout(observeSlots, 80);
  setTimeout(() => { initMilestones(); initKpis(); }, 150);
  window.addEventListener('load', () => { layoutAll(); fitHero(); });

})();
