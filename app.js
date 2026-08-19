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
    'pimg-0': { s: 1, x: -41.94, y: 0 }, 'pimg-1': { s: 1, x: -34.51, y: 0 }, 'pimg-2': { s: 1, x: -26.52, y: 0 }, 'pimg-3': { s: 1, x: 0, y: 0 },
    'hero-4': { s: 1, x: -23, y: 0 }  // Havit (slide 5) — pan right so the subject's face stays in frame
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
    const existing = el.querySelector('img');
    if (existing && existing.getAttribute('src') === src) { layoutSlot(el); return; }
    // Preload + decode the new image off-screen while the current one stays visible,
    // then swap it in already sized. Without this, a fresh <img> paints at its natural
    // (large) size for a frame before layoutSlot shrinks it — a flicker on manual switches.
    let done = false;
    const apply = () => {
      if (done) return; done = true;
      let img = el.querySelector('img');
      if (!img) { img = document.createElement('img'); img.alt = ''; img.decoding = 'async'; el.appendChild(img); }
      img.onload = () => layoutSlot(el);
      img.src = src;
      layoutSlot(el);              // src is cache-warm now → naturalWidth ready, size before paint
      img.style.visibility = 'visible';
    };
    const next = new Image();
    next.decoding = 'async';
    next.onload = apply;
    next.onerror = apply;
    next.src = src;
    if (next.complete && next.naturalWidth) apply();   // already cached & decoded
  }

  /* ---------- data ---------- */
  const NAV = ['About Us', 'Our Divisions', 'Our Stores', 'Our Channels', 'Careers', 'Contact'];
  const NAV_SOON = ['Careers'];
  const heroImgs = ['uploads/Carousal4.webp', 'uploads/OGeneral.webp', 'uploads/cecotec.webp', 'uploads/changhong.webp', 'uploads/havit.webp'];
  const heroPartners = ['GlemGas', 'General', 'Cecotec', 'CHiQ Changhong', 'Havit'];
  const heroLabelLight = [true, false, false, true, true];  // dark label on the light General & Cecotec images; white on Changhong & Havit (dark scenes)

  function heroPalette() {
    const light = (bg, head, sub, kick, track, muted) => ({ heroBg: bg, heroHead: head, heroSub: sub, heroKick: kick, heroTrack: track, heroFill: head, heroMuted: muted, heroCtaBg: '#0d0d0d', heroCtaTx: '#fff' });
    const dark = (bg, head, sub, kick, track, muted) => ({ heroBg: bg, heroHead: head, heroSub: sub, heroKick: kick, heroTrack: track, heroFill: head, heroMuted: muted, heroCtaBg: head, heroCtaTx: bg });
    return [
      dark('#182430', '#f2efe8', '#b6c0c8', '#7d909c', '#37485580', '#6f818d'),   // GlemGas
      light('#e6ddc9', '#2a2417', '#57503d', '#978f76', '#c9c0a6', '#a99f83'),    // O General
      light('#e8e3d9', '#2a2620', '#57524a', '#948d7e', '#cbc4b4', '#a49b88'),    // Cecotec (warm bedroom)
      dark('#101d33', '#eef2f6', '#aab6c6', '#748399', '#2c3c5680', '#6b7a90'),    // CHiQ Changhong (starry navy)
      light('#dcdedd', '#20262a', '#4e565a', '#8a9296', '#c1c7c6', '#98a0a1'),    // Havit (cool misty forest)
    ];
  }

  const brandNames = [
    { name: 'Braun', src: 'assets/b1.png' }, { name: 'Angel Wear', src: 'assets/b2.png' }, { name: 'India Gate', src: 'assets/b3.png' },
    { name: 'Hitachi', src: 'assets/b4.png' }, { name: 'Brandili', src: 'assets/b5.png' }, { name: 'Constance Carroll', src: 'assets/b6.png' },
    { name: 'Glysolid', src: 'assets/b7.png' }, { name: 'Eagle Safes', src: 'assets/b8.png' }, { name: 'Prestige', src: 'assets/b9.png' }, { name: 'O General', src: 'assets/b10.png' },
    { name: 'Daikin', src: 'img/brands-elec/daikin.webp' }, { name: 'Triumph', src: 'img/brands-aluna/triumph.webp' }, { name: 'Sloggi', src: 'img/brands-aluna/sloggi.webp' },
    { name: 'Vileda', src: 'img/brands-elec/vileda.webp' }, { name: 'Cans', src: 'img/brands-elec/cans.webp' }, { name: 'Palladio', src: 'img/brands-elec/palladio.webp' }, { name: 'Vero Moda', src: 'img/brands-elec/vero-moda.webp' }
  ];
  function logoFor(name) {
    const n = String(name).toLowerCase();
    const f = brandNames.find(b => { const bn = b.name.toLowerCase(); return bn === n || bn.includes(n) || n.includes(bn); });
    return f ? f.src : null;
  }

  const divData = [
    { name: 'Union Electronics', href: 'Union-Electronics/', logo: 'img/Div/electronics-logo.webp', cardLogo: 'img/Div/Black.webp', cardLogoH: 'clamp(48px,6vw,74px)', tagline: 'Smarter Homes. Simpler Living.', icon: '<rect x="4" y="3" width="7" height="18" rx="1.5"></rect><circle cx="7.5" cy="8" r="1.4"></circle><rect x="13" y="3" width="7" height="18" rx="1.5"></rect><circle cx="16.5" cy="8" r="1.4"></circle>', desc: 'Recognizing the growing demand for premium electronic appliances, UNION strategically expanded its portfolio to offer a comprehensive range of world-renowned consumer electronics and home appliances. Through partnerships with leading global brands, the company has consistently delivered innovative, reliable, and energy-efficient solutions that enhance everyday living while meeting the evolving needs of customers across Kuwait.', mgr: 'Available on request', contact: 'Chat with Us', brands: ['Hitachi', 'Daikin', '+22 more'], slot: 'div-elec' },
    { name: 'Aluna', href: 'Aluna/', logo: 'img/Div/aluna-logo.webp', cardLogo: 'img/Div/aluna-logo.webp', cardLogoDark: true, tagline: 'Beauty in Every Detail.', icon: '<path d="M9 21h6a2 2 0 002-2v-6a3 3 0 00-3-3h-1V7h-2v3H10a3 3 0 00-3 3v6a2 2 0 002 2z"></path><path d="M10 5h4M11 3h2"></path>', desc: 'Recognizing the growing demand for premium beauty and fragrance products, UNION developed a distinguished portfolio of internationally acclaimed cosmetics and perfume brands. By offering authentic, high-quality products, the company continues to deliver luxury, elegance, and confidence to customers throughout Kuwait.', mgr: 'Available on request', contact: 'Chat with Us', brands: ['Triumph', 'Sloggi', '+12 more'], slot: 'div-cosmetics' },
    { name: 'FMCG', soon: true, logo: 'img/Div/fmcg-logo.webp', cardLogo: 'img/Div/fmcg-logo.webp', cardLogoDark: true, tagline: 'Everyday Essentials, Delivered.', icon: '<circle cx="9" cy="20" r="1.2"></circle><circle cx="17" cy="20" r="1.2"></circle><path d="M2 4h2.5l2.5 12h10l2-8H6.2"></path>', desc: 'As consumer expectations for quality everyday essentials continued to rise, UNION expanded its portfolio to include a wide range of fast-moving consumer goods from leading international brands. By delivering trusted food, beverage, and household products, the company has become a reliable partner in meeting the daily needs of consumers.', mgr: 'Available on request', contact: 'Chat with Us', brands: ['Vileda', 'Cans'], slot: 'div-fmcg' },
    { name: 'Labels', soon: true, logo: 'img/Div/labels-logo.webp', cardLogo: 'img/Div/labels-logo.webp', cardLogoDark: true, cardLogoH: 'clamp(48px,6vw,74px)', tagline: 'Timeless Everyday Style.', icon: '<circle cx="12" cy="5" r="2"></circle><path d="M12 7l7 5-2 2-2-1.5V21H9v-8.5L7 14l-2-2 7-5z"></path>', desc: 'With changing lifestyles and increasing demand for premium fashion, UNION established a strong presence by introducing internationally renowned fashion, cosmetics, and lifestyle brands. Through a carefully curated portfolio, the company continues to deliver quality, style, and exceptional retail experiences to customers across the region.', mgr: 'Available on request', contact: 'Chat with Us', brands: ['Palladio', 'Vero Moda'], slot: 'div-fashion' },
    { name: 'Union Services', soon: true, logo: 'img/Div/services-logo.webp', cardLogo: 'img/Div/services-logo.webp', cardLogoDark: true, cardLogoH: 'clamp(44px,5.4vw,66px)', tagline: 'Caring for Every Family.', icon: '<path d="M12 20s-6.5-4.2-9-8.2C1.4 9 2.6 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 4.6 3.5 3 6.3-2.5 4-9 8.2-9 8.2z"></path>', desc: 'World class VRV and HVAC-R solutions for professionals across Kuwait.', mgr: 'Available on request', contact: 'Chat with Us', brands: [], slot: 'div-health' },
    { name: 'Commercial AC Projects', soon: true, logo: 'img/Div/commercial-logo.webp', cardLogo: 'img/Div/commercial-logo.webp', cardLogoDark: true, cardLogoH: 'clamp(44px,5.2vw,64px)', tabW: '138px', tagline: 'Powerful, Efficient Cooling.', icon: '<rect x="3" y="5" width="18" height="8" rx="2"></rect><path d="M6.5 9h1M10 9h7.5M7 16c.2 1.4 1 1.8 1 3M12 16c.2 1.4 1 1.8 1 3M17 16c-.2 1.4-1 1.8-1 3"></path>', desc: "At the time of the company's inception there was a great demand in the market for climate control technology. UTC's answer to this demand was the creation of its very own line of climate control solution: General Air Conditioners.", descHtml: "At the time of the company's inception there was a great demand in the market for climate control technology. UTC's answer to this demand was the creation of its very own line of climate control <strong style=\"color:#161513;font-weight:700\">solution: General Air Conditioners.</strong>", mgr: 'Mr. Walid Khalid', contact: 'Chat with Us', brands: [], brandsSoon: true, slot: 'div-commercial' }
  ];

  const storyStats = [
    { n: '75+', l: 'YEARS IN BUSINESS', sub: 'Built on trust. Driven by excellence.', icon: ic('<rect x="3" y="7" width="18" height="13" rx="1"></rect><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"></path>') },
    { n: '80+', l: 'GLOBAL BRANDS', sub: 'Partnerships with world leaders.', icon: ic('<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"></path>') },
    { n: '500+', l: 'EMPLOYEES', sub: 'A team powering our promise.', icon: ic('<circle cx="9" cy="8" r="3"></circle><path d="M3 20c0-3 3-5 6-5s6 2 6 5"></path><path d="M16 6a3 3 0 010 6M21 20c0-2.5-2-4-4-4.5"></path>') },
    { n: '10+', l: 'RETAIL OUTLETS', sub: 'Across Kuwait and beyond.', icon: ic('<path d="M3 9l1.5-5h15L21 9"></path><path d="M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9"></path><path d="M3 9h18"></path><path d="M9 20v-6h6v6"></path>') }
  ];
  const storyExtra = ['uploads/city-showroom.webp', 'uploads/old-general-photo.webp'];

  const plist = [
    { name: 'Milton Lloyd', since: '1978', years: '44+', src: 'uploads/Mil-trimmed.webp', person: 'Peter Jackson', role: 'CEO', quote: 'Our mission with UTC branded perfumes, throughout the past 44 years, has (under Union Trading Company’s continuing unique and continuing vision / foresight and leadership) always been to offer to consumers with limited financial resources outstanding perfumery of the finest quality and at the lowest possible price. Since 1978, this unique and continuous perfumery cooperation between Union Trading Company and Milton-Lloyd has manufactured (in the UK) and distributed (initially in Kuwait and then throughout the world) more than 300 million bottles of UTC glass perfumery. A huge number. An unprecedented success. We believe that Milton-Lloyd’s cooperation and friendship with Union Trading Company is as strong or stronger today than it has ever been. And the future of UTC is bright.' },
    { name: 'Glemgas', since: '1970', years: '50+', src: 'uploads/Glem-trimmed.webp', person: 'Marco Guerzoni', role: 'Marketing Director', quote: 'It has been a long journey of over 50 years under the guidance of UTC that helped us to be market leader in Kuwait. All of our achievements weren’t possible without the great support and effort of the entire UTC team. From the ones in the past who have made such a great story possible, to the current and future one that god willing they will certainly raise the bar to achieve what now seems impossible to our eyes. I personally want to thank all of UTC for their precious dedication and support, and am looking forward to celebrate our new impossible achievements.' },
    { name: 'Jockey', since: '2003', years: '20+', src: 'uploads/Jock-trimmed.webp', person: 'Brand Team', role: 'Brand Partner', quote: 'Jockey International, Inc. has enjoyed a valuable working relationship with Union Trading Co. for the past 20 years. We value UTC’s loyal patronage over those years and the business relationship that has ensued because of our cooperation. We have watched Union Trading Co. grow into a thriving business and a business well-known throughout the Gulf region. We know Union Trading Co. has many options and we are pleased with the close relationship between our companies and look forward to many more years of serving Union Trading Co. We are committed to providing Union Trading Co. with quality service and the best products at a fair price. The cooperation between Jockey International, Inc. and Union Trading Co. has led to a respectful business relationship between our two companies. Jockey International, Inc. looks forward to many more years of our association with Union Trading Co. and wish you the success that you so richly deserve as you relaunch of your Corporate Website. Thank you, Union Trading Co. for giving Jockey International, Inc. the opportunity to serve your great company.' },
  ];

  const milestones = [
    { year: '1949', title: 'First Showroom, Ahmadi', desc: 'Our journey began with a single showroom in Ahmadi, marking the start of Union Trading Co.', slot: 'ms-1949' },
    { year: '1958', title: 'Kuwait City Showroom Launch', desc: 'We expanded our presence with the launch of our showroom in Kuwait City, bringing us closer to our customers.', slot: 'ms-1958' },
    { year: '1966', title: 'Partnership with Gillette', desc: 'We partnered with Gillette to bring world-class grooming products to our customers.', slot: 'ms-1966' },
    { year: '1969', title: 'Partnership with Glemgas', desc: 'We joined hands with Glemgas to bring premium Italian home appliances to our customers.', slot: 'ms-1969' },
    { year: '1970', title: 'Partnership with General', desc: 'Joined hands with General to offer advanced and reliable air conditioning solutions.', slot: 'ms-1970' },
    { year: '1977', title: 'Foundation of UTC Perfumes', desc: 'We ventured into beauty with the foundation of UTC Perfumes — quality fragrances for every lifestyle.', slot: 'ms-1977' },
    { year: '1980', title: 'Salhiya Showroom', desc: 'We opened our Salhiya showroom, extending Union Trading Co.’s retail presence into the heart of Kuwait City.', slot: 'ms-1980' },
    { year: '1982', title: 'Farwaniya Showroom', desc: 'Our Farwaniya showroom opened its doors, bringing our brands closer to families across the governorate.', slot: 'ms-1982' },
    { year: '1999', title: 'New Headquarters in Dawliya Complex', desc: 'We relocated to a new headquarters in the Dawliya Complex, anchoring our operations for the decades ahead.', slot: 'ms-1999' },
    { year: '2009', title: 'Appliance Showroom — Jahra, Farwaniya & Hawally', desc: 'We launched dedicated appliance showrooms in Jahra, Farwaniya and Hawally, widening access to home and electronic appliances.', slot: 'ms-2009' },
    { year: '2017', title: 'Yaal Showroom', desc: 'The Yaal showroom opened, adding a modern retail destination to our growing network.', slot: 'ms-2017' },
    { year: '2020', title: 'New Hawally Department Store', desc: 'We unveiled our new Hawally department store — a flagship retail experience for a new generation of customers.', slot: 'ms-2020' },
    { year: '2024', title: 'Launch of Aluna', desc: 'We introduced Aluna, our dedicated beauty and fragrance destination, bringing internationally acclaimed cosmetics and perfumes to customers across Kuwait.', slot: 'ms-2024' },
    { year: '2026', title: 'Union Electronics', desc: 'We brought Union Electronics to life across Physical and Digital Stores, delivering a seamless omni-channel experience for the latest technology and home appliances.', slot: 'ms-2026' }
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

  // Offices for the contact panel — each opens the Our Stores explorer; where a
  // matching store record exists, it deep-links to it via ?store=<index>.
  const offices = [
    { name: 'Head Office', addr: ['Salhiya, Kuwait City', 'P.O. Box 239, Safat 13003, Kuwait'], phone: '+965 18444449', email: 'info@utc.com.kw', store: 0, img: 'img/stores/fahed-al-salem-1.webp' },
    { name: 'Salmiya Showroom', addr: ['Salmiya, Salem Al Mubarak Street', 'Salmiya, Kuwait'], phone: '+965 25710800', email: 'salmiya@utc.com.kw', store: 1, img: 'img/stores/salmiya-1.webp' },
    { name: 'Hawally Showroom', addr: ['Al-Othman Street, Hawally', 'Kuwait'], phone: '+965 22640200', email: 'hawally@utc.com.kw', store: 3, img: 'img/stores/hawally-1.webp' }
  ];

  // Bottom feature strip
  const features = [
    { icon: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>', title: 'Quick Response', sub: 'We aim to respond within 24 business hours.' },
    { icon: '<path d="M4 14v-2a8 8 0 0116 0v2"></path><rect x="3" y="14" width="4" height="6" rx="1.5"></rect><rect x="17" y="14" width="4" height="6" rx="1.5"></rect>', title: 'Dedicated Support', sub: 'Our team is here to assist you at every step.' },
    { icon: '<path d="M9 12l2 2 4-4"></path><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"></path>', title: 'Partnerships', sub: "Interested in becoming a partner? Let's connect." },
    { icon: '<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"></path>', title: 'Global Standards', sub: 'Delivering international quality with local commitment.' },
    { icon: '<path d="M4 19l5-5 3 3 7-8"></path><path d="M16 9h4v4"></path>', title: 'Mutual Growth', sub: 'We grow together to create long-term value.' }
  ];

  /* ---------- state ---------- */
  const S = { hero: 0, div: 0, storyImg: 0, partner: 0 };

  /* ---------- static renders ---------- */
  const el = id => document.getElementById(id);

  // nav (About Us -> About page, Our Divisions -> divisions, Contact -> contact)
  const NAV_HREF = { 'About Us': 'About/', 'Our Divisions': 'Divisions/', 'Our Stores': 'Our-Stores/', 'Our Channels': 'Our-Channels/', 'Contact': '#contact' };
  el('nav').innerHTML = NAV.map(l => NAV_SOON.indexOf(l) !== -1
    ? '<span title="Coming soon" style="color:rgba(255,255,255,0.32);font-size:15px;font-weight:500;letter-spacing:0.01em;padding-bottom:4px;border-bottom:2px solid transparent;cursor:not-allowed">' + l + '</span>'
    : '<a href="' + (NAV_HREF[l] || '#') + '" class="hoverline" style="color:#fff;font-size:15px;font-weight:500;letter-spacing:0.01em;padding-bottom:4px;border-bottom:2px solid transparent">' + l + '</a>').join('');

  // brand marquee — the full Electronics brand set, rendered as white silhouettes
  // via the invert filter. Kept separate from brandNames so the division brand-chip
  // lookup (logoFor) is unaffected.
  const marqBrands = [
    { name: 'B&D', src: 'img/brands-elec/b-d.webp' },
    { name: 'Triumph', src: 'img/brands-aluna/triumph.webp' },
    { name: 'Belkin', src: 'img/brands-elec/belkin.webp' },
    { name: 'Canton', src: 'img/brands-elec/canton.webp' },
    { name: 'Sloggi', src: 'img/brands-aluna/sloggi.webp' },
    { name: 'Cecotec', src: 'img/brands-elec/cecotec.webp' },
    { name: 'Changhong', src: 'img/brands-elec/changhong.webp' },
    { name: 'Maidenform', src: 'img/brands-aluna/maidenform.webp' },
    { name: 'Chigo', src: 'img/brands-elec/chigo.webp' },
    { name: 'Daikin', src: 'img/brands-elec/daikin.webp' },
    { name: 'Hanes', src: 'img/brands-aluna/hanes.webp' },
    { name: 'Fakir', src: 'img/brands-elec/fakir.webp' },
    { name: 'Galanz', src: 'img/brands-elec/galanz.webp' },
    { name: 'Bali', src: 'img/brands-aluna/bali.webp' },
    { name: 'General', src: 'img/brands-elec/general.webp' },
    { name: 'Glemgas', src: 'img/brands-elec/glemgas.webp' },
    { name: 'Naomi & Nicole', src: 'img/brands-aluna/naomi-nicole.webp' },
    { name: 'Havic', src: 'img/brands-elec/havic.webp' },
    { name: 'Hifuture', src: 'img/brands-elec/hifuture.webp' },
    { name: 'Carole Hochman', src: 'img/brands-aluna/carole-hochman.webp' },
    { name: 'Hitachi', src: 'img/brands-elec/hitachi.webp' },
    { name: 'Konka', src: 'img/brands-elec/konka.webp' },
    { name: 'Leg Avenue', src: 'img/brands-aluna/leg-avenue.webp' },
    { name: 'Morphy', src: 'img/brands-elec/morphy.webp' },
    { name: 'Naim & Focal', src: 'img/brands-elec/naim-focal.webp', big: true },
    { name: 'Eileen West', src: 'img/brands-aluna/eileen-west.webp' },
    { name: 'Proove', src: 'img/brands-elec/proove.webp' },
    { name: 'ROWA', src: 'img/brands-elec/rowa.webp' },
    { name: 'Cupid', src: 'img/brands-aluna/cupid.webp' },
    { name: 'Startec', src: 'img/brands-elec/startec.webp' },
    { name: 'TCL', src: 'img/brands-elec/tcl.webp' },
    { name: 'Mapale', src: 'img/brands-aluna/mapale.webp' },
    { name: 'Vestel', src: 'img/brands-elec/vestel.webp' },
    { name: 'Ivory', src: 'img/brands-aluna/ivory.webp' },
    { name: 'Westpoint', src: 'img/brands-elec/westpoint.webp' },
    { name: 'C.Lengerie', src: 'img/brands-aluna/c-lengerie.webp' },
    { name: 'Yuwell', src: 'img/brands-elec/yuwell.webp' },
    { name: 'G World', src: 'img/brands-aluna/g-world.webp' }
  ];
  const marqueeBrands = marqBrands;
  const marqHtml = marqueeBrands.map(b => {
    const filt = b.raw ? 'none' : 'brightness(0) invert(1)';
    return '<div class="bcell" style="width:200px;height:56px;border-right:1px solid rgba(255,255,255,0.16);padding:' + (b.big ? '5px 24px' : '13px 24px') + ';opacity:0.82;transition:opacity .35s ease">'
      + '<div class="bimg" role="img" aria-label="' + b.name + '" style="width:100%;height:100%;filter:' + filt + ';background-image:url(&quot;' + b.src + '&quot;);background-size:contain;background-repeat:no-repeat;background-position:center;transition:transform .35s ease"></div></div>';
  }).join('');
  const marqsets = document.querySelectorAll('.marqset');
  marqsets.forEach(m => m.innerHTML = marqHtml);
  // JS-driven marquee so the first brand starts centred, then scrolls
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
    const PXPS = 30; // px/sec — matched to the Aluna inner-page brand marquee
    function frame(t) {
      if (!last) last = t; const dt = t - last; last = t;
      if (!paused && W) { pos -= dt * PXPS / 1000; if (pos <= pos0 - W) pos += W; row.style.transform = 'translateX(' + pos.toFixed(1) + 'px)'; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  // socials (footer), footAbout
  el('socials2').innerHTML = socials.map(s => '<a href="#" aria-label="' + s.name + '" style="width:34px;height:34px;border:1px solid #33312d;display:flex;align-items:center;justify-content:center;color:#cfcbc0">' + s.icon + '</a>').join('');

  // office rows — open the Our Stores explorer (deep-linked to the store where one exists)
  const officeIcon = (p) => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" style="flex-shrink:0">' + p + '</svg>';
  const officesEl = el('offices');
  if (officesEl) {
    officesEl.innerHTML = offices.map((o, i) => {
      const href = o.store != null ? 'Our-Stores/?store=' + o.store : 'Our-Stores/';
      const divider = i < offices.length - 1 ? 'border-bottom:1px solid #ece8de;' : '';
      return '<a class="office-card" href="' + href + '" style="display:flex;gap:14px;align-items:center;padding:8px 10px;text-decoration:none;color:inherit;border-radius:12px;' + divider + 'transition:background .25s">'
        + '<span style="width:56px;height:52px;flex-shrink:0;border-radius:10px;background:#eceae2 url(&quot;' + o.img + '&quot;) center/cover no-repeat"></span>'
        + '<div style="min-width:0;flex:1">'
        + '<div style="font-family:\'Archivo\';font-weight:700;font-size:15px;color:#161513;margin-bottom:3px">' + o.name + '</div>'
        + '<div style="font-size:12px;color:#8a877f;line-height:1.4;margin-bottom:5px">' + o.addr.join('<br>') + '</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:6px 18px">'
        + '<span style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:#5c5951">' + officeIcon('<path d="M4 4h4l2 5-2 2a11 11 0 005 5l2-2 5 2v4a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2z"></path>') + o.phone + '</span>'
        + '<span style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:#5c5951">' + officeIcon('<rect x="3" y="5" width="18" height="14" rx="1"></rect><path d="M3 7l9 6 9-6"></path>') + o.email + '</span>'
        + '</div>'
        + '</div>'
        + '<span class="office-arrow" style="width:38px;height:38px;flex-shrink:0;border-radius:50%;border:1px solid #ddd8cc;display:flex;align-items:center;justify-content:center;color:#161513;align-self:center;transition:background .25s,color .25s,border-color .25s"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span>'
        + '</a>';
    }).join('');

    // mobile only: pagination dots for the offices swipe-carousel (hidden on desktop via inline display:none)
    if (!document.querySelector('.office-dots')) {
      const dw = document.createElement('div');
      dw.className = 'office-dots';
      dw.style.cssText = 'display:none;justify-content:center;gap:7px;margin-top:12px';
      dw.innerHTML = offices.map((o, i) => '<button data-od="' + i + '" aria-label="' + o.name + '" style="width:8px;height:8px;border-radius:50%;border:none;padding:0;cursor:pointer;background:' + (i === 0 ? '#a97f43' : 'rgba(60,48,30,0.22)') + ';transition:width .25s ease,border-radius .25s ease,background .25s ease"></button>').join('');
      officesEl.parentNode.insertBefore(dw, officesEl.nextSibling);
      const dots = Array.prototype.slice.call(dw.children);
      const items = Array.prototype.slice.call(officesEl.children);
      const activeIdx = () => { const mid = officesEl.scrollLeft + officesEl.clientWidth / 2; let best = 0, bd = Infinity; items.forEach((c, i) => { const cen = c.offsetLeft + c.offsetWidth / 2, d = Math.abs(cen - mid); if (d < bd) { bd = d; best = i; } }); return best; };
      const sync = () => { const a = activeIdx(); dots.forEach((d, i) => { const on = i === a; d.style.background = on ? '#a97f43' : 'rgba(60,48,30,0.22)'; d.style.width = on ? '20px' : '8px'; d.style.borderRadius = on ? '4px' : '50%'; }); };
      let oraf = 0;
      officesEl.addEventListener('scroll', () => { cancelAnimationFrame(oraf); oraf = requestAnimationFrame(sync); }, { passive: true });
      dots.forEach((d, i) => d.addEventListener('click', () => { const c = items[i]; officesEl.scrollTo({ left: c.offsetLeft - (officesEl.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' }); }));
      window.addEventListener('resize', sync);
      setTimeout(sync, 200);
    }
  }

  // feature strip — minimal gold-accent icon + title & description, with slim centered dividers
  const featEl = document.querySelector('.feat-grid');
  if (featEl) {
    featEl.innerHTML = features.map((f, i) => {
      const div = i > 0 ? 'background:linear-gradient(#e6e0d3,#e6e0d3) left center / 1px 54% no-repeat;' : '';
      return '<div style="display:flex;gap:13px;align-items:center;padding:2px clamp(14px,1.5vw,22px);' + div + '">'
        + '<div style="width:40px;height:40px;flex-shrink:0;border-radius:50%;background:#f4eee2;display:flex;align-items:center;justify-content:center;color:#a97f43"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + f.icon + '</svg></div>'
        + '<div style="min-width:0"><div style="font-family:\'Archivo\';font-weight:700;font-size:14px;letter-spacing:-0.01em;color:#161513;margin-bottom:4px">' + f.title + '</div>'
        + '<div style="font-size:12px;color:#948f85;line-height:1.45">' + f.sub + '</div></div>'
        + '</div>';
    }).join('');

    // mobile only: pagination dots for the feature swipe-carousel (hidden on desktop via inline display:none)
    if (!document.querySelector('.feat-dots')) {
      const dw = document.createElement('div');
      dw.className = 'feat-dots';
      dw.style.cssText = 'display:none;justify-content:center;gap:7px;margin-top:14px';
      dw.innerHTML = features.map((f, i) => '<button data-fd="' + i + '" aria-label="' + f.title + '" style="width:8px;height:8px;border-radius:50%;border:none;padding:0;cursor:pointer;background:' + (i === 0 ? '#a97f43' : 'rgba(60,48,30,0.22)') + ';transition:width .25s ease,border-radius .25s ease,background .25s ease"></button>').join('');
      featEl.parentNode.insertBefore(dw, featEl.nextSibling);
      const dots = Array.prototype.slice.call(dw.children);
      const items = Array.prototype.slice.call(featEl.children);
      const activeIdx = () => { const mid = featEl.scrollLeft + featEl.clientWidth / 2; let best = 0, bd = Infinity; items.forEach((c, i) => { const cen = c.offsetLeft + c.offsetWidth / 2, d = Math.abs(cen - mid); if (d < bd) { bd = d; best = i; } }); return best; };
      const sync = () => { const a = activeIdx(); dots.forEach((d, i) => { const on = i === a; d.style.background = on ? '#a97f43' : 'rgba(60,48,30,0.22)'; d.style.width = on ? '20px' : '8px'; d.style.borderRadius = on ? '4px' : '50%'; }); };
      let fraf = 0;
      featEl.addEventListener('scroll', () => { cancelAnimationFrame(fraf); fraf = requestAnimationFrame(sync); }, { passive: true });
      dots.forEach((d, i) => d.addEventListener('click', () => { const c = items[i]; featEl.scrollTo({ left: c.offsetLeft - (featEl.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' }); }));
      window.addEventListener('resize', sync);
      setTimeout(sync, 200);
    }
  }

  const footHref = { 'Careers': 'Careers/', 'About UTC': 'About/', 'Sitemap': 'Sitemap/', 'Privacy Statement': 'Privacy-Policy/' };
  el('footAbout').innerHTML = footAbout.map(l => '<a href="' + (footHref[l] || '#') + '" style="color:#8f8c85;font-size:14px">' + l + '</a>').join('');

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
  el('heroMuted').textContent = ('0' + heroImgs.length).slice(-2);  // total-slides counter, auto-matches heroImgs

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
      const inner = d.logo
        ? '<img loading="lazy" decoding="async" src="' + d.logo + '" alt="' + d.name + '" style="width:' + (d.tabW || '100px') + ';height:36px;object-fit:contain;filter:brightness(0) invert(1);display:block">'
        : '<span style="width:26px;height:26px;display:flex;align-items:center;justify-content:center">' + ic(d.icon) + '</span><span style="font-size:12px;font-weight:700;text-align:center;line-height:1.2">' + d.name + '</span>';
      return '<button data-dt="' + i + '" class="divtab' + (active ? ' active' : '') + '" style="cursor:pointer;background:' + (active ? '#262a2e' : 'transparent') + ';border:none;border-right:' + divider + ';color:' + (active ? '#ffffff' : '#b4b8bc') + ';padding:11px 14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;flex:1 1 0;min-width:118px;min-height:56px;border-radius:14px;position:relative;transition:background 250ms ease">' + inner + '</button>';
    }).join('');
  }
  el('divTabs').innerHTML = tabHtml();
  el('divTabs').querySelectorAll('button').forEach(b => b.onclick = () => setDiv(+b.dataset.dt));
  el('divPrev').onclick = () => setDiv((S.div - 1 + divData.length) % divData.length);
  el('divNext').onclick = () => setDiv((S.div + 1) % divData.length);
  // Swipe left/right on the divisions card to navigate (touch devices)
  (function () {
    const card = document.querySelector('#divPanel .divcard') || el('divPanel');
    if (!card) return;
    let x0 = 0, y0 = 0, t0 = 0, lx = 0, ly = 0;
    card.addEventListener('touchstart', e => { const t = e.changedTouches[0]; if (!t) return; x0 = lx = t.clientX; y0 = ly = t.clientY; t0 = Date.now(); }, { passive: true });
    card.addEventListener('touchmove', e => { const t = e.changedTouches[0]; if (t) { lx = t.clientX; ly = t.clientY; } }, { passive: true });
    card.addEventListener('touchend', e => {
      const t = e.changedTouches[0];
      const ex = t ? t.clientX : lx, ey = t ? t.clientY : ly;
      const dx = ex - x0, dy = ey - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - t0 < 700) {
        setDiv((S.div + (dx < 0 ? 1 : -1) + divData.length) % divData.length);
      }
    }, { passive: true });
  })();
  // Re-fit the description when crossing the mobile/desktop breakpoint
  window.addEventListener('resize', () => { const d = divData[S.div]; el('divDesc').innerHTML = d.descHtml || d.desc; clampDesc(); });

  // story photo layers (storefront + 2 extras) — built into the desktop frame and,
  // when present, the mobile frame so both show the same angled slideshow.
  const STORY_SRC = [{ id: 'story-storefront', src: 'img/story-storefront.webp' }, { id: 'story-x0', src: storyExtra[0] }, { id: 'story-x1', src: storyExtra[1] }];
  function buildStoryLayers(container) {
    const layers = [];
    STORY_SRC.forEach((o, i) => {
      const layer = document.createElement('div');
      layer.style.cssText = 'position:absolute;inset:0;opacity:' + (i === 0 ? 1 : 0) + ';transition:opacity 1.1s ease';
      layer.appendChild(slotEl(o.id, o.src, 'cover'));
      container.appendChild(layer);
      layers.push(layer);
    });
    return layers;
  }
  const storyLayers = buildStoryLayers(el('storyPhotos'));
  const storyPhotosMobileEl = document.getElementById('storyPhotosMobile');
  const storyLayersMobile = storyPhotosMobileEl ? buildStoryLayers(storyPhotosMobileEl) : [];

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
    if (!p.noAssets) layer.appendChild(slotEl('pimg-' + i, 'img/pimg-' + i + '.webp', 'cover'));  // no brand image yet -> clean dark panel
    el('partnerImages').appendChild(layer);
  });
  function renderPartnerCells() {
    const a = activePartner();
    let h = plist.map((p, i) => {
      const on = i === a;
      const bar = p.src
        ? '<div class="slot pbar" data-slot="pbar-' + i + '" data-fit="contain" data-src="' + p.src + '" style="height:clamp(26px,2.4vw,34px);width:100%;position:relative;filter:' + (on ? 'invert(1) brightness(2)' : 'none') + '"></div>'
        : '<div style="height:clamp(26px,2.4vw,34px);width:100%;display:flex;align-items:center;justify-content:center;filter:' + (on ? 'invert(1) brightness(2)' : 'none') + '"><span style="font-family:\'Archivo\',sans-serif;font-weight:800;font-size:clamp(13px,1.1vw,16px);color:#161513;white-space:nowrap">' + p.name + '</span></div>';
      return '<div data-pc="' + i + '" style="flex:1;min-width:0;padding:clamp(16px,1.8vw,26px) clamp(10px,1.5vw,22px);background:' + (on ? '#141414' : '#ffffff') + ';border-right:1px solid #ededed;cursor:pointer;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">'
        + '<span style="position:absolute;top:10px;left:14px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:' + (on ? '#7a7a7a' : '#b3afa6') + '">0' + (i + 1) + '</span>'
        + bar
        + '<span style="font-size:10px;letter-spacing:0.12em;font-weight:600;color:' + (on ? '#8a8a8a' : '#9a978f') + '">SINCE ' + p.since + '</span></div>';
    }).join('');
    h += '<div class="pc-more-cell" style="flex:0.8;min-width:0;padding:clamp(16px,1.8vw,26px) clamp(12px,1.6vw,24px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px"><span class="pc-more" style="font-size:11px;letter-spacing:0.14em;font-weight:700;color:#6d6a62;text-align:center;line-height:1.5">AND MORE<br>PARTNERS</span><span style="width:34px;height:1px;background:#c8c4ba"></span></div>';
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

  // Mobile milestones: horizontal swipe carousel with dots (desktop uses the 3D drum)
  (function () {
    const mob = el('msMobile'), dw = el('msDots');
    if (!mob || !dw) return;
    const N = mob.children.length;
    dw.innerHTML = milestones.map((m, i) =>
      '<button data-msdot="' + i + '" aria-label="' + m.year + '" title="' + m.year + '" style="width:8px;height:8px;border-radius:50%;border:none;padding:0;cursor:pointer;background:rgba(255,255,255,0.3);transition:width .25s ease,border-radius .25s ease,background .25s ease"></button>'
    ).join('');
    const dots = Array.prototype.slice.call(dw.children);
    const activeIdx = () => {
      const cs = mob.children, mid = mob.scrollLeft + mob.clientWidth / 2;
      let best = 0, bd = Infinity;
      for (let i = 0; i < cs.length; i++) { const c = cs[i], center = c.offsetLeft + c.offsetWidth / 2, d = Math.abs(center - mid); if (d < bd) { bd = d; best = i; } }
      return best;
    };
    const sync = () => { const a = activeIdx(); dots.forEach((d, i) => { const on = i === a; d.style.background = on ? '#fff' : 'rgba(255,255,255,0.3)'; d.style.width = on ? '22px' : '8px'; d.style.borderRadius = on ? '5px' : '50%'; }); };
    let raf = 0;
    mob.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
    dots.forEach((d, i) => d.addEventListener('click', () => { const c = mob.children[i]; mob.scrollTo({ left: c.offsetLeft - (mob.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' }); }));
    window.addEventListener('resize', sync);
    setTimeout(sync, 200);

    /* Auto-advance the mobile carousel through all milestones. The timer is CLEARED
       entirely whenever the carousel is off-screen or the tab is hidden (no work in
       the background), and briefly held after any manual swipe/tap so it never fights
       the user. On desktop the carousel is display:none (offsetParent === null), so
       this stays dormant and the 3D drum takes over. */
    const AUTO_MS = 3600, RESUME_MS = 5000;
    let autoTimer = 0, pausedUntil = 0, onScreen = false;
    const shown = () => mob.offsetParent !== null;               // true only in the mobile layout
    const goTo = i => { const c = mob.children[i]; if (c) mob.scrollTo({ left: c.offsetLeft - (mob.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' }); };
    const beat = () => { if (!onScreen || !shown() || Date.now() < pausedUntil) return; goTo((activeIdx() + 1) % N); };
    const startAuto = () => { if (!autoTimer && shown()) autoTimer = setInterval(beat, AUTO_MS); };
    const stopAuto = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = 0; } };
    const hold = () => { pausedUntil = Date.now() + RESUME_MS; };
    ['touchstart', 'pointerdown', 'wheel'].forEach(ev => mob.addEventListener(ev, hold, { passive: true }));
    dots.forEach(d => d.addEventListener('click', hold));
    const io = new IntersectionObserver(es => es.forEach(e => {
      onScreen = e.isIntersecting;
      if (onScreen) startAuto(); else stopAuto();
    }), { threshold: 0.2 });
    io.observe(mob);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAuto(); else if (onScreen) startAuto(); });
  })();

  /* ---------- hero controller ---------- */
  function setHero(i) {
    S.hero = ((i % heroImgs.length) + heroImgs.length) % heroImgs.length;
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
    el('heroFill').style.width = Math.round((S.hero + 1) / heroImgs.length * 100) + '%';
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
  // Mobile-only: clamp the division description to 3 lines, trimming at a word
  // boundary and stripping trailing punctuation so the ellipsis has no comma.
  function clampDesc() {
    const el = document.getElementById('divDesc');
    if (!el || window.innerWidth > 900) return;
    const full = (divData[S.div] && divData[S.div].desc) || el.textContent || '';
    el.textContent = full;
    const lh = parseFloat(getComputedStyle(el).lineHeight) || 22;
    const maxH = lh * 3 + 2;
    if (el.scrollHeight <= maxH) return;
    const words = full.split(/\s+/);
    const strip = s => s.replace(/[\s.,;:!?–—-]+$/, '');
    let lo = 1, hi = words.length, best = 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      el.textContent = strip(words.slice(0, mid).join(' ')) + '…';
      if (el.scrollHeight <= maxH) { best = mid; lo = mid + 1; } else { hi = mid - 1; }
    }
    el.textContent = strip(words.slice(0, best).join(' ')) + '…';
  }
  function setDiv(i) {
    S.div = ((i % divData.length) + divData.length) % divData.length;
    const d = divData[S.div];
    el('divTagline').textContent = d.tagline;
    el('divCounter').textContent = '0' + (S.div + 1);
    el('divIcon').innerHTML = ic(d.icon);
    if (d.cardLogo) {
      el('divName').innerHTML = '<img loading="lazy" decoding="async" src="' + d.cardLogo + '" alt="' + d.name + '" style="height:' + (d.cardLogoH || 'clamp(32px,4vw,50px)') + ';width:auto;max-width:100%;object-fit:contain;object-position:left top;display:block' + (d.cardLogoDark ? ';filter:brightness(0)' : '') + '">';
    } else {
      el('divName').textContent = d.name;
    }
    el('divDesc').innerHTML = d.descHtml || d.desc;
    clampDesc();
    el('divMgr').textContent = d.mgr;
    el('divContact').textContent = d.contact;
    var vm = el('divMore');
    if (vm) {
      if (d.soon) {
        vm.textContent = 'Coming soon';
        vm.removeAttribute('href');
        vm.style.color = '#a7a39a'; vm.style.borderColor = '#d8d3c7'; vm.style.background = 'transparent'; vm.style.cursor = 'default'; vm.style.pointerEvents = 'none';
      } else {
        vm.textContent = 'View More';
        vm.setAttribute('href', d.href || '#contact');
        vm.style.color = '#161513'; vm.style.borderColor = '#161513'; vm.style.background = ''; vm.style.cursor = ''; vm.style.pointerEvents = '';
      }
    }
    // featured brands
    const featLabel = el('divBrandsLabel');
    if (d.brandsSoon) {
      if (featLabel) featLabel.style.display = '';
      el('divBrands').innerHTML = '<div style="border:1px solid #d8d3c7;background:#fff;height:48px;min-width:120px;display:flex;align-items:center;justify-content:center;padding:0 22px;border-radius:12px"><span style="font-family:\'Archivo\';font-weight:600;font-size:13px;color:#a7a39a">Coming soon</span></div>';
    } else {
    const raw = d.brands || [];
    const named = raw.filter(n => !/^\+/.test(n));
    const moreEntry = raw.find(n => /^\+/.test(n));
    const moreNum = moreEntry ? (parseInt(moreEntry.replace(/\D/g, ''), 10) || 0) : 0;
    const shown = named.slice(0, 2);
    const moreTotal = (named.length - shown.length) + moreNum;
    if (featLabel) featLabel.style.display = named.length ? '' : 'none';
    let bh = shown.map(name => {
      const src = logoFor(name);
      if (src) return '<div style="background:#0d0d0d;height:48px;width:126px;display:flex;align-items:center;justify-content:center;padding:0 20px;border-radius:12px"><div role="img" aria-label="' + name + '" style="width:100%;height:26px;filter:brightness(0) invert(1);background-image:url(&quot;' + src + '&quot;);background-size:contain;background-repeat:no-repeat;background-position:center"></div></div>';
      return '<div style="background:#0d0d0d;height:48px;min-width:78px;display:flex;align-items:center;justify-content:center;padding:0 22px;border-radius:12px"><span style="font-family:\'Archivo\';font-weight:700;font-size:13px;color:#fff">' + name + '</span></div>';
    }).join('');
    if (moreTotal > 0) bh += '<div style="border:1px solid #cfd1d4;background:#fff;height:48px;min-width:72px;display:flex;align-items:center;justify-content:center;padding:0 18px;border-radius:12px"><span style="font-family:\'Archivo\';font-weight:700;font-size:13px;color:#57544c">+' + moreTotal + ' more</span></div>';
    el('divBrands').innerHTML = bh;
    }
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
    storyLayersMobile.forEach((l, i) => l.style.opacity = i === active ? 1 : 0);
  }, 4000);

  /* ---------- partners controller ---------- */
  function activePartner() { const n = plist.length; return ((S.partner % n) + n) % n; }
  function setPartner(i) {
    S.partner = i;
    const a = activePartner();
    const p = plist[a];
    if (p.src) { fillSlot(el('partnerLogo'), 'plogo-' + a, p.src, 'contain'); }
    else { el('partnerLogo').innerHTML = '<span style="font-family:\'Archivo\',sans-serif;font-weight:800;font-size:clamp(24px,2.4vw,34px);letter-spacing:.01em;color:#161513;white-space:nowrap">' + p.name + '</span>'; }
    el('partnerLogo').style.width = '100%';
    el('partnerQuote').textContent = p.quote;
    // "View more" appears only when the quote is actually clamped/overflowing
    var _more = el('partnerMore');
    if (_more) requestAnimationFrame(function () { var q = el('partnerQuote'); _more.style.display = (q.scrollHeight - q.clientHeight > 2) ? 'inline-flex' : 'none'; });
    var _avWrap = el('partnerAvatar').parentElement;
    if (p.noAssets) { if (_avWrap) _avWrap.style.display = 'none'; }
    else { if (_avWrap) _avWrap.style.display = ''; fillSlot(el('partnerAvatar'), 'pavatar-' + a, 'img/pavatar-' + a + '.webp', 'cover'); }
    el('partnerPerson').textContent = p.person;
    el('partnerRole').textContent = p.role;
    el('partnerYears').textContent = p.years;
    el('partnerSince').textContent = p.since;
    Array.from(el('partnerImages').children).forEach((l, i) => { l.style.opacity = i === a ? 1 : 0; l.style.zIndex = i === a ? 2 : 1; });
    renderPartnerStatic();
    renderPartnerCells();
  }
  let partnerTimer = setInterval(() => setPartner(S.partner + 1), 6000);

  // full-testimonial popup (opened by the card's "View more")
  function fillPartnerModal() {
    const p = plist[activePartner()];
    const lg = el('pmLogo'), nm = el('pmName');
    if (lg && nm) {
      if (p.src) { nm.style.display = 'none'; lg.style.display = ''; lg.innerHTML = ''; fillSlot(lg, 'pmlogo', p.src, 'contain'); }
      else { lg.style.display = 'none'; nm.style.display = ''; nm.textContent = p.name; }
    }
    if (el('pmQuote')) el('pmQuote').textContent = p.quote;
    if (el('pmPerson')) el('pmPerson').textContent = p.person;
    if (el('pmRole')) el('pmRole').textContent = p.role;
    if (el('pmYears')) el('pmYears').textContent = p.years;
  }
  function openPartnerModal() { const m = el('partnerModal'); if (!m) return; fillPartnerModal(); m.classList.add('open'); clearInterval(partnerTimer); }
  function closePartnerModal() { const m = el('partnerModal'); if (!m) return; m.classList.remove('open'); clearInterval(partnerTimer); partnerTimer = setInterval(() => setPartner(S.partner + 1), 6000); }
  if (el('partnerMore')) el('partnerMore').addEventListener('click', openPartnerModal);
  if (el('partnerModal')) el('partnerModal').addEventListener('click', (e) => { if (e.target.closest('[data-pmclose]')) closePartnerModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePartnerModal(); });

  /* ---------- contact form ---------- */
  // Static site: route the message via mailto. The "I want to…" dropdown decides
  // the recipient — Partnerships and General Inquiry go to two different inboxes
  // (each <option> carries its target address in data-mail).
  // Partnership selection reveals extra fields (type, organisation, other info)
  // and auto-fills the Subject with "Partnership Inquiry".
  const cfIntent = el('cfIntent'), cfPart = el('cfPartnership');
  function syncPartnership() {
    const on = cfIntent && cfIntent.value === 'partnership';
    if (cfPart) cfPart.style.display = on ? 'block' : 'none';
    const subj = el('cfSubject');
    if (subj) {
      if (on) { if (!subj.value.trim()) subj.value = 'Partnership Inquiry'; }
      else if (subj.value.trim() === 'Partnership Inquiry') { subj.value = ''; }
    }
  }
  if (cfIntent) { cfIntent.addEventListener('change', syncPartnership); syncPartnership(); }

  // Preselect "Partnership Opportunity" (and optionally a division) — used by the
  // inner-page "Partner with us" CTAs and the homepage partner button.
  function preselectPartnership(division) {
    if (cfIntent) { cfIntent.value = 'partnership'; syncPartnership(); }
    const dv = el('cfDivision');
    if (dv && division) dv.value = division;
  }
  // Deep-link from other pages: index.html?intent=partnership&division=<slug>#contact
  (function () {
    const p = new URLSearchParams(location.search || '');
    const intent = p.get('intent'), division = p.get('division');
    if (intent === 'partnership' || division) {
      preselectPartnership(division || '');
      // scroll to the form itself (not the section top) so the preselected dropdowns are visible.
      // Recompute the absolute position each time — images above load late and shift the layout.
      const target = el('contactForm') || el('contact');
      if (target) {
        const doScroll = function () {
          const y = target.getBoundingClientRect().top + window.pageYOffset - 90; // clear sticky header
          window.scrollTo({ top: y, behavior: 'smooth' });
        };
        setTimeout(doScroll, 200);
        window.addEventListener('load', function () { setTimeout(doScroll, 200); });
      }
    }
  })();
  // Homepage's own "Want to partner with us?" button — preselect without a reload
  const homePartnerBtn = document.querySelector('a.h-shop[href="#contact"]');
  if (homePartnerBtn) homePartnerBtn.addEventListener('click', function () { preselectPartnership(''); });

  // Paste your free Web3Forms access key here to have the WEBSITE send submissions
  // straight to your inbox (get one in 30s at https://web3forms.com — enter your email,
  // they mail you a key). While this is empty, the form falls back to opening the
  // visitor's email app (mailto) so nothing breaks.
  const WEB3FORMS_KEY = '';

  // ── Contact-form routing ─────────────────────────────────────────────────
  // All enquiries are SENT FROM one central mailbox (the EmailJS-connected account),
  // and delivered TO the inbox chosen by the enquiry type — and, for partnerships,
  // by the selected division. Fill in the real division-head addresses below.
  const MAIL_ROUTES = {
    general: 'info@utc.com.kw',                 // General Inquiry
    support: 'unionservices@utc.com.kw',        // Product Support → Union Services division
    // Partnership Opportunity → the head of the selected division:
    divisions: {
      'union-electronics': 'electronics@utc.com.kw',   // TODO: real inbox
      'aluna':             'aluna@utc.com.kw',          // TODO: real inbox
      'fmcg':              'fmcg@utc.com.kw',           // TODO: real inbox
      'labels':            'labels@utc.com.kw',         // TODO: real inbox
      'union-services':    'unionservices@utc.com.kw',  // TODO: real inbox
      'commercial':        'commercial@utc.com.kw'      // TODO: real inbox
    },
    fallback: 'info@utc.com.kw'                 // partnership with no division picked, etc.
  };
  function routeTo(intent, divisionKey) {
    if (intent === 'partnership') return MAIL_ROUTES.divisions[divisionKey] || MAIL_ROUTES.fallback;
    if (intent === 'support') return MAIL_ROUTES.support;
    return MAIL_ROUTES[intent] || MAIL_ROUTES.fallback;
  }

  // EmailJS — client-side email that works on ANY hosting (GitHub Pages, a cloud
  // server, anywhere): the visitor's browser sends the enquiry through YOUR connected
  // mailbox. Fill the 3 IDs from the EmailJS dashboard (emailjs.com → Account) to turn
  // it on; while any is blank the form uses the Web3Forms/mailto path below, so nothing
  // breaks. Per-option routing already works — the dropdown's data-mail is used as the
  // recipient (`to_email`), so you can point each enquiry type at a different UTC inbox.
  // Remember to add this site's domain under EmailJS → Account → Security → Allowed origins.
  const EMAILJS = { publicKey: '', serviceId: '', templateId: '' };
  let _emailjsReady = null;
  function ensureEmailJS() {
    if (_emailjsReady) return _emailjsReady;
    _emailjsReady = new Promise((res, rej) => {
      if (window.emailjs) { try { emailjs.init({ publicKey: EMAILJS.publicKey }); } catch (e) {} return res(); }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      s.onload = () => { try { emailjs.init({ publicKey: EMAILJS.publicKey }); } catch (e) {} res(); };
      s.onerror = rej;
      document.head.appendChild(s);
    });
    return _emailjsReady;
  }

  el('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const sel = el('cfIntent');
    const opt = sel.options[sel.selectedIndex];
    const divKey = el('cfDivision') ? el('cfDivision').value : '';
    const to = routeTo(sel.value, divKey);   // central send → routed by enquiry type / division
    const name = (el('cfName').value || '').trim();
    const email = (el('cfEmail').value || '').trim();
    const phone = (el('cfPhone').value || '').trim();
    const subjIn = (el('cfSubject').value || '').trim();
    const msg = (el('cfMessage').value || '').trim();
    const isPartner = sel.value === 'partnership';
    const subject = (subjIn || (opt ? opt.text : 'Website enquiry')) + (name ? ' — ' + name : '');
    let division = '', partType = '', org = '', other = '';
    const lines = [
      'Enquiry type: ' + (opt ? opt.text : ''),
      'Name: ' + name,
      'Email: ' + email,
      'Phone: ' + phone
    ];
    if (isPartner) {
      const dvSel = el('cfDivision');
      division = dvSel && dvSel.value ? ((dvSel.options[dvSel.selectedIndex] || {}).text || '') : '';
      partType = el('cfPartType') ? el('cfPartType').value : '';
      org = el('cfOrg') ? (el('cfOrg').value || '').trim() : '';
      other = el('cfOther') ? (el('cfOther').value || '').trim() : '';
      if (division) lines.push('Division: ' + division);
      lines.push('Partnership type: ' + partType);
      lines.push('Organisation: ' + org);
      lines.push('Other information: ' + other);
    }
    lines.push('', msg);

    const btn = el('submitBtn');
    const setBtn = t => { btn.childNodes[0].nodeValue = t; };
    const openMail = label => {
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      setBtn(label || 'OPENING EMAIL… ');
      setTimeout(() => setBtn('SEND MESSAGE'), 4000);
    };

    // Preferred: EmailJS (client-side; works on static or cloud hosting). Sends the
    // enquiry through your connected mailbox, routed to the selected option's inbox.
    if (EMAILJS.publicKey && EMAILJS.serviceId && EMAILJS.templateId) {
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setBtn('CHECK YOUR EMAIL '); setTimeout(() => setBtn('SEND MESSAGE'), 3000); return; }
      btn.disabled = true; setBtn('SENDING… ');
      ensureEmailJS()
        .then(() => emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
          to_email: to, subject: subject, from_name: name || 'Website visitor', reply_to: email,
          name: name, email: email, phone: phone,
          enquiry_type: opt ? opt.text : '',
          division: division, partnership_type: partType, organisation: org, other_information: other,
          message: lines.join('\n')
        }))
        .then(() => {
          setBtn('MESSAGE SENT ✓ ');
          el('contactForm').reset(); syncPartnership();
          showFormModal();                                     // "your request has been submitted" popup
          setTimeout(() => { setBtn('SEND MESSAGE'); btn.disabled = false; }, 5000);
        })
        .catch(() => { btn.disabled = false; openMail('OPENING EMAIL… '); }); // fallback so the enquiry isn't lost
      return;
    }

    // No form service configured yet → open the visitor's email app.
    if (!WEB3FORMS_KEY) { openMail(); return; }

    // Basic validation before a real send.
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setBtn('CHECK YOUR EMAIL '); setTimeout(() => setBtn('SEND MESSAGE'), 3000); return; }

    // Send through the website (no page reload; lands in the inbox tied to the key).
    btn.disabled = true; setBtn('SENDING… ');
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: subject,
        from_name: name || 'Website visitor',
        name: name, email: email, phone: phone,
        enquiry_type: opt ? opt.text : '',
        division: division, partnership_type: partType, organisation: org, other_information: other,
        message: lines.join('\n'),
        botcheck: ''
      })
    })
      .then(r => r.json())
      .then(d => {
        if (d && d.success) {
          setBtn('MESSAGE SENT ✓ ');
          el('contactForm').reset(); syncPartnership();
          showFormModal();                                     // "your request has been submitted" popup
          setTimeout(() => { setBtn('SEND MESSAGE'); btn.disabled = false; }, 5000);
        } else { throw new Error('service'); }
      })
      .catch(() => { btn.disabled = false; openMail('OPENING EMAIL… '); }); // fallback so the enquiry isn't lost
  });

  // Contact "request submitted" popup — shown after the website sends the enquiry.
  function showFormModal() { var m = el('formModal'); if (m) m.classList.add('open'); }
  (function () {
    var m = document.getElementById('formModal'); if (!m) return;
    var close = function () { m.classList.remove('open'); };
    m.addEventListener('click', function (e) { if (e.target.closest('[data-fm]')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  })();

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
    const headerEl = document.querySelector('header');
    let engaged = false, lastWheel = 0;
    const SENS = 520;
    const onWheel = e => {
      const rect = sec.getBoundingClientRect(), vh = window.innerHeight;
      const hdr = headerEl ? headerEl.offsetHeight : 74;
      // take over the wheel only once the section is snapped fully into place (its top resting at the
      // sticky header). scroll-snap-stop:always lands it there without overshoot, so the barrel never
      // fights the snap. Any partial/half-scrolled state -> the page scrolls (and snaps) normally.
      const cap = Math.max(10, vh * 0.03);
      const near = rect.top >= -cap && rect.top <= hdr + cap;
      const dir = e.deltaY > 0 ? 1 : -1;
      const atEnd = (dir > 0 && prog >= N - 1 - 0.001) || (dir < 0 && prog <= 0.001);
      if (!near || atEnd) { engaged = false; return; }
      e.preventDefault();
      engaged = true;
      prog = Math.max(0, Math.min(N - 1, prog + e.deltaY / SENS));
      target = prog; lastWheel = Date.now(); kick();
    };
    if (vp) vp.addEventListener('wheel', onWheel, { passive: false });
    if (prevBtn) prevBtn.onclick = () => go(Math.round(prog) - 1);
    if (nextBtn) nextBtn.onclick = () => go(Math.round(prog) + 1);
    window.addEventListener('resize', () => { measure(); render(cur); });
    /* Auto-advance the drum, but only in the desktop layout AND while the section is
       actually on-screen. The timer is cleared entirely off-screen / when the tab is
       hidden / on mobile (where the swipe carousel takes over), so nothing animates in
       the background. */
    let drumTimer = 0, drumOn = false;
    const drumBeat = () => {
      if (window.innerWidth <= 900) return;
      const rect = sec.getBoundingClientRect(), vh = window.innerHeight;
      const covers = rect.top <= vh * 0.5 && rect.bottom >= vh * 0.5;
      if (covers && Date.now() - lastWheel > 3200) go((Math.round(prog) + 1) % N);
    };
    const startDrum = () => { if (!drumTimer && window.innerWidth > 900) drumTimer = setInterval(drumBeat, 3400); };
    const stopDrum = () => { if (drumTimer) { clearInterval(drumTimer); drumTimer = 0; } };
    const drumIO = new IntersectionObserver(es => es.forEach(e => {
      drumOn = e.isIntersecting && e.intersectionRatio >= 0.45;
      if (drumOn) startDrum(); else stopDrum();
    }), { threshold: [0, 0.45, 1] });
    drumIO.observe(sec);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopDrum(); else if (drumOn) startDrum(); });
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
